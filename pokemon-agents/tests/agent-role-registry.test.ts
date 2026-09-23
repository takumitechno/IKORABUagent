import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isPublicDashboardPath } from "../web/lib/internal-auth";
import {
  EMPLOYEE_ROLE_REGISTRY,
  FORMAL_EDITORIAL_QA,
  FORMAL_EDITORIAL_WRITER,
  HUMAN_AUTHORITY_CONTRACTS,
  INTERNAL_ACTIVITY_FIELDS,
  TARGET_ORGANIZATION,
  appendInternalActivity,
  createCorrectionActivity,
  createInternalActivity,
  mapThreadsActor,
  serializeInternalActivity,
  validateOrganizationTopology,
  type InternalActivityInput,
} from "../web/lib/agent-role-registry";

const root = resolve(import.meta.dir, "..", "..");

function activityInput(overrides: Partial<InternalActivityInput> = {}): InternalActivityInput {
  return {
    activity_id: "activity-001",
    timestamp: "2026-09-23T12:00:00Z",
    agent_id: null,
    agent_role: null,
    account_id: "acct_alpha",
    action: "evidence_validated",
    evidence_refs: ["source:report-1", "metric:observation-1"],
    decision_status: "not_applicable",
    decision_summary: null,
    next_action_owner: null,
    next_action: null,
    due_at: null,
    confidence_level: "unknown",
    confidence_basis: null,
    sample_size: null,
    result_status: "succeeded",
    artifact_ref: null,
    cycle_id: null,
    experiment_id: null,
    correlation_id: null,
    corrects_activity_id: null,
    ...overrides,
  };
}

describe("formal employee and role registry", () => {
  test("uses the 11 canonical employee IDs exactly once without duplicating Writer into runtime identities", () => {
    const ids = EMPLOYEE_ROLE_REGISTRY.map((entry) => entry.agent_id);
    expect(ids).toHaveLength(11);
    expect(new Set(ids).size).toBe(ids.length);
    const markdownIds = readdirSync(resolve(root, ".claude", "agents"))
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.replace(/\.md$/, ""))
      .sort();
    expect([...ids].sort()).toEqual(markdownIds);
    for (const employee of EMPLOYEE_ROLE_REGISTRY) {
      const source = readFileSync(resolve(root, employee.identity_source), "utf8");
      expect(source).toContain(`name: ${employee.agent_id}`);
      expect(employee.status).toBe("active");
      expect(employee.runnable).toBe(true);
      expect(employee.owns.length).toBeGreaterThan(0);
      expect(employee.does_not_own.length).toBeGreaterThan(0);
      expect(employee.handoff_to.length).toBeGreaterThan(0);
    }
    expect(markdownIds).not.toContain(FORMAL_EDITORIAL_WRITER.agent_id);
  });

  test("formalizes the target organization and inactive locked-brief Writer contract", () => {
    const byName = Object.fromEntries(EMPLOYEE_ROLE_REGISTRY.map((entry) => [entry.display_name, entry]));
    expect(byName.Sashihara.owns).toEqual(expect.arrayContaining(["next_action", "work_ordering", "owner_assignment", "stop_decision"]));
    expect(byName.Shoko.handoff_to).toEqual(["iori-validator"]);
    expect(byName.Maika.owns).toEqual(expect.arrayContaining(["hypothesis", "alternative_hypothesis", "test_design"]));
    expect(byName.Hitomi.owns).toEqual(expect.arrayContaining(["offer_selection", "strategy_selection"]));
    expect(byName.Hana.handoff_to).toEqual(["risa-notifier"]);
    expect(byName.Anna.handoff_to).toContain("human:approval");
    expect(byName.Kiara.owns).toContain("approved_exact_execution");
    expect(TARGET_ORGANIZATION).toEqual({
      leader: "human:ceo",
      chief_operating_editor: "sashihara-orchestrator",
      root_handoff: ["human:ceo", "sashihara-orchestrator"],
      lines: {
        research: ["shoko-reporter", "iori-validator"],
        strategy: ["maika-hypothesizer", "hitomi-selector"],
        editorial: ["editorial-writer", "system:editorial-qa", "human:approval"],
        intelligence: ["mirinya-cost-analyst", "sanatsun-knowledge-editor"],
        operations: ["hana-heartbeat", "risa-notifier"],
        independent_improvement: ["anna-supervisor", "human:approval", "kiara-executor"],
      },
    });
    expect(FORMAL_EDITORIAL_WRITER).toMatchObject({
      agent_id: "editorial-writer", role: "editorial_writer", department: "editorial",
      status: "inactive", runnable: false, identity_source: null,
    });
    expect(FORMAL_EDITORIAL_WRITER.owns).toEqual(["expression_inside_locked_brief"]);
    expect(FORMAL_EDITORIAL_WRITER.does_not_own).toEqual(expect.arrayContaining([
      "offer_selection", "strategy", "test_variable_selection", "self_qa", "human_approval", "publication",
    ]));
    expect(FORMAL_EDITORIAL_WRITER.handoff_to).toEqual(["system:editorial-qa"]);
    expect(FORMAL_EDITORIAL_QA.handoff_to).toEqual(["human:approval"]);
    expect(HUMAN_AUTHORITY_CONTRACTS.ceo.handoff_to).toEqual(["sashihara-orchestrator"]);
    expect(HUMAN_AUTHORITY_CONTRACTS.approval_gate.handoff_to).toEqual(["kiara-executor"]);
    expect(byName.Anna.handoff_to).toEqual(["human:approval"]);
    expect(validateOrganizationTopology()).toBe(true);
    expect(Object.isFrozen(EMPLOYEE_ROLE_REGISTRY)).toBe(true);
    expect(Object.isFrozen(EMPLOYEE_ROLE_REGISTRY[0])).toBe(true);
    expect(Object.isFrozen(EMPLOYEE_ROLE_REGISTRY[0].owns)).toBe(true);
    const schedules = readFileSync(resolve(root, ".claude", "launchd.json"), "utf8");
    expect(schedules).not.toContain("editorial-writer");
  });
});

