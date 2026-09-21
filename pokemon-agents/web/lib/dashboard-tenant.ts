import type { DashboardAuthMode, InternalIdentity } from "./internal-auth";
import type { ThreadsAccountOption } from "./threads-dashboard";
import {
  ThreadsBridgeContractError,
  parseTenantIdentityResponseV1,
} from "./threads-bridge-contract";

export type TenantRole = "viewer" | "editor" | "admin";
export type TenantPermission = "dashboard:read" | "content:review" | "operations:admin";

export interface DashboardTenantConfig {
  enabled: boolean;
  shadowEnabled: boolean;
  canaryEnabled: boolean;
  canaryUserId: string | null;
  canaryAccountId: string | null;
  authMode: DashboardAuthMode;
  localUserId: string | null;
  localRole: TenantRole;
}

export interface ResolvedTenantIdentity {
  userId: string;
  organizationId: string;
  role: TenantRole;
}

export interface TenantDirectory {
  resolveByEmail(email: string): Promise<ResolvedTenantIdentity | null>;
  shadowAccounts?(userId: string): Promise<TenantShadowAccounts>;
}

export interface TenantShadowAccounts {
  wouldBeAccounts: string[];
  currentCount: number;
  wouldBeCount: number;
  wouldHideCount: number;
}

export interface DashboardTenantShadowSnapshot {
  totalEvaluations: number;
  wouldAllow: number;
  wouldDeny: number;
  unexpectedAllow: number;
  unexpectedDeny: number;
  last: null | {
    decision: "allow" | "deny";
    reasonCode: string;
    wouldAllowAccounts: string[];
    wouldHideCount: number;
    timestamp: string;
  };
}

let shadowSnapshot: DashboardTenantShadowSnapshot = {
  totalEvaluations: 0,
  wouldAllow: 0,
  wouldDeny: 0,
  unexpectedAllow: 0,
  unexpectedDeny: 0,
  last: null,
};

export function resetDashboardTenantShadow(): void {
  shadowSnapshot = {
    totalEvaluations: 0, wouldAllow: 0, wouldDeny: 0,
    unexpectedAllow: 0, unexpectedDeny: 0, last: null,
  };
}

export function dashboardTenantShadowSnapshot(): DashboardTenantShadowSnapshot {
  return structuredClone(shadowSnapshot);
}

export type TenantIdentityFailure =
  | "UNAUTHORIZED"
  | "TENANT_IDENTITY_NOT_FOUND"
  | "SCHEMA_INCOMPATIBLE"
  | "MALFORMED_RESPONSE"
  | "UNREACHABLE";

export class TenantIdentityResolutionError extends Error {
  constructor(public readonly code: TenantIdentityFailure) {
    super(code);
    this.name = "TenantIdentityResolutionError";
  }
}

type FetchLike = typeof fetch;

function bridgeOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new TenantIdentityResolutionError("UNREACHABLE");
  }
  return url.origin;
}

function localBridge(origin: string): boolean {
  return ["127.0.0.1", "localhost", "::1", "[::1]"].includes(
    new URL(origin).hostname.toLowerCase(),
  );
}

export function tenantIdentityFailure(error: unknown): TenantIdentityFailure {
  return error instanceof TenantIdentityResolutionError ? error.code : "UNREACHABLE";
}

