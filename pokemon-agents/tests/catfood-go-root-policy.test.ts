import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { generateKeyPairSync, sign } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonicalJson, sha256 } from "../web/lib/catfood-harness";
import { CATFOOD_THREADS_PINS } from "../web/lib/catfood-coe";
import {
  CATFOOD_GO_VERIFICATION_PROFILE_ID, CATFOOD_SEALED_INPUT_SCHEMA, CATFOOD_FINAL_CLOSURE_CHARTER,
  assertGoRootPolicyUse, assertManifestGoRootPolicy, buildGoVerificationProfile, goPublicKeyFingerprint, goRootPolicyRef,
  type CatfoodGoRootPolicyV1, type CatfoodSealedInputManifestV1,
} from "../web/lib/catfood-final-closure";
import { resolveBindingGoRootPolicy, type RoleChannelBinding, type RoleRunScope } from "../web/lib/catfood-role-channel";
import { roleChannelAcceptedSnapshotDigest } from "../web/lib/catfood-enrollment";
import { CATFOOD_CAPABILITIES, CATFOOD_GO_SCHEMA, CATFOOD_POLICY_SHA256, CATFOOD_TRUST_SCHEMA, IndependentCatfoodEvaluator, ProtectedCatfoodCustodian, createCatfoodRunSpec, initializeProtectedCatfoodStores, type CatfoodTrustConfig, type HumanGoPayload } from "../web/lib/catfood-trust";
import { FixtureThreadsSource, TestClock } from "./catfood-trust-fixture";
import { testGoRootPolicy } from "./catfood-go-root-policy-fixture";

const BOUNDARY = "57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf";
const scope: RoleRunScope = { environment_type: "test", environment_instance_id: "instance:test", deployment_id: "deployment:test", organization_id: "org:test", tenant_id: "org:test", account_id: "acct_test", run_id: "run:go-root", spec_sha256: "4".repeat(64) };
const now = "2026-09-30T00:00:00.000Z";
const later = "2026-10-02T00:00:00.000Z";
const pem = (key: ReturnType<typeof generateKeyPairSync>["publicKey"]) => key.export({ type: "spki", format: "pem" }).toString();

function trust(publicKey: string): CatfoodTrustConfig {
  return { schema: CATFOOD_TRUST_SCHEMA, custodian_identity: "custodian:test", environment_type: "test", environment_instance_id: scope.environment_instance_id, organization_id: scope.organization_id, tenant_id: scope.tenant_id, account_id: scope.account_id, ikorabu_release_sha: "c".repeat(40), threads_sha: CATFOOD_THREADS_PINS.threads_sha, operational_boundary_sha256: BOUNDARY, threads_release_sha256: CATFOOD_THREADS_PINS.release_sha256, wp1_sha256: CATFOOD_THREADS_PINS.wp1_sha256, coe_sha256: CATFOOD_THREADS_PINS.coe_sha256, rehearsal_attestation_sha256: CATFOOD_THREADS_PINS.rehearsal_attestation_sha256, emitter_inventory_sha256: CATFOOD_THREADS_PINS.emitter_inventory_sha256, threads_schema: 33, threads_schema_fingerprint: CATFOOD_THREADS_PINS.schema_fingerprint, source_mode: "TEST_ONLY", go_keys: [{ key_id: "go:test", public_key_pem: publicKey, trust_class: "TEST_ONLY" }] };
}

function fixturePolicy(authorityPublicKey: string, keys: readonly Readonly<{ key_id: string; public_key_pem: string }>[], overrides: Partial<Parameters<typeof testGoRootPolicy>[0]> = {}) {
  return testGoRootPolicy({ authority_identity: "fixture-role-authority", authority_public_key_pem: authorityPublicKey, enrollment_namespace: "fixture:role-channel", scope, public_keys: keys, not_before: "2026-09-29T00:00:00.000Z", not_after: "2026-10-03T00:00:00.000Z", acceptance_policy_sha256: CATFOOD_POLICY_SHA256, ...overrides });
}

function binding(authorityPublicKey: string, policies: readonly CatfoodGoRootPolicyV1[], selection: ReturnType<typeof testGoRootPolicy>["selection"]): RoleChannelBinding {
  return { trust_domain: "TEST_ONLY", issuer: "fixture-role-authority", issuer_key_id: "authority:v4", audience: "ikorabu-catfood", origin: "http://127.0.0.1:32199", credential: "fixture-coarse-service-access-credential", authority_public_key_pem: authorityPublicKey, enrollment_namespace: "fixture:role-channel", build_policy_sha256: CATFOOD_POLICY_SHA256, accepted_snapshot_id: "snapshot:role-channel", accepted_snapshot_sha256: roleChannelAcceptedSnapshotDigest(), policy: { policy_id: "fixture-policy-v1", session_lifetime_ms: 60_000, registration_challenge_lifetime_ms: 5_000, action_challenge_lifetime_ms: 5_000, maximum_outstanding_requests: 16, receipt_retention_ms: 86_400_000, go_root_policy_documents: policies, go_root_workload_selections: [selection] } };
}

