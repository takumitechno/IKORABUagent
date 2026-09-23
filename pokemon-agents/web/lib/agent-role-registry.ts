/**
 * Formal organization contracts for Internal HQ.
 *
 * Employee identity and runtime capability metadata remain canonical in
 * `.claude/agents/*.md` and the `agents` table seeded from those files. The
 * `role` and `department` below are organizational contracts, not runtime
 * authorization or scheduler roles. This module adds ownership and handoff
 * contracts keyed by canonical IDs; it is not an activation mechanism.
 */

export type EmploymentStatus = "active" | "inactive";

export interface EmployeeRoleContract {
  readonly agent_id: string;
  readonly display_name: string;
  readonly role: string;
  readonly department: string;
  readonly owns: readonly string[];
  readonly does_not_own: readonly string[];
  readonly handoff_to: readonly string[];
  readonly status: EmploymentStatus;
  readonly identity_source: string;
  readonly runnable: true;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

export const EMPLOYEE_ROLE_REGISTRY = deepFreeze([
  {
    agent_id: "sashihara-orchestrator", display_name: "Sashihara",
    role: "chief_operating_editor", department: "control-plane",
    owns: ["next_action", "work_ordering", "owner_assignment", "stop_decision"],
    does_not_own: ["evidence_collection", "hypothesis_creation", "offer_selection", "writing", "self_qa", "human_approval", "publication"],
    handoff_to: ["shoko-reporter", "maika-hypothesizer", "editorial-writer", "mirinya-cost-analyst", "sanatsun-knowledge-editor", "hana-heartbeat"],
    status: "active", identity_source: ".claude/agents/sashihara-orchestrator.md", runnable: true,
  },
  {
    agent_id: "shoko-reporter", display_name: "Shoko",
    role: "research_collector", department: "research",
    owns: ["external_material_collection", "source_provenance"],
    does_not_own: ["evidence_validation", "hypothesis_creation", "strategy_selection", "publication"],
    handoff_to: ["iori-validator"], status: "active",
    identity_source: ".claude/agents/shoko-reporter.md", runnable: true,
  },
  {
    agent_id: "iori-validator", display_name: "Iori",
    role: "evidence_validator", department: "research",
    owns: ["evidence_validation", "provenance_validation", "data_quality_status"],
    does_not_own: ["external_material_collection", "hypothesis_creation", "strategy_selection", "publication"],
    handoff_to: ["maika-hypothesizer"], status: "active",
    identity_source: ".claude/agents/iori-validator.md", runnable: true,
  },
  {
    agent_id: "maika-hypothesizer", display_name: "Maika",
    role: "strategy_hypothesizer", department: "strategy",
    owns: ["hypothesis", "alternative_hypothesis", "test_design"],
    does_not_own: ["evidence_collection", "offer_selection", "writing", "publication"],
    handoff_to: ["hitomi-selector"], status: "active",
    identity_source: ".claude/agents/maika-hypothesizer.md", runnable: true,
  },
  {
    agent_id: "hitomi-selector", display_name: "Hitomi",
    role: "offer_strategy_selector", department: "strategy",
    owns: ["offer_selection", "strategy_selection"],
    does_not_own: ["test_variable_selection", "writing", "self_qa", "human_approval", "publication"],
    handoff_to: ["editorial-writer"], status: "active",
    identity_source: ".claude/agents/hitomi-selector.md", runnable: true,
  },
  {
    agent_id: "mirinya-cost-analyst", display_name: "Mirinya",
    role: "revenue_analyst", department: "intelligence",
    owns: ["revenue_analysis", "conversion_analysis", "cost_analysis", "margin_analysis"],
    does_not_own: ["offer_selection", "billing_mutation", "publication"],
    handoff_to: ["sashihara-orchestrator"], status: "active",
    identity_source: ".claude/agents/mirinya-cost-analyst.md", runnable: true,
  },
  {
    agent_id: "sanatsun-knowledge-editor", display_name: "Sanatsun",
    role: "verified_knowledge_editor", department: "intelligence",
    owns: ["verified_knowledge_lifecycle", "offer_facts_lifecycle"],
    does_not_own: ["external_material_collection", "offer_selection", "writing", "publication"],
    handoff_to: ["sashihara-orchestrator"], status: "active",
    identity_source: ".claude/agents/sanatsun-knowledge-editor.md", runnable: true,
  },
  {
    agent_id: "hana-heartbeat", display_name: "Hana",
    role: "reliability_monitor", department: "operations",
    owns: ["reliability_status", "system_pulse"],
    does_not_own: ["scheduler_creation", "retry_execution", "notification_delivery"],
    handoff_to: ["risa-notifier"], status: "active",
    identity_source: ".claude/agents/hana-heartbeat.md", runnable: true,
  },
  {
    agent_id: "risa-notifier", display_name: "Risa",
    role: "notification_policy_owner", department: "operations",
    owns: ["notification_policy", "notification_dedup", "notification_recipient"],
    does_not_own: ["system_health_classification", "credential_management", "notification_transport"],
    handoff_to: ["human:ceo"], status: "active",
    identity_source: ".claude/agents/risa-notifier.md", runnable: true,
  },
  {
    agent_id: "anna-supervisor", display_name: "Anna",
    role: "improvement_supervisor", department: "self-improvement",
    owns: ["improvement_proposal", "bounded_change_definition", "human_gate_request"],
    does_not_own: ["human_approval", "unbounded_change", "exact_execution", "publication"],
    handoff_to: ["human:approval"], status: "active",
    identity_source: ".claude/agents/anna-supervisor.md", runnable: true,
  },
  {
    agent_id: "kiara-executor", display_name: "Kiara",
    role: "approved_change_executor", department: "self-improvement",
    owns: ["approved_exact_execution", "bounded_test", "revert_readiness"],
    does_not_own: ["improvement_proposal", "scope_expansion", "human_approval", "publication"],
    handoff_to: ["anna-supervisor"], status: "active",
    identity_source: ".claude/agents/kiara-executor.md", runnable: true,
  },
] as const satisfies readonly EmployeeRoleContract[]);

export type EmployeeId = typeof EMPLOYEE_ROLE_REGISTRY[number]["agent_id"];

/** Human/CEO is an external authority, not a runnable Agent identity. */
export const TARGET_ORGANIZATION = deepFreeze({
  leader: "human:ceo",
  chief_operating_editor: "sashihara-orchestrator",
  root_handoff: Object.freeze(["human:ceo", "sashihara-orchestrator"]),
  lines: Object.freeze({
    research: Object.freeze(["shoko-reporter", "iori-validator"]),
    strategy: Object.freeze(["maika-hypothesizer", "hitomi-selector"]),
    editorial: Object.freeze(["editorial-writer", "system:editorial-qa", "human:approval"]),
    intelligence: Object.freeze(["mirinya-cost-analyst", "sanatsun-knowledge-editor"]),
    operations: Object.freeze(["hana-heartbeat", "risa-notifier"]),
    independent_improvement: Object.freeze(["anna-supervisor", "human:approval", "kiara-executor"]),
  }),
} as const);

export interface FormalRoleContract {
  readonly agent_id: string;
  readonly display_name: string;
  readonly role: string;
  readonly department: string;
  readonly owns: readonly string[];
  readonly does_not_own: readonly string[];
  readonly handoff_to: readonly string[];
  readonly status: "inactive";
  readonly identity_source: null;
  readonly runnable: false;
}

/** A formal identity boundary only. This does not register, schedule, or enable Writer. */
export const FORMAL_EDITORIAL_WRITER: FormalRoleContract = Object.freeze({
  agent_id: "editorial-writer",
  display_name: "Editorial Writer",
  role: "editorial_writer",
  department: "editorial",
  owns: Object.freeze(["expression_inside_locked_brief"]),
  does_not_own: Object.freeze([
    "offer_selection", "strategy", "test_variable_selection", "self_qa",
    "human_approval", "publication",
  ]),
  handoff_to: Object.freeze(["system:editorial-qa"]),
  status: "inactive",
  identity_source: null,
  runnable: false,
});

export const FORMAL_EDITORIAL_QA: FormalRoleContract = Object.freeze({
  agent_id: "system:editorial-qa",
  display_name: "Editorial QA",
  role: "editorial_qa",
  department: "editorial",
  owns: Object.freeze(["quality_assurance_against_locked_brief"]),
  does_not_own: Object.freeze(["self_authored_draft", "strategy", "human_approval", "publication"]),
  handoff_to: Object.freeze(["human:approval"]),
  status: "inactive",
  identity_source: null,
  runnable: false,
});

export const HUMAN_AUTHORITY_CONTRACTS = deepFreeze({
  ceo: {
    actor_id: "human:ceo", role: "ceo", owns: ["company_authority"],
    handoff_to: ["sashihara-orchestrator"],
  },
  approval_gate: {
    actor_id: "human:approval", role: "human_approval_gate", owns: ["bounded_change_approval"],
    handoff_to: ["kiara-executor"],
  },
} as const);

export function validateOrganizationTopology(): true {
  const knownTargets = new Set<string>([
    ...EMPLOYEE_ROLE_REGISTRY.map((entry) => entry.agent_id),
    FORMAL_EDITORIAL_WRITER.agent_id,
    FORMAL_EDITORIAL_QA.agent_id,
    HUMAN_AUTHORITY_CONTRACTS.ceo.actor_id,
    HUMAN_AUTHORITY_CONTRACTS.approval_gate.actor_id,
  ]);
  for (const contract of [...EMPLOYEE_ROLE_REGISTRY, FORMAL_EDITORIAL_WRITER, FORMAL_EDITORIAL_QA]) {
    for (const target of contract.handoff_to) {
      if (!knownTargets.has(target)) throw new Error(`unknown organization handoff target: ${target}`);
    }
  }
  for (const authority of Object.values(HUMAN_AUTHORITY_CONTRACTS)) {
    for (const target of authority.handoff_to) {
      if (!knownTargets.has(target)) throw new Error(`unknown human handoff target: ${target}`);
    }
  }
  const byId = new Map(EMPLOYEE_ROLE_REGISTRY.map((entry) => [entry.agent_id, entry]));
  if (HUMAN_AUTHORITY_CONTRACTS.ceo.handoff_to[0] !== "sashihara-orchestrator"
    || byId.get("anna-supervisor")?.handoff_to.join() !== "human:approval"
    || HUMAN_AUTHORITY_CONTRACTS.approval_gate.handoff_to.join() !== "kiara-executor"
    || FORMAL_EDITORIAL_WRITER.handoff_to.join() !== "system:editorial-qa"
    || FORMAL_EDITORIAL_QA.handoff_to.join() !== "human:approval") {
    throw new Error("organization gate ordering is invalid");
  }
  return true;
}

validateOrganizationTopology();

export type ActorKind = "employee" | "formal_role" | "system_capability" | "human" | "unknown";

export interface ThreadsActorAttribution {
  readonly actor_kind: ActorKind;
  readonly agent_id: EmployeeId | typeof FORMAL_EDITORIAL_WRITER.agent_id | null;
  readonly agent_role: string | null;
  readonly display_name: string;
  readonly source_actor: string | null;
}

const employeeAliases = new Map<string, EmployeeRoleContract>();
for (const employee of EMPLOYEE_ROLE_REGISTRY) {
  employeeAliases.set(employee.agent_id.toLowerCase(), employee);
}

const SYSTEM_ACTORS: Readonly<Record<string, { role: string; label: string }>> = Object.freeze({
  "editorialrunner": { role: "editorial_runner", label: "Editorial Runner" },
  "editorial runner": { role: "editorial_runner", label: "Editorial Runner" },
  "performance learner": { role: "performance_learner", label: "Performance Learner" },
  "editorial critic": { role: "editorial_critic", label: "Editorial Critic" },
  "voice judge": { role: "voice_judge", label: "Voice Judge" },
  "theme diversity judge": { role: "theme_diversity_judge", label: "Theme Diversity Judge" },
  "theme judge": { role: "theme_diversity_judge", label: "Theme Judge" },
  "experiment planner": { role: "experiment_planner", label: "Experiment Planner" },
  "qa": { role: "editorial_qa", label: "Editorial QA" },
  "night": { role: "night_scheduler", label: "NIGHT" },
});
export const SYSTEM_CAPABILITY_ROLES = Object.freeze([
  ...new Set(Object.values(SYSTEM_ACTORS).map((entry) => entry.role)),
]);
const SYSTEM_ACTIVITY_ROLES = new Set([
  ...SYSTEM_CAPABILITY_ROLES,
  "human_approval",
]);

export type ActivityActorType = "employee" | "writer" | "human" | "system_capability" | "unknown";

/**
 * Exact attribution only. Account/tenant context is deliberately absent: actor
 * identity never grants authorization or selects account scope.
 */
export function mapThreadsActor(sourceActor: string | null | undefined): ThreadsActorAttribution {
  const source = typeof sourceActor === "string" ? sourceActor.trim() : "";
  if (!source) {
    return Object.freeze({ actor_kind: "unknown", agent_id: null, agent_role: null, display_name: "未帰属", source_actor: null });
  }
  const key = source.toLowerCase();
  const employee = employeeAliases.get(key);
  if (employee) {
    return Object.freeze({
      actor_kind: "employee", agent_id: employee.agent_id as EmployeeId,
      agent_role: employee.role, display_name: employee.display_name, source_actor: source,
    });
  }
  if (key === "writer") {
    return Object.freeze({
      actor_kind: "formal_role", agent_id: FORMAL_EDITORIAL_WRITER.agent_id,
      agent_role: FORMAL_EDITORIAL_WRITER.role, display_name: FORMAL_EDITORIAL_WRITER.display_name,
      source_actor: source,
    });
  }
  if (key === "human") {
    return Object.freeze({ actor_kind: "human", agent_id: null, agent_role: "human_approval", display_name: "Human", source_actor: source });
  }
  const system = SYSTEM_ACTORS[key];
  if (system) {
    return Object.freeze({ actor_kind: "system_capability", agent_id: null, agent_role: system.role, display_name: system.label, source_actor: source });
  }
  return Object.freeze({ actor_kind: "unknown", agent_id: null, agent_role: null, display_name: "未帰属", source_actor: source });
}

const activityLabels: Readonly<Record<string, string>> = Object.freeze({
  performance_learner: "KPI分析中",
  voice_judge: "Voice監査中",
  theme_diversity_judge: "テーマ偏重を確認中",
  experiment_planner: "次回テスト設計中",
  editorial_writer: "locked brief内で投稿案を表現中",
  editorial_qa: "編集QA中",
  human_approval: "人間承認待ち",
  editorial_runner: "編集ワークフロー実行中",
  editorial_critic: "編集批評中",
});

export function threadsActorActivityLabel(actor: ThreadsActorAttribution): string | null {
  if (actor.actor_kind === "unknown") return null;
  return (actor.agent_role && activityLabels[actor.agent_role])
    || `${actor.display_name} が担当中`;
}

export const INTERNAL_ACTIVITY_FIELDS = [
  "activity_id", "timestamp", "agent_id", "agent_role", "account_id", "action",
  "evidence_refs", "decision_status", "decision_summary", "next_action_owner",
  "next_action", "due_at", "confidence_level", "confidence_basis", "sample_size",
  "result_status", "artifact_ref", "cycle_id", "experiment_id", "correlation_id",
  "corrects_activity_id",
] as const;

export type DecisionStatus = "not_applicable" | "pending" | "approved" | "rejected" | "blocked" | "unknown";
export type ConfidenceLevel = "unknown" | "low" | "medium" | "high";
export type ResultStatus = "not_applicable" | "pending" | "succeeded" | "failed" | "blocked" | "unknown";

export interface InternalActivity {
  readonly activity_id: string;
  readonly timestamp: string;
  readonly agent_id: EmployeeId | typeof FORMAL_EDITORIAL_WRITER.agent_id | null;
  readonly agent_role: string | null;
  readonly account_id: string;
  readonly action: string;
  readonly evidence_refs: readonly string[];
  readonly decision_status: DecisionStatus;
  readonly decision_summary: string | null;
  readonly next_action_owner: string | null;
  readonly next_action: string | null;
  readonly due_at: string | null;
  readonly confidence_level: ConfidenceLevel;
  readonly confidence_basis: string | null;
  readonly sample_size: number | null;
  readonly result_status: ResultStatus;
  readonly artifact_ref: string | null;
  readonly cycle_id: string | null;
  readonly experiment_id: string | null;
  readonly correlation_id: string | null;
  readonly corrects_activity_id: string | null;
}

export type InternalActivityInput = { [K in keyof InternalActivity]: InternalActivity[K] };

const FORBIDDEN_FIELD_NAMES = new Set([
  "rawprompt", "prompt", "chainofthought", "hiddenchainofthought", "reasoningtrace",
  "oauthtoken", "accesstoken", "apikey", "tooltrace", "providertrace", "secretconfig",
  "clientsecret", "authorization", "raw", "toolinput", "toolresponse", "transcriptpath",
]);
const SECRET_MARKER = /(?:\bBearer\s+[A-Za-z0-9._~+\/-]+|(?:access_token|oauth_token|api_key|client_secret)\s*[=:]|\bsk-[A-Za-z0-9_-]{8,})/i;
const CUSTOMER_PII_MARKER = /(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?\d[\d ()-]{7,}\d)|(?:氏名|住所|電話番号?|メール(?:アドレス)?|customer\s*(?:name|address|phone|email))\s*[:：]|(?:東京都|北海道|(?:京都|大阪)府|.{2,3}県).{1,40}(?:市|区|町|村)|[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]{2,20}(?:さん|様|氏))/iu;
const UNSAFE_SUMMARY_MARKER = /(?:https?:\/\/|<[^>]+>|[{}\[\]]|raw\s*(?:prompt|source|body)|system\s*prompt|user\s*prompt|(?:生|元|外部)データ|全文|原文|プロンプト|ソース本文)/i;
const OPAQUE_PII_MARKER = /\d{8,}/;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const ACCOUNT_PATTERN = /^acct_[A-Za-z0-9_-]{1,128}$/;
const REF_PATTERN = /^(?:activity|artifact|content|cycle|experiment|metric|source):[A-Za-z0-9][A-Za-z0-9._:\/-]{0,499}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/;
const ACTION_PATTERN = /^[a-z][a-z0-9._:-]{0,159}$/;
export const ACTIVITY_MESSAGE_CODES = Object.freeze([
  "evidence_verified",
  "source_verified",
  "insufficient_evidence",
  "decision_pending",
  "decision_approved",
  "decision_rejected",
  "result_succeeded",
  "result_failed",
  "result_blocked",
  "handoff_requested",
  "create_testable_hypothesis",
  "two_verified_sources",
  "low_sample",
  "data_unavailable",
  "correction_recorded",
  "corrected_summary",
  "corrected_decision_summary",
  "different_result",
] as const);
const ACTIVITY_MESSAGE_CODE_SET = new Set<string>(ACTIVITY_MESSAGE_CODES);
const MAX_EVIDENCE_REFS = 50;

function isPlainDataObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(Object.getOwnPropertyDescriptors(value)).every((descriptor) => !descriptor.get && !descriptor.set);
}

function rejectForbiddenData(value: unknown, path = "activity"): void {
  if (typeof value === "string") {
    if (SECRET_MARKER.test(value)) throw new Error(`${path} contains secret material`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => rejectForbiddenData(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    if (!isPlainDataObject(value)) throw new Error(`${path} must be a plain data object`);
    for (const [key, item] of Object.entries(value)) {
      const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (FORBIDDEN_FIELD_NAMES.has(normalized)) throw new Error(`${path}.${key} is forbidden`);
      rejectForbiddenData(item, `${path}.${key}`);
    }
  }
}

function requiredString(value: unknown, field: string, max = 500): string {
  if (typeof value !== "string" || value.length === 0 || value.length > max) throw new Error(`${field} is invalid`);
  if (SECRET_MARKER.test(value)) throw new Error(`${field} contains secret material`);
  return value;
}

function nullableString(value: unknown, field: string, max = 2_000): string | null {
  if (value === null) return null;
  return requiredString(value, field, max);
}

function nullableSanitizedSummary(value: unknown, field: string): string | null {
  const text = nullableString(value, field, 160);
  if (text !== null && (
    !ACTIVITY_MESSAGE_CODE_SET.has(text) || CUSTOMER_PII_MARKER.test(text)
    || UNSAFE_SUMMARY_MARKER.test(text) || OPAQUE_PII_MARKER.test(text) || /[\r\n]/.test(text)
  )) {
    throw new Error(`${field} must be a sanitized message code`);
  }
  return text;
}

function actionCode(value: unknown): string {
  const action = requiredString(value, "action", 160);
  if (!ACTION_PATTERN.test(action)) throw new Error("action must be a sanitized action code");
  return action;
}

function nullableOpaqueRef(value: unknown, field: string): string | null {
  const ref = nullableString(value, field, 520);
  if (ref !== null && (!REF_PATTERN.test(ref) || ref.includes("?") || ref.includes("#") || OPAQUE_PII_MARKER.test(ref))) {
    throw new Error(`${field} is not an opaque reference`);
  }
  return ref;
}

function nullableId(value: unknown, field: string): string | null {
  const id = nullableString(value, field, 200);
  if (id !== null && (!ID_PATTERN.test(id) || OPAQUE_PII_MARKER.test(id))) throw new Error(`${field} is invalid`);
  return id;
}

function nullableOwner(value: unknown): string | null {
  const owner = nullableString(value, "next_action_owner", 200);
  if (owner === null) return null;
  const known = EMPLOYEE_ROLE_REGISTRY.some((entry) => entry.agent_id === owner)
    || owner === FORMAL_EDITORIAL_WRITER.agent_id
    || owner === FORMAL_EDITORIAL_QA.agent_id
    || owner === HUMAN_AUTHORITY_CONTRACTS.ceo.actor_id
    || owner === HUMAN_AUTHORITY_CONTRACTS.approval_gate.actor_id;
  const namespacedSystem = /^system:[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(owner);
  if (!known && !namespacedSystem) throw new Error("next_action_owner is not canonical");
  return owner;
}

function isoTimestamp(value: unknown, field: string, nullable = false): string | null {
  if (nullable && value === null) return null;
  const text = requiredString(value, field, 64);
  if (!ISO_PATTERN.test(text) || Number.isNaN(Date.parse(text))) throw new Error(`${field} must be an ISO-8601 timestamp`);
  return new Date(text).toISOString();
}

function oneOf<T extends string>(value: unknown, field: string, values: readonly T[]): T {
  if (typeof value !== "string" || !values.includes(value as T)) throw new Error(`${field} is invalid`);
  return value as T;
}

function validateAgent(agentId: unknown, agentRole: unknown): { agent_id: InternalActivity["agent_id"]; agent_role: string | null } {
  const role = nullableString(agentRole, "agent_role", 120);
  if (agentId === null) {
    if (role !== null && !SYSTEM_ACTIVITY_ROLES.has(role)) throw new Error("agent_role requires a canonical agent or system role");
    return { agent_id: null, agent_role: role };
  }
  const id = requiredString(agentId, "agent_id", 200);
  const employee = EMPLOYEE_ROLE_REGISTRY.find((entry) => entry.agent_id === id);
  if (employee) {
    if (role !== employee.role) throw new Error("agent_role does not match canonical employee role");
    return { agent_id: employee.agent_id, agent_role: role };
  }
  if (id === FORMAL_EDITORIAL_WRITER.agent_id && role === FORMAL_EDITORIAL_WRITER.role) {
    return { agent_id: id, agent_role: role };
  }
  throw new Error("agent_id is not canonical");
}

export function createInternalActivity(input: unknown): InternalActivity {
  rejectForbiddenData(input);
  if (!isPlainDataObject(input)) throw new Error("activity must be a plain data object");
  const unknownKeys = Object.keys(input).filter((key) => !(INTERNAL_ACTIVITY_FIELDS as readonly string[]).includes(key));
  if (unknownKeys.length) throw new Error(`activity contains unknown fields: ${unknownKeys.sort().join(",")}`);
  const missingKeys = INTERNAL_ACTIVITY_FIELDS.filter((key) => !(key in input));
  if (missingKeys.length) throw new Error(`activity is missing fields: ${missingKeys.join(",")}`);

  const activityId = requiredString(input.activity_id, "activity_id", 200);
  if (!ID_PATTERN.test(activityId) || OPAQUE_PII_MARKER.test(activityId)) throw new Error("activity_id is invalid");
  const accountId = requiredString(input.account_id, "account_id", 140);
  if (!ACCOUNT_PATTERN.test(accountId)) throw new Error("account_id is invalid");
  const actor = validateAgent(input.agent_id, input.agent_role);
  if (!Array.isArray(input.evidence_refs)) throw new Error("evidence_refs must be an array");
  const evidenceRefs = [...new Set(input.evidence_refs.map((ref, index) => {
    const value = requiredString(ref, `evidence_refs[${index}]`, 520);
    if (!REF_PATTERN.test(value) || value.includes("?") || value.includes("#") || OPAQUE_PII_MARKER.test(value)) throw new Error(`evidence_refs[${index}] is not an opaque reference`);
    return value;
  }))].sort();
  if (evidenceRefs.length > MAX_EVIDENCE_REFS) throw new Error(`evidence_refs exceeds ${MAX_EVIDENCE_REFS} items`);
  const sampleSize = input.sample_size;
  if (sampleSize !== null && (!Number.isSafeInteger(sampleSize) || Number(sampleSize) < 0 || Number(sampleSize) > 1_000_000_000)) {
    throw new Error("sample_size is invalid");
  }
  const correction = nullableString(input.corrects_activity_id, "corrects_activity_id", 200);
  if (correction !== null && (!ID_PATTERN.test(correction) || OPAQUE_PII_MARKER.test(correction))) throw new Error("corrects_activity_id is invalid");
  const result: InternalActivity = {
    activity_id: activityId,
    timestamp: isoTimestamp(input.timestamp, "timestamp")!,
    agent_id: actor.agent_id,
    agent_role: actor.agent_role,
    account_id: accountId,
    action: actionCode(input.action),
    evidence_refs: Object.freeze(evidenceRefs),
    decision_status: oneOf(input.decision_status, "decision_status", ["not_applicable", "pending", "approved", "rejected", "blocked", "unknown"]),
    decision_summary: nullableSanitizedSummary(input.decision_summary, "decision_summary"),
    next_action_owner: nullableOwner(input.next_action_owner),
    next_action: nullableSanitizedSummary(input.next_action, "next_action"),
    due_at: isoTimestamp(input.due_at, "due_at", true),
    confidence_level: oneOf(input.confidence_level, "confidence_level", ["unknown", "low", "medium", "high"]),
    confidence_basis: nullableSanitizedSummary(input.confidence_basis, "confidence_basis"),
    sample_size: sampleSize as number | null,
    result_status: oneOf(input.result_status, "result_status", ["not_applicable", "pending", "succeeded", "failed", "blocked", "unknown"]),
    artifact_ref: nullableOpaqueRef(input.artifact_ref, "artifact_ref"),
    cycle_id: nullableId(input.cycle_id, "cycle_id"),
    experiment_id: nullableId(input.experiment_id, "experiment_id"),
    correlation_id: nullableId(input.correlation_id, "correlation_id"),
    corrects_activity_id: correction,
  };
  if (result.action === "correction" && !result.corrects_activity_id) throw new Error("correction requires corrects_activity_id");
  if (result.action !== "correction" && result.corrects_activity_id) throw new Error("only correction may set corrects_activity_id");
  if (result.corrects_activity_id === result.activity_id) throw new Error("correction must use a new activity_id");
  return Object.freeze(result);
}

/** Derives the persisted actor classification; callers cannot assert authority through this value. */
export function classifyActivityActor(activity: InternalActivity): ActivityActorType {
  const validated = createInternalActivity(activity);
  if (validated.agent_id === FORMAL_EDITORIAL_WRITER.agent_id) return "writer";
  if (validated.agent_id !== null) return "employee";
  if (validated.agent_role === "human_approval") return "human";
  if (validated.agent_role !== null) return "system_capability";
  return "unknown";
}

export type CorrectionActivityInput = Omit<InternalActivityInput, "account_id" | "action" | "corrects_activity_id">;

/** Creates a new correction event and never mutates the original history item. */
export function createCorrectionActivity(previous: InternalActivity, correction: CorrectionActivityInput): InternalActivity {
  const original = createInternalActivity(previous);
  const refs = [...correction.evidence_refs, `activity:${original.activity_id}`];
  return createInternalActivity({
    ...correction,
    account_id: original.account_id,
    action: "correction",
    evidence_refs: refs,
    corrects_activity_id: original.activity_id,
  });
}

/** Returns a new immutable history and rejects duplicate IDs; no update/delete API exists. */
export function appendInternalActivity(
  history: readonly InternalActivity[], input: unknown,
): readonly InternalActivity[] {
  const validatedHistory = history.map((entry) => createInternalActivity(entry));
  const activity = createInternalActivity(input);
  if (validatedHistory.some((entry) => entry.activity_id === activity.activity_id)) {
    throw new Error("activity_id already exists; append-only history cannot be overwritten");
  }
  return Object.freeze([...validatedHistory, activity]);
}

export function serializeInternalActivity(activity: InternalActivity, audience: "internal"): string {
  if (audience !== "internal") throw new Error("internal activity is not available to customer routes");
  const validated = createInternalActivity(activity);
  const ordered = Object.fromEntries(INTERNAL_ACTIVITY_FIELDS.map((field) => [field, validated[field]]));
  return JSON.stringify(ordered);
}
