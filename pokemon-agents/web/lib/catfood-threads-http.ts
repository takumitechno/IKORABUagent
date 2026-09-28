import { sha256, type Json } from "./catfood-harness";
import { acquireCoe, foldProducerAttempts, parseJsonNoDuplicateKeys, validateOutcomeEvaluationRequest, type CoeAcquisition, type CoePageSource, type CoeRawPage, type CoeRequest, type OutcomeEvaluationRequest } from "./catfood-coe";
import { validateOperationalBoundaryV1, type OperationalBoundaryV1 } from "./catfood-harness";
import { CATFOOD_CAPABILITIES, CatfoodTrustError, type CatfoodCapability, type CatfoodRunSpec, type OperationalProvenance, type TenantProbeEvidence, type ThreadsAuthorityTransition, type ThreadsClaimRecord, type ThreadsEvidenceSource, type ThreadsInventoryItem, type ThreadsRuntimeEvidence } from "./catfood-trust";
import { assertEnrolledRole, type CatfoodEnrollmentContext } from "./catfood-enrollment";

export interface ThreadsHttpResponse { status: number; content_type: string; content_encoding?: string; location: string | null; body?: string; body_base64url?: string; byte_length?: number; body_sha256?: string }
export type ThreadsHttpTransport = (request: Readonly<{ method: "GET" | "POST"; url: string; headers: Readonly<Record<string, string>>; body: string | null; timeout_ms: number; maximum_bytes: number }>) => ThreadsHttpResponse;

