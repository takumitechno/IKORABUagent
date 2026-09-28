import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalJson } from "../../web/lib/catfood-harness";
import {
  sealedInputManifestSha256,
  validateSealedInputManifest,
  type CatfoodSealedInputManifestV1,
} from "../../web/lib/catfood-final-closure";
import {
  verifyExpectedEvaluationTargetEnvelope,
  verifyRoleActionReceiptV2,
  type AuthorityEvaluationJob,
  type RoleActionReceiptV2,
  type RoleChannelBinding,
  type RoleRunScope,
} from "../../web/lib/catfood-role-channel";

const ZERO = "0".repeat(64);
const SHA256 = /^[0-9a-f]{64}$/;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,255}$/;
const CONTROLLER_SCHEMA = "pre-custody-control.v1";
const WITNESS_SCHEMA = "pre-custody-continuity-witness.v1";

const hash = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
const json = (value: unknown) => canonicalJson(value as never);

export class CustodyControlError extends Error {
  constructor(readonly code: string) { super(code); }
}

export interface CanonicalRunKey {
  readonly environment_type: string;
  readonly deployment_id: string;
  readonly organization_id: string;
  readonly tenant_id: string;
  readonly account_id: string;
  readonly run_id: string;
}

export interface RunBinding {
  readonly key: CanonicalRunKey;
  readonly environment_instance_id: string;
  readonly spec_sha256: string;
  readonly window_sha256: string;
  readonly go_artifact_sha256: string;
  readonly go_policy_ref_sha256: string;
  readonly authority_incarnation: string;
  readonly control_store_id: string;
  readonly checkpoint_store_id: string;
  readonly store_pair_lineage_sha256: string;
  readonly producer_generation: number;
  readonly initial_control_head_sha256: string;
  readonly initial_checkpoint_head_sha256: string;
  readonly test_only: true;
}

export interface CustodianSubject {
  readonly process_id: string;
  readonly launch_id: string;
  readonly session_id: string;
  readonly host_incarnation: string;
  readonly build_sha256: string;
}

export interface FenceProof {
  readonly old_process_cannot_execute: true;
  readonly old_credentials_revoked: true;
  readonly producer_effects_resolved: true;
  readonly complete_history_verified: true;
  readonly control_head_sha256: string;
  readonly checkpoint_head_sha256: string;
}

export interface WitnessRecord {
  readonly schema: typeof WITNESS_SCHEMA;
  readonly operation_id: string;
  readonly key_sha256: string;
  readonly sequence: number;
  readonly previous_digest: string;
  readonly transition: string;
  readonly payload_sha256: string;
  readonly record_digest: string;
}

export interface WitnessAcknowledgment {
  readonly record: WitnessRecord;
  readonly acknowledged_at: string;
}

export interface ContinuityWitness {
  append(record: WitnessRecord): WitnessAcknowledgment;
  readOperation(operationId: string): WitnessAcknowledgment | null;
  current(keySha256: string): WitnessAcknowledgment | null;
}

export interface CustodyControlMetric {
  readonly name: "witness.append" | "guarded.effect";
  readonly operation_id: string;
  readonly key_sha256: string;
  readonly operation_kind: string;
  readonly outcome: "SUCCEEDED" | "BLOCKED" | "UNRESOLVED";
  readonly elapsed_ms: number;
  readonly observed_wall_time_ms: number;
  readonly monotonic_ms: number;
}

export type CustodyControlInstrumentation = (metric: CustodyControlMetric) => void;

const WITNESS_SQL = `
CREATE TABLE witness_meta(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schema TEXT NOT NULL,test_only INTEGER NOT NULL CHECK(test_only=1)) STRICT;
CREATE TABLE witness_records(operation_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL,sequence INTEGER NOT NULL CHECK(sequence>0),previous_digest TEXT NOT NULL,transition TEXT NOT NULL,payload_sha256 TEXT NOT NULL,record_json TEXT NOT NULL CHECK(json_valid(record_json)),record_digest TEXT NOT NULL UNIQUE,acknowledged_at TEXT NOT NULL,UNIQUE(key_sha256,sequence)) STRICT;
`;

export function initializeTestOnlyContinuityWitness(path: string): void {
  if (!existsSync(resolve(path))) throw new CustodyControlError("WITNESS_STORE_MUST_PREEXIST");
  const db = new Database(resolve(path), { strict: true, create: false });
  try {
    if ((db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get()?.n ?? 0) !== 0) throw new CustodyControlError("WITNESS_STORE_NOT_EMPTY");
    db.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;");
    db.exec(WITNESS_SQL);
    db.query("INSERT INTO witness_meta VALUES(1,?,1)").run(WITNESS_SCHEMA);
  } finally { db.close(); }
}

export class TestOnlySqliteContinuityWitness implements ContinuityWitness {
  private readonly db: Database;
  private failure: "NONE" | "BEFORE_COMMIT" | "AFTER_COMMIT" = "NONE";

  constructor(path: string) {
    this.db = new Database(resolve(path), { strict: true, create: false });
    this.db.exec("PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;");
    const meta = this.db.query<{ schema: string; test_only: number }, []>("SELECT schema,test_only FROM witness_meta WHERE singleton=1").get();
    if (!meta || meta.schema !== WITNESS_SCHEMA || meta.test_only !== 1) { this.db.close(); throw new CustodyControlError("WITNESS_STORE_INVALID"); }
  }

