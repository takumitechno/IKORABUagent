import type { CanonicalRunKey } from "../../pre-rehearsal/custody-control01/controller";

export type WitnessFault = "NONE" | "BEFORE_COMMIT" | "AFTER_COMMIT";

export type WorkerCommand =
  | Readonly<{ id: string; kind: "INITIALIZE_CASE" }>
  | Readonly<{ id: string; kind: "RESERVE"; operation_id: string }>
  | Readonly<{ id: string; kind: "ADMIT"; operation_id: string; lease_lifetime_ms: number }>
  | Readonly<{ id: string; kind: "ADMIT_FIXED_EXPIRY"; operation_id: string; lease_expires_ms: number }>
  | Readonly<{ id: string; kind: "MUTATE_TEST_MATERIAL"; material: "H1" | "H2" }>
  | Readonly<{ id: string; kind: "CONFIGURE_WITNESS_FAULT"; mode: WitnessFault }>
  | Readonly<{ id: string; kind: "ADVANCE_LINEAGE"; operation_id: string }>
  | Readonly<{ id: string; kind: "ATTEMPT_NON_ADMITTED_ADVANCE"; operation_id: string }>
  | Readonly<{ id: string; kind: "ATTEMPT_FRESH_STORE_ROOT_RESTORE"; operation_id: string }>
  | Readonly<{ id: string; kind: "CLOSE"; operation_id: string; manifest: Readonly<Record<string, unknown>>; release_receipt: Readonly<Record<string, unknown>> }>
  | Readonly<{ id: string; kind: "ISSUE_JOB"; operation_id: string; evaluator_evidence: Readonly<Record<string, unknown>>; writer_evidence: Readonly<Record<string, unknown>>; role_evidence_sha256: string; workflow_instruction_id: string; workflow_instruction_sha256: string; commit_lifetime_ms: number; lose_response_for_test?: boolean }>
  | Readonly<{ id: string; kind: "ASSIGN_TARGET"; operation_id: string; verifier_evidence: Readonly<Record<string, unknown>>; evaluation_job_id: string; lose_response_for_test?: boolean }>
  | Readonly<{ id: string; kind: "CHECK_ELIGIBILITY"; target_envelope: string }>
  | Readonly<{ id: string; kind: "RECONCILE_JOB"; operation_id: string }>
  | Readonly<{ id: string; kind: "RECONCILE_TARGET"; operation_id: string }>
  | Readonly<{ id: string; kind: "STATUS_READ" }>
  | Readonly<{ id: string; kind: "RECONCILE_READ"; operation_id: string }>
  | Readonly<{ id: string; kind: "REQUEST_REPLACEMENT"; operation_id: string; lease_lifetime_ms: number }>
  | Readonly<{ id: string; kind: "ESTABLISH_POSITIVE_BASELINE"; operation_id: string; commit_lifetime_ms: number }>
  | Readonly<{ id: string; kind: "REPORT_STATE" }>
  | Readonly<{ id: string; kind: "GRACEFUL_STOP" }>;

export type WorkerResponse = Readonly<{
  id: string;
  ok: boolean;
  result?: unknown;
  error_code?: string;
  cut?: "R2A_CUT_REACHED" | "R2B_CUT_REACHED";
}>;

export type WorkerReady = Readonly<{
  kind: "WORKER_READY";
  campaign_id: string;
  case_id: string;
  generation: number;
  pid: number;
  process_started_at: string;
  process_identity: string;
}>;

export interface WorkerConfig {
  readonly campaign_id: string;
  readonly case_id: string;
  readonly generation: number;
  readonly case_dir: string;
  readonly session_lifetime_ms: number;
  readonly policy_validity_ms: number;
}

export interface PublicCaseState {
  readonly key: CanonicalRunKey;
  readonly store_paths: Readonly<{ controller: string; witness: string; authority: string; lineage: string }>;
  readonly store_ids: Readonly<{ control: string; checkpoint: string; adapter: string }>;
  readonly window: Readonly<{ start: string; end: string }>;
  readonly window_sha256: string;
  readonly network_required: false;
}

const TOKEN = /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,255}$/;
const kinds = new Set([
  "INITIALIZE_CASE", "RESERVE", "ADMIT", "ADMIT_FIXED_EXPIRY", "MUTATE_TEST_MATERIAL", "CONFIGURE_WITNESS_FAULT",
  "ADVANCE_LINEAGE", "ATTEMPT_NON_ADMITTED_ADVANCE", "ATTEMPT_FRESH_STORE_ROOT_RESTORE",
  "CLOSE", "ISSUE_JOB", "ASSIGN_TARGET", "CHECK_ELIGIBILITY",
  "RECONCILE_JOB", "RECONCILE_TARGET", "STATUS_READ", "RECONCILE_READ", "REQUEST_REPLACEMENT",
  "ESTABLISH_POSITIVE_BASELINE", "REPORT_STATE", "GRACEFUL_STOP",
]);

