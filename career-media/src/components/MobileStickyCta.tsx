"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/** スマホで記事を読み進めたときだけ下部に出る相談ボタン */
export function MobileStickyCta({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <a href={href} tabIndex={visible ? 0 : -1} className="flex items-center justify-center gap-1.5 rounded-full bg-accent py-3 text-[15px] font-bold text-white">
        {label}
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
}
