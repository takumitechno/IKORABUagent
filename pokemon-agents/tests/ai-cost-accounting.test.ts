import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  AiUsageBudgetError, AiUsageConflictError, AiUsageScopeError,
  appendAiUsageEvent, assertAiUsageBudgetAllowsRun, buildMirinyaCostReadModel,
  loadThreadsAiUsageSummary, migrateAiCostAccounting, recordAiUsageBudgetOutcome,
  usdToMicros, type AiUsageEventInput,
} from "../web/lib/ai-cost-accounting";
import { isPublicDashboardPath } from "../web/lib/internal-auth";
import { migrateAgentActivityLedger } from "../web/lib/agent-activity-ledger";
import { generateReportForDate } from "../web/lib/daily-report";

function database(): Database {
  const db = new Database(":memory:");
  db.exec(`PRAGMA foreign_keys=ON;
    CREATE TABLE agent_activity_accounts (
      account_id TEXT PRIMARY KEY, authority_ref TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active'
    );
    CREATE TABLE agent_budgets (
      id INTEGER PRIMARY KEY, agent_id INTEGER, period TEXT NOT NULL, budget_cents INTEGER NOT NULL,
      used_cents INTEGER DEFAULT 0, warning_threshold_pct INTEGER DEFAULT 80,
      status TEXT DEFAULT 'active', halted_at TEXT, created_at TEXT, updated_at TEXT,
      UNIQUE(agent_id, period)
    );
    CREATE TABLE daily_reports (
      date TEXT PRIMARY KEY, summary_md TEXT NOT NULL, cost_usd REAL, data_origin TEXT NOT NULL
    );`);
  migrateAiCostAccounting(db);
  return db;
}

const started = (overrides: Partial<AiUsageEventInput> = {}): AiUsageEventInput => ({
  usage_event_id: "usage-1-started", call_id: "call-1", event_kind: "started",
  scope_kind: "internal", account_id: null, agent_id: "shoko-reporter", provider: "anthropic",
  model: "claude-sonnet-4-5", operation: "daily_report", feature: "reporting", task_ref: "report:2026-09-24",
  correlation_id: "corr-1", run_id: "run-1", input_tokens: null, output_tokens: null,
  cache_read_tokens: null, cache_creation_tokens: null, cost_amount_micros: null, currency: null,
  cost_basis: "unknown", unknown_reason: null, terminal_status: null,
  started_at: "2026-09-24T00:00:00.000Z", ended_at: null, data_origin: "production", ...overrides,
});

const completed = (overrides: Partial<AiUsageEventInput> = {}): AiUsageEventInput => ({
  ...started(), usage_event_id: "usage-1-completed", event_kind: "completed",
  input_tokens: 100, output_tokens: 20, cache_read_tokens: null, cost_amount_micros: 123_456,
  currency: "USD", cost_basis: "actual", terminal_status: "succeeded",
  ended_at: "2026-09-24T00:01:00.000Z", ...overrides,
});

