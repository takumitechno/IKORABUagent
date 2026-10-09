/**
 * サイトのイラスト（人物入りの場面）を SVG で作る。
 *
 *   npm run illustrations
 *
 * 人物は Open Peeps（Pablo Stanley 作、CC0 = 商用利用・改変自由・表記不要）を react-peeps（MIT）で描き出したもの。
 * 背景・小物・色はこのファイルで描いている（色はサイトのパレット。docs/ART_DIRECTION.md）。
 * 出力は public/images/illustrations/<name>.svg（静的ファイル。サイトの実行時に react-peeps は使わない）。
 * 文字は入れない。人物は髪型・服装を変えて、特定の性別や属性に偏らないようにする。
 */
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Peep from "react-peeps";

const OUT = path.resolve(__dirname, "../../public/images/illustrations");

const C = {
  ink: "#142b3e",
  teal: "#0f7b6c",
  tealSoft: "#3f9c8f",
  mint: "#e3f3ec",
  mintDeep: "#cfe9de",
  canvas: "#faf8f4",
  white: "#ffffff",
  orange: "#f28c28",
  sand: "#fbf0e1",
  sandDeep: "#f3dcbc",
  sky: "#e6f0fb",
  skyDeep: "#cfe0f3",
  wood: "#d9b48a",
  coin: "#f6d27a",
  coinDeep: "#e8b94f",
};

type PeepProps = Parameters<typeof Peep>[0];

/** ポーズごとの人物の描画範囲（react-peeps の座標。ブラウザの getBBox で測った値に余白を足したもの） */
const POSE_BOX: Record<string, [number, number, number, number]> = {
  WalkingWB: [-110, 30, 1090, 2900],
  EasingWB: [-220, 30, 1135, 2936],
  PointingFingerWB: [-46, 30, 1360, 2660],
  RestingWB: [-23, 30, 1334, 2932],
  ShirtPantsWB: [14, 30, 954, 2986],
  ClosedLegWB: [-32, 30, 1407, 2020],
};

/** 人物を、場面の座標 (x, y) に高さ h で置く（足元が y + h） */
function person(props: PeepProps & { body: keyof typeof POSE_BOX }, x: number, y: number, h: number, flip = false): string {
  const markup = renderToStaticMarkup(React.createElement(Peep, { face: "Calm", strokeColor: C.ink, backgroundColor: C.white, ...props }));
  const inner = markup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  const [bx, by, bw, bh] = POSE_BOX[props.body as string];
  const w = (h * bw) / bh;
  const g = flip ? `<g transform="translate(${bx * 2 + bw} 0) scale(-1 1)">${inner}</g>` : inner;
  return `<svg x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" viewBox="${bx} ${by} ${bw} ${bh}" overflow="visible">${g}</svg>`;
}

const shadow = (cx: number, cy: number, rx: number) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${(rx * 0.12).toFixed(1)}" fill="${C.ink}" opacity="0.08"/>`;
const dot = (cx: number, cy: number, r: number, fill: string, op = 1) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${op}"/>`;
const sparkle = (cx: number, cy: number, s: number, fill: string) =>
  `<path d="M${cx} ${cy - s}Q${cx + s * 0.18} ${cy - s * 0.18} ${cx + s} ${cy}Q${cx + s * 0.18} ${cy + s * 0.18} ${cx} ${cy + s}Q${cx - s * 0.18} ${cy + s * 0.18} ${cx - s} ${cy}Q${cx - s * 0.18} ${cy - s * 0.18} ${cx} ${cy - s}Z" fill="${fill}"/>`;

