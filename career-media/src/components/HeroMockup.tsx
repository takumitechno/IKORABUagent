import { CalendarCheck, Check, ChevronLeft, MessagesSquare, Mic, Send, Sparkles } from "lucide-react";
import { partner } from "@/config/partner";

/**
 * トップのヒーローの画面イメージ。キャリア相談のチャット画面（スマホ）に、面接の練習・企業選びのカードを重ねる。
 * 人物の顔や実在の相談内容は描かない（やりとりは「画面はイメージです」と明記する）。色はブランドのトークンに従う。
 */
const CHAT: { from: "me" | "pro"; text: string }[] = [
  { from: "me", text: "接客の経験しかないけど、事務の仕事に転職できますか？" },
  { from: "pro", text: "接客で身についたことを一緒に整理しましょう。事務の仕事にも活かせる経験がありますよ。" },
  { from: "me", text: "土日休みは外せないです" },
  { from: "pro", text: "条件に合いそうな会社を探して、面接の練習もしていきましょう。" },
];

function Phone({ peek = false }: { peek?: boolean }) {
  const name = partner.brandName;
  return (
    <div className={`relative mx-auto w-[260px] rounded-[44px] bg-[#0d1626] p-[9px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.65),inset_0_0_0_1.5px_rgb(255_255_255/0.08)] sm:w-[284px] ${peek ? "" : "rotate-[-3deg]"}`}>
      <div className="relative overflow-hidden rounded-[36px] bg-[#f6f7fb]">
        {/* ノッチ */}
        <span aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-[#0d1626]" />
        {/* ヘッダー */}
        <div className="bg-white px-4 pb-3 pt-10 shadow-[0_1px_0_rgb(20_43_62/0.06)]">
          <div className="flex items-center gap-2.5">
            <ChevronLeft className="h-4 w-4 text-muted" aria-hidden="true" />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
              <MessagesSquare className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[12.5px] font-bold text-ink">キャリア相談</span>
              <span className="flex items-center gap-1 truncate text-[10px] font-bold text-brand">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
                {name} アドバイザー
              </span>
            </span>
          </div>
        </div>
        {/* チャット */}
        <div className={`space-y-2.5 px-3 py-3.5 ${peek ? "h-[250px]" : "h-[392px]"}`}>
          <p className="text-center text-[9.5px] font-bold text-muted">画面はイメージです</p>
          {CHAT.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <p
                className={`max-w-[82%] rounded-2xl px-3 py-2 text-[11.5px] leading-[1.55] ${
                  m.from === "me" ? "rounded-br-md bg-brand text-white" : "rounded-bl-md bg-white text-ink shadow-[0_1px_2px_rgb(20_43_62/0.08)]"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          {!peek && (
            <div className="flex justify-start">
              <div className="w-[82%] rounded-2xl rounded-bl-md bg-white p-2.5 shadow-[0_1px_2px_rgb(20_43_62/0.08)]">
                <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-ink">
                  <CalendarCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  面接の練習を予約
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {["月", "水", "金"].map((d, i) => (
                    <span key={d} className={`rounded-lg py-1 text-center text-[10px] font-bold ${i === 1 ? "bg-accent text-white" : "bg-canvas text-muted ring-1 ring-line"}`}>
                      {d}曜 19時
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 入力欄 */}
        {!peek && (
          <div className="flex items-center gap-2 border-t border-line bg-white px-3 py-2.5">
            <Mic className="h-4 w-4 text-muted" aria-hidden="true" />
            <span className="flex-1 rounded-full bg-canvas px-3 py-1.5 text-[10.5px] text-muted">メッセージを入力</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** デスクトップ: スマホ＋浮いたカード */
export function HeroMockup() {
  return (
    <div className="relative mx-auto h-[600px] w-full max-w-[540px]" aria-hidden="true">
      {/* 背景の光と輪 */}
      <span className="absolute left-[62%] top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.18),transparent_65%)]" />
      <span className="absolute left-[62%] top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
      <span className="absolute left-[62%] top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20" />
      <div className="enter-pop enter-d2 absolute right-0 top-6 w-[300px]">
        <Phone />
      </div>

      {/* 面接の練習 */}
      <div className="anim-float absolute left-0 top-[70px] w-[200px] rounded-2xl bg-white/95 p-3.5 text-ink shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)] ring-1 ring-white/60 backdrop-blur">
        <p className="flex items-center gap-2 text-[12.5px] font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white">
            <Mic className="h-4 w-4" />
          </span>
          面接の練習
        </p>
        <ul className="mt-2.5 space-y-1.5 text-[11.5px] font-bold text-body">
          {["答えの長さ", "伝わり方", "応募先に合わせた答え方"].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                <Check className="h-3 w-3" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* 企業選びの相談 */}
      <div className="anim-float anim-delay-2 absolute left-2 top-[290px] w-[206px] rounded-2xl bg-white/95 p-3.5 text-ink shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)] ring-1 ring-white/60 backdrop-blur">
        <p className="flex items-center gap-2 text-[12.5px] font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          企業選びの相談
        </p>
        <p className="mt-2 text-[11px] leading-5 text-muted">求人票では分からないことも聞ける</p>
        <p className="mt-1.5 flex flex-wrap gap-1">
          {["職場の雰囲気", "残業の実態", "研修"].map((c) => (
            <span key={c} className="rounded-md bg-brand-tint px-1.5 py-0.5 text-[10.5px] font-bold text-brand-strong ring-1 ring-brand/15">
              {c}
            </span>
          ))}
        </p>
      </div>

      {/* バッジ */}
      <p className="anim-float anim-delay-1 absolute bottom-[56px] right-[150px] inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)]">
        <MessagesSquare className="h-4 w-4" />
        {partner.proLabel}に相談できる
      </p>
    </div>
  );
}

/** スマホ: 画面の上半分だけを見せ、下を検索ボックスに重ねる */
export function HeroMockupPeek() {
  return (
    <div className="relative" aria-hidden="true">
      <span className="absolute left-1/2 top-6 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.18),transparent_65%)]" />
      <Phone peek />
    </div>
  );
}
