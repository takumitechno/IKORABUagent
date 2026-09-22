"""Windowless NIGHT04 launcher with durable, redacted result logging."""
from __future__ import annotations

import argparse
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--threads-root", required=True)
    parser.add_argument("--db-path", required=True)
    parser.add_argument("--account-id", required=True)
    parser.add_argument("--actor", required=True)
    parser.add_argument("--log-path", required=True)
    args = parser.parse_args()
    root = Path(args.threads_root).resolve()
    pythonw = root / ".venv" / "Scripts" / "pythonw.exe"
    if not pythonw.is_file():
        return 2
    log_path = Path(args.log_path).resolve()
    log_path.parent.mkdir(parents=True, exist_ok=True)
    command = [str(pythonw), "-m", "threads_autopilot.production.night_batch_runner",
               "--db-path", str(Path(args.db_path).resolve()),
               "--account-id", args.account_id, "--actor", args.actor]
    env = os.environ.copy()
    env["THREADS_SECRET_BACKEND"] = "windows"
    flags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    with log_path.open("a", encoding="utf-8") as log:
        log.write("started_at=%s\n" % datetime.now(timezone.utc).isoformat())
        completed = subprocess.run(
            command, cwd=str(root), env=env, stdout=log, stderr=log,
            stdin=subprocess.DEVNULL, creationflags=flags, check=False)
        log.write("exit_code=%d\n" % completed.returncode)
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
