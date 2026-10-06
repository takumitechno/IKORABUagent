import Link from "next/link";
import { ArrowRight, Clock, ClipboardList, FileCheck2, Lock, MessageCircle, Scale, Search, ShieldCheck } from "lucide-react";
import { ArticleList, ArticleRow, FeatureCard, LeadCard, RankList } from "@/components/ArticleCards";
import { categoryTone } from "@/components/CategoryIcon";
import { ConsultationCta } from "@/components/ConsultationCta";
import { formatDateShort } from "@/components/DateMeta";
import { ExploreTabs } from "@/components/EntryGrid";
import { CheckIllustration } from "@/components/illustrations/CheckIllustration";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { Motif } from "@/components/illustrations/Motif";
import { JobMap } from "@/components/JobMap";
import { JsonLd } from "@/components/JsonLd";
import { LevelMeter } from "@/components/LevelMeter";
import { Roadmap, type RoadmapStep } from "@/components/Roadmap";
import { SectionHeading } from "@/components/SectionHeading";
import { licenseLabel, partner } from "@/config/partner";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { ALL_QUESTIONS } from "@/lib/condition-check/questions";
import { categoryScene, JOB_ROLE_SCENE } from "@/lib/illustrations/scenes";
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

/** 読者の言葉そのままの悩み（吹き出し） */
const WORRIES: { text: string; href: string; tone: string }[] = [
  { text: "接客しかしてないけど、転職できる？", href: "/situations/sekkyaku", tone: "bg-sand" },
  { text: "PCが苦手でも、事務って行ける？", href: "/jobs/jimu", tone: "bg-sky" },
  { text: "給料、下がったらどうしよう", href: "/concerns/kyuryo", tone: "bg-coral" },
  { text: "土日休みの仕事にしたい", href: "/concerns/donichi", tone: "bg-lime" },
  { text: "やりたい仕事が分からない", href: "/concerns/yaritai", tone: "bg-mint" },
  { text: "正社員経験が少なくて不安", href: "/situations/seishain-keiken-sukunai", tone: "bg-mist" },
];

const roleHub = (r: JobRole) => {
  const hub = Object.entries(ROLE_TO_COMPARISON).find(([, v]) => v === r.slug)?.[0];
  return hub ? `/jobs/${hub}` : `/jobs#${r.slug}`;
};

