#!/usr/bin/env bun
import { createInterface } from "node:readline";
import { createHash, generateKeyPairSync } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonicalJson } from "../web/lib/catfood-harness";
import { collectCurrentRuntimeSubject, observeTestOnlyRoleLaunch, roleChannelArtifactDescriptor } from "../web/lib/catfood-enrollment";
import { IndependentCatfoodAttestationWriter, initializeIndependentAttestationStore, readIndependentAttestationV4 } from "../web/lib/catfood-independent-attestation";
import type { AuthenticatedAssessmentPackage } from "../web/lib/catfood-attestation-contract";
import { localRoleEvidence, registerLocalRoleSessionForTest, type RoleChannelBinding } from "../web/lib/catfood-role-channel";
import { CatfoodTrustError } from "../web/lib/catfood-trust";
import { synchronousThreadsHttpTransport } from "../web/lib/catfood-threads-http";

export function issueAuthenticatedCatfoodAssessment(writer: IndependentCatfoodAttestationWriter, packet: AuthenticatedAssessmentPackage, at?: string): string { return writer.attest(packet, at); }

async function fixtureMain(): Promise<void> {
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })[Symbol.asyncIterator](), first = await input.next(); if (first.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED");
  const start = JSON.parse(first.value) as { binding: RoleChannelBinding; now_ms: number }, now = { value: start.now_ms }, binding = start.binding, actionKeys = generateKeyPairSync("ed25519"), outerKeys = generateKeyPairSync("ed25519"), publicPem = outerKeys.publicKey.export({ type: "spki", format: "pem" }).toString(), credential = { key_id: "attest:test:v4", key_version: "v4", public_key_sha256: createHash("sha256").update(outerKeys.publicKey.export({ type: "spki", format: "der" }) as Buffer).digest("hex"), public_key_pem: publicPem }, subject = collectCurrentRuntimeSubject({ ...binding, deployment_id: "deployment:test", environment_identity: "instance:test" });
  const launch = observeTestOnlyRoleLaunch({ ...binding, public_key_pem: binding.authority_public_key_pem, environment_identity: "instance:test", deployment_id: "deployment:test", launch_ticket: "test:writer", writer_signing_key_id: credential.key_id, writer_signing_key_version: credential.key_version, writer_signing_public_key_pem: publicPem }, "writer", subject);
  process.stdout.write(canonicalJson({ type: "hello", role: "writer", subject, launch, descriptor: roleChannelArtifactDescriptor("writer"), public_key_pem: actionKeys.publicKey.export({ type: "spki", format: "pem" }).toString(), writer_credential: credential }) + "\n");
  const assigned = await input.next(); if (assigned.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED"); const session = registerLocalRoleSessionForTest({ binding, transport: synchronousThreadsHttpTransport, assignment_envelope: JSON.parse(assigned.value).assignment_envelope, private_key: actionKeys.privateKey, now: () => now.value }); process.stdout.write(canonicalJson({ type: "enrolled", evidence: localRoleEvidence(session) }) + "\n");
  const command = await input.next(); if (command.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED"); const job = JSON.parse(command.value), dir = mkdtempSync(join(tmpdir(), "catfood-v4-writer-")), storePath = join(dir, "writer.db"); if (Number.isFinite(job.now_ms)) now.value = job.now_ms; writeFileSync(storePath, ""); initializeIndependentAttestationStore(storePath, { writer_identity: "attestor:test:v4", signing_key_id: credential.key_id, signing_public_key_pem: publicPem }); const writer = new IndependentCatfoodAttestationWriter(storePath, outerKeys.privateKey.export({ type: "pkcs8", format: "pem" }).toString(), session, binding); try { const id = issueAuthenticatedCatfoodAssessment(writer, job.package, job.attested_at), row = readIndependentAttestationV4(storePath, id); process.stdout.write(canonicalJson({ type: "artifact", attestation_id: id, artifact_json: row.artifact_json, bundle_sha256: row.bundle_sha256 }) + "\n"); } finally { writer.close(); rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 }); }
}

if (import.meta.main) {
  if (!process.argv.includes("--test-role-fixture")) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED");
  await fixtureMain();
}
