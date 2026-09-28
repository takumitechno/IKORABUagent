import { describe, expect, test } from "bun:test";
import { generateKeyPairSync, sign } from "node:crypto";
import { canonicalJson, sha256 } from "../web/lib/catfood-harness";
import { CATFOOD_POLICY_SHA256 } from "../web/lib/catfood-trust";
import { assertEnrolledRole, enrollTestOnlyRoleForTest, type CatfoodEnrollmentRole, type TestEnrollmentBinding } from "../web/lib/catfood-enrollment";
import { OperationalThreadsEvidenceSource, type ThreadsHttpTransport, type ThreadsSourceContext } from "../web/lib/catfood-threads-http";

const PURPOSE = "IKORABU/WP3/CATFOOD/ROLE-ENROLLMENT/V1";
const roles: CatfoodEnrollmentRole[] = ["source", "custodian", "evaluator", "writer", "verifier"];

function fixture(mutate: (payload: Record<string, unknown>) => void = () => {}) {
  const keys = generateKeyPairSync("ed25519"), accepted = "a".repeat(64);
  const binding: TestEnrollmentBinding = { trust_domain: "TEST_ONLY", issuer: "fixture-authority", issuer_key_id: "fixture-key", audience: "ikorabu-catfood", origin: "http://127.0.0.1:32199", credential: "fixture-credential-0123456789abcdef", public_key_pem: keys.publicKey.export({ type: "spki", format: "pem" }).toString(), environment_identity: "test:fixture", session_id: "session:fixture", principal_id: "principal:fixture", process_id: "process:fixture", process_started_at: "2026-09-30T00:00:00Z", boot_id: "boot:fixture", deployment_id: "deployment:fixture", accepted_manifest_sha256: accepted };
  const transport = ((request) => {
    const asked = JSON.parse(request.body!); const now = Date.parse("2026-09-30T00:00:00Z");
    const payload: Record<string, unknown> = { protocol: "ikorabu.catfood-enrollment.v1", issuer: binding.issuer, enrollment_revision: 7, trust_domain: binding.trust_domain, audience: binding.audience, challenge: asked.challenge, request_id: asked.request_id, session_id: binding.session_id, principal_id: binding.principal_id, process_id: binding.process_id, process_started_at: binding.process_started_at, boot_id: binding.boot_id, deployment_id: binding.deployment_id, environment_identity: binding.environment_identity, role: asked.requested_role, scope: asked.requested_scope, issued_at: new Date(now - 1_000).toISOString(), expires_at: new Date(now + 60_000).toISOString(), revoked: false, launch_measurement_id: "launch:fixture", accepted_build_snapshot_id: "snapshot:fixture", accepted_build_snapshot_sha256: accepted, role_builds: roles.map((role) => ({ role, accepted_sha256: accepted, measured_sha256: accepted })), policy_sha256: CATFOOD_POLICY_SHA256, source_identity: "source:fixture" }; mutate(payload);
    const encoded = Buffer.from(canonicalJson(payload)).toString("base64url"); const envelope = canonicalJson({ algorithm: "Ed25519", key_id: binding.issuer_key_id, payload: encoded, signature: sign(null, Buffer.from(`${PURPOSE}\n${encoded}`), keys.privateKey).toString("base64url") });
    return { status: 200, content_type: "application/json", location: null, body: envelope, byte_length: Buffer.byteLength(envelope), body_sha256: sha256(envelope) };
  }) satisfies ThreadsHttpTransport;
  return { binding, transport };
}

