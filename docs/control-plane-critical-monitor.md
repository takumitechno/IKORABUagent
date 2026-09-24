# Control Plane CRITICAL monitor

`scripts/control-plane-critical-monitor.py` performs read-only checks for NIGHT
misses over a bounded 96-hour lookback, backups older than 26 hours, tenant denial anomalies, OAuth readiness
and expiry, runner freshness, Bridge/Dashboard health, and a stale listener on
legacy port 5735. Cancelled NIGHT work is counted separately from a real miss.
OAuth checks use the Bridge's secret-free `/operator/readiness/accounts/{id}`
view; no token or secret reference is read or persisted.

The JSON also contains a bounded `monitor-findings.v1` packet for Hana with
Insights, Editorial, activity-projection, and Windows Task Scheduler freshness
evidence. The caller must pass both the intended employee scope and, for live
collection, the Bridge account explicitly; the monitor has no customer-account
default:

Missing runner-freshness fields fail closed as unavailable. They cannot produce
a healthy digest, and are distinct from present-but-stale evidence. Individual
heartbeat rows use a monitor-owned 120-minute ceiling; empty, invalid, or future
heartbeat evidence is unavailable rather than healthy.

`--all-accounts` discovery failures and zero-active-account responses also emit
bounded system alerts and deterministic JSON instead of terminating before the
normal alert and optional notification path.

External dependency F4 remains open: the Threads Bridge must expose the live
freshness evidence before the monitor can verify it. This IKORABU pass does not
change Threads while NIGHT-DOOR01 owns that repository's WRITE lane.

```text
python scripts/control-plane-critical-monitor.py --scope acct_takumi_hq --account-id <bridge-account>
python scripts/control-plane-critical-monitor.py --scope acct_takumi_hq --all-accounts
```

This remains read-only. It does not run Hana, register or change a scheduled
task, rerun a job, restart a service, or send anything unless the existing
operator-controlled `--notify` transport flag is separately supplied.

Output includes an account-sorted `attention-digest.v1`; no model/provider is
called. Alerts are deduplicated by exact `code + entity`, so one account or
NIGHT item cannot suppress another account's alert.

Run without `--notify` to inspect JSON only. Notification requires both the
explicit `--notify` option and `IKORABU_NOTIFICATION_TRANSPORT_ENABLED=true`.
`.claude/scripts/notify-discord.sh` accepts only HTTP 2xx as success, limits
messages to 1900 characters, suppresses duplicate code/entity alerts for six
hours, and emits one recovery after an active alert. Missing configuration is
an explicit error, never a false success. State under ignored
`.runtime/alerts/` contains only a hashed entity key, state, and timestamp.

Legacy `daily-report` Claude summarization is also off by default. Set
`IKORABU_DAILY_REPORT_LLM_ENABLED=true` only for an explicit paid run; routine
reports use the deterministic aggregation path and cost zero.

The launcher reports a 5735 listener as CRITICAL with its PID and exits
non-zero in status mode. It never stops that process automatically.
