import {
  THREADS_BRIDGE_SCHEMA_VERSION,
  type BridgeAccountResponseV1,
  type BridgeAccountsResponseV1,
  type BridgeContentResponseV1,
  type BridgeEditorialCustomerResponseV1,
  type BridgeEditorialInternalResponseV1,
  type BridgeJsonObject,
  type BridgeSafetyResponseV1,
} from "./threads-bridge-contract-v1.generated";

export type ThreadsBridgeStatus =
  | "HEALTHY"
  | "HEALTHY_EMPTY"
  | "UNREACHABLE"
  | "UNAUTHORIZED"
  | "ACCOUNT_NOT_FOUND"
  | "SCHEMA_INCOMPATIBLE"
  | "MALFORMED_RESPONSE";

export class ThreadsBridgeContractError extends Error {
  constructor(
    public readonly code: Exclude<ThreadsBridgeStatus, "HEALTHY" | "HEALTHY_EMPTY">,
    public readonly reason: string,
  ) {
    super(code);
    this.name = "ThreadsBridgeContractError";
  }
}

type FetchLike = typeof fetch;

function malformed(reason: string): never {
  throw new ThreadsBridgeContractError("MALFORMED_RESPONSE", reason);
}

function incompatible(reason: string): never {
  throw new ThreadsBridgeContractError("SCHEMA_INCOMPATIBLE", reason);
}

function object(value: unknown, path: string): BridgeJsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) malformed(`${path}:object`);
  return value as BridgeJsonObject;
}

function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) malformed(`${path}:array`);
  return value;
}

function string(value: unknown, path: string): string {
  if (typeof value !== "string") malformed(`${path}:string`);
  return value;
}

function nullableString(value: unknown, path: string): string | null {
  if (value === null) return null;
  return string(value, path);
}

function boolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") malformed(`${path}:boolean`);
  return value;
}

function oneOf<T extends string>(value: unknown, path: string, values: readonly T[]): T {
  if (typeof value !== "string" || !values.includes(value as T)) malformed(`${path}:enum`);
  return value as T;
}

function nonNegativeNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    malformed(`${path}:non-negative-finite-number`);
  }
  return value;
}

function nonNegativeInteger(value: unknown, path: string): number {
  const number = nonNegativeNumber(value, path);
  if (!Number.isInteger(number)) malformed(`${path}:integer`);
  return number;
}

function nullableNonNegativeInteger(value: unknown, path: string): number | null {
  if (value === null) return null;
  return nonNegativeInteger(value, path);
}

function timestamp(value: unknown, path: string): string {
  const got = string(value, path);
  if (!got || !Number.isFinite(Date.parse(got))) malformed(`${path}:iso-8601`);
  return got;
}

function nullableTimestamp(value: unknown, path: string): string | null {
  if (value === null) return null;
  return timestamp(value, path);
}

function stringArray(value: unknown, path: string): string[] {
  return array(value, path).map((item, index) => string(item, `${path}[${index}]`));
}

function recordArray(value: unknown, path: string): BridgeJsonObject[] {
  return array(value, path).map((item, index) => object(item, `${path}[${index}]`));
}

function metricMap(value: unknown, path: string): Record<string, number> {
  const got = object(value, path);
  for (const [key, metric] of Object.entries(got)) {
    nonNegativeNumber(metric, `${path}.${key}`);
  }
  return got as Record<string, number>;
}

function countMap(value: unknown, path: string): Record<string, number> {
  const got = object(value, path);
  for (const [key, count] of Object.entries(got)) {
    nonNegativeInteger(count, `${path}.${key}`);
  }
  return got as Record<string, number>;
}

function nullableObject(value: unknown, path: string): BridgeJsonObject | null {
  if (value === null) return null;
  return object(value, path);
}

