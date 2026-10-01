import { describe, expect, test } from "bun:test";
import { loadThreadsDashboard, type ThreadsDashboardData } from "../web/lib/threads-dashboard";
import { deriveOperatorNextAction, renderOperatorDashboard } from "../web/routes/operator-dashboard";
import {
  accountResponseV1, editorialCustomerV1, editorialInternalV1, safetyResponseV1,
} from "./threads-bridge-v1-fixtures";

function account(accountId: string, handle: string, state = "metrics_pending"): ThreadsDashboardData {
  return {
    connected: true, bridgeStatus: "HEALTHY", accountId, handle, displayName: handle,
    accountStatus: "ready", fetchedAt: "2026-10-01T11:00:00Z",
    contents: [{
      contentId: `${accountId}-content`, version: 1, attempt: 1, topic: "topic", contentRole: "reach",
      body: "body", state, qaVerdict: "pass", approved: true, copyGuard: "pass",
      createdAt: "2026-10-01T09:00:00Z", updatedAt: "2026-10-01T10:00:00Z", scheduledAt: null,
      publication: { publicationId: `${accountId}-pub`, mode: "live", status: "succeeded", externalId: "1234567890", permalink: null, createdAt: "2026-10-01T09:30:00Z", publishedAt: "2026-10-01T09:45:00Z", readbackStatus: "confirmed", duplicate: false },
      metrics: state === "metrics_collected" ? { views: 120, likes: 8 } : {},
      metricsObservedAt: null, metricsFetchedAt: state === "metrics_collected" ? "2026-10-01T10:45:00Z" : null,
      metricsEligibleAt: "2026-10-01T14:57:00Z", viewsPerHour: null, engagementPerHour: null,
      origin: "ai_auto", analyzeEnabled: true, learnEnabled: true, partCount: 1,
    }],
    manualPosts: [], metricsRecordCount: state === "metrics_collected" ? 1 : 0, hasLearningSnapshot: false,
    operations: { nightBatchItems: [], publicationsLastHour: 1, publicationsLast24h: 1, manualPostSyncAvailable: true, selfReplySync: "active" },
    safety: { available: true, globalStop: false, accountStop: false, capabilityStop: false, approvalMode: "human", unresolvedAmbiguous: false, rateGuardReady: true, minIntervalSeconds: 600, hourlyLimit: 2, dailyLimit: 5 },
    editorial: { state: null, status: null, currentAgent: null, waitingReason: null, facts: [], unknowns: [], proposals: [], critiques: [], rejectedOptions: [], finalDecision: null, brief: null, experiments: [], customerSummary: null },
    operator: {
      armed: false, providerUsername: handle, providerUserId: "17841400000000001",
      publishCredential: { state: "ready", ready: true, expiresAt: null },
      insightsCredential: { state: "ready", ready: true, expiresAt: null },
      structuralStatus: "ready", readyForDryRun: true, readinessBlocking: [],
      gitSha: "a".repeat(40), deploymentPath: null, schemaVersion: 33, schemaReadiness: "READY",
      executionState: "INHIBITED", enabledCapabilities: [], writerPolicyStatus: null,
      runners: [
        { name: "night_batch", state: "disabled", healthy: false, lastRunAt: null, runStatus: null },
        { name: "insights", state: "disabled", healthy: false, lastRunAt: null, runStatus: null },
      ],
    },
    activities: [{ type: "readback_confirmed", at: "2026-10-01T09:46:00Z", entityId: `${accountId}-pub`, detail: "confirmed" }],
    message: "実アカウント連携済み",
  };
}

describe("MVP operator dashboard", () => {
  test("shows two separated accounts, one action each, and honest UNKNOWN states", () => {
    const first = account("acct_8ssana", "8sssana");
    const second = account("acct_taku_ai_tech", "taku_ai_tech", "metrics_collected");
    const html = renderOperatorDashboard([first, second], "2026-10-01T11:00:00Z");
    expect(html.match(/class="op-account"/g)).toHaveLength(2);
    expect(html).toContain('data-account-id="acct_8ssana"');
    expect(html).toContain('data-account-id="acct_taku_ai_tech"');
    expect(html.match(/aria-label="Next operator action"/g)).toHaveLength(2);
    expect(html).toContain("Await insights maturity");
    expect(html).toContain("Ready to arm");
    expect(html).toContain("v33 READY");
    expect(html).toContain("Deployment path");
    expect(html).toContain("UNKNOWN");
    expect(html).toContain("Readback confirmed");
  });

  test("contains no live mutation or secret surface", () => {
    const html = renderOperatorDashboard([
      account("acct_8ssana", "8sssana"),
      account("acct_taku_ai_tech", "taku_ai_tech"),
    ]);
    expect(html).not.toMatch(/<form|method=["']post|\/arm|\/disarm|access_token|secret_ref|app_secret|authorization_code/i);
    expect(html).toContain("READ ONLY NOW");
    expect(html.match(/<button type="button" disabled>/g)).toHaveLength(6);
    for (const hidden of ["sashihara", "kiara", "iori", "agent hierarchy", "internal meeting"]) {
      expect(html.toLowerCase()).not.toContain(hidden);
    }
  });

  test("prioritizes reported stops and ambiguity over optimistic actions", () => {
    const stopped = account("acct_8ssana", "8sssana", "publish_ready");
    stopped.safety.globalStop = true;
    expect(deriveOperatorNextAction(stopped).label).toBe("Reconciliation required");
    stopped.safety.globalStop = false;
    stopped.safety.unresolvedAmbiguous = true;
    expect(deriveOperatorNextAction(stopped).label).toBe("Reconciliation required");
    stopped.safety.available = false;
    expect(deriveOperatorNextAction(stopped).label).toBe("Reconciliation required");
  });

  test("loads sanitized readiness and operational status through GET-only production paths", async () => {
    const methods: string[] = [];
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      methods.push(init?.method ?? "GET");
      const url = String(input);
      if (url.includes("/safety/status")) return Response.json(safetyResponseV1());
      if (url.includes("/editorial/internal")) return Response.json(editorialInternalV1());
      if (url.includes("/editorial/customer")) return Response.json(editorialCustomerV1());
      if (url.includes("/operator/readiness/accounts/")) return Response.json({
        account: { status: "ready", armed: false, handle: "8sssana" },
        structural_readiness: { status: "ready", ready_for_dry_run: true, blocking: [] },
        credential_readiness: {
          publish: { state: "ready", ready: true, threads_username: "8sssana", threads_user_id: "17841400000000001", secret_ref: "must-not-escape", access_token: "must-not-escape" },
          insights: { state: "ready", ready: true },
        },
      });
      if (url.includes("/operational-boundary")) return Response.json({
        producer_release_identity: { git_sha: "a".repeat(40), artifact_sha256: "b".repeat(64) },
        schema_version: 33, schema_readiness: "READY", execution_state: "INHIBITED",
        enabled_capabilities: [], source_evidence: { runner_heartbeats: [{ runner_name: "night_batch", state: "disabled", healthy: false, last_run_at: null, run_status: null }] },
      });
      return Response.json(accountResponseV1({ account_id: "acct_8ssana", handle: "8sssana" }));
    }) as typeof fetch;
    const data = await loadThreadsDashboard({ bridgeUrl: "http://127.0.0.1:8765", accountId: "acct_8ssana", fetcher });
    expect(data.operator).toMatchObject({ armed: false, providerUsername: "8sssana", schemaVersion: 33, schemaReadiness: "READY" });
    expect(methods.every((method) => method === "GET")).toBe(true);
    expect(JSON.stringify(data)).not.toContain("must-not-escape");
  });
});
