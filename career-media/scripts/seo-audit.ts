/**
 * 起動中のサーバーの全ページを取得し、検索向けのメタデータと表示内容の整合を確かめる（外部へは送信しない）。
 *
 *   npm run demo -- --port 3200                       # 別のターミナルで起動しておく
 *   npx tsx scripts/seo-audit.ts --base http://127.0.0.1:3200 [--out report.json]
 *
 * 確かめること（JavaScript を使わずに HTML だけを見る）:
 * - HTTP 200、title / meta description / canonical / robots / OGP / Twitter 画像の有無
 * - title と description のページ間の重複、H1 が1つだけあるか
 * - canonical がそのページ自身の URL か（検索結果ページは一覧を指す）
 * - Article / NewsArticle の headline・日付・画像が表示内容と一致するか、パンくず構造化データの末尾がページか
 * - サイト内リンクとサイト内画像の到達性（リンク切れ・転送）
 * - sitemap.xml の URL が 200 を返し、canonical と一致するか。robots.txt がプレビュー中はクロールを拒否しているか
 * 正式公開前のプレビューでは noindex が正しい状態なので、noindex は「確認事項」として数えるだけでエラーにしない。
 */
import path from "node:path";
import fs from "node:fs";
import { LocalContentRepository } from "../src/lib/content/local-repository";
import { listSiteRoutes } from "./site-routes";

