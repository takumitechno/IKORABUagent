import { describe, expect, test } from "bun:test";
import type { Database } from "bun:sqlite";
import { loadThreadsAccounts, loadThreadsDashboard } from "../web/lib/threads-dashboard";
import { renderOverview } from "../web/routes/overview";
import { renderImprovementReport } from "../web/routes/improvement-report";

describe("read-only Threads dashboard connector", () => {
  test("loads the account selector from the Bridge and only keeps display-safe fields", async () => {
    const requests: Request[] = [];
    const accounts = await loadThreadsAccounts({
      bridgeUrl: "http://127.0.0.1:8765",
      apiKey: "server-only-key",
      fetcher: (async (input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(new Request(input, init));
        return Response.json({
          accounts: [
            { account_id: "acct_8ssana", handle: "8sssana", display_name: "Sana", account_status: "active", access_token: "never-render" },
            { account_id: "acct_other", handle: "other", display_name: "Other", account_status: "paused", db_path: "never-render" },
          ],
        });
      }) as typeof fetch,
    });
    expect(accounts).toEqual([
      { accountId: "acct_8ssana", handle: "8sssana", displayName: "Sana", accountStatus: "active" },
      { accountId: "acct_other", handle: "other", displayName: "Other", accountStatus: "paused" },
    ]);
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toEndWith("/operator/accounts");
    expect(requests[0].headers.get("authorization")).toBe("Bearer server-only-key");
  });

  test("scopes summary and safety reads to the selected account", async () => {
    const urls: string[] = [];
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      accountId: "acct_other",
      fetcher: (async (input: RequestInfo | URL) => {
        const url = String(input);
        urls.push(url);
        if (url.includes("/autopilot/v2/safety/status")) return Response.json({ rate_guard_ready: false });
        return Response.json({
          account_id: "acct_other", handle: "other", display_name: "Other",
          account_status: "active", recent_contents: [], recent_publications: [],
        });
      }) as typeof fetch,
    });
    expect(data.connected).toBe(true);
    expect(data.accountId).toBe("acct_other");
    expect(urls).toContain("http://127.0.0.1:8765/operator/accounts/acct_other");
    expect(urls).toContain("http://127.0.0.1:8765/autopilot/v2/safety/status?account_id=acct_other");
    expect(urls.some((url) => url.includes("acct_8ssana"))).toBe(false);
  });

  test("loads account, exact body, workflow, approval, QA, and publication using GET only", async () => {
    const requests: Request[] = [];
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = new Request(input, init);
      requests.push(request);
      if (request.url.endsWith("/operator/accounts/acct_8ssana")) {
        return Response.json({
          account_id: "acct_8ssana",
          handle: "8sssana",
          display_name: "Sana",
          account_status: "active",
          pipeline: { n_metrics: 2, has_learning_snapshot: false },
          manual_posts: [{
            external_post_id: "manual-101", body_text: "自分で投稿した本文",
            published_at: "2026-09-20T11:00:00Z", origin: "human_manual",
            analyze_enabled: true, learn_enabled: false,
            topic: "手動テーマ", content_role: "trust", hypothesis: "信頼仮説",
            tracking_state: "tracked", request_id: "must-not-surface",
            logical_thread_id: "internal-thread-id", root_external_id: "manual-101",
            n_parts: 3, thread_metrics: { views: 210, likes: 7 },
            parts: [
              { external_post_id: "manual-101", part_index: 0, body_text: "1つ目", metrics: { views: 100 } },
              { external_post_id: "manual-102", part_index: 1, body_text: "2つ目", metrics: { views: 70 } },
              { external_post_id: "manual-103", part_index: 2, body_text: "3つ目", metrics: { views: 40 } },
            ],
          }],
          recent_contents: [{ content_id: "cv-live" }],
          recent_publications: [{
            content_id: "cv-live", mode: "live", status: "succeeded",
            published_at: null,
          }],
        });
      }
      if (request.url.endsWith("/operator/accounts/acct_8ssana/contents/cv-live")) {
        return Response.json({
          content_id: "cv-live",
          topic: "実投稿のテーマ",
          content_role: "reach",
          body_text: "実際に保存された投稿本文です。",
          state: "approved",
          qa: { verdict: "pass", findings: [] },
          approved_for_current_body: true,
          created_at: "2026-09-20T09:00:00Z",
          updated_at: "2026-09-20T10:00:00Z",
          scheduled_at: "2026-09-20T10:30:00Z",
          publications: [{
            mode: "live", status: "succeeded", external_publish_id: "18125587639858005",
            parts_state: [{ external_id: "18125587639858005", published_at: "2026-09-20T10:00:00Z" }],
          }],
          metrics: { views: 120, likes: 3, replies: 2, reposts: 1, quotes: 0, unavailable_metric: 999 },
          metrics_observation: {
            observed_at: "2026-09-20T12:00:00Z",
            fetched_at: "2026-09-20T12:00:05Z",
            available_keys: ["views", "likes", "replies", "reposts", "quotes"],
            source: "threads_insights",
          },
          origin: "human_manual", analyze_enabled: true, learn_enabled: false,
          parts: ["1つ目", "2つ目", "3つ目"],
        });
      }
      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      accountId: "acct_8ssana",
      apiKey: "test-only-key",
      fetcher,
    });

    expect(data.connected).toBe(true);
    expect(data.handle).toBe("8sssana");
    expect(data.contents).toHaveLength(1);
    expect(data.contents[0].body).toBe("実際に保存された投稿本文です。");
    expect(data.contents[0].approved).toBe(true);
    expect(data.contents[0].qaVerdict).toBe("pass");
    expect(data.contents[0].copyGuard).toBe("pass");
    expect(data.contents[0].scheduledAt).toBe("2026-09-20T10:30:00Z");
    expect(data.contents[0].publication?.externalId).toBe("18125587639858005");
    expect(data.contents[0].publication?.publishedAt).toBe("2026-09-20T10:00:00Z");
    expect(data.contents[0].metrics).toEqual({ views: 120, likes: 3, replies: 2, reposts: 1, quotes: 0 });
    expect(data.contents[0].metricsObservedAt).toBe("2026-09-20T12:00:00Z");
    expect(data.contents[0].metricsFetchedAt).toBe("2026-09-20T12:00:05Z");
    expect(data.contents[0].viewsPerHour).toBe(60);
    expect(data.contents[0].engagementPerHour).toBe(3);
    expect(data.metricsRecordCount).toBe(2);
    expect(data.hasLearningSnapshot).toBe(false);
    expect(data.manualPosts).toEqual([expect.objectContaining({
      externalId: "manual-101", origin: "human_manual",
      analyzeEnabled: true, learnEnabled: false, partCount: 3,
      threadMetrics: { views: 210, likes: 7 },
    })]);
    expect(requests.every((request) => request.method === "GET")).toBe(true);
    const html = renderOverview({} as Database, data);
    expect(html).toContain("自分で投稿した内容も分析できます");
    expect(html).toContain("分析に使う");
    expect(html).toContain("改善学習には使わない");
    expect(html).toContain("スレッド投稿 1/3〜3/3");
    expect(html).toContain("スレッドの本文と実績を見る");
    expect(html).toContain("手動投稿");
    expect(html).toContain("表示/時");
    expect(html).toContain("反応/時");
    expect(html).toContain("反応率");
    expect(html).toContain("シェア</b>取得不可");
    expect(html).toContain("最終取得");
    expect(html).toContain('id="theme-toggle"');
    expect(html).toContain("実績を図で確認");
    expect(html).toContain("投稿ごとの表示数");
    expect(html).toContain("投稿状態の内訳");
    expect(html).toContain("conic-gradient");
    expect(html).toContain("summary-icon");
    expect(html).not.toContain("must-not-surface");
    expect(html).not.toContain("internal-thread-id");
    expect(html).toContain('href="/improvement"');
    const report = renderImprovementReport(data);
    for (const section of ["改善サマリー", "確認できた事実", "現時点の仮説", "まだ判断できないこと", "今回試したこと / 次回テスト", "投稿比較", "改善履歴"]) {
      expect(report).toContain(section);
    }
    expect(report).toContain("実投稿のテーマ");
    expect(report).toContain(">120<");
    expect(report).toContain(">0<");
    expect(report).toContain("比較できる投稿がまだありません");
    expect(report).toContain("構造化された実験記録はまだ取得できません");
    expect(report).toContain("一度に変える変数は1つ");
    expect(report).toContain("人手投稿");
    expect(report).toContain("分析に使う");
    expect(report).toContain("改善学習には使わない");
    expect(report).toContain('id="theme-toggle"');
    expect(report).not.toContain("must-not-surface");
    expect(report).not.toContain("internal-thread-id");
    for (const forbidden of ["request_id", "content_hash", "DB path", "batch_id", "currentAgent", "kiara-executor", "iori-validator", "sashihara-orchestrator"]) {
      expect(report).not.toContain(forbidden);
    }
    const comparisonReport = renderImprovementReport({
      ...data,
      contents: [data.contents[0], {
        ...data.contents[0], contentId: "cv-safe-second", topic: "比較投稿",
        metrics: { views: 60, likes: 0, replies: 0, reposts: 0, quotes: 0 },
        viewsPerHour: 30, engagementPerHour: 0,
      }],
    });
    expect(comparisonReport).toContain("2件を比較");
    expect(comparisonReport).toContain("いいね/表示");
    expect(comparisonReport).toContain("返信/表示");
    expect(comparisonReport).toContain("比較投稿");
    expect(comparisonReport).toContain("末尾に短い問いかけを入れるかだけを変更");
    expect(comparisonReport).toContain("既存#2〜#5は変更しない");
    expect(comparisonReport).not.toContain("cv-safe-second");
  });

  test("keeps measured content visible when it falls outside the five newest rows", async () => {
    const detailRequests: string[] = [];
    const recentContents = Array.from({ length: 6 }, (_, index) => ({
      content_id: `cv-${index + 1}`,
      state: index === 5 ? "metrics_collected" : "publish_ready",
    }));
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      fetcher: (async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/operator/accounts/acct_8ssana")) {
          return Response.json({
            account_id: "acct_8ssana",
            handle: "8sssana",
            display_name: "Sana",
            account_status: "active",
            recent_contents: recentContents,
            recent_publications: [{
              content_id: "cv-6", mode: "live", status: "partial",
              external_publish_id: "18125587639858005", published_at: null,
            }],
          });
        }
        if (url.includes("/contents/")) {
          detailRequests.push(url);
          const contentId = url.split("/").at(-1);
          return Response.json({
            content_id: contentId,
            topic: contentId === "cv-6" ? "LINEの温度差" : contentId,
            body_text: "実投稿本文",
            state: contentId === "cv-6" ? "metrics_collected" : "publish_ready",
            qa: { verdict: "pass" },
            approved_for_current_body: true,
            publications: contentId === "cv-6" ? [{
              mode: "live", status: "partial", external_publish_id: "18125587639858005",
              published_at: null,
              parts_state: [
                { index: 0, status: "succeeded", external_id: "18125587639858005", published_at: "2026-09-20T11:23:52Z" },
                { index: 1, status: "failed", external_id: null },
              ],
            }] : [],
            metrics: contentId === "cv-6" ? { views: 189 } : {},
          });
        }
        return new Response("not found", { status: 404 });
      }) as typeof fetch,
    });

    expect(detailRequests).toHaveLength(6);
    const measured = data.contents.find((content) => content.topic === "LINEの温度差");
    expect(measured?.metrics.views).toBe(189);
    expect(measured?.publication?.externalId).toBe("18125587639858005");
    expect(measured?.publication?.publishedAt).toBe("2026-09-20T11:23:52Z");
    const html = renderOverview({} as Database, data);
    expect(html).toContain("LINEの温度差");
    expect(html).toContain("189");
    expect(html).toContain('class="bar-chart"');
  });

  test("fails closed without substituting demo content or metrics", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      fetcher: (async () => { throw new Error("secret transport detail"); }) as typeof fetch,
      timeoutMs: 50,
    });
    expect(data.connected).toBe(false);
    expect(data.message).toBe("接続待ち");
    expect(data.contents).toEqual([]);

    const html = renderOverview({} as Database, data);
    expect(html).toContain("接続待ち");
    expect(html).toContain("実データは表示していません");
    expect(html).toContain("投稿実績とKPI");
    expect(html).toContain("推定値やデモ値は表示しません");
    expect(html).toContain("表示データを計測中");
    expect(html).toContain("投稿データを待っています");
    expect(html).not.toContain("デモ補助");
    expect(html.match(/class="pipeline-row post-row"/g)).toBeNull();
    expect(html).not.toContain("secret transport detail");
    const report = renderImprovementReport(data);
    expect(report).toContain("接続待ち");
    expect(report).toContain("取得済みKPIはありません");
    expect(report).not.toContain("secret transport detail");
  });

  test("renders only the selected account's real data with customer-facing labels", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      fetcher: (async (input: RequestInfo | URL) => {
        const url = String(input);
        return url.endsWith("/operator/accounts/acct_8ssana")
          ? Response.json({
              account_id: "acct_8ssana", handle: "8sssana", display_name: "Sana", account_status: "active",
              recent_contents: [{ content_id: "cv-one" }], recent_publications: [],
            })
          : Response.json({
              content_id: "cv-one", topic: "保存済み投稿", body_text: "実投稿本文", state: "human_approval_pending",
              qa: { verdict: "pass" }, approved_for_current_body: false, publications: [],
            });
      }) as typeof fetch,
    });
    const html = renderOverview({} as Database, data);
    expect(html).toContain("SanaのSNS運用");
    expect(html).toContain("@8sssana");
    expect(html).toContain("実投稿本文");
    expect(html).toContain("1件の承認を待っています");
    expect(html).not.toContain("デモ補助");
    expect(html).toContain("確認できた事実");
    expect(html).toContain("現時点の仮説");
    expect(html).toContain("まだ判断できないこと");
    expect(html).toContain("次回テスト");
    expect(html).toContain("計測中");
    expect(html).not.toContain("勝ち投稿");
    expect(html).not.toContain("最適解です");
    expect(html.match(/class="pipeline-row post-row"/g)).toHaveLength(1);
    expect(html).not.toContain('name="account_id"');
    for (const forbidden of ["request_id", "content_hash", "DB path", "capability", "kiara-executor", "iori-validator", "sashihara-orchestrator"]) {
      expect(html).not.toContain(forbidden);
    }
  });
});
