# Control Plane CRITICAL monitor

`scripts/control-plane-critical-monitor.py` performs read-only checks for NIGHT
misses, backups older than 26 hours, tenant denial anomalies, OAuth readiness,
Bridge/Dashboard health, and a stale listener on legacy port 5735.

The JSON also contains a bounded `monitor-findings.v1` packet for Hana with
Insights, Editorial, activity-projection, and Windows Task Scheduler freshness
evidence. The caller must pass both the intended employee scope and, for live
collection, the Bridge account explicitly; the monitor has no customer-account
default:

```text
python scripts/control-plane-critical-monitor.py --scope acct_takumi_hq --account-id <bridge-account>
```

This remains read-only. It does not run Hana, register or change a scheduled
task, rerun a job, restart a service, or send anything unless the existing
operator-controlled `--notify` transport flag is separately supplied.

Run without `--notify` to inspect JSON only. Add `--notify` to reuse
`.claude/scripts/notify-discord.sh`. The notifier accepts only HTTP 2xx as
success, aggregates messages to at most 1900 characters, suppresses duplicate
alerts for six hours, and sends one recovery notification after an active
alert. Missing webhook configuration is an explicit error, never a false
success. State is stored under ignored `.runtime/alerts/` and contains only a
dedupe key, state, and timestamp.

The launcher reports a 5735 listener as CRITICAL with its PID and exits
non-zero in status mode. It never stops that process automatically.
