import { readFileSync, statSync } from "node:fs";
import { hostname, uptime } from "node:os";
import { join, resolve } from "node:path";
import { parseJsonNoDuplicateKeys } from "./catfood-coe";
import { sha256 } from "./catfood-harness";
import { CATFOOD_OPERATIONAL_ROOT, CatfoodTrustError, ProtectedCatfoodCustodian, type OperationalProvenance, type TrustedClock, type TrustedClockSample } from "./catfood-trust";
import { OperationalThreadsEvidenceSource, type ThreadsSourceContext } from "./catfood-threads-http";
import { verifyConsumerIntegrity, type ConsumerIntegrityManifest } from "../../scripts/check-catfood-consumer-integrity";

const SHA256 = /^[0-9a-f]{64}$/;
const BOOTSTRAP_FIELDS = ["attestation_root_ids", "credential_version_ref", "environment_identity", "go_root_ids", "intents", "principal_ref", "protected_probe", "schema", "source_build_sha256", "source_identity", "tenant_user_id", "threads_origin", "trust_domain"];

function protectedRead(path: string, maximumBytes: number): string {
  const absolute = resolve(path); const root = `${resolve(CATFOOD_OPERATIONAL_ROOT)}${process.platform === "win32" ? "\\" : "/"}`;
  if (!absolute.startsWith(root)) throw new CatfoodTrustError("OPERATIONAL_PATH_OUTSIDE_ROOT");
  let stat; try { stat = statSync(absolute); } catch { throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_UNPROVISIONED"); }
  if (!stat.isFile() || stat.size <= 0 || stat.size > maximumBytes || process.platform !== "win32" && (stat.mode & 0o022) !== 0) throw new CatfoodTrustError("OPERATIONAL_FILE_PERMISSIONS_UNSAFE");
  if (process.platform === "win32") {
    const shell = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
    const script = "$a=Get-Acl -LiteralPath $args[0];[pscustomobject]@{Owner=$a.Owner;Access=@($a.Access|%{[pscustomobject]@{Id=$_.IdentityReference.Value;Rights=$_.FileSystemRights.ToString();Type=$_.AccessControlType.ToString()}})}|ConvertTo-Json -Compress -Depth 4";
    const result = Bun.spawnSync({ cmd: [shell, "-NoProfile", "-NonInteractive", "-Command", script, absolute], stdout: "pipe", stderr: "ignore" });
    if (result.exitCode !== 0) throw new CatfoodTrustError("OPERATIONAL_FILE_PERMISSIONS_UNSAFE");
    const acl = JSON.parse(result.stdout.toString()) as { Owner: string; Access: Array<{ Id: string; Rights: string; Type: string }> };
    const owner = String(acl.Owner).toUpperCase(); const broad = /EVERYONE|AUTHENTICATED USERS|BUILTIN\\USERS|S-1-1-0|S-1-5-11|S-1-5-32-545/i;
    if (!/SYSTEM|ADMINISTRATORS|S-1-5-18|S-1-5-32-544/.test(owner) || acl.Access.some((entry) => entry.Type === "Allow" && broad.test(entry.Id) && /WRITE|MODIFY|FULLCONTROL|DELETE|CHANGE PERMISSIONS|TAKE OWNERSHIP/i.test(entry.Rights))) throw new CatfoodTrustError("OPERATIONAL_FILE_PERMISSIONS_UNSAFE");
  }
  return readFileSync(absolute, "utf8");
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
  const bootstrapPath = join(CATFOOD_OPERATIONAL_ROOT, "bootstrap.json"); const raw = protectedRead(bootstrapPath, 1_000_000);
  const bootstrap = parseJsonNoDuplicateKeys(raw, 1_000_000, 32) as Record<string, unknown>; exact(bootstrap, BOOTSTRAP_FIELDS);
  if (bootstrap.schema !== "ikorabu.catfood-operational-bootstrap.v1" || !SHA256.test(String(bootstrap.source_build_sha256)) || !Array.isArray(bootstrap.intents) || !Array.isArray(bootstrap.go_root_ids) || !(bootstrap.go_root_ids as unknown[]).length || !Array.isArray(bootstrap.attestation_root_ids) || !(bootstrap.attestation_root_ids as unknown[]).length) throw new CatfoodTrustError("OPERATIONAL_BOOTSTRAP_SCHEMA_INVALID");
  const manifestRaw = readFileSync(resolve(import.meta.dir, "../../contracts/catfood-consumer-integrity-v1.json"), "utf8");
  const acceptedManifest = protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "accepted-consumer-manifest.sha256"), 128).trim();
  if (!SHA256.test(acceptedManifest) || sha256(manifestRaw) !== acceptedManifest || bootstrap.source_build_sha256 !== acceptedManifest) throw new CatfoodTrustError("OPERATIONAL_BUILD_NOT_ACCEPTED");
  verifyConsumerIntegrity(JSON.parse(manifestRaw) as ConsumerIntegrityManifest);
  const provenance: OperationalProvenance = Object.freeze({ bootstrap_sha256: sha256(raw), accepted_manifest_sha256: acceptedManifest, environment_identity: String(bootstrap.environment_identity), trust_domain: String(bootstrap.trust_domain) });
  const credential = protectedRead(join(CATFOOD_OPERATIONAL_ROOT, "threads.credential"), 4_096).trim(); if (credential.length < 32) throw new CatfoodTrustError("OPERATIONAL_CREDENTIAL_UNPROVISIONED");
  const context: ThreadsSourceContext = {
    source_identity: String(bootstrap.source_identity), origin: String(bootstrap.threads_origin), bridge_api_key: credential,
    tenant_user_id: String(bootstrap.tenant_user_id), principal_ref: String(bootstrap.principal_ref), credential_version_ref: String(bootstrap.credential_version_ref),
    source_build_sha256: String(bootstrap.source_build_sha256), protected_probe: bootstrap.protected_probe as ThreadsSourceContext["protected_probe"], intents: bootstrap.intents as ThreadsSourceContext["intents"], operational_provenance: provenance,
  };
  const source = OperationalThreadsEvidenceSource.operational(context); const clock = new OperationalSystemClock(provenance);
  const custodian = new ProtectedCatfoodCustodian(join(CATFOOD_OPERATIONAL_ROOT, "control.db"), join(CATFOOD_OPERATIONAL_ROOT, "checkpoint.db"), source, clock);
  const configuredGoRoots = [...custodian.trust.go_keys.map((key) => key.key_id)].sort(); const expectedGoRoots = [...bootstrap.go_root_ids as string[]].sort();
  if (JSON.stringify(configuredGoRoots) !== JSON.stringify(expectedGoRoots)) { custodian.close(); throw new CatfoodTrustError("OPERATIONAL_GO_ROOT_MISMATCH"); }
  return custodian;
}
