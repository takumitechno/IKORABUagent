#!/usr/bin/env bun
/** Network-free, one-shot deterministic employee runner. Dry-run unless --apply is explicit. */
import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertAgentActivityLedgerSchema } from "../web/lib/agent-activity-ledger";
import { assertAiCostAccountingSchema } from "../web/lib/ai-cost-accounting";
import { assertB2BOrchestrationSchema, createRunIdentity, runMirinyaEmployee, runSashiharaEmployee } from "../web/lib/b2b-orchestration";
import { B1_EMPLOYEE_IDS, runEmployee } from "../web/lib/employee-runner";

const HELP = `Usage:
  bun pokemon-agents/scripts/run-employee.ts --agent hana-heartbeat|risa-notifier \\
    --scope acct_takumi_hq --input <packet.json> [--run-id <id>] [--correlation-id <id>] [--apply]
  bun pokemon-agents/scripts/run-employee.ts --agent mirinya-cost-analyst \\
    --scope <acct_takumi_hq|account> --period YYYY-MM-DD..YYYY-MM-DD [--input <connections.json>] [--apply]
  bun pokemon-agents/scripts/run-employee.ts --agent sashihara-orchestrator \\
    --scope <acct_takumi_hq|account> --input <packet-refs.json> [--apply]

Dry-run is the default. The period end is exclusive. This command does not call
an LLM, send notifications, register schedules, or chain another employee.`;

function value(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  const next = args[index + 1];
  if (!next || next.startsWith("--")) throw new Error(`${flag.slice(2).toUpperCase().replaceAll("-", "_")}_REQUIRED`);
  return next;
}

export function main(args = process.argv.slice(2)): number {
  if (args.includes("--help") || args.includes("-h")) { console.log(HELP); return 0; }
  const allowed = new Set(["--agent", "--scope", "--input", "--period", "--run-id", "--correlation-id", "--apply"]);
  for (let index = 0; index < args.length; index += 1) {
    if (!allowed.has(args[index]!)) throw new Error("UNKNOWN_ARGUMENT");
    if (args[index] !== "--apply") index += 1;
  }
  const agent = value(args, "--agent");
  const scope = value(args, "--scope");
  const inputPath = value(args, "--input");
  const b2b = agent === "mirinya-cost-analyst" || agent === "sashihara-orchestrator";
  if (!agent || (!b2b && !B1_EMPLOYEE_IDS.includes(agent as typeof B1_EMPLOYEE_IDS[number]))) throw new Error("AGENT_NOT_ENABLED");
  if (!scope) throw new Error("SCOPE_REQUIRED");
  if (!inputPath && agent !== "mirinya-cost-analyst") throw new Error("INPUT_REQUIRED");
  const bytes = inputPath ? readFileSync(resolve(inputPath)) : Buffer.from("{}");
  const inputHash = createHash("sha256").update(bytes).digest("hex");
  const input = JSON.parse(bytes.toString("utf8"));
  const identity = createRunIdentity(agent);
  const runId = value(args, "--run-id") ?? identity.runId;
  const correlationId = value(args, "--correlation-id") ?? identity.correlationId;
  const now = new Date().toISOString();
  const apply = args.includes("--apply");
  const db = new Database(resolveAgentsDbPath(), { readonly: !apply, strict: true });
  try {
    db.exec("PRAGMA foreign_keys = ON");
    assertAgentActivityLedgerSchema(db);
    if (b2b) assertB2BOrchestrationSchema(db);
    if (agent === "mirinya-cost-analyst") {
      assertAiCostAccountingSchema(db);
      const match = value(args, "--period")?.match(/^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/);
      if (!match) throw new Error("PERIOD_REQUIRED");
      const from = `${match[1]}T00:00:00.000Z`;
      const to = `${match[2]}T00:00:00.000Z`;
      if (from >= to || Date.parse(to) - Date.parse(from) > 366 * 86_400_000) throw new Error("PERIOD_INVALID");
      const config = input as Record<string, unknown>;
      if (!config || typeof config !== "object" || Array.isArray(config)
        || Object.keys(config).some((key) => !["threads_summary", "revenue", "unknown_cost_threshold", "minimum_attribution_ratio"].includes(key))) {
        throw new Error("MIRINYA_INPUT_INVALID");
      }
      const result = runMirinyaEmployee(db, { from, to, scopeKind: scope === "acct_takumi_hq" ? "internal" : "account",
        accountId: scope === "acct_takumi_hq" ? null : scope, threadsSummary: config.threads_summary as never,
        revenue: config.revenue as never, unknownCostThreshold: config.unknown_cost_threshold as number | undefined,
        minimumAttributionRatio: config.minimum_attribution_ratio as number | undefined,
        runId, correlationId, taskRef: `source:employee-cli:${inputHash.slice(0, 24)}`, startedAt: now, endedAt: now, apply });
      console.log(JSON.stringify({ status: result.persisted ? "applied" : "dry-run", replayed: result.replayed,
        run_id: result.packet.run_id, agent_id: result.packet.agent_id, scope: result.packet.account_id,
        packet_sha256: result.packet.packet_sha256, output_packet: result.packet.output_packet }));
      return 0;
    }
    if (agent === "sashihara-orchestrator") {
      const config = input as { run_refs?: string[]; as_of?: string; max_age_minutes?: number };
      if (!config || typeof config !== "object" || Array.isArray(config)
        || Object.keys(config).some((key) => !["run_refs", "as_of", "max_age_minutes"].includes(key))) throw new Error("SASHIHARA_INPUT_INVALID");
      const result = runSashiharaEmployee(db, { scope, runRefs: config.run_refs ?? [], asOf: config.as_of ?? now,
        maxAgeMinutes: config.max_age_minutes, runId, correlationId, taskRef: `source:employee-cli:${inputHash.slice(0, 24)}`,
        startedAt: now, endedAt: now, apply });
      console.log(JSON.stringify({ status: result.persisted ? "applied" : "dry-run", replayed: result.replayed,
        run_id: result.packet.run_id, agent_id: result.packet.agent_id, scope: result.packet.account_id,
        packet_sha256: result.packet.packet_sha256, output_packet: result.packet.output_packet }));
      return 0;
    }
    const result = runEmployee(db, { agentId: agent, scope, input, runId, correlationId,
      taskRef: `source:employee-cli:${inputHash.slice(0, 24)}`, inputPacketRefs: [`source:employee-input:${inputHash.slice(0, 24)}`],
      startedAt: now, endedAt: now, apply });
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
