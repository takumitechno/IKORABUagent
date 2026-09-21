import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..", "..");
const script = resolve(root, "scripts", "capability-client.sh");
const bash = process.platform === "win32"
  ? "C:\\Program Files\\Git\\bin\\bash.exe"
  : "bash";
const servers: ReturnType<typeof Bun.serve>[] = [];

afterEach(() => {
  while (servers.length) servers.pop()!.stop(true);
});

async function run(
  args: string[],
  env: Record<string, string> = {},
  cwd = root,
) {
  const proc = Bun.spawn([bash, script, ...args], {
    cwd,
    env: { ...Bun.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

function mockBridge(status = 200, expectedKey?: string) {
  let request: Request | undefined;
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      request = req;
      if (status !== 200) return Response.json({ detail: "unavailable" }, { status });
      const url = new URL(req.url);
      return Response.json({
        status: "not_ready",
        account_id: url.searchParams.get("account_id"),
        capability: "preflight",
        request_id: url.searchParams.get("request_id") ?? "generated-id",
        checks: {
          account_exists: true,
          authorization_valid: expectedKey === undefined
            ? req.headers.has("authorization")
            : req.headers.get("authorization") === `Bearer ${expectedKey}`,
        },
        warnings: [],
        error: null,
      });
    },
  });
  servers.push(server);
  return { server, request: () => request };
}

function mockPreview(options: {
  status?: number;
  invalidJson?: boolean;
  delayMs?: number;
  expectedKey?: string;
} = {}) {
  let request: Request | undefined;
  let payload: any;
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      request = req;
      if (options.delayMs) await Bun.sleep(options.delayMs);
      if (options.status && options.status !== 200) {
        return Response.json({ detail: "internal detail must not escape" }, { status: options.status });
      }
      if (options.invalidJson) return new Response("not-json");
      payload = await req.json();
      return Response.json({
        status: "success",
        account_id: payload.account_id,
        capability: "threads.content.preview",
        request_id: payload.request_id ?? "generated-preview-id",
        plan_id: "preview-plan-test",
        topic: payload.topic ?? "planned-topic",
        content_role: payload.content_role ?? "reach",
        selected_reference_ids: ["rp-test"],
        reference_count: 1,
        provider: null,
        model: null,
        would_call_provider: false,
        estimated_cost_usd: 0,
        warnings: ["NOT APPROVED"],
        readiness: { account_status: "draft" },
        checks: { provider_called: false },
        data: { dry_run: payload.dry_run, publishable: false },
        provenance: {
          transport: "mock",
          authorization_valid: options.expectedKey === undefined
            ? true
            : req.headers.get("authorization") === `Bearer ${options.expectedKey}`,
        },
        cost: { estimated_usd: 0, currency: "USD", would_call_provider: false },
        auditId: null,
        error: null,
      });
    },
  });
  servers.push(server);
  return { server, request: () => request, payload: () => payload };
}

function mockGeneration(options: { status?: number; expectedKey?: string } = {}) {
  let request: Request | undefined;
  let payload: any;
  let calls = 0;
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      calls += 1;
      request = req;
      payload = await req.json();
      if (options.status && options.status !== 200) {
        return Response.json(
          { detail: { code: "provider_not_configured", message: "must not escape" } },
          { status: options.status },
        );
      }
      return Response.json({
        status: "human_approval_pending",
        account_id: payload.account_id,
        capability: "threads.content.generate",
        request_id: payload.request_id ?? "generated-paid-id",
        content_id: "content-test",
        version: 1,
        attempt: 1,
        attempt_count: 1,
        qa_verdict: "pass",
        provider: "anthropic",
        model: "configured-model",
        estimated_cost_usd: 0.01,
        job_id: null,
        warnings: ["NOT APPROVED"],
        cost: { estimated_usd: 0.01, currency: "USD", would_call_provider: true },
        error: null,
      });
    },
  });
  servers.push(server);
  return {
    server,
    request: () => request,
    payload: () => payload,
    calls: () => calls,
  };
}

