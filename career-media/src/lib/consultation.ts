import { liveOutboundEnabled, partner, type PartnerConfig } from "@/config/partner";

/** CTA を設置した場所。計測（utm_content / cta_placement）で導線ごとの効果を比較するために使う */
export type CtaPlacement =
  | "header"
  | "home-hero"
  | "home-band"
  | "home-consult"
  | "article-inline"
  | "article-bottom"
  | "article-sidebar"
  | "article-sticky"
  | "news-bottom"
  | "journey"
  | "home-journeys"
  | "jobs"
  | "check-result"
  | "consultation-page"
  | "footer";

/** 本番送客が無効なときに相談ボタンが向かう、サイト内の説明ページ */
export const CONSULTATION_APPLY_PATH = "/consultation/apply";

/**
 * 相談の申し込みボタンのリンク先を作る。URL の正本は partner config のみ。
 *
 * - 本番送客が有効（liveOutboundEnabled）なときだけ、提携先の申込ページに utm_* を付けて返す。
 * - それ以外（中立デモ・商談用プレビュー）は、サイト内の説明ページ /consultation/apply を返す。
 *   リンク先そのものがサイト内なので、クリックの横取り（JavaScript）に頼らずに本番の申込フォームへ出ない。
 */
export function consultationHref(
  placement: CtaPlacement,
  contentSlug: string | undefined,
  config: PartnerConfig,
  env: Record<string, string | undefined>,
): string {
  const content = contentSlug ? `${placement}__${contentSlug}` : placement;
  if (!liveOutboundEnabled(config, env) || !config.liveConsultationUrl) {
    return `${CONSULTATION_APPLY_PATH}?${new URLSearchParams({ placement: content }).toString()}`;
  }
  const url = new URL(config.liveConsultationUrl);
  url.searchParams.set("utm_source", "owned_media");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", config.campaignId);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

/** 画面で使う相談ボタンのリンク先（現在の partner config と環境変数で判定） */
export function buildConsultationUrl(placement: CtaPlacement, contentSlug?: string): string {
  return consultationHref(placement, contentSlug, partner, process.env);
}

/** リンクが外部（提携先の申込ページ）へ出るかどうか */
export const isExternalConsultationUrl = (href: string) => /^https?:\/\//.test(href);
