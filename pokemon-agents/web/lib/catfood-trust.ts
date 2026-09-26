import { Database } from "bun:sqlite";
import { createPublicKey, randomBytes, verify } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalJson, sha256, validateOperationalBoundaryV1, type Json, type OperationalBoundaryV1 } from "./catfood-harness";

export const CATFOOD_TRUST_SCHEMA = "catfood-trust.v1";
export const CATFOOD_GO_SCHEMA = "catfood-human-go.v1";
export const CATFOOD_EVALUATOR_VERSION = "catfood-trust-evaluator.v1";
export const CATFOOD_CAPABILITIES = Object.freeze([
  "editorial.cycle",
  "editorial.outcome_evaluation",
  "threads.publish.dry_run",
] as const);
export type CatfoodCapability = typeof CATFOOD_CAPABILITIES[number];
export type Verdict = "PASS" | "FAIL" | "BLOCKED";
export type SourceMode = "OPERATIONAL" | "TEST_ONLY";

export const CATFOOD_FIXED_POLICY = Object.freeze({
  policy: "initial-catfood-24h.v1",
  continuous_duration_seconds: 86_400,
  minimum_meaningful_units: 3,
  minimum_capability_classes: 2,
  planned_restart_required: true,
  meaningful_before_and_after_restart: true,
  paid_provider_allowance: "ZERO",
  night: "UNEXERCISED_EXCLUDED",
});
export const CATFOOD_POLICY_SHA256 = sha256(canonicalJson(CATFOOD_FIXED_POLICY));
export const CATFOOD_EVALUATOR_SHA256 = sha256(canonicalJson({
  version: CATFOOD_EVALUATOR_VERSION,
  policy_sha256: CATFOOD_POLICY_SHA256,
  source: "protected-journal+external-checkpoint+threads-source+signed-go",
}));

export const CATFOOD_OPERATIONAL_CONTRACT_GAPS = Object.freeze([
  "THREADS_COMPLETED_GOVERNED_CLAIM_READ_INTERFACE_MISSING",
  "THREADS_OUTCOME_EVALUATION_BRIDGE_MUTATION_MISSING",
  "THREADS_EFFECTIVE_MULTI_TENANT_FLAG_EVIDENCE_MISSING",
  "THREADS_COMPLETE_PROVIDER_NON_USE_COVERAGE_MISSING",
] as const);

const SHA40 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const ACCOUNT = /^acct_[A-Za-z0-9_-]{1,128}$/;
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const REQUIRED_CONTROL_TABLES = Object.freeze([
  "catfood_trust_meta", "catfood_runs", "catfood_go_consumptions", "catfood_go_revocations",
  "catfood_owner_sessions", "catfood_preflight_receipts", "catfood_authority_bindings",
  "catfood_work_admissions", "catfood_source_journal", "catfood_bundle_cache",
]);
const REQUIRED_CONTROL_INDEXES = Object.freeze([
  "catfood_journal_head", "catfood_work_semantic_identity", "catfood_receipts_unconsumed",
]);
const REQUIRED_CONTROL_TRIGGERS = Object.freeze([
  "catfood_meta_no_update", "catfood_meta_no_delete", "catfood_go_no_update", "catfood_go_no_delete",
  "catfood_revocations_no_update", "catfood_revocations_no_delete", "catfood_sessions_no_update",
  "catfood_sessions_no_delete", "catfood_authority_no_update", "catfood_authority_no_delete",
  "catfood_work_identity_immutable", "catfood_journal_no_duplicate_insert", "catfood_journal_no_update", "catfood_journal_no_delete",
  "catfood_bundle_no_update", "catfood_bundle_no_delete",
]);
const REQUIRED_CHECKPOINT_TRIGGERS = Object.freeze([
  "catfood_checkpoints_no_update", "catfood_checkpoints_no_delete",
]);

export class CatfoodTrustError extends Error {
  constructor(readonly code: string, message = code) { super(message); }
}

function plain(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new CatfoodTrustError("INVALID_SHAPE", `${field} must be an object`);
  if (![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new CatfoodTrustError("INVALID_SHAPE", `${field} must be plain data`);
  return value as Record<string, unknown>;
}

function exact(value: Record<string, unknown>, fields: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new CatfoodTrustError("UNKNOWN_SECURITY_FIELD", `${label} fields do not match`);
}

function text(value: unknown, field: string, pattern = ID): string {
  if (typeof value !== "string" || !pattern.test(value) || value.includes("*")) throw new CatfoodTrustError("INVALID_FIELD", field);
  return value;
}

function utc(value: unknown, field: string): string {
  if (typeof value !== "string" || !UTC.test(value) || Number.isNaN(Date.parse(value))) throw new CatfoodTrustError("INVALID_TIMESTAMP", field);
  return value;
}

function b64url(value: unknown, field: string): Buffer {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]+$/.test(value)) throw new CatfoodTrustError("INVALID_ENCODING", field);
  const decoded = Buffer.from(value, "base64url");
  if (decoded.toString("base64url") !== value) throw new CatfoodTrustError("INVALID_ENCODING", field);
  return decoded;
}

function fixedCapabilities(value: unknown): readonly CatfoodCapability[] {
  if (!Array.isArray(value) || canonicalJson(value) !== canonicalJson(CATFOOD_CAPABILITIES)) throw new CatfoodTrustError("CAPABILITY_SCOPE_MISMATCH");
  return Object.freeze([...value] as CatfoodCapability[]);
}

export interface TrustedClockSample {
  wall_time: string;
  monotonic_ms: number;
  boot_id: string;
}

export interface TrustedClock {
  readonly kind: "SYSTEM" | "TEST";
  sample(): TrustedClockSample;
}

export interface TrustedGoKey {
  key_id: string;
  public_key_pem: string;
  trust_class: "OPERATIONAL" | "TEST_ONLY";
}

export interface CatfoodTrustConfig {
  schema: typeof CATFOOD_TRUST_SCHEMA;
  custodian_identity: string;
  environment_type: "test" | "staging" | "production";
  environment_instance_id: string;
  organization_id: string;
  tenant_id: string;
  account_id: string;
  ikorabu_release_sha: string;
  threads_sha: string;
  operational_boundary_sha256: string;
  threads_release_sha256: string;
  threads_schema: 30;
  source_mode: SourceMode;
  go_keys: readonly TrustedGoKey[];
}

export interface CatfoodRunSpec {
  schema: "catfood-run-spec.v2";
  run_id: string;
  environment_type: "test" | "staging" | "production";
  environment_instance_id: string;
  organization_id: string;
  tenant_id: string;
  account_id: string;
  capabilities: readonly CatfoodCapability[];
  effective_config_sha256: string;
  ikorabu_release_sha: string;
  threads_sha: string;
  operational_boundary_sha256: string;
  threads_release_sha256: string;
  threads_schema: 30;
  acceptance_policy_sha256: string;
  night_state: "UNEXERCISED_EXCLUDED";
  spec_sha256: string;
}

export interface HumanGoPayload {
  schema: typeof CATFOOD_GO_SCHEMA;
  grant_id: string;
  nonce: string;
  run_id: string;
  spec_hash: string;
  environment_type: "test" | "staging" | "production";
  environment_instance_id: string;
  organization_id: string;
  tenant_id: string;
  account_id: string;
  capabilities: readonly CatfoodCapability[];
  valid_from: string;
  valid_until: string;
  maximum_duration_seconds: 86_400;
  maximum_wp3_epoch: number;
  acceptance_policy_sha256: string;
  threads_sha: string;
  operational_boundary_sha256: string;
  threads_release_sha256: string;
  threads_schema: 30;
  ikorabu_release_sha: string;
  paid_provider_allowance: "ZERO";
}

export interface VerifiedHumanGo {
  payload: Readonly<HumanGoPayload>;
  artifact_sha256: string;
  key_id: string;
  trust_class: "OPERATIONAL" | "TEST_ONLY";
}

export function createCatfoodRunSpec(input: Omit<CatfoodRunSpec, "schema" | "spec_sha256" | "acceptance_policy_sha256" | "night_state">): Readonly<CatfoodRunSpec> {
  const raw = plain(input, "run spec");
  exact(raw, ["run_id", "environment_type", "environment_instance_id", "organization_id", "tenant_id", "account_id", "capabilities", "effective_config_sha256", "ikorabu_release_sha", "threads_sha", "operational_boundary_sha256", "threads_release_sha256", "threads_schema"], "run spec");
  const clean = {
    schema: "catfood-run-spec.v2" as const,
    run_id: text(raw.run_id, "run_id"),
    environment_type: raw.environment_type,
    environment_instance_id: text(raw.environment_instance_id, "environment_instance_id"),
    organization_id: text(raw.organization_id, "organization_id"),
    tenant_id: text(raw.tenant_id, "tenant_id"),
    account_id: text(raw.account_id, "account_id", ACCOUNT),
    capabilities: fixedCapabilities(raw.capabilities),
    effective_config_sha256: text(raw.effective_config_sha256, "effective_config_sha256", SHA256),
    ikorabu_release_sha: text(raw.ikorabu_release_sha, "ikorabu_release_sha", SHA40),
    threads_sha: text(raw.threads_sha, "threads_sha", SHA40),
    operational_boundary_sha256: text(raw.operational_boundary_sha256, "operational_boundary_sha256", SHA256),
    threads_release_sha256: text(raw.threads_release_sha256, "threads_release_sha256", SHA256),
    threads_schema: raw.threads_schema,
    acceptance_policy_sha256: CATFOOD_POLICY_SHA256,
    night_state: "UNEXERCISED_EXCLUDED" as const,
  };
  if (!(["test", "staging", "production"] as const).includes(clean.environment_type as never) || clean.threads_schema !== 30) throw new CatfoodTrustError("SPEC_INVALID");
  return Object.freeze({ ...clean, spec_sha256: sha256(canonicalJson(clean)) }) as Readonly<CatfoodRunSpec>;
}

function strictJson(raw: string, label: string): Record<string, unknown> {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new CatfoodTrustError("MALFORMED_JSON", label); }
  const value = plain(parsed, label);
  if (canonicalJson(value) !== raw) throw new CatfoodTrustError("NON_CANONICAL_OR_DUPLICATE_JSON", label);
  return value;
}

