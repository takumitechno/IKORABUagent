import Link from "next/link";
import { ArrowLeft, ClipboardList, MessageCircle, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PartnerNote } from "@/components/ConsultationCta";
import { partner } from "@/config/partner";
import { pageMetadata } from "@/lib/seo";
import { PlacementNote } from "./PlacementNote";

/**
 * 本番送客が無効な間、相談の申し込みボタンが向かうページ。
 * ここから先（提携先の申込フォーム）へのリンクは置かない。検索エンジンにも載せない。
 */
export const metadata = pageMetadata({
  title: "相談の申し込み（デモ）",
  description: "デモ版のため、相談の申し込みページには移動しません。",
  path: "/consultation/apply",
  noindex: true,
});

export default function ConsultationApplyDemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "キャリア相談について", path: "/consultation" },
          { name: "相談の申し込み（デモ）", path: "/consultation/apply" },
        ]}
      />
      <section className="mt-6 rounded-[20px] bg-surface p-6 ring-1 ring-line sm:p-10">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[12px] font-bold text-accent-strong">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {partner.brandUsageApproved ? "申し込みページは準備中です" : "デモ版のため、ここから先へは移動しません"}
        </p>
        <h1 className="mt-4 text-[24px] font-bold leading-snug text-ink sm:text-[28px]">ここから、相談の申し込みページへ進む想定です</h1>
        <p className="mt-4 text-[15px] leading-8 text-body">
          正式に公開するときは、このボタンから {partner.partnerName} の申し込みページへ進みます。申し込みページでは、相談先が連絡方法などを確認します。このサイトで氏名や連絡先を入力していただくことはありません。
        </p>
        <p className="mt-3 text-[15px] leading-8 text-body">
          このページは提案用のデモのため、実際の申し込みページにはつながっていません。条件整理チェックの回答や、このサイトでの閲覧内容が相談先に送られることもありません。
        </p>
        <PlacementNote />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/consultation" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line-strong px-5 py-3 text-sm font-bold text-ink hover:border-brand">
            <MessageCircle className="h-4 w-4 text-brand" aria-hidden="true" />
            相談でできることを見る
          </Link>
          <Link href="/check" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-press">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            先に条件を整理する
          </Link>
        </div>
        <PartnerNote className="mt-8 border-t border-line pt-4 text-xs leading-6 text-muted" />
      </section>
      <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        トップへ戻る
      </Link>
    </div>
  );
}
