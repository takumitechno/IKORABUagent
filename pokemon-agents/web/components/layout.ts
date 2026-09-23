/**
 * Paperclip-inspired layout: 左 sidebar + main content area
 * - 240px sidebar (sections: Overview / Work / Agents / Company)
 * - main は max-w-7xl 相当の余裕、padding 24px
 * - design tokens (CSS vars: --bg, --fg, --muted, --border, --accent)
 */

import { icon } from "./icons";
import { baseComponents, designTokens } from "./design-tokens";
import type { CustomerWorkspaceView } from "../lib/customer-workspaces";

export const DASHBOARD_STYLESHEET_VERSION = "stage-b-20260923";

export function dashboardStylesheetHref(): string {
  return `/styles.css?v=${DASHBOARD_STYLESHEET_VERSION}`;
}

interface NavItem {
  href: string;
  label: string;
  iconName: string;
  badge?: number | string;
  active?: boolean;
  children?: NavItem[];
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

function buildNav(currentPath: string, badges: { approvals: number; running: number }): NavSection[] {
  const pathOnly = currentPath.split("?")[0];
  return [
    {
      items: [
        { href: "/#overview",   label: "運用サマリー",   iconName: "activity",  active: pathOnly === "/" },
        { href: "/#pipeline",   label: "投稿パイプライン", iconName: "list" },
        { href: "/#morning-report", label: "投稿実績・KPI", iconName: "activity" },
        { href: "/improvement", label: "AI改善レポート",  iconName: "zap", active: pathOnly === "/improvement" },
        { href: "/#operations", label: "次回テスト",      iconName: "knowledge" },
      ],
    },
  ];
}

export interface LayoutOpts {
  title: string;
  body: string;
  /** Server-verified access to the internal HQ. Defaults to false. */
  internalAccessAllowed?: boolean;
  /** Server-issued token for authenticated internal mutation requests only. */
  csrfToken?: string;
  /** Sanitized, server-authorized customer workspaces. */
  customerWorkspaces?: CustomerWorkspaceView[];
  flash?: { type: "ok" | "err"; msg: string };
  currentPath: string;
  badges?: {
    approvals: number;
    running: number;
    totalAgents?: number;
    activeAgents?: number;
    healthPct?: number;
    healthMood?: string;
    events24h?: number;
    errors7d?: number;
  };
}

export function renderLayout(opts: LayoutOpts): string {
  const badges = opts.badges || { approvals: 0, running: 0 };
  const nav = buildNav(opts.currentPath, badges);
  const pathOnly = opts.currentPath.split("?")[0];
  const isCustomerDashboard = pathOnly === "/" || pathOnly === "/improvement";
  const isInternalOperations = pathOnly === "/internal";
  const internalHomeButton = isCustomerDashboard
    ? opts.internalAccessAllowed
      ? `<a href="/internal" class="nav-item office-back-button" data-nav="home">
        <span class="nav-icon-chip office-icon" aria-hidden="true">🏢</span>
        <span class="nav-label">オフィスに戻る</span>
      </a>`
      : ""
    : `<a href="/internal" class="nav-item internal-home-button ${isInternalOperations ? "active" : ""}" data-nav="home"${isInternalOperations ? ' aria-current="page"' : ""}>
        <span class="nav-icon-chip">${icon("home", "size-4")}</span>
        <span class="nav-label">トップページ</span>
      </a>`;
  const browserTitle = isCustomerDashboard
    ? "Takumi Technologies | AI SNS運用"
    : "Takumi Technologies HQ | Mission Control";
  const brandName = isCustomerDashboard ? "Takumi Technologies" : "Takumi Technologies HQ";
  const brandContext = isCustomerDashboard ? "AI SNS運用" : "Mission Control";
  const brandMarkSrc = isCustomerDashboard
    ? "/brand/takumi-mark-compact.png?v=brand03"
    : "/brand/takumi-mark.png";
  const currentWorkspace = opts.customerWorkspaces?.find((workspace) => workspace.current);
  const workspaceSwitcher = isCustomerDashboard && currentWorkspace
    ? `<details class="customer-workspace"${opts.customerWorkspaces!.length === 1 ? " open" : ""}>
        <summary><small>現在のアカウント</small><span class="customer-workspace-current">${escapeHtml(currentWorkspace.displayName)}</span>${currentWorkspace.handle ? `<span class="customer-workspace-handle">${escapeHtml(currentWorkspace.handle)}</span>` : ""}</summary>
        ${opts.customerWorkspaces!.length > 1 ? `<div class="customer-workspace-list">${opts.customerWorkspaces!.map((workspace) => `<form method="post" action="/api/customer/workspaces/select"><input type="hidden" name="selector" value="${escapeHtml(workspace.selector)}"><input type="hidden" name="csrf_token" value="${escapeHtml(opts.csrfToken || "")}"><button type="submit"${workspace.current ? " disabled aria-current=\"true\"" : ""}><b>${escapeHtml(workspace.displayName)}</b>${workspace.handle ? `<span>${escapeHtml(workspace.handle)}</span>` : ""}</button></form>`).join("")}</div>` : ""}
      </details>` : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(browserTitle)}</title>
  <meta name="application-name" content="${escapeHtml(brandName)}">
  <meta name="theme-color" content="#0b0f14">
  ${isCustomerDashboard ? `<script>(()=>{try{const saved=localStorage.getItem('takumi-customer-theme');const theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.customerTheme=theme}catch(_){}})();</script>` : ""}
  <link rel="icon" type="image/png" href="${brandMarkSrc}">
  <link rel="apple-touch-icon" href="${brandMarkSrc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=LINE+Seed+JP:wght@400;700&display=swap">
  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
  <style>${designTokens}${baseComponents}</style>
  <link rel="stylesheet" href="${dashboardStylesheetHref()}">
</head>
<body class="${isCustomerDashboard ? "customer-shell" : "internal-shell"}">
  <div class="app">
    <aside class="sidebar">
      <a href="/" class="sidebar-header" style="text-decoration:none;color:inherit;display:block;">
        <div class="brand">
          <span class="brand-mark">
            <img src="${brandMarkSrc}" alt="" width="34" height="34">
          </span>
          <span class="brand-name">${brandName}</span>
        </div>
        <div class="brand-sub">${brandContext}</div>
      </a>
      ${internalHomeButton}
      ${workspaceSwitcher}
      <nav class="sidebar-nav">
        ${nav
          .map(
            (section) => `
          ${section.label ? `<div class="nav-section-label">${escapeHtml(section.label)}</div>` : ""}
          <div class="nav-section">
            ${section.items
              .map(
                (item) => `<a href="${item.href}" class="nav-item ${item.active ? "active" : ""}" data-nav="${item.iconName}">
                  <span class="nav-icon-chip">${icon(item.iconName, "size-4")}</span>
                  <span class="nav-label">${escapeHtml(item.label)}</span>
                  ${item.badge ? `<span class="nav-badge">${escapeHtml(String(item.badge))}</span>` : ""}
                </a>${
                  item.children && item.children.length > 0
                    ? `<div class="nav-children">${item.children
                        .map(
                          (c) => `<a href="${c.href}" class="nav-child ${c.active ? "active" : ""}">
                          <span class="nav-icon-chip nav-icon-chip-sm">${icon(c.iconName, "size-4")}</span>
                          <span class="nav-label">${escapeHtml(c.label)}</span>
                        </a>`,
                        )
                        .join("")}</div>`
                    : ""
                }`,
              )
              .join("")}
          </div>
        `,
          )
          .join("")}
      </nav>
      <div class="sidebar-footer">
        <div class="sys-status-card">
          <span class="sys-status-mark" style="background:#dcfce7;color:#166534;">${icon("activity", "size-4")}</span>
          <div class="sys-status-body">
            <div class="sys-status-label">${isCustomerDashboard ? "運用ステータス" : "AI運用"}</div>
            <div class="sys-status-state">${isCustomerDashboard ? "画面内で確認" : '<span class="sys-status-dot"></span> 稼働中'}</div>
          </div>
        </div>
        ${isCustomerDashboard ? "" : '<div class="env-pill"><span class="dot dot-on"></span> Threads 接続済み</div>'}
      </div>
    </aside>
    <main class="main" id="main">
      ${opts.flash ? `<div class="flash ${opts.flash.type}">${escapeHtml(opts.flash.msg)}</div>` : ""}
      <div id="live-content">${opts.body}</div>
    </main>
  </div>
  ${opts.csrfToken ? `<meta name="csrf-token" content="${escapeHtml(opts.csrfToken)}">` : ""}
  ${opts.csrfToken ? `<script>${internalSecurityScript(opts.csrfToken)}</script>` : ""}
  ${isCustomerDashboard ? "" : `<script>${liveScript(opts.currentPath)}</script>`}
</body>
</html>`;
}

function internalSecurityScript(token: string): string {
  return `
(() => {
  const csrf = ${JSON.stringify(token)};
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    const method = String(init.method || (typeof input === 'string' ? 'GET' : input.method) || 'GET').toUpperCase();
    if (url.origin === location.origin && !['GET','HEAD','OPTIONS'].includes(method)) {
      const headers = new Headers(init.headers || (typeof input === 'string' ? undefined : input.headers));
      headers.set('X-CSRF-Token', csrf);
      init = { ...init, headers };
    }
    return nativeFetch(input, init);
  };
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || String(form.method).toUpperCase() !== 'POST') return;
    let field = form.querySelector('input[name="csrf_token"]');
    if (!field) {
      field = document.createElement('input');
      field.type = 'hidden';
      field.name = 'csrf_token';
      form.appendChild(field);
    }
    field.value = csrf;
  }, true);
})();`;
}

/**
 * Live update client script.
 * - /api/events に EventSource で接続
 * - dashboard / heartbeat ページ では event 受信時に該当 fragment を fetch & swap
 * - sidebar の badge も更新
 * - 接続 indicator (live-dot / live-text) を更新
 */
function liveScript(currentPath: string): string {
  // 注: "/" (overview) は overview.ts 自身が SSE で部分更新するので live swap は OFF
  const isLive = currentPath === "/heartbeat";
  return `
