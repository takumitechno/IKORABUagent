import { describe, expect, test } from "bun:test";
import { renderLayout } from "../web/components/layout";
import { renderOverviewAggregate } from "../web/routes/overview";
import {
  CUSTOMER_WORKSPACE_COOKIE,
  customerSessionContract,
  customerWorkspaceStyles,
  customerWorkspaceViews,
  customerWorkspacesContract,
  renderCustomerLogin,
  renderWorkspaceChoice,
  selectCustomerWorkspace,
  workspaceSelectorToken,
} from "../web/lib/customer-workspaces";
import type { ResolvedTenantIdentity } from "../web/lib/dashboard-tenant";
import type { ThreadsAccountOption, ThreadsDashboardData } from "../web/lib/threads-dashboard";

const secret = "customer-workspace-test-secret-with-32-characters";
const identity: ResolvedTenantIdentity = {
  userId: "usr_customer", organizationId: "org_customer", role: "editor",
};
const otherIdentity: ResolvedTenantIdentity = {
  userId: "usr_other", organizationId: "org_other", role: "editor",
};
const account = (
  accountId: string, displayName: string, handle: string,
): ThreadsAccountOption => ({ accountId, displayName, handle, accountStatus: "active" });
const accounts = [
  account("acct_8ssana", "紗凪｜恋愛診断士", "8sssana"),
  account("acct_taku_ai_tech", "タク｜AI仕事術×副業", "taku_ai_tech"),
];

function request(path = "/", token?: string): Request {
  return new Request(`https://app.example.test${path}`, token ? {
    headers: { Cookie: `${CUSTOMER_WORKSPACE_COOKIE}=${token}` },
  } : undefined);
}

describe("CUSTOMER-AUTH01 workspace selection", () => {
  test("single-account customers enter directly and multi-account customers default to all", () => {
    expect(selectCustomerWorkspace(request(), identity, [accounts[0]], secret).selected)
      .toEqual(accounts[0]);
    expect(selectCustomerWorkspace(request(), identity, [], secret).selected).toBeNull();
    expect(selectCustomerWorkspace(request(), identity, accounts, secret)).toMatchObject({
      selected: null, aggregate: true, rejected: false,
    });
  });

  test("signed selector is identity-bound and browser tampering is denied", () => {
    const token = workspaceSelectorToken(accounts[1].accountId, identity, secret);
    expect(selectCustomerWorkspace(request("/", token), identity, accounts, secret).selected)
      .toEqual(accounts[1]);
    expect(selectCustomerWorkspace(request("/", `${token}x`), identity, accounts, secret).rejected)
      .toBe(true);
    expect(selectCustomerWorkspace(request("/", token), otherIdentity, accounts, secret).rejected)
      .toBe(true);
    expect(selectCustomerWorkspace(request("/?account_id=acct_8ssana"), identity, accounts, secret).rejected)
      .toBe(true);
    expect(selectCustomerWorkspace(request("/?organization_id=org_other"), identity, accounts, secret).rejected)
      .toBe(true);
    const allToken = workspaceSelectorToken("all", identity, secret);
    expect(selectCustomerWorkspace(request("/", allToken), identity, accounts, secret))
      .toMatchObject({ selected: null, aggregate: true, rejected: false });
  });

  test("membership removal invalidates the account selection and falls back to authorized all", () => {
    const token = workspaceSelectorToken(accounts[1].accountId, identity, secret);
    const result = selectCustomerWorkspace(request("/", token), identity, [accounts[0]], secret);
    expect(result).toMatchObject({
      selected: null, aggregate: true, rejected: false, expired: true,
    });
  });

  test("customer contracts are schema v1 and contain sanitized fields only", () => {
    const views = customerWorkspaceViews(accounts, accounts[0].accountId, identity, secret);
    const list = customerWorkspacesContract(views);
    const session = customerSessionContract(views, false);
    expect(list.meta.schema_version).toBe(1);
    expect(Object.keys(list.workspaces[0]).sort()).toEqual([
      "current", "display_name", "handle", "selector",
    ]);
    expect(JSON.stringify(list)).not.toContain("org_customer");
    expect(JSON.stringify(list)).not.toContain("usr_customer");
    expect(JSON.stringify(list)).not.toContain("acct_");
    expect(session).toMatchObject({
      meta: { schema_version: 1 }, authenticated: true, workspace_count: 2,
      workspace: { display_name: "紗凪｜恋愛診断士", handle: "@8sssana" },
    });
  });
});

