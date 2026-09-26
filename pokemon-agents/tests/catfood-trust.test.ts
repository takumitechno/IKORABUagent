import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { createPrivateKey, generateKeyPairSync, sign, verify } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Worker } from "node:worker_threads";
import { canonicalJson, sha256, type OperationalBoundaryV1 } from "../web/lib/catfood-harness";
import {
  CATFOOD_CAPABILITIES, CATFOOD_FIXED_POLICY, CATFOOD_GO_SCHEMA, CATFOOD_OPERATIONAL_CONTRACT_GAPS,
  CATFOOD_POLICY_SHA256, CATFOOD_TRUST_SCHEMA, ProtectedCatfoodCustodian, createCatfoodRunSpec,
  IndependentCatfoodEvaluator, initializeProtectedCatfoodStores, verifyHumanGo, type CatfoodRunSpec, type CatfoodTrustConfig,
  type HumanGoPayload, type RunnerSession,
} from "../web/lib/catfood-trust";
import { FixtureThreadsSource, TestClock } from "./catfood-trust-fixture";
import { IndependentCatfoodAttestationWriter, initializeIndependentAttestationStore, verifyIndependentAttestation } from "../web/lib/catfood-independent-attestation";

const THREADS = "f15c9235ddd62c003b8105c2a640d81defa4fb83";
const BOUNDARY = "57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf";
const RELEASE = "799344a0a0d4a42ca160e5199d4910f7e6227836b17b9ff9a2b3a90202394d98";
const IKORABU = "c".repeat(40);

type Rig = ReturnType<typeof rig>;

function rig(runId = `run-${Math.random().toString(16).slice(2)}`, gaps: readonly string[] = []) {
  const dir = mkdtempSync(join(tmpdir(), "catfood-trust-")); const control = join(dir, "control.db"); const checkpoint = join(dir, "checkpoint.db");
  writeFileSync(control, ""); writeFileSync(checkpoint, "");
  const keys = generateKeyPairSync("ed25519"); const publicKey = keys.publicKey.export({ type: "spki", format: "pem" }).toString();
  const clock = new TestClock();
  const trust: CatfoodTrustConfig = { schema: CATFOOD_TRUST_SCHEMA, custodian_identity: "custodian:test", environment_type: "test", environment_instance_id: "instance:test", organization_id: "org:test", tenant_id: "tenant:test", account_id: "acct_test", ikorabu_release_sha: IKORABU, threads_sha: THREADS, operational_boundary_sha256: BOUNDARY, threads_release_sha256: RELEASE, threads_schema: 30, source_mode: "TEST_ONLY", go_keys: [{ key_id: "go:test", public_key_pem: publicKey, trust_class: "TEST_ONLY" }] };
  const spec = createCatfoodRunSpec({ run_id: runId, environment_type: "test", environment_instance_id: trust.environment_instance_id, organization_id: trust.organization_id, tenant_id: trust.tenant_id, account_id: trust.account_id, capabilities: CATFOOD_CAPABILITIES, effective_config_sha256: "4".repeat(64), ikorabu_release_sha: IKORABU, threads_sha: THREADS, operational_boundary_sha256: BOUNDARY, threads_release_sha256: RELEASE, threads_schema: 30 });
  const payload: HumanGoPayload = { schema: CATFOOD_GO_SCHEMA, grant_id: `grant:${runId}`, nonce: `nonce:${runId}`, run_id: runId, spec_hash: spec.spec_sha256, environment_type: spec.environment_type, environment_instance_id: spec.environment_instance_id, organization_id: spec.organization_id, tenant_id: spec.tenant_id, account_id: spec.account_id, capabilities: CATFOOD_CAPABILITIES, valid_from: new Date(clock.wallMs - 1_000).toISOString(), valid_until: new Date(clock.wallMs + 90_000_000).toISOString(), maximum_duration_seconds: 86_400, maximum_wp3_epoch: 2, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, threads_sha: THREADS, operational_boundary_sha256: BOUNDARY, threads_release_sha256: RELEASE, threads_schema: 30, ikorabu_release_sha: IKORABU, paid_provider_allowance: "ZERO" };
  const artifact = signGo(payload, keys.privateKey);
  initializeProtectedCatfoodStores(control, checkpoint, trust, clock.sample().wall_time);
  const source = new FixtureThreadsSource(clock, THREADS, RELEASE, gaps);
  const custodian = new ProtectedCatfoodCustodian(control, checkpoint, source, clock);
  return { dir, control, checkpoint, clock, trust, spec, payload, artifact, source, custodian, privateKey: keys.privateKey, close() { try { custodian.close(); } finally { rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } } };
}

