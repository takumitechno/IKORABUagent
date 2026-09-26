import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const CATFOOD_IKORABU_BASE = "e2db047385ef3262786cc009c3c50d87a06dcde8";
export const CATFOOD_THREADS_SHA = "f15c9235ddd62c003b8105c2a640d81defa4fb83";
export const CATFOOD_WP1_CONTRACT_SHA256 = "14ed73d33a02b3f8877a3045d226f23b7d9e7686f9dc2c8ef595aeae934fa3dc";
export const CATFOOD_BOUNDARY_SHA256 = "57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf";
export const CATFOOD_THREADS_RELEASE_SHA256 = "799344a0a0d4a42ca160e5199d4910f7e6227836b17b9ff9a2b3a90202394d98";
export const CATFOOD_COMBINED_FIXTURE_SHA256 = "599ae161626a23dbc3db2422239a5da937ab72ef152d7605ceafbb879b951ad7";
export const CATFOOD_TARGET_SCHEMA = 30;
export const CATFOOD_INITIAL_CAPABILITIES = Object.freeze([
  "editorial.cycle",
  "editorial.outcome_evaluation",
  "threads.publish.dry_run",
] as const);
export const CATFOOD_NIGHT_STATE = "UNEXERCISED_EXCLUDED" as const;
export const CATFOOD_EVALUATOR_VERSION = "catfood-acceptance.v1";
export const CATFOOD_BOUNDARY_FIXTURE_SHA256 = Object.freeze({
  "operational_boundary_v1_positive.json": "43c1d7deea0f558bcbf590fbddc343edebc8e09fdc54b6661d0e974dd55897a7",
  "operational_boundary_v1_negative.json": "53b4bd8ec9b55bc887c1b1fc785ae58d2b58687de88d996995701141e95f16ff",
  "operational_boundary_v1_negative_active_stop.json": "94b1fa204cd676ecd010c2292384ca70fc7a0c239284ece504838d7c82e4849b",
  "operational_boundary_v1_negative_corrupt_schema.json": "ce68c30580c6bb460b41919d32a48701fec321ba0e3472c13bb6f065522fd59c",
  "operational_boundary_v1_negative_expired_authority.json": "e4d89611bbe13eb05382e378b7dacaf741ce24566797c77e398e349e3c799901",
  "operational_boundary_v1_negative_future_schema.json": "e50509c21815c5749f567edc72ea9e09a7c9702af4b7c4685daf82e67af9b6e0",
  "operational_boundary_v1_negative_in_flight.json": "bcc62fa5dfe5ca163818c5470e0343782f8e3657dcbeb15731bfb32016b5134b",
  "operational_boundary_v1_negative_missing_authority.json": "69fa2c70bf7330b9ece961be8eedb18d0e00078f58267e2074b6e7d1719d0fe7",
  "operational_boundary_v1_negative_revoked_authority.json": "877587592d1d4f76ee3667ea0915d7e4af3836b7d93055e4350e522ea2589dd8",
  "operational_boundary_v1_negative_tenant_binding_missing.json": "9e56794bea28b8fea0ed5b9969789d6ef5bcac563f32e68002447ad4a8131ee7",
  "operational_boundary_v1_negative_unsupported_capability.json": "33f9d0e86adda5de6628335413d937bde1670a863a79758b1f6a6b82c53b57de",
});

export type CatfoodCapability = typeof CATFOOD_INITIAL_CAPABILITIES[number];
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type CostState = "NOT_APPLICABLE" | "KNOWN_ZERO" | "UNKNOWN" | "KNOWN_NONZERO";
export type LifecycleState = "CREATED" | "PREFLIGHT" | "READY" | "RUNNING" | "DEGRADED" | "PAUSED" | "DRAINING" | "COMPLETED" | "ABORTED";
export type AcceptanceState = "NOT_EVALUATED" | "PASS" | "FAIL" | "BLOCKED";

const SHA256 = /^[0-9a-f]{64}$/;
const SHA40 = /^[0-9a-f]{40}$/;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const ACCOUNT = /^acct_[A-Za-z0-9_-]{1,128}$/;
const SECRET = /(?:bearer\s+|access[_-]?token|oauth[_-]?token|api[_-]?key|client[_-]?secret|\bsk-[A-Za-z0-9_-]{8,})/i;
const TOP_LEVEL_BOUNDARY = [
  "account_id", "authority_state", "blocked_reasons", "boundary_version", "canonical_sha256",
  "capability", "effective_safety_controls", "enabled_capabilities", "execution_state",
  "fencing_generation", "governed_in_flight", "migration_provenance_digest", "observed_at",
  "org_tenant_binding", "permit_expires_at", "producer_release_identity", "schema_fingerprint",
  "schema_readiness", "schema_version", "source_evidence", "stop_acknowledgement",
  "unsupported_capability",
] as const;
const BLOCKED_REASONS = new Set([
  "account_not_active", "authority_expired", "authority_expiry_invalid", "authority_missing",
  "authority_revoked", "future_schema", "migration_history_gap", "migration_history_missing",
  "migration_provenance_conflict", "migration_provenance_incomplete", "migration_provenance_missing",
  "migration_provenance_unverified", "migration_schema_fingerprint_mismatch",
  "release_identity_unavailable", "runtime_schema_incompatible", "safety_control_inhibited",
  "schema_definition_mismatch", "schema_migration_required", "schema_version_unknown",
  "tenant_binding_conflict", "tenant_binding_missing", "unsupported_capability",
]);

export class CatfoodError extends Error {
  constructor(readonly code: string, message = code) { super(message); }
}

function object(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new CatfoodError("CONTRACT_INVALID", `${field} must be an object`);
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) throw new CatfoodError("CONTRACT_INVALID", `${field} must be plain data`);
  return value as Record<string, unknown>;
}

function exact(value: Record<string, unknown>, keys: readonly string[], field: string): void {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new CatfoodError("CONTRACT_INVALID", `${field} fields do not match the frozen contract`);
  }
}

function string(value: unknown, field: string, nullable = false): string | null {
  if (nullable && value === null) return null;
  if (typeof value !== "string" || !value.length || SECRET.test(value)) throw new CatfoodError("CONTRACT_INVALID", `${field} is invalid`);
  return value;
}

function integer(value: unknown, field: string, minimum = 0, nullable = false): number | null {
  if (nullable && value === null) return null;
  if (!Number.isSafeInteger(value) || Number(value) < minimum) throw new CatfoodError("CONTRACT_INVALID", `${field} is invalid`);
  return Number(value);
}

function bool(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") throw new CatfoodError("CONTRACT_INVALID", `${field} is invalid`);
  return value;
}

function oneOf<T extends string>(value: unknown, field: string, values: readonly T[]): T {
  if (typeof value !== "string" || !values.includes(value as T)) throw new CatfoodError("CONTRACT_INVALID", `${field} is not recognized`);
  return value as T;
}

function timestamp(value: unknown, field: string, nullable = false): string | null {
  const text = string(value, field, nullable);
  if (text === null) return null;
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(text) || Number.isNaN(Date.parse(text))) throw new CatfoodError("CONTRACT_INVALID", `${field} is not an aware timestamp`);
  return text;
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) throw new CatfoodError("CONTRACT_INVALID", `${field} must be an array`);
  return value.map((item, index) => string(item, `${field}[${index}]`) as string);
}

function jsonValue(value: unknown, field = "value"): Json {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    if (typeof value === "string" && SECRET.test(value)) throw new CatfoodError("SECRET_REJECTED", `${field} contains secret material`);
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.map((item, index) => jsonValue(item, `${field}[${index}]`));
  const row = object(value, field);
  const result: Record<string, Json> = {};
  for (const key of Object.keys(row).sort()) {
    if (SECRET.test(key)) throw new CatfoodError("SECRET_REJECTED", `${field}.${key} is forbidden`);
    result[key] = jsonValue(row[key], `${field}.${key}`);
  }
  return result;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(jsonValue(value));
}

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function canonicalSha256(value: unknown): string { return sha256(canonicalJson(value)); }

function validateCoverage(value: unknown, field: string): "complete" | "partial" | "unknown" {
  return oneOf(value, field, ["complete", "partial", "unknown"] as const);
}

function validateRunner(value: unknown, index: number): void {
  const row = object(value, `source_evidence.runner_heartbeats[${index}]`);
  exact(row, ["age_seconds", "expected", "healthy", "last_run_at", "run_status", "runner_name", "state"], "runner heartbeat");
  oneOf(row.runner_name, "runner_name", ["insights", "outcome", "night_batch"] as const);
  oneOf(row.state, "runner state", ["missing", "future", "fresh", "stale", "invalid"] as const);
  if (row.run_status !== null) oneOf(row.run_status, "run_status", ["succeeded", "failed"] as const);
  timestamp(row.last_run_at, "last_run_at", true);
  integer(row.age_seconds, "age_seconds", 0, true);
  if (row.expected !== "unknown") throw new CatfoodError("CONTRACT_INVALID", "expected must remain unknown");
  bool(row.healthy, "healthy");
}