  close(): void { this.db.close(); }
  setFailureForTest(mode: "NONE" | "BEFORE_COMMIT" | "AFTER_COMMIT"): void { this.failure = mode; }

  append(record: WitnessRecord): WitnessAcknowledgment {
    validateWitnessRecord(record);
    const existing = this.readOperation(record.operation_id);
    if (existing) {
      if (json(existing.record) !== json(record)) throw new CustodyControlError("WITNESS_OPERATION_CONFLICT");
      return existing;
    }
    if (this.failure === "BEFORE_COMMIT") throw new CustodyControlError("WITNESS_UNAVAILABLE");
    const current = this.current(record.key_sha256);
    if (record.sequence !== (current?.record.sequence ?? 0) + 1 || record.previous_digest !== (current?.record.record_digest ?? ZERO)) throw new CustodyControlError("WITNESS_PREDECESSOR_CONFLICT");
    const ack: WitnessAcknowledgment = { record, acknowledged_at: new Date().toISOString() };
    this.db.query("INSERT INTO witness_records VALUES(?,?,?,?,?,?,?,?,?)").run(record.operation_id, record.key_sha256, record.sequence, record.previous_digest, record.transition, record.payload_sha256, json(record), record.record_digest, ack.acknowledged_at);
    if (this.failure === "AFTER_COMMIT") throw new CustodyControlError("WITNESS_RESPONSE_LOST");
    return ack;
  }

  readOperation(operationId: string): WitnessAcknowledgment | null {
    const row = this.db.query<{ record_json: string; acknowledged_at: string }, [string]>("SELECT record_json,acknowledged_at FROM witness_records WHERE operation_id=?").get(operationId);
    return row ? { record: JSON.parse(row.record_json), acknowledged_at: row.acknowledged_at } : null;
  }

  current(keySha256: string): WitnessAcknowledgment | null {
    const row = this.db.query<{ record_json: string; acknowledged_at: string }, [string]>("SELECT record_json,acknowledged_at FROM witness_records WHERE key_sha256=? ORDER BY sequence DESC LIMIT 1").get(keySha256);
    return row ? { record: JSON.parse(row.record_json), acknowledged_at: row.acknowledged_at } : null;
  }
}

function validateWitnessRecord(record: WitnessRecord): void {
  const unsigned = { schema: record.schema, operation_id: record.operation_id, key_sha256: record.key_sha256, sequence: record.sequence, previous_digest: record.previous_digest, transition: record.transition, payload_sha256: record.payload_sha256 };
  if (record.schema !== WITNESS_SCHEMA || !TOKEN.test(record.operation_id) || !SHA256.test(record.key_sha256) || !Number.isSafeInteger(record.sequence) || record.sequence < 1 || !SHA256.test(record.previous_digest) || !TOKEN.test(record.transition) || !SHA256.test(record.payload_sha256) || record.record_digest !== hash(json(unsigned))) throw new CustodyControlError("WITNESS_RECORD_INVALID");
}

const CONTROLLER_SQL = `
CREATE TABLE controller_meta(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schema TEXT NOT NULL,controller_id TEXT NOT NULL UNIQUE,test_only INTEGER NOT NULL CHECK(test_only=1)) STRICT;
CREATE TABLE governed_runs(key_sha256 TEXT PRIMARY KEY,key_json TEXT NOT NULL CHECK(json_valid(key_json)),binding_json TEXT NOT NULL CHECK(json_valid(binding_json)),state TEXT NOT NULL CHECK(state IN('RESERVING','RESERVED','ACTIVE','FENCING','RECOVERY_REQUIRED','CLOSED','INCIDENT','ENDED')),revision INTEGER NOT NULL CHECK(revision>=0),witness_digest TEXT NOT NULL,owner_json TEXT CHECK(owner_json IS NULL OR json_valid(owner_json)),lease_expires_ms INTEGER,control_head_sha256 TEXT NOT NULL,checkpoint_head_sha256 TEXT NOT NULL,canonical_manifest_sha256 TEXT,canonical_manifest_json TEXT CHECK(canonical_manifest_json IS NULL OR json_valid(canonical_manifest_json)),created_at TEXT NOT NULL,updated_at TEXT NOT NULL) STRICT;
CREATE TABLE controller_operations(operation_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),kind TEXT NOT NULL,input_sha256 TEXT NOT NULL,input_json TEXT NOT NULL CHECK(json_valid(input_json)),sequence INTEGER NOT NULL,previous_digest TEXT NOT NULL,witness_record_json TEXT NOT NULL CHECK(json_valid(witness_record_json)),status TEXT NOT NULL CHECK(status IN('PENDING','ACKNOWLEDGED','APPLIED','UNRESOLVED')),result_json TEXT CHECK(result_json IS NULL OR json_valid(result_json)),created_at TEXT NOT NULL,UNIQUE(key_sha256,sequence)) STRICT;
CREATE TABLE custody_incidents(incident_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),kind TEXT NOT NULL,variant_sha256 TEXT NOT NULL,raw_json TEXT NOT NULL CHECK(json_valid(raw_json)),created_at TEXT NOT NULL,UNIQUE(key_sha256,variant_sha256)) STRICT;
CREATE TABLE authorized_jobs(evaluation_job_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),manifest_sha256 TEXT NOT NULL,job_sha256 TEXT NOT NULL,result_json TEXT NOT NULL CHECK(json_valid(result_json)),operation_id TEXT NOT NULL UNIQUE REFERENCES controller_operations(operation_id)) STRICT;
CREATE TABLE authorized_targets(target_sha256 TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),evaluation_job_id TEXT NOT NULL REFERENCES authorized_jobs(evaluation_job_id),target_envelope TEXT NOT NULL,state TEXT NOT NULL CHECK(state IN('CURRENT','REVOKED')),operation_id TEXT NOT NULL UNIQUE REFERENCES controller_operations(operation_id)) STRICT;
`;

