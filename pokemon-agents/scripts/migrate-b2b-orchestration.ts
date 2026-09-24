#!/usr/bin/env bun
/** Schema command only. Never runs automatically; requires explicit operator apply. */
import { Database } from "bun:sqlite";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertB2BOrchestrationSchema, migrateB2BOrchestration } from "../web/lib/b2b-orchestration";

if (!process.argv.includes("--apply")) {
  console.error("[b2b] refused: pass --apply after backup, tests, and deployment approval");
  process.exit(2);
}
const db = new Database(resolveAgentsDbPath(), { strict: true });
try {
  db.exec("PRAGMA foreign_keys=ON");
  const applied = migrateB2BOrchestration(db);
  assertB2BOrchestrationSchema(db);
  console.log(`[b2b] migration applied=${applied}`);
} finally { db.close(); }
