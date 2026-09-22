#!/bin/bash
# Notification capability. Agent policy decides whether/what to notify; this
# script only performs an explicitly requested send.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" 2>/dev/null || true
REPO_ROOT="$(pwd)"
source "$REPO_ROOT/scripts/lib/runtime-db.sh"

if ! command -v jq &>/dev/null; then
  echo "notify-discord: jq is required" >&2
  exit 2
fi

AGENT_NAME=""
DEDUPE_KEY=""
STATE_MODE="active"
COOLDOWN_SECONDS=21600
STATE_FILE="${DISCORD_NOTIFY_STATE_FILE:-$REPO_ROOT/.runtime/alerts/discord-state.json}"
while [ $# -gt 0 ]; do
  case "$1" in
    --agent)
      AGENT_SLUG="${2:-}"
      [[ "$AGENT_SLUG" =~ ^[a-z0-9-]+$ ]] || { echo "Invalid agent slug" >&2; exit 1; }
      DB_PATH="$(resolve_runtime_db "$REPO_ROOT")"
      [ -f "$DB_PATH" ] || { echo "Agent DB not found" >&2; exit 1; }
      AGENT_NAME=$(sqlite3 "$DB_PATH" "SELECT pokemon_jp FROM agents WHERE slug='$AGENT_SLUG' AND status='active' LIMIT 1;")
      [ -n "$AGENT_NAME" ] || { echo "Unknown active agent" >&2; exit 1; }
      shift 2 ;;
    --dedupe-key) DEDUPE_KEY="${2:-}"; shift 2 ;;
    --state) STATE_MODE="${2:-}"; shift 2 ;;
    --cooldown-seconds) COOLDOWN_SECONDS="${2:-}"; shift 2 ;;
    --state-file) STATE_FILE="${2:-}"; shift 2 ;;
    --) shift; break ;;
    -*) echo "notify-discord: unknown option" >&2; exit 1 ;;
    *) break ;;
  esac
done
[[ -z "$DEDUPE_KEY" || "$DEDUPE_KEY" =~ ^[a-zA-Z0-9._:-]+$ ]] || { echo "Invalid dedupe key" >&2; exit 1; }
[[ "$STATE_MODE" =~ ^(active|recovery)$ ]] || { echo "Invalid state" >&2; exit 1; }
[[ "$COOLDOWN_SECONDS" =~ ^[0-9]+$ ]] || { echo "Invalid cooldown" >&2; exit 1; }

WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-}"
if [ -z "$WEBHOOK_URL" ]; then
  echo "notify-discord: DISCORD_WEBHOOK_URL is not configured" >&2
  exit 3
fi

message="${1:-}"
if [ -z "$message" ]; then
  echo "Usage: notify-discord.sh [--agent SLUG] \"message\"" >&2
  exit 1
fi
message="${message:0:1900}"

if [ -n "$DEDUPE_KEY" ]; then
  mkdir -p "$(dirname "$STATE_FILE")"
  [ -f "$STATE_FILE" ] || printf '{}\n' > "$STATE_FILE"
  jq -e 'type == "object"' "$STATE_FILE" >/dev/null || { echo "notify-discord: invalid state file" >&2; exit 2; }
  previous_state=$(jq -r --arg key "$DEDUPE_KEY" '.[$key].state // "none"' "$STATE_FILE")
  last_sent=$(jq -r --arg key "$DEDUPE_KEY" '.[$key].last_sent // 0' "$STATE_FILE")
  now_epoch=$(date +%s)
  if [ "$STATE_MODE" = "recovery" ] && [ "$previous_state" != "active" ]; then
    echo "notify-discord: recovery suppressed (no active alert)"
    exit 0
  fi
  if [ "$STATE_MODE" = "active" ] && [ "$previous_state" = "active" ] &&
      [ $((now_epoch - last_sent)) -lt "$COOLDOWN_SECONDS" ]; then
    echo "notify-discord: duplicate suppressed (cooldown active)"
    exit 0
  fi
fi

if [ -n "$AGENT_NAME" ]; then
  payload=$(jq -n --arg msg "$message" --arg name "$AGENT_NAME" '{content: $msg, username: $name}')
else
  payload=$(jq -n --arg msg "$message" '{content: $msg}')
fi

set +e
http_code=$(curl -sS -o /dev/null -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -d "$payload" \
  "$WEBHOOK_URL")
curl_status=$?
set -e
if [ "$curl_status" -ne 0 ] || [[ ! "$http_code" =~ ^2[0-9][0-9]$ ]]; then
  echo "notify-discord: delivery failed (HTTP ${http_code:-unavailable})" >&2
  exit 4
fi

if [ -n "$DEDUPE_KEY" ]; then
  tmp_state="${STATE_FILE}.tmp.$$"
  jq --arg key "$DEDUPE_KEY" --arg state "$STATE_MODE" --argjson sent "$now_epoch" \
    '.[$key] = {state: $state, last_sent: $sent}' "$STATE_FILE" > "$tmp_state"
  mv "$tmp_state" "$STATE_FILE"
fi
echo "notify-discord: delivered (HTTP $http_code)"
