import { createHash } from "node:crypto";
import type { Database } from "bun:sqlite";
import {
  ActivityLedgerConflictError,
} from "./agent-activity-ledger";
import {
  advanceThreadsActivityCheckpoint,
  normalizeThreadsUtcTimestamp,
  projectThreadsActivityEvent,
  readThreadsActivityCheckpoint,
  type ThreadsActivityEvent,
  type ThreadsActivityEventType,
} from "./threads-activity-projector";

export const THREADS_ACTIVITY_CONSUMER_MIGRATION_ID = "20260924_threads_activity_consumer_v1";
export const THREADS_ACTIVITY_PROJECTION_FLAG = "THREADS_ACTIVITY_PROJECTION_ENABLED";
export const THREADS_ACTIVITY_PAGE_MAX = 100;
const MAX_BRIDGE_RESPONSE_BYTES = 512_000;

const ACCOUNT_PATTERN = /^acct_[A-Za-z0-9_-]{1,128}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,194}$/;
const DETAIL_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const SOURCE_REF_PATTERN = /^source:[A-Za-z0-9][A-Za-z0-9._:\/-]{0,499}$/;
const SECRET_OR_PII = /(?:\bBearer\s+|access_token|oauth_token|api_key|client_secret|\bsk-|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?\d[\d ()-]{7,}\d))/i;

