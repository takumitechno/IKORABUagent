/**
 * 計測イベントの定義（サイトが自分で記録するもの / 提携先から返してもらうもの）。
 *
 * - 今は本番の解析ツール（GA4・GTM・各種ピクセル・CRM・提携先 API）にはつながない。
 *   サイトのイベントはブラウザの中（window.__careerMediaEvents）に積むだけで、どこにも送信しない。
 * - 将来 IKORABU などで集計するときは、この形のまま受け取れるようにしておく（schema_version で互換性を管理）。
 * - 氏名・連絡先・自由記述・条件整理チェックの回答（生の回答）は、どのイベントにも入れない。
 *   イベントに入れてよい項目は CONTEXT_KEYS に列挙したものだけ（buildEvent がそれ以外を捨てる）。
 * - 登録・予約・面談などの成果は、サイト（フロントエンド）からは絶対に発火しない。
 *   正式提携後に、提携先から返してもらうデータ（PARTNER_RETURN_EVENTS）として扱う。
 */

export const SCHEMA_VERSION = "2026-10-v1";

/** サイトが自分で記録するイベント */
export const SITE_EVENTS = ["article_view", "site_search_result_clicked", "check_started", "check_completed", "cta_clicked", "partner_outbound"] as const;
export type SiteEventName = (typeof SITE_EVENTS)[number];

/** 提携先から返してもらう成果（フロントエンドで発火してはいけない） */
export const PARTNER_RETURN_EVENTS = ["partner_registered", "meeting_reserved", "meeting_completed", "meeting_approved", "meeting_rejected"] as const;
export type PartnerReturnEventName = (typeof PARTNER_RETURN_EVENTS)[number];

export type PageType = "home" | "article" | "news" | "hub" | "jobs" | "check" | "consultation" | "info" | "list" | "search" | "other";

/** イベントに入れてよい項目（これ以外は捨てる） */
export const CONTEXT_KEYS = [
  "page_type",
  "page_path",
  "content_id",
  "content_slug",
  "content_version",
  "theme_cluster",
  "pattern_id",
  "cta_placement",
  "cta_kind",
  "target_path",
  "result_position",
  "check_version",
] as const;
export type ContextKey = (typeof CONTEXT_KEYS)[number];
export type EventContext = Partial<Record<ContextKey, string | number>>;

/** セッション単位の属性（流入元）。ページを見るたびに SNS 訪問として数えないよう、セッションの最初に1回だけ決める */
export type SessionAttributes = {
  /** タブごとのランダムな ID（個人を特定しない。sessionStorage に置き、タブを閉じると消える） */
  session_id: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  /** utm_content（SNS 投稿の pattern など） */
  content: string | null;
  /** utm が無いときの参照元のホスト名（パスやクエリは持たない） */
  referrer_host: string | null;
  landing_path: string;
  started_at: string;
};

export type SiteEvent = {
  schema_version: string;
  event_id: string;
  event_name: SiteEventName;
  occurred_at: string;
  /** demo: 本番送客なし / live: 本番送客あり */
  mode: "demo" | "live";
  session: SessionAttributes;
  context: EventContext;
};

/** 許可された項目だけを残してイベントを作る（回答や個人情報が紛れ込まないように） */
export function buildEvent(name: SiteEventName, context: Record<string, unknown>, session: SessionAttributes, mode: "demo" | "live", now = new Date(), id = randomId()): SiteEvent {
  if (!(SITE_EVENTS as readonly string[]).includes(name)) throw new Error(`サイトから発火できないイベントです: ${name}`);
  const clean: EventContext = {};
  for (const key of CONTEXT_KEYS) {
    const value = context[key];
    if (typeof value === "number" && Number.isFinite(value)) clean[key] = value;
    else if (typeof value === "string" && value.length > 0) clean[key] = value.slice(0, 200);
  }
  return { schema_version: SCHEMA_VERSION, event_id: id, event_name: name, occurred_at: now.toISOString(), mode, session, context: clean };
}

