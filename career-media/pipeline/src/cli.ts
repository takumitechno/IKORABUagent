/**
 * 記事パイプライン CLI（Writer / Reviewer / Publish の分離）
 *
 *   npm run pipeline -- check [--slug <slug>] [--check-urls] [--json]
 *   npm run pipeline -- review <slug> [--reviewer <name>]
 *   npm run pipeline -- publish <slug> --approved-by <name>
 *   npm run pipeline -- seed-sql [--out supabase/seed.sql]
 *
 * - generate（Writer）は status=draft / review までしか書けない
 * - review は機械チェックを実行し、本文ハッシュつきの判定を content/reviews/ に残す
 * - publish は「status=review」「エラー0件」「現在の本文に対する approved 判定」
 *   「人間の承認者名」が揃ったときだけ status=published にする
 * - 実行ログは .runtime/logs/pipeline-runs.jsonl（DB の pipeline_runs と同じ形）
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadAllArticles, loadCategories } from "../../src/lib/content/local-repository";
import type { Article } from "../../src/lib/content/types";
import { checkAll, checkArticle, checkUrl, gateFailed, type CheckContext, type Finding } from "./checks";
import { buildSeedSql } from "./seed-sql";

const ROOT = path.resolve(__dirname, "../..");
// テストでは一時ディレクトリに差し替える
const CONTENT_DIR = process.env.PIPELINE_CONTENT_DIR ? path.resolve(process.env.PIPELINE_CONTENT_DIR) : path.join(ROOT, "content");
const REVIEWS_DIR = path.join(CONTENT_DIR, "reviews");
const LOG_FILE = process.env.PIPELINE_LOG_FILE ? path.resolve(process.env.PIPELINE_LOG_FILE) : path.join(ROOT, ".runtime/logs/pipeline-runs.jsonl");

const today = () => process.env.PIPELINE_TODAY || new Date().toISOString().slice(0, 10);

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

function context(): CheckContext {
  return { articles: loadAllArticles(CONTENT_DIR), categories: loadCategories(CONTENT_DIR), today: today() };
}

/** 査読対象の本文ハッシュ（status や日付の変更では変わらない） */
export function contentHash(a: Article): string {
  const payload = JSON.stringify({ title: a.title, summary: a.summary, body: a.body, sources: a.sources, faq: a.faq, news: a.news ?? null, categories: a.categories });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

type ReviewRecord = { slug: string; contentHash: string; reviewer: string; verdict: "approved" | "changes_requested"; findings: Finding[]; reviewedAt: string };

function readReviews(slug: string): ReviewRecord[] {
  const file = path.join(REVIEWS_DIR, `${slug}.json`);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as ReviewRecord[]) : [];
}

function logRun(entry: Record<string, unknown>) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, JSON.stringify({ ...entry, ended_at: new Date().toISOString() }) + "\n");
}

function articleFile(slug: string): string {
  for (const dir of ["articles", "news"]) {
    const file = path.join(CONTENT_DIR, dir, `${slug}.md`);
    if (fs.existsSync(file)) return file;
  }
  throw new Error(`記事が見つかりません: ${slug}`);
}

/** frontmatter の1項目だけを書き換える（YAML 全体を再整形しない） */
export function setFrontmatterField(raw: string, key: string, value: string): string {
  const end = raw.indexOf("\n---", 3);
  if (!raw.startsWith("---") || end < 0) throw new Error("frontmatter がありません");
  const head = raw.slice(0, end);
  const rest = raw.slice(end);
  const re = new RegExp(`^${key}:.*$`, "m");
  const line = `${key}: ${value}`;
  return (re.test(head) ? head.replace(re, line) : `${head}\n${line}`) + rest;
}

function printFindings(slug: string, status: string, findings: Finding[]) {
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  const mark = errors.length ? "✗" : "✓";
  console.log(`${mark} ${slug} [${status}] errors=${errors.length} warnings=${warnings.length}`);
  for (const x of findings) console.log(`    ${x.severity === "error" ? "ERROR" : "warn "} ${x.code} ${x.message}`);
}

async function cmdCheck() {
  const startedAt = new Date().toISOString();
  const ctx = context();
  const slug = arg("slug");
  const reports = checkAll(ctx).filter((r) => !slug || r.slug === slug);
  if (flag("check-urls")) {
    const urls = [...new Set(ctx.articles.filter((a) => !slug || a.slug === slug).flatMap((a) => a.sources.map((s) => s.url)))];
    for (const result of await Promise.all(urls.map((u) => checkUrl(u)))) {
      const ok = result.status !== null && result.status < 400;
      if (!ok) for (const r of reports) if (ctx.articles.find((a) => a.slug === r.slug)?.sources.some((s) => s.url === result.url)) r.findings.push({ code: "C15", severity: "warning", message: `出典 URL に到達できない (${result.status ?? result.error}): ${result.url}` });
    }
  }
  if (flag("json")) console.log(JSON.stringify(reports, null, 2));
  else reports.forEach((r) => printFindings(r.slug, r.status, r.findings));
  const failed = gateFailed(reports);
  logRun({ agent: "career-reviewer", trigger: "manual", action: "check", status: failed ? "error" : "completed", items_processed: reports.length, items_failed: reports.filter((r) => r.findings.some((f) => f.severity === "error")).length, started_at: startedAt });
  if (!flag("json")) console.log(failed ? "\nGATE: FAILED (review / published の記事にエラーがあります)" : "\nGATE: PASSED");
  process.exitCode = failed ? 1 : 0;
}

