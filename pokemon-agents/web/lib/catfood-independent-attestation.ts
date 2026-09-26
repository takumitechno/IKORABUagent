import { Database } from "bun:sqlite";
import { createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalJson, sha256 } from "./catfood-harness";
import {
  CATFOOD_EVALUATOR_SHA256, CATFOOD_POLICY_SHA256, CatfoodTrustError, IndependentCatfoodEvaluator,
  type EvaluationResult, type ReadonlyThreadsEvidenceSource,
} from "./catfood-trust";

export const CATFOOD_ATTESTATION_SCHEMA = "catfood-independent-attestation.v1";
export const CATFOOD_ATTESTATION_DOMAIN = "IKORABU/WP3/CATFOOD/ATTESTATION/V1";

export interface AttestationStoreConfig {
  writer_identity: string;
  signing_key_id: string;
  signing_public_key_pem: string;
}

const SQL = `
CREATE TABLE attestation_meta(singleton INTEGER PRIMARY KEY CHECK(singleton=1),schema_version TEXT NOT NULL,writer_identity TEXT NOT NULL,signing_key_id TEXT NOT NULL,signing_public_key_pem TEXT NOT NULL,evaluator_sha256 TEXT NOT NULL,policy_sha256 TEXT NOT NULL) STRICT;
CREATE TRIGGER attestation_meta_no_update BEFORE UPDATE ON attestation_meta BEGIN SELECT RAISE(ABORT,'attestation metadata is immutable'); END;
CREATE TRIGGER attestation_meta_no_delete BEFORE DELETE ON attestation_meta BEGIN SELECT RAISE(ABORT,'attestation metadata is immutable'); END;
CREATE TABLE independent_attestations(attestation_id TEXT PRIMARY KEY,run_id TEXT NOT NULL,scope_sha256 TEXT NOT NULL,go_sha256 TEXT NOT NULL,policy_sha256 TEXT NOT NULL,ikorabu_release_sha TEXT NOT NULL,threads_sha TEXT NOT NULL,boundary_sha256 TEXT NOT NULL,threads_release_sha256 TEXT NOT NULL,threads_schema INTEGER NOT NULL,evaluator_sha256 TEXT NOT NULL,checkpoint_id TEXT NOT NULL,evidence_coverage TEXT NOT NULL,bundle_sha256 TEXT NOT NULL,verdict TEXT NOT NULL CHECK(verdict IN('PASS','FAIL','BLOCKED')),reason_codes_json TEXT NOT NULL CHECK(json_valid(reason_codes_json)),test_only INTEGER NOT NULL CHECK(test_only IN(0,1)),writer_identity TEXT NOT NULL,signing_key_id TEXT NOT NULL,attested_at TEXT NOT NULL,payload_json TEXT NOT NULL CHECK(json_valid(payload_json)),signature_base64url TEXT NOT NULL,UNIQUE(run_id,bundle_sha256,evaluator_sha256)) STRICT;
CREATE TRIGGER attestations_no_update BEFORE UPDATE ON independent_attestations BEGIN SELECT RAISE(ABORT,'attestations are create-only'); END;
CREATE TRIGGER attestations_no_delete BEFORE DELETE ON independent_attestations BEGIN SELECT RAISE(ABORT,'attestations are create-only'); END;
`;

export function initializeIndependentAttestationStore(path: string, config: AttestationStoreConfig): void {
  if (!existsSync(resolve(path))) throw new CatfoodTrustError("ATTESTATION_STORE_MUST_PREEXIST");
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(config.writer_identity) || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(config.signing_key_id)) throw new CatfoodTrustError("ATTESTATION_CONFIG_INVALID");
  const publicKey = createPublicKey(config.signing_public_key_pem); if (publicKey.asymmetricKeyType !== "ed25519") throw new CatfoodTrustError("ATTESTATION_KEY_INVALID");
  const db = new Database(resolve(path), { strict: true, create: false });
  try { if ((db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get()?.n ?? 0) !== 0) throw new CatfoodTrustError("ATTESTATION_STORE_NOT_EMPTY"); db.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA recursive_triggers=ON;"); db.exec(SQL); db.query("INSERT INTO attestation_meta VALUES(1,?,?,?,?,?,?)").run(CATFOOD_ATTESTATION_SCHEMA, config.writer_identity, config.signing_key_id, config.signing_public_key_pem, CATFOOD_EVALUATOR_SHA256, CATFOOD_POLICY_SHA256); }
  finally { db.close(); }
}

export class IndependentCatfoodAttestationWriter {
  private readonly db: Database;
  private readonly evaluator: IndependentCatfoodEvaluator;
  private readonly privateKey: ReturnType<typeof createPrivateKey>;
  private readonly meta: Record<string, unknown>;