function validateMeta(root: BridgeJsonObject): void {
  const meta = root.meta;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) incompatible("malformed-meta");
  const version = (meta as BridgeJsonObject).schema_version;
  if (version === undefined) incompatible("missing-schema-version");
  if (version !== THREADS_BRIDGE_SCHEMA_VERSION) incompatible("unsupported-schema-version");
}

export function parseTenantIdentityResponseV1(value: unknown) {
  const root = object(value, "tenant.identity");
  validateMeta(root);
  const userId = string(root.user_id, "tenant.identity.user_id");
  const organizationId = string(root.org_id, "tenant.identity.org_id");
  const role = string(root.role, "tenant.identity.role");
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:@-]{0,199}$/.test(userId)) {
    malformed("tenant.identity.user_id:canonical-id");
  }
  if (!organizationId.trim() || organizationId.length > 200) {
    malformed("tenant.identity.org_id:canonical-id");
  }
  if (role !== "viewer" && role !== "editor" && role !== "admin") {
    malformed("tenant.identity.role:known-role");
  }
  return { userId, organizationId, role };
}

function validateReadiness(value: unknown, path: string): void {
  const got = object(value, path);
  boolean(got.config_ok, `${path}.config_ok`);
  stringArray(got.config_problems, `${path}.config_problems`);
  nonNegativeInteger(got.n_research_posts, `${path}.n_research_posts`);
  boolean(got.has_style_profile, `${path}.has_style_profile`);
  nullableNonNegativeInteger(got.style_profile_version, `${path}.style_profile_version`);
  string(got.persona_provenance, `${path}.persona_provenance`);
  boolean(got.persona_usable_for_generation, `${path}.persona_usable_for_generation`);
  nonNegativeInteger(got.n_verified_facts, `${path}.n_verified_facts`);
  stringArray(got.verified_fact_keys, `${path}.verified_fact_keys`);
  nonNegativeInteger(got.n_plans, `${path}.n_plans`);
  string(got.status, `${path}.status`);
  boolean(got.ready_for_dry_run, `${path}.ready_for_dry_run`);
  stringArray(got.blocking, `${path}.blocking`);
  boolean(got.requires_owner_oauth_before_live, `${path}.requires_owner_oauth_before_live`);
}

function validatePipeline(value: unknown, path: string): void {
  const got = object(value, path);
  nonNegativeInteger(got.n_contents, `${path}.n_contents`);
  countMap(got.contents_by_state, `${path}.contents_by_state`);
  nonNegativeInteger(got.n_publications, `${path}.n_publications`);
  countMap(got.publications_by_mode, `${path}.publications_by_mode`);
  nonNegativeInteger(got.n_metrics, `${path}.n_metrics`);
  boolean(got.has_learning_snapshot, `${path}.has_learning_snapshot`);
  nonNegativeInteger(got.n_audit_events, `${path}.n_audit_events`);
}

function validateAccountSummary(value: unknown, path: string): BridgeJsonObject {
  const got = object(value, path);
  string(got.account_id, `${path}.account_id`);
  string(got.handle, `${path}.handle`);
  string(got.display_name, `${path}.display_name`);
  string(got.domain_id, `${path}.domain_id`);
  string(got.account_status, `${path}.account_status`);
  timestamp(got.updated_at, `${path}.updated_at`);
  validateReadiness(got.readiness, `${path}.readiness`);
  validatePipeline(got.pipeline, `${path}.pipeline`);
  return got;
}

function validateRecentContent(value: unknown, path: string): void {
  const got = object(value, path);
  for (const key of ["content_id", "plan_id", "state", "content_hash", "origin"] as const) {
    string(got[key], `${path}.${key}`);
  }
  for (const key of ["version", "attempt", "n_chars"] as const) {
    nonNegativeInteger(got[key], `${path}.${key}`);
  }
  timestamp(got.created_at, `${path}.created_at`);
  timestamp(got.updated_at, `${path}.updated_at`);
  boolean(got.analyze_enabled, `${path}.analyze_enabled`);
  boolean(got.learn_enabled, `${path}.learn_enabled`);
  nullableObject(got.qa, `${path}.qa`);
}

