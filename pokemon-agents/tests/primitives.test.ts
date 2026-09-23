import { describe, expect, test } from "bun:test";
import { baseComponents } from "../web/components/design-tokens";
import { actionBar, button, card, emptyState, kpiTile, sectionHeader, statusBadge } from "../web/components/primitives";

const injection = `<img src=x onerror="alert(1)">&'`;

describe("PRODUCT-UI-REDESIGN01 server-rendered primitives", () => {
  test("escapes user-controlled text in every primitive", () => {
    const outputs = [
      card({ title: injection, body: injection, eyebrow: injection }),
      kpiTile({ label: injection, value: injection, detail: injection }),
      statusBadge({ status: "ok", icon: injection, label: injection }),
      button({ label: injection }),
      emptyState({ title: injection, description: injection }),
      sectionHeader({ title: injection, description: injection, eyebrow: injection }),
      actionBar({ label: injection, actions: [{ label: injection }] }),
    ];
    for (const html of outputs) {
      expect(html).not.toContain("<img");
      expect(html).not.toContain('onerror="alert(1)"');
      expect(html).toContain("&lt;img");
    }
  });

  test("requires and renders a status icon plus visible label", () => {
    const html = statusBadge({ status: "warn", icon: "!", label: "確認" });
    expect(html).toContain('aria-hidden="true">!</span>');
    expect(html).toContain('class="t-badge__label">確認</span>');
    expect(() => statusBadge({ status: "warn", icon: "", label: "確認" })).toThrow();
    expect(() => statusBadge({ status: "warn", icon: "!", label: "" })).toThrow();
  });

  test("marks KPI values for tabular numeric presentation", () => {
    expect(kpiTile({ label: "表示数", value: 123 })).toContain('class="t-kpi__value"');
    expect(baseComponents).toContain("font-variant-numeric: tabular-nums");
  });

  test("requires explicit destructive confirmation markup", () => {
    expect(() => button({ label: "削除", variant: "destructive" })).toThrow();
    const html = button({ label: "削除", variant: "destructive", confirmation: "本当に削除しますか" });
    expect(html).toContain('data-requires-confirmation="true"');
    expect(html).toContain('class="t-destructive__confirmation" hidden');
    expect(html).toContain("本当に削除しますか");
  });
});
