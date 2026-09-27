import type { Json, OperationalBoundaryV1 } from "../web/lib/catfood-harness";
import { canonicalSha256 } from "../web/lib/catfood-harness";
import { canonicalJson, sha256 } from "../web/lib/catfood-harness";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COE_LEGACY_SOURCE_FAMILIES, COE_SOURCES, type CoeRequest, type OutcomeEvaluationRequest } from "../web/lib/catfood-coe";
import type {
  CatfoodCapability, CatfoodRunSpec, ThreadsAuthorityTransition, ThreadsClaimRecord,
  ThreadsEvidenceSource, ThreadsInventoryItem, ThreadsRuntimeEvidence, TrustedClock,
  TrustedClockSample, TenantProbeEvidence,
} from "../web/lib/catfood-trust";

const EMITTER_DISPOSITIONS = JSON.parse(readFileSync(resolve(import.meta.dir, "../contracts/catfood-operational-evidence-v1.json"), "utf8")).emitter_dispositions as Json[];

export class TestClock implements TrustedClock {
  readonly kind = "TEST" as const;
  constructor(public wallMs = Date.parse("2026-09-30T00:00:00.000Z"), public monotonic = 1_000, public bootId = "boot-test-1") {}
  sample(): TrustedClockSample { return { wall_time: new Date(this.wallMs).toISOString(), monotonic_ms: this.monotonic, boot_id: this.bootId }; }
  advance(ms: number): void { this.wallMs += ms; this.monotonic += ms; }
}

function hashed(value: Record<string, unknown>): OperationalBoundaryV1 {
  const copy = structuredClone(value); delete copy.canonical_sha256;
  return { ...copy, canonical_sha256: canonicalSha256(copy) } as OperationalBoundaryV1;
}

export class FixtureThreadsSource implements ThreadsEvidenceSource {
  readonly mode = "TEST_ONLY" as const;
  readonly source_identity: string;
  readonly inventoryItems: ThreadsInventoryItem[] = [
    { source_id: "cycle:one", capability: "editorial.cycle", business_identity: "article:one", material_revision: "a".repeat(64) },
    { source_id: "cycle:two", capability: "editorial.cycle", business_identity: "article:two", material_revision: "b".repeat(64) },
    { source_id: "outcome:one", capability: "editorial.outcome_evaluation", business_identity: "experiment:one", material_revision: "c".repeat(64) },
    { source_id: "dry:one", capability: "threads.publish.dry_run", business_identity: "publication:one", material_revision: "d".repeat(64) },
  ];
  runtime: ThreadsRuntimeEvidence = {
    feature_multi_tenant_auth: "ON", own_scope_status: 200, foreign_scope_status: 403,
    writer_enabled: false, paid_generation_enabled: false, provider_activity_count: 0,
    paid_cost_micros: 0, cost_coverage: "COMPLETE",
  };
  private generations = new Map<CatfoodCapability, number>();
  private states = new Map<CatfoodCapability, "MISSING" | "ACTIVE" | "REVOKED">();
  private permitExpiries = new Map<CatfoodCapability, string>();
  private claims = new Map<string, ThreadsClaimRecord>();
  private claimContexts = new Map<string, { organization_id: string; spec_hash: string }>();
  private authorityEvents: Record<string, unknown>[] = [];
  private serial = 0;
  claimBarrier: Int32Array | null = null;
  lastOutcomeRequest: Readonly<OutcomeEvaluationRequest> | null = null;
  coeTransform: ((page: Record<string, unknown>, request: Readonly<CoeRequest>) => unknown) | null = null;

  constructor(readonly clock: TestClock, threadsSha: string, releaseSha: string) {
    this.source_identity = `${threadsSha}:${releaseSha}`;
  }