function validateRecentPublication(value: unknown, path: string): void {
  const got = object(value, path);
  for (const key of ["publication_id", "content_id", "mode", "status"] as const) {
    string(got[key], `${path}.${key}`);
  }
  nullableString(got.error, `${path}.error`);
  timestamp(got.created_at, `${path}.created_at`);
  nullableTimestamp(got.published_at, `${path}.published_at`);
}

function validateManualThread(value: unknown, path: string): void {
  const got = object(value, path);
  for (const key of [
    "detection_id", "logical_thread_id", "root_external_id", "external_post_id",
    "body_text", "origin", "thread_metric_semantics", "tracking_state",
  ] as const) string(got[key], `${path}.${key}`);
  timestamp(got.published_at, `${path}.published_at`);
  nullableString(got.permalink, `${path}.permalink`);
  boolean(got.analyze_enabled, `${path}.analyze_enabled`);
  boolean(got.learn_enabled, `${path}.learn_enabled`);
  for (const key of ["topic", "content_role", "hypothesis", "content_id"] as const) {
    nullableString(got[key], `${path}.${key}`);
  }
  nonNegativeInteger(got.part_index, `${path}.part_index`);
  nonNegativeInteger(got.n_parts, `${path}.n_parts`);
  const parts = array(got.parts, `${path}.parts`);
  parts.forEach((part, index) => {
    const row = object(part, `${path}.parts[${index}]`);
    string(row.external_post_id, `${path}.parts[${index}].external_post_id`);
    nullableString(row.reply_to_external_id, `${path}.parts[${index}].reply_to_external_id`);
    nonNegativeInteger(row.part_index, `${path}.parts[${index}].part_index`);
    string(row.body_text, `${path}.parts[${index}].body_text`);
    timestamp(row.published_at, `${path}.parts[${index}].published_at`);
    nullableString(row.permalink, `${path}.parts[${index}].permalink`);
    metricMap(row.metrics, `${path}.parts[${index}].metrics`);
  });
  metricMap(got.thread_metrics, `${path}.thread_metrics`);
  timestamp(got.detected_at, `${path}.detected_at`);
  timestamp(got.updated_at, `${path}.updated_at`);
}