export const THREADS_ACTIVITY_CONSUMER_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS threads_activity_projection_sources (
  feed_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE REFERENCES agent_activity_accounts(account_id),
  source_ref TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0,1)),
  last_attempted_at TEXT,
  last_successful_at TEXT,
  projected_count INTEGER NOT NULL DEFAULT 0 CHECK (projected_count >= 0),
  skipped_duplicate_count INTEGER NOT NULL DEFAULT 0 CHECK (skipped_duplicate_count >= 0),
  last_safe_error_code TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (length(feed_id) BETWEEN 1 AND 120),
  CHECK (length(account_id) BETWEEN 1 AND 140),
  CHECK (length(source_ref) BETWEEN 1 AND 520)
);
`;

export type ProjectionSafeErrorCode =
  | "ACCOUNT_NOT_ENROLLED"
  | "ACCOUNT_DISABLED"
  | "PROJECTION_CURSOR_REQUIRED"
  | "BRIDGE_UNAVAILABLE"
  | "BRIDGE_TIMEOUT"
  | "BRIDGE_UNAUTHORIZED"
  | "BRIDGE_FORBIDDEN"
  | "BRIDGE_ACCOUNT_OR_CURSOR_NOT_FOUND"
  | "BRIDGE_CONTRACT_CONFLICT"
  | "BRIDGE_HTTP_ERROR"
  | "BRIDGE_CONTRACT_INVALID"
  | "UNSUPPORTED_EVENT_TYPE"
  | "LEDGER_CONFLICT"
  | "LEDGER_WRITE_FAILED"
  | "CHECKPOINT_WRITE_FAILED"
  | "STATUS_WRITE_FAILED";

export class ThreadsActivityConsumerError extends Error {
  constructor(readonly code: ProjectionSafeErrorCode, message = code) {
    super(message);
  }
}

export class ThreadsActivityConsumerSchemaError extends Error {
  readonly code = "THREADS_ACTIVITY_CONSUMER_SCHEMA_MISSING";
}

interface ProjectionSourceRow {
  readonly feed_id: string;
  readonly account_id: string;
  readonly source_ref: string;
  readonly enabled: number;
  readonly last_attempted_at: string | null;
  readonly last_successful_at: string | null;
  readonly projected_count: number;
  readonly skipped_duplicate_count: number;
  readonly last_safe_error_code: string | null;
}

export interface ThreadsActivityProjectionStatus {
  readonly account_id: string;
  readonly enabled: boolean;
  readonly last_attempted_at: string | null;
  readonly last_successful_at: string | null;
  readonly current_checkpoint: string | null;
  readonly projected_count: number;
  readonly skipped_duplicate_count: number;
  readonly last_safe_error_code: string | null;
}

export interface BridgeAuditEventV1 {
  readonly event_id: string;
  readonly event_type: string;
  readonly entity_id: string | null;
  readonly entity_version: number | null;
  readonly created_at: string;
  readonly detail: Readonly<Record<string, string | number>>;
}

export interface BridgeAuditPageV1 {
  readonly account_id: string;
  readonly after: string | null;
  readonly limit: number;
  readonly events: readonly BridgeAuditEventV1[];
  readonly has_more: boolean;
  readonly next_after: string | null;
  readonly meta: Readonly<{ schema_version: 1 }>;
}

export interface ProjectionRunSummary {
  readonly status: "disabled" | "succeeded" | "failed";
  readonly account_id: string;
  readonly fetched_count: number;
  readonly projected_count: number;
  readonly skipped_duplicate_count: number;
  readonly checkpoint: string | null;
  readonly has_more: boolean;
  readonly safe_error_code: ProjectionSafeErrorCode | null;
}

type FetchLike = typeof fetch;

export interface RunProjectionOnceOptions {
  readonly accountId: string;
  readonly enabled?: boolean;
  readonly env?: Record<string, string | undefined>;
  readonly bridgeUrl?: string;
  readonly apiKey?: string;
  readonly tenantUserId?: string;
  readonly limit?: number;
  readonly timeoutMs?: number;
  readonly fromBeginning?: boolean;
  readonly fetcher?: FetchLike;
  /** Test-only crash seam. Production callers must not set this hook. */
  readonly afterLedgerCommit?: (sourceEventId: string) => void;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(Object.getOwnPropertyDescriptors(value)).every((descriptor) => !descriptor.get && !descriptor.set);
}

function accountId(value: unknown): string {
  if (typeof value !== "string" || !ACCOUNT_PATTERN.test(value)) throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  return value;
}

function token(value: unknown, max = 195): string {
  if (typeof value !== "string" || value.length > max || !TOKEN_PATTERN.test(value) || SECRET_OR_PII.test(value)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  return value;
}

function optionalToken(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || !DETAIL_TOKEN_PATTERN.test(value) || SECRET_OR_PII.test(value)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  return value;
}

function exactKeys(value: Record<string, unknown>, allowed: readonly string[]): void {
  if (Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
}

const DETAIL_KEYS = Object.freeze([
  "cycle_id", "cycle_key", "experiment_id", "content_id", "cta_policy",
  "content_role", "n_parts", "state", "status", "test_variable",
] as const);

function sanitizedDetail(value: unknown): Readonly<Record<string, string | number>> {
  if (!isPlainObject(value)) throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  exactKeys(value, DETAIL_KEYS);
  const result: Record<string, string | number> = {};
  for (const key of DETAIL_KEYS) {
    const item = value[key];
    if (item === undefined || item === null) continue;
    if (key === "n_parts") {
      if (!Number.isSafeInteger(item) || Number(item) < 0 || Number(item) > 100) {
        throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
      }
      result[key] = Number(item);
      continue;
    }
    if (key === "cycle_key") {
      if (typeof item !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(item)
        || Number.isNaN(Date.parse(`${item}T00:00:00Z`))) {
        throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
      }
      result[key] = item;
      continue;
    }
    const safe = optionalToken(item);
    if (safe === null) continue;
    if (key === "cta_policy" && safe !== "none") throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
    if (key === "content_role" && !["reach", "trust", "desire", "conversion"].includes(safe)) {
      throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
    }
    result[key] = safe;
  }
  return Object.freeze(result);
}

function parseBridgeEvent(value: unknown): BridgeAuditEventV1 {
  if (!isPlainObject(value)) throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  exactKeys(value, ["event_id", "event_type", "entity_id", "entity_version", "created_at", "detail"]);
  const version = value.entity_version;
  if (version !== undefined && version !== null && (!Number.isSafeInteger(version) || Number(version) < 0)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  return Object.freeze({
    event_id: token(value.event_id),
    event_type: token(value.event_type, 160),
    entity_id: optionalToken(value.entity_id),
    entity_version: version === undefined || version === null ? null : Number(version),
    created_at: (() => {
      try { return normalizeThreadsUtcTimestamp(value.created_at); }
      catch { throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID"); }
    })(),
    detail: sanitizedDetail(value.detail),
  });
}

export function parseBridgeAuditPageV1(
  value: unknown, expectedAccountId: string, requestedAfter: string | null, requestedLimit: number,
): BridgeAuditPageV1 {
  if (!isPlainObject(value)) throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  exactKeys(value, ["account_id", "after", "limit", "events", "has_more", "next_after", "meta"]);
  const responseAfter = value.after === undefined ? null : optionalToken(value.after);
  if (accountId(value.account_id) !== expectedAccountId || responseAfter !== requestedAfter
    || value.limit !== requestedLimit || typeof value.has_more !== "boolean" || !isPlainObject(value.meta)
    || Object.keys(value.meta).length !== 1 || value.meta.schema_version !== 1 || !Array.isArray(value.events)
    || value.events.length > requestedLimit || value.events.length > THREADS_ACTIVITY_PAGE_MAX) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  const events = Object.freeze(value.events.map(parseBridgeEvent));
  if (new Set(events.map((event) => event.event_id)).size !== events.length) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  if (events.some((event, index) => index > 0 && event.created_at < events[index - 1].created_at)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  const nextAfter = optionalToken(value.next_after);
  if ((events.length === 0 && nextAfter !== null)
    || (events.length === 0 && value.has_more)
    || (events.length > 0 && nextAfter !== events.at(-1)!.event_id)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  return Object.freeze({
    account_id: expectedAccountId,
    after: requestedAfter,
    limit: requestedLimit,
    events,
    has_more: value.has_more,
    next_after: nextAfter,
    meta: Object.freeze({ schema_version: 1 as const }),
  });
}

const MAPPINGS: Readonly<Record<string, {
  type: ThreadsActivityEventType;
  actor: string | null;
  decision: ThreadsActivityEvent["decision_status"];
  result: ThreadsActivityEvent["result_status"];
}>> = Object.freeze({
  baseline_cta_declared: { type: "baseline_cta_declared", actor: null, decision: "not_applicable", result: "succeeded" },
  editorial_cycle_waiting: { type: "editorial_cycle_waiting", actor: "Editorial Runner", decision: "pending", result: "pending" },
  editorial_experiment_decided: { type: "editorial_experiment_decided", actor: "Experiment Planner", decision: "approved", result: "succeeded" },
  editorial_draft_ready: { type: "editorial_draft_ready", actor: "Editorial Runner", decision: "pending", result: "succeeded" },
  editorial_cycle_approved: { type: "editorial_cycle_approved", actor: "Editorial Runner", decision: "approved", result: "succeeded" },
  experiment_observation_ready: { type: "experiment_observation_ready", actor: "Performance Learner", decision: "not_applicable", result: "succeeded" },
  experiment_evaluated: { type: "experiment_evaluated", actor: "Experiment Planner", decision: "approved", result: "succeeded" },
  experiment_inconclusive: { type: "experiment_inconclusive", actor: "Performance Learner", decision: "unknown", result: "unknown" },
  learning_outcome_recorded: { type: "learning_outcome_recorded", actor: "Performance Learner", decision: "not_applicable", result: "succeeded" },
  next_experiment_selected: { type: "next_experiment_selected", actor: "Experiment Planner", decision: "approved", result: "succeeded" },
  experiment_completed: { type: "experiment_completed", actor: "Experiment Planner", decision: "not_applicable", result: "succeeded" },
  insights_collected: { type: "insights_collected", actor: "Performance Learner", decision: "not_applicable", result: "succeeded" },
  publication_state: { type: "publication_state", actor: "Editorial Runner", decision: "not_applicable", result: "succeeded" },
  safety_state: { type: "safety_state", actor: "QA", decision: "not_applicable", result: "succeeded" },
});
export const THREADS_PROJECTABLE_AUDIT_EVENT_TYPES = Object.freeze(Object.keys(MAPPINGS));

export function mapBridgeAuditEvent(account: string, event: BridgeAuditEventV1): ThreadsActivityEvent {
  const mapping = MAPPINGS[event.event_type];
  if (!mapping) throw new ThreadsActivityConsumerError("UNSUPPORTED_EVENT_TYPE");
  const detail = event.detail;
  const cycle = typeof detail.cycle_id === "string" ? detail.cycle_id : null;
  const experiment = typeof detail.experiment_id === "string" ? detail.experiment_id : null;
  const content = typeof detail.content_id === "string" ? detail.content_id : event.entity_id;
  const evidence = new Set<string>();
  if (cycle) evidence.add(`cycle:${cycle}`);
  if (experiment) evidence.add(`experiment:${experiment}`);
  if (content) evidence.add(`content:${content}`);
  return Object.freeze({
    source_event_id: event.event_id,
    created_at: event.created_at,
    account_id: accountId(account),
    event_type: mapping.type,
    actor_type: mapping.actor ? "system_capability" : "unknown",
    actor_id: mapping.actor,
    evidence_refs: Object.freeze([...evidence].sort()),
    decision_status: mapping.decision,
    result_status: mapping.result,
    artifact_ref: content ? `content:${content}` : null,
    cycle_id: cycle,
    experiment_id: experiment,
    correlation_id: null,
    corrects_source_event_id: null,
  });
}

export function projectionEnabledFromEnv(env: Record<string, string | undefined> = process.env): boolean {
  return /^(?:1|true|yes|on)$/i.test(env[THREADS_ACTIVITY_PROJECTION_FLAG]?.trim() ?? "");
}

export function threadsActivityFeedId(account: string): string {
  accountId(account);
  return `threads.audit.${createHash("sha256").update(account).digest("hex").slice(0, 24)}`;
}

export function migrateThreadsActivityConsumer(db: Database): boolean {
  db.exec("PRAGMA foreign_keys = ON");
  const migrate = db.transaction(() => {
    db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now','localtime'))
    )`);
    const applied = db.query<{ version: string }, [string]>(
      "SELECT version FROM schema_migrations WHERE version = ?",
    ).get(THREADS_ACTIVITY_CONSUMER_MIGRATION_ID);
    db.exec(THREADS_ACTIVITY_CONSUMER_SCHEMA_SQL);
    if (!applied) db.query("INSERT INTO schema_migrations(version) VALUES (?)").run(THREADS_ACTIVITY_CONSUMER_MIGRATION_ID);
    return !applied;
  });
  return migrate.immediate();
}

