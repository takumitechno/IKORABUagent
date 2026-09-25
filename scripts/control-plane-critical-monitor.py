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
RUNNER_HEARTBEAT_STALE_MINUTES = 120
RUNNER_FINDINGS = {
    "insights": "insights_freshness",
    "outcome": "editorial_freshness",
    "night_batch": "activity_projection_freshness",
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


def runner_evidence(
    snapshot: dict[str, Any], now: datetime,
) -> tuple[dict[str, tuple[str, float | None]], bool]:
    """Validate the fixed sealed heartbeat set and derive freshness from timestamps."""
    evidence = {runner: ("missing", None) for runner in RUNNER_FINDINGS}
    heartbeats = snapshot.get("runner_heartbeats")
    if not isinstance(heartbeats, list):
        return evidence, True
    invalid_identity = False
    seen: set[str] = set()
    for heartbeat in heartbeats:
        if not isinstance(heartbeat, dict):
            invalid_identity = True
            continue
        runner = heartbeat.get("runner_name")
        if not isinstance(runner, str) or runner not in RUNNER_FINDINGS:
            invalid_identity = True
            continue
        if runner in seen:
            evidence[runner] = ("unsupported", None)
            continue
        seen.add(runner)
        state = heartbeat.get("state")
        run_status = heartbeat.get("run_status")
        age_seconds = heartbeat.get("age_seconds")
        if (state not in ("fresh", "stale", "missing", "invalid", "future")
                or run_status not in ("succeeded", "failed", None)
                or heartbeat.get("expected") != "unknown"
                or not isinstance(heartbeat.get("healthy"), bool)
                or (age_seconds is not None and (
                    not isinstance(age_seconds, int) or isinstance(age_seconds, bool)
                    or age_seconds < 0
                ))):
            evidence[runner] = ("unsupported", None)
            continue
        raw_seen = heartbeat.get("last_run_at")
        seen_at = parse_time(raw_seen)
        if (not isinstance(raw_seen, str)
                or not re.search(r"(?:Z|[+-]\d{2}:\d{2})$", raw_seen)
                or seen_at is None or seen_at > now
                or state in {"missing", "invalid", "future"}):
            evidence[runner] = ("invalid_timestamp", None)
            continue
        age_minutes = (now - seen_at).total_seconds() / 60
        if run_status is None:
            evidence[runner] = ("result_unavailable", age_minutes)
        elif run_status == "failed":
            evidence[runner] = ("failed", age_minutes)
        elif state == "stale" or age_minutes > RUNNER_HEARTBEAT_STALE_MINUTES:
            evidence[runner] = ("stale", age_minutes)
        elif heartbeat["healthy"] is not True:
            evidence[runner] = ("unhealthy", age_minutes)
        else:
            evidence[runner] = ("fresh", age_minutes)
    return evidence, invalid_identity


def credential_states(value: Any) -> dict[str, dict[str, Any]] | None:
    if not isinstance(value, dict):
        return None
    states = {purpose: value.get(purpose) for purpose in ("publish", "insights")}
    return states if all(
        isinstance(state, dict) and isinstance(state.get("ready"), bool)
        for state in states.values()
    ) else None


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


def collect_snapshots(
    args: argparse.Namespace, now: datetime,
) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    api_key = user_environment("AUTOPILOT_BRIDGE_API_KEY")
    headers = {"Accept": "application/json", "X-Threads-User-ID": args.tenant_user_id}
    if api_key:
        headers["X-API-Key"] = api_key
    collection_alerts: list[dict[str, str]] = []
    account_ids = sorted(set(args.account_id or []))
    if args.all_accounts:
        accounts_ok, accounts = request_json(f"{args.bridge_url}/operator/accounts", headers)
        rows = accounts.get("accounts") if accounts_ok and isinstance(accounts, dict) else None
        meta = accounts.get("meta") if isinstance(accounts, dict) else None
        valid_rows = isinstance(meta, dict) and meta.get("schema_version") == 1 \
            and isinstance(rows, list) and all(
            isinstance(row, dict) and isinstance(row.get("account_id"), str)
            and bool(row["account_id"]) and isinstance(row.get("account_status"), str)
            for row in rows
        )
        if not valid_rows:
            collection_alerts.append({
                "code": "account_discovery_unavailable",
                "entity": "system:account-discovery",
                "detail": "Active account discovery could not be read",
            })
        else:
            active_ids = [row["account_id"] for row in rows if row["account_status"] == "active"]
            if not active_ids:
                collection_alerts.append({
                    "code": "account_discovery_empty",
                    "entity": "system:account-discovery",
                    "detail": "Account discovery returned zero active accounts",
                })
            account_ids = sorted(set(account_ids + active_ids))
    if not account_ids:
        return [], collection_alerts
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
    snapshots: list[dict[str, Any]] = []
    for account_id in account_ids:
        account_ok, account = request_json(
            f"{args.bridge_url}/operator/accounts/{account_id}", headers)
        credential_ok, live_readiness = request_json(
            f"{args.bridge_url}/operator/readiness/accounts/{account_id}", headers)
        account = account if account_ok and isinstance(account, dict) else {}
        meta = account.get("meta") if isinstance(account, dict) else None
        account_ok = bool(account_ok and isinstance(meta, dict)
                          and meta.get("schema_version") == 1
                          and account.get("account_id") == account_id)
        if not account_ok:
            account = {}
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
            "night_attention": operations.get("night_attention"),
            "insights_quarantine": operations.get("insights_quarantine"),
            "runner_heartbeats": operations.get("runner_heartbeats"),
        })
    return snapshots, collection_alerts


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
    states = credential_states(snapshot.get("credential_readiness")) if credential_available else None
    credential_verified = states is not None
    oauth_ok = credential_verified and snapshot.get("account_available") \
        and readiness.get("status") == "active" and readiness.get("ready_for_dry_run") is True
    if states is not None:
        oauth_ok = oauth_ok and all(state.get("ready") is True for state in states.values())
    oauth_observed = "present" if oauth_ok else "unreadable" if not credential_verified else "absent"
    add("oauth_readiness", oauth_observed, 0 if oauth_ok else None,
        5, 10, f"source:monitor:{account_id}:oauth", "reauth_required" if reauth else None)
    canary = snapshot.get("tenant_canary") or {}
    tenant_ok = snapshot.get("canary_available") and int(canary.get("unexpected_allow", 0) or 0) == 0
    add("tenant_isolation", "present" if tenant_ok else "absent", 0 if tenant_ok else None,
        5, 10, "source:monitor:tenant", "dependency" if snapshot.get("canary_available") and not tenant_ok else None)
    heartbeat_states, _ = runner_evidence(snapshot, now)
    for runner, code in RUNNER_FINDINGS.items():
        state, age = heartbeat_states[runner]
        add(code, "present" if state == "fresh" else "unknown" if state in {
            "missing", "unsupported", "invalid_timestamp", "result_unavailable"
        } else "absent", age, RUNNER_HEARTBEAT_STALE_MINUTES,
            RUNNER_HEARTBEAT_STALE_MINUTES, f"source:monitor:{account_id}:{runner}")
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
    for label, key in (("NIGHT", "night_attention"),
                       ("insights quarantine", "insights_quarantine")):
        collection = snapshot.get(key)
        coverage = collection.get("coverage") if isinstance(collection, dict) else None
        truncated = collection.get("items_truncated") if isinstance(collection, dict) else None
        entity = f"{account_id}:{key}"
        if coverage == "partial" or truncated is True:
            add("collection_coverage_partial", f"{label} coverage is partial", entity)
        elif coverage != "complete" or truncated is not False:
            add("collection_coverage_unknown", f"{label} coverage is unavailable", entity)
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

    states = credential_states(snapshot.get("credential_readiness")) \
        if snapshot.get("credential_readiness_available") is True else None
    if states is None:
        add("oauth_readiness_unavailable", "Credential readiness could not be read")
    else:
        for purpose, state in states.items():
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

    heartbeat_states, invalid_identity = runner_evidence(snapshot, now)
    if invalid_identity:
        add("runner_freshness_unavailable", "Runner heartbeat identity is invalid", f"{account_id}:runner_heartbeats")
    for runner, (state, age_minutes) in heartbeat_states.items():
        if state == "missing":
            add("runner_freshness_unavailable", f"Required {runner} heartbeat is missing", f"{account_id}:{runner}")
        elif state == "unsupported":
            add("runner_freshness_unavailable", f"{runner} heartbeat enum is unsupported", f"{account_id}:{runner}")
        elif state == "invalid_timestamp":
            add("runner_freshness_unavailable", f"{runner} heartbeat timestamp is invalid", f"{account_id}:{runner}")
        elif state == "result_unavailable":
            add("runner_freshness_unavailable", f"{runner} heartbeat result is unavailable", f"{account_id}:{runner}")
        elif state == "failed":
            add("runner_failed", f"{runner} runner last run failed", f"{account_id}:{runner}")
        elif state == "stale":
            add("runner_stale", f"{runner} runner heartbeat is {age_minutes:.0f}m old", f"{account_id}:{runner}")
        elif state == "unhealthy":
            add("runner_unhealthy", f"{runner} runner is not healthy", f"{account_id}:{runner}")

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
        collection_alerts: list[dict[str, str]] = []
    else:
        snapshots, collection_alerts = collect_snapshots(args, now)
    if not snapshots and not collection_alerts:
        parser.error("no active accounts were discovered")
    alerts = unique_alerts(collection_alerts + [
        alert for snapshot in snapshots for alert in evaluate(snapshot, now)
    ])
    employee_inputs = [structured_findings(snapshot, args.scope, now) for snapshot in snapshots]
    result = {"status": "CRITICAL" if alerts else "HEALTHY", "alerts": alerts,
              "accounts": [snapshot["account_id"] for snapshot in snapshots],
              "employee_input": employee_inputs[0] if employee_inputs else None,
              "employee_inputs": employee_inputs,
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
