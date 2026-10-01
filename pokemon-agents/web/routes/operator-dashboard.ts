import { escapeHtml } from "../components/layout";
import { statusBadge } from "../components/primitives";
import type {
  NightBatchItem, ThreadsActivity, ThreadsContent, ThreadsDashboardData,
} from "../lib/threads-dashboard";

export const OPERATOR_ACCOUNT_IDS = ["acct_8ssana", "acct_taku_ai_tech"] as const;

type Tone = "ok" | "warn" | "bad" | "neutral";
type NextAction = { label: string; detail: string | null; tone: Tone };

const UNKNOWN = "UNKNOWN";
const EVENT_LABELS: Record<string, string> = {
  candidate_generated: "Generated candidate",
  content_generated: "Generated candidate",
  human_approved: "Human approved",
  content_approved: "Human approved",
  batch_created: "Batch created",
  night_batch_created: "Batch created",
  account_armed_for_live: "Account armed",
  account_disarmed: "Account disarmed",
  publish_succeeded: "Published to Threads",
  publication_succeeded: "Published to Threads",
  readback_confirmed: "Readback confirmed",
  insights_collected: "Insights collected",
  metrics_imported: "Insights collected",
  safety_stop_engaged: "Safety stop engaged",
  safety_stop_released: "Safety stop released",
};

function value(input: string | number | null | undefined): string {
  return input === null || input === undefined || input === "" ? UNKNOWN : String(input);
}

function fmt(iso: string | null | undefined): string {
  if (!iso || Number.isNaN(Date.parse(iso))) return UNKNOWN;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso)) + " JST";
}

function badge(label: string, tone: Tone = "neutral", icon?: string): string {
  const mark = icon ?? (tone === "ok" ? "✓" : tone === "warn" ? "◷" : tone === "bad" ? "!" : "•");
  return statusBadge({ status: tone === "bad" ? "serious" : tone, icon: mark, label });
}

function stateTone(state: string | null | undefined): Tone {
  const normalized = (state ?? "").toLowerCase();
  if (["ready", "succeeded", "metrics_collected", "clear", "healthy", "active", "pass"].includes(normalized)) return "ok";
  if (["unknown", "missing", "backend_unavailable", "failed", "ambiguous", "corrupt", "stopped"].includes(normalized)) return "bad";
  if (["pending", "waiting", "metrics_pending", "human_approval_pending", "disarmed", "inactive"].includes(normalized)) return "warn";
  return "neutral";
}

function latestContent(data: ThreadsDashboardData): ThreadsContent | null {
  return [...data.contents].sort((a, b) => (b.updatedAt ?? b.createdAt ?? "").localeCompare(a.updatedAt ?? a.createdAt ?? ""))[0] ?? null;
}

function latestBatch(data: ThreadsDashboardData): NightBatchItem | null {
  return [...data.operations.nightBatchItems].sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))[0] ?? null;
}

export function deriveOperatorNextAction(data: ThreadsDashboardData): NextAction {
  const content = latestContent(data), batch = latestBatch(data);
  if (!data.connected || !data.safety.available) return { label: "Reconciliation required", detail: "Status is incomplete", tone: "bad" };
  if (data.safety.unresolvedAmbiguous || data.safety.globalStop || data.safety.accountStop || data.safety.capabilityStop
    || content?.publication?.status === "ambiguous") {
    return { label: "Reconciliation required", detail: "Resolve the reported safety or publication state", tone: "bad" };
  }
  if (content?.state === "human_approval_pending" || (content && !content.approved && content.state !== "metrics_pending")) {
    return { label: "Human approval required", detail: content.contentId, tone: "warn" };
  }
  if (content?.state === "metrics_pending") {
    return { label: "Await insights maturity", detail: content.metricsEligibleAt ? fmt(content.metricsEligibleAt) : null, tone: "warn" };
  }
  if (batch?.status === "pending") return { label: "Batch scheduled", detail: fmt(batch.scheduledAt), tone: "ok" };
  if (!content) return { label: "Review generated content", detail: "No recent content returned", tone: "warn" };
  if (content.state === "publish_ready") return { label: "Ready to create finite batch", detail: content.contentId, tone: "ok" };
  if (data.operator.armed === false && data.operator.publishCredential.ready === true
    && data.operator.readyForDryRun === true) {
    return { label: "Ready to arm", detail: "Future operator action", tone: "ok" };
  }
  return { label: "No action required", detail: null, tone: "ok" };
}

