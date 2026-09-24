import { createHash } from "node:crypto";
import type { Database } from "bun:sqlite";

export const AI_COST_ACCOUNTING_MIGRATION_ID = "20260924_ai_cost_accounting_v1";

export const AI_COST_ACCOUNTING_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS ai_usage_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  usage_event_id TEXT NOT NULL UNIQUE,
  call_id TEXT NOT NULL,
  event_kind TEXT NOT NULL CHECK (event_kind IN ('started','completed')),
  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('internal','account')),
  account_id TEXT REFERENCES agent_activity_accounts(account_id),
  agent_id TEXT,
  provider TEXT NOT NULL,
  model TEXT,
  operation TEXT NOT NULL,
  feature TEXT,
  task_ref TEXT,
  correlation_id TEXT,
  run_id TEXT,
  input_tokens INTEGER CHECK (input_tokens IS NULL OR input_tokens >= 0),
  output_tokens INTEGER CHECK (output_tokens IS NULL OR output_tokens >= 0),
  cache_read_tokens INTEGER CHECK (cache_read_tokens IS NULL OR cache_read_tokens >= 0),
  cache_creation_tokens INTEGER CHECK (cache_creation_tokens IS NULL OR cache_creation_tokens >= 0),
  cost_amount_micros INTEGER CHECK (cost_amount_micros IS NULL OR cost_amount_micros >= 0),
  currency TEXT,
  cost_basis TEXT NOT NULL CHECK (cost_basis IN ('actual','unknown')),
  unknown_reason TEXT,
  terminal_status TEXT CHECK (terminal_status IN ('succeeded','failed','timeout','cancelled')),
  started_at TEXT NOT NULL,
  ended_at TEXT,
  data_origin TEXT NOT NULL CHECK (data_origin IN ('production','demo','legacy_unknown')),
  payload_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(call_id, event_kind),
  CHECK ((scope_kind='internal' AND account_id IS NULL) OR (scope_kind='account' AND account_id IS NOT NULL)),
  CHECK ((event_kind='started' AND terminal_status IS NULL AND ended_at IS NULL
          AND input_tokens IS NULL AND output_tokens IS NULL AND cache_read_tokens IS NULL
          AND cache_creation_tokens IS NULL AND cost_amount_micros IS NULL AND currency IS NULL
          AND cost_basis='unknown' AND unknown_reason IS NULL)
      OR (event_kind='completed' AND terminal_status IS NOT NULL AND ended_at IS NOT NULL
          AND ((cost_amount_micros IS NULL AND cost_basis='unknown' AND unknown_reason IS NOT NULL)
            OR (cost_amount_micros IS NOT NULL AND cost_basis='actual' AND currency IS NOT NULL AND unknown_reason IS NULL))))
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_period
  ON ai_usage_events(data_origin, event_kind, started_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_scope
  ON ai_usage_events(scope_kind, account_id, started_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_attribution
  ON ai_usage_events(agent_id, model, task_ref, run_id);
CREATE TRIGGER IF NOT EXISTS ai_usage_events_no_update
BEFORE UPDATE ON ai_usage_events BEGIN SELECT RAISE(ABORT, 'ai_usage_events is append-only'); END;
CREATE TRIGGER IF NOT EXISTS ai_usage_events_no_delete
BEFORE DELETE ON ai_usage_events BEGIN SELECT RAISE(ABORT, 'ai_usage_events is append-only'); END;
CREATE TRIGGER IF NOT EXISTS ai_usage_scope_active
BEFORE INSERT ON ai_usage_events
WHEN NEW.scope_kind='account' AND NOT EXISTS (
  SELECT 1 FROM agent_activity_accounts WHERE account_id=NEW.account_id AND status='active'
) BEGIN SELECT RAISE(ABORT, 'ai_usage account scope is not active'); END;
CREATE TRIGGER IF NOT EXISTS ai_usage_completed_requires_start
BEFORE INSERT ON ai_usage_events
WHEN NEW.event_kind='completed' AND NOT EXISTS (
  SELECT 1 FROM ai_usage_events started
  WHERE started.call_id=NEW.call_id AND started.event_kind='started'
    AND started.scope_kind=NEW.scope_kind AND started.account_id IS NEW.account_id
    AND started.agent_id IS NEW.agent_id AND started.provider=NEW.provider AND started.model IS NEW.model
    AND started.operation=NEW.operation AND started.feature IS NEW.feature AND started.task_ref IS NEW.task_ref
    AND started.correlation_id IS NEW.correlation_id AND started.run_id IS NEW.run_id
    AND started.started_at=NEW.started_at AND started.data_origin=NEW.data_origin
) BEGIN SELECT RAISE(ABORT, 'ai_usage completion has no matching start'); END;
CREATE TABLE IF NOT EXISTS ai_usage_budget_charges (
  call_id TEXT PRIMARY KEY,
  agent_db_id INTEGER NOT NULL,
  period TEXT NOT NULL,
  cost_amount_micros INTEGER CHECK (cost_amount_micros IS NULL OR cost_amount_micros >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TRIGGER IF NOT EXISTS ai_usage_budget_charges_no_update
BEFORE UPDATE ON ai_usage_budget_charges BEGIN SELECT RAISE(ABORT, 'ai_usage_budget_charges is append-only'); END;
CREATE TRIGGER IF NOT EXISTS ai_usage_budget_charges_no_delete
BEFORE DELETE ON ai_usage_budget_charges BEGIN SELECT RAISE(ABORT, 'ai_usage_budget_charges is append-only'); END;
CREATE TRIGGER IF NOT EXISTS ai_usage_budget_charge_requires_completion
BEFORE INSERT ON ai_usage_budget_charges
WHEN NOT EXISTS (SELECT 1 FROM ai_usage_events WHERE call_id=NEW.call_id AND event_kind='completed'
  AND cost_amount_micros IS NEW.cost_amount_micros)
BEGIN SELECT RAISE(ABORT, 'budget charge must match completed usage'); END;
`;

const SAFE_REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const UNKNOWN_REASONS = new Set(["missing_provider_usage", "timeout", "parse_failure", "provider_error", "not_reported"]);

export class AiUsageConflictError extends Error {
  readonly code = "AI_USAGE_CONFLICT";
}

export class AiUsageScopeError extends Error {
  readonly code = "AI_USAGE_SCOPE_INVALID";
}

export class AiUsageSchemaError extends Error {
  readonly code = "AI_USAGE_SCHEMA_MISSING";
}

export class AiUsageBudgetError extends Error {
  readonly code = "AI_USAGE_BUDGET_HALTED";
}

export interface AiUsageEventInput {
  usage_event_id: string;
  call_id: string;
  event_kind: "started" | "completed";
  scope_kind: "internal" | "account";
  account_id: string | null;
  agent_id: string | null;
  provider: string;
  model: string | null;
  operation: string;
  feature: string | null;
  task_ref: string | null;
  correlation_id: string | null;
  run_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cache_read_tokens: number | null;
  cache_creation_tokens: number | null;
  cost_amount_micros: number | null;
  currency: string | null;
  cost_basis: "actual" | "unknown";
  unknown_reason: string | null;
  terminal_status: "succeeded" | "failed" | "timeout" | "cancelled" | null;
  started_at: string;
  ended_at: string | null;
  data_origin: "production" | "demo" | "legacy_unknown";
}

export interface AiUsageEvent extends AiUsageEventInput {
  sequence: number;
  created_at: string;
}

interface EventRow extends AiUsageEvent {
  payload_hash: string;
}

function hasColumn(db: Database, table: string, column: string): boolean {
  return db.query<{ name: string }, []>(`PRAGMA table_info(${table})`).all().some((row) => row.name === column);
}

export function migrateAiCostAccounting(db: Database): boolean {
  db.exec("PRAGMA foreign_keys=ON");
  const migrate = db.transaction(() => {
    db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now','localtime'))
    )`);
    const applied = db.query<{ version: string }, [string]>(
      "SELECT version FROM schema_migrations WHERE version=?",
    ).get(AI_COST_ACCOUNTING_MIGRATION_ID);
    if (applied) return false;
    if (!hasColumn(db, "agent_budgets", "unknown_run_count")) {
      db.exec("ALTER TABLE agent_budgets ADD COLUMN unknown_run_count INTEGER NOT NULL DEFAULT 0 CHECK (unknown_run_count >= 0)");
    }
    if (!hasColumn(db, "agent_budgets", "unknown_run_limit")) {
      db.exec("ALTER TABLE agent_budgets ADD COLUMN unknown_run_limit INTEGER NOT NULL DEFAULT 3 CHECK (unknown_run_limit >= 1)");
    }
    if (!hasColumn(db, "daily_reports", "unknown_cost_count")) {
      db.exec("ALTER TABLE daily_reports ADD COLUMN unknown_cost_count INTEGER CHECK (unknown_cost_count IS NULL OR unknown_cost_count >= 0)");
    }
    db.exec(AI_COST_ACCOUNTING_SCHEMA_SQL);
    db.query("INSERT INTO schema_migrations(version) VALUES (?)").run(AI_COST_ACCOUNTING_MIGRATION_ID);
    return true;
  });
  return migrate.immediate();
}

