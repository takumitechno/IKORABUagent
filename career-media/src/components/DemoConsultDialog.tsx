"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * consultationMode=demo のとき、相談ボタン（申込先 URL へのリンク）を押しても移動せず、
 * 本番での動き（申込ページへ移動・設置場所ごとの計測）を説明する。
 * 申込先が未確定の提案デモで、実在しない／未確定のページへ読者を送らないため。
 */
export function DemoConsultDialog({ consultationOrigin }: { consultationOrigin: string }) {
  const [placement, setPlacement] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !a.href.startsWith(consultationOrigin)) return;
      e.preventDefault();
      let content = "";
      try {
        content = new URL(a.href).searchParams.get("utm_content") ?? "";
      } catch {
        content = "";
      }
      setPlacement(content || "—");
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlacement(null);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [consultationOrigin]);

  useEffect(() => {
    if (placement) closeRef.current?.focus();
  }, [placement]);

  if (!placement) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 p-4" role="dialog" aria-modal="true" aria-labelledby="demo-consult-title" onClick={(e) => e.target === e.currentTarget && setPlacement(null)}>
      <div className="w-full max-w-md rounded-[18px] bg-white p-6 shadow-[0_20px_50px_-20px_rgb(20_43_62/0.5)]">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] font-bold tracking-[0.2em] text-accent">DEMO</p>
          <button type="button" onClick={() => setPlacement(null)} className="-mr-2 -mt-2 rounded-full p-2 text-muted hover:bg-canvas" aria-label="閉じる">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <h2 id="demo-consult-title" className="mt-1 text-lg font-bold leading-snug text-ink">
          ここから相談の申し込みページへ移動します
        </h2>
        <p className="mt-3 text-[14.5px] leading-7 text-body">
          デモ版のため、実際の申し込みページには移動しません。本番では運営会社の申し込みページへ、どの導線から来たかが分かる計測パラメータを付けて移動します。
        </p>
        <p className="mt-3 text-[13px] text-muted">
          このボタンの設置場所: <code className="rounded-md border border-line bg-canvas px-1.5 py-0.5 text-[12.5px] text-ink">{placement}</code>
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Link href="/consultation" onClick={() => setPlacement(null)} className="rounded-full border border-line-strong px-4 py-2.5 text-sm font-bold text-ink hover:border-brand">
            相談サービスの説明を見る
          </Link>
          <button ref={closeRef} type="button" onClick={() => setPlacement(null)} className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-strong">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
