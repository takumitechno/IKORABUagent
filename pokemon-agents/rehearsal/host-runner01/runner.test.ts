import { afterAll, describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonicalJson } from "../../web/lib/catfood-harness";
import { cutForAttestedState } from "./host-worker";
import { RehearsalHostSupervisor } from "./supervisor";
import type { WorkerCommand, WorkerResponse } from "./protocol";

const leftovers = new Set<string>();
afterAll(() => { Bun.gc(true); for (const path of leftovers) try { rmSync(path, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); } catch {} });

async function rig(run: (supervisor: RehearsalHostSupervisor, dir: string) => Promise<void>): Promise<void> {
  const dir = mkdtempSync(join(tmpdir(), "host-runner01-")), supervisor = new RehearsalHostSupervisor({ campaign_id: "campaign:test", case_id: `case:${Date.now()}:${Math.random().toString(16).slice(2)}`, case_dir: dir });
  leftovers.add(dir);
  try { await run(supervisor, dir); }
  finally {
    if (supervisor.worker) try { await supervisor.forceKill(); } catch {}
    Bun.gc(true);
    try { rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 30 }); leftovers.delete(dir); } catch {}
  }
}

let commandNumber = 0;
const command = <T extends Omit<WorkerCommand, "id">>(value: T): WorkerCommand => ({ id: `cmd:${++commandNumber}`, ...value } as WorkerCommand);
const ok = async (supervisor: RehearsalHostSupervisor, value: Omit<WorkerCommand, "id">): Promise<WorkerResponse> => {
  const response = await supervisor.send(command(value));
  expect(response.ok).toBeTrue();
  return response;
};

async function activeCase(supervisor: RehearsalHostSupervisor): Promise<void> {
  await supervisor.start();
  await ok(supervisor, { kind: "INITIALIZE_CASE" });
  await ok(supervisor, { kind: "RESERVE", operation_id: "reserve:one" });
  await ok(supervisor, { kind: "ADMIT", operation_id: "admit:one", lease_lifetime_ms: 120_000 });
}

async function reservedCase(supervisor: RehearsalHostSupervisor): Promise<void> {
  await supervisor.start();
  await ok(supervisor, { kind: "INITIALIZE_CASE" });
  await ok(supervisor, { kind: "RESERVE", operation_id: "reserve:one" });
}