export function assertAiCostAccountingSchema(db: Database): void {
  for (const name of ["ai_usage_events", "ai_usage_events_no_update", "ai_usage_events_no_delete", "ai_usage_scope_active", "ai_usage_completed_requires_start",
    "ai_usage_budget_charges", "ai_usage_budget_charges_no_update", "ai_usage_budget_charges_no_delete", "ai_usage_budget_charge_requires_completion"]) {
    const row = db.query<{ name: string }, [string]>("SELECT name FROM sqlite_master WHERE name=?").get(name);
    if (!row) throw new AiUsageSchemaError(`missing AI cost schema object: ${name}`);
  }
  for (const [table, column] of [["agent_budgets", "unknown_run_count"], ["agent_budgets", "unknown_run_limit"], ["daily_reports", "unknown_cost_count"]]) {
    if (!hasColumn(db, table!, column!)) throw new AiUsageSchemaError(`missing ${table}.${column}`);
  }
}

function ref(value: string | null, field: string, required = false): string | null {
  if (value === null) {
    if (required) throw new Error(`${field} is required`);
    return null;
  }
  if (!SAFE_REF.test(value)) throw new Error(`${field} is invalid`);
  return value;
}

function utc(value: string | null, field: string, required = false): string | null {
  if (value === null) {
    if (required) throw new Error(`${field} is required`);
    return null;
  }
  if (!ISO_UTC.test(value) || Number.isNaN(Date.parse(value))) throw new Error(`${field} must be UTC ISO-8601`);
  return new Date(value).toISOString();
}