  runtimeEvidence(_spec: CatfoodRunSpec): ThreadsRuntimeEvidence { return structuredClone(this.runtime); }
  tenantProbe(spec: CatfoodRunSpec): TenantProbeEvidence { const observed_at = this.clock.sample().wall_time; return { probe_id: `probe:${spec.run_id}`, principal_ref: "principal:test-controller", credential_version_ref: "credential:test:v1", organization_id: spec.organization_id, own_account_id: spec.account_id, foreign_account_id: "acct_foreign_fixture", own_result: "EXPECTED_RESOURCE", foreign_result: "AUTHORIZATION_DENIED", foreign_status: 403, logical_runtime_id: "runtime:test", worker_boot_id: "boot-test", observed_at, receipt_id: `probe-receipt:${spec.run_id}` }; }
  inventory(_spec: CatfoodRunSpec): readonly ThreadsInventoryItem[] { return structuredClone(this.inventoryItems); }
  boundaries(spec: CatfoodRunSpec): readonly OperationalBoundaryV1[] { return spec.capabilities.map((capability) => this.boundary(spec, capability)); }

  grant(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number | null, permitExpiresAt = new Date(this.clock.wallMs + 120_000).toISOString()): ThreadsAuthorityTransition {
    const current = this.generations.get(capability) ?? null;
    if (current !== expectedGeneration) throw new Error("STALE_THREADS_GENERATION");
    const generation = (current ?? 0) + 1; this.generations.set(capability, generation); this.states.set(capability, "ACTIVE"); this.permitExpiries.set(capability, permitExpiresAt);
    this.authorityEvents.push({ source: "operational_authority_events", event_seq: this.authorityEvents.length + 1, event_id: `authority:${this.authorityEvents.length + 1}`, account_id: spec.account_id, capability, event_type: "GRANTED", authority_ref: authorityRef, spec_hash: spec.spec_sha256, generation, state: "active", permit_expires_at: permitExpiresAt, actor: "principal:test-controller", occurred_at: this.clock.sample().wall_time.replace("Z", "+00:00"), payload_hash: "2".repeat(64) });
    return { boundary: this.boundary(spec, capability), authority_ref: authorityRef, generation };
  }

  renew(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number, permitExpiresAt: string): ThreadsAuthorityTransition {
    if (this.generations.get(capability) !== expectedGeneration || this.states.get(capability) !== "ACTIVE") throw new Error("STALE_THREADS_GENERATION");
    this.permitExpiries.set(capability, permitExpiresAt);
    this.authorityEvents.push({ source: "operational_authority_events", event_seq: this.authorityEvents.length + 1, event_id: `authority:${this.authorityEvents.length + 1}`, account_id: spec.account_id, capability, event_type: "RENEWED", authority_ref: authorityRef, spec_hash: spec.spec_sha256, generation: expectedGeneration, state: "active", permit_expires_at: permitExpiresAt, actor: "principal:test-controller", occurred_at: this.clock.sample().wall_time.replace("Z", "+00:00"), payload_hash: "2".repeat(64) });
    return { boundary: this.boundary(spec, capability), authority_ref: authorityRef, generation: expectedGeneration };
  }

  revoke(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number): ThreadsAuthorityTransition {
    if (this.generations.get(capability) !== expectedGeneration || this.states.get(capability) !== "ACTIVE") throw new Error("STALE_THREADS_GENERATION");
    const generation = expectedGeneration + 1; this.generations.set(capability, generation); this.states.set(capability, "REVOKED");
    this.authorityEvents.push({ source: "operational_authority_events", event_seq: this.authorityEvents.length + 1, event_id: `authority:${this.authorityEvents.length + 1}`, account_id: spec.account_id, capability, event_type: "REVOKED", authority_ref: authorityRef, spec_hash: spec.spec_sha256, generation, state: "revoked", permit_expires_at: new Date(this.clock.wallMs + 120_000).toISOString(), actor: "principal:test-controller", occurred_at: this.clock.sample().wall_time.replace("Z", "+00:00"), payload_hash: "2".repeat(64) });
    return { boundary: this.boundary(spec, capability), authority_ref: authorityRef, generation };
  }

