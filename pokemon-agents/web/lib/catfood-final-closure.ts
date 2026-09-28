import { Database } from "bun:sqlite";
import { createHash, createPublicKey, verify } from "node:crypto";
import { closeSync, copyFileSync, existsSync, fstatSync, lstatSync, mkdtempSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { canonicalJson } from "./catfood-harness";
import { parseJsonNoDuplicateKeys } from "./catfood-coe";
import { CatfoodTrustError, type EvaluationResult } from "./catfood-trust";
import type { RoleRunScope } from "./catfood-role-channel";

export const CATFOOD_FINAL_CLOSURE_CHARTER = "WP3-FINAL-CLOSURE-CHARTER/1";
export const CATFOOD_SEALED_INPUT_SCHEMA = "catfood-sealed-input.v1";
export const CATFOOD_EVALUATION_RELEASE_SCHEMA = "catfood-custody-evaluation-release.v1";
export const CATFOOD_GO_ROOT_POLICY_SCHEMA = "catfood-go-root-policy.v1";
export const CATFOOD_GO_VERIFICATION_PROFILE_ID = "catfood-go-verification-profile.v1";
export const CATFOOD_EVALUATION_JOB_SCHEMA = "catfood-evaluation-job.v2";
export const CATFOOD_EVALUATION_JOB_STATE_SCHEMA = "catfood-evaluation-job-state.v1";
export const CATFOOD_EXPECTED_TARGET_SCHEMA = "catfood-expected-evaluation-target.v2";
export const CATFOOD_EVALUATION_JOB_PURPOSE = "IKORABU/WP3/CATFOOD/EVALUATION-JOB/V2";
export const CATFOOD_EVALUATION_JOB_STATE_PURPOSE = "IKORABU/WP3/CATFOOD/EVALUATION-JOB-STATE/V1";
export const CATFOOD_EXPECTED_TARGET_PURPOSE = "IKORABU/WP3/CATFOOD/EXPECTED-EVALUATION-TARGET/V2";
export const CATFOOD_COMPARISON_PROJECTION = "catfood-comparison-projection.v1";
export const CATFOOD_SQLITE_EXPORT_PROFILE = "sqlite3-standalone.v1";

const SHA256 = /^[0-9a-f]{64}$/;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:@\/-]{0,299}$/;
const MAX_DOCUMENT_BYTES = 4_000_000;

export interface SealedSnapshotReference {
  format: typeof CATFOOD_SQLITE_EXPORT_PROFILE;
  byte_length: number;
  raw_sha256: string;
  logical_schema_sha256: string;
}

export interface CatfoodSealedInputManifestV1 {
  schema: typeof CATFOOD_SEALED_INPUT_SCHEMA;
  charter: typeof CATFOOD_FINAL_CLOSURE_CHARTER;
  manifest_id: string;
  scope: RoleRunScope;
  window: Readonly<{ start: string; end: string }>;
  closure: Readonly<{ closed_source_event_id: string; run_closed_event_id: string; lifecycle: "CLOSED" }>;
  journal: Readonly<{ high_water: number; head_sha256: string }>;
  checkpoint: Readonly<{ checkpoint_id: string; checkpoint_sha256: string; pins_sha256: string }>;
  retained_source: Readonly<{ archive_sha256: string; source_digest: string; producer_identity: string }>;
  go: Readonly<{ artifact_sha256: string; verification_profile_id: string; verification_profile_sha256: string; root_fingerprints: readonly string[] }>;
  fixed: Readonly<{ dependencies_sha256: string; policy_sha256: string; kernel_sha256: string }>;
  trust: Readonly<{ environment_provenance_sha256: string; clock_provenance_sha256: string; acquisition_provenance_sha256: string; test_only: boolean }>;
  expected_bundle_sha256: string;
  pair_common_cut_sha256: string;
  control: SealedSnapshotReference;
  checkpoint_store: SealedSnapshotReference;
}

export interface GoRootPolicyRef {
  policy_id: string;
  policy_version: number;
  policy_sha256: string;
}

export interface CatfoodGoVerificationProfileV1 {
  profile_id: typeof CATFOOD_GO_VERIFICATION_PROFILE_ID;
  keys: readonly Readonly<{ key_id: string; public_key_sha256: string; not_before: string | null; not_after: string | null; revoked_at: string | null }>[];
}

