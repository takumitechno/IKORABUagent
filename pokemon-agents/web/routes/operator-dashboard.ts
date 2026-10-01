import { escapeHtml } from "../components/layout";
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
  return `<span class="op-badge op-${tone}" role="status" title="${escapeHtml(label)}"><span aria-hidden="true">${mark}</span>${escapeHtml(label)}</span>`;
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
  return `<section class="op-section"><h3>Safety</h3><div class="op-badges">${badge(safety.label, safety.tone)}${badge(data.operator.armed === null ? "ARMED UNKNOWN" : data.operator.armed ? "ARMED" : "DISARMED", data.operator.armed === null ? "bad" : data.operator.armed ? "warn" : "ok")}</div><dl class="op-list">${keyValue("Account", value(data.accountStatus))}${keyValue("Publish credential", value(data.operator.publishCredential.state))}${keyValue("Insights credential", value(data.operator.insightsCredential.state))}${keyValue("Global stop", data.safety.available ? String(data.safety.globalStop) : UNKNOWN)}${keyValue("Account stop", data.safety.available ? String(data.safety.accountStop) : UNKNOWN)}${keyValue("Capability stop", data.safety.available ? String(data.safety.capabilityStop) : UNKNOWN)}${keyValue("Publication ambiguity", data.safety.available ? String(data.safety.unresolvedAmbiguous) : UNKNOWN)}</dl></section>`;
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
  return `<article class="op-account" data-account-id="${escapeHtml(data.accountId)}"><header class="op-account-head"><div><span class="op-eyebrow">THREADS ACCOUNT</span><h2>@${escapeHtml(data.handle ?? data.accountId)}</h2><p>${escapeHtml(data.displayName ?? "Identity unavailable")} · <code>${escapeHtml(data.accountId)}</code></p></div><div class="op-badges">${badge(safety.label, safety.tone)}${badge(automation.label, automation.tone, "◉")}</div></header>${renderNextAction(data)}<div class="op-sections">${renderSafetyStatus(data)}${renderPipeline(data)}${renderPublication(data)}</div>${renderTechnical(data)}<div class="op-future" aria-label="Future operator actions"><span>FUTURE OPERATOR ACTION</span><button type="button" disabled>Approve</button><button type="button" disabled>Arm / Disarm</button><button type="button" disabled>Reconcile</button></div></article>`;
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
  return `<style>${operatorStyles}</style><div class="operator-dashboard"><header class="op-page-head"><div><span class="op-eyebrow">IKORABU · READ ONLY NOW</span><h1>Operations</h1><p>Safety, current work, latest result, waiting state, and one next action.</p></div><div class="op-refresh"><span>LAST REFRESH</span><strong>${escapeHtml(fmt(refreshedAt))}</strong><a href="/operator" aria-label="Refresh operator dashboard">Refresh</a></div></header><section class="op-system" id="safety" aria-label="System safety status"><div><span>Canonical schema</span><strong>${escapeHtml(globalSchema(visible))}</strong></div><div><span>Global safety</span>${badge(kill.label, kill.tone)}</div><div><span>Accounts</span><strong>${visible.length} visible · ${armed} armed</strong></div><div><span>Automation</span><strong>${escapeHtml(automation)}</strong></div><div><span>Publication ambiguity</span><strong>${ambiguous ? "REQUIRES REVIEW" : visible.every((account) => account.safety.available) ? "NONE REPORTED" : UNKNOWN}</strong></div></section><main class="op-account-grid" id="accounts">${visible.map(renderAccountCard).join("")}</main><section class="op-activity" id="activity" aria-labelledby="operator-activity-title"><header><div><span class="op-eyebrow">RECENT ACTIVITY</span><h2 id="operator-activity-title">Operational timeline</h2></div><p>Human-readable events from existing audit, content, batch, publication, and metrics records.</p></header>${renderTimeline(visible)}</section><footer class="op-readonly"><strong>READ ONLY NOW</strong><span>This page issues GET requests only. Future controls are disabled and no production mutation is wired.</span></footer></div>`;
}