describe("TEST_ONLY rehearsal host runner U01-U12", () => {
  test("U01 Host runs in a different OS process", async () => rig(async (supervisor) => {
    const worker = await supervisor.start();
    expect(worker.pid).not.toBe(process.pid);
    await supervisor.forceKill();
  }));

  test("U02 persistent adapter state survives Host replacement", async () => rig(async (supervisor) => {
    await activeCase(supervisor);
    await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H1" });
    const before = await ok(supervisor, { kind: "REPORT_STATE" });
    await supervisor.forceKill(); await supervisor.start();
    const after = await ok(supervisor, { kind: "REPORT_STATE" });
    expect((after.result as any).material).toEqual((before.result as any).material);
    const h2 = await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H2" });
    expect((h2.result as any).material).toBe("H2");
  }));

  test("U03 R2a cut is deterministic without DB editing", async () => rig(async (supervisor) => {
    await activeCase(supervisor);
    await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H1" });
    await ok(supervisor, { kind: "CONFIGURE_WITNESS_FAULT", mode: "BEFORE_COMMIT" });
    const response = await supervisor.send(command({ kind: "ADVANCE_LINEAGE", operation_id: "lineage:r2a" }));
    expect(response).toMatchObject({ ok: false, error_code: "WITNESS_UNAVAILABLE", cut: "R2A_CUT_REACHED", result: { operation: { kind: "ADVANCE_LINEAGE", status: "PENDING" }, witness_sequence: null, material: "H1" } });
    const replacement = await supervisor.send(command({ kind: "REQUEST_REPLACEMENT", operation_id: "replace:blocked", lease_lifetime_ms: 120_000 }));
    expect(replacement).toMatchObject({ ok: false, error_code: "CONTINUITY_OPERATION_PENDING" });
    const state = await ok(supervisor, { kind: "STATUS_READ" }); expect(state.result).toMatchObject({ state: "ACTIVE" });
  }));

  test("U04 R2b cut is deterministic without DB editing", async () => rig(async (supervisor) => {
    await activeCase(supervisor);
    await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H1" });
    await ok(supervisor, { kind: "CONFIGURE_WITNESS_FAULT", mode: "AFTER_COMMIT" });
    const response = await supervisor.send(command({ kind: "ADVANCE_LINEAGE", operation_id: "lineage:r2b" }));
    expect(response).toMatchObject({ ok: false, error_code: "WITNESS_RESPONSE_LOST", cut: "R2B_CUT_REACHED", result: { operation: { kind: "ADVANCE_LINEAGE", status: "PENDING" }, material: "H1" } });
    expect((response.result as any).witness_sequence).toBeGreaterThan(0);
  }));

  test("U05 forced kill bypasses graceful Host shutdown", async () => rig(async (supervisor, dir) => {
    await supervisor.start(); await supervisor.forceKill();
    expect(existsSync(join(dir, "graceful-stop.observed"))).toBeFalse();
    expect(supervisor.evidence().some((event) => event.event === "FORCED_KILL_CONFIRMED")).toBeTrue();
    await supervisor.start(); await supervisor.gracefulStop();
    expect(existsSync(join(dir, "graceful-stop.observed"))).toBeTrue();
    expect(supervisor.evidence().some((event) => event.event === "GRACEFUL_STOP_CONFIRMED")).toBeTrue();
  }));

  test("U06 supervisor observes old exit before new start", async () => rig(async (supervisor) => {
    const first = await supervisor.start(); await supervisor.forceKill(); const second = await supervisor.start();
    const events = supervisor.evidence(), exitIndex = events.findIndex((event) => event.event === "HOST_PROCESS_EXIT_OBSERVED" && event.pid === first.pid), startIndex = events.findIndex((event) => event.event === "HOST_PROCESS_STARTED" && event.pid === second.pid);
    expect(exitIndex).toBeGreaterThanOrEqual(0); expect(startIndex).toBeGreaterThan(exitIndex);
  }));

  test("U07 replacement opens the same persistent stores", async () => rig(async (supervisor) => {
    await supervisor.start(); const before = await ok(supervisor, { kind: "INITIALIZE_CASE" }); await supervisor.forceKill(); await supervisor.start(); const after = await ok(supervisor, { kind: "INITIALIZE_CASE" });
    expect((after.result as any).store_paths).toEqual((before.result as any).store_paths);
    expect((after.result as any).store_ids).toEqual((before.result as any).store_ids);
  }));

  test("U08 recovery reuses the original operation ID", async () => rig(async (supervisor) => {
    await activeCase(supervisor);
    await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H1" }); await ok(supervisor, { kind: "CONFIGURE_WITNESS_FAULT", mode: "AFTER_COMMIT" });
    const original = "lineage:original"; const cut = await supervisor.send(command({ kind: "ADVANCE_LINEAGE", operation_id: original })); expect(cut.cut).toBe("R2B_CUT_REACHED");
    await supervisor.forceKill(); await supervisor.start();
    const recovered = await ok(supervisor, { kind: "ADVANCE_LINEAGE", operation_id: original }); expect(recovered.result).toMatchObject({ sequence: 1, replay: false });
    const status = await ok(supervisor, { kind: "RECONCILE_READ", operation_id: original }); expect(status.result).toMatchObject({ kind: "ADVANCE_LINEAGE", status: "APPLIED" });
  }));

  test("U09 a second live Host is a hard stop", async () => rig(async (supervisor) => {
    await supervisor.start(); await expect(supervisor.start()).rejects.toThrow("TRUST_FAILURE_HOST_ALREADY_LIVE");
  }));

  test("U10 protocol exposes no generic or raw capability command", async () => rig(async (supervisor) => {
    await supervisor.start();
    const response = await supervisor.send({ id: "cmd:raw", kind: "GET_CONTROLLER" } as never);
    expect(response).toEqual({ id: "cmd:raw", ok: false, error_code: "PROTOCOL_COMMAND_INVALID" });
    expect(JSON.stringify(response)).not.toContain("private_key");
  }));

  test("U11 supervisor evidence survives Host death", async () => rig(async (supervisor) => {
    await supervisor.start(); await supervisor.forceKill();
    expect(existsSync(supervisor.evidencePath)).toBeTrue();
    const text = readFileSync(supervisor.evidencePath, "utf8");
    expect(text).toContain("HOST_PROCESS_EXIT_OBSERVED"); expect(text).toContain("FORCED_KILL_CONFIRMED");
  }));

  test("U12 runner requires no provider or network route", async () => rig(async (supervisor) => {
    await supervisor.start(); const response = await ok(supervisor, { kind: "INITIALIZE_CASE" });
    expect((response.result as any).network_required).toBeFalse();
  }));
});

