import type {
  BridgeAccountResponseV1 as AccountResponse,
  BridgeAccountsResponseV1 as AccountsResponse,
  BridgeContentResponseV1 as ContentResponse,
} from "./threads-bridge-contract-v1.generated";
import {
  ThreadsBridgeContractError,
  bridgeFailureStatus,
  getContractJson,
  parseAccountResponseV1,
  parseAccountsResponseV1,
  parseContentResponseV1,
  parseEditorialCustomerResponseV1,
  parseEditorialInternalResponseV1,
  parseSafetyResponseV1,
  type ThreadsBridgeStatus,
} from "./threads-bridge-contract";

const DEFAULT_BRIDGE_URL = "http://127.0.0.1:8000";
const DEFAULT_ACCOUNT_ID = "acct_8ssana";
const CACHE_TTL_MS = 15_000;

export interface ThreadsPublication {
  mode: string;
  status: string;
  externalId: string | null;
  permalink: string | null;
  createdAt: string | null;
  publishedAt: string | null;
}

export type ThreadsMetricKey =
  | "views" | "likes" | "replies" | "reposts" | "quotes" | "shares"
  | "profile_visits" | "follower_delta" | "link_clicks"
  | "lead_registrations" | "free_reading_applications" | "paid_conversions" | "revenue";

export interface ThreadsContent {
  contentId: string;
  topic: string | null;
  contentRole: string | null;
  body: string;
  state: string;
  qaVerdict: string | null;
  approved: boolean;
  copyGuard: "pass" | "blocked" | "unknown";
  createdAt: string | null;
  updatedAt: string | null;
  scheduledAt: string | null;
  publication: ThreadsPublication | null;
  metrics: Partial<Record<ThreadsMetricKey, number>>;
  metricsObservedAt: string | null;
  metricsFetchedAt: string | null;
  viewsPerHour: number | null;
  engagementPerHour: number | null;
  origin: "ai_auto" | "ai_manual" | "human_manual" | "unknown";
  analyzeEnabled: boolean;
  learnEnabled: boolean;
  partCount: number;
}

export interface ManualPostStatus {
  detectionId: string;
  externalId: string;
  body: string;
  publishedAt: string | null;
  origin: "ai_auto" | "ai_manual" | "human_manual";
  analyzeEnabled: boolean;
  learnEnabled: boolean;
  topic: string | null;
  contentRole: string | null;
  hypothesis: string | null;
  trackingState: "detected" | "tracked";
  logicalThreadId: string;
  rootExternalId: string;
  replyToExternalId: string | null;
  partIndex: number;
  partCount: number;
  parts: Array<{
    externalId: string;
    replyToExternalId: string | null;
    partIndex: number;
    body: string;
    publishedAt: string | null;
    metrics: Partial<Record<ThreadsMetricKey, number>>;
  }>;
  threadMetrics: Partial<Record<ThreadsMetricKey, number>>;
}

export interface NightBatchItem {
  itemId: string;
  batchId: string;
  contentId: string;
  scheduledAt: string;
  status: "pending" | "succeeded" | "failed_confirmed" | "ambiguous" | "blocked" | "unknown";
  blockReason: string | null;
  attemptedAt: string | null;
  batchStatus: string;
  expiresAt: string | null;
}

export interface ThreadsSafetyStatus {
  available: boolean;
  globalStop: boolean;
  accountStop: boolean;
  capabilityStop: boolean;
  approvalMode: string | null;
  unresolvedAmbiguous: boolean;
  rateGuardReady: boolean;
  minIntervalSeconds: number | null;
  hourlyLimit: number | null;
  dailyLimit: number | null;
}

export interface ThreadsOperations {
  nightBatchItems: NightBatchItem[];
  publicationsLastHour: number | null;
  publicationsLast24h: number | null;
  manualPostSyncAvailable: boolean;
  selfReplySync: "active" | "reauthorization_required" | "not_available" | "unknown";
}

export interface ThreadsEditorial {
  state: string | null;
  status: string | null;
  currentAgent: string | null;
  waitingReason: string | null;
  facts: string[];
  unknowns: string[];
  proposals: Array<Record<string, unknown>>;
  critiques: Array<Record<string, unknown>>;
  rejectedOptions: Array<Record<string, unknown>>;
  finalDecision: Record<string, unknown> | null;
  brief: Record<string, unknown> | null;
  experiments: Array<Record<string, unknown>>;
  customerSummary: Record<string, unknown> | null;
}

