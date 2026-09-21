import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..", "..");
const script = resolve(root, "scripts", "live-publish-client.sh");
const genericClient = resolve(root, "scripts", "capability-client.sh");
const bash = process.platform === "win32"
  ? "C:\\Program Files\\Git\\bin\\bash.exe"
  : "bash";
const servers: ReturnType<typeof Bun.serve>[] = [];
const adminKey = "manual-live-admin-key-at-least-32-characters";
const hash = "a".repeat(64);

afterEach(() => {
  while (servers.length) servers.pop()!.stop(true);
});

function args(actor = "takumi-human") {
  const confirmation =
    `LIVE PUBLISH account=acct_test handle=@fixture content=cv-test version=2 hash=${hash}`;
  return [
    "--account-id", "acct_test",
    "--content-id", "cv-test",
    "--expected-version", "2",
    "--expected-content-hash", hash,
    "--expected-handle", "fixture",
    "--actor", actor,
    "--request-id", "one-live-request",
    "--live-confirmation", confirmation,
  ];
}

async function runLive(
  input: string,
  extraEnv: Record<string, string> = {},
  actor = "takumi-human",
) {
  const proc = Bun.spawn([bash, script, ...args(actor)], {
    cwd: root,
    env: { ...Bun.env, ...extraEnv },
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });
  proc.stdin.write(input);
  proc.stdin.end();
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

function mockLive(status = 200) {
  let request: Request | undefined;
  let payload: any;
  let calls = 0;
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      calls += 1;
      request = req;
      payload = await req.json();
      if (status !== 200) {
        return Response.json({
          detail: { code: "publish_safety_gate_blocked", blocking: ["account_not_active"] },
        }, { status });
      }
      return Response.json({
        status: "succeeded",
        capability: "threads.publish.live",
        request_id: payload.request_id,
        account_id: payload.account_id,
        content_id: payload.content_id,
        version: payload.expected_version,
        content_hash: payload.expected_content_hash,
        mode: "live",
        publication_id: "pub-live-fixture",
        duplicate: false,
        workflow_state: "metrics_pending",
        approval_state: "approved",
        parts_state: [],
        attempts: 1,
        requires_human: false,
        warnings: [],
        error: null,
      });
    },
  });
  servers.push(server);
  return { server, request: () => request, payload: () => payload, calls: () => calls };
}

describe("HQ10A manual live publish client", () => {
  test("is separate from the ordinary Agent capability allowlist", () => {
    expect(existsSync(script)).toBe(true);
    expect(Bun.spawnSync([bash, "-n", script]).exitCode).toBe(0);
    const ordinary = readFileSync(genericClient, "utf8");
    expect(ordinary).not.toContain("threads.publish.live");
    expect(ordinary).not.toContain("live-publish-client.sh");
  });

  test("requires a separately supplied admin key before HTTP", async () => {
    const mock = mockLive();
    const result = await runLive("", {
      THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
    });
    expect(result.exitCode).not.toBe(0);
    expect(mock.calls()).toBe(0);
    expect(result.stderr).toContain("live admin key is required");
  });

  test("sends one exact live request without exposing the admin key", async () => {
    const mock = mockLive();
    const result = await runLive(`${adminKey}\n`, {
      THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
    });
    expect(result.exitCode).toBe(0);
    expect(mock.calls()).toBe(1);
    expect(mock.request()!.headers.get("x-threads-live-admin-key")).toBe(adminKey);
    expect(new URL(mock.request()!.url).pathname).toBe("/autopilot/v2/publish/live");
    expect(mock.payload().mode).toBe("live");
    expect(mock.payload().live_confirmation).toContain("content=cv-test version=2");
    expect(result.stdout + result.stderr).not.toContain(adminKey);
    expect(JSON.parse(result.stdout).capability).toBe("threads.publish.live");
  });

  test("blocks automation actors before reading a key or calling HTTP", async () => {
    const mock = mockLive();
    const result = await runLive(`${adminKey}\n`, {
      THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
    }, "nightly-scheduler");
    expect(result.exitCode).not.toBe(0);
    expect(mock.calls()).toBe(0);
    expect(result.stderr).toContain("automation/scheduler actors");
  });

  test("never retries an HTTP failure", async () => {
    const mock = mockLive(409);
    const result = await runLive(`${adminKey}\n`, {
      THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
    });
    expect(result.exitCode).not.toBe(0);
    expect(mock.calls()).toBe(1);
    expect(result.stderr).toContain("do not resend");
    expect(result.stdout + result.stderr).not.toContain(adminKey);
  });
});