function manifest(policy: CatfoodGoRootPolicyV1): CatfoodSealedInputManifestV1 {
  const profile = policy.verification_profile, snapshot = { format: "sqlite3-standalone.v1" as const, byte_length: 4096, raw_sha256: "1".repeat(64), logical_schema_sha256: "2".repeat(64) };
  return { schema: CATFOOD_SEALED_INPUT_SCHEMA, charter: CATFOOD_FINAL_CLOSURE_CHARTER, manifest_id: "manifest:go-root", scope, window: { start: now, end: "2026-10-01T00:00:00.000Z" }, closure: { closed_source_event_id: "event:closed", run_closed_event_id: "event:run-closed", lifecycle: "CLOSED" }, journal: { high_water: 1, head_sha256: "3".repeat(64) }, checkpoint: { checkpoint_id: "checkpoint:go-root", checkpoint_sha256: "4".repeat(64), pins_sha256: "5".repeat(64) }, retained_source: { archive_sha256: "6".repeat(64), source_digest: "7".repeat(64), producer_identity: "threads:producer" }, go: { artifact_sha256: "8".repeat(64), verification_profile_id: profile.profile_id, verification_profile_sha256: sha256(canonicalJson(profile)), root_fingerprints: profile.keys.map((key) => key.public_key_sha256) }, fixed: { dependencies_sha256: "9".repeat(64), policy_sha256: CATFOOD_POLICY_SHA256, kernel_sha256: "a".repeat(64) }, trust: { environment_provenance_sha256: "b".repeat(64), clock_provenance_sha256: "c".repeat(64), acquisition_provenance_sha256: "d".repeat(64), test_only: true }, expected_bundle_sha256: "e".repeat(64), pair_common_cut_sha256: "f".repeat(64), control: snapshot, checkpoint_store: snapshot };
}

