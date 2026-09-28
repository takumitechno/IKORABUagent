import { parseJsonNoDuplicateKeys, CATFOOD_THREADS_DEPENDENCY_ROOT } from "./catfood-coe";
import { canonicalJson, sha256 } from "./catfood-harness";
import { CATFOOD_EVALUATOR_SHA256, CATFOOD_POLICY_SHA256, CatfoodTrustError, type EvaluationResult } from "./catfood-trust";
import { verifiedRoleEvidenceRecord, type VerifiedRoleEvidence, type WriterCredentialReference } from "./catfood-role-channel";

export const CATFOOD_ATTESTATION_SCHEMA_V4 = "catfood-independent-attestation.v4";
export const CATFOOD_ATTESTATION_ARTIFACT_SCHEMA_V4 = "catfood-independent-attestation-artifact.v4";
export const CATFOOD_ATTESTATION_DOMAIN_V4 = "IKORABU/WP3/CATFOOD/ATTESTATION/V4";
export const CATFOOD_EVALUATION_RECEIPT_PURPOSE_V2 = "IKORABU/WP3/CATFOOD/EVALUATION-RESULT/V2";
export const CATFOOD_DECISION_CORE_PURPOSE = "IKORABU/WP3/CATFOOD/EVALUATION-RESULT/V1";
export const CATFOOD_WRITER_CREDENTIAL_PURPOSE_V2 = "IKORABU/WP3/CATFOOD/WRITER-CREDENTIAL/V2";
export const CATFOOD_ISSUANCE_PREPARE_PURPOSE_V2 = "IKORABU/WP3/CATFOOD/ATTESTATION-ISSUANCE-PREPARE/V2";
export const CATFOOD_ISSUANCE_FINALIZE_PURPOSE_V2 = "IKORABU/WP3/CATFOOD/ATTESTATION-ISSUANCE-FINALIZE/V2";
export const CATFOOD_DECISION_CORE_SCHEMA = "catfood-decision-core.v1";
export const CATFOOD_EVALUATION_ACTION_SCHEMA_V2 = "catfood-evaluation-action.v2";
export const CATFOOD_EVALUATION_PACKAGE_SCHEMA_V2 = "catfood-authenticated-assessment-package.v2";
export const CATFOOD_EVALUATION_RECEIPT_SCHEMA_V2 = "catfood-evaluation-receipt.v2";
export const CATFOOD_WRITER_AUTHORIZATION_SCHEMA_V2 = "catfood-writer-credential-authorization.v2";
export const CATFOOD_PREPARATION_SCHEMA_V2 = "catfood-attestation-issuance-preparation.v2";
export const CATFOOD_FINALIZATION_SCHEMA_V2 = "catfood-attestation-issuance-finalization.v2";
const MAX_BYTES = 2_000_000;

export interface AuthenticatedAssessmentPackage {
  schema: typeof CATFOOD_EVALUATION_PACKAGE_SCHEMA_V2;
  decision_core: Readonly<Record<string, unknown>>;
  evaluation_receipt: Readonly<Record<string, unknown>>;
  role_evidence: readonly Readonly<Record<string, unknown>>[];
  provenance: Readonly<Record<string, unknown>>;
}

function object(value: unknown, code = "ATTESTATION_SCHEMA_INVALID"): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) throw new CatfoodTrustError(code); return value as Record<string, unknown>; }
function exact(value: Record<string, unknown>, fields: readonly string[], code = "ATTESTATION_SCHEMA_INVALID"): void { const got = Object.keys(value).sort(), want = [...fields].sort(); if (got.length !== want.length || got.some((field, index) => field !== want[index])) throw new CatfoodTrustError(code); }
export function parseCanonicalAttestation(text: string, code = "ATTESTATION_SCHEMA_INVALID"): Record<string, unknown> { let value: Record<string, unknown>; try { value = parseJsonNoDuplicateKeys(text, MAX_BYTES, 64) as Record<string, unknown>; } catch { throw new CatfoodTrustError(code); } if (canonicalJson(value) !== text) throw new CatfoodTrustError(code); return value; }
export function attestationDigest(value: unknown): string { return sha256(canonicalJson(value as never)); }
function reasons(value: unknown): readonly string[] { if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.length === 0) || new Set(value).size !== value.length || canonicalJson(value) !== canonicalJson([...value].sort())) throw new CatfoodTrustError("ATTESTATION_RESULT_INVALID"); return value as string[]; }

