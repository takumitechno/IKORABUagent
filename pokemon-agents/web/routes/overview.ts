import type { Database } from "bun:sqlite";
import { escapeHtml, timeAgo } from "../components/layout";
import {
  customerDashboardStyles, customerThemeScript, dashboardIcon,
} from "../components/customer-dashboard-visuals";
import type {
  CustomerReviewItem, ManualPostStatus, ThreadsContent, ThreadsDashboardData,
} from "../lib/threads-dashboard";

// Legacy live-update exports. Customer responses never expose actor identities.
export interface Post {
  id: number; agent_slug: string; pokemon_jp: string | null; avatar_url: string | null;
  role_label: string | null; status: string; what_done: string | null;
  result_summary: string | null; error_message: string | null; created_at: string;
}

export function fetchReflectionsSince(db: Database, sinceId: number, limit: number): Post[] {
  return db.query<Post, []>(
    `SELECT r.id, r.agent_slug, NULL AS pokemon_jp, NULL AS avatar_url, NULL AS role_label,
            r.status, r.what_done, r.result_summary, r.error_message, r.created_at
     FROM reflections r WHERE r.id > ${Number(sinceId) || 0}
     ORDER BY r.id DESC LIMIT ${Math.max(1, Math.min(100, Number(limit) || 30))}`,
  ).all();
}

export function renderReflectionPost(p: Post): string {
  return JSON.stringify({
    id: p.id, slug: "marketing-operation", intro: "運用状況を更新しました",
    text: p.status === "failed" ? "確認が必要な更新があります" : "運用タスクを更新しました",
    status: p.status === "failed" ? "failed" : "completed", time_ago: timeAgo(p.created_at),
  });
}

const metricLabels: Record<string, string> = {
  views: "表示", likes: "いいね", replies: "返信", reposts: "再投稿", quotes: "引用", shares: "シェア",
  profile_visits: "プロフィール遷移", follower_delta: "フォロワー増減", link_clicks: "リンククリック",
  lead_registrations: "登録", free_reading_applications: "無料申込", paid_conversions: "有料転換", revenue: "売上",
};
const originLabels: Record<ThreadsContent["origin"], string> = {
  ai_auto: "AI自動", ai_manual: "AI案を手動投稿", human_manual: "手動投稿", unknown: "作成方法を確認中",
};

function formatDate(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo" }).format(parsed);
}
function dayKey(value: string | Date | null): string | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Tokyo",
  }).format(parsed);
}
function scheduleSection(contents: ThreadsContent[]): string {
  const scheduled = contents.filter((content) => content.scheduledAt && !content.publication?.externalId);
  const today = dayKey(new Date());
  const tomorrow = dayKey(new Date(Date.now() + 86_400_000));
  const weekEnd = Date.now() + 7 * 86_400_000;
  const groups = [
    { label: "今日", items: scheduled.filter((content) => dayKey(content.scheduledAt) === today) },
    { label: "明日", items: scheduled.filter((content) => dayKey(content.scheduledAt) === tomorrow) },
    { label: "今週", items: scheduled.filter((content) => {
      const time = new Date(content.scheduledAt || "").getTime();
      return Number.isFinite(time) && time > Date.now() + 86_400_000 && time <= weekEnd;
    }) },
  ];
  return `<section class="section chapter chapter-schedule schedule-section"><div class="section-header"><div><div class="card-eyebrow">SCHEDULE</div><h2>投稿予定</h2><p class="section-lead">今日・明日・今週の公開予定です。予定がない場合は、推測で補いません。</p></div><span class="chapter-icon">${dashboardIcon("calendar")}</span></div><div class="schedule-groups">${groups.map((group) => `<article><span>${group.label}</span><strong>${group.items.length}</strong><small>${group.items.length ? group.items.map((item) => `${formatDate(item.scheduledAt, "時刻確認中")} ${escapeHtml(topicLabel(item.topic))}`).join(" / ") : "予定なし"}</small></article>`).join("")}</div></section>`;
}
function ageHours(value: string | null): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? Math.max(0, (Date.now() - time) / 3_600_000) : null;
}
function elapsedLabel(value: string | null): string {
  const hours = ageHours(value);
  if (hours === null) return "未投稿";
  if (hours < 1) return `${Math.max(1, Math.floor(hours * 60))}分経過`;
  if (hours < 24) return `${Math.floor(hours)}時間経過`;
  return `${Math.floor(hours / 24)}日${Math.floor(hours % 24)}時間経過`;
}
function topicLabel(topic: string | null): string {
  const value = (topic || "").trim();
  if (!value || value.toLowerCase() === "unclassified" || value === "未指定") {
    return "テーマ未設定";
  }
  return value;
}
function roleLabel(role: string | null): string {
  return ({ reach: "認知を広げる", trust: "信頼を育てる", desire: "興味を高める", conversion: "行動を促す" } as Record<string, string>)[role || ""] || "目的を整理中";
}
function topicOrRoleLabel(topic: string | null, role: string | null): string {
  const label = topicLabel(topic);
  return label === "テーマ未設定" ? roleLabel(role) : label;
}
function accountStatusLabel(status: string | null): string {
  return ({ active: "稼働中", paused: "一時停止中", disabled: "停止中" } as Record<string, string>)[status || ""] || "状態確認中";
}
function contentStatus(content: ThreadsContent): { label: string; tone: string; stage: number } {
  const hasPublishedPart = content.publication?.mode === "live" && Boolean(content.publication.externalId);
  const hasMetrics = Object.values(content.metrics).some((value) => typeof value === "number");
  if (hasPublishedPart && content.publication?.status === "succeeded" && hasMetrics) return { label: "分析中", tone: "completed", stage: 6 };
  if (hasPublishedPart && content.publication?.status === "succeeded") return { label: "投稿済み", tone: "completed", stage: 5 };
  if (hasPublishedPart) return { label: "一部投稿済み", tone: "warning", stage: 5 };
  if (content.scheduledAt) return { label: "投稿予定", tone: "running", stage: 4 };
  if (content.approved) return { label: "承認済み", tone: "running", stage: 3 };
  if (content.state === "human_approval_pending") return { label: "承認待ち", tone: "pending", stage: 3 };
  if (content.qaVerdict === "pass") return { label: "内容確認済み", tone: "pending", stage: 2 };
  return { label: "企画・作成中", tone: "queued", stage: 1 };
}
function metricEntries(content: ThreadsContent): [string, number][] {
  return Object.entries(content.metrics).filter((entry): entry is [string, number] => typeof entry[1] === "number");
}
function renderMetrics(content: ThreadsContent): string {
  const entries = metricEntries(content);
  if (!entries.length) return `<span class="measuring">計測中</span>`;
  const primary = ["views", "likes", "replies", "reposts", "quotes", "shares"] as const;
  const values = primary.map((key) => typeof content.metrics[key] === "number"
    ? `<span class="actual-metric metric-${key}"><b>${escapeHtml(metricLabels[key])}</b>${content.metrics[key]!.toLocaleString("ja-JP")}</span>`
    : `<span class="actual-metric metric-${key} unavailable"><b>${escapeHtml(metricLabels[key])}</b>取得不可</span>`);
  if (content.viewsPerHour !== null) values.push(`<span class="actual-metric normalized metric-views-hour"><b>表示/時</b>${content.viewsPerHour.toFixed(1)}</span>`);
  if (content.engagementPerHour !== null) values.push(`<span class="actual-metric normalized metric-reaction-hour"><b>反応/時</b>${content.engagementPerHour.toFixed(1)}</span>`);
  const reactions = [content.metrics.likes, content.metrics.replies, content.metrics.reposts, content.metrics.quotes, content.metrics.shares]
    .filter((value): value is number => typeof value === "number").reduce((sum, value) => sum + value, 0);
  if (typeof content.metrics.views === "number" && content.metrics.views > 0 && reactions > 0) values.push(`<span class="actual-metric normalized metric-reaction-rate"><b>反応率</b>${((reactions / content.metrics.views) * 100).toFixed(1)}%</span>`);
  return `<div class="actual-metrics">${values.join("")}<small class="metric-updated">最終取得 ${escapeHtml(formatDate(content.metricsFetchedAt ?? content.metricsObservedAt, "時刻不明"))}</small></div>`;
}
function currentHypothesis(contents: ThreadsContent[]): string {
  const candidates = contents.map((content) => content.viewsPerHour !== null
    ? { topic: topicLabel(content.topic), rate: content.viewsPerHour } : null)
    .filter((item): item is { topic: string; rate: number } => item !== null);
  if (candidates.length < 2) return "比較できる投稿がまだ少ないため、反応の違いは仮説として保留します。";
  candidates.sort((a, b) => b.rate - a.rate);
  return `「${candidates[0].topic}」は表示の伸びが相対的に高い可能性があります。ただし、現時点では小標本の暫定仮説です。`;
}
function totalMetric(contents: ThreadsContent[], key: keyof ThreadsContent["metrics"]): number | null {
  const values = contents.map((content) => content.metrics[key]).filter((value): value is number => typeof value === "number");
  return values.length ? values.reduce((sum, value) => sum + value, 0) : null;
}