export function initializeCustodyController(path: string, controllerId: string): void {
  if (!existsSync(resolve(path))) throw new CustodyControlError("CONTROLLER_STORE_MUST_PREEXIST");
  if (!TOKEN.test(controllerId)) throw new CustodyControlError("CONTROLLER_ID_INVALID");
  const db = new Database(resolve(path), { strict: true, create: false });
  try {
    if ((db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get()?.n ?? 0) !== 0) throw new CustodyControlError("CONTROLLER_STORE_NOT_EMPTY");
    db.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;");
    db.exec(CONTROLLER_SQL);
    db.query("INSERT INTO controller_meta VALUES(1,?,?,1)").run(CONTROLLER_SCHEMA, controllerId);
  } finally { db.close(); }
}

type RunRow = {
  key_sha256: string; key_json: string; binding_json: string; state: string; revision: number; witness_digest: string;
  owner_json: string | null; lease_expires_ms: number | null; control_head_sha256: string; checkpoint_head_sha256: string;
  canonical_manifest_sha256: string | null; canonical_manifest_json: string | null;
};

type OperationRow = { operation_id: string; key_sha256: string; kind: string; input_json: string; sequence: number; previous_digest: string; witness_record_json: string; status: string; result_json: string | null };

export class CustodyController {
  private readonly db: Database;

  constructor(path: string, private readonly witness: ContinuityWitness, private readonly instrumentation: CustodyControlInstrumentation = () => {}) {
    this.db = new Database(resolve(path), { strict: true, create: false });
    this.db.exec("PRAGMA foreign_keys=ON; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;");
    const meta = this.db.query<{ schema: string; test_only: number }, []>("SELECT schema,test_only FROM controller_meta WHERE singleton=1").get();
    if (!meta || meta.schema !== CONTROLLER_SCHEMA || meta.test_only !== 1) { this.db.close(); throw new CustodyControlError("CONTROLLER_STORE_INVALID"); }
  }

  close(): void { this.db.close(); }

  reserveRun(binding: RunBinding, operationId: string): Readonly<Record<string, unknown>> {
    validateBinding(binding);
    const keySha = canonicalKeySha256(binding.key), bindingJson = json(binding), now = new Date().toISOString();
    const current = this.run(keySha);
    if (current) {
      if (current.binding_json !== bindingJson) throw new CustodyControlError("RUN_BINDING_CONFLICT");
      return this.finishTransition(operationId, keySha);
    }
    this.db.transaction(() => {
      if (this.run(keySha)) throw new CustodyControlError("RUN_ALREADY_RESERVED");
      this.db.query("INSERT INTO governed_runs VALUES(?,?,?,?,0,?,NULL,NULL,?,?,NULL,NULL,?,?)").run(keySha, json(binding.key), bindingJson, "RESERVING", ZERO, binding.initial_control_head_sha256, binding.initial_checkpoint_head_sha256, now, now);
      this.prepareOperation(operationId, keySha, "RESERVE", { binding });
    }).immediate();
    return this.finishTransition(operationId, keySha);
  }

  admitCustodian(key: CanonicalRunKey, subject: CustodianSubject, leaseExpiresMs: number, operationId: string): Readonly<Record<string, unknown>> {
    validateSubject(subject);
    if (!Number.isSafeInteger(leaseExpiresMs) || leaseExpiresMs <= Date.now()) throw new CustodyControlError("LEASE_INVALID");
    const keySha = canonicalKeySha256(key), row = this.requireRun(keySha);
    this.assertNoPending(row);
    if (row.state === "ACTIVE") {
      if (row.owner_json === json(subject)) return this.state(key);
      throw new CustodyControlError("CUSTODIAN_ALREADY_ACTIVE");
    }
    if (row.state !== "RESERVED") throw new CustodyControlError("POSITIVE_ADMISSION_BLOCKED");
    this.prepareOperation(operationId, keySha, "ADMIT", { subject, lease_expires_ms: leaseExpiresMs });
    return this.finishTransition(operationId, keySha);
  }