const fields: Record<string, readonly string[]> = {
  INITIALIZE_CASE: ["id", "kind"], RESERVE: ["id", "kind", "operation_id"],
  ADMIT: ["id", "kind", "operation_id", "lease_lifetime_ms"],
  ADMIT_FIXED_EXPIRY: ["id", "kind", "operation_id", "lease_expires_ms"],
  MUTATE_TEST_MATERIAL: ["id", "kind", "material"],
  CONFIGURE_WITNESS_FAULT: ["id", "kind", "mode"],
  ADVANCE_LINEAGE: ["id", "kind", "operation_id"],
  ATTEMPT_NON_ADMITTED_ADVANCE: ["id", "kind", "operation_id"],
  ATTEMPT_FRESH_STORE_ROOT_RESTORE: ["id", "kind", "operation_id"],
  CLOSE: ["id", "kind", "operation_id", "manifest", "release_receipt"],
  ISSUE_JOB: ["id", "kind", "operation_id", "evaluator_evidence", "writer_evidence", "role_evidence_sha256", "workflow_instruction_id", "workflow_instruction_sha256", "commit_lifetime_ms", "lose_response_for_test"],
  ASSIGN_TARGET: ["id", "kind", "operation_id", "verifier_evidence", "evaluation_job_id", "lose_response_for_test"],
  CHECK_ELIGIBILITY: ["id", "kind", "target_envelope"],
  RECONCILE_JOB: ["id", "kind", "operation_id"], RECONCILE_TARGET: ["id", "kind", "operation_id"],
  STATUS_READ: ["id", "kind"], RECONCILE_READ: ["id", "kind", "operation_id"],
  REQUEST_REPLACEMENT: ["id", "kind", "operation_id", "lease_lifetime_ms"],
  ESTABLISH_POSITIVE_BASELINE: ["id", "kind", "operation_id", "commit_lifetime_ms"],
  REPORT_STATE: ["id", "kind"], GRACEFUL_STOP: ["id", "kind"],
};

export function parseWorkerCommand(value: unknown): WorkerCommand {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("PROTOCOL_COMMAND_INVALID");
  const row = value as Record<string, unknown>, kind = String(row.kind ?? "");
  if (!kinds.has(kind) || typeof row.id !== "string" || !TOKEN.test(row.id)) throw new Error("PROTOCOL_COMMAND_INVALID");
  const allowed = fields[kind]!, optional = new Set(["lose_response_for_test"]);
  if (Object.keys(row).some((key) => !allowed.includes(key)) || allowed.some((key) => !optional.has(key) && !(key in row))) throw new Error("PROTOCOL_COMMAND_INVALID");
  for (const name of ["operation_id", "workflow_instruction_id", "evaluation_job_id"] as const) if (name in row && (typeof row[name] !== "string" || !TOKEN.test(row[name] as string))) throw new Error("PROTOCOL_COMMAND_INVALID");
  for (const name of ["lease_lifetime_ms", "lease_expires_ms", "policy_validity_ms", "commit_lifetime_ms"] as const) if (name in row && (!Number.isSafeInteger(row[name]) || Number(row[name]) <= 0)) throw new Error("PROTOCOL_COMMAND_INVALID");
  if (kind === "MUTATE_TEST_MATERIAL" && row.material !== "H1" && row.material !== "H2") throw new Error("PROTOCOL_COMMAND_INVALID");
  if (kind === "CONFIGURE_WITNESS_FAULT" && !["NONE", "BEFORE_COMMIT", "AFTER_COMMIT"].includes(String(row.mode))) throw new Error("PROTOCOL_COMMAND_INVALID");
  if ("lose_response_for_test" in row && typeof row.lose_response_for_test !== "boolean") throw new Error("PROTOCOL_COMMAND_INVALID");
  for (const name of ["manifest", "release_receipt", "evaluator_evidence", "writer_evidence", "verifier_evidence"] as const) if (name in row && (!row[name] || typeof row[name] !== "object" || Array.isArray(row[name]))) throw new Error("PROTOCOL_COMMAND_INVALID");
  for (const name of ["role_evidence_sha256", "workflow_instruction_sha256"] as const) if (name in row && (typeof row[name] !== "string" || !/^[0-9a-f]{64}$/.test(row[name] as string))) throw new Error("PROTOCOL_COMMAND_INVALID");
  if ("target_envelope" in row && typeof row.target_envelope !== "string") throw new Error("PROTOCOL_COMMAND_INVALID");
  return Object.freeze(row) as unknown as WorkerCommand;
}