function sectionContext(iconName: string, now: string, next: string): string {
  return `<div class="section-context"><span class="section-context-icon">${dashboardIcon(iconName)}</span><div><small>NOW / 今の状態</small><b>${escapeHtml(now)}</b></div><div><small>NEXT / 次に起きること</small><b>${escapeHtml(next)}</b></div></div>`;
}

function renderSparkline(contents: ThreadsContent[], key: keyof ThreadsContent["metrics"]): string {
  const values = contents.map((content) => content.metrics[key]).filter((value): value is number => typeof value === "number");
  if (values.length < 2) return `<div class="kpi-measured" aria-label="実測 ${values.length}件"><i style="width:${values.length ? "34" : "0"}%"></i></div>`;
  const max = Math.max(...values), min = Math.min(...values), range = Math.max(1, max - min);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 25 - ((value - min) / range) * 21;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const dots = points.map((point) => {
    const [cx, cy] = point.split(",");
    return `<circle cx="${cx}" cy="${cy}" r="1.7"/>`;
  }).join("");
  return `<svg viewBox="0 0 100 28" preserveAspectRatio="none" role="img" aria-label="${values.length}件の実測推移"><polyline points="${points.join(" ")}"/>${dots}</svg>`;
}

function renderViewsChart(contents: ThreadsContent[]): string {
  const rows = contents.map((content) => typeof content.metrics.views === "number"
    ? { label: topicLabel(content.topic), value: content.metrics.views } : null)
    .filter((row): row is { label: string; value: number } => row !== null)
    .slice(0, 6);
  if (!rows.length) return `<div class="empty-visual">${dashboardIcon("chart")}<div><b>表示データを計測中</b><p>実測値が取得できると投稿ごとの比較を表示します。</p></div></div>`;
  const max = Math.max(1, ...rows.map((row) => row.value));
  return `<div class="bar-chart" role="img" aria-label="投稿ごとの表示数比較">${rows.map((row) => `<div class="bar-row"><span class="bar-label" title="${escapeHtml(row.label)}">${escapeHtml(row.label)}</span><span class="bar-track"><i class="bar-fill" style="width:${Math.max(row.value > 0 ? 3 : 0, (row.value / max) * 100).toFixed(1)}%"></i></span><b class="bar-value">${row.value.toLocaleString("ja-JP")}</b></div>`).join("")}</div>`;
}

function renderStatusDonut(contents: ThreadsContent[]): string {
  if (!contents.length) return `<div class="empty-visual">${dashboardIcon("pipeline")}<div><b>投稿データを待っています</b><p>実データ接続後に状態内訳を表示します。</p></div></div>`;
  const segments = [
    { label: "作成・審査", value: contents.filter((content) => contentStatus(content).stage <= 2).length, color: "#94a3b8" },
    { label: "承認・予定", value: contents.filter((content) => [3, 4].includes(contentStatus(content).stage)).length, color: "#3b82f6" },
    { label: "投稿済み", value: contents.filter((content) => contentStatus(content).stage === 5).length, color: "#8b5cf6" },
    { label: "分析中", value: contents.filter((content) => contentStatus(content).stage >= 6).length, color: "#10b981" },
  ];
  let cursor = 0;
  const stops = segments.map((segment) => {
    const start = cursor;
    cursor += (segment.value / contents.length) * 100;
    return `${segment.color} ${start.toFixed(1)}% ${cursor.toFixed(1)}%`;
  }).join(",");
  return `<div class="donut-layout"><div class="donut" style="background:conic-gradient(${stops})" role="img" aria-label="投稿状態の内訳"><div class="donut-center"><b>${contents.length}</b><span>投稿</span></div></div><div class="donut-legend">${segments.map((segment) => `<span><i style="background:${segment.color}"></i>${segment.label} <b>${segment.value}</b></span>`).join("")}</div></div>`;
}

function renderManualPostSync(
  posts: ManualPostStatus[], accountId: string, canReview: boolean, notice: string | null,
): string {
  const labels = { ai_auto: "AI自動", ai_manual: "AI案を手動投稿", human_manual: "手動投稿" };
  const rows = posts.slice(0, 6).map((post) => {
    const firstLine = post.body.split(/\r?\n/).find(Boolean) ?? "手動投稿";
    const structure = post.partCount > 1 ? `スレッド投稿 1/${post.partCount}〜${post.partCount}/${post.partCount}` : labels[post.origin];
    const parts = post.partCount > 1 ? `<details><summary>スレッドの本文と実績を見る</summary>${post.parts.map((part) => `<p><b>${part.partIndex + 1}/${post.partCount}</b> ${escapeHtml(part.body.slice(0, 100))}${Object.keys(part.metrics).length ? ` · ${Object.entries(part.metrics).map(([key, value]) => `${escapeHtml(metricLabels[key] || "取得指標")} ${value}`).join(" / ")}` : " · 計測中"}</p>`).join("")}</details>` : "";
    const analyzed = Object.values(post.threadMetrics).some((value) => typeof value === "number");
    const state = analyzed ? "分析済み" : post.analyzeEnabled ? "取得中" : "未追加";
    const action = !post.analyzeEnabled && canReview
      ? `<form method="post" action="/api/customer/manual-posts/${encodeURIComponent(post.detectionId)}/analyze"><input type="hidden" name="account_id" value="${escapeHtml(accountId)}"><button class="manual-analyze" type="submit">分析に追加</button></form>`
      : !post.analyzeEnabled ? `<span class="manual-readonly">編集者または管理者が追加できます</span>` : "";
    return `<li><div class="manual-copy"><b>${escapeHtml(firstLine.slice(0, 64))}</b><small>${escapeHtml(formatDate(post.publishedAt, "公開日時を確認中"))} · ${escapeHtml(structure)}</small>${parts}</div><span class="manual-state ${analyzed ? "on" : post.analyzeEnabled ? "wait" : "off"}">${state}</span><span class="manual-state off">改善学習には使わない</span>${action}</li>`;
  }).join("");
  const analyzing = posts.filter((post) => post.analyzeEnabled).length;
  const noticeText = notice === "fetching" ? "分析データの取得を開始しました。" : notice === "analyzed"
    ? "この投稿は分析済みです。" : notice === "failed" ? "取得できませんでした。再試行してください。" : "";
  return `<section class="section chapter chapter-manual manual-sync"><div class="section-header"><div><div class="card-eyebrow">MANUAL POST ANALYSIS</div><h2>公開済みの手動投稿</h2><p class="section-lead">Threadsで直接投稿した内容を、必要なものだけ分析に追加できます。1件だけでAIの書き方は変更しません。</p></div><span class="chapter-icon">${dashboardIcon("publish")}</span></div>${sectionContext("activity", `${posts.length}件を検出・${analyzing}件を取得中または分析済み`, posts.length ? "新しい反応データを確認" : "新しい手動投稿の検出待ち")}${noticeText ? `<p class="review-notice">${escapeHtml(noticeText)}</p>` : ""}${rows ? `<ul>${rows}</ul>` : `<div class="empty-inline">現在、検出済みの手動投稿はありません。</div>`}</section>`;
}

