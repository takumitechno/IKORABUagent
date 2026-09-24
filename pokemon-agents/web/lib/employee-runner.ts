import { createHash } from "node:crypto";
import type { Database } from "bun:sqlite";
import { appendActivity, appendEmployeeActivity, type LedgerActivity } from "./agent-activity-ledger";
import { DETERMINISTIC_EMPLOYEE_IDS, EMPLOYEE_ROLE_REGISTRY, type DecisionStatus, type InternalActivityInput, type ResultStatus } from "./agent-role-registry";

export const EMPLOYEE_RUN_SCHEMA_VERSION = "employee-run.v1" as const;
export const B1_EMPLOYEE_IDS = DETERMINISTIC_EMPLOYEE_IDS;
export const INTERNAL_HQ_SCOPE = "acct_takumi_hq" as const;

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const ACCOUNT = /^acct_[A-Za-z0-9_-]{1,128}$/;
const REF = /^(?:activity|artifact|content|cycle|experiment|metric|source):[A-Za-z0-9][A-Za-z0-9._:/-]{0,499}$/;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const SECRET = /(?:\bBearer\s+|access_token|oauth_token|api_key|client_secret|\bsk-)/i;
const CHECK_CODES = Object.freeze([
  "bridge_health", "dashboard_health", "backup_freshness", "night_freshness",
  "oauth_readiness", "tenant_isolation", "insights_freshness", "editorial_freshness",
  "activity_projection_freshness", "task_scheduler_state",
] as const);
export type MonitorCheckCode = typeof CHECK_CODES[number];
export type HanaStatus = "ok" | "delayed" | "missing" | "blocked";
type BlockingReason = "dependency" | "kill_switch" | "reauth_required";

export interface MonitorFindingInput {
  readonly check_code: MonitorCheckCode;
  readonly observed: "present" | "absent" | "unreadable" | "unknown";
  readonly age_minutes: number | null;
  readonly tolerance_minutes: number;
  readonly delayed_window_minutes: number;
  readonly block_reason: BlockingReason | null;
  readonly evidence_ref: string;
}

export interface HanaInputPacket {
  readonly schema_version: "monitor-findings.v1";
  readonly scope: string;
  readonly findings: readonly MonitorFindingInput[];
}

export interface HanaOutputPacket {
  readonly schema_version: "hana-output.v1";
  readonly scope: string;
  readonly findings: readonly {
    readonly check_code: MonitorCheckCode;
    readonly status: HanaStatus;
    readonly evidence_ref: string;
    readonly next_action_owner: "risa-notifier" | null;
  }[];
}

export interface RisaInputPacket {
  readonly schema_version: "risa-input.v1";
  readonly scope: string;
  readonly hana_packet: HanaOutputPacket;
  readonly decided_at: string;
  readonly occurrence_count: number;
  readonly prior_decisions: readonly { readonly dedupe_key: string; readonly decided_at: string }[];
}

export interface RisaOutputPacket {
  readonly schema_version: "risa-output.v1";
  readonly event_code: MonitorCheckCode | "system_pulse_ok";
  readonly decision: "send" | "suppress" | "escalate";
  readonly recipient: "human:ceo" | "sashihara-orchestrator";
  readonly severity: "critical" | "warning" | "info";
  readonly dedupe_key: string;
  readonly reason_code: "healthy" | "duplicate_window" | "critical_status" | "threshold_reached" | "actionable";
}

export interface EmployeeRunPacket {
  readonly run_id: string;
  readonly agent_id: typeof B1_EMPLOYEE_IDS[number];
  readonly role: string;
  readonly account_id: string;
  readonly task_ref: string;
  readonly correlation_id: string;
  readonly implementation_type: "deterministic_hana" | "deterministic_risa";
  readonly started_at: string;
  readonly ended_at: string;
  readonly input_packet_refs: readonly string[];
  readonly output_packet: HanaOutputPacket | RisaOutputPacket;
  readonly packet_sha256: string;
  readonly schema_version: typeof EMPLOYEE_RUN_SCHEMA_VERSION;
  readonly decision_status: DecisionStatus;
  readonly result_status: Extract<ResultStatus, "succeeded" | "failed" | "blocked">;
  readonly next_action_owner: string | null;
  readonly next_action: string | null;
  readonly evidence_refs: readonly string[];
}

