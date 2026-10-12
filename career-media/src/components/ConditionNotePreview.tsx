import { ClipboardList } from "lucide-react";

/** The output format is visible before answering; this is a fictional note, not a diagnosis. */
export function ConditionNotePreview() {
  return <aside className="condition-note-preview" aria-label="条件整理で作れるメモの見本">
    <p className="note-preview-caption"><span><ClipboardList aria-hidden="true" />相談用メモの見本</span><span>架空の例</span></p>
    <dl>
      <div><dt>譲れない条件</dt><dd>土日休み。今の収入も大切にしたい。</dd></div>
      <div><dt>活かせる経験</dt><dd>接客でお客様の希望を聞き、商品を案内した。</dd></div>
      <div><dt>相談で聞きたいこと</dt><dd>未経験から応募できる事務職は？</dd></div>
    </dl>
    <p className="note-preview-foot">回答に合わせて、比較する候補や求人で確認する項目も整理します。適職・内定の判定はしません。</p>
  </aside>;
}