  checkpoint(key: CanonicalRunKey, subject: CustodianSubject, controlHead: string, checkpointHead: string, leaseExpiresMs: number, operationId: string): Readonly<Record<string, unknown>> {
    validateSubject(subject); requireSha(controlHead); requireSha(checkpointHead);
    const keySha = canonicalKeySha256(key), row = this.requireActiveOwner(keySha, subject);
    this.assertNoPending(row); this.assertWitnessCurrent(row);
    if (!Number.isSafeInteger(leaseExpiresMs) || leaseExpiresMs <= Date.now()) throw new CustodyControlError("LEASE_INVALID");
    this.prepareOperation(operationId, keySha, "CHECKPOINT", { subject, control_head_sha256: controlHead, checkpoint_head_sha256: checkpointHead, lease_expires_ms: leaseExpiresMs });
    return this.finishTransition(operationId, keySha);
  }

  markLeaseLost(key: CanonicalRunKey, subject: CustodianSubject, operationId: string): Readonly<Record<string, unknown>> {
    const keySha = canonicalKeySha256(key), row = this.requireActiveOwner(keySha, subject);
    this.assertNoPending(row);
    this.prepareOperation(operationId, keySha, "LEASE_LOST", { subject });
    return this.finishTransition(operationId, keySha);
  }

  replaceCustodian(key: CanonicalRunKey, subject: CustodianSubject, proof: FenceProof, leaseExpiresMs: number, operationId: string): Readonly<Record<string, unknown>> {
    validateSubject(subject); requireFenceProof(proof);
    const keySha = canonicalKeySha256(key), row = this.requireRun(keySha);
    this.assertNoPending(row); this.assertWitnessCurrent(row);
    if (!["FENCING", "RECOVERY_REQUIRED"].includes(row.state) || proof.control_head_sha256 !== row.control_head_sha256 || proof.checkpoint_head_sha256 !== row.checkpoint_head_sha256 || !Number.isSafeInteger(leaseExpiresMs) || leaseExpiresMs <= Date.now()) throw new CustodyControlError("REPLACEMENT_NOT_PROVEN");
    this.prepareOperation(operationId, keySha, "REPLACE", { subject, proof, lease_expires_ms: leaseExpiresMs });
    return this.finishTransition(operationId, keySha);
  }

  closeManifest(key: CanonicalRunKey, subject: CustodianSubject, manifestInput: CatfoodSealedInputManifestV1, operationId: string): Readonly<{ manifest_sha256: string; replay: boolean }> {
    const manifest = validateSealedInputManifest(manifestInput), manifestSha = sealedInputManifestSha256(manifest), keySha = canonicalKeySha256(key), row = this.requireRun(keySha);
    this.assertManifestBinding(row, manifest); this.assertNoPending(row); this.assertWitnessCurrent(row);
    if (row.canonical_manifest_sha256) {
      if (row.canonical_manifest_sha256 === manifestSha && row.canonical_manifest_json === json(manifest)) return Object.freeze({ manifest_sha256: manifestSha, replay: true });
      this.recordForkIncident(row, manifest, manifestSha, operationId);
      throw new CustodyControlError("CUSTODY_FORK_SUSPECTED");
    }
    this.requireActiveOwner(keySha, subject);
    this.prepareOperation(operationId, keySha, "CLOSE", { subject, manifest, manifest_sha256: manifestSha });
    this.finishTransition(operationId, keySha);
    return Object.freeze({ manifest_sha256: manifestSha, replay: false });
  }

  issueEvaluationJob(input: { key: CanonicalRunKey; manifest: CatfoodSealedInputManifestV1; custody_release_receipt: RoleActionReceiptV2; binding: RoleChannelBinding; operation_id: string }, invoke: () => AuthorityEvaluationJob): AuthorityEvaluationJob {
    const manifest = validateSealedInputManifest(input.manifest), manifestSha = sealedInputManifestSha256(manifest), keySha = canonicalKeySha256(input.key), row = this.requireClosedCurrent(keySha);
    if (row.canonical_manifest_sha256 !== manifestSha || row.canonical_manifest_json !== json(manifest)) throw new CustodyControlError("UNPROVEN_MANIFEST_VARIANT");
    const scope = manifest.scope as RoleRunScope, release = verifyRoleActionReceiptV2(input.custody_release_receipt, input.binding, { role: "custodian", action: "custodian.evaluation.release", purpose_class: "HISTORICAL_EVIDENCE", scope }), body = JSON.parse(release.body_json) as Record<string, unknown>;
    if (body.manifest_sha256 !== manifestSha || json(body.manifest) !== json(manifest)) throw new CustodyControlError("CUSTODY_RELEASE_MISMATCH");
    const existing = this.operation(input.operation_id);
    if (existing?.status === "APPLIED") return Object.freeze(JSON.parse(existing.result_json!));
    if (existing) throw new CustodyControlError("REMOTE_EFFECT_RECONCILIATION_REQUIRED");
    this.prepareOperation(input.operation_id, keySha, "ISSUE_JOB", { manifest_sha256: manifestSha, release_receipt_sha256: input.custody_release_receipt.receipt_sha256 });
    this.finishTransition(input.operation_id, keySha, false);
    const started = performance.now();
    try {
      const job = invoke(); this.completeJobEffect(input.operation_id, row, manifestSha, job); this.metric(input.operation_id, keySha, "ISSUE_JOB", "SUCCEEDED", started); return job;
    } catch (error) { this.blockUnknownEffect(keySha, input.operation_id); this.metric(input.operation_id, keySha, "ISSUE_JOB", "UNRESOLVED", started); throw error; }
  }