export interface CatfoodGoRootPolicyV1 {
  schema: typeof CATFOOD_GO_ROOT_POLICY_SCHEMA;
  policy_id: string;
  policy_version: number;
  trust_domain: "TEST_ONLY" | "OPERATIONAL";
  owner: Readonly<{ authority_identity: string; authority_anchor_sha256: string; enrollment_namespace: string }>;
  purpose: Readonly<{ use: "Human GO"; go_schema: "catfood-human-go.v1"; algorithm: "Ed25519"; fingerprint: "SHA-256/SPKI-DER" }>;
  scope: Readonly<{ environment_type: string; environment_instance_id: string; deployment_id: string; organization_id: string; tenant_id: string; account_id: string }>;
  verification_profile: CatfoodGoVerificationProfileV1;
  applicability: Readonly<{ not_before: string; not_after: string; allow_new_go: boolean; allow_historical_verification: boolean; revoked_at: string | null }>;
  acceptance_policy_sha256: string;
}

export interface CatfoodEvaluationJobV1 {
  schema: typeof CATFOOD_EVALUATION_JOB_SCHEMA;
  charter: typeof CATFOOD_FINAL_CLOSURE_CHARTER;
  evaluation_job_id: string;
  release_id: string;
  release_sha256: string;
  manifest_id: string;
  manifest_sha256: string;
  go_root_policy_ref: GoRootPolicyRef;
  scope: RoleRunScope;
  window: Readonly<{ start: string; end: string }>;
  evaluator_session_id: string;
  evaluator_subject_sha256: string;
  evaluator_launch_id: string;
  evaluator_build_sha256: string;
  evaluator_snapshot_sha256: string;
  writer_session_id: string;
  writer_subject_sha256: string;
  writer_launch_id: string;
  role_evidence_sha256: string;
  stable_evaluator_request_id: string;
  reserved_assessment_id: string;
  workflow_instruction_id: string;
  workflow_instruction_sha256: string;
  expected_bundle_sha256: string;
  policy_sha256: string;
  kernel_sha256: string;
  comparison_projection: typeof CATFOOD_COMPARISON_PROJECTION;
  comparison_input_class_sha256: string;
  authority_incarnation: string;
  authority_revision: number;
  issued_at: string;
  commit_not_before: string;
  commit_not_after: string;
}

export interface SignedAuthorityDocument<T extends Record<string, unknown>> {
  algorithm: "Ed25519";
  key_id: string;
  purpose: string;
  payload_json: string;
  signature_base64url: string;
  payload: Readonly<T>;
  document_sha256: string;
}

function hash(value: string | Uint8Array): string { return createHash("sha256").update(value).digest("hex"); }
function object(value: unknown, code = "FINAL_CLOSURE_SCHEMA_INVALID"): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) throw new CatfoodTrustError(code); return value as Record<string, unknown>; }
function exact(value: Record<string, unknown>, fields: readonly string[], code = "FINAL_CLOSURE_SCHEMA_INVALID"): void { const got = Object.keys(value).sort(), want = [...fields].sort(); if (got.length !== want.length || got.some((field, index) => field !== want[index])) throw new CatfoodTrustError(code); }
function canonical(value: unknown, code = "FINAL_CLOSURE_SCHEMA_INVALID"): string { const text = canonicalJson(value as never); if (Buffer.byteLength(text) > MAX_DOCUMENT_BYTES) throw new CatfoodTrustError(code); return text; }
function token(value: unknown, code = "FINAL_CLOSURE_SCHEMA_INVALID"): string { if (typeof value !== "string" || !TOKEN.test(value)) throw new CatfoodTrustError(code); return value; }
function digest(value: unknown, code = "FINAL_CLOSURE_SCHEMA_INVALID"): string { if (typeof value !== "string" || !SHA256.test(value)) throw new CatfoodTrustError(code); return value; }
function utc(value: unknown, code = "FINAL_CLOSURE_SCHEMA_INVALID"): string { if (typeof value !== "string" || !Number.isFinite(Date.parse(value)) || new Date(Date.parse(value)).toISOString() !== value) throw new CatfoodTrustError(code); return value; }

export function goPublicKeyFingerprint(publicKeyPem: string): string {
  if (typeof publicKeyPem !== "string" || /PRIVATE KEY/.test(publicKeyPem)) throw new CatfoodTrustError("GO_ROOT_KEY_INVALID");
  try { const key = createPublicKey(publicKeyPem); if (key.asymmetricKeyType !== "ed25519") throw new Error(); return hash(key.export({ type: "spki", format: "der" }) as Buffer); }
  catch { throw new CatfoodTrustError("GO_ROOT_KEY_INVALID"); }
}

export function buildGoVerificationProfile(keys: readonly Readonly<{ key_id: string; public_key_pem: string }>[]): Readonly<CatfoodGoVerificationProfileV1> {
  if (!Array.isArray(keys) || keys.length < 1 || keys.length > 8) throw new CatfoodTrustError("GO_ROOT_PROFILE_INVALID");
  const rows = keys.map((key) => ({ key_id: token(key.key_id, "GO_ROOT_PROFILE_INVALID"), public_key_sha256: goPublicKeyFingerprint(key.public_key_pem), not_before: null, not_after: null, revoked_at: null })).sort((a, b) => a.key_id.localeCompare(b.key_id));
  if (new Set(rows.map((key) => key.key_id)).size !== rows.length || new Set(rows.map((key) => key.public_key_sha256)).size !== rows.length) throw new CatfoodTrustError("GO_ROOT_PROFILE_INVALID");
  return Object.freeze({ profile_id: CATFOOD_GO_VERIFICATION_PROFILE_ID, keys: Object.freeze(rows.map(Object.freeze)) });
}