describe("WP3 B2 independent GO-root policy G01-G26", () => {
  test("G01/G03/G04/G05 same ID cannot substitute key material and canonical SPKI/profile rules fail closed", () => {
    const authority = generateKeyPairSync("ed25519"), a = generateKeyPairSync("ed25519"), b = generateKeyPairSync("ed25519"), aPem = pem(a.publicKey), bPem = pem(b.publicKey), fixed = fixturePolicy(pem(authority.publicKey), [{ key_id: "go:test", public_key_pem: aPem }]);
    expect(goPublicKeyFingerprint(aPem.replace(/\n/g, "\r\n"))).toBe(goPublicKeyFingerprint(aPem));
    expect(() => goPublicKeyFingerprint(a.privateKey.export({ type: "pkcs8", format: "pem" }).toString())).toThrow("GO_ROOT_KEY_INVALID");
    expect(() => goPublicKeyFingerprint(pem(generateKeyPairSync("rsa", { modulusLength: 2048 }).publicKey))).toThrow("GO_ROOT_KEY_INVALID");
    expect(assertGoRootPolicyUse({ policy: fixed.policy, trust_domain: "TEST_ONLY", scope: fixed.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "NEW_GO", actual_keys: trust(aPem).go_keys }).profile.profile_id).toBe(CATFOOD_GO_VERIFICATION_PROFILE_ID);
    expect(() => assertGoRootPolicyUse({ policy: fixed.policy, trust_domain: "TEST_ONLY", scope: fixed.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "NEW_GO", actual_keys: trust(bPem).go_keys })).toThrow("GO_ROOT_PROFILE_MISMATCH");
    expect(() => buildGoVerificationProfile([{ key_id: "go:test", public_key_pem: aPem }, { key_id: "go:test", public_key_pem: bPem }])).toThrow("GO_ROOT_PROFILE_INVALID");
  });

  test("G02 offline key swap plus recomputed local hash cannot reopen against fixed independent policy", () => {
    const dir = mkdtempSync(join(tmpdir(), "catfood-go-root-swap-")), control = join(dir, "control.db"), checkpoint = join(dir, "checkpoint.db"), authority = generateKeyPairSync("ed25519"), a = generateKeyPairSync("ed25519"), b = generateKeyPairSync("ed25519"), aPem = pem(a.publicKey), fixed = fixturePolicy(pem(authority.publicKey), [{ key_id: "go:test", public_key_pem: aPem }]); writeFileSync(control, ""); writeFileSync(checkpoint, "");
    try {
      initializeProtectedCatfoodStores(control, checkpoint, trust(aPem), now, undefined, fixed.policy);
      const clock = new TestClock(Date.parse(now)), source = new FixtureThreadsSource(clock, CATFOOD_THREADS_PINS.threads_sha, CATFOOD_THREADS_PINS.release_sha256), spec = createCatfoodRunSpec({ run_id: scope.run_id, environment_type: scope.environment_type, environment_instance_id: scope.environment_instance_id, organization_id: scope.organization_id, tenant_id: scope.tenant_id, account_id: scope.account_id, capabilities: CATFOOD_CAPABILITIES, effective_config_sha256: "4".repeat(64), ikorabu_release_sha: "c".repeat(40), threads_sha: CATFOOD_THREADS_PINS.threads_sha, operational_boundary_sha256: BOUNDARY, threads_release_sha256: CATFOOD_THREADS_PINS.release_sha256, wp1_sha256: CATFOOD_THREADS_PINS.wp1_sha256, coe_sha256: CATFOOD_THREADS_PINS.coe_sha256, rehearsal_attestation_sha256: CATFOOD_THREADS_PINS.rehearsal_attestation_sha256, emitter_inventory_sha256: CATFOOD_THREADS_PINS.emitter_inventory_sha256, threads_schema: 33, threads_schema_fingerprint: CATFOOD_THREADS_PINS.schema_fingerprint, requested_window_start: "2026-09-30T00:00:00Z", requested_window_end: "2026-10-01T00:00:00Z" }), payload: HumanGoPayload = { schema: CATFOOD_GO_SCHEMA, grant_id: "grant:go-root", nonce: "nonce:go-root", run_id: spec.run_id, spec_hash: spec.spec_sha256, environment_type: spec.environment_type, environment_instance_id: spec.environment_instance_id, organization_id: spec.organization_id, tenant_id: spec.tenant_id, account_id: spec.account_id, capabilities: CATFOOD_CAPABILITIES, valid_from: "2026-09-29T23:59:59.000Z", valid_until: "2026-10-01T01:00:00.000Z", maximum_duration_seconds: 86_400, maximum_wp3_epoch: 2, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, threads_sha: spec.threads_sha, operational_boundary_sha256: spec.operational_boundary_sha256, threads_release_sha256: spec.threads_release_sha256, threads_schema: spec.threads_schema, ikorabu_release_sha: spec.ikorabu_release_sha, paid_provider_allowance: "ZERO" }, bytes = Buffer.from(canonicalJson(payload)), artifact = canonicalJson({ algorithm: "Ed25519", key_id: "go:test", payload: bytes.toString("base64url"), signature: sign(null, bytes, a.privateKey).toString("base64url") }), original = new ProtectedCatfoodCustodian(control, checkpoint, source, clock, undefined, fixed.policy); original.createRun(spec, artifact); original.close();
      const db = new Database(control), trigger = db.query<{ sql: string }, []>("SELECT sql FROM sqlite_master WHERE type='trigger' AND name='catfood_meta_no_update'").get()!.sql, changed = trust(pem(b.publicKey)), raw = canonicalJson(changed); db.exec("DROP TRIGGER catfood_meta_no_update"); db.query("UPDATE catfood_trust_meta SET trust_config_json=?,trust_config_sha256=? WHERE singleton=1").run(raw, sha256(raw)); db.exec(trigger); db.close();
      expect(() => new ProtectedCatfoodCustodian(control, checkpoint, source, clock, undefined, fixed.policy)).toThrow("GO_ROOT_PROFILE_MISMATCH"); const evaluator = new IndependentCatfoodEvaluator(control, checkpoint, undefined, undefined, undefined, fixed.policy); try { expect(evaluator.evaluate(spec.run_id).reason_codes).toContain("GO_ROOT_PROFILE_MISMATCH"); } finally { evaluator.close(); }
    } finally { rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); }
  });

  test("G06-G09/G18/G20-G25 scope, completeness, rotation, history, applicability and non-promotion are independently selected", () => {
    const authority = generateKeyPairSync("ed25519"), a = generateKeyPairSync("ed25519"), b = generateKeyPairSync("ed25519"), c = generateKeyPairSync("ed25519"), authorityPem = pem(authority.publicKey), aPem = pem(a.publicKey), bPem = pem(b.publicKey), fixed = fixturePolicy(authorityPem, [{ key_id: "go:a", public_key_pem: aPem }, { key_id: "go:b", public_key_pem: bPem }]), actual = [{ key_id: "go:a", public_key_pem: aPem, trust_class: "TEST_ONLY" as const }, { key_id: "go:b", public_key_pem: bPem, trust_class: "TEST_ONLY" as const }];
    expect(assertGoRootPolicyUse({ policy: fixed.policy, trust_domain: "TEST_ONLY", scope: fixed.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "NEW_GO", actual_keys: actual }).ref).toEqual(fixed.ref);
    expect(() => assertGoRootPolicyUse({ policy: fixed.policy, trust_domain: "TEST_ONLY", scope: { ...fixed.policy.scope, tenant_id: "tenant:other" }, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "NEW_GO", actual_keys: actual })).toThrow("GO_ROOT_POLICY_SCOPE_MISMATCH");
    expect(() => assertGoRootPolicyUse({ policy: fixed.policy, trust_domain: "OPERATIONAL", scope: fixed.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "NEW_GO", actual_keys: actual })).toThrow("GO_ROOT_POLICY_SCOPE_MISMATCH");
    for (const keys of [actual.slice(0, 1), [...actual, { key_id: "go:c", public_key_pem: pem(c.publicKey), trust_class: "TEST_ONLY" as const }]]) expect(() => assertGoRootPolicyUse({ policy: fixed.policy, trust_domain: "TEST_ONLY", scope: fixed.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "NEW_GO", actual_keys: keys })).toThrow("GO_ROOT_PROFILE_MISMATCH");
    const historical = fixturePolicy(authorityPem, [{ key_id: "go:a", public_key_pem: aPem }], { policy_id: "historical", policy_version: 1, allow_new_go: false }), historicalBinding = binding(authorityPem, [historical.policy], historical.selection); expect(resolveBindingGoRootPolicy(historicalBinding, scope, "HISTORICAL", historical.ref).ref).toEqual(historical.ref); expect(() => assertGoRootPolicyUse({ policy: historical.policy, trust_domain: "TEST_ONLY", scope: historical.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "NEW_GO", actual_keys: trust(aPem).go_keys })).toThrow("GO_ROOT_POLICY_NOT_APPLICABLE");
    const revoked = fixturePolicy(authorityPem, [{ key_id: "go:a", public_key_pem: aPem }], { revoked_at: now }); expect(() => assertGoRootPolicyUse({ policy: revoked.policy, trust_domain: "TEST_ONLY", scope: revoked.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: now, use: "HISTORICAL", actual_keys: trust(aPem).go_keys })).toThrow("GO_ROOT_POLICY_NOT_APPLICABLE");
    expect(() => assertGoRootPolicyUse({ policy: fixed.policy, trust_domain: "TEST_ONLY", scope: fixed.policy.scope, acceptance_policy_sha256: CATFOOD_POLICY_SHA256, at: later, use: "HISTORICAL", actual_keys: actual })).not.toThrow();
    const altered = { ...fixed.policy, applicability: { ...fixed.policy.applicability, not_after: "2026-10-04T00:00:00.000Z" } }; expect(() => resolveBindingGoRootPolicy(binding(authorityPem, [altered], fixed.selection), scope, "CURRENT")).toThrow("GO_ROOT_WORKLOAD_SELECTION_INVALID");
    expect(() => resolveBindingGoRootPolicy(binding(authorityPem, [], fixed.selection), scope, "HISTORICAL", fixed.ref)).toThrow();
  });

  test("G10-G16/G26 M and transported references cannot grant or split independent policy authority", () => {
    const authority = generateKeyPairSync("ed25519"), a = generateKeyPairSync("ed25519"), b = generateKeyPairSync("ed25519"), authorityPem = pem(authority.publicKey), permitted = fixturePolicy(authorityPem, [{ key_id: "go:test", public_key_pem: pem(a.publicKey) }]), hostile = fixturePolicy(authorityPem, [{ key_id: "go:test", public_key_pem: pem(b.publicKey) }], { policy_id: "hostile" }), permittedManifest = manifest(permitted.policy), hostileManifest = manifest(hostile.policy), protectedBinding = binding(authorityPem, [permitted.policy], permitted.selection);
    expect(() => assertManifestGoRootPolicy({ policy: permitted.policy, expected_ref: permitted.ref, manifest: permittedManifest, trust_domain: "TEST_ONLY" })).not.toThrow();
    expect(() => assertManifestGoRootPolicy({ policy: permitted.policy, expected_ref: permitted.ref, manifest: hostileManifest, trust_domain: "TEST_ONLY" })).toThrow("GO_ROOT_PROFILE_MISMATCH");
    expect(() => assertManifestGoRootPolicy({ policy: permitted.policy, expected_ref: hostile.ref, manifest: permittedManifest, trust_domain: "TEST_ONLY" })).toThrow("GO_ROOT_POLICY_REF_MISMATCH");
    expect(() => resolveBindingGoRootPolicy(protectedBinding, scope, "HISTORICAL", hostile.ref)).toThrow("GO_ROOT_POLICY_UNAVAILABLE");
    expect(goRootPolicyRef(permitted.policy)).toEqual(permitted.ref);
  });
});
