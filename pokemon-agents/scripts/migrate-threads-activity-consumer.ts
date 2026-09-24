#!/usr/bin/env bun
/** Apply ORG04B source registry schema after creating and verifying a SQLite backup. */
import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { CANONICAL_RUNTIME_DB, REPO_ROOT, resolveAgentsDbPath, validateRuntimeDb } from "../runtime/db-path";
import {
  THREADS_ACTIVITY_CONSUMER_MIGRATION_ID,
  assertThreadsActivityConsumerSchema,
  migrateThreadsActivityConsumer,
} from "../web/lib/threads-activity-consumer";

if (!process.argv.includes("--apply")) {
  console.error("[org04b] refused: pass --apply after tests and deployment approval");
  process.exit(2);
}

const source = resolveAgentsDbPath();
if (resolve(source).toLowerCase() !== resolve(CANONICAL_RUNTIME_DB).toLowerCase()) {
  console.error("[org04b] refused: migration is limited to the canonical runtime DB");
  process.exit(2);
}
if (!existsSync(source)) {
  console.error("[org04b] refused: canonical runtime DB does not exist");
  process.exit(2);
}
try {
  validateRuntimeDb(source);
} catch (error) {
  console.error(`[org04b] refused: base runtime DB validation failed (${error instanceof Error ? error.message : String(error)})`);
  process.exit(2);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = resolve(REPO_ROOT, ".runtime", "backups");
const backupDir = resolve(backupRoot, `org04b-${stamp}-${process.pid}`);
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
    if (verified.integrity !== "ok" || verified.foreignKeys !== 0) throw new Error("backup verification failed");
  } finally {
    backupDb.close();
  }
  const sha256 = createHash("sha256").update(readFileSync(backup)).digest("hex");
  const applied = migrateThreadsActivityConsumer(db);
  assertThreadsActivityConsumerSchema(db);
  const sources = db.query<{ n: number }, []>("SELECT COUNT(*) n FROM threads_activity_projection_sources").get()?.n ?? -1;
  if (applied && sources !== 0) throw new Error(`refused unexpected initial source rows: ${sources}`);
  const after = inspect(db);
  if (after.integrity !== "ok" || after.foreignKeys !== 0) throw new Error("source DB postflight failed");
  console.log(`[org04b] backup=${relative(REPO_ROOT, backup).replaceAll("\\", "/")}`);
  console.log(`[org04b] backup_sha256=${sha256}`);
  console.log(`[org04b] migration=${THREADS_ACTIVITY_CONSUMER_MIGRATION_ID} applied=${applied}`);
  console.log(`[org04b] sources=${sources} source_integrity=ok source_foreign_keys=0`);
} catch (error) {
  console.error(`[org04b] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  db.close();
}
