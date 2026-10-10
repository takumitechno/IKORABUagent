import Link from "next/link";
import type { ArticleSummary, Category } from "@/lib/content/types";
import { articlePath } from "@/lib/seo";
import { findTaxonomy, taxonomyPath, type TaxonomyGroup } from "@/lib/taxonomy";
import { categoryTone } from "./CategoryIcon";
import { announcedLabel, formatDate, formatDateShort } from "./DateMeta";
import { Eyecatch } from "./Eyecatch";

export function findCategory(categories: Category[], slug?: string) {
  return categories.find((c) => c.slug === slug);
}

export function CategoryChip({ category }: { category?: Category }) {
  if (!category) return null;
  const tone = categoryTone(category.slug);
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tone.bg} ${tone.fg}`}>{category.name}</span>;
}

function Meta({ article, category }: { article: ArticleSummary; category?: Category }) {
  const label = article.kind === "news" ? "ニュース解説" : category?.name;
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-[12px] text-muted">
      {label && <span className="font-bold text-brand-strong">{label}</span>}
      <time dateTime={article.publishedAt ?? article.updatedAt}>{formatDateShort(article.publishedAt ?? article.updatedAt)}</time>
    </p>
  );
}

/** 大きな注目記事カード（デスクトップでは横並び） */
export function LeadCard({ article, categories }: { article: ArticleSummary; categories: Category[] }) {
  const category = findCategory(categories, article.categories[0]);
  return (
    <Link href={articlePath(article)} className="tap lift group grid overflow-hidden rounded-2xl border border-line bg-white">
      <Eyecatch article={article} category={category} size="lg" className="rounded-none" />
      <div className="flex flex-col p-5 sm:p-7">
        <Meta article={article} category={category} />
        <h3 className="mt-2 text-[19px] font-bold leading-[1.55] text-ink group-hover:text-brand-strong sm:text-[22px]">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-7 text-muted">{article.summary}</p>
      </div>
    </Link>
  );
}

/** 中サイズのカード（アイキャッチ＋タイトル） */
export function FeatureCard({ article, categories, showSummary = true }: { article: ArticleSummary; categories: Category[]; showSummary?: boolean }) {
  const category = findCategory(categories, article.categories[0]);
  const effective = article.kind === "news" ? article.news?.announcedAt : undefined;
  return (
    <Link href={articlePath(article)} className="tap lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <Eyecatch article={article} category={category} size="md" className="rounded-none" />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[15.5px] font-bold leading-[1.6] text-ink group-hover:text-brand-strong">{article.title}</h3>
        {showSummary && <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted">{article.summary}</p>}
        <div className="mt-auto pt-3">
          {effective ? (
            <span className="text-[12px] font-bold text-mist-ink">
              {announcedLabel(effective)} {formatDate(effective)}
            </span>
          ) : (
            <time dateTime={article.updatedAt} className="text-xs text-muted">
              更新 {formatDateShort(article.updatedAt)}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}

/** 一覧・新着用のコンパクトな行（小さなサムネイル付き） */
export function ArticleRow({ article, categories, showSummary = true }: { article: ArticleSummary; categories: Category[]; showSummary?: boolean }) {
  const category = findCategory(categories, article.categories[0]);
  return (
    <li>
      <Link href={articlePath(article)} className="tap group flex gap-4 py-4">
        <Eyecatch article={article} category={category} size="sm" className="w-[96px] self-start sm:w-[132px]" />
        <div className="min-w-0 flex-1">
          <Meta article={article} category={category} />
          <h3 className="mt-1 text-[15px] font-bold leading-[1.6] text-ink group-hover:text-brand-strong sm:text-[15.5px]">{article.title}</h3>
          {showSummary && (
            <div className="hidden sm:block">
              <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-muted">{article.summary}</p>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

export function ArticleList({ articles, categories, showSummary = true, className = "" }: { articles: ArticleSummary[]; categories: Category[]; showSummary?: boolean; className?: string }) {
  return (
    <ul className={`anim-list divide-y divide-line ${className}`}>
      {articles.map((a) => (
        <ArticleRow key={a.slug} article={a} categories={categories} showSummary={showSummary} />
      ))}
    </ul>
  );
}

export function TagChips({ article, groups = ["concerns", "situations", "roles"] }: { article: Pick<ArticleSummary, TaxonomyGroup>; groups?: TaxonomyGroup[] }) {
  const tags = groups.flatMap((g) => article[g].map((slug) => ({ g, item: findTaxonomy(g, slug) }))).filter((t) => t.item);
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map(({ g, item }) => (
        <li key={`${g}-${item!.slug}`}>
          <Link href={taxonomyPath(g, item!.slug)} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[12.5px] font-medium text-body ring-1 ring-line hover:text-brand-strong hover:ring-brand/40">
            #{item!.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
