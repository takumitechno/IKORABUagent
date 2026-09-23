import type { Database } from "bun:sqlite";
import {
  appendActivity,
  type LedgerActivity,
} from "./agent-activity-ledger";
import {
  EMPLOYEE_ROLE_REGISTRY,
  mapThreadsActor,
  type DecisionStatus,
  type InternalActivityInput,
  type ResultStatus,
  type ThreadsActorAttribution,
} from "./agent-role-registry";

export const THREADS_ACTIVITY_PROJECTOR_MIGRATION_ID = "20260924_threads_activity_projector_v1";
const SOURCE_EVENT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,194}$/;
const ACCOUNT_PATTERN = /^acct_[A-Za-z0-9_-]{1,128}$/;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const REF_PATTERN = /^(?:activity|artifact|content|cycle|experiment|metric|source):[A-Za-z0-9][A-Za-z0-9._:\/-]{0,499}$/;
const FEED_PATTERN = /^[a-z][a-z0-9._:-]{0,119}$/;
const UTC_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|\+00:00)$/;
const SAFE_SOURCE_ACTOR_PATTERN = /^[A-Za-z][A-Za-z0-9 _-]{0,79}$/;
const OPAQUE_PII_MARKER = /\d{8,}/;
const SECRET_MARKER = /(?:\bBearer\s+[A-Za-z0-9._~+\/-]+|(?:access_token|oauth_token|api_key|client_secret)\s*[=:]|\bsk-[A-Za-z0-9_-]{8,})/i;
const CUSTOMER_PII_MARKER = /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?\d[\d ()-]{7,}\d)|(?:氏名|住所|電話番号?|メール(?:アドレス)?|customer\s*(?:name|address|phone|email))\s*[:：])/iu;

export const THREADS_ACTIVITY_EVENT_TYPES = Object.freeze([
  "insights_collected",
  "editorial_cycle_waiting",
  "editorial_experiment_decided",
  "editorial_draft_ready",
  "writer_canary_pending",
  "human_approval",
  "publication_state",
  "safety_state",
  "correction",
] as const);
export type ThreadsActivityEventType = typeof THREADS_ACTIVITY_EVENT_TYPES[number];
export type ThreadsSourceActorType = "employee" | "writer" | "human" | "system_capability" | "unknown";

export const THREADS_ACTIVITY_EVENT_FIELDS = Object.freeze([
  "source_event_id", "created_at", "account_id", "event_type", "actor_type", "actor_id",
  "evidence_refs", "decision_status", "result_status", "artifact_ref", "cycle_id",
  "experiment_id", "correlation_id", "corrects_source_event_id",
] as const);

export interface ThreadsActivityEvent {
  readonly source_event_id: string;
  readonly created_at: string;
  readonly account_id: string;
  readonly event_type: ThreadsActivityEventType;
  readonly actor_type: ThreadsSourceActorType;
  readonly actor_id: string | null;
  readonly evidence_refs: readonly string[];
  readonly decision_status: DecisionStatus;
  readonly result_status: ResultStatus;
  readonly artifact_ref: string | null;
  readonly cycle_id: string | null;
  readonly experiment_id: string | null;
  readonly correlation_id: string | null;
  readonly corrects_source_event_id: string | null;
}

export interface ThreadsActivityProjectorCheckpoint {
  readonly feed_id: string;
  readonly last_source_event_id: string;
  readonly last_activity_id: string;
  readonly last_ledger_sequence: number;
  readonly updated_at: string;
}