const CHILD = String.raw`const q=JSON.parse(await Bun.stdin.text());try{const c=new AbortController();const t=setTimeout(()=>c.abort(),q.timeout_ms);const r=await fetch(q.url,{method:q.method,headers:q.headers,body:q.body,signal:c.signal,redirect:"manual"});const n=Number(r.headers.get("content-length")||0);if(n>q.maximum_bytes)throw new Error("BODY_LIMIT");const reader=r.body?.getReader();const chunks=[];let total=0;while(reader){const got=await reader.read();if(got.done)break;total+=got.value.byteLength;if(total>q.maximum_bytes){await reader.cancel();throw new Error("BODY_LIMIT")}chunks.push(got.value)}clearTimeout(t);const bytes=new Uint8Array(total);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.byteLength}new TextDecoder("utf-8",{fatal:true}).decode(bytes);const h=new Bun.CryptoHasher("sha256");h.update(bytes);process.stdout.write(JSON.stringify({status:r.status,content_type:r.headers.get("content-type")||"",content_encoding:r.headers.get("content-encoding")||"identity",location:r.headers.get("location"),body_base64url:Buffer.from(bytes).toString("base64url"),byte_length:bytes.byteLength,body_sha256:h.digest("hex")}))}catch(e){process.stderr.write(e?.name==="AbortError"?"TIMEOUT":e?.message==="BODY_LIMIT"?"BODY_LIMIT":e instanceof TypeError?"MALFORMED_UTF8":"UNAVAILABLE");process.exit(2)}`;

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

  operationalEvidence(request: Readonly<CoeRequest>): CoeRawPage {
    const url = new URL("/autopilot/v2/operational-evidence", this.origin);
    for (const [key, value] of Object.entries({ account_id: request.account_id, assessment_mode: request.assessment_mode, window_start: request.window_start, window_end: request.window_end, page_size: String(request.page_size) })) url.searchParams.set(key, value);
    if (request.cursor !== null) url.searchParams.set("cursor", request.cursor);
    const response = this.json("GET", url, null, false, true);
    return response as CoeRawPage;
  }

  boundary(accountId: string, capability: CatfoodCapability): OperationalBoundaryV1 {
    const url = new URL("/autopilot/v2/operational-boundary", this.origin); url.searchParams.set("account_id", accountId); url.searchParams.set("capability", capability);
    return validateOperationalBoundaryV1(this.json("GET", url, null));
  }

  editorialRunOnce(request: Readonly<{ account_id: string; cycle_key: string; authority_ref: string; authority_spec_hash: string; authority_generation: number }>): unknown {
    const url = new URL("/autopilot/v2/editorial/run-once", this.origin);
    for (const [key, value] of Object.entries({ account_id: request.account_id, cycle_key: request.cycle_key, resume_interrupted: "false", resume_revision_required: "false", authority_ref: request.authority_ref, authority_spec_hash: request.authority_spec_hash, authority_generation: String(request.authority_generation) })) url.searchParams.set(key, value);
    return this.json("POST", url, null, true);
  }

  publishDryRun(request: Readonly<Record<string, unknown>>): unknown {
    return this.json("POST", new URL("/autopilot/v2/publish", this.origin), JSON.stringify(request), true);
  }

  outcomeEvaluation(request: OutcomeEvaluationRequest): unknown {
    return this.json("POST", new URL("/autopilot/v2/operational-evidence/outcome-evaluation", this.origin), JSON.stringify(validateOutcomeEvaluationRequest(request)), true);
  }

  changeAuthority(request: Readonly<Record<string, unknown>>): unknown {
    return this.json("POST", new URL("/autopilot/v2/operational-authority", this.origin), JSON.stringify(request), true);
  }

  performTenantProbe(ownAccountId: string, foreignAccountId: string, capability: CatfoodCapability): Readonly<{ own: OperationalBoundaryV1; foreign_status: 403; observed_at: string }> {
    const own = this.boundary(ownAccountId, capability); const url = new URL("/autopilot/v2/operational-boundary", this.origin); url.searchParams.set("account_id", foreignAccountId); url.searchParams.set("capability", capability);
    const response = this.transport({ method: "GET", url: url.toString(), headers: this.headers, body: null, timeout_ms: 2_500, maximum_bytes: 512_000 });
    let denied: Record<string, unknown> | null = null; try { denied = parseJsonNoDuplicateKeys(this.body(response).text, 512_000, 32) as Record<string, unknown>; } catch { /* fail closed below */ }
    const detail = denied?.detail as Record<string, unknown> | undefined;
    if (own.account_id !== ownAccountId || own.capability !== capability || response.location || response.status !== 403 || !response.content_type.toLowerCase().startsWith("application/json") || Object.keys(denied ?? {}).join() !== "detail" || Object.keys(detail ?? {}).sort().join() !== "code,message" || detail?.code !== "tenant_access_denied" || detail?.message !== "tenant account access denied") throw new CatfoodTrustError("TENANT_PROBE_NOT_PROVEN");
    return Object.freeze({ own, foreign_status: 403, observed_at: String(own.observed_at) });
  }

  private body(response: ThreadsHttpResponse): { text: string; body_base64url: string; byte_length: number; body_sha256: string } {
    let bytes: Buffer;
    if (response.body_base64url !== undefined) {
      if (!/^[A-Za-z0-9_-]*$/.test(response.body_base64url)) throw new CatfoodTrustError("THREADS_HTTP_BODY_ENCODING_INVALID");
      bytes = Buffer.from(response.body_base64url, "base64url"); if (bytes.toString("base64url") !== response.body_base64url) throw new CatfoodTrustError("THREADS_HTTP_BODY_ENCODING_INVALID");
    } else bytes = Buffer.from(response.body ?? "", "utf8");
    if (bytes.byteLength > 512_000 || response.byte_length !== undefined && response.byte_length !== bytes.byteLength) throw new CatfoodTrustError("THREADS_HTTP_BODY_LIMIT");
    let text: string; try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { throw new CatfoodTrustError("THREADS_HTTP_MALFORMED_UTF8"); }
    const digest = sha256(text); if (response.body_sha256 !== undefined && response.body_sha256 !== digest) throw new CatfoodTrustError("THREADS_HTTP_BODY_DIGEST_MISMATCH");
    return { text, body_base64url: bytes.toString("base64url"), byte_length: bytes.byteLength, body_sha256: digest };
  }

  private json(method: "GET" | "POST", url: URL, body: string | null, mutation = false, retain = false): unknown {
    let response: ThreadsHttpResponse;
    try { response = this.transport({ method, url: url.toString(), headers: this.headers, body, timeout_ms: 2_500, maximum_bytes: 512_000 }); }
    catch (error) { if (mutation) throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS"); throw error; }
    if (response.location || response.status >= 300 && response.status < 400) throw new CatfoodTrustError("THREADS_HTTP_REDIRECT_REJECTED");
    if (!['', 'identity'].includes((response.content_encoding ?? "identity").toLowerCase())) throw new CatfoodTrustError(mutation ? "MUTATION_OUTCOME_AMBIGUOUS" : "THREADS_HTTP_CONTENT_ENCODING_UNSUPPORTED");
    const captured = this.body(response);
    if (response.status !== 200) {
      let code = "unknown"; try { const parsed = parseJsonNoDuplicateKeys(captured.text, 512_000, 32) as Record<string, unknown>; const detail = parsed.detail as Record<string, unknown> | string; const candidate = typeof detail === "object" && detail ? String(detail.code ?? "unknown") : String(detail ?? "unknown"); if (/^[a-z0-9_:-]{1,80}$/i.test(candidate)) code = candidate; } catch { /* safe generic diagnostic */ }
      throw new CatfoodTrustError(mutation && response.status >= 500 ? "MUTATION_OUTCOME_AMBIGUOUS" : `THREADS_HTTP_${response.status}_${code}`);
    }
    if (!response.content_type.toLowerCase().startsWith("application/json")) throw new CatfoodTrustError(mutation ? "MUTATION_OUTCOME_AMBIGUOUS" : "THREADS_HTTP_CONTENT_TYPE_INVALID");
    let parsed: unknown; try { parsed = parseJsonNoDuplicateKeys(captured.text, 512_000, 64); } catch (error) { if (mutation) throw new CatfoodTrustError("MUTATION_OUTCOME_AMBIGUOUS"); throw error; }
    if (!retain) return parsed;
    const { text: _text, ...raw } = captured;
    return { parsed, receipt: { representation: "AUTHENTICATED_DECODED_BODY", ...raw, content_type: "application/json", content_encoding: "identity", source_session_id: `http:${captured.body_sha256.slice(0, 32)}` } };
  }
}