export interface ThreadsDashboardData {
  connected: boolean;
  bridgeStatus: ThreadsBridgeStatus;
  accountId: string;
  handle: string | null;
  displayName: string | null;
  accountStatus: string | null;
  fetchedAt: string;
  contents: ThreadsContent[];
  manualPosts: ManualPostStatus[];
  metricsRecordCount: number;
  hasLearningSnapshot: boolean;
  operations: ThreadsOperations;
  safety: ThreadsSafetyStatus;
  editorial: ThreadsEditorial;
  message: "実アカウント連携済み" | "接続待ち" | "データ取得待ち" | "アカウントが見つかりません";
}

export interface ThreadsAccountOption {
  accountId: string;
  handle: string | null;
  displayName: string | null;
  accountStatus: string | null;
}

export interface CustomerReviewItem {
  contentId: string;
  version: number;
  contentHash: string;
  topic: string;
  contentRole: string;
  body: string;
  createdAt: string;
  status: string;
  scheduledAt: string | null;
  aiChanges: string[];
}

export type CustomerReviewAction = "approve" | "reject" | "request-revision";

type FetchLike = typeof fetch;

const EMPTY_OPERATIONS: ThreadsOperations = {
  nightBatchItems: [], publicationsLastHour: null, publicationsLast24h: null,
  manualPostSyncAvailable: false, selfReplySync: "unknown",
};

const EMPTY_SAFETY: ThreadsSafetyStatus = {
  available: false, globalStop: false, accountStop: false, capabilityStop: false,
  approvalMode: null, unresolvedAmbiguous: false, rateGuardReady: false,
  minIntervalSeconds: null, hourlyLimit: null, dailyLimit: null,
};

const EMPTY_EDITORIAL: ThreadsEditorial = {
  state: null, status: null, currentAgent: null, waitingReason: null,
  facts: [], unknowns: [], proposals: [], critiques: [], rejectedOptions: [],
  finalDecision: null, brief: null, experiments: [], customerSummary: null,
};

function recordArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value)
    ? value.map(record).filter((item): item is Record<string, unknown> => item !== null)
    : [];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter((item): item is string => item !== null) : [];
}

function editorialFrom(internal: unknown, customer: unknown): ThreadsEditorial {
  const internalRoot = record(internal);
  const cycle = record(internalRoot?.cycle);
  const summary = record(cycle?.summary);
  const customerRoot = record(customer);
  return {
    state: text(cycle?.state), status: text(cycle?.status),
    currentAgent: text(cycle?.current_agent), waitingReason: text(cycle?.waiting_reason),
    facts: stringArray(summary?.facts), unknowns: stringArray(summary?.unknowns),
    proposals: recordArray(summary?.proposals), critiques: recordArray(summary?.critiques),
    rejectedOptions: recordArray(summary?.rejected_options),
    finalDecision: record(summary?.final_decision), brief: record(cycle?.brief),
    experiments: recordArray(internalRoot?.experiments),
    customerSummary: record(customerRoot?.summary),
  };
}

