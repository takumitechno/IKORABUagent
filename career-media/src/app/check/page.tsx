import { Clock, Lock, ShieldCheck } from "lucide-react";
import { ConditionCheck } from "@/components/ConditionCheck";
import { ConditionNotePreview } from "@/components/ConditionNotePreview";
import { PageHero } from "@/components/PageHero";
import { buildConsultationUrl } from "@/lib/consultation";
import { ALL_QUESTIONS } from "@/lib/condition-check/questions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "未経験転職 条件整理チェック",
  description: "いくつかの質問に答えるだけで、希望条件・活かせそうな経験・比べてみたい職種・確認したい条件・面談で聞きたいことを整理できます。登録不要・回答は送信されません。",
  path: "/check",
});

export default function CheckPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "ホーム", path: "/" }, { name: "条件整理チェック", path: "/check" }]}
        eyebrow="条件整理チェック"
        title="希望と経験を整理して、相談に備える。"
        lead={`${ALL_QUESTIONS.length}問で希望や経験を整理し、相談用のメモを作れます。適職の判定はしません。`}
        icon="clipboard-list"
        compact
      >
        <ul className="flex flex-wrap gap-2 text-[12.5px] font-bold">
          {[
            { icon: Clock, text: "約3分" },
            { icon: Lock, text: "登録不要" },
            { icon: ShieldCheck, text: "回答の送信なし" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="inline-flex items-center gap-1.5 text-muted">
              <Icon className="h-3.5 w-3.5 text-brand-strong" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </PageHero>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <details className="check-output-example no-print">
          <summary>メモの見本を見る</summary>
          <p className="mt-4 text-xs leading-6 text-muted">回答後のメモは、コピー・印刷して相談に持っていけます。</p>
          <ConditionNotePreview />
        </details>
        <div id="condition-check-root" className="mt-4 bg-canvas">
          <ConditionCheck consultationHref={buildConsultationUrl("check-result")} consultationLabel="整理した内容をもとに相談する" />
        </div>
      </div>
    </>
  );
}