export function v4RoleSummary(role: VerifiedRoleEvidence): Readonly<Record<string, unknown>> {
  const row = verifiedRoleEvidenceRecord(role), enrollment = object(row.enrollment), launch = object(enrollment.launch), descriptor = object(enrollment.accepted_role_descriptor), scope = object(enrollment.scope);
  return Object.freeze({ subject: enrollment.subject, session_id: enrollment.session_id, launch_id: launch.launch_id, build_sha256: descriptor.artifact_root, snapshot_id: enrollment.accepted_snapshot_id, snapshot_sha256: enrollment.accepted_snapshot_sha256, enrollment_namespace: enrollment.enrollment_namespace, action_key_fingerprint: enrollment.action_key_fingerprint, scope_sha256: attestationDigest(scope) });
}

export function v4WriterCredential(role: VerifiedRoleEvidence): WriterCredentialReference {
  const enrollment = object(verifiedRoleEvidenceRecord(role).enrollment), credential = object(enrollment.writer_credential, "ATTESTATION_WRITER_CREDENTIAL_INVALID"); exact(credential, ["key_id", "key_version", "public_key_pem", "public_key_sha256"], "ATTESTATION_WRITER_CREDENTIAL_INVALID"); return Object.freeze(structuredClone(credential)) as unknown as WriterCredentialReference;
}

export function buildDecisionCore(runId: string, bundle: Record<string, unknown>, evaluation: EvaluationResult, evaluator: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const spec = object(bundle.spec), go = object(bundle.go), checkpoint = object(bundle.checkpoint), source = object(bundle.final_source); reasons(evaluation.reason_codes);
  return Object.freeze({ schema: CATFOOD_DECISION_CORE_SCHEMA, purpose: CATFOOD_DECISION_CORE_PURPOSE, run_id: runId, scope: Object.freeze({ environment_type: spec.environment_type, environment_instance_id: spec.environment_instance_id, organization_id: spec.organization_id, tenant_id: spec.tenant_id, account_id: spec.account_id }), spec_sha256: spec.spec_sha256, requested_window_start: spec.requested_window_start, requested_window_end: spec.requested_window_end, go_sha256: go.artifact_sha256, dependency_root: CATFOOD_THREADS_DEPENDENCY_ROOT, ikorabu_release_sha: spec.ikorabu_release_sha, threads_sha: spec.threads_sha, boundary_sha256: spec.operational_boundary_sha256, threads_release_sha256: spec.threads_release_sha256, threads_schema: spec.threads_schema, evaluator_sha256: evaluation.evaluator_sha256, policy_sha256: evaluation.policy_sha256, checkpoint_id: checkpoint.checkpoint_id, source_digest: source.digest, bundle_sha256: evaluation.rederived_bundle_sha256, verdict: evaluation.verdict, reason_codes: evaluation.reason_codes, test_only: evaluation.test_only, evidence_coverage: evaluation.evidence_coverage, evaluator });
}

