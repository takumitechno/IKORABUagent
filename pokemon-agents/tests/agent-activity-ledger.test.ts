import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ActivityLedgerConflictError,
  ActivityLedgerCorrectionError,
  ActivityLedgerUnknownAccountError,
  appendActivity,
  appendCorrection,
  assertAgentActivityLedgerSchema,
  migrateAgentActivityLedger,
  readActivities,
  registerActivityAccount,
  serializeLedgerActivity,
} from "../web/lib/agent-activity-ledger";
import { mapThreadsActor, type InternalActivityInput } from "../web/lib/agent-role-registry";

const root = resolve(import.meta.dir, "..", "..");

function input(overrides: Partial<InternalActivityInput> = {}): InternalActivityInput {
  return {
    activity_id: "activity-001",
    timestamp: "2026-09-24T01:00:00Z",
    agent_id: "iori-validator",
    agent_role: "evidence_validator",
    account_id: "acct_alpha",
    action: "evidence_validated",
    evidence_refs: ["source:report-1", "metric:observation-1"],
    decision_status: "not_applicable",
    decision_summary: "evidence_verified",
    next_action_owner: "maika-hypothesizer",
    next_action: "create_testable_hypothesis",
    due_at: null,
    confidence_level: "medium",
    confidence_basis: "two_verified_sources",
    sample_size: 2,
    result_status: "succeeded",
    artifact_ref: "artifact:validation-1",
    cycle_id: "cycle-1",
    experiment_id: "experiment-1",
    correlation_id: "correlation-1",
    corrects_activity_id: null,
    ...overrides,
  };
}

