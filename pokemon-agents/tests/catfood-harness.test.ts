import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { initializeAttestationStore, attestClosedRun } from "../web/lib/catfood-attestation";
import {
  CATFOOD_BOUNDARY_FIXTURE_SHA256,
  CATFOOD_BOUNDARY_SHA256,
  CATFOOD_COMBINED_FIXTURE_SHA256,
  CATFOOD_IKORABU_BASE,
  CATFOOD_INITIAL_CAPABILITIES,
  CATFOOD_NIGHT_STATE,
  CATFOOD_THREADS_RELEASE_SHA256,
  CATFOOD_THREADS_SHA,
  CATFOOD_WP1_CONTRACT_SHA256,
  CatfoodError,
  CatfoodBridgeClient,
  acquireLease,
  appendEvidence,
  canonicalJson,
  canonicalSha256,
  catfoodHarnessEnabled,
  classifyDrain,
  boundedDrain,
  closeEvidenceBundle,
  createRunSpec,
  dueClasses,
  evaluateClosedBundle,
  evaluatePreflight,
  finishWorkUnit,
  initializeCatfoodStore,
  openCatfoodStore,
  persistRunSpec,
  recordAuthorityEpoch,
  recordAuthorityRenewal,
  recordStopSnapshot,
  setNextDue,
  sha256,
  startWorkUnit,
  validateOperationalBoundaryV1,
  type CatfoodCapability,
  type CatfoodRunSpec,
  type HumanGo,
  type Json,
  type OperationalBoundaryV1,
} from "../web/lib/catfood-harness";

const start = "2026-10-01T00:00:00.000Z";
const end = "2026-10-02T00:00:00.000Z";
const config = Object.freeze({ editorial_writer_enabled: false, paid_generation_enabled: false, notifications_enabled: false, scheduler_enabled: false });

function withHash(value: Record<string, unknown>): OperationalBoundaryV1 {
  const copy = structuredClone(value);
  delete copy.canonical_sha256;
  return { ...copy, canonical_sha256: canonicalSha256(copy) } as OperationalBoundaryV1;
}

function boundary(capability: CatfoodCapability = "editorial.cycle", overrides: Record<string, unknown> = {}): OperationalBoundaryV1 {
  const value: Record<string, unknown> = {
    boundary_version: 1,
    producer_release_identity: { git_sha: CATFOOD_THREADS_SHA, artifact_sha256: CATFOOD_THREADS_RELEASE_SHA256 },
    schema_version: 30,
    schema_fingerprint: "5".repeat(64),
    schema_readiness: "READY",
    migration_provenance_digest: "6".repeat(64),
    account_id: "acct_fixture",
    org_tenant_binding: { state: "bound", org_ids: ["org_fixture"] },
    observed_at: start,
    capability,
    unsupported_capability: null,
    execution_state: "PERMITTED",
    permit_expires_at: "2026-10-01T00:01:00.000Z",
    fencing_generation: 1,
    authority_state: "ACTIVE",
    enabled_capabilities: [capability],
    effective_safety_controls: { global_stop: false, account_stop: false, capability_stop: false, reasons: [] },
    stop_acknowledgement: "NOT_REQUESTED",
    governed_in_flight: { count: 0, by_authority: [], unattributed_count: 0, attribution_state: "COMPLETE", external_cancellation_guaranteed: false },
    blocked_reasons: [],
    source_evidence: {
      coverage: "unknown",
      runner_heartbeats: ["insights", "outcome", "night_batch"].map((runner_name) => ({ runner_name, state: "missing", run_status: null, last_run_at: null, age_seconds: null, expected: "unknown", healthy: false })),
      night_attention: { window_hours: 96, total: 0, by_reason: { cancelled: 0, blocked: 0, failed_confirmed: 0, ambiguous: 0 }, items_truncated: false, coverage: "complete" },
      insights_quarantine: { total: 0, items: [], items_truncated: false, coverage: "complete" },
    },
    ...overrides,
  };
  return withHash(value);
}

