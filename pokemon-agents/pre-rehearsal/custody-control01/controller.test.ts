import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { createHash, generateKeyPairSync } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { canonicalJson } from "../../web/lib/catfood-harness";
import { CATFOOD_POLICY_SHA256 } from "../../web/lib/catfood-trust";
import {
  collectCurrentRuntimeSubject,
  observeTestOnlyRoleLaunch,
  roleChannelAcceptedSnapshotDigest,
  type CatfoodEnrollmentRole,
  type TestEnrollmentBinding,
} from "../../web/lib/catfood-enrollment";
import {
  CATFOOD_FINAL_CLOSURE_CHARTER,
  CATFOOD_SEALED_INPUT_SCHEMA,
  CATFOOD_SQLITE_EXPORT_PROFILE,
  type CatfoodGoRootPolicyV1,
  type CatfoodSealedInputManifestV1,
} from "../../web/lib/catfood-final-closure";
import {
  CatfoodRoleAuthority,
  buildCustodyReleaseAction,
  buildEvaluationActionV3,
  createTestOnlyRoleSession,
  initializeRoleAuthorityStore,
  localRoleEvidence,
  performRoleAction,
  roleChannelPublicKeyFingerprint,
  verifyRoleEvidenceV4,
  type AuthorityEvaluationJob,
  type LocalRoleSession,
  type RoleActionReceiptV2,
  type RoleChannelBinding,
  type RoleRunScope,
} from "../../web/lib/catfood-role-channel";
import { testGoRootPolicy } from "../../tests/catfood-go-root-policy-fixture";
import {
  CustodyController,
  CustodyControlError,
  PreCustodyControlHost,
  TestOnlySqliteContinuityWitness,
  canonicalKeySha256,
  initializeCustodyController,
  initializeTestOnlyContinuityWitness,
  type CanonicalRunKey,
  type CustodianSubject,
  type FenceProof,
  type RunBinding,
  type WitnessRecord,
} from "./controller";

const sha = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
const now = () => Date.now() + 60_000;

function binding(overrides: Partial<RunBinding> = {}): RunBinding {
  const key: CanonicalRunKey = { environment_type: "test", deployment_id: "deployment:test", organization_id: "org:test", tenant_id: "tenant:test", account_id: "acct:test", run_id: "run:test" };
  return { key, environment_instance_id: "instance:test", spec_sha256: "1".repeat(64), window_sha256: "2".repeat(64), go_artifact_sha256: "8".repeat(64), go_policy_ref_sha256: "3".repeat(64), authority_incarnation: "authority:test", control_store_id: "control:test", checkpoint_store_id: "checkpoint:test", store_pair_lineage_sha256: "4".repeat(64), producer_generation: 1, initial_control_head_sha256: "5".repeat(64), initial_checkpoint_head_sha256: "6".repeat(64), test_only: true, ...overrides };
}

const subject = (suffix = "one"): CustodianSubject => ({ process_id: `process:${suffix}`, launch_id: `launch:${suffix}`, session_id: `session:${suffix}`, host_incarnation: `host:${suffix}`, build_sha256: "7".repeat(64) });
const fence = (b = binding()): FenceProof => ({ old_process_cannot_execute: true, old_credentials_revoked: true, producer_effects_resolved: true, complete_history_verified: true, control_head_sha256: b.initial_control_head_sha256, checkpoint_head_sha256: b.initial_checkpoint_head_sha256 });