export interface ThreadsSourceContext {
  source_identity: string;
  origin: string;
  bridge_api_key: string;
  tenant_user_id: string;
  principal_ref: string;
  credential_version_ref: string;
  source_build_sha256: string;
  protected_probe: { probe_id: string; foreign_account_id: string };
  principal_binding: { actor: string; organization_id: string; account_id: string };
  runtime_prohibitions: { writer_enabled: false; paid_generation_enabled: false };
  intents: readonly ThreadsInventoryItem[];
  operational_provenance?: OperationalProvenance;
}

function attemptResult(row: Record<string, Json>): Record<string, Json> {
  if (row.result_json === null) return {};
  const value = typeof row.result_json === "string" ? parseJsonNoDuplicateKeys(row.result_json, 1_000_000, 32) : row.result_json;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new CatfoodTrustError("THREADS_RESULT_SCHEMA_INVALID");
  return value as Record<string, Json>;
}

function producerTimestamp(value: Json): string {
  const timestamp = new Date(String(value));
  if (!Number.isFinite(timestamp.getTime())) throw new CatfoodTrustError("THREADS_TIMESTAMP_INVALID");
  return timestamp.toISOString();
}

/** Complete source composition. OPERATIONAL instances are created only by the fixed bootstrap below. */
export class OperationalThreadsEvidenceSource implements ThreadsEvidenceSource {
  readonly source_identity: string;
  readonly operational_provenance?: OperationalProvenance;
  readonly evidence_trust: "OPERATIONAL" | "TEST_ONLY";
  private lastPage: Record<string, unknown> | null = null;
  private lastAcquisition: CoeAcquisition | null = null;
  private constructor(readonly mode: "OPERATIONAL" | "TEST_ONLY", private readonly context: Readonly<ThreadsSourceContext>, private readonly adapter: OperationalThreadsHttpAdapter, private readonly now: () => Date, enrollment?: CatfoodEnrollmentContext) {
    if (enrollment) assertEnrolledRole(enrollment, "source", mode); else if (mode === "OPERATIONAL") throw new CatfoodTrustError("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE");
    this.source_identity = context.source_identity;
    this.operational_provenance = context.operational_provenance;
    this.evidence_trust = mode;
  }

