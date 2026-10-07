import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { salesDemoEnabled } from "@/config/sales";
import { LocalContentRepository } from "@/lib/content/local-repository";
import { extractNumbers } from "@/lib/figures";
import { fixedTotal, paymentScenario, PILOT, workloadTotal } from "@/lib/sales/proposal";
import { RUNBOOK } from "@/lib/sales/runbook";
import { SNS_THEMES, type Slide } from "@/lib/sales/sns";

const repo = new LocalContentRepository(path.join(process.cwd(), "content"), () => new Date("2026-10-07T12:00:00Z"));
const slideText = (s: Slide): string => {
  const l = s.layout;
  switch (l.kind) {
    case "cover": return `${l.hook}\n${l.sub}`;
    case "text": return [l.heading, ...l.lines].join("\n");
    case "compare": return [l.heading, l.left.label, ...l.left.items, l.right.label, ...l.right.items, l.arrow ?? ""].join("\n");
    case "rows": return [l.heading, ...l.rows.flat(), l.note ?? ""].join("\n");
    case "stats": return [l.heading, ...l.stats.flatMap((x) => [x.value, x.unit ?? "", x.label]), l.note ?? ""].join("\n");
    case "steps": return [l.heading, ...l.steps.flatMap((x) => [x.label, x.text]), l.note ?? ""].join("\n");
    case "cta": return "";
  }
};

describe("sales demo (meeting-only pages)", () => {
  it("is off unless SALES_DEMO=1, and never listed in the sitemap", () => {
    expect(salesDemoEnabled).toBe(false);
    expect(fs.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf8")).not.toContain("/sales");
    expect(fs.readFileSync(path.join(process.cwd(), "src/app/sales/layout.tsx"), "utf8")).toMatch(/if \(!salesDemoEnabled\) notFound\(\)/);
  });

  it("links each SNS theme to a published article and an existing journey", async () => {
    const published = new Set((await repo.listArticles()).map((a) => a.slug));
    for (const t of SNS_THEMES) expect(published, t.web.articleSlug).toContain(t.web.articleSlug);
  });

  it("only uses numbers in the carousel that appear in the linked article (no invented figures)", async () => {
    for (const t of SNS_THEMES) {
      const article = await repo.getArticle(t.web.articleSlug);
      const allowed = new Set(extractNumbers(`${article!.body}\n${article!.summary}`));
      for (const slide of t.carousel.slides) {
        for (const n of extractNumbers(slideText(slide))) expect(allowed, `theme ${t.id}: ${n}`).toContain(n);
      }
    }
  });

  it("labels every SNS output as an unpublished draft and invents no account metrics", () => {
    const text = JSON.stringify(SNS_THEMES);
    expect(text).not.toMatch(/フォロワー\d|\d+(万)?(いいね|再生|保存数|フォロワー)|インプレッション\d/);
    expect(fs.readFileSync(path.join(process.cwd(), "src/components/sales/CarouselSlide.tsx"), "utf8")).toContain("投稿案・未公開");
    for (const t of SNS_THEMES) expect(t.reel.notes.join()).toContain("制作見本");
  });

  it("computes the pilot price examples correctly (not a forecast)", () => {
    expect(fixedTotal).toBe(250_000);
    expect(PILOT.performanceFeePerMeeting).toBe(12_000);
    expect([0, 10, 20, 30].map((n) => paymentScenario(n).total)).toEqual([250_000, 370_000, 490_000, 610_000]);
    expect(paymentScenario(0).perMeeting).toBeNull();
    expect(paymentScenario(10).perMeeting).toBe(37_000);
    expect(workloadTotal).toBeGreaterThanOrEqual(10);
    expect(workloadTotal).toBeLessThanOrEqual(12);
  });

  it("runs the meeting demo through real pages only", () => {
    for (const step of RUNBOOK) expect(step.href.startsWith("/")).toBe(true);
    expect(RUNBOOK[0].href).toBe("/");
  });
});