  reconcileEvaluationJob(operationId: string, job: AuthorityEvaluationJob): AuthorityEvaluationJob {
    const op = this.requireOperation(operationId);
    if (op.kind !== "ISSUE_JOB" || !["ACKNOWLEDGED", "UNRESOLVED"].includes(op.status)) throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    const row = this.requireRun(op.key_sha256), input = JSON.parse(op.input_json) as Record<string, unknown>;
    this.completeJobEffect(operationId, row, String(input.manifest_sha256), job);
    return job;
  }

  assignExpectedTarget(input: { key: CanonicalRunKey; evaluation_job_id: string; verifier_binding: RoleChannelBinding; operation_id: string }, invoke: () => string): string {
    const keySha = canonicalKeySha256(input.key), row = this.requireClosedCurrent(keySha);
    if (!this.db.query("SELECT 1 FROM authorized_jobs WHERE evaluation_job_id=? AND key_sha256=?").get(input.evaluation_job_id, keySha)) throw new CustodyControlError("JOB_NOT_AUTHORIZED");
    if (this.operation(input.operation_id)) throw new CustodyControlError("REMOTE_EFFECT_RECONCILIATION_REQUIRED");
    this.prepareOperation(input.operation_id, keySha, "ASSIGN_TARGET", { evaluation_job_id: input.evaluation_job_id });
    this.finishTransition(input.operation_id, keySha, false);
    const started = performance.now();
    try {
      const envelope = invoke(); this.completeTargetEffect(input.operation_id, row, input.evaluation_job_id, envelope, input.verifier_binding);
      this.metric(input.operation_id, keySha, "ASSIGN_TARGET", "SUCCEEDED", started);
      return envelope;
    } catch (error) { this.blockUnknownEffect(keySha, input.operation_id); this.metric(input.operation_id, keySha, "ASSIGN_TARGET", "UNRESOLVED", started); throw error; }
  }

  reconcileExpectedTarget(operationId: string, envelope: string, binding: RoleChannelBinding): string {
    const op = this.requireOperation(operationId);
    if (op.kind !== "ASSIGN_TARGET" || !["ACKNOWLEDGED", "UNRESOLVED"].includes(op.status)) throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    const row = this.requireRun(op.key_sha256), input = JSON.parse(op.input_json) as Record<string, unknown>;
    this.completeTargetEffect(operationId, row, String(input.evaluation_job_id), envelope, binding);
    return envelope;
  }

  publishCurrentTarget<T>(key: CanonicalRunKey, targetEnvelope: string, invoke: () => T): T {
    const keySha = canonicalKeySha256(key), row = this.requireClosedCurrent(keySha), targetSha = hash(targetEnvelope);
    this.assertWitnessCurrent(row);
    const target = this.db.query<{ target_envelope: string }, [string, string]>("SELECT target_envelope FROM authorized_targets WHERE target_sha256=? AND key_sha256=? AND state='CURRENT'").get(targetSha, keySha);
    if (!target || target.target_envelope !== targetEnvelope) throw new CustodyControlError("CURRENT_TARGET_REQUIRED");
    return invoke();
  }

  runSafetyAction<T>(key: CanonicalRunKey, action: "STOP" | "RECONCILE" | "REVOKE", invoke: () => T): T {
    this.requireRun(canonicalKeySha256(key));
    if (!["STOP", "RECONCILE", "REVOKE"].includes(action)) throw new CustodyControlError("SAFETY_ACTION_INVALID");
    return invoke();
  }

  reconcilePending(operationId: string): Readonly<Record<string, unknown>> {
    const op = this.requireOperation(operationId);
    if (op.status !== "PENDING") return this.stateBySha(op.key_sha256);
    const ack = this.obtainWitnessAck(op);
    this.acknowledge(op, ack, true);
    return this.stateBySha(op.key_sha256);
  }

  state(key: CanonicalRunKey): Readonly<Record<string, unknown>> { return this.stateBySha(canonicalKeySha256(key)); }

  private run(keySha: string): RunRow | null { return this.db.query<RunRow, [string]>("SELECT * FROM governed_runs WHERE key_sha256=?").get(keySha) ?? null; }
  private operation(id: string): OperationRow | null { return this.db.query<OperationRow, [string]>("SELECT * FROM controller_operations WHERE operation_id=?").get(id) ?? null; }
  private requireRun(keySha: string): RunRow { const row = this.run(keySha); if (!row) throw new CustodyControlError("RUN_NOT_RESERVED"); return row; }
  private requireOperation(id: string): OperationRow { const row = this.operation(id); if (!row) throw new CustodyControlError("OPERATION_NOT_FOUND"); return row; }