  claim(spec: CatfoodRunSpec, item: ThreadsInventoryItem, authorityRef: string, generation: number, requestId?: string): ThreadsClaimRecord {
    if (this.claimBarrier) { Atomics.store(this.claimBarrier, 0, 1); Atomics.notify(this.claimBarrier, 0); Atomics.wait(this.claimBarrier, 0, 1); }
    const currentGeneration = this.claimBarrier ? Atomics.load(this.claimBarrier, 1) : this.generations.get(item.capability);
    if (item.capability !== this.inventoryItems.find((candidate) => candidate.source_id === item.source_id)?.capability
      || this.states.get(item.capability) !== "ACTIVE" || currentGeneration !== generation) throw new Error("THREADS_FENCE_REJECTED");
    const suffix = ++this.serial;
    const claim: ThreadsClaimRecord = { ...item, claim_id: `claim:${suffix}`, request_id: requestId ?? `request:${suffix}`, account_id: spec.account_id,
      authority_ref: authorityRef, generation, claim_status: "in_progress", transport_status: "UNKNOWN", domain_result: {},
      provider_invoked: false, paid_cost_micros: 0, admitted_at: this.clock.sample().wall_time, completed_at: null };
    this.claims.set(claim.claim_id, claim); this.claimContexts.set(claim.claim_id, { organization_id: spec.organization_id, spec_hash: spec.spec_sha256 }); return structuredClone(claim);
  }

  readClaim(_spec: CatfoodRunSpec, claimId: string): ThreadsClaimRecord | null { const claim = this.claims.get(claimId); return claim ? structuredClone(claim) : null; }

  outcomeEvaluation(spec: CatfoodRunSpec, request: Readonly<OutcomeEvaluationRequest>, item: ThreadsInventoryItem): ThreadsClaimRecord {
    this.lastOutcomeRequest = structuredClone(request);
    const claim = this.claim(spec, item, request.authority_ref, request.expected_threads_generation);
    const bound = { ...claim, request_id: request.request_id };
    this.claims.set(bound.claim_id, bound);
    return structuredClone(bound);
  }

