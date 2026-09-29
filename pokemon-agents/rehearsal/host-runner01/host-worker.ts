import { createHash, generateKeyPairSync, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { canonicalJson } from "../../web/lib/catfood-harness";
import { CATFOOD_POLICY_SHA256 } from "../../web/lib/catfood-trust";
import { roleChannelAcceptedSnapshotDigest } from "../../web/lib/catfood-enrollment";
import { initializeRoleAuthorityStore, type LocalRoleSession, type RoleChannelBinding, type RoleRunScope } from "../../web/lib/catfood-role-channel";
import { testGoRootPolicy } from "../../tests/catfood-go-root-policy-fixture";
import {
  CustodyController, CustodyControlError, TestOnlyPreCustodyHost, TestOnlySqliteContinuityWitness,
  canonicalKeySha256, initializeCustodyController, initializeTestOnlyContinuityWitness,
  type CanonicalRunKey, type FenceObservation, type RunBinding,
} from "../../pre-rehearsal/custody-control01/controller";
import { initializePersistentLineage, PersistentLineageAdapter } from "./persistent-lineage-adapter";
import { parseWorkerCommand, type PublicCaseState, type WorkerCommand, type WorkerConfig, type WorkerReady, type WorkerResponse } from "./protocol";

const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const json = (value: unknown) => canonicalJson(value as never);
const startedAt = new Date(Date.now() - Math.floor(process.uptime() * 1000)).toISOString();

type StoredCase = Readonly<{ key: CanonicalRunKey; binding: RoleChannelBinding; run_binding: RunBinding }>;

function loadConfig(): WorkerConfig {
  if (process.argv.length !== 3) throw new Error("WORKER_CONFIG_REQUIRED");
  const value = JSON.parse(readFileSync(resolve(process.argv[2]!), "utf8")) as WorkerConfig;
  if (!value || value.generation < 1 || value.session_lifetime_ms < 1 || value.policy_validity_ms < value.session_lifetime_ms) throw new Error("WORKER_CONFIG_INVALID");
  return Object.freeze(value);
}

function paths(caseDir: string) {
  return Object.freeze({
    authority: join(caseDir, "authority.db"), controller: join(caseDir, "controller.db"),
    witness: join(caseDir, "witness.db"), lineage: join(caseDir, "lineage.json"),
    binding: join(caseDir, "case.json"), authorityKey: join(caseDir, "authority-key.pem"),
    graceful: join(caseDir, "graceful-stop.observed"),
  });
}

function initializeCase(config: WorkerConfig): StoredCase {
  mkdirSync(config.case_dir, { recursive: true });
  const p = paths(config.case_dir);
  if (existsSync(p.binding)) return Object.freeze(JSON.parse(readFileSync(p.binding, "utf8")) as StoredCase);
  if ([p.authority, p.controller, p.witness, p.lineage, p.authorityKey].some(existsSync)) throw new Error("CASE_PARTIALLY_INITIALIZED");

  const suffix = sha(`${config.campaign_id}\n${config.case_id}`).slice(0, 16);
  const key: CanonicalRunKey = Object.freeze({ environment_type: "test", deployment_id: `deployment:${suffix}`, organization_id: `org:${suffix}`, tenant_id: `tenant:${suffix}`, account_id: `acct:${suffix}`, run_id: `run:${suffix}` });
  const scope: RoleRunScope = Object.freeze({ ...key, environment_instance_id: `instance:${suffix}`, spec_sha256: sha(`spec:${suffix}`) });
  const authorityPair = generateKeyPairSync("ed25519"), goPair = generateKeyPairSync("ed25519");
  const authorityPublic = authorityPair.publicKey.export({ type: "spki", format: "pem" }).toString(), goPublic = goPair.publicKey.export({ type: "spki", format: "pem" }).toString();
  const now = Date.now(), go = testGoRootPolicy({
    authority_identity: `fixture-role-authority:${suffix}`, authority_public_key_pem: authorityPublic,
    enrollment_namespace: `fixture:rehearsal:${suffix}`, scope,
    public_keys: [{ key_id: `go:${suffix}`, public_key_pem: goPublic }],
    not_before: new Date(now - 60_000).toISOString(), not_after: new Date(now + config.policy_validity_ms).toISOString(),
    acceptance_policy_sha256: CATFOOD_POLICY_SHA256,
  });
  const binding: RoleChannelBinding = Object.freeze({
    trust_domain: "TEST_ONLY", issuer: `fixture-role-authority:${suffix}`, issuer_key_id: "authority:v4",
    audience: "ikorabu-rehearsal-test-only", origin: "http://127.0.0.1:32199", credential: `fixture-local-only-credential-${suffix}`,
    authority_public_key_pem: authorityPublic, enrollment_namespace: `fixture:rehearsal:${suffix}`,
    build_policy_sha256: CATFOOD_POLICY_SHA256, accepted_snapshot_id: `snapshot:${suffix}`,
    accepted_snapshot_sha256: roleChannelAcceptedSnapshotDigest(),
    policy: { policy_id: `fixture-policy:${suffix}`, session_lifetime_ms: config.session_lifetime_ms, registration_challenge_lifetime_ms: 5_000, action_challenge_lifetime_ms: 5_000, maximum_outstanding_requests: 64, receipt_retention_ms: 86_400_000, go_root_policy_documents: [go.policy], go_root_workload_selections: [go.selection] },
  });
  const controlStore = `control:${suffix}`, checkpointStore = `checkpoint:${suffix}`;
  initializePersistentLineage(p.lineage, { adapter_id: `adapter:${suffix}`, key, control_store_id: controlStore, checkpoint_store_id: checkpointStore, store_pair: suffix });
  const root = new PersistentLineageAdapter(p.lineage).read().pre_write_root;
  const runBinding: RunBinding = Object.freeze({ key, environment_instance_id: scope.environment_instance_id, spec_sha256: scope.spec_sha256, window_sha256: sha(json({ start_offset_ms: 0, duration_ms: config.policy_validity_ms })), go_artifact_sha256: sha(`go-artifact:${suffix}`), go_policy_ref_sha256: sha(json(go.ref)), control_store_id: controlStore, checkpoint_store_id: checkpointStore, ...root, producer_generation: 1, test_only: true });

  writeFileSync(p.authorityKey, authorityPair.privateKey.export({ type: "pkcs8", format: "pem" }).toString(), { encoding: "utf8", mode: 0o600, flag: "wx" });
  for (const dbPath of [p.authority, p.controller, p.witness]) writeFileSync(dbPath, "", { flag: "wx", mode: 0o600 });
  initializeRoleAuthorityStore(p.authority, binding);
  initializeCustodyController(p.controller, `controller:${suffix}`, binding);
  initializeTestOnlyContinuityWitness(p.witness);
  const stored: StoredCase = Object.freeze({ key, binding, run_binding: runBinding });
  writeFileSync(p.binding, JSON.stringify(stored), { encoding: "utf8", mode: 0o600, flag: "wx" });
  return stored;
}

function publicState(config: WorkerConfig, stored: StoredCase, adapter: PersistentLineageAdapter): PublicCaseState {
  const p = paths(config.case_dir), material = adapter.read();
  return Object.freeze({ key: stored.key, store_paths: { controller: p.controller, witness: p.witness, authority: p.authority, lineage: p.lineage }, store_ids: { control: material.control_store_id, checkpoint: material.checkpoint_store_id, adapter: material.adapter_id }, network_required: false });
}

async function main(): Promise<void> {
  const config = loadConfig(), p = paths(config.case_dir), stored = initializeCase(config), adapter = new PersistentLineageAdapter(p.lineage);
  const witness = new TestOnlySqliteContinuityWitness(p.witness), controller = new CustodyController(p.controller, witness, stored.binding);
  const fenceAdapter = { inspect({ admitted }: { admitted: { session_id: string } }): FenceObservation { const state = adapter.read(); return { old_session_id: admitted.session_id, old_process_cannot_execute: false, old_credentials_revoked: false, producer_effects_resolved: false, complete_history_verified: false, journal_head_sha256: state.current.journal_head_sha256, checkpoint_head_sha256: state.current.checkpoint_head_sha256, control_snapshot_sha256: state.current.control_snapshot_sha256, checkpoint_snapshot_sha256: state.current.checkpoint_snapshot_sha256, pair_common_cut_sha256: state.current.pair_common_cut_sha256 }; } };
  const host = new TestOnlyPreCustodyHost({ authority_path: p.authority, authority_binding: stored.binding, authority_private_key: readFileSync(p.authorityKey, "utf8"), controller, fence_adapter: fenceAdapter, lineage_adapter: adapter });
  let custodianSession: LocalRoleSession | undefined, graceful = false;

  const ready: WorkerReady = Object.freeze({ kind: "WORKER_READY", campaign_id: config.campaign_id, case_id: config.case_id, generation: config.generation, pid: process.pid, process_started_at: startedAt, process_identity: `${process.pid}:${startedAt}:${randomBytes(8).toString("hex")}` });
  process.stdout.write(`${JSON.stringify(ready)}\n`);

  const dispatch = (command: WorkerCommand): unknown => {
    switch (command.kind) {
      case "INITIALIZE_CASE": return publicState(config, stored, adapter);
      case "RESERVE": return host.reserveRun(stored.run_binding, command.operation_id);
      case "ADMIT": {
        const launched = host.admitCustodian({ key: stored.key, operation_id: command.operation_id, lease_expires_ms: Date.now() + command.lease_lifetime_ms, host_incarnation: `host:${config.generation}` });
        custodianSession = launched.session;
        return host.safety(stored.key, { kind: "STATUS_READ" });
      }
      case "MUTATE_TEST_MATERIAL": return adapter.mutate(command.material);
      case "CONFIGURE_WITNESS_FAULT": witness.setFailureForTest(command.mode); return { mode: command.mode };
      case "ADVANCE_LINEAGE": return host.advanceLineage({ key: stored.key, operation_id: command.operation_id, custodian_session: custodianSession });
      case "CLOSE": return host.closeCustody({ key: stored.key, operation_id: command.operation_id, manifest: command.manifest as never, release_receipt: command.release_receipt as never });
      case "ISSUE_JOB": return host.issueEvaluationJob({ key: stored.key, ...command });
      case "ASSIGN_TARGET": return host.assignExpectedTarget({ key: stored.key, ...command });
      case "CHECK_ELIGIBILITY": return host.publicationEligibility(stored.key, command.target_envelope);
      case "RECONCILE_JOB": return host.reconcileEvaluationJob(stored.key, command.operation_id);
      case "RECONCILE_TARGET": return host.reconcileExpectedTarget(stored.key, command.operation_id);
      case "STATUS_READ": return host.safety(stored.key, { kind: "STATUS_READ" });
      case "RECONCILE_READ": return host.safety(stored.key, { kind: "RECONCILE_READ", operation_id: command.operation_id });
      case "REQUEST_REPLACEMENT": {
        const state = host.safety(stored.key, { kind: "STATUS_READ" }) as { lease_expires_ms?: number };
        const next = host.observeLeaseAndReplace({ key: stored.key, observed_now_ms: Number(state.lease_expires_ms) + command.observed_after_lease_ms, operation_id: command.operation_id, lease_expires_ms: Date.now() + command.lease_lifetime_ms, host_incarnation: `host:${config.generation}:replacement` });
        custodianSession = next.session;
        return host.safety(stored.key, { kind: "STATUS_READ" });
      }
      case "REPORT_STATE": {
        const state = host.safety(stored.key, { kind: "STATUS_READ" }), current = witness.current(canonicalKeySha256(stored.key));
        return { ...publicState(config, stored, adapter), host_state: state, material: adapter.read(), witness_sequence: current?.record.sequence ?? 0, witness_digest: current?.record.record_digest ?? null };
      }
      case "GRACEFUL_STOP": host.close(); writeFileSync(p.graceful, new Date().toISOString(), { flag: "w" }); graceful = true; return { stop: "GRACEFUL_STOP" };
    }
  };

  let buffer = "";
  for await (const chunk of Bun.stdin.stream()) {
    buffer += new TextDecoder().decode(chunk);
    while (buffer.includes("\n")) {
      const at = buffer.indexOf("\n"), line = buffer.slice(0, at); buffer = buffer.slice(at + 1);
      if (!line.trim()) continue;
      let command: WorkerCommand | undefined;
      let responseId = "invalid";
      try {
        const raw = JSON.parse(line) as { id?: unknown };
        if (typeof raw?.id === "string" && /^[A-Za-z0-9][A-Za-z0-9:._/-]{0,255}$/.test(raw.id)) responseId = raw.id;
        command = parseWorkerCommand(raw);
        const result = dispatch(command), response: WorkerResponse = { id: command.id, ok: true, result };
        process.stdout.write(`${JSON.stringify(response)}\n`);
      } catch (error) {
        const code = error instanceof CustodyControlError ? error.code : error instanceof Error ? error.message : "WORKER_COMMAND_FAILED";
        let cut: WorkerResponse["cut"], result: unknown;
        if (command?.kind === "ADVANCE_LINEAGE" && (code === "WITNESS_UNAVAILABLE" || code === "WITNESS_RESPONSE_LOST")) {
          const operation = host.safety(stored.key, { kind: "RECONCILE_READ", operation_id: command.operation_id }), witnessRecord = witness.readOperation(command.operation_id);
          if (code === "WITNESS_UNAVAILABLE" && !witnessRecord) cut = "R2A_CUT_REACHED";
          if (code === "WITNESS_RESPONSE_LOST" && witnessRecord) cut = "R2B_CUT_REACHED";
          result = { operation, witness_sequence: witnessRecord?.record.sequence ?? null, material: adapter.read().material };
        }
        const response: WorkerResponse = { id: command?.id ?? responseId, ok: false, error_code: code, cut, result };
        process.stdout.write(`${JSON.stringify(response)}\n`);
      }
      if (graceful) return;
    }
  }
}

await main();
