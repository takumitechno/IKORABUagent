import type { Database } from "bun:sqlite";
import { escapeHtml, timeAgo } from "../components/layout";
import {
  renderCustomerHomeStyles, customerThemeScript, dashboardIcon,
} from "../components/customer-dashboard-visuals";
import { button, card, emptyState, kpiTile, sectionHeader, statusBadge } from "../components/primitives";
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
       AND (r.session_id IS NULL OR r.session_id NOT LIKE 'demo-%')
       AND (r.work_dir IS NULL OR r.work_dir <> '/demo')
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
  return `<section id="schedule" class="home-section" aria-labelledby="schedule-title">${sectionHeader({ id: "schedule-title", eyebrow: "SCHEDULE", title: "投稿予定", description: "今日・明日・今週の公開予定です。予定がない場合は、推測で補いません。" })}<div class="schedule-groups">${groups.map((group) => `<article><span>${group.label}</span><strong>${group.items.length}</strong><small>${group.items.length ? group.items.map((item) => `${formatDate(item.scheduledAt, "時刻確認中")} ${escapeHtml(topicLabel(item.topic))}`).join(" / ") : "予定なし"}</small></article>`).join("")}</div></section>`;
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
    { label: "作成・審査", value: contents.filter((content) => contentStatus(content).stage <= 2).length, color: "var(--t-ink-muted)" },
    { label: "承認・予定", value: contents.filter((content) => [3, 4].includes(contentStatus(content).stage)).length, color: "var(--t-brand)" },
    { label: "投稿済み", value: contents.filter((content) => contentStatus(content).stage === 5).length, color: "var(--t-ink-2)" },
    { label: "分析中", value: contents.filter((content) => contentStatus(content).stage >= 6).length, color: "var(--t-line)" },
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
      ? `<form method="post" action="/api/customer/manual-posts/${encodeURIComponent(post.detectionId)}/analyze"><input type="hidden" name="account_id" value="${escapeHtml(accountId)}">${button({ label: notice === "failed" ? "分析に追加（再試行）" : "分析に追加", variant: "primary", type: "submit" })}</form>`
      : !post.analyzeEnabled ? `<span class="manual-readonly">編集者または管理者が追加できます</span>` : "";
    return `<li><div class="manual-copy"><b>${escapeHtml(firstLine.slice(0, 64))}</b><small>${escapeHtml(formatDate(post.publishedAt, "公開日時を確認中"))} · ${escapeHtml(structure)}</small>${parts}</div>${statusBadge({ status: analyzed ? "ok" : "warn", icon: analyzed ? "✓" : post.analyzeEnabled ? "◷" : "＋", label: state })}<span class="manual-state off">改善学習には使わない</span>${action}</li>`;
  }).join("");
  const analyzing = posts.filter((post) => post.analyzeEnabled).length;
  const noticeText = notice === "fetching" ? "分析データの取得を開始しました。" : notice === "analyzed"
    ? "この投稿は分析済みです。" : notice === "failed" ? "取得できませんでした。再試行してください。" : "";
  return `<section id="manual-analysis" class="home-section manual-sync" aria-labelledby="manual-analysis-title">${sectionHeader({ id: "manual-analysis-title", eyebrow: "MANUAL POST ANALYSIS", title: "公開済みの手動投稿", description: "Threadsで直接投稿した内容を、必要なものだけ分析に追加できます。1件だけでAIの書き方は変更しません。" })}<p class="home-muted">${posts.length}件を検出・${analyzing}件を取得中または分析済み。改善学習には使わない（learn=false）。</p>${noticeText ? `<p class="review-notice" role="status" aria-live="polite">${statusBadge({ status: notice === "failed" ? "serious" : "ok", icon: notice === "failed" ? "!" : "✓", label: noticeText })}</p>` : ""}${rows ? `<ul>${rows}</ul>` : emptyState({ title: "現在、検出済みの手動投稿はありません。", description: "公開済み投稿が見つかると、ここに表示します。" })}</section>`;
}

