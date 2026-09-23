import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type DashboardAuthMode = "local" | "cloudflare-access";

export interface DashboardAuthConfig {
  mode: DashboardAuthMode;
  bindHost: string;
  allowedEmails: ReadonlySet<string>;
  allowedAccountIds: ReadonlySet<string>;
  csrfSecret: string;
  serviceKey: string;
}

export interface InternalIdentity {
  kind: "local-user" | "cloudflare-user" | "service";
  subject: string;
}

export interface CustomerCsrfIdentity {
  userId: string;
  organizationId: string;
  role: "viewer" | "editor" | "admin";
}

const PUBLIC_PATHS = new Set(["/login", "/", "/improvement", "/styles.css", "/health"]);
const PUBLIC_PREFIXES = ["/brand/", "/bg/", "/hero/"];
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "::1", "localhost", "[::1]"]);

function normalizedEmails(raw: string | undefined): Set<string> {
  return new Set((raw || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean));
}

function normalizedAccounts(raw: string | undefined): Set<string> {
  return new Set((raw || "").split(",").map((item) => item.trim()).filter((item) => /^acct_[a-zA-Z0-9_-]+$/.test(item)));
}

export function isLoopbackHost(host: string): boolean {
  return LOOPBACK_HOSTS.has(host.trim().toLowerCase());
}

export function createDashboardAuthConfig(
  env: Record<string, string | undefined>,
  bindHost: string,
): DashboardAuthConfig {
  const mode = (env.DASHBOARD_INTERNAL_AUTH || "local") as DashboardAuthMode;
  if (mode !== "local" && mode !== "cloudflare-access") {
    throw new Error("DASHBOARD_INTERNAL_AUTH must be local or cloudflare-access");
  }
  if (!isLoopbackHost(bindHost)) {
    throw new Error("dashboard must bind to loopback; public binding is not allowed");
  }
  const allowedEmails = normalizedEmails(env.DASHBOARD_INTERNAL_ALLOWED_EMAILS);
  const allowedAccountIds = normalizedAccounts(env.DASHBOARD_INTERNAL_ACCOUNT_IDS);
  const configuredCsrf = env.DASHBOARD_CSRF_SECRET || "";
  if (mode === "cloudflare-access" && allowedEmails.size === 0) {
    throw new Error("DASHBOARD_INTERNAL_ALLOWED_EMAILS is required in cloudflare-access mode");
  }
  if (mode === "cloudflare-access" && allowedAccountIds.size === 0) {
    throw new Error("DASHBOARD_INTERNAL_ACCOUNT_IDS is required in cloudflare-access mode");
  }
  if (mode === "cloudflare-access" && configuredCsrf.length < 32) {
    throw new Error("DASHBOARD_CSRF_SECRET must contain at least 32 characters in cloudflare-access mode");
  }
  const serviceKey = env.DASHBOARD_INTERNAL_API_KEY || "";
  if (serviceKey && serviceKey.length < 32) {
    throw new Error("DASHBOARD_INTERNAL_API_KEY must contain at least 32 characters");
  }
  return {
    mode,
    bindHost,
    allowedEmails,
    allowedAccountIds,
    csrfSecret: configuredCsrf || randomBytes(32).toString("hex"),
    serviceKey,
  };
}

export function accountAllowed(accountId: string, config: DashboardAuthConfig): boolean {
  return config.mode === "local" || config.allowedAccountIds.has(accountId);
}

export function isPublicDashboardPath(path: string): boolean {
  if (path === "/bg/internal-hq-office.png") return false;
  return PUBLIC_PATHS.has(path) || PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function bearer(req: Request): string {
  const value = req.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function equalSecret(left: string, right: string): boolean {
  if (!left || !right) return false;
  const a = Buffer.from(left), b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function resolveInternalIdentity(req: Request, config: DashboardAuthConfig): InternalIdentity | null {
  if (config.serviceKey && equalSecret(bearer(req), config.serviceKey)) {
    return { kind: "service", subject: "dashboard-internal-service" };
  }
  if (config.mode === "local") {
    return { kind: "local-user", subject: "localhost-operator" };
  }
  const verified = resolveCustomerIdentity(req, config);
  if (!verified || !config.allowedEmails.has(verified.subject)) return null;
  return verified;
}

export function resolveCustomerIdentity(
  req: Request,
  config: DashboardAuthConfig,
): InternalIdentity | null {
  if (config.mode === "local") {
    return { kind: "local-user", subject: "localhost-customer" };
  }
  const email = (req.headers.get("cf-access-authenticated-user-email") || "").trim().toLowerCase();
  const assertion = req.headers.get("cf-access-jwt-assertion") || "";
  if (!email || !assertion) return null;
  return { kind: "cloudflare-user", subject: email };
}

export function csrfToken(identity: InternalIdentity, config: DashboardAuthConfig): string {
  return createHmac("sha256", config.csrfSecret)
    .update(`dashboard-csrf-v1\n${identity.kind}\n${identity.subject}`)
    .digest("hex");
}

export function customerCsrfToken(
  identity: CustomerCsrfIdentity,
  config: DashboardAuthConfig,
): string {
  return createHmac("sha256", config.csrfSecret)
    .update(
      `dashboard-customer-csrf-v1\n${identity.userId}\n${identity.organizationId}\n${identity.role}`,
    )
    .digest("hex");
}

function sameOrigin(req: Request, config: DashboardAuthConfig): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const direct = new URL(req.url).origin;
  if (origin === direct) return true;
  if (config.mode !== "cloudflare-access") return false;
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = (req.headers.get("x-forwarded-host") || "").split(",")[0]?.trim();
  if (!proto || !["http", "https"].includes(proto) || !host || !/^[a-zA-Z0-9.-]+(?::\d{1,5})?$/.test(host)) {
    return false;
  }
  return origin === `${proto}://${host}`;
}

async function suppliedCsrf(req: Request): Promise<string> {
  const header = req.headers.get("x-csrf-token");
  if (header) return header;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await req.clone().formData();
    return String(form.get("csrf_token") || "");
  }
  return "";
}

export async function mutationAllowed(
  req: Request,
  identity: InternalIdentity,
  config: DashboardAuthConfig,
): Promise<boolean> {
  if (identity.kind === "service") return true;
  // Local hooks and local automation are authenticated by the loopback-only
  // listener. Browsers send Origin and therefore still take the CSRF path.
  if (config.mode === "local" && !req.headers.get("origin")) return true;
  if (!sameOrigin(req, config)) return false;
  return equalSecret(await suppliedCsrf(req), csrfToken(identity, config));
}

export async function customerMutationAllowed(
  req: Request,
  identity: CustomerCsrfIdentity,
  config: DashboardAuthConfig,
): Promise<boolean> {
  if (!sameOrigin(req, config)) return false;
  return equalSecret(await suppliedCsrf(req), customerCsrfToken(identity, config));
}