function renderCustomerReviews(
  reviews: CustomerReviewItem[], accountId: string, canReview: boolean, notice: string | null,
): string {
  const noticeText = notice === "approve" ? "投稿案を承認しました。" : notice === "reject"
    ? "今回は見送る内容として記録しました。" : notice === "request-revision"
      ? "修正を受け付けました。新しい案ができるまでお待ちください。" : notice === "edit"
        ? "手動投稿案を編集しました。最新の本文を確認してください。" : "";
  const cards = reviews.map((item) => {
    const binding = `<input type="hidden" name="account_id" value="${escapeHtml(accountId)}"><input type="hidden" name="version" value="${item.version}"><input type="hidden" name="binding" value="${escapeHtml(item.contentHash)}">`;
    const endpoint = `/api/customer/content/${encodeURIComponent(item.contentId)}`;
    const middleAction = item.origin === "human_manual"
      ? `<details><summary>編集する</summary><form method="post" action="${endpoint}/edit">${binding}<label>投稿本文<textarea name="body" maxlength="8000" required>${escapeHtml(item.body)}</textarea></label><button type="submit">編集内容を保存</button></form></details>`
      : `<details><summary>修正を依頼</summary><form method="post" action="${endpoint}/request-revision">${binding}<label>直してほしい点<textarea name="feedback" maxlength="8000" required placeholder="例：もう少し柔らかく、文章を短く"></textarea></label><button type="submit">修正を依頼する</button></form></details>`;
    const actions = canReview ? `<div class="review-actions"><form method="post" action="${endpoint}/approve">${binding}<button class="review-approve" type="submit">承認する</button></form>${middleAction}<details><summary>今回は見送る</summary><form method="post" action="${endpoint}/reject">${binding}<label>見送る理由<textarea name="reason" maxlength="8000" required></textarea></label><button class="review-reject" type="submit">今回は見送る</button></form></details></div>` : `<p class="review-readonly">閲覧のみできます。操作は編集者または管理者に依頼してください。</p>`;
    return `<article class="review-card"><div class="review-meta"><span>${escapeHtml(topicLabel(item.topic))}</span><span>${escapeHtml(roleLabel(item.contentRole))}</span><span>第${item.version}案</span><b>${escapeHtml(item.status)}</b></div><p class="review-body">${escapeHtml(item.body)}</p><div class="review-detail"><div><small>作成日時</small><b>${escapeHtml(formatDate(item.createdAt, "作成日時を確認中"))}</b><small>投稿予定</small><b>${escapeHtml(formatDate(item.scheduledAt, "予定を調整中"))}</b></div><div><small>AIが変更したポイント</small><ul>${item.aiChanges.map((change) => `<li>${escapeHtml(change)}</li>`).join("") || "<li>品質確認済み</li>"}</ul></div></div>${actions}</article>`;
  }).join("");
  return `<section class="section chapter chapter-review"><div class="section-header"><div><div class="card-eyebrow">CONTENT REVIEW</div><h2>確認が必要な投稿</h2><p class="section-lead">AI案は修正を依頼でき、手動案は本文を直接編集できます。公開は別の処理です。</p></div><span class="chapter-icon">${dashboardIcon("publish")}</span></div>${sectionContext("activity", `確認待ち ${reviews.length}件`, "承認 / 修正または編集 / 見送り")}${noticeText ? `<p class="review-notice">${escapeHtml(noticeText)}</p>` : ""}${cards || `<div class="empty-state"><b>現在、確認が必要な投稿はありません</b><p>新しい案ができると、ここに表示されます。</p></div>`}</section>`;
}