function stoppedBoundary(capability: CatfoodCapability = "editorial.cycle", generation = 2, overrides: Record<string, unknown> = {}): OperationalBoundaryV1 {
  return boundary(capability, {
    execution_state: "INHIBITED", authority_state: "REVOKED", fencing_generation: generation,
    enabled_capabilities: [], permit_expires_at: "2026-10-01T00:01:00.000Z",
    effective_safety_controls: { global_stop: false, account_stop: false, capability_stop: true, reasons: ["catfood_authority_revoked"] },
    stop_acknowledgement: "INHIBITED", blocked_reasons: ["authority_revoked", "safety_control_inhibited"],
    ...overrides,
  });
}

function spec(): CatfoodRunSpec {
  return createRunSpec({
    run_id: "catfood-run-1",
    ikorabu_sha: CATFOOD_IKORABU_BASE,
    threads_sha: CATFOOD_THREADS_SHA,
    wp1_contract_sha256: CATFOOD_WP1_CONTRACT_SHA256,
    operational_boundary_sha256: CATFOOD_BOUNDARY_SHA256,
    threads_release_artifact_sha256: CATFOOD_THREADS_RELEASE_SHA256,
    target_schema: 30,
    target_schema_fingerprint: "5".repeat(64),
    migration_provenance_digest: "6".repeat(64),
    environment: "isolated-fixture",
    tenant_id: "tenant_fixture",
    org_id: "org_fixture",
    account_id: "acct_fixture",
    capabilities: CATFOOD_INITIAL_CAPABILITIES,
    effective_config_sha256: canonicalSha256(config),
    budget_policy: { paid_ai_allowed: false, maximum_paid_cost_micros: 0 },
    cadence_seconds_by_class: { editorial: 3600, publication_dry_run: 7200 },
    requested_duration_seconds: 86_400,
    window_start: start,
    window_end: end,
    restart_policy: { planned_restart_required: true, max_catch_up_per_class: 1 },
    minimum_meaningful_units: 3,
    minimum_work_classes: 2,
    human_go_ref: "go:fixture",
    night_state: CATFOOD_NIGHT_STATE,
  });
}

function go(runSpec = spec()): HumanGo {
  return {
    run_id: runSpec.run_id, spec_hash: runSpec.canonical_spec_sha256,
    environment: runSpec.environment, tenant_id: runSpec.tenant_id, org_id: runSpec.org_id,
    account_id: runSpec.account_id, capabilities: runSpec.capabilities,
    approved_at: "2026-09-30T12:00:00.000Z", expires_at: "2026-10-02T01:00:00.000Z",
    approval_ref: runSpec.human_go_ref, approval_identity: "human:fixture-reviewer",
  };
}

function database(): { dir: string; path: string; db: Database } {
  const dir = mkdtempSync(join(tmpdir(), "catfood-harness-"));
  const path = join(dir, "catfood.db");
  writeFileSync(path, "");
  initializeCatfoodStore(path);
  return { dir, path, db: openCatfoodStore(path) };
}

function seeded(): { dir: string; path: string; db: Database; runSpec: CatfoodRunSpec; lease: ReturnType<typeof acquireLease> } {
  const result = database();
  const runSpec = spec();
  persistRunSpec(result.db, runSpec, go(runSpec), start);
  const lease = acquireLease(result.db, runSpec.run_id, "owner-a", start, 300);
  return { ...result, runSpec, lease };
}