function manifest(b = binding(), variant = "a", profile?: CatfoodGoRootPolicyV1["verification_profile"]): CatfoodSealedInputManifestV1 {
  const snapshot = { format: CATFOOD_SQLITE_EXPORT_PROFILE, byte_length: 4096, raw_sha256: variant.repeat(64), logical_schema_sha256: "2".repeat(64) } as const;
  const goProfile = profile ?? { profile_id: "go-profile:test", keys: [{ key_id: "go:test", public_key_sha256: "a".repeat(64) }] } as CatfoodGoRootPolicyV1["verification_profile"];
  const scope: RoleRunScope = { ...b.key, environment_instance_id: b.environment_instance_id, spec_sha256: b.spec_sha256 };
  const body = { schema: CATFOOD_SEALED_INPUT_SCHEMA, charter: CATFOOD_FINAL_CLOSURE_CHARTER, scope, window: { start: "2026-09-29T00:00:00.000Z", end: "2026-09-30T00:00:00.000Z" }, closure: { closed_source_event_id: `event:closed:${variant}`, run_closed_event_id: `event:run:${variant}`, lifecycle: "CLOSED" as const }, journal: { high_water: 42, head_sha256: variant.repeat(64) }, checkpoint: { checkpoint_id: `checkpoint:${variant}`, checkpoint_sha256: "4".repeat(64), pins_sha256: "5".repeat(64) }, retained_source: { archive_sha256: "6".repeat(64), source_digest: "7".repeat(64), producer_identity: "threads:producer" }, go: { artifact_sha256: b.go_artifact_sha256, verification_profile_id: goProfile.profile_id, verification_profile_sha256: sha(canonicalJson(goProfile as never)), root_fingerprints: goProfile.keys.map((key) => key.public_key_sha256) }, fixed: { dependencies_sha256: "b".repeat(64), policy_sha256: CATFOOD_POLICY_SHA256, kernel_sha256: "c".repeat(64) }, trust: { environment_provenance_sha256: "d".repeat(64), clock_provenance_sha256: "e".repeat(64), acquisition_provenance_sha256: "f".repeat(64), test_only: true }, expected_bundle_sha256: "0".repeat(64), pair_common_cut_sha256: "1".repeat(64), control: snapshot, checkpoint_store: snapshot };
  return { ...body, manifest_id: `manifest:${sha(canonicalJson(body as never)).slice(0, 40)}` } as CatfoodSealedInputManifestV1;
}

type Fixture = ReturnType<typeof fixture>;
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "pre-custody-control01-")), controllerPath = join(dir, "controller.db"), witnessPath = join(dir, "witness.db");
  writeFileSync(controllerPath, ""); writeFileSync(witnessPath, "");
  initializeCustodyController(controllerPath, "controller:test"); initializeTestOnlyContinuityWitness(witnessPath);
  const witness = new TestOnlySqliteContinuityWitness(witnessPath), controller = new CustodyController(controllerPath, witness), b = binding();
  return { dir, controllerPath, witnessPath, witness, controller, b, close() { this.controller.close(); witness.close(); rmSync(dir, { recursive: true, force: true }); } };
}

function active(f: Fixture, owner = subject()) {
  f.controller.reserveRun(f.b, "reserve:one");
  f.controller.admitCustodian(f.b.key, owner, now(), "admit:one");
  return owner;
}

function closed(f: Fixture, variant = "a") {
  const owner = active(f), sealed = manifest(f.b, variant);
  f.controller.closeManifest(f.b.key, owner, sealed, "close:one");
  return { owner, sealed };
}