describe("canonical control-plane AI usage ledger", () => {
  test("keeps missing, timeout, and parse-failure cost unknown instead of zero", () => {
    const db = database();
    appendAiUsageEvent(db, started());
    const timeout = appendAiUsageEvent(db, completed({
      cost_amount_micros: null, currency: null, cost_basis: "unknown", unknown_reason: "timeout",
      terminal_status: "timeout", input_tokens: null, output_tokens: null,
    }));
    expect(timeout.cost_amount_micros).toBeNull();
    expect(db.query<{ cost: number | null }, []>("SELECT SUM(cost_amount_micros) cost FROM ai_usage_events WHERE event_kind='completed'").get()!.cost).toBeNull();

    appendAiUsageEvent(db, started({ usage_event_id: "usage-2-started", call_id: "call-2", run_id: "run-2" }));
    expect(appendAiUsageEvent(db, completed({ usage_event_id: "usage-2-completed", call_id: "call-2", run_id: "run-2",
      cost_amount_micros: null, currency: null, cost_basis: "unknown", unknown_reason: "parse_failure", terminal_status: "failed" })).cost_amount_micros).toBeNull();
    expect(usdToMicros(undefined)).toBeNull();
    db.close();
  });

  test("is append-only, idempotent, and rejects conflicting identity", () => {
    const db = database();
    expect(() => appendAiUsageEvent(db, completed())).toThrow("matching start");
    const event = appendAiUsageEvent(db, started());
    expect(appendAiUsageEvent(db, started()).sequence).toBe(event.sequence);
    expect(() => appendAiUsageEvent(db, started({ model: "different-model" }))).toThrow(AiUsageConflictError);
    expect(() => appendAiUsageEvent(db, started({ usage_event_id: "other-id" }))).toThrow(AiUsageConflictError);
    expect(() => db.exec("UPDATE ai_usage_events SET model='x'")).toThrow("append-only");
    expect(() => db.exec("DELETE FROM ai_usage_events")).toThrow("append-only");
    db.close();
  });

  test("captures attribution, keeps internal runs unassigned, and validates account scope", () => {
    const db = database();
    const internal = appendAiUsageEvent(db, started());
    expect(internal).toMatchObject({ agent_id: "shoko-reporter", model: "claude-sonnet-4-5",
      task_ref: "report:2026-09-24", run_id: "run-1", account_id: null });
    expect(() => appendAiUsageEvent(db, started({ usage_event_id: "bad", call_id: "bad", scope_kind: "account", account_id: "acct_missing" }))).toThrow(AiUsageScopeError);
    db.query("INSERT INTO agent_activity_accounts(account_id,authority_ref) VALUES (?,?)").run("acct_live", "authority:live");
    expect(appendAiUsageEvent(db, started({ usage_event_id: "account-started", call_id: "account-call", scope_kind: "account", account_id: "acct_live" })).account_id).toBe("acct_live");
    expect(() => appendAiUsageEvent(db, started({ usage_event_id: "leak", call_id: "leak", account_id: "acct_live" }))).toThrow(AiUsageScopeError);
    db.close();
  });
});

describe("known and unknown budget policy", () => {
  test("preserves known spend and halts after the bounded unknown count", () => {
    const db = database();
    const addCall = (callId: string, cost: number | null) => {
      appendAiUsageEvent(db, started({ usage_event_id: `${callId}-start`, call_id: callId, run_id: callId }));
      appendAiUsageEvent(db, completed({ usage_event_id: `${callId}-complete`, call_id: callId, run_id: callId,
        cost_amount_micros: cost, currency: cost === null ? null : "USD", cost_basis: cost === null ? "unknown" : "actual",
        unknown_reason: cost === null ? "not_reported" : null }));
    };
    db.query(`INSERT INTO agent_budgets(agent_id,period,budget_cents,used_cents,unknown_run_limit) VALUES (?,?,?,?,?)`).run(7, "2026-09", 100, 0, 2);
    assertAiUsageBudgetAllowsRun(db, 7, "2026-09");
    addCall("budget-call-1", 250_000);
    recordAiUsageBudgetOutcome(db, 7, "2026-09", 250_000, "budget-call-1");
    expect(db.query<{ used_cents: number }, []>("SELECT used_cents FROM agent_budgets").get()!.used_cents).toBe(25);
    expect(recordAiUsageBudgetOutcome(db, 7, "2026-09", 250_000, "budget-call-1")).toBe(false);
    expect(db.query<{ used_cents: number }, []>("SELECT used_cents FROM agent_budgets").get()!.used_cents).toBe(25);
    expect(() => recordAiUsageBudgetOutcome(db, 7, "2026-09", null, "budget-call-1")).toThrow(AiUsageConflictError);
    addCall("budget-call-2", null);
    recordAiUsageBudgetOutcome(db, 7, "2026-09", null, "budget-call-2");
    assertAiUsageBudgetAllowsRun(db, 7, "2026-09");
    addCall("budget-call-3", null);
    recordAiUsageBudgetOutcome(db, 7, "2026-09", null, "budget-call-3");
    expect(db.query<{ status: string }, []>("SELECT status FROM agent_budgets").get()!.status).toBe("halted");
    expect(() => assertAiUsageBudgetAllowsRun(db, 7, "2026-09")).toThrow(AiUsageBudgetError);
    db.close();
  });
});

