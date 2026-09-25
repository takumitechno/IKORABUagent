import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadThreadsDashboard } from "../web/lib/threads-dashboard";
import {
  accountResponseV1, editorialCustomerV1, editorialInternalV1,
  safetyResponseV1,
} from "./threads-bridge-v1-fixtures";

const root = resolve(import.meta.dir, "..", "..");
const monitor = resolve(root, "scripts/control-plane-critical-monitor.py");
const notifier = readFileSync(resolve(root, ".claude/scripts/notify-discord.sh"), "utf8");
const notifierPath = resolve(root, ".claude/scripts/notify-discord.sh");
const bash = [Bun.which("bash"), "C:/Program Files/Git/bin/bash.exe"].find((path) => path && existsSync(path));

async function notify(webhook: string, stateFile: string, state = "active") {
  if (!bash) throw new Error("Git Bash is required");
  const child = Bun.spawn([
    bash, notifierPath, "--dedupe-key", "fixture-alert", "--state", state,
    "--cooldown-seconds", "21600", "fixture message",
  ], {
    cwd: root,
    env: { ...process.env, IKORABU_NOTIFICATION_TRANSPORT_ENABLED: "true", DISCORD_WEBHOOK_URL: webhook, DISCORD_NOTIFY_STATE_FILE: stateFile },
    stdout: "pipe", stderr: "pipe",
  });
  const code = await child.exited;
  return { code, stdout: await new Response(child.stdout).text(), stderr: await new Response(child.stderr).text() };
}

function runFixture(name: string, value: unknown) {
  const dir = resolve(root, ".runtime/tests/alert01");
  mkdirSync(dir, { recursive: true });
  const fixture = resolve(dir, `${name}.json`);
  writeFileSync(fixture, JSON.stringify(value));
  const result = Bun.spawnSync(["python", monitor, "--fixture", fixture, "--scope", "acct_takumi_hq", "--now", "2026-09-22T06:00:00Z"]);
  return { code: result.exitCode, body: JSON.parse(new TextDecoder().decode(result.stdout)) };
}

async function runAllAccounts(bridgeUrl: string) {
  const child = Bun.spawn([
    "python", monitor, "--all-accounts", "--scope", "acct_takumi_hq",
    "--bridge-url", bridgeUrl, "--dashboard-url", bridgeUrl,
    "--backup-dir", resolve(root, ".runtime/tests/no-backups"),
    "--now", "2026-09-22T06:00:00Z",
  ], { cwd: root, stdout: "pipe", stderr: "pipe" });
  const code = await child.exited;
  const stdout = await new Response(child.stdout).text();
  return { code, body: JSON.parse(stdout), stderr: await new Response(child.stderr).text() };
}

function freshHeartbeats(overrides: Partial<Record<"insights" | "outcome" | "night_batch", Record<string, unknown>>> = {}) {
  return (["insights", "outcome", "night_batch"] as const).map((runner_name) => ({
    runner_name, state: "fresh", run_status: "succeeded",
    last_run_at: "2026-09-22T05:30:00Z", age_seconds: 1800,
    expected: "unknown", healthy: true, ...overrides[runner_name],
  }));
}

const freshSignals = {
  credential_readiness_available: true,
  credential_readiness: { publish: { ready: true }, insights: { ready: true } },
  runner_heartbeats: freshHeartbeats(),
  night_attention: { total: 0, items_truncated: false, coverage: "complete" },
  insights_quarantine: { total: 0, items: [], items_truncated: false, coverage: "complete" },
};

