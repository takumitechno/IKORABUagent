# PRE-CUSTODY-CONTROL01-CORRECTIVE05

Status: external `TEST_ONLY` pre-rehearsal adjunct. It does not change or extend WP3 acceptance.

Frozen inputs:

- IKORABU WP3 commit `712b4e528986ebf891a45dac14f65c22d6530844`, tree `effacfd2803f45e7bc84ad65f0855831980552d2`.
- Threads commit `875e75fce20c16c6157b5aa42f759411c52e95fe`, read only.

## Guarded reference composition

`TestOnlyPreCustodyHost` privately owns the accepted `CatfoodRoleAuthority` capability and its pinned `RoleChannelBinding`. Its ordinary public interface exposes guarded run reservation, custodian admission/replacement, host-observed lineage advance, supporting-role launch, canonical close, job issue, exact reconciliation, target assignment, publication eligibility and a fixed safety command set. It does not expose the authority, private key, controller database or unrestricted callback execution.

The canonical run binding is a pre-write reservation root. It pins K, environment instance, spec, W/window, GO artifact/policy reference, custody store-pair identity, initial journal/checkpoint heads, initial raw control/checkpoint snapshot identities, initial pair common cut, producer generation and the authority incarnation/high-water. On first reservation the host-owned lineage adapter must independently return `pre_write=true` and the exact same root; a completed or caller-selected history cannot become the initial root. The observation is stored with the immutable reservation root, separately from the current governed lineage. Admission additionally pins the authenticated WP3 custodian session, launch assignment, action-key fingerprint, subject, process, host incarnation and accepted build identity before any governed lineage advance.

For a **new** lineage operation ID, the caller does not provide lineage heads to the controller. The TEST_ONLY host obtains a fresh closed `LineageObservation` from its private `TrustedLineageAdapter`, authenticates the actual local custodian-session capability against the admitted WP3 evidence, and submits one `ADVANCE_LINEAGE` transition. Each transition binds K, custodian session, monotonically increasing lineage sequence, exact predecessor digest, store-pair identity and canonical next-lineage digest. Before witness append, the controller rejects a next digest that equals the immutable reservation root or any previously accepted digest for K, records durable `LINEAGE_ROLLBACK` incident evidence and revokes positive eligibility. The continuity witness then sequences only a non-contradictory operation before the controller atomically appends `lineage_advances` and updates the current lineage.

For an **existing interrupted** lineage operation ID, `TestOnlyPreCustodyHost.advanceLineage` asks its private controller to recover the exact persisted operation before consulting the adapter. The persisted operation input and exact witness record—not a newly reconstructed observation—are authoritative. Recovery requires only canonical K and the original operation ID; it does not accept caller-provided observations, roots or stored payloads. If the witness already committed the exact expected record, retry adopts that acknowledgment and finishes the local transition without a second append. A changed adapter observation after restart cannot rewrite historical operation identity. This is exact reconciliation of a previously admitted transition, not adoption of a stale external store. A different operation cannot inherit an unresolved transition, and an exact replay after local application returns the recorded result idempotently.

The controller guarantees an immutable reservation root, explicit current lineage, exact predecessor sequencing, no accepted digest revisit and durable incident handling for contradictions visible in its persisted identities. The trusted adapter guarantees the authenticity of the observed store state and is responsible for semantic interpretation beyond those digest/history checks. In particular, the controller **does not prove semantic descent** for an all-new opaque successor identity; detecting a deeper sibling rewrite whose controller-visible identities are all new remains a **trusted adapter** responsibility.

A close is canonical only when its authentic V2 release receipt belongs to the admitted custodian session and its signed manifest and GO reference match the latest witnessed lineage. Replacement fencing is also compared with that latest lineage, not the reservation root. An authentic non-admitted custodian is not a candidate-selection input: it creates durable incident evidence and cannot advance lineage, issue a controller-authorized job or publish.

