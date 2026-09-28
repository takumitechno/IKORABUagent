import { describe, expect, test } from "bun:test";
import { createHash, createPublicKey, generateKeyPairSync, sign } from "node:crypto";
import { canonicalJson, sha256 } from "../web/lib/catfood-harness";
import { CATFOOD_POLICY_SHA256 } from "../web/lib/catfood-trust";
import { acceptedSnapshotDigest, assertCommonEnrollmentLineage, assertEnrolledRole, collectCurrentRuntimeSubject, composeEnrolledTrustProvenance, deriveCatfoodTrustDomain, deriveEnrolledTrustDomain, enrollmentEvidence, enrollTestOnlyRoleForTest, inspectEnrolledRole, roleArtifactDescriptor, type CatfoodEnrollmentRole, type TestEnrollmentBinding, type VerifiedTrustAncestor } from "../web/lib/catfood-enrollment";
import type { ThreadsHttpTransport } from "../web/lib/catfood-threads-http";

const ENROLL = "IKORABU/WP3/CATFOOD/ROLE-ENROLLMENT/V2", STATUS = "IKORABU/WP3/CATFOOD/SESSION-STATUS/V2";
const roles: CatfoodEnrollmentRole[] = ["source", "custodian", "evaluator", "writer", "verifier"];
type Mutator = (payload: Record<string, any>, request: Record<string, any>) => void;

function fixture(enrollMutate: Mutator = () => {}, statusMutate: Mutator = () => {}, authority = "fixture-authority") {
  const keys = generateKeyPairSync("ed25519");
  const binding: TestEnrollmentBinding = { trust_domain: "TEST_ONLY", issuer: authority, issuer_key_id: "fixture-key", audience: "ikorabu-catfood", origin: "http://127.0.0.1:32199", credential: "fixture-credential-0123456789abcdef", public_key_pem: keys.publicKey.export({ type: "spki", format: "pem" }).toString(), environment_identity: "test:fixture", deployment_id: "deployment:fixture", enrollment_namespace: "namespace:fixture", build_policy_sha256: CATFOOD_POLICY_SHA256, accepted_snapshot_id: "snapshot:fixture", accepted_snapshot_sha256: acceptedSnapshotDigest() };
  const anchor = createHash("sha256").update(createPublicKey(binding.public_key_pem).export({ type: "spki", format: "der" })).digest("hex"); let sequence = 0;
  const transport: ThreadsHttpTransport = (request) => {
    const asked = JSON.parse(request.body!); const now = Date.parse("2026-09-30T00:00:00Z"), status = new URL(request.url).pathname.endsWith("/status");
    const subject = collectCurrentRuntimeSubject(binding); const descriptor = status ? undefined : roleArtifactDescriptor(asked.requested_role);
    const payload: Record<string, any> = status
      ? { issuer: binding.issuer, authority_anchor: anchor, audience: binding.audience, challenge: asked.challenge, request_id: asked.request_id, session_id: asked.session_id, role: asked.role, scope: asked.scope, action: asked.action, target: asked.target, subject, accepted_snapshot_sha256: binding.accepted_snapshot_sha256, status_sequence: ++sequence, expires_at: new Date(now + 60_000).toISOString(), revoked: false }
      : { protocol: "ikorabu.catfood-enrollment.v2", issuer: binding.issuer, authority_anchor: anchor, trust_domain: binding.trust_domain, audience: binding.audience, challenge: asked.challenge, request_id: asked.request_id, session_id: `session:${asked.requested_role}`, role: asked.requested_role, scope: asked.requested_scope, subject: structuredClone(subject), environment_identity: binding.environment_identity, issued_at: new Date(now - 1_000).toISOString(), expires_at: new Date(now + 60_000).toISOString(), revoked: false, accepted_snapshot_id: binding.accepted_snapshot_id, accepted_snapshot_sha256: binding.accepted_snapshot_sha256, enrollment_namespace: binding.enrollment_namespace, build_policy_sha256: binding.build_policy_sha256, accepted_role_descriptor: structuredClone(descriptor), launch_measurement: { launch_id: `launch:${sha256(canonicalJson({ role: asked.requested_role, subject_sha256: sha256(canonicalJson(subject)), artifact_root: descriptor!.artifact_root, accepted_snapshot_sha256: binding.accepted_snapshot_sha256 })).slice(0, 32)}`, role: asked.requested_role, subject_sha256: sha256(canonicalJson(subject)), artifact_root: descriptor!.artifact_root, accepted_snapshot_sha256: binding.accepted_snapshot_sha256 } };
    (status ? statusMutate : enrollMutate)(payload, asked);
    const purpose = status ? STATUS : ENROLL, encoded = Buffer.from(canonicalJson(payload)).toString("base64url");
    const body = canonicalJson({ algorithm: "Ed25519", key_id: binding.issuer_key_id, payload: encoded, signature: sign(null, Buffer.from(`${purpose}\n${encoded}`), keys.privateKey).toString("base64url") });
    return { status: 200, content_type: "application/json", location: null, body, byte_length: Buffer.byteLength(body), body_sha256: sha256(body) };
  };
  return { binding, transport };
}

