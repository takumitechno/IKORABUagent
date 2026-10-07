import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { consultationMode, partner } from "@/config/partner";
import { salesAddressee, salesDemoEnabled } from "@/config/sales";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/sales", label: "商談メニュー" },
  { href: "/sales/sns", label: "Instagram 投稿案" },
  { href: "/sales/proposal", label: "Pilot の提案" },
  { href: "/sales/measurement", label: "計測の設計" },
];

/** 商談用ページ（SALES_DEMO=1 のローカルデモだけ。読者向けのメディアとは分ける） */
export default function SalesLayout({ children }: { children: React.ReactNode }) {
  if (!salesDemoEnabled) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-white">
        <p className="flex items-center gap-2 text-[12.5px] font-bold">
          <Lock className="h-4 w-4 text-accent-bright" aria-hidden="true" />
          {salesAddressee}向け 商談用資料（非公開・ローカル表示のみ）
        </p>
        <p className="flex flex-wrap gap-2 text-[11.5px]">
          <span className="rounded-full bg-white/10 px-2.5 py-0.5">表示: {partner.profile === "makecareer" ? "商談用プレビュー" : "中立デモ"}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5">本番送客: {consultationMode === "live" ? "ON" : "OFF"}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5">検索エンジン: noindex</span>
        </p>
      </div>
      <nav aria-label="商談用ページ" className="no-print mt-3 flex gap-2 overflow-x-auto pb-1">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink ring-1 ring-line hover:text-brand-strong">
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
