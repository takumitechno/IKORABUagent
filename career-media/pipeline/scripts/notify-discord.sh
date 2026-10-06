#!/usr/bin/env bash
# Discord Webhook 通知（ZIP 版を career-* 用に変更）。
#   bash pipeline/scripts/notify-discord.sh --agent career-orchestrator "メッセージ"
# DISCORD_WEBHOOK_URL が未設定なら何もしない。Webhook URL は表示しない。
set -euo pipefail

if [ -z "${DISCORD_WEBHOOK_URL:-}" ]; then
  echo "[notify-discord] DISCORD_WEBHOOK_URL not set, skipping" >&2
  exit 0
fi
command -v jq >/dev/null || { echo "[notify-discord] jq not found, skipping" >&2; exit 0; }

NAME=""
if [ "${1:-}" = "--agent" ]; then
  case "${2:-}" in
    career-orchestrator) NAME="編集長" ;;
    career-writer) NAME="ライター" ;;
    career-reviewer) NAME="レビュアー" ;;
    *) echo "[notify-discord] unknown agent: ${2:-}" >&2; exit 1 ;;
  esac
  shift 2
fi
MESSAGE="${1:?message required}"
# Discord の上限（2000文字）を超えないように切り詰める
MESSAGE="${MESSAGE:0:1900}"

if [ -n "$NAME" ]; then PAYLOAD=$(jq -n --arg c "$MESSAGE" --arg u "$NAME" '{content:$c, username:$u, allowed_mentions:{parse:[]}}')
else PAYLOAD=$(jq -n --arg c "$MESSAGE" '{content:$c, allowed_mentions:{parse:[]}}'); fi

curl -sS -o /dev/null -w "%{http_code}\n" -H "Content-Type: application/json" -d "$PAYLOAD" "$DISCORD_WEBHOOK_URL"
