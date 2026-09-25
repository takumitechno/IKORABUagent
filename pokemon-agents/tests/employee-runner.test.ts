import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { appendEmployeeActivity, migrateAgentActivityLedger, registerActivityAccount } from "../web/lib/agent-activity-ledger";
import {
  INTERNAL_HQ_SCOPE, classifyHanaFinding, runEmployee, runHana, runRisa,
  type EmployeeRunOptions, type HanaOutputPacket, type MonitorFindingInput,
} from "../web/lib/employee-runner";

const root = resolve(import.meta.dir, "..", "..");
const at = "2026-09-24T03:00:00.000Z";

function db(): Database {
  const database = new Database(":memory:");
  database.exec("PRAGMA foreign_keys=ON");
  migrateAgentActivityLedger(database);
  registerActivityAccount(database, INTERNAL_HQ_SCOPE, "source:operator:hq-fixture");
  return database;
}

function finding(overrides: Partial<MonitorFindingInput> = {}): MonitorFindingInput {
  return {
    check_code: "insights_freshness", observed: "present", age_minutes: 10,
    tolerance_minutes: 30, delayed_window_minutes: 60, block_reason: null,
    evidence_ref: "source:monitor:insights", ...overrides,
  };
}

function hanaInput(findings: readonly MonitorFindingInput[] = [finding()]) {
  return { schema_version: "monitor-findings.v1", scope: INTERNAL_HQ_SCOPE, findings };
}

function options(overrides: Partial<EmployeeRunOptions> = {}): EmployeeRunOptions {
  return {
    agentId: "hana-heartbeat", scope: INTERNAL_HQ_SCOPE, input: hanaInput(),
    runId: "run:hana-1", taskRef: "source:test:hana-1", correlationId: "corr:hana-1",
    startedAt: at, endedAt: at, inputPacketRefs: ["source:monitor:snapshot-1"], ...overrides,
  };
}

