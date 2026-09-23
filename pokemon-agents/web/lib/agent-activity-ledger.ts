import { createHash } from "node:crypto";
import type { Database } from "bun:sqlite";
import {
  ACTIVITY_MESSAGE_CODES,
  EMPLOYEE_ROLE_REGISTRY,
  FORMAL_EDITORIAL_QA,
  FORMAL_EDITORIAL_WRITER,
  HUMAN_AUTHORITY_CONTRACTS,
  INTERNAL_ACTIVITY_FIELDS,
  SYSTEM_CAPABILITY_ROLES,
  classifyActivityActor,
  createCorrectionActivity,
  createInternalActivity,
  serializeInternalActivity,
  type ActivityActorType,
  type CorrectionActivityInput,
  type InternalActivity,
} from "./agent-role-registry";

export const AGENT_ACTIVITY_LEDGER_MIGRATION_ID = "20260924_agent_activity_ledger_v2_message_codes";
export const AGENT_ACTIVITY_LEDGER_MIGRATION_IDS = Object.freeze([
  "20260924_agent_activity_ledger_v1",
  AGENT_ACTIVITY_LEDGER_MIGRATION_ID,
]);
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;
const ACCOUNT_PATTERN = /^acct_[A-Za-z0-9_-]{1,128}$/;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const REF_PATTERN = /^(?:activity|artifact|content|cycle|experiment|metric|source):[A-Za-z0-9][A-Za-z0-9._:\/-]{0,499}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/;
const OPAQUE_PII_MARKER = /\d{8,}/;

const sqlLiteral = (value: string): string => `'${value.replaceAll("'", "''")}'`;
const canonicalEmployeeSql = EMPLOYEE_ROLE_REGISTRY
  .map((employee) => `(NEW.agent_id = ${sqlLiteral(employee.agent_id)} AND NEW.agent_role = ${sqlLiteral(employee.role)})`)
  .join(" OR ");
const canonicalSystemRolesSql = SYSTEM_CAPABILITY_ROLES.map(sqlLiteral).join(",");
const activityMessageCodesSql = ACTIVITY_MESSAGE_CODES.map(sqlLiteral).join(",");
const canonicalNextOwnersSql = [
  ...EMPLOYEE_ROLE_REGISTRY.map((employee) => employee.agent_id),
  FORMAL_EDITORIAL_WRITER.agent_id,
  FORMAL_EDITORIAL_QA.agent_id,
  HUMAN_AUTHORITY_CONTRACTS.ceo.actor_id,
  HUMAN_AUTHORITY_CONTRACTS.approval_gate.actor_id,
].map(sqlLiteral).join(",");
const eightDigitsGlob = "*[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]*";

export const AGENT_ACTIVITY_LEDGER_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS agent_activity_accounts (
  account_id TEXT PRIMARY KEY,
  authority_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (account_id GLOB 'acct_*'),
  CHECK (length(authority_ref) BETWEEN 3 AND 520)
);

