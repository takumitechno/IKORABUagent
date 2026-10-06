import Link from "next/link";
import type { ArticleSummary, Category } from "@/lib/content/types";
import { articlePath } from "@/lib/seo";
import { CategoryIcon, categoryTone } from "./CategoryIcon";
import { formatDateShort } from "./DateMeta";

function CategoryChip({ category }: { category?: Category }) {
  if (!category) return null;
  const tone = categoryTone(category.slug);
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tone.bg} ${tone.fg}`}>{category.name}</span>;
}

export function findCategory(categories: Category[], slug?: string) {
  return categories.find((c) => c.slug === slug);
}

/** おすすめ記事用のカード */
export function FeatureCard({ article, categories }: { article: ArticleSummary; categories: Category[] }) {
  const category = findCategory(categories, article.categories[0]);
  const tone = categoryTone(category?.slug ?? "");
  return (
    <Link
      href={articlePath(article)}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]"
    >
      <div className={`relative flex h-28 items-end justify-between px-5 pb-4 ${tone.bg}`}>
        <span className={`${tone.fg} opacity-90`}>
          <CategoryIcon name={category?.icon ?? "folder"} className="h-9 w-9" />
        </span>
        <span className={`text-[11px] font-bold tracking-wider ${tone.fg}`}>{category?.name}</span>
        <svg className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.18]" viewBox="0 0 200 120" aria-hidden="true">
          <circle cx="170" cy="20" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" className={tone.fg} />
          <circle cx="170" cy="20" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" className={tone.fg} />
        </svg>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[17px] font-bold leading-7 text-ink group-hover:text-brand-strong">{article.title}</h3>
        <p className="mt-2 line-clamp-3 text-[13.5px] leading-6 text-muted">{article.summary}</p>
        <p className="mt-auto pt-4 text-xs text-muted">
          <time dateTime={article.updatedAt}>更新 {formatDateShort(article.updatedAt)}</time>
        </p>
      </div>
    </Link>
  );
}

/** 一覧・新着用の行 */
export function ArticleRow({ article, categories }: { article: ArticleSummary; categories: Category[] }) {
  const category = findCategory(categories, article.categories[0]);
  return (
    <li>
      <Link href={articlePath(article)} className="group flex gap-4 py-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryChip category={category} />
            {article.kind === "news" && <span className="rounded-full border border-line px-2 py-0.5 text-[11px] font-bold text-muted">解説</span>}
            <time dateTime={article.publishedAt ?? article.updatedAt} className="text-xs text-muted">
              {formatDateShort(article.publishedAt ?? article.updatedAt)}
            </time>
          </div>
          <h3 className="mt-2 text-[16px] font-bold leading-7 text-ink group-hover:text-brand-strong sm:text-[17px]">{article.title}</h3>
          <p className="mt-1 line-clamp-2 text-[13.5px] leading-6 text-muted">{article.summary}</p>
        </div>
      </Link>
    </li>
  );
}

export function ArticleList({ articles, categories }: { articles: ArticleSummary[]; categories: Category[] }) {
  return (
    <ul className="divide-y divide-line">
      {articles.map((a) => (
        <ArticleRow key={a.slug} article={a} categories={categories} />
      ))}
    </ul>
  );
}

export { CategoryChip };