function validateOperations(value: unknown, path: string): void {
  const got = object(value, path);
  array(got.night_batch_items, `${path}.night_batch_items`).forEach((item, index) => {
    const row = object(item, `${path}.night_batch_items[${index}]`);
    for (const key of ["item_id", "batch_id", "content_id", "status", "batch_status"] as const) {
      string(row[key], `${path}.night_batch_items[${index}].${key}`);
    }
    timestamp(row.scheduled_at, `${path}.night_batch_items[${index}].scheduled_at`);
    nullableString(row.block_reason, `${path}.night_batch_items[${index}].block_reason`);
    nullableTimestamp(row.attempted_at, `${path}.night_batch_items[${index}].attempted_at`);
    timestamp(row.expires_at, `${path}.night_batch_items[${index}].expires_at`);
  });
  const attention = object(got.night_attention, `${path}.night_attention`);
  nonNegativeInteger(attention.window_hours, `${path}.night_attention.window_hours`);
  nonNegativeInteger(attention.total, `${path}.night_attention.total`);
  countMap(attention.by_reason, `${path}.night_attention.by_reason`);
  const attentionTruncated = boolean(attention.items_truncated, `${path}.night_attention.items_truncated`);
  const attentionCoverage = oneOf(attention.coverage, `${path}.night_attention.coverage`, ["complete", "partial", "unknown"] as const);
  if (attentionTruncated && attentionCoverage === "complete") malformed(`${path}.night_attention.coverage:truncated-complete`);
  const quarantine = object(got.insights_quarantine, `${path}.insights_quarantine`);
  nonNegativeInteger(quarantine.total, `${path}.insights_quarantine.total`);
  const quarantineTruncated = boolean(quarantine.items_truncated, `${path}.insights_quarantine.items_truncated`);
  const quarantineCoverage = oneOf(quarantine.coverage, `${path}.insights_quarantine.coverage`, ["complete", "partial", "unknown"] as const);
  if (quarantineTruncated && quarantineCoverage === "complete") malformed(`${path}.insights_quarantine.coverage:truncated-complete`);
  array(quarantine.items, `${path}.insights_quarantine.items`).forEach((item, index) => {
    const row = object(item, `${path}.insights_quarantine.items[${index}]`);
    string(row.content_id, `${path}.insights_quarantine.items[${index}].content_id`);
    nonNegativeInteger(row.failure_count, `${path}.insights_quarantine.items[${index}].failure_count`);
    timestamp(row.last_failed_at, `${path}.insights_quarantine.items[${index}].last_failed_at`);
    string(row.error_code, `${path}.insights_quarantine.items[${index}].error_code`);
  });
  const runnerNames = new Set<string>();
  array(got.runner_heartbeats, `${path}.runner_heartbeats`).forEach((item, index) => {
    const row = object(item, `${path}.runner_heartbeats[${index}]`);
    const runnerName = oneOf(row.runner_name, `${path}.runner_heartbeats[${index}].runner_name`, ["insights", "outcome", "night_batch"] as const);
    if (runnerNames.has(runnerName)) malformed(`${path}.runner_heartbeats[${index}].runner_name:duplicate`);
    runnerNames.add(runnerName);
    const state = oneOf(row.state, `${path}.runner_heartbeats[${index}].state`, ["fresh", "stale", "missing", "invalid", "future"] as const);
    if (row.run_status !== null) oneOf(row.run_status, `${path}.runner_heartbeats[${index}].run_status`, ["succeeded", "failed"] as const);
    const lastRunAt = nullableString(row.last_run_at, `${path}.runner_heartbeats[${index}].last_run_at`);
    if (state === "fresh" || state === "stale") {
      if (lastRunAt === null) malformed(`${path}.runner_heartbeats[${index}].last_run_at:required-evidence`);
      timestamp(lastRunAt, `${path}.runner_heartbeats[${index}].last_run_at`);
      if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(lastRunAt)) malformed(`${path}.runner_heartbeats[${index}].last_run_at:timezone`);
    }
    nullableNonNegativeInteger(row.age_seconds, `${path}.runner_heartbeats[${index}].age_seconds`);
    oneOf(row.expected, `${path}.runner_heartbeats[${index}].expected`, ["unknown"] as const);
    boolean(row.healthy, `${path}.runner_heartbeats[${index}].healthy`);
  });
  for (const runnerName of ["insights", "outcome", "night_batch"] as const) {
    if (!runnerNames.has(runnerName)) malformed(`${path}.runner_heartbeats:${runnerName}:missing`);
  }
  const usage = object(got.rolling_usage, `${path}.rolling_usage`);
  nonNegativeInteger(usage.publications_last_hour, `${path}.rolling_usage.publications_last_hour`);
  nonNegativeInteger(usage.publications_last_24h, `${path}.rolling_usage.publications_last_24h`);
  const features = object(got.features, `${path}.features`);
  boolean(features.manual_post_sync, `${path}.features.manual_post_sync`);
  string(features.self_reply_sync, `${path}.features.self_reply_sync`);
}

export function parseAccountsResponseV1(value: unknown): BridgeAccountsResponseV1 {
  const root = object(value, "accounts");
  validateMeta(root);
  array(root.accounts, "accounts.accounts").forEach((item, index) => {
    validateAccountSummary(item, `accounts.accounts[${index}]`);
  });
  return root as BridgeAccountsResponseV1;
}