function validateSourceEvidence(value: unknown): void {
  const source = object(value, "source_evidence");
  exact(source, ["coverage", "insights_quarantine", "night_attention", "runner_heartbeats"], "source_evidence");
  validateCoverage(source.coverage, "source_evidence.coverage");
  if (!Array.isArray(source.runner_heartbeats) || source.runner_heartbeats.length !== 3) throw new CatfoodError("CONTRACT_INVALID", "runner heartbeats must be complete structurally");
  source.runner_heartbeats.forEach(validateRunner);
  if (new Set(source.runner_heartbeats.map((item) => object(item, "runner").runner_name)).size !== 3) throw new CatfoodError("CONTRACT_INVALID", "runner heartbeat names must be unique");

  const night = object(source.night_attention, "night_attention");
  exact(night, ["by_reason", "coverage", "items_truncated", "total", "window_hours"], "night_attention");
  if (night.window_hours !== 96) throw new CatfoodError("CONTRACT_INVALID", "night window is not frozen");
  integer(night.total, "night total"); bool(night.items_truncated, "night truncated"); validateCoverage(night.coverage, "night coverage");
  const reasons = object(night.by_reason, "night reasons");
  exact(reasons, ["ambiguous", "blocked", "cancelled", "failed_confirmed"], "night reasons");
  for (const key of Object.keys(reasons)) integer(reasons[key], `night ${key}`);
  if (night.coverage === "complete" && night.items_truncated) throw new CatfoodError("CONTRACT_INVALID", "truncated NIGHT evidence cannot be complete");

  const quarantine = object(source.insights_quarantine, "insights_quarantine");
  exact(quarantine, ["coverage", "items", "items_truncated", "total"], "insights_quarantine");
  integer(quarantine.total, "quarantine total"); bool(quarantine.items_truncated, "quarantine truncated"); validateCoverage(quarantine.coverage, "quarantine coverage");
  if (!Array.isArray(quarantine.items)) throw new CatfoodError("CONTRACT_INVALID", "quarantine items must be an array");
  quarantine.items.forEach((item, index) => {
    const row = object(item, `quarantine[${index}]`);
    exact(row, ["content_id", "error_code", "failure_count", "last_failed_at"], "quarantine item");
    string(row.content_id, "content_id"); string(row.error_code, "error_code"); integer(row.failure_count, "failure_count", 1); timestamp(row.last_failed_at, "last_failed_at");
  });
  if (quarantine.coverage === "complete" && quarantine.items_truncated) throw new CatfoodError("CONTRACT_INVALID", "truncated quarantine cannot be complete");
}

export interface OperationalBoundaryV1 extends Record<string, unknown> {
  canonical_sha256: string;
  account_id: string;
  capability: CatfoodCapability | null;
  execution_state: "PERMITTED" | "INHIBITED" | "EXPIRED" | "UNKNOWN";
  authority_state: "ACTIVE" | "REVOKED" | "EXPIRED" | "MISSING" | "CONFLICT";
  fencing_generation: number | null;
  permit_expires_at: string | null;
  blocked_reasons: string[];
  enabled_capabilities: CatfoodCapability[];
  schema_fingerprint: string;
  migration_provenance_digest: string | null;
  source_evidence: Record<string, unknown>;
}

export function validateOperationalBoundaryV1(input: unknown): OperationalBoundaryV1 {
  const row = object(input, "boundary");
  exact(row, TOP_LEVEL_BOUNDARY, "boundary");
  if (row.boundary_version !== 1) throw new CatfoodError("BOUNDARY_VERSION_UNSUPPORTED");
  const embedded = string(row.canonical_sha256, "canonical_sha256") as string;
  if (!SHA256.test(embedded)) throw new CatfoodError("CONTRACT_INVALID", "canonical_sha256 is invalid");
  const unhashed = { ...row }; delete unhashed.canonical_sha256;
  if (canonicalSha256(unhashed) !== embedded) throw new CatfoodError("BOUNDARY_DIGEST_MISMATCH");

  if (row.producer_release_identity !== null) {
    const release = object(row.producer_release_identity, "producer_release_identity");
    exact(release, ["artifact_sha256", "git_sha"], "producer_release_identity");
    if (!SHA40.test(string(release.git_sha, "git_sha") as string) || !SHA256.test(string(release.artifact_sha256, "artifact_sha256") as string)) throw new CatfoodError("CONTRACT_INVALID", "release identity is invalid");
  }
  integer(row.schema_version, "schema_version", 0, true);
  string(row.schema_fingerprint, "schema_fingerprint");
  oneOf(row.schema_readiness, "schema_readiness", ["READY", "NEEDS_MIGRATION", "INCOMPATIBLE", "FUTURE_SCHEMA", "CORRUPT", "UNKNOWN"] as const);
  const provenance = string(row.migration_provenance_digest, "migration_provenance_digest", true);
  if (provenance !== null && !SHA256.test(provenance)) throw new CatfoodError("CONTRACT_INVALID", "provenance digest is invalid");
  const accountId = string(row.account_id, "account_id") as string;
  if (!ACCOUNT.test(accountId)) throw new CatfoodError("CONTRACT_INVALID", "account_id is invalid");
  timestamp(row.observed_at, "observed_at");
  const binding = object(row.org_tenant_binding, "org_tenant_binding");
  exact(binding, ["org_ids", "state"], "org_tenant_binding");
  oneOf(binding.state, "binding state", ["bound", "conflict", "missing"] as const); stringArray(binding.org_ids, "org_ids");
  const supported = new Set<string>(CATFOOD_INITIAL_CAPABILITIES);
  if (row.capability !== null && !supported.has(String(row.capability))) throw new CatfoodError("CONTRACT_INVALID", "capability is unknown");
  if (row.unsupported_capability !== null) string(row.unsupported_capability, "unsupported_capability");
  if ((row.capability === null) === (row.unsupported_capability === null)) throw new CatfoodError("CONTRACT_INVALID", "capability representation is incoherent");
  oneOf(row.execution_state, "execution_state", ["PERMITTED", "INHIBITED", "EXPIRED", "UNKNOWN"] as const);
  timestamp(row.permit_expires_at, "permit_expires_at", true); integer(row.fencing_generation, "fencing_generation", 1, true);
  oneOf(row.authority_state, "authority_state", ["ACTIVE", "REVOKED", "EXPIRED", "MISSING", "CONFLICT"] as const);
  const enabled = stringArray(row.enabled_capabilities, "enabled_capabilities");
  if (new Set(enabled).size !== enabled.length || enabled.some((item) => !supported.has(item))) throw new CatfoodError("CONTRACT_INVALID", "enabled capabilities are invalid");
  const stops = object(row.effective_safety_controls, "effective_safety_controls");
  exact(stops, ["account_stop", "capability_stop", "global_stop", "reasons"], "effective_safety_controls");
  bool(stops.account_stop, "account_stop"); bool(stops.capability_stop, "capability_stop"); bool(stops.global_stop, "global_stop"); stringArray(stops.reasons, "stop reasons");
  oneOf(row.stop_acknowledgement, "stop_acknowledgement", ["NOT_REQUESTED", "PENDING", "INHIBITED", "FAILED", "UNKNOWN"] as const);
  const flight = object(row.governed_in_flight, "governed_in_flight");
  exact(flight, ["attribution_state", "by_authority", "count", "external_cancellation_guaranteed", "unattributed_count"], "governed_in_flight");
  integer(flight.count, "in_flight count"); integer(flight.unattributed_count, "unattributed_count");
  oneOf(flight.attribution_state, "attribution_state", ["COMPLETE", "UNKNOWN"] as const);
  if (flight.external_cancellation_guaranteed !== false || !Array.isArray(flight.by_authority)) throw new CatfoodError("CONTRACT_INVALID", "in-flight contract is invalid");
  flight.by_authority.forEach((item, index) => {
    const mapped = object(item, `by_authority[${index}]`); exact(mapped, ["capability", "count", "generation"], "in-flight authority");
    if (!supported.has(string(mapped.capability, "capability") as string)) throw new CatfoodError("CONTRACT_INVALID", "in-flight capability is unknown");
    integer(mapped.count, "count", 1); integer(mapped.generation, "generation", 1);
  });
  const blocked = stringArray(row.blocked_reasons, "blocked_reasons");
  if (blocked.some((reason) => !BLOCKED_REASONS.has(reason))) throw new CatfoodError("CONTRACT_INVALID", "blocked reason is unknown");
  validateSourceEvidence(row.source_evidence);
  return row as OperationalBoundaryV1;
}

