# CATFOOD harness v1

This package is machinery for a future, separately authorized CATFOOD run. It
does not schedule work and has no command that performs a CATFOOD run.

The harness is default-OFF. Future authority preflight accepts only the exact
value `CATFOOD_HARNESS_ENABLED=1`, together with
`FEATURE_MULTI_TENANT_AUTH=1`. Tests and store initialization do not enable
either flag.

## Stores

The evidence and attestation databases are separate, explicit, pre-existing
SQLite files. Neither is auto-created, regenerated, or placed in the demo DB.

```console
bun pokemon-agents/scripts/catfood-store.ts init-evidence <evidence.db>
bun pokemon-agents/scripts/catfood-store.ts init-evidence <evidence.db> --apply
bun pokemon-agents/scripts/catfood-store.ts init-attestation <attestation.db> --apply
```

The first command is a no-write preview. `--apply` is required for isolated
schema initialization. The normal harness library has no API for writing an
acceptance attestation.

## Frozen boundary verification

The consumer pins the accepted Threads SHA, release digest, Operational
Boundary artifact digest, WP1 contract digest, v30 schema, capability list,
and all eleven fixture byte digests. Strict validation rejects extra, missing,
future, malformed, or unrecognized fields and recomputes `canonical_sha256`.

Run the fixture test against the accepted read-only Threads checkout:

```console
THREADS_FROZEN_REPO=<accepted-threads-checkout> \
  bun test pokemon-agents/tests/catfood-harness.test.ts
```

## Lifecycle and acceptance

Lifecycle events and acceptance are separate. Closing an evidence bundle does
not make it pass. The independent evaluator reads the immutable bundle from a
read-only evidence connection and writes only to the separate attestation DB:

```console
bun pokemon-agents/scripts/catfood-attest.ts \
  --evidence-db <evidence.db> \
  --attestation-db <attestation.db> \
  --run-id <run-id> \
  --evaluator <independent-identity>
```

The initial policy keeps NIGHT as `UNEXERCISED_EXCLUDED`, paid/provider work
forbidden, activity coverage unchanged, and requires three meaningful terminal
units across two work classes plus a planned restart and final safe stop.
