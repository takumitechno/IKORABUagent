import Link from "next/link";
import { BookOpen, ClipboardList } from "lucide-react";
import { SoloVsPro } from "@/components/ProValue";
import { GeneratedImage } from "@/components/GeneratedImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsultButton, PartnerNote } from "@/components/ConsultationCta";
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
      <div className="editorial-shell pt-5"><Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "キャリア相談について", path: "/consultation" }]} /></div>
      <section className="editorial-hero editorial-consult-hero">
        <div className="editorial-hero-copy">
          <p className="editorial-kicker">CAREER CONSULTATION / キャリア相談</p>
          <h1>次の仕事を、<br /><span>一緒に考える相談。</span></h1>
          <p className="editorial-lead">経験の伝え方も、譲りたくない条件も。<br />まずは、今の状況を話すところから。</p>
          <ul className="consult-assurance" aria-label="相談の前に知っておきたいこと">
            <li>{partner.consultationFeeNote}</li><li>応募するかどうかは、自分で決められます。</li>
          </ul>
          <ConsultButton placement="consultation-page" label="キャリア相談を申し込む" size="lg" />
          <p className="editorial-fine">{partner.consultationEligibilityNote}</p>
          <PartnerNote className="mt-4 text-xs leading-6 text-muted" />
        </div>
        <figure className="editorial-hero-photo"><GeneratedImage slug="editorial-conversation" priority fallback={<div className="h-full bg-sand" />} className="h-full w-full !object-cover" /><figcaption><span>ONE STEP AT A TIME</span><span>自分のペースで、進もう。</span></figcaption><span className="editorial-photo-note">生成イメージ・人物は架空です</span></figure>
      </section>
      <div className="mx-auto max-w-5xl px-4 pt-2 sm:px-6">
        <section id="first-talk" className="first-talk" aria-labelledby="first-talk-title">
          <p className="editorial-kicker">最初の相談で話したいこと</p><h2 id="first-talk-title">立派な志望動機より、<br />今、気になっていることを。</h2>
          <ol className="first-talk-topics"><li><span>01</span><h3>今までのこと</h3><p>どんな仕事や作業をしてきた？</p></li><li><span>02</span><h3>これからの希望</h3><p>給料・休み・仕事内容。何が大切？</p></li><li><span>03</span><h3>困っていること</h3><p>会社選び、書類、面接のどこが不安？</p></li></ol>
          <div className="first-talk-action"><div><p>全部決まっていなくても、相談の出発点になります。</p><p className="editorial-fine">{partner.consultationFeeNote} {partner.consultationEligibilityNote}</p></div><ConsultButton placement="consultation-page" label="この内容で相談を申し込む" /></div>
          <details className="editorial-details"><summary>申し込み後の連絡・相談方法について</summary><p className="py-4 text-sm leading-7 text-body">この画面は提案用デモです。相談方法・所要時間・初回連絡の手段と目安は、相談先への確認後に掲載します。現在のボタンはサイト内の案内に進み、登録や情報送信は行いません。</p></details>
        </section>
        <section aria-labelledby="services" className="mt-12">
          <h2 id="services" className="text-[22px] font-bold text-ink">
            キャリア相談でできること
          </h2>
          <div className="mt-5">{partner.serviceHighlights.map((item, i) => <details key={item.title} className="editorial-details"><summary><span className="mr-4 text-xs text-muted">0{i + 1}</span>{item.title}</summary><p className="py-4 text-sm leading-7 text-body">{item.body}</p></details>)}</div>
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
          <p className="my-4 text-sm leading-7 text-muted">相談方法・所要時間・申し込み後の連絡方法は、正式公開前に相談先へ確認して案内します。</p>
        </details></section>

        <section aria-labelledby="prepare" className="mt-12 rounded-[var(--radius-card)] bg-brand-tint p-6 ring-1 ring-brand/15">
          <h2 id="prepare" className="text-[20px] font-bold text-ink">
            相談の前に準備しておくと話しやすいこと
          </h2>
          <p className="mt-2 text-[14.5px] leading-7 text-body">すべてを決めておく必要はありません。転職したい時期の目安と、気になる条件を伝えられれば十分です。まだ決められないことも、そのまま相談できます。</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/check" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-press">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              条件整理チェックで整理する
            </Link>
            <Link href="/articles/agent-mendan-mae" className="inline-flex items-center justify-center rounded-full border border-line-strong bg-surface px-5 py-3 text-sm font-bold text-ink hover:border-brand">
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

        <section className="editorial-consult mt-14"><div><p className="editorial-kicker">LET’S TALK</p><h2>まだ決まっていなくても。<br />まずは、今の話を。</h2><p>希望や経験を整理しながら、次の選択肢を考えましょう。</p><ConsultButton placement="consultation-page" label="キャリア相談を申し込む" size="lg" /><p className="editorial-fine">内定・年収アップを保証するサービスではありません。</p></div></section>
      </div>
    </div>
  );
}