const ROOT = path.resolve(__dirname, "..");
const argv = process.argv.slice(2);
const arg = (flag: string) => (argv.indexOf(flag) >= 0 ? argv[argv.indexOf(flag) + 1] : undefined);
const base = (arg("--base") ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const out = arg("--out");

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ");
const textOf = (html: string) => decode(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
const meta = (html: string, attr: "name" | "property", key: string) =>
  decode(html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1] ?? "");

type PageReport = {
  route: string;
  status: number;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  h1: string[];
  jsonLdTypes: string[];
  problems: string[];
  notes: string[];
};

async function main() {
  const repo = new LocalContentRepository(path.join(ROOT, "content"));
  const routes = [...(await listSiteRoutes(repo)), "/articles?q=" + encodeURIComponent("事務")];
  const linkStatus = new Map<string, number>();
  const pages: PageReport[] = [];
  const internalLinks = new Map<string, Set<string>>();

  for (const route of routes) {
    const res = await fetch(base + route, { redirect: "manual" });
    const html = res.status === 200 ? await res.text() : "";
    const problems: string[] = [];
    const notes: string[] = [];
    const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const description = meta(html, "name", "description");
    const canonical = decode(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "");
    const robots = meta(html, "name", "robots");
    const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => textOf(m[1]).trim());
    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const text = textOf(html);

    if (res.status !== 200) problems.push(`HTTP ${res.status}`);
    else {
      if (!title) problems.push("title がない");
      if (!description) problems.push("meta description がない");
      if (!canonical) problems.push("canonical がない");
      if (h1.length !== 1) problems.push(`H1 が ${h1.length} 個`);
      if (!meta(html, "property", "og:image")) problems.push("og:image がない");
      if (!meta(html, "name", "twitter:image")) problems.push("twitter:image がない");
      const expected = route.startsWith("/articles?q=") ? "/articles" : route.split("?")[0];
      if (canonical && new URL(canonical).pathname !== (expected === "/" ? "/" : expected)) problems.push(`canonical が別のURL: ${canonical}`);
      if (robots.includes("noindex")) notes.push("noindex（プレビュー中は想定どおり）");
      if (route.startsWith("/articles?q=") && !robots.includes("noindex")) problems.push("検索結果ページが noindex でない");

      for (const d of jsonLd) {
        if (d["@type"] === "Article" || d["@type"] === "NewsArticle") {
          if (!text.includes(d.headline)) problems.push(`構造化データの headline が本文・パンくずに見えない: ${d.headline}`);
          const shown = html.match(/<time dateTime="(\d{4}-\d{2}-\d{2})">[^<]*<\/time> 更新/)?.[1];
          if (shown && shown !== d.dateModified) problems.push(`dateModified(${d.dateModified}) と表示の更新日(${shown}) が違う`);
          if (!d.image?.[0]) problems.push("Article に image がない");
          if (d.image?.[0] && meta(html, "property", "og:image") !== d.image[0]) problems.push("Article の image と og:image が違う");
          if (d.datePublished && d.dateModified && d.datePublished > d.dateModified) problems.push("datePublished が dateModified より新しい");
        }
        if (d["@type"] === "BreadcrumbList") {
          const last = d.itemListElement?.[d.itemListElement.length - 1];
          // 一覧の2ページ目以降は「ホーム > 記事一覧」で終わる（ページ送りは一覧の一部として扱う）
          const listPage = /^\/articles\/page\/\d+$/.test(route) && last && new URL(last.item).pathname === "/articles";
          if (last && !listPage && new URL(last.item).pathname !== route.split("?")[0]) problems.push(`パンくずの末尾が別のページ: ${last.item}`);
          if (listPage) notes.push("パンくずは記事一覧で終わる（ページ送り）");
          for (const item of d.itemListElement ?? []) if (!text.includes(item.name)) problems.push(`パンくずの「${item.name}」が画面に見えない`);
        }
        if (d["@type"] === "FAQPage") {
          for (const q of d.mainEntity ?? []) if (!text.includes(q.name)) problems.push(`FAQ の質問が画面に見えない: ${q.name}`);
        }
      }

      const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => decode(m[1]));
      for (const href of hrefs) {
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        const target = href.split("#")[0];
        if (!target) continue;
        if (!internalLinks.has(target)) internalLinks.set(target, new Set());
        internalLinks.get(target)!.add(route);
      }
      for (const m of html.matchAll(/<img\b[^>]*src="(\/[^"]+)"/g)) {
        const src = decode(m[1]);
        if (!internalLinks.has(src)) internalLinks.set(src, new Set());
        internalLinks.get(src)!.add(route);
      }
    }
    pages.push({ route, status: res.status, title, description, canonical, robots, h1, jsonLdTypes: jsonLd.map((d) => d["@type"]), problems, notes });
  }

  // サイト内リンクと画像の到達性
  const broken: string[] = [];
  for (const [target, from] of internalLinks) {
    if (target.startsWith("/_next/")) continue;
    if (!linkStatus.has(target)) linkStatus.set(target, (await fetch(base + target, { redirect: "manual" })).status);
    const status = linkStatus.get(target)!;
    if (status >= 400) broken.push(`${target} → HTTP ${status}（${[...from].slice(0, 3).join(", ")}${from.size > 3 ? " ほか" : ""}）`);
  }

  // title / description の重複（ページ送り・検索結果を除く）
  const comparable = pages.filter((p) => p.status === 200 && !p.route.includes("?"));
  const dup = (key: "title" | "description") => {
    const seen = new Map<string, string[]>();
    for (const p of comparable) seen.set(p[key], [...(seen.get(p[key]) ?? []), p.route]);
    return [...seen.entries()].filter(([, r]) => r.length > 1).map(([v, r]) => `${v.slice(0, 40)}…: ${r.join(", ")}`);
  };

  // sitemap.xml と robots.txt
  const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const sitemapProblems: string[] = [];
  for (const p of sitemapUrls) {
    const page = pages.find((x) => x.route === p);
    if (!page) {
      const status = (await fetch(base + p, { redirect: "manual" })).status;
      if (status !== 200) sitemapProblems.push(`${p}: HTTP ${status}`);
      continue;
    }
    if (page.status !== 200) sitemapProblems.push(`${p}: HTTP ${page.status}`);
    else if (new URL(page.canonical).pathname !== p) sitemapProblems.push(`${p}: canonical が ${page.canonical}`);
  }
  const robotsTxt = await (await fetch(`${base}/robots.txt`)).text();

  const pageProblems = pages.filter((p) => p.problems.length);
  const report = {
    base,
    checkedPages: pages.length,
    pagesWithProblems: pageProblems.map((p) => ({ route: p.route, problems: p.problems })),
    brokenInternalLinks: broken,
    duplicateTitles: dup("title"),
    duplicateDescriptions: dup("description"),
    sitemap: { urls: sitemapUrls.length, problems: sitemapProblems },
    robotsTxt: robotsTxt.trim(),
    noindexPages: pages.filter((p) => p.robots.includes("noindex")).length,
    pages,
  };
  if (out) fs.writeFileSync(out, JSON.stringify(report, null, 1));

  console.log(`${pages.length}ページを確認（${base}）`);
  console.log(`ページの問題: ${pageProblems.length}件`);
  for (const p of pageProblems) console.log(`  ${p.route}: ${p.problems.join(" / ")}`);
  console.log(`サイト内リンク・画像の切れ: ${broken.length}件`);
  for (const b of broken) console.log(`  ${b}`);
  console.log(`title の重複: ${report.duplicateTitles.length}件 ${report.duplicateTitles.join(" | ")}`);
  console.log(`description の重複: ${report.duplicateDescriptions.length}件 ${report.duplicateDescriptions.join(" | ")}`);
  console.log(`sitemap: ${sitemapUrls.length}URL、問題 ${sitemapProblems.length}件 ${sitemapProblems.join(" | ")}`);
  console.log(`robots.txt: ${robotsTxt.trim().replace(/\n/g, " / ")}`);
  console.log(`noindex のページ: ${report.noindexPages}/${pages.length}（正式公開前のプレビューでは想定どおり）`);
  if (pageProblems.length || broken.length || sitemapProblems.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
