# CATFOOD trust corrective architecture

Status: `IMPLEMENTATION_COMPLETE_PENDING_AUDIT` for the consumer corrective; synthetic/local verification only. Producer acceptance does not authorize a CATFOOD run, and operational prerequisites remain blocked.

## Frozen dependency set

The consumer accepts one indivisible Threads dependency set: commit `875e75fce20c16c6157b5aa42f759411c52e95fe`, release `04cebd1f97928be56666e6dc82030da44aede7d5f9cb9c2efa5a40e027490e0c`, WP1 `14ed73d33a02b3f8877a3045d226f23b7d9e7686f9dc2c8ef595aeae934fa3dc`, Operational Boundary v1 `57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf`, COE v1 `50b6df97abc73384063a02cd69a7872b829d264177cad11d304678c04057db0e`, rehearsal contract `dbcd6da118b41d53e86747927f562037545ad617958c90abbee9577662df0b5b`, emitter inventory `fa3ba3589c64f3116577c977f3946be618497ccf5976a109d0591edb7e6e7b1f`, schema v33, and fingerprint `79e3bc10353b8a7859abf4e71ea04bf9ad6485e842275f7cf1237c223d65cc10`.

`CATFOOD_THREADS_DEPENDENCY_ROOT` canonically hashes those nine values. Run-spec construction, trust-store initialization, LIVE acquisition, CLOSED verification, checkpoints, and attestations bind the fixed values or their root. The IKORABU consumer identity remains separate and must be supplied by the eventual approved build and GO.

## Evidence phases

`LIVE_ADMISSION` requests a current, bounded 120-second observation ending at trusted now. It independently checks COE, Operational Boundary, runtime enforcement, GO/lease/epoch/generation, and a principal-bound own/known-foreign tenant probe before positive action. It never asks the producer to prove the future 24-hour run.

`CLOSED_RUN` requests `HISTORICAL` evidence for the immutable `[s,e)` 24-hour window only after `e` and safe quiescence. Authenticated decoded response bytes, byte length/digest, identity transfer encoding, safe transport provenance, parsed pages, producer record-set root, and the versioned local acquisition digest remain separate identities in the append-only source journal. Older archives are explicitly `CONSUMER_RESERIALIZED`; raw bytes are never reconstructed retroactively. Final boundaries, claims, governed-work decisions, probe receipts, pins, and source references are sealed with them. Both evaluators use only that retained archive; later wall time, runtime restarts, and unrelated rows do not trigger LIVE reads or change the acceptance core.

## Work, window, and boundary rules

Only the exhaustive governed-work decision can grant credit. Attempts are namespaced by producer store incarnation and attempt ID, ordered by `lifecycle_revision`, and folded without assuming contiguous revisions or arrival order. Successful authoritative joins can be `CREDIT`; duplicate/replay/preclaim rejection are zero-credit; unresolved or missing evidence is `BLOCKED`; identity/result/generation contradictions and terminal failed governed attempts are run failures. Account-scoped `org=null` remains raw and qualifies only with the matching protected invocation receipt. Both evaluators consume the same decision for credit and verdict while retaining independent read-only journal/checkpoint verification.

Admission and authoritative domain completion timestamps must be inside `[s,e)`. There is no equality requirement at `s`; pre-arm is observation-only and issues no authority or dispatch. The frozen operational materials specify no cadence or maximum gap, so operational observation remains `POLICY_UNBOUND`; explicit synthetic cadence is TEST_ONLY and creates no operational default. No work is admitted at or after `e`, and close occurs at or after `e` after safety-only stop/reconciliation. Stop remains available after GO/lease/window expiry. Observation under a stop records `PREPARATION_OBSERVED` plus `ADMISSION_BLOCKED`, never `PREFLIGHT_PASSED`. Boundary predicates are operation-specific: PREPARE accepts known safe pre-authority fencing, ADMIT requires exact active permit/generation with no applicable stop, and FINAL requires inhibited authority with zero in-flight work.

## Interoperability and operational block

The concrete `OperationalThreadsEvidenceSource` composes the accepted COE GET, Boundary GET, authority POST, outcome-evaluation POST, editorial run-once POST, dry-run publish POST, and bound own/foreign Boundary probe. Completed claims are read by folding a fresh full COE acquisition; no direct producer database or invented claim endpoint is used. Stable dispatch intent is journaled and externally anchored before mutation. A possibly submitted timeout/reset/truncated or malformed success is `MUTATION_OUTCOME_AMBIGUOUS` and is never retried under a new key.

The previous producer-gap statement is superseded. The actual finding was `IKORABU_COMPOSITION_GAP`; the accepted producer routes and COE are sufficient when composed as above. Operational CATFOOD nevertheless remains `BLOCKED`: the fixed no-argument bootstrap at the OS-protected CATFOOD root requires safe ownership/ACLs, a separately protected accepted consumer-manifest digest, provisioned credential/principal, GO and independent-attestation root IDs, real probe definitions, accepted intents, protected stores, and a bound system clock. None are enrolled here. Fixture source/clock injection remains TEST_ONLY, and relabeling cannot satisfy the protected provenance check.

## Secret, attestation, and separation rules

COE decoding is schema-aware and bounded by UTF-8 bytes, depth, node count, pages, rows, and acquisition bytes. Exact producer labels such as `graph.threads.net/access_token`, `anthropic-api-key`, and `BRIDGE_API_KEY_MISSING` are metadata, while duplicate JSON keys, credential containers, bearer/private-key/PAT/Slack/AWS/JWT forms, encoded webhook or credential URLs, and unknown fixed fields are rejected with static diagnostics before persistence. Producer hashes use the frozen Python ordering/escaping semantics rather than locale collation; independently generated mixed-case, digit, Unicode/non-BMP, escaping, array/null, number, and record-order vectors are committed.

No IKORABU schema migration is required. Exact response bodies and provenance are bounded JSON/base64 fields inside the existing append-only journal payload; dispatch intent, observation arm, preparation result, and ambiguity are additional journal event types. Existing store/checkpoint immutability and high-water anchoring therefore remain the sufficient storage boundary.

Attestations derive coverage from evaluation, bind the dependency root and retained source digest, and distinguish `TEST_ONLY` from `OPERATIONAL` trust domains. The operational verifier rejects TEST_ONLY PASS. Custodian, read-only evaluator, and attestation writer/store remain separate. No production keys, GO, probe, provider call, rehearsal, or CATFOOD action is included here.

## Historical documents

`docs/catfood-harness01.md` and earlier references to Threads `f15c923`, schema v30/v32, or the pre-COE contract-gap analysis are historical provenance only. This document supersedes them for the operative WP3 consumer design; they do not supply runtime pins.
