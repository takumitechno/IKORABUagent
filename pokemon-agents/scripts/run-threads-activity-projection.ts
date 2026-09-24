#!/usr/bin/env bun
/** One bounded ORG04B projection run. This file contains no timer or loop. */
import { Database } from "bun:sqlite";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertAgentActivityLedgerSchema } from "../web/lib/agent-activity-ledger";
import { assertThreadsActivityProjectorSchema } from "../web/lib/threads-activity-projector";
import {
  assertThreadsActivityConsumerSchema,
  projectionEnabledFromEnv,
  runThreadsActivityProjectionOnce,
} from "../web/lib/threads-activity-consumer";

const accountIndex = process.argv.indexOf("--account");
const accountId = accountIndex >= 0 ? process.argv[accountIndex + 1] : undefined;
if (!projectionEnabledFromEnv()) {
  console.log(JSON.stringify({ status: "disabled", fetched_count: 0, projected_count: 0 }));
  process.exit(0);
}
if (!accountId) {
  console.error(JSON.stringify({ status: "failed", safe_error_code: "ACCOUNT_REQUIRED" }));
  process.exit(2);
}

let db: Database | undefined;
try {
  db = new Database(resolveAgentsDbPath(), { strict: true });
  db.exec("PRAGMA foreign_keys = ON");
  assertAgentActivityLedgerSchema(db);
  assertThreadsActivityProjectorSchema(db);
  assertThreadsActivityConsumerSchema(db);
  const summary = await runThreadsActivityProjectionOnce(db, {
    accountId,
    fromBeginning: process.argv.includes("--from-beginning"),
    tenantUserId: process.env.THREADS_ACTIVITY_TENANT_USER_ID,
  });
  console.log(JSON.stringify(summary));
  if (summary.status === "failed") process.exitCode = 1;
} catch {
  console.error(JSON.stringify({ status: "failed", safe_error_code: "PROJECTION_UNAVAILABLE" }));
  process.exitCode = 1;
} finally {
  db?.close();
}
