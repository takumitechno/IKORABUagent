import { describe, expect, test } from "bun:test";
import { createHash, createPublicKey, generateKeyPairSync, sign } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalJson, sha256 } from "../web/lib/catfood-harness";
import { CATFOOD_POLICY_SHA256 } from "../web/lib/catfood-trust";
import { acceptedSnapshotDigest, assertAuthorizedAction, assertCommonEnrollmentLineage, assertEnrolledRole, authorizeEnrolledAction, collectCurrentRuntimeSubject, composeEnrolledTrustProvenance, currentLaunchProfile, deriveCatfoodTrustDomain, deriveEnrolledTrustDomain, enrollmentEvidence, enrollTestOnlyRoleForTest, inspectEnrolledRole, observeTestOnlyLaunch, roleArtifactDescriptor, type CatfoodEnrollmentRole, type TestEnrollmentBinding, type VerifiedTrustAncestor, type VerifiedTrustProvenance } from "../web/lib/catfood-enrollment";
import type { ThreadsHttpTransport } from "../web/lib/catfood-threads-http";

const ENROLL = "IKORABU/WP3/CATFOOD/ROLE-ENROLLMENT/V3", STATUS = "IKORABU/WP3/CATFOOD/SESSION-STATUS/V3";
const roles: CatfoodEnrollmentRole[] = ["source", "custodian", "evaluator", "writer", "verifier"];
type Mutator = (payload: Record<string, any>, request: Record<string, any>) => void;

function fixture(enrollMutate: Mutator = () => {}, statusMutate: Mutator = () => {}, authority = "fixture-authority") {
  const keys = generateKeyPairSync("ed25519");
  const binding: TestEnrollmentBinding = { trust_domain: "TEST_ONLY", issuer: authority, issuer_key_id: "fixture-key", audience: "ikorabu-catfood", origin: "http://127.0.0.1:32199", credential: "fixture-credential-0123456789abcdef", public_key_pem: keys.publicKey.export({ type: "spki", format: "pem" }).toString(), environment_identity: "test:fixture", deployment_id: "deployment:fixture", enrollment_namespace: "namespace:fixture", build_policy_sha256: CATFOOD_POLICY_SHA256, accepted_snapshot_id: "snapshot:fixture", accepted_snapshot_sha256: acceptedSnapshotDigest(), launch_ticket: `test-launch:${authority}` };
  const anchor = createHash("sha256").update(createPublicKey(binding.public_key_pem).export({ type: "spki", format: "der" })).digest("hex"); let sequence = 0;
  const now = Date.now(); const subject = collectCurrentRuntimeSubject(binding); const launches = new Map(roles.map((role) => [role, observeTestOnlyLaunch(binding, role, subject)]));
  const transport: ThreadsHttpTransport = (request) => {
    const asked = JSON.parse(request.body!); const status = new URL(request.url).pathname.endsWith("/status");
    const descriptor = status ? undefined : roleArtifactDescriptor(asked.requested_role);
    const payload: Record<string, any> = status
      ? { issuer: binding.issuer, authority_anchor: anchor, audience: binding.audience, challenge: asked.challenge, request_id: asked.request_id, session_id: asked.session_id, role: asked.role, scope: asked.scope, purpose_class: asked.purpose_class, action: asked.action, target: asked.target, subject, accepted_snapshot_sha256: binding.accepted_snapshot_sha256, status_sequence: ++sequence, expires_at: new Date(now + 60_000).toISOString(), revoked: false }
      : { protocol: "ikorabu.catfood-enrollment.v3", issuer: binding.issuer, authority_anchor: anchor, trust_domain: binding.trust_domain, audience: binding.audience, challenge: asked.challenge, request_id: asked.request_id, session_id: `session:${asked.requested_role}`, role: asked.requested_role, scope: asked.requested_scope, subject: structuredClone(subject), environment_identity: binding.environment_identity, issued_at: new Date(now - 1_000).toISOString(), expires_at: new Date(now + 60_000).toISOString(), revoked: false, accepted_snapshot_id: binding.accepted_snapshot_id, accepted_snapshot_sha256: binding.accepted_snapshot_sha256, enrollment_namespace: binding.enrollment_namespace, build_policy_sha256: binding.build_policy_sha256, accepted_role_descriptor: structuredClone(descriptor), launcher_observed_launch: structuredClone(launches.get(asked.requested_role)) };
    (status ? statusMutate : enrollMutate)(payload, asked);
    const purpose = status ? STATUS : ENROLL, encoded = Buffer.from(canonicalJson(payload)).toString("base64url");
    const body = canonicalJson({ algorithm: "Ed25519", key_id: binding.issuer_key_id, payload: encoded, signature: sign(null, Buffer.from(`${purpose}\n${encoded}`), keys.privateKey).toString("base64url") });
    return { status: 200, content_type: "application/json", location: null, body, byte_length: Buffer.byteLength(body), body_sha256: sha256(body) };
  };
  return { binding, transport, now: new Date(now) };
}

