import Link from "next/link";
import { Search } from "lucide-react";
import { ArticleList, FeatureCard } from "@/components/ArticleCards";
import { PageHero } from "@/components/PageHero";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ConsultationCta } from "@/components/ConsultationCta";
import { EntryGrid } from "@/components/EntryGrid";
import { getRepository } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ARTICLES_PER_PAGE, articlePagePath } from "@/lib/content-discovery";

export type CatalogueSearchParams = Promise<{ q?: string | string[] }>;
type Props = { searchParams: CatalogueSearchParams; page?: number };

export async function catalogueMetadata({ searchParams, page = 1 }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 100) : "";
  return pageMetadata({
    title: query ? `「${query}」の検索結果${page > 1 ? `・${page}ページ目` : ""}` : `記事一覧${page > 1 ? `・${page}ページ目` : ""}`,
    description: query ? `「${query}」に関する転職の記事を探せます。${page}ページ目の検索結果です。` : `未経験転職・職種の違い・経験の活かし方・面接と書類・年収と働き方・転職準備など、テーマ別に記事を探せます。${page > 1 ? `記事一覧の${page}ページ目です。` : ""}`,
    path: query ? "/articles" : articlePagePath(page),
    // 検索結果ページは index させない（canonical は一覧へ）
    noindex: Boolean(query),
  });
}

export async function ArticleCatalogue({ searchParams, page = 1 }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const repo = getRepository();
  const [categories, articles] = await Promise.all([repo.listCategories(), query ? repo.search(query) : repo.listArticles()]);
  const totalPages = Math.max(1, Math.ceil(articles.length / ARTICLES_PER_PAGE));
  if (page > totalPages) notFound();
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const visible = articles.slice(offset, offset + ARTICLES_PER_PAGE);

  return (
    <>
      <PageHero
        compact
        crumbs={[{ name: "ホーム", path: "/" }, { name: "記事一覧", path: "/articles" }]}
        eyebrow={query ? "検索結果" : `${articles.length}本の記事`}
        title={query ? `「${query}」の検索結果` : "記事一覧"}
        lead={query ? `${articles.length}件の記事が見つかりました。` : "はじめての転職・未経験転職の疑問に、記事で答えます。"}
        icon="book-open"
      >
        <form action="/articles" method="get" role="search" className="max-w-xl">
          <label htmlFor="article-search" className="sr-only">
            記事を検索
          </label>
          <div className="flex overflow-hidden rounded-xl border border-line-strong bg-surface p-1.5 focus-within:ring-2 focus-within:ring-brand">
            <Search className="ml-3 h-5 w-5 self-center text-muted" aria-hidden="true" />
            <input id="article-search" name="q" type="search" defaultValue={query} placeholder="事務、土日休み、面接…" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[15px] text-ink outline-none" />
            <button type="submit" className="rounded-xl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-press">
              検索
            </button>
          </div>
        </form>
      </PageHero>
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          {!query && page === 1 && <section className="catalogue-featured" aria-labelledby="catalogue-featured-title"><h2 id="catalogue-featured-title">悩みに合わせて、まずこの3本</h2><ul>{["sekkyaku-keiken-ikasu", "donichi-yasumi-nenshu-hikaku", "freeter-seishain-hajimeni"].map(slug => articles.find(a => a.slug === slug)).filter(a => a !== undefined).map(article => <li key={article.slug}><FeatureCard article={article} categories={categories} showSummary={false} /></li>)}</ul></section>}
          <p data-catalogue-count className="mb-3 text-sm text-muted">{articles.length > 0 ? `${articles.length}本中 ${offset + 1}〜${offset + visible.length}本を表示` : "検索結果 0件"}{page > 1 && `・${page}ページ目`}</p>
          <div data-catalogue-list className="border-y border-line" data-search-results={query ? "1" : undefined}>
            {articles.length > 0 ? (
              <ArticleList articles={visible} categories={categories} />
            ) : (
              <div className="py-12 text-center">
                <span className="motif motif-search mx-auto mb-3 block h-24 w-24 rounded-full bg-sky" aria-hidden="true" />
                <p className="font-bold text-ink">該当する記事が見つかりませんでした</p>
                <p className="mt-2 text-sm text-muted">短い言葉（例: 事務、休み、履歴書）で探すか、下の入口から選んでください。</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm font-bold">
                  <Link href="/concerns" className="rounded-full bg-surface px-4 py-2 text-ink ring-1 ring-line hover:text-brand-strong">悩みから探す</Link>
                  <Link href="/situations" className="rounded-full bg-surface px-4 py-2 text-ink ring-1 ring-line hover:text-brand-strong">今の状況から探す</Link>
                  <Link href="/check" className="rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-press">条件整理チェック</Link>
                  <Link href="/articles" className="rounded-full bg-surface px-4 py-2 text-ink ring-1 ring-line hover:text-brand-strong">すべての記事</Link>
                </div>
              </div>
            )}
          </div>
          {totalPages > 1 && <nav aria-label="記事一覧のページ" className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && <Link href={articlePagePath(page - 1, query)} className="rounded-full border border-line px-4 py-2 text-sm font-bold text-brand-strong">前へ</Link>}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => <Link key={n} href={articlePagePath(n, query)} aria-current={n === page ? "page" : undefined} aria-label={`${n}ページ目`} className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${n === page ? "bg-brand text-white" : "border border-line bg-surface text-ink hover:text-brand-strong"}`}>{n}</Link>)}
            {page < totalPages && <Link href={articlePagePath(page + 1, query)} className="rounded-full border border-line px-4 py-2 text-sm font-bold text-brand-strong">次へ</Link>}
          </nav>}
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="concern-nav-title" className="border-b border-line pb-6">
            <p id="concern-nav-title" className="text-sm font-bold text-ink">
              悩みから探す
            </p>
            <div className="mt-3">
              <EntryGrid group="concerns" variant="chip" />
            </div>
          </section>
          <section aria-labelledby="situation-nav-title" className="border-b border-line pb-6">
            <p id="situation-nav-title" className="text-sm font-bold text-ink">
              今の状況から探す
            </p>
            <div className="mt-3">
              <EntryGrid group="situations" variant="chip" />
            </div>
          </section>
          <nav aria-labelledby="category-nav-title" className="border-b border-line pb-6">
            <p id="category-nav-title" className="text-sm font-bold text-ink">
              テーマから探す
            </p>
            <ul className="mt-3 space-y-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={c.slug === "news" ? "/news" : `/categories/${c.slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-body hover:bg-brand-tint hover:text-brand-strong">
                    <CategoryIcon name={c.icon} className="h-4 w-4 text-brand" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ConsultationCta placement="article-sidebar" variant="compact" />
        </aside>
      </div>
    </div>
    </>
  );
}
