#!/usr/bin/env bun
/** Apply demo provenance migration only with an explicit flag; never classifies rows. */
import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { CANONICAL_RUNTIME_DB, REPO_ROOT, resolveAgentsDbPath, validateRuntimeDb } from "../runtime/db-path";
import {
  DATA_PROVENANCE_MIGRATION_ID,
  assertDataProvenanceSchema,
  migrateDataProvenance,
} from "../web/lib/data-provenance";

if (!process.argv.includes("--apply")) {
  console.error("[demo-provenance] refused: pass --apply after tests and deployment approval");
  process.exit(2);
}

const source = resolveAgentsDbPath();
if (resolve(source).toLowerCase() !== resolve(CANONICAL_RUNTIME_DB).toLowerCase()) {
  console.error("[demo-provenance] refused: migration is limited to the canonical runtime DB");
  process.exit(2);
}
if (!existsSync(source)) {
  console.error("[demo-provenance] refused: canonical runtime DB does not exist");
  process.exit(2);
}
validateRuntimeDb(source);

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = resolve(REPO_ROOT, ".runtime", "backups", `demo-provenance-${stamp}-${process.pid}`);
const backup = resolve(backupDir, "agents-demo.db");
mkdirSync(backupDir, { recursive: true });

const db = new Database(source, { strict: true });
try {
  const integrity = db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get()?.integrity_check;
  if (integrity !== "ok") throw new Error("source integrity check failed");
  db.exec(`VACUUM INTO '${backup.replaceAll("'", "''")}'`);
  const backupDb = new Database(backup, { readonly: true, strict: true });
  try {
    if (backupDb.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get()?.integrity_check !== "ok") {
      throw new Error("backup integrity check failed");
    }
  } finally {
    backupDb.close();
  }
  const sha256 = createHash("sha256").update(readFileSync(backup)).digest("hex");
  const applied = migrateDataProvenance(db);
  assertDataProvenanceSchema(db);
  console.log(`[demo-provenance] backup=${relative(REPO_ROOT, backup).replaceAll("\\", "/")}`);
  console.log(`[demo-provenance] backup_sha256=${sha256}`);
  console.log(`[demo-provenance] migration=${DATA_PROVENANCE_MIGRATION_ID} applied=${applied}`);
  console.log("[demo-provenance] historical_rows=legacy_unknown");
} catch (error) {
  console.error(`[demo-provenance] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  db.close();
}