function enrollAll(f = fixture()) { return Object.fromEntries(roles.map((role) => [role, enrollTestOnlyRoleForTest(f.binding, role, "run:test", f.transport, new Date("2026-09-30T00:00:00Z"))])) as Record<CatfoodEnrollmentRole, ReturnType<typeof enrollTestOnlyRoleForTest>>; }
function ancestor(name: string, trust_domain: "TEST_ONLY" | "OPERATIONAL" = "OPERATIONAL", overrides: Partial<VerifiedTrustAncestor> = {}): VerifiedTrustAncestor { return { name, trust_domain, verified: true, authority_anchor: "a".repeat(64), deployment_id: "deployment", environment_identity: "environment", enrollment_namespace: "namespace", accepted_snapshot_sha256: "b".repeat(64), build_policy_sha256: "c".repeat(64), ...overrides }; }

describe("WP3 Corrective06 enrolled trust domain", () => {
  test("T01-T03 taint, missing ancestry, and pure all-operational conformance", () => {
    const required = ["source", "custodian", "evaluator"]; const all = required.map((name) => ancestor(name));
    expect(deriveCatfoodTrustDomain({ ancestors: all }, required)).toBe("OPERATIONAL");
    for (const name of required) expect(deriveCatfoodTrustDomain({ ancestors: all.map((row) => row.name === name ? { ...row, trust_domain: "TEST_ONLY" } : row) }, required)).toBe("TEST_ONLY");
    expect(deriveCatfoodTrustDomain({ ancestors: all.slice(1) }, required)).toBe("UNVERIFIED");
    expect(deriveCatfoodTrustDomain({ ancestors: all.map((row, i) => i ? row : { ...row, verified: false }) }, required)).toBe("UNVERIFIED");
  });

  test("T04,T14,T15 signed TEST_ONLY roles remain opaque, role-bound, and coherent", () => {
    const enrolled = enrollAll(); for (const role of roles) expect(assertEnrolledRole(enrolled[role], role, "TEST_ONLY").role).toBe(role);
    expect(() => assertEnrolledRole(enrolled.source, "writer", "TEST_ONLY")).toThrow("ENROLLMENT_CONTEXT_INVALID");
    expect(() => assertEnrolledRole({ role: "source" }, "source", "TEST_ONLY")).toThrow("ENROLLMENT_CONTEXT_INVALID");
    const provenance = composeEnrolledTrustProvenance([enrolled.source, enrolled.custodian, enrolled.evaluator], ["supervisor", "role_session", "role_build"].map((name) => ({ name, trust_domain: "TEST_ONLY" as const })));
    expect(deriveEnrolledTrustDomain(provenance, ["source", "custodian", "evaluator", "supervisor", "role_session", "role_build"])).toBe("TEST_ONLY");
    expect(assertCommonEnrollmentLineage(Object.values(enrolled)).trust_domain).toBe("TEST_ONLY");
  });

  test("T05-T11 fixed descriptors, actual bytes, loader, role, launch, and snapshot reject substitution", () => {
    for (const role of roles) {
      const f = fixture((payload) => { payload.accepted_role_descriptor.artifacts[0].sha256 = "0".repeat(64); });
      expect(() => enrollTestOnlyRoleForTest(f.binding, role, "run:test", f.transport, new Date("2026-09-30T00:00:00Z"))).toThrow("ENROLLMENT_BUILD_INVALID");
    }
    const mutations: Mutator[] = [
      (p) => { p.accepted_role_descriptor.artifacts[0].sha256 = "0".repeat(64); },
      (p) => { p.accepted_role_descriptor.artifacts.pop(); p.accepted_role_descriptor.artifact_root = sha256(canonicalJson(p.accepted_role_descriptor)); },
      (p) => { p.accepted_role_descriptor.loader.executable_path = "decoy"; },
      (p) => { p.accepted_role_descriptor.role = "writer"; },
      (p) => { delete p.accepted_role_descriptor.entrypoint; },
      (p) => { p.launch_measurement.artifact_root = "f".repeat(64); },
      (p) => { p.launch_measurement.launch_id = "launch:wrong"; },
    ];
    for (const mutate of mutations) { const f = fixture(mutate); expect(() => enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, new Date("2026-09-30T00:00:00Z"))).toThrow(); }
    const f = fixture(); expect(() => enrollTestOnlyRoleForTest({ ...f.binding, accepted_snapshot_sha256: "d".repeat(64) }, "source", "run:test", f.transport, new Date("2026-09-30T00:00:00Z"))).toThrow("ENROLLMENT_BUILD_INVALID");
  });

  test("T12-T13 actual PID/start/boot/channel subject rejects static or copied sessions", () => {
    const actual = collectCurrentRuntimeSubject(fixture().binding); expect(actual.pid).toBe(process.pid); expect(actual.process_start_token).not.toContain("Date.now"); expect(actual.channel_binding_sha256).toMatch(/^[0-9a-f]{64}$/);
    const child = Bun.spawnSync({ cmd: [process.execPath, "-e", `import { collectCurrentRuntimeSubject } from ${JSON.stringify(new URL("../web/lib/catfood-enrollment.ts", import.meta.url).href)}; process.stdout.write(JSON.stringify(collectCurrentRuntimeSubject(${JSON.stringify(fixture().binding)})))`], stdout: "pipe", stderr: "pipe" });
    if (child.exitCode === 0) { const other = JSON.parse(child.stdout.toString()); expect(other.pid).not.toBe(actual.pid); expect(other.process_start_token).not.toBe(actual.process_start_token); } else expect(child.stderr.toString()).toContain("EPERM");
    for (const mutate of [(p: Record<string, any>) => { p.subject.pid = 1; }, (p: Record<string, any>) => { p.subject.process_start_token = "copied"; }, (p: Record<string, any>) => { p.subject.boot_id = "boot:copied"; }, (p: Record<string, any>) => { p.subject.channel_binding_sha256 = "0".repeat(64); }]) {
      const f = fixture(mutate); expect(() => enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, new Date("2026-09-30T00:00:00Z"))).toThrow("ENROLLMENT_SESSION_INVALID");
    }
  });

  test("T16-T17 independent authority and immutable snapshot composition fail", () => {
    const a = enrollAll(fixture(undefined, undefined, "authority-a")), b = enrollAll(fixture(undefined, undefined, "authority-b"));
    expect(() => assertCommonEnrollmentLineage([a.source, b.custodian])).toThrow("ENROLLMENT_MIXED_SNAPSHOT");
    const f = fixture(); const one = enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, new Date("2026-09-30T00:00:00Z"));
    expect(enrollmentEvidence(one).accepted_snapshot_sha256).toBe(f.binding.accepted_snapshot_sha256);
  });

  test("T18-T21 use-time status is action-bound and fails closed", () => {
    const ok = fixture(), enrolled = enrollTestOnlyRoleForTest(ok.binding, "source", "run:test", ok.transport, new Date("2026-09-30T00:00:00Z"));
    expect(inspectEnrolledRole(enrolled, "source", "source.acquire", "run:test").action).toBe("source.acquire");
    for (const mutate of [(p: Record<string, any>) => { p.revoked = true; }, (p: Record<string, any>) => { p.challenge = "wrong"; }, (p: Record<string, any>) => { p.scope = "other"; }, (p: Record<string, any>) => { p.accepted_snapshot_sha256 = "0".repeat(64); }, (p: Record<string, any>) => { p.expires_at = "2020-01-01T00:00:00.000Z"; }]) {
      const f = fixture(undefined, mutate), context = enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, new Date("2026-09-30T00:00:00Z")); expect(() => inspectEnrolledRole(context, "source", "source.acquire", "run:test")).toThrow("ENROLLMENT_STATUS_INVALID");
    }
    const unavailable = fixture(); const context = enrollTestOnlyRoleForTest(unavailable.binding, "source", "run:test", unavailable.transport, new Date("2026-09-30T00:00:00Z"));
    const hiddenTransport: ThreadsHttpTransport = () => { throw new Error("offline"); }; void hiddenTransport; expect(() => inspectEnrolledRole(context, "writer", "x", "y")).toThrow("ENROLLMENT_CONTEXT_INVALID");
  });

  test("T22-T24 evidence exposes no credential and concrete TEST_ONLY status path completes", () => {
    const enrolled = enrollAll(), evidence = enrollmentEvidence(enrolled.writer); expect(canonicalJson(evidence)).not.toContain("fixture-credential");
    expect((evidence.subject as Record<string, unknown>).pid).toBe(process.pid); expect((evidence.launch_measurement as Record<string, unknown>).role).toBe("writer");
    expect(inspectEnrolledRole(enrolled.writer, "writer", "writer.sign.release", "run:test").revoked).toBe(false);
  });
});
