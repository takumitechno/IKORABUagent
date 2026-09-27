import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalJson, sha256 } from "../web/lib/catfood-harness";
import {
  CATFOOD_THREADS_DEPENDENCY_ROOT, CATFOOD_THREADS_PINS, COE_B_REDUCTION_RULES, COE_FIELD_REGISTRY, acquireCoe, assessCoe, assertFrozenDependencies, canonicalCoeJson, decodeCoeFixture, foldProducerAttempts, governedEvidenceReasons, parseJsonNoDuplicateKeys,
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

describe("WP3 corrective02 producer composition", () => {
  test("T01-T03 folds producer lifecycle revisions without arrival-order credit", () => {
    const succeeded = attempt(); const claimed = claimFor(succeeded);
    const evidence = { ...acquisition(), records: [succeeded, claimed] } as CoeAcquisition; const folded = foldProducerAttempts(evidence);
    expect(folded).toHaveLength(1); expect(folded[0]!.lifecycle.map((row) => row.lifecycle_revision)).toEqual([1, 2]); expect(folded[0]!.terminal.event_type).toBe("SUCCEEDED"); expect(governedEvidenceReasons(evidence)).not.toContain("COE_GOVERNED_WORK_UNRESOLVED");
    expect(() => foldProducerAttempts({ ...evidence, records: [claimed, { ...succeeded, lifecycle_revision: 1 }] })).toThrow("COE_LIFECYCLE_REVISION_CONFLICT");
    expect(() => foldProducerAttempts({ ...evidence, records: [claimed, { ...succeeded, account_id: "acct_other" }] })).toThrow("COE_LIFECYCLE_IDENTITY_DRIFT");
  });

  test("T05-T08 null org requires the protected invocation binding and unrelated failures do not poison COE health", () => {
    const row = { ...attempt(), org_id: null, authenticated_org_id: null }; const claimed = { ...claimFor(row), org_id: null, authenticated_org_id: null }; const evidence = { ...acquisition(), records: [claimed, row, authorityFor(row)] } as CoeAcquisition;
    const work = { account_id: "acct_test", capability: "editorial.cycle", claim_id: "claim:one", request_id: "request:one", authority_ref: "authority:one", generation: 1, business_identity: "article:one", material_revision: "a".repeat(64), domain_result: JSON.parse(String(row.result_json)) };
    expect(verifyGovernedWork(evidence, work, "e".repeat(64), "org:test").reason).toBe("COE_GOVERNED_WORK_IDENTITY_MISMATCH");
    const invocation_receipt = { receipt_id: "receipt:one", source_session_id: "source:one", principal_ref: "principal:one", credential_version_ref: "credential:v1", organization_id: "org:test", account_id: "acct_test", capability: "editorial.cycle", authority_ref: "authority:one", spec_hash: "e".repeat(64), generation: 1, authority_event_id: "authority:event:one", authority_actor: "principal:one", authority_occurred_at: "2026-09-30T23:59:58+00:00" };
    expect(verifyGovernedWork(evidence, { ...work, invocation_receipt }, "e".repeat(64), "org:test").disposition).toBe("CREDIT");
    const unrelated = { ...attempt("FAILED", "request:old"), claim_identity: "claim:old", attempt_id: "attempt:old", event_id: "event:old", occurred_at: "2020-01-01T00:00:01+00:00" };
    expect(assessCoe({ ...acquisition(), records: [{ ...claimFor(unrelated), event_id: "event:old:claim", occurred_at: "2020-01-01T00:00:00+00:00" }, unrelated] } as CoeAcquisition, clock().sample().wall_time).state).toBe("READY");
  });

  test("T10/T23 registry is explicit and frozen producer canonical vectors are independent", () => {
    expect(Object.keys(COE_FIELD_REGISTRY).length).toBeGreaterThan(100); expect(Object.values(COE_FIELD_REGISTRY)).toContain("A_IMMUTABLE_EQUAL"); expect(Object.values(COE_FIELD_REGISTRY)).toContain("B_CONSERVATIVE"); expect(Object.values(COE_FIELD_REGISTRY)).toContain("C_PAGE_LOCAL");
    expect(Object.entries(COE_FIELD_REGISTRY).filter(([, kind]) => kind === "B_CONSERVATIVE").every(([path]) => path in COE_B_REDUCTION_RULES)).toBe(true);
    const vectors = JSON.parse(readFileSync(resolve(import.meta.dir, "../contracts/catfood-producer-canonical-v1.json"), "utf8"));
    for (const vector of vectors.cases) { const canonical = canonicalCoeJson(vector.value); expect(Buffer.from(vector.canonical_utf8_base64url, "base64url").toString("utf8")).toBe(canonical); expect(sha256(canonical)).toBe(vector.sha256); }
  });

  test("T23 preserves exact response bytes separately from semantic record roots", () => {
    const template = source().operationalEvidence({ account_id: "acct_test", capability: null, assessment_mode: "LIVE", window_start: scope().requested_window_start, window_end: scope().requested_window_end, page_size: 500, cursor: null });
    const captured = (raw: string) => ({ operationalEvidence: () => ({ parsed: JSON.parse(raw), receipt: { representation: "AUTHENTICATED_DECODED_BODY", body_base64url: Buffer.from(raw).toString("base64url"), byte_length: Buffer.byteLength(raw), body_sha256: sha256(raw), content_type: "application/json", content_encoding: "identity", source_session_id: "source:test" } }) });
    const compact = JSON.stringify(template); const spaced = JSON.stringify(template, null, 2); const one = acquireCoe(captured(compact), scope()); const two = acquireCoe(captured(spaced), scope());
    expect(one.coverage.record_set_digest).toBe(two.coverage.record_set_digest); expect(one.page_receipts[0]!.body_sha256).not.toBe(two.page_receipts[0]!.body_sha256); expect(one.representation).toBe("AUTHENTICATED_DECODED_BODY");
  });

  test("corrective04 folds producer duplicate origins with intentional terminal nulls", () => {
    const first = attempt("DUPLICATE", "request:fresh");
    const duplicate = { ...first, event_id: "event:2", event_seq: 2, lifecycle_revision: 2, authority_ref: null, spec_hash: null, threads_generation: null };
    expect(foldProducerAttempts({ ...acquisition(), records: [first, duplicate] } as CoeAcquisition)[0]!.terminal.authority_ref).toBe("authority:one");
    const failed = { ...duplicate, event_type: "FAILED", execution_state: "FAILED", reason_code: "canonical_projection_failed" };
    expect(foldProducerAttempts({ ...acquisition(), records: [first, failed] } as CoeAcquisition)[0]!.terminal.event_type).toBe("FAILED");
    expect(() => foldProducerAttempts({ ...acquisition(), records: [first, { ...duplicate, account_id: "acct_other" }] } as CoeAcquisition)).toThrow("COE_LIFECYCLE_IDENTITY_DRIFT");
  });

  test("corrective04 binds dynamic emitter membership to the accepted inventory digest", () => {
    expect(() => acquisition(mutate((page) => { page.prohibited_activity.emitter_dispositions.pop(); }))).toThrow("COE_EMITTER_INVENTORY_MISMATCH");
  });

  test("corrective04 bounds producer-defined target JSON and rejects credential keys", () => {
    expect(() => acquisition(mutate((page) => { page.outcome_evaluation_targets[0].source.hypothesis_json = canonicalJson({ id: "hook", hypothesis: "x", test_variable: "hook", evidence: "x", client_token: "plain" }); }))).toThrow();
    expect(() => acquisition(mutate((page) => { page.outcome_evaluation_targets[0].source.source_content_ids_json = canonicalJson(["ok", { api_token: "plain" }]); }))).toThrow("COE_OUTCOME_TARGET_INVALID");
  });
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
    claimed_authority_ref: null, spec_hash: "e".repeat(64), verified_spec_hash: "e".repeat(64),
    claimed_spec_hash: null, threads_generation: 1, verified_threads_generation: 1, claimed_threads_generation: null,
    business_identity: "article:one", material_revision: "a".repeat(64), admission_state: "ADMITTED",
    execution_state: eventType === "SUCCEEDED" ? "SUCCEEDED" : "FAILED", duplicate_of_request_id: eventType === "DUPLICATE" ? "request:old" : null,
    result_identity: eventType === "SUCCEEDED" ? "result:one" : null, result_json: eventType === "SUCCEEDED" ? canonicalJson({ cycle_id: "result:one", account_id: "acct_test", cycle_key: "article:one", state: "DRAFT", status: "READY", current_agent: "Writer", waiting_reason: null, source_content_ids: [], config: {}, summary: {}, brief: {}, draft: {}, content_id: null, created_at: "2026-09-30T23:59:59+00:00", updated_at: "2026-10-01T00:00:00+00:00", mutated: false }) : null,
    result_revision: "2026-10-01T00:00:00+00:00", domain_state: "DRAFT", occurred_at: "2026-10-01T00:00:00+00:00",
    payload_hash: "f".repeat(64), request_fingerprint: "1".repeat(64), reason_code: null, lifecycle_revision: ["SUCCEEDED", "FAILED", "UNRESOLVED"].includes(eventType) ? 2 : 1,
  };
}

function claimFor(terminal: ReturnType<typeof attempt>) {
  return { ...terminal, event_seq: 0, event_id: `${terminal.event_id}:claim`, event_type: "CLAIMED", admission_state: "ADMITTED", execution_state: "IN_PROGRESS", lifecycle_revision: 1, claimed_authority_ref: terminal.authority_ref, claimed_spec_hash: terminal.spec_hash, claimed_threads_generation: terminal.threads_generation, result_identity: null, result_json: null, result_revision: null, domain_state: null, occurred_at: "2026-09-30T23:59:59+00:00" };
}

function authorityFor(row: ReturnType<typeof attempt>) {
  return { source: "operational_authority_events", event_seq: 99, event_id: "authority:event:one", account_id: row.account_id, capability: row.capability, event_type: "GRANTED", authority_ref: row.authority_ref, spec_hash: row.spec_hash, generation: row.threads_generation, state: "active", permit_expires_at: "2026-10-01T00:01:00+00:00", actor: "principal:one", occurred_at: "2026-09-30T23:59:58+00:00", payload_hash: "2".repeat(64) };
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

function middlePartialPages() {
  const baseSource = source();
  const template = baseSource.operationalEvidence({ account_id: "acct_test", capability: null, assessment_mode: "LIVE", window_start: scope().requested_window_start, window_end: scope().requested_window_end, page_size: 500, cursor: null }) as any;
  const records = [0, 1, 2].map((index) => ({ ...attempt("SUCCEEDED", `request:${index}`), event_seq: index + 1, event_id: `event:${index}`, attempt_id: `attempt:${index}`, request_id: `request:${index}`, claim_identity: `claim:${index}` }));
  const root = sha256(canonicalJson(records));
  return { operationalEvidence(request: Readonly<CoeRequest>) {
    const index = request.cursor === null ? 0 : Number(request.cursor.slice(-1)); const page = structuredClone(template);
    page.records = [records[index]]; page.coverage.scoped_count = 3; page.coverage.record_set_digest = root; page.coverage.snapshot_identity = "b".repeat(64); page.coverage.page_count = 1; page.coverage.page_offset = index;
    page.coverage.pagination_complete = index === 2; page.next_cursor = index === 2 ? null : `cursor:${index + 1}`;
    if (index === 0) { page.coverage.window.state = "UNBOUND"; page.coverage.window.uncovered_reasons = ["EARLY_SECURITY_GAP"]; page.prohibited_activity.activity = "NONZERO"; page.prohibited_activity.known_zero = false; page.prohibited_activity.provider_attempt_count = 2; page.prohibited_activity.known_cost_count = 3; }
    if (index === 1) { page.coverage.state = "PARTIAL"; page.coverage.window.state = "PARTIAL"; page.coverage.window.uncovered_reasons = ["MIDDLE_PAGE_GAP"]; page.coverage.prospective.state = "PARTIAL"; page.coverage.prospective.proof_applicable = false; page.coverage.unresolved_count = 1; page.prohibited_activity.coverage = "PARTIAL"; page.prohibited_activity.activity = "UNKNOWN"; page.prohibited_activity.exposure = "PENDING"; page.prohibited_activity.known_zero = false; page.prohibited_activity.pending_cost_count = 1; }
    return page;
  }};
}

describe("WP3 WP2.5 COE-v1 narrow consumer T01-T24", () => {
  test("T01 exact accepted pins and contract bytes", () => { expect(CATFOOD_THREADS_PINS).toMatchObject({ threads_sha: "875e75fce20c16c6157b5aa42f759411c52e95fe", release_sha256: "04cebd1f97928be56666e6dc82030da44aede7d5f9cb9c2efa5a40e027490e0c", coe_sha256: "50b6df97abc73384063a02cd69a7872b829d264177cad11d304678c04057db0e", schema: 33 }); expect(createHash("sha256").update(readFileSync(resolve(import.meta.dir, "../contracts/catfood-operational-evidence-v1.json"))).digest("hex")).toBe(CATFOOD_THREADS_PINS.coe_sha256); });

  test("T02 old Threads/release/COE/schema rejected", () => { for (const change of [{ threads_sha: "f".repeat(40) }, { threads_release_sha256: "f".repeat(64) }, { coe_sha256: "f".repeat(64) }, { threads_schema: 30 }, { threads_schema_fingerprint: "f".repeat(64) }]) expect(() => acquireCoe(source(), { ...scope(), ...change })).toThrow("COE_PIN_MISMATCH"); expect(() => assertFrozenDependencies({ ...scope(), wp1_sha256: "f".repeat(64) })).toThrow("COE_PIN_MISMATCH"); expect(() => assertFrozenDependencies({ ...scope(), operational_boundary_sha256: "f".repeat(64) })).toThrow("COE_PIN_MISMATCH"); });

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
  test("T12 stale observation blocks while producer clock noise does not break snapshot continuity", () => { expect(assessCoe(acquisition(mutate((p) => { p.operational_observation.observed_at = "2026-09-29T00:00:00Z"; })), clock().sample().wall_time).reasons).toContain("COE_OBSERVATION_STALE"); const one = acquisition(); const two = acquisition(mutate((p) => { p.operational_observation.observed_at = "2026-10-01T00:01:00Z"; p.operational_observation.observation_id = "f".repeat(64); p.runtime_enforcement.observed_at = "2026-10-01T00:01:00Z"; })); expect(stableCoeEvidence(two)).toEqual(stableCoeEvidence(one)); });

  test("T13 pagination omission/repetition/order/snapshot switch rejected", () => {
    expect(acquireCoe(pagedVariant("good"), scope()).records).toHaveLength(2);
    for (const kind of ["omitted", "repeated", "out-of-order", "switch"] as const) expect(() => acquireCoe(pagedVariant(kind), scope())).toThrow();
  });

  test("corrective pagination reduction retains every adverse page and positive snapshot total", () => { const value = acquireCoe(middlePartialPages(), scope()); expect(value.coverage).toMatchObject({ state: "PARTIAL", unresolved_count: 1, window: { state: "UNBOUND", uncovered_reasons: ["EARLY_SECURITY_GAP", "MIDDLE_PAGE_GAP"] }, prospective: { state: "PARTIAL", proof_applicable: false } }); expect(value.prohibited_activity).toMatchObject({ coverage: "PARTIAL", activity: "NONZERO", exposure: "PENDING", known_zero: false, pending_cost_count: 1, provider_attempt_count: 2, known_cost_count: 3 }); expect(assessCoe(value, clock().sample().wall_time).state).toBe("FAIL"); });

  test("T14 record-set digest mismatch rejected", () => expect(() => acquisition(mutate((p) => { p.coverage.record_set_digest = "0".repeat(64); }))).toThrow("COE_RECORD_SET_DIGEST_MISMATCH"));
  test("T15 unresolved/pending/unattributed exposure blocks", () => { const result = assessCoe(acquisition(mutate((p) => { p.prohibited_activity.exposure = "PENDING"; p.prohibited_activity.pending_cost_count = 1; p.prohibited_activity.unattributed_attempt_count = 1; })), clock().sample().wall_time); expect(result.state).toBe("BLOCKED"); expect(result.reasons).toContain("COE_COST_OR_ATTRIBUTION_UNRESOLVED"); });

  test("T16 governed BLOCKED/FAILED/REPLAY units receive zero credit", () => { for (const state of ["FAILED", "REPLAYED", "REJECTED_PRECLAIM"]) { const terminal = attempt(state); const records = state === "FAILED" ? [claimFor(terminal), terminal] : [terminal]; const evidence = { ...acquisition(), records } as CoeAcquisition; expect(verifyGovernedWork(evidence, { account_id: "acct_test", capability: "editorial.cycle", claim_id: "claim:one", request_id: "request:one", authority_ref: "authority:one", generation: 1, business_identity: "article:one", material_revision: "a".repeat(64), domain_result: {} }, "e".repeat(64), "org:test").credit_eligible).toBe(false); } });
  test("T17 semantic duplicate under fresh request ID receives zero credit", () => { const evidence = { ...acquisition(), records: [attempt("DUPLICATE", "request:fresh")] } as CoeAcquisition; expect(verifyGovernedWork(evidence, { account_id: "acct_test", capability: "editorial.cycle", claim_id: "claim:one", request_id: "request:fresh", authority_ref: "authority:one", generation: 1, business_identity: "article:one", material_revision: "a".repeat(64), domain_result: {} }, "e".repeat(64), "org:test").disposition).toBe("ZERO"); });
  test("corrective governed result mismatch is FAIL, not an evaluator exception", () => { const terminal = attempt(); const evidence = { ...acquisition(), records: [claimFor(terminal), terminal] } as CoeAcquisition; expect(verifyGovernedWork(evidence, { account_id: "acct_test", capability: "editorial.cycle", claim_id: "claim:one", request_id: "request:one", authority_ref: "authority:one", generation: 1, business_identity: "article:one", material_revision: "a".repeat(64), domain_result: { state: "OTHER" } }, "e".repeat(64), "org:test")).toMatchObject({ disposition: "FAIL", reason: "COE_GOVERNED_RESULT_MISMATCH" }); });
  test("T18 only real capability classes decode", () => expect(() => acquisition(mutate((p) => { const row = attempt(); row.capability = "caller.invented"; p.records = [row]; p.coverage.scoped_count = 1; p.coverage.page_count = 1; p.coverage.record_set_digest = sha256(canonicalJson(p.records)); }))).toThrow("COE_RECORD_SCOPE_INVALID"));

  test("T19 outcome route preserves authority/spec/generation/idempotency", () => { const request = validateOutcomeEvaluationRequest({ account_id: "acct_test", capability: "editorial.outcome_evaluation", request_id: "stable-key", experiment_id: "experiment:one", expected_material_revision: "a".repeat(64), authority_ref: "authority:one", spec_hash: "b".repeat(64), expected_threads_generation: 7, runtime_observation_id: `1.${"c".repeat(64)}`, expected_release_git_sha: CATFOOD_THREADS_PINS.threads_sha }); expect(request).toMatchObject({ request_id: "stable-key", authority_ref: "authority:one", expected_threads_generation: 7 }); });
  test("T20 outcome timeout remains same-key unresolved", () => { const request = validateOutcomeEvaluationRequest({ account_id: "acct_test", capability: "editorial.outcome_evaluation", request_id: "timeout-key", experiment_id: "experiment:one", expected_material_revision: "a".repeat(64), authority_ref: "authority:one", spec_hash: "b".repeat(64), expected_threads_generation: 1, runtime_observation_id: `1.${"c".repeat(64)}`, expected_release_git_sha: CATFOOD_THREADS_PINS.threads_sha }); expect(validateOutcomeEvaluationRequest(request).request_id).toBe("timeout-key"); });
  test("T21 effective tenant OFF/UNKNOWN blocks", () => { expect(assessCoe(acquisition(mutate((p) => { p.runtime_enforcement.configured_auth_state = "OFF"; p.runtime_enforcement.effective_auth_mode = "NOT_ENFORCED"; })), clock().sample().wall_time).reasons).toContain("COE_TENANT_ENFORCEMENT_UNPROVED"); expect(() => acquisition(mutate((p) => { p.runtime_enforcement.configured_auth_state = "UNKNOWN"; }))).toThrow("COE_TENANT_STATE_UNKNOWN"); });
  test("T22 negative tenant probe is a separate required future gate", () => { const value = source(); expect(value.runtimeEvidence({} as never).foreign_scope_status).toBe(403); expect(value.runtimeEvidence({} as never).own_scope_status).toBe(200); });
  test("T23 current no-operational-proof state is BLOCKED", () => { const result = assessCoe(acquisition(mutate((p) => { p.coverage.state = "PARTIAL"; p.coverage.prospective.state = "PARTIAL"; p.coverage.window.state = "UNBOUND"; p.prohibited_activity.coverage = "PARTIAL"; p.prohibited_activity.activity = "UNKNOWN"; p.prohibited_activity.exposure = "UNKNOWN"; p.prohibited_activity.known_zero = false; p.operational_observation.trust.status = "UNBOUND"; p.operational_observation.topology.status = "UNBOUND"; p.operational_observation.checkpoint.status = "UNBOUND"; p.operational_observation.coherent = false; p.operational_observation.security_revision_before = null; p.operational_observation.security_revision_after = null; p.coverage.prospective.proof_applicable = false; p.coverage.prospective.proof_id = null; })), clock().sample().wall_time); expect(result.state).toBe("BLOCKED"); expect(result.reasons).toContain("COE_OPERATIONAL_TRUST_UNBOUND"); });
  test("T24 synthetic COMPLETE is TEST_ONLY, not a real CATFOOD pass", () => { const result = assessCoe(acquisition(), clock().sample().wall_time); expect(result.state).toBe("READY"); expect(result.evidence.test_only).toBe(true); });

  test("corrective literal producer fixture keeps legitimate secret-like labels and remains blocked", () => {
    const raw = readFileSync(resolve(import.meta.dir, "../contracts/catfood-operational-evidence-v1-negative-partial.json"), "utf8");
    const decoded = decodeCoeFixture(raw); expect(raw).toContain("access_token"); expect(raw).toContain("anthropic-api-key"); expect(raw).toContain("BRIDGE_API_KEY_MISSING");
    expect(assessCoe(decoded, clock().sample().wall_time).state).toBe("BLOCKED"); expect(CATFOOD_THREADS_DEPENDENCY_ROOT).toHaveLength(64);
  });

  test("corrective raw decoder rejects duplicate keys and actual secret values without echo", () => {
    expect(() => parseJsonNoDuplicateKeys('{"a":1,"a":2}')).toThrow("COE_DUPLICATE_JSON_KEY");
    const raw = readFileSync(resolve(import.meta.dir, "../contracts/catfood-operational-evidence-v1-negative-partial.json"), "utf8").replace("BRIDGE_API_KEY_MISSING", "Bearer super-secret-material");
    let message = ""; try { decodeCoeFixture(raw); } catch (error) { message = String(error); } expect(message).toContain("COE_SECRET_VALUE:"); expect(message).not.toContain("super-secret-material");
  });
});
