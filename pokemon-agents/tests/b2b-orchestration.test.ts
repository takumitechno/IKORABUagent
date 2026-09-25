import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { migrateAgentActivityLedger, registerActivityAccount } from "../web/lib/agent-activity-ledger";
import { appendAiUsageEvent, migrateAiCostAccounting, type AiUsageEventInput } from "../web/lib/ai-cost-accounting";
import { buildMirinyaOutput, buildSashiharaOutput, deliverRisaDecision, loadB2BInternalReadModel,
  migrateB2BOrchestration, runMirinyaEmployee, runSashiharaEmployee } from "../web/lib/b2b-orchestration";
import { runEmployee, runHana } from "../web/lib/employee-runner";

const at = "2026-09-24T05:00:00.000Z";
const from = "2026-09-01T00:00:00.000Z";
const to = "2026-10-01T00:00:00.000Z";
const root = resolve(import.meta.dir, "..", "..");

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

function db(): Database {
  const database = new Database(":memory:");
  database.exec("PRAGMA foreign_keys=ON");
  database.exec(readFileSync(resolve(root, "pokemon-agents/db/schema.sql"), "utf8"));
  migrateAgentActivityLedger(database);
  migrateAiCostAccounting(database);
  migrateB2BOrchestration(database);
  registerActivityAccount(database, "acct_takumi_hq", "source:test:hq");
  registerActivityAccount(database, "acct_client", "source:test:client");
  return database;
}

function usage(database: Database, id: string, cost: number | null, currency: string | null, overrides: Partial<AiUsageEventInput> = {}): void {
  const base: AiUsageEventInput = { usage_event_id: `${id}:started`, call_id: id, event_kind: "started", scope_kind: "internal", account_id: null,
    agent_id: "mirinya-cost-analyst", provider: "fixture", model: "fixture-model", operation: "fixture", feature: "b2b", task_ref: "source:test:usage",
    correlation_id: "corr:usage", run_id: "run:usage", input_tokens: null, output_tokens: null, cache_read_tokens: null,
    cache_creation_tokens: null, cost_amount_micros: null, currency: null, cost_basis: "unknown", unknown_reason: null,
    terminal_status: null, started_at: from, ended_at: null, data_origin: "production", ...overrides };
  appendAiUsageEvent(database, base);
  appendAiUsageEvent(database, { ...base, usage_event_id: `${id}:completed`, event_kind: "completed", cost_amount_micros: cost, currency,
    cost_basis: cost === null ? "unknown" : "actual", unknown_reason: cost === null ? "not_reported" : null,
    terminal_status: overrides.terminal_status ?? "succeeded", ended_at: from });
}

function risa(database: Database, runId: string, kind: "send" | "escalate" | "suppress" = "send", correlationId = "corr:chain") {
  const check = kind === "escalate" ? "bridge_health" : "insights_freshness";
  const hana = runHana({ schema_version: "monitor-findings.v1", scope: "acct_takumi_hq", findings: [{ check_code: check,
    observed: "present", age_minutes: kind === "suppress" ? 1 : 45, tolerance_minutes: 30, delayed_window_minutes: 60,
    block_reason: kind === "escalate" ? "dependency" : null, evidence_ref: `source:test:${check}` }] });
  return runEmployee(database, { agentId: "risa-notifier", scope: "acct_takumi_hq", input: { schema_version: "risa-input.v1",
    scope: "acct_takumi_hq", hana_packet: hana, decided_at: at, occurrence_count: 1, prior_decisions: [] }, runId,
    taskRef: "source:test:risa", correlationId, startedAt: at, endedAt: at, inputPacketRefs: ["source:test:hana"], apply: true });
}

