import { describe, expect, test } from "bun:test";
import {
  createBridgeTenantDirectory,
  createDashboardTenantConfig,
  resolveTrustedTenantIdentity,
  selectAuthorizedAccount,
  tenantCan,
  tenantIdentityFailure,
} from "../web/lib/dashboard-tenant";
import { createDashboardAuthConfig, resolveInternalIdentity } from "../web/lib/internal-auth";
import { loadThreadsAccounts, loadThreadsDashboard } from "../web/lib/threads-dashboard";
import {
  accountResponseV1,
  accountSummaryV1,
  accountsResponseV1,
  editorialCustomerV1,
  editorialInternalV1,
  safetyResponseV1,
} from "./threads-bridge-v1-fixtures";

const bridgeUrl = "https://bridge.example.test";
const apiKey = "server-only-bridge-key";
const tenantConfig = createDashboardTenantConfig(
  { DASHBOARD_MULTI_TENANT_AUTH: "true" },
  "cloudflare-access",
);
const auth = createDashboardAuthConfig({
  DASHBOARD_INTERNAL_AUTH: "cloudflare-access",
  DASHBOARD_INTERNAL_ALLOWED_EMAILS: "a@example.com,b@example.com",
  DASHBOARD_INTERNAL_ACCOUNT_IDS: "acct_A,acct_B",
  DASHBOARD_CSRF_SECRET: "csrf-secret-with-at-least-thirty-two-characters",
}, "127.0.0.1");

function dashboardRequest(email: string): Request {
  return new Request(
    "https://dashboard.example.test/internal?user_id=forged&email=forged@example.com",
    { headers: {
      "cf-access-authenticated-user-email": email,
      "cf-access-jwt-assertion": "verified-access-assertion",
      "X-Threads-User-ID": "forged_user",
      "X-User-Email": "forged@example.com",
    } },
  );
}

function tenantBridge() {
  const requests: Request[] = [];
  const users = new Map([
    ["a@example.com", { user_id: "user_A", org_id: "org_A", role: "viewer" }],
    ["b@example.com", { user_id: "user_B", org_id: "org_B", role: "admin" }],
    ["editor@example.com", { user_id: "user_editor", org_id: "org_A", role: "editor" }],
  ]);
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    requests.push(request);
    const url = new URL(request.url);
    if (url.pathname.endsWith("/tenant/resolve-identity")) {
      expect(request.method).toBe("POST");
      expect(request.headers.get("authorization")).toBe(`Bearer ${apiKey}`);
      expect(request.headers.get("x-threads-user-id")).toBeNull();
      const body = await request.clone().json() as { email?: string };
      const user = users.get(body.email ?? "");
      return user
        ? Response.json({ meta: { schema_version: 1 }, ...user })
        : Response.json({ detail: { code: "identity_not_found" } }, { status: 404 });
    }

    if (url.pathname.endsWith("/tenant-shadow/accounts")) {
      const userId = request.headers.get("x-threads-user-id");
      const accountId = userId === "user_A" ? "acct_A" : userId === "user_B" ? "acct_B" : null;
      return Response.json({
        would_be_accounts: accountId ? [accountId] : [],
        current_count: 2,
        would_be_count: accountId ? 1 : 0,
        would_hide_count: accountId ? 1 : 2,
      });
    }

    const userId = request.headers.get("x-threads-user-id");
    const accountId = userId === "user_A" ? "acct_A" : userId === "user_B" ? "acct_B" : null;
    if (!accountId) return new Response("denied", { status: 403 });
    if (url.pathname === "/operator/accounts") {
      return Response.json(accountsResponseV1([
        accountSummaryV1({ account_id: accountId, handle: accountId, display_name: accountId }),
      ]));
    }
    if (url.pathname.startsWith("/operator/accounts/")) {
      const requested = decodeURIComponent(url.pathname.split("/")[3] ?? "");
      if (requested !== accountId) return new Response("denied", { status: 403 });
      return Response.json(accountResponseV1({
        account_id: accountId, handle: accountId, display_name: accountId,
      }));
    }
    if (url.pathname.endsWith("/safety/status")) {
      if (url.searchParams.get("account_id") !== accountId) return new Response("denied", { status: 403 });
      return Response.json(safetyResponseV1({ account_id: accountId }));
    }
    if (url.pathname.endsWith("/editorial/internal")) {
      return Response.json(editorialInternalV1({ account_id: accountId }));
    }
    if (url.pathname.endsWith("/editorial/customer")) {
      return Response.json(editorialCustomerV1({ account_id: accountId }));
    }
    return new Response("missing", { status: 404 });
  }) as typeof fetch;
  return { fetcher, requests };
}