describe("CATFOOD frozen Operational Boundary v1", () => {
  const threadsRepo = process.env.THREADS_FROZEN_REPO;
  describe.skipIf(!threadsRepo)("exact accepted fixtures", () => {
    test("validates all fixture bytes and the frozen artifact", () => {
      const fixtureDir = resolve(threadsRepo!, "tests", "fixtures");
      for (const [name, digest] of Object.entries(CATFOOD_BOUNDARY_FIXTURE_SHA256)) {
        const bytes = readFileSync(join(fixtureDir, name));
        expect(sha256(bytes)).toBe(digest);
        expect(validateOperationalBoundaryV1(JSON.parse(bytes.toString("utf8"))).boundary_version).toBe(1);
      }
      const fixtureNames = Object.keys(CATFOOD_BOUNDARY_FIXTURE_SHA256);
      const combined = Buffer.concat([
        readFileSync(join(fixtureDir, "operational_boundary_v1_positive.json")),
        ...fixtureNames.filter((name) => name.startsWith("operational_boundary_v1_negative")).sort().map((name) => readFileSync(join(fixtureDir, name))),
      ]);
      expect(sha256(combined)).toBe(CATFOOD_COMBINED_FIXTURE_SHA256);
      expect(sha256(readFileSync(resolve(threadsRepo!, "docs", "operational-boundary-v1.json")))).toBe(CATFOOD_BOUNDARY_SHA256);
    });
  });

  test("fails closed on unknown, missing, malformed and future shapes", () => {
    expect(validateOperationalBoundaryV1(boundary()).source_evidence.coverage).toBe("unknown");
    expect(() => validateOperationalBoundaryV1({ ...boundary(), invented: true })).toThrow(CatfoodError);
    const missing = { ...boundary() }; delete (missing as Record<string, unknown>).schema_readiness;
    expect(() => validateOperationalBoundaryV1(missing)).toThrow(CatfoodError);
    expect(() => validateOperationalBoundaryV1(withHash({ ...boundary(), schema_readiness: "FUTURE_READY" }))).toThrow(CatfoodError);
    expect(validateOperationalBoundaryV1(boundary("editorial.cycle", { schema_version: 31, schema_readiness: "FUTURE_SCHEMA", execution_state: "UNKNOWN", blocked_reasons: ["future_schema"] })).schema_readiness).toBe("FUTURE_SCHEMA");
  });
});

describe("CATFOOD immutable spec and preflight", () => {
  test("binds an external GO and rejects secrets, mismatch and expiry", () => {
    const runSpec = spec();
    expect(runSpec.canonical_spec_sha256).toBe(canonicalSha256(Object.fromEntries(Object.entries(runSpec).filter(([key]) => key !== "canonical_spec_sha256"))));
    expect(() => createRunSpec({ ...runSpec, human_go_ref: "api_key=secret" } as never)).toThrow("secret");
    expect(() => evaluatePreflight(preflight({ human_go: { ...go(runSpec), account_id: "acct_other" } }))).not.toThrow();
    expect(evaluatePreflight(preflight({ human_go: { ...go(runSpec), expires_at: start } })).reasons).toContain("HUMAN_GO_EXPIRED");
  });

  test("requires every frozen identity, tenant enforcement and meaningful inventory", () => {
    expect(evaluatePreflight(preflight()).ok).toBe(true);
    expect(evaluatePreflight(preflight({ feature_multi_tenant_auth: "true" })).reasons).toContain("MULTI_TENANT_AUTH_DISABLED");
    expect(evaluatePreflight(preflight({ catfood_harness_enabled: undefined })).reasons).toContain("CATFOOD_HARNESS_DISABLED");
    expect(evaluatePreflight(preflight({ missing_identity_probe_status: 200 })).reasons).toContain("TENANT_ENFORCEMENT_NOT_PROVED");
    expect(evaluatePreflight(preflight({ boundary_artifact_sha256: "0".repeat(64) })).reasons).toContain("BOUNDARY_ARTIFACT_MISMATCH");
    expect(evaluatePreflight(preflight({ eligible_units_by_class: { editorial: 3 } })).reasons).toContain("INSUFFICIENT_WORK_CLASSES");
    expect(evaluatePreflight(preflight({ observed_cost_state: "UNKNOWN" })).reasons).toContain("PAID_WORK_NOT_EXCLUDED");
    expect(evaluatePreflight(preflight({ human_go: null })).reasons).toContain("HUMAN_GO_MISSING");
    expect(evaluatePreflight(preflight({ ikorabu_sha: "0".repeat(40) })).reasons).toContain("IKORABU_SHA_MISMATCH");
    const accepted = spec();
    const { canonical_spec_sha256: _digest, ...raw } = accepted;
    const wrongThreads = createRunSpec({ ...raw, threads_sha: "0".repeat(40) });
    expect(evaluatePreflight(preflight({ spec: wrongThreads, human_go: go(wrongThreads) })).reasons).toContain("THREADS_SHA_MISMATCH");
    const wrongRelease = createRunSpec({ ...raw, threads_release_artifact_sha256: "0".repeat(64) });
    expect(evaluatePreflight(preflight({ spec: wrongRelease, human_go: go(wrongRelease) })).reasons).toContain("THREADS_RELEASE_MISMATCH");
    const future = boundary("editorial.cycle", { schema_version: 31, schema_readiness: "FUTURE_SCHEMA", execution_state: "UNKNOWN", blocked_reasons: ["future_schema"] });
    expect(evaluatePreflight(preflight({ boundaries: [future, boundary("editorial.outcome_evaluation"), boundary("threads.publish.dry_run")] })).reasons).toContain("SCHEMA_IDENTITY_MISMATCH");
  });

  test("is exact-value default OFF", () => {
    expect(catfoodHarnessEnabled({})).toBe(false);
    expect(catfoodHarnessEnabled({ CATFOOD_HARNESS_ENABLED: "true" })).toBe(false);
    expect(catfoodHarnessEnabled({ CATFOOD_HARNESS_ENABLED: "1" })).toBe(true);
  });
});

