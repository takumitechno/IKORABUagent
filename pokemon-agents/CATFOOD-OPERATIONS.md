# CATFOOD operational boundary

This checkout does not provision an operational trust root, accepted build, credentials, signing keys, scheduler, tenant probe, or CATFOOD run.

Operational startup is fail-closed. It requires the protected root to contain `bootstrap.json`, `threads.credential`, `accepted-consumer-manifest.sha256`, and `attestation-roots.json`. The root, its parents, and each file must pass the platform ownership and write-access checks. The accepted manifest digest must be installed outside the candidate checkout and must match the consumer manifest bytes.

`bootstrap.json` binds the authenticated producer actor, organization, account, source build, runtime paid/writer prohibitions, probe identity, GO root IDs, and attestation root IDs. Runtime caller input cannot replace those bindings. The operational attestation verifier takes no caller key or caller path; the caller-key verifier is TEST_ONLY.

Authority grants and renewals are capped at 120 seconds and additionally bounded by the observation window and Human GO expiry. Renewal records a durable local intent before the remote request and closes admission on an ambiguous result. Producer generation is preserved on renewal. Owner leases use the same bound and may be renewed only by the current authenticated owner without changing epoch.

No renewal cadence or maximum permitted gap is claimed here. Until protected operations policy supplies and supervises that schedule, operational readiness remains `POLICY_UNBOUND` and cannot be reported as PASS. Test-only accelerated clock runs are not operational evidence.

Safety stop, terminal reconciliation, and evidence sealing remain allowed after admission expiry. Late terminal results are retained, labeled outside-window, and receive no acceptance credit.
