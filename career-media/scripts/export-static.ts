/**
 * 起動中のサーバー（中立ブランド）の全ページを、Codex などのエージェントや人がファイルとして読める形で書き出す。
 *
 *   npm run build && npm run start      # 別のターミナルで起動しておく
 *   npm run export:static               # → export/site/（静的 HTML 一式）と export/pages/（ページごとの Markdown）
 *   npm run export:static -- --base http://127.0.0.1:3200 --out export
 *
 * - site/: 各ページの HTML と、使っている JS・CSS・フォント。サーバーのルートに置いて開く
 *   （例: python3 -m http.server 8080 -d export/site）。file:// で開くと JS が読み込めない。
 *   記事検索（/articles?q=）はサーバー側の処理なので、書き出した HTML では絞り込まれない。
 * - pages/: 各ページの本文（main）を Markdown にしたもの。INDEX.md が一覧、_layout.md が全ページ共通の部分。
 *   Playwright の Chromium が必要（--no-md で省略）。export/pages/ はリポジトリに置き、ビルドしなくても読めるようにしている。
 *
 * 実在企業の名義（PARTNER_PROFILE=makecareer）のサーバーからは書き出さない。どちらも公開サーバーには置かない。
 */
import fs from "node:fs";
import path from "node:path";
import { LocalContentRepository } from "../src/lib/content/local-repository";
import { partner } from "../src/config/partner";
import { STATIC_ROUTES, listSiteRoutes } from "./site-routes";

const ROOT = path.resolve(__dirname, "..");
const REAL_COMPANY = /MakeCareer|make-career\.co\.jp|13-ユ-313746/;

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function write(file: string, data: string | Buffer) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}

/** `/` → index.html、`/articles/x` → articles/x/index.html（どの静的サーバーでも `/articles/x` で開ける） */
const htmlFile = (route: string) => (route === "/" ? "index.html" : `${route.slice(1)}/index.html`);
const mdFile = (route: string) => (route === "/" ? "index.md" : `${route.slice(1)}.md`);

/** HTML・RSC ペイロード・CSS・JS の中から、ビルド成果物（/_next/static/…）への参照を拾う */
function staticRefs(text: string): string[] {
  const refs = new Set<string>();
  for (const m of text.matchAll(/\/_next\/static\/[A-Za-z0-9_\-./~%]+/g)) refs.add(m[0]);
  for (const m of text.matchAll(/(?<![\w/])static\/(?:chunks|css|media)\/[A-Za-z0-9_\-./~%]+/g)) refs.add(`/_next/${m[0]}`);
  // 拡張子のない文字列（テンプレートの一部など）は対象外
  return [...refs].filter((r) => /\.[a-z0-9]+$/i.test(r));
}

function cssRefs(css: string, cssPath: string): string[] {
  const refs: string[] = [];
  for (const m of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
    const ref = m[2].trim();
    if (/^(data:|#|https?:|\/\/)/.test(ref)) continue;
    refs.push(new URL(ref, `http://x${cssPath}`).pathname);
  }
  return refs;
}

/** ページから参照される /_next 以外のファイル（アイコンなど）。ページの URL は除く */
function fileRefs(html: string, routes: Set<string>): string[] {
  const refs: string[] = [];
  for (const m of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)/g)) {
    const p = m[1];
    if (!p.startsWith("/_next/") && !routes.has(p) && /\.(png|jpe?g|gif|svg|webp|avif|ico|webmanifest|json|txt|xml|woff2?)$/i.test(p)) refs.push(p);
  }
  return refs;
}

/** 書き出した Markdown の元になるソース（Codex がどこを直せばよいか分かるように） */
function sourcesFor(route: string): string[] {
  const candidates: string[] = [];
  const detail = route.match(/^\/(articles|news)\/([^/]+)$/);
  const hub = route.match(/^\/(jobs|concerns|situations)\/([^/]+)$/);
  if (route === "/") candidates.push("src/app/page.tsx");
  else if (detail) candidates.push(`content/${detail[1]}/${detail[2]}.md`, `src/app/${detail[1]}/[slug]/page.tsx`);
  else if (hub) candidates.push(`src/app/${hub[1]}/[slug]/page.tsx`, "src/components/TaxonomyHub.tsx", "src/lib/taxonomy.ts");
  else if (route.startsWith("/categories/")) candidates.push("src/app/categories/[slug]/page.tsx", "content/categories.json");
  else candidates.push(`src/app${route}/page.tsx`);
  if (route === "/jobs") candidates.push("src/components/JobMap.tsx", "src/lib/jobs.ts");
  if (route === "/check") candidates.push("src/components/ConditionCheck.tsx", "src/lib/condition-check/questions.ts", "src/lib/condition-check/engine.ts");
  if (route === "/consultation") candidates.push("src/lib/consultation.ts");
  return candidates.filter((f) => fs.existsSync(path.join(ROOT, f)));
}

