import { Database } from "bun:sqlite";
import { createHash, createPublicKey, generateKeyPairSync, type KeyObject } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalJson } from "../../web/lib/catfood-harness";
import {
  collectCurrentRuntimeSubject,
  observeTestOnlyRoleLaunch,
  roleChannelArtifactDescriptor,
  type CatfoodEnrollmentRole,
  type RuntimeSubject,
  type TestEnrollmentBinding,
} from "../../web/lib/catfood-enrollment";
import {
  sealedInputManifestSha256,
  validateSealedInputManifest,
  type CatfoodSealedInputManifestV1,
} from "../../web/lib/catfood-final-closure";
import {
  CatfoodRoleAuthority,
  localRoleEvidence,
  registerLocalRoleSessionForTest,
  roleChannelPublicKeyFingerprint,
  verifyEvaluationJobEnvelope,
  verifyExpectedEvaluationTargetEnvelope,
  verifyRoleActionReceiptV2,
  verifyRoleEvidenceV4,
  type AuthorityEvaluationJob,
  type LocalRoleSession,
  type RoleActionReceiptV2,
  type RoleChannelBinding,
  type RoleRunScope,
  type VerifiedRoleEvidence,
  type WriterCredentialReference,
} from "../../web/lib/catfood-role-channel";

const ZERO = "0".repeat(64);
const SHA256 = /^[0-9a-f]{64}$/;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,255}$/;
const CONTROLLER_SCHEMA = "pre-custody-control.v2";
const WITNESS_SCHEMA = "pre-custody-continuity-witness.v2";
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
  readonly control_store_id: string;
  readonly checkpoint_store_id: string;
  readonly store_pair_lineage_sha256: string;
  readonly producer_generation: number;
  readonly journal_head_sha256: string;
  readonly checkpoint_head_sha256: string;
  readonly control_snapshot_sha256: string;
  readonly checkpoint_snapshot_sha256: string;
  readonly pair_common_cut_sha256: string;
  readonly test_only: true;
}

export interface AuthorityContinuity { readonly incarnation: string; readonly revision: number }

export interface AdmittedCustodian {
  readonly session_id: string;
  readonly assignment_id: string;
  readonly action_key_fingerprint: string;
  readonly subject_sha256: string;
  readonly launch_id: string;
  readonly process_id: string;
  readonly host_incarnation: string;
  readonly build_sha256: string;
}

export interface FenceObservation {
  readonly old_session_id: string;
  readonly old_process_cannot_execute: boolean;
  readonly old_credentials_revoked: boolean;
  readonly producer_effects_resolved: boolean;
  readonly complete_history_verified: boolean;
  readonly journal_head_sha256: string;
  readonly checkpoint_head_sha256: string;
  readonly control_snapshot_sha256: string;
  readonly checkpoint_snapshot_sha256: string;
  readonly pair_common_cut_sha256: string;
}

