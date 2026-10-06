import { Clock, Lock, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConditionCheck } from "@/components/ConditionCheck";
import { CheckIllustration } from "@/components/illustrations/CheckIllustration";
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
      <header className="mt-4 grid items-center gap-2 overflow-hidden rounded-[22px] bg-brand-tint p-5 ring-1 ring-brand/15 sm:mt-6 sm:grid-cols-[minmax(0,1fr)_220px] sm:p-8">
        <div className="order-2 sm:order-1">
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand">SELF CHECK</p>
          <h1 className="mt-1 text-[24px] font-bold leading-snug text-ink sm:text-[30px]">未経験転職 条件整理チェック</h1>
          <p className="mt-2 text-[15px] leading-7 text-body">
            {ALL_QUESTIONS.length}の質問に答えると、ゆずれない条件・活かせそうな経験・比べてみたい職種・面談で聞きたいことが一覧になります。合否や向き不向きを判定するものではありません。
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-[12.5px] font-medium text-ink">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 ring-1 ring-line">
              <Clock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              約3分
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 ring-1 ring-line">
              <Lock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              登録不要・回答は送信されません
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 ring-1 ring-line">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              氏名や連絡先の入力なし
            </li>
          </ul>
        </div>
        <CheckIllustration className="order-1 mx-auto h-[120px] w-auto sm:order-2 sm:h-[180px]" />
      </header>
      <div id="condition-check-root" className="mt-8 rounded-[20px] bg-canvas">
        <ConditionCheck consultationHref={buildConsultationUrl("check-result")} consultationLabel={partner.consultationIsFree ? "キャリアアドバイザーに無料で相談する" : "キャリアアドバイザーに相談する"} />
      </div>
    </div>
  );
}