export default async function HomePage() {
  const repo = getRepository();
  const [categories, all] = await Promise.all([repo.listCategories(), repo.listArticles()]);
  const articles = all.filter((a) => a.kind === "article");
  const news = all.filter((a) => a.kind === "news").slice(0, 5);
  const featuredAll = articles.filter((a) => a.featured);
  const lead = featuredAll.find((a) => a.slug === GUIDE_SLUG) ?? featuredAll[0];
  const featured = featuredAll.filter((a) => a !== lead).slice(0, 4);
  const latest = articles.slice(0, 8);
  const recommended = articles.filter((a) => a.recommended).slice(0, 6);
  const has = (slug: string) => articles.some((a) => a.slug === slug);
  const guideHref = has(GUIDE_SLUG) ? `/articles/${GUIDE_SLUG}` : "/jobs";
  const counts = (group: TaxonomyGroup) => Object.fromEntries(TAXONOMY[group].map((t) => [t.slug, all.filter((a) => a[group].includes(t.slug)).length]));
  const lastUpdated = all.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), "");

  const roadmap: RoadmapStep[] = [
    { scene: "checklist", title: "整理する", text: "ゆずれない条件と、これまでの経験を書き出す", href: "/check", cta: "条件整理チェック", tone: "bg-mint" },
    { scene: "search", title: "知る", text: "気になる職種の、1日の仕事内容を知る", href: "/jobs", cta: "職種を比べる", tone: "bg-sky" },
    { scene: "scale", title: "比べる", text: "給料や休みを、同じものさしで比べる", href: has(COMPARE_SLUG) ? `/articles/${COMPARE_SLUG}` : "/concerns/kyuryo", cta: "比べ方を読む", tone: "bg-sand" },
    { scene: "chat", title: "相談する", text: "迷ったら、人に話して整理する", href: "/consultation", cta: "相談について", tone: "bg-coral" },
  ];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,#ffffff_0%,var(--color-brand-tint)_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-44 -top-52 h-[520px] w-[520px] rounded-full bg-mint/60" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-3 sm:px-6 md:pb-14 md:pt-12">
          <div className="hero-grid">
            <div className="hero-art enter-pop">
              <HeroIllustration className="mx-auto block h-[214px] w-auto max-w-full md:h-auto md:w-full" />
            </div>
            <div className="hero-text md:pt-6">
              <p className="enter inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-strong ring-1 ring-brand/20">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden="true" />
                20代・未経験転職のための仕事選びメディア
              </p>
              <h1 className="enter enter-d1 mt-4 text-[26px] font-bold leading-[1.45] tracking-wide text-ink min-[400px]:text-[28px] sm:text-[44px]">
                転職したい。
                <br />
                でも、<span className="bg-[linear-gradient(transparent_64%,var(--color-marker)_64%)]">何から決めればいい？</span>
              </h1>
              <p className="enter enter-d2 mt-4 max-w-xl text-[15px] leading-8 text-body sm:text-base">
                仕事選び、給料、休み、未経験でもできる仕事。
                <br className="hidden sm:block" />
                むずかしい言葉なしで、一つずつ整理できます。
              </p>
              <div className="enter enter-d3 mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={guideHref} className="tap inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_-8px_rgb(15_123_108/0.7)] transition-colors hover:bg-brand-strong">
                  自分に合う仕事の探し方を見る
                  <ArrowRight className="anim-nudge h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/check" className="tap inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-white px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand-strong">
                  <ClipboardList className="h-5 w-5 text-brand" aria-hidden="true" />
                  条件整理チェックをやってみる
                </Link>
              </div>
            </div>

            {/* 読者の悩み（吹き出し） */}
            <div className="hero-worries mt-7 md:mt-0">
              <p className="flex items-center gap-1.5 text-[12px] font-bold text-muted">
                <MessageCircle className="h-4 w-4 text-brand" aria-hidden="true" />
                こんなこと、考えていませんか？
              </p>
              <ul className="swipe mt-2 [--swipe-w:62%] md:mx-0 md:grid md:grid-cols-2 md:gap-2.5 md:overflow-visible md:px-0 md:pb-0">
                {WORRIES.map((w, i) => (
                  <li key={w.text} className={`enter enter-d${Math.min(5, i + 1)} ${i % 2 === 1 ? "md:translate-y-3" : ""}`}>
                    <Link href={w.href} className={`tap group relative flex h-full items-center gap-2.5 rounded-[18px] rounded-bl-[6px] px-4 py-3 text-[14px] font-bold leading-6 text-ink shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 ${w.tone}`}>
                      <span className="flex-1">{w.text}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink/40 transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-search mt-5 md:mt-8">
              <form action="/articles" method="get" role="search">
                <label htmlFor="hero-search" className="text-xs font-bold text-muted">
                  キーワードで記事を探す
                </label>
                <div className="mt-2 flex overflow-hidden rounded-xl border border-line-strong bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                  <input id="hero-search" name="q" type="search" placeholder="例: 事務、土日休み、履歴書" className="min-w-0 flex-1 px-4 py-3 text-[15px] outline-none placeholder:text-muted/70" />
                  <button type="submit" className="flex items-center gap-1 bg-ink px-4 text-sm font-bold text-white hover:bg-brand-strong">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    検索
                  </button>
                </div>
              </form>
              <nav aria-label="よく選ばれる入口" className="mt-4">
                <ul className="swipe [--swipe-w:auto] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                  {HERO_SHORTCUTS.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="tap inline-flex items-center whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink ring-1 ring-line transition hover:text-brand-strong hover:ring-brand/40">
                        #{s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* 信頼の表示（スマホでは短く） */}
      <section aria-label="このメディアについて" className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-line">
          {[
            { icon: ShieldCheck, short: `${partner.operatorShort}が運営`, title: `運営: ${partner.operatorDisplay}`, body: `有料職業紹介事業許可番号: ${licenseLabel}`, href: "/about" },
            { icon: FileCheck2, short: `記事${articles.length}本・ニュース${all.length - articles.length}本`, title: `記事${articles.length}本・ニュース解説${all.length - articles.length}本`, body: `出典と情報確認日を記事ごとに記載（最終更新 ${formatDateShort(lastUpdated)}）`, href: "/editorial-policy" },
            { icon: Scale, short: "求人の宣伝ではなく比べる材料", title: "求人のおすすめではなく、比べる材料を", body: "特定の求人への応募をすすめる記事ではありません", href: "/disclosure" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="tap flex flex-col items-center gap-1.5 px-2 py-3.5 text-center hover:bg-brand-tint sm:flex-row sm:items-start sm:gap-3 sm:px-6 sm:py-4 sm:text-left">
              <item.icon className="h-5 w-5 shrink-0 text-brand sm:mt-0.5" aria-hidden="true" />
              <span>
                <span className="block text-[11.5px] font-bold leading-snug text-ink sm:hidden">{item.short}</span>
                <span className="hidden text-[13px] font-bold text-ink sm:block">{item.title}</span>
                <span className="hidden text-xs leading-5 text-muted sm:block">{item.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-10 sm:px-6 sm:pt-14">
        {/* 進め方（図解） */}
        <section aria-labelledby="home-howto">
          <SectionHeading eyebrow="HOW TO" title="はじめての転職、4つのステップ" id="home-howto" />
          <Roadmap steps={roadmap} />
          <p className="mt-3 text-xs leading-5 text-muted">順番どおりでなくても大丈夫です。気になるところから始めてみてください。</p>
        </section>

        {/* 入口: 今の状況 / 悩み / 職種 */}
        <section aria-labelledby="home-explore">
          <SectionHeading eyebrow="FIND" title="自分に近いところから探す" id="home-explore" />
          <ExploreTabs counts={{ situations: counts("situations"), concerns: counts("concerns"), roles: counts("roles") }} />
        </section>

        {/* FEATURED */}
        {lead && (
          <section aria-labelledby="home-featured">
            <SectionHeading eyebrow="FEATURED" title="まず読んでほしい記事" id="home-featured" href="/articles" />
            <div className="reveal">
              <LeadCard article={lead} categories={categories} />
            </div>
            <ul className="swipe md-grid reveal mt-4 md:mt-5" style={{ ["--cols" as string]: 4 }}>
              {featured.map((a) => (
                <li key={a.slug}>
                  <FeatureCard article={a} categories={categories} showSummary={false} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* LATEST + おすすめ */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="home-latest" className="min-w-0">
            <SectionHeading eyebrow="LATEST" title="新着記事" id="home-latest" href="/articles" />
            <div className="rounded-[var(--radius-card)] border border-line bg-white px-4 sm:px-5">
              <ArticleList articles={latest} categories={categories} className="[&>li:nth-child(n+6)]:hidden sm:[&>li:nth-child(n+6)]:block" />
            </div>
            <Link href="/articles" className="tap mt-4 flex items-center justify-center gap-1 rounded-full border border-line-strong bg-white py-3 text-sm font-bold text-ink hover:border-brand hover:text-brand-strong">
              記事をもっと見る（全{articles.length}本）
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
          {recommended.length > 0 && (
            <aside aria-labelledby="home-recommended">
              <section className="rounded-[var(--radius-card)] border border-line bg-white p-5">
                <p className="text-[11px] font-bold tracking-[0.2em] text-brand">PICK UP</p>
                <h2 id="home-recommended" className="mt-1 text-lg font-bold text-ink">
                  編集部のおすすめ
                </h2>
                <div className="mt-2">
                  <RankList articles={recommended} categories={categories} />
                </div>
              </section>
            </aside>
          )}
        </div>

        {/* テーマ */}
        <section aria-labelledby="home-themes">
          <SectionHeading eyebrow="THEME" title="テーマから探す" id="home-themes" />
          <ul className="swipe md-grid reveal [--swipe-w:40%]" style={{ ["--cols" as string]: 4 }}>
            {categories.map((c) => {
              const tone = categoryTone(c.slug);
              const n = all.filter((a) => a.categories.includes(c.slug)).length;
              return (
                <li key={c.slug}>
                  <Link href={c.slug === "news" ? "/news" : `/categories/${c.slug}`} className="tap lift group flex h-full flex-col items-center rounded-2xl border border-line bg-white px-3 pb-4 pt-4 text-center hover:border-brand/40 md:flex-row md:gap-4 md:text-left">
                    <span className={`relative block aspect-square w-20 shrink-0 rounded-full md:w-[72px] ${tone.bg}`}>
                      <Motif name={categoryScene(c.slug)} className="motif-art absolute inset-[4%]" />
                    </span>
                    <span className="mt-2 md:mt-0">
                      <span className="block text-[14px] font-bold leading-snug text-ink group-hover:text-brand-strong">{c.name}</span>
                      <span className="mt-0.5 block text-[11.5px] text-muted">{n}本</span>
                    </span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/articles" className="tap lift group flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-canvas px-3 pb-4 pt-4 text-center hover:border-brand/40 md:flex-row md:gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand ring-1 ring-line">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-2 text-[14px] font-bold text-ink group-hover:text-brand-strong md:mt-0">すべての記事</span>
              </Link>
            </li>
          </ul>
        </section>

        {/* NEWS */}
        <section aria-labelledby="home-news">
          <SectionHeading eyebrow="NEWS" title="最近の転職・仕事ニュース" id="home-news" href="/news" hrefLabel="ニュース一覧へ" />
          <ul className="swipe md:hidden">
            {news.map((n) => (
              <li key={n.slug}>
                <FeatureCard article={n} categories={categories} showSummary={false} />
              </li>
            ))}
          </ul>
          <div className="hidden gap-5 md:grid lg:grid-cols-[1fr_1.4fr]">
            {news[0] && <FeatureCard article={news[0]} categories={categories} />}
            <div className="rounded-[var(--radius-card)] border border-line bg-white px-4 sm:px-5">
              <ul className="divide-y divide-line">
                {news.slice(1).map((n) => (
                  <ArticleRow key={n.slug} article={n} categories={categories} showSummary={false} />
                ))}
              </ul>
            </div>
          </div>
          <Link href="/news" className="tap mt-2 flex items-center justify-center gap-1 rounded-full border border-line-strong bg-white py-3 text-sm font-bold text-ink hover:border-brand hover:text-brand-strong md:hidden">
            ニュース一覧へ
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-xs leading-5 text-muted">発表内容の転載ではなく、はじめて転職する人にとって何が変わるかを編集部が解説しています。</p>
        </section>

        {/* JOB GUIDE（職種マップ） */}
        <section aria-labelledby="home-jobs">
          <SectionHeading eyebrow="JOB GUIDE" title="未経験から検討しやすい仕事を知る" id="home-jobs" href="/jobs" hrefLabel="職種を比べる" />
          <div className="grid gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center">
            <JobMap roles={JOB_ROLES} hrefFor={roleHub} className="mx-auto w-full max-w-[400px]" />
            <ul className="swipe md-grid reveal [--swipe-w:76%]" style={{ ["--cols" as string]: 2 }}>
              {JOB_ROLES.map((r) => (
                <li key={r.slug}>
                  <Link href={roleHub(r)} className="tap lift group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-4 hover:border-brand/40">
                    <span className="flex items-center gap-3">
                      <span className="relative block aspect-square w-12 shrink-0 rounded-full bg-mint">
                        <Motif name={JOB_ROLE_SCENE[r.slug] ?? "briefcase"} className="motif-art absolute inset-[6%]" />
                      </span>
                      <span className="text-[15.5px] font-bold leading-snug text-ink group-hover:text-brand-strong">{r.name}</span>
                    </span>
                    <span className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted">{r.oneLiner}</span>
                    <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[12px]">
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted">人と話す量</dt>
                        <dd>
                          <LevelMeter level={r.talkLevel} label={LEVEL_LABELS.talk[r.talkLevel]} srLabel="人と話す量" />
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted">パソコン作業</dt>
                        <dd>
                          <LevelMeter level={r.pcLevel} label={LEVEL_LABELS.pc[r.pcLevel]} srLabel="パソコン作業" />
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted">数字の目標</dt>
                        <dd>
                          <LevelMeter level={r.targetLevel} label={LEVEL_LABELS.target[r.targetLevel]} srLabel="数字の目標" />
                        </dd>
                      </div>
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CHECK */}
        <section aria-labelledby="home-check" className="overflow-hidden rounded-[24px] bg-brand-tint ring-1 ring-brand/15">
          <div className="grid gap-6 p-5 sm:p-10 md:grid-cols-2 md:items-center">
            <div className="text-center md:text-left">
              <CheckIllustration className="mx-auto h-[150px] w-auto md:mx-0 md:h-[180px]" />
              <p className="mt-2 text-[11px] font-bold tracking-[0.2em] text-brand">CHECK</p>
              <h2 id="home-check" className="mt-1 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
                条件整理チェック
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-body">
                {ALL_QUESTIONS.length}の質問に答えるだけ。ゆずれない条件と、比べてみたい職種が一覧になります。
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2 text-[12.5px] font-medium text-ink md:justify-start">
                <li className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-line">
                  <Clock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  約3分
                </li>
                <li className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-line">
                  <Lock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  登録不要
                </li>
                <li className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-line">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  回答は送信されません
                </li>
              </ul>
              <Link href="/check" className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_-8px_rgb(15_123_108/0.7)] hover:bg-brand-strong">
                チェックをやってみる
                <ArrowRight className="anim-nudge h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ResultPreview />
          </div>
        </section>

        <ConsultationCta placement="home-band" heading="希望に近い仕事があるか、相談してみる" />

        <nav aria-label="運営に関する情報" className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-8 text-sm">
          <Link href="/about" className="text-muted hover:text-brand-strong hover:underline">運営者情報</Link>
          <Link href="/editorial-policy" className="text-muted hover:text-brand-strong hover:underline">編集方針</Link>
          <Link href="/disclosure" className="text-muted hover:text-brand-strong hover:underline">広告・提携表記</Link>
          <Link href="/consultation" className="text-muted hover:text-brand-strong hover:underline">キャリア相談について</Link>
        </nav>
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
