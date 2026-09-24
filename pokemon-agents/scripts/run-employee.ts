#!/usr/bin/env bun
/** Network-free, one-shot deterministic employee runner. Dry-run unless --apply is explicit. */
import { Database } from "bun:sqlite";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertAgentActivityLedgerSchema } from "../web/lib/agent-activity-ledger";
import { B1_EMPLOYEE_IDS, runEmployee } from "../web/lib/employee-runner";

const HELP = `Usage:
  bun pokemon-agents/scripts/run-employee.ts --agent hana-heartbeat|risa-notifier \\
    --scope acct_takumi_hq --input <packet.json> [--run-id <id>] [--correlation-id <id>] [--apply]

Dry-run is the default. This command does not call an LLM, send notifications,
register schedules, chain another employee, or make network requests.`;

function value(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  const next = args[index + 1];
  if (!next || next.startsWith("--")) throw new Error(`${flag.slice(2).toUpperCase().replaceAll("-", "_")}_REQUIRED`);
  return next;
}

export function main(args = process.argv.slice(2)): number {
  if (args.includes("--help") || args.includes("-h")) { console.log(HELP); return 0; }
  const allowed = new Set(["--agent", "--scope", "--input", "--run-id", "--correlation-id", "--apply"]);
  for (let index = 0; index < args.length; index += 1) {
    if (!allowed.has(args[index]!)) throw new Error("UNKNOWN_ARGUMENT");
    if (args[index] !== "--apply") index += 1;
  }
  const agent = value(args, "--agent");
  const scope = value(args, "--scope");
  const inputPath = value(args, "--input");
  if (!agent || !B1_EMPLOYEE_IDS.includes(agent as typeof B1_EMPLOYEE_IDS[number])) throw new Error("AGENT_NOT_ENABLED_B1");
  if (!scope) throw new Error("SCOPE_REQUIRED");
  if (!inputPath) throw new Error("INPUT_REQUIRED");
  const bytes = readFileSync(resolve(inputPath));
  const inputHash = createHash("sha256").update(bytes).digest("hex");
  const input = JSON.parse(bytes.toString("utf8"));
  const runId = value(args, "--run-id") ?? `run:${randomUUID()}`;
  const correlationId = value(args, "--correlation-id") ?? `corr:${randomUUID()}`;
  const now = new Date().toISOString();
  const db = new Database(resolveAgentsDbPath(), { readonly: !args.includes("--apply"), strict: true });
  try {
    db.exec("PRAGMA foreign_keys = ON");
    assertAgentActivityLedgerSchema(db);
    const result = runEmployee(db, {
      agentId: agent, scope, input, runId, correlationId,
      taskRef: `source:employee-cli:${inputHash.slice(0, 24)}`,
      inputPacketRefs: [`source:employee-input:${inputHash.slice(0, 24)}`],
      startedAt: now, endedAt: now, apply: args.includes("--apply"),
    });
    console.log(JSON.stringify({ status: result.persisted ? "applied" : "dry-run", replayed: result.replayed,
      run_id: result.packet.run_id, agent_id: result.packet.agent_id, scope: result.packet.account_id,
      packet_sha256: result.packet.packet_sha256, output_packet: result.packet.output_packet }));
    return 0;
  } finally { db.close(); }
}

if (import.meta.main) {
  try { process.exitCode = main(); }
  catch (error) {
    console.error(JSON.stringify({ status: "failed", safe_error_code: error instanceof Error ? error.message : "EMPLOYEE_RUN_FAILED" }));
    process.exitCode = 1;
  }
}
