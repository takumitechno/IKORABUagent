import { notFound } from "next/navigation";
import { AlertCircle, CheckSquare, Megaphone, Sparkles, Users } from "lucide-react";
import { EditorialNote, pickRelated, RelatedArticles, SourcesSection } from "@/components/ArticleParts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsultationCta } from "@/components/ConsultationCta";
import { formatDate } from "@/components/DateMeta";
import { JsonLd } from "@/components/JsonLd";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { articleCrumbs, articleJsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const news = await getRepository().listArticles({ kind: "news" });
  return news.map((n) => ({ slug: n.slug }));
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getRepository().getArticle(slug);
  if (!article || article.kind !== "news") return {};
  return pageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.summary,
    path: `/news/${slug}`,
    type: "article",
    publishedTime: article.publishedAt ?? undefined,
    modifiedTime: article.updatedAt,
  });
}

function Block({ icon: Icon, title, children, tone = "default" }: { icon: typeof Megaphone; title: string; children: React.ReactNode; tone?: "default" | "brand" | "warn" }) {
  const toneClass = tone === "brand" ? "border-brand/25 bg-brand-tint" : tone === "warn" ? "border-accent/25 bg-accent-soft" : "border-line bg-white";
  return (
    <section className={`rounded-[var(--radius-card)] border p-5 sm:p-6 ${toneClass}`}>
      <h2 className="flex items-center gap-2 text-[17px] font-bold text-ink">
        <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-3 text-[15px] leading-8 text-body">{children}</div>
    </section>
  );
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const repo = getRepository();
  const article = await repo.getArticle(slug);
  if (!article || article.kind !== "news" || !article.news) notFound();
  const [categories, all] = await Promise.all([repo.listCategories(), repo.listArticles()]);
  const { sections } = renderMarkdown(article.body);
  const news = article.news;

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={articleCrumbs(article, categories)} />
        <article className="mt-6">
          <header className="rounded-[20px] bg-white px-5 py-7 ring-1 ring-line sm:px-10 sm:py-9">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-mist px-2.5 py-0.5 font-bold text-mist-ink">転職ニュース解説</span>
              <span className="text-muted">
                発表元: {news.announcedBy}・施行・発表日: {formatDate(news.announcedAt)}
              </span>
            </div>
            <h1 className="mt-4 text-[24px] font-bold leading-[1.55] text-ink sm:text-[28px]">{article.title}</h1>
            <p className="mt-4 text-[15px] leading-8 text-body">{article.summary}</p>
            <p className="mt-4 text-xs text-muted">
              解説公開 {formatDate(article.publishedAt)}・更新 {formatDate(article.updatedAt)}・情報確認日 {formatDate(article.informationCheckedAt)}・編集: {site.editorialTeam}（運営: {partner.operatorDisplay}）
            </p>
          </header>

          <div className="mt-6 space-y-4">
            <Block icon={Megaphone} title="何が発表されたか">
              <p>{news.whatHappened}</p>
            </Block>
            <Block icon={Users} title="誰に関係するか">
              <p>{news.whoIsAffected}</p>
            </Block>
            <Block icon={Sparkles} title="未経験転職者には何が変わるか" tone="brand">
              <p>{news.impactForCareerChangers}</p>
            </Block>
            <Block icon={AlertCircle} title="この情報だけでは分からないこと" tone="warn">
              <ul className="space-y-2">
                {news.unknowns.map((u) => (
                  <li key={u} className="flex gap-2">
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {u}
                  </li>
                ))}
              </ul>
            </Block>
            <Block icon={CheckSquare} title="確認しておきたいこと">
              <ul className="space-y-2">
                {news.whatToCheck.map((c) => (
                  <li key={c} className="flex gap-2.5">
                    <CheckSquare className="mt-1.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <section aria-labelledby="commentary" className="mt-6 rounded-[20px] bg-white px-5 py-7 ring-1 ring-line sm:px-10">
            <h2 id="commentary" className="text-[17px] font-bold text-ink">
              編集部の解説
            </h2>
            <div className="article-body mt-4" dangerouslySetInnerHTML={{ __html: sections.join("") }} />
            <SourcesSection article={article} />
            <EditorialNote article={article} />
          </section>
        </article>

        <p className="mt-6 text-center text-sm">
          <Link href="/news" className="font-bold text-brand-strong underline">
            転職ニュース一覧へ戻る
          </Link>
        </p>
        <div className="mt-10">
          <ConsultationCta placement="news-bottom" contentSlug={article.slug} />
        </div>
        <RelatedArticles articles={pickRelated(article, all)} categories={categories} />
      </div>
    </>
  );
}