export interface TrustedFenceAdapter {
  inspect(input: Readonly<{ key: CanonicalRunKey; admitted: AdmittedCustodian; binding: RunBinding }>): FenceObservation;
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

export interface WitnessAcknowledgment { readonly record: WitnessRecord; readonly acknowledged_at: string }
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
    const ack = { record, acknowledged_at: new Date().toISOString() };
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
CREATE TABLE controller_meta(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schema TEXT NOT NULL,controller_id TEXT NOT NULL UNIQUE,test_only INTEGER NOT NULL CHECK(test_only=1),authority_binding_sha256 TEXT NOT NULL,authority_anchor_sha256 TEXT NOT NULL) STRICT;
CREATE TABLE governed_runs(key_sha256 TEXT PRIMARY KEY,key_json TEXT NOT NULL CHECK(json_valid(key_json)),binding_json TEXT NOT NULL CHECK(json_valid(binding_json)),state TEXT NOT NULL CHECK(state IN('RESERVING','RESERVED','ADMITTING','ACTIVE','FENCING','RECOVERY_REQUIRED','CLOSED','INCIDENT','ENDED')),revision INTEGER NOT NULL CHECK(revision>=0),witness_digest TEXT NOT NULL,admitted_json TEXT CHECK(admitted_json IS NULL OR json_valid(admitted_json)),lease_expires_ms INTEGER,canonical_manifest_sha256 TEXT,canonical_manifest_json TEXT CHECK(canonical_manifest_json IS NULL OR json_valid(canonical_manifest_json)),canonical_release_json TEXT CHECK(canonical_release_json IS NULL OR json_valid(canonical_release_json)),authority_incarnation TEXT NOT NULL,authority_high_water INTEGER NOT NULL CHECK(authority_high_water>=1),created_at TEXT NOT NULL,updated_at TEXT NOT NULL) STRICT;
CREATE TABLE controller_operations(operation_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),kind TEXT NOT NULL,input_sha256 TEXT NOT NULL,input_json TEXT NOT NULL CHECK(json_valid(input_json)),expected_json TEXT NOT NULL CHECK(json_valid(expected_json)),sequence INTEGER NOT NULL,previous_digest TEXT NOT NULL,witness_record_json TEXT NOT NULL CHECK(json_valid(witness_record_json)),status TEXT NOT NULL CHECK(status IN('PENDING','ACKNOWLEDGED','UNRESOLVED','APPLIED')),result_json TEXT CHECK(result_json IS NULL OR json_valid(result_json)),created_at TEXT NOT NULL,UNIQUE(key_sha256,sequence)) STRICT;
CREATE TABLE custody_incidents(incident_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),kind TEXT NOT NULL,evidence_sha256 TEXT NOT NULL,raw_json TEXT NOT NULL CHECK(json_valid(raw_json)),created_at TEXT NOT NULL,UNIQUE(key_sha256,kind,evidence_sha256)) STRICT;
CREATE TABLE authorized_jobs(evaluation_job_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),operation_id TEXT NOT NULL UNIQUE REFERENCES controller_operations(operation_id),authority_incarnation TEXT NOT NULL,authority_revision INTEGER NOT NULL,manifest_sha256 TEXT NOT NULL,descriptor_sha256 TEXT NOT NULL,descriptor_envelope TEXT NOT NULL,result_json TEXT NOT NULL CHECK(json_valid(result_json)),current_eligible INTEGER NOT NULL CHECK(current_eligible IN(0,1)),UNIQUE(authority_incarnation,authority_revision)) STRICT;
CREATE TABLE authorized_targets(target_sha256 TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),operation_id TEXT NOT NULL UNIQUE REFERENCES controller_operations(operation_id),authority_incarnation TEXT NOT NULL,authority_revision INTEGER NOT NULL,evaluation_job_id TEXT NOT NULL,target_envelope TEXT NOT NULL,state TEXT NOT NULL CHECK(state IN('CURRENT','REVOKED')),UNIQUE(authority_incarnation,authority_revision)) STRICT;
CREATE TABLE authority_revision_effects(authority_incarnation TEXT NOT NULL,authority_revision INTEGER NOT NULL,effect_kind TEXT NOT NULL,effect_sha256 TEXT NOT NULL,key_sha256 TEXT NOT NULL,PRIMARY KEY(authority_incarnation,authority_revision)) STRICT;
`;

export function initializeCustodyController(path: string, controllerId: string, binding: RoleChannelBinding): void {
  if (!existsSync(resolve(path))) throw new CustodyControlError("CONTROLLER_STORE_MUST_PREEXIST");
  if (!TOKEN.test(controllerId) || binding.trust_domain !== "TEST_ONLY") throw new CustodyControlError("CONTROLLER_ID_INVALID");
  const db = new Database(resolve(path), { strict: true, create: false });
  try {
    if ((db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get()?.n ?? 0) !== 0) throw new CustodyControlError("CONTROLLER_STORE_NOT_EMPTY");
    db.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;");
    db.exec(CONTROLLER_SQL);
    db.query("INSERT INTO controller_meta VALUES(1,?,?,1,?,?)").run(CONTROLLER_SCHEMA, controllerId, hash(json(binding)), publicKeyFingerprint(binding.authority_public_key_pem));
  } finally { db.close(); }
}

type RunRow = {
  key_sha256: string; key_json: string; binding_json: string; state: string; revision: number; witness_digest: string;
  admitted_json: string | null; lease_expires_ms: number | null; canonical_manifest_sha256: string | null;
  canonical_manifest_json: string | null; canonical_release_json: string | null; authority_incarnation: string; authority_high_water: number;
};
export type OperationRow = { operation_id: string; key_sha256: string; kind: string; input_json: string; expected_json: string; sequence: number; previous_digest: string; witness_record_json: string; status: string; result_json: string | null };
export interface AuthoritySnapshot { readonly continuity: AuthorityContinuity; readonly jobs: readonly AuthorityEvaluationJob[]; readonly targets: readonly string[] }

export class CustodyController {
  private readonly db: Database;
  constructor(path: string, private readonly witness: ContinuityWitness, private readonly authorityBinding: RoleChannelBinding, private readonly instrumentation: CustodyControlInstrumentation = () => {}) {
    this.db = new Database(resolve(path), { strict: true, create: false });
    this.db.exec("PRAGMA foreign_keys=ON; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;");
    const meta = this.db.query<{ schema: string; test_only: number; authority_binding_sha256: string; authority_anchor_sha256: string }, []>("SELECT schema,test_only,authority_binding_sha256,authority_anchor_sha256 FROM controller_meta WHERE singleton=1").get();
    if (!meta || meta.schema !== CONTROLLER_SCHEMA || meta.test_only !== 1 || meta.authority_binding_sha256 !== hash(json(authorityBinding)) || meta.authority_anchor_sha256 !== publicKeyFingerprint(authorityBinding.authority_public_key_pem)) { this.db.close(); throw new CustodyControlError("CONTROLLER_STORE_INVALID"); }
  }
  close(): void { this.db.close(); }

  reserveRun(runBinding: RunBinding, authority: AuthorityContinuity, operationId: string): Readonly<Record<string, unknown>> {
    validateRunBinding(runBinding); validateAuthorityContinuity(authority);
    const keySha = canonicalKeySha256(runBinding.key), current = this.run(keySha), bindingJson = json(runBinding), now = new Date().toISOString();
    if (current) {
      if (current.binding_json !== bindingJson || current.authority_incarnation !== authority.incarnation) throw new CustodyControlError("RUN_BINDING_CONFLICT");
      return this.finishTransition(this.requireOperationFor(operationId, "RESERVE", keySha), true);
    }
    this.db.transaction(() => {
      this.db.query("INSERT INTO governed_runs VALUES(?,?,?,?,0,?,NULL,NULL,NULL,NULL,NULL,?,?,?,?)").run(keySha, json(runBinding.key), bindingJson, "RESERVING", ZERO, authority.incarnation, authority.revision, now, now);
      this.prepareOperation(operationId, keySha, "RESERVE", { binding_sha256: hash(bindingJson), authority }, {});
    }).immediate();
    return this.finishTransition(this.requireOperationFor(operationId, "RESERVE", keySha), true);
  }

  beginCustodianAdmission(key: CanonicalRunKey, candidate: Readonly<{ subject_sha256: string; launch_id: string; action_key_fingerprint: string; process_id: string; host_incarnation: string; build_sha256: string }>, leaseExpiresMs: number, operationId: string): void {
    validateAdmissionCandidate(candidate);
    if (!Number.isSafeInteger(leaseExpiresMs) || leaseExpiresMs <= Date.now()) throw new CustodyControlError("LEASE_INVALID");
    const keySha = canonicalKeySha256(key), row = this.requireRun(keySha);
    this.assertNoOpenOperation(keySha);
    if (row.state !== "RESERVED") throw new CustodyControlError("POSITIVE_ADMISSION_BLOCKED");
    const op = this.prepareOperation(operationId, keySha, "ADMIT_CUSTODIAN", { candidate, lease_expires_ms: leaseExpiresMs }, { candidate_sha256: hash(json(candidate)) });
    this.finishTransition(op, false);
    this.db.query("UPDATE governed_runs SET state='ADMITTING',updated_at=? WHERE key_sha256=? AND state='RESERVED'").run(new Date().toISOString(), keySha);
  }

  completeCustodianAdmission(key: CanonicalRunKey, operationId: string, admitted: AdmittedCustodian): void {
    validateAdmitted(admitted);
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, "ADMIT_CUSTODIAN", keySha), expected = JSON.parse(op.expected_json) as Record<string, unknown>, input = JSON.parse(op.input_json) as Record<string, any>;
    const actualCandidate = { subject_sha256: admitted.subject_sha256, launch_id: admitted.launch_id, action_key_fingerprint: admitted.action_key_fingerprint, process_id: admitted.process_id, host_incarnation: admitted.host_incarnation, build_sha256: admitted.build_sha256 };
    if (op.status !== "ACKNOWLEDGED" || hash(json(actualCandidate)) !== expected.candidate_sha256) throw new CustodyControlError("ADMISSION_EVIDENCE_MISMATCH");
    this.db.transaction(() => {
      const row = this.requireRun(keySha);
      if (row.state !== "ADMITTING" || row.admitted_json) throw new CustodyControlError("POSITIVE_ADMISSION_BLOCKED");
      this.db.query("UPDATE governed_runs SET state='ACTIVE',admitted_json=?,lease_expires_ms=?,updated_at=? WHERE key_sha256=? AND state='ADMITTING'").run(json(admitted), input.lease_expires_ms, new Date().toISOString(), keySha);
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=? AND status='ACKNOWLEDGED'").run(json({ admitted }), operationId);
    }).immediate();
  }

  failAdmission(key: CanonicalRunKey, operationId: string): void {
    const keySha = canonicalKeySha256(key);
    this.requireOperationFor(operationId, "ADMIT_CUSTODIAN", keySha);
    this.db.transaction(() => {
      this.db.query("UPDATE controller_operations SET status='UNRESOLVED' WHERE operation_id=?").run(operationId);
      this.db.query("UPDATE governed_runs SET state='RECOVERY_REQUIRED',updated_at=? WHERE key_sha256=? AND state!='INCIDENT'").run(new Date().toISOString(), keySha);
    }).immediate();
  }

  assertSupportingRoleLaunch(key: CanonicalRunKey, role: Exclude<CatfoodEnrollmentRole, "custodian">): void {
    const row = this.requireRun(canonicalKeySha256(key)); this.assertNoOpenOperation(row.key_sha256); this.assertWitnessCurrent(row);
    if (!["ACTIVE", "CLOSED"].includes(row.state) || role === "custodian") throw new CustodyControlError("ROLE_LAUNCH_BLOCKED");
  }

  admitted(key: CanonicalRunKey): AdmittedCustodian {
    const row = this.requireRun(canonicalKeySha256(key));
    if (!row.admitted_json) throw new CustodyControlError("ADMITTED_CUSTODIAN_REQUIRED");
    return Object.freeze(JSON.parse(row.admitted_json));
  }
  bindingFor(key: CanonicalRunKey): RunBinding { return Object.freeze(JSON.parse(this.requireRun(canonicalKeySha256(key)).binding_json)); }
  canonicalEvidence(key: CanonicalRunKey): Readonly<{ manifest: CatfoodSealedInputManifestV1; release: RoleActionReceiptV2 }> {
    const row = this.requireRun(canonicalKeySha256(key));
    if (!row.canonical_manifest_json || !row.canonical_release_json) throw new CustodyControlError("CANONICAL_CLOSE_REQUIRED");
    return Object.freeze({ manifest: JSON.parse(row.canonical_manifest_json), release: JSON.parse(row.canonical_release_json) });
  }

  observeLeaseExpiry(key: CanonicalRunKey, observedNowMs: number): boolean {
    const row = this.requireRun(canonicalKeySha256(key));
    if (row.state !== "ACTIVE" || row.lease_expires_ms === null || observedNowMs <= row.lease_expires_ms) return false;
    this.db.query("UPDATE governed_runs SET state='FENCING',updated_at=? WHERE key_sha256=? AND state='ACTIVE'").run(new Date().toISOString(), row.key_sha256);
    return true;
  }

  assertReplacementAllowed(key: CanonicalRunKey, observation: FenceObservation, leaseExpiresMs: number): void {
    validateFenceObservation(observation);
    const keySha = canonicalKeySha256(key), row = this.requireRun(keySha), runBinding = JSON.parse(row.binding_json) as RunBinding, old = row.admitted_json ? JSON.parse(row.admitted_json) as AdmittedCustodian : null;
    this.assertNoOpenOperation(keySha);
    if (row.state !== "FENCING" || !old || observation.old_session_id !== old.session_id || !observation.old_process_cannot_execute || !observation.old_credentials_revoked || !observation.producer_effects_resolved || !observation.complete_history_verified || !sameLineage(runBinding, observation) || !Number.isSafeInteger(leaseExpiresMs) || leaseExpiresMs <= Date.now()) {
      this.db.query("UPDATE governed_runs SET state='RECOVERY_REQUIRED',updated_at=? WHERE key_sha256=? AND state!='INCIDENT'").run(new Date().toISOString(), keySha);
      throw new CustodyControlError("REPLACEMENT_NOT_PROVEN");
    }
  }

  replaceCustodian(key: CanonicalRunKey, observation: FenceObservation, admitted: AdmittedCustodian, leaseExpiresMs: number, operationId: string): void {
    validateFenceObservation(observation); validateAdmitted(admitted);
    this.assertReplacementAllowed(key, observation, leaseExpiresMs);
    const keySha = canonicalKeySha256(key), old = this.admitted(key);
    const op = this.prepareOperation(operationId, keySha, "REPLACE_CUSTODIAN", { old_session_id: old.session_id, admitted, observation_sha256: hash(json(observation)), lease_expires_ms: leaseExpiresMs }, { admitted_session_id: admitted.session_id });
    this.finishTransition(op, false);
    this.db.transaction(() => {
      const current = this.requireRun(keySha);
      if (current.state !== "FENCING") throw new CustodyControlError("INCIDENT_TERMINAL");
      this.db.query("UPDATE governed_runs SET state='ACTIVE',admitted_json=?,lease_expires_ms=?,updated_at=? WHERE key_sha256=? AND state='FENCING'").run(json(admitted), leaseExpiresMs, new Date().toISOString(), keySha);
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=?").run(json({ admitted }), operationId);
    }).immediate();
  }

  closeManifest(key: CanonicalRunKey, manifestInput: CatfoodSealedInputManifestV1, receipt: RoleActionReceiptV2, operationId: string): Readonly<{ manifest_sha256: string; replay: boolean }> {
    const manifest = validateSealedInputManifest(manifestInput), manifestSha = sealedInputManifestSha256(manifest), keySha = canonicalKeySha256(key), row = this.requireRun(keySha), runBinding = JSON.parse(row.binding_json) as RunBinding;
    const release = verifyRoleActionReceiptV2(receipt, this.authorityBinding, { role: "custodian", action: "custodian.evaluation.release", purpose_class: "HISTORICAL_EVIDENCE", scope: manifest.scope as RoleRunScope }), body = JSON.parse(release.body_json) as Record<string, unknown>, admitted = row.admitted_json ? JSON.parse(row.admitted_json) as AdmittedCustodian : null;
    const authenticBody = body.manifest_sha256 === manifestSha && json(body.manifest) === json(manifest), owner = admitted && release.session_id === admitted.session_id, goRootBound = hash(json(body.go_root_policy_ref)) === runBinding.go_policy_ref_sha256;
    if (!authenticBody || !owner || !goRootBound || !manifestMatchesRun(manifest, runBinding, keySha)) {
      this.recordIncident(row, !owner ? "NON_ADMITTED_CUSTODIAN" : !authenticBody ? "RELEASE_MANIFEST_MISMATCH" : "CUSTODY_LINEAGE_MISMATCH", { manifest, receipt, admitted_session_id: admitted?.session_id ?? null }, operationId);
      throw new CustodyControlError(!owner ? "NON_ADMITTED_CUSTODIAN" : "CUSTODY_LINEAGE_MISMATCH");
    }
    if (row.canonical_manifest_sha256) {
      if (row.canonical_manifest_sha256 === manifestSha && row.canonical_manifest_json === json(manifest) && row.canonical_release_json === json(receipt)) return Object.freeze({ manifest_sha256: manifestSha, replay: true });
      this.recordIncident(row, "CUSTODY_FORK_SUSPECTED", { manifest, receipt }, operationId);
      throw new CustodyControlError("CUSTODY_FORK_SUSPECTED");
    }
    this.assertNoOpenOperation(keySha); this.assertWitnessCurrent(row);
    if (row.state !== "ACTIVE") throw new CustodyControlError("ACTIVE_CUSTODIAN_REQUIRED");
    const op = this.prepareOperation(operationId, keySha, "CLOSE", { manifest_sha256: manifestSha, receipt_sha256: receipt.receipt_sha256 }, { admitted_session_id: admitted.session_id });
    this.finishTransition(op, false);
    this.db.transaction(() => {
      const current = this.requireRun(keySha);
      if (current.state !== "ACTIVE") throw new CustodyControlError("INCIDENT_TERMINAL");
      this.db.query("UPDATE governed_runs SET state='CLOSED',canonical_manifest_sha256=?,canonical_manifest_json=?,canonical_release_json=?,lease_expires_ms=NULL,updated_at=? WHERE key_sha256=? AND state='ACTIVE'").run(manifestSha, json(manifest), json(receipt), new Date().toISOString(), keySha);
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=?").run(json({ manifest_sha256: manifestSha }), operationId);
    }).immediate();
    return Object.freeze({ manifest_sha256: manifestSha, replay: false });
  }

  beginJobEffect(key: CanonicalRunKey, operationId: string, expected: Readonly<{ authority_incarnation: string; authority_revision: number; workflow_instruction_id: string; release_receipt_sha256: string }>): void {
    const keySha = canonicalKeySha256(key), row = this.requireClosedCurrent(keySha); this.assertAuthorityExpectation(row, expected.authority_incarnation, expected.authority_revision);
    const existing = this.operation(operationId);
    if (existing) { this.assertOperation(existing, "ISSUE_JOB", keySha, expected); if (existing.status === "APPLIED") return; throw new CustodyControlError("REMOTE_EFFECT_RECONCILIATION_REQUIRED"); }
    const op = this.prepareOperation(operationId, keySha, "ISSUE_JOB", { manifest_sha256: row.canonical_manifest_sha256, release_receipt_sha256: expected.release_receipt_sha256 }, expected);
    this.finishTransition(op, false);
  }

  completeJobEffect(key: CanonicalRunKey, operationId: string, jobInput: AuthorityEvaluationJob): AuthorityEvaluationJob {
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, "ISSUE_JOB", keySha), expected = JSON.parse(op.expected_json) as Record<string, unknown>, row = this.requireRun(keySha), verified = verifyEvaluationJobEnvelope(jobInput.descriptor_envelope, this.authorityBinding);
    if (verified.descriptor_sha256 !== jobInput.descriptor_sha256 || json(verified.descriptor) !== json(jobInput.descriptor) || verified.descriptor.authority_incarnation !== expected.authority_incarnation || verified.descriptor.authority_revision !== expected.authority_revision || verified.descriptor.workflow_instruction_id !== expected.workflow_instruction_id || verified.descriptor.release_sha256 !== expected.release_receipt_sha256 || verified.descriptor.manifest_sha256 !== row.canonical_manifest_sha256 || canonicalKeySha256(scopeKey(verified.descriptor.scope)) !== keySha) throw new CustodyControlError("EVALUATION_JOB_MISMATCH");
    let eligible = false;
    this.db.transaction(() => {
      const current = this.requireRun(keySha), prior = this.db.query<{ effect_sha256: string; effect_kind: string }, [string, number]>("SELECT effect_sha256,effect_kind FROM authority_revision_effects WHERE authority_incarnation=? AND authority_revision=?").get(String(expected.authority_incarnation), Number(expected.authority_revision));
      if (prior && (prior.effect_sha256 !== verified.descriptor_sha256 || prior.effect_kind !== "JOB")) throw new CustodyControlError("AUTHORITY_REVISION_REUSED");
      eligible = ["CLOSED", "RECOVERY_REQUIRED"].includes(current.state);
      this.db.query("INSERT INTO authority_revision_effects VALUES(?,?,?,?,?)").run(expected.authority_incarnation, expected.authority_revision, "JOB", verified.descriptor_sha256, keySha);
      this.db.query("INSERT INTO authorized_jobs VALUES(?,?,?,?,?,?,?,?,?,?)").run(verified.descriptor.evaluation_job_id, keySha, operationId, expected.authority_incarnation, expected.authority_revision, verified.descriptor.manifest_sha256, verified.descriptor_sha256, verified.descriptor_envelope, json(verified), eligible ? 1 : 0);
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=? AND status IN('ACKNOWLEDGED','UNRESOLVED')").run(json(verified), operationId);
      if (eligible) this.db.query("UPDATE governed_runs SET state='CLOSED',authority_high_water=?,updated_at=? WHERE key_sha256=? AND state IN('CLOSED','RECOVERY_REQUIRED')").run(expected.authority_revision, new Date().toISOString(), keySha);
    }).immediate();
    if (!eligible) throw new CustodyControlError("INCIDENT_TERMINAL");
    return verified;
  }

  beginTargetEffect(key: CanonicalRunKey, operationId: string, expected: Readonly<{ authority_incarnation: string; authority_revision: number; evaluation_job_id: string; verifier_session_id: string }>): void {
    const keySha = canonicalKeySha256(key), row = this.requireClosedCurrent(keySha); this.assertAuthorityExpectation(row, expected.authority_incarnation, expected.authority_revision);
    if (!this.db.query("SELECT 1 FROM authorized_jobs WHERE evaluation_job_id=? AND key_sha256=? AND current_eligible=1").get(expected.evaluation_job_id, keySha)) throw new CustodyControlError("JOB_NOT_AUTHORIZED");
    const existing = this.operation(operationId);
    if (existing) { this.assertOperation(existing, "ASSIGN_TARGET", keySha, expected); if (existing.status === "APPLIED") return; throw new CustodyControlError("REMOTE_EFFECT_RECONCILIATION_REQUIRED"); }
    const op = this.prepareOperation(operationId, keySha, "ASSIGN_TARGET", { evaluation_job_id: expected.evaluation_job_id }, expected);
    this.finishTransition(op, false);
  }

  completeTargetEffect(key: CanonicalRunKey, operationId: string, envelope: string): string {
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, "ASSIGN_TARGET", keySha), expected = JSON.parse(op.expected_json) as Record<string, unknown>, target = verifyExpectedEvaluationTargetEnvelope(envelope, this.authorityBinding), targetSha = hash(envelope);
    if (target.authority_incarnation !== expected.authority_incarnation || target.target_revision !== expected.authority_revision || target.evaluation_job_id !== expected.evaluation_job_id || target.verifier_session_id !== expected.verifier_session_id || canonicalKeySha256(scopeKey(target.scope as RoleRunScope)) !== keySha) throw new CustodyControlError("TARGET_MISMATCH");
    let eligible = false;
    this.db.transaction(() => {
      const current = this.requireRun(keySha), prior = this.db.query<{ effect_sha256: string; effect_kind: string }, [string, number]>("SELECT effect_sha256,effect_kind FROM authority_revision_effects WHERE authority_incarnation=? AND authority_revision=?").get(String(expected.authority_incarnation), Number(expected.authority_revision));
      if (prior && (prior.effect_sha256 !== targetSha || prior.effect_kind !== "TARGET")) throw new CustodyControlError("AUTHORITY_REVISION_REUSED");
      eligible = ["CLOSED", "RECOVERY_REQUIRED"].includes(current.state);
      this.db.query("INSERT INTO authority_revision_effects VALUES(?,?,?,?,?)").run(expected.authority_incarnation, expected.authority_revision, "TARGET", targetSha, keySha);
      if (eligible) this.db.query("UPDATE authorized_targets SET state='REVOKED' WHERE key_sha256=? AND state='CURRENT'").run(keySha);
      this.db.query("INSERT INTO authorized_targets VALUES(?,?,?,?,?,?,?,?)").run(targetSha, keySha, operationId, expected.authority_incarnation, expected.authority_revision, expected.evaluation_job_id, envelope, eligible ? "CURRENT" : "REVOKED");
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=? AND status IN('ACKNOWLEDGED','UNRESOLVED')").run(json({ target_envelope: envelope }), operationId);
      if (eligible) this.db.query("UPDATE governed_runs SET state='CLOSED',authority_high_water=?,updated_at=? WHERE key_sha256=? AND state IN('CLOSED','RECOVERY_REQUIRED')").run(expected.authority_revision, new Date().toISOString(), keySha);
    }).immediate();
    if (!eligible) throw new CustodyControlError("INCIDENT_TERMINAL");
    return envelope;
  }

  markEffectUnresolved(key: CanonicalRunKey, operationId: string, kind: "ISSUE_JOB" | "ASSIGN_TARGET"): void {
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, kind, keySha);
    if (op.status !== "ACKNOWLEDGED") throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    this.db.transaction(() => {
      this.db.query("UPDATE controller_operations SET status='UNRESOLVED' WHERE operation_id=?").run(operationId);
      this.db.query("UPDATE governed_runs SET state='RECOVERY_REQUIRED',updated_at=? WHERE key_sha256=? AND state!='INCIDENT'").run(new Date().toISOString(), keySha);
    }).immediate();
  }
  markEffectUnresolvedIfAcknowledged(key: CanonicalRunKey, operationId: string, kind: "ISSUE_JOB" | "ASSIGN_TARGET"): void {
    const op = this.requireOperationFor(operationId, kind, canonicalKeySha256(key));
    if (op.status === "ACKNOWLEDGED") this.markEffectUnresolved(key, operationId, kind);
  }
  resumeExactReconciliation(key: CanonicalRunKey, operationId: string, kind: "ISSUE_JOB" | "ASSIGN_TARGET"): OperationRow {
    const op = this.requireOperationFor(operationId, kind, canonicalKeySha256(key));
    if (op.status !== "UNRESOLVED") throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    return op;
  }

  appliedEffect<T>(key: CanonicalRunKey, operationId: string, kind: "ISSUE_JOB" | "ASSIGN_TARGET"): T | null {
    const op = this.operation(operationId);
    if (!op) return null;
    this.assertOperationDomain(op, kind, canonicalKeySha256(key));
    if (op.status !== "APPLIED" || !op.result_json) return null;
    return JSON.parse(op.result_json) as T;
  }

  publicationEligibility(key: CanonicalRunKey, targetEnvelope: string): Readonly<{ current: true; target_sha256: string }> {
    const keySha = canonicalKeySha256(key), row = this.requireClosedCurrent(keySha), targetSha = hash(targetEnvelope); this.assertWitnessCurrent(row);
    const target = this.db.query<{ target_envelope: string }, [string, string]>("SELECT target_envelope FROM authorized_targets WHERE target_sha256=? AND key_sha256=? AND state='CURRENT'").get(targetSha, keySha);
    if (!target || target.target_envelope !== targetEnvelope) throw new CustodyControlError("CURRENT_TARGET_REQUIRED");
    return Object.freeze({ current: true, target_sha256: targetSha });
  }

  safetyStatus(key: CanonicalRunKey): Readonly<Record<string, unknown>> { return this.state(key); }
  operationStatus(key: CanonicalRunKey, operationId: string): Readonly<{ kind: string; status: string; result: unknown }> {
    const op = this.requireOperationForAny(operationId, canonicalKeySha256(key));
    return Object.freeze({ kind: op.kind, status: op.status, result: op.result_json ? JSON.parse(op.result_json) : null });
  }

  verifyAuthoritySnapshot(key: CanonicalRunKey, snapshot: AuthoritySnapshot): void {
    const keySha = canonicalKeySha256(key), row = this.requireRun(keySha); validateAuthorityContinuity(snapshot.continuity);
    let failure: string | null = snapshot.continuity.incarnation !== row.authority_incarnation ? "AUTHORITY_INCARNATION_MISMATCH" : snapshot.continuity.revision < row.authority_high_water ? "AUTHORITY_ROLLBACK" : null;
    const knownJobs = this.db.query<{ evaluation_job_id: string; descriptor_sha256: string }, [string]>("SELECT evaluation_job_id,descriptor_sha256 FROM authorized_jobs WHERE key_sha256=?").all(keySha), actualJobs = new Map(snapshot.jobs.map((job) => [job.descriptor.evaluation_job_id, job.descriptor_sha256]));
    for (const known of knownJobs) if (actualJobs.get(known.evaluation_job_id) !== known.descriptor_sha256) failure ??= "AUTHORITY_EFFECT_DISAPPEARED";
    for (const job of snapshot.jobs) if (!knownJobs.some((known) => known.evaluation_job_id === job.descriptor.evaluation_job_id) && !this.pendingJobMatches(keySha, job)) {
      const prior = this.db.query<{ effect_sha256: string }, [string, number]>("SELECT effect_sha256 FROM authority_revision_effects WHERE authority_incarnation=? AND authority_revision=?").get(job.descriptor.authority_incarnation, job.descriptor.authority_revision);
      if (prior && prior.effect_sha256 !== job.descriptor_sha256) failure = "AUTHORITY_REVISION_REUSED";
      else failure ??= "UNGUARDED_AUTHORITY_EFFECT";
    }
    const knownTargets = this.db.query<{ target_sha256: string }, [string]>("SELECT target_sha256 FROM authorized_targets WHERE key_sha256=?").all(keySha), actualTargets = new Map(snapshot.targets.map((envelope) => [hash(envelope), envelope]));
    for (const known of knownTargets) if (!actualTargets.has(known.target_sha256)) failure ??= "AUTHORITY_EFFECT_DISAPPEARED";
    for (const [digest, envelope] of actualTargets) if (!knownTargets.some((known) => known.target_sha256 === digest) && !this.pendingTargetMatches(keySha, envelope)) {
      const target = verifyExpectedEvaluationTargetEnvelope(envelope, this.authorityBinding), prior = this.db.query<{ effect_sha256: string }, [string, number]>("SELECT effect_sha256 FROM authority_revision_effects WHERE authority_incarnation=? AND authority_revision=?").get(target.authority_incarnation, target.target_revision);
      if (prior && prior.effect_sha256 !== digest) failure = "AUTHORITY_REVISION_REUSED";
      else failure ??= "UNGUARDED_AUTHORITY_EFFECT";
    }
    if (failure) {
      this.recordIncident(row, failure, snapshot, `incident:${hash(`${keySha}\n${failure}\n${json(snapshot)}`).slice(0, 40)}`);
      throw new CustodyControlError(failure);
    }
  }

  state(key: CanonicalRunKey): Readonly<Record<string, unknown>> {
    const row = this.requireRun(canonicalKeySha256(key));
    return Object.freeze({ key_sha256: row.key_sha256, key: JSON.parse(row.key_json), binding: JSON.parse(row.binding_json), state: row.state, revision: row.revision, witness_digest: row.witness_digest, admitted: row.admitted_json ? JSON.parse(row.admitted_json) : null, lease_expires_ms: row.lease_expires_ms, canonical_manifest_sha256: row.canonical_manifest_sha256, authority_incarnation: row.authority_incarnation, authority_high_water: row.authority_high_water, incident_count: this.db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM custody_incidents WHERE key_sha256=?").get(row.key_sha256)!.n });
  }

  private run(keySha: string): RunRow | null { return this.db.query<RunRow, [string]>("SELECT * FROM governed_runs WHERE key_sha256=?").get(keySha) ?? null; }
  private operation(id: string): OperationRow | null { return this.db.query<OperationRow, [string]>("SELECT * FROM controller_operations WHERE operation_id=?").get(id) ?? null; }
  private requireRun(keySha: string): RunRow { const row = this.run(keySha); if (!row) throw new CustodyControlError("RUN_NOT_RESERVED"); return row; }
  private requireOperationFor(id: string, kind: string, keySha: string): OperationRow { const op = this.operation(id); if (!op || op.kind !== kind || op.key_sha256 !== keySha) throw new CustodyControlError(op ? "OPERATION_DOMAIN_CONFLICT" : "OPERATION_NOT_FOUND"); return op; }
  private requireOperationForAny(id: string, keySha: string): OperationRow { const op = this.operation(id); if (!op || op.key_sha256 !== keySha) throw new CustodyControlError(op ? "OPERATION_DOMAIN_CONFLICT" : "OPERATION_NOT_FOUND"); return op; }
  private assertOperation(op: OperationRow, kind: string, keySha: string, expected: unknown): void { if (op.kind !== kind || op.key_sha256 !== keySha || op.expected_json !== json(expected)) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT"); }
  private assertOperationDomain(op: OperationRow, kind: string, keySha: string): void { if (op.kind !== kind || op.key_sha256 !== keySha) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT"); }
  private assertNoOpenOperation(keySha: string): void { if (this.db.query("SELECT 1 FROM controller_operations WHERE key_sha256=? AND status IN('PENDING','ACKNOWLEDGED','UNRESOLVED')").get(keySha)) throw new CustodyControlError("CONTINUITY_OPERATION_PENDING"); }
  private assertWitnessCurrent(row: RunRow): void { const current = this.witness.current(row.key_sha256); if (!current || current.record.sequence !== row.revision || current.record.record_digest !== row.witness_digest) throw new CustodyControlError("CONTINUITY_HIGH_WATER_MISMATCH"); }
  private requireClosedCurrent(keySha: string): RunRow { const row = this.requireRun(keySha); this.assertNoOpenOperation(keySha); this.assertWitnessCurrent(row); if (row.state !== "CLOSED" || !row.canonical_manifest_sha256 || !row.canonical_release_json) throw new CustodyControlError("CANONICAL_CLOSE_REQUIRED"); return row; }
  private assertAuthorityExpectation(row: RunRow, incarnation: string, revision: number): void { if (incarnation !== row.authority_incarnation) throw new CustodyControlError("AUTHORITY_INCARNATION_MISMATCH"); if (!Number.isSafeInteger(revision) || revision <= row.authority_high_water) throw new CustodyControlError("AUTHORITY_ROLLBACK"); }

  private prepareOperation(operationId: string, keySha: string, kind: string, input: unknown, expected: unknown): OperationRow {
    if (!TOKEN.test(operationId) || !TOKEN.test(kind)) throw new CustodyControlError("OPERATION_INVALID");
    const existing = this.operation(operationId), inputJson = json(input), expectedJson = json(expected);
    if (existing) { if (existing.key_sha256 !== keySha || existing.kind !== kind || existing.input_json !== inputJson || existing.expected_json !== expectedJson) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT"); return existing; }
    this.assertNoOpenOperation(keySha);
    const row = this.requireRun(keySha), sequence = row.revision + 1, payloadSha = hash(json({ input: JSON.parse(inputJson), expected: JSON.parse(expectedJson) })), unsigned = { schema: WITNESS_SCHEMA, operation_id: operationId, key_sha256: keySha, sequence, previous_digest: row.witness_digest, transition: kind, payload_sha256: payloadSha }, record: WitnessRecord = { ...unsigned, record_digest: hash(json(unsigned)) };
    this.db.query("INSERT INTO controller_operations VALUES(?,?,?,?,?,?,?,?,?,?,NULL,?)").run(operationId, keySha, kind, hash(inputJson), inputJson, expectedJson, sequence, row.witness_digest, json(record), "PENDING", new Date().toISOString());
    return this.requireOperationFor(operationId, kind, keySha);
  }

  private finishTransition(op: OperationRow, applied: boolean): Readonly<Record<string, unknown>> {
    if (op.status === "PENDING") {
      const ack = this.obtainWitnessAck(op);
      this.db.transaction(() => {
        const row = this.requireRun(op.key_sha256);
        if (row.revision + 1 !== op.sequence || row.witness_digest !== op.previous_digest || json(ack.record) !== op.witness_record_json) throw new CustodyControlError("CONTROLLER_PREDECESSOR_CONFLICT");
        this.db.query("UPDATE governed_runs SET revision=?,witness_digest=?,updated_at=? WHERE key_sha256=?").run(op.sequence, ack.record.record_digest, ack.acknowledged_at, op.key_sha256);
        this.db.query("UPDATE controller_operations SET status=? WHERE operation_id=?").run(applied ? "APPLIED" : "ACKNOWLEDGED", op.operation_id);
        if (applied && op.kind === "RESERVE") this.db.query("UPDATE governed_runs SET state='RESERVED' WHERE key_sha256=? AND state='RESERVING'").run(op.key_sha256);
      }).immediate();
    }
    return this.stateBySha(op.key_sha256);
  }

  private obtainWitnessAck(op: OperationRow): WitnessAcknowledgment {
    const started = performance.now(), stored = JSON.parse(op.witness_record_json) as WitnessRecord;
    try { const ack = this.witness.readOperation(op.operation_id) ?? this.witness.append(stored); this.metric(op, "SUCCEEDED", started, "witness.append"); return ack; }
    catch (error) { this.metric(op, "BLOCKED", started, "witness.append"); throw error; }
  }
  private metric(op: OperationRow, outcome: CustodyControlMetric["outcome"], started: number, name: CustodyControlMetric["name"]): void { this.instrumentation(Object.freeze({ name, operation_id: op.operation_id, key_sha256: op.key_sha256, operation_kind: op.kind, outcome, elapsed_ms: performance.now() - started, observed_wall_time_ms: Date.now(), monotonic_ms: performance.now() })); }
  private stateBySha(keySha: string): Readonly<Record<string, unknown>> { return this.state(JSON.parse(this.requireRun(keySha).key_json)); }

  private recordIncident(row: RunRow, kind: string, evidence: unknown, operationId: string): void {
    const evidenceJson = json(evidence), evidenceSha = hash(evidenceJson), incidentId = `incident:${hash(`${row.key_sha256}\n${kind}\n${evidenceSha}`).slice(0, 40)}`;
    this.db.transaction(() => {
      this.db.query("INSERT OR IGNORE INTO custody_incidents VALUES(?,?,?,?,?,?)").run(incidentId, row.key_sha256, kind, evidenceSha, evidenceJson, new Date().toISOString());
      this.db.query("UPDATE governed_runs SET state='INCIDENT',lease_expires_ms=NULL,updated_at=? WHERE key_sha256=?").run(new Date().toISOString(), row.key_sha256);
      this.db.query("UPDATE authorized_jobs SET current_eligible=0 WHERE key_sha256=?").run(row.key_sha256);
      this.db.query("UPDATE authorized_targets SET state='REVOKED' WHERE key_sha256=? AND state='CURRENT'").run(row.key_sha256);
    }).immediate();
    if (!this.db.query("SELECT 1 FROM controller_operations WHERE key_sha256=? AND status IN('PENDING','ACKNOWLEDGED','UNRESOLVED')").get(row.key_sha256) && !this.operation(operationId)) {
      const op = this.prepareOperation(operationId, row.key_sha256, "INCIDENT", { incident_id: incidentId, kind, evidence_sha256: evidenceSha }, {});
      this.finishTransition(op, true);
    }
  }

  private pendingJobMatches(keySha: string, job: AuthorityEvaluationJob): boolean {
    const op = this.db.query<OperationRow, [string]>("SELECT * FROM controller_operations WHERE key_sha256=? AND kind='ISSUE_JOB' AND status IN('ACKNOWLEDGED','UNRESOLVED')").get(keySha);
    if (!op) return false;
    const expected = JSON.parse(op.expected_json) as Record<string, unknown>;
    return job.descriptor.authority_revision === expected.authority_revision && job.descriptor.authority_incarnation === expected.authority_incarnation && job.descriptor.workflow_instruction_id === expected.workflow_instruction_id;
  }
  private pendingTargetMatches(keySha: string, envelope: string): boolean {
    const op = this.db.query<OperationRow, [string]>("SELECT * FROM controller_operations WHERE key_sha256=? AND kind='ASSIGN_TARGET' AND status IN('ACKNOWLEDGED','UNRESOLVED')").get(keySha);
    if (!op) return false;
    const expected = JSON.parse(op.expected_json) as Record<string, unknown>, target = verifyExpectedEvaluationTargetEnvelope(envelope, this.authorityBinding);
    return target.authority_incarnation === expected.authority_incarnation && target.target_revision === expected.authority_revision && target.evaluation_job_id === expected.evaluation_job_id && target.verifier_session_id === expected.verifier_session_id;
  }
}

export type LaunchedRole = Readonly<{ session: LocalRoleSession; evidence: Readonly<Record<string, unknown>> }>;
export type SafetyCommand = Readonly<{ kind: "STATUS_READ" }> | Readonly<{ kind: "RECONCILE_READ"; operation_id: string }> | Readonly<{ kind: "REVOKE"; session_id: string }>;

export class TestOnlyPreCustodyHost {
  #authority: CatfoodRoleAuthority;
  #controller: CustodyController;
  #authorityBinding: RoleChannelBinding;
  #authorityPath: string;
  #fenceAdapter: TrustedFenceAdapter;
  #now: () => number;
  #lostJobs = new Map<string, AuthorityEvaluationJob>();
  #lostTargets = new Map<string, string>();

  constructor(input: { authority_path: string; authority_binding: RoleChannelBinding; authority_private_key: string | KeyObject; controller: CustodyController; fence_adapter: TrustedFenceAdapter; now?: () => number }) {
    if (input.authority_binding.trust_domain !== "TEST_ONLY") throw new CustodyControlError("TEST_ONLY_HOST_REQUIRED");
    this.#authorityBinding = Object.freeze(structuredClone(input.authority_binding)); this.#authorityPath = resolve(input.authority_path); this.#controller = input.controller; this.#fenceAdapter = input.fence_adapter; this.#now = input.now ?? Date.now;
    this.#authority = new CatfoodRoleAuthority(this.#authorityPath, this.#authorityBinding, input.authority_private_key, input.now);
  }
  close(): void { this.#authority.close(); this.#controller.close(); }
  reserveRun(binding: RunBinding, operationId: string) { return this.#controller.reserveRun(binding, this.#readContinuity(), operationId); }

  admitCustodian(input: { key: CanonicalRunKey; operation_id: string; lease_expires_ms: number; host_incarnation: string; subject?: RuntimeSubject }): LaunchedRole {
    this.#audit(input.key);
    const pair = generateKeyPairSync("ed25519"), eb = this.#enrollmentBinding(input.key, "custodian"), subject = input.subject ?? collectCurrentRuntimeSubject(eb), launch = observeTestOnlyRoleLaunch(eb, "custodian", subject), candidate = { subject_sha256: hash(json(subject)), launch_id: String(launch.launch_id), action_key_fingerprint: roleChannelPublicKeyFingerprint(pair.publicKey.export({ type: "spki", format: "pem" }).toString()), process_id: String(subject.pid), host_incarnation: input.host_incarnation, build_sha256: String(roleChannelArtifactDescriptor("custodian").artifact_root) };
    this.#controller.beginCustodianAdmission(input.key, candidate, input.lease_expires_ms, input.operation_id);
    let session: LocalRoleSession | undefined;
    try {
      const assignment = this.#authority.issueLaunchKeyAssignment({ role: "custodian", scope: this.#scope(input.key), subject, launch, descriptor: roleChannelArtifactDescriptor("custodian"), public_key_pem: pair.publicKey.export({ type: "spki", format: "pem" }).toString() });
      session = registerLocalRoleSessionForTest({ binding: this.#authorityBinding, transport: this.#authority.transport, assignment_envelope: assignment, private_key: pair.privateKey, now: this.#now });
      const evidence = localRoleEvidence(session), admitted = admittedFromEvidence(evidence, this.#authorityBinding, this.#scope(input.key), input.host_incarnation);
      this.#controller.completeCustodianAdmission(input.key, input.operation_id, admitted);
      return Object.freeze({ session, evidence });
    } catch (error) {
      if (session) this.#authority.revokeSession(String(decodeEvidence(session).session_id));
      this.#controller.failAdmission(input.key, input.operation_id);
      throw error;
    }
  }

  launchRole(key: CanonicalRunKey, role: Exclude<CatfoodEnrollmentRole, "custodian">, subjectOverride?: RuntimeSubject): LaunchedRole {
    this.#audit(key); this.#controller.assertSupportingRoleLaunch(key, role);
    const outer = generateKeyPairSync("ed25519"), outerPublic = outer.publicKey.export({ type: "spki", format: "pem" }).toString(), writer: WriterCredentialReference | undefined = role === "writer" ? { key_id: "writer:test", key_version: "v1", public_key_sha256: roleChannelPublicKeyFingerprint(outerPublic), public_key_pem: outerPublic } : undefined, eb = this.#enrollmentBinding(key, role, writer), observed = collectCurrentRuntimeSubject(eb), subject = subjectOverride ?? (role === "writer" ? { ...observed, pid: observed.pid + 1, process_start: `${observed.process_start}:writer` } : observed), launch = observeTestOnlyRoleLaunch(eb, role, subject), pair = generateKeyPairSync("ed25519"), assignment = this.#authority.issueLaunchKeyAssignment({ role, scope: this.#scope(key), subject, launch, descriptor: roleChannelArtifactDescriptor(role), public_key_pem: pair.publicKey.export({ type: "spki", format: "pem" }).toString(), writer_credential: writer }), session = registerLocalRoleSessionForTest({ binding: this.#authorityBinding, transport: this.#authority.transport, assignment_envelope: assignment, private_key: pair.privateKey, now: this.#now });
    return Object.freeze({ session, evidence: localRoleEvidence(session) });
  }

  closeCustody(input: { key: CanonicalRunKey; manifest: CatfoodSealedInputManifestV1; release_receipt: RoleActionReceiptV2; operation_id: string }) { this.#audit(input.key); return this.#controller.closeManifest(input.key, input.manifest, input.release_receipt, input.operation_id); }

  issueEvaluationJob(input: { key: CanonicalRunKey; operation_id: string; evaluator_evidence: Readonly<Record<string, unknown>>; writer_evidence: Readonly<Record<string, unknown>>; role_evidence_sha256: string; workflow_instruction_id: string; workflow_instruction_sha256: string; commit_lifetime_ms: number; lose_response_for_test?: boolean }): AuthorityEvaluationJob {
    this.#audit(input.key);
    const replay = this.#controller.appliedEffect<AuthorityEvaluationJob>(input.key, input.operation_id, "ISSUE_JOB");
    if (replay) return replay;
    const continuity = this.#readContinuity(), canonical = this.#controller.canonicalEvidence(input.key), scope = this.#scope(input.key), evaluator = verifyRoleEvidenceV4(input.evaluator_evidence, this.#authorityBinding, "evaluator", scope), writer = verifyRoleEvidenceV4(input.writer_evidence, this.#authorityBinding, "writer", scope), expected = { authority_incarnation: continuity.incarnation, authority_revision: continuity.revision + 1, workflow_instruction_id: input.workflow_instruction_id, release_receipt_sha256: canonical.release.receipt_sha256 };
    this.#controller.beginJobEffect(input.key, input.operation_id, expected);
    try {
      const job = this.#authority.issueEvaluationJob({ custody_release_receipt: canonical.release, manifest: canonical.manifest, evaluator, writer, role_evidence_sha256: input.role_evidence_sha256, workflow_instruction_id: input.workflow_instruction_id, workflow_instruction_sha256: input.workflow_instruction_sha256, commit_lifetime_ms: input.commit_lifetime_ms });
      if (input.lose_response_for_test) { this.#lostJobs.set(input.operation_id, job); this.#controller.markEffectUnresolved(input.key, input.operation_id, "ISSUE_JOB"); throw new CustodyControlError("TEST_ONLY_RESPONSE_LOST"); }
      return this.#controller.completeJobEffect(input.key, input.operation_id, job);
    } catch (error) {
      if (!(error instanceof CustodyControlError && error.code === "TEST_ONLY_RESPONSE_LOST")) this.#controller.markEffectUnresolvedIfAcknowledged(input.key, input.operation_id, "ISSUE_JOB");
      throw error;
    }
  }

  reconcileEvaluationJob(key: CanonicalRunKey, operationId: string): AuthorityEvaluationJob {
    this.#audit(key);
    const op = this.#controller.resumeExactReconciliation(key, operationId, "ISSUE_JOB"), expected = JSON.parse(op.expected_json) as Record<string, unknown>, job = this.#lostJobs.get(operationId) ?? this.#readJobByRevision(key, String(expected.authority_incarnation), Number(expected.authority_revision), String(expected.workflow_instruction_id)), result = this.#controller.completeJobEffect(key, operationId, job);
    this.#lostJobs.delete(operationId);
    return result;
  }

  assignExpectedTarget(input: { key: CanonicalRunKey; operation_id: string; verifier_evidence: Readonly<Record<string, unknown>>; evaluation_job_id: string; lose_response_for_test?: boolean }): string {
    this.#audit(input.key);
    const replay = this.#controller.appliedEffect<{ target_envelope: string }>(input.key, input.operation_id, "ASSIGN_TARGET");
    if (replay) return replay.target_envelope;
    const continuity = this.#readContinuity(), scope = this.#scope(input.key), verifier = verifyRoleEvidenceV4(input.verifier_evidence, this.#authorityBinding, "verifier", scope), enrollment = decodeSignedEnvelope(String(input.verifier_evidence.enrollment_envelope_json)), expected = { authority_incarnation: continuity.incarnation, authority_revision: continuity.revision + 1, evaluation_job_id: input.evaluation_job_id, verifier_session_id: String(enrollment.session_id) };
    this.#controller.beginTargetEffect(input.key, input.operation_id, expected);
    try {
      const envelope = this.#authority.assignExpectedEvaluationTarget({ verifier, evaluation_job_id: input.evaluation_job_id, purpose: "VERIFY_EXPECTED" });
      if (input.lose_response_for_test) { this.#lostTargets.set(input.operation_id, envelope); this.#controller.markEffectUnresolved(input.key, input.operation_id, "ASSIGN_TARGET"); throw new CustodyControlError("TEST_ONLY_RESPONSE_LOST"); }
      return this.#controller.completeTargetEffect(input.key, input.operation_id, envelope);
    } catch (error) {
      if (!(error instanceof CustodyControlError && error.code === "TEST_ONLY_RESPONSE_LOST")) this.#controller.markEffectUnresolvedIfAcknowledged(input.key, input.operation_id, "ASSIGN_TARGET");
      throw error;
    }
  }

  reconcileExpectedTarget(key: CanonicalRunKey, operationId: string): string {
    this.#audit(key);
    const op = this.#controller.resumeExactReconciliation(key, operationId, "ASSIGN_TARGET"), expected = JSON.parse(op.expected_json) as Record<string, unknown>, envelope = this.#lostTargets.get(operationId) ?? this.#readTargetByRevision(key, String(expected.authority_incarnation), Number(expected.authority_revision), String(expected.evaluation_job_id), String(expected.verifier_session_id)), result = this.#controller.completeTargetEffect(key, operationId, envelope);
    this.#lostTargets.delete(operationId);
    return result;
  }

  publicationEligibility(key: CanonicalRunKey, targetEnvelope: string) { this.#audit(key); return this.#controller.publicationEligibility(key, targetEnvelope); }
  safety(key: CanonicalRunKey, command: SafetyCommand): unknown {
    if (command.kind === "STATUS_READ") return this.#controller.safetyStatus(key);
    if (command.kind === "RECONCILE_READ") return this.#controller.operationStatus(key, command.operation_id);
    if (command.kind === "REVOKE") { this.#authority.revokeSession(command.session_id); return Object.freeze({ revoked_session_id: command.session_id }); }
    throw new CustodyControlError("SAFETY_COMMAND_INVALID");
  }

  observeLeaseAndReplace(input: { key: CanonicalRunKey; observed_now_ms: number; operation_id: string; lease_expires_ms: number; host_incarnation: string; subject?: RuntimeSubject }): LaunchedRole {
    if (!this.#controller.observeLeaseExpiry(input.key, input.observed_now_ms)) throw new CustodyControlError("LEASE_NOT_EXPIRED");
    const old = this.#controller.admitted(input.key); this.#authority.revokeSession(old.session_id);
    const observation = this.#fenceAdapter.inspect({ key: input.key, admitted: old, binding: this.#controller.bindingFor(input.key) });
    this.#controller.assertReplacementAllowed(input.key, observation, input.lease_expires_ms);
    const pair = generateKeyPairSync("ed25519"), eb = this.#enrollmentBinding(input.key, "custodian"), subject = input.subject ?? collectCurrentRuntimeSubject(eb), launch = observeTestOnlyRoleLaunch(eb, "custodian", subject), assignment = this.#authority.issueLaunchKeyAssignment({ role: "custodian", scope: this.#scope(input.key), subject, launch, descriptor: roleChannelArtifactDescriptor("custodian"), public_key_pem: pair.publicKey.export({ type: "spki", format: "pem" }).toString() }), session = registerLocalRoleSessionForTest({ binding: this.#authorityBinding, transport: this.#authority.transport, assignment_envelope: assignment, private_key: pair.privateKey, now: this.#now }), admitted = admittedFromEvidence(localRoleEvidence(session), this.#authorityBinding, this.#scope(input.key), input.host_incarnation);
    try { this.#controller.replaceCustodian(input.key, observation, admitted, input.lease_expires_ms, input.operation_id); }
    catch (error) { this.#authority.revokeSession(admitted.session_id); throw error; }
    return Object.freeze({ session, evidence: localRoleEvidence(session) });
  }

  #audit(key: CanonicalRunKey): void { this.#controller.verifyAuthoritySnapshot(key, this.#snapshot(key)); }
  #snapshot(key: CanonicalRunKey): AuthoritySnapshot {
    const db = new Database(this.#authorityPath, { readonly: true, strict: true });
    try {
      const continuity = db.query<AuthorityContinuity, []>("SELECT incarnation,revision FROM role_authority_continuity WHERE singleton=1").get();
      if (!continuity) throw new CustodyControlError("AUTHORITY_CONTINUITY_MISSING");
      const jobs = db.query<{ descriptor_envelope: string }, []>("SELECT descriptor_envelope FROM evaluation_jobs").all().map((row) => verifyEvaluationJobEnvelope(row.descriptor_envelope, this.#authorityBinding)).filter((job) => canonicalKeySha256(scopeKey(job.descriptor.scope)) === canonicalKeySha256(key));
      const targets = db.query<{ target_envelope: string }, []>("SELECT target_envelope FROM expected_evaluation_targets").all().map((row) => row.target_envelope).filter((envelope) => canonicalKeySha256(scopeKey(verifyExpectedEvaluationTargetEnvelope(envelope, this.#authorityBinding).scope as RoleRunScope)) === canonicalKeySha256(key));
      return Object.freeze({ continuity: Object.freeze(continuity), jobs: Object.freeze(jobs), targets: Object.freeze(targets) });
    } finally { db.close(); }
  }
  #readContinuity(): AuthorityContinuity {
    const db = new Database(this.#authorityPath, { readonly: true, strict: true });
    try { const row = db.query<AuthorityContinuity, []>("SELECT incarnation,revision FROM role_authority_continuity WHERE singleton=1").get(); if (!row) throw new CustodyControlError("AUTHORITY_CONTINUITY_MISSING"); return Object.freeze(row); }
    finally { db.close(); }
  }
  #readJobByRevision(key: CanonicalRunKey, incarnation: string, revision: number, instruction: string): AuthorityEvaluationJob {
    const matches = this.#snapshot(key).jobs.filter((job) => job.descriptor.authority_incarnation === incarnation && job.descriptor.authority_revision === revision && job.descriptor.workflow_instruction_id === instruction);
    if (matches.length !== 1) throw new CustodyControlError("EXACT_AUTHORITY_EFFECT_NOT_FOUND");
    return matches[0]!;
  }
  #readTargetByRevision(key: CanonicalRunKey, incarnation: string, revision: number, jobId: string, verifierSessionId: string): string {
    const matches = this.#snapshot(key).targets.filter((envelope) => { const target = verifyExpectedEvaluationTargetEnvelope(envelope, this.#authorityBinding); return target.authority_incarnation === incarnation && target.target_revision === revision && target.evaluation_job_id === jobId && target.verifier_session_id === verifierSessionId; });
    if (matches.length !== 1) throw new CustodyControlError("EXACT_AUTHORITY_EFFECT_NOT_FOUND");
    return matches[0]!;
  }
  #scope(key: CanonicalRunKey): RoleRunScope { const binding = this.#controller.bindingFor(key); return { ...key, environment_instance_id: binding.environment_instance_id, spec_sha256: binding.spec_sha256 }; }
  #enrollmentBinding(key: CanonicalRunKey, role: CatfoodEnrollmentRole, writer?: WriterCredentialReference): TestEnrollmentBinding {
    const run = this.#controller.bindingFor(key);
    return { trust_domain: "TEST_ONLY", issuer: this.#authorityBinding.issuer, issuer_key_id: this.#authorityBinding.issuer_key_id, audience: this.#authorityBinding.audience, origin: this.#authorityBinding.origin, credential: this.#authorityBinding.credential, public_key_pem: this.#authorityBinding.authority_public_key_pem, environment_identity: run.environment_instance_id, deployment_id: key.deployment_id, enrollment_namespace: this.#authorityBinding.enrollment_namespace, build_policy_sha256: this.#authorityBinding.build_policy_sha256, accepted_snapshot_id: this.#authorityBinding.accepted_snapshot_id, accepted_snapshot_sha256: this.#authorityBinding.accepted_snapshot_sha256, launch_ticket: `launch:${role}`, writer_signing_key_id: writer?.key_id ?? "none", writer_signing_key_version: writer?.key_version ?? "none", writer_signing_public_key_pem: writer?.public_key_pem ?? this.#authorityBinding.authority_public_key_pem };
  }
}

export function canonicalKeySha256(key: CanonicalRunKey): string { validateKey(key); return hash(json(key)); }
function scopeKey(scope: RoleRunScope): CanonicalRunKey { return { environment_type: scope.environment_type, deployment_id: scope.deployment_id, organization_id: scope.organization_id, tenant_id: scope.tenant_id, account_id: scope.account_id, run_id: scope.run_id }; }
function validateKey(key: CanonicalRunKey): void { if (Object.values(key).some((value) => typeof value !== "string" || !TOKEN.test(value))) throw new CustodyControlError("CANONICAL_KEY_INVALID"); }
function requireSha(value: string): void { if (!SHA256.test(value)) throw new CustodyControlError("SHA256_INVALID"); }
function validateAuthorityContinuity(value: AuthorityContinuity): void { if (!TOKEN.test(value.incarnation) || !Number.isSafeInteger(value.revision) || value.revision < 1) throw new CustodyControlError("AUTHORITY_CONTINUITY_INVALID"); }
function validateRunBinding(value: RunBinding): void { validateKey(value.key); if (value.test_only !== true || !TOKEN.test(value.environment_instance_id) || !TOKEN.test(value.control_store_id) || !TOKEN.test(value.checkpoint_store_id) || !Number.isSafeInteger(value.producer_generation) || value.producer_generation < 1) throw new CustodyControlError("RUN_BINDING_INVALID"); for (const item of [value.spec_sha256, value.window_sha256, value.go_artifact_sha256, value.go_policy_ref_sha256, value.store_pair_lineage_sha256, value.journal_head_sha256, value.checkpoint_head_sha256, value.control_snapshot_sha256, value.checkpoint_snapshot_sha256, value.pair_common_cut_sha256]) requireSha(item); }
function validateAdmissionCandidate(value: Readonly<Record<string, string>>): void { for (const item of [value.launch_id, value.process_id, value.host_incarnation]) if (!TOKEN.test(item)) throw new CustodyControlError("CUSTODIAN_SUBJECT_INVALID"); for (const item of [value.subject_sha256, value.action_key_fingerprint, value.build_sha256]) requireSha(item); }
function validateAdmitted(value: AdmittedCustodian): void { for (const item of [value.session_id, value.assignment_id, value.launch_id, value.process_id, value.host_incarnation]) if (!TOKEN.test(item)) throw new CustodyControlError("ADMISSION_EVIDENCE_MISMATCH"); for (const item of [value.action_key_fingerprint, value.subject_sha256, value.build_sha256]) requireSha(item); }
function validateFenceObservation(value: FenceObservation): void { if (!TOKEN.test(value.old_session_id)) throw new CustodyControlError("REPLACEMENT_NOT_PROVEN"); for (const item of [value.journal_head_sha256, value.checkpoint_head_sha256, value.control_snapshot_sha256, value.checkpoint_snapshot_sha256, value.pair_common_cut_sha256]) requireSha(item); }
function sameLineage(binding: RunBinding, observed: FenceObservation): boolean { return binding.journal_head_sha256 === observed.journal_head_sha256 && binding.checkpoint_head_sha256 === observed.checkpoint_head_sha256 && binding.control_snapshot_sha256 === observed.control_snapshot_sha256 && binding.checkpoint_snapshot_sha256 === observed.checkpoint_snapshot_sha256 && binding.pair_common_cut_sha256 === observed.pair_common_cut_sha256; }
function manifestMatchesRun(manifest: CatfoodSealedInputManifestV1, binding: RunBinding, keySha: string): boolean { return canonicalKeySha256(scopeKey(manifest.scope)) === keySha && manifest.scope.environment_instance_id === binding.environment_instance_id && manifest.scope.spec_sha256 === binding.spec_sha256 && hash(json(manifest.window)) === binding.window_sha256 && manifest.go.artifact_sha256 === binding.go_artifact_sha256 && manifest.journal.head_sha256 === binding.journal_head_sha256 && manifest.checkpoint.checkpoint_sha256 === binding.checkpoint_head_sha256 && manifest.control.raw_sha256 === binding.control_snapshot_sha256 && manifest.checkpoint_store.raw_sha256 === binding.checkpoint_snapshot_sha256 && manifest.pair_common_cut_sha256 === binding.pair_common_cut_sha256 && manifest.trust.test_only === true; }
function publicKeyFingerprint(pem: string): string { return hash(createPublicKey(pem).export({ type: "spki", format: "der" }) as Buffer); }
function decodeSignedEnvelope(envelope: string): Record<string, any> { const outer = JSON.parse(envelope) as { payload: string }; return JSON.parse(Buffer.from(outer.payload, "base64url").toString()); }
function decodeEvidence(session: LocalRoleSession): Record<string, any> { return decodeSignedEnvelope(String(localRoleEvidence(session).enrollment_envelope_json)); }
function admittedFromEvidence(evidence: Readonly<Record<string, unknown>>, binding: RoleChannelBinding, scope: RoleRunScope, hostIncarnation: string): AdmittedCustodian { verifyRoleEvidenceV4(evidence, binding, "custodian", scope); const enrollment = decodeSignedEnvelope(String(evidence.enrollment_envelope_json)), assignment = decodeSignedEnvelope(String(evidence.assignment_envelope_json)), launch = enrollment.launch as Record<string, unknown>, subject = enrollment.subject as Record<string, unknown>, descriptor = enrollment.accepted_role_descriptor as Record<string, unknown>; return Object.freeze({ session_id: String(enrollment.session_id), assignment_id: String(assignment.assignment_id), action_key_fingerprint: String(enrollment.action_key_fingerprint), subject_sha256: hash(json(subject)), launch_id: String(launch.launch_id), process_id: String(subject.pid), host_incarnation: hostIncarnation, build_sha256: String(descriptor.artifact_root) }); }
