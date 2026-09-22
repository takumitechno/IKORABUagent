import { describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import {
  loadCustomerPendingReviews, mutateCustomerReview, type ThreadsDashboardData,
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


describe("customer content review experience", () => {
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
      aiChanges: ["文章を短く整えました"],
    }];
    const html = renderOverview({} as Database, dashboard, {
      reviews, canReview: true, accountId: "acct_A",
    });
    expect(html).toContain("確認が必要な投稿");
    expect(html).toContain("確認待ち 1件");
    expect(html).toContain("承認 / 修正依頼 / 見送り");
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
      status: "確認待ち", aiChanges: [],
    };
    const html = renderOverview({} as Database, dashboard, {
      reviews: [review], canReview: false, accountId: "acct_A",
    });
    expect(html).toContain("閲覧のみできます");
    expect(html).not.toContain("承認する");
    expect(html).not.toContain("request-revision");
  });
});
