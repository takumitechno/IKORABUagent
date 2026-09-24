import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdtempSync, readFileSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import type { Database } from "bun:sqlite";
import { AGENT_ACTIVITY_LEDGER_SCHEMA_SQL, appendEmployeeActivity, migrateAgentActivityLedger, type LedgerActivity } from "./agent-activity-ledger";
import { EMPLOYEE_ROLE_REGISTRY, type InternalActivityInput } from "./agent-role-registry";

export const IMPROVEMENT_EXECUTION_MIGRATION_ID = "20260924_improvement_execution_v1";
export const IMPROVEMENT_SCHEMA_VERSION = "improvement-proposal.v1" as const;
export const APPROVAL_SCHEMA_VERSION = "improvement-approval.v1" as const;
const HASH = /^[a-f0-9]{64}$/;
const GIT_SHA = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const REF = /^(?:activity|artifact|content|cycle|experiment|metric|source):[A-Za-z0-9][A-Za-z0-9._:/-]{0,499}$/;
const SAFE_PATH = /^[A-Za-z0-9._/-]+$/;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const TEST_COMMANDS = Object.freeze({
  "git:diff-check": (root: string) => ["git", "-C", root, "diff", "--cached", "--check"],
  "pokemon-agents:tests": (root: string) => ["bun", "test", "pokemon-agents/tests"],
} as const);
export type TestCommandId = keyof typeof TEST_COMMANDS;
export type RiskClass = "auto_apply" | "human_gate" | "forbidden";
export type KiaraResultCode = "applied" | "blocked_hash_drift" | "blocked_scope" | "tests_failed" | "reverted" | "invalid_patch" | "approval_missing";

export interface ImprovementProposal {
  readonly schema_version: typeof IMPROVEMENT_SCHEMA_VERSION;
  readonly improvement_id: string;
  readonly proposal_run_id: string;
  readonly scope: "acct_takumi_hq";
  readonly agent_id: "anna-supervisor";
  readonly target_ref: string;
  readonly target_path: ".";
  readonly base_commit_sha: string;
  readonly base_sha256: string;
  readonly base_file_hashes: Readonly<Record<string, string | null>>;
  readonly patch_artifact_ref: string;
  readonly patch_sha256: string;
  readonly allowed_paths: readonly string[];
  readonly tests: readonly TestCommandId[];
  readonly rollback_plan: "reset_clean_isolated_worktree";
  readonly risk_class: RiskClass;
  readonly reason_evidence_refs: readonly string[];
  readonly created_at: string;
  readonly proposal_sha256: string;
}

export interface AnnaProposalInput {
  readonly improvementId: string;
  readonly proposalRunId: string;
  readonly scope: string;
  readonly targetRef: string;
  readonly worktree: string;
  readonly baseCommitSha: string;
  readonly patch: Uint8Array | string;
  readonly allowedPaths: readonly string[];
  readonly tests: readonly string[];
  readonly riskClass: RiskClass;
  readonly reasonEvidenceRefs: readonly string[];
  readonly createdAt: string;
  readonly correlationId: string;
  readonly apply?: boolean;
}

export interface ApprovalDecision {
  readonly approval_id: string;
  readonly improvement_id: string;
  readonly decision: "approved" | "rejected";
  readonly proposal_sha256: string;
  readonly base_sha256: string;
  readonly patch_sha256: string;
  readonly allowed_paths: readonly string[];
  readonly tests: readonly TestCommandId[];
  readonly reviewed_by: string;
  readonly reviewed_at: string;
}

export interface KiaraExecutionResult {
  readonly mode: "dry-run" | "apply";
  readonly verification: "passed" | "failed";
  readonly result_code: KiaraResultCode | null;
  readonly result_sha256: string | null;
  readonly tests: readonly { readonly id: TestCommandId; readonly passed: boolean }[];
  readonly activity: LedgerActivity | null;
}

export class ImprovementExecutionError extends Error {
  readonly code: KiaraResultCode | string;
  constructor(code: KiaraResultCode | string) { super(code); this.code = code; }
}

