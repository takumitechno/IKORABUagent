/**
 * 記事カード・入口タイル・図解に使うオリジナルの小さなイラスト（モチーフ）。
 *
 * - 外部の画像素材は使わず、ここで図形を組み合わせて描く（著作権・許諾の心配がない）
 * - 何度も並ぶので、HTML に毎回埋め込まず CSS の背景画像（data URI）として1回だけ配信する
 *   → `npm run motifs` で src/app/motifs.css を生成する（テストで生成漏れを検出）
 * - viewBox は 120×120。小さく表示しても分かるよう、物の形を大きく・色数を絞って描く
 */

const P = {
  ink: "#24405a",
  inkSoft: "#5b7186",
  teal: "#0f7b6c",
  teal2: "#2f9e88",
  tealL: "#9ad8c6",
  mint: "#d5f0e5",
  sky: "#4c8fd8",
  skyL: "#a9cff3",
  skyLL: "#e1eefc",
  sand: "#eba553",
  sandL: "#f8d7a8",
  coral: "#ec7b62",
  coralL: "#f8c0b2",
  lime: "#86b951",
  limeL: "#cbe8ab",
  yellow: "#ffd25e",
  yellowL: "#ffeeb8",
  white: "#ffffff",
  gray: "#e3e7eb",
  grayM: "#c5ced6",
  grayD: "#97a6b4",
  skin: "#f7d6c1",
  hair: "#2f3a48",
} as const;

// ---------------------------------------------------------------------------
// 図形のヘルパー（文字列で SVG 要素を作る）
// ---------------------------------------------------------------------------
type Attrs = Record<string, string | number>;
const attrs = (a: Attrs = {}) =>
  Object.entries(a)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 0, a: Attrs = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx ? ` rx="${rx}"` : ""} fill="${fill}"${attrs(a)}/>`;
const circle = (cx: number, cy: number, r: number, fill: string, a: Attrs = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${attrs(a)}/>`;
const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string, a: Attrs = {}) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${attrs(a)}/>`;
const path = (d: string, fill: string, a: Attrs = {}) => `<path d="${d}" fill="${fill}"${attrs(a)}/>`;
const stroke = (d: string, color: string, width = 3, a: Attrs = {}) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${attrs(a)}/>`;
const group = (transform: string, body: string) => `<g transform="${transform}">${body}</g>`;
const outline = { stroke: P.grayM, "stroke-width": 1.5 };

/** 4つの角を持つきらめき */
const sparkle = (x: number, y: number, s: number, fill: string = P.yellow) => path(`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`, fill);
/** 床の影 */
const shadow = (cx: number, cy: number, rx: number) => ellipse(cx, cy, rx, Math.max(2.5, rx * 0.11), "#1b3448", { opacity: 0.1 });
/** 背景の白い円（色面の上で物の形を引き立てる） */
const backdrop = () => circle(60, 60, 48, P.white, { opacity: 0.6 });
const check = (x: number, y: number, color: string = P.white, w = 3, s = 1) => stroke(`M${x - 5 * s} ${y}l${3.5 * s} ${3.5 * s}l${6.5 * s} ${-7 * s}`, color, w);
const lines = (x: number, y: number, widths: number[], gap = 8, color: string = P.gray, h = 3.5) => widths.map((w, i) => rect(x, y + i * gap, w, h, color, h / 2)).join("");
const bubble = (x: number, y: number, w: number, h: number, fill: string, tail: "left" | "right", a: Attrs = {}) => {
  const t = tail === "left" ? `M${x + 12} ${y + h - 1}l-3 10l13 -10Z` : `M${x + w - 12} ${y + h - 1}l3 10l-13 -10Z`;
  return rect(x, y, w, h, fill, Math.min(12, h / 2), a) + path(t, fill);
};

