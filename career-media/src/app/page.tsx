import Link from "next/link";
import { ArrowRight, ClipboardList, Search } from "lucide-react";
import { JourneyCards } from "@/components/Journey";
import { ArticleList, ArticleRow, LeadCard } from "@/components/ArticleCards";
import { ConsultationCta } from "@/components/ConsultationCta";
import { ExploreTabs } from "@/components/EntryGrid";
import { GeneratedImage } from "@/components/GeneratedImage";
import { CheckIllustration } from "@/components/illustrations/CheckIllustration";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { Motif } from "@/components/illustrations/Motif";
import { JobMap } from "@/components/JobMap";
import { JsonLd } from "@/components/JsonLd";
import { Roadmap, type RoadmapStep } from "@/components/Roadmap";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { ALL_QUESTIONS } from "@/lib/condition-check/questions";
import { JOB_ROLE_SCENE } from "@/lib/illustrations/scenes";
import { JOB_ROLES, type JobRole } from "@/lib/jobs";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import { ROLE_TO_COMPARISON, TAXONOMY, type TaxonomyGroup } from "@/lib/taxonomy";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: `${site.fullName}｜はじめての転職・未経験転職の仕事選びメディア`,
  description: site.description,
  path: "/",
});

/** ヒーローのメイン導線（自分に合う仕事の探し方） */
const GUIDE_SLUG = "shigoto-sagashikata";
/** 進め方の「比べる」で読んでほしい記事 */
const COMPARE_SLUG = "donichi-yasumi-nenshu-hikaku";

const roleHub = (r: JobRole) => {
  const hub = Object.entries(ROLE_TO_COMPARISON).find(([, v]) => v === r.slug)?.[0];
  return hub ? `/jobs/${hub}` : `/jobs#${r.slug}`;
};