describe("SAAS02E end-to-end tenant identity wiring", () => {
  test("verified email resolves canonically and scopes accounts for users A and B", async () => {
    const bridge = tenantBridge();
    const directory = createBridgeTenantDirectory({ bridgeUrl, apiKey, fetcher: bridge.fetcher });

    for (const [email, userId, allowed, denied, role] of [
      ["a@example.com", "user_A", "acct_A", "acct_B", "viewer"],
      ["b@example.com", "user_B", "acct_B", "acct_A", "admin"],
    ] as const) {
      const request = dashboardRequest(email);
      const identity = await resolveTrustedTenantIdentity(
        request, resolveInternalIdentity(request, auth), tenantConfig, directory,
      );
      expect(identity).toEqual({
        userId,
        organizationId: userId === "user_A" ? "org_A" : "org_B",
        role,
      });
      const accounts = await loadThreadsAccounts({
        bridgeUrl, apiKey, tenantUserId: identity!.userId, fetcher: bridge.fetcher,
      });
      expect(accounts.map((account) => account.accountId)).toEqual([allowed]);
      expect(selectAuthorizedAccount(denied, accounts, allowed, true)).toMatchObject({
        selected: null, rejected: true,
      });
      const dashboard = await loadThreadsDashboard({
        bridgeUrl, apiKey, accountId: allowed, tenantUserId: identity!.userId,
        fetcher: bridge.fetcher,
      });
      expect(dashboard.connected).toBe(true);
      const finalGate = await loadThreadsDashboard({
        bridgeUrl, apiKey, accountId: denied, tenantUserId: identity!.userId,
        fetcher: bridge.fetcher,
      });
      expect(finalGate.bridgeStatus).toBe("UNAUTHORIZED");
    }

    const identityRequests = bridge.requests.filter((request) =>
      request.url.includes("/tenant/resolve-identity"));
    expect(identityRequests).toHaveLength(2);
    expect(await identityRequests[0].clone().json()).toEqual({ email: "a@example.com" });
    expect(await identityRequests[1].clone().json()).toEqual({ email: "b@example.com" });
  });

  test("propagates all resolved roles into the permission model", async () => {
    const bridge = tenantBridge();
    const directory = createBridgeTenantDirectory({ bridgeUrl, apiKey, fetcher: bridge.fetcher });
    const viewer = await directory.resolveByEmail("a@example.com");
    const editor = await directory.resolveByEmail("editor@example.com");
    const admin = await directory.resolveByEmail("b@example.com");
    expect(tenantCan(viewer!, "dashboard:read")).toBe(true);
    expect(tenantCan(viewer!, "content:review")).toBe(false);
    expect(tenantCan(editor!, "content:review")).toBe(true);
    expect(tenantCan(editor!, "operations:admin")).toBe(false);
    expect(tenantCan(admin!, "operations:admin")).toBe(true);
  });

  test("fails closed with the identity taxonomy", async () => {
    const cases: Array<[() => Promise<Response>, string]> = [
      [async () => new Response("missing", { status: 404 }), "TENANT_IDENTITY_NOT_FOUND"],
      [async () => new Response("denied", { status: 401 }), "UNAUTHORIZED"],
      [async () => Response.json({ meta: { schema_version: 2 } }), "SCHEMA_INCOMPATIBLE"],
      [async () => new Response("not-json", { status: 200 }), "MALFORMED_RESPONSE"],
      [async () => { throw new Error("private network detail"); }, "UNREACHABLE"],
    ];
    for (const [reply, code] of cases) {
      const directory = createBridgeTenantDirectory({
        bridgeUrl, apiKey, fetcher: (async () => reply()) as typeof fetch,
      });
      try {
        await directory.resolveByEmail("a@example.com");
        throw new Error("expected identity resolution failure");
      } catch (error) {
        expect(tenantIdentityFailure(error)).toBe(code);
        expect(String(error)).not.toContain("private network detail");
        expect(String(error)).not.toContain("a@example.com");
      }
    }
  });
});
