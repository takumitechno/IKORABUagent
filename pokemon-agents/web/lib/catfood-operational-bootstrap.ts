import { closeSync, fstatSync, lstatSync, openSync, readFileSync, realpathSync, statSync } from "node:fs";
import { generateKeyPairSync } from "node:crypto";
import { hostname, uptime } from "node:os";
import { join, resolve } from "node:path";
import { parseJsonNoDuplicateKeys } from "./catfood-coe";
import { sha256 } from "./catfood-harness";
import { CATFOOD_OPERATIONAL_ROOT, CatfoodTrustError, ProtectedCatfoodCustodian, type EvaluationResult, type OperationalProvenance, type TrustedClock, type TrustedClockSample } from "./catfood-trust";
import { OperationalThreadsEvidenceSource, type ThreadsSourceContext } from "./catfood-threads-http";
import { verifyConsumerIntegrity, type ConsumerIntegrityManifest } from "../../scripts/check-catfood-consumer-integrity";
import { assertEnrolledRole, loadOperationalRoleEnrollment } from "./catfood-enrollment";
import { collectCurrentRuntimeSubject, roleChannelArtifactDescriptor } from "./catfood-enrollment";
import { registerLocalRoleSession, type LocalRoleSession, type RoleChannelBinding } from "./catfood-role-channel";
import { verifyIndependentAttestationArtifact, type IndependentAttestationExpected } from "./catfood-independent-attestation";
import type { ThreadsHttpTransport } from "./catfood-threads-http";

const SHA256 = /^[0-9a-f]{64}$/;
const BOOTSTRAP_FIELDS = ["attestation_root_ids", "credential_version_ref", "environment_identity", "go_root_ids", "intents", "principal_binding", "principal_ref", "protected_probe", "runtime_prohibitions", "schema", "source_build_sha256", "source_identity", "tenant_user_id", "threads_origin", "trust_domain"];