export function createBridgeTenantDirectory(options: {
  bridgeUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
  fetcher?: FetchLike;
} = {}): TenantDirectory {
  return {
    async resolveByEmail(email: string): Promise<ResolvedTenantIdentity | null> {
      let origin: string;
      try {
        origin = bridgeOrigin(
          options.bridgeUrl ?? process.env.THREADS_BRIDGE_URL ?? "http://127.0.0.1:8000",
        );
      } catch (error) {
        throw error instanceof TenantIdentityResolutionError
          ? error : new TenantIdentityResolutionError("UNREACHABLE");
      }
      const apiKey = options.apiKey ?? process.env.THREADS_BRIDGE_API_KEY ?? "";
      if (!apiKey && !localBridge(origin)) {
        throw new TenantIdentityResolutionError("UNAUTHORIZED");
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 2_500);
      let response: Response;
      try {
        response = await (options.fetcher ?? fetch)(
          `${origin}/autopilot/v2/tenant/resolve-identity`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify({ email }),
            signal: controller.signal,
          },
        );
      } catch {
        throw new TenantIdentityResolutionError("UNREACHABLE");
      } finally {
        clearTimeout(timer);
      }
      if (response.status === 401 || response.status === 403) {
        throw new TenantIdentityResolutionError("UNAUTHORIZED");
      }
      if (response.status === 404) {
        throw new TenantIdentityResolutionError("TENANT_IDENTITY_NOT_FOUND");
      }
      if (!response.ok) throw new TenantIdentityResolutionError("UNREACHABLE");
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new TenantIdentityResolutionError("MALFORMED_RESPONSE");
      }
      try {
        return parseTenantIdentityResponseV1(payload);
      } catch (error) {
        if (error instanceof ThreadsBridgeContractError) {
          if (error.code === "SCHEMA_INCOMPATIBLE") {
            throw new TenantIdentityResolutionError("SCHEMA_INCOMPATIBLE");
          }
          throw new TenantIdentityResolutionError("MALFORMED_RESPONSE");
        }
        throw new TenantIdentityResolutionError("MALFORMED_RESPONSE");
      }
    },
    async shadowAccounts(userId: string): Promise<TenantShadowAccounts> {
      if (!validCanonicalUserId(userId)) {
        throw new TenantIdentityResolutionError("UNAUTHORIZED");
      }
      let origin: string;
      try {
        origin = bridgeOrigin(
          options.bridgeUrl ?? process.env.THREADS_BRIDGE_URL ?? "http://127.0.0.1:8000",
        );
      } catch {
        throw new TenantIdentityResolutionError("UNREACHABLE");
      }
      const apiKey = options.apiKey ?? process.env.THREADS_BRIDGE_API_KEY ?? "";
      if (!apiKey && !localBridge(origin)) {
        throw new TenantIdentityResolutionError("UNAUTHORIZED");
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 2_500);
      let response: Response;
      try {
        response = await (options.fetcher ?? fetch)(
          `${origin}/operator/tenant-shadow/accounts`,
          { headers: {
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            "X-Threads-User-ID": userId,
          }, signal: controller.signal },
        );
      } catch {
        throw new TenantIdentityResolutionError("UNREACHABLE");
      } finally {
        clearTimeout(timer);
      }
      if (!response.ok) throw new TenantIdentityResolutionError("UNREACHABLE");
      const payload = await response.json() as Record<string, unknown>;
      const accounts = Array.isArray(payload.would_be_accounts)
        ? payload.would_be_accounts.filter((value): value is string =>
          typeof value === "string" && /^acct_[a-zA-Z0-9_-]+$/.test(value))
        : [];
      const currentCount = Number(payload.current_count);
      const wouldBeCount = Number(payload.would_be_count);
      const wouldHideCount = Number(payload.would_hide_count);
      if (![currentCount, wouldBeCount, wouldHideCount].every(Number.isSafeInteger)
        || wouldBeCount !== accounts.length || currentCount < wouldBeCount
        || wouldHideCount !== currentCount - wouldBeCount) {
        throw new TenantIdentityResolutionError("MALFORMED_RESPONSE");
      }
      return {
        wouldBeAccounts: accounts, currentCount, wouldBeCount, wouldHideCount,
      };
    },
  };
}

export const unavailableTenantDirectory: TenantDirectory = {
  async resolveByEmail() {
    return null;
  },
};

const ROLE_RANK: Record<TenantRole, number> = { viewer: 0, editor: 1, admin: 2 };
const PERMISSION_ROLE: Record<TenantPermission, TenantRole> = {
  "dashboard:read": "viewer",
  "content:review": "editor",
  "operations:admin": "admin",
};

function enabled(raw: string | undefined): boolean {
  return ["1", "true", "yes", "on"].includes((raw || "").trim().toLowerCase());
}

function tenantRole(raw: string | undefined, fallback: TenantRole = "viewer"): TenantRole {
  const value = (raw || "").trim().toLowerCase();
  if (!value) return fallback;
  if (value === "viewer" || value === "editor" || value === "admin") return value;
  throw new Error("DASHBOARD_LOCAL_TENANT_ROLE must be viewer, editor, or admin");
}

export function validCanonicalUserId(value: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._:@-]{0,199}$/.test(value);
}