export function validateDecisionCoreV4(value: unknown, expected: { run_id: string; bundle_sha256: string; trust_domain: "TEST_ONLY" | "OPERATIONAL" }): Record<string, unknown> {
  const core = object(value, "ATTESTATION_RESULT_INVALID"); exact(core, ["boundary_sha256", "bundle_sha256", "checkpoint_id", "dependency_root", "evaluator", "evaluator_sha256", "evidence_coverage", "go_sha256", "ikorabu_release_sha", "policy_sha256", "purpose", "reason_codes", "requested_window_end", "requested_window_start", "run_id", "schema", "scope", "source_digest", "spec_sha256", "test_only", "threads_release_sha256", "threads_schema", "threads_sha", "verdict"], "ATTESTATION_RESULT_INVALID"); reasons(core.reason_codes); if (core.schema !== CATFOOD_DECISION_CORE_SCHEMA || core.purpose !== CATFOOD_DECISION_CORE_PURPOSE || core.run_id !== expected.run_id || core.bundle_sha256 !== expected.bundle_sha256 || core.evaluator_sha256 !== CATFOOD_EVALUATOR_SHA256 || core.policy_sha256 !== CATFOOD_POLICY_SHA256 || core.dependency_root !== CATFOOD_THREADS_DEPENDENCY_ROOT || !["PASS", "FAIL", "BLOCKED"].includes(String(core.verdict)) || !["COMPLETE", "PARTIAL", "UNKNOWN"].includes(String(core.evidence_coverage)) || typeof core.test_only !== "boolean" || (expected.trust_domain === "TEST_ONLY" ? core.test_only !== true : core.test_only !== false) || !Number.isFinite(Date.parse(String(core.requested_window_start))) || !Number.isFinite(Date.parse(String(core.requested_window_end)))) throw new CatfoodTrustError("ATTESTATION_RESULT_INVALID"); return core;
}

export function buildEvaluationAction(core: Readonly<Record<string, unknown>>, roleEvidenceSha256: string, runScope: Readonly<Record<string, unknown>>, assessmentId: string): Readonly<Record<string, unknown>> { return Object.freeze({ schema: CATFOOD_EVALUATION_ACTION_SCHEMA_V2, action_id: assessmentId, assessment_id: assessmentId, run_id: core.run_id, run_scope: runScope, decision_core: core, decision_core_sha256: attestationDigest(core), role_evidence_sha256: roleEvidenceSha256, evaluator: core.evaluator, bundle_sha256: core.bundle_sha256, source_digest: core.source_digest, policy_sha256: core.policy_sha256 }); }
export function buildWriterCredentialAction(runId: string, writer: Readonly<Record<string, unknown>>, credential: Readonly<Record<string, unknown>>, roleEvidenceSha256: string, actionId: string): Readonly<Record<string, unknown>> { return Object.freeze({ schema: "catfood-writer-credential-action.v2", action_id: actionId, run_id: runId, writer, writer_credential: credential, role_evidence_sha256: roleEvidenceSha256 }); }
export function buildPreparationAction(runId: string, assessmentId: string, evaluationReceiptSha256: string, coreSha256: string, writer: Readonly<Record<string, unknown>>, credential: Readonly<Record<string, unknown>>, credentialAuthorizationSha256: string, roleEvidenceSha256: string, issuanceId: string): Readonly<Record<string, unknown>> { return Object.freeze({ schema: "catfood-issuance-prepare-action.v2", action_id: issuanceId, issuance_id: issuanceId, run_id: runId, assessment_id: assessmentId, evaluation_receipt_sha256: evaluationReceiptSha256, decision_core_sha256: coreSha256, writer, writer_credential: credential, credential_authorization_sha256: credentialAuthorizationSha256, role_evidence_sha256: roleEvidenceSha256, payload_domain: CATFOOD_ATTESTATION_DOMAIN_V4 }); }
export function buildFinalizationAction(runId: string, assessmentId: string, payload: Record<string, unknown>, payloadText: string, signatureBase64url: string): Readonly<Record<string, unknown>> { return Object.freeze({ schema: "catfood-issuance-finalize-action.v2", action_id: payload.issuance_id, issuance_id: payload.issuance_id, run_id: runId, assessment_id: assessmentId, payload_sha256: sha256(payloadText), signature_sha256: sha256(Buffer.from(signatureBase64url, "base64url")), evaluation_receipt_sha256: payload.evaluation_receipt_sha256, credential_authorization_sha256: payload.credential_authorization_sha256, preparation_receipt_sha256: payload.issuance_preparation_sha256, role_evidence_sha256: payload.role_evidence_sha256, writer_credential: payload.writer_credential, payload_json: payloadText, signature_base64url: signatureBase64url }); }
