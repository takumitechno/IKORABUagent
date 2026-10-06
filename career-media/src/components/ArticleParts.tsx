import Link from "next/link";
import { BadgeCheck, BookMarked, CalendarCheck2, ChevronDown, ExternalLink, ListOrdered, RefreshCw } from "lucide-react";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import type { Article, ArticleSummary, Category } from "@/lib/content/types";
import type { Heading } from "@/lib/markdown";
import { CategoryChip, FeatureCard, findCategory } from "./ArticleCards";
import { formatDate } from "./DateMeta";

export function ArticleHeader({ article, categories, readingMinutes }: { article: Article; categories: Category[]; readingMinutes: number }) {
  return (
    <header>
      <div className="flex flex-wrap gap-2">
        {article.categories.map((slug) => (
          <Link key={slug} href={slug === "news" ? "/news" : `/categories/${slug}`}>
            <CategoryChip category={findCategory(categories, slug)} />
          </Link>
        ))}
      </div>
      <h1 className="mt-4 text-[24px] font-bold leading-[1.55] tracking-wide text-ink sm:text-[30px]">{article.title}</h1>
      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-muted">
        <div className="flex items-center gap-1.5">
          <dt className="flex items-center gap-1">
            <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
            公開
          </dt>
          <dd>
            <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            更新
          </dt>
          <dd>
            <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            情報確認日
          </dt>
          <dd>
            <time dateTime={article.informationCheckedAt ?? undefined}>{formatDate(article.informationCheckedAt)}</time>
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt>読了目安</dt>
          <dd>約{readingMinutes}分</dd>
        </div>
      </dl>
      <div className="mt-6 rounded-[var(--radius-card)] border border-brand/20 bg-brand-tint p-5">
        <p className="text-xs font-bold tracking-wider text-brand-strong">この記事でわかること</p>
        <p className="mt-2 text-[15px] leading-8 text-body">{article.summary}</p>
      </div>
      <p className="mt-4 text-xs leading-6 text-muted">
        編集: {site.editorialTeam}（運営: {partner.operatorDisplay}）・
        <Link href="/editorial-policy" className="underline hover:text-brand-strong">
          編集方針
        </Link>
      </p>
    </header>
  );
}

export function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-1">
      {headings.map((h, i) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className="flex gap-2 rounded-md px-2 py-1.5 text-[13px] leading-6 text-body hover:bg-brand-tint hover:text-brand-strong">
            <span className="w-4 shrink-0 text-right font-bold text-brand">{i + 1}</span>
            <span>{h.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/** スマホ・タブレット用の折りたたみ目次 */
export function MobileToc({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <details className="group mt-6 rounded-[var(--radius-card)] border border-line bg-white lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-bold text-ink">
        <span className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-brand" aria-hidden="true" />
          目次
        </span>
        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-line px-3 py-3">
        <TocList headings={headings} />
      </div>
    </details>
  );
}

export function FaqSection({ article }: { article: Pick<Article, "faq"> }) {
  if (article.faq.length === 0) return null;
  return (
    <section aria-labelledby="faq-title" className="mt-14">
      <h2 id="faq-title" className="text-xl font-bold text-ink">
        よくある質問
      </h2>
      <div className="mt-5 space-y-3">
        {article.faq.map((f) => (
          <details key={f.question} className="group rounded-[var(--radius-card)] border border-line bg-white" open>
            <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">Q</span>
              <span className="flex-1 text-[15px] font-bold leading-7 text-ink">{f.question}</span>
              <ChevronDown className="mt-1.5 h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">A</span>
              <p className="flex-1 text-[15px] leading-8 text-body">{f.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SourcesSection({ article }: { article: Pick<Article, "sources"> }) {
  return (
    <section aria-labelledby="sources-title" className="mt-14">
      <h2 id="sources-title" className="flex items-center gap-2 text-xl font-bold text-ink">
        <BookMarked className="h-5 w-5 text-brand" aria-hidden="true" />
        出典・参考情報
      </h2>
      <ol className="mt-5 space-y-3">
        {article.sources.map((s, i) => (
          <li key={s.url + i} className="rounded-xl border border-line bg-white p-4 text-sm">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 font-bold leading-6 text-brand-strong hover:underline">
              {s.title}
              <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only">（外部サイト）</span>
            </a>
            <p className="mt-1 text-xs leading-5 text-muted">
              {s.publisher}・{formatDate(s.accessedAt)}確認{s.usedFor ? `・参照箇所: ${s.usedFor}` : ""}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EditorialNote({ article }: { article: Article }) {
  return (
    <section aria-label="記事の確認について" className="mt-10 rounded-[var(--radius-card)] bg-canvas p-5 ring-1 ring-line">
      <p className="text-sm font-bold text-ink">この記事の確認について</p>
      <dl className="mt-3 grid gap-x-6 gap-y-1 text-[13px] text-body sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-muted">確認・編集</dt>
          <dd>{article.reviewedBy ?? site.editorialTeam}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">最終確認日</dt>
          <dd>{formatDate(article.reviewedAt)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">情報確認日</dt>
          <dd>{formatDate(article.informationCheckedAt)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">出典</dt>
          <dd>{article.sources.length}件</dd>
        </div>
      </dl>
      <p className="mt-3 text-[12.5px] leading-6 text-muted">
        記事の内容は情報確認日時点のものです。制度や条件は変わることがあるため、最新の情報は出典元でご確認ください。個別の状況についての判断は、記事だけで決めずに専門の窓口や相談先にご相談ください。
      </p>
      <p className="mt-2 text-[12.5px] leading-6 text-muted">
        {partner.disclosure}{" "}
        <Link href="/disclosure" className="underline hover:text-brand-strong">
          広告・提携表記
        </Link>
      </p>
    </section>
  );
}

export function RelatedArticles({ articles, categories }: { articles: ArticleSummary[]; categories: Category[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-title" className="mt-16">
      <h2 id="related-title" className="text-xl font-bold text-ink">
        あわせて読みたい記事
      </h2>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {articles.map((a) => (
          <FeatureCard key={a.slug} article={a} categories={categories} />
        ))}
      </div>
    </section>
  );
}

/** related に指定された記事を優先し、足りなければ同じカテゴリの記事で補う */
export function pickRelated(article: Article, all: ArticleSummary[], limit = 3): ArticleSummary[] {
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const picked: ArticleSummary[] = [];
  for (const slug of article.related) {
    const a = bySlug.get(slug);
    if (a && a.slug !== article.slug && !picked.includes(a)) picked.push(a);
  }
  for (const a of all) {
    if (picked.length >= limit) break;
    if (a.slug !== article.slug && !picked.includes(a) && a.categories.some((c) => article.categories.includes(c))) picked.push(a);
  }
  return picked.slice(0, limit);
}
