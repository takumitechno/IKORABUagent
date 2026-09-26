import { Database } from "bun:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  CATFOOD_EVALUATOR_VERSION,
  CatfoodError,
  canonicalJson,
  evaluateClosedBundle,
  openCatfoodStore,
  sha256,
} from "./catfood-harness";

export const CATFOOD_ATTESTATION_SCHEMA_SQL = `
CREATE TABLE acceptance_attestations (
  attestation_id TEXT PRIMARY KEY,
  bundle_sha256 TEXT NOT NULL,
  evaluator_identity TEXT NOT NULL,
  evaluator_version TEXT NOT NULL,
  result TEXT NOT NULL CHECK(result IN('PASS','FAIL','BLOCKED')),
  reason_codes_json TEXT NOT NULL CHECK(json_valid(reason_codes_json)),
  attested_at TEXT NOT NULL,
  UNIQUE(bundle_sha256,evaluator_identity,evaluator_version)
);
CREATE TRIGGER acceptance_attestations_no_update BEFORE UPDATE ON acceptance_attestations BEGIN SELECT RAISE(ABORT,'acceptance attestations are immutable'); END;
CREATE TRIGGER acceptance_attestations_no_delete BEFORE DELETE ON acceptance_attestations BEGIN SELECT RAISE(ABORT,'acceptance attestations are immutable'); END;
`;

export function initializeAttestationStore(path: string): void {
  const target = resolve(path);
  if (!existsSync(target)) throw new CatfoodError("ATTESTATION_STORE_MUST_PREEXIST");
  const db = new Database(target, { strict: true, create: false });
  try {
    const existing = db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get()?.n ?? 0;
    if (existing) throw new CatfoodError("ATTESTATION_STORE_NOT_EMPTY");
    db.exec("PRAGMA journal_mode=WAL"); db.exec("PRAGMA synchronous=FULL"); db.exec(CATFOOD_ATTESTATION_SCHEMA_SQL);
  } finally { db.close(); }
}

export function attestClosedRun(evidencePath: string, attestationPath: string, runId: string, evaluatorIdentity: string, attestedAt: string): string {
  if (resolve(evidencePath) === resolve(attestationPath)) throw new CatfoodError("ATTESTATION_STORE_MUST_BE_SEPARATE");
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(evaluatorIdentity)) throw new CatfoodError("EVALUATOR_IDENTITY_INVALID");
  const evidence = openCatfoodStore(evidencePath, true);
  let bundle: { bundle_json: string; bundle_sha256: string } | null;
  try {
    bundle = evidence.query<{ bundle_json: string; bundle_sha256: string }, [string]>("SELECT bundle_json,bundle_sha256 FROM catfood_evidence_bundles WHERE run_id=?").get(runId) ?? null;
  } finally { evidence.close(); }
  if (!bundle) throw new CatfoodError("CLOSED_BUNDLE_MISSING");
  const evaluation = evaluateClosedBundle(bundle.bundle_json, bundle.bundle_sha256);
  if (evaluation.result === "NOT_EVALUATED") throw new CatfoodError("EVALUATION_INCOMPLETE");
  const attestation = new Database(resolve(attestationPath), { strict: true, create: false });
  try {
    const schema = attestation.query<{ name: string }, []>("SELECT name FROM sqlite_master WHERE type='table' AND name='acceptance_attestations'").get();
    if (!schema) throw new CatfoodError("ATTESTATION_STORE_UNHEALTHY");
    const id = `att:${sha256(canonicalJson({ bundle_sha256: bundle.bundle_sha256, evaluator_identity: evaluatorIdentity, evaluator_version: CATFOOD_EVALUATOR_VERSION })).slice(0, 32)}`;
    attestation.query("INSERT INTO acceptance_attestations VALUES (?,?,?,?,?,?,?)").run(
      id, bundle.bundle_sha256, evaluatorIdentity, CATFOOD_EVALUATOR_VERSION,
      evaluation.result, canonicalJson(evaluation.reason_codes), attestedAt,
    );
    return id;
  } finally { attestation.close(); }
}