export interface HumanGo {
  run_id: string;
  spec_hash: string;
  environment: string;
  tenant_id: string;
  org_id: string;
  account_id: string;
  capabilities: readonly CatfoodCapability[];
  approved_at: string;
  expires_at: string;
  approval_ref: string;
  approval_identity: string;
}

export interface CatfoodRunSpecInput {
  run_id: string;
  ikorabu_sha: string;
  threads_sha: string;
  wp1_contract_sha256: string;
  operational_boundary_sha256: string;
  threads_release_artifact_sha256: string;
  target_schema: number;
  target_schema_fingerprint: string;
  migration_provenance_digest: string;
  environment: string;
  tenant_id: string;
  org_id: string;
  account_id: string;
  capabilities: readonly CatfoodCapability[];
  effective_config_sha256: string;
  budget_policy: Readonly<{ paid_ai_allowed: false; maximum_paid_cost_micros: 0 }>;
  cadence_seconds_by_class: Readonly<Record<string, number>>;
  requested_duration_seconds: number;
  window_start: string;
  window_end: string;
  restart_policy: Readonly<{ planned_restart_required: true; max_catch_up_per_class: 1 }>;
  minimum_meaningful_units: number;
  minimum_work_classes: number;
  human_go_ref: string;
  night_state: typeof CATFOOD_NIGHT_STATE;
}
export type CatfoodRunSpec = Readonly<CatfoodRunSpecInput & { canonical_spec_sha256: string }>;

export function createRunSpec(input: CatfoodRunSpecInput): CatfoodRunSpec {
  const clean = jsonValue(input, "spec") as unknown as CatfoodRunSpecInput;
  if (!ID.test(clean.run_id) || !SHA40.test(clean.ikorabu_sha) || !SHA40.test(clean.threads_sha)) throw new CatfoodError("SPEC_INVALID");
  for (const digest of [clean.wp1_contract_sha256, clean.operational_boundary_sha256, clean.threads_release_artifact_sha256, clean.target_schema_fingerprint, clean.migration_provenance_digest, clean.effective_config_sha256]) {
    if (!SHA256.test(digest)) throw new CatfoodError("SPEC_INVALID", "spec digest is invalid");
  }
  if (!ACCOUNT.test(clean.account_id) || clean.target_schema !== CATFOOD_TARGET_SCHEMA) throw new CatfoodError("SPEC_INVALID");
  if (canonicalJson(clean.capabilities) !== canonicalJson(CATFOOD_INITIAL_CAPABILITIES)) throw new CatfoodError("SPEC_PROFILE_MISMATCH");
  if (clean.budget_policy.paid_ai_allowed !== false || clean.budget_policy.maximum_paid_cost_micros !== 0) throw new CatfoodError("SPEC_COST_POLICY_INVALID");
  if (clean.minimum_meaningful_units < 3 || clean.minimum_work_classes < 2 || clean.requested_duration_seconds < 86_400) throw new CatfoodError("SPEC_THRESHOLD_INVALID");
  if (clean.restart_policy.planned_restart_required !== true || clean.restart_policy.max_catch_up_per_class !== 1 || clean.night_state !== CATFOOD_NIGHT_STATE) throw new CatfoodError("SPEC_PROFILE_MISMATCH");
  const start = Date.parse(timestamp(clean.window_start, "window_start")!);
  const end = Date.parse(timestamp(clean.window_end, "window_end")!);
  if (end - start < clean.requested_duration_seconds * 1000) throw new CatfoodError("SPEC_WINDOW_INVALID");
  const cadence = object(clean.cadence_seconds_by_class, "cadence");
  if (Object.keys(cadence).length < 2 || Object.values(cadence).some((value) => !Number.isSafeInteger(value) || Number(value) < 1)) throw new CatfoodError("SPEC_CADENCE_INVALID");
  return Object.freeze({ ...clean, canonical_spec_sha256: canonicalSha256(clean) });
}

export function validateHumanGo(spec: CatfoodRunSpec, go: HumanGo, now: string): HumanGo {
  const clean = jsonValue(go, "human_go") as unknown as HumanGo;
  if (clean.run_id !== spec.run_id || clean.spec_hash !== spec.canonical_spec_sha256 || clean.environment !== spec.environment
    || clean.tenant_id !== spec.tenant_id || clean.org_id !== spec.org_id || clean.account_id !== spec.account_id
    || canonicalJson(clean.capabilities) !== canonicalJson(spec.capabilities) || clean.approval_ref !== spec.human_go_ref) {
    throw new CatfoodError("HUMAN_GO_MISMATCH");
  }
  if (!clean.approval_identity || Date.parse(timestamp(clean.approved_at, "approved_at")!) > Date.parse(now)
    || Date.parse(timestamp(clean.expires_at, "expires_at")!) <= Date.parse(now)
    || Date.parse(clean.expires_at) < Date.parse(spec.window_end)) throw new CatfoodError("HUMAN_GO_EXPIRED");
  return Object.freeze(clean);
}

export interface PreflightInput {
  spec: CatfoodRunSpec;
  human_go: HumanGo | null;
  now: string;
  effective_config: Readonly<Record<string, Json>>;
  feature_multi_tenant_auth: string | undefined;
  catfood_harness_enabled: string | undefined;
  authorized_probe_status: number;
  missing_identity_probe_status: number;
  boundaries: readonly unknown[];
  boundary_artifact_sha256: string;
  ikorabu_sha: string;
  store_healthy: boolean;
  overlapping_owner: boolean;
  unresolved_unsafe_or_ambiguous: boolean;
  eligible_units_by_class: Readonly<Record<string, number>>;
  provider_invoked: boolean;
  observed_cost_state: CostState;
  phase: "BEFORE_AUTHORITY" | "AFTER_AUTHORITY";
}

export interface PreflightResult { ok: boolean; reasons: readonly string[]; boundaries: readonly OperationalBoundaryV1[] }

export function catfoodHarnessEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.CATFOOD_HARNESS_ENABLED === "1";
}

