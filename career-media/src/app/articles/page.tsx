import Link from "next/link";
import { Search } from "lucide-react";
import { ArticleList } from "@/components/ArticleCards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ConsultationCta } from "@/components/ConsultationCta";
import { EntryGrid } from "@/components/EntryGrid";
import { getRepository } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  return pageMetadata({
    title: query ? `「${query}」の検索結果` : "記事一覧",
    description: "未経験転職・職種の違い・経験の活かし方・面接と書類・年収と働き方・転職準備など、テーマ別に記事を探せます。",
    path: "/articles",
    // 検索結果ページは index させない（canonical は一覧へ）
    noindex: Boolean(query),
  });
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const repo = getRepository();
  const [categories, articles] = await Promise.all([repo.listCategories(), query ? repo.search(query) : repo.listArticles()]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "記事一覧", path: "/articles" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <h1 className="text-[26px] font-bold text-ink sm:text-[30px]">{query ? `「${query}」の検索結果` : "記事一覧"}</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            {query ? `${articles.length}件の記事が見つかりました。` : `はじめての転職・未経験転職について、${articles.length}本の記事を公開しています。悩みや今の状況からも探せます。`}
          </p>

          <form action="/articles" method="get" role="search" className="mt-6">
            <label htmlFor="article-search" className="sr-only">
              記事を検索
            </label>
            <div className="flex overflow-hidden rounded-xl border border-line-strong bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <Search className="ml-4 h-5 w-5 self-center text-muted" aria-hidden="true" />
              <input id="article-search" name="q" type="search" defaultValue={query} placeholder="キーワードで検索（例: 研修、年間休日）" className="min-w-0 flex-1 px-3 py-3 text-[15px] outline-none" />
              <button type="submit" className="bg-ink px-5 text-sm font-bold text-white hover:bg-brand-strong">
                検索
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-white px-5" data-search-results={query ? "1" : undefined}>
            {articles.length > 0 ? (
              <ArticleList articles={articles} categories={categories} />
            ) : (
              <div className="py-12 text-center">
                <span className="motif motif-search mx-auto mb-3 block h-24 w-24 rounded-full bg-sky" aria-hidden="true" />
                <p className="font-bold text-ink">該当する記事が見つかりませんでした</p>
                <p className="mt-2 text-sm text-muted">短い言葉（例: 事務、休み、履歴書）で探すか、下の入口から選んでください。</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm font-bold">
                  <Link href="/concerns" className="rounded-full bg-white px-4 py-2 text-ink ring-1 ring-line hover:text-brand-strong">悩みから探す</Link>
                  <Link href="/situations" className="rounded-full bg-white px-4 py-2 text-ink ring-1 ring-line hover:text-brand-strong">今の状況から探す</Link>
                  <Link href="/check" className="rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-strong">条件整理チェック</Link>
                  <Link href="/articles" className="rounded-full bg-white px-4 py-2 text-ink ring-1 ring-line hover:text-brand-strong">すべての記事</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="concern-nav-title" className="rounded-[var(--radius-card)] border border-line bg-white p-5">
            <p id="concern-nav-title" className="text-sm font-bold text-ink">
              悩みから探す
            </p>
            <div className="mt-3">
              <EntryGrid group="concerns" variant="chip" />
            </div>
          </section>
          <section aria-labelledby="situation-nav-title" className="rounded-[var(--radius-card)] border border-line bg-white p-5">
            <p id="situation-nav-title" className="text-sm font-bold text-ink">
              今の状況から探す
            </p>
            <div className="mt-3">
              <EntryGrid group="situations" variant="chip" />
            </div>
          </section>
          <nav aria-labelledby="category-nav-title" className="rounded-[var(--radius-card)] border border-line bg-white p-5">
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
  );
}
