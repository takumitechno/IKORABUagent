-- =============================================================================
-- 0003: カードのイラストを記事ごとに指定する列（任意）
-- 値は src/lib/illustrations/motifs.ts のイラスト名（pipeline の C16 で検証する）。
-- 空のときは、入口タグとカテゴリからイラストが決まる。
-- =============================================================================

alter table articles add column if not exists illustration text;

grant select (illustration) on articles to anon, authenticated;
