import {
  createCipheriv, createDecipheriv, createHash, randomBytes,
} from "node:crypto";
import { escapeHtml } from "../components/layout";
import type { ResolvedTenantIdentity } from "./dashboard-tenant";
import type { ThreadsAccountOption } from "./threads-dashboard";

export const CUSTOMER_WORKSPACE_COOKIE = "__Host-takumi-workspace";

export interface CustomerWorkspaceView {
  displayName: string;
  handle: string;
  selector: string;
  current: boolean;
}

export interface CustomerWorkspaceSelection {
  selected: ThreadsAccountOption | null;
  rejected: boolean;
  expired: boolean;
}

export function customerWorkspacesContract(workspaces: CustomerWorkspaceView[]) {
  return {
    meta: { schema_version: 1 as const },
    workspaces: workspaces.map((workspace) => ({
      display_name: workspace.displayName,
      handle: workspace.handle,
      selector: workspace.selector,
      current: workspace.current,
    })),
  };
}

export function customerSessionContract(
  workspaces: CustomerWorkspaceView[], selectionExpired: boolean,
) {
  const current = workspaces.find((workspace) => workspace.current);
  return {
    meta: { schema_version: 1 as const },
    authenticated: true,
    workspace: current
      ? { display_name: current.displayName, handle: current.handle } : null,
    workspace_count: workspaces.length,
    selection_expired: selectionExpired,
  };
}

function selectorKey(secret: string): Buffer {
  return createHash("sha256").update(`customer-workspace-key-v1\n${secret}`).digest();
}

function selectorAad(identity: ResolvedTenantIdentity): Buffer {
  return Buffer.from(
    `customer-workspace-v1\n${identity.userId}\n${identity.organizationId}`,
    "utf8",
  );
}

export function workspaceSelectorToken(
  accountId: string, identity: ResolvedTenantIdentity, secret: string,
): string {
  if (!/^acct_[a-zA-Z0-9_-]+$/.test(accountId)) throw new Error("invalid account ID");
  // AES-GCM keeps the internal identifier opaque while authenticating both
  // the token and its canonical user binding.
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", selectorKey(secret), iv);
  cipher.setAAD(selectorAad(identity));
  const encrypted = Buffer.concat([
    cipher.update(accountId, "utf8"), cipher.final(),
  ]);
  return `v1.${iv.toString("base64url")}.${encrypted.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}`;
}

export function verifyWorkspaceSelector(
  token: string, identity: ResolvedTenantIdentity, secret: string,
): string | null {
  const match = /^v1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(token);
  if (!match) return null;
  try {
    const iv = Buffer.from(match[1], "base64url");
    const encrypted = Buffer.from(match[2], "base64url");
    const tag = Buffer.from(match[3], "base64url");
    if (iv.length !== 12 || tag.length !== 16 || encrypted.length === 0) return null;
    const decipher = createDecipheriv("aes-256-gcm", selectorKey(secret), iv);
    decipher.setAAD(selectorAad(identity));
    decipher.setAuthTag(tag);
    const accountId = Buffer.concat([
      decipher.update(encrypted), decipher.final(),
    ]).toString("utf8");
    return /^acct_[a-zA-Z0-9_-]+$/.test(accountId) ? accountId : null;
  } catch {
    return null;
  }
}

function cookieValue(req: Request): string | null {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === CUSTOMER_WORKSPACE_COOKIE) return value.join("=") || null;
  }
  return null;
}

export function selectCustomerWorkspace(
  req: Request,
  identity: ResolvedTenantIdentity,
  accounts: ThreadsAccountOption[],
  secret: string,
): CustomerWorkspaceSelection {
  const url = new URL(req.url);
  // Raw identifiers are never a customer-side authority or selector.
  if (url.searchParams.has("account_id") || url.searchParams.has("user_id")
    || url.searchParams.has("org_id")) {
    return { selected: null, rejected: true, expired: false };
  }
  const token = cookieValue(req);
  if (!token) {
    return {
      selected: accounts.length === 1 ? accounts[0] : null,
      rejected: false,
      expired: false,
    };
  }
  const accountId = verifyWorkspaceSelector(token, identity, secret);
  if (!accountId) return { selected: null, rejected: true, expired: false };
  const selected = accounts.find((account) => account.accountId === accountId) ?? null;
  return { selected, rejected: false, expired: selected === null };
}

export function customerWorkspaceCookie(token: string, secure = true): string {
  return `${CUSTOMER_WORKSPACE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure ? "; Secure" : ""}`;
}

