import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { createPrivateKey, generateKeyPairSync, sign, verify } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Worker } from "node:worker_threads";
import { canonicalJson, sha256, type OperationalBoundaryV1 } from "../web/lib/catfood-harness";
import {
  CATFOOD_CAPABILITIES, CATFOOD_FIXED_POLICY, CATFOOD_GO_SCHEMA,
  CATFOOD_POLICY_SHA256, CATFOOD_TRUST_SCHEMA, ProtectedCatfoodCustodian, createCatfoodRunSpec,
  IndependentCatfoodEvaluator, evaluateCatfoodAcceptance, initializeProtectedCatfoodStores, verifyHumanGo, type CatfoodRunSpec, type CatfoodTrustConfig,
  normalizeWorkDispatchEvidence, type HumanGoPayload, type RunnerSession,
} from "../web/lib/catfood-trust";
import { FixtureThreadsSource, TestClock, producerEditorialResult, testEnrollmentFixture } from "./catfood-trust-fixture";
// V3 is retained only as diagnostic historical coverage. V4 acceptance is exercised in catfood-role-channel.test.ts.
import { IndependentCatfoodAttestationWriter, initializeIndependentAttestationStore, verifyIndependentAttestation } from "../web/lib/catfood-independent-attestation-v3";
import { CATFOOD_THREADS_PINS } from "../web/lib/catfood-coe";
import { openOperationalCatfoodCustodian, verifyOperationalIndependentAttestation } from "../web/lib/catfood-operational-bootstrap";
import { OperationalThreadsEvidenceSource } from "../web/lib/catfood-threads-http";
import { issueEnrolledActionReceipt } from "../web/lib/catfood-enrollment";

const THREADS = CATFOOD_THREADS_PINS.threads_sha;
const BOUNDARY = "57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf";
const RELEASE = CATFOOD_THREADS_PINS.release_sha256;
const IKORABU = "c".repeat(40);

type Rig = ReturnType<typeof rig>;

function rig(runId = `run-${Math.random().toString(16).slice(2)}`) {
  const dir = mkdtempSync(join(tmpdir(), "catfood-trust-")); const control = join(dir, "control.db"); const checkpoint = join(dir, "checkpoint.db");
  writeFileSync(control, ""); writeFileSync(checkpoint, "");
  const keys = generateKeyPairSync("ed25519"); const publicKey = keys.publicKey.export({ type: "spki", format: "pem" }).toString();
  const clock = new TestClock();
  const trust: CatfoodTrustConfig = { schema: CATFOOD_TRUST_SCHEMA, custodian_identity: "custodian:test", environment_type: "test", environment_instance_id: "instance:test", organization_id: "org:test", tenant_id: "org:test", account_id: "acct_test", ikorabu_release_sha: IKORABU, threads_sha: THREADS, operational_boundary_sha256: BOUNDARY, threads_release_sha256: RELEASE, wp1_sha256: CATFOOD_THREADS_PINS.wp1_sha256, coe_sha256: CATFOOD_THREADS_PINS.coe_sha256, rehearsal_attestation_sha256: CATFOOD_THREADS_PINS.rehearsal_attestation_sha256, emitter_inventory_sha256: CATFOOD_THREADS_PINS.emitter_inventory_sha256, threads_schema: 33, threads_schema_fingerprint: CATFOOD_THREADS_PINS.schema_fingerprint, source_mode: "TEST_ONLY", go_keys: [{ key_id: "go:test", public_key_pem: publicKey, trust_class: "TEST_ONLY" }] };
  const spec = createCatfoodRunSpec({ run_id: runId, environment_type: "test", environment_instance_id: trust.environment_instance_id, organization_id: trust.organization_id, tenant_id: trust.tenant_id, account_id: trust.account_id, capabilities: CATFOOD_CAPABILITIES, effective_config_sha256: "4".repeat(64), ikorabu_release_sha: IKORABU, threads_sha: THREADS, operational_boundary_sha256: BOUNDARY, threads_release_sha256: RELEASE, wp1_sha256: trust.wp1_sha256, coe_sha256: trust.coe_sha256, rehearsal_attestation_sha256: trust.rehearsal_attestation_sha256, emitter_inventory_sha256: trust.emitter_inventory_sha256, threads_schema: 33, threads_schema_fingerprint: trust.threads_schema_fingerprint, requested_window_start: "2026-09-30T00:00:00Z", requested_window_end: "2026-10-01T00:00:00Z" });
  const payload: HumanGoPayload = { schema: CATFOOD_GO_SCHEMA, grant_id: `grant:${runId}`, nonce: `nonce:${runId}`, run_id: runId, spec_hash: spec.spec_sha256, environment_type: spec.environment_type, environment_instance_id: spec.environment_instance_id, organization_id: spec.organization_id, tenant_id: spec.tenant_id, account_id: spec.account_id, capabilities: CATFOOD_CAPABILITIES, valid_from: new Date(clock.wallMs - 1_000).toISOString(), valid_until: new Date(clock.wallMs + 90_000_000).toISOString(), maximum_duration_seconds: 86_400, maximum_wp3_epoch: 2, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, threads_sha: THREADS, operational_boundary_sha256: BOUNDARY, threads_release_sha256: RELEASE, threads_schema: 33, ikorabu_release_sha: IKORABU, paid_provider_allowance: "ZERO" };
  const artifact = signGo(payload, keys.privateKey);
  initializeProtectedCatfoodStores(control, checkpoint, trust, clock.sample().wall_time);
  const source = new FixtureThreadsSource(clock, THREADS, RELEASE);
  const custodian = new ProtectedCatfoodCustodian(control, checkpoint, source, clock);
  return { dir, control, checkpoint, clock, trust, spec, payload, artifact, source, custodian, privateKey: keys.privateKey, close() { try { custodian.close(); } finally { rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } } };
}

function signGo(payload: HumanGoPayload | Record<string, unknown>, privateKey: ReturnType<typeof createPrivateKey> | ReturnType<typeof generateKeyPairSync>["privateKey"]): string {
  const bytes = Buffer.from(canonicalJson(payload));
  return canonicalJson({ algorithm: "Ed25519", key_id: "go:test", payload: bytes.toString("base64url"), signature: sign(null, bytes, privateKey).toString("base64url") });
}

function start(r: Rig): RunnerSession { r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.armObservation(session, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" }); const receipt = r.custodian.preflight(session); r.custodian.activate(session, receipt); return session; }
function work(r: Rig, session: RunnerSession, capability: "editorial.cycle" | "editorial.outcome_evaluation" | "threads.publish.dry_run", sourceId: string) { const ticket = r.custodian.admit(session, capability, sourceId); r.source.complete(ticket.claim_id); r.custodian.reconcile(session, ticket.work_id); return ticket; }
function positive(r: Rig) {
  const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); r.custodian.stop(first, "STOP");
  r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt);
  work(r, second, "editorial.outcome_evaluation", "outcome:one"); work(r, second, "threads.publish.dry_run", "dry:one");
  r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); return { second, result: r.custodian.closeRun(second) };
}

function issueTestAttestation(r: Rig, name: string) {
  const fixture = testEnrollmentFixture(r.spec.run_id, "a".repeat(64), r.clock.wallMs), store = join(r.dir, name); writeFileSync(store, "");
  initializeIndependentAttestationStore(store, { writer_identity: "attestor:test", signing_key_id: fixture.writer.key_id, signing_public_key_pem: fixture.writer.public_key_pem });
  const writer = new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, store, r.source, fixture.writer.private_key_pem, fixture.contexts); let id: string; try { id = writer.attest(r.spec.run_id, r.clock.sample().wall_time); } finally { writer.close(); }
  const db = new Database(store, { readonly: true }), row = db.query<{ artifact_json: string; payload_json: string; signature_base64url: string; bundle_sha256: string }, [string]>("SELECT artifact_json,payload_json,signature_base64url,bundle_sha256 FROM independent_attestations WHERE attestation_id=?").get(id)!; db.close();
  return { fixture, store, id, row };
}

function forgeTestArtifact(artifactJson: string, privateKeyPem: string, mutate: (payload: Record<string, any>, artifact: Record<string, any>) => void): string {
  const artifact = JSON.parse(artifactJson), payload = JSON.parse(artifact.payload_json); mutate(payload, artifact); artifact.payload_json = canonicalJson(payload); artifact.signature_base64url = sign(null, Buffer.from(`IKORABU/WP3/CATFOOD/ATTESTATION/V3\n${artifact.payload_json}`), createPrivateKey(privateKeyPem)).toString("base64url"); return canonicalJson(artifact);
}

function failRun(r: Rig) {
  const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); r.custodian.stop(first, "STOP"); r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt); work(r, second, "editorial.outcome_evaluation", "outcome:one"); r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); return r.custodian.closeRun(second);
}

function blockedRun(r: Rig) {
  const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); const claim = r.source.claim.bind(r.source); r.source.claim = ((...args: Parameters<typeof claim>) => { if (args[1].source_id === "cycle:two") throw new Error("response lost"); return claim(...args); }) as typeof r.source.claim; try { r.custodian.admit(first, "editorial.cycle", "cycle:two"); } catch {} r.source.claim = claim; r.custodian.stop(first, "STOP"); r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt); work(r, second, "editorial.outcome_evaluation", "outcome:one"); work(r, second, "threads.publish.dry_run", "dry:one"); r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); return r.custodian.closeRun(second);
}

function journalBase(row: Record<string, unknown>, previous: string): Record<string, unknown> {
  return { run_id: String(row.run_id), sequence: Number(row.sequence), event_type: String(row.event_type), environment_type: String(row.environment_type), environment_instance_id: String(row.environment_instance_id), organization_id: String(row.organization_id), tenant_id: String(row.tenant_id), account_id: String(row.account_id), owner_session_id: String(row.owner_session_id), wp3_epoch: Number(row.wp3_epoch), threads_generation: row.threads_generation === null ? null : Number(row.threads_generation), source_provenance: String(row.source_provenance), claim_id: row.claim_id === null ? null : String(row.claim_id), request_id: row.request_id === null ? null : String(row.request_id), observed_at: String(row.observed_at), monotonic_ms: Number(row.monotonic_ms), boot_id: String(row.boot_id), payload_json: JSON.parse(String(row.payload_json)), previous_row_hash: previous };
}

function rehashBoundary(boundary: OperationalBoundaryV1, changes: Record<string, unknown>): OperationalBoundaryV1 {
  const value = { ...boundary, ...changes } as Record<string, unknown>; delete value.canonical_sha256;
  return { ...value, canonical_sha256: sha256(canonicalJson(value as never)) } as OperationalBoundaryV1;
}

