# Deterministic employee runner (B1)

B1 enables only the one-shot, zero-provider-cost Hana and Risa contracts. The
command is dry-run by default and never registers a schedule, invokes Claude,
chains another employee, or sends a notification.

The internal HQ scope is deliberately not registered by migrations or startup.
After migration approval, an operator may register it explicitly with the
existing ORG04C control:

```text
bun pokemon-agents/scripts/register-threads-activity-source.ts register-account --account acct_takumi_hq --authority-ref source:operator:hq --apply
```

Run a fixture or prepared monitor packet without writing:

```text
bun pokemon-agents/scripts/run-employee.ts --agent hana-heartbeat --scope acct_takumi_hq --input monitor.json
```

Add `--apply` only after the account is registered and the employee-run-packet
migration has been applied through the reviewed migration procedure. Risa takes
a `risa-input.v1` packet containing a validated `hana-output.v1` packet. It
records a decision only; notification transport is outside this command.
