#!/bin/bash
# init.sh
# runtime DB を新規作成 + schema 適用
#
# 既に agents.db がある場合は CREATE TABLE IF NOT EXISTS なので idempotent
# (data は保持される、新カラム追加は ALTER で別 migration で対応)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
source "$REPO_ROOT/scripts/lib/runtime-db.sh"
DB_PATH="$(resolve_runtime_db "$REPO_ROOT")"
SCHEMA_PATH="$REPO_ROOT/pokemon-agents/db/schema.sql"

mkdir -p "$(dirname "$DB_PATH")"

echo "[init] applying schema to $DB_PATH"
sqlite3 "$DB_PATH" < "$SCHEMA_PATH"

# WAL モード確認
JOURNAL=$(sqlite3 "$DB_PATH" "PRAGMA journal_mode;")
echo "[init] journal_mode = $JOURNAL"

# テーブル一覧
echo "[init] tables:"
sqlite3 "$DB_PATH" ".tables"

echo "[init] done."