  static testOnly(context: Readonly<ThreadsSourceContext>, transport: ThreadsHttpTransport, now: () => Date): OperationalThreadsEvidenceSource {
    return new OperationalThreadsEvidenceSource("TEST_ONLY", Object.freeze(structuredClone(context)), new OperationalThreadsHttpAdapter(context, transport), now);
  }

  static enrolledTestOnly(context: Readonly<ThreadsSourceContext>, transport: ThreadsHttpTransport, now: () => Date, enrollment: CatfoodEnrollmentContext): OperationalThreadsEvidenceSource {
    return new OperationalThreadsEvidenceSource("TEST_ONLY", Object.freeze(structuredClone(context)), new OperationalThreadsHttpAdapter(context, transport), now, enrollment);
  }

  static operational(context: Readonly<ThreadsSourceContext>, enrollment?: CatfoodEnrollmentContext): OperationalThreadsEvidenceSource {
    if (!enrollment) throw new CatfoodTrustError("OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE");
    return new OperationalThreadsEvidenceSource("OPERATIONAL", Object.freeze(structuredClone(context)), new OperationalThreadsHttpAdapter(context), () => new Date(), enrollment);
  }

  operationalEvidence(request: Readonly<CoeRequest>): CoeRawPage {
    const page = this.adapter.operationalEvidence(request); this.lastPage = page.parsed as Record<string, unknown>; return page;
  }

  runtimeEvidence(_spec: CatfoodRunSpec): ThreadsRuntimeEvidence {
    if (!this.lastPage) throw new CatfoodTrustError("COE_ACQUISITION_REQUIRED");
    const runtime = this.lastPage.runtime_enforcement as Record<string, unknown>; const activity = this.lastPage.prohibited_activity as Record<string, unknown>;
    return Object.freeze({ feature_multi_tenant_auth: runtime.configured_auth_state === "ON" ? "ON" : runtime.configured_auth_state === "OFF" ? "OFF" : "UNKNOWN", own_scope_status: 200, foreign_scope_status: 403, writer_enabled: this.context.runtime_prohibitions.writer_enabled, paid_generation_enabled: this.context.runtime_prohibitions.paid_generation_enabled, provider_activity_count: Number(activity.provider_attempt_count), paid_cost_micros: Number(activity.provider_attempt_count) === 0 ? 0 : "UNKNOWN", cost_coverage: activity.coverage as ThreadsRuntimeEvidence["cost_coverage"] });
  }

  tenantProbe(spec: CatfoodRunSpec): TenantProbeEvidence {
    const observed = this.adapter.performTenantProbe(spec.account_id, this.context.protected_probe.foreign_account_id, "editorial.cycle");
    if (!this.lastPage) throw new CatfoodTrustError("COE_ACQUISITION_REQUIRED");
    const runtime = this.lastPage.runtime_enforcement as Record<string, unknown>;
    return Object.freeze({ probe_id: this.context.protected_probe.probe_id, principal_ref: this.context.principal_ref, credential_version_ref: this.context.credential_version_ref, organization_id: spec.organization_id, own_account_id: spec.account_id, foreign_account_id: this.context.protected_probe.foreign_account_id, own_result: "EXPECTED_RESOURCE", foreign_result: "AUTHORIZATION_DENIED", foreign_status: 403, logical_runtime_id: String(runtime.logical_runtime_id), worker_boot_id: String(runtime.worker_boot_id), observed_at: observed.observed_at, receipt_id: `probe:${sha256(`${this.context.protected_probe.probe_id}:${observed.observed_at}:${this.context.principal_ref}`)}`, source_session_id: `source:${sha256(`${this.context.source_identity}:${this.context.credential_version_ref}`)}`, source_build_sha256: this.context.source_build_sha256, protected_origin: this.adapter.origin, route: "GET /autopilot/v2/operational-boundary", method: "GET" });
  }

  boundaries(spec: CatfoodRunSpec): readonly OperationalBoundaryV1[] { return CATFOOD_CAPABILITIES.map((capability) => this.adapter.boundary(spec.account_id, capability)); }