  private prepareOperation(operationId: string, keySha: string, kind: string, input: Record<string, unknown>): OperationRow {
    if (!TOKEN.test(operationId) || !TOKEN.test(kind)) throw new CustodyControlError("OPERATION_INVALID");
    const existing = this.operation(operationId), inputJson = json(input), inputSha = hash(inputJson);
    if (existing) {
      if (existing.key_sha256 !== keySha || existing.kind !== kind || existing.input_json !== inputJson) throw new CustodyControlError("OPERATION_CONFLICT");
      return existing;
    }
    const row = this.requireRun(keySha), pending = this.db.query("SELECT 1 FROM controller_operations WHERE key_sha256=? AND status IN('PENDING','ACKNOWLEDGED','UNRESOLVED')").get(keySha);
    if (pending) throw new CustodyControlError("CONTINUITY_OPERATION_PENDING");
    const sequence = row.revision + 1, unsigned = { schema: WITNESS_SCHEMA, operation_id: operationId, key_sha256: keySha, sequence, previous_digest: row.witness_digest, transition: kind, payload_sha256: inputSha }, record: WitnessRecord = { ...unsigned, record_digest: hash(json(unsigned)) };
    this.db.query("INSERT INTO controller_operations VALUES(?,?,?,?,?,?,?,?,?,NULL,?)").run(operationId, keySha, kind, inputSha, inputJson, sequence, row.witness_digest, json(record), "PENDING", new Date().toISOString());
    return this.requireOperation(operationId);
  }

  private finishTransition(operationId: string, keySha: string, apply = true): Readonly<Record<string, unknown>> {
    const op = this.requireOperation(operationId);
    if (op.key_sha256 !== keySha) throw new CustodyControlError("OPERATION_CONFLICT");
    if (op.status === "PENDING") {
      const ack = this.obtainWitnessAck(op);
      this.acknowledge(op, ack, apply);
    }
    return this.stateBySha(keySha);
  }

  private acknowledge(op: OperationRow, ack: WitnessAcknowledgment, apply: boolean): void {
    if (json(ack.record) !== op.witness_record_json) throw new CustodyControlError("WITNESS_ACK_MISMATCH");
    this.db.transaction(() => {
      const row = this.requireRun(op.key_sha256);
      if (row.revision + 1 !== op.sequence || row.witness_digest !== op.previous_digest) throw new CustodyControlError("CONTROLLER_PREDECESSOR_CONFLICT");
      this.db.query("UPDATE governed_runs SET revision=?,witness_digest=?,updated_at=? WHERE key_sha256=?").run(op.sequence, ack.record.record_digest, ack.acknowledged_at, op.key_sha256);
      this.db.query("UPDATE controller_operations SET status='ACKNOWLEDGED' WHERE operation_id=?").run(op.operation_id);
      if (apply) this.applyLocal(op);
    }).immediate();
  }

  private obtainWitnessAck(op: OperationRow): WitnessAcknowledgment {
    const started = performance.now(), stored = JSON.parse(op.witness_record_json) as WitnessRecord;
    try {
      const ack = this.witness.readOperation(op.operation_id) ?? this.witness.append(stored);
      this.metric(op.operation_id, op.key_sha256, op.kind, "SUCCEEDED", started, "witness.append");
      return ack;
    } catch (error) {
      this.metric(op.operation_id, op.key_sha256, op.kind, "BLOCKED", started, "witness.append");
      throw error;
    }
  }

  private metric(operationId: string, keySha: string, kind: string, outcome: CustodyControlMetric["outcome"], started: number, name: CustodyControlMetric["name"] = "guarded.effect"): void {
    this.instrumentation(Object.freeze({ name, operation_id: operationId, key_sha256: keySha, operation_kind: kind, outcome, elapsed_ms: performance.now() - started, observed_wall_time_ms: Date.now(), monotonic_ms: performance.now() }));
  }

  private applyLocal(op: OperationRow): void {
    const input = JSON.parse(op.input_json) as Record<string, any>, now = new Date().toISOString();
    if (op.kind === "RESERVE") this.db.query("UPDATE governed_runs SET state='RESERVED',updated_at=? WHERE key_sha256=?").run(now, op.key_sha256);
    else if (op.kind === "ADMIT" || op.kind === "REPLACE") this.db.query("UPDATE governed_runs SET state='ACTIVE',owner_json=?,lease_expires_ms=?,updated_at=? WHERE key_sha256=?").run(json(input.subject), input.lease_expires_ms, now, op.key_sha256);
    else if (op.kind === "CHECKPOINT") this.db.query("UPDATE governed_runs SET control_head_sha256=?,checkpoint_head_sha256=?,lease_expires_ms=?,updated_at=? WHERE key_sha256=?").run(input.control_head_sha256, input.checkpoint_head_sha256, input.lease_expires_ms, now, op.key_sha256);
    else if (op.kind === "LEASE_LOST") this.db.query("UPDATE governed_runs SET state='FENCING',lease_expires_ms=NULL,updated_at=? WHERE key_sha256=?").run(now, op.key_sha256);
    else if (op.kind === "CLOSE") this.db.query("UPDATE governed_runs SET state='CLOSED',canonical_manifest_sha256=?,canonical_manifest_json=?,lease_expires_ms=NULL,updated_at=? WHERE key_sha256=?").run(input.manifest_sha256, json(input.manifest), now, op.key_sha256);
    else if (op.kind === "INCIDENT") this.db.query("UPDATE governed_runs SET state='INCIDENT',lease_expires_ms=NULL,updated_at=? WHERE key_sha256=?").run(now, op.key_sha256);
    if (["RESERVE", "ADMIT", "REPLACE", "CHECKPOINT", "LEASE_LOST", "CLOSE", "INCIDENT"].includes(op.kind)) this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=?").run(json({ applied: true }), op.operation_id);
  }

