-- =============================================================================
-- 未経験転職オウンドメディア MVP schema
--
-- 補助金版 (subsidies / subsidy_prefectures / jgrants_id / amount / application
-- period) は使わない。記事は「articles」に統一し、公開状態は status で明示する。
--
-- ロール前提 (Supabase 標準): anon / authenticated / service_role
--   - anon          : published 記事の公開列だけ SELECT 可。条件整理チェックの匿名イベントだけ INSERT 可
--   - service_role  : pipeline (Writer / Reviewer / Publish) 専用。フロントでは使わない
-- =============================================================================

create extension if not exists pg_trgm;

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
create table if not exists categories (
  id          bigint generated always as identity primary key,
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name        text not null,
  description text not null default '',
  icon        text not null default 'folder',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- content_briefs (将来: Research → Benchmark/TTP → Planning の出力を受ける)
-- -----------------------------------------------------------------------------
create table if not exists content_briefs (
  id               uuid primary key default gen_random_uuid(),
  working_title    text not null,
  target_reader    text not null default '',
  search_intent    text not null default '',
  primary_keyword  text,
  pattern          text,               -- 参考にした構成パターン (Benchmark/TTP)
  source_refs      jsonb not null default '[]'::jsonb,
  status           text not null default 'idea' check (status in ('idea', 'planned', 'in_writing', 'done', 'dropped')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- articles
--   status:
--     draft     : Writer が作成中
--     review    : Reviewer の査読待ち / 査読中
--     published : 人間が公開を承認したもの (公開条件を CHECK で強制)
--     archived  : 公開終了
--   本文 (body_md) があることは公開可能を意味しない。
-- -----------------------------------------------------------------------------
create table if not exists articles (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique check (slug ~ '^[a-z0-9-]+$'),
  kind                    text not null default 'article' check (kind in ('article', 'news')),
  title                   text not null,
  summary                 text not null default '',
  body_md                 text not null default '',
  status                  text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  featured                boolean not null default false,
  published_at            timestamptz,
  updated_at              timestamptz not null default now(),
  reviewed_at             timestamptz,
  reviewed_by             text,
  information_checked_at  timestamptz,
  seo_title               text,
  seo_description         text,
  related_slugs           text[] not null default '{}',
  faq                     jsonb not null default '[]'::jsonb,   -- [{q, a}]
  news_meta               jsonb,                                -- kind='news' のときの構造化解説
  research_notes          jsonb,                                -- 調査メモ・引用・reviewer_verifications (非公開列)
  content_brief_id        uuid references content_briefs(id) on delete set null,
  current_version         integer not null default 1,
  created_at              timestamptz not null default now(),

  -- 公開には「公開日・査読日・情報確認日」がすべて必要
  constraint articles_published_requirements check (
    status <> 'published'
    or (published_at is not null and reviewed_at is not null and information_checked_at is not null)
  ),
  constraint articles_news_meta_required check (kind <> 'news' or status <> 'published' or news_meta is not null)
);

create index if not exists idx_articles_status_published on articles (status, published_at desc);
create index if not exists idx_articles_title_trgm on articles using gin (title gin_trgm_ops);
create index if not exists idx_articles_body_trgm on articles using gin (body_md gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- article_categories (多対多。is_primary は 1 記事 1 つ)
-- -----------------------------------------------------------------------------
create table if not exists article_categories (
  article_id   uuid not null references articles(id) on delete cascade,
  category_id  bigint not null references categories(id) on delete restrict,
  is_primary   boolean not null default false,
  primary key (article_id, category_id)
);
create unique index if not exists uq_article_primary_category on article_categories (article_id) where is_primary;

-- -----------------------------------------------------------------------------
-- article_sources (出典 URL 管理。政府ドメイン限定にはしない)
-- -----------------------------------------------------------------------------
create table if not exists article_sources (
  id               bigint generated always as identity primary key,
  article_id       uuid not null references articles(id) on delete cascade,
  title            text not null,
  publisher        text not null,
  url              text not null check (url ~ '^https?://'),
  accessed_at      date not null,
  used_for         text,
  sort_order       integer not null default 0,
  last_checked_at  timestamptz,         -- pipeline の URL 生存チェック結果
  last_status      integer
);
create index if not exists idx_article_sources_article on article_sources (article_id);

-- -----------------------------------------------------------------------------
-- article_versions (本文の版。将来 IKORABU の Writer/QA と接続する)
-- -----------------------------------------------------------------------------
create table if not exists article_versions (
  id          bigint generated always as identity primary key,
  article_id  uuid not null references articles(id) on delete cascade,
  version     integer not null,
  title       text not null,
  summary     text not null default '',
  body_md     text not null,
  created_by  text not null,            -- 'career-writer' / 人間の編集者名など
  created_at  timestamptz not null default now(),
  unique (article_id, version)
);

-- -----------------------------------------------------------------------------
-- article_reviews (Reviewer の判定。publish はここが approved であることを要求)
-- -----------------------------------------------------------------------------
create table if not exists article_reviews (
  id          bigint generated always as identity primary key,
  article_id  uuid not null references articles(id) on delete cascade,
  version     integer not null,
  reviewer    text not null,
  verdict     text not null check (verdict in ('approved', 'changes_requested')),
  checks      jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- article_metrics_daily (将来の Metrics → Learning 用。MVP では書き込みなし)
-- -----------------------------------------------------------------------------
create table if not exists article_metrics_daily (
  article_id          uuid not null references articles(id) on delete cascade,
  day                 date not null,
  pageviews           integer not null default 0,
  consultation_clicks integer not null default 0,
  check_starts        integer not null default 0,
  source              text not null default 'manual',
  primary key (article_id, day, source)
);

-- -----------------------------------------------------------------------------
-- condition_check_events (条件整理チェックの匿名集計。個人情報・自由記述は持たない)
-- -----------------------------------------------------------------------------
create table if not exists condition_check_events (
  id                  bigint generated always as identity primary key,
  event               text not null check (event in ('completed', 'consultation_click')),
  check_version       text not null,
  answers             jsonb not null default '{}'::jsonb,  -- 選択肢 ID のみ
  suggested_roles     text[] not null default '{}',
  created_at          timestamptz not null default now(),
  constraint answers_size check (pg_column_size(answers) < 4000)
);

-- -----------------------------------------------------------------------------
-- pipeline_runs (実行ログ。ZIP の reflections を Postgres に移したもの)
-- -----------------------------------------------------------------------------
create table if not exists pipeline_runs (
  id                bigint generated always as identity primary key,
  agent             text not null,             -- career-orchestrator / career-writer / career-reviewer / publish
  parent_run_id     bigint references pipeline_runs(id),
  trigger           text not null default 'manual',
  status            text not null default 'running' check (status in ('running', 'completed', 'error')),
  target_slug       text,
  items_processed   integer not null default 0,
  items_succeeded   integer not null default 0,
  items_failed      integer not null default 0,
  what_done         text,
  quality_check     text,
  self_improvement  text,
  error_message     text,
  metadata          jsonb,
  started_at        timestamptz not null default now(),
  ended_at          timestamptz
);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_content_briefs_updated_at on content_briefs;
create trigger trg_content_briefs_updated_at before update on content_briefs
  for each row execute function set_updated_at();

-- -----------------------------------------------------------------------------
-- 公開ガード: published へ遷移するときは「最新版の Reviewer 判定が approved」かつ
-- 出典 1 件以上を要求する。Writer (service_role) が誤って公開できないようにする。
-- seed / 移行時のみ session 変数 app.allow_unreviewed_publish='on' で回避可能。
-- -----------------------------------------------------------------------------
create or replace function guard_article_publish() returns trigger language plpgsql as $$
declare
  latest_verdict text;
begin
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    if coalesce(current_setting('app.allow_unreviewed_publish', true), 'off') = 'on' then
      return new;
    end if;
    select verdict into latest_verdict
      from article_reviews
     where article_id = new.id and version = new.current_version
     order by created_at desc
     limit 1;
    if latest_verdict is distinct from 'approved' then
      raise exception 'article % cannot be published: latest review for version % is %', new.slug, new.current_version, coalesce(latest_verdict, 'missing');
    end if;
    if not exists (select 1 from article_sources s where s.article_id = new.id) then
      raise exception 'article % cannot be published: no sources', new.slug;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_articles_publish_guard on articles;
create trigger trg_articles_publish_guard before insert or update of status on articles
  for each row execute function guard_article_publish();

-- -----------------------------------------------------------------------------
-- 検索 (日本語は形態素解析なしでも動くよう ILIKE + pg_trgm で実装)
-- security invoker なので RLS がそのまま効く。返すのは slug と順位だけ。
-- -----------------------------------------------------------------------------
create or replace function search_articles(q text)
returns table (slug text, rank integer)
language sql stable security invoker set search_path = public as $$
  with terms as (
    select t from regexp_split_to_table(btrim(coalesce(q, '')), '[[:space:]　]+') as t where t <> ''
  ), scored as (
    select a.slug,
           sum(case when a.title ilike '%' || t || '%' then 10 else 0 end
             + case when a.summary ilike '%' || t || '%' then 4 else 0 end
             + case when a.body_md ilike '%' || t || '%' then 1 else 0 end)::integer as rank,
           bool_and(a.title ilike '%' || t || '%' or a.summary ilike '%' || t || '%' or a.body_md ilike '%' || t || '%') as all_terms
      from articles a cross join terms
     where a.status = 'published'
     group by a.slug, a.published_at
  )
  select slug, rank from scored where all_terms and rank > 0 order by rank desc, slug limit 50;
$$;

-- =============================================================================
-- RLS / 権限
-- =============================================================================
alter table categories              enable row level security;
alter table articles                enable row level security;
alter table article_categories      enable row level security;
alter table article_sources         enable row level security;
alter table article_versions        enable row level security;
alter table article_reviews         enable row level security;
alter table article_metrics_daily   enable row level security;
alter table content_briefs          enable row level security;
alter table condition_check_events  enable row level security;
alter table pipeline_runs           enable row level security;

-- まず anon / authenticated から全権限を外し、必要なものだけ付ける
revoke all on categories, articles, article_categories, article_sources, article_versions,
  article_reviews, article_metrics_daily, content_briefs, condition_check_events, pipeline_runs
  from anon, authenticated;

-- categories: 全件公開
grant select on categories to anon, authenticated;
drop policy if exists categories_public_read on categories;
create policy categories_public_read on categories for select to anon, authenticated using (true);

-- articles: 公開列だけ grant (research_notes / content_brief_id は非公開)
grant select (
  id, slug, kind, title, summary, body_md, status, featured, published_at, updated_at,
  reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description,
  related_slugs, faq, news_meta
) on articles to anon, authenticated;

drop policy if exists articles_public_read on articles;
create policy articles_public_read on articles for select to anon, authenticated
  using (status = 'published' and published_at <= now());

-- article_categories / article_sources: 公開記事に紐づくものだけ
grant select on article_categories to anon, authenticated;
drop policy if exists article_categories_public_read on article_categories;
create policy article_categories_public_read on article_categories for select to anon, authenticated
  using (exists (select 1 from articles a where a.id = article_id and a.status = 'published' and a.published_at <= now()));

grant select (id, article_id, title, publisher, url, accessed_at, used_for, sort_order) on article_sources to anon, authenticated;
drop policy if exists article_sources_public_read on article_sources;
create policy article_sources_public_read on article_sources for select to anon, authenticated
  using (exists (select 1 from articles a where a.id = article_id and a.status = 'published' and a.published_at <= now()));

-- condition_check_events: 匿名 INSERT のみ (読み取り不可)
grant insert (event, check_version, answers, suggested_roles) on condition_check_events to anon, authenticated;
drop policy if exists condition_check_events_insert on condition_check_events;
create policy condition_check_events_insert on condition_check_events for insert to anon, authenticated
  with check (event in ('completed', 'consultation_click'));

grant execute on function search_articles(text) to anon, authenticated;

-- article_versions / article_reviews / article_metrics_daily / content_briefs / pipeline_runs:
-- anon / authenticated にはポリシーを作らない (= 読み書き不可)。service_role は RLS をバイパスする。