describe("Threads actor mapping boundary", () => {
  test("maps only exact known identities and keeps functional actors out of employee identity", () => {
    expect(mapThreadsActor("sashihara-orchestrator")).toMatchObject({ actor_kind: "employee", agent_id: "sashihara-orchestrator" });
    expect(mapThreadsActor("Writer")).toMatchObject({ actor_kind: "formal_role", agent_id: "editorial-writer", agent_role: "editorial_writer" });
    expect(mapThreadsActor("Human")).toMatchObject({ actor_kind: "human", agent_id: null, agent_role: "human_approval" });
    for (const actor of ["EditorialRunner", "Editorial Critic", "Performance Learner", "Voice Judge", "Theme Diversity Judge", "Experiment Planner", "QA"]) {
      const mapped = mapThreadsActor(actor);
      expect(mapped.actor_kind).toBe("system_capability");
      expect(mapped.agent_id).toBeNull();
    }
  });

  test("is deterministic and never defaults unknown Threads activity to Sashihara", () => {
    for (const actor of [null, "", "mystery-runner", "Sashihara", "Sashihara-ish", "generic editorial event"]) {
      const first = mapThreadsActor(actor);
      const second = mapThreadsActor(actor);
      expect(first).toEqual(second);
      expect(first.agent_id).not.toBe("sashihara-orchestrator");
      expect(first.actor_kind).toBe("unknown");
    }
  });
});

