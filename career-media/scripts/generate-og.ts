// 既定の OGP 画像 (public/og-default.png, 1200x630) を site / partner config から生成する。
//   npx tsx scripts/generate-og.ts
// ブランド名・メディア名を変えたら再実行する。
import { chromium } from "playwright";
import path from "node:path";
import { partner } from "../src/config/partner";
import { site } from "../src/config/site";

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;font-family:"Noto Sans JP",sans-serif;background:#f7f8f5;color:#142b3e;position:relative;overflow:hidden}
  .c1{position:absolute;right:-160px;top:-200px;width:640px;height:640px;border-radius:50%;background:#e6f3f0}
  .c2{position:absolute;right:250px;bottom:-110px;width:220px;height:220px;border-radius:50%;background:#fdf1e7}
  .wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column}
  .brand{display:flex;align-items:center;gap:18px}
  .brand b{font-size:34px;letter-spacing:.02em}
  .brand span{display:block;font-size:20px;color:#0b5f54;letter-spacing:.12em;margin-top:4px}
  h1{margin-top:70px;font-size:66px;line-height:1.35;letter-spacing:.03em}
  h1 em{font-style:normal;background:linear-gradient(transparent 64%,#ffe8a3 64%)}
  p{margin-top:28px;font-size:26px;color:#2a3846;font-weight:500}
  .foot{margin-top:auto;font-size:20px;color:#5b6b7a}
</style></head><body><div class="c1"></div><div class="c2"></div>
<div class="wrap">
  <div class="brand"><svg width="64" height="64" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#0f7b6c"/><path d="M8 21.5 13.5 15l4 3.6L24 10.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="10.5" r="2.4" fill="#f28c28"/></svg>
  <div><b>${partner.brandName}</b><span>${site.name}</span></div></div>
  <h1>未経験からの転職、<br>まずは<em>「整理」</em>から。</h1>
  <p>調べて、比べて、整理して。必要なときはキャリアアドバイザーに相談。</p>
  <div class="foot">運営: ${partner.operatorDisplay}</div>
</div></body></html>`;

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(process.cwd(), "public/og-default.png") });
  await browser.close();
  console.log("wrote public/og-default.png");
}

main();
