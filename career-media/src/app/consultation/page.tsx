import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList } from "lucide-react";
import { SoloVsPro } from "@/components/ProValue";
import { ConsultationTrust } from "@/components/ConsultationTrust";
import { ConsultationTopics } from "@/components/ConsultationTopics";
import { PageHero } from "@/components/PageHero";
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



export default function ConsultationPage() {
  return (
    <div className="editorial-consultation">
      <JsonLd data={faqJsonLd({ faq: FAQ })} />
      <PageHero crumbs={[{ name: "ホーム", path: "/" }, { name: "キャリア相談について", path: "/consultation" }]} eyebrow="キャリア相談" title={<>仕事選びから、<br />書類と面接の準備まで。</>} lead="気になる仕事や今の悩みから相談できます。書類や志望動機は、完成していなくても大丈夫です。" compact>
          <ul className="consult-assurance" aria-label="相談の前に知っておきたいこと">
            <li>{partner.consultationFeeNote}</li><li>応募するかどうかは、自分で決められます。</li>
          </ul>
          <p className="mt-4 text-[13px] font-bold leading-7 text-brand-strong">{partner.consultationFormatNote}</p>
          <p className="mt-4 text-[12px] leading-6 text-muted">{partner.consultationEligibilityNote} <a href="#consult-provider" className="font-bold text-brand-strong underline underline-offset-4">対応対象・相談方法を確認</a></p>
      </PageHero>
      <div className="mx-auto max-w-5xl px-4 pt-2 sm:px-6">
        <ConsultationTopics />
        <div id="consult-provider" className="consult-before-apply">
          <ConsultationTrust compact />
          <section className="consult-expectations" aria-labelledby="before-apply">
            <h2 id="before-apply">申し込む前に知っておくこと</h2>
            <dl><div><dt>申し込み後の連絡</dt><dd>連絡方法・初回連絡の目安は、正式公開前に確認して掲載します。</dd></div><div><dt>事前の準備</dt><dd>担当した仕事や、今の悩みの短いメモがあると話しやすくなります。準備ができていなくても相談できます。</dd></div></dl>
          </section>
        </div>
        <section aria-labelledby="services" className="mt-12">
          <h2 id="services" className="text-[22px] font-bold text-ink">
            キャリア相談でできること
          </h2>
          <div className="mt-5">{partner.serviceHighlights.map((item) => <details key={item.title} className="editorial-details"><summary>{item.title}</summary><p className="py-4 text-sm leading-7 text-body">{item.body}</p></details>)}</div>
          <p className="mt-3 text-[12.5px] leading-6 text-muted">{partner.serviceHighlightsNote} 内定や年収アップなどの結果を保証するものではありません。</p>
        </section>

        <section aria-labelledby="solo-vs-pro" className="mt-12"><details className="editorial-details"><summary id="solo-vs-pro">ひとりで進める場合との違い</summary>
          <div className="mt-5">
            <SoloVsPro />
          </div>
          <div className="mt-5 rounded-[var(--radius-card)] border border-line bg-surface p-5">
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
        </details></section>

        <section aria-labelledby="audience" className="mt-6"><details className="editorial-details">
          <summary id="audience">相談を想定している方・対象について</summary>
          <ul className="anim-list mt-5 grid gap-3 sm:grid-cols-2">
            {partner.serviceAudience.map((a) => (
              <li key={a} className="rounded-xl bg-surface p-4 text-[14.5px] leading-7 ring-1 ring-line">
                {a}
              </li>
            ))}
          </ul>
          <p className="my-4 text-sm leading-7 text-muted">{partner.consultationEligibilityNote}</p>
        </details></section>

        <section aria-labelledby="flow" className="mt-6"><details className="editorial-details">
          <summary id="flow">申し込みから入社までの流れ</summary>
          <p className="mt-2 text-[13px] leading-6 text-muted">{partner.consultationStepsNote}</p>
          <ol className="editorial-flow">
            {partner.consultationSteps.map((s, i) => <li key={s.title}><span className="editorial-flow-number">0{i + 1}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></li>)}
          </ol>
          <p className="my-4 text-sm leading-7 text-muted">{partner.consultationFormatNote} 申し込み後の連絡方法・初回連絡の目安は、正式公開前に確認して案内します。</p>
        </details></section>

        <section aria-labelledby="prepare" className="mt-12 rounded-[var(--radius-card)] bg-brand-tint p-6 ring-1 ring-brand/15">
          <h2 id="prepare" className="text-[20px] font-bold text-ink">
            相談の前に準備しておくと話しやすいこと
          </h2>
          <p className="mt-2 text-[14.5px] leading-7 text-body">すべてを決めておく必要はありません。転職したい時期の目安と、気になる条件を伝えられれば十分です。まだ決められないことも、そのまま相談できます。</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/check" className="editorial-button">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              条件整理チェックで整理する
            </Link>
            <Link href="/articles/agent-mendan-mae" className="lp-underlink">
              面談前に決めておくことを読む
            </Link>
          </div>
        </section>

        <section aria-labelledby="consult-faq" className="mt-12">
          <h2 id="consult-faq" className="text-[22px] font-bold text-ink">
            よくある質問
          </h2>
          <div className="mt-5">{FAQ.map((f) => <details key={f.question} className="editorial-details"><summary>{f.question}</summary><p className="py-4 text-sm leading-7 text-body">{f.answer}</p></details>)}</div>
        </section>

        <p className="consult-return"><a href="#first-talk" className="lp-underlink">相談したいことを選ぶ<ArrowRight aria-hidden="true" /></a><span>内定・年収アップを保証するサービスではありません。</span></p>
      </div>
    </div>
  );
}
