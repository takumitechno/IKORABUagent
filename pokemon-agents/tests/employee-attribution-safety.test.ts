import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { classifyActor, type AgentMeta } from "../web/lib/actors";
import { mapThreadsActor } from "../web/lib/agent-role-registry";

const root = resolve(import.meta.dir, "..", "..");
const lookup = new Map<string, AgentMeta>([["hana-heartbeat", {
  slug: "hana-heartbeat", pokemon_slug: "hana", pokemon_jp: "Hana", avatar_url: null,
}]]);

describe("truthful employee attribution and scheduler safety", () => {
  test("Claude subagent name matches never become employee display identities", () => {
    expect(classifyActor({ agent: "hana-heartbeat", transcript_path: "/subagents/agent-1.jsonl" }, lookup))
      .toMatchObject({ kind: "subagent", name: "未帰属 Claude subagent" });
    expect(classifyActor({ agent: "hana-heartbeat", source: "scheduled" }, lookup))
      .toMatchObject({ kind: "subagent", name: "未帰属 Claude subagent" });
    expect(mapThreadsActor("hana-heartbeat")).toMatchObject({ actor_kind: "unknown", agent_id: null });
  });

  test("prompt references to agent files never create employee attribution", () => {
    expect(classifyActor({ prompt: ".claude/agents/hana-heartbeat.md を読む" }, lookup))
      .toMatchObject({ kind: "subagent", name: "未帰属 Claude subagent" });
    const server = readFileSync(resolve(root, "pokemon-agents/web/server.ts"), "utf8");
    expect(server).not.toContain("extractAgentFromPrompt");
  });

  test("projector, monitor and employee runner capabilities remain system actors", () => {
    for (const actor of ["projector", "monitor", "employee runner"]) {
      expect(mapThreadsActor(actor)).toMatchObject({ actor_kind: "system_capability", agent_id: null });
    }
  });

  test("legacy task runner refuses employee identities before Claude and does not chain employee hooks", () => {
    const runner = readFileSync(resolve(root, "pokemon-agents/scripts/run-task.sh"), "utf8");
    expect(runner).toContain("employee_contract_missing");
    expect(runner).toContain("employee_requires_run_employee");
    expect(runner.indexOf("employee_requires_run_employee")).toBeLessThan(runner.indexOf("--dangerously-skip-permissions"));
    expect(runner).toContain("target.source_md_path NOT LIKE '.claude/agents/%'");
    const scheduler = readFileSync(resolve(root, "pokemon-agents/runtime/scheduler-loop.ts"), "utf8");
    expect(scheduler.match(/WHERE data_origin='production'/g)?.length).toBe(2);
    expect(scheduler).not.toMatch(/data_origin IN \([^)]*(?:demo|legacy_unknown)/);
  });
});