describe("CATFOOD bounded Bridge client", () => {
  test("probes tenant enforcement and refuses authority mutation without passed preflight", async () => {
    const calls: Request[] = [];
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = new Request(input, init); calls.push(request);
      if (request.method === "POST") return Response.json({ account_id: "acct_fixture", capability: "editorial.cycle", authority_ref: "run:1", spec_hash: "a".repeat(64), authority_state: "ACTIVE", permit_expires_at: "2026-10-01T00:01:00.000Z", fencing_generation: 1, stop_acknowledgement: "NOT_REQUESTED" });
      return new Response("{}", { status: request.headers.has("X-Threads-User-ID") ? 200 : 403 });
    }) as typeof fetch;
    const client = new CatfoodBridgeClient("http://127.0.0.1:8000", "fixture-secret", fetcher);
    expect(await client.tenantEnforcementProbe("acct_fixture", "editorial.cycle", "user_fixture")).toEqual({ authorized_status: 200, missing_identity_status: 403 });
    await expect(client.changeAuthority({ action: "grant", account_id: "acct_fixture", capability: "editorial.cycle", authority_ref: "run:1", spec_hash: "a".repeat(64), permit_expires_at: "2026-10-01T00:01:00.000Z" }, "user_fixture", { ok: false, reasons: ["blocked"], boundaries: [] })).rejects.toThrow("PREFLIGHT_REQUIRED");
    expect(calls.filter((call) => call.method === "POST")).toHaveLength(0);
    const response = await client.changeAuthority({ action: "grant", account_id: "acct_fixture", capability: "editorial.cycle", authority_ref: "run:1", spec_hash: "a".repeat(64), permit_expires_at: "2026-10-01T00:01:00.000Z" }, "user_fixture", { ok: true, reasons: [], boundaries: [] });
    expect(response.fencing_generation).toBe(1);
    expect(calls.at(-1)?.url).toEndWith("/autopilot/v2/operational-authority");
  });
});

function preflight(overrides: Record<string, unknown> = {}) {
  const runSpec = spec();
  return {
    spec: runSpec, human_go: go(runSpec), now: start, effective_config: config,
    feature_multi_tenant_auth: "1", catfood_harness_enabled: "1", authorized_probe_status: 200, missing_identity_probe_status: 403,
    boundaries: CATFOOD_INITIAL_CAPABILITIES.map((capability) => boundary(capability)),
    boundary_artifact_sha256: CATFOOD_BOUNDARY_SHA256, ikorabu_sha: CATFOOD_IKORABU_BASE,
    store_healthy: true, overlapping_owner: false, unresolved_unsafe_or_ambiguous: false,
    eligible_units_by_class: { editorial: 1, publication_dry_run: 2 },
    provider_invoked: false, observed_cost_state: "NOT_APPLICABLE", phase: "AFTER_AUTHORITY" as const,
    ...overrides,
  } as Parameters<typeof evaluatePreflight>[0];
}