function keyValue(label: string, content: string, mono = false): string {
  return `<div class="op-kv"><dt>${escapeHtml(label)}</dt><dd${mono ? ' class="op-mono" title="' + escapeHtml(content) + '"' : ""}>${escapeHtml(content)}</dd></div>`;
}

function metricSummary(content: ThreadsContent | null): string {
  if (!content || Object.keys(content.metrics).length === 0) return UNKNOWN;
  const keys = ["views", "likes", "replies", "reposts"] as const;
  return keys.filter((key) => typeof content.metrics[key] === "number")
    .map((key) => `${key} ${content.metrics[key]}`).join(" · ") || UNKNOWN;
}

function safetyStatus(data: ThreadsDashboardData): { label: string; tone: Tone } {
  if (!data.safety.available) return { label: UNKNOWN, tone: "bad" };
  if (data.safety.globalStop || data.safety.accountStop || data.safety.capabilityStop) return { label: "STOPPED", tone: "bad" };
  if (data.safety.unresolvedAmbiguous) return { label: "RECONCILE", tone: "bad" };
  return { label: "SAFETY CLEAR", tone: "ok" };
}

function automationStatus(data: ThreadsDashboardData): { label: string; tone: Tone } {
  const runners = data.operator.runners;
  if (!runners.length) return { label: UNKNOWN, tone: "bad" };
  if (runners.some((runner) => runner.healthy === true)) return { label: "RUNNING", tone: "ok" };
  if (runners.every((runner) => ["disabled", "stopped", "inactive"].includes(runner.state))) return { label: "OFF", tone: "neutral" };
  return { label: "ATTENTION", tone: "warn" };
}

function renderNextAction(data: ThreadsDashboardData): string {
  const next = deriveOperatorNextAction(data);
  return `<section class="op-next op-next-${next.tone}" aria-label="Next operator action"><span>NEXT ACTION</span><strong>${escapeHtml(next.label)}</strong>${next.detail ? `<small>${escapeHtml(next.detail)}</small>` : ""}</section>`;
}

function renderSafetyStatus(data: ThreadsDashboardData): string {
  const safety = safetyStatus(data);
  return `<section class="op-section"><h3>Safety</h3><div class="op-badges">${badge(safety.label, safety.tone)}${badge(data.operator.armed === null ? "ARMED UNKNOWN" : data.operator.armed ? "ARMED" : "DISARMED", data.operator.armed === null ? "bad" : data.operator.armed ? "warn" : "ok")}</div><dl class="op-list">${keyValue("Account", value(data.accountStatus))}${keyValue("Global stop", data.safety.available ? String(data.safety.globalStop) : UNKNOWN)}${keyValue("Account stop", data.safety.available ? String(data.safety.accountStop) : UNKNOWN)}${keyValue("Capability stop", data.safety.available ? String(data.safety.capabilityStop) : UNKNOWN)}${keyValue("Publication ambiguity", data.safety.available ? String(data.safety.unresolvedAmbiguous) : UNKNOWN)}</dl></section>`;
}

function renderPipeline(data: ThreadsDashboardData): string {
  const content = latestContent(data), batch = latestBatch(data);
  return `<section class="op-section"><h3>Current pipeline</h3><div class="op-primary-grid"><div><span>Stage</span>${badge(value(content?.state), stateTone(content?.state))}</div><div><span>Approval</span>${badge(content ? (content.approved ? "APPROVED" : "REQUIRED") : UNKNOWN, content?.approved ? "ok" : content ? "warn" : "bad")}</div><div><span>Latest result</span>${badge(value(content?.publication?.status), stateTone(content?.publication?.status))}</div><div><span>Insights</span>${badge(value(content?.state === "metrics_collected" ? "METRICS_COLLECTED" : content?.state === "metrics_pending" ? "METRICS_PENDING" : null), content?.state === "metrics_collected" ? "ok" : content?.state === "metrics_pending" ? "warn" : "bad")}</div></div><dl class="op-list">${keyValue("Content / version", content ? `${content.contentId} / v${value(content.version)}` : UNKNOWN, true)}${keyValue("Content attempt", value(content?.attempt))}${keyValue("NIGHT batch", batch ? `${batch.batchId} · ${batch.status}` : UNKNOWN, true)}${keyValue("Batch item", batch ? `${batch.itemId} · ${fmt(batch.scheduledAt)}` : UNKNOWN, true)}${keyValue("Batch attempts", value(batch?.attemptCount))}</dl></section>`;
}