describe("legacy compatibility", () => {
  test("does not reinterpret historical zero-cost reports", () => {
    const db = new Database(":memory:");
    db.exec(`CREATE TABLE agent_activity_accounts(account_id TEXT PRIMARY KEY,status TEXT,authority_ref TEXT);
      CREATE TABLE agent_budgets(id INTEGER PRIMARY KEY,agent_id INTEGER,period TEXT,budget_cents INTEGER,used_cents INTEGER,status TEXT,warning_threshold_pct INTEGER,halted_at TEXT,updated_at TEXT);
      CREATE TABLE daily_reports(date TEXT PRIMARY KEY,summary_md TEXT,cost_usd REAL,data_origin TEXT);
      INSERT INTO daily_reports VALUES ('2026-01-01','historical',0,'production');`);
    migrateAiCostAccounting(db);
    expect(db.query<{ cost_usd: number; unknown_cost_count: number | null }, []>(
      "SELECT cost_usd,unknown_cost_count FROM daily_reports",
    ).get()).toEqual({ cost_usd: 0, unknown_cost_count: null });
    db.close();
  });

  test("daily aggregation stores known sum plus unknown count without a provider call", async () => {
    const db = new Database(":memory:");
    db.exec(readFileSync(resolve(import.meta.dir, "../db/schema.sql"), "utf8"));
    migrateAgentActivityLedger(db);
    migrateAiCostAccounting(db);
    db.exec(`INSERT INTO logs(hook_event,session_id,ts) VALUES ('SessionStart','test-session','2026-09-24 12:00:00');
      INSERT INTO agent_costs(agent,cost_usd,created_at,data_origin) VALUES
        ('known',1.25,'2026-09-24 12:00:00','production'),
        ('unknown',NULL,'2026-09-24 12:01:00','production');`);
    const priorError = console.error, priorWarn = console.warn;
    const priorLlmFlag = process.env.IKORABU_DAILY_REPORT_LLM_ENABLED;
    delete process.env.IKORABU_DAILY_REPORT_LLM_ENABLED;
    console.error = () => {}; console.warn = () => {};
    let report;
    try { report = await generateReportForDate(db, "2026-09-24"); }
    finally {
      console.error = priorError; console.warn = priorWarn;
      if (priorLlmFlag === undefined) delete process.env.IKORABU_DAILY_REPORT_LLM_ENABLED;
      else process.env.IKORABU_DAILY_REPORT_LLM_ENABLED = priorLlmFlag;
    }
    expect(report).toMatchObject({ cost_usd: 1.25, unknown_cost_count: 1 });
    expect(db.query<{ cost_usd: number | null; unknown_cost_count: number }, []>(
      "SELECT cost_usd,unknown_cost_count FROM daily_reports",
    ).get()).toEqual({ cost_usd: 1.25, unknown_cost_count: 1 });
    expect(db.query<{ c: number }, []>("SELECT COUNT(*) AS c FROM ai_usage_events").get()?.c).toBe(0);
    db.close();
  });
});

