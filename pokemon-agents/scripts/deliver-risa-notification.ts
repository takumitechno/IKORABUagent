#!/usr/bin/env bun
/** Explicit, feature-gated Risa decision delivery. Never called by a scheduler. */
import { Database } from "bun:sqlite";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertB2BOrchestrationSchema, deliverRisaDecision } from "../web/lib/b2b-orchestration";

function value(args: readonly string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i < 0 ? undefined : args[i + 1];
}

const args = process.argv.slice(2);
const allowed = new Set(["--decision-run", "--apply"]);
for (let i = 0; i < args.length; i += 1) {
  if (!allowed.has(args[i]!)) throw new Error("UNKNOWN_ARGUMENT");
  if (args[i] !== "--apply") i += 1;
}
const decisionRunRef = value(args, "--decision-run");
if (!decisionRunRef) throw new Error("DECISION_RUN_REQUIRED");
const apply = args.includes("--apply");
const db = new Database(resolveAgentsDbPath(), { readonly: !apply, strict: true });
try {
  db.exec("PRAGMA foreign_keys=ON");
  assertB2BOrchestrationSchema(db);
  const result = await deliverRisaDecision(db, {
    decisionRunRef, enabled: process.env.IKORABU_NOTIFICATION_TRANSPORT_ENABLED === "true",
    operatorInvoked: true, apply, at: new Date().toISOString(),
    sender: async ({ destinationRef, payload }) => {
      const url = destinationRef === "human_ceo"
        ? process.env.IKORABU_DISCORD_HUMAN_CEO_WEBHOOK_URL
        : process.env.IKORABU_DISCORD_INTERNAL_OPS_WEBHOOK_URL;
      if (!url) throw new Error("DESTINATION_NOT_CONFIGURED");
      const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: JSON.stringify(payload) }) });
      if (!response.ok) throw new Error("DELIVERY_REJECTED");
    },
  });
  console.log(JSON.stringify(result));
  if (result.status === "failed" || result.status === "blocked") process.exitCode = 2;
} catch (error) {
  console.error(JSON.stringify({ status: "failed", safe_error_code: error instanceof Error ? error.message : "DELIVERY_FAILED" }));
  process.exitCode = 1;
} finally { db.close(); }
