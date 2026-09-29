# PRE-CUSTODY-CONTROL01-CORRECTIVE02

Status: external `TEST_ONLY` pre-rehearsal adjunct. It does not change or extend WP3 acceptance.

Frozen inputs:

- IKORABU WP3 commit `712b4e528986ebf891a45dac14f65c22d6530844`, tree `effacfd2803f45e7bc84ad65f0855831980552d2`.
- Threads commit `875e75fce20c16c6157b5aa42f759411c52e95fe`, read only.

## Guarded reference composition

`TestOnlyPreCustodyHost` privately owns the accepted `CatfoodRoleAuthority` capability and its pinned `RoleChannelBinding`. Its ordinary public interface exposes guarded run reservation, custodian admission/replacement, supporting-role launch, canonical close, job issue, exact reconciliation, target assignment, publication eligibility and a fixed safety command set. It does not expose the authority, private key, controller database or unrestricted callback execution.

The canonical run binding pins K, environment instance, spec, W/window, GO artifact/policy reference, custody store-pair identity, journal/checkpoint heads, raw control/checkpoint snapshot identities, pair common cut, producer generation and the authority incarnation/high-water. Admission additionally pins the authenticated WP3 custodian session, launch assignment, action-key fingerprint, subject, process, host incarnation and accepted build identity.

A close is canonical only when its authentic V2 release receipt belongs to the admitted custodian session and its signed manifest and GO reference match the pinned lineage. An authentic non-admitted custodian is not a candidate-selection input: it creates durable incident evidence and cannot issue a controller-authorized job or publish.

Job and target operations reserve operation kind, K and expected authority incarnation/revision before invocation. After the pinned authority creates the signed effect, and before the host returns it to its caller, the controller durably pins the exact job/assignment ID, authenticated content digest and signed-envelope digest. Lost-response recovery ignores process-local bookkeeping and reads only an authority effect that matches that persisted exact identity. Callers cannot submit substitute jobs, targets or trust roots, and a different operation ID cannot abandon an unresolved effect.

Authority snapshots are checked for incarnation changes, revision rollback, disappearance of an applied or pending exact effect, unguarded effects and reuse of a pending or applied revision for different authenticated content. Missing exact identity, disappearance and same-revision replacement create durable incident evidence. An incident is terminal for positive controller actions, revokes current controller eligibility, and cannot be overwritten by delayed job/target completion. Historical accepted evidence is not mutated.

## Launch, fencing and safety limits

The host performs the launch/key-assignment guard before returning any role session. A second ordinary custodian cannot obtain a session through the host after admission. Replacement begins only after real lease-expiry comparison and a trusted host-owned `TrustedFenceAdapter` observation. Invalid fence evidence is rejected before a successor assignment is created. This interface does not claim real producer fencing; OS/process/credential revocation and delayed producer-effect resolution remain deployment work.

Safety is a closed command union: `STATUS_READ`, `RECONCILE_READ`, and `REVOKE`. It cannot run caller functions, create jobs or targets, assign positive roles, renew authority, select custody history/verdict, publish or clear an incident.

## Tests and evidence

- N01-N18 exercise the corrected normative suite. N02 uses two overlapping OS processes against the same SQLite controller/witness stores. N09 changes actual authenticated manifest W/store/head material. N10 changes the actual accepted authority continuity row.
- C01-C25 cover every corrective hostile case, including authentic non-owner receipts, exact reconciliation, raw-authority detection, authority revision reuse, incident completion races, operation-domain separation and CRLF classification.
- R01-R07 cover the corrective02 defect symmetrically: pending job and target rollback/reissue, exact recovery after host restart without volatile maps, disappearance without replacement, delayed completion/retry after durable incident, restart in the pin-to-`UNRESOLVED` crash window, and same-revision alternate coexistence.
- P1-P7 reproduce the independent audit attacks at the external guard boundary.
- Adjunct integrity identifies canonical LF/Git-blob bytes separately from checkout working-tree bytes. A CRLF checkout may have a different raw working-tree SHA-256 without changing the canonical committed blob identity.

The earlier C17 and P4 oracles did not cover this case. C17 first applied the original job, so its authenticated digest was already present in `authority_revision_effects`; P4 rolled continuity below an already applied controller high-water. Neither left an `UNRESOLVED` lost-response operation, removed its still-pending original effect, and reissued different authentic content at the same revision and logical inputs. R01/R02 exercise that missing transition directly.

The witness is a **TEST_ONLY witness protocol mechanism**. In this reference fixture the witness and controller remain in the **same rollback domain**. Actual independent durability, principal separation and rollback-domain protection are not verified and must not be inferred from these tests.

## Required deployment assumptions

- The deployed launcher must keep the authority private key, raw authority endpoint and writable authority/controller/custody stores away from ordinary roles.
- Controller, authority, witness and custody stores need independently enforced principals, ACLs, backup/restore rules and durable high-water storage.
- Real launch identity, key-handle isolation, child-process inheritance, store mounts, producer generation/fencing, delayed effects, clock bounds and restart/restore behavior require separate commissioning evidence.
- H acceptance, production clock methodology, real provider behavior and Threads producer fencing semantics are outside this package.

`REAL_DEPLOYMENT_CLOSURE_NOT_VERIFIED`

`PRE_REHEARSAL_COMPLETE = NO`

`REHEARSAL_READY = NO`

`Rehearsal authorization = NOT_GRANTED`

No production, deployment, provisioning, real keys/roots, Human GO, probes, rehearsal, CATFOOD or provider/live action is performed or authorized.
