import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PRODUCER_CONTRACT_REVISION,
  canonicalContractText,
  renderContract,
} from "../scripts/generate-threads-bridge-contract";
import { loadThreadsDashboard } from "../web/lib/threads-dashboard";
import { renderImprovementReport } from "../web/routes/improvement-report";
import { renderInternalOperations } from "../web/routes/internal-operations";
import { renderOverview } from "../web/routes/overview";
import {
  accountResponseV1,
  contentResponseV1,
  editorialCustomerV1,
  editorialCycleV1,
  editorialInternalV1,
  recentContentV1,
  runnerHeartbeatsV1,
  safetyResponseV1,
} from "./threads-bridge-v1-fixtures";

const bridgeUrl = "http://127.0.0.1:8765";

type Payloads = {
  account?: Record<string, unknown>;
  content?: Record<string, unknown>;
  safety?: Record<string, unknown>;
  internal?: Record<string, unknown>;
  customer?: Record<string, unknown>;
};

function validPayloads(): Required<Payloads> {
  return {
    account: accountResponseV1({ recent_contents: [recentContentV1({ content_id: "content-1" })] }),
    content: contentResponseV1({ content_id: "content-1", body_text: "contract body", parts: ["contract body"], n_chars: 13 }),
    safety: safetyResponseV1(),
    internal: editorialInternalV1(),
    customer: editorialCustomerV1(),
  };
}

function fixtureFetcher(payloads: Payloads = {}): typeof fetch {
  const values = { ...validPayloads(), ...payloads };
  return (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/autopilot/v2/safety/status")) return Response.json(values.safety);
    if (url.includes("/editorial/internal")) return Response.json(values.internal);
    if (url.includes("/editorial/customer")) return Response.json(values.customer);
    if (url.includes("/contents/content-1")) return Response.json(values.content);
    return Response.json(values.account);
  }) as typeof fetch;
}

