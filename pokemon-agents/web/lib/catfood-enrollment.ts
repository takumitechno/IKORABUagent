import { createHash, createPublicKey, randomBytes, verify } from "node:crypto";
import { closeSync, existsSync, fstatSync, lstatSync, openSync, readFileSync, realpathSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { hostname } from "node:os";
import { parseJsonNoDuplicateKeys } from "./catfood-coe";
import { canonicalJson } from "./catfood-harness";
import { CATFOOD_OPERATIONAL_ROOT, CATFOOD_POLICY_SHA256, CatfoodTrustError } from "./catfood-trust";
import { synchronousThreadsHttpTransport, type ThreadsHttpResponse, type ThreadsHttpTransport } from "./catfood-threads-http";

export type CatfoodEnrollmentRole = "source" | "custodian" | "evaluator" | "writer" | "verifier";
export type CatfoodTrustDomain = "OPERATIONAL" | "TEST_ONLY" | "UNVERIFIED";
export interface CatfoodEnrollmentContext { readonly role: CatfoodEnrollmentRole }
export interface RuntimeSubject {
  pid: number; process_start_token: string; boot_id: string; executable_path: string; principal_id: string;
  deployment_id: string; environment_identity: string; channel_binding_sha256: string;
}
export interface TestEnrollmentBinding {
  trust_domain: "TEST_ONLY" | "OPERATIONAL"; issuer: string; issuer_key_id: string; audience: string; origin: string;
  credential: string; public_key_pem: string; environment_identity: string; deployment_id: string;
  enrollment_namespace: string; build_policy_sha256: string; accepted_snapshot_id: string; accepted_snapshot_sha256: string;
  launch_ticket: string;
}
export type CatfoodActionPurpose = "POSITIVE_EXECUTION" | "SAFETY_RECONCILIATION" | "HISTORICAL_EVIDENCE" | "INDEPENDENT_EVALUATION" | "ATTESTATION";
export interface CatfoodActionAuthorization { readonly kind: "CATFOOD_ACTION_AUTHORIZATION" }
export interface VerifiedTrustAncestor {
  name: string; trust_domain: "TEST_ONLY" | "OPERATIONAL";
  authority_anchor: string; deployment_id: string; environment_identity: string;
  enrollment_namespace: string; accepted_snapshot_sha256: string; build_policy_sha256: string;
  evidence_ref: string; validator: string; parents: readonly string[]; purpose: string; scope_sha256: string; time_scope: string;
}
export interface VerifiedTrustProvenance { readonly schema: "catfood-provenance-manifest.v1"; readonly nodes: readonly VerifiedTrustAncestor[]; readonly manifest_sha256: string }
export interface EnrolledTrustProvenance { readonly kind: "ENROLLED_TRUST_PROVENANCE" }

const PROTOCOL = "ikorabu.catfood-enrollment.v3";
const PURPOSE = "IKORABU/WP3/CATFOOD/ROLE-ENROLLMENT/V3";
const STATUS_PURPOSE = "IKORABU/WP3/CATFOOD/SESSION-STATUS/V3";
const MAX_BYTES = 256_000;
const SHA256 = /^[0-9a-f]{64}$/;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:@\/-]{0,299}$/;
const PACKAGE_ROOT = resolve(import.meta.dir, "../..");
const ROLE_FILES: Readonly<Record<CatfoodEnrollmentRole, readonly string[]>> = Object.freeze({
  source: Object.freeze(["web/lib/catfood-coe.ts", "web/lib/catfood-enrollment.ts", "web/lib/catfood-harness.ts", "web/lib/catfood-threads-http.ts"]),
  custodian: Object.freeze(["web/lib/catfood-coe.ts", "web/lib/catfood-enrollment.ts", "web/lib/catfood-harness.ts", "web/lib/catfood-threads-http.ts", "web/lib/catfood-trust.ts"]),
  evaluator: Object.freeze(["web/lib/catfood-coe.ts", "web/lib/catfood-enrollment.ts", "web/lib/catfood-harness.ts", "web/lib/catfood-trust.ts"]),
  writer: Object.freeze(["web/lib/catfood-coe.ts", "web/lib/catfood-enrollment.ts", "web/lib/catfood-harness.ts", "web/lib/catfood-independent-attestation.ts", "web/lib/catfood-trust.ts"]),
  verifier: Object.freeze(["scripts/check-catfood-consumer-integrity.ts", "web/lib/catfood-coe.ts", "web/lib/catfood-enrollment.ts", "web/lib/catfood-harness.ts", "web/lib/catfood-independent-attestation.ts", "web/lib/catfood-operational-bootstrap.ts", "web/lib/catfood-trust.ts"]),
});
const ROLE_ENTRYPOINT: Readonly<Record<CatfoodEnrollmentRole, string>> = Object.freeze({ source: "web/lib/catfood-threads-http.ts", custodian: "web/lib/catfood-trust.ts", evaluator: "web/lib/catfood-trust.ts", writer: "web/lib/catfood-independent-attestation.ts", verifier: "web/lib/catfood-operational-bootstrap.ts" });
const ROLE_EXPORTS: Readonly<Record<CatfoodEnrollmentRole, readonly string[]>> = Object.freeze({
  source: Object.freeze(["OperationalThreadsEvidenceSource"]),
  custodian: Object.freeze(["ProtectedCatfoodCustodian", "openOperationalCatfoodCustodian"]),
  evaluator: Object.freeze(["IndependentCatfoodEvaluator", "evaluateCatfoodAcceptance"]),
  writer: Object.freeze(["IndependentCatfoodAttestationWriter"]),
  verifier: Object.freeze(["verifyOperationalIndependentAttestation"]),
});
type HiddenContext = { record: Readonly<Record<string, unknown>>; binding: Readonly<TestEnrollmentBinding>; transport: ThreadsHttpTransport; subject: Readonly<RuntimeSubject>; used: Set<string> };
const contexts = new WeakMap<object, HiddenContext>();
const provenances = new WeakMap<object, VerifiedTrustProvenance>();
const authorizations = new WeakMap<object, Readonly<{ role: CatfoodEnrollmentRole; purpose: CatfoodActionPurpose; action: string; target: string; receipt: Readonly<Record<string, unknown>> }>>();
let cachedLocalIdentity: Readonly<{ processStart: string; boot: string; principal: string; operationalGrade: boolean }> | undefined;
let cachedLaunchProfile: Readonly<Record<string, unknown>> | undefined;