describe("B1 deterministic employee runner", () => {
  test("classifies Hana findings deterministically and treats unreadable or unknown as missing", () => {
    expect(classifyHanaFinding(finding())).toBe("ok");
    expect(classifyHanaFinding(finding({ age_minutes: 45 }))).toBe("delayed");
    expect(classifyHanaFinding(finding({ observed: "unreadable", age_minutes: null }))).toBe("missing");
    expect(classifyHanaFinding(finding({ observed: "unknown", age_minutes: null }))).toBe("missing");
    expect(classifyHanaFinding(finding({ block_reason: "reauth_required" }))).toBe("blocked");
    const output = runHana(hanaInput([
      finding(), finding({ check_code: "editorial_freshness", age_minutes: 45 }),
      finding({ check_code: "activity_projection_freshness", observed: "unknown", age_minutes: null }),
      finding({ check_code: "oauth_readiness", block_reason: "reauth_required" }),
    ]));
    expect(output.findings.map((row) => row.status)).toEqual(["ok", "delayed", "missing", "blocked"]);
    expect(JSON.stringify(output)).not.toMatch(/message|detail|free.text/i);
  });

  test("makes bounded Risa send, suppress and escalation decisions without transport", () => {
    const delayed = runHana(hanaInput([finding({ age_minutes: 45 })]));
    const input = { schema_version: "risa-input.v1", scope: INTERNAL_HQ_SCOPE, hana_packet: delayed,
      decided_at: at, occurrence_count: 1, prior_decisions: [] };
    const send = runRisa(input);
    expect(send).toMatchObject({ decision: "send", recipient: "sashihara-orchestrator", severity: "warning" });
    expect(runRisa({ ...input, prior_decisions: [{ dedupe_key: send.dedupe_key, decided_at: at }] }).decision).toBe("suppress");
    expect(runRisa({ ...input, occurrence_count: 3 })).toMatchObject({ decision: "escalate", recipient: "human:ceo" });
    const critical = runHana(hanaInput([finding({ check_code: "bridge_health", block_reason: "dependency" })]));
    expect(runRisa({ ...input, hana_packet: critical })).toMatchObject({ decision: "escalate", recipient: "human:ceo", severity: "critical" });
    const healthy = runHana(hanaInput());
    expect(runRisa({ ...input, hana_packet: healthy })).toMatchObject({ decision: "suppress", severity: "info" });
  });

  test("dry-run writes nothing; apply atomically stores a packet-bound employee row", () => {
    const database = db();
    const dry = runEmployee(database, options());
    expect(dry.persisted).toBe(false);
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM employee_run_packets").get()!.n).toBe(0);
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_ledger").get()!.n).toBe(0);

    const applied = runEmployee(database, options({ apply: true }));
    expect(applied.activity).toMatchObject({ actor_type: "employee", agent_id: "hana-heartbeat", run_ref: "run:hana-1" });
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM employee_run_packets").get()!.n).toBe(1);
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_ledger WHERE actor_type='employee'").get()!.n).toBe(1);
    expect(() => database.query("UPDATE employee_run_packets SET role='x' WHERE run_id='run:hana-1'").run()).toThrow("append-only");
    expect(() => database.query("DELETE FROM employee_run_packets WHERE run_id='run:hana-1'").run()).toThrow("append-only");
    database.close();
  });

  test("persists a Risa decision without invoking notification transport", () => {
    const database = db();
    const hana = runHana(hanaInput([finding({ age_minutes: 45 })]));
    const applied = runEmployee(database, options({
      agentId: "risa-notifier", runId: "run:risa-1", correlationId: "corr:risa-1", apply: true,
      input: { schema_version: "risa-input.v1", scope: INTERNAL_HQ_SCOPE, hana_packet: hana,
        decided_at: at, occurrence_count: 1, prior_decisions: [] },
    }));
    expect(applied.packet.output_packet).toMatchObject({ decision: "send", recipient: "sashihara-orchestrator" });
    expect(applied.activity).toMatchObject({ agent_id: "risa-notifier", action: "notification_decided" });
    database.close();
  });

  test("exact replay is idempotent and conflicting replay fails", () => {
    const database = db();
    runEmployee(database, options({ apply: true }));
    expect(runEmployee(database, options({ apply: true })).replayed).toBe(true);
    expect(() => runEmployee(database, options({ apply: true, input: hanaInput([finding({ age_minutes: 45 })]) })))
      .toThrow("RUN_REPLAY_CONFLICT");
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM employee_run_packets").get()!.n).toBe(1);
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_ledger WHERE actor_type='employee'").get()!.n).toBe(1);
    database.close();
  });

  test("bad schemas record only a sanitized system failure", () => {
    const database = db();
    expect(() => runEmployee(database, options({ apply: true, input: { scope: INTERNAL_HQ_SCOPE } }))).toThrow("HANA_INPUT_SCHEMA_INVALID");
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM employee_run_packets").get()!.n).toBe(0);
    const rows = database.query<{ actor_type: string; agent_role: string; action: string }, []>("SELECT actor_type,agent_role,action FROM agent_activity_ledger").all();
    expect(rows).toEqual([{ actor_type: "system_capability", agent_role: "employee_runner", action: "employee_run_failed" }]);
    database.close();
  });

  test("rejects run, role and cross-scope mismatches at service and database boundaries", () => {
    const database = db();
    const applied = runEmployee(database, options({ apply: true }));
    expect(() => runEmployee(database, options({ scope: "acct_customer", runId: "run:cross" }))).toThrow("INTERNAL_SCOPE_REQUIRED");
    expect(() => appendEmployeeActivity(database, {
      ...applied.activity, actor_type: undefined, run_ref: undefined, created_at: undefined,
      activity_id: "emp:mismatch", agent_id: "risa-notifier", agent_role: "notification_policy_owner",
    }, "run:hana-1")).toThrow();
    database.close();
  });

  test("contains no provider, transport, scheduler, rerun or restart path", () => {
    const runner = readFileSync(resolve(root, "pokemon-agents/web/lib/employee-runner.ts"), "utf8");
    const cli = readFileSync(resolve(root, "pokemon-agents/scripts/run-employee.ts"), "utf8");
    expect(runner).not.toMatch(/\bclaude\b|anthropic|openai|fetch\s*\(|Bun\.spawn|child_process|notify-discord|webhook/i);
    expect(cli).not.toMatch(/\bclaude\b|anthropic|openai|fetch\s*\(|Bun\.spawn|notify-discord|webhook|setInterval/i);
    expect(cli).toContain('const scope = value(args, "--scope")');
    expect(cli).toContain('args.includes("--apply")');
    expect(cli).not.toMatch(/registerActivityAccount|agent_schedules|task_completion_hooks/);
  });
});