// ---------------------------------------------------------------------------
// モチーフ
// ---------------------------------------------------------------------------
const SCENES = {
  /** 整理する・転職準備: クリップボードのチェックリスト */
  checklist: () =>
    backdrop() +
    shadow(58, 101, 30) +
    rect(30, 22, 56, 76, P.sand, 8) +
    rect(36, 30, 44, 62, P.white, 4) +
    rect(47, 16, 22, 12, P.inkSoft, 4) +
    circle(58, 19, 2.5, P.sandL) +
    [0, 1, 2]
      .map((i) => {
        const y = 45 + i * 15;
        return (i < 2 ? rect(41, y - 5, 11, 11, P.teal, 3) + check(46.5, y + 0.5, P.white, 2.2, 0.7) : rect(41, y - 5, 11, 11, P.white, 3, outline)) + rect(56, y - 2, i === 1 ? 16 : 20, 4, P.gray, 2);
      })
      .join("") +
    group("rotate(32 94 74)", rect(89, 50, 10, 38, P.yellow, 2) + rect(89, 50, 10, 6, P.coral, 2) + path("M89 88h10l-5 10Z", P.sandL) + path("M92.6 95h2.8l-1.4 3Z", P.ink)) +
    sparkle(100, 30, 6),

  /** 調べる: 求人票と虫めがね */
  search: () =>
    backdrop() +
    shadow(56, 101, 30) +
    rect(22, 28, 52, 68, P.white, 6, outline) +
    rect(22, 28, 52, 14, P.skyL, 6) +
    rect(22, 36, 52, 6, P.skyL) +
    lines(29, 51, [32, 26, 34], 9) +
    rect(29, 80, 16, 7, P.tealL, 3.5) +
    circle(80, 60, 17, P.skyLL, { stroke: P.teal, "stroke-width": 6 }) +
    stroke("M73 53a10 10 0 0 1 10-3", P.white, 3) +
    stroke("M92 73l12 12", P.teal, 8) +
    sparkle(102, 32, 5),

  /** 比べる: てんびん */
  scale: () =>
    backdrop() +
    shadow(60, 101, 26) +
    rect(57.5, 34, 5, 60, P.inkSoft, 2.5) +
    rect(44, 92, 32, 6, P.inkSoft, 3) +
    stroke("M24 44L96 36", P.ink, 4) +
    circle(60, 40, 5, P.sand) +
    stroke("M24 44L15 64M24 44L33 64", P.inkSoft, 1.6) +
    stroke("M96 36L87 56M96 36L105 56", P.inkSoft, 1.6) +
    rect(16, 51, 16, 12, P.white, 2, outline) +
    rect(19, 55, 10, 3, P.sand, 1.5) +
    path("M11 64h26q-3 9-13 9t-13-9Z", P.teal2) +
    rect(88, 43, 16, 12, P.coralL, 2) +
    rect(88, 43, 16, 4, P.coral, 2) +
    path("M83 56h26q-3 9-13 9t-13-9Z", P.teal2) +
    sparkle(100, 22, 5),

  /** 相談する: 2つの吹き出し */
  chat: () =>
    backdrop() +
    bubble(16, 26, 58, 34, P.teal, "left") +
    circle(33, 43, 3.5, P.white) +
    circle(45, 43, 3.5, P.white) +
    circle(57, 43, 3.5, P.white) +
    bubble(46, 62, 58, 32, P.white, "right", outline) +
    lines(56, 72, [32, 22], 9) +
    sparkle(100, 30, 6) +
    sparkle(22, 88, 4, P.tealL),

  /** 事務: 書類と電卓 */
  desk: () =>
    backdrop() +
    shadow(60, 100, 36) +
    group("rotate(-8 46 62)", rect(24, 34, 42, 54, P.skyLL, 4, { stroke: P.skyL, "stroke-width": 1.5 })) +
    rect(28, 30, 42, 56, P.white, 4, outline) +
    lines(34, 40, [26, 30, 22, 28], 8) +
    circle(58, 76, 6, P.coralL) +
    rect(66, 50, 32, 46, P.teal2, 6) +
    rect(70, 55, 24, 10, P.mint, 2) +
    [0, 1, 2].map((r) => [0, 1, 2].map((c) => rect(71 + c * 8, 70 + r * 8, 6, 5, P.white, 1.5, { opacity: 0.9 })).join("")).join("") +
    sparkle(98, 30, 5),

  /** パソコン: ノートパソコンとマウス */
  laptop: () =>
    backdrop() +
    shadow(58, 98, 40) +
    rect(26, 32, 62, 42, P.ink, 5) +
    rect(30, 36, 54, 34, P.skyLL, 2) +
    rect(36, 42, 28, 20, P.white, 2) +
    rect(36, 42, 28, 5, P.tealL, 2) +
    path("M68 47v15l4-4 3.2 6.4 3-1.5-3.2-6.4h5.6Z", P.white, { stroke: P.ink, "stroke-width": 1.4, "stroke-linejoin": "round" }) +
    path("M20 74h74l-6 11H26Z", P.grayM) +
    rect(50, 76, 14, 3, P.grayD, 1.5) +
    rect(95, 72, 13, 19, P.white, 6.5, outline) +
    stroke("M101.5 72v7", P.grayM, 1.5) +
    sparkle(100, 30, 5),

  /** カスタマーサポート: ヘッドセットと吹き出し */
  headset: () =>
    backdrop() +
    stroke("M32 68Q30 30 60 30Q90 30 88 68", P.teal, 7) +
    rect(22, 58, 16, 27, P.teal2, 7) +
    rect(82, 58, 16, 27, P.teal2, 7) +
    rect(36, 62, 5, 19, P.mint, 2.5) +
    rect(79, 62, 5, 19, P.mint, 2.5) +
    stroke("M30 84Q33 98 51 98", P.ink, 3) +
    circle(54, 98, 5, P.ink) +
    bubble(68, 12, 38, 24, P.white, "left", outline) +
    circle(79, 24, 2.6, P.teal) +
    circle(87, 24, 2.6, P.teal) +
    circle(95, 24, 2.6, P.teal) +
    sparkle(20, 32, 5),

  /** ITサポート: モニターと歯車 */
  monitor: () =>
    backdrop() +
    shadow(56, 100, 32) +
    rect(18, 26, 66, 48, P.ink, 6) +
    rect(23, 31, 56, 38, P.skyLL, 2) +
    circle(51, 50, 11, P.teal) +
    check(51, 50, P.white, 3.2) +
    path("M44 74h16l3 14H41Z", P.grayM) +
    rect(34, 86, 36, 6, P.grayD, 3) +
    Array.from({ length: 8 }, (_, k) => rect(85, 56, 7, 8, P.sand, 1.5, { transform: `rotate(${k * 45} 88.5 72)` })).join("") +
    circle(88.5, 72, 13, P.sand) +
    circle(88.5, 72, 5, P.white) +
    sparkle(100, 30, 5),

  /** 営業: かばんとグラフの吹き出し */
  briefcase: () =>
    backdrop() +
    shadow(56, 100, 34) +
    stroke("M45 48v-8q0-5 5-5h12q5 0 5 5v8", P.ink, 4) +
    rect(24, 46, 64, 48, P.teal2, 7) +
    rect(24, 46, 64, 20, P.teal, 7) +
    rect(24, 58, 64, 8, P.teal) +
    rect(51, 61, 10, 9, P.yellow, 2) +
    bubble(64, 12, 42, 30, P.white, "left", outline) +
    rect(72, 29, 6, 7, P.skyL, 1) +
    rect(81, 24, 6, 12, P.sky, 1) +
    rect(90, 19, 6, 17, P.teal, 1) +
    sparkle(20, 30, 5),

  /** 人事: 2人と社員証 */
  people: () =>
    backdrop() +
    shadow(60, 100, 36) +
    path("M60 92v-12q0-16 16-16t16 16v12Z", P.sand) +
    circle(76, 47, 11, P.skin) +
    path("M65 46a11 11 0 0 1 22 0q-5-6-11-6t-11 6Z", P.hair) +
    path("M26 96v-13q0-18 19-18t19 18v13Z", P.teal2) +
    circle(45, 50, 12, P.skin) +
    path("M33 49a12 12 0 0 1 24 0q-4-7-12-7t-12 7Z", P.hair) +
    rect(64, 74, 32, 22, P.white, 3, outline) +
    circle(72, 83, 4.5, P.skyL) +
    lines(79, 79, [12, 9], 7, P.gray, 3) +
    sparkle(100, 30, 5),

  /** 販売・接客: お店と紙袋 */
  shop: () =>
    backdrop() +
    shadow(58, 100, 38) +
    rect(24, 50, 62, 46, P.white, 2, outline) +
    Array.from({ length: 6 }, (_, i) => {
      const x = 20 + i * 12;
      const fill = i % 2 ? P.coralL : P.coral;
      return rect(x, 38, 12, 14, fill) + path(`M${x} 52a6 6 0 0 0 12 0Z`, fill);
    }).join("") +
    rect(30, 66, 16, 30, P.teal2, 2) +
    circle(42, 82, 1.6, P.white) +
    rect(52, 64, 28, 18, P.skyLL, 2, { stroke: P.skyL, "stroke-width": 1.5 }) +
    stroke("M66 64v18M52 73h28", P.skyL, 1.5) +
    stroke("M90 72v-4q0-6 7-6t7 6v4", P.ink, 2.5) +
    rect(86, 71, 22, 25, P.sand, 3) +
    sparkle(100, 26, 5),

  /** 分からない・その他: 地図とコンパス */
  compass: () =>
    backdrop() +
    shadow(54, 100, 36) +
    path("M16 40l24-8 24 8 24-8v56l-24 8-24-8-24 8Z", P.limeL) +
    path("M40 32l24 8v56l-24-8Z", P.lime, { opacity: 0.45 }) +
    stroke("M24 84Q36 62 50 72T78 50", P.coral, 2.5, { "stroke-dasharray": "4 5" }) +
    path("M78 62q-9-10-9-16a9 9 0 0 1 18 0q0 6-9 16Z", P.coral) +
    circle(78, 46, 3.5, P.white) +
    circle(92, 86, 15, P.white, { stroke: P.ink, "stroke-width": 3 }) +
    path("M92 74l4 12h-8Z", P.coral) +
    path("M92 98l4-12h-8Z", P.skyL) +
    circle(92, 86, 2, P.ink) +
    sparkle(102, 30, 5),

  /** 給料: 積んだコインと上向きの矢印 */
  coins: () => {
    const coin = (x: number, y: number) => ellipse(x, y + 3, 14, 5, P.sand) + rect(x - 14, y - 3, 28, 6, P.sand) + ellipse(x, y - 3, 14, 5, P.yellow);
    return (
      backdrop() +
      shadow(56, 100, 36) +
      [0, 1, 2].map((i) => coin(36, 90 - i * 9)).join("") +
      [0, 1, 2, 3, 4].map((i) => coin(64, 90 - i * 9)).join("") +
      stroke("M94 90V50", P.teal, 6) +
      path("M83 54l11-15 11 15Z", P.teal) +
      sparkle(26, 40, 6) +
      sparkle(80, 30, 4, P.tealL)
    );
  },

  /** 休み: カレンダーと太陽 */
  calendar: () =>
    backdrop() +
    shadow(56, 100, 34) +
    rect(22, 32, 66, 62, P.white, 7, outline) +
    path("M22 39a7 7 0 0 1 7-7h52a7 7 0 0 1 7 7v10H22Z", P.coral) +
    rect(36, 25, 5, 13, P.ink, 2.5) +
    rect(69, 25, 5, 13, P.ink, 2.5) +
    [0, 1, 2]
      .map((r) =>
        [0, 1, 2, 3, 4]
          .map((c) => {
            const weekend = c >= 3;
            const fill = r === 1 && c === 4 ? P.teal : weekend ? (c === 3 ? P.skyL : P.coralL) : P.gray;
            return rect(28 + c * 11.5, 55 + r * 12, 9, 9, fill, 2);
          })
          .join(""),
      )
      .join("") +
    check(78.5 + 4.5, 71.5, P.white, 2, 0.55) +
    circle(94, 30, 9, P.yellow) +
    Array.from({ length: 8 }, (_, k) => stroke(`M94 ${30 - 12.5}v-3.5`, P.yellow, 2.5, { transform: `rotate(${k * 45} 94 30)` })).join(""),

  /** オフィスワーク: ビルと木 */
  building: () =>
    backdrop() +
    shadow(58, 100, 38) +
    rect(20, 52, 24, 44, P.skyLL, 2, { stroke: P.skyL, "stroke-width": 1.5 }) +
    [0, 1, 2].map((r) => rect(26, 60 + r * 11, 12, 5, P.white, 1.5)).join("") +
    rect(40, 22, 42, 74, P.skyL, 3) +
    [0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => rect(46 + c * 11, 30 + r * 10, 7, 6, P.white, 1.5)).join("")).join("") +
    rect(55, 82, 12, 14, P.teal2, 2) +
    rect(90, 82, 4, 14, P.sand, 2) +
    circle(92, 74, 13, P.lime) +
    circle(86, 80, 7, P.limeL) +
    sparkle(100, 30, 5),

  /** 正社員: 社員証 */
  badge: () =>
    backdrop() +
    shadow(60, 102, 28) +
    stroke("M44 10L60 40L76 10", P.teal, 4) +
    rect(36, 42, 48, 56, P.white, 7, outline) +
    path("M36 49a7 7 0 0 1 7-7h34a7 7 0 0 1 7 7v5H36Z", P.tealL) +
    rect(54.5, 36, 11, 10, P.grayD, 2.5) +
    circle(60, 66, 9, P.skyL) +
    lines(47, 80, [26], 7) +
    lines(51, 87, [18], 7) +
    circle(84, 86, 12, P.teal) +
    check(84, 86) +
    sparkle(24, 30, 5),

  /** 未経験の職種: 階段と旗、芽 */
  stairs: () =>
    backdrop() +
    shadow(62, 99, 40) +
    rect(24, 78, 26, 18, P.tealL, 2) +
    rect(50, 62, 26, 34, P.teal2, 2) +
    rect(76, 46, 26, 50, P.teal, 2) +
    stroke("M90 46V18", P.ink, 2.5) +
    path("M90 18l17 6-17 6Z", P.coral) +
    stroke("M36 78v-10", P.lime, 2.5) +
    path("M36 70q-11-1-11-11 11 0 11 11Z", P.lime) +
    path("M36 72q11-1 11-11-11 0-11 11Z", P.limeL) +
    sparkle(26, 34, 5),

  /** 辞めたい: 開いたドアと矢印 */
  door: () =>
    backdrop() +
    shadow(54, 100, 32) +
    rect(28, 22, 46, 76, P.sandL, 3) +
    rect(32, 26, 38, 72, P.yellowL) +
    path("M32 26l20 7v67l-20-4Z", P.sand) +
    circle(47, 64, 2.2, P.ink) +
    stroke("M58 62h36", P.teal, 5) +
    path("M92 51l14 11-14 11Z", P.teal) +
    sparkle(100, 30, 5),

  /** 面接・書類: 履歴書と吹き出し */
  interview: () =>
    backdrop() +
    shadow(52, 102, 30) +
    group("rotate(-5 46 56)", rect(22, 22, 48, 66, P.white, 5, outline) + rect(52, 29, 12, 15, P.skyL, 2) + lines(28, 31, [20, 16], 8) + lines(28, 52, [36, 36, 28], 8)) +
    bubble(60, 60, 46, 30, P.coral, "right") +
    circle(73, 75, 3.5, P.white) +
    circle(83, 75, 3.5, P.white) +
    circle(93, 75, 3.5, P.white) +
    sparkle(98, 30, 5),

  /** フリーター・シフト: 予定表と時計 */
  clock: () =>
    backdrop() +
    shadow(58, 101, 36) +
    rect(16, 32, 60, 52, P.white, 6, outline) +
    rect(22, 42, 30, 7, P.skyL, 3.5) +
    rect(32, 54, 34, 7, P.sandL, 3.5) +
    rect(22, 66, 24, 7, P.tealL, 3.5) +
    circle(82, 74, 20, P.white, { stroke: P.ink, "stroke-width": 3.5 }) +
    [0, 90, 180, 270].map((d) => stroke("M82 57.5v3", P.grayD, 2.5, { transform: `rotate(${d} 82 74)` })).join("") +
    stroke("M82 74V62", P.ink, 3) +
    stroke("M82 74l9 5", P.coral, 3) +
    circle(82, 74, 2.5, P.ink) +
    sparkle(26, 22, 5),

  /** 派遣: 入れ替わる2枚の社員証 */
  idcard: () =>
    backdrop() +
    rect(14, 32, 46, 30, P.white, 5, outline) +
    circle(27, 47, 6.5, P.skyL) +
    lines(38, 42, [16, 12], 7, P.gray, 3) +
    rect(60, 58, 46, 30, P.skyLL, 5, { stroke: P.skyL, "stroke-width": 1.5 }) +
    circle(73, 73, 6.5, P.sandL) +
    lines(84, 68, [16, 12], 7, P.white, 3) +
    stroke("M64 28Q84 24 91 42", P.teal, 4) +
    path("M84 41l9 8 4-12Z", P.teal) +
    stroke("M56 92Q36 96 29 78", P.teal, 4) +
    path("M36 79l-9-8-4 12Z", P.teal) +
    sparkle(100, 24, 5),

  /** 第二新卒: 角帽と卒業証書 */
  graduation: () =>
    backdrop() +
    shadow(60, 100, 32) +
    path("M38 50v14q22 12 44 0V50l-22 10Z", "#35546f") +
    path("M60 26l38 16-38 16-38-16Z", P.ink) +
    stroke("M88 46v18", P.yellow, 2.5) +
    circle(88, 67, 3.5, P.yellow) +
    group("rotate(-8 60 84)", rect(32, 77, 56, 14, P.white, 7, outline) + rect(57, 77, 6, 14, P.coral)) +
    sparkle(100, 24, 6) +
    sparkle(20, 30, 4, P.tealL),

  /** 転職回数: 経歴のタイムライン */
  list: () =>
    backdrop() +
    shadow(56, 102, 30) +
    rect(28, 18, 58, 80, P.white, 6, outline) +
    stroke("M41 34v48", P.grayM, 2) +
    [P.teal, P.sky, P.sand, P.coral].map((color, i) => circle(41, 34 + i * 16, 5, color) + rect(51, 31 + i * 16, [26, 20, 24, 16][i], 6, P.gray, 3)).join("") +
    sparkle(100, 30, 5),

  /** 経験の活かし方: かみ合うパズルと星 */
  star: () =>
    backdrop() +
    shadow(60, 98, 36) +
    rect(62, 46, 34, 40, P.teal2, 5) +
    rect(24, 46, 34, 40, P.sand, 5) +
    circle(60, 66, 7.5, P.sand) +
    circle(41, 46, 6.5, P.sand) +
    path("M60 14l4.1 8.4 9.2 1.3-6.7 6.5 1.6 9.2-8.2-4.3-8.2 4.3 1.6-9.2-6.7-6.5 9.2-1.3Z", P.yellow) +
    sparkle(98, 30, 5) +
    sparkle(22, 30, 4, P.tealL),

  /** ニュース: 新聞とメガホン */
  newspaper: () =>
    backdrop() +
    shadow(56, 100, 36) +
    rect(20, 26, 58, 68, P.white, 4, outline) +
    rect(26, 33, 46, 8, P.ink, 2) +
    rect(26, 47, 20, 17, P.skyL, 2) +
    lines(50, 48, [22, 18, 22], 7, P.gray, 3) +
    lines(26, 71, [46, 38, 42], 7, P.gray, 3) +
    group("rotate(-14 92 66)", path("M82 60l20-11v34l-20-11Z", P.coral) + rect(76, 58, 8, 16, P.coral, 2) + rect(82, 72, 5, 10, P.ink, 2)) +
    stroke("M106 46l6-4M108 56h7M106 66l6 4", P.coral, 2.5) +
    sparkle(28, 18, 4),

  /** 初めての転職: スタートラインから続く道と旗 */
  flag: () =>
    backdrop() +
    shadow(60, 101, 36) +
    stroke("M24 92Q40 70 60 80T96 54", P.teal, 4, { "stroke-dasharray": "1 8" }) +
    rect(12, 92, 22, 5, P.coral, 2.5) +
    stroke("M96 54V20", P.ink, 3) +
    path("M96 20l17 7-17 7Z", P.coral) +
    circle(96, 55, 4, P.ink) +
    sparkle(30, 34, 6) +
    sparkle(62, 50, 4, P.tealL),
} as const;

export type MotifName = keyof typeof SCENES;
export const MOTIF_NAMES = Object.keys(SCENES) as MotifName[];

export function motifSvg(name: MotifName): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${SCENES[name]()}</svg>`;
}

/** CSS の data URI に入れる。URL で意味を持つ文字だけをエスケープして小さく保つ */
export function motifDataUri(name: MotifName): string {
  const svg = motifSvg(name)
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/[{}]/g, (c) => (c === "{" ? "%7B" : "%7D"));
  return `data:image/svg+xml,${svg}`;
}

export function motifsCss(): string {
  const head = `/* このファイルは scripts/gen-motifs.ts で生成しています（直接編集しない）。元データ: src/lib/illustrations/motifs.ts */\n`;
  const base = `.motif{background-position:center;background-repeat:no-repeat;background-size:contain}\n`;
  return head + base + MOTIF_NAMES.map((n) => `.motif-${n}{background-image:url("${motifDataUri(n)}")}`).join("\n") + "\n";
}
