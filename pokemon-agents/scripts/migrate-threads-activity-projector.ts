#!/usr/bin/env bun
/** Apply ORG04A checkpoint schema after creating and verifying a persistent SQLite backup. */
import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { CANONICAL_RUNTIME_DB, REPO_ROOT, resolveAgentsDbPath, validateRuntimeDb } from "../runtime/db-path";
import {
  THREADS_ACTIVITY_PROJECTOR_MIGRATION_ID,
  assertThreadsActivityProjectorSchema,
  migrateThreadsActivityProjector,
} from "../web/lib/threads-activity-projector";

if (!process.argv.includes("--apply")) {
  console.error("[org04a] refused: pass --apply after tests and deployment approval");
  process.exit(2);
}

const source = resolveAgentsDbPath();
if (resolve(source).toLowerCase() !== resolve(CANONICAL_RUNTIME_DB).toLowerCase()) {
  console.error("[org04a] refused: migration is limited to the canonical runtime DB");
  process.exit(2);
}
if (!existsSync(source)) {
  console.error("[org04a] refused: canonical runtime DB does not exist");
  process.exit(2);
}
try {
  validateRuntimeDb(source);
} catch (error) {
  console.error(`[org04a] refused: base runtime DB validation failed (${error instanceof Error ? error.message : String(error)})`);
  process.exit(2);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = resolve(REPO_ROOT, ".runtime", "backups");
const backupDir = resolve(backupRoot, `org04a-${stamp}-${process.pid}`);
const backup = resolve(backupDir, "agents-demo.db");
mkdirSync(backupRoot, { recursive: true });
mkdirSync(backupDir, { recursive: false });

function inspect(db: Database): { integrity: string; foreignKeys: number } {
  const integrity = db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get()?.integrity_check ?? "missing";
  const foreignKeys = db.query<Record<string, unknown>, []>("PRAGMA foreign_key_check").all().length;
  return { integrity, foreignKeys };
}

const db = new Database(source, { strict: true });
try {
  db.exec("PRAGMA foreign_keys = ON");
  const before = inspect(db);
  if (before.integrity !== "ok" || before.foreignKeys !== 0) {
    throw new Error(`source DB preflight failed: integrity=${before.integrity} foreign_keys=${before.foreignKeys}`);
  }
  db.exec(`VACUUM INTO '${backup.replaceAll("'", "''")}'`);

  const backupDb = new Database(backup, { readonly: true, strict: true });
  try {
    const verified = inspect(backupDb);
    if (verified.integrity !== "ok" || verified.foreignKeys !== 0) {
      throw new Error(`backup verification failed: integrity=${verified.integrity} foreign_keys=${verified.foreignKeys}`);
    }
  } finally {
    backupDb.close();
  }

  const sha256 = createHash("sha256").update(readFileSync(backup)).digest("hex");
  const applied = migrateThreadsActivityProjector(db);
  assertThreadsActivityProjectorSchema(db);
  const checkpoints = db.query<{ n: number }, []>(
    "SELECT COUNT(*) n FROM threads_activity_projector_checkpoints",
  ).get()?.n ?? -1;
  if (applied && checkpoints !== 0) throw new Error(`refused unexpected initial checkpoint rows: ${checkpoints}`);
  const after = inspect(db);
  if (after.integrity !== "ok" || after.foreignKeys !== 0) {
    throw new Error(`source DB postflight failed: integrity=${after.integrity} foreign_keys=${after.foreignKeys}`);
  }
  console.log(`[org04a] backup=${relative(REPO_ROOT, backup).replaceAll("\\", "/")}`);
  console.log(`[org04a] backup_sha256=${sha256}`);
  console.log("[org04a] backup_integrity=ok backup_foreign_keys=0");
  console.log(`[org04a] migration=${THREADS_ACTIVITY_PROJECTOR_MIGRATION_ID} applied=${applied}`);
  console.log(`[org04a] checkpoints=${checkpoints} source_integrity=ok source_foreign_keys=0`);
} catch (error) {
  console.error(`[org04a] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  db.close();
}