export function assertThreadsActivityConsumerSchema(db: Database): void {
  const row = db.query<{ name: string }, []>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='threads_activity_projection_sources'",
  ).get();
  if (!row) throw new ThreadsActivityConsumerSchemaError("missing Threads activity consumer schema");
}

export function registerThreadsActivityProjectionSource(
  db: Database, account: string, sourceRef: string,
): ThreadsActivityProjectionStatus {
  const safeAccount = accountId(account);
  if (!SOURCE_REF_PATTERN.test(sourceRef) || SECRET_OR_PII.test(sourceRef)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  assertThreadsActivityConsumerSchema(db);
  const registered = db.query<{ status: string }, [string]>(
    "SELECT status FROM agent_activity_accounts WHERE account_id=?",
  ).get(safeAccount);
  if (!registered || registered.status !== "active") throw new ThreadsActivityConsumerError("ACCOUNT_NOT_ENROLLED");
  const feed = threadsActivityFeedId(safeAccount);
  const existing = db.query<ProjectionSourceRow, [string]>(
    "SELECT * FROM threads_activity_projection_sources WHERE account_id=?",
  ).get(safeAccount);
  if (existing && (existing.feed_id !== feed || existing.source_ref !== sourceRef)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  if (!existing) {
    db.query("INSERT INTO threads_activity_projection_sources(feed_id,account_id,source_ref) VALUES (?,?,?)")
      .run(feed, safeAccount, sourceRef);
  }
  return readThreadsActivityProjectionStatus(db, safeAccount)!;
}

export function setThreadsActivityProjectionSourceEnabled(
  db: Database, account: string, enabled: boolean,
): ThreadsActivityProjectionStatus {
  const safeAccount = accountId(account);
  assertThreadsActivityConsumerSchema(db);
  const result = db.query(
    "UPDATE threads_activity_projection_sources SET enabled=?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE account_id=?",
  ).run(enabled ? 1 : 0, safeAccount);
  if (result.changes !== 1) throw new ThreadsActivityConsumerError("ACCOUNT_NOT_ENROLLED");
  return readThreadsActivityProjectionStatus(db, safeAccount)!;
}

export function readThreadsActivityProjectionStatus(
  db: Database, account: string,
): ThreadsActivityProjectionStatus | null {
  const safeAccount = accountId(account);
  assertThreadsActivityConsumerSchema(db);
  const row = db.query<ProjectionSourceRow, [string]>(
    "SELECT * FROM threads_activity_projection_sources WHERE account_id=?",
  ).get(safeAccount);
  if (!row) return null;
  const checkpoint = readThreadsActivityCheckpoint(db, row.feed_id);
  return Object.freeze({
    account_id: row.account_id,
    enabled: row.enabled === 1,
    last_attempted_at: row.last_attempted_at,
    last_successful_at: row.last_successful_at,
    current_checkpoint: checkpoint?.last_source_event_id ?? null,
    projected_count: row.projected_count,
    skipped_duplicate_count: row.skipped_duplicate_count,
    last_safe_error_code: row.last_safe_error_code,
  });
}

function safeOrigin(raw: string): string {
  let url: URL;
  try { url = new URL(raw); } catch { throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID"); }
  const local = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(url.hostname.toLowerCase());
  if ((!local && url.protocol !== "https:") || (local && !["http:", "https:"].includes(url.protocol))
    || url.username || url.password || url.search || url.hash || !["", "/"].includes(url.pathname)) {
    throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
  }
  return url.origin;
}

function fetchHeaders(apiKey: string, tenantUserId?: string): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (tenantUserId !== undefined) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._:@-]{0,199}$/.test(tenantUserId)) {
      throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
    }
    headers["X-Threads-User-ID"] = tenantUserId;
  }
  return headers;
}