export function verifyHumanGo(rawArtifact: string, spec: CatfoodRunSpec, trust: CatfoodTrustConfig, at: string): VerifiedHumanGo {
  const envelope = strictJson(rawArtifact, "GO envelope");
  exact(envelope, ["algorithm", "key_id", "payload", "signature"], "GO envelope");
  if (envelope.algorithm !== "Ed25519") throw new CatfoodTrustError("ALGORITHM_SUBSTITUTION");
  const keyId = text(envelope.key_id, "key_id");
  const key = trust.go_keys.find((candidate) => candidate.key_id === keyId);
  if (!key) throw new CatfoodTrustError("UNKNOWN_GO_KEY");
  const payloadBytes = b64url(envelope.payload, "payload");
  const signature = b64url(envelope.signature, "signature");
  if (!verify(null, payloadBytes, createPublicKey(key.public_key_pem), signature)) throw new CatfoodTrustError("GO_SIGNATURE_INVALID");
  const payload = strictJson(payloadBytes.toString("utf8"), "GO payload");
  exact(payload, ["schema", "grant_id", "nonce", "run_id", "spec_hash", "environment_type", "environment_instance_id", "organization_id", "tenant_id", "account_id", "capabilities", "valid_from", "valid_until", "maximum_duration_seconds", "maximum_wp3_epoch", "acceptance_policy_sha256", "threads_sha", "operational_boundary_sha256", "threads_release_sha256", "threads_schema", "ikorabu_release_sha", "paid_provider_allowance"], "GO payload");
  const validFrom = utc(payload.valid_from, "valid_from");
  const validUntil = utc(payload.valid_until, "valid_until");
  const now = Date.parse(utc(at, "verification time"));
  if (Date.parse(validFrom) > now || Date.parse(validUntil) <= now || Date.parse(validUntil) <= Date.parse(validFrom)) throw new CatfoodTrustError("GO_NOT_CURRENT");
  if (payload.schema !== CATFOOD_GO_SCHEMA || payload.maximum_duration_seconds !== 86_400 || payload.acceptance_policy_sha256 !== CATFOOD_POLICY_SHA256
    || payload.paid_provider_allowance !== "ZERO" || payload.threads_schema !== 30
    || !Number.isSafeInteger(payload.maximum_wp3_epoch) || Number(payload.maximum_wp3_epoch) < 2) throw new CatfoodTrustError("GO_POLICY_MISMATCH");
  fixedCapabilities(payload.capabilities);
  const bindings: Array<[unknown, unknown]> = [
    [payload.run_id, spec.run_id], [payload.spec_hash, spec.spec_sha256], [payload.environment_type, spec.environment_type],
    [payload.environment_instance_id, spec.environment_instance_id], [payload.organization_id, spec.organization_id],
    [payload.tenant_id, spec.tenant_id], [payload.account_id, spec.account_id], [payload.threads_sha, spec.threads_sha],
    [payload.operational_boundary_sha256, spec.operational_boundary_sha256], [payload.threads_release_sha256, spec.threads_release_sha256],
    [payload.threads_schema, spec.threads_schema], [payload.ikorabu_release_sha, spec.ikorabu_release_sha],
  ];
  if (bindings.some(([actual, expected]) => actual !== expected) || canonicalJson(payload.capabilities) !== canonicalJson(spec.capabilities)) throw new CatfoodTrustError("GO_SCOPE_MISMATCH");
  if (spec.environment_type !== trust.environment_type || spec.environment_instance_id !== trust.environment_instance_id
    || spec.organization_id !== trust.organization_id || spec.tenant_id !== trust.tenant_id || spec.account_id !== trust.account_id
    || spec.ikorabu_release_sha !== trust.ikorabu_release_sha || spec.threads_sha !== trust.threads_sha
    || spec.operational_boundary_sha256 !== trust.operational_boundary_sha256 || spec.threads_release_sha256 !== trust.threads_release_sha256
    || spec.threads_schema !== trust.threads_schema) throw new CatfoodTrustError("TRUST_CONFIG_SCOPE_MISMATCH");
  if (trust.source_mode === "OPERATIONAL" && key.trust_class !== "OPERATIONAL") throw new CatfoodTrustError("TEST_KEY_NOT_OPERATIONAL");
  return Object.freeze({ payload: Object.freeze(payload as unknown as HumanGoPayload), artifact_sha256: sha256(rawArtifact), key_id: keyId, trust_class: key.trust_class });
}

export interface ThreadsRuntimeEvidence {
  feature_multi_tenant_auth: "ON" | "OFF" | "UNKNOWN";
  own_scope_status: number;
  foreign_scope_status: number;
  writer_enabled: boolean | "UNKNOWN";
  paid_generation_enabled: boolean | "UNKNOWN";
  provider_activity_count: number | "UNKNOWN";
  paid_cost_micros: number | "UNKNOWN";
  cost_coverage: "COMPLETE" | "PARTIAL" | "UNKNOWN";
}

export interface ThreadsInventoryItem {
  source_id: string;
  capability: CatfoodCapability;
  business_identity: string;
  material_revision: string;
}

export interface ThreadsClaimRecord extends ThreadsInventoryItem {
  claim_id: string;
  request_id: string;
  account_id: string;
  authority_ref: string;
  generation: number;
  claim_status: "in_progress" | "succeeded" | "failed";
  transport_status: "SUCCEEDED" | "FAILED" | "UNKNOWN";
  domain_result: Record<string, Json>;
  provider_invoked: boolean;
  paid_cost_micros: number | "UNKNOWN";
  admitted_at: string;
  completed_at: string | null;
}

export interface ThreadsAuthorityTransition {
  boundary: OperationalBoundaryV1;
  authority_ref: string;
  generation: number;
}

export interface ThreadsEvidenceSource {
  readonly source_identity: string;
  readonly mode: SourceMode;
  readonly contract_gaps: readonly string[];
  runtimeEvidence(spec: CatfoodRunSpec): ThreadsRuntimeEvidence;
  boundaries(spec: CatfoodRunSpec): readonly OperationalBoundaryV1[];
  inventory(spec: CatfoodRunSpec): readonly ThreadsInventoryItem[];
  grant(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number | null): ThreadsAuthorityTransition;
  revoke(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number): ThreadsAuthorityTransition;
  claim(spec: CatfoodRunSpec, item: ThreadsInventoryItem, authorityRef: string, generation: number): ThreadsClaimRecord;
  readClaim(spec: CatfoodRunSpec, claimId: string): ThreadsClaimRecord | null;
}

export interface RunnerSession {
  session_id: string;
  token: string;
  run_id: string;
}

export interface PreflightReceipt {
  receipt_id: string;
  nonce: string;
  expires_at: string;
  source_digest: string;
  state_version: number;
  epoch: number;
}

export interface AdmissionTicket {
  work_id: string;
  claim_id: string;
  request_id: string;
  capability: CatfoodCapability;
  wp3_epoch: number;
  threads_generation: number;
}

export interface EvaluationResult {
  verdict: Verdict;
  reason_codes: readonly string[];
  rederived_bundle_sha256: string;
  evaluator_sha256: string;
  policy_sha256: string;
  test_only: boolean;
}

const CONTROL_SCHEMA_SQL = `
CREATE TABLE catfood_trust_meta (singleton INTEGER PRIMARY KEY CHECK(singleton=1),schema_version TEXT NOT NULL,schema_fingerprint TEXT NOT NULL,trust_config_json TEXT NOT NULL CHECK(json_valid(trust_config_json)),trust_config_sha256 TEXT NOT NULL,created_at TEXT NOT NULL) STRICT;
CREATE TRIGGER catfood_meta_no_update BEFORE UPDATE ON catfood_trust_meta BEGIN SELECT RAISE(ABORT,'trust metadata is immutable'); END;
CREATE TRIGGER catfood_meta_no_delete BEFORE DELETE ON catfood_trust_meta BEGIN SELECT RAISE(ABORT,'trust metadata is immutable'); END;
CREATE TABLE catfood_runs (run_id TEXT PRIMARY KEY,spec_json TEXT NOT NULL CHECK(json_valid(spec_json)),spec_sha256 TEXT NOT NULL UNIQUE,go_artifact TEXT NOT NULL,go_sha256 TEXT NOT NULL,grant_id TEXT NOT NULL UNIQUE,lifecycle TEXT NOT NULL CHECK(lifecycle IN('CREATED','READY','RUNNING','STOP_PENDING','STOP_UNCONFIRMED','ABORT_UNCONFIRMED','SAFE_QUIESCENCE','PAUSED','ABORTED','CLOSED')),admission_state TEXT NOT NULL CHECK(admission_state IN('OPEN','CLOSED')),current_epoch INTEGER NOT NULL CHECK(current_epoch>0),owner_session_id TEXT,lease_expires_at TEXT,evidence_state TEXT NOT NULL CHECK(evidence_state IN('ANCHORED','UNANCHORED','CORRUPT')),state_version INTEGER NOT NULL CHECK(state_version>0),start_wall_time TEXT,start_monotonic_ms INTEGER,start_boot_id TEXT,closed_wall_time TEXT,closed_monotonic_ms INTEGER,closed_boot_id TEXT,created_at TEXT NOT NULL) STRICT;
CREATE TABLE catfood_go_consumptions (grant_id TEXT PRIMARY KEY,nonce TEXT NOT NULL UNIQUE,run_id TEXT NOT NULL UNIQUE REFERENCES catfood_runs(run_id),go_sha256 TEXT NOT NULL,consumed_at TEXT NOT NULL) STRICT;
CREATE TRIGGER catfood_go_no_update BEFORE UPDATE ON catfood_go_consumptions BEGIN SELECT RAISE(ABORT,'GO consumption is immutable'); END;
CREATE TRIGGER catfood_go_no_delete BEFORE DELETE ON catfood_go_consumptions BEGIN SELECT RAISE(ABORT,'GO consumption is immutable'); END;
CREATE TABLE catfood_go_revocations (revocation_id TEXT PRIMARY KEY,grant_id TEXT NOT NULL,run_id TEXT NOT NULL,reason_code TEXT NOT NULL,revoked_at TEXT NOT NULL) STRICT;
CREATE TRIGGER catfood_revocations_no_update BEFORE UPDATE ON catfood_go_revocations BEGIN SELECT RAISE(ABORT,'GO revocation is append-only'); END;
CREATE TRIGGER catfood_revocations_no_delete BEFORE DELETE ON catfood_go_revocations BEGIN SELECT RAISE(ABORT,'GO revocation is append-only'); END;
CREATE TABLE catfood_owner_sessions (session_id TEXT PRIMARY KEY,run_id TEXT NOT NULL,token_sha256 TEXT NOT NULL,issued_at TEXT NOT NULL) STRICT;
CREATE TRIGGER catfood_sessions_no_update BEFORE UPDATE ON catfood_owner_sessions BEGIN SELECT RAISE(ABORT,'owner sessions are immutable'); END;
CREATE TRIGGER catfood_sessions_no_delete BEFORE DELETE ON catfood_owner_sessions BEGIN SELECT RAISE(ABORT,'owner sessions are immutable'); END;
CREATE TABLE catfood_preflight_receipts (receipt_id TEXT PRIMARY KEY,run_id TEXT NOT NULL,session_id TEXT NOT NULL,wp3_epoch INTEGER NOT NULL,threads_generation_digest TEXT NOT NULL,state_version INTEGER NOT NULL,source_digest TEXT NOT NULL,nonce TEXT NOT NULL UNIQUE,expires_at TEXT NOT NULL,consumed_at TEXT) STRICT;
CREATE INDEX catfood_receipts_unconsumed ON catfood_preflight_receipts(run_id,consumed_at,expires_at);
CREATE TABLE catfood_authority_bindings (run_id TEXT NOT NULL,wp3_epoch INTEGER NOT NULL,capability TEXT NOT NULL,authority_ref TEXT NOT NULL,threads_generation INTEGER NOT NULL,boundary_sha256 TEXT NOT NULL,permit_expires_at TEXT NOT NULL,state TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(run_id,wp3_epoch,capability)) STRICT;
CREATE TRIGGER catfood_authority_no_update BEFORE UPDATE ON catfood_authority_bindings BEGIN SELECT RAISE(ABORT,'authority bindings are immutable'); END;
CREATE TRIGGER catfood_authority_no_delete BEFORE DELETE ON catfood_authority_bindings BEGIN SELECT RAISE(ABORT,'authority bindings are immutable'); END;
CREATE TABLE catfood_work_admissions (work_id TEXT PRIMARY KEY,run_id TEXT NOT NULL,wp3_epoch INTEGER NOT NULL,capability TEXT NOT NULL,claim_id TEXT NOT NULL UNIQUE,request_id TEXT NOT NULL,business_identity TEXT NOT NULL,material_revision TEXT NOT NULL,semantic_identity_sha256 TEXT NOT NULL UNIQUE,authority_ref TEXT NOT NULL,threads_generation INTEGER NOT NULL,claim_json TEXT NOT NULL CHECK(json_valid(claim_json)),status TEXT NOT NULL CHECK(status IN('ADMITTED','TERMINAL')),terminal_json TEXT CHECK(terminal_json IS NULL OR json_valid(terminal_json)),admitted_at TEXT NOT NULL,completed_at TEXT) STRICT;
CREATE UNIQUE INDEX catfood_work_semantic_identity ON catfood_work_admissions(capability,business_identity,material_revision);
CREATE TRIGGER catfood_work_identity_immutable BEFORE UPDATE ON catfood_work_admissions WHEN OLD.work_id IS NOT NEW.work_id OR OLD.run_id IS NOT NEW.run_id OR OLD.wp3_epoch IS NOT NEW.wp3_epoch OR OLD.capability IS NOT NEW.capability OR OLD.claim_id IS NOT NEW.claim_id OR OLD.request_id IS NOT NEW.request_id OR OLD.business_identity IS NOT NEW.business_identity OR OLD.material_revision IS NOT NEW.material_revision OR OLD.semantic_identity_sha256 IS NOT NEW.semantic_identity_sha256 OR OLD.authority_ref IS NOT NEW.authority_ref OR OLD.threads_generation IS NOT NEW.threads_generation OR OLD.claim_json IS NOT NEW.claim_json OR OLD.admitted_at IS NOT NEW.admitted_at BEGIN SELECT RAISE(ABORT,'work identity is immutable'); END;
CREATE TABLE catfood_source_journal (run_id TEXT NOT NULL,sequence INTEGER NOT NULL,event_id TEXT NOT NULL UNIQUE,event_type TEXT NOT NULL,environment_type TEXT NOT NULL,environment_instance_id TEXT NOT NULL,organization_id TEXT NOT NULL,tenant_id TEXT NOT NULL,account_id TEXT NOT NULL,owner_session_id TEXT NOT NULL,wp3_epoch INTEGER NOT NULL,threads_generation INTEGER,source_provenance TEXT NOT NULL,claim_id TEXT,request_id TEXT,observed_at TEXT NOT NULL,monotonic_ms INTEGER NOT NULL,boot_id TEXT NOT NULL,payload_json TEXT NOT NULL CHECK(json_valid(payload_json)),previous_row_hash TEXT NOT NULL,row_hash TEXT NOT NULL,PRIMARY KEY(run_id,sequence)) STRICT;
CREATE UNIQUE INDEX catfood_journal_head ON catfood_source_journal(run_id,row_hash);
CREATE TRIGGER catfood_journal_no_duplicate_insert BEFORE INSERT ON catfood_source_journal WHEN EXISTS(SELECT 1 FROM catfood_source_journal WHERE run_id=NEW.run_id AND sequence=NEW.sequence) BEGIN SELECT RAISE(ABORT,'duplicate source evidence is forbidden'); END;
CREATE TRIGGER catfood_journal_no_update BEFORE UPDATE ON catfood_source_journal BEGIN SELECT RAISE(ABORT,'source journal is append-only'); END;
CREATE TRIGGER catfood_journal_no_delete BEFORE DELETE ON catfood_source_journal BEGIN SELECT RAISE(ABORT,'source journal is append-only'); END;
CREATE TABLE catfood_bundle_cache (run_id TEXT PRIMARY KEY,bundle_json TEXT NOT NULL CHECK(json_valid(bundle_json)),bundle_sha256 TEXT NOT NULL,created_at TEXT NOT NULL) STRICT;
CREATE TRIGGER catfood_bundle_no_update BEFORE UPDATE ON catfood_bundle_cache BEGIN SELECT RAISE(ABORT,'bundle cache is immutable'); END;
CREATE TRIGGER catfood_bundle_no_delete BEFORE DELETE ON catfood_bundle_cache BEGIN SELECT RAISE(ABORT,'bundle cache is immutable'); END;
`;

