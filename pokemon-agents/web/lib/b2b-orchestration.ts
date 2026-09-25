import { createHash, randomUUID } from "node:crypto";
import type { Database } from "bun:sqlite";
import { AGENT_ACTIVITY_LEDGER_SCHEMA_SQL, appendEmployeeActivity, type LedgerActivity } from "./agent-activity-ledger";
import { buildMirinyaCostReadModel, type ThreadsAiUsageSummary } from "./ai-cost-accounting";
import { EMPLOYEE_ROLE_REGISTRY, type InternalActivityInput } from "./agent-role-registry";
import { migrateImprovementExecution } from "./improvement-execution";

export const B2B_MIGRATION_ID = "20260924_agent_role_maturity02b_b2b_v1";
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const ACCOUNT = /^acct_[A-Za-z0-9_-]{1,128}$/;
const REF = /^(?:activity|artifact|content|cycle|experiment|metric|source):[A-Za-z0-9][A-Za-z0-9._:/-]{0,499}$/;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const SECRET = /(?:https?:\/\/|webhook|token|secret|\bBearer\b|api[_-]?key|\bsk-)/i;

export class B2BError extends Error {
  constructor(readonly code: string) { super(code); }
}

function plain(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
    && [Object.prototype, null].includes(Object.getPrototypeOf(value));
}

function safe(value: unknown, pattern: RegExp, code: string, max = 520): string {
  if (typeof value !== "string" || value.length < 1 || value.length > max || !pattern.test(value) || SECRET.test(value)) throw new B2BError(code);
  return value;
}

