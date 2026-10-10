"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check } from "lucide-react";

const CONCERNS = [
  { label: "接客の経験しかない", title: "「接客しか」も、伝え方から。", before: "接客をしていました。", after: "相手の要望を聞き、合うものを提案してきました。", help: "何を工夫していたかを振り返り、応募先に伝わる書類や面接の言葉へ。", note: "経験の言い換え例。実際にしてきたことだけを伝えます。", article: "sekkyaku-keiken-ikasu", read: "職務経歴書の例文を読む", guide: "/situations/sekkyaku", consult: "経験の伝え方を相談する" },
  { label: "給料も、休みも大切", title: "条件は、あきらめる前に比べる。", before: "給料を下げずに、土日も休みたい。", after: "年収の内訳と年間休日を、同じ基準で比べる。", help: "求人票の見方と、譲りたくない条件を整理。両立が難しい場合も、理由を確かめて検討します。", note: "希望に合う求人や、年収アップを保証するものではありません。", article: "donichi-yasumi-nenshu-hikaku", read: "年収と休日の計算例を読む", guide: "/concerns/kyuryo", consult: "働く条件を相談する" },
  { label: "正社員経験が少ない", title: "話せることは、一緒に探そう。", before: "アピールできる経験が分からない。", after: "続けてきたことと、これから大切にしたいことを整理。", help: "アルバイトや日常で取り組んだことから振り返り、初めての書類・面接の準備へ進みます。", note: "経験を大きく見せる必要はありません。分からないことも整理の出発点です。", article: "agent-mendan-mae", read: "初めての相談で話すことを読む", guide: "/situations/seishain-keiken-sukunai", consult: "初めての転職を相談する" },
];

export function ConsultationPreview() {
  const [selected, setSelected] = useState(0);
  const concern = CONCERNS[selected];
  return (
    <div className="support-preview">
      <div className="support-choices" role="group" aria-label="今の気持ちに近い悩みを選ぶ">
        {CONCERNS.map((item, i) => <button key={item.label} type="button" aria-pressed={selected === i} aria-controls="support-answer" onClick={() => setSelected(i)}><span>0{i + 1}</span>{item.label}<ArrowRight aria-hidden="true" /></button>)}
      </div>
      <div id="support-answer" className="support-answer" aria-live="polite" aria-atomic="true">
        <div key={selected} className="support-answer-content">
          <div className="support-example">
            <span className="support-label">相談で整理することの例</span>
            <p className="support-before">{concern.before}</p>
            <ArrowDown className="support-down" aria-hidden="true" />
            <p className="support-after">{concern.after}</p>
            <p className="support-note">{concern.note}</p>
          </div>
          <div className="support-explanation">
            <p className="editorial-kicker">キャリアアドバイザーとできること</p>
            <h3>{concern.title}</h3>
            <p>{concern.help}</p>
            <Link href="/consultation#first-talk" data-cta-placement="home-band" data-cta-kind="consultation-info" className="editorial-button">{concern.consult}<ArrowRight aria-hidden="true" /></Link>
            <Link href={`/articles/${concern.article}`} className="editorial-text-link">{concern.read}<ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
      <p className="support-reassurance"><Check aria-hidden="true" />紹介された求人に応募するかは、自分で決められます。</p>
      <noscript><ul>{CONCERNS.map((item) => <li key={item.guide}><Link href={item.guide}>{item.label}：読む順番を見る</Link></li>)}</ul></noscript>
    </div>
  );
}
