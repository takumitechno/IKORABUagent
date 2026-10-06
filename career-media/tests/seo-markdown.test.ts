import { describe, expect, it } from "vitest";
import path from "node:path";
import { LocalContentRepository } from "@/lib/content/local-repository";
import { renderMarkdown } from "@/lib/markdown";
import { articleCrumbs, articleJsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

const repo = new LocalContentRepository(path.join(process.cwd(), "content"), () => new Date("2026-10-06T12:00:00Z"));

describe("markdown rendering", () => {
  it("escapes raw HTML and drops javascript: links", () => {
    const { sections } = renderMarkdown('<script>alert(1)</script>\n\n[x](javascript:alert(1)) [ok](/articles/a)');
    const html = sections.join("");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("javascript:");
    expect(html).toContain('href="/articles/a"');
  });

  it("builds a TOC from h2 without duplicated numbering and splits for the inline CTA", () => {
    const md = "intro\n\n## 1. 最初\n\na\n\n## 2. 次\n\nb\n\n## 3. 最後\n\nc";
    const { headings, sections } = renderMarkdown(md);
    expect(headings.map((h) => h.text)).toEqual(["最初", "次", "最後"]);
    expect(sections).toHaveLength(2);
    expect(sections[1]).toContain('id="section-3"');
  });

  it("opens external links safely", () => {
    const html = renderMarkdown("[厚労省](https://www.mhlw.go.jp/)").sections[0];
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe("structured data", () => {
  it("emits Article JSON-LD with dates, publisher and citations", async () => {
    const a = (await repo.getArticle("agent-mendan-mae"))!;
    const ld = articleJsonLd(a) as Record<string, unknown>;
    expect(ld["@type"]).toBe("Article");
    expect(ld.datePublished).toBe(a.publishedAt);
    expect(ld.dateModified).toBe(a.updatedAt);
    expect((ld.citation as unknown[]).length).toBe(a.sources.length);
  });

  it("uses NewsArticle for news and puts news under /news in breadcrumbs", async () => {
    const n = (await repo.getArticle("news-roudou-jouken-meiji"))!;
    expect((articleJsonLd(n) as Record<string, unknown>)["@type"]).toBe("NewsArticle");
    const crumbs = articleCrumbs(n, await repo.listCategories());
    expect(crumbs[1].path).toBe("/news");
    expect((breadcrumbJsonLd(crumbs).itemListElement as unknown[]).length).toBe(3);
  });

  it("emits FAQ JSON-LD only when the page actually has FAQ", () => {
    expect(faqJsonLd({ faq: [] })).toBeNull();
    expect(faqJsonLd({ faq: [{ question: "q", answer: "a" }] })).not.toBeNull();
  });

  it("escapes < in JSON-LD", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });

  it("sets canonical and noindex while not approved", () => {
    const meta = pageMetadata({ title: "t", description: "d", path: "/jobs" });
    expect(String(meta.alternates?.canonical)).toMatch(/\/jobs$/);
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
