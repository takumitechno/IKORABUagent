/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 * Source: pokemon-agents/contracts/bridge_contract_v1.json
 * Producer contract revision: 10a071390daea91c9c687bc60fff4da8cee4c061
 * Artifact SHA-256: 14ed73d33a02b3f8877a3045d226f23b7d9e7686f9dc2c8ef595aeae934fa3dc
 */

export const THREADS_BRIDGE_SCHEMA_VERSION = 1 as const;
export type BridgeJsonObject = Record<string, unknown>;
export type BridgeMetricMapV1 = Record<string, number>;

export type AccountPipelineStatus = {
  "contents_by_state": Record<string, number>;
  "has_learning_snapshot": boolean;
  "n_audit_events": number;
  "n_contents": number;
  "n_metrics": number;
  "n_publications": number;
  "publications_by_mode": Record<string, number>;
  [key: string]: unknown;
};

export type AccountReadiness = {
  "blocking": Array<string>;
  "config_ok": boolean;
  "config_problems": Array<string>;
  "has_style_profile": boolean;
  "n_plans": number;
  "n_research_posts": number;
  "n_verified_facts": number;
  "persona_provenance": string;
  "persona_usable_for_generation": boolean;
  "ready_for_dry_run": boolean;
  "requires_owner_oauth_before_live": boolean;
  "status": string;
  "style_profile_version": number | null;
  "verified_fact_keys": Array<string>;
  [key: string]: unknown;
};

export type ApprovalQueueItem = {
  "attempt": number;
  "content_hash": string;
  "content_id": string;
  "plan_id": string;
  "preview_chars": number;
  "version": number;
  [key: string]: unknown;
};

export type CapabilityError = {
  "code": string;
  "message": string;
};

export type ContentApprovalEvent = {
  "action": string;
  "actor": string;
  "created_at": string;
  "matches_current_body": boolean;
  [key: string]: unknown;
};

export type ContentGeneration = {
  "attempt": number;
  "contract_version": string | null;
  "created_at": string;
  "model": string;
  "provider": string;
  "provider_request_id": string | null;
  "qa_verdict": string | null;
  "request_fingerprint": string | null;
  "semantic_findings": Array<{
  [key: string]: unknown;
}>;
  "style_profile_version": number | null;
  "verified_fact_keys": Array<string>;
  [key: string]: unknown;
};

export type ContentPublication = {
  "attempts": number;
  "created_at": string;
  "external_publish_id": string | null;
  "matches_current_body": boolean;
  "mode": string;
  "parts_state": Array<{
  [key: string]: unknown;
}>;
  "permalink": string | null;
  "published_at": string | null;
  "status": string;
  "updated_at": string | null;
  [key: string]: unknown;
};

export type ContentQaDetail = {
  "created_at": string;
  "findings": Array<{
  [key: string]: unknown;
}>;
  "n_results": number;
  "verdict": string;
  [key: string]: unknown;
};

export type ContentQaSummary = {
  "findings": Array<{
  [key: string]: unknown;
}>;
  "verdict": string;
  [key: string]: unknown;
};

export type ContractMeta = {
  "schema_version": 1;
  [key: string]: unknown;
};

export type EditorialCustomerResponse = {
  "account_id": string;
  "meta": ContractMeta;
  "summary": EditorialCustomerSummary | null;
  [key: string]: unknown;
};

export type EditorialCustomerSummary = {
  "今回試したこと": string;
  "次回変えること": string;
  "確認できた事実": Array<string>;
  [key: string]: unknown;
};

export type EditorialCycle = {
  "account_id": string;
  "brief": {
  [key: string]: unknown;
} | null;
  "config": {
  [key: string]: unknown;
};
  "content_id": string | null;
  "created_at": string;
  "current_agent": string | null;
  "cycle_id": string;
  "cycle_key": string;
  "draft": {
  [key: string]: unknown;
} | null;
  "source_content_ids": Array<string>;
  "state": string;
  "status": string;
  "summary": {
  [key: string]: unknown;
};
  "updated_at": string;
  "waiting_reason": string | null;
  [key: string]: unknown;
};

export type EditorialExperiment = {
  "account_id": string;
  "constants": Array<string>;
  "created_at": string;
  "cycle_id": string;
  "decision": {
  [key: string]: unknown;
};
  "evidence_level": string;
  "experiment_id": string;
  "failure_signal": {
  [key: string]: unknown;
};
  "hypothesis": {
  [key: string]: unknown;
};
  "minimum_sample": {
  [key: string]: unknown;
};
  "result_summary": string | null;
  "source_content_ids": Array<string>;
  "status": string;
  "success_signal": {
  [key: string]: unknown;
};
  "test_variable": string;
  [key: string]: unknown;
};

