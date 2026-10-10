import Link from "next/link";
import { BookOpen, ClipboardList } from "lucide-react";
import { ServiceHighlights, SoloVsPro } from "@/components/ProValue";
import { HeroMockupPeek } from "@/components/HeroMockup";
import { PageHero } from "@/components/PageHero";
import { ConsultButton, ConsultationCta, PartnerNote } from "@/components/ConsultationCta";
import { JsonLd } from "@/components/JsonLd";
import { partner } from "@/config/partner";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "キャリア相談について｜転職はプロに相談しながら進めよう",
  description: `はじめての転職・未経験の転職を、人材紹介会社のキャリアアドバイザー（転職エージェント）に相談するとできること（企業選び・面接の練習・書類の添削・日程調整）、相談の流れ、相談前に準備しておくこと、よくある質問をまとめています。`,
  path: "/consultation",
});

const FAQ = [
  {
    question: "相談に費用はかかりますか？",
    answer:
      "人材紹介会社（有料職業紹介事業者）は、職業安定法により、原則として求職者から手数料を受け取ることができません（一部の職業を除く）。紹介手数料は、採用した企業が支払うしくみです。実際の条件は、申し込みページで相談先の案内を確認してください。",
  },
  { question: "面接の練習もしてもらえますか？", answer: "人材紹介会社のキャリア相談では、応募先に合わせた面接の準備（模擬面接など）のサポートを受けられることが一般的です。具体的な内容は、相談のときに確認してください。" },
  { question: "どの会社を選べばいいか分からなくても相談できますか？", answer: "はい。求人票だけでは分からない職場のことを聞きながら、条件の優先順位や自分に合う会社を一緒に考えられます。" },
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
      <PageHero
        crumbs={[{ name: "ホーム", path: "/" }, { name: "キャリア相談について", path: "/consultation" }]}
        eyebrow="CAREER CONSULTATION"
        title={
          <>
            転職は、<span className="text-highlight">プロに相談</span>しながら
            <br className="hidden sm:block" />
            進めよう
          </>
        }
        lead={`${partner.adviserLabel}に、企業選びから面接の練習・書類の添削・日程の調整まで相談できます。応募するかどうかは、ご自身で決められます。`}
        visual={
          <div className="enter-pop enter-d2 mr-4 w-[290px]">
            <HeroMockupPeek />
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ConsultButton placement="consultation-page" label="キャリア相談を申し込む" size="lg" />
        </div>
        <PartnerNote className="mt-4 text-[11.5px] leading-5 text-white/60" />
      </PageHero>
      <div className="mx-auto max-w-5xl px-4 pt-2 sm:px-6">
        <section aria-labelledby="services" className="mt-12">
          <h2 id="services" className="text-[22px] font-bold text-ink">
            キャリア相談でできること
          </h2>
          <div className="mt-5">
            <ServiceHighlights compact />
          </div>
          <p className="mt-3 text-[12.5px] leading-6 text-muted">{partner.serviceHighlightsNote} 内定や年収アップなどの結果を保証するものではありません。</p>
        </section>

        <section aria-labelledby="solo-vs-pro" className="mt-12">
          <h2 id="solo-vs-pro" className="text-[22px] font-bold text-ink">
            ひとりで進める場合との違い
          </h2>
          <div className="mt-5">
            <SoloVsPro />
          </div>
          <div className="mt-5 rounded-[var(--radius-card)] border border-line bg-white p-5">
            <p className="flex items-center gap-2 font-bold text-ink">
              <BookOpen className="h-5 w-5 text-brand" aria-hidden="true" />
              このメディアの使い方
            </p>
            <p className="mt-2 text-[14px] leading-7 text-body">
              記事で仕事や条件の見方を知り、条件整理チェックで希望や経験を書き出しておくと、相談のときに話が進みやすくなります。このメディア自体は、求人の紹介や応募先の判断はしていません。
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] font-bold">
              <Link href="/articles/tenshoku-agent-merit" className="text-brand-strong underline underline-offset-2">エージェントに相談したほうがいい理由</Link>
              <Link href="/articles/mensetsu-renshu-pro" className="text-brand-strong underline underline-offset-2">面接の練習をプロに頼む</Link>
              <Link href="/articles/kigyou-erabi-soudan" className="text-brand-strong underline underline-offset-2">会社選びをプロに相談する</Link>
            </p>
          </div>
        </section>

        <section aria-labelledby="audience" className="mt-12">
          <h2 id="audience" className="text-[22px] font-bold text-ink">
            こんな方の相談を想定しています
          </h2>
          <ul className="anim-list mt-5 grid gap-3 sm:grid-cols-2">
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
          <ol className="anim-list relative mt-5 grid gap-3 md:grid-cols-5">
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
