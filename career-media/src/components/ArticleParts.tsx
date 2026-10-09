import Link from "next/link";
import { BookMarked, ChevronDown, ExternalLink, Info, ListOrdered } from "lucide-react";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import type { Article, ArticleSummary, Category } from "@/lib/content/types";
import type { Heading } from "@/lib/markdown";
import { ArticleList, findCategory } from "./ArticleCards";
import { Eyecatch } from "./Eyecatch";
import { formatDate } from "./DateMeta";

export function ArticleHeader({ article, categories, readingMinutes, headings = [] }: { article: Article; categories: Category[]; readingMinutes: number; headings?: Heading[] }) {
  const category = findCategory(categories, article.categories[0]);
  return (
    <header>
      {category && (
        <Link href={`/categories/${category.slug}`} className="text-[13px] font-bold text-brand-strong hover:underline">
          {category.name}
        </Link>
      )}
      <h1 className="mt-2 text-[24px] font-bold leading-[1.5] text-ink sm:text-[32px]">{article.title}</h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
        <span>
          <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time> 更新
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
        <span>約{readingMinutes}分で読めます</span>
      </p>
      <Eyecatch article={article} category={category} size="banner" className="mt-5" />
      {site.sampleContent && <SampleNotice />}
      <p className="mt-6 text-[16px] leading-[1.95] text-body">{article.summary}</p>
      <MobileToc headings={headings} />
    </header>
  );
}

/** 提案用のサンプル原稿であることの表示（人による最終確認の前であることを隠さない） */
export function SampleNotice() {
  return (
    <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-5 text-muted">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        提案用のサンプル原稿です（人による最終確認・公開承認の前）。
        <Link href="/editorial-policy" className="underline underline-offset-2 hover:text-brand-strong">
          詳しく
        </Link>
      </span>
    </p>
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

/** スマホ・タブレット用の折りたたみ目次（最初は閉じておく） */
export function MobileToc({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <details className="group mt-6 rounded-xl border border-line bg-white lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[14px] font-bold text-ink">
        <span className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-brand" aria-hidden="true" />
          目次
          <span className="text-[12px] font-medium text-muted">{headings.length}項目</span>
        </span>
        <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-line px-2 py-2">
        <TocList headings={headings} />
      </div>
    </details>
  );
}

export function FaqSection({ article }: { article: Pick<Article, "faq"> }) {
  if (article.faq.length === 0) return null;
  return (
    <section aria-labelledby="faq-title" className="mt-14">
      <h2 id="faq-title" className="text-[19px] font-bold text-ink">
        よくある質問
      </h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {article.faq.map((f) => (
          <details key={f.question} className="group">
            <summary className="flex cursor-pointer list-none items-start gap-3 py-4">
              <span className="mt-0.5 text-[15px] font-bold text-brand">Q</span>
              <span className="flex-1 text-[15px] font-bold leading-7 text-ink">{f.question}</span>
              <ChevronDown className="mt-1.5 h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="pb-5 pl-7 text-[15px] leading-[1.95] text-body">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** 出典の一覧（折りたたみの中で使う） */
export function SourcesSection({ article }: { article: Pick<Article, "sources"> }) {
  return (
    <ol className="space-y-3">
      {article.sources.map((s, i) => (
        <li key={s.url + i} className="text-[13px] leading-6">
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 font-bold text-brand-strong hover:underline">
            {s.title}
            <ExternalLink className="mt-1 h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="sr-only">（外部サイト）</span>
          </a>
          <span className="block text-[12px] text-muted">
            {s.publisher}・{formatDate(s.accessedAt)}確認
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * 記事の末尾にまとめる「出典とこの記事について」。読み物の邪魔にならないよう折りたたむが、
 * 出典・日付・人による確認の状態・提携の表記は、開けばすべて見られる。
 */
export function EditorialNote({ article }: { article: Article }) {
  const rows: [string, string][] = site.sampleContent
    ? [
        ["作成", formatDate(article.publishedAt)],
        ["更新", formatDate(article.updatedAt)],
        ["情報確認日", formatDate(article.informationCheckedAt)],
        ["機械チェック・AI査読", formatDate(article.reviewedAt)],
        ["人による最終確認", "正式公開前に実施"],
      ]
    : [
        ["公開", formatDate(article.publishedAt)],
        ["更新", formatDate(article.updatedAt)],
        ["情報確認日", formatDate(article.informationCheckedAt)],
        ["確認・編集", article.reviewedBy ?? site.editorialTeam],
        ["最終確認日", formatDate(article.reviewedAt)],
      ];
  return (
    <section aria-label="出典とこの記事について" className="mt-12">
      <details className="group rounded-xl border border-line bg-canvas">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5">
          <span className="flex items-center gap-2 text-[14px] font-bold text-ink">
            <BookMarked className="h-4 w-4 text-brand" aria-hidden="true" />
            出典とこの記事について
            <span className="text-[12px] font-medium text-muted">出典{article.sources.length}件</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="space-y-5 border-t border-line px-4 py-4">
          <SourcesSection article={article} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[12.5px]">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="text-body">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[12px] leading-6 text-muted">
            内容は情報確認日時点のものです。最新の情報は出典元でご確認ください。編集: {site.editorialTeam}（運営: {partner.operatorShort}）。
            <Link href="/editorial-policy" className="ml-1 underline underline-offset-2 hover:text-brand-strong">
              編集方針
            </Link>
            <Link href="/disclosure" className="ml-2 underline underline-offset-2 hover:text-brand-strong">
              広告・提携表記
            </Link>
          </p>
        </div>
      </details>
    </section>
  );
}

export function RelatedArticles({ articles, categories }: { articles: ArticleSummary[]; categories: Category[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-title" className="mt-16">
      <h2 id="related-title" className="text-[19px] font-bold text-ink">
        次に読むなら
      </h2>
      <ArticleList articles={articles} categories={categories} showSummary={false} className="mt-2 md:grid md:grid-cols-3 md:gap-6 md:divide-y-0" />
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
