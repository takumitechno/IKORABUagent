# CATFOOD operational boundary

This checkout does not provision an operational trust root, accepted build, credentials, signing keys, scheduler, tenant probe, or CATFOOD run.

Operational startup and independent operational verification are fail-closed with `OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE` and `OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE`. This repository has no protected host supervisor, authenticated IPC role-session issuer, or role-bound accepted-build launcher; filesystem roots and ACL checks are not treated as substitutes. The retained integration body still requires `bootstrap.json`, `threads.credential`, `accepted-consumer-manifest.sha256`, and `attestation-roots.json`, but it cannot run until an external authority supplies those missing boundaries.

`bootstrap.json` binds the authenticated producer actor, organization, account, source build, runtime paid/writer prohibitions, probe identity, GO root IDs, and attestation root IDs. Runtime caller input cannot replace those bindings. The operational attestation verifier takes no caller key or caller path; the caller-key verifier is TEST_ONLY.

Authority grants and renewals are capped at 120 seconds and additionally bounded by the observation window and Human GO expiry. Renewal records a durable local intent before the remote request and closes admission on an ambiguous result. Producer generation is preserved on renewal. Owner leases use the same bound and may be renewed only by the current authenticated owner without changing epoch.

No renewal cadence or maximum permitted gap is claimed here. Until protected operations policy supplies and supervises that schedule, operational readiness remains `POLICY_UNBOUND` and cannot be reported as PASS. Test-only accelerated clock runs are not operational evidence.

Safety stop, terminal reconciliation, and evidence sealing remain allowed after admission expiry. Late terminal results are retained, labeled outside-window, and receive no acceptance credit.

Corrective04 consumer behavior now validates the frozen producer's full cycle and disabled views, writer-canary result, dry-run publisher variants, outcome bridge success/unresolved/duplicate forms, direct evaluator result, outcome-runner result, producer-defined target JSON, and origin-specific duplicate lifecycles. Unknown variants remain fail-closed. Decoding a bounded producer variant does not grant acceptance credit: qualifying credit is deduplicated by the governed producer result identity and material outcome, so a fresh request that returns an existing editorial cycle cannot increase the meaningful-unit count.

Operational provenance has no public construction path in this checkout. Store initialization, hydrated custodians and evaluators, the operational source factory, and direct or reflective source construction all reject with the applicable enrollment-unavailable error before operational evidence can be emitted. TEST_ONLY construction remains available and the acceptance kernel cannot relabel its output as operational.

ABORT, paid/provider abort, GO revocation, and CLOSED are reconstructed from the verified journal as sticky positive-finality causes. Repeated safety stop reconciles the current producer generation without reopening business execution, and aborted runs may seal only to a FAIL verdict.

The custodian and independent evaluator acquire and rederive evidence separately, then invoke one pure acceptance kernel. TEST_ONLY observation requires exact wall/monotonic agreement under `SAME_TEST_CLOCK`; it never becomes operational evidence. Journal and checkpoint verification remains a complete linear scan: the repository cannot safely enable a verified-prefix fast path until the missing protected sole-writer supervisor can prove immutable custody. No performance claim, real enrollment, rehearsal, CATFOOD run, or provider action is made by this candidate.

Independent-audit classifications remain unchanged: supervisor enrollment and role-bound build enrollment are `CORRECT_PRE_REHEARSAL_PROVISIONING_GAP`; incremental verification H is `OPTIONAL_POST_ACCEPTANCE_OPTIMIZATION`; clock/post-response time is `PRE_REHEARSAL_CLOCK_METHOD_GAP`; and expired-permit pre-renew is `NONBLOCKING_REHEARSAL_GAP`.
# Corrective05 enrollment contract

Operational role construction now uses one fixed consumer protocol: `POST /v1/catfood/enrollment`, bounded to 256,000 response bytes and 2.5 seconds, with redirects and non-identity encodings rejected. The request carries a fresh challenge/request ID plus the protected session, process-start, boot, deployment, environment, audience, requested role, and scope. The response is a canonical JSON payload in an Ed25519 envelope signed for `IKORABU/WP3/CATFOOD/ROLE-ENROLLMENT/V1`.

The operational authority origin, bearer credential, issuer key and ID, audience, session/process binding, environment, and accepted consumer-manifest digest come only from the fixed protected file `${CATFOOD_OPERATIONAL_ROOT}/enrollment-binding.json`. Callers cannot provide an operational authority, root, endpoint, key, digest, or trust label. The verifier checks nonce/request echo, issuer, audience, subject/process/boot/deployment/environment, exact role/scope, issue/expiry/revocation, coherent enrollment revision, launch measurement, policy digest, accepted snapshot, and explicit measured/accepted mappings for source, custodian, evaluator, writer, and verifier.

Missing protected material is `UNPROVISIONED`; transport failure is `UNAVAILABLE`; malformed, forged, expired, revoked, replayed, cross-role, cross-environment, or build-mismatched evidence is invalid. Public operational boundaries continue to expose the existing `OPERATIONAL_SUPERVISOR_ENROLLMENT_UNAVAILABLE` or `OPERATIONAL_VERIFIER_ENROLLMENT_UNAVAILABLE` errors. There is no cached-success fallback. The test entrypoint accepts only loopback plus `TEST_ONLY` ancestry and uses the same request, parser, signature, session, and role-build checks; it cannot construct OPERATIONAL provenance.

Real deployment must provision the protected binding, an authenticated HTTPS issuer conforming exactly to [catfood-enrollment-v1.json](contracts/catfood-enrollment-v1.json), independently accepted role-build measurements, protected stores/credentials/roots, and the existing operational bootstrap. This repository creates none of those resources.