describe("Claude B1 cut attestation corrective", () => {
  test("cut labels require pending durable material and exact persisted witness equality", () => {
    const record = { schema: "test-only-continuity-witness.v1", operation_id: "lineage:b1", key_sha256: "a".repeat(64), sequence: 4, previous_digest: "b".repeat(64), transition: "ADVANCE_LINEAGE", payload_sha256: "c".repeat(64), record_digest: "d".repeat(64) }, witness = { record }, persisted = canonicalJson(record as never);
    expect(cutForAttestedState("WITNESS_UNAVAILABLE", { status: "PENDING", witness_record_json: persisted }, "H1", null)).toBe("R2A_CUT_REACHED");
    expect(cutForAttestedState("WITNESS_UNAVAILABLE", { status: "ACKNOWLEDGED", witness_record_json: persisted }, "H1", null)).toBeUndefined();
    expect(cutForAttestedState("WITNESS_UNAVAILABLE", { status: "PENDING", witness_record_json: persisted }, "PRE_WRITE", null)).toBeUndefined();
    expect(cutForAttestedState("WITNESS_UNAVAILABLE", { status: "PENDING", witness_record_json: persisted }, "H1", witness)).toBeUndefined();
    expect(cutForAttestedState("WITNESS_RESPONSE_LOST", { status: "PENDING", witness_record_json: persisted }, "H1", witness)).toBe("R2B_CUT_REACHED");
    expect(cutForAttestedState("WITNESS_RESPONSE_LOST", { status: "ACKNOWLEDGED", witness_record_json: persisted }, "H1", witness)).toBeUndefined();
    expect(cutForAttestedState("WITNESS_RESPONSE_LOST", { status: "PENDING", witness_record_json: persisted }, "PRE_WRITE", witness)).toBeUndefined();
    expect(cutForAttestedState("WITNESS_RESPONSE_LOST", { status: "PENDING", witness_record_json: persisted }, "H1", { record: { ...record, sequence: 5 } })).toBeUndefined();
  });

  test("cut, reconcile, and report COMMAND_RESULT JSONL contains reconstructable summaries only", async () => {
    await rig(async (supervisor) => {
      await activeCase(supervisor); await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H1" }); await ok(supervisor, { kind: "CONFIGURE_WITNESS_FAULT", mode: "BEFORE_COMMIT" });
      const request = command({ kind: "ADVANCE_LINEAGE", operation_id: "lineage:b1:r2a" }); await supervisor.send(request);
      const event = supervisor.evidence().find((item) => item.event === "COMMAND_RESULT" && item.command_id === request.id);
      expect(event).toMatchObject({ fault_cut: "R2A_CUT_REACHED", operation_status: "PENDING", material: "H1", witness_record_present: false, witness_sequence: null });
    });
    await rig(async (supervisor) => {
      await activeCase(supervisor); await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H1" }); await ok(supervisor, { kind: "CONFIGURE_WITNESS_FAULT", mode: "AFTER_COMMIT" });
      const request = command({ kind: "ADVANCE_LINEAGE", operation_id: "lineage:b1:r2b" }); await supervisor.send(request);
      const reconcile = command({ kind: "RECONCILE_READ", operation_id: "lineage:b1:r2b" }); await supervisor.send(reconcile);
      const report = command({ kind: "REPORT_STATE" }); await supervisor.send(report);
      const events = supervisor.evidence(), cut = events.find((item) => item.event === "COMMAND_RESULT" && item.command_id === request.id), reconciled = events.find((item) => item.event === "COMMAND_RESULT" && item.command_id === reconcile.id), reported = events.find((item) => item.event === "COMMAND_RESULT" && item.command_id === report.id);
      expect(cut).toMatchObject({ fault_cut: "R2B_CUT_REACHED", operation_status: "PENDING", material: "H1", witness_record_present: true });
      expect(Number(cut?.witness_sequence)).toBeGreaterThan(0);
      expect(reconciled).toMatchObject({ operation_status: "PENDING", material: "H1", witness_record_present: true });
      expect(Number(reconciled?.witness_sequence)).toBeGreaterThan(0);
      expect(reported).toMatchObject({ operation_status: null, material: "H1", witness_record_present: true });
      expect(Number(reported?.witness_sequence)).toBeGreaterThan(0);
      expect(JSON.stringify({ cut, reconciled, reported })).not.toMatch(/witness_record_json|record_digest|payload_sha256/);
    });
  });
});

