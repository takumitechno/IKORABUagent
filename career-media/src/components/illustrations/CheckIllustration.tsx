/** 条件整理チェックのイラスト。チェックが順番に入っていく（動きを減らす設定では最初から全部入った状態） */
export function CheckIllustration({ className = "" }: { className?: string }) {
  const rows = [
    { y: 78, w: 46 },
    { y: 110, w: 36 },
    { y: 142, w: 42 },
  ];
  return (
    <svg viewBox="0 0 260 210" className={className} aria-hidden="true" focusable="false">
      <circle cx="128" cy="110" r="94" fill="#fff" opacity="0.7" />
      <ellipse cx="124" cy="196" rx="70" ry="7" fill="#1b3448" opacity="0.08" />
      <rect x="62" y="30" width="120" height="160" rx="14" fill="#eba553" />
      <rect x="74" y="46" width="96" height="134" rx="8" fill="#fff" />
      <rect x="98" y="20" width="48" height="22" rx="8" fill="#5b7186" />
      <circle cx="122" cy="26" r="4" fill="#f8d7a8" />
      {rows.map((r, i) => (
        <g key={r.y}>
          <rect x="86" y={r.y - 11} width="22" height="22" rx="6" fill="#e3f3ec" stroke="#0f7b6c" strokeWidth="2" />
          <path className="check-draw" style={{ animationDelay: `${i * 0.45}s` }} d={`M91 ${r.y}l5 5 10-11`} fill="none" stroke="#0f7b6c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="116" y={r.y - 5} width={r.w} height="10" rx="5" fill="#e3e7eb" />
        </g>
      ))}
      <g transform="rotate(28 206 118)">
        <rect x="199" y="64" width="15" height="70" rx="3" fill="#ffd25e" />
        <rect x="199" y="64" width="15" height="11" rx="3" fill="#ec7b62" />
        <path d="M199 134h15l-7.5 15Z" fill="#f8d7a8" />
        <path d="M204.6 143.5h3.8l-1.9 4Z" fill="#24405a" />
      </g>
      <g className="anim-float anim-delay-1">
        <circle cx="210" cy="44" r="22" fill="#fff" />
        <circle cx="210" cy="44" r="14" fill="#fff" stroke="#24405a" strokeWidth="3" />
        <path d="M210 44v-8M210 44l6 3" stroke="#24405a" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <path className="hero-twinkle" d="M40 64q0 8 8 8-8 0-8 8 0-8-8-8 8 0 8-8Z" fill="#ffd25e" />
      <path className="hero-twinkle hero-twinkle-2" d="M222 170q0 6 6 6-6 0-6 6 0-6-6-6 6 0 6-6Z" fill="#9ad8c6" />
    </svg>
  );
}