export default async function HomePage() {
  const repo = getRepository();
  const [categories, all] = await Promise.all([repo.listCategories(), repo.listArticles()]);
  const articles = all.filter((a) => a.kind === "article");
  // 制度の変更は、施行・発表日の新しい順に並べる（解説を書いた日ではなく、制度の日付で見せる）
  const news = all
    .filter((a) => a.kind === "news")
    .sort((a, b) => (b.news?.announcedAt ?? "").localeCompare(a.news?.announcedAt ?? ""))
    .slice(0, 5);
  // 「最初に読みたい記事」: 編集部が選んだ記事（featured → recommended の順）。ランキングではない
  const featuredAll = articles.filter((a) => a.featured);
  const lead = featuredAll.find((a) => a.slug === GUIDE_SLUG) ?? featuredAll[0];
  const picks = [...featuredAll, ...articles.filter((a) => a.recommended)].filter((a, i, arr) => a !== lead && arr.indexOf(a) === i).slice(0, 6);
  const shown = new Set([lead, ...picks].filter(Boolean).map((a) => a!.slug));
  // 新着は、上で出した記事と重ならないように
  const latest = articles.filter((a) => !shown.has(a.slug)).slice(0, 5);
  const has = (slug: string) => articles.some((a) => a.slug === slug);
  const guideHref = has(GUIDE_SLUG) ? `/articles/${GUIDE_SLUG}` : "/jobs";
  const counts = (group: TaxonomyGroup) => Object.fromEntries(TAXONOMY[group].map((t) => [t.slug, all.filter((a) => a[group].includes(t.slug)).length]));

  const roadmap: RoadmapStep[] = [
    { scene: "checklist", title: "整理する", text: "条件と経験を書き出す", href: "/check", cta: "条件整理チェック", tone: "bg-mint" },
    { scene: "search", title: "知る", text: "仕事の中身を知る", href: "/jobs", cta: "職種を比べる", tone: "bg-sky" },
    { scene: "scale", title: "比べる", text: "給料と休みを比べる", href: has(COMPARE_SLUG) ? `/articles/${COMPARE_SLUG}` : "/concerns/kyuryo", cta: "比べ方を読む", tone: "bg-sand" },
    { scene: "chat", title: "相談する", text: "迷ったら人に話す", href: "/consultation", cta: "相談について", tone: "bg-coral" },
  ];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* Hero: 見出し・ひとこと・2つの入口・検索だけにしぼる */}
      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,#ffffff_0%,var(--color-brand-tint)_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-44 -top-52 h-[520px] w-[520px] rounded-full bg-mint/50" />
        <div className="relative mx-auto max-w-6xl px-4 pb-9 pt-2 sm:px-6 md:pb-16 md:pt-12">
          <div className="hero-grid">
            <div className="hero-art enter-pop">
              <GeneratedImage
                slug="hero-home"
                priority
                sizes="(min-width: 768px) 560px, 270px"
                className="mx-auto block h-[180px] w-auto max-w-full md:h-auto md:w-full"
                fallback={<HeroIllustration className="mx-auto block h-[180px] w-auto max-w-full md:h-auto md:w-full" />}
              />
            </div>
            <div className="hero-text md:pt-8">
              <h1 className="enter text-[27px] font-bold leading-[1.45] text-ink min-[400px]:text-[29px] sm:text-[44px]">
                転職したい。
                <br />
                でも、<span className="text-brand-strong">何から決めればいい？</span>
              </h1>
              <p className="enter enter-d1 mt-3 text-[15px] leading-7 text-muted sm:text-base">仕事・給料・休みのことを、一つずつ整理できるガイドです。</p>
              <div className="enter enter-d2 mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Link href={guideHref} className="tap inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-strong">
                  自分に合う仕事の探し方を見る
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/check" className="tap inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-white px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand-strong">
                  <ClipboardList className="h-5 w-5 text-brand" aria-hidden="true" />
                  条件整理チェック（約3分）
                </Link>
              </div>
            </div>
            <form action="/articles" method="get" role="search" className="hero-search enter enter-d3 mt-6 md:mt-8">
              <label htmlFor="hero-search" className="sr-only">
                キーワードで記事を探す
              </label>
              <div className="flex overflow-hidden rounded-full border border-line-strong bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                <Search className="ml-4 h-4 w-4 shrink-0 self-center text-muted" aria-hidden="true" />
                <input id="hero-search" name="q" type="search" placeholder="キーワードで探す" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] outline-none placeholder:text-muted/70" />
                <button type="submit" className="m-1 rounded-full bg-ink px-4 text-[13px] font-bold text-white hover:bg-brand-strong">
                  検索
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-10 sm:px-6 sm:pt-14">
        {/* 入口: 今の状況 / 悩み / 職種 */}
        <section aria-labelledby="home-explore">
          <SectionHeading eyebrow="FIND" title="自分に近いところから探す" id="home-explore" />
          <ExploreTabs counts={{ situations: counts("situations"), concerns: counts("concerns"), roles: counts("roles") }} />
        </section>

        {/* はじめての転職ガイド: 進め方 + よくある3つのケース */}
        <section aria-labelledby="home-howto">
          <SectionHeading eyebrow="GUIDE" title="はじめての転職ガイド" id="home-howto" />
          <Roadmap steps={roadmap} />
          <h3 className="mt-9 text-[16px] font-bold text-ink">よくある3つのケースを、順番に読む</h3>
          <div className="mt-3">
            <JourneyCards />
          </div>
        </section>

        {/* 最初に読みたい記事（編集部が選んだもの。ランキングではない） */}
        {lead && (
          <section aria-labelledby="home-featured">
            <SectionHeading eyebrow="EDITOR'S PICK" title="最初に読みたい記事" id="home-featured" href="/articles" hrefLabel="記事一覧" />
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <div className="reveal">
                <LeadCard article={lead} categories={categories} />
              </div>
              <ArticleList articles={picks.slice(0, 4)} categories={categories} showSummary={false} className="-mt-4 lg:mt-0" />
            </div>
          </section>
        )}

        {/* 新着 */}
        {latest.length > 0 && (
          <section aria-labelledby="home-latest">
            <SectionHeading eyebrow="LATEST" title="新着記事" id="home-latest" href="/articles" hrefLabel="すべて見る" />
            <ArticleList articles={latest} categories={categories} showSummary={false} className="-mt-3 md:grid md:grid-cols-2 md:gap-x-8" />
          </section>
        )}

        {/* 制度の変更 */}
        <section aria-labelledby="home-news">
          <SectionHeading eyebrow="NEWS" title="知っておきたい制度の変更" id="home-news" href="/news" hrefLabel="一覧" />
          <ul className="-mt-3 divide-y divide-line md:grid md:grid-cols-2 md:gap-x-8">
            {news.slice(0, 4).map((n) => (
              <ArticleRow key={n.slug} article={n} categories={categories} showSummary={false} />
            ))}
          </ul>
        </section>

        {/* 職種マップ */}
        <section aria-labelledby="home-jobs">
          <SectionHeading eyebrow="JOB GUIDE" title="未経験から検討しやすい仕事" id="home-jobs" href="/jobs" hrefLabel="職種を比べる" />
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
            <JobMap roles={JOB_ROLES} hrefFor={roleHub} className="mx-auto w-full max-w-[380px]" />
            <ul className="min-w-0 divide-y divide-line border-y border-line">
              {JOB_ROLES.map((r) => (
                <li key={r.slug}>
                  <Link href={roleHub(r)} className="tap group flex items-center gap-3 py-3">
                    <span className="relative block aspect-square w-10 shrink-0 rounded-full bg-mint">
                      <Motif name={JOB_ROLE_SCENE[r.slug] ?? "briefcase"} className="motif-art absolute inset-[8%]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-ink group-hover:text-brand-strong">{r.name}</span>
                      <span className="block truncate text-[12.5px] text-muted">{r.oneLiner}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 条件整理チェック */}
        <section aria-labelledby="home-check" className="overflow-hidden rounded-2xl bg-brand-tint ring-1 ring-brand/15">
          <div className="grid gap-6 p-6 sm:p-10 md:grid-cols-2 md:items-center">
            <div className="flex items-center gap-4 md:block">
              <GeneratedImage
                slug="check-support"
                sizes="(min-width: 768px) 160px, 96px"
                className="h-[96px] w-auto shrink-0 md:h-[160px]"
                fallback={<CheckIllustration className="h-[96px] w-auto shrink-0 md:h-[160px]" />}
              />
              <div className="md:mt-3">
                <h2 id="home-check" className="text-[21px] font-bold leading-snug text-ink sm:text-[26px]">
                  条件整理チェック
                </h2>
                <p className="mt-1.5 text-[14px] leading-6 text-muted">
                  {ALL_QUESTIONS.length}の質問で、ゆずれない条件と比べたい職種が一覧に。約3分・登録不要・回答は送信されません。
                </p>
              </div>
            </div>
            <div className="md:hidden">
              <Link href="/check" className="tap flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-strong">
                チェックをはじめる
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="hidden md:block">
              <ResultPreview />
              <Link href="/check" className="tap mt-5 flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-[15px] font-bold text-white hover:bg-brand-strong">
                チェックをはじめる
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <ConsultationCta placement="home-band" heading="整理したことをもとに、自分の場合を相談する" />
      </div>
    </>
  );
}

