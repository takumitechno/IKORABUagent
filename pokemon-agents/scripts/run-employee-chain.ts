#!/usr/bin/env bun
/** Explicit one-shot Hana -> Risa -> Sashihara chain. No scheduler or transport. */
import { Database } from "bun:sqlite";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertB2BOrchestrationSchema, runSashiharaEmployee } from "../web/lib/b2b-orchestration";
import { runEmployee, type HanaOutputPacket } from "../web/lib/employee-runner";

function value(args: readonly string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i < 0 ? undefined : args[i + 1];
}

const args = process.argv.slice(2);
if (!args.includes("--apply")) throw new Error("APPLY_REQUIRED");
for (let i = 0; i < args.length; i += 1) {
  if (!["--scope", "--input", "--correlation-id", "--apply"].includes(args[i]!)) throw new Error("UNKNOWN_ARGUMENT");
  if (args[i] !== "--apply") i += 1;
}
const scope = value(args, "--scope");
const inputPath = value(args, "--input");
if (scope !== "acct_takumi_hq" || !inputPath) throw new Error("HQ_SCOPE_AND_INPUT_REQUIRED");
const bytes = readFileSync(resolve(inputPath));
const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 24).replace(/[0-9]/g, (digit) => "abcdefghij"[Number(digit)]!);
const input = JSON.parse(bytes.toString("utf8"));
const correlationId = value(args, "--correlation-id") ?? `corr:${randomUUID()}`;
const suffix = randomUUID();
const at = new Date().toISOString();
const db = new Database(resolveAgentsDbPath(), { strict: true });
try {
  db.exec("PRAGMA foreign_keys=ON");
  assertB2BOrchestrationSchema(db);
  const result = db.transaction(() => {
    const hana = runEmployee(db, { agentId: "hana-heartbeat", scope, input, runId: `run:hana:${suffix}`,
      taskRef: `source:employee-chain:${hash}`, correlationId, startedAt: at, endedAt: at,
      inputPacketRefs: [`source:monitor:${hash}`], apply: true });
    const risa = runEmployee(db, { agentId: "risa-notifier", scope, runId: `run:risa:${suffix}`,
      input: { schema_version: "risa-input.v1", scope, hana_packet: hana.packet.output_packet as HanaOutputPacket,
        decided_at: at, occurrence_count: 1, prior_decisions: [] }, taskRef: `source:employee-chain:${hash}`,
      correlationId, startedAt: at, endedAt: at, inputPacketRefs: [`source:employee-run:${hana.packet.run_id}`], apply: true });
    const sashihara = runSashiharaEmployee(db, { scope, runRefs: [risa.packet.run_id], asOf: at,
      runId: `run:sashihara:${suffix}`, correlationId, taskRef: `source:employee-chain:${hash}`, startedAt: at, endedAt: at, apply: true });
    return { hana: hana.packet.run_id, risa: risa.packet.run_id, sashihara: sashihara.packet.run_id,
      next_action: sashihara.packet.output_packet, correlation_id: correlationId };
  }).immediate();
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(JSON.stringify({ status: "failed", safe_error_code: error instanceof Error ? error.message : "CHAIN_FAILED" }));
  process.exitCode = 1;
} finally { db.close(); }
