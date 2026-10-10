import { Clock, Lock, ShieldCheck } from "lucide-react";
import { ConditionCheck } from "@/components/ConditionCheck";
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
        eyebrow="SELF CHECK"
        title="未経験転職 条件整理チェック"
        lead={`${ALL_QUESTIONS.length}の質問に答えると、優先したい条件や面談で聞きたいことが一覧になります。合否や向き不向きの判定はしません。`}
        icon="clipboard-list"
      >
        <ul className="flex flex-wrap gap-2 text-[12.5px] font-bold">
          {[
            { icon: Clock, text: "約3分" },
            { icon: Lock, text: "登録不要・回答は送信されません" },
            { icon: ShieldCheck, text: "氏名や連絡先の入力なし" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">
              <Icon className="h-3.5 w-3.5 text-highlight" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </PageHero>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div id="condition-check-root" className="mt-8 rounded-[20px] bg-canvas">
          <ConditionCheck consultationHref={buildConsultationUrl("check-result")} consultationLabel="整理した内容をもとに相談する" />
        </div>
      </div>
    </>
  );
}
