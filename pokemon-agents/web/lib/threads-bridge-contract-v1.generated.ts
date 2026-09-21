/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 * Source contract: Threads-/tests/fixtures/bridge_contract_v1.json
 * Source schema: Threads Bridge response contract v1 (CONTRACT02A).
 *
 * These are transport shapes. Dashboard-facing camelCase view models remain
 * intentionally separate in threads-dashboard.ts.
 */

export const THREADS_BRIDGE_SCHEMA_VERSION = 1 as const;

export interface BridgeMetaV1 {
  schema_version: typeof THREADS_BRIDGE_SCHEMA_VERSION;
  [key: string]: unknown;
}

export type BridgeJsonObject = Record<string, unknown>;
export type BridgeMetricMapV1 = Record<string, number>;

export interface BridgeAccountReadinessV1 extends BridgeJsonObject {
  config_ok: boolean;
  config_problems: string[];
  n_research_posts: number;
  has_style_profile: boolean;
  style_profile_version: number | null;
  persona_provenance: string;
  persona_usable_for_generation: boolean;
  n_verified_facts: number;
  verified_fact_keys: string[];
  n_plans: number;
  status: string;
  ready_for_dry_run: boolean;
  blocking: string[];
  requires_owner_oauth_before_live: boolean;
}

export interface BridgePipelineV1 extends BridgeJsonObject {
  n_contents: number;
  contents_by_state: Record<string, number>;
  n_publications: number;
  publications_by_mode: Record<string, number>;
  n_metrics: number;
  has_learning_snapshot: boolean;
  n_audit_events: number;
}

export interface BridgeAccountSummaryV1 extends BridgeJsonObject {
  account_id: string;
  handle: string;
  display_name: string;
  domain_id: string;
  account_status: string;
  updated_at: string;
  readiness: BridgeAccountReadinessV1;
  pipeline: BridgePipelineV1;
}

export interface BridgeAccountsResponseV1 extends BridgeJsonObject {
  accounts: BridgeAccountSummaryV1[];
  meta: BridgeMetaV1;
}

export interface BridgeRecentContentV1 extends BridgeJsonObject {
  content_id: string;
  plan_id: string;
  version: number;
  attempt: number;
  state: string;
  content_hash: string;
  n_chars: number;
  created_at: string;
  updated_at: string;
  origin: string;
  analyze_enabled: boolean;
  learn_enabled: boolean;
  qa: BridgeJsonObject | null;
}

export interface BridgeRecentPublicationV1 extends BridgeJsonObject {
  publication_id: string;
  content_id: string;
  mode: string;
  status: string;
  error: string | null;
  created_at: string;
  published_at: string | null;
}

export interface BridgeManualThreadPartV1 extends BridgeJsonObject {
  external_post_id: string;
  reply_to_external_id: string | null;
  part_index: number;
  body_text: string;
  published_at: string;
  permalink: string | null;
  metrics: BridgeMetricMapV1;
}

export interface BridgeManualThreadV1 extends BridgeJsonObject {
  detection_id: string;
  logical_thread_id: string;
  root_external_id: string;
  external_post_id: string;
  body_text: string;
  published_at: string;
  permalink: string | null;
  origin: string;
  analyze_enabled: boolean;
  learn_enabled: boolean;
  topic: string | null;
  content_role: string | null;
  hypothesis: string | null;
  part_index: number;
  n_parts: number;
  parts: BridgeManualThreadPartV1[];
  thread_metrics: BridgeMetricMapV1;
  thread_metric_semantics: string;
  tracking_state: string;
  content_id: string | null;
  detected_at: string;
  updated_at: string;
}

export interface BridgeNightBatchItemV1 extends BridgeJsonObject {
  item_id: string;
  batch_id: string;
  content_id: string;
  scheduled_at: string;
  status: string;
  block_reason: string | null;
  attempted_at: string | null;
  batch_status: string;
  expires_at: string;
}

