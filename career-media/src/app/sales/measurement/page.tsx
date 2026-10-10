import { ArrowDown } from "lucide-react";
import { EVENT_DICTIONARY, SESSION_FIELDS } from "@/lib/measurement/schema";
import { pageMetadata } from "@/lib/seo";
import { EventLog } from "./EventLog";

export const metadata = pageMetadata({ title: "計測の設計", description: "商談用（非公開）", path: "/sales/measurement", noindex: true });

const FUNNEL: { label: string; owner: "site" | "partner" | "sns"; note: string }[] = [
  { label: "SNS（Instagram / 既存の TikTok）", owner: "sns", note: "投稿ごとの UTM（utm_content=theme-b-carousel など）" },
  { label: "Web（記事・比較・読む順番ガイド）", owner: "site", note: "article_view（流入元はセッション属性で判定）" },
  { label: "条件整理チェック", owner: "site", note: "check_started / check_completed（回答は送らない）" },
  { label: "相談ボタン（CTA）", owner: "site", note: "cta_clicked（設置場所・種類・導線）" },
  { label: "提携先の申込ページへ", owner: "site", note: "partner_outbound（本番送客が有効なときだけ）" },
  { label: "登録", owner: "partner", note: "partner_registered（提携先から返してもらう）" },
  { label: "予約", owner: "partner", note: "meeting_reserved" },
  { label: "面談", owner: "partner", note: "meeting_completed（No Show は含めない）" },
  { label: "承認（成果条件を満たす面談）", owner: "partner", note: "meeting_approved / meeting_rejected" },
];

const OWNER = {
  sns: { label: "SNS", cls: "bg-sky text-sky-ink" },
  site: { label: "サイトが記録", cls: "bg-mint text-brand-strong" },
  partner: { label: "提携先から返してもらう", cls: "bg-sand text-sand-ink" },
};

export default function MeasurementPage() {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.2em] text-brand">MEASUREMENT</p>
      <h1 className="mt-1 text-[24px] font-bold leading-snug text-ink sm:text-[30px]">計測の設計（本番の解析ツールは未接続）</h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-8 text-body">
        サイトで分かるのは「どの投稿・記事から、相談ボタンが押されたか」までです。登録・予約・面談・承認は、正式提携後に提携先から返していただくデータで見ます。フロントエンドが成果を自動で作ることはありません。数字はまだ1件もありません（架空の数字は載せていません）。
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ol className="space-y-1.5">
          {FUNNEL.map((f, i) => (
            <li key={f.label}>
              <div className="flex items-start gap-3 rounded-xl bg-surface p-3 ring-1 ring-line">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-night text-[11px] font-bold text-white">{i + 1}</span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-ink">
                    {f.label}
                    <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${OWNER[f.owner].cls}`}>{OWNER[f.owner].label}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11.5px] leading-5 text-muted">{f.note}</p>
                </div>
              </div>
              {i < FUNNEL.length - 1 && <ArrowDown className="mx-auto my-0.5 h-4 w-4 text-line-strong" aria-hidden="true" />}
            </li>
          ))}
        </ol>
        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line">
            <h2 className="text-[16px] font-bold text-ink">将来の中心 KPI（案）</h2>
            <p className="mt-2 rounded-lg bg-canvas px-3 py-2 font-bold text-ink">ユニーク承認面談数 ÷ 実測セッション数 × 1,000</p>
            <ul className="mt-3 space-y-1 text-[13px] leading-6 text-body">
              <li>・ほか: 記事別・テーマ別の承認面談、SNS 流入別の成果、チェックの開始率・完了率、CTA 率、登録 → 予約 → 面談 → 承認・否認、採算</li>
              <li>・同じ面談を複数の記事の成果として二重に数えない（帰属のルールは正式提携後に決める）</li>
              <li>・Google 検索の語句と個別の面談を、常に1対1で結びつけられるとは約束しない</li>
              <li>・未接続・不明・未計測は「0件」と区別して表示する</li>
              <li>・少ない件数で勝ちテーマを決めつけない</li>
            </ul>
          </section>
          <section className="rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line">
            <h2 className="text-[16px] font-bold text-ink">セッション単位で持つもの</h2>
            <ul className="mt-2 space-y-1 text-[13px] leading-6 text-body">
              {SESSION_FIELDS.map((f) => (
                <li key={f.field}>
                  <span className="font-mono text-[12px] text-ink">{f.field}</span>: {f.description}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[12px] leading-6 text-muted">氏名・連絡先・自由記述・条件整理チェックの回答は、どのイベントにも入れません。</p>
          </section>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-[18px] font-bold text-ink">イベント辞書</h2>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius-card)] bg-surface ring-1 ring-line">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead className="bg-canvas text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">イベント</th>
                <th className="px-3 py-2 font-medium">記録する側</th>
                <th className="px-3 py-2 font-medium">いつ</th>
                <th className="px-3 py-2 font-medium">注意</th>
              </tr>
            </thead>
            <tbody>
              {EVENT_DICTIONARY.map((d) => (
                <tr key={d.name} className="border-t border-line align-top">
                  <td className="px-3 py-2 font-mono font-bold text-ink">{d.name}</td>
                  <td className="px-3 py-2">{d.owner === "site" ? "サイト" : "提携先（返却データ）"}</td>
                  <td className="px-3 py-2">{d.trigger}</td>
                  <td className="px-3 py-2 text-muted">{d.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[18px] font-bold text-ink">実際に記録されるイベント（このタブの中だけ）</h2>
        <p className="mt-1 text-[13px] text-muted">記事を開いたり、ボタンを押したりしてから戻ってくると、記録されたイベントがここに並びます。</p>
        <div className="mt-3">
          <EventLog />
        </div>
      </section>
    </div>
  );
}
