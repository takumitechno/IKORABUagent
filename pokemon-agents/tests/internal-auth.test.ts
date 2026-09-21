import { describe, expect, test } from "bun:test";
import {
  accountAllowed, createDashboardAuthConfig, csrfToken, isPublicDashboardPath,
  mutationAllowed, resolveInternalIdentity,
} from "../web/lib/internal-auth";

const cloudflare = createDashboardAuthConfig({
  DASHBOARD_INTERNAL_AUTH: "cloudflare-access",
  DASHBOARD_INTERNAL_ALLOWED_EMAILS: "owner@example.com",
  DASHBOARD_INTERNAL_ACCOUNT_IDS: "acct_8ssana",
  DASHBOARD_CSRF_SECRET: "csrf-secret-with-at-least-thirty-two-characters",
  DASHBOARD_INTERNAL_API_KEY: "service-secret-with-at-least-thirty-two-characters",
}, "127.0.0.1");

function cfRequest(path: string, init: RequestInit = {}): Request {
  const headers = new Headers(init.headers);
  headers.set("cf-access-authenticated-user-email", "owner@example.com");
  headers.set("cf-access-jwt-assertion", "signed-by-cloudflare-access");
  return new Request(`https://admin.example.com${path}`, { ...init, headers });
}

describe("unified dashboard internal auth boundary", () => {
  test("keeps only customer pages and display assets anonymous", () => {
    expect(isPublicDashboardPath("/")).toBe(true);
    expect(isPublicDashboardPath("/improvement")).toBe(true);
    expect(isPublicDashboardPath("/brand/logo.png")).toBe(true);
    for (const path of ["/internal", "/agents", "/logs", "/schedules", "/api/events", "/api/approve", "/event/Stop", "/internal-assets/member.jpg", "/bg/internal-hq-office.png"]) {
      expect(isPublicDashboardPath(path)).toBe(false);
    }
  });

  test("requires Cloudflare identity, assertion, and an allowed email", () => {
    expect(resolveInternalIdentity(new Request("https://admin.example.com/agents"), cloudflare)).toBeNull();
    const forged = new Request("https://admin.example.com/agents", {
      headers: { "cf-access-authenticated-user-email": "owner@example.com" },
    });
    expect(resolveInternalIdentity(forged, cloudflare)).toBeNull();
    expect(resolveInternalIdentity(cfRequest("/agents"), cloudflare)?.subject).toBe("owner@example.com");
    expect(accountAllowed("acct_8ssana", cloudflare)).toBe(true);
    expect(accountAllowed("acct_other", cloudflare)).toBe(false);
  });

  test("rejects Origin-only mutation and accepts authenticated same-origin CSRF", async () => {
    const anonymous = new Request("https://admin.example.com/api/approve", {
      method: "POST", headers: { origin: "https://admin.example.com" },
    });
    expect(resolveInternalIdentity(anonymous, cloudflare)).toBeNull();

    const identity = resolveInternalIdentity(cfRequest("/api/approve"), cloudflare)!;
    const missing = cfRequest("/api/approve", {
      method: "POST", headers: { origin: "https://admin.example.com" },
    });
    expect(await mutationAllowed(missing, identity, cloudflare)).toBe(false);
    const accepted = cfRequest("/api/approve", {
      method: "POST",
      headers: {
        origin: "https://admin.example.com",
        "x-csrf-token": csrfToken(identity, cloudflare),
      },
    });
    expect(await mutationAllowed(accepted, identity, cloudflare)).toBe(true);
  });

  test("supports a non-browser service identity without rendering its key", async () => {
    const request = new Request("https://admin.example.com/event/Stop", {
      method: "POST",
      headers: { authorization: "Bearer service-secret-with-at-least-thirty-two-characters" },
    });
    const identity = resolveInternalIdentity(request, cloudflare)!;
    expect(identity.kind).toBe("service");
    expect(await mutationAllowed(request, identity, cloudflare)).toBe(true);
    expect(csrfToken(identity, cloudflare)).not.toContain("service-secret");
  });

  test("preserves loopback development and rejects public binding", async () => {
    const local = createDashboardAuthConfig({ DASHBOARD_INTERNAL_AUTH: "local" }, "127.0.0.1");
    const request = new Request("http://127.0.0.1:5733/api/schedule/save", { method: "POST" });
    const identity = resolveInternalIdentity(request, local)!;
    expect(identity.kind).toBe("local-user");
    expect(await mutationAllowed(request, identity, local)).toBe(true);
    expect(() => createDashboardAuthConfig({ DASHBOARD_INTERNAL_AUTH: "local" }, "0.0.0.0")).toThrow();
  });
});