describe("CATFOOD dedicated store, ownership and work", () => {
  test("requires an explicit pre-existing non-demo store", () => {
    const dir = mkdtempSync(join(tmpdir(), "catfood-store-"));
    try {
      expect(() => initializeCatfoodStore(join(dir, "missing.db"))).toThrow("STORE_MUST_PREEXIST");
      const demo = join(dir, "agents-demo.db"); writeFileSync(demo, "");
      expect(() => initializeCatfoodStore(demo)).toThrow("DEMO_DB_FORBIDDEN");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test("fences a second owner and increments only on closed-authority restart", () => {
    const { dir, db, runSpec } = seeded();
    try {
      expect(() => acquireLease(db, runSpec.run_id, "owner-b", "2026-10-01T00:00:01.000Z", 60)).toThrow("LEASE_HELD");
      expect(() => acquireLease(db, runSpec.run_id, "owner-b", "2026-10-01T00:06:00.000Z", 60)).toThrow("RESTART_BOUNDARY_REQUIRED");
      db.exec("CREATE TRIGGER fixture_fail_restart BEFORE INSERT ON catfood_evidence_events BEGIN SELECT RAISE(ABORT,'fixture restart crash'); END");
      expect(() => acquireLease(db, runSpec.run_id, "owner-b", "2026-10-01T00:06:00.000Z", 60, stoppedBoundary())).toThrow("fixture restart crash");
      expect(db.query<{ owner_id: string; wp3_epoch: number }, []>("SELECT owner_id,wp3_epoch FROM catfood_run_leases").get()).toEqual({ owner_id: "owner-a", wp3_epoch: 1 });
      db.exec("DROP TRIGGER fixture_fail_restart");
      const next = acquireLease(db, runSpec.run_id, "owner-b", "2026-10-01T00:06:00.000Z", 60, stoppedBoundary());
      expect(next.wp3_epoch).toBe(2);
      expect(() => setNextDue(db, { ...next, owner_id: "owner-a", wp3_epoch: 1 }, "editorial", start, "2026-10-01T00:06:01.000Z")).toThrow("STALE_WP3_EPOCH");
      setNextDue(db, next, "editorial", "2026-10-01T00:05:00.000Z", "2026-10-01T00:06:01.000Z");
      const refreshed = acquireLease(db, runSpec.run_id, "owner-b", "2026-10-01T00:06:02.000Z", 60);
      expect(dueClasses(refreshed, "2026-10-01T00:06:03.000Z")).toEqual(["editorial"]);
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });

  test("maps independent generations, prevents duplicates, drains, and aborts paid work", () => {
    const { dir, db, lease } = seeded();
    try {
      const before = boundary();
      recordAuthorityEpoch(db, lease, "editorial.cycle", "run:epoch:1", 1, before.permit_expires_at!, before, start);
      startWorkUnit(db, lease, { unit_id: "unit-1", capability: "editorial.cycle", work_class: "editorial", request_id: "request-1", request: { cycle: "fixture" }, pre_boundary: before, cost_state: "NOT_APPLICABLE" }, "2026-10-01T00:00:01.000Z");
      expect(() => startWorkUnit(db, lease, { unit_id: "unit-2", capability: "editorial.cycle", work_class: "editorial", request_id: "request-1", request: {}, pre_boundary: before, cost_state: "KNOWN_ZERO" }, "2026-10-01T00:00:02.000Z")).toThrow();
      finishWorkUnit(db, lease, "unit-1", "SUCCEEDED", { status: "ok" }, before, { cost_state: "NOT_APPLICABLE" }, "2026-10-01T00:00:03.000Z");
      expect(classifyDrain(db, lease.run_id).drained).toBe(true);
      expect(recordStopSnapshot(db, lease, stoppedBoundary(), "2026-10-01T00:00:04.000Z").remaining).toBe(0);

      const dry = boundary("threads.publish.dry_run");
      recordAuthorityEpoch(db, lease, "threads.publish.dry_run", "run:epoch:1:dry", 1, dry.permit_expires_at!, dry, "2026-10-01T00:00:05.000Z");
      startWorkUnit(db, lease, { unit_id: "unit-paid", capability: "threads.publish.dry_run", work_class: "publication_dry_run", request_id: "request-paid", request: {}, pre_boundary: dry, cost_state: "KNOWN_ZERO" }, "2026-10-01T00:00:06.000Z");
      finishWorkUnit(db, lease, "unit-paid", "SUCCEEDED", {}, dry, { cost_state: "KNOWN_NONZERO", provider_invoked: true }, "2026-10-01T00:00:07.000Z");
      expect(db.query<{ lifecycle_state: string }, []>("SELECT lifecycle_state FROM catfood_run_leases").get()?.lifecycle_state).toBe("ABORTED");
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });

  test("preserves Threads generation on renewal and remaps it after takeover", () => {
    const { dir, db, runSpec, lease } = seeded();
    try {
      const first = boundary();
      recordAuthorityEpoch(db, lease, "editorial.cycle", "authority-epoch-1", 1, first.permit_expires_at!, first, start);
      const renewed = boundary("editorial.cycle", { permit_expires_at: "2026-10-01T00:02:00.000Z" });
      recordAuthorityRenewal(db, lease, "editorial.cycle", renewed, "2026-10-01T00:00:30.000Z");
      expect(db.query<{ threads_generation: number; permit_expires_at: string }, []>("SELECT threads_generation,permit_expires_at FROM catfood_authority_epochs").get())
        .toEqual({ threads_generation: 1, permit_expires_at: "2026-10-01T00:02:00.000Z" });
      startWorkUnit(db, lease, { unit_id: "unit-renewed", capability: "editorial.cycle", work_class: "editorial", request_id: "request-renewed", request: {}, pre_boundary: renewed, cost_state: "NOT_APPLICABLE" }, "2026-10-01T00:01:30.000Z");
      const takeover = acquireLease(db, runSpec.run_id, "owner-b", "2026-10-01T00:06:00.000Z", 60, stoppedBoundary());
      const second = boundary("editorial.cycle", { fencing_generation: 3, permit_expires_at: "2026-10-01T00:07:00.000Z" });
      recordAuthorityEpoch(db, takeover, "editorial.cycle", "authority-epoch-2", 3, second.permit_expires_at!, second, "2026-10-01T00:06:01.000Z");
      expect(db.query<{ threads_generation: number }, []>("SELECT threads_generation FROM catfood_authority_epochs ORDER BY wp3_epoch").all().map((row) => row.threads_generation)).toEqual([1, 3]);
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });

  test("rolls back mapping and work intent when evidence persistence fails", () => {
    const { dir, db, lease } = seeded();
    try {
      db.exec("CREATE TRIGGER fixture_fail_evidence BEFORE INSERT ON catfood_evidence_events BEGIN SELECT RAISE(ABORT,'fixture crash'); END");
      const before = boundary();
      expect(() => recordAuthorityEpoch(db, lease, "editorial.cycle", "authority", 1, before.permit_expires_at!, before, start)).toThrow("fixture crash");
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM catfood_authority_epochs").get()?.n).toBe(0);
      db.exec("DROP TRIGGER fixture_fail_evidence");
      recordAuthorityEpoch(db, lease, "editorial.cycle", "authority", 1, before.permit_expires_at!, before, start);
      db.exec("CREATE TRIGGER fixture_fail_evidence BEFORE INSERT ON catfood_evidence_events BEGIN SELECT RAISE(ABORT,'fixture crash'); END");
      expect(() => startWorkUnit(db, lease, { unit_id: "unit-crash", capability: "editorial.cycle", work_class: "editorial", request_id: "request-crash", request: {}, pre_boundary: before, cost_state: "NOT_APPLICABLE" }, "2026-10-01T00:00:01.000Z")).toThrow("fixture crash");
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM catfood_work_units").get()?.n).toBe(0);
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });

  test("keeps intent after an execution crash and bounded drain refuses false success", async () => {
    const { dir, db, lease } = seeded();
    try {
      const before = boundary();
      recordAuthorityEpoch(db, lease, "editorial.cycle", "authority", 1, before.permit_expires_at!, before, start);
      startWorkUnit(db, lease, { unit_id: "unit-in-flight", capability: "editorial.cycle", work_class: "editorial", request_id: "request-in-flight", request: {}, pre_boundary: before, cost_state: "NOT_APPLICABLE" }, "2026-10-01T00:00:01.000Z");
      expect(classifyDrain(db, lease.run_id).remaining).toBe(1);
      expect((await boundedDrain(db, lease.run_id, async () => stoppedBoundary(), 5, 1)).drained).toBe(false);
      finishWorkUnit(db, lease, "unit-in-flight", "BLOCKED", { reason: "reconciled_unknown" }, stoppedBoundary("editorial.cycle", 1), { cost_state: "NOT_APPLICABLE", unsafe_or_ambiguous: true }, "2026-10-01T00:00:02.000Z");
      expect(classifyDrain(db, lease.run_id).drained).toBe(true);
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });
});

function buildPassingBundle() {
  const seededStore = seeded();
  const { db, lease: firstLease, runSpec } = seededStore;
  appendEvidence(db, firstLease.run_id, "lifecycle.running", start, {});
  const firstCycle = boundary("editorial.cycle");
  recordAuthorityEpoch(db, firstLease, "editorial.cycle", "authority-cycle", 1, firstCycle.permit_expires_at!, firstCycle, "2026-10-01T00:00:01.000Z");
  startWorkUnit(db, firstLease, { unit_id: "unit-0", capability: "editorial.cycle", work_class: "editorial", request_id: "request-0", request: { index: 0 }, pre_boundary: firstCycle, cost_state: "NOT_APPLICABLE" }, "2026-10-01T00:00:30.000Z");
  finishWorkUnit(db, firstLease, "unit-0", "SUCCEEDED", { index: 0, status: "ok" }, firstCycle, { cost_state: "NOT_APPLICABLE" }, "2026-10-01T00:00:40.000Z");
  const lease = acquireLease(db, runSpec.run_id, "owner-b", end, 300, stoppedBoundary("editorial.cycle", 2, { observed_at: end }));
  for (const [index, capability] of ["editorial.cycle", "threads.publish.dry_run", "threads.publish.dry_run"].entries()) {
    if (index === 0) continue;
    const cap = (index === 1 ? "editorial.outcome_evaluation" : capability) as CatfoodCapability;
    const before = boundary(cap, { observed_at: end, permit_expires_at: "2026-10-02T00:05:00.000Z", fencing_generation: 3 });
    recordAuthorityEpoch(db, lease, cap, `authority-${index}`, 3, before.permit_expires_at!, before, `2026-10-02T00:00:0${index}.000Z`);
    startWorkUnit(db, lease, { unit_id: `unit-${index}`, capability: cap, work_class: index === 1 ? "editorial" : "publication_dry_run", request_id: `request-${index}`, request: { index }, pre_boundary: before, cost_state: index === 1 ? "NOT_APPLICABLE" : "KNOWN_ZERO" }, `2026-10-02T00:01:0${index}.000Z`);
    finishWorkUnit(db, lease, `unit-${index}`, "SUCCEEDED", { index, status: "ok" }, before, { cost_state: index === 1 ? "NOT_APPLICABLE" : "KNOWN_ZERO" }, `2026-10-02T00:02:0${index}.000Z`);
  }
  const finalStop = stoppedBoundary("editorial.cycle", 3, { observed_at: "2026-10-02T00:03:00.000Z" });
  recordStopSnapshot(db, lease, finalStop, "2026-10-02T00:03:00.000Z");
  appendEvidence(db, lease.run_id, "lifecycle.completed", "2026-10-02T00:03:01.000Z", { wp3_epoch: lease.wp3_epoch });
  const closed = closeEvidenceBundle(db, lease, "2026-10-02T00:04:00.000Z");
  return { ...seededStore, lease, closed };
}

describe("CATFOOD deterministic bundle and independent attestation", () => {
  test("rolls back an interrupted bundle close and retries with one immutable digest", () => {
    const { dir, db, lease } = seeded();
    try {
      db.exec("CREATE TRIGGER fixture_fail_bundle BEFORE INSERT ON catfood_evidence_bundles BEGIN SELECT RAISE(ABORT,'fixture bundle crash'); END");
      expect(() => closeEvidenceBundle(db, lease, "2026-10-01T00:01:00.000Z")).toThrow("fixture bundle crash");
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM catfood_evidence_bundles").get()?.n).toBe(0);
      db.exec("DROP TRIGGER fixture_fail_bundle");
      const closed = closeEvidenceBundle(db, lease, "2026-10-01T00:01:00.000Z");
      expect(closeEvidenceBundle(db, lease, "2026-10-01T00:02:00.000Z").bundle_sha256).toBe(closed.bundle_sha256);
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });

  test("replays deterministically, blocks weak evidence, and detects tampering", () => {
    const { dir, db, closed } = buildPassingBundle();
    try {
      const text = canonicalJson(closed.bundle);
      const first = evaluateClosedBundle(text, closed.bundle_sha256);
      const second = evaluateClosedBundle(text, closed.bundle_sha256);
      expect(first).toEqual(second);
      expect(first.result).toBe("PASS");
      const weak = structuredClone(closed.bundle);
      (weak.work_units as Json[]).splice(1);
      expect(evaluateClosedBundle(canonicalJson(weak)).result).toBe("BLOCKED");
      const oneClass = structuredClone(closed.bundle);
      for (const unit of oneClass.work_units as Record<string, Json>[]) unit.work_class = "editorial";
      expect(evaluateClosedBundle(canonicalJson(oneClass)).reason_codes).toContain("WORK_CLASS_THRESHOLD_NOT_MET");
      const fakeRestart = structuredClone(closed.bundle);
      (fakeRestart.lease as Record<string, Json>).wp3_epoch = 1;
      expect(evaluateClosedBundle(canonicalJson(fakeRestart)).reason_codes).toContain("PLANNED_RESTART_MISSING");
      const pending = structuredClone(closed.bundle);
      (pending.work_units as Record<string, Json>[])[0].status = "INTENT";
      expect(evaluateClosedBundle(canonicalJson(pending)).reason_codes).toContain("UNRESOLVED_WORK");
      expect(() => evaluateClosedBundle(`${text} `, closed.bundle_sha256)).not.toThrow();
      const changed = structuredClone(closed.bundle) as Record<string, Json>;
      changed.closed_at = "2026-10-03T00:00:00.000Z";
      expect(() => evaluateClosedBundle(canonicalJson(changed), closed.bundle_sha256)).toThrow("BUNDLE_TAMPERED");
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });

  test("normal evidence store cannot write the separate immutable attestation store", () => {
    const { dir, path, db, lease, closed } = buildPassingBundle();
    const attestationPath = join(dir, "attestation.db"); writeFileSync(attestationPath, "");
    try {
      initializeAttestationStore(attestationPath);
      const id = attestClosedRun(path, attestationPath, lease.run_id, "independent-auditor", "2026-10-02T01:00:00.000Z");
      expect(id.startsWith("att:")).toBe(true);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE name='acceptance_attestations'").get()?.n).toBe(0);
      const attestDb = new Database(attestationPath, { readonly: true });
      expect(attestDb.query<{ bundle_sha256: string }, []>("SELECT bundle_sha256 FROM acceptance_attestations").get()?.bundle_sha256).toBe(closed.bundle_sha256);
      attestDb.close();
      expect(() => attestClosedRun(path, attestationPath, lease.run_id, "independent-auditor", "2026-10-02T01:00:01.000Z")).toThrow();
    } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
  });
});