function renderPublication(data: ThreadsDashboardData): string {
  const content = latestContent(data), publication = content?.publication ?? null;
  return `<section class="op-section"><h3>Publication & insights</h3><dl class="op-list">${keyValue("Internal publication", value(publication?.publicationId), true)}${keyValue("Provider post", value(publication?.externalId), true)}${keyValue("Confirmation / readback", value(publication?.readbackStatus))}${keyValue("Duplicate", publication?.duplicate === undefined || publication?.duplicate === null ? UNKNOWN : String(publication.duplicate))}${keyValue("Earliest collection", fmt(content?.metricsEligibleAt))}${keyValue("Last collected", fmt(content?.metricsFetchedAt))}${keyValue("Metrics", metricSummary(content))}</dl></section>`;
}

function renderTechnical(data: ThreadsDashboardData): string {
  const automation = automationStatus(data);
  const runnerText = data.operator.runners.map((runner) => `${runner.name}: ${runner.state}${runner.runStatus ? `/${runner.runStatus}` : ""}`).join(" · ") || UNKNOWN;
  const rate = data.safety.rateGuardReady
    ? `${value(data.safety.hourlyLimit)}/h · ${value(data.safety.dailyLimit)}/day · ${value(data.safety.minIntervalSeconds)}s min`
    : UNKNOWN;
  return `<details class="op-technical"><summary>Technical details</summary><dl class="op-list">${keyValue("Provider identity", data.operator.providerUsername ? `Threads @${data.operator.providerUsername}${data.operator.providerUserId ? ` · ${data.operator.providerUserId}` : ""}` : UNKNOWN, true)}${keyValue("Publish credential", value(data.operator.publishCredential.state))}${keyValue("Insights credential", value(data.operator.insightsCredential.state))}${keyValue("Threads SHA", value(data.operator.gitSha), true)}${keyValue("Deployment path", value(data.operator.deploymentPath), true)}${keyValue("Schema", data.operator.schemaVersion === null ? value(data.operator.schemaReadiness) : `v${data.operator.schemaVersion} ${value(data.operator.schemaReadiness)}`)}${keyValue("Automation", automation.label)}${keyValue("Tasks", runnerText)}${keyValue("Writer policy", value(data.operator.writerPolicyStatus))}${keyValue("Publish rate", rate)}${keyValue("Rolling usage", `${value(data.operations.publicationsLastHour)}/h · ${value(data.operations.publicationsLast24h)}/24h`)}</dl></details>`;
}

function renderAccountCard(data: ThreadsDashboardData): string {
  const safety = safetyStatus(data), automation = automationStatus(data);
  return `<article class="op-account" data-account-id="${escapeHtml(data.accountId)}"><div class="op-account-top"><header class="op-account-head"><div><span class="op-eyebrow">THREADS ACCOUNT</span><h2>@${escapeHtml(data.handle ?? data.accountId)}</h2><p>${escapeHtml(data.displayName ?? "Identity unavailable")} · <code>${escapeHtml(data.accountId)}</code></p></div><div class="op-badges">${badge(safety.label, safety.tone)}${badge(automation.label, automation.tone, "◉")}</div></header>${renderNextAction(data)}</div><div class="op-sections">${renderSafetyStatus(data)}${renderPipeline(data)}${renderPublication(data)}</div>${renderTechnical(data)}</article>`;
}

type TimelineItem = ThreadsActivity & { account: string };