function utc(value: unknown, code: string): string {
  const result = safe(value, ISO, code, 24);
  if (Number.isNaN(Date.parse(result))) throw new B2BError(code);
  return new Date(result).toISOString();
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (plain(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

const sha256 = (value: unknown): string => createHash("sha256").update(canonicalJson(value), "utf8").digest("hex");
const employee = (agentId: "mirinya-cost-analyst" | "sashihara-orchestrator") =>
  EMPLOYEE_ROLE_REGISTRY.find((entry) => entry.agent_id === agentId)!;

const B2B_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS notification_delivery_ledger (
  delivery_id TEXT PRIMARY KEY,
  decision_run_ref TEXT NOT NULL REFERENCES employee_run_packets(run_id),
  decision_packet_hash TEXT NOT NULL CHECK(length(decision_packet_hash)=64 AND decision_packet_hash NOT GLOB '*[^0-9a-f]*'),
  transport TEXT NOT NULL CHECK(transport IN ('discord')),
  destination_ref TEXT NOT NULL CHECK(destination_ref IN ('internal_ops','human_ceo')),
  status TEXT NOT NULL CHECK(status IN ('delivered','failed','blocked','duplicate')),
  attempt_no INTEGER NOT NULL CHECK(attempt_no BETWEEN 0 AND 3),
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  safe_error_code TEXT CHECK(safe_error_code IS NULL OR safe_error_code IN ('FEATURE_DISABLED','OPERATOR_ACTION_REQUIRED','DECISION_SUPPRESSED','ALREADY_DELIVERED','TRANSPORT_FAILED','RETRY_LIMIT_REACHED')),
  created_at TEXT NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS notification_delivery_once ON notification_delivery_ledger(decision_run_ref) WHERE status='delivered';
CREATE UNIQUE INDEX IF NOT EXISTS notification_duplicate_once ON notification_delivery_ledger(decision_run_ref) WHERE status='duplicate';
CREATE UNIQUE INDEX IF NOT EXISTS notification_failed_attempt_once ON notification_delivery_ledger(decision_run_ref,attempt_no) WHERE status='failed';
CREATE TRIGGER IF NOT EXISTS notification_delivery_no_update BEFORE UPDATE ON notification_delivery_ledger
BEGIN SELECT RAISE(ABORT,'notification delivery ledger is append-only'); END;
CREATE TRIGGER IF NOT EXISTS notification_delivery_no_delete BEFORE DELETE ON notification_delivery_ledger
BEGIN SELECT RAISE(ABORT,'notification delivery ledger is append-only'); END;
`;

function employeeTableSupportsB2B(db: Database): boolean {
  const sql = db.query<{ sql: string }, []>("SELECT sql FROM sqlite_master WHERE type='table' AND name='employee_run_packets'").get()?.sql ?? "";
  return sql.includes("deterministic_mirinya") && sql.includes("deterministic_sashihara");
}

function rebuildEmployeeRunPackets(db: Database): void {
  const foreignKeys = Number(db.query<{ foreign_keys: number }, []>("PRAGMA foreign_keys").get()?.foreign_keys ?? 0);
  if (foreignKeys) db.exec("PRAGMA foreign_keys=OFF");
  try {
    db.transaction(() => db.exec(`
      DROP TRIGGER IF EXISTS employee_run_packets_no_update; DROP TRIGGER IF EXISTS employee_run_packets_no_delete;
      DROP TRIGGER IF EXISTS employee_run_packets_canonical; DROP TRIGGER IF EXISTS agent_activity_employee_run_binding;
      CREATE TABLE employee_run_packets_b2b (
        run_id TEXT PRIMARY KEY, agent_id TEXT NOT NULL, role TEXT NOT NULL, account_id TEXT NOT NULL REFERENCES agent_activity_accounts(account_id),
        task_ref TEXT NOT NULL, correlation_id TEXT NOT NULL,
        implementation_type TEXT NOT NULL CHECK(implementation_type IN ('deterministic_hana','deterministic_risa','deterministic_anna_contract','deterministic_kiara','deterministic_mirinya','deterministic_sashihara')),
        started_at TEXT NOT NULL, ended_at TEXT NOT NULL,
        input_packet_refs TEXT NOT NULL CHECK(json_valid(input_packet_refs) AND json_type(input_packet_refs)='array'),
        output_packet TEXT NOT NULL CHECK(json_valid(output_packet) AND json_type(output_packet)='object'),
        packet_sha256 TEXT NOT NULL CHECK(length(packet_sha256)=64 AND packet_sha256 NOT GLOB '*[^0-9a-f]*'),
        schema_version TEXT NOT NULL CHECK(schema_version='employee-run.v1'),
        decision_status TEXT NOT NULL CHECK(decision_status IN ('not_applicable','pending','approved','rejected','blocked','unknown')),
        result_status TEXT NOT NULL CHECK(result_status IN ('succeeded','failed','blocked')), next_action_owner TEXT, next_action TEXT,
        evidence_refs TEXT NOT NULL CHECK(json_valid(evidence_refs) AND json_type(evidence_refs)='array'),
        created_at TEXT NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ','now')), UNIQUE(packet_sha256),
        CHECK(length(run_id) BETWEEN 1 AND 200 AND run_id NOT GLOB '*[^A-Za-z0-9._:-]*'),
        CHECK(length(correlation_id) BETWEEN 1 AND 200 AND correlation_id NOT GLOB '*[^A-Za-z0-9._:-]*'),
        CHECK(length(started_at)=24 AND substr(started_at,20,1)='.' AND substr(started_at,-1,1)='Z' AND datetime(started_at) IS NOT NULL),
        CHECK(length(ended_at)=24 AND substr(ended_at,20,1)='.' AND substr(ended_at,-1,1)='Z' AND datetime(ended_at) IS NOT NULL), CHECK(ended_at>=started_at)
      );
      INSERT INTO employee_run_packets_b2b SELECT * FROM employee_run_packets;
      DROP TABLE employee_run_packets; ALTER TABLE employee_run_packets_b2b RENAME TO employee_run_packets;
    `)).immediate();
  } finally { if (foreignKeys) db.exec("PRAGMA foreign_keys=ON"); }
  if (db.query<Record<string, unknown>, []>("PRAGMA foreign_key_check").all().length) throw new B2BError("EMPLOYEE_RUN_MIGRATION_FOREIGN_KEY_FAILURE");
}

export function migrateB2BOrchestration(db: Database): boolean {
  migrateImprovementExecution(db);
  if (db.query<{ version: string }, [string]>("SELECT version FROM schema_migrations WHERE version=?").get(B2B_MIGRATION_ID)) return false;
  if (!employeeTableSupportsB2B(db)) rebuildEmployeeRunPackets(db);
  for (const trigger of ["employee_run_packets_canonical", "agent_activity_actor_canonical", "agent_activity_action_codes", "agent_activity_employee_run_binding"]) {
    db.exec(`DROP TRIGGER IF EXISTS ${trigger}`);
  }
  db.exec(AGENT_ACTIVITY_LEDGER_SCHEMA_SQL);
  db.transaction(() => {
    db.exec(B2B_SCHEMA_SQL);
    db.query("INSERT INTO schema_migrations(version) VALUES (?)").run(B2B_MIGRATION_ID);
  }).immediate();
  return true;
}

export function assertB2BOrchestrationSchema(db: Database): void {
  if (!employeeTableSupportsB2B(db)) throw new B2BError("B2B_SCHEMA_MISSING");
  for (const name of ["notification_delivery_ledger", "notification_delivery_no_update", "notification_delivery_no_delete"]) {
    if (!db.query<{ name: string }, [string]>("SELECT name FROM sqlite_master WHERE name=?").get(name)) throw new B2BError(`B2B_SCHEMA_MISSING:${name}`);
  }
}

export type RevenueState =
  | { readonly status: "not_connected" | "unavailable" }
  | { readonly status: "connected"; readonly revenue_known_micros: number; readonly refund_known_micros: number;
      readonly commercial_cost_known_micros: number; readonly currency: string };

function validateRevenue(value: RevenueState | undefined): RevenueState {
  if (value === undefined) return Object.freeze({ status: "not_connected" });
  if (!plain(value) || !["not_connected", "unavailable", "connected"].includes(String(value.status))) throw new B2BError("REVENUE_STATE_INVALID");
  if (value.status !== "connected") {
    if (Object.keys(value).length !== 1) throw new B2BError("REVENUE_STATE_INVALID");
    return Object.freeze({ status: value.status });
  }
  const fields = [value.revenue_known_micros, value.refund_known_micros, value.commercial_cost_known_micros];
  if (Object.keys(value).sort().join() !== "commercial_cost_known_micros,currency,refund_known_micros,revenue_known_micros,status"
    || fields.some((item) => !Number.isSafeInteger(item) || item < 0) || !/^[A-Z]{3}$/.test(value.currency)) {
    throw new B2BError("REVENUE_STATE_INVALID");
  }
  return Object.freeze({ ...value });
}

function validateThreadsSummary(value: ThreadsAiUsageSummary | undefined, scope: string): ThreadsAiUsageSummary | undefined {
  if (value === undefined) return undefined;
  if (!plain(value) || !["connected", "not_connected", "unavailable"].includes(String(value.status)) || value.account_id !== scope
    || !/^\d{4}-\d{2}-\d{2}$/.test(value.from) || !/^\d{4}-\d{2}-\d{2}$/.test(value.to)
    || (value.known_cost_micros !== null && (!Number.isSafeInteger(value.known_cost_micros) || value.known_cost_micros < 0))
    || !Number.isSafeInteger(value.unknown_cost_calls) || value.unknown_cost_calls < 0
    || (value.waste_known_micros !== null && (!Number.isSafeInteger(value.waste_known_micros) || value.waste_known_micros < 0))
    || !Number.isSafeInteger(value.waste_count) || value.waste_count < 0 || !Array.isArray(value.model_mix)
    || (value.currency !== null && !/^[A-Z]{3}$/.test(value.currency))
    || value.model_mix.some((item) => !plain(item) || typeof item.model !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(item.model)
      || !Number.isSafeInteger(item.calls) || item.calls < 0
      || (item.known_cost_micros !== null && (!Number.isSafeInteger(item.known_cost_micros) || item.known_cost_micros < 0)))) throw new B2BError("THREADS_SUMMARY_INVALID");
  return value;
}

export interface MirinyaOutputPacket {
  readonly schema_version: "mirinya-economics-output.v1";
  readonly period: { readonly from: string; readonly to: string };
  readonly scope: { readonly kind: "internal" | "account"; readonly account_id: string | null };
  readonly control_plane_ai_cost_known_micros: number;
  readonly threads_ai_cost_known_micros: number | null;
  readonly unknown_cost_calls: number;
  readonly waste_known_micros: number | null;
  readonly waste_call_count: number;
  readonly model_mix: ReadonlyArray<{ readonly model: string; readonly calls: number; readonly known_cost_micros: number | null }>;
  readonly attribution_coverage: { readonly attributed: number; readonly total: number; readonly ratio: number | null };
  readonly unresolved_attribution_calls: number;
  readonly unallocated_cost_known_micros: number | null;
  readonly revenue_known_micros: number | null;
  readonly refund_known_micros: number | null;
  readonly commercial_cost_known_micros: number | null;
  readonly contribution_margin_micros: number | null;
  readonly margin_null_reason: "not_connected" | "unavailable" | "mixed_currency" | "unknown_component" | "internal_shared_cost_unallocated" | null;
  readonly currency: string | null;
  readonly data_status: "complete" | "partial" | "unavailable" | "action_required";
  readonly next_action_owner: "sashihara-orchestrator" | null;
  readonly action_reason_codes: readonly ("unknown_cost_threshold" | "attribution_below_threshold" | "cost_cap_blocked")[];
}

export function buildMirinyaOutput(db: Database, options: {
  from: string; to: string; scopeKind: "internal" | "account"; accountId?: string | null;
  threadsSummary?: ThreadsAiUsageSummary; revenue?: RevenueState; unknownCostThreshold?: number;
  minimumAttributionRatio?: number;
}): MirinyaOutputPacket {
  if (options.unknownCostThreshold !== undefined && (!Number.isSafeInteger(options.unknownCostThreshold) || options.unknownCostThreshold < 1 || options.unknownCostThreshold > 100_000)) throw new B2BError("UNKNOWN_COST_THRESHOLD_INVALID");
  if (options.minimumAttributionRatio !== undefined && (!Number.isFinite(options.minimumAttributionRatio) || options.minimumAttributionRatio < 0 || options.minimumAttributionRatio > 1)) throw new B2BError("ATTRIBUTION_THRESHOLD_INVALID");
  const expectedScope = options.scopeKind === "internal" ? "internal" : String(options.accountId ?? "");
  const threadsSummary = validateThreadsSummary(options.threadsSummary, expectedScope);
  const model = buildMirinyaCostReadModel(db, { ...options, threadsSummary });
  const revenue = validateRevenue(options.revenue);
  const reasons: MirinyaOutputPacket["action_reason_codes"][number][] = [];
  const startMonth = options.from.slice(0, 7);
  const endMonth = new Date(Date.parse(options.to) - 1).toISOString().slice(0, 7);
  const costCapBlocked = (db.query<{ n: number }, [string, string]>(`SELECT COUNT(*) n FROM agent_budgets
    WHERE period>=? AND period<=? AND (status='halted' OR used_cents>=budget_cents OR unknown_run_count>=unknown_run_limit)`).get(startMonth, endMonth)?.n ?? 0) > 0;
  if (model.unknown_cost_calls >= (options.unknownCostThreshold ?? 3)) reasons.push("unknown_cost_threshold");
  if (model.attribution_coverage.total > 0 && (model.attribution_coverage.ratio ?? 0) < (options.minimumAttributionRatio ?? .8)) reasons.push("attribution_below_threshold");
  if (costCapBlocked) reasons.push("cost_cap_blocked");
  const aiKnown = model.control_plane_ai_cost_known_micros + (model.threads_ai_cost_known_micros ?? 0);
  const mixed = model.null_reason === "mixed_currency" || (revenue.status === "connected" && model.currency !== null && revenue.currency !== model.currency);
  let margin: number | null = null;
  let nullReason: MirinyaOutputPacket["margin_null_reason"] = null;
  if (revenue.status !== "connected") nullReason = revenue.status;
  else if (mixed) nullReason = "mixed_currency";
  else if (model.unknown_cost_calls > 0 || model.threads_status !== "connected") nullReason = "unknown_component";
  else if (model.scope.kind === "internal") nullReason = "internal_shared_cost_unallocated";
  else margin = revenue.revenue_known_micros - revenue.refund_known_micros - revenue.commercial_cost_known_micros - aiKnown;
  const dataStatus = reasons.length ? "action_required" : revenue.status === "unavailable" || model.threads_status === "unavailable"
    ? "unavailable" : revenue.status === "connected" && model.threads_status === "connected"
      && model.unknown_cost_calls === 0 ? "complete" : "partial";
  return Object.freeze({
    schema_version: "mirinya-economics-output.v1", period: model.period, scope: model.scope,
    control_plane_ai_cost_known_micros: model.control_plane_ai_cost_known_micros,
    threads_ai_cost_known_micros: model.threads_ai_cost_known_micros, unknown_cost_calls: model.unknown_cost_calls,
    waste_known_micros: model.waste_known_micros, waste_call_count: model.waste_count, model_mix: model.model_mix,
    attribution_coverage: model.attribution_coverage, unresolved_attribution_calls: model.attribution_coverage.total - model.attribution_coverage.attributed,
    unallocated_cost_known_micros: model.unallocated_known_micros,
    revenue_known_micros: revenue.status === "connected" ? revenue.revenue_known_micros : null,
    refund_known_micros: revenue.status === "connected" ? revenue.refund_known_micros : null,
    commercial_cost_known_micros: revenue.status === "connected" ? revenue.commercial_cost_known_micros : null,
    contribution_margin_micros: margin, margin_null_reason: nullReason,
    currency: mixed ? null : revenue.status === "connected" ? revenue.currency : model.currency,
    data_status: dataStatus, next_action_owner: reasons.length ? "sashihara-orchestrator" : null,
    action_reason_codes: Object.freeze(reasons),
  });
}

interface PersistOptions { runId: string; correlationId: string; taskRef: string; startedAt: string; endedAt: string; apply?: boolean }
interface PacketResult<T> { persisted: boolean; replayed: boolean; packet: EmployeePacket<T>; activity: LedgerActivity | null }
interface EmployeePacket<T> {
  run_id: string; agent_id: "mirinya-cost-analyst" | "sashihara-orchestrator"; role: string; account_id: string; task_ref: string;
  correlation_id: string; implementation_type: "deterministic_mirinya" | "deterministic_sashihara"; started_at: string; ended_at: string;
  input_packet_refs: readonly string[]; output_packet: T; packet_sha256: string; schema_version: "employee-run.v1";
  decision_status: "not_applicable" | "approved" | "blocked"; result_status: "succeeded" | "blocked";
  next_action_owner: string | null; next_action: string | null; evidence_refs: readonly string[];
}

function persistPacket<T>(db: Database, packetWithoutHash: Omit<EmployeePacket<T>, "packet_sha256">, activity: InternalActivityInput, apply = false): PacketResult<T> {
  const packet = Object.freeze({ ...packetWithoutHash, packet_sha256: sha256(packetWithoutHash) }) as EmployeePacket<T>;
  if (!apply) return Object.freeze({ persisted: false, replayed: false, packet, activity: null });
  return db.transaction(() => {
    const account = db.query<{ status: string }, [string]>("SELECT status FROM agent_activity_accounts WHERE account_id=?").get(packet.account_id);
    if (!account || account.status !== "active") throw new B2BError("SCOPE_NOT_REGISTERED");
    const existing = db.query<{ packet_sha256: string }, [string]>("SELECT packet_sha256 FROM employee_run_packets WHERE run_id=?").get(packet.run_id);
    if (existing && existing.packet_sha256 !== packet.packet_sha256) throw new B2BError("RUN_REPLAY_CONFLICT");
    if (!existing) db.query(`INSERT INTO employee_run_packets (run_id,agent_id,role,account_id,task_ref,correlation_id,implementation_type,started_at,ended_at,input_packet_refs,output_packet,packet_sha256,schema_version,decision_status,result_status,next_action_owner,next_action,evidence_refs) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      packet.run_id, packet.agent_id, packet.role, packet.account_id, packet.task_ref, packet.correlation_id, packet.implementation_type,
      packet.started_at, packet.ended_at, JSON.stringify(packet.input_packet_refs), JSON.stringify(packet.output_packet), packet.packet_sha256,
      packet.schema_version, packet.decision_status, packet.result_status, packet.next_action_owner, packet.next_action, JSON.stringify(packet.evidence_refs),
    );
    const row = appendEmployeeActivity(db, activity, packet.run_id);
    return Object.freeze({ persisted: true, replayed: !!existing, packet, activity: row });
  }).immediate();
}

