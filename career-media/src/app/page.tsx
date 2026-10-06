import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, FileCheck2, MessagesSquare, Search, ShieldCheck, Scale } from "lucide-react";
import { ArticleList, FeatureCard } from "@/components/ArticleCards";
import { CategoryIcon, categoryTone } from "@/components/CategoryIcon";
import { ConsultationCta } from "@/components/ConsultationCta";
import { formatDateShort } from "@/components/DateMeta";
import { JsonLd } from "@/components/JsonLd";
import { LevelMeter } from "@/components/LevelMeter";
import { SectionHeading } from "@/components/SectionHeading";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { ALL_QUESTIONS } from "@/lib/condition-check/questions";
import { JOB_ROLES, LEVEL_LABELS } from "@/lib/jobs";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${site.fullName}｜未経験からの転職を調べて、整理して、相談できる`,
  description: site.description,
  path: "/",
});

export const revalidate = 600;

const QUICK_SEARCHES = ["研修", "土日休み", "志望動機", "接客経験", "正社員"];

export default async function HomePage() {
  const repo = getRepository();
  const [categories, featured, latest, news, all] = await Promise.all([
    repo.listCategories(),
    repo.listArticles({ kind: "article", featured: true, limit: 3 }),
    repo.listArticles({ kind: "article", limit: 6 }),
    repo.listArticles({ kind: "news", limit: 3 }),
    repo.listArticles(),
  ]);
  const countByCategory = (slug: string) => all.filter((a) => a.categories.includes(slug)).length;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-soft/70" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-56 hidden h-40 w-40 rounded-full bg-accent-soft md:block" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.15fr_1fr] md:items-center md:pb-20 md:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-tint px-3 py-1 text-xs font-bold text-brand-strong">
              既卒・第二新卒・フリーターからの転職に
            </p>
            <h1 className="mt-5 text-[30px] font-bold leading-[1.45] tracking-wide text-ink sm:text-[40px]">
              未経験からの転職、
              <br />
              まずは<span className="bg-[linear-gradient(transparent_64%,var(--color-marker)_64%)] px-0.5">「整理」</span>から。
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-body sm:text-base">
              仕事の種類や働き方、これまでの経験の活かし方を調べて、比べて、自分の希望を整理できる転職情報メディアです。迷ったときは、キャリアアドバイザーに相談することもできます。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/check" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-brand-strong">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
                条件整理チェックをはじめる
              </Link>
              <Link href="/jobs" className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-white px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-brand hover:text-brand-strong">
                <Scale className="h-5 w-5" aria-hidden="true" />
                職種の違いを比べる
              </Link>
            </div>
            <form action="/articles" method="get" role="search" className="mt-8 max-w-xl">
              <label htmlFor="hero-search" className="text-xs font-bold text-muted">
                気になる言葉で記事を探す
              </label>
              <div className="mt-2 flex overflow-hidden rounded-xl border border-line-strong bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                <input id="hero-search" name="q" type="search" placeholder="例: 研修、土日休み、志望動機" className="min-w-0 flex-1 px-4 py-3 text-[15px] outline-none placeholder:text-muted/70" />
                <button type="submit" className="flex items-center gap-1 bg-ink px-4 text-sm font-bold text-white hover:bg-brand-strong">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  検索
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_SEARCHES.map((q) => (
                  <Link key={q} href={`/articles?q=${encodeURIComponent(q)}`} className="rounded-full bg-canvas px-3 py-1 text-xs text-body ring-1 ring-line hover:text-brand-strong hover:ring-brand/40">
                    #{q}
                  </Link>
                ))}
              </div>
            </form>
          </div>

          {/* プロダクトの流れを示すカード */}
          <div className="relative">
            <div className="rounded-[20px] border border-line bg-white p-5 shadow-[var(--shadow-raised)] sm:p-6">
              <p className="text-[11px] font-bold tracking-[0.2em] text-brand">HOW IT WORKS</p>
              <p className="mt-1 text-lg font-bold text-ink">このメディアの使い方</p>
              <ol className="mt-5 space-y-3">
                {[
                  { icon: BookOpen, title: "調べる", body: "仕事内容や働き方、条件の見方を記事で知る", href: "/articles" },
                  { icon: ClipboardList, title: "整理する", body: "条件整理チェックで、希望と経験をまとめる", href: "/check" },
                  { icon: MessagesSquare, title: "相談する", body: "整理した内容をもとに、キャリアアドバイザーに具体的な選択肢を聞く", href: "/consultation" },
                ].map((step, i) => (
                  <li key={step.title}>
                    <Link href={step.href} className="group flex items-start gap-4 rounded-xl border border-line p-4 transition hover:border-brand/40 hover:bg-brand-tint">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                        <step.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="text-[11px] font-bold text-brand">STEP {i + 1}</span>
                        <span className="block text-[15px] font-bold text-ink">{step.title}</span>
                        <span className="block text-[13px] leading-6 text-muted">{step.body}</span>
                      </span>
                      <ArrowRight className="ml-auto mt-3 h-4 w-4 shrink-0 text-line-strong transition group-hover:text-brand" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-xl bg-canvas p-4">
                <p className="text-[11px] font-bold text-muted">条件整理チェックの結果イメージ</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[12px]">
                  <span className="rounded-md bg-white px-2 py-1 ring-1 ring-line">ゆずれない条件: 土日祝休み</span>
                  <span className="rounded-md bg-white px-2 py-1 ring-1 ring-line">活かせる経験: 接客での問い合わせ対応</span>
                  <span className="rounded-md bg-white px-2 py-1 ring-1 ring-line">比較候補: カスタマーサポート / 事務</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 信頼の表示 */}
      <section aria-label="このメディアについて" className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: `運営: ${partner.operatorDisplay}`, body: `有料職業紹介事業許可番号 ${partner.licenseNumber}`, href: "/about" },
            { icon: FileCheck2, title: "出典と情報確認日を明記", body: "制度や数字は一次情報を確認し、記事ごとに記載", href: "/editorial-policy" },
            { icon: Scale, title: "求人の推薦ではなく、比べる材料を", body: "特定の求人への応募をすすめる記事ではありません", href: "/disclosure" },
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

      <div className="mx-auto max-w-6xl space-y-20 px-4 pt-16 sm:px-6">
        {/* カテゴリ */}
        <section aria-labelledby="home-categories">
          <SectionHeading eyebrow="CATEGORIES" title="テーマから探す" id="home-categories" href="/articles" hrefLabel="記事一覧へ" />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((c) => {
              const tone = categoryTone(c.slug);
              return (
                <li key={c.slug}>
                  <Link
                    href={c.slug === "news" ? "/news" : `/categories/${c.slug}`}
                    className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-4 transition hover:border-brand/40 hover:shadow-[var(--shadow-card)] sm:p-5"
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.bg} ${tone.fg}`}>
                      <CategoryIcon name={c.icon} />
                    </span>
                    <span className="mt-3 text-[15px] font-bold text-ink group-hover:text-brand-strong">{c.name}</span>
                    <span className="mt-1 hidden text-[12.5px] leading-5 text-muted sm:block">{c.description}</span>
                    <span className="mt-auto pt-3 text-xs text-muted">{countByCategory(c.slug)}本の記事</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/check" className="flex h-full flex-col justify-between rounded-[var(--radius-card)] bg-brand p-4 text-white transition hover:bg-brand-strong sm:p-5">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
                <span>
                  <span className="mt-3 block text-[15px] font-bold">迷ったら、まず整理から</span>
                  <span className="mt-1 block text-[12.5px] leading-5 text-white/80">条件整理チェック（約3分）</span>
                </span>
              </Link>
            </li>
          </ul>
        </section>

        {/* おすすめ */}
        <section aria-labelledby="home-featured">
          <SectionHeading eyebrow="START HERE" title="はじめに読んでほしい記事" id="home-featured" href="/articles" />
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((a) => (
              <FeatureCard key={a.slug} article={a} categories={categories} />
            ))}
          </div>
        </section>

        {/* 新着 + ニュース */}
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <section aria-labelledby="home-latest">
            <SectionHeading eyebrow="LATEST" title="新着記事" id="home-latest" href="/articles" />
            <div className="rounded-[var(--radius-card)] border border-line bg-white px-5">
              <ArticleList articles={latest} categories={categories} />
            </div>
          </section>
          <section aria-labelledby="home-news">
            <SectionHeading eyebrow="NEWS" title="転職ニュースを読み解く" id="home-news" href="/news" />
            <ul className="space-y-3">
              {news.map((n) => (
                <li key={n.slug}>
                  <Link href={`/news/${n.slug}`} className="group block rounded-[var(--radius-card)] border border-line bg-white p-4 transition hover:border-brand/40">
                    <p className="text-xs text-muted">
                      {n.news?.announcedBy} ・ {formatDateShort(n.news?.announcedAt)} 施行・発表
                    </p>
                    <p className="mt-1.5 text-[15px] font-bold leading-6 text-ink group-hover:text-brand-strong">{n.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-5 text-muted">発表内容の転載ではなく、未経験転職を考える人にとって何が変わるかを編集部が解説しています。</p>
          </section>
        </div>

        {/* 職種比較 */}
        <section aria-labelledby="home-jobs" className="rounded-[20px] border border-line bg-white p-5 sm:p-8">
          <SectionHeading eyebrow="COMPARE" title="未経験から目指しやすい職種を比べる" id="home-jobs" href="/jobs" hrefLabel="職種比較ページへ" />
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">職種ごとの人と話す量・パソコン作業・数字の目標の目安</caption>
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th scope="col" className="py-3 pr-4 font-medium">職種</th>
                  <th scope="col" className="py-3 pr-4 font-medium">人と話す量</th>
                  <th scope="col" className="py-3 pr-4 font-medium">パソコン作業</th>
                  <th scope="col" className="py-3 font-medium">数字の目標</th>
                </tr>
              </thead>
              <tbody>
                {JOB_ROLES.map((r) => (
                  <tr key={r.slug} className="border-b border-line last:border-0">
                    <th scope="row" className="py-4 pr-4">
                      <Link href={`/jobs#${r.slug}`} className="font-bold text-ink hover:text-brand-strong hover:underline">
                        {r.name}
                      </Link>
                    </th>
                    <td className="py-4 pr-4"><LevelMeter level={r.talkLevel} label={LEVEL_LABELS.talk[r.talkLevel]} srLabel="人と話す量" /></td>
                    <td className="py-4 pr-4"><LevelMeter level={r.pcLevel} label={LEVEL_LABELS.pc[r.pcLevel]} srLabel="パソコン作業" /></td>
                    <td className="py-4"><LevelMeter level={r.targetLevel} label={LEVEL_LABELS.target[r.targetLevel]} srLabel="数字の目標" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">一般的な傾向の目安です。同じ職種でも、会社や配属先によって大きく異なります。</p>
          <Link href="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-strong hover:underline sm:hidden">
            職種比較ページへ <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        {/* 条件整理チェック */}
        <section aria-labelledby="home-check" className="overflow-hidden rounded-[20px] bg-brand-tint ring-1 ring-brand/15">
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-brand">SELF CHECK</p>
              <h2 id="home-check" className="mt-2 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
                未経験転職 条件整理チェック
              </h2>
              <p className="mt-3 text-[15px] leading-8 text-body">
                {ALL_QUESTIONS.length}の質問に答えるだけで、希望条件・活かせそうな経験・比べてみたい職種・面談で聞きたいことを一覧にできます。合否や向き不向きを判定するものではなく、あなた自身の考えを整理するためのチェックです。
              </p>
              <Link href="/check" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white hover:bg-brand-strong">
                チェックをはじめる（約3分）
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

        <ConsultationCta placement="home-band" />

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