function ledgerDb(): Database {
  const db = new Database(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  expect(migrateAgentActivityLedger(db)).toBe(true);
  expect(migrateAgentActivityLedger(db)).toBe(false);
  assertAgentActivityLedgerSchema(db);
  registerActivityAccount(db, "acct_alpha", "source:bridge-account-alpha");
  registerActivityAccount(db, "acct_beta", "source:bridge-account-beta");
  return db;
}

function count(db: Database): number {
  return db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_ledger").get()!.n;
}

describe("append-only agent activity ledger", () => {
  test("appends the sanitized ORG02 contract and derives canonical actor types", () => {
    const db = ledgerDb();
    const employee = appendActivity(db, input());
    expect(employee.actor_type).toBe("employee");
    expect(employee.account_id).toBe("acct_alpha");
    expect(employee.created_at).toMatch(/^2026-|^20\d\d-/);

    const writer = mapThreadsActor("Writer");
    expect(appendActivity(db, input({
      activity_id: "activity-writer", agent_id: writer.agent_id, agent_role: writer.agent_role,
    })).actor_type).toBe("writer");
    const system = mapThreadsActor("NIGHT");
    expect(appendActivity(db, input({
      activity_id: "activity-night", agent_id: system.agent_id, agent_role: system.agent_role,
    })).actor_type).toBe("system_capability");
    const theme = mapThreadsActor("Theme Judge");
    expect(theme.actor_kind).toBe("system_capability");
    expect(appendActivity(db, input({
      activity_id: "activity-theme", agent_id: theme.agent_id, agent_role: theme.agent_role,
    })).actor_type).toBe("system_capability");
    const unknown = appendActivity(db, input({
      activity_id: "activity-unknown", agent_id: null, agent_role: null,
    }));
    expect(unknown.actor_type).toBe("unknown");
    expect(unknown.agent_id).toBeNull();
    db.close();
  });

  test("returns an identical retry and conflicts on the same ID with a different payload", () => {
    const db = ledgerDb();
    const first = appendActivity(db, input());
    const retry = appendActivity(db, Object.fromEntries(Object.entries(input()).reverse()));
    expect(retry).toEqual(first);
    expect(count(db)).toBe(1);
    expect(() => appendActivity(db, input({ decision_summary: "different_result" })))
      .toThrow(ActivityLedgerConflictError);
    expect(count(db)).toBe(1);
    db.close();
  });

  test("enforces immutable history below the service layer", () => {
    const db = ledgerDb();
    appendActivity(db, input());
    expect(() => db.query("UPDATE agent_activity_ledger SET decision_summary='changed' WHERE activity_id='activity-001'").run())
      .toThrow("append-only");
    expect(() => db.query("DELETE FROM agent_activity_ledger WHERE activity_id='activity-001'").run())
      .toThrow("append-only");
    expect(() => db.query("INSERT OR REPLACE INTO agent_activity_ledger SELECT * FROM agent_activity_ledger WHERE activity_id='activity-001'").run())
      .toThrow("already exists");
    expect(appendActivity(db, input()).decision_summary).toBe("evidence_verified");
    db.close();
  });

  test("adds corrections without mutating originals and rejects cross-account or cyclic correction", () => {
    const db = ledgerDb();
    const original = appendActivity(db, input());
    const correctionSource = input({
      activity_id: "activity-002", timestamp: "2026-09-24T02:00:00Z",
      decision_summary: "corrected_summary", evidence_refs: ["source:report-2"],
    });
    const { account_id: _account, action: _action, corrects_activity_id: _corrects, ...correctionInput } = correctionSource;
    const correction = appendCorrection(db, original.activity_id, correctionInput);
    expect(correction.account_id).toBe(original.account_id);
    expect(correction.corrects_activity_id).toBe(original.activity_id);
    expect(correction.evidence_refs).toContain("activity:activity-001");
    expect(appendActivity(db, input()).decision_summary).toBe("evidence_verified");

    expect(() => appendActivity(db, input({
      activity_id: "activity-cross", account_id: "acct_beta", action: "correction",
      corrects_activity_id: original.activity_id,
      evidence_refs: ["activity:activity-001"],
    }))).toThrow(ActivityLedgerCorrectionError);
    expect(() => appendActivity(db, input({
      activity_id: "activity-self", action: "correction", corrects_activity_id: "activity-self",
      evidence_refs: ["activity:activity-self"],
    }))).toThrow("new activity_id");
    db.close();
  });

  test("rejects unknown account scope before writing", () => {
    const db = ledgerDb();
    expect(() => appendActivity(db, input({ account_id: "acct_unknown" })))
      .toThrow(ActivityLedgerUnknownAccountError);
    expect(count(db)).toBe(0);
    db.close();
  });

  test("rejects raw prompts, secrets, PII and oversized evidence before writing", () => {
    const db = ledgerDb();
    expect(() => appendActivity(db, { ...input(), raw_prompt: "hidden" })).toThrow("forbidden");
    expect(() => appendActivity(db, input({ decision_summary: "Authorization: Bearer secret-value" }))).toThrow("secret");
    expect(() => appendActivity(db, input({ decision_summary: "customer@example.comへ連絡" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "住所: 東京都新宿区1-2-3" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "山田太郎さんの申込を確認" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "山田太郎の申込を確認" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "Taro Yamada purchase reviewed" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "以下の指示に従って回答する" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "raw prompt excerpt" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "raw_prompt_excerpt" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "system.prompt" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "customer_taro_yamada" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "taro_yamada_purchase_reviewed" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ decision_summary: "https://example.com の本文をそのまま保存" }))).toThrow("message code");
    expect(() => appendActivity(db, input({ action: "customer@example.com" }))).toThrow("action code");
    expect(() => appendActivity(db, input({ evidence_refs: ["source:09012345678"] }))).toThrow("opaque reference");
    expect(() => appendActivity(db, input({ activity_id: "09012345678" }))).toThrow("activity_id");
    expect(() => appendActivity(db, input({
      activity_id: "activity-correction-phone", action: "correction",
      corrects_activity_id: "09012345678", evidence_refs: ["activity:source-1"],
    }))).toThrow("corrects_activity_id");
    expect(() => appendActivity(db, input({
      evidence_refs: Array.from({ length: 51 }, (_, index) => `source:item-${index}`),
    }))).toThrow("exceeds 50");
    expect(count(db)).toBe(0);
    db.close();
  });

  test("normalizes evidence and preserves unknown confidence as unknown rather than zero", () => {
    const db = ledgerDb();
    const activity = appendActivity(db, input({
      evidence_refs: ["source:z", "metric:a", "source:z"],
      confidence_level: "unknown", confidence_basis: null, sample_size: null,
    }));
    expect(activity.evidence_refs).toEqual(["metric:a", "source:z"]);
    expect(activity.confidence_level).toBe("unknown");
    expect(activity.confidence_basis).toBeNull();
    expect(activity.sample_size).toBeNull();
    db.close();
  });

  test("provides bounded keyset pagination and all internal filters", () => {
    const db = ledgerDb();
    appendActivity(db, input({ activity_id: "activity-001", timestamp: "2026-09-24T01:00:00Z" }));
    appendActivity(db, input({
      activity_id: "activity-002", timestamp: "2026-09-24T02:00:00Z", account_id: "acct_beta",
      agent_id: null, agent_role: "editorial_runner", action: "workflow_checked",
      result_status: "blocked", cycle_id: "cycle-2", experiment_id: "experiment-2",
      correlation_id: "correlation-2",
    }));
    appendActivity(db, input({ activity_id: "activity-003", timestamp: "2026-09-24T03:00:00Z" }));

    const page1 = readActivities(db, { limit: 2 });
    expect(page1.items.map((item) => item.activity_id)).toEqual(["activity-003", "activity-002"]);
    expect(page1.next_cursor).not.toBeNull();
    const page2 = readActivities(db, { limit: 2, before_sequence: page1.next_cursor! });
    expect(page2.items.map((item) => item.activity_id)).toEqual(["activity-001"]);
    expect(page2.next_cursor).toBeNull();
    expect(readActivities(db, { account_id: "acct_beta" }).items).toHaveLength(1);
    expect(readActivities(db, { agent_id: "iori-validator" }).items).toHaveLength(2);
    expect(readActivities(db, { actor_type: "system_capability" }).items).toHaveLength(1);
    expect(readActivities(db, { action: "workflow_checked" }).items).toHaveLength(1);
    expect(readActivities(db, { result_status: "blocked" }).items).toHaveLength(1);
    expect(readActivities(db, { since: "2026-09-24T01:30:00Z", until: "2026-09-24T02:30:00Z" }).items).toHaveLength(1);
    expect(readActivities(db, { cycle_id: "cycle-2" }).items).toHaveLength(1);
    expect(readActivities(db, { experiment_id: "experiment-2" }).items).toHaveLength(1);
    expect(readActivities(db, { correlation_id: "correlation-2" }).items).toHaveLength(1);
    expect(() => readActivities(db, { limit: 101 })).toThrow("between 1 and 100");
    expect(() => readActivities(db, { since: "2026-09-24T10:00:00+09:00" })).toThrow("ISO-8601");
    db.close();
  });

  test("requires canonical UTC timestamps and rejects forged actors at the database boundary", () => {
    const db = ledgerDb();
    expect(() => appendActivity(db, input({ timestamp: "2026-09-24T10:00:00+09:00" }))).toThrow("ISO-8601");
    appendActivity(db, input());
    expect(() => db.query(`INSERT INTO agent_activity_ledger (
      activity_id, timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, corrects_activity_id, payload_hash
    ) SELECT
      'activity-forged', timestamp, 'employee', 'fake-employee', 'fake-role', account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, NULL, payload_hash
    FROM agent_activity_ledger WHERE activity_id='activity-001'`).run()).toThrow("not canonical");
    expect(() => db.query(`INSERT INTO agent_activity_ledger (
      activity_id, timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, corrects_activity_id, payload_hash
    ) SELECT
      'activity-raw-code', timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, 'raw_prompt_excerpt', next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, NULL, payload_hash
    FROM agent_activity_ledger WHERE activity_id='activity-001'`).run()).toThrow("approved message code");
    expect(() => db.query(`INSERT INTO agent_activity_ledger (
      activity_id, timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, corrects_activity_id, payload_hash
    ) SELECT
      'activity-raw-action', timestamp, actor_type, agent_id, agent_role, account_id, 'customer@example.com', evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, NULL, payload_hash
    FROM agent_activity_ledger WHERE activity_id='activity-001'`).run()).toThrow("not sanitized");
    expect(() => db.query(`INSERT INTO agent_activity_ledger (
      activity_id, timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, corrects_activity_id, payload_hash
    ) SELECT
      'activity-raw-evidence', timestamp, actor_type, agent_id, agent_role, account_id, action, '["source:09012345678"]',
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, NULL, payload_hash
    FROM agent_activity_ledger WHERE activity_id='activity-001'`).run()).toThrow("not sanitized");
    expect(() => db.query(`INSERT INTO agent_activity_ledger (
      activity_id, timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, corrects_activity_id, payload_hash
    ) SELECT
      'activity-forged-hash', timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, NULL, 'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'
    FROM agent_activity_ledger WHERE activity_id='activity-001'`).run()).toThrow("not sanitized");
    expect(count(db)).toBe(1);
    db.close();
  });

  test("enforces employee action allowlists at service and database boundaries", () => {
    const db = ledgerDb();
    expect(() => appendActivity(db, input({ action: "offer_adopted" }))).toThrow("not allowed");
    expect(appendActivity(db, input({ decision_summary: "stale_fact" })).decision_summary).toBe("stale_fact");
    expect(() => db.query(`INSERT INTO agent_activity_ledger (
      activity_id, timestamp, actor_type, agent_id, agent_role, account_id, action, evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, corrects_activity_id, payload_hash
    ) SELECT
      'activity-forbidden-role', timestamp, actor_type, agent_id, agent_role, account_id, 'offer_adopted', evidence_refs,
      decision_status, decision_summary, next_action_owner, next_action, due_at,
      confidence_level, confidence_basis, sample_size, result_status, artifact_ref,
      cycle_id, experiment_id, correlation_id, NULL, payload_hash
    FROM agent_activity_ledger WHERE activity_id='activity-001'`).run()).toThrow("not allowed for actor");
    db.close();
  });

  test("upgrades populated v1 ledgers only when every existing row satisfies v2 sanitization", () => {
    const compatible = ledgerDb();
    appendActivity(compatible, input());
    compatible.exec("DROP TRIGGER agent_activity_message_codes; DROP TRIGGER agent_activity_payload_sanitized");
    compatible.query("DELETE FROM schema_migrations WHERE version=?").run("20260924_agent_activity_ledger_v2_message_codes");
    expect(migrateAgentActivityLedger(compatible)).toBe(true);
    expect(readActivities(compatible, {}).items).toHaveLength(1);
    compatible.close();

    const incompatible = ledgerDb();
    appendActivity(incompatible, input());
    incompatible.exec("DROP TRIGGER agent_activity_message_codes; DROP TRIGGER agent_activity_payload_sanitized; DROP TRIGGER agent_activity_ledger_no_update");
    incompatible.query("DELETE FROM schema_migrations WHERE version=?").run("20260924_agent_activity_ledger_v2_message_codes");
    incompatible.query("UPDATE agent_activity_ledger SET decision_summary='legacy_free_code' WHERE activity_id='activity-001'").run();
    expect(() => migrateAgentActivityLedger(incompatible)).toThrow("incompatible with v2 sanitization");
    expect(incompatible.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM schema_migrations WHERE version=?")
      .get("20260924_agent_activity_ledger_v2_message_codes")!.n).toBe(0);
    incompatible.close();
  });

  test("normalizes UTC timestamps to fixed milliseconds before storage and range filtering", () => {
    const db = ledgerDb();
    const whole = appendActivity(db, input({ activity_id: "activity-whole", timestamp: "2026-09-24T01:00:00Z" }));
    const fraction = appendActivity(db, input({ activity_id: "activity-fraction", timestamp: "2026-09-24T01:00:00.1Z" }));
    expect(whole.timestamp).toBe("2026-09-24T01:00:00.000Z");
    expect(fraction.timestamp).toBe("2026-09-24T01:00:00.100Z");
    expect(readActivities(db, {
      since: "2026-09-24T01:00:00.05Z", until: "2026-09-24T01:00:00.2Z",
    }).items.map((item) => item.activity_id)).toEqual(["activity-fraction"]);
    db.close();
  });

  test("serializes for internal use only and has no customer route or customer import", () => {
    const db = ledgerDb();
    const activity = appendActivity(db, input());
    const serialized = serializeLedgerActivity(activity, "internal");
    expect(JSON.parse(serialized)).toMatchObject({
      activity_id: "activity-001", actor_type: "employee", created_at: activity.created_at,
    });
    expect(() => serializeLedgerActivity(activity, "customer" as "internal")).toThrow("internal-only");
    const server = readFileSync(resolve(root, "pokemon-agents/web/server.ts"), "utf8");
    expect(server).not.toContain('"/api/customer/activities"');
    for (const customerSource of [
      "pokemon-agents/web/routes/overview.ts",
      "pokemon-agents/web/routes/improvement-report.ts",
      "pokemon-agents/web/lib/customer-workspaces.ts",
    ]) {
      expect(readFileSync(resolve(root, customerSource), "utf8")).not.toContain("agent-activity-ledger");
    }
    db.close();
  });
});
