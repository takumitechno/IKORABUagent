import { Check } from "lucide-react";
import type { ConsultationTopic } from "@/lib/consultation-topics";

export function SupportSample({ topic }: { topic: ConsultationTopic }) {
  return <div className="support-sample">
    <p className="sample-caption"><span>{topic.id === "experience" ? "応募書類の書き方例" : topic.id === "conditions" ? "求人の条件を比べる例" : "相談に持っていくメモの例"}</span><span>架空の例</span></p>
    {topic.id === "experience" ? <>
      <dl className="sample-edit"><div className="sample-original"><dt>仕事内容だけを書いた例</dt><dd>販売店で接客を担当していました。</dd></div><div className="sample-revised"><dt>工夫した対応まで書いた例</dt><dd>商品の使い方とご予算を伺い、候補の違いを説明して選んでいただきました。</dd></div></dl>
    </> : topic.id === "conditions" ? <>
      <table className="sample-comparison"><caption className="sr-only">架空の求人AとBの条件比較</caption><thead><tr><th scope="col">確認すること</th><th scope="col">求人 A</th><th scope="col">求人 B</th></tr></thead><tbody>
        <tr><th scope="row">月給</th><td>25万円</td><td>23万円</td></tr>
        <tr><th scope="row">年間休日</th><td>110日</td><td>120日</td></tr>
        <tr><th scope="row">賞与・残業代</th><td colSpan={2}>内訳を確認</td></tr>
      </tbody></table>
      <p className="sample-takeaway"><Check aria-hidden="true" />賞与や残業代も確認して、給料を比べます。</p>
    </> : <>
      <dl className="sample-memo"><div><dt>続けたこと</dt><dd>飲食店のアルバイトを2年。</dd></div><div><dt>変えたいこと</dt><dd>生活リズムを安定させたい。</dd></div><div><dt>聞きたいこと</dt><dd>未経験から応募できる仕事は？</dd></div></dl>
      <p className="sample-takeaway"><Check aria-hidden="true" />これまでの仕事と、聞きたいことをメモに。</p>
    </>}
    <p className="support-note">{topic.note}</p>
  </div>;
}
