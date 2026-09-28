#!/usr/bin/env bun
import { createInterface } from "node:readline";
import { generateKeyPairSync } from "node:crypto";
import { canonicalJson } from "../web/lib/catfood-harness";
import { collectCurrentRuntimeSubject, observeTestOnlyRoleLaunch, roleChannelArtifactDescriptor, type CatfoodEnrollmentRole } from "../web/lib/catfood-enrollment";
import { localRoleEvidence, registerLocalRoleSessionForTest, type RoleChannelBinding } from "../web/lib/catfood-role-channel";
import { openOperationalCatfoodCustodian } from "../web/lib/catfood-operational-bootstrap";
import { CatfoodTrustError } from "../web/lib/catfood-trust";
import { synchronousThreadsHttpTransport } from "../web/lib/catfood-threads-http";

export { openOperationalCatfoodCustodian };

async function fixtureMain(): Promise<void> {
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })[Symbol.asyncIterator](), first = await input.next(); if (first.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED"); const start = JSON.parse(first.value) as { binding: RoleChannelBinding; now_ms: number }, now = { value: start.now_ms }, binding = start.binding, subject = collectCurrentRuntimeSubject({ ...binding, deployment_id: "deployment:test", environment_identity: "instance:test" }), roles: CatfoodEnrollmentRole[] = ["source", "custodian"], keys = roles.map(() => generateKeyPairSync("ed25519"));
  process.stdout.write(canonicalJson({ type: "hello", roles: roles.map((role, index) => ({ role, subject, launch: observeTestOnlyRoleLaunch({ ...binding, public_key_pem: binding.authority_public_key_pem, environment_identity: "instance:test", deployment_id: "deployment:test", launch_ticket: `test:${role}`, writer_signing_key_id: "none", writer_signing_key_version: "none", writer_signing_public_key_pem: binding.authority_public_key_pem }, role, subject), descriptor: roleChannelArtifactDescriptor(role), public_key_pem: keys[index]!.publicKey.export({ type: "spki", format: "pem" }).toString() })) }) + "\n");
  const assigned = await input.next(); if (assigned.done) throw new CatfoodTrustError("ROLE_CHANNEL_UNPROVISIONED"); const assignments = JSON.parse(assigned.value).assignment_envelopes as string[], sessions = roles.map((_, index) => registerLocalRoleSessionForTest({ binding, transport: synchronousThreadsHttpTransport, assignment_envelope: assignments[index]!, private_key: keys[index]!.privateKey, now: () => now.value })); process.stdout.write(canonicalJson({ type: "enrolled", evidence: sessions.map(localRoleEvidence) }) + "\n");
}

if (import.meta.main) {
  if (process.argv.includes("--test-role-fixture")) await fixtureMain();
  else openOperationalCatfoodCustodian();
}