/** 鉢植え */
function plant(x: number, y: number, s = 1): string {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-8 -40C-40 -70 -44 -110 -30 -128C-6 -104 -2 -70 -8 -40Z" fill="${C.teal}"/>
    <path d="M6 -42C24 -84 52 -100 70 -98C66 -66 40 -48 6 -42Z" fill="${C.tealSoft}"/>
    <path d="M0 -40C-4 -86 4 -126 22 -150C38 -112 26 -72 0 -40Z" fill="${C.teal}" opacity="0.85"/>
    <path d="M-34 -42H34L26 0H-26Z" fill="${C.orange}"/>
    <rect x="-38" y="-48" width="76" height="12" rx="6" fill="${C.ink}" opacity="0.85"/>
  </g>`;
}

/** 小さな図形のアイコン（文字の代わり） */
const iconBag = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"><rect x="-16" y="-8" width="32" height="22" rx="4"/><path d="M-7 -8V-13H7V-8"/></g>`;
const iconCoin = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5"><circle cx="0" cy="0" r="14"/><path d="M-6 -2H6M-6 4H6M0 -2V9"/></g>`;
const iconCalendar = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"><rect x="-15" y="-12" width="30" height="26" rx="4"/><path d="M-15 -3H15M-7 -17V-9M7 -17V-9"/></g>`;

function svg(w: number, h: number, body: string, bg?: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>\n`;
}

// ---------------------------------------------------------------- 場面

/** トップのヒーロー: 3方向の道しるべの前で、次の一歩を考える人 */
function heroHome(): string {
  const board = (y: number, dir: 1 | -1, fill: string, icon: string) => {
    const x = dir === 1 ? 760 : 590;
    const pts = dir === 1 ? `${x},${y} ${x + 150},${y} ${x + 178},${y + 30} ${x + 150},${y + 60} ${x},${y + 60}` : `${x + 150},${y} ${x},${y} ${x - 28},${y + 30} ${x},${y + 60} ${x + 150},${y + 60}`;
    return `<polygon points="${pts}" fill="${fill}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>${icon}`;
  };
  return svg(
    1200,
    800,
    `
    <circle cx="700" cy="400" r="330" fill="${C.mint}"/>
    <circle cx="1010" cy="170" r="70" fill="${C.sand}"/>
    <circle cx="300" cy="620" r="48" fill="${C.sky}"/>
    ${dot(420, 210, 10, C.teal, 0.35)}${dot(1050, 560, 14, C.orange, 0.5)}${dot(460, 300, 6, C.orange, 0.7)}
    ${sparkle(980, 330, 18, C.orange)}${sparkle(430, 140, 12, C.teal)}
    <path d="M330 720C480 640 640 690 760 650S1000 560 1110 600" fill="none" stroke="${C.teal}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22" opacity="0.6"/>
    ${shadow(780, 712, 210)}
    <rect x="745" y="230" width="22" height="480" rx="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="5"/>
    <circle cx="756" cy="226" r="16" fill="${C.wood}" stroke="${C.ink}" stroke-width="5"/>
    ${board(260, 1, C.teal, iconBag(850, 290, 1.1, C.white))}
    ${board(360, -1, C.orange, iconCoin(660, 390, 1.1, C.white))}
    ${board(460, 1, C.white, iconCalendar(850, 490, 1.1, C.teal))}
    ${person({ body: "EasingWB", hair: "MediumShort" }, 300, 250, 470)}
    ${plant(1040, 712, 1.05)}
    `,
  );
}

/** 条件整理チェック: 大きなチェックリストと、ペンを持って整理する人 */
function checkSupport(): string {
  const row = (y: number, done: boolean) =>
    `<rect x="250" y="${y}" width="34" height="34" rx="8" fill="${done ? C.teal : C.white}" stroke="${C.ink}" stroke-width="5"/>${done ? `<path d="M258 ${y + 17}l8 8 13-16" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` : ""}<rect x="300" y="${y + 9}" width="${done ? 150 : 120}" height="14" rx="7" fill="${done ? C.mintDeep : C.sandDeep}"/>`;
  return svg(
    600,
    600,
    `
    <circle cx="330" cy="300" r="250" fill="${C.mint}"/>
    ${sparkle(520, 120, 16, C.orange)}${dot(110, 150, 10, C.teal, 0.35)}
    ${shadow(320, 552, 220)}
    <rect x="210" y="110" width="290" height="390" rx="26" fill="${C.white}" stroke="${C.ink}" stroke-width="6"/>
    <rect x="300" y="88" width="110" height="46" rx="14" fill="${C.orange}" stroke="${C.ink}" stroke-width="6"/>
    ${row(180, true)}${row(260, true)}${row(340, false)}
    <rect x="250" y="420" width="200" height="14" rx="7" fill="${C.mintDeep}" opacity="0.7"/>
    ${person({ body: "ClosedLegWB", hair: "Bun" }, 40, 300, 250)}
    `,
  );
}

