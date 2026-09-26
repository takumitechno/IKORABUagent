import type { Json, OperationalBoundaryV1 } from "../web/lib/catfood-harness";
import { canonicalSha256 } from "../web/lib/catfood-harness";
import type {
  CatfoodCapability, CatfoodRunSpec, ThreadsAuthorityTransition, ThreadsClaimRecord,
  ThreadsEvidenceSource, ThreadsInventoryItem, ThreadsRuntimeEvidence, TrustedClock,
  TrustedClockSample,
} from "../web/lib/catfood-trust";

export class TestClock implements TrustedClock {
  readonly kind = "TEST" as const;
  constructor(public wallMs = Date.parse("2026-10-01T00:00:00.000Z"), public monotonic = 1_000, public bootId = "boot-test-1") {}
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
  readonly contract_gaps: readonly string[];
  readonly inventoryItems: ThreadsInventoryItem[] = [
    { source_id: "cycle:one", capability: "editorial.cycle", business_identity: "article:one", material_revision: "rev:1" },
    { source_id: "cycle:two", capability: "editorial.cycle", business_identity: "article:two", material_revision: "rev:1" },
    { source_id: "outcome:one", capability: "editorial.outcome_evaluation", business_identity: "experiment:one", material_revision: "rev:1" },
    { source_id: "dry:one", capability: "threads.publish.dry_run", business_identity: "publication:one", material_revision: "rev:1" },
  ];
  runtime: ThreadsRuntimeEvidence = {
    feature_multi_tenant_auth: "ON", own_scope_status: 200, foreign_scope_status: 403,
    writer_enabled: false, paid_generation_enabled: false, provider_activity_count: 0,
    paid_cost_micros: 0, cost_coverage: "COMPLETE",
  };
  private generations = new Map<CatfoodCapability, number>();
  private states = new Map<CatfoodCapability, "MISSING" | "ACTIVE" | "REVOKED">();
  private claims = new Map<string, ThreadsClaimRecord>();
  private serial = 0;
  claimBarrier: Int32Array | null = null;

  constructor(readonly clock: TestClock, threadsSha: string, releaseSha: string, gaps: readonly string[] = []) {
    this.source_identity = `${threadsSha}:${releaseSha}`; this.contract_gaps = [...gaps];
  }

  runtimeEvidence(_spec: CatfoodRunSpec): ThreadsRuntimeEvidence { return structuredClone(this.runtime); }
  inventory(_spec: CatfoodRunSpec): readonly ThreadsInventoryItem[] { return structuredClone(this.inventoryItems); }
  boundaries(spec: CatfoodRunSpec): readonly OperationalBoundaryV1[] { return spec.capabilities.map((capability) => this.boundary(spec, capability)); }

  grant(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number | null): ThreadsAuthorityTransition {
    const current = this.generations.get(capability) ?? null;
    if (current !== expectedGeneration) throw new Error("STALE_THREADS_GENERATION");
    const generation = (current ?? 0) + 1; this.generations.set(capability, generation); this.states.set(capability, "ACTIVE");
    return { boundary: this.boundary(spec, capability), authority_ref: authorityRef, generation };
  }

  revoke(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number): ThreadsAuthorityTransition {
    if (this.generations.get(capability) !== expectedGeneration || this.states.get(capability) !== "ACTIVE") throw new Error("STALE_THREADS_GENERATION");
    const generation = expectedGeneration + 1; this.generations.set(capability, generation); this.states.set(capability, "REVOKED");
    return { boundary: this.boundary(spec, capability), authority_ref: authorityRef, generation };
  }

  claim(spec: CatfoodRunSpec, item: ThreadsInventoryItem, authorityRef: string, generation: number): ThreadsClaimRecord {
    if (this.claimBarrier) { Atomics.store(this.claimBarrier, 0, 1); Atomics.notify(this.claimBarrier, 0); Atomics.wait(this.claimBarrier, 0, 1); }
    const currentGeneration = this.claimBarrier ? Atomics.load(this.claimBarrier, 1) : this.generations.get(item.capability);
    if (item.capability !== this.inventoryItems.find((candidate) => candidate.source_id === item.source_id)?.capability
      || this.states.get(item.capability) !== "ACTIVE" || currentGeneration !== generation) throw new Error("THREADS_FENCE_REJECTED");
    const suffix = ++this.serial;
    const claim: ThreadsClaimRecord = { ...item, claim_id: `claim:${suffix}`, request_id: `request:${suffix}`, account_id: spec.account_id,
      authority_ref: authorityRef, generation, claim_status: "in_progress", transport_status: "UNKNOWN", domain_result: {},
      provider_invoked: false, paid_cost_micros: 0, admitted_at: this.clock.sample().wall_time, completed_at: null };
    this.claims.set(claim.claim_id, claim); return structuredClone(claim);
  }

  readClaim(_spec: CatfoodRunSpec, claimId: string): ThreadsClaimRecord | null { const claim = this.claims.get(claimId); return claim ? structuredClone(claim) : null; }

  complete(claimId: string, overrides: Partial<ThreadsClaimRecord> = {}): void {
    const claim = this.claims.get(claimId); if (!claim) throw new Error("claim missing");
    const domain: Record<CatfoodCapability, Record<string, Json>> = {
      "editorial.cycle": { state: "DRAFT", status: "READY" },
      "editorial.outcome_evaluation": { state: "COMPLETED", status: "RECORDED", recorded: true, verdict: "SUCCESS" },
      "threads.publish.dry_run": { status: "succeeded", mode: "dry_run", duplicate: false, publication_id: "pub:test", content_hash: "a".repeat(64), version: 1 },
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
      schema_version: 30, schema_fingerprint: "5".repeat(64), schema_readiness: "READY", migration_provenance_digest: "6".repeat(64),
      account_id: spec.account_id, org_tenant_binding: { state: "bound", org_ids: [spec.organization_id] }, observed_at: this.clock.sample().wall_time,
      capability, unsupported_capability: null, execution_state: active ? "PERMITTED" : "INHIBITED",
      permit_expires_at: new Date(this.clock.wallMs + 86_400_000 * 2).toISOString(), fencing_generation: generation,
      authority_state: state, enabled_capabilities: active ? [capability] : [],
      effective_safety_controls: { global_stop: false, account_stop: false, capability_stop: !active, reasons: active ? [] : [revoked ? "catfood_authority_revoked" : "catfood_authority_missing"] },
      stop_acknowledgement: active ? "NOT_REQUESTED" : "INHIBITED",
      governed_in_flight: { count: 0, by_authority: [], unattributed_count: 0, attribution_state: "COMPLETE", external_cancellation_guaranteed: false },
      blocked_reasons: active ? [] : [revoked ? "authority_revoked" : "authority_missing", "safety_control_inhibited"],
      source_evidence: { coverage: "unknown", runner_heartbeats: ["insights", "outcome", "night_batch"].map((runner_name) => ({ runner_name, state: "missing", run_status: null, last_run_at: null, age_seconds: null, expected: "unknown", healthy: false })), night_attention: { window_hours: 96, total: 0, by_reason: { cancelled: 0, blocked: 0, failed_confirmed: 0, ambiguous: 0 }, items_truncated: false, coverage: "complete" }, insights_quarantine: { total: 0, items: [], items_truncated: false, coverage: "complete" } },
    });
  }
}
