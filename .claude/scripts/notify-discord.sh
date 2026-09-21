#!/bin/bash
# Notification capability. Agent policy decides whether/what to notify; this
# script only performs an explicitly requested send.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" 2>/dev/null || true
REPO_ROOT="$(pwd)"
source "$REPO_ROOT/scripts/lib/runtime-db.sh"

if ! command -v jq &>/dev/null; then
  echo "jq not found, skipping notification"
  exit 0
fi

AGENT_NAME=""
if [ "${1:-}" = "--agent" ]; then
  AGENT_SLUG="${2:-}"
  if [[ ! "$AGENT_SLUG" =~ ^[a-z0-9-]+$ ]]; then
    echo "Invalid agent slug" >&2
    exit 1
  fi
  DB_PATH="$(resolve_runtime_db "$REPO_ROOT")"
  if [ ! -f "$DB_PATH" ]; then
    echo "Agent DB not found: $DB_PATH" >&2
    exit 1
  fi
  AGENT_NAME=$(sqlite3 "$DB_PATH" "SELECT pokemon_jp FROM agents WHERE slug='$AGENT_SLUG' AND status='active' LIMIT 1;")
  if [ -z "$AGENT_NAME" ]; then
    echo "Unknown active agent: $AGENT_SLUG" >&2
    exit 1
  fi
  shift 2
fi

WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-}"
if [ -z "$WEBHOOK_URL" ]; then
  echo "notify-discord: DISCORD_WEBHOOK_URL is not configured" >&2
  exit 0
fi

message="${1:-}"
if [ -z "$message" ]; then
  echo "Usage: notify-discord.sh [--agent SLUG] \"message\"" >&2
  exit 1
fi

if [ -n "$AGENT_NAME" ]; then
  payload=$(jq -n --arg msg "$message" --arg name "$AGENT_NAME" '{content: $msg, username: $name}')
else
  payload=$(jq -n --arg msg "$message" '{content: $msg}')
fi

curl -s -o /dev/null -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -d "$payload" \
  "$WEBHOOK_URL"