export function renderOverview(
  _db: Database, data?: ThreadsDashboardData,
  reviewOptions?: { reviews: CustomerReviewItem[]; canReview: boolean; accountId: string; notice?: string | null; manualAnalysisNotice?: string | null },
): string {
  const connected = data?.connected === true;
  const contents = connected ? data.contents.slice(0, 12) : [];
  const published = contents.filter((content) => content.publication?.mode === "live" && content.publication.externalId);
  const measured = contents.filter((content) => metricEntries(content).length > 0);
  const nextContent = contents.filter((content) => !content.publication?.externalId).sort((a, b) => (a.scheduledAt || "9999").localeCompare(b.scheduledAt || "9999"))[0] ?? null;
  const handle = connected && data.handle ? (data.handle.startsWith("@") ? data.handle : `@${data.handle}`) : null;
  const accountName = connected ? data.displayName || "Threadsアカウント" : "Threadsアカウント";
  const updatedAt = formatDate(data?.fetchedAt ?? null, "未接続");
  const pendingApproval = contents.filter((content) => content.state === "human_approval_pending").length;
  const today = dayKey(new Date());
  const todayScheduled = contents.filter((content) => !content.publication?.externalId && dayKey(content.scheduledAt) === today).length;
  const todayPublished = published.filter((content) => dayKey(content.publication?.publishedAt ?? null) === today).length;
  const actualMetricCount = contents.reduce((sum, content) => sum + metricEntries(content).length, 0);
  const maxStage = contents.reduce((max, content) => Math.max(max, contentStatus(content).stage), 1);
  const operationNow = !connected ? "連携の復旧を待っています" : pendingApproval > 0 ? `${pendingApproval}件の承認を待っています` : nextContent ? "次回投稿の準備を進めています" : measured.length ? "投稿結果を分析しています" : "新しい企画を準備しています";
  const pipelineRows = contents.map((content, index) => {
    const status = contentStatus(content);
    const firstLine = content.body.split(/\r?\n/).find(Boolean) ?? "本文を準備中";
    const labeledTopic = topicLabel(content.topic);
    const pipelineTopic = labeledTopic === "テーマ未設定" ? firstLine.slice(0, 42) : labeledTopic;
    const schedule = formatDate(content.scheduledAt ?? content.publication?.publishedAt ?? null, content.publication?.externalId ? "公開時刻を確認中" : "予定を調整中");
    return `<article class="pipeline-row post-row" tabindex="0" role="button" data-post-index="${index}"><div class="pipeline-card-head"><div class="pipeline-topic"><span class="topic-name">${escapeHtml(pipelineTopic)}</span><small>${escapeHtml(roleLabel(content.contentRole))}</small></div><button class="detail-button" type="button" aria-label="投稿詳細を開く">›</button></div><div class="pipeline-card-meta"><div class="pipeline-meta"><span>作成方法</span><b><span class="origin-chip">${escapeHtml(originLabels[content.origin])}</span></b></div><div class="pipeline-meta"><span>現在地</span><b><span class="badge ${status.tone}">${status.label}</span></b></div><div class="pipeline-meta schedule-cell"><span>${content.publication?.externalId ? "公開実績" : "投稿予定"}</span><b>${escapeHtml(schedule)}</b></div></div><div class="pipeline-card-metrics">${renderMetrics(content)}</div></article>`;
  }).join("");
  const safeContents = JSON.stringify(contents.map((content) => ({
    topic: topicLabel(content.topic), body: content.body, role: roleLabel(content.contentRole), origin: originLabels[content.origin],
    status: contentStatus(content).label, schedule: formatDate(content.scheduledAt ?? content.publication?.publishedAt ?? null, "予定を調整中"),
    quality: content.qaVerdict === "pass" ? "内容確認済み" : content.qaVerdict ? "内容を再確認中" : "内容確認前",
    approval: content.approved ? "承認済み" : content.state === "human_approval_pending" ? "承認待ち" : "承認前",
    published: content.publication?.externalId ? "公開を確認済み" : "未公開",
  }))).replace(/</g, "\\u003c");
  const hasMetricObservation = contents.some((content) => content.metricsObservedAt !== null);
  const metrics = [["views", "表示"], ["likes", "いいね"], ["replies", "返信"], ["reposts", "再投稿"], ["quotes", "引用"], ["shares", "シェア"]] as const;
  const latestMetricAt = contents.map((content) => content.metricsFetchedAt ?? content.metricsObservedAt).filter((value): value is string => Boolean(value)).sort().at(-1) ?? null;
  const totalViews = totalMetric(contents, "views");
  const stageCounts = [1, 2, 3, 4, 5, 6, 7].map((stage) => contents.filter((content) => contentStatus(content).stage === stage).length);
  const nextPostLabel = nextContent ? `${formatDate(nextContent.scheduledAt, "予定を調整中")} · ${topicLabel(nextContent.topic)}` : connected ? "投稿予定を調整中" : "接続復旧後に表示";
  const metricNext = latestMetricAt ? "次回Insights更新を待っています" : connected ? "最初のKPI取得待ち" : "接続復旧後に計測開始";
  const pipelineNow = connected ? `企画・審査 ${stageCounts[0] + stageCounts[1]}件 / 承認・予定 ${stageCounts[2] + stageCounts[3]}件 / 投稿・分析 ${stageCounts[4] + stageCounts[5]}件` : "運用データへ接続待ち";

  return `
<div id="overview" class="customer-dashboard">
  <header class="customer-hero"><div class="hero-main"><div class="page-kicker">SOCIAL OPERATIONS</div><h1>${escapeHtml(accountName)}のSNS運用</h1><div class="account-line">${handle ? `<span>${escapeHtml(handle)}</span>` : ""}<span class="status-badge ${connected ? "online" : "waiting"}"><i></i>${connected ? accountStatusLabel(data?.accountStatus ?? null) : "接続待ち"}</span></div><p>${escapeHtml(operationNow)}</p></div><div class="hero-actions"><div class="hero-update"><span>最終確認</span><b>${escapeHtml(updatedAt)}</b><small>${connected ? "最新の運用データを表示" : "実データは表示していません"}</small></div><button class="theme-toggle" id="theme-toggle" type="button" aria-label="表示テーマを切り替える"><span class="theme-moon">${dashboardIcon("moon")}</span><span class="theme-sun">${dashboardIcon("sun")}</span><span id="theme-label">ダーク</span></button></div></header>
  ${connected && contents.length === 0 ? `<section class="section chapter chapter-start"><div class="section-header"><div><div class="card-eyebrow">GETTING STARTED</div><h2>まず、ここから始めましょう</h2><p class="section-lead">最初の投稿が少ない間は、あなた自身の言葉を運用の土台にします。</p></div><span class="chapter-icon">${dashboardIcon("next")}</span></div><div class="getting-started-grid"><article><span>1</span><b>Threadsで5〜10件投稿</b><p>いつもの言葉で、まずは手動投稿をためます。</p></article><article><span>2</span><b>投稿の取り込みを依頼</b><p>運用担当者が投稿を分析対象として安全に取り込みます。</p></article><article><span>3</span><b>届いたAI案を確認</b><p>確認待ちに表示された案を、承認・修正依頼・見送りから選びます。</p></article></div><p class="getting-started-note">紹介リンクは後から登録できます。未登録の間は、販売を促す投稿案を作りません。</p></section>` : ""}
  <section class="section chapter chapter-today" aria-label="今日の運用"><div class="section-header"><div><div class="card-eyebrow">TODAY'S OPERATION</div><h2>今日の運用</h2><p class="section-lead">今動いていることと、このあと予定されている動きを最初に確認する場所です。</p></div><span class="chapter-icon">${dashboardIcon("activity")}</span></div>${sectionContext("calendar", connected ? `${accountStatusLabel(data?.accountStatus ?? null)} · 公開 ${published.length}件 · KPI取得 ${measured.length}件` : "Threads連携の復旧待ち", nextPostLabel)}<div class="now-grid">
    <article class="now-card primary"><div class="summary-top"><span class="summary-label">稼働状態</span><span class="summary-icon">${dashboardIcon("activity")}</span></div><strong class="summary-value textual">${escapeHtml(operationNow)}</strong><small>${connected ? `運用中 ${contents.length}件` : "連携復旧後に自動更新"}</small></article>
    <article class="now-card"><div class="summary-top"><span class="summary-label">今日の投稿予定</span><span class="summary-icon">${dashboardIcon("calendar")}</span></div><strong class="summary-value">${connected ? todayScheduled : "—"}</strong><small>${escapeHtml(nextContent ? formatDate(nextContent.scheduledAt, "予定を調整中") : "予定なし")}</small></article>
    <article class="now-card"><div class="summary-top"><span class="summary-label">確認待ち</span><span class="summary-icon">${dashboardIcon("publish")}</span></div><strong class="summary-value">${connected ? pendingApproval : "—"}</strong><small>${pendingApproval ? "対応が必要です" : "現在の対応はありません"}</small></article>
    <article class="now-card"><div class="summary-top"><span class="summary-label">今日の投稿済み</span><span class="summary-icon">${dashboardIcon("publish")}</span></div><strong class="summary-value">${connected ? todayPublished : "—"}</strong><small>公開を確認できた投稿</small></article>
    <article class="now-card"><div class="summary-top"><span class="summary-label">現在のアカウント</span><span class="summary-icon">${dashboardIcon("activity")}</span></div><strong class="summary-value textual">${escapeHtml(handle || accountName)}</strong><small>${escapeHtml(accountName)}</small></article>
    <article class="now-card"><div class="summary-top"><span class="summary-label">最終同期</span><span class="summary-icon">${dashboardIcon("clock")}</span></div><strong class="summary-value textual">${escapeHtml(updatedAt)}</strong><small>${latestMetricAt ? `KPI最終取得 ${escapeHtml(formatDate(latestMetricAt))}` : "実データの取得時刻"}</small></article>
  </div></section>
  ${reviewOptions ? renderCustomerReviews(reviewOptions.reviews, reviewOptions.accountId, reviewOptions.canReview, reviewOptions.notice ?? null) : ""}
  ${connected ? scheduleSection(contents) : ""}
  <section id="pipeline" class="section chapter chapter-pipeline pipeline-section"><div class="section-header"><div><div class="card-eyebrow">CONTENT PIPELINE</div><h2>投稿パイプライン</h2><p class="section-lead">企画から投稿・分析まで、各投稿がどの工程にいるかを見る場所です。</p></div><span class="chapter-icon">${dashboardIcon("pipeline")}</span></div>${sectionContext("pipeline", pipelineNow, nextContent ? `次に動く投稿: ${topicLabel(nextContent.topic)}` : connected ? "次の企画・投稿予定の登録待ち" : "接続復旧後に進行を再表示")}<div class="workflow-section" aria-label="運用フロー"><div class="workflow-copy"><span>運用の流れ</span><b>今いる段階をひと目で確認</b></div><div class="journey">${["企画", "審査", "承認", "投稿予定", "投稿済み", "分析", "改善"].map((label, index) => `<div class="journey-step ${index + 1 < maxStage ? "done" : index + 1 === maxStage ? "active" : ""}"><span>${index + 1}<em>${stageCounts[index]}</em></span><b>${label}</b></div>${index < 6 ? "<i></i>" : ""}`).join("")}</div></div>${connected && pipelineRows ? `<div class="pipeline-head"><span>テーマ / 役割</span><span>作成方法</span><span>現在地</span><span>投稿予定・実績</span><span>KPI</span><span></span></div><div class="pipeline-list">${pipelineRows}</div>` : `<div class="empty-state"><b>${connected ? "運用中の投稿はありません" : "運用データに接続していません"}</b><p>${connected ? "新しい企画が始まると、ここに進行状況が表示されます。" : "接続が復旧するまで、投稿内容や数値を仮のデータで補いません。"}</p></div>`}</section>
  ${connected ? renderManualPostSync(data?.manualPosts ?? [], reviewOptions?.accountId ?? "", reviewOptions?.canReview === true, reviewOptions?.manualAnalysisNotice ?? null) : ""}
  <section id="morning-report" class="section chapter chapter-performance performance-section"><div class="section-header"><div><div class="card-eyebrow green">PERFORMANCE</div><h2>投稿実績とKPI</h2><p class="section-lead">実際の反応を実測値で確認し、投稿どうしを比較する場所です。</p></div><span class="chapter-icon">${dashboardIcon("chart")}</span></div>${sectionContext("metrics", connected ? `表示 ${typeof totalViews === "number" ? totalViews.toLocaleString("ja-JP") : "計測中"} · KPI ${actualMetricCount}項目 · 比較 ${measured.length}件` : "実データへ接続待ち", metricNext)}<div class="kpi-grid">${metrics.map(([key, label]) => { const value = totalMetric(contents, key); return `<article class="kpi-card"><span>${label}</span><strong>${typeof value === "number" ? value.toLocaleString("ja-JP") : hasMetricObservation ? "取得不可" : "計測中"}</strong><small>${typeof value === "number" ? "取得済み投稿の合計" : hasMetricObservation ? "APIから値が返っていません" : "実値の取得待ち"}</small><div class="kpi-visual">${renderSparkline(contents, key)}</div></article>`; }).join("")}</div>${connected && contents.length ? `<div class="performance-list">${contents.map((content) => `<article><div><span class="origin-chip">${escapeHtml(originLabels[content.origin])}</span><h3>${escapeHtml(topicLabel(content.topic))}</h3><small>${escapeHtml(formatDate(content.publication?.publishedAt ?? null, "未投稿"))} · ${escapeHtml(elapsedLabel(content.publication?.publishedAt ?? null))}</small></div>${renderMetrics(content)}<details><summary>本文を見る</summary><p>${escapeHtml(content.body)}</p></details></article>`).join("")}</div>` : `<div class="empty-state compact"><b>${connected ? "比較できる実績を蓄積中です" : "接続待ち"}</b><p>実値が取得できるまで、推定値やデモ値は表示しません。</p></div>`}</section>
  <section class="section chapter chapter-visuals visuals-section" aria-label="実績の可視化"><div class="section-header compact-heading"><div><div class="card-eyebrow">VISUAL INSIGHTS</div><h2>実績を図で確認</h2><p class="section-lead">KPI章の補助ビュー。実測値だけで違いを可視化します。</p></div><span class="count-pill">実データのみ</span></div><div class="chart-grid"><article class="chart-card"><div class="chart-title"><div><span class="summary-icon">${dashboardIcon("chart")}</span><b>投稿ごとの表示数</b></div><small>${contents.filter((content) => typeof content.metrics.views === "number").length}件を比較</small></div>${renderViewsChart(contents)}</article><article class="chart-card"><div class="chart-title"><div><span class="summary-icon">${dashboardIcon("pipeline")}</span><b>投稿状態の内訳</b></div><small>現在地</small></div>${renderStatusDonut(contents)}</article></div></section>
  <section id="insights" class="section chapter chapter-ai report-section"><div class="section-header"><div><div class="card-eyebrow purple">AI IMPROVEMENT REPORT</div><h2>AI改善</h2><p class="section-lead">AIが何を確認し、次の投稿で何を1つ変えるかを整理する場所です。</p></div><span class="chapter-icon">${dashboardIcon("experiment")}</span></div>${sectionContext("hypothesis", connected ? `事実 ${measured.length}件 / 仮説を${measured.length < 2 ? "保留中" : "更新中"}` : "判断材料へ接続待ち", data?.editorial.customerSummary ? "登録済みの次回テストを実行予定" : "比較可能な実績が揃うまで計測")}<div class="decision-grid"><article><span>${dashboardIcon("experiment")}</span><b>今回確認していること</b><p>${connected && measured.length ? `${escapeHtml(measured.slice(0, 3).map((content) => topicOrRoleLabel(content.topic, content.contentRole)).join("、"))}の実測結果を観測しています。` : "運用データの接続後に表示します。"}</p></article><article><span>${dashboardIcon("hypothesis")}</span><b>結果から見えたこと</b><p>${connected ? escapeHtml(currentHypothesis(contents)) : "接続待ちのため、結果の仮説は表示していません。"}</p></article><article id="operations"><span>${dashboardIcon("next")}</span><b>次回テスト</b><p>${data?.editorial.customerSummary ? "登録済みの改善方針と変更する要素を、詳細レポートで確認できます。" : "変更内容はまだ登録されていません。比較可能な実績が揃った後、1要素に絞ります。"}</p></article></div><div class="analysis-grid"><article class="analysis-box fact"><span class="analysis-icon">${dashboardIcon("fact")}</span><h3>確認できた事実</h3><p>${connected ? `保存 ${contents.length}件・公開 ${published.length}件・KPI取得 ${measured.length}件。` : "実データに接続していません。"}</p></article><article class="analysis-box hypothesis"><span class="analysis-icon">${dashboardIcon("hypothesis")}</span><h3>現時点の仮説</h3><p>${connected ? escapeHtml(currentHypothesis(contents)) : "判断材料を取得できていません。"}</p></article><article class="analysis-box unknown"><span class="analysis-icon">${dashboardIcon("unknown")}</span><h3>まだ判断できないこと</h3><p>${measured.length < 2 ? "投稿間の優劣・勝ちパターン・最適解。" : "本文要素と反応の因果関係、長期的な再現性。"}</p></article><article class="analysis-box next-test"><span class="analysis-icon">${dashboardIcon("next")}</span><h3>検証の原則</h3><p>一度に変える要素は1つ。実値と経過時間をセットで比較します。</p></article></div><a class="report-cta" href="/improvement">AI改善レポートを詳しく見る <span>→</span></a></section>
</div>
<div class="drawer-backdrop" id="drawer-backdrop" hidden></div><aside class="post-drawer" id="post-drawer" aria-hidden="true" aria-labelledby="drawer-title"><button class="drawer-close" id="drawer-close" type="button" aria-label="閉じる">×</button><div class="card-eyebrow">POST DETAIL</div><h2 id="drawer-title"></h2><div class="drawer-tags"><span id="drawer-status"></span><span id="drawer-origin"></span></div><div class="drawer-block"><span>投稿本文</span><p id="drawer-body"></p></div><div class="drawer-grid"><div><span>投稿の役割</span><p id="drawer-role"></p></div><div><span>投稿予定・実績</span><p id="drawer-schedule"></p></div><div><span>内容確認</span><p id="drawer-quality"></p></div><div><span>承認状況</span><p id="drawer-approval"></p></div><div><span>公開状況</span><p id="drawer-published"></p></div></div></aside>
<style>
.customer-dashboard{max-width:1440px;margin:0 auto}.customer-hero{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding:4px 2px 20px}.hero-main h1{font-size:30px;letter-spacing:-.04em;color:#0f172a;text-transform:none;margin:2px 0 6px}.hero-main>p{font-size:14px;font-weight:700;color:#334155;margin-top:13px}.account-line{display:flex;align-items:center;gap:9px;color:#64748b;font-size:12px}.status-badge{display:inline-flex;align-items:center;gap:7px;border-radius:999px;padding:6px 10px;font-size:10px;font-weight:800;background:#ecfdf5;color:#047857}.status-badge i{width:7px;height:7px;border-radius:50%;background:#10b981}.status-badge.waiting{background:#fff7ed;color:#c2410c}.status-badge.waiting i{background:#f59e0b}.hero-update{min-width:210px;padding:13px 15px;border:1px solid #e2e8f0;background:rgba(255,255,255,.75);border-radius:14px;display:grid}.hero-update span,.hero-update small{font-size:9px;color:#94a3b8}.hero-update b{font-size:12px;color:#334155;margin:2px 0}
.now-grid{display:grid;grid-template-columns:1.35fr repeat(3,1fr);gap:11px;margin-bottom:14px}.now-card{min-width:0;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:18px;display:flex;flex-direction:column;box-shadow:var(--shadow-card)}.now-card.primary{background:linear-gradient(135deg,#172554,#1e3a8a);border:0}.now-card span{font-size:9px;font-weight:800;letter-spacing:.08em;color:#64748b}.now-card strong{font-size:15px;color:#0f172a;margin:8px 0 5px;line-height:1.45}.now-card small{font-size:10px;color:#94a3b8}.now-card.primary span,.now-card.primary small{color:#bfdbfe}.now-card.primary strong{color:#fff}
.getting-started-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.getting-started-grid article{padding:18px;border:1px solid var(--c-line);border-radius:16px;background:var(--c-raised)}.getting-started-grid span{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#dbeafe;color:#1d4ed8;font-weight:900}.getting-started-grid b{display:block;margin-top:12px;color:var(--c-text);font-size:15px}.getting-started-grid p,.getting-started-note{color:var(--c-text-3);line-height:1.7}.getting-started-note{margin:14px 0 0;font-size:13px}.chapter-start{--chapter-accent:#2563eb}
.workflow-section{display:flex;align-items:center;gap:24px;background:#fff;border-radius:16px;padding:14px 18px;margin-bottom:14px;box-shadow:var(--shadow-card)}.workflow-copy{width:180px;flex:none;display:flex;flex-direction:column}.workflow-copy span{font-size:9px;color:#94a3b8}.workflow-copy b{font-size:11px;color:#334155;margin-top:2px}.journey{display:flex;align-items:center;gap:7px;flex:1}.journey i{height:1px;background:#e2e8f0;flex:1;min-width:8px}.journey-step{display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:10px;white-space:nowrap}.journey-step span{width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#f1f5f9;font-size:9px;font-weight:800}.journey-step.done{color:#047857}.journey-step.done span{background:#dcfce7;color:#047857}.journey-step.active{color:#1d4ed8}.journey-step.active span{background:#dbeafe;color:#1d4ed8;box-shadow:0 0 0 4px #eff6ff}
.section{margin-bottom:14px}.section-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.section-header h2{font-size:19px;color:#0f172a;text-transform:none;letter-spacing:-.02em;margin:0}.section-lead{color:#64748b;font-size:11px;margin-top:4px}.card-eyebrow{font-size:9px;letter-spacing:.14em;font-weight:800;color:#64748b;margin-bottom:6px}.card-eyebrow.green{color:#059669}.card-eyebrow.purple{color:#7c3aed}.count-pill,.hypothesis-pill{padding:6px 10px;border-radius:999px;background:#f1f5f9;color:#475569;font-size:9px;font-weight:800;white-space:nowrap}.hypothesis-pill{background:#fef3c7;color:#92400e}.pipeline-section,.performance-section,.report-section,.manual-sync{padding:22px}.pipeline-head,.pipeline-row{display:grid;grid-template-columns:minmax(210px,1.5fr) minmax(110px,.7fr) minmax(105px,.65fr) minmax(130px,.8fr) minmax(210px,1.25fr) 34px;gap:12px;align-items:center}.pipeline-head{margin-top:18px;padding:0 12px 8px;color:#94a3b8;font-size:9px;font-weight:800}.pipeline-list{border-top:1px solid #e2e8f0}.pipeline-row{padding:13px 12px;border-bottom:1px solid #edf2f7;cursor:pointer;outline:none;border-radius:10px}.pipeline-row:hover,.pipeline-row:focus{background:#f8fafc}.pipeline-topic{display:flex;flex-direction:column;min-width:0}.topic-name{font-size:11.5px;font-weight:800;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pipeline-topic small,.schedule-cell small{font-size:9px;color:#94a3b8;margin-top:3px}.origin-chip{display:inline-flex;padding:4px 7px;border-radius:7px;background:#eff6ff;color:#1d4ed8;font-size:9px;font-weight:800}.schedule-cell{display:flex;flex-direction:column}.schedule-cell b{font-size:10px;color:#334155}.detail-button{border:0;background:#f1f5f9;width:28px;height:28px;border-radius:9px;cursor:pointer;font-size:20px;color:#475569}.measuring{display:inline-flex;padding:5px 8px;border-radius:7px;background:#f1f5f9;color:#64748b;font-size:9px;font-weight:800}.actual-metrics{display:flex;gap:4px;flex-wrap:wrap}.actual-metric{display:flex;flex-direction:column;padding:4px 6px;border-radius:7px;background:#ecfdf5;color:#065f46;font-size:10px;font-weight:800}.actual-metric b{font-size:7.5px;color:#059669}.actual-metric.normalized{background:#eff6ff;color:#1d4ed8}.actual-metric.normalized b{color:#3b82f6}.empty-state{text-align:center;padding:34px 18px;margin-top:18px;border:1px dashed #cbd5e1;border-radius:14px;background:#f8fafc}.empty-state b{font-size:13px;color:#334155}.empty-state p{font-size:10.5px;color:#64748b;margin-top:5px}.empty-state.compact{padding:22px}
.actual-metric.unavailable{background:#f8fafc;color:#94a3b8}.actual-metric.unavailable b{color:#94a3b8}.metric-updated{flex-basis:100%;font-size:8.5px;color:#94a3b8;margin-top:2px}
.manual-sync ul{list-style:none;padding:0;margin:16px 0 0;display:grid;gap:8px}.manual-sync li{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:8px;padding:11px 12px;border-radius:11px;background:#f8fafc}.manual-copy{min-width:0;display:flex;flex-direction:column}.manual-copy>b{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#334155}.manual-copy small{font-size:9px;color:#94a3b8;margin-top:3px}.manual-copy details{margin-top:8px}.manual-copy summary{font-size:9px;color:#475569;cursor:pointer}.manual-copy details p{font-size:9.5px;white-space:normal;margin-top:5px}.manual-state{padding:5px 8px;border-radius:999px;font-size:8.5px;font-weight:800;white-space:nowrap}.manual-state.on{background:#dcfce7;color:#047857}.manual-state.wait{background:#fff7ed;color:#c2410c}.manual-state.off{background:#f1f5f9;color:#64748b}.empty-inline{margin-top:14px;padding:13px;border-radius:10px;background:#f8fafc;color:#64748b;font-size:10.5px}
.manual-sync li{grid-template-columns:minmax(0,1fr) auto auto auto}.manual-analyze{border:0;border-radius:9px;background:#2563eb;color:#fff;padding:9px 12px;font-weight:800;cursor:pointer}.manual-readonly{font-size:9px;color:#64748b}.schedule-section,.chapter-review{padding:22px;background:var(--c-panel);border:1px solid var(--c-line);box-shadow:var(--c-shadow)}.schedule-groups{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.schedule-groups article{display:grid;gap:6px;padding:18px;border:1px solid var(--c-line);border-radius:14px;background:var(--c-raised)}.schedule-groups span{font-size:11px;font-weight:800;color:var(--c-muted)}.schedule-groups strong{font-size:30px;color:var(--c-text)}.schedule-groups small{color:var(--c-muted);line-height:1.55}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:17px}.kpi-card{border:1px solid #e2e8f0;border-radius:13px;padding:14px;background:#fff;display:flex;flex-direction:column}.kpi-card span{font-size:9px;font-weight:800;color:#64748b}.kpi-card strong{font-size:22px;color:#0f172a;margin:4px 0}.kpi-card small{font-size:8.5px;color:#94a3b8}.performance-list{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:12px}.performance-list>article{border:1px solid #e2e8f0;border-radius:13px;padding:14px;min-width:0}.performance-list h3{font-size:11.5px;color:#0f172a;margin:7px 0 2px}.performance-list small{font-size:9px;color:#94a3b8}.performance-list .actual-metrics{margin-top:10px}.performance-list details{margin-top:10px;border-top:1px solid #f1f5f9;padding-top:8px}.performance-list summary{font-size:9px;font-weight:800;color:#475569;cursor:pointer}.performance-list details p{font-size:10px;line-height:1.7;color:#334155;white-space:pre-line;max-height:180px;overflow:auto;margin-top:7px}
.decision-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:18px}.decision-grid article{display:flex;gap:10px;padding:15px;border-radius:13px;background:#f8fafc}.decision-grid article>span{font-size:9px;font-weight:800;color:#7c3aed}.decision-grid b{font-size:11px;color:#0f172a}.decision-grid p{font-size:10.5px;line-height:1.65;color:#475569;margin-top:5px}.analysis-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:10px}.analysis-box{border-radius:12px;padding:13px;border:1px solid #e2e8f0;background:#fff}.analysis-box h3{font-size:10.5px;color:#0f172a;margin:0 0 7px}.analysis-box p{font-size:10px;line-height:1.6;color:#475569}.analysis-box.fact{border-top:3px solid #10b981}.analysis-box.hypothesis{border-top:3px solid #8b5cf6}.analysis-box.unknown{border-top:3px solid #f59e0b}.analysis-box.next-test{border-top:3px solid #3b82f6}
.report-cta{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:13px 15px;border:1px solid var(--c-line);border-radius:12px;background:color-mix(in srgb,var(--c-brand) 8%,var(--c-panel));color:var(--c-brand);font-size:11px;font-weight:800;text-decoration:none}.report-cta:hover{border-color:var(--c-brand);transform:translateY(-1px)}.report-cta span{font-size:18px}.drawer-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.28);z-index:50;backdrop-filter:blur(2px)}.post-drawer{position:fixed;right:0;top:0;bottom:0;width:min(500px,92vw);background:#fff;z-index:51;padding:32px;overflow-y:auto;transform:translateX(104%);transition:transform .24s ease;box-shadow:-20px 0 50px rgba(15,23,42,.16)}.post-drawer.open{transform:translateX(0)}.drawer-close{position:absolute;right:20px;top:18px;width:32px;height:32px;border:0;border-radius:50%;background:#f1f5f9;font-size:20px;cursor:pointer}.post-drawer>h2{font-size:22px;color:#0f172a;text-transform:none;margin:0 0 10px}.drawer-tags{display:flex;gap:7px;margin-bottom:14px}.drawer-tags span{padding:5px 8px;border-radius:7px;background:#f1f5f9;color:#475569;font-size:9px;font-weight:800}.drawer-block,.drawer-grid>div{background:#f8fafc;border-radius:12px;padding:14px}.drawer-block>span,.drawer-grid span{display:block;font-size:9px;font-weight:800;color:#94a3b8;margin-bottom:5px}.drawer-block p{white-space:pre-line;color:#334155;font-size:12px;line-height:1.8}.drawer-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.drawer-grid p{font-size:11px;color:#334155}
@media(max-width:1180px){.now-grid{grid-template-columns:1fr 1fr}.workflow-section{align-items:flex-start;flex-direction:column;gap:10px}.workflow-copy{width:auto}.journey{width:100%;overflow-x:auto;padding:4px}.pipeline-head{display:none}.pipeline-row{grid-template-columns:minmax(190px,1.3fr) minmax(100px,.7fr) minmax(100px,.6fr) minmax(130px,.8fr) minmax(180px,1fr) 34px;min-width:930px}.pipeline-list{overflow-x:auto}.performance-list{grid-template-columns:repeat(2,1fr)}.analysis-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){.customer-hero{align-items:flex-start;flex-direction:column}.hero-update{width:100%}.kpi-grid,.decision-grid{grid-template-columns:1fr 1fr}.manual-sync li{grid-template-columns:1fr}.manual-state{width:max-content}}
@media(max-width:640px){.customer-shell .app{display:block;padding:10px}.customer-shell .sidebar{position:static;width:100%;height:auto;padding:11px 13px;margin-bottom:8px;border-radius:15px;display:flex;flex-direction:row;align-items:center;justify-content:space-between}.customer-shell .sidebar-header{padding:0}.customer-shell .sidebar-header .brand{font-size:13px}.customer-shell .sidebar-header .brand-mark{width:34px;height:34px}.customer-shell .sidebar-header .brand-mark img{width:34px;height:34px}.customer-shell .sidebar-header .brand-sub,.customer-shell .sidebar-nav{display:none}.customer-shell .sidebar-footer{padding:0;margin:0}.customer-shell .sys-status-card{padding:7px 9px}.customer-shell .sys-status-label{display:none}.customer-shell .main{padding:12px 2px 24px}.hero-main h1{font-size:24px}.now-grid,.kpi-grid,.decision-grid,.performance-list,.analysis-grid{grid-template-columns:1fr}.workflow-section{padding:12px}.journey{align-items:flex-start}.journey i{min-width:14px;margin-top:11px}.journey-step{flex-direction:column;gap:3px}.journey-step b{font-size:8.5px}.pipeline-section,.performance-section,.report-section,.manual-sync{padding:17px}.pipeline-list{overflow:visible}.pipeline-row{position:relative;min-width:0;grid-template-columns:1fr;gap:8px;padding:15px 46px 15px 10px}.pipeline-row .detail-button{position:absolute;right:9px;top:14px}.pipeline-topic{padding-right:4px}.section-header{flex-direction:column}.post-drawer{padding:25px}.drawer-grid{grid-template-columns:1fr}}
@media(max-width:640px){.schedule-groups{grid-template-columns:1fr}.manual-sync li{grid-template-columns:1fr}.manual-analyze{width:100%}}
/* UX08: chapter hierarchy and explicit What / Now / Next context */
.chapter{--chapter-accent:var(--c-brand);position:relative;margin:0 0 34px;padding:30px;border:1px solid color-mix(in srgb,var(--chapter-accent) 18%,var(--c-line));border-radius:24px;background:linear-gradient(145deg,color-mix(in srgb,var(--chapter-accent) 7%,var(--c-panel)),var(--c-panel) 44%);box-shadow:0 18px 42px color-mix(in srgb,var(--chapter-accent) 8%,transparent)}
.chapter-review{--chapter-accent:#c2410c}.review-card{margin-top:18px;padding:22px;border:1px solid var(--c-line);border-radius:18px;background:var(--c-raised)}.review-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.review-meta span,.review-meta b{padding:5px 9px;border-radius:999px;background:var(--c-panel);font-size:11px;color:var(--c-muted)}.review-meta b{background:#fef3c7;color:#92400e}.review-body{margin:16px 0;white-space:pre-line;font-size:15px;line-height:1.8;color:var(--c-text)}.review-detail{display:grid;grid-template-columns:1fr 2fr;gap:12px;padding:14px;border-radius:12px;background:var(--c-panel)}.review-detail small{display:block;color:var(--c-muted);font-size:11px}.review-detail b,.review-detail li{font-size:12px;color:var(--c-text-2)}.review-detail ul{margin:5px 0 0;padding-left:18px}.review-actions{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap;margin-top:16px}.review-actions form{margin:0}.review-actions details{min-width:180px}.review-actions summary,.review-actions button{cursor:pointer;border:1px solid var(--c-line);border-radius:10px;padding:10px 15px;background:var(--c-panel);color:var(--c-text);font-weight:800}.review-actions details form{display:grid;gap:8px;margin-top:8px;padding:12px;border:1px solid var(--c-line);border-radius:12px}.review-actions label{display:grid;gap:6px;font-size:11px;color:var(--c-muted)}.review-actions textarea{min-height:80px;resize:vertical;border:1px solid var(--c-line);border-radius:9px;padding:9px;background:var(--c-raised);color:var(--c-text)}.review-actions .review-approve{background:#047857;color:#fff;border-color:#047857}.review-actions .review-reject{color:#b91c1c}.review-readonly,.review-notice{margin-top:14px;padding:11px;border-radius:10px;background:var(--c-panel);color:var(--c-muted);font-size:12px}.review-notice{background:#ecfdf5;color:#047857;font-weight:800}
.chapter:before{content:'';position:absolute;left:30px;right:30px;top:-18px;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--chapter-accent) 40%,var(--c-line)),transparent)}.chapter:first-of-type:before{display:none}
.chapter-today{--chapter-accent:#2563eb}.chapter-pipeline{--chapter-accent:#0f766e}.chapter-manual{--chapter-accent:#d97706}.chapter-performance{--chapter-accent:#059669}.chapter-visuals{--chapter-accent:#0891b2}.chapter-ai{--chapter-accent:#7c3aed}
.chapter .section-header{align-items:center}.chapter .section-header h2{font-size:27px;color:var(--c-text)}.chapter .section-lead{max-width:760px;font-size:15px;line-height:1.6;color:var(--c-muted)}.chapter .card-eyebrow{font-size:13px;color:var(--chapter-accent)}
.chapter-icon,.section-context-icon{display:grid;place-items:center;flex:none;color:var(--chapter-accent);background:color-mix(in srgb,var(--chapter-accent) 11%,var(--c-panel));border:1px solid color-mix(in srgb,var(--chapter-accent) 20%,var(--c-line))}.chapter-icon{width:54px;height:54px;border-radius:17px}.chapter-icon .ui-icon{width:27px;height:27px}
.section-context{display:grid;grid-template-columns:42px minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch;margin:20px 0 24px;padding:14px;border:1px solid color-mix(in srgb,var(--chapter-accent) 17%,var(--c-line));border-radius:16px;background:color-mix(in srgb,var(--c-panel) 82%,transparent)}.section-context-icon{width:42px;height:42px;align-self:center;border-radius:13px}.section-context>div{display:flex;flex-direction:column;justify-content:center;min-width:0;padding:3px 14px;border-left:1px solid var(--c-line-soft)}.section-context small{font-size:13px;font-weight:800;letter-spacing:.05em;color:var(--chapter-accent)}.section-context b{margin-top:4px;font-size:15px;line-height:1.5;color:var(--c-text-2)}
.chapter .now-grid{margin:0}.chapter .workflow-section{margin:0 0 22px;border:1px solid var(--c-line);background:var(--c-raised);box-shadow:none}.chapter-visuals{margin-top:-18px}.chapter .compact-heading{margin-bottom:22px}.chapter .now-card,.chapter .kpi-card,.chapter .performance-list>article,.chapter .chart-card,.chapter .decision-grid article,.chapter .analysis-box{background:var(--c-raised);border-color:var(--c-line)}
html[data-customer-theme="dark"] .chapter{box-shadow:0 18px 42px rgba(0,0,0,.2)}html[data-customer-theme="dark"] .chapter-today{--chapter-accent:#60a5fa}html[data-customer-theme="dark"] .chapter-pipeline{--chapter-accent:#2dd4bf}html[data-customer-theme="dark"] .chapter-manual{--chapter-accent:#fbbf24}html[data-customer-theme="dark"] .chapter-performance{--chapter-accent:#34d399}html[data-customer-theme="dark"] .chapter-visuals{--chapter-accent:#22d3ee}html[data-customer-theme="dark"] .chapter-ai{--chapter-accent:#a78bfa}
@media(max-width:700px){.chapter{margin-bottom:28px;padding:20px;border-radius:20px}.chapter:before{left:20px;right:20px}.chapter .section-header{flex-direction:row;align-items:flex-start}.chapter .section-header h2{font-size:25px}.chapter-icon{width:46px;height:46px;border-radius:14px}.section-context{grid-template-columns:38px 1fr;gap:10px}.section-context-icon{width:38px;height:38px}.section-context>div{padding:3px 9px}.section-context>div:last-child{grid-column:2}.section-context small{font-size:12px}.section-context b{font-size:14px}.chapter-visuals{margin-top:-12px}}
@media(max-width:700px){.review-detail{grid-template-columns:1fr}.review-actions{display:grid}.review-actions details{min-width:0}.review-actions button,.review-actions summary{width:100%;box-sizing:border-box}}
@media(max-width:700px){.getting-started-grid{grid-template-columns:1fr}}
${customerDashboardStyles}
</style>
<script>(()=>{${customerThemeScript}const posts=${safeContents};const drawer=document.getElementById('post-drawer'),backdrop=document.getElementById('drawer-backdrop'),closeButton=document.getElementById('drawer-close');function openPost(index){const p=posts[index];if(!p||!drawer||!backdrop)return;document.getElementById('drawer-title').textContent=p.topic;document.getElementById('drawer-status').textContent=p.status;document.getElementById('drawer-origin').textContent=p.origin;document.getElementById('drawer-body').textContent=p.body;document.getElementById('drawer-role').textContent=p.role;document.getElementById('drawer-schedule').textContent=p.schedule;document.getElementById('drawer-quality').textContent=p.quality;document.getElementById('drawer-approval').textContent=p.approval;document.getElementById('drawer-published').textContent=p.published;backdrop.hidden=false;drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');closeButton?.focus()}function closePost(){if(!drawer||!backdrop)return;drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');backdrop.hidden=true}document.querySelectorAll('.post-row').forEach(row=>{row.addEventListener('click',()=>openPost(Number(row.dataset.postIndex)));row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openPost(Number(row.dataset.postIndex))}})});closeButton?.addEventListener('click',closePost);backdrop?.addEventListener('click',closePost);document.addEventListener('keydown',event=>{if(event.key==='Escape')closePost()})})();</script>`;
}
