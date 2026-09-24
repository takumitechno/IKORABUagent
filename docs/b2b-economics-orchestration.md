# B2B economics orchestration

This package adds deterministic Mirinya and Sashihara employee producers plus a
Risa decision delivery boundary. It does not create schedules, call a model,
enable delivery, publish, merge, or apply a production migration.

## Schema preparation

After the normal backup and deployment approval process, an operator may apply
the text-ID migration explicitly:

```text
bun pokemon-agents/scripts/migrate-b2b-orchestration.ts --apply
```

The migration expands canonical employee packet types and creates the
append-only `notification_delivery_ledger`. It is never run automatically by a
server or scheduler.

## One-shot employees

Mirinya is dry-run unless `--apply` is present. The end date is exclusive.
With no connection fixture, Threads and Revenue remain explicitly disconnected.

```text
bun pokemon-agents/scripts/run-employee.ts --agent mirinya-cost-analyst --scope acct_takumi_hq --period 2026-09-01..2026-10-01
```

Sashihara accepts a local JSON file containing persisted run identities only:

```json
{"run_refs":["run:risa:example"],"as_of":"2026-09-24T05:00:00.000Z","max_age_minutes":1440}
```

```text
bun pokemon-agents/scripts/run-employee.ts --agent sashihara-orchestrator --scope acct_takumi_hq --input packet-refs.json --apply
```

The explicit bounded chain requires `--apply`, persists Hana, Risa, and
Sashihara packets with one correlation ID, and never invokes delivery:

```text
bun pokemon-agents/scripts/run-employee-chain.ts --scope acct_takumi_hq --input monitor-findings.json --apply
```

## Risa delivery

Delivery requires all of the following:

- a persisted Risa `send` or `escalate` decision;
- `IKORABU_NOTIFICATION_TRANSPORT_ENABLED=true`;
- a trusted local destination variable for the selected recipient;
- an explicit operator command with `--apply`.

```text
.claude/scripts/notify-discord.sh --decision-run run:risa:example --apply
```

Destination variables are `IKORABU_DISCORD_INTERNAL_OPS_WEBHOOK_URL` and
`IKORABU_DISCORD_HUMAN_CEO_WEBHOOK_URL`. URLs, message bodies, tokens, and PII
are never written to the delivery ledger. Delivery retries require another
explicit invocation and stop after three failed attempts.
