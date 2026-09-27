# CATFOOD trust corrective architecture

Status: consumer implementation and synthetic verification only. Producer acceptance does not authorize a CATFOOD run, and operational prerequisites remain blocked.

## Frozen dependency set

The consumer accepts one indivisible Threads dependency set: commit `875e75fce20c16c6157b5aa42f759411c52e95fe`, release `04cebd1f97928be56666e6dc82030da44aede7d5f9cb9c2efa5a40e027490e0c`, WP1 `14ed73d33a02b3f8877a3045d226f23b7d9e7686f9dc2c8ef595aeae934fa3dc`, Operational Boundary v1 `57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf`, COE v1 `50b6df97abc73384063a02cd69a7872b829d264177cad11d304678c04057db0e`, rehearsal contract `dbcd6da118b41d53e86747927f562037545ad617958c90abbee9577662df0b5b`, emitter inventory `fa3ba3589c64f3116577c977f3946be618497ccf5976a109d0591edb7e6e7b1f`, schema v33, and fingerprint `79e3bc10353b8a7859abf4e71ea04bf9ad6485e842275f7cf1237c223d65cc10`.

`CATFOOD_THREADS_DEPENDENCY_ROOT` canonically hashes those nine values. Run-spec construction, trust-store initialization, LIVE acquisition, CLOSED verification, checkpoints, and attestations bind the fixed values or their root. The IKORABU consumer identity remains separate and must be supplied by the eventual approved build and GO.

## Evidence phases

`LIVE_ADMISSION` requests a current, bounded 120-second observation ending at trusted now. It independently checks COE, Operational Boundary, runtime enforcement, GO/lease/epoch/generation, and a principal-bound own/known-foreign tenant probe before positive action. It never asks the producer to prove the future 24-hour run.

`CLOSED_RUN` requests `HISTORICAL` evidence for the immutable `[s,e)` 24-hour window only after `e` and safe quiescence. Exact producer acquisition pages are retained as canonical bytes in the append-only source journal, addressed by SHA-256 and anchored by the external checkpoint. Final boundaries, claims, governed-work decisions, probe receipts, pins, and source references are sealed with them. Both evaluators use only that retained archive; later wall time, runtime restarts, and unrelated rows do not trigger LIVE reads or change the acceptance core.

## Work, window, and boundary rules

Only the exhaustive governed-work decision can grant credit. Successful authoritative joins can be `CREDIT`; duplicate/replay/preclaim rejection are zero-credit; unresolved or missing evidence is `BLOCKED`; identity/result/generation contradictions and terminal failed governed attempts are run failures. Both evaluators consume the same decision for credit and verdict while retaining independent read-only journal/checkpoint verification.

Admission and authoritative admission/completion timestamps must be inside `[s,e)`. Start is bound to the approved window, no work is admitted at or after `e`, and close occurs at or after `e` after safety-only stop/reconciliation. Stop remains available after GO/lease/window expiry. Boundary predicates are operation-specific: PREPARE accepts known safe pre-authority state, ADMIT requires exact active permit/generation with no applicable stop, and FINAL requires inhibited authority with zero in-flight work.

## Interoperability and operational block

The concrete HTTP adapter implements the accepted COE GET, Boundary GET, authority POST, outcome-evaluation POST, and bound own/foreign Boundary probe with fixed origin/auth, no redirects, bounded time/body/page/record limits, duplicate-key rejection, exact error handling, and no blind retry after ambiguous mutation.

`PRE_REHEARSAL_CONTRACT_GAP`: the accepted Bridge still has no single supported operational API that supplies the full three-capability source inventory and authoritative completed-claim reads required by the synchronous custodian for editorial cycle and publish dry-run. Historical COE plus protected retention is sufficient for later verification, but it does not itself provide the pre-dispatch intent adapter for those two capabilities. No direct database bypass or invented endpoint is used. Operational CATFOOD remains blocked until an accepted composition can demonstrate those bindings.

## Secret, attestation, and separation rules

COE decoding is schema-aware. Exact producer labels such as `graph.threads.net/access_token`, `anthropic-api-key`, and `BRIDGE_API_KEY_MISSING` are metadata, while duplicate JSON keys, credential containers, bearer values, private keys, secret-bearing URLs, and unknown fields are rejected before persistence. Original accepted COE bytes are retained; display summaries are separate.

Attestations derive coverage from evaluation, bind the dependency root and retained source digest, and distinguish `TEST_ONLY` from `OPERATIONAL` trust domains. The operational verifier rejects TEST_ONLY PASS. Custodian, read-only evaluator, and attestation writer/store remain separate. No production keys, GO, probe, provider call, rehearsal, or CATFOOD action is included here.

## Historical documents

`docs/catfood-harness01.md` and earlier references to Threads `f15c923`, schema v30/v32, or the pre-COE contract-gap analysis are historical provenance only. This document supersedes them for the operative WP3 consumer design; they do not supply runtime pins.
