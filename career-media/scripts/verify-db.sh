#!/usr/bin/env bash
# supabase/migrations と supabase/seed.sql を使い捨てのローカル Postgres に流し、
# 公開状態・RLS・列権限・公開ガード・検索を検証する。
#   bash scripts/verify-db.sh
# 前提: PostgreSQL 16 のサーバーバイナリ (initdb / pg_ctl)。Supabase 本番には接続しない。
set -euo pipefail
cd "$(dirname "$0")/.."

PG_BIN="${PG_BIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
PORT="${VERIFY_DB_PORT:-54329}"
DATA="$(pwd)/.runtime/verify-pg"
SOCK="$DATA/sock"

cleanup() { "$PG_BIN/pg_ctl" -D "$DATA/data" -m immediate stop >/dev/null 2>&1 || true; }
trap cleanup EXIT

rm -rf "$DATA" && mkdir -p "$SOCK"
# root では initdb できないため、必要なら postgres ユーザーで実行する
RUN=()
if [ "$(id -u)" = "0" ]; then chown -R postgres "$DATA"; RUN=(runuser -u postgres --); fi
"${RUN[@]}" "$PG_BIN/initdb" -D "$DATA/data" -U postgres --auth=trust -E UTF8 --locale=C.UTF-8 >/dev/null
"${RUN[@]}" "$PG_BIN/pg_ctl" -D "$DATA/data" -o "-p $PORT -k $SOCK -c listen_addresses=''" -l "$DATA/pg.log" -w start >/dev/null

PSQL=(psql -h "$SOCK" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q)

# Supabase と同じロールを用意
"${PSQL[@]}" <<'SQL'
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
grant usage on schema public to anon, authenticated, service_role;
SQL

"${PSQL[@]}" -c "set client_min_messages = warning" -f supabase/migrations/0001_career_media.sql
"${PSQL[@]}" -f supabase/seed.sql

fail=0
expect() { # expect <説明> <期待値> <SQL>
  local got
  got=$("${PSQL[@]}" -tA -c "$3" 2>&1 | tail -1) || true
  if [ "$got" = "$2" ]; then echo "  ok   $1"; else echo "  FAIL $1 (expected '$2', got '$got')"; fail=1; fi
}
expect_error() { # expect_error <説明> <エラーに含まれる文字列> <SQL>
  local out
  if out=$("${PSQL[@]}" -tA -c "$3" 2>&1); then echo "  FAIL $1 (no error)"; fail=1;
  elif echo "$out" | grep -q "$2"; then echo "  ok   $1"; else echo "  FAIL $1 ($out)"; fail=1; fi
}

echo "schema / seed"
expect "全記事が投入されている" "$(ls content/articles content/news | grep -c '\.md$')" "select count(*) from articles"
expect "published は公開条件を満たす" "0" "select count(*) from articles where status='published' and (published_at is null or reviewed_at is null or information_checked_at is null)"

echo "anon (公開サイトと同じ権限)"
expect "anon は published だけ見える" "$(grep -l '^status: published' content/articles/*.md content/news/*.md | wc -l)" "set role anon; select count(*) from articles"
expect "draft は見えない" "0" "set role anon; select count(*) from articles where slug='kyujin-hyo-yomikata'"
expect "review は見えない" "0" "set role anon; select count(*) from articles where slug='dainishinsotsu-tenshoku-timing'"
PUBLISHED_SOURCES=$("${PSQL[@]}" -tA -c "select count(*) from article_sources s join articles a on a.id = s.article_id where a.status = 'published'")
ALL_SOURCES=$("${PSQL[@]}" -tA -c "select count(*) from article_sources")
[ "$PUBLISHED_SOURCES" -lt "$ALL_SOURCES" ] || { echo "  FAIL 未公開記事の出典がテストデータにない"; fail=1; }
expect "出典は公開記事の分だけ見える（未公開記事の出典は見えない）" "$PUBLISHED_SOURCES" "set role anon; select count(*) from article_sources"
expect_error "research_notes は読めない（列権限）" "permission denied" "set role anon; select research_notes from articles limit 1"
expect_error "査読記録は読めない" "permission denied" "set role anon; select count(*) from article_reviews"
expect_error "実行ログは読めない" "permission denied" "set role anon; select count(*) from pipeline_runs"
expect_error "記事は書き換えられない" "permission denied" "set role anon; update articles set title='x'"
expect "検索 RPC（研修）" "t" "set role anon; select count(*) > 0 from search_articles('研修')"
expect "検索 RPC は未公開記事を返さない（draft のみに含まれる語）" "0" "set role anon; select count(*) from search_articles('学歴不問')"
expect "条件整理イベントは匿名 INSERT できる" "1" "set role anon; insert into condition_check_events (event, check_version, answers) values ('completed', 'test', '{}'); reset role; select count(*) from condition_check_events"
expect_error "条件整理イベントは読めない" "permission denied" "set role anon; select count(*) from condition_check_events"

echo "公開ガード（generate と publish の分離）"
expect_error "査読なしでは published にできない" "cannot be published" "update articles set status='published', published_at=now(), reviewed_at=now(), information_checked_at=now() where slug='dainishinsotsu-tenshoku-timing'"
expect_error "公開日・査読日・情報確認日のない published は CHECK で拒否" "articles_published_requirements" "set app.allow_unreviewed_publish = 'on'; insert into articles (slug, title, status) values ('bad-publish', 'x', 'published')"
expect_error "approved 査読があっても情報確認日がなければ拒否" "articles_published_requirements" "begin; insert into article_reviews (article_id, version, reviewer, verdict) select id, current_version, 'test', 'approved' from articles where slug='dainishinsotsu-tenshoku-timing'; update articles set status='published', published_at=now(), reviewed_at=now() where slug='dainishinsotsu-tenshoku-timing'; rollback;"
expect "approved 査読 + 公開条件がそろえば公開できる" "published" "begin; insert into article_reviews (article_id, version, reviewer, verdict) select id, current_version, 'test', 'approved' from articles where slug='dainishinsotsu-tenshoku-timing'; update articles set status='published', published_at=now(), reviewed_at=now(), information_checked_at=now() where slug='dainishinsotsu-tenshoku-timing'; select status from articles where slug='dainishinsotsu-tenshoku-timing'; rollback;"
expect "公開後も anon からは公開済みのみ（ロールバック確認）" "0" "set role anon; select count(*) from articles where slug='dainishinsotsu-tenshoku-timing'"

if [ "$fail" = "0" ]; then echo "DB VERIFY: PASSED"; else echo "DB VERIFY: FAILED"; exit 1; fi
