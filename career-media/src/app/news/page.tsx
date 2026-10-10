import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ConsultationCta } from "@/components/ConsultationCta";
import { announcedLabel, formatDate, formatDateShort } from "@/components/DateMeta";
import { Eyecatch } from "@/components/Eyecatch";
import { Motif } from "@/components/illustrations/Motif";
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
        eyebrow="NEWS"
        title="転職ニュース・市場情報"
        lead="制度の変更や市場の動きを、「何が変わる？何を確かめる？」の視点で解説します。"
        icon="newspaper"
      />
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <p className="flex items-start gap-2 rounded-xl bg-surface p-4 text-[13px] leading-6 text-muted ring-1 ring-line">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        発表内容の全文転載は行わず、要点の解説と確認ポイントをまとめています。正確な内容は各記事の出典（発表元）でご確認ください。
      </p>
      <div className="mt-6">
        <NewsTimeline news={news} />
      </div>

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {news.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/news/${n.slug}`}
              className="tap lift group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface hover:border-brand/40"
            >
              <Eyecatch article={n} category={newsCategory} size="md" className="rounded-none" />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="rounded-full bg-mist px-2.5 py-0.5 font-bold text-mist-ink">{n.news?.announcedBy}</span>
                  <span>
                    {announcedLabel(n.news?.announcedAt)} {formatDate(n.news?.announcedAt)}
                  </span>
                </div>
                <h2 className="mt-3 text-[18px] font-bold leading-7 text-ink group-hover:text-brand-strong">{n.title}</h2>
                <p className="mt-2 line-clamp-3 text-[13.5px] leading-6 text-muted">{n.summary}</p>
                {n.news && (
                  <p className="mt-4 rounded-lg bg-brand-tint px-3 py-2 text-[13px] leading-6 text-body">
                    <span className="font-bold text-brand-strong">未経験転職者には: </span>
                    <span className="line-clamp-2">{n.news.impactForCareerChangers}</span>
                  </p>
                )}
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
