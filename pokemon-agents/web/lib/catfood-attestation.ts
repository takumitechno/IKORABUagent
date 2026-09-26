import { Database } from "bun:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { CatfoodError } from "./catfood-harness";

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
  void evidencePath; void attestationPath; void runId; void evaluatorIdentity; void attestedAt;
  throw new CatfoodError("LEGACY_UNTRUSTED");
}
