#!/usr/bin/env bash
# 記事パイプラインの agent を headless で 1 回実行する（cron / launchd から呼ぶ）。
#   bash pipeline/scripts/run-agent.sh career-orchestrator
#
# ZIP 版 run-agent.sh からのセキュリティ修正:
#   - `--dangerously-skip-permissions` を廃止。許可するツールを明示し、それ以外は拒否する
#   - publish コマンド・git push・環境変数の表示を明示的に禁止
#   - .env.local を丸ごと source しない（service role key を agent に渡さない）。
#     agent に渡すのは調査用の JINA_API_KEY と通知用の DISCORD_WEBHOOK_URL だけ
#   - reflection 用 SQLite の代わりに .runtime/logs/pipeline-runs.jsonl に記録
set -euo pipefail
cd "$(dirname "$0")/../.."

AGENT="${1:?agent slug required (career-orchestrator | career-writer | career-reviewer)}"
AGENT_MD=".claude/agents/${AGENT}.md"
[ -f "$AGENT_MD" ] || { echo "[run-agent] ERROR: $AGENT_MD not found" >&2; exit 1; }

# .env.local から必要なキーだけを読む（値は表示しない）
read_env() { [ -f .env.local ] && grep -E "^$1=" .env.local | tail -1 | cut -d= -f2- || true; }
JINA_API_KEY="${JINA_API_KEY:-$(read_env JINA_API_KEY)}"
DISCORD_WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-$(read_env DISCORD_WEBHOOK_URL)}"

TIMEOUT_FROM_FM=$(awk '/^---$/{n++; next} n==1 && /^timeout_sec:/{print $2; exit}' "$AGENT_MD")
TIMEOUT_SEC="${AGENT_TIMEOUT:-${TIMEOUT_FROM_FM:-1800}}"
RUN_ID="$(date +%Y%m%d%H%M%S)-$$"
LOG_DIR=".runtime/logs"; mkdir -p "$LOG_DIR"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

ALLOWED_TOOLS=(
  "Read" "Glob" "Grep" "WebSearch" "WebFetch" "Task"
  "Edit(content/**)" "Write(content/**)"
  "Bash(npm run pipeline -- check:*)" "Bash(npm run pipeline -- review:*)"
  "Bash(bash pipeline/scripts/notify-discord.sh:*)"
)
DISALLOWED_TOOLS=(
  "Bash(npm run pipeline -- publish:*)" "Bash(git push:*)" "Bash(env:*)" "Bash(printenv:*)"
  "Read(.env*)" "Edit(src/**)" "Edit(supabase/**)" "Edit(.claude/**)"
)

# macOS には timeout が無いことがあるため gtimeout → 無ければタイムアウトなしで警告
if command -v timeout >/dev/null; then TIMEOUT_CMD=(timeout --signal=TERM --kill-after=10 "$TIMEOUT_SEC")
elif command -v gtimeout >/dev/null; then TIMEOUT_CMD=(gtimeout --signal=TERM --kill-after=10 "$TIMEOUT_SEC")
else TIMEOUT_CMD=(); echo "[run-agent] WARN: timeout/gtimeout が無いためタイムアウトなしで実行します（brew install coreutils）" >&2; fi

echo "[run-agent] $AGENT start (run=$RUN_ID, timeout=${TIMEOUT_SEC}s)"
set +e
# claude CLI の認証（~/.claude のログイン情報、または ANTHROPIC_API_KEY）だけは引き継ぐ
env -i PATH="$PATH" HOME="$HOME" LANG="${LANG:-C.UTF-8}" ${ANTHROPIC_API_KEY:+ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"} \
  JINA_API_KEY="$JINA_API_KEY" DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" PIPELINE_RUN_ID="$RUN_ID" \
  ${TIMEOUT_CMD[@]+"${TIMEOUT_CMD[@]}"} \
  claude -p "$AGENT_MD を読み、そのルールに従って実行してください。PIPELINE_RUN_ID=${RUN_ID}。記事の公開（publish）は行わないでください。" \
    --allowedTools "${ALLOWED_TOOLS[@]}" \
    --disallowedTools "${DISALLOWED_TOOLS[@]}" \
    --output-format json > "$LOG_DIR/agent-${AGENT}-${RUN_ID}.json" 2> "$LOG_DIR/agent-${AGENT}-${RUN_ID}.err"
EXIT_CODE=$?
set -e

STATUS="completed"; [ "$EXIT_CODE" -ne 0 ] && STATUS="error"
[ "$EXIT_CODE" -eq 124 ] && echo "[run-agent] TIMEOUT after ${TIMEOUT_SEC}s" >&2
printf '{"run_id":"%s","agent":"%s","trigger":"schedule","status":"%s","exit_code":%d,"started_at":"%s","ended_at":"%s"}\n' \
  "$RUN_ID" "$AGENT" "$STATUS" "$EXIT_CODE" "$STARTED_AT" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$LOG_DIR/pipeline-runs.jsonl"
echo "[run-agent] $AGENT $STATUS (exit=$EXIT_CODE)"
exit "$EXIT_CODE"
