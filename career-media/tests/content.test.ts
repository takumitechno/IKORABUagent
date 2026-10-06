import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isPubliclyVisible } from "@/lib/content/parse";
import { LocalContentRepository, loadAllArticles } from "@/lib/content/local-repository";
import { mapArticleRow } from "@/lib/content/supabase-repository";

const repo = new LocalContentRepository(path.join(process.cwd(), "content"), () => new Date("2026-10-06T12:00:00Z"));

describe("content repository (status-based publishing)", () => {
  it("ships at least 8 published articles and a news hub", async () => {
    expect((await repo.listArticles({ kind: "article" })).length).toBeGreaterThanOrEqual(8);
    expect((await repo.listArticles({ kind: "news" })).length).toBeGreaterThanOrEqual(2);
  });

  it("never exposes draft / review articles even though they have a body", async () => {
    const all = loadAllArticles();
    const hidden = all.filter((a) => a.status !== "published");
    expect(hidden.map((a) => a.status).sort()).toEqual(["draft", "review"]);
    for (const a of hidden) {
      expect(a.body.length).toBeGreaterThan(0);
      expect(await repo.getArticle(a.slug)).toBeNull();
    }
    const listed = (await repo.listArticles()).map((a) => a.slug);
    for (const a of hidden) expect(listed).not.toContain(a.slug);
  });

  it("hides scheduled (future) and incomplete published records", () => {
    const base = { status: "published" as const, publishedAt: "2026-10-01", reviewedAt: "2026-10-01", informationCheckedAt: "2026-10-01", sources: [{ title: "a", publisher: "b", url: "https://e.com", accessedAt: "2026-10-01" }] };
    const now = new Date("2026-10-06T00:00:00Z");
    expect(isPubliclyVisible(base, now)).toBe(true);
    expect(isPubliclyVisible({ ...base, publishedAt: "2026-12-01" }, now)).toBe(false);
    expect(isPubliclyVisible({ ...base, reviewedAt: null }, now)).toBe(false);
    expect(isPubliclyVisible({ ...base, sources: [] }, now)).toBe(false);
    expect(isPubliclyVisible({ ...base, status: "review" }, now)).toBe(false);
  });

  it("searches title/summary/body with AND semantics, published only", async () => {
    const results = await repo.search("研修");
    expect(results[0].slug).toBe("mikeiken-kenshu-kakunin");
    expect((await repo.search("研修 固定残業代")).length).toBeLessThan(results.length);
    expect(await repo.search("学歴不問")).toEqual([]); // draft にだけある語
    expect(await repo.search("   ")).toEqual([]);
  });

  it("does not leak research_notes into summaries", async () => {
    const list = await repo.listArticles();
    expect(list.every((a) => !("researchNotes" in a) && !("body" in a))).toBe(true);
  });

  it("filters by category", async () => {
    const list = await repo.listArticles({ category: "keiken" });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((a) => a.categories.includes("keiken"))).toBe(true);
  });

  it("maps Supabase rows (primary category first, sources ordered)", () => {
    const a = mapArticleRow({
      slug: "x",
      kind: "article",
      title: "t",
      summary: "s",
      body_md: "b",
      status: "published",
      featured: false,
      published_at: "2026-10-01T00:00:00+00:00",
      updated_at: "2026-10-02T00:00:00+00:00",
      reviewed_at: "2026-10-02T00:00:00+00:00",
      information_checked_at: "2026-10-02T00:00:00+00:00",
      related_slugs: [],
      faq: [{ q: "q", a: "a" }],
      news_meta: null,
      article_categories: [{ is_primary: false, categories: { slug: "junbi" } }, { is_primary: true, categories: { slug: "mikeiken" } }],
      article_sources: [{ title: "B", publisher: "p", url: "https://b", accessed_at: "2026-10-01", sort_order: 1 }, { title: "A", publisher: "p", url: "https://a", accessed_at: "2026-10-01", sort_order: 0 }],
    });
    expect(a.categories).toEqual(["mikeiken", "junbi"]);
    expect(a.sources.map((s) => s.title)).toEqual(["A", "B"]);
    expect(a.publishedAt).toBe("2026-10-01");
    expect(a.faq[0]).toEqual({ question: "q", answer: "a" });
  });

  it("the generated seed.sql is up to date with content/", () => {
    const seed = fs.readFileSync(path.join(process.cwd(), "supabase/seed.sql"), "utf8");
    for (const a of loadAllArticles()) expect(seed).toContain(`-- ${a.kind}: ${a.slug} (${a.status})`);
  });
});
