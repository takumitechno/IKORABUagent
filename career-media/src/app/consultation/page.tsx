import Link from "next/link";
import { BookOpen, ClipboardList, MessagesSquare } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsultButton, ConsultationCta, PartnerNote } from "@/components/ConsultationCta";
import { JsonLd } from "@/components/JsonLd";
import { partner } from "@/config/partner";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "キャリア相談について",
  description: `未経験からの転職を、人材紹介会社のキャリアアドバイザーに相談するときにできること・相談の流れ・相談前に準備しておくこと・よくある質問をまとめています。`,
  path: "/consultation",
});

const FAQ = [
  {
    question: "相談に費用はかかりますか？",
    answer:
      "人材紹介会社（有料職業紹介事業者）は、職業安定法により、原則として求職者から手数料を受け取ることができません（一部の職業を除く）。紹介手数料は、採用した企業が支払うしくみです。実際の条件は、申し込みページで相談先の案内を確認してください。",
  },
  { question: "相談したら、必ず応募しないといけませんか？", answer: "いいえ。紹介された求人に応募するかどうかは、ご自身で決められます。情報収集のための相談でも構いません。" },
  { question: "まだ転職するか決めていなくても相談できますか？", answer: "はい。転職するかどうか迷っている段階でも、今の状況や選択肢を整理するために相談できます。" },
  { question: "相談すれば転職できますか？", answer: "相談は、内定や年収アップなどの結果を保証するものではありません。経験や希望をもとに、選択肢や進め方を一緒に考えるためのものです。" },
];

/** 相談の流れの各ステップのイラスト（申し込み → 面談 → 求人の紹介 → 応募・面接 → 入社） */
const FLOW_SCENES = ["laptop", "chat", "search", "interview", "flag"];

export default function ConsultationPage() {
  return (
    <>
      <JsonLd data={faqJsonLd({ faq: FAQ })} />
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "キャリア相談について", path: "/consultation" }]} />

        <header className="mt-6 grid gap-8 rounded-[20px] bg-white p-6 ring-1 ring-line sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-brand">CAREER CONSULTATION</p>
            <h1 className="mt-1 text-[26px] font-bold leading-snug text-ink sm:text-[32px]">キャリア相談について</h1>
            <p className="mt-4 text-[15px] leading-8 text-body">
              このメディアは、仕事や条件について自分で調べて整理するための場所です。自分の場合どんな求人や進め方があるかを具体的に考えたいときは、{partner.partnerName}のキャリアアドバイザーに相談できます。相談しなくても、記事とチェックだけで使えるように作っています。
            </p>
          </div>
          <div className="rounded-2xl bg-brand-tint p-5 ring-1 ring-brand/15">
            <span aria-hidden="true" className="motif motif-chat mx-auto mb-3 block h-24 w-24 rounded-full bg-white" />
            <ConsultButton placement="consultation-page" label="相談を申し込む" />
            <p className="mt-3 text-xs leading-5 text-muted">先に条件を整理したい方は、下の「相談の前に準備しておくと話しやすいこと」から。</p>
            <PartnerNote className="mt-2 text-xs leading-5 text-muted" />
          </div>
        </header>

        <section aria-labelledby="roles" className="mt-12">
          <h2 id="roles" className="text-[22px] font-bold text-ink">
            メディアとキャリア相談でできること
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <p className="flex items-center gap-2 font-bold text-ink">
                <BookOpen className="h-5 w-5 text-brand" aria-hidden="true" />
                このメディアでできること（自分で）
              </p>
              <ul className="mt-4 space-y-2.5 text-[14.5px] leading-7">
                <li>・仕事内容や働き方、給料・休日の見方を知る</li>
                <li>・職種ごとの違いを比べる</li>
                <li>・条件整理チェックで、希望や経験・聞きたいことを整理する</li>
              </ul>
              <p className="mt-3 text-[12.5px] leading-6 text-muted">求人の紹介や、個別の応募先の判断はしていません。</p>
            </div>
            <div className="rounded-[var(--radius-card)] border-2 border-accent/30 bg-white p-6">
              <p className="flex items-center gap-2 font-bold text-ink">
                <MessagesSquare className="h-5 w-5 text-accent" aria-hidden="true" />
                キャリア相談でできること（{partner.partnerName}）
              </p>
              <p className="mt-3 text-[14.5px] leading-7 text-body">{partner.serviceDescription}</p>
              <p className="mt-3 text-[12.5px] leading-6 text-muted">内定や年収アップなどの結果を保証するものではありません。</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="audience" className="mt-12">
          <h2 id="audience" className="text-[22px] font-bold text-ink">
            こんな方の相談を想定しています
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {partner.serviceAudience.map((a) => (
              <li key={a} className="rounded-xl bg-white p-4 text-[14.5px] leading-7 ring-1 ring-line">
                {a}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="flow" className="mt-12">
          <h2 id="flow" className="text-[22px] font-bold text-ink">
            相談の流れ
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-muted">{partner.consultationStepsNote}</p>
          <ol className="relative mt-5 grid gap-3 md:grid-cols-5">
            <span aria-hidden="true" className="reveal-grow-y absolute bottom-8 left-[35px] top-8 border-l-[3px] border-dashed border-brand/30 md:hidden" />
            <span aria-hidden="true" className="reveal-grow-x absolute left-[10%] right-[10%] top-[44px] hidden border-t-[3px] border-dashed border-brand/30 md:block" />
            {partner.consultationSteps.map((s, i) => (
              <li key={s.title} className="reveal relative grid grid-cols-[72px_minmax(0,1fr)] items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-line md:flex md:flex-col md:items-center md:p-4 md:text-center">
                <span className="relative block aspect-square w-[72px] rounded-full bg-mint md:w-[76px]">
                  <span aria-hidden="true" className={`motif motif-${FLOW_SCENES[i] ?? "chat"} absolute inset-[6%] block`} />
                  <span className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white ring-2 ring-white">{i + 1}</span>
                </span>
                <span className="min-w-0 md:mt-2">
                  <span className="block font-bold leading-6 text-ink">{s.title}</span>
                  <span className="mt-1 block text-[13px] leading-6 text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="prepare" className="mt-12 rounded-[var(--radius-card)] bg-brand-tint p-6 ring-1 ring-brand/15">
          <h2 id="prepare" className="text-[20px] font-bold text-ink">
            相談の前に準備しておくと話しやすいこと
          </h2>
          <p className="mt-2 text-[14.5px] leading-7 text-body">すべてを決めておく必要はありません。転職したい時期の目安と、ゆずれない条件が1〜2個あれば十分です。</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/check" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-strong">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              条件整理チェックで整理する
            </Link>
            <Link href="/articles/agent-mendan-mae" className="inline-flex items-center justify-center rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-bold text-ink hover:border-brand">
              面談前に決めておくことを読む
            </Link>
          </div>
        </section>

        <section aria-labelledby="consult-faq" className="mt-12">
          <h2 id="consult-faq" className="text-[22px] font-bold text-ink">
            よくある質問
          </h2>
          <dl className="mt-5 space-y-3">
            {FAQ.map((f) => (
              <div key={f.question} className="rounded-xl bg-white p-5 ring-1 ring-line">
                <dt className="font-bold text-ink">Q. {f.question}</dt>
                <dd className="mt-2 text-[14.5px] leading-7 text-body">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-14">
          <ConsultationCta placement="consultation-page" />
        </div>
      </div>
    </>
  );
}