describe("CUSTOMER-AUTH01 customer UX", () => {
  test("public login landing has only branded static copy", () => {
    const html = renderCustomerLogin();
    expect(html).toContain("匠 Technologies | AI SNS運用");
    expect(html).toContain("ログインする");
    expect(html).toContain("登録済みのメールアドレスでログインしてください");
    expect(html).not.toContain("acct_");
    expect(html).not.toContain("org_");
    expect(html).not.toContain("usr_");
  });

  test("multi-workspace selector and dashboard switcher use customer-safe copy", () => {
    const views = customerWorkspaceViews(accounts, accounts[0].accountId, identity, secret);
    const choice = renderWorkspaceChoice(views, "csrf-token");
    expect(choice).toContain("運用するアカウントを選ぶ");
    expect(choice).toContain("すべて");
    expect(choice).toContain("紗凪｜恋愛診断士");
    expect(choice).toContain("タク｜AI仕事術×副業");
    expect(choice).toContain("csrf-token");
    expect(choice.match(/action="\/api\/customer\/workspaces\/select"/g)).toHaveLength(3);
    expect(choice).toContain(`name="selector" value="${views[0].selector}"`);
    expect(choice).toContain(`name="selector" value="${views[1].selector}"`);
    const dashboard = renderLayout({
      title: "Dashboard", body: "customer body", currentPath: "/",
      csrfToken: "csrf-token", customerWorkspaces: views,
      internalAccessAllowed: false,
    });
    expect(dashboard).toContain("表示範囲");
    expect(dashboard).toContain("/api/customer/workspaces/select");
    expect(dashboard.match(/action="\/api\/customer\/workspaces\/select"/g)).toHaveLength(3);
    expect(dashboard.match(/name="csrf_token" value="csrf-token"/g)).toHaveLength(3);
    for (const workspace of views) {
      expect(dashboard).toContain(`name="selector" value="${workspace.selector}"`);
    }
    expect(dashboard).toContain('disabled aria-current="true"');
    expect(dashboard).not.toContain('name="account_id"');
    expect(dashboard).not.toContain("オフィスに戻る");
    expect(dashboard).not.toContain("/internal\"");
  });

  test("customer workspace typography never renders below 12px", () => {
    const pixelSizes = [...customerWorkspaceStyles.matchAll(/font-size:\s*(\d+)px/g)]
      .map((match) => Number(match[1]));
    expect(pixelSizes.length).toBeGreaterThan(0);
    expect(pixelSizes.every((size) => size >= 12)).toBe(true);
    expect(customerWorkspaceStyles).toContain(
      ".customer-workspace summary>small{display:block;font-size:var(--t-type-caption-size,12px)",
    );
    expect(customerWorkspaceStyles).not.toContain(".customer-workspace>small{");
    expect(customerWorkspaceStyles).toContain(
      ".customer-workspace-list button span{font-size:var(--t-type-caption-size,12px)",
    );
  });

  test("single-workspace dashboard stays selected without switch actions", () => {
    const views = customerWorkspaceViews([accounts[0]], accounts[0].accountId, identity, secret);
    const dashboard = renderLayout({
      title: "Dashboard", body: "customer body", currentPath: "/",
      csrfToken: "csrf-token", customerWorkspaces: views,
      internalAccessAllowed: false,
    });
    expect(dashboard).toContain('<details class="customer-workspace" open>');
    expect(dashboard).toContain("紗凪｜恋愛診断士");
    expect(dashboard).toContain("@8sssana");
    expect(dashboard).not.toContain("/api/customer/workspaces/select");
  });

  test("zero-workspace and expired-selection states are friendly", () => {
    expect(renderWorkspaceChoice([], "csrf")).toContain("表示できるアカウントがありません");
    expect(renderWorkspaceChoice(
      customerWorkspaceViews(accounts, null, identity, secret), "csrf", true,
    )).toContain("選び直してください");
  });

  test("workspace UI includes mobile and dark-mode support", () => {
    expect(customerWorkspaceStyles).toContain("@media(max-width:700px)");
    expect(customerWorkspaceStyles).toContain("var(--c-panel");
    expect(renderCustomerLogin()).toContain("@media(max-width:560px)");
  });

  test("aggregate customer view includes only supplied authorized accounts and customer-safe fields", () => {
    const dashboard = (accountId: string, handle: string, views: number): ThreadsDashboardData => ({
      connected: true,
      accountId,
      handle,
      displayName: handle,
      accountStatus: "ready",
      fetchedAt: "2026-10-03T00:30:00Z",
      contents: [{
        contentId: `${accountId}-content`, version: 1, attempt: 1, topic: "実投稿",
        contentRole: "reach", body: "公開済み本文", state: "metrics_collected",
        qaVerdict: "pass", approved: true, copyGuard: "pass",
        createdAt: "2026-10-03T00:00:00Z", updatedAt: "2026-10-03T00:20:00Z",
        scheduledAt: null,
        publication: {
          publicationId: `${accountId}-publication`, mode: "live", status: "succeeded",
          externalId: `${views}`, permalink: null, createdAt: "2026-10-03T00:05:00Z",
          publishedAt: "2026-10-03T00:10:00Z", readbackStatus: "confirmed", duplicate: false,
        },
        metrics: { views, likes: 2 }, metricsObservedAt: "2026-10-03T00:25:00Z",
        metricsFetchedAt: "2026-10-03T00:25:00Z", metricsEligibleAt: null,
        viewsPerHour: null, engagementPerHour: null, origin: "ai_auto",
        analyzeEnabled: true, learnEnabled: true, partCount: 1,
      }],
    } as ThreadsDashboardData);
    const html = renderOverviewAggregate({} as never, [
      dashboard("acct_8ssana", "8sssana", 10),
      dashboard("acct_taku_ai_tech", "taku_ai_tech", 20),
    ]);
    expect(html).toContain("すべての運用アカウント");
    expect(html).toContain("@8sssana");
    expect(html).toContain("@taku_ai_tech");
    expect(html).toContain(">30<");
    expect(html).not.toContain("acct_");
    for (const hidden of ["credential", "LAB", "DOT", "internal agent", "production DB"]) {
      expect(html).not.toContain(hidden);
    }
  });
});
