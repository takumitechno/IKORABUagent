import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ActivityLedgerConflictError,
  migrateAgentActivityLedger,
  readActivities,
  registerActivityAccount,
} from "../web/lib/agent-activity-ledger";
import {
  THREADS_ACTIVITY_PROJECTOR_MIGRATION_ID,
  advanceThreadsActivityCheckpoint,
  migrateThreadsActivityProjector,
  normalizeThreadsActivityEvent,
  normalizeThreadsUtcTimestamp,
  projectThreadsActivityEvent,
  projectThreadsActivityPage,
  readThreadsActivityCheckpoint,
} from "../web/lib/threads-activity-projector";

const root = resolve(import.meta.dir, "..", "..");
const fixtures = JSON.parse(readFileSync(
  resolve(import.meta.dir, "fixtures", "threads-activity-projector.json"), "utf8",
)) as Array<Record<string, unknown>>;

function event(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...fixtures[0], ...overrides };
}

function projectorDb(): Database {
  const db = new Database(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  migrateAgentActivityLedger(db);
  expect(migrateThreadsActivityProjector(db)).toBe(true);
  expect(migrateThreadsActivityProjector(db)).toBe(false);
  registerActivityAccount(db, "acct_fixture", "source:fixture-account");
  registerActivityAccount(db, "acct_other", "source:other-account");
  return db;
}

describe("ORG04A fixture-based Threads activity projector", () => {
  test("projects fixture events deterministically and reads them back through ORG03", () => {
    const db = projectorDb();
    const checkpoint = projectThreadsActivityPage(db, "threads.audit.fixture", fixtures);
    expect(checkpoint).toMatchObject({
      feed_id: "threads.audit.fixture",
      last_source_event_id: "event-theme-001",
      last_activity_id: "thr:event-theme-001",
    });
    const activities = readActivities(db, { account_id: "acct_fixture" }).items;
    expect(activities).toHaveLength(4);
    const byId = new Map(activities.map((activity) => [activity.activity_id, activity]));
    expect(byId.get("thr:event-insights-001")).toMatchObject({
      timestamp: "2026-09-24T02:00:00.000Z",
      actor_type: "system_capability",
      agent_id: null,
      agent_role: "performance_learner",
      decision_summary: "source_verified",
    });
    expect(byId.get("thr:event-writer-001")).toMatchObject({
      actor_type: "writer",
      agent_id: "editorial-writer",
      next_action_owner: "human:approval",
      next_action: "handoff_requested",
    });
    expect(byId.get("thr:event-human-001")).toMatchObject({
      timestamp: "2026-09-24T02:02:00.125Z",
      actor_type: "human",
      agent_role: "human_approval",
      next_action_owner: "kiara-executor",
    });
    expect(byId.get("thr:event-theme-001")).toMatchObject({
      actor_type: "system_capability",
      agent_role: "theme_diversity_judge",
    });
    db.close();
  });

  test("maps only explicitly proven employees and keeps unknown actors unknown", () => {
    const explicit = normalizeThreadsActivityEvent(event({
      source_event_id: "event-employee",
      actor_type: "employee",
      actor_id: "iori-validator",
    }));
    expect(explicit.agent_id).toBe("iori-validator");
    expect(explicit.agent_role).toBe("evidence_validator");

    const generic = normalizeThreadsActivityEvent(event({
      source_event_id: "event-generic",
      actor_type: "system_capability",
      actor_id: "iori-validator",
    }));
    expect(generic.agent_id).toBeNull();
    expect(generic.agent_role).toBeNull();

    const unknown = normalizeThreadsActivityEvent(event({
      source_event_id: "event-unknown",
      actor_type: "unknown",
      actor_id: null,
    }));
    expect(unknown.agent_id).toBeNull();
    expect(unknown.agent_role).toBeNull();
    expect(() => normalizeThreadsActivityEvent(event({
      source_event_id: "event-unknown-named",
      actor_type: "unknown",
      actor_id: "Unmapped Worker",
    }))).toThrow("must not carry");
    expect(() => normalizeThreadsActivityEvent(event({
      source_event_id: "event-fake-employee",
      actor_type: "employee",
      actor_id: "fake-employee",
    }))).toThrow("not canonical");
  });

  test("maps the allowlisted system capabilities without inventing employees", () => {
    for (const [index, actor] of ["Voice Judge", "Theme Judge", "QA", "NIGHT", "Performance Learner"].entries()) {
      const normalized = normalizeThreadsActivityEvent(event({
        source_event_id: `event-system-${index}`,
        actor_type: "system_capability",
        actor_id: actor,
      }));
      expect(normalized.agent_id).toBeNull();
      expect(normalized.agent_role).not.toBeNull();
    }
  });

  test("normalizes only explicit UTC timestamps and rejects ambiguous offsets", () => {
    expect(normalizeThreadsUtcTimestamp("2026-09-24T10:00:00+00:00")).toBe("2026-09-24T10:00:00.000Z");
    expect(normalizeThreadsUtcTimestamp("2026-09-24T10:00:00.25Z")).toBe("2026-09-24T10:00:00.250Z");
    for (const value of ["2026-09-24T10:00:00", "2026-09-24T10:00:00+09:00", "2026-09-24T10:00:00-00:00", "not-a-time"]) {
      expect(() => normalizeThreadsUtcTimestamp(value)).toThrow("explicit UTC");
    }
  });

  test("rejects malformed, secret-bearing and unbounded source events before writing", () => {
    const db = projectorDb();
    expect(() => projectThreadsActivityEvent(db, { ...event(), raw_prompt: "hidden" })).toThrow("unknown fields");
    expect(() => projectThreadsActivityEvent(db, event({ evidence_refs: ["source:sk-secretvalue"] }))).toThrow("forbidden material");
    expect(() => projectThreadsActivityEvent(db, event({ actor_id: "customer@example.com" }))).toThrow("forbidden material");
    expect(() => projectThreadsActivityEvent(db, event({ event_type: "unbounded_event" }))).toThrow("event_type");
    expect(() => projectThreadsActivityEvent(db, event({ evidence_refs: Array.from({ length: 49 }, (_, i) => `source:item-${i}`) }))).toThrow("exceeds 48");
    expect(readActivities(db, {}).items).toHaveLength(0);
    db.close();
  });

  test("fails closed for an unknown account and unavailable ledger", () => {
    const db = projectorDb();
    expect(() => projectThreadsActivityEvent(db, event({ account_id: "acct_missing" }))).toThrow("not registered");
    db.close();

    const unavailable = new Database(":memory:");
    expect(() => projectThreadsActivityEvent(unavailable, event())).toThrow();
    unavailable.close();
  });

  test("replays the same source event idempotently and conflicts on normalized changes", () => {
    const db = projectorDb();
    const first = projectThreadsActivityEvent(db, event());
    const replay = projectThreadsActivityEvent(db, { ...event(), created_at: "2026-09-24T02:00:00Z" });
    expect(replay).toEqual(first);
    expect(readActivities(db, {}).items).toHaveLength(1);
    expect(() => projectThreadsActivityEvent(db, event({ result_status: "failed" })))
      .toThrow(ActivityLedgerConflictError);
    expect(readActivities(db, {}).items).toHaveLength(1);
    db.close();
  });

  test("commits the event before advancing the cursor and recovers by replay", () => {
    const db = projectorDb();
    projectThreadsActivityEvent(db, event());
    expect(readThreadsActivityCheckpoint(db, "threads.audit.crash")).toBeNull();
    const recovered = projectThreadsActivityPage(db, "threads.audit.crash", [event()]);
    expect(recovered?.last_source_event_id).toBe("event-insights-001");
    expect(readActivities(db, {}).items).toHaveLength(1);
    expect(() => advanceThreadsActivityCheckpoint(db, "threads.audit.missing", "event-never-committed"))
      .toThrow("before the event is committed");
    db.close();
  });

  test("keeps checkpoints monotonic when an older page is replayed", () => {
    const db = projectorDb();
    projectThreadsActivityPage(db, "threads.audit.monotonic", fixtures.slice(0, 2));
    const latest = readThreadsActivityCheckpoint(db, "threads.audit.monotonic")!;
    projectThreadsActivityPage(db, "threads.audit.monotonic", [fixtures[0]]);
    expect(readThreadsActivityCheckpoint(db, "threads.audit.monotonic")).toEqual(latest);
    db.close();
  });

  test("projects correction events without mutating the original", () => {
    const db = projectorDb();
    const original = projectThreadsActivityEvent(db, event());
    const correction = projectThreadsActivityEvent(db, event({
      source_event_id: "event-correction-001",
      created_at: "2026-09-24T03:00:00Z",
      event_type: "correction",
      actor_type: "system_capability",
      actor_id: "QA",
      evidence_refs: ["source:verified-correction"],
      decision_status: "not_applicable",
      result_status: "succeeded",
      corrects_source_event_id: "event-insights-001",
    }));
    expect(correction).toMatchObject({
      activity_id: "thr:event-correction-001",
      action: "correction",
      corrects_activity_id: original.activity_id,
      decision_summary: "correction_recorded",
    });
    expect(correction.evidence_refs).toContain(`activity:${original.activity_id}`);
    expect(readActivities(db, {}).items).toHaveLength(2);
    db.close();
  });

  test("creates a bounded persistent checkpoint schema without customer exposure", () => {
    const db = projectorDb();
    expect(db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM schema_migrations WHERE version=?")
      .get(THREADS_ACTIVITY_PROJECTOR_MIGRATION_ID)!.n).toBe(1);
    const server = readFileSync(resolve(root, "pokemon-agents/web/server.ts"), "utf8");
    expect(server).not.toContain('"/api/customer/activities"');
    for (const customerSource of [
      "pokemon-agents/web/routes/overview.ts",
      "pokemon-agents/web/routes/improvement-report.ts",
      "pokemon-agents/web/lib/customer-workspaces.ts",
    ]) {
      expect(readFileSync(resolve(root, customerSource), "utf8")).not.toContain("threads-activity-projector");
    }
    db.close();
  });

  test("requires an explicit apply flag before the runtime migration can write", () => {
    const result = Bun.spawnSync([
      process.execPath,
      resolve(root, "pokemon-agents/scripts/migrate-threads-activity-projector.ts"),
    ], { cwd: root, stdout: "pipe", stderr: "pipe" });
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("pass --apply");
  });
});