type PageInfo = { route: string; title: string; description: string; h1: string; markdown: string };

async function exportMarkdown(base: string, routes: string[], pagesDir: string): Promise<PageInfo[] | null> {
  let browser;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch();
  } catch (e) {
    console.warn(`Chromium を起動できないため Markdown を省略します（npx playwright install chromium で入れられます）: ${(e as Error).message.split("\n")[0]}`);
    return null;
  }
  // 関数を渡すとトランスパイラの補助関数が混ざるため、ブラウザ側のコードは文字列で渡す
  const serializer = fs.readFileSync(path.join(__dirname, "export/dom-to-markdown.js"), "utf8");
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "ja-JP", reducedMotion: "reduce" });
  const page = await context.newPage();
  const pages: PageInfo[] = [];
  try {
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "load" });
      // タブ（CSS だけで切り替える）は全パネルを書き出す
      await page.addStyleTag({ content: ".tabset .tab-panel { display: block !important; }" });
      const info = (await page.evaluate(`(() => {\n${serializer}\nreturn careerMediaPage();\n})()`)) as Omit<PageInfo, "route">;
      if (REAL_COMPANY.test(info.markdown)) throw new Error(`${route} に実在企業の表記が含まれています`);
      pages.push({ route, ...info });
      const front = [
        "---",
        `url: ${route}`,
        `title: ${JSON.stringify(info.title)}`,
        `description: ${JSON.stringify(info.description)}`,
        "source:",
        ...sourcesFor(route).map((f) => `  - ${f}`),
        "---",
      ].join("\n");
      write(path.join(pagesDir, mdFile(route)), `${front}\n\n${info.markdown}\n`);
    }
    await page.goto(base + "/", { waitUntil: "load" });
    const layout = (await page.evaluate(`(() => {\n${serializer}\nreturn careerMediaLayout();\n})()`)) as string;
    write(
      path.join(pagesDir, "_layout.md"),
      `# 全ページ共通の部分\n\nプレビューバー・ヘッダー・フッター（デスクトップ幅で表示される内容）。ソース: src/app/layout.tsx、src/components/Header.tsx、src/components/Footer.tsx、src/components/PreviewBanner.tsx\n\n${layout}\n`,
    );
  } finally {
    await browser.close();
  }
  return pages;
}