function hash(value: string | Buffer): string { return createHash("sha256").update(value).digest("hex"); }
function roles(): CatfoodEnrollmentRole[] { return ["source", "custodian", "evaluator", "writer", "verifier"]; }
function exact(row: Record<string, unknown>, fields: readonly string[]): void { const got = Object.keys(row).sort(), want = [...fields].sort(); if (got.length !== want.length || got.some((key, index) => key !== want[index])) throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID"); }
function normalizedFile(path: string): string { return readFileSync(path, "utf8").replace(/\r\n/g, "\n"); }
function authorityAnchor(publicKeyPem: string): string { try { return hash(createPublicKey(publicKeyPem).export({ type: "spki", format: "der" }) as Buffer); } catch { throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID"); } }

function resolvedIdentity(path: string): Readonly<Record<string, unknown>> {
  const absolute = resolve(path); if (!existsSync(absolute)) return Object.freeze({ path: absolute, present: false, sha256: null });
  const real = realpathSync(absolute), stat = statSync(real); if (!stat.isFile()) throw new CatfoodTrustError("ENROLLMENT_BUILD_INVALID");
  return Object.freeze({ path: real, present: true, sha256: hash(readFileSync(real)) });
}

export function currentLaunchProfile(): Readonly<Record<string, unknown>> {
  if (cachedLaunchProfile) return cachedLaunchProfile;
  const executable = resolvedIdentity(process.execPath); const main = resolvedIdentity(Bun.main);
  const loadingArgs = process.execArgv.filter((value, index, all) => /^(--preload|-r|--require|--import|--loader|--plugin)(=|$)/.test(value) || index > 0 && /^(--preload|-r|--require|--import|--loader|--plugin)$/.test(all[index - 1]!));
  const loadingEnvironment = ["BUN_OPTIONS", "NODE_OPTIONS"].map((name) => Object.freeze({ name, present: process.env[name] !== undefined, value_sha256: process.env[name] === undefined ? null : hash(process.env[name]!) }));
  const configuration = ["bunfig.toml", "bunfig.local.toml", "tsconfig.json", "package.json"].map((name) => resolvedIdentity(resolve(process.cwd(), name)));
  const cwd = realpathSync(process.cwd());
  cachedLaunchProfile = Object.freeze({
    actual_main: main, bun_executable: executable, bun_version: Bun.version, cwd,
    argv_sha256: hash(canonicalJson(process.argv)), exec_argv_sha256: hash(canonicalJson(process.execArgv)),
    loading_args: Object.freeze(loadingArgs), loading_environment: Object.freeze(loadingEnvironment),
    configuration: Object.freeze(configuration), resolution_policy: "FIXED_DIRECT_MAIN_NO_RUNTIME_AUTO_INSTALL",
    profile_sha256: hash(canonicalJson({ main, executable, bun_version: Bun.version, cwd, argv: process.argv, exec_argv: process.execArgv, loadingArgs, loadingEnvironment, configuration })),
  });
  return cachedLaunchProfile;
}

export function roleArtifactDescriptor(role: CatfoodEnrollmentRole): Readonly<Record<string, unknown>> {
  const artifacts = ROLE_FILES[role].map((path) => Object.freeze({ path, sha256: hash(normalizedFile(resolve(PACKAGE_ROOT, path))) }));
  const loader = Object.freeze({ engine: "bun", version: Bun.version, executable_path: realpathSync(process.execPath), module_format: "typescript-esm" });
  const launch_profile = currentLaunchProfile(), role_exports = ROLE_EXPORTS[role];
  return Object.freeze({ role, entrypoint: ROLE_ENTRYPOINT[role], role_exports, artifacts: Object.freeze(artifacts), loader, launch_profile, artifact_root: hash(canonicalJson({ role, entrypoint: ROLE_ENTRYPOINT[role], role_exports, artifacts, loader, launch_profile })) });
}

export function acceptedSnapshotDigest(): string { return hash(canonicalJson(roles().map(roleArtifactDescriptor))); }

/** TEST_ONLY helper for an external parent fixture. Enrollment never calls it. */
export function observeTestOnlyLaunch(binding: TestEnrollmentBinding, role: CatfoodEnrollmentRole, subject = collectCurrentRuntimeSubject(binding)): Readonly<Record<string, unknown>> {
  if (binding.trust_domain !== "TEST_ONLY") throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID");
  const descriptor = roleArtifactDescriptor(role), profile = descriptor.launch_profile as Record<string, unknown>;
  const core = { schema: "ikorabu.catfood-launch-record.v1", issuer: binding.issuer, launch_ticket: binding.launch_ticket, role, accepted_snapshot_id: binding.accepted_snapshot_id, accepted_snapshot_sha256: binding.accepted_snapshot_sha256, subject_sha256: hash(canonicalJson(subject)), artifact_root: descriptor.artifact_root, profile_sha256: profile.profile_sha256, actual_main: profile.actual_main, bun_executable: profile.bun_executable, bun_version: profile.bun_version, argv_sha256: profile.argv_sha256, exec_argv_sha256: profile.exec_argv_sha256, loading_args: profile.loading_args, loading_environment: profile.loading_environment, cwd: profile.cwd, configuration: profile.configuration, resolution_policy: profile.resolution_policy, immutability_policy: "TEST_ONLY_PARENT_OBSERVED", observed_before_role_admission: true };
  return Object.freeze({ launch_id: `launch:${hash(canonicalJson(core)).slice(0, 32)}`, ...core });
}

function validateLaunchRecord(value: unknown, binding: TestEnrollmentBinding, role: CatfoodEnrollmentRole, subject: RuntimeSubject, descriptor: Readonly<Record<string, unknown>>): void {
  const record = value as Record<string, unknown> | undefined; if (!record) throw new CatfoodTrustError("ENROLLMENT_LAUNCH_INVALID");
  const profile = descriptor.launch_profile as Record<string, unknown>;
  const fields = ["accepted_snapshot_id", "accepted_snapshot_sha256", "actual_main", "argv_sha256", "artifact_root", "bun_executable", "bun_version", "configuration", "cwd", "exec_argv_sha256", "immutability_policy", "issuer", "launch_id", "launch_ticket", "loading_args", "loading_environment", "observed_before_role_admission", "profile_sha256", "resolution_policy", "role", "schema", "subject_sha256"];
  exact(record, fields);
  const core = { schema: record.schema, issuer: record.issuer, launch_ticket: record.launch_ticket, role: record.role, accepted_snapshot_id: record.accepted_snapshot_id, accepted_snapshot_sha256: record.accepted_snapshot_sha256, subject_sha256: record.subject_sha256, artifact_root: record.artifact_root, profile_sha256: record.profile_sha256, actual_main: record.actual_main, bun_executable: record.bun_executable, bun_version: record.bun_version, argv_sha256: record.argv_sha256, exec_argv_sha256: record.exec_argv_sha256, loading_args: record.loading_args, loading_environment: record.loading_environment, cwd: record.cwd, configuration: record.configuration, resolution_policy: record.resolution_policy, immutability_policy: record.immutability_policy, observed_before_role_admission: record.observed_before_role_admission };
  const expected = { schema: "ikorabu.catfood-launch-record.v1", issuer: binding.issuer, launch_ticket: binding.launch_ticket, role, accepted_snapshot_id: binding.accepted_snapshot_id, accepted_snapshot_sha256: binding.accepted_snapshot_sha256, subject_sha256: hash(canonicalJson(subject)), artifact_root: descriptor.artifact_root, profile_sha256: profile.profile_sha256, actual_main: profile.actual_main, bun_executable: profile.bun_executable, bun_version: profile.bun_version, argv_sha256: profile.argv_sha256, exec_argv_sha256: profile.exec_argv_sha256, loading_args: profile.loading_args, loading_environment: profile.loading_environment, cwd: profile.cwd, configuration: profile.configuration, resolution_policy: profile.resolution_policy, immutability_policy: binding.trust_domain === "TEST_ONLY" ? "TEST_ONLY_PARENT_OBSERVED" : "EXTERNAL_IMMUTABLE_LAUNCH", observed_before_role_admission: true };
  if (canonicalJson(core) !== canonicalJson(expected) || record.launch_id !== `launch:${hash(canonicalJson(core)).slice(0, 32)}`) throw new CatfoodTrustError("ENROLLMENT_LAUNCH_INVALID");
}

function spawnText(cmd: string[]): string { const result = Bun.spawnSync({ cmd, stdout: "pipe", stderr: "pipe" }); if (result.exitCode !== 0) throw new Error(result.stderr.toString()); return result.stdout.toString().trim(); }
export function collectCurrentRuntimeSubject(binding: Pick<TestEnrollmentBinding, "origin" | "audience" | "credential" | "deployment_id" | "environment_identity"> & Partial<Pick<TestEnrollmentBinding, "trust_domain">>): Readonly<RuntimeSubject> {
  let processStart: string, boot: string, principal: string, operationalGrade = true;
  if (cachedLocalIdentity) ({ processStart, boot, principal, operationalGrade } = cachedLocalIdentity); else try {
    if (process.platform === "win32") {
      const script = String.raw`$p=Get-Process -Id ${process.pid};$b=Get-ItemPropertyValue -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters' -Name BootId;$s=[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value;[pscustomobject]@{Start=$p.StartTime.ToUniversalTime().ToString('o');Boot=$b;Sid=$s}|ConvertTo-Json -Compress`;
      const row = JSON.parse(spawnText(["C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script])) as { Start: string; Boot: number; Sid: string };
      processStart = row.Start; boot = `windows-boot-id:${row.Boot}`; principal = row.Sid;
    } else if (process.platform === "linux") {
      const stat = readFileSync(`/proc/${process.pid}/stat`, "utf8"); const close = stat.lastIndexOf(")"); const fields = stat.slice(close + 2).split(" ");
      processStart = `linux-ticks:${fields[19]}`; boot = `linux:${readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim()}`; principal = `uid:${process.geteuid?.() ?? process.getuid?.()}`;
    } else {
      processStart = `darwin-start:${spawnText(["ps", "-o", "lstart=", "-p", String(process.pid)])}`; boot = `darwin:${spawnText(["sysctl", "-n", "kern.boottime"])}`; principal = `uid:${process.geteuid?.() ?? process.getuid?.()}`;
    }
  } catch {
    if (process.platform !== "win32" || binding.trust_domain !== "TEST_ONLY") throw new CatfoodTrustError("ENROLLMENT_SUBJECT_UNAVAILABLE");
    processStart = `test-only-time-origin:${performance.timeOrigin}`; boot = `test-only-windows-session:${hostname()}:${process.env.SESSIONNAME ?? "unknown"}:${process.ppid}`; principal = `test-only-user:${process.env.USERDOMAIN ?? "unknown"}\\${process.env.USERNAME ?? "unknown"}`; operationalGrade = false;
  }
  if (!operationalGrade && binding.trust_domain === "OPERATIONAL") throw new CatfoodTrustError("ENROLLMENT_SUBJECT_UNAVAILABLE");
  cachedLocalIdentity = Object.freeze({ processStart, boot, principal, operationalGrade });
  const executable = realpathSync(process.execPath);
  return Object.freeze({ pid: process.pid, process_start_token: processStart, boot_id: boot, executable_path: executable, principal_id: principal, deployment_id: binding.deployment_id, environment_identity: binding.environment_identity, channel_binding_sha256: hash(canonicalJson({ origin: binding.origin, audience: binding.audience, credential_sha256: hash(binding.credential), principal_id: principal })) });
}

function protectedBinding(): TestEnrollmentBinding {
  const root = resolve(CATFOOD_OPERATIONAL_ROOT), path = resolve(root, "enrollment-binding.json");
  try {
    if (!path.startsWith(`${root}${process.platform === "win32" ? "\\" : "/"}`) || lstatSync(path).isSymbolicLink() || realpathSync(path) !== path || realpathSync(root) !== root) throw new Error();
    const stat = statSync(path), rootStat = statSync(root); if (!stat.isFile() || stat.size <= 0 || stat.size > MAX_BYTES) throw new Error();
    if (process.platform !== "win32" && ((rootStat.mode & 0o022) !== 0 || (stat.mode & 0o022) !== 0 || stat.uid !== rootStat.uid)) throw new Error();
    const fd = openSync(path, "r"); try { const opened = fstatSync(fd); if (opened.dev !== stat.dev || opened.ino !== stat.ino || opened.size !== stat.size) throw new Error(); return parseJsonNoDuplicateKeys(readFileSync(fd, "utf8"), MAX_BYTES, 20) as unknown as TestEnrollmentBinding; } finally { closeSync(fd); }
  } catch { throw new CatfoodTrustError("ENROLLMENT_UNPROVISIONED"); }
}

function responseBody(response: ThreadsHttpResponse): string {
  if (response.location || response.status >= 300 && response.status < 400) throw new CatfoodTrustError("ENROLLMENT_REDIRECT_REJECTED");
  if (response.status !== 200 || !response.content_type.toLowerCase().startsWith("application/json") || !["", "identity"].includes((response.content_encoding ?? "identity").toLowerCase())) throw new CatfoodTrustError("ENROLLMENT_UNAVAILABLE");
  let bytes: Buffer; if (response.body_base64url === undefined) bytes = Buffer.from(response.body ?? "", "utf8"); else { if (!/^[A-Za-z0-9_-]*$/.test(response.body_base64url)) throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID"); bytes = Buffer.from(response.body_base64url, "base64url"); if (bytes.toString("base64url") !== response.body_base64url) throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID"); }
  if (bytes.byteLength > MAX_BYTES || response.byte_length !== undefined && response.byte_length !== bytes.byteLength || response.body_sha256 !== undefined && response.body_sha256 !== hash(bytes)) throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID");
  try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID"); }
}

function endpoint(origin: string, path: string, testOnly: boolean): URL {
  let url: URL; try { url = new URL(origin); } catch { throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID"); }
  const loopback = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname.toLowerCase());
  if (url.username || url.password || url.search || url.hash || !["", "/"].includes(url.pathname) || (testOnly ? !loopback || !["http:", "https:"].includes(url.protocol) : url.protocol !== "https:")) throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID");
  return new URL(path, url.origin);
}

function signedPayload(response: ThreadsHttpResponse, binding: TestEnrollmentBinding, purpose: string): Record<string, unknown> {
  const envelope = parseJsonNoDuplicateKeys(responseBody(response), MAX_BYTES, 32) as Record<string, unknown>; exact(envelope, ["algorithm", "key_id", "payload", "signature"]);
  if (envelope.algorithm !== "Ed25519" || envelope.key_id !== binding.issuer_key_id || typeof envelope.payload !== "string" || typeof envelope.signature !== "string") throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID");
  let text: string; try { const decoded = Buffer.from(envelope.payload, "base64url"); if (decoded.toString("base64url") !== envelope.payload) throw new Error(); text = new TextDecoder("utf-8", { fatal: true }).decode(decoded); } catch { throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID"); }
  try { if (!verify(null, Buffer.from(`${purpose}\n${envelope.payload}`), createPublicKey(binding.public_key_pem), Buffer.from(envelope.signature, "base64url"))) throw new Error(); } catch { throw new CatfoodTrustError("ENROLLMENT_SIGNATURE_INVALID"); }
  const payload = parseJsonNoDuplicateKeys(text, MAX_BYTES, 32) as Record<string, unknown>; if (canonicalJson(payload) !== text) throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID"); return payload;
}

function post(binding: TestEnrollmentBinding, path: string, purpose: string, request: Record<string, unknown>, transport: ThreadsHttpTransport): Record<string, unknown> {
  let response: ThreadsHttpResponse; try { response = transport({ method: "POST", url: endpoint(binding.origin, path, binding.trust_domain === "TEST_ONLY").toString(), headers: Object.freeze({ Accept: "application/json", Authorization: `Bearer ${binding.credential}`, "Content-Type": "application/json" }), body: canonicalJson(request), timeout_ms: 2_500, maximum_bytes: MAX_BYTES }); } catch { throw new CatfoodTrustError("ENROLLMENT_UNAVAILABLE"); }
  return signedPayload(response, binding, purpose);
}

function validateBinding(binding: TestEnrollmentBinding): void {
  exact(binding as unknown as Record<string, unknown>, ["accepted_snapshot_id", "accepted_snapshot_sha256", "audience", "build_policy_sha256", "credential", "deployment_id", "enrollment_namespace", "environment_identity", "issuer", "issuer_key_id", "launch_ticket", "origin", "public_key_pem", "trust_domain"]);
  if (![binding.issuer, binding.issuer_key_id, binding.audience, binding.origin, binding.credential, binding.environment_identity, binding.deployment_id, binding.enrollment_namespace, binding.accepted_snapshot_id, binding.launch_ticket].every((value) => typeof value === "string" && value.length > 0) || binding.credential.length < 32 || !SHA256.test(binding.build_policy_sha256) || !SHA256.test(binding.accepted_snapshot_sha256)) throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID");
}

function enroll(bindingInput: TestEnrollmentBinding, role: CatfoodEnrollmentRole, scope: string, transport: ThreadsHttpTransport, now: Date): CatfoodEnrollmentContext {
  const binding = Object.freeze(structuredClone(bindingInput)); validateBinding(binding); if (!roles().includes(role) || !TOKEN.test(scope)) throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID");
  const subject = collectCurrentRuntimeSubject(binding), descriptor = roleArtifactDescriptor(role); const challenge = randomBytes(32).toString("base64url"), requestId = `enroll:${randomBytes(16).toString("hex")}`;
  const request = { protocol: PROTOCOL, purpose: PURPOSE, audience: binding.audience, challenge, request_id: requestId, launch_ticket: binding.launch_ticket, requested_role: role, requested_scope: scope, subject, local_role_descriptor: descriptor, accepted_snapshot_id: binding.accepted_snapshot_id };
  const payload = post(binding, "/v3/catfood/enrollment", PURPOSE, request, transport);
  exact(payload, ["accepted_role_descriptor", "accepted_snapshot_id", "accepted_snapshot_sha256", "audience", "authority_anchor", "build_policy_sha256", "challenge", "enrollment_namespace", "environment_identity", "expires_at", "issued_at", "issuer", "launcher_observed_launch", "protocol", "request_id", "revoked", "role", "scope", "session_id", "subject", "trust_domain"]);
  const issued = Date.parse(String(payload.issued_at)), expires = Date.parse(String(payload.expires_at));
  const common = payload.protocol === PROTOCOL && payload.issuer === binding.issuer && payload.authority_anchor === authorityAnchor(binding.public_key_pem) && payload.trust_domain === binding.trust_domain && payload.audience === binding.audience && payload.challenge === challenge && payload.request_id === requestId && payload.role === role && payload.scope === scope && payload.accepted_snapshot_id === binding.accepted_snapshot_id && payload.accepted_snapshot_sha256 === binding.accepted_snapshot_sha256 && payload.enrollment_namespace === binding.enrollment_namespace && payload.build_policy_sha256 === binding.build_policy_sha256 && payload.environment_identity === binding.environment_identity;
  const descriptorMatches = canonicalJson(payload.accepted_role_descriptor) === canonicalJson(descriptor) && binding.accepted_snapshot_sha256 === acceptedSnapshotDigest();
  validateLaunchRecord(payload.launcher_observed_launch, binding, role, subject, descriptor);
  if (!common || !descriptorMatches || canonicalJson(payload.subject) !== canonicalJson(subject) || payload.revoked !== false || typeof payload.session_id !== "string" || !TOKEN.test(payload.session_id) || !Number.isFinite(issued) || !Number.isFinite(expires) || issued > now.getTime() || expires <= now.getTime() || expires <= issued) throw new CatfoodTrustError(descriptorMatches ? "ENROLLMENT_SESSION_INVALID" : "ENROLLMENT_BUILD_INVALID");
  const context = Object.freeze({ role }); contexts.set(context, { record: Object.freeze({ ...payload, key_id: binding.issuer_key_id, local_role_descriptor: descriptor }), binding, transport, subject, used: new Set() }); return context;
}

export function enrollTestOnlyRoleForTest(binding: TestEnrollmentBinding, role: CatfoodEnrollmentRole, scope: string, transport: ThreadsHttpTransport, now = new Date()): CatfoodEnrollmentContext { if (binding.trust_domain !== "TEST_ONLY") throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID"); return enroll(binding, role, scope, transport, now); }
export function loadOperationalRoleEnrollment(role: CatfoodEnrollmentRole, scope: string): CatfoodEnrollmentContext { const binding = protectedBinding(); if (binding.trust_domain !== "OPERATIONAL") throw new CatfoodTrustError("ENROLLMENT_UNPROVISIONED"); return enroll(binding, role, scope, synchronousThreadsHttpTransport, new Date()); }

export function assertEnrolledRole(value: unknown, role: CatfoodEnrollmentRole, trustDomain?: "OPERATIONAL" | "TEST_ONLY"): Readonly<Record<string, unknown>> {
  const hidden = value && typeof value === "object" ? contexts.get(value as object) : undefined; const record = hidden?.record;
  if (!record || record.role !== role || trustDomain && record.trust_domain !== trustDomain || canonicalJson(hidden!.subject) !== canonicalJson(collectCurrentRuntimeSubject(hidden!.binding)) || canonicalJson(record.local_role_descriptor) !== canonicalJson(roleArtifactDescriptor(role)) || Date.parse(String(record.expires_at)) <= Date.now()) throw new CatfoodTrustError("ENROLLMENT_CONTEXT_INVALID");
  try { validateLaunchRecord(record.launcher_observed_launch, hidden!.binding, role, hidden!.subject, record.local_role_descriptor as Readonly<Record<string, unknown>>); } catch { throw new CatfoodTrustError("ENROLLMENT_CONTEXT_INVALID"); }
  return record;
}

export function inspectEnrolledRole(value: unknown, role: CatfoodEnrollmentRole, action: string, target: string, purposeClass: CatfoodActionPurpose = "POSITIVE_EXECUTION"): Readonly<Record<string, unknown>> {
  if (!TOKEN.test(action) || !TOKEN.test(target)) throw new CatfoodTrustError("ENROLLMENT_STATUS_INVALID"); const record = assertEnrolledRole(value, role); const hidden = contexts.get(value as object)!;
  const challenge = randomBytes(32).toString("base64url"), requestId = `status:${randomBytes(16).toString("hex")}`; const subject = collectCurrentRuntimeSubject(hidden.binding);
  if (!["POSITIVE_EXECUTION", "SAFETY_RECONCILIATION", "HISTORICAL_EVIDENCE", "INDEPENDENT_EVALUATION", "ATTESTATION"].includes(purposeClass)) throw new CatfoodTrustError("ENROLLMENT_STATUS_INVALID");
  const request = { protocol: PROTOCOL, purpose: STATUS_PURPOSE, purpose_class: purposeClass, audience: hidden.binding.audience, challenge, request_id: requestId, session_id: record.session_id, role, scope: record.scope, action, target, subject, accepted_snapshot_sha256: record.accepted_snapshot_sha256 };
  const payload = post(hidden.binding, "/v3/catfood/enrollment/status", STATUS_PURPOSE, request, hidden.transport);
  exact(payload, ["accepted_snapshot_sha256", "action", "audience", "authority_anchor", "challenge", "expires_at", "issuer", "purpose_class", "request_id", "revoked", "role", "scope", "session_id", "status_sequence", "subject", "target"]);
  const receiptId = hash(canonicalJson(payload)); const valid = payload.issuer === hidden.binding.issuer && payload.authority_anchor === record.authority_anchor && payload.audience === hidden.binding.audience && payload.challenge === challenge && payload.request_id === requestId && payload.session_id === record.session_id && payload.role === role && payload.scope === record.scope && payload.purpose_class === purposeClass && payload.action === action && payload.target === target && payload.accepted_snapshot_sha256 === record.accepted_snapshot_sha256 && canonicalJson(payload.subject) === canonicalJson(subject) && payload.revoked === false && Number.isSafeInteger(payload.status_sequence) && Date.parse(String(payload.expires_at)) > Date.now() && !hidden.used.has(receiptId);
  if (!valid) throw new CatfoodTrustError("ENROLLMENT_STATUS_INVALID"); hidden.used.add(receiptId); return Object.freeze({ ...payload, receipt_sha256: receiptId });
}

export function authorizeEnrolledAction(value: CatfoodEnrollmentContext, role: CatfoodEnrollmentRole, purpose: CatfoodActionPurpose, action: string, target: string): CatfoodActionAuthorization {
  const receipt = inspectEnrolledRole(value, role, action, target, purpose); const authorization = Object.freeze({ kind: "CATFOOD_ACTION_AUTHORIZATION" as const });
  authorizations.set(authorization, Object.freeze({ role, purpose, action, target, receipt })); return authorization;
}

export function assertAuthorizedAction(value: unknown, role: CatfoodEnrollmentRole, purpose: CatfoodActionPurpose, action: string, target: string): Readonly<Record<string, unknown>> {
  const row = value && typeof value === "object" ? authorizations.get(value as object) : undefined;
  if (!row || row.role !== role || row.purpose !== purpose || row.action !== action || row.target !== target) throw new CatfoodTrustError("ACTION_AUTHORIZATION_INVALID");
  return row.receipt;
}

export function enrollmentEvidence(value: CatfoodEnrollmentContext): Readonly<Record<string, unknown>> {
  const record = assertEnrolledRole(value, value.role); return Object.freeze({ role: record.role, trust_domain: record.trust_domain, authority_anchor: record.authority_anchor, deployment_id: (record.subject as Record<string, unknown>).deployment_id, environment_identity: record.environment_identity, enrollment_namespace: record.enrollment_namespace, accepted_snapshot_id: record.accepted_snapshot_id, accepted_snapshot_sha256: record.accepted_snapshot_sha256, build_policy_sha256: record.build_policy_sha256, session_id: record.session_id, subject: record.subject, accepted_role_descriptor: record.accepted_role_descriptor, local_role_descriptor: record.local_role_descriptor, launcher_observed_launch: record.launcher_observed_launch });
}

export function assertCommonEnrollmentLineage(values: readonly CatfoodEnrollmentContext[]): Readonly<Record<string, unknown>> {
  if (!values.length) throw new CatfoodTrustError("ENROLLMENT_MIXED_SNAPSHOT"); const rows = values.map((value) => assertEnrolledRole(value, value.role));
  const fields = ["authority_anchor", "accepted_snapshot_id", "accepted_snapshot_sha256", "enrollment_namespace", "build_policy_sha256", "environment_identity", "trust_domain"];
  if (fields.some((field) => rows.some((row) => row[field] !== rows[0]![field]))) throw new CatfoodTrustError("ENROLLMENT_MIXED_SNAPSHOT"); return rows[0]!;
}

export function enrollmentAncestor(value: CatfoodEnrollmentContext, name = value.role): VerifiedTrustAncestor {
  const row = assertEnrolledRole(value, value.role), subject = row.subject as Record<string, unknown>, launch = row.launcher_observed_launch as Record<string, unknown>;
  return Object.freeze({ name, trust_domain: row.trust_domain as "TEST_ONLY" | "OPERATIONAL", authority_anchor: String(row.authority_anchor), deployment_id: String(subject.deployment_id), environment_identity: String(row.environment_identity), enrollment_namespace: String(row.enrollment_namespace), accepted_snapshot_sha256: String(row.accepted_snapshot_sha256), build_policy_sha256: String(row.build_policy_sha256), evidence_ref: String(launch.launch_id), validator: "SIGNED_ENROLLMENT_V3", parents: Object.freeze([]), purpose: `ROLE:${value.role}`, scope_sha256: hash(canonicalJson({ role: value.role, scope: row.scope, session_id: row.session_id })), time_scope: `${row.issued_at}/${row.expires_at}` });
}

export function composeEnrolledTrustProvenance(values: readonly CatfoodEnrollmentContext[], derived: readonly VerifiedTrustAncestor[]): EnrolledTrustProvenance {
  assertCommonEnrollmentLineage(values); const nodes = [...values.map((value) => enrollmentAncestor(value)), ...derived.map((row) => Object.freeze(structuredClone(row)))];
  const body = { schema: "catfood-provenance-manifest.v1" as const, nodes: Object.freeze(nodes) }, manifest = Object.freeze({ ...body, manifest_sha256: hash(canonicalJson(body)) });
  if (deriveCatfoodTrustDomain(manifest, nodes.map((node) => node.name)) === "UNVERIFIED") throw new CatfoodTrustError("PROVENANCE_MANIFEST_INVALID");
  const context = Object.freeze({ kind: "ENROLLED_TRUST_PROVENANCE" as const }); provenances.set(context, manifest); return context;
}

export function composeRunTrustProvenance(values: readonly CatfoodEnrollmentContext[], bundle: Record<string, unknown>): EnrolledTrustProvenance {
  const common = assertCommonEnrollmentLineage(values), seed = enrollmentAncestor(values[0]!); const domain = common.trust_domain as "TEST_ONLY" | "OPERATIONAL";
  const spec = bundle.spec as Record<string, unknown>, go = bundle.go as Record<string, unknown>, run = bundle.run as Record<string, unknown>, finalSource = bundle.final_source as Record<string, unknown>, checkpoint = bundle.checkpoint as Record<string, unknown>, journal = bundle.journal as unknown[];
  const scope = { run_id: spec.run_id, environment_type: spec.environment_type, environment_instance_id: spec.environment_instance_id, organization_id: spec.organization_id, tenant_id: spec.tenant_id, account_id: spec.account_id }, scopeSha = hash(canonicalJson(scope));
  const node = (name: string, evidence: unknown, validator: string, parents: readonly string[], purpose: string, trustDomain = domain): VerifiedTrustAncestor => Object.freeze({ ...seed, name, trust_domain: trustDomain, evidence_ref: hash(canonicalJson(evidence)), validator, parents: Object.freeze([...parents]), purpose, scope_sha256: scopeSha, time_scope: `${spec.requested_window_start}/${spec.requested_window_end}` });
  const coe = finalSource.coe as Record<string, unknown> | undefined, acquisitionDomain = coe?.test_only === false ? domain : "TEST_ONLY";
  return composeEnrolledTrustProvenance(values, [
    node("supervisor", (enrollmentEvidence(values[0]!).launcher_observed_launch as Record<string, unknown>).launch_id, "SIGNED_LAUNCH_AUTHORITY", [values[0]!.role], "CONTROLLED_LAUNCH"),
    node("role_session", values.map((value) => enrollmentEvidence(value).session_id), "SIGNED_ROLE_SESSIONS", values.map((value) => value.role), "ROLE_SESSION"),
    node("role_build", values.map((value) => enrollmentEvidence(value).accepted_role_descriptor), "ACCEPTED_ROLE_DESCRIPTORS", values.map((value) => value.role), "ROLE_BUILD"),
    node("clock", { journal: journal.map((event) => { const row = event as Record<string, unknown>; return [row.observed_at, row.monotonic_ms, row.boot_id]; }), run }, "SEALED_CLOCK_OBSERVATIONS", ["custodian"], "HISTORICAL_TIME"),
    node("go", go, "SIGNED_HUMAN_GO", ["custodian"], "POSITIVE_EXECUTION"),
    node("environment", scope, "SEALED_RUN_SCOPE", ["custodian"], "TENANT_ENVIRONMENT"),
    node("acquisition", { digest: finalSource.digest, coe: finalSource.coe, archive_sha256: finalSource.archive_sha256 }, "SEALED_SOURCE_ACQUISITION", ["source", "custodian"], "HISTORICAL_EVIDENCE", acquisitionDomain),
    node("sealed_run", { checkpoint, lifecycle: run.lifecycle, final_source_digest: finalSource.digest }, "CHECKPOINTED_CLOSED_RUN", ["custodian", "acquisition", "go", "clock", "environment"], "INDEPENDENT_EVALUATION"),
  ]);
}

export function deriveEnrolledTrustDomain(value: EnrolledTrustProvenance | undefined, required: readonly string[]): CatfoodTrustDomain {
  const provenance = value && typeof value === "object" ? provenances.get(value) : undefined; return provenance ? deriveCatfoodTrustDomain(provenance, required) : "UNVERIFIED";
}

export function enrolledTrustEvidence(value: EnrolledTrustProvenance): VerifiedTrustProvenance {
  const provenance = provenances.get(value); if (!provenance) throw new CatfoodTrustError("ENROLLMENT_CONTEXT_INVALID"); return Object.freeze(structuredClone(provenance));
}

export function deriveCatfoodTrustDomain(provenance: VerifiedTrustProvenance, required: readonly string[]): CatfoodTrustDomain {
  if (!provenance || provenance.schema !== "catfood-provenance-manifest.v1" || !Array.isArray(provenance.nodes)) return "UNVERIFIED"; const rows = provenance.nodes;
  const body = { schema: provenance.schema, nodes: rows }; if (provenance.manifest_sha256 !== hash(canonicalJson(body))) return "UNVERIFIED";
  const byName = new Map<string, VerifiedTrustAncestor>(); for (const row of rows) { if (!row || byName.has(row.name) || !row.name || !["TEST_ONLY", "OPERATIONAL"].includes(row.trust_domain) || !row.evidence_ref || !row.validator || !row.purpose || !SHA256.test(row.scope_sha256) || !Array.isArray(row.parents)) return "UNVERIFIED"; byName.set(row.name, row); }
  if (required.some((name) => !byName.has(name))) return "UNVERIFIED";
  const visiting = new Set<string>(), done = new Set<string>(); const visit = (name: string): boolean => { if (done.has(name)) return true; if (visiting.has(name)) return false; const row = byName.get(name); if (!row || row.parents.some((parent) => !byName.has(parent))) return false; visiting.add(name); if (row.parents.some((parent) => !visit(parent))) return false; visiting.delete(name); done.add(name); return true; };
  if ([...byName.keys()].some((name) => !visit(name))) return "UNVERIFIED";
  const common = ["authority_anchor", "deployment_id", "environment_identity", "enrollment_namespace", "accepted_snapshot_sha256", "build_policy_sha256"] as const;
  if (!rows.length || common.some((field) => rows.some((row) => row[field] !== rows[0]![field]))) return "UNVERIFIED";
  return rows.some((row) => row.trust_domain === "TEST_ONLY") ? "TEST_ONLY" : "OPERATIONAL";
}
