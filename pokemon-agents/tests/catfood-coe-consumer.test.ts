import { describe, expect, test } from "bun:test";
import { canonicalJson, sha256 } from "../web/lib/catfood-harness";
import {
  CATFOOD_THREADS_PINS, acquireCoe, assessCoe,
  stableCoeEvidence, validateOutcomeEvaluationRequest, verifyGovernedWork,
  type CoeAcquisition, type CoeRequest, type CoeScope,
} from "../web/lib/catfood-coe";
import { FixtureThreadsSource, TestClock } from "./catfood-trust-fixture";

const clock = () => new TestClock();
const scope = (): CoeScope => ({
  account_id: "acct_test", organization_id: "org:test", tenant_id: "org:test",
  threads_sha: CATFOOD_THREADS_PINS.threads_sha,
  threads_release_sha256: CATFOOD_THREADS_PINS.release_sha256,
  threads_schema: CATFOOD_THREADS_PINS.schema,
  threads_schema_fingerprint: CATFOOD_THREADS_PINS.schema_fingerprint,
  coe_sha256: CATFOOD_THREADS_PINS.coe_sha256,
  rehearsal_attestation_sha256: CATFOOD_THREADS_PINS.rehearsal_attestation_sha256,
  emitter_inventory_sha256: CATFOOD_THREADS_PINS.emitter_inventory_sha256,
  requested_window_start: "2026-09-30T00:00:00Z",
  requested_window_end: "2026-10-01T00:00:00Z",
});

function source(transform?: (page: any, request: Readonly<CoeRequest>) => unknown) {
  const value = new FixtureThreadsSource(clock(), CATFOOD_THREADS_PINS.threads_sha, CATFOOD_THREADS_PINS.release_sha256);
  value.coeTransform = transform ?? null;
  return value;
}

function acquisition(transform?: (page: any, request: Readonly<CoeRequest>) => unknown): CoeAcquisition {
  return acquireCoe(source(transform), scope());
}

function mutate(path: (page: any) => void) {
  return (page: any) => { path(page); return page; };
}

function attempt(eventType = "SUCCEEDED", requestId = "request:one") {
  return {
    source: "operational_attempt_events", event_seq: 1, event_id: "event:1", attempt_id: "attempt:1",
    event_type: eventType, account_id: "acct_test", org_id: "org:test", authenticated_account_id: "acct_test",
    authenticated_org_id: "org:test", requested_account_id_untrusted: null, capability: "editorial.cycle",
    request_id: requestId, claim_identity: "claim:one", authority_ref: "authority:one", verified_authority_ref: "authority:one",
    claimed_authority_ref: "authority:one", spec_hash: "e".repeat(64), verified_spec_hash: "e".repeat(64),
    claimed_spec_hash: "e".repeat(64), threads_generation: 1, verified_threads_generation: 1, claimed_threads_generation: 1,
    business_identity: "article:one", material_revision: "a".repeat(64), admission_state: "ADMITTED",
    execution_state: eventType === "SUCCEEDED" ? "SUCCEEDED" : "FAILED", duplicate_of_request_id: eventType === "DUPLICATE" ? "request:old" : null,
    result_identity: eventType === "SUCCEEDED" ? "result:one" : null, result_json: eventType === "SUCCEEDED" ? canonicalJson({ state: "DRAFT", status: "READY" }) : null,
    result_revision: "2026-10-01T00:00:00+00:00", domain_state: "DRAFT", occurred_at: "2026-10-01T00:00:00+00:00",
    payload_hash: "f".repeat(64), request_fingerprint: "1".repeat(64), reason_code: null, lifecycle_revision: 2,
  };
}

function pagedVariant(kind: "good" | "omitted" | "repeated" | "out-of-order" | "switch") {
  const baseSource = source();
  const initialRequest: CoeRequest = { account_id: "acct_test", capability: null, assessment_mode: "LIVE", window_start: scope().requested_window_start, window_end: scope().requested_window_end, page_size: 500, cursor: null };
  const template = baseSource.operationalEvidence(initialRequest) as any;
  const records = [attempt("SUCCEEDED", "request:one"), { ...attempt("SUCCEEDED", "request:two"), event_seq: 2, event_id: "event:2", attempt_id: "attempt:2", request_id: "request:two", claim_identity: "claim:two" }];
  const root = sha256(canonicalJson(records));
  return { operationalEvidence(request: Readonly<CoeRequest>) {
    const index = request.cursor === null ? 0 : 1; const page = structuredClone(template);
    page.records = [records[index]]; page.coverage.scoped_count = 2; page.coverage.record_set_digest = root; page.coverage.snapshot_identity = "b".repeat(64); page.coverage.page_count = 1; page.coverage.page_offset = index;
    page.coverage.pagination_complete = index === 1; page.next_cursor = index === 0 ? "cursor:one" : null;
    if (kind === "omitted" && index === 1) page.coverage.page_offset = 2;
    if (kind === "out-of-order" && index === 0) page.coverage.page_offset = 1;
    if (kind === "switch" && index === 1) page.coverage.snapshot_identity = "c".repeat(64);
    if (kind === "repeated") { page.coverage.pagination_complete = false; page.next_cursor = "cursor:one"; }
    return page;
  }};
}

