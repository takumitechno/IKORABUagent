import { describe, expect, test } from "bun:test";
import { renderLayout } from "../web/components/layout";
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
import type { ThreadsAccountOption } from "../web/lib/threads-dashboard";

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
  test("single-account customers enter directly and zero/multi accounts do not", () => {
    expect(selectCustomerWorkspace(request(), identity, [accounts[0]], secret).selected)
      .toEqual(accounts[0]);
    expect(selectCustomerWorkspace(request(), identity, [], secret).selected).toBeNull();
    expect(selectCustomerWorkspace(request(), identity, accounts, secret).selected).toBeNull();
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
  });

  test("membership removal invalidates the active selection without falling back", () => {
    const token = workspaceSelectorToken(accounts[1].accountId, identity, secret);
    const result = selectCustomerWorkspace(request("/", token), identity, [accounts[0]], secret);
    expect(result).toMatchObject({ selected: null, rejected: false, expired: true });
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
    expect(choice).toContain("紗凪｜恋愛診断士");
    expect(choice).toContain("タク｜AI仕事術×副業");
    expect(choice).toContain("csrf-token");
    expect(choice.match(/action="\/api\/customer\/workspaces\/select"/g)).toHaveLength(2);
    expect(choice).toContain(`name="selector" value="${views[0].selector}"`);
    expect(choice).toContain(`name="selector" value="${views[1].selector}"`);
    const dashboard = renderLayout({
      title: "Dashboard", body: "customer body", currentPath: "/",
      csrfToken: "csrf-token", customerWorkspaces: views,
      internalAccessAllowed: false,
    });
    expect(dashboard).toContain("現在のアカウント");
    expect(dashboard).toContain("/api/customer/workspaces/select");
    expect(dashboard.match(/action="\/api\/customer\/workspaces\/select"/g)).toHaveLength(2);
    expect(dashboard.match(/name="csrf_token" value="csrf-token"/g)).toHaveLength(2);
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
      ".customer-workspace>small{display:block;font-size:var(--t-type-caption-size,12px)",
    );
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
});