export const THREADS_ACTIVITY_PROJECTOR_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS threads_activity_projector_checkpoints (
  feed_id TEXT PRIMARY KEY,
  last_source_event_id TEXT NOT NULL,
  last_activity_id TEXT NOT NULL REFERENCES agent_activity_ledger(activity_id),
  last_ledger_sequence INTEGER NOT NULL CHECK (last_ledger_sequence > 0),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (length(feed_id) BETWEEN 1 AND 120),
  CHECK (length(last_source_event_id) BETWEEN 1 AND 195),
  CHECK (last_activity_id = 'thr:' || last_source_event_id)
);
`;

export class ThreadsActivityContractError extends Error {
  readonly code = "THREADS_ACTIVITY_INVALID";
}

export class ThreadsActivityProjectorSchemaError extends Error {
  readonly code = "THREADS_ACTIVITY_PROJECTOR_SCHEMA_MISSING";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(Object.getOwnPropertyDescriptors(value)).every((descriptor) => !descriptor.get && !descriptor.set);
}

function requiredString(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || value.length < 1 || value.length > max) {
    throw new ThreadsActivityContractError(`${field} is invalid`);
  }
  if (SECRET_MARKER.test(value) || CUSTOMER_PII_MARKER.test(value)) {
    throw new ThreadsActivityContractError(`${field} contains forbidden material`);
  }
  return value;
}

function nullableId(value: unknown, field: string): string | null {
  if (value === null) return null;
  const id = requiredString(value, field, 200);
  if (!ID_PATTERN.test(id) || OPAQUE_PII_MARKER.test(id)) throw new ThreadsActivityContractError(`${field} is invalid`);
  return id;
}

function nullableRef(value: unknown, field: string): string | null {
  if (value === null) return null;
  const ref = requiredString(value, field, 520);
  if (!REF_PATTERN.test(ref) || ref.includes("?") || ref.includes("#") || OPAQUE_PII_MARKER.test(ref)) {
    throw new ThreadsActivityContractError(`${field} is not an opaque reference`);
  }
  return ref;
}

function oneOf<T extends string>(value: unknown, field: string, allowed: readonly T[]): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new ThreadsActivityContractError(`${field} is invalid`);
  }
  return value as T;
}

export function normalizeThreadsUtcTimestamp(value: unknown): string {
  if (typeof value !== "string" || value.length < 1 || value.length > 64) {
    throw new ThreadsActivityContractError("created_at must be an explicit UTC timestamp");
  }
  const timestamp = value;
  if (!UTC_TIMESTAMP_PATTERN.test(timestamp) || Number.isNaN(Date.parse(timestamp))) {
    throw new ThreadsActivityContractError("created_at must be an explicit UTC timestamp");
  }
  return new Date(timestamp).toISOString();
}

export function validateThreadsActivityEvent(input: unknown): ThreadsActivityEvent {
  if (!isPlainObject(input)) throw new ThreadsActivityContractError("event must be a plain data object");
  const unknown = Object.keys(input).filter((key) => !(THREADS_ACTIVITY_EVENT_FIELDS as readonly string[]).includes(key));
  if (unknown.length) throw new ThreadsActivityContractError(`event contains unknown fields: ${unknown.sort().join(",")}`);
  const missing = THREADS_ACTIVITY_EVENT_FIELDS.filter((key) => !(key in input));
  if (missing.length) throw new ThreadsActivityContractError(`event is missing fields: ${missing.join(",")}`);

  const sourceEventId = requiredString(input.source_event_id, "source_event_id", 195);
  if (!SOURCE_EVENT_ID_PATTERN.test(sourceEventId) || OPAQUE_PII_MARKER.test(sourceEventId)) {
    throw new ThreadsActivityContractError("source_event_id is invalid");
  }
  const accountId = requiredString(input.account_id, "account_id", 140);
  if (!ACCOUNT_PATTERN.test(accountId)) throw new ThreadsActivityContractError("account_id is invalid");
  const actorType = oneOf(input.actor_type, "actor_type", ["employee", "writer", "human", "system_capability", "unknown"] as const);
  let actorId: string | null = null;
  if (input.actor_id !== null) {
    actorId = requiredString(input.actor_id, "actor_id", 80);
    if (!SAFE_SOURCE_ACTOR_PATTERN.test(actorId) || OPAQUE_PII_MARKER.test(actorId)) {
      throw new ThreadsActivityContractError("actor_id is invalid");
    }
  }
  if (!Array.isArray(input.evidence_refs)) throw new ThreadsActivityContractError("evidence_refs must be an array");
  const evidence = [...new Set(input.evidence_refs.map((ref, index) => {
    const safe = requiredString(ref, `evidence_refs[${index}]`, 520);
    if (!REF_PATTERN.test(safe) || safe.includes("?") || safe.includes("#") || OPAQUE_PII_MARKER.test(safe)) {
      throw new ThreadsActivityContractError(`evidence_refs[${index}] is not an opaque reference`);
    }
    return safe;
  }))].sort();
  if (evidence.length > 48) throw new ThreadsActivityContractError("evidence_refs exceeds 48 source items");

  const event = Object.freeze({
    source_event_id: sourceEventId,
    created_at: normalizeThreadsUtcTimestamp(input.created_at),
    account_id: accountId,
    event_type: oneOf(input.event_type, "event_type", THREADS_ACTIVITY_EVENT_TYPES),
    actor_type: actorType,
    actor_id: actorId,
    evidence_refs: Object.freeze(evidence),
    decision_status: oneOf(input.decision_status, "decision_status", ["not_applicable", "pending", "approved", "rejected", "blocked", "unknown"] as const),
    result_status: oneOf(input.result_status, "result_status", ["not_applicable", "pending", "succeeded", "failed", "blocked", "unknown"] as const),
    artifact_ref: nullableRef(input.artifact_ref, "artifact_ref"),
    cycle_id: nullableId(input.cycle_id, "cycle_id"),
    experiment_id: nullableId(input.experiment_id, "experiment_id"),
    correlation_id: nullableId(input.correlation_id, "correlation_id"),
    corrects_source_event_id: nullableId(input.corrects_source_event_id, "corrects_source_event_id"),
  });
  validateEventState(event);
  return event;
}

function validateEventState(event: ThreadsActivityEvent): void {
  const fixed: Partial<Record<ThreadsActivityEventType, readonly [readonly DecisionStatus[], readonly ResultStatus[]]>> = {
    insights_collected: [["not_applicable"], ["succeeded", "failed", "blocked"]],
    editorial_cycle_waiting: [["pending", "blocked"], ["pending", "blocked"]],
    editorial_experiment_decided: [["approved", "rejected", "blocked"], ["succeeded", "blocked"]],
    editorial_draft_ready: [["pending"], ["succeeded"]],
    writer_canary_pending: [["pending"], ["pending"]],
    human_approval: [["pending", "approved", "rejected", "blocked"], ["pending", "succeeded", "blocked"]],
    publication_state: [["not_applicable"], ["pending", "succeeded", "failed", "blocked"]],
    safety_state: [["not_applicable"], ["succeeded", "failed", "blocked", "unknown"]],
    correction: [["not_applicable"], ["succeeded"]],
  };
  const [decisions, results] = fixed[event.event_type]!;
  if (!decisions.includes(event.decision_status) || !results.includes(event.result_status)) {
    throw new ThreadsActivityContractError("event state is not allowed for event_type");
  }
  if (event.event_type === "writer_canary_pending" && event.actor_type !== "writer") {
    throw new ThreadsActivityContractError("writer_canary_pending requires writer attribution");
  }
  if (event.event_type === "human_approval" && event.actor_type !== "human") {
    throw new ThreadsActivityContractError("human_approval requires human attribution");
  }
  if (event.actor_type === "unknown" && event.actor_id !== null) {
    throw new ThreadsActivityContractError("unknown attribution must not carry an actor identifier");
  }
  if (event.event_type === "correction" && !event.corrects_source_event_id) {
    throw new ThreadsActivityContractError("correction requires corrects_source_event_id");
  }
  if (event.event_type !== "correction" && event.corrects_source_event_id) {
    throw new ThreadsActivityContractError("only correction may set corrects_source_event_id");
  }
}

function actorAttribution(event: ThreadsActivityEvent): ThreadsActorAttribution {
  if (event.actor_type === "employee") {
    const employee = EMPLOYEE_ROLE_REGISTRY.find((candidate) => candidate.agent_id === event.actor_id);
    if (!employee) throw new ThreadsActivityContractError("employee attribution is not canonical");
    return mapThreadsActor(employee.agent_id);
  }
  if (event.actor_type === "writer") {
    if (!event.actor_id || (event.actor_id !== "Writer" && !/^writer_canary_[a-z0-9_-]{1,60}$/.test(event.actor_id))) {
      throw new ThreadsActivityContractError("writer attribution is invalid");
    }
    return mapThreadsActor("Writer");
  }
  if (event.actor_type === "human") {
    if (event.actor_id !== null && event.actor_id !== "Human" && event.actor_id !== "human_approval") {
      throw new ThreadsActivityContractError("human attribution is invalid");
    }
    return mapThreadsActor("Human");
  }
  if (event.actor_type === "system_capability") {
    const mapped = mapThreadsActor(event.actor_id);
    return mapped.actor_kind === "system_capability" ? mapped : mapThreadsActor(null);
  }
  return mapThreadsActor(null);
}

function resultMessage(result: ResultStatus): InternalActivityInput["decision_summary"] {
  if (result === "succeeded") return "result_succeeded";
  if (result === "failed") return "result_failed";
  if (result === "blocked") return "result_blocked";
  if (result === "unknown") return "data_unavailable";
  return result === "pending" ? "decision_pending" : null;
}

function decisionMessage(decision: DecisionStatus): InternalActivityInput["decision_summary"] {
  if (decision === "approved") return "decision_approved";
  if (decision === "rejected") return "decision_rejected";
  if (decision === "pending") return "decision_pending";
  if (decision === "blocked") return "result_blocked";
  if (decision === "unknown") return "data_unavailable";
  return null;
}

export function normalizeThreadsActivityEvent(input: unknown): InternalActivityInput {
  const event = validateThreadsActivityEvent(input);
  const actor = actorAttribution(event);
  const activityId = `thr:${event.source_event_id}`;
  const correctionId = event.corrects_source_event_id ? `thr:${event.corrects_source_event_id}` : null;
  const evidence = new Set<string>([...event.evidence_refs, `source:threads-event:${event.source_event_id}`]);
  if (correctionId) evidence.add(`activity:${correctionId}`);
  const humanHandoff = event.event_type === "editorial_draft_ready" || event.event_type === "writer_canary_pending";
  const approvedHandoff = event.event_type === "human_approval" && event.decision_status === "approved";
  const summary = event.event_type === "insights_collected" && event.result_status === "succeeded"
    ? "source_verified"
    : event.event_type === "correction"
      ? "correction_recorded"
      : event.decision_status !== "not_applicable"
        ? decisionMessage(event.decision_status)
        : resultMessage(event.result_status);
  return Object.freeze({
    activity_id: activityId,
    timestamp: event.created_at,
    agent_id: actor.agent_id,
    agent_role: actor.agent_role,
    account_id: event.account_id,
    action: event.event_type === "correction" ? "correction" : event.event_type,
    evidence_refs: Object.freeze([...evidence].sort()),
    decision_status: event.decision_status,
    decision_summary: summary,
    next_action_owner: humanHandoff ? "human:approval" : approvedHandoff ? "kiara-executor" : null,
    next_action: humanHandoff || approvedHandoff ? "handoff_requested" : null,
    due_at: null,
    confidence_level: "unknown",
    confidence_basis: null,
    sample_size: null,
    result_status: event.result_status,
    artifact_ref: event.artifact_ref,
    cycle_id: event.cycle_id,
    experiment_id: event.experiment_id,
    correlation_id: event.correlation_id,
    corrects_activity_id: correctionId,
  });
}

export function projectThreadsActivityEvent(db: Database, input: unknown): LedgerActivity {
  return appendActivity(db, normalizeThreadsActivityEvent(input));
}

function validateFeedId(feedId: string): string {
  if (!FEED_PATTERN.test(feedId)) throw new ThreadsActivityContractError("feed_id is invalid");
  return feedId;
}

export function migrateThreadsActivityProjector(db: Database): boolean {
  db.exec("PRAGMA foreign_keys = ON");
  const migrate = db.transaction(() => {
    db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now','localtime'))
    )`);
    const applied = db.query<{ version: string }, [string]>(
      "SELECT version FROM schema_migrations WHERE version = ?",
    ).get(THREADS_ACTIVITY_PROJECTOR_MIGRATION_ID);
    db.exec(THREADS_ACTIVITY_PROJECTOR_SCHEMA_SQL);
    if (!applied) {
      db.query("INSERT INTO schema_migrations(version) VALUES (?)").run(THREADS_ACTIVITY_PROJECTOR_MIGRATION_ID);
      return true;
    }
    return false;
  });
  return migrate.immediate();
}

