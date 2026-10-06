import Link from "next/link";
import { Search } from "lucide-react";
import { ArticleList } from "@/components/ArticleCards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ConsultationCta } from "@/components/ConsultationCta";
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
            {query ? `${articles.length}件の記事が見つかりました。` : "未経験からの転職について、テーマごとに記事を探せます。"}
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

          <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-white px-5">
            {articles.length > 0 ? (
              <ArticleList articles={articles} categories={categories} />
            ) : (
              <div className="py-12 text-center">
                <p className="font-bold text-ink">該当する記事が見つかりませんでした</p>
                <p className="mt-2 text-sm text-muted">別のキーワードで探すか、テーマから記事を選んでください。</p>
                <Link href="/articles" className="mt-4 inline-block text-sm font-bold text-brand-strong underline">
                  すべての記事を見る
                </Link>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
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
