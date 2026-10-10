import Link from "next/link";
import { ArrowRight, ClipboardList, Search } from "lucide-react";
import { JourneyCards } from "@/components/Journey";
import { JsonLd } from "@/components/JsonLd";
import { Motif } from "@/components/illustrations/Motif";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const revalidate = 600;
export const metadata = pageMetadata({ title: site.fullName + "｜はじめて・未経験の転職", description: site.description, path: "/" });

const READS = [
  { slug: "shigoto-sagashikata", title: "やりたい仕事が分からないときは？", label: "仕事選び" },
  { slug: "sekkyaku-keiken-ikasu", title: "「接客しかしてない」も、経験になる。", label: "経験の伝え方" },
  { slug: "donichi-yasumi-nenshu-hikaku", title: "給料と休み、どっちも大事。", label: "条件の比べ方" },
];

export default async function HomePage() {
  const articles = await getRepository().listArticles();
  const reads = READS.filter((read) => articles.some((article) => article.slug === read.slug));
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <section className="overflow-hidden bg-hero text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-6 sm:py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
          <div className="min-w-0">
            <p className="text-[12px] font-bold tracking-widest text-white/75">はじめて・未経験の転職</p>
            <h1 className="mt-5 text-[clamp(1.75rem,7vw,3.5rem)] font-bold leading-[1.45] tracking-tight">
              仕事、そろそろ<br /><span className="text-highlight">変えてみたい。</span>
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/85 sm:text-base">次は、どんな働き方がいい？</p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/check" data-cta-placement="home-hero" data-cta-kind="check" className="tap inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-bold text-white hover:bg-accent-press sm:w-auto">
                希望を整理する<ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
              </Link>
              <Link href="/consultation" data-cta-placement="home-hero" data-cta-kind="consultation-info" className="inline-flex items-center gap-2 text-sm font-bold text-white underline underline-offset-4">
                まずは相談したい<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-white/70"><ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />条件整理は約3分・登録不要</p>
          </div>
          <div aria-hidden="true" className="relative hidden aspect-square max-h-[340px] md:block">
            <div className="absolute inset-[8%] rounded-full bg-white/10" />
            <Motif name="desk" className="absolute inset-[8%] -rotate-6" />
            <span className="absolute left-0 top-[8%] -rotate-6 rounded-full bg-sand px-5 py-2.5 text-lg font-bold text-sand-ink">休みも。</span>
            <span className="absolute right-0 top-[30%] rotate-6 rounded-full bg-sky px-5 py-2.5 text-lg font-bold text-sky-ink">給料も。</span>
            <span className="absolute bottom-[8%] left-[8%] -rotate-3 rounded-full bg-coral px-5 py-2.5 text-xl font-bold text-coral-ink">自分の時間も。</span>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-14 px-5 pt-9 sm:space-y-20 sm:px-6 sm:pt-14">
        <section aria-labelledby="home-journeys">
          <h2 id="home-journeys" className="mb-5 text-xl font-bold text-ink sm:text-2xl">今の気持ちに、近いのは？</h2>
          <JourneyCards />
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-brand-strong">
            <Link href="/concerns" className="hover:underline">ほかの悩みから探す →</Link>
            <Link href="/jobs" className="hover:underline">職種から探す →</Link>
          </div>
        </section>
        <section aria-labelledby="home-reads">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="home-reads" className="text-xl font-bold text-ink sm:text-2xl">気になることから、読んでみる。</h2>
            <Link href="/articles" className="text-sm font-bold text-brand-strong hover:underline">記事一覧 →</Link>
          </div>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {reads.map((read) => (
              <li key={read.slug}>
                <Link href={"/articles/" + read.slug} className="group flex items-center justify-between gap-4 py-5">
                  <span className="min-w-0"><span className="text-xs font-medium text-muted">{read.label}</span><span className="mt-1 block text-base font-bold leading-7 text-ink group-hover:text-brand-strong">{read.title}</span></span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-brand-strong" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <form action="/articles" method="get" role="search" className="mt-5 flex min-w-0 items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-2 focus-within:ring-2 focus-within:ring-brand">
            <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="home-search" className="sr-only">キーワードで記事を探す</label>
            <input id="home-search" name="q" type="search" placeholder="事務、土日休み、履歴書…" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none" />
            <button className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-press">検索</button>
          </form>
        </section>
        <section aria-labelledby="home-consult" className="rounded-3xl bg-brand-tint p-6 sm:p-10">
          <div className="flex items-center gap-4">
            <Motif name="chat" className="h-16 w-16 shrink-0 sm:h-24 sm:w-24" />
            <h2 id="home-consult" className="text-xl font-bold leading-relaxed text-ink sm:text-3xl">まだ決まってなくても、<br />話していい。</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-body">会社選び・書類・面接。プロと一緒に準備できます。</p>
          <Link href="/consultation" data-cta-placement="home-band" data-cta-kind="consultation-info" className="tap mt-5 inline-flex max-w-full items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-press">
            {partner.consultCta}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-xs leading-5 text-muted">応募するかは、自分で決められます。</p>
        </section>
      </div>
    </>
  );
}
