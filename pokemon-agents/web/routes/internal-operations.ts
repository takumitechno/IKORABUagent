import type { Database } from "bun:sqlite";
import { escapeHtml } from "../components/layout";
import { icon } from "../components/icons";
import { resolveAgentCharacterImage } from "../lib/agent-character-images";
import {
  mapThreadsActor, threadsActorActivityLabel,
  type ThreadsActorAttribution,
} from "../lib/agent-role-registry";
import type {
  ManualPostStatus, NightBatchItem, ThreadsAccountOption, ThreadsContent, ThreadsDashboardData,
} from "../lib/threads-dashboard";

interface AgentOpsRow {
  display_name: string;
  pokemon_jp: string;
  avatar_url: string | null;
  slug: string;
  role_label: string | null;
  status: string;
  current_task: string | null;
  current_task_status: string | null;
  last_status: string | null;
  last_at: string | null;
}

const metricLabels: Record<string, string> = {
  views: "views", likes: "likes", replies: "replies", reposts: "reposts",
  quotes: "quotes", shares: "shares", profile_visits: "profile visits",
  follower_delta: "follower Δ", link_clicks: "clicks", lead_registrations: "leads",
  free_reading_applications: "free applications", paid_conversions: "paid",
  revenue: "revenue",
};

function fmt(value: string | null, fallback = "—"): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function ageHours(value: string | null): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? Math.max(0, (Date.now() - time) / 3_600_000) : null;
}

function todayTokyo(value: string): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const key = (d: Date) => new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(d);
  return key(date) === key(new Date());
}

function tone(status: string): string {
  if (["succeeded", "published", "completed", "active"].includes(status)) return "ok";
  if (["blocked", "ambiguous", "failed_confirmed", "failed", "error"].includes(status)) return "bad";
  if (["pending", "scheduled", "running", "human_approval_pending"].includes(status)) return "warn";
  return "muted";
}

const agentVisuals: Record<string, { icon: string; accent: string }> = {
  "sashihara-orchestrator": { icon: "crown", accent: "rose" },
  "iori-validator": { icon: "shield_check", accent: "blue" },
  "maika-hypothesizer": { icon: "sparkles", accent: "violet" },
  "hitomi-selector": { icon: "goals", accent: "amber" },
  "anna-supervisor": { icon: "network", accent: "pink" },
  "kiara-executor": { icon: "zap", accent: "orange" },
  "hana-heartbeat": { icon: "heartbeat", accent: "mint" },
  "risa-notifier": { icon: "alert", accent: "red" },
  "shoko-reporter": { icon: "list", accent: "sky" },
  "mirinya-cost-analyst": { icon: "dollar", accent: "green" },
  "sanatsun-knowledge-editor": { icon: "knowledge", accent: "indigo" },
};

type OfficeZone = "command" | "center" | "operations";

const officePositions: Record<string, { left: number; top: number; zone: OfficeZone }> = {
  "iori-validator": { left: 17, top: 38, zone: "command" },
  "maika-hypothesizer": { left: 31, top: 27, zone: "command" },
  "hitomi-selector": { left: 44, top: 38, zone: "command" },
  "anna-supervisor": { left: 58, top: 27, zone: "command" },
  "kiara-executor": { left: 72, top: 38, zone: "command" },
  "sashihara-orchestrator": { left: 86, top: 25, zone: "command" },
  "sanatsun-knowledge-editor": { left: 50, top: 57, zone: "center" },
  "hana-heartbeat": { left: 18, top: 76, zone: "operations" },
  "risa-notifier": { left: 39, top: 76, zone: "operations" },
  "shoko-reporter": { left: 63, top: 76, zone: "operations" },
  "mirinya-cost-analyst": { left: 82, top: 76, zone: "operations" },
};

function agentName(displayName: string): string {
  return displayName.replace(/\s*\([^)]*\)\s*$/, "").trim() || displayName;
}

function agentState(
  agentStatus: string,
  currentTaskStatus: string | null,
  lastStatus: string | null,
): { label: string; tone: string } {
  if (currentTaskStatus === "blocked" || ["failed", "error", "blocked", "timeout"].includes(lastStatus || "")) {
    return { label: "要確認", tone: "bad" };
  }
  if (currentTaskStatus === "in_progress" || lastStatus === "running") return { label: "稼働中", tone: "ok" };
  if (agentStatus === "active") return { label: "待機", tone: "warn" };
  return { label: "未取得", tone: "muted" };
}

function statusLabel(content: ThreadsContent): string {
  const publication = content.publication;
  if (publication?.status === "partial" && publication.externalId) {
    return "一部公開済み（PART0送信済み・再送禁止）";
  }
  if (publication?.status === "ambiguous") return "ambiguous（再送禁止）";
  if (publication?.externalId && publication.status === "succeeded") return "published";
  return content.state;
}

function originLabel(origin: string): string {
  return ({ ai_auto: "ai_auto", ai_manual: "ai_manual", human_manual: "human_manual", unknown: "未取得" } as Record<string, string>)[origin] || "未取得";
}

function bridgeDiagnostic(data: ThreadsDashboardData): { state: string; label: string } {
  switch (data.bridgeStatus) {
    case "HEALTHY": return { state: "active", label: "正常" };
    case "HEALTHY_EMPTY": return { state: "pending", label: "正常・データ待ち" };
    case "UNAUTHORIZED": return { state: "error", label: "認証エラー" };
    case "ACCOUNT_NOT_FOUND": return { state: "error", label: "アカウントが見つかりません" };
    case "SCHEMA_INCOMPATIBLE": return { state: "error", label: "契約バージョン不一致" };
    case "MALFORMED_RESPONSE": return { state: "error", label: "レスポンス形式不正" };
    default: return { state: "error", label: "接続エラー" };
  }
}

function manualGroups(posts: ManualPostStatus[]): ManualPostStatus[][] {
  const groups = new Map<string, ManualPostStatus[]>();
  for (const post of posts) {
    const group = groups.get(post.logicalThreadId) ?? [];
    group.push(post);
    groups.set(post.logicalThreadId, group);
  }
  return [...groups.values()].map((group) => group.sort((a, b) => a.partIndex - b.partIndex));
}

function agents(db: Database): AgentOpsRow[] {
  return db.query<AgentOpsRow, []>(`
    SELECT a.display_name,a.pokemon_jp,a.avatar_url,a.slug,a.role_label,a.status,
      (SELECT i.title FROM issues i WHERE i.assignee_agent_id=a.id
       AND i.status IN ('todo','in_progress','in_review','blocked')
       ORDER BY CASE i.status WHEN 'blocked' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END,
       i.priority,i.updated_at DESC LIMIT 1) AS current_task,
      (SELECT i.status FROM issues i WHERE i.assignee_agent_id=a.id
       AND i.status IN ('todo','in_progress','in_review','blocked')
       ORDER BY CASE i.status WHEN 'blocked' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END,
       i.priority,i.updated_at DESC LIMIT 1) AS current_task_status,
      (SELECT r.status FROM reflections r WHERE (r.agent_id=a.id OR r.agent_slug=a.slug)
       AND (r.session_id IS NULL OR r.session_id NOT LIKE 'demo-%') AND (r.work_dir IS NULL OR r.work_dir <> '/demo')
       ORDER BY r.created_at DESC LIMIT 1) AS last_status,
      (SELECT r.created_at FROM reflections r WHERE (r.agent_id=a.id OR r.agent_slug=a.slug)
       AND (r.session_id IS NULL OR r.session_id NOT LIKE 'demo-%') AND (r.work_dir IS NULL OR r.work_dir <> '/demo')
       ORDER BY r.created_at DESC LIMIT 1) AS last_at
    FROM agents a ORDER BY CASE a.role WHEN 'orchestrator' THEN 0 WHEN 'supervisor' THEN 1 ELSE 2 END,a.id
  `).all();
}

