"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, MessageCircle } from "lucide-react";

/**
 * スマホで記事を読み進めたときだけ下部に出る「次の一歩」。
 * プロへの相談（申し込み）と、自分で整理する道（条件整理チェック）を並べる。
 * 申し込みのリンク先はサーバー側で作って渡す（本番送客が無効な間はサイト内の説明ページ）。
 */
export function MobileStickyCta({ contentSlug, consultHref = "/consultation" }: { contentSlug?: string; consultHref?: string }) {
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
      <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-2">
        <a href={consultHref} tabIndex={tab} data-cta-placement="article-sticky" data-cta-kind="consultation-apply" data-content-slug={contentSlug} className="flex items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-[13.5px] font-bold text-white">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          プロに相談する
        </a>
        <Link href="/check" tabIndex={tab} data-cta-placement="article-sticky" data-cta-kind="check" data-content-slug={contentSlug} className="flex items-center justify-center gap-1.5 rounded-full border border-line-strong bg-white py-2.5 text-[13.5px] font-bold text-ink">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          条件を整理
        </Link>
      </div>
    </div>
  );
}
