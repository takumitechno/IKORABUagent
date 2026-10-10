import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale } from "lucide-react";
import { ArticleList, FeatureCard } from "@/components/ArticleCards";
import { PageHero } from "@/components/PageHero";
import { Motif } from "@/components/illustrations/Motif";
import { ConsultationCta } from "@/components/ConsultationCta";
import { EntryGrid } from "@/components/EntryGrid";
import { JourneyGuide } from "@/components/Journey";
import { journeyForHub } from "@/lib/journeys";
import { LevelMeter } from "@/components/LevelMeter";
import { getRepository } from "@/lib/content";
import { taxonomyScene } from "@/lib/illustrations/scenes";
import { getJobRole, LEVEL_LABELS } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";
import { findTaxonomy, ROLE_TO_COMPARISON, TAXONOMY, TAXONOMY_GROUPS, taxonomyPath, type TaxonomyGroup } from "@/lib/taxonomy";

export function hubStaticParams(group: TaxonomyGroup) {
  return TAXONOMY[group].map((t) => ({ slug: t.slug }));
}

export function hubMetadata(group: TaxonomyGroup, slug: string) {
  const item = findTaxonomy(group, slug);
  if (!item) return {};
  return pageMetadata({ title: item.heading, description: item.description, path: taxonomyPath(group, slug) });
}

/** 入口（職種 / 悩み / 今の状況）ごとの記事ハブ */
export async function TaxonomyHub({ group, slug }: { group: TaxonomyGroup; slug: string }) {
  const item = findTaxonomy(group, slug);
  if (!item) notFound();
  const g = TAXONOMY_GROUPS[group];
  const repo = getRepository();
  const [categories, articles, all] = await Promise.all([repo.listCategories(), repo.listArticles({ tag: { group, slug } }), repo.listArticles()]);
  const journey = journeyForHub(taxonomyPath(group, slug));
  const comparison = group === "roles" && ROLE_TO_COMPARISON[slug] ? getJobRole(ROLE_TO_COMPARISON[slug]) : undefined;
  const top = articles.slice(0, 3);
  const rest = articles.slice(3);
  const otherGroups = (["concerns", "situations", "roles"] as TaxonomyGroup[]).filter((x) => x !== group);

  return (
    <>
      <PageHero
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: g.title, path: group === "roles" ? "/jobs" : g.basePath },
          { name: item.label, path: taxonomyPath(group, slug) },
        ]}
        eyebrow={`${g.title.replace("から探す", "")}・${item.label}`}
        title={item.heading}
        lead={item.description}
        icon={item.icon}
      />
    <div className="mx-auto max-w-6xl px-4 pt-2 sm:px-6">
      <header>
        {comparison && (
          <div className="relative mt-6 flex flex-col gap-4 rounded-xl bg-white p-4 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div>
                <p className="text-xs text-muted">人と話す量</p>
                <LevelMeter level={comparison.talkLevel} label={LEVEL_LABELS.talk[comparison.talkLevel]} srLabel="人と話す量" animate />
              </div>
              <div>
                <p className="text-xs text-muted">パソコン作業</p>
                <LevelMeter level={comparison.pcLevel} label={LEVEL_LABELS.pc[comparison.pcLevel]} srLabel="パソコン作業" animate />
              </div>
              <div>
                <p className="text-xs text-muted">数字の目標</p>
                <LevelMeter level={comparison.targetLevel} label={LEVEL_LABELS.target[comparison.targetLevel]} srLabel="数字の目標" animate />
              </div>
            </div>
            <Link href={`/jobs#${comparison.slug}`} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-brand-strong hover:underline">
              <Scale className="h-4 w-4" aria-hidden="true" />
              ほかの職種と比べる
            </Link>
          </div>
        )}
      </header>

      {journey && <JourneyGuide journey={journey} articles={all} />}

      <nav aria-label={`ほかの${g.label}`} className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {TAXONOMY[group].map((t) => (
          <Link
            key={t.slug}
            href={taxonomyPath(group, t.slug)}
            aria-current={t.slug === slug ? "page" : undefined}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 ${t.slug === slug ? "bg-ink text-white ring-ink" : "bg-white text-body ring-line hover:text-brand-strong"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {articles.length === 0 ? (
            <p className="rounded-[var(--radius-card)] bg-white p-10 text-center text-sm text-muted ring-1 ring-line">このテーマの記事は準備中です。</p>
          ) : (
            <>
              <ul className="swipe md-grid reveal" style={{ ["--cols" as string]: 3 }}>
                {top.map((a) => (
                  <li key={a.slug}>
                    <FeatureCard article={a} categories={categories} />
                  </li>
                ))}
              </ul>
              {rest.length > 0 && (
                <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-white px-5">
                  <ArticleList articles={rest} categories={categories} />
                </div>
              )}
            </>
          )}
        </div>
        <aside className="space-y-6">
          <Link href="/check" className="tap lift flex items-center gap-3 rounded-[var(--radius-card)] bg-brand p-5 text-white hover:bg-brand-strong">
            <span className="motif motif-checklist block h-14 w-14 shrink-0 rounded-full bg-white/90" aria-hidden="true" />
            <span>
              <span className="block font-bold">迷ったら、条件整理チェック</span>
              <span className="text-[12.5px] text-white/80">13の質問で、比べる職種と確認ポイントを整理</span>
            </span>
          </Link>
          {otherGroups.map((og) => (
            <section key={og} aria-label={TAXONOMY_GROUPS[og].title} className="rounded-[var(--radius-card)] border border-line bg-white p-5">
              <p className="text-sm font-bold text-ink">{TAXONOMY_GROUPS[og].title}</p>
              <div className="mt-3">
                <EntryGrid group={og} variant="chip" />
              </div>
            </section>
          ))}
          <ConsultationCta placement="article-sidebar" contentSlug={`${group}-${slug}`} variant="compact" />
        </aside>
      </div>
    </div>
    </>
  );
}

/** 入口の一覧ページ（/concerns, /situations） */
export async function TaxonomyIndex({ group }: { group: TaxonomyGroup }) {
  const g = TAXONOMY_GROUPS[group];
  const all = await getRepository().listArticles();
  const counts = Object.fromEntries(TAXONOMY[group].map((t) => [t.slug, all.filter((a) => a[group].includes(t.slug)).length]));
  return (
    <>
      <PageHero
        crumbs={[{ name: "ホーム", path: "/" }, { name: g.title, path: g.basePath }]}
        eyebrow={`${TAXONOMY[group].length}つの入口`}
        title={g.title}
        lead={group === "concerns" ? "今いちばん気になっていることから、関係のある記事をまとめて読めます。" : "今の働き方や経歴に近いものを選ぶと、同じ状況の人に向けた記事をまとめて読めます。"}
        icon={group === "concerns" ? "messages" : "flag"}
      />
    <div className="mx-auto max-w-6xl px-4 pt-2 sm:px-6">
      <div className="mt-6">
        <EntryGrid group={group} counts={counts} />
      </div>
      <div className="mt-14">
        <ConsultationCta placement="home-band" />
      </div>
    </div>
    </>
  );
}