  private recordForkIncident(row: RunRow, manifest: CatfoodSealedInputManifestV1, manifestSha: string, operationId: string): void {
    const incidentId = `incident:${hash(`${row.key_sha256}\n${manifestSha}`).slice(0, 40)}`;
    this.db.transaction(() => {
      this.db.query("INSERT OR IGNORE INTO custody_incidents VALUES(?,?,?,?,?,?)").run(incidentId, row.key_sha256, "CUSTODY_FORK_SUSPECTED", manifestSha, json(manifest), new Date().toISOString());
      this.db.query("UPDATE governed_runs SET state='INCIDENT',lease_expires_ms=NULL,updated_at=? WHERE key_sha256=?").run(new Date().toISOString(), row.key_sha256);
      this.prepareOperation(operationId, row.key_sha256, "INCIDENT", { incident_id: incidentId, variant_manifest_sha256: manifestSha, original_manifest_sha256: row.canonical_manifest_sha256 });
    }).immediate();
    this.finishTransition(operationId, row.key_sha256);
  }

  private completeJobEffect(operationId: string, row: RunRow, manifestSha: string, job: AuthorityEvaluationJob): void {
    const descriptor = job.descriptor;
    if (descriptor.manifest_sha256 !== manifestSha || canonicalKeySha256(scopeKey(descriptor.scope)) !== row.key_sha256 || hash(job.descriptor_envelope) !== job.descriptor_sha256) throw new CustodyControlError("EVALUATION_JOB_MISMATCH");
    this.db.transaction(() => {
      this.db.query("INSERT INTO authorized_jobs VALUES(?,?,?,?,?,?)").run(descriptor.evaluation_job_id, row.key_sha256, manifestSha, job.descriptor_sha256, json(job), operationId);
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=?").run(json(job), operationId);
      this.db.query("UPDATE governed_runs SET state='CLOSED',updated_at=? WHERE key_sha256=?").run(new Date().toISOString(), row.key_sha256);
    }).immediate();
  }

  private completeTargetEffect(operationId: string, row: RunRow, evaluationJobId: string, envelope: string, binding: RoleChannelBinding): void {
    const target = verifyExpectedEvaluationTargetEnvelope(envelope, binding);
    if (target.evaluation_job_id !== evaluationJobId || canonicalKeySha256(scopeKey(target.scope as RoleRunScope)) !== row.key_sha256) throw new CustodyControlError("TARGET_MISMATCH");
    const targetSha = hash(envelope);
    this.db.transaction(() => {
      this.db.query("UPDATE authorized_targets SET state='REVOKED' WHERE key_sha256=? AND state='CURRENT'").run(row.key_sha256);
      this.db.query("INSERT INTO authorized_targets VALUES(?,?,?,?,?,?)").run(targetSha, row.key_sha256, evaluationJobId, envelope, "CURRENT", operationId);
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=?").run(json({ target_envelope: envelope }), operationId);
      this.db.query("UPDATE governed_runs SET state='CLOSED',updated_at=? WHERE key_sha256=?").run(new Date().toISOString(), row.key_sha256);
    }).immediate();
  }

  private blockUnknownEffect(keySha: string, operationId: string): void {
    this.db.transaction(() => {
      this.db.query("UPDATE controller_operations SET status='UNRESOLVED' WHERE operation_id=? AND status='ACKNOWLEDGED'").run(operationId);
      this.db.query("UPDATE governed_runs SET state='RECOVERY_REQUIRED',lease_expires_ms=NULL,updated_at=? WHERE key_sha256=?").run(new Date().toISOString(), keySha);
    }).immediate();
  }

  private requireActiveOwner(keySha: string, subject: CustodianSubject): RunRow {
    const row = this.requireRun(keySha);
    if (row.state !== "ACTIVE" || row.owner_json !== json(subject)) throw new CustodyControlError("ACTIVE_CUSTODIAN_REQUIRED");
    return row;
  }

  private requireClosedCurrent(keySha: string): RunRow {
    const row = this.requireRun(keySha);
    this.assertNoPending(row); this.assertWitnessCurrent(row);
    if (row.state !== "CLOSED" || !row.canonical_manifest_sha256) throw new CustodyControlError("CANONICAL_CLOSE_REQUIRED");
    return row;
  }

  private assertNoPending(row: RunRow): void {
    if (this.db.query("SELECT 1 FROM controller_operations WHERE key_sha256=? AND status IN('PENDING','ACKNOWLEDGED','UNRESOLVED')").get(row.key_sha256)) throw new CustodyControlError("CONTINUITY_OPERATION_PENDING");
  }

  private assertWitnessCurrent(row: RunRow): void {
    const current = this.witness.current(row.key_sha256);
    if (!current || current.record.sequence !== row.revision || current.record.record_digest !== row.witness_digest) throw new CustodyControlError("CONTINUITY_HIGH_WATER_MISMATCH");
  }

