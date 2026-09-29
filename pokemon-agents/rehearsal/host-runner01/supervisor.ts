import { closeSync, existsSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync, writeSync } from "node:fs";
import { join, resolve } from "node:path";
import { EvidenceRecorder, type EvidenceEvent } from "./evidence";
import type { WorkerCommand, WorkerConfig, WorkerReady, WorkerResponse } from "./protocol";

type Child = ReturnType<typeof Bun.spawn>;
type ActiveWorker = {
  child: Child;
  reader: ReadableStreamDefaultReader<Uint8Array>;
  buffer: string;
  ready?: WorkerReady;
  exitObserved: Promise<EvidenceEvent>;
};

export interface SupervisorConfig {
  readonly campaign_id: string;
  readonly case_id: string;
  readonly case_dir: string;
  readonly evidence_path?: string;
  readonly worker_path?: string;
  readonly session_lifetime_ms?: number;
  readonly policy_validity_ms?: number;
}

export class RehearsalHostSupervisor {
  readonly evidencePath: string;
  readonly recorder: EvidenceRecorder;
  readonly workerPath: string;
  private active?: ActiveWorker;
  private generation = 0;
  private lastExit?: EvidenceEvent;

  constructor(readonly config: SupervisorConfig) {
    mkdirSync(config.case_dir, { recursive: true });
    this.evidencePath = resolve(config.evidence_path ?? join(config.case_dir, "supervisor-evidence.jsonl"));
    this.workerPath = resolve(config.worker_path ?? join(import.meta.dir, "host-worker.ts"));
    this.recorder = new EvidenceRecorder(this.evidencePath, config.campaign_id, config.case_id);
  }

  get worker(): WorkerReady | undefined { return this.active?.ready; }

  async start(): Promise<WorkerReady> {
    if (this.active) throw new Error("TRUST_FAILURE_HOST_ALREADY_LIVE");
    if (this.generation > 0 && !this.lastExit) throw new Error("OLD_HOST_EXIT_NOT_OBSERVED");
    const lockPath = join(this.config.case_dir, "active-host.lock");
    let lock: number;
    try { lock = openSync(lockPath, "wx", 0o600); }
    catch { throw new Error("TRUST_FAILURE_HOST_ALREADY_LIVE"); }
    writeSync(lock, JSON.stringify({ supervisor_pid: process.pid, created_at: new Date().toISOString() })); closeSync(lock);

    const generation = ++this.generation, configPath = join(this.config.case_dir, `worker-config-${generation}.json`);
    const workerConfig: WorkerConfig = {
      campaign_id: this.config.campaign_id, case_id: this.config.case_id, generation,
      case_dir: resolve(this.config.case_dir), session_lifetime_ms: this.config.session_lifetime_ms ?? 300_000,
      policy_validity_ms: this.config.policy_validity_ms ?? 3_600_000,
    };
    writeFileSync(configPath, JSON.stringify(workerConfig), { encoding: "utf8", mode: 0o600, flag: "w" });
    const cleanEnv: Record<string, string> = {};
    for (const name of ["PATH", "SystemRoot", "WINDIR", "TEMP", "TMP", "TMPDIR"]) if (process.env[name]) cleanEnv[name] = process.env[name]!;
    let child: Child;
    try { child = Bun.spawn([process.execPath, this.workerPath, configPath], { stdin: "pipe", stdout: "pipe", stderr: "pipe", env: cleanEnv }); }
    catch (error) { if (existsSync(lockPath)) unlinkSync(lockPath); throw error; }
    const active = {} as ActiveWorker;
    active.child = child; active.reader = child.stdout.getReader(); active.buffer = "";
    active.exitObserved = child.exited.then(async (exitCode) => {
      const event = this.recorder.record("HOST_PROCESS_EXIT_OBSERVED", { generation, pid: child.pid, process_identity: active.ready?.process_identity ?? null, exit_code: exitCode, signal_code: child.signalCode ?? null });
      this.lastExit = event;
      if (this.active === active) this.active = undefined;
      if (existsSync(lockPath)) unlinkSync(lockPath);
      return event;
    });
    this.active = active;
    let hello: WorkerReady;
    try { hello = await this.readMessage(active) as WorkerReady; }
    catch (error) {
      try { child.kill(9); } catch {}
      await active.exitObserved;
      const stderr = await new Response(child.stderr).text();
      throw new Error(`WORKER_START_FAILED: ${stderr.trim() || (error instanceof Error ? error.message : String(error))}`);
    }
    if (hello.kind !== "WORKER_READY" || hello.generation !== generation || hello.pid !== child.pid) {
      child.kill(9); await active.exitObserved; throw new Error("WORKER_IDENTITY_INVALID");
    }
    if (generation > 1) {
      const oldExitMs = Date.parse(String(this.lastExit?.observed_at)), newStartMs = Date.parse(hello.process_started_at);
      if (!Number.isFinite(oldExitMs) || !Number.isFinite(newStartMs) || newStartMs < oldExitMs) { child.kill(9); await active.exitObserved; throw new Error("EXIT_BEFORE_RESTART_NOT_PROVEN"); }
    }
    active.ready = hello;
    this.recorder.record("HOST_PROCESS_STARTED", { generation, pid: hello.pid, process_identity: hello.process_identity, process_started_at: hello.process_started_at, previous_exit_observed_at: this.lastExit?.observed_at ?? null });
    return hello;
  }

