import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  migrateAgentActivityLedger,
  readActivities,
  registerActivityAccount,
} from "../web/lib/agent-activity-ledger";
import {
  migrateThreadsActivityProjector,
  projectThreadsActivityEvent,
  readThreadsActivityCheckpoint,
} from "../web/lib/threads-activity-projector";
import {
  THREADS_ACTIVITY_CONSUMER_MIGRATION_ID,
  mapBridgeAuditEvent,
  migrateThreadsActivityConsumer,
  parseBridgeAuditPageV1,
  projectionEnabledFromEnv,
  readThreadsActivityProjectionStatus,
  registerThreadsActivityProjectionSource,
  runThreadsActivityProjectionOnce,
  setThreadsActivityProjectionSourceEnabled,
  threadsActivityFeedId,
  type BridgeAuditEventV1,
} from "../web/lib/threads-activity-consumer";

const root = resolve(import.meta.dir, "..", "..");
const fixtures = JSON.parse(readFileSync(
  resolve(import.meta.dir, "fixtures", "threads-audit-feed-v1.json"), "utf8",
)) as BridgeAuditEventV1[];

function testDb(options: { registerAccount?: boolean; registerSource?: boolean; enableSource?: boolean } = {}): Database {
  const db = new Database(":memory:");
  db.exec("PRAGMA foreign_keys=ON");
  migrateAgentActivityLedger(db);
  migrateThreadsActivityProjector(db);
  migrateThreadsActivityConsumer(db);
  if (options.registerAccount !== false) registerActivityAccount(db, "acct_fixture", "source:fixture-account");
  if (options.registerSource !== false && options.registerAccount !== false) {
    registerThreadsActivityProjectionSource(db, "acct_fixture", "source:threads-audit-v1");
    if (options.enableSource !== false) setThreadsActivityProjectionSourceEnabled(db, "acct_fixture", true);
  }
  return db;
}

function payload(
  events: readonly BridgeAuditEventV1[],
  options: { account?: string; after?: string | null; limit?: number; hasMore?: boolean } = {},
): Record<string, unknown> {
  const after = options.after ?? null;
  const result: Record<string, unknown> = {
    account_id: options.account ?? "acct_fixture",
    limit: options.limit ?? 100,
    events,
    has_more: options.hasMore ?? false,
    meta: { schema_version: 1 },
  };
  if (after !== null) result.after = after;
  if (events.length) result.next_after = events.at(-1)!.event_id;
  return result;
}