type AuthorityFixture = ReturnType<typeof authorityFixture>;
function authorityFixture() {
  const f = fixture(), authorityPath = join(f.dir, "authority.db"); writeFileSync(authorityPath, "");
  const authorityKey = generateKeyPairSync("ed25519"), goKey = generateKeyPairSync("ed25519"), authorityPublic = authorityKey.publicKey.export({ type: "spki", format: "pem" }).toString(), goPublic = goKey.publicKey.export({ type: "spki", format: "pem" }).toString(), scope: RoleRunScope = { ...f.b.key, environment_instance_id: f.b.environment_instance_id, spec_sha256: f.b.spec_sha256 };
  const go = testGoRootPolicy({ authority_identity: "fixture-role-authority", authority_public_key_pem: authorityPublic, enrollment_namespace: "fixture:pre-custody", scope, public_keys: [{ key_id: "go:test", public_key_pem: goPublic }], not_before: "2026-09-29T00:00:00.000Z", not_after: "2026-10-03T00:00:00.000Z", acceptance_policy_sha256: CATFOOD_POLICY_SHA256 });
  const roleBinding: RoleChannelBinding = { trust_domain: "TEST_ONLY", issuer: "fixture-role-authority", issuer_key_id: "authority:v4", audience: "ikorabu-catfood", origin: "http://127.0.0.1:32199", credential: "fixture-coarse-service-access-credential", authority_public_key_pem: authorityPublic, enrollment_namespace: "fixture:pre-custody", build_policy_sha256: CATFOOD_POLICY_SHA256, accepted_snapshot_id: "snapshot:pre-custody", accepted_snapshot_sha256: roleChannelAcceptedSnapshotDigest(), policy: { policy_id: "fixture-policy-v1", session_lifetime_ms: 60_000, registration_challenge_lifetime_ms: 5_000, action_challenge_lifetime_ms: 5_000, maximum_outstanding_requests: 16, receipt_retention_ms: 86_400_000, go_root_policy_documents: [go.policy], go_root_workload_selections: [go.selection] } };
  initializeRoleAuthorityStore(authorityPath, roleBinding); const clock = Date.parse("2026-09-29T12:00:00.000Z"), authority = new CatfoodRoleAuthority(authorityPath, roleBinding, authorityKey.privateKey, () => clock);
  const enrollmentBinding = (role: CatfoodEnrollmentRole, writer?: { key_id: string; key_version: string; public_key_sha256: string; public_key_pem: string }): TestEnrollmentBinding => ({ trust_domain: "TEST_ONLY", issuer: roleBinding.issuer, issuer_key_id: roleBinding.issuer_key_id, audience: roleBinding.audience, origin: roleBinding.origin, credential: roleBinding.credential, public_key_pem: roleBinding.authority_public_key_pem, environment_identity: scope.environment_instance_id, deployment_id: scope.deployment_id, enrollment_namespace: roleBinding.enrollment_namespace, build_policy_sha256: roleBinding.build_policy_sha256, accepted_snapshot_id: roleBinding.accepted_snapshot_id, accepted_snapshot_sha256: roleBinding.accepted_snapshot_sha256, launch_ticket: `launch:${role}`, writer_signing_key_id: writer?.key_id ?? "none", writer_signing_key_version: writer?.key_version ?? "none", writer_signing_public_key_pem: writer?.public_key_pem ?? roleBinding.authority_public_key_pem });
  const enroll = (role: CatfoodEnrollmentRole, distinct = false) => {
    const outer = generateKeyPairSync("ed25519"), publicKey = outer.publicKey.export({ type: "spki", format: "pem" }).toString(), writer = role === "writer" ? { key_id: "attest:test", key_version: "v1", public_key_sha256: roleChannelPublicKeyFingerprint(publicKey), public_key_pem: publicKey } : undefined, eb = enrollmentBinding(role, writer), current = collectCurrentRuntimeSubject(eb), runtimeSubject = distinct ? { ...current, pid: current.pid + 1000, process_start: `${current.process_start}:distinct` } : current, launch = observeTestOnlyRoleLaunch(eb, role, runtimeSubject);
    return createTestOnlyRoleSession(authority, { role, scope, subject: runtimeSubject, launch, writer_credential: writer, now: () => clock });
  };
  const custodian = enroll("custodian"), evaluator = enroll("evaluator"), writer = enroll("writer", true), verifier = enroll("verifier"), sealed = manifest(f.b, "a", go.policy.verification_profile), owner = active(f); f.controller.closeManifest(f.b.key, owner, sealed, "close:one");
  const evidence = { custodian: localRoleEvidence(custodian), evaluator: localRoleEvidence(evaluator), writer: localRoleEvidence(writer), verifier: localRoleEvidence(verifier) }, roleEvidenceSha = sha(canonicalJson([evidence.custodian, evidence.evaluator, evidence.writer] as never));
  return { ...f, authorityPath, authority, roleBinding, scope, go, custodian, evaluator, writer, verifier, evidence, roleEvidenceSha, sealed, close() { authority.close(); f.close(); } };
}

const enrollment = (session: LocalRoleSession) => JSON.parse(Buffer.from(JSON.parse(String(localRoleEvidence(session).enrollment_envelope_json)).payload, "base64url").toString()) as Record<string, unknown>;