function renderCustomerReviews(
  reviews: CustomerReviewItem[], accountId: string, canReview: boolean, notice: string | null,
  manualFailed: boolean, connected: boolean,
): string {
  const noticeText = notice === "approve" ? "投稿案を承認しました。" : notice === "reject"
    ? "今回は見送る内容として記録しました。" : notice === "request-revision"
      ? "修正を受け付けました。新しい案ができるまでお待ちください。" : notice === "edit"
        ? "手動投稿案を編集しました。最新の本文を確認してください。" : "";
  const cards = reviews.map((item, reviewIndex) => {
    const binding = `<input type="hidden" name="account_id" value="${escapeHtml(accountId)}"><input type="hidden" name="version" value="${item.version}"><input type="hidden" name="binding" value="${escapeHtml(item.contentHash)}">`;
    const endpoint = `/api/customer/content/${encodeURIComponent(item.contentId)}`;
    const middleAction = item.origin === "human_manual"
      ? `<details><summary>編集する</summary><form method="post" action="${endpoint}/edit">${binding}<label>投稿本文<textarea name="body" maxlength="8000" required>${escapeHtml(item.body)}</textarea></label>${button({ label: "編集内容を保存", type: "submit" })}</form></details>`
      : `<details><summary>修正を依頼</summary><form method="post" action="${endpoint}/request-revision">${binding}<label>直してほしい点<textarea name="feedback" maxlength="8000" required placeholder="例：もう少し柔らかく、文章を短く"></textarea></label>${button({ label: "修正を依頼する", type: "submit" })}</form></details>`;
    const actions = canReview ? `<div class="review-actions t-action-bar" role="group" aria-label="投稿案の操作"><details class="review-reject"><summary>今回は見送る</summary><form method="post" action="${endpoint}/reject">${binding}<p>この投稿案を見送ります。理由を確認して確定してください。</p><label>見送る理由<textarea name="reason" maxlength="8000" required></textarea></label>${button({ label: "見送りを確定する", variant: "destructive", type: "submit", confirmation: `確認待ち${reviewIndex + 1}件目の第${item.version}案を見送ります。理由を確認してください。` })}</form></details>${middleAction}<form class="review-approve" method="post" action="${endpoint}/approve">${binding}${button({ label: "承認する", variant: "primary", type: "submit" })}</form></div>` : `<p class="review-readonly">閲覧のみできます。操作は編集者または管理者に依頼してください。</p>`;
    return `<article class="review-card"><div class="review-meta"><span>${escapeHtml(topicLabel(item.topic))}</span><span>${escapeHtml(roleLabel(item.contentRole))}</span><span>第${item.version}案</span>${statusBadge({ status: "warn", icon: "!", label: item.status })}</div><p class="review-body">${escapeHtml(item.body)}</p><details class="review-detail"><summary>作成日時・投稿予定・変更点</summary><div class="review-detail-grid"><div><small>作成日時</small><b>${escapeHtml(formatDate(item.createdAt, "作成日時を確認中"))}</b><small>投稿予定</small><b>${escapeHtml(formatDate(item.scheduledAt, "予定を調整中"))}</b></div><div><small>AIが変更したポイント</small><ul>${item.aiChanges.map((change) => `<li>${escapeHtml(change)}</li>`).join("") || "<li>品質確認済み</li>"}</ul></div></div></details>${actions}</article>`;
  }).join("");
  const needsAction = reviews.length > 0 || manualFailed || !connected;
  return `<section id="action-required" class="home-section action-required ${needsAction ? "is-expanded" : "is-compact"}" aria-labelledby="action-required-title">${sectionHeader({ id: "action-required-title", eyebrow: "ACTION REQUIRED", title: needsAction ? "確認が必要な操作" : "確認状況" })}${noticeText ? `<p class="review-notice" role="status" aria-live="polite">${statusBadge({ status: "ok", icon: "✓", label: noticeText })}</p>` : ""}${manualFailed ? `<p class="review-notice" role="status" aria-live="polite">${statusBadge({ status: "serious", icon: "!", label: "手動投稿の分析データを取得できませんでした。" })}<a href="#manual-analysis">手動投稿の分析を確認・再試行</a></p>` : ""}${!connected ? `<p role="status" aria-live="polite">${statusBadge({ status: "warn", icon: "!", label: "接続待ち：運用状況を確認できません。" })}</p>` : ""}${reviews.length ? `<p class="home-muted">確認待ち ${reviews.length}件 · AI案は修正を依頼でき、手動案は本文を直接編集できます。</p><p class="home-muted">投稿一覧はスクロールして確認できます。</p><div class="review-list" role="region" aria-label="確認待ちの投稿一覧" tabindex="0">${cards}</div>` : !needsAction ? `<p class="success-strip">${statusBadge({ status: "ok", icon: "✓", label: "現在、確認が必要な操作はありません" })}</p>` : ""}</section>`;
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
  const operationNow = !connected ? "連携の復旧を待っています" : pendingApproval > 0 ? `${pendingApproval}件の承認を待っています` : nextContent ? "次回投稿の準備を進めています" : measured.length ? "投稿結果を分析しています" : "新しい企画を準備しています";
  const pipelineRows = contents.map((content, index) => {
    const status = contentStatus(content);
    const firstLine = content.body.split(/\r?\n/).find(Boolean) ?? "本文を準備中";
    const labeledTopic = topicLabel(content.topic);
    const pipelineTopic = labeledTopic === "テーマ未設定" ? firstLine.slice(0, 42) : labeledTopic;
    const schedule = formatDate(content.scheduledAt ?? content.publication?.publishedAt ?? null, content.publication?.externalId ? "公開時刻を確認中" : "予定を調整中");
    return `<article class="post-card"><div class="post-card-heading"><h3>${escapeHtml(pipelineTopic)}</h3><span class="origin-chip">${escapeHtml(originLabels[content.origin])}</span>${statusBadge({ status: status.tone === "completed" ? "ok" : "warn", icon: status.tone === "completed" ? "✓" : "◷", label: status.label })}</div><p class="home-muted">${escapeHtml(roleLabel(content.contentRole))} · ${content.publication?.externalId ? "公開実績" : "投稿予定"} ${escapeHtml(schedule)} · ${escapeHtml(elapsedLabel(content.publication?.publishedAt ?? null))}</p>${renderMetrics(content)}<button class="post-row t-button t-button--secondary" type="button" data-post-index="${index}" aria-haspopup="dialog">詳細を見る<span class="home-sr-only">：${escapeHtml(pipelineTopic)}</span></button></article>`;
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
  const nextPostLabel = nextContent ? `${formatDate(nextContent.scheduledAt, "予定を調整中")} · ${topicLabel(nextContent.topic)}` : connected ? "投稿予定を調整中" : "接続復旧後に表示";
  const metricNext = latestMetricAt ? "次回Insights更新を待っています" : connected ? "最初のKPI取得待ち" : "接続復旧後に計測開始";

  return `
${renderCustomerHomeStyles()}
<div id="overview" class="customer-dashboard customer-home">
  <h1 class="home-sr-only">${escapeHtml(accountName)}のSNS運用</h1>
  ${renderCustomerReviews(reviewOptions?.reviews ?? [], reviewOptions?.accountId ?? "", reviewOptions?.canReview === true, reviewOptions?.notice ?? null, reviewOptions?.manualAnalysisNotice === "failed", connected)}
  <section id="today" class="home-section" aria-labelledby="today-title">
    <div class="today-context"><div><p class="home-account-name">${escapeHtml(accountName)}のSNS運用</p><p>${handle ? `<span>${escapeHtml(handle)}</span> · ` : ""}${statusBadge({ status: connected && data?.accountStatus === "active" ? "ok" : "warn", icon: connected && data?.accountStatus === "active" ? "✓" : "!", label: connected ? accountStatusLabel(data?.accountStatus ?? null) : "接続待ち" })}</p></div><button class="theme-toggle t-button t-button--secondary" id="theme-toggle" type="button" aria-label="表示テーマを切り替える">${dashboardIcon("sun")}<span id="theme-label">ダーク</span></button></div>
    ${sectionHeader({ id: "today-title", eyebrow: "TODAY", title: "今日の運用" })}
    <div class="home-today-grid">
      ${kpiTile({ label: "今日の投稿予定", value: connected ? todayScheduled : "—", detail: nextContent ? formatDate(nextContent.scheduledAt, "予定を調整中") : "予定なし" })}
      ${kpiTile({ label: "今日の公開済み", value: connected ? todayPublished : "—", detail: "公開を確認できた投稿" })}
      <div class="today-next">${kpiTile({ label: "次の動作", value: operationNow, detail: nextPostLabel })}</div>
      <div class="today-sync">${kpiTile({ label: "最終同期", value: updatedAt, detail: connected ? "最新の運用データを表示" : "実データは表示していません" })}</div>
    </div>
    ${connected && contents.length === 0 ? `<details class="getting-started"><summary>まず、ここから始めましょう</summary><div class="getting-started-grid">${card({ title: "Threadsで5〜10件投稿", body: "いつもの言葉で、まずは手動投稿をためます。" })}${card({ title: "投稿の取り込みを依頼", body: "運用担当者が投稿を分析対象として安全に取り込みます。" })}${card({ title: "届いたAI案を確認", body: "確認待ちに表示された案を、承認・修正依頼・見送りから選びます。" })}</div><p>紹介リンクは後から登録できます。未登録の間は、販売を促す投稿案を作りません。</p></details>` : ""}
  </section>
  ${connected ? scheduleSection(contents) : `<section id="schedule" class="home-section" aria-labelledby="schedule-title">${sectionHeader({ id: "schedule-title", eyebrow: "SCHEDULE", title: "投稿予定" })}${emptyState({ title: "接続待ち", description: "接続が復旧するまで、投稿予定を推測で補いません。" })}</section>`}
  <section id="performance" class="home-section" aria-labelledby="performance-title">
    <span id="morning-report" class="home-anchor"></span>
    ${sectionHeader({ id: "performance-title", eyebrow: "POSTS & PERFORMANCE", title: "投稿と実績", description: "取得済みの実値だけを表示します。推定値やデモ値は表示しません。" })}
    <div class="home-kpi-grid">${metrics.map(([key, label]) => {
      const value = totalMetric(contents, key);
      return `<div class="home-kpi-item">${kpiTile({ label, value: typeof value === "number" ? value.toLocaleString("ja-JP") : hasMetricObservation ? "取得不可" : "計測中", detail: typeof value === "number" ? "取得済み投稿の合計" : hasMetricObservation ? "APIから値が返っていません" : "実値の取得待ち" })}<div class="kpi-visual">${renderSparkline(contents, key)}</div></div>`;
    }).join("")}</div>
    <p class="home-muted">最終取得 ${escapeHtml(formatDate(latestMetricAt, "未取得"))} · ${escapeHtml(metricNext)}</p>
    <div class="home-chart-grid"><article class="chart-card"><h3>投稿ごとの表示数</h3>${renderViewsChart(contents)}</article><article class="chart-card"><h3>投稿状態の内訳</h3>${renderStatusDonut(contents)}</article></div>
    <div id="pipeline" class="home-posts"><h3>投稿状況</h3>${connected && pipelineRows ? `<div class="post-list">${pipelineRows}</div>` : emptyState({ title: connected ? "運用中の投稿はありません" : "運用データに接続していません", description: connected ? "新しい企画が始まると、ここに進行状況が表示されます。" : "接続が復旧するまで、投稿内容や数値を仮のデータで補いません。" })}</div>
  </section>
  <section id="ai-improvement" class="home-section" aria-labelledby="ai-improvement-title">${sectionHeader({ id: "ai-improvement-title", eyebrow: "AI IMPROVEMENT", title: "AI改善", description: "何を確認し、次に何を1つ変えるか。" })}<div class="decision-grid"><article><span>${dashboardIcon("experiment")}</span><b>今回確認していること</b><p>${connected && measured.length ? `${escapeHtml(measured.slice(0, 3).map((content) => topicOrRoleLabel(content.topic, content.contentRole)).join("、"))}の実測結果を観測しています。` : "運用データの接続後に表示します。"}</p></article><article><span>${dashboardIcon("hypothesis")}</span><b>結果から見えたこと</b><p>${connected ? escapeHtml(currentHypothesis(contents)) : "接続待ちのため、結果の仮説は表示していません。"}</p></article><article id="operations"><span>${dashboardIcon("next")}</span><b>次回テスト</b><p>${data?.editorial.customerSummary ? "登録済みの改善方針と変更する要素を、詳細レポートで確認できます。" : "変更内容はまだ登録されていません。比較可能な実績が揃った後、1要素に絞ります。"}</p></article></div><details class="evidence-details"><summary>事実・仮説・判断できないこと</summary><div class="analysis-grid"><article class="analysis-box fact"><span class="analysis-icon">${dashboardIcon("fact")}</span><h3>確認できた事実</h3><p>${connected ? `保存 ${contents.length}件・公開 ${published.length}件・KPI取得 ${measured.length}件。` : "実データに接続していません。"}</p></article><article class="analysis-box hypothesis"><span class="analysis-icon">${dashboardIcon("hypothesis")}</span><h3>現時点の仮説</h3><p>${connected ? escapeHtml(currentHypothesis(contents)) : "判断材料を取得できていません。"}</p></article><article class="analysis-box unknown"><span class="analysis-icon">${dashboardIcon("unknown")}</span><h3>まだ判断できないこと</h3><p>${measured.length < 2 ? "投稿間の優劣・勝ちパターン・最適解。" : "本文要素と反応の因果関係、長期的な再現性。"}</p></article><article class="analysis-box next-test"><span class="analysis-icon">${dashboardIcon("next")}</span><h3>検証の原則</h3><p>一度に変える要素は1つ。実値と経過時間をセットで比較します。</p></article></div></details><a class="report-cta" href="/improvement">AI改善レポートを詳しく見る <span>→</span></a></section>
  ${connected ? renderManualPostSync(data?.manualPosts ?? [], reviewOptions?.accountId ?? "", reviewOptions?.canReview === true, reviewOptions?.manualAnalysisNotice ?? null) : `<section id="manual-analysis" class="home-section" aria-labelledby="manual-analysis-title">${sectionHeader({ id: "manual-analysis-title", eyebrow: "MANUAL POST ANALYSIS", title: "公開済みの手動投稿" })}${reviewOptions?.manualAnalysisNotice === "failed" ? `<p class="review-notice" role="status" aria-live="polite">${statusBadge({ status: "serious", icon: "!", label: "取得できませんでした。再試行してください。" })}</p>` : ""}${emptyState({ title: "接続待ち", description: "手動投稿の検出状況は接続復旧後に確認できます。改善学習には使わない（learn=false）。" })}</section>`}
</div>
<div class="home-backdrop" id="drawer-backdrop" hidden></div>
<aside class="home-drawer" id="post-drawer" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="drawer-title" inert>
  <button class="drawer-close t-button t-button--secondary" id="drawer-close" type="button" aria-label="閉じる">×</button>
  <p class="home-muted">POST DETAIL</p><h2 id="drawer-title"></h2>
  <div class="drawer-tags"><span id="drawer-status"></span><span id="drawer-origin"></span></div>
  <div class="drawer-block"><h3>投稿本文</h3><p id="drawer-body"></p></div>
  <div class="drawer-grid"><div><h3>投稿の役割</h3><p id="drawer-role"></p></div><div><h3>投稿予定・実績</h3><p id="drawer-schedule"></p></div><div><h3>内容確認</h3><p id="drawer-quality"></p></div><div><h3>承認状況</h3><p id="drawer-approval"></p></div><div><h3>公開状況</h3><p id="drawer-published"></p></div></div>
</aside>
<script>(()=>{${customerThemeScript}
const posts=${safeContents};
const drawer=document.getElementById("post-drawer"),backdrop=document.getElementById("drawer-backdrop"),closeButton=document.getElementById("drawer-close");
let opener=null;
function openPost(index,trigger){
  const p=posts[index];if(!p||!drawer||!backdrop)return;
  opener=trigger;
  for(const [id,key] of Object.entries({"drawer-title":"topic","drawer-status":"status","drawer-origin":"origin","drawer-body":"body","drawer-role":"role","drawer-schedule":"schedule","drawer-quality":"quality","drawer-approval":"approval","drawer-published":"published"})) document.getElementById(id).textContent=p[key];
  backdrop.hidden=false;drawer.inert=false;drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");closeButton?.focus();
}
function closePost(){
  if(!drawer||!backdrop)return;
  drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");drawer.inert=true;backdrop.hidden=true;opener?.focus();
}
document.querySelectorAll(".post-row").forEach(row=>row.addEventListener("click",()=>openPost(Number(row.dataset.postIndex),row)));
closeButton?.addEventListener("click",closePost);backdrop?.addEventListener("click",closePost);
document.addEventListener("keydown",event=>{
  if(!drawer?.classList.contains("open"))return;
  if(event.key==="Escape")closePost();
  if(event.key==="Tab"){event.preventDefault();closeButton?.focus()}
});
document.addEventListener("focusin",event=>{if(drawer?.classList.contains("open")&&!drawer.contains(event.target))closeButton?.focus()});
})();</script>`;
}
