import { Database } from "bun:sqlite";
import { createPublicKey, randomBytes, verify } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { assertEnrolledRole, authorizeEnrolledAction, deriveEnrolledTrustDomain, inspectEnrolledRole, type CatfoodActionAuthorization, type CatfoodActionPurpose, type CatfoodEnrollmentContext, type EnrolledTrustProvenance } from "./catfood-enrollment";
import { canonicalJson, sha256, validateOperationalBoundaryV1, type Json, type OperationalBoundaryV1 } from "./catfood-harness";
import { CATFOOD_THREADS_DEPENDENCY_ROOT, acquireCoe, assessCoe, assertFrozenDependencies, canonicalCoeJson, classifyRunAttempts, decodeCoeAcquisition, stableCoeEvidence, validateOutcomeEvaluationRequest, verifyGovernedWork, type AttemptMembershipDecision, type CoeAcquisition, type CoeAssessment, type CoePageSource, type GovernedWorkDecision, type OutcomeEvaluationRequest } from "./catfood-coe";

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
  failed_governed_attempt: "RUN_FAIL",
  paid_provider_allowance: "ZERO",
  night: "UNEXERCISED_EXCLUDED",
});
export const CATFOOD_POLICY_SHA256 = sha256(canonicalJson(CATFOOD_FIXED_POLICY));
export const CATFOOD_EVALUATOR_SHA256 = sha256(canonicalJson({
  version: CATFOOD_EVALUATOR_VERSION,
  policy_sha256: CATFOOD_POLICY_SHA256,
  source: "protected-journal+external-checkpoint+threads-source+signed-go",
}));
export const CATFOOD_EVALUATION_PROVENANCE_NODES = Object.freeze(["supervisor", "role_session", "role_build", "source", "clock", "go", "environment", "acquisition", "custodian", "sealed_run", "evaluator"]);