const operatorStyles = `
.operator-dashboard{--op-bg:#f5f7fa;--op-panel:#fff;--op-ink:#17202e;--op-muted:#667085;--op-line:#e4e8ef;--op-ok:#18725a;--op-ok-bg:#e9f7f1;--op-warn:#8a5b16;--op-warn-bg:#fff6df;--op-bad:#a63d46;--op-bad-bg:#fff0f1;color:var(--op-ink);max-width:1440px;margin:0 auto;padding:28px;background:var(--op-bg);min-height:100vh;font-family:Inter,"LINE Seed JP",system-ui,sans-serif}
.op-page-head{display:flex;justify-content:space-between;gap:28px;align-items:flex-end;margin-bottom:18px}.op-page-head h1{font-size:30px;letter-spacing:-.035em;margin:5px 0}.op-page-head p,.op-activity header p{color:var(--op-muted);margin:0}.op-eyebrow{font-size:12px;font-weight:800;letter-spacing:.12em;color:#526074}.op-refresh{display:grid;justify-items:end;gap:3px;font-size:12px}.op-refresh span{color:var(--op-muted);font-weight:700}.op-refresh strong{font-size:13px}.op-refresh a{color:#315c9b;font-weight:700}
.op-system{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;background:var(--op-line);border:1px solid var(--op-line);border-radius:14px;overflow:hidden;margin-bottom:18px}.op-system>div{background:var(--op-panel);padding:14px 16px;display:grid;gap:7px}.op-system span:first-child{font-size:11px;color:var(--op-muted);font-weight:700}.op-system strong{font-size:14px}
.op-account-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.op-account{background:var(--op-panel);border:1px solid var(--op-line);border-radius:16px;box-shadow:0 8px 26px rgba(25,38,58,.06);padding:20px;min-width:0}.op-account-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.op-account-head h2{font-size:23px;margin:3px 0}.op-account-head p{font-size:12px;color:var(--op-muted);margin:0}.op-account code,.op-timeline code{font-family:"SFMono-Regular",Consolas,monospace}
.op-badges{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.op-badge{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800;letter-spacing:.035em;white-space:nowrap;border:1px solid transparent}.op-badge span{font-size:12px}.op-ok{color:var(--op-ok);background:var(--op-ok-bg);border-color:#cce9dd}.op-warn{color:var(--op-warn);background:var(--op-warn-bg);border-color:#f1dfac}.op-bad{color:var(--op-bad);background:var(--op-bad-bg);border-color:#f0cbd0}.op-neutral{color:#536175;background:#f0f3f7;border-color:#dfe4eb}
.op-next{margin:18px 0 16px;padding:14px 16px;border-radius:12px;display:grid;grid-template-columns:auto 1fr;gap:3px 12px;align-items:center}.op-next span{grid-row:1/3;font-size:11px;font-weight:900;letter-spacing:.1em}.op-next strong{font-size:16px}.op-next small{color:var(--op-muted)}.op-next-ok{background:var(--op-ok-bg);border-left:4px solid var(--op-ok)}.op-next-warn{background:var(--op-warn-bg);border-left:4px solid #bc821f}.op-next-bad{background:var(--op-bad-bg);border-left:4px solid var(--op-bad)}
.op-sections{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.op-section{min-width:0}.op-section h3{font-size:13px;margin:0 0 10px}.op-list{display:grid;gap:0;margin:10px 0 0}.op-kv{display:grid;grid-template-columns:minmax(82px,.9fr) minmax(0,1.2fr);gap:8px;padding:7px 0;border-top:1px solid var(--op-line);font-size:12px}.op-kv dt{color:var(--op-muted)}.op-kv dd{margin:0;text-align:right;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.op-mono{font-family:"SFMono-Regular",Consolas,monospace;font-size:11px}.op-primary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.op-primary-grid>div{display:grid;gap:4px}.op-primary-grid>div>span:first-child{font-size:11px;color:var(--op-muted);font-weight:700}.op-primary-grid .op-badge{justify-content:flex-start;overflow:hidden;text-overflow:ellipsis}
.op-technical{border-top:1px solid var(--op-line);margin-top:16px;padding-top:12px}.op-technical summary{cursor:pointer;font-size:12px;font-weight:800;color:#48566b}.op-technical .op-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px}.op-future{display:flex;align-items:center;gap:7px;margin-top:14px;padding-top:12px;border-top:1px solid var(--op-line)}.op-future span{margin-right:auto;font-size:11px;font-weight:900;letter-spacing:.09em;color:var(--op-muted)}.op-future button{border:1px solid var(--op-line);background:#f7f8fa;color:#9aa3af;border-radius:8px;padding:6px 8px;font-size:11px}
.op-activity{background:var(--op-panel);border:1px solid var(--op-line);border-radius:16px;padding:20px;margin-top:18px}.op-activity header{display:flex;justify-content:space-between;gap:20px;align-items:end}.op-activity h2{font-size:20px;margin:3px 0}.op-activity header p{font-size:12px}.op-timeline{list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px}.op-timeline li{position:relative;display:grid;grid-template-columns:112px 1fr;gap:12px;padding:10px 0 10px 18px;border-left:1px solid var(--op-line)}.op-dot{position:absolute;left:-4px;top:15px;width:7px;height:7px;background:#61728b;border:2px solid white;border-radius:50%}.op-timeline time{font-size:11px;color:var(--op-muted)}.op-timeline strong{font-size:13px}.op-timeline p{font-size:12px;color:var(--op-muted);margin:2px 0}.op-timeline code{font-size:11px;color:#7a8698}.op-empty{color:var(--op-muted)}.op-readonly{display:flex;gap:12px;align-items:center;margin-top:14px;color:var(--op-muted);font-size:12px}.op-readonly strong{color:#315c9b;letter-spacing:.08em}
@media(max-width:1100px){.op-system{grid-template-columns:repeat(3,1fr)}.op-account-grid{grid-template-columns:1fr}.op-sections{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:720px){.operator-shell{overflow-x:clip}.operator-shell .app{display:block;padding:10px}.operator-shell .sidebar{position:static;width:auto;height:auto;margin:0 0 8px;padding:12px 14px}.operator-shell .sidebar-header{padding:0}.operator-shell .main{min-width:0;padding:0}.operator-dashboard{padding:18px}.op-page-head,.op-activity header{display:grid}.op-refresh{justify-items:start}.op-system{grid-template-columns:1fr 1fr}.op-sections{grid-template-columns:1fr}.op-account-head{display:grid}.op-badges{justify-content:flex-start}.op-technical .op-list,.op-timeline{grid-template-columns:1fr}.op-future{flex-wrap:wrap}.op-future span{width:100%}.op-account{padding:16px}}
`;