function enrollAll(f = fixture()) { return Object.fromEntries(roles.map((role) => [role, enrollTestOnlyRoleForTest(f.binding, role, "run:test", f.transport, f.now)])) as Record<CatfoodEnrollmentRole, ReturnType<typeof enrollTestOnlyRoleForTest>>; }
function ancestor(name: string, trust_domain: "TEST_ONLY" | "OPERATIONAL" = "OPERATIONAL", overrides: Partial<VerifiedTrustAncestor> = {}): VerifiedTrustAncestor { return { name, trust_domain, authority_anchor: "a".repeat(64), deployment_id: "deployment", environment_identity: "environment", enrollment_namespace: "namespace", accepted_snapshot_sha256: "b".repeat(64), build_policy_sha256: "c".repeat(64), evidence_ref: `proof:${name}`, validator: "ABSTRACT_CONFORMANCE", parents: [], purpose: `TEST:${name}`, scope_sha256: "d".repeat(64), time_scope: "abstract", ...overrides }; }
function manifest(nodes: VerifiedTrustAncestor[]): VerifiedTrustProvenance { const body = { schema: "catfood-provenance-manifest.v1" as const, nodes }; return { ...body, manifest_sha256: sha256(canonicalJson(body)) }; }

describe("WP3 Corrective07 controlled launch and provenance", () => {
  test("T01-T03 taint, missing ancestry, and pure all-operational conformance", () => {
    const required = ["source", "custodian", "evaluator"]; const all = required.map((name) => ancestor(name));
    expect(deriveCatfoodTrustDomain(manifest(all), required)).toBe("OPERATIONAL");
    for (const name of required) expect(deriveCatfoodTrustDomain(manifest(all.map((row) => row.name === name ? { ...row, trust_domain: "TEST_ONLY" } : row)), required)).toBe("TEST_ONLY");
    expect(deriveCatfoodTrustDomain(manifest(all.slice(1)), required)).toBe("UNVERIFIED");
    expect(deriveCatfoodTrustDomain({ ...manifest(all), manifest_sha256: "0".repeat(64) }, required)).toBe("UNVERIFIED");
  });

  test("T04,T14,T15 signed TEST_ONLY roles remain opaque, role-bound, and coherent", () => {
    const enrolled = enrollAll(); for (const role of roles) expect(assertEnrolledRole(enrolled[role], role, "TEST_ONLY").role).toBe(role);
    expect(() => assertEnrolledRole(enrolled.source, "writer", "TEST_ONLY")).toThrow("ENROLLMENT_CONTEXT_INVALID");
    expect(() => assertEnrolledRole({ role: "source" }, "source", "TEST_ONLY")).toThrow("ENROLLMENT_CONTEXT_INVALID");
    const seed = ancestor("seed", "TEST_ONLY", { authority_anchor: String(assertEnrolledRole(enrolled.source, "source").authority_anchor), deployment_id: String((assertEnrolledRole(enrolled.source, "source").subject as Record<string, unknown>).deployment_id), environment_identity: String(assertEnrolledRole(enrolled.source, "source").environment_identity), enrollment_namespace: String(assertEnrolledRole(enrolled.source, "source").enrollment_namespace), accepted_snapshot_sha256: String(assertEnrolledRole(enrolled.source, "source").accepted_snapshot_sha256), build_policy_sha256: String(assertEnrolledRole(enrolled.source, "source").build_policy_sha256) });
    const provenance = composeEnrolledTrustProvenance([enrolled.source, enrolled.custodian, enrolled.evaluator], [ancestor("supervisor", "TEST_ONLY", { ...seed, name: "supervisor", parents: ["source"] }), ancestor("role_session", "TEST_ONLY", { ...seed, name: "role_session", parents: ["source", "custodian", "evaluator"] }), ancestor("role_build", "TEST_ONLY", { ...seed, name: "role_build", parents: ["source", "custodian", "evaluator"] })]);
    expect(deriveEnrolledTrustDomain(provenance, ["source", "custodian", "evaluator", "supervisor", "role_session", "role_build"])).toBe("TEST_ONLY");
    expect(assertCommonEnrollmentLineage(Object.values(enrolled)).trust_domain).toBe("TEST_ONLY");
  });

  test("T05-T11 fixed descriptors, actual bytes, loader, role, launch, and snapshot reject substitution", () => {
    for (const role of roles) {
      const f = fixture((payload) => { payload.accepted_role_descriptor.artifacts[0].sha256 = "0".repeat(64); });
      expect(() => enrollTestOnlyRoleForTest(f.binding, role, "run:test", f.transport, f.now)).toThrow("ENROLLMENT_BUILD_INVALID");
    }
    const mutations: Mutator[] = [
      (p) => { p.accepted_role_descriptor.artifacts[0].sha256 = "0".repeat(64); },
      (p) => { p.accepted_role_descriptor.artifacts.pop(); p.accepted_role_descriptor.artifact_root = sha256(canonicalJson(p.accepted_role_descriptor)); },
      (p) => { p.accepted_role_descriptor.loader.executable_path = "decoy"; },
      (p) => { p.accepted_role_descriptor.role = "writer"; },
      (p) => { delete p.accepted_role_descriptor.entrypoint; },
      (p) => { p.launcher_observed_launch.artifact_root = "f".repeat(64); },
      (p) => { p.launcher_observed_launch.launch_id = "launch:wrong"; },
      (p) => { p.launcher_observed_launch.actual_main.sha256 = "0".repeat(64); },
      (p) => { p.launcher_observed_launch.exec_argv_sha256 = "0".repeat(64); },
      (p) => { p.launcher_observed_launch.loading_inputs = [{ flag: "--preload", specifier: "decoy.ts", present: true, path: "decoy.ts", sha256: "0".repeat(64) }]; },
    ];
    for (const mutate of mutations) { const f = fixture(mutate); expect(() => enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, f.now)).toThrow(); }
    const f = fixture(); expect(() => enrollTestOnlyRoleForTest({ ...f.binding, accepted_snapshot_sha256: "d".repeat(64) }, "source", "run:test", f.transport, f.now)).toThrow();
  });

  test("T02-T04 real child main, preload, argv, cwd and loading environment change the launch profile", () => {
    const moduleUrl = JSON.stringify(new URL("../web/lib/catfood-enrollment.ts", import.meta.url).href);
    const expression = `import { currentLaunchProfile } from ${moduleUrl}; process.stdout.write(JSON.stringify(currentLaunchProfile()))`;
    const run = (extra: string[] = [], env?: Record<string, string>) => Bun.spawnSync({ cmd: [process.execPath, ...extra, "-e", expression], cwd: process.cwd(), env: env ? { ...process.env, ...env } : process.env, stdout: "pipe", stderr: "pipe" });
    try {
      const plain = run(), preload = run(["--preload", fileURLToPath(new URL("../web/lib/catfood-harness.ts", import.meta.url))]), environment = run([], { BUN_OPTIONS: "--smol" });
      for (const child of [plain, preload, environment]) expect(child.exitCode).toBe(0);
      const profiles = [plain, preload, environment].map((child) => JSON.parse(child.stdout.toString()) as Record<string, unknown>);
      expect(new Set(profiles.map((profile) => profile.profile_sha256)).size).toBe(3);
      expect((profiles[1]!.loading_args as string[]).some((value) => value === "--preload")).toBe(true);
      expect((profiles[1]!.loading_inputs as Array<Record<string, unknown>>)[0]).toMatchObject({ present: true, sha256: expect.stringMatching(/^[0-9a-f]{64}$/) });
      expect(profiles[2]!.loading_environment).not.toEqual(currentLaunchProfile().loading_environment);
    } catch (error) { expect(String(error)).toContain("EPERM"); }
  });

  test("T05 parent-observed malicious preload cannot be rehabilitated by restoring clean disk bytes", () => {
    const dir = mkdtempSync(join(tmpdir(), "catfood-launch-")), preload = join(dir, "preload.ts"), main = join(dir, "main.ts"), clean = `globalThis.__catfoodPreload = "clean";\n`;
    try {
      const moduleUrl = JSON.stringify(new URL("../web/lib/catfood-enrollment.ts", import.meta.url).href);
      writeFileSync(main, `import { currentLaunchProfile } from ${moduleUrl}; process.stdout.write(JSON.stringify(currentLaunchProfile()));\n`);
      const attack = `import { writeFileSync } from "node:fs"; writeFileSync(${JSON.stringify(preload)}, ${JSON.stringify(clean)}); globalThis.__catfoodPreload = "attack";\n`, parentObserved = sha256(attack);
      writeFileSync(preload, attack);
      const child = Bun.spawnSync({ cmd: [process.execPath, "--preload", preload, main], cwd: process.cwd(), stdout: "pipe", stderr: "pipe" }); expect(child.exitCode).toBe(0);
      const profile = JSON.parse(child.stdout.toString()) as Record<string, unknown>, input = (profile.loading_inputs as Array<Record<string, unknown>>)[0]!;
      expect(parentObserved).not.toBe(input.sha256); expect(input.sha256).toBe(sha256(clean));
      const f = fixture((payload) => { payload.launcher_observed_launch.loading_inputs = [{ ...input, sha256: parentObserved }]; });
      expect(() => enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, f.now)).toThrow("ENROLLMENT_LAUNCH_INVALID");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test("T12-T13 actual PID/start/boot/channel subject rejects static or copied sessions", () => {
    const actual = collectCurrentRuntimeSubject(fixture().binding); expect(actual.pid).toBe(process.pid); expect(actual.process_start_token).not.toContain("Date.now"); expect(actual.channel_binding_sha256).toMatch(/^[0-9a-f]{64}$/);
    try { const child = Bun.spawnSync({ cmd: [process.execPath, "-e", `import { collectCurrentRuntimeSubject } from ${JSON.stringify(new URL("../web/lib/catfood-enrollment.ts", import.meta.url).href)}; process.stdout.write(JSON.stringify(collectCurrentRuntimeSubject(${JSON.stringify(fixture().binding)})))`], stdout: "pipe", stderr: "pipe" });
      if (child.exitCode === 0) { const other = JSON.parse(child.stdout.toString()); expect(other.pid).not.toBe(actual.pid); expect(other.process_start_token).not.toBe(actual.process_start_token); } else expect(child.stderr.toString()).toContain("EPERM");
    } catch (error) { expect(String(error)).toContain("EPERM"); }
    for (const mutate of [(p: Record<string, any>) => { p.subject.pid = 1; }, (p: Record<string, any>) => { p.subject.process_start_token = "copied"; }, (p: Record<string, any>) => { p.subject.boot_id = "boot:copied"; }, (p: Record<string, any>) => { p.subject.channel_binding_sha256 = "0".repeat(64); }]) {
      const f = fixture(mutate); expect(() => enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, f.now)).toThrow("ENROLLMENT_SESSION_INVALID");
    }
  });

  test("T16-T17 independent authority and immutable snapshot composition fail", () => {
    const a = enrollAll(fixture(undefined, undefined, "authority-a")), b = enrollAll(fixture(undefined, undefined, "authority-b"));
    expect(() => assertCommonEnrollmentLineage([a.source, b.custodian])).toThrow("ENROLLMENT_MIXED_SNAPSHOT");
    const f = fixture(); const one = enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, f.now);
    expect(enrollmentEvidence(one).accepted_snapshot_sha256).toBe(f.binding.accepted_snapshot_sha256);
  });

  test("T18-T21 use-time status is action-bound and fails closed", () => {
    const ok = fixture(), enrolled = enrollTestOnlyRoleForTest(ok.binding, "source", "run:test", ok.transport, ok.now);
    expect(inspectEnrolledRole(enrolled, "source", "source.acquire", "run:test").action).toBe("source.acquire");
    for (const mutate of [(p: Record<string, any>) => { p.revoked = true; }, (p: Record<string, any>) => { p.challenge = "wrong"; }, (p: Record<string, any>) => { p.scope = "other"; }, (p: Record<string, any>) => { p.accepted_snapshot_sha256 = "0".repeat(64); }, (p: Record<string, any>) => { p.expires_at = "2020-01-01T00:00:00.000Z"; }]) {
      const f = fixture(undefined, mutate), context = enrollTestOnlyRoleForTest(f.binding, "source", "run:test", f.transport, f.now); expect(() => inspectEnrolledRole(context, "source", "source.acquire", "run:test")).toThrow("ENROLLMENT_STATUS_INVALID");
    }
    const authorization = authorizeEnrolledAction(enrolled, "source", "SAFETY_RECONCILIATION", "source.read_claim", "run:test");
    expect(assertAuthorizedAction(authorization, "source", "SAFETY_RECONCILIATION", "source.read_claim", "run:test").action).toBe("source.read_claim");
    expect(() => assertAuthorizedAction(authorization, "source", "POSITIVE_EXECUTION", "source.read_claim", "run:test")).toThrow("ACTION_AUTHORIZATION_INVALID");
    const unavailable = fixture(); let statusCalls = 0;
    const unavailableTransport: ThreadsHttpTransport = (request) => { if (new URL(request.url).pathname.endsWith("/status")) { statusCalls++; throw new Error("STATUS_TRANSPORT_UNAVAILABLE"); } return unavailable.transport(request); };
    const context = enrollTestOnlyRoleForTest(unavailable.binding, "source", "run:test", unavailableTransport, unavailable.now);
    expect(() => inspectEnrolledRole(context, "source", "source.acquire", "run:test")).toThrow("ENROLLMENT_UNAVAILABLE"); expect(statusCalls).toBe(1);
  });

  test("T15-T17 missing, duplicate, cyclic and mixed-lineage provenance stays unverified", () => {
    const required = ["source", "custodian", "evaluator", "supervisor", "role_session", "role_build", "clock", "go", "environment", "acquisition", "sealed_run"];
    const nodes = required.map((name, index) => ancestor(name, index === 0 ? "TEST_ONLY" : "OPERATIONAL", { parents: index ? [required[index - 1]!] : [] }));
    expect(deriveCatfoodTrustDomain(manifest(nodes), required)).toBe("TEST_ONLY");
    for (const name of required) expect(deriveCatfoodTrustDomain(manifest(nodes.filter((node) => node.name !== name)), required)).toBe("UNVERIFIED");
    expect(deriveCatfoodTrustDomain(manifest([...nodes, { ...nodes[0]! }]), required)).toBe("UNVERIFIED");
    expect(deriveCatfoodTrustDomain(manifest(nodes.map((node, index) => index === 0 ? { ...node, parents: [required.at(-1)!] } : node)), required)).toBe("UNVERIFIED");
    expect(deriveCatfoodTrustDomain(manifest(nodes.map((node, index) => index === 1 ? { ...node, deployment_id: "foreign" } : node)), required)).toBe("UNVERIFIED");
  });

  test("T22-T24 evidence exposes no credential and concrete TEST_ONLY status path completes", () => {
    const enrolled = enrollAll(), evidence = enrollmentEvidence(enrolled.writer); expect(canonicalJson(evidence)).not.toContain("fixture-credential");
    expect((evidence.subject as Record<string, unknown>).pid).toBe(process.pid); expect((evidence.launcher_observed_launch as Record<string, unknown>).role).toBe("writer");
    expect(inspectEnrolledRole(enrolled.writer, "writer", "writer.sign.release", "run:test").revoked).toBe(false);
  });
});