  operationalEvidence(request: Readonly<CoeRequest>): unknown {
    if (request.cursor !== null) throw new Error("unexpected cursor");
    const stamp = new Date(Math.floor(this.clock.wallMs / 1000) * 1000).toISOString().replace(".000Z", "Z");
    const attempts: Record<string, unknown>[] = [...this.claims.values()].flatMap((claim, index) => {
      const context = this.claimContexts.get(claim.claim_id)!; const succeeded = claim.claim_status === "succeeded" && claim.transport_status === "SUCCEEDED";
      const resultIdentity = claim.capability === "editorial.cycle" ? claim.domain_result.cycle_id : claim.capability === "editorial.outcome_evaluation" ? claim.domain_result.result_identity : claim.domain_result.publication_id;
      const base = { source: "operational_attempt_events", attempt_id: `attempt:${index + 1}`, account_id: claim.account_id, org_id: context.organization_id, authenticated_account_id: claim.account_id, authenticated_org_id: context.organization_id, requested_account_id_untrusted: null, capability: claim.capability, request_id: claim.request_id, claim_identity: claim.claim_id, authority_ref: claim.authority_ref, verified_authority_ref: claim.authority_ref, spec_hash: context.spec_hash, verified_spec_hash: context.spec_hash, threads_generation: claim.generation, verified_threads_generation: claim.generation, business_identity: claim.business_identity, material_revision: claim.material_revision, admission_state: "ADMITTED", duplicate_of_request_id: null, payload_hash: "9".repeat(64), request_fingerprint: "a".repeat(64), reason_code: null };
      const claimed = { ...base, event_seq: index * 2 + 1, event_id: `event:${index + 1}:claimed`, event_type: "CLAIMED", claimed_authority_ref: claim.authority_ref, claimed_spec_hash: context.spec_hash, claimed_threads_generation: claim.generation, execution_state: "IN_PROGRESS", result_identity: null, result_json: null, result_revision: null, domain_state: null, occurred_at: claim.admitted_at.replace(".000Z", "+00:00"), lifecycle_revision: 1 };
      if (claim.claim_status === "in_progress") return [claimed];
      const terminal = { ...base, event_seq: index * 2 + 2, event_id: `event:${index + 1}:terminal`, event_type: succeeded ? "SUCCEEDED" : claim.transport_status === "UNKNOWN" ? "UNRESOLVED" : "FAILED", claimed_authority_ref: null, claimed_spec_hash: null, claimed_threads_generation: null, execution_state: succeeded ? "SUCCEEDED" : claim.transport_status === "UNKNOWN" ? "UNRESOLVED" : "FAILED", result_identity: succeeded ? resultIdentity : null, result_json: succeeded ? canonicalJson(claim.domain_result) : null, result_revision: succeeded && claim.capability === "editorial.outcome_evaluation" ? "2026-09-30T00:00:00+00:00" : null, domain_state: succeeded ? String(claim.domain_result.native_domain_state ?? claim.domain_result.state ?? claim.domain_result.status ?? "SUCCEEDED") : null, occurred_at: (claim.completed_at ?? claim.admitted_at).replace(".000Z", "+00:00"), lifecycle_revision: 2 };
      return [claimed, terminal];
    });
    const records = [...attempts, ...this.authorityEvents].map((record, index) => ({ ...record, event_seq: index + 1 }));
    const root = sha256(canonicalJson(records));
    const page: Record<string, unknown> = {
      contract: "threads.catfood-operational-evidence.v1", schema_version: 1,
      producer_release_identity: { git_sha: this.source_identity.slice(0, 40), artifact_sha256: this.source_identity.slice(41) },
      scope: { account_id: request.account_id, capability: null },
      source_inventory: { version: 3, store_incarnation: "1".repeat(32), evidence_started_at_raw: request.window_start, evidence_started_at_normalized: request.window_start, evidence_started_at_status: "NORMALIZED", retention_floor_event_seq: 0, sources: [...COE_SOURCES], legacy_source_families: [...COE_LEGACY_SOURCE_FAMILIES], cursor_key_profile: "SINGLE_WORKER" },
      coverage: { state: "COMPLETE", integrity_reason: "PROSPECTIVE_WINDOW_COMPLETE", legacy: { state: "PARTIAL", v31_claimed_complete: false, reason: "V31_COMPLETENESS_SUPERSEDED" }, prospective: { state: "COMPLETE", proof_id: "proof:test-only", proof_applicable: true, reason: "EXACT_REHEARSAL_PROOF" }, window: { assessment_mode: request.assessment_mode, requested_window_start: request.window_start, requested_window_end: request.window_end, interval_semantics: "[start,end)", state: "COMPLETE", uncovered_reasons: [] }, cuts: { attempt: attempts.length, authority: this.authorityEvents.length, ai_usage: 0, publication: 0 }, scoped_count: records.length, record_set_digest: root, snapshot_identity: sha256(canonicalJson({ root, account_id: request.account_id })), unresolved_count: [...new Map(attempts.map((row) => [row.attempt_id, row])).values()].filter((row) => row.execution_state === "IN_PROGRESS").length, pagination_complete: true, page_offset: 0, page_count: records.length, client_continuity_required: true },
      records, next_cursor: null,
      prohibited_activity: { coverage: "COMPLETE", activity: "ZERO", exposure: "RESOLVED", known_cost_count: 0, unknown_cost_count: 0, pending_cost_count: 0, count_semantics: "exact_for_instrumented_sources_only", provider_attempt_count: 0, live_publication_attempt_count: 0, dry_run_preparation_count: 0, unattributed_attempt_count: 0, known_zero: true, expected_emitter_inventory_digest: "fa3ba3589c64f3116577c977f3946be618497ccf5976a109d0591edb7e6e7b1f", emitter_dispositions: structuredClone(EMITTER_DISPOSITIONS), package_proven_exclusions: [], rehearsal_required_emitters: [], uninstrumented_emitters: [], integrity_reason: "EXACT_REHEARSAL_PROOF_AND_SOURCES" },
      runtime_enforcement: { configured_auth_state: "ON", effective_auth_mode: "TENANT_ENFORCED", guard_readiness: "READY", reason: "TENANT_GUARD_ACTIVE", observed_at: stamp, freshness_identity: `1.${"3".repeat(64)}`, logical_runtime_id: "runtime:test", process_start_identity: "4".repeat(64), worker_boot_id: "boot-test", cursor_key_profile: "SINGLE_WORKER", topology_observation_status: "BOUND", topology_reason: "PROTECTED_OBSERVER", observed_execution_worker_count: 1 },
      operational_observation: { observation_id: "5".repeat(64), observed_at: stamp, observation_clock_id: "TEST_ONLY", trust: { environment_identity: "test", reason: "TEST_ONLY", registry_revision: 1, source_identity: "test-registry", status: "BOUND" }, topology: { execution_worker_count: 1, execution_worker_ids: ["worker:test"], observed_boot_id: "boot-test", observer_kind: "TEST_ONLY", process_inventory_digest: "6".repeat(64), reason: "TEST_ONLY", status: "BOUND" }, checkpoint: { checkpoint_id: "checkpoint:test", lineage: "test", protection_provenance: "TEST_ONLY", range_end: stamp, range_start: request.window_start, reason: "TEST_ONLY", root: "7".repeat(64), status: "BOUND" }, security_revision_before: "8".repeat(64), security_revision_after: "8".repeat(64), coherent: true },
      outcome_evaluation_targets: [{ business_identity: "experiment:one", material_revision: "c".repeat(64), observed_through: "2026-09-30T00:00:00+00:00", source: { experiment_id: "experiment:one", cycle_id: "cycle:outcome", content_id: "content:outcome", content_version: 1, content_hash: "d".repeat(64), experiment_created_at: "2026-09-29T00:00:00+00:00", source_content_ids_json: "[]", hypothesis_json: canonicalJson({ id: "hook", hypothesis: "hook test", test_variable: "hook", evidence: "fixture" }), test_variable: "hook", constants_json: canonicalJson(["role", "topic", "length", "ending"]), success_signal_json: canonicalJson({ metric: "replies_per_view", direction: "increase" }), failure_signal_json: canonicalJson({ metric: "replies_per_view", direction: "no_increase" }), minimum_sample_json: canonicalJson({ minimum_posts: 3, minimum_age_hours: 6, minimum_comparable_baseline: 2, minimum_relative_lift: 0.1, sample_mode: "all", recent_window: 5, negative_theme_threshold: 3, max_edit_iterations: 3, draft_candidates: 3 }), observed_through: "2026-09-30T00:00:00+00:00" } }],
    };
    return this.coeTransform ? this.coeTransform(structuredClone(page), request) : page;
  }