function jsonFetcher(body: unknown, status = 200, inspect?: (url: URL) => void): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    inspect?.(new URL(String(input)));
    return new Response(JSON.stringify(body), {
      status, headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

describe("ORG04B Bridge audit consumer", () => {
  test("migration creates an empty registry and enrollment is explicit and disabled by default", () => {
    const db = testDb({ registerSource: false });
    expect(db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM schema_migrations WHERE version=?")
      .get(THREADS_ACTIVITY_CONSUMER_MIGRATION_ID)!.n).toBe(1);
    expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM threads_activity_projection_sources").get()!.n).toBe(0);
    const status = registerThreadsActivityProjectionSource(db, "acct_fixture", "source:threads-audit-v1");
    expect(status.enabled).toBe(false);
    expect(status.current_checkpoint).toBeNull();
    db.close();
  });

  test("disabled flag makes zero network calls and unknown accounts cannot be auto-enrolled", async () => {
    const db = testDb({ registerAccount: false, registerSource: false });
    let calls = 0;
    const fetcher = (async () => { calls += 1; return new Response(); }) as typeof fetch;
    expect(projectionEnabledFromEnv({})).toBe(false);
    expect((await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_missing", enabled: false, fetcher,
    })).status).toBe("disabled");
    const unknown = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_missing", enabled: true, fromBeginning: true, fetcher,
    });
    expect(unknown.safe_error_code).toBe("ACCOUNT_NOT_ENROLLED");
    expect(calls).toBe(0);
    expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_accounts").get()!.n).toBe(0);
    db.close();
  });

  test("a registered source stays network-quiet while disabled and requires an explicit initial cursor choice", async () => {
    const db = testDb({ enableSource: false });
    let calls = 0;
    const fetcher = (async () => { calls += 1; return new Response(); }) as typeof fetch;
    expect((await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true, fetcher,
    })).safe_error_code).toBe("ACCOUNT_DISABLED");
    setThreadsActivityProjectionSourceEnabled(db, "acct_fixture", true);
    expect((await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fetcher,
    })).safe_error_code).toBe("PROJECTION_CURSOR_REQUIRED");
    expect(calls).toBe(0);
    db.close();
  });

  test("an inactive account loses projection authority before any network or ledger write", async () => {
    const db = testDb();
    db.query("UPDATE agent_activity_accounts SET status='inactive' WHERE account_id=?").run("acct_fixture");
    let calls = 0;
    const result = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true,
      fetcher: (async () => { calls += 1; return new Response(); }) as typeof fetch,
    });
    expect(result.safe_error_code).toBe("ACCOUNT_NOT_ENROLLED");
    expect(calls).toBe(0);
    expect(readActivities(db, {}).items).toHaveLength(0);
    db.close();
  });

  test("fetches exactly one bounded page, maps current events and advances the checkpoint", async () => {
    const db = testDb();
    let calls = 0;
    const summary = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true, limit: 5,
      fetcher: jsonFetcher(payload(fixtures.slice(0, 5), { limit: 5, hasMore: true }), 200, (url) => {
        calls += 1;
        expect(url.searchParams.get("limit")).toBe("5");
        expect(url.searchParams.has("after")).toBe(false);
      }),
    });
    expect(summary).toMatchObject({ status: "succeeded", fetched_count: 5, projected_count: 5, has_more: true });
    expect(calls).toBe(1);
    expect(summary.checkpoint).toBe("evt-approved-1");
    const activities = readActivities(db, { account_id: "acct_fixture" }).items;
    expect(activities.find((item) => item.action === "baseline_cta_declared")).toMatchObject({
      actor_type: "unknown", agent_id: null, agent_role: null,
    });
    expect(activities.find((item) => item.action === "editorial_cycle_approved")).toMatchObject({
      actor_type: "system_capability", agent_id: null, agent_role: "editorial_runner",
      decision_status: "approved", result_status: "succeeded",
    });
    expect(activities.some((item) => item.agent_id === "sashihara-orchestrator")).toBe(false);
    db.close();
  });

  test("reuses the durable cursor across repeated one-shot pages", async () => {
    const db = testDb();
    await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true, limit: 2,
      fetcher: jsonFetcher(payload(fixtures.slice(0, 2), { limit: 2, hasMore: true })),
    });
    let observedAfter: string | null = null;
    const second = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, limit: 2,
      fetcher: jsonFetcher(payload(fixtures.slice(2, 4), {
        after: "evt-waiting-1", limit: 2, hasMore: true,
      }), 200, (url) => { observedAfter = url.searchParams.get("after"); }),
    });
    expect(observedAfter).toBe("evt-waiting-1");
    expect(second.checkpoint).toBe("evt-draft-1");
    expect(readActivities(db, {}).items).toHaveLength(4);
    db.close();
  });

  test("recovers idempotently when interrupted after ledger commit and before checkpoint", async () => {
    const db = testDb();
    const one = payload(fixtures.slice(0, 1));
    const interrupted = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true,
      fetcher: jsonFetcher(one), afterLedgerCommit: () => { throw new Error("simulated crash"); },
    });
    expect(interrupted.safe_error_code).toBe("CHECKPOINT_WRITE_FAILED");
    expect(readActivities(db, {}).items).toHaveLength(1);
    expect(readThreadsActivityCheckpoint(db, threadsActivityFeedId("acct_fixture"))).toBeNull();
    const replay = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true, fetcher: jsonFetcher(one),
    });
    expect(replay).toMatchObject({ status: "succeeded", projected_count: 0, skipped_duplicate_count: 1 });
    expect(readActivities(db, {}).items).toHaveLength(1);
    db.close();
  });

  test("detects conflicting duplicates without advancing the cursor", async () => {
    const db = testDb();
    const original = mapBridgeAuditEvent("acct_fixture", fixtures[0]);
    projectThreadsActivityEvent(db, { ...original, created_at: "2026-09-23T23:59:00Z" });
    const result = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true,
      fetcher: jsonFetcher(payload(fixtures.slice(0, 1))),
    });
    expect(result.safe_error_code).toBe("LEDGER_CONFLICT");
    expect(result.checkpoint).toBeNull();
    db.close();
  });

  test("fails closed on malformed, cross-account, oversized and secret-bearing pages", () => {
    expect(() => parseBridgeAuditPageV1(payload(fixtures.slice(0, 1), { account: "acct_other" }), "acct_fixture", null, 100))
      .toThrow();
    expect(() => parseBridgeAuditPageV1({
      ...payload(fixtures.slice(0, 1)), detail_json: "raw",
    }, "acct_fixture", null, 100)).toThrow();
    expect(() => parseBridgeAuditPageV1(payload([{ ...fixtures[0], created_at: "2026-09-24 00:00:00" }]), "acct_fixture", null, 100))
      .toThrow();
    expect(() => parseBridgeAuditPageV1(payload([{
      ...fixtures[0], detail: { ...fixtures[0].detail, raw_prompt: "secret" },
    }]), "acct_fixture", null, 100)).toThrow();
    expect(() => parseBridgeAuditPageV1(payload(Array.from({ length: 101 }, (_, index) => ({
      ...fixtures[0], event_id: `evt-page-${index}`,
    }))), "acct_fixture", null, 100)).toThrow();
  });

  test("maps all future fixture events through controlled vocabulary without employee invention", () => {
    for (const event of fixtures.slice(5)) {
      const mapped = mapBridgeAuditEvent("acct_fixture", event);
      expect(mapped.event_type).toBe(event.event_type);
      expect(mapped.actor_type).toBe("system_capability");
      expect(mapped.actor_id).not.toBe("sashihara-orchestrator");
    }
    expect(() => mapBridgeAuditEvent("acct_fixture", {
      ...fixtures[0], event_type: "future_unregistered_event",
    })).toThrow("UNSUPPORTED_EVENT_TYPE");
  });

  test("classifies Bridge HTTP and timeout failures without reading response bodies", async () => {
    for (const [status, code] of [[401, "BRIDGE_UNAUTHORIZED"], [403, "BRIDGE_FORBIDDEN"],
      [404, "BRIDGE_ACCOUNT_OR_CURSOR_NOT_FOUND"], [409, "BRIDGE_CONTRACT_CONFLICT"],
      [500, "BRIDGE_HTTP_ERROR"]] as const) {
      const db = testDb();
      const result = await runThreadsActivityProjectionOnce(db, {
        accountId: "acct_fixture", enabled: true, fromBeginning: true,
        fetcher: jsonFetcher({ raw_prompt: "must-not-be-read" }, status),
      });
      expect(result.safe_error_code).toBe(code);
      db.close();
    }
    const db = testDb();
    const timeoutFetcher = ((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
    })) as typeof fetch;
    const timedOut = await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true, timeoutMs: 5, fetcher: timeoutFetcher,
    });
    expect(timedOut.safe_error_code).toBe("BRIDGE_TIMEOUT");
    db.close();

    const unavailableDb = testDb();
    const unavailable = await runThreadsActivityProjectionOnce(unavailableDb, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true,
      fetcher: (async () => { throw new Error("network contains no safe detail"); }) as typeof fetch,
    });
    expect(unavailable.safe_error_code).toBe("BRIDGE_UNAVAILABLE");
    unavailableDb.close();
  });

  test("reports ledger and checkpoint failures without silent success", async () => {
    const ledgerDb = testDb();
    ledgerDb.exec(`CREATE TRIGGER test_ledger_fail BEFORE INSERT ON agent_activity_ledger
      BEGIN SELECT RAISE(ABORT,'test ledger failure'); END`);
    const ledger = await runThreadsActivityProjectionOnce(ledgerDb, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true,
      fetcher: jsonFetcher(payload(fixtures.slice(0, 1))),
    });
    expect(ledger).toMatchObject({ status: "failed", safe_error_code: "LEDGER_WRITE_FAILED", projected_count: 0 });
    ledgerDb.close();

    const checkpointDb = testDb();
    checkpointDb.exec(`CREATE TRIGGER test_checkpoint_fail BEFORE INSERT ON threads_activity_projector_checkpoints
      BEGIN SELECT RAISE(ABORT,'test checkpoint failure'); END`);
    const checkpoint = await runThreadsActivityProjectionOnce(checkpointDb, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true,
      fetcher: jsonFetcher(payload(fixtures.slice(0, 1))),
    });
    expect(checkpoint).toMatchObject({ status: "failed", safe_error_code: "CHECKPOINT_WRITE_FAILED", projected_count: 1 });
    expect(readActivities(checkpointDb, {}).items).toHaveLength(1);
    expect(readThreadsActivityProjectionStatus(checkpointDb, "acct_fixture")?.projected_count).toBe(1);
    checkpointDb.close();
  });

  test("persists only safe internal status and keeps customer surfaces untouched", async () => {
    const db = testDb();
    await runThreadsActivityProjectionOnce(db, {
      accountId: "acct_fixture", enabled: true, fromBeginning: true,
      fetcher: jsonFetcher(payload(fixtures.slice(0, 1))),
    });
    expect(readThreadsActivityProjectionStatus(db, "acct_fixture")).toMatchObject({
      current_checkpoint: "evt-baseline-1", projected_count: 1,
      skipped_duplicate_count: 0, last_safe_error_code: null,
    });
    const server = readFileSync(resolve(root, "pokemon-agents/web/server.ts"), "utf8");
    expect(server).toContain('"/api/internal/threads-activity-projection"');
    expect(server).not.toContain('"/api/customer/threads-activity-projection"');
    for (const customerSource of [
      "pokemon-agents/web/routes/overview.ts",
      "pokemon-agents/web/routes/improvement-report.ts",
      "pokemon-agents/web/lib/customer-workspaces.ts",
    ]) {
      expect(readFileSync(resolve(root, customerSource), "utf8")).not.toContain("threads-activity-consumer");
    }
    db.close();
  });

  test("runner is one-shot, disabled by default, and migration requires explicit apply", () => {
    const runner = readFileSync(resolve(root, "pokemon-agents/scripts/run-threads-activity-projection.ts"), "utf8");
    expect(runner).not.toMatch(/setInterval|while\s*\(|scheduler|daemon/i);
    const disabled = Bun.spawnSync([
      process.execPath, resolve(root, "pokemon-agents/scripts/run-threads-activity-projection.ts"),
    ], { cwd: root, env: { ...process.env, THREADS_ACTIVITY_PROJECTION_ENABLED: "false" }, stdout: "pipe", stderr: "pipe" });
    expect(disabled.exitCode).toBe(0);
    expect(JSON.parse(disabled.stdout.toString())).toMatchObject({ status: "disabled", fetched_count: 0 });
    const migration = Bun.spawnSync([
      process.execPath, resolve(root, "pokemon-agents/scripts/migrate-threads-activity-consumer.ts"),
    ], { cwd: root, stdout: "pipe", stderr: "pipe" });
    expect(migration.exitCode).toBe(2);
    expect(migration.stderr.toString()).toContain("pass --apply");
  });
});