  inventory(_spec: CatfoodRunSpec): readonly ThreadsInventoryItem[] {
    if (!this.lastPage) throw new CatfoodTrustError("COE_ACQUISITION_REQUIRED");
    const targets = this.lastPage.outcome_evaluation_targets as Record<string, unknown>[];
    for (const item of this.context.intents) if (item.capability === "editorial.outcome_evaluation" && !targets.some((target) => target.business_identity === item.business_identity && target.material_revision === item.material_revision)) throw new CatfoodTrustError("OUTCOME_INTENT_SOURCE_REVISION_MISMATCH");
    return structuredClone(this.context.intents);
  }

  grant(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number | null, permitExpiresAt: string): ThreadsAuthorityTransition {
    return this.authority(spec, capability, authorityRef, expectedGeneration, "grant", permitExpiresAt);
  }

  renew(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number, permitExpiresAt: string): ThreadsAuthorityTransition {
    return this.authority(spec, capability, authorityRef, expectedGeneration, "renew", permitExpiresAt);
  }

  revoke(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number): ThreadsAuthorityTransition {
    return this.authority(spec, capability, authorityRef, expectedGeneration, "revoke");
  }

  private authority(spec: CatfoodRunSpec, capability: CatfoodCapability, authorityRef: string, expectedGeneration: number | null, action: "grant" | "renew" | "revoke", permitExpiresAt: string | null = null): ThreadsAuthorityTransition {
    const value = this.adapter.changeAuthority({ action, account_id: spec.account_id, capability, authority_ref: authorityRef, spec_hash: spec.spec_sha256, expected_generation: expectedGeneration, permit_expires_at: action === "revoke" ? null : permitExpiresAt }) as Record<string, unknown>;
    const expected = ["account_id", "authority_ref", "authority_state", "capability", "fencing_generation", "permit_expires_at", "spec_hash", "stop_acknowledgement"];
    if (Object.keys(value).sort().join() !== expected.sort().join() || value.account_id !== spec.account_id || value.capability !== capability || value.authority_ref !== authorityRef || value.spec_hash !== spec.spec_sha256 || !Number.isSafeInteger(value.fencing_generation)) throw new CatfoodTrustError("THREADS_AUTHORITY_RESPONSE_INVALID");
    return Object.freeze({ boundary: this.adapter.boundary(spec.account_id, capability), authority_ref: authorityRef, generation: Number(value.fencing_generation) });
  }

  claim(spec: CatfoodRunSpec, item: ThreadsInventoryItem, authorityRef: string, generation: number, requestId?: string): ThreadsClaimRecord {
    if (!item.intent || item.intent.kind !== item.capability || item.capability === "editorial.outcome_evaluation") throw new CatfoodTrustError("THREADS_INTENT_INVALID");
    if (item.intent.kind === "editorial.cycle") this.adapter.editorialRunOnce({ account_id: spec.account_id, cycle_key: item.intent.cycle_key, authority_ref: authorityRef, authority_spec_hash: spec.spec_sha256, authority_generation: generation });
    else this.adapter.publishDryRun({ account_id: spec.account_id, content_id: item.intent.content_id, expected_version: item.intent.expected_version, expected_content_hash: item.intent.expected_content_hash, actor: item.intent.actor, request_id: requestId, authority_ref: authorityRef, authority_spec_hash: spec.spec_sha256, authority_generation: generation, dry_run: true });
    const producerRequest = item.intent.kind === "editorial.cycle" ? item.intent.producer_request_id : requestId;
    return this.afterDispatch(spec, item, authorityRef, generation, producerRequest ?? "");
  }

  outcomeEvaluation(spec: CatfoodRunSpec, request: Readonly<OutcomeEvaluationRequest>, item: ThreadsInventoryItem): ThreadsClaimRecord {
    if (!item.intent || item.intent.kind !== "editorial.outcome_evaluation" || item.intent.experiment_id !== request.experiment_id || item.intent.observed_through !== (request.observed_through ?? null)) throw new CatfoodTrustError("THREADS_INTENT_INVALID");
    this.adapter.outcomeEvaluation(request); return this.afterDispatch(spec, item, request.authority_ref, request.expected_threads_generation, request.request_id);
  }

  readClaim(spec: CatfoodRunSpec, claimId: string): ThreadsClaimRecord | null {
    const evidence = this.acquire(spec); const attempt = foldProducerAttempts(evidence).find((candidate) => candidate.first.claim_identity === claimId);
    return attempt ? this.project(spec, evidence, attempt.first, attempt.terminal) : null;
  }