const METRIC_KEYS: ThreadsMetricKey[] = [
  "views", "likes", "replies", "reposts", "quotes", "shares",
  "profile_visits", "follower_delta", "link_clicks", "lead_registrations",
  "free_reading_applications", "paid_conversions", "revenue",
];

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function safeOrigin(raw: string): string {
  const url = new URL(raw);
  const local = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(url.hostname.toLowerCase());
  if (!local && url.protocol !== "https:") throw new Error("unsafe bridge origin");
  if (local && !["http:", "https:"].includes(url.protocol)) throw new Error("unsafe bridge origin");
  if (url.username || url.password || url.search || url.hash || !["", "/"].includes(url.pathname)) {
    throw new Error("unsafe bridge origin");
  }
  return url.origin;
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function externalId(publication: Record<string, unknown>): string | null {
  const direct = text(publication.external_publish_id);
  if (direct && !direct.startsWith("dryrun:")) return direct;
  const parts = Array.isArray(publication.parts_state) ? publication.parts_state : [];
  for (const part of parts) {
    const id = text(record(part)?.external_id);
    if (id && !id.startsWith("dryrun:")) return id;
  }
  return null;
}

function metricMap(value: unknown): Partial<Record<ThreadsMetricKey, number>> {
  const source = record(value);
  if (!source) return {};
  const result: Partial<Record<ThreadsMetricKey, number>> = {};
  for (const key of METRIC_KEYS) {
    const number = source[key];
    if (typeof number === "number" && Number.isFinite(number) && number >= 0) result[key] = number;
  }
  return result;
}

function metricObservation(value: unknown): { observedAt: string | null; fetchedAt: string | null } {
  const source = record(value);
  return {
    observedAt: text(source?.observed_at),
    fetchedAt: text(source?.fetched_at),
  };
}

function hourlyRates(
  metrics: Partial<Record<ThreadsMetricKey, number>>,
  publishedAt: string | null,
  observedAt: string | null,
): { viewsPerHour: number | null; engagementPerHour: number | null } {
  if (!publishedAt || !observedAt) return { viewsPerHour: null, engagementPerHour: null };
  const start = Date.parse(publishedAt), end = Date.parse(observedAt);
  const hours = (end - start) / 3_600_000;
  if (!Number.isFinite(hours) || hours <= 0) return { viewsPerHour: null, engagementPerHour: null };
  const viewsPerHour = typeof metrics.views === "number" ? metrics.views / hours : null;
  const engagementKeys: ThreadsMetricKey[] = ["likes", "replies", "reposts", "quotes"];
  const engagementPerHour = engagementKeys.every((key) => typeof metrics[key] === "number")
    ? engagementKeys.reduce((sum, key) => sum + (metrics[key] ?? 0), 0) / hours
    : null;
  return { viewsPerHour, engagementPerHour };
}

function nonNegativeInt(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}

function normalizeOrigin(value: unknown): ThreadsContent["origin"] {
  const got = text(value);
  return got && ["ai_auto", "ai_manual", "human_manual"].includes(got)
    ? got as ThreadsContent["origin"] : "unknown";
}

function operationsFrom(value: unknown): ThreadsOperations {
  const source = record(value);
  if (!source) return { ...EMPTY_OPERATIONS };
  const usage = record(source.rolling_usage);
  const features = record(source.features);
  const selfReply = text(features?.self_reply_sync);
  const nightBatchItems = Array.isArray(source.night_batch_items)
    ? source.night_batch_items.map(record).filter((row): row is Record<string, unknown> => row !== null)
      .map((row): NightBatchItem | null => {
        const itemId = text(row.item_id), batchId = text(row.batch_id);
        const contentId = text(row.content_id), scheduledAt = text(row.scheduled_at);
        if (!itemId || !batchId || !contentId || !scheduledAt) return null;
        const rawStatus = text(row.status) ?? "unknown";
        return {
          itemId, batchId, contentId, scheduledAt,
          status: ["pending", "succeeded", "failed_confirmed", "ambiguous", "blocked"].includes(rawStatus)
            ? rawStatus as NightBatchItem["status"] : "unknown",
          blockReason: text(row.block_reason), attemptedAt: text(row.attempted_at),
          batchStatus: text(row.batch_status) ?? "unknown", expiresAt: text(row.expires_at),
        };
      }).filter((row): row is NightBatchItem => row !== null)
    : [];
  return {
    nightBatchItems,
    publicationsLastHour: nonNegativeInt(usage?.publications_last_hour),
    publicationsLast24h: nonNegativeInt(usage?.publications_last_24h),
    manualPostSyncAvailable: features?.manual_post_sync === true,
    selfReplySync: selfReply === "active" || selfReply === "reauthorization_required" || selfReply === "not_available" ? selfReply : "unknown",
  };
}

function safetyFrom(value: unknown): ThreadsSafetyStatus {
  const source = record(value), policy = record(source?.rate_policy);
  if (!source) return { ...EMPTY_SAFETY };
  return {
    available: true,
    globalStop: source.global_stop === true,
    accountStop: source.account_stop === true,
    capabilityStop: source.capability_stop === true,
    approvalMode: text(source.approval_mode),
    unresolvedAmbiguous: source.unresolved_ambiguous_publication === true,
    rateGuardReady: source.rate_guard_ready === true,
    minIntervalSeconds: nonNegativeInt(policy?.min_interval_seconds),
    hourlyLimit: nonNegativeInt(policy?.hourly_limit),
    dailyLimit: nonNegativeInt(policy?.daily_limit),
  };
}

function publicationFor(
  detail: ContentResponse,
  recentPublications: Record<string, unknown>[],
): ThreadsPublication | null {
  const rows = Array.isArray(detail.publications)
    ? detail.publications.map(record).filter((row): row is Record<string, unknown> => row !== null)
    : [];
  const live = rows.find((row) => text(row.mode) === "live");
  if (!live) return null;
  const contentId = text(detail.content_id);
  const recent = recentPublications.find((row) => text(row.content_id) === contentId && text(row.mode) === text(live.mode));
  const id = externalId(live);
  const parts = Array.isArray(live.parts_state)
    ? live.parts_state.map(record).filter((row): row is Record<string, unknown> => row !== null)
    : [];
  const publishedPart = parts.find((part) => text(part.external_id) === id)
    ?? parts.find((part) => text(part.external_id) && !text(part.external_id)!.startsWith("dryrun:"));
  return {
    mode: text(live.mode) ?? "unknown",
    status: text(live.status) ?? "unknown",
    externalId: id,
    permalink: text(live.permalink) ?? text(publishedPart?.permalink),
    createdAt: text(live.created_at) ?? text(recent?.created_at),
    publishedAt: text(live.published_at) ?? text(recent?.published_at) ?? text(publishedPart?.published_at),
  };
}

function customerMessage(status: ThreadsBridgeStatus): ThreadsDashboardData["message"] {
  if (status === "HEALTHY") return "実アカウント連携済み";
  if (status === "HEALTHY_EMPTY") return "データ取得待ち";
  if (status === "ACCOUNT_NOT_FOUND") return "アカウントが見つかりません";
  return "接続待ち";
}

export async function loadThreadsDashboard(options: {
  bridgeUrl?: string;
  apiKey?: string;
  accountId?: string;
  tenantUserId?: string;
  timeoutMs?: number;
  fetcher?: FetchLike;
} = {}): Promise<ThreadsDashboardData> {
  const accountId = options.accountId ?? process.env.THREADS_DASHBOARD_ACCOUNT_ID ?? DEFAULT_ACCOUNT_ID;
  const fetchedAt = new Date().toISOString();
  const fallback = (bridgeStatus: ThreadsBridgeStatus): ThreadsDashboardData => ({
    connected: false, bridgeStatus, accountId, handle: null, displayName: null, accountStatus: null,
    fetchedAt, contents: [], manualPosts: [], metricsRecordCount: 0, hasLearningSnapshot: false,
    operations: { ...EMPTY_OPERATIONS }, safety: { ...EMPTY_SAFETY },
    editorial: { ...EMPTY_EDITORIAL }, message: customerMessage(bridgeStatus),
  });
  try {
    if (!/^acct_[a-zA-Z0-9_-]+$/.test(accountId)) return fallback("ACCOUNT_NOT_FOUND");
    const origin = safeOrigin(options.bridgeUrl ?? process.env.THREADS_BRIDGE_URL ?? DEFAULT_BRIDGE_URL);
    const apiKey = options.apiKey ?? process.env.THREADS_BRIDGE_API_KEY ?? "";
    if (!apiKey && !["127.0.0.1", "localhost", "::1", "[::1]"].includes(new URL(origin).hostname.toLowerCase())) {
      return fallback("UNAUTHORIZED");
    }
    const headers = bridgeRequestHeaders(apiKey, options.tenantUserId);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 2_500);
    try {
      const fetcher = options.fetcher ?? fetch;
      const encodedAccount = encodeURIComponent(accountId);
      const summary: AccountResponse = await getContractJson(
        fetcher, `${origin}/operator/accounts/${encodedAccount}`, headers, controller.signal,
        parseAccountResponseV1,
      );
      if (summary.account_id !== accountId) {
        throw new ThreadsBridgeContractError("MALFORMED_RESPONSE", "account-scope-mismatch");
      }
      const recentContentRows = Array.isArray(summary.recent_contents)
        ? summary.recent_contents.map(record).filter((row): row is Record<string, unknown> => row !== null)
        : [];
      const recentPublications = Array.isArray(summary.recent_publications)
        ? summary.recent_publications.map(record).filter((row): row is Record<string, unknown> => row !== null)
        : [];
      const livePublishedContentIds = new Set(recentPublications
        .filter((row) => text(row.mode) === "live"
          && ["succeeded", "partial"].includes(text(row.status) ?? ""))
        .map((row) => text(row.content_id))
        .filter((contentId): contentId is string => Boolean(contentId)));
      const recentContents = recentContentRows.filter((row, index) =>
        index < 5 || text(row.state) === "metrics_collected"
          || livePublishedContentIds.has(text(row.content_id) ?? "")
      );
      const pipeline = record(summary.pipeline);
      const operations = operationsFrom(summary.operations);
      const safety = safetyFrom(await getContractJson(
        fetcher, `${origin}/autopilot/v2/safety/status?account_id=${encodedAccount}`,
        headers, controller.signal, parseSafetyResponseV1,
      ));
      const [internalEditorial, customerEditorial] = await Promise.all([
        getContractJson(
          fetcher, `${origin}/autopilot/v2/editorial/internal?account_id=${encodedAccount}`,
          headers, controller.signal, parseEditorialInternalResponseV1,
        ),
        getContractJson(
          fetcher, `${origin}/autopilot/v2/editorial/customer?account_id=${encodedAccount}`,
          headers, controller.signal, parseEditorialCustomerResponseV1,
        ),
      ]);
      const editorial = editorialFrom(internalEditorial, customerEditorial);
      const manualPosts: ManualPostStatus[] = Array.isArray(summary.manual_posts)
        ? summary.manual_posts.map(record).filter((row): row is Record<string, unknown> => row !== null)
          .map((row): ManualPostStatus | null => {
            const externalId = text(row.external_post_id);
            const detectionId = text(row.detection_id) ?? externalId;
            const body = text(row.body_text);
            const origin = text(row.origin);
            const trackingState = text(row.tracking_state);
            if (!externalId || !body || !["ai_auto", "ai_manual", "human_manual"].includes(origin ?? "")
              || !["detected", "tracked"].includes(trackingState ?? "")) return null;
            return {
              detectionId, externalId,
              body,
              publishedAt: text(row.published_at),
              origin: origin as ManualPostStatus["origin"],
              analyzeEnabled: row.analyze_enabled === true,
              learnEnabled: row.learn_enabled === true,
              topic: text(row.topic),
              contentRole: text(row.content_role),
              hypothesis: text(row.hypothesis),
              trackingState: trackingState as ManualPostStatus["trackingState"],
              logicalThreadId: text(row.logical_thread_id) ?? detectionId,
              rootExternalId: text(row.root_external_id) ?? externalId,
              replyToExternalId: text(row.reply_to_external_id),
              partIndex: nonNegativeInt(row.part_index) ?? 0,
              partCount: Math.max(1, nonNegativeInt(row.n_parts) ?? 1),
              parts: Array.isArray(row.parts)
                ? row.parts.map(record).filter((part): part is Record<string, unknown> => part !== null)
                  .map((part, index) => ({
                    externalId: text(part.external_post_id) ?? `${externalId}-${index}`,
                    replyToExternalId: text(part.reply_to_external_id),
                    partIndex: nonNegativeInt(part.part_index) ?? index,
                    body: text(part.body_text) ?? "",
                    publishedAt: text(part.published_at),
                    metrics: metricMap(part.metrics),
                  })).filter((part) => part.body)
                : [{ externalId, replyToExternalId: null, partIndex: 0, body, publishedAt: text(row.published_at), metrics: {} }],
              threadMetrics: metricMap(row.thread_metrics),
            };
          }).filter((row): row is ManualPostStatus => row !== null)
        : [];
      const contents: ThreadsContent[] = [];
      // The existing read-only operator dependency owns one SQLite connection per
      // request. Fetch details serially so its sync dependency lifecycle never
      // overlaps across worker threads. Contract violations fail the whole load
      // closed instead of silently presenting a partial, apparently healthy view.
      for (const item of recentContents) {
        const contentId = text(item.content_id);
        if (!contentId) continue;
        const detail: ContentResponse = await getContractJson(
            fetcher,
            `${origin}/operator/accounts/${encodedAccount}/contents/${encodeURIComponent(contentId)}`,
            headers,
            controller.signal,
            parseContentResponseV1,
          );
          if (detail.content_id !== contentId) {
            throw new ThreadsBridgeContractError("MALFORMED_RESPONSE", "content-scope-mismatch");
          }
          const qa = record(detail.qa);
          const parts = Array.isArray(detail.parts) ? detail.parts.map(text).filter((part): part is string => Boolean(part)) : [];
          const qaVerdict = text(qa?.verdict);
          const publication = publicationFor(detail, recentPublications);
          const metrics = metricMap(detail.metrics);
          const observation = metricObservation(detail.metrics_observation);
          const rates = hourlyRates(metrics, publication?.publishedAt ?? null, observation.observedAt);
        contents.push({
            contentId,
            topic: text(detail.topic),
            contentRole: text(detail.content_role),
            body: text(detail.body_text) ?? parts.join("\n\n"),
            state: text(detail.state) ?? "unknown",
            qaVerdict,
            approved: detail.approved_for_current_body === true,
            copyGuard: qaVerdict === "pass" ? "pass" : "unknown",
            createdAt: text(detail.created_at),
            updatedAt: text(detail.updated_at),
            scheduledAt: text(detail.scheduled_at),
            publication,
            metrics,
            metricsObservedAt: observation.observedAt,
            metricsFetchedAt: observation.fetchedAt,
            viewsPerHour: rates.viewsPerHour,
            engagementPerHour: rates.engagementPerHour,
            origin: normalizeOrigin(detail.origin),
            analyzeEnabled: detail.analyze_enabled !== false,
            learnEnabled: detail.learn_enabled !== false,
            partCount: Math.max(1, parts.length),
        });
      }
      const bridgeStatus: ThreadsBridgeStatus = (
        contents.length === 0
        && manualPosts.length === 0
        && editorial.state === null
        && editorial.customerSummary === null
        && editorial.experiments.length === 0
      ) ? "HEALTHY_EMPTY" : "HEALTHY";
      return {
        connected: true,
        bridgeStatus,
        accountId,
        handle: text(summary.handle),
        displayName: text(summary.display_name),
        accountStatus: text(summary.account_status),
        fetchedAt,
        contents,
        manualPosts,
        metricsRecordCount: typeof pipeline?.n_metrics === "number" ? Math.max(0, pipeline.n_metrics) : 0,
        hasLearningSnapshot: pipeline?.has_learning_snapshot === true,
        operations,
        safety,
        editorial,
        message: customerMessage(bridgeStatus),
      };
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    return fallback(bridgeFailureStatus(error));
  }
}

const dashboardCache = new Map<string, { expiresAt: number; value: ThreadsDashboardData }>();
const dashboardPending = new Map<string, Promise<ThreadsDashboardData>>();
const accountsCached = new Map<string, { expiresAt: number; value: ThreadsAccountOption[] }>();
const accountsPending = new Map<string, Promise<ThreadsAccountOption[]>>();
const customerReviewCache = new Map<string, { expiresAt: number; value: CustomerReviewItem[] }>();

function tenantCacheKey(tenantUserId?: string): string {
  return tenantUserId ? `user:${tenantUserId}` : "legacy";
}

export function bridgeRequestHeaders(apiKey: string, tenantUserId?: string): Record<string, string> {
  const headers: Record<string, string> = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
  if (tenantUserId !== undefined) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._:@-]{0,199}$/.test(tenantUserId)) {
      throw new Error("invalid canonical tenant user ID");
    }
    headers["X-Threads-User-ID"] = tenantUserId;
  }
  return headers;
}

