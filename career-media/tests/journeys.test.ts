import path from "node:path";
import { describe, expect, it } from "vitest";
import { LocalContentRepository } from "@/lib/content/local-repository";
import { JOURNEYS, journeyArticleSlugs, journeyForArticle, journeyForHub, stepHref } from "@/lib/journeys";
import { TAXONOMY, taxonomyPath, type TaxonomyGroup } from "@/lib/taxonomy";

const repo = new LocalContentRepository(path.join(process.cwd(), "content"), () => new Date("2026-10-07T12:00:00Z"));
const hubPaths = new Set((["roles", "concerns", "situations"] as TaxonomyGroup[]).flatMap((g) => TAXONOMY[g].map((t) => taxonomyPath(g, t.slug))));

describe("reader journeys (3 meeting demo paths)", () => {
  it("defines the three journeys: 接客→オフィス, 給料+休日, フリーター", () => {
    expect(JOURNEYS.map((j) => j.id)).toEqual(["sekkyaku-office", "kyuryo-donichi", "freeter-hajimete"]);
    expect(new Set(JOURNEYS.map((j) => j.patternId)).size).toBe(3);
  });

  it("only uses published articles and existing hub pages", async () => {
    const published = new Set((await repo.listArticles()).map((a) => a.slug));
    for (const slug of journeyArticleSlugs()) expect(published, slug).toContain(slug);
    for (const j of JOURNEYS) for (const hub of j.hubs) expect(hubPaths, hub).toContain(hub);
  });

  it("gives value before consultation: articles, a comparison or check step, then an optional consult step with questions", () => {
    for (const j of JOURNEYS) {
      const kinds = j.steps.map((s) => s.kind);
      expect(kinds.filter((k) => k === "article").length).toBeGreaterThanOrEqual(3);
      expect(kinds).toContain("check");
      expect(kinds.at(-1)).toBe("consult");
      expect(kinds.indexOf("check")).toBeLessThan(kinds.indexOf("consult"));
      expect(j.questions.length).toBeGreaterThanOrEqual(3);
      // ステップのリンクはすべてサイト内
      for (const s of j.steps) expect(stepHref(s, j).startsWith("/")).toBe(true);
    }
  });

  it("finds the guide from its hub and an article's position in it", () => {
    expect(journeyForHub("/situations/sekkyaku")?.id).toBe("sekkyaku-office");
    expect(journeyForHub("/concerns/kyuryo")?.id).toBe("kyuryo-donichi");
    expect(journeyForHub("/situations/freeter")?.id).toBe("freeter-hajimete");
    expect(journeyForArticle("donichi-yasumi-nenshu-hikaku")).toMatchObject({ index: 2 });
    expect(journeyForArticle("ai-shigoto-mikeiken")).toBeUndefined();
  });

  it("does not use guarantee or labeling language in journey copy", () => {
    const text = JSON.stringify(JOURNEYS);
    expect(text).not.toMatch(/必ず|確実|保証|年収\d+万円以下|底辺|弱者/);
  });
});