describe("rehearsal plan conformance corrective02", () => {
  test("positive lifecycle uses one canonical window and authentic role-owned prerequisites", async () => rig(async (supervisor) => {
    await supervisor.start(); const initialized = await ok(supervisor, { kind: "INITIALIZE_CASE" }); await ok(supervisor, { kind: "RESERVE", operation_id: "reserve:positive" }); await ok(supervisor, { kind: "ADMIT", operation_id: "admit:positive", lease_lifetime_ms: 120_000 });
    const baseline = await ok(supervisor, { kind: "ESTABLISH_POSITIVE_BASELINE", operation_id: "positive:one", commit_lifetime_ms: 30_000 }), initial = initialized.result as any, result = baseline.result as any;
    expect(initial.window_sha256).toBe(createHash("sha256").update(canonicalJson(initial.window)).digest("hex"));
    expect(result).toMatchObject({ window: initial.window, run_binding_window_sha256: initial.window_sha256, manifest_window_sha256: initial.window_sha256, close: { replay: false }, eligibility: { current: true } });
    for (const field of ["release_receipt_sha256", "evaluation_job_id", "evaluator_commit_receipt_sha256", "target_envelope"]) expect(result[field]).toBeTruthy();
    expect(JSON.stringify(result)).not.toMatch(/private_key|authority-key\.pem/);
  }));

  test("R4 replacement uses a real call-time sample bracketed in evidence", async () => rig(async (supervisor) => {
    await activeCase(supervisor); const before = await ok(supervisor, { kind: "STATUS_READ" });
    const request = command({ kind: "REQUEST_REPLACEMENT", operation_id: "replace:real-time", lease_lifetime_ms: 120_000 }), response = await supervisor.send(request), sample = Number((response.result as any).observed_now_ms);
    expect(response).toMatchObject({ ok: false, error_code: "LEASE_NOT_EXPIRED" });
    const evidence = supervisor.evidence().find((event) => event.event === "COMMAND_RESULT" && event.command_id === request.id)!;
    expect(sample).toBeLessThan(Number((before.result as any).lease_expires_ms)); expect(evidence.observed_now_ms).toBe(sample); expect(Number(evidence.observer_before_ms)).toBeLessThanOrEqual(sample); expect(sample).toBeLessThanOrEqual(Number(evidence.observer_after_ms));
  }));

  test("R6 reuses one fixed absolute expiry across separate RESERVED targets", async () => {
    const fixedExpiry = Date.now() + 5_000;
    await rig(async (supervisor) => {
      await reservedCase(supervisor); const request = command({ kind: "ADMIT_FIXED_EXPIRY", operation_id: "admit:fixed:before", lease_expires_ms: fixedExpiry }), response = await supervisor.send(request);
      expect(response).toMatchObject({ ok: true, result: { state: "ACTIVE", lease_expires_ms: fixedExpiry, submitted_lease_expires_ms: fixedExpiry } });
      expect(supervisor.evidence().find((event) => event.event === "COMMAND_RESULT" && event.command_id === request.id)).toMatchObject({ submitted_lease_expires_ms: fixedExpiry, ok: true });
    });
    await Bun.sleep(Math.max(0, fixedExpiry - Date.now() + 100));
    await rig(async (supervisor) => {
      await reservedCase(supervisor); const request = command({ kind: "ADMIT_FIXED_EXPIRY", operation_id: "admit:fixed:after", lease_expires_ms: fixedExpiry }), response = await supervisor.send(request);
      expect(response).toMatchObject({ ok: false, error_code: "LEASE_INVALID", result: { submitted_lease_expires_ms: fixedExpiry } });
      expect(supervisor.evidence().find((event) => event.event === "COMMAND_RESULT" && event.command_id === request.id)).toMatchObject({ submitted_lease_expires_ms: fixedExpiry, ok: false, error_code: "LEASE_INVALID" });
      expect((await ok(supervisor, { kind: "STATUS_READ" })).result).toMatchObject({ state: "RESERVED" });
    });
  }, 15_000);
});

