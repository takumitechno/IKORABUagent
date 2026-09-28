import { closeSync, fstatSync, lstatSync, openSync, readFileSync, realpathSync, statSync } from "node:fs";
import { hostname, uptime } from "node:os";
import { join, resolve } from "node:path";
import { createPublicKey, verify } from "node:crypto";
import { parseJsonNoDuplicateKeys } from "./catfood-coe";
import { canonicalJson, sha256 } from "./catfood-harness";
import { CATFOOD_ATTESTATION_DOMAIN, CATFOOD_ATTESTATION_SCHEMA } from "./catfood-independent-attestation";
import { CATFOOD_EVALUATION_PROVENANCE_NODES, CATFOOD_EVALUATOR_SHA256, CATFOOD_OPERATIONAL_ROOT, CATFOOD_POLICY_SHA256, CatfoodTrustError, ProtectedCatfoodCustodian, type EvaluationResult, type OperationalProvenance, type TrustedClock, type TrustedClockSample } from "./catfood-trust";
import { OperationalThreadsEvidenceSource, type ThreadsSourceContext } from "./catfood-threads-http";
import { verifyConsumerIntegrity, type ConsumerIntegrityManifest } from "../../scripts/check-catfood-consumer-integrity";
import { assertEnrolledRole, deriveCatfoodTrustDomain, inspectEnrolledRole, loadOperationalRoleEnrollment, type VerifiedTrustProvenance } from "./catfood-enrollment";

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

/** Fixed operational verifier: roots and accepted identities come only from the protected operational root. */
export function verifyOperationalIndependentAttestation(payloadJson: string, signatureBase64url: string, expected: { run_id: string; bundle_sha256: string }): EvaluationResult["verdict"] {
  try {
  const verifierEnrollment = loadOperationalRoleEnrollment("verifier", expected.run_id); const verifierSnapshot = assertEnrolledRole(verifierEnrollment, "verifier", "OPERATIONAL");
  inspectEnrolledRole(verifierEnrollment, "verifier", "verifier.operational.release", expected.run_id);
  const bootstrap = parseJsonNoDuplicateKeys(protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "bootstrap.json"), 1_000_000), 1_000_000, 32) as Record<string, unknown>;
  const manifestRaw = readFileSync(resolve(import.meta.dir, "../../contracts/catfood-consumer-integrity-v1.json"), "utf8"); const acceptedManifest = protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "accepted-consumer-manifest.sha256"), 128).trim();
  if (sha256(manifestRaw) !== acceptedManifest) throw new CatfoodTrustError("OPERATIONAL_BUILD_NOT_ACCEPTED"); verifyConsumerIntegrity(JSON.parse(manifestRaw) as ConsumerIntegrityManifest);
  const roots = parseJsonNoDuplicateKeys(protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "attestation-roots.json"), 1_000_000), 1_000_000, 32) as Record<string, unknown>;
  exact(roots, ["keys", "schema"]); if (roots.schema !== "ikorabu.catfood-attestation-roots.v1" || !Array.isArray(roots.keys)) throw new CatfoodTrustError("ATTESTATION_ROOTS_INVALID");
  const payload = parseJsonNoDuplicateKeys(payloadJson, 1_000_000, 32) as Record<string, unknown>;
  if (canonicalJson(payload) !== payloadJson || payload.domain !== CATFOOD_ATTESTATION_DOMAIN || payload.schema !== CATFOOD_ATTESTATION_SCHEMA || payload.test_only !== false || payload.trust_domain !== "OPERATIONAL" || payload.evaluator_sha256 !== CATFOOD_EVALUATOR_SHA256 || payload.policy_sha256 !== CATFOOD_POLICY_SHA256 || payload.run_id !== expected.run_id || payload.bundle_sha256 !== expected.bundle_sha256) throw new CatfoodTrustError("ATTESTATION_INVALID");
  const enrollment = payload.enrollment as Record<string, unknown> | undefined;
  const provenance = enrollment?.provenance as VerifiedTrustProvenance | undefined;
  if (!enrollment || enrollment.authority_anchor !== verifierSnapshot.authority_anchor || enrollment.accepted_snapshot_id !== verifierSnapshot.accepted_snapshot_id || enrollment.accepted_snapshot_sha256 !== verifierSnapshot.accepted_snapshot_sha256 || enrollment.enrollment_namespace !== verifierSnapshot.enrollment_namespace || !Array.isArray(enrollment.roles) || enrollment.roles.length !== 4 || !provenance || deriveCatfoodTrustDomain(provenance, CATFOOD_EVALUATION_PROVENANCE_NODES) !== "OPERATIONAL") throw new CatfoodTrustError("ATTESTATION_ENROLLMENT_MISMATCH");
  const acceptedIds = new Set(bootstrap.attestation_root_ids as string[]); const keys = (roots.keys as Record<string, unknown>[]).filter((key) => acceptedIds.has(String(key.key_id)) && key.key_id === payload.signing_key_id && key.writer_identity === payload.writer_identity);
  if (keys.length !== 1 || !verify(null, Buffer.from(`${CATFOOD_ATTESTATION_DOMAIN}\n${payloadJson}`), createPublicKey(String(keys[0]!.public_key_pem)), Buffer.from(signatureBase64url, "base64url"))) throw new CatfoodTrustError("ATTESTATION_SIGNATURE_INVALID");
  return payload.verdict as EvaluationResult["verdict"];
  } catch { throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE"); }
}
