#!/usr/bin/env bun
import { createInterface } from "node:readline";
import { generateKeyPairSync } from "node:crypto";
import { canonicalJson } from "../web/lib/catfood-harness";
import { collectCurrentRuntimeSubject, observeTestOnlyRoleLaunch, roleChannelArtifactDescriptor } from "../web/lib/catfood-enrollment";
import { verifyIndependentAttestationArtifact } from "../web/lib/catfood-independent-attestation";
import { localRoleEvidence, registerLocalRoleSessionForTest, type RoleChannelBinding } from "../web/lib/catfood-role-channel";
import { CatfoodTrustError } from "../web/lib/catfood-trust";
import { synchronousThreadsHttpTransport } from "../web/lib/catfood-threads-http";

export function verifyAssignedCatfoodArtifact(...args: Parameters<typeof verifyIndependentAttestationArtifact>) { return verifyIndependentAttestationArtifact(...args); }

async function fixtureMain(): Promise<void> {
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })[Symbol.asyncIterator](), first = await input.next(); if (first.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED"); const start = JSON.parse(first.value) as { binding: RoleChannelBinding; now_ms: number }, now = { value: start.now_ms }, binding = start.binding, keys = generateKeyPairSync("ed25519"), subject = collectCurrentRuntimeSubject({ ...binding, deployment_id: "deployment:test", environment_identity: "instance:test" });
  const launch = observeTestOnlyRoleLaunch({ ...binding, public_key_pem: binding.authority_public_key_pem, environment_identity: "instance:test", deployment_id: "deployment:test", launch_ticket: "test:verifier", writer_signing_key_id: "none", writer_signing_key_version: "none", writer_signing_public_key_pem: binding.authority_public_key_pem }, "verifier", subject); process.stdout.write(canonicalJson({ type: "hello", role: "verifier", subject, launch, descriptor: roleChannelArtifactDescriptor("verifier"), public_key_pem: keys.publicKey.export({ type: "spki", format: "pem" }).toString() }) + "\n");
  const assigned = await input.next(); if (assigned.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED"); const session = registerLocalRoleSessionForTest({ binding, transport: synchronousThreadsHttpTransport, assignment_envelope: JSON.parse(assigned.value).assignment_envelope, private_key: keys.privateKey, now: () => now.value }); process.stdout.write(canonicalJson({ type: "enrolled", evidence: localRoleEvidence(session) }) + "\n");
  for (let command = await input.next(); !command.done; command = await input.next()) { const job = JSON.parse(command.value); if (Number.isFinite(job.now_ms)) now.value = job.now_ms; try { const verdict = verifyAssignedCatfoodArtifact(job.artifact_json, { run_id: job.run_id, bundle_sha256: job.bundle_sha256, allow_test_only: true, verifier_session: session, role_channel_binding: binding, expected_target_envelope: job.expected_target_envelope }, "TEST_ONLY"); process.stdout.write(canonicalJson({ type: "verified", verdict }) + "\n"); } catch (error) { process.stdout.write(canonicalJson({ type: "rejected", code: error instanceof CatfoodTrustError ? error.code : "UNEXPECTED_ERROR" }) + "\n"); } }
}

if (import.meta.main) {
  if (!process.argv.includes("--test-role-fixture")) throw new CatfoodTrustError("OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE");
  await fixtureMain();
}