describe("WP3 CATFOOD corrective adversarial plan", () => {
  test("T01 unsigned, wrong-key, modified scope, and substituted key reject", () => { const r = rig(); try {
    expect(() => verifyHumanGo(canonicalJson({}), r.spec, r.trust, r.clock.sample().wall_time)).toThrow();
    const other = generateKeyPairSync("ed25519"); expect(() => verifyHumanGo(signGo(r.payload, other.privateKey), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("GO_SIGNATURE_INVALID");
    expect(() => verifyHumanGo(signGo({ ...r.payload, account_id: "acct_other" }, r.privateKey), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("GO_SCOPE_MISMATCH");
    const injected = JSON.parse(r.artifact); injected.public_key = other.publicKey.export({ type: "spki", format: "pem" }).toString(); expect(() => verifyHumanGo(canonicalJson(injected), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("fields do not match");
    expect(() => verifyHumanGo(canonicalJson({ ...JSON.parse(r.artifact), algorithm: "Ed25519ph" }), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("ALGORITHM_SUBSTITUTION");
    expect(() => verifyHumanGo(signGo({ ...r.payload, valid_from: "2026-10-01" }, r.privateKey), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("valid_from");
    expect(() => verifyHumanGo(signGo({ ...r.payload, invented_security_field: true }, r.privateKey), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("fields do not match");
    const canonicalPayload = canonicalJson(r.payload); const duplicatePayload = canonicalPayload.replace(`"account_id":"${r.payload.account_id}"`, `"account_id":"${r.payload.account_id}","account_id":"${r.payload.account_id}"`); const duplicateBytes = Buffer.from(duplicatePayload); expect(() => verifyHumanGo(canonicalJson({ algorithm: "Ed25519", key_id: "go:test", payload: duplicateBytes.toString("base64url"), signature: sign(null, duplicateBytes, r.privateKey).toString("base64url") }), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("GO payload");
  } finally { r.close(); } });

  test("T02 expired, revoked, reused, and wrong-environment GO reject", () => { const r = rig(); try {
    expect(() => verifyHumanGo(signGo({ ...r.payload, valid_until: new Date(r.clock.wallMs).toISOString() }, r.privateKey), r.spec, r.trust, r.clock.sample().wall_time)).toThrow("GO_NOT_CURRENT");
    r.custodian.createRun(r.spec, r.artifact); expect(() => r.custodian.createRun(r.spec, r.artifact)).toThrow(); r.custodian.revokeGo(r.spec.run_id, "operator-revoke");
    expect(() => r.custodian.issueOwnerSession(r.spec.run_id)).toThrow("RUN_FINALIZED");
    const wrong = { ...r.spec, environment_type: "staging" } as CatfoodRunSpec; expect(() => verifyHumanGo(r.artifact, wrong, r.trust, r.clock.sample().wall_time)).toThrow();
  } finally { r.close(); } });

  test("T03 timestamp mutation with attacker-recomputed hashes is FAIL against checkpoints", () => { const r = rig(); try {
    positive(r); r.custodian.close(); const db = new Database(r.control); db.exec("DROP TRIGGER catfood_journal_no_update"); const rows = db.query<Record<string, unknown>, []>("SELECT * FROM catfood_source_journal ORDER BY sequence").all(); let previous = "GENESIS";
    for (const [index, row] of rows.entries()) { const base = journalBase({ ...row, observed_at: index === 0 ? "2026-09-29T00:00:00.000Z" : row.observed_at }, previous); const hash = sha256(canonicalJson(base as never)); db.query("UPDATE catfood_source_journal SET observed_at=?,previous_row_hash=?,row_hash=? WHERE run_id=? AND sequence=?").run(base.observed_at, previous, hash, row.run_id, row.sequence); previous = hash; } db.exec("CREATE TRIGGER catfood_journal_no_update BEFORE UPDATE ON catfood_source_journal BEGIN SELECT RAISE(ABORT,'source journal is append-only'); END"); db.close();
    const evaluator = new IndependentCatfoodEvaluator(r.control, r.checkpoint, r.source); expect(evaluator.evaluate(r.spec.run_id).verdict).toBe("FAIL"); evaluator.close();
  } finally { Bun.gc(true); try { rmSync(r.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "EBUSY") throw error; } } });

  test("T05-T06 SQL replacement, trigger removal, and recursive-trigger downgrade prevent PASS", async () => { const r = rig(); try {
    start(r); r.custodian.close(); const db = new Database(r.control, { strict: true, create: false });
    expect(() => db.exec("UPDATE catfood_source_journal SET observed_at='2099-01-01T00:00:00.000Z'")).toThrow();
    expect(() => db.exec("DELETE FROM catfood_source_journal")).toThrow();
    db.exec("PRAGMA recursive_triggers=OFF");
    expect(() => db.exec("INSERT OR REPLACE INTO catfood_source_journal SELECT * FROM catfood_source_journal LIMIT 1")).toThrow();
    db.exec("DROP TRIGGER catfood_journal_no_update"); db.close();
    let reopened: ProtectedCatfoodCustodian | undefined; let failure: unknown;
    try { reopened = new ProtectedCatfoodCustodian(r.control, r.checkpoint, r.source, r.clock); } catch (error) { failure = error; } finally { reopened?.close(); }
    expect(failure).toBeDefined();
  } finally { Bun.gc(true); await Bun.sleep(50); try { rmSync(r.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "EBUSY") throw error; } } });

  test("T04 tail truncation is detected against external high-water checkpoint", () => { const r = rig(); try {
    start(r); r.custodian.close(); const db = new Database(r.control); db.exec("DROP TRIGGER catfood_journal_no_delete"); db.exec("DELETE FROM catfood_source_journal WHERE sequence=(SELECT MAX(sequence) FROM catfood_source_journal)"); db.exec("CREATE TRIGGER catfood_journal_no_delete BEFORE DELETE ON catfood_source_journal BEGIN SELECT RAISE(ABORT,'source journal is append-only'); END"); db.close();
    const evaluator = new IndependentCatfoodEvaluator(r.control, r.checkpoint, r.source); expect(evaluator.evaluate(r.spec.run_id).verdict).toBe("FAIL"); evaluator.close();
  } finally { rmSync(r.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } });

  test("T07 checkpoint failure latches UNANCHORED and blocks positive work", () => { const r = rig(); try {
    r.custodian.createRun(r.spec, r.artifact); r.custodian.close(); const db = new Database(r.checkpoint); db.exec("CREATE TRIGGER checkpoint_fail BEFORE INSERT ON catfood_checkpoints BEGIN SELECT RAISE(ABORT,'simulated crash'); END"); db.close();
    const c = new ProtectedCatfoodCustodian(r.control, r.checkpoint, r.source, r.clock); try { let code = ""; try { c.issueOwnerSession(r.spec.run_id); } catch (error) { code = String((error as { code?: string }).code); } expect(code).toBe("EVIDENCE_UNANCHORED"); expect(c.evaluate(r.spec.run_id).verdict).not.toBe("PASS"); } finally { c.close(); }
  } finally { rmSync(r.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } });

  test("T08 runner has no signing API and path/key substitution fails", () => { const r = rig(); try {
    expect("signGo" in r.custodian).toBe(false); expect("attest" in r.custodian).toBe(false);
    const badTrust = { ...r.trust, go_keys: [{ ...r.trust.go_keys[0], public_key_pem: "file:///tmp/key" }] }; expect(() => initializeProtectedCatfoodStores(join(r.dir, "x"), join(r.dir, "y"), badTrust, r.clock.sample().wall_time)).toThrow();
  } finally { r.close(); } });

  test("T09 cached PASS tampering and cross-run attestation reuse reject", () => { const r = rig(); try {
    const { result } = positive(r); expect(result.verdict).toBe("PASS");
    const evaluator = new IndependentCatfoodEvaluator(r.control, r.checkpoint, r.source); expect(evaluator.evaluate(r.spec.run_id).verdict).toBe("PASS"); evaluator.close();
    const signing = generateKeyPairSync("ed25519"), store = join(r.dir, "attest.db"); writeFileSync(store, ""); const publicPem = signing.publicKey.export({ type: "spki", format: "pem" }).toString(); initializeIndependentAttestationStore(store, { writer_identity: "attestor:test", signing_key_id: "attest:test", signing_public_key_pem: publicPem });
    expect(() => new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, store, r.source, signing.privateKey.export({ type: "pkcs8", format: "pem" }).toString())).toThrow("ATTESTATION_ENROLLMENT_REQUIRED");
    expect(() => verifyIndependentAttestation("{}", "x", publicPem, { run_id: r.spec.run_id, bundle_sha256: result.rederived_bundle_sha256 })).toThrow("ATTESTATION_VERSION_UNSUPPORTED");
  } finally { r.close(); } });

  test("corrective05 enrolled TEST_ONLY roles are carried into and independently bind the attestation", () => { const r = rig("run-enrolled-attestation"); try {
    const { result } = positive(r); expect(result.verdict).toBe("PASS");
    const issued = issueTestAttestation(r, "enrolled-attest.db"), artifact = JSON.parse(issued.row.artifact_json), payload = JSON.parse(artifact.payload_json); expect(payload.enrollment).toMatchObject({ accepted_snapshot_id: "snapshot:fixture", enrollment_namespace: "namespace:fixture" }); expect(payload.enrollment.roles.map((role: Record<string, unknown>) => role.role)).toEqual(["source", "custodian", "evaluator", "writer"]); expect(payload.enrollment.roles.every((role: Record<string, unknown>) => (role.launcher_observed_launch as Record<string, unknown>).artifact_root === (role.local_role_descriptor as Record<string, unknown>).artifact_root)).toBe(true);
    expect(verifyIndependentAttestation(issued.row.artifact_json, { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toBe("PASS");
    const other = testEnrollmentFixture("run:other", "b".repeat(64), r.clock.wallMs); expect(() => verifyIndependentAttestation(issued.row.artifact_json, { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: other.contexts.verifier })).toThrow("ATTESTATION_ENROLLMENT_MISMATCH");
  } finally { r.close(); } });

  test("T10-T12 stale owner, lease, epoch, generation, scope, and forged preflight reject", () => { const r = rig(); try {
    const first = start(r); r.custodian.stop(first, "STOP"); r.clock.advance(121_000); expect(() => r.custodian.preflight(first)).toThrow("LEASE_EXPIRED"); const second = r.custodian.issueOwnerSession(r.spec.run_id);
    const originalBoundaries = r.source.boundaries.bind(r.source); r.source.boundaries = ((spec: CatfoodRunSpec) => originalBoundaries(spec).map((boundary) => rehashBoundary(boundary, { account_id: "acct_other" }))) as typeof r.source.boundaries; expect(() => r.custodian.takeover(r.spec.run_id, second)).toThrow("RESTART_THREADS_NOT_FENCED"); r.source.boundaries = originalBoundaries;
    r.custodian.takeover(r.spec.run_id, second);
    expect(() => r.custodian.preflight(first)).toThrow("OWNER_SESSION_INVALID");
    const good = r.custodian.preflight(second); expect(() => r.custodian.activate(second, { ...good, nonce: "forged" })).toThrow("PREFLIGHT_RECEIPT_INVALID");
    r.source.setGeneration("editorial.cycle", 999); expect(() => r.custodian.activate(second, good)).toThrow();
  } finally { r.close(); } });

  test("T13 unknown execution and failed/unknown stop evidence are not safe", () => { const preflightRig = rig(); try { preflightRig.custodian.createRun(preflightRig.spec, preflightRig.artifact); const owner = preflightRig.custodian.issueOwnerSession(preflightRig.spec.run_id); const original = preflightRig.source.boundaries.bind(preflightRig.source); preflightRig.source.boundaries = ((spec: CatfoodRunSpec) => original(spec).map((boundary) => rehashBoundary(boundary, { execution_state: "UNKNOWN" }))) as typeof preflightRig.source.boundaries; expect(() => preflightRig.custodian.preflight(owner)).toThrow("BOUNDARY_UNSAFE"); } finally { preflightRig.close(); }
    for (const acknowledgement of ["FAILED", "UNKNOWN"] as const) { const r = rig(); try { const session = start(r); const original = r.source.revoke.bind(r.source); r.source.revoke = ((...args: Parameters<typeof original>) => { const transition = original(...args); return { ...transition, boundary: rehashBoundary(transition.boundary, { stop_acknowledgement: acknowledgement }) }; }) as typeof r.source.revoke; expect(() => r.custodian.stop(session, "STOP")).toThrow("STOP_UNCONFIRMED"); expect(() => r.custodian.admit(session, "editorial.cycle", "cycle:one")).toThrow(); } finally { r.close(); } } });

  test("corrective boundary identity and active stop controls fail closed", () => {
    for (const mutate of [
      (boundary: OperationalBoundaryV1) => ({ producer_release_identity: { git_sha: "f".repeat(40), artifact_sha256: RELEASE } }),
      (_boundary: OperationalBoundaryV1) => ({ schema_version: 30 }),
      (_boundary: OperationalBoundaryV1) => ({ schema_fingerprint: "f".repeat(64) }),
    ]) { const r = rig(); try { r.custodian.createRun(r.spec, r.artifact); const owner = r.custodian.issueOwnerSession(r.spec.run_id); const original = r.source.boundaries.bind(r.source); r.source.boundaries = ((spec: CatfoodRunSpec) => original(spec).map((boundary) => rehashBoundary(boundary, mutate(boundary)))) as typeof r.source.boundaries; expect(() => r.custodian.preflight(owner)).toThrow("BOUNDARY_IDENTITY_MISMATCH"); } finally { r.close(); } }
    const r = rig(); try { r.custodian.createRun(r.spec, r.artifact); const owner = r.custodian.issueOwnerSession(r.spec.run_id); const receipt = r.custodian.preflight(owner); const original = r.source.grant.bind(r.source); r.source.grant = ((...args: Parameters<typeof original>) => { const transition = original(...args); return { ...transition, boundary: rehashBoundary(transition.boundary, { effective_safety_controls: { global_stop: true, account_stop: false, capability_stop: false, reasons: ["global_stop"] } }) }; }) as typeof r.source.grant; expect(() => r.custodian.activate(owner, receipt)).toThrow("BOUNDARY_ADMISSION_DENIED"); } finally { r.close(); }
  });

  test("T14 blocked, transport failure, precondition/noop never receive meaningful credit", () => { const r = rig(); try { const session = start(r); const ticket = r.custodian.admit(session, "editorial.cycle", "cycle:one"); r.source.complete(ticket.claim_id, { claim_status: "failed", transport_status: "FAILED", domain_result: { state: "NOOP", status: "BLOCKED" } }); r.custodian.reconcile(session, ticket.work_id); r.custodian.stop(session, "STOP"); r.clock.advance(86_400_000); expect(r.custodian.closeRun(session).verdict).not.toBe("PASS"); } finally { r.close(); } });

  test("T15 semantic replay and caller-invented class reject", () => { const r = rig(); try { const session = start(r); work(r, session, "editorial.cycle", "cycle:one"); expect(() => r.custodian.admit(session, "editorial.cycle", "cycle:one")).toThrow("DUPLICATE_SEMANTIC_WORK"); expect(() => r.custodian.admit(session, "invented.class" as never, "cycle:two")).toThrow(); } finally { r.close(); } });

  test("T16 real lock interleaving serializes admission behind a committed stop", async () => { const r = rig(); try {
    const session = start(r); const worker = new Worker(`const { parentPort, workerData }=require('node:worker_threads'); const { Database }=require('bun:sqlite'); const db=new Database(workerData); db.exec('PRAGMA busy_timeout=5000; BEGIN IMMEDIATE'); db.exec("UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='STOP_PENDING',state_version=state_version+1"); parentPort.postMessage('locked'); setTimeout(()=>{db.exec('COMMIT');db.close();parentPort.postMessage('done')},150);`, { eval: true, workerData: r.control });
    await new Promise<void>((resolve) => worker.once("message", () => resolve())); expect(() => r.custodian.admit(session, "editorial.cycle", "cycle:one")).toThrow("ADMISSION_CLOSED"); await new Promise<void>((resolve) => worker.once("exit", () => resolve()));
  } finally { r.close(); }
    for (const reason of ["PAUSE", "ABORT"] as const) { const other = rig(); try { const session = start(other); other.custodian.stop(session, reason); expect(() => other.custodian.admit(session, "editorial.cycle", "cycle:one")).toThrow(); } finally { other.close(); } }
    const expired = rig(); try { const session = start(expired); expired.clock.advance(90_000_001); expect(() => expired.custodian.admit(session, "editorial.cycle", "cycle:one")).toThrow(); } finally { expired.close(); }
  });

  test("T17 real barrier interleaving rejects a delayed stale Threads generation", async () => { const r = rig(); try {
    const session = start(r); const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 2); const state = new Int32Array(shared); Atomics.store(state, 1, r.source.generation("editorial.cycle")!); r.source.claimBarrier = state;
    const worker = new Worker(`const { parentPort, workerData }=require('node:worker_threads'); const s=new Int32Array(workerData); Atomics.wait(s,0,0); Atomics.store(s,1,999); Atomics.store(s,0,2); Atomics.notify(s,0); parentPort.postMessage('fenced');`, { eval: true, workerData: shared });
    expect(() => r.custodian.admit(session, "editorial.cycle", "cycle:one")).toThrow("THREADS_FENCE_REJECTED"); await new Promise<void>((resolve) => worker.once("exit", () => resolve()));
  } finally { r.close(); } });

  test("T18 expired GO still permits safety stop and reconcile", () => { const r = rig(); try { const session = start(r); const ticket = r.custodian.admit(session, "editorial.cycle", "cycle:one"); r.source.complete(ticket.claim_id); r.clock.advance(90_000_001); expect(() => r.custodian.reconcile(session, ticket.work_id)).not.toThrow(); expect(() => r.custodian.stop(session, "EXPIRY")).not.toThrow(); } finally { r.close(); } });

  test("corrective04 ABORT is sticky, repeated stop is idempotent, and safe closure remains FAIL", () => { const r = rig("run-sticky-abort"); try {
    const session = start(r); r.custodian.stop(session, "ABORT"); expect(() => r.custodian.stop(session, "STOP")).not.toThrow();
    r.clock.advance(121_000); expect(() => r.custodian.issueOwnerSession(r.spec.run_id)).toThrow("RUN_FINALIZED"); expect(() => r.custodian.preflight(session)).toThrow("RUN_FINALIZED");
    r.clock.advance(86_400_000); const result = r.custodian.closeRun(session); expect(result.verdict).toBe("FAIL"); expect(result.reason_codes).toContain("RUN_ABORTED");
    expect(() => r.custodian.stop(session, "STOP")).toThrow("RUN_CLOSED");
  } finally { r.close(); } });

  test("owner lease repair T1/T12 renews only a live owner without changing epoch or producer generation", () => { const r = rig("run-short-renewal"); try {
    const session = start(r); const before = CATFOOD_CAPABILITIES.map((capability) => r.source.generation(capability)); const db = new Database(r.control); const initial = db.query<Record<string, unknown>, []>("SELECT current_epoch,lease_expires_at FROM catfood_runs").get()!; db.close(); r.clock.advance(60_000);
    r.custodian.renewOwnerSession(session); r.custodian.renewAuthorities(session);
    expect(CATFOOD_CAPABILITIES.map((capability) => r.source.generation(capability))).toEqual(before);
    r.clock.advance(61_000); expect(() => r.custodian.admit(session, "editorial.cycle", "cycle:one")).not.toThrow();
    const renewedDb = new Database(r.control); const renewed = renewedDb.query<Record<string, unknown>, []>("SELECT current_epoch,lease_expires_at FROM catfood_runs").get()!; const expiries = renewedDb.query<{ permit_expires_at: string }, []>("SELECT permit_expires_at FROM catfood_authority_bindings").all(); renewedDb.close();
    expect(renewed.current_epoch).toBe(initial.current_epoch); expect(Date.parse(String(renewed.lease_expires_at))).toBeGreaterThan(Date.parse(String(initial.lease_expires_at)));
    expect(expiries.every((row) => Date.parse(row.permit_expires_at) - (r.clock.wallMs - 61_000) <= 120_000)).toBe(true);
  } finally { r.close(); } });

  test("owner lease repair T2-T5/T9 rejects boundary-expired and stale owners without mutation", () => {
    for (const delta of [120_000, 120_001]) { const r = rig(`run-expired-${delta}`); try {
      const session = start(r); const db = new Database(r.control); const before = db.query<Record<string, unknown>, []>("SELECT owner_session_id,current_epoch,lease_expires_at,state_version FROM catfood_runs").get()!; const events = db.query<{ n: number }, []>("SELECT COUNT(*) n FROM catfood_source_journal").get()!.n; db.close();
      r.clock.advance(delta); expect(() => r.custodian.renewOwnerSession(session)).toThrow("LEASE_EXPIRED");
      const afterDb = new Database(r.control); expect(afterDb.query<Record<string, unknown>, []>("SELECT owner_session_id,current_epoch,lease_expires_at,state_version FROM catfood_runs").get()).toEqual(before); expect(afterDb.query<{ n: number }, []>("SELECT COUNT(*) n FROM catfood_source_journal").get()!.n).toBe(events); afterDb.close();
    } finally { r.close(); } }
    const stale = rig("run-stale-owner-renewal"); try {
      const first = start(stale); stale.custodian.stop(first, "STOP"); stale.clock.advance(121_000); const second = stale.custodian.issueOwnerSession(stale.spec.run_id); stale.custodian.takeover(stale.spec.run_id, second);
      const db = new Database(stale.control); const before = db.query<Record<string, unknown>, []>("SELECT owner_session_id,current_epoch,lease_expires_at,state_version FROM catfood_runs").get()!; db.close(); expect(() => stale.custodian.renewOwnerSession(first)).toThrow("OWNER_SESSION_INVALID");
      const afterDb = new Database(stale.control); expect(afterDb.query<Record<string, unknown>, []>("SELECT owner_session_id,current_epoch,lease_expires_at,state_version FROM catfood_runs").get()).toEqual(before); afterDb.close();
    } finally { stale.close(); }
  });

  test("owner lease repair T6-T8 serializes renewal behind expiry, takeover, and stop fences", async () => {
    for (const race of ["expiry", "takeover", "stop"] as const) { const r = rig(`run-renewal-race-${race}`); try {
      const session = start(r); const now = r.clock.sample().wall_time;
      const worker = new Worker(`const {parentPort,workerData}=require('node:worker_threads');const {Database}=require('bun:sqlite');const db=new Database(workerData.path);db.exec('PRAGMA busy_timeout=5000; BEGIN IMMEDIATE');if(workerData.race==='expiry')db.query('UPDATE catfood_runs SET lease_expires_at=?').run(workerData.now);if(workerData.race==='takeover')db.query(\"UPDATE catfood_runs SET owner_session_id='ses:replacement',current_epoch=current_epoch+1,lease_expires_at=?,lifecycle='READY',admission_state='CLOSED'\").run(new Date(Date.parse(workerData.now)+120000).toISOString());if(workerData.race==='stop')db.exec(\"UPDATE catfood_runs SET admission_state='CLOSED',lifecycle='STOP_PENDING'\");parentPort.postMessage('locked');setTimeout(()=>{db.exec('COMMIT');db.close();parentPort.postMessage('done')},150);`, { eval: true, workerData: { path: r.control, race, now } });
      await new Promise<void>((resolve) => worker.once("message", () => resolve())); const exited = new Promise<void>((resolve) => worker.once("exit", () => resolve()));
      expect(() => r.custodian.renewOwnerSession(session)).toThrow(race === "takeover" ? "OWNER_SESSION_INVALID" : race === "stop" ? "OWNER_MAINTENANCE_NOT_ALLOWED" : "LEASE_EXPIRED"); await exited;
      const db = new Database(r.control); const row = db.query<Record<string, unknown>, []>("SELECT owner_session_id,current_epoch,lease_expires_at,lifecycle FROM catfood_runs").get()!; db.close();
      if (race === "expiry") expect(row.lease_expires_at).toBe(now); if (race === "takeover") expect(row).toMatchObject({ owner_session_id: "ses:replacement", current_epoch: 2 }); if (race === "stop") expect(row.lifecycle).toBe("STOP_PENDING");
    } finally { r.close(); } }
  });

  test("owner lease repair T10 safety-only reconciliation and stop remain available after expiry", () => { const r = rig("run-expired-safety"); try {
    const session = start(r); const ticket = r.custodian.admit(session, "editorial.cycle", "cycle:one"); r.source.complete(ticket.claim_id); r.clock.advance(121_000);
    expect(() => r.custodian.reconcile(session, ticket.work_id)).not.toThrow(); expect(() => r.custodian.stop(session, "EXPIRY")).not.toThrow();
  } finally { r.close(); } });

  test("owner lease repair T11 Threads permit renewal cannot resurrect expired IKORABU ownership", () => { const r = rig("run-expired-permit-renewal"); try {
    const session = start(r); const db = new Database(r.control); const before = db.query<Record<string, unknown>, []>("SELECT owner_session_id,current_epoch,lease_expires_at,state_version FROM catfood_runs").get()!; const permits = db.query<Record<string, unknown>, []>("SELECT capability,permit_expires_at FROM catfood_authority_bindings ORDER BY capability").all(); db.close(); r.clock.advance(120_000);
    expect(() => r.custodian.renewAuthorities(session)).toThrow("LEASE_EXPIRED"); const afterDb = new Database(r.control); expect(afterDb.query<Record<string, unknown>, []>("SELECT owner_session_id,current_epoch,lease_expires_at,state_version FROM catfood_runs").get()).toEqual(before); expect(afterDb.query<Record<string, unknown>, []>("SELECT capability,permit_expires_at FROM catfood_authority_bindings ORDER BY capability").all()).toEqual(permits); afterDb.close();
  } finally { r.close(); } });

  test("corrective03 paid and writer gates apply before grant and admission", () => { const r = rig("run-paid-gate"); try {
    r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.armObservation(session, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" });
    r.source.runtime = { ...r.source.runtime, writer_enabled: true }; expect(() => r.custodian.preflight(session)).toThrow("PAID_PATH_NOT_DISABLED");
  } finally { r.close(); } });

  test("corrective03 late reconciliation retains terminal evidence before denying acceptance credit", () => { const r = rig("run-late-reconcile"); try {
    const session = start(r); const ticket = r.custodian.admit(session, "editorial.cycle", "cycle:one"); r.clock.advance(86_400_000); r.source.complete(ticket.claim_id);
    expect(() => r.custodian.reconcile(session, ticket.work_id)).not.toThrow(); r.custodian.stop(session, "STOP"); const result = r.custodian.closeRun(session);
    expect(result.reason_codes).toContain("WORK_COMPLETED_OUTSIDE_WINDOW"); const db = new Database(r.control); expect(db.query<{ status: string }, [string]>("SELECT status FROM catfood_work_admissions WHERE work_id=?").get(ticket.work_id)?.status).toBe("TERMINAL"); db.close();
  } finally { r.close(); } });

  test("T19 fixed policy cannot be weakened by run spec", () => { expect(CATFOOD_FIXED_POLICY.continuous_duration_seconds).toBe(86_400); expect(CATFOOD_FIXED_POLICY.minimum_meaningful_units).toBe(3); expect(CATFOOD_FIXED_POLICY.minimum_capability_classes).toBe(2); expect(() => createCatfoodRunSpec({ duration: 1 } as never)).toThrow(); });

  test("T20 future/fake duration, boot change, and incomplete coverage never PASS", () => { const r = rig(); try { positive(r); expect(r.custodian.evaluate(r.spec.run_id).verdict).toBe("PASS"); const db = new Database(r.control); db.query("UPDATE catfood_runs SET closed_monotonic_ms=start_monotonic_ms+121000").run(); db.close(); expect(r.custodian.evaluate(r.spec.run_id).reason_codes).toContain("DURATION_CLOCK_INCONSISTENT"); } finally { r.close(); }
    const boot = rig(); try { positive(boot); const db = new Database(boot.control); db.query("UPDATE catfood_runs SET closed_boot_id='boot-forged'").run(); db.close(); expect(boot.custodian.evaluate(boot.spec.run_id).verdict).not.toBe("PASS"); } finally { boot.close(); } });

  test("T21-T22 open authority, unresolved work, missing cost coverage, and provider activity never PASS", () => { const r = rig(); try { const session = start(r); const ticket = r.custodian.admit(session, "editorial.cycle", "cycle:one"); expect(r.custodian.evaluate(r.spec.run_id).verdict).not.toBe("PASS"); r.source.complete(ticket.claim_id, { provider_invoked: true }); r.custodian.reconcile(session, ticket.work_id); r.source.runtime = { ...r.source.runtime, cost_coverage: "UNKNOWN", provider_activity_count: 1 }; expect(r.custodian.evaluate(r.spec.run_id).verdict).not.toBe("PASS"); } finally { r.close(); }
    const closed = rig(); try { positive(closed); closed.source.grant(closed.spec, "editorial.cycle", "unrelated-later-runtime", closed.source.generation("editorial.cycle")); expect(closed.custodian.evaluate(closed.spec.run_id).verdict).toBe("PASS"); } finally { closed.close(); } });

  test("T23 complete accelerated 24h policy fixture is TEST_ONLY PASS", () => { const r = rig(); try { const { result } = positive(r); expect(result).toMatchObject({ verdict: "PASS", test_only: true, policy_sha256: CATFOOD_POLICY_SHA256 }); } finally { r.close(); } });

  test("T24 breaking exactly the three-unit minimum never PASS", () => { const r = rig(); try { const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); r.custodian.stop(first, "STOP"); r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt); work(r, second, "editorial.outcome_evaluation", "outcome:one"); r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); const result = r.custodian.closeRun(second); expect(result.verdict).not.toBe("PASS"); expect(result.reason_codes).toEqual(["MEANINGFUL_WORK_COUNT_NOT_MET"]); } finally { r.close(); } });

  test("corrective05 two genuine outcomes plus a first-seen historical reread cannot satisfy semantic credit", () => { const r = rig("run-two-outcomes"); try {
    const first = start(r); const a = r.custodian.admit(first, "editorial.cycle", "cycle:one"); r.source.complete(a.claim_id); r.custodian.reconcile(first, a.work_id); r.custodian.stop(first, "STOP");
    r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt);
    const b = r.custodian.admit(second, "editorial.cycle", "cycle:two"); r.source.complete(b.claim_id, { domain_result: producerEditorialResult(`cycle:${b.claim_id}`, r.spec.account_id, "article:two", "2026-09-29T10:00:00.000Z", "2026-09-29T11:00:00.000Z") }); r.custodian.reconcile(second, b.work_id); work(r, second, "threads.publish.dry_run", "dry:one");
    r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); const result = r.custodian.closeRun(second);
    expect(result.verdict).toBe("FAIL"); expect(result.reason_codes).toContain("MEANINGFUL_WORK_COUNT_NOT_MET");
  } finally { r.close(); } });

  test("corrective04 three distinct producer outcomes still satisfy the TEST_ONLY minimum", () => { const r = rig("run-three-outcomes"); try {
    const { result } = positive(r); expect(result).toMatchObject({ verdict: "PASS", test_only: true });
  } finally { r.close(); } });

  test("corrective04 TEST_ONLY ancestry cannot be relabelled by the pure-kernel argument", () => { const r = rig("run-taint"); try {
    positive(r); const bundle = r.custodian.rederive(r.spec.run_id); expect(evaluateCatfoodAcceptance(bundle)).toMatchObject({ test_only: true });
  } finally { r.close(); } });

  test("accepted COE contract with PARTIAL operational evidence fails precisely", () => { const r = rig("run-partial-coe"); try { r.source.coeTransform = (page) => { (page.coverage as Record<string, unknown>).state = "PARTIAL"; return page; }; r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); expect(() => r.custodian.preflight(session)).toThrow("COE_COVERAGE_PARTIAL"); } finally { r.close(); } });

  test("accepted runtime evidence does not replace the active known-foreign tenant probe", () => { const r = rig("run-tenant-probe"); try { const original = r.source.tenantProbe.bind(r.source); r.source.tenantProbe = ((spec: CatfoodRunSpec) => ({ ...original(spec), foreign_status: 404 as 403 })) as typeof r.source.tenantProbe; r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); expect(() => r.custodian.preflight(session)).toThrow("ACTIVE_NEGATIVE_TENANT_PROBE_REQUIRED"); } finally { r.close(); } });

  test("fresh COE observation IDs do not make an unchanged preflight receipt stale", () => { const r = rig("run-coe-clock-noise"); try { let serial = 0; r.source.coeTransform = (page) => { (page.operational_observation as Record<string, unknown>).observation_id = (++serial).toString(16).padStart(64, "0"); return page; }; expect(() => start(r)).not.toThrow(); } finally { r.close(); } });

  test("corrective CLOSED_RUN is stable across report time and performs no live source reads", () => { const r = rig("run-closed-stable"); try {
    positive(r); const first = r.custodian.evaluate(r.spec.run_id); const fail = () => { throw new Error("LIVE_SOURCE_CALLED"); };
    r.source.operationalEvidence = fail as typeof r.source.operationalEvidence; r.source.boundaries = fail as typeof r.source.boundaries; r.source.runtimeEvidence = fail as typeof r.source.runtimeEvidence; r.source.inventory = fail as typeof r.source.inventory; r.source.readClaim = fail as typeof r.source.readClaim; r.source.tenantProbe = fail as typeof r.source.tenantProbe;
    for (const ms of [5_000, 300_000, 86_400_000]) { r.clock.advance(ms); const next = r.custodian.evaluate(r.spec.run_id); expect(next.verdict).toBe("PASS"); expect(next.rederived_bundle_sha256).toBe(first.rederived_bundle_sha256); }
    const independent = new IndependentCatfoodEvaluator(r.control, r.checkpoint, r.source); expect(independent.evaluate(r.spec.run_id).rederived_bundle_sha256).toBe(first.rederived_bundle_sha256); independent.close();
  } finally { r.close(); } });

  test("corrective governed failure is preserved and makes both evaluators FAIL", () => { const r = rig("run-governed-failure"); try {
    const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); r.custodian.stop(first, "STOP");
    r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt); work(r, second, "editorial.outcome_evaluation", "outcome:one"); work(r, second, "threads.publish.dry_run", "dry:one"); const failed = r.custodian.admit(second, "editorial.cycle", "cycle:two"); r.source.complete(failed.claim_id, { claim_status: "failed", transport_status: "FAILED", domain_result: { state: "NOOP", status: "FAILED" } }); r.custodian.reconcile(second, failed.work_id); r.clock.advance(86_400_000); r.custodian.stop(second, "STOP");
    expect(r.custodian.closeRun(second).verdict).toBe("FAIL"); const independent = new IndependentCatfoodEvaluator(r.control, r.checkpoint, r.source); expect(independent.evaluate(r.spec.run_id).verdict).toBe("FAIL"); independent.close();
  } finally { r.close(); } });

  test("corrective open run has no closed archive and cannot be evaluated as PASS", () => { const r = rig("run-unsealed"); try { start(r); expect(r.custodian.evaluate(r.spec.run_id)).toMatchObject({ verdict: "BLOCKED", reason_codes: ["CLOSED_SOURCE_ARCHIVE_MISSING"] }); } finally { r.close(); } });

  test("corrective02 observation arm is non-permitting and active stop records BLOCKED without PREFLIGHT_PASSED", () => { const r = rig("run-arm-stop"); try {
    r.custodian.createRun(r.spec, r.artifact); const owner = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.armObservation(owner, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" });
    const original = r.source.boundaries.bind(r.source); r.source.boundaries = ((spec: CatfoodRunSpec) => original(spec).map((boundary) => rehashBoundary(boundary, { effective_safety_controls: { global_stop: true, account_stop: false, capability_stop: true, reasons: ["global_stop"] } }))) as typeof r.source.boundaries;
    expect(() => r.custodian.preflight(owner)).toThrow("BOUNDARY_STOP_ACTIVE"); const db = new Database(r.control); const types = db.query<{ event_type: string }, []>("SELECT event_type FROM catfood_source_journal ORDER BY sequence").all().map((row) => row.event_type); db.close();
    expect(types).toContain("OBSERVATION_ARMED"); expect(types).toContain("PREPARATION_OBSERVED"); expect(types).toContain("ADMISSION_BLOCKED"); expect(types).not.toContain("PREFLIGHT_PASSED"); expect(r.source.generation("editorial.cycle")).toBeNull();
  } finally { r.close(); } });

  test("corrective02 operational roots/build remain unprovisioned and relabelled fixtures cannot cross the boundary", () => {
    expect(() => openOperationalCatfoodCustodian()).toThrow("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE"); const r = rig("run-relabel"); try { Object.defineProperty(r.source, "mode", { value: "OPERATIONAL" }); expect(() => new ProtectedCatfoodCustodian(r.control, r.checkpoint, r.source, r.clock)).toThrow("THREADS_SOURCE_IDENTITY_MISMATCH"); } finally { r.close(); }
  });

  test("corrective04 operational constructors, Reflect.construct, source factory, verifier, and hydration fail closed", () => {
    expect(() => verifyOperationalIndependentAttestation("{}", "x", { run_id: "run", bundle_sha256: "0".repeat(64) })).toThrow("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE");
    expect(() => OperationalThreadsEvidenceSource.operational({} as never)).toThrow("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE");
    expect(() => Reflect.construct(OperationalThreadsEvidenceSource as unknown as Function, ["OPERATIONAL", {}, {}, () => new Date()])).toThrow("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE");
    const init = rig("run-operational-init"); try {
      expect(() => initializeProtectedCatfoodStores(join(init.dir, "missing-control.db"), join(init.dir, "missing-checkpoint.db"), { ...init.trust, environment_type: "production", source_mode: "OPERATIONAL", go_keys: [{ ...init.trust.go_keys[0]!, trust_class: "OPERATIONAL" }] }, init.clock.sample().wall_time)).toThrow("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE");
    } finally { init.close(); }
    const hydrated = rig("run-operational-hydration"); try {
      hydrated.custodian.close(); const db = new Database(hydrated.control); db.exec("DROP TRIGGER catfood_meta_no_update"); const meta = db.query<{ trust_config_json: string }, []>("SELECT trust_config_json FROM catfood_trust_meta WHERE singleton=1").get()!; const trust = { ...JSON.parse(meta.trust_config_json), environment_type: "production", source_mode: "OPERATIONAL", go_keys: [{ ...hydrated.trust.go_keys[0], trust_class: "OPERATIONAL" }] }; const raw = canonicalJson(trust); db.query("UPDATE catfood_trust_meta SET trust_config_json=?,trust_config_sha256=? WHERE singleton=1").run(raw, sha256(raw)); db.exec("CREATE TRIGGER catfood_meta_no_update BEFORE UPDATE ON catfood_trust_meta BEGIN SELECT RAISE(ABORT,'trust metadata is immutable'); END"); db.close();
      expect(() => new ProtectedCatfoodCustodian(hydrated.control, hydrated.checkpoint, hydrated.source, hydrated.clock)).toThrow("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE");
      expect(() => Reflect.construct(ProtectedCatfoodCustodian, [hydrated.control, hydrated.checkpoint, hydrated.source, hydrated.clock])).toThrow("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE");
      expect(() => new IndependentCatfoodEvaluator(hydrated.control, hydrated.checkpoint, hydrated.source)).toThrow("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE");
    } finally { try { hydrated.custodian.close(); } catch {} rmSync(hydrated.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); }
  });

  test("RFC 8032 Ed25519 vector verifies with the established crypto implementation", () => {
    const seed = Buffer.from("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60", "hex");
    const publicBytes = Buffer.from("d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a", "hex");
    const signature = Buffer.from("e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b", "hex");
    const privateKey = createPrivateKey({ key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]), format: "der", type: "pkcs8" });
    expect(sign(null, Buffer.alloc(0), privateKey).equals(signature)).toBe(true);
    expect(verify(null, Buffer.alloc(0), { key: Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), publicBytes]), format: "der", type: "spki" }, signature)).toBe(true);
  });
});

describe("WP3 Corrective07 holistic boundary closure", () => {
  const events = (control: string) => { const db = new Database(control, { readonly: true }); try { return db.query<{ event_type: string; payload_json: string }, []>("SELECT event_type,payload_json FROM catfood_source_journal ORDER BY sequence").all(); } finally { db.close(); } };

  test("T06-T09 remote success survives GO loss, siblings stop, and safety revoke fences it", () => { const r = rig("run-c07-post-grant"); try {
    r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.armObservation(session, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" }); const receipt = r.custodian.preflight(session);
    const grant = r.source.grant.bind(r.source); let calls = 0; r.source.grant = ((...args: Parameters<typeof grant>) => { const transition = grant(...args); if (++calls === 1) r.custodian.revokeGo(r.spec.run_id, "post-dispatch"); return transition; }) as typeof r.source.grant;
    expect(() => r.custodian.activate(session, receipt)).toThrow(); const beforeStop = events(r.control); expect(beforeStop.filter((event) => event.event_type === "THREADS_AUTHORITY_REMOTE_FACT")).toHaveLength(1); expect(beforeStop.filter((event) => event.event_type === "THREADS_AUTHORITY_NOT_DISPATCHED")).toHaveLength(2);
    const db = new Database(r.control, { readonly: true }); expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM catfood_authority_bindings").get()!.n).toBe(0); db.close(); expect(() => r.custodian.stop(session, "ABORT")).not.toThrow(); expect(events(r.control).some((event) => event.event_type === "THREADS_AUTHORITY_REVOKE_REMOTE_FACT")).toBe(true);
  } finally { r.close(); } });

  test("T07-T09 ambiguous applied effects reconcile; unknown missing effects remain STOP_UNCONFIRMED", () => {
    const applied = rig("run-c07-ambiguous-applied"); try { applied.custodian.createRun(applied.spec, applied.artifact); const session = applied.custodian.issueOwnerSession(applied.spec.run_id); applied.custodian.armObservation(session, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" }); const receipt = applied.custodian.preflight(session); const grant = applied.source.grant.bind(applied.source); let first = true; applied.source.grant = ((...args: Parameters<typeof grant>) => { const value = grant(...args); if (first) { first = false; throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS"); } return value; }) as typeof applied.source.grant; expect(() => applied.custodian.activate(session, receipt)).toThrow("MUTATION_OUTCOME_AMBIGUOUS"); expect(() => applied.custodian.stop(session, "STOP")).not.toThrow(); } finally { applied.close(); }
    const missing = rig("run-c07-ambiguous-missing"); try { missing.custodian.createRun(missing.spec, missing.artifact); const session = missing.custodian.issueOwnerSession(missing.spec.run_id); missing.custodian.armObservation(session, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" }); const receipt = missing.custodian.preflight(session); missing.source.grant = (() => { throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS"); }) as typeof missing.source.grant; expect(() => missing.custodian.activate(session, receipt)).toThrow("MUTATION_OUTCOME_AMBIGUOUS"); expect(() => missing.custodian.stop(session, "STOP")).toThrow("STOP_UNCONFIRMED"); } finally { missing.close(); }
  });

  test("T08 partial batch retains every released effect and never dispatches after invalidation", () => { const r = rig("run-c07-partial-batch"); try {
    r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.armObservation(session, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" }); const receipt = r.custodian.preflight(session); const grant = r.source.grant.bind(r.source); let calls = 0; r.source.grant = ((...args: Parameters<typeof grant>) => { const value = grant(...args); calls++; if (calls === 2) throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS"); return value; }) as typeof r.source.grant;
    expect(() => r.custodian.activate(session, receipt)).toThrow("MUTATION_OUTCOME_AMBIGUOUS"); expect(calls).toBe(2); const journal = events(r.control); expect(journal.filter((event) => event.event_type === "THREADS_AUTHORITY_REMOTE_FACT")).toHaveLength(1); expect(journal.filter((event) => event.event_type === "THREADS_AUTHORITY_POSSIBLY_APPLIED")).toHaveLength(1); expect(journal.filter((event) => event.event_type === "THREADS_AUTHORITY_NOT_DISPATCHED")).toHaveLength(1); expect(() => r.custodian.stop(session, "STOP")).not.toThrow();
  } finally { r.close(); } });

  test("T14-T18 COE test ancestry remains permanent through evaluation and signed attestation", () => { const r = rig("run-c07-provenance"); try {
    const { result } = positive(r); expect(result).toMatchObject({ verdict: "PASS", test_only: true }); const issued = issueTestAttestation(r, "c07-attest.db"), artifact = JSON.parse(issued.row.artifact_json), payload = JSON.parse(artifact.payload_json), names = payload.enrollment.provenance.nodes.map((node: Record<string, unknown>) => node.name); expect(names).toContain("writer"); expect(names).toContain("acquisition"); expect(payload.enrollment.provenance.nodes.find((node: Record<string, unknown>) => node.name === "acquisition").trust_domain).toBe("TEST_ONLY"); expect(verifyIndependentAttestation(issued.row.artifact_json, { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toBe("PASS");
  } finally { r.close(); } });

  test("T19-T24 prior time, lifecycle, semantic, journal and closed-source regressions remain stable", () => { const r = rig("run-c07-stability"); try { const { result } = positive(r); const bundle = r.custodian.rederive(r.spec.run_id); expect(result.verdict).toBe("PASS"); for (const delta of [5_000, 300_000, 86_400_000]) { r.clock.advance(delta); expect(evaluateCatfoodAcceptance(bundle)).toEqual(evaluateCatfoodAcceptance(bundle)); } expect(result.test_only).toBe(true); } finally { r.close(); } });
});

describe("WP3 Corrective08 safe remote effects and accepting verification", () => {
  test("T01-T08 a later released epoch remains request-specific and closes only after an exact producer fence", () => { const r = rig("run-c08-request-obligation"); try {
    const first = start(r); r.custodian.stop(first, "STOP"); r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second);
    const grant = r.source.grant.bind(r.source); let firstGrant = true; r.source.grant = ((...args: Parameters<typeof grant>) => { const result = grant(...args); if (firstGrant) { firstGrant = false; throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS"); } return result; }) as typeof r.source.grant;
    expect(() => r.custodian.activate(second, receipt)).toThrow("MUTATION_OUTCOME_AMBIGUOUS"); expect(() => r.custodian.stop(second, "STOP")).not.toThrow();
    const db = new Database(r.control, { readonly: true }); const events = db.query<{ event_type: string; wp3_epoch: number; request_id: string | null; payload_json: string }, []>("SELECT event_type,wp3_epoch,request_id,payload_json FROM catfood_source_journal ORDER BY sequence").all(); db.close();
    const ambiguous = events.find((event) => event.event_type === "THREADS_AUTHORITY_POSSIBLY_APPLIED" && event.wp3_epoch === 2)!; const safe = JSON.parse([...events].reverse().find((event) => event.event_type === "SAFE_QUIESCENCE")!.payload_json);
    expect(JSON.parse(ambiguous.payload_json)).toMatchObject({ operation: "grant", expected_generation: 2 }); expect(safe.proof_request_ids).toContain(ambiguous.request_id); expect(events.some((event) => event.event_type === "THREADS_AUTHORITY_REVOKE_REMOTE_FACT" && event.wp3_epoch === 2)).toBe(true);
  } finally { r.close(); } });

  test("T01,T04,T07 zero bindings and an unfenced released grant never become vacuously safe", () => { const r = rig("run-c08-no-proof"); try {
    r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.armObservation(session, { kind: "TEST_ONLY_EXPLICIT", cadence_seconds: 30, maximum_gap_seconds: 60, clock_mapping: "SAME_TEST_CLOCK" }); const receipt = r.custodian.preflight(session);
    r.source.grant = (() => { throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS"); }) as typeof r.source.grant; expect(() => r.custodian.activate(session, receipt)).toThrow(); expect(() => r.custodian.stop(session, "STOP")).toThrow("STOP_UNCONFIRMED");
    const db = new Database(r.control, { readonly: true }); expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM catfood_authority_bindings").get()!.n).toBe(0); expect(db.query<{ lifecycle: string }, []>("SELECT lifecycle FROM catfood_runs").get()!.lifecycle).toBe("STOP_UNCONFIRMED"); db.close();
  } finally { r.close(); } });

  test("T09-T12 one mapping preserves both ambiguity aliases, exact requests, terminal resolution, and fail-closed future names", () => {
    const event = (event_type: string, request_id: string, payload: Record<string, unknown> = {}) => ({ event_type, request_id, claim_id: null, payload_json: { request_id, ...payload } });
    const same = normalizeWorkDispatchEvidence([event("WORK_DISPATCH_INTENT", "request:a"), event("WORK_DISPATCH_RELEASED", "request:a"), event("WORK_DISPATCH_AMBIGUOUS", "request:a"), event("WORK_DISPATCH_POSSIBLY_APPLIED", "request:a")]);
    expect(same).toHaveLength(1); expect(same[0]).toMatchObject({ request_id: "request:a", released: true, unresolved: true, terminal: false }); expect(same[0]!.events).toEqual(["WORK_DISPATCH_INTENT", "WORK_DISPATCH_RELEASED", "WORK_DISPATCH_AMBIGUOUS", "WORK_DISPATCH_POSSIBLY_APPLIED"]);
    const resolved = normalizeWorkDispatchEvidence([...same[0]!.events.map((name) => event(name, "request:a")), event("WORK_DISPATCH_REMOTE_FACT", "request:a"), event("WORK_DISPATCH_POSSIBLY_APPLIED", "request:b"), event("WORK_DISPATCH_FUTURE_UNKNOWN", "request:c")]);
    expect(resolved.find((row) => row.request_id === "request:a")!.terminal).toBe(true); expect(resolved.filter((row) => row.unresolved && !row.terminal).map((row) => row.request_id).sort()).toEqual(["request:b", "request:c"]);
    expect(normalizeWorkDispatchEvidence([event("WORK_DISPATCH_RELEASED", "request:d"), event("WORK_DISPATCH_REJECTED", "request:d")])[0]!.terminal).toBe(false);
    expect(normalizeWorkDispatchEvidence([event("WORK_DISPATCH_REJECTED", "request:e", { dispatch_state: "NOT_DISPATCHED" })])[0]!.terminal).toBe(true);
  });

  test("T09,T12 a real post-release lost response blocks both evaluators despite three other successes", () => { const r = rig("run-c08-business-ambiguous"); try {
    const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); const claim = r.source.claim.bind(r.source); r.source.claim = ((...args: Parameters<typeof claim>) => { if (args[1].source_id === "cycle:two") throw new Error("response lost"); return claim(...args); }) as typeof r.source.claim;
    expect(() => r.custodian.admit(first, "editorial.cycle", "cycle:two")).toThrow(); r.source.claim = claim; r.custodian.stop(first, "STOP"); r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt); work(r, second, "editorial.outcome_evaluation", "outcome:one"); work(r, second, "threads.publish.dry_run", "dry:one"); r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); const direct = r.custodian.closeRun(second);
    expect(direct).toMatchObject({ verdict: "BLOCKED" }); expect(direct.reason_codes).toContain("WORK_DISPATCH_OUTCOME_UNRESOLVED"); const independent = new IndependentCatfoodEvaluator(r.control, r.checkpoint, r.source); try { expect(independent.evaluate(r.spec.run_id).reason_codes).toContain("WORK_DISPATCH_OUTCOME_UNRESOLVED"); } finally { independent.close(); }
    const issued = issueTestAttestation(r, "c08-ambiguous-attest.db"); expect(verifyIndependentAttestation(issued.row.artifact_json, { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toBe("BLOCKED");
  } finally { r.close(); } });

  test("T13-T17 original issuer envelopes, exact role catalogue, A/L/M/S binding, and evaluator-writer association are rechecked", () => { const r = rig("run-c08-launch-evidence"); try {
    positive(r); const issued = issueTestAttestation(r, "c08-attest.db"), artifact = JSON.parse(issued.row.artifact_json), original = JSON.parse(artifact.payload_json), writerKey = createPrivateKey(issued.fixture.writer.private_key_pem); expect(original.enrollment.roles.every((role: Record<string, unknown>) => typeof (role.authenticated_enrollment as Record<string, unknown>).envelope_json === "string")).toBe(true); expect(verifyIndependentAttestation(issued.row.artifact_json, { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toBe("PASS");
    const resign = (payload: Record<string, unknown>) => { const forgedArtifact = structuredClone(artifact), text = canonicalJson(payload as never); forgedArtifact.payload_json = text; forgedArtifact.signature_base64url = sign(null, Buffer.from(`IKORABU/WP3/CATFOOD/ATTESTATION/V3\n${text}`), writerKey).toString("base64url"); return canonicalJson(forgedArtifact); };
    const alteredLaunch = structuredClone(original); alteredLaunch.enrollment.roles[0].launcher_observed_launch.actual_main.sha256 = "0".repeat(64); expect(() => verifyIndependentAttestation(resign(alteredLaunch), { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toThrow();
    const duplicateRole = structuredClone(original); duplicateRole.enrollment.roles[0] = structuredClone(duplicateRole.enrollment.roles[3]); expect(() => verifyIndependentAttestation(resign(duplicateRole), { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toThrow("ATTESTATION_ROLE_CATALOG_INVALID");
    const foreignEnvelope = structuredClone(original); const inner = JSON.parse(foreignEnvelope.enrollment.roles[0].authenticated_enrollment.envelope_json); inner.signature = sign(null, Buffer.from("not enrollment authority"), writerKey).toString("base64url"); foreignEnvelope.enrollment.roles[0].authenticated_enrollment.envelope_json = canonicalJson(inner); expect(() => verifyIndependentAttestation(resign(foreignEnvelope), { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toThrow("ENROLLMENT_SIGNATURE_INVALID");
    const substitutedAssessment = structuredClone(original); substitutedAssessment.assessment_id = "action:other"; expect(() => verifyIndependentAttestation(resign(substitutedAssessment), { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toThrow("ATTESTATION_RESULT_RECEIPT_INVALID");
  } finally { r.close(); } });

  test("T18-T21 an actual self-scrubbing BUN_OPTIONS child cannot supply its own clean accepting evidence", () => { const r = rig("run-c08-external-parent"); const attackDir = mkdtempSync(join(tmpdir(), "catfood-c08-parent-")); try {
    positive(r); const issued = issueTestAttestation(r, "c08-parent-attest.db"), fixture = issued.fixture, artifact = JSON.parse(issued.row.artifact_json);
    const preload = join(attackDir, "attack-preload.ts"), main = join(attackDir, "subject.ts"), moduleUrl = JSON.stringify(new URL("../web/lib/catfood-enrollment.ts", import.meta.url).href);
    writeFileSync(preload, `globalThis.__catfoodKnownFail = "PASS"; delete process.env.BUN_OPTIONS;\n`); writeFileSync(main, `import { collectCurrentRuntimeSubject, currentLaunchProfile } from ${moduleUrl}; const binding=${JSON.stringify(fixture.binding)}; process.stdout.write(JSON.stringify({attack:globalThis.__catfoodKnownFail,subject:collectCurrentRuntimeSubject(binding),profile:currentLaunchProfile()}));\n`);
    const bunOptions = `--preload=${preload}`, controlledEnv = { SystemRoot: process.env.SystemRoot ?? "C:\\Windows", PATH: process.env.PATH ?? "", TEMP: process.env.TEMP ?? attackDir, TMP: process.env.TMP ?? attackDir, USERPROFILE: process.env.USERPROFILE ?? attackDir, BUN_OPTIONS: bunOptions };
    const child = Bun.spawnSync({ cmd: [process.execPath, main], cwd: attackDir, env: controlledEnv, stdout: "pipe", stderr: "pipe" }); expect(child.exitCode).toBe(0); const observed = JSON.parse(child.stdout.toString()); expect(observed.attack).toBe("PASS"); expect(observed.subject.pid).not.toBe(process.pid); expect((observed.profile.loading_environment as Record<string, unknown>[]).find((item) => item.name === "BUN_OPTIONS")!.present).toBe(false);
    const payload = JSON.parse(artifact.payload_json), evidence = payload.enrollment.roles.find((role: Record<string, unknown>) => role.role === "evaluator"), envelope = JSON.parse(evidence.authenticated_enrollment.envelope_json), inner = JSON.parse(Buffer.from(envelope.payload, "base64url").toString());
    const launch = structuredClone(inner.launcher_observed_launch); Object.assign(launch, { subject_sha256: sha256(canonicalJson(observed.subject)), actual_main: observed.profile.actual_main, bun_executable: observed.profile.bun_executable, bun_version: observed.profile.bun_version, argv_sha256: observed.profile.argv_sha256, exec_argv_sha256: observed.profile.exec_argv_sha256, loading_args: ["--preload", preload], loading_inputs: [{ flag: "--preload", specifier: preload, present: true, path: preload, sha256: sha256(`globalThis.__catfoodKnownFail = "PASS"; delete process.env.BUN_OPTIONS;\n`) }], loading_environment: [{ name: "BUN_OPTIONS", present: true, value_sha256: sha256(bunOptions) }, { name: "NODE_OPTIONS", present: false, value_sha256: null }], cwd: attackDir, configuration: observed.profile.configuration, profile_sha256: sha256(canonicalJson({ parent_spawn: [process.execPath, main], cwd: attackDir, bun_options_sha256: sha256(bunOptions) })) }); delete launch.launch_id; launch.launch_id = `launch:${sha256(canonicalJson(launch)).slice(0, 32)}`;
    Object.assign(inner, { subject: observed.subject, launcher_observed_launch: launch }); evidence.subject = observed.subject; evidence.deployment_id = observed.subject.deployment_id; evidence.launcher_observed_launch = launch; evidence.authenticated_enrollment.envelope_json = fixture.signEnrollmentPayload(inner); payload.role_evidence_sha256 = sha256(canonicalJson(payload.enrollment.roles)); payload.evaluation_role_evidence_sha256 = payload.role_evidence_sha256;
    const text = canonicalJson(payload), writerKey = createPrivateKey(fixture.writer.private_key_pem); artifact.payload_json = text; artifact.signature_base64url = sign(null, Buffer.from(`IKORABU/WP3/CATFOOD/ATTESTATION/V3\n${text}`), writerKey).toString("base64url"); expect(() => verifyIndependentAttestation(canonicalJson(artifact), { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: fixture.contexts.verifier })).toThrow("ENROLLMENT_LAUNCH_INVALID");
  } finally { rmSync(attackDir, { recursive: true, force: true }); r.close(); } });

  test("T22-T24 clean authenticated TEST_ONLY acceptance and historical re-derivation remain stable", () => { const r = rig("run-c08-clean"); try { const { result } = positive(r); expect(result.verdict).toBe("PASS"); const bundle = r.custodian.rederive(r.spec.run_id), oracle = evaluateCatfoodAcceptance(bundle); for (const delta of [5_000, 300_000, 86_400_000]) { r.clock.advance(delta); expect(evaluateCatfoodAcceptance(r.custodian.rederive(r.spec.run_id))).toEqual(oracle); } } finally { r.close(); } });
});

describe("WP3 Corrective09 attestation signer and result binding", () => {
  test("T01 a stolen authorized writer key cannot turn an authentic FAIL assessment into PASS", () => { const r = rig("run-c09-baseline-fail"); try {
    const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); r.custodian.stop(first, "STOP");
    r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt); work(r, second, "editorial.outcome_evaluation", "outcome:one");
    r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); const result = r.custodian.closeRun(second); expect(result.verdict).toBe("FAIL");
    const issued = issueTestAttestation(r, "c09-baseline.db"), artifact = JSON.parse(issued.row.artifact_json), forged = JSON.parse(artifact.payload_json); expect(forged.decision_core.verdict).toBe("FAIL"); forged.decision_core.verdict = "PASS"; forged.decision_core.reason_codes = [];
    const text = canonicalJson(forged), writerKey = createPrivateKey(issued.fixture.writer.private_key_pem); artifact.payload_json = text; artifact.signature_base64url = sign(null, Buffer.from(`IKORABU/WP3/CATFOOD/ATTESTATION/V3\n${text}`), writerKey).toString("base64url");
    expect(() => verifyIndependentAttestation(canonicalJson(artifact), { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toThrow("ATTESTATION_RESULT_RECEIPT_INVALID");
  } finally { r.close(); } });

  test("T02-T04 exact FAIL/BLOCKED result, reasons, coverage and assessment instance are issuer-bound", () => {
    const fail = rig("run-c09-result-fail"), blocked = rig("run-c09-result-blocked"); try {
      expect(failRun(fail).verdict).toBe("FAIL"); const a = issueTestAttestation(fail, "c09-result-fail.db"), verifyA = (artifact: string) => verifyIndependentAttestation(artifact, { run_id: fail.spec.run_id, bundle_sha256: a.row.bundle_sha256, allow_test_only: true, verifier_enrollment: a.fixture.contexts.verifier }); expect(verifyA(a.row.artifact_json)).toBe("FAIL");
      for (const mutate of [
        (p: any) => { p.decision_core.verdict = "PASS"; p.decision_core.reason_codes = []; },
        (p: any) => { p.decision_core.reason_codes = [...p.decision_core.reason_codes, "WRITER_INVENTED_REASON"].sort(); },
        (p: any) => { p.decision_core.evidence_coverage = "PARTIAL"; },
        (p: any) => { p.assessment_id = "action:assessment-b"; },
      ]) expect(() => verifyA(forgeTestArtifact(a.row.artifact_json, a.fixture.writer.private_key_pem, mutate))).toThrow("ATTESTATION_RESULT_RECEIPT_INVALID");
      const secondStore = join(fail.dir, "c09-same-core-second-assessment.db"); writeFileSync(secondStore, ""); initializeIndependentAttestationStore(secondStore, { writer_identity: "attestor:test", signing_key_id: a.fixture.writer.key_id, signing_public_key_pem: a.fixture.writer.public_key_pem }); const secondWriter = new IndependentCatfoodAttestationWriter(fail.control, fail.checkpoint, secondStore, fail.source, a.fixture.writer.private_key_pem, a.fixture.contexts); let secondId: string; try { secondId = secondWriter.attest(fail.spec.run_id, fail.clock.sample().wall_time); } finally { secondWriter.close(); } const secondDb = new Database(secondStore, { readonly: true }), secondRow = secondDb.query<{ artifact_json: string }, [string]>("SELECT artifact_json FROM independent_attestations WHERE attestation_id=?").get(secondId!)!; secondDb.close(); const firstArtifact = JSON.parse(a.row.artifact_json), secondArtifact = JSON.parse(secondRow.artifact_json), firstPayload = JSON.parse(firstArtifact.payload_json), secondPayload = JSON.parse(secondArtifact.payload_json); expect(firstPayload.decision_core).toEqual(secondPayload.decision_core); expect(firstPayload.assessment_id).not.toBe(secondPayload.assessment_id); firstArtifact.evaluation_receipt = secondArtifact.evaluation_receipt; expect(() => verifyA(canonicalJson(firstArtifact))).toThrow("ATTESTATION_RESULT_RECEIPT_INVALID");
      expect(blockedRun(blocked).verdict).toBe("BLOCKED"); const b = issueTestAttestation(blocked, "c09-result-blocked.db"), forged = forgeTestArtifact(b.row.artifact_json, b.fixture.writer.private_key_pem, (p) => { p.decision_core.verdict = "PASS"; p.decision_core.reason_codes = []; }); expect(() => verifyIndependentAttestation(forged, { run_id: blocked.spec.run_id, bundle_sha256: b.row.bundle_sha256, allow_test_only: true, verifier_enrollment: b.fixture.contexts.verifier })).toThrow("ATTESTATION_RESULT_RECEIPT_INVALID");
    } finally { fail.close(); blocked.close(); }
  });

  test("T05-T10 protected writer credential, role channel, process, run, source and snapshot associations reject substitution", () => { const r = rig("run-c09-association"); try {
    positive(r); const issued = issueTestAttestation(r, "c09-association.db"), verifyIssued = (artifact: string, runId = r.spec.run_id) => verifyIndependentAttestation(artifact, { run_id: runId, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier });
    const wrong = generateKeyPairSync("ed25519"), wrongStore = join(r.dir, "c09-wrong-key.db"); writeFileSync(wrongStore, ""); initializeIndependentAttestationStore(wrongStore, { writer_identity: "attestor:test", signing_key_id: "attest:test", signing_public_key_pem: wrong.publicKey.export({ type: "spki", format: "pem" }).toString() }); expect(() => new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, wrongStore, r.source, wrong.privateKey.export({ type: "pkcs8", format: "pem" }).toString(), issued.fixture.contexts)).toThrow("ATTESTATION_WRITER_CREDENTIAL_INVALID");
    expect(() => issueEnrolledActionReceipt(issued.fixture.contexts.writer, "evaluator", "evaluator.result.commit", { forged: true }, "INDEPENDENT_EVALUATION")).toThrow("ENROLLMENT_CONTEXT_INVALID");
    expect(() => verifyIssued(forgeTestArtifact(issued.row.artifact_json, issued.fixture.writer.private_key_pem, (p) => { p.writer_credential.key_version = "v2"; }))).toThrow("ATTESTATION_WRITER_CREDENTIAL_INVALID");
    expect(() => verifyIssued(forgeTestArtifact(issued.row.artifact_json, issued.fixture.writer.private_key_pem, (p) => { p.decision_core.source_digest = "0".repeat(64); }))).toThrow("ATTESTATION_RESULT_RECEIPT_INVALID");
    expect(() => verifyIssued(forgeTestArtifact(issued.row.artifact_json, issued.fixture.writer.private_key_pem, (p) => { p.enrollment.roles[2].accepted_snapshot_id = "snapshot:other"; }))).toThrow("ATTESTATION_ENROLLMENT_MISMATCH");
    expect(() => verifyIssued(issued.row.artifact_json, "run:other")).toThrow("ATTESTATION_RESULT_INVALID");
  } finally { r.close(); } });

  test("T11-T12 authority times bound prepare/finalize while historical artifacts remain stable", () => { const r = rig("run-c09-time"); try {
    positive(r); const issued = issueTestAttestation(r, "c09-time.db"), reopened = new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, issued.store, r.source, issued.fixture.writer.private_key_pem, issued.fixture.contexts); try { expect(() => reopened.attest(r.spec.run_id, new Date(r.clock.wallMs - 1).toISOString())).toThrow("ATTESTATION_TIME_INVALID"); } finally { reopened.close(); }
    for (const delta of [5_000, 300_000, 86_400_000]) { r.clock.advance(delta); expect(verifyIndependentAttestation(issued.row.artifact_json, { run_id: r.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toBe("PASS"); }
    const expiredFixture = testEnrollmentFixture(r.spec.run_id, "a".repeat(64), r.clock.wallMs), expiredStore = join(r.dir, "c09-expired-finalize.db"); writeFileSync(expiredStore, ""); initializeIndependentAttestationStore(expiredStore, { writer_identity: "attestor:test", signing_key_id: expiredFixture.writer.key_id, signing_public_key_pem: expiredFixture.writer.public_key_pem }); expiredFixture.controls.advanceBefore("writer.issuance.finalize", 60_001); const writer = new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, expiredStore, r.source, expiredFixture.writer.private_key_pem, expiredFixture.contexts); try { expect(() => writer.attest(r.spec.run_id, new Date(r.clock.wallMs).toISOString())).toThrow("ENROLLMENT_UNAVAILABLE"); } finally { writer.close(); } const db = new Database(expiredStore, { readonly: true }); expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM independent_attestations").get()!.n).toBe(0); expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM issuance_finalizations").get()!.n).toBe(0); db.close();
  } finally { r.close(); } });

  test("T13-T16 valid outer re-signing cannot replace E/I, role digest, strict schema or authority purpose", () => { const r = rig("run-c09-envelope"); try {
    positive(r); const issued = issueTestAttestation(r, "c09-envelope.db"), expected = { run_id: r.spec.run_id, bundle_sha256: "", allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier }; expected.bundle_sha256 = issued.row.bundle_sha256;
    const swapped = JSON.parse(issued.row.artifact_json); swapped.evaluation_receipt.action_receipt = structuredClone(swapped.writer_credential_authorization.action_receipt); expect(() => verifyIndependentAttestation(canonicalJson(swapped), expected)).toThrow("ATTESTATION_RESULT_RECEIPT_INVALID");
    expect(() => verifyIndependentAttestation(forgeTestArtifact(issued.row.artifact_json, issued.fixture.writer.private_key_pem, (p) => { p.role_evidence_sha256 = "0".repeat(64); }), expected)).toThrow("ATTESTATION_ROLE_EVIDENCE_INVALID");
    const unknown = JSON.parse(issued.row.artifact_json); unknown.security_override = true; expect(() => verifyIndependentAttestation(canonicalJson(unknown), expected)).toThrow("ATTESTATION_SCHEMA_INVALID");
    const duplicate = issued.row.artifact_json.replace(`"schema":"catfood-independent-attestation-artifact.v3"`, `"schema":"catfood-independent-attestation-artifact.v3","schema":"catfood-independent-attestation-artifact.v3"`); expect(() => verifyIndependentAttestation(duplicate, expected)).toThrow("ATTESTATION_SCHEMA_INVALID");
    const badSignature = JSON.parse(issued.row.artifact_json); badSignature.signature_base64url = Buffer.alloc(64).toString("base64url"); expect(() => verifyIndependentAttestation(canonicalJson(badSignature), expected)).toThrow("ATTESTATION_SIGNATURE_INVALID");
  } finally { r.close(); } });

  test("T17-T18 authentic TEST_ONLY PASS, FAIL and BLOCKED packages preserve verdict and permanent taint", () => {
    const pass = rig("run-c09-pass"), fail = rig("run-c09-fail"), blocked = rig("run-c09-blocked"); try {
      positive(pass); failRun(fail); blockedRun(blocked); for (const [candidate, verdict] of [[pass, "PASS"], [fail, "FAIL"], [blocked, "BLOCKED"]] as const) { const issued = issueTestAttestation(candidate, `c09-${verdict}.db`); expect(verifyIndependentAttestation(issued.row.artifact_json, { run_id: candidate.spec.run_id, bundle_sha256: issued.row.bundle_sha256, allow_test_only: true, verifier_enrollment: issued.fixture.contexts.verifier })).toBe(verdict); const payload = JSON.parse(JSON.parse(issued.row.artifact_json).payload_json); expect(payload).toMatchObject({ trust_domain: "TEST_ONLY", decision_core: { test_only: true } }); }
    } finally { pass.close(); fail.close(); blocked.close(); }
  });

  test("T23-T24 exact replay is idempotent and a lost final receipt resumes the same staged issuance", () => { const r = rig("run-c09-idempotent"); try {
    positive(r); const fixture = testEnrollmentFixture(r.spec.run_id, "a".repeat(64), r.clock.wallMs), store = join(r.dir, "c09-idempotent.db"); writeFileSync(store, ""); initializeIndependentAttestationStore(store, { writer_identity: "attestor:test", signing_key_id: fixture.writer.key_id, signing_public_key_pem: fixture.writer.public_key_pem }); fixture.controls.loseResponseOnce("writer.issuance.finalize"); let first: IndependentCatfoodAttestationWriter | undefined; try { first = new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, store, r.source, fixture.writer.private_key_pem, fixture.contexts); expect(() => first!.attest(r.spec.run_id, r.clock.sample().wall_time)).toThrow("ENROLLMENT_UNAVAILABLE"); } finally { first?.close(); }
    const second = new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, store, r.source, fixture.writer.private_key_pem, fixture.contexts); let id: string, replay: string; try { id = second.attest(r.spec.run_id, r.clock.sample().wall_time); replay = second.attest(r.spec.run_id, r.clock.sample().wall_time); } finally { second.close(); } expect(replay!).toBe(id!); const db = new Database(store, { readonly: true }), row = db.query<{ artifact_json: string; bundle_sha256: string }, [string]>("SELECT artifact_json,bundle_sha256 FROM independent_attestations WHERE attestation_id=?").get(id!)!; for (const table of ["authenticated_assessments", "issuance_preparations", "issuance_finalizations", "independent_attestations"]) expect(db.query<{ n: number }, []>(`SELECT COUNT(*) n FROM ${table}`).get()!.n).toBe(1); db.close(); expect(verifyIndependentAttestation(row.artifact_json, { run_id: r.spec.run_id, bundle_sha256: row.bundle_sha256, allow_test_only: true, verifier_enrollment: fixture.contexts.verifier })).toBe("PASS"); expect(() => verifyIndependentAttestation("{}", "x", fixture.writer.public_key_pem, { run_id: r.spec.run_id, bundle_sha256: row.bundle_sha256 })).toThrow("ATTESTATION_VERSION_UNSUPPORTED");
  } finally { r.close(); } });
});