export type EditorialInternalResponse = {
  "account_id": string;
  "cycle": EditorialCycle | null;
  "experiments": Array<EditorialExperiment>;
  "meta": ContractMeta;
  "private_chain_of_thought_stored"?: boolean;
  [key: string]: unknown;
};

export type EditorialRunOnceCycleResponse = {
  "account_id": string;
  "brief": {
  [key: string]: unknown;
} | null;
  "config": {
  [key: string]: unknown;
};
  "content_id": string | null;
  "created_at": string;
  "current_agent": string | null;
  "cycle_id": string;
  "cycle_key": string;
  "draft": {
  [key: string]: unknown;
} | null;
  "meta": ContractMeta;
  "mutated": boolean;
  "source_content_ids": Array<string>;
  "state": string;
  "status": string;
  "summary": {
  [key: string]: unknown;
};
  "updated_at": string;
  "waiting_reason": string | null;
  [key: string]: unknown;
};

export type EditorialRunOnceSimpleResponse = {
  "meta": ContractMeta;
  "mutated": boolean;
  "state": string;
  "status": string;
  [key: string]: unknown;
};

export type InsightsQuarantine = {
  "coverage": "complete" | "partial" | "unknown";
  "items": Array<InsightsQuarantineItem>;
  "items_truncated": boolean;
  "total": number;
  [key: string]: unknown;
};

export type InsightsQuarantineItem = {
  "content_id": string;
  "error_code": string;
  "failure_count": number;
  "last_failed_at": string;
  [key: string]: unknown;
};

export type ManualThread = {
  "analyze_enabled": boolean;
  "body_text": string;
  "content_id": string | null;
  "content_role": string | null;
  "cta_policy": string | null;
  "detected_at": string;
  "detection_id": string;
  "external_post_id": string;
  "hypothesis": string | null;
  "learn_enabled": boolean;
  "logical_thread_id": string;
  "n_parts": number;
  "origin": string;
  "part_index": number;
  "parts": Array<ManualThreadPart>;
  "permalink": string | null;
  "published_at": string;
  "root_external_id": string;
  "thread_metric_semantics": string;
  "thread_metrics": Record<string, number | number>;
  "topic": string | null;
  "tracking_state": string;
  "updated_at": string;
  [key: string]: unknown;
};

export type ManualThreadPart = {
  "body_text": string;
  "external_post_id": string;
  "metrics": Record<string, number | number>;
  "part_index": number;
  "permalink": string | null;
  "published_at": string;
  "reply_to_external_id": string | null;
  [key: string]: unknown;
};

export type MetricsObservation = {
  "available_keys": Array<string>;
  "fetched_at": string;
  "observed_at": string;
  "source": string;
  [key: string]: unknown;
};

export type NightAttention = {
  "by_reason": Record<string, number>;
  "coverage": "complete" | "partial" | "unknown";
  "items_truncated": boolean;
  "total": number;
  "window_hours": number;
  [key: string]: unknown;
};

export type NightBatchItem = {
  "attempted_at": string | null;
  "batch_id": string;
  "batch_status": string;
  "block_reason": string | null;
  "content_id": string;
  "expires_at": string;
  "item_id": string;
  "scheduled_at": string;
  "status": string;
  [key: string]: unknown;
};

export type OperatorAccountResponse = {
  "account_id": string;
  "account_status": string;
  "approval_queue": Array<ApprovalQueueItem>;
  "display_name": string;
  "domain_id": string;
  "handle": string;
  "manual_posts": Array<ManualThread>;
  "meta": ContractMeta;
  "operations": OperatorOperations;
  "pipeline": AccountPipelineStatus;
  "readiness": AccountReadiness;
  "recent_audit_events": Array<RecentAuditEvent>;
  "recent_contents": Array<RecentContent>;
  "recent_publications": Array<RecentPublication>;
  "updated_at": string;
  [key: string]: unknown;
};

export type OperatorAccountsResponse = {
  "accounts": Array<OperatorAccountSummary>;
  "meta": ContractMeta;
  [key: string]: unknown;
};

export type OperatorAccountSummary = {
  "account_id": string;
  "account_status": string;
  "display_name": string;
  "domain_id": string;
  "handle": string;
  "pipeline": AccountPipelineStatus;
  "readiness": AccountReadiness;
  "updated_at": string;
  [key: string]: unknown;
};