const CHECKPOINT_SCHEMA_SQL = `
CREATE TABLE catfood_checkpoints (checkpoint_id TEXT PRIMARY KEY,run_id TEXT NOT NULL,last_sequence INTEGER NOT NULL,head_hash TEXT NOT NULL,previous_checkpoint TEXT NOT NULL,pins_sha256 TEXT NOT NULL,coverage_sha256 TEXT NOT NULL,custodian_identity TEXT NOT NULL,observed_at TEXT NOT NULL,UNIQUE(run_id,last_sequence)) STRICT;
CREATE TRIGGER catfood_checkpoints_no_update BEFORE UPDATE ON catfood_checkpoints BEGIN SELECT RAISE(ABORT,'checkpoints are create-only'); END;
CREATE TRIGGER catfood_checkpoints_no_delete BEFORE DELETE ON catfood_checkpoints BEGIN SELECT RAISE(ABORT,'checkpoints are create-only'); END;
`;

function configure(db: Database, readonly = false): void {
  db.exec("PRAGMA foreign_keys=ON");
  db.exec("PRAGMA recursive_triggers=ON");
  db.exec("PRAGMA busy_timeout=5000");
  if (!readonly) { db.exec("PRAGMA journal_mode=WAL"); db.exec("PRAGMA synchronous=FULL"); }
}

function masterFingerprint(db: Database, names: readonly string[]): string {
  const rows = db.query<{ type: string; name: string; tbl_name: string; sql: string }, []>("SELECT type,name,tbl_name,sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type,name").all();
  const selected = rows.filter((row) => names.includes(row.name));
  if (selected.length !== names.length) throw new CatfoodTrustError("STORE_SCHEMA_INCOMPLETE");
  return sha256(canonicalJson(selected));
}

function validateTrustConfig(value: CatfoodTrustConfig): Readonly<CatfoodTrustConfig> {
  const row = plain(value, "trust config");
  exact(row, ["schema", "custodian_identity", "environment_type", "environment_instance_id", "organization_id", "tenant_id", "account_id", "ikorabu_release_sha", "threads_sha", "operational_boundary_sha256", "threads_release_sha256", "threads_schema", "source_mode", "go_keys"], "trust config");
  if (row.schema !== CATFOOD_TRUST_SCHEMA || !["test", "staging", "production"].includes(String(row.environment_type)) || !["OPERATIONAL", "TEST_ONLY"].includes(String(row.source_mode)) || row.threads_schema !== 30) throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
  text(row.custodian_identity, "custodian_identity"); text(row.environment_instance_id, "environment_instance_id"); text(row.organization_id, "organization_id"); text(row.tenant_id, "tenant_id"); text(row.account_id, "account_id", ACCOUNT);
  text(row.ikorabu_release_sha, "ikorabu_release_sha", SHA40); text(row.threads_sha, "threads_sha", SHA40); text(row.operational_boundary_sha256, "operational_boundary_sha256", SHA256); text(row.threads_release_sha256, "threads_release_sha256", SHA256);
  if (!Array.isArray(row.go_keys) || !row.go_keys.length) throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
  const seen = new Set<string>();
  for (const candidate of row.go_keys) {
    const key = plain(candidate, "GO key"); exact(key, ["key_id", "public_key_pem", "trust_class"], "GO key");
    const keyId = text(key.key_id, "key_id"); if (seen.has(keyId)) throw new CatfoodTrustError("DUPLICATE_GO_KEY"); seen.add(keyId);
    if (typeof key.public_key_pem !== "string" || !["OPERATIONAL", "TEST_ONLY"].includes(String(key.trust_class))) throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
    try { const parsed = createPublicKey(key.public_key_pem); if (parsed.asymmetricKeyType !== "ed25519") throw new Error(); } catch { throw new CatfoodTrustError("GO_KEY_INVALID"); }
  }
  if (row.source_mode === "OPERATIONAL" && row.environment_type === "test") throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
  return Object.freeze(JSON.parse(canonicalJson(value)));
}

export function initializeProtectedCatfoodStores(controlPath: string, checkpointPath: string, trustInput: CatfoodTrustConfig, at: string): void {
  const control = resolve(controlPath), checkpoint = resolve(checkpointPath);
  if (control === checkpoint) throw new CatfoodTrustError("CHECKPOINT_MUST_BE_EXTERNAL");
  if (!existsSync(control) || !existsSync(checkpoint)) throw new CatfoodTrustError("STORE_MUST_PREEXIST");
  const trust = validateTrustConfig(trustInput);
  const controlDb = new Database(control, { strict: true, create: false });
  const checkpointDb = new Database(checkpoint, { strict: true, create: false });
  try {
    configure(controlDb); configure(checkpointDb);
    if ((controlDb.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get()?.n ?? 0) !== 0) throw new CatfoodTrustError("CONTROL_STORE_NOT_EMPTY");
    if ((checkpointDb.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get()?.n ?? 0) !== 0) throw new CatfoodTrustError("CHECKPOINT_STORE_NOT_EMPTY");
    controlDb.exec(CONTROL_SCHEMA_SQL); checkpointDb.exec(CHECKPOINT_SCHEMA_SQL);
    const fingerprint = masterFingerprint(controlDb, [...REQUIRED_CONTROL_TABLES, ...REQUIRED_CONTROL_INDEXES, ...REQUIRED_CONTROL_TRIGGERS]);
    controlDb.query("INSERT INTO catfood_trust_meta VALUES (1,?,?,?,?,?)").run(CATFOOD_TRUST_SCHEMA, fingerprint, canonicalJson(trust), sha256(canonicalJson(trust)), utc(at, "created_at"));
  } finally { controlDb.close(); checkpointDb.close(); }
}

interface RunRow extends Record<string, unknown> {
  run_id: string; spec_json: string; spec_sha256: string; go_artifact: string; go_sha256: string; grant_id: string;
  lifecycle: string; admission_state: string; current_epoch: number; owner_session_id: string | null; lease_expires_at: string | null;
  evidence_state: string; state_version: number;
}

function loadTrust(db: Database): CatfoodTrustConfig {
  const row = db.query<{ schema_version: string; schema_fingerprint: string; trust_config_json: string; trust_config_sha256: string }, []>("SELECT schema_version,schema_fingerprint,trust_config_json,trust_config_sha256 FROM catfood_trust_meta WHERE singleton=1").get();
  if (!row || row.schema_version !== CATFOOD_TRUST_SCHEMA) throw new CatfoodTrustError("STORE_SCHEMA_IDENTITY_MISMATCH");
  const fingerprint = masterFingerprint(db, [...REQUIRED_CONTROL_TABLES, ...REQUIRED_CONTROL_INDEXES, ...REQUIRED_CONTROL_TRIGGERS]);
  if (fingerprint !== row.schema_fingerprint || sha256(row.trust_config_json) !== row.trust_config_sha256) throw new CatfoodTrustError("STORE_SCHEMA_OR_TRUST_TAMPERED");
  return validateTrustConfig(JSON.parse(row.trust_config_json));
}

function assertConnection(db: Database): void {
  const one = (pragma: string) => Number(Object.values(db.query<Record<string, unknown>, []>(pragma).get() ?? {})[0]);
  if (one("PRAGMA foreign_keys") !== 1 || one("PRAGMA recursive_triggers") !== 1 || one("PRAGMA synchronous") < 2) throw new CatfoodTrustError("SQLITE_CONNECTION_UNSAFE");
  if (db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get()?.integrity_check !== "ok") throw new CatfoodTrustError("STORE_CORRUPT");
}