export function parseAccountResponseV1(value: unknown): BridgeAccountResponseV1 {
  const root = validateAccountSummary(value, "account");
  validateMeta(root);
  recordArray(root.approval_queue, "account.approval_queue");
  array(root.recent_contents, "account.recent_contents").forEach((item, index) => {
    validateRecentContent(item, `account.recent_contents[${index}]`);
  });
  array(root.recent_publications, "account.recent_publications").forEach((item, index) => {
    validateRecentPublication(item, `account.recent_publications[${index}]`);
  });
  recordArray(root.recent_audit_events, "account.recent_audit_events");
  array(root.manual_posts, "account.manual_posts").forEach((item, index) => {
    validateManualThread(item, `account.manual_posts[${index}]`);
  });
  validateOperations(root.operations, "account.operations");
  return root as BridgeAccountResponseV1;
}

export function parseContentResponseV1(value: unknown): BridgeContentResponseV1 {
  const root = object(value, "content");
  validateMeta(root);
  for (const key of [
    "account_id", "content_id", "plan_id", "topic", "content_role", "state", "origin",
    "content_hash", "body_text",
  ] as const) string(root[key], `content.${key}`);
  for (const key of ["plan_seq", "version", "attempt", "n_parts", "n_chars"] as const) {
    nonNegativeInteger(root[key], `content.${key}`);
  }
  boolean(root.analyze_enabled, "content.analyze_enabled");
  boolean(root.learn_enabled, "content.learn_enabled");
  timestamp(root.created_at, "content.created_at");
  timestamp(root.updated_at, "content.updated_at");
  stringArray(root.parts, "content.parts");
  nullableObject(root.qa, "content.qa");
  nullableObject(root.generation, "content.generation");
  recordArray(root.approval_events, "content.approval_events");
  recordArray(root.publications, "content.publications");
  metricMap(root.metrics, "content.metrics");
  const observation = nullableObject(root.metrics_observation, "content.metrics_observation");
  if (observation) {
    timestamp(observation.observed_at, "content.metrics_observation.observed_at");
    timestamp(observation.fetched_at, "content.metrics_observation.fetched_at");
    stringArray(observation.available_keys, "content.metrics_observation.available_keys");
    string(observation.source, "content.metrics_observation.source");
  }
  boolean(root.approved_for_current_body, "content.approved_for_current_body");
  return root as BridgeContentResponseV1;
}

export function parseSafetyResponseV1(value: unknown): BridgeSafetyResponseV1 {
  const root = object(value, "safety");
  validateMeta(root);
  for (const key of ["status", "capability", "request_id", "account_id", "account_status", "approval_mode"] as const) {
    string(root[key], `safety.${key}`);
  }
  for (const key of ["global_stop", "account_stop", "capability_stop", "unresolved_ambiguous_publication", "rate_guard_ready"] as const) {
    boolean(root[key], `safety.${key}`);
  }
  nullableObject(root.publish_readiness, "safety.publish_readiness");
  const policy = object(root.rate_policy, "safety.rate_policy");
  for (const key of ["min_interval_seconds", "hourly_limit", "daily_limit"] as const) {
    nullableNonNegativeInteger(policy[key], `safety.rate_policy.${key}`);
  }
  stringArray(root.warnings, "safety.warnings");
  nullableObject(root.error, "safety.error");
  return root as BridgeSafetyResponseV1;
}

function validateEditorialCycle(value: unknown, path: string): void {
  const cycle = object(value, path);
  for (const key of ["cycle_id", "account_id", "cycle_key", "state", "status"] as const) {
    string(cycle[key], `${path}.${key}`);
  }
  nullableString(cycle.current_agent, `${path}.current_agent`);
  nullableString(cycle.waiting_reason, `${path}.waiting_reason`);
  stringArray(cycle.source_content_ids, `${path}.source_content_ids`);
  object(cycle.config, `${path}.config`);
  object(cycle.summary, `${path}.summary`);
  nullableObject(cycle.brief, `${path}.brief`);
  nullableObject(cycle.draft, `${path}.draft`);
  nullableString(cycle.content_id, `${path}.content_id`);
  timestamp(cycle.created_at, `${path}.created_at`);
  timestamp(cycle.updated_at, `${path}.updated_at`);
}

