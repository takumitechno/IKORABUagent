import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

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

describe("Control Plane CRITICAL monitor", () => {
  test("reports a healthy snapshot without leaking source values", () => {
    const got = runFixture("healthy", {
      bridge_healthy: true, dashboard_healthy: true, account_available: true,
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

  test("aggregates all critical classes and includes legacy PID", () => {
    const recent = Array.from({ length: 5 }, () => ({ decision: "deny", timestamp: "2026-09-22T05:55:00Z" }));
    const got = runFixture("critical", {
      bridge_healthy: false, dashboard_healthy: false, account_available: true,
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
      readiness: { status: "active", ready_for_dry_run: true }, self_reply_sync: "active",
      canary_available: true, tenant_canary: { unexpected_allow: 0, unexpected_deny: 0, recent: [] },
      backup_age_hours: 2, backup_valid: true, legacy_5735_pid: null,
    };
    const got = runFixture("multi-account", { accounts: [
      { ...common, account_id: "acct_b", night_items: [], insights_age_minutes: 361 },
      { ...common, account_id: "acct_a", night_items: [], insights_age_minutes: 361 },
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
      night_items: [
        { item_id: "cancelled", status: "blocked", batch_status: "cancelled", block_reason: "scheduled_window_expired", scheduled_at: "2026-09-22T05:00:00Z" },
        { item_id: "missed", status: "blocked", batch_status: "approved", block_reason: "scheduled_window_expired", scheduled_at: "2026-09-22T05:00:00Z" },
      ],
      readiness: { status: "active", ready_for_dry_run: true },
      credential_readiness_available: true,
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