function safeFailureCode(error: unknown): ProjectionSafeErrorCode {
  if (error instanceof ThreadsActivityConsumerError) return error.code;
  const name = error instanceof Error ? error.name : "";
  if (name === "AbortError" || name === "TimeoutError") return "BRIDGE_TIMEOUT";
  return "BRIDGE_UNAVAILABLE";
}

function updateFailure(
  db: Database, account: string, code: ProjectionSafeErrorCode, projected = 0, duplicates = 0,
): void {
  db.query(`UPDATE threads_activity_projection_sources
    SET last_attempted_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),
        projected_count=projected_count+?,skipped_duplicate_count=skipped_duplicate_count+?,
        last_safe_error_code=?,
        updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE account_id=?`)
    .run(projected, duplicates, code, account);
}

function updateSuccess(db: Database, account: string, projected: number, duplicates: number): void {
  db.query(`UPDATE threads_activity_projection_sources SET
    last_attempted_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),
    last_successful_at=strftime('%Y-%m-%dT%H:%M:%fZ','now'),
    projected_count=projected_count+?,skipped_duplicate_count=skipped_duplicate_count+?,
    last_safe_error_code=NULL,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
    WHERE account_id=?`).run(projected, duplicates, account);
}

export async function runThreadsActivityProjectionOnce(
  db: Database, options: RunProjectionOnceOptions,
): Promise<ProjectionRunSummary> {
  const account = accountId(options.accountId);
  const enabled = options.enabled ?? projectionEnabledFromEnv(options.env);
  if (!enabled) {
    return Object.freeze({ status: "disabled", account_id: account, fetched_count: 0, projected_count: 0,
      skipped_duplicate_count: 0, checkpoint: null, has_more: false, safe_error_code: null });
  }
  assertThreadsActivityConsumerSchema(db);
  const source = db.query<ProjectionSourceRow, [string]>(
    `SELECT s.* FROM threads_activity_projection_sources s
     JOIN agent_activity_accounts a ON a.account_id=s.account_id
     WHERE s.account_id=? AND a.status='active'`,
  ).get(account);
  if (!source) {
    return Object.freeze({ status: "failed", account_id: account, fetched_count: 0, projected_count: 0,
      skipped_duplicate_count: 0, checkpoint: null, has_more: false, safe_error_code: "ACCOUNT_NOT_ENROLLED" });
  }
  if (source.enabled !== 1) {
    updateFailure(db, account, "ACCOUNT_DISABLED");
    return Object.freeze({ status: "failed", account_id: account, fetched_count: 0, projected_count: 0,
      skipped_duplicate_count: 0, checkpoint: null, has_more: false, safe_error_code: "ACCOUNT_DISABLED" });
  }
  const current = readThreadsActivityCheckpoint(db, source.feed_id);
  if (!current && options.fromBeginning !== true) {
    updateFailure(db, account, "PROJECTION_CURSOR_REQUIRED");
    return Object.freeze({ status: "failed", account_id: account, fetched_count: 0, projected_count: 0,
      skipped_duplicate_count: 0, checkpoint: null, has_more: false, safe_error_code: "PROJECTION_CURSOR_REQUIRED" });
  }
  const after = current?.last_source_event_id ?? null;
  const limit = options.limit ?? 100;
  if (!Number.isInteger(limit) || limit < 1 || limit > THREADS_ACTIVITY_PAGE_MAX) {
    updateFailure(db, account, "BRIDGE_CONTRACT_INVALID");
    return Object.freeze({ status: "failed", account_id: account, fetched_count: 0, projected_count: 0,
      skipped_duplicate_count: 0, checkpoint: after, has_more: false, safe_error_code: "BRIDGE_CONTRACT_INVALID" });
  }

  let page: BridgeAuditPageV1;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 2_500);
  try {
    const origin = safeOrigin(options.bridgeUrl ?? options.env?.THREADS_BRIDGE_URL ?? process.env.THREADS_BRIDGE_URL ?? "http://127.0.0.1:8000");
    if (!["127.0.0.1", "localhost", "::1", "[::1]"].includes(new URL(origin).hostname.toLowerCase())
      && !(options.apiKey ?? options.env?.THREADS_BRIDGE_API_KEY ?? process.env.THREADS_BRIDGE_API_KEY ?? "")) {
      throw new ThreadsActivityConsumerError("BRIDGE_UNAUTHORIZED");
    }
    const url = new URL(`/operator/accounts/${encodeURIComponent(account)}/audit-events`, origin);
    url.searchParams.set("limit", String(limit));
    if (after) url.searchParams.set("after", after);
    const apiKey = options.apiKey ?? options.env?.THREADS_BRIDGE_API_KEY ?? process.env.THREADS_BRIDGE_API_KEY ?? "";
    const response = await (options.fetcher ?? fetch)(url, {
      method: "GET", headers: fetchHeaders(apiKey, options.tenantUserId), signal: controller.signal,
    });
    if (!response.ok) {
      const code: ProjectionSafeErrorCode = response.status === 401 ? "BRIDGE_UNAUTHORIZED"
        : response.status === 403 ? "BRIDGE_FORBIDDEN"
          : response.status === 404 ? "BRIDGE_ACCOUNT_OR_CURSOR_NOT_FOUND"
            : response.status === 409 ? "BRIDGE_CONTRACT_CONFLICT" : "BRIDGE_HTTP_ERROR";
      throw new ThreadsActivityConsumerError(code);
    }
    const declaredLength = Number(response.headers.get("Content-Length") ?? 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BRIDGE_RESPONSE_BYTES) {
      throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID");
    }
    let payload: unknown;
    try {
      const text = await response.text();
      if (text.length > MAX_BRIDGE_RESPONSE_BYTES) throw new Error("bounded response exceeded");
      payload = JSON.parse(text);
    } catch { throw new ThreadsActivityConsumerError("BRIDGE_CONTRACT_INVALID"); }
    page = parseBridgeAuditPageV1(payload, account, after, limit);
  } catch (error) {
    const code = safeFailureCode(error);
    updateFailure(db, account, code);
    return Object.freeze({ status: "failed", account_id: account, fetched_count: 0, projected_count: 0,
      skipped_duplicate_count: 0, checkpoint: after, has_more: false, safe_error_code: code });
  } finally {
    clearTimeout(timer);
  }

  let projected = 0;
  let duplicates = 0;
  try {
    for (const sourceEvent of page.events) {
      const mapped = mapBridgeAuditEvent(account, sourceEvent);
      const existing = db.query<{ activity_id: string }, [string]>(
        "SELECT activity_id FROM agent_activity_ledger WHERE activity_id=?",
      ).get(`thr:${mapped.source_event_id}`);
      try {
        projectThreadsActivityEvent(db, mapped);
      } catch (error) {
        if (error instanceof ActivityLedgerConflictError) {
          throw new ThreadsActivityConsumerError("LEDGER_CONFLICT");
        }
        throw new ThreadsActivityConsumerError("LEDGER_WRITE_FAILED");
      }
      if (existing) duplicates += 1; else projected += 1;
      try { options.afterLedgerCommit?.(mapped.source_event_id); }
      catch { throw new ThreadsActivityConsumerError("CHECKPOINT_WRITE_FAILED"); }
      try {
        advanceThreadsActivityCheckpoint(db, source.feed_id, mapped.source_event_id);
      } catch {
        throw new ThreadsActivityConsumerError("CHECKPOINT_WRITE_FAILED");
      }
    }
    try { updateSuccess(db, account, projected, duplicates); }
    catch { throw new ThreadsActivityConsumerError("STATUS_WRITE_FAILED"); }
    const checkpoint = readThreadsActivityCheckpoint(db, source.feed_id)?.last_source_event_id ?? after;
    return Object.freeze({ status: "succeeded", account_id: account, fetched_count: page.events.length,
      projected_count: projected, skipped_duplicate_count: duplicates, checkpoint, has_more: page.has_more,
      safe_error_code: null });
  } catch (error) {
    const code = safeFailureCode(error);
    try { updateFailure(db, account, code, projected, duplicates); } catch { /* preserve the original safe code */ }
    const checkpoint = readThreadsActivityCheckpoint(db, source.feed_id)?.last_source_event_id ?? after;
    return Object.freeze({ status: "failed", account_id: account, fetched_count: page.events.length,
      projected_count: projected, skipped_duplicate_count: duplicates, checkpoint, has_more: page.has_more,
      safe_error_code: code });
  }
}