export function parseEditorialInternalResponseV1(value: unknown): BridgeEditorialInternalResponseV1 {
  const root = object(value, "editorial.internal");
  validateMeta(root);
  string(root.account_id, "editorial.internal.account_id");
  if (root.cycle !== null) validateEditorialCycle(root.cycle, "editorial.internal.cycle");
  const experiments = array(root.experiments, "editorial.internal.experiments");
  experiments.forEach((item, index) => {
    const row = object(item, `editorial.internal.experiments[${index}]`);
    for (const key of ["experiment_id", "account_id", "cycle_id", "test_variable", "status", "evidence_level"] as const) {
      string(row[key], `editorial.internal.experiments[${index}].${key}`);
    }
    timestamp(row.created_at, `editorial.internal.experiments[${index}].created_at`);
    stringArray(row.source_content_ids, `editorial.internal.experiments[${index}].source_content_ids`);
    object(row.hypothesis, `editorial.internal.experiments[${index}].hypothesis`);
    stringArray(row.constants, `editorial.internal.experiments[${index}].constants`);
    object(row.success_signal, `editorial.internal.experiments[${index}].success_signal`);
    object(row.failure_signal, `editorial.internal.experiments[${index}].failure_signal`);
    object(row.minimum_sample, `editorial.internal.experiments[${index}].minimum_sample`);
    object(row.decision, `editorial.internal.experiments[${index}].decision`);
    nullableString(row.result_summary, `editorial.internal.experiments[${index}].result_summary`);
  });
  if (root.private_chain_of_thought_stored !== undefined) {
    boolean(root.private_chain_of_thought_stored, "editorial.internal.private_chain_of_thought_stored");
  }
  return root as BridgeEditorialInternalResponseV1;
}

export function parseEditorialCustomerResponseV1(value: unknown): BridgeEditorialCustomerResponseV1 {
  const root = object(value, "editorial.customer");
  validateMeta(root);
  string(root.account_id, "editorial.customer.account_id");
  const summary = nullableObject(root.summary, "editorial.customer.summary");
  if (summary) {
    string(summary["今回試したこと"], "editorial.customer.summary.tried");
    stringArray(summary["確認できた事実"], "editorial.customer.summary.confirmed_facts");
    string(summary["次回変えること"], "editorial.customer.summary.next_change");
  }
  return root as BridgeEditorialCustomerResponseV1;
}

export async function getContractJson<T>(
  fetcher: FetchLike,
  url: string,
  headers: HeadersInit,
  signal: AbortSignal,
  parse: (value: unknown) => T,
): Promise<T> {
  let response: Response;
  try {
    response = await fetcher(url, { method: "GET", headers, signal });
  } catch {
    throw new ThreadsBridgeContractError("UNREACHABLE", "transport");
  }
  if (response.status === 401 || response.status === 403) {
    throw new ThreadsBridgeContractError("UNAUTHORIZED", "http-auth");
  }
  if (response.status === 404) {
    throw new ThreadsBridgeContractError("ACCOUNT_NOT_FOUND", "http-not-found");
  }
  if (!response.ok) {
    throw new ThreadsBridgeContractError("UNREACHABLE", "http-unavailable");
  }
  let value: unknown;
  try {
    value = await response.json();
  } catch {
    throw new ThreadsBridgeContractError("MALFORMED_RESPONSE", "invalid-json");
  }
  return parse(value);
}

export function bridgeFailureStatus(error: unknown): Exclude<ThreadsBridgeStatus, "HEALTHY" | "HEALTHY_EMPTY"> {
  return error instanceof ThreadsBridgeContractError ? error.code : "UNREACHABLE";
}
