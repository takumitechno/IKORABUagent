import { Clock, Lock, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConditionCheck } from "@/components/ConditionCheck";
import { partner } from "@/config/partner";
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
    <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: "条件整理チェック", path: "/check" }]} />
      <header className="mt-6">
        <p className="text-[11px] font-bold tracking-[0.2em] text-brand">SELF CHECK</p>
        <h1 className="mt-1 text-[26px] font-bold leading-snug text-ink sm:text-[30px]">未経験転職 条件整理チェック</h1>
        <p className="mt-3 text-[15px] leading-8 text-body">
          転職で何を優先したいか、これまでの経験のどこが活かせそうか、どの職種を比べればいいか。{ALL_QUESTIONS.length}
          の質問に答えると、次に調べること・確認することを一覧にできます。合否や向き不向きを判定するものではありません。
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted">
          <li className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
            所要時間 約3分
          </li>
          <li className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-brand" aria-hidden="true" />
            登録不要・回答は送信されません
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
            氏名や連絡先の入力はありません
          </li>
        </ul>
      </header>
      <div className="mt-8 rounded-[20px] bg-canvas">
        <ConditionCheck consultationHref={buildConsultationUrl("check-result")} consultationLabel={partner.consultationIsFree ? "キャリアアドバイザーに無料で相談する" : "キャリアアドバイザーに相談する"} />
      </div>
    </div>
  );
}