function validateGoVerificationProfile(value: unknown): CatfoodGoVerificationProfileV1 {
  const profile = object(value, "GO_ROOT_PROFILE_INVALID"); exact(profile, ["keys", "profile_id"], "GO_ROOT_PROFILE_INVALID"); if (profile.profile_id !== CATFOOD_GO_VERIFICATION_PROFILE_ID || !Array.isArray(profile.keys) || profile.keys.length < 1 || profile.keys.length > 8) throw new CatfoodTrustError("GO_ROOT_PROFILE_INVALID");
  const keys = profile.keys.map((entry) => { const key = object(entry, "GO_ROOT_PROFILE_INVALID"); exact(key, ["key_id", "not_after", "not_before", "public_key_sha256", "revoked_at"], "GO_ROOT_PROFILE_INVALID"); token(key.key_id, "GO_ROOT_PROFILE_INVALID"); digest(key.public_key_sha256, "GO_ROOT_PROFILE_INVALID"); for (const field of ["not_before", "not_after", "revoked_at"] as const) if (key[field] !== null) utc(key[field], "GO_ROOT_PROFILE_INVALID"); if (key.not_before !== null && key.not_after !== null && Date.parse(String(key.not_before)) >= Date.parse(String(key.not_after))) throw new CatfoodTrustError("GO_ROOT_PROFILE_INVALID"); return Object.freeze(structuredClone(key)) as unknown as CatfoodGoVerificationProfileV1["keys"][number]; });
  if (new Set(keys.map((key) => key.key_id)).size !== keys.length || new Set(keys.map((key) => key.public_key_sha256)).size !== keys.length || canonical(keys) !== canonical([...keys].sort((a, b) => a.key_id.localeCompare(b.key_id)))) throw new CatfoodTrustError("GO_ROOT_PROFILE_INVALID");
  return Object.freeze({ profile_id: CATFOOD_GO_VERIFICATION_PROFILE_ID, keys: Object.freeze(keys) });
}

export function validateGoRootPolicy(value: unknown): Readonly<CatfoodGoRootPolicyV1> {
  const row = object(value, "GO_ROOT_POLICY_INVALID"); exact(row, ["acceptance_policy_sha256", "applicability", "owner", "policy_id", "policy_version", "purpose", "schema", "scope", "trust_domain", "verification_profile"], "GO_ROOT_POLICY_INVALID"); if (row.schema !== CATFOOD_GO_ROOT_POLICY_SCHEMA || !Number.isSafeInteger(row.policy_version) || Number(row.policy_version) < 1 || !["TEST_ONLY", "OPERATIONAL"].includes(String(row.trust_domain))) throw new CatfoodTrustError("GO_ROOT_POLICY_INVALID"); token(row.policy_id, "GO_ROOT_POLICY_INVALID"); digest(row.acceptance_policy_sha256, "GO_ROOT_POLICY_INVALID");
  const owner = object(row.owner, "GO_ROOT_POLICY_INVALID"); exact(owner, ["authority_anchor_sha256", "authority_identity", "enrollment_namespace"], "GO_ROOT_POLICY_INVALID"); token(owner.authority_identity, "GO_ROOT_POLICY_INVALID"); digest(owner.authority_anchor_sha256, "GO_ROOT_POLICY_INVALID"); token(owner.enrollment_namespace, "GO_ROOT_POLICY_INVALID");
  const purpose = object(row.purpose, "GO_ROOT_POLICY_INVALID"); exact(purpose, ["algorithm", "fingerprint", "go_schema", "use"], "GO_ROOT_POLICY_INVALID"); if (purpose.use !== "Human GO" || purpose.go_schema !== "catfood-human-go.v1" || purpose.algorithm !== "Ed25519" || purpose.fingerprint !== "SHA-256/SPKI-DER") throw new CatfoodTrustError("GO_ROOT_POLICY_INVALID");
  const scope = object(row.scope, "GO_ROOT_POLICY_INVALID"); exact(scope, ["account_id", "deployment_id", "environment_instance_id", "environment_type", "organization_id", "tenant_id"], "GO_ROOT_POLICY_INVALID"); for (const field of Object.keys(scope)) token(scope[field], "GO_ROOT_POLICY_INVALID");
  const applicability = object(row.applicability, "GO_ROOT_POLICY_INVALID"); exact(applicability, ["allow_historical_verification", "allow_new_go", "not_after", "not_before", "revoked_at"], "GO_ROOT_POLICY_INVALID"); const notBefore = utc(applicability.not_before, "GO_ROOT_POLICY_INVALID"), notAfter = utc(applicability.not_after, "GO_ROOT_POLICY_INVALID"); if (Date.parse(notBefore) >= Date.parse(notAfter) || typeof applicability.allow_new_go !== "boolean" || typeof applicability.allow_historical_verification !== "boolean" || applicability.revoked_at !== null && Date.parse(utc(applicability.revoked_at, "GO_ROOT_POLICY_INVALID")) < Date.parse(notBefore)) throw new CatfoodTrustError("GO_ROOT_POLICY_INVALID");
  const verificationProfile = validateGoVerificationProfile(row.verification_profile); return Object.freeze({ ...structuredClone(row), owner, purpose, scope, applicability, verification_profile: verificationProfile }) as unknown as Readonly<CatfoodGoRootPolicyV1>;
}

