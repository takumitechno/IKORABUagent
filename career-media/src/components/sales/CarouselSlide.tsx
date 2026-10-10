import type { Slide } from "@/lib/sales/sns";

/**
 * Instagram カルーセル1枚（4:5）のプレビュー。文字の大きさはスライドの幅に合わせて伸縮する（cqw）ので、
 * 画面の見本と、1080×1350 の画像書き出しで同じ見た目になる。
 */
export function CarouselSlide({ slide, index, total, mediaName, tone }: { slide: Slide; index: number; total: number; mediaName: string; tone: string }) {
  const l = slide.layout;
  const cover = l.kind === "cover";
  return (
    <figure data-slide className={`@container relative aspect-[4/5] w-full overflow-hidden [overflow-wrap:anywhere] rounded-[3cqw] ring-1 ring-line ${cover ? tone : "bg-surface"}`} aria-label={slide.alt}>
      <span className="absolute left-[5cqw] top-[4.5cqw] z-10 rounded-full bg-surface/90 px-[2.4cqw] py-[0.8cqw] text-[2.6cqw] font-bold text-accent-strong ring-1 ring-accent/30">投稿案・未公開</span>
      <span aria-hidden="true" className={`motif motif-${slide.motif} absolute block ${cover ? "bottom-[10cqw] right-[5cqw] h-[40cqw] w-[40cqw] rounded-full bg-white/85" : "right-[5cqw] top-[12cqw] h-[16cqw] w-[16cqw] rounded-full bg-mint"}`} />
      <div className="relative flex h-full flex-col px-[7cqw] pb-[12cqw] pt-[14cqw]">
        {l.kind === "cover" && (
          <>
            <p className="whitespace-pre-line text-[9.6cqw] font-bold leading-[1.35] text-ink">{l.hook}</p>
            <p className="mt-[4cqw] text-[4.6cqw] font-bold leading-[1.5] text-ink/80">{l.sub}</p>
          </>
        )}
        {l.kind !== "cover" && <p className="pr-[16cqw] text-[6.2cqw] font-bold leading-[1.45] text-ink">{l.heading}</p>}
        {l.kind === "text" && (
          <ul className="mt-[5cqw] space-y-[3cqw]">
            {l.lines.map((line) => (
              <li key={line} className="text-[4.6cqw] leading-[1.6] text-body">
                {line}
              </li>
            ))}
          </ul>
        )}
        {l.kind === "compare" && (
          <div className="mt-[5cqw] grid grid-cols-2 gap-[3cqw]">
            {[l.left, l.right].map((col, i) => (
              <div key={col.label} className={`rounded-[2.4cqw] p-[3.4cqw] ${i === 0 ? "bg-canvas ring-1 ring-line" : "bg-brand-tint ring-1 ring-brand/30"}`}>
                <p className={`text-[3.8cqw] font-bold ${i === 0 ? "text-muted" : "text-brand-strong"}`}>{col.label}</p>
                <ul className="mt-[2cqw] space-y-[1.6cqw]">
                  {col.items.map((it) => (
                    <li key={it} className="text-[4.2cqw] font-bold leading-[1.5] text-ink">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {l.arrow && <p className="col-span-2 text-[3.6cqw] font-bold leading-[1.5] text-brand-strong">→ {l.arrow}</p>}
          </div>
        )}
        {l.kind === "rows" && (
          <>
            <dl className={`mt-[4.5cqw] ${l.rows.length >= 4 ? "space-y-[1.6cqw]" : "space-y-[2.4cqw]"}`}>
              {l.rows.map(([k, v]) => (
                <div key={k} className={`rounded-[2cqw] bg-canvas px-[3.4cqw] ring-1 ring-line ${l.rows.length >= 4 ? "py-[1.6cqw]" : "py-[2.4cqw]"}`}>
                  <dt className="text-[3.4cqw] font-bold text-brand-strong">{k}</dt>
                  <dd className={`mt-[0.4cqw] font-bold leading-[1.45] text-ink ${l.rows.length >= 4 ? "text-[3.7cqw]" : "text-[4cqw]"}`}>{v}</dd>
                </div>
              ))}
            </dl>
            {l.note && <p className="mt-[3.4cqw] text-[3.4cqw] leading-[1.6] text-muted">{l.note}</p>}
          </>
        )}
        {l.kind === "stats" && (
          <>
            <div className="mt-[6cqw] grid grid-cols-2 gap-[3cqw]">
              {l.stats.map((s) => (
                <div key={s.label} className="rounded-[2.4cqw] bg-brand-tint p-[3.4cqw] text-center ring-1 ring-brand/25">
                  <p className="whitespace-nowrap text-[11cqw] font-bold leading-none text-brand-strong">
                    {s.value}
                    {s.unit && <span className="ml-[0.6cqw] text-[3.8cqw]">{s.unit}</span>}
                  </p>
                  <p className="mt-[2cqw] text-[3.6cqw] font-bold leading-[1.45] text-ink">{s.label}</p>
                </div>
              ))}
            </div>
            {l.note && <p className="mt-[4cqw] text-[3.6cqw] leading-[1.6] text-body">{l.note}</p>}
          </>
        )}
        {l.kind === "steps" && (
          <>
            <ol className="mt-[5cqw] space-y-[2.6cqw]">
              {l.steps.map((st, i) => (
                <li key={st.label} className="flex items-start gap-[2.6cqw]">
                  <span className="flex h-[7cqw] w-[7cqw] shrink-0 items-center justify-center rounded-full bg-brand text-[3.6cqw] font-bold text-white">{i + 1}</span>
                  <span>
                    <span className="block text-[4.4cqw] font-bold leading-[1.4] text-ink">{st.label}</span>
                    <span className="block text-[3.8cqw] leading-[1.5] text-body">{st.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            {l.note && <p className="mt-[3.4cqw] text-[3.4cqw] leading-[1.6] text-muted">{l.note}</p>}
          </>
        )}
        {l.kind === "cta" && (
          <>
            <div className="mt-[5cqw] space-y-[2.6cqw] pr-[2cqw]">
              {l.links.map((link) => (
                <div key={link.label} className="rounded-[2.4cqw] bg-brand px-[3.6cqw] py-[2.8cqw] text-white">
                  <p className="text-[4.2cqw] font-bold leading-[1.45]">{link.label}</p>
                  <p className="mt-[0.6cqw] text-[3.4cqw] text-white/85">{link.sub}</p>
                </div>
              ))}
            </div>
            <p className="mt-[4cqw] text-[3.8cqw] font-bold leading-[1.5] text-accent-strong">{l.save}</p>
            <p className="mt-[1.4cqw] text-[3.2cqw] leading-[1.5] text-muted">プロフィールのリンクから</p>
          </>
        )}
      </div>
      <div className="absolute inset-x-[5cqw] bottom-[4cqw] flex items-center justify-between text-[2.8cqw] font-bold text-ink/60">
        <span>{mediaName}</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
    </figure>
  );
}
