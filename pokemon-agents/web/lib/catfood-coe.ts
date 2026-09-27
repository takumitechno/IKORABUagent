import { sha256, type Json } from "./catfood-harness";

function canonicalJson(value: unknown): string {
  const codePointOrder = (left: string, right: string): number => {
    const a = [...left]; const b = [...right];
    for (let index = 0; index < Math.min(a.length, b.length); index++) {
      const difference = a[index]!.codePointAt(0)! - b[index]!.codePointAt(0)!;
      if (difference) return difference;
    }
    return a.length - b.length;
  };
  const serialize = (item: unknown): string => {
    if (item === null || typeof item === "string" || typeof item === "boolean") return JSON.stringify(item);
    if (typeof item === "number" && Number.isFinite(item) && !Object.is(item, -0) && (item === 0 || Math.abs(item) >= 1e-6 && Math.abs(item) < 1e21) && (!Number.isInteger(item) || Number.isSafeInteger(item))) return JSON.stringify(item);
    if (Array.isArray(item)) return `[${item.map(serialize).join(",")}]`;
    if (item && typeof item === "object") return `{${Object.entries(item as Record<string, unknown>).sort(([a], [b]) => codePointOrder(a, b)).map(([key, child]) => `${JSON.stringify(key)}:${serialize(child)}`).join(",")}}`;
    throw new CoeError("COE_NON_JSON_VALUE");
  };
  return serialize(value);
}
export const canonicalCoeJson = canonicalJson;

export function decodeCoeAcquisition(raw: string): CoeAcquisition {
  const parsed = object(parseJsonNoDuplicateKeys(raw)); const digest = parsed.digest;
  if (parsed.phase !== "CLOSED_RUN" || typeof digest !== "string") throw new CoeError("COE_ARCHIVE_INVALID");
  const base = { ...parsed }; delete base.digest;
  if (sha256(canonicalJson(base)) !== digest) throw new CoeError("COE_ARCHIVE_DIGEST_MISMATCH");
  return parsed as unknown as CoeAcquisition;
}

export const CATFOOD_THREADS_PINS = Object.freeze({
  threads_sha: "875e75fce20c16c6157b5aa42f759411c52e95fe",
  release_sha256: "04cebd1f97928be56666e6dc82030da44aede7d5f9cb9c2efa5a40e027490e0c",
  wp1_sha256: "14ed73d33a02b3f8877a3045d226f23b7d9e7686f9dc2c8ef595aeae934fa3dc",
  operational_boundary_sha256: "57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf",
  coe_sha256: "50b6df97abc73384063a02cd69a7872b829d264177cad11d304678c04057db0e",
  rehearsal_attestation_sha256: "dbcd6da118b41d53e86747927f562037545ad617958c90abbee9577662df0b5b",
  emitter_inventory_sha256: "fa3ba3589c64f3116577c977f3946be618497ccf5976a109d0591edb7e6e7b1f",
  schema: 33,
  schema_fingerprint: "79e3bc10353b8a7859abf4e71ea04bf9ad6485e842275f7cf1237c223d65cc10",
  coe_contract: "threads.catfood-operational-evidence.v1",
  coe_schema: 1,
  source_inventory_version: 3,
  read_route: "GET /autopilot/v2/operational-evidence",
  outcome_route: "POST /autopilot/v2/operational-evidence/outcome-evaluation",
});

const FROZEN_DEPENDENCIES = Object.freeze({
  threads_sha: CATFOOD_THREADS_PINS.threads_sha,
  release_sha256: CATFOOD_THREADS_PINS.release_sha256,
  wp1_sha256: CATFOOD_THREADS_PINS.wp1_sha256,
  operational_boundary_sha256: CATFOOD_THREADS_PINS.operational_boundary_sha256,
  coe_sha256: CATFOOD_THREADS_PINS.coe_sha256,
  rehearsal_attestation_sha256: CATFOOD_THREADS_PINS.rehearsal_attestation_sha256,
  emitter_inventory_sha256: CATFOOD_THREADS_PINS.emitter_inventory_sha256,
  schema: CATFOOD_THREADS_PINS.schema,
  schema_fingerprint: CATFOOD_THREADS_PINS.schema_fingerprint,
});
export const CATFOOD_THREADS_DEPENDENCY_ROOT = sha256(canonicalJson(FROZEN_DEPENDENCIES));
export type EvidencePhase = "LIVE_ADMISSION" | "CLOSED_RUN";

export interface CoeRequest {
  account_id: string;
  capability: null;
  assessment_mode: "LIVE" | "HISTORICAL";
  window_start: string;
  window_end: string;
  page_size: 500;
  cursor: string | null;
}

export interface OutcomeEvaluationRequest {
  account_id: string;
  capability: "editorial.outcome_evaluation";
  request_id: string;
  experiment_id: string;
  expected_material_revision: string;
  observed_through?: string | null;
  authority_ref: string;
  spec_hash: string;
  expected_threads_generation: number;
  runtime_observation_id: string;
  expected_release_git_sha: string;
}

export interface CoePageSource {
  readonly evidence_trust?: "OPERATIONAL" | "TEST_ONLY";
  operationalEvidence(request: Readonly<CoeRequest>): unknown;
}

export interface CoeRawPage {
  parsed: unknown;
  receipt: {
    representation: "AUTHENTICATED_DECODED_BODY";
    body_base64url: string;
    byte_length: number;
    body_sha256: string;
    content_type: "application/json";
    content_encoding: "identity";
    source_session_id: string;
  };
}

export interface CoeScope {
  account_id: string;
  organization_id: string;
  tenant_id: string;
  threads_sha: string;
  threads_release_sha256: string;
  threads_schema: number;
  threads_schema_fingerprint: string;
  coe_sha256: string;
  rehearsal_attestation_sha256: string;
  emitter_inventory_sha256: string;
  requested_window_start: string;
  requested_window_end: string;
}

export interface CoeAcquisition {
  phase: EvidencePhase;
  contract: string;
  schema_version: number;
  producer_release_identity: { git_sha: string; artifact_sha256: string } | null;
  scope: { account_id: string; capability: null };
  source_inventory: Record<string, Json>;
  coverage: Record<string, Json>;
  prohibited_activity: Record<string, Json>;
  runtime_enforcement: Record<string, Json>;
  operational_observation: Record<string, Json>;
  outcome_evaluation_targets: readonly Record<string, Json>[];
  records: readonly Record<string, Json>[];
  pages: readonly Record<string, Json>[];
  page_receipts: readonly Record<string, Json>[];
  representation: "AUTHENTICATED_DECODED_BODY" | "CONSUMER_RESERIALIZED";
  page_count: number;
  test_only: boolean;
  digest: string;
}

export interface GovernedWorkDecision {
  disposition: "CREDIT" | "ZERO" | "BLOCKED" | "FAIL";
  authoritative_state: "SUCCEEDED" | "FAILED" | "DUPLICATE" | "REPLAYED" | "REJECTED_PRECLAIM" | "UNRESOLVED" | "MISSING";
  credit_eligible: boolean;
  reason: string;
  request_id: string;
  claim_id: string;
  source_ref: string | null;
  result_ref: string | null;
}

export interface ProtectedInvocationBinding {
  receipt_id: string;
  source_session_id: string;
  principal_ref: string;
  credential_version_ref: string;
  organization_id: string;
  account_id: string;
  capability: string;
  authority_ref: string;
  spec_hash: string;
  generation: number;
  authority_event_id: string;
  authority_actor: string;
  authority_occurred_at: string;
}

export interface FoldedAttempt {
  namespace: string;
  attempt_id: string;
  first: Record<string, Json>;
  claim_origin: Record<string, Json> | null;
  terminal: Record<string, Json>;
  lifecycle: readonly Record<string, Json>[];
  first_occurred_at: string;
  terminal_occurred_at: string;
}

export type RunMembership = "IN_SCOPE" | "PROVEN_OUT_OF_SCOPE" | "UNRESOLVED_MEMBERSHIP";
export interface AttemptMembershipDecision {
  namespace: string;
  membership: RunMembership;
  reason: string;
  source_refs: readonly string[];
  attempt: FoldedAttempt;
}
export interface RunMembershipContext {
  account_id: string;
  spec_hash: string;
  window_start: string;
  window_end: string;
  authorities: readonly Readonly<{ capability: string; authority_ref: string; generation: number }>[];
  intents: readonly Readonly<{ request_id: string; claim_id?: string | null }>[];
}

export interface CoeAssessment {
  state: "READY" | "BLOCKED" | "FAIL";
  reasons: readonly string[];
  evidence: CoeAcquisition;
}

export class CoeError extends Error {
  constructor(readonly code: string) { super(code); }
}