export interface EmployeeRunOptions {
  readonly agentId: string;
  readonly scope: string;
  readonly input: unknown;
  readonly runId: string;
  readonly taskRef: string;
  readonly correlationId: string;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly inputPacketRefs: readonly string[];
  readonly apply?: boolean;
}

export interface EmployeeRunResult {
  readonly persisted: boolean;
  readonly replayed: boolean;
  readonly packet: EmployeeRunPacket;
  readonly activity: LedgerActivity | null;
}

export class EmployeeRunError extends Error {
  readonly code: string;
  constructor(code: string) { super(code); this.code = code; }
}

function plain(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
    && [Object.prototype, null].includes(Object.getPrototypeOf(value));
}

function exact(value: Record<string, unknown>, fields: readonly string[], label: string): void {
  const keys = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (keys.join() !== expected.join()) throw new EmployeeRunError(`${label.toUpperCase()}_SCHEMA_INVALID`);
}

function safeString(value: unknown, pattern: RegExp, code: string, max = 520): string {
  if (typeof value !== "string" || value.length < 1 || value.length > max || !pattern.test(value) || SECRET.test(value)) {
    throw new EmployeeRunError(code);
  }
  return value;
}

function utc(value: unknown, code: string): string {
  const text = safeString(value, ISO, code, 24);
  if (Number.isNaN(Date.parse(text))) throw new EmployeeRunError(code);
  return new Date(text).toISOString();
}

function refs(value: unknown, code: string): readonly string[] {
  if (!Array.isArray(value) || value.length > 50) throw new EmployeeRunError(code);
  const result = [...new Set(value.map((entry) => safeString(entry, REF, code)))].sort();
  if (result.length !== value.length) throw new EmployeeRunError(code);
  return Object.freeze(result);
}

function scope(value: unknown): string {
  const result = safeString(value, ACCOUNT, "SCOPE_INVALID", 140);
  if (result !== INTERNAL_HQ_SCOPE) throw new EmployeeRunError("INTERNAL_SCOPE_REQUIRED");
  return result;
}

