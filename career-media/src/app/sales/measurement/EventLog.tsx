"use client";

import { useEffect, useState } from "react";
import { EVENTS_KEY, storedEvents } from "@/lib/measurement/client";
import type { SiteEvent } from "@/lib/measurement/schema";

/** このタブで記録されたサイトのイベント（どこにも送信していない） */
export function EventLog() {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  useEffect(() => {
    const load = () => setEvents(storedEvents().slice().reverse());
    load();
    window.addEventListener("career-media:event", load);
    return () => window.removeEventListener("career-media:event", load);
  }, []);
  const clear = () => {
    try {
      sessionStorage.removeItem(EVENTS_KEY);
    } catch {
      /* noop */
    }
    setEvents([]);
  };
  return (
    <div className="rounded-[var(--radius-card)] bg-surface p-4 ring-1 ring-line sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] font-bold text-ink">このタブで記録されたイベント（{events.length}件・送信なし）</p>
        <button type="button" onClick={clear} className="rounded-full border border-line-strong px-3 py-1 text-[12px] font-bold text-muted hover:text-ink">
          消去
        </button>
      </div>
      {events.length === 0 ? (
        <p className="mt-3 text-[13px] leading-6 text-muted">まだありません。記事を開く・ボタンを押す・条件整理チェックを始めると、ここに並びます（回答の中身は記録しません）。</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[12px]">
            <thead className="text-muted">
              <tr className="border-b border-line">
                <th className="py-1.5 pr-2 font-medium">時刻</th>
                <th className="py-1.5 pr-2 font-medium">イベント</th>
                <th className="py-1.5 pr-2 font-medium">ページ</th>
                <th className="py-1.5 pr-2 font-medium">設置場所 / 種類</th>
                <th className="py-1.5 pr-2 font-medium">導線（pattern）</th>
                <th className="py-1.5 font-medium">流入元（セッション）</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 30).map((e) => (
                <tr key={e.event_id} className="border-b border-line last:border-0">
                  <td className="py-1.5 pr-2 font-mono">{e.occurred_at.slice(11, 19)}</td>
                  <td className="py-1.5 pr-2 font-bold text-ink">{e.event_name}</td>
                  <td className="py-1.5 pr-2">{String(e.context.page_path ?? e.context.page_type ?? "")}</td>
                  <td className="py-1.5 pr-2">{[e.context.cta_placement, e.context.cta_kind].filter(Boolean).join(" / ")}</td>
                  <td className="py-1.5 pr-2">{String(e.context.pattern_id ?? "")}</td>
                  <td className="py-1.5">{[e.session.source, e.session.medium, e.session.content].filter(Boolean).join(" / ") || "直接・不明"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