function checkpointHealth(db: Database): void {
  assertConnection(db);
  masterFingerprint(db, ["catfood_checkpoints", ...REQUIRED_CHECKPOINT_TRIGGERS]);
}

function runSpec(row: RunRow): CatfoodRunSpec { return JSON.parse(row.spec_json) as CatfoodRunSpec; }

function eventHash(row: Record<string, Json>): string { return sha256(canonicalJson(row)); }

export class ProtectedCatfoodCustodian {
  private readonly control: Database;
  private readonly checkpoints: Database;
  readonly trust: Readonly<CatfoodTrustConfig>;

  constructor(
    controlPath: string,
    checkpointPath: string,
    private readonly source: ThreadsEvidenceSource,
    private readonly clock: TrustedClock,
  ) {
    if (resolve(controlPath) === resolve(checkpointPath)) throw new CatfoodTrustError("CHECKPOINT_MUST_BE_EXTERNAL");
    this.control = new Database(resolve(controlPath), { strict: true, create: false });
    this.checkpoints = new Database(resolve(checkpointPath), { strict: true, create: false });
    try {
      configure(this.control); configure(this.checkpoints);
      assertConnection(this.control); checkpointHealth(this.checkpoints);
      this.trust = loadTrust(this.control);
      if (source.mode !== this.trust.source_mode || source.source_identity !== `${this.trust.threads_sha}:${this.trust.threads_release_sha256}`) throw new CatfoodTrustError("THREADS_SOURCE_IDENTITY_MISMATCH");
      if (this.trust.source_mode === "OPERATIONAL" && clock.kind !== "SYSTEM") throw new CatfoodTrustError("TEST_CLOCK_NOT_OPERATIONAL");
    } catch (error) { this.control.close(); this.checkpoints.close(); throw error; }
  }

  close(): void { this.control.close(); this.checkpoints.close(); }

  private sample(): TrustedClockSample {
    const got = this.clock.sample();
    utc(got.wall_time, "clock.wall_time"); text(got.boot_id, "clock.boot_id");
    if (!Number.isSafeInteger(got.monotonic_ms) || got.monotonic_ms < 0) throw new CatfoodTrustError("CLOCK_INVALID");
    return got;
  }

  private getRun(runId: string): RunRow {
    const row = this.control.query<RunRow, [string]>("SELECT * FROM catfood_runs WHERE run_id=?").get(runId);
    if (!row) throw new CatfoodTrustError("RUN_NOT_FOUND");
    return row;
  }

  private authenticate(session: RunnerSession, row: RunRow): void {
    const stored = this.control.query<{ token_sha256: string; run_id: string }, [string]>("SELECT token_sha256,run_id FROM catfood_owner_sessions WHERE session_id=?").get(session.session_id);
    if (!stored || stored.run_id !== row.run_id || session.run_id !== row.run_id || stored.token_sha256 !== sha256(session.token) || row.owner_session_id !== session.session_id) throw new CatfoodTrustError("OWNER_SESSION_INVALID");
  }

  private appendJournal(row: RunRow, eventType: string, sessionId: string, sourceProvenance: string, payload: Json, generation: number | null, claimId: string | null, requestId: string | null, sample = this.sample()): { sequence: number; row_hash: string } {
    const spec = runSpec(row);
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(row.run_id);
    const sequence = (head?.sequence ?? 0) + 1;
    const base: Record<string, Json> = {
      run_id: row.run_id, sequence, event_type: eventType, environment_type: spec.environment_type,
      environment_instance_id: spec.environment_instance_id, organization_id: spec.organization_id, tenant_id: spec.tenant_id,
      account_id: spec.account_id, owner_session_id: sessionId, wp3_epoch: Number(row.current_epoch),
      threads_generation: generation, source_provenance: sourceProvenance, claim_id: claimId, request_id: requestId,
      observed_at: sample.wall_time, monotonic_ms: sample.monotonic_ms, boot_id: sample.boot_id,
      payload_json: payload, previous_row_hash: head?.row_hash ?? "GENESIS",
    };
    const hash = eventHash(base);
    const eventId = `jrn:${hash.slice(0, 32)}`;
    this.control.query("INSERT INTO catfood_source_journal VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
      row.run_id, sequence, eventId, eventType, spec.environment_type, spec.environment_instance_id, spec.organization_id,
      spec.tenant_id, spec.account_id, sessionId, row.current_epoch, generation, sourceProvenance, claimId, requestId,
      sample.wall_time, sample.monotonic_ms, sample.boot_id, canonicalJson(payload), head?.row_hash ?? "GENESIS", hash,
    );
    return { sequence, row_hash: hash };
  }

  private checkpoint(runId: string, head: { sequence: number; row_hash: string }, coverage: Json): void {
    checkpointHealth(this.checkpoints);
    const prior = this.checkpoints.query<{ checkpoint_id: string }, [string]>("SELECT checkpoint_id FROM catfood_checkpoints WHERE run_id=? ORDER BY last_sequence DESC LIMIT 1").get(runId)?.checkpoint_id ?? "GENESIS";
    const sample = this.sample();
    const pins = { policy_sha256: CATFOOD_POLICY_SHA256, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, threads_sha: this.trust.threads_sha, boundary_sha256: this.trust.operational_boundary_sha256, release_sha256: this.trust.threads_release_sha256, schema: this.trust.threads_schema, ikorabu_release_sha: this.trust.ikorabu_release_sha };
    const body = { run_id: runId, last_sequence: head.sequence, head_hash: head.row_hash, previous_checkpoint: prior, pins_sha256: sha256(canonicalJson(pins)), coverage_sha256: sha256(canonicalJson(coverage)), custodian_identity: this.trust.custodian_identity, observed_at: sample.wall_time };
    const id = `chk:${sha256(canonicalJson(body)).slice(0, 32)}`;
    this.checkpoints.query("INSERT INTO catfood_checkpoints VALUES (?,?,?,?,?,?,?,?,?)").run(id, body.run_id, body.last_sequence, body.head_hash, body.previous_checkpoint, body.pins_sha256, body.coverage_sha256, body.custodian_identity, body.observed_at);
  }

  private anchor(runId: string, head: { sequence: number; row_hash: string }, coverage: Json = { state: "COMPLETE" }): void {
    try { this.checkpoint(runId, head, coverage); }
    catch (error) {
      this.control.query("UPDATE catfood_runs SET evidence_state='UNANCHORED',admission_state='CLOSED',state_version=state_version+1 WHERE run_id=?").run(runId);
      throw new CatfoodTrustError("EVIDENCE_UNANCHORED", error instanceof Error ? error.message : "checkpoint failed");
    }
  }

  verifyAnchored(runId: string): void {
    assertConnection(this.control); checkpointHealth(this.checkpoints); loadTrust(this.control);
    const row = this.getRun(runId);
    const journal = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence").all(runId);
    const checkpoints = this.checkpoints.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_checkpoints WHERE run_id=? ORDER BY last_sequence").all(runId);
    let previous = "GENESIS"; let highWater = 0;
    const pins = { policy_sha256: CATFOOD_POLICY_SHA256, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, threads_sha: this.trust.threads_sha, boundary_sha256: this.trust.operational_boundary_sha256, release_sha256: this.trust.threads_release_sha256, schema: this.trust.threads_schema, ikorabu_release_sha: this.trust.ikorabu_release_sha };
    for (const checkpoint of checkpoints) {
      const sequence = Number(checkpoint.last_sequence); const event = journal[sequence - 1];
      const body = { run_id: String(checkpoint.run_id), last_sequence: sequence, head_hash: String(checkpoint.head_hash), previous_checkpoint: String(checkpoint.previous_checkpoint), pins_sha256: String(checkpoint.pins_sha256), coverage_sha256: String(checkpoint.coverage_sha256), custodian_identity: String(checkpoint.custodian_identity), observed_at: String(checkpoint.observed_at) };
      if (!event || sequence <= highWater || event.row_hash !== checkpoint.head_hash || checkpoint.previous_checkpoint !== previous
        || checkpoint.pins_sha256 !== sha256(canonicalJson(pins)) || checkpoint.custodian_identity !== this.trust.custodian_identity
        || checkpoint.checkpoint_id !== `chk:${sha256(canonicalJson(body)).slice(0, 32)}`) throw new CatfoodTrustError("CHECKPOINT_CHAIN_INVALID");
      highWater = sequence; previous = String(checkpoint.checkpoint_id);
    }
    const head = journal.at(-1); const anchored = checkpoints.at(-1);
    if (!head || !anchored || head.sequence !== anchored.last_sequence || head.row_hash !== anchored.head_hash) throw new CatfoodTrustError(row.evidence_state === "ANCHORED" ? "CHECKPOINT_HIGH_WATER_TAMPERED" : "EVIDENCE_UNANCHORED");
    if (row.evidence_state !== "ANCHORED") throw new CatfoodTrustError("EVIDENCE_UNANCHORED");
  }

