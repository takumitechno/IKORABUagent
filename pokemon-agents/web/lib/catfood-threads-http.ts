import { parseJsonNoDuplicateKeys, validateOutcomeEvaluationRequest, type CoePageSource, type CoeRequest, type OutcomeEvaluationRequest } from "./catfood-coe";
import { validateOperationalBoundaryV1, type OperationalBoundaryV1 } from "./catfood-harness";
import { CatfoodTrustError, type CatfoodCapability } from "./catfood-trust";

export interface ThreadsHttpResponse { status: number; content_type: string; location: string | null; body: string }
export type ThreadsHttpTransport = (request: Readonly<{ method: "GET" | "POST"; url: string; headers: Readonly<Record<string, string>>; body: string | null; timeout_ms: number; maximum_bytes: number }>) => ThreadsHttpResponse;

const CHILD = String.raw`const q=JSON.parse(await Bun.stdin.text());try{const c=new AbortController();const t=setTimeout(()=>c.abort(),q.timeout_ms);const r=await fetch(q.url,{method:q.method,headers:q.headers,body:q.body,signal:c.signal,redirect:"manual"});clearTimeout(t);const n=Number(r.headers.get("content-length")||0);if(n>q.maximum_bytes)throw new Error("BODY_LIMIT");const b=await r.text();if(b.length>q.maximum_bytes)throw new Error("BODY_LIMIT");process.stdout.write(JSON.stringify({status:r.status,content_type:r.headers.get("content-type")||"",location:r.headers.get("location"),body:b}))}catch(e){process.stderr.write(e?.name==="AbortError"?"TIMEOUT":e?.message==="BODY_LIMIT"?"BODY_LIMIT":"UNAVAILABLE");process.exit(2)}`;

export const synchronousThreadsHttpTransport: ThreadsHttpTransport = (request) => {
  const result = Bun.spawnSync({ cmd: [process.execPath, "-e", CHILD], stdin: new Blob([JSON.stringify(request)]), stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) throw new CatfoodTrustError(`THREADS_HTTP_${result.stderr.toString() || "UNAVAILABLE"}`);
  return JSON.parse(result.stdout.toString()) as ThreadsHttpResponse;
};

function origin(value: string): string {
  let url: URL; try { url = new URL(value); } catch { throw new CatfoodTrustError("THREADS_ORIGIN_INVALID"); }
  const local = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname.toLowerCase());
  if ((!local && url.protocol !== "https:") || (local && !["http:", "https:"].includes(url.protocol)) || url.username || url.password || url.search || url.hash || !["", "/"].includes(url.pathname)) throw new CatfoodTrustError("THREADS_ORIGIN_INVALID");
  return url.origin;
}

export class OperationalThreadsHttpAdapter implements CoePageSource {
  readonly origin: string;
  private readonly headers: Readonly<Record<string, string>>;
  constructor(config: Readonly<{ origin: string; bridge_api_key: string; tenant_user_id: string }>, private readonly transport: ThreadsHttpTransport = synchronousThreadsHttpTransport) {
    this.origin = origin(config.origin);
    if (config.bridge_api_key.length < 32 || !/^[A-Za-z0-9][A-Za-z0-9._:@-]{0,199}$/.test(config.tenant_user_id)) throw new CatfoodTrustError("THREADS_HTTP_CONFIG_INVALID");
    this.headers = Object.freeze({ Accept: "application/json", Authorization: `Bearer ${config.bridge_api_key}`, "Content-Type": "application/json", "X-Threads-User-ID": config.tenant_user_id });
  }

  operationalEvidence(request: Readonly<CoeRequest>): unknown {
    const url = new URL("/autopilot/v2/operational-evidence", this.origin);
    for (const [key, value] of Object.entries({ account_id: request.account_id, assessment_mode: request.assessment_mode, window_start: request.window_start, window_end: request.window_end, page_size: String(request.page_size) })) url.searchParams.set(key, value);
    if (request.cursor !== null) url.searchParams.set("cursor", request.cursor);
    return this.json("GET", url, null);
  }

  boundary(accountId: string, capability: CatfoodCapability): OperationalBoundaryV1 {
    const url = new URL("/autopilot/v2/operational-boundary", this.origin); url.searchParams.set("account_id", accountId); url.searchParams.set("capability", capability);
    return validateOperationalBoundaryV1(this.json("GET", url, null));
  }

  outcomeEvaluation(request: OutcomeEvaluationRequest): unknown {
    return this.json("POST", new URL("/autopilot/v2/operational-evidence/outcome-evaluation", this.origin), JSON.stringify(validateOutcomeEvaluationRequest(request)), true);
  }

  changeAuthority(request: Readonly<Record<string, unknown>>): unknown {
    return this.json("POST", new URL("/autopilot/v2/operational-authority", this.origin), JSON.stringify(request), true);
  }

  tenantProbe(ownAccountId: string, foreignAccountId: string, capability: CatfoodCapability): Readonly<{ own: OperationalBoundaryV1; foreign_status: 403; observed_at: string }> {
    const own = this.boundary(ownAccountId, capability); const url = new URL("/autopilot/v2/operational-boundary", this.origin); url.searchParams.set("account_id", foreignAccountId); url.searchParams.set("capability", capability);
    const response = this.transport({ method: "GET", url: url.toString(), headers: this.headers, body: null, timeout_ms: 2_500, maximum_bytes: 512_000 });
    let denied: Record<string, unknown> | null = null; try { denied = parseJsonNoDuplicateKeys(response.body) as Record<string, unknown>; } catch { /* fail closed below */ }
    const detail = denied?.detail as Record<string, unknown> | undefined;
    if (own.account_id !== ownAccountId || own.capability !== capability || response.location || response.status !== 403 || !response.content_type.toLowerCase().startsWith("application/json") || Object.keys(denied ?? {}).join() !== "detail" || Object.keys(detail ?? {}).sort().join() !== "code,message" || detail?.code !== "tenant_access_denied" || detail?.message !== "tenant account access denied") throw new CatfoodTrustError("TENANT_PROBE_NOT_PROVEN");
    return Object.freeze({ own, foreign_status: 403, observed_at: String(own.observed_at) });
  }

  private json(method: "GET" | "POST", url: URL, body: string | null, mutation = false): unknown {
    const response = this.transport({ method, url: url.toString(), headers: this.headers, body, timeout_ms: 2_500, maximum_bytes: 512_000 });
    if (response.location || response.status >= 300 && response.status < 400) throw new CatfoodTrustError("THREADS_HTTP_REDIRECT_REJECTED");
    if (response.status !== 200) {
      let code = "unknown"; try { const parsed = parseJsonNoDuplicateKeys(response.body) as Record<string, unknown>; const detail = parsed.detail as Record<string, unknown> | string; code = typeof detail === "object" && detail ? String(detail.code ?? "unknown") : String(detail ?? "unknown"); } catch { /* safe generic diagnostic */ }
      throw new CatfoodTrustError(mutation && response.status >= 500 ? "MUTATION_OUTCOME_UNKNOWN" : `THREADS_HTTP_${response.status}_${code}`);
    }
    if (!response.content_type.toLowerCase().startsWith("application/json")) throw new CatfoodTrustError("THREADS_HTTP_CONTENT_TYPE_INVALID");
    return parseJsonNoDuplicateKeys(response.body);
  }
}