describe("WP3 corrective05 concrete enrollment integration", () => {
  test("valid TEST_ONLY signed snapshot enrolls every explicit role and remains opaque", () => {
    const { binding, transport } = fixture();
    const enrolled = Object.fromEntries(roles.map((role) => [role, enrollTestOnlyRoleForTest(binding, role, "run:test", transport, new Date("2026-09-30T00:00:00Z"))])) as Record<CatfoodEnrollmentRole, ReturnType<typeof enrollTestOnlyRoleForTest>>;
    for (const role of roles) expect(assertEnrolledRole(enrolled[role], role, "TEST_ONLY").role).toBe(role);
    const context: ThreadsSourceContext = { source_identity: "source:fixture", origin: "http://127.0.0.1:32200", bridge_api_key: "threads-fixture-credential-0123456789", tenant_user_id: "tenant:test", principal_ref: "principal:fixture", credential_version_ref: "credential:v1", source_build_sha256: binding.accepted_manifest_sha256, protected_probe: { probe_id: "probe:test", foreign_account_id: "acct_foreign" }, principal_binding: { actor: "principal:fixture", organization_id: "org:test", account_id: "acct_test" }, runtime_prohibitions: { writer_enabled: false, paid_generation_enabled: false }, intents: [] };
    const source = OperationalThreadsEvidenceSource.enrolledTestOnly(context, () => { throw new Error("not called"); }, () => new Date("2026-09-30T00:00:00Z"), enrolled.source);
    expect(source.mode).toBe("TEST_ONLY"); expect(source.evidence_trust).toBe("TEST_ONLY");
    expect(() => OperationalThreadsEvidenceSource.enrolledTestOnly(context, () => { throw new Error("not called"); }, () => new Date(), enrolled.custodian)).toThrow("ENROLLMENT_CONTEXT_INVALID");
    expect(() => assertEnrolledRole(Object.freeze({ role: "source" }), "source", "TEST_ONLY")).toThrow("ENROLLMENT_CONTEXT_INVALID");
  });

  test("wrong signature, replayed response, role reuse, expiry, and non-loopback test binding fail closed", () => {
    const { binding, transport } = fixture(); const good = enrollTestOnlyRoleForTest(binding, "source", "run:test", transport, new Date("2026-09-30T00:00:00Z"));
    expect(() => assertEnrolledRole(good, "custodian", "TEST_ONLY")).toThrow("ENROLLMENT_CONTEXT_INVALID");
    let saved: ReturnType<ThreadsHttpTransport> | undefined; const replay: ThreadsHttpTransport = (request) => saved ??= transport(request);
    enrollTestOnlyRoleForTest(binding, "source", "run:test", replay, new Date("2026-09-30T00:00:00Z"));
    expect(() => enrollTestOnlyRoleForTest(binding, "source", "run:test", replay, new Date("2026-09-30T00:00:00Z"))).toThrow("ENROLLMENT_SESSION_INVALID");
    expect(() => enrollTestOnlyRoleForTest(binding, "source", "run:test", transport, new Date("2026-09-30T00:02:00Z"))).toThrow("ENROLLMENT_SESSION_INVALID");
    expect(() => enrollTestOnlyRoleForTest({ ...binding, origin: "https://example.com" }, "source", "run:test", transport)).toThrow("ENROLLMENT_BINDING_INVALID");
    expect(() => enrollTestOnlyRoleForTest({ ...binding, public_key_pem: generateKeyPairSync("ed25519").publicKey.export({ type: "spki", format: "pem" }).toString() }, "source", "run:test", transport, new Date("2026-09-30T00:00:00Z"))).toThrow("ENROLLMENT_SIGNATURE_INVALID");
  });

  test("signed wrong issuer, audience, subject, role, environment, revocation, and role build fail closed", () => {
    for (const mutate of [
      (p: Record<string, unknown>) => { p.issuer = "other"; }, (p: Record<string, unknown>) => { p.audience = "other"; },
      (p: Record<string, unknown>) => { p.principal_id = "other"; }, (p: Record<string, unknown>) => { p.role = "writer"; },
      (p: Record<string, unknown>) => { p.environment_identity = "other"; }, (p: Record<string, unknown>) => { p.revoked = true; },
      (p: Record<string, unknown>) => { (p.role_builds as Record<string, unknown>[])[0]!.measured_sha256 = "b".repeat(64); },
    ]) { const { binding, transport } = fixture(mutate); expect(() => enrollTestOnlyRoleForTest(binding, "source", "run:test", transport, new Date("2026-09-30T00:00:00Z"))).toThrow(); }
    for (const role of roles) {
      const { binding, transport } = fixture((payload) => { const row = (payload.role_builds as Record<string, unknown>[]).find((candidate) => candidate.role === role)!; row.measured_sha256 = "b".repeat(64); });
      expect(() => enrollTestOnlyRoleForTest(binding, "source", "run:test", transport, new Date("2026-09-30T00:00:00Z"))).toThrow("ENROLLMENT_BUILD_INVALID");
    }
  });

  test("unavailable, malformed, redirect, encoding, and oversized responses fail closed", () => {
    const { binding } = fixture(); const now = new Date("2026-09-30T00:00:00Z");
    expect(() => enrollTestOnlyRoleForTest(binding, "source", "run:test", () => { throw new Error("offline"); }, now)).toThrow("ENROLLMENT_UNAVAILABLE");
    for (const response of [
      { status: 302, content_type: "application/json", location: "http://127.0.0.1/other", body: "{}" },
      { status: 200, content_type: "application/json", location: null, content_encoding: "gzip", body: "{}" },
      { status: 200, content_type: "application/json", location: null, body: "{" },
      { status: 200, content_type: "application/json", location: null, body: "x".repeat(256_001) },
    ]) expect(() => enrollTestOnlyRoleForTest(binding, "source", "run:test", () => response, now)).toThrow();
  });
});