function cmdReview(slug: string) {
  const startedAt = new Date().toISOString();
  const ctx = context();
  const article = ctx.articles.find((a) => a.slug === slug);
  if (!article) throw new Error(`記事が見つかりません: ${slug}`);
  if (article.status === "draft") throw new Error("draft は査読できません。Writer が status: review にしてから実行してください");
  const findings = checkArticle(article, ctx);
  const verdict = findings.some((f) => f.severity === "error") ? "changes_requested" : "approved";
  const record: ReviewRecord = { slug, contentHash: contentHash(article), reviewer: arg("reviewer") || "career-reviewer (automated checks)", verdict, findings, reviewedAt: new Date().toISOString() };
  fs.mkdirSync(REVIEWS_DIR, { recursive: true });
  fs.writeFileSync(path.join(REVIEWS_DIR, `${slug}.json`), JSON.stringify([...readReviews(slug), record], null, 2) + "\n");
  printFindings(slug, article.status, findings);
  console.log(`\nREVIEW: ${verdict}`);
  logRun({ agent: "career-reviewer", trigger: "manual", action: "review", target_slug: slug, status: "completed", what_done: verdict, started_at: startedAt });
  process.exitCode = verdict === "approved" ? 0 : 1;
}

function cmdPublish(slug: string) {
  const startedAt = new Date().toISOString();
  const approvedBy = arg("approved-by");
  if (!approvedBy) throw new Error("--approved-by <公開を承認した人の名前> が必要です（自動公開はしません）");
  const ctx = context();
  const article = ctx.articles.find((a) => a.slug === slug);
  if (!article) throw new Error(`記事が見つかりません: ${slug}`);
  if (article.status !== "review") throw new Error(`status が review ではありません（現在: ${article.status}）`);
  if (!article.informationCheckedAt) throw new Error("information_checked_at が未設定です");
  const findings = checkArticle(article, ctx);
  if (findings.some((f) => f.severity === "error")) {
    printFindings(slug, article.status, findings);
    throw new Error("エラーが残っているため公開できません");
  }
  const latest = readReviews(slug).at(-1);
  if (!latest || latest.verdict !== "approved") throw new Error("approved の査読記録がありません。先に review を実行してください");
  if (latest.contentHash !== contentHash(article)) throw new Error("査読後に本文が変更されています。再度 review を実行してください");

  const file = articleFile(slug);
  let raw = fs.readFileSync(file, "utf8");
  const day = today();
  raw = setFrontmatterField(raw, "status", "published");
  if (!article.publishedAt) raw = setFrontmatterField(raw, "published_at", day);
  raw = setFrontmatterField(raw, "reviewed_at", day);
  raw = setFrontmatterField(raw, "reviewed_by", approvedBy);
  fs.writeFileSync(file, raw);
  console.log(`PUBLISHED: ${slug}（承認: ${approvedBy}）`);
  logRun({ agent: "publish", trigger: "manual", action: "publish", target_slug: slug, status: "completed", what_done: `approved by ${approvedBy}`, started_at: startedAt });
}

function cmdSeedSql() {
  const out = path.resolve(ROOT, arg("out") || "supabase/seed.sql");
  const ctx = context();
  const sql = buildSeedSql(ctx.articles, ctx.categories, (a) => checkArticle(a, ctx), contentHash);
  fs.writeFileSync(out, sql);
  console.log(`wrote ${path.relative(ROOT, out)} (${ctx.articles.length} articles)`);
}

async function main() {
  const [command, slug] = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && !(all[i - 1] ?? "").startsWith("--"));
  switch (command) {
    case "check":
      return cmdCheck();
    case "review":
      if (!slug) throw new Error("usage: review <slug>");
      return cmdReview(slug);
    case "publish":
      if (!slug) throw new Error("usage: publish <slug> --approved-by <name>");
      return cmdPublish(slug);
    case "seed-sql":
      return cmdSeedSql();
    default:
      console.log("usage: pipeline <check|review|publish|seed-sql> ...");
      process.exitCode = 2;
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(`ERROR: ${e instanceof Error ? e.message : e}`);
    process.exitCode = 1;
  });
}
