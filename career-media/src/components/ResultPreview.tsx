/** チェックの回答したときの例（実際の結果は回答によって変わる） */
export function ResultPreview() {
  const rows: { label: string; chips: string[]; tone: string }[] = [
    { label: "希望条件の例", chips: ["土日休み", "残業少なめ"], tone: "bg-coral text-coral-ink" },
    { label: "活かせそうな経験", chips: ["接客", "電話対応"], tone: "bg-sand text-sand-ink" },
    { label: "比べてみたい職種", chips: ["カスタマーサポート", "事務"], tone: "bg-sky text-sky-ink" },
  ];
  return (
    <div className="mx-auto w-full max-w-[400px] rounded-[20px] bg-surface p-4 shadow-[var(--shadow-raised)] ring-1 ring-line sm:p-5" aria-hidden="true">
      <p className="flex items-center justify-between text-[12px] font-bold text-muted">
        回答したときの例
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] text-brand-strong">条件整理ノート</span>
      </p>
      <ul className="mt-3 space-y-3">
        {rows.map((r, i) => (
          <li key={r.label} className="rounded-xl bg-canvas p-3" style={{ animationRange: `entry ${15 + i * 15}% entry ${60 + i * 15}%` }}>
            <p className="text-[12px] font-bold text-ink">{r.label}</p>
            <p className="mt-1.5 flex flex-wrap gap-1.5">
              {r.chips.map((c) => (
                <span key={c} className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${r.tone}`}>
                  {c}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-5 text-muted">面談で聞くことの例や、次にやることも一緒に表示されます。</p>
    </div>
  );
}
