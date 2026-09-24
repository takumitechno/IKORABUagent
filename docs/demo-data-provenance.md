# Demo data provenance

Six operational tables use an explicit `data_origin`: `hypotheses`, `improvements`, `approvals`, `agent_costs`, `agent_schedules`, and `daily_reports`.

- `production`: created by a canonical runtime writer and eligible for production status, KPI, alert, decision, and cost read models.
- `demo`: created by the demo seed and eligible only for an explicitly demo-scoped view.
- `legacy_unknown`: predates trustworthy provenance. It is neither production nor demo and is excluded from operational read models.

The database default is deliberately `legacy_unknown`. New runtime and demo writers must always supply their origin. The additive migration never inspects titles, text, names, cron expressions, costs, or timestamps and performs no historical classification.

## Safe rollout

Run tests and take an independently verified database backup before the migration script is invoked with its explicit `--apply` flag. This task does not apply that migration to production.

Demo databases should be regenerated from source seeds. Demo clearing deletes only rows whose `data_origin='demo'`; unclassified and production rows survive.

The dashboard's embedded scheduler is fail-closed: it starts only when `POKEMON_AGENTS_SCHEDULER=on` exactly. A missing value, `off`, or any other value keeps it disabled. Schedule rows never opt the process into scheduler startup, and the scheduler reads only `production` schedules after explicit opt-in.

If historical rows later need classification, use a separate operator-reviewed command that accepts an explicit table, row ID, and target origin, records an audit trail, and fails unless the row is still `legacy_unknown`. Do not bulk-infer provenance from row contents.
