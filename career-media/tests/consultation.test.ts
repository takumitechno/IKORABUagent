import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { partner } from "@/config/partner";
import { buildConsultationUrl } from "@/lib/consultation";

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

describe("consultation flow (partner config)", () => {
  it("builds the CTA URL from partner config with tracking params", () => {
    const url = new URL(buildConsultationUrl("article-bottom", "agent-mendan-mae"));
    expect(`${url.origin}${url.pathname}`).toBe(new URL(partner.consultationUrl).origin + new URL(partner.consultationUrl).pathname);
    expect(url.searchParams.get("utm_campaign")).toBe(partner.campaignId);
    expect(url.searchParams.get("utm_content")).toBe("article-bottom__agent-mendan-mae");
    expect(url.searchParams.get("utm_source")).toBe("owned_media");
  });

  it("keeps the LP URL, company name and license number in exactly one place (src/config/partner.ts)", () => {
    const files = walk(path.join(process.cwd(), "src")).filter((f) => /\.(ts|tsx|css)$/.test(f));
    const lpHost = new URL(partner.consultationUrl).host;
    const offenders = files.filter((f) => !f.endsWith(path.join("config", "partner.ts"))).filter((f) => {
      const s = fs.readFileSync(f, "utf8");
      return s.includes(lpHost) || s.includes("make-career.co.jp") || s.includes(partner.licenseNumber) || s.includes("MakeCareer株式会社");
    });
    expect(offenders).toEqual([]);
  });

  it("does not hardcode the partner into article content", () => {
    const files = walk(path.join(process.cwd(), "content")).filter((f) => f.endsWith(".md"));
    for (const f of files) expect(fs.readFileSync(f, "utf8")).not.toMatch(/make-career\.co\.jp|MakeCareer株式会社|13-ユ-313746/);
  });

  it("stays unindexable until brand usage is approved", async () => {
    expect(partner.brandUsageApproved).toBe(false);
    const { site } = await import("@/config/site");
    expect(site.indexable).toBe(false);
  });
});