function mockApproval(options: { status?: number; expectedKey?: string } = {}) {
  let request: Request | undefined;
  let payload: any;
  let calls = 0;
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      calls += 1;
      request = req;
      const url = new URL(req.url);
      const action = url.pathname.split("/").at(-1)!;
      if (req.method === "POST") payload = await req.json();
      if (options.status && options.status !== 200) {
        return Response.json({ detail: "approval internals must not escape" }, { status: options.status });
      }
      if (req.method === "GET") {
        return Response.json({
          status: "success",
          capability: "threads.approval.get",
          request_id: url.searchParams.get("request_id") ?? "generated-get-id",
          account_id: url.searchParams.get("account_id"),
          content_id: "cv-test",
          version: 1,
          topic: "topic-a",
          content_role: "reach",
          body: "review this exact body",
          content_hash: "a".repeat(64),
          qa: { verdict: "pass" },
          workflow_state: "human_approval_pending",
          approval_state: "pending",
          publishable: false,
          warnings: ["manual human review required"],
          error: null,
        });
      }
      return Response.json({
        status: action === "approve" ? "approved" : "rejected",
        capability: `threads.approval.${action}`,
        request_id: payload.request_id,
        account_id: payload.account_id,
        content_id: payload.content_id,
        version: payload.expected_version,
        content_hash: payload.expected_content_hash,
        workflow_state: action === "approve" ? "publish_ready" : "rejected",
        approval_state: action === "approve" ? "approved" : "rejected",
        actor: payload.actor,
        warnings: ["strong human authentication is not available"],
        error: null,
      });
    },
  });
  servers.push(server);
  return { server, request: () => request, payload: () => payload, calls: () => calls };
}

function mockSafetyStatus() {
  let request: Request | undefined;
  let calls = 0;
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      calls += 1;
      request = req;
      const url = new URL(req.url);
      return Response.json({
        status: "success",
        capability: "threads.safety.status",
        request_id: url.searchParams.get("request_id") ?? "generated-safety-id",
        account_id: url.searchParams.get("account_id"),
        account_status: "draft",
        global_stop: false,
        account_stop: false,
        capability_stop: false,
        approval_mode: "manual_required",
        publish_readiness: { allowed: false, blocking: ["account_not_active"] },
        unresolved_ambiguous_publication: false,
        rate_guard_ready: false,
        rate_policy: {
          min_interval_seconds: null,
          hourly_limit: null,
          daily_limit: null,
        },
        warnings: ["read-only"],
        error: null,
      });
    },
  });
  servers.push(server);
  return { server, request: () => request, calls: () => calls };
}

function mockRevision(options: { status?: number } = {}) {
  let request: Request | undefined;
  let payload: any;
  let calls = 0;
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      calls += 1;
      request = req;
      payload = await req.json();
      if (options.status && options.status !== 200) {
        return Response.json({ detail: "revision internals must not escape" }, { status: options.status });
      }
      return Response.json({
        status: "human_approval_pending",
        capability: "threads.content.revise",
        request_id: payload.request_id,
        account_id: payload.account_id,
        source_content_id: payload.content_id,
        content_id: "cv-revised",
        version: 2,
        content_hash: "d".repeat(64),
        body: "revised body",
        qa: { verdict: "pass", findings: [] },
        workflow_state: "human_approval_pending",
        approval_state: "pending",
        copy_guard: "pass",
        provider: "anthropic",
        model: "configured-model",
        provider_call_count: 1,
        writer_attempt_count: 1,
        input_tokens: 100,
        output_tokens: 40,
        estimated_cost_usd: 0.0123,
        warnings: ["revision is NOT approval or publication"],
        error: null,
      });
    },
  });
  servers.push(server);
  return { server, request: () => request, payload: () => payload, calls: () => calls };
}

