/** Valid in-memory Bridge v1 fixtures; no network or production DB access. */

export const bridgeMetaV1 = { schema_version: 1 } as const;
const stamp = "2026-09-21T00:00:00Z";

export function pipelineV1(overrides: Record<string, unknown> = {}) {
  return {
    n_contents: 0,
    contents_by_state: {},
    n_publications: 0,
    publications_by_mode: {},
    n_metrics: 0,
    has_learning_snapshot: false,
    n_audit_events: 0,
    ...overrides,
  };
}

export function readinessV1(overrides: Record<string, unknown> = {}) {
  return {
    config_ok: true,
    config_problems: [],
    n_research_posts: 0,
    has_style_profile: false,
    style_profile_version: null,
    persona_provenance: "operator_draft",
    persona_usable_for_generation: true,
    n_verified_facts: 0,
    verified_fact_keys: [],
    n_plans: 0,
    status: "active",
    ready_for_dry_run: true,
    blocking: [],
    requires_owner_oauth_before_live: true,
    ...overrides,
  };
}

export function accountSummaryV1(overrides: Record<string, unknown> = {}) {
  const base = {
    account_id: "acct_8ssana",
    handle: "8sssana",
    display_name: "Sana",
    domain_id: "divination",
    account_status: "active",
    updated_at: stamp,
    readiness: readinessV1(),
    pipeline: pipelineV1(),
  };
  return {
    ...base,
    ...overrides,
    readiness: readinessV1((overrides.readiness as Record<string, unknown>) ?? {}),
    pipeline: pipelineV1((overrides.pipeline as Record<string, unknown>) ?? {}),
  };
}

export function accountsResponseV1(accounts = [accountSummaryV1()], extras: Record<string, unknown> = {}) {
  return { accounts, meta: bridgeMetaV1, ...extras };
}

export function recentContentV1(overrides: Record<string, unknown> = {}) {
  return {
    content_id: "content-1",
    plan_id: "plan-1",
    version: 1,
    attempt: 1,
    state: "human_approval_pending",
    content_hash: "0123456789abcdef",
    n_chars: 4,
    created_at: stamp,
    updated_at: stamp,
    origin: "ai_auto",
    analyze_enabled: true,
    learn_enabled: false,
    qa: null,
    ...overrides,
  };
}

export function recentPublicationV1(overrides: Record<string, unknown> = {}) {
  return {
    publication_id: "publication-1",
    content_id: "content-1",
    mode: "live",
    status: "succeeded",
    error: null,
    created_at: stamp,
    published_at: stamp,
    ...overrides,
  };
}

export function manualThreadV1(overrides: Record<string, unknown> = {}) {
  const externalId = String(overrides.external_post_id ?? "manual-1");
  return {
    detection_id: "detection-1",
    logical_thread_id: "thread-1",
    root_external_id: externalId,
    external_post_id: externalId,
    body_text: "manual body",
    published_at: stamp,
    permalink: null,
    origin: "human_manual",
    analyze_enabled: true,
    learn_enabled: false,
    topic: null,
    content_role: null,
    hypothesis: null,
    part_index: 0,
    n_parts: 1,
    parts: [{
      external_post_id: externalId,
      reply_to_external_id: null,
      part_index: 0,
      body_text: "manual body",
      published_at: stamp,
      permalink: null,
      metrics: {},
    }],
    thread_metrics: {},
    thread_metric_semantics: "sum_of_parts_non_unique",
    tracking_state: "detected",
    content_id: null,
    detected_at: stamp,
    updated_at: stamp,
    ...overrides,
  };
}

export function operationsV1(overrides: Record<string, unknown> = {}) {
  const base = {
    night_batch_items: [],
    rolling_usage: { publications_last_hour: 0, publications_last_24h: 0 },
    features: { manual_post_sync: true, self_reply_sync: "not_available" },
  };
  return {
    ...base,
    ...overrides,
    rolling_usage: { ...base.rolling_usage, ...((overrides.rolling_usage as Record<string, unknown>) ?? {}) },
    features: { ...base.features, ...((overrides.features as Record<string, unknown>) ?? {}) },
  };
}

