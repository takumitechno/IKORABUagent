/**
 * トップのメインビジュアル。「仕事内容・給料・休み」の道しるべの前で考えている人。
 * 外部素材は使わずに描いたオリジナル。動きは globals.css の .hero-* （動きを減らす設定では止まる）。
 */
export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 320" className={className} aria-hidden="true" focusable="false">
      {/* 背景 */}
      <path d="M70 196C52 120 112 48 214 40c98-8 176 44 182 126 6 80-58 132-160 136-100 4-150-30-166-106Z" fill="#dff1e9" />
      <circle cx="372" cy="250" r="34" fill="#fbf0e1" />
      <g fill="#0f7b6c" opacity="0.18">
        {Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, c) => <circle key={`${r}-${c}`} cx={36 + c * 12} cy={236 + r * 12} r="1.8" />))}
      </g>

      {/* 地面と道 */}
      <ellipse cx="236" cy="292" rx="176" ry="14" fill="#1b3448" opacity="0.07" />
      <path className="hero-path" d="M168 292C214 288 236 276 262 268S318 262 330 288" fill="none" stroke="#0f7b6c" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 10" opacity="0.55" />

      {/* 道しるべ */}
      <rect x="318" y="104" width="9" height="190" rx="4" fill="#b8793a" />
      <circle cx="322.5" cy="104" r="7" fill="#eba553" />
      <g className="hero-sign hero-sign-1">
        <path d="M326 118h78l16 17-16 17h-78Z" fill="#0f7b6c" />
        <text x="365" y="141" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
          仕事内容
        </text>
      </g>
      <g className="hero-sign hero-sign-2">
        <path d="M320 162h-62l-16 16 16 16h62Z" fill="#eba553" />
        <text x="284" y="184" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
          給料
        </text>
      </g>
      <g className="hero-sign hero-sign-3">
        <path d="M326 204h62l16 16-16 16h-62Z" fill="#4c8fd8" />
        <text x="358" y="226" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
          休み
        </text>
      </g>

      {/* 人物 */}
      <g className="hero-person">
        {/* 後ろの腕 */}
        <path d="M124 166c-6 18-8 34-6 50" fill="none" stroke="#d9654d" strokeWidth="15" strokeLinecap="round" />
        <circle cx="118" cy="219" r="8" fill="#efc3a7" />
        {/* 脚と靴 */}
        <rect x="134" y="214" width="19" height="70" rx="9" fill="#2f4a66" />
        <rect x="157" y="214" width="19" height="70" rx="9" fill="#35546f" />
        <rect x="126" y="276" width="31" height="13" rx="6.5" fill="#ffffff" stroke="#c5ced6" strokeWidth="1.5" />
        <rect x="154" y="276" width="31" height="13" rx="6.5" fill="#ffffff" stroke="#c5ced6" strokeWidth="1.5" />
        {/* パーカー */}
        <path d="M118 226c-4-46 4-78 37-82 33 4 41 36 37 82Z" fill="#ec7b62" />
        <path d="M137 146c4 10 11 14 18 14s14-4 18-14" fill="none" stroke="#d9654d" strokeWidth="5" strokeLinecap="round" />
        <rect x="138" y="196" width="34" height="14" rx="7" fill="#d9654d" opacity="0.55" />
        <path d="M151 160v18M159 160v18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        {/* 首と頭 */}
        <rect x="148" y="126" width="14" height="22" rx="6" fill="#efc3a7" />
        <g className="hero-head">
          <circle cx="129" cy="112" r="6" fill="#f7d6c1" />
          <circle cx="155" cy="106" r="27" fill="#f7d6c1" />
          <path d="M127 110c-4-26 10-40 30-40 22 0 33 16 28 34-6-10-18-15-30-14-12 1-18 8-21 22-2-2-4-3-7-2Z" fill="#2f3a48" />
          <ellipse cx="163" cy="108" rx="2.6" ry="3.4" fill="#24405a" />
          <ellipse cx="176" cy="107" rx="2.6" ry="3.4" fill="#24405a" />
          <path d="M160 99q4-3 8-1M173 98q4-2 7 1" fill="none" stroke="#2f3a48" strokeWidth="2" strokeLinecap="round" />
          <path d="M166 120q4.5 2.5 9 0" fill="none" stroke="#b5654c" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="181" cy="117" r="4.5" fill="#f19a85" opacity="0.5" />
          <circle cx="156" cy="118" r="4.5" fill="#f19a85" opacity="0.4" />
        </g>
        {/* 考えている腕（あごに手を当てる） */}
        <path d="M185 160c8 12 12 26 10 40" fill="none" stroke="#f08a72" strokeWidth="15" strokeLinecap="round" />
        <path d="M195 200c-4-22-8-40-16-58" fill="none" stroke="#f4987f" strokeWidth="14" strokeLinecap="round" />
        <circle cx="178" cy="137" r="8.5" fill="#efc3a7" />
      </g>

      {/* 考えごとの吹き出し */}
      <g className="hero-think">
        <circle cx="196" cy="82" r="5" fill="#fff" />
        <circle cx="210" cy="64" r="8" fill="#fff" />
        <rect x="214" y="12" width="62" height="46" rx="23" fill="#fff" />
        <text x="245" y="46" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0f7b6c">
          ?
        </text>
      </g>

      {/* ふわっと浮かぶアイコン */}
      <g className="hero-float hero-float-1">
        <circle cx="66" cy="84" r="27" fill="#fff" />
        <rect x="51" y="72" width="30" height="27" rx="5" fill="#fff" stroke="#c5ced6" strokeWidth="1.5" />
        <path d="M51 77a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v4H51Z" fill="#ec7b62" />
        <rect x="57" y="86" width="6" height="5" rx="1.5" fill="#e3e7eb" />
        <rect x="65" y="86" width="6" height="5" rx="1.5" fill="#a9cff3" />
        <rect x="73" y="86" width="6" height="5" rx="1.5" fill="#0f7b6c" />
      </g>
      <g className="hero-float hero-float-2">
        <circle cx="56" cy="168" r="23" fill="#fff" />
        <circle cx="56" cy="168" r="13" fill="#ffd25e" stroke="#eba553" strokeWidth="3" />
        <text x="56" y="174" textAnchor="middle" fontSize="15" fontWeight="700" fill="#b8793a">
          ¥
        </text>
      </g>
      <g className="hero-float hero-float-3">
        <circle cx="404" cy="58" r="24" fill="#fff" />
        <rect x="391" y="47" width="26" height="17" rx="3" fill="#24405a" />
        <rect x="394" y="50" width="20" height="11" rx="1.5" fill="#e1eefc" />
        <path d="M387 64h34l-3 5h-28Z" fill="#c5ced6" />
      </g>

      {/* きらめき */}
      <path className="hero-twinkle" d="M300 52q0 8 8 8-8 0-8 8 0-8-8-8 8 0 8-8Z" fill="#ffd25e" />
      <path className="hero-twinkle hero-twinkle-2" d="M104 34q0 6 6 6-6 0-6 6 0-6-6-6 6 0 6-6Z" fill="#9ad8c6" />
      <path className="hero-twinkle" d="M412 176q0 6 6 6-6 0-6 6 0-6-6-6 6 0 6-6Z" fill="#ffd25e" />
    </svg>
  );
}