function release(f: AuthorityFixture, sealed = f.sealed, request = "release:one"): RoleActionReceiptV2 {
  const evaluator = enrollment(f.evaluator), writer = enrollment(f.writer);
  return performRoleAction(f.custodian, { action: "custodian.evaluation.release", purpose_class: "HISTORICAL_EVIDENCE", request_id: request, logical_target: f.scope.run_id, body: (actionId) => buildCustodyReleaseAction({ action_id: actionId, manifest: sealed, go_root_policy_ref: f.go.ref, evaluator_session_id: String(evaluator.session_id), writer_session_id: String(writer.session_id), role_evidence_sha256: f.roleEvidenceSha, workflow_instruction_id: `instruction:${request}` }) });
}

function issue(f: AuthorityFixture, operationId: string, sealed = f.sealed, receipt = release(f, sealed, `release:${operationId}`)): AuthorityEvaluationJob {
  const evaluatorEvidence = verifyRoleEvidenceV4(f.evidence.evaluator, f.roleBinding, "evaluator", f.scope), writerEvidence = verifyRoleEvidenceV4(f.evidence.writer, f.roleBinding, "writer", f.scope);
  return f.controller.issueEvaluationJob({ key: f.b.key, manifest: sealed, custody_release_receipt: receipt, binding: f.roleBinding, operation_id: operationId }, () => f.authority.issueEvaluationJob({ custody_release_receipt: receipt, manifest: sealed, evaluator: evaluatorEvidence, writer: writerEvidence, role_evidence_sha256: f.roleEvidenceSha, workflow_instruction_id: `instruction:release:${operationId}`, workflow_instruction_sha256: sha(operationId), commit_lifetime_ms: 30_000 }));
}

function commit(f: AuthorityFixture, job: AuthorityEvaluationJob, verdict: "PASS" | "FAIL" = "FAIL") {
  const evaluator = enrollment(f.evaluator), core = { evaluator: { session_id: evaluator.session_id, build_sha256: "c".repeat(64) }, verdict, reason_codes: verdict === "FAIL" ? ["KNOWN_FAILURE"] : [] };
  return performRoleAction(f.evaluator, { action: "evaluator.result.commit", purpose_class: "INDEPENDENT_EVALUATION", request_id: job.descriptor.stable_evaluator_request_id, logical_target: job.descriptor.evaluation_job_id, body: () => buildEvaluationActionV3({ job, decision_core: core, evaluator: core.evaluator, source_digest: f.sealed.retained_source.source_digest }) });
}

