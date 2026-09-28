# PRE-CUSTODY-CONTROL01

Status: `TEST_ONLY` deployment adjunct. This directory is not part of the accepted WP3 runtime or integrity manifest and does not change WP3 acceptance.

## Frozen inputs

- IKORABU WP3: commit `712b4e528986ebf891a45dac14f65c22d6530844`, tree `effacfd2803f45e7bc84ad65f0855831980552d2`.
- Threads producer: commit `875e75fce20c16c6157b5aa42f759411c52e95fe`, read only.
- The adjunct imports frozen validators, role receipts, evaluation jobs and expected-target verification as a read-only dependency. It does not preload, replace, subclass or patch accepted code.

## Canonical ownership

The canonical key is `(environment_type, deployment_id, organization_id, tenant_id, account_id, run_id)`. Spec, W/window, GO artifact and policy, authority incarnation, store pair, producer generation and environment instance are immutable bound values. Changing a bound value cannot create a second namespace for the same run.

The initial profile is deliberately small: one controller store, one accepted authority store, one independently persisted witness store, one active control host and one custody writer for a governed run. There is no active-active placement, consensus, automatic failover or reconciliation that chooses a winning verdict.

| Frozen host interface | Adjunct guard | Durable evidence |
|---|---|---|
| `CatfoodRoleAuthority.issueLaunchKeyAssignment` / store and credential admission | `reserveRun` then `admitCustodian` before the host grants any handle | canonical binding, owner subject, host incarnation, lease suspicion and witness acknowledgment |
| `custodian.evaluation.release` + `CatfoodRoleAuthority.issueEvaluationJob` | `closeManifest` pins the accepted manifest; `issueEvaluationJob` verifies the authentic V2 release and exact pinned bytes | raw canonical manifest, variant incidents, operation identity, authorized job identity |
| `CatfoodRoleAuthority.assignExpectedEvaluationTarget` | `assignExpectedTarget` accepts only a controller-authorized job and validates the signed frozen target | current target digest and prior target revocation |
| publication / current verification boundary | `publishCurrentTarget` requires a current target, canonical close, no incident, no pending effect and matching witness high-water | current target row and controller/witness revisions |
| stop, reconcile and revoke | `runSafetyAction` remains available in fencing, recovery and incident states | existing accepted authority evidence; the adjunct does not mint verdict evidence |

`PreCustodyControlHost` intentionally exposes only these guarded routes. The accepted authority and private store/credential handles must remain private to the real host composition. N15 proves this property for the TEST_ONLY object composition; OS-level non-bypassability is still a commissioning requirement.

## State and fork rules

`RESERVING → RESERVED → ACTIVE → CLOSED` is the positive path. Lease loss enters `FENCING`; it never grants replacement. Replacement requires proof that the old process cannot execute, its credentials are revoked, all producer effects are resolved and the complete same history is present. Unknown remote effects enter `RECOVERY_REQUIRED` and require exact-operation reconciliation.

The first close is not “first PASS wins”: only the already reserved writer may pin its registered history. Exact manifest replay is idempotent. Any distinct valid manifest for the same key is preserved in `custody_incidents`, moves the run to terminal `INCIDENT`, and blocks jobs, targets and publication. The controller never reads a verdict to resolve this state. Recovery means authorizing a different future run, not resetting this run.

Ordinary restart reopens the same controller and witness histories. A copied/restored store, mismatched head, lower controller revision, advanced witness or unresolved suffix blocks positive work. A witness append is conditional on `(key, sequence, previous_digest)`; exact retransmission returns the original acknowledgment. A response lost after witness commit is reconciled by the same operation ID.

## H and clock hooks

`CustodyControlInstrumentation` emits monotonic elapsed time plus wall and monotonic observation samples for witness appends and guarded authority effects, including blocked/unresolved outcomes. These are measurement hooks only. This package defines no production capacity, renewal margin, drift bound or clock acceptance threshold and therefore does not satisfy Incremental Verification H or the production clock methodology.

## Commissioning checklist (not performed)

- Run the controller, authority and witness under separate protected principals and durability/backup domains.
- Make the controller the only route to custody role assignment, writable control/checkpoint mounts, producer credentials, job issue, target assignment and publication.
- Deny alternate writable store mappings and raw authority endpoints to role processes.
- Prove process identity, accepted artifact/config identity, private-key handle isolation and child-process inheritance rules.
- Implement and exercise real Threads generation/permit revocation, delayed-request resolution and restricted producer egress; the adjunct does not invent a producer fencing token.
- Prove controller, authority and custody rollback/restore behavior against an independently retained witness high-water.
- Exercise crash, host reboot, backup restore, witness outage, clock step/rollback and permit-expiry margins under the later approved rehearsal plan.
- Establish H thresholds and production wall/monotonic/boot mapping methodology separately.
- Obtain independent adjunct audit before any deployment or rehearsal decision.

## Explicit limits

No production deployment, provisioning, real root/key/credential, Human GO, tenant probe, rehearsal, CATFOOD, provider call or live network action is implemented or authorized here. The TEST_ONLY mechanism is evidence that the protocol/composition can fail closed; real N1 deployment closure remains unverified.
