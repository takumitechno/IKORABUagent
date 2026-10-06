import Link from "next/link";
import { ArrowRight, ClipboardList, FileCheck2, MessageCircle, Scale, Search, ShieldCheck } from "lucide-react";
import { ArticleList, ArticleRow, FeatureCard, LeadCard, RankList } from "@/components/ArticleCards";
import { CategoryIcon, categoryTone } from "@/components/CategoryIcon";
import { ConsultationCta } from "@/components/ConsultationCta";
import { formatDateShort } from "@/components/DateMeta";
import { EntryGrid, EntrySectionHeading } from "@/components/EntryGrid";
import { JsonLd } from "@/components/JsonLd";
import { LevelMeter } from "@/components/LevelMeter";
import { SectionHeading } from "@/components/SectionHeading";
import { licenseLabel, partner } from "@/config/partner";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { ALL_QUESTIONS } from "@/lib/condition-check/questions";
import { JOB_ROLES, LEVEL_LABELS } from "@/lib/jobs";
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

/** ヒーロー右側に並べる、読者の言葉そのままの悩み */
const WORRIES: { text: string; href: string; tone: string }[] = [
  { text: "接客しかしてないけど、転職できる？", href: "/situations/sekkyaku", tone: "bg-sand text-sand-ink" },
  { text: "PCが苦手でも、事務って行ける？", href: "/jobs/jimu", tone: "bg-sky text-sky-ink" },
  { text: "給料、下がったらどうしよう", href: "/concerns/kyuryo", tone: "bg-coral text-coral-ink" },
  { text: "土日休みの仕事にしたい", href: "/concerns/donichi", tone: "bg-lime text-lime-ink" },
  { text: "やりたい仕事が分からない", href: "/concerns/yaritai", tone: "bg-mint text-mint-ink" },
  { text: "正社員経験が少なくて不安", href: "/situations/seishain-keiken-sukunai", tone: "bg-mist text-mist-ink" },
];