describe("Control Plane CRITICAL monitor", () => {
  test("reports a healthy snapshot without leaking source values", () => {
    const got = runFixture("healthy", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals,
      night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.code).toBe(0);
    expect(got.body.status).toBe("HEALTHY");
    expect(got.body.employee_input).toMatchObject({ schema_version: "monitor-findings.v1", scope: "acct_takumi_hq" });
    expect(got.body.employee_input.findings.map((row: { check_code: string }) => row.check_code)).toEqual([
      "bridge_health", "dashboard_health", "backup_freshness", "night_freshness", "oauth_readiness",
      "tenant_isolation", "insights_freshness", "editorial_freshness", "activity_projection_freshness",
      "task_scheduler_state",
    ]);
    expect(got.body.message.length).toBeLessThanOrEqual(1900);
  });

  test("carries one contract-valid producer payload through validation, normalization, and ATTENTION", async () => {
    const account = accountResponseV1({ account_id: "acct_fixture", operations: {
      runner_heartbeats: freshHeartbeats(),
      night_attention: { window_hours: 96, total: 0, by_reason: {}, items_truncated: false, coverage: "complete" },
      insights_quarantine: { total: 0, items: [], items_truncated: false, coverage: "complete" },
    } });
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765", accountId: "acct_fixture",
      fetcher: (async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/autopilot/v2/safety/status")) return Response.json(safetyResponseV1({ account_id: "acct_fixture" }));
        if (url.includes("/editorial/internal")) return Response.json(editorialInternalV1({ account_id: "acct_fixture" }));
        if (url.includes("/editorial/customer")) return Response.json(editorialCustomerV1({ account_id: "acct_fixture" }));
        return Response.json(account);
      }) as typeof fetch,
    });
    expect(data.connected).toBe(true);
    expect(data.operations.runnerHeartbeats).toHaveLength(3);
    expect(data.operations.runnerHeartbeats.every((row) => row.available && row.expected === "unknown")).toBe(true);
    const got = runFixture("sealed-e2e", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals, runner_heartbeats: account.operations.runner_heartbeats,
      night_attention: account.operations.night_attention,
      insights_quarantine: account.operations.insights_quarantine,
      night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.body).toMatchObject({ status: "HEALTHY", alerts: [] });
  });

  test("aggregates all critical classes and includes legacy PID", () => {
    const recent = Array.from({ length: 5 }, () => ({ decision: "deny", timestamp: "2026-09-22T05:55:00Z" }));
    const got = runFixture("critical", {
      bridge_healthy: false, dashboard_healthy: false, account_available: true,
      ...freshSignals,
      night_items: [{ status: "pending", scheduled_at: "2026-09-22T05:00:00Z" }],
      readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "reauthorization_required", canary_available: true,
      tenant_canary: { unexpected_allow: 1, unexpected_deny: 0, recent },
      backup_age_hours: 27, backup_valid: true, legacy_5735_pid: 7368,
    });
    expect(got.code).toBe(2);
    expect(got.body.status).toBe("CRITICAL");
    for (const code of ["bridge_unhealthy", "dashboard_unhealthy", "night_stale_pending",
      "backup_stale", "tenant_unexpected_allow", "tenant_denial_spike",
      "oauth_self_reply_scope_missing", "legacy_5735"]) {
      expect(got.body.alerts.some((row: { code: string }) => row.code === code)).toBeTrue();
    }
    expect(got.body.message).toContain("PID 7368");
    expect(got.body.message.length).toBeLessThanOrEqual(1900);
  });

  test("treats a corrupt latest backup as a backup failure", () => {
    const got = runFixture("bad-backup", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals,
      night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 1, backup_valid: false, legacy_5735_pid: null,
    });
    expect(got.body.alerts.some((row: { code: string }) => row.code === "backup_failure")).toBeTrue();
  });

  test("monitors multiple accounts with code plus entity identities and deterministic digest", () => {
    const common = {
      bridge_healthy: false, dashboard_healthy: true, account_available: true,
      ...freshSignals,
      readiness: { status: "active", ready_for_dry_run: true }, self_reply_sync: "active",
      canary_available: true, tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    };
    const got = runFixture("multi-account", { accounts: [
      { ...common, account_id: "acct_b", night_items: [], runner_heartbeats: freshHeartbeats({ insights: {
        state: "stale", last_run_at: "2026-09-21T23:59:00Z", age_seconds: 21660, healthy: false,
      } }) },
      { ...common, account_id: "acct_a", night_items: [], runner_heartbeats: freshHeartbeats({ insights: {
        state: "stale", last_run_at: "2026-09-21T23:59:00Z", age_seconds: 21660, healthy: false,
      } }) },
    ] });
    expect(got.body.accounts).toEqual(["acct_a", "acct_b"]);
    expect(got.body.alerts.map((row: { code: string; entity: string }) => `${row.code}:${row.entity}`)).toEqual([
      "bridge_unhealthy:system:bridge", "runner_stale:acct_a:insights", "runner_stale:acct_b:insights",
    ]);
    expect(got.body.daily_digest).toMatchObject({ schema_version: "attention-digest.v1", account_count: 2, critical_count: 3 });
    expect(got.body.daily_digest.alert_identities).toEqual([
      "bridge_unhealthy:system:bridge", "runner_stale:acct_a:insights", "runner_stale:acct_b:insights",
    ]);
  });

  test("detects OAuth expiry and does not classify cancelled NIGHT work as missed", () => {
    const got = runFixture("oauth-night", {
      account_id: "acct_alpha", bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals,
      night_items: [
        { item_id: "cancelled", status: "blocked", batch_status: "cancelled", block_reason: "scheduled_window_expired", scheduled_at: "2026-09-22T05:00:00Z" },
        { item_id: "missed", status: "blocked", batch_status: "approved", block_reason: "scheduled_window_expired", scheduled_at: "2026-09-22T05:00:00Z" },
      ],
      readiness: { status: "active", ready_for_dry_run: true },
      credential_readiness: {
        publish: { ready: true, expires_at: "2026-09-22T07:00:00Z" },
        insights: { ready: true, expires_at: "2026-11-22T07:00:00Z" },
      },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.body.alerts.some((row: { code: string }) => row.code === "oauth_expiring")).toBeTrue();
    expect(got.body.alerts.filter((row: { code: string }) => row.code === "night_missed")).toHaveLength(1);
    expect(got.body.daily_digest).toMatchObject({ night_cancelled_count: 1, night_missed_count: 1 });
  });

  test("fails closed when live runner freshness evidence is unavailable", () => {
    const got = runFixture("freshness-unavailable", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      credential_readiness_available: true,
      credential_readiness: { publish: { ready: true }, insights: { ready: true } },
      night_attention: freshSignals.night_attention,
      insights_quarantine: freshSignals.insights_quarantine,
      night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.code).toBe(2);
    expect(got.body.status).toBe("CRITICAL");
    expect(got.body.alerts.map((row: { code: string; entity: string }) => `${row.code}:${row.entity}`)).toEqual([
      "runner_freshness_unavailable:acct_fixture:insights",
      "runner_freshness_unavailable:acct_fixture:night_batch",
      "runner_freshness_unavailable:acct_fixture:outcome",
      "runner_freshness_unavailable:acct_fixture:runner_heartbeats",
    ]);
    expect(got.body.daily_digest.critical_count).toBe(4);
  });

  test("distinguishes stale runner evidence from unavailable evidence", () => {
    const got = runFixture("freshness-stale", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals, runner_heartbeats: freshHeartbeats({ insights: {
        state: "stale", last_run_at: "2026-09-21T23:59:00Z", age_seconds: 21660, healthy: false,
      } }),
      night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.body.alerts).toEqual([{
      code: "runner_stale", entity: "acct_fixture:insights", detail: "insights runner heartbeat is 361m old",
    }]);
  });

  test("rejects future and empty heartbeat evidence", () => {
    const common = {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals, night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    };
    const future = runFixture("heartbeat-future", {
      ...common, runner_heartbeats: freshHeartbeats({ night_batch: {
        state: "future", run_status: "succeeded", last_run_at: "2026-09-22T06:01:00Z",
        age_seconds: null, expected: "unknown", healthy: false,
      } }),
    });
    expect(future.body.alerts).toEqual([{
      code: "runner_freshness_unavailable", entity: "acct_fixture:night_batch",
      detail: "night_batch heartbeat timestamp is invalid",
    }]);
    const empty = runFixture("heartbeat-empty", { ...common, runner_heartbeats: [] });
    expect(empty.body.alerts.map((row: { entity: string }) => row.entity)).toEqual([
      "acct_fixture:insights", "acct_fixture:night_batch", "acct_fixture:outcome",
    ]);
  });

  test("uses the monitor-owned heartbeat threshold for fresh and stale evidence", () => {
    const common = {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals, night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    };
    expect(runFixture("heartbeat-fresh", common).body.alerts).toEqual([]);
    const stale = runFixture("heartbeat-stale", {
      ...common,
      runner_heartbeats: freshHeartbeats({ outcome: {
        state: "stale", run_status: "succeeded", last_run_at: "2026-09-22T03:59:00Z",
        age_seconds: 7260, expected: "unknown", healthy: false,
      } }),
    });
    expect(stale.body.alerts).toEqual([{
      code: "runner_stale", entity: "acct_fixture:outcome",
      detail: "outcome runner heartbeat is 121m old",
    }]);
  });

  test("fails closed for an omitted runner, naive timestamp, and failed run", () => {
    const common = {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals, night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    };
    const omitted = runFixture("heartbeat-omitted", {
      ...common, runner_heartbeats: freshHeartbeats().filter((row) => row.runner_name !== "outcome"),
    });
    expect(omitted.body.alerts).toEqual([{
      code: "runner_freshness_unavailable", entity: "acct_fixture:outcome",
      detail: "Required outcome heartbeat is missing",
    }]);
    const naive = runFixture("heartbeat-naive", { ...common, runner_heartbeats: freshHeartbeats({ insights: {
      last_run_at: "2026-09-22T05:30:00", healthy: true,
    } }) });
    expect(naive.body.alerts[0]).toMatchObject({
      code: "runner_freshness_unavailable", entity: "acct_fixture:insights",
    });
    const failed = runFixture("heartbeat-failed", { ...common, runner_heartbeats: freshHeartbeats({ insights: {
      run_status: "failed", healthy: false,
    } }) });
    expect(failed.body.alerts).toEqual([{
      code: "runner_failed", entity: "acct_fixture:insights", detail: "insights runner last run failed",
    }]);
  });

  test("rejects malformed or unsupported sealed heartbeat evidence", () => {
    const common = {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals, night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    };
    const malformed = runFixture("heartbeat-malformed", { ...common, runner_heartbeats: freshHeartbeats({ insights: {
      state: "invalid", run_status: "failed", last_run_at: "bad",
      age_seconds: null, expected: "unknown", healthy: false,
    } }) });
    expect(malformed.body.alerts).toEqual([{
      code: "runner_freshness_unavailable", entity: "acct_fixture:insights",
      detail: "insights heartbeat timestamp is invalid",
    }]);
    const disabled = runFixture("heartbeat-disabled", { ...common, runner_heartbeats: freshHeartbeats({ insights: {
      state: "disabled", run_status: "succeeded", last_run_at: "2026-09-22T05:30:00Z",
      age_seconds: 1800, expected: "unknown", healthy: true,
    } }) });
    expect(disabled.body.alerts).toEqual([{
      code: "runner_freshness_unavailable", entity: "acct_fixture:insights",
      detail: "insights heartbeat enum is unsupported",
    }]);
  });

  test("never reports truncated NIGHT or quarantine coverage as complete", () => {
    const got = runFixture("partial-coverage", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals,
      night_attention: { total: 101, items_truncated: true, coverage: "partial" },
      insights_quarantine: { total: 51, items: [], items_truncated: true, coverage: "partial" },
      night_items: [], readiness: { status: "active", ready_for_dry_run: true },
      self_reply_sync: "active", canary_available: true,
      tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.body.alerts).toEqual([
      { code: "collection_coverage_partial", entity: "acct_fixture:insights_quarantine", detail: "insights quarantine coverage is partial" },
      { code: "collection_coverage_partial", entity: "acct_fixture:night_attention", detail: "NIGHT coverage is partial" },
    ]);
  });

  test("retains genuine NIGHT misses for 96h and excludes expired or cancelled entries", () => {
    const got = runFixture("night-lookback", {
      account_id: "acct_alpha", bridge_healthy: true, dashboard_healthy: true, account_available: true,
      ...freshSignals,
      night_items: [
        { item_id: "inside", status: "blocked", block_reason: "scheduled_window_expired", scheduled_at: "2026-09-18T22:00:00Z" },
        { item_id: "outside", status: "blocked", block_reason: "scheduled_window_expired", scheduled_at: "2026-09-18T05:00:00Z" },
        { item_id: "cancelled", status: "blocked", block_reason: "batch_cancelled", scheduled_at: "2026-09-18T22:00:00Z" },
      ],
      readiness: { status: "active", ready_for_dry_run: true }, self_reply_sync: "active",
      canary_available: true, tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.body.alerts.filter((row: { code: string }) => row.code === "night_missed")).toEqual([{
      code: "night_missed", entity: "night:inside", detail: "A NIGHT item expired without an attempt",
    }]);
    expect(got.body.daily_digest).toMatchObject({ night_cancelled_count: 1, night_missed_count: 1 });
  });

  test("keeps OAuth unavailable in both top-level alerts and employee findings", () => {
    const got = runFixture("oauth-unavailable", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
      credential_readiness_available: false,
      credential_readiness: { credential_material: "must-not-leak" },
      runner_heartbeats: freshSignals.runner_heartbeats, night_items: [],
      night_attention: freshSignals.night_attention,
      insights_quarantine: freshSignals.insights_quarantine,
      readiness: { status: "active", ready_for_dry_run: true }, self_reply_sync: "active",
      canary_available: true, tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    });
    expect(got.body.alerts.some((row: { code: string }) => row.code === "oauth_readiness_unavailable")).toBeTrue();
    expect(got.body.employee_input.findings.find((row: { check_code: string }) => row.check_code === "oauth_readiness"))
      .toMatchObject({ observed: "unreadable", age_minutes: null });
    expect(JSON.stringify(got.body)).not.toContain("must-not-leak");
  });

  test("treats malformed authoritative OAuth readiness as unavailable everywhere", () => {
    for (const [index, credential_readiness] of [
      null, [], "invalid", 7, {}, { publish: {}, insights: {} },
    ].entries()) {
      const got = runFixture(`oauth-malformed-${index}`, {
        bridge_healthy: true, dashboard_healthy: true, account_available: true,
        ...freshSignals, credential_readiness_available: true, credential_readiness,
        night_items: [], readiness: { status: "active", ready_for_dry_run: true },
        self_reply_sync: "active", canary_available: true,
        tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
        backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
      });
      expect(got.body.alerts.some((row: { code: string }) => row.code === "oauth_readiness_unavailable")).toBeTrue();
      expect(got.body.employee_input.findings.find((row: { check_code: string }) => row.check_code === "oauth_readiness"))
        .toMatchObject({ observed: "unreadable", age_minutes: null });
    }
  });

  test("reports all-account discovery transport, parse, and empty failures as deterministic JSON", async () => {
    const unreachable = await runAllAccounts("http://127.0.0.1:1");
    const repeated = await runAllAccounts("http://127.0.0.1:1");
    expect(unreachable).toEqual(repeated);
    expect(unreachable).toMatchObject({ code: 2, stderr: "", body: {
      status: "CRITICAL", accounts: [], employee_input: null,
      alerts: [{
        code: "account_discovery_unavailable", entity: "system:account-discovery",
        detail: "Active account discovery could not be read",
      }],
    } });

    let response = new Response("{", { status: 200 });
    const server = Bun.serve({ port: 0, fetch() { return response; } });
    try {
      const bridgeUrl = `http://127.0.0.1:${server.port}`;
      expect(await runAllAccounts(bridgeUrl)).toMatchObject({ code: 2, stderr: "", body: {
        alerts: [{ code: "account_discovery_unavailable", entity: "system:account-discovery" }],
      } });
      response = Response.json({ accounts: [], meta: { schema_version: 1 } });
      expect(await runAllAccounts(bridgeUrl)).toMatchObject({ code: 2, stderr: "", body: {
        status: "CRITICAL", accounts: [], employee_input: null,
        alerts: [{ code: "account_discovery_empty", entity: "system:account-discovery" }],
      } });
    } finally {
      server.stop(true);
    }
  });

  test("produces the same digest for identical persisted inputs", () => {
    const fixture = {
      accounts: [
        { account_id: "acct_b", bridge_healthy: true, dashboard_healthy: true, account_available: true,
          ...freshSignals, night_items: [], readiness: { status: "active", ready_for_dry_run: true }, self_reply_sync: "active",
          canary_available: true, tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
          backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null },
        { account_id: "acct_a", bridge_healthy: true, dashboard_healthy: true, account_available: true,
          ...freshSignals, night_items: [], readiness: { status: "active", ready_for_dry_run: true }, self_reply_sync: "active",
          canary_available: true, tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
          backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null },
      ],
    };
    expect(runFixture("digest-one", fixture).body.daily_digest)
      .toEqual(runFixture("digest-two", fixture).body.daily_digest);
  });

  test("notifier is strict, deduplicated, cooldown-aware, and recovery-aware", () => {
    const monitorSource = readFileSync(monitor, "utf8");
    expect(monitorSource).toContain('parser.add_argument("--scope", required=True)');
    expect(monitorSource).toContain('parser.add_argument("--account-id", action="append")');
    expect(monitorSource).toContain('parser.add_argument("--all-accounts", action="store_true")');
    expect(monitorSource).not.toContain('default="acct_8ssana"');
    expect(notifier).toContain("set -euo pipefail");
    expect(notifier).toContain("DISCORD_WEBHOOK_URL is not configured");
    expect(notifier).toContain("exit 3");
    expect(notifier).toContain('^2[0-9][0-9]$');
    expect(notifier).toContain("COOLDOWN_SECONDS=21600");
    expect(notifier).toContain("duplicate suppressed");
    expect(notifier).toContain("recovery suppressed");
    expect(notifier).toContain('IKORABU_NOTIFICATION_TRANSPORT_ENABLED:-}');
    expect(notifier).toContain('message="${message:0:1900}"');
    expect(notifier).not.toContain('echo "$WEBHOOK_URL"');
  });

  test("notifier accepts only 2xx, cools down duplicates, and recovers once", async () => {
    let status = 204;
    let requests = 0;
    const server = Bun.serve({ port: 0, fetch() { requests += 1; return new Response("", { status }); } });
    const dir = resolve(root, ".runtime/tests/alert01-notifier");
    const stateFile = resolve(dir, "state.json");
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    try {
      const webhook = `http://127.0.0.1:${server.port}/hook`;
      expect((await notify(webhook, stateFile)).code).toBe(0);
      expect((await notify(webhook, stateFile)).code).toBe(0);
      expect(requests).toBe(1);
      expect((await notify(webhook, stateFile, "recovery")).code).toBe(0);
      expect((await notify(webhook, stateFile, "recovery")).code).toBe(0);
      expect(requests).toBe(2);
      status = 500;
      expect((await notify(webhook, resolve(dir, "failure.json"))).code).toBe(4);
      expect(requests).toBe(3);
    } finally {
      server.stop(true);
    }
  });

  test("notification transport is disabled by default", async () => {
    if (!bash) return;
    const child = Bun.spawn([bash, notifierPath, "fixture message"], {
      cwd: root, env: { ...process.env, IKORABU_NOTIFICATION_TRANSPORT_ENABLED: "", DISCORD_WEBHOOK_URL: "http://127.0.0.1/never" },
      stdout: "pipe", stderr: "pipe",
    });
    expect(await child.exited).toBe(5);
    expect(await new Response(child.stderr).text()).toContain("transport is disabled");
  });
});
