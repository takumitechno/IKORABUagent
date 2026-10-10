import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList, Scale } from "lucide-react";
import { ArticleHeader, EditorialNote, FaqSection, pickRelated, RelatedArticles, TocList } from "@/components/ArticleParts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsultationCta } from "@/components/ConsultationCta";
import { buildConsultationUrl } from "@/lib/consultation";
import { partner } from "@/config/partner";
import { JsonLd } from "@/components/JsonLd";
import { JourneyNav } from "@/components/Journey";
import { TrackArticleView } from "@/components/MeasurementTracker";
import { journeyForArticle } from "@/lib/journeys";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { getRepository } from "@/lib/content";
import { readingMinutes, renderMarkdown } from "@/lib/markdown";
import { articleCrumbs, articleJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getRepository().listArticles({ kind: "article" });
  return articles.map((a) => ({ slug: a.slug }));
}

// 公開判定は repository 側（status=published かつ公開条件を満たすもの）で行う。
// draft / review の slug を直接指定しても getArticle が null を返し 404 になる。
// Supabase で新しく公開した記事は再ビルドなしで表示できるよう、ISR で再検証する。
export const revalidate = 600;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getRepository().getArticle(slug);
  if (!article || article.kind !== "article") return {};
  return pageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.summary,
    path: `/articles/${slug}`,
    type: "article",
    publishedTime: article.publishedAt ?? undefined,
    modifiedTime: article.updatedAt,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const repo = getRepository();
  const article = await repo.getArticle(slug);
  if (!article || article.kind !== "article") notFound();
  const [categories, all] = await Promise.all([repo.listCategories(), repo.listArticles()]);
  const { sections, headings } = renderMarkdown(article.body);
  const related = pickRelated(article, all);
  const inJourney = journeyForArticle(article.slug);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <TrackArticleView context={{ content_id: `article:${article.slug}`, content_slug: article.slug, content_version: article.updatedAt, theme_cluster: article.categories[0] ?? "", pattern_id: inJourney?.journey.patternId ?? "" }} />
      <JsonLd data={faqJsonLd(article)} />
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={articleCrumbs(article, categories)} />
        <div className="mt-5 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="min-w-0 sm:rounded-[20px] sm:bg-white sm:px-10 sm:py-10 sm:ring-1 sm:ring-line">
            <ArticleHeader article={article} categories={categories} readingMinutes={readingMinutes(article.body)} headings={headings} />
            <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: sections[0] }} />
            {sections[1] && (
              <>
                <ConsultationCta placement="article-inline" contentSlug={article.slug} variant="inline" category={article.categories[0]} />
                <div className="article-body" dangerouslySetInnerHTML={{ __html: sections[1] }} />
              </>
            )}
            {inJourney && <JourneyNav journey={inJourney.journey} index={inJourney.index} articles={all} />}
            <FaqSection article={article} />
            <EditorialNote article={article} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              {headings.length > 1 && (
                <nav aria-label="目次" className="rounded-[var(--radius-card)] border border-line bg-white p-4">
                  <p className="px-2 text-sm font-bold text-ink">目次</p>
                  <div className="mt-2">
                    <TocList headings={headings} />
                  </div>
                </nav>
              )}
              <ConsultationCta placement="article-sidebar" contentSlug={article.slug} variant="compact" category={article.categories[0]} />
              <div className="grid gap-2">
                <Link href="/check" className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink hover:border-brand/40 hover:text-brand-strong">
                  <ClipboardList className="h-4 w-4 text-brand" aria-hidden="true" />
                  条件整理チェック
                </Link>
                <Link href="/jobs" className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink hover:border-brand/40 hover:text-brand-strong">
                  <Scale className="h-4 w-4 text-brand" aria-hidden="true" />
                  職種を比べる
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <ConsultationCta placement="article-bottom" contentSlug={article.slug} category={article.categories[0]} />
        </div>
        <RelatedArticles articles={related} categories={categories} />
      </div>
      <MobileStickyCta contentSlug={article.slug} consultHref={buildConsultationUrl("article-sticky", article.slug)} consultLabel={partner.consultCta} />
    </>
  );
}