const SHA40 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const UTC_SECONDS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const TOP = ["contract", "coverage", "next_cursor", "operational_observation", "outcome_evaluation_targets", "producer_release_identity", "prohibited_activity", "records", "runtime_enforcement", "schema_version", "scope", "source_inventory"];
const COVERAGE = ["client_continuity_required", "cuts", "integrity_reason", "legacy", "page_count", "page_offset", "pagination_complete", "prospective", "record_set_digest", "scoped_count", "snapshot_identity", "state", "unresolved_count", "window"];
const WINDOW = ["assessment_mode", "interval_semantics", "requested_window_end", "requested_window_start", "state", "uncovered_reasons"];
const PROSPECTIVE = ["proof_applicable", "proof_id", "reason", "state"];
const SOURCE = ["cursor_key_profile", "evidence_started_at_normalized", "evidence_started_at_raw", "evidence_started_at_status", "legacy_source_families", "retention_floor_event_seq", "sources", "store_incarnation", "version"];
const RUNTIME = ["configured_auth_state", "cursor_key_profile", "effective_auth_mode", "freshness_identity", "guard_readiness", "logical_runtime_id", "observed_at", "observed_execution_worker_count", "process_start_identity", "reason", "topology_observation_status", "topology_reason", "worker_boot_id"];
const OBSERVATION = ["checkpoint", "coherent", "observation_clock_id", "observation_id", "observed_at", "security_revision_after", "security_revision_before", "topology", "trust"];
const TRUST = ["environment_identity", "reason", "registry_revision", "source_identity", "status"];
const TOPOLOGY = ["execution_worker_count", "execution_worker_ids", "observed_boot_id", "observer_kind", "process_inventory_digest", "reason", "status"];
const CHECKPOINT = ["checkpoint_id", "lineage", "protection_provenance", "range_end", "range_start", "reason", "root", "status"];
const ACTIVITY = ["activity", "count_semantics", "coverage", "dry_run_preparation_count", "emitter_dispositions", "expected_emitter_inventory_digest", "exposure", "integrity_reason", "known_cost_count", "known_zero", "live_publication_attempt_count", "package_proven_exclusions", "pending_cost_count", "provider_attempt_count", "rehearsal_required_emitters", "unattributed_attempt_count", "uninstrumented_emitters", "unknown_cost_count"];
const EMITTER = ["attempt_source", "completion_source", "cost_source", "credential_access_profile", "destinations", "dispatch_boundary_id", "dispatch_source", "disposition", "emitter_id", "entrypoints", "initial_profile_policy", "observation_granularity", "operations", "process_types", "proof_method", "source_symbol"];
const CAPABILITIES = ["editorial.cycle", "editorial.outcome_evaluation", "threads.publish.dry_run"];
const ATTEMPT_FIELDS = ["account_id", "admission_state", "attempt_id", "authenticated_account_id", "authenticated_org_id", "authority_ref", "business_identity", "capability", "claim_identity", "claimed_authority_ref", "claimed_spec_hash", "claimed_threads_generation", "domain_state", "duplicate_of_request_id", "event_id", "event_seq", "event_type", "execution_state", "lifecycle_revision", "material_revision", "occurred_at", "org_id", "payload_hash", "reason_code", "request_fingerprint", "request_id", "requested_account_id_untrusted", "result_identity", "result_json", "result_revision", "source", "spec_hash", "threads_generation", "verified_authority_ref", "verified_spec_hash", "verified_threads_generation"];
const AUTHORITY_FIELDS = ["account_id", "actor", "authority_ref", "capability", "event_id", "event_seq", "event_type", "generation", "occurred_at", "payload_hash", "permit_expires_at", "source", "spec_hash", "state"];
const OUTCOME_TARGET_FIELDS = ["business_identity", "material_revision", "observed_through", "source"];
const OUTCOME_TARGET_SOURCE_FIELDS = ["constants_json", "content_hash", "content_id", "content_version", "cycle_id", "experiment_created_at", "experiment_id", "failure_signal_json", "hypothesis_json", "minimum_sample_json", "observed_through", "source_content_ids_json", "success_signal_json", "test_variable"];
const EDITORIAL_CYCLE_RESULT_FIELDS = ["brief", "config", "content_id", "created_at", "cycle_id", "cycle_key", "draft", "mutated", "source_content_ids", "state", "status", "summary", "updated_at"];
const DRY_RUN_RESULT_FIELDS = ["attempts", "duplicate", "error", "external_publish_id", "mode", "note", "parts_sent", "parts_state", "permalink", "publication_id", "requires_human", "status"];
const OUTCOME_RESULT_FIELDS = ["account_id", "authority_ref", "business_identity", "capability", "claim_identity", "duplicate_of_request_id", "evaluation", "material_revision", "native_domain_state", "original_state", "reason_code", "request_id", "result_identity", "result_revision", "state", "threads_generation"];
const OUTCOME_EVALUATION_FIELDS = ["decision_json", "evidence_count", "evidence_level", "next_decision", "observed_through", "result_summary", "sample_size", "verdict"];
const OUTCOME_DECISION_FIELDS = ["alternative_explanation", "baseline_median", "baseline_snapshot_id", "candidate_metric", "content_hash", "content_id", "evaluation_id", "metric_key", "missing_evidence", "next_evidence_needed", "possible_confounders", "publication_id", "tested_variable"];

export type CoeFieldClass = "A_IMMUTABLE_EQUAL" | "B_CONSERVATIVE" | "C_PAGE_LOCAL";
const fields = (prefix: string, names: readonly string[], classification: CoeFieldClass) => names.map((name) => [`${prefix}.${name}`, classification] as const);
/** Exhaustive schema registry for fixed page fields; records are classified per source and attempt revision. */
export const COE_FIELD_REGISTRY: Readonly<Record<string, CoeFieldClass>> = Object.freeze(Object.fromEntries([
  ...fields("top", TOP, "A_IMMUTABLE_EQUAL"),
  ...fields("coverage", COVERAGE, "B_CONSERVATIVE"),
  ...fields("coverage.window", WINDOW, "B_CONSERVATIVE"),
  ...fields("coverage.prospective", PROSPECTIVE, "B_CONSERVATIVE"),
  ...fields("source_inventory", SOURCE, "A_IMMUTABLE_EQUAL"),
  ...fields("runtime_enforcement", RUNTIME, "B_CONSERVATIVE"),
  ...fields("operational_observation", OBSERVATION, "B_CONSERVATIVE"),
  ...fields("operational_observation.trust", TRUST, "B_CONSERVATIVE"),
  ...fields("operational_observation.topology", TOPOLOGY, "B_CONSERVATIVE"),
  ...fields("operational_observation.checkpoint", CHECKPOINT, "B_CONSERVATIVE"),
  ...fields("prohibited_activity", ACTIVITY, "B_CONSERVATIVE"),
  ...fields("record.operational_attempt_events", ATTEMPT_FIELDS, "A_IMMUTABLE_EQUAL"),
  ...fields("record.operational_authority_events", AUTHORITY_FIELDS, "A_IMMUTABLE_EQUAL"),
  ...fields("outcome_evaluation_target", OUTCOME_TARGET_FIELDS, "A_IMMUTABLE_EQUAL"),
  ...fields("outcome_evaluation_target.source", OUTCOME_TARGET_SOURCE_FIELDS, "A_IMMUTABLE_EQUAL"),
  ["top.records", "C_PAGE_LOCAL"], ["top.next_cursor", "C_PAGE_LOCAL"],
  ["coverage.page_offset", "C_PAGE_LOCAL"], ["coverage.page_count", "C_PAGE_LOCAL"], ["coverage.pagination_complete", "C_PAGE_LOCAL"],
  ["runtime_enforcement.observed_at", "C_PAGE_LOCAL"], ["operational_observation.observation_id", "C_PAGE_LOCAL"], ["operational_observation.observed_at", "C_PAGE_LOCAL"],
  ...["coverage.cuts", "coverage.scoped_count", "coverage.record_set_digest", "coverage.snapshot_identity", "coverage.client_continuity_required", "coverage.window.assessment_mode", "coverage.window.requested_window_start", "coverage.window.requested_window_end", "coverage.window.interval_semantics", "coverage.prospective.proof_id", "coverage.prospective.reason", "prohibited_activity.expected_emitter_inventory_digest", "prohibited_activity.count_semantics", "prohibited_activity.emitter_dispositions", "prohibited_activity.package_proven_exclusions", "prohibited_activity.rehearsal_required_emitters", "prohibited_activity.uninstrumented_emitters", "runtime_enforcement.cursor_key_profile", "runtime_enforcement.freshness_identity", "runtime_enforcement.logical_runtime_id", "runtime_enforcement.process_start_identity", "runtime_enforcement.worker_boot_id", "operational_observation.observation_clock_id", "operational_observation.security_revision_before", "operational_observation.security_revision_after", "operational_observation.trust.environment_identity", "operational_observation.trust.registry_revision", "operational_observation.trust.source_identity", "operational_observation.topology.execution_worker_ids", "operational_observation.topology.observed_boot_id", "operational_observation.topology.observer_kind", "operational_observation.topology.process_inventory_digest", "operational_observation.checkpoint.checkpoint_id", "operational_observation.checkpoint.lineage", "operational_observation.checkpoint.protection_provenance", "operational_observation.checkpoint.range_start", "operational_observation.checkpoint.range_end", "operational_observation.checkpoint.root"].map((path) => [path, "A_IMMUTABLE_EQUAL"] as const),
  ...["coverage.legacy.state", "coverage.legacy.v31_claimed_complete", "coverage.state", "coverage.unresolved_count", "coverage.window.state", "coverage.window.uncovered_reasons", "coverage.prospective.state", "coverage.prospective.proof_applicable"].map((path) => [path, "B_CONSERVATIVE"] as const),
]));
export const COE_B_REDUCTION_RULES = Object.freeze({
  "coverage.legacy": "RECURSIVE", "coverage.legacy.state": "ASSURANCE_MEET", "coverage.legacy.v31_claimed_complete": "AND", "coverage.state": "ASSURANCE_MEET", "coverage.unresolved_count": "MAX", "coverage.window": "RECURSIVE", "coverage.window.state": "ASSURANCE_MEET", "coverage.window.uncovered_reasons": "CANONICAL_UNION", "coverage.prospective": "RECURSIVE", "coverage.prospective.state": "ASSURANCE_MEET", "coverage.prospective.proof_applicable": "AND",
  "runtime_enforcement": "RECURSIVE", "runtime_enforcement.configured_auth_state": "AND", "runtime_enforcement.effective_auth_mode": "AND", "runtime_enforcement.guard_readiness": "AND", "runtime_enforcement.reason": "PRESERVE_ADVERSE", "runtime_enforcement.topology_observation_status": "AND", "runtime_enforcement.topology_reason": "PRESERVE_ADVERSE", "runtime_enforcement.observed_execution_worker_count": "MAX",
  "operational_observation": "RECURSIVE", "operational_observation.coherent": "AND", "operational_observation.trust": "RECURSIVE", "operational_observation.trust.status": "AND", "operational_observation.trust.reason": "PRESERVE_ADVERSE", "operational_observation.topology": "RECURSIVE", "operational_observation.topology.status": "AND", "operational_observation.topology.reason": "PRESERVE_ADVERSE", "operational_observation.topology.execution_worker_count": "MAX", "operational_observation.checkpoint": "RECURSIVE", "operational_observation.checkpoint.status": "AND", "operational_observation.checkpoint.reason": "PRESERVE_ADVERSE",
  "prohibited_activity": "RECURSIVE", "prohibited_activity.coverage": "ASSURANCE_MEET", "prohibited_activity.activity": "ADVERSE_OR", "prohibited_activity.exposure": "ASSURANCE_MEET", "prohibited_activity.known_zero": "AND", "prohibited_activity.known_cost_count": "MAX", "prohibited_activity.unknown_cost_count": "MAX", "prohibited_activity.pending_cost_count": "MAX", "prohibited_activity.provider_attempt_count": "MAX", "prohibited_activity.live_publication_attempt_count": "MAX", "prohibited_activity.dry_run_preparation_count": "MAX", "prohibited_activity.unattributed_attempt_count": "MAX", "prohibited_activity.integrity_reason": "PRESERVE_ADVERSE",
  "coverage.integrity_reason": "PRESERVE_ADVERSE", "coverage.legacy.reason": "PRESERVE_ADVERSE",
} as const);
export const COE_SOURCES = Object.freeze(["operational_authority_events", "operational_attempt_events", "ai_usage_events", "publication_records"]);
export const COE_LEGACY_SOURCE_FAMILIES = Object.freeze([
  "capability_requests", "execution_authorities", "operational_authority_events", "operational_attempt_events", "operational_request_identities_v31", "operational_semantic_work",
  "editorial_cycles", "editorial_experiments", "editorial_evaluations", "content_plans", "content_versions", "ai_usage_events", "ai_usage_outcomes", "ai_cost_adjustments",
  "llm_usage", "writer_canary_calls", "publication_records", "manual_external_posts", "posts", "post_metrics", "account_metrics", "content_metrics", "account_credentials",
  "audit_events", "external_deletion_observations", "external_reconciliation_runs", "research_runs", "benchmark_accounts", "benchmark_posts", "benchmark_analyses",
]);

