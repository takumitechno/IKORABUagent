/**
 * 記事の機械チェック（Reviewer の品質ゲート）。
 *
 * ZIP（補助金版）の `subsidy-article-reviewer` の check_article(E01〜E16) を、
 * 未経験転職メディア向けに作り直したもの。
 *
 * 残したもの: 出典の記録 / 日付チェック / URL チェック / 内部リンクの実在確認 /
 *             H1 混入・AI臭フレーズ・相対時制の検出 / 「チェックリスト＝検出コード」の対応
 * 外したもの: 佐藤・室谷の対話形式 / 10,000文字以上 / <mark> 回数 / 「！」回数 /
 *             テーブル数ノルマ / 図解画像2枚必須 / 政府ドメイン限定の出典要件 /
 *             競合の1.5〜2倍の情報量 / 補助金の金額・公募期間チェック
 */
import { isPubliclyVisible } from "../../src/lib/content/parse";
import type { Article, Category } from "../../src/lib/content/types";
import { JOB_ROLES } from "../../src/lib/jobs";
import { TAXONOMY, type TaxonomyGroup } from "../../src/lib/taxonomy";

export type Severity = "error" | "warning";
export type Finding = { code: string; severity: Severity; message: string };

export type CheckContext = {
  /** 全記事（status 問わず） */
  articles: Article[];
  categories: Category[];
  today: string;
  /** 情報確認日がこの日数より古いと警告 */
  staleAfterDays?: number;
};

/** 静的ページとして存在する内部パス */
const STATIC_PATHS = new Set(["/", "/articles", "/news", "/jobs", "/check", "/consultation", "/about", "/editorial-policy", "/disclosure", "/privacy", "/disclaimer"]);

/** 読者をラベリングする表現・硬い業界用語（画面上の言葉としては避ける） */
const LABELING_PATTERNS: RegExp[] = [/年収\s*\d+\s*万円?以下(の人|向け|の方)/, /低所得/, /低年収層/];
const JARGON = ["市場価値", "キャリア戦略", "人的資本", "ポータブルスキル"];

/** 成果を保証する表現（禁止）。「必ず確認する」「必ずしも」などは対象外にする */
const GUARANTEE_PATTERNS: RegExp[] = [
  /必ず(転職|内定|採用|合格|受か|年収|収入|稼げ|正社員になれ)/,
  /絶対(に)?(転職|内定|採用|受か|稼げ|年収)/,
  /確実に(転職|内定|採用|受か|年収|収入)/,
  /(100|１００)\s*[%％]\s*(転職|内定|採用|成功)/,
  /誰でも(転職|内定|採用|正社員になれ|稼げ)/,
  /年収が?(必ず|確実に)/,
  /転職成功率\s*\d+/,
];

/** AI臭フレーズ（ZIP の禁止リストを継承。自然な表現に書き直す） */
const AI_SMELL_PHRASES = ["することができます", "幅広く", "包括的に", "網羅的に", "一助となれば", "いかがでしたでしょうか", "まとめると以下のようになります", "について解説します"];

/** 鮮度が落ちやすい相対時制（ZIP の時制ルールを継承。絶対日付で書く） */
const RELATIVE_TIME = ["来月", "先月", "今年度", "昨年度", "来年度", "もうすぐ", "最近の", "今年から", "去年"];

const SLUG_RE = /^[a-z0-9-]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

/** 本文中の Markdown リンクを抽出 */
export function extractLinks(markdown: string): string[] {
  const links: string[] = [];
  const re = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) links.push(m[1]);
  return links;
}

/** 本文中のテキストだけ（frontmatter の FAQ / ニュース解説も含めて表現チェックする） */
function allText(article: Article): string {
  const parts = [article.title, article.summary, article.body, ...article.faq.flatMap((f) => [f.question, f.answer])];
  if (article.news) parts.push(article.news.whatHappened, article.news.whoIsAffected, article.news.impactForCareerChangers, ...article.news.unknowns, ...article.news.whatToCheck);
  return parts.join("\n");
}

