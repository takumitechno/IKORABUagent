# CATFOOD trust corrective architecture

Status: implementation and deterministic test fixture only. This document does not authorize or report a real CATFOOD run.

## Frozen identities

- Failed predecessor: `0340e11d8f6ae2014dd6e0f4a05133b00b02ffe7`
- Accepted IKORABU base: `e2db047385ef3262786cc009c3c50d87a06dcde8`
- Threads: `f15c9235ddd62c003b8105c2a640d81defa4fb83`
- WP1 contract: `14ed73d33a02b3f8877a3045d226f23b7d9e7686f9dc2c8ef595aeae934fa3dc`
- Operational Boundary v1: `57d896aa756387048b70dc016e482274d571dd165866416e3fc480d59a97e8cf`
- Threads release: `799344a0a0d4a42ca160e5199d4910f7e6227836b17b9ff9a2b3a90202394d98`
- Threads schema: v30

## Read-only source binding

The frozen Threads checkout binds authority and generation to `threads_autopilot/production/safety.py`: `change_execution_authority` and `claim_governed_mutation` serialize with `BEGIN IMMEDIATE`; migration 0030 owns `execution_authorities` and governed `capability_requests`; revocation advances generation and installs the capability stop atomically. `bridge/operational_boundary.py` exposes boundary reads and authority changes.

The real capability mappings are:

| Capability | Authoritative source | Meaningful terminal result |
|---|---|---|
| `editorial.cycle` | `threads_autopilot/production/editorial.py`; governed request plus editorial domain row | `claim_status=succeeded`, transport `SUCCEEDED`, domain `state=DRAFT,status=READY` |
| `editorial.outcome_evaluation` | `threads_autopilot/production/outcome_runner.py`; governed request plus outcome record | `claim_status=succeeded`, transport `SUCCEEDED`, domain `state=COMPLETED,status=RECORDED,recorded=true`, verdict `SUCCESS`, `FAILURE`, or `INVALID_EXPERIMENT` |
| `threads.publish.dry_run` | `/autopilot/v2/publish`; governed request plus publication response | `claim_status=succeeded`, transport `SUCCEEDED`, domain `status=succeeded,mode=dry_run,duplicate=false` |

Semantic credit is keyed by capability, authoritative business identity, and material revision. Request IDs, run IDs, retry counts, time, and epoch do not create fresh credit.

## Contract gaps

The frozen Threads contract does not expose all evidence needed by an operational WP3 adapter:

1. completed governed claim/request reads are not exposed by Bridge;
2. outcome evaluation has no Bridge mutation route;
3. effective `FEATURE_MULTI_TENANT_AUTH` state is not exposed as authoritative runtime evidence;
4. complete relevant provider non-use coverage is not exposed.

Therefore the operational path is `CONTRACT_GAP` and cannot mint a preflight receipt, grant authority, evaluate PASS, or attest PASS. Threads is not modified to compensate. The deterministic source is explicitly `TEST_ONLY`.

## Trust and evidence path

An Ed25519 Human GO is canonical, exact-field, key-pinned, single-run, single-consumption, revocable, and bound to scope, capabilities, release pins, zero paid/provider allowance, the fixed policy digest, and maximum epoch. The private GO key is not part of the runner API.

The protected custodian assigns owner sessions, lease, epoch, trusted observation time, journal sequence, and row hashes. Ownership, lease, lifecycle, GO, epoch, and authority binding checks occur under one immediate write transaction. Positive work is admitted only from authoritative inventory and only against the current Threads authority/generation. Safety stop and reconciliation remain available after GO or lease expiry.

Every source-journal append is followed by a create-only checkpoint in a separate store before acknowledgement. A checkpoint failure latches `UNANCHORED`, closes admission, and blocks PASS. Startup verifies schema identity, required indexes and triggers, SQLite safety settings, integrity, trust configuration, journal hashes, checkpoint links, checkpoint high water, and frozen pins.

The independent evaluator opens the evidence and checkpoint stores read-only, re-reads authoritative claims and final runtime/boundary evidence, re-verifies every admitted action against the signed GO window, and applies the fixed 24-hour/3-unit/2-class/restart policy. The closed bundle is only a cache and is compared with the independently re-derived bundle.

The attestation writer has no verdict or evaluator-identity input. Its store pins writer identity, evaluator digest, policy digest, and a separate Ed25519 public key. It runs the pinned evaluator, binds the actual verdict and source identities, signs a domain-separated payload, and inserts a create-only record. Test keys and `test_only=true` attestations are never operational trust roots.

## Separation status

Logical separation is implemented between custodian, read-only evaluator, and attestation writer/store. Same-user local tests do not prove deployment isolation. Runner denial of protected DB/WAL/SHM directories, trust configuration, evaluator artifact, private keys, and attestation store is `REHEARSAL_REQUIRED` in a production-shaped environment.

Default production scheduler, notifications, writer, paid generation, provider activity, and live publication remain off. NIGHT is `UNEXERCISED_EXCLUDED`.