  createRun(spec: CatfoodRunSpec, signedGo: string): void {
    const sample = this.sample();
    const verified = verifyHumanGo(signedGo, spec, this.trust, sample.wall_time);
    this.control.transaction(() => {
      if (this.control.query("SELECT 1 FROM catfood_go_consumptions WHERE grant_id=? OR nonce=?").get(verified.payload.grant_id, verified.payload.nonce)) throw new CatfoodTrustError("GO_REUSED");
      this.control.query("INSERT INTO catfood_runs(run_id,spec_json,spec_sha256,go_artifact,go_sha256,grant_id,lifecycle,admission_state,current_epoch,evidence_state,state_version,created_at) VALUES (?,?,?,?,?,?,'CREATED','CLOSED',1,'ANCHORED',1,?)")
        .run(spec.run_id, canonicalJson(spec), spec.spec_sha256, signedGo, verified.artifact_sha256, verified.payload.grant_id, sample.wall_time);
      this.control.query("INSERT INTO catfood_go_consumptions VALUES (?,?,?,?,?)").run(verified.payload.grant_id, verified.payload.nonce, spec.run_id, verified.artifact_sha256, sample.wall_time);
      const run = this.getRun(spec.run_id);
      const head = this.appendJournal(run, "RUN_CREATED", this.trust.custodian_identity, "signed-go", { go_sha256: verified.artifact_sha256, key_id: verified.key_id, trust_class: verified.trust_class }, null, null, null, sample);
      this.control.query("UPDATE catfood_runs SET lifecycle='READY' WHERE run_id=?").run(spec.run_id);
      (run as Record<string, unknown>).pending_head = head;
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(spec.run_id)!;
    this.anchor(spec.run_id, head, { state: "COMPLETE", go: "VERIFIED" });
  }

  issueOwnerSession(runId: string): RunnerSession {
    this.verifyAnchored(runId);
    const sample = this.sample(); const token = randomBytes(32).toString("base64url");
    const sessionId = `ses:${sha256(`${runId}:${token}`).slice(0, 32)}`;
    this.control.transaction(() => {
      const row = this.getRun(runId);
      const currentExpiry = row.lease_expires_at ? Date.parse(String(row.lease_expires_at)) : 0;
      if (row.owner_session_id && currentExpiry > Date.parse(sample.wall_time)) throw new CatfoodTrustError("LEASE_HELD");
      this.control.query("INSERT INTO catfood_owner_sessions VALUES (?,?,?,?)").run(sessionId, runId, sha256(token), sample.wall_time);
      if (!row.owner_session_id) this.control.query("UPDATE catfood_runs SET owner_session_id=?,lease_expires_at=?,state_version=state_version+1 WHERE run_id=?")
        .run(sessionId, new Date(Date.parse(sample.wall_time) + 120_000).toISOString(), runId);
      const updated = this.getRun(runId);
      this.appendJournal(updated, "OWNER_SESSION_ISSUED", sessionId, "custodian", { session_id: sessionId }, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(runId)!;
    this.anchor(runId, head);
    return Object.freeze({ session_id: sessionId, token, run_id: runId });
  }

  revokeGo(runId: string, reasonCode: string): void {
    const sample = this.sample();
    this.control.transaction(() => {
      const row = this.getRun(runId); text(reasonCode, "reason_code");
      if (!this.control.query("SELECT 1 FROM catfood_go_revocations WHERE grant_id=?").get(row.grant_id)) {
        this.control.query("INSERT INTO catfood_go_revocations VALUES (?,?,?,?,?)").run(`rev:${randomBytes(16).toString("hex")}`, row.grant_id, runId, reasonCode, sample.wall_time);
      }
      this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='ABORTED',state_version=state_version+1 WHERE run_id=?").run(runId);
      this.appendJournal(this.getRun(runId), "GO_REVOKED", this.trust.custodian_identity, "go-revocation", { reason_code: reasonCode }, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(runId)!; this.anchor(runId, head);
  }

  private verifyCurrentGo(row: RunRow, sample: TrustedClockSample): VerifiedHumanGo {
    if (this.control.query("SELECT 1 FROM catfood_go_revocations WHERE grant_id=?").get(row.grant_id)) throw new CatfoodTrustError("GO_REVOKED");
    return verifyHumanGo(row.go_artifact, runSpec(row), this.trust, sample.wall_time);
  }

  private sourceSnapshot(spec: CatfoodRunSpec): { runtime: ThreadsRuntimeEvidence; boundaries: readonly OperationalBoundaryV1[]; inventory: readonly ThreadsInventoryItem[]; digest: string; gaps: readonly string[] } {
    const runtime = this.source.runtimeEvidence(spec);
    const boundaries = this.source.boundaries(spec).map(validateOperationalBoundaryV1);
    const inventory = this.source.inventory(spec);
    const gaps = [...this.source.contract_gaps];
    return { runtime, boundaries, inventory, gaps, digest: sha256(canonicalJson({ runtime, boundaries, inventory, gaps })) };
  }

  preflight(session: RunnerSession): PreflightReceipt {
    this.verifyAnchored(session.run_id);
    const sample = this.sample();
    let output!: PreflightReceipt;
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.verifyCurrentGo(row, sample);
      if (!row.lease_expires_at || Date.parse(row.lease_expires_at) <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("LEASE_EXPIRED");
      if (row.lifecycle === "ABORTED" || row.lifecycle === "PAUSED" || row.lifecycle === "CLOSED") throw new CatfoodTrustError("LIFECYCLE_NOT_ADMISSIBLE");
      const spec = runSpec(row); const snapshot = this.sourceSnapshot(spec);
      if (snapshot.gaps.length) throw new CatfoodTrustError("CONTRACT_GAP", snapshot.gaps.join(","));
      const runtime = snapshot.runtime;
      if (runtime.feature_multi_tenant_auth !== "ON" || runtime.own_scope_status !== 200 || runtime.foreign_scope_status !== 403) throw new CatfoodTrustError("TENANT_ENFORCEMENT_UNPROVED");
      if (runtime.writer_enabled !== false || runtime.paid_generation_enabled !== false) throw new CatfoodTrustError("PAID_PATH_NOT_DISABLED");
      if (runtime.cost_coverage !== "COMPLETE" || runtime.provider_activity_count !== 0 || runtime.paid_cost_micros !== 0) throw new CatfoodTrustError("PROVIDER_COST_NON_USE_UNPROVED");
      if (snapshot.boundaries.length !== CATFOOD_CAPABILITIES.length) throw new CatfoodTrustError("BOUNDARY_COVERAGE_INCOMPLETE");
      for (const boundary of snapshot.boundaries) {
        if (boundary.account_id !== spec.account_id || boundary.execution_state === "UNKNOWN" || ["FAILED", "UNKNOWN"].includes(String(boundary.stop_acknowledgement))) throw new CatfoodTrustError("BOUNDARY_UNSAFE");
      }
      const unique = new Map(snapshot.inventory.map((item) => [`${item.capability}:${item.business_identity}:${item.material_revision}`, item]));
      if (unique.size < CATFOOD_FIXED_POLICY.minimum_meaningful_units || new Set([...unique.values()].map((item) => item.capability)).size < CATFOOD_FIXED_POLICY.minimum_capability_classes) throw new CatfoodTrustError("MEANINGFUL_INVENTORY_INSUFFICIENT");
      const generationDigest = sha256(canonicalJson(snapshot.boundaries.map((boundary) => [boundary.capability, boundary.fencing_generation])));
      const nonce = randomBytes(24).toString("base64url"); const receiptId = `pre:${sha256(`${session.run_id}:${nonce}`).slice(0, 32)}`;
      const expires = new Date(Date.parse(sample.wall_time) + 30_000).toISOString();
      this.control.query("INSERT INTO catfood_preflight_receipts VALUES (?,?,?,?,?,?,?,?,?,NULL)").run(receiptId, row.run_id, session.session_id, row.current_epoch, generationDigest, row.state_version, snapshot.digest, nonce, expires);
      this.appendJournal(row, "PREFLIGHT_PASSED", session.session_id, this.source.source_identity, { receipt_id: receiptId, source_digest: snapshot.digest, state_version: row.state_version }, null, null, null, sample);
      output = Object.freeze({ receipt_id: receiptId, nonce, expires_at: expires, source_digest: snapshot.digest, state_version: Number(row.state_version), epoch: Number(row.current_epoch) });
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "COMPLETE", preflight: "PASSED" });
    return output;
  }

  activate(session: RunnerSession, receipt: PreflightReceipt): void {
    this.verifyAnchored(session.run_id); const sample = this.sample();
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.verifyCurrentGo(row, sample);
      const stored = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_preflight_receipts WHERE receipt_id=?").get(receipt.receipt_id);
      if (!stored || stored.run_id !== row.run_id || stored.session_id !== session.session_id || stored.consumed_at !== null || stored.nonce !== receipt.nonce || Number(stored.wp3_epoch) !== Number(row.current_epoch) || Number(stored.state_version) !== Number(row.state_version) || Date.parse(String(stored.expires_at)) <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("PREFLIGHT_RECEIPT_INVALID");
      const spec = runSpec(row); const snapshot = this.sourceSnapshot(spec);
      if (snapshot.gaps.length || snapshot.digest !== stored.source_digest) throw new CatfoodTrustError("PREFLIGHT_STALE");
      for (const capability of CATFOOD_CAPABILITIES) {
        const current = snapshot.boundaries.find((boundary) => boundary.capability === capability);
        const expected = current?.fencing_generation ?? null;
        const ref = `${row.run_id}:wp3:${row.current_epoch}:${capability}`;
        const transition = this.source.grant(spec, capability, ref, expected);
        const boundary = validateOperationalBoundaryV1(transition.boundary);
        if (boundary.account_id !== spec.account_id || boundary.capability !== capability || boundary.authority_state !== "ACTIVE" || boundary.execution_state !== "PERMITTED" || boundary.fencing_generation !== transition.generation) throw new CatfoodTrustError("THREADS_AUTHORITY_TRANSITION_INVALID");
        this.control.query("INSERT INTO catfood_authority_bindings VALUES (?,?,?,?,?,?,?,?,?)").run(row.run_id, row.current_epoch, capability, transition.authority_ref, transition.generation, boundary.canonical_sha256, boundary.permit_expires_at, "ACTIVE", sample.wall_time);
        this.appendJournal(row, "THREADS_AUTHORITY_GRANTED", session.session_id, this.source.source_identity, { capability, authority_ref: transition.authority_ref, boundary: boundary as unknown as Json }, transition.generation, null, null, sample);
      }
      this.control.query("UPDATE catfood_preflight_receipts SET consumed_at=? WHERE receipt_id=? AND consumed_at IS NULL").run(sample.wall_time, receipt.receipt_id);
      this.control.query("UPDATE catfood_runs SET lifecycle='RUNNING',admission_state='OPEN',state_version=state_version+1,start_wall_time=COALESCE(start_wall_time,?),start_monotonic_ms=COALESCE(start_monotonic_ms,?),start_boot_id=COALESCE(start_boot_id,?) WHERE run_id=?")
        .run(sample.wall_time, sample.monotonic_ms, sample.boot_id, row.run_id);
      this.appendJournal(this.getRun(row.run_id), "RUN_STARTED", session.session_id, "custodian", { receipt_id: receipt.receipt_id }, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head);
  }

  admit(session: RunnerSession, capability: CatfoodCapability, sourceId: string): AdmissionTicket {
    this.verifyAnchored(session.run_id); const sample = this.sample(); let ticket!: AdmissionTicket;
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); const go = this.verifyCurrentGo(row, sample);
      if (!row.lease_expires_at || Date.parse(row.lease_expires_at) <= Date.parse(sample.wall_time) || row.lifecycle !== "RUNNING" || row.admission_state !== "OPEN") throw new CatfoodTrustError("ADMISSION_CLOSED");
      if (Number(row.current_epoch) > go.payload.maximum_wp3_epoch) throw new CatfoodTrustError("GO_EPOCH_SCOPE_EXCEEDED");
      const spec = runSpec(row); const inventory = this.source.inventory(spec); const item = inventory.find((candidate) => candidate.source_id === sourceId && candidate.capability === capability);
      if (!item) throw new CatfoodTrustError("SOURCE_INTENT_NOT_ELIGIBLE");
      const binding = this.control.query<Record<string, unknown>, [string, number, string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? AND wp3_epoch=? AND capability=?").get(row.run_id, row.current_epoch, capability);
      if (!binding) throw new CatfoodTrustError("AUTHORITY_BINDING_MISSING");
      const claim = this.source.claim(spec, item, String(binding.authority_ref), Number(binding.threads_generation));
      if (claim.account_id !== spec.account_id || claim.capability !== capability || claim.authority_ref !== binding.authority_ref || claim.generation !== binding.threads_generation || claim.claim_status !== "in_progress") throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_INVALID");
      const semantic = sha256(canonicalJson({ capability, business_identity: claim.business_identity, material_revision: claim.material_revision }));
      const workId = `wrk:${semantic.slice(0, 32)}`;
      try {
        this.control.query("INSERT INTO catfood_work_admissions(work_id,run_id,wp3_epoch,capability,claim_id,request_id,business_identity,material_revision,semantic_identity_sha256,authority_ref,threads_generation,claim_json,status,admitted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'ADMITTED',?)")
          .run(workId, row.run_id, row.current_epoch, capability, claim.claim_id, claim.request_id, claim.business_identity, claim.material_revision, semantic, claim.authority_ref, claim.generation, canonicalJson(claim), sample.wall_time);
      } catch { throw new CatfoodTrustError("DUPLICATE_SEMANTIC_WORK"); }
      this.appendJournal(row, "WORK_ADMITTED", session.session_id, this.source.source_identity, { work_id: workId, source_id: sourceId, business_identity: claim.business_identity, material_revision: claim.material_revision, go_sha256: row.go_sha256 }, claim.generation, claim.claim_id, claim.request_id, sample);
      ticket = Object.freeze({ work_id: workId, claim_id: claim.claim_id, request_id: claim.request_id, capability, wp3_epoch: Number(row.current_epoch), threads_generation: claim.generation });
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head);
    return ticket;
  }

  reconcile(session: RunnerSession, workId: string): ThreadsClaimRecord {
    // Recovery observation is safety-only and remains available after an
    // anchor failure; it cannot open admission or expand authority.
    assertConnection(this.control); checkpointHealth(this.checkpoints); loadTrust(this.control);
    const sample = this.sample(); let result!: ThreadsClaimRecord;
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      const work = this.control.query<Record<string, unknown>, [string, string]>("SELECT * FROM catfood_work_admissions WHERE run_id=? AND work_id=?").get(row.run_id, workId);
      if (!work) throw new CatfoodTrustError("WORK_NOT_FOUND");
      const source = this.source.readClaim(runSpec(row), String(work.claim_id));
      if (!source || source.claim_id !== work.claim_id || source.request_id !== work.request_id || source.capability !== work.capability || source.business_identity !== work.business_identity || source.material_revision !== work.material_revision || source.generation !== work.threads_generation) throw new CatfoodTrustError("THREADS_RESULT_IDENTITY_MISMATCH");
      if (source.claim_status === "in_progress") throw new CatfoodTrustError("WORK_NOT_TERMINAL");
      this.control.query("UPDATE catfood_work_admissions SET status='TERMINAL',terminal_json=?,completed_at=? WHERE work_id=? AND status='ADMITTED'").run(canonicalJson(source), sample.wall_time, workId);
      this.appendJournal(row, "WORK_RECONCILED", session.session_id, this.source.source_identity, { work_id: workId, authoritative_result: source as unknown as Json }, source.generation, source.claim_id, source.request_id, sample);
      if (source.provider_invoked || source.paid_cost_micros === "UNKNOWN" || Number(source.paid_cost_micros) !== 0) {
        this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='ABORTED',state_version=state_version+1 WHERE run_id=?").run(row.run_id);
        this.appendJournal(this.getRun(row.run_id), "PAID_PROVIDER_ABORT", session.session_id, this.source.source_identity, { claim_id: source.claim_id }, source.generation, source.claim_id, source.request_id, sample);
      }
      result = source;
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head);
    return result;
  }

  stop(session: RunnerSession, reason: "STOP" | "PAUSE" | "ABORT" | "EXPIRY"): void {
    const sample = this.sample(); let bindings: Record<string, unknown>[] = []; let spec!: CatfoodRunSpec;
    // Commit the local fence before any external call. Competing admissions use
    // the same immediate write lock and must re-read this closed head.
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle=?,state_version=state_version+1 WHERE run_id=?")
        .run(reason === "ABORT" ? "ABORTED" : "STOP_PENDING", row.run_id);
      this.appendJournal(this.getRun(row.run_id), `${reason}_REQUESTED`, session.session_id, "custodian", { reason }, null, null, null, sample);
      spec = runSpec(row);
      bindings = this.control.query<Record<string, unknown>, [string, number]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? AND wp3_epoch=? ORDER BY capability").all(row.run_id, row.current_epoch);
    }).immediate();
    let anchorFailure: unknown;
    const requestedHead = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!;
    try { this.anchor(session.run_id, requestedHead, { state: "COMPLETE", local_admission: "CLOSED" }); } catch (error) { anchorFailure = error; }
    const observations: Array<{ binding: Record<string, unknown>; transition?: ThreadsAuthorityTransition; boundary?: OperationalBoundaryV1; error?: string }> = [];
    for (const binding of bindings) {
      try {
        const transition = this.source.revoke(spec, binding.capability as CatfoodCapability, String(binding.authority_ref), Number(binding.threads_generation));
        observations.push({ binding, transition, boundary: validateOperationalBoundaryV1(transition.boundary) });
      } catch (error) { observations.push({ binding, error: error instanceof Error ? error.name : "UNKNOWN" }); }
    }
    let safe = !anchorFailure;
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      for (const observation of observations) {
        if (!observation.transition || !observation.boundary) {
          safe = false;
          this.appendJournal(row, "THREADS_REVOKE_UNCONFIRMED", session.session_id, this.source.source_identity, { capability: String(observation.binding.capability), error_class: observation.error ?? "UNKNOWN" }, Number(observation.binding.threads_generation), null, null, sample);
          continue;
        }
        const flight = observation.boundary.governed_in_flight as Record<string, unknown>;
        if (observation.boundary.account_id !== spec.account_id || observation.boundary.execution_state !== "INHIBITED" || observation.boundary.stop_acknowledgement !== "INHIBITED" || Number(flight.count) !== 0) safe = false;
        this.appendJournal(row, "THREADS_AUTHORITY_REVOKED", session.session_id, this.source.source_identity, { capability: String(observation.binding.capability), boundary: observation.boundary as unknown as Json }, observation.transition.generation, null, null, sample);
      }
      const unresolved = this.control.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM catfood_work_admissions WHERE run_id=? AND status<>'TERMINAL'").get(row.run_id)?.n ?? 0;
      if (unresolved) safe = false;
      const lifecycle = safe ? (reason === "PAUSE" ? "PAUSED" : reason === "ABORT" ? "ABORTED" : "SAFE_QUIESCENCE") : reason === "ABORT" ? "ABORT_UNCONFIRMED" : "STOP_UNCONFIRMED";
      this.control.query("UPDATE catfood_runs SET lifecycle=?,state_version=state_version+1 WHERE run_id=?").run(lifecycle, row.run_id);
      this.appendJournal(this.getRun(row.run_id), safe ? "SAFE_QUIESCENCE" : reason === "ABORT" ? "ABORT_UNCONFIRMED" : "STOP_UNCONFIRMED", session.session_id, this.source.source_identity, { unresolved }, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!;
    try { this.anchor(session.run_id, head); } catch (error) { anchorFailure ??= error; }
    if (anchorFailure) throw anchorFailure;
    if (!safe) throw new CatfoodTrustError("STOP_UNCONFIRMED");
  }

  takeover(runId: string, newSession: RunnerSession): void {
    this.verifyAnchored(runId); const sample = this.sample();
    this.control.transaction(() => {
      const row = this.getRun(runId);
      const stored = this.control.query<{ token_sha256: string; run_id: string }, [string]>("SELECT token_sha256,run_id FROM catfood_owner_sessions WHERE session_id=?").get(newSession.session_id);
      if (!stored || stored.run_id !== runId || stored.token_sha256 !== sha256(newSession.token)) throw new CatfoodTrustError("OWNER_SESSION_INVALID");
      if (!row.lease_expires_at || Date.parse(row.lease_expires_at) > Date.parse(sample.wall_time)) throw new CatfoodTrustError("LEASE_NOT_EXPIRED");
      const go = this.verifyCurrentGo(row, sample); const nextEpoch = Number(row.current_epoch) + 1;
      if (nextEpoch > go.payload.maximum_wp3_epoch || !["SAFE_QUIESCENCE", "STOP_UNCONFIRMED"].includes(String(row.lifecycle))) throw new CatfoodTrustError("RESTART_NOT_AUTHORIZED");
      const spec = runSpec(row); const boundaries = this.source.boundaries(spec).map(validateOperationalBoundaryV1);
      if (boundaries.some((boundary) => boundary.account_id !== spec.account_id || boundary.execution_state === "PERMITTED" || !["REVOKED", "EXPIRED"].includes(boundary.authority_state))) throw new CatfoodTrustError("RESTART_THREADS_NOT_FENCED");
      this.control.query("UPDATE catfood_runs SET owner_session_id=?,current_epoch=?,lease_expires_at=?,lifecycle='READY',admission_state='CLOSED',state_version=state_version+1 WHERE run_id=?")
        .run(newSession.session_id, nextEpoch, new Date(Date.parse(sample.wall_time) + 120_000).toISOString(), runId);
      this.appendJournal(this.getRun(runId), "RESTART_TAKEOVER", newSession.session_id, this.source.source_identity, { from_epoch: row.current_epoch, to_epoch: nextEpoch, prior_generations: boundaries.map((boundary) => [boundary.capability, boundary.fencing_generation]) as unknown as Json }, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(runId)!; this.anchor(runId, head);
  }

  closeRun(session: RunnerSession): EvaluationResult {
    this.verifyAnchored(session.run_id); const sample = this.sample();
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      if (row.lifecycle !== "SAFE_QUIESCENCE") throw new CatfoodTrustError("RUN_NOT_SAFELY_QUIESCENT");
      this.control.query("UPDATE catfood_runs SET lifecycle='CLOSED',admission_state='CLOSED',closed_wall_time=?,closed_monotonic_ms=?,closed_boot_id=?,state_version=state_version+1 WHERE run_id=?")
        .run(sample.wall_time, sample.monotonic_ms, sample.boot_id, row.run_id);
      this.appendJournal(this.getRun(row.run_id), "RUN_CLOSED", session.session_id, "custodian", {}, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "COMPLETE", final: "CLOSED" });
    const evaluation = this.evaluate(session.run_id);
    const bundle = this.rederive(session.run_id);
    this.control.query("INSERT INTO catfood_bundle_cache VALUES (?,?,?,?)").run(session.run_id, canonicalJson(bundle), sha256(canonicalJson(bundle)), sample.wall_time);
    return evaluation;
  }

  private verifyJournal(runId: string): readonly Record<string, unknown>[] {
    const rows = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_source_journal WHERE run_id=? ORDER BY sequence").all(runId);
    let prior = "GENESIS";
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      if (Number(row.sequence) !== index + 1 || row.previous_row_hash !== prior) throw new CatfoodTrustError("JOURNAL_CHAIN_INVALID");
      const base: Record<string, Json> = {
        run_id: String(row.run_id), sequence: Number(row.sequence), event_type: String(row.event_type), environment_type: String(row.environment_type), environment_instance_id: String(row.environment_instance_id), organization_id: String(row.organization_id), tenant_id: String(row.tenant_id), account_id: String(row.account_id), owner_session_id: String(row.owner_session_id), wp3_epoch: Number(row.wp3_epoch), threads_generation: row.threads_generation === null ? null : Number(row.threads_generation), source_provenance: String(row.source_provenance), claim_id: row.claim_id === null ? null : String(row.claim_id), request_id: row.request_id === null ? null : String(row.request_id), observed_at: String(row.observed_at), monotonic_ms: Number(row.monotonic_ms), boot_id: String(row.boot_id), payload_json: JSON.parse(String(row.payload_json)), previous_row_hash: String(row.previous_row_hash),
      };
      if (eventHash(base) !== row.row_hash) throw new CatfoodTrustError("JOURNAL_ROW_TAMPERED");
      prior = String(row.row_hash);
    }
    return rows;
  }

  rederive(runId: string): Record<string, Json> {
    this.verifyAnchored(runId); const row = this.getRun(runId); const spec = runSpec(row);
    const events = this.verifyJournal(runId);
    const works = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_work_admissions WHERE run_id=? ORDER BY admitted_at,work_id").all(runId);
    const admittedWorkIds = new Set(events.filter((event) => event.event_type === "WORK_ADMITTED").map((event) => String((JSON.parse(String(event.payload_json)) as Record<string, unknown>).work_id)));
    if (works.some((work) => !admittedWorkIds.has(String(work.work_id))) || admittedWorkIds.size !== works.length) throw new CatfoodTrustError("WORK_JOURNAL_TAMPERED");
    const actionTimes = events.filter((event) => event.event_type === "WORK_ADMITTED").map((event) => String(event.observed_at));
    const verificationTimes = actionTimes.length ? actionTimes : [String(events[0]?.observed_at ?? row.created_at)];
    const verified = verificationTimes.map((at) => verifyHumanGo(row.go_artifact, spec, this.trust, at));
    const go = verified[0]!;
    const consumption = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_go_consumptions WHERE run_id=?").get(runId);
    if (!consumption || consumption.grant_id !== row.grant_id || consumption.go_sha256 !== row.go_sha256 || row.go_sha256 !== go.artifact_sha256) throw new CatfoodTrustError("GO_HISTORY_TAMPERED");
    if (this.control.query("SELECT 1 FROM catfood_go_revocations WHERE grant_id=?").get(row.grant_id)) throw new CatfoodTrustError("GO_REVOKED");
    const authoritativeClaims = works.map((work) => {
      const claim = this.source.readClaim(spec, String(work.claim_id));
      if (!claim) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_MISSING");
      const terminal = work.terminal_json ? JSON.parse(String(work.terminal_json)) : null;
      if (terminal && canonicalJson(terminal) !== canonicalJson(claim)) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_TAMPERED");
      return claim;
    });
    const authorities = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? ORDER BY wp3_epoch,capability").all(runId);
    const checkpoint = this.checkpoints.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_checkpoints WHERE run_id=? ORDER BY last_sequence DESC LIMIT 1").get(runId);
    const sourceSnapshot = this.sourceSnapshot(spec);
    return JSON.parse(canonicalJson({ schema: "catfood-rederived-bundle.v1", spec, go: { payload: go.payload as unknown as Json, artifact_sha256: go.artifact_sha256, key_id: go.key_id, trust_class: go.trust_class, action_validity_verified: verificationTimes }, run: { lifecycle: row.lifecycle, admission_state: row.admission_state, current_epoch: row.current_epoch, evidence_state: row.evidence_state, start_wall_time: row.start_wall_time as Json, start_monotonic_ms: row.start_monotonic_ms as Json, start_boot_id: row.start_boot_id as Json, closed_wall_time: row.closed_wall_time as Json, closed_monotonic_ms: row.closed_monotonic_ms as Json, closed_boot_id: row.closed_boot_id as Json }, journal: events.map((event) => ({ ...event, payload_json: JSON.parse(String(event.payload_json)) })) as unknown as Json, authorities: authorities as unknown as Json, work: works.map((work, index) => ({ ...work, claim_json: JSON.parse(String(work.claim_json)), terminal_json: authoritativeClaims[index] as unknown as Json })) as unknown as Json, checkpoint: checkpoint as unknown as Json, final_source: sourceSnapshot as unknown as Json, source_mode: this.trust.source_mode, contract_gaps: [...this.source.contract_gaps] })) as Record<string, Json>;
  }

  evaluate(runId: string): EvaluationResult {
    const reasons = new Set<string>(); let bundle: Record<string, Json>;
    try { bundle = this.rederive(runId); } catch (error) {
      const code = error instanceof CatfoodTrustError ? error.code : "REDERIVATION_FAILED";
      return Object.freeze({ verdict: code.includes("TAMPER") || code.includes("CORRUPT") || code.includes("CHAIN") ? "FAIL" : "BLOCKED", reason_codes: Object.freeze([code]), rederived_bundle_sha256: "", evaluator_sha256: CATFOOD_EVALUATOR_SHA256, policy_sha256: CATFOOD_POLICY_SHA256, test_only: this.trust.source_mode === "TEST_ONLY" });
    }
    const run = plain(bundle.run, "bundle.run"); const works = bundle.work as unknown as Record<string, unknown>[]; const authorities = bundle.authorities as unknown as Record<string, unknown>[]; const journal = bundle.journal as unknown as Record<string, unknown>[];
    if (this.source.contract_gaps.length) for (const gap of this.source.contract_gaps) reasons.add(`CONTRACT_GAP:${gap}`);
    if (run.lifecycle !== "CLOSED") reasons.add("RUN_OPEN");
    if (run.evidence_state !== "ANCHORED") reasons.add("EVIDENCE_UNANCHORED");
    if (run.start_boot_id !== run.closed_boot_id || !Number.isSafeInteger(run.start_monotonic_ms) || !Number.isSafeInteger(run.closed_monotonic_ms)) reasons.add("DURATION_TRUST_UNAVAILABLE");
    else if (Number(run.closed_monotonic_ms) - Number(run.start_monotonic_ms) < CATFOOD_FIXED_POLICY.continuous_duration_seconds * 1000) reasons.add("DURATION_POLICY_NOT_MET");
    if (journal.some((event) => ["PAUSE_REQUESTED", "STOP_UNCONFIRMED"].includes(String(event.event_type)))) reasons.add("CONTINUOUS_COVERAGE_BROKEN");
    if (Number(run.current_epoch) < 2 || !journal.some((event) => event.event_type === "RESTART_TAKEOVER")) reasons.add("RESTART_NOT_PROVEN");
    const meaningful = works.filter((work) => this.meaningful(work));
    if (meaningful.length < CATFOOD_FIXED_POLICY.minimum_meaningful_units) reasons.add("MEANINGFUL_WORK_COUNT_NOT_MET");
    if (new Set(meaningful.map((work) => work.capability)).size < CATFOOD_FIXED_POLICY.minimum_capability_classes) reasons.add("MEANINGFUL_CLASS_COUNT_NOT_MET");
    if (!meaningful.some((work) => Number(work.wp3_epoch) === 1) || !meaningful.some((work) => Number(work.wp3_epoch) > 1)) reasons.add("RESTART_WORK_COVERAGE_NOT_MET");
    if (works.some((work) => work.status !== "TERMINAL")) reasons.add("UNRESOLVED_WORK");
    const finalSource = plain(bundle.final_source, "bundle.final_source"); const runtime = plain(finalSource.runtime, "bundle.final_source.runtime");
    if (runtime.cost_coverage !== "COMPLETE") reasons.add("COST_COVERAGE_INCOMPLETE");
    if (runtime.provider_activity_count !== 0 || runtime.paid_cost_micros !== 0) reasons.add("PROVIDER_COST_VIOLATION");
    const finalBoundaries = finalSource.boundaries as unknown as OperationalBoundaryV1[];
    if (!Array.isArray(finalBoundaries) || finalBoundaries.some((boundary) => boundary.execution_state !== "INHIBITED" || boundary.stop_acknowledgement !== "INHIBITED" || Number((boundary.governed_in_flight as Record<string, unknown>).count) !== 0)) reasons.add("FINAL_AUTHORITY_OPEN");
    if (works.some((work) => {
      const result = work.terminal_json ? (typeof work.terminal_json === "string" ? JSON.parse(work.terminal_json) : work.terminal_json) as ThreadsClaimRecord : null;
      return result && (result.provider_invoked || result.paid_cost_micros === "UNKNOWN" || Number(result.paid_cost_micros) !== 0);
    })) reasons.add("PROVIDER_COST_VIOLATION");
    for (const capability of new Set(authorities.map((authority) => String(authority.capability)))) {
      const last = [...journal].reverse().find((event) => {
        const payload = typeof event.payload_json === "string" ? JSON.parse(event.payload_json) : event.payload_json as Record<string, unknown>;
        return event.event_type === "THREADS_AUTHORITY_REVOKED" && payload.capability === capability;
      });
      if (!last) reasons.add("FINAL_AUTHORITY_OPEN");
    }
    const cache = this.control.query<{ bundle_json: string; bundle_sha256: string }, [string]>("SELECT bundle_json,bundle_sha256 FROM catfood_bundle_cache WHERE run_id=?").get(runId);
    const digest = sha256(canonicalJson(bundle));
    if (cache && (cache.bundle_sha256 !== digest || canonicalJson(JSON.parse(cache.bundle_json)) !== canonicalJson(bundle))) reasons.add("BUNDLE_CACHE_TAMPERED");
    const knownViolation = [...reasons].some((reason) => ["PROVIDER_COST_VIOLATION", "FINAL_AUTHORITY_OPEN", "BUNDLE_CACHE_TAMPERED"].includes(reason) || reason.includes("TAMPER"));
    const verdict: Verdict = reasons.size === 0 ? "PASS" : knownViolation || run.lifecycle === "CLOSED" ? "FAIL" : "BLOCKED";
    return Object.freeze({ verdict, reason_codes: Object.freeze([...reasons].sort()), rederived_bundle_sha256: digest, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, policy_sha256: CATFOOD_POLICY_SHA256, test_only: this.trust.source_mode === "TEST_ONLY" });
  }

  private meaningful(work: Record<string, unknown>): boolean {
    if (work.status !== "TERMINAL" || !work.terminal_json) return false;
    const claim = (typeof work.terminal_json === "string" ? JSON.parse(work.terminal_json) : work.terminal_json) as ThreadsClaimRecord;
    if (claim.claim_status !== "succeeded" || claim.transport_status !== "SUCCEEDED" || claim.provider_invoked || claim.paid_cost_micros === "UNKNOWN" || Number(claim.paid_cost_micros) !== 0) return false;
    const result = claim.domain_result;
    if (claim.capability === "editorial.cycle") return result.state === "DRAFT" && result.status === "READY";
    if (claim.capability === "editorial.outcome_evaluation") return result.state === "COMPLETED" && result.status === "RECORDED" && result.recorded === true && ["SUCCESS", "FAILURE", "INVALID_EXPERIMENT"].includes(String(result.verdict));
    if (claim.capability === "threads.publish.dry_run") return result.status === "succeeded" && result.mode === "dry_run" && result.duplicate === false;
    return false;
  }
}

export type ReadonlyThreadsEvidenceSource = Pick<ThreadsEvidenceSource,
  "source_identity" | "mode" | "contract_gaps" | "runtimeEvidence" | "boundaries" | "inventory" | "readClaim">;

/** Separate read-only artifact used by the attestation writer; it exposes no custodian mutations. */
export class IndependentCatfoodEvaluator {
  private readonly control: Database;
  private readonly checkpoints: Database;
  private readonly trust: Readonly<CatfoodTrustConfig>;

  constructor(controlPath: string, checkpointPath: string, private readonly source: ReadonlyThreadsEvidenceSource) {
    this.control = new Database(resolve(controlPath), { strict: true, create: false, readonly: true });
    this.checkpoints = new Database(resolve(checkpointPath), { strict: true, create: false, readonly: true });
    try {
      configure(this.control, true); configure(this.checkpoints, true); assertConnection(this.control); checkpointHealth(this.checkpoints);
      this.trust = loadTrust(this.control);
      if (source.mode !== this.trust.source_mode || source.source_identity !== `${this.trust.threads_sha}:${this.trust.threads_release_sha256}`) throw new CatfoodTrustError("THREADS_SOURCE_IDENTITY_MISMATCH");
    } catch (error) { this.control.close(); this.checkpoints.close(); throw error; }
  }

  close(): void { this.control.close(); this.checkpoints.close(); }

  rederive(runId: string): Record<string, Json> {
    const row = this.control.query<RunRow, [string]>("SELECT * FROM catfood_runs WHERE run_id=?").get(runId);
    if (!row) throw new CatfoodTrustError("RUN_NOT_FOUND");
    const events = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_source_journal WHERE run_id=? ORDER BY sequence").all(runId);
    let prior = "GENESIS";
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      if (Number(event.sequence) !== index + 1 || event.previous_row_hash !== prior) throw new CatfoodTrustError("JOURNAL_CHAIN_INVALID");
      const base: Record<string, Json> = { run_id: String(event.run_id), sequence: Number(event.sequence), event_type: String(event.event_type), environment_type: String(event.environment_type), environment_instance_id: String(event.environment_instance_id), organization_id: String(event.organization_id), tenant_id: String(event.tenant_id), account_id: String(event.account_id), owner_session_id: String(event.owner_session_id), wp3_epoch: Number(event.wp3_epoch), threads_generation: event.threads_generation === null ? null : Number(event.threads_generation), source_provenance: String(event.source_provenance), claim_id: event.claim_id === null ? null : String(event.claim_id), request_id: event.request_id === null ? null : String(event.request_id), observed_at: String(event.observed_at), monotonic_ms: Number(event.monotonic_ms), boot_id: String(event.boot_id), payload_json: JSON.parse(String(event.payload_json)), previous_row_hash: String(event.previous_row_hash) };
      if (eventHash(base) !== event.row_hash) throw new CatfoodTrustError("JOURNAL_ROW_TAMPERED"); prior = String(event.row_hash);
    }
    const checkpoints = this.checkpoints.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_checkpoints WHERE run_id=? ORDER BY last_sequence").all(runId);
    let previous = "GENESIS"; let highWater = 0;
    const pins = { policy_sha256: CATFOOD_POLICY_SHA256, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, threads_sha: this.trust.threads_sha, boundary_sha256: this.trust.operational_boundary_sha256, release_sha256: this.trust.threads_release_sha256, schema: this.trust.threads_schema, ikorabu_release_sha: this.trust.ikorabu_release_sha };
    for (const checkpoint of checkpoints) {
      const sequence = Number(checkpoint.last_sequence); const event = events[sequence - 1];
      const body = { run_id: String(checkpoint.run_id), last_sequence: sequence, head_hash: String(checkpoint.head_hash), previous_checkpoint: String(checkpoint.previous_checkpoint), pins_sha256: String(checkpoint.pins_sha256), coverage_sha256: String(checkpoint.coverage_sha256), custodian_identity: String(checkpoint.custodian_identity), observed_at: String(checkpoint.observed_at) };
      if (!event || sequence <= highWater || event.row_hash !== checkpoint.head_hash || checkpoint.previous_checkpoint !== previous || checkpoint.pins_sha256 !== sha256(canonicalJson(pins)) || checkpoint.custodian_identity !== this.trust.custodian_identity || checkpoint.checkpoint_id !== `chk:${sha256(canonicalJson(body)).slice(0, 32)}`) throw new CatfoodTrustError("CHECKPOINT_CHAIN_INVALID");
      highWater = sequence; previous = String(checkpoint.checkpoint_id);
    }
    const head = events.at(-1); const anchor = checkpoints.at(-1);
    if (!head || !anchor || head.sequence !== anchor.last_sequence || head.row_hash !== anchor.head_hash) throw new CatfoodTrustError(row.evidence_state === "ANCHORED" ? "CHECKPOINT_HIGH_WATER_TAMPERED" : "EVIDENCE_UNANCHORED");
    if (row.evidence_state !== "ANCHORED") throw new CatfoodTrustError("EVIDENCE_UNANCHORED");
    const spec = runSpec(row); const actionTimes = events.filter((event) => event.event_type === "WORK_ADMITTED").map((event) => String(event.observed_at));
    const verificationTimes = actionTimes.length ? actionTimes : [String(events[0]?.observed_at ?? row.created_at)]; const go = verifyHumanGo(row.go_artifact, spec, this.trust, verificationTimes[0]!);
    for (const at of verificationTimes.slice(1)) verifyHumanGo(row.go_artifact, spec, this.trust, at);
    const consumption = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_go_consumptions WHERE run_id=?").get(runId);
    if (!consumption || consumption.grant_id !== row.grant_id || consumption.go_sha256 !== row.go_sha256 || row.go_sha256 !== go.artifact_sha256) throw new CatfoodTrustError("GO_HISTORY_TAMPERED");
    if (this.control.query("SELECT 1 FROM catfood_go_revocations WHERE grant_id=?").get(row.grant_id)) throw new CatfoodTrustError("GO_REVOKED");
    const rawWorks = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_work_admissions WHERE run_id=? ORDER BY admitted_at,work_id").all(runId);
    const admittedWorkIds = new Set(events.filter((event) => event.event_type === "WORK_ADMITTED").map((event) => String((JSON.parse(String(event.payload_json)) as Record<string, unknown>).work_id)));
    if (rawWorks.some((work) => !admittedWorkIds.has(String(work.work_id))) || admittedWorkIds.size !== rawWorks.length) throw new CatfoodTrustError("WORK_JOURNAL_TAMPERED");
    const works = rawWorks.map((work) => {
      const claim = this.source.readClaim(spec, String(work.claim_id)); if (!claim) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_MISSING");
      if (work.terminal_json && canonicalJson(JSON.parse(String(work.terminal_json))) !== canonicalJson(claim)) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_TAMPERED");
      return { ...work, claim_json: JSON.parse(String(work.claim_json)), terminal_json: claim };
    });
    const authorities = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? ORDER BY wp3_epoch,capability").all(runId);
    const runtime = this.source.runtimeEvidence(spec); const boundaries = this.source.boundaries(spec).map(validateOperationalBoundaryV1); const inventory = this.source.inventory(spec);
    return JSON.parse(canonicalJson({ schema: "catfood-rederived-bundle.v1", spec, go: { payload: go.payload as unknown as Json, artifact_sha256: go.artifact_sha256, key_id: go.key_id, trust_class: go.trust_class, action_validity_verified: verificationTimes }, run: { lifecycle: row.lifecycle, admission_state: row.admission_state, current_epoch: row.current_epoch, evidence_state: row.evidence_state, start_wall_time: row.start_wall_time as Json, start_monotonic_ms: row.start_monotonic_ms as Json, start_boot_id: row.start_boot_id as Json, closed_wall_time: row.closed_wall_time as Json, closed_monotonic_ms: row.closed_monotonic_ms as Json, closed_boot_id: row.closed_boot_id as Json }, journal: events.map((event) => ({ ...event, payload_json: JSON.parse(String(event.payload_json)) })), authorities, work: works, checkpoint: anchor, final_source: { runtime, boundaries, inventory, gaps: [...this.source.contract_gaps], digest: sha256(canonicalJson({ runtime, boundaries, inventory, gaps: [...this.source.contract_gaps] })) }, source_mode: this.trust.source_mode, contract_gaps: [...this.source.contract_gaps] })) as Record<string, Json>;
  }

  evaluate(runId: string): EvaluationResult {
    let bundle: Record<string, Json>;
    try { bundle = this.rederive(runId); } catch (error) {
      const code = error instanceof CatfoodTrustError ? error.code : "REDERIVATION_FAILED";
      return Object.freeze({ verdict: /TAMPER|CORRUPT|CHAIN/.test(code) ? "FAIL" : "BLOCKED", reason_codes: Object.freeze([code]), rederived_bundle_sha256: "", evaluator_sha256: CATFOOD_EVALUATOR_SHA256, policy_sha256: CATFOOD_POLICY_SHA256, test_only: this.trust.source_mode === "TEST_ONLY" });
    }
    const reasons = new Set<string>(); const run = plain(bundle.run, "run"); const work = bundle.work as unknown as Record<string, unknown>[]; const journal = bundle.journal as unknown as Record<string, unknown>[]; const source = plain(bundle.final_source, "source"); const runtime = plain(source.runtime, "runtime"); const boundaries = source.boundaries as unknown as OperationalBoundaryV1[];
    for (const gap of this.source.contract_gaps) reasons.add(`CONTRACT_GAP:${gap}`);
    if (run.lifecycle !== "CLOSED") reasons.add("RUN_OPEN"); if (run.evidence_state !== "ANCHORED") reasons.add("EVIDENCE_UNANCHORED");
    if (run.start_boot_id !== run.closed_boot_id || Number(run.closed_monotonic_ms) - Number(run.start_monotonic_ms) < 86_400_000) reasons.add("DURATION_POLICY_NOT_MET");
    if (journal.some((event) => ["PAUSE_REQUESTED", "STOP_UNCONFIRMED"].includes(String(event.event_type)))) reasons.add("CONTINUOUS_COVERAGE_BROKEN");
    if (Number(run.current_epoch) < 2 || !journal.some((event) => event.event_type === "RESTART_TAKEOVER")) reasons.add("RESTART_NOT_PROVEN");
    const meaningful = work.filter((item) => meaningfulClaim(item));
    if (meaningful.length < 3) reasons.add("MEANINGFUL_WORK_COUNT_NOT_MET"); if (new Set(meaningful.map((item) => item.capability)).size < 2) reasons.add("MEANINGFUL_CLASS_COUNT_NOT_MET");
    if (!meaningful.some((item) => Number(item.wp3_epoch) === 1) || !meaningful.some((item) => Number(item.wp3_epoch) > 1)) reasons.add("RESTART_WORK_COVERAGE_NOT_MET");
    if (work.some((item) => item.status !== "TERMINAL")) reasons.add("UNRESOLVED_WORK");
    if (runtime.cost_coverage !== "COMPLETE") reasons.add("COST_COVERAGE_INCOMPLETE"); if (runtime.provider_activity_count !== 0 || runtime.paid_cost_micros !== 0) reasons.add("PROVIDER_COST_VIOLATION");
    if (boundaries.some((boundary) => boundary.execution_state !== "INHIBITED" || boundary.stop_acknowledgement !== "INHIBITED" || Number((boundary.governed_in_flight as Record<string, unknown>).count) !== 0)) reasons.add("FINAL_AUTHORITY_OPEN");
    const digest = sha256(canonicalJson(bundle)); const cache = this.control.query<{ bundle_json: string; bundle_sha256: string }, [string]>("SELECT bundle_json,bundle_sha256 FROM catfood_bundle_cache WHERE run_id=?").get(runId);
    if (cache && (cache.bundle_sha256 !== digest || canonicalJson(JSON.parse(cache.bundle_json)) !== canonicalJson(bundle))) reasons.add("BUNDLE_CACHE_TAMPERED");
    const violation = [...reasons].some((reason) => /TAMPER|VIOLATION|FINAL_AUTHORITY_OPEN|BUNDLE_CACHE/.test(reason));
    return Object.freeze({ verdict: reasons.size === 0 ? "PASS" : violation || run.lifecycle === "CLOSED" ? "FAIL" : "BLOCKED", reason_codes: Object.freeze([...reasons].sort()), rederived_bundle_sha256: digest, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, policy_sha256: CATFOOD_POLICY_SHA256, test_only: this.trust.source_mode === "TEST_ONLY" });
  }
}

function meaningfulClaim(work: Record<string, unknown>): boolean {
  if (work.status !== "TERMINAL" || !work.terminal_json) return false; const claim = work.terminal_json as ThreadsClaimRecord;
  if (claim.claim_status !== "succeeded" || claim.transport_status !== "SUCCEEDED" || claim.provider_invoked || claim.paid_cost_micros !== 0) return false;
  if (claim.capability === "editorial.cycle") return claim.domain_result.state === "DRAFT" && claim.domain_result.status === "READY";
  if (claim.capability === "editorial.outcome_evaluation") return claim.domain_result.state === "COMPLETED" && claim.domain_result.status === "RECORDED" && claim.domain_result.recorded === true && ["SUCCESS", "FAILURE", "INVALID_EXPERIMENT"].includes(String(claim.domain_result.verdict));
  return claim.capability === "threads.publish.dry_run" && claim.domain_result.status === "succeeded" && claim.domain_result.mode === "dry_run" && claim.domain_result.duplicate === false;
}