describe("PRE-CUSTODY-CONTROL01 TEST_ONLY", () => {
  test("N01 canonical run/store admission succeeds", () => { const f = fixture(); try { const owner = active(f); expect(f.controller.state(f.b.key)).toMatchObject({ state: "ACTIVE", owner }); } finally { f.close(); } });

  test("N02 concurrent second custodian loses before access", async () => { const f = fixture(); try { f.controller.reserveRun(f.b, "reserve:one"); const results = await Promise.allSettled([Promise.resolve().then(() => f.controller.admitCustodian(f.b.key, subject("one"), now(), "admit:one")), Promise.resolve().then(() => f.controller.admitCustodian(f.b.key, subject("two"), now(), "admit:two"))]); expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1); expect(f.controller.state(f.b.key).state).toBe("ACTIVE"); } finally { f.close(); } });

  test("N03 bound GO/spec/store/authority values cannot create a namespace bypass", () => { const f = fixture(); try { f.controller.reserveRun(f.b, "reserve:one"); for (const altered of [{ spec_sha256: "9".repeat(64) }, { go_artifact_sha256: "9".repeat(64) }, { control_store_id: "control:fork" }, { authority_incarnation: "authority:fork" }]) expect(() => f.controller.reserveRun(binding(altered), `reserve:${Object.keys(altered)[0]}`)).toThrow("RUN_BINDING_CONFLICT"); } finally { f.close(); } });

  test("N04 lease loss is suspicion and replacement needs actual fencing", () => { const f = fixture(); try { const owner = active(f); f.controller.markLeaseLost(f.b.key, owner, "lease:lost"); expect(() => f.controller.replaceCustodian(f.b.key, subject("two"), { ...fence(f.b), old_process_cannot_execute: false } as unknown as FenceProof, now(), "replace:bad")).toThrow("REPLACEMENT_NOT_PROVEN"); expect(f.controller.state(f.b.key).state).toBe("FENCING"); } finally { f.close(); } });

  test("N05 crash restart preserves lineage and admits only a fenced successor", () => { const f = fixture(); try { const owner = active(f); f.controller.markLeaseLost(f.b.key, owner, "lease:lost"); f.controller.close(); f.controller = new CustodyController(f.controllerPath, f.witness); f.controller.replaceCustodian(f.b.key, subject("two"), fence(f.b), now(), "replace:good"); expect(f.controller.state(f.b.key)).toMatchObject({ state: "ACTIVE", owner: subject("two"), binding: { store_pair_lineage_sha256: f.b.store_pair_lineage_sha256 } }); } finally { f.close(); } });

  test("N06 exact CLOSED replay is idempotent and repeat evaluation stays possible", () => { const f = authorityFixture(); try { expect(f.controller.closeManifest(f.b.key, subject(), f.sealed, "close:replay")).toEqual({ manifest_sha256: expect.any(String), replay: true }); const first = issue(f, "job:one"), second = issue(f, "job:two"); expect(first.descriptor.evaluation_job_id).not.toBe(second.descriptor.evaluation_job_id); expect(first.descriptor.manifest_sha256).toBe(second.descriptor.manifest_sha256); } finally { f.close(); } });

  test("N07 authentic alternate FAIL/PASS custody history cannot become current", () => { const f = authorityFixture(); try { const first = issue(f, "job:first"); expect(first.descriptor.manifest_sha256).toBeTruthy(); const alternate = manifest(f.b, "b", f.go.policy.verification_profile), alternateReceipt = release(f, alternate, "release:alternate"); expect(() => f.controller.closeManifest(f.b.key, subject(), alternate, "incident:alternate")).toThrow("CUSTODY_FORK_SUSPECTED"); expect(() => f.controller.issueEvaluationJob({ key: f.b.key, manifest: alternate, custody_release_receipt: alternateReceipt, binding: f.roleBinding, operation_id: "job:alternate" }, () => { throw new Error("must not reach authority"); })).toThrow("CANONICAL_CLOSE_REQUIRED"); const db = new Database(f.authorityPath, { readonly: true }); expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM evaluation_jobs").get()!.n).toBe(1); db.close(); } finally { f.close(); } });

  test("N08 two differing PASS-labelled histories still quarantine without verdict selection", () => { const f = fixture(); try { const { sealed } = closed(f); expect(sealed.manifest_id).toBeTruthy(); expect(() => f.controller.closeManifest(f.b.key, subject(), manifest(f.b, "b"), "incident:pass-pass")).toThrow("CUSTODY_FORK_SUSPECTED"); expect(f.controller.state(f.b.key)).toMatchObject({ state: "INCIDENT", incident_count: 1, canonical_manifest_sha256: expect.any(String) }); } finally { f.close(); } });

  test("N09 restored/copy pair and hidden suffix cannot resume", () => { const f = fixture(); try { const owner = active(f); f.controller.markLeaseLost(f.b.key, owner, "lease:lost"); expect(() => f.controller.replaceCustodian(f.b.key, subject("two"), { ...fence(f.b), control_head_sha256: "9".repeat(64) }, now(), "replace:stale")).toThrow("REPLACEMENT_NOT_PROVEN"); expect(() => f.controller.reserveRun(binding({ control_store_id: "copied", checkpoint_store_id: "copied-checkpoint" }), "reserve:copy")).toThrow("RUN_BINDING_CONFLICT"); } finally { f.close(); } });

  test("N10 authority/controller rollback against an advanced witness blocks current actions", () => { const f = fixture(); try { active(f); const db = new Database(f.controllerPath); db.query("UPDATE governed_runs SET revision=revision-1,witness_digest=? WHERE key_sha256=?").run("0".repeat(64), canonicalKeySha256(f.b.key)); db.close(); expect(() => f.controller.checkpoint(f.b.key, subject(), "8".repeat(64), "9".repeat(64), now(), "checkpoint:rollback")).toThrow("CONTINUITY_HIGH_WATER_MISMATCH"); } finally { f.close(); } });

  test("N11 witness outage and lost append response never rebaseline", () => { const f = fixture(); try { f.witness.setFailureForTest("AFTER_COMMIT"); expect(() => f.controller.reserveRun(f.b, "reserve:lost")).toThrow("WITNESS_RESPONSE_LOST"); expect(f.controller.state(f.b.key)).toMatchObject({ state: "RESERVING", revision: 0 }); f.witness.setFailureForTest("NONE"); expect(f.controller.reconcilePending("reserve:lost")).toMatchObject({ state: "RESERVED", revision: 1 }); f.witness.setFailureForTest("BEFORE_COMMIT"); expect(() => f.controller.admitCustodian(f.b.key, subject(), now(), "admit:offline")).toThrow("WITNESS_UNAVAILABLE"); expect(() => f.controller.admitCustodian(f.b.key, subject("two"), now(), "admit:new-key")).toThrow("CONTINUITY_OPERATION_PENDING"); } finally { f.close(); } });

  test("N12 an issued target is not current permission after a fork incident", () => { const f = authorityFixture(); try { const job = issue(f, "job:target"); commit(f, job); const verifierEvidence = verifyRoleEvidenceV4(f.evidence.verifier, f.roleBinding, "verifier", f.scope), target = f.controller.assignExpectedTarget({ key: f.b.key, evaluation_job_id: job.descriptor.evaluation_job_id, verifier_binding: f.roleBinding, operation_id: "target:one" }, () => f.authority.assignExpectedEvaluationTarget({ verifier: verifierEvidence, evaluation_job_id: job.descriptor.evaluation_job_id, purpose: "VERIFY_EXPECTED" })); expect(f.controller.publishCurrentTarget(f.b.key, target, () => "published:test-only")).toBe("published:test-only"); expect(() => f.controller.closeManifest(f.b.key, subject(), manifest(f.b, "b", f.go.policy.verification_profile), "incident:after-target")).toThrow("CUSTODY_FORK_SUSPECTED"); expect(() => f.controller.publishCurrentTarget(f.b.key, target, () => "must-not-publish")).toThrow("CANONICAL_CLOSE_REQUIRED"); } finally { f.close(); } });

  test("N13 lost job/target responses reconcile exact identities without duplicate admission", () => { const f = authorityFixture(); try { const receipt = release(f, f.sealed, "release:lost"), evaluatorEvidence = verifyRoleEvidenceV4(f.evidence.evaluator, f.roleBinding, "evaluator", f.scope), writerEvidence = verifyRoleEvidenceV4(f.evidence.writer, f.roleBinding, "writer", f.scope); let issued: AuthorityEvaluationJob | undefined; expect(() => f.controller.issueEvaluationJob({ key: f.b.key, manifest: f.sealed, custody_release_receipt: receipt, binding: f.roleBinding, operation_id: "job:lost" }, () => { issued = f.authority.issueEvaluationJob({ custody_release_receipt: receipt, manifest: f.sealed, evaluator: evaluatorEvidence, writer: writerEvidence, role_evidence_sha256: f.roleEvidenceSha, workflow_instruction_id: "instruction:release:lost", workflow_instruction_sha256: sha("lost"), commit_lifetime_ms: 30_000 }); throw new Error("job response lost"); })).toThrow("job response lost"); expect(f.controller.state(f.b.key).state).toBe("RECOVERY_REQUIRED"); f.controller.reconcileEvaluationJob("job:lost", issued!); commit(f, issued!); const verifierEvidence = verifyRoleEvidenceV4(f.evidence.verifier, f.roleBinding, "verifier", f.scope); let target: string | undefined; expect(() => f.controller.assignExpectedTarget({ key: f.b.key, evaluation_job_id: issued!.descriptor.evaluation_job_id, verifier_binding: f.roleBinding, operation_id: "target:lost" }, () => { target = f.authority.assignExpectedEvaluationTarget({ verifier: verifierEvidence, evaluation_job_id: issued!.descriptor.evaluation_job_id, purpose: "VERIFY_EXPECTED" }); throw new Error("target response lost"); })).toThrow("target response lost"); expect(f.controller.state(f.b.key).state).toBe("RECOVERY_REQUIRED"); f.controller.reconcileExpectedTarget("target:lost", target!, f.roleBinding); expect(f.controller.publishCurrentTarget(f.b.key, target!, () => "current")).toBe("current"); const db = new Database(f.authorityPath, { readonly: true }); expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM evaluation_jobs").get()!.n).toBe(1); expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM expected_evaluation_targets").get()!.n).toBe(1); db.close(); } finally { f.close(); } });

  test("N14 delayed producer effects keep replacement blocked until resolved", () => { const f = fixture(); try { const owner = active(f); f.controller.markLeaseLost(f.b.key, owner, "lease:lost"); expect(() => f.controller.replaceCustodian(f.b.key, subject("two"), { ...fence(f.b), producer_effects_resolved: false } as unknown as FenceProof, now(), "replace:unresolved")).toThrow("REPLACEMENT_NOT_PROVEN"); f.controller.replaceCustodian(f.b.key, subject("two"), fence(f.b), now(), "replace:resolved"); expect(f.controller.state(f.b.key).state).toBe("ACTIVE"); } finally { f.close(); } });

  test("N15 test host exposes only guarded routes and no raw authority/store handle", () => { const f = fixture(); try { const host = new PreCustodyControlHost(f.controller); expect(Object.getOwnPropertyNames(host)).toEqual([]); host.reserveRun(f.b, "reserve:host"); host.admitCustodian(f.b.key, subject(), now(), "admit:host"); expect((host as unknown as Record<string, unknown>).controller).toBeUndefined(); expect(f.controller.state(f.b.key).state).toBe("ACTIVE"); } finally { f.close(); } });

  test("N16 foreign scope and caller health claims cannot establish custody", () => { const f = fixture(); try { active(f); const foreign = manifest(binding({ key: { ...f.b.key, account_id: "acct:foreign" } })); expect(() => f.controller.closeManifest(f.b.key, subject(), foreign, "close:foreign")).toThrow("MANIFEST_BINDING_MISMATCH"); expect(() => f.controller.closeManifest(f.b.key, subject(), { ...manifest(f.b), healthy: true, current_manifest: true } as unknown as CatfoodSealedInputManifestV1, "close:claims")).toThrow(); } finally { f.close(); } });

  test("N17 safety remains available after positive authority is quarantined", () => { const f = fixture(); try { closed(f); expect(() => f.controller.closeManifest(f.b.key, subject(), manifest(f.b, "b"), "incident:safety")).toThrow("CUSTODY_FORK_SUSPECTED"); expect(f.controller.runSafetyAction(f.b.key, "REVOKE", () => "revoked")).toBe("revoked"); expect(() => f.controller.admitCustodian(f.b.key, subject("two"), now(), "admit:after-incident")).toThrow("POSITIVE_ADMISSION_BLOCKED"); } finally { f.close(); } });

  test("N18 runtime and integrity are confined to the isolated TEST_ONLY adjunct", () => { const f = fixture(); try { expect(import.meta.dir.replaceAll("\\", "/")).toEndWith("pokemon-agents/pre-rehearsal/custody-control01"); expect(() => f.controller.reserveRun({ ...f.b, test_only: false } as unknown as RunBinding, "reserve:operational")).toThrow("RUN_BINDING_INVALID"); expect(f.dir.startsWith(tmpdir())).toBeTrue(); const integrity = JSON.parse(readFileSync(join(import.meta.dir, "integrity.json"), "utf8")) as { files: { path: string; sha256: string }[] }; for (const file of integrity.files) expect(sha(readFileSync(join(import.meta.dir, file.path)))).toBe(file.sha256); } finally { f.close(); } });
});
