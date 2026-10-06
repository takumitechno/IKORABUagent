import { partner } from "@/config/partner";

/** CTA を設置した場所。計測（utm_content）で導線ごとの効果を比較するために使う */
export type CtaPlacement =
  | "header"
  | "home-hero"
  | "home-band"
  | "article-inline"
  | "article-bottom"
  | "article-sidebar"
  | "news-bottom"
  | "jobs"
  | "check-result"
  | "consultation-page"
  | "footer";

/**
 * 相談先URLを組み立てる。URLの正本は partner config のみ。
 * 既存クエリは保持し、utm_* を付与する。
 */
export function buildConsultationUrl(placement: CtaPlacement, contentSlug?: string): string {
  const url = new URL(partner.consultationUrl);
  url.searchParams.set("utm_source", "owned_media");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", partner.campaignId);
  url.searchParams.set("utm_content", contentSlug ? `${placement}__${contentSlug}` : placement);
  return url.toString();
}
