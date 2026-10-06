-- =============================================================================
-- 0002: 記事を探す入口（職種 / 悩み / 今の状況）とアイキャッチ文言、編集部おすすめ
-- タグの語彙は src/lib/taxonomy.ts が正本（pipeline の C16 で検証する）。
-- =============================================================================

alter table articles add column if not exists roles       text[]  not null default '{}';
alter table articles add column if not exists concerns    text[]  not null default '{}';
alter table articles add column if not exists situations  text[]  not null default '{}';
alter table articles add column if not exists eyecatch    text[]  not null default '{}';
alter table articles add column if not exists recommended boolean not null default false;

create index if not exists idx_articles_roles      on articles using gin (roles);
create index if not exists idx_articles_concerns   on articles using gin (concerns);
create index if not exists idx_articles_situations on articles using gin (situations);

-- 公開列に追加（research_notes などの非公開列は引き続き grant しない）
grant select (roles, concerns, situations, eyecatch, recommended) on articles to anon, authenticated;