function activityItems(data: ThreadsDashboardData): TimelineItem[] {
  const items: TimelineItem[] = data.activities
    .filter((item) => EVENT_LABELS[item.type])
    .map((item) => ({ ...item, entityId: null, detail: null, account: data.handle ?? data.accountId }));
  const content = latestContent(data), batch = latestBatch(data), publication = content?.publication;
  if (content) items.push({ type: content.approved ? "human_approved" : "candidate_generated", at: content.updatedAt ?? content.createdAt, entityId: content.contentId, detail: content.state, account: data.handle ?? data.accountId });
  if (batch) items.push({ type: "batch_created", at: batch.attemptedAt ?? batch.scheduledAt, entityId: batch.batchId, detail: batch.status, account: data.handle ?? data.accountId });
  if (publication) items.push({ type: "publish_succeeded", at: publication.publishedAt ?? publication.createdAt, entityId: publication.publicationId ?? publication.externalId, detail: publication.status, account: data.handle ?? data.accountId });
  if (content?.metricsFetchedAt) items.push({ type: "insights_collected", at: content.metricsFetchedAt, entityId: content.contentId, detail: metricSummary(content), account: data.handle ?? data.accountId });
  return items;
}

function renderTimeline(accounts: ThreadsDashboardData[]): string {
  const items = accounts.flatMap(activityItems).sort((a, b) => (b.at ?? "").localeCompare(a.at ?? "")).slice(0, 10);
  if (!items.length) return `<p class="op-empty">No recent activity returned.</p>`;
  return `<ol class="op-timeline">${items.map((item) => `<li><span class="op-dot" aria-hidden="true"></span><time>${escapeHtml(fmt(item.at))}</time><div><strong>${escapeHtml(EVENT_LABELS[item.type] ?? item.type.replaceAll("_", " "))}</strong><p>@${escapeHtml(item.account)}${item.detail ? ` · ${escapeHtml(item.detail)}` : ""}</p>${item.entityId ? `<code title="${escapeHtml(item.entityId)}">${escapeHtml(item.entityId)}</code>` : ""}</div></li>`).join("")}</ol>`;
}

function globalSchema(accounts: ThreadsDashboardData[]): string {
  const known = accounts.filter((account) => account.operator.schemaVersion !== null && account.operator.schemaReadiness);
  if (known.length !== accounts.length) return UNKNOWN;
  const first = known[0];
  if (!first || known.some((account) => account.operator.schemaVersion !== first.operator.schemaVersion
    || account.operator.schemaReadiness !== first.operator.schemaReadiness)) return "MIXED";
  return `v${first.operator.schemaVersion} ${first.operator.schemaReadiness}`;
}

function globalKill(accounts: ThreadsDashboardData[]): { label: string; tone: Tone } {
  if (accounts.some((account) => account.safety.available && account.safety.globalStop)) return { label: "GLOBAL STOP", tone: "bad" };
  if (accounts.some((account) => !account.safety.available)) return { label: UNKNOWN, tone: "bad" };
  return { label: "CLEAR", tone: "ok" };
}