function common(options: PersistOptions, scope: string): { runId: string; correlationId: string; taskRef: string; startedAt: string; endedAt: string; scope: string } {
  const runId = safe(options.runId, ID, "RUN_ID_INVALID", 200);
  const correlationId = safe(options.correlationId, ID, "CORRELATION_ID_INVALID", 200);
  const taskRef = safe(options.taskRef, REF, "TASK_REF_INVALID");
  const startedAt = utc(options.startedAt, "STARTED_AT_INVALID");
  const endedAt = utc(options.endedAt, "ENDED_AT_INVALID");
  if (endedAt < startedAt) throw new B2BError("TIME_RANGE_INVALID");
  return { runId, correlationId, taskRef, startedAt, endedAt, scope: safe(scope, ACCOUNT, "SCOPE_INVALID", 140) };
}

export function runMirinyaEmployee(db: Database, input: Parameters<typeof buildMirinyaOutput>[1] & PersistOptions): PacketResult<MirinyaOutputPacket> {
  const output = buildMirinyaOutput(db, input);
  const scope = output.scope.account_id ?? "acct_takumi_hq";
  const c = common(input, scope);
  const actionable = output.next_action_owner !== null;
  const evidence = [`source:ai-usage:${sha256(output.period).slice(0, 24)}`];
  const base = {
    run_id: c.runId, agent_id: "mirinya-cost-analyst" as const, role: employee("mirinya-cost-analyst").role, account_id: c.scope,
    task_ref: c.taskRef, correlation_id: c.correlationId, implementation_type: "deterministic_mirinya" as const,
    started_at: c.startedAt, ended_at: c.endedAt, input_packet_refs: evidence, output_packet: output, schema_version: "employee-run.v1" as const,
    decision_status: "not_applicable" as const, result_status: "succeeded" as const,
    next_action_owner: output.next_action_owner, next_action: actionable ? "handoff_requested" : null, evidence_refs: evidence,
  };
  return persistPacket(db, base, {
    activity_id: `emp:${c.runId}`, timestamp: c.endedAt, agent_id: "mirinya-cost-analyst", agent_role: employee("mirinya-cost-analyst").role,
    account_id: c.scope, action: actionable ? "commercial_waste_flagged" : "cost_analyzed", evidence_refs: evidence,
    decision_status: "not_applicable", decision_summary: actionable ? "handoff_requested" : "result_succeeded",
    next_action_owner: output.next_action_owner, next_action: actionable ? "handoff_requested" : null, due_at: null,
    confidence_level: "high", confidence_basis: "evidence_verified", sample_size: output.attribution_coverage.total,
    result_status: "succeeded", artifact_ref: `artifact:employee-run:${c.runId}`, cycle_id: null, experiment_id: null,
    correlation_id: c.correlationId, corrects_activity_id: null,
  }, input.apply);
}

