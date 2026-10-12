/**
 * SEO 棚卸しの機械的な指標を、全原稿（記事・ニュース、公開状態を問わない）について書き出す。
 *
 * 使い方: npx tsx scripts/seo-inventory.ts [--json <path>] [--csv <path>]
 *   既定の出力先は docs/seo/article-inventory.csv（リポジトリに置く）と標準出力の要約。
 *
 * 数えるもの: 本文の文字数・H2・表・図解・FAQ・出典（うち公的機関）・内部リンク（出入り）・related の被参照・
 * 読者導線（journeys）とガイド（article-guides）の有無、記事内の相談・チェックへのリンク。
 * 検索量・順位・流入は扱わない（このリポジトリにデータがない）。判定（strong / thin など）は人と編集者が付ける。
 */
import fs from "node:fs";
import path from "node:path";
import { loadAllArticles } from "../src/lib/content/local-repository";
import { JOURNEYS } from "../src/lib/journeys";
import { ARTICLE_GUIDES } from "../src/lib/article-guides";

type Row = Record<string, string | number>;

const args = process.argv.slice(2);
const argValue = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const articles = loadAllArticles();
const bySlug = new Map(articles.map((a) => [a.slug, a]));

const LINK_RE = /\]\((\/(?:articles|news)\/([a-z0-9-]+))(?:#[^)]*)?\)/g;
const stripFigures = (body: string) => body.replace(/```figure[\s\S]*?```/g, "");
const isPublicSource = (url: string) => /\.go\.jp\/|\.lg\.jp\/|laws\.e-gov\.go\.jp|nta\.go\.jp|nenkin\.go\.jp|hellowork\.mhlw/.test(url);

const inbound = new Map<string, Set<string>>();
const relatedInbound = new Map<string, Set<string>>();
for (const a of articles) {
  for (const m of a.body.matchAll(LINK_RE)) {
    const target = m[2];
    if (target === a.slug) continue;
    if (!inbound.has(target)) inbound.set(target, new Set());
    inbound.get(target)!.add(a.slug);
  }
  for (const r of a.related) {
    if (!relatedInbound.has(r)) relatedInbound.set(r, new Set());
    relatedInbound.get(r)!.add(a.slug);
  }
}

const journeyOf = new Map<string, string[]>();
for (const j of JOURNEYS) {
  for (const s of j.steps) {
    if (s.kind !== "article") continue;
    for (const slug of [s.slug, s.side?.slug].filter(Boolean) as string[]) {
      journeyOf.set(slug, [...(journeyOf.get(slug) ?? []), j.patternId]);
    }
  }
}

const rows: Row[] = articles.map((a) => {
  const text = stripFigures(a.body);
  const h2 = [...a.body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  const outLinks = new Set([...a.body.matchAll(LINK_RE)].map((m) => m[2]).filter((s) => s !== a.slug));
  const brokenOut = [...outLinks].filter((s) => !bySlug.has(s) || bySlug.get(s)!.status !== "published");
  return {
    slug: a.slug,
    kind: a.kind,
    status: a.status,
    title: a.title,
    seo_title: a.seoTitle ?? "",
    title_len: [...(a.seoTitle ?? a.title)].length,
    description_len: [...(a.seoDescription ?? a.summary)].length,
    eyecatch: a.eyecatch.join(""),
    category: a.categories.join("|"),
    concerns: a.concerns.join("|"),
    situations: a.situations.join("|"),
    roles: a.roles.join("|"),
    published_at: a.publishedAt ?? "",
    updated_at: a.updatedAt,
    reviewed_at: a.reviewedAt ?? "",
    information_checked_at: a.informationCheckedAt ?? "",
    body_chars: [...text.replace(/\s+/g, "")].length,
    h2_count: h2.length,
    tables: (a.body.match(/^\|[ -:|]+\|$/gm) ?? []).length,
    figures: (a.body.match(/```figure/g) ?? []).length,
    faq: a.faq.length,
    sources: a.sources.length,
    public_sources: a.sources.filter((s) => isPublicSource(s.url)).length,
    out_links: outLinks.size,
    out_links_unpublished: brokenOut.join("|"),
    in_links: inbound.get(a.slug)?.size ?? 0,
    in_related: relatedInbound.get(a.slug)?.size ?? 0,
    journeys: (journeyOf.get(a.slug) ?? []).join("|"),
    guide_topic: ARTICLE_GUIDES[a.slug]?.topic ?? "",
    links_check: (a.body.match(/\]\(\/check\)/g) ?? []).length,
    links_consultation: (a.body.match(/\]\(\/consultation[^)]*\)/g) ?? []).length,
    h2_list: h2.join(" / "),
  };
});

const header = Object.keys(rows[0]);
const csvCell = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [header.join(","), ...rows.map((r) => header.map((h) => csvCell(r[h])).join(","))].join("\n") + "\n";
const csvPath = argValue("--csv") ?? path.join("docs", "seo", "article-inventory.csv");
fs.mkdirSync(path.dirname(csvPath), { recursive: true });
fs.writeFileSync(csvPath, csv);
const jsonPath = argValue("--json");
if (jsonPath) fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 1));

const visible = rows.filter((r) => r.status === "published");
const orphans = visible.filter((r) => r.kind === "article" && r.in_links === 0 && r.in_related === 0).map((r) => r.slug);
console.log(`manuscripts=${rows.length} published=${visible.length} (articles=${visible.filter((r) => r.kind === "article").length}, news=${visible.filter((r) => r.kind === "news").length}) other=${rows.length - visible.length}`);
console.log(`orphans(no body link & no related from others)=${orphans.length}${orphans.length ? `: ${orphans.join(", ")}` : ""}`);
console.log(`links to unpublished: ${visible.filter((r) => r.out_links_unpublished).map((r) => `${r.slug}->${r.out_links_unpublished}`).join(", ") || "none"}`);
console.log(`csv: ${csvPath}`);