export function goRootPolicyRef(value: CatfoodGoRootPolicyV1): Readonly<GoRootPolicyRef> { const policy = validateGoRootPolicy(value); return Object.freeze({ policy_id: policy.policy_id, policy_version: policy.policy_version, policy_sha256: hash(canonical(policy)) }); }
export function validateGoRootPolicyRef(value: unknown): Readonly<GoRootPolicyRef> { const row = object(value, "GO_ROOT_POLICY_REF_INVALID"); exact(row, ["policy_id", "policy_sha256", "policy_version"], "GO_ROOT_POLICY_REF_INVALID"); token(row.policy_id, "GO_ROOT_POLICY_REF_INVALID"); digest(row.policy_sha256, "GO_ROOT_POLICY_REF_INVALID"); if (!Number.isSafeInteger(row.policy_version) || Number(row.policy_version) < 1) throw new CatfoodTrustError("GO_ROOT_POLICY_REF_INVALID"); return Object.freeze(structuredClone(row)) as unknown as Readonly<GoRootPolicyRef>; }

export function assertGoRootPolicyUse(input: { policy: CatfoodGoRootPolicyV1; expected_ref?: GoRootPolicyRef; trust_domain: "TEST_ONLY" | "OPERATIONAL"; scope: { environment_type: string; environment_instance_id: string; deployment_id: string; organization_id: string; tenant_id: string; account_id: string }; acceptance_policy_sha256: string; at: string; use: "NEW_GO" | "HISTORICAL"; actual_keys: readonly Readonly<{ key_id: string; public_key_pem: string; trust_class: "TEST_ONLY" | "OPERATIONAL" }>[] }): Readonly<{ policy: CatfoodGoRootPolicyV1; ref: GoRootPolicyRef; profile: CatfoodGoVerificationProfileV1 }> {
  const policy = validateGoRootPolicy(input.policy), ref = goRootPolicyRef(policy), expected = input.expected_ref ? validateGoRootPolicyRef(input.expected_ref) : ref, at = Date.parse(utc(input.at, "GO_ROOT_POLICY_NOT_APPLICABLE")); if (canonical(ref) !== canonical(expected)) throw new CatfoodTrustError("GO_ROOT_POLICY_REF_MISMATCH");
  if (policy.trust_domain !== input.trust_domain || canonical(policy.scope) !== canonical(input.scope) || policy.acceptance_policy_sha256 !== input.acceptance_policy_sha256 || input.actual_keys.some((key) => key.trust_class !== policy.trust_domain)) throw new CatfoodTrustError("GO_ROOT_POLICY_SCOPE_MISMATCH");
  const applicability = policy.applicability, permitted = input.use === "NEW_GO" ? applicability.allow_new_go : applicability.allow_historical_verification; if (!permitted || at < Date.parse(applicability.not_before) || at >= Date.parse(applicability.not_after) || applicability.revoked_at !== null && at >= Date.parse(applicability.revoked_at)) throw new CatfoodTrustError("GO_ROOT_POLICY_NOT_APPLICABLE");
  const profile = buildGoVerificationProfile(input.actual_keys); if (canonical(profile) !== canonical(policy.verification_profile)) throw new CatfoodTrustError("GO_ROOT_PROFILE_MISMATCH"); return Object.freeze({ policy, ref, profile });
}