Job and target operations reserve operation kind, K and expected authority incarnation/revision before invocation. After the pinned authority creates the signed effect, and before the host returns it to its caller, the controller durably pins the exact job/assignment ID, authenticated content digest and signed-envelope digest. Lost-response recovery ignores process-local bookkeeping and reads only an authority effect that matches that persisted exact identity. Callers cannot submit substitute jobs, targets or trust roots, and a different operation ID cannot abandon an unresolved effect.

Authority snapshots are checked for incarnation changes, revision rollback, disappearance of an applied or pending exact effect, unguarded effects and reuse of a pending or applied revision for different authenticated content. Missing exact identity, disappearance and same-revision replacement create durable incident evidence. An incident is terminal for positive controller actions, revokes current controller eligibility, and cannot be overwritten by delayed job/target completion. Historical accepted evidence is not mutated.

## Launch, fencing and safety limits

The host performs the launch/key-assignment guard before returning any role session. A second ordinary custodian cannot obtain a session through the host after admission. Replacement begins only when no continuity operation is open, then performs real lease-expiry comparison and a trusted host-owned `TrustedFenceAdapter` observation. The adapter observes current store state independently rather than echoing controller expectations. An open operation blocks replacement before `FENCING`, revocation or successor creation. Invalid or stale/forked fence evidence is rejected before a successor assignment is created. This interface does not claim real producer fencing; OS/process/credential revocation and delayed producer-effect resolution remain deployment work.

Safety is a closed command union: `STATUS_READ`, `RECONCILE_READ`, and `REVOKE`. It cannot run caller functions, create jobs or targets, assign positive roles, renew authority, select custody history/verdict, publish or clear an incident.

## Tests and evidence

- N01-N18 exercise the corrected normative suite. N02 uses two overlapping OS processes against the same SQLite controller/witness stores. N09 changes actual authenticated manifest W/store/head material. N10 changes the actual accepted authority continuity row.
- C01-C25 cover every corrective hostile case, including authentic non-owner receipts, exact reconciliation, raw-authority detection, authority revision reuse, incident completion races, operation-domain separation and CRLF classification.
- R01-R07 cover the corrective02 defect symmetrically: pending job and target rollback/reissue, exact recovery after host restart without volatile maps, disappearance without replacement, delayed completion/retry after durable incident, restart in the pin-to-`UNRESOLVED` crash window, and same-revision alternate coexistence.
- Q01-Q10 cover the corrective03 lifecycle: pre-write reservation through final close, conflicting completed-history claims, multi-step monotonic advance, rollback/fork rejection, wrong custodian, restart persistence, stale close/fence evidence and incident terminality.
- S01-S10 cover corrective04: reservation-root and historical-digest revisit rejection, restored-fresh-store attack closure, new-operation replay rejection, exact same-operation replay, witness response-loss/restart recovery, operation ownership, incident durability and the adapter responsibility boundary.
- T01-T10 cover corrective05: Host-owned exact recovery from PENDING/ACKNOWLEDGED/APPLIED states after full Host/controller/adapter reconstruction, changed live observation time/store state, different-operation takeover rejection, pre-`FENCING` replacement blocking and preserved lineage-history rejection.
- P1-P7 reproduce the independent audit attacks at the external guard boundary.
- Adjunct integrity identifies canonical LF/Git-blob bytes separately from checkout working-tree bytes. A CRLF checkout may have a different raw working-tree SHA-256 without changing the canonical committed blob identity.

The earlier C17 and P4 oracles did not cover this case. C17 first applied the original job, so its authenticated digest was already present in `authority_revision_effects`; P4 rolled continuity below an already applied controller high-water. Neither left an `UNRESOLVED` lost-response operation, removed its still-pending original effect, and reissued different authentic content at the same revision and logical inputs. R01/R02 exercise that missing transition directly.

The witness remains a **TEST_ONLY witness protocol mechanism**, and the lineage adapter is likewise TEST_ONLY. In this reference fixture the witness and controller remain in the **same rollback domain**, and the adapter is an in-process stand-in for independently mounted custody-store observation. Actual independent durability, principal separation, store authenticity and rollback-domain protection are not verified and must not be inferred from these tests.

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
