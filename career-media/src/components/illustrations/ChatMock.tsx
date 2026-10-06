/**
 * キャリア相談のイメージ（スマホのチャット画面風）。実際のやりとりではなく、相談で話すことの例。
 * 吹き出しはスクロールで順に現れる（動きを減らす設定では最初から表示）。
 */
const MESSAGES: { from: "advisor" | "me"; text: string }[] = [
  { from: "me", text: "接客の経験しかないけど、事務も気になっていて…" },
  { from: "advisor", text: "これまでの経験と、ゆずれない条件を一緒に整理してみましょう" },
  { from: "me", text: "土日休みは外したくないです" },
];

export function ChatMock({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[300px] rounded-[30px] bg-white p-3 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.55)] ${className}`} aria-hidden="true">
      <div className="rounded-[22px] bg-canvas px-3 pb-4 pt-3">
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-line-strong" />
        <div className="flex items-center gap-2 border-b border-line pb-2.5">
          <span className="motif motif-chat block h-8 w-8 rounded-full bg-mint" />
          <span className="text-[12px] font-bold text-ink">キャリア相談（イメージ）</span>
        </div>
        <ul className="mt-3 space-y-2.5">
          {MESSAGES.map((m, i) => (
            <li key={i} className={`reveal-pop flex ${m.from === "me" ? "justify-end" : "justify-start"}`} style={{ animationRange: `entry ${10 + i * 18}% entry ${55 + i * 18}%` }}>
              <span
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12.5px] leading-5 ${m.from === "me" ? "rounded-br-md bg-brand text-white" : "rounded-bl-md bg-white text-ink ring-1 ring-line"}`}
              >
                {m.text}
              </span>
            </li>
          ))}
          <li className="flex justify-start">
            <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-2.5 ring-1 ring-line">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
