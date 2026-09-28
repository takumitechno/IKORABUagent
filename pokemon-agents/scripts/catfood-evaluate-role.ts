#!/usr/bin/env bun
import { createInterface } from "node:readline";
import { generateKeyPairSync } from "node:crypto";
import { canonicalJson } from "../web/lib/catfood-harness";
import { collectCurrentRuntimeSubject, observeTestOnlyRoleLaunch, roleChannelArtifactDescriptor } from "../web/lib/catfood-enrollment";
import { createAuthenticatedAssessmentPackage, createAuthenticatedAssessmentPackageV3 } from "../web/lib/catfood-independent-attestation";
import { registerLocalRoleSessionForTest, type AuthorityEvaluationJob, type RoleChannelBinding } from "../web/lib/catfood-role-channel";
import { stageVerifiedEvaluationMaterial, type CatfoodSealedInputManifestV1 } from "../web/lib/catfood-final-closure";
import { CatfoodTrustError, IndependentCatfoodEvaluator } from "../web/lib/catfood-trust";
import { synchronousThreadsHttpTransport } from "../web/lib/catfood-threads-http";

export function evaluateAssignedCatfoodJob(input: Parameters<typeof createAuthenticatedAssessmentPackageV3>[0]) { return createAuthenticatedAssessmentPackageV3(input); }

async function fixtureMain(): Promise<void> {
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })[Symbol.asyncIterator]();
  const first = await input.next(); if (first.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED");
  const start = JSON.parse(first.value) as { binding: RoleChannelBinding; run_id: string; now_ms: number }, now = { value: start.now_ms };
  const keys = generateKeyPairSync("ed25519"), binding = start.binding, subject = collectCurrentRuntimeSubject({ ...binding, deployment_id: "deployment:test", environment_identity: "instance:test" });
  const launch = observeTestOnlyRoleLaunch({ ...binding, public_key_pem: binding.authority_public_key_pem, environment_identity: "instance:test", deployment_id: "deployment:test", launch_ticket: "test:evaluator", writer_signing_key_id: "none", writer_signing_key_version: "none", writer_signing_public_key_pem: binding.authority_public_key_pem }, "evaluator", subject);
  process.stdout.write(canonicalJson({ type: "hello", role: "evaluator", subject, launch, descriptor: roleChannelArtifactDescriptor("evaluator"), public_key_pem: keys.publicKey.export({ type: "spki", format: "pem" }).toString() }) + "\n");
  const assigned = await input.next(); if (assigned.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED");
  const session = registerLocalRoleSessionForTest({ binding, transport: synchronousThreadsHttpTransport, assignment_envelope: JSON.parse(assigned.value).assignment_envelope, private_key: keys.privateKey, now: () => now.value });
  const { localRoleEvidence } = await import("../web/lib/catfood-role-channel"); process.stdout.write(canonicalJson({ type: "enrolled", evidence: localRoleEvidence(session) }) + "\n");
  const command = await input.next(); if (command.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED"); const job = JSON.parse(command.value) as { now_ms: number; control_path: string; checkpoint_path: string; role_evidence: Record<string, unknown>[]; evaluation_job: AuthorityEvaluationJob; manifest: CatfoodSealedInputManifestV1; custody_release_receipt: Record<string, unknown> }; if (Number.isFinite(job.now_ms)) now.value = job.now_ms;
  if (!job.evaluation_job) { const evaluator = new IndependentCatfoodEvaluator(job.control_path, job.checkpoint_path); try { process.stdout.write(canonicalJson({ type: "assessment", package: createAuthenticatedAssessmentPackage({ evaluator, evaluator_session: session, role_evidence: job.role_evidence, binding, run_id: start.run_id }) }) + "\n"); } finally { evaluator.close(); } return; }
  const staged = stageVerifiedEvaluationMaterial({ manifest: job.manifest, job: job.evaluation_job.descriptor, control_path: job.control_path, checkpoint_path: job.checkpoint_path }), evaluator = new IndependentCatfoodEvaluator(staged.control_path, staged.checkpoint_path); try { process.stdout.write(canonicalJson({ type: "assessment", package: evaluateAssignedCatfoodJob({ evaluator, evaluator_session: session, role_evidence: job.role_evidence, binding, job: job.evaluation_job, manifest: job.manifest, custody_release_receipt: job.custody_release_receipt }) }) + "\n"); } finally { evaluator.close(); staged.close(); }
}

if (import.meta.main) {
  if (!process.argv.includes("--test-role-fixture")) throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE");
  await fixtureMain();
}
