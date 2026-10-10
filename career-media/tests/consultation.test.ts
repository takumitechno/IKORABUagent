import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { liveOutboundEnabled, partner, type PartnerConfig } from "@/config/partner";
import { buildConsultationUrl, consultationHref, CONSULTATION_APPLY_PATH } from "@/lib/consultation";

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

/** 商談用プレビュー（PARTNER_PROFILE=makecareer）の設定を、環境変数を切り替えて読み込む */
async function loadProfile(env: Record<string, string>) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  const config = await import("@/config/partner");
  const consultation = await import("@/lib/consultation");
  return { ...config, ...consultation };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("consultation flow (partner config)", () => {
  it("keeps the consultation button inside the site while live outbound is off (neutral demo)", () => {
    const href = buildConsultationUrl("article-bottom", "agent-mendan-mae");
    expect(href.startsWith(`${CONSULTATION_APPLY_PATH}?`)).toBe(true);
    expect(href).not.toMatch(/^https?:/);
    expect(new URLSearchParams(href.split("?")[1]).get("placement")).toBe("article-bottom__agent-mendan-mae");
    expect(liveOutboundEnabled()).toBe(false);
  });

  it("never sends the MakeCareer private demo to the real application page, even with the live switch set", async () => {
    const mc = await loadProfile({ PARTNER_PROFILE: "makecareer", PARTNER_LIVE_OUTBOUND: "on" });
    expect(mc.partner.profile).toBe("makecareer");
    expect(mc.partner.brandUsageApproved).toBe(false);
    expect(mc.partner.liveOutboundApproval).toBeNull();
    expect(mc.liveOutboundEnabled()).toBe(false);
    expect(mc.consultationMode).toBe("demo");
    for (const placement of ["header", "article-bottom", "check-result", "consultation-page"] as const) {
      const href = mc.buildConsultationUrl(placement, "x");
      expect(href.startsWith(mc.CONSULTATION_APPLY_PATH)).toBe(true);
      expect(href).not.toContain(new URL(mc.partner.liveConsultationUrl!).host);
    }
  });

  it("requires all three keys (brand approval, a human approval record and PARTNER_LIVE_OUTBOUND=on) for live outbound", () => {
    const base: PartnerConfig = { ...partner, liveConsultationUrl: "https://partner.example/apply", brandUsageApproved: true, liveOutboundApproval: { approvedBy: "担当者", approvedAt: "2026-11-01", reference: "契約書" } };
    const on = { PARTNER_LIVE_OUTBOUND: "on" };
    expect(liveOutboundEnabled(base, on)).toBe(true);
    expect(liveOutboundEnabled({ ...base, brandUsageApproved: false }, on)).toBe(false);
    expect(liveOutboundEnabled({ ...base, liveOutboundApproval: null }, on)).toBe(false);
    expect(liveOutboundEnabled(base, {})).toBe(false);
    expect(liveOutboundEnabled(base, { PARTNER_LIVE_OUTBOUND: "true" })).toBe(false);
    expect(liveOutboundEnabled({ ...base, liveConsultationUrl: null }, on)).toBe(false);

    // 3つそろったときだけ、申込ページに計測パラメータを付けて送る
    const url = new URL(consultationHref("article-bottom", "agent-mendan-mae", base, on));
    expect(`${url.origin}${url.pathname}`).toBe("https://partner.example/apply");
    expect(url.searchParams.get("utm_campaign")).toBe(base.campaignId);
    expect(url.searchParams.get("utm_content")).toBe("article-bottom__agent-mendan-mae");
    expect(url.searchParams.get("utm_source")).toBe("owned_media");
    expect(consultationHref("article-bottom", undefined, { ...base, liveOutboundApproval: null }, on).startsWith(CONSULTATION_APPLY_PATH)).toBe(true);
  });

  it("keeps company names, license numbers and LP URLs in exactly one place (src/config/partner.ts)", () => {
    const files = walk(path.join(process.cwd(), "src")).filter((f) => /\.(ts|tsx|css)$/.test(f));
    const identifiers = ["make-career.co.jp", "MakeCareer", "13-ユ-313746", "consultation.example"];
    const offenders = files
      .filter((f) => !f.endsWith(path.join("config", "partner.ts")))
      .flatMap((f) => {
        // 「TODO(正式公開前にMakeCareer確認が必要)」などのコメントは対象外（画面に出ないため）
        const code = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
        return identifiers.filter((id) => code.includes(id)).map((id) => `${path.relative(process.cwd(), f)}: ${id}`);
      });
    expect(offenders).toEqual([]);
  });

  it("does not render the real application URL anywhere except through buildConsultationUrl", () => {
    // 申込先 URL を使ってよいのは lib/consultation.ts（本番送客の判定つき）だけ
    const users = walk(path.join(process.cwd(), "src"))
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith(path.join("config", "partner.ts")))
      .filter((f) => fs.readFileSync(f, "utf8").includes("liveConsultationUrl"))
      .map((f) => path.relative(process.cwd(), f));
    expect(users).toEqual([path.join("src", "lib", "consultation.ts")]);
  });

  it("uses the neutral demo by default (no real company name or license number; does not pose as a licensed agency)", () => {
    expect(partner.profile).toBe("neutral");
    const visible = [partner.mediaName, partner.brandName, partner.operatorDisplay, partner.operatorShort, partner.partnerName, partner.disclosure, partner.previewNotice].join("\n");
    expect(visible).not.toMatch(/MakeCareer|make-career|13-ユ-313746/);
    expect(partner.licenseNumber).toBeNull();
    expect(partner.liveConsultationUrl).toBeNull();
    // 中立デモでは、架空の人材紹介会社が運営しているように見せない
    expect(partner.operatorDisplay).not.toMatch(/人材紹介会社/);
    expect(partner.operatorDisplay).toMatch(/デモ/);
  });

  it("shows only the license number confirmed on the company profile in the MakeCareer private demo", async () => {
    const mc = await loadProfile({ PARTNER_PROFILE: "makecareer" });
    expect(mc.partner.licenseNumber).toBe("13-ユ-313746");
    expect(mc.partner.previewNotice).toMatch(/非公開/);
    expect(mc.partner.disclosure).toMatch(/正式提携.*前|非公開/);
  });

  it("does not hardcode the partner into article content", () => {
    const files = walk(path.join(process.cwd(), "content")).filter((f) => f.endsWith(".md"));
    for (const f of files) expect(fs.readFileSync(f, "utf8")).not.toMatch(/make-career\.co\.jp|MakeCareer|13-ユ-313746/);
  });

  it("stays unindexable until brand usage is approved", async () => {
    expect(partner.brandUsageApproved).toBe(false);
    const { site } = await import("@/config/site");
    expect(site.indexable).toBe(false);
    expect(site.sampleContent).toBe(true);
  });
});
