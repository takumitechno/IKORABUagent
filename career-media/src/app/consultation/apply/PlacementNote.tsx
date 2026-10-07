"use client";

import { useEffect, useState } from "react";

/** どのボタンから来たか（utm_content に相当）を表示する。JavaScript が無効なときは何も出さない */
export function PlacementNote() {
  const [placement, setPlacement] = useState<string | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("placement");
    if (value && /^[a-z0-9_-]{1,120}$/i.test(value)) setPlacement(value);
  }, []);
  if (!placement) return null;
  return (
    <p className="mt-4 text-[13px] leading-6 text-muted">
      押したボタンの設置場所（本番では計測用パラメータとして申し込みページへ渡します）:{" "}
      <code className="rounded-md border border-line bg-canvas px-1.5 py-0.5 text-[12.5px] text-ink">{placement}</code>
    </p>
  );
}