export function assertManifestGoRootPolicy(input: { policy: CatfoodGoRootPolicyV1; expected_ref: GoRootPolicyRef; manifest: CatfoodSealedInputManifestV1; trust_domain: "TEST_ONLY" | "OPERATIONAL" }): void {
  const policy = validateGoRootPolicy(input.policy), ref = goRootPolicyRef(policy), expected = validateGoRootPolicyRef(input.expected_ref), manifest = validateSealedInputManifest(input.manifest), scope = manifest.scope; if (canonical(ref) !== canonical(expected)) throw new CatfoodTrustError("GO_ROOT_POLICY_REF_MISMATCH");
  if (policy.trust_domain !== input.trust_domain || canonical(policy.scope) !== canonical({ environment_type: scope.environment_type, environment_instance_id: scope.environment_instance_id, deployment_id: scope.deployment_id, organization_id: scope.organization_id, tenant_id: scope.tenant_id, account_id: scope.account_id }) || policy.acceptance_policy_sha256 !== manifest.fixed.policy_sha256 || input.trust_domain === "TEST_ONLY" && manifest.trust.test_only !== true || input.trust_domain === "OPERATIONAL" && manifest.trust.test_only !== false) throw new CatfoodTrustError("GO_ROOT_POLICY_SCOPE_MISMATCH");
  const profile = policy.verification_profile, profileSha = hash(canonical(profile)), roots = profile.keys.map((key) => key.public_key_sha256).sort(); if (manifest.go.verification_profile_id !== profile.profile_id || manifest.go.verification_profile_sha256 !== profileSha || canonical(manifest.go.root_fingerprints) !== canonical(roots)) throw new CatfoodTrustError("GO_ROOT_PROFILE_MISMATCH");
  const at = Date.parse(manifest.window.start), applicability = policy.applicability; if (!applicability.allow_historical_verification || at < Date.parse(applicability.not_before) || at >= Date.parse(applicability.not_after) || applicability.revoked_at !== null && at >= Date.parse(applicability.revoked_at)) throw new CatfoodTrustError("GO_ROOT_POLICY_NOT_APPLICABLE");
}

function validateScope(scopeValue: unknown): RoleRunScope {
  const scope = object(scopeValue); exact(scope, ["account_id", "deployment_id", "environment_instance_id", "environment_type", "organization_id", "run_id", "spec_sha256", "tenant_id"]);
  for (const field of ["account_id", "deployment_id", "environment_instance_id", "environment_type", "organization_id", "run_id", "tenant_id"]) token(scope[field]); digest(scope.spec_sha256);
  return Object.freeze(structuredClone(scope)) as unknown as RoleRunScope;
}

function validateSnapshot(value: unknown): SealedSnapshotReference {
  const row = object(value); exact(row, ["byte_length", "format", "logical_schema_sha256", "raw_sha256"]);
  if (row.format !== CATFOOD_SQLITE_EXPORT_PROFILE || !Number.isSafeInteger(row.byte_length) || Number(row.byte_length) <= 0) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_INVALID");
  digest(row.raw_sha256, "SEALED_INPUT_SNAPSHOT_INVALID"); digest(row.logical_schema_sha256, "SEALED_INPUT_SNAPSHOT_INVALID");
  return Object.freeze(structuredClone(row)) as unknown as SealedSnapshotReference;
}

export function validateSealedInputManifest(value: unknown): Readonly<CatfoodSealedInputManifestV1> {
  const row = object(value, "SEALED_INPUT_MANIFEST_INVALID"); exact(row, ["charter", "checkpoint", "checkpoint_store", "closure", "control", "expected_bundle_sha256", "fixed", "go", "journal", "manifest_id", "pair_common_cut_sha256", "retained_source", "schema", "scope", "trust", "window"], "SEALED_INPUT_MANIFEST_INVALID");
  if (row.schema !== CATFOOD_SEALED_INPUT_SCHEMA || row.charter !== CATFOOD_FINAL_CLOSURE_CHARTER) throw new CatfoodTrustError("SEALED_INPUT_MANIFEST_INVALID"); token(row.manifest_id, "SEALED_INPUT_MANIFEST_INVALID"); const scope = validateScope(row.scope);
  const window = object(row.window); exact(window, ["end", "start"]); const start = utc(window.start), end = utc(window.end); if (Date.parse(start) >= Date.parse(end)) throw new CatfoodTrustError("SEALED_INPUT_MANIFEST_INVALID");
  const closure = object(row.closure); exact(closure, ["closed_source_event_id", "lifecycle", "run_closed_event_id"]); token(closure.closed_source_event_id); token(closure.run_closed_event_id); if (closure.lifecycle !== "CLOSED") throw new CatfoodTrustError("SEALED_INPUT_MANIFEST_INVALID");
  const journal = object(row.journal); exact(journal, ["head_sha256", "high_water"]); if (!Number.isSafeInteger(journal.high_water) || Number(journal.high_water) < 1) throw new CatfoodTrustError("SEALED_INPUT_MANIFEST_INVALID"); digest(journal.head_sha256);
  const checkpoint = object(row.checkpoint); exact(checkpoint, ["checkpoint_id", "checkpoint_sha256", "pins_sha256"]); token(checkpoint.checkpoint_id); digest(checkpoint.checkpoint_sha256); digest(checkpoint.pins_sha256);
  const retained = object(row.retained_source); exact(retained, ["archive_sha256", "producer_identity", "source_digest"]); digest(retained.archive_sha256); digest(retained.source_digest); token(retained.producer_identity);
  const go = object(row.go); exact(go, ["artifact_sha256", "root_fingerprints", "verification_profile_id", "verification_profile_sha256"]); digest(go.artifact_sha256); token(go.verification_profile_id); digest(go.verification_profile_sha256); if (!Array.isArray(go.root_fingerprints) || go.root_fingerprints.length < 1 || go.root_fingerprints.some((item) => typeof item !== "string" || !SHA256.test(item)) || new Set(go.root_fingerprints).size !== go.root_fingerprints.length || canonical(go.root_fingerprints) !== canonical([...go.root_fingerprints].sort())) throw new CatfoodTrustError("SEALED_INPUT_MANIFEST_INVALID");
  const fixed = object(row.fixed); exact(fixed, ["dependencies_sha256", "kernel_sha256", "policy_sha256"]); digest(fixed.dependencies_sha256); digest(fixed.kernel_sha256); digest(fixed.policy_sha256);
  const trust = object(row.trust); exact(trust, ["acquisition_provenance_sha256", "clock_provenance_sha256", "environment_provenance_sha256", "test_only"]); digest(trust.acquisition_provenance_sha256); digest(trust.clock_provenance_sha256); digest(trust.environment_provenance_sha256); if (typeof trust.test_only !== "boolean") throw new CatfoodTrustError("SEALED_INPUT_MANIFEST_INVALID");
  digest(row.expected_bundle_sha256); digest(row.pair_common_cut_sha256); const control = validateSnapshot(row.control), checkpointStore = validateSnapshot(row.checkpoint_store);
  return Object.freeze({ ...structuredClone(row), scope, window: { start, end }, control, checkpoint_store: checkpointStore }) as unknown as Readonly<CatfoodSealedInputManifestV1>;
}