export function evaluatePreflight(input: PreflightInput): PreflightResult {
  const reasons = new Set<string>();
  let boundaries: OperationalBoundaryV1[] = [];
  if (!input.human_go) reasons.add("HUMAN_GO_MISSING");
  else try { validateHumanGo(input.spec, input.human_go, input.now); } catch (error) { reasons.add(error instanceof CatfoodError ? error.code : "HUMAN_GO_INVALID"); }
  if (!SHA40.test(input.spec.ikorabu_sha) || input.ikorabu_sha !== input.spec.ikorabu_sha) reasons.add("IKORABU_SHA_MISMATCH");
  if (input.spec.threads_sha !== CATFOOD_THREADS_SHA) reasons.add("THREADS_SHA_MISMATCH");
  if (input.spec.wp1_contract_sha256 !== CATFOOD_WP1_CONTRACT_SHA256) reasons.add("WP1_CONTRACT_MISMATCH");
  if (input.spec.operational_boundary_sha256 !== CATFOOD_BOUNDARY_SHA256 || input.boundary_artifact_sha256 !== CATFOOD_BOUNDARY_SHA256) reasons.add("BOUNDARY_ARTIFACT_MISMATCH");
  if (input.spec.threads_release_artifact_sha256 !== CATFOOD_THREADS_RELEASE_SHA256) reasons.add("THREADS_RELEASE_MISMATCH");
  if (canonicalSha256(input.effective_config) !== input.spec.effective_config_sha256) reasons.add("EFFECTIVE_CONFIG_DRIFT");
  if (input.feature_multi_tenant_auth !== "1") reasons.add("MULTI_TENANT_AUTH_DISABLED");
  if (input.catfood_harness_enabled !== "1") reasons.add("CATFOOD_HARNESS_DISABLED");
  if (input.authorized_probe_status !== 200) reasons.add("TENANT_AUTHORIZED_PROBE_FAILED");
  if (![401, 403].includes(input.missing_identity_probe_status)) reasons.add("TENANT_ENFORCEMENT_NOT_PROVED");
  if (!input.store_healthy) reasons.add("EVIDENCE_STORE_UNHEALTHY");
  if (input.overlapping_owner) reasons.add("RUN_OWNER_OVERLAP");
  if (input.unresolved_unsafe_or_ambiguous) reasons.add("UNRESOLVED_UNSAFE_OR_AMBIGUOUS");
  if (input.provider_invoked || input.observed_cost_state === "KNOWN_NONZERO" || input.observed_cost_state === "UNKNOWN") reasons.add("PAID_WORK_NOT_EXCLUDED");
  if (input.effective_config.editorial_writer_enabled !== false || input.effective_config.paid_generation_enabled !== false) reasons.add("WRITER_PAID_PATH_NOT_DISABLED");
  const eligible = Object.entries(input.eligible_units_by_class).filter(([, count]) => Number.isSafeInteger(count) && count > 0);
  if (eligible.reduce((sum, [, count]) => sum + count, 0) < input.spec.minimum_meaningful_units) reasons.add("INSUFFICIENT_MEANINGFUL_UNITS");
  if (eligible.length < input.spec.minimum_work_classes) reasons.add("INSUFFICIENT_WORK_CLASSES");
  try { boundaries = input.boundaries.map(validateOperationalBoundaryV1); } catch (error) { reasons.add(error instanceof CatfoodError ? error.code : "BOUNDARY_INVALID"); }
  if (boundaries.length !== input.spec.capabilities.length) reasons.add("BOUNDARY_CAPABILITY_SET_INCOMPLETE");
  const seen = new Set<string>();
  for (const boundary of boundaries) {
    const release = boundary.producer_release_identity as Record<string, unknown> | null;
    const binding = boundary.org_tenant_binding as Record<string, unknown>;
    const stops = boundary.effective_safety_controls as Record<string, unknown>;
    const flight = boundary.governed_in_flight as Record<string, unknown>;
    if (!release || release.git_sha !== CATFOOD_THREADS_SHA || release.artifact_sha256 !== CATFOOD_THREADS_RELEASE_SHA256) reasons.add("THREADS_RELEASE_MISMATCH");
    if (boundary.schema_version !== CATFOOD_TARGET_SCHEMA || boundary.schema_readiness !== "READY" || boundary.schema_fingerprint !== input.spec.target_schema_fingerprint) reasons.add("SCHEMA_IDENTITY_MISMATCH");
    if (boundary.migration_provenance_digest !== input.spec.migration_provenance_digest) reasons.add("PROVENANCE_MISMATCH");
    if (boundary.account_id !== input.spec.account_id || binding.state !== "bound" || canonicalJson(binding.org_ids) !== canonicalJson([input.spec.org_id])) reasons.add("TENANT_BINDING_MISMATCH");
    if (stops.global_stop || stops.account_stop || stops.capability_stop) reasons.add("SAFETY_STOP_ACTIVE");
    if (flight.attribution_state !== "COMPLETE" || flight.unattributed_count !== 0) reasons.add("UNATTRIBUTED_IN_FLIGHT");
    if (boundary.blocked_reasons.some((reason) => !["authority_missing", "authority_revoked", "authority_expired"].includes(reason) || input.phase === "AFTER_AUTHORITY")) reasons.add("BOUNDARY_BLOCKED");
    if (boundary.capability) seen.add(boundary.capability);
    if (input.phase === "AFTER_AUTHORITY") {
      if (boundary.execution_state !== "PERMITTED" || boundary.authority_state !== "ACTIVE" || !boundary.enabled_capabilities.includes(boundary.capability!)) reasons.add("AUTHORITY_NOT_PERMITTED");
      if (!boundary.permit_expires_at || Date.parse(boundary.permit_expires_at) <= Date.parse(input.now) || !boundary.fencing_generation) reasons.add("AUTHORITY_EXPIRY_OR_GENERATION_INVALID");
    } else if (!["MISSING", "REVOKED", "EXPIRED", "ACTIVE"].includes(boundary.authority_state)) reasons.add("AUTHORITY_STATE_INCOMPATIBLE");
  }
  if (canonicalJson([...seen].sort()) !== canonicalJson([...input.spec.capabilities].sort())) reasons.add("BOUNDARY_CAPABILITY_SET_INCOMPLETE");
  return Object.freeze({ ok: reasons.size === 0, reasons: Object.freeze([...reasons].sort()), boundaries: Object.freeze(boundaries) });
}

export interface OperationalAuthorityRequest {
  action: "grant" | "renew" | "revoke" | "resume";
  account_id: string;
  capability: CatfoodCapability;
  authority_ref: string;
  spec_hash: string;
  expected_generation?: number;
  permit_expires_at?: string;
}

export interface OperationalAuthorityResponse {
  account_id: string;
  capability: CatfoodCapability;
  authority_ref: string;
  spec_hash: string;
  authority_state: "ACTIVE" | "REVOKED";
  permit_expires_at: string;
  fencing_generation: number;
  stop_acknowledgement: "NOT_REQUESTED" | "INHIBITED";
}

function bridgeOrigin(raw: string): string {
  let url: URL;
  try { url = new URL(raw); } catch { throw new CatfoodError("BRIDGE_URL_INVALID"); }
  const local = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(url.hostname.toLowerCase());
  if ((!local && url.protocol !== "https:") || (local && !["http:", "https:"].includes(url.protocol))
    || url.username || url.password || url.search || url.hash || !["", "/"].includes(url.pathname)) throw new CatfoodError("BRIDGE_URL_INVALID");
  return url.origin;
}

function tenantHeaders(apiKey: string, tenantUserId?: string): Record<string, string> {
  if (!apiKey || SECRET.test(apiKey)) {
    // Secret values are allowed in transient headers but never accepted as persisted JSON.
    if (!apiKey) throw new CatfoodError("BRIDGE_AUTH_MISSING");
  }
  const headers: Record<string, string> = { Accept: "application/json", Authorization: `Bearer ${apiKey}` };
  if (tenantUserId !== undefined) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._:@-]{0,199}$/.test(tenantUserId)) throw new CatfoodError("TENANT_IDENTITY_INVALID");
    headers["X-Threads-User-ID"] = tenantUserId;
  }
  return headers;
}

async function boundedFetchJson(fetcher: typeof fetch, url: URL, init: RequestInit, expectedStatus = 200): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2_500);
  try {
    const response = await fetcher(url, { ...init, signal: controller.signal });
    if (response.status !== expectedStatus) throw new CatfoodError("BRIDGE_HTTP_STATUS", String(response.status));
    const declared = Number(response.headers.get("Content-Length") ?? 0);
    if (Number.isFinite(declared) && declared > 512_000) throw new CatfoodError("BRIDGE_RESPONSE_TOO_LARGE");
    const text = await response.text();
    if (text.length > 512_000) throw new CatfoodError("BRIDGE_RESPONSE_TOO_LARGE");
    try { return JSON.parse(text); } catch { throw new CatfoodError("BRIDGE_RESPONSE_INVALID"); }
  } catch (error) {
    if (error instanceof CatfoodError) throw error;
    throw new CatfoodError(error instanceof Error && error.name === "AbortError" ? "BRIDGE_TIMEOUT" : "BRIDGE_UNAVAILABLE");
  } finally { clearTimeout(timer); }
}

export class CatfoodBridgeClient {
  readonly origin: string;
  constructor(
    bridgeUrl: string,
    private readonly apiKey: string,
    private readonly fetcher: typeof fetch = fetch,
  ) { this.origin = bridgeOrigin(bridgeUrl); }

  async boundary(accountId: string, capability: CatfoodCapability, tenantUserId?: string): Promise<OperationalBoundaryV1> {
    const url = new URL("/autopilot/v2/operational-boundary", this.origin);
    url.searchParams.set("account_id", accountId); url.searchParams.set("capability", capability);
    return validateOperationalBoundaryV1(await boundedFetchJson(this.fetcher, url, { method: "GET", headers: tenantHeaders(this.apiKey, tenantUserId) }));
  }

  async tenantEnforcementProbe(accountId: string, capability: CatfoodCapability, tenantUserId: string): Promise<{ authorized_status: number; missing_identity_status: number }> {
    const url = new URL("/autopilot/v2/operational-boundary", this.origin);
    url.searchParams.set("account_id", accountId); url.searchParams.set("capability", capability);
    const request = async (identity?: string) => {
      const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 2_500);
      try { return (await this.fetcher(url, { method: "GET", headers: tenantHeaders(this.apiKey, identity), signal: controller.signal })).status; }
      catch { return 0; } finally { clearTimeout(timer); }
    };
    return Object.freeze({ authorized_status: await request(tenantUserId), missing_identity_status: await request() });
  }

  async changeAuthority(request: OperationalAuthorityRequest, tenantUserId: string, passedPreflight: PreflightResult): Promise<OperationalAuthorityResponse> {
    if (!passedPreflight.ok) throw new CatfoodError("PREFLIGHT_REQUIRED");
    if (!ACCOUNT.test(request.account_id) || !CATFOOD_INITIAL_CAPABILITIES.includes(request.capability)
      || !request.authority_ref || !SHA256.test(request.spec_hash)
      || (request.expected_generation !== undefined && (!Number.isSafeInteger(request.expected_generation) || request.expected_generation < 1))) throw new CatfoodError("AUTHORITY_REQUEST_INVALID");
    if (request.action !== "revoke") timestamp(request.permit_expires_at, "permit_expires_at");
    const url = new URL("/autopilot/v2/operational-authority", this.origin);
    const raw = await boundedFetchJson(this.fetcher, url, {
      method: "POST", headers: { ...tenantHeaders(this.apiKey, tenantUserId), "Content-Type": "application/json" }, body: canonicalJson(request),
    });
    const response = object(raw, "authority response");
    exact(response, ["account_id", "authority_ref", "authority_state", "capability", "fencing_generation", "permit_expires_at", "spec_hash", "stop_acknowledgement"], "authority response");
    if (response.account_id !== request.account_id || response.capability !== request.capability || response.authority_ref !== request.authority_ref || response.spec_hash !== request.spec_hash) throw new CatfoodError("AUTHORITY_RESPONSE_MISMATCH");
    oneOf(response.authority_state, "authority_state", ["ACTIVE", "REVOKED"] as const);
    oneOf(response.stop_acknowledgement, "stop_acknowledgement", ["NOT_REQUESTED", "INHIBITED"] as const);
    integer(response.fencing_generation, "fencing_generation", 1); timestamp(response.permit_expires_at, "permit_expires_at");
    return Object.freeze(response as unknown as OperationalAuthorityResponse);
  }
}

