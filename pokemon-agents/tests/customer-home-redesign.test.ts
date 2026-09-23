import { describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";
import { renderOverview } from "../web/routes/overview";
import { customerHomeStyles } from "../web/components/customer-dashboard-visuals";
import { designTokens } from "../web/components/design-tokens";
import { sectionHeader } from "../web/components/primitives";
import type { ThreadsDashboardData, ThreadsContent, CustomerReviewItem, ManualPostStatus } from "../web/lib/threads-dashboard";

const base = {
  connected: true, accountId: "acct_test", displayName: "検証アカウント", handle: "test",
  accountStatus: "active", fetchedAt: "2026-09-23T01:00:00Z", contents: [], manualPosts: [],
  editorial: { customerSummary: null, currentAgent: "secret-agent", facts: ["meeting-secret"] },
} as unknown as ThreadsDashboardData;
const draft: CustomerReviewItem = {
  contentId: "review/one", version: 7, contentHash: "a".repeat(64), topic: "テーマ",
  contentRole: "trust", body: "確認する本文", origin: "ai_auto", status: "確認待ち",
  createdAt: "2026-09-23T01:00:00Z", scheduledAt: null, aiChanges: ["短くしました"],
};
const content: ThreadsContent = {
  contentId: "content-one", topic: "unclassified", contentRole: "trust", body: "本文プレビュー\n本文の続き",
  state: "metrics_collected", qaVerdict: "pass", approved: true, copyGuard: "pass",
  createdAt: null, updatedAt: null, scheduledAt: null,
  publication: { mode: "live", status: "succeeded", externalId: "external-one", publishedAt: "2026-09-23T01:00:00Z" },
  metrics: { views: 101, likes: 12, replies: 3, reposts: 4, quotes: 5, shares: 6 },
  metricsObservedAt: "2026-09-23T02:00:00Z", metricsFetchedAt: "2026-09-23T02:00:00Z",
  viewsPerHour: 50, engagementPerHour: 2, origin: "human_manual", analyzeEnabled: true,
  learnEnabled: false, partCount: 1,
};
const manual = {
  detectionId: "detect/one", externalId: "manual-external", body: "手動投稿", publishedAt: null,
  origin: "human_manual", analyzeEnabled: false, learnEnabled: false, topic: null, contentRole: null,
  hypothesis: null, trackingState: "tracked", logicalThreadId: "internal-thread", rootExternalId: "manual-external",
  replyToExternalId: null, partIndex: 0, partCount: 1, parts: [], threadMetrics: {},
} as ManualPostStatus;
function render(data: Partial<ThreadsDashboardData> = {}, options: Partial<NonNullable<Parameters<typeof renderOverview>[2]>> = {}) {
  return renderOverview({} as Database, { ...base, ...data }, { reviews: [], canReview: true, accountId: "acct_test", ...options });
}
function forms(html: string) { return [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)].map((m) => m[0]); }
function section(html: string, id: string, next?: string) {
  const start = html.indexOf('<section id="' + id + '"');
  return html.slice(start, next ? html.indexOf('<section id="' + next + '"', start) : html.indexOf('<div class="home-backdrop"', start));
}
describe("PRODUCT-UI-REDESIGN01 customer home", () => {
  test("always renders the six chapters in the prescribed DOM order with labelled headings", () => {
    const ids = ["action-required", "today", "schedule", "performance", "ai-improvement", "manual-analysis"];
    for (const connected of [true, false]) {
      const html = render({ connected });
      const actual = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
      expect(actual).toEqual(ids);
      for (const id of ids) {
        expect(html.includes('aria-labelledby="' + id + '-title"')).toBe(true);
        expect(html.includes('<h2 id="' + id + '-title"')).toBe(true);
      }
      expect(html.indexOf("<h1")).toBeLessThan(html.indexOf('<section id="action-required"'));
    }
  });
  test("expands real reviews, keeps the clear state compact and does not fake success while disconnected", () => {
    const active = section(render({}, { reviews: [draft] }), "action-required", "today");
    expect(active.includes("is-expanded")).toBe(true);
    expect(active.includes('class="review-card"')).toBe(true);
    const clear = section(render(), "action-required", "today");
    expect(clear.includes("is-compact")).toBe(true);
    expect(clear.includes("現在、確認が必要な操作はありません")).toBe(true);
    expect(clear.includes("t-empty")).toBe(false);
    expect(render({ connected: false }).includes("現在、確認が必要な操作はありません")).toBe(false);
  });
  test("keeps AI and human-manual contracts and exact bindings with approval last", () => {
    for (const origin of ["ai_auto", "human_manual"] as const) {
      const html = render({}, { reviews: [{ ...draft, origin }] });
      const actionForms = forms(section(html, "action-required", "today"));
      const middle = origin === "human_manual" ? "edit" : "request-revision";
      expect(actionForms).toHaveLength(3);
      expect(actionForms.map((form) => form.match(/action="([^"]+)"/)![1])).toEqual([
        "/api/customer/content/review%2Fone/reject",
        "/api/customer/content/review%2Fone/" + middle,
        "/api/customer/content/review%2Fone/approve",
      ]);
      for (const form of actionForms) {
        expect(form.includes('method="post"')).toBe(true);
        expect(form.includes('name="account_id" value="acct_test"')).toBe(true);
        expect(form.includes('name="version" value="7"')).toBe(true);
        expect(form.includes('name="binding" value="' + draft.contentHash + '"')).toBe(true);
        expect(form.includes('name="actor"')).toBe(false);
      }
      expect(actionForms[0].includes('name="reason" maxlength="8000" required')).toBe(true);
      expect(actionForms[0].includes('data-requires-confirmation="true"')).toBe(true);
      expect(html.includes('<details class="review-reject"><summary>今回は見送る</summary>')).toBe(true);
      expect(actionForms[1].includes(origin === "human_manual" ? 'name="body"' : 'name="feedback"')).toBe(true);
      expect(html.includes(origin === "human_manual" ? "/request-revision" : "/edit")).toBe(false);
    }
  });
  test("viewer has no review or analysis mutation form", () => {
    const html = render({ manualPosts: [manual] }, { reviews: [draft, { ...draft, origin: "human_manual" }], canReview: false });
    expect(forms(html)).toHaveLength(0);
    expect(html.includes("閲覧のみできます")).toBe(true);
    expect(html.includes("編集者または管理者が追加できます")).toBe(true);
  });
  test("announces every successful review notice politely", () => {
    for (const notice of ["approve", "reject", "request-revision", "edit"]) {
      const html = section(render({}, { notice }), "action-required", "today");
      expect(html.includes('class="review-notice" role="status" aria-live="polite"')).toBe(true);
    }
  });
  test("manual failure is global, linked from top, and retries only the existing eligible post", () => {
    const html = render({ manualPosts: [
      manual,
      { ...manual, detectionId: "fetching", analyzeEnabled: true },
      { ...manual, detectionId: "done", analyzeEnabled: true, threadMetrics: { views: 0 } },
    ] }, { manualAnalysisNotice: "failed" });
    const top = section(html, "action-required", "today");
    expect(top.includes('href="#manual-analysis"')).toBe(true);
    expect(top.includes("is-expanded")).toBe(true);
    const bottom = section(html, "manual-analysis");
    for (const text of ["未追加", "取得中", "分析済み", "取得できませんでした。再試行してください。", "learn=false", "1件だけでAIの書き方は変更しません。"]) expect(bottom.includes(text)).toBe(true);
    const analysisForms = forms(bottom);
    expect(analysisForms).toHaveLength(1);
    expect(analysisForms[0].includes('method="post" action="/api/customer/manual-posts/detect%2Fone/analyze"')).toBe(true);
    expect(analysisForms[0].includes('name="account_id" value="acct_test"')).toBe(true);
    expect(analysisForms[0].includes("分析に追加（再試行）")).toBe(true);
    expect(section(render(), "action-required", "today").includes('href="#manual-analysis"')).toBe(false);
    expect(section(render({ connected: false }, { manualAnalysisNotice: "failed" }), "manual-analysis").includes("取得できませんでした。再試行してください。")).toBe(true);
  });
  test("today uses real dates and four tiles; schedule retains actual today/tomorrow/week groups", () => {
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const later = new Date(Date.now() + 3 * 86400000).toISOString();
    const html = render({ contents: [
      { ...content, publication: { ...content.publication!, publishedAt: now } },
      ...[now, tomorrow, later].map((scheduledAt) => ({ ...content, scheduledAt, publication: null })),
    ] });
    const today = section(html, "today", "schedule");
    expect((today.match(/class="t-kpi"/g) ?? []).length).toBe(4);
    for (const text of ["今日の投稿予定", "今日の公開済み", "次の動作", "最終同期"]) expect(today.includes(text)).toBe(true);
    expect((today.match(/class="t-kpi__value">1</g) ?? []).length).toBe(2);
    const schedule = section(html, "schedule", "performance");
    for (const text of ["今日", "明日", "今週"]) expect(schedule.includes(text)).toBe(true);
    expect((section(render(), "schedule", "performance").match(/予定なし/g) ?? []).length).toBe(3);
  });
  test("combines exact six KPI totals, supporting visuals and post cards in order", () => {
    const html = render({ contents: [content] });
    const performance = section(html, "performance", "ai-improvement");
    for (const value of [101, 12, 3, 4, 5, 6]) expect(performance.includes('class="t-kpi__value">' + value + "</div>")).toBe(true);
    expect((performance.match(/class="t-kpi"/g) ?? []).length).toBe(6);
    for (const label of ["表示", "いいね", "返信", "再投稿", "引用", "シェア"]) expect(performance.includes('class="t-kpi__label">' + label)).toBe(true);
    expect(performance.indexOf('class="home-kpi-grid"')).toBeLessThan(performance.indexOf('class="home-chart-grid"'));
    expect(performance.indexOf('class="home-chart-grid"')).toBeLessThan(performance.indexOf('class="post-list"'));
    expect(performance.includes("本文プレビュー")).toBe(true);
    expect(performance.includes("unclassified")).toBe(false);
    for (const forbidden of ["pipeline-head", "journey", "workflow-section", "VISUAL INSIGHTS", "chapter-visuals"]) expect(html.includes(forbidden)).toBe(false);
  });
  test("keeps drawer index and safe payload correspondence without nested button roles", () => {
    const html = render({ contents: [content, { ...content, topic: "二番目", body: "二番目本文" }] });
    expect([...html.matchAll(/data-post-index="(\d+)"/g)].map((m) => m[1])).toEqual(["0", "1"]);
    const payload = JSON.parse(html.match(/const posts=(\[.*\]);/s)![1].split(";\nconst drawer")[0]);
    expect(payload.map((p: { body: string }) => p.body)).toEqual([content.body, "二番目本文"]);
    expect(html.includes('role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="drawer-title" inert')).toBe(true);
    expect(html.includes('<article class="post-card" role="button"')).toBe(false);
  });
  test("preserves small-N uncertainty, all summary roles and no internal ledger fields", () => {
    const html = render({ contents: [content] });
    for (const text of ["今回確認していること", "結果から見えたこと", "次回テスト", "確認できた事実", "現時点の仮説", "まだ判断できないこと", "一度に変える要素は1つ", 'href="/improvement"']) {
      expect(html.includes(text)).toBe(true);
    }
    expect(html.includes("反応の違いは仮説として保留")).toBe(true);
    for (const text of ["secret-agent", "meeting-secret", "internal-thread", "human_approval_pending"]) expect(html.includes(text)).toBe(false);
  });
  test("escapes text, form attributes, textarea content and drawer JSON", () => {
    const attack = '</script><img src=x onerror="alert(1)">';
    const html = render({ displayName: attack, handle: attack, contents: [{ ...content, body: attack, topic: attack }], manualPosts: [{ ...manual, body: attack }] },
      { accountId: attack, reviews: [{ ...draft, origin: "human_manual", body: attack, topic: attack, contentHash: attack, aiChanges: [attack] }] });
    expect(html.includes(attack)).toBe(false);
    expect(html.includes("&lt;img")).toBe(true);
    expect(html.includes("\\u003c/script>")).toBe(true);
    expect(sectionHeader({ title: "x", id: attack }).includes(attack)).toBe(false);
  });
  test("contains no new page style literals or legacy tokens; uses accessible responsive tokens", () => {
    const source = readFileSync(new URL("../web/routes/overview.ts", import.meta.url), "utf8");
    expect(/#[0-9a-f]{3,8}\b/i.test(source)).toBe(false);
    expect(/<style\b|--c-|--ios-|--brand\b/.test(source)).toBe(false);
    expect(/#[0-9a-f]{3,8}\b/i.test(customerHomeStyles)).toBe(false);
    expect(customerHomeStyles.includes(".home-today-grid,.customer-home .home-kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))")).toBe(true);
    expect(customerHomeStyles.includes("font-size:30px;font-variant-numeric:tabular-nums")).toBe(true);
    expect(customerHomeStyles.includes("min-height:44px;min-width:44px")).toBe(true);
    expect(customerHomeStyles.includes("width:min(500px,100%);max-height:100dvh")).toBe(true);
    expect(customerHomeStyles.includes(":focus-visible")).toBe(true);
    expect(customerHomeStyles.includes("prefers-reduced-motion")).toBe(true);
    expect(customerHomeStyles.includes("var(--t-surface)")).toBe(true);
    expect(designTokens.includes('html[data-customer-theme="light"]')).toBe(true);
    for (const match of customerHomeStyles.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)) expect(Number(match[1])).toBeGreaterThanOrEqual(12);
  });
});