export type SashiharaPriority = 1 | 2 | 3 | 4 | 5 | 6;
export interface SashiharaOutputPacket {
  readonly schema_version: "sashihara-next-action-output.v1";
  readonly next_action_code: "SAFETY_ESCALATION" | "BLOCKED_DEPENDENCY" | "HUMAN_GATE" | "ECONOMICS_HARD_STOP" | "OPERATIONAL_FOLLOWUP" | "VERIFY_APPLIED_CHANGE" | "HOLD_CONFLICT" | "HOLD_STALE_PACKET" | "BLOCK_UNVERIFIED_PACKET" | "NO_ACTION";
  readonly owner: string | null; readonly priority: SashiharaPriority;
  readonly status: "selected" | "hold" | "blocked" | "no_action";
  readonly input_packet_refs: readonly string[]; readonly evidence_refs: readonly string[]; readonly conflict_codes: readonly string[];
  readonly due_at: null; readonly human_gate_required: boolean;
}

interface PacketRow {
  run_id: string; agent_id: string; role: string; account_id: string; task_ref: string; correlation_id: string; implementation_type: string;
  started_at: string; ended_at: string; input_packet_refs: string; output_packet: string; packet_sha256: string; schema_version: string;
  decision_status: string; result_status: string; next_action_owner: string | null; next_action: string | null; evidence_refs: string;
}