export const CATFOOD_SCHEMA_SQL = `
CREATE TABLE catfood_run_specs (
  run_id TEXT PRIMARY KEY, spec_json TEXT NOT NULL, spec_sha256 TEXT NOT NULL UNIQUE,
  human_go_json TEXT NOT NULL, created_at TEXT NOT NULL,
  CHECK (json_valid(spec_json) AND json_valid(human_go_json) AND length(spec_sha256)=64)
);
CREATE TRIGGER catfood_run_specs_no_update BEFORE UPDATE ON catfood_run_specs BEGIN SELECT RAISE(ABORT,'catfood run specs are immutable'); END;
CREATE TRIGGER catfood_run_specs_no_delete BEFORE DELETE ON catfood_run_specs BEGIN SELECT RAISE(ABORT,'catfood run specs are immutable'); END;
CREATE TABLE catfood_run_leases (
  run_id TEXT PRIMARY KEY REFERENCES catfood_run_specs(run_id), owner_id TEXT NOT NULL,
  wp3_epoch INTEGER NOT NULL CHECK(wp3_epoch>0), lease_expires_at TEXT NOT NULL,
  lifecycle_state TEXT NOT NULL, due_state_json TEXT NOT NULL CHECK(json_valid(due_state_json)), updated_at TEXT NOT NULL
);
CREATE TABLE catfood_authority_epochs (
  run_id TEXT NOT NULL REFERENCES catfood_run_specs(run_id), wp3_epoch INTEGER NOT NULL,
  capability TEXT NOT NULL, authority_ref TEXT NOT NULL, spec_hash TEXT NOT NULL,
  threads_generation INTEGER NOT NULL CHECK(threads_generation>0), permit_expires_at TEXT NOT NULL,
  boundary_sha256 TEXT NOT NULL, created_at TEXT NOT NULL,
  PRIMARY KEY(run_id,wp3_epoch,capability)
);
CREATE TRIGGER catfood_authority_epochs_immutable_fields BEFORE UPDATE ON catfood_authority_epochs
WHEN OLD.run_id IS NOT NEW.run_id OR OLD.wp3_epoch IS NOT NEW.wp3_epoch
  OR OLD.capability IS NOT NEW.capability OR OLD.authority_ref IS NOT NEW.authority_ref
  OR OLD.spec_hash IS NOT NEW.spec_hash OR OLD.threads_generation IS NOT NEW.threads_generation
  OR OLD.created_at IS NOT NEW.created_at
BEGIN SELECT RAISE(ABORT,'authority mapping identity is immutable'); END;
CREATE TRIGGER catfood_authority_epochs_no_delete BEFORE DELETE ON catfood_authority_epochs BEGIN SELECT RAISE(ABORT,'authority mappings are immutable'); END;
CREATE TABLE catfood_work_units (
  unit_id TEXT PRIMARY KEY, run_id TEXT NOT NULL REFERENCES catfood_run_specs(run_id), wp3_epoch INTEGER NOT NULL,
  capability TEXT NOT NULL, work_class TEXT NOT NULL, request_id TEXT NOT NULL,
  authority_ref TEXT NOT NULL, threads_generation INTEGER NOT NULL, request_sha256 TEXT NOT NULL,
  pre_boundary_sha256 TEXT NOT NULL, status TEXT NOT NULL,
  response_sha256 TEXT, post_boundary_sha256 TEXT, cost_state TEXT NOT NULL,
  provider_invoked INTEGER NOT NULL DEFAULT 0 CHECK(provider_invoked IN(0,1)),
  replay INTEGER NOT NULL DEFAULT 0 CHECK(replay IN(0,1)), duplicate INTEGER NOT NULL DEFAULT 0 CHECK(duplicate IN(0,1)),
  unsafe_or_ambiguous INTEGER NOT NULL DEFAULT 0 CHECK(unsafe_or_ambiguous IN(0,1)),
  started_at TEXT NOT NULL, ended_at TEXT, UNIQUE(run_id,capability,request_id)
);
CREATE TABLE catfood_evidence_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT, event_id TEXT NOT NULL UNIQUE,
  run_id TEXT NOT NULL REFERENCES catfood_run_specs(run_id), event_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL, payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), payload_sha256 TEXT NOT NULL
);
CREATE TRIGGER catfood_evidence_events_no_update BEFORE UPDATE ON catfood_evidence_events BEGIN SELECT RAISE(ABORT,'catfood evidence is append-only'); END;
CREATE TRIGGER catfood_evidence_events_no_delete BEFORE DELETE ON catfood_evidence_events BEGIN SELECT RAISE(ABORT,'catfood evidence is append-only'); END;
CREATE TABLE catfood_evidence_bundles (
  run_id TEXT PRIMARY KEY REFERENCES catfood_run_specs(run_id), bundle_json TEXT NOT NULL CHECK(json_valid(bundle_json)),
  bundle_sha256 TEXT NOT NULL UNIQUE, evaluator_version TEXT NOT NULL, closed_at TEXT NOT NULL
);
CREATE TRIGGER catfood_evidence_bundles_no_update BEFORE UPDATE ON catfood_evidence_bundles BEGIN SELECT RAISE(ABORT,'closed evidence bundles are immutable'); END;
CREATE TRIGGER catfood_evidence_bundles_no_delete BEFORE DELETE ON catfood_evidence_bundles BEGIN SELECT RAISE(ABORT,'closed evidence bundles are immutable'); END;
`;

const REQUIRED_TABLES = ["catfood_run_specs", "catfood_run_leases", "catfood_authority_epochs", "catfood_work_units", "catfood_evidence_events", "catfood_evidence_bundles"];

export function initializeCatfoodStore(path: string): void {
  const target = resolve(path);
  if (!existsSync(target)) throw new CatfoodError("STORE_MUST_PREEXIST");
  if (/agents-demo\.db$/i.test(target)) throw new CatfoodError("DEMO_DB_FORBIDDEN");
  const db = new Database(target, { strict: true, create: false });
  try {
    const existing = db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get()?.n ?? 0;
    if (existing) throw new CatfoodError("STORE_ALREADY_INITIALIZED");
    db.exec("PRAGMA foreign_keys=ON"); db.exec("PRAGMA journal_mode=WAL"); db.exec("PRAGMA synchronous=FULL");
    db.transaction(() => db.exec(CATFOOD_SCHEMA_SQL)).immediate();
  } finally { db.close(); }
}

export function openCatfoodStore(path: string, readonly = false): Database {
  const target = resolve(path);
  if (!existsSync(target)) throw new CatfoodError("STORE_MISSING");
  if (/agents-demo\.db$/i.test(target)) throw new CatfoodError("DEMO_DB_FORBIDDEN");
  const db = new Database(target, { readonly, strict: true, create: false });
  db.exec("PRAGMA foreign_keys=ON");
  const integrity = db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get()?.integrity_check;
  const count = db.query<{ n: number }, []>(`SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name IN (${REQUIRED_TABLES.map(() => "?").join(",")})`).get(...REQUIRED_TABLES)?.n ?? 0;
  if (integrity !== "ok" || count !== REQUIRED_TABLES.length) { db.close(); throw new CatfoodError("STORE_UNHEALTHY"); }
  return db;
}