function renderWarnings(data: ThreadsDashboardData): string {
  const warnings: string[] = [];
  if (!data.connected) warnings.push(`Bridge: ${bridgeDiagnostic(data).label}。実値は表示せず、安全な待機状態にしています。`);
  if (data.accountStatus && data.accountStatus !== "active") warnings.push(`${data.accountId} は ${data.accountStatus} です。`);
  if (data.safety.globalStop || data.safety.accountStop || data.safety.capabilityStop) warnings.push("kill switch が有効です。公開処理は停止状態です。");
  if (data.safety.unresolvedAmbiguous) warnings.push("未解決の ambiguous publication があります。自動再送は禁止です。");
  const critical = data.operations.nightBatchItems.filter((item) => ["blocked", "ambiguous", "failed_confirmed"].includes(item.status));
  if (critical.length) warnings.push(`NIGHT batch に要確認 ${critical.length}件があります。`);
  if (!warnings.length) return `<div class="ops-alert ok"><b>重大警告なし</b><span>Bridgeが返した範囲では blocked / ambiguous / kill switch を検出していません。</span></div>`;
  return `<div class="ops-alert bad"><b>要対応 ${warnings.length}件</b><ul>${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul></div>`;
}

function renderComponent(name: string, state: string, detail: string): string {
  return `<div class="ops-component"><span class="ops-dot ${tone(state)}"></span><div><b>${escapeHtml(name)}</b><small>${escapeHtml(detail)}</small></div><em class="${tone(state)}">${escapeHtml(state)}</em></div>`;
}

function opsChapterContext(iconName: string, now: string, next: string): string {
  return `<div class="ops-chapter-context"><span>${icon(iconName, "size-5")}</span><div><small>NOW / 今の状態</small><b>${escapeHtml(now)}</b></div><div><small>NEXT / 次に起きること</small><b>${escapeHtml(next)}</b></div></div>`;
}

function renderPipeline(data: ThreadsDashboardData): string {
  const batchByContent = new Map(data.operations.nightBatchItems.map((item) => [item.contentId, item]));
  const contentRows = data.contents.map((content) => {
    const batch = batchByContent.get(content.contentId);
    const status = statusLabel(content);
    return `<tr><td><b>${escapeHtml(content.topic || content.body.split(/\r?\n/)[0]?.slice(0, 58) || "topic未設定")}</b><small>${escapeHtml(content.contentId)}</small></td><td>${escapeHtml(content.contentRole || "未分類")}</td><td><code>${escapeHtml(originLabel(content.origin))}</code></td><td>${content.partCount} part</td><td><span class="ops-status ${tone(status)}">${escapeHtml(status)}</span></td><td>${content.qaVerdict ? escapeHtml(content.qaVerdict) : "—"} / ${content.copyGuard}</td><td>${content.approved ? "承認済み" : "未承認"}</td><td>${batch ? `${fmt(batch.scheduledAt)}<small>${escapeHtml(batch.batchId)}</small>` : "—"}</td><td>${content.analyzeEnabled ? "ON" : "OFF"} / ${content.learnEnabled ? "ON" : "OFF"}</td></tr>`;
  });
  const manualRows = manualGroups(data.manualPosts).map((group) => {
    const root = group[0];
    return `<tr><td><b>${escapeHtml(root.topic || root.body.split(/\r?\n/)[0]?.slice(0, 58) || "手動投稿")}</b><small>${escapeHtml(root.logicalThreadId)}</small></td><td>${escapeHtml(root.contentRole || "未分類")}</td><td><code>${escapeHtml(root.origin)}</code></td><td>${Math.max(root.partCount, group.length)} part</td><td><span class="ops-status ${tone(root.trackingState)}">${escapeHtml(root.trackingState)}</span></td><td>外部投稿</td><td>対象外</td><td>${fmt(root.publishedAt)}</td><td>${root.analyzeEnabled ? "ON" : "OFF"} / ${root.learnEnabled ? "ON" : "OFF"}</td></tr>`;
  });
  const rows = [...contentRows, ...manualRows];
  return `<section class="ops-section ops-chapter chapter-flow"><div class="ops-section-head"><div><span>OPERATION DETAIL · CONTENT FLOW</span><h2>投稿パイプライン</h2><p>今日の運用を、content単位の技術ステータスまで掘り下げる場所です。</p></div><b>${rows.length} items</b></div>${opsChapterContext("list", `${rows.length} itemsを追跡中`, "次のstatus遷移またはmetrics取得")}<p class="ops-note">draft → QA → Copy Guard → human approval → publish_ready → scheduled → published → metrics</p><div class="ops-table-wrap"><table class="ops-table"><thead><tr><th>topic / id</th><th>role</th><th>origin</th><th>thread</th><th>status</th><th>QA / Copy Guard</th><th>approval</th><th>schedule / batch</th><th>analyze / learn</th></tr></thead><tbody>${rows.join("") || `<tr><td colspan="9" class="ops-empty">接続待ち</td></tr>`}</tbody></table></div></section>`;
}

function renderToday(data: ThreadsDashboardData): string {
  const today = data.operations.nightBatchItems.filter((item) => todayTokyo(item.scheduledAt));
  const counts = (status: NightBatchItem["status"]) => today.filter((item) => item.status === status).length;
  const next = data.operations.nightBatchItems.filter((item) => item.status === "pending" && new Date(item.scheduledAt).getTime() > Date.now()).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
  const last = data.operations.nightBatchItems.filter((item) => item.attemptedAt).sort((a, b) => (b.attemptedAt || "").localeCompare(a.attemptedAt || ""))[0];
  return `<section class="ops-section ops-chapter chapter-today"><div class="ops-section-head"><div><span>B · TODAY</span><h2>今日の運用</h2><p>NIGHT batch・scheduled・manualの成功、待機、停止を確認する場所です。</p></div><small>Task Scheduler自体の状態はBridge未提供</small></div>${opsChapterContext("clock", `succeeded ${counts("succeeded")} / pending ${counts("pending")} / blocked ${counts("blocked")}`, next ? `次回 ${fmt(next.scheduledAt)}` : "次回予定なし")}<div class="ops-kpis"><div><span>due / pending</span><b>${counts("pending")}</b></div><div><span>succeeded</span><b>${counts("succeeded")}</b></div><div><span>blocked</span><b>${counts("blocked")}</b></div><div><span>ambiguous</span><b>${counts("ambiguous")}</b></div><div><span>次回予定</span><b>${next ? fmt(next.scheduledAt) : "なし"}</b></div><div><span>直近result</span><b>${last ? last.status : "未取得"}</b></div></div><div class="ops-table-wrap"><table class="ops-table compact"><thead><tr><th>予定</th><th>batch_id</th><th>content_id</th><th>status</th><th>result / guard</th></tr></thead><tbody>${today.map((item) => `<tr><td>${fmt(item.scheduledAt)}</td><td><code>${escapeHtml(item.batchId)}</code></td><td>${escapeHtml(item.contentId)}</td><td><span class="ops-status ${tone(item.status)}">${escapeHtml(item.status)}</span></td><td>${escapeHtml(item.blockReason || (item.status === "succeeded" ? "完了" : "—"))}</td></tr>`).join("") || `<tr><td colspan="5" class="ops-empty">本日のNIGHT batch予定はありません</td></tr>`}</tbody></table></div></section>`;
}