function verifyRow(row: PacketRow): Record<string, unknown> {
  const base = { run_id: row.run_id, agent_id: row.agent_id, role: row.role, account_id: row.account_id, task_ref: row.task_ref,
    correlation_id: row.correlation_id, implementation_type: row.implementation_type, started_at: row.started_at, ended_at: row.ended_at,
    input_packet_refs: JSON.parse(row.input_packet_refs), output_packet: JSON.parse(row.output_packet), schema_version: row.schema_version,
    decision_status: row.decision_status, result_status: row.result_status, next_action_owner: row.next_action_owner,
    next_action: row.next_action, evidence_refs: JSON.parse(row.evidence_refs) };
  if (sha256(base) !== row.packet_sha256) throw new B2BError("PACKET_HASH_MISMATCH");
  return base.output_packet as Record<string, unknown>;
}

type Candidate = { code: SashiharaOutputPacket["next_action_code"]; owner: string | null; priority: SashiharaPriority;
  status: SashiharaOutputPacket["status"]; human: boolean; ref: string; evidence: readonly string[] };

function candidate(row: PacketRow, output: Record<string, unknown>): Candidate {
  const ref = `artifact:employee-run:${row.run_id}`;
  const evidence = Object.freeze(JSON.parse(row.evidence_refs) as string[]);
  if (output.schema_version === "risa-output.v1") {
    if (output.decision === "escalate") return { code: "SAFETY_ESCALATION", owner: "human:ceo", priority: 1, status: "selected", human: true, ref, evidence };
    if (output.decision === "send") return { code: "OPERATIONAL_FOLLOWUP", owner: "sashihara-orchestrator", priority: 5, status: "selected", human: false, ref, evidence };
  }
  if (output.schema_version === "kiara-execution-output.v1") {
    if (output.result_code === "applied") return { code: "VERIFY_APPLIED_CHANGE", owner: "anna-supervisor", priority: 5, status: "selected", human: false, ref, evidence };
    return { code: "BLOCKED_DEPENDENCY", owner: "anna-supervisor", priority: 2, status: "blocked", human: false, ref, evidence };
  }
  if (output.schema_version === "mirinya-economics-output.v1" && output.next_action_owner === "sashihara-orchestrator") {
    return { code: "ECONOMICS_HARD_STOP", owner: "mirinya-cost-analyst", priority: 4, status: "blocked", human: false, ref, evidence };
  }
  if (row.decision_status === "pending" || row.next_action_owner === "human:approval") {
    return { code: "HUMAN_GATE", owner: "human:approval", priority: 3, status: "hold", human: true, ref, evidence };
  }
  return { code: "NO_ACTION", owner: null, priority: 6, status: "no_action", human: false, ref, evidence };
}