export function clearCustomerWorkspaceCookie(secure = true): string {
  return `${CUSTOMER_WORKSPACE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

export function customerWorkspaceViews(
  accounts: ThreadsAccountOption[],
  selectedAccountId: string | null,
  identity: ResolvedTenantIdentity,
  secret: string,
): CustomerWorkspaceView[] {
  return accounts.map((account) => ({
    displayName: account.displayName || "Threadsアカウント",
    handle: account.handle
      ? (account.handle.startsWith("@") ? account.handle : `@${account.handle}`) : "",
    selector: workspaceSelectorToken(account.accountId, identity, secret),
    current: account.accountId === selectedAccountId,
  }));
}

export function renderCustomerLogin(): string {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#070b14"><title>匠 Technologies | AI SNS運用</title><style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 75% 10%,#172554 0,transparent 35%),#070b14;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic",sans-serif}.login{width:min(560px,100%);padding:44px;border:1px solid #26334b;border-radius:28px;background:rgba(15,23,42,.88);box-shadow:0 30px 80px rgba(0,0,0,.35)}.brand{font-size:14px;font-weight:800;letter-spacing:.06em;color:#93c5fd}.login h1{font-size:clamp(30px,7vw,48px);line-height:1.15;margin:20px 0 16px}.login p{color:#cbd5e1;line-height:1.8;margin:0 0 30px}.login a{display:block;text-align:center;padding:16px 22px;border-radius:14px;background:#2563eb;color:white;text-decoration:none;font-weight:800}.login small{display:block;margin-top:16px;text-align:center;color:#94a3b8;line-height:1.6}@media(max-width:560px){.login{padding:30px 22px;border-radius:22px}}
  </style></head><body><main class="login"><div class="brand">匠 Technologies | AI SNS運用</div><h1>SNS運用の状況を、ひとつの画面で。</h1><p>投稿の進み具合や反応、次の改善内容をわかりやすく確認できます。</p><a href="/">ログインする</a><small>登録済みのメールアドレスでログインしてください</small></main></body></html>`;
}

export function renderWorkspaceChoice(
  workspaces: CustomerWorkspaceView[], csrf: string, expired = false,
): string {
  if (workspaces.length === 0) {
    return `<section class="workspace-choice empty"><p class="workspace-kicker">匠 Technologies | AI SNS運用</p><h1>表示できるアカウントがありません</h1><p>ご利用のメールアドレスに運用アカウントがまだ登録されていません。担当者へお問い合わせください。</p></section>`;
  }
  return `<section class="workspace-choice"><p class="workspace-kicker">匠 Technologies | AI SNS運用</p><h1>運用するアカウントを選ぶ</h1><p>${expired ? "前に選んだアカウントは現在利用できません。利用できるアカウントを選び直してください。" : "確認したいアカウントを選んでください。"}</p><div class="workspace-grid">${workspaces.map((workspace) => `<form method="post" action="/api/customer/workspaces/select"><input type="hidden" name="csrf_token" value="${escapeHtml(csrf)}"><input type="hidden" name="selector" value="${escapeHtml(workspace.selector)}"><button type="submit"><b>${escapeHtml(workspace.displayName)}</b>${workspace.handle ? `<span>${escapeHtml(workspace.handle)}</span>` : ""}<em>このアカウントを開く →</em></button></form>`).join("")}</div></section>`;
}

export const customerWorkspaceStyles = `
.workspace-choice{max-width:980px;margin:7vh auto;padding:42px;border:1px solid var(--c-line,#293449);border-radius:26px;background:var(--c-panel,#111827);color:var(--c-text,#f8fafc)}.workspace-choice h1{font-size:34px;margin:8px 0}.workspace-choice>p:not(.workspace-kicker){color:var(--c-muted,#94a3b8)}.workspace-kicker{font-size:12px;font-weight:800;letter-spacing:.08em;color:var(--c-brand,#82a5ff)}.workspace-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:28px}.workspace-grid button{width:100%;min-height:150px;text-align:left;padding:22px;border:1px solid var(--c-line,#293449);border-radius:18px;background:var(--c-raised,#141d2d);color:inherit;cursor:pointer}.workspace-grid button:hover{border-color:var(--c-brand,#82a5ff)}.workspace-grid b,.workspace-grid span,.workspace-grid em{display:block}.workspace-grid b{font-size:19px}.workspace-grid span{margin-top:5px;color:var(--c-muted,#94a3b8)}.workspace-grid em{margin-top:25px;color:var(--c-brand,#82a5ff);font-style:normal;font-weight:800}.customer-workspace{margin:4px 0 8px;padding:13px;border:1px solid var(--c-line,#e2e8f0);border-radius:14px;background:var(--c-panel-soft,#f8fafc)}.customer-workspace summary>small{display:block;font-size:var(--t-type-caption-size,12px);color:var(--c-muted,#64748b);font-weight:700}.customer-workspace summary{cursor:pointer;list-style:none}.customer-workspace summary::-webkit-details-marker{display:none}.customer-workspace-current{display:block;margin-top:4px;font-weight:800;color:var(--c-text,#111827)}.customer-workspace-handle{display:block;font-size:12px;color:var(--c-muted,#64748b)}.customer-workspace-list{display:grid;gap:8px;margin-top:12px}.customer-workspace-list form{margin:0}.customer-workspace-list button{width:100%;text-align:left;padding:10px;border:1px solid var(--c-line,#e2e8f0);border-radius:10px;background:var(--c-panel,#fff);color:var(--c-text,#111827);cursor:pointer}.customer-workspace-list button[disabled]{opacity:.62;cursor:default}.customer-workspace-list button b,.customer-workspace-list button span{display:block}.customer-workspace-list button span{font-size:var(--t-type-caption-size,12px);color:var(--c-muted,#64748b)}
@media(max-width:700px){.workspace-choice{margin:20px auto;padding:25px 18px}.workspace-choice h1{font-size:27px}.customer-workspace{margin:0;min-width:220px}}
`;
