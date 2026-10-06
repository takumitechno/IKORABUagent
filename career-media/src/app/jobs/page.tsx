import Link from "next/link";
import { CheckCircle2, ClipboardList, HelpCircle, Info, MessageSquareText, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsultationCta } from "@/components/ConsultationCta";
import { EntryGrid } from "@/components/EntryGrid";
import { JsonLd } from "@/components/JsonLd";
import { LevelMeter } from "@/components/LevelMeter";
import { getRepository } from "@/lib/content";
import { JOB_ROLES, LEVEL_LABELS, type JobRole } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";

export const metadata = pageMetadata({
  title: "未経験から目指せる職種を比較｜営業・カスタマーサポート・ITサポート・事務",
  description: "法人営業・カスタマーサポート・ITサポート・一般/営業事務を、仕事内容・人と話す量・パソコン作業・数字の目標・入社前に確認したいことで比べられます。",
  path: "/jobs",
});

export const revalidate = 600;

type Row = { label: string; render: (r: JobRole) => React.ReactNode };

const ROWS: Row[] = [
  { label: "ひとことで言うと", render: (r) => <p className="text-[13.5px] leading-6">{r.oneLiner}</p> },
  {
    label: "主な仕事内容",
    render: (r) => (
      <ul className="space-y-1 text-[13px] leading-6">
        {r.mainTasks.map((t) => (
          <li key={t}>・{t}</li>
        ))}
      </ul>
    ),
  },
  {
    label: "人と話す量",
    render: (r) => (
      <div>
        <LevelMeter level={r.talkLevel} label={LEVEL_LABELS.talk[r.talkLevel]} srLabel="人と話す量" />
        <p className="mt-1.5 text-[12.5px] leading-5 text-muted">{r.talkNote}</p>
      </div>
    ),
  },
  {
    label: "パソコン作業",
    render: (r) => (
      <div>
        <LevelMeter level={r.pcLevel} label={LEVEL_LABELS.pc[r.pcLevel]} srLabel="パソコン作業" />
        <p className="mt-1.5 text-[12.5px] leading-5 text-muted">{r.pcNote}</p>
      </div>
    ),
  },
  {
    label: "数字の目標",
    render: (r) => (
      <div>
        <LevelMeter level={r.targetLevel} label={LEVEL_LABELS.target[r.targetLevel]} srLabel="数字の目標" />
        <p className="mt-1.5 text-[12.5px] leading-5 text-muted">{r.targetNote}</p>
      </div>
    ),
  },
  {
    label: "向きやすい経験",
    render: (r) => (
      <ul className="space-y-1 text-[13px] leading-6">
        {r.fitExperiences.map((t) => (
          <li key={t}>・{t}</li>
        ))}
      </ul>
    ),
  },
];

const AXES = [
  { key: "talkLevel", labelKey: "talk", label: "人と話す量" },
  { key: "pcLevel", labelKey: "pc", label: "パソコン作業" },
  { key: "targetLevel", labelKey: "target", label: "数字の目標" },
] as const;

