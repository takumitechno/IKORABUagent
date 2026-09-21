#!/usr/bin/env bash
# setup-demo.sh — 配布用デモ環境をワンコマンドで構築
#
# fresh clone から「中身の入ったダッシュボード」を立ち上げるまでを一気に行う:
#   1. schema.sql を空 DB に適用
#   2. .claude/agents/*.md からControl Planeの11 Agentをseed
#   3. 現実味のあるデモデータを投入 (reflections / logs / hypotheses / improvements /
#      agent_costs / agent_schedules / daily_reports / approvals)
#
# 既存のtracked DBや本番 DBを壊さないよう、.runtime配下だけに作る。
#
# 使い方:
#   bash pokemon-agents/scripts/setup-demo.sh           # → .runtime/db/agents-demo.db
#   bash pokemon-agents/scripts/setup-demo.sh <path>    # .runtime配下の任意の.db
#
# 立ち上げ:
#   AGENTS_DB_PATH=.runtime/db/agents-demo.db bun pokemon-agents/web/server.ts
#   → http://localhost:5733/

set -euo pipefail
cd "$(dirname "$0")/../.."

DEMO_DB="${1:-.runtime/db/agents-demo.db}"

echo "[setup-demo] target DB: $DEMO_DB"
bun pokemon-agents/scripts/regenerate-runtime-demo-db.ts --output "$DEMO_DB"

echo ""
echo "[setup-demo] ✅ 完了。ダッシュボードを起動するには:"
echo ""
echo "    AGENTS_DB_PATH=$DEMO_DB bun pokemon-agents/web/server.ts"
echo "    → http://localhost:5733/"
echo ""
