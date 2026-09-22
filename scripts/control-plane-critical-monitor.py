#!/usr/bin/env python3
"""Read-only CRITICAL checks for the local Threads control plane."""
from __future__ import annotations

import argparse
import json
import os
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
DENIAL_WINDOW_MINUTES = 10
DENIAL_SPIKE_THRESHOLD = 5

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


def collect_snapshot(args: argparse.Namespace, now: datetime) -> dict[str, Any]:
    api_key = user_environment("AUTOPILOT_BRIDGE_API_KEY")
    headers = {"Accept": "application/json", "X-Threads-User-ID": args.tenant_user_id}
    if api_key:
        headers["X-API-Key"] = api_key
    bridge_ok, bridge_health = request_json(f"{args.bridge_url}/health", {})
    dashboard_ok, dashboard_health = request_json(f"{args.dashboard_url}/health", {})
    account_ok, account = request_json(
        f"{args.bridge_url}/operator/accounts/{args.account_id}", headers)
    canary_ok, canary = request_json(f"{args.bridge_url}/operator/tenant-canary", headers)
    backup_age, backup_valid = latest_backup_status(Path(args.backup_dir), now)
    return {
        "observed_at": now.isoformat(),
        "bridge_healthy": bridge_ok and bridge_health.get("status") == "ok",
        "dashboard_healthy": dashboard_ok and dashboard_health.get("status") == "ok",
        "account_available": account_ok,
        "night_items": account.get("operations", {}).get("night_batch_items", []) if account_ok else [],
        "readiness": account.get("readiness", {}) if account_ok else {},
        "self_reply_sync": account.get("operations", {}).get("features", {}).get("self_reply_sync") if account_ok else None,
        "canary_available": canary_ok,
        "tenant_canary": canary if canary_ok else {},
        "backup_age_hours": backup_age,
        "backup_valid": backup_valid,
        "legacy_5735_pid": listener_pid(args.legacy_port),
    }


def evaluate(snapshot: dict[str, Any], now: datetime) -> list[dict[str, str]]:
    alerts: list[dict[str, str]] = []
    add = lambda code, detail: alerts.append({"code": code, "detail": detail})
    if not snapshot.get("bridge_healthy"):
        add("bridge_unhealthy", "Bridge health check failed")
    if not snapshot.get("dashboard_healthy"):
        add("dashboard_unhealthy", "Dashboard health check failed")

    age = snapshot.get("backup_age_hours")
    if not isinstance(age, (int, float)):
        add("backup_missing", "No readable non-empty backup was found")
    elif snapshot.get("backup_valid") is False:
        add("backup_failure", "Latest backup failed SQLite integrity validation")
    elif age > BACKUP_STALE_HOURS:
        add("backup_stale", f"Latest backup is {age:.1f}h old")

    stale_before = now - timedelta(minutes=NIGHT_STALE_MINUTES)
    recent_before = now - timedelta(hours=BACKUP_STALE_HOURS)
    for item in snapshot.get("night_items", []):
        if not isinstance(item, dict):
            continue
        scheduled = parse_time(item.get("scheduled_at"))
        status = item.get("status")
        if status == "pending" and scheduled and scheduled < stale_before:
            add("night_stale_pending", "A NIGHT item is pending beyond its 20m window")
            break
        if (status == "blocked" and item.get("block_reason") == "scheduled_window_expired"
                and scheduled and scheduled >= recent_before):
            add("night_missed", "A NIGHT item expired without an attempt")
            break
        if status == "ambiguous":
            add("night_ambiguous", "A NIGHT item needs publication reconciliation")
            break

    if not snapshot.get("account_available"):
        add("account_readiness_unavailable", "Account readiness could not be read")
    else:
        readiness = snapshot.get("readiness") or {}
        if readiness.get("status") != "active" or readiness.get("ready_for_dry_run") is not True:
            add("oauth_readiness_degraded", "Account readiness is degraded")
        if snapshot.get("self_reply_sync") == "reauthorization_required":
            add("oauth_self_reply_scope_missing", "Self-Reply OAuth reauthorization is required")

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
        add("legacy_5735", f"Legacy port 5735 is listening (PID {legacy_pid})")
    return alerts


def aggregate(alerts: list[dict[str, str]], recovery: bool = False) -> str:
    if recovery:
        return "✅ Control Plane recovery\nAll CRITICAL checks are healthy."
    lines = ["🚨 Control Plane CRITICAL"]
    lines.extend(f"• [{a['code']}] {a['detail']}" for a in alerts)
    message = "\n".join(lines)
    return message if len(message) <= MAX_MESSAGE_CHARS else message[: MAX_MESSAGE_CHARS - 1] + "…"


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
    parser.add_argument("--account-id", default="acct_8ssana")
    parser.add_argument("--tenant-user-id", default="usr_takumi_owner")
    parser.add_argument("--backup-dir", default=str(Path.home() / "Threads-" / "data" / "backups"))
    parser.add_argument("--legacy-port", type=int, default=5735)
    parser.add_argument("--fixture", type=Path)
    parser.add_argument("--now")
    parser.add_argument("--notify", action="store_true")
    args = parser.parse_args(argv)
    now = parse_time(args.now) if args.now else datetime.now(timezone.utc)
    if now is None:
        parser.error("--now must be ISO-8601")
    snapshot = json.loads(args.fixture.read_text(encoding="utf-8")) if args.fixture else collect_snapshot(args, now)
    alerts = evaluate(snapshot, now)
    result = {"status": "CRITICAL" if alerts else "HEALTHY", "alerts": alerts,
              "message": aggregate(alerts, recovery=not alerts)}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if args.notify:
        notifier = repo / ".claude" / "scripts" / "notify-discord.sh"
        mode = "active" if alerts else "recovery"
        completed = subprocess.run(
            [find_bash(), str(notifier), "--dedupe-key", "control-plane-critical",
             "--state", mode, "--cooldown-seconds", "21600", result["message"]],
            cwd=repo, check=False,
        )
        if completed.returncode not in (0,):
            return completed.returncode
    return 2 if alerts else 0


if __name__ == "__main__":
    raise SystemExit(main())