export function checkArticle(article: Article, ctx: CheckContext): Finding[] {
  const f: Finding[] = [];
  const err = (code: string, message: string) => f.push({ code, severity: "error", message });
  const warn = (code: string, message: string) => f.push({ code, severity: "warning", message });
  const publishedSlugs = new Set(ctx.articles.filter((a) => isPubliclyVisible(a, new Date(`${ctx.today}T23:59:59Z`))).map((a) => `${a.kind}:${a.slug}`));
  const targetsPublic = article.status === "published" || article.status === "review";

  // C01 必須項目
  if (!SLUG_RE.test(article.slug)) err("C01", `slug は英小文字・数字・ハイフンのみ: ${article.slug}`);
  if (!article.title.trim()) err("C01", "title が空");
  if (!article.summary.trim()) err("C01", "summary が空");
  if (article.categories.length === 0) err("C01", "categories が空");
  for (const c of article.categories) if (!ctx.categories.some((x) => x.slug === c)) err("C01", `存在しないカテゴリ: ${c}`);
  if (ctx.articles.filter((a) => a.slug === article.slug).length > 1) err("C01", `slug が重複: ${article.slug}`);

  // C02 公開要件（本文がある＝公開可能、にはしない）
  if (article.status === "published") {
    if (!article.publishedAt) err("C02", "published なのに published_at がない");
    if (!article.reviewedAt) err("C02", "published なのに reviewed_at がない（査読未完了）");
    if (!article.informationCheckedAt) err("C02", "published なのに information_checked_at がない");
  }
  if (targetsPublic && article.sources.length === 0) err("C02", "出典 (sources) が0件。review / published には1件以上必要");

  // C03 出典
  article.sources.forEach((s, i) => {
    const label = `sources[${i}]`;
    if (!/^https?:\/\/[^\s]+\.[^\s]+/.test(s.url)) err("C03", `${label} の URL が不正: ${s.url}`);
    if (!s.title.trim()) err("C03", `${label} の title が空`);
    if (!s.publisher.trim()) err("C03", `${label} の publisher が空`);
    if (!DATE_RE.test(s.accessedAt)) err("C03", `${label} の accessed_at が不正`);
    if (!s.usedFor) warn("C03", `${label} に used_for（どの記述に使ったか）がない`);
  });
  if (targetsPublic && article.sources.length === 1) warn("C03", "出典が1件のみ。可能なら2件以上で裏付ける");

  // C04 日付
  const dates: [string, string | null][] = [
    ["published_at", article.publishedAt],
    ["updated_at", article.updatedAt],
    ["reviewed_at", article.reviewedAt],
    ["information_checked_at", article.informationCheckedAt],
  ];
  for (const [name, value] of dates) {
    if (value && !DATE_RE.test(value)) err("C04", `${name} の形式が不正: ${value}`);
    if (value && name !== "published_at" && value > ctx.today) err("C04", `${name} が未来日付: ${value}`);
  }
  if (article.publishedAt && article.updatedAt < article.publishedAt) err("C04", "updated_at が published_at より前");
  if (article.reviewedAt && article.updatedAt > article.reviewedAt) warn("C04", "査読（reviewed_at）のあとに更新されている。再査読が必要");
  if (article.informationCheckedAt && daysBetween(article.informationCheckedAt, ctx.today) > (ctx.staleAfterDays ?? 180)) {
    warn("C04", `情報確認日から${daysBetween(article.informationCheckedAt, ctx.today)}日経過。内容の再確認が必要`);
  }
  for (const s of article.sources) if (s.accessedAt > ctx.today) err("C04", `出典の確認日が未来日付: ${s.url}`);
  if (article.informationCheckedAt && article.sources.some((s) => s.accessedAt && s.accessedAt > article.informationCheckedAt!)) {
    warn("C04", "出典の確認日が情報確認日より新しい。information_checked_at を更新する");
  }

  // C05 内部リンク（存在しない・未公開のページへのリンクは禁止）
  for (const href of extractLinks(article.body)) {
    if (/^https?:\/\//.test(href)) continue;
    if (!href.startsWith("/")) {
      err("C05", `相対パス・不明な形式のリンク: ${href}`);
      continue;
    }
    const [pathname, hash] = href.split("#");
    const m = pathname.match(/^\/(articles|news)\/([a-z0-9-]+)$/);
    if (m) {
      const kind = m[1] === "news" ? "news" : "article";
      if (!publishedSlugs.has(`${kind}:${m[2]}`)) err("C05", `未公開または存在しない記事へのリンク: ${href}`);
      continue;
    }
    const cat = pathname.match(/^\/categories\/([a-z0-9-]+)$/);
    if (cat) {
      if (!ctx.categories.some((c) => c.slug === cat[1])) err("C05", `存在しないカテゴリへのリンク: ${href}`);
      continue;
    }
    const hub = pathname.match(/^\/(jobs|concerns|situations)\/([a-z0-9-]+)$/);
    if (hub) {
      const group: TaxonomyGroup = hub[1] === "jobs" ? "roles" : (hub[1] as TaxonomyGroup);
      if (!TAXONOMY[group].some((t) => t.slug === hub[2])) err("C05", `存在しない入口ページへのリンク: ${href}`);
      continue;
    }
    if (!STATIC_PATHS.has(pathname)) err("C05", `存在しないページへのリンク: ${href}`);
    if (pathname === "/jobs" && hash && !JOB_ROLES.some((r) => r.slug === hash)) err("C05", `職種比較に存在しないアンカー: ${href}`);
  }

  // C06 関連記事
  for (const slug of article.related) {
    const target = ctx.articles.find((a) => a.slug === slug);
    if (!target) err("C06", `related に存在しない slug: ${slug}`);
    else if (!publishedSlugs.has(`${target.kind}:${slug}`)) warn("C06", `related が未公開の記事を指している: ${slug}`);
    if (slug === article.slug) err("C06", "related に自分自身が含まれている");
  }

  const text = allText(article);

  // C07 成果保証表現の禁止
  for (const re of GUARANTEE_PATTERNS) {
    const m = text.match(re);
    if (m) err("C07", `成果を保証する表現: 「${m[0]}」`);
  }

  // C08 AI臭フレーズ
  for (const phrase of AI_SMELL_PHRASES) if (text.includes(phrase)) err("C08", `AI臭フレーズ: 「${phrase}」→ 自然な表現に書き直す`);

  // C09 相対時制
  for (const word of RELATIVE_TIME) if (text.includes(word)) warn("C09", `相対的な時期の表現: 「${word}」→ 絶対日付で書く`);

  // C10 本文に H1 を入れない（ページ側で title を表示する）
  article.body.split("\n").forEach((line, i) => {
    if (/^#\s/.test(line)) err("C10", `L${i + 1} 本文に H1 がある`);
  });

  // C11 生の HTML（表示時はエスケープされる）
  if (/<\/?(script|iframe|div|span|mark|style)\b/i.test(article.body)) warn("C11", "本文に HTML タグがある（表示時はエスケープされる）");

  // C12 ニュースの構造
  if (article.kind === "news") {
    const n = article.news;
    if (!n) err("C12", "kind=news なのに news（構造化解説）がない");
    else {
      if (!n.announcedBy || !DATE_RE.test(n.announcedAt)) err("C12", "news.announced_by / announced_at が不正");
      if (!n.whatHappened || !n.whoIsAffected || !n.impactForCareerChangers) err("C12", "news の解説項目（何が/誰に/何が変わるか）が不足");
      if (n.unknowns.length === 0) err("C12", "news.unknowns（この情報だけでは分からないこと）が0件");
      if (n.whatToCheck.length === 0) err("C12", "news.what_to_check（確認すべきこと）が0件");
    }
  }

  // C13 FAQ（FAQ JSON-LD は画面に表示する FAQ だけから作る）
  article.faq.forEach((q, i) => {
    if (!q.question.trim() || !q.answer.trim()) err("C13", `faq[${i}] の質問または回答が空`);
  });

  // C16 入口タグ（職種 / 悩み / 今の状況）とアイキャッチ
  for (const group of ["roles", "concerns", "situations"] as TaxonomyGroup[]) {
    for (const slug of article[group]) if (!TAXONOMY[group].some((t) => t.slug === slug)) err("C16", `${group} に未定義のタグ: ${slug}（src/lib/taxonomy.ts）`);
  }
  if (targetsPublic && article.kind === "article" && article.concerns.length + article.situations.length === 0) warn("C16", "悩み（concerns）か今の状況（situations）のタグがない。入口ページに出ない");
  if (targetsPublic && article.eyecatch.length === 0) warn("C16", "eyecatch（カードの短い文言）がない。title で代用される");
  if (article.eyecatch.length > 2) err("C16", "eyecatch は2行まで");
  for (const line of article.eyecatch) if (line.length > 16) warn("C16", `eyecatch の1行が長い（${line.length}文字）: ${line}`);

  // C17 読者をラベリングする表現・硬い業界用語
  for (const re of LABELING_PATTERNS) {
    const m = text.match(re);
    if (m) err("C17", `読者をラベリングする表現: 「${m[0]}」`);
  }
  for (const word of JARGON) if (text.includes(word)) warn("C17", `硬い業界用語: 「${word}」→ 読者の言葉に言い換える`);

  // C14 長さの目安（文字数ノルマではなく、極端な過不足の検出）
  if (article.title.length > 60) warn("C14", `title が長い（${article.title.length}文字）`);
  if (article.summary.length < 40 || article.summary.length > 200) warn("C14", `summary の長さが目安外（${article.summary.length}文字）`);
  if (targetsPublic && article.kind === "article" && article.body.replace(/\s/g, "").length < 800) warn("C14", "本文が短い（800文字未満）");

  return f;
}

export type ArticleReport = { slug: string; status: Article["status"]; findings: Finding[] };

export function checkAll(ctx: CheckContext): ArticleReport[] {
  return ctx.articles.map((a) => ({ slug: a.slug, status: a.status, findings: checkArticle(a, ctx) }));
}

/** review / published の記事にエラーがあればゲート失敗（draft は報告のみ） */
export function gateFailed(reports: ArticleReport[]): boolean {
  return reports.some((r) => r.status !== "draft" && r.status !== "archived" && r.findings.some((f) => f.severity === "error"));
}

/** URL 生存チェック（ネットワークが必要なので明示オプション時のみ） */
export async function checkUrl(url: string, timeoutMs = 10_000): Promise<{ url: string; status: number | null; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    if (res.status === 405 || res.status === 403) res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    return { url, status: res.status };
  } catch (e) {
    return { url, status: null, error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}