describe("R3 closed attack seams", () => {
  test("R3a uses an authentic non-admitted custodian and leaves no positive lineage or follow-on", async () => rig(async (supervisor) => {
    await activeCase(supervisor);
    const request = command({ kind: "ATTEMPT_NON_ADMITTED_ADVANCE", operation_id: "r3a:non-admitted" }), response = await supervisor.send(request), result = response.result as any;
    expect(response).toMatchObject({ ok: false, error_code: "NON_ADMITTED_CUSTODIAN", result: { attack_seam: "R3A_AUTHENTIC_NON_ADMITTED_CUSTODIAN", second_custodian_authentic: true, second_custodian_admitted: false, second_custodian_lineage_current: false, controller_state: "INCIDENT", incident_kind: "NON_ADMITTED_LINEAGE_ADVANCE", lineage_sequence_before: 0, lineage_sequence_after: 0, canonical_lineage_unchanged: true, admitted_custodian_unchanged: true, witness_incident_appended: true, authorized_job_count: 0, authorized_target_count: 0, authority_job_count: 0, authority_target_count: 0, positive_follow_on: false } });
    expect(result.witness_sequence_after).toBe(result.witness_sequence_before + 1);
    const logged = supervisor.evidence().find((event) => event.event === "COMMAND_RESULT" && event.command_id === request.id);
    expect(logged).toMatchObject({ error_code: "NON_ADMITTED_CUSTODIAN", incident_kind: "NON_ADMITTED_LINEAGE_ADVANCE", second_custodian_authentic: true, second_custodian_admitted: false, canonical_lineage_unchanged: true, positive_follow_on: false });
    expect(JSON.stringify({ response, logged })).not.toMatch(/private_key|authority-key\.pem|enrollment_envelope|assignment_envelope|session_id|credential/);
    const followOn = await supervisor.send(command({ kind: "ESTABLISH_POSITIVE_BASELINE", operation_id: "r3a:forbidden-follow-on", commit_lifetime_ms: 30_000 }));
    expect(followOn.ok).toBeFalse();
    expect((await ok(supervisor, { kind: "REPORT_STATE" })).result).toMatchObject({ host_state: { state: "INCIDENT", lineage_sequence: 0 }, material: { material: "H1" } });
  }));

  test("R3c restores only the recorded root observation after canonical H1 to H2", async () => rig(async (supervisor) => {
    await activeCase(supervisor);
    await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H1" }); await ok(supervisor, { kind: "ADVANCE_LINEAGE", operation_id: "r3c:h1" });
    await ok(supervisor, { kind: "MUTATE_TEST_MATERIAL", material: "H2" }); await ok(supervisor, { kind: "ADVANCE_LINEAGE", operation_id: "r3c:h2" });
    const before = (await ok(supervisor, { kind: "REPORT_STATE" })).result as any;
    const request = command({ kind: "ATTEMPT_FRESH_STORE_ROOT_RESTORE", operation_id: "r3c:root-restore" }), response = await supervisor.send(request), result = response.result as any;
    expect(response).toMatchObject({ ok: false, error_code: "LINEAGE_ROLLBACK", result: { attack_seam: "R3C_FRESH_STORE_ROOT_RESTORE", root_source_recorded_pre_write: true, canonical_h1_h2_established: true, canonical_current_material: "H2", restored_root_authoritative: false, controller_state: "INCIDENT", incident_kind: "LINEAGE_ROLLBACK", lineage_sequence_before: 2, lineage_sequence_after: 2, canonical_lineage_unchanged: true, admitted_custodian_unchanged: true, witness_incident_appended: true, authority_revision_unchanged: true, authorized_job_count: 0, authorized_target_count: 0, authority_job_count: 0, authority_target_count: 0, positive_follow_on: false } });
    expect(result.witness_sequence_after).toBe(result.witness_sequence_before + 1);
    const after = (await ok(supervisor, { kind: "REPORT_STATE" })).result as any;
    expect(after.host_state).toMatchObject({ state: "INCIDENT", lineage_sequence: 2, current_lineage: before.host_state.current_lineage, current_lineage_sha256: before.host_state.current_lineage_sha256, admitted: before.host_state.admitted });
    expect(after.material).toMatchObject({ material: "PRE_WRITE", sequence: 3, current: before.material.pre_write_root });
    const logged = supervisor.evidence().find((event) => event.event === "COMMAND_RESULT" && event.command_id === request.id);
    expect(logged).toMatchObject({ error_code: "LINEAGE_ROLLBACK", incident_kind: "LINEAGE_ROLLBACK", root_source_recorded_pre_write: true, canonical_h1_h2_established: true, canonical_lineage_unchanged: true, authority_revision_unchanged: true, positive_follow_on: false });
    const followOn = await supervisor.send(command({ kind: "ESTABLISH_POSITIVE_BASELINE", operation_id: "r3c:forbidden-follow-on", commit_lifetime_ms: 30_000 }));
    expect(followOn.ok).toBeFalse();
    await supervisor.forceKill(); await supervisor.start();
    expect((await ok(supervisor, { kind: "REPORT_STATE" })).result).toMatchObject({ host_state: { state: "INCIDENT", lineage_sequence: 2, current_lineage: before.host_state.current_lineage } });
  }));

  test("R3 commands remain closed to caller-supplied identity and lineage material", async () => rig(async (supervisor) => {
    await supervisor.start();
    const r3a = await supervisor.send({ id: "r3a:raw", kind: "ATTEMPT_NON_ADMITTED_ADVANCE", operation_id: "r3a:raw", custodian_evidence: {} } as never);
    const r3c = await supervisor.send({ id: "r3c:raw", kind: "ATTEMPT_FRESH_STORE_ROOT_RESTORE", operation_id: "r3c:raw", lineage: {} } as never);
    expect(r3a).toEqual({ id: "r3a:raw", ok: false, error_code: "PROTOCOL_COMMAND_INVALID" });
    expect(r3c).toEqual({ id: "r3c:raw", ok: false, error_code: "PROTOCOL_COMMAND_INVALID" });
  }));
});