/** チェックの結果のイメージ（実際の結果は回答によって変わる） */
function ResultPreview() {
  const rows: { label: string; chips: string[]; tone: string }[] = [
    { label: "ゆずれない条件", chips: ["土日休み", "残業少なめ"], tone: "bg-coral text-coral-ink" },
    { label: "活かせそうな経験", chips: ["接客", "電話対応"], tone: "bg-sand text-sand-ink" },
    { label: "比べてみたい職種", chips: ["カスタマーサポート", "事務"], tone: "bg-sky text-sky-ink" },
  ];
  return (
    <div className="reveal mx-auto w-full max-w-[400px] rounded-[20px] bg-white p-4 shadow-[var(--shadow-raised)] ring-1 ring-line sm:p-5" aria-hidden="true">
      <p className="flex items-center justify-between text-[12px] font-bold text-muted">
        結果のイメージ
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] text-brand-strong">条件整理ノート</span>
      </p>
      <ul className="mt-3 space-y-3">
        {rows.map((r, i) => (
          <li key={r.label} className="reveal-pop rounded-xl bg-canvas p-3" style={{ animationRange: `entry ${15 + i * 15}% entry ${60 + i * 15}%` }}>
            <p className="text-[12px] font-bold text-ink">{r.label}</p>
            <p className="mt-1.5 flex flex-wrap gap-1.5">
              {r.chips.map((c) => (
                <span key={c} className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${r.tone}`}>
                  {c}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-5 text-muted">面談で聞くことの例や、次にやることも一緒に表示されます。</p>
    </div>
  );
}
