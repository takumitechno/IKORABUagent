import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderLayout } from "../web/components/layout";

const root = resolve(import.meta.dir, "..", "..");

describe("BRAND01 site branding", () => {
  test("customer shell uses the product brand without internal HQ wording", () => {
    const html = renderLayout({ title: "Dashboard", body: "<main>customer</main>", currentPath: "/" });
    expect(html).toContain("<title>IKORABU | SNS運用</title>");
    expect(html).toContain('<span class="brand-name">IKORABU</span>');
    expect(html).toContain('<div class="brand-sub">SNS運用</div>');
    expect(html).not.toContain("Takumi Technologies");
    expect(html).toContain("prefers-color-scheme: dark");
    expect(html).toContain("takumi-customer-theme");
    expect(html).not.toContain('<svg width="16" height="16" viewBox="0 0 24 24"');
    expect(html).not.toContain("=LOVE Agent OS");
    expect(html).not.toContain("Pokemon Agents");
    expect(html).not.toContain("トップページ");
    expect(html).not.toContain('href="/internal"');
  });

  test("customer shell never exposes the internal office return", () => {
    const internalHtml = renderLayout({
      title: "Dashboard",
      body: "<main>customer</main>",
      currentPath: "/",
      internalAccessAllowed: true,
    });
    expect(internalHtml).not.toContain("オフィスに戻る");
    expect(internalHtml).not.toContain('href="/internal"');

    const customerHtml = renderLayout({
      title: "Dashboard",
      body: "<main>customer</main>",
      currentPath: "/",
      internalAccessAllowed: false,
    });
    expect(customerHtml).not.toContain("オフィスに戻る");
    expect(customerHtml).not.toContain('href="/internal"');
  });

  test("internal shell keeps Agent OS context under the company brand", () => {
    const html = renderLayout({ title: "=LOVE Agent OS", body: "<main>internal</main>", currentPath: "/internal" });
    expect(html).toContain("<title>Takumi Technologies HQ | Mission Control</title>");
    expect(html).toContain('<span class="brand-name">Takumi Technologies HQ</span>');
    expect(html).toContain('<div class="brand-sub">Mission Control</div>');
    expect(html).toContain('href="/internal" class="sidebar-header"');
    expect(html).toContain('href="/internal" class="nav-item internal-home-button active"');
    expect(html).toContain('data-nav="home" aria-current="page"');
    expect(html).toContain('<span class="nav-label">トップページ</span>');
    expect(html).not.toContain("takumi-customer-theme");
    expect(html).not.toContain("Pokemon Agents");
  });

  test("internal home button remains visible and inactive on other internal pages", () => {
    const html = renderLayout({ title: "エージェント", body: "<main>agents</main>", currentPath: "/agents?view=org" });
    expect(html).toContain('href="/internal" class="nav-item internal-home-button "');
    expect(html).not.toContain('data-nav="home" aria-current="page"');
    expect(html).toContain('<span class="nav-label">トップページ</span>');
  });

  test("internal theme switch is shared and remains separate from the customer preference", () => {
    const internal = renderLayout({ title: "エージェント", body: "<main>agents</main>", currentPath: "/agents?view=org" });
    const operator = renderLayout({ title: "運用状況", body: "<main>operator</main>", currentPath: "/operator" });
    const customer = renderLayout({ title: "Dashboard", body: "<main>customer</main>", currentPath: "/" });
    for (const html of [internal, operator]) {
      expect(html).toContain('id="operator-theme-toggle"');
      expect(html).toContain("takumi-operator-theme");
      expect(html).toContain("document.documentElement.dataset.theme");
    }
    expect(customer).not.toContain('id="operator-theme-toggle"');
    expect(customer).not.toContain("takumi-operator-theme");
    expect(customer).toContain("takumi-customer-theme");
  });

  test("canonical logo and compact mark assets are present", () => {
    const original = readFileSync(resolve(root, "pokemon-agents/web/public/brand/takumi-technologies-logo.jpg"));
    const mark = readFileSync(resolve(root, "pokemon-agents/web/public/brand/takumi-mark.png"));
    const compactMark = readFileSync(resolve(root, "pokemon-agents/web/public/brand/takumi-mark-compact.png"));
    expect(original.subarray(0, 3).toString("hex")).toBe("ffd8ff");
    expect(mark.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(compactMark.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });
});
