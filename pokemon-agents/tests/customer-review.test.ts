import { describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import {
  addManualPostToAnalysis, loadCustomerPendingReviews, mutateCustomerReview,
  type ThreadsContent, type ThreadsDashboardData,
} from "../web/lib/threads-dashboard";
import { renderOverview } from "../web/routes/overview";


const pendingPayload = {
  status: "success",
  account_id: "acct_A",
  items: [{
    content_id: "cv_review_1",
    version: 2,
    content_hash: "a".repeat(64),
    topic: "やさしい伝え方",
    content_role: "trust",
    body: "確認してほしい投稿本文です。",
    created_at: "2026-09-22T01:00:00Z",
    scheduled_at: null,
    status: "確認待ち",
    ai_changes: ["文章を短く整えました"],
    origin: "ai_auto",
  }],
  meta: { schema_version: 1 },
};

const dashboard = {
  connected: true,
  bridgeStatus: "OK",
  accountId: "acct_A",
  handle: "account_a",
  displayName: "Account A",
  accountStatus: "active",
  fetchedAt: "2026-09-22T01:00:00Z",
  contents: [], manualPosts: [], metricsRecordCount: 0, hasLearningSnapshot: false,
  operations: { nightBatchItems: [], publicationsLastHour: 0, publicationsLast24h: 0, manualPostSyncAvailable: false, selfReplySync: "unknown" },
  safety: { available: true, globalStop: false, accountStop: false, capabilityStop: false, approvalMode: "manual", unresolvedAmbiguous: false, rateGuardReady: true, minIntervalSeconds: 0, hourlyLimit: 1, dailyLimit: 1 },
  editorial: { state: null, status: null, currentAgent: null, waitingReason: null, facts: [], unknowns: [], proposals: [], critiques: [], rejectedOptions: [], finalDecision: null, brief: null, experiments: [], customerSummary: null },
  message: "実アカウント連携済み",
} as ThreadsDashboardData;

function customerContent(overrides: Partial<ThreadsContent>): ThreadsContent {
  return {
    contentId: "content-default", topic: null, contentRole: null, body: "投稿本文",
    state: "metrics_collected", qaVerdict: "pass", approved: true, copyGuard: "pass",
    createdAt: "2026-09-22T01:00:00Z", updatedAt: "2026-09-22T01:00:00Z",
    scheduledAt: null,
    publication: { mode: "live", status: "succeeded", externalId: "external-default", publishedAt: "2026-09-22T02:00:00Z" },
    metrics: { views: 10 }, metricsObservedAt: "2026-09-22T03:00:00Z",
    metricsFetchedAt: "2026-09-22T03:00:00Z", viewsPerHour: 5,
    engagementPerHour: 1, origin: "human_manual", analyzeEnabled: true,
    learnEnabled: false, partCount: 1,
    ...overrides,
  };
}


describe("customer content review experience", () => {
  test("keeps internal topic sentinels out of every customer-facing topic fallback", () => {
    const contents = [
      customerContent({
        contentId: "content-a", topic: "unclassified", contentRole: "trust",
        body: "未分類本文プレビューA\n続き", publication: { mode: "live", status: "succeeded", externalId: "external-a", publishedAt: "2026-09-22T02:00:00Z" },
      }),
      customerContent({
        contentId: "content-b", topic: "未指定", contentRole: "reach",
        body: "未分類本文プレビューB", publication: { mode: "live", status: "succeeded", externalId: "external-b", publishedAt: "2026-09-22T02:01:00Z" },
      }),
      customerContent({
        contentId: "content-null", topic: null, contentRole: "desire",
        body: "未分類本文プレビューC", publication: { mode: "live", status: "succeeded", externalId: "external-c", publishedAt: "2026-09-22T02:02:00Z" },
      }),
      customerContent({
        contentId: "content-empty", topic: "", contentRole: "conversion",
        body: "未分類本文プレビューD", publication: { mode: "live", status: "succeeded", externalId: "external-d", publishedAt: "2026-09-22T02:03:00Z" },
      }),
      customerContent({
        contentId: "content-normal", topic: "恋愛の悩み", contentRole: "trust",
        body: "通常テーマ本文", publication: { mode: "live", status: "succeeded", externalId: "external-e", publishedAt: "2026-09-22T02:04:00Z" },
      }),
    ];
    const review = {
      contentId: "review-a", version: 1, contentHash: "c".repeat(64),
      topic: "unclassified", contentRole: "trust", body: "確認待ち本文",
      createdAt: "2026-09-22T01:00:00Z", scheduledAt: null, status: "確認待ち",
      aiChanges: [], origin: "ai_auto" as const,
    };
    const html = renderOverview({} as Database, { ...dashboard, contents }, {
      reviews: [review], canReview: true, accountId: "acct_A",
    });

    expect(html).not.toContain("unclassified");
    expect(html).not.toContain("未指定");
    expect(html).toContain("テーマ未設定");
    expect(html).toContain("恋愛の悩み");
    for (const preview of [
      "未分類本文プレビューA", "未分類本文プレビューB",
      "未分類本文プレビューC", "未分類本文プレビューD",
    ]) expect(html).toContain(preview);
    expect(html).toContain("信頼を育てる、認知を広げる、興味を高めるの実測結果を観測しています。");
  });

  test("shows a concrete first action for a new empty customer account", () => {
    const html = renderOverview({} as Database, dashboard, {
      reviews: [], canReview: true, accountId: "acct_A",
    });

    expect(html).toContain("まず、ここから始めましょう");
    expect(html).toContain("Threadsで5〜10件投稿");
    expect(html).toContain("投稿の取り込みを依頼");
    expect(html).toContain("届いたAI案を確認");
    expect(html).toContain("紹介リンクは後から登録できます");
    expect(html).toContain("販売を促す投稿案を作りません");
    for (const forbidden of [
      "content_id", "workflow state", "meeting ledger", "tenant internals",
      "agent name", "OAuth", "hash",
    ]) expect(html).not.toContain(forbidden);
  });

  test("loads only the selected tenant account with canonical server identity", async () => {
    const requests: Request[] = [];
    const reviews = await loadCustomerPendingReviews({
      accountId: "acct_A", tenantUserId: "user_A", apiKey: "server-key",
      bridgeUrl: "http://127.0.0.1:8765",
      fetcher: (async (input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(new Request(input, init));
        return Response.json(pendingPayload);
      }) as typeof fetch,
    });
    expect(reviews).toHaveLength(1);
    expect(reviews[0].body).toBe("確認してほしい投稿本文です。");
    expect(requests[0].url).toEndWith("/api/customer/content/pending?account_id=acct_A");
    expect(requests[0].headers.get("x-threads-user-id")).toBe("user_A");
    expect(requests[0].url).not.toContain("user_A");
  });

  test("posts exact binding and feedback without a browser supplied actor", async () => {
    const requests: Request[] = [];
    await mutateCustomerReview({
      action: "request-revision", accountId: "acct_A", contentId: "cv_review_1",
      version: 2, contentHash: "a".repeat(64), tenantUserId: "user_A",
      feedback: "もう少し柔らかく",
      fetcher: (async (input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(new Request(input, init));
        return Response.json({ status: "human_approval_pending" });
      }) as typeof fetch,
    });
    const body = await requests[0].json() as Record<string, unknown>;
    expect(body.expected_version).toBe(2);
    expect(body.expected_content_hash).toBe("a".repeat(64));
    expect(body.feedback).toBe("もう少し柔らかく");
    expect(body.actor).toBeUndefined();
    expect(requests[0].headers.get("x-threads-user-id")).toBe("user_A");
  });

  test("renders What/Now/Next review cards and editor actions without visible internals", () => {
    const reviews = [{
      contentId: "cv_review_1", version: 2, contentHash: "a".repeat(64),
      topic: "やさしい伝え方", contentRole: "trust", body: "確認してほしい投稿本文です。",
      createdAt: "2026-09-22T01:00:00Z", scheduledAt: null, status: "確認待ち",
      aiChanges: ["文章を短く整えました"], origin: "ai_auto" as const,
    }];
    const html = renderOverview({} as Database, dashboard, {
      reviews, canReview: true, accountId: "acct_A",
    });
    expect(html).toContain("確認が必要な操作");
    expect(html).toContain("確認待ち 1件");
    expect(html).toContain("AI案は修正を依頼でき、手動案は本文を直接編集できます。");
    expect(html).toContain("承認する");
    expect(html).toContain("修正を依頼");
    expect(html).toContain("今回は見送る");
    expect(html).toContain("文章を短く整えました");
    expect(html).not.toContain("content_id");
    expect(html).not.toContain("human_approval_pending");
    expect(html).not.toContain("Agent");
    expect(html).toContain("@media(max-width:700px)");
    expect(html).toContain('html[data-customer-theme="dark"]');
  });

  test("renders viewer access as read-only", () => {
    const review = {
      contentId: "cv_review_1", version: 2, contentHash: "a".repeat(64),
      topic: "topic", contentRole: "trust", body: "body",
      createdAt: "2026-09-22T01:00:00Z", scheduledAt: null,
      status: "確認待ち", aiChanges: [], origin: "ai_auto" as const,
    };
    const html = renderOverview({} as Database, dashboard, {
      reviews: [review], canReview: false, accountId: "acct_A",
    });
    expect(html).toContain("閲覧のみできます");
    expect(html).not.toContain("承認する");
    expect(html).not.toContain("request-revision");
  });

  test("renders direct editing only for manual drafts", () => {
    const manual = {
      contentId: "cv_manual_1", version: 1, contentHash: "b".repeat(64),
      topic: "手書き案", contentRole: "trust", body: "自分で書いた本文",
      createdAt: "2026-09-23T01:00:00Z", scheduledAt: null,
      status: "確認待ち", aiChanges: [], origin: "human_manual" as const,
    };
    const html = renderOverview({} as Database, dashboard, {
      reviews: [manual], canReview: true, accountId: "acct_A",
    });
    expect(html).toContain("編集する");
    expect(html).toContain("編集内容を保存");
    expect(html).toContain("自分で書いた本文");
    expect(html).not.toContain("修正を依頼する");
  });

  test("posts direct manual edits with the exact binding", async () => {
    const requests: Request[] = [];
    await mutateCustomerReview({
      action: "edit", accountId: "acct_A", contentId: "cv_manual_1",
      version: 3, contentHash: "b".repeat(64), tenantUserId: "editor_A",
      body: "直接編集した本文",
      fetcher: (async (input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(new Request(input, init));
        return Response.json({ status: "success" });
      }) as typeof fetch,
    });
    const body = await requests[0].json() as Record<string, unknown>;
    expect(requests[0].url).toEndWith("/api/customer/content/cv_manual_1/edit");
    expect(body.expected_version).toBe(3);
    expect(body.expected_content_hash).toBe("b".repeat(64));
    expect(body.body).toBe("直接編集した本文");
  });

  test("adds a published manual post to analysis without learning", async () => {
    const requests: Request[] = [];
    const state = await addManualPostToAnalysis({
      accountId: "acct_A", detectionId: "manual_1", tenantUserId: "editor_A",
      fetcher: (async (input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(new Request(input, init));
        return Response.json({ status: "success", analysis_state: "fetching" });
      }) as typeof fetch,
    });
    expect(state).toBe("fetching");
    expect(requests[0].url).toEndWith("/api/customer/manual-posts/manual_1/analyze");
    expect(requests[0].headers.get("x-threads-user-id")).toBe("editor_A");
    const body = await requests[0].json() as Record<string, unknown>;
    expect(body.account_id).toBe("acct_A");
    expect(body.human_confirmed).toBe(true);
    expect(body.learn_enabled).toBeUndefined();
  });

  test("shows manual analysis as unadded, fetching, analyzed, and retryable", () => {
    const base = {
      externalId: "external-1", body: "公開済み手動投稿", publishedAt: "2026-09-23T01:00:00Z",
      origin: "human_manual" as const, learnEnabled: false, topic: null, contentRole: null,
      hypothesis: null, trackingState: "tracked" as const, logicalThreadId: "thread-1",
      rootExternalId: "external-1", replyToExternalId: null, partIndex: 0, partCount: 1,
      parts: [],
    };
    const html = renderOverview({} as Database, {
      ...dashboard,
      manualPosts: [
        { ...base, detectionId: "manual-unadded", analyzeEnabled: false, threadMetrics: {} },
        { ...base, detectionId: "manual-fetching", analyzeEnabled: true, threadMetrics: {} },
        { ...base, detectionId: "manual-analyzed", analyzeEnabled: true, threadMetrics: { views: 12 } },
      ],
    }, {
      reviews: [], canReview: true, accountId: "acct_A", manualAnalysisNotice: "failed",
    });
    expect(html).toContain("未追加");
    expect(html).toContain("取得中");
    expect(html).toContain("分析済み");
    expect(html).toContain("分析に追加");
    expect(html).toContain("取得できませんでした。再試行してください。");
    expect(html).toContain("改善学習には使わない");
  });
});