  complete(claimId: string, overrides: Partial<ThreadsClaimRecord> = {}): void {
    const claim = this.claims.get(claimId); if (!claim) throw new Error("claim missing");
    const domain: Record<CatfoodCapability, Record<string, Json>> = {
      "editorial.cycle": { cycle_id: `cycle:${claimId}`, account_id: claim.account_id, cycle_key: claim.business_identity, state: "DRAFT", status: "READY", current_agent: "Writer", waiting_reason: null, source_content_ids: [], config: {}, summary: {}, brief: {}, draft: {}, content_id: null, created_at: claim.admitted_at, updated_at: this.clock.sample().wall_time, mutated: false },
      "editorial.outcome_evaluation": { account_id: claim.account_id, capability: claim.capability, request_id: claim.request_id, claim_identity: claim.claim_id, authority_ref: claim.authority_ref, threads_generation: claim.generation, business_identity: claim.business_identity, material_revision: claim.material_revision, state: "SUCCEEDED", native_domain_state: "SUCCESS", result_identity: `evaluation:${claimId}`, result_revision: "2026-09-30T00:00:00+00:00", evaluation: { verdict: "SUCCESS", evidence_level: "SUFFICIENT", evidence_count: 1, sample_size: 1, observed_through: "2026-09-30T00:00:00+00:00", result_summary: "test", decision_json: { evaluation_id: `evaluation:${claimId}`, tested_variable: "hook", alternative_explanation: "none", possible_confounders: [], missing_evidence: [], next_evidence_needed: "none" }, next_decision: "retain" } },
      "threads.publish.dry_run": { publication_id: "pub:test", status: "succeeded", duplicate: false, mode: "dry_run", attempts: 0, external_publish_id: "dryrun:test", permalink: "dryrun://test", parts_state: [], parts_sent: [], requires_human: false, error: null },
    };
    this.claims.set(claimId, { ...claim, claim_status: "succeeded", transport_status: "SUCCEEDED", domain_result: domain[claim.capability], completed_at: this.clock.sample().wall_time, ...overrides });
  }