describe("WP3 WP2.5 COE-v1 narrow consumer T01-T24", () => {
  test("T01 exact accepted pins", () => expect(CATFOOD_THREADS_PINS).toMatchObject({ threads_sha: "875e75fce20c16c6157b5aa42f759411c52e95fe", release_sha256: "04cebd1f97928be56666e6dc82030da44aede7d5f9cb9c2efa5a40e027490e0c", coe_sha256: "50b6df97abc73384063a02cd69a7872b829d264177cad11d304678c04057db0e", schema: 33 }));

  test("T02 old Threads/release/COE/schema rejected", () => { for (const change of [{ threads_sha: "f".repeat(40) }, { threads_release_sha256: "f".repeat(64) }, { coe_sha256: "f".repeat(64) }, { threads_schema: 30 }]) expect(() => acquireCoe(source(), { ...scope(), ...change })).toThrow("COE_PIN_MISMATCH"); });

  test("T03 malformed/future/unknown COE rejected", () => {
    expect(() => acquisition(mutate((p) => { p.future = true; }))).toThrow("COE_UNKNOWN_OR_MISSING_FIELD");
    expect(() => acquisition(mutate((p) => { p.coverage.state = "FUTURE"; }))).toThrow("COE_COVERAGE_UNKNOWN");
  });

  test("T04 PARTIAL blocks", () => expect(assessCoe(acquisition(mutate((p) => { p.coverage.state = "PARTIAL"; })), clock().sample().wall_time).state).toBe("BLOCKED"));
  test("T05 UNKNOWN blocks", () => expect(assessCoe(acquisition(mutate((p) => { p.coverage.state = "UNKNOWN"; })), clock().sample().wall_time).reasons).toContain("COE_COVERAGE_UNKNOWN"));
  test("T06 UNBOUND blocks", () => expect(assessCoe(acquisition(mutate((p) => { p.coverage.window.state = "UNBOUND"; })), clock().sample().wall_time).reasons).toContain("COE_WINDOW_UNBOUND"));
  test("T07 COMPLETE + NONZERO is FAIL", () => expect(assessCoe(acquisition(mutate((p) => { p.prohibited_activity.activity = "NONZERO"; p.prohibited_activity.known_zero = false; })), clock().sample().wall_time).state).toBe("FAIL"));
  test("T08 COMPLETE + ZERO without current applicability blocks", () => expect(assessCoe(acquisition(mutate((p) => { p.operational_observation.coherent = false; })), clock().sample().wall_time).state).toBe("BLOCKED"));
  test("T09 HISTORICAL COMPLETE cannot satisfy LIVE", () => expect(() => acquisition(mutate((p) => { p.coverage.window.assessment_mode = "HISTORICAL"; }))).toThrow("COE_LIVE_WINDOW_MISMATCH"));
  test("T10 wrong requested window rejected", () => expect(() => acquisition(mutate((p) => { p.coverage.window.requested_window_start = "2026-09-29T00:00:00Z"; }))).toThrow("COE_LIVE_WINDOW_MISMATCH"));
  test("T11 uncovered interval blocks", () => expect(assessCoe(acquisition(mutate((p) => { p.coverage.window.uncovered_reasons = ["GAP"]; })), clock().sample().wall_time).reasons).toContain("COE_UNCOVERED_INTERVAL"));
  test("T12 stale observation blocks while producer clock noise does not break snapshot continuity", () => { expect(assessCoe(acquisition(mutate((p) => { p.operational_observation.observed_at = "2026-09-30T00:00:00Z"; })), clock().sample().wall_time).reasons).toContain("COE_OBSERVATION_STALE"); const one = acquisition(); const two = acquisition(mutate((p) => { p.operational_observation.observed_at = "2026-10-01T00:01:00Z"; p.operational_observation.observation_id = "f".repeat(64); p.runtime_enforcement.observed_at = "2026-10-01T00:01:00Z"; })); expect(stableCoeEvidence(two)).toEqual(stableCoeEvidence(one)); });

  test("T13 pagination omission/repetition/order/snapshot switch rejected", () => {
    expect(acquireCoe(pagedVariant("good"), scope()).records).toHaveLength(2);
    for (const kind of ["omitted", "repeated", "out-of-order", "switch"] as const) expect(() => acquireCoe(pagedVariant(kind), scope())).toThrow();
  });

  test("T14 record-set digest mismatch rejected", () => expect(() => acquisition(mutate((p) => { p.coverage.record_set_digest = "0".repeat(64); }))).toThrow("COE_RECORD_SET_DIGEST_MISMATCH"));
  test("T15 unresolved/pending/unattributed exposure blocks", () => { const result = assessCoe(acquisition(mutate((p) => { p.prohibited_activity.exposure = "PENDING"; p.prohibited_activity.pending_cost_count = 1; p.prohibited_activity.unattributed_attempt_count = 1; })), clock().sample().wall_time); expect(result.state).toBe("BLOCKED"); expect(result.reasons).toContain("COE_COST_OR_ATTRIBUTION_UNRESOLVED"); });

  test("T16 governed BLOCKED/FAILED/REPLAY units receive zero credit", () => { for (const state of ["FAILED", "REPLAYED", "REJECTED_PRECLAIM"]) { const evidence = { ...acquisition(), records: [attempt(state)] } as CoeAcquisition; expect(verifyGovernedWork(evidence, { account_id: "acct_test", capability: "editorial.cycle", claim_id: "claim:one", request_id: "request:one", authority_ref: "authority:one", generation: 1, business_identity: "article:one", material_revision: "a".repeat(64), domain_result: {} }, "e".repeat(64), "org:test")).toBe(false); } });
  test("T17 semantic duplicate under fresh request ID receives zero credit", () => { const evidence = { ...acquisition(), records: [attempt("DUPLICATE", "request:fresh")] } as CoeAcquisition; expect(verifyGovernedWork(evidence, { account_id: "acct_test", capability: "editorial.cycle", claim_id: "claim:one", request_id: "request:fresh", authority_ref: "authority:one", generation: 1, business_identity: "article:one", material_revision: "a".repeat(64), domain_result: {} }, "e".repeat(64), "org:test")).toBe(false); });
  test("T18 only real capability classes decode", () => expect(() => acquisition(mutate((p) => { const row = attempt(); row.capability = "caller.invented"; p.records = [row]; p.coverage.scoped_count = 1; p.coverage.page_count = 1; p.coverage.record_set_digest = sha256(canonicalJson(p.records)); }))).toThrow("COE_RECORD_SCOPE_INVALID"));

  test("T19 outcome route preserves authority/spec/generation/idempotency", () => { const request = validateOutcomeEvaluationRequest({ account_id: "acct_test", capability: "editorial.outcome_evaluation", request_id: "stable-key", experiment_id: "experiment:one", expected_material_revision: "a".repeat(64), authority_ref: "authority:one", spec_hash: "b".repeat(64), expected_threads_generation: 7, runtime_observation_id: `1.${"c".repeat(64)}`, expected_release_git_sha: CATFOOD_THREADS_PINS.threads_sha }); expect(request).toMatchObject({ request_id: "stable-key", authority_ref: "authority:one", expected_threads_generation: 7 }); });
  test("T20 outcome timeout remains same-key unresolved", () => { const request = validateOutcomeEvaluationRequest({ account_id: "acct_test", capability: "editorial.outcome_evaluation", request_id: "timeout-key", experiment_id: "experiment:one", expected_material_revision: "a".repeat(64), authority_ref: "authority:one", spec_hash: "b".repeat(64), expected_threads_generation: 1, runtime_observation_id: `1.${"c".repeat(64)}`, expected_release_git_sha: CATFOOD_THREADS_PINS.threads_sha }); expect(validateOutcomeEvaluationRequest(request).request_id).toBe("timeout-key"); });
  test("T21 effective tenant OFF/UNKNOWN blocks", () => { expect(assessCoe(acquisition(mutate((p) => { p.runtime_enforcement.configured_auth_state = "OFF"; p.runtime_enforcement.effective_auth_mode = "NOT_ENFORCED"; })), clock().sample().wall_time).reasons).toContain("COE_TENANT_ENFORCEMENT_UNPROVED"); expect(() => acquisition(mutate((p) => { p.runtime_enforcement.configured_auth_state = "UNKNOWN"; }))).toThrow("COE_TENANT_STATE_UNKNOWN"); });
  test("T22 negative tenant probe is a separate required future gate", () => { const value = source(); expect(value.runtimeEvidence({} as never).foreign_scope_status).toBe(403); expect(value.runtimeEvidence({} as never).own_scope_status).toBe(200); });
  test("T23 current no-operational-proof state is BLOCKED", () => { const result = assessCoe(acquisition(mutate((p) => { p.coverage.state = "PARTIAL"; p.coverage.prospective.state = "PARTIAL"; p.coverage.window.state = "UNBOUND"; p.prohibited_activity.coverage = "PARTIAL"; p.prohibited_activity.activity = "UNKNOWN"; p.prohibited_activity.exposure = "UNKNOWN"; p.prohibited_activity.known_zero = false; p.operational_observation.trust.status = "UNBOUND"; p.operational_observation.topology.status = "UNBOUND"; p.operational_observation.checkpoint.status = "UNBOUND"; p.operational_observation.coherent = false; p.operational_observation.security_revision_before = null; p.operational_observation.security_revision_after = null; p.coverage.prospective.proof_applicable = false; p.coverage.prospective.proof_id = null; })), clock().sample().wall_time); expect(result.state).toBe("BLOCKED"); expect(result.reasons).toContain("COE_OPERATIONAL_TRUST_UNBOUND"); });
  test("T24 synthetic COMPLETE is TEST_ONLY, not a real CATFOOD pass", () => { const result = assessCoe(acquisition(), clock().sample().wall_time); expect(result.state).toBe("READY"); expect(result.evidence.test_only).toBe(true); });
});