export function persistRunSpec(db: Database, spec: CatfoodRunSpec, go: HumanGo, now: string): void {
  validateHumanGo(spec, go, now);
  db.transaction(() => {
    db.query("INSERT INTO catfood_run_specs(run_id,spec_json,spec_sha256,human_go_json,created_at) VALUES (?,?,?,?,?)")
      .run(spec.run_id, canonicalJson(spec), spec.canonical_spec_sha256, canonicalJson(go), timestamp(now, "now"));
    appendEvidence(db, spec.run_id, "run_created", now, { spec_sha256: spec.canonical_spec_sha256 });
  }).immediate();
}

export interface Lease { run_id: string; owner_id: string; wp3_epoch: number; lease_expires_at: string; lifecycle_state: LifecycleState; due_state: Record<string, string> }

function leaseRow(db: Database, runId: string): Record<string, unknown> | null {
  return db.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_run_leases WHERE run_id=?").get(runId) ?? null;
}

export function acquireLease(db: Database, runId: string, ownerId: string, now: string, ttlSeconds: number, restartBoundary?: unknown): Lease {
  if (!ID.test(ownerId) || !Number.isSafeInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 300) throw new CatfoodError("LEASE_INPUT_INVALID");
  const at = Date.parse(timestamp(now, "now")!); const expires = new Date(at + ttlSeconds * 1000).toISOString();
  return db.transaction(() => {
    const current = leaseRow(db, runId);
    if (!current) {
      db.query("INSERT INTO catfood_run_leases VALUES (?,?,?,?,?,?,?)").run(runId, ownerId, 1, expires, "CREATED", "{}", now);
      appendEvidence(db, runId, "lease_acquired", now, { owner_id: ownerId, wp3_epoch: 1, lease_expires_at: expires });
    } else {
      if (Date.parse(String(current.lease_expires_at)) > at && current.owner_id !== ownerId) throw new CatfoodError("LEASE_HELD");
      const takeover = current.owner_id !== ownerId || Date.parse(String(current.lease_expires_at)) <= at;
      let epoch = Number(current.wp3_epoch);
      if (takeover) {
        if (!restartBoundary) throw new CatfoodError("RESTART_BOUNDARY_REQUIRED");
        const boundary = validateOperationalBoundaryV1(restartBoundary);
        if (boundary.execution_state === "PERMITTED" || !["REVOKED", "EXPIRED"].includes(boundary.authority_state)
          || !["INHIBITED", "NOT_REQUESTED"].includes(String(boundary.stop_acknowledgement))) throw new CatfoodError("RESTART_AUTHORITY_NOT_CLOSED");
        const priorEpoch = epoch;
        epoch += 1;
        db.query("UPDATE catfood_run_leases SET owner_id=?,wp3_epoch=?,lease_expires_at=?,updated_at=? WHERE run_id=?")
          .run(ownerId, epoch, expires, now, runId);
        appendEvidence(db, runId, "restart_acquired", now, {
          from_epoch: priorEpoch, to_epoch: epoch, owner_id: ownerId, lease_expires_at: expires,
          boundary_sha256: boundary.canonical_sha256, boundary: jsonValue(boundary),
        });
      } else {
        db.query("UPDATE catfood_run_leases SET owner_id=?,wp3_epoch=?,lease_expires_at=?,updated_at=? WHERE run_id=?")
          .run(ownerId, epoch, expires, now, runId);
      }
    }
    const row = leaseRow(db, runId)!;
    return Object.freeze({ run_id: runId, owner_id: String(row.owner_id), wp3_epoch: Number(row.wp3_epoch), lease_expires_at: String(row.lease_expires_at), lifecycle_state: row.lifecycle_state as LifecycleState, due_state: JSON.parse(String(row.due_state_json)) });
  }).immediate();
}

export function requireLease(db: Database, runId: string, ownerId: string, epoch: number, now: string): Lease {
  const row = leaseRow(db, runId);
  if (!row || row.owner_id !== ownerId || Number(row.wp3_epoch) !== epoch || Date.parse(String(row.lease_expires_at)) <= Date.parse(now)) throw new CatfoodError("STALE_WP3_EPOCH");
  return Object.freeze({ run_id: runId, owner_id: ownerId, wp3_epoch: epoch, lease_expires_at: String(row.lease_expires_at), lifecycle_state: row.lifecycle_state as LifecycleState, due_state: JSON.parse(String(row.due_state_json)) });
}

export function setLifecycle(db: Database, lease: Lease, state: LifecycleState, now: string, details: Json = {}): void {
  requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  db.transaction(() => {
    db.query("UPDATE catfood_run_leases SET lifecycle_state=?,updated_at=? WHERE run_id=?").run(state, now, lease.run_id);
    appendEvidence(db, lease.run_id, `lifecycle.${state.toLowerCase()}`, now, { wp3_epoch: lease.wp3_epoch, details });
  }).immediate();
}

export function setNextDue(db: Database, lease: Lease, workClass: string, nextDueAt: string, now: string): void {
  const current = requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  if (!ID.test(workClass)) throw new CatfoodError("DUE_CLASS_INVALID");
  const due = { ...current.due_state, [workClass]: timestamp(nextDueAt, "next_due_at")! };
  db.query("UPDATE catfood_run_leases SET due_state_json=?,updated_at=? WHERE run_id=?").run(canonicalJson(due), now, lease.run_id);
}

export function dueClasses(lease: Lease, now: string): string[] {
  const at = Date.parse(now);
  return Object.entries(lease.due_state).filter(([, due]) => Date.parse(due) <= at).map(([name]) => name).sort();
}

export function appendEvidence(db: Database, runId: string, type: string, occurredAt: string, payload: Json): string {
  if (!ID.test(type)) throw new CatfoodError("EVENT_TYPE_INVALID");
  const body = canonicalJson(payload); const digest = sha256(body);
  const eventId = `evt:${canonicalSha256({ run_id: runId, event_type: type, occurred_at: occurredAt, payload_sha256: digest }).slice(0, 32)}`;
  db.query("INSERT INTO catfood_evidence_events(event_id,run_id,event_type,occurred_at,payload_json,payload_sha256) VALUES (?,?,?,?,?,?)")
    .run(eventId, runId, type, timestamp(occurredAt, "occurred_at"), body, digest);
  return eventId;
}

export function recordAuthorityEpoch(db: Database, lease: Lease, capability: CatfoodCapability, authorityRef: string, threadsGeneration: number, permitExpiresAt: string, boundaryInput: unknown, now: string): void {
  requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  const boundary = validateOperationalBoundaryV1(boundaryInput);
  const spec = db.query<{ spec_sha256: string }, [string]>("SELECT spec_sha256 FROM catfood_run_specs WHERE run_id=?").get(lease.run_id);
  if (!spec || boundary.capability !== capability || boundary.fencing_generation !== threadsGeneration || boundary.authority_state !== "ACTIVE" || boundary.execution_state !== "PERMITTED" || boundary.permit_expires_at !== permitExpiresAt) throw new CatfoodError("AUTHORITY_MAPPING_MISMATCH");
  db.transaction(() => {
    db.query("INSERT INTO catfood_authority_epochs VALUES (?,?,?,?,?,?,?,?,?)")
      .run(lease.run_id, lease.wp3_epoch, capability, authorityRef, spec.spec_sha256, threadsGeneration, permitExpiresAt, boundary.canonical_sha256, now);
    appendEvidence(db, lease.run_id, "authority_acquired", now, { wp3_epoch: lease.wp3_epoch, capability, authority_ref: authorityRef, threads_generation: threadsGeneration, permit_expires_at: permitExpiresAt, boundary_sha256: boundary.canonical_sha256, boundary: jsonValue(boundary) });
  }).immediate();
}

export function recordAuthorityRenewal(db: Database, lease: Lease, capability: CatfoodCapability, boundaryInput: unknown, now: string): void {
  requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  const boundary = validateOperationalBoundaryV1(boundaryInput);
  const mapping = db.query<Record<string, unknown>, [string, number, string]>("SELECT * FROM catfood_authority_epochs WHERE run_id=? AND wp3_epoch=? AND capability=?").get(lease.run_id, lease.wp3_epoch, capability);
  if (!mapping || boundary.capability !== capability || boundary.fencing_generation !== mapping.threads_generation
    || boundary.authority_state !== "ACTIVE" || boundary.execution_state !== "PERMITTED" || !boundary.permit_expires_at
    || Date.parse(boundary.permit_expires_at) <= Date.parse(String(mapping.permit_expires_at))) throw new CatfoodError("AUTHORITY_RENEWAL_MISMATCH");
  db.transaction(() => {
    db.query("UPDATE catfood_authority_epochs SET permit_expires_at=?,boundary_sha256=? WHERE run_id=? AND wp3_epoch=? AND capability=?")
      .run(boundary.permit_expires_at, boundary.canonical_sha256, lease.run_id, lease.wp3_epoch, capability);
    appendEvidence(db, lease.run_id, "authority_renewed", now, { wp3_epoch: lease.wp3_epoch, capability, threads_generation: Number(mapping.threads_generation), permit_expires_at: boundary.permit_expires_at, boundary_sha256: boundary.canonical_sha256, boundary: jsonValue(boundary) });
  }).immediate();
}