export function sealedInputManifestSha256(value: CatfoodSealedInputManifestV1): string { return hash(canonical(validateSealedInputManifest(value))); }

function sqliteSchemaSha256(path: string): string {
  const db = new Database(path, { readonly: true, strict: true, create: false });
  try {
    const integrity = db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get(); if (integrity?.integrity_check !== "ok") throw new CatfoodTrustError("SEALED_INPUT_SQLITE_INVALID");
    const rows = db.query<{ type: string; name: string; tbl_name: string; sql: string | null }, []>("SELECT type,name,tbl_name,sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type,name,tbl_name").all();
    const mode = db.query<{ journal_mode: string }, []>("PRAGMA journal_mode").get()?.journal_mode?.toLowerCase(); if (mode !== "delete") throw new CatfoodTrustError("SEALED_INPUT_SQLITE_PROFILE_INVALID");
    return hash(canonical(rows));
  } finally { db.close(); }
}

export function inspectStandaloneSqlite(pathInput: string): Readonly<SealedSnapshotReference> {
  const path = resolve(pathInput), stat = lstatSync(path); if (!stat.isFile() || stat.isSymbolicLink() || stat.size <= 0) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_INVALID");
  const bytes = readFileSync(path); return Object.freeze({ format: CATFOOD_SQLITE_EXPORT_PROFILE, byte_length: bytes.byteLength, raw_sha256: hash(bytes), logical_schema_sha256: sqliteSchemaSha256(path) });
}

/** Creates a SQLite-managed standalone copy without mutating the source database. */
export function exportStandaloneSqlite(sourceInput: string, destinationInput: string): Readonly<SealedSnapshotReference> {
  const source = resolve(sourceInput), destination = resolve(destinationInput); if (source === destination || dirname(destination) === destination) throw new CatfoodTrustError("SEALED_INPUT_EXPORT_INVALID");
  const sourceStat = lstatSync(source); if (!sourceStat.isFile() || sourceStat.isSymbolicLink()) throw new CatfoodTrustError("SEALED_INPUT_EXPORT_INVALID");
  const temporary = `${destination}.partial`; rmSync(temporary, { force: true }); rmSync(destination, { force: true });
  const db = new Database(source, { readonly: true, strict: true, create: false });
  try { db.query("VACUUM INTO ?").run(temporary); } finally { db.close(); }
  const exported = new Database(temporary, { strict: true, create: false });
  try { exported.exec("PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL;"); } finally { exported.close(); }
  const fd = openSync(temporary, "r"); try { fstatSync(fd); } finally { closeSync(fd); }
  renameSync(temporary, destination); return inspectStandaloneSqlite(destination);
}