export interface BridgeOperationsV1 extends BridgeJsonObject {
  night_batch_items: BridgeNightBatchItemV1[];
  rolling_usage: {
    publications_last_hour: number;
    publications_last_24h: number;
    [key: string]: unknown;
  };
  features: {
    manual_post_sync: boolean;
    self_reply_sync: string;
    [key: string]: unknown;
  };
}

export interface BridgeAccountResponseV1 extends BridgeAccountSummaryV1 {
  approval_queue: BridgeJsonObject[];
  recent_contents: BridgeRecentContentV1[];
  recent_publications: BridgeRecentPublicationV1[];
  recent_audit_events: BridgeJsonObject[];
  manual_posts: BridgeManualThreadV1[];
  operations: BridgeOperationsV1;
  meta: BridgeMetaV1;
}

export interface BridgeContentResponseV1 extends BridgeJsonObject {
  account_id: string;
  content_id: string;
  plan_id: string;
  plan_seq: number;
  topic: string;
  content_role: string;
  version: number;
  attempt: number;
  state: string;
  origin: string;
  analyze_enabled: boolean;
  learn_enabled: boolean;
  content_hash: string;
  created_at: string;
  updated_at: string;
  parts: string[];
  body_text: string;
  n_parts: number;
  n_chars: number;
  qa: BridgeJsonObject | null;
  generation: BridgeJsonObject | null;
  approval_events: BridgeJsonObject[];
  publications: BridgeJsonObject[];
  metrics: BridgeMetricMapV1;
  metrics_observation: BridgeJsonObject | null;
  approved_for_current_body: boolean;
  meta: BridgeMetaV1;
}

export interface BridgeSafetyResponseV1 extends BridgeJsonObject {
  status: string;
  capability: string;
  request_id: string;
  account_id: string;
  account_status: string;
  global_stop: boolean;
  account_stop: boolean;
  capability_stop: boolean;
  approval_mode: string;
  publish_readiness: BridgeJsonObject | null;
  unresolved_ambiguous_publication: boolean;
  rate_guard_ready: boolean;
  rate_policy: Record<string, number | null>;
  warnings: string[];
  error: BridgeJsonObject | null;
  meta: BridgeMetaV1;
}

export interface BridgeEditorialCycleV1 extends BridgeJsonObject {
  cycle_id: string;
  account_id: string;
  cycle_key: string;
  state: string;
  status: string;
  current_agent: string | null;
  waiting_reason: string | null;
  source_content_ids: string[];
  config: BridgeJsonObject;
  summary: BridgeJsonObject;
  brief: BridgeJsonObject | null;
  draft: BridgeJsonObject | null;
  content_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BridgeEditorialExperimentV1 extends BridgeJsonObject {
  experiment_id: string;
  account_id: string;
  cycle_id: string;
  created_at: string;
  source_content_ids: string[];
  hypothesis: BridgeJsonObject;
  test_variable: string;
  constants: string[];
  success_signal: BridgeJsonObject;
  failure_signal: BridgeJsonObject;
  minimum_sample: BridgeJsonObject;
  status: string;
  decision: BridgeJsonObject;
  result_summary: string | null;
  evidence_level: string;
}

export interface BridgeEditorialInternalResponseV1 extends BridgeJsonObject {
  account_id: string;
  cycle: BridgeEditorialCycleV1 | null;
  experiments: BridgeEditorialExperimentV1[];
  private_chain_of_thought_stored?: boolean;
  meta: BridgeMetaV1;
}

export interface BridgeEditorialCustomerSummaryV1 extends BridgeJsonObject {
  "今回試したこと": string;
  "確認できた事実": string[];
  "次回変えること": string;
}

export interface BridgeEditorialCustomerResponseV1 extends BridgeJsonObject {
  account_id: string;
  summary: BridgeEditorialCustomerSummaryV1 | null;
  meta: BridgeMetaV1;
}