export function assertThreadsActivityProjectorSchema(db: Database): void {
  const row = db.query<{ name: string }, []>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='threads_activity_projector_checkpoints'",
  ).get();
  if (!row) throw new ThreadsActivityProjectorSchemaError("missing Threads activity projector checkpoint schema");
}

export function readThreadsActivityCheckpoint(
  db: Database, feedId: string,
): ThreadsActivityProjectorCheckpoint | null {
  validateFeedId(feedId);
  assertThreadsActivityProjectorSchema(db);
  return db.query<ThreadsActivityProjectorCheckpoint, [string]>(
    "SELECT * FROM threads_activity_projector_checkpoints WHERE feed_id = ?",
  ).get(feedId) ?? null;
}

export function advanceThreadsActivityCheckpoint(
  db: Database, feedId: string, sourceEventId: string,
): ThreadsActivityProjectorCheckpoint {
  const feed = validateFeedId(feedId);
  if (!SOURCE_EVENT_ID_PATTERN.test(sourceEventId) || OPAQUE_PII_MARKER.test(sourceEventId)) {
    throw new ThreadsActivityContractError("source_event_id is invalid");
  }
  const activityId = `thr:${sourceEventId}`;
  const advance = db.transaction(() => {
    const projected = db.query<{ sequence: number }, [string]>(
      "SELECT sequence FROM agent_activity_ledger WHERE activity_id = ?",
    ).get(activityId);
    if (!projected) throw new ThreadsActivityProjectorSchemaError("checkpoint cannot advance before the event is committed");
    const current = readThreadsActivityCheckpoint(db, feed);
    if (current && current.last_ledger_sequence >= projected.sequence) return current;
    db.query(`INSERT INTO threads_activity_projector_checkpoints (
      feed_id, last_source_event_id, last_activity_id, last_ledger_sequence
    ) VALUES (?, ?, ?, ?)
    ON CONFLICT(feed_id) DO UPDATE SET
      last_source_event_id=excluded.last_source_event_id,
      last_activity_id=excluded.last_activity_id,
      last_ledger_sequence=excluded.last_ledger_sequence,
      updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')`).run(
      feed, sourceEventId, activityId, projected.sequence,
    );
    return readThreadsActivityCheckpoint(db, feed)!;
  });
  return advance.immediate();
}

export function projectThreadsActivityPage(
  db: Database, feedId: string, events: readonly unknown[],
): ThreadsActivityProjectorCheckpoint | null {
  validateFeedId(feedId);
  if (!Array.isArray(events) || events.length > 100) throw new ThreadsActivityContractError("page must contain at most 100 events");
  for (const event of events) {
    const validated = validateThreadsActivityEvent(event);
    projectThreadsActivityEvent(db, validated);
    // Deliberately after append commit. A crash here leaves a replay-safe event and an old cursor.
    advanceThreadsActivityCheckpoint(db, feedId, validated.source_event_id);
  }
  return readThreadsActivityCheckpoint(db, feedId);
}
