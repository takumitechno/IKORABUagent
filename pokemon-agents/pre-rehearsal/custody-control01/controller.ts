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
const CONTROLLER_SCHEMA = "pre-custody-control.v3";
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

export interface LineageState {
  readonly store_pair_lineage_sha256: string;
  readonly journal_head_sha256: string;
  readonly checkpoint_head_sha256: string;
  readonly control_snapshot_sha256: string;
  readonly checkpoint_snapshot_sha256: string;
  readonly pair_common_cut_sha256: string;
}

export interface LineageObservation {
  readonly schema: "pre-custody-lineage-observation.v1";
  readonly adapter_id: string;
  readonly sequence: number;
  readonly predecessor_sha256: string;
  readonly lineage: LineageState;
  readonly observed_at: string;
}

export interface LineageRootObservation {
  readonly schema: "pre-custody-lineage-root-observation.v1";
  readonly adapter_id: string;
  readonly pre_write: boolean;
  readonly lineage: LineageState;
  readonly observed_at: string;
}

export interface TrustedLineageAdapter {
  inspectRoot(input: Readonly<{ key: CanonicalRunKey; binding: RunBinding }>): LineageRootObservation;
  inspect(input: Readonly<{ key: CanonicalRunKey; admitted: AdmittedCustodian; current: LineageState; sequence: number }>): LineageObservation;
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
  inspect(input: Readonly<{ key: CanonicalRunKey; admitted: AdmittedCustodian; binding: RunBinding; lineage: LineageState }>): FenceObservation;
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
CREATE TABLE governed_runs(key_sha256 TEXT PRIMARY KEY,key_json TEXT NOT NULL CHECK(json_valid(key_json)),binding_json TEXT NOT NULL CHECK(json_valid(binding_json)),lineage_root_json TEXT NOT NULL CHECK(json_valid(lineage_root_json)),lineage_root_observation_json TEXT NOT NULL CHECK(json_valid(lineage_root_observation_json)),current_lineage_json TEXT NOT NULL CHECK(json_valid(current_lineage_json)),current_lineage_sha256 TEXT NOT NULL,lineage_sequence INTEGER NOT NULL CHECK(lineage_sequence>=0),state TEXT NOT NULL CHECK(state IN('RESERVING','RESERVED','ADMITTING','ACTIVE','FENCING','RECOVERY_REQUIRED','CLOSED','INCIDENT','ENDED')),revision INTEGER NOT NULL CHECK(revision>=0),witness_digest TEXT NOT NULL,admitted_json TEXT CHECK(admitted_json IS NULL OR json_valid(admitted_json)),lease_expires_ms INTEGER,canonical_manifest_sha256 TEXT,canonical_manifest_json TEXT CHECK(canonical_manifest_json IS NULL OR json_valid(canonical_manifest_json)),canonical_release_json TEXT CHECK(canonical_release_json IS NULL OR json_valid(canonical_release_json)),authority_incarnation TEXT NOT NULL,authority_high_water INTEGER NOT NULL CHECK(authority_high_water>=1),created_at TEXT NOT NULL,updated_at TEXT NOT NULL) STRICT;
CREATE TABLE controller_operations(operation_id TEXT PRIMARY KEY,key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),kind TEXT NOT NULL,input_sha256 TEXT NOT NULL,input_json TEXT NOT NULL CHECK(json_valid(input_json)),expected_json TEXT NOT NULL CHECK(json_valid(expected_json)),sequence INTEGER NOT NULL,previous_digest TEXT NOT NULL,witness_record_json TEXT NOT NULL CHECK(json_valid(witness_record_json)),status TEXT NOT NULL CHECK(status IN('PENDING','ACKNOWLEDGED','UNRESOLVED','APPLIED')),result_json TEXT CHECK(result_json IS NULL OR json_valid(result_json)),created_at TEXT NOT NULL,UNIQUE(key_sha256,sequence)) STRICT;
CREATE TABLE lineage_advances(operation_id TEXT PRIMARY KEY REFERENCES controller_operations(operation_id),key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),lineage_sequence INTEGER NOT NULL CHECK(lineage_sequence>0),predecessor_sha256 TEXT NOT NULL,lineage_sha256 TEXT NOT NULL,custodian_session_id TEXT NOT NULL,observation_json TEXT NOT NULL CHECK(json_valid(observation_json)),accepted_at TEXT NOT NULL,UNIQUE(key_sha256,lineage_sequence),UNIQUE(key_sha256,lineage_sha256)) STRICT;
CREATE TABLE pending_effect_identities(operation_id TEXT PRIMARY KEY REFERENCES controller_operations(operation_id),key_sha256 TEXT NOT NULL REFERENCES governed_runs(key_sha256),kind TEXT NOT NULL CHECK(kind IN('JOB','TARGET')),authority_incarnation TEXT NOT NULL,authority_revision INTEGER NOT NULL CHECK(authority_revision>0),effect_id TEXT NOT NULL,effect_sha256 TEXT NOT NULL,envelope_sha256 TEXT NOT NULL,pinned_at TEXT NOT NULL,UNIQUE(authority_incarnation,authority_revision)) STRICT;
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
  key_sha256: string; key_json: string; binding_json: string; lineage_root_json: string; lineage_root_observation_json: string; current_lineage_json: string; current_lineage_sha256: string; lineage_sequence: number; state: string; revision: number; witness_digest: string;
  admitted_json: string | null; lease_expires_ms: number | null; canonical_manifest_sha256: string | null;
  canonical_manifest_json: string | null; canonical_release_json: string | null; authority_incarnation: string; authority_high_water: number;
};
export type OperationRow = { operation_id: string; key_sha256: string; kind: string; input_sha256: string; input_json: string; expected_json: string; sequence: number; previous_digest: string; witness_record_json: string; status: string; result_json: string | null };
export type PendingEffectIdentity = Readonly<{ operation_id: string; key_sha256: string; kind: "JOB" | "TARGET"; authority_incarnation: string; authority_revision: number; effect_id: string; effect_sha256: string; envelope_sha256: string }>;
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

  reserveRun(runBinding: RunBinding, authority: AuthorityContinuity, operationId: string, rootObservation: LineageRootObservation): Readonly<Record<string, unknown>> {
    validateRunBinding(runBinding); validateAuthorityContinuity(authority);
    const keySha = canonicalKeySha256(runBinding.key), current = this.run(keySha), bindingJson = json(runBinding), root = lineageFromBinding(runBinding), rootJson = json(root), now = new Date().toISOString();
    if (current) {
      if (current.binding_json !== bindingJson || current.authority_incarnation !== authority.incarnation) {
        this.recordIncident(current, "RUN_BINDING_CONFLICT", { existing_binding_sha256: hash(current.binding_json), presented_binding_sha256: hash(bindingJson), existing_lineage_root_sha256: hash(current.lineage_root_json), presented_lineage_root_sha256: hash(rootJson) }, operationId);
        throw new CustodyControlError("RUN_BINDING_CONFLICT");
      }
      return this.finishTransition(this.requireOperationFor(operationId, "RESERVE", keySha), true);
    }
    validateLineageRootObservation(rootObservation);
    if (!rootObservation.pre_write || json(rootObservation.lineage) !== rootJson) throw new CustodyControlError("RESERVATION_ROOT_NOT_PRE_WRITE");
    this.db.transaction(() => {
      this.db.query("INSERT INTO governed_runs(key_sha256,key_json,binding_json,lineage_root_json,lineage_root_observation_json,current_lineage_json,current_lineage_sha256,lineage_sequence,state,revision,witness_digest,admitted_json,lease_expires_ms,canonical_manifest_sha256,canonical_manifest_json,canonical_release_json,authority_incarnation,authority_high_water,created_at,updated_at) VALUES(?,?,?,?,?,?,?,0,'RESERVING',0,?,NULL,NULL,NULL,NULL,NULL,?,?,?,?)").run(keySha, json(runBinding.key), bindingJson, rootJson, json(rootObservation), rootJson, hash(rootJson), ZERO, authority.incarnation, authority.revision, now, now);
      this.prepareOperation(operationId, keySha, "RESERVE", { binding_sha256: hash(bindingJson), root_observation_sha256: hash(json(rootObservation)), authority }, {});
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
  lineageFor(key: CanonicalRunKey): Readonly<{ root: LineageState; current: LineageState; sequence: number; current_sha256: string }> {
    const row = this.requireRun(canonicalKeySha256(key));
    return Object.freeze({ root: JSON.parse(row.lineage_root_json), current: JSON.parse(row.current_lineage_json), sequence: row.lineage_sequence, current_sha256: row.current_lineage_sha256 });
  }
  canonicalEvidence(key: CanonicalRunKey): Readonly<{ manifest: CatfoodSealedInputManifestV1; release: RoleActionReceiptV2 }> {
    const row = this.requireRun(canonicalKeySha256(key));
    if (!row.canonical_manifest_json || !row.canonical_release_json) throw new CustodyControlError("CANONICAL_CLOSE_REQUIRED");
    return Object.freeze({ manifest: JSON.parse(row.canonical_manifest_json), release: JSON.parse(row.canonical_release_json) });
  }

  advanceLineage(key: CanonicalRunKey, observation: LineageObservation, custodianEvidence: Readonly<Record<string, unknown>>, operationId: string): Readonly<{ sequence: number; lineage_sha256: string; replay: boolean }> {
    validateLineageObservation(observation);
    const keySha = canonicalKeySha256(key), row = this.requireRun(keySha), admitted = row.admitted_json ? JSON.parse(row.admitted_json) as AdmittedCustodian : null;
    if (!admitted) throw new CustodyControlError("ADMITTED_CUSTODIAN_REQUIRED");
    const authenticated = admittedFromEvidence(custodianEvidence, this.authorityBinding, scopeFor(key, JSON.parse(row.binding_json)), admitted.host_incarnation);
    if (json(authenticated) !== row.admitted_json) {
      this.recordIncident(row, "NON_ADMITTED_LINEAGE_ADVANCE", { admitted_session_id: admitted.session_id, presented_session_id: authenticated.session_id, observation }, operationId);
      throw new CustodyControlError("NON_ADMITTED_CUSTODIAN");
    }
    return this.advanceLineageForAdmitted(keySha, row, admitted.session_id, observation, operationId);
  }

  recoverLineageAdvance(key: CanonicalRunKey, operationId: string): Readonly<{ sequence: number; lineage_sha256: string; replay: boolean }> | null {
    const keySha = canonicalKeySha256(key), op = this.operation(operationId);
    if (!op) return null;
    this.assertOperationDomain(op, "ADVANCE_LINEAGE", keySha);
    const row = this.requireRun(keySha), admitted = row.admitted_json ? JSON.parse(row.admitted_json) as AdmittedCustodian : null, input = JSON.parse(op.input_json) as { observation?: LineageObservation; custodian_session_id?: string }, custodianSessionId = input.custodian_session_id;
    if (!input.observation || !custodianSessionId || !TOKEN.test(custodianSessionId) || op.status !== "APPLIED" && (!admitted || custodianSessionId !== admitted.session_id)) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT");
    validateLineageObservation(input.observation);
    const lineageSha = hash(json(input.observation.lineage)), expected = { lineage_sequence: input.observation.sequence, predecessor_sha256: input.observation.predecessor_sha256, lineage_sha256: lineageSha }, exactInput = { observation: input.observation, custodian_session_id: custodianSessionId }, record = JSON.parse(op.witness_record_json) as WitnessRecord;
    this.assertOperation(op, "ADVANCE_LINEAGE", keySha, expected);
    validateWitnessRecord(record);
    if (op.input_json !== json(exactInput) || op.input_sha256 !== hash(op.input_json) || record.operation_id !== op.operation_id || record.key_sha256 !== keySha || record.sequence !== op.sequence || record.previous_digest !== op.previous_digest || record.transition !== "ADVANCE_LINEAGE" || record.payload_sha256 !== hash(json({ input: exactInput, expected }))) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT");
    return this.advanceLineageForAdmitted(keySha, row, custodianSessionId, input.observation, operationId);
  }

  private advanceLineageForAdmitted(keySha: string, row: RunRow, custodianSessionId: string, observation: LineageObservation, operationId: string): Readonly<{ sequence: number; lineage_sha256: string; replay: boolean }> {
    const observationJson = json(observation), lineageJson = json(observation.lineage), lineageSha = hash(lineageJson), input = { observation, custodian_session_id: custodianSessionId }, expected = { lineage_sequence: observation.sequence, predecessor_sha256: observation.predecessor_sha256, lineage_sha256: lineageSha };
    const existing = this.operation(operationId);
    if (existing) {
      this.assertOperation(existing, "ADVANCE_LINEAGE", keySha, expected);
      if (existing.input_json !== json(input)) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT");
      if (existing.status === "APPLIED") {
        const ack = this.witness.readOperation(operationId), result = existing.result_json ? JSON.parse(existing.result_json) as { sequence?: number; lineage_sha256?: string } : null, advance = this.db.query<{ key_sha256: string; lineage_sequence: number; predecessor_sha256: string; lineage_sha256: string; custodian_session_id: string; observation_json: string }, [string]>("SELECT key_sha256,lineage_sequence,predecessor_sha256,lineage_sha256,custodian_session_id,observation_json FROM lineage_advances WHERE operation_id=?").get(operationId);
        if (!ack || json(ack.record) !== existing.witness_record_json || !result || result.sequence !== observation.sequence || result.lineage_sha256 !== lineageSha || !advance || advance.key_sha256 !== keySha || advance.lineage_sequence !== observation.sequence || advance.predecessor_sha256 !== observation.predecessor_sha256 || advance.lineage_sha256 !== lineageSha || advance.custodian_session_id !== custodianSessionId || advance.observation_json !== observationJson) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT");
        return Object.freeze({ sequence: result.sequence, lineage_sha256: result.lineage_sha256, replay: true });
      }
    }
    this.assertNoOpenOperationExcept(keySha, operationId);
    const revisitsRoot = lineageSha === hash(row.lineage_root_json), revisitsAccepted = !!this.db.query("SELECT 1 FROM lineage_advances WHERE key_sha256=? AND lineage_sha256=?").get(keySha, lineageSha);
    if (revisitsRoot || revisitsAccepted) {
      this.recordIncident(row, "LINEAGE_ROLLBACK", { current_sequence: row.lineage_sequence, current_lineage_sha256: row.current_lineage_sha256, revisited_lineage_sha256: lineageSha, revisits_root: revisitsRoot, observation }, operationId);
      throw new CustodyControlError("LINEAGE_ROLLBACK");
    }
    if (row.state !== "ACTIVE" || observation.sequence !== row.lineage_sequence + 1 || observation.predecessor_sha256 !== row.current_lineage_sha256 || lineageSha === row.current_lineage_sha256 || observation.lineage.store_pair_lineage_sha256 !== (JSON.parse(row.lineage_root_json) as LineageState).store_pair_lineage_sha256) {
      this.recordIncident(row, "LINEAGE_CONTINUITY_CONFLICT", { current_sequence: row.lineage_sequence, current_lineage_sha256: row.current_lineage_sha256, observation }, operationId);
      throw new CustodyControlError("LINEAGE_CONTINUITY_CONFLICT");
    }
    if (!existing) this.assertWitnessCurrent(row);
    const op = existing ?? this.prepareOperation(operationId, keySha, "ADVANCE_LINEAGE", input, expected);
    if (existing?.status === "ACKNOWLEDGED") {
      const ack = this.witness.readOperation(operationId);
      if (!ack || json(ack.record) !== existing.witness_record_json) throw new CustodyControlError("CONTINUITY_HIGH_WATER_MISMATCH");
      this.assertWitnessCurrent(row);
    }
    else this.finishTransition(op, false);
    const afterWitness = this.requireRun(keySha);
    if (afterWitness.state !== "ACTIVE" || afterWitness.lineage_sequence + 1 !== observation.sequence || afterWitness.current_lineage_sha256 !== observation.predecessor_sha256 || afterWitness.admitted_json !== row.admitted_json) {
      this.recordIncident(afterWitness, "LINEAGE_CONCURRENT_CONFLICT", { observation }, `incident:${operationId}:lineage-concurrent`);
      throw new CustodyControlError("LINEAGE_CONTINUITY_CONFLICT");
    }
    this.db.transaction(() => {
      this.db.query("INSERT INTO lineage_advances VALUES(?,?,?,?,?,?,?,?)").run(operationId, keySha, observation.sequence, observation.predecessor_sha256, lineageSha, custodianSessionId, observationJson, new Date().toISOString());
      const updated = this.db.query("UPDATE governed_runs SET current_lineage_json=?,current_lineage_sha256=?,lineage_sequence=?,updated_at=? WHERE key_sha256=? AND state='ACTIVE' AND current_lineage_sha256=? AND lineage_sequence=?").run(lineageJson, lineageSha, observation.sequence, new Date().toISOString(), keySha, observation.predecessor_sha256, observation.sequence - 1);
      if (updated.changes !== 1) throw new CustodyControlError("LINEAGE_CONTINUITY_CONFLICT");
      this.db.query("UPDATE controller_operations SET status='APPLIED',result_json=? WHERE operation_id=? AND status='ACKNOWLEDGED'").run(json({ sequence: observation.sequence, lineage_sha256: lineageSha }), operationId);
    }).immediate();
    return Object.freeze({ sequence: observation.sequence, lineage_sha256: lineageSha, replay: false });
  }

  observeLeaseExpiry(key: CanonicalRunKey, observedNowMs: number): boolean {
    const row = this.requireRun(canonicalKeySha256(key));
    this.assertNoOpenOperation(row.key_sha256);
    if (row.state !== "ACTIVE" || row.lease_expires_ms === null || observedNowMs <= row.lease_expires_ms) return false;
    this.db.query("UPDATE governed_runs SET state='FENCING',updated_at=? WHERE key_sha256=? AND state='ACTIVE'").run(new Date().toISOString(), row.key_sha256);
    return true;
  }

  assertReplacementAllowed(key: CanonicalRunKey, observation: FenceObservation, leaseExpiresMs: number): void {
    validateFenceObservation(observation);
    const keySha = canonicalKeySha256(key), row = this.requireRun(keySha), currentLineage = JSON.parse(row.current_lineage_json) as LineageState, old = row.admitted_json ? JSON.parse(row.admitted_json) as AdmittedCustodian : null;
    this.assertNoOpenOperation(keySha);
    if (!sameLineage(currentLineage, observation)) {
      this.recordIncident(row, "LINEAGE_FENCE_CONFLICT", { current_lineage_sha256: row.current_lineage_sha256, observation }, `incident:fence:${hash(json(observation)).slice(0, 32)}`);
      throw new CustodyControlError("REPLACEMENT_NOT_PROVEN");
    }
    if (row.state !== "FENCING" || !old || observation.old_session_id !== old.session_id || !observation.old_process_cannot_execute || !observation.old_credentials_revoked || !observation.producer_effects_resolved || !observation.complete_history_verified || !Number.isSafeInteger(leaseExpiresMs) || leaseExpiresMs <= Date.now()) {
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
    const manifest = validateSealedInputManifest(manifestInput), manifestSha = sealedInputManifestSha256(manifest), keySha = canonicalKeySha256(key), row = this.requireRun(keySha), runBinding = JSON.parse(row.binding_json) as RunBinding, currentLineage = JSON.parse(row.current_lineage_json) as LineageState;
    const release = verifyRoleActionReceiptV2(receipt, this.authorityBinding, { role: "custodian", action: "custodian.evaluation.release", purpose_class: "HISTORICAL_EVIDENCE", scope: manifest.scope as RoleRunScope }), body = JSON.parse(release.body_json) as Record<string, unknown>, admitted = row.admitted_json ? JSON.parse(row.admitted_json) as AdmittedCustodian : null;
    const authenticBody = body.manifest_sha256 === manifestSha && json(body.manifest) === json(manifest), owner = admitted && release.session_id === admitted.session_id, goRootBound = hash(json(body.go_root_policy_ref)) === runBinding.go_policy_ref_sha256;
    if (!authenticBody || !owner || !goRootBound || !manifestMatchesRun(manifest, runBinding, currentLineage, keySha)) {
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

  pinJobEffectIdentity(key: CanonicalRunKey, operationId: string, jobInput: AuthorityEvaluationJob): void {
    const validated = this.validatedJobEffect(key, operationId, jobInput);
    this.pinPendingEffect(validated.row, validated.op, validated.identity);
  }

  completeJobEffect(key: CanonicalRunKey, operationId: string, jobInput: AuthorityEvaluationJob): AuthorityEvaluationJob {
    const { keySha, op, expected, row, verified, identity } = this.validatedJobEffect(key, operationId, jobInput);
    this.requirePendingEffect(row, op, identity);
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

  pinTargetEffectIdentity(key: CanonicalRunKey, operationId: string, envelope: string): void {
    const validated = this.validatedTargetEffect(key, operationId, envelope);
    this.pinPendingEffect(validated.row, validated.op, validated.identity);
  }

  completeTargetEffect(key: CanonicalRunKey, operationId: string, envelope: string): string {
    const { keySha, op, expected, row, target, targetSha, identity } = this.validatedTargetEffect(key, operationId, envelope);
    this.requirePendingEffect(row, op, identity);
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
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, kind, keySha);
    if (op.status === "ACKNOWLEDGED") {
      if (!this.pendingEffect(operationId)) this.rejectPendingEffect(key, operationId, kind, "PENDING_EFFECT_IDENTITY_MISSING", { operation_id: operationId, operation_kind: kind, phase: "ACKNOWLEDGED_RESTART" });
      this.db.query("UPDATE controller_operations SET status='UNRESOLVED' WHERE operation_id=? AND status='ACKNOWLEDGED'").run(operationId);
      return this.requireOperationFor(operationId, kind, keySha);
    }
    if (op.status !== "UNRESOLVED") throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    return op;
  }
  pendingEffectIdentity(key: CanonicalRunKey, operationId: string, operationKind: "ISSUE_JOB" | "ASSIGN_TARGET"): PendingEffectIdentity {
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, operationKind, keySha), identity = this.pendingEffect(operationId);
    if (op.status !== "UNRESOLVED") throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    if (!identity) this.rejectPendingEffect(key, operationId, operationKind, "PENDING_EFFECT_IDENTITY_MISSING", { operation_id: operationId, operation_kind: operationKind });
    return Object.freeze(identity!);
  }
  rejectPendingEffect(key: CanonicalRunKey, operationId: string, operationKind: "ISSUE_JOB" | "ASSIGN_TARGET", reason: "PENDING_EFFECT_IDENTITY_MISSING" | "AUTHORITY_EFFECT_DISAPPEARED" | "AUTHORITY_REVISION_REUSED", evidence: unknown): never {
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, operationKind, keySha), row = this.requireRun(keySha);
    if (!['ACKNOWLEDGED', 'UNRESOLVED'].includes(op.status)) throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    this.recordIncident(row, reason, { operation_id: operationId, operation_kind: operationKind, evidence }, `incident:${operationId}:${reason}`);
    throw new CustodyControlError(reason);
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
    const pending = this.db.query<PendingEffectIdentity, [string]>("SELECT p.operation_id,p.key_sha256,p.kind,p.authority_incarnation,p.authority_revision,p.effect_id,p.effect_sha256,p.envelope_sha256 FROM pending_effect_identities p JOIN controller_operations o ON o.operation_id=p.operation_id WHERE p.key_sha256=? AND o.status IN('ACKNOWLEDGED','UNRESOLVED')").all(keySha);
    const knownJobs = this.db.query<{ evaluation_job_id: string; descriptor_sha256: string }, [string]>("SELECT evaluation_job_id,descriptor_sha256 FROM authorized_jobs WHERE key_sha256=?").all(keySha), actualJobs = new Map(snapshot.jobs.map((job) => [job.descriptor.evaluation_job_id, job.descriptor_sha256]));
    for (const known of knownJobs) if (actualJobs.get(known.evaluation_job_id) !== known.descriptor_sha256) failure ??= "AUTHORITY_EFFECT_DISAPPEARED";
    for (const identity of pending.filter((item) => item.kind === "JOB")) if (!snapshot.jobs.some((job) => this.matchesPendingJob(identity, job))) failure ??= snapshot.jobs.some((job) => job.descriptor.authority_incarnation === identity.authority_incarnation && job.descriptor.authority_revision === identity.authority_revision) ? "AUTHORITY_REVISION_REUSED" : "AUTHORITY_EFFECT_DISAPPEARED";
    for (const job of snapshot.jobs) if (!knownJobs.some((known) => known.evaluation_job_id === job.descriptor.evaluation_job_id) && !this.pendingJobMatches(keySha, job)) {
      const reserved = pending.find((identity) => identity.kind === "JOB" && identity.authority_incarnation === job.descriptor.authority_incarnation && identity.authority_revision === job.descriptor.authority_revision), prior = this.db.query<{ effect_sha256: string }, [string, number]>("SELECT effect_sha256 FROM authority_revision_effects WHERE authority_incarnation=? AND authority_revision=?").get(job.descriptor.authority_incarnation, job.descriptor.authority_revision);
      if ((reserved && !this.matchesPendingJob(reserved, job)) || (prior && prior.effect_sha256 !== job.descriptor_sha256)) failure = "AUTHORITY_REVISION_REUSED";
      else failure ??= "UNGUARDED_AUTHORITY_EFFECT";
    }
    const knownTargets = this.db.query<{ target_sha256: string }, [string]>("SELECT target_sha256 FROM authorized_targets WHERE key_sha256=?").all(keySha), actualTargets = new Map(snapshot.targets.map((envelope) => [hash(envelope), envelope]));
    for (const known of knownTargets) if (!actualTargets.has(known.target_sha256)) failure ??= "AUTHORITY_EFFECT_DISAPPEARED";
    for (const identity of pending.filter((item) => item.kind === "TARGET")) if (!snapshot.targets.some((envelope) => this.matchesPendingTarget(identity, envelope))) failure ??= snapshot.targets.some((envelope) => { const target = verifyExpectedEvaluationTargetEnvelope(envelope, this.authorityBinding); return target.authority_incarnation === identity.authority_incarnation && target.target_revision === identity.authority_revision; }) ? "AUTHORITY_REVISION_REUSED" : "AUTHORITY_EFFECT_DISAPPEARED";
    for (const [digest, envelope] of actualTargets) if (!knownTargets.some((known) => known.target_sha256 === digest) && !this.pendingTargetMatches(keySha, envelope)) {
      const target = verifyExpectedEvaluationTargetEnvelope(envelope, this.authorityBinding), reserved = pending.find((identity) => identity.kind === "TARGET" && identity.authority_incarnation === target.authority_incarnation && identity.authority_revision === target.target_revision), prior = this.db.query<{ effect_sha256: string }, [string, number]>("SELECT effect_sha256 FROM authority_revision_effects WHERE authority_incarnation=? AND authority_revision=?").get(target.authority_incarnation, target.target_revision);
      if ((reserved && !this.matchesPendingTarget(reserved, envelope)) || (prior && prior.effect_sha256 !== digest)) failure = "AUTHORITY_REVISION_REUSED";
      else failure ??= "UNGUARDED_AUTHORITY_EFFECT";
    }
    if (failure) {
      this.recordIncident(row, failure, snapshot, `incident:${hash(`${keySha}\n${failure}\n${json(snapshot)}`).slice(0, 40)}`);
      throw new CustodyControlError(failure);
    }
  }

  state(key: CanonicalRunKey): Readonly<Record<string, unknown>> {
    const row = this.requireRun(canonicalKeySha256(key));
    return Object.freeze({ key_sha256: row.key_sha256, key: JSON.parse(row.key_json), binding: JSON.parse(row.binding_json), lineage_root: JSON.parse(row.lineage_root_json), current_lineage: JSON.parse(row.current_lineage_json), current_lineage_sha256: row.current_lineage_sha256, lineage_sequence: row.lineage_sequence, state: row.state, revision: row.revision, witness_digest: row.witness_digest, admitted: row.admitted_json ? JSON.parse(row.admitted_json) : null, lease_expires_ms: row.lease_expires_ms, canonical_manifest_sha256: row.canonical_manifest_sha256, authority_incarnation: row.authority_incarnation, authority_high_water: row.authority_high_water, incident_count: this.db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM custody_incidents WHERE key_sha256=?").get(row.key_sha256)!.n });
  }

  private run(keySha: string): RunRow | null { return this.db.query<RunRow, [string]>("SELECT * FROM governed_runs WHERE key_sha256=?").get(keySha) ?? null; }
  private operation(id: string): OperationRow | null { return this.db.query<OperationRow, [string]>("SELECT * FROM controller_operations WHERE operation_id=?").get(id) ?? null; }
  private requireRun(keySha: string): RunRow { const row = this.run(keySha); if (!row) throw new CustodyControlError("RUN_NOT_RESERVED"); return row; }
  private requireOperationFor(id: string, kind: string, keySha: string): OperationRow { const op = this.operation(id); if (!op || op.kind !== kind || op.key_sha256 !== keySha) throw new CustodyControlError(op ? "OPERATION_DOMAIN_CONFLICT" : "OPERATION_NOT_FOUND"); return op; }
  private requireOperationForAny(id: string, keySha: string): OperationRow { const op = this.operation(id); if (!op || op.key_sha256 !== keySha) throw new CustodyControlError(op ? "OPERATION_DOMAIN_CONFLICT" : "OPERATION_NOT_FOUND"); return op; }
  private assertOperation(op: OperationRow, kind: string, keySha: string, expected: unknown): void { if (op.kind !== kind || op.key_sha256 !== keySha || op.expected_json !== json(expected)) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT"); }
  private assertOperationDomain(op: OperationRow, kind: string, keySha: string): void { if (op.kind !== kind || op.key_sha256 !== keySha) throw new CustodyControlError("OPERATION_DOMAIN_CONFLICT"); }
  private assertNoOpenOperation(keySha: string): void { if (this.db.query("SELECT 1 FROM controller_operations WHERE key_sha256=? AND status IN('PENDING','ACKNOWLEDGED','UNRESOLVED')").get(keySha)) throw new CustodyControlError("CONTINUITY_OPERATION_PENDING"); }
  private assertNoOpenOperationExcept(keySha: string, operationId: string): void { if (this.db.query("SELECT 1 FROM controller_operations WHERE key_sha256=? AND operation_id!=? AND status IN('PENDING','ACKNOWLEDGED','UNRESOLVED')").get(keySha, operationId)) throw new CustodyControlError("CONTINUITY_OPERATION_PENDING"); }
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

  private validatedJobEffect(key: CanonicalRunKey, operationId: string, jobInput: AuthorityEvaluationJob) {
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, "ISSUE_JOB", keySha), expected = JSON.parse(op.expected_json) as Record<string, unknown>, row = this.requireRun(keySha), verified = verifyEvaluationJobEnvelope(jobInput.descriptor_envelope, this.authorityBinding);
    if (verified.descriptor_sha256 !== jobInput.descriptor_sha256 || json(verified.descriptor) !== json(jobInput.descriptor) || verified.descriptor.authority_incarnation !== expected.authority_incarnation || verified.descriptor.authority_revision !== expected.authority_revision || verified.descriptor.workflow_instruction_id !== expected.workflow_instruction_id || verified.descriptor.release_sha256 !== expected.release_receipt_sha256 || verified.descriptor.manifest_sha256 !== row.canonical_manifest_sha256 || canonicalKeySha256(scopeKey(verified.descriptor.scope)) !== keySha) {
      this.recordIncident(row, "PENDING_EFFECT_MISMATCH", { operation_id: operationId, effect_kind: "JOB", job: jobInput }, `incident:${operationId}:job-mismatch`);
      throw new CustodyControlError("EVALUATION_JOB_MISMATCH");
    }
    const identity: PendingEffectIdentity = Object.freeze({ operation_id: operationId, key_sha256: keySha, kind: "JOB", authority_incarnation: verified.descriptor.authority_incarnation, authority_revision: verified.descriptor.authority_revision, effect_id: verified.descriptor.evaluation_job_id, effect_sha256: verified.descriptor_sha256, envelope_sha256: hash(verified.descriptor_envelope) });
    return { keySha, op, expected, row, verified, identity };
  }
  private validatedTargetEffect(key: CanonicalRunKey, operationId: string, envelope: string) {
    const keySha = canonicalKeySha256(key), op = this.requireOperationFor(operationId, "ASSIGN_TARGET", keySha), expected = JSON.parse(op.expected_json) as Record<string, unknown>, row = this.requireRun(keySha), target = verifyExpectedEvaluationTargetEnvelope(envelope, this.authorityBinding), targetSha = hash(envelope);
    if (target.authority_incarnation !== expected.authority_incarnation || target.target_revision !== expected.authority_revision || target.evaluation_job_id !== expected.evaluation_job_id || target.verifier_session_id !== expected.verifier_session_id || canonicalKeySha256(scopeKey(target.scope as RoleRunScope)) !== keySha) {
      this.recordIncident(row, "PENDING_EFFECT_MISMATCH", { operation_id: operationId, effect_kind: "TARGET", envelope_sha256: targetSha }, `incident:${operationId}:target-mismatch`);
      throw new CustodyControlError("TARGET_MISMATCH");
    }
    const identity: PendingEffectIdentity = Object.freeze({ operation_id: operationId, key_sha256: keySha, kind: "TARGET", authority_incarnation: String(target.authority_incarnation), authority_revision: Number(target.target_revision), effect_id: String(target.assignment_id), effect_sha256: targetSha, envelope_sha256: targetSha });
    return { keySha, op, expected, row, target, targetSha, identity };
  }
  private pinPendingEffect(row: RunRow, op: OperationRow, identity: PendingEffectIdentity): void {
    if (op.status !== "ACKNOWLEDGED") throw new CustodyControlError("OPERATION_NOT_RECONCILABLE");
    const current = this.pendingEffect(op.operation_id);
    if (current) {
      if (!samePendingEffect(current, identity)) {
        this.recordIncident(row, "PENDING_EFFECT_IDENTITY_CONFLICT", { reserved: current, observed: identity }, `incident:${op.operation_id}:identity-conflict`);
        throw new CustodyControlError("PENDING_EFFECT_IDENTITY_CONFLICT");
      }
      return;
    }
    this.db.query("INSERT INTO pending_effect_identities VALUES(?,?,?,?,?,?,?,?,?)").run(identity.operation_id, identity.key_sha256, identity.kind, identity.authority_incarnation, identity.authority_revision, identity.effect_id, identity.effect_sha256, identity.envelope_sha256, new Date().toISOString());
  }
  private requirePendingEffect(row: RunRow, op: OperationRow, observed: PendingEffectIdentity): PendingEffectIdentity {
    const reserved = this.pendingEffect(op.operation_id);
    if (!reserved) {
      this.recordIncident(row, "PENDING_EFFECT_IDENTITY_MISSING", { operation_id: op.operation_id, observed }, `incident:${op.operation_id}:identity-missing`);
      throw new CustodyControlError("PENDING_EFFECT_IDENTITY_MISSING");
    }
    if (!samePendingEffect(reserved, observed)) {
      this.recordIncident(row, "AUTHORITY_REVISION_REUSED", { reserved, observed }, `incident:${op.operation_id}:revision-reused`);
      throw new CustodyControlError("AUTHORITY_REVISION_REUSED");
    }
    return reserved;
  }
  private pendingEffect(operationId: string): PendingEffectIdentity | null { return this.db.query<PendingEffectIdentity, [string]>("SELECT operation_id,key_sha256,kind,authority_incarnation,authority_revision,effect_id,effect_sha256,envelope_sha256 FROM pending_effect_identities WHERE operation_id=?").get(operationId) ?? null; }
  private matchesPendingJob(identity: PendingEffectIdentity, job: AuthorityEvaluationJob): boolean { return identity.kind === "JOB" && identity.effect_id === job.descriptor.evaluation_job_id && identity.effect_sha256 === job.descriptor_sha256 && identity.envelope_sha256 === hash(job.descriptor_envelope) && identity.authority_incarnation === job.descriptor.authority_incarnation && identity.authority_revision === job.descriptor.authority_revision; }
  private matchesPendingTarget(identity: PendingEffectIdentity, envelope: string): boolean { const target = verifyExpectedEvaluationTargetEnvelope(envelope, this.authorityBinding); return identity.kind === "TARGET" && identity.effect_id === target.assignment_id && identity.effect_sha256 === hash(envelope) && identity.envelope_sha256 === hash(envelope) && identity.authority_incarnation === target.authority_incarnation && identity.authority_revision === target.target_revision; }
  private pendingJobMatches(keySha: string, job: AuthorityEvaluationJob): boolean {
    const identity = this.db.query<PendingEffectIdentity, [string]>("SELECT p.operation_id,p.key_sha256,p.kind,p.authority_incarnation,p.authority_revision,p.effect_id,p.effect_sha256,p.envelope_sha256 FROM pending_effect_identities p JOIN controller_operations o ON o.operation_id=p.operation_id WHERE p.key_sha256=? AND p.kind='JOB' AND o.status IN('ACKNOWLEDGED','UNRESOLVED')").get(keySha);
    return !!identity && this.matchesPendingJob(identity, job);
  }
  private pendingTargetMatches(keySha: string, envelope: string): boolean {
    const identity = this.db.query<PendingEffectIdentity, [string]>("SELECT p.operation_id,p.key_sha256,p.kind,p.authority_incarnation,p.authority_revision,p.effect_id,p.effect_sha256,p.envelope_sha256 FROM pending_effect_identities p JOIN controller_operations o ON o.operation_id=p.operation_id WHERE p.key_sha256=? AND p.kind='TARGET' AND o.status IN('ACKNOWLEDGED','UNRESOLVED')").get(keySha);
    return !!identity && this.matchesPendingTarget(identity, envelope);
  }
}

function samePendingEffect(left: PendingEffectIdentity, right: PendingEffectIdentity): boolean { return left.operation_id === right.operation_id && left.key_sha256 === right.key_sha256 && left.kind === right.kind && left.authority_incarnation === right.authority_incarnation && left.authority_revision === right.authority_revision && left.effect_id === right.effect_id && left.effect_sha256 === right.effect_sha256 && left.envelope_sha256 === right.envelope_sha256; }

export type LaunchedRole = Readonly<{ session: LocalRoleSession; evidence: Readonly<Record<string, unknown>> }>;
export type SafetyCommand = Readonly<{ kind: "STATUS_READ" }> | Readonly<{ kind: "RECONCILE_READ"; operation_id: string }> | Readonly<{ kind: "REVOKE"; session_id: string }>;

export class TestOnlyPreCustodyHost {
  #authority: CatfoodRoleAuthority;
  #controller: CustodyController;
  #authorityBinding: RoleChannelBinding;
  #authorityPath: string;
  #fenceAdapter: TrustedFenceAdapter;
  #lineageAdapter: TrustedLineageAdapter;
  #now: () => number;

  constructor(input: { authority_path: string; authority_binding: RoleChannelBinding; authority_private_key: string | KeyObject; controller: CustodyController; fence_adapter: TrustedFenceAdapter; lineage_adapter: TrustedLineageAdapter; now?: () => number }) {
    if (input.authority_binding.trust_domain !== "TEST_ONLY") throw new CustodyControlError("TEST_ONLY_HOST_REQUIRED");
    this.#authorityBinding = Object.freeze(structuredClone(input.authority_binding)); this.#authorityPath = resolve(input.authority_path); this.#controller = input.controller; this.#fenceAdapter = input.fence_adapter; this.#lineageAdapter = input.lineage_adapter; this.#now = input.now ?? Date.now;
    this.#authority = new CatfoodRoleAuthority(this.#authorityPath, this.#authorityBinding, input.authority_private_key, input.now);
  }
  close(): void { this.#authority.close(); this.#controller.close(); }
  reserveRun(binding: RunBinding, operationId: string) { return this.#controller.reserveRun(binding, this.#readContinuity(), operationId, this.#lineageAdapter.inspectRoot({ key: binding.key, binding })); }

  advanceLineage(input: { key: CanonicalRunKey; operation_id: string; custodian_session?: LocalRoleSession }) {
    this.#audit(input.key);
    const recovered = this.#controller.recoverLineageAdvance(input.key, input.operation_id);
    if (recovered) return recovered;
    if (!input.custodian_session) throw new CustodyControlError("CUSTODIAN_SESSION_REQUIRED");
    const admitted = this.#controller.admitted(input.key), state = this.#controller.lineageFor(input.key), evidence = localRoleEvidence(input.custodian_session), observation = this.#lineageAdapter.inspect({ key: input.key, admitted, current: state.current, sequence: state.sequence });
    return this.#controller.advanceLineage(input.key, observation, evidence, input.operation_id);
  }

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
      this.#controller.pinJobEffectIdentity(input.key, input.operation_id, job);
      if (input.lose_response_for_test) { this.#controller.markEffectUnresolved(input.key, input.operation_id, "ISSUE_JOB"); throw new CustodyControlError("TEST_ONLY_RESPONSE_LOST"); }
      return this.#controller.completeJobEffect(input.key, input.operation_id, job);
    } catch (error) {
      if (!(error instanceof CustodyControlError && error.code === "TEST_ONLY_RESPONSE_LOST")) this.#controller.markEffectUnresolvedIfAcknowledged(input.key, input.operation_id, "ISSUE_JOB");
      throw error;
    }
  }

  reconcileEvaluationJob(key: CanonicalRunKey, operationId: string): AuthorityEvaluationJob {
    this.#audit(key);
    this.#controller.resumeExactReconciliation(key, operationId, "ISSUE_JOB");
    const identity = this.#controller.pendingEffectIdentity(key, operationId, "ISSUE_JOB"), job = this.#readJobByIdentity(key, operationId, identity);
    return this.#controller.completeJobEffect(key, operationId, job);
  }

  assignExpectedTarget(input: { key: CanonicalRunKey; operation_id: string; verifier_evidence: Readonly<Record<string, unknown>>; evaluation_job_id: string; lose_response_for_test?: boolean }): string {
    this.#audit(input.key);
    const replay = this.#controller.appliedEffect<{ target_envelope: string }>(input.key, input.operation_id, "ASSIGN_TARGET");
    if (replay) return replay.target_envelope;
    const continuity = this.#readContinuity(), scope = this.#scope(input.key), verifier = verifyRoleEvidenceV4(input.verifier_evidence, this.#authorityBinding, "verifier", scope), enrollment = decodeSignedEnvelope(String(input.verifier_evidence.enrollment_envelope_json)), expected = { authority_incarnation: continuity.incarnation, authority_revision: continuity.revision + 1, evaluation_job_id: input.evaluation_job_id, verifier_session_id: String(enrollment.session_id) };
    this.#controller.beginTargetEffect(input.key, input.operation_id, expected);
    try {
      const envelope = this.#authority.assignExpectedEvaluationTarget({ verifier, evaluation_job_id: input.evaluation_job_id, purpose: "VERIFY_EXPECTED" });
      this.#controller.pinTargetEffectIdentity(input.key, input.operation_id, envelope);
      if (input.lose_response_for_test) { this.#controller.markEffectUnresolved(input.key, input.operation_id, "ASSIGN_TARGET"); throw new CustodyControlError("TEST_ONLY_RESPONSE_LOST"); }
      return this.#controller.completeTargetEffect(input.key, input.operation_id, envelope);
    } catch (error) {
      if (!(error instanceof CustodyControlError && error.code === "TEST_ONLY_RESPONSE_LOST")) this.#controller.markEffectUnresolvedIfAcknowledged(input.key, input.operation_id, "ASSIGN_TARGET");
      throw error;
    }
  }

  reconcileExpectedTarget(key: CanonicalRunKey, operationId: string): string {
    this.#audit(key);
    this.#controller.resumeExactReconciliation(key, operationId, "ASSIGN_TARGET");
    const identity = this.#controller.pendingEffectIdentity(key, operationId, "ASSIGN_TARGET"), envelope = this.#readTargetByIdentity(key, operationId, identity);
    return this.#controller.completeTargetEffect(key, operationId, envelope);
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
    const observation = this.#fenceAdapter.inspect({ key: input.key, admitted: old, binding: this.#controller.bindingFor(input.key), lineage: this.#controller.lineageFor(input.key).current });
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
  #readJobByIdentity(key: CanonicalRunKey, operationId: string, identity: PendingEffectIdentity): AuthorityEvaluationJob {
    const snapshot = this.#snapshot(key), matches = snapshot.jobs.filter((job) => identity.kind === "JOB" && job.descriptor.authority_incarnation === identity.authority_incarnation && job.descriptor.authority_revision === identity.authority_revision && job.descriptor.evaluation_job_id === identity.effect_id && job.descriptor_sha256 === identity.effect_sha256 && hash(job.descriptor_envelope) === identity.envelope_sha256);
    if (matches.length !== 1) this.#controller.rejectPendingEffect(key, operationId, "ISSUE_JOB", snapshot.jobs.some((job) => job.descriptor.authority_incarnation === identity.authority_incarnation && job.descriptor.authority_revision === identity.authority_revision) ? "AUTHORITY_REVISION_REUSED" : "AUTHORITY_EFFECT_DISAPPEARED", { reserved: identity, observed_job_count: snapshot.jobs.length });
    return matches[0]!;
  }
  #readTargetByIdentity(key: CanonicalRunKey, operationId: string, identity: PendingEffectIdentity): string {
    const snapshot = this.#snapshot(key), matches = snapshot.targets.filter((envelope) => { const target = verifyExpectedEvaluationTargetEnvelope(envelope, this.#authorityBinding); return identity.kind === "TARGET" && target.authority_incarnation === identity.authority_incarnation && target.target_revision === identity.authority_revision && target.assignment_id === identity.effect_id && hash(envelope) === identity.effect_sha256 && hash(envelope) === identity.envelope_sha256; });
    if (matches.length !== 1) this.#controller.rejectPendingEffect(key, operationId, "ASSIGN_TARGET", snapshot.targets.some((envelope) => { const target = verifyExpectedEvaluationTargetEnvelope(envelope, this.#authorityBinding); return target.authority_incarnation === identity.authority_incarnation && target.target_revision === identity.authority_revision; }) ? "AUTHORITY_REVISION_REUSED" : "AUTHORITY_EFFECT_DISAPPEARED", { reserved: identity, observed_target_count: snapshot.targets.length });
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
function validateLineageState(value: LineageState): void { for (const item of [value.store_pair_lineage_sha256, value.journal_head_sha256, value.checkpoint_head_sha256, value.control_snapshot_sha256, value.checkpoint_snapshot_sha256, value.pair_common_cut_sha256]) requireSha(item); }
function validateLineageRootObservation(value: LineageRootObservation): void { if (value.schema !== "pre-custody-lineage-root-observation.v1" || !TOKEN.test(value.adapter_id) || typeof value.pre_write !== "boolean" || !Number.isFinite(Date.parse(value.observed_at))) throw new CustodyControlError("LINEAGE_ROOT_OBSERVATION_INVALID"); validateLineageState(value.lineage); }
function validateLineageObservation(value: LineageObservation): void { if (value.schema !== "pre-custody-lineage-observation.v1" || !TOKEN.test(value.adapter_id) || !Number.isSafeInteger(value.sequence) || value.sequence < 1 || !SHA256.test(value.predecessor_sha256) || !Number.isFinite(Date.parse(value.observed_at))) throw new CustodyControlError("LINEAGE_OBSERVATION_INVALID"); validateLineageState(value.lineage); }
function lineageFromBinding(binding: RunBinding): LineageState { return Object.freeze({ store_pair_lineage_sha256: binding.store_pair_lineage_sha256, journal_head_sha256: binding.journal_head_sha256, checkpoint_head_sha256: binding.checkpoint_head_sha256, control_snapshot_sha256: binding.control_snapshot_sha256, checkpoint_snapshot_sha256: binding.checkpoint_snapshot_sha256, pair_common_cut_sha256: binding.pair_common_cut_sha256 }); }
function sameLineage(lineage: LineageState, observed: FenceObservation): boolean { return lineage.journal_head_sha256 === observed.journal_head_sha256 && lineage.checkpoint_head_sha256 === observed.checkpoint_head_sha256 && lineage.control_snapshot_sha256 === observed.control_snapshot_sha256 && lineage.checkpoint_snapshot_sha256 === observed.checkpoint_snapshot_sha256 && lineage.pair_common_cut_sha256 === observed.pair_common_cut_sha256; }
function manifestMatchesRun(manifest: CatfoodSealedInputManifestV1, binding: RunBinding, lineage: LineageState, keySha: string): boolean { return canonicalKeySha256(scopeKey(manifest.scope)) === keySha && manifest.scope.environment_instance_id === binding.environment_instance_id && manifest.scope.spec_sha256 === binding.spec_sha256 && hash(json(manifest.window)) === binding.window_sha256 && manifest.go.artifact_sha256 === binding.go_artifact_sha256 && manifest.journal.head_sha256 === lineage.journal_head_sha256 && manifest.checkpoint.checkpoint_sha256 === lineage.checkpoint_head_sha256 && manifest.control.raw_sha256 === lineage.control_snapshot_sha256 && manifest.checkpoint_store.raw_sha256 === lineage.checkpoint_snapshot_sha256 && manifest.pair_common_cut_sha256 === lineage.pair_common_cut_sha256 && manifest.trust.test_only === true; }
function scopeFor(key: CanonicalRunKey, binding: RunBinding): RoleRunScope { return { ...key, environment_instance_id: binding.environment_instance_id, spec_sha256: binding.spec_sha256 }; }
function publicKeyFingerprint(pem: string): string { return hash(createPublicKey(pem).export({ type: "spki", format: "der" }) as Buffer); }
function decodeSignedEnvelope(envelope: string): Record<string, any> { const outer = JSON.parse(envelope) as { payload: string }; return JSON.parse(Buffer.from(outer.payload, "base64url").toString()); }
function decodeEvidence(session: LocalRoleSession): Record<string, any> { return decodeSignedEnvelope(String(localRoleEvidence(session).enrollment_envelope_json)); }
function admittedFromEvidence(evidence: Readonly<Record<string, unknown>>, binding: RoleChannelBinding, scope: RoleRunScope, hostIncarnation: string): AdmittedCustodian { verifyRoleEvidenceV4(evidence, binding, "custodian", scope); const enrollment = decodeSignedEnvelope(String(evidence.enrollment_envelope_json)), assignment = decodeSignedEnvelope(String(evidence.assignment_envelope_json)), launch = enrollment.launch as Record<string, unknown>, subject = enrollment.subject as Record<string, unknown>, descriptor = enrollment.accepted_role_descriptor as Record<string, unknown>; return Object.freeze({ session_id: String(enrollment.session_id), assignment_id: String(assignment.assignment_id), action_key_fingerprint: String(enrollment.action_key_fingerprint), subject_sha256: hash(json(subject)), launch_id: String(launch.launch_id), process_id: String(subject.pid), host_incarnation: hostIncarnation, build_sha256: String(descriptor.artifact_root) }); }