function protectedRead(path: string, maximumBytes: number): string {
  const absolute = resolve(path); const rootPath = resolve(CATFOOD_OPERATIONAL_ROOT); const root = `${rootPath}${process.platform === "win32" ? "\\" : "/"}`;
  if (!absolute.startsWith(root)) throw new CatfoodTrustError("OPERATIONAL_PATH_OUTSIDE_ROOT");
  let stat; try { if (lstatSync(absolute).isSymbolicLink() || realpathSync(absolute) !== absolute || realpathSync(rootPath) !== rootPath) throw new Error(); stat = statSync(absolute); } catch { throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_UNPROVISIONED"); }
  if (!stat.isFile() || stat.size <= 0 || stat.size > maximumBytes) throw new CatfoodTrustError("OPERATIONAL_FILE_PERMISSIONS_UNSAFE");
  const ancestors: string[] = []; for (let current = resolve(absolute, ".."); current.startsWith(rootPath); current = resolve(current, "..")) { ancestors.push(current); if (current === rootPath) break; }
  if (process.platform !== "win32") {
    const rootStat = statSync(rootPath);
    if ((rootStat.mode & 0o022) !== 0 || ancestors.some((parent) => { const value = statSync(parent); return !value.isDirectory() || value.uid !== rootStat.uid || (value.mode & 0o022) !== 0; }) || stat.uid !== rootStat.uid || (stat.mode & 0o022) !== 0) throw new CatfoodTrustError("OPERATIONAL_FILE_PERMISSIONS_UNSAFE");
  }
  if (process.platform === "win32") {
    const shell = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
    const script = "$a=Get-Acl -LiteralPath $args[0];[pscustomobject]@{Owner=$a.Owner;Access=@($a.Access|%{[pscustomobject]@{Id=$_.IdentityReference.Value;Rights=$_.FileSystemRights.ToString();Type=$_.AccessControlType.ToString()}})}|ConvertTo-Json -Compress -Depth 4";
    for (const candidate of [rootPath, ...ancestors, absolute]) {
      const result = Bun.spawnSync({ cmd: [shell, "-NoProfile", "-NonInteractive", "-Command", script, candidate], stdout: "pipe", stderr: "ignore" });
      if (result.exitCode !== 0) throw new CatfoodTrustError("OPERATIONAL_FILE_PERMISSIONS_UNSAFE");
      const acl = JSON.parse(result.stdout.toString()) as { Owner: string; Access: Array<{ Id: string; Rights: string; Type: string }> };
      const owner = String(acl.Owner).toUpperCase(); const broad = /EVERYONE|AUTHENTICATED USERS|BUILTIN\\USERS|S-1-1-0|S-1-5-11|S-1-5-32-545/i;
      if (!/SYSTEM|ADMINISTRATORS|S-1-5-18|S-1-5-32-544/.test(owner) || acl.Access.some((entry) => entry.Type === "Allow" && broad.test(entry.Id) && /WRITE|MODIFY|FULLCONTROL|DELETE|CHANGE PERMISSIONS|TAKE OWNERSHIP/i.test(entry.Rights))) throw new CatfoodTrustError("OPERATIONAL_FILE_PERMISSIONS_UNSAFE");
    }
  }
  const fd = openSync(absolute, "r"); try { const opened = fstatSync(fd); if (opened.dev !== stat.dev || opened.ino !== stat.ino || opened.size !== stat.size) throw new CatfoodTrustError("OPERATIONAL_FILE_CHANGED"); return readFileSync(fd, "utf8"); } finally { closeSync(fd); }
}

function exact(value: Record<string, unknown>, fields: readonly string[]): void {
  const got = Object.keys(value).sort(); const want = [...fields].sort();
  if (got.length !== want.length || got.some((field, index) => field !== want[index])) throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_SCHEMA_INVALID");
}

class OperationalSystemClock implements TrustedClock {
  readonly kind = "SYSTEM" as const;
  readonly operational_provenance: OperationalProvenance;
  private readonly bootId = `system:${sha256(`${hostname()}:${Math.floor((Date.now() - uptime() * 1000) / 1000)}`).slice(0, 32)}`;
  private readonly monotonicOrigin = performance.now();
  constructor(provenance: OperationalProvenance) { this.operational_provenance = provenance; }
  sample(): TrustedClockSample { return { wall_time: new Date().toISOString(), monotonic_ms: Math.floor(performance.now() - this.monotonicOrigin), boot_id: this.bootId }; }
}

/** Fixed, no-argument operational entrypoint. It performs no enrollment or root installation. */
export function openOperationalCatfoodCustodian(): ProtectedCatfoodCustodian {
  try {
  const bootstrapPath = join(CATFOOD_OPERATIONAL_ROOT, "bootstrap.json"); const raw = protectedRead(bootstrapPath, 1_000_000);
  const bootstrap = parseJsonNoDuplicateKeys(raw, 1_000_000, 32) as Record<string, unknown>; exact(bootstrap, BOOTSTRAP_FIELDS);
  if (bootstrap.schema !== "ikorabu.catfood-operational-bootstrap.v1" || !SHA256.test(String(bootstrap.source_build_sha256)) || !Array.isArray(bootstrap.intents) || !Array.isArray(bootstrap.go_root_ids) || !(bootstrap.go_root_ids as unknown[]).length || !Array.isArray(bootstrap.attestation_root_ids) || !(bootstrap.attestation_root_ids as unknown[]).length) throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_SCHEMA_INVALID");
  const principalBinding = bootstrap.principal_binding as Record<string, unknown>; const runtimeProhibitions = bootstrap.runtime_prohibitions as Record<string, unknown>;
  if (!principalBinding || !runtimeProhibitions) throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_SCHEMA_INVALID");
  exact(principalBinding, ["account_id", "actor", "organization_id"]); exact(runtimeProhibitions, ["paid_generation_enabled", "writer_enabled"]);
  if (runtimeProhibitions.writer_enabled !== false || runtimeProhibitions.paid_generation_enabled !== false) throw new CatfoodTrustError("PAID_PATH_NOT_DISABLED");
  const manifestRaw = readFileSync(resolve(import.meta.dir, "../../contracts/catfood-consumer-integrity-v1.json"), "utf8");
  const acceptedManifest = protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "accepted-consumer-manifest.sha256"), 128).trim();
  if (!SHA256.test(acceptedManifest) || sha256(manifestRaw) !== acceptedManifest || bootstrap.source_build_sha256 !== acceptedManifest) throw new CatfoodTrustError("OPERATIONAL_BUILD_NOT_ACCEPTED");
  verifyConsumerIntegrity(JSON.parse(manifestRaw) as ConsumerIntegrityManifest);
  const provenance: OperationalProvenance = Object.freeze({ bootstrap_sha256: sha256(raw), accepted_manifest_sha256: acceptedManifest, environment_identity: String(bootstrap.environment_identity), trust_domain: String(bootstrap.trust_domain) });
  const credential = protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "threads.credential"), 4_096).trim(); if (credential.length < 32) throw new CatfoodTrustError("OPERATIONAL_CREDENTIAL_UNPROVISIONED");
  const context: ThreadsSourceContext = {
    source_identity: String(bootstrap.source_identity), origin: String(bootstrap.threads_origin), bridge_api_key: credential,
    tenant_user_id: String(bootstrap.tenant_user_id), principal_ref: String(bootstrap.principal_ref), credential_version_ref: String(bootstrap.credential_version_ref),
    source_build_sha256: String(bootstrap.source_build_sha256), protected_probe: bootstrap.protected_probe as ThreadsSourceContext["protected_probe"], principal_binding: bootstrap.principal_binding as ThreadsSourceContext["principal_binding"], runtime_prohibitions: bootstrap.runtime_prohibitions as ThreadsSourceContext["runtime_prohibitions"], intents: bootstrap.intents as ThreadsSourceContext["intents"], operational_provenance: provenance,
  };
  const enrollmentScope = `${bootstrap.environment_identity}:${principalBinding.organization_id}:${principalBinding.account_id}`;
  const sourceEnrollment = loadOperationalRoleEnrollment("source", enrollmentScope); const custodianEnrollment = loadOperationalRoleEnrollment("custodian", enrollmentScope);
  const sourceSnapshot = assertEnrolledRole(sourceEnrollment, "source", "OPERATIONAL"), custodianSnapshot = assertEnrolledRole(custodianEnrollment, "custodian", "OPERATIONAL");
  if (sourceSnapshot.authority_anchor !== custodianSnapshot.authority_anchor || sourceSnapshot.accepted_snapshot_sha256 !== custodianSnapshot.accepted_snapshot_sha256 || sourceSnapshot.enrollment_namespace !== custodianSnapshot.enrollment_namespace) throw new CatfoodTrustError("ENROLLMENT_MIXED_SNAPSHOT");
  const source = OperationalThreadsEvidenceSource.operational(context, sourceEnrollment); const clock = new OperationalSystemClock(provenance);
  const custodian = new ProtectedCatfoodCustodian(join(CATFOOD_OPERATIONAL_ROOT, "control.db"), join(CATFOOD_OPERATIONAL_ROOT, "checkpoint.db"), source, clock, custodianEnrollment);
  const configuredGoRoots = [...custodian.trust.go_keys.map((key) => key.key_id)].sort(); const expectedGoRoots = [...bootstrap.go_root_ids as string[]].sort();
  if (JSON.stringify(configuredGoRoots) !== JSON.stringify(expectedGoRoots)) { custodian.close(); throw new CatfoodTrustError("OPERATIONAL_GO_ROOT_MISMATCH"); }
  return custodian;
  } catch (error) { if (error instanceof CatfoodTrustError && error.code === "OPERATIONAL_GO_ROOT_MISMATCH") throw error; throw new CatfoodTrustError("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE"); }
}