export default async function JobsPage() {
  const articles = await getRepository().listArticles({ kind: "article" });
  const roleCounts = Object.fromEntries(["eigyo", "jimu", "customer-support", "it-support", "jinji", "hanbai", "sonota"].map((slug) => [slug, articles.filter((a) => a.roles.includes(slug)).length]));
  const titleOf = (slug: string) => articles.find((a) => a.slug === slug)?.title;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "未経験から目指せる職種の比較",
    itemListElement: JOB_ROLES.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.name, url: absoluteUrl(`/jobs#${r.slug}`) })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <JsonLd data={itemList} />
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "職種を比べる", path: "/jobs" }]} />
      <header className="mt-6 max-w-3xl">
        <p className="text-[11px] font-bold tracking-[0.2em] text-brand">JOB GUIDE</p>
        <h1 className="mt-1 text-[26px] font-bold leading-snug text-ink sm:text-[30px]">職種から探す・比べる</h1>
        <p className="mt-3 text-[15px] leading-8 text-body">
          未経験歓迎の求人でよく見かける4つの職種を、仕事内容・人と話す量・パソコン作業・数字の目標などで比べられるページです。求人の紹介ではなく、職種の違いを知って「何を確認すればいいか」を考えるための材料としてお使いください。
        </p>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-white p-4 text-[13px] leading-6 text-muted ring-1 ring-line">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          5段階の目安は一般的な傾向を示したもので、統計にもとづく数値ではありません。同じ職種名でも、会社や配属先によって仕事内容は大きく異なります。
        </p>
      </header>

      <section aria-labelledby="jobs-by-role" className="mt-8">
        <h2 id="jobs-by-role" className="text-lg font-bold text-ink">
          職種から記事を探す
        </h2>
        <div className="mt-3">
          <EntryGrid group="roles" counts={roleCounts} />
        </div>
      </section>

      <h2 className="mt-12 text-lg font-bold text-ink">4つの職種を比べる</h2>
      <nav aria-label="職種へ移動" className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {JOB_ROLES.map((r) => (
          <a key={r.slug} href={`#${r.slug}`} className="shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink ring-1 ring-line hover:text-brand-strong hover:ring-brand/40">
            {r.name}
          </a>
        ))}
      </nav>

      {/* スマホ: 比べる軸ごとに4職種を並べる */}
      <section aria-labelledby="compare-axes" className="mt-6 space-y-3 md:hidden">
        <h2 id="compare-axes" className="sr-only">
          比べる軸ごとの目安
        </h2>
        {AXES.map((axis) => (
          <div key={axis.key} className="rounded-[var(--radius-card)] border border-line bg-white p-4">
            <p className="text-sm font-bold text-ink">{axis.label}</p>
            <ul className="mt-3 space-y-2.5">
              {JOB_ROLES.map((r) => (
                <li key={r.slug} className="flex items-center justify-between gap-3">
                  <a href={`#${r.slug}`} className="text-[13.5px] text-body underline-offset-4 hover:underline">
                    {r.shortName}
                  </a>
                  <LevelMeter level={r[axis.key]} label={LEVEL_LABELS[axis.labelKey][r[axis.key]]} srLabel={`${r.name}の${axis.label}`} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-xs leading-5 text-muted">仕事内容や確認したいことは、下の職種ごとの説明で詳しく比べられます。</p>
      </section>

      {/* タブレット以上: 一覧表 */}
      <section aria-labelledby="compare-table" className="mt-6 hidden md:block">
        <h2 id="compare-table" className="sr-only">
          職種の比較表
        </h2>
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-white">
          <table className="w-full min-w-[880px] border-collapse text-left text-body">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="sticky-col w-[140px] bg-canvas px-4 py-4 text-xs font-bold text-muted">
                  比べる軸
                </th>
                {JOB_ROLES.map((r) => (
                  <th key={r.slug} scope="col" className="bg-canvas px-4 py-4 align-bottom">
                    <a href={`#${r.slug}`} className="text-[15px] font-bold text-ink hover:text-brand-strong hover:underline">
                      {r.name}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <th scope="row" className="sticky-col bg-white px-4 py-4 align-top text-[13px] font-bold text-ink shadow-[1px_0_0_var(--color-line)]">
                    {row.label}
                  </th>
                  {JOB_ROLES.map((r) => (
                    <td key={r.slug} className="px-4 py-4 align-top">
                      {row.render(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 grid gap-4 rounded-[var(--radius-card)] bg-brand-tint p-5 ring-1 ring-brand/15 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <p className="font-bold text-ink">どの職種を比べればいいか迷ったら</p>
          <p className="mt-1 text-sm leading-7 text-body">条件整理チェックで、経験や希望から比べてみたい職種と確認ポイントを整理できます。</p>
        </div>
        <Link href="/check" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-strong">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          条件整理チェックへ
        </Link>
      </div>

      <div className="mt-14 space-y-8">
        {JOB_ROLES.map((r) => (
          <section key={r.slug} id={r.slug} aria-labelledby={`${r.slug}-title`} className="scroll-mt-24 rounded-[20px] bg-white p-5 ring-1 ring-line sm:p-8">
            <h2 id={`${r.slug}-title`} className="text-[22px] font-bold text-ink">
              {r.name}
            </h2>
            <p className="mt-2 text-[15px] leading-8 text-body">{r.oneLiner}</p>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 rounded-xl bg-canvas p-4">
              <div>
                <p className="text-xs text-muted">人と話す量</p>
                <LevelMeter level={r.talkLevel} label={LEVEL_LABELS.talk[r.talkLevel]} srLabel="人と話す量" />
              </div>
              <div>
                <p className="text-xs text-muted">パソコン作業</p>
                <LevelMeter level={r.pcLevel} label={LEVEL_LABELS.pc[r.pcLevel]} srLabel="パソコン作業" />
              </div>
              <div>
                <p className="text-xs text-muted">数字の目標</p>
                <LevelMeter level={r.targetLevel} label={LEVEL_LABELS.target[r.targetLevel]} srLabel="数字の目標" />
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                  <Search className="h-4 w-4 text-brand" aria-hidden="true" />
                  未経験で確認したいこと
                </h3>
                <ul className="mt-3 space-y-2 text-[14px] leading-7">
                  {r.checkBeforeJoining.map((t) => (
                    <li key={t} className="flex gap-2">
                      <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                  <HelpCircle className="h-4 w-4 text-brand" aria-hidden="true" />
                  向きやすい経験の例
                </h3>
                <ul className="mt-3 space-y-2 text-[14px] leading-7">
                  {r.fitExperiences.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                  <MessageSquareText className="h-4 w-4 text-brand" aria-hidden="true" />
                  面接・面談で聞く質問の例
                </h3>
                <ul className="mt-3 space-y-2 text-[14px] leading-7">
                  {r.interviewQuestions.map((t) => (
                    <li key={t} className="rounded-lg bg-canvas px-3 py-2">
                      「{t}」
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {r.relatedArticles.length > 0 && (
              <div className="mt-6 border-t border-line pt-4">
                <p className="text-xs font-bold text-muted">関連する記事</p>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {r.relatedArticles
                    .filter((slug) => titleOf(slug))
                    .map((slug) => (
                      <li key={slug}>
                        <Link href={`/articles/${slug}`} className="text-sm text-brand-strong underline underline-offset-4 hover:text-accent-strong">
                          {titleOf(slug)}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-14">
        <ConsultationCta placement="jobs" heading="気になる職種が見つかったら、具体的な求人や働き方を相談する" lead="同じ職種でも、会社によって働き方は大きく違います。キャリアアドバイザーに、求人票だけでは分からない点を聞いてみましょう。" />
      </div>
    </div>
  );
}