export type OperatorContentResponse = {
  "account_id": string;
  "analyze_enabled": boolean;
  "approval_events": Array<ContentApprovalEvent>;
  "approved_for_current_body": boolean;
  "attempt": number;
  "body_text": string;
  "content_hash": string;
  "content_id": string;
  "content_role": string;
  "created_at": string;
  "generation": ContentGeneration | null;
  "learn_enabled": boolean;
  "meta": ContractMeta;
  "metrics": Record<string, number | number>;
  "metrics_observation": MetricsObservation | null;
  "n_chars": number;
  "n_parts": number;
  "origin": string;
  "parts": Array<string>;
  "plan_id": string;
  "plan_seq": number;
  "publications": Array<ContentPublication>;
  "qa": ContentQaDetail | null;
  "state": string;
  "topic": string;
  "updated_at": string;
  "version": number;
  [key: string]: unknown;
};

export type OperatorFeatures = {
  "manual_post_sync": boolean;
  "self_reply_sync": string;
  [key: string]: unknown;
};

export type OperatorOperations = {
  "features": OperatorFeatures;
  "insights_quarantine": InsightsQuarantine;
  "night_attention": NightAttention;
  "night_batch_items": Array<NightBatchItem>;
  "rolling_usage": RollingUsage;
  "runner_heartbeats": Array<RunnerHeartbeat>;
  [key: string]: unknown;
};

export type RecentAuditEvent = {
  "created_at": string;
  "entity_id": string | null;
  "entity_version": number | null;
  "event_type": string;
  [key: string]: unknown;
};

export type RecentContent = {
  "analyze_enabled": boolean;
  "attempt": number;
  "content_hash": string;
  "content_id": string;
  "created_at": string;
  "learn_enabled": boolean;
  "n_chars": number;
  "origin": string;
  "plan_id": string;
  "qa": ContentQaSummary | null;
  "state": string;
  "updated_at": string;
  "version": number;
  [key: string]: unknown;
};

export type RecentPublication = {
  "content_id": string;
  "created_at": string;
  "error": string | null;
  "mode": string;
  "publication_id": string;
  "published_at": string | null;
  "status": string;
  [key: string]: unknown;
};

export type RollingUsage = {
  "publications_last_24h": number;
  "publications_last_hour": number;
  [key: string]: unknown;
};

export type RunnerHeartbeat = {
  "age_seconds": number | null;
  "expected": "unknown";
  "healthy": boolean;
  "last_run_at": string | null;
  "run_status": "succeeded" | "failed" | null;
  "runner_name": "insights" | "outcome" | "night_batch";
  "state": "fresh" | "stale" | "missing" | "invalid" | "future";
  [key: string]: unknown;
};

export type SafetyStatusResponse = {
  "account_id": string;
  "account_status": string;
  "account_stop": boolean;
  "approval_mode": string;
  "capability"?: "threads.safety.status";
  "capability_stop": boolean;
  "error"?: CapabilityError | null;
  "global_stop": boolean;
  "meta"?: ContractMeta;
  "publish_readiness"?: {
  [key: string]: unknown;
} | null;
  "rate_guard_ready": boolean;
  "rate_policy": Record<string, number | null>;
  "request_id": string;
  "status"?: "success";
  "unresolved_ambiguous_publication": boolean;
  "warnings"?: Array<string>;
  [key: string]: unknown;
};

export type TenantIdentityResponse = {
  "meta": ContractMeta;
  "org_id": string;
  "role": "viewer" | "editor" | "admin";
  "user_id": string;
  [key: string]: unknown;
};

export type BridgeMetaV1 = ContractMeta;
export type BridgeAccountReadinessV1 = AccountReadiness;
export type BridgePipelineV1 = AccountPipelineStatus;
export type BridgeAccountSummaryV1 = OperatorAccountSummary;
export type BridgeAccountsResponseV1 = OperatorAccountsResponse;
export type BridgeRecentContentV1 = RecentContent;
export type BridgeRecentPublicationV1 = RecentPublication;
export type BridgeManualThreadPartV1 = ManualThreadPart;
export type BridgeManualThreadV1 = ManualThread;
export type BridgeNightBatchItemV1 = NightBatchItem;
export type BridgeRunnerHeartbeatV1 = RunnerHeartbeat;
export type BridgeNightAttentionV1 = NightAttention;
export type BridgeInsightsQuarantineV1 = InsightsQuarantine;
export type BridgeInsightsQuarantineItemV1 = InsightsQuarantineItem;
export type BridgeOperationsV1 = OperatorOperations;
export type BridgeAccountResponseV1 = OperatorAccountResponse;
export type BridgeContentResponseV1 = OperatorContentResponse;
export type BridgeSafetyResponseV1 = SafetyStatusResponse;
export type BridgeEditorialCycleV1 = EditorialCycle;
export type BridgeEditorialExperimentV1 = EditorialExperiment;
export type BridgeEditorialInternalResponseV1 = EditorialInternalResponse;
export type BridgeEditorialCustomerSummaryV1 = EditorialCustomerSummary;
export type BridgeEditorialCustomerResponseV1 = EditorialCustomerResponse;