export function buildSashiharaOutput(db: Database, options: { runRefs: readonly string[]; asOf: string; maxAgeMinutes?: number }): SashiharaOutputPacket {
  const asOf = utc(options.asOf, "AS_OF_INVALID");
  if (!Array.isArray(options.runRefs) || options.runRefs.length < 1 || options.runRefs.length > 50) throw new B2BError("INPUT_PACKET_REFS_INVALID");
  const refs = [...new Set(options.runRefs.map((ref) => safe(ref, ID, "INPUT_PACKET_REF_INVALID", 200)))].sort();
  if (refs.length !== options.runRefs.length) throw new B2BError("INPUT_PACKET_REFS_INVALID");
  const rows = refs.map((ref) => db.query<PacketRow, [string]>("SELECT * FROM employee_run_packets WHERE run_id=?").get(ref));
  if (rows.some((row) => !row)) return Object.freeze({ schema_version: "sashihara-next-action-output.v1", next_action_code: "BLOCK_UNVERIFIED_PACKET",
    owner: "sashihara-orchestrator", priority: 1, status: "blocked", input_packet_refs: Object.freeze(refs.map((ref) => `artifact:employee-run:${ref}`)),
    evidence_refs: Object.freeze([]), conflict_codes: Object.freeze(["PACKET_NOT_PERSISTED"]), due_at: null, human_gate_required: false });
  const maxAge = options.maxAgeMinutes ?? 1440;
  if (!Number.isSafeInteger(maxAge) || maxAge < 1 || maxAge > 10080) throw new B2BError("MAX_AGE_INVALID");
  if ((rows as PacketRow[]).some((row) => Date.parse(row.ended_at) > Date.parse(asOf) || Date.parse(asOf) - Date.parse(row.ended_at) > maxAge * 60_000)) {
    return Object.freeze({ schema_version: "sashihara-next-action-output.v1", next_action_code: "HOLD_STALE_PACKET", owner: "sashihara-orchestrator",
      priority: 1, status: "hold", input_packet_refs: Object.freeze(refs.map((ref) => `artifact:employee-run:${ref}`)), evidence_refs: Object.freeze([]),
      conflict_codes: Object.freeze(["STALE_OR_UNKNOWN_FRESHNESS"]), due_at: null, human_gate_required: false });
  }
  let candidates: Candidate[];
  try { candidates = (rows as PacketRow[]).map((row) => candidate(row, verifyRow(row))); }
  catch { return Object.freeze({ schema_version: "sashihara-next-action-output.v1", next_action_code: "BLOCK_UNVERIFIED_PACKET", owner: "sashihara-orchestrator",
    priority: 1, status: "blocked", input_packet_refs: Object.freeze(refs.map((ref) => `artifact:employee-run:${ref}`)), evidence_refs: Object.freeze([]),
    conflict_codes: Object.freeze(["PACKET_VERIFICATION_FAILED"]), due_at: null, human_gate_required: false }); }
  candidates.sort((a, b) => a.priority - b.priority || a.ref.localeCompare(b.ref));
  const top = candidates[0]!;
  const peers = candidates.filter((item) => item.priority === top.priority);
  if (new Set(peers.map((item) => `${item.code}:${item.owner}`)).size > 1) return Object.freeze({
    schema_version: "sashihara-next-action-output.v1", next_action_code: "HOLD_CONFLICT", owner: "sashihara-orchestrator", priority: top.priority,
    status: "hold", input_packet_refs: Object.freeze(refs.map((ref) => `artifact:employee-run:${ref}`)), evidence_refs: Object.freeze([...new Set(peers.flatMap((item) => item.evidence))].sort()),
    conflict_codes: Object.freeze(peers.map((item) => item.code).sort()), due_at: null, human_gate_required: false,
  });
  return Object.freeze({ schema_version: "sashihara-next-action-output.v1", next_action_code: top.code, owner: top.owner, priority: top.priority,
    status: top.status, input_packet_refs: Object.freeze(refs.map((ref) => `artifact:employee-run:${ref}`)), evidence_refs: Object.freeze([...new Set(top.evidence)].sort()),
    conflict_codes: Object.freeze([]), due_at: null, human_gate_required: top.human });
}

