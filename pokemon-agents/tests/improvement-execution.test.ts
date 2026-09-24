import { Database } from "bun:sqlite";
import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { AGENT_ACTIVITY_LEDGER_MIGRATION_IDS, AGENT_ACTIVITY_LEDGER_SCHEMA_SQL, appendActivity, migrateAgentActivityLedger, registerActivityAccount } from "../web/lib/agent-activity-ledger";
import { runEmployee } from "../web/lib/employee-runner";
import {
  createAnnaProposal, decideImprovementApproval, executeApprovedImprovement, migrateImprovementExecution,
  repositoryIdentity, type AnnaProposalInput,
} from "../web/lib/improvement-execution";

const roots: string[] = [];
const at = "2026-09-24T04:00:00.000Z";
function command(...cmd: string[]): Uint8Array {
  const result = Bun.spawnSync({ cmd, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new Error(new TextDecoder().decode(result.stderr));
  return result.stdout;
}
function fixture(change = "after\n") {
  const root = mkdtempSync(resolve(tmpdir(), "ikorabu-b2a-"));
  roots.push(root);
  const main = resolve(root, "main");
  const worktree = resolve(root, "worktree");
  command("git", "init", "-b", "main", main);
  command("git", "-C", main, "config", "user.email", "test@example.invalid");
  command("git", "-C", main, "config", "user.name", "Test");
  command("git", "-C", main, "config", "core.autocrlf", "false");
  writeFileSync(resolve(main, "target.txt"), "before\n");
  writeFileSync(resolve(main, "other.txt"), "other\n");
  command("git", "-C", main, "add", ".");
  command("git", "-C", main, "commit", "-m", "base");
  command("git", "-C", main, "worktree", "add", "-b", "change", worktree, "HEAD");
  const base = new TextDecoder().decode(command("git", "-C", worktree, "rev-parse", "HEAD")).trim();
  writeFileSync(resolve(worktree, "target.txt"), change);
  const patch = command("git", "-C", worktree, "diff", "--binary", "--no-ext-diff", "--full-index", "--", "target.txt");
  command("git", "-C", worktree, "restore", "target.txt");
  const db = new Database(":memory:", { strict: true });
  migrateImprovementExecution(db);
  registerActivityAccount(db, "acct_takumi_hq", "source:operator:b2a-test");
  const input: AnnaProposalInput = {
    improvementId: "improvement:b2a-1", proposalRunId: "run:anna-b2a-1", scope: "acct_takumi_hq",
    targetRef: repositoryIdentity(worktree), worktree, baseCommitSha: base, patch, allowedPaths: ["target.txt"],
    tests: ["git:diff-check"], riskClass: "human_gate", reasonEvidenceRefs: ["source:audit:b2a"],
    createdAt: at, correlationId: "corr:b2a-1",
  };
  return { root, main, worktree, base, patch, db, input };
}
function approve(f: ReturnType<typeof fixture>) {
  createAnnaProposal(f.db, { ...f.input, apply: true });
  return decideImprovementApproval(f.db, "approval:improvement:b2a-1", "approved", "human:tom", at);
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("Anna -> Human -> Kiara exact improvement contract", () => {
  test("persists immutable proposal/artifact and packet-bound Anna activity", () => {
    const f = fixture();
    const proposal = createAnnaProposal(f.db, { ...f.input, apply: true });
    expect(proposal.base_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(proposal.patch_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(f.db.query<{ agent_id: string; run_ref: string }, []>("SELECT agent_id,run_ref FROM agent_activity_ledger").get())
      .toEqual({ agent_id: "anna-supervisor", run_ref: "run:anna-b2a-1" });
    expect(() => f.db.query("UPDATE improvement_proposals SET risk_class='auto_apply'").run()).toThrow("append-only");
    expect(() => f.db.query("DELETE FROM improvement_patch_artifacts").run()).toThrow("append-only");
    expect(readFileSync(resolve(f.worktree, "target.txt"), "utf8")).toBe("before\n");
    f.db.close();
  });

  test("approval is byte-bound, idempotent, immutable, and changes no target bytes", () => {
    const f = fixture();
    createAnnaProposal(f.db, { ...f.input, apply: true });
    const before = readFileSync(resolve(f.worktree, "target.txt"));
    const first = decideImprovementApproval(f.db, "approval:improvement:b2a-1", "approved", "human:tom", at);
    expect(decideImprovementApproval(f.db, first.approval_id, "approved", "human:tom", "2026-09-24T05:00:00.000Z")).toEqual(first);
    expect(() => decideImprovementApproval(f.db, first.approval_id, "rejected", "human:tom", at)).toThrow("APPROVAL_REPLAY_CONFLICT");
    expect(() => f.db.query("UPDATE improvement_approval_requests SET patch_sha256=?").run("0".repeat(64))).toThrow("append-only");
    expect(readFileSync(resolve(f.worktree, "target.txt"))).toEqual(before);
    f.db.close();
  });

  test("rejects traversal, scope expansion, arbitrary tests, wrong base, and invalid patch", () => {
    const f = fixture();
    expect(() => createAnnaProposal(f.db, { ...f.input, allowedPaths: ["../target.txt"] })).toThrow("blocked_scope");
    expect(() => createAnnaProposal(f.db, { ...f.input, allowedPaths: ["other.txt"] })).toThrow("blocked_scope");
    expect(() => createAnnaProposal(f.db, { ...f.input, tests: ["bun test; rm -rf ."] })).toThrow("TEST_COMMAND_INVALID");
    expect(() => createAnnaProposal(f.db, { ...f.input, baseCommitSha: "0".repeat(64) })).toThrow("blocked_hash_drift");
    expect(() => createAnnaProposal(f.db, { ...f.input, patch: "not a diff\n" })).toThrow("invalid_patch");
    f.db.close();
  });

  test("blocks Kiara without Human approval", () => {
    const f = fixture();
    createAnnaProposal(f.db, { ...f.input, apply: true });
    expect(() => executeApprovedImprovement(f.db, {
      approvalId: "approval:improvement:b2a-1", worktree: f.worktree, runId: "run:kiara-1", correlationId: "corr:kiara-1", at,
    })).toThrow("approval_missing");
    expect(readFileSync(resolve(f.worktree, "target.txt"), "utf8")).toBe("before\n");
    f.db.close();
  });

  test("dry-run verifies exact bytes without mutation; apply leaves only the approved staged diff", () => {
    const f = fixture();
    approve(f);
    const dry = executeApprovedImprovement(f.db, {
      approvalId: "approval:improvement:b2a-1", worktree: f.worktree, runId: "run:kiara-dry", correlationId: "corr:kiara-dry", at,
    });
    expect(dry).toMatchObject({ mode: "dry-run", verification: "passed", result_code: null, activity: null });
    expect(readFileSync(resolve(f.worktree, "target.txt"), "utf8")).toBe("before\n");
    const applied = executeApprovedImprovement(f.db, {
      approvalId: "approval:improvement:b2a-1", worktree: f.worktree, runId: "run:kiara-apply", correlationId: "corr:kiara-apply", at, apply: true,
    });
    expect(applied).toMatchObject({ mode: "apply", verification: "passed", result_code: "applied" });
    expect(readFileSync(resolve(f.worktree, "target.txt"), "utf8")).toBe("after\n");
    expect(command("git", "-C", f.worktree, "diff", "--cached", "--binary", "--no-ext-diff", "--full-index", "--", "target.txt"))
      .toEqual(f.patch);
    expect(f.db.query<{ agent_id: string; run_ref: string }, []>("SELECT agent_id,run_ref FROM agent_activity_ledger WHERE agent_id='kiara-executor'").get())
      .toEqual({ agent_id: "kiara-executor", run_ref: "run:kiara-apply" });
    f.db.close();
  });

  test("test failure fully rolls back the isolated worktree and records a reverted employee result", () => {
    const f = fixture("after with trailing whitespace   \n");
    approve(f);
    const result = executeApprovedImprovement(f.db, {
      approvalId: "approval:improvement:b2a-1", worktree: f.worktree, runId: "run:kiara-fail", correlationId: "corr:kiara-fail", at, apply: true,
    });
    expect(result).toMatchObject({ verification: "failed", result_code: "tests_failed" });
    expect(readFileSync(resolve(f.worktree, "target.txt"), "utf8")).toBe("before\n");
    expect(new TextDecoder().decode(command("git", "-C", f.worktree, "status", "--porcelain=v1", "--untracked-files=all", "--ignored")).trim()).toBe("");
    expect(f.db.query<{ result_code: string }, []>("SELECT result_code FROM improvement_execution_results").get()!.result_code).toBe("tests_failed");
    f.db.close();
  });

  test("hash drift and extra pre-existing changes fail before execution", () => {
    const f = fixture();
    approve(f);
    writeFileSync(resolve(f.worktree, "other.txt"), "dirty\n");
    expect(executeApprovedImprovement(f.db, {
      approvalId: "approval:improvement:b2a-1", worktree: f.worktree, runId: "run:kiara-drift", correlationId: "corr:kiara-drift", at, apply: true,
    })).toMatchObject({ verification: "failed", result_code: "blocked_scope" });
    expect(readFileSync(resolve(f.worktree, "target.txt"), "utf8")).toBe("before\n");
    f.db.close();
  });

  test("wrong patch bytes and a stale clean HEAD are blocked before apply", () => {
    const corrupt = fixture();
    approve(corrupt);
    corrupt.db.exec("DROP TRIGGER improvement_patch_artifacts_no_update");
    corrupt.db.query("UPDATE improvement_patch_artifacts SET patch_bytes=?").run(new TextEncoder().encode("not approved\n"));
    expect(executeApprovedImprovement(corrupt.db, {
      approvalId: "approval:improvement:b2a-1", worktree: corrupt.worktree, runId: "run:kiara-corrupt", correlationId: "corr:kiara-corrupt", at,
      apply: true,
    })).toMatchObject({ verification: "failed", result_code: "blocked_hash_drift" });
    expect(readFileSync(resolve(corrupt.worktree, "target.txt"), "utf8")).toBe("before\n");
    corrupt.db.close();

    const stale = fixture();
    approve(stale);
    writeFileSync(resolve(stale.worktree, "other.txt"), "new base\n");
    command("git", "-C", stale.worktree, "add", "other.txt");
    command("git", "-C", stale.worktree, "commit", "-m", "advance base");
    expect(executeApprovedImprovement(stale.db, {
      approvalId: "approval:improvement:b2a-1", worktree: stale.worktree, runId: "run:kiara-stale", correlationId: "corr:kiara-stale", at,
      apply: true,
    })).toMatchObject({ verification: "failed", result_code: "blocked_hash_drift" });
    expect(readFileSync(resolve(stale.worktree, "target.txt"), "utf8")).toBe("before\n");
    stale.db.close();
  });

  test("employee truth still requires a persisted matching run packet and no provider path exists", () => {
    const f = fixture();
    expect(() => appendActivity(f.db, {
      activity_id: "fake-anna", timestamp: at, agent_id: "anna-supervisor", agent_role: "improvement_supervisor",
      account_id: "acct_takumi_hq", action: "improvement_proposed", evidence_refs: ["source:test:fake"], decision_status: "pending",
      decision_summary: "decision_pending", next_action_owner: "human:approval", next_action: "human_gate_required", due_at: null,
      confidence_level: "high", confidence_basis: "evidence_verified", sample_size: 1, result_status: "succeeded", artifact_ref: null,
      cycle_id: null, experiment_id: null, correlation_id: "corr:fake", corrects_activity_id: null,
    })).toThrow("employee runner");
    const source = readFileSync(new URL("../web/lib/improvement-execution.ts", import.meta.url), "utf8");
    const cli = readFileSync(new URL("../scripts/run-kiara.ts", import.meta.url), "utf8");
    const review = readFileSync(new URL("../scripts/review-improvement.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/anthropic|openai|claude|fetch\s*\(|webhook|notify-discord/i);
    expect(cli).not.toMatch(/anthropic|openai|claude|fetch\s*\(|webhook|notify-discord|setInterval/i);
    expect(cli).toContain('args.includes("--apply")');
    expect(cli).not.toMatch(/\b(?:commit|merge|push)\b.*Bun\.spawn/i);
    expect(review).not.toMatch(/writeFile|git\s|Bun\.spawn|executeApprovedImprovement|run-kiara/i);
    f.db.close();
  });

  test("B1 migration and Hana/Risa packet constraints remain valid", () => {
    const db = new Database(":memory:", { strict: true });
    expect(migrateAgentActivityLedger(db)).toBe(true);
    expect(migrateImprovementExecution(db)).toBe(true);
    expect(migrateImprovementExecution(db)).toBe(false);
    expect(() => db.query(`INSERT INTO employee_run_packets
      (run_id,agent_id,role,account_id,task_ref,correlation_id,implementation_type,started_at,ended_at,input_packet_refs,output_packet,packet_sha256,schema_version,decision_status,result_status,evidence_refs)
      VALUES ('fake','anna-supervisor','wrong','acct_takumi_hq','source:x','corr:x','deterministic_anna_contract',?,?, '[]','{}',?,'employee-run.v1','pending','succeeded','[]')`)
      .run(at, at, "a".repeat(64))).toThrow();
    db.close();
  });

  test("upgrades a populated B1 packet table without losing its run/activity binding", () => {
    const db = new Database(":memory:", { strict: true });
    db.exec("PRAGMA foreign_keys=ON; CREATE TABLE schema_migrations(version TEXT PRIMARY KEY)");
    const oldSchema = AGENT_ACTIVITY_LEDGER_SCHEMA_SQL
      .replace(",'deterministic_anna_contract','deterministic_kiara'", "")
      .replace("\n  OR (NEW.agent_id='anna-supervisor' AND json_extract(NEW.output_packet, '$.schema_version') IS NOT 'anna-proposal-output.v1')", "")
      .replace("\n  OR (NEW.agent_id='kiara-executor' AND json_extract(NEW.output_packet, '$.schema_version') IS NOT 'kiara-execution-output.v1')", "");
    db.exec(oldSchema);
    for (const version of AGENT_ACTIVITY_LEDGER_MIGRATION_IDS) db.query("INSERT INTO schema_migrations VALUES (?)").run(version);
    registerActivityAccount(db, "acct_takumi_hq", "source:operator:upgrade-test");
    runEmployee(db, {
      agentId: "hana-heartbeat", scope: "acct_takumi_hq", runId: "run:hana-upgrade", taskRef: "source:test:upgrade",
      correlationId: "corr:hana-upgrade", startedAt: at, endedAt: at, inputPacketRefs: ["source:test:upgrade"], apply: true,
      input: { schema_version: "monitor-findings.v1", scope: "acct_takumi_hq", findings: [{
        check_code: "bridge_health", observed: "present", age_minutes: 1, tolerance_minutes: 5,
        delayed_window_minutes: 10, block_reason: null, evidence_ref: "source:test:bridge",
      }] },
    });
    expect(migrateImprovementExecution(db)).toBe(true);
    expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM employee_run_packets WHERE run_id='run:hana-upgrade'").get()!.n).toBe(1);
    expect(db.query<{ run_ref: string }, []>("SELECT run_ref FROM agent_activity_ledger WHERE agent_id='hana-heartbeat'").get()!.run_ref).toBe("run:hana-upgrade");
    expect(db.query<Record<string, unknown>, []>("PRAGMA foreign_key_check").all()).toEqual([]);
    db.close();
  });
});
