import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  CUSTOMER_HOME_NAV,
  buildCustomerNav,
  buildHqNav,
  customerEditorialNavScript,
  renderLayout,
  resolveCustomerNavKey,
} from "../web/components/layout";
import { customerDashboardStyles, customerHomeStyles } from "../web/components/customer-dashboard-visuals";

const render = (currentPath: string, internalAccessAllowed = false) => renderLayout({
  title: "test",
  body: '<div class="test-body">test</div>',
  currentPath,
  internalAccessAllowed,
});

describe("PRODUCT-UI-REDESIGN01 editorial navigation rail", () => {
  test("uses the five canonical customer chapters and resolves one location", () => {
    expect(CUSTOMER_HOME_NAV.map(({ key, href, label }) => ({ key, href, label }))).toEqual([
      { key: "today", href: "/#today", label: "今日" },
      { key: "schedule", href: "/#schedule", label: "投稿予定" },
      { key: "performance", href: "/#performance", label: "投稿と実績" },
      { key: "ai-improvement", href: "/#ai-improvement", label: "AI改善" },
      { key: "manual-analysis", href: "/#manual-analysis", label: "公開済み投稿" },
    ]);
    for (const item of CUSTOMER_HOME_NAV) expect(resolveCustomerNavKey("/", `#${item.key}`)).toBe(item.key);
    expect(resolveCustomerNavKey("/", "")).toBe("today");
    expect(resolveCustomerNavKey("/", "#unknown")).toBe("today");
    expect(resolveCustomerNavKey("/improvement", "")).toBe("improvement-report");
    expect(resolveCustomerNavKey("/internal", "#today")).toBeNull();
  });

  test("renders exactly one current customer item on each server route", () => {
    for (const path of ["/", "/improvement"] as const) {
      const nav = buildCustomerNav(path).flatMap((section) => section.items);
      expect(nav.filter((item) => item.active)).toHaveLength(1);
      const html = render(path, true);
      expect(html.match(/class="nav-item active"/g)).toHaveLength(1);
      expect(html.match(/aria-current="(?:location|page)"/g)).toHaveLength(1);
      expect(html.includes("オフィスに戻る")).toBe(true);
    }
  });

  test("uses real HQ destinations rather than customer anchors", () => {
    const items = buildHqNav("/agents?view=org").flatMap((section) => section.items);
    expect(items.map((item) => item.href)).toEqual([
      "/agents", "/schedules", "/logs", "/reflections", "/reports",
      "/hypotheses", "/improvements", "/knowledge", "/costs",
    ]);
    expect(items.filter((item) => item.active).map((item) => item.key)).toEqual(["agents"]);
    expect(items.some((item) => item.href.includes("#"))).toBe(false);
    const html = render("/agents?view=org");
    expect(html.includes("HQモバイルナビゲーション")).toBe(true);
    expect(html.includes("現在地 · エージェント")).toBe(true);
  });

  test("synchronizes customer selection for click, hash history and mobile visibility", () => {
    const script = customerEditorialNavScript();
    for (const contract of [
      "removeAttribute('aria-current')",
      "addEventListener('click'",
      "addEventListener('hashchange'",
      "addEventListener('popstate'",
      "scrollIntoView({ behavior: 'auto'",
      "sync();",
    ]) expect(script.includes(contract)).toBe(true);
    expect(script.includes("setInterval")).toBe(false);
  });

  test("uses persistent brand-soft selection, restrained motion and a mobile rail", () => {
    const serverSource = readFileSync(new URL("../web/server.ts", import.meta.url), "utf8");
    expect(serverSource.includes("border-left: 3px solid transparent")).toBe(true);
    expect(serverSource.includes("background: var(--t-brand-soft)")).toBe(true);
    expect(serverSource.includes("border-left-color: var(--t-brand)")).toBe(true);
    expect(serverSource.includes("background-color 0.16s ease")).toBe(true);
    expect(serverSource.includes("@media (prefers-reduced-motion: reduce)")).toBe(true);
    expect(customerDashboardStyles.includes("overflow-x:auto;overflow-y:hidden;scrollbar-width:none")).toBe(true);
    expect(customerDashboardStyles.includes("min-height:44px;flex:0 0 auto;white-space:nowrap")).toBe(true);
    expect(customerDashboardStyles.includes(".sidebar-nav::-webkit-scrollbar{display:none}")).toBe(true);
    expect(customerHomeStyles.includes(".sidebar-nav{display:none}")).toBe(false);
  });

  test("removes static footer noise while keeping route-specific content", () => {
    const customer = render("/");
    const hq = render("/internal");
    for (const html of [customer, hq]) {
      expect(html.includes("sidebar-footer")).toBe(false);
      expect(html.includes("運用ステータス")).toBe(false);
      expect(html.includes("Threads 接続済み")).toBe(false);
    }
    const operationsSource = readFileSync(new URL("../web/routes/internal-operations.ts", import.meta.url), "utf8");
    expect(operationsSource.includes("=LOVE Agent OS · Internal Operations")).toBe(false);
    expect(operationsSource.includes("Bridge/API read only")).toBe(false);
  });
});