export function runSashiharaEmployee(db: Database, input: { scope: string; runRefs: readonly string[]; asOf: string; maxAgeMinutes?: number } & PersistOptions): PacketResult<SashiharaOutputPacket> {
  const c = common(input, input.scope);
  const output = buildSashiharaOutput(db, input);
  const blocked = output.status === "blocked" || output.status === "hold";
  const action = output.next_action_code === "HOLD_CONFLICT" ? "conflict_arbitrated" : blocked ? "work_held" : "next_action_selected";
  const nextAction = output.status === "no_action" ? null : output.next_action_code === "HOLD_CONFLICT" ? "hold_conflict"
    : blocked ? "result_blocked" : "next_action_selected";
  const inputRefs = input.runRefs.map((ref) => `source:employee-run:${ref}`).sort();
  const base = { run_id: c.runId, agent_id: "sashihara-orchestrator" as const, role: employee("sashihara-orchestrator").role,
    account_id: c.scope, task_ref: c.taskRef, correlation_id: c.correlationId, implementation_type: "deterministic_sashihara" as const,
    started_at: c.startedAt, ended_at: c.endedAt, input_packet_refs: inputRefs, output_packet: output, schema_version: "employee-run.v1" as const,
    decision_status: blocked ? "blocked" as const : "approved" as const, result_status: blocked ? "blocked" as const : "succeeded" as const,
    next_action_owner: output.owner, next_action: nextAction, evidence_refs: output.evidence_refs };
  return persistPacket(db, base, { activity_id: `emp:${c.runId}`, timestamp: c.endedAt, agent_id: "sashihara-orchestrator",
    agent_role: employee("sashihara-orchestrator").role, account_id: c.scope, action, evidence_refs: output.evidence_refs,
    decision_status: base.decision_status, decision_summary: output.next_action_code === "HOLD_CONFLICT" ? "hold_conflict" : "next_action_selected",
    next_action_owner: output.owner, next_action: nextAction, due_at: null, confidence_level: "high", confidence_basis: "evidence_verified",
    sample_size: input.runRefs.length, result_status: base.result_status, artifact_ref: `artifact:employee-run:${c.runId}`, cycle_id: null,
    experiment_id: null, correlation_id: c.correlationId, corrects_activity_id: null }, input.apply);
}

export interface DeliveryResult { delivery_id: string; decision_run_ref: string; status: "delivered" | "failed" | "blocked" | "duplicate";
  attempt_no: number; safe_error_code: string | null; destination_ref: "internal_ops" | "human_ceo" }
export type NotificationSender = (input: { destinationRef: "internal_ops" | "human_ceo"; payload: Readonly<Record<string, string>> }) => Promise<void>;