const SHA40 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const ACCOUNT = /^acct_[A-Za-z0-9_-]{1,128}$/;
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const REQUIRED_CONTROL_TABLES = Object.freeze([
  "catfood_trust_meta", "catfood_runs", "catfood_go_consumptions", "catfood_go_revocations",
  "catfood_owner_sessions", "catfood_preflight_receipts", "catfood_authority_bindings", "catfood_authority_renewals",
  "catfood_work_admissions", "catfood_source_journal", "catfood_bundle_cache",
]);
const REQUIRED_CONTROL_INDEXES = Object.freeze([
  "catfood_journal_head", "catfood_work_semantic_identity", "catfood_receipts_unconsumed",
]);
const REQUIRED_CONTROL_TRIGGERS = Object.freeze([
  "catfood_meta_no_update", "catfood_meta_no_delete", "catfood_go_no_update", "catfood_go_no_delete",
  "catfood_revocations_no_update", "catfood_revocations_no_delete", "catfood_sessions_no_update",
  "catfood_sessions_no_delete", "catfood_authority_no_update", "catfood_authority_no_delete",
  "catfood_renewal_no_update", "catfood_renewal_no_delete",
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
  readonly operational_provenance?: OperationalProvenance;
  sample(): TrustedClockSample;
}

export interface OperationalProvenance {
  bootstrap_sha256: string;
  accepted_manifest_sha256: string;
  environment_identity: string;
  trust_domain: string;
}

export const CATFOOD_OPERATIONAL_ROOT = process.platform === "win32" ? "C:\\ProgramData\\IKORABU\\catfood" : "/etc/ikorabu/catfood";

function verifyOperationalProvenance(value: OperationalProvenance | undefined): void {
  if (!value) throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_UNPROVISIONED");
  const bootstrapPath = join(CATFOOD_OPERATIONAL_ROOT, "bootstrap.json"); const acceptedPath = join(CATFOOD_OPERATIONAL_ROOT, "accepted-consumer-manifest.sha256");
  try {
    for (const path of [bootstrapPath, acceptedPath]) { const stat = statSync(path); if (!stat.isFile() || stat.size <= 0 || stat.size > 1_000_000) throw new Error(); }
    const bootstrap = readFileSync(bootstrapPath, "utf8"); const accepted = readFileSync(acceptedPath, "utf8").trim();
    if (sha256(bootstrap) !== value.bootstrap_sha256 || accepted !== value.accepted_manifest_sha256 || !SHA256.test(accepted) || !value.environment_identity || !value.trust_domain) throw new Error();
  } catch { throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_UNPROVISIONED"); }
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
  wp1_sha256: string;
  coe_sha256: string;
  rehearsal_attestation_sha256: string;
  emitter_inventory_sha256: string;
  threads_schema: 33;
  threads_schema_fingerprint: string;
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
  wp1_sha256: string;
  coe_sha256: string;
  rehearsal_attestation_sha256: string;
  emitter_inventory_sha256: string;
  threads_schema: 33;
  threads_schema_fingerprint: string;
  requested_window_start: string;
  requested_window_end: string;
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
  threads_schema: 33;
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
  exact(raw, ["run_id", "environment_type", "environment_instance_id", "organization_id", "tenant_id", "account_id", "capabilities", "effective_config_sha256", "ikorabu_release_sha", "threads_sha", "operational_boundary_sha256", "threads_release_sha256", "wp1_sha256", "coe_sha256", "rehearsal_attestation_sha256", "emitter_inventory_sha256", "threads_schema", "threads_schema_fingerprint", "requested_window_start", "requested_window_end"], "run spec");
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
    wp1_sha256: text(raw.wp1_sha256, "wp1_sha256", SHA256),
    coe_sha256: text(raw.coe_sha256, "coe_sha256", SHA256),
    rehearsal_attestation_sha256: text(raw.rehearsal_attestation_sha256, "rehearsal_attestation_sha256", SHA256),
    emitter_inventory_sha256: text(raw.emitter_inventory_sha256, "emitter_inventory_sha256", SHA256),
    threads_schema: raw.threads_schema,
    threads_schema_fingerprint: text(raw.threads_schema_fingerprint, "threads_schema_fingerprint", SHA256),
    requested_window_start: text(raw.requested_window_start, "requested_window_start", /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    requested_window_end: text(raw.requested_window_end, "requested_window_end", /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    acceptance_policy_sha256: CATFOOD_POLICY_SHA256,
    night_state: "UNEXERCISED_EXCLUDED" as const,
  };
  if (!(["test", "staging", "production"] as const).includes(clean.environment_type as never) || clean.threads_schema !== 33 || Date.parse(clean.requested_window_end) - Date.parse(clean.requested_window_start) !== 86_400_000) throw new CatfoodTrustError("SPEC_INVALID");
  assertFrozenDependencies(clean);
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
    || payload.paid_provider_allowance !== "ZERO" || payload.threads_schema !== 33
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
    || spec.wp1_sha256 !== trust.wp1_sha256 || spec.coe_sha256 !== trust.coe_sha256
    || spec.rehearsal_attestation_sha256 !== trust.rehearsal_attestation_sha256 || spec.emitter_inventory_sha256 !== trust.emitter_inventory_sha256
    || spec.threads_schema !== trust.threads_schema || spec.threads_schema_fingerprint !== trust.threads_schema_fingerprint) throw new CatfoodTrustError("TRUST_CONFIG_SCOPE_MISMATCH");
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

export interface TenantProbeEvidence {
  probe_id: string; principal_ref: string; credential_version_ref: string;
  organization_id: string; own_account_id: string; foreign_account_id: string;
  own_result: "EXPECTED_RESOURCE"; foreign_result: "AUTHORIZATION_DENIED"; foreign_status: 403;
  logical_runtime_id: string; worker_boot_id: string; observed_at: string; receipt_id: string;
  source_session_id?: string; source_build_sha256?: string; protected_origin?: string;
  route?: "GET /autopilot/v2/operational-boundary"; method?: "GET";
}

export interface ThreadsInventoryItem {
  source_id: string;
  capability: CatfoodCapability;
  business_identity: string;
  material_revision: string;
  intent?: Readonly<
    { kind: "editorial.cycle"; cycle_key: string; producer_request_id: string }
    | { kind: "editorial.outcome_evaluation"; experiment_id: string; observed_through: string | null }
    | { kind: "threads.publish.dry_run"; content_id: string; expected_version: number; expected_content_hash: string; actor: string }
  >;
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
  invocation_receipt?: import("./catfood-coe").ProtectedInvocationBinding;
}

export interface ThreadsAuthorityTransition {
  boundary: OperationalBoundaryV1;
  authority_ref: string;
  generation: number;
}

export interface ThreadsEvidenceSource extends CoePageSource {
  readonly source_identity: string;
  readonly mode: SourceMode;
  readonly operational_provenance?: OperationalProvenance;
  prepareEnrollmentUse?(action: string, target: string): void;
  prepareAuthorizedAcquisition?(authorization: CatfoodActionAuthorization, request: Readonly<{ account_id: string; assessment_mode: "LIVE" | "HISTORICAL"; window_start: string; window_end: string }>): void;
  runtimeEvidence(spec: CatfoodRunSpec): ThreadsRuntimeEvidence;
  tenantProbe(spec: CatfoodRunSpec): TenantProbeEvidence;
  boundaries(spec: CatfoodRunSpec, authorization?: CatfoodActionAuthorization): readonly OperationalBoundaryV1[];
  inventory(spec: CatfoodRunSpec): readonly ThreadsInventoryItem[];
  grant(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number | null, permitExpiresAt: string): ThreadsAuthorityTransition;
  renew(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number, permitExpiresAt: string): ThreadsAuthorityTransition;
  revoke(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number, authorization?: CatfoodActionAuthorization): ThreadsAuthorityTransition;
  claim(spec: CatfoodRunSpec, item: ThreadsInventoryItem, authorityRef: string, generation: number, requestId?: string): ThreadsClaimRecord;
  outcomeEvaluation(spec: CatfoodRunSpec, request: Readonly<OutcomeEvaluationRequest>, item: ThreadsInventoryItem): ThreadsClaimRecord;
  readClaim(spec: CatfoodRunSpec, claimId: string, authorization?: CatfoodActionAuthorization): ThreadsClaimRecord | null;
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

export interface TestObservationPolicy {
  kind: "TEST_ONLY_EXPLICIT";
  cadence_seconds: number;
  maximum_gap_seconds: number;
  clock_mapping: "SAME_TEST_CLOCK";
}

function requireZeroPaidRuntime(runtime: ThreadsRuntimeEvidence): void {
  if (runtime.writer_enabled !== false || runtime.paid_generation_enabled !== false) throw new CatfoodTrustError("PAID_PATH_NOT_DISABLED");
  if (runtime.provider_activity_count === "UNKNOWN" || runtime.paid_cost_micros === "UNKNOWN" || Number(runtime.provider_activity_count) !== 0 || Number(runtime.paid_cost_micros) !== 0 || runtime.cost_coverage !== "COMPLETE") throw new CatfoodTrustError("PAID_ACTIVITY_NOT_ZERO");
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
  evidence_coverage: "COMPLETE" | "PARTIAL" | "UNKNOWN";
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
CREATE TABLE catfood_authority_renewals (request_id TEXT PRIMARY KEY,run_id TEXT NOT NULL,wp3_epoch INTEGER NOT NULL,capability TEXT NOT NULL,authority_ref TEXT NOT NULL,threads_generation INTEGER NOT NULL,boundary_sha256 TEXT NOT NULL,permit_expires_at TEXT NOT NULL,created_at TEXT NOT NULL) STRICT;
CREATE TRIGGER catfood_renewal_no_update BEFORE UPDATE ON catfood_authority_renewals BEGIN SELECT RAISE(ABORT,'authority renewals are append-only'); END;
CREATE TRIGGER catfood_renewal_no_delete BEFORE DELETE ON catfood_authority_renewals BEGIN SELECT RAISE(ABORT,'authority renewals are append-only'); END;
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
  exact(row, ["schema", "custodian_identity", "environment_type", "environment_instance_id", "organization_id", "tenant_id", "account_id", "ikorabu_release_sha", "threads_sha", "operational_boundary_sha256", "threads_release_sha256", "wp1_sha256", "coe_sha256", "rehearsal_attestation_sha256", "emitter_inventory_sha256", "threads_schema", "threads_schema_fingerprint", "source_mode", "go_keys"], "trust config");
  if (row.schema !== CATFOOD_TRUST_SCHEMA || !["test", "staging", "production"].includes(String(row.environment_type)) || !["OPERATIONAL", "TEST_ONLY"].includes(String(row.source_mode)) || row.threads_schema !== 33) throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
  text(row.custodian_identity, "custodian_identity"); text(row.environment_instance_id, "environment_instance_id"); text(row.organization_id, "organization_id"); text(row.tenant_id, "tenant_id"); text(row.account_id, "account_id", ACCOUNT);
  text(row.ikorabu_release_sha, "ikorabu_release_sha", SHA40); text(row.threads_sha, "threads_sha", SHA40); text(row.operational_boundary_sha256, "operational_boundary_sha256", SHA256); text(row.threads_release_sha256, "threads_release_sha256", SHA256); text(row.wp1_sha256, "wp1_sha256", SHA256); text(row.coe_sha256, "coe_sha256", SHA256); text(row.rehearsal_attestation_sha256, "rehearsal_attestation_sha256", SHA256); text(row.emitter_inventory_sha256, "emitter_inventory_sha256", SHA256); text(row.threads_schema_fingerprint, "threads_schema_fingerprint", SHA256);
  if (!Array.isArray(row.go_keys) || !row.go_keys.length) throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
  const seen = new Set<string>();
  for (const candidate of row.go_keys) {
    const key = plain(candidate, "GO key"); exact(key, ["key_id", "public_key_pem", "trust_class"], "GO key");
    const keyId = text(key.key_id, "key_id"); if (seen.has(keyId)) throw new CatfoodTrustError("DUPLICATE_GO_KEY"); seen.add(keyId);
    if (typeof key.public_key_pem !== "string" || !["OPERATIONAL", "TEST_ONLY"].includes(String(key.trust_class))) throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
    try { const parsed = createPublicKey(key.public_key_pem); if (parsed.asymmetricKeyType !== "ed25519") throw new Error(); } catch { throw new CatfoodTrustError("GO_KEY_INVALID"); }
  }
  if (row.source_mode === "OPERATIONAL" && row.environment_type === "test") throw new CatfoodTrustError("TRUST_CONFIG_INVALID");
  assertFrozenDependencies({ ...value, requested_window_start: "2000-01-01T00:00:00Z", requested_window_end: "2000-01-02T00:00:00Z" });
  return Object.freeze(JSON.parse(canonicalJson(value)));
}

export function initializeProtectedCatfoodStores(controlPath: string, checkpointPath: string, trustInput: CatfoodTrustConfig, at: string, enrollment?: CatfoodEnrollmentContext): void {
  if (trustInput.source_mode === "OPERATIONAL") { try { assertEnrolledRole(enrollment, "custodian", "OPERATIONAL"); } catch { throw new CatfoodTrustError("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE"); } } else if (enrollment) assertEnrolledRole(enrollment, "custodian", "TEST_ONLY");
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

type BoundaryOperation = "PREPARE" | "ADMIT" | "STOP" | "FINAL";

function verifyBoundary(boundaryInput: unknown, spec: CatfoodRunSpec, operation: BoundaryOperation, now: string, expected?: { capability: CatfoodCapability; generation: number }): OperationalBoundaryV1 {
  const boundary = validateOperationalBoundaryV1(boundaryInput); const release = boundary.producer_release_identity as Record<string, unknown> | null;
  const binding = boundary.org_tenant_binding as Record<string, unknown>; const stops = boundary.effective_safety_controls as Record<string, unknown>; const flight = boundary.governed_in_flight as Record<string, unknown>;
  if (!release || release.git_sha !== spec.threads_sha || release.artifact_sha256 !== spec.threads_release_sha256 || boundary.schema_version !== spec.threads_schema || boundary.schema_readiness !== "READY" || boundary.schema_fingerprint !== spec.threads_schema_fingerprint || boundary.account_id !== spec.account_id || binding.state !== "bound" || canonicalJson(binding.org_ids) !== canonicalJson([spec.organization_id])) throw new CatfoodTrustError("BOUNDARY_IDENTITY_MISMATCH");
  const observed = Date.parse(String(boundary.observed_at)); const at = Date.parse(now);
  if (operation !== "FINAL" && (!Number.isFinite(observed) || observed > at + 5_000 || at - observed > 120_000)) throw new CatfoodTrustError("BOUNDARY_OBSERVATION_STALE");
  if (Number(flight.unattributed_count) !== 0 || flight.attribution_state !== "COMPLETE") throw new CatfoodTrustError("BOUNDARY_IN_FLIGHT_UNATTRIBUTED");
  if (operation === "PREPARE" && (boundary.execution_state === "UNKNOWN" || boundary.authority_state === "CONFLICT")) throw new CatfoodTrustError("BOUNDARY_UNSAFE");
  if (operation === "ADMIT") {
    if (!expected || boundary.capability !== expected.capability || boundary.execution_state !== "PERMITTED" || boundary.authority_state !== "ACTIVE" || boundary.fencing_generation !== expected.generation || Date.parse(String(boundary.permit_expires_at)) <= at || stops.global_stop === true || stops.account_stop === true || stops.capability_stop === true || boundary.blocked_reasons.length) throw new CatfoodTrustError("BOUNDARY_ADMISSION_DENIED");
  }
  if (operation === "FINAL" && (boundary.execution_state !== "INHIBITED" || boundary.stop_acknowledgement !== "INHIBITED" || Number(flight.count) !== 0)) throw new CatfoodTrustError("FINAL_AUTHORITY_OPEN");
  return boundary;
}

function liveScope(spec: CatfoodRunSpec, now: string): CatfoodRunSpec {
  const at = Date.parse(now), start = Date.parse(spec.requested_window_start), end = Date.parse(spec.requested_window_end);
  if (at < start) throw new CatfoodTrustError("WINDOW_NOT_OPEN");
  if (at >= end) throw new CatfoodTrustError("WINDOW_CLOSED");
  const rounded = Math.floor(at / 1000) * 1000;
  return { ...spec, requested_window_start: new Date(rounded - 120_000).toISOString().replace(".000Z", "Z"), requested_window_end: new Date(rounded).toISOString().replace(".000Z", "Z") };
}

function coverageOf(assessment: CoeAssessment): "COMPLETE" | "PARTIAL" | "UNKNOWN" {
  const state = String(assessment.evidence.coverage.state);
  return state === "COMPLETE" ? "COMPLETE" : state === "PARTIAL" ? "PARTIAL" : "UNKNOWN";
}

function retainedClosedSource(events: readonly Record<string, unknown>[]): Record<string, unknown> {
  const sealed = [...events].reverse().find((event) => event.event_type === "CLOSED_SOURCE_SEALED");
  if (!sealed) throw new CatfoodTrustError("CLOSED_SOURCE_ARCHIVE_MISSING");
  const payload = plain(typeof sealed.payload_json === "string" ? JSON.parse(sealed.payload_json) : sealed.payload_json, "closed source");
  const { source_digest: digest, ...core } = payload;
  if (payload.phase !== "CLOSED_RUN" || payload.dependency_root !== CATFOOD_THREADS_DEPENDENCY_ROOT || typeof digest !== "string" || sha256(canonicalJson(core)) !== digest) throw new CatfoodTrustError("CLOSED_SOURCE_ARCHIVE_TAMPERED");
  if (typeof payload.coe_base64url !== "string" || typeof payload.coe_sha256 !== "string") throw new CatfoodTrustError("CLOSED_SOURCE_ARCHIVE_TAMPERED");
  const coeJson = Buffer.from(payload.coe_base64url, "base64url").toString();
  if (Buffer.from(coeJson).toString("base64url") !== payload.coe_base64url || sha256(coeJson) !== payload.coe_sha256) throw new CatfoodTrustError("CLOSED_SOURCE_ARCHIVE_TAMPERED");
  try { return { ...payload, coe: decodeCoeAcquisition(coeJson) }; } catch { throw new CatfoodTrustError("CLOSED_SOURCE_ARCHIVE_TAMPERED"); }
}

function closedCoeSummary(coe: CoeAcquisition): Record<string, Json> {
  const window = coe.coverage.window as Record<string, Json>; const prospective = coe.coverage.prospective as Record<string, Json>;
  return { phase: coe.phase, digest: coe.digest, producer_release_identity: coe.producer_release_identity as unknown as Json, scope: coe.scope as unknown as Json, coverage: { state: coe.coverage.state as Json, unresolved_count: coe.coverage.unresolved_count as Json, snapshot_identity: coe.coverage.snapshot_identity as Json, record_set_digest: coe.coverage.record_set_digest as Json, cuts: coe.coverage.cuts as Json, window: { assessment_mode: window.assessment_mode, requested_window_start: window.requested_window_start, requested_window_end: window.requested_window_end, state: window.state }, prospective: { state: prospective.state, proof_id: prospective.proof_id, proof_applicable: prospective.proof_applicable } }, prohibited_activity: { coverage: coe.prohibited_activity.coverage as Json, activity: coe.prohibited_activity.activity as Json, exposure: coe.prohibited_activity.exposure as Json, known_zero: coe.prohibited_activity.known_zero as Json, pending_cost_count: coe.prohibited_activity.pending_cost_count as Json, unknown_cost_count: coe.prohibited_activity.unknown_cost_count as Json, unattributed_attempt_count: coe.prohibited_activity.unattributed_attempt_count as Json }, record_count: coe.records.length, page_count: coe.page_count, test_only: coe.test_only };
}

const WORK_DISPATCH_SEMANTICS = Object.freeze({
  WORK_DISPATCH_INTENT: "INTENT",
  WORK_DISPATCH_RELEASED: "RELEASED",
  WORK_DISPATCH_AMBIGUOUS: "UNRESOLVED",
  WORK_DISPATCH_POSSIBLY_APPLIED: "UNRESOLVED",
  WORK_DISPATCH_REMOTE_FACT: "REMOTE_FACT",
  WORK_POSITIVE_APPLY_REJECTED: "REMOTE_FACT",
  WORK_DISPATCH_REJECTED: "REJECTED",
  WORK_ADMITTED: "ADMITTED",
} as const);

type WorkDispatchState = { request_id: string; claim_id: string | null; released: boolean; unresolved: boolean; terminal: boolean; events: readonly string[] };

export function normalizeWorkDispatchEvidence(events: readonly Record<string, unknown>[]): readonly WorkDispatchState[] {
  const states = new Map<string, { request_id: string; claim_id: string | null; released: boolean; unresolved: boolean; terminal: boolean; events: string[] }>();
  for (const event of events) {
    const eventType = String(event.event_type); const semantic = WORK_DISPATCH_SEMANTICS[eventType as keyof typeof WORK_DISPATCH_SEMANTICS] ?? (eventType.startsWith("WORK_DISPATCH_") ? "UNRESOLVED" : undefined);
    if (!semantic) continue;
    const payload = typeof event.payload_json === "string" ? JSON.parse(event.payload_json) as Record<string, unknown> : event.payload_json as Record<string, unknown>;
    const requestId = String(payload.request_id ?? event.request_id ?? ""); if (!requestId) continue;
    const state = states.get(requestId) ?? { request_id: requestId, claim_id: null, released: false, unresolved: false, terminal: false, events: [] };
    if (event.claim_id !== null && event.claim_id !== undefined) state.claim_id = String(event.claim_id);
    state.events.push(eventType);
    if (semantic === "RELEASED") state.released = true;
    if (semantic === "UNRESOLVED") state.unresolved = true;
    if (semantic === "REMOTE_FACT" || semantic === "ADMITTED") state.terminal = true;
    if (semantic === "REJECTED") {
      const dispatchState = String(payload.dispatch_state ?? "LEGACY_UNKNOWN");
      if (dispatchState === "NOT_DISPATCHED" || dispatchState === "REMOTE_REJECTED" || !state.released && dispatchState === "LEGACY_UNKNOWN") state.terminal = true;
      else state.unresolved = true;
    }
    states.set(requestId, state);
  }
  return Object.freeze([...states.values()].map((state) => Object.freeze({ ...state, events: Object.freeze([...state.events]) })));
}

function runMembership(spec: CatfoodRunSpec, coe: CoeAcquisition, authorities: readonly Record<string, unknown>[], events: readonly Record<string, unknown>[]): readonly AttemptMembershipDecision[] {
  const normalized = normalizeWorkDispatchEvidence(events);
  const intents = normalized.map((item) => ({ request_id: item.request_id, claim_id: item.claim_id }));
  return classifyRunAttempts(coe, {
    account_id: spec.account_id, spec_hash: spec.spec_sha256, window_start: spec.requested_window_start, window_end: spec.requested_window_end,
    authorities: authorities.map((row) => ({ capability: String(row.capability), authority_ref: String(row.authority_ref), generation: Number(row.threads_generation) })), intents,
  });
}

function membershipReasons(decisions: readonly AttemptMembershipDecision[], works: readonly Record<string, unknown>[], events: readonly Record<string, unknown>[]): readonly string[] {
  const reasons = new Set<string>(); const localRequests = new Set(works.map((work) => String(work.request_id)));
  for (const decision of decisions) {
    if (decision.membership === "UNRESOLVED_MEMBERSHIP") { reasons.add("RUN_MEMBERSHIP_UNRESOLVED"); continue; }
    if (decision.membership !== "IN_SCOPE") continue;
    const state = String(decision.attempt.terminal.event_type);
    if (state === "FAILED") reasons.add("COE_RUN_LINKED_WORK_FAILED");
    else if (["CLAIMED", "UNRESOLVED"].includes(state)) reasons.add("COE_RUN_LINKED_WORK_UNRESOLVED");
    else if (state === "SUCCEEDED" && !localRequests.has(String(decision.attempt.terminal.request_id))) reasons.add("COE_UNTRACKED_RUN_WORK");
  }
  const known = new Set(decisions.flatMap((decision) => decision.attempt.lifecycle.map((row) => String(row.request_id))));
  for (const dispatch of normalizeWorkDispatchEvidence(events)) if (dispatch.unresolved && !dispatch.terminal && !known.has(dispatch.request_id)) reasons.add("WORK_DISPATCH_OUTCOME_UNRESOLVED");
  return Object.freeze([...reasons].sort());
}

type AuthorityMutationOperation = "grant" | "renew" | "revoke";
type AuthorityMutationOutcome = "NOT_DISPATCHED" | "RELEASED_UNRESOLVED" | "REMOTE_AMBIGUOUS" | "REMOTE_SUCCEEDED" | "REMOTE_REJECTED";
type AuthorityMutationObligation = Readonly<{
  request_id: string; operation: AuthorityMutationOperation; capability: CatfoodCapability; original_epoch: number;
  source_provenance: string; account_id: string; tenant_id: string; payload_sha256: string | null;
  expected_generation: number | null; expected_generation_known: boolean; requested_authority_ref: string | null; returned_authority_ref: string | null;
  returned_generation: number | null; released: boolean; outcome: AuthorityMutationOutcome; identity_conflict: boolean;
}>;

const AUTHORITY_MUTATION_EVENTS = Object.freeze([
  "THREADS_AUTHORITY_GRANT_INTENT", "THREADS_AUTHORITY_RENEWAL_INTENT", "THREADS_AUTHORITY_REVOKE_INTENT",
  "THREADS_AUTHORITY_DISPATCH_RELEASED", "THREADS_AUTHORITY_REMOTE_FACT", "THREADS_AUTHORITY_REVOKE_REMOTE_FACT",
  "THREADS_AUTHORITY_POSSIBLY_APPLIED", "THREADS_AUTHORITY_RENEWAL_AMBIGUOUS",
  "THREADS_AUTHORITY_REMOTE_REJECTED", "THREADS_AUTHORITY_NOT_DISPATCHED",
]);

function authorityMutationInventory(events: readonly Record<string, unknown>[]): readonly AuthorityMutationObligation[] {
  type Mutable = Omit<AuthorityMutationObligation, "outcome"> & { ambiguous: boolean; succeeded: boolean; rejected: boolean; not_dispatched: boolean };
  const rows = new Map<string, Mutable>();
  for (const event of events) {
    const eventType = String(event.event_type); if (!AUTHORITY_MUTATION_EVENTS.includes(eventType)) continue;
    const payload = typeof event.payload_json === "string" ? JSON.parse(event.payload_json) as Record<string, unknown> : event.payload_json as Record<string, unknown>;
    const requestId = String(payload.request_id ?? event.request_id ?? ""), capability = String(payload.capability ?? "") as CatfoodCapability;
    if (!requestId || !CATFOOD_CAPABILITIES.includes(capability)) continue;
    const operation = String(payload.operation ?? (eventType.includes("RENEWAL") ? "renew" : eventType.includes("REVOKE") ? "revoke" : "grant")) as AuthorityMutationOperation;
    if (!["grant", "renew", "revoke"].includes(operation)) continue;
    const isRemoteFact = ["THREADS_AUTHORITY_REMOTE_FACT", "THREADS_AUTHORITY_REVOKE_REMOTE_FACT"].includes(eventType);
    const expectedKnown = !isRemoteFact && (Object.prototype.hasOwnProperty.call(payload, "expected_generation") || Object.prototype.hasOwnProperty.call(payload, "threads_generation") || event.threads_generation !== null && event.threads_generation !== undefined);
    const expectedRaw = isRemoteFact ? null : payload.expected_generation ?? payload.threads_generation ?? event.threads_generation;
    const expected = expectedRaw === null || expectedRaw === undefined ? null : Number(expectedRaw);
    const payloadSha = typeof payload.payload_sha256 === "string" ? payload.payload_sha256 : null;
    const requestedRef = typeof payload.authority_ref === "string" && !isRemoteFact ? payload.authority_ref : null;
    const current = rows.get(requestId) ?? {
      request_id: requestId, operation, capability, original_epoch: Number(event.wp3_epoch), source_provenance: String(event.source_provenance),
      account_id: String(event.account_id), tenant_id: String(event.tenant_id), payload_sha256: payloadSha,
      expected_generation: expected, expected_generation_known: expectedKnown, requested_authority_ref: requestedRef, returned_authority_ref: null, returned_generation: null,
      released: false, identity_conflict: false, ambiguous: false, succeeded: false, rejected: false, not_dispatched: false,
    };
    if (current.operation !== operation || current.capability !== capability || current.original_epoch !== Number(event.wp3_epoch)
      || current.source_provenance !== String(event.source_provenance) || current.account_id !== String(event.account_id) || current.tenant_id !== String(event.tenant_id)
      || expectedKnown && current.expected_generation_known && expected !== current.expected_generation
      || payloadSha !== null && current.payload_sha256 !== null && payloadSha !== current.payload_sha256
      || requestedRef !== null && current.requested_authority_ref !== null && requestedRef !== current.requested_authority_ref) current.identity_conflict = true;
    if (!current.expected_generation_known && expectedKnown) { current.expected_generation = expected; current.expected_generation_known = true; }
    if (current.payload_sha256 === null && payloadSha !== null) current.payload_sha256 = payloadSha;
    if (current.requested_authority_ref === null && requestedRef !== null) current.requested_authority_ref = requestedRef;
    if (eventType === "THREADS_AUTHORITY_DISPATCH_RELEASED") current.released = true;
    if (["THREADS_AUTHORITY_POSSIBLY_APPLIED", "THREADS_AUTHORITY_RENEWAL_AMBIGUOUS"].includes(eventType)) current.ambiguous = true;
    if (["THREADS_AUTHORITY_REMOTE_FACT", "THREADS_AUTHORITY_REVOKE_REMOTE_FACT"].includes(eventType)) {
      current.succeeded = true; current.returned_authority_ref = typeof payload.authority_ref === "string" ? payload.authority_ref : null;
      current.returned_generation = Number.isSafeInteger(Number(payload.generation ?? event.threads_generation)) ? Number(payload.generation ?? event.threads_generation) : null;
    }
    if (eventType === "THREADS_AUTHORITY_REMOTE_REJECTED") current.rejected = true;
    if (eventType === "THREADS_AUTHORITY_NOT_DISPATCHED") current.not_dispatched = true;
    rows.set(requestId, current);
  }
  return Object.freeze([...rows.values()].map((row) => {
    const conflict = row.identity_conflict || row.not_dispatched && row.released || row.rejected && row.succeeded;
    const outcome: AuthorityMutationOutcome = conflict ? "RELEASED_UNRESOLVED" : row.succeeded ? "REMOTE_SUCCEEDED" : row.rejected ? "REMOTE_REJECTED" : row.not_dispatched && !row.released ? "NOT_DISPATCHED" : row.ambiguous ? "REMOTE_AMBIGUOUS" : "RELEASED_UNRESOLVED";
    const { ambiguous: _ambiguous, succeeded: _succeeded, rejected: _rejected, not_dispatched: _notDispatched, ...value } = row;
    return Object.freeze({ ...value, outcome });
  }));
}

function verdictFromReasons(reasons: ReadonlySet<string>): Verdict {
  if (reasons.size === 0) return "PASS";
  const knownFailure = [...reasons].some((reason) => /TAMPER|CORRUPT|CHAIN|VIOLATION|NONZERO|FINAL_AUTHORITY_OPEN|BUNDLE_CACHE|RUN_ABORTED|COE_RUN_LINKED_WORK_FAILED|COE_UNTRACKED_RUN_WORK|DURATION_(?:POLICY_NOT_MET|CLOCK_INCONSISTENT)|WORK_COMPLETED_OUTSIDE_WINDOW|MEANINGFUL_.*_NOT_MET|RESTART_.*_NOT_MET/.test(reason));
  return knownFailure ? "FAIL" : "BLOCKED";
}

function observationCoverageReasons(journal: readonly Record<string, unknown>[], run: Record<string, unknown>, spec: Record<string, unknown>): readonly string[] {
  const armed = journal.find((event) => event.event_type === "OBSERVATION_ARMED");
  if (!armed) return ["OBSERVATION_PREFIX_MISSING"];
  const payload = typeof armed.payload_json === "string" ? JSON.parse(armed.payload_json) as Record<string, unknown> : armed.payload_json as Record<string, unknown>;
  if (String(armed.boot_id) !== String(run.closed_boot_id) || !Number.isSafeInteger(armed.monotonic_ms) || !Number.isSafeInteger(run.closed_monotonic_ms)) return ["DURATION_TRUST_UNAVAILABLE"];
  if (Date.parse(String(armed.observed_at)) > Date.parse(String(spec.requested_window_start)) || Date.parse(String(run.closed_wall_time)) < Date.parse(String(spec.requested_window_end)) || Number(run.closed_monotonic_ms) <= Number(armed.monotonic_ms)) return ["DURATION_POLICY_NOT_MET"];
  if (!payload.policy || typeof payload.policy !== "object") return ["POLICY_UNBOUND"];
  const policy = payload.policy as Record<string, unknown>;
  const wallElapsed = Date.parse(String(run.closed_wall_time)) - Date.parse(String(armed.observed_at));
  const monotonicElapsed = Number(run.closed_monotonic_ms) - Number(armed.monotonic_ms);
  if (policy.clock_mapping === "SAME_TEST_CLOCK" && (wallElapsed !== monotonicElapsed || wallElapsed < CATFOOD_FIXED_POLICY.continuous_duration_seconds * 1_000)) return ["DURATION_CLOCK_INCONSISTENT"];
  return [];
}

export class ProtectedCatfoodCustodian {
  private readonly control: Database;
  private readonly checkpoints: Database;
  readonly trust: Readonly<CatfoodTrustConfig>;

  constructor(
    controlPath: string,
    checkpointPath: string,
    private readonly source: ThreadsEvidenceSource,
    private readonly clock: TrustedClock,
    private readonly enrollment?: CatfoodEnrollmentContext,
  ) {
    if (resolve(controlPath) === resolve(checkpointPath)) throw new CatfoodTrustError("CHECKPOINT_MUST_BE_EXTERNAL");
    this.control = new Database(resolve(controlPath), { strict: true, create: false });
    this.checkpoints = new Database(resolve(checkpointPath), { strict: true, create: false });
    try {
      configure(this.control); configure(this.checkpoints);
      assertConnection(this.control); checkpointHealth(this.checkpoints);
      this.trust = loadTrust(this.control);
      if (this.trust.source_mode === "OPERATIONAL") { try { assertEnrolledRole(enrollment, "custodian", "OPERATIONAL"); } catch { throw new CatfoodTrustError("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE"); } } else if (enrollment) assertEnrolledRole(enrollment, "custodian", "TEST_ONLY");
      if (source.mode !== this.trust.source_mode || source.source_identity !== `${this.trust.threads_sha}:${this.trust.threads_release_sha256}`) throw new CatfoodTrustError("THREADS_SOURCE_IDENTITY_MISMATCH");
      if (this.trust.source_mode === "OPERATIONAL") {
        if (clock.kind !== "SYSTEM") throw new CatfoodTrustError("TEST_CLOCK_NOT_OPERATIONAL");
        verifyOperationalProvenance(source.operational_provenance); verifyOperationalProvenance(clock.operational_provenance);
        if (canonicalJson(source.operational_provenance) !== canonicalJson(clock.operational_provenance)) throw new CatfoodTrustError("OPERATIONAL_COMPOSITION_MISMATCH");
      }
    } catch (error) { this.control.close(); this.checkpoints.close(); throw error; }
  }

  close(): void { this.control.close(); this.checkpoints.close(); }

  private liveEnrollment(action: string, target: string, purpose: CatfoodActionPurpose = "POSITIVE_EXECUTION"): void { if (this.enrollment) inspectEnrolledRole(this.enrollment, "custodian", action, target, purpose); else if (this.trust.source_mode === "OPERATIONAL") throw new CatfoodTrustError("ENROLLMENT_STATUS_INVALID"); }
  private authorizeSource(action: string, target: string, purpose: CatfoodActionPurpose): CatfoodActionAuthorization | undefined { return this.enrollment ? authorizeEnrolledAction(this.enrollment, "custodian", purpose, action, target) : this.trust.source_mode === "OPERATIONAL" ? (() => { throw new CatfoodTrustError("ENROLLMENT_STATUS_INVALID"); })() : undefined; }

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
    const pins = { policy_sha256: CATFOOD_POLICY_SHA256, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, dependency_root: CATFOOD_THREADS_DEPENDENCY_ROOT, threads_sha: this.trust.threads_sha, boundary_sha256: this.trust.operational_boundary_sha256, release_sha256: this.trust.threads_release_sha256, wp1_sha256: this.trust.wp1_sha256, coe_sha256: this.trust.coe_sha256, rehearsal_attestation_sha256: this.trust.rehearsal_attestation_sha256, emitter_inventory_sha256: this.trust.emitter_inventory_sha256, schema: this.trust.threads_schema, schema_fingerprint: this.trust.threads_schema_fingerprint, ikorabu_release_sha: this.trust.ikorabu_release_sha };
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
    const pins = { policy_sha256: CATFOOD_POLICY_SHA256, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, dependency_root: CATFOOD_THREADS_DEPENDENCY_ROOT, threads_sha: this.trust.threads_sha, boundary_sha256: this.trust.operational_boundary_sha256, release_sha256: this.trust.threads_release_sha256, wp1_sha256: this.trust.wp1_sha256, coe_sha256: this.trust.coe_sha256, rehearsal_attestation_sha256: this.trust.rehearsal_attestation_sha256, emitter_inventory_sha256: this.trust.emitter_inventory_sha256, schema: this.trust.threads_schema, schema_fingerprint: this.trust.threads_schema_fingerprint, ikorabu_release_sha: this.trust.ikorabu_release_sha };
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
      this.requirePositiveRun(row);
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

  renewOwnerSession(session: RunnerSession): void {
    this.verifyAnchored(session.run_id); const sample = this.sample();
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); const go = this.verifyCurrentGo(row, sample); const spec = runSpec(row);
      this.requireLiveOwnerMaintenance(row, sample);
      const expires = Math.min(Date.parse(sample.wall_time) + 120_000, Date.parse(spec.requested_window_end), Date.parse(go.payload.valid_until));
      if (expires <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("LEASE_WINDOW_CLOSED");
      const renewed = this.control.query("UPDATE catfood_runs SET lease_expires_at=?,state_version=state_version+1 WHERE run_id=? AND owner_session_id=? AND current_epoch=? AND lease_expires_at=? AND lease_expires_at>? AND ((lifecycle='READY' AND admission_state='CLOSED') OR (lifecycle='RUNNING' AND admission_state='OPEN'))")
        .run(new Date(expires).toISOString(), row.run_id, session.session_id, row.current_epoch, row.lease_expires_at, sample.wall_time);
      if (renewed.changes !== 1) throw new CatfoodTrustError("OWNER_LEASE_RENEWAL_FENCED");
      this.appendJournal(this.getRun(row.run_id), "OWNER_LEASE_RENEWED", session.session_id, "custodian", { lease_expires_at: new Date(expires).toISOString() }, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head);
  }

  renewAuthorities(session: RunnerSession): void {
    for (const capability of CATFOOD_CAPABILITIES) {
      this.liveEnrollment("custodian.authority.renew.dispatch", session.run_id);
      this.verifyAnchored(session.run_id); const sample = this.sample(); let request!: { spec: CatfoodRunSpec; ref: string; generation: number; expires: string; request_id: string };
      this.control.transaction(() => {
        const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); const go = this.verifyCurrentGo(row, sample); const spec = runSpec(row);
        this.requireLiveOwnerMaintenance(row, sample);
        if (row.lifecycle !== "RUNNING" || row.admission_state !== "OPEN") throw new CatfoodTrustError("ADMISSION_CLOSED");
        requireZeroPaidRuntime(this.source.runtimeEvidence(spec));
        const binding = this.control.query<Record<string, unknown>, [string, number, string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? AND wp3_epoch=? AND capability=?").get(row.run_id, row.current_epoch, capability);
        if (!binding || binding.state !== "ACTIVE") throw new CatfoodTrustError("AUTHORITY_BINDING_MISSING");
        const expires = new Date(Math.min(Date.parse(sample.wall_time) + 120_000, Date.parse(spec.requested_window_end), Date.parse(go.payload.valid_until))).toISOString();
        if (Date.parse(expires) <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("AUTHORITY_PERMIT_WINDOW_CLOSED");
        const requestPayload = { action: "renew", account_id: spec.account_id, capability, authority_ref: binding.authority_ref, spec_hash: spec.spec_sha256, expected_generation: binding.threads_generation, permit_expires_at: expires };
        const request_id = `renew:${sha256(canonicalJson({ run_id: row.run_id, epoch: row.current_epoch, payload: requestPayload })).slice(0, 32)}`;
        request = { spec, ref: String(binding.authority_ref), generation: Number(binding.threads_generation), expires, request_id };
        this.appendJournal(row, "THREADS_AUTHORITY_RENEWAL_INTENT", session.session_id, this.source.source_identity, { operation: "renew", capability, authority_ref: request.ref, expected_generation: request.generation, permit_expires_at: expires, request_id, payload_sha256: sha256(canonicalJson(requestPayload)), wp3_epoch: row.current_epoch }, request.generation, null, request_id, sample);
      }).immediate();
      let head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "RENEWAL_INTENT_RETAINED", request_id: request.request_id });
      let transition: ThreadsAuthorityTransition;
      const renewalPayloadSha = sha256(canonicalJson({ action: "renew", account_id: request.spec.account_id, capability, authority_ref: request.ref, spec_hash: request.spec.spec_sha256, expected_generation: request.generation, permit_expires_at: request.expires }));
      this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_DISPATCH_RELEASED", session.session_id, this.source.source_identity, { request_id: request.request_id, operation: "renew", capability, authority_ref: request.ref, expected_generation: request.generation, payload_sha256: renewalPayloadSha }, request.generation, null, request.request_id, sample)).immediate();
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "RENEWAL_DISPATCH_RELEASED", request_id: request.request_id });
      try { transition = this.source.renew(request.spec, capability, request.ref, request.generation, request.expires); }
      catch (error) {
        this.control.transaction(() => { const row = this.getRun(session.run_id); this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='STOP_PENDING',state_version=state_version+1 WHERE run_id=?").run(row.run_id); this.appendJournal(this.getRun(row.run_id), "THREADS_AUTHORITY_POSSIBLY_APPLIED", session.session_id, this.source.source_identity, { operation: "renew", capability, request_id: request.request_id, authority_ref: request.ref, expected_generation: request.generation, payload_sha256: renewalPayloadSha }, request.generation, null, request.request_id, sample); }).immediate();
        head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "RENEWAL_AMBIGUOUS", request_id: request.request_id }); throw error;
      }
      this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_REMOTE_FACT", session.session_id, this.source.source_identity, { request_id: request.request_id, operation: "renew", capability, authority_ref: transition.authority_ref, generation: transition.generation, boundary: transition.boundary as unknown as Json, payload_sha256: renewalPayloadSha }, transition.generation, null, request.request_id, sample)).immediate();
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "RENEWAL_REMOTE_FACT_RETAINED", request_id: request.request_id });
      try { this.liveEnrollment("custodian.authority.renew.apply", session.run_id);
      this.control.transaction(() => {
        const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); this.verifyCurrentGo(row, sample);
        if (row.lifecycle !== "RUNNING" || row.admission_state !== "OPEN" || transition.authority_ref !== request.ref || transition.generation !== request.generation) throw new CatfoodTrustError("AUTHORITY_RENEWAL_RACE");
        const boundary = verifyBoundary(transition.boundary, request.spec, "ADMIT", sample.wall_time, { capability, generation: request.generation });
        if (!boundary.permit_expires_at || Date.parse(boundary.permit_expires_at) > Date.parse(request.expires) || Date.parse(boundary.permit_expires_at) - Date.parse(sample.wall_time) > 120_000) throw new CatfoodTrustError("AUTHORITY_PERMIT_BOUND_INVALID");
        this.control.query("INSERT INTO catfood_authority_renewals VALUES (?,?,?,?,?,?,?,?,?)")
          .run(request.request_id, row.run_id, row.current_epoch, capability, request.ref, request.generation, boundary.canonical_sha256, boundary.permit_expires_at, sample.wall_time);
        this.appendJournal(row, "THREADS_AUTHORITY_RENEWED", session.session_id, this.source.source_identity, { capability, authority_ref: request.ref, boundary: boundary as unknown as Json, request_id: request.request_id }, request.generation, null, request.request_id, sample);
      }).immediate();
      } catch (error) {
        const code = error instanceof CatfoodTrustError ? error.code : "POSITIVE_APPLY_REJECTED";
        this.control.transaction(() => { const row = this.getRun(session.run_id); this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='STOP_PENDING',state_version=state_version+1 WHERE run_id=?").run(row.run_id); this.appendJournal(this.getRun(row.run_id), "THREADS_AUTHORITY_POSITIVE_APPLY_REJECTED", session.session_id, this.source.source_identity, { request_id: request.request_id, operation: "renew", capability, reason_code: code }, transition.generation, null, request.request_id, sample); }).immediate();
        head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "REMOTE_FACT_WITHOUT_LOCAL_PERMISSION", request_id: request.request_id }); throw error;
      }
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head);
    }
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

  private terminalCause(runId: string): string | null {
    return this.control.query<{ event_type: string }, [string]>("SELECT event_type FROM catfood_source_journal WHERE run_id=? AND event_type IN ('ABORT_REQUESTED','PAID_PROVIDER_ABORT','GO_REVOKED','RUN_CLOSED') ORDER BY sequence LIMIT 1").get(runId)?.event_type ?? null;
  }

  private requirePositiveRun(row: RunRow): void {
    const cause = this.terminalCause(row.run_id);
    if (cause) throw new CatfoodTrustError(cause === "RUN_CLOSED" ? "RUN_CLOSED" : "RUN_FINALIZED");
  }

  private requireLiveOwnerMaintenance(row: RunRow, sample: TrustedClockSample): void {
    if (!row.lease_expires_at || Date.parse(sample.wall_time) >= Date.parse(row.lease_expires_at)) throw new CatfoodTrustError("LEASE_EXPIRED");
    if (row.lifecycle !== "READY" && row.lifecycle !== "RUNNING") throw new CatfoodTrustError("OWNER_MAINTENANCE_NOT_ALLOWED");
  }

  private sourceSnapshot(spec: CatfoodRunSpec, now = this.sample().wall_time): { runtime: ThreadsRuntimeEvidence; boundaries: readonly OperationalBoundaryV1[]; inventory: readonly ThreadsInventoryItem[]; coe: CoeAcquisition; stableCoe: Record<string, Json>; coeAssessment: CoeAssessment; digest: string } {
    const coe = acquireCoe(this.source, liveScope(spec, now), "LIVE_ADMISSION");
    const runtime = this.source.runtimeEvidence(spec);
    const boundaries = this.source.boundaries(spec).map((boundary) => verifyBoundary(boundary, spec, "PREPARE", now));
    const inventory = this.source.inventory(spec);
    const coeAssessment = assessCoe(coe, now);
    const stableCoe = stableCoeEvidence(coe);
    return { runtime, boundaries, inventory, coe, stableCoe, coeAssessment, digest: sha256(canonicalCoeJson({ runtime, boundaries, inventory, coe: stableCoe })) };
  }

  armObservation(session: RunnerSession, policy?: TestObservationPolicy): void {
    this.verifyAnchored(session.run_id); const sample = this.sample();
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); this.verifyCurrentGo(row, sample); const spec = runSpec(row);
      if (this.trust.source_mode !== "TEST_ONLY" || !policy) throw new CatfoodTrustError("POLICY_UNBOUND");
      if (policy.kind !== "TEST_ONLY_EXPLICIT" || policy.clock_mapping !== "SAME_TEST_CLOCK" || !Number.isSafeInteger(policy.cadence_seconds) || !Number.isSafeInteger(policy.maximum_gap_seconds) || policy.cadence_seconds <= 0 || policy.maximum_gap_seconds < policy.cadence_seconds) throw new CatfoodTrustError("OBSERVATION_POLICY_INVALID");
      const boundaries = this.source.boundaries(spec).map((boundary) => verifyBoundary(boundary, spec, "PREPARE", sample.wall_time));
      this.appendJournal(row, "OBSERVATION_ARMED", session.session_id, this.source.source_identity, { requested_window_start: spec.requested_window_start, requested_window_end: spec.requested_window_end, policy, baseline_sha256: sha256(canonicalJson({ boot_id: sample.boot_id, monotonic_ms: sample.monotonic_ms, boundaries })) }, null, null, null, sample);
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "ARMED", policy: "TEST_ONLY_EXPLICIT" });
  }

  preflight(session: RunnerSession): PreflightReceipt {
    this.liveEnrollment("custodian.preflight", session.run_id);
    this.verifyAnchored(session.run_id);
    const sample = this.sample();
    const preparing = this.getRun(session.run_id); this.authenticate(session, preparing); this.requirePositiveRun(preparing); const preparingSpec = runSpec(preparing); this.source.prepareEnrollmentUse?.("source.acquire", `${preparingSpec.account_id}:LIVE`);
    const preparedSnapshot = this.sourceSnapshot(preparingSpec, sample.wall_time); const preparedProbe = this.source.tenantProbe(preparingSpec);
    let output!: PreflightReceipt; let blocked: string | null = null;
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); this.verifyCurrentGo(row, sample);
      if (!row.lease_expires_at || Date.parse(row.lease_expires_at) <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("LEASE_EXPIRED");
      if (row.lifecycle === "ABORTED" || row.lifecycle === "PAUSED" || row.lifecycle === "CLOSED") throw new CatfoodTrustError("LIFECYCLE_NOT_ADMISSIBLE");
      const spec = runSpec(row); if (canonicalJson(spec) !== canonicalJson(preparingSpec)) throw new CatfoodTrustError("PREFLIGHT_STALE"); const snapshot = preparedSnapshot;
      if (snapshot.coeAssessment.state !== "READY") throw new CatfoodTrustError(snapshot.coeAssessment.reasons[0] ?? "COE_EVIDENCE_UNAVAILABLE", snapshot.coeAssessment.reasons.join(","));
      const runtime = snapshot.runtime; const probe = preparedProbe; const coeRuntime = snapshot.coe.runtime_enforcement;
      requireZeroPaidRuntime(runtime);
      if (probe.organization_id !== spec.organization_id || probe.own_account_id !== spec.account_id || probe.foreign_account_id === spec.account_id || probe.own_result !== "EXPECTED_RESOURCE" || probe.foreign_result !== "AUTHORIZATION_DENIED" || probe.foreign_status !== 403 || probe.logical_runtime_id !== coeRuntime.logical_runtime_id || probe.worker_boot_id !== coeRuntime.worker_boot_id || Date.parse(sample.wall_time) - Date.parse(probe.observed_at) > 120_000 || Date.parse(probe.observed_at) > Date.parse(sample.wall_time) + 5_000) throw new CatfoodTrustError("ACTIVE_NEGATIVE_TENANT_PROBE_REQUIRED");
      if (snapshot.boundaries.length !== CATFOOD_CAPABILITIES.length) throw new CatfoodTrustError("BOUNDARY_COVERAGE_INCOMPLETE");
      for (const boundary of snapshot.boundaries) {
        if (boundary.account_id !== spec.account_id || boundary.execution_state === "UNKNOWN" || ["FAILED", "UNKNOWN"].includes(String(boundary.stop_acknowledgement))) throw new CatfoodTrustError("BOUNDARY_UNSAFE");
      }
      this.appendJournal(row, "TENANT_PROBE_OBSERVED", session.session_id, this.source.source_identity, probe as unknown as Json, null, null, null, sample);
      const stopped = snapshot.boundaries.filter((boundary) => {
        const controls = boundary.effective_safety_controls as Record<string, unknown>;
        const reasons = Array.isArray(controls.reasons) ? controls.reasons.map(String) : [];
        const ordinaryFence = reasons.every((reason) => ["catfood_authority_missing", "catfood_authority_revoked"].includes(reason));
        return controls.global_stop === true || controls.account_stop === true || controls.capability_stop === true && !ordinaryFence;
      });
      if (stopped.length) {
        this.appendJournal(row, "PREPARATION_OBSERVED", session.session_id, this.source.source_identity, { source_digest: snapshot.digest, coe_state: snapshot.coeAssessment.state, probe_receipt_id: probe.receipt_id, boundary_capabilities: stopped.map((boundary) => boundary.capability) }, null, null, null, sample);
        this.appendJournal(row, "ADMISSION_BLOCKED", session.session_id, this.source.source_identity, { reason: "BOUNDARY_STOP_ACTIVE", observation_permitted: true }, null, null, null, sample);
        blocked = "BOUNDARY_STOP_ACTIVE"; return;
      }
      const unique = new Map(snapshot.inventory.map((item) => [`${item.capability}:${item.business_identity}:${item.material_revision}`, item]));
      if (unique.size < CATFOOD_FIXED_POLICY.minimum_meaningful_units || new Set([...unique.values()].map((item) => item.capability)).size < CATFOOD_FIXED_POLICY.minimum_capability_classes) throw new CatfoodTrustError("MEANINGFUL_INVENTORY_INSUFFICIENT");
      const generationDigest = sha256(canonicalJson(snapshot.boundaries.map((boundary) => [boundary.capability, boundary.fencing_generation])));
      const nonce = randomBytes(24).toString("base64url"); const receiptId = `pre:${sha256(`${session.run_id}:${nonce}`).slice(0, 32)}`;
      const expires = new Date(Date.parse(sample.wall_time) + 30_000).toISOString();
      this.control.query("INSERT INTO catfood_preflight_receipts VALUES (?,?,?,?,?,?,?,?,?,NULL)").run(receiptId, row.run_id, session.session_id, row.current_epoch, generationDigest, row.state_version, snapshot.digest, nonce, expires);
      this.appendJournal(row, "PREFLIGHT_PASSED", session.session_id, this.source.source_identity, { receipt_id: receiptId, source_digest: snapshot.digest, state_version: row.state_version, coe: { contract_digest: spec.coe_sha256, release: { threads_sha: spec.threads_sha, release_sha256: spec.threads_release_sha256, schema: spec.threads_schema, schema_fingerprint: spec.threads_schema_fingerprint }, snapshot_identity: snapshot.coe.coverage.snapshot_identity, cuts: snapshot.coe.coverage.cuts, record_set_digest: snapshot.coe.coverage.record_set_digest, requested_window_start: spec.requested_window_start, requested_window_end: spec.requested_window_end, assessment_mode: "LIVE", coverage: snapshot.coe.coverage.state, current_applicability: snapshot.coeAssessment.state === "READY", activity: snapshot.coe.prohibited_activity.activity, exposure: snapshot.coe.prohibited_activity.exposure, test_only: snapshot.coe.test_only, proof_id: (snapshot.coe.coverage.prospective as Record<string, Json>).proof_id, checkpoint: snapshot.coe.operational_observation.checkpoint, runtime: snapshot.coe.runtime_enforcement } }, null, null, null, sample);
      output = Object.freeze({ receipt_id: receiptId, nonce, expires_at: expires, source_digest: snapshot.digest, state_version: Number(row.state_version), epoch: Number(row.current_epoch) });
    }).immediate();
    const head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "COMPLETE", preflight: blocked ? "BLOCKED" : "PASSED" });
    if (blocked) throw new CatfoodTrustError(blocked);
    return output;
  }

  activate(session: RunnerSession, receipt: PreflightReceipt): void {
    this.liveEnrollment("custodian.activate", session.run_id);
    this.verifyAnchored(session.run_id); const sample = this.sample();
    const initial = this.getRun(session.run_id); this.authenticate(session, initial); this.requirePositiveRun(initial); const go = this.verifyCurrentGo(initial, sample);
    const initialReceipt = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_preflight_receipts WHERE receipt_id=?").get(receipt.receipt_id);
    if (!initialReceipt || initialReceipt.run_id !== initial.run_id || initialReceipt.session_id !== session.session_id || initialReceipt.consumed_at !== null || initialReceipt.nonce !== receipt.nonce || Number(initialReceipt.wp3_epoch) !== Number(initial.current_epoch) || Number(initialReceipt.state_version) !== Number(initial.state_version) || Date.parse(String(initialReceipt.expires_at)) <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("PREFLIGHT_RECEIPT_INVALID");
    const spec = runSpec(initial); this.source.prepareEnrollmentUse?.("source.acquire", `${spec.account_id}:LIVE`); const snapshot = this.sourceSnapshot(spec);
    if (snapshot.coeAssessment.state !== "READY" || snapshot.digest !== initialReceipt.source_digest) throw new CatfoodTrustError("PREFLIGHT_STALE"); requireZeroPaidRuntime(snapshot.runtime);
    const permitExpiresAt = new Date(Math.min(Date.parse(sample.wall_time) + 120_000, Date.parse(spec.requested_window_end), Date.parse(go.payload.valid_until))).toISOString();
    if (Date.parse(permitExpiresAt) <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("AUTHORITY_PERMIT_WINDOW_CLOSED");
    const intents = CATFOOD_CAPABILITIES.map((capability) => {
      const current = snapshot.boundaries.find((boundary) => boundary.capability === capability), expected = current?.fencing_generation ?? null; const authorityRef = `${initial.run_id}:wp3:${initial.current_epoch}:${capability}`;
      const payload = { action: "grant", account_id: spec.account_id, capability, authority_ref: authorityRef, spec_hash: spec.spec_sha256, expected_generation: expected, permit_expires_at: permitExpiresAt };
      return { capability, expected, authorityRef, requestId: `grant:${sha256(canonicalJson({ run_id: initial.run_id, epoch: initial.current_epoch, payload })).slice(0, 32)}`, payload, payloadDigest: sha256(canonicalJson(payload)) };
    });
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); this.verifyCurrentGo(row, sample);
      if (row.state_version !== initial.state_version || row.current_epoch !== initial.current_epoch) throw new CatfoodTrustError("PREFLIGHT_STALE");
      for (const intent of intents) this.appendJournal(row, "THREADS_AUTHORITY_GRANT_INTENT", session.session_id, this.source.source_identity, { request_id: intent.requestId, operation: "grant", capability: intent.capability, authority_ref: intent.authorityRef, expected_generation: intent.expected, permit_expires_at: permitExpiresAt, payload_sha256: intent.payloadDigest, owner_session_id: session.session_id, wp3_epoch: row.current_epoch, accepted_source_digest: snapshot.digest }, intent.expected, null, intent.requestId, sample);
    }).immediate();
    let head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "GRANT_INTENTS_RETAINED", requests: intents.map((intent) => intent.requestId) });
    const transitions: Array<{ capability: CatfoodCapability; transition: ThreadsAuthorityTransition; requestId: string }> = []; let dispatchInvalid = false;
    for (const intent of intents) {
      if (!dispatchInvalid) try { const live = this.getRun(session.run_id); this.authenticate(session, live); this.requirePositiveRun(live); if (live.current_epoch !== initial.current_epoch || live.state_version !== initial.state_version) throw new CatfoodTrustError("PREFLIGHT_STALE"); } catch { dispatchInvalid = true; }
      if (dispatchInvalid) {
        this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_NOT_DISPATCHED", session.session_id, this.source.source_identity, { request_id: intent.requestId, operation: "grant", capability: intent.capability, authority_ref: intent.authorityRef, expected_generation: intent.expected, payload_sha256: intent.payloadDigest, wp3_epoch: initial.current_epoch, reason: "SIBLING_INVALIDATED" }, intent.expected, null, intent.requestId, sample)).immediate();
        head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "NOT_DISPATCHED", request_id: intent.requestId });
        continue;
      }
      try {
        this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_DISPATCH_RELEASED", session.session_id, this.source.source_identity, { request_id: intent.requestId, operation: "grant", capability: intent.capability, authority_ref: intent.authorityRef, expected_generation: intent.expected, payload_sha256: intent.payloadDigest, wp3_epoch: initial.current_epoch }, intent.expected, null, intent.requestId, sample)).immediate();
        head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "GRANT_DISPATCH_RELEASED", request_id: intent.requestId });
        const transition = this.source.grant(spec, intent.capability, intent.authorityRef, intent.expected, permitExpiresAt); transitions.push({ capability: intent.capability, transition, requestId: intent.requestId });
        this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_REMOTE_FACT", session.session_id, this.source.source_identity, { request_id: intent.requestId, operation: "grant", capability: intent.capability, requested_authority_ref: intent.authorityRef, authority_ref: transition.authority_ref, expected_generation: intent.expected, generation: transition.generation, boundary: transition.boundary as unknown as Json, payload_sha256: intent.payloadDigest, wp3_epoch: initial.current_epoch }, transition.generation, null, intent.requestId, sample)).immediate();
      } catch (error) {
        dispatchInvalid = true; const code = error instanceof CatfoodTrustError ? error.code : "MUTATION_OUTCOME_AMBIGUOUS"; const definitive = /^THREADS_HTTP_4\d\d_/.test(code) && !code.includes("AMBIGUOUS");
        this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), definitive ? "THREADS_AUTHORITY_REMOTE_REJECTED" : "THREADS_AUTHORITY_POSSIBLY_APPLIED", session.session_id, this.source.source_identity, { request_id: intent.requestId, operation: "grant", capability: intent.capability, authority_ref: intent.authorityRef, expected_generation: intent.expected, payload_sha256: intent.payloadDigest, wp3_epoch: initial.current_epoch, reason_code: code }, intent.expected, null, intent.requestId, sample)).immediate();
      }
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: dispatchInvalid ? "GRANT_DISPATCH_UNRESOLVED" : "GRANT_REMOTE_FACT_RETAINED", request_id: intent.requestId });
    }
    if (dispatchInvalid || transitions.length !== CATFOOD_CAPABILITIES.length) {
      this.control.transaction(() => { const row = this.getRun(session.run_id); this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='STOP_PENDING',state_version=state_version+1 WHERE run_id=?").run(row.run_id); }).immediate();
      throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS");
    }
    try { this.liveEnrollment("custodian.activate.apply", session.run_id);
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); this.verifyCurrentGo(row, sample);
      const stored = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_preflight_receipts WHERE receipt_id=?").get(receipt.receipt_id);
      if (!stored || stored.run_id !== row.run_id || stored.session_id !== session.session_id || stored.consumed_at !== null || stored.nonce !== receipt.nonce || Number(stored.wp3_epoch) !== Number(row.current_epoch) || Number(stored.state_version) !== Number(row.state_version) || Date.parse(String(stored.expires_at)) <= Date.parse(sample.wall_time)) throw new CatfoodTrustError("PREFLIGHT_RECEIPT_INVALID");
      if (row.state_version !== initial.state_version || row.current_epoch !== initial.current_epoch || canonicalJson(runSpec(row)) !== canonicalJson(spec)) throw new CatfoodTrustError("PREFLIGHT_STALE");
      for (const { capability, transition, requestId } of transitions) {
        const boundary = verifyBoundary(transition.boundary, spec, "ADMIT", sample.wall_time, { capability, generation: transition.generation });
        if (!boundary.permit_expires_at || Date.parse(boundary.permit_expires_at) > Date.parse(permitExpiresAt) || Date.parse(boundary.permit_expires_at) - Date.parse(sample.wall_time) > 120_000) throw new CatfoodTrustError("AUTHORITY_PERMIT_BOUND_INVALID");
        this.control.query("INSERT INTO catfood_authority_bindings VALUES (?,?,?,?,?,?,?,?,?)").run(row.run_id, row.current_epoch, capability, transition.authority_ref, transition.generation, boundary.canonical_sha256, boundary.permit_expires_at, "ACTIVE", sample.wall_time);
        this.appendJournal(row, "THREADS_AUTHORITY_GRANTED", session.session_id, this.source.source_identity, { capability, authority_ref: transition.authority_ref, boundary: boundary as unknown as Json, dispatch_request_id: requestId }, transition.generation, null, requestId, sample);
      }
      this.control.query("UPDATE catfood_preflight_receipts SET consumed_at=? WHERE receipt_id=? AND consumed_at IS NULL").run(sample.wall_time, receipt.receipt_id);
      this.control.query("UPDATE catfood_runs SET lifecycle='RUNNING',admission_state='OPEN',state_version=state_version+1,start_wall_time=COALESCE(start_wall_time,?),start_monotonic_ms=COALESCE(start_monotonic_ms,?),start_boot_id=COALESCE(start_boot_id,?) WHERE run_id=?")
        .run(sample.wall_time, sample.monotonic_ms, sample.boot_id, row.run_id);
      this.appendJournal(this.getRun(row.run_id), "RUN_STARTED", session.session_id, "custodian", { receipt_id: receipt.receipt_id }, null, null, null, sample);
    }).immediate();
    } catch (error) {
      const code = error instanceof CatfoodTrustError ? error.code : "POSITIVE_APPLY_REJECTED";
      this.control.transaction(() => { const row = this.getRun(session.run_id); this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='STOP_PENDING',state_version=state_version+1 WHERE run_id=?").run(row.run_id); this.appendJournal(this.getRun(row.run_id), "THREADS_AUTHORITY_POSITIVE_APPLY_REJECTED", session.session_id, this.source.source_identity, { reason_code: code, remote_fact_request_ids: transitions.map((item) => item.requestId) }, null, null, null, sample); }).immediate();
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "REMOTE_FACTS_WITHOUT_LOCAL_PERMISSION" }); throw error;
    }
    head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head);
  }

  admit(session: RunnerSession, capability: CatfoodCapability, sourceId: string): AdmissionTicket {
    this.liveEnrollment("custodian.admit.dispatch", session.run_id);
    this.verifyAnchored(session.run_id); const sample = this.sample(); let ticket!: AdmissionTicket; let reserved!: { item: ThreadsInventoryItem; requestId: string; workId: string; semantic: string; authorityRef: string; generation: number };
    const planningRow = this.getRun(session.run_id); this.authenticate(session, planningRow); const planningSpec = runSpec(planningRow); const planningRuntime = this.source.runtimeEvidence(planningSpec); const planningInventory = this.source.inventory(planningSpec); const planningBoundaries = this.source.boundaries(planningSpec);
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); const go = this.verifyCurrentGo(row, sample);
      if (!row.lease_expires_at || Date.parse(row.lease_expires_at) <= Date.parse(sample.wall_time) || row.lifecycle !== "RUNNING" || row.admission_state !== "OPEN") throw new CatfoodTrustError("ADMISSION_CLOSED");
      if (Number(row.current_epoch) > go.payload.maximum_wp3_epoch) throw new CatfoodTrustError("GO_EPOCH_SCOPE_EXCEEDED");
      const spec = runSpec(row); if (canonicalJson(spec) !== canonicalJson(planningSpec)) throw new CatfoodTrustError("SOURCE_INTENT_CHANGED"); requireZeroPaidRuntime(planningRuntime); const item = planningInventory.find((candidate) => candidate.source_id === sourceId && candidate.capability === capability);
      if (!item) throw new CatfoodTrustError("SOURCE_INTENT_NOT_ELIGIBLE");
      const binding = this.control.query<Record<string, unknown>, [string, number, string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? AND wp3_epoch=? AND capability=?").get(row.run_id, row.current_epoch, capability);
      if (!binding) throw new CatfoodTrustError("AUTHORITY_BINDING_MISSING");
      const currentBoundary = planningBoundaries.find((candidate) => candidate.capability === capability);
      if (!currentBoundary) throw new CatfoodTrustError("BOUNDARY_COVERAGE_INCOMPLETE");
      verifyBoundary(currentBoundary, spec, "ADMIT", sample.wall_time, { capability, generation: Number(binding.threads_generation) });
      liveScope(spec, sample.wall_time);
      const requestId = `request:${sha256(canonicalJson({ run_id: row.run_id, epoch: row.current_epoch, capability, business_identity: item.business_identity, material_revision: item.material_revision })).slice(0, 32)}`;
      const semantic = sha256(canonicalJson({ capability, business_identity: item.business_identity, material_revision: item.material_revision })); const workId = `wrk:${semantic.slice(0, 32)}`;
      if (this.control.query("SELECT 1 FROM catfood_work_admissions WHERE semantic_identity_sha256=?").get(semantic)) throw new CatfoodTrustError("DUPLICATE_SEMANTIC_WORK");
      reserved = { item: structuredClone(item), requestId, workId, semantic, authorityRef: String(binding.authority_ref), generation: Number(binding.threads_generation) };
      this.appendJournal(row, "WORK_DISPATCH_INTENT", session.session_id, this.source.source_identity, { work_id: workId, source_id: sourceId, capability, business_identity: item.business_identity, material_revision: item.material_revision, request_id: requestId, authority_ref: binding.authority_ref, threads_generation: binding.threads_generation }, Number(binding.threads_generation), null, requestId, sample);
    }).immediate();
    let head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "DISPATCH_INTENT_RETAINED", request_id: reserved.requestId });
    let remoteClaim: ThreadsClaimRecord | undefined; let dispatchReleased = false;
    try {
      const dispatchRow = this.getRun(session.run_id); this.authenticate(session, dispatchRow); this.requirePositiveRun(dispatchRow); const dispatchSpec = runSpec(dispatchRow);
      const dispatchItem = this.source.inventory(dispatchSpec).find((candidate) => candidate.source_id === sourceId && candidate.capability === capability);
      if (!dispatchItem || canonicalJson(dispatchItem) !== canonicalJson(reserved.item)) throw new CatfoodTrustError("SOURCE_INTENT_CHANGED");
      this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "WORK_DISPATCH_RELEASED", session.session_id, this.source.source_identity, { work_id: reserved.workId, request_id: reserved.requestId, capability, authority_ref: reserved.authorityRef, threads_generation: reserved.generation }, reserved.generation, null, reserved.requestId, sample)).immediate();
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "WORK_DISPATCH_RELEASED", request_id: reserved.requestId }); dispatchReleased = true;
      const dispatchClaim = capability === "editorial.outcome_evaluation" ? this.source.outcomeEvaluation(dispatchSpec, validateOutcomeEvaluationRequest({ account_id: dispatchSpec.account_id, capability, request_id: reserved.requestId, experiment_id: dispatchItem.business_identity, expected_material_revision: dispatchItem.material_revision, authority_ref: reserved.authorityRef, spec_hash: dispatchSpec.spec_sha256, expected_threads_generation: reserved.generation, runtime_observation_id: String(this.sourceSnapshot(dispatchSpec, sample.wall_time).coe.runtime_enforcement.freshness_identity), expected_release_git_sha: dispatchSpec.threads_sha }), dispatchItem) : this.source.claim(dispatchSpec, dispatchItem, reserved.authorityRef, reserved.generation, reserved.requestId);
      remoteClaim = dispatchClaim;
      this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "WORK_DISPATCH_REMOTE_FACT", session.session_id, this.source.source_identity, { work_id: reserved.workId, request_id: reserved.requestId, claim: dispatchClaim as unknown as Json, no_positive_credit: true }, dispatchClaim.generation, dispatchClaim.claim_id, dispatchClaim.request_id, sample)).immediate();
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: "WORK_REMOTE_FACT_RETAINED", request_id: reserved.requestId });
      const applyRuntime = this.source.runtimeEvidence(dispatchSpec), applyItem = this.source.inventory(dispatchSpec).find((candidate) => candidate.source_id === sourceId && candidate.capability === capability), applyBoundary = this.source.boundaries(dispatchSpec).find((candidate) => candidate.capability === capability);
      this.liveEnrollment("custodian.admit.apply", session.run_id);
      this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row); this.requirePositiveRun(row); const go = this.verifyCurrentGo(row, sample);
      if (!row.lease_expires_at || Date.parse(row.lease_expires_at) <= Date.parse(sample.wall_time) || row.lifecycle !== "RUNNING" || row.admission_state !== "OPEN" || Number(row.current_epoch) > go.payload.maximum_wp3_epoch) throw new CatfoodTrustError("ADMISSION_CLOSED");
      const spec = runSpec(row); requireZeroPaidRuntime(applyRuntime); const item = applyItem;
      if (!item || canonicalJson(item) !== canonicalJson(reserved.item)) throw new CatfoodTrustError("SOURCE_INTENT_CHANGED");
      const binding = this.control.query<Record<string, unknown>, [string, number, string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? AND wp3_epoch=? AND capability=?").get(row.run_id, row.current_epoch, capability);
      if (!binding || binding.authority_ref !== reserved.authorityRef || Number(binding.threads_generation) !== reserved.generation) throw new CatfoodTrustError("AUTHORITY_BINDING_CHANGED");
      const currentBoundary = applyBoundary; if (!currentBoundary) throw new CatfoodTrustError("BOUNDARY_COVERAGE_INCOMPLETE");
      verifyBoundary(currentBoundary, spec, "ADMIT", sample.wall_time, { capability, generation: reserved.generation }); liveScope(spec, sample.wall_time);
      const claim = dispatchClaim;
      if (claim.account_id !== spec.account_id || claim.capability !== capability || claim.authority_ref !== binding.authority_ref || claim.generation !== binding.threads_generation || claim.claim_status !== "in_progress") throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_INVALID");
      if (Date.parse(claim.admitted_at) < Date.parse(spec.requested_window_start) || Date.parse(claim.admitted_at) >= Date.parse(spec.requested_window_end)) throw new CatfoodTrustError("WORK_OUTSIDE_WINDOW");
      try {
        this.control.query("INSERT INTO catfood_work_admissions(work_id,run_id,wp3_epoch,capability,claim_id,request_id,business_identity,material_revision,semantic_identity_sha256,authority_ref,threads_generation,claim_json,status,admitted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'ADMITTED',?)")
          .run(reserved.workId, row.run_id, row.current_epoch, capability, claim.claim_id, claim.request_id, claim.business_identity, claim.material_revision, reserved.semantic, claim.authority_ref, claim.generation, canonicalJson(claim), sample.wall_time);
      } catch { throw new CatfoodTrustError("DUPLICATE_SEMANTIC_WORK"); }
      this.appendJournal(row, "WORK_ADMITTED", session.session_id, this.source.source_identity, { work_id: reserved.workId, source_id: sourceId, business_identity: claim.business_identity, material_revision: claim.material_revision, go_sha256: row.go_sha256, dispatch_intent_request_id: reserved.requestId }, claim.generation, claim.claim_id, claim.request_id, sample);
      ticket = Object.freeze({ work_id: reserved.workId, claim_id: claim.claim_id, request_id: claim.request_id, capability, wp3_epoch: Number(row.current_epoch), threads_generation: claim.generation });
      }).immediate();
    } catch (error) {
      const code = error instanceof CatfoodTrustError ? error.code : "MUTATION_OUTCOME_AMBIGUOUS"; const definitiveRemoteRejection = /^THREADS_HTTP_4\d\d_/.test(code) && !code.includes("AMBIGUOUS");
      const event = remoteClaim ? "WORK_POSITIVE_APPLY_REJECTED" : dispatchReleased && !definitiveRemoteRejection ? "WORK_DISPATCH_POSSIBLY_APPLIED" : "WORK_DISPATCH_REJECTED";
      const dispatchState = remoteClaim ? "REMOTE_SUCCEEDED" : !dispatchReleased ? "NOT_DISPATCHED" : definitiveRemoteRejection ? "REMOTE_REJECTED" : "REMOTE_AMBIGUOUS";
      this.control.transaction(() => { const row = this.getRun(session.run_id); this.appendJournal(row, event, session.session_id, this.source.source_identity, { work_id: reserved.workId, request_id: reserved.requestId, reason_code: code, dispatch_state: dispatchState, no_positive_credit: true }, remoteClaim?.generation ?? reserved.generation, remoteClaim?.claim_id ?? null, reserved.requestId, sample); }).immediate();
      head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head, { state: dispatchState, request_id: reserved.requestId }); throw error;
    }
    head = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, head);
    return ticket;
  }

  reconcile(session: RunnerSession, workId: string): ThreadsClaimRecord {
    // Recovery observation is safety-only and remains available after an
    // anchor failure; it cannot open admission or expand authority.
    assertConnection(this.control); checkpointHealth(this.checkpoints); loadTrust(this.control);
    const sample = this.sample(); const initial = this.getRun(session.run_id); this.authenticate(session, initial);
    const initialWork = this.control.query<Record<string, unknown>, [string, string]>("SELECT * FROM catfood_work_admissions WHERE run_id=? AND work_id=?").get(initial.run_id, workId); if (!initialWork) throw new CatfoodTrustError("WORK_NOT_FOUND");
    const claimId = String(initialWork.claim_id), authorization = this.authorizeSource("source.read_claim", `${initial.run_id}:${claimId}`, "SAFETY_RECONCILIATION");
    const observed = this.source.readClaim(runSpec(initial), claimId, authorization); let result!: ThreadsClaimRecord;
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      const work = this.control.query<Record<string, unknown>, [string, string]>("SELECT * FROM catfood_work_admissions WHERE run_id=? AND work_id=?").get(row.run_id, workId);
      if (!work) throw new CatfoodTrustError("WORK_NOT_FOUND");
      if (canonicalJson({ claim_id: work.claim_id, request_id: work.request_id, capability: work.capability, business_identity: work.business_identity, material_revision: work.material_revision, threads_generation: work.threads_generation }) !== canonicalJson({ claim_id: initialWork.claim_id, request_id: initialWork.request_id, capability: initialWork.capability, business_identity: initialWork.business_identity, material_revision: initialWork.material_revision, threads_generation: initialWork.threads_generation })) throw new CatfoodTrustError("WORK_IDENTITY_CHANGED");
      const source = observed;
      if (!source || source.claim_id !== work.claim_id || source.request_id !== work.request_id || source.capability !== work.capability || source.business_identity !== work.business_identity || source.material_revision !== work.material_revision || source.generation !== work.threads_generation) throw new CatfoodTrustError("THREADS_RESULT_IDENTITY_MISMATCH");
      if (source.claim_status === "in_progress") throw new CatfoodTrustError("WORK_NOT_TERMINAL");
      const spec = runSpec(row);
      const inWindow = !!source.completed_at && Date.parse(source.completed_at) >= Date.parse(spec.requested_window_start) && Date.parse(source.completed_at) < Date.parse(spec.requested_window_end);
      this.control.query("UPDATE catfood_work_admissions SET status='TERMINAL',terminal_json=?,completed_at=? WHERE work_id=? AND status='ADMITTED'").run(canonicalJson(source), source.completed_at, workId);
      this.appendJournal(row, inWindow ? "WORK_RECONCILED" : "WORK_RECONCILED_OUTSIDE_WINDOW", session.session_id, this.source.source_identity, { work_id: workId, authoritative_result: source as unknown as Json }, source.generation, source.claim_id, source.request_id, sample);
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
    const sample = this.sample(); let bindings: Record<string, unknown>[] = []; let obligations: readonly AuthorityMutationObligation[] = []; let spec!: CatfoodRunSpec; let terminal = false; let stopVersion = 0;
    // Commit the local fence before any external call. Competing admissions use
    // the same immediate write lock and must re-read this closed head.
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      if (row.lifecycle === "CLOSED" || this.terminalCause(row.run_id) === "RUN_CLOSED") throw new CatfoodTrustError("RUN_CLOSED");
      terminal = reason === "ABORT" || this.terminalCause(row.run_id) !== null;
      this.control.query("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle=?,state_version=state_version+1 WHERE run_id=?")
        .run(terminal ? "ABORTED" : "STOP_PENDING", row.run_id);
      this.appendJournal(this.getRun(row.run_id), `${reason}_REQUESTED`, session.session_id, "custodian", { reason }, null, null, null, sample);
      spec = runSpec(row);
      bindings = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? ORDER BY wp3_epoch,capability").all(row.run_id);
      obligations = authorityMutationInventory(this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_source_journal WHERE run_id=? ORDER BY sequence").all(row.run_id));
      stopVersion = Number(this.getRun(row.run_id).state_version);
    }).immediate();
    let anchorFailure: unknown;
    const requestedHead = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!;
    try { this.anchor(session.run_id, requestedHead, { state: "COMPLETE", local_admission: "CLOSED" }); } catch (error) { anchorFailure = error; }
    const proofs = new Map<string, OperationalBoundaryV1>(); const closedBindings = new Set<string>(); let safetyError: string | undefined;
    const boundaryAuthorization = this.authorizeSource("source.boundaries", `${spec.run_id}:boundaries`, "SAFETY_RECONCILIATION");
    let boundaries = new Map<CatfoodCapability, OperationalBoundaryV1>();
    const refreshBoundaries = () => {
      const observed = this.source.boundaries(spec, boundaryAuthorization).map((value) => verifyBoundary(value, spec, "STOP", sample.wall_time));
      boundaries = new Map(observed.filter((value) => value.capability !== null).map((value) => [value.capability!, value]));
    };
    try { refreshBoundaries(); } catch (error) { safetyError = error instanceof CatfoodTrustError ? error.code : "BOUNDARY_UNAVAILABLE"; }
    const inhibited = (boundary: OperationalBoundaryV1 | undefined) => {
      const flight = boundary?.governed_in_flight as Record<string, unknown> | undefined;
      return !!boundary && boundary.execution_state === "INHIBITED" && boundary.stop_acknowledgement === "INHIBITED" && Number(flight?.count) === 0;
    };
    const dispatchRevoke = (capability: CatfoodCapability, authorityRef: string, expectedGeneration: number): { requestId: string; boundary?: OperationalBoundaryV1; invalid_response?: boolean } => {
      const payload = { action: "revoke", account_id: spec.account_id, capability, authority_ref: authorityRef, spec_hash: spec.spec_sha256, expected_generation: expectedGeneration, permit_expires_at: null };
      const payloadSha = sha256(canonicalJson(payload)), requestId = `revoke:${sha256(canonicalJson({ run_id: spec.run_id, payload })).slice(0, 32)}`;
      this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_REVOKE_INTENT", session.session_id, this.source.source_identity, { request_id: requestId, operation: "revoke", capability, authority_ref: authorityRef, expected_generation: expectedGeneration, payload_sha256: payloadSha, wp3_epoch: this.getRun(session.run_id).current_epoch, no_positive_use: true }, expectedGeneration, null, requestId, sample)).immediate();
      let journalHead = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, journalHead, { state: "REVOKE_INTENT_RETAINED", request_id: requestId });
      this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_DISPATCH_RELEASED", session.session_id, this.source.source_identity, { request_id: requestId, operation: "revoke", capability, authority_ref: authorityRef, expected_generation: expectedGeneration, payload_sha256: payloadSha, no_positive_use: true }, expectedGeneration, null, requestId, sample)).immediate();
      journalHead = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, journalHead, { state: "REVOKE_DISPATCH_RELEASED", request_id: requestId });
      let invalidResponse = false;
      try {
        const authorization = this.authorizeSource("source.authority.revoke", `${spec.run_id}:${capability}`, "SAFETY_RECONCILIATION");
        const transition = this.source.revoke(spec, capability, authorityRef, expectedGeneration, authorization);
        const boundary = verifyBoundary(transition.boundary, spec, "STOP", sample.wall_time);
        if (!inhibited(boundary)) { invalidResponse = true; throw new CatfoodTrustError("REVOKE_ACKNOWLEDGEMENT_INVALID"); }
        this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_REVOKE_REMOTE_FACT", session.session_id, this.source.source_identity, { request_id: requestId, operation: "revoke", capability, authority_ref: transition.authority_ref, generation: transition.generation, boundary: boundary as unknown as Json, payload_sha256: payloadSha, no_positive_use: true }, transition.generation, null, requestId, sample)).immediate();
      } catch (error) {
        const code = error instanceof CatfoodTrustError ? error.code : error instanceof Error ? error.message : "UNKNOWN";
        this.control.transaction(() => this.appendJournal(this.getRun(session.run_id), "THREADS_AUTHORITY_POSSIBLY_APPLIED", session.session_id, this.source.source_identity, { request_id: requestId, operation: "revoke", capability, authority_ref: authorityRef, expected_generation: expectedGeneration, payload_sha256: payloadSha, reason_code: code, no_positive_use: true }, expectedGeneration, null, requestId, sample)).immediate();
      }
      journalHead = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!; this.anchor(session.run_id, journalHead, { state: "REVOKE_RESULT_RETAINED", request_id: requestId });
      try { refreshBoundaries(); } catch { return { requestId, invalid_response: invalidResponse }; }
      return { requestId, boundary: boundaries.get(capability), invalid_response: invalidResponse };
    };
    if (!safetyError) {
      for (const obligation of obligations) {
        if (!obligation.released || ["NOT_DISPATCHED", "REMOTE_REJECTED"].includes(obligation.outcome)) continue;
        let boundary = boundaries.get(obligation.capability);
        if (boundary?.execution_state === "PERMITTED") {
          const authorityRef = obligation.returned_authority_ref ?? obligation.requested_authority_ref;
          if (boundary.fencing_generation === null || !authorityRef) { safetyError = "REMOTE_EFFECT_UNRESOLVED"; continue; }
          const recovery = dispatchRevoke(obligation.capability, authorityRef, boundary.fencing_generation); boundary = recovery.boundary; if (recovery.invalid_response) safetyError = "REVOKE_ACKNOWLEDGEMENT_INVALID"; if (boundary && !recovery.invalid_response) proofs.set(recovery.requestId, boundary);
        }
        if (!inhibited(boundary)) { safetyError = "REMOTE_EFFECT_UNRESOLVED"; continue; }
        if (obligation.outcome !== "REMOTE_SUCCEEDED" && (!obligation.expected_generation_known || boundary!.fencing_generation === obligation.expected_generation)) { safetyError = "REMOTE_EFFECT_UNRESOLVED"; continue; }
        proofs.set(obligation.request_id, boundary!);
      }
      for (const binding of bindings) {
        const capability = String(binding.capability) as CatfoodCapability; let boundary = boundaries.get(capability);
        if (boundary?.execution_state === "PERMITTED" && boundary.fencing_generation === Number(binding.threads_generation)) {
          const recovery = dispatchRevoke(capability, String(binding.authority_ref), boundary.fencing_generation); boundary = recovery.boundary; if (recovery.invalid_response) safetyError = "REVOKE_ACKNOWLEDGEMENT_INVALID"; if (boundary && !recovery.invalid_response) proofs.set(recovery.requestId, boundary);
        }
        if (inhibited(boundary) && boundary!.fencing_generation !== Number(binding.threads_generation)) closedBindings.add(`${binding.wp3_epoch}:${capability}:${binding.authority_ref}:${binding.threads_generation}`);
        else safetyError = "REMOTE_EFFECT_UNRESOLVED";
      }
    }
    const candidateHead = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(session.run_id)!;
    let safe = !anchorFailure && !safetyError;
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      const currentHead = this.control.query<{ sequence: number; row_hash: string }, [string]>("SELECT sequence,row_hash FROM catfood_source_journal WHERE run_id=? ORDER BY sequence DESC LIMIT 1").get(row.run_id)!;
      if (Number(row.state_version) !== stopVersion || currentHead.sequence !== candidateHead.sequence || currentHead.row_hash !== candidateHead.row_hash || row.admission_state !== "CLOSED") safe = false;
      const finalObligations = authorityMutationInventory(this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_source_journal WHERE run_id=? ORDER BY sequence").all(row.run_id));
      for (const obligation of finalObligations) {
        if (obligation.identity_conflict || obligation.released && !["REMOTE_REJECTED"].includes(obligation.outcome)) {
          const proof = proofs.get(obligation.request_id);
          if (!proof || !inhibited(proof) || obligation.outcome !== "REMOTE_SUCCEEDED" && (!obligation.expected_generation_known || proof.fencing_generation === obligation.expected_generation)) safe = false;
        }
      }
      if (closedBindings.size !== bindings.length) safe = false;
      for (const binding of bindings) {
        const boundary = boundaries.get(String(binding.capability) as CatfoodCapability);
        if (boundary && inhibited(boundary)) this.appendJournal(row, "THREADS_AUTHORITY_REVOKED", session.session_id, this.source.source_identity, { capability: String(binding.capability), boundary: boundary as unknown as Json, request_id: null, no_positive_use: true }, boundary.fencing_generation, null, null, sample);
      }
      const unresolved = this.control.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM catfood_work_admissions WHERE run_id=? AND status<>'TERMINAL'").get(row.run_id)?.n ?? 0;
      if (unresolved) safe = false;
      const lifecycle = terminal ? (safe ? "ABORTED" : "ABORT_UNCONFIRMED") : safe ? (reason === "PAUSE" ? "PAUSED" : "SAFE_QUIESCENCE") : "STOP_UNCONFIRMED";
      this.control.query("UPDATE catfood_runs SET lifecycle=?,state_version=state_version+1 WHERE run_id=?").run(lifecycle, row.run_id);
      this.appendJournal(this.getRun(row.run_id), safe ? "SAFE_QUIESCENCE" : terminal ? "ABORT_UNCONFIRMED" : "STOP_UNCONFIRMED", session.session_id, this.source.source_identity, { unresolved, terminal_cause_preserved: terminal, obligation_count: finalObligations.length, proof_request_ids: [...proofs.keys()].sort(), error_class: safetyError ?? null }, null, null, null, sample);
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
      this.requirePositiveRun(row);
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
    const initial = this.getRun(session.run_id); this.authenticate(session, initial); const spec = runSpec(initial);
    if (Date.parse(sample.wall_time) < Date.parse(spec.requested_window_end)) throw new CatfoodTrustError("WINDOW_NOT_COMPLETE");
    const acquisitionRequest = { account_id: spec.account_id, assessment_mode: "HISTORICAL" as const, window_start: spec.requested_window_start, window_end: spec.requested_window_end };
    const acquisitionAuthorization = this.authorizeSource("source.acquire.historical", `acquire:${sha256(canonicalJson(acquisitionRequest))}`, "HISTORICAL_EVIDENCE"); if (acquisitionAuthorization) this.source.prepareAuthorizedAcquisition?.(acquisitionAuthorization, acquisitionRequest);
    const coe = acquireCoe(this.source, spec, "CLOSED_RUN"); const coeAssessment = assessCoe(coe, spec.requested_window_end);
    const boundaryAuthorization = this.authorizeSource("source.boundaries", `${spec.run_id}:boundaries`, "SAFETY_RECONCILIATION");
    const boundaries = this.source.boundaries(spec, boundaryAuthorization).map((boundary) => verifyBoundary(boundary, spec, "FINAL", sample.wall_time));
    const inventory = this.source.inventory(spec); const runtime = this.source.runtimeEvidence(spec);
    const works = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_work_admissions WHERE run_id=? ORDER BY admitted_at,work_id").all(session.run_id);
    const claims = works.map((work) => {
      const claimId = String(work.claim_id), claimAuthorization = this.authorizeSource("source.read_claim", `${spec.run_id}:${claimId}`, "SAFETY_RECONCILIATION");
      const claim = this.source.readClaim(spec, claimId, claimAuthorization); if (!claim) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_MISSING");
      const decision = verifyGovernedWork(coe, claim, spec.spec_sha256, spec.organization_id);
      return { work_id: String(work.work_id), claim, decision };
    });
    const authorities = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? ORDER BY wp3_epoch,capability").all(session.run_id);
    const events = this.verifyJournal(session.run_id); const membership = runMembership(spec, coe, authorities, events);
    const coeJson = canonicalCoeJson(coe); const retainedCore = { phase: "CLOSED_RUN", dependency_root: CATFOOD_THREADS_DEPENDENCY_ROOT, coe_base64url: Buffer.from(coeJson).toString("base64url"), coe_sha256: sha256(coeJson), coeAssessment: { state: coeAssessment.state, reasons: coeAssessment.reasons }, run_membership: membership as unknown as Json, boundaries, inventory, runtime, claims };
    const retained = { ...retainedCore, source_digest: sha256(canonicalJson(retainedCore)) };
    this.control.transaction(() => {
      const row = this.getRun(session.run_id); this.authenticate(session, row);
      const safeAfterTerminal = this.control.query<{ safe_sequence: number | null; terminal_sequence: number | null }, [string]>("SELECT MAX(CASE WHEN event_type='SAFE_QUIESCENCE' THEN sequence END) safe_sequence,MAX(CASE WHEN event_type IN ('ABORT_REQUESTED','PAID_PROVIDER_ABORT','GO_REVOKED') THEN sequence END) terminal_sequence FROM catfood_source_journal WHERE run_id=?").get(row.run_id);
      if (row.lifecycle !== "SAFE_QUIESCENCE" && !(row.lifecycle === "ABORTED" && Number(safeAfterTerminal?.safe_sequence ?? 0) > Number(safeAfterTerminal?.terminal_sequence ?? 0))) throw new CatfoodTrustError("RUN_NOT_SAFELY_QUIESCENT");
      this.appendJournal(row, "CLOSED_SOURCE_SEALED", session.session_id, this.source.source_identity, retained as unknown as Json, null, null, null, sample);
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
    const retained = retainedClosedSource(events); const coe = retained.coe as unknown as CoeAcquisition;
    const retainedClaims = retained.claims as unknown as Array<{ work_id: string; claim: ThreadsClaimRecord; decision: GovernedWorkDecision }>;
    const authoritativeClaims = works.map((work) => {
      const archived = retainedClaims.find((item) => item.work_id === work.work_id); const claim = archived?.claim;
      if (!claim) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_MISSING");
      const terminal = work.terminal_json ? JSON.parse(String(work.terminal_json)) : null;
      if (terminal && canonicalJson(terminal) !== canonicalJson(claim)) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_TAMPERED");
      const decision = verifyGovernedWork(coe, claim, spec.spec_sha256, spec.organization_id);
      if (canonicalJson(decision) !== canonicalJson(archived!.decision)) throw new CatfoodTrustError("COE_GOVERNED_DECISION_TAMPERED");
      return { claim, decision };
    });
    const authorities = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? ORDER BY wp3_epoch,capability").all(runId);
    const recomputedAssessment = assessCoe(coe, spec.requested_window_end); const recomputedMembership = runMembership(spec, coe, authorities, events);
    if (canonicalJson({ state: recomputedAssessment.state, reasons: recomputedAssessment.reasons }) !== canonicalJson(retained.coeAssessment as Json)) throw new CatfoodTrustError("COE_ASSESSMENT_CACHE_TAMPERED");
    if (canonicalJson(recomputedMembership as unknown as Json) !== canonicalJson(retained.run_membership as Json)) throw new CatfoodTrustError("RUN_MEMBERSHIP_CACHE_TAMPERED");
    const checkpoint = this.checkpoints.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_checkpoints WHERE run_id=? ORDER BY last_sequence DESC LIMIT 1").get(runId);
    const finalSource = { runtime: retained.runtime, boundaries: retained.boundaries, inventory: retained.inventory, coe: closedCoeSummary(coe), coeAssessment: { state: recomputedAssessment.state, reasons: recomputedAssessment.reasons }, run_membership: recomputedMembership as unknown as Json, run_membership_reasons: membershipReasons(recomputedMembership, works, events), archive_sha256: retained.coe_sha256, digest: retained.source_digest, dependency_root: retained.dependency_root };
    return JSON.parse(canonicalJson({ schema: "catfood-rederived-bundle.v2", spec, go: { payload: go.payload as unknown as Json, artifact_sha256: go.artifact_sha256, key_id: go.key_id, trust_class: go.trust_class, action_validity_verified: verificationTimes }, run: { lifecycle: row.lifecycle, admission_state: row.admission_state, current_epoch: row.current_epoch, evidence_state: row.evidence_state, start_wall_time: row.start_wall_time as Json, start_monotonic_ms: row.start_monotonic_ms as Json, start_boot_id: row.start_boot_id as Json, closed_wall_time: row.closed_wall_time as Json, closed_monotonic_ms: row.closed_monotonic_ms as Json, closed_boot_id: row.closed_boot_id as Json }, journal: events.map((event) => ({ ...event, payload_json: JSON.parse(String(event.payload_json)) })) as unknown as Json, authorities: authorities as unknown as Json, work: works.map((work, index) => ({ ...work, claim_json: JSON.parse(String(work.claim_json)), terminal_json: authoritativeClaims[index]!.claim as unknown as Json, governed_decision: authoritativeClaims[index]!.decision as unknown as Json })) as unknown as Json, checkpoint: checkpoint as unknown as Json, final_source: finalSource as unknown as Json, source_mode: this.trust.source_mode })) as Record<string, Json>;
  }

  evaluate(runId: string): EvaluationResult {
    let bundle: Record<string, Json>;
    try { bundle = this.rederive(runId); } catch (error) {
      const code = error instanceof CatfoodTrustError ? error.code : "REDERIVATION_FAILED";
      return Object.freeze({ verdict: code.includes("TAMPER") || code.includes("CORRUPT") || code.includes("CHAIN") ? "FAIL" : "BLOCKED", reason_codes: Object.freeze([code]), rederived_bundle_sha256: "", evaluator_sha256: CATFOOD_EVALUATOR_SHA256, policy_sha256: CATFOOD_POLICY_SHA256, test_only: true, evidence_coverage: "UNKNOWN" });
    }
    {
      const cache = this.control.query<{ bundle_json: string; bundle_sha256: string }, [string]>("SELECT bundle_json,bundle_sha256 FROM catfood_bundle_cache WHERE run_id=?").get(runId);
      const digest = sha256(canonicalJson(bundle)); const cacheValid = !cache || cache.bundle_sha256 === digest && canonicalJson(JSON.parse(cache.bundle_json)) === canonicalJson(bundle);
      return evaluateCatfoodAcceptance(bundle, undefined, cacheValid);
    }
  }
}

export type ReadonlyThreadsEvidenceSource = Pick<ThreadsEvidenceSource,
  "source_identity" | "mode" | "runtimeEvidence" | "tenantProbe" | "boundaries" | "inventory" | "operationalEvidence" | "readClaim">;

/** Separate read-only artifact used by the attestation writer; it exposes no custodian mutations. */
export class IndependentCatfoodEvaluator {
  private readonly control: Database;
  private readonly checkpoints: Database;
  private readonly trust: Readonly<CatfoodTrustConfig>;

  constructor(controlPath: string, checkpointPath: string, private readonly source: ReadonlyThreadsEvidenceSource, private readonly enrollment?: CatfoodEnrollmentContext, private readonly provenance?: EnrolledTrustProvenance) {
    this.control = new Database(resolve(controlPath), { strict: true, create: false, readonly: true });
    this.checkpoints = new Database(resolve(checkpointPath), { strict: true, create: false, readonly: true });
    try {
      configure(this.control, true); configure(this.checkpoints, true); assertConnection(this.control); checkpointHealth(this.checkpoints);
      this.trust = loadTrust(this.control);
      if (this.trust.source_mode === "OPERATIONAL") { try { assertEnrolledRole(enrollment, "evaluator", "OPERATIONAL"); } catch { throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE"); } } else if (enrollment) assertEnrolledRole(enrollment, "evaluator", "TEST_ONLY");
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
    const pins = { policy_sha256: CATFOOD_POLICY_SHA256, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, dependency_root: CATFOOD_THREADS_DEPENDENCY_ROOT, threads_sha: this.trust.threads_sha, boundary_sha256: this.trust.operational_boundary_sha256, release_sha256: this.trust.threads_release_sha256, wp1_sha256: this.trust.wp1_sha256, coe_sha256: this.trust.coe_sha256, rehearsal_attestation_sha256: this.trust.rehearsal_attestation_sha256, emitter_inventory_sha256: this.trust.emitter_inventory_sha256, schema: this.trust.threads_schema, schema_fingerprint: this.trust.threads_schema_fingerprint, ikorabu_release_sha: this.trust.ikorabu_release_sha };
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
    const retained = retainedClosedSource(events); const coe = retained.coe as unknown as CoeAcquisition;
    const retainedClaims = retained.claims as unknown as Array<{ work_id: string; claim: ThreadsClaimRecord; decision: GovernedWorkDecision }>;
    const works = rawWorks.map((work) => {
      const archived = retainedClaims.find((item) => item.work_id === work.work_id); const claim = archived?.claim; if (!claim) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_MISSING");
      if (work.terminal_json && canonicalJson(JSON.parse(String(work.terminal_json))) !== canonicalJson(claim)) throw new CatfoodTrustError("AUTHORITATIVE_CLAIM_TAMPERED");
      const decision = verifyGovernedWork(coe, claim, spec.spec_sha256, spec.organization_id);
      if (canonicalJson(decision) !== canonicalJson(archived!.decision)) throw new CatfoodTrustError("COE_GOVERNED_DECISION_TAMPERED");
      return { ...work, claim_json: JSON.parse(String(work.claim_json)), terminal_json: claim, governed_decision: decision };
    });
    const authorities = this.control.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_authority_bindings WHERE run_id=? ORDER BY wp3_epoch,capability").all(runId);
    const recomputedAssessment = assessCoe(coe, spec.requested_window_end); const recomputedMembership = runMembership(spec, coe, authorities, events);
    if (canonicalJson({ state: recomputedAssessment.state, reasons: recomputedAssessment.reasons }) !== canonicalJson(retained.coeAssessment as Json)) throw new CatfoodTrustError("COE_ASSESSMENT_CACHE_TAMPERED");
    if (canonicalJson(recomputedMembership as unknown as Json) !== canonicalJson(retained.run_membership as Json)) throw new CatfoodTrustError("RUN_MEMBERSHIP_CACHE_TAMPERED");
    const finalSource = { runtime: retained.runtime, boundaries: retained.boundaries, inventory: retained.inventory, coe: closedCoeSummary(coe), coeAssessment: { state: recomputedAssessment.state, reasons: recomputedAssessment.reasons }, run_membership: recomputedMembership as unknown as Json, run_membership_reasons: membershipReasons(recomputedMembership, rawWorks, events), archive_sha256: retained.coe_sha256, digest: retained.source_digest, dependency_root: retained.dependency_root };
    return JSON.parse(canonicalJson({ schema: "catfood-rederived-bundle.v2", spec, go: { payload: go.payload as unknown as Json, artifact_sha256: go.artifact_sha256, key_id: go.key_id, trust_class: go.trust_class, action_validity_verified: verificationTimes }, run: { lifecycle: row.lifecycle, admission_state: row.admission_state, current_epoch: row.current_epoch, evidence_state: row.evidence_state, start_wall_time: row.start_wall_time as Json, start_monotonic_ms: row.start_monotonic_ms as Json, start_boot_id: row.start_boot_id as Json, closed_wall_time: row.closed_wall_time as Json, closed_monotonic_ms: row.closed_monotonic_ms as Json, closed_boot_id: row.closed_boot_id as Json }, journal: events.map((event) => ({ ...event, payload_json: JSON.parse(String(event.payload_json)) })), authorities, work: works, checkpoint: anchor, final_source: finalSource, source_mode: this.trust.source_mode })) as Record<string, Json>;
  }

  evaluate(runId: string, provenance = this.provenance): EvaluationResult {
    if (this.enrollment) inspectEnrolledRole(this.enrollment, "evaluator", "evaluator.execute", runId);
    let bundle: Record<string, Json>;
    try { bundle = this.rederive(runId); } catch (error) {
      const code = error instanceof CatfoodTrustError ? error.code : "REDERIVATION_FAILED";
      return Object.freeze({ verdict: /TAMPER|CORRUPT|CHAIN/.test(code) ? "FAIL" : "BLOCKED", reason_codes: Object.freeze([code]), rederived_bundle_sha256: "", evaluator_sha256: CATFOOD_EVALUATOR_SHA256, policy_sha256: CATFOOD_POLICY_SHA256, test_only: deriveEnrolledTrustDomain(provenance, CATFOOD_EVALUATION_PROVENANCE_NODES) !== "OPERATIONAL", evidence_coverage: "UNKNOWN" });
    }
    {
      const cache = this.control.query<{ bundle_json: string; bundle_sha256: string }, [string]>("SELECT bundle_json,bundle_sha256 FROM catfood_bundle_cache WHERE run_id=?").get(runId);
      const digest = sha256(canonicalJson(bundle)); const cacheValid = !cache || cache.bundle_sha256 === digest && canonicalJson(JSON.parse(cache.bundle_json)) === canonicalJson(bundle);
      const result = evaluateCatfoodAcceptance(bundle, provenance, cacheValid);
      if (this.enrollment) inspectEnrolledRole(this.enrollment, "evaluator", "evaluator.release", runId);
      return result;
    }
  }
}

function meaningfulClaim(work: Record<string, unknown>): boolean {
  if (work.status !== "TERMINAL" || !work.terminal_json || plain(work.governed_decision, "governed_decision").disposition !== "CREDIT") return false; const claim = work.terminal_json as ThreadsClaimRecord;
  if (claim.claim_status !== "succeeded" || claim.transport_status !== "SUCCEEDED" || claim.provider_invoked || claim.paid_cost_micros !== 0) return false;
  if (claim.capability === "editorial.cycle") return plain(work.governed_decision, "governed_decision").material_effect && plain(plain(work.governed_decision, "governed_decision").material_effect, "material_effect").eligibility === "ELIGIBLE" && claim.domain_result.state === "DRAFT" && claim.domain_result.status === "READY" && claim.domain_result.mutated === false && typeof claim.domain_result.cycle_id === "string";
  if (claim.capability === "editorial.outcome_evaluation") {
    const result = claim.domain_result; const evaluation = result.evaluation as Record<string, unknown> | undefined;
    if (result.state === "SUCCEEDED") return typeof result.result_identity === "string" && ["SUCCESS", "FAILURE", "INVALID_EXPERIMENT"].includes(String(result.native_domain_state));
    if (evaluation) return ["SUCCESS", "FAILURE", "INVALID_EXPERIMENT"].includes(String(evaluation.verdict)) && typeof (evaluation.decision_json as Record<string, unknown> | undefined)?.evaluation_id === "string";
    return result.state === "COMPLETED" && result.status === "RECORDED" && result.recorded === true && result.failed === false && ["SUCCESS", "FAILURE", "INVALID_EXPERIMENT"].includes(String(result.verdict));
  }
  return claim.capability === "threads.publish.dry_run" && claim.domain_result.status === "succeeded" && claim.domain_result.mode === "dry_run" && claim.domain_result.duplicate === false;
}

function semanticCreditIdentity(work: Record<string, unknown>): string | null {
  if (!meaningfulClaim(work)) return null;
  const decision = plain(work.governed_decision, "governed_decision"); const resultRef = decision.result_ref;
  if (typeof resultRef !== "string" || !resultRef) return null;
  const claim = work.terminal_json as ThreadsClaimRecord; let material: Json;
  if (claim.capability === "editorial.cycle") {
    const result = claim.domain_result;
    material = { cycle_id: result.cycle_id ?? null, content_id: result.content_id ?? null, state: result.state ?? null, status: result.status ?? null, updated_at: result.updated_at ?? null, source_content_ids: result.source_content_ids ?? null, brief: result.brief ?? null, draft: result.draft ?? null };
  } else if (claim.capability === "editorial.outcome_evaluation") {
    material = (claim.domain_result.evaluation ?? claim.domain_result.result_revision ?? work.material_revision) as Json;
  } else material = { publication_id: resultRef, status: claim.domain_result.status, mode: claim.domain_result.mode };
  return sha256(canonicalJson({ capability: claim.capability, result_identity: resultRef, material }));
}

/** The sole deterministic acceptance rule-set. Acquisition and integrity checks remain role-local. */
export function evaluateCatfoodAcceptance(bundle: Record<string, Json>, provenance?: EnrolledTrustProvenance, cacheValid = true): EvaluationResult {
  const reasons = new Set<string>();
  const run = plain(bundle.run, "run"); const spec = plain(bundle.spec, "spec");
  const work = bundle.work as unknown as Record<string, unknown>[]; const authorities = bundle.authorities as unknown as Record<string, unknown>[];
  const journal = bundle.journal as unknown as Record<string, unknown>[]; const source = plain(bundle.final_source, "source");
  const boundaries = source.boundaries as unknown as OperationalBoundaryV1[]; const coeAssessment = plain(source.coeAssessment, "coeAssessment");
  for (const reason of coeAssessment.reasons as unknown as string[]) reasons.add(reason);
  for (const reason of source.run_membership_reasons as unknown as string[]) reasons.add(reason);
  if (run.lifecycle !== "CLOSED") reasons.add("RUN_OPEN");
  if (run.evidence_state !== "ANCHORED") reasons.add("EVIDENCE_UNANCHORED");
  for (const reason of observationCoverageReasons(journal, run, spec)) reasons.add(reason);
  if (journal.some((event) => ["ABORT_REQUESTED", "PAID_PROVIDER_ABORT", "GO_REVOKED", "ABORT_UNCONFIRMED"].includes(String(event.event_type)))) reasons.add("RUN_ABORTED");
  if (journal.some((event) => ["PAUSE_REQUESTED", "STOP_UNCONFIRMED"].includes(String(event.event_type)))) reasons.add("CONTINUOUS_COVERAGE_BROKEN");
  if (Number(run.current_epoch) < 2 || !journal.some((event) => event.event_type === "RESTART_TAKEOVER")) reasons.add("RESTART_NOT_PROVEN");
  const inWindow = (item: Record<string, unknown>) => { const claim = item.terminal_json as ThreadsClaimRecord | null; return !!claim?.completed_at && Date.parse(claim.completed_at) >= Date.parse(String(spec.requested_window_start)) && Date.parse(claim.completed_at) < Date.parse(String(spec.requested_window_end)); };
  if (work.some((item) => item.status === "TERMINAL" && !inWindow(item))) reasons.add("WORK_COMPLETED_OUTSIDE_WINDOW");
  const meaningfulByIdentity = new Map<string, Record<string, unknown>>();
  for (const item of work) if (inWindow(item)) { const identity = semanticCreditIdentity(item); if (identity && !meaningfulByIdentity.has(identity)) meaningfulByIdentity.set(identity, item); }
  const meaningful = [...meaningfulByIdentity.values()];
  if (meaningful.length < CATFOOD_FIXED_POLICY.minimum_meaningful_units) reasons.add("MEANINGFUL_WORK_COUNT_NOT_MET");
  if (new Set(meaningful.map((item) => item.capability)).size < CATFOOD_FIXED_POLICY.minimum_capability_classes) reasons.add("MEANINGFUL_CLASS_COUNT_NOT_MET");
  if (!meaningful.some((item) => Number(item.wp3_epoch) === 1) || !meaningful.some((item) => Number(item.wp3_epoch) > 1)) reasons.add("RESTART_WORK_COVERAGE_NOT_MET");
  if (work.some((item) => item.status !== "TERMINAL")) reasons.add("UNRESOLVED_WORK");
  for (const item of work) { const decision = plain(item.governed_decision, "governed_decision"); if (decision.disposition === "FAIL" || decision.disposition === "BLOCKED") reasons.add(String(decision.reason)); }
  if (!Array.isArray(boundaries) || boundaries.some((boundary) => boundary.execution_state !== "INHIBITED" || boundary.stop_acknowledgement !== "INHIBITED" || Number((boundary.governed_in_flight as Record<string, unknown>).count) !== 0)) reasons.add("FINAL_AUTHORITY_OPEN");
  if (work.some((item) => { const claim = item.terminal_json as ThreadsClaimRecord | null; return claim && (claim.provider_invoked || claim.paid_cost_micros === "UNKNOWN" || Number(claim.paid_cost_micros) !== 0); })) reasons.add("PROVIDER_COST_VIOLATION");
  for (const capability of new Set(authorities.map((authority) => String(authority.capability)))) if (!journal.some((event) => { const payload = event.payload_json as Record<string, unknown>; return event.event_type === "THREADS_AUTHORITY_REVOKED" && payload.capability === capability; })) reasons.add("FINAL_AUTHORITY_OPEN");
  if (!cacheValid) reasons.add("BUNDLE_CACHE_TAMPERED");
  const digest = sha256(canonicalJson(bundle));
  const trustDomain = deriveEnrolledTrustDomain(provenance, CATFOOD_EVALUATION_PROVENANCE_NODES);
  if (trustDomain === "UNVERIFIED" && String(bundle.source_mode) === "OPERATIONAL") reasons.add("OPERATIONAL_PROVENANCE_UNVERIFIED");
  const priorTestTaint = journal.some((event) => { const payload = event.payload_json as Record<string, unknown> | undefined; return event.event_type === "PREFLIGHT_PASSED" && (payload?.coe as Record<string, unknown> | undefined)?.test_only === true; });
  const sourceTestTaint = (source.coe as Record<string, unknown>).test_only !== false || priorTestTaint;
  if (String(bundle.source_mode) === "OPERATIONAL" && (source.coe as Record<string, unknown>).test_only === undefined) reasons.add("OPERATIONAL_PROVENANCE_UNVERIFIED");
  return Object.freeze({ verdict: verdictFromReasons(reasons), reason_codes: Object.freeze([...reasons].sort()), rederived_bundle_sha256: digest, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, policy_sha256: CATFOOD_POLICY_SHA256, test_only: trustDomain !== "OPERATIONAL" || sourceTestTaint, evidence_coverage: String((source.coe as Record<string, unknown>).coverage && ((source.coe as Record<string, unknown>).coverage as Record<string, unknown>).state) as "COMPLETE" | "PARTIAL" | "UNKNOWN" });
}