export function accountResponseV1(overrides: Record<string, unknown> = {}) {
  const base = {
    ...accountSummaryV1(overrides),
    approval_queue: [],
    recent_contents: [],
    recent_publications: [],
    recent_audit_events: [],
    manual_posts: [],
    operations: operationsV1(),
    meta: bridgeMetaV1,
  };
  return {
    ...base,
    ...overrides,
    readiness: readinessV1((overrides.readiness as Record<string, unknown>) ?? {}),
    pipeline: pipelineV1((overrides.pipeline as Record<string, unknown>) ?? {}),
    operations: operationsV1((overrides.operations as Record<string, unknown>) ?? {}),
    meta: (overrides.meta as unknown) ?? bridgeMetaV1,
  };
}

export function contentResponseV1(overrides: Record<string, unknown> = {}) {
  return {
    account_id: "acct_8ssana",
    content_id: "content-1",
    plan_id: "plan-1",
    plan_seq: 1,
    topic: "topic",
    content_role: "trust",
    version: 1,
    attempt: 1,
    state: "human_approval_pending",
    origin: "ai_auto",
    analyze_enabled: true,
    learn_enabled: false,
    content_hash: "0123456789abcdef",
    created_at: stamp,
    updated_at: stamp,
    parts: ["body"],
    body_text: "body",
    n_parts: 1,
    n_chars: 4,
    qa: null,
    generation: null,
    approval_events: [],
    publications: [],
    metrics: {},
    metrics_observation: null,
    approved_for_current_body: false,
    meta: bridgeMetaV1,
    ...overrides,
  };
}

export function safetyResponseV1(overrides: Record<string, unknown> = {}) {
  return {
    status: "success",
    capability: "threads.safety.status",
    request_id: "request-1",
    account_id: "acct_8ssana",
    account_status: "active",
    global_stop: false,
    account_stop: false,
    capability_stop: false,
    approval_mode: "manual",
    publish_readiness: null,
    unresolved_ambiguous_publication: false,
    rate_guard_ready: false,
    rate_policy: { min_interval_seconds: null, hourly_limit: null, daily_limit: null },
    warnings: [],
    error: null,
    meta: bridgeMetaV1,
    ...overrides,
  };
}

export function editorialCycleV1(overrides: Record<string, unknown> = {}) {
  return {
    cycle_id: "cycle-1",
    account_id: "acct_8ssana",
    cycle_key: "2026-09-21",
    state: "OBSERVE",
    status: "WAITING_FOR_EVIDENCE",
    current_agent: null,
    waiting_reason: null,
    source_content_ids: [],
    config: {},
    summary: {},
    brief: null,
    draft: null,
    content_id: null,
    created_at: stamp,
    updated_at: stamp,
    ...overrides,
  };
}

export function editorialExperimentV1(overrides: Record<string, unknown> = {}) {
  return {
    experiment_id: "experiment-1",
    account_id: "acct_8ssana",
    cycle_id: "cycle-1",
    created_at: stamp,
    source_content_ids: [],
    hypothesis: {},
    test_variable: "ending",
    constants: [],
    success_signal: {},
    failure_signal: {},
    minimum_sample: {},
    status: "planned",
    decision: {},
    result_summary: null,
    evidence_level: "hypothesis_only",
    ...overrides,
  };
}

export function editorialInternalV1(overrides: Record<string, unknown> = {}) {
  return {
    account_id: "acct_8ssana",
    cycle: null,
    experiments: [],
    meta: bridgeMetaV1,
    ...overrides,
  };
}

export function editorialCustomerV1(overrides: Record<string, unknown> = {}) {
  return {
    account_id: "acct_8ssana",
    summary: null,
    meta: bridgeMetaV1,
    ...overrides,
  };
}

export function emptyEndpointResponse(url: string): Record<string, unknown> {
  if (url.includes("/safety/status")) return safetyResponseV1();
  if (url.includes("/editorial/internal")) return editorialInternalV1();
  if (url.includes("/editorial/customer")) return editorialCustomerV1();
  return accountResponseV1();
}