function renderAnalysis(data: ThreadsDashboardData): string {
  const published = data.contents.filter((content) => content.publication?.externalId).slice(0, 6);
  return `<section class="ops-section ops-chapter chapter-kpi"><div class="ops-section-head"><div><span>D · KPI / MORNING REPORT</span><h2>KPI / Morning Report</h2><p>公開後の実績と分析結果を、実測値だけで確認する場所です。</p></div><b>実値のみ</b></div>${opsChapterContext("activity", `metrics ${data.metricsRecordCount} records / 公開 ${published.length}件`, "次回metrics取得後に比較を更新")}<div class="ops-analysis">${published.map((content) => {
    const metrics = Object.entries(content.metrics).filter((entry): entry is [string, number] => typeof entry[1] === "number");
    const primary = ["views", "likes", "replies", "reposts", "quotes", "shares"];
    const shown = content.metricsObservedAt
      ? primary.map((key) => typeof content.metrics[key as keyof typeof content.metrics] === "number"
        ? `<span><b>${escapeHtml(metricLabels[key])}</b>${content.metrics[key as keyof typeof content.metrics]!.toLocaleString("ja-JP")}</span>`
        : `<span class="unavailable"><b>${escapeHtml(metricLabels[key])}</b>unavailable</span>`).join("")
      : `<i>metrics 計測中</i>`;
    const rates = [
      content.viewsPerHour === null ? "views/hour unavailable" : `${content.viewsPerHour.toFixed(1)} views/hour`,
      content.engagementPerHour === null ? "engagement/hour unavailable" : `${content.engagementPerHour.toFixed(1)} engagement/hour`,
    ].join(" · ");
    return `<article><div class="ops-article-head"><b>${escapeHtml(content.topic || "実投稿")}</b><span>${fmt(content.publication?.publishedAt ?? null)}</span></div><p class="ops-body">${escapeHtml(content.body)}</p><div class="ops-metrics">${shown}<span><b>normalized</b>${escapeHtml(rates)}</span></div><p class="ops-note">last fetched ${fmt(content.metricsFetchedAt ?? content.metricsObservedAt)}</p><dl><dt>確認できた事実</dt><dd>${metrics.length ? `取得済み指標 ${metrics.length}種類。観測時刻 ${fmt(content.metricsObservedAt)}。` : "実投稿本文と公開IDを確認。指標はまだ未取得。"}</dd><dt>現時点の仮説</dt><dd>現時点の反応傾向は小標本として扱う。</dd><dt>まだ判断できないこと</dt><dd>時間帯・topic・roleの因果は比較数不足。勝ち投稿や最適解とは断定しない。</dd><dt>次回テスト</dt><dd>同一roleでhookまたは投稿時刻を1要素だけ変更。</dd></dl><div class="ops-policy">分析 ${content.analyzeEnabled ? "ON" : "OFF"} · 学習 ${content.learnEnabled ? "ON" : "OFF"}${content.learnEnabled ? "" : "（学習対象外）"}</div></article>`;
  }).join("") || `<div class="ops-empty">公開済み実投稿の取得待ちです。デモ値には置換しません。</div>`}</div></section>`;
}

function renderManual(data: ThreadsDashboardData): string {
  const groups = manualGroups(data.manualPosts);
  return `<section class="ops-section ops-chapter chapter-sync"><div class="ops-section-head"><div><span>E · MANUAL / SELF-REPLY</span><h2>Manual / Self-Reply</h2><p>外部で手動投稿したcontentと自分へのreplyを同期し、分析・学習方針を確認する場所です。</p></div><b>${data.manualPosts.length} detected</b></div>${opsChapterContext("routines", `${data.manualPosts.length} detected · ${data.operations.selfReplySync === "active" ? "Self-Reply稼働中" : data.operations.selfReplySync === "reauthorization_required" ? "再認可が必要" : "接続待ち"}`, data.operations.selfReplySync === "reauthorization_required" ? "OAuth再認可後にSelf-Reply Sync再開" : "次回syncで新規投稿を確認")}<p class="ops-note">Self-Reply Sync: ${data.operations.selfReplySync === "active" ? "稼働中（root + 自分へのreplyを論理thread化）" : data.operations.selfReplySync === "reauthorization_required" ? "再認可が必要（root Manual Syncは継続）" : data.operations.selfReplySync === "not_available" ? "未実装" : "接続待ち"}</p><div class="ops-manual">${groups.map((group) => {
    const root = group[0];
    const parts = root.parts.length ? root.parts : group.flatMap((post) => post.parts);
    return `<article><div><b>${escapeHtml(root.topic || root.body.split(/\r?\n/)[0]?.slice(0, 64) || "手動投稿")}</b><small>${escapeHtml(root.origin)} · ${Math.max(root.partCount, parts.length)} part · ${fmt(root.publishedAt)}</small></div><div class="ops-manual-parts">${parts.map((part) => `<p><b>${part.partIndex + 1}/${Math.max(root.partCount, parts.length)}</b>${escapeHtml(part.body)}</p>`).join("")}</div><form method="post" action="/api/internal/manual-policy"><input type="hidden" name="account_id" value="${escapeHtml(data.accountId)}"><input type="hidden" name="detection_id" value="${escapeHtml(root.detectionId)}"><input type="hidden" name="origin" value="${escapeHtml(root.origin)}"><label><input type="checkbox" name="analyze_enabled" ${root.analyzeEnabled ? "checked" : ""}> 分析対象</label><label><input type="checkbox" name="learn_enabled" ${root.learnEnabled ? "checked" : ""} ${root.analyzeEnabled ? "" : "disabled"}> 学習対象</label><button type="submit">設定を保存</button></form></article>`;
  }).join("") || `<div class="ops-empty">手動投稿は未検出、またはBridge接続待ちです。</div>`}</div></section>`;
}

function renderEditorial(data: ThreadsDashboardData): string {
  const editorial = data.editorial;
  const attribution = mapThreadsActor(editorial.currentAgent);
  const currentActorActivity = threadsActorActivityLabel(attribution);
  const currentActorLabel = attribution.actor_kind === "unknown"
    ? "未帰属"
    : `${attribution.display_name} · ${currentActorActivity || "担当中"}`;
  const stages = ["OBSERVE", "FACTS", "HYPOTHESES", "CRITIQUE", "DECIDE", "BRIEF", "DRAFT", "EDIT", "HUMAN_APPROVAL"];
  const current = Math.max(0, stages.indexOf(editorial.state || "OBSERVE"));
  const variable = typeof editorial.finalDecision?.test_variable === "string" ? editorial.finalDecision.test_variable : "未決定";
  const hypothesis = editorial.proposals[0]?.hypothesis;
  const rows = editorial.experiments.slice(0, 8).map((item) => `<tr><td><code>${escapeHtml(String(item.experiment_id || "—"))}</code></td><td>${escapeHtml(String(item.test_variable || "—"))}</td><td>${escapeHtml(String(item.status || "unknown"))}</td><td>${escapeHtml(String(item.evidence_level || "insufficient_evidence"))}</td></tr>`).join("");
  return `<section class="ops-section ops-chapter chapter-editorial editorial-section"><div class="ops-section-head"><div><span>C · EDITORIAL SLOW LANE</span><h2>編集部 — 今日の編集会議</h2><p>Slow Laneの判断工程と、今どのAgent・stageが担当しているかを見る場所です。</p></div><b class="ops-status ${editorial.status === "WAITING_FOR_EVIDENCE" ? "warn" : "ok"}">${escapeHtml(editorial.status || "未開始")}</b></div>${opsChapterContext("knowledge", `${editorial.state || "OBSERVE"} · ${currentActorLabel}`, `次のstage: ${stages[current + 1] || "HUMAN_APPROVAL"}`)}<div class="editorial-stages">${stages.map((stage, index) => `<span class="${index < current ? "done" : index === current ? "current" : "future"}">${escapeHtml(stage)}</span>`).join("")}</div>${editorial.waitingReason ? `<div class="ops-alert warn"><b>WAITING_FOR_EVIDENCE</b><span>${escapeHtml(editorial.waitingReason)}</span></div>` : ""}<div class="editorial-grid"><article><b>確認できた事実</b><ul>${editorial.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("") || "<li>まだありません</li>"}</ul></article><article><b>まだ判断できないこと</b><ul>${editorial.unknowns.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>証拠待ち</li>"}</ul></article><article><b>現在の仮説</b><p>${escapeHtml(typeof hypothesis === "string" ? hypothesis : "仮説は未生成です")}</p></article><article><b>次回テスト変数</b><p>${escapeHtml(variable)}</p><small>一度に変える変数は1つ</small></article></div><details><summary>反対意見・却下理由の要約</summary><ul>${editorial.critiques.map((item) => `<li><b>${escapeHtml(String(item.agent || "Critic"))}</b> ${escapeHtml(String(item.critique || ""))}</li>`).join("") || "<li>未生成</li>"}${editorial.rejectedOptions.map((item) => `<li><b>保留</b> ${escapeHtml(String(item.reason || ""))}</li>`).join("")}</ul></details><div class="ops-table-wrap"><table class="ops-table"><thead><tr><th>experiment</th><th>変数</th><th>status</th><th>evidence</th></tr></thead><tbody>${rows || `<tr><td colspan="4" class="ops-empty">実験履歴はまだありません</td></tr>`}</tbody></table></div></section>`;
}