/** Copies already-published bytes and proves the relocated representation is identical. */
export function relocateSealedSnapshot(sourceInput: string, destinationInput: string, expected: SealedSnapshotReference): void {
  const source = inspectStandaloneSqlite(sourceInput); if (canonical(source) !== canonical(expected)) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_MISMATCH"); copyFileSync(resolve(sourceInput), resolve(destinationInput)); const copied = inspectStandaloneSqlite(destinationInput); if (canonical(copied) !== canonical(expected)) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_MISMATCH");
}

function readExactSnapshot(pathInput: string, expected: SealedSnapshotReference): Buffer {
  const path = resolve(pathInput); if (existsSync(`${path}-wal`) || existsSync(`${path}-journal`) || lstatSync(path).isSymbolicLink()) throw new CatfoodTrustError("SEALED_INPUT_SIDECAR_FORBIDDEN"); const before = lstatSync(path), fd = openSync(path, "r"); try { const opened = fstatSync(fd); if (!opened.isFile() || opened.dev !== before.dev || opened.ino !== before.ino || opened.size !== before.size || opened.size !== expected.byte_length) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_CHANGED"); const bytes = readFileSync(fd); if (bytes.byteLength !== expected.byte_length || hash(bytes) !== expected.raw_sha256) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_MISMATCH"); const after = fstatSync(fd); if (after.size !== opened.size || after.mtimeMs !== opened.mtimeMs) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_CHANGED"); return bytes; } finally { closeSync(fd); }
}

/** Reads each published snapshot through one stable handle and stages only the verified bytes. */
export function stageVerifiedEvaluationMaterial(input: { manifest: CatfoodSealedInputManifestV1; job: CatfoodEvaluationJobV1; control_path: string; checkpoint_path: string }): Readonly<{ control_path: string; checkpoint_path: string; close(): void }> {
  const manifest = validateSealedInputManifest(input.manifest), job = validateEvaluationJob(input.job); if (job.manifest_id !== manifest.manifest_id || job.manifest_sha256 !== sealedInputManifestSha256(manifest) || job.expected_bundle_sha256 !== manifest.expected_bundle_sha256 || canonical(job.scope) !== canonical(manifest.scope)) throw new CatfoodTrustError("EVALUATION_JOB_MATERIAL_MISMATCH"); const controlBytes = readExactSnapshot(input.control_path, manifest.control), checkpointBytes = readExactSnapshot(input.checkpoint_path, manifest.checkpoint_store), directory = mkdtempSync(resolve(tmpdir(), "ikorabu-catfood-evaluation-")), controlPath = resolve(directory, "control.db"), checkpointPath = resolve(directory, "checkpoint.db"); try { writeFileSync(controlPath, controlBytes, { flag: "wx", mode: 0o600 }); writeFileSync(checkpointPath, checkpointBytes, { flag: "wx", mode: 0o600 }); if (canonical(inspectStandaloneSqlite(controlPath)) !== canonical(manifest.control) || canonical(inspectStandaloneSqlite(checkpointPath)) !== canonical(manifest.checkpoint_store)) throw new CatfoodTrustError("SEALED_INPUT_SNAPSHOT_MISMATCH"); return Object.freeze({ control_path: controlPath, checkpoint_path: checkpointPath, close() { rmSync(directory, { recursive: true, force: true }); } }); } catch (error) { rmSync(directory, { recursive: true, force: true }); throw error; }
}

export function verifySignedAuthorityDocument<T extends Record<string, unknown>>(value: unknown, expected: { purpose: string; key_id: string; public_key_pem: string }): SignedAuthorityDocument<T> {
  const row = object(value, "AUTHORITY_DOCUMENT_INVALID"); exact(row, ["algorithm", "document_sha256", "key_id", "payload_json", "purpose", "signature_base64url"]); if (row.algorithm !== "Ed25519" || row.key_id !== expected.key_id || row.purpose !== expected.purpose || typeof row.payload_json !== "string" || typeof row.signature_base64url !== "string") throw new CatfoodTrustError("AUTHORITY_DOCUMENT_INVALID");
  const parsed = parseJsonNoDuplicateKeys(row.payload_json, MAX_DOCUMENT_BYTES, 64); if (canonical(parsed) !== row.payload_json || row.document_sha256 !== hash(canonical({ algorithm: row.algorithm, key_id: row.key_id, purpose: row.purpose, payload_json: row.payload_json, signature_base64url: row.signature_base64url }))) throw new CatfoodTrustError("AUTHORITY_DOCUMENT_INVALID");
  const signature = Buffer.from(row.signature_base64url, "base64url"); if (signature.toString("base64url") !== row.signature_base64url || !verify(null, Buffer.from(`${expected.purpose}\n${row.payload_json}`), createPublicKey(expected.public_key_pem), signature)) throw new CatfoodTrustError("AUTHORITY_DOCUMENT_INVALID");
  return Object.freeze({ ...row, payload: Object.freeze(parsed as T) }) as unknown as SignedAuthorityDocument<T>;
}