function integer(value: unknown, code: string, min = 0): number {
  if (!Number.isSafeInteger(value) || Number(value) < min) throw new EmployeeRunError(code);
  return Number(value);
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (plain(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

function validateMonitorFinding(value: unknown): MonitorFindingInput {
  if (!plain(value)) throw new EmployeeRunError("MONITOR_FINDING_SCHEMA_INVALID");
  exact(value, ["check_code", "observed", "age_minutes", "tolerance_minutes", "delayed_window_minutes", "block_reason", "evidence_ref"], "monitor_finding");
  if (!CHECK_CODES.includes(value.check_code as MonitorCheckCode)) throw new EmployeeRunError("CHECK_CODE_INVALID");
  if (!["present", "absent", "unreadable", "unknown"].includes(String(value.observed))) throw new EmployeeRunError("OBSERVATION_INVALID");
  if (value.age_minutes !== null && (typeof value.age_minutes !== "number" || !Number.isFinite(value.age_minutes) || value.age_minutes < 0)) {
    throw new EmployeeRunError("AGE_INVALID");
  }
  const tolerance = integer(value.tolerance_minutes, "TOLERANCE_INVALID");
  const delayed = integer(value.delayed_window_minutes, "DELAYED_WINDOW_INVALID");
  if (delayed < tolerance) throw new EmployeeRunError("DELAYED_WINDOW_INVALID");
  if (value.block_reason !== null && !["dependency", "kill_switch", "reauth_required"].includes(String(value.block_reason))) {
    throw new EmployeeRunError("BLOCK_REASON_INVALID");
  }
  return Object.freeze({
    check_code: value.check_code as MonitorCheckCode,
    observed: value.observed as MonitorFindingInput["observed"],
    age_minutes: value.age_minutes as number | null,
    tolerance_minutes: tolerance,
    delayed_window_minutes: delayed,
    block_reason: value.block_reason as BlockingReason | null,
    evidence_ref: safeString(value.evidence_ref, REF, "EVIDENCE_REF_INVALID"),
  });
}

export function classifyHanaFinding(finding: MonitorFindingInput): HanaStatus {
  if (finding.block_reason !== null) return "blocked";
  if (finding.observed !== "present" || finding.age_minutes === null) return "missing";
  if (finding.age_minutes <= finding.tolerance_minutes) return "ok";
  return finding.age_minutes <= finding.delayed_window_minutes ? "delayed" : "missing";
}

export function runHana(input: unknown): HanaOutputPacket {
  if (!plain(input)) throw new EmployeeRunError("HANA_INPUT_SCHEMA_INVALID");
  exact(input, ["schema_version", "scope", "findings"], "hana_input");
  if (input.schema_version !== "monitor-findings.v1" || !Array.isArray(input.findings) || input.findings.length < 1 || input.findings.length > 50) {
    throw new EmployeeRunError("HANA_INPUT_SCHEMA_INVALID");
  }
  const validatedScope = scope(input.scope);
  const findings = input.findings.map(validateMonitorFinding).map((finding) => {
    const status = classifyHanaFinding(finding);
    return Object.freeze({
      check_code: finding.check_code, status, evidence_ref: finding.evidence_ref,
      next_action_owner: status === "ok" ? null : "risa-notifier" as const,
    });
  });
  return Object.freeze({ schema_version: "hana-output.v1", scope: validatedScope, findings: Object.freeze(findings) });
}

type Policy = { severity: "critical" | "warning"; recipient: "human:ceo" | "sashihara-orchestrator"; dedupeMinutes: number; escalationThreshold: number };
const CRITICAL = new Set<MonitorCheckCode>(["bridge_health", "dashboard_health", "oauth_readiness", "tenant_isolation", "task_scheduler_state"]);
export const RISA_NOTIFICATION_POLICY_VERSION = "risa-policy.v1" as const;
export const RISA_NOTIFICATION_POLICY: Readonly<Record<MonitorCheckCode, Policy>> = Object.freeze(Object.fromEntries(
  CHECK_CODES.map((code) => [code, Object.freeze(CRITICAL.has(code)
    ? { severity: "critical", recipient: "human:ceo", dedupeMinutes: 30, escalationThreshold: 1 }
    : { severity: "warning", recipient: "sashihara-orchestrator", dedupeMinutes: 120, escalationThreshold: 3 })]),
) as Record<MonitorCheckCode, Policy>);

function validateHanaOutput(value: unknown): HanaOutputPacket {
  if (!plain(value)) throw new EmployeeRunError("HANA_OUTPUT_SCHEMA_INVALID");
  exact(value, ["schema_version", "scope", "findings"], "hana_output");
  if (value.schema_version !== "hana-output.v1" || !Array.isArray(value.findings) || value.findings.length < 1) {
    throw new EmployeeRunError("HANA_OUTPUT_SCHEMA_INVALID");
  }
  const validatedScope = scope(value.scope);
  const findings = value.findings.map((finding) => {
    if (!plain(finding)) throw new EmployeeRunError("HANA_OUTPUT_SCHEMA_INVALID");
    exact(finding, ["check_code", "status", "evidence_ref", "next_action_owner"], "hana_output_finding");
    if (!CHECK_CODES.includes(finding.check_code as MonitorCheckCode) || !["ok", "delayed", "missing", "blocked"].includes(String(finding.status))) {
      throw new EmployeeRunError("HANA_OUTPUT_SCHEMA_INVALID");
    }
    const owner = finding.status === "ok" ? null : "risa-notifier";
    if (finding.next_action_owner !== owner) throw new EmployeeRunError("HANA_OUTPUT_SCHEMA_INVALID");
    return Object.freeze({ check_code: finding.check_code as MonitorCheckCode, status: finding.status as HanaStatus,
      evidence_ref: safeString(finding.evidence_ref, REF, "EVIDENCE_REF_INVALID"), next_action_owner: owner });
  });
  return Object.freeze({ schema_version: "hana-output.v1", scope: validatedScope, findings: Object.freeze(findings) });
}

export function runRisa(input: unknown): RisaOutputPacket {
  if (!plain(input)) throw new EmployeeRunError("RISA_INPUT_SCHEMA_INVALID");
  exact(input, ["schema_version", "scope", "hana_packet", "decided_at", "occurrence_count", "prior_decisions"], "risa_input");
  if (input.schema_version !== "risa-input.v1" || !Array.isArray(input.prior_decisions)) throw new EmployeeRunError("RISA_INPUT_SCHEMA_INVALID");
  const validatedScope = scope(input.scope);
  const hana = validateHanaOutput(input.hana_packet);
  if (hana.scope !== validatedScope) throw new EmployeeRunError("CROSS_SCOPE_INPUT_REJECTED");
  const decidedAt = utc(input.decided_at, "DECIDED_AT_INVALID");
  const occurrenceCount = integer(input.occurrence_count, "OCCURRENCE_COUNT_INVALID", 1);
  const priority: Record<HanaStatus, number> = { blocked: 3, missing: 2, delayed: 1, ok: 0 };
  const selected = [...hana.findings].sort((a, b) => priority[b.status] - priority[a.status] || a.check_code.localeCompare(b.check_code))[0]!;
  if (selected.status === "ok") {
    return Object.freeze({ schema_version: "risa-output.v1", event_code: "system_pulse_ok", decision: "suppress",
      recipient: "sashihara-orchestrator", severity: "info", dedupe_key: `system_pulse_ok:${validatedScope}`, reason_code: "healthy" });
  }
  const policy = RISA_NOTIFICATION_POLICY[selected.check_code];
  const dedupeKey = `${selected.check_code}:${selected.status}:${validatedScope}`;
  const cutoff = Date.parse(decidedAt) - policy.dedupeMinutes * 60_000;
  const duplicate = input.prior_decisions.some((row) => {
    if (!plain(row)) throw new EmployeeRunError("PRIOR_DECISION_SCHEMA_INVALID");
    exact(row, ["dedupe_key", "decided_at"], "prior_decision");
    return safeString(row.dedupe_key, /^[a-z0-9_:-]+$/, "DEDUPE_KEY_INVALID", 240) === dedupeKey
      && Date.parse(utc(row.decided_at, "PRIOR_DECISION_TIME_INVALID")) >= cutoff;
  });
  if (duplicate) return Object.freeze({ schema_version: "risa-output.v1", event_code: selected.check_code, decision: "suppress",
    recipient: policy.recipient, severity: policy.severity, dedupe_key: dedupeKey, reason_code: "duplicate_window" });
  if (policy.severity === "critical") return Object.freeze({ schema_version: "risa-output.v1", event_code: selected.check_code, decision: "escalate",
    recipient: "human:ceo", severity: "critical", dedupe_key: dedupeKey, reason_code: "critical_status" });
  if (occurrenceCount >= policy.escalationThreshold) return Object.freeze({ schema_version: "risa-output.v1", event_code: selected.check_code, decision: "escalate",
    recipient: "human:ceo", severity: "critical", dedupe_key: dedupeKey, reason_code: "threshold_reached" });
  return Object.freeze({ schema_version: "risa-output.v1", event_code: selected.check_code, decision: "send",
    recipient: "sashihara-orchestrator", severity: "warning", dedupe_key: dedupeKey, reason_code: "actionable" });
}

function activityFor(packet: EmployeeRunPacket): InternalActivityInput {
  const hana = packet.agent_id === "hana-heartbeat" ? packet.output_packet as HanaOutputPacket : null;
  const risa = packet.agent_id === "risa-notifier" ? packet.output_packet as RisaOutputPacket : null;
  const hanaStatuses = hana?.findings.map((finding) => finding.status) ?? [];
  const action = hana
    ? hanaStatuses.includes("missing") ? "status_missing_detected"
      : hanaStatuses.includes("delayed") ? "schedule_drift_detected" : "reliability_observed"
    : risa!.decision === "suppress" ? "notification_suppressed"
      : risa!.decision === "escalate" ? "notification_escalated" : "notification_decided";
  return {
    activity_id: `emp:${packet.run_id}`, timestamp: packet.ended_at, agent_id: packet.agent_id,
    agent_role: packet.role, account_id: packet.account_id, action, evidence_refs: packet.evidence_refs,
    decision_status: packet.decision_status, decision_summary: risa?.decision === "suppress" ? "notify_suppressed" : "result_succeeded",
    next_action_owner: packet.next_action_owner, next_action: packet.next_action,
    due_at: null, confidence_level: "high", confidence_basis: "evidence_verified", sample_size: hana?.findings.length ?? 1,
    result_status: packet.result_status, artifact_ref: `artifact:employee-run:${packet.run_id}`,
    cycle_id: null, experiment_id: null, correlation_id: packet.correlation_id, corrects_activity_id: null,
  };
}

function buildPacket(options: EmployeeRunOptions): EmployeeRunPacket {
  const employee = EMPLOYEE_ROLE_REGISTRY.find((entry) => entry.agent_id === options.agentId);
  if (!employee || !B1_EMPLOYEE_IDS.includes(employee.agent_id as typeof B1_EMPLOYEE_IDS[number])) throw new EmployeeRunError("EMPLOYEE_NOT_ENABLED_B1");
  const accountId = scope(options.scope);
  const runId = safeString(options.runId, ID, "RUN_ID_INVALID", 200);
  const correlationId = safeString(options.correlationId, ID, "CORRELATION_ID_INVALID", 200);
  const taskRef = safeString(options.taskRef, REF, "TASK_REF_INVALID");
  const inputPacketRefs = refs(options.inputPacketRefs, "INPUT_REFS_INVALID");
  const startedAt = utc(options.startedAt, "STARTED_AT_INVALID");
  const endedAt = utc(options.endedAt, "ENDED_AT_INVALID");
  if (endedAt < startedAt) throw new EmployeeRunError("TIME_RANGE_INVALID");
  const output = options.agentId === "hana-heartbeat" ? runHana(options.input) : runRisa(options.input);
  const risa = options.agentId === "risa-notifier" ? output as RisaOutputPacket : null;
  const risaInput = options.agentId === "risa-notifier" ? options.input as RisaInputPacket : null;
  const selectedEvidence = risa?.event_code === "system_pulse_ok"
    ? risaInput?.hana_packet.findings[0]?.evidence_ref
    : risaInput?.hana_packet.findings.find((finding) => finding.check_code === risa?.event_code)?.evidence_ref;
  const evidenceRefs = options.agentId === "hana-heartbeat"
    ? (output as HanaOutputPacket).findings.map((finding) => finding.evidence_ref)
    : [safeString(selectedEvidence, REF, "EVIDENCE_REF_INVALID")];
  const nextOwner = options.agentId === "hana-heartbeat"
    ? (output as HanaOutputPacket).findings.some((finding) => finding.status !== "ok") ? "risa-notifier" : null
    : risa!.decision === "escalate" ? "human:ceo" : risa!.decision === "send" ? "sashihara-orchestrator" : null;
  const base = {
    run_id: runId, agent_id: employee.agent_id as typeof B1_EMPLOYEE_IDS[number], role: employee.role,
    account_id: accountId, task_ref: taskRef, correlation_id: correlationId,
    implementation_type: options.agentId === "hana-heartbeat" ? "deterministic_hana" as const : "deterministic_risa" as const,
    started_at: startedAt, ended_at: endedAt, input_packet_refs: inputPacketRefs, output_packet: output,
    schema_version: EMPLOYEE_RUN_SCHEMA_VERSION, decision_status: options.agentId === "risa-notifier" ? "approved" as const : "not_applicable" as const,
    result_status: "succeeded" as const, next_action_owner: nextOwner,
    next_action: nextOwner ? "handoff_requested" : null, evidence_refs: Object.freeze([...new Set(evidenceRefs)].sort()),
  };
  const packetSha256 = createHash("sha256").update(canonicalJson(base), "utf8").digest("hex");
  return Object.freeze({ ...base, packet_sha256: packetSha256 });
}

function insertPacket(db: Database, packet: EmployeeRunPacket): void {
  db.query(`INSERT INTO employee_run_packets (
    run_id,agent_id,role,account_id,task_ref,correlation_id,implementation_type,started_at,ended_at,
    input_packet_refs,output_packet,packet_sha256,schema_version,decision_status,result_status,next_action_owner,next_action,evidence_refs
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    packet.run_id, packet.agent_id, packet.role, packet.account_id, packet.task_ref, packet.correlation_id,
    packet.implementation_type, packet.started_at, packet.ended_at, JSON.stringify(packet.input_packet_refs),
    JSON.stringify(packet.output_packet), packet.packet_sha256, packet.schema_version, packet.decision_status,
    packet.result_status, packet.next_action_owner, packet.next_action, JSON.stringify(packet.evidence_refs),
  );
}

function recordFailure(db: Database, options: EmployeeRunOptions): void {
  try {
    const account = db.query<{ status: string }, [string]>("SELECT status FROM agent_activity_accounts WHERE account_id=?").get(options.scope);
    if (!account || account.status !== "active" || !ID.test(options.runId) || !ID.test(options.correlationId)) return;
    appendActivity(db, {
      activity_id: `sysfail:${options.runId}`, timestamp: new Date(options.endedAt).toISOString(), agent_id: null,
      agent_role: "employee_runner", account_id: options.scope, action: "employee_run_failed",
      evidence_refs: ["source:employee-runner"], decision_status: "blocked", decision_summary: "contract_validation_failed",
      next_action_owner: "human:ceo", next_action: "human_gate_required", due_at: null,
      confidence_level: "high", confidence_basis: "evidence_verified", sample_size: 0, result_status: "failed",
      artifact_ref: null, cycle_id: null, experiment_id: null, correlation_id: options.correlationId, corrects_activity_id: null,
    });
  } catch { /* Fail closed: never invent employee output while reporting failure. */ }
}

export function runEmployee(db: Database, options: EmployeeRunOptions): EmployeeRunResult {
  try {
    const packet = buildPacket(options);
    if (!options.apply) return Object.freeze({ persisted: false, replayed: false, packet, activity: null });
    const persist = db.transaction(() => {
      const account = db.query<{ status: string }, [string]>("SELECT status FROM agent_activity_accounts WHERE account_id=?").get(packet.account_id);
      if (!account || account.status !== "active") throw new EmployeeRunError("SCOPE_NOT_REGISTERED");
      const existing = db.query<{ packet_sha256: string }, [string]>("SELECT packet_sha256 FROM employee_run_packets WHERE run_id=?").get(packet.run_id);
      if (existing && existing.packet_sha256 !== packet.packet_sha256) throw new EmployeeRunError("RUN_REPLAY_CONFLICT");
      if (!existing) insertPacket(db, packet);
      const activity = appendEmployeeActivity(db, activityFor(packet), packet.run_id);
      return Object.freeze({ persisted: true, replayed: !!existing, packet, activity });
    });
    return persist.immediate();
  } catch (error) {
    if (options.apply) recordFailure(db, options);
    throw error;
  }
}