function insertKiara(database: Database, runId: string, resultCode: string): void {
  const output = { schema_version: "kiara-execution-output.v1", result_code: resultCode };
  const base = { run_id: runId, agent_id: "kiara-executor", role: "approved_change_executor", account_id: "acct_takumi_hq",
    task_ref: "source:test:kiara", correlation_id: "corr:kiara", implementation_type: "deterministic_kiara", started_at: at, ended_at: at,
    input_packet_refs: ["source:test:approval"], output_packet: output, schema_version: "employee-run.v1", decision_status: "approved",
    result_status: resultCode === "applied" ? "succeeded" : "failed", next_action_owner: "anna-supervisor",
    next_action: resultCode === "applied" ? "result_succeeded" : "result_failed", evidence_refs: ["source:test:approval"] };
  const hash = createHash("sha256").update(canonical(base)).digest("hex");
  database.query(`INSERT INTO employee_run_packets(run_id,agent_id,role,account_id,task_ref,correlation_id,implementation_type,started_at,ended_at,input_packet_refs,output_packet,packet_sha256,schema_version,decision_status,result_status,next_action_owner,next_action,evidence_refs) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    base.run_id, base.agent_id, base.role, base.account_id, base.task_ref, base.correlation_id, base.implementation_type, base.started_at, base.ended_at,
    JSON.stringify(base.input_packet_refs), JSON.stringify(output), hash, base.schema_version, base.decision_status, base.result_status,
    base.next_action_owner, base.next_action, JSON.stringify(base.evidence_refs));
}

describe("B2B deterministic control-plane chain", () => {
  test("Mirinya is deterministic, preserves unknown cost, and never fabricates revenue or margin", () => {
    const database = db();
    usage(database, "call:known", 2000, "USD");
    usage(database, "call:unknown", null, null);
    const options = { from, to, scopeKind: "internal" as const, revenue: { status: "not_connected" as const }, unknownCostThreshold: 3 };
    const first = buildMirinyaOutput(database, options);
    expect(buildMirinyaOutput(database, options)).toEqual(first);
    expect(first).toMatchObject({ control_plane_ai_cost_known_micros: 2000, unknown_cost_calls: 1,
      revenue_known_micros: null, contribution_margin_micros: null, margin_null_reason: "not_connected", next_action_owner: null });
    expect(first.unallocated_cost_known_micros).toBe(2000);
    database.close();
  });

  test("mixed currency blocks account margin and internal/shared cost is never allocated to the client", () => {
    const database = db();
    usage(database, "call:client", 1000, "USD", { scope_kind: "account", account_id: "acct_client" });
    const connected = { status: "connected" as const, revenue_known_micros: 10000, refund_known_micros: 0,
      commercial_cost_known_micros: 1000, currency: "JPY" };
    const result = buildMirinyaOutput(database, { from, to, scopeKind: "account", accountId: "acct_client", revenue: connected,
      threadsSummary: { status: "connected", account_id: "acct_client", from: "2026-09-01", to: "2026-10-01", known_cost_micros: 0,
        unknown_cost_calls: 0, waste_known_micros: 0, waste_count: 0, currency: "USD", model_mix: [] } });
    expect(result).toMatchObject({ contribution_margin_micros: null, margin_null_reason: "mixed_currency", unallocated_cost_known_micros: 0 });
    database.close();
  });

  test("distinguishes unknown Threads cost from explicit zero across Mirinya states", () => {
    const revenue = { status: "connected" as const, revenue_known_micros: 10_000,
      refund_known_micros: 0, commercial_cost_known_micros: 1_000, currency: "USD" };
    const summary = (known: number | null, unknown: number, calls: number, modelKnown: number | null) => ({
      status: "connected" as const, account_id: "acct_client", from: "2026-09-01", to: "2026-10-01",
      known_cost_micros: known, unknown_cost_calls: unknown, waste_known_micros: 0,
      waste_count: 0, currency: "USD", model_mix: calls
        ? [{ model: "paid-model", calls, known_cost_micros: modelKnown }] : [],
    });

    const database = db();
    const unknownNull = buildMirinyaOutput(database, { from, to, scopeKind: "account", accountId: "acct_client",
      revenue, threadsSummary: summary(null, 0, 2, null) });
    expect(unknownNull).toMatchObject({ threads_ai_cost_known_micros: null, unknown_cost_calls: 2,
      contribution_margin_micros: null, margin_null_reason: "unknown_component", data_status: "partial" });
    expect(unknownNull.model_mix).toEqual([{ model: "paid-model", calls: 2, known_cost_micros: null }]);

    const explicitZero = buildMirinyaOutput(database, { from, to, scopeKind: "account", accountId: "acct_client",
      revenue, threadsSummary: summary(0, 0, 2, 0) });
    expect(explicitZero).toMatchObject({ threads_ai_cost_known_micros: 0, unknown_cost_calls: 0,
      contribution_margin_micros: 9_000, margin_null_reason: null, data_status: "complete" });

    const positive = buildMirinyaOutput(database, { from, to, scopeKind: "account", accountId: "acct_client",
      revenue, threadsSummary: summary(100, 0, 2, 100) });
    expect(positive).toMatchObject({ threads_ai_cost_known_micros: 100, unknown_cost_calls: 0,
      contribution_margin_micros: 8_900, margin_null_reason: null, data_status: "complete" });

    const declaredUnknown = buildMirinyaOutput(database, { from, to, scopeKind: "account", accountId: "acct_client",
      revenue, threadsSummary: summary(100, 1, 2, 100) });
    expect(declaredUnknown).toMatchObject({ unknown_cost_calls: 1, contribution_margin_micros: null,
      margin_null_reason: "unknown_component", data_status: "partial" });

    const noCalls = buildMirinyaOutput(database, { from, to, scopeKind: "account", accountId: "acct_client",
      revenue, threadsSummary: summary(null, 0, 0, null) });
    expect(noCalls).toMatchObject({ threads_ai_cost_known_micros: null, unknown_cost_calls: 0,
      contribution_margin_micros: 9_000, data_status: "complete" });

    const disconnected = buildMirinyaOutput(database, { from, to, scopeKind: "account", accountId: "acct_client", revenue });
    expect(disconnected).toMatchObject({ threads_ai_cost_known_micros: null, contribution_margin_micros: null,
      margin_null_reason: "unknown_component", data_status: "partial" });
    database.close();
  });

  test("Mirinya hands off only actionable economics packets and persists a canonical run", () => {
    const database = db();
    usage(database, "call:u1", null, null); usage(database, "call:u2", null, null); usage(database, "call:u3", null, null);
    const result = runMirinyaEmployee(database, { from, to, scopeKind: "internal", unknownCostThreshold: 3,
      runId: "run:mirinya", correlationId: "corr:economics", taskRef: "source:test:mirinya", startedAt: at, endedAt: at, apply: true });
    expect(result.packet.output_packet).toMatchObject({ next_action_owner: "sashihara-orchestrator", data_status: "action_required" });
    expect(result.activity).toMatchObject({ agent_id: "mirinya-cost-analyst", run_ref: "run:mirinya" });
    database.close();
  });

  test("Mirinya derives cost-cap stops from the canonical budget ledger", () => {
    const database = db();
    database.query("INSERT INTO agent_budgets(agent_id,period,budget_cents,used_cents,status) VALUES (NULL,'2026-09',100,100,'halted')").run();
    const result = buildMirinyaOutput(database, { from, to, scopeKind: "internal" });
    expect(result.action_reason_codes).toContain("cost_cap_blocked");
    expect(result.next_action_owner).toBe("sashihara-orchestrator");
    database.close();
  });

  test("Sashihara selects exactly one highest priority and holds equal-priority conflicts", () => {
    const database = db();
    risa(database, "run:risa-critical", "escalate");
    risa(database, "run:risa-send", "send");
    expect(buildSashiharaOutput(database, { runRefs: ["run:risa-send", "run:risa-critical"], asOf: at })).toMatchObject({
      next_action_code: "SAFETY_ESCALATION", owner: "human:ceo", priority: 1, human_gate_required: true });
    expect(Object.keys(buildSashiharaOutput(database, { runRefs: ["run:risa-critical"], asOf: at })).sort()).toEqual([
      "conflict_codes", "due_at", "evidence_refs", "human_gate_required", "input_packet_refs", "next_action_code", "owner", "priority", "schema_version", "status",
    ]);
    insertKiara(database, "run:kiara-applied", "applied");
    expect(buildSashiharaOutput(database, { runRefs: ["run:risa-send", "run:kiara-applied"], asOf: at })).toMatchObject({
      next_action_code: "HOLD_CONFLICT", status: "hold", priority: 5 });
    database.close();
  });

  test("Sashihara blocks stale, missing, and Kiara failure packets", () => {
    const database = db();
    expect(buildSashiharaOutput(database, { runRefs: ["run:missing"], asOf: at })).toMatchObject({ next_action_code: "BLOCK_UNVERIFIED_PACKET" });
    risa(database, "run:risa-old", "send");
    expect(buildSashiharaOutput(database, { runRefs: ["run:risa-old"], asOf: "2026-09-26T05:00:00.000Z" })).toMatchObject({ next_action_code: "HOLD_STALE_PACKET" });
    insertKiara(database, "run:kiara-failed", "tests_failed");
    expect(buildSashiharaOutput(database, { runRefs: ["run:kiara-failed"], asOf: at })).toMatchObject({ next_action_code: "BLOCKED_DEPENDENCY", status: "blocked" });
    database.close();
  });

  test("Hana to Risa to Sashihara preserves correlation identity", () => {
    const database = db();
    risa(database, "run:risa-chain", "send", "corr:bounded-chain");
    runSashiharaEmployee(database, { scope: "acct_takumi_hq", runRefs: ["run:risa-chain"], asOf: at, runId: "run:sash-chain",
      correlationId: "corr:bounded-chain", taskRef: "source:test:chain", startedAt: at, endedAt: at, apply: true });
    const rows = database.query<{ correlation_id: string }, []>("SELECT correlation_id FROM employee_run_packets WHERE run_id IN ('run:risa-chain','run:sash-chain') ORDER BY run_id").all();
    expect(rows.map((row) => row.correlation_id)).toEqual(["corr:bounded-chain", "corr:bounded-chain"]);
    database.close();
  });

  test("Risa delivery is gated, suppressed, idempotent, bounded, and failure-safe", async () => {
    const database = db();
    risa(database, "run:risa-suppressed", "suppress");
    let calls = 0;
    const sender = async () => { calls += 1; };
    expect((await deliverRisaDecision(database, { decisionRunRef: "run:risa-suppressed", enabled: true, operatorInvoked: true, apply: true, at, sender })).status).toBe("blocked");
    risa(database, "run:risa-deliver", "send");
    expect((await deliverRisaDecision(database, { decisionRunRef: "run:risa-deliver", enabled: false, operatorInvoked: true, apply: true, at, sender })).safe_error_code).toBe("FEATURE_DISABLED");
    expect((await deliverRisaDecision(database, { decisionRunRef: "run:risa-deliver", enabled: true, operatorInvoked: false, apply: true, at, sender })).safe_error_code).toBe("OPERATOR_ACTION_REQUIRED");
    expect(calls).toBe(0);
    expect((await deliverRisaDecision(database, { decisionRunRef: "run:risa-deliver", enabled: true, operatorInvoked: true, apply: true, at, sender })).status).toBe("delivered");
    expect((await deliverRisaDecision(database, { decisionRunRef: "run:risa-deliver", enabled: true, operatorInvoked: true, apply: true, at, sender })).status).toBe("duplicate");
    expect(calls).toBe(1);
    risa(database, "run:risa-fail", "send");
    const failed = await deliverRisaDecision(database, { decisionRunRef: "run:risa-fail", enabled: true, operatorInvoked: true, apply: true, at,
      sender: async () => { throw new Error("https://secret.invalid/token"); } });
    expect(failed).toMatchObject({ status: "failed", safe_error_code: "TRANSPORT_FAILED" });
    expect(JSON.stringify(database.query("SELECT * FROM notification_delivery_ledger").all())).not.toContain("secret.invalid");
    database.close();
  });

  test("HQ read model uses null for missing state and exposes only internal B2B summaries", () => {
    const database = db();
    expect(loadB2BInternalReadModel(database)).toEqual({ latest_mirinya: null, latest_sashihara: null, latest_risa_delivery: null, human_attention_items: [] });
    database.close();
  });

  test("contains no provider, autonomous scheduler, customer route, or live-test path", () => {
    const source = readFileSync(resolve(root, "pokemon-agents/web/lib/b2b-orchestration.ts"), "utf8");
    expect(source).not.toMatch(/anthropic|openai|claude|setInterval|task_completion_hooks/);
    expect(source).not.toMatch(/web\/routes\/customer|customer-dashboard/);
  });
});