export async function deliverRisaDecision(db: Database, input: { decisionRunRef: string; enabled: boolean; operatorInvoked: boolean;
  apply: boolean; at: string; sender: NotificationSender; maxAttempts?: number }): Promise<DeliveryResult> {
  assertB2BOrchestrationSchema(db);
  const runRef = safe(input.decisionRunRef, ID, "DECISION_RUN_REF_INVALID", 200);
  const at = utc(input.at, "DELIVERY_TIME_INVALID");
  const row = db.query<PacketRow, [string]>("SELECT * FROM employee_run_packets WHERE run_id=? AND agent_id='risa-notifier'").get(runRef);
  if (!row) throw new B2BError("PERSISTED_RISA_DECISION_REQUIRED");
  const output = verifyRow(row);
  if (output.schema_version !== "risa-output.v1") throw new B2BError("PERSISTED_RISA_DECISION_REQUIRED");
  const destination = output.recipient === "human:ceo" ? "human_ceo" as const : "internal_ops" as const;
  const delivered = db.query<{ delivery_id: string }, [string]>("SELECT delivery_id FROM notification_delivery_ledger WHERE decision_run_ref=? AND status='delivered'").get(runRef);
  const priorAttempts = db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM notification_delivery_ledger WHERE decision_run_ref=? AND status='failed'").get(runRef)?.n ?? 0;
  let status: DeliveryResult["status"] = "blocked";
  let error: string | null = null;
  let attempt = priorAttempts;
  if (delivered) { status = "duplicate"; error = "ALREADY_DELIVERED"; }
  else if (output.decision === "suppress") error = "DECISION_SUPPRESSED";
  else if (!input.enabled) error = "FEATURE_DISABLED";
  else if (!input.operatorInvoked || !input.apply) error = "OPERATOR_ACTION_REQUIRED";
  else if (priorAttempts >= (input.maxAttempts ?? 3)) error = "RETRY_LIMIT_REACHED";
  else {
    attempt = priorAttempts + 1;
    try {
      await input.sender({ destinationRef: destination, payload: Object.freeze({ event_code: String(output.event_code), severity: String(output.severity), decision: String(output.decision), decision_run_ref: runRef }) });
      status = "delivered";
    } catch { status = "failed"; error = "TRANSPORT_FAILED"; }
  }
  const result = Object.freeze({ delivery_id: `delivery:${runRef}:${status}:${attempt}`, decision_run_ref: runRef, status, attempt_no: attempt,
    safe_error_code: error, destination_ref: destination });
  if (input.apply) {
    const existing = db.query<{ delivery_id: string }, [string]>("SELECT delivery_id FROM notification_delivery_ledger WHERE delivery_id=?").get(result.delivery_id);
    if (!existing) db.query("INSERT INTO notification_delivery_ledger(delivery_id,decision_run_ref,decision_packet_hash,transport,destination_ref,status,attempt_no,started_at,ended_at,safe_error_code) VALUES (?,?,?,?,?,?,?,?,?,?)")
      .run(result.delivery_id, runRef, row.packet_sha256, "discord", destination, status, attempt, at, at, error);
  }
  return result;
}

export function loadB2BInternalReadModel(db: Database): { latest_mirinya: unknown | null; latest_sashihara: unknown | null;
  latest_risa_delivery: unknown | null; human_attention_items: readonly unknown[] } {
  const latest = (agent: string) => {
    const row = db.query<{ run_id: string; ended_at: string; output_packet: string }, [string]>("SELECT run_id,ended_at,output_packet FROM employee_run_packets WHERE agent_id=? ORDER BY ended_at DESC,created_at DESC LIMIT 1").get(agent);
    return row ? Object.freeze({ run_id: row.run_id, ended_at: row.ended_at, output_packet: JSON.parse(row.output_packet) }) : null;
  };
  const delivery = db.query<Record<string, unknown>, []>("SELECT delivery_id,decision_run_ref,transport,destination_ref,status,attempt_no,started_at,ended_at,safe_error_code FROM notification_delivery_ledger ORDER BY created_at DESC LIMIT 1").get() ?? null;
  const attention = db.query<{ run_id: string; ended_at: string; next_action_owner: string | null; next_action: string | null }, []>("SELECT run_id,ended_at,next_action_owner,next_action FROM employee_run_packets WHERE next_action_owner IN ('human:ceo','human:approval') ORDER BY ended_at DESC LIMIT 50").all();
  return Object.freeze({ latest_mirinya: latest("mirinya-cost-analyst"), latest_sashihara: latest("sashihara-orchestrator"),
    latest_risa_delivery: delivery ? Object.freeze(delivery) : null, human_attention_items: Object.freeze(attention.map(Object.freeze)) });
}

export const createRunIdentity = (agent: string) => Object.freeze({ runId: `run:${agent}:${randomUUID()}`, correlationId: `corr:${randomUUID()}` });
