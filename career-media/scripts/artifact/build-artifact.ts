/**
 * 中立ブランド（既定の partner profile）で起動したサイトの各ページを取り込み、
 * claude.ai のアーティファクト（1枚の HTML）として閲覧できるスナップショットを作る。
 *
 *   NEXT_DIST_DIR=.next-demo npx next build
 *   NEXT_DIST_DIR=.next-demo npx next start -p 3200 -H 127.0.0.1
 *   npx tsx scripts/artifact/build-artifact.ts --base http://127.0.0.1:3200 --out <file.html>
 *
 * 実在企業の名義（PARTNER_PROFILE=makecareer）では作らない。
 */
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";
import { LocalContentRepository } from "../../src/lib/content/local-repository";
import { partner } from "../../src/config/partner";
import { NAV_ITEMS } from "../../src/components/nav";
import { site } from "../../src/config/site";
import { buildConsultationUrl, CONSULTATION_APPLY_PATH } from "../../src/lib/consultation";
import { listSiteRoutes } from "../site-routes";

const ROOT = path.resolve(__dirname, "../..");

function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  if (fallback !== undefined) return fallback;
  throw new Error(`--${name} が必要です`);
}

async function get(base: string, route: string): Promise<{ status: number; html: string }> {
  const res = await fetch(base + route);
  return { status: res.status, html: await res.text() };
}

function pick(html: string, re: RegExp, label: string): string {
  const m = html.match(re);
  if (!m) throw new Error(`${label} が見つかりません`);
  return m[1] ?? m[0];
}

const stripScripts = (html: string) => html.replace(/<script\b[\s\S]*?<\/script>/g, "").replace(/<!--[\s\S]*?-->/g, "");
const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const decodeTitle = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** 生成画像（public/images/generated/）は1ファイルに収めるため data URI に置き換える */
function inlineGeneratedImages(html: string): string {
  return html
    .replace(/\ssrcset="[^"]*\/images\/generated\/[^"]*"/g, "")
    .replace(/(src=")(\/images\/generated\/[A-Za-z0-9_\-./]+\.(png|jpe?g|webp))(")/g, (_m, pre: string, src: string, ext: string, post: string) => {
      const file = path.join(ROOT, "public", src);
      const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      return `${pre}data:${mime};base64,${fs.readFileSync(file).toString("base64")}${post}`;
    });
}

