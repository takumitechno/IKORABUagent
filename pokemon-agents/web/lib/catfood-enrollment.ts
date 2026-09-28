import { createHash, createPublicKey, randomBytes, verify } from "node:crypto";
import { closeSync, fstatSync, lstatSync, openSync, readFileSync, realpathSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { parseJsonNoDuplicateKeys } from "./catfood-coe";
import { canonicalJson } from "./catfood-harness";
import { CATFOOD_OPERATIONAL_ROOT, CATFOOD_POLICY_SHA256, CatfoodTrustError } from "./catfood-trust";
import { synchronousThreadsHttpTransport, type ThreadsHttpResponse, type ThreadsHttpTransport } from "./catfood-threads-http";

export type CatfoodEnrollmentRole = "source" | "custodian" | "evaluator" | "writer" | "verifier";
export interface CatfoodEnrollmentContext { readonly role: CatfoodEnrollmentRole }
export interface TestEnrollmentBinding {
  trust_domain: "TEST_ONLY" | "OPERATIONAL"; issuer: string; issuer_key_id: string; audience: string; origin: string; credential: string;
  public_key_pem: string; environment_identity: string; session_id: string; principal_id: string;
  process_id: string; process_started_at: string; boot_id: string; deployment_id: string; accepted_manifest_sha256: string;
}

const PROTOCOL = "ikorabu.catfood-enrollment.v1";
const PURPOSE = "IKORABU/WP3/CATFOOD/ROLE-ENROLLMENT/V1";
const MAX_BYTES = 256_000;
const SHA256 = /^[0-9a-f]{64}$/;
const contexts = new WeakMap<object, Readonly<Record<string, unknown>>>();

function exact(row: Record<string, unknown>, fields: readonly string[]): void {
  const got = Object.keys(row).sort(), want = [...fields].sort();
  if (got.length !== want.length || got.some((key, index) => key !== want[index])) throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID");
}

function protectedBinding(): TestEnrollmentBinding {
  const root = resolve(CATFOOD_OPERATIONAL_ROOT), path = resolve(root, "enrollment-binding.json");
  try {
    if (!path.startsWith(`${root}${process.platform === "win32" ? "\\" : "/"}`) || lstatSync(path).isSymbolicLink() || realpathSync(path) !== path || realpathSync(root) !== root) throw new Error();
    const stat = statSync(path), rootStat = statSync(root); if (!stat.isFile() || stat.size <= 0 || stat.size > MAX_BYTES) throw new Error();
    if (process.platform !== "win32" && ((rootStat.mode & 0o022) !== 0 || (stat.mode & 0o022) !== 0 || stat.uid !== rootStat.uid)) throw new Error();
    if (process.platform === "win32") {
      const script = "$a=Get-Acl -LiteralPath $args[0];[pscustomobject]@{Owner=$a.Owner;Access=@($a.Access|%{[pscustomobject]@{Id=$_.IdentityReference.Value;Rights=$_.FileSystemRights.ToString();Type=$_.AccessControlType.ToString()}})}|ConvertTo-Json -Compress -Depth 4";
      for (const candidate of [root, path]) { const result = Bun.spawnSync({ cmd: ["C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script, candidate], stdout: "pipe", stderr: "ignore" }); const acl = result.exitCode === 0 ? JSON.parse(result.stdout.toString()) as { Owner: string; Access: Array<{ Id: string; Rights: string; Type: string }> } : null; if (!acl || !/SYSTEM|ADMINISTRATORS|S-1-5-18|S-1-5-32-544/i.test(acl.Owner) || acl.Access.some((entry) => entry.Type === "Allow" && /EVERYONE|AUTHENTICATED USERS|BUILTIN\\USERS|S-1-1-0|S-1-5-11|S-1-5-32-545/i.test(entry.Id) && /WRITE|MODIFY|FULLCONTROL|DELETE|CHANGE PERMISSIONS|TAKE OWNERSHIP/i.test(entry.Rights))) throw new Error(); }
    }
    const fd = openSync(path, "r"); try { const opened = fstatSync(fd); if (opened.dev !== stat.dev || opened.ino !== stat.ino || opened.size !== stat.size) throw new Error(); return parseJsonNoDuplicateKeys(readFileSync(fd, "utf8"), MAX_BYTES, 10) as unknown as TestEnrollmentBinding; } finally { closeSync(fd); }
  } catch { throw new CatfoodTrustError("ENROLLMENT_UNPROVISIONED"); }
}

function body(response: ThreadsHttpResponse): string {
  if (response.location || response.status >= 300 && response.status < 400) throw new CatfoodTrustError("ENROLLMENT_REDIRECT_REJECTED");
  if (response.status !== 200 || !response.content_type.toLowerCase().startsWith("application/json") || !["", "identity"].includes((response.content_encoding ?? "identity").toLowerCase())) throw new CatfoodTrustError("ENROLLMENT_UNAVAILABLE");
  let bytes: Buffer; if (response.body_base64url === undefined) bytes = Buffer.from(response.body ?? "", "utf8"); else { if (!/^[A-Za-z0-9_-]*$/.test(response.body_base64url)) throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID"); bytes = Buffer.from(response.body_base64url, "base64url"); if (bytes.toString("base64url") !== response.body_base64url) throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID"); }
  if (bytes.byteLength > MAX_BYTES || response.byte_length !== undefined && response.byte_length !== bytes.byteLength || response.body_sha256 !== undefined && response.body_sha256 !== createHash("sha256").update(bytes).digest("hex")) throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID");
  try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { throw new CatfoodTrustError("ENROLLMENT_RESPONSE_INVALID"); }
}

function endpoint(origin: string, testOnly: boolean): URL {
  let url: URL; try { url = new URL(origin); } catch { throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID"); }
  const loopback = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname.toLowerCase());
  if (url.username || url.password || url.search || url.hash || !["", "/"].includes(url.pathname) || (testOnly ? !loopback || !["http:", "https:"].includes(url.protocol) : url.protocol !== "https:")) throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID");
  return new URL("/v1/catfood/enrollment", url.origin);
}

function enroll(binding: TestEnrollmentBinding, role: CatfoodEnrollmentRole, scope: string, transport: ThreadsHttpTransport, now: Date): CatfoodEnrollmentContext {
  exact(binding as unknown as Record<string, unknown>, ["accepted_manifest_sha256", "audience", "boot_id", "credential", "deployment_id", "environment_identity", "issuer", "issuer_key_id", "origin", "principal_id", "process_id", "process_started_at", "public_key_pem", "session_id", "trust_domain"]);
  const bindingStrings = [binding.issuer, binding.issuer_key_id, binding.audience, binding.origin, binding.credential, binding.public_key_pem, binding.environment_identity, binding.session_id, binding.principal_id, binding.process_id, binding.process_started_at, binding.boot_id, binding.deployment_id];
  if (!roles().includes(role) || bindingStrings.some((value) => typeof value !== "string" || !value) || !/^[A-Za-z0-9._:@-]{1,200}$/.test(scope) || binding.credential.length < 32 || !SHA256.test(binding.accepted_manifest_sha256)) throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID");
  const challenge = randomBytes(32).toString("base64url"), requestId = `enroll:${randomBytes(16).toString("hex")}`;
  const request = { protocol: PROTOCOL, purpose: PURPOSE, audience: binding.audience, challenge, request_id: requestId, requested_role: role, requested_scope: scope, session_id: binding.session_id, principal_id: binding.principal_id, process_id: binding.process_id, process_started_at: binding.process_started_at, boot_id: binding.boot_id, deployment_id: binding.deployment_id, environment_identity: binding.environment_identity };
  const url = endpoint(binding.origin, binding.trust_domain === "TEST_ONLY");
  let response: ThreadsHttpResponse; try { response = transport({ method: "POST", url: url.toString(), headers: Object.freeze({ Accept: "application/json", Authorization: `Bearer ${binding.credential}`, "Content-Type": "application/json" }), body: canonicalJson(request), timeout_ms: 2_500, maximum_bytes: MAX_BYTES }); } catch { throw new CatfoodTrustError("ENROLLMENT_UNAVAILABLE"); }
  const envelope = parseJsonNoDuplicateKeys(body(response), MAX_BYTES, 20) as Record<string, unknown>; exact(envelope, ["algorithm", "key_id", "payload", "signature"]);
  if (envelope.algorithm !== "Ed25519" || envelope.key_id !== binding.issuer_key_id || typeof envelope.payload !== "string" || typeof envelope.signature !== "string") throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID");
  let payloadText: string; try { const decoded = Buffer.from(envelope.payload, "base64url"); if (decoded.toString("base64url") !== envelope.payload) throw new Error(); payloadText = new TextDecoder("utf-8", { fatal: true }).decode(decoded); } catch { throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID"); }
  try { if (!verify(null, Buffer.from(`${PURPOSE}\n${envelope.payload}`), createPublicKey(binding.public_key_pem), Buffer.from(envelope.signature, "base64url"))) throw new Error(); } catch { throw new CatfoodTrustError("ENROLLMENT_SIGNATURE_INVALID"); }
  const payload = parseJsonNoDuplicateKeys(payloadText, MAX_BYTES, 20) as Record<string, unknown>;
  if (canonicalJson(payload) !== payloadText) throw new CatfoodTrustError("ENROLLMENT_SCHEMA_INVALID");
  exact(payload, ["accepted_build_snapshot_id", "accepted_build_snapshot_sha256", "audience", "boot_id", "challenge", "deployment_id", "enrollment_revision", "environment_identity", "expires_at", "issued_at", "issuer", "launch_measurement_id", "policy_sha256", "principal_id", "process_id", "process_started_at", "protocol", "request_id", "revoked", "role", "role_builds", "scope", "session_id", "source_identity", "trust_domain"]);
  const fields: Array<[unknown, unknown]> = [[payload.protocol, PROTOCOL], [payload.issuer, binding.issuer], [payload.trust_domain, binding.trust_domain], [payload.audience, binding.audience], [payload.challenge, challenge], [payload.request_id, requestId], [payload.session_id, binding.session_id], [payload.principal_id, binding.principal_id], [payload.process_id, binding.process_id], [payload.process_started_at, binding.process_started_at], [payload.boot_id, binding.boot_id], [payload.deployment_id, binding.deployment_id], [payload.environment_identity, binding.environment_identity], [payload.role, role], [payload.scope, scope], [payload.policy_sha256, CATFOOD_POLICY_SHA256], [payload.accepted_build_snapshot_sha256, binding.accepted_manifest_sha256]];
  const issuedAt = Date.parse(String(payload.issued_at)), expiresAt = Date.parse(String(payload.expires_at));
  if (fields.some(([actual, expected]) => actual !== expected) || payload.revoked !== false || !Number.isSafeInteger(payload.enrollment_revision) || Number(payload.enrollment_revision) < 1 || [payload.accepted_build_snapshot_id, payload.launch_measurement_id, payload.source_identity].some((value) => typeof value !== "string" || !value) || !Number.isFinite(issuedAt) || !Number.isFinite(expiresAt) || issuedAt > now.getTime() || expiresAt <= now.getTime() || expiresAt <= issuedAt) throw new CatfoodTrustError("ENROLLMENT_SESSION_INVALID");
  if (!Array.isArray(payload.role_builds)) throw new CatfoodTrustError("ENROLLMENT_BUILD_INVALID");
  const builds = payload.role_builds as unknown[]; const required = roles();
  if (builds.length !== required.length || builds.some((row) => !row || typeof row !== "object" || Array.isArray(row)) || required.some((requiredRole) => { const rows = (builds as Record<string, unknown>[]).filter((row) => row.role === requiredRole); return rows.length !== 1 || Object.keys(rows[0]!).sort().join() !== "accepted_sha256,measured_sha256,role" || rows[0]!.accepted_sha256 !== binding.accepted_manifest_sha256 || rows[0]!.measured_sha256 !== binding.accepted_manifest_sha256; })) throw new CatfoodTrustError("ENROLLMENT_BUILD_INVALID");
  const context = Object.freeze({ role }); contexts.set(context, Object.freeze({ ...payload, key_id: envelope.key_id })); return context;
}

function roles(): CatfoodEnrollmentRole[] { return ["source", "custodian", "evaluator", "writer", "verifier"]; }

export function enrollTestOnlyRoleForTest(binding: TestEnrollmentBinding, role: CatfoodEnrollmentRole, scope: string, transport: ThreadsHttpTransport, now = new Date()): CatfoodEnrollmentContext {
  if (binding.trust_domain !== "TEST_ONLY") throw new CatfoodTrustError("ENROLLMENT_BINDING_INVALID");
  return enroll(Object.freeze(structuredClone(binding)), role, scope, transport, now);
}

export function loadOperationalRoleEnrollment(role: CatfoodEnrollmentRole, scope: string): CatfoodEnrollmentContext {
  const binding = protectedBinding(); if (binding.trust_domain !== "OPERATIONAL") throw new CatfoodTrustError("ENROLLMENT_UNPROVISIONED");
  return enroll(binding, role, scope, synchronousThreadsHttpTransport, new Date());
}

export function assertEnrolledRole(value: unknown, role: CatfoodEnrollmentRole, trustDomain?: "OPERATIONAL" | "TEST_ONLY"): Readonly<Record<string, unknown>> {
  const record = value && typeof value === "object" ? contexts.get(value as object) : undefined;
  if (!record || record.role !== role || trustDomain && record.trust_domain !== trustDomain || Date.parse(String(record.expires_at)) <= Date.now()) throw new CatfoodTrustError("ENROLLMENT_CONTEXT_INVALID");
  return record;
}