function mockPublish(options: { status?: number } = {}) {
  let request: Request | undefined;
  let payload: any;
  let calls = 0;
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      calls += 1;
      request = req;
      payload = await req.json();
      if (options.status && options.status !== 200) {
        return Response.json({ detail: "publish internals must not escape" }, { status: options.status });
      }
      return Response.json({
        status: "succeeded",
        capability: "threads.publish",
        request_id: payload.request_id,
        account_id: payload.account_id,
        content_id: payload.content_id,
        version: payload.expected_version,
        content_hash: payload.expected_content_hash,
        mode: "dry_run",
        dry_run: true,
        publication_id: "pub-dry-run",
        duplicate: false,
        workflow_state: "publish_ready",
        approval_state: "approved",
        parts_state: [],
        attempts: 1,
        warnings: ["dry-run only"],
        error: null,
      });
    },
  });
  servers.push(server);
  return { server, request: () => request, payload: () => payload, calls: () => calls };
}

describe("HQ04 capability client", () => {
  test("is valid bash and exposes only allowlisted v2 content capabilities", async () => {
    expect(existsSync(script)).toBe(true);
    const check = Bun.spawnSync([bash, "-n", script]);
    expect(check.exitCode).toBe(0);
    const source = readFileSync(script, "utf8");
    expect(source).toContain("/autopilot/v2/preflight");
    expect(source).toContain("/autopilot/v2/generate");
    expect(source).toContain("/autopilot/v2/publish");
  });

  test("rejects a missing account and an unknown capability before HTTP", async () => {
    const missing = await run(["--capability", "preflight"]);
    expect(missing.exitCode).not.toBe(0);
    expect(missing.stderr).toContain("--account-id is required");

    const unknown = await run([
      "--capability", "generate", "--account-id", "acct_8ssana",
    ]);
    expect(unknown.exitCode).not.toBe(0);
    expect(unknown.stderr).toContain("unknown capability");
  });

  test("emits JSON from localhost, forwards metadata, and runs outside the repo", async () => {
    const secret = "do-not-print-this-key";
    const mock = mockBridge(200, secret);
    const result = await run(
      [
        "--capability", "preflight",
        "--account-id", "acct_8ssana",
        "--agent-id", "hitomi-selector",
        "--request-id", "req-hq04",
      ],
      {
        THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
        THREADS_BRIDGE_API_KEY: secret,
      },
      process.platform === "win32" ? "C:\\Windows" : "/tmp",
    );

    expect(result.exitCode).toBe(0);
    const body = JSON.parse(result.stdout);
    expect(body.account_id).toBe("acct_8ssana");
    expect(body.checks.authorization_valid).toBe(true);
    expect(result.stderr).toBe("");
    expect(result.stdout + result.stderr).not.toContain(secret);
    const url = new URL(mock.request()!.url);
    expect(url.pathname).toBe("/autopilot/v2/preflight");
    expect(url.searchParams.get("actor")).toBe("hitomi-selector");
    expect(url.searchParams.get("request_id")).toBe("req-hq04");
    expect(mock.request()).toBeDefined();
  });

  test("returns non-zero for HTTP errors", async () => {
    const mock = mockBridge(503);
    const result = await run(
      ["--capability", "preflight", "--account-id", "acct_8ssana"],
      { THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}` },
    );
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("HTTP 503");
  });

  test("requires a key for non-local origins without making a request", async () => {
    const result = await run(
      ["--capability", "preflight", "--account-id", "acct_8ssana"],
      { THREADS_BRIDGE_URL: "https://bridge.example.invalid" },
    );
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("API_KEY is required");
  });

  test("routes threads.content.preview as POST JSON and preserves correlation", async () => {
    const secret = "preview-secret-not-for-output";
    const mock = mockPreview({ expectedKey: secret });
    const result = await run(
      [
        "--capability", "threads.content.preview",
        "--account-id", "acct_8ssana",
        "--agent-id", "hq07-preview",
        "--request-id", "req-preview-7",
        "--topic", "topic-a",
        "--content-role", "reach",
      ],
      {
        THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
        THREADS_BRIDGE_API_KEY: secret,
      },
      process.platform === "win32" ? "C:\\Windows" : "/tmp",
    );

    expect(result.exitCode).toBe(0);
    const body = JSON.parse(result.stdout);
    expect(body.capability).toBe("threads.content.preview");
    expect(body.request_id).toBe("req-preview-7");
    expect(body.provenance.authorization_valid).toBe(true);
    expect(mock.request()!.method).toBe("POST");
    expect(new URL(mock.request()!.url).pathname).toBe("/autopilot/v2/generate-preview");
    expect(mock.payload()).toEqual({
      account_id: "acct_8ssana",
      dry_run: true,
      actor: "hq07-preview",
      request_id: "req-preview-7",
      topic: "topic-a",
      content_role: "reach",
    });
    expect(result.stdout + result.stderr).not.toContain(secret);
  });

  test("normalizes preview 404, 409, and 503 without exposing response details", async () => {
    for (const status of [404, 409, 503]) {
      const mock = mockPreview({ status });
      const result = await run(
        ["--capability", "threads.content.preview", "--account-id", "acct_8ssana"],
        { THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}` },
      );
      expect(result.exitCode).not.toBe(0);
      const normalized = JSON.parse(result.stdout);
      expect(normalized.status).toBe("error");
      expect(normalized.error.code).toBe(`bridge_http_${status}`);
      expect(result.stdout).not.toContain("internal detail");
      expect(result.stderr).toContain(`HTTP ${status}`);
    }
  });

  test("normalizes invalid preview JSON", async () => {
    const mock = mockPreview({ invalidJson: true });
    const result = await run(
      ["--capability", "threads.content.preview", "--account-id", "acct_8ssana"],
      { THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}` },
    );
    expect(result.exitCode).not.toBe(0);
    expect(JSON.parse(result.stdout).error.code).toBe("invalid_bridge_json");
    expect(result.stderr).toContain("invalid JSON");
  });

  test("bounds preview timeout and returns a normalized transport failure", async () => {
    const mock = mockPreview({ delayMs: 500 });
    const result = await run(
      ["--capability", "threads.content.preview", "--account-id", "acct_8ssana"],
      {
        THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}`,
        THREADS_BRIDGE_CONNECT_TIMEOUT_SEC: "0.1",
        THREADS_BRIDGE_TIMEOUT_SEC: "0.1",
      },
    );
    expect(result.exitCode).not.toBe(0);
    expect(JSON.parse(result.stdout).error.code).toBe("bridge_transport_error");
  });

  test("still rejects generic approval, publishing, arm, and benchmark mutation capabilities", async () => {
    for (const capability of ["approve", "publish", "account.arm", "benchmark.import"]) {
      const result = await run([
        "--capability", capability, "--account-id", "acct_8ssana",
      ]);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain("unknown capability");
    }
  });

  test("routes approval inspection as read-only GET", async () => {
    const secret = "approval-get-secret";
    const mock = mockApproval({ expectedKey: secret });
    const result = await run([
      "--capability", "threads.approval.get",
      "--account-id", "acct_8ssana",
      "--content-id", "cv-test",
      "--request-id", "req-get-1",
    ], {
      THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
      THREADS_BRIDGE_API_KEY: secret,
    });
    expect(result.exitCode).toBe(0);
    const body = JSON.parse(result.stdout);
    expect(body.capability).toBe("threads.approval.get");
    expect(body.topic).toBe("topic-a");
    expect(body.content_role).toBe("reach");
    expect(body.body).toBe("review this exact body");
    expect(body.publishable).toBe(false);
    expect(mock.request()!.method).toBe("GET");
    const url = new URL(mock.request()!.url);
    expect(url.pathname).toBe("/autopilot/v2/approvals/cv-test");
    expect(url.searchParams.get("account_id")).toBe("acct_8ssana");
    expect(url.searchParams.get("request_id")).toBe("req-get-1");
    expect(result.stdout + result.stderr).not.toContain(secret);
  });

  test("routes safety status as read-only GET", async () => {
    const mock = mockSafetyStatus();
    const result = await run([
      "--capability", "threads.safety.status",
      "--account-id", "acct_8ssana",
      "--content-id", "cv-test",
      "--request-id", "req-safety-1",
    ], { THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}` });
    expect(result.exitCode).toBe(0);
    const body = JSON.parse(result.stdout);
    expect(body.capability).toBe("threads.safety.status");
    expect(body.approval_mode).toBe("manual_required");
    expect(body.rate_guard_ready).toBe(false);
    expect(mock.calls()).toBe(1);
    expect(mock.request()!.method).toBe("GET");
    const url = new URL(mock.request()!.url);
    expect(url.pathname).toBe("/autopilot/v2/safety/status");
    expect(url.searchParams.get("account_id")).toBe("acct_8ssana");
    expect(url.searchParams.get("content_id")).toBe("cv-test");
  });

  test("routes exact-version human approval once with no automatic retry", async () => {
    const hash = "b".repeat(64);
    const mock = mockApproval();
    const result = await run([
      "--capability", "threads.approval.approve",
      "--account-id", "acct_8ssana",
      "--content-id", "cv-test",
      "--expected-version", "2",
      "--expected-content-hash", hash,
      "--agent-id", "takumi-human",
      "--request-id", "req-approve-1",
      "--confirm-human",
    ], { THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}` });
    expect(result.exitCode).toBe(0);
    expect(mock.calls()).toBe(1);
    expect(mock.request()!.method).toBe("POST");
    expect(new URL(mock.request()!.url).pathname).toBe("/autopilot/v2/approvals/cv-test/approve");
    expect(mock.payload()).toEqual({
      account_id: "acct_8ssana",
      content_id: "cv-test",
      expected_version: 2,
      expected_content_hash: hash,
      actor: "takumi-human",
      request_id: "req-approve-1",
      human_confirmed: true,
    });

    const failing = mockApproval({ status: 503 });
    const failed = await run([
      "--capability", "threads.approval.approve",
      "--account-id", "acct_8ssana", "--content-id", "cv-test",
      "--expected-version", "2", "--expected-content-hash", hash,
      "--agent-id", "takumi-human", "--request-id", "req-approve-2", "--confirm-human",
    ], { THREADS_BRIDGE_URL: `http://localhost:${failing.server.port}` });
    expect(failed.exitCode).not.toBe(0);
    expect(failing.calls()).toBe(1);
    expect(JSON.parse(failed.stdout).error.code).toBe("bridge_http_503");
    expect(failed.stdout).not.toContain("approval internals");
  });

  test("routes rejection reason and enforces the manual mutation contract", async () => {
    const hash = "c".repeat(64);
    const mock = mockApproval();
    const result = await run([
      "--capability", "threads.approval.reject",
      "--account-id", "acct_8ssana", "--content-id", "cv-test",
      "--expected-version", "1", "--expected-content-hash", hash,
      "--agent-id", "takumi-human", "--request-id", "req-reject-1",
      "--reason", "tone requires revision", "--confirm-human",
    ], { THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}` });
    expect(result.exitCode).toBe(0);
    expect(mock.payload().reason).toBe("tone requires revision");
    expect(mock.calls()).toBe(1);

    for (const args of [
      ["--expected-version", "1", "--expected-content-hash", hash, "--agent-id", "human", "--request-id", "req"],
      ["--expected-content-hash", hash, "--agent-id", "human", "--request-id", "req", "--confirm-human"],
      ["--expected-version", "1", "--agent-id", "human", "--request-id", "req", "--confirm-human"],
      ["--expected-version", "1", "--expected-content-hash", hash, "--request-id", "req", "--confirm-human"],
    ]) {
      const denied = await run([
        "--capability", "threads.approval.approve",
        "--account-id", "acct_8ssana", "--content-id", "cv-test", ...args,
      ]);
      expect(denied.exitCode).not.toBe(0);
    }

    const missingReason = await run([
      "--capability", "threads.approval.reject",
      "--account-id", "acct_8ssana", "--content-id", "cv-test",
      "--expected-version", "1", "--expected-content-hash", hash,
      "--agent-id", "human", "--request-id", "req", "--confirm-human",
    ]);
    expect(missingReason.exitCode).not.toBe(0);
    expect(missingReason.stderr).toContain("--reason is required");
  });

  test("routes human revision once with exact source identity and no retry", async () => {
    const hash = "a".repeat(64);
    const feedback = "短文のリズムを残し、男性心理を一つの原因に断定しない。";
    const mock = mockRevision();
    const result = await run([
      "--capability", "threads.content.revise",
      "--account-id", "acct_8ssana",
      "--content-id", "cv-source",
      "--expected-version", "1",
      "--expected-content-hash", hash,
      "--human-feedback", feedback,
      "--agent-id", "takumi-human",
      "--request-id", "req-revise-1",
      "--confirm-human",
    ], { THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}` });
    expect(result.exitCode).toBe(0);
    expect(mock.calls()).toBe(1);
    expect(mock.request()!.method).toBe("POST");
    expect(new URL(mock.request()!.url).pathname).toBe(
      "/autopilot/v2/contents/cv-source/revise",
    );
    expect(mock.payload()).toEqual({
      account_id: "acct_8ssana",
      content_id: "cv-source",
      expected_version: 1,
      expected_content_hash: hash,
      human_feedback: feedback,
      actor: "takumi-human",
      request_id: "req-revise-1",
      human_confirmed: true,
    });

    const failing = mockRevision({ status: 503 });
    const failed = await run([
      "--capability", "threads.content.revise",
      "--account-id", "acct_8ssana", "--content-id", "cv-source",
      "--expected-version", "1", "--expected-content-hash", hash,
      "--human-feedback", feedback, "--agent-id", "takumi-human",
      "--request-id", "req-revise-2", "--confirm-human",
    ], { THREADS_BRIDGE_URL: `http://localhost:${failing.server.port}` });
    expect(failed.exitCode).not.toBe(0);
    expect(failing.calls()).toBe(1);
    expect(JSON.parse(failed.stdout).error.code).toBe("bridge_http_503");
    expect(failed.stdout).not.toContain("revision internals");
  });

  test("revision requires human feedback and the full manual identity contract", async () => {
    const hash = "a".repeat(64);
    const common = [
      "--capability", "threads.content.revise",
      "--account-id", "acct_8ssana", "--content-id", "cv-source",
      "--expected-version", "1", "--expected-content-hash", hash,
      "--agent-id", "takumi-human", "--request-id", "req-revise",
      "--confirm-human",
    ];
    const noFeedback = await run(common);
    expect(noFeedback.exitCode).not.toBe(0);
    expect(noFeedback.stderr).toContain("--human-feedback is required");

    const noConfirmation = await run([
      ...common.slice(0, -1), "--human-feedback", "revise safely",
    ]);
    expect(noConfirmation.exitCode).not.toBe(0);
    expect(noConfirmation.stderr).toContain("--confirm-human is required");
  });

  test("routes paid generation once with only account actor and request id", async () => {
    const secret = "generate-transport-secret";
    const mock = mockGeneration({ expectedKey: secret });
    const result = await run(
      [
        "--capability", "threads.content.generate",
        "--account-id", "acct_8ssana",
        "--agent-id", "kiara-executor",
        "--request-id", "req-paid-1",
      ],
      {
        THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
        THREADS_BRIDGE_API_KEY: secret,
      },
    );
    expect(result.exitCode).toBe(0);
    const body = JSON.parse(result.stdout);
    expect(body.capability).toBe("threads.content.generate");
    expect(body.status).toBe("human_approval_pending");
    expect(mock.calls()).toBe(1);
    expect(mock.request()!.method).toBe("POST");
    expect(new URL(mock.request()!.url).pathname).toBe("/autopilot/v2/generate");
    expect(mock.payload()).toEqual({
      account_id: "acct_8ssana",
      actor: "kiara-executor",
      request_id: "req-paid-1",
    });
    expect(result.stdout + result.stderr).not.toContain(secret);
  });

  test("paid generation requires actor and rejects planning overrides", async () => {
    const missingActor = await run([
      "--capability", "threads.content.generate",
      "--account-id", "acct_8ssana",
    ]);
    expect(missingActor.exitCode).not.toBe(0);
    expect(missingActor.stderr).toContain("--agent-id is required");

    const override = await run([
      "--capability", "threads.content.generate",
      "--account-id", "acct_8ssana",
      "--agent-id", "kiara",
      "--topic", "caller-topic",
    ]);
    expect(override.exitCode).not.toBe(0);
    expect(override.stderr).toContain("overrides are not allowed");

    for (const flag of ["--provider", "--model"]) {
      const providerOverride = await run([
        "--capability", "threads.content.generate",
        "--account-id", "acct_8ssana",
        "--agent-id", "kiara",
        flag, "caller-controlled-value",
      ]);
      expect(providerOverride.exitCode).not.toBe(0);
      expect(providerOverride.stderr).toContain(`unknown argument: ${flag}`);
    }
  });

  test("paid generation does not automatically retry HTTP failure", async () => {
    const mock = mockGeneration({ status: 503 });
    const result = await run(
      [
        "--capability", "threads.content.generate",
        "--account-id", "acct_8ssana",
        "--agent-id", "kiara-executor",
      ],
      { THREADS_BRIDGE_URL: `http://localhost:${mock.server.port}` },
    );
    expect(result.exitCode).not.toBe(0);
    expect(mock.calls()).toBe(1);
    expect(JSON.parse(result.stdout).error.code).toBe("bridge_http_503");
    expect(result.stdout).not.toContain("must not escape");
  });

  test("routes threads.publish as one dry-run mutation request", async () => {
    const mock = mockPublish();
    const hash = "e".repeat(64);
    const result = await run([
      "--capability", "threads.publish",
      "--account-id", "acct_8ssana",
      "--content-id", "cv-test",
      "--expected-version", "2",
      "--expected-content-hash", hash,
      "--agent-id", "hq09a-operator",
      "--request-id", "publish-request-1",
      "--dry-run",
    ], { THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}` });
    expect(result.exitCode).toBe(0);
    expect(mock.calls()).toBe(1);
    expect(mock.request()!.method).toBe("POST");
    expect(new URL(mock.request()!.url).pathname).toBe("/autopilot/v2/publish");
    expect(mock.payload()).toEqual({
      account_id: "acct_8ssana", content_id: "cv-test",
      expected_version: 2, expected_content_hash: hash,
      actor: "hq09a-operator", request_id: "publish-request-1", dry_run: true,
    });
    expect(JSON.parse(result.stdout).workflow_state).toBe("publish_ready");
  });

  test("threads.publish requires explicit dry-run and never retries", async () => {
    const hash = "f".repeat(64);
    const args = [
      "--capability", "threads.publish", "--account-id", "acct_8ssana",
      "--content-id", "cv-test", "--expected-version", "2",
      "--expected-content-hash", hash, "--agent-id", "hq09a-operator",
      "--request-id", "publish-request-2",
    ];
    const rejected = await run(args);
    expect(rejected.exitCode).not.toBe(0);
    expect(rejected.stderr).toContain("--dry-run is required");

    const mock = mockPublish({ status: 503 });
    const failed = await run([...args, "--dry-run"], {
      THREADS_BRIDGE_URL: `http://127.0.0.1:${mock.server.port}`,
    });
    expect(failed.exitCode).not.toBe(0);
    expect(mock.calls()).toBe(1);
    expect(JSON.parse(failed.stdout).error.code).toBe("bridge_http_503");
  });
});
