// Instagram 投稿案のカルーセルを、1枚ずつ 1080×1350 の PNG に書き出す（投稿案・未公開。実際の投稿はしない）。
//   npm run demo:makecareer          # 別のターミナルで起動しておく（SALES_DEMO=1 のデモ）
//   npm run sns:images -- --base http://127.0.0.1:3100
// 出力: export/sns/theme-<id>/slide-01.png …（git 管理外）
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const BASE = arg("base", "http://127.0.0.1:3100").replace(/\/$/, "");
const OUT = path.resolve(arg("out", "export/sns"));
const THEMES = ["a", "b", "c"];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 3, locale: "ja-JP", reducedMotion: "reduce" });
const page = await context.newPage();
let count = 0;
const problems = [];
for (const id of THEMES) {
  const res = await page.goto(`${BASE}/sales/sns/${id}`, { waitUntil: "load" });
  if (res?.status() !== 200) throw new Error(`/sales/sns/${id}: HTTP ${res?.status()}（SALES_DEMO=1 のデモを起動してください）`);
  // 360px 幅 × 3倍 = 1080px。角丸と枠線は画像では外す
  await page.addStyleTag({ content: "[data-carousel] > li{width:360px!important;flex:none!important} [data-carousel] [data-slide]{border-radius:0!important;box-shadow:none!important} .no-print,header.sticky{display:none!important}" });
  await page.evaluate(() => document.fonts.ready);
  const slides = page.locator(`[data-carousel="${id}"] [data-slide]`);
  const n = await slides.count();
  const dir = path.join(OUT, `theme-${id}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  // 文字が下の表記（メディア名・ページ番号）にかぶっていないか
  const overlaps = await page.evaluate((theme) =>
    [...document.querySelectorAll(`[data-carousel="${theme}"] [data-slide]`)].flatMap((slide, i) => {
      const body = slide.children[2];
      const footer = slide.children[3];
      const last = body?.lastElementChild;
      if (!last || !footer) return [];
      const out = [];
      if (last.getBoundingClientRect().bottom > footer.getBoundingClientRect().top - 2) out.push(`theme ${theme} slide ${i + 1}（下）`);
      // 横にはみ出して切れている文字
      const right = slide.getBoundingClientRect().right;
      if ([...slide.querySelectorAll("p, li, dd, dt, div")].some((el) => el.getBoundingClientRect().right > right + 0.5)) out.push(`theme ${theme} slide ${i + 1}（横）`);
      return out;
    }), id);
  if (overlaps.length) problems.push(...overlaps);
  for (let i = 0; i < n; i++) {
    const el = slides.nth(i);
    await el.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
    // Instagram の縦長（4:5）にちょうど合わせる: 360×450 を3倍で 1080×1350
    const box = await el.boundingBox();
    await page.screenshot({ path: path.join(dir, `slide-${String(i + 1).padStart(2, "0")}.png`), clip: { x: box.x, y: box.y, width: 360, height: 450 } });
    count++;
  }
}
await browser.close();
console.log(`${count}枚 → ${path.relative(process.cwd(), OUT)}`);
if (problems.length) {
  console.error(`文字がはみ出しているスライド: ${problems.join(", ")}`);
  process.exit(1);
}