const sha256 = (value: string | Uint8Array): string => createHash("sha256").update(value).digest("hex");
function plain(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (plain(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function safeString(value: unknown, pattern: RegExp, code: string, max = 520): string {
  if (typeof value !== "string" || value.length < 1 || value.length > max || !pattern.test(value)) throw new ImprovementExecutionError(code);
  return value;
}
function utc(value: unknown): string {
  const text = safeString(value, ISO, "CREATED_AT_INVALID", 24);
  if (Number.isNaN(Date.parse(text))) throw new ImprovementExecutionError("CREATED_AT_INVALID");
  return new Date(text).toISOString();
}
function output(command: readonly string[], cwd?: string, stdin?: Uint8Array, env?: Record<string, string | undefined>): Uint8Array {
  const result = Bun.spawnSync({ cmd: [...command], cwd, stdin, stdout: "pipe", stderr: "pipe", env: env ?? process.env });
  if (result.exitCode !== 0) throw new ImprovementExecutionError(`COMMAND_FAILED:${new TextDecoder().decode(result.stderr).trim().slice(0, 240)}`);
  return result.stdout;
}
function git(root: string, ...args: string[]): string {
  return new TextDecoder().decode(output(["git", "-C", root, ...args]));
}
function normalizePath(value: unknown): string {
  const path = safeString(value, SAFE_PATH, "blocked_scope", 300).replaceAll("\\", "/");
  if (isAbsolute(path) || path.startsWith("/") || path.endsWith("/") || path.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new ImprovementExecutionError("blocked_scope");
  }
  return path;
}
function uniqueSorted<T extends string>(values: readonly T[], code: string): readonly T[] {
  const result = [...new Set(values)].sort() as T[];
  if (result.length !== values.length || result.length < 1) throw new ImprovementExecutionError(code);
  return Object.freeze(result);
}
function patchBytes(value: Uint8Array | string): Uint8Array {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  if (!bytes.length || bytes.includes(0)) throw new ImprovementExecutionError("invalid_patch");
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (!text.endsWith("\n") || text.includes("GIT binary patch") || text.includes("Binary files ") || text.includes("\ndiff --cc ")) {
    throw new ImprovementExecutionError("invalid_patch");
  }
  if (!Buffer.from(text, "utf8").equals(Buffer.from(bytes))) throw new ImprovementExecutionError("invalid_patch");
  return bytes;
}
export function changedPaths(patch: Uint8Array | string): readonly string[] {
  const text = new TextDecoder().decode(patchBytes(patch));
  const matches = [...text.matchAll(/^diff --git a\/([^\r\n]+) b\/([^\r\n]+)$/gm)];
  if (!matches.length || matches.some((match) => match[1] !== match[2])) throw new ImprovementExecutionError("invalid_patch");
  if (/^(?:rename|copy) (?:from|to) /m.test(text) || /^diff --git \"/m.test(text)) throw new ImprovementExecutionError("invalid_patch");
  const paths = matches.map((match) => normalizePath(match[1]));
  return uniqueSorted(paths, "invalid_patch");
}
function ensurePaths(patch: Uint8Array, allowed: readonly string[]): readonly string[] {
  const safeAllowed = uniqueSorted(allowed.map(normalizePath), "blocked_scope");
  const changed = changedPaths(patch);
  if (changed.some((path) => !safeAllowed.includes(path))) throw new ImprovementExecutionError("blocked_scope");
  return changed;
}
function ensureNoSymlinkEscape(root: string, paths: readonly string[]): void {
  const realRoot = realpathSync(root);
  for (const path of paths) {
    let candidate = resolve(realRoot, path);
    if (relative(realRoot, candidate).startsWith("..") || isAbsolute(relative(realRoot, candidate))) throw new ImprovementExecutionError("blocked_scope");
    while (!existsSync(candidate)) {
      const parent = dirname(candidate);
      if (parent === candidate) throw new ImprovementExecutionError("blocked_scope");
      candidate = parent;
    }
    if (lstatSync(candidate).isSymbolicLink()) throw new ImprovementExecutionError("blocked_scope");
    const realCandidate = realpathSync(candidate);
    if (relative(realRoot, realCandidate).startsWith("..") || isAbsolute(relative(realRoot, realCandidate))) throw new ImprovementExecutionError("blocked_scope");
  }
}
function fileHashes(root: string, paths: readonly string[]): Readonly<Record<string, string | null>> {
  return Object.freeze(Object.fromEntries(paths.map((path) => {
    const target = resolve(root, path);
    return [path, existsSync(target) ? sha256(readFileSync(target)) : null];
  })));
}
function validateTests(values: readonly string[]): readonly TestCommandId[] {
  if (!values.length || values.some((value) => !(value in TEST_COMMANDS))) throw new ImprovementExecutionError("TEST_COMMAND_INVALID");
  return uniqueSorted(values as TestCommandId[], "TEST_COMMAND_INVALID");
}
export function repositoryIdentity(worktree: string): string {
  const common = resolve(worktree, git(worktree, "rev-parse", "--git-common-dir").trim());
  return `source:git-repo:${sha256(realpathSync(common)).slice(0, 32)}`;
}
function assertLinkedCleanWorktree(root: string): void {
  const gitMarker = resolve(root, ".git");
  if (!existsSync(gitMarker) || !lstatSync(gitMarker).isFile()) throw new ImprovementExecutionError("blocked_scope");
  if (resolve(git(root, "rev-parse", "--show-toplevel").trim()).toLowerCase() !== resolve(realpathSync(root)).toLowerCase()) {
    throw new ImprovementExecutionError("blocked_scope");
  }
  if (git(root, "status", "--porcelain=v1", "--untracked-files=all", "--ignored").trim()) throw new ImprovementExecutionError("blocked_scope");
}
function canonicalPatch(root: string, patch: Uint8Array, paths: readonly string[]): Uint8Array {
  const dir = mkdtempSync(resolve(tmpdir(), "ikorabu-index-"));
  const index = resolve(dir, "index");
  const env = { ...process.env, GIT_INDEX_FILE: index };
  try {
    output(["git", "-C", root, "read-tree", "HEAD"], undefined, undefined, env);
    output(["git", "-C", root, "apply", "--cached", "--check", "-"], undefined, patch, env);
    output(["git", "-C", root, "apply", "--cached", "-"], undefined, patch, env);
    return output(["git", "-C", root, "diff", "--cached", "--binary", "--no-ext-diff", "--full-index", "--", ...paths], undefined, undefined, env);
  } catch {
    throw new ImprovementExecutionError("invalid_patch");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
function verifyCanonicalPatch(root: string, patch: Uint8Array, paths: readonly string[]): void {
  if (!Buffer.from(canonicalPatch(root, patch, paths)).equals(Buffer.from(patch))) throw new ImprovementExecutionError("invalid_patch");
}

const IMPROVEMENT_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS improvement_patch_artifacts (
  artifact_ref TEXT PRIMARY KEY, patch_bytes BLOB NOT NULL, patch_sha256 TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL, CHECK(length(patch_sha256)=64)
);
CREATE TABLE IF NOT EXISTS improvement_proposals (
  improvement_id TEXT PRIMARY KEY, proposal_run_id TEXT NOT NULL UNIQUE REFERENCES employee_run_packets(run_id),
  scope TEXT NOT NULL CHECK(scope='acct_takumi_hq'), agent_id TEXT NOT NULL CHECK(agent_id='anna-supervisor'),
  target_ref TEXT NOT NULL, target_path TEXT NOT NULL CHECK(target_path='.'), base_commit_sha TEXT NOT NULL,
  base_sha256 TEXT NOT NULL, base_file_hashes TEXT NOT NULL CHECK(json_valid(base_file_hashes)),
  patch_artifact_ref TEXT NOT NULL REFERENCES improvement_patch_artifacts(artifact_ref), patch_sha256 TEXT NOT NULL,
  allowed_paths TEXT NOT NULL CHECK(json_valid(allowed_paths)), tests TEXT NOT NULL CHECK(json_valid(tests)),
  rollback_plan TEXT NOT NULL CHECK(rollback_plan='reset_clean_isolated_worktree'),
  risk_class TEXT NOT NULL CHECK(risk_class IN ('auto_apply','human_gate','forbidden')),
  reason_evidence_refs TEXT NOT NULL CHECK(json_valid(reason_evidence_refs)), created_at TEXT NOT NULL,
  proposal_sha256 TEXT NOT NULL UNIQUE, schema_version TEXT NOT NULL CHECK(schema_version='improvement-proposal.v1')
);
CREATE TABLE IF NOT EXISTS improvement_approval_requests (
  approval_id TEXT PRIMARY KEY, improvement_id TEXT NOT NULL UNIQUE REFERENCES improvement_proposals(improvement_id),
  proposal_sha256 TEXT NOT NULL, base_sha256 TEXT NOT NULL, patch_sha256 TEXT NOT NULL,
  allowed_paths TEXT NOT NULL CHECK(json_valid(allowed_paths)), tests TEXT NOT NULL CHECK(json_valid(tests)), created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS improvement_approval_decisions (
  approval_id TEXT PRIMARY KEY REFERENCES improvement_approval_requests(approval_id), improvement_id TEXT NOT NULL,
  decision TEXT NOT NULL CHECK(decision IN ('approved','rejected')), proposal_sha256 TEXT NOT NULL,
  base_sha256 TEXT NOT NULL, patch_sha256 TEXT NOT NULL, allowed_paths TEXT NOT NULL CHECK(json_valid(allowed_paths)),
  tests TEXT NOT NULL CHECK(json_valid(tests)), reviewed_by TEXT NOT NULL CHECK(reviewed_by GLOB 'human:*'), reviewed_at TEXT NOT NULL,
  schema_version TEXT NOT NULL CHECK(schema_version='improvement-approval.v1')
);
CREATE TABLE IF NOT EXISTS improvement_execution_results (
  run_id TEXT PRIMARY KEY REFERENCES employee_run_packets(run_id), approval_id TEXT NOT NULL UNIQUE REFERENCES improvement_approval_decisions(approval_id),
  result_code TEXT NOT NULL CHECK(result_code IN ('applied','blocked_hash_drift','blocked_scope','tests_failed','reverted','invalid_patch','approval_missing')),
  base_verified INTEGER NOT NULL CHECK(base_verified IN (0,1)), patch_verified INTEGER NOT NULL CHECK(patch_verified IN (0,1)),
  tests_result TEXT NOT NULL CHECK(json_valid(tests_result)), result_sha256 TEXT, created_at TEXT NOT NULL
);
CREATE TRIGGER IF NOT EXISTS improvement_patch_artifacts_no_update BEFORE UPDATE ON improvement_patch_artifacts BEGIN SELECT RAISE(ABORT,'improvement patch artifacts are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_patch_artifacts_no_delete BEFORE DELETE ON improvement_patch_artifacts BEGIN SELECT RAISE(ABORT,'improvement patch artifacts are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_proposals_no_update BEFORE UPDATE ON improvement_proposals BEGIN SELECT RAISE(ABORT,'improvement proposals are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_proposals_no_delete BEFORE DELETE ON improvement_proposals BEGIN SELECT RAISE(ABORT,'improvement proposals are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_approval_requests_no_update BEFORE UPDATE ON improvement_approval_requests BEGIN SELECT RAISE(ABORT,'improvement approval requests are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_approval_requests_no_delete BEFORE DELETE ON improvement_approval_requests BEGIN SELECT RAISE(ABORT,'improvement approval requests are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_approval_decisions_no_update BEFORE UPDATE ON improvement_approval_decisions BEGIN SELECT RAISE(ABORT,'improvement approval decisions are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_approval_decisions_no_delete BEFORE DELETE ON improvement_approval_decisions BEGIN SELECT RAISE(ABORT,'improvement approval decisions are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_execution_results_no_update BEFORE UPDATE ON improvement_execution_results BEGIN SELECT RAISE(ABORT,'improvement execution results are append-only'); END;
CREATE TRIGGER IF NOT EXISTS improvement_execution_results_no_delete BEFORE DELETE ON improvement_execution_results BEGIN SELECT RAISE(ABORT,'improvement execution results are append-only'); END;
`;

function employeeTableSupportsB2A(db: Database): boolean {
  const sql = db.query<{ sql: string }, []>("SELECT sql FROM sqlite_master WHERE type='table' AND name='employee_run_packets'").get()?.sql ?? "";
  return sql.includes("deterministic_anna_contract") && sql.includes("deterministic_kiara");
}
function rebuildEmployeeRunPackets(db: Database): void {
  const foreignKeys = Number(db.query<{ foreign_keys: number }, []>("PRAGMA foreign_keys").get()?.foreign_keys ?? 0);
  if (foreignKeys) db.exec("PRAGMA foreign_keys=OFF");
  try {
    db.transaction(() => {
      db.exec(`DROP TRIGGER IF EXISTS employee_run_packets_no_update; DROP TRIGGER IF EXISTS employee_run_packets_no_delete;
        DROP TRIGGER IF EXISTS employee_run_packets_canonical; DROP TRIGGER IF EXISTS agent_activity_employee_run_binding;
        CREATE TABLE employee_run_packets_b2a (
          run_id TEXT PRIMARY KEY, agent_id TEXT NOT NULL, role TEXT NOT NULL, account_id TEXT NOT NULL REFERENCES agent_activity_accounts(account_id),
          task_ref TEXT NOT NULL, correlation_id TEXT NOT NULL,
          implementation_type TEXT NOT NULL CHECK(implementation_type IN ('deterministic_hana','deterministic_risa','deterministic_anna_contract','deterministic_kiara')),
          started_at TEXT NOT NULL, ended_at TEXT NOT NULL, input_packet_refs TEXT NOT NULL CHECK(json_valid(input_packet_refs) AND json_type(input_packet_refs)='array'),
          output_packet TEXT NOT NULL CHECK(json_valid(output_packet) AND json_type(output_packet)='object'),
          packet_sha256 TEXT NOT NULL CHECK(length(packet_sha256)=64 AND packet_sha256 NOT GLOB '*[^0-9a-f]*'),
          schema_version TEXT NOT NULL CHECK(schema_version='employee-run.v1'),
          decision_status TEXT NOT NULL CHECK(decision_status IN ('not_applicable','pending','approved','rejected','blocked','unknown')),
          result_status TEXT NOT NULL CHECK(result_status IN ('succeeded','failed','blocked')), next_action_owner TEXT, next_action TEXT,
          evidence_refs TEXT NOT NULL CHECK(json_valid(evidence_refs) AND json_type(evidence_refs)='array'),
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), UNIQUE(packet_sha256),
          CHECK (length(run_id) BETWEEN 1 AND 200 AND run_id NOT GLOB '*[^A-Za-z0-9._:-]*'),
          CHECK (length(correlation_id) BETWEEN 1 AND 200 AND correlation_id NOT GLOB '*[^A-Za-z0-9._:-]*'),
          CHECK (length(started_at)=24 AND substr(started_at,20,1)='.' AND substr(started_at,-1,1)='Z' AND datetime(started_at) IS NOT NULL),
          CHECK (length(ended_at)=24 AND substr(ended_at,20,1)='.' AND substr(ended_at,-1,1)='Z' AND datetime(ended_at) IS NOT NULL),
          CHECK (ended_at >= started_at)
        );
        INSERT INTO employee_run_packets_b2a SELECT * FROM employee_run_packets;
        DROP TABLE employee_run_packets;
        ALTER TABLE employee_run_packets_b2a RENAME TO employee_run_packets;`);
    }).immediate();
  } finally {
    if (foreignKeys) db.exec("PRAGMA foreign_keys=ON");
  }
  const violations = db.query<Record<string, unknown>, []>("PRAGMA foreign_key_check").all();
  if (violations.length) throw new ImprovementExecutionError("EMPLOYEE_RUN_MIGRATION_FOREIGN_KEY_FAILURE");
}
export function migrateImprovementExecution(db: Database): boolean {
  migrateAgentActivityLedger(db);
  const exists = !!db.query<{ version: string }, [string]>("SELECT version FROM schema_migrations WHERE version=?").get(IMPROVEMENT_EXECUTION_MIGRATION_ID);
  if (exists) return false;
  if (!employeeTableSupportsB2A(db)) rebuildEmployeeRunPackets(db);
  // Re-running the ledger SQL refreshes canonical triggers from the current registry.
  for (const trigger of ["employee_run_packets_canonical", "agent_activity_actor_canonical", "agent_activity_action_codes", "agent_activity_employee_run_binding"]) {
    db.exec(`DROP TRIGGER IF EXISTS ${trigger}`);
  }
  // migrateAgentActivityLedger is version-idempotent, so explicitly refresh the current triggers.
  db.exec(AGENT_ACTIVITY_LEDGER_SCHEMA_SQL);
  db.transaction(() => {
    db.exec(IMPROVEMENT_SCHEMA_SQL);
    db.query("INSERT INTO schema_migrations(version) VALUES (?)").run(IMPROVEMENT_EXECUTION_MIGRATION_ID);
  }).immediate();
  return true;
}
export function assertImprovementExecutionSchema(db: Database): void {
  for (const name of ["improvement_patch_artifacts", "improvement_proposals", "improvement_approval_requests", "improvement_approval_decisions", "improvement_execution_results"]) {
    if (!db.query<{ name: string }, [string]>("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name)) {
      throw new ImprovementExecutionError(`MISSING_SCHEMA:${name}`);
    }
  }
  if (!employeeTableSupportsB2A(db)) throw new ImprovementExecutionError("MISSING_SCHEMA:employee_run_packets_b2a");
}

function employee(agentId: "anna-supervisor" | "kiara-executor") {
  return EMPLOYEE_ROLE_REGISTRY.find((entry) => entry.agent_id === agentId)!;
}
function insertEmployeeRun(db: Database, input: {
  runId: string; agentId: "anna-supervisor" | "kiara-executor"; correlationId: string; startedAt: string; endedAt: string;
  implementationType: "deterministic_anna_contract" | "deterministic_kiara"; inputRefs: readonly string[]; outputPacket: object;
  decisionStatus: "pending" | "approved" | "blocked"; resultStatus: "succeeded" | "failed" | "blocked";
  nextOwner: string | null; nextAction: string | null; evidenceRefs: readonly string[]; taskRef: string; activity: InternalActivityInput;
}): LedgerActivity {
  const role = employee(input.agentId).role;
  const base = {
    run_id: input.runId, agent_id: input.agentId, role, account_id: "acct_takumi_hq", task_ref: input.taskRef,
    correlation_id: input.correlationId, implementation_type: input.implementationType, started_at: input.startedAt, ended_at: input.endedAt,
    input_packet_refs: input.inputRefs, output_packet: input.outputPacket, schema_version: "employee-run.v1",
    decision_status: input.decisionStatus, result_status: input.resultStatus, next_action_owner: input.nextOwner,
    next_action: input.nextAction, evidence_refs: input.evidenceRefs,
  };
  const packetHash = sha256(canonicalJson(base));
  const existing = db.query<{ packet_sha256: string }, [string]>("SELECT packet_sha256 FROM employee_run_packets WHERE run_id=?").get(input.runId);
  if (existing && existing.packet_sha256 !== packetHash) throw new ImprovementExecutionError("RUN_REPLAY_CONFLICT");
  if (!existing) db.query(`INSERT INTO employee_run_packets (
    run_id,agent_id,role,account_id,task_ref,correlation_id,implementation_type,started_at,ended_at,input_packet_refs,
    output_packet,packet_sha256,schema_version,decision_status,result_status,next_action_owner,next_action,evidence_refs
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    input.runId, input.agentId, role, "acct_takumi_hq", input.taskRef, input.correlationId, input.implementationType,
    input.startedAt, input.endedAt, JSON.stringify(input.inputRefs), JSON.stringify(input.outputPacket), packetHash,
    "employee-run.v1", input.decisionStatus, input.resultStatus, input.nextOwner, input.nextAction, JSON.stringify(input.evidenceRefs),
  );
  return appendEmployeeActivity(db, input.activity, input.runId);
}

export function createAnnaProposal(db: Database, input: AnnaProposalInput): ImprovementProposal {
  const improvementId = safeString(input.improvementId, ID, "IMPROVEMENT_ID_INVALID", 200);
  const runId = safeString(input.proposalRunId, ID, "RUN_ID_INVALID", 200);
  if (input.scope !== "acct_takumi_hq") throw new ImprovementExecutionError("blocked_scope");
  const createdAt = utc(input.createdAt);
  const root = realpathSync(input.worktree);
  assertLinkedCleanWorktree(root);
  const baseCommit = safeString(input.baseCommitSha, GIT_SHA, "BASE_SHA_INVALID", 64);
  if (git(root, "rev-parse", "HEAD").trim() !== baseCommit) throw new ImprovementExecutionError("blocked_hash_drift");
  const targetRef = safeString(input.targetRef, REF, "TARGET_REF_INVALID");
  if (repositoryIdentity(root) !== targetRef) throw new ImprovementExecutionError("blocked_scope");
  const patch = patchBytes(input.patch);
  const paths = ensurePaths(patch, input.allowedPaths);
  ensureNoSymlinkEscape(root, paths);
  verifyCanonicalPatch(root, patch, paths);
  const tests = validateTests(input.tests);
  if (!(["auto_apply", "human_gate", "forbidden"] as const).includes(input.riskClass)) throw new ImprovementExecutionError("RISK_CLASS_INVALID");
  const refs = uniqueSorted(input.reasonEvidenceRefs.map((ref) => safeString(ref, REF, "EVIDENCE_REF_INVALID")), "EVIDENCE_REF_INVALID");
  const baseHashes = fileHashes(root, paths);
  const baseSha = sha256(canonicalJson({ commit: baseCommit, files: baseHashes }));
  const patchSha = sha256(patch);
  const artifactRef = `artifact:improvement-patch:${patchSha}`;
  const proposalBase = {
    schema_version: IMPROVEMENT_SCHEMA_VERSION, improvement_id: improvementId, proposal_run_id: runId,
    scope: "acct_takumi_hq" as const, agent_id: "anna-supervisor" as const, target_ref: targetRef, target_path: "." as const,
    base_commit_sha: baseCommit, base_sha256: baseSha, base_file_hashes: baseHashes, patch_artifact_ref: artifactRef,
    patch_sha256: patchSha, allowed_paths: Object.freeze([...paths]), tests, rollback_plan: "reset_clean_isolated_worktree" as const,
    risk_class: input.riskClass, reason_evidence_refs: refs, created_at: createdAt,
  };
  const proposal = Object.freeze({ ...proposalBase, proposal_sha256: sha256(canonicalJson(proposalBase)) });
  if (!input.apply) return proposal;
  db.transaction(() => {
    const existing = db.query<{ proposal_sha256: string }, [string]>("SELECT proposal_sha256 FROM improvement_proposals WHERE improvement_id=?").get(improvementId);
    if (existing) {
      if (existing.proposal_sha256 !== proposal.proposal_sha256) throw new ImprovementExecutionError("PROPOSAL_REPLAY_CONFLICT");
      return;
    }
    const outputPacket = { schema_version: "anna-proposal-output.v1", improvement_id: improvementId,
      proposal_sha256: proposal.proposal_sha256, base_sha256: baseSha, patch_sha256: patchSha,
      allowed_paths: proposal.allowed_paths, tests, risk_class: proposal.risk_class };
    insertEmployeeRun(db, {
      runId, agentId: "anna-supervisor", correlationId: safeString(input.correlationId, ID, "CORRELATION_ID_INVALID", 200),
      startedAt: createdAt, endedAt: createdAt, implementationType: "deterministic_anna_contract",
      inputRefs: refs.map((ref) => ref.startsWith("source:") ? ref : `source:proposal-evidence:${sha256(ref).slice(0, 24)}`),
      outputPacket, decisionStatus: "pending", resultStatus: "succeeded", nextOwner: "human:approval", nextAction: "human_gate_required",
      evidenceRefs: [...refs, artifactRef].sort(), taskRef: `source:improvement:${improvementId}`,
      activity: {
        activity_id: `emp:${runId}`, timestamp: createdAt, agent_id: "anna-supervisor", agent_role: employee("anna-supervisor").role,
        account_id: "acct_takumi_hq", action: "improvement_proposed", evidence_refs: [...refs, artifactRef].sort(),
        decision_status: "pending", decision_summary: "decision_pending", next_action_owner: "human:approval", next_action: "human_gate_required",
        due_at: null, confidence_level: "high", confidence_basis: "evidence_verified", sample_size: paths.length, result_status: "succeeded",
        artifact_ref: artifactRef, cycle_id: null, experiment_id: null, correlation_id: input.correlationId, corrects_activity_id: null,
      },
    });
    db.query("INSERT INTO improvement_patch_artifacts VALUES (?,?,?,?)").run(artifactRef, patch, patchSha, createdAt);
    db.query(`INSERT INTO improvement_proposals VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      proposal.improvement_id, proposal.proposal_run_id, proposal.scope, proposal.agent_id, proposal.target_ref, proposal.target_path,
      proposal.base_commit_sha, proposal.base_sha256, JSON.stringify(proposal.base_file_hashes), proposal.patch_artifact_ref,
      proposal.patch_sha256, JSON.stringify(proposal.allowed_paths), JSON.stringify(proposal.tests), proposal.rollback_plan,
      proposal.risk_class, JSON.stringify(proposal.reason_evidence_refs), proposal.created_at, proposal.proposal_sha256, proposal.schema_version,
    );
    db.query("INSERT INTO improvement_approval_requests VALUES (?,?,?,?,?,?,?,?)").run(
      `approval:${improvementId}`, improvementId, proposal.proposal_sha256, baseSha, patchSha,
      JSON.stringify(proposal.allowed_paths), JSON.stringify(proposal.tests), createdAt,
    );
  }).immediate();
  return proposal;
}

export function decideImprovementApproval(db: Database, approvalId: string, decision: "approved" | "rejected", reviewedBy: string, reviewedAt: string): ApprovalDecision {
  safeString(approvalId, ID, "APPROVAL_ID_INVALID", 200);
  if (!/^human:[a-z0-9_-]+$/.test(reviewedBy)) throw new ImprovementExecutionError("HUMAN_REVIEWER_REQUIRED");
  const at = utc(reviewedAt);
  const request = db.query<{ approval_id: string; improvement_id: string; proposal_sha256: string; base_sha256: string; patch_sha256: string; allowed_paths: string; tests: string }, [string]>(
    "SELECT * FROM improvement_approval_requests WHERE approval_id=?",
  ).get(approvalId);
  if (!request) throw new ImprovementExecutionError("APPROVAL_REQUEST_MISSING");
  const proposal = db.query<{ proposal_sha256: string; base_sha256: string; patch_sha256: string; allowed_paths: string; tests: string }, [string]>(
    "SELECT proposal_sha256,base_sha256,patch_sha256,allowed_paths,tests FROM improvement_proposals WHERE improvement_id=?",
  ).get(request.improvement_id);
  if (!proposal || proposal.proposal_sha256 !== request.proposal_sha256 || proposal.base_sha256 !== request.base_sha256
    || proposal.patch_sha256 !== request.patch_sha256 || proposal.allowed_paths !== request.allowed_paths || proposal.tests !== request.tests) {
    throw new ImprovementExecutionError("APPROVAL_BINDING_CONFLICT");
  }
  const value: ApprovalDecision = Object.freeze({ approval_id: request.approval_id, improvement_id: request.improvement_id, decision,
    proposal_sha256: request.proposal_sha256, base_sha256: request.base_sha256, patch_sha256: request.patch_sha256,
    allowed_paths: Object.freeze(JSON.parse(request.allowed_paths)), tests: Object.freeze(JSON.parse(request.tests)), reviewed_by: reviewedBy, reviewed_at: at });
  const existing = db.query<{ decision: string; proposal_sha256: string; base_sha256: string; patch_sha256: string; allowed_paths: string; tests: string; reviewed_by: string; reviewed_at: string }, [string]>(
    "SELECT * FROM improvement_approval_decisions WHERE approval_id=?",
  ).get(approvalId);
  if (existing) {
    const exact = existing.decision === decision && existing.proposal_sha256 === value.proposal_sha256 && existing.base_sha256 === value.base_sha256
      && existing.patch_sha256 === value.patch_sha256 && existing.allowed_paths === JSON.stringify(value.allowed_paths)
      && existing.tests === JSON.stringify(value.tests) && existing.reviewed_by === reviewedBy;
    if (!exact) throw new ImprovementExecutionError("APPROVAL_REPLAY_CONFLICT");
    return Object.freeze({ ...value, reviewed_at: existing.reviewed_at });
  }
  db.query("INSERT INTO improvement_approval_decisions VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(
    value.approval_id, value.improvement_id, value.decision, value.proposal_sha256, value.base_sha256, value.patch_sha256,
    JSON.stringify(value.allowed_paths), JSON.stringify(value.tests), value.reviewed_by, value.reviewed_at, APPROVAL_SCHEMA_VERSION,
  );
  return value;
}

function loadApproved(db: Database, approvalId: string): { proposal: ImprovementProposal; patch: Uint8Array; approval: ApprovalDecision } {
  const row = db.query<Record<string, unknown>, [string]>(`SELECT p.*, a.approval_id, a.decision, a.reviewed_by, a.reviewed_at,
      a.proposal_sha256 approval_proposal_sha256, a.base_sha256 approval_base_sha256, a.patch_sha256 approval_patch_sha256,
      a.allowed_paths approval_allowed_paths, a.tests approval_tests, x.patch_bytes
    FROM improvement_approval_decisions a JOIN improvement_proposals p ON p.improvement_id=a.improvement_id
    JOIN improvement_patch_artifacts x ON x.artifact_ref=p.patch_artifact_ref WHERE a.approval_id=?`,).get(approvalId);
  if (!row || row.decision !== "approved") throw new ImprovementExecutionError("approval_missing");
  const proposal = Object.freeze({ schema_version: row.schema_version, improvement_id: row.improvement_id, proposal_run_id: row.proposal_run_id,
    scope: row.scope, agent_id: row.agent_id, target_ref: row.target_ref, target_path: row.target_path, base_commit_sha: row.base_commit_sha,
    base_sha256: row.base_sha256, base_file_hashes: Object.freeze(JSON.parse(String(row.base_file_hashes))), patch_artifact_ref: row.patch_artifact_ref,
    patch_sha256: row.patch_sha256, allowed_paths: Object.freeze(JSON.parse(String(row.allowed_paths))), tests: Object.freeze(JSON.parse(String(row.tests))),
    rollback_plan: row.rollback_plan, risk_class: row.risk_class, reason_evidence_refs: Object.freeze(JSON.parse(String(row.reason_evidence_refs))),
    created_at: row.created_at, proposal_sha256: row.proposal_sha256 }) as ImprovementProposal;
  const approval = Object.freeze({ approval_id: row.approval_id, improvement_id: row.improvement_id, decision: "approved",
    proposal_sha256: row.approval_proposal_sha256, base_sha256: row.approval_base_sha256, patch_sha256: row.approval_patch_sha256,
    allowed_paths: Object.freeze(JSON.parse(String(row.approval_allowed_paths))), tests: Object.freeze(JSON.parse(String(row.approval_tests))),
    reviewed_by: row.reviewed_by, reviewed_at: row.reviewed_at }) as ApprovalDecision;
  const binding = approval.proposal_sha256 === proposal.proposal_sha256 && approval.base_sha256 === proposal.base_sha256
    && approval.patch_sha256 === proposal.patch_sha256 && canonicalJson(approval.allowed_paths) === canonicalJson(proposal.allowed_paths)
    && canonicalJson(approval.tests) === canonicalJson(proposal.tests);
  const patch = new Uint8Array(row.patch_bytes as Uint8Array);
  if (!binding) throw new ImprovementExecutionError("blocked_hash_drift");
  return { proposal, patch, approval };
}
function rollback(root: string): void {
  output(["git", "-C", root, "reset", "--hard", "HEAD"]);
  output(["git", "-C", root, "clean", "-fdx"]);
  if (git(root, "status", "--porcelain=v1", "--untracked-files=all", "--ignored").trim()) throw new ImprovementExecutionError("ROLLBACK_FAILED");
}
function verifyOnlyApprovedChanges(root: string, allowedPaths: readonly string[]): void {
  const lines = git(root, "status", "--porcelain=v1", "--untracked-files=all", "--ignored").trim().split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    if (line.startsWith("?? ") || line.startsWith("!! ") || line[1] !== " ") throw new ImprovementExecutionError("blocked_scope");
    const path = line.slice(3).replace(/^"|"$/g, "").replaceAll("\\", "/");
    if (!allowedPaths.includes(path)) throw new ImprovementExecutionError("blocked_scope");
  }
}
function recordKiara(db: Database, input: { proposal: ImprovementProposal; approvalId: string; runId: string; correlationId: string; at: string;
  code: KiaraResultCode; tests: readonly { id: TestCommandId; passed: boolean }[]; resultHash: string | null;
  baseVerified: boolean; patchVerified: boolean; }): LedgerActivity {
  const succeeded = input.code === "applied";
  const reverted = input.code === "tests_failed" || input.code === "reverted";
  const outputPacket = { schema_version: "kiara-execution-output.v1", improvement_id: input.proposal.improvement_id,
    approval_id: input.approvalId, proposal_sha256: input.proposal.proposal_sha256, base_sha256: input.proposal.base_sha256,
    patch_sha256: input.proposal.patch_sha256, result_code: input.code, tests: input.tests, result_sha256: input.resultHash };
  return db.transaction(() => {
    const activity = insertEmployeeRun(db, {
      runId: input.runId, agentId: "kiara-executor", correlationId: input.correlationId, startedAt: input.at, endedAt: input.at,
      implementationType: "deterministic_kiara", inputRefs: [`source:approval:${input.approvalId}`], outputPacket,
      decisionStatus: succeeded || reverted ? "approved" : "blocked", resultStatus: succeeded ? "succeeded" : reverted ? "failed" : "blocked",
      nextOwner: "anna-supervisor", nextAction: succeeded ? "result_succeeded" : reverted ? "result_failed" : "result_blocked",
      evidenceRefs: [input.proposal.patch_artifact_ref, `source:approval:${input.approvalId}`], taskRef: `source:improvement:${input.proposal.improvement_id}`,
      activity: {
        activity_id: `emp:${input.runId}`, timestamp: input.at, agent_id: "kiara-executor", agent_role: employee("kiara-executor").role,
        account_id: "acct_takumi_hq", action: succeeded ? "approved_change_executed" : reverted ? "approved_change_reverted" : "approved_change_tested",
        evidence_refs: [input.proposal.patch_artifact_ref, `source:approval:${input.approvalId}`], decision_status: succeeded || reverted ? "approved" : "blocked",
        decision_summary: succeeded ? "decision_approved" : reverted ? "result_failed" : "result_blocked", next_action_owner: "anna-supervisor",
        next_action: succeeded ? "result_succeeded" : reverted ? "result_failed" : "result_blocked", due_at: null, confidence_level: "high",
        confidence_basis: "evidence_verified", sample_size: input.tests.length, result_status: succeeded ? "succeeded" : reverted ? "failed" : "blocked",
        artifact_ref: input.proposal.patch_artifact_ref, cycle_id: null, experiment_id: null, correlation_id: input.correlationId, corrects_activity_id: null,
      },
    });
    db.query("INSERT INTO improvement_execution_results VALUES (?,?,?,?,?,?,?,?)").run(
      input.runId, input.approvalId, input.code, input.baseVerified ? 1 : 0, input.patchVerified ? 1 : 0,
      JSON.stringify(input.tests), input.resultHash, input.at,
    );
    return activity;
  }).immediate();
}

export function executeApprovedImprovement(db: Database, input: { approvalId: string; worktree: string; runId: string; correlationId: string; at: string; apply?: boolean }): KiaraExecutionResult {
  const approvalId = safeString(input.approvalId, ID, "APPROVAL_ID_INVALID", 200);
  const runId = safeString(input.runId, ID, "RUN_ID_INVALID", 200);
  const correlationId = safeString(input.correlationId, ID, "CORRELATION_ID_INVALID", 200);
  const at = utc(input.at);
  const { proposal, patch } = loadApproved(db, approvalId);
  let root: string;
  let paths: readonly string[];
  let baseVerified = false;
  let patchVerified = false;
  try {
    if (proposal.risk_class === "forbidden") throw new ImprovementExecutionError("blocked_scope");
    root = realpathSync(input.worktree);
    assertLinkedCleanWorktree(root);
    if (repositoryIdentity(root) !== proposal.target_ref) throw new ImprovementExecutionError("blocked_scope");
    if (git(root, "rev-parse", "HEAD").trim() !== proposal.base_commit_sha) throw new ImprovementExecutionError("blocked_hash_drift");
    if (sha256(patch) !== proposal.patch_sha256) throw new ImprovementExecutionError("blocked_hash_drift");
    paths = ensurePaths(patch, proposal.allowed_paths);
    ensureNoSymlinkEscape(root, paths);
    if (sha256(canonicalJson({ commit: proposal.base_commit_sha, files: fileHashes(root, paths) })) !== proposal.base_sha256) {
      throw new ImprovementExecutionError("blocked_hash_drift");
    }
    baseVerified = true;
    verifyCanonicalPatch(root, patch, paths);
    patchVerified = true;
  } catch (error) {
    if (!input.apply) throw error;
    const raw = error instanceof ImprovementExecutionError ? error.code : "blocked_scope";
    const code: KiaraResultCode = raw === "blocked_hash_drift" ? "blocked_hash_drift" : raw === "invalid_patch" ? "invalid_patch" : "blocked_scope";
    const activity = recordKiara(db, { proposal, approvalId, runId, correlationId, at, code, tests: [], resultHash: null, baseVerified, patchVerified });
    return Object.freeze({ mode: "apply", verification: "failed", result_code: code, result_sha256: null, tests: [], activity });
  }
  if (!input.apply) return Object.freeze({ mode: "dry-run", verification: "passed", result_code: null, result_sha256: null, tests: [], activity: null });

  let applied = false;
  const tests: { id: TestCommandId; passed: boolean }[] = [];
  try {
    output(["git", "-C", root, "apply", "--index", "-"], undefined, patch);
    applied = true;
    const diff = output(["git", "-C", root, "diff", "--cached", "--binary", "--no-ext-diff", "--full-index", "--", ...paths]);
    if (!Buffer.from(diff).equals(Buffer.from(patch))) throw new ImprovementExecutionError("invalid_patch");
    verifyOnlyApprovedChanges(root, proposal.allowed_paths);
    for (const id of proposal.tests) {
      const result = Bun.spawnSync({ cmd: TEST_COMMANDS[id](root), cwd: root, stdout: "pipe", stderr: "pipe", env: process.env });
      tests.push({ id, passed: result.exitCode === 0 });
      if (result.exitCode !== 0) throw new ImprovementExecutionError("tests_failed");
    }
    const afterTests = output(["git", "-C", root, "diff", "--cached", "--binary", "--no-ext-diff", "--full-index", "--", ...paths]);
    if (!Buffer.from(afterTests).equals(Buffer.from(patch))) throw new ImprovementExecutionError("invalid_patch");
    verifyOnlyApprovedChanges(root, proposal.allowed_paths);
    const activity = recordKiara(db, { proposal, approvalId, runId, correlationId, at, code: "applied", tests, resultHash: sha256(afterTests), baseVerified: true, patchVerified: true });
    return Object.freeze({ mode: "apply", verification: "passed", result_code: "applied", result_sha256: sha256(afterTests), tests: Object.freeze(tests), activity });
  } catch (error) {
    if (applied) rollback(root);
    const raw = error instanceof ImprovementExecutionError ? error.code : "invalid_patch";
    const code: KiaraResultCode = raw === "tests_failed" ? "tests_failed" : raw === "blocked_scope" ? "blocked_scope" : raw === "blocked_hash_drift" ? "blocked_hash_drift" : "invalid_patch";
    const activity = recordKiara(db, { proposal, approvalId, runId, correlationId, at, code, tests, resultHash: null, baseVerified: true, patchVerified: true });
    return Object.freeze({ mode: "apply", verification: "failed", result_code: code, result_sha256: null, tests: Object.freeze(tests), activity });
  }
}
