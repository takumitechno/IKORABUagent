#!/bin/bash
# run-task.sh <task_id>
#
# Scheduler が task を enqueue した後、この script に task_id を渡して実行させる。
# 責務:
#   1. Atomic checkout (二重起動防止)
#   2. Budget hard stop check
#   3. Agent 情報解決 (agents テーブル + agent.md 読み込み)
#   4. claude -p 起動 (Claude Code CLI)
#   5. 終了時 task row UPDATE + budget 加算 + completion hook fire

set -uo pipefail

TASK_ID="${1:-}"
if [ -z "$TASK_ID" ]; then
  echo "usage: $0 <task_id>" >&2
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
source "$REPO_ROOT/scripts/lib/runtime-db.sh"
DB="$(resolve_runtime_db "$REPO_ROOT")"
WORKER_ID="$$:$(hostname -s)"
NOW() { date '+%Y-%m-%d %H:%M:%S'; }

# SQLite は JSON/Boolean リテラル扱いが面倒なので関数化
sql() {
  sqlite3 -bail "$DB" "$@"
}
sql_escape() {
  # シングルクオート escape: 引数 or stdin から
  if [ $# -gt 0 ]; then
    printf "%s" "$1" | sed "s/'/''/g"
  else
    sed "s/'/''/g"
  fi
}

log() {
  echo "[$(NOW)] [task $TASK_ID] $*" >&2
}

# ------------------------------------------------------------------
# 1. Atomic checkout
# ------------------------------------------------------------------
log "attempting atomic checkout as $WORKER_ID"
CHECKED_OUT=$(sql "
  UPDATE reflections
  SET checked_out_by='$WORKER_ID',
      checked_out_at=datetime('now','localtime'),
      checkout_expires_at=datetime('now','+30 minutes','localtime'),
      status='running',
      started_at=datetime('now','localtime')
  WHERE id=$TASK_ID
    AND checked_out_by IS NULL
    AND status='queued'
  RETURNING id;
")
if [ -z "$CHECKED_OUT" ]; then
  log "already checked out, skipping"
  exit 0
fi

# ------------------------------------------------------------------
# 2. Agent 情報解決
# ------------------------------------------------------------------
AGENT_ROW=$(sql "
  SELECT a.id || '|' || a.slug || '|' || a.model || '|' || a.source_md_path
  FROM agents a
  JOIN reflections t ON t.agent_id = a.id
  WHERE t.id = $TASK_ID;
")
IFS='|' read -r AGENT_ID AGENT_SLUG AGENT_MODEL AGENT_MD_PATH <<< "$AGENT_ROW"

if [ -z "$AGENT_ID" ]; then
  log "ERROR: agent not found for task"
  sql "UPDATE reflections SET status='failed', error_message='agent_not_found', ended_at=datetime('now','localtime') WHERE id=$TASK_ID;"
  exit 1
fi

FULL_MD_PATH="$REPO_ROOT/$AGENT_MD_PATH"
if [ ! -f "$FULL_MD_PATH" ]; then
  log "ERROR: agent.md not found: $FULL_MD_PATH"
  sql "UPDATE reflections SET status='failed', error_message='agent_md_missing', ended_at=datetime('now','localtime') WHERE id=$TASK_ID;"
  exit 1
fi

log "resolved agent: $AGENT_SLUG (id=$AGENT_ID, model=$AGENT_MODEL)"

# Canonical employees never enter the legacy Claude runner. B1 employees use
# run-employee.ts; other employees remain inactive until they get a producer.
CONTRACT_STATUS=$(bun "$REPO_ROOT/pokemon-agents/scripts/check-employee-contract.ts" "$AGENT_SLUG" 2>/dev/null || echo none)
if [[ "$AGENT_MD_PATH" == .claude/agents/* ]]; then
  if [ "$CONTRACT_STATUS" = "none" ]; then
    log "ERROR: employee contract missing"
    sql "UPDATE reflections SET status='failed', error_message='employee_contract_missing', ended_at=datetime('now','localtime') WHERE id=$TASK_ID;"
  else
    log "ERROR: canonical employee must use the deterministic employee runner"
    sql "UPDATE reflections SET status='failed', error_message='employee_requires_run_employee', ended_at=datetime('now','localtime') WHERE id=$TASK_ID;"
  fi
  exit 1
fi

# ------------------------------------------------------------------
# 3. Budget hard stop + canonical usage start
# ------------------------------------------------------------------
PERIOD=$(date -u '+%Y-%m')
CALL_ID="task-${TASK_ID}"
STARTED_AT=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
DATA_ORIGIN="production"
if [ "${PLATFORM_DRY_RUN:-0}" = "1" ]; then DATA_ORIGIN="demo"; fi
if ! bun "$REPO_ROOT/pokemon-agents/scripts/ai-usage-cli.ts" start \
  --agent-db-id "$AGENT_ID" --period "$PERIOD" --call-id "$CALL_ID" \
  --started-at "$STARTED_AT" --agent-id "$AGENT_SLUG" --model "$AGENT_MODEL" \
  --operation legacy_task_cli --task-ref "task:${TASK_ID}" --run-id "task:${TASK_ID}" \
  --data-origin "$DATA_ORIGIN"; then
  log "AI usage budget/schema guard refused the run"
  sql "
    UPDATE reflections
    SET status='budget_halted',
        error_message='ai_usage_budget_or_schema_not_ready',
        ended_at=datetime('now','localtime')
    WHERE id=$TASK_ID;
  "
  exit 1
fi

# ------------------------------------------------------------------
# 4. claude -p 起動 (v1 run-agent.sh パターン継承)
# ------------------------------------------------------------------
WORK_DIR=$(mktemp -d "/tmp/pokemon-agents-task-${TASK_ID}-XXXXXX")
OUTPUT_LOG="$WORK_DIR/output.json"
log "work_dir=$WORK_DIR"

sql "UPDATE reflections SET work_dir='$WORK_DIR' WHERE id=$TASK_ID;"

# timeout は agent.config.timeout_sec から取得 (default 1800s = 30min)
TIMEOUT_SEC=$(sql "SELECT COALESCE(json_extract(config,'\$.timeout_sec'), 1800) FROM agents WHERE id=$AGENT_ID;")
log "timeout_sec=$TIMEOUT_SEC"

START_MS=$(( $(date +%s%N) / 1000000 ))

# Claude Code CLI 設定:
# - -p "<md>を読み、ルールに従って実行せよ" : v1 と同じパターン (md は Read tool で取得)
# - --dangerously-skip-permissions : sqlite3 / bash tool 実行を許可 (single-host 自律運用前提)
# - --output-format json : cost/tokens を capture
# - 環境変数 PLATFORM_* : agent.md 内から task ID 等を参照
PROMPT="${FULL_MD_PATH} を Read してから、そのルールに従って実行してください。Platform v2 のタスクです (task_id=${TASK_ID})。環境変数 PLATFORM_TASK_ID / PLATFORM_AGENT_ID / PLATFORM_AGENT_SLUG が定義されています。"

if [ "${PLATFORM_DRY_RUN:-0}" = "1" ]; then
  echo '{"total_cost_usd":0,"usage":{"input_tokens":0,"output_tokens":0},"duration_ms":4,"num_turns":0,"result":"DRY_RUN ok","stop_reason":"end_turn","is_error":false}' > "$OUTPUT_LOG"
  EXIT_CODE=0
else
  # 本番呼び出し (background + watchdog timeout)
  set +e
  (
    export PLATFORM_TASK_ID="$TASK_ID"
    export PLATFORM_AGENT_ID="$AGENT_ID"
    export PLATFORM_AGENT_SLUG="$AGENT_SLUG"
    cd "$REPO_ROOT"
    claude --model "$AGENT_MODEL" -p "$PROMPT" \
      --dangerously-skip-permissions --output-format json \
      > "$OUTPUT_LOG" 2>&1 &
    CLAUDE_PID=$!
    ( sleep "$TIMEOUT_SEC" && kill -TERM $CLAUDE_PID 2>/dev/null && sleep 5 && kill -KILL $CLAUDE_PID 2>/dev/null ) &
    WATCHDOG_PID=$!
    wait $CLAUDE_PID 2>/dev/null
    INNER_EXIT=$?
    kill $WATCHDOG_PID 2>/dev/null; wait $WATCHDOG_PID 2>/dev/null
    exit $INNER_EXIT
  )
  EXIT_CODE=$?
  set -e
fi

END_MS=$(( $(date +%s%N) / 1000000 ))
DURATION_MS=$((END_MS - START_MS))

log "claude exited code=$EXIT_CODE duration_ms=$DURATION_MS"

# ------------------------------------------------------------------
# 5. Result 集計 (JSON parse) + tasks UPDATE + budget 加算
# ------------------------------------------------------------------
PARSED=$(python3 -c "
import sys, json
try:
    d = json.load(open('$OUTPUT_LOG'))
except Exception as e:
    print(json.dumps({'error': str(e), 'cost': None, 'tokens_in': None, 'tokens_out': None, 'result': '', 'is_error': True}))
    sys.exit(0)
u = d.get('usage', {}) or {}
print(json.dumps({
    'cost': d.get('total_cost_usd') if isinstance(d.get('total_cost_usd'), (int, float)) else None,
    'tokens_in': ((u.get('input_tokens') + u.get('cache_read_input_tokens'))
                  if isinstance(u.get('input_tokens'), int) and isinstance(u.get('cache_read_input_tokens'), int)
                  else u.get('input_tokens') if isinstance(u.get('input_tokens'), int) else None),
    'tokens_out': u.get('output_tokens') if isinstance(u.get('output_tokens'), int) else None,
    'result': (d.get('result', '') or '')[:500],
    'stop_reason': d.get('stop_reason', 'unknown'),
    'is_error': bool(d.get('is_error', False)),
}))
" 2>/dev/null)

COST=$(echo "$PARSED" | python3 -c "import sys,json; v=json.load(sys.stdin).get('cost'); print('NULL' if v is None else v)" 2>/dev/null || echo NULL)
TOKENS_IN=$(echo "$PARSED" | python3 -c "import sys,json; v=json.load(sys.stdin).get('tokens_in'); print('NULL' if v is None else v)" 2>/dev/null || echo NULL)
TOKENS_OUT=$(echo "$PARSED" | python3 -c "import sys,json; v=json.load(sys.stdin).get('tokens_out'); print('NULL' if v is None else v)" 2>/dev/null || echo NULL)
RESULT_SUMMARY=$(echo "$PARSED" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result','')[:400])" 2>/dev/null | sql_escape)
IS_ERROR=$(echo "$PARSED" | python3 -c "import sys,json; print('1' if json.load(sys.stdin).get('is_error',False) else '0')" 2>/dev/null || echo 0)

# シグナル kill (timeout) 判定
if [ "$EXIT_CODE" = "143" ] || [ "$EXIT_CODE" = "137" ]; then
  FINAL_STATUS="timeout"
  ERROR_MSG="'timeout_after_${TIMEOUT_SEC}s'"
elif [ "$EXIT_CODE" -eq 0 ] && [ "$IS_ERROR" = "0" ]; then
  FINAL_STATUS="completed"
  ERROR_MSG="NULL"
else
  FINAL_STATUS="failed"
  ERR_SHORT=$(tail -c 300 "$OUTPUT_LOG" | sql_escape)
  ERROR_MSG="'exit=${EXIT_CODE} is_error=${IS_ERROR}: ${ERR_SHORT}'"
fi

ENDED_AT=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
LEDGER_STATUS="$FINAL_STATUS"
if [ "$FINAL_STATUS" = "completed" ]; then LEDGER_STATUS="succeeded"; fi
if ! bun "$REPO_ROOT/pokemon-agents/scripts/ai-usage-cli.ts" complete \
  --agent-db-id "$AGENT_ID" --call-id "$CALL_ID" --status "$LEDGER_STATUS" \
  --output "$OUTPUT_LOG" --ended-at "$ENDED_AT"; then
  FINAL_STATUS="failed"
  ERROR_MSG="'ai_usage_completion_record_failed'"
fi

sql "
  UPDATE reflections
  SET status='$FINAL_STATUS',
      ended_at=datetime('now','localtime'),
      duration_ms=$DURATION_MS,
      tokens_in=$TOKENS_IN,
      tokens_out=$TOKENS_OUT,
      cost_usd=$COST,
      result_summary='$RESULT_SUMMARY',
      error_message=$ERROR_MSG
  WHERE id=$TASK_ID;
"

log "cost=\$$COST tokens_in=$TOKENS_IN tokens_out=$TOKENS_OUT"

# ------------------------------------------------------------------
# 6. Completion hooks fire (automation chain)
# ------------------------------------------------------------------
if [ $EXIT_CODE -eq 0 ]; then
  # このエージェントから triggered される schedule を取得
  HOOKS=$(sql "
    SELECT h.target_schedule_id FROM task_completion_hooks h
    JOIN agent_schedules s ON s.id=h.target_schedule_id
    JOIN agents target ON target.id=s.agent_id
    WHERE h.source_agent_id=$AGENT_ID AND h.enabled=1
      AND target.source_md_path NOT LIKE '.claude/agents/%';
  ")
  for HOOK_SCHED_ID in $HOOKS; do
    # target schedule を fire: next_run_at=now にして scheduler が次 tick で拾う
    sql "
      UPDATE agent_schedules
      SET next_run_at=datetime('now','localtime')
      WHERE id=$HOOK_SCHED_ID AND data_origin='production' AND enabled=1;
    "
    log "automation chain: triggered schedule id=$HOOK_SCHED_ID"
  done
fi

log "done (status=$FINAL_STATUS)"
exit 0
