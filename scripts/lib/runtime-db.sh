#!/usr/bin/env bash

# shellcheck shell=bash
resolve_runtime_db() {
  local repo_root="$1"
  local configured="${AGENTS_DB_PATH:-$repo_root/.runtime/db/agents-demo.db}"
  local absolute
  case "$configured" in
    /*) absolute="$configured" ;;
    *) absolute="$repo_root/$configured" ;;
  esac
  local parent
  if parent="$(cd -P "$(dirname "$absolute")" 2>/dev/null && pwd)"; then
    absolute="$parent/$(basename "$absolute")"
  fi

  case "$absolute" in
    "$repo_root/.claude/db/agents.db"|"$repo_root/.claude/db/agents-demo.db")
      echo "[runtime-db] refused tracked legacy DB: $absolute" >&2
      return 2
      ;;
  esac
  printf '%s\n' "$absolute"
}
