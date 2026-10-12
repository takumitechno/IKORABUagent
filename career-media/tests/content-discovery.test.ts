import path from "node:path";
import { describe, expect, it } from "vitest";
import { LocalContentRepository } from "@/lib/content/local-repository";
import { ARTICLE_GUIDES } from "@/lib/article-guides";
import { ARTICLES_PER_PAGE, articlePagePath, latestArticleDate, parseArticlePage, pickLatestArticles, pickStartArticles, READING_STARTS } from "@/lib/content-discovery";
import type { ArticleSummary } from "@/lib/content/types";
import { JOURNEYS } from "@/lib/journeys";
import { resolveSiteUrl } from "@/lib/site-url";
import { listSiteRoutes } from "../scripts/site-routes";

const repo = new LocalContentRepository(path.join(process.cwd(), "content"), () => new Date("2026-10-11T00:00:00Z"));

describe("content discovery", () => {
  it("keeps the 18 guides and all next steps on existing visible articles", async () => {
    const articles = await repo.listArticles({ kind: "article" });
    const slugs = new Set(articles.map((a) => a.slug));
    expect(Object.keys(ARTICLE_GUIDES)).toHaveLength(18);
    for (const [slug, guide] of Object.entries(ARTICLE_GUIDES)) {
      expect(slugs.has(slug), slug).toBe(true);
      expect(slugs.has(guide.next.slug), guide.next.slug).toBe(true);
      expect(guide.next.slug).not.toBe(slug);
      expect(guide.points).toHaveLength(3);
    }
    for (const read of READING_STARTS) expect(slugs.has(read.slug)).toBe(true);
  });

  it("keeps a key search term of the SEO title in each guide's short H1", async () => {
    // 一覧・SNS向けの短いH1でも、検索用タイトルの主な語を1つ以上残す（同じ文にはしない）
    const articles = await repo.listArticles({ kind: "article" });
    for (const [slug, guide] of Object.entries(ARTICLE_GUIDES)) {
      const article = articles.find((a) => a.slug === slug)!;
      const seoTitle = article.seoTitle ?? article.title;
      const terms = (seoTitle.match(/[一-龯ァ-ヴー]{2,}|[A-Za-z]{2,}|\d+(?:万円|歳)/g) ?? []).filter((t) => !["こと", "とき"].includes(t));
      expect(terms.some((t) => guide.displayTitle.includes(t)), `${slug}: ${guide.displayTitle} / ${seoTitle}`).toBe(true);
    }
  });

  it("orders home updates by updated date, then by reader-journey articles on the same date", () => {
    const a = (slug: string, updatedAt: string, publishedAt: string) => ({ slug, kind: "article", updatedAt, publishedAt }) as unknown as ArticleSummary;
    const items = [a("koumuin-shakaijin", "2026-10-12", "2026-10-10"), a("sekkyaku-office", "2026-10-12", "2026-10-06"), a("hanbai-seishain", "2026-10-13", "2026-10-01"), a("jimu-mikeiken-mae", "2026-10-11", "2026-10-06")];
    expect(pickLatestArticles(items, [], 3).map((x) => x.slug)).toEqual(["hanbai-seishain", "sekkyaku-office", "koumuin-shakaijin"]);
    expect(pickLatestArticles(items, ["hanbai-seishain"], 2).map((x) => x.slug)).toEqual(["sekkyaku-office", "koumuin-shakaijin"]);
  });

  it("curates each reader journey from its own tagged articles without duplicates", async () => {
    for (const journey of JOURNEYS) {
      for (const hub of journey.hubs) {
        const [prefix, slug] = hub.slice(1).split("/");
        const group = prefix as "situations" | "concerns";
        const articles = await repo.listArticles({ tag: { group, slug } });
        const top = pickStartArticles(articles, hub);
        const preferred = journey.steps.flatMap((s) => s.kind === "article" && articles.some((a) => a.slug === s.slug) ? [s.slug] : []);
        expect(top.map((a) => a.slug).slice(0, preferred.length)).toEqual(preferred.slice(0, 3));
        expect(new Set(top.map((a) => a.slug)).size).toBe(top.length);
        expect(top.every((a) => a[group].includes(slug))).toBe(true);
      }
    }
  });

  it("exports every list page, preserves all article URLs, and encodes search queries", async () => {
    const articles = await repo.listArticles();
    const routes = await listSiteRoutes(repo);
    const pages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
    expect(routes.filter((r) => /^\/articles\/page\//.test(r))).toHaveLength(pages - 1);
    const flattened = Array.from({ length: pages }, (_, i) => articles.slice(i * ARTICLES_PER_PAGE, (i + 1) * ARTICLES_PER_PAGE)).flat();
    expect(flattened.map((a) => a.slug)).toEqual(articles.map((a) => a.slug));
    for (const a of articles) expect(routes).toContain(`/${a.kind === "news" ? "news" : "articles"}/${a.slug}`);
    expect(articlePagePath(1)).toBe("/articles");
    expect(new URL(articlePagePath(2, "事務 & 休み"), "https://media.example.jp").searchParams.get("q")).toBe("事務 & 休み");
    expect(parseArticlePage("2")).toBe(2);
    for (const value of ["0", "-1", "02", "2e3", "2a", "9007199254740992"]) expect(parseArticlePage(value)).toBeNull();
  });

  it("uses each hub's actual article update dates", async () => {
    const articles = await repo.listArticles();
    expect(latestArticleDate([])).toBeUndefined();
    expect(latestArticleDate(articles)).toBe(articles.map((a) => a.updatedAt).sort().at(-1));
  });
});

describe("site URL validation", () => {
  it("allows local private previews but rejects local or malformed public canonicals", () => {
    expect(resolveSiteUrl(undefined, false)).toBe("http://localhost:3000");
    expect(resolveSiteUrl("http://127.0.0.1:3100/", false)).toBe("http://127.0.0.1:3100");
    expect(resolveSiteUrl("https://media.example.jp/", true)).toBe("https://media.example.jp");
    for (const value of [undefined, "http://media.example.jp", "https://localhost", "https://127.0.0.1", "https://192.168.1.2", "https://demo.test", "https://[::1]"]) expect(() => resolveSiteUrl(value, true)).toThrow();
    for (const value of ["ftp://media.example.jp", "https://user:pass@media.example.jp", "https://media.example.jp/path", "https://media.example.jp?q=x", "https://media.example.jp#x"]) expect(() => resolveSiteUrl(value, false)).toThrow();
  });
});