function amount(value: number | null, field: string): number | null {
  if (value === null) return null;
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${field} must be a non-negative safe integer or null`);
  return value;
}

const INPUT_FIELDS = [
  "usage_event_id", "call_id", "event_kind", "scope_kind", "account_id", "agent_id", "provider", "model",
  "operation", "feature", "task_ref", "correlation_id", "run_id", "input_tokens", "output_tokens",
  "cache_read_tokens", "cache_creation_tokens", "cost_amount_micros", "currency", "cost_basis", "unknown_reason",
  "terminal_status", "started_at", "ended_at", "data_origin",
] as const;

function validateEvent(raw: AiUsageEventInput): AiUsageEventInput {
  if (!raw || typeof raw !== "object") throw new Error("usage event must be an object");
  const unknown = Object.keys(raw).filter((key) => !(INPUT_FIELDS as readonly string[]).includes(key));
  if (unknown.length) throw new Error(`unknown usage fields: ${unknown.join(",")}`);
  const event: AiUsageEventInput = {
    usage_event_id: ref(raw.usage_event_id, "usage_event_id", true)!,
    call_id: ref(raw.call_id, "call_id", true)!,
    event_kind: raw.event_kind,
    scope_kind: raw.scope_kind,
    account_id: ref(raw.account_id, "account_id"),
    agent_id: ref(raw.agent_id, "agent_id"),
    provider: ref(raw.provider, "provider", true)!,
    model: ref(raw.model, "model"),
    operation: ref(raw.operation, "operation", true)!,
    feature: ref(raw.feature, "feature"),
    task_ref: ref(raw.task_ref, "task_ref"),
    correlation_id: ref(raw.correlation_id, "correlation_id"),
    run_id: ref(raw.run_id, "run_id"),
    input_tokens: amount(raw.input_tokens, "input_tokens"),
    output_tokens: amount(raw.output_tokens, "output_tokens"),
    cache_read_tokens: amount(raw.cache_read_tokens, "cache_read_tokens"),
    cache_creation_tokens: amount(raw.cache_creation_tokens, "cache_creation_tokens"),
    cost_amount_micros: amount(raw.cost_amount_micros, "cost_amount_micros"),
    currency: raw.currency,
    cost_basis: raw.cost_basis,
    unknown_reason: raw.unknown_reason,
    terminal_status: raw.terminal_status,
    started_at: utc(raw.started_at, "started_at", true)!,
    ended_at: utc(raw.ended_at, "ended_at"),
    data_origin: raw.data_origin,
  };
  if (!(["started", "completed"] as const).includes(event.event_kind)) throw new Error("event_kind is invalid");
  if (!(["internal", "account"] as const).includes(event.scope_kind)) throw new Error("scope_kind is invalid");
  if (event.scope_kind === "internal" && event.account_id !== null) throw new AiUsageScopeError("internal usage cannot have an account");
  if (event.scope_kind === "account" && event.account_id === null) throw new AiUsageScopeError("account usage requires account_id");
  if (!(["production", "demo", "legacy_unknown"] as const).includes(event.data_origin)) throw new Error("data_origin is invalid");
  if (event.currency !== null && !/^[A-Z]{3}$/.test(event.currency)) throw new Error("currency must be an ISO-style uppercase code");
  if (event.event_kind === "started") {
    if (event.terminal_status !== null || event.ended_at !== null || event.cost_amount_micros !== null || event.currency !== null
      || event.input_tokens !== null || event.output_tokens !== null || event.cache_read_tokens !== null
      || event.cache_creation_tokens !== null || event.cost_basis !== "unknown" || event.unknown_reason !== null) {
      throw new Error("started events cannot contain completion usage");
    }
  } else {
    if (!event.terminal_status || !event.ended_at) throw new Error("completed events require terminal status and ended_at");
    if (Date.parse(event.ended_at) < Date.parse(event.started_at)) throw new Error("ended_at precedes started_at");
    if (event.cost_amount_micros === null) {
      if (event.cost_basis !== "unknown" || !event.unknown_reason || !UNKNOWN_REASONS.has(event.unknown_reason)) {
        throw new Error("unknown completed cost requires an explicit unknown_reason");
      }
      if (event.currency !== null) throw new Error("unknown cost cannot claim a currency");
    } else if (event.cost_basis !== "actual" || event.currency === null || event.unknown_reason !== null) {
      throw new Error("known completed cost requires actual basis and currency");
    }
  }
  return Object.freeze(event);
}

function eventPayload(event: AiUsageEventInput): string {
  return JSON.stringify(Object.fromEntries(INPUT_FIELDS.map((field) => [field, event[field]])));
}

function rowEvent(row: EventRow): AiUsageEvent {
  const validated = validateEvent(Object.fromEntries(INPUT_FIELDS.map((field) => [field, row[field]])) as unknown as AiUsageEventInput);
  return Object.freeze({ ...validated, sequence: row.sequence, created_at: utc(row.created_at, "created_at", true)! });
}

export function appendAiUsageEvent(db: Database, raw: AiUsageEventInput): AiUsageEvent {
  assertAiCostAccountingSchema(db);
  const event = validateEvent(raw);
  const payloadHash = createHash("sha256").update(eventPayload(event)).digest("hex");
  const append = db.transaction(() => {
    const byEvent = db.query<EventRow, [string]>("SELECT * FROM ai_usage_events WHERE usage_event_id=?").get(event.usage_event_id);
    if (byEvent) {
      if (byEvent.payload_hash === payloadHash && eventPayload(rowEvent(byEvent)) === eventPayload(event)) return rowEvent(byEvent);
      throw new AiUsageConflictError("usage_event_id already has a different payload");
    }
    const byCall = db.query<{ usage_event_id: string }, [string, string]>(
      "SELECT usage_event_id FROM ai_usage_events WHERE call_id=? AND event_kind=?",
    ).get(event.call_id, event.event_kind);
    if (byCall) throw new AiUsageConflictError("call already has a different event identity");
    if (event.scope_kind === "account") {
      const account = db.query<{ status: string }, [string]>(
        "SELECT status FROM agent_activity_accounts WHERE account_id=?",
      ).get(event.account_id!);
      if (!account || account.status !== "active") throw new AiUsageScopeError("account is not canonically registered and active");
    }
    db.query(`INSERT INTO ai_usage_events (
      usage_event_id, call_id, event_kind, scope_kind, account_id, agent_id, provider, model, operation, feature,
      task_ref, correlation_id, run_id, input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens,
      cost_amount_micros, currency, cost_basis, unknown_reason, terminal_status, started_at, ended_at, data_origin, payload_hash
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      ...INPUT_FIELDS.map((field) => event[field]), payloadHash,
    );
    return rowEvent(db.query<EventRow, [string]>("SELECT * FROM ai_usage_events WHERE usage_event_id=?").get(event.usage_event_id)!);
  });
  return append.immediate();
}