function indexMarkdown(pages: PageInfo[], base: string): string {
  const groups: [string, (r: string) => boolean][] = [
    ["固定ページ", (r) => STATIC_ROUTES.includes(r)],
    ["入口ページ（職種・悩み・今の状況）", (r) => /^\/(jobs|concerns|situations)\/[^/]+$/.test(r)],
    ["カテゴリ", (r) => r.startsWith("/categories/")],
    ["記事", (r) => r.startsWith("/articles/")],
    ["ニュース解説", (r) => r.startsWith("/news/")],
  ];
  const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
  const lines = [
    `# ページ一覧 — ${partner.mediaName}`,
    "",
    "各ページに表示される内容（`main` の本文）を Markdown にしたもの。全ページ共通のヘッダー・フッターは [_layout.md](_layout.md)。",
    "各ファイルの先頭の `source` が元のソース。**ここを編集しても画面は変わらない**（画面は `src/`、記事・ニュースは `content/` を直す）。",
    "",
    `書き出し日: ${new Date().toISOString().slice(0, 10)}（中立ブランドの画面、${pages.length}ページ）。画面やコンテンツを変えたら \`npm run export:static\` で書き出し直す。`,
  ];
  for (const [name, test] of groups) {
    const rows = pages.filter((p) => test(p.route));
    if (!rows.length) continue;
    lines.push("", `## ${name}（${rows.length}）`, "", "| URL | 見出し | 説明 |", "| --- | --- | --- |");
    for (const p of rows) lines.push(`| [${p.route}](${mdFile(p.route)}) | ${cell(p.h1 || p.title)} | ${cell(p.description)} |`);
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const base = arg("base", "http://127.0.0.1:3000").replace(/\/$/, "");
  const outDir = path.resolve(arg("out", "export"));
  const siteDir = path.join(outDir, "site");
  const pagesDir = path.join(outDir, "pages");

  // 実在企業の名義のまま書き出さないためのガード
  const home = await fetch(base + "/").then((r) => r.text());
  if (!home.includes(partner.mediaName) || partner.profile !== "neutral") throw new Error("中立ブランド（既定の partner profile）で起動したサーバーを指定してください");
  if (REAL_COMPANY.test(home)) throw new Error("実在企業の表記が含まれています");

  const repo = new LocalContentRepository(path.join(ROOT, "content"));
  const routes = await listSiteRoutes(repo);
  const routeSet = new Set(routes);
  fs.rmSync(siteDir, { recursive: true, force: true });
  fs.rmSync(pagesDir, { recursive: true, force: true });

  // 1. ページの HTML
  const queue: { ref: string; from: string }[] = [];
  const enqueue = (refs: string[], from: string) => queue.push(...refs.map((ref) => ({ ref, from })));
  for (const route of routes) {
    const res = await fetch(base + route);
    if (res.status !== 200) throw new Error(`${route}: HTTP ${res.status}`);
    const html = await res.text();
    if (REAL_COMPANY.test(html)) throw new Error(`${route} に実在企業の表記が含まれています`);
    write(path.join(siteDir, htmlFile(route)), html);
    enqueue([...staticRefs(html), ...fileRefs(html, routeSet)], route);
  }
  const notFound = await fetch(base + "/__export_not_found__");
  if (notFound.status !== 404) throw new Error(`存在しないページが 404 になりません（HTTP ${notFound.status}）`);
  const notFoundHtml = await notFound.text();
  write(path.join(siteDir, "404.html"), notFoundHtml);
  enqueue(staticRefs(notFoundHtml), "404");
  for (const file of ["/robots.txt", "/sitemap.xml"]) {
    const res = await fetch(base + file);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    write(path.join(siteDir, file), Buffer.from(await res.arrayBuffer()));
  }
  fs.cpSync(path.join(ROOT, "public"), siteDir, { recursive: true });

  // 2. JS・CSS・フォント（CSS と JS の中から参照されるものもたどる）
  const done = new Set<string>();
  const missing: string[] = [];
  let skipped = 0;
  let bytes = 0;
  while (queue.length) {
    const { ref, from } = queue.shift()!;
    if (done.has(ref)) continue;
    done.add(ref);
    const res = await fetch(base + ref);
    if (!res.ok) {
      // JS の中の文字列から拾ったものは実在しないことがあるので、HTML・CSS から参照されたものだけを失敗にする
      if (from.endsWith(".js")) skipped++;
      else missing.push(`${ref}（参照元: ${from}、HTTP ${res.status}）`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    bytes += buf.length;
    write(path.join(siteDir, decodeURIComponent(ref)), buf);
    if (ref.endsWith(".css")) enqueue(cssRefs(buf.toString("utf8"), ref), ref);
    if (ref.endsWith(".js")) enqueue(staticRefs(buf.toString("utf8")), ref);
  }
  if (missing.length) throw new Error(`取得できないファイルがあります:\n${missing.join("\n")}`);
  console.log(`site/: ${routes.length}ページ + 404、ファイル ${done.size - skipped}件（${(bytes / 1024 / 1024).toFixed(1)}MB） → ${path.relative(process.cwd(), siteDir) || siteDir}`);

  // 3. ページごとの Markdown
  if (process.argv.includes("--no-md")) return;
  const pages = await exportMarkdown(base, routes, pagesDir);
  if (!pages) return;
  write(path.join(pagesDir, "INDEX.md"), indexMarkdown(pages, base));
  console.log(`pages/: ${pages.length}ページの Markdown と INDEX.md・_layout.md → ${path.relative(process.cwd(), pagesDir) || pagesDir}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
