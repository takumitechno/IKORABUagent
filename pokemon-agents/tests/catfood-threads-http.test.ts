import { afterEach, describe, expect, test } from "bun:test";
import { CATFOOD_THREADS_PINS, type CoeRequest } from "../web/lib/catfood-coe";
import { OperationalThreadsHttpAdapter, type ThreadsHttpResponse, type ThreadsHttpTransport } from "../web/lib/catfood-threads-http";

const children: ReturnType<typeof Bun.spawn>[] = [];
afterEach(() => { while (children.length) children.pop()!.kill(); });

const request: CoeRequest = { account_id: "acct_test", capability: null, assessment_mode: "LIVE", window_start: "2026-09-30T00:00:00Z", window_end: "2026-09-30T00:02:00Z", page_size: 500, cursor: null };
const response = (status: number, body: unknown, extra: Partial<ThreadsHttpResponse> = {}): ThreadsHttpResponse => ({ status, content_type: "application/json", location: null, body: JSON.stringify(body), ...extra });

describe("WP3 corrective concrete Threads HTTP adapter", () => {
  test("binds the accepted COE route, auth, query and raw duplicate-key rejection", () => {
    const calls: Parameters<ThreadsHttpTransport>[0][] = []; const transport: ThreadsHttpTransport = (value) => { calls.push(value); return response(200, { ok: true }); };
    const adapter = new OperationalThreadsHttpAdapter({ origin: "https://threads.example", bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }, transport);
    expect(adapter.operationalEvidence(request)).toMatchObject({ parsed: { ok: true }, receipt: { representation: "AUTHENTICATED_DECODED_BODY", byte_length: 11 } }); const call = calls[0]!; const url = new URL(call.url);
    expect([call.method, url.pathname, url.searchParams.get("assessment_mode"), call.headers["X-Threads-User-ID"]]).toEqual(["GET", "/autopilot/v2/operational-evidence", "LIVE", "controller"]);
    const duplicate = new OperationalThreadsHttpAdapter({ origin: "https://threads.example", bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }, () => ({ ...response(200, {}), body: '{"a":1,"a":2}' }));
    expect(() => duplicate.operationalEvidence(request)).toThrow("COE_DUPLICATE_JSON_KEY");
  });

  test("rejects redirects, preserves safe producer errors, and never blind-retries ambiguous mutations", () => {
    let calls = 0; const adapter = new OperationalThreadsHttpAdapter({ origin: "https://threads.example", bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }, () => { calls++; return response(503, { detail: { code: "runtime_guard_unavailable" } }); });
    expect(() => adapter.changeAuthority({ action: "grant" })).toThrow("MUTATION_OUTCOME_AMBIGUOUS"); expect(calls).toBe(1);
    const redirected = new OperationalThreadsHttpAdapter({ origin: "https://threads.example", bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }, () => response(307, {}, { location: "https://foreign.example/steal" }));
    expect(() => redirected.operationalEvidence(request)).toThrow("THREADS_HTTP_REDIRECT_REJECTED");
  });

  test("tenant probe requires the accepted denial shape, not a bare status", () => {
    const denial = { detail: { code: "tenant_access_denied", message: "tenant account access denied" } };
    const adapter = new OperationalThreadsHttpAdapter({ origin: "https://threads.example", bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }, () => response(403, denial));
    (adapter as any).boundary = (account_id: string, capability: string) => ({ account_id, capability, observed_at: "2026-09-30T00:00:00Z" });
    expect(adapter.performTenantProbe("acct_test", "acct_foreign", "editorial.cycle").foreign_status).toBe(403);
    const bare = new OperationalThreadsHttpAdapter({ origin: "https://threads.example", bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }, () => response(403, {})); (bare as any).boundary = (adapter as any).boundary;
    expect(() => bare.performTenantProbe("acct_test", "acct_foreign", "editorial.cycle")).toThrow("TENANT_PROBE_NOT_PROVEN");
  });

  test("default transport makes a bounded real local HTTP request without external effects", async () => {
    const serverCode = `const s=Bun.serve({port:0,fetch(r){const u=new URL(r.url);return Response.json({path:u.pathname,auth:r.headers.get('authorization'),mode:u.searchParams.get('assessment_mode')})}});console.log(s.port);await new Promise(()=>{})`;
    const child = Bun.spawn([process.execPath, "-e", serverCode], { stdout: "pipe", stderr: "pipe" }); children.push(child);
    const reader = child.stdout.getReader(); const first = await reader.read(); reader.releaseLock(); const port = Number(new TextDecoder().decode(first.value).trim()); expect(port).toBeGreaterThan(0);
    const adapter = new OperationalThreadsHttpAdapter({ origin: `http://127.0.0.1:${port}`, bridge_api_key: "local-test-key".padEnd(32, "x"), tenant_user_id: "controller" });
    expect(adapter.operationalEvidence(request).parsed).toEqual({ path: "/autopilot/v2/operational-evidence", auth: `Bearer ${"local-test-key".padEnd(32, "x")}`, mode: "LIVE" });
    expect(CATFOOD_THREADS_PINS.read_route).toBe("GET /autopilot/v2/operational-evidence");
  });

  test("streaming bounds split UTF-8, chunked oversize, malformed bytes, encodings, and ambiguous receipt loss", async () => {
    const serverCode = `const enc=new TextEncoder();const s=Bun.serve({port:0,fetch(r){const a=new URL(r.url).searchParams.get('account_id');if(a==='acct_split'){const b=enc.encode(JSON.stringify({text:'雪'}));return new Response(new ReadableStream({start(c){for(const x of b)c.enqueue(Uint8Array.of(x));c.close()}}),{headers:{'content-type':'application/json'}})}if(a==='acct_large')return new Response(new Uint8Array(512001),{headers:{'content-type':'application/json'}});if(a==='acct_bad')return new Response(Uint8Array.of(255),{headers:{'content-type':'application/json'}});if(a==='acct_encoding')return new Response(Bun.gzipSync(enc.encode('{}')),{headers:{'content-type':'application/json','content-encoding':'gzip'}});return Response.json({})}});console.log(s.port);await new Promise(()=>{})`;
    const child = Bun.spawn([process.execPath, "-e", serverCode], { stdout: "pipe", stderr: "pipe" }); children.push(child); const reader = child.stdout.getReader(); const first = await reader.read(); reader.releaseLock(); const port = Number(new TextDecoder().decode(first.value).trim());
    const adapter = new OperationalThreadsHttpAdapter({ origin: `http://127.0.0.1:${port}`, bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }); const withAccount = (account_id: string) => ({ ...request, account_id });
    expect(adapter.operationalEvidence(withAccount("acct_split")).parsed).toEqual({ text: "雪" });
    expect(() => adapter.operationalEvidence(withAccount("acct_large"))).toThrow("THREADS_HTTP_BODY_LIMIT");
    expect(() => adapter.operationalEvidence(withAccount("acct_bad"))).toThrow("THREADS_HTTP_MALFORMED_UTF8");
    expect(() => adapter.operationalEvidence(withAccount("acct_encoding"))).toThrow("THREADS_HTTP_CONTENT_ENCODING_UNSUPPORTED");
    let calls = 0; const lost = new OperationalThreadsHttpAdapter({ origin: "https://threads.example", bridge_api_key: "x".repeat(32), tenant_user_id: "controller" }, () => { calls++; throw new Error("reset"); });
    expect(() => lost.changeAuthority({ action: "grant" })).toThrow("MUTATION_OUTCOME_AMBIGUOUS"); expect(calls).toBe(1);
  });
});
