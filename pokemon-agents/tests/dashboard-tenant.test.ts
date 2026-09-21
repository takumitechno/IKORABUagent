import { describe, expect, test } from "bun:test";
import {
  createDashboardTenantConfig, resolveTrustedTenantIdentity,
  selectAuthorizedAccount, tenantCan, unavailableTenantDirectory,
  type TenantDirectory,
} from "../web/lib/dashboard-tenant";
import {
  createDashboardAuthConfig, resolveInternalIdentity,
} from "../web/lib/internal-auth";

const cloudflareAuth = createDashboardAuthConfig({
  DASHBOARD_INTERNAL_AUTH: "cloudflare-access",
  DASHBOARD_INTERNAL_ALLOWED_EMAILS: "a@example.com,b@example.com",
  DASHBOARD_INTERNAL_ACCOUNT_IDS: "acct_A,acct_B",
  DASHBOARD_CSRF_SECRET: "csrf-secret-with-at-least-thirty-two-characters",
}, "127.0.0.1");

const tenantConfig = createDashboardTenantConfig({
  DASHBOARD_MULTI_TENANT_AUTH: "true",
}, "cloudflare-access");

function cloudflareRequest(extraHeaders: Record<string, string> = {}): Request {
  return new Request("https://dashboard.example.com/internal?user_id=user_B", {
    headers: {
      "cf-access-authenticated-user-email": "a@example.com",
      "cf-access-jwt-assertion": "verified-access-assertion",
      ...extraHeaders,
    },
  });
}

describe("dashboard trusted tenant identity", () => {
  test("feature flag defaults off", () => {
    expect(createDashboardTenantConfig({}, "local").enabled).toBe(false);
  });

  test("ignores browser user-id spoofing and resolves only the verified email", async () => {
    const calls: string[] = [];
    const directory: TenantDirectory = {
      async resolveByEmail(email) {
        calls.push(email);
        return { userId: "user_A", organizationId: "org_A", role: "editor" };
      },
    };
    const request = cloudflareRequest({ "X-Threads-User-ID": "user_B" });
    const internal = resolveInternalIdentity(request, cloudflareAuth);
    const resolved = await resolveTrustedTenantIdentity(
      request, internal, tenantConfig, directory,
    );
    expect(calls).toEqual(["a@example.com"]);
    expect(resolved).toEqual({ userId: "user_A", organizationId: "org_A", role: "editor" });
  });

  test("fails closed for missing or unknown identity", async () => {
    expect(await resolveTrustedTenantIdentity(
      cloudflareRequest(), null, tenantConfig, unavailableTenantDirectory,
    )).toBeNull();
    const internal = resolveInternalIdentity(cloudflareRequest(), cloudflareAuth);
    expect(await resolveTrustedTenantIdentity(
      cloudflareRequest(), internal, tenantConfig, unavailableTenantDirectory,
    )).toBeNull();
  });

  test("local mode requires an explicit development user and ignores query parameters", async () => {
    const localAuth = createDashboardAuthConfig({ DASHBOARD_INTERNAL_AUTH: "local" }, "127.0.0.1");
    const request = new Request("http://127.0.0.1:5733/internal?user_id=forged");
    const internal = resolveInternalIdentity(request, localAuth);
    const missing = createDashboardTenantConfig({ DASHBOARD_MULTI_TENANT_AUTH: "true" }, "local");
    expect(await resolveTrustedTenantIdentity(
      request, internal, missing, unavailableTenantDirectory,
    )).toBeNull();
    const explicit = createDashboardTenantConfig({
      DASHBOARD_MULTI_TENANT_AUTH: "true",
      DASHBOARD_LOCAL_USER_ID: "local_operator",
      DASHBOARD_LOCAL_TENANT_ROLE: "admin",
    }, "local");
    expect(await resolveTrustedTenantIdentity(
      request, internal, explicit, unavailableTenantDirectory,
    )).toEqual({
      userId: "local_operator", organizationId: "local-development", role: "admin",
    });
  });

  test("provides the viewer editor admin permission foundation", () => {
    const identity = (role: "viewer" | "editor" | "admin") => ({
      userId: `user_${role}`, organizationId: "org_A", role,
    });
    expect(tenantCan(identity("viewer"), "dashboard:read")).toBe(true);
    expect(tenantCan(identity("viewer"), "content:review")).toBe(false);
    expect(tenantCan(identity("editor"), "content:review")).toBe(true);
    expect(tenantCan(identity("editor"), "operations:admin")).toBe(false);
    expect(tenantCan(identity("admin"), "operations:admin")).toBe(true);
  });

  test("isolates account selectors and rejects direct URL tampering without fallback", () => {
    const accountA = [{ accountId: "acct_A", handle: "a", displayName: "A", accountStatus: "active" }];
    const accountB = [{ accountId: "acct_B", handle: "b", displayName: "B", accountStatus: "active" }];
    expect(selectAuthorizedAccount(null, accountA, "acct_A", true).selected).toBe("acct_A");
    expect(selectAuthorizedAccount(null, accountB, "acct_A", true).selected).toBe("acct_B");
    const tamperedA = selectAuthorizedAccount("acct_B", accountA, "acct_A", true);
    const tamperedB = selectAuthorizedAccount("acct_A", accountB, "acct_A", true);
    expect(tamperedA).toMatchObject({ selected: null, rejected: true });
    expect(tamperedB).toMatchObject({ selected: null, rejected: true });
    expect(selectAuthorizedAccount("acct_B", accountA, "acct_A", false).selected).toBe("acct_A");
  });
});