  private assertManifestBinding(row: RunRow, manifest: CatfoodSealedInputManifestV1): void {
    const binding = JSON.parse(row.binding_json) as RunBinding, scope = manifest.scope;
    if (canonicalKeySha256(scopeKey(scope)) !== row.key_sha256 || scope.environment_instance_id !== binding.environment_instance_id || scope.spec_sha256 !== binding.spec_sha256 || manifest.go.artifact_sha256 !== binding.go_artifact_sha256 || manifest.trust.test_only !== true) throw new CustodyControlError("MANIFEST_BINDING_MISMATCH");
  }

  private stateBySha(keySha: string): Readonly<Record<string, unknown>> {
    const row = this.requireRun(keySha);
    return Object.freeze({ key_sha256: row.key_sha256, key: JSON.parse(row.key_json), binding: JSON.parse(row.binding_json), state: row.state, revision: row.revision, witness_digest: row.witness_digest, owner: row.owner_json ? JSON.parse(row.owner_json) : null, lease_expires_ms: row.lease_expires_ms, control_head_sha256: row.control_head_sha256, checkpoint_head_sha256: row.checkpoint_head_sha256, canonical_manifest_sha256: row.canonical_manifest_sha256, incident_count: this.db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM custody_incidents WHERE key_sha256=?").get(keySha)!.n });
  }
}

export class PreCustodyControlHost {
  #controller: CustodyController;
  constructor(controller: CustodyController) { this.#controller = controller; }
  reserveRun(binding: RunBinding, operationId: string) { return this.#controller.reserveRun(binding, operationId); }
  admitCustodian(key: CanonicalRunKey, subject: CustodianSubject, leaseExpiresMs: number, operationId: string) { return this.#controller.admitCustodian(key, subject, leaseExpiresMs, operationId); }
  closeManifest(key: CanonicalRunKey, subject: CustodianSubject, manifest: CatfoodSealedInputManifestV1, operationId: string) { return this.#controller.closeManifest(key, subject, manifest, operationId); }
  issueEvaluationJob(input: Parameters<CustodyController["issueEvaluationJob"]>[0], invoke: () => AuthorityEvaluationJob) { return this.#controller.issueEvaluationJob(input, invoke); }
  reconcileEvaluationJob(operationId: string, job: AuthorityEvaluationJob) { return this.#controller.reconcileEvaluationJob(operationId, job); }
  assignExpectedTarget(input: Parameters<CustodyController["assignExpectedTarget"]>[0], invoke: () => string) { return this.#controller.assignExpectedTarget(input, invoke); }
  reconcileExpectedTarget(operationId: string, envelope: string, binding: RoleChannelBinding) { return this.#controller.reconcileExpectedTarget(operationId, envelope, binding); }
  publishCurrentTarget<T>(key: CanonicalRunKey, envelope: string, invoke: () => T) { return this.#controller.publishCurrentTarget(key, envelope, invoke); }
  runSafetyAction<T>(key: CanonicalRunKey, action: "STOP" | "RECONCILE" | "REVOKE", invoke: () => T) { return this.#controller.runSafetyAction(key, action, invoke); }
}

export function canonicalKeySha256(key: CanonicalRunKey): string { validateKey(key); return hash(json(key)); }

function scopeKey(scope: RoleRunScope): CanonicalRunKey { return { environment_type: scope.environment_type, deployment_id: scope.deployment_id, organization_id: scope.organization_id, tenant_id: scope.tenant_id, account_id: scope.account_id, run_id: scope.run_id }; }
function validateKey(key: CanonicalRunKey): void { if (Object.values(key).some((value) => typeof value !== "string" || !TOKEN.test(value))) throw new CustodyControlError("CANONICAL_KEY_INVALID"); }
function requireSha(value: string): void { if (!SHA256.test(value)) throw new CustodyControlError("SHA256_INVALID"); }
function validateSubject(subject: CustodianSubject): void { if ([subject.process_id, subject.launch_id, subject.session_id, subject.host_incarnation].some((value) => !TOKEN.test(value))) throw new CustodyControlError("CUSTODIAN_SUBJECT_INVALID"); requireSha(subject.build_sha256); }
function validateBinding(binding: RunBinding): void { validateKey(binding.key); if (binding.test_only !== true || !TOKEN.test(binding.environment_instance_id) || !TOKEN.test(binding.authority_incarnation) || !TOKEN.test(binding.control_store_id) || !TOKEN.test(binding.checkpoint_store_id) || !Number.isSafeInteger(binding.producer_generation) || binding.producer_generation < 1) throw new CustodyControlError("RUN_BINDING_INVALID"); for (const value of [binding.spec_sha256, binding.window_sha256, binding.go_artifact_sha256, binding.go_policy_ref_sha256, binding.store_pair_lineage_sha256, binding.initial_control_head_sha256, binding.initial_checkpoint_head_sha256]) requireSha(value); }
function requireFenceProof(proof: FenceProof): void { if (proof.old_process_cannot_execute !== true || proof.old_credentials_revoked !== true || proof.producer_effects_resolved !== true || proof.complete_history_verified !== true) throw new CustodyControlError("REPLACEMENT_NOT_PROVEN"); requireSha(proof.control_head_sha256); requireSha(proof.checkpoint_head_sha256); }