export function validateEvaluationJob(value: unknown): Readonly<CatfoodEvaluationJobV1> {
  const row = object(value, "EVALUATION_JOB_INVALID"); exact(row, ["authority_incarnation", "authority_revision", "charter", "commit_not_after", "commit_not_before", "comparison_input_class_sha256", "comparison_projection", "evaluation_job_id", "evaluator_build_sha256", "evaluator_launch_id", "evaluator_session_id", "evaluator_snapshot_sha256", "evaluator_subject_sha256", "expected_bundle_sha256", "go_root_policy_ref", "issued_at", "kernel_sha256", "manifest_id", "manifest_sha256", "policy_sha256", "release_id", "release_sha256", "reserved_assessment_id", "role_evidence_sha256", "schema", "scope", "stable_evaluator_request_id", "window", "workflow_instruction_id", "workflow_instruction_sha256", "writer_launch_id", "writer_session_id", "writer_subject_sha256"], "EVALUATION_JOB_INVALID");
  if (row.schema !== CATFOOD_EVALUATION_JOB_SCHEMA || row.charter !== CATFOOD_FINAL_CLOSURE_CHARTER || row.comparison_projection !== CATFOOD_COMPARISON_PROJECTION) throw new CatfoodTrustError("EVALUATION_JOB_INVALID");
  for (const field of ["authority_incarnation", "evaluation_job_id", "evaluator_launch_id", "evaluator_session_id", "manifest_id", "release_id", "reserved_assessment_id", "stable_evaluator_request_id", "workflow_instruction_id", "writer_launch_id", "writer_session_id"]) token(row[field], "EVALUATION_JOB_INVALID");
  for (const field of ["comparison_input_class_sha256", "evaluator_build_sha256", "evaluator_snapshot_sha256", "evaluator_subject_sha256", "expected_bundle_sha256", "kernel_sha256", "manifest_sha256", "policy_sha256", "release_sha256", "role_evidence_sha256", "workflow_instruction_sha256", "writer_subject_sha256"]) digest(row[field], "EVALUATION_JOB_INVALID");
  if (!Number.isSafeInteger(row.authority_revision) || Number(row.authority_revision) < 1) throw new CatfoodTrustError("EVALUATION_JOB_INVALID"); const issued = utc(row.issued_at), before = utc(row.commit_not_before), after = utc(row.commit_not_after); if (Date.parse(issued) > Date.parse(before) || Date.parse(before) >= Date.parse(after)) throw new CatfoodTrustError("EVALUATION_JOB_INVALID"); const scope = validateScope(row.scope), window = object(row.window); exact(window, ["end", "start"]); if (utc(window.start) >= utc(window.end)) throw new CatfoodTrustError("EVALUATION_JOB_INVALID");
  const goPolicyRef = validateGoRootPolicyRef(row.go_root_policy_ref); return Object.freeze({ ...structuredClone(row), scope, go_root_policy_ref: goPolicyRef }) as unknown as Readonly<CatfoodEvaluationJobV1>;
}

export function comparisonSemanticProjection(core: Record<string, unknown>): Readonly<Record<string, unknown>> {
  const evaluator = object(core.evaluator, "COMPARISON_PROJECTION_INVALID"); const allowedRemoved = new Set(["subject", "session_id", "launch_id", "action_key_fingerprint"]); const projectedEvaluator = Object.fromEntries(Object.entries(evaluator).filter(([key]) => !allowedRemoved.has(key)));
  if (Object.keys(evaluator).some((key) => !allowedRemoved.has(key) && !(key in projectedEvaluator))) throw new CatfoodTrustError("COMPARISON_PROJECTION_INVALID");
  return Object.freeze({ ...structuredClone(core), evaluator: projectedEvaluator, comparison_projection: CATFOOD_COMPARISON_PROJECTION });
}

export function comparisonSemanticSha256(core: Record<string, unknown>): string { return hash(canonical(comparisonSemanticProjection(core))); }

export function classifyExpectedVerification(input: { artifact_verdict: EvaluationResult["verdict"]; authentic: boolean; target_match: boolean; current_clearance: boolean; contradiction: boolean; as_of_revision: number }): Readonly<{ verdict: EvaluationResult["verdict"]; authentic: boolean; target_match: boolean; current_clearance: boolean; as_of_revision: number }> {
  if (!Number.isSafeInteger(input.as_of_revision) || input.as_of_revision < 1) throw new CatfoodTrustError("EXPECTED_VERIFICATION_INVALID");
  const verdict = !input.authentic || !input.target_match || input.contradiction ? "FAIL" : !input.current_clearance ? "BLOCKED" : input.artifact_verdict;
  return Object.freeze({ verdict, authentic: input.authentic, target_match: input.target_match, current_clearance: input.current_clearance && !input.contradiction, as_of_revision: input.as_of_revision });
}
