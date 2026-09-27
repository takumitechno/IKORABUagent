import { canonicalJson, sha256, type Json } from "./catfood-harness";

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

export interface CoeRequest {
  account_id: string;
  capability: null;
  assessment_mode: "LIVE";
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
  operationalEvidence(request: Readonly<CoeRequest>): unknown;
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
  page_count: number;
  test_only: boolean;
  digest: string;
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
const CAPABILITIES = ["editorial.cycle", "editorial.outcome_evaluation", "threads.publish.dry_run"];
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

function enumValue(value: unknown, accepted: readonly string[], code: string): string {
  if (typeof value !== "string" || !accepted.includes(value)) throw new CoeError(code);
  return value;
}

function natural(value: unknown, code = "COE_MALFORMED"): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0) throw new CoeError(code);
  return Number(value);
}

function validateWindow(scope: CoeScope): void {
  if (!UTC_SECONDS.test(scope.requested_window_start) || !UTC_SECONDS.test(scope.requested_window_end)
    || Date.parse(scope.requested_window_end) - Date.parse(scope.requested_window_start) !== 86_400_000) throw new CoeError("COE_WINDOW_INVALID");
}

function validatePage(raw: unknown, scope: CoeScope): Record<string, unknown> {
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
  if (window.assessment_mode !== "LIVE" || window.requested_window_start !== scope.requested_window_start || window.requested_window_end !== scope.requested_window_end || window.interval_semantics !== "[start,end)") throw new CoeError("COE_LIVE_WINDOW_MISMATCH");
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
  if (!Array.isArray(page.records) || !Array.isArray(page.outcome_evaluation_targets)) throw new CoeError("COE_MALFORMED");
  natural(coverage.page_offset); natural(coverage.page_count); natural(coverage.scoped_count); natural(coverage.unresolved_count);
  if (coverage.page_count !== page.records.length || !SHA256.test(String(coverage.record_set_digest)) || !SHA256.test(String(coverage.snapshot_identity)) || typeof coverage.pagination_complete !== "boolean" || coverage.client_continuity_required !== true || (page.next_cursor !== null && typeof page.next_cursor !== "string")) throw new CoeError("COE_PAGINATION_MALFORMED");
  for (const recordValue of page.records) {
    const record = object(recordValue);
    if (!Number.isSafeInteger(record.event_seq) || record.account_id !== scope.account_id || !CAPABILITIES.includes(String(record.capability)) || !["operational_authority_events", "operational_attempt_events"].includes(String(record.source))) throw new CoeError("COE_RECORD_SCOPE_INVALID");
    if (record.source === "operational_attempt_events") {
      if (record.authenticated_account_id !== scope.account_id || record.authenticated_org_id !== scope.organization_id || record.org_id !== scope.organization_id) throw new CoeError("COE_TENANT_BINDING_MISMATCH");
      enumValue(record.event_type, ["REJECTED_PRECLAIM", "CLAIMED", "REPLAYED", "DUPLICATE", "SUCCEEDED", "FAILED", "UNRESOLVED"], "COE_ATTEMPT_EVENT_UNKNOWN");
    }
  }
  return page;
}