export function assertAiUsageBudgetAllowsRun(db: Database, agentId: number, period: string): void {
  const rows = db.query<{ status: string; used_cents: number; budget_cents: number; unknown_run_count: number; unknown_run_limit: number }, [number, string]>(
    `SELECT status, used_cents, budget_cents, unknown_run_count, unknown_run_limit FROM agent_budgets
     WHERE (agent_id=? OR agent_id IS NULL) AND period=?`,
  ).all(agentId, period);
  if (rows.some((row) => row.status === "halted" || row.used_cents >= row.budget_cents || row.unknown_run_count >= row.unknown_run_limit)) {
    throw new AiUsageBudgetError("known or unknown AI usage budget is halted");
  }
}

export function recordAiUsageBudgetOutcome(
  db: Database, agentId: number, period: string, costAmountMicros: number | null, callId: string,
): boolean {
  amount(costAmountMicros, "cost_amount_micros");
  ref(callId, "call_id", true);
  const cents = costAmountMicros === null ? 0 : Math.round(costAmountMicros / 10_000);
  return db.transaction(() => {
    const existing = db.query<{ agent_db_id: number; period: string; cost_amount_micros: number | null }, [string]>(
      "SELECT agent_db_id,period,cost_amount_micros FROM ai_usage_budget_charges WHERE call_id=?",
    ).get(callId);
    if (existing) {
      if (existing.agent_db_id === agentId && existing.period === period && existing.cost_amount_micros === costAmountMicros) return false;
      throw new AiUsageConflictError("call already has a different budget outcome");
    }
    db.query(`UPDATE agent_budgets SET
      used_cents=used_cents+?, unknown_run_count=unknown_run_count+?, updated_at=datetime('now','localtime')
      WHERE (agent_id=? OR agent_id IS NULL) AND period=?`).run(cents, costAmountMicros === null ? 1 : 0, agentId, period);
    db.query(`UPDATE agent_budgets SET status=CASE
      WHEN used_cents>=budget_cents OR unknown_run_count>=unknown_run_limit THEN 'halted'
      WHEN used_cents*100>=budget_cents*COALESCE(warning_threshold_pct,80) THEN 'warning'
      ELSE status END,
      halted_at=CASE WHEN used_cents>=budget_cents OR unknown_run_count>=unknown_run_limit THEN datetime('now','localtime') ELSE halted_at END
      WHERE (agent_id=? OR agent_id IS NULL) AND period=? AND status IN ('active','warning')`).run(agentId, period);
    db.query("INSERT INTO ai_usage_budget_charges(call_id,agent_db_id,period,cost_amount_micros) VALUES (?,?,?,?)")
      .run(callId, agentId, period, costAmountMicros);
    return true;
  }).immediate();
}

