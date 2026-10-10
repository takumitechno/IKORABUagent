"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// このタブでサイト内を移動した順番（ページを再読み込みすると空に戻る）
const visited: string[] = [];

/** レイアウトに1つ置き、サイト内の移動を記録する（前のページに戻ったときは記録を1つ戻す） */
export function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (visited.at(-1) === pathname) return;
    if (visited.at(-2) === pathname) visited.pop();
    else visited.push(pathname);
  }, [pathname]);
  return null;
}

/**
 * 前の画面に戻るボタン。サイト内で移動してきたときはブラウザの履歴で戻り（スクロール位置も戻る）、
 * 直接開いたときは fallback（ひとつ上の階層）へ移動する。JavaScript がなくても fallback へのリンクとして動く。
 * アーティファクト版では data-back を scripts/artifact/runtime.js が受け取り、ページ内の履歴で戻る。
 */
export function BackButton({ fallback, dark = false }: { fallback: string; dark?: boolean }) {
  const router = useRouter();
  return (
    <a
      href={fallback}
      data-back=""
      onClick={(e) => {
        if (visited.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
      className={`no-print inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[12.5px] font-bold ${
        dark ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20" : "border border-line bg-white text-ink hover:border-brand/40 hover:text-brand-strong"
      }`}
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      戻る
    </a>
  );
}