CREATE TABLE IF NOT EXISTS agent_activity_ledger (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id TEXT NOT NULL UNIQUE,
  timestamp TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('employee','writer','human','system_capability','unknown')),
  agent_id TEXT,
  agent_role TEXT,
  account_id TEXT NOT NULL REFERENCES agent_activity_accounts(account_id),
  action TEXT NOT NULL,
  evidence_refs TEXT NOT NULL CHECK (json_valid(evidence_refs) AND json_type(evidence_refs) = 'array'),
  decision_status TEXT NOT NULL CHECK (decision_status IN ('not_applicable','pending','approved','rejected','blocked','unknown')),
  decision_summary TEXT,
  next_action_owner TEXT,
  next_action TEXT,
  due_at TEXT,
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('unknown','low','medium','high')),
  confidence_basis TEXT,
  sample_size INTEGER CHECK (sample_size IS NULL OR sample_size BETWEEN 0 AND 1000000000),
  result_status TEXT NOT NULL CHECK (result_status IN ('not_applicable','pending','succeeded','failed','blocked','unknown')),
  artifact_ref TEXT,
  cycle_id TEXT,
  experiment_id TEXT,
  correlation_id TEXT,
  corrects_activity_id TEXT REFERENCES agent_activity_ledger(activity_id),
  payload_hash TEXT NOT NULL CHECK (length(payload_hash) = 64),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (length(timestamp) = 24 AND substr(timestamp, 20, 1) = '.' AND substr(timestamp, -1, 1) = 'Z' AND datetime(timestamp) IS NOT NULL),
  CHECK (due_at IS NULL OR (length(due_at) = 24 AND substr(due_at, 20, 1) = '.' AND substr(due_at, -1, 1) = 'Z' AND datetime(due_at) IS NOT NULL)),
  CHECK (
    (actor_type = 'employee' AND agent_id IS NOT NULL AND agent_role IS NOT NULL) OR
    (actor_type = 'writer' AND agent_id = 'editorial-writer' AND agent_role = 'editorial_writer') OR
    (actor_type = 'human' AND agent_id IS NULL AND agent_role = 'human_approval') OR
    (actor_type = 'system_capability' AND agent_id IS NULL AND agent_role IS NOT NULL AND agent_role <> 'human_approval') OR
    (actor_type = 'unknown' AND agent_id IS NULL AND agent_role IS NULL)
  ),
  CHECK (
    (action = 'correction' AND corrects_activity_id IS NOT NULL) OR
    (action <> 'correction' AND corrects_activity_id IS NULL)
  ),
  CHECK (corrects_activity_id IS NULL OR corrects_activity_id <> activity_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_activity_account_time
  ON agent_activity_ledger(account_id, timestamp DESC, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_agent_time
  ON agent_activity_ledger(agent_id, timestamp DESC, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_actor_type
  ON agent_activity_ledger(actor_type, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_action
  ON agent_activity_ledger(action, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_result
  ON agent_activity_ledger(result_status, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_cycle
  ON agent_activity_ledger(cycle_id, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_experiment
  ON agent_activity_ledger(experiment_id, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_correlation
  ON agent_activity_ledger(correlation_id, sequence DESC);
CREATE INDEX IF NOT EXISTS idx_agent_activity_correction
  ON agent_activity_ledger(corrects_activity_id);

CREATE TRIGGER IF NOT EXISTS agent_activity_ledger_no_update
BEFORE UPDATE ON agent_activity_ledger
BEGIN
  SELECT RAISE(ABORT, 'agent activity ledger is append-only');
END;

CREATE TRIGGER IF NOT EXISTS agent_activity_ledger_no_delete
BEFORE DELETE ON agent_activity_ledger
BEGIN
  SELECT RAISE(ABORT, 'agent activity ledger is append-only');
END;

CREATE TRIGGER IF NOT EXISTS agent_activity_ledger_no_duplicate_insert
BEFORE INSERT ON agent_activity_ledger
WHEN EXISTS (
  SELECT 1 FROM agent_activity_ledger existing
  WHERE existing.activity_id = NEW.activity_id
     OR (NEW.sequence IS NOT NULL AND NEW.sequence > 0 AND existing.sequence = NEW.sequence)
)
BEGIN
  SELECT RAISE(ABORT, 'agent activity ledger entry already exists');
END;

CREATE TRIGGER IF NOT EXISTS agent_activity_actor_canonical
BEFORE INSERT ON agent_activity_ledger
WHEN NOT (
  (NEW.actor_type = 'employee' AND (${canonicalEmployeeSql})) OR
  (NEW.actor_type = 'writer' AND NEW.agent_id = ${sqlLiteral(FORMAL_EDITORIAL_WRITER.agent_id)} AND NEW.agent_role = ${sqlLiteral(FORMAL_EDITORIAL_WRITER.role)}) OR
  (NEW.actor_type = 'human' AND NEW.agent_id IS NULL AND NEW.agent_role = 'human_approval') OR
  (NEW.actor_type = 'system_capability' AND NEW.agent_id IS NULL AND NEW.agent_role IN (${canonicalSystemRolesSql})) OR
  (NEW.actor_type = 'unknown' AND NEW.agent_id IS NULL AND NEW.agent_role IS NULL)
)
BEGIN
  SELECT RAISE(ABORT, 'agent activity actor is not canonical');
END;

CREATE TRIGGER IF NOT EXISTS agent_activity_message_codes
BEFORE INSERT ON agent_activity_ledger
WHEN (NEW.decision_summary IS NOT NULL AND NEW.decision_summary NOT IN (${activityMessageCodesSql}))
  OR (NEW.next_action IS NOT NULL AND NEW.next_action NOT IN (${activityMessageCodesSql}))
  OR (NEW.confidence_basis IS NOT NULL AND NEW.confidence_basis NOT IN (${activityMessageCodesSql}))
BEGIN
  SELECT RAISE(ABORT, 'agent activity text must use an approved message code');
END;

CREATE TRIGGER IF NOT EXISTS agent_activity_payload_sanitized
BEFORE INSERT ON agent_activity_ledger
WHEN length(NEW.activity_id) NOT BETWEEN 1 AND 200
  OR substr(NEW.activity_id, 1, 1) NOT GLOB '[A-Za-z0-9]'
  OR NEW.activity_id GLOB '*[^A-Za-z0-9._:-]*'
  OR NEW.activity_id GLOB '${eightDigitsGlob}'
  OR length(NEW.action) NOT BETWEEN 1 AND 160
  OR substr(NEW.action, 1, 1) NOT GLOB '[a-z]'
  OR NEW.action GLOB '*[^a-z0-9._:-]*'
  OR json_array_length(NEW.evidence_refs) > 50
  OR EXISTS (
    SELECT 1 FROM json_each(NEW.evidence_refs) ref
    WHERE ref.type <> 'text'
      OR length(ref.value) NOT BETWEEN 3 AND 520
      OR NOT (
        ref.value GLOB 'activity:[A-Za-z0-9]*' OR ref.value GLOB 'artifact:[A-Za-z0-9]*'
        OR ref.value GLOB 'content:[A-Za-z0-9]*' OR ref.value GLOB 'cycle:[A-Za-z0-9]*'
        OR ref.value GLOB 'experiment:[A-Za-z0-9]*' OR ref.value GLOB 'metric:[A-Za-z0-9]*'
        OR ref.value GLOB 'source:[A-Za-z0-9]*'
      )
      OR ref.value GLOB '*[^A-Za-z0-9._:/-]*'
      OR ref.value GLOB '${eightDigitsGlob}'
  )
  OR NEW.evidence_refs <> (
    SELECT json_group_array(value)
    FROM (SELECT DISTINCT value FROM json_each(NEW.evidence_refs) ORDER BY value)
  )
  OR (NEW.next_action_owner IS NOT NULL
    AND NEW.next_action_owner NOT IN (${canonicalNextOwnersSql})
    AND NOT (
      NEW.next_action_owner GLOB 'system:[a-z0-9]*'
      AND NEW.next_action_owner NOT GLOB '*[^a-z0-9:_-]*'
      AND substr(NEW.next_action_owner, -1) GLOB '[a-z0-9]'
    ))
  OR (NEW.artifact_ref IS NOT NULL AND (
    length(NEW.artifact_ref) NOT BETWEEN 3 AND 520
    OR NOT (
      NEW.artifact_ref GLOB 'activity:[A-Za-z0-9]*' OR NEW.artifact_ref GLOB 'artifact:[A-Za-z0-9]*'
      OR NEW.artifact_ref GLOB 'content:[A-Za-z0-9]*' OR NEW.artifact_ref GLOB 'cycle:[A-Za-z0-9]*'
      OR NEW.artifact_ref GLOB 'experiment:[A-Za-z0-9]*' OR NEW.artifact_ref GLOB 'metric:[A-Za-z0-9]*'
      OR NEW.artifact_ref GLOB 'source:[A-Za-z0-9]*'
    )
    OR NEW.artifact_ref GLOB '*[^A-Za-z0-9._:/-]*'
    OR NEW.artifact_ref GLOB '${eightDigitsGlob}'
  ))
  OR (NEW.cycle_id IS NOT NULL AND (
    length(NEW.cycle_id) NOT BETWEEN 1 AND 200 OR substr(NEW.cycle_id, 1, 1) NOT GLOB '[A-Za-z0-9]'
    OR NEW.cycle_id GLOB '*[^A-Za-z0-9._:-]*' OR NEW.cycle_id GLOB '${eightDigitsGlob}'
  ))
  OR (NEW.experiment_id IS NOT NULL AND (
    length(NEW.experiment_id) NOT BETWEEN 1 AND 200 OR substr(NEW.experiment_id, 1, 1) NOT GLOB '[A-Za-z0-9]'
    OR NEW.experiment_id GLOB '*[^A-Za-z0-9._:-]*' OR NEW.experiment_id GLOB '${eightDigitsGlob}'
  ))
  OR (NEW.correlation_id IS NOT NULL AND (
    length(NEW.correlation_id) NOT BETWEEN 1 AND 200 OR substr(NEW.correlation_id, 1, 1) NOT GLOB '[A-Za-z0-9]'
    OR NEW.correlation_id GLOB '*[^A-Za-z0-9._:-]*' OR NEW.correlation_id GLOB '${eightDigitsGlob}'
  ))
  OR (NEW.corrects_activity_id IS NOT NULL AND (
    length(NEW.corrects_activity_id) NOT BETWEEN 1 AND 200
    OR substr(NEW.corrects_activity_id, 1, 1) NOT GLOB '[A-Za-z0-9]'
    OR NEW.corrects_activity_id GLOB '*[^A-Za-z0-9._:-]*'
    OR NEW.corrects_activity_id GLOB '${eightDigitsGlob}'
  ))
  OR NEW.payload_hash GLOB '*[^0-9a-f]*'
BEGIN
  SELECT RAISE(ABORT, 'agent activity payload is not sanitized');
END;

CREATE TRIGGER IF NOT EXISTS agent_activity_correction_same_account
BEFORE INSERT ON agent_activity_ledger
WHEN NEW.corrects_activity_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM agent_activity_ledger original
    WHERE original.activity_id = NEW.corrects_activity_id
      AND original.account_id = NEW.account_id
  )
BEGIN
  SELECT RAISE(ABORT, 'correction target must exist in the same account');
END;
`;

export class ActivityLedgerConflictError extends Error {
  readonly code = "ACTIVITY_CONFLICT";
}

export class ActivityLedgerUnknownAccountError extends Error {
  readonly code = "ACTIVITY_ACCOUNT_UNKNOWN";
}

export class ActivityLedgerCorrectionError extends Error {
  readonly code = "ACTIVITY_CORRECTION_INVALID";
}

export class ActivityLedgerAudienceError extends Error {
  readonly code = "ACTIVITY_INTERNAL_ONLY";
}

export class ActivityLedgerSchemaError extends Error {
  readonly code = "ACTIVITY_SCHEMA_MISSING";
}

export interface LedgerActivity extends InternalActivity {
  readonly actor_type: ActivityActorType;
  readonly created_at: string;
}

export interface ActivityReadFilters {
  readonly account_id?: string;
  readonly agent_id?: string;
  readonly actor_type?: ActivityActorType;
  readonly action?: string;
  readonly result_status?: InternalActivity["result_status"];
  readonly since?: string;
  readonly until?: string;
  readonly cycle_id?: string;
  readonly experiment_id?: string;
  readonly correlation_id?: string;
  readonly before_sequence?: number;
  readonly limit?: number;
}

export interface ActivityPage {
  readonly items: readonly LedgerActivity[];
  readonly next_cursor: number | null;
}

interface LedgerRow {
  sequence: number;
  activity_id: string;
  timestamp: string;
  actor_type: ActivityActorType;
  agent_id: InternalActivity["agent_id"];
  agent_role: string | null;
  account_id: string;
  action: string;
  evidence_refs: string;
  decision_status: InternalActivity["decision_status"];
  decision_summary: string | null;
  next_action_owner: string | null;
  next_action: string | null;
  due_at: string | null;
  confidence_level: InternalActivity["confidence_level"];
  confidence_basis: string | null;
  sample_size: number | null;
  result_status: InternalActivity["result_status"];
  artifact_ref: string | null;
  cycle_id: string | null;
  experiment_id: string | null;
  correlation_id: string | null;
  corrects_activity_id: string | null;
  payload_hash: string;
  created_at: string;
}

function payloadHash(activity: InternalActivity): string {
  return createHash("sha256").update(serializeInternalActivity(activity, "internal"), "utf8").digest("hex");
}

function activityCore(activity: LedgerActivity | InternalActivity): InternalActivity {
  return createInternalActivity(Object.fromEntries(
    INTERNAL_ACTIVITY_FIELDS.map((field) => [field, activity[field]]),
  ));
}

function validateAccountId(accountId: string): string {
  if (!ACCOUNT_PATTERN.test(accountId)) throw new ActivityLedgerUnknownAccountError("account_id is invalid or unknown");
  return accountId;
}

function validateOpaqueRef(ref: string, field: string): string {
  if (!REF_PATTERN.test(ref) || ref.includes("?") || ref.includes("#") || OPAQUE_PII_MARKER.test(ref)) throw new Error(`${field} is not an opaque reference`);
  return ref;
}

function validateFilterId(value: string, field: string): string {
  if (!ID_PATTERN.test(value) || OPAQUE_PII_MARKER.test(value)) throw new Error(`${field} is invalid`);
  return value;
}

function validateIso(value: string, field: string): string {
  if (!ISO_PATTERN.test(value) || Number.isNaN(Date.parse(value))) throw new Error(`${field} must be an ISO-8601 timestamp`);
  return new Date(value).toISOString();
}

function rowToActivity(row: LedgerRow): LedgerActivity {
  let refs: unknown;
  try {
    refs = JSON.parse(row.evidence_refs);
  } catch {
    throw new ActivityLedgerSchemaError("stored evidence_refs is invalid JSON");
  }
  const activity = createInternalActivity({
    activity_id: row.activity_id,
    timestamp: row.timestamp,
    agent_id: row.agent_id,
    agent_role: row.agent_role,
    account_id: row.account_id,
    action: row.action,
    evidence_refs: refs,
    decision_status: row.decision_status,
    decision_summary: row.decision_summary,
    next_action_owner: row.next_action_owner,
    next_action: row.next_action,
    due_at: row.due_at,
    confidence_level: row.confidence_level,
    confidence_basis: row.confidence_basis,
    sample_size: row.sample_size,
    result_status: row.result_status,
    artifact_ref: row.artifact_ref,
    cycle_id: row.cycle_id,
    experiment_id: row.experiment_id,
    correlation_id: row.correlation_id,
    corrects_activity_id: row.corrects_activity_id,
  });
  if (row.actor_type !== classifyActivityActor(activity)) throw new ActivityLedgerSchemaError("stored actor_type does not match activity identity");
  validateIso(row.created_at, "created_at");
  return Object.freeze({ ...activity, actor_type: row.actor_type, created_at: row.created_at });
}

export function migrateAgentActivityLedger(db: Database): boolean {
  db.exec("PRAGMA foreign_keys = ON");
  const migrate = db.transaction(() => {
    db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now','localtime'))
    )`);
    const pending = AGENT_ACTIVITY_LEDGER_MIGRATION_IDS.filter((version) => !db.query<{ version: string }, [string]>(
      "SELECT version FROM schema_migrations WHERE version = ?",
    ).get(version));
    const upgradingV1 = pending.includes(AGENT_ACTIVITY_LEDGER_MIGRATION_ID)
      && !pending.includes(AGENT_ACTIVITY_LEDGER_MIGRATION_IDS[0]);
    if (upgradingV1) {
      try {
        for (const row of db.query<LedgerRow, []>("SELECT * FROM agent_activity_ledger").all()) rowToActivity(row);
      } catch {
        throw new ActivityLedgerSchemaError("v1 activity ledger contains rows incompatible with v2 sanitization");
      }
    }
    db.exec(AGENT_ACTIVITY_LEDGER_SCHEMA_SQL);
    for (const version of pending) {
      db.query("INSERT INTO schema_migrations(version) VALUES (?)").run(version);
    }
    return pending.length > 0;
  });
  return migrate.immediate();
}

export function assertAgentActivityLedgerSchema(db: Database): void {
  const rows = db.query<{ name: string }, []>(
    `SELECT name FROM sqlite_master
     WHERE (type='table' AND name IN ('agent_activity_accounts','agent_activity_ledger'))
        OR (type='trigger' AND name IN ('agent_activity_ledger_no_update','agent_activity_ledger_no_delete','agent_activity_ledger_no_duplicate_insert','agent_activity_actor_canonical','agent_activity_message_codes','agent_activity_payload_sanitized','agent_activity_correction_same_account'))`,
  ).all();
  const names = new Set(rows.map((row) => row.name));
  for (const required of [
    "agent_activity_accounts", "agent_activity_ledger", "agent_activity_ledger_no_update",
    "agent_activity_ledger_no_delete", "agent_activity_ledger_no_duplicate_insert",
    "agent_activity_actor_canonical", "agent_activity_message_codes", "agent_activity_payload_sanitized",
    "agent_activity_correction_same_account",
  ]) {
    if (!names.has(required)) throw new ActivityLedgerSchemaError(`missing activity ledger schema object: ${required}`);
  }
}

/** Explicit account provisioning. Actor identity is never consulted for this authority decision. */
export function registerActivityAccount(db: Database, accountId: string, authorityRef: string): void {
  const account = validateAccountId(accountId);
  const authority = validateOpaqueRef(authorityRef, "authority_ref");
  const write = db.transaction(() => {
    const existing = db.query<{ authority_ref: string; status: string }, [string]>(
      "SELECT authority_ref, status FROM agent_activity_accounts WHERE account_id = ?",
    ).get(account);
    if (existing) {
      if (existing.authority_ref === authority && existing.status === "active") return;
      throw new ActivityLedgerConflictError("account scope already exists with different authority");
    }
    db.query("INSERT INTO agent_activity_accounts(account_id, authority_ref) VALUES (?, ?)").run(account, authority);
  });
  write.immediate();
}

export function appendActivity(db: Database, input: unknown): LedgerActivity {
  const activity = createInternalActivity(input);
  const serialized = serializeInternalActivity(activity, "internal");
  const hash = payloadHash(activity);
  const actorType = classifyActivityActor(activity);
  const append = db.transaction(() => {
    const existing = db.query<LedgerRow, [string]>(
      "SELECT * FROM agent_activity_ledger WHERE activity_id = ?",
    ).get(activity.activity_id);
    if (existing) {
      if (existing.payload_hash === hash && serializeInternalActivity(activityCore(rowToActivity(existing)), "internal") === serialized) {
        return rowToActivity(existing);
      }
      throw new ActivityLedgerConflictError("activity_id already exists with a different payload");
    }

    const account = db.query<{ status: string }, [string]>(
      "SELECT status FROM agent_activity_accounts WHERE account_id = ?",
    ).get(activity.account_id);
    if (!account || account.status !== "active") {
      throw new ActivityLedgerUnknownAccountError("account_id is not registered for agent activity");
    }

    if (activity.corrects_activity_id) {
      const original = db.query<{ account_id: string }, [string]>(
        "SELECT account_id FROM agent_activity_ledger WHERE activity_id = ?",
      ).get(activity.corrects_activity_id);
      if (!original) throw new ActivityLedgerCorrectionError("correction target does not exist");
      if (original.account_id !== activity.account_id) throw new ActivityLedgerCorrectionError("correction target belongs to a different account");
      if (!activity.evidence_refs.includes(`activity:${activity.corrects_activity_id}`)) {
        throw new ActivityLedgerCorrectionError("correction must reference the original activity as evidence");
      }
    }

    db.query(`INSERT INTO agent_activity_ledger (
      activity_id, timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, corrects_activity_id, payload_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      activity.activity_id, activity.timestamp, actorType, activity.agent_id, activity.agent_role,
      activity.account_id, activity.action, JSON.stringify(activity.evidence_refs),
      activity.decision_status, activity.decision_summary, activity.next_action_owner,
      activity.next_action, activity.due_at, activity.confidence_level, activity.confidence_basis,
      activity.sample_size, activity.result_status, activity.artifact_ref, activity.cycle_id,
      activity.experiment_id, activity.correlation_id, activity.corrects_activity_id, hash,
    );
    const inserted = db.query<LedgerRow, [string]>(
      "SELECT * FROM agent_activity_ledger WHERE activity_id = ?",
    ).get(activity.activity_id);
    if (!inserted) throw new ActivityLedgerSchemaError("activity insert did not return a durable row");
    return rowToActivity(inserted);
  });
  return append.immediate();
}

export function appendCorrection(
  db: Database, correctsActivityId: string, correction: CorrectionActivityInput,
): LedgerActivity {
  validateFilterId(correctsActivityId, "corrects_activity_id");
  const previous = db.query<LedgerRow, [string]>(
    "SELECT * FROM agent_activity_ledger WHERE activity_id = ?",
  ).get(correctsActivityId);
  if (!previous) throw new ActivityLedgerCorrectionError("correction target does not exist");
  return appendActivity(db, createCorrectionActivity(activityCore(rowToActivity(previous)), correction));
}

export function readActivities(
  db: Database, filters: ActivityReadFilters = {}, audience: "internal" = "internal",
): ActivityPage {
  if (audience !== "internal") throw new ActivityLedgerAudienceError("agent activity is internal-only");
  const clauses: string[] = [];
  const values: Array<string | number> = [];
  const add = (sql: string, value: string | number) => { clauses.push(sql); values.push(value); };

  if (filters.account_id !== undefined) add("account_id = ?", validateAccountId(filters.account_id));
  if (filters.agent_id !== undefined) add("agent_id = ?", validateFilterId(filters.agent_id, "agent_id"));
  if (filters.actor_type !== undefined) {
    if (!["employee", "writer", "human", "system_capability", "unknown"].includes(filters.actor_type)) throw new Error("actor_type is invalid");
    add("actor_type = ?", filters.actor_type);
  }
  if (filters.action !== undefined) add("action = ?", validateFilterId(filters.action, "action"));
  if (filters.result_status !== undefined) {
    if (!["not_applicable", "pending", "succeeded", "failed", "blocked", "unknown"].includes(filters.result_status)) throw new Error("result_status is invalid");
    add("result_status = ?", filters.result_status);
  }
  if (filters.since !== undefined) add("timestamp >= ?", validateIso(filters.since, "since"));
  if (filters.until !== undefined) add("timestamp <= ?", validateIso(filters.until, "until"));
  if (filters.cycle_id !== undefined) add("cycle_id = ?", validateFilterId(filters.cycle_id, "cycle_id"));
  if (filters.experiment_id !== undefined) add("experiment_id = ?", validateFilterId(filters.experiment_id, "experiment_id"));
  if (filters.correlation_id !== undefined) add("correlation_id = ?", validateFilterId(filters.correlation_id, "correlation_id"));
  if (filters.before_sequence !== undefined) {
    if (!Number.isSafeInteger(filters.before_sequence) || filters.before_sequence <= 0) throw new Error("before_sequence is invalid");
    add("sequence < ?", filters.before_sequence);
  }
  const limit = filters.limit ?? DEFAULT_PAGE_SIZE;
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) throw new Error(`limit must be between 1 and ${MAX_PAGE_SIZE}`);
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db.query<LedgerRow, Array<string | number>>(
    `SELECT * FROM agent_activity_ledger ${where} ORDER BY sequence DESC LIMIT ?`,
  ).all(...values, limit + 1);
  const hasMore = rows.length > limit;
  const selected = rows.slice(0, limit);
  return Object.freeze({
    items: Object.freeze(selected.map(rowToActivity)),
    next_cursor: hasMore ? selected.at(-1)!.sequence : null,
  });
}

export const LEDGER_ACTIVITY_FIELDS = Object.freeze([
  ...INTERNAL_ACTIVITY_FIELDS.slice(0, 4), "actor_type", ...INTERNAL_ACTIVITY_FIELDS.slice(4), "created_at",
] as const);

export function serializeLedgerActivity(activity: LedgerActivity, audience: "internal"): string {
  if (audience !== "internal") throw new ActivityLedgerAudienceError("agent activity is internal-only");
  const validated = activityCore(activity);
  if (activity.actor_type !== classifyActivityActor(validated)) throw new Error("actor_type does not match activity identity");
  validateIso(activity.created_at, "created_at");
  const ordered = Object.fromEntries(LEDGER_ACTIVITY_FIELDS.map((field) => [field, activity[field as keyof LedgerActivity]]));
  return JSON.stringify(ordered);
}
