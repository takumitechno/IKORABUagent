#!/usr/bin/env python3
"""Read-only CRITICAL checks for the local Threads control plane."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sqlite3
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


MAX_MESSAGE_CHARS = 1900
NIGHT_STALE_MINUTES = 20
BACKUP_STALE_HOURS = 26
NIGHT_MISS_LOOKBACK_HOURS = 96
DENIAL_WINDOW_MINUTES = 10
DENIAL_SPIKE_THRESHOLD = 5
OAUTH_EXPIRY_WARNING_HOURS = 72
FRESHNESS = {
    "insights_freshness": (180, 360),
    "editorial_freshness": (180, 360),
    "activity_projection_freshness": (30, 120),
}

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def parse_time(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except ValueError:
        return None


def user_environment(name: str) -> str:
    value = os.environ.get(name, "")
    if value or os.name != "nt":
        return value
    try:
        import winreg  # type: ignore[import-not-found]
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as key:
            value, _ = winreg.QueryValueEx(key, name)
            return str(value)
    except (OSError, ImportError):
        return ""


def request_json(url: str, headers: dict[str, str]) -> tuple[bool, Any]:
    request = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=4) as response:
            if not 200 <= response.status < 300:
                return False, {"status": response.status}
            return True, json.loads(response.read().decode("utf-8"))
    except (OSError, ValueError, urllib.error.HTTPError) as exc:
        status = getattr(exc, "code", None)
        return False, {"status": status or "unreachable"}


def listener_pid(port: int) -> int | None:
    if os.name != "nt":
        return None
    command = (
        "$c=Get-NetTCPConnection -State Listen -LocalPort %d "
        "-ErrorAction SilentlyContinue | Select-Object -First 1;"
        "if($c){[Console]::Out.Write($c.OwningProcess)}" % port
    )
    try:
        result = subprocess.run(
            ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", command],
            capture_output=True, text=True, timeout=5, check=False,
        )
        return int(result.stdout.strip()) if result.returncode == 0 and result.stdout.strip() else None
    except (OSError, ValueError, subprocess.TimeoutExpired):
        return None


def scheduled_task_state(name: str) -> tuple[bool, str | None]:
    """Read-only Windows Task Scheduler evidence; never registers or changes a task."""
    if os.name != "nt":
        return False, None
    safe_name = name.replace("'", "''")
    command = (
        f"$t=Get-ScheduledTask -TaskName '{safe_name}' -ErrorAction SilentlyContinue;"
        "if($t){[Console]::Out.Write($t.State)}"
    )
    try:
        result = subprocess.run(
            ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", command],
            capture_output=True, text=True, timeout=5, check=False,
        )
        state = result.stdout.strip()
        return bool(state), state or None
    except (OSError, subprocess.TimeoutExpired):
        return False, None


def latest_backup_status(directory: Path, now: datetime) -> tuple[float | None, bool]:
    try:
        files = [p for p in directory.glob("*.db") if p.is_file() and p.stat().st_size > 0]
    except OSError:
        return None, False
    if not files:
        return None, False
    latest = max(files, key=lambda p: p.stat().st_mtime)
    modified = datetime.fromtimestamp(latest.stat().st_mtime, timezone.utc)
    age = max(0.0, (now.astimezone(timezone.utc) - modified).total_seconds() / 3600)
    try:
        uri = latest.resolve().as_uri() + "?mode=ro&immutable=1"
        connection = sqlite3.connect(uri, uri=True)
        try:
            valid = connection.execute("PRAGMA quick_check").fetchone()[0] == "ok"
        finally:
            connection.close()
    except (OSError, sqlite3.Error):
        valid = False
    return age, valid


def collect_snapshots(args: argparse.Namespace, now: datetime) -> list[dict[str, Any]]:
    api_key = user_environment("AUTOPILOT_BRIDGE_API_KEY")
    headers = {"Accept": "application/json", "X-Threads-User-ID": args.tenant_user_id}
    if api_key:
        headers["X-API-Key"] = api_key
    bridge_ok, bridge_health = request_json(f"{args.bridge_url}/health", {})
    dashboard_ok, dashboard_health = request_json(f"{args.dashboard_url}/health", {})
    canary_ok, canary = request_json(f"{args.bridge_url}/operator/tenant-canary", headers)
    backup_age, backup_valid = latest_backup_status(Path(args.backup_dir), now)
    scheduler_registered, scheduler_state = scheduled_task_state(args.scheduler_task_name)
    bridge_health = bridge_health if isinstance(bridge_health, dict) else {}
    dashboard_health = dashboard_health if isinstance(dashboard_health, dict) else {}
    canary = canary if isinstance(canary, dict) else {}
    common = {
        "observed_at": now.isoformat(),
        "bridge_healthy": bridge_ok and bridge_health.get("status") == "ok",
        "dashboard_healthy": dashboard_ok and dashboard_health.get("status") == "ok",
        "scheduler_registered": scheduler_registered,
        "scheduler_state": scheduler_state,
        "canary_available": canary_ok,
        "tenant_canary": canary if canary_ok else {},
        "backup_age_hours": backup_age,
        "backup_valid": backup_valid,
        "legacy_5735_pid": listener_pid(args.legacy_port),
    }
    account_ids = sorted(set(args.account_id or []))
    if args.all_accounts:
        accounts_ok, accounts = request_json(f"{args.bridge_url}/operator/accounts", headers)
        if accounts_ok and isinstance(accounts, dict):
            account_ids.extend(
                row["account_id"] for row in accounts.get("accounts", [])
                if isinstance(row, dict) and isinstance(row.get("account_id"), str)
                and row.get("account_status") == "active"
            )
            account_ids = sorted(set(account_ids))
    snapshots: list[dict[str, Any]] = []
    for account_id in account_ids:
        account_ok, account = request_json(
            f"{args.bridge_url}/operator/accounts/{account_id}", headers)
        credential_ok, live_readiness = request_json(
            f"{args.bridge_url}/operator/readiness/accounts/{account_id}", headers)
        account = account if account_ok and isinstance(account, dict) else {}
        live_readiness = live_readiness if credential_ok and isinstance(live_readiness, dict) else {}
        operations = account.get("operations", {})
        operations = operations if isinstance(operations, dict) else {}
        features = operations.get("features", {})
        features = features if isinstance(features, dict) else {}
        readiness = account.get("readiness", {})
        readiness = readiness if isinstance(readiness, dict) else {}
        snapshots.append({
            **common,
            "account_id": account_id,
            "account_available": bool(account_ok and account),
            "night_items": operations.get("night_batch_items", []),
            "readiness": readiness,
            "credential_readiness_available": bool(credential_ok and live_readiness),
            "credential_readiness": live_readiness.get("credential_readiness", {}),
            "self_reply_sync": features.get("self_reply_sync"),
            "insights_age_minutes": operations.get("insights_age_minutes"),
            "editorial_age_minutes": operations.get("editorial_age_minutes"),
            "activity_projection_age_minutes": operations.get("activity_projection_age_minutes"),
            "runner_heartbeats": operations.get("runner_heartbeats"),
        })
    return snapshots


def structured_findings(snapshot: dict[str, Any], scope: str, now: datetime) -> dict[str, Any]:
    """Produce the bounded, code-only input contract consumed by Hana."""
    findings: list[dict[str, Any]] = []
    account_id = str(snapshot.get("account_id") or "unknown")

    def add(code: str, observed: str, age: float | None, tolerance: int,
            delayed: int, evidence: str, block: str | None = None) -> None:
        findings.append({
            "check_code": code, "observed": observed, "age_minutes": age,
            "tolerance_minutes": tolerance, "delayed_window_minutes": delayed,
            "block_reason": block, "evidence_ref": evidence,
        })

    add("bridge_health", "present" if snapshot.get("bridge_healthy") else "unreadable",
        0 if snapshot.get("bridge_healthy") else None, 5, 10, "source:monitor:bridge")
    add("dashboard_health", "present" if snapshot.get("dashboard_healthy") else "unreadable",
        0 if snapshot.get("dashboard_healthy") else None, 5, 10, "source:monitor:dashboard")
    backup_age = snapshot.get("backup_age_hours")
    backup_ok = isinstance(backup_age, (int, float)) and snapshot.get("backup_valid") is True
    add("backup_freshness", "present" if backup_ok else "unreadable",
        float(backup_age) * 60 if backup_ok else None, BACKUP_STALE_HOURS * 60,
        (BACKUP_STALE_HOURS + 6) * 60, "source:monitor:backup")
    night_alert = any(row["code"].startswith("night_") for row in evaluate(snapshot, now))
    add("night_freshness", "absent" if night_alert else "present", None if night_alert else 0,
        NIGHT_STALE_MINUTES, NIGHT_STALE_MINUTES * 2, f"source:monitor:{account_id}:night")
    reauth = snapshot.get("self_reply_sync") == "reauthorization_required"
    readiness = snapshot.get("readiness") or {}
    credential_available = snapshot.get("credential_readiness_available") is True
    oauth_ok = credential_available and snapshot.get("account_available") \
        and readiness.get("status") == "active" and readiness.get("ready_for_dry_run") is True
    credential = snapshot.get("credential_readiness")
    if credential_available and isinstance(credential, dict):
        states = [credential.get(purpose) for purpose in ("publish", "insights")]
        oauth_ok = oauth_ok and all(isinstance(state, dict) and state.get("ready") is True for state in states)
    oauth_observed = "present" if oauth_ok else "unreadable" if not credential_available else "absent"
    add("oauth_readiness", oauth_observed, 0 if oauth_ok else None,
        5, 10, f"source:monitor:{account_id}:oauth", "reauth_required" if reauth else None)
    canary = snapshot.get("tenant_canary") or {}
    tenant_ok = snapshot.get("canary_available") and int(canary.get("unexpected_allow", 0) or 0) == 0
    add("tenant_isolation", "present" if tenant_ok else "absent", 0 if tenant_ok else None,
        5, 10, "source:monitor:tenant", "dependency" if snapshot.get("canary_available") and not tenant_ok else None)
    for code, key in (("insights_freshness", "insights_age_minutes"),
                      ("editorial_freshness", "editorial_age_minutes"),
                      ("activity_projection_freshness", "activity_projection_age_minutes")):
        age = snapshot.get(key)
        tolerance, delayed = FRESHNESS[code]
        add(code, "present" if isinstance(age, (int, float)) else "unknown",
            float(age) if isinstance(age, (int, float)) else None,
            tolerance, delayed, f"source:monitor:{account_id}:{code}")
    scheduler_ok = snapshot.get("scheduler_registered") is True and snapshot.get("scheduler_state") in {"Ready", "Running"}
    scheduler_blocked = snapshot.get("scheduler_registered") is True and snapshot.get("scheduler_state") == "Disabled"
    add("task_scheduler_state", "present" if scheduler_ok else "absent", 0 if scheduler_ok else None,
        5, 10, "source:monitor:task-scheduler", "kill_switch" if scheduler_blocked else None)
    return {"schema_version": "monitor-findings.v1", "scope": scope, "findings": findings}


def oauth_expiry(readiness: dict[str, Any]) -> datetime | None:
    oauth = readiness.get("oauth") if isinstance(readiness.get("oauth"), dict) else {}
    for value in (
        readiness.get("oauth_expires_at"), readiness.get("access_token_expires_at"),
        readiness.get("token_expires_at"), oauth.get("expires_at"),
    ):
        parsed = parse_time(value)
        if parsed:
            return parsed
    return None


def evaluate(snapshot: dict[str, Any], now: datetime) -> list[dict[str, str]]:
    alerts: list[dict[str, str]] = []
    account_id = str(snapshot.get("account_id") or "unknown")

    def add(code: str, detail: str, entity: str = account_id) -> None:
        alerts.append({"code": code, "entity": entity, "detail": detail})

    if not snapshot.get("bridge_healthy"):
        add("bridge_unhealthy", "Bridge health check failed", "system:bridge")
    if not snapshot.get("dashboard_healthy"):
        add("dashboard_unhealthy", "Dashboard health check failed", "system:dashboard")

    age = snapshot.get("backup_age_hours")
    if not isinstance(age, (int, float)):
        add("backup_missing", "No readable non-empty backup was found", "system:backup")
    elif snapshot.get("backup_valid") is False:
        add("backup_failure", "Latest backup failed SQLite integrity validation", "system:backup")
    elif age > BACKUP_STALE_HOURS:
        add("backup_stale", f"Latest backup is {age:.1f}h old", "system:backup")

    stale_before = now - timedelta(minutes=NIGHT_STALE_MINUTES)
    recent_before = now - timedelta(hours=NIGHT_MISS_LOOKBACK_HOURS)
    for item in snapshot.get("night_items", []):
        if not isinstance(item, dict):
            continue
        scheduled = parse_time(item.get("scheduled_at"))
        status = item.get("status")
        item_id = str(item.get("item_id") or account_id)
        cancelled = status in {"cancelled", "canceled"} or item.get("batch_status") in {"cancelled", "canceled"} \
            or item.get("block_reason") in {"operator_cancelled", "batch_cancelled", "cancelled"}
        if cancelled:
            continue
        if status == "pending" and scheduled and scheduled < stale_before:
            add("night_stale_pending", "A NIGHT item is pending beyond its 20m window", f"night:{item_id}")
        if (status == "blocked" and item.get("block_reason") == "scheduled_window_expired"
                and scheduled and scheduled >= recent_before):
            add("night_missed", "A NIGHT item expired without an attempt", f"night:{item_id}")
        if status == "ambiguous":
            add("night_ambiguous", "A NIGHT item needs publication reconciliation", f"night:{item_id}")

    if not snapshot.get("account_available"):
        add("account_readiness_unavailable", "Account readiness could not be read")
    else:
        readiness = snapshot.get("readiness") or {}
        if readiness.get("status") != "active" or readiness.get("ready_for_dry_run") is not True:
            add("oauth_readiness_degraded", "Account readiness is degraded")
        expiry = oauth_expiry(readiness)
        if expiry:
            remaining = (expiry - now).total_seconds() / 3600
            if remaining <= 0:
                add("oauth_expired", "OAuth credential is expired")
            elif remaining <= OAUTH_EXPIRY_WARNING_HOURS:
                add("oauth_expiring", f"OAuth credential expires in {remaining:.1f}h")
        blocking_values = readiness.get("blocking", [])
        blocking = " ".join(str(value) for value in blocking_values) if isinstance(blocking_values, list) else ""
        if re.search(r"oauth|token|reauth|credential", blocking, re.IGNORECASE):
            add("oauth_readiness_degraded", "OAuth readiness has a blocking condition")
        if snapshot.get("self_reply_sync") == "reauthorization_required":
            add("oauth_self_reply_scope_missing", "Self-Reply OAuth reauthorization is required")

    credential = snapshot.get("credential_readiness")
    if snapshot.get("credential_readiness_available") is not True:
        add("oauth_readiness_unavailable", "Credential readiness could not be read")
    elif isinstance(credential, dict):
        for purpose in ("publish", "insights"):
            state = credential.get(purpose)
            if not isinstance(state, dict):
                add("oauth_readiness_degraded", f"{purpose} credential readiness is missing", f"{account_id}:{purpose}")
                continue
            entity = f"{account_id}:{purpose}"
            if state.get("ready") is not True:
                add("oauth_readiness_degraded", f"{purpose} credential is not ready", entity)
            expiry = parse_time(state.get("expires_at"))
            if expiry:
                remaining = (expiry - now).total_seconds() / 3600
                if remaining <= 0:
                    add("oauth_expired", f"{purpose} credential is expired", entity)
                elif remaining <= OAUTH_EXPIRY_WARNING_HOURS:
                    add("oauth_expiring", f"{purpose} credential expires in {remaining:.1f}h", entity)

    for code, key in (("insights", "insights_age_minutes"), ("editorial", "editorial_age_minutes"),
                      ("activity_projection", "activity_projection_age_minutes")):
        age_minutes = snapshot.get(key)
        delayed = FRESHNESS[f"{code}_freshness"][1]
        if not isinstance(age_minutes, (int, float)) or isinstance(age_minutes, bool) or age_minutes < 0:
            add("runner_freshness_unavailable", f"{code} runner freshness is unavailable", f"{account_id}:{code}")
        elif age_minutes > delayed:
            add("runner_stale", f"{code} runner heartbeat is {age_minutes:.0f}m old", f"{account_id}:{code}")
    heartbeats = snapshot.get("runner_heartbeats")
    if not isinstance(heartbeats, list):
        add("runner_freshness_unavailable", "Runner heartbeat telemetry is unavailable", f"{account_id}:runner_heartbeats")
        heartbeats = []
    for heartbeat in heartbeats:
        if not isinstance(heartbeat, dict):
            continue
        runner = str(heartbeat.get("runner") or heartbeat.get("name") or "unknown")
        seen = parse_time(heartbeat.get("observed_at") or heartbeat.get("last_seen_at"))
        limit = heartbeat.get("freshness_minutes", 120)
        if not seen or not isinstance(limit, (int, float)) or (now - seen).total_seconds() / 60 > limit:
            add("runner_heartbeat_missing", f"{runner} heartbeat is missing or stale", f"{account_id}:{runner}")

    if not snapshot.get("canary_available"):
        add("tenant_canary_unavailable", "Tenant canary telemetry could not be read")
    else:
        canary = snapshot.get("tenant_canary") or {}
        if int(canary.get("unexpected_allow", 0) or 0) > 0:
            add("tenant_unexpected_allow", "Tenant canary recorded an unexpected allow")
        if int(canary.get("unexpected_deny", 0) or 0) > 0:
            add("tenant_unexpected_deny", "Tenant canary recorded an unexpected deny")
        window = now - timedelta(minutes=DENIAL_WINDOW_MINUTES)
        recent_denies = sum(
            1 for row in canary.get("recent", [])
            if isinstance(row, dict) and row.get("decision") == "deny"
            and (parse_time(row.get("timestamp")) or datetime.min.replace(tzinfo=timezone.utc)) >= window
        )
        if recent_denies >= DENIAL_SPIKE_THRESHOLD:
            add("tenant_denial_spike", f"Tenant denies reached {recent_denies} in 10m")

    legacy_pid = snapshot.get("legacy_5735_pid")
    if isinstance(legacy_pid, int) and legacy_pid > 0:
        add("legacy_5735", f"Legacy port 5735 is listening (PID {legacy_pid})", "system:legacy-5735")
    return alerts


def aggregate(alerts: list[dict[str, str]], recovery: bool = False) -> str:
    if recovery:
        return "✅ Control Plane recovery\nAll CRITICAL checks are healthy."
    lines = ["🚨 Control Plane CRITICAL"]
    lines.extend(f"• [{a['code']}:{a['entity']}] {a['detail']}" for a in alerts)
    message = "\n".join(lines)
    return message if len(message) <= MAX_MESSAGE_CHARS else message[: MAX_MESSAGE_CHARS - 1] + "…"


def unique_alerts(alerts: list[dict[str, str]]) -> list[dict[str, str]]:
    by_identity = {(alert["code"], alert["entity"]): alert for alert in alerts}
    return [by_identity[key] for key in sorted(by_identity)]


def daily_digest(snapshots: list[dict[str, Any]], alerts: list[dict[str, str]], now: datetime) -> dict[str, Any]:
    cancelled = sum(
        1 for snapshot in snapshots for item in snapshot.get("night_items", [])
        if isinstance(item, dict) and (
            item.get("status") in {"cancelled", "canceled"}
            or item.get("batch_status") in {"cancelled", "canceled"}
            or item.get("block_reason") in {"operator_cancelled", "batch_cancelled", "cancelled"}
        )
    )
    return {
        "schema_version": "attention-digest.v1",
        "date": now.date().isoformat(),
        "accounts": [str(snapshot.get("account_id") or "unknown") for snapshot in snapshots],
        "account_count": len(snapshots),
        "critical_count": len(alerts),
        "night_cancelled_count": cancelled,
        "night_missed_count": sum(alert["code"] == "night_missed" for alert in alerts),
        "alert_identities": [f"{alert['code']}:{alert['entity']}" for alert in alerts],
    }


def dedupe_key(alert: dict[str, str]) -> str:
    entity_hash = hashlib.sha256(alert["entity"].encode("utf-8")).hexdigest()[:16]
    return f"control-plane.{alert['code']}.{entity_hash}"


def notifier_state_file(repo: Path) -> Path:
    configured = os.environ.get("DISCORD_NOTIFY_STATE_FILE")
    return Path(configured) if configured else repo / ".runtime" / "alerts" / "discord-state.json"


def active_notification_keys(path: Path) -> set[str]:
    try:
        state = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(state, dict):
            return set()
        return {key for key, value in state.items() if key.startswith("control-plane.")
                and isinstance(value, dict) and value.get("state") == "active"}
    except (OSError, ValueError):
        return set()


def notify(repo: Path, alerts: list[dict[str, str]]) -> int:
    notifier = repo / ".claude" / "scripts" / "notify-discord.sh"
    current = {dedupe_key(alert) for alert in alerts}
    calls = [
        (dedupe_key(alert), "active", f"🚨 [{alert['code']}:{alert['entity']}] {alert['detail']}")
        for alert in alerts
    ]
    calls.extend(
        (key, "recovery", f"✅ Recovered: {key}")
        for key in sorted(active_notification_keys(notifier_state_file(repo)) - current)
    )
    for key, mode, message in calls:
        completed = subprocess.run(
            [find_bash(), str(notifier), "--dedupe-key", key, "--state", mode,
             "--cooldown-seconds", "21600", message], cwd=repo, check=False,
        )
        if completed.returncode:
            return completed.returncode
    return 0


def find_bash() -> str:
    candidates = ["bash"]
    if os.name == "nt":
        candidates = [
            os.environ.get("GIT_BASH", ""),
            r"C:\Program Files\Git\bin\bash.exe",
            r"C:\Program Files\Git\usr\bin\bash.exe",
        ]
    for candidate in candidates:
        if not candidate:
            continue
        try:
            probe = subprocess.run(
                [candidate, "--version"], capture_output=True, timeout=3, check=False)
            if probe.returncode == 0:
                return candidate
        except (OSError, subprocess.TimeoutExpired):
            continue
    raise RuntimeError("Git Bash is required for Discord notification")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    repo = Path(__file__).resolve().parents[1]
    parser.add_argument("--bridge-url", default="http://127.0.0.1:8000")
    parser.add_argument("--dashboard-url", default="http://127.0.0.1:5733")
    parser.add_argument("--scope", required=True)
    parser.add_argument("--account-id", action="append")
    parser.add_argument("--all-accounts", action="store_true")
    parser.add_argument("--tenant-user-id", default="usr_takumi_owner")
    parser.add_argument("--backup-dir", default=str(Path.home() / "Threads-" / "data" / "backups"))
    parser.add_argument("--legacy-port", type=int, default=5735)
    parser.add_argument("--scheduler-task-name", default="Threads-NIGHT04")
    parser.add_argument("--fixture", type=Path)
    parser.add_argument("--now")
    parser.add_argument("--notify", action="store_true")
    args = parser.parse_args(argv)
    now = parse_time(args.now) if args.now else datetime.now(timezone.utc)
    if now is None:
        parser.error("--now must be ISO-8601")
    if not args.fixture and not args.account_id and not args.all_accounts:
        parser.error("--account-id or --all-accounts is required for live collection")
    if args.fixture:
        fixture = json.loads(args.fixture.read_text(encoding="utf-8"))
        snapshots = fixture.get("accounts", []) if isinstance(fixture, dict) and isinstance(fixture.get("accounts"), list) else [fixture]
        snapshots = [dict(snapshot, account_id=snapshot.get("account_id", "acct_fixture"))
                     for snapshot in snapshots if isinstance(snapshot, dict)]
        snapshots.sort(key=lambda snapshot: str(snapshot["account_id"]))
    else:
        snapshots = collect_snapshots(args, now)
    if not snapshots:
        parser.error("no active accounts were discovered")
    alerts = unique_alerts([alert for snapshot in snapshots for alert in evaluate(snapshot, now)])
    employee_inputs = [structured_findings(snapshot, args.scope, now) for snapshot in snapshots]
    result = {"status": "CRITICAL" if alerts else "HEALTHY", "alerts": alerts,
              "accounts": [snapshot["account_id"] for snapshot in snapshots],
              "employee_input": employee_inputs[0], "employee_inputs": employee_inputs,
              "daily_digest": daily_digest(snapshots, alerts, now),
              "message": aggregate(alerts, recovery=not alerts)}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if args.notify:
        notification_result = notify(repo, alerts)
        if notification_result:
            return notification_result
    return 2 if alerts else 0


if __name__ == "__main__":
    raise SystemExit(main())