export function renderOperatorDashboard(accounts: ThreadsDashboardData[], refreshedAt = new Date().toISOString()): string {
  const byId = new Map(accounts.map((account) => [account.accountId, account]));
  const visible = OPERATOR_ACCOUNT_IDS.map((accountId) => byId.get(accountId) ?? ({
    connected: false, bridgeStatus: "ACCOUNT_NOT_FOUND", accountId, handle: accountId === "acct_8ssana" ? "8sssana" : "taku_ai_tech",
    displayName: null, accountStatus: null, fetchedAt: refreshedAt, contents: [], manualPosts: [], metricsRecordCount: 0,
    hasLearningSnapshot: false, operations: { nightBatchItems: [], publicationsLastHour: null, publicationsLast24h: null, manualPostSyncAvailable: false, selfReplySync: "unknown" },
    safety: { available: false, globalStop: false, accountStop: false, capabilityStop: false, approvalMode: null, unresolvedAmbiguous: false, rateGuardReady: false, minIntervalSeconds: null, hourlyLimit: null, dailyLimit: null },
    editorial: { state: null, status: null, currentAgent: null, waitingReason: null, facts: [], unknowns: [], proposals: [], critiques: [], rejectedOptions: [], finalDecision: null, brief: null, experiments: [], customerSummary: null },
    operator: { armed: null, providerUsername: null, providerUserId: null, publishCredential: { state: null, ready: null, expiresAt: null }, insightsCredential: { state: null, ready: null, expiresAt: null }, structuralStatus: null, readyForDryRun: null, readinessBlocking: [], gitSha: null, deploymentPath: null, schemaVersion: null, schemaReadiness: null, executionState: null, enabledCapabilities: [], runners: [], writerPolicyStatus: null },
    activities: [], message: "アカウントが見つかりません",
  } as ThreadsDashboardData));
  const kill = globalKill(visible);
  const automation = visible.every((account) => automationStatus(account).label === "OFF") ? "OFF"
    : visible.some((account) => automationStatus(account).label === "RUNNING") ? "RUNNING" : UNKNOWN;
  const armed = visible.filter((account) => account.operator.armed === true).length;
  const ambiguous = visible.some((account) => account.safety.unresolvedAmbiguous);
  return `<style>${operatorStyles}</style><div class="operator-dashboard"><header class="op-page-head"><div><span class="op-eyebrow">IKORABU · READ ONLY</span><h1>Operations</h1><p>See safety first, then the single next action for each account.</p></div><div class="op-refresh"><span>LAST REFRESH</span><strong>${escapeHtml(fmt(refreshedAt))}</strong><a href="/operator" aria-label="Refresh operator dashboard">Refresh</a></div></header><section class="op-system" id="safety" aria-label="System safety status"><div><span>Global safety</span>${badge(kill.label, kill.tone)}</div><div><span>Accounts</span><strong>${visible.length} visible · ${armed} armed</strong></div><div><span>Automation</span><strong>${escapeHtml(automation)}</strong></div><div><span>Schema</span><strong>${escapeHtml(globalSchema(visible))}</strong></div><div><span>Publication ambiguity</span><strong>${ambiguous ? "REQUIRES REVIEW" : visible.every((account) => account.safety.available) ? "NONE REPORTED" : UNKNOWN}</strong></div></section><main class="op-account-grid" id="accounts">${visible.map(renderAccountCard).join("")}</main><section class="op-activity" id="activity" aria-labelledby="operator-activity-title"><header><div><span class="op-eyebrow">RECENT ACTIVITY</span><h2 id="operator-activity-title">Operational timeline</h2></div><p>Sanitized events from audit, content, publication, and metrics records.</p></header>${renderTimeline(visible)}</section><footer class="op-readonly"><strong>READ ONLY</strong><span>GET requests only. No production mutation is wired.</span></footer></div>`;
}

