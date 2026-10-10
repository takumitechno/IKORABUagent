import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { listSiteRoutes } from "../scripts/site-routes";
import { LocalContentRepository } from "@/lib/content/local-repository";
import { CONSULTATION_APPLY_PATH } from "@/lib/consultation";

it("exports the safe consultation destination and uses case-insensitive unique Markdown names", async () => {
  const routes = await listSiteRoutes(new LocalContentRepository(path.join(process.cwd(), "content")));
  expect(routes).toContain(CONSULTATION_APPLY_PATH);
  for (const route of routes.filter((r) => !r.match(/^\/(articles|news|jobs|situations|concerns|categories)\//))) {
    expect(fs.existsSync(path.join(process.cwd(), `src/app${route === "/" ? "" : route}/page.tsx`))).toBe(true);
  }
  const names = ["PAGES.md", "_layout.md", ...routes.map((r) => r === "/" ? "index.md" : r.slice(1) + ".md")].map((s) => s.toLowerCase());
  expect(new Set(names).size).toBe(names.length);
});