  constructor(controlPath: string, checkpointPath: string, attestationPath: string, source: ReadonlyThreadsEvidenceSource, privateKeyPem: string) {
    if ([resolve(controlPath), resolve(checkpointPath)].includes(resolve(attestationPath))) throw new CatfoodTrustError("ATTESTATION_STORE_MUST_BE_SEPARATE");
    this.db = new Database(resolve(attestationPath), { strict: true, create: false });
    try {
      this.db.exec("PRAGMA recursive_triggers=ON; PRAGMA synchronous=FULL;");
      this.meta = this.db.query<Record<string, unknown>, []>("SELECT * FROM attestation_meta WHERE singleton=1").get() ?? {};
      const required = ["attestation_meta", "attestation_meta_no_update", "attestation_meta_no_delete", "independent_attestations", "attestations_no_update", "attestations_no_delete"];
      const present = new Set(this.db.query<{ name: string }, []>("SELECT name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'").all().map((row) => row.name));
      const recursive = Number(Object.values(this.db.query<Record<string, unknown>, []>("PRAGMA recursive_triggers").get() ?? {})[0]);
      if (required.some((name) => !present.has(name)) || recursive !== 1 || this.meta.schema_version !== CATFOOD_ATTESTATION_SCHEMA || this.meta.evaluator_sha256 !== CATFOOD_EVALUATOR_SHA256 || this.meta.policy_sha256 !== CATFOOD_POLICY_SHA256) throw new CatfoodTrustError("ATTESTATION_STORE_UNHEALTHY");
      this.privateKey = createPrivateKey(privateKeyPem); if (this.privateKey.asymmetricKeyType !== "ed25519") throw new Error();
      const actual = createPublicKey(this.privateKey).export({ type: "spki", format: "der" }); const pinned = createPublicKey(String(this.meta.signing_public_key_pem)).export({ type: "spki", format: "der" });
      if (!actual.equals(pinned)) throw new CatfoodTrustError("ATTESTATION_SIGNING_KEY_MISMATCH");
      this.evaluator = new IndependentCatfoodEvaluator(controlPath, checkpointPath, source);
    } catch (error) { this.db.close(); throw error; }
  }

  close(): void { this.evaluator.close(); this.db.close(); }

  attest(runId: string, attestedAt: string): string {
    const evaluation = this.evaluator.evaluate(runId); const bundle = this.evaluator.rederive(runId);
    if (evaluation.rederived_bundle_sha256 !== sha256(canonicalJson(bundle))) throw new CatfoodTrustError("EVALUATOR_OUTPUT_MISMATCH");
    const spec = bundle.spec as Record<string, unknown>; const go = bundle.go as Record<string, unknown>; const checkpoint = bundle.checkpoint as Record<string, unknown>;
    const scope = { run_id: runId, environment_type: spec.environment_type, environment_instance_id: spec.environment_instance_id, organization_id: spec.organization_id, tenant_id: spec.tenant_id, account_id: spec.account_id };
    const payload = { domain: CATFOOD_ATTESTATION_DOMAIN, schema: CATFOOD_ATTESTATION_SCHEMA, run_id: runId, scope_sha256: sha256(canonicalJson(scope)), go_sha256: go.artifact_sha256, policy_sha256: CATFOOD_POLICY_SHA256, ikorabu_release_sha: spec.ikorabu_release_sha, threads_sha: spec.threads_sha, boundary_sha256: spec.operational_boundary_sha256, threads_release_sha256: spec.threads_release_sha256, threads_schema: spec.threads_schema, evaluator_sha256: CATFOOD_EVALUATOR_SHA256, checkpoint_id: checkpoint.checkpoint_id, evidence_coverage: "COMPLETE", bundle_sha256: evaluation.rederived_bundle_sha256, verdict: evaluation.verdict, reason_codes: evaluation.reason_codes, test_only: evaluation.test_only, writer_identity: this.meta.writer_identity, signing_key_id: this.meta.signing_key_id, attested_at: attestedAt };
    const text = canonicalJson(payload); const signature = sign(null, Buffer.from(`${CATFOOD_ATTESTATION_DOMAIN}\n${text}`), this.privateKey).toString("base64url"); const id = `att:${sha256(`${text}.${signature}`).slice(0, 32)}`;
    this.db.query("INSERT INTO independent_attestations VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(id, runId, payload.scope_sha256, payload.go_sha256, payload.policy_sha256, payload.ikorabu_release_sha, payload.threads_sha, payload.boundary_sha256, payload.threads_release_sha256, payload.threads_schema, payload.evaluator_sha256, payload.checkpoint_id, payload.evidence_coverage, payload.bundle_sha256, payload.verdict, canonicalJson(payload.reason_codes), payload.test_only ? 1 : 0, payload.writer_identity, payload.signing_key_id, payload.attested_at, text, signature);
    return id;
  }
}

export function verifyIndependentAttestation(payloadJson: string, signatureBase64url: string, publicKeyPem: string, expected: { run_id: string; bundle_sha256: string }): EvaluationResult["verdict"] {
  const payload = JSON.parse(payloadJson) as Record<string, unknown>;
  if (canonicalJson(payload) !== payloadJson || payload.domain !== CATFOOD_ATTESTATION_DOMAIN || payload.schema !== CATFOOD_ATTESTATION_SCHEMA || payload.evaluator_sha256 !== CATFOOD_EVALUATOR_SHA256 || payload.policy_sha256 !== CATFOOD_POLICY_SHA256) throw new CatfoodTrustError("ATTESTATION_INVALID");
  if (payload.run_id !== expected.run_id || payload.bundle_sha256 !== expected.bundle_sha256) throw new CatfoodTrustError("ATTESTATION_BINDING_MISMATCH");
  if (!verify(null, Buffer.from(`${CATFOOD_ATTESTATION_DOMAIN}\n${payloadJson}`), createPublicKey(publicKeyPem), Buffer.from(signatureBase64url, "base64url"))) throw new CatfoodTrustError("ATTESTATION_SIGNATURE_INVALID");
  return payload.verdict as EvaluationResult["verdict"];
}