function renderAgents(db: Database, selector: string, connected: boolean, fetchedAt: string, editorialAgent: string | null): string {
  const rows = agents(db);
  const editorialActor: ThreadsActorAttribution = mapThreadsActor(editorialAgent);
  const states = rows.map((agent) => agentState(agent.status, agent.current_task_status, agent.last_status));
  const working = states.filter((state) => state.label === "稼働中").length;
  const attention = states.filter((state) => state.label === "要確認").length;
  const waiting = rows.length - working - attention;
  const primaryTask = rows.find((agent, index) => states[index].label === "稼働中")?.current_task;
  const people = rows.map((agent, index) => {
    const visual = agentVisuals[agent.slug] || { icon: "agents", accent: "blue" };
    const state = states[index];
    const position = officePositions[agent.slug] || { left: 50, top: 50, zone: "operations" as OfficeZone };
    const name = agent.pokemon_jp || agentName(agent.display_name);
    const characterImage = resolveAgentCharacterImage(agent);
    const editorialTask = editorialActor.actor_kind === "employee" && editorialActor.agent_id === agent.slug
      ? threadsActorActivityLabel(editorialActor)
      : null;
    const popup = state.label === "待機" && !editorialTask
      ? `<span class="hq-waiting-label"><i></i>待機</span>`
      : `<div class="hq-agent-popup ${state.tone}"><b>${editorialTask ? "編集部" : state.label}</b><span>${escapeHtml(editorialTask || agent.current_task || "確認が必要な項目があります")}</span><small>最終実行 ${fmt(agent.last_at, "未実行")}</small></div>`;
    const avatar = characterImage
      ? `<img src="${escapeHtml(characterImage)}" alt="${escapeHtml(name)}">`
      : icon(visual.icon, "size-5");
    const hierarchyClass = agent.slug === "sashihara-orchestrator"
      ? " is-commander"
      : agent.slug === "sanatsun-knowledge-editor" ? " is-center" : "";
    const heroRole = agent.role_label || agent.slug;
    return `<article class="hq-person accent-${visual.accent} state-${state.tone}${hierarchyClass}" data-agent="${escapeHtml(agent.slug)}" data-zone="${position.zone}" data-avatar="${characterImage ? "image" : "fallback"}" style="--agent-left:${position.left}%;--agent-top:${position.top}%">${popup}<div class="hq-person-avatar">${avatar}</div><div class="hq-person-name"><b>${escapeHtml(name)}</b><span data-hero-role="${escapeHtml(heroRole)}">${escapeHtml(heroRole)}</span></div></article>`;
  }).join("");
  const detailCards = rows.map((agent, index) => {
    const visual = agentVisuals[agent.slug] || { icon: "agents", accent: "blue" };
    const state = states[index];
    const characterImage = resolveAgentCharacterImage(agent);
    return `<article class="ops-agent-card accent-${visual.accent}"><div class="ops-agent-profile"><span class="ops-agent-avatar">${characterImage ? `<img src="${escapeHtml(characterImage)}" alt="">` : icon(visual.icon, "size-5")}</span><div><b>${escapeHtml(agent.pokemon_jp || agentName(agent.display_name))}</b><small>${escapeHtml(agent.role_label || agent.slug)}</small></div><span class="ops-agent-presence ${state.tone}"><i></i>${state.label}</span></div><div class="ops-agent-task"><span>現在タスク</span><p>${escapeHtml(agent.current_task || "待機中 — 次の仕事を確認")}</p></div><footer><span>${escapeHtml(agent.slug)}</span><b>最終実行 ${fmt(agent.last_at, "未実行")}</b></footer></article>`;
  }).join("");
  return `<section class="hq-hero"><header class="hq-hero-head"><div><span class="hq-company">匠 Technologies</span><p class="hq-kicker">=LOVE AGENT OS · INTERNAL HQ</p><h1>＝LOVE Agent OSの事務所</h1><p>同じ司令室で、11人のAgentがThreads運用を支えています。</p></div><div class="hq-hero-control">${selector}<b>${connected ? "HQ online" : "接続待ち"}</b><small>最終確認 ${fmt(fetchedAt)}</small></div></header><div class="hq-summary"><span><i class="ok"></i>稼働中 <b>${working}</b></span><span><i class="muted"></i>待機 <b>${waiting}</b></span><span><i class="bad"></i>要確認 <b>${attention}</b></span><p><b>主なタスク</b>${escapeHtml(primaryTask || (attention ? "要確認項目を確認中" : "次の運用タスクを待機中"))}</p><a href="/agents">Agent詳細 ${icon("chevron_right", "size-4")}</a></div>${opsChapterContext("agents", `稼働中 ${working} / 待機 ${waiting} / 要確認 ${attention}`, primaryTask ? `次の担当タスク: ${primaryTask}` : "次の運用タスクを待機")}<div class="hq-office-floor" aria-label="11人のAgentが働くオフィス">${people}<div class="hq-office-caption"><b>HQ FLOOR</b><span>全員が同じオフィスで稼働しています</span></div></div><details class="hq-agent-details"><summary>詳細Agent状態を見る</summary><div class="ops-agent-grid">${detailCards}</div><p>状態と要約のみを表示し、ログ全文・tool input・tool responseは常時表示しません。</p></details></section>`;
}