function internalDb(): Database {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE agents (id INTEGER PRIMARY KEY, display_name TEXT, pokemon_jp TEXT, avatar_url TEXT, slug TEXT, role_label TEXT, role TEXT, status TEXT);
    CREATE TABLE issues (id INTEGER PRIMARY KEY, assignee_agent_id INTEGER, title TEXT, status TEXT, priority INTEGER, updated_at TEXT);
    CREATE TABLE reflections (id INTEGER PRIMARY KEY, agent_id INTEGER, agent_slug TEXT, status TEXT, created_at TEXT, session_id TEXT, work_dir TEXT);
  `);
  return db;
}

describe("Threads Bridge response contract v1", () => {
  test("uses deterministic generated types from the canonical sealed producer artifact", () => {
    const source = readFileSync(resolve(import.meta.dir, "../web/lib/threads-bridge-contract-v1.generated.ts"), "utf8");
    const artifact = readFileSync(resolve(import.meta.dir, "../contracts/bridge_contract_v1.json"), "utf8");
    const canonical = canonicalContractText(artifact);
    const expectedHash = "14ed73d33a02b3f8877a3045d226f23b7d9e7686f9dc2c8ef595aeae934fa3dc";
    expect(source).toContain("GENERATED FILE — DO NOT EDIT BY HAND");
    expect(source).toContain("pokemon-agents/contracts/bridge_contract_v1.json");
    expect(PRODUCER_CONTRACT_REVISION).toBe("10a071390daea91c9c687bc60fff4da8cee4c061");
    expect(source).toContain(`Producer contract revision: ${PRODUCER_CONTRACT_REVISION}`);
    expect(source).toContain("THREADS_BRIDGE_SCHEMA_VERSION = 1");
    expect(createHash("sha256").update(canonical, "utf8").digest("hex")).toBe(expectedHash);
    expect(source).toContain(`Artifact SHA-256: ${expectedHash}`);
    expect(renderContract(artifact)).toBe(source);
    expect(renderContract(canonical.replace(/\n/g, "\r\n"))).toBe(source);
    expect(renderContract(artifact)).not.toBe(`${source}// drift\n`);
    const check = Bun.spawnSync(["bun", resolve(import.meta.dir, "../scripts/generate-threads-bridge-contract.ts"), "--check"]);
    expect(check.exitCode).toBe(0);
  });

  test("accepts valid schema v1 and unknown additive fields", async () => {
    const payloads = validPayloads();
    payloads.account.future_account_field = { safe: true };
    payloads.content.future_content_field = ["safe"];
    payloads.safety.future_safety_field = "safe";
    const data = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher(payloads) });
    expect(data.connected).toBe(true);
    expect(data.bridgeStatus).toBe("HEALTHY");
    expect(data.contents[0].body).toBe("contract body");
  });

  test("validates and normalizes sealed operations semantics", async () => {
    const account = accountResponseV1({ operations: {
      runner_heartbeats: runnerHeartbeatsV1({ insights: {
        state: "fresh", run_status: "succeeded", last_run_at: "2026-09-21T00:00:00Z",
        age_seconds: 10, expected: "unknown", healthy: true,
      } }),
      night_attention: { window_hours: 96, total: 101, by_reason: { blocked: 1 }, items_truncated: true, coverage: "partial" },
      insights_quarantine: { total: 51, items: [], items_truncated: true, coverage: "partial" },
    } });
    const data = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account }) });
    expect(data.connected).toBe(true);
    expect(data.operations.runnerHeartbeats[0]).toMatchObject({
      runnerName: "insights", lastRunAt: "2026-09-21T00:00:00Z",
      expected: "unknown", available: true, healthy: true,
    });
    expect(data.operations.nightAttention.coverage).toBe("partial");
    expect(data.operations.insightsQuarantine.coverage).toBe("partial");
  });

  test("fails closed on missing safety evidence and unknown heartbeat enums", async () => {
    const missingExpected = accountResponseV1();
    delete (missingExpected.operations as Record<string, unknown>).runner_heartbeats;
    expect((await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account: missingExpected }) })).bridgeStatus)
      .toBe("MALFORMED_RESPONSE");

    const unknownState = accountResponseV1({ operations: { runner_heartbeats: runnerHeartbeatsV1({ insights: {
      state: "disabled", run_status: "succeeded", last_run_at: "2026-09-21T00:00:00Z",
      age_seconds: 10, expected: "unknown", healthy: true,
    } }) } });
    expect((await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account: unknownState }) })).bridgeStatus)
      .toBe("MALFORMED_RESPONSE");

    const safety = safetyResponseV1();
    delete safety.global_stop;
    expect((await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ safety }) })).bridgeStatus)
      .toBe("MALFORMED_RESPONSE");
  });

  test("keeps malformed and future heartbeat evidence unavailable", async () => {
    for (const heartbeat of [{
      runner_name: "night_batch", state: "invalid", run_status: "failed",
      last_run_at: "not-a-time", age_seconds: null, expected: "unknown", healthy: false,
    }, {
      runner_name: "night_batch", state: "fresh", run_status: "succeeded",
      last_run_at: "2999-01-01T00:00:00Z", age_seconds: 0, expected: "unknown", healthy: true,
    }]) {
      const account = accountResponseV1({ operations: { runner_heartbeats: runnerHeartbeatsV1({ night_batch: heartbeat }) } });
      const data = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account }) });
      expect(data.connected).toBe(true);
      expect(data.operations.runnerHeartbeats[0].available).toBe(false);
      expect(data.operations.runnerHeartbeats[0].healthy).toBe(false);
    }
  });

  test("requires every sealed runner and rejects incoherent complete coverage", async () => {
    const omitted = accountResponseV1();
    omitted.operations.runner_heartbeats = omitted.operations.runner_heartbeats.filter((row) => row.runner_name !== "outcome");
    expect((await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account: omitted }) })).bridgeStatus)
      .toBe("MALFORMED_RESPONSE");

    for (const key of ["night_attention", "insights_quarantine"] as const) {
      const account = accountResponseV1();
      account.operations[key].items_truncated = true;
      account.operations[key].coverage = "complete";
      expect((await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account }) })).bridgeStatus)
        .toBe("MALFORMED_RESPONSE");
    }
  });

  test("detects removed required fields and wrong field types", async () => {
    const removed = accountResponseV1();
    delete removed.recent_contents;
    const missing = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account: removed }) });
    expect(missing.bridgeStatus).toBe("MALFORMED_RESPONSE");

    const wrongType = accountResponseV1({ recent_contents: "not-an-array" });
    const wrong = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account: wrongType }) });
    expect(wrong.bridgeStatus).toBe("MALFORMED_RESPONSE");
  });

  test("rejects invalid metrics and timestamps without rejecting nullable fields", async () => {
    const negativeMetric = contentResponseV1({ metrics: { views: -1 } });
    const metricFailure = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ content: negativeMetric }) });
    expect(metricFailure.bridgeStatus).toBe("MALFORMED_RESPONSE");

    const invalidTimestamp = contentResponseV1({ updated_at: "not-a-time" });
    const timestampFailure = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ content: invalidTimestamp }) });
    expect(timestampFailure.bridgeStatus).toBe("MALFORMED_RESPONSE");

    const nullable = validPayloads();
    nullable.content.metrics_observation = null;
    nullable.content.qa = null;
    nullable.internal.cycle = null;
    nullable.customer.summary = null;
    const accepted = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher(nullable) });
    expect(accepted.connected).toBe(true);
  });

  test("classifies unsupported, missing, and malformed schema metadata", async () => {
    for (const meta of [{ schema_version: 2 }, {}, "bad-meta"]) {
      const account = accountResponseV1();
      account.meta = meta as never;
      const data = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account }) });
      expect(data.bridgeStatus).toBe("SCHEMA_INCOMPATIBLE");
      expect(data.connected).toBe(false);
    }
  });

  test("classifies HTTP and transport failures without preserving secret details", async () => {
    for (const [status, expected] of [[401, "UNAUTHORIZED"], [403, "UNAUTHORIZED"], [404, "ACCOUNT_NOT_FOUND"]] as const) {
      const data = await loadThreadsDashboard({
        bridgeUrl,
        fetcher: (async () => new Response("secret HTTP detail", { status })) as typeof fetch,
      });
      expect(data.bridgeStatus).toBe(expected);
      expect(JSON.stringify(data)).not.toContain("secret HTTP detail");
    }
    const unreachable = await loadThreadsDashboard({
      bridgeUrl,
      fetcher: (async () => { throw new Error("ECONNREFUSED secret-host"); }) as typeof fetch,
    });
    expect(unreachable.bridgeStatus).toBe("UNREACHABLE");
    expect(JSON.stringify(unreachable)).not.toContain("secret-host");
  });

  test("classifies invalid JSON as a malformed response", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl,
      fetcher: (async () => new Response("not-json", { status: 200 })) as typeof fetch,
    });
    expect(data.bridgeStatus).toBe("MALFORMED_RESPONSE");
  });

  test("treats cycle null, summary null, and empty arrays as HEALTHY_EMPTY", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl,
      fetcher: fixtureFetcher({
        account: accountResponseV1(),
        internal: editorialInternalV1({ cycle: null, experiments: [] }),
        customer: editorialCustomerV1({ summary: null }),
      }),
    });
    expect(data.connected).toBe(true);
    expect(data.bridgeStatus).toBe("HEALTHY_EMPTY");
    expect(data.message).toBe("データ取得待ち");
  });

  test("keeps editorial state and status open to unknown additive values", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl,
      fetcher: fixtureFetcher({
        account: accountResponseV1(),
        internal: editorialInternalV1({
          cycle: editorialCycleV1({ state: "FUTURE_STATE", status: "FUTURE_STATUS" }),
        }),
      }),
    });
    expect(data.connected).toBe(true);
    expect(data.editorial.state).toBe("FUTURE_STATE");
    expect(data.editorial.status).toBe("FUTURE_STATUS");
  });

  test("sanitizes customer errors while internal UI shows the short taxonomy", async () => {
    const cases = [
      [401, "認証エラー"],
      [404, "アカウントが見つかりません"],
    ] as const;
    for (const [status, label] of cases) {
      const data = await loadThreadsDashboard({
        bridgeUrl,
        apiKey: "server-only-secret-key",
        fetcher: (async () => new Response("internal stack trace", { status })) as typeof fetch,
      });
      const customer = renderOverview({} as Database, data) + renderImprovementReport(data);
      for (const forbidden of [
        "schema_version", "SCHEMA_INCOMPATIBLE", "internal stack trace",
        bridgeUrl, "server-only-secret-key", "API key",
      ]) expect(customer).not.toContain(forbidden);

      const db = internalDb();
      const internal = renderInternalOperations(db, data);
      expect(internal).toContain(label);
      expect(internal).not.toContain("internal stack trace");
      expect(internal).not.toContain("server-only-secret-key");
      expect(internal).not.toContain(bridgeUrl);
      db.close();
    }

    const mismatched = accountResponseV1();
    mismatched.meta = { schema_version: 2 } as never;
    const contractError = await loadThreadsDashboard({ bridgeUrl, fetcher: fixtureFetcher({ account: mismatched }) });
    const db = internalDb();
    expect(renderInternalOperations(db, contractError)).toContain("契約バージョン不一致");
    expect(renderOverview(db, contractError)).not.toContain("契約バージョン不一致");
    db.close();

    const malformed = await loadThreadsDashboard({
      bridgeUrl,
      fetcher: (async () => new Response("not-json", { status: 200 })) as typeof fetch,
    });
    const malformedDb = internalDb();
    expect(renderInternalOperations(malformedDb, malformed)).toContain("レスポンス形式不正");
    expect(renderOverview(malformedDb, malformed)).not.toContain("レスポンス形式不正");
    malformedDb.close();

    const healthyEmpty = await loadThreadsDashboard({
      bridgeUrl,
      fetcher: fixtureFetcher({
        account: accountResponseV1(),
        internal: editorialInternalV1({ cycle: null, experiments: [] }),
        customer: editorialCustomerV1({ summary: null }),
      }),
    });
    const emptyDb = internalDb();
    expect(renderInternalOperations(emptyDb, healthyEmpty)).toContain("正常・データ待ち");
    expect(renderOverview(emptyDb, healthyEmpty)).not.toContain("正常・データ待ち");
    emptyDb.close();
  });
});
