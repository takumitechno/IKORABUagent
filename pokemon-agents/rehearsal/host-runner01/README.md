# TEST_ONLY rehearsal Host runner 01

This package is bounded **TEST_ONLY setup support**. It is not an accepted security mechanism, does not modify the `PRE_REHEARSAL` closure, does not prove deployment isolation, does not prove production restart or fencing, and does not authorize a rehearsal. Actual campaign inputs require separate authorization.

## Composition

`RehearsalHostSupervisor` owns process lifecycle and append-only JSONL evidence outside the worker. It starts `host-worker.ts` as a distinct OS process. Only that worker constructs the accepted `TestOnlyPreCustodyHost`, `CustodyController`, `TestOnlySqliteContinuityWitness`, authority, fence adapter, and persistent lineage adapter. The supervisor never receives a controller, authority, signing callback, SQLite handle, role session, or private key.

The supervisor records campaign/case IDs, generation, PID, process identity and start time, command/operation IDs, fault mode and cut, store paths/IDs, witness sequence, recovery result, forced-kill request, actual exit status/signal, and replacement start ordering. A per-case exclusive lock makes a second live worker a trust failure. Replacement startup is refused until the old worker's exit has been observed.

`forceKill()` uses signal 9. Bun maps that to a forced `TerminateProcess`-equivalent operation on Windows and `SIGKILL` on POSIX. It does not send `GRACEFUL_STOP`, stdin EOF, or a cleanup signal. `GRACEFUL_STOP` is separately identified and writes a lab-only marker after calling `host.close()`. Forced process kill is a lab mechanism, not a production restart claim.

## Fixed protocol

The newline-delimited JSON protocol is an explicit discriminated union. It supports initialization, reserve/admit, durable H1/H2 material mutation, witness fault selection, lineage advance/recovery, close, job issue/reconciliation, target assignment/reconciliation, eligibility, bounded status reads, replacement request, state report, and graceful stop. Unknown commands and fields are rejected. There is no `eval`, callback, method-name reflection, generic controller/authority command, or generic SQLite operation.

R2a uses the accepted `BEFORE_COMMIT` witness seam. `R2A_CUT_REACHED` is returned only when the adapter already contains durable governed material, the original controller operation is `PENDING`, and no witness record exists. R2b uses `AFTER_COMMIT`; `R2B_CUT_REACHED` is returned only when the exact witness record exists while the controller operation remains `PENDING`. The supervisor may then force-kill the worker before recovery. A replacement worker recovers with the same operation ID through accepted `TestOnlyPreCustodyHost.advanceLineage` behavior.

The file-backed lineage adapter persists a pre-write root, H1, H2, current observation, observation time, sequence/predecessor, and store-pair identifiers. It is observation material only; controller and witness history remain authoritative.

## TEST_ONLY key custody

The first worker generates an ephemeral Ed25519 fixture authority key inside the authorized case directory, writes it to a non-repository file with owner-only mode where the platform supports it, and initializes the authority store. Replacement workers read that same fixture file inside their Host-side composition. The supervisor protocol and evidence never contain the key bytes or key path. Private fixture material must never enter evidence logs or commits. This is local test custody, not production secret management.

Validity windows and leases are relative inputs derived at case creation/command time. No historical fixture epoch is baked in, expiry checks remain enabled, and production-like code does not replace global `Date.now()`.

## Verification

Run only the bounded implementation tests (not a rehearsal):

```text
bun test pokemon-agents/rehearsal/host-runner01/runner.test.ts
```

U01-U12 cover distinct PID, adapter survival, deterministic R2a/R2b cuts, forced kill without graceful close, exit-before-restart, same stores, same-operation recovery, single-live-worker enforcement, raw-capability non-exposure, supervisor evidence survival, and no provider/network route.

This package does not run R1-R6, call CATFOOD, connect to providers, write Threads, create Human GO, deploy infrastructure, implement positive producer fencing, or authorize live/production activity.
