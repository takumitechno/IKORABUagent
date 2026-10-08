# Web service recovery

Incident: 2026-10-08. UI port 5733 and the Cloudflared Windows service were healthy,
but Bridge port 8000 was absent. Customer login returned 401 because tenant identity
resolution could not reach the Bridge. Windows recorded an unexpected restart on
2026-10-04 at 15:24 JST. The Bridge had only been started manually, with no logon
trigger or process supervisor; it did not return after the restart.

The existing `IKORABU-Operator-UI` task now runs `scripts/supervise-operator-ui.ps1`.
Every 30 seconds it checks both local health endpoints and calls the existing
`start-agent-os.ps1` launcher only when a service is missing. The launcher retains
its port ownership checks. No extra task or publication scheduler is installed.
Bridge tenant flags come from the same dashboard task environment, avoiding the
old Windows User defaults (`global=false`, `canary=true`).

The task retains its logon trigger, gains one-minute repetition for an unexpected
supervisor exit, and retains one-minute failure retries. Its environment keeps
the current email/account allowlist, Cloudflare authentication and scheduler OFF.
Cloudflared already has automatic startup and service failure recovery.

Install with `scripts/restart-operator-ui-task.ps1 -EnableSupervisor`; it preserves
the task's encoded authentication environment. Use `scripts/restart-operator-ui-task.ps1`
for subsequent UI maintenance. It is the only task
restart entry point; never change Threads publication tasks. The supervisor writes
startup and recovery events to `.runtime/logs/web-services-supervisor.log`; service
output remains in `.runtime/logs/bridge.*.log` and `dashboard.*.log`.

Check: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/test-web-services-supervisor.ps1`.
Deployment verification includes terminating the exact Bridge listener and then
the exact dashboard listener separately, confirming automatic recovery, identity
resolution, two-account visibility, and unauthorized-account rejection.

Verified on 2026-10-08: Bridge recovered in 29.4 seconds and UI in 23.7 seconds.
Customer `/`, `/operator` and the workspace API returned 200 with the trusted
local diagnostic identity. Both authorized accounts remained visible; unauthorized
and cross-tenant reads returned 403. The production DB SHA-256 was identical before
and after the recovery tests. Thirty launcher/customer authorization tests passed,
along with the supervisor's no-op, recovery, failure and timeout checks.
The public hosts return the existing Cloudflare Access login redirect; the current
browser session is expired, so authenticated external content still requires login.

Hosting still runs on this PC: services return after Windows user logon; shutdown,
sleep or loss of internet interrupts availability. Cloudflare Access can also ask
for a new login when its existing session expires.