function object(value: unknown, code = "COE_MALFORMED"): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new CoeError(code);
  return value as Record<string, unknown>;
}

function exact(value: Record<string, unknown>, keys: readonly string[]): void {
  const got = Object.keys(value).sort(); const want = [...keys].sort();
  if (got.length !== want.length || got.some((key, index) => key !== want[index])) throw new CoeError("COE_UNKNOWN_OR_MISSING_FIELD");
}

function onlyKnown(value: Record<string, unknown>, keys: readonly string[]): void {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new CoeError("COE_RESULT_SCHEMA_INVALID");
}

function validateNativeResult(capability: unknown, value: unknown): void {
  const result = object(value, "COE_RESULT_SCHEMA_INVALID");
  if (capability === "editorial.cycle") {
    onlyKnown(result, EDITORIAL_CYCLE_RESULT_FIELDS);
    if (typeof result.cycle_id !== "string" || typeof result.state !== "string" || typeof result.status !== "string" || result.mutated !== false) throw new CoeError("COE_RESULT_SCHEMA_INVALID");
    return;
  }
  if (capability === "threads.publish.dry_run") {
    onlyKnown(result, DRY_RUN_RESULT_FIELDS);
    if (typeof result.publication_id !== "string" || result.mode !== "dry_run" || typeof result.status !== "string" || typeof result.duplicate !== "boolean") throw new CoeError("COE_RESULT_SCHEMA_INVALID");
    return;
  }
  onlyKnown(result, OUTCOME_RESULT_FIELDS);
  if (typeof result.request_id !== "string" || typeof result.state !== "string" || typeof result.native_domain_state !== "string") throw new CoeError("COE_RESULT_SCHEMA_INVALID");
  if (result.evaluation !== undefined) {
    const evaluation = object(result.evaluation, "COE_RESULT_SCHEMA_INVALID"); onlyKnown(evaluation, OUTCOME_EVALUATION_FIELDS);
    if (evaluation.decision_json !== undefined) onlyKnown(object(evaluation.decision_json, "COE_RESULT_SCHEMA_INVALID"), OUTCOME_DECISION_FIELDS);
  }
}

function enumValue(value: unknown, accepted: readonly string[], code: string): string {
  if (typeof value !== "string" || !accepted.includes(value)) throw new CoeError(code);
  return value;
}

function natural(value: unknown, code = "COE_MALFORMED"): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0) throw new CoeError(code);
  return Number(value);
}