describe("sanitized append-only internal activity contract", () => {
  test("keeps account scope separate from actor identity and represents unknowns honestly", () => {
    const actor = mapThreadsActor("iori-validator");
    const first = createInternalActivity(activityInput({
      agent_id: actor.agent_id, agent_role: actor.agent_role, account_id: "acct_alpha",
    }));
    const second = createInternalActivity(activityInput({
      activity_id: "activity-002", agent_id: actor.agent_id, agent_role: actor.agent_role,
      account_id: "acct_beta",
    }));
    expect(first.agent_id).toBe(second.agent_id);
    expect(first.agent_role).toBe(second.agent_role);
    expect(first.account_id).not.toBe(second.account_id);
    const unknown = createInternalActivity(activityInput());
    expect(unknown.agent_id).toBeNull();
    expect(unknown.agent_role).toBeNull();
    expect(unknown.decision_summary).toBeNull();
    expect(unknown.evidence_refs).toEqual(["metric:observation-1", "source:report-1"]);
  });

  test("rejects raw reasoning, secret fields, traces, unknown fields and secret-shaped values", () => {
    for (const field of [
      "raw_prompt", "prompt", "chain_of_thought", "hidden_chain_of_thought", "oauth_token",
      "access_token", "api_key", "tool_trace", "provider_trace", "secret_config",
    ]) {
      expect(() => createInternalActivity({ ...activityInput(), [field]: "forbidden" })).toThrow();
      expect(() => createInternalActivity({ ...activityInput(), metadata: { [field]: "forbidden" } })).toThrow();
    }
    expect(() => createInternalActivity(activityInput({ decision_summary: "Authorization: Bearer secret-value" }))).toThrow();
    expect(() => createInternalActivity(activityInput({ evidence_refs: ["source:item?access_token=secret"] }))).toThrow();
    expect(() => createInternalActivity({ ...activityInput(), extra: "not allowed" })).toThrow("unknown fields");
    const accessor = activityInput() as InternalActivityInput & { hidden?: string };
    Object.defineProperty(accessor, "hidden", { get: () => "prompt" });
    expect(() => createInternalActivity(accessor)).toThrow("plain data object");
  });

  test("validates scope, timestamps, canonical roles, confidence and sample size", () => {
    expect(() => createInternalActivity(activityInput({ account_id: "not-an-account" }))).toThrow("account_id");
    expect(() => createInternalActivity(activityInput({ timestamp: "yesterday" }))).toThrow("ISO-8601");
    expect(() => createInternalActivity(activityInput({ sample_size: -1 }))).toThrow("sample_size");
    expect(() => createInternalActivity(activityInput({ confidence_level: "certain" as any }))).toThrow("confidence_level");
    expect(() => createInternalActivity(activityInput({ agent_id: "iori-validator", agent_role: "publisher" }))).toThrow("canonical employee role");
    expect(() => createInternalActivity(activityInput({ agent_id: null, agent_role: "chief_operating_editor" }))).toThrow("canonical agent or system role");
    expect(() => createInternalActivity(activityInput({ next_action_owner: "Sashihara" }))).toThrow("not canonical");
    expect(() => createInternalActivity(activityInput({ correlation_id: "raw trace with spaces" }))).toThrow("correlation_id");
    expect(() => createInternalActivity(activityInput({ evidence_refs: ["https://example.com/item?token=x"] }))).toThrow("opaque reference");
  });

  test("serializes in a fixed order and never serializes for customer routes", () => {
    const source = activityInput();
    const reversed = Object.fromEntries(Object.entries(source).reverse());
    const a = createInternalActivity(source);
    const b = createInternalActivity(reversed);
    expect(serializeInternalActivity(a, "internal")).toBe(serializeInternalActivity(b, "internal"));
    expect(Object.keys(JSON.parse(serializeInternalActivity(a, "internal")))).toEqual(INTERNAL_ACTIVITY_FIELDS);
    expect(Object.isFrozen(a)).toBe(true);
    expect(Object.isFrozen(a.evidence_refs)).toBe(true);
    expect(() => serializeInternalActivity(a, "customer" as "internal")).toThrow("not available to customer routes");
    expect(isPublicDashboardPath("/api/internal/activities")).toBe(false);
    expect(isPublicDashboardPath("/api/customer/activities")).toBe(false);
    const server = readFileSync(resolve(root, "pokemon-agents", "web", "server.ts"), "utf8");
    expect(server).not.toContain('"/api/customer/activities"');
    for (const customerSource of [
      "pokemon-agents/web/routes/overview.ts",
      "pokemon-agents/web/routes/improvement-report.ts",
      "pokemon-agents/web/lib/customer-workspaces.ts",
      "pokemon-agents/web/components/layout.ts",
    ]) {
      expect(readFileSync(resolve(root, customerSource), "utf8")).not.toContain("agent-role-registry");
    }
  });

  test("creates an account-bound correction event without rewriting prior history", () => {
    const original = createInternalActivity(activityInput());
    const originalBytes = serializeInternalActivity(original, "internal");
    const next = activityInput({
      activity_id: "activity-002", timestamp: "2026-09-23T13:00:00Z",
      decision_summary: "corrected_decision_summary", evidence_refs: ["source:report-2"],
    });
    const { account_id: _account, action: _action, corrects_activity_id: _corrects, ...correctionInput } = next;
    const correction = createCorrectionActivity(original, correctionInput);
    expect(correction.activity_id).toBe("activity-002");
    expect(correction.account_id).toBe(original.account_id);
    expect(correction.action).toBe("correction");
    expect(correction.corrects_activity_id).toBe(original.activity_id);
    expect(correction.evidence_refs).toContain(`activity:${original.activity_id}`);
    expect(serializeInternalActivity(original, "internal")).toBe(originalBytes);
    const sameId = { ...correctionInput, activity_id: original.activity_id };
    expect(() => createCorrectionActivity(original, sameId)).toThrow("new activity_id");
  });

  test("appends unique activity IDs and exposes no update or overwrite path", () => {
    const first = appendInternalActivity([], activityInput());
    expect(first).toHaveLength(1);
    expect(Object.isFrozen(first)).toBe(true);
    expect(() => appendInternalActivity(first, activityInput({ decision_summary: "different_payload" })))
      .toThrow("append-only history cannot be overwritten");
    const second = appendInternalActivity(first, activityInput({ activity_id: "activity-002" }));
    expect(second.map((entry) => entry.activity_id)).toEqual(["activity-001", "activity-002"]);
    expect(first).toHaveLength(1);
  });
});