const operatorStyles = `
.operator-shell{background:var(--t-bg);color:var(--t-ink)}
.operator-shell .app{grid-template-columns:180px minmax(0,1fr);gap:14px;padding:14px}
.operator-shell .sidebar{top:14px;width:180px;height:calc(100vh - 28px);padding:16px 10px;border:1px solid var(--t-line);border-radius:var(--t-radius-3);box-shadow:none}
.operator-shell .sidebar-header{padding:2px 8px 12px}.operator-shell .sidebar-header .brand-mark{width:28px;height:28px;border-radius:9px}.operator-shell .sidebar-header .brand-sub{padding-left:40px;margin-top:2px}
.operator-shell .nav-section-label{padding-top:12px}.operator-shell .nav-item{min-height:42px;padding:9px 10px;font-size:12px}.operator-shell .main{min-width:0;padding:0}
.operator-dashboard{color:var(--t-ink);max-width:1360px;margin:0 auto;padding:28px clamp(22px,3vw,44px) 48px;min-height:100vh;font:400 14px/1.55 var(--t-font)}
.op-page-head{display:flex;justify-content:space-between;gap:28px;align-items:flex-end;margin-bottom:20px}.op-page-head h1{font-size:30px;line-height:1.15;letter-spacing:-.035em;margin:5px 0}.op-page-head p,.op-activity header p{color:var(--t-ink-2);margin:0}.op-eyebrow{font-size:11px;font-weight:800;letter-spacing:.13em;color:var(--t-ink-muted)}.op-refresh{display:grid;justify-items:end;gap:3px;font-size:12px}.op-refresh span{color:var(--t-ink-muted);font-weight:700}.op-refresh strong{font-size:13px}.op-refresh a{color:var(--t-brand);font-weight:700}
.op-system{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-block:1px solid var(--t-line);margin-bottom:18px}.op-system>div{padding:14px 16px;display:grid;gap:7px;border-left:1px solid var(--t-line-soft)}.op-system>div:first-child{border-left:0}.op-system span:first-child{font-size:11px;color:var(--t-ink-muted);font-weight:700}.op-system strong{font-size:14px}.op-system .t-badge{width:max-content}
.op-account-grid{display:grid;grid-template-columns:1fr;gap:14px}.op-account{min-width:0;padding:22px 24px;border:1px solid var(--t-line);border-radius:var(--t-radius-3);background:var(--t-surface);box-shadow:var(--t-e1);transition:border-color .16s ease,box-shadow .16s ease}.op-account:hover{border-color:color-mix(in srgb,var(--t-brand) 24%,var(--t-line));box-shadow:0 8px 24px color-mix(in srgb,var(--t-ink) 8%,transparent)}
.op-account-top{display:grid;grid-template-columns:minmax(250px,.8fr) minmax(320px,1.2fr);gap:24px;align-items:center;padding-bottom:18px;border-bottom:1px solid var(--t-line-soft)}.op-account-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.op-account-head h2{font-size:22px;line-height:1.2;margin:4px 0;color:var(--t-ink);letter-spacing:-.025em}.op-account-head p{font-size:12px;color:var(--t-ink-muted);margin:0}.op-account code,.op-timeline code{font-family:"SFMono-Regular",Consolas,monospace}
.op-badges{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.operator-dashboard .t-badge{font-size:11px;letter-spacing:.025em;border:1px solid transparent}.operator-dashboard .t-badge--ok{border-color:color-mix(in srgb,var(--t-ok) 22%,transparent)}.operator-dashboard .t-badge--warn{border-color:color-mix(in srgb,var(--t-warn) 25%,transparent)}.operator-dashboard .t-badge--serious{border-color:color-mix(in srgb,var(--t-serious) 24%,transparent)}
.op-next{margin:0;padding:15px 16px;border-radius:var(--t-radius-2);display:grid;grid-template-columns:auto 1fr;gap:3px 14px;align-items:center}.op-next span{grid-row:1/3;font-size:10px;font-weight:900;letter-spacing:.12em}.op-next strong{font-size:16px}.op-next small{color:var(--t-ink-2)}.op-next-ok{background:var(--t-ok-soft);border-left:3px solid var(--t-ok)}.op-next-warn{background:var(--t-warn-soft);border-left:3px solid var(--t-warn)}.op-next-bad{background:var(--t-serious-soft);border-left:3px solid var(--t-serious)}
.op-sections{display:grid;grid-template-columns:.8fr 1.1fr 1.1fr;gap:0;padding-top:18px}.op-section{min-width:0;padding:0 20px;border-left:1px solid var(--t-line-soft)}.op-section:first-child{padding-left:0;border-left:0}.op-section:last-child{padding-right:0}.op-section h3{font-size:13px;margin:0 0 10px;color:var(--t-ink)}.op-list{display:grid;gap:0;margin:10px 0 0}.op-kv{display:grid;grid-template-columns:minmax(92px,.9fr) minmax(0,1.2fr);gap:10px;padding:7px 0;border-top:1px solid var(--t-line-soft);font-size:12px}.op-kv dt{color:var(--t-ink-muted)}.op-kv dd{margin:0;text-align:right;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--t-ink)}.op-mono{font-family:"SFMono-Regular",Consolas,monospace;font-size:11px}.op-primary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.op-primary-grid>div{display:grid;gap:4px}.op-primary-grid>div>span:first-child{font-size:11px;color:var(--t-ink-muted);font-weight:700}.op-primary-grid .t-badge{justify-content:flex-start;max-width:100%;overflow:hidden}
.op-technical{border-top:1px solid var(--t-line-soft);margin-top:18px;padding-top:12px}.op-technical summary{cursor:pointer;min-height:40px;display:flex;align-items:center;font-size:12px;font-weight:800;color:var(--t-ink-2)}.op-technical[open]>.op-list{animation:op-reveal .18s ease-out both}.op-technical .op-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px}
.op-activity{padding:24px 0 6px;margin-top:24px;border-top:1px solid var(--t-line)}.op-activity header{display:flex;justify-content:space-between;gap:20px;align-items:end}.op-activity h2{font-size:20px;line-height:1.3;margin:3px 0;color:var(--t-ink);text-transform:none;letter-spacing:-.015em}.op-activity header p{font-size:12px;max-width:540px;text-align:right}.op-timeline{list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px}.op-timeline li{position:relative;display:grid;grid-template-columns:112px 1fr;gap:12px;padding:10px 0 10px 18px;border-left:1px solid var(--t-line)}.op-dot{position:absolute;left:-4px;top:15px;width:7px;height:7px;background:var(--t-ink-muted);border:2px solid var(--t-bg);border-radius:50%}.op-timeline time{font-size:11px;color:var(--t-ink-muted)}.op-timeline strong{font-size:13px}.op-timeline p{font-size:12px;color:var(--t-ink-muted);margin:2px 0}.op-timeline code{font-size:11px;color:var(--t-ink-muted)}.op-empty{color:var(--t-ink-muted)}.op-readonly{display:flex;gap:12px;align-items:center;margin-top:18px;color:var(--t-ink-muted);font-size:12px}.op-readonly strong{color:var(--t-brand);letter-spacing:.08em}
@keyframes op-reveal{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media(max-width:1080px){.operator-shell .app{grid-template-columns:164px minmax(0,1fr)}.operator-shell .sidebar{width:164px}.op-system{grid-template-columns:repeat(3,1fr)}.op-system>div:nth-child(4){border-left:0}.op-account-top{grid-template-columns:1fr}.op-sections{grid-template-columns:1fr 1fr}.op-section{padding:0 16px}.op-section:nth-child(3){grid-column:1/-1;margin-top:18px;padding:18px 0 0;border-top:1px solid var(--t-line-soft);border-left:0}}
@media(max-width:720px){.operator-shell{overflow-x:clip}.operator-shell .app{display:block;padding:8px}.operator-shell .sidebar{position:static;width:auto;height:auto;margin:0 0 8px;padding:10px 12px}.operator-shell .sidebar-header{padding:0}.operator-shell .sidebar>.sidebar-nav{display:none}.operator-shell .hq-mobile-nav{display:block}.operator-shell .hq-mobile-nav>summary{margin:8px 0 0;padding:10px 12px;border:1px solid var(--t-line);border-radius:var(--t-radius-1);color:var(--t-ink-2)}.operator-shell .hq-mobile-nav-panel{display:grid;gap:4px;padding-top:6px}.operator-shell .main{min-width:0;padding:0}.operator-dashboard{padding:18px 12px 32px}.op-page-head,.op-activity header{display:grid}.op-refresh{justify-items:start}.op-system{grid-template-columns:1fr 1fr}.op-system>div:nth-child(odd){border-left:0}.op-account{padding:18px}.op-account-top,.op-sections{grid-template-columns:1fr}.op-account-head{display:grid}.op-badges{justify-content:flex-start}.op-section,.op-section:first-child,.op-section:last-child{padding:16px 0;border-left:0;border-top:1px solid var(--t-line-soft)}.op-section:first-child{border-top:0}.op-section:nth-child(3){grid-column:auto;margin-top:0}.op-technical .op-list,.op-timeline{grid-template-columns:1fr}.op-activity header p{text-align:left}.op-readonly{align-items:flex-start;flex-direction:column;gap:4px}}
@media(prefers-reduced-motion:reduce){.operator-dashboard *{animation:none!important;transition:none!important}}
`;