export interface StartWorkInput { unit_id: string; capability: CatfoodCapability; work_class: string; request_id: string; request: Json; pre_boundary: unknown; cost_state: CostState }

export function startWorkUnit(db: Database, lease: Lease, input: StartWorkInput, now: string): void {
  requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  const boundary = validateOperationalBoundaryV1(input.pre_boundary);
  const authority = db.query<Record<string, unknown>, [string, number, string]>("SELECT * FROM catfood_authority_epochs WHERE run_id=? AND wp3_epoch=? AND capability=?").get(lease.run_id, lease.wp3_epoch, input.capability);
  const stops = boundary.effective_safety_controls as Record<string, unknown>;
  if (!authority || boundary.canonical_sha256 !== authority.boundary_sha256 || boundary.fencing_generation !== authority.threads_generation
    || boundary.execution_state !== "PERMITTED" || boundary.authority_state !== "ACTIVE"
    || boundary.permit_expires_at !== authority.permit_expires_at || Date.parse(String(boundary.permit_expires_at)) <= Date.parse(now)
    || !boundary.enabled_capabilities.includes(input.capability) || stops.global_stop || stops.account_stop || stops.capability_stop
    || boundary.blocked_reasons.length) throw new CatfoodError("WORK_AUTHORITY_MISMATCH");
  if (!["NOT_APPLICABLE", "KNOWN_ZERO"].includes(input.cost_state)) throw new CatfoodError("PAID_WORK_NOT_EXCLUDED");
  db.transaction(() => {
    db.query(`INSERT INTO catfood_work_units(unit_id,run_id,wp3_epoch,capability,work_class,request_id,authority_ref,threads_generation,request_sha256,pre_boundary_sha256,status,cost_state,started_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(input.unit_id, lease.run_id, lease.wp3_epoch, input.capability, input.work_class, input.request_id, authority.authority_ref, authority.threads_generation, canonicalSha256(input.request), boundary.canonical_sha256, "INTENT", input.cost_state, now);
    appendEvidence(db, lease.run_id, "work_intent", now, { unit_id: input.unit_id, request_id: input.request_id, capability: input.capability, wp3_epoch: lease.wp3_epoch, threads_generation: Number(authority.threads_generation), request_sha256: canonicalSha256(input.request), pre_boundary_sha256: boundary.canonical_sha256, boundary: jsonValue(boundary) });
  }).immediate();
}

export function finishWorkUnit(db: Database, lease: Lease, unitId: string, terminalStatus: "SUCCEEDED" | "FAILED" | "BLOCKED", response: Json, postBoundaryInput: unknown, flags: { replay?: boolean; duplicate?: boolean; provider_invoked?: boolean; unsafe_or_ambiguous?: boolean; cost_state: CostState }, now: string): void {
  requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  const unit = db.query<Record<string, unknown>, [string, string]>("SELECT * FROM catfood_work_units WHERE unit_id=? AND run_id=?").get(unitId, lease.run_id);
  if (!unit || unit.status !== "INTENT" || Number(unit.wp3_epoch) !== lease.wp3_epoch) throw new CatfoodError("WORK_UNIT_STATE_INVALID");
  const post = validateOperationalBoundaryV1(postBoundaryInput);
  if (post.capability !== unit.capability || post.fencing_generation !== unit.threads_generation) throw new CatfoodError("WORK_AUTHORITY_MISMATCH");
  if (flags.provider_invoked || flags.cost_state === "KNOWN_NONZERO" || flags.cost_state === "UNKNOWN") terminalStatus = "FAILED";
  db.transaction(() => {
    db.query(`UPDATE catfood_work_units SET status=?,response_sha256=?,post_boundary_sha256=?,cost_state=?,provider_invoked=?,replay=?,duplicate=?,unsafe_or_ambiguous=?,ended_at=? WHERE unit_id=?`)
      .run(terminalStatus, canonicalSha256(response), post.canonical_sha256, flags.cost_state, flags.provider_invoked ? 1 : 0, flags.replay ? 1 : 0, flags.duplicate ? 1 : 0, flags.unsafe_or_ambiguous ? 1 : 0, now, unitId);
    appendEvidence(db, lease.run_id, "work_terminal", now, { unit_id: unitId, status: terminalStatus, response_sha256: canonicalSha256(response), post_boundary_sha256: post.canonical_sha256, boundary: jsonValue(post), ...flags });
    if (flags.provider_invoked || flags.cost_state === "KNOWN_NONZERO" || flags.cost_state === "UNKNOWN") {
      db.query("UPDATE catfood_run_leases SET lifecycle_state='ABORTED',updated_at=? WHERE run_id=?").run(now, lease.run_id);
      appendEvidence(db, lease.run_id, "lifecycle.aborted", now, { wp3_epoch: lease.wp3_epoch, reason: "unexpected_paid_work" });
    }
  }).immediate();
}

export function isMeaningfulWorkUnit(row: Record<string, unknown>): boolean {
  return ["SUCCEEDED", "FAILED", "BLOCKED"].includes(String(row.status)) && Boolean(row.response_sha256) && Boolean(row.post_boundary_sha256)
    && Number(row.replay) === 0 && Number(row.duplicate) === 0 && Number(row.provider_invoked) === 0
    && Number(row.unsafe_or_ambiguous) === 0 && ["NOT_APPLICABLE", "KNOWN_ZERO"].includes(String(row.cost_state));
}

export interface DrainResult { drained: boolean; remaining: number; classifications: readonly { unit_id: string; classification: "terminal" | "pending" | "ambiguous" }[] }

export function classifyDrain(db: Database, runId: string): DrainResult {
  const units = db.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_work_units WHERE run_id=? ORDER BY unit_id").all(runId);
  const classifications = units.map((unit) => ({ unit_id: String(unit.unit_id), classification: (["SUCCEEDED", "FAILED", "BLOCKED"].includes(String(unit.status)) ? "terminal" : Number(unit.unsafe_or_ambiguous) ? "ambiguous" : "pending") as "terminal" | "pending" | "ambiguous" }));
  return Object.freeze({ drained: classifications.every((item) => item.classification === "terminal"), remaining: classifications.filter((item) => item.classification !== "terminal").length, classifications: Object.freeze(classifications) });
}

export async function boundedDrain(
  db: Database,
  runId: string,
  readBoundary: () => Promise<unknown>,
  timeoutMs: number,
  pollMs = 50,
): Promise<DrainResult> {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 300_000) throw new CatfoodError("DRAIN_TIMEOUT_INVALID");
  const deadline = Date.now() + timeoutMs;
  let last = classifyDrain(db, runId);
  while (Date.now() <= deadline) {
    const boundary = validateOperationalBoundaryV1(await readBoundary());
    const flight = boundary.governed_in_flight as Record<string, unknown>;
    last = classifyDrain(db, runId);
    if (boundary.execution_state !== "PERMITTED" && Number(flight.count) === 0 && last.drained) return last;
    if (Date.now() + pollMs > deadline) break;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, pollMs));
  }
  return Object.freeze({ ...last, drained: false });
}

export function recordStopSnapshot(db: Database, lease: Lease, boundaryInput: unknown, now: string): DrainResult {
  requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  const boundary = validateOperationalBoundaryV1(boundaryInput);
  if (boundary.execution_state === "PERMITTED" || boundary.stop_acknowledgement !== "INHIBITED") throw new CatfoodError("STOP_NOT_ACKNOWLEDGED");
  const drain = classifyDrain(db, lease.run_id);
  appendEvidence(db, lease.run_id, "stop_acknowledged", now, { boundary_sha256: boundary.canonical_sha256, boundary: jsonValue(boundary), governed_in_flight: jsonValue(boundary.governed_in_flight), drain: jsonValue(drain) });
  return drain;
}

export interface ClosedBundle { bundle_sha256: string; bundle: Record<string, Json> }

export function closeEvidenceBundle(db: Database, lease: Lease, now: string): ClosedBundle {
  requireLease(db, lease.run_id, lease.owner_id, lease.wp3_epoch, now);
  const existing = db.query<{ bundle_json: string; bundle_sha256: string }, [string]>("SELECT bundle_json,bundle_sha256 FROM catfood_evidence_bundles WHERE run_id=?").get(lease.run_id);
  if (existing) return Object.freeze({ bundle_sha256: existing.bundle_sha256, bundle: JSON.parse(existing.bundle_json) });
  return db.transaction(() => {
    const spec = db.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_run_specs WHERE run_id=?").get(lease.run_id);
    const currentLease = leaseRow(db, lease.run_id);
    if (!spec || !currentLease) throw new CatfoodError("RUN_NOT_FOUND");
    const events = db.query<Record<string, unknown>, [string]>("SELECT event_id,event_type,occurred_at,payload_json,payload_sha256 FROM catfood_evidence_events WHERE run_id=? ORDER BY sequence").all(lease.run_id);
    const authorities = db.query<Record<string, unknown>, [string]>("SELECT wp3_epoch,capability,authority_ref,spec_hash,threads_generation,permit_expires_at,boundary_sha256,created_at FROM catfood_authority_epochs WHERE run_id=? ORDER BY wp3_epoch,capability").all(lease.run_id);
    const units = db.query<Record<string, unknown>, [string]>("SELECT * FROM catfood_work_units WHERE run_id=? ORDER BY unit_id").all(lease.run_id);
    const bundle = jsonValue({ bundle_version: 1, evaluator_version: CATFOOD_EVALUATOR_VERSION, closed_at: now, spec: JSON.parse(String(spec.spec_json)), human_go: JSON.parse(String(spec.human_go_json)), lease: { owner_id: currentLease.owner_id, wp3_epoch: currentLease.wp3_epoch, lifecycle_state: currentLease.lifecycle_state, due_state: JSON.parse(String(currentLease.due_state_json)) }, authorities, work_units: units, events: events.map((event) => ({ ...event, payload_json: JSON.parse(String(event.payload_json)) })) }) as Record<string, Json>;
    const text = canonicalJson(bundle); const digest = sha256(text);
    db.query("INSERT INTO catfood_evidence_bundles VALUES (?,?,?,?,?)").run(lease.run_id, text, digest, CATFOOD_EVALUATOR_VERSION, now);
    return Object.freeze({ bundle_sha256: digest, bundle });
  }).immediate();
}

export interface Evaluation { result: AcceptanceState; reason_codes: readonly string[]; bundle_sha256: string; evaluator_version: string }

export function evaluateClosedBundle(text: string, expectedDigest?: string): Evaluation {
  let bundle: Record<string, unknown>;
  try { bundle = object(JSON.parse(text), "bundle"); } catch { throw new CatfoodError("BUNDLE_INVALID"); }
  const digest = sha256(canonicalJson(bundle));
  if (expectedDigest && digest !== expectedDigest) throw new CatfoodError("BUNDLE_TAMPERED");
  const reasons = new Set<string>();
  const spec = object(bundle.spec, "bundle.spec") as unknown as CatfoodRunSpec;
  const lease = object(bundle.lease, "bundle.lease");
  const authorities = Array.isArray(bundle.authorities) ? bundle.authorities.map((authority) => object(authority, "authority")) : [];
  const events = Array.isArray(bundle.events) ? bundle.events.map((event) => object(event, "event")) : [];
  const units = Array.isArray(bundle.work_units) ? bundle.work_units.map((unit) => object(unit, "work_unit")) : [];
  const specForHash = { ...spec } as Record<string, unknown>; delete specForHash.canonical_spec_sha256;
  if (!SHA40.test(String(spec.ikorabu_sha)) || spec.canonical_spec_sha256 !== canonicalSha256(specForHash)
    || spec.threads_sha !== CATFOOD_THREADS_SHA || spec.wp1_contract_sha256 !== CATFOOD_WP1_CONTRACT_SHA256
    || spec.operational_boundary_sha256 !== CATFOOD_BOUNDARY_SHA256 || spec.threads_release_artifact_sha256 !== CATFOOD_THREADS_RELEASE_SHA256) reasons.add("FROZEN_IDENTITY_DRIFT");
  if (spec.night_state !== CATFOOD_NIGHT_STATE) reasons.add("NIGHT_PROFILE_VIOLATION");
  const start = events.find((event) => event.event_type === "lifecycle.running");
  const end = [...events].reverse().find((event) => ["lifecycle.completed", "lifecycle.aborted"].includes(String(event.event_type)));
  if (!start || !end || Date.parse(String(end.occurred_at)) - Date.parse(String(start.occurred_at)) < Number(spec.requested_duration_seconds) * 1000) reasons.add("DURATION_EVIDENCE_INCOMPLETE");
  if (end?.event_type !== "lifecycle.completed") reasons.add("RUN_NOT_COMPLETED");
  const restarts = events.filter((event) => event.event_type === "restart_acquired");
  if (Number(lease.wp3_epoch) < 2 || !authorities.some((authority) => Number(authority.wp3_epoch) >= 2)
    || !restarts.some((event) => {
      const payload = object(event.payload_json, "restart payload");
      return Number(payload.to_epoch) === Number(lease.wp3_epoch) && Number(payload.from_epoch) === Number(payload.to_epoch) - 1;
    })) reasons.add("PLANNED_RESTART_MISSING");
  if (!events.some((event) => event.event_type === "stop_acknowledged")) reasons.add("FINAL_SAFE_STOP_MISSING");
  const meaningful = units.filter(isMeaningfulWorkUnit);
  if (meaningful.length < Number(spec.minimum_meaningful_units)) reasons.add("MEANINGFUL_WORK_THRESHOLD_NOT_MET");
  if (new Set(meaningful.map((unit) => unit.work_class)).size < Number(spec.minimum_work_classes)) reasons.add("WORK_CLASS_THRESHOLD_NOT_MET");
  if (new Set(units.map((unit) => `${unit.capability}:${unit.request_id}`)).size !== units.length || units.some((unit) => Number(unit.replay) || Number(unit.duplicate))) reasons.add("DUPLICATE_COMMITTED_WORK");
  if (units.some((unit) => Number(unit.provider_invoked) || ["UNKNOWN", "KNOWN_NONZERO"].includes(String(unit.cost_state)))) reasons.add("PAID_WORK_VIOLATION");
  if (units.some((unit) => Number(unit.unsafe_or_ambiguous))) reasons.add("UNRESOLVED_UNSAFE_OR_AMBIGUOUS");
  if (units.some((unit) => !["SUCCEEDED", "FAILED", "BLOCKED"].includes(String(unit.status)))) reasons.add("UNRESOLVED_WORK");
  if (events.some((event) => event.event_type === "tenant_isolation_violation")) reasons.add("TENANT_ISOLATION_VIOLATION");
  const observedCapabilities = new Set<string>();
  for (const event of events) {
    const payload = event.payload_json;
    if (event.payload_sha256 !== canonicalSha256(payload)) reasons.add("EVIDENCE_EVENT_TAMPERED");
    const candidate = object(payload, "event payload").boundary;
    if (candidate !== undefined) {
      try {
        const snapshot = validateOperationalBoundaryV1(candidate);
        if (snapshot.capability) observedCapabilities.add(snapshot.capability);
        const release = snapshot.producer_release_identity as Record<string, unknown> | null;
        if (!release || release.git_sha !== CATFOOD_THREADS_SHA || release.artifact_sha256 !== CATFOOD_THREADS_RELEASE_SHA256
          || snapshot.schema_version !== CATFOOD_TARGET_SCHEMA || snapshot.schema_fingerprint !== spec.target_schema_fingerprint
          || snapshot.migration_provenance_digest !== spec.migration_provenance_digest || snapshot.account_id !== spec.account_id) reasons.add("FROZEN_IDENTITY_DRIFT");
      } catch { reasons.add("BOUNDARY_EVIDENCE_INVALID"); }
    }
  }
  if (canonicalJson([...observedCapabilities].sort()) !== canonicalJson([...spec.capabilities].sort())) reasons.add("REQUIRED_SOURCE_EVIDENCE_INCOMPLETE");
  const closedAt = Date.parse(String(bundle.closed_at));
  if (!Number.isFinite(closedAt) || events.some((event) => Date.parse(String(event.occurred_at)) > closedAt)) reasons.add("BUNDLE_TIMELINE_INVALID");
  const fail = [...reasons].some((reason) => ["FROZEN_IDENTITY_DRIFT", "NIGHT_PROFILE_VIOLATION", "DUPLICATE_COMMITTED_WORK", "PAID_WORK_VIOLATION", "UNRESOLVED_UNSAFE_OR_AMBIGUOUS", "TENANT_ISOLATION_VIOLATION", "EVIDENCE_EVENT_TAMPERED", "BOUNDARY_EVIDENCE_INVALID", "BUNDLE_TIMELINE_INVALID"].includes(reason));
  return Object.freeze({ result: reasons.size === 0 ? "PASS" : fail ? "FAIL" : "BLOCKED", reason_codes: Object.freeze([...reasons].sort()), bundle_sha256: digest, evaluator_version: CATFOOD_EVALUATOR_VERSION });
}