export function renderInternalOperations(
  db: Database,
  data: ThreadsDashboardData,
  accountOptions: ThreadsAccountOption[] = [],
): string {
  const safety = data.safety;
  const runnerLast = data.operations.nightBatchItems.find((item) => item.attemptedAt);
  const manualState = data.operations.manualPostSyncAvailable ? "active" : "unknown";
  const selector = accountOptions.length
    ? `<form class="ops-account" method="get" action="/internal"><label for="account_id">Threads account</label><select id="account_id" name="account_id" onchange="this.form.submit()">${accountOptions.map((account) => `<option value="${escapeHtml(account.accountId)}" ${account.accountId === data.accountId ? "selected" : ""}>${escapeHtml(account.displayName || account.handle || account.accountId)}${account.handle ? ` · @${escapeHtml(account.handle)}` : ""}</option>`).join("")}</select><noscript><button type="submit">切り替え</button></noscript></form>`
    : `<form class="ops-account" aria-label="Threads account"><label for="account_id">Threads account</label><select id="account_id" name="account_id" disabled><option selected>${escapeHtml(data.accountId)}</option></select></form>`;
  const selfReplyReady = data.operations.selfReplySync === "active";
  const selfReplyDetail = selfReplyReady ? "root + repliesを論理thread化" : data.operations.selfReplySync === "reauthorization_required" ? "再認可が必要（未取得データは表示しません）" : "未提供";
  const nextSystemItem = data.operations.nightBatchItems.filter((item) => item.status === "pending" && new Date(item.scheduledAt).getTime() > Date.now()).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
  const bridge = bridgeDiagnostic(data);
  const systemNow = `Bridge ${bridge.label} · scheduler ${data.operations.nightBatchItems.length ? "台帳あり" : "情報待ち"} · kill switch ${safety.available ? (safety.globalStop || safety.accountStop || safety.capabilityStop ? "STOP" : "解除") : "不明"}`;
  const systemSection = `<section class="ops-section ops-chapter chapter-mission ops-system-section"><div class="ops-section-head"><div><span>A · MISSION CONTROL</span><h2>Mission Control</h2><p>Bridge・scheduler・kill switch・rate policyから、システム全体の健康状態を見る場所です。</p></div><b class="ops-account-state">${escapeHtml(data.accountStatus || "接続待ち")}</b></div>${opsChapterContext("shield_check", systemNow, nextSystemItem ? `次のsystem event ${fmt(nextSystemItem.scheduledAt)}` : "次のsystem eventは未定")}<div class="ops-components">${renderComponent("Bridge", bridge.state, bridge.label)}${renderComponent("runner", runnerLast?.status || "unknown", runnerLast ? `最終 ${fmt(runnerLast.attemptedAt)}` : "実行結果未取得")}${renderComponent("scheduler", data.operations.nightBatchItems.length ? "active" : "unknown", data.operations.nightBatchItems.length ? "NIGHT台帳あり（OS Task状態は未提供）" : "Bridge情報なし")}${renderComponent("Manual Post Sync", manualState, `${data.manualPosts.length}件検出`)}${renderComponent("Self-Reply Sync", selfReplyReady ? "active" : data.operations.selfReplySync === "reauthorization_required" ? "blocked" : "unknown", selfReplyDetail)}${renderComponent("metrics", data.metricsRecordCount > 0 ? "active" : "unknown", `${data.metricsRecordCount} records`)}</div><div class="ops-safety"><div><span>kill switch</span><b>${safety.available ? (safety.globalStop || safety.accountStop || safety.capabilityStop ? "STOP" : "解除") : "接続待ち"}</b></div><div><span>rate policy</span><b>${safety.available ? (safety.rateGuardReady ? `${safety.hourlyLimit ?? "—"}/h · ${safety.dailyLimit ?? "—"}/day · ${safety.minIntervalSeconds ?? "—"}s` : "未設定") : "接続待ち"}</b></div><div><span>rolling usage</span><b>${data.operations.publicationsLastHour ?? "—"}/h · ${data.operations.publicationsLast24h ?? "—"}/24h</b></div><div><span>approval mode</span><b>${escapeHtml(safety.approvalMode || "接続待ち")}</b></div></div></section>`;
  return `<div class="ops-page">${renderAgents(db, selector, data.connected, data.fetchedAt, data.editorial.currentAgent)}${renderWarnings(data)}${systemSection}${renderToday(data)}${renderEditorial(data)}${renderPipeline(data)}${renderAnalysis(data)}${renderManual(data)}</div><style>
.hq-hero{position:relative;margin-bottom:16px;border:1px solid rgba(255,255,255,.82);border-radius:24px;background:rgba(255,255,255,.82);box-shadow:0 20px 56px rgba(69,52,112,.16);overflow:hidden;backdrop-filter:blur(18px)}.hq-hero-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:23px 26px 17px;background:linear-gradient(110deg,rgba(255,255,255,.98),rgba(255,247,252,.94) 58%,rgba(239,236,255,.9))}.hq-company{display:inline-flex;padding:4px 8px;border-radius:999px;background:#172033;color:#fff;font-size:8px;font-weight:800;letter-spacing:.14em}.hq-kicker{font-size:9px!important;font-weight:800;letter-spacing:.18em;color:#8b5cf6!important;margin:9px 0 3px!important}.hq-hero-head h1{font-size:28px;line-height:1.1;color:#111827;letter-spacing:-.03em;margin:0}.hq-hero-head>div>p:last-child{font-size:11px;color:#64748b;margin-top:7px}.hq-hero-control{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:3px}.hq-hero-control>b{font-size:10px;color:#047857}.hq-hero-control>small{font-size:8.5px;color:#94a3b8}.hq-summary{display:flex;align-items:center;gap:9px;padding:10px 18px;background:rgba(255,255,255,.94);border-top:1px solid #f3e8ff;border-bottom:1px solid rgba(255,255,255,.8)}.hq-summary>span{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;background:#f8fafc;font-size:9px;color:#475569}.hq-summary>span i{width:6px;height:6px;border-radius:50%;background:currentColor}.hq-summary>span b{font-size:11px;color:#172033}.hq-summary>p{display:flex;gap:7px;min-width:0;margin:0 0 0 6px;color:#475569;font-size:9.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hq-summary>p b{color:#7c3aed}.hq-summary>a{display:inline-flex;align-items:center;gap:4px;margin-left:auto;white-space:nowrap;font-size:9.5px;font-weight:800;color:#7c3aed}.hq-office-floor{position:relative;min-height:610px;background-image:linear-gradient(180deg,rgba(40,30,70,.02),rgba(74,45,96,.16)),url('/bg/internal-hq-office.png');background-size:cover;background-position:center;overflow:hidden}.hq-office-floor:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.04) 45%,rgba(35,25,58,.1));pointer-events:none}.hq-person{--agent-accent:#8b5cf6;--agent-soft:#f5f3ff;position:absolute;left:var(--agent-left);top:var(--agent-top);z-index:2;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);width:146px;text-align:center}.hq-person-avatar{position:relative;z-index:2;width:64px;height:64px;display:grid;place-items:center;border:3px solid rgba(255,255,255,.94);border-radius:20px;color:var(--agent-accent);background:linear-gradient(145deg,rgba(255,255,255,.98),var(--agent-soft));box-shadow:0 10px 22px rgba(41,31,68,.2)}.hq-person-avatar img{width:100%;height:100%;object-fit:cover;border-radius:17px}.hq-person-avatar svg{width:27px;height:27px}.hq-person-name{position:relative;z-index:2;margin-top:6px;min-width:72px;padding:5px 10px 6px;border:1px solid rgba(255,255,255,.9);border-radius:11px;background:rgba(255,255,255,.8);color:#273449;box-shadow:0 5px 15px rgba(51,65,85,.13);backdrop-filter:blur(10px)}.hq-person-name b{display:block;font-size:11px}.hq-person-name span{display:block;max-width:126px;margin-top:1px;font-size:8px;font-weight:700;color:#526078;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hq-agent-popup{position:absolute;bottom:calc(100% + 8px);left:50%;z-index:3;width:164px;padding:8px 10px;text-align:left;transform:translateX(-50%);border:1px solid rgba(255,255,255,.9);border-radius:12px;background:rgba(239,246,255,.94);box-shadow:0 9px 24px rgba(30,64,175,.16);backdrop-filter:blur(10px)}.hq-agent-popup:after{content:'';position:absolute;top:100%;left:50%;margin-left:-5px;border:5px solid transparent;border-top-color:rgba(239,246,255,.94)}.hq-agent-popup.bad{background:rgba(255,241,242,.96);box-shadow:0 9px 24px rgba(190,18,60,.16)}.hq-agent-popup.bad:after{border-top-color:rgba(255,241,242,.96)}.hq-agent-popup b{display:block;font-size:9.5px;color:#1d4ed8}.hq-agent-popup.bad b{color:#be123c}.hq-agent-popup span{display:block;margin-top:2px;font-size:8.5px;line-height:1.35;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hq-agent-popup small{display:block;margin-top:3px;font-size:7.5px;color:#64748b}.hq-waiting-label{position:absolute;bottom:calc(100% + 7px);left:50%;z-index:3;display:inline-flex;align-items:center;gap:4px;padding:4px 7px;transform:translateX(-50%);border-radius:999px;background:rgba(255,255,255,.84);box-shadow:0 4px 12px rgba(30,41,59,.1);font-size:8px;font-weight:800;color:#64748b;backdrop-filter:blur(8px)}.hq-waiting-label i{width:5px;height:5px;border-radius:50%;background:#94a3b8}.hq-office-caption{position:absolute;left:18px;bottom:15px;z-index:2;display:flex;gap:8px;align-items:center;padding:7px 10px;border-radius:10px;background:rgba(25,24,45,.7);color:#fff;backdrop-filter:blur(10px)}.hq-office-caption b{font-size:8px;letter-spacing:.14em}.hq-office-caption span{font-size:8px;color:#e2e8f0}.hq-agent-details{padding:11px 18px 15px;background:rgba(255,255,255,.96)}.hq-agent-details>summary{cursor:pointer;font-size:10px;font-weight:800;color:#475569}.hq-agent-details[open]>summary{margin-bottom:12px}.hq-agent-details>p{font-size:8.5px;color:#94a3b8;margin:10px 0 0}.ops-agent-avatar img{width:100%;height:100%;object-fit:cover;border-radius:10px}
body:has(.ops-page){background:#eef1fb url('/bg/internal-hq-office.png') center top/cover fixed no-repeat}.app:has(.ops-page){background:linear-gradient(180deg,rgba(244,247,254,.42),rgba(244,247,254,.76));min-height:100vh}.app:has(.ops-page) .sidebar{background:rgba(255,255,255,.86);backdrop-filter:blur(18px);box-shadow:0 18px 50px rgba(75,58,117,.12);border:1px solid rgba(255,255,255,.72)}.app:has(.ops-page) .sidebar-footer{display:none}.app:has(.ops-page) .brand-mark{color:#ec4899;background:linear-gradient(135deg,#fce7f3,#ede9fe)}.app:has(.ops-page) .brand-name{font-size:0}.app:has(.ops-page) .brand-name:after{content:'＝LOVE Agent OS';font-size:15.5px}.app:has(.ops-page) .brand-sub{font-size:0}.app:has(.ops-page) .brand-sub:after{content:'Internal Command Center';font-size:11.5px}.ops-page{color:#172033;max-width:1600px;margin:0 auto;padding-bottom:24px}.ops-head{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-end;gap:28px;margin-bottom:18px;padding:28px 30px;border:1px solid rgba(255,255,255,.78);border-radius:24px;background:linear-gradient(120deg,rgba(255,255,255,.96),rgba(255,248,252,.88) 48%,rgba(239,236,255,.78));box-shadow:0 18px 52px rgba(69,52,112,.13);backdrop-filter:blur(18px)}.ops-head:after{content:'✦';position:absolute;right:28%;top:-34px;font-size:120px;color:rgba(236,72,153,.07);transform:rotate(12deg);pointer-events:none}.ops-head-copy{position:relative;z-index:1}.ops-head-copy>span,.ops-section-head>div>span{font-size:10px;font-weight:800;letter-spacing:.18em;color:#8b5cf6}.ops-head h1{font-size:31px;line-height:1.12;margin:6px 0;color:#111827;letter-spacing:-.025em}.ops-head h1 i{display:block;font-size:16px;font-style:normal;letter-spacing:.03em;color:#db2777;margin-bottom:5px}.ops-head p,.ops-head small{color:#64748b}.ops-hq-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}.ops-hq-tags span,.ops-hq-tags b{display:inline-flex;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.8);border:1px solid #e9d5ff;font-size:9px;letter-spacing:.04em}.ops-hq-tags b{background:#172033;color:#fff;border-color:#172033}.ops-head-control{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:4px;position:relative;z-index:1}.ops-account{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-bottom:4px}.ops-account label,.ops-account>span{font-size:9px;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:.09em}.ops-account select{max-width:290px;border:1px solid #ddd6fe;border-radius:10px;background:rgba(255,255,255,.94);padding:8px 11px;color:#172033;font:inherit;box-shadow:0 4px 14px rgba(76,29,149,.08)}.ops-alert{border-radius:16px;padding:14px 18px;margin-bottom:16px;display:flex;gap:18px;align-items:flex-start;border:1px solid transparent;box-shadow:0 10px 28px rgba(68,51,112,.07);backdrop-filter:blur(12px)}.ops-alert.ok{background:rgba(236,253,245,.94);color:#065f46;border-color:#bbf7d0}.ops-alert.bad{background:rgba(255,241,242,.95);color:#9f1239;border-color:#fecdd3}.ops-alert ul{margin:0;padding-left:18px}.ops-section{background:rgba(255,255,255,.93);border:1px solid rgba(255,255,255,.78);border-radius:20px;padding:21px 22px;margin-bottom:16px;box-shadow:0 16px 42px rgba(61,45,105,.1);backdrop-filter:blur(16px)}.ops-section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:15px}.ops-section-head h2{font-size:18px;margin:3px 0 0;text-transform:none;color:#172033;letter-spacing:-.015em}.ops-section-head p{font-size:10px;color:#64748b;margin-top:4px}.ops-section-head>a{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;color:#7c3aed}.ops-section-head>a svg{width:14px;height:14px}.editorial-stages{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}.editorial-stages span{padding:4px 7px;border-radius:999px;background:#f1f5f9;font-size:8px;font-weight:800;color:#64748b}.ops-agents-section{background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(255,248,252,.92) 55%,rgba(244,241,255,.9));border-color:rgba(255,255,255,.9)}.ops-agent-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.ops-agent-card{position:relative;overflow:hidden;border:1px solid rgba(226,232,240,.9);border-radius:15px;padding:13px;background:rgba(255,255,255,.88);box-shadow:0 7px 18px rgba(51,65,85,.06);transition:transform .16s ease,box-shadow .16s ease}.ops-agent-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(82,63,125,.13)}.ops-agent-card:after{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--agent-accent,#8b5cf6)}.ops-agent-card.accent-rose{--agent-accent:#f43f5e;--agent-soft:#fff1f2}.ops-agent-card.accent-pink{--agent-accent:#ec4899;--agent-soft:#fdf2f8}.ops-agent-card.accent-violet{--agent-accent:#8b5cf6;--agent-soft:#f5f3ff}.ops-agent-card.accent-indigo{--agent-accent:#6366f1;--agent-soft:#eef2ff}.ops-agent-card.accent-blue{--agent-accent:#3b82f6;--agent-soft:#eff6ff}.ops-agent-card.accent-sky{--agent-accent:#0ea5e9;--agent-soft:#f0f9ff}.ops-agent-card.accent-mint{--agent-accent:#10b981;--agent-soft:#ecfdf5}.ops-agent-card.accent-green{--agent-accent:#22c55e;--agent-soft:#f0fdf4}.ops-agent-card.accent-amber{--agent-accent:#f59e0b;--agent-soft:#fffbeb}.ops-agent-card.accent-orange{--agent-accent:#f97316;--agent-soft:#fff7ed}.ops-agent-card.accent-red{--agent-accent:#ef4444;--agent-soft:#fef2f2}.ops-agent-desk{font-size:7.5px;letter-spacing:.14em;font-weight:800;color:#94a3b8;margin:0 0 8px 45px}.ops-agent-profile{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:9px;align-items:center}.ops-agent-avatar{width:36px;height:36px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;color:var(--agent-accent);background:var(--agent-soft);box-shadow:inset 0 0 0 1px rgba(255,255,255,.65)}.ops-agent-avatar svg{width:17px;height:17px}.ops-agent-profile b{display:block;font-size:13px;color:#172033}.ops-agent-profile small{display:block;color:#64748b;font-size:8.5px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ops-agent-presence{display:inline-flex;align-items:center;gap:4px;font-size:8px;font-weight:800;white-space:nowrap}.ops-agent-presence i{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 0 3px color-mix(in srgb,currentColor 14%,transparent)}.ops-agent-task{margin:11px 0 9px;padding:9px 10px;border-radius:10px;background:#f8fafc}.ops-agent-task span{font-size:7.5px;font-weight:800;letter-spacing:.08em;color:#94a3b8;text-transform:uppercase}.ops-agent-task p{font-size:10px;line-height:1.45;margin:3px 0 0;color:#334155;min-height:28px}.ops-agent-card footer{display:flex;justify-content:space-between;gap:7px;color:#94a3b8;font-size:7.5px}.ops-agent-card footer span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ops-agent-card footer b{color:#64748b;font-size:7.5px;white-space:nowrap}.ops-log-note{margin-top:12px;font-size:10px;color:#64748b}.ops-log-note summary{cursor:pointer;font-weight:700}.ops-components{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ops-component{display:flex;align-items:center;gap:9px;background:linear-gradient(135deg,#fafafe,#f8fafc);border:1px solid #eef2f7;border-radius:12px;padding:11px}.ops-component>div{display:flex;flex-direction:column;min-width:0}.ops-component small{color:#64748b;font-size:9.5px}.ops-component em{margin-left:auto;font-size:9px;font-style:normal;font-weight:800}.ops-dot{width:8px;height:8px;border-radius:50%;flex:none}.ok{color:#047857}.bad{color:#be123c}.warn{color:#b45309}.muted{color:#64748b}.ops-dot.ok{background:#10b981}.ops-dot.bad{background:#f43f5e}.ops-dot.warn{background:#f59e0b}.ops-dot.muted{background:#94a3b8}.ops-account-state{padding:5px 10px;border-radius:999px;background:#f5f3ff;color:#7c3aed;font-size:10px}.ops-safety,.ops-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#e9e7f1;border-radius:13px;overflow:hidden;margin-top:12px}.ops-safety>div,.ops-kpis>div{background:linear-gradient(180deg,#fff,#fafafe);padding:12px;display:flex;flex-direction:column}.ops-safety span,.ops-kpis span{font-size:8.5px;text-transform:uppercase;letter-spacing:.08em;color:#64748b}.ops-safety b,.ops-kpis b{font-size:12.5px;margin-top:3px}.ops-kpis{grid-template-columns:repeat(6,1fr);margin-bottom:12px}.ops-table-wrap{overflow:auto;border-radius:12px;border:1px solid #eef2f7}.ops-table{width:100%;border-collapse:collapse;white-space:nowrap}.ops-table th{text-align:left;font-size:8.5px;text-transform:uppercase;color:#64748b;padding:9px;border-bottom:1px solid #e2e8f0;background:#fafafe}.ops-table td{font-size:10.5px;padding:10px 9px;border-bottom:1px solid #f1f5f9;vertical-align:top}.ops-table td:first-child{white-space:normal;min-width:190px}.ops-table small{display:block;color:#94a3b8;margin-top:3px}.ops-table code{font-size:9.5px}.ops-status{font-size:9px;font-weight:800;padding:3px 7px;border-radius:999px;background:#f1f5f9}.ops-status.bad{background:#fff1f2}.ops-status.warn{background:#fffbeb}.ops-status.ok{background:#ecfdf5}.ops-empty{text-align:center;color:#64748b;padding:28px!important}.ops-analysis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ops-analysis article,.ops-manual article{border:1px solid #e9e7f1;border-radius:13px;padding:14px;background:rgba(255,255,255,.72)}.ops-article-head{display:flex;justify-content:space-between;gap:12px}.ops-article-head span{font-size:9px;color:#64748b}.ops-body{white-space:pre-line;font-size:10.5px;line-height:1.65;max-height:120px;overflow:auto;background:#f8fafc;padding:10px;border-radius:8px}.ops-metrics{display:flex;gap:6px;flex-wrap:wrap}.ops-metrics span{display:flex;flex-direction:column;background:#eff6ff;padding:6px 8px;border-radius:7px;font-size:10px}.ops-metrics span b{font-size:7.5px;color:#64748b}.ops-analysis dl{display:grid;grid-template-columns:110px 1fr;font-size:9.5px;gap:5px;margin:12px 0}.ops-analysis dt{font-weight:800}.ops-analysis dd{margin:0;color:#475569}.ops-policy{font-size:9.5px;font-weight:700;color:#64748b}.ops-note{font-size:10.5px;color:#64748b}.ops-manual{display:grid;gap:10px}.ops-manual article>div:first-child{display:flex;justify-content:space-between;gap:10px}.ops-manual article small{color:#64748b}.ops-manual-parts{display:grid;gap:5px;margin:10px 0}.ops-manual-parts p{white-space:pre-line;font-size:10.5px;background:#f8fafc;padding:8px;border-radius:8px;margin:0}.ops-manual-parts p b{margin-right:8px;color:#7c3aed}.ops-manual form{display:flex;gap:12px;align-items:center;font-size:10.5px}.ops-manual button{margin-left:auto;background:linear-gradient(135deg,#7c3aed,#db2777);color:white;border:0;border-radius:9px;padding:8px 11px;font-size:9.5px;font-weight:700;cursor:pointer}.ops-page-foot{display:flex;justify-content:space-between;color:#64748b;font-size:9px;padding:8px 4px}.ops-page-foot b{color:#7c3aed}.size-5{width:20px;height:20px}.size-4{width:16px;height:16px}@media(max-width:1250px){.ops-agent-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.ops-components{grid-template-columns:repeat(2,1fr)}.ops-kpis{grid-template-columns:repeat(3,1fr)}}@media(max-width:1000px){.app:has(.ops-page){display:block;padding:10px}.app:has(.ops-page) .sidebar{position:relative;top:auto;width:100%;height:auto;padding:12px 14px;margin-bottom:8px}.app:has(.ops-page) .sidebar-nav{display:none}.app:has(.ops-page) .sidebar-header{padding:0}.app:has(.ops-page) .main{padding:4px}.ops-head{padding:22px}.ops-agent-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:700px){.ops-head{align-items:flex-start;flex-direction:column;padding:19px}.ops-head h1{font-size:25px}.ops-head-control{text-align:left;align-items:flex-start;width:100%}.ops-account{justify-content:flex-start;flex-wrap:wrap}.ops-account select{max-width:100%;width:100%}.ops-agent-grid,.ops-components,.ops-analysis{grid-template-columns:1fr}.ops-safety,.ops-kpis{grid-template-columns:repeat(2,1fr)}.ops-section{padding:16px}.ops-section-head{align-items:flex-start}.ops-agent-card footer{flex-direction:column}.ops-manual form{align-items:flex-start;flex-wrap:wrap}.ops-manual button{margin-left:0;width:100%}}
.hq-person.accent-rose{--agent-accent:#f43f5e;--agent-soft:#fff1f2}.hq-person.accent-pink{--agent-accent:#ec4899;--agent-soft:#fdf2f8}.hq-person.accent-violet{--agent-accent:#8b5cf6;--agent-soft:#f5f3ff}.hq-person.accent-indigo{--agent-accent:#6366f1;--agent-soft:#eef2ff}.hq-person.accent-blue{--agent-accent:#3b82f6;--agent-soft:#eff6ff}.hq-person.accent-sky{--agent-accent:#0ea5e9;--agent-soft:#f0f9ff}.hq-person.accent-mint{--agent-accent:#10b981;--agent-soft:#ecfdf5}.hq-person.accent-green{--agent-accent:#22c55e;--agent-soft:#f0fdf4}.hq-person.accent-amber{--agent-accent:#f59e0b;--agent-soft:#fffbeb}.hq-person.accent-orange{--agent-accent:#f97316;--agent-soft:#fff7ed}.hq-person.accent-red{--agent-accent:#ef4444;--agent-soft:#fef2f2}
.hq-person-avatar{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.hq-agent-popup{background:rgba(239,246,255,.96)}.hq-waiting-label{background:rgba(255,255,255,.88)}.hq-person.state-ok{z-index:3}.hq-person.state-ok .hq-person-avatar{transform:scale(1.04);border-color:rgba(220,252,231,.98);box-shadow:0 11px 24px rgba(5,150,105,.22)}.hq-person.is-commander{z-index:4}.hq-person.is-commander .hq-person-avatar{width:70px;height:70px;border-radius:22px;color:#b45309;background:linear-gradient(145deg,#fffdf5,#fef3c7);box-shadow:0 12px 28px rgba(146,64,14,.22)}.hq-person.is-commander .hq-person-avatar svg{width:32px;height:32px}.hq-person.is-commander .hq-person-name{border-color:rgba(253,230,138,.94);background:rgba(255,251,235,.86);color:#713f12}.hq-person.is-commander .hq-person-name span{color:#92400e}.hq-person.is-center{z-index:3}.hq-person.is-center .hq-person-avatar{width:70px;height:70px;border-radius:22px;border-color:rgba(224,231,255,.98);box-shadow:0 12px 27px rgba(79,70,229,.2)}
@media(max-width:1000px){.hq-office-floor{min-height:660px}.hq-person{width:112px}.hq-agent-popup{width:140px}.hq-hero-head{padding:20px}.hq-summary{flex-wrap:wrap}.hq-summary>p{order:4;width:100%;margin-left:0}.hq-summary>a{margin-left:auto}}
@media(max-width:700px){.hq-hero-head{align-items:flex-start;flex-direction:column;padding:18px}.hq-hero-head h1{font-size:23px}.hq-hero-control{align-items:flex-start;text-align:left;width:100%}.hq-summary>span{flex:1;justify-content:center}.hq-summary>a{width:100%;justify-content:flex-end}.hq-office-floor{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 9px;min-height:auto;padding:72px 12px 64px;background-position:center top}.hq-person{position:relative;left:auto;top:auto;width:auto;transform:none}.hq-person-avatar{width:60px;height:60px;border-radius:19px}.hq-person-avatar img{border-radius:16px}.hq-person.is-commander .hq-person-avatar,.hq-person.is-center .hq-person-avatar{width:66px;height:66px;border-radius:21px}.hq-person[data-zone="command"]{order:1}.hq-person[data-zone="center"]{order:2;grid-column:1/-1}.hq-person[data-zone="operations"]{order:3}.hq-agent-popup,.hq-waiting-label{position:relative;left:auto;bottom:auto;order:-1;width:min(150px,100%);margin-bottom:7px;transform:none}.hq-agent-popup:after{display:none}.hq-person-name span{max-width:130px}.hq-office-caption{left:12px;bottom:12px}.hq-agent-details{padding:11px 13px 14px}}
.app:has(.ops-page) .brand-mark{background:#fff;border-color:#e2e8f0}.app:has(.ops-page) .brand-name{font-size:15.5px!important}.app:has(.ops-page) .brand-name:after{content:none!important}.app:has(.ops-page) .brand-sub{font-size:11.5px!important}.app:has(.ops-page) .brand-sub:after{content:none!important}
.editorial-stages{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px}.editorial-stages span{padding:5px 7px;border-radius:8px;background:#f1f5f9;color:#94a3b8;font-size:8px;font-weight:800}.editorial-stages .done{background:#ecfdf5;color:#047857}.editorial-stages .current{background:#ede9fe;color:#6d28d9}.editorial-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:12px 0}.editorial-grid article{padding:12px;border:1px solid #ede9fe;border-radius:12px;background:#fafafe}.editorial-grid article>b{font-size:9px;color:#6d28d9}.editorial-grid p,.editorial-grid li{font-size:9.5px;line-height:1.5}.editorial-grid ul{padding-left:16px}.editorial-section details{margin:12px 0;font-size:9.5px}@media(max-width:1000px){.editorial-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.editorial-grid{grid-template-columns:1fr}}
/* UX08: internal HQ chapter hierarchy */
.hq-hero{margin-bottom:34px}.hq-hero .ops-chapter-context{--ops-accent:#ec4899;margin:16px 20px}.ops-chapter{--ops-accent:#7c3aed;position:relative;margin-bottom:34px;padding:28px;border-color:color-mix(in srgb,var(--ops-accent) 26%,rgba(255,255,255,.78));background:linear-gradient(145deg,color-mix(in srgb,var(--ops-accent) 9%,rgba(255,255,255,.96)),rgba(255,255,255,.92) 48%);box-shadow:0 18px 48px color-mix(in srgb,var(--ops-accent) 10%,transparent)}.ops-chapter:before{content:'';position:absolute;top:-18px;left:30px;right:30px;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--ops-accent) 50%,#d8d3e8),transparent)}
.chapter-mission{--ops-accent:#4f46e5}.chapter-today{--ops-accent:#2563eb}.chapter-editorial{--ops-accent:#db2777}.chapter-flow{--ops-accent:#0f766e}.chapter-kpi{--ops-accent:#059669}.chapter-sync{--ops-accent:#d97706}
.ops-chapter .ops-section-head{align-items:center;margin-bottom:18px}.ops-chapter .ops-section-head>div>span{font-size:12px;color:var(--ops-accent)}.ops-chapter .ops-section-head h2{font-size:25px;line-height:1.3}.ops-chapter .ops-section-head p{max-width:820px;margin-top:7px;font-size:14px;line-height:1.6;color:#64748b}
.ops-chapter-context{display:grid;grid-template-columns:44px minmax(0,1fr) minmax(0,1fr);gap:13px;align-items:stretch;margin:0 0 22px;padding:14px;border:1px solid color-mix(in srgb,var(--ops-accent) 22%,#e2e8f0);border-radius:15px;background:rgba(255,255,255,.72)}.ops-chapter-context>span{display:grid;width:44px;height:44px;place-items:center;align-self:center;border-radius:13px;background:color-mix(in srgb,var(--ops-accent) 12%,#fff);color:var(--ops-accent)}.ops-chapter-context>div{display:flex;min-width:0;flex-direction:column;justify-content:center;padding:2px 13px;border-left:1px solid #e2e8f0}.ops-chapter-context small{font-size:11px;font-weight:800;letter-spacing:.06em;color:var(--ops-accent)}.ops-chapter-context b{margin-top:4px;font-size:14px;line-height:1.5;color:#334155}
.ops-chapter .ops-components,.ops-chapter .ops-table-wrap,.ops-chapter .ops-analysis article,.ops-chapter .ops-manual article,.ops-chapter .editorial-grid article{background:rgba(255,255,255,.8)}
[data-theme="dark"] .ops-chapter{background:linear-gradient(145deg,color-mix(in srgb,var(--ops-accent) 14%,#171526),#171526 52%);border-color:color-mix(in srgb,var(--ops-accent) 35%,#39334d)}[data-theme="dark"] .ops-chapter-context{background:#211e31;border-color:#39334d}[data-theme="dark"] .ops-chapter-context>div{border-color:#39334d}[data-theme="dark"] .ops-chapter-context b,[data-theme="dark"] .ops-chapter .ops-section-head h2{color:#f8fafc}[data-theme="dark"] .ops-chapter .ops-section-head p{color:#cbd5e1}
@media(max-width:700px){.ops-chapter{margin-bottom:28px;padding:19px}.ops-chapter:before{left:20px;right:20px}.ops-chapter .ops-section-head h2{font-size:23px}.ops-chapter-context{grid-template-columns:38px 1fr;gap:9px}.ops-chapter-context>span{width:38px;height:38px}.ops-chapter-context>div{padding:2px 8px}.ops-chapter-context>div:last-child{grid-column:2}.ops-chapter-context b{font-size:13px}.hq-hero .ops-chapter-context{margin:14px}}
</style>`;
}