/** ガイドA: お店のカウンターから、オフィスの机へ歩いていく人 */
function journeySekkyakuOffice(): string {
  const stripes = Array.from({ length: 6 }, (_, i) => `<path d="M${90 + i * 46} 250h46v44a23 23 0 0 1-46 0z" fill="${i % 2 ? C.white : C.orange}" stroke="${C.ink}" stroke-width="5"/>`).join("");
  return svg(
    1280,
    720,
    `
    <rect x="40" y="150" width="440" height="470" rx="40" fill="${C.sand}"/>
    <rect x="760" y="150" width="480" height="470" rx="40" fill="${C.mint}"/>
    ${sparkle(640, 150, 16, C.orange)}${dot(600, 230, 8, C.teal, 0.4)}
    <path d="M300 640C460 600 760 650 980 615" fill="none" stroke="${C.teal}" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 20" opacity="0.7"/>
    <path d="M840 600l26-12-6 26" fill="none" stroke="${C.teal}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
    <rect x="80" y="236" width="290" height="24" rx="8" fill="${C.ink}"/>
    ${stripes}
    <rect x="96" y="420" width="260" height="170" rx="14" fill="${C.white}" stroke="${C.ink}" stroke-width="5"/>
    <rect x="96" y="420" width="260" height="34" rx="12" fill="${C.wood}" stroke="${C.ink}" stroke-width="5"/>
    <rect x="132" y="370" width="54" height="50" rx="8" fill="${C.orange}" stroke="${C.ink}" stroke-width="5"/>
    <circle cx="232" cy="398" r="24" fill="${C.coin}" stroke="${C.ink}" stroke-width="5"/>
    <rect x="282" y="350" width="44" height="70" rx="10" fill="${C.skyDeep}" stroke="${C.ink}" stroke-width="5"/>
    ${shadow(1010, 596, 190)}
    <rect x="850" y="420" width="330" height="22" rx="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="5"/>
    <path d="M880 442v150M1150 442v150" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>
    <rect x="930" y="300" width="160" height="110" rx="12" fill="${C.white}" stroke="${C.ink}" stroke-width="5"/>
    <rect x="948" y="318" width="124" height="74" rx="6" fill="${C.teal}" opacity="0.85"/>
    <path d="M900 420h220" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M1120 392a26 26 0 0 1 52 0v14" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>
    <rect x="1112" y="398" width="16" height="22" rx="6" fill="${C.orange}" stroke="${C.ink}" stroke-width="4"/>
    ${plant(1200, 420, 0.8)}
    ${person({ body: "WalkingWB", hair: "ShortMessy", face: "Calm" }, 520, 150, 470)}
    `,
  );
}

/** ガイドB: 給料（コイン）と休み（カレンダー）を、天びんで見比べる人 */
function journeyKyuryoDonichi(): string {
  const cal = Array.from({ length: 12 }, (_, i) => {
    const x = 860 + (i % 4) * 34;
    const y = 252 + Math.floor(i / 4) * 30;
    const off = i % 4 === 3 || i % 4 === 2;
    return `<rect x="${x}" y="${y}" width="24" height="20" rx="5" fill="${off ? C.teal : C.mint}"/>`;
  }).join("");
  return svg(
    1280,
    720,
    `
    <circle cx="820" cy="380" r="300" fill="${C.mint}"/>
    <circle cx="210" cy="190" r="60" fill="${C.sand}"/>
    ${sparkle(1150, 170, 18, C.orange)}${dot(1180, 520, 12, C.teal, 0.35)}
    ${shadow(820, 640, 260)}
    <path d="M770 640h100l-24-40h-52z" fill="${C.wood}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="809" y="230" width="22" height="380" rx="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="5"/>
    <circle cx="820" cy="222" r="20" fill="${C.orange}" stroke="${C.ink}" stroke-width="5"/>
    <path d="M590 250L1050 250" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
    <path d="M610 250L560 380M610 250L660 380M1030 250L980 380M1030 250L1080 380" stroke="${C.ink}" stroke-width="4"/>
    <path d="M530 380h160a80 30 0 0 1-160 0z" fill="${C.white}" stroke="${C.ink}" stroke-width="5"/>
    <path d="M950 380h160a80 30 0 0 1-160 0z" fill="${C.white}" stroke="${C.ink}" stroke-width="5"/>
    ${[0, 1, 2, 3].map((i) => `<ellipse cx="610" cy="${368 - i * 16}" rx="44" ry="12" fill="${C.coin}" stroke="${C.ink}" stroke-width="4"/>`).join("")}
        <g transform="translate(964 268) scale(0.8)">
      <rect x="0" y="0" width="170" height="140" rx="14" fill="${C.white}" stroke="${C.ink}" stroke-width="6"/>
      <rect x="0" y="0" width="170" height="30" rx="12" fill="${C.teal}"/>
      <g transform="translate(-842 -212)">${cal}</g>
    </g>
    ${person({ body: "PointingFingerWB", hair: "Long" }, 170, 190, 450)}
    `,
  );
}

