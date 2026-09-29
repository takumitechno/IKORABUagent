import { afterAll, describe, expect, test } from "bun:test";
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
    const replacement = await supervisor.send(command({ kind: "REQUEST_REPLACEMENT", operation_id: "replace:blocked", observed_after_lease_ms: 1, lease_lifetime_ms: 120_000 }));
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
