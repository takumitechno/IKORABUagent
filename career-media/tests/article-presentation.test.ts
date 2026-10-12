import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { articleCardTitle, articleCover } from "@/lib/article-presentation";
import { LocalContentRepository } from "@/lib/content/local-repository";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

const repo = new LocalContentRepository(path.join(process.cwd(), "content"), () => new Date("2026-10-12T12:00:00Z"));

describe("article presentation and social previews", () => {
  it("keeps SEO titles intact while supporting short display copy and empty-copy fallback", () => {
    const original = { title: "検索向けの正式タイトル", eyecatch: ["短い", "見出し"] };
    expect(articleCardTitle(original)).toBe("短い見出し");
    expect(original.title).toBe("検索向けの正式タイトル");
    expect(articleCardTitle({ ...original, eyecatch: [] })).toBe(original.title);
    expect(articleCardTitle({ ...original, eyecatch: [" "] })).toBe(original.title);
  });

  it("selects existing local covers for all public content and safely falls back for an unknown category", async () => {
    for (const article of await repo.listArticles()) {
      const cover = articleCover(article);
      expect(cover?.status, article.slug).toBe("selected");
      expect(fs.existsSync(path.join(process.cwd(), "public", cover!.src))).toBe(true);
    }
    expect(articleCover({ slug: "unknown", kind: "article", categories: ["unknown"] })).toBeNull();
  });

  it("uses the same article cover in OGP, Twitter and structured data without changing title or indexing safety", async () => {
    const article = (await repo.getArticle("sekkyaku-keiken-ikasu"))!;
    const image = articleCover(article)!;
    const meta = pageMetadata({ title: article.title, description: article.summary, path: "/articles/" + article.slug, type: "article", image });
    const ld = articleJsonLd(article);
    expect(meta.title).toBe(article.title);
    expect(ld.headline).toBe(article.title);
    expect(JSON.stringify(meta.openGraph)).toContain(image.src);
    expect(JSON.stringify(meta.twitter)).toContain(image.src);
    expect(ld.image[0]).toContain(image.src);
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
