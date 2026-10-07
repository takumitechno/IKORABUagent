import Link from "next/link";
import { Presentation } from "lucide-react";
import { salesDemoEnabled } from "@/config/sales";

/** 商談デモのときだけ、どのページからでも商談メニューに戻れるボタン */
export function SalesMenuButton() {
  if (!salesDemoEnabled) return null;
  return (
    <Link
      href="/sales"
      title="商談メニュー"
      className="no-print fixed bottom-[88px] left-2 z-40 inline-flex h-10 w-10 items-center justify-center gap-1.5 rounded-full bg-ink/80 text-[12px] font-bold text-white shadow-lg ring-1 ring-white/20 backdrop-blur hover:bg-ink md:bottom-4 md:left-3 md:h-auto md:w-auto md:px-3 md:py-2"
    >
      <Presentation className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only md:not-sr-only">商談メニュー</span>
    </Link>
  );
}