function signGo(payload: HumanGoPayload | Record<string, unknown>, privateKey: ReturnType<typeof createPrivateKey> | ReturnType<typeof generateKeyPairSync>["privateKey"]): string {
  const bytes = Buffer.from(canonicalJson(payload));
  return canonicalJson({ algorithm: "Ed25519", key_id: "go:test", payload: bytes.toString("base64url"), signature: sign(null, bytes, privateKey).toString("base64url") });
}

function start(r: Rig): RunnerSession { r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); const receipt = r.custodian.preflight(session); r.custodian.activate(session, receipt); return session; }
function work(r: Rig, session: RunnerSession, capability: "editorial.cycle" | "editorial.outcome_evaluation" | "threads.publish.dry_run", sourceId: string) { const ticket = r.custodian.admit(session, capability, sourceId); r.source.complete(ticket.claim_id); r.custodian.reconcile(session, ticket.work_id); return ticket; }
function positive(r: Rig) {
  const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); r.custodian.stop(first, "STOP");
  r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt);
  work(r, second, "editorial.outcome_evaluation", "outcome:one"); work(r, second, "threads.publish.dry_run", "dry:one");
  r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); return { second, result: r.custodian.closeRun(second) };
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
    const session = r.custodian.issueOwnerSession(r.spec.run_id); expect(() => r.custodian.preflight(session)).toThrow("GO_REVOKED");
    const wrong = { ...r.spec, environment_type: "staging" } as CatfoodRunSpec; expect(() => verifyHumanGo(r.artifact, wrong, r.trust, r.clock.sample().wall_time)).toThrow();
  } finally { r.close(); } });

  test("T03 timestamp mutation with attacker-recomputed hashes is FAIL against checkpoints", () => { const r = rig(); try {
    positive(r); r.custodian.close(); const db = new Database(r.control); db.exec("DROP TRIGGER catfood_journal_no_update"); const rows = db.query<Record<string, unknown>, []>("SELECT * FROM catfood_source_journal ORDER BY sequence").all(); let previous = "GENESIS";
    for (const [index, row] of rows.entries()) { const base = journalBase({ ...row, observed_at: index === 0 ? "2026-09-30T00:00:00.000Z" : row.observed_at }, previous); const hash = sha256(canonicalJson(base as never)); db.query("UPDATE catfood_source_journal SET observed_at=?,previous_row_hash=?,row_hash=? WHERE run_id=? AND sequence=?").run(base.observed_at, previous, hash, row.run_id, row.sequence); previous = hash; } db.exec("CREATE TRIGGER catfood_journal_no_update BEFORE UPDATE ON catfood_source_journal BEGIN SELECT RAISE(ABORT,'source journal is append-only'); END"); db.close();
    const evaluator = new IndependentCatfoodEvaluator(r.control, r.checkpoint, r.source); expect(evaluator.evaluate(r.spec.run_id).verdict).toBe("FAIL"); evaluator.close();
  } finally { rmSync(r.dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } });

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
    const signing = generateKeyPairSync("ed25519"); const store = join(r.dir, "attest.db"); writeFileSync(store, ""); const publicPem = signing.publicKey.export({ type: "spki", format: "pem" }).toString();
    initializeIndependentAttestationStore(store, { writer_identity: "attestor:test", signing_key_id: "attest:test", signing_public_key_pem: publicPem });
    const writer = new IndependentCatfoodAttestationWriter(r.control, r.checkpoint, store, r.source, signing.privateKey.export({ type: "pkcs8", format: "pem" }).toString()); const id = writer.attest(r.spec.run_id, r.clock.sample().wall_time); writer.close();
    const db = new Database(store, { readonly: true }); const row = db.query<{ payload_json: string; signature_base64url: string; bundle_sha256: string }, [string]>("SELECT payload_json,signature_base64url,bundle_sha256 FROM independent_attestations WHERE attestation_id=?").get(id)!; db.close();
    expect(verifyIndependentAttestation(row.payload_json, row.signature_base64url, publicPem, { run_id: r.spec.run_id, bundle_sha256: row.bundle_sha256 })).toBe("PASS");
    expect(() => verifyIndependentAttestation(row.payload_json, row.signature_base64url, publicPem, { run_id: "other-run", bundle_sha256: row.bundle_sha256 })).toThrow("ATTESTATION_BINDING_MISMATCH");
    const changed = JSON.parse(row.payload_json); changed.verdict = "FAIL"; expect(() => verifyIndependentAttestation(canonicalJson(changed), row.signature_base64url, publicPem, { run_id: r.spec.run_id, bundle_sha256: row.bundle_sha256 })).toThrow("ATTESTATION_SIGNATURE_INVALID");
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

  test("T19 fixed policy cannot be weakened by run spec", () => { expect(CATFOOD_FIXED_POLICY.continuous_duration_seconds).toBe(86_400); expect(CATFOOD_FIXED_POLICY.minimum_meaningful_units).toBe(3); expect(CATFOOD_FIXED_POLICY.minimum_capability_classes).toBe(2); expect(() => createCatfoodRunSpec({ duration: 1 } as never)).toThrow(); });

  test("T20 future/fake duration, boot change, and incomplete coverage never PASS", () => { const r = rig(); try { positive(r); expect(r.custodian.evaluate(r.spec.run_id).verdict).toBe("PASS"); const db = new Database(r.control); db.query("UPDATE catfood_runs SET closed_boot_id='boot-forged'").run(); db.close(); expect(r.custodian.evaluate(r.spec.run_id).verdict).not.toBe("PASS"); } finally { r.close(); } });

  test("T21-T22 open authority, unresolved work, missing cost coverage, and provider activity never PASS", () => { const r = rig(); try { const session = start(r); const ticket = r.custodian.admit(session, "editorial.cycle", "cycle:one"); expect(r.custodian.evaluate(r.spec.run_id).verdict).not.toBe("PASS"); r.source.complete(ticket.claim_id, { provider_invoked: true }); r.custodian.reconcile(session, ticket.work_id); r.source.runtime = { ...r.source.runtime, cost_coverage: "UNKNOWN", provider_activity_count: 1 }; expect(r.custodian.evaluate(r.spec.run_id).verdict).not.toBe("PASS"); } finally { r.close(); }
    const closed = rig(); try { positive(closed); closed.source.grant(closed.spec, "editorial.cycle", "unauthorized-reopen", closed.source.generation("editorial.cycle")); expect(closed.custodian.evaluate(closed.spec.run_id).verdict).toBe("FAIL"); } finally { closed.close(); } });

  test("T23 complete accelerated 24h policy fixture is TEST_ONLY PASS", () => { const r = rig(); try { const { result } = positive(r); expect(result).toMatchObject({ verdict: "PASS", test_only: true, policy_sha256: CATFOOD_POLICY_SHA256 }); } finally { r.close(); } });

  test("T24 breaking exactly the three-unit minimum never PASS", () => { const r = rig(); try { const first = start(r); work(r, first, "editorial.cycle", "cycle:one"); r.custodian.stop(first, "STOP"); r.clock.advance(121_000); const second = r.custodian.issueOwnerSession(r.spec.run_id); r.custodian.takeover(r.spec.run_id, second); const receipt = r.custodian.preflight(second); r.custodian.activate(second, receipt); work(r, second, "editorial.outcome_evaluation", "outcome:one"); r.clock.advance(86_400_000); r.custodian.stop(second, "STOP"); const result = r.custodian.closeRun(second); expect(result.verdict).not.toBe("PASS"); expect(result.reason_codes).toEqual(["MEANINGFUL_WORK_COUNT_NOT_MET"]); } finally { r.close(); } });

  test("operational source gaps fail preflight closed as CONTRACT_GAP", () => { const r = rig("run-contract-gap", CATFOOD_OPERATIONAL_CONTRACT_GAPS); try { r.custodian.createRun(r.spec, r.artifact); const session = r.custodian.issueOwnerSession(r.spec.run_id); expect(() => r.custodian.preflight(session)).toThrow("THREADS_COMPLETED_GOVERNED_CLAIM_READ_INTERFACE_MISSING"); } finally { r.close(); } });

  test("RFC 8032 Ed25519 vector verifies with the established crypto implementation", () => {
    const seed = Buffer.from("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60", "hex");
    const publicBytes = Buffer.from("d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a", "hex");
    const signature = Buffer.from("e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b", "hex");
    const privateKey = createPrivateKey({ key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]), format: "der", type: "pkcs8" });
    expect(sign(null, Buffer.alloc(0), privateKey).equals(signature)).toBe(true);
    expect(verify(null, Buffer.alloc(0), { key: Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), publicBytes]), format: "der", type: "spki" }, signature)).toBe(true);
  });
});
