import path from "node:path";
import { describe, expect, it } from "vitest";
import { LocalContentRepository } from "@/lib/content/local-repository";
import { HERO_SHORTCUTS, ROLE_TO_COMPARISON, TAXONOMY, TAXONOMY_GROUPS, type TaxonomyGroup } from "@/lib/taxonomy";
import { getJobRole } from "@/lib/jobs";

const repo = new LocalContentRepository(path.join(process.cwd(), "content"), () => new Date("2026-10-06T12:00:00Z"));
const GROUPS: TaxonomyGroup[] = ["roles", "concerns", "situations"];

describe("entry points (職種 / 悩み / 今の状況)", () => {
  it("has the requested entry points with unique slugs", () => {
    expect(TAXONOMY.roles.map((t) => t.label)).toEqual(["営業", "事務", "カスタマーサポート", "ITサポート", "人事・採用", "販売・接客", "その他の職種"]);
    expect(TAXONOMY.concerns).toHaveLength(8);
    expect(TAXONOMY.situations).toHaveLength(8);
    for (const g of GROUPS) expect(new Set(TAXONOMY[g].map((t) => t.slug)).size).toBe(TAXONOMY[g].length);
  });

  it("uses reader-voice labels, not industry jargon or income labels", () => {
    const text = GROUPS.flatMap((g) => TAXONOMY[g].flatMap((t) => [t.label, t.heading, t.description])).join("\n");
    expect(text).not.toMatch(/市場価値|キャリア戦略|人的資本|ポータブルスキル|年収\s*\d+\s*万円?以下|低所得/);
  });

  it("hero shortcuts and job comparison links point to real hubs/roles", () => {
    for (const s of HERO_SHORTCUTS) {
      const m = s.href.match(/^\/(jobs|concerns|situations)\/([a-z0-9-]+)$/);
      expect(m).not.toBeNull();
      const group = (m![1] === "jobs" ? "roles" : m![1]) as TaxonomyGroup;
      expect(TAXONOMY[group].some((t) => t.slug === m![2])).toBe(true);
      expect(TAXONOMY_GROUPS[group].basePath).toBe(`/${m![1]}`);
    }
    for (const role of Object.values(ROLE_TO_COMPARISON)) expect(getJobRole(role)).toBeDefined();
  });

  it("every entry point has published content", async () => {
    for (const g of GROUPS) {
      for (const t of TAXONOMY[g]) {
        const list = await repo.listArticles({ tag: { group: g, slug: t.slug } });
        expect(list.length, `${g}/${t.slug}`).toBeGreaterThanOrEqual(2);
        expect(list.every((a) => a[g].includes(t.slug))).toBe(true);
      }
    }
  });

  it("filters recommended and featured", async () => {
    const recommended = await repo.listArticles({ recommended: true });
    expect(recommended.length).toBeGreaterThanOrEqual(4);
    expect(recommended.every((a) => a.recommended)).toBe(true);
    const featured = await repo.listArticles({ kind: "article", featured: true });
    expect(featured.length).toBeGreaterThanOrEqual(5);
  });
});
