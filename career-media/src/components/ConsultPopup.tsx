"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, MessagesSquare, X } from "lucide-react";

const KEY = "consult-popup-dismissed";
/** 相談ページ・チェック・申込の説明ページでは出さない（すでに相談や整理の途中のため） */
const SKIP = ["/consultation", "/check", "/sales"];

/**
 * 読み進めたところで、右下（スマホは下）に小さく出る相談の案内。1回閉じたら、このタブでは出さない。
 * - スクロールが 1400px を超えたとき、または 25 秒たったときに出す
 * - 閉じた記録は sessionStorage（使えない環境でも動く。そのときは画面を移るまで出さない）
 * - 申込のリンク先はサーバー側で作って渡す（本番送客が無効な間はサイト内の説明ページ）
 */
export function ConsultPopup({ href, title, label, points }: { href: string; title: string; label: string; points: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(false);
  const skip = SKIP.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (skip || closed) return;
    try {
      if (window.sessionStorage.getItem(KEY)) return;
    } catch {
      /* storage が使えない環境でも、このページでは表示してよい */
    }
    const show = () => setOpen(true);
    const onScroll = () => {
      if (window.scrollY > 1400) show();
    };
    const timer = window.setTimeout(show, 25000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [skip, closed, pathname]);

  if (!open || skip || closed) return null;

  const dismiss = () => {
    setOpen(false);
    setClosed(true);
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* 記録できなくても閉じる */
    }
  };

  return (
    <aside
      role="dialog"
      aria-label={title}
      className="popup-in no-print fixed bottom-[84px] left-3 right-3 z-40 overflow-hidden rounded-2xl bg-night text-white shadow-[0_24px_60px_-18px_rgb(0_0_0/0.6)] ring-1 ring-white/10 sm:left-auto sm:right-5 sm:w-[340px] md:bottom-5"
    >
      <span aria-hidden="true" className="drift pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-accent-bright)_45%,transparent),transparent_65%)]" />
      <button type="button" onClick={dismiss} aria-label="閉じる" className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="relative p-4 pr-10">
        <p className="flex items-center gap-2 text-[14.5px] font-bold">
          <span className="flash-in flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
            <MessagesSquare className="h-4 w-4" aria-hidden="true" />
          </span>
          {title}
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {points.map((p, i) => (
            <li key={p} className="chat-pop inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-bold ring-1 ring-white/15" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
              <CheckCircle2 className="h-3.5 w-3.5 text-highlight" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-3.5 flex items-center gap-2">
          <a href={href} data-cta-placement="popup" data-cta-kind="consultation-apply" className="btn-shine inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-[13.5px] font-bold text-white hover:bg-accent-press">
            {label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button type="button" onClick={dismiss} className="rounded-full px-3 py-2.5 text-[12.5px] font-bold text-white/70 hover:text-white">
            あとで
          </button>
        </div>
      </div>
    </aside>
  );
}
