import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONSULTATION_TOPICS } from "@/lib/consultation-topics";
import { partner } from "@/config/partner";
import { ConsultButton } from "./ConsultationCta";

/** Fragment links keep the selected topic working in static exports and without JavaScript. */
export function ConsultationTopics() {
  return <section id="first-talk" className="consult-topics" aria-labelledby="first-talk-title">
    <h2 id="first-talk-title">相談したい内容を選ぶ</h2>
    <div className="topic-switch">
      {CONSULTATION_TOPICS.map((topic) => <article key={topic.id} id={`support-${topic.id}`} className={`topic-panel topic-${topic.id}`} aria-labelledby={`title-${topic.id}`} tabIndex={-1}>
        <nav className="topic-nav" aria-label="相談したいこと">{CONSULTATION_TOPICS.map(item => <a key={item.id} href={`#support-${item.id}`} aria-current={item.id === topic.id ? "location" : undefined}>{item.short}</a>)}</nav>
        <div className="topic-body"><div className="topic-copy"><h3 id={`title-${topic.id}`}>{topic.conversationTitle}</h3>
          <div className="topic-question"><p>相談での伝え方の例</p><strong>「{topic.opening}」</strong></div>
          <details className="editorial-details topic-guide"><summary>相談前にメモしたい方へ（任意）</summary><dl className="topic-preparation"><div><dt>メモしておくこと</dt><dd>{topic.prepare}</dd></div><div><dt>確認したいこと</dt><dd>{topic.ask}</dd></div></dl></details>
          <a href="#consult-provider" className="editorial-text-link">相談先・申し込み後の案内を確認<ArrowRight aria-hidden="true" /></a>
        </div><div className="topic-next"><p className="editorial-kicker">相談の申し込み</p><p className="topic-fee">{partner.consultationFeeNote}</p><ConsultButton placement="consultation-page" topic={topic.id} label={topic.consult} /><p>応募するかどうかは、自分で決められます。</p><p className="topic-demo-note">このプレビューでは、実際の申し込みや情報送信は行いません。</p></div></div>
        <div className="topic-foot"><p>{partner.consultationEligibilityNote}</p><Link href={`/articles/${topic.article}`} className="editorial-text-link">{topic.read}<ArrowRight aria-hidden="true" /></Link></div>
      </article>)}
    </div>
  </section>;
}