export default async function HomePage() {
  const repo = getRepository();
  const [categories, all] = await Promise.all([repo.listCategories(), repo.listArticles()]);
  const articles = all.filter((a) => a.kind === "article");
  const news = all.filter((a) => a.kind === "news").slice(0, 5);
  const featuredAll = articles.filter((a) => a.featured);
  const lead = featuredAll.find((a) => a.slug === GUIDE_SLUG) ?? featuredAll[0];
  const featured = featuredAll.filter((a) => a !== lead).slice(0, 4);
  const latest = articles.slice(0, 10);
  const recommended = articles.filter((a) => a.recommended).slice(0, 5);
  const guideHref = articles.some((a) => a.slug === GUIDE_SLUG) ? `/articles/${GUIDE_SLUG}` : "/jobs";
  const counts = (group: TaxonomyGroup) => Object.fromEntries(TAXONOMY[group].map((t) => [t.slug, all.filter((a) => a[group].includes(t.slug)).length]));
  const lastUpdated = all.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), "");

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,#ffffff_0%,var(--color-brand-tint)_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full bg-mint/70" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-[38%] hidden h-56 w-56 rounded-full bg-sand/80 md:block" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-9 sm:px-6 md:grid-cols-[1.1fr_1fr] md:items-center md:pb-14 md:pt-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-strong ring-1 ring-brand/20">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden="true" />
              20代・未経験転職のための仕事選びメディア
            </p>
            <h1 className="mt-5 text-[26px] font-bold leading-[1.45] tracking-wide text-ink min-[400px]:text-[28px] sm:text-[44px]">
              転職したい。
              <br />
              でも、<span className="bg-[linear-gradient(transparent_64%,var(--color-marker)_64%)]">何から決めればいい？</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-body sm:text-base">
              仕事選び、給料、休み、未経験でもできる仕事。
              <br className="hidden sm:block" />
              むずかしい言葉なしで、一つずつ整理できます。
            </p>
            <div className="mt-7 flex flex-col flex-wrap gap-3 sm:flex-row">
              <Link href={guideHref} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-brand-strong">
                自分に合う仕事の探し方を見る
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/check" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-white px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand-strong">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
                条件整理チェックをやってみる
              </Link>
            </div>
            <nav aria-label="よく選ばれる入口" className="mt-7">
              <ul className="flex flex-wrap gap-2">
                {HERO_SHORTCUTS.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink ring-1 ring-line transition hover:text-brand-strong hover:ring-brand/40">
                      #{s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 読者の悩み（吹き出し） */}
          <div>
            <p className="text-[12px] font-bold text-muted">こんなこと、考えていませんか？</p>
            {/* スマホでは横スクロール、タブレット以上は2列 */}
            <ul className="-mx-4 mt-3 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
              {WORRIES.map((w, i) => (
                <li key={w.text} className={`w-[72%] shrink-0 snap-start sm:w-auto ${i % 2 === 1 ? "sm:translate-y-4" : ""}`}>
                  <Link href={w.href} className={`group relative flex h-full items-start gap-2.5 rounded-[18px] rounded-bl-[6px] px-4 py-3.5 text-[14.5px] font-bold leading-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 ${w.tone}`}>
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                    <span className="text-ink">{w.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <form action="/articles" method="get" role="search" className="mt-8 sm:mt-10">
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
          </div>
        </div>
      </section>

      {/* 信頼の表示 */}
      <section aria-label="このメディアについて" className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: `運営: ${partner.operatorDisplay}`, body: `有料職業紹介事業許可番号: ${licenseLabel}`, href: "/about" },
            { icon: FileCheck2, title: `記事${articles.length}本・ニュース解説${all.length - articles.length}本`, body: `出典と情報確認日を記事ごとに記載（最終更新 ${formatDateShort(lastUpdated)}）`, href: "/editorial-policy" },
            { icon: Scale, title: "求人のおすすめではなく、比べる材料を", body: "特定の求人への応募をすすめる記事ではありません", href: "/disclosure" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="flex items-start gap-3 bg-white px-4 py-4 hover:bg-brand-tint sm:px-6">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <span>
                <span className="block text-[13px] font-bold text-ink">{item.title}</span>
                <span className="block text-xs leading-5 text-muted">{item.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 sm:px-6 sm:pt-14">
        {/* 入口: 今の状況 / 悩み / 職種 */}
        <section aria-labelledby="home-situations">
          <EntrySectionHeading group="situations" id="home-situations" extra={<MoreLink href="/situations" />} />
          <EntryGrid group="situations" counts={counts("situations")} />
        </section>
        <section aria-labelledby="home-concerns">
          <EntrySectionHeading group="concerns" id="home-concerns" extra={<MoreLink href="/concerns" />} />
          <EntryGrid group="concerns" counts={counts("concerns")} />
        </section>
        <section aria-labelledby="home-roles">
          <EntrySectionHeading group="roles" id="home-roles" extra={<MoreLink href="/jobs" label="職種を比べる" />} />
          <EntryGrid group="roles" counts={counts("roles")} />
        </section>

        {/* FEATURED */}
        {lead && (
          <section aria-labelledby="home-featured">
            <SectionHeading eyebrow="FEATURED" title="まず読んでほしい記事" id="home-featured" href="/articles" />
            <LeadCard article={lead} categories={categories} />
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((a) => (
                <FeatureCard key={a.slug} article={a} categories={categories} showSummary={false} />
              ))}
            </div>
          </section>
        )}

        {/* LATEST + おすすめ */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="home-latest" className="min-w-0">
            <SectionHeading eyebrow="LATEST" title="新着記事" id="home-latest" href="/articles" />
            <div className="rounded-[var(--radius-card)] border border-line bg-white px-4 sm:px-5">
              <ArticleList articles={latest} categories={categories} />
            </div>
            <Link href="/articles" className="mt-4 flex items-center justify-center gap-1 rounded-full border border-line-strong bg-white py-3 text-sm font-bold text-ink hover:border-brand hover:text-brand-strong">
              記事をもっと見る（全{articles.length}本）
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
          <aside className="space-y-6">
            {recommended.length > 0 && (
              <section aria-labelledby="home-recommended" className="rounded-[var(--radius-card)] border border-line bg-white p-5">
                <p className="text-[11px] font-bold tracking-[0.2em] text-brand">PICK UP</p>
                <h2 id="home-recommended" className="mt-1 text-lg font-bold text-ink">
                  編集部のおすすめ
                </h2>
                <div className="mt-2">
                  <RankList articles={recommended} categories={categories} />
                </div>
              </section>
            )}
            <section aria-labelledby="home-categories" className="rounded-[var(--radius-card)] border border-line bg-white p-5">
              <h2 id="home-categories" className="text-base font-bold text-ink">
                テーマから探す
              </h2>
              <ul className="mt-3 space-y-1">
                {categories.map((c) => {
                  const tone = categoryTone(c.slug);
                  return (
                    <li key={c.slug}>
                      <Link href={c.slug === "news" ? "/news" : `/categories/${c.slug}`} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-body hover:bg-brand-tint hover:text-brand-strong">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone.bg} ${tone.fg}`}>
                          <CategoryIcon name={c.icon} className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{c.name}</span>
                        <span className="text-xs text-muted">{all.filter((a) => a.categories.includes(c.slug)).length}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>

        {/* NEWS */}
        <section aria-labelledby="home-news">
          <SectionHeading eyebrow="NEWS" title="最近の転職・仕事ニュース" id="home-news" href="/news" hrefLabel="ニュース一覧へ" />
          <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            {news[0] && <FeatureCard article={news[0]} categories={categories} />}
            <div className="rounded-[var(--radius-card)] border border-line bg-white px-4 sm:px-5">
              <ul className="divide-y divide-line">
                {news.slice(1).map((n) => (
                  <ArticleRow key={n.slug} article={n} categories={categories} showSummary={false} />
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">発表内容の転載ではなく、はじめて転職する人にとって何が変わるかを編集部が解説しています。</p>
        </section>

        {/* JOB GUIDE */}
        <section aria-labelledby="home-jobs">
          <SectionHeading eyebrow="JOB GUIDE" title="未経験から検討しやすい仕事を知る" id="home-jobs" href="/jobs" hrefLabel="職種を比べる" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JOB_ROLES.map((r) => {
              const hub = Object.entries(ROLE_TO_COMPARISON).find(([, v]) => v === r.slug)?.[0];
              return (
                <li key={r.slug}>
                  <Link href={hub ? `/jobs/${hub}` : `/jobs#${r.slug}`} className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 transition hover:border-brand/40 hover:shadow-[var(--shadow-card)]">
                    <p className="text-[16px] font-bold text-ink group-hover:text-brand-strong">{r.name}</p>
                    <p className="mt-1.5 line-clamp-3 text-[13px] leading-6 text-muted">{r.oneLiner}</p>
                    <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-[12px]">
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted">人と話す量</dt>
                        <dd><LevelMeter level={r.talkLevel} label={LEVEL_LABELS.talk[r.talkLevel]} srLabel="人と話す量" /></dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted">パソコン作業</dt>
                        <dd><LevelMeter level={r.pcLevel} label={LEVEL_LABELS.pc[r.pcLevel]} srLabel="パソコン作業" /></dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted">数字の目標</dt>
                        <dd><LevelMeter level={r.targetLevel} label={LEVEL_LABELS.target[r.targetLevel]} srLabel="数字の目標" /></dd>
                      </div>
                    </dl>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs leading-5 text-muted">一般的な傾向の目安です。同じ職種でも、会社や配属先によって大きく異なります。</p>
        </section>

        {/* CHECK */}
        <section aria-labelledby="home-check" className="overflow-hidden rounded-[20px] bg-brand-tint ring-1 ring-brand/15">
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-brand">CHECK</p>
              <h2 id="home-check" className="mt-2 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
                条件整理チェック
              </h2>
              <p className="mt-3 text-[15px] leading-8 text-body">
                {ALL_QUESTIONS.length}の質問に答えるだけで、ゆずれない条件・活かせそうな経験・比べてみたい職種・面談で聞きたいことを一覧にできます。向き不向きを判定するものではなく、自分の考えを整理するためのチェックです。
              </p>
              <Link href="/check" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white hover:bg-brand-strong">
                チェックをやってみる（約3分）
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <p className="mt-3 text-xs text-muted">登録不要。回答内容は送信・保存されません。</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {["希望条件の整理", "活かせそうな経験", "比較候補の職種", "確認したい条件", "面談で聞く質問", "次にやること"].map((label, i) => (
                <li key={label} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-[var(--shadow-card)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-strong">{i + 1}</span>
                  <span className="font-bold text-ink">{label}</span>
                </li>
              ))}
            </ul>
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

function MoreLink({ href, label = "すべて見る" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-strong hover:underline">
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
