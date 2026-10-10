import Link from "next/link";
import { ArrowRight, Building2, ClipboardList, FileText, ListChecks, MessagesSquare, Search, ShieldCheck } from "lucide-react";
import { JourneyCards } from "@/components/Journey";
import { ArticleList, ArticleRow, LeadCard } from "@/components/ArticleCards";
import { ConsultButton, ConsultationCta } from "@/components/ConsultationCta";
import { ExploreTabs } from "@/components/EntryGrid";
import { GeneratedImage } from "@/components/GeneratedImage";
import { HeroMockup, HeroMockupPeek } from "@/components/HeroMockup";
import { JobPostingDiagram, ProcessFlow } from "@/components/HomeDiagrams";
import { ProValueSection } from "@/components/ProValue";
import { LevelMeter } from "@/components/LevelMeter";
import { JsonLd } from "@/components/JsonLd";
import { Roadmap, type RoadmapStep } from "@/components/Roadmap";
import { SectionHeading } from "@/components/SectionHeading";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { ALL_QUESTIONS } from "@/lib/condition-check/questions";
import { JOB_ROLES, LEVEL_LABELS, type JobRole } from "@/lib/jobs";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import { HERO_SHORTCUTS, ROLE_TO_COMPARISON, TAXONOMY, type TaxonomyGroup } from "@/lib/taxonomy";

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

      {/* Hero: ブランドの色の面に、見出し・検索・人気のキーワード・2つの入口（転職メディアでよくある構成） */}
      <section className="relative overflow-hidden bg-hero text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute -right-40 -top-56 h-[560px] w-[560px] rounded-full bg-white/[0.06]" />
          <span className="absolute -bottom-64 -left-32 h-[480px] w-[480px] rounded-full bg-black/[0.12]" />
          <span className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1.4px)] [background-size:22px_22px]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-8 sm:px-6 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:items-center md:pb-16 md:pt-14">
          <div>
            <p className="enter inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[12px] font-bold tracking-wide ring-1 ring-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden="true" />
              {partner.heroBadge}
            </p>
            <h1 className="enter enter-d1 mt-4 text-[30px] font-bold leading-[1.4] min-[400px]:text-[32px] sm:text-[46px]">
              転職したい。
              <br />
              でも、
              <br className="sm:hidden" />
              <span className="text-highlight">何から決めればいい？</span>
            </h1>
            <p className="enter enter-d2 mt-3 text-[15px] leading-7 text-white/85 sm:text-base">会社選びから面接の練習まで、{partner.proLabel}と一緒に。</p>

            {/* スマホ: 人物のイラストの下半分に検索ボックスを重ねる */}
            <div className="relative -mb-24 mt-4 h-[330px] overflow-hidden md:hidden">
              <GeneratedImage slug="hero-home" priority sizes="290px" className="mx-auto h-auto w-[290px]" fallback={<HeroMockupPeek />} />
            </div>

            <form action="/articles" method="get" role="search" className="enter enter-d3 relative rounded-2xl md:mt-6 bg-white p-3 text-ink shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)] sm:p-4">
              <label htmlFor="hero-search" className="px-1 text-[12px] font-bold text-muted">
                キーワードで記事を探す
              </label>
              <div className="mt-1.5 flex overflow-hidden rounded-xl border border-line-strong focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                <Search className="ml-3 h-4 w-4 shrink-0 self-center text-muted" aria-hidden="true" />
                <input id="hero-search" name="q" type="search" placeholder="例: 事務、土日休み、履歴書" className="min-w-0 flex-1 bg-transparent px-2.5 py-3 text-[15px] outline-none placeholder:text-muted/70" />
                <button type="submit" className="m-1 rounded-lg bg-accent px-4 text-[14px] font-bold text-white hover:bg-accent-strong">
                  検索
                </button>
              </div>
              <p className="mt-3 px-1 text-[11.5px] font-bold text-muted">人気のキーワード</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {HERO_SHORTCUTS.map((k) => (
                  <li key={k.href}>
                    <Link href={k.href} className="inline-flex rounded-full bg-canvas px-2.5 py-1 text-[12.5px] font-medium text-ink ring-1 ring-line hover:text-brand-strong hover:ring-brand/40">
                      {k.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </form>

            <div className="mt-5 grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-2.5 sm:flex sm:flex-wrap">
              <ConsultButton placement="home-hero" label={partner.consultCta} />
              <Link href="/check" className="tap inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-3 text-[14px] font-bold text-brand-strong hover:bg-brand-tint sm:px-5">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                条件整理チェック
              </Link>
            </div>
            <Link href={guideHref} className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-white/85 hover:text-white">
              まずは仕事の探し方を読む
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* 右側: 人物（写真を採用したら写真）と、このサイトでできることの小さなカード */}
          <div className="hidden md:block">
            <GeneratedImage slug="hero-home" priority sizes="540px" className="h-auto w-full rounded-2xl" fallback={<HeroMockup />} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-10 sm:px-6 sm:pt-14">
        {/* プロに頼むよさ（このサイトの目的: 整理したことをもとにキャリア相談 → 自分に合う会社へ）。ヒーローのすぐ下に置く */}
        <section aria-labelledby="home-consult" className="reveal">
          <ProValueSection has={has} />
        </section>

        {/* 入口: 今の状況 / 悩み / 職種 */}
        <section aria-labelledby="home-explore" className="reveal">
          <SectionHeading eyebrow="FIND" title="自分に近いところから探す" id="home-explore" />
          <ExploreTabs counts={{ situations: counts("situations"), concerns: counts("concerns"), roles: counts("roles") }} />
        </section>

        {/* はじめての転職ガイド: 進め方 + よくある3つのケース */}
        <section aria-labelledby="home-howto" className="reveal">
          <SectionHeading eyebrow="GUIDE" title="はじめての転職ガイド" id="home-howto" />
          <Roadmap steps={roadmap} />
          <h3 className="mt-9 text-[16px] font-bold text-ink">よくある3つのケースを、順番に読む</h3>
          <div className="mt-3">
            <JourneyCards />
          </div>
        </section>

        {/* 図: 転職活動の流れ（7ステップ。各ステップから記事へ） */}
        <section aria-labelledby="home-flow" className="reveal">
          <SectionHeading eyebrow="FLOW" title="転職活動の流れを図で見る" id="home-flow" href={has("tenshoku-schedule") ? "/articles/tenshoku-schedule" : undefined} hrefLabel="スケジュールの立て方" />
          <ProcessFlow has={has} />
        </section>

        {/* 最初に読みたい記事（編集部が選んだもの。ランキングではない） */}
        {lead && (
          <section aria-labelledby="home-featured" className="reveal">
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
          <section aria-labelledby="home-latest" className="reveal">
            <SectionHeading eyebrow="LATEST" title="新着記事" id="home-latest" href="/articles" hrefLabel="すべて見る" />
            <ArticleList articles={latest} categories={categories} showSummary={false} className="-mt-3 md:grid md:grid-cols-2 md:gap-x-8" />
          </section>
        )}

        {/* 制度の変更 */}
        <section aria-labelledby="home-news" className="reveal">
          <SectionHeading eyebrow="NEWS" title="知っておきたい制度の変更" id="home-news" href="/news" hrefLabel="一覧" />
          <ul className="-mt-3 divide-y divide-line md:grid md:grid-cols-2 md:gap-x-8">
            {news.slice(0, 4).map((n) => (
              <ArticleRow key={n.slug} article={n} categories={categories} showSummary={false} />
            ))}
          </ul>
        </section>

        {/* 職種の比較表（転職サイトの職種比較のように、同じものさしで並べる） */}
        <section aria-labelledby="home-jobs" className="reveal">
          <SectionHeading eyebrow="JOB GUIDE" title="職種を比べる" id="home-jobs" href="/jobs" hrefLabel="くわしく比べる" />
          {/* スマホ: 1職種1カード（表は横にはみ出すため） */}
          <ul className="grid gap-2.5 sm:hidden">
            {JOB_ROLES.map((r) => (
              <li key={r.slug}>
                <Link href={roleHub(r)} className="block rounded-xl border border-line bg-white p-4 active:bg-brand-tint/60">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-bold text-ink">{r.name}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[12.5px] leading-5 text-muted">{r.oneLiner}</span>
                  <span className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-[11px] text-muted">
                    {(
                      [
                        ["人と話す", r.talkLevel, LEVEL_LABELS.talk[r.talkLevel]],
                        ["パソコン", r.pcLevel, LEVEL_LABELS.pc[r.pcLevel]],
                        ["数字の目標", r.targetLevel, LEVEL_LABELS.target[r.targetLevel]],
                      ] as const
                    ).map(([name, level, label]) => (
                      <span key={name} className="min-w-0">
                        <span className="block font-bold">{name}</span>
                        <span className="mt-1 block">
                          <LevelMeter level={level} label={label} srLabel={name} className="flex-col !items-start !gap-1 [&>span:last-child]:text-[12px]" />
                        </span>
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto rounded-xl border border-line bg-white sm:block">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead className="bg-canvas text-left text-[12px] text-muted">
                <tr>
                  <th className="px-4 py-3 font-bold">職種</th>
                  <th className="px-3 py-3 font-bold">人と話す量</th>
                  <th className="px-3 py-3 font-bold">パソコン作業</th>
                  <th className="px-3 py-3 font-bold">数字の目標</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {JOB_ROLES.map((r) => (
                  <tr key={r.slug} className="hover:bg-brand-tint/60">
                    <td className="px-4 py-3">
                      <Link href={roleHub(r)} className="font-bold text-ink hover:text-brand-strong hover:underline">
                        {r.name}
                      </Link>
                      <span className="mt-0.5 block max-w-[300px] truncate text-[12px] text-muted">{r.oneLiner}</span>
                    </td>
                    <td className="px-3 py-3"><LevelMeter level={r.talkLevel} label={LEVEL_LABELS.talk[r.talkLevel]} srLabel="人と話す量" /></td>
                    <td className="px-3 py-3"><LevelMeter level={r.pcLevel} label={LEVEL_LABELS.pc[r.pcLevel]} srLabel="パソコン作業" /></td>
                    <td className="px-3 py-3"><LevelMeter level={r.targetLevel} label={LEVEL_LABELS.target[r.targetLevel]} srLabel="数字の目標" /></td>
                    <td className="px-3 py-3 text-right">
                      <Link href={roleHub(r)} className="inline-flex items-center gap-0.5 whitespace-nowrap text-[12.5px] font-bold text-brand-strong hover:underline">
                        記事を見る
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-muted">一般的な傾向です。会社や配属先によって大きく異なります。</p>
        </section>

        {/* 図: 求人票の見るところ（見本に番号を振る） */}
        <section aria-labelledby="home-posting" className="reveal">
          <SectionHeading eyebrow="CHECK" title="求人票は、ここを見る" id="home-posting" href={has("kyujin-hyo-yomikata") ? "/articles/kyujin-hyo-yomikata" : undefined} hrefLabel="求人票の見方" />
          <JobPostingDiagram has={has} />
        </section>

        {/* 条件整理チェック（転職サイトの「診断」のような入口。ただし判定はしない） */}
        <section aria-labelledby="home-check" className="reveal overflow-hidden rounded-2xl border-2 border-brand/20 bg-white">
          <div className="grid gap-6 p-5 sm:p-9 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1 text-[12px] font-bold text-brand-strong">
                <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                無料・登録不要
              </p>
              <h2 id="home-check" className="mt-3 text-[22px] font-bold leading-snug text-ink sm:text-[28px]">
                3分でできる、条件整理チェック
              </h2>
              <ul className="mt-5 grid gap-2.5">
                {[
                  { icon: ListChecks, t: `${ALL_QUESTIONS.length}の質問に答えるだけ`, d: "選ぶだけ。答えたくない質問は飛ばせます" },
                  { icon: FileText, t: "条件・経験・比べたい職種が一覧に", d: "面談で使えるメモとしてコピーできます" },
                  { icon: ShieldCheck, t: "回答はどこにも送信されません", d: "このブラウザの中だけで整理します" },
                ].map((x) => (
                  <li key={x.t} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                      <x.icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[14.5px] font-bold text-ink">{x.t}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/check" className="tap mt-6 flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-[15px] font-bold text-white hover:bg-accent-strong md:inline-flex md:px-10">
                チェックをはじめる
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="hidden md:block">
              <GeneratedImage slug="check-support" sizes="440px" className="w-full rounded-2xl" fallback={<ResultPreview />} />
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

