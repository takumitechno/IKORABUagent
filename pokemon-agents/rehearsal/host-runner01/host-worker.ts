import { createHash, generateKeyPairSync, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { Database } from "bun:sqlite";
import { canonicalJson } from "../../web/lib/catfood-harness";
import { CATFOOD_POLICY_SHA256 } from "../../web/lib/catfood-trust";
import { collectCurrentRuntimeSubject, observeTestOnlyRoleLaunch, roleChannelAcceptedSnapshotDigest, type TestEnrollmentBinding } from "../../web/lib/catfood-enrollment";
import { CATFOOD_FINAL_CLOSURE_CHARTER, CATFOOD_SEALED_INPUT_SCHEMA, CATFOOD_SQLITE_EXPORT_PROFILE, goRootPolicyRef, type CatfoodGoRootPolicyV1, type CatfoodSealedInputManifestV1 } from "../../web/lib/catfood-final-closure";
import { CatfoodRoleAuthority, buildCustodyReleaseAction, buildEvaluationActionV3, createTestOnlyRoleSession, initializeRoleAuthorityStore, localRoleEvidence, performRoleAction, verifyRoleEvidenceV4, type LocalRoleSession, type RoleChannelBinding, type RoleRunScope } from "../../web/lib/catfood-role-channel";
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

type StoredCase = Readonly<{ key: CanonicalRunKey; binding: RoleChannelBinding; run_binding: RunBinding; window: Readonly<{ start: string; end: string }> }>;
type PersistedOperationAttestation = Readonly<{ status: string; witness_record_json: string }>;
type WitnessAttestation = Readonly<{ record: unknown }>;
type AttackSnapshot = Readonly<{ lineage_sequence: number; current_lineage_sha256: string; admitted_session_id: string; witness_sequence: number; witness_transition: string | null; authority_revision: number }>;
type AttackContext = Readonly<{ kind: "R3A" | "R3C"; before: AttackSnapshot; challenger_authentic?: boolean; challenger_admitted?: boolean; canonical_h1_h2_established?: boolean; root_source_recorded_pre_write?: boolean }>;

export function cutForAttestedState(code: string, operation: PersistedOperationAttestation, material: "PRE_WRITE" | "H1" | "H2", witnessRecord: WitnessAttestation | null): WorkerResponse["cut"] {
  if (operation.status !== "PENDING" || material === "PRE_WRITE") return undefined;
  if (code === "WITNESS_UNAVAILABLE" && !witnessRecord) return "R2A_CUT_REACHED";
  if (code === "WITNESS_RESPONSE_LOST" && witnessRecord && json(witnessRecord.record) === operation.witness_record_json) return "R2B_CUT_REACHED";
  return undefined;
}

function persistedOperationAttestation(controllerPath: string, operationId: string): PersistedOperationAttestation {
  const db = new Database(resolve(controllerPath), { strict: true, create: false });
  try {
    const operation = db.query<PersistedOperationAttestation, [string]>("SELECT status,witness_record_json FROM controller_operations WHERE operation_id=?").get(operationId);
    if (!operation) throw new Error("OPERATION_NOT_FOUND");
    return Object.freeze(operation);
  } finally { db.close(); }
}

function decodeSession(session: LocalRoleSession): Record<string, any> {
  const envelope = JSON.parse(String(localRoleEvidence(session).enrollment_envelope_json)) as { payload: string };
  return JSON.parse(Buffer.from(envelope.payload, "base64url").toString());
}

function scopeFor(stored: StoredCase): RoleRunScope {
  return Object.freeze({ ...stored.key, environment_instance_id: stored.run_binding.environment_instance_id, spec_sha256: stored.run_binding.spec_sha256 });
}

function custodianEnrollmentBinding(stored: StoredCase): TestEnrollmentBinding {
  const binding = stored.binding;
  return Object.freeze({ trust_domain: "TEST_ONLY", issuer: binding.issuer, issuer_key_id: binding.issuer_key_id, audience: binding.audience, origin: binding.origin, credential: binding.credential, public_key_pem: binding.authority_public_key_pem, environment_identity: stored.run_binding.environment_instance_id, deployment_id: stored.key.deployment_id, enrollment_namespace: binding.enrollment_namespace, build_policy_sha256: binding.build_policy_sha256, accepted_snapshot_id: binding.accepted_snapshot_id, accepted_snapshot_sha256: binding.accepted_snapshot_sha256, launch_ticket: "launch:custodian", writer_signing_key_id: "none", writer_signing_key_version: "none", writer_signing_public_key_pem: binding.authority_public_key_pem });
}

function launchNonAdmittedCustodian(stored: StoredCase, authorityPath: string, authorityKeyPath: string): LocalRoleSession {
  const authority = new CatfoodRoleAuthority(authorityPath, stored.binding, readFileSync(authorityKeyPath, "utf8"));
  try {
    const enrollment = custodianEnrollmentBinding(stored), subject = collectCurrentRuntimeSubject(enrollment), launch = observeTestOnlyRoleLaunch(enrollment, "custodian", subject);
    return createTestOnlyRoleSession(authority, { role: "custodian", scope: scopeFor(stored), subject, launch });
  } finally { authority.close(); }
}

function attackSnapshot(host: TestOnlyPreCustodyHost, stored: StoredCase, witness: TestOnlySqliteContinuityWitness, authorityPath: string): AttackSnapshot {
  const state = host.safety(stored.key, { kind: "STATUS_READ" }) as Record<string, any>, current = witness.current(canonicalKeySha256(stored.key));
  const db = new Database(resolve(authorityPath), { readonly: true, strict: true });
  try {
    const continuity = db.query<{ revision: number }, []>("SELECT revision FROM role_authority_continuity WHERE singleton=1").get();
    if (!continuity || !state.admitted?.session_id) throw new Error("R3_ATTACK_STATE_INVALID");
    return Object.freeze({ lineage_sequence: Number(state.lineage_sequence), current_lineage_sha256: String(state.current_lineage_sha256), admitted_session_id: String(state.admitted.session_id), witness_sequence: current?.record.sequence ?? 0, witness_transition: current?.record.transition ?? null, authority_revision: continuity.revision });
  } finally { db.close(); }
}

function canonicalH1H2Established(controllerPath: string, keySha256: string): boolean {
  const db = new Database(resolve(controllerPath), { readonly: true, strict: true });
  try {
    const row = db.query<{ n: number; first_sequence: number; last_sequence: number }, [string]>("SELECT COUNT(*) n,MIN(lineage_sequence) first_sequence,MAX(lineage_sequence) last_sequence FROM lineage_advances WHERE key_sha256=?").get(keySha256);
    return row?.n === 2 && row.first_sequence === 1 && row.last_sequence === 2;
  } finally { db.close(); }
}

function attackEvidence(command: Extract<WorkerCommand, { kind: "ATTEMPT_NON_ADMITTED_ADVANCE" | "ATTEMPT_FRESH_STORE_ROOT_RESTORE" }>, context: AttackContext, host: TestOnlyPreCustodyHost, stored: StoredCase, witness: TestOnlySqliteContinuityWitness, controllerPath: string, authorityPath: string): Readonly<Record<string, unknown>> {
  const after = attackSnapshot(host, stored, witness, authorityPath), state = host.safety(stored.key, { kind: "STATUS_READ" }) as Record<string, any>;
  const controllerDb = new Database(resolve(controllerPath), { readonly: true, strict: true }), authorityDb = new Database(resolve(authorityPath), { readonly: true, strict: true });
  try {
    const incident = controllerDb.query<{ kind: string }, [string]>("SELECT kind FROM custody_incidents WHERE key_sha256=? ORDER BY rowid DESC LIMIT 1").get(canonicalKeySha256(stored.key));
    const controllerCounts = controllerDb.query<{ jobs: number; targets: number }, [string, string]>("SELECT (SELECT COUNT(*) FROM authorized_jobs WHERE key_sha256=?) jobs,(SELECT COUNT(*) FROM authorized_targets WHERE key_sha256=?) targets").get(canonicalKeySha256(stored.key), canonicalKeySha256(stored.key))!;
    const authorityCounts = authorityDb.query<{ jobs: number; targets: number }, []>("SELECT (SELECT COUNT(*) FROM evaluation_jobs) jobs,(SELECT COUNT(*) FROM expected_evaluation_targets) targets").get()!;
    const common = { controller_state: state.state, incident_kind: incident?.kind ?? null, lineage_sequence_before: context.before.lineage_sequence, lineage_sequence_after: after.lineage_sequence, canonical_lineage_unchanged: after.current_lineage_sha256 === context.before.current_lineage_sha256, admitted_custodian_unchanged: after.admitted_session_id === context.before.admitted_session_id, witness_sequence_before: context.before.witness_sequence, witness_sequence_after: after.witness_sequence, witness_incident_appended: after.witness_sequence === context.before.witness_sequence + 1 && after.witness_transition === "INCIDENT", authority_revision_before: context.before.authority_revision, authority_revision_after: after.authority_revision, authority_revision_unchanged: after.authority_revision === context.before.authority_revision, authorized_job_count: controllerCounts.jobs, authorized_target_count: controllerCounts.targets, authority_job_count: authorityCounts.jobs, authority_target_count: authorityCounts.targets, positive_follow_on: controllerCounts.jobs > 0 || controllerCounts.targets > 0 || authorityCounts.jobs > 0 || authorityCounts.targets > 0 };
    if (command.kind === "ATTEMPT_NON_ADMITTED_ADVANCE") return Object.freeze({ attack_seam: "R3A_AUTHENTIC_NON_ADMITTED_CUSTODIAN", second_custodian_authentic: context.challenger_authentic === true, second_custodian_admitted: context.challenger_admitted === true, second_custodian_lineage_current: !common.canonical_lineage_unchanged, ...common });
    return Object.freeze({ attack_seam: "R3C_FRESH_STORE_ROOT_RESTORE", root_source_recorded_pre_write: context.root_source_recorded_pre_write === true, canonical_h1_h2_established: context.canonical_h1_h2_established === true, canonical_current_material: after.lineage_sequence === 2 && common.canonical_lineage_unchanged ? "H2" : "UNKNOWN", restored_root_authoritative: !common.canonical_lineage_unchanged, ...common });
  } finally { controllerDb.close(); authorityDb.close(); }
}

function positiveManifest(stored: StoredCase, material: ReturnType<PersistentLineageAdapter["read"]>): CatfoodSealedInputManifestV1 {
  const policy = stored.binding.policy.go_root_policy_documents[0] as CatfoodGoRootPolicyV1, profile = policy.verification_profile, current = material.current;
  const snapshot = (raw_sha256: string) => ({ format: CATFOOD_SQLITE_EXPORT_PROFILE, byte_length: 4096, raw_sha256, logical_schema_sha256: sha("rehearsal:sqlite-schema") } as const);
  const body = {
    schema: CATFOOD_SEALED_INPUT_SCHEMA, charter: CATFOOD_FINAL_CLOSURE_CHARTER,
    scope: { ...stored.key, environment_instance_id: stored.run_binding.environment_instance_id, spec_sha256: stored.run_binding.spec_sha256 }, window: stored.window,
    closure: { closed_source_event_id: "event:rehearsal:closed-source", run_closed_event_id: "event:rehearsal:run-closed", lifecycle: "CLOSED" as const },
    journal: { high_water: material.sequence, head_sha256: current.journal_head_sha256 }, checkpoint: { checkpoint_id: "checkpoint:rehearsal:final", checkpoint_sha256: current.checkpoint_head_sha256, pins_sha256: sha("rehearsal:pins") },
    retained_source: { archive_sha256: sha("rehearsal:archive"), source_digest: sha("rehearsal:source"), producer_identity: "rehearsal:producer" },
    go: { artifact_sha256: stored.run_binding.go_artifact_sha256, verification_profile_id: profile.profile_id, verification_profile_sha256: sha(json(profile)), root_fingerprints: profile.keys.map((key) => key.public_key_sha256).sort() },
    fixed: { dependencies_sha256: sha("rehearsal:dependencies"), policy_sha256: CATFOOD_POLICY_SHA256, kernel_sha256: sha("rehearsal:kernel") }, trust: { environment_provenance_sha256: sha("rehearsal:environment"), clock_provenance_sha256: sha("rehearsal:clock"), acquisition_provenance_sha256: sha("rehearsal:acquisition"), test_only: true },
    expected_bundle_sha256: sha("rehearsal:expected-bundle"), pair_common_cut_sha256: current.pair_common_cut_sha256, control: snapshot(current.control_snapshot_sha256), checkpoint_store: snapshot(current.checkpoint_snapshot_sha256),
  };
  return Object.freeze({ ...body, manifest_id: `manifest:${sha(json(body)).slice(0, 40)}` });
}

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
  const now = Date.now(), window = Object.freeze({ start: new Date(now).toISOString(), end: new Date(now + config.policy_validity_ms).toISOString() }), go = testGoRootPolicy({
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
  const runBinding: RunBinding = Object.freeze({ key, environment_instance_id: scope.environment_instance_id, spec_sha256: scope.spec_sha256, window_sha256: sha(json(window)), go_artifact_sha256: sha(`go-artifact:${suffix}`), go_policy_ref_sha256: sha(json(go.ref)), control_store_id: controlStore, checkpoint_store_id: checkpointStore, ...root, producer_generation: 1, test_only: true });

  writeFileSync(p.authorityKey, authorityPair.privateKey.export({ type: "pkcs8", format: "pem" }).toString(), { encoding: "utf8", mode: 0o600, flag: "wx" });
  for (const dbPath of [p.authority, p.controller, p.witness]) writeFileSync(dbPath, "", { flag: "wx", mode: 0o600 });
  initializeRoleAuthorityStore(p.authority, binding);
  initializeCustodyController(p.controller, `controller:${suffix}`, binding);
  initializeTestOnlyContinuityWitness(p.witness);
  const stored: StoredCase = Object.freeze({ key, binding, run_binding: runBinding, window });
  writeFileSync(p.binding, JSON.stringify(stored), { encoding: "utf8", mode: 0o600, flag: "wx" });
  return stored;
}

function publicState(config: WorkerConfig, stored: StoredCase, adapter: PersistentLineageAdapter): PublicCaseState {
  const p = paths(config.case_dir), material = adapter.read();
  return Object.freeze({ key: stored.key, store_paths: { controller: p.controller, witness: p.witness, authority: p.authority, lineage: p.lineage }, store_ids: { control: material.control_store_id, checkpoint: material.checkpoint_store_id, adapter: material.adapter_id }, window: stored.window, window_sha256: stored.run_binding.window_sha256, network_required: false });
}

async function main(): Promise<void> {
  const config = loadConfig(), p = paths(config.case_dir), stored = initializeCase(config), adapter = new PersistentLineageAdapter(p.lineage);
  const witness = new TestOnlySqliteContinuityWitness(p.witness), controller = new CustodyController(p.controller, witness, stored.binding);
  const fenceAdapter = { inspect({ admitted }: { admitted: { session_id: string } }): FenceObservation { const state = adapter.read(); return { old_session_id: admitted.session_id, old_process_cannot_execute: false, old_credentials_revoked: false, producer_effects_resolved: false, complete_history_verified: false, journal_head_sha256: state.current.journal_head_sha256, checkpoint_head_sha256: state.current.checkpoint_head_sha256, control_snapshot_sha256: state.current.control_snapshot_sha256, checkpoint_snapshot_sha256: state.current.checkpoint_snapshot_sha256, pair_common_cut_sha256: state.current.pair_common_cut_sha256 }; } };
  const host = new TestOnlyPreCustodyHost({ authority_path: p.authority, authority_binding: stored.binding, authority_private_key: readFileSync(p.authorityKey, "utf8"), controller, fence_adapter: fenceAdapter, lineage_adapter: adapter });
  let custodianSession: LocalRoleSession | undefined, graceful = false, replacementTiming: { observed_now_ms: number } | undefined, fixedAdmissionExpiry: number | undefined, attackContext: AttackContext | undefined;

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
      case "ADMIT_FIXED_EXPIRY": {
        fixedAdmissionExpiry = command.lease_expires_ms;
        const launched = host.admitCustodian({ key: stored.key, operation_id: command.operation_id, lease_expires_ms: command.lease_expires_ms, host_incarnation: `host:${config.generation}:fixed-expiry` });
        custodianSession = launched.session;
        return { ...(host.safety(stored.key, { kind: "STATUS_READ" }) as Record<string, unknown>), submitted_lease_expires_ms: command.lease_expires_ms };
      }
      case "MUTATE_TEST_MATERIAL": return adapter.mutate(command.material);
      case "CONFIGURE_WITNESS_FAULT": witness.setFailureForTest(command.mode); return { mode: command.mode };
      case "ADVANCE_LINEAGE": return host.advanceLineage({ key: stored.key, operation_id: command.operation_id, custodian_session: custodianSession });
      case "ATTEMPT_NON_ADMITTED_ADVANCE": {
        attackContext = undefined;
        if (!custodianSession) throw new CustodyControlError("CUSTODIAN_SESSION_REQUIRED");
        const state = host.safety(stored.key, { kind: "STATUS_READ" }) as Record<string, any>, material = adapter.read();
        if (state.state !== "ACTIVE" || state.lineage_sequence !== 0 || material.material !== "PRE_WRITE" || material.sequence !== 0) throw new Error("R3A_PREREQUISITE_INVALID");
        adapter.mutate("H1");
        const challenger = launchNonAdmittedCustodian(stored, p.authority, p.authorityKey), authenticated = verifyRoleEvidenceV4(localRoleEvidence(challenger), stored.binding, "custodian", scopeFor(stored));
        const before = attackSnapshot(host, stored, witness, p.authority);
        attackContext = Object.freeze({ kind: "R3A", before, challenger_authentic: true, challenger_admitted: String(authenticated.session_id) === before.admitted_session_id });
        return host.advanceLineage({ key: stored.key, operation_id: command.operation_id, custodian_session: challenger });
      }
      case "ATTEMPT_FRESH_STORE_ROOT_RESTORE": {
        attackContext = undefined;
        if (!custodianSession) throw new CustodyControlError("CUSTODIAN_SESSION_REQUIRED");
        const state = host.safety(stored.key, { kind: "STATUS_READ" }) as Record<string, any>, material = adapter.read(), keySha256 = canonicalKeySha256(stored.key);
        const progression = canonicalH1H2Established(p.controller, keySha256), rootRecorded = json(material.pre_write_root) === json(state.lineage_root);
        if (state.state !== "ACTIVE" || state.lineage_sequence !== 2 || material.material !== "H2" || material.sequence !== 2 || sha(json(material.current)) !== state.current_lineage_sha256 || !progression || !rootRecorded) throw new Error("R3C_PREREQUISITE_INVALID");
        const before = attackSnapshot(host, stored, witness, p.authority);
        adapter.restoreRecordedRootForTest();
        attackContext = Object.freeze({ kind: "R3C", before, canonical_h1_h2_established: progression, root_source_recorded_pre_write: rootRecorded });
        return host.advanceLineage({ key: stored.key, operation_id: command.operation_id, custodian_session: custodianSession });
      }
      case "CLOSE": return host.closeCustody({ key: stored.key, operation_id: command.operation_id, manifest: command.manifest as never, release_receipt: command.release_receipt as never });
      case "ISSUE_JOB": return host.issueEvaluationJob({ key: stored.key, ...command });
      case "ASSIGN_TARGET": return host.assignExpectedTarget({ key: stored.key, ...command });
      case "CHECK_ELIGIBILITY": return host.publicationEligibility(stored.key, command.target_envelope);
      case "RECONCILE_JOB": return host.reconcileEvaluationJob(stored.key, command.operation_id);
      case "RECONCILE_TARGET": return host.reconcileExpectedTarget(stored.key, command.operation_id);
      case "STATUS_READ": return host.safety(stored.key, { kind: "STATUS_READ" });
      case "RECONCILE_READ": {
        const operation = host.safety(stored.key, { kind: "RECONCILE_READ", operation_id: command.operation_id }) as { kind: string; status: string; result: unknown }, witnessRecord = witness.readOperation(command.operation_id);
        return { ...operation, operation_status: operation.status, material: adapter.read().material, witness_record_present: witnessRecord !== null, witness_sequence: witnessRecord?.record.sequence ?? null };
      }
      case "REQUEST_REPLACEMENT": {
        const observed_now_ms = Date.now(); replacementTiming = { observed_now_ms };
        const next = host.observeLeaseAndReplace({ key: stored.key, observed_now_ms, operation_id: command.operation_id, lease_expires_ms: Date.now() + command.lease_lifetime_ms, host_incarnation: `host:${config.generation}:replacement` });
        custodianSession = next.session;
        return { ...(host.safety(stored.key, { kind: "STATUS_READ" }) as Record<string, unknown>), observed_now_ms };
      }
      case "ESTABLISH_POSITIVE_BASELINE": {
        if (!custodianSession) throw new CustodyControlError("CUSTODIAN_SESSION_REQUIRED");
        const operation = `baseline:${sha(command.operation_id).slice(0, 24)}`, material = adapter.read().material === "PRE_WRITE" ? adapter.mutate("H1") : adapter.read();
        host.advanceLineage({ key: stored.key, operation_id: `${operation}:lineage`, custodian_session: custodianSession });
        const evaluator = host.launchRole(stored.key, "evaluator"), writer = host.launchRole(stored.key, "writer"), verifier = host.launchRole(stored.key, "verifier"), manifest = positiveManifest(stored, material), workflow = `${operation}:workflow`, roleEvidenceSha = sha(json([localRoleEvidence(custodianSession), evaluator.evidence, writer.evidence]));
        const release = performRoleAction(custodianSession, { action: "custodian.evaluation.release", purpose_class: "HISTORICAL_EVIDENCE", request_id: `${operation}:release`, logical_target: stored.key.run_id, body: (actionId) => buildCustodyReleaseAction({ action_id: actionId, manifest, go_root_policy_ref: goRootPolicyRef(stored.binding.policy.go_root_policy_documents[0] as CatfoodGoRootPolicyV1), evaluator_session_id: String(decodeSession(evaluator.session).session_id), writer_session_id: String(decodeSession(writer.session).session_id), role_evidence_sha256: roleEvidenceSha, workflow_instruction_id: workflow }) });
        const closed = host.closeCustody({ key: stored.key, operation_id: `${operation}:close`, manifest, release_receipt: release }), job = host.issueEvaluationJob({ key: stored.key, operation_id: `${operation}:job`, evaluator_evidence: evaluator.evidence, writer_evidence: writer.evidence, role_evidence_sha256: roleEvidenceSha, workflow_instruction_id: workflow, workflow_instruction_sha256: sha(workflow), commit_lifetime_ms: command.commit_lifetime_ms });
        const evaluatorEnrollment = decodeSession(evaluator.session), evaluatorIdentity = { session_id: String(evaluatorEnrollment.session_id), build_sha256: String((evaluatorEnrollment.accepted_role_descriptor as Record<string, unknown>).artifact_root) }, decision = { evaluator: evaluatorIdentity, verdict: "PASS" as const, reason_codes: [] as string[] };
        const committed = performRoleAction(evaluator.session, { action: "evaluator.result.commit", purpose_class: "INDEPENDENT_EVALUATION", request_id: job.descriptor.stable_evaluator_request_id, logical_target: job.descriptor.evaluation_job_id, body: () => buildEvaluationActionV3({ job, decision_core: decision, evaluator: evaluatorIdentity, source_digest: manifest.retained_source.source_digest }) }), target_envelope = host.assignExpectedTarget({ key: stored.key, operation_id: `${operation}:target`, verifier_evidence: verifier.evidence, evaluation_job_id: job.descriptor.evaluation_job_id }), eligibility = host.publicationEligibility(stored.key, target_envelope);
        return { window: stored.window, run_binding_window_sha256: stored.run_binding.window_sha256, manifest_window_sha256: sha(json(manifest.window)), release_receipt_sha256: release.receipt_sha256, close: closed, evaluation_job_id: job.descriptor.evaluation_job_id, evaluator_commit_receipt_sha256: committed.receipt_sha256, target_envelope, eligibility };
      }
      case "REPORT_STATE": {
        const state = host.safety(stored.key, { kind: "STATUS_READ" }), current = witness.current(canonicalKeySha256(stored.key));
        return { ...publicState(config, stored, adapter), host_state: state, material: adapter.read(), witness_record_present: current !== null, witness_sequence: current?.record.sequence ?? 0, witness_digest: current?.record.record_digest ?? null };
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
          const operation = host.safety(stored.key, { kind: "RECONCILE_READ", operation_id: command.operation_id }), persistedOperation = persistedOperationAttestation(p.controller, command.operation_id), witnessRecord = witness.readOperation(command.operation_id), material = adapter.read().material;
          cut = cutForAttestedState(code, persistedOperation, material, witnessRecord);
          result = { operation, operation_status: persistedOperation.status, material, witness_record_present: witnessRecord !== null, witness_sequence: witnessRecord?.record.sequence ?? null };
        }
        if (command?.kind === "REQUEST_REPLACEMENT" && replacementTiming) result = replacementTiming;
        if (command?.kind === "ADMIT_FIXED_EXPIRY" && fixedAdmissionExpiry !== undefined) result = { submitted_lease_expires_ms: fixedAdmissionExpiry };
        if ((command?.kind === "ATTEMPT_NON_ADMITTED_ADVANCE" || command?.kind === "ATTEMPT_FRESH_STORE_ROOT_RESTORE") && attackContext) result = attackEvidence(command, attackContext, host, stored, witness, p.controller, p.authority);
        const response: WorkerResponse = { id: command?.id ?? responseId, ok: false, error_code: code, cut, result };
        process.stdout.write(`${JSON.stringify(response)}\n`);
      }
      if (graceful) return;
    }
  }
}

if (import.meta.main) await main();