export async function getThreadsDashboard(accountId?: string, tenantUserId?: string): Promise<ThreadsDashboardData> {
  const accountKey = accountId ?? process.env.THREADS_DASHBOARD_ACCOUNT_ID ?? DEFAULT_ACCOUNT_ID;
  const key = `${tenantCacheKey(tenantUserId)}:${accountKey}`;
  const now = Date.now();
  const cached = dashboardCache.get(key);
  if (cached && cached.expiresAt > now) return cached.value;
  let pending = dashboardPending.get(key);
  if (!pending) {
    pending = loadThreadsDashboard({ accountId: accountKey, tenantUserId }).then((value) => {
      dashboardCache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value });
      return value;
    }).finally(() => { dashboardPending.delete(key); });
    dashboardPending.set(key, pending);
  }
  return pending;
}

export async function loadThreadsAccounts(options: {
  bridgeUrl?: string;
  apiKey?: string;
  tenantUserId?: string;
  timeoutMs?: number;
  fetcher?: FetchLike;
} = {}): Promise<ThreadsAccountOption[]> {
  try {
    const origin = safeOrigin(options.bridgeUrl ?? process.env.THREADS_BRIDGE_URL ?? DEFAULT_BRIDGE_URL);
    const apiKey = options.apiKey ?? process.env.THREADS_BRIDGE_API_KEY ?? "";
    if (!apiKey && !["127.0.0.1", "localhost", "::1", "[::1]"].includes(new URL(origin).hostname.toLowerCase())) {
      return [];
    }
    const headers = bridgeRequestHeaders(apiKey, options.tenantUserId);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 2_500);
    try {
      const payload: AccountsResponse = await getContractJson(
        options.fetcher ?? fetch, `${origin}/operator/accounts`, headers, controller.signal,
        parseAccountsResponseV1,
      );
      return payload.accounts.map(record).filter((row): row is Record<string, unknown> => row !== null)
        .map((row): ThreadsAccountOption | null => {
          const accountId = text(row.account_id);
          if (!accountId || !/^acct_[a-zA-Z0-9_-]+$/.test(accountId)) return null;
          return {
            accountId,
            handle: text(row.handle),
            displayName: text(row.display_name),
            accountStatus: text(row.account_status),
          };
        }).filter((row): row is ThreadsAccountOption => row !== null);
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return [];
  }
}

