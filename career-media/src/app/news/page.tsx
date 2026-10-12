import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ConsultationCta } from "@/components/ConsultationCta";
import { announcedLabel, formatDate, formatDateShort } from "@/components/DateMeta";
import { Eyecatch } from "@/components/Eyecatch";
import { articleCardTitle } from "@/lib/article-presentation";
import { NewsTimeline } from "@/components/NewsTimeline";
import { getRepository } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "転職ニュース・市場情報",
  description: "転職や働き方にかかわる制度変更・市場の動きを、未経験から転職を考える人にとって何が変わるのかという視点で解説します。",
  path: "/news",
});

export const revalidate = 600;

export default async function NewsIndexPage() {
  const repo = getRepository();
  const [news, related, categories] = await Promise.all([repo.listArticles({ kind: "news" }), repo.listArticles({ kind: "article", category: "news" }), repo.listCategories()]);
  const newsCategory = categories.find((c) => c.slug === "news");

  return (
    <>
      <PageHero
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "転職ニュース・市場情報", path: "/news" },
        ]}
        eyebrow="転職に関わる制度・ニュース"
        title="転職に関わる制度・ニュース"
        lead="制度の変更や市場の動きが、仕事選びや退職の準備にどう関わるかを解説します。"
        icon="newspaper"
        compact
      />
    <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
      <ul className="news-gallery grid gap-x-6 gap-y-9 md:grid-cols-3">
        {news.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/news/${n.slug}`}
              className="tap lift group flex h-full flex-col"
            >
              <Eyecatch article={n} category={newsCategory} size="md" />
              <div className="flex flex-1 flex-col pt-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-bold text-brand-strong">{n.news?.announcedBy}</span>
                  <span>
                    {announcedLabel(n.news?.announcedAt, n.news?.dateType)} {formatDate(n.news?.announcedAt)}
                  </span>
                </div>
                <h2 className="mt-2 text-[18px] font-bold leading-7 text-ink group-hover:text-brand-strong" title={n.title}>{articleCardTitle(n)}</h2>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-6 text-muted">{n.news?.impactForCareerChangers ?? n.summary}</p>
                <p className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
                  <span>
                    解説 {formatDateShort(n.publishedAt)}・情報確認 {formatDateShort(n.informationCheckedAt)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-brand" aria-hidden="true" />
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <details className="editorial-details mt-10"><summary>制度の施行・発表時期を確認する</summary><NewsTimeline news={news} /></details>
      <p className="mt-4 text-xs leading-6 text-muted">制度の対象や条件は、各記事に記載した発表元の情報でもご確認ください。</p>

      {related.length > 0 && (
        <section aria-labelledby="news-related" className="mt-14">
          <h2 id="news-related" className="text-xl font-bold text-ink">
            市場の変化を読み解く記事
          </h2>
          <ul className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface px-5">
            {related.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`} className="block py-4 font-bold text-ink hover:text-brand-strong">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-14">
        <ConsultationCta placement="news-bottom" />
      </div>
    </div>
    </>
  );
}
