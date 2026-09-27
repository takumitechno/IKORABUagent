# CATFOOD operational boundary

This checkout does not provision an operational trust root, accepted build, credentials, signing keys, scheduler, tenant probe, or CATFOOD run.

Operational startup and independent operational verification are fail-closed with `OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE` and `OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE`. This repository has no protected host supervisor, authenticated IPC role-session issuer, or role-bound accepted-build launcher; filesystem roots and ACL checks are not treated as substitutes. The retained integration body still requires `bootstrap.json`, `threads.credential`, `accepted-consumer-manifest.sha256`, and `attestation-roots.json`, but it cannot run until an external authority supplies those missing boundaries.

`bootstrap.json` binds the authenticated producer actor, organization, account, source build, runtime paid/writer prohibitions, probe identity, GO root IDs, and attestation root IDs. Runtime caller input cannot replace those bindings. The operational attestation verifier takes no caller key or caller path; the caller-key verifier is TEST_ONLY.

Authority grants and renewals are capped at 120 seconds and additionally bounded by the observation window and Human GO expiry. Renewal records a durable local intent before the remote request and closes admission on an ambiguous result. Producer generation is preserved on renewal. Owner leases use the same bound and may be renewed only by the current authenticated owner without changing epoch.

No renewal cadence or maximum permitted gap is claimed here. Until protected operations policy supplies and supervises that schedule, operational readiness remains `POLICY_UNBOUND` and cannot be reported as PASS. Test-only accelerated clock runs are not operational evidence.

Safety stop, terminal reconciliation, and evidence sealing remain allowed after admission expiry. Late terminal results are retained, labeled outside-window, and receive no acceptance credit.

Corrective04 consumer behavior now validates the frozen producer's full cycle view (`mutated=false`), dry-run publisher variants, outcome success/unresolved/duplicate forms, producer-defined target JSON, and origin-specific duplicate lifecycles. ABORT, paid/provider abort, GO revocation, and CLOSED are reconstructed from the verified journal as sticky positive-finality causes. Repeated safety stop reconciles the current producer generation without reopening business execution, and aborted runs may seal only to a FAIL verdict.

The custodian and independent evaluator acquire and rederive evidence separately, then invoke one pure acceptance kernel. TEST_ONLY observation requires exact wall/monotonic agreement under `SAME_TEST_CLOCK`; it never becomes operational evidence. Journal and checkpoint verification remains a complete linear scan: the repository cannot safely enable a verified-prefix fast path until the missing protected sole-writer supervisor can prove immutable custody. No performance claim, real enrollment, rehearsal, CATFOOD run, or provider action is made by this candidate.
