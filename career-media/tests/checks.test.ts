import { describe, expect, it } from "vitest";
import { checkArticle, extractLinks, gateFailed, type CheckContext } from "../pipeline/src/checks";
import { loadAllArticles, loadCategories } from "@/lib/content/local-repository";
import type { Article } from "@/lib/content/types";

const TODAY = "2026-10-06";
const ctx = (): CheckContext => ({ articles: loadAllArticles(), categories: loadCategories(), today: TODAY });

function article(overrides: Partial<Article> = {}): Article {
  return {
    slug: "test-article",
    kind: "article",
    title: "テスト記事のタイトル",
    summary: "未経験転職を考える人が、条件を整理するときに確認したいことをまとめたテスト用の要約文です。",
    body: "## 見出し\n\n" + "本文です。".repeat(200),
    status: "review",
    categories: ["mikeiken"],
    featured: false,
    publishedAt: null,
    updatedAt: "2026-10-01",
    reviewedAt: null,
    reviewedBy: null,
    informationCheckedAt: "2026-10-01",
    related: [],
    roles: ["jimu"],
    concerns: ["office"],
    situations: ["sekkyaku"],
    eyecatch: ["テスト記事の", "見出し"],
    recommended: false,
    faq: [],
    sources: [
      { title: "出典A", publisher: "厚生労働省", url: "https://www.mhlw.go.jp/a", accessedAt: "2026-10-01", usedFor: "A" },
      { title: "出典B", publisher: "民間企業", url: "https://example.com/b", accessedAt: "2026-10-01", usedFor: "B" },
    ],
    ...overrides,
  };
}

const codes = (a: Article) => checkArticle(a, { ...ctx(), articles: [...ctx().articles, a] }).map((f) => `${f.severity}:${f.code}`);

describe("reviewer checks (ported from ZIP check_article)", () => {
  it("passes a well-formed review article (non-government sources allowed)", () => {
    expect(codes(article()).filter((c) => c.startsWith("error"))).toEqual([]);
  });

  it("C02: published requires review/info-check dates and sources", () => {
    expect(codes(article({ status: "published", publishedAt: "2026-10-01" }))).toContain("error:C02");
    expect(codes(article({ sources: [] }))).toContain("error:C02");
  });

  it("C05: rejects links to unpublished or missing articles and bad job anchors", () => {
    expect(codes(article({ body: article().body + "\n[下書き](/articles/kyujin-hyo-yomikata)" }))).toContain("error:C05");
    expect(codes(article({ body: article().body + "\n[なし](/articles/does-not-exist)" }))).toContain("error:C05");
    expect(codes(article({ body: article().body + "\n[職種](/jobs#unknown-role)" }))).toContain("error:C05");
    expect(codes(article({ body: article().body + "\n[職種](/jobs#it-support) [記事](/articles/agent-mendan-mae)" })).filter((c) => c === "error:C05")).toEqual([]);
  });

  it("C07: blocks guarantee expressions but allows 必ず確認する", () => {
    expect(codes(article({ body: article().body + "\nこの方法なら必ず転職できます。" }))).toContain("error:C07");
    expect(codes(article({ summary: "年収が確実に上がる方法を紹介します。未経験転職の条件の整理について書いたテスト用の要約です。" }))).toContain("error:C07");
    expect(codes(article({ body: article().body + "\n勤務地は必ず確認しましょう。必ずしも悪いことではありません。" }))).not.toContain("error:C07");
  });

  it("C08/C09/C10: AI-smell phrases, relative time and H1", () => {
    expect(codes(article({ body: article().body + "\n活用することができます。" }))).toContain("error:C08");
    expect(codes(article({ body: article().body + "\n来月から変わります。" }))).toContain("warning:C09");
    expect(codes(article({ body: "# タイトル\n\n" + article().body }))).toContain("error:C10");
  });

  it("C04: future dates and stale information checks", () => {
    expect(codes(article({ informationCheckedAt: "2026-12-01" }))).toContain("error:C04");
    expect(codes(article({ informationCheckedAt: "2025-01-01" }))).toContain("warning:C04");
  });

  it("C12: news must explain unknowns and what to check", () => {
    const news = article({ kind: "news", categories: ["news"], news: { announcedBy: "厚生労働省", announcedAt: "2025-04-01", whatHappened: "a", whoIsAffected: "b", impactForCareerChangers: "c", unknowns: [], whatToCheck: [] } });
    expect(codes(news)).toContain("error:C12");
  });

  it("C16/C17: rejects unknown entry tags, over-long eyecatch and income labeling", () => {
    expect(codes(article({ concerns: ["unknown-concern"] }))).toContain("error:C16");
    expect(codes(article({ eyecatch: ["1行目", "2行目", "3行目"] }))).toContain("error:C16");
    expect(codes(article({ illustration: "not-a-motif" }))).toContain("error:C16");
    expect(codes(article({ illustration: "coins" })).filter((c) => c === "error:C16")).toEqual([]);
    expect(codes(article({ body: article().body + "\n年収350万円以下の人向けの記事です。" }))).toContain("error:C17");
    expect(codes(article({ body: article().body + "\nあなたの市場価値を上げよう。" }))).toContain("warning:C17");
    expect(codes(article({ body: article().body + "\n[入口](/concerns/donichi) [職種](/jobs/jimu)" })).filter((c) => c === "error:C05")).toEqual([]);
    expect(codes(article({ body: article().body + "\n[入口](/concerns/nope)" }))).toContain("error:C05");
  });

  it("C18: figure blocks must be valid, short, and only use numbers that appear in the body", () => {
    const fig = (yaml: string) => "\n\n```figure\n" + yaml + "\n```\n";
    const steps = "type: steps\ntitle: 3つの手順\nitems:\n  - label: 書き出す\n    text: 1日の流れ\n  - label: 比べる\n  - label: 決める";
    expect(codes(article({ body: article().body + "\n3つの手順と1日の流れ。" + fig(steps) })).filter((c) => c.endsWith(":C18"))).toEqual([]);
    // 本文にない数字
    expect(codes(article({ body: article().body + fig(steps.replace("1日の流れ", "120日の休み")) }))).toContain("error:C18");
    // 形が違う・長すぎる
    expect(codes(article({ body: article().body + fig("type: chart\nitems: []") }))).toContain("error:C18");
    expect(codes(article({ body: article().body + fig("type: checklist\nitems:\n  - " + "あ".repeat(41) + "\n  - い") }))).toContain("error:C18");
    expect(codes(article({ body: article().body + fig("type: steps\nitems: [") }))).toContain("error:C18");
  });

  it("extracts markdown links", () => {
    expect(extractLinks("[a](/articles/x) and [b](https://e.com \"t\")")).toEqual(["/articles/x", "https://e.com"]);
  });

  it("the shipped content passes the gate (drafts are reported only)", () => {
    const c = ctx();
    const reports = c.articles.map((a) => ({ slug: a.slug, status: a.status, findings: checkArticle(a, c) }));
    const errors = reports.filter((r) => r.status !== "draft").flatMap((r) => r.findings.filter((f) => f.severity === "error").map((f) => `${r.slug} ${f.code} ${f.message}`));
    expect(errors).toEqual([]);
    expect(gateFailed(reports)).toBe(false);
  });
});