/** ガイドC: エプロンを置いて、新しい書類を書き始める人 */
function journeyFreeterHajimete(): string {
  return svg(
    1280,
    720,
    `
    <circle cx="700" cy="380" r="300" fill="${C.mint}"/>
    <rect x="980" y="120" width="190" height="230" rx="24" fill="${C.sky}" stroke="${C.ink}" stroke-width="5"/>
    <path d="M1075 120v230M980 235h190" stroke="${C.ink}" stroke-width="5"/>
    ${sparkle(240, 160, 16, C.orange)}${dot(1100, 560, 12, C.orange, 0.5)}${dot(300, 520, 8, C.teal, 0.35)}
    ${shadow(760, 640, 300)}
    <rect x="560" y="430" width="470" height="24" rx="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="5"/>
    <path d="M600 454v176M990 454v176" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>
    <g transform="rotate(-6 760 360)">
      <rect x="680" y="250" width="170" height="200" rx="12" fill="${C.white}" stroke="${C.ink}" stroke-width="5"/>
      <rect x="704" y="276" width="56" height="64" rx="8" fill="${C.mint}"/>
      <rect x="776" y="284" width="52" height="10" rx="5" fill="${C.mintDeep}"/><rect x="776" y="308" width="40" height="10" rx="5" fill="${C.mintDeep}"/>
      <rect x="704" y="362" width="124" height="10" rx="5" fill="${C.sandDeep}"/><rect x="704" y="386" width="100" height="10" rx="5" fill="${C.sandDeep}"/><rect x="704" y="410" width="112" height="10" rx="5" fill="${C.sandDeep}"/>
    </g>
    <path d="M600 424l84-8" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/><path d="M600 424l84-8" stroke="${C.teal}" stroke-width="9" stroke-linecap="round"/>
    <g transform="translate(880 352)">
      <rect x="0" y="0" width="120" height="78" rx="10" fill="${C.sandDeep}" stroke="${C.ink}" stroke-width="5"/>
      <rect x="30" y="30" width="60" height="30" rx="6" fill="${C.sand}" stroke="${C.ink}" stroke-width="4"/>
      <path d="M22 0c-6-26 10-44 38-44s44 18 38 44" fill="none" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/>
    </g>
    ${plant(1120, 630, 1)}
    ${person({ body: "RestingWB", hair: "BunCurly" }, 330, 175, 460)}
    `,
  );
}

const SCENES: Record<string, () => string> = {
  "hero-home": heroHome,
  "check-support": checkSupport,
  "journey-sekkyaku-office": journeySekkyakuOffice,
  "journey-kyuryo-donichi": journeyKyuryoDonichi,
  "journey-freeter-hajimete": journeyFreeterHajimete,
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, build] of Object.entries(SCENES)) {
  const out = build().replace(/\n\s+/g, "\n");
  fs.writeFileSync(path.join(OUT, `${name}.svg`), out);
  console.log(`${name}.svg  ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB`);
}