export function createDashboardTenantConfig(
  env: Record<string, string | undefined>,
  authMode: DashboardAuthMode,
): DashboardTenantConfig {
  const localUserId = (env.DASHBOARD_LOCAL_USER_ID || "").trim() || null;
  if (localUserId && !validCanonicalUserId(localUserId)) {
    throw new Error("DASHBOARD_LOCAL_USER_ID is not a valid canonical user ID");
  }
  const canaryEnabled = enabled(env.DASHBOARD_MULTI_TENANT_AUTH_CANARY);
  const canaryUserId = (env.DASHBOARD_MULTI_TENANT_AUTH_CANARY_USER_ID || "").trim() || null;
  const canaryAccountId = (env.DASHBOARD_MULTI_TENANT_AUTH_CANARY_ACCOUNT_ID || "").trim() || null;
  if (canaryEnabled && (!canaryUserId || !validCanonicalUserId(canaryUserId))) {
    throw new Error("DASHBOARD_MULTI_TENANT_AUTH_CANARY_USER_ID is required and invalid");
  }
  if (canaryEnabled && (!canaryAccountId || !/^acct_[a-zA-Z0-9_-]+$/.test(canaryAccountId))) {
    throw new Error("DASHBOARD_MULTI_TENANT_AUTH_CANARY_ACCOUNT_ID is required and invalid");
  }
  return {
    enabled: enabled(env.DASHBOARD_MULTI_TENANT_AUTH),
    shadowEnabled: enabled(env.DASHBOARD_MULTI_TENANT_AUTH_SHADOW),
    canaryEnabled,
    canaryUserId,
    canaryAccountId,
    authMode,
    localUserId,
    localRole: tenantRole(env.DASHBOARD_LOCAL_TENANT_ROLE),
  };
}

function validResolvedIdentity(value: ResolvedTenantIdentity | null): value is ResolvedTenantIdentity {
  return Boolean(value
    && validCanonicalUserId(value.userId)
    && value.organizationId.trim()
    && (value.role === "viewer" || value.role === "editor" || value.role === "admin"));
}

export async function resolveTrustedTenantIdentity(
  _request: Request,
  identity: InternalIdentity | null,
  config: DashboardTenantConfig,
  directory: TenantDirectory,
): Promise<ResolvedTenantIdentity | null> {
  if ((!config.enabled && !config.shadowEnabled && !config.canaryEnabled) || !identity) return null;
  // Browser X-Threads-User-ID and query parameters are intentionally never read.
  if (identity.kind === "cloudflare-user") {
    const resolved = await directory.resolveByEmail(identity.subject.trim().toLowerCase());
    return validResolvedIdentity(resolved) ? resolved : null;
  }
  if (identity.kind === "local-user" && config.authMode === "local" && config.localUserId) {
    return {
      userId: config.localUserId,
      organizationId: "local-development",
      role: config.localRole,
    };
  }
  // Service auth receives no implicit cross-tenant or system-admin exception.
  return null;
}

export function tenantEnforcementEnabled(
  config: DashboardTenantConfig,
  identity: ResolvedTenantIdentity | null,
): boolean {
  return config.enabled || Boolean(
    config.canaryEnabled && identity && identity.userId === config.canaryUserId,
  );
}

export async function evaluateDashboardTenantShadow(
  identity: ResolvedTenantIdentity | null,
  directory: TenantDirectory,
): Promise<DashboardTenantShadowSnapshot> {
  let decision: "allow" | "deny" = "deny";
  let reasonCode = "missing_identity";
  let accounts: TenantShadowAccounts = {
    wouldBeAccounts: [], currentCount: 0, wouldBeCount: 0, wouldHideCount: 0,
  };
  if (identity && directory.shadowAccounts) {
    try {
      accounts = await directory.shadowAccounts(identity.userId);
      decision = accounts.wouldBeCount > 0 ? "allow" : "deny";
      reasonCode = decision === "allow" ? "account_list_allowed" : "no_visible_accounts";
    } catch {
      reasonCode = "shadow_directory_unavailable";
    }
  }
  shadowSnapshot.totalEvaluations += 1;
  shadowSnapshot[decision === "allow" ? "wouldAllow" : "wouldDeny"] += 1;
  shadowSnapshot.last = {
    decision,
    reasonCode,
    wouldAllowAccounts: [...accounts.wouldBeAccounts],
    wouldHideCount: accounts.wouldHideCount,
    timestamp: new Date().toISOString(),
  };
  return dashboardTenantShadowSnapshot();
}

export function tenantCan(identity: ResolvedTenantIdentity, permission: TenantPermission): boolean {
  return ROLE_RANK[identity.role] >= ROLE_RANK[PERMISSION_ROLE[permission]];
}

export interface AccountSelection {
  accounts: ThreadsAccountOption[];
  selected: string | null;
  rejected: boolean;
}

export function selectAuthorizedAccount(
  requested: string | null,
  accounts: ThreadsAccountOption[],
  defaultAccountId: string,
  enforcementEnabled: boolean,
): AccountSelection {
  const allowed = new Set(accounts.map((account) => account.accountId));
  if (requested && !allowed.has(requested) && enforcementEnabled) {
    return { accounts, selected: null, rejected: true };
  }
  const selected = requested && allowed.has(requested)
    ? requested
    : allowed.has(defaultAccountId)
      ? defaultAccountId
      : accounts[0]?.accountId ?? (enforcementEnabled ? null : defaultAccountId);
  return { accounts, selected, rejected: false };
}