export async function getThreadsAccounts(tenantUserId?: string): Promise<ThreadsAccountOption[]> {
  const key = tenantCacheKey(tenantUserId);
  const now = Date.now();
  const cached = accountsCached.get(key);
  if (cached && cached.expiresAt > now) return cached.value;
  let pending = accountsPending.get(key);
  if (!pending) {
    pending = loadThreadsAccounts({ tenantUserId }).then((value) => {
      accountsCached.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value });
      return value;
    }).finally(() => { accountsPending.delete(key); });
    accountsPending.set(key, pending);
  }
  return pending;
}

export async function loadCustomerPendingReviews(options: {
  accountId: string;
  tenantUserId: string;
  bridgeUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
  fetcher?: FetchLike;
}): Promise<CustomerReviewItem[]> {
  const origin = safeOrigin(options.bridgeUrl ?? process.env.THREADS_BRIDGE_URL ?? DEFAULT_BRIDGE_URL);
  const apiKey = options.apiKey ?? process.env.THREADS_BRIDGE_API_KEY ?? "";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 2_500);
  try {
    const response = await (options.fetcher ?? fetch)(
      `${origin}/api/customer/content/pending?account_id=${encodeURIComponent(options.accountId)}`,
      { headers: bridgeRequestHeaders(apiKey, options.tenantUserId), signal: controller.signal },
    );
    if (!response.ok) throw new Error(`customer review load failed (${response.status})`);
    const payload = record(await response.json());
    const meta = record(payload?.meta);
    if (!payload || meta?.schema_version !== 1 || !Array.isArray(payload.items)) {
      throw new Error("invalid customer review contract");
    }
    return payload.items.map(record).filter((row): row is Record<string, unknown> => row !== null)
      .map((row): CustomerReviewItem | null => {
        const contentId = text(row.content_id), contentHash = text(row.content_hash);
        const version = nonNegativeInt(row.version);
        const body = text(row.body), topic = text(row.topic), role = text(row.content_role);
        const createdAt = text(row.created_at);
        if (!contentId || !contentHash || contentHash.length !== 64 || !version || !body || !topic || !role || !createdAt) return null;
        return {
          contentId, contentHash, version, body, topic, contentRole: role, createdAt,
          status: text(row.status) ?? "確認待ち",
          scheduledAt: text(row.scheduled_at),
          aiChanges: Array.isArray(row.ai_changes) ? row.ai_changes.map(text).filter((v): v is string => Boolean(v)) : [],
        };
      }).filter((row): row is CustomerReviewItem => row !== null);
  } finally {
    clearTimeout(timer);
  }
}

