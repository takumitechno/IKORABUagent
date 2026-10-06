import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MOTIF_NAMES, motifsCss } from "@/lib/illustrations/motifs";
import { CATEGORY_SCENE, JOB_ROLE_SCENE, TAXONOMY_SCENE } from "@/lib/illustrations/scenes";
import { loadCategories } from "@/lib/content/local-repository";
import { JOB_ROLES } from "@/lib/jobs";
import { TAXONOMY, type TaxonomyGroup } from "@/lib/taxonomy";

describe("illustrations", () => {
  it("src/app/motifs.css is generated from motifs.ts (run `npm run motifs` after editing)", () => {
    const file = fs.readFileSync(path.join(__dirname, "../src/app/motifs.css"), "utf8");
    expect(file).toBe(motifsCss());
  });

  it("every entry tag, category and job role has an illustration, and tiles in one group do not repeat", () => {
    for (const group of Object.keys(TAXONOMY) as TaxonomyGroup[]) {
      const scenes = TAXONOMY[group].map((t) => TAXONOMY_SCENE[group][t.slug]);
      expect(scenes.every((s) => MOTIF_NAMES.includes(s))).toBe(true);
      expect(new Set(scenes).size).toBe(scenes.length);
    }
    for (const c of loadCategories()) expect(MOTIF_NAMES).toContain(CATEGORY_SCENE[c.slug]);
    for (const r of JOB_ROLES) expect(MOTIF_NAMES).toContain(JOB_ROLE_SCENE[r.slug]);
  });

  it("motifs are self-contained SVG (no external references or scripts)", () => {
    const css = motifsCss();
    expect(css).not.toMatch(/<script|%3Cscript|href=|xlink|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
  });
});