let operationalVerifier: Readonly<{ session: LocalRoleSession; binding: RoleChannelBinding }> | undefined;

/**
 * Provisionable operational registration boundary. The authority binding is loaded only from the protected root;
 * the external launcher receives the freshly generated public key and must return its signed assignment.
 */
export function openOperationalIndependentAttestationVerifier(input: { assignment_provider(request: Readonly<Record<string, unknown>>): string; transport: ThreadsHttpTransport }): void {
  if (operationalVerifier) throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ALREADY_OPEN");
  try {
    const bindingRaw = protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "role-channel-binding.json"), 1_000_000), binding = parseJsonNoDuplicateKeys(bindingRaw, 1_000_000, 32) as unknown as RoleChannelBinding; if (binding.trust_domain !== "OPERATIONAL") throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_SCHEMA_INVALID");
    const subjectConfig = parseJsonNoDuplicateKeys(protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "role-subject.json"), 16_384), 16_384, 8) as Record<string, unknown>; exact(subjectConfig, ["deployment_id", "environment_identity"]); const key = generateKeyPairSync("ed25519"), publicKeyPem = key.publicKey.export({ type: "spki", format: "pem" }).toString(), subject = collectCurrentRuntimeSubject({ origin: binding.origin, audience: binding.audience, credential: binding.credential, deployment_id: String(subjectConfig.deployment_id), environment_identity: String(subjectConfig.environment_identity), trust_domain: "OPERATIONAL" }), assignment = input.assignment_provider(Object.freeze({ role: "verifier", subject, descriptor: roleChannelArtifactDescriptor("verifier"), public_key_pem: publicKeyPem })), session = registerLocalRoleSession({ binding, transport: input.transport, assignment_envelope: assignment, private_key: key.privateKey }); operationalVerifier = Object.freeze({ session, binding });
  } catch (error) { operationalVerifier = undefined; if (error instanceof CatfoodTrustError && error.code === "OPERATIONAL_VERIFIER_ALREADY_OPEN") throw error; throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE", error instanceof Error ? error.message : undefined); }
}

/** Fixed operational verifier: roots and accepted identities come only from the protected operational root. */
export function verifyOperationalIndependentAttestation(artifactJson: string, expected: { run_id: string; bundle_sha256: string }): EvaluationResult["verdict"];
export function verifyOperationalIndependentAttestation(payloadJson: string, signatureBase64url: string, expected: { run_id: string; bundle_sha256: string }): EvaluationResult["verdict"];
export function verifyOperationalIndependentAttestation(artifactJson: string, expectedOrSignature: { run_id: string; bundle_sha256: string } | string, legacyExpected?: { run_id: string; bundle_sha256: string }): EvaluationResult["verdict"] {
  if (!operationalVerifier || typeof expectedOrSignature === "string") throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE"); try { const expectedTarget = protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "expected-evaluation-target.json"), 1_000_000), expected: IndependentAttestationExpected = { ...expectedOrSignature, verifier_session: operationalVerifier.session, role_channel_binding: operationalVerifier.binding, expected_target_envelope: expectedTarget }; return verifyIndependentAttestationArtifact(artifactJson, expected, "OPERATIONAL"); } catch (error) { if (error instanceof CatfoodTrustError && error.code !== "OPERATIONAL_BOOTSTRAP_UNPROVISIONED") throw error; throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE"); }
}
