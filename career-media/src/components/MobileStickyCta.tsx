"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, MessageCircle } from "lucide-react";

/**
 * スマホで記事を読み進めたときだけ下部に出る「次の一歩」。
 * いきなり申し込みをすすめず、まず自分で整理する道（条件整理チェック）と、相談の説明を並べる。
 */
export function MobileStickyCta({ contentSlug }: { contentSlug?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const tab = visible ? 0 : -1;
  return (
    <div
      className={`no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="grid grid-cols-2 gap-2">
        <Link href="/check" tabIndex={tab} data-cta-placement="article-sticky" data-cta-kind="check" data-content-slug={contentSlug} className="flex items-center justify-center gap-1.5 rounded-full bg-brand py-2.5 text-[13.5px] font-bold text-white">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          条件を整理する
        </Link>
        <Link href="/consultation" tabIndex={tab} data-cta-placement="article-sticky" data-cta-kind="consultation-info" data-content-slug={contentSlug} className="flex items-center justify-center gap-1.5 rounded-full border border-line-strong bg-white py-2.5 text-[13.5px] font-bold text-ink">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          相談について
        </Link>
      </div>
    </div>
  );
}