  setGeneration(capability: CatfoodCapability, generation: number): void { this.generations.set(capability, generation); }
  generation(capability: CatfoodCapability): number | null { return this.generations.get(capability) ?? null; }

  private boundary(spec: CatfoodRunSpec, capability: CatfoodCapability): OperationalBoundaryV1 {
    const state = this.states.get(capability) ?? "MISSING"; const generation = this.generations.get(capability) ?? null;
    const active = state === "ACTIVE"; const revoked = state === "REVOKED";
    return hashed({
      boundary_version: 1,
      producer_release_identity: { git_sha: spec.threads_sha, artifact_sha256: spec.threads_release_sha256 },
      schema_version: 33, schema_fingerprint: spec.threads_schema_fingerprint, schema_readiness: "READY", migration_provenance_digest: "6".repeat(64),
      account_id: spec.account_id, org_tenant_binding: { state: "bound", org_ids: [spec.organization_id] }, observed_at: this.clock.sample().wall_time,
      capability, unsupported_capability: null, execution_state: active ? "PERMITTED" : "INHIBITED",
      permit_expires_at: active ? this.permitExpiries.get(capability) ?? null : null, fencing_generation: generation,
      authority_state: state, enabled_capabilities: active ? [capability] : [],
      effective_safety_controls: { global_stop: false, account_stop: false, capability_stop: !active, reasons: active ? [] : [revoked ? "catfood_authority_revoked" : "catfood_authority_missing"] },
      stop_acknowledgement: active ? "NOT_REQUESTED" : "INHIBITED",
      governed_in_flight: { count: 0, by_authority: [], unattributed_count: 0, attribution_state: "COMPLETE", external_cancellation_guaranteed: false },
      blocked_reasons: active ? [] : [revoked ? "authority_revoked" : "authority_missing", "safety_control_inhibited"],
      source_evidence: { coverage: "unknown", runner_heartbeats: ["insights", "outcome", "night_batch"].map((runner_name) => ({ runner_name, state: "missing", run_status: null, last_run_at: null, age_seconds: null, expected: "unknown", healthy: false })), night_attention: { window_hours: 96, total: 0, by_reason: { cancelled: 0, blocked: 0, failed_confirmed: 0, ambiguous: 0 }, items_truncated: false, coverage: "complete" }, insights_quarantine: { total: 0, items: [], items_truncated: false, coverage: "complete" } },
    });
  }
}