export function acquireCoe(source: CoePageSource, scope: CoeScope): CoeAcquisition {
  validateWindow(scope);
  if (scope.threads_sha !== CATFOOD_THREADS_PINS.threads_sha || scope.threads_release_sha256 !== CATFOOD_THREADS_PINS.release_sha256 || scope.threads_schema !== CATFOOD_THREADS_PINS.schema || scope.threads_schema_fingerprint !== CATFOOD_THREADS_PINS.schema_fingerprint || scope.coe_sha256 !== CATFOOD_THREADS_PINS.coe_sha256 || scope.rehearsal_attestation_sha256 !== CATFOOD_THREADS_PINS.rehearsal_attestation_sha256 || scope.emitter_inventory_sha256 !== CATFOOD_THREADS_PINS.emitter_inventory_sha256) throw new CoeError("COE_PIN_MISMATCH");
  if (scope.tenant_id !== scope.organization_id) throw new CoeError("COE_TENANT_BINDING_MISMATCH");
  const records: Record<string, Json>[] = []; let cursor: string | null = null; let first: Record<string, unknown> | null = null; let offset = 0; let pages = 0;
  const cursors = new Set<string>();
  do {
    const request: CoeRequest = { account_id: scope.account_id, capability: null, assessment_mode: "LIVE", window_start: scope.requested_window_start, window_end: scope.requested_window_end, page_size: 500, cursor };
    const page = validatePage(source.operationalEvidence(Object.freeze(request)), scope);
    const coverage = object(page.coverage); const pageRecords = page.records as Record<string, Json>[];
    if (!first) first = page;
    else {
      const initialCoverage = object(first.coverage);
      const stable = ["record_set_digest", "snapshot_identity", "scoped_count", "cuts"].every((key) => canonicalJson(coverage[key] as Json) === canonicalJson(initialCoverage[key] as Json));
      const stableTop = ["scope", "source_inventory", "producer_release_identity", "runtime_enforcement", "operational_observation", "prohibited_activity"].every((key) => canonicalJson(page[key] as Json) === canonicalJson(first![key] as Json));
      if (!stable || !stableTop) throw new CoeError("COE_SNAPSHOT_SWITCH");
    }
    if (coverage.page_offset !== offset) throw new CoeError("COE_PAGE_DISCONTINUITY");
    records.push(...pageRecords); offset += pageRecords.length; pages += 1;
    const next = page.next_cursor as string | null;
    if (next !== null && (!next || cursors.has(next))) throw new CoeError("COE_CURSOR_REPEATED");
    if (next) cursors.add(next);
    if (coverage.pagination_complete !== (next === null)) throw new CoeError("COE_PREMATURE_TERMINATION");
    cursor = next;
    if (pages > 10_000) throw new CoeError("COE_PAGE_LIMIT");
  } while (cursor !== null);
  const coverage = object(first!.coverage);
  if (records.length !== coverage.scoped_count || sha256(canonicalJson(records as Json)) !== coverage.record_set_digest) throw new CoeError("COE_RECORD_SET_DIGEST_MISMATCH");
  const result = { contract: first!.contract, schema_version: first!.schema_version, producer_release_identity: first!.producer_release_identity, scope: first!.scope, source_inventory: first!.source_inventory, coverage: { ...coverage, page_offset: 0, page_count: records.length, pagination_complete: true }, prohibited_activity: first!.prohibited_activity, runtime_enforcement: first!.runtime_enforcement, operational_observation: first!.operational_observation, outcome_evaluation_targets: first!.outcome_evaluation_targets, records, page_count: pages, test_only: scope.account_id.startsWith("acct_test") } as unknown as Omit<CoeAcquisition, "digest">;
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
  if (!Number.isFinite(observed) || !Number.isFinite(at) || observed > at + 5_000 || at - observed > 300_000) reasons.add("COE_OBSERVATION_STALE");
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
    contract: evidence.contract, schema_version: evidence.schema_version,
    producer_release_identity: evidence.producer_release_identity, scope: evidence.scope,
    source_inventory: evidence.source_inventory, coverage: evidence.coverage,
    prohibited_activity: evidence.prohibited_activity, runtime_enforcement: runtime,
    operational_observation: observation, outcome_evaluation_targets: evidence.outcome_evaluation_targets,
    records: evidence.records, page_count: evidence.page_count, test_only: evidence.test_only,
  })) as Record<string, Json>;
}

export function verifyGovernedWork(evidence: CoeAcquisition, work: {
  account_id: string; capability: string; claim_id: string; request_id: string;
  authority_ref: string; generation: number; business_identity: string;
  material_revision: string; domain_result: Record<string, Json>;
}, specHash: string, organizationId: string): boolean {
  const matching = evidence.records.filter((record) => record.source === "operational_attempt_events" && record.request_id === work.request_id);
  if (!matching.length) throw new CoeError("COE_GOVERNED_WORK_MISSING");
  const terminal = matching.at(-1)!;
  const result = typeof terminal.result_json === "string" ? (() => { try { return JSON.parse(terminal.result_json); } catch { throw new CoeError("COE_GOVERNED_RESULT_MALFORMED"); } })() : terminal.result_json;
  if (terminal.account_id !== work.account_id || terminal.authenticated_account_id !== work.account_id || terminal.authenticated_org_id !== organizationId || terminal.org_id !== organizationId
    || terminal.capability !== work.capability || terminal.claim_identity !== work.claim_id || terminal.authority_ref !== work.authority_ref || terminal.verified_authority_ref !== work.authority_ref
    || terminal.spec_hash !== specHash || terminal.verified_spec_hash !== specHash || terminal.threads_generation !== work.generation || terminal.verified_threads_generation !== work.generation
    || terminal.business_identity !== work.business_identity || terminal.material_revision !== work.material_revision) throw new CoeError("COE_GOVERNED_WORK_NOT_ELIGIBLE");
  if (terminal.event_type !== "SUCCEEDED" || terminal.execution_state !== "SUCCEEDED" || terminal.admission_state !== "ADMITTED" || terminal.duplicate_of_request_id !== null) return false;
  if (typeof terminal.result_identity !== "string" || !terminal.result_identity || canonicalJson(result as Json) !== canonicalJson(work.domain_result as Json)) throw new CoeError("COE_GOVERNED_RESULT_MISMATCH");
  return true;
}

export function validateOutcomeEvaluationRequest(value: OutcomeEvaluationRequest): Readonly<OutcomeEvaluationRequest> {
  const row = object(value); const required = ["account_id", "authority_ref", "capability", "expected_material_revision", "expected_release_git_sha", "expected_threads_generation", "experiment_id", "request_id", "runtime_observation_id", "spec_hash"];
  const allowed = value.observed_through === undefined ? required : [...required, "observed_through"];
  exact(row, allowed);
  if (value.capability !== "editorial.outcome_evaluation" || !value.account_id || !value.request_id || !value.experiment_id || !value.authority_ref || !SHA256.test(value.expected_material_revision) || !SHA256.test(value.spec_hash) || !Number.isSafeInteger(value.expected_threads_generation) || value.expected_threads_generation <= 0 || !/^\d{1,12}\.[0-9a-f]{64}$/.test(value.runtime_observation_id) || !SHA40.test(value.expected_release_git_sha)) throw new CoeError("OUTCOME_REQUEST_INVALID");
  return Object.freeze({ ...value });
}