  private afterDispatch(spec: CatfoodRunSpec, item: ThreadsInventoryItem, authorityRef: string, generation: number, requestId: string): ThreadsClaimRecord {
    const evidence = this.acquire(spec); const attempt = foldProducerAttempts(evidence).find((candidate) => candidate.first.request_id === requestId && candidate.first.capability === item.capability && candidate.first.authority_ref === authorityRef && candidate.first.threads_generation === generation);
    if (!attempt) throw new CatfoodTrustError("MUTATION_RECEIPT_AMBIGUOUS");
    const projected = this.project(spec, evidence, attempt.first, attempt.terminal);
    return Object.freeze({ ...projected, claim_status: "in_progress", transport_status: "SUCCEEDED", domain_result: {}, completed_at: null });
  }

  private acquire(spec: CatfoodRunSpec): CoeAcquisition {
    const at = this.now(); const end = Date.parse(spec.requested_window_end); const closed = at.getTime() >= end;
    const rounded = Math.floor(at.getTime() / 1000) * 1000; const scope = closed ? spec : { ...spec, requested_window_start: new Date(rounded - 120_000).toISOString().replace(".000Z", "Z"), requested_window_end: new Date(rounded).toISOString().replace(".000Z", "Z") };
    this.lastAcquisition = acquireCoe(this, scope, closed ? "CLOSED_RUN" : "LIVE_ADMISSION"); return this.lastAcquisition;
  }

  private project(spec: CatfoodRunSpec, evidence: CoeAcquisition, first: Record<string, Json>, terminal: Record<string, Json>): ThreadsClaimRecord {
    const state = String(terminal.event_type); const result = attemptResult(terminal); const complete = ["SUCCEEDED", "FAILED", "UNRESOLVED", "DUPLICATE", "REPLAYED", "REJECTED_PRECLAIM"].includes(state);
    const providerCount = Number(evidence.prohibited_activity.provider_attempt_count);
    const authority = evidence.records.find((row) => row.source === "operational_authority_events" && row.event_type === "GRANTED" && row.actor === this.context.principal_binding.actor && row.account_id === this.context.principal_binding.account_id && row.capability === first.capability && row.authority_ref === first.verified_authority_ref && row.spec_hash === first.verified_spec_hash && row.generation === first.verified_threads_generation && Date.parse(String(row.occurred_at)) <= Date.parse(String(first.occurred_at)));
    const invocation_receipt = authority ? { receipt_id: `invoke:${String(first.event_id)}`, source_session_id: evidence.page_receipts[0]?.source_session_id as string ?? `source:${evidence.digest}`, principal_ref: this.context.principal_ref, credential_version_ref: this.context.credential_version_ref, organization_id: this.context.principal_binding.organization_id, account_id: this.context.principal_binding.account_id, capability: String(first.capability), authority_ref: String(first.verified_authority_ref), spec_hash: String(first.verified_spec_hash), generation: Number(first.verified_threads_generation), authority_event_id: String(authority.event_id), authority_actor: String(authority.actor), authority_occurred_at: producerTimestamp(authority.occurred_at) } : undefined;
    if (this.context.principal_binding.organization_id !== spec.organization_id || this.context.principal_binding.account_id !== spec.account_id) throw new CatfoodTrustError("THREADS_PRINCIPAL_BINDING_MISMATCH");
    return Object.freeze({ source_id: String(first.request_id), capability: String(first.capability) as CatfoodCapability, business_identity: String(first.business_identity), material_revision: String(first.material_revision), claim_id: String(first.claim_identity), request_id: String(first.request_id), account_id: String(first.account_id), authority_ref: String(first.authority_ref), generation: Number(first.threads_generation), claim_status: !complete ? "in_progress" : state === "SUCCEEDED" ? "succeeded" : "failed", transport_status: "SUCCEEDED", domain_result: result, provider_invoked: providerCount !== 0, paid_cost_micros: providerCount === 0 ? 0 : "UNKNOWN", admitted_at: producerTimestamp(first.occurred_at), completed_at: complete ? producerTimestamp(terminal.occurred_at) : null, ...(invocation_receipt ? { invocation_receipt } : {}) });
  }
}