export interface ThreadsAiUsageSummary {
  status: "connected" | "not_connected" | "unavailable";
  account_id: string;
  from: string;
  to: string;
  known_cost_micros: number | null;
  unknown_cost_calls: number;
  waste_known_micros: number | null;
  waste_count: number;
  currency: string | null;
  model_mix: ReadonlyArray<{ model: string; calls: number; known_cost_micros: number | null }>;
}

function disconnectedThreads(accountId: string, from: string, to: string, status: "not_connected" | "unavailable"): ThreadsAiUsageSummary {
  return Object.freeze({ status, account_id: accountId, from, to, known_cost_micros: null, unknown_cost_calls: 0,
    waste_known_micros: null, waste_count: 0, currency: null, model_mix: Object.freeze([]) });
}

export async function loadThreadsAiUsageSummary(options: {
  accountId: string; from: string; to: string; bridgeUrl?: string; apiKey?: string;
  fetcher?: typeof fetch;
}): Promise<ThreadsAiUsageSummary> {
  const { accountId, from, to } = options;
  ref(accountId, "account_id", true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to) throw new Error("invalid Threads summary period");
  if (!options.bridgeUrl || !options.apiKey) return disconnectedThreads(accountId, from, to, "not_connected");
  try {
    const url = new URL(`/operator/accounts/${encodeURIComponent(accountId)}/ai-usage/summary`, options.bridgeUrl);
    url.searchParams.set("from", from); url.searchParams.set("to", to);
    const response = await (options.fetcher ?? fetch)(url, { headers: { Authorization: `Bearer ${options.apiKey}` } });
    if (!response.ok) return disconnectedThreads(accountId, from, to, "unavailable");
    const raw = await response.json() as Record<string, unknown>;
    if (raw.account_id !== accountId) throw new Error("Threads summary account mismatch");
    const known = raw.known_cost_micros;
    const unknown = raw.unknown_cost_calls;
    const waste = raw.waste_known_micros;
    const wasteCount = raw.waste_count;
    const currency = raw.currency;
    if ((known !== null && (!Number.isSafeInteger(known) || Number(known) < 0)) || !Number.isSafeInteger(unknown) || Number(unknown) < 0
      || (waste !== null && (!Number.isSafeInteger(waste) || Number(waste) < 0)) || !Number.isSafeInteger(wasteCount) || Number(wasteCount) < 0
      || (currency !== null && (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)))) throw new Error("malformed Threads cost summary");
    const mix = Array.isArray(raw.model_mix) ? raw.model_mix.map((item) => {
      const row = item as Record<string, unknown>;
      if (typeof row.model !== "string" || !SAFE_REF.test(row.model) || !Number.isSafeInteger(row.calls) || Number(row.calls) < 0
        || (row.known_cost_micros !== null && (!Number.isSafeInteger(row.known_cost_micros) || Number(row.known_cost_micros) < 0))) throw new Error("malformed Threads model mix");
      return Object.freeze({ model: row.model, calls: Number(row.calls), known_cost_micros: row.known_cost_micros === null ? null : Number(row.known_cost_micros) });
    }) : [];
    return Object.freeze({ status: "connected", account_id: accountId, from, to,
      known_cost_micros: known === null ? null : Number(known), unknown_cost_calls: Number(unknown),
      waste_known_micros: waste === null ? null : Number(waste), waste_count: Number(wasteCount),
      currency: currency as string | null, model_mix: Object.freeze(mix) });
  } catch {
    return disconnectedThreads(accountId, from, to, "unavailable");
  }
}