export function randomId(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** URL の utm_* と参照元から、セッションの流入元を決める（パス・クエリ・個人情報は持たない） */
export function sessionFromLocation(href: string, referrer: string, now = new Date(), id = randomId()): SessionAttributes {
  const url = new URL(href);
  const p = url.searchParams;
  let referrerHost: string | null = null;
  try {
    const r = referrer ? new URL(referrer) : null;
    referrerHost = r && r.host !== url.host ? r.host : null;
  } catch {
    referrerHost = null;
  }
  const pick = (k: string) => {
    const v = p.get(k);
    return v && /^[\w.\-~:+]{1,100}$/.test(v) ? v : null;
  };
  return {
    session_id: id,
    source: pick("utm_source"),
    medium: pick("utm_medium"),
    campaign: pick("utm_campaign"),
    content: pick("utm_content"),
    referrer_host: referrerHost,
    landing_path: url.pathname,
    started_at: now.toISOString(),
  };
}

/** SNS からのセッションか（page view ごとではなく、セッションの属性として判定する） */
export function isSnsSession(session: Pick<SessionAttributes, "source" | "medium" | "referrer_host">): boolean {
  const sns = /instagram|tiktok|threads|twitter|x\.com|t\.co|facebook|line/i;
  return (session.medium ?? "").toLowerCase() === "social" || sns.test(session.source ?? "") || sns.test(session.referrer_host ?? "");
}

type FieldDoc = { field: string; description: string };
export type EventDoc = { name: string; owner: "site" | "partner"; trigger: string; context: string[]; notes: string };

/** イベント辞書（docs/sales/MEASUREMENT_SPEC.md と event-dictionary.csv の正本） */
export const EVENT_DICTIONARY: EventDoc[] = [
  { name: "article_view", owner: "site", trigger: "記事・ニュース解説のページを表示したとき（1ページ1回）", context: ["page_type", "page_path", "content_id", "content_slug", "content_version", "theme_cluster", "pattern_id"], notes: "SNS 訪問かどうかはセッション属性で判定する（page view ごとに数えない）" },
  { name: "site_search_result_clicked", owner: "site", trigger: "記事検索の結果をクリックしたとき", context: ["page_type", "target_path", "result_position"], notes: "検索語（自由入力）はイベントに入れない" },
  { name: "check_started", owner: "site", trigger: "条件整理チェックで最初の回答を選んだとき（1回）", context: ["page_type", "check_version", "pattern_id"], notes: "回答の中身は入れない" },
  { name: "check_completed", owner: "site", trigger: "条件整理チェックの結果を表示したとき", context: ["page_type", "check_version", "pattern_id"], notes: "回答の中身・結果の中身は入れない" },
  { name: "cta_clicked", owner: "site", trigger: "data-cta-kind を持つボタン・リンクを押したとき", context: ["page_type", "page_path", "content_slug", "cta_placement", "cta_kind", "pattern_id", "target_path"], notes: "cta_kind: consultation-apply / consultation-info / check / journey-step / journey-start" },
  { name: "partner_outbound", owner: "site", trigger: "本番送客が有効なときに、提携先の申込ページへのリンクを押したとき", context: ["page_type", "page_path", "content_slug", "cta_placement", "pattern_id"], notes: "デモ（本番送客なし）では発生しない。申込の完了ではない" },
  { name: "partner_registered", owner: "partner", trigger: "提携先で登録が完了した（提携先が判定）", context: [], notes: "提携先から返してもらう。サイトでは発火しない" },
  { name: "meeting_reserved", owner: "partner", trigger: "面談の予約が入った（提携先が判定）", context: [], notes: "同上" },
  { name: "meeting_completed", owner: "partner", trigger: "面談を実施した（提携先が判定）", context: [], notes: "同上。No Show は completed にしない" },
  { name: "meeting_approved", owner: "partner", trigger: "成果条件を満たす面談として承認された（提携先が判定）", context: [], notes: "成果報酬の対象になりうる。条件・期限は正式契約で決める" },
  { name: "meeting_rejected", owner: "partner", trigger: "成果条件を満たさないと判定された（重複・既登録・対象外など）", context: [], notes: "否認理由のコードを返してもらう" },
];

export const SESSION_FIELDS: FieldDoc[] = [
  { field: "session_id", description: "タブごとのランダム ID（sessionStorage。個人を特定しない）" },
  { field: "source / medium / campaign / content", description: "URL の utm_* から（例: instagram / social / pilot-2026q4 / theme-a-carousel）" },
  { field: "referrer_host", description: "utm がないときの参照元ホスト名のみ" },
  { field: "landing_path", description: "セッション最初のページのパス（クエリは持たない）" },
];
