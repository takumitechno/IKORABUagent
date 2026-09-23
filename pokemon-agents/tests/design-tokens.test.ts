import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { baseComponents, designTokens } from "../web/components/design-tokens";
import { customerDashboardStyles } from "../web/components/customer-dashboard-visuals";
import { renderLayout, statusBadge as legacyStatusBadge } from "../web/components/layout";

const root = resolve(import.meta.dir, "..", "..");
const serverSource = readFileSync(resolve(root, "pokemon-agents/web/server.ts"), "utf8");

describe("PRODUCT-UI-REDESIGN01 design system", () => {
  test("defines the fixed dark-first and light brand tokens", () => {
    expect(designTokens).toContain("--t-bg: #0b0f14");
    expect(designTokens).toContain("--t-brand: #6f93ff");
    expect(designTokens).toContain('html[data-customer-theme="light"]');
    expect(designTokens).toContain("--t-bg: #f5f7fa");
    expect(designTokens).toContain("--t-brand: #2f57d0");
  });

  test("defines all four semantic status families", () => {
    for (const status of ["ok", "warn", "serious", "critical"]) {
      expect(designTokens).toContain(`--t-${status}:`);
      expect(designTokens).toContain(`--t-${status}-ink:`);
      expect(designTokens).toContain(`--t-${status}-soft:`);
      expect(baseComponents).toContain(`.t-badge--${status}`);
    }
  });

  test("provides focus, coarse pointer, and reduced-motion safeguards", () => {
    expect(baseComponents).toContain(":focus-visible");
    expect(baseComponents).toContain("(pointer: coarse)");
    expect(baseComponents).toContain("44px");
    expect(baseComponents).toContain("(pointer: coarse) { button, input, select, textarea");
    expect(baseComponents).toContain("prefers-reduced-motion: reduce");
    expect(baseComponents).toContain("animation-duration: .01ms !important");
    expect(baseComponents).toContain("transition-duration: .01ms !important");
    expect(baseComponents).toContain("view-transition-name: none !important");
  });

  test("has no font-size below 12px in the Stage A stylesheet scope", () => {
    const css = `${designTokens}\n${baseComponents}\n${customerDashboardStyles}\n${serverSource.slice(serverSource.indexOf("function stylesheet()"))}`;
    const sizes = [...css.matchAll(/font-size:\s*([0-9]+(?:\.[0-9]+)?)px/g)].map((match) => Number(match[1]));
    expect(sizes.length).toBeGreaterThan(0);
    expect(sizes.filter((size) => size < 12)).toEqual([]);
  });

  test("removes legacy product tokens from active Stage A styles", () => {
    const activeStyles = `${designTokens}\n${baseComponents}\n${customerDashboardStyles}\n${serverSource.slice(serverSource.indexOf("function stylesheet()"))}`;
    expect(activeStyles).not.toContain("--ios-");
    expect(activeStyles).not.toContain("--brand");
    expect(customerDashboardStyles).not.toContain("--c-");
    expect(designTokens).toContain("--c-panel: var(--t-surface)");
    expect(designTokens).toContain("--c-brand: var(--t-brand)");
  });

  test("unifies chapter decoration on the product brand", () => {
    expect(baseComponents).toContain("--chapter-accent: var(--t-brand) !important");
    expect(baseComponents).toContain("--report-accent: var(--t-brand) !important");
    expect(customerDashboardStyles).not.toMatch(/\.actual-metric[^\n]*var\(--t-(?:ok|warn)\)/);
    expect(customerDashboardStyles).not.toMatch(/\.analysis-box\.(?:fact|unknown)[^\n]*var\(--t-(?:ok|warn)\)/);
  });

  test("renders customer and internal shell brands without the retired name", () => {
    const customer = renderLayout({ title: "Customer", body: "", currentPath: "/" });
    const internal = renderLayout({ title: "Internal", body: "", currentPath: "/internal" });
    expect(customer).toContain("Takumi Technologies");
    expect(customer).toContain("AI SNS運用");
    expect(internal).toContain("Takumi Technologies HQ");
    expect(internal).toContain("Mission Control");
    expect(customer.toLowerCase()).not.toContain("capsell");
    expect(internal.toLowerCase()).not.toContain("capsell");
  });

  test("keeps legacy status output accessible with icon and label", () => {
    const html = legacyStatusBadge("completed");
    expect(html).toContain('aria-hidden="true">✓</span>');
    expect(html).toContain("完了");
  });

  test("keeps the server-rendered architecture dependency-free", () => {
    const layoutSource = readFileSync(resolve(root, "pokemon-agents/web/components/layout.ts"), "utf8");
    const files = readdirSync(resolve(root, "pokemon-agents"), { recursive: true })
      .map(String).map((path) => path.replaceAll("\\", "/"));
    const foundationSource = [
      "design-tokens.ts", "primitives.ts", "layout.ts", "customer-dashboard-visuals.ts",
    ].map((name) => readFileSync(resolve(root, "pokemon-agents/web/components", name), "utf8")).join("\n");
    expect(files.filter((path) => path.endsWith("package.json"))).toEqual([]);
    expect(files.filter((path) => /\.(?:tsx|jsx)$/.test(path))).toEqual([]);
    const foundationLower = foundationSource.toLowerCase();
    for (const dependency of ['from "react"', "from 'react'", "vite.config", "webpack", "framer-motion", "motion/react"]) {
      expect(foundationLower).not.toContain(dependency);
    }
    expect(layoutSource).not.toContain("cdn.tailwindcss.com");
    expect(layoutSource).not.toContain("tailwind.config");
  });
});