(() => {
  const dot = document.getElementById('live-dot');
  const txt = document.getElementById('live-text');
  const isLive = ${JSON.stringify(isLive)};
  const fragmentUrl = ${JSON.stringify(currentPath === "/" ? "/api/fragments/dashboard" : "/api/fragments/heartbeat")};
  let es = null;
  let reconnectTimer = null;
  let lastSwap = 0;

  function setStatus(state) {
    if (!dot || !txt) return;
    dot.className = 'dot ' + (state === 'on' ? 'dot-on' : 'dot-off');
    txt.textContent = state === 'on' ? 'live' : (state === 'reconnect' ? 'reconnect…' : 'offline');
  }

  function refreshBadges() {
    fetch('/api/fragments/badges').then(r => r.json()).then(b => {
      // sidebar nav badges を更新
      document.querySelectorAll('.nav-item').forEach(a => {
        const href = a.getAttribute('href');
        const badge = a.querySelector('.nav-badge');
        let count = 0;
        if (href === '/approvals' || href === '/inbox') count = b.approvals;
        else if (href === '/') count = b.running;
        if (count > 0) {
          if (badge) badge.textContent = count;
          else {
            const el = document.createElement('span');
            el.className = 'nav-badge';
            el.textContent = count;
            a.appendChild(el);
          }
        } else if (badge) {
          badge.remove();
        }
      });
    }).catch(() => {});
  }

  function refreshFragment() {
    if (!isLive) return refreshBadges();
    // throttle: 連続変化があっても 800ms 以内は無視
    const now = Date.now();
    if (now - lastSwap < 800) return;
    lastSwap = now;
    fetch(fragmentUrl).then(r => r.text()).then(html => {
      const el = document.getElementById('live-content');
      if (el) el.innerHTML = html;
    }).catch(() => {});
    refreshBadges();
  }

  function connect() {
    setStatus('reconnect');
    es = new EventSource('/api/events');
    es.onopen = () => setStatus('on');
    es.onerror = () => {
      setStatus('off');
      try { es.close(); } catch (_) {}
      // backoff 3s
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, 3000);
    };
    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.hello) return; // 接続初期 ping
        refreshFragment();
      } catch (_) {}
    };
  }

  connect();
  // tab が visible に戻った時 force refresh
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshFragment();
  });
})();
`;
}

export function escapeHtml(s: string | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ステータスの日本語表示
const STATUS_JP: Record<string, string> = {
  // 仮説ライフサイクル (新)
  pending_review: "承認待ち",
  validated: "勝ち",
  falsified: "負け",
  abandoned: "取り下げ",
  // task/run 系 (新 schema)
  queued: "待機",
  running: "実行中",
  completed: "完了",
  failed: "失敗",
  timeout: "タイムアウト",
  budget_halted: "予算超過",
  skipped: "スキップ",
  cancelled: "キャンセル",
  // legacy agent_runs status
  success: "完了",
  error: "失敗",
  partial_fix: "部分修正",
  partial_pass: "部分合格",
  sendback: "差し戻し",
  bootstrap: "初期化",
  fixed: "修正済み",
  failure: "失敗",
  // approval/issue/hypothesis 系
  pending: "承認待ち",
  approved: "承認済み",
  applied: "適用済み",
  rejected: "却下",
  expired: "期限切れ",
  proposed: "提案中",
  selected: "選抜済み",
  awaiting_approval: "承認待ち",
  executing: "実行中",
  measuring: "計測中",
  inconclusive: "判定不能",
  aborted: "中止",
  reverted: "差し戻し",
  // issue
  todo: "未着手",
  in_progress: "進行中",
  in_review: "レビュー中",
  blocked: "ブロック",
  done: "完了",
  // generic
  active: "稼働中",
  disabled: "停止",
  draft: "下書き",
  deprecated: "廃止",
  resolved: "解決済み",
  dismissed: "却下",
  warning: "警告",
  halted: "停止",
};

const DEPT_JP: Record<string, string> = {
  subsidy: "補助金",
  benefit: "給付金",
  editorial: "記事編集",
  permit: "許認可",
  hypothesis: "仮説ライン",
  audit: "監査",
  backlink: "被リンク",
  "seo-metrics": "SEO計測",
  "content-refine": "コンテンツ改善",
  "keyword-research": "キーワード調査",
  outreach: "アライアンス",
  chat: "対話",
};

const ROLE_JP: Record<string, string> = {
  writer: "執筆",
  reviewer: "レビュー",
  publisher: "配信",
  orchestrator: "統括",
  validator: "検証",
  hypothesizer: "仮説生成",
  selector: "選抜",
  supervisor: "観測",
  executor: "改修実行",
  researcher: "調査",
  optimizer: "最適化",
  outreach: "開拓",
  auditor: "監査",
  solo: "単独",
};

export function jpStatus(s: string): string {
  return STATUS_JP[s] || s;
}
export function jpDept(s: string): string {
  return DEPT_JP[s] || s;
}
export function jpRole(s: string): string {
  return ROLE_JP[s] || s;
}

// status → 正規の CSS class 名 (legacy も全部このマップに乗せる)
const STATUS_CLASS: Record<string, string> = {
  // 仮説ライフサイクル (新)
  pending_review: "pending",
  abandoned: "skipped",
  // 完了系 (緑)
  success: "completed", completed: "completed", validated: "completed",
  approved: "completed", applied: "completed", fixed: "completed",
  done: "completed", resolved: "completed", active: "completed",
  selected: "completed",
  // 失敗系 (赤)
  error: "failed", failed: "failed", failure: "failed",
  timeout: "failed", falsified: "failed", reverted: "failed",
  // 警告系 (橙)
  partial_fix: "warning", partial_pass: "warning", sendback: "warning",
  warning: "warning", budget_halted: "budget_halted", halted: "budget_halted",
  // 却下/拒否 (濃赤)
  rejected: "rejected",
  // 保留系 (黄)
  pending: "pending", proposed: "pending", awaiting_approval: "pending",
  in_review: "pending",
  // 実行中 (青)
  running: "running", executing: "running", measuring: "running",
  in_progress: "in_progress",
  // 待機 (灰)
  queued: "queued", todo: "queued", draft: "queued",
  // スキップ/キャンセル (薄灰)
  cancelled: "skipped", skipped: "skipped", dismissed: "skipped",
  expired: "skipped", inconclusive: "skipped", aborted: "skipped",
  disabled: "skipped", deprecated: "skipped",
  // その他
  blocked: "blocked", bootstrap: "pending",
};

export function statusBadge(status: string): string {
  const cls = STATUS_CLASS[status] || "queued";
  const iconMark = cls === "completed" ? "✓"
    : cls === "running" || cls === "in_progress" ? "↻"
      : cls === "failed" || cls === "rejected" || cls === "blocked" ? "!"
        : cls === "warning" || cls === "budget_halted" || cls === "pending" ? "△"
          : "•";
  return `<span class="badge ${cls}"><span aria-hidden="true">${iconMark}</span><span>${escapeHtml(jpStatus(status))}</span></span>`;
}

export function fmtDuration(ms: number | null): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60_000)}m`;
}

export function fmtCost(usd: number | null): string {
  if (usd == null) return "—";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

export function fmtCents(cents: number | null): string {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

export function fmtInterval(sec: number | null): string {
  if (sec == null) return "—";
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  if (sec < 86400) return `${Math.round(sec / 3600)}h`;
  return `${Math.round(sec / 86400)}d`;
}

export function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso.replace(" ", "T"));
  const diff = Date.now() - date.getTime();
  if (diff < 0) {
    const fwd = Math.abs(diff);
    if (fwd < 60_000) return `in ${Math.round(fwd / 1000)}s`;
    if (fwd < 3_600_000) return `in ${Math.round(fwd / 60_000)}m`;
    return `in ${Math.round(fwd / 3_600_000)}h`;
  }
  if (diff < 60_000) return `${Math.round(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h ago`;
  return `${Math.round(diff / 86_400_000)}d ago`;
}