  async send(command: WorkerCommand): Promise<WorkerResponse> {
    const active = this.requireActive(), identity = active.ready!;
    this.recorder.record("COMMAND_SENT", { generation: identity.generation, pid: identity.pid, process_identity: identity.process_identity, command_id: command.id, command_kind: command.kind, operation_id: "operation_id" in command ? command.operation_id : null, declared_fault_mode: command.kind === "CONFIGURE_WITNESS_FAULT" ? command.mode : null });
    active.child.stdin.write(`${JSON.stringify(command)}\n`); active.child.stdin.flush();
    const response = await this.readMessage(active) as WorkerResponse;
    if (response.id !== command.id) throw new Error("WORKER_RESPONSE_ID_MISMATCH");
    const result = response.result as any, stateEvidence = command.kind === "INITIALIZE_CASE" || command.kind === "REPORT_STATE" ? { store_paths: result?.store_paths ?? null, store_ids: result?.store_ids ?? null, witness_sequence: result?.witness_sequence ?? null } : {};
    this.recorder.record("COMMAND_RESULT", { generation: identity.generation, pid: identity.pid, process_identity: identity.process_identity, command_id: command.id, command_kind: command.kind, operation_id: "operation_id" in command ? command.operation_id : null, ok: response.ok, error_code: response.error_code ?? null, fault_cut: response.cut ?? null, witness_sequence: result?.witness_sequence ?? null, recovery_result: command.kind === "ADVANCE_LINEAGE" && response.ok ? response.result : null, ...stateEvidence });
    return response;
  }

  async forceKill(): Promise<EvidenceEvent> {
    const active = this.requireActive(), ready = active.ready!;
    this.recorder.record("FORCED_KILL_REQUESTED", { generation: ready.generation, pid: ready.pid, process_identity: ready.process_identity, primitive: process.platform === "win32" ? "TerminateProcess(SIGKILL-equivalent)" : "SIGKILL" });
    active.child.kill(9);
    const exit = await active.exitObserved;
    this.recorder.record("FORCED_KILL_CONFIRMED", { generation: ready.generation, pid: ready.pid, process_identity: ready.process_identity, exit_observed_at: exit.observed_at });
    return exit;
  }

  async gracefulStop(id = `graceful:${Date.now()}`): Promise<EvidenceEvent> {
    const active = this.requireActive(), ready = active.ready!;
    const response = await this.send({ id, kind: "GRACEFUL_STOP" });
    if (!response.ok) throw new Error(response.error_code ?? "GRACEFUL_STOP_FAILED");
    const exit = await active.exitObserved;
    this.recorder.record("GRACEFUL_STOP_CONFIRMED", { generation: ready.generation, pid: ready.pid, process_identity: ready.process_identity, exit_observed_at: exit.observed_at });
    return exit;
  }

  evidence(): readonly EvidenceEvent[] {
    if (!existsSync(this.evidencePath)) return [];
    return readFileSync(this.evidencePath, "utf8").trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as EvidenceEvent);
  }

  private requireActive(): ActiveWorker {
    if (!this.active?.ready) throw new Error("HOST_NOT_RUNNING");
    return this.active;
  }

  private async readMessage(active: ActiveWorker): Promise<unknown> {
    while (true) {
      const newline = active.buffer.indexOf("\n");
      if (newline >= 0) {
        const line = active.buffer.slice(0, newline); active.buffer = active.buffer.slice(newline + 1);
        if (line.trim()) return JSON.parse(line);
      }
      const next = await active.reader.read();
      if (next.done) throw new Error("WORKER_PIPE_CLOSED");
      active.buffer += new TextDecoder().decode(next.value);
    }
  }
}
