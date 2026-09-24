#!/usr/bin/env bun
import { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";
import { resolveAgentsDbPath } from "../runtime/db-path";
import {
  appendAiUsageEvent, assertAiCostAccountingSchema, assertAiUsageBudgetAllowsRun,
  recordAiUsageBudgetOutcome, usdToMicros, type AiUsageEventInput,
} from "../web/lib/ai-cost-accounting";

const args = new Map<string, string>();
for (let index = 3; index < process.argv.length; index += 2) args.set(process.argv[index]!, process.argv[index + 1]!);
const required = (name: string): string => {
  const value = args.get(`--${name}`);
  if (!value) throw new Error(`--${name} is required`);
  return value;
};
const command = process.argv[2];
const agentDbId = Number(required("agent-db-id"));
if (!Number.isSafeInteger(agentDbId) || agentDbId <= 0) throw new Error("invalid agent database id");
const db = new Database(resolveAgentsDbPath());

function token(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

try {
  assertAiCostAccountingSchema(db);
  if (command === "guard") {
    assertAiUsageBudgetAllowsRun(db, agentDbId, required("period"));
  } else if (command === "start") {
    assertAiUsageBudgetAllowsRun(db, agentDbId, required("period"));
    const callId = required("call-id");
    const startedAt = required("started-at");
    appendAiUsageEvent(db, {
      usage_event_id: `${callId}:started`, call_id: callId, event_kind: "started",
      scope_kind: "internal", account_id: null, agent_id: required("agent-id"), provider: "anthropic",
      model: args.get("--model") === "unknown" ? null : args.get("--model") || null,
      operation: required("operation"), feature: "legacy_runner",
      task_ref: required("task-ref"), correlation_id: args.get("--correlation-id") || null,
      run_id: required("run-id"), input_tokens: null, output_tokens: null, cache_read_tokens: null,
      cache_creation_tokens: null, cost_amount_micros: null, currency: null, cost_basis: "unknown",
      unknown_reason: null, terminal_status: null, started_at: startedAt, ended_at: null,
      data_origin: required("data-origin") as AiUsageEventInput["data_origin"],
    });
  } else if (command === "complete") {
    const callId = required("call-id");
    const started = db.query<AiUsageEventInput, [string]>(
      "SELECT * FROM ai_usage_events WHERE call_id=? AND event_kind='started'",
    ).get(callId);
    if (!started) throw new Error("started usage event not found");
    const terminal = required("status") as NonNullable<AiUsageEventInput["terminal_status"]>;
    let payload: Record<string, unknown> | null = null;
    let parseFailed = false;
    try {
      payload = JSON.parse(readFileSync(required("output"), "utf8")) as Record<string, unknown>;
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) parseFailed = true;
    } catch {
      parseFailed = true;
    }
    const usage = !parseFailed && payload?.usage && typeof payload.usage === "object"
      ? payload.usage as Record<string, unknown> : {};
    const cost = parseFailed ? null : usdToMicros(payload?.total_cost_usd);
    const unknownReason = cost !== null ? null
      : parseFailed ? "parse_failure"
      : terminal === "timeout" ? "timeout"
      : terminal === "failed" ? "provider_error"
      : payload && !("total_cost_usd" in payload) ? "missing_provider_usage" : "not_reported";
    appendAiUsageEvent(db, {
      usage_event_id: `${callId}:completed`, call_id: callId, event_kind: "completed",
      scope_kind: started.scope_kind, account_id: started.account_id, agent_id: started.agent_id,
      provider: started.provider, model: started.model, operation: started.operation, feature: started.feature,
      task_ref: started.task_ref, correlation_id: started.correlation_id, run_id: started.run_id,
      input_tokens: token(usage.input_tokens), output_tokens: token(usage.output_tokens),
      cache_read_tokens: token(usage.cache_read_input_tokens), cache_creation_tokens: token(usage.cache_creation_input_tokens),
      cost_amount_micros: cost, currency: cost === null ? null : "USD", cost_basis: cost === null ? "unknown" : "actual",
      unknown_reason: unknownReason, terminal_status: terminal, started_at: started.started_at,
      ended_at: required("ended-at"), data_origin: started.data_origin,
    });
    recordAiUsageBudgetOutcome(db, agentDbId, started.started_at.slice(0, 7), cost, callId);
    console.log(JSON.stringify({ cost_amount_micros: cost, input_tokens: token(usage.input_tokens),
      output_tokens: token(usage.output_tokens), cache_read_tokens: token(usage.cache_read_input_tokens),
      cache_creation_tokens: token(usage.cache_creation_input_tokens), unknown_reason: unknownReason }));
  } else {
    throw new Error("usage: ai-usage-cli.ts guard|start|complete ...");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  db.close();
}
