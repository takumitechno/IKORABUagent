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

  it("keeps company names, license numbers and LP URLs in exactly one place (src/config/partner.ts)", () => {
    const files = walk(path.join(process.cwd(), "src")).filter((f) => /\.(ts|tsx|css)$/.test(f));
    const identifiers = ["make-career.co.jp", "MakeCareer", "13-ユ-313746", "consultation.example", new URL(partner.consultationUrl).host];
    const offenders = files
      .filter((f) => !f.endsWith(path.join("config", "partner.ts")))
      .flatMap((f) => {
        // 「TODO(正式公開前にMakeCareer確認が必要)」などのコメントは対象外（画面に出ないため）
        const code = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
        return identifiers.filter((id) => code.includes(id)).map((id) => `${path.relative(process.cwd(), f)}: ${id}`);
      });
    expect(offenders).toEqual([]);
  });

  it("uses the neutral brand by default (no real company name, logo text or license number on screen)", () => {
    expect(partner.profile).toBe("neutral");
    const visible = [partner.mediaName, partner.brandName, partner.operatorDisplay, partner.partnerName, partner.disclosure, partner.previewNotice].join("\n");
    expect(visible).not.toMatch(/MakeCareer|make-career|13-ユ-313746/);
    expect(partner.licenseNumber).toBeNull();
    expect(partner.consultationMode).toBe("demo");
  });

  it("does not hardcode the partner into article content", () => {
    const files = walk(path.join(process.cwd(), "content")).filter((f) => f.endsWith(".md"));
    for (const f of files) expect(fs.readFileSync(f, "utf8")).not.toMatch(/make-career\.co\.jp|MakeCareer|13-ユ-313746/);
  });

  it("stays unindexable until brand usage is approved", async () => {
    expect(partner.brandUsageApproved).toBe(false);
    const { site } = await import("@/config/site");
    expect(site.indexable).toBe(false);
  });
});