export interface MirinyaCostReadModel {
  period: { from: string; to: string };
  scope: { kind: "internal" | "account"; account_id: string | null };
  control_plane_ai_cost_known_micros: number;
  threads_ai_cost_known_micros: number | null;
  unknown_cost_calls: number;
  waste_known_micros: number;
  waste_count: number;
  attribution_coverage: { attributed: number; total: number; ratio: number | null };
  unallocated_known_micros: number;
  model_mix: ReadonlyArray<{ model: string; calls: number; known_cost_micros: number }>;
  currency: string | null;
  threads_status: ThreadsAiUsageSummary["status"];
  revenue: null;
  margin: null;
  null_reason: "not_connected" | "unknown_component" | "mixed_currency";
}

export function buildMirinyaCostReadModel(db: Database, options: {
  from: string; to: string; scopeKind: "internal" | "account"; accountId?: string | null;
  threadsSummary?: ThreadsAiUsageSummary;
}): MirinyaCostReadModel {
  assertAiCostAccountingSchema(db);
  const from = utc(options.from, "from", true)!;
  const to = utc(options.to, "to", true)!;
  if (from > to) throw new Error("invalid period");
  const accountId = options.scopeKind === "account" ? ref(options.accountId ?? null, "account_id", true)! : null;
  if (options.scopeKind === "internal" && options.accountId) throw new AiUsageScopeError("internal read model cannot have account_id");
  const scopeSql = options.scopeKind === "internal" ? "scope_kind='internal'" : "scope_kind='account' AND account_id=?";
  const args = options.scopeKind === "internal" ? [from, to] : [from, to, accountId!];
  const rows = db.query<{ model: string | null; provider: string; operation: string; agent_id: string | null; task_ref: string | null;
    cost_amount_micros: number | null; currency: string | null; terminal_status: string }, string[]>(
    `SELECT model, provider, operation, agent_id, task_ref, cost_amount_micros, currency, terminal_status
     FROM ai_usage_events WHERE data_origin='production' AND event_kind='completed'
       AND started_at>=? AND started_at<? AND ${scopeSql}`,
  ).all(...args);
  const currencies = new Set(rows.flatMap((row) => row.cost_amount_micros === null || row.currency === null ? [] : [row.currency]));
  const known = rows.reduce((sum, row) => sum + (row.cost_amount_micros ?? 0), 0);
  const unknown = rows.filter((row) => row.cost_amount_micros === null).length;
  const wasteRows = rows.filter((row) => row.terminal_status === "failed" || row.terminal_status === "timeout");
  const attributed = rows.filter((row) => row.model && row.provider && row.operation && (row.agent_id || row.task_ref)).length;
  const unallocatedKnown = rows.filter((row) => !(row.model && row.provider && row.operation && (row.agent_id || row.task_ref)))
    .reduce((sum, row) => sum + (row.cost_amount_micros ?? 0), 0);
  const mixMap = new Map<string, { calls: number; known: number }>();
  for (const row of rows) {
    const model = row.model ?? "unknown";
    const current = mixMap.get(model) ?? { calls: 0, known: 0 };
    current.calls++; current.known += row.cost_amount_micros ?? 0; mixMap.set(model, current);
  }
  const threads = options.threadsSummary ?? disconnectedThreads(accountId ?? "internal", from.slice(0, 10), to.slice(0, 10), "not_connected");
  if (threads.status === "connected") {
    for (const row of threads.model_mix) {
      const current = mixMap.get(row.model) ?? { calls: 0, known: 0 };
      current.calls += row.calls;
      current.known += row.known_cost_micros ?? 0;
      mixMap.set(row.model, current);
    }
  }
  const mixed = currencies.size > 1 || (threads.status === "connected" && threads.currency !== null && currencies.size === 1 && !currencies.has(threads.currency));
  const unknownComponents = unknown + (threads.status === "connected" ? threads.unknown_cost_calls : 0) > 0;
  const currency = mixed ? null : (currencies.values().next().value ?? threads.currency ?? null);
  return Object.freeze({
    period: Object.freeze({ from, to }), scope: Object.freeze({ kind: options.scopeKind, account_id: accountId }),
    control_plane_ai_cost_known_micros: known,
    threads_ai_cost_known_micros: threads.status === "connected" ? threads.known_cost_micros : null,
    unknown_cost_calls: unknown + (threads.status === "connected" ? threads.unknown_cost_calls : 0),
    waste_known_micros: wasteRows.reduce((sum, row) => sum + (row.cost_amount_micros ?? 0), 0)
      + (threads.status === "connected" ? threads.waste_known_micros ?? 0 : 0),
    waste_count: wasteRows.length + (threads.status === "connected" ? threads.waste_count : 0),
    attribution_coverage: Object.freeze({ attributed, total: rows.length, ratio: rows.length ? attributed / rows.length : null }),
    unallocated_known_micros: options.scopeKind === "internal" ? known + (threads.status === "connected" ? threads.known_cost_micros ?? 0 : 0) : unallocatedKnown,
    model_mix: Object.freeze([...mixMap.entries()].map(([model, value]) => Object.freeze({ model, calls: value.calls, known_cost_micros: value.known }))
      .sort((a, b) => b.known_cost_micros - a.known_cost_micros || a.model.localeCompare(b.model))),
    currency, threads_status: threads.status, revenue: null, margin: null,
    null_reason: mixed ? "mixed_currency" : unknownComponents ? "unknown_component" : "not_connected",
  });
}

export function usdToMicros(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.round(value * 1_000_000) : null;
}