export function parseJsonNoDuplicateKeys(raw: string, maximumBytes = 8_000_000, maximumDepth = 64): unknown {
  if (typeof raw !== "string" || Buffer.byteLength(raw, "utf8") > maximumBytes) throw new CoeError("COE_JSON_LIMIT");
  let i = 0; let nodes = 0; const ws = () => { while (/\s/.test(raw[i] ?? "")) i++; };
  const value = (depth = 0): unknown => {
    if (depth > maximumDepth || ++nodes > 200_000) throw new CoeError("COE_JSON_LIMIT");
    ws(); const start = i; const ch = raw[i];
    if (ch === '"') { i++; let escaped = false; while (i < raw.length) { const c = raw[i++]!; if (!escaped && c === '"') return JSON.parse(raw.slice(start, i)); escaped = !escaped && c === "\\"; if (c !== "\\") escaped = false; } throw new CoeError("COE_JSON_INVALID"); }
    if (ch === "[") { i++; const out: unknown[] = []; ws(); if (raw[i] === "]") { i++; return out; } while (true) { out.push(value(depth + 1)); ws(); if (raw[i] === "]") { i++; return out; } if (raw[i++] !== ",") throw new CoeError("COE_JSON_INVALID"); } }
    if (ch === "{") { i++; const out: Record<string, unknown> = {}; const seen = new Set<string>(); ws(); if (raw[i] === "}") { i++; return out; } while (true) { ws(); if (raw[i] !== '"') throw new CoeError("COE_JSON_INVALID"); const key = value(depth + 1); if (typeof key !== "string") throw new CoeError("COE_JSON_INVALID"); if (seen.has(key)) throw new CoeError("COE_DUPLICATE_JSON_KEY"); seen.add(key); ws(); if (raw[i++] !== ":") throw new CoeError("COE_JSON_INVALID"); out[key] = value(depth + 1); ws(); if (raw[i] === "}") { i++; return out; } if (raw[i++] !== ",") throw new CoeError("COE_JSON_INVALID"); } }
    const match = raw.slice(i).match(/^(?:-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/); if (!match) throw new CoeError("COE_JSON_INVALID"); i += match[0].length; return JSON.parse(match[0]);
  };
  const parsed = value(); ws(); if (i !== raw.length) throw new CoeError("COE_JSON_INVALID"); return parsed;
}

function rejectCredentialData(value: unknown, path = "$", key = "", depth = 0): void {
  if (depth > 64) throw new CoeError("COE_JSON_LIMIT");
  if (Array.isArray(value)) { value.forEach((item) => rejectCredentialData(item, `${path}[*]`, "", depth + 1)); return; }
  if (value && typeof value === "object") { for (const [child, item] of Object.entries(value as Record<string, unknown>)) { if (/^(authorization|headers?|password|private_key|client_secret|api_key|access_token|refresh_token)$/i.test(child)) throw new CoeError("COE_SENSITIVE_FIELD"); rejectCredentialData(item, `${path}.*`, child, depth + 1); } return; }
  if (typeof value !== "string" || ["credential_access_profile", "destinations", "entrypoints"].includes(key)) return;
  let decoded = value; try { decoded = decodeURIComponent(value); } catch { /* original value remains authoritative */ }
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bBearer\s+[A-Za-z0-9._~+/-]{8,}|\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|sk-[A-Za-z0-9_-]{8,})\b|\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_.-]{8,}/i.test(decoded)) throw new CoeError("COE_SECRET_VALUE:$");
  try { const url = new URL(decoded); if (url.username || url.password || /hooks\.slack\.com\/services\/|discord(?:app)?\.com\/api\/webhooks\//i.test(url.toString()) || [...url.searchParams.keys()].some((name) => /token|secret|password|key/i.test(name))) throw new CoeError("COE_CREDENTIAL_URL"); } catch (error) { if (error instanceof CoeError) throw error; }
  if ((key === "result_json" || key.endsWith("_json")) && /^[\s]*[\[{]/.test(value)) rejectCredentialData(parseJsonNoDuplicateKeys(value, 1_000_000, 32), "$embedded", "", depth + 1);
}

/** Decode producer-captured diagnostic fixtures without promoting unbound metadata to operational evidence. */
export function decodeCoeFixture(raw: string): CoeAcquisition {
  const page = object(parseJsonNoDuplicateKeys(raw)); exact(page, TOP);
  if (page.contract !== CATFOOD_THREADS_PINS.coe_contract || page.schema_version !== CATFOOD_THREADS_PINS.coe_schema) throw new CoeError("COE_CONTRACT_MISMATCH");
  const coverage = object(page.coverage); exact(coverage, COVERAGE); enumValue(coverage.state, ["COMPLETE", "PARTIAL", "UNKNOWN"], "COE_COVERAGE_UNKNOWN");
  const window = object(coverage.window); exact(window, WINDOW); enumValue(window.state, ["COMPLETE", "PARTIAL", "UNBOUND"], "COE_WINDOW_STATE_UNKNOWN");
  const activity = object(page.prohibited_activity); exact(activity, ACTIVITY); enumValue(activity.coverage, ["COMPLETE", "PARTIAL", "UNKNOWN"], "COE_ACTIVITY_COVERAGE_UNKNOWN"); enumValue(activity.activity, ["ZERO", "NONZERO", "UNKNOWN"], "COE_ACTIVITY_UNKNOWN"); enumValue(activity.exposure, ["NONE", "PENDING", "UNKNOWN", "RESOLVED"], "COE_EXPOSURE_UNKNOWN");
  rejectCredentialData(page);
  const result = { phase: "LIVE_ADMISSION", contract: page.contract, schema_version: page.schema_version, producer_release_identity: page.producer_release_identity, scope: page.scope, source_inventory: page.source_inventory, coverage: page.coverage, prohibited_activity: page.prohibited_activity, runtime_enforcement: page.runtime_enforcement, operational_observation: page.operational_observation, outcome_evaluation_targets: page.outcome_evaluation_targets, records: page.records, pages: [page], page_receipts: [], representation: "CONSUMER_RESERIALIZED", page_count: 1, test_only: true } as unknown as Omit<CoeAcquisition, "digest">;
  return Object.freeze({ ...result, digest: sha256(canonicalJson(result as unknown as Json)) });
}

export function assertFrozenDependencies(scope: CoeScope & { wp1_sha256?: string; operational_boundary_sha256?: string }): void {
  const supplied = {
    threads_sha: scope.threads_sha, release_sha256: scope.threads_release_sha256,
    wp1_sha256: scope.wp1_sha256 ?? CATFOOD_THREADS_PINS.wp1_sha256,
    operational_boundary_sha256: scope.operational_boundary_sha256 ?? CATFOOD_THREADS_PINS.operational_boundary_sha256,
    coe_sha256: scope.coe_sha256, rehearsal_attestation_sha256: scope.rehearsal_attestation_sha256,
    emitter_inventory_sha256: scope.emitter_inventory_sha256, schema: scope.threads_schema,
    schema_fingerprint: scope.threads_schema_fingerprint,
  };
  if (canonicalJson(supplied) !== canonicalJson(FROZEN_DEPENDENCIES)) throw new CoeError("COE_PIN_MISMATCH");
}

function validateWindow(scope: CoeScope, phase: EvidencePhase): void {
  if (!UTC_SECONDS.test(scope.requested_window_start) || !UTC_SECONDS.test(scope.requested_window_end)
    || Date.parse(scope.requested_window_end) <= Date.parse(scope.requested_window_start)
    || (phase === "CLOSED_RUN" && Date.parse(scope.requested_window_end) - Date.parse(scope.requested_window_start) !== 86_400_000)) throw new CoeError("COE_WINDOW_INVALID");
}

function validatePage(raw: unknown, scope: CoeScope, phase: EvidencePhase): Record<string, unknown> {
  const page = object(raw); exact(page, TOP);
  if (page.contract !== CATFOOD_THREADS_PINS.coe_contract || page.schema_version !== CATFOOD_THREADS_PINS.coe_schema) throw new CoeError("COE_CONTRACT_MISMATCH");
  const release = object(page.producer_release_identity, "COE_RELEASE_UNBOUND"); exact(release, ["artifact_sha256", "git_sha"]);
  if (release.git_sha !== scope.threads_sha || release.artifact_sha256 !== scope.threads_release_sha256 || !SHA40.test(String(release.git_sha)) || !SHA256.test(String(release.artifact_sha256))) throw new CoeError("COE_RELEASE_MISMATCH");
  const pageScope = object(page.scope); exact(pageScope, ["account_id", "capability"]);
  if (pageScope.account_id !== scope.account_id || pageScope.capability !== null) throw new CoeError("COE_SCOPE_MISMATCH");
  const inventory = object(page.source_inventory); exact(inventory, SOURCE);
  if (inventory.version !== CATFOOD_THREADS_PINS.source_inventory_version || inventory.cursor_key_profile !== "SINGLE_WORKER" || typeof inventory.store_incarnation !== "string" || !inventory.store_incarnation) throw new CoeError("COE_SOURCE_INVENTORY_MISMATCH");
  if (canonicalJson(inventory.sources as Json) !== canonicalJson(COE_SOURCES as unknown as Json) || canonicalJson(inventory.legacy_source_families as Json) !== canonicalJson(COE_LEGACY_SOURCE_FAMILIES as unknown as Json)) throw new CoeError("COE_SOURCE_INVENTORY_MISMATCH");
  const coverage = object(page.coverage); exact(coverage, COVERAGE);
  enumValue(coverage.state, ["COMPLETE", "PARTIAL", "UNKNOWN"], "COE_COVERAGE_UNKNOWN");
  const window = object(coverage.window); exact(window, WINDOW);
  enumValue(window.state, ["COMPLETE", "PARTIAL", "UNBOUND"], "COE_WINDOW_STATE_UNKNOWN");
  const expectedMode = phase === "LIVE_ADMISSION" ? "LIVE" : "HISTORICAL";
  if (window.assessment_mode !== expectedMode || window.requested_window_start !== scope.requested_window_start || window.requested_window_end !== scope.requested_window_end || window.interval_semantics !== "[start,end)") throw new CoeError(phase === "LIVE_ADMISSION" ? "COE_LIVE_WINDOW_MISMATCH" : "COE_HISTORICAL_WINDOW_MISMATCH");
  if (!Array.isArray(window.uncovered_reasons) || window.uncovered_reasons.some((item) => typeof item !== "string")) throw new CoeError("COE_MALFORMED");
  const prospective = object(coverage.prospective); exact(prospective, PROSPECTIVE);
  enumValue(prospective.state, ["COMPLETE", "PARTIAL", "UNKNOWN"], "COE_PROSPECTIVE_UNKNOWN");
  const legacy = object(coverage.legacy); exact(legacy, ["reason", "state", "v31_claimed_complete"]); enumValue(legacy.state, ["COMPLETE", "PARTIAL", "UNKNOWN"], "COE_LEGACY_STATE_UNKNOWN");
  const cuts = object(coverage.cuts); exact(cuts, ["ai_usage", "attempt", "authority", "publication"]); for (const value of Object.values(cuts)) natural(value);
  const runtime = object(page.runtime_enforcement); exact(runtime, RUNTIME);
  enumValue(runtime.configured_auth_state, ["ON", "OFF"], "COE_TENANT_STATE_UNKNOWN");
  enumValue(runtime.effective_auth_mode, ["TENANT_ENFORCED", "NOT_ENFORCED"], "COE_TENANT_STATE_UNKNOWN");
  enumValue(runtime.guard_readiness, ["READY", "NOT_READY"], "COE_TENANT_STATE_UNKNOWN");
  if (runtime.cursor_key_profile !== "SINGLE_WORKER" || typeof runtime.worker_boot_id !== "string" || typeof runtime.freshness_identity !== "string") throw new CoeError("COE_RUNTIME_IDENTITY_INVALID");
  const observation = object(page.operational_observation); exact(observation, OBSERVATION);
  const trust = object(observation.trust); exact(trust, TRUST); enumValue(trust.status, ["BOUND", "UNBOUND"], "COE_TRUST_STATE_UNKNOWN");
  const topology = object(observation.topology); exact(topology, TOPOLOGY); enumValue(topology.status, ["BOUND", "UNBOUND"], "COE_TOPOLOGY_STATE_UNKNOWN");
  const checkpoint = object(observation.checkpoint); exact(checkpoint, CHECKPOINT); enumValue(checkpoint.status, ["BOUND", "UNBOUND"], "COE_CHECKPOINT_STATE_UNKNOWN");
  const activity = object(page.prohibited_activity); exact(activity, ACTIVITY);
  enumValue(activity.coverage, ["COMPLETE", "PARTIAL", "UNKNOWN"], "COE_ACTIVITY_COVERAGE_UNKNOWN");
  enumValue(activity.activity, ["ZERO", "NONZERO", "UNKNOWN"], "COE_ACTIVITY_UNKNOWN");
  enumValue(activity.exposure, ["NONE", "PENDING", "UNKNOWN", "RESOLVED"], "COE_EXPOSURE_UNKNOWN");
  if (activity.expected_emitter_inventory_digest !== scope.emitter_inventory_sha256) throw new CoeError("COE_EMITTER_INVENTORY_MISMATCH");
  for (const field of ["known_cost_count", "unknown_cost_count", "pending_cost_count", "provider_attempt_count", "live_publication_attempt_count", "dry_run_preparation_count", "unattributed_attempt_count"] as const) natural(activity[field]);
  if (!Array.isArray(activity.emitter_dispositions)) throw new CoeError("COE_EMITTER_INVENTORY_MALFORMED");
  const emitterIds = new Set<string>();
  for (const value of activity.emitter_dispositions) {
    const emitter = object(value); exact(emitter, EMITTER); if (typeof emitter.emitter_id !== "string" || !emitter.emitter_id || emitterIds.has(emitter.emitter_id)) throw new CoeError("COE_EMITTER_INVENTORY_MALFORMED"); emitterIds.add(emitter.emitter_id);
    for (const field of ["entrypoints", "process_types", "destinations", "operations"] as const) if (!Array.isArray(emitter[field]) || (emitter[field] as unknown[]).some((item) => typeof item !== "string")) throw new CoeError("COE_EMITTER_INVENTORY_MALFORMED");
  }
  if (sha256(canonicalJson(activity.emitter_dispositions)) !== activity.expected_emitter_inventory_digest) throw new CoeError("COE_EMITTER_INVENTORY_MISMATCH");
  for (const field of ["package_proven_exclusions", "rehearsal_required_emitters", "uninstrumented_emitters"] as const) if (!Array.isArray(activity[field]) || (activity[field] as unknown[]).some((item) => typeof item !== "string" || !emitterIds.has(item))) throw new CoeError("COE_EMITTER_INVENTORY_MALFORMED");
  if (!Array.isArray(page.records) || !Array.isArray(page.outcome_evaluation_targets)) throw new CoeError("COE_MALFORMED");
  natural(coverage.page_offset); natural(coverage.page_count); natural(coverage.scoped_count); natural(coverage.unresolved_count);
  if (coverage.page_count !== page.records.length || !SHA256.test(String(coverage.record_set_digest)) || !SHA256.test(String(coverage.snapshot_identity)) || typeof coverage.pagination_complete !== "boolean" || coverage.client_continuity_required !== true || (page.next_cursor !== null && typeof page.next_cursor !== "string")) throw new CoeError("COE_PAGINATION_MALFORMED");
  for (const recordValue of page.records) {
    const record = object(recordValue);
    if (!Number.isSafeInteger(record.event_seq) || record.account_id !== scope.account_id || !CAPABILITIES.includes(String(record.capability)) || !["operational_authority_events", "operational_attempt_events"].includes(String(record.source))) throw new CoeError("COE_RECORD_SCOPE_INVALID");
    if (record.source === "operational_attempt_events") {
      exact(record, ATTEMPT_FIELDS);
      if (record.authenticated_account_id !== scope.account_id || ![scope.organization_id, null].includes(record.authenticated_org_id as string | null) || ![scope.organization_id, null].includes(record.org_id as string | null)) throw new CoeError("COE_TENANT_BINDING_MISMATCH");
      enumValue(record.event_type, ["REJECTED_PRECLAIM", "CLAIMED", "REPLAYED", "DUPLICATE", "SUCCEEDED", "FAILED", "UNRESOLVED"], "COE_ATTEMPT_EVENT_UNKNOWN");
      natural(record.lifecycle_revision); if (record.lifecycle_revision === 0) throw new CoeError("COE_LIFECYCLE_REVISION_INVALID");
      if (record.result_json !== null) {
        const result = object(typeof record.result_json === "string" ? parseJsonNoDuplicateKeys(record.result_json, 1_000_000, 32) : record.result_json, "COE_RESULT_SCHEMA_INVALID");
        validateNativeResult(record.capability, result);
      }
    } else exact(record, AUTHORITY_FIELDS);
  }
  for (const targetValue of page.outcome_evaluation_targets) {
    const target = object(targetValue); exact(target, OUTCOME_TARGET_FIELDS);
    if (typeof target.business_identity !== "string" || !target.business_identity || !SHA256.test(String(target.material_revision)) || (target.observed_through !== null && typeof target.observed_through !== "string")) throw new CoeError("COE_OUTCOME_TARGET_INVALID");
    const source = object(target.source); exact(source, OUTCOME_TARGET_SOURCE_FIELDS);
  }
  rejectCredentialData(page);
  return page;
}

function unwrapPage(value: unknown): { parsed: unknown; receipt: Record<string, Json> | null } {
  if (!value || typeof value !== "object" || !("parsed" in value) || !("receipt" in value)) return { parsed: value, receipt: null };
  const envelope = object(value); exact(envelope, ["parsed", "receipt"]); const receipt = object(envelope.receipt);
  exact(receipt, ["body_base64url", "body_sha256", "byte_length", "content_encoding", "content_type", "representation", "source_session_id"]);
  if (receipt.representation !== "AUTHENTICATED_DECODED_BODY" || receipt.content_type !== "application/json" || receipt.content_encoding !== "identity"
    || typeof receipt.body_base64url !== "string" || !/^[A-Za-z0-9_-]+$/.test(receipt.body_base64url) || !SHA256.test(String(receipt.body_sha256))
    || !Number.isSafeInteger(receipt.byte_length) || Number(receipt.byte_length) < 0 || Number(receipt.byte_length) > 512_000 || typeof receipt.source_session_id !== "string" || !receipt.source_session_id) throw new CoeError("COE_RAW_RECEIPT_INVALID");
  const bytes = Buffer.from(receipt.body_base64url, "base64url");
  if (bytes.toString("base64url") !== receipt.body_base64url || bytes.byteLength !== receipt.byte_length) throw new CoeError("COE_RAW_RECEIPT_INVALID");
  let raw: string; try { raw = new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { throw new CoeError("COE_UTF8_INVALID"); }
  if (sha256(raw) !== receipt.body_sha256) throw new CoeError("COE_RAW_BODY_DIGEST_MISMATCH");
  const reparsed = parseJsonNoDuplicateKeys(raw, 512_000, 64);
  if (canonicalJson(reparsed) !== canonicalJson(envelope.parsed)) throw new CoeError("COE_RAW_BODY_PARSE_MISMATCH");
  return { parsed: reparsed, receipt: JSON.parse(canonicalJson(receipt)) as Record<string, Json> };
}

function atPath(value: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => object(current)[key], value);
}

const CROSS_PAGE_IMMUTABLE = Object.freeze([
  "contract", "schema_version", "producer_release_identity", "scope", "source_inventory", "outcome_evaluation_targets",
  "coverage.cuts", "coverage.scoped_count", "coverage.record_set_digest", "coverage.snapshot_identity", "coverage.client_continuity_required",
  "coverage.window.assessment_mode", "coverage.window.requested_window_start", "coverage.window.requested_window_end", "coverage.window.interval_semantics",
  "coverage.prospective.proof_id", "coverage.prospective.reason",
  "prohibited_activity.expected_emitter_inventory_digest", "prohibited_activity.count_semantics", "prohibited_activity.emitter_dispositions",
  "prohibited_activity.package_proven_exclusions", "prohibited_activity.rehearsal_required_emitters", "prohibited_activity.uninstrumented_emitters",
  "runtime_enforcement.cursor_key_profile", "runtime_enforcement.freshness_identity", "runtime_enforcement.logical_runtime_id", "runtime_enforcement.process_start_identity", "runtime_enforcement.worker_boot_id",
  "operational_observation.observation_clock_id", "operational_observation.security_revision_before", "operational_observation.security_revision_after",
  "operational_observation.trust.environment_identity", "operational_observation.trust.registry_revision", "operational_observation.trust.source_identity",
  "operational_observation.topology.execution_worker_ids", "operational_observation.topology.observed_boot_id", "operational_observation.topology.observer_kind", "operational_observation.topology.process_inventory_digest",
  "operational_observation.checkpoint.checkpoint_id", "operational_observation.checkpoint.lineage", "operational_observation.checkpoint.protection_provenance", "operational_observation.checkpoint.range_start", "operational_observation.checkpoint.range_end", "operational_observation.checkpoint.root",
]);

export function acquireCoe(source: CoePageSource, scope: CoeScope, phase: EvidencePhase = "LIVE_ADMISSION"): CoeAcquisition {
  validateWindow(scope, phase);
  assertFrozenDependencies(scope);
  if (scope.tenant_id !== scope.organization_id) throw new CoeError("COE_TENANT_BINDING_MISMATCH");
  const records: Record<string, Json>[] = []; const retainedPages: Record<string, Json>[] = []; const pageReceipts: Record<string, Json>[] = []; let rawComplete = true; let cursor: string | null = null; let first: Record<string, unknown> | null = null; let offset = 0; let pages = 0;
  const cursors = new Set<string>(); const rows = new Set<string>();
  do {
    const request: CoeRequest = { account_id: scope.account_id, capability: null, assessment_mode: phase === "LIVE_ADMISSION" ? "LIVE" : "HISTORICAL", window_start: scope.requested_window_start, window_end: scope.requested_window_end, page_size: 500, cursor };
    const rawPage = unwrapPage(source.operationalEvidence(Object.freeze(request))); const page = validatePage(rawPage.parsed, scope, phase);
    if (rawPage.receipt) pageReceipts.push(rawPage.receipt); else rawComplete = false;
    retainedPages.push(JSON.parse(canonicalJson(page)));
    const coverage = object(page.coverage); const pageRecords = page.records as Record<string, Json>[];
    if (!first) first = page;
    else {
      if (CROSS_PAGE_IMMUTABLE.some((path) => canonicalJson(atPath(page, path)) !== canonicalJson(atPath(first!, path)))) throw new CoeError("COE_SNAPSHOT_SWITCH");
    }
    if (coverage.page_offset !== offset) throw new CoeError("COE_PAGE_DISCONTINUITY");
    for (const record of pageRecords) { const key = `${record.source}:${record.event_seq}`; if (rows.has(key)) throw new CoeError("COE_RECORD_REPEATED"); rows.add(key); records.push(record); }
    offset += pageRecords.length; pages += 1;
    const next = page.next_cursor as string | null;
    if (next !== null && (!next || cursors.has(next))) throw new CoeError("COE_CURSOR_REPEATED");
    if (next) cursors.add(next);
    if (coverage.pagination_complete !== (next === null)) throw new CoeError("COE_PREMATURE_TERMINATION");
    cursor = next;
    if (pages > 100 || records.length > 50_000 || Buffer.byteLength(canonicalJson(retainedPages), "utf8") > 8_000_000 || pageReceipts.reduce((total, receipt) => total + Number(receipt.byte_length), 0) > 8_000_000) throw new CoeError("COE_ACQUISITION_LIMIT");
  } while (cursor !== null);
  const coverage = object(first!.coverage);
  if (records.length !== coverage.scoped_count || sha256(canonicalJson(records as Json)) !== coverage.record_set_digest) throw new CoeError("COE_RECORD_SET_DIGEST_MISMATCH");
  const worse = (left: string, right: string, order: readonly string[]) => order.indexOf(right) > order.indexOf(left) ? right : left;
  const conservative = retainedPages.reduce((value, page) => {
    const nextCoverage = object(page.coverage); const nextWindow = object(nextCoverage.window); const nextProspective = object(nextCoverage.prospective); const nextActivity = object(page.prohibited_activity);
    const nextLegacy = object(nextCoverage.legacy);
    value.coverage = worse(value.coverage, String(nextCoverage.state), ["COMPLETE", "PARTIAL", "UNKNOWN"]);
    value.window = worse(value.window, String(nextWindow.state), ["COMPLETE", "PARTIAL", "UNBOUND"]);
    value.prospective = worse(value.prospective, String(nextProspective.state), ["COMPLETE", "PARTIAL", "UNKNOWN"]);
    value.legacy = worse(value.legacy, String(nextLegacy.state), ["COMPLETE", "PARTIAL", "UNKNOWN"]);
    value.v31Complete &&= nextLegacy.v31_claimed_complete === true;
    if (nextCoverage.state !== "COMPLETE") value.coverageReason = String(nextCoverage.integrity_reason);
    if (nextLegacy.state !== "COMPLETE") value.legacyReason = String(nextLegacy.reason);
    for (const reason of nextWindow.uncovered_reasons as unknown[]) value.uncovered.add(String(reason));
    value.proofApplicable &&= nextProspective.proof_applicable === true;
    if (Number(nextCoverage.unresolved_count) > 0) value.unresolved = Math.max(value.unresolved, Number(nextCoverage.unresolved_count));
    value.activityCoverage = worse(value.activityCoverage, String(nextActivity.coverage), ["COMPLETE", "PARTIAL", "UNKNOWN"]);
    value.activity = worse(value.activity, String(nextActivity.activity), ["ZERO", "UNKNOWN", "NONZERO"]);
    value.exposure = worse(value.exposure, String(nextActivity.exposure), ["NONE", "RESOLVED", "PENDING", "UNKNOWN"]);
    value.knownZero &&= nextActivity.known_zero === true;
    value.pendingCost = Math.max(value.pendingCost, Number(nextActivity.pending_cost_count));
    value.unknownCost = Math.max(value.unknownCost, Number(nextActivity.unknown_cost_count));
    value.unattributed = Math.max(value.unattributed, Number(nextActivity.unattributed_attempt_count));
    value.knownCost = Math.max(value.knownCost, Number(nextActivity.known_cost_count));
    value.providerAttempts = Math.max(value.providerAttempts, Number(nextActivity.provider_attempt_count));
    value.livePublications = Math.max(value.livePublications, Number(nextActivity.live_publication_attempt_count));
    value.dryRuns = Math.max(value.dryRuns, Number(nextActivity.dry_run_preparation_count));
    if (nextActivity.coverage !== "COMPLETE" || nextActivity.activity !== "ZERO" || nextActivity.known_zero !== true) value.activityReason = String(nextActivity.integrity_reason);
    return value;
  }, { coverage: "COMPLETE", window: "COMPLETE", prospective: "COMPLETE", legacy: "COMPLETE", v31Complete: true, coverageReason: null as string | null, legacyReason: null as string | null, activityReason: null as string | null, proofApplicable: true, uncovered: new Set<string>(), unresolved: 0, activityCoverage: "COMPLETE", activity: "ZERO", exposure: "NONE", knownZero: true, pendingCost: 0, unknownCost: 0, unattributed: 0, knownCost: 0, providerAttempts: 0, livePublications: 0, dryRuns: 0 });
  const finalPage = retainedPages.at(-1)!;
  const initialCoverage = object(first!.coverage); const initialActivity = object(first!.prohibited_activity);
  const reducedCoverage = { ...initialCoverage, state: conservative.coverage, integrity_reason: conservative.coverageReason ?? initialCoverage.integrity_reason, legacy: { ...object(initialCoverage.legacy), state: conservative.legacy, v31_claimed_complete: conservative.v31Complete, reason: conservative.legacyReason ?? object(initialCoverage.legacy).reason }, window: { ...object(initialCoverage.window), state: conservative.window, uncovered_reasons: [...conservative.uncovered].sort() }, prospective: { ...object(initialCoverage.prospective), state: conservative.prospective, proof_applicable: conservative.prospective === "COMPLETE" && conservative.proofApplicable }, unresolved_count: conservative.unresolved, page_offset: 0, page_count: records.length, pagination_complete: true };
  const reducedActivity = { ...initialActivity, coverage: conservative.activityCoverage, activity: conservative.activity, exposure: conservative.exposure, integrity_reason: conservative.activityReason ?? initialActivity.integrity_reason, known_zero: conservative.knownZero, pending_cost_count: conservative.pendingCost, unknown_cost_count: conservative.unknownCost, unattributed_attempt_count: conservative.unattributed, known_cost_count: conservative.knownCost, provider_attempt_count: conservative.providerAttempts, live_publication_attempt_count: conservative.livePublications, dry_run_preparation_count: conservative.dryRuns };
  const runtime = structuredClone(first!.runtime_enforcement) as Record<string, unknown>; const observation = structuredClone(first!.operational_observation) as Record<string, unknown>;
  for (const page of retainedPages.slice(1)) {
    const nextRuntime = object(page.runtime_enforcement); const nextObservation = object(page.operational_observation);
    runtime.configured_auth_state = runtime.configured_auth_state === "ON" && nextRuntime.configured_auth_state === "ON" ? "ON" : "OFF";
    runtime.effective_auth_mode = runtime.effective_auth_mode === "TENANT_ENFORCED" && nextRuntime.effective_auth_mode === "TENANT_ENFORCED" ? "TENANT_ENFORCED" : "NOT_ENFORCED";
    runtime.guard_readiness = runtime.guard_readiness === "READY" && nextRuntime.guard_readiness === "READY" ? "READY" : "NOT_READY";
    if (runtime.configured_auth_state !== "ON" || runtime.effective_auth_mode !== "TENANT_ENFORCED" || runtime.guard_readiness !== "READY") runtime.reason = nextRuntime.reason;
    runtime.topology_observation_status = runtime.topology_observation_status === "BOUND" && nextRuntime.topology_observation_status === "BOUND" ? "BOUND" : "UNBOUND";
    if (runtime.topology_observation_status !== "BOUND") runtime.topology_reason = nextRuntime.topology_reason;
    runtime.observed_execution_worker_count = Math.max(Number(runtime.observed_execution_worker_count), Number(nextRuntime.observed_execution_worker_count));
    observation.coherent = observation.coherent === true && nextObservation.coherent === true;
    for (const member of ["trust", "topology", "checkpoint"] as const) {
      const current = object(observation[member]); const next = object(nextObservation[member]);
      current.status = current.status === "BOUND" && next.status === "BOUND" ? "BOUND" : "UNBOUND";
      if (current.status === "UNBOUND") current.reason = String(next.reason ?? current.reason);
      if (member === "topology") current.execution_worker_count = Math.max(Number(current.execution_worker_count), Number(next.execution_worker_count));
    }
  }
  runtime.observed_at = object(finalPage.runtime_enforcement).observed_at; observation.observed_at = object(finalPage.operational_observation).observed_at; observation.observation_id = object(finalPage.operational_observation).observation_id;
  const result = { phase, contract: first!.contract, schema_version: first!.schema_version, producer_release_identity: first!.producer_release_identity, scope: first!.scope, source_inventory: first!.source_inventory, coverage: reducedCoverage, prohibited_activity: reducedActivity, runtime_enforcement: runtime, operational_observation: observation, outcome_evaluation_targets: first!.outcome_evaluation_targets, records, pages: retainedPages, page_receipts: pageReceipts, representation: rawComplete ? "AUTHENTICATED_DECODED_BODY" : "CONSUMER_RESERIALIZED", page_count: pages, test_only: !rawComplete || source.evidence_trust !== "OPERATIONAL" || scope.account_id.startsWith("acct_test") } as unknown as Omit<CoeAcquisition, "digest">;
  return Object.freeze({ ...result, digest: sha256(canonicalJson(result as unknown as Json)) });
}

export function assessCoe(evidence: CoeAcquisition, now: string): CoeAssessment {
  const coverage = evidence.coverage; const window = object(coverage.window); const prospective = object(coverage.prospective); const activity = evidence.prohibited_activity; const runtime = evidence.runtime_enforcement; const observation = evidence.operational_observation; const reasons = new Set<string>();
  if (coverage.state !== "COMPLETE" || prospective.state !== "COMPLETE") reasons.add(`COE_COVERAGE_${String(coverage.state)}`);
  if (window.state !== "COMPLETE") reasons.add(`COE_WINDOW_${String(window.state)}`);
  if ((window.uncovered_reasons as unknown[]).length) reasons.add("COE_UNCOVERED_INTERVAL");
  if (coverage.unresolved_count !== 0) reasons.add("COE_UNRESOLVED_ACTIVITY");
  if (activity.coverage !== "COMPLETE") reasons.add(`COE_ACTIVITY_COVERAGE_${String(activity.coverage)}`);
  if (activity.activity === "NONZERO") reasons.add("COE_PROHIBITED_ACTIVITY_NONZERO"); else if (activity.activity !== "ZERO" || activity.known_zero !== true) reasons.add("COE_PROHIBITED_ACTIVITY_UNKNOWN");
  if (!["NONE", "RESOLVED"].includes(String(activity.exposure))) reasons.add(`COE_EXPOSURE_${String(activity.exposure)}`);
  if (activity.pending_cost_count !== 0 || activity.unknown_cost_count !== 0 || activity.unattributed_attempt_count !== 0) reasons.add("COE_COST_OR_ATTRIBUTION_UNRESOLVED");
  if (runtime.configured_auth_state !== "ON" || runtime.effective_auth_mode !== "TENANT_ENFORCED" || runtime.guard_readiness !== "READY") reasons.add("COE_TENANT_ENFORCEMENT_UNPROVED");
  const observed = Date.parse(String(observation.observed_at)); const at = Date.parse(now);
  if (evidence.phase !== "CLOSED_RUN" && (!Number.isFinite(observed) || !Number.isFinite(at) || observed > at + 5_000 || at - observed > 120_000)) reasons.add("COE_OBSERVATION_STALE");
  const trust = object(observation.trust); const topology = object(observation.topology); const checkpoint = object(observation.checkpoint);
  if (trust.status !== "BOUND") reasons.add("COE_OPERATIONAL_TRUST_UNBOUND");
  if (topology.status !== "BOUND") reasons.add("COE_TOPOLOGY_UNBOUND");
  if (checkpoint.status !== "BOUND") reasons.add("COE_CHECKPOINT_UNBOUND");
  if (observation.coherent !== true || observation.security_revision_before === null || observation.security_revision_after === null || observation.security_revision_before !== observation.security_revision_after) reasons.add("COE_SECURITY_CONTINUITY_UNPROVED");
  if (prospective.proof_applicable !== true || typeof prospective.proof_id !== "string" || !prospective.proof_id) reasons.add("COE_REHEARSAL_PROOF_UNAVAILABLE");
  const knownViolation = reasons.has("COE_PROHIBITED_ACTIVITY_NONZERO");
  return Object.freeze({ state: knownViolation ? "FAIL" : reasons.size ? "BLOCKED" : "READY", reasons: Object.freeze([...reasons].sort()), evidence });
}

/** Removes producer clock noise while retaining every security and snapshot binding. */
export function stableCoeEvidence(evidence: CoeAcquisition): Record<string, Json> {
  const runtime = { ...evidence.runtime_enforcement }; delete runtime.observed_at;
  const observation = { ...evidence.operational_observation }; delete observation.observed_at; delete observation.observation_id;
  return JSON.parse(canonicalJson({
    phase: evidence.phase ?? "LIVE_ADMISSION", contract: evidence.contract, schema_version: evidence.schema_version,
    producer_release_identity: evidence.producer_release_identity, scope: evidence.scope,
    source_inventory: evidence.source_inventory, coverage: evidence.coverage,
    prohibited_activity: evidence.prohibited_activity, runtime_enforcement: runtime,
    operational_observation: observation, outcome_evaluation_targets: evidence.outcome_evaluation_targets,
    records: evidence.records, page_count: evidence.page_count, test_only: evidence.test_only,
  })) as Record<string, Json>;
}

const ATTEMPT_IMMUTABLE = Object.freeze(["account_id", "org_id", "authenticated_account_id", "authenticated_org_id", "capability", "request_id", "request_fingerprint", "claim_identity", "authority_ref", "spec_hash", "threads_generation", "verified_authority_ref", "verified_spec_hash", "verified_threads_generation", "requested_account_id_untrusted", "business_identity", "material_revision"]);
const TERMINAL_EVENTS = new Set(["SUCCEEDED", "FAILED", "UNRESOLVED", "DUPLICATE", "REPLAYED", "REJECTED_PRECLAIM"]);

export function foldProducerAttempts(evidence: Pick<CoeAcquisition, "source_inventory" | "records">): readonly FoldedAttempt[] {
  const incarnation = String(evidence.source_inventory.store_incarnation ?? ""); if (!incarnation) throw new CoeError("COE_STORE_INCARNATION_MISSING");
  const groups = new Map<string, Record<string, Json>[]>();
  for (const record of evidence.records) {
    if (record.source !== "operational_attempt_events") continue;
    const attemptId = String(record.attempt_id ?? ""); if (!attemptId) throw new CoeError("COE_ATTEMPT_ID_MISSING");
    const key = `${incarnation}:${attemptId}`; const rows = groups.get(key) ?? []; rows.push(record); groups.set(key, rows);
  }
  return Object.freeze([...groups.entries()].map(([namespace, unsorted]) => {
    const lifecycle = [...unsorted].sort((left, right) => Number(left.lifecycle_revision) - Number(right.lifecycle_revision));
    const revisions = new Set<number>();
    for (const row of lifecycle) { const revision = natural(row.lifecycle_revision, "COE_LIFECYCLE_REVISION_INVALID"); if (revision === 0 || revisions.has(revision)) throw new CoeError("COE_LIFECYCLE_REVISION_CONFLICT"); revisions.add(revision); }
    if (Number(lifecycle[0]!.lifecycle_revision) !== 1 || lifecycle.some((row, index) => Number(row.lifecycle_revision) !== index + 1)) throw new CoeError("COE_LIFECYCLE_REVISION_GAP");
    const first = lifecycle[0]!;
    for (const row of lifecycle.slice(1)) if (ATTEMPT_IMMUTABLE.some((field) => row[field] !== null && row[field] !== undefined && canonicalJson(row[field]) !== canonicalJson(first[field]))) throw new CoeError("COE_LIFECYCLE_IDENTITY_DRIFT");
    for (let index = 1; index < lifecycle.length; index++) {
      const previous = String(lifecycle[index - 1]!.event_type); const current = String(lifecycle[index]!.event_type);
      const legal = previous === "CLAIMED" ? ["SUCCEEDED", "FAILED", "UNRESOLVED"].includes(current) : previous === "DUPLICATE" && ["DUPLICATE", "FAILED", "UNRESOLVED"].includes(current);
      if (!legal) throw new CoeError("COE_LIFECYCLE_TRANSITION_INVALID");
    }
    const rawTerminal = lifecycle.at(-1)!; const terminalState = String(rawTerminal.event_type);
    if (lifecycle.length > 1 && !TERMINAL_EVENTS.has(terminalState)) throw new CoeError("COE_LIFECYCLE_TERMINAL_INVALID");
    const firstState = String(first.event_type);
    if (!["CLAIMED", "DUPLICATE", "REPLAYED", "REJECTED_PRECLAIM"].includes(firstState)) throw new CoeError("COE_LIFECYCLE_ORIGIN_INVALID");
    if (lifecycle.length > 1 && firstState !== "CLAIMED" && firstState !== "DUPLICATE") throw new CoeError("COE_LIFECYCLE_TRANSITION_INVALID");
    const claimOrigin = firstState === "CLAIMED" ? first : null;
    if (claimOrigin && rawTerminal !== claimOrigin) {
      if ([rawTerminal.claimed_authority_ref, rawTerminal.claimed_spec_hash, rawTerminal.claimed_threads_generation].some((value) => value !== null)) throw new CoeError("COE_TERMINAL_CLAIM_FIELD_PRESENT");
      if (!rawTerminal.verified_authority_ref || !rawTerminal.verified_spec_hash || !Number.isSafeInteger(rawTerminal.verified_threads_generation)) throw new CoeError("COE_TERMINAL_AUTHORITY_MISSING");
    }
    const terminal = { ...rawTerminal };
    for (const field of ATTEMPT_IMMUTABLE) if (terminal[field] === null || terminal[field] === undefined) terminal[field] = first[field] as Json;
    return Object.freeze({ namespace, attempt_id: String(first.attempt_id), first, claim_origin: claimOrigin, terminal, lifecycle: Object.freeze(lifecycle), first_occurred_at: String(first.occurred_at), terminal_occurred_at: String(terminal.occurred_at) });
  }));
}

export function classifyRunAttempts(evidence: Pick<CoeAcquisition, "source_inventory" | "records">, context: RunMembershipContext): readonly AttemptMembershipDecision[] {
  const authorityKeys = new Set(context.authorities.map((item) => `${item.capability}\u0000${item.authority_ref}\u0000${item.generation}`));
  const requestIds = new Set(context.intents.map((item) => item.request_id));
  const claimIds = new Set(context.intents.flatMap((item) => item.claim_id ? [item.claim_id] : []));
  return Object.freeze(foldProducerAttempts(evidence).map((attempt) => {
    const origin = attempt.claim_origin ?? attempt.first; const terminal = attempt.terminal;
    const refs = Object.freeze(attempt.lifecycle.map((row) => String(row.event_id)));
    const linkedIntent = requestIds.has(String(origin.request_id)) || claimIds.has(String(origin.claim_identity));
    const linkedAuthority = origin.account_id === context.account_id && origin.verified_spec_hash === context.spec_hash
      && authorityKeys.has(`${String(origin.capability)}\u0000${String(origin.verified_authority_ref)}\u0000${Number(origin.verified_threads_generation)}`);
    if (linkedIntent || linkedAuthority) return Object.freeze({ namespace: attempt.namespace, membership: "IN_SCOPE", reason: linkedIntent && linkedAuthority ? "RUN_INTENT_AND_AUTHORITY" : linkedIntent ? "RUN_INTENT_IDENTITY" : "RUN_AUTHORITY_SCOPE", source_refs: refs, attempt });
    const terminalAt = Date.parse(attempt.terminal_occurred_at); const beforeWindow = Number.isFinite(terminalAt) && terminalAt < Date.parse(context.window_start);
    const finalized = TERMINAL_EVENTS.has(String(terminal.event_type)) && !["UNRESOLVED"].includes(String(terminal.event_type));
    const foreignBinding = origin.verified_spec_hash !== context.spec_hash && !context.authorities.some((item) => item.authority_ref === origin.verified_authority_ref && item.generation === origin.verified_threads_generation);
    if (beforeWindow && finalized && foreignBinding) return Object.freeze({ namespace: attempt.namespace, membership: "PROVEN_OUT_OF_SCOPE", reason: "FINALIZED_PRE_WINDOW_FOREIGN_BINDING", source_refs: refs, attempt });
    return Object.freeze({ namespace: attempt.namespace, membership: "UNRESOLVED_MEMBERSHIP", reason: "RUN_MEMBERSHIP_NOT_PROVEN", source_refs: refs, attempt });
  }));
}

function invocationProvesNullOrg(binding: ProtectedInvocationBinding | undefined, work: { account_id: string; capability: string; authority_ref: string; generation: number }, specHash: string, organizationId: string): boolean {
  return !!binding && !!binding.receipt_id && !!binding.source_session_id && !!binding.principal_ref && !!binding.credential_version_ref && !!binding.authority_event_id && !!binding.authority_actor && !!binding.authority_occurred_at
    && binding.organization_id === organizationId && binding.account_id === work.account_id && binding.capability === work.capability
    && binding.authority_ref === work.authority_ref && binding.spec_hash === specHash && binding.generation === work.generation;
}

export function verifyGovernedWork(evidence: CoeAcquisition, work: {
  account_id: string; capability: string; claim_id: string; request_id: string;
  authority_ref: string; generation: number; business_identity: string;
  material_revision: string; domain_result: Record<string, Json>; invocation_receipt?: ProtectedInvocationBinding;
}, specHash: string, organizationId: string): GovernedWorkDecision {
  let attempts: readonly FoldedAttempt[]; try { attempts = foldProducerAttempts(evidence); } catch (error) { return Object.freeze({ disposition: "FAIL", authoritative_state: "UNRESOLVED", credit_eligible: false, reason: error instanceof CoeError ? error.code : "COE_LIFECYCLE_INVALID", request_id: work.request_id, claim_id: work.claim_id, source_ref: null, result_ref: null }); }
  const matching = attempts.filter((attempt) => attempt.first.claim_identity === work.claim_id || attempt.first.request_id === work.request_id);
  if (matching.length !== 1) return Object.freeze({ disposition: "BLOCKED", authoritative_state: "MISSING", credit_eligible: false, reason: matching.length ? "COE_GOVERNED_WORK_AMBIGUOUS" : "COE_GOVERNED_WORK_MISSING", request_id: work.request_id, claim_id: work.claim_id, source_ref: null, result_ref: null });
  const terminal = matching[0]!.terminal;
  const origin = matching[0]!.claim_origin ?? matching[0]!.first;
  let result: unknown = terminal.result_json;
  if (typeof result === "string") try { result = parseJsonNoDuplicateKeys(result, 1_000_000, 32); rejectCredentialData(result); } catch { return Object.freeze({ disposition: "FAIL", authoritative_state: "UNRESOLVED", credit_eligible: false, reason: "COE_GOVERNED_RESULT_MALFORMED", request_id: work.request_id, claim_id: work.claim_id, source_ref: String(terminal.event_id ?? terminal.attempt_id ?? ""), result_ref: typeof terminal.result_identity === "string" ? terminal.result_identity : null }); }
  const nullOrg = terminal.authenticated_org_id === null && terminal.org_id === null;
  const authorityEvent = nullOrg && work.invocation_receipt ? evidence.records.find((record) => record.source === "operational_authority_events" && record.event_id === work.invocation_receipt!.authority_event_id && record.actor === work.invocation_receipt!.authority_actor && record.occurred_at === work.invocation_receipt!.authority_occurred_at && record.event_type === "GRANTED" && record.account_id === work.account_id && record.capability === work.capability && record.authority_ref === work.authority_ref && record.spec_hash === specHash && record.generation === work.generation) : null;
  if (terminal.account_id !== work.account_id || terminal.authenticated_account_id !== work.account_id || !(nullOrg ? invocationProvesNullOrg(work.invocation_receipt, work, specHash, organizationId) : terminal.authenticated_org_id === organizationId && terminal.org_id === organizationId)
    || terminal.capability !== work.capability || terminal.claim_identity !== work.claim_id || terminal.authority_ref !== work.authority_ref || terminal.verified_authority_ref !== work.authority_ref
    || terminal.spec_hash !== specHash || terminal.verified_spec_hash !== specHash || terminal.threads_generation !== work.generation || terminal.verified_threads_generation !== work.generation
    || terminal.business_identity !== work.business_identity || terminal.material_revision !== work.material_revision || (nullOrg && !authorityEvent)
    || (matching[0]!.claim_origin && (origin.claimed_authority_ref !== work.authority_ref || origin.claimed_spec_hash !== specHash || origin.claimed_threads_generation !== work.generation))) return Object.freeze({ disposition: "FAIL", authoritative_state: "UNRESOLVED", credit_eligible: false, reason: "COE_GOVERNED_WORK_IDENTITY_MISMATCH", request_id: work.request_id, claim_id: work.claim_id, source_ref: String(terminal.event_id ?? terminal.attempt_id ?? ""), result_ref: typeof terminal.result_identity === "string" ? terminal.result_identity : null });
  const state = String(terminal.event_type);
  const base = { request_id: work.request_id, claim_id: work.claim_id, source_ref: String(terminal.event_id ?? terminal.attempt_id ?? ""), result_ref: typeof terminal.result_identity === "string" ? terminal.result_identity : null };
  if (["DUPLICATE", "REPLAYED"].includes(state) || terminal.duplicate_of_request_id !== null) return Object.freeze({ ...base, disposition: "ZERO", authoritative_state: state === "REPLAYED" ? "REPLAYED" : "DUPLICATE", credit_eligible: false, reason: `COE_GOVERNED_${state === "REPLAYED" ? "REPLAYED" : "DUPLICATE"}` } as GovernedWorkDecision);
  if (state === "FAILED") return Object.freeze({ ...base, disposition: "FAIL", authoritative_state: "FAILED", credit_eligible: false, reason: "COE_GOVERNED_WORK_FAILED" } as GovernedWorkDecision);
  if (state === "REJECTED_PRECLAIM") return Object.freeze({ ...base, disposition: "ZERO", authoritative_state: "REJECTED_PRECLAIM", credit_eligible: false, reason: "COE_GOVERNED_PRECLAIM_REJECTED" } as GovernedWorkDecision);
  if (state !== "SUCCEEDED" || terminal.execution_state !== "SUCCEEDED" || terminal.admission_state !== "ADMITTED") return Object.freeze({ ...base, disposition: "BLOCKED", authoritative_state: "UNRESOLVED", credit_eligible: false, reason: "COE_GOVERNED_WORK_UNRESOLVED" } as GovernedWorkDecision);
  if (typeof terminal.result_identity !== "string" || !terminal.result_identity || canonicalJson(result as Json) !== canonicalJson(work.domain_result as Json)) return Object.freeze({ ...base, disposition: "FAIL", authoritative_state: "UNRESOLVED", credit_eligible: false, reason: "COE_GOVERNED_RESULT_MISMATCH" } as GovernedWorkDecision);
  const native = object(result); let nativeIdentity: unknown;
  if (work.capability === "editorial.cycle") nativeIdentity = native.cycle_id;
  else if (work.capability === "threads.publish.dry_run") nativeIdentity = native.publication_id;
  else {
    const evaluation = object(native.evaluation ?? {}); const decision = object(evaluation.decision_json ?? {});
    nativeIdentity = native.result_identity ?? decision.evaluation_id;
  }
  if (nativeIdentity !== undefined && nativeIdentity !== terminal.result_identity) return Object.freeze({ ...base, disposition: "FAIL", authoritative_state: "UNRESOLVED", credit_eligible: false, reason: "COE_GOVERNED_NATIVE_IDENTITY_MISMATCH" } as GovernedWorkDecision);
  if (work.capability === "editorial.outcome_evaluation") {
    const target = evidence.outcome_evaluation_targets.find((candidate) => candidate.business_identity === work.business_identity && candidate.material_revision === work.material_revision);
    if (!target || target.observed_through !== terminal.result_revision) return Object.freeze({ ...base, disposition: "BLOCKED", authoritative_state: "UNRESOLVED", credit_eligible: false, reason: "COE_OUTCOME_TARGET_UNBOUND" } as GovernedWorkDecision);
  }
  return Object.freeze({ ...base, disposition: "CREDIT", authoritative_state: "SUCCEEDED", credit_eligible: true, reason: "COE_GOVERNED_WORK_QUALIFIED" } as GovernedWorkDecision);
}

export function governedEvidenceReasons(evidence: CoeAcquisition): readonly string[] {
  const reasons = new Set<string>();
  for (const attempt of foldProducerAttempts(evidence)) {
    if (attempt.terminal.event_type === "FAILED") reasons.add("COE_GOVERNED_WORK_FAILED");
    if (["CLAIMED", "UNRESOLVED"].includes(String(attempt.terminal.event_type))) reasons.add("COE_GOVERNED_WORK_UNRESOLVED");
  }
  return Object.freeze([...reasons].sort());
}

export function validateOutcomeEvaluationRequest(value: OutcomeEvaluationRequest): Readonly<OutcomeEvaluationRequest> {
  const row = object(value); const required = ["account_id", "authority_ref", "capability", "expected_material_revision", "expected_release_git_sha", "expected_threads_generation", "experiment_id", "request_id", "runtime_observation_id", "spec_hash"];
  const allowed = value.observed_through === undefined ? required : [...required, "observed_through"];
  exact(row, allowed);
  if (value.capability !== "editorial.outcome_evaluation" || !value.account_id || !value.request_id || !value.experiment_id || !value.authority_ref || !SHA256.test(value.expected_material_revision) || !SHA256.test(value.spec_hash) || !Number.isSafeInteger(value.expected_threads_generation) || value.expected_threads_generation <= 0 || !/^\d{1,12}\.[0-9a-f]{64}$/.test(value.runtime_observation_id) || !SHA40.test(value.expected_release_git_sha)) throw new CoeError("OUTCOME_REQUEST_INVALID");
  return Object.freeze({ ...value });
}