describe("Threads boundary and Mirinya/HQ read model", () => {
  test("uses a read-through fixture and reports unavailable as not zero", async () => {
    const disconnected = await loadThreadsAiUsageSummary({ accountId: "acct_live", from: "2026-09-01", to: "2026-09-30" });
    expect(disconnected.status).toBe("not_connected");
    expect(disconnected.known_cost_micros).toBeNull();
    const unavailable = await loadThreadsAiUsageSummary({ accountId: "acct_live", from: "2026-09-01", to: "2026-09-30",
      bridgeUrl: "https://bridge.invalid", apiKey: "test-key", fetcher: async () => new Response("", { status: 503 }) });
    expect(unavailable).toMatchObject({ status: "unavailable", known_cost_micros: null });

    const connected = await loadThreadsAiUsageSummary({
      accountId: "acct_live", from: "2026-09-01", to: "2026-09-30", bridgeUrl: "https://bridge.invalid", apiKey: "test-key",
      fetcher: async () => new Response(JSON.stringify({ account_id: "acct_live", known_cost_micros: 90,
        unknown_cost_calls: 1, waste_known_micros: 10, waste_count: 1, currency: "USD",
        model_mix: [{ model: "gpt-5", calls: 2, known_cost_micros: 90 }] }), { status: 200 }),
    });
    expect(connected).toMatchObject({ status: "connected", known_cost_micros: 90, unknown_cost_calls: 1 });
  });

  test("excludes demo/legacy rows and never fabricates revenue or margin", () => {
    const db = database();
    appendAiUsageEvent(db, started()); appendAiUsageEvent(db, completed({ terminal_status: "failed" }));
    appendAiUsageEvent(db, started({ usage_event_id: "demo-start", call_id: "demo", run_id: "demo", data_origin: "demo" }));
    appendAiUsageEvent(db, completed({ usage_event_id: "demo-complete", call_id: "demo", run_id: "demo", data_origin: "demo", cost_amount_micros: 999_999 }));
    appendAiUsageEvent(db, started({ usage_event_id: "legacy-start", call_id: "legacy", run_id: "legacy", data_origin: "legacy_unknown" }));
    appendAiUsageEvent(db, completed({ usage_event_id: "legacy-complete", call_id: "legacy", run_id: "legacy", data_origin: "legacy_unknown", cost_amount_micros: 888_888 }));
    appendAiUsageEvent(db, started({ usage_event_id: "unknown-start", call_id: "unknown", run_id: "unknown" }));
    appendAiUsageEvent(db, completed({ usage_event_id: "unknown-complete", call_id: "unknown", run_id: "unknown",
      cost_amount_micros: null, currency: null, cost_basis: "unknown", unknown_reason: "not_reported" }));
    const model = buildMirinyaCostReadModel(db, { from: "2026-09-24T00:00:00.000Z", to: "2026-09-25T00:00:00.000Z", scopeKind: "internal" });
    expect(model.control_plane_ai_cost_known_micros).toBe(123_456);
    expect(model.unknown_cost_calls).toBe(1);
    expect(model.waste_known_micros).toBe(123_456);
    expect(model.attribution_coverage).toEqual({ attributed: 2, total: 2, ratio: 1 });
    expect(model.threads_ai_cost_known_micros).toBeNull();
    expect(model.revenue).toBeNull(); expect(model.margin).toBeNull();
    expect(model.null_reason).toBe("unknown_component");
    expect(isPublicDashboardPath("/costs")).toBe(false);
    expect(isPublicDashboardPath("/api/customer/costs")).toBe(false);
    db.close();
  });

  test("fails totals closed for mixed currency", () => {
    const db = database();
    appendAiUsageEvent(db, started()); appendAiUsageEvent(db, completed());
    appendAiUsageEvent(db, started({ usage_event_id: "yen-start", call_id: "yen", run_id: "yen" }));
    appendAiUsageEvent(db, completed({ usage_event_id: "yen-complete", call_id: "yen", run_id: "yen", currency: "JPY" }));
    const model = buildMirinyaCostReadModel(db, { from: "2026-09-24T00:00:00.000Z", to: "2026-09-25T00:00:00.000Z", scopeKind: "internal" });
    expect(model.currency).toBeNull(); expect(model.null_reason).toBe("mixed_currency");
    db.close();
  });
});