async function main() {
  if (partner.profile !== "neutral") throw new Error("中立ブランド（既定の partner profile）で実行してください（実在企業の名義ではアーティファクトを作りません）");
  const base = arg("base", "http://127.0.0.1:3200");
  const out = path.resolve(arg("out"));

  // 実在企業の名義のまま作らないためのガード
  const home = await get(base, "/");
  if (!home.html.includes(partner.mediaName)) throw new Error("中立ブランドで起動したサーバーを指定してください");
  if (/MakeCareer|make-career\.co\.jp|13-ユ-313746/.test(home.html)) throw new Error("実在企業の表記が含まれています");

  const repo = new LocalContentRepository(path.join(ROOT, "content"));
  const articles = await repo.listArticles();
  const routes = await listSiteRoutes(repo);

  const templates: string[] = [];
  for (const route of [...routes, "/404"]) {
    const page = await get(base, route === "/404" ? "/__artifact_not_found__" : route);
    if (route !== "/404" && page.status !== 200) throw new Error(`${route}: HTTP ${page.status}`);
    const main = inlineGeneratedImages(stripScripts(pick(page.html, /<main id="main">([\s\S]*?)<\/main>/, `${route} の main`)));
    if (/MakeCareer|make-career\.co\.jp|13-ユ-313746/.test(main)) throw new Error(`${route} に実在企業の表記が含まれています`);
    const title = decodeTitle(pick(page.html, /<title>([\s\S]*?)<\/title>/, `${route} の title`));
    templates.push(`<template data-route="${route}" data-title="${escAttr(title)}">${main}</template>`);
  }

  const header = stripScripts(pick(home.html, /(<header class="sticky[\s\S]*?<\/header>)/, "header"));
  const footer = stripScripts(pick(home.html, /(<footer[\s\S]*?<\/footer>)/, "footer"));
  const banner = pick(home.html, /(<div class="no-print bg-ink[\s\S]*?<\/div>)/, "preview banner");

  // 記事一覧の行（検索結果の表示に使う）
  const listHtml = (await get(base, "/articles")).html;
  const rows = new Map<string, string>();
  for (const m of listHtml.matchAll(/<li><a class="[^"]*\bgroup flex gap-4[^"]*" href="([^"]+)">[\s\S]*?<\/a><\/li>/g)) rows.set(m[1], m[0]);
  const searchIndex = await Promise.all(
    articles.map(async (a) => {
      const full = await repo.getArticle(a.slug);
      const href = a.kind === "news" ? `/news/${a.slug}` : `/articles/${a.slug}`;
      const rowHtml = rows.get(href);
      if (!rowHtml) throw new Error(`${href} の一覧行が見つかりません`);
      const text = (full?.body ?? "").replace(/[#*>|`[\]()-]/g, " ");
      return { href, title: a.title, summary: a.summary, text, rowHtml };
    }),
  );

  // CSS: next/font の @font-face（/_next/static/media を参照）は除き、Google Fonts で読む
  const cssLinks = [...home.html.matchAll(/<link rel="stylesheet" href="([^"]+\.css)"/g)].map((m) => m[1]);
  let css = "";
  for (const href of cssLinks) css += (await get(base, href)).html + "\n";
  css = css.replace(/@font-face\s*\{[^}]*\}/g, "");
  if (css.includes("/_next/")) throw new Error("CSS に /_next/ への参照が残っています");

  // 条件整理チェック（本番と同じ React コンポーネント）をバンドル
  const bundle = await build({
    entryPoints: [path.join(__dirname, "check-entry.tsx")],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: "es2019",
    minify: true,
    jsx: "automatic",
    tsconfig: path.join(ROOT, "tsconfig.json"),
    alias: {
      react: path.join(__dirname, "shims/react.cjs"),
      "react-dom": path.join(__dirname, "shims/react-dom.cjs"),
      "react/jsx-runtime": path.join(__dirname, "shims/jsx-runtime.cjs"),
      "react/jsx-dev-runtime": path.join(__dirname, "shims/jsx-runtime.cjs"),
      "next/link": path.join(__dirname, "shims/next-link.cjs"),
    },
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "warning",
  });
  const inlineSafe = (js: string) => js.replace(/<\/script/gi, "<\\/script");
  const checkJs = inlineSafe(bundle.outputFiles[0].text);
  const runtimeJs = inlineSafe(fs.readFileSync(path.join(__dirname, "runtime.js"), "utf8"));

  // 相談の申し込みボタンはサイト内の説明ページ（/consultation/apply）を指す。アーティファクトでは押すと説明を出す
  const consultPrefix = CONSULTATION_APPLY_PATH;
  const config = {
    siteName: site.fullName,
    consultPrefix,
    checkConsultHref: buildConsultationUrl("check-result"),
    checkConsultLabel: "整理した内容をもとに相談する",
    searchIndex,
  };

  const mobileMenu = `<div id="mobile-menu" class="artifact-menu" hidden><nav aria-label="モバイルメニュー"><ul>${NAV_ITEMS.map(
    (i) => `<li><a href="${i.href}">${i.label}<span aria-hidden="true">→</span></a></li>`,
  ).join("")}</ul><a class="artifact-menu-cta" href="/check">条件を整理する</a><a class="artifact-menu-cta artifact-menu-cta-sub" href="/consultation">キャリア相談について</a></nav></div>`;

  const dialog = `<div id="consult-dialog" class="artifact-dialog" role="dialog" aria-modal="true" aria-labelledby="consult-dialog-title" hidden>
  <div class="artifact-dialog-card">
    <p class="artifact-dialog-eyebrow">DEMO</p>
    <h2 id="consult-dialog-title">ここから相談の申し込みページへ移動します</h2>
    <p>デモ版のため、実際の申し込みページには移動しません。正式に公開するときは、相談先の申し込みページへ、どの導線から来たかが分かる計測パラメータを付けて移動します。</p>
    <p class="artifact-dialog-meta">このボタンの設置場所: <code data-placement></code></p>
    <div class="artifact-dialog-actions"><a href="/consultation">相談サービスの説明を見る</a><button type="button" data-close>閉じる</button></div>
  </div>
</div>`;

  const artifactCss = `
:root{--font-noto-sans-jp:"Noto Sans JP";color-scheme:light}
body{font-size:16px;background:var(--color-canvas);color:var(--color-body)}
header.sticky{top:env(safe-area-inset-top,0px)}
html.menu-open body{overflow:hidden}
.artifact-menu{position:fixed;inset:calc(64px + env(safe-area-inset-top,0px)) 0 0 0;z-index:50;overflow-y:auto;background:var(--color-surface);border-top:1px solid var(--color-line);padding:16px}
.artifact-menu ul{list-style:none;margin:0;padding:0}
.artifact-menu li+li{border-top:1px solid var(--color-line)}
.artifact-menu li a{display:flex;justify-content:space-between;padding:16px 0;font-weight:500;color:var(--color-ink);text-decoration:none}
.artifact-menu li a span{color:var(--color-brand)}
.artifact-menu-cta{display:block;margin-top:24px;padding:14px 20px;border-radius:999px;background:var(--color-brand);color:#fff;font-weight:700;text-align:center;text-decoration:none}
.artifact-menu-cta-sub{margin-top:12px;background:#fff;color:var(--color-accent-strong);border:1px solid var(--color-accent)}
.artifact-dialog{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:rgb(20 43 62 / .55)}
.artifact-dialog-card{max-width:440px;width:100%;border-radius:18px;background:var(--color-surface);color:var(--color-body);padding:24px;box-shadow:0 20px 50px -20px rgb(20 43 62 / .5);font-size:14.5px;line-height:1.85}
.artifact-dialog-card h2{margin:4px 0 8px;font-size:18px;line-height:1.5;color:var(--color-ink)}
.artifact-dialog-card p{margin:8px 0 0}
.artifact-dialog-eyebrow{margin:0!important;font-size:11px;font-weight:700;letter-spacing:.2em;color:var(--color-accent)}
.artifact-dialog-meta code{font-size:12.5px;background:var(--color-canvas);border:1px solid var(--color-line);border-radius:6px;padding:2px 6px;color:var(--color-ink)}
.artifact-dialog-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:20px}
.artifact-dialog-actions a,.artifact-dialog-actions button{border-radius:999px;padding:10px 18px;font-weight:700;font-size:14px;cursor:pointer;text-decoration:none}
.artifact-dialog-actions a{border:1px solid var(--color-line-strong);color:var(--color-ink);background:var(--color-surface)}
.artifact-dialog-actions button{border:0;background:var(--color-ink);color:#fff}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;

  const html = `<title>${site.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap">
<style>${css}
${artifactCss}</style>
<div lang="ja" class="min-h-screen antialiased">
${banner}
${header}
${mobileMenu}
<main id="app" aria-live="polite"></main>
${footer}
</div>
${dialog}
${templates.join("\n")}
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>window.__ARTIFACT__=${JSON.stringify(config).replace(/</g, "\\u003c")};</script>
<script>${checkJs}</script>
<script>${runtimeJs}</script>
`;

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`wrote ${out} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB, ${templates.length} pages)`);
}

main().catch((e) => {
  console.error(`ERROR: ${e instanceof Error ? e.message : e}`);
  process.exitCode = 1;
});