export async function getCustomerPendingReviews(
  accountId: string, tenantUserId: string,
): Promise<CustomerReviewItem[]> {
  const key = `${tenantCacheKey(tenantUserId)}:${accountId}`;
  const cached = customerReviewCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const value = await loadCustomerPendingReviews({ accountId, tenantUserId });
  customerReviewCache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value });
  return value;
}

export async function mutateCustomerReview(input: {
  action: CustomerReviewAction;
  accountId: string;
  contentId: string;
  version: number;
  contentHash: string;
  tenantUserId: string;
  reason?: string;
  feedback?: string;
  fetcher?: FetchLike;
}): Promise<void> {
  if (!/^[a-zA-Z0-9_-]+$/.test(input.contentId) || !/^[0-9a-f]{64}$/i.test(input.contentHash)) {
    throw new Error("invalid review binding");
  }
  const origin = safeOrigin(process.env.THREADS_BRIDGE_URL ?? DEFAULT_BRIDGE_URL);
  const apiKey = process.env.THREADS_BRIDGE_API_KEY ?? "";
  const response = await (input.fetcher ?? fetch)(`${origin}/api/customer/content/${encodeURIComponent(input.contentId)}/${input.action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...bridgeRequestHeaders(apiKey, input.tenantUserId) },
    body: JSON.stringify({
      account_id: input.accountId,
      expected_version: input.version,
      expected_content_hash: input.contentHash,
      request_id: `customer-${crypto.randomUUID()}`,
      human_confirmed: true,
      reason: input.reason,
      feedback: input.feedback,
    }),
  });
  if (!response.ok) {
    const error = new Error(`customer review mutation failed (${response.status})`);
    Object.assign(error, { status: response.status });
    throw error;
  }
  customerReviewCache.delete(`${tenantCacheKey(input.tenantUserId)}:${input.accountId}`);
  dashboardCache.delete(`${tenantCacheKey(input.tenantUserId)}:${input.accountId}`);
}

export async function configureManualPostPolicy(input: {
  accountId: string;
  detectionId: string;
  origin: ManualPostStatus["origin"];
  analyzeEnabled: boolean;
  learnEnabled: boolean;
  tenantUserId?: string;
}): Promise<void> {
  const accountId = input.accountId;
  if (!/^acct_[a-zA-Z0-9_-]+$/.test(accountId)
    || !/^[a-zA-Z0-9_-]+$/.test(input.detectionId)
    || !["ai_auto", "ai_manual", "human_manual"].includes(input.origin)
    || (input.learnEnabled && !input.analyzeEnabled)) {
    throw new Error("invalid manual post policy");
  }
  const bridgeOrigin = safeOrigin(process.env.THREADS_BRIDGE_URL ?? DEFAULT_BRIDGE_URL);
  const apiKey = process.env.THREADS_BRIDGE_API_KEY ?? "";
  const isLocal = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(new URL(bridgeOrigin).hostname.toLowerCase());
  if (!apiKey && !isLocal) throw new Error("bridge authentication is not configured");
  const response = await fetch(
    `${bridgeOrigin}/operator/accounts/${encodeURIComponent(accountId)}/manual-posts/${encodeURIComponent(input.detectionId)}/configure`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...bridgeRequestHeaders(apiKey, input.tenantUserId),
      },
      body: JSON.stringify({
        actor: "operator:ikorabu-dashboard",
        request_id: `ikorabu-${crypto.randomUUID()}`,
        origin: input.origin,
        analyze_enabled: input.analyzeEnabled,
        learn_enabled: input.learnEnabled,
      }),
    },
  );
  if (!response.ok) throw new Error(`manual policy update failed (${response.status})`);
  for (const key of dashboardCache.keys()) {
    if (key.endsWith(`:${accountId}`)) dashboardCache.delete(key);
  }
}
