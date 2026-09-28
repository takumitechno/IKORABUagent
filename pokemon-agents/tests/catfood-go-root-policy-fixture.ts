import { createHash, createPublicKey } from "node:crypto";
import {
  CATFOOD_GO_ROOT_POLICY_SCHEMA, buildGoVerificationProfile, goRootPolicyRef,
  type CatfoodGoRootPolicyV1, type GoRootPolicyRef,
} from "../web/lib/catfood-final-closure";
import type { RoleRunScope } from "../web/lib/catfood-role-channel";

export function testGoRootPolicy(input: {
  authority_identity: string;
  authority_public_key_pem: string;
  enrollment_namespace: string;
  scope: RoleRunScope;
  public_keys: readonly Readonly<{ key_id: string; public_key_pem: string }>[];
  not_before: string;
  not_after: string;
  policy_id?: string;
  policy_version?: number;
  allow_new_go?: boolean;
  allow_historical_verification?: boolean;
  revoked_at?: string | null;
  acceptance_policy_sha256: string;
}): Readonly<{ policy: CatfoodGoRootPolicyV1; ref: GoRootPolicyRef; selection: Readonly<{ run_id: string; spec_sha256: string; window_start: string; window_end: string; current_policy_ref: GoRootPolicyRef; historical_policy_refs: readonly GoRootPolicyRef[] }> }> {
  const policy: CatfoodGoRootPolicyV1 = {
    schema: CATFOOD_GO_ROOT_POLICY_SCHEMA,
    policy_id: input.policy_id ?? "fixture-go-root-policy",
    policy_version: input.policy_version ?? 1,
    trust_domain: "TEST_ONLY",
    owner: {
      authority_identity: input.authority_identity,
      authority_anchor_sha256: createHash("sha256").update(createPublicKey(input.authority_public_key_pem).export({ type: "spki", format: "der" })).digest("hex"),
      enrollment_namespace: input.enrollment_namespace,
    },
    purpose: { use: "Human GO", go_schema: "catfood-human-go.v1", algorithm: "Ed25519", fingerprint: "SHA-256/SPKI-DER" },
    scope: {
      environment_type: input.scope.environment_type,
      environment_instance_id: input.scope.environment_instance_id,
      deployment_id: input.scope.deployment_id,
      organization_id: input.scope.organization_id,
      tenant_id: input.scope.tenant_id,
      account_id: input.scope.account_id,
    },
    verification_profile: buildGoVerificationProfile(input.public_keys),
    applicability: {
      not_before: input.not_before,
      not_after: input.not_after,
      allow_new_go: input.allow_new_go ?? true,
      allow_historical_verification: input.allow_historical_verification ?? true,
      revoked_at: input.revoked_at ?? null,
    },
    acceptance_policy_sha256: input.acceptance_policy_sha256,
  };
  const ref = goRootPolicyRef(policy);
  return Object.freeze({ policy, ref, selection: Object.freeze({ run_id: input.scope.run_id, spec_sha256: input.scope.spec_sha256, window_start: input.not_before, window_end: input.not_after, current_policy_ref: ref, historical_policy_refs: Object.freeze([ref]) }) });
}
