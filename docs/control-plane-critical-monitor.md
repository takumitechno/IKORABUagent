# Control Plane CRITICAL monitor

`scripts/control-plane-critical-monitor.py` performs read-only checks for NIGHT
misses, backups older than 26 hours, tenant denial anomalies, OAuth readiness,
Bridge/Dashboard health, and a stale listener on legacy port 5735.

Run without `--notify` to inspect JSON only. Add `--notify` to reuse
`.claude/scripts/notify-discord.sh`. The notifier accepts only HTTP 2xx as
success, aggregates messages to at most 1900 characters, suppresses duplicate
alerts for six hours, and sends one recovery notification after an active
alert. Missing webhook configuration is an explicit error, never a false
success. State is stored under ignored `.runtime/alerts/` and contains only a
dedupe key, state, and timestamp.

The launcher reports a 5735 listener as CRITICAL with its PID and exits
non-zero in status mode. It never stops that process automatically.
