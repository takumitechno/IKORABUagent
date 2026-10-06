// 主要画面をブラウザで開き、スクリーンショットとコンソールエラーを確認する。
//   BASE_URL=http://localhost:3000 node scripts/screenshots.mjs
// 出力: screenshots/*.png（.gitignore 済み）
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT = path.resolve(process.env.SCREENSHOT_DIR || "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["home", "/"],
  ["articles", "/articles"],
  ["search", "/articles?q=" + encodeURIComponent("研修")],
  ["category", "/categories/keiken"],
  ["article", "/articles/mikeiken-tenshoku-hajimekata"],
  ["article-table", "/articles/donichi-yasumi-nenshu-hikaku"],
  ["news", "/news"],
  ["news-detail", "/news/news-roudou-jouken-meiji"],
  ["jobs", "/jobs"],
  ["hub-role", "/jobs/jimu"],
  ["hub-concern", "/concerns/donichi"],
  ["hub-situation", "/situations/sekkyaku"],
  ["concerns", "/concerns"],
  ["check", "/check"],
  ["consultation", "/consultation"],
  ["about", "/about"],
  ["editorial-policy", "/editorial-policy"],
  ["not-found", "/articles/kyujin-hyo-yomikata"],
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
};

const only = process.argv.slice(2);
const problems = [];

const browser = await chromium.launch();
for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
  // 全体のスクリーンショットは「動きを減らす」設定で撮る（スクロールで現れる表現が途中の状態で写らないように）。
  // MOTION=1 で動きありのまま撮る。
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    deviceScaleFactor: viewport.deviceScaleFactor ?? 1,
    locale: "ja-JP",
    reducedMotion: process.env.MOTION === "1" ? "no-preference" : "reduce",
  });
  for (const [name, url] of PAGES) {
    if (only.length && !only.includes(name)) continue;
    const page = await context.newPage();
    page.on("console", (msg) => msg.type() === "error" && !(name === "not-found" && msg.text().includes("404")) && problems.push(`[${vpName}] ${url} console: ${msg.text()}`));
    page.on("pageerror", (err) => problems.push(`[${vpName}] ${url} pageerror: ${err.message}`));
    const res = await page.goto(BASE_URL + url, { waitUntil: "load" });
    await page.waitForTimeout(600);
    const expected = name === "not-found" ? 404 : 200;
    if (res?.status() !== expected) problems.push(`[${vpName}] ${url} status ${res?.status()} (expected ${expected})`);
    // 横スクロールが発生していないか（モバイル崩れの検出）
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) problems.push(`[${vpName}] ${url} horizontal overflow ${overflow}px`);
    // overflow-hidden の親に隠れて切れている文字・ボタンも検出する（横スクロール領域と装飾は除く）
    const clipped = await page.evaluate(() => {
      const vw = window.innerWidth;
      const inScroller = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === "auto" || ox === "scroll") return true;
        }
        return false;
      };
      const out = [];
      for (const el of document.querySelectorAll("h1, h2, h3, p, a, button, input, label, li")) {
        if (el.closest("[aria-hidden='true']") || el.closest(".sr-only") || inScroller(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > vw + 1 || r.left < -1) out.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 24)}" ${Math.round(r.left)}..${Math.round(r.right)}`);
      }
      return out.slice(0, 5);
    });
    for (const c of clipped) problems.push(`[${vpName}] ${url} clipped: ${c}`);
    await page.screenshot({ path: path.join(OUT, `${vpName}-${name}.png`), fullPage: true });
    await page.close();
  }

  // 条件整理チェックを最後まで回答して結果画面を確認する
  if (!only.length || only.includes("check-result")) {
    const page = await context.newPage();
    page.on("pageerror", (err) => problems.push(`[${vpName}] check-flow pageerror: ${err.message}`));
    await page.goto(BASE_URL + "/check", { waitUntil: "load" });
    const answers = [
      [["status", "parttime"], ["timing", "3months"]],
      [["experiences", "sales_service"], ["experiences", "callcenter"], ["strengths", "listening"], ["strengths", "explaining"]],
      [["priority", "holidays"], ["income", "keep_current"], ["holidays", "weekends"], ["hours", "no_overtime"], ["location", "commute_home"]],
      [["talk", "ok"], ["pc", "ok"], ["avoid", "numbers_pressure"], ["learning", "weekly"]],
    ];
    for (let step = 0; step < answers.length; step++) {
      for (const [name, value] of answers[step]) {
        // 利用者と同じように、見えている選択肢（label）を押す。押せたかは input の状態で確かめる
        const input = page.locator(`input[name="${name}"][value="${value}"]`);
        const option = page.locator("label", { has: input });
        for (let attempt = 0; ; attempt++) {
          try {
            if (!(await input.isChecked())) await option.click({ timeout: 3000 });
            if (!(await input.isChecked())) throw new Error(`${name}=${value} が選択されていない`);
            break;
          } catch (err) {
            if (attempt >= 2) throw err;
            await page.waitForTimeout(400);
          }
        }
      }
      await page.getByRole("button", { name: step === answers.length - 1 ? "結果を見る" : "次へ進む" }).click();
    }
    await page.getByRole("heading", { name: "あなたの条件整理ノート" }).waitFor();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `${vpName}-check-result.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) problems.push(`[${vpName}] check-result horizontal overflow ${overflow}px`);
    await page.close();
  }
  await context.close();
}
// 動きありの設定で、スクロールで現れる要素が画面に入ったあと、きちんと表示されきるか（消えたままにならないか）
if (!only.length || only.includes("motion")) {
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.isMobile, deviceScaleFactor: 1, locale: "ja-JP", reducedMotion: "no-preference" });
    for (const url of ["/", "/articles/mikeiken-tenshoku-hajimekata", "/jobs", "/news", "/check"]) {
      const page = await context.newPage();
      await page.goto(BASE_URL + url, { waitUntil: "load" });
      await page.waitForTimeout(900);
      const count = await page.locator(".reveal, .reveal-pop, .reveal-grow-x, .reveal-grow-y").count();
      const hidden = [];
      for (let i = 0; i < count; i++) {
        const el = page.locator(".reveal, .reveal-pop, .reveal-grow-x, .reveal-grow-y").nth(i);
        if (!(await el.isVisible())) continue;
        await el.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
        await page.waitForTimeout(120);
        const state = await el.evaluate((node) => {
          const cs = getComputedStyle(node);
          const m = cs.transform.match(/matrix\(([^)]+)\)/);
          const scaleX = m ? Number(m[1].split(",")[0]) : 1;
          return { opacity: Number(cs.opacity), scaleX, label: `${node.tagName.toLowerCase()}.${String(node.className).slice(0, 40)}` };
        });
        if (state.opacity < 0.98 || state.scaleX < 0.98) hidden.push(`${state.label} opacity=${state.opacity} scaleX=${state.scaleX}`);
      }
      for (const h of hidden.slice(0, 5)) problems.push(`[${vpName}] ${url} motion: still hidden after scrolling into view: ${h}`);
      await page.close();
    }
    await context.close();
  }
}

await browser.close();

if (problems.length) {
  console.error("Problems found:\n" + problems.map((p) => " - " + p).join("\n"));
  process.exit(1);
}
console.log(`OK: screenshots saved to ${OUT}`);
