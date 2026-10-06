import { partner } from "./partner";

/**
 * メディア自体の設定。ブランド色は src/app/globals.css の :root トークンが正本。
 * TODO(正式公開前にMakeCareer確認が必要): メディア名・ロゴ・ブランドカラーの確定
 */
export const site = {
  name: "未経験転職ノート",
  /** ロゴ横・title などで使うフル表記 */
  fullName: `未経験転職ノート by ${partner.brandName}`,
  tagline: "調べて、比べて、整理して。未経験からの転職を、自分のペースで。",
  description:
    "未経験からの転職を考える20代のための情報メディア。仕事の種類や働き方の違い、経験の活かし方を調べ、希望条件を整理し、必要ならキャリアアドバイザーに相談できます。",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "ja_JP",
  /**
   * 正式な提携・ブランド利用許諾が済むまでは index させない。
   * SITE_INDEXABLE=true かつ partner.brandUsageApproved=true の両方が必要。
   */
  indexable: process.env.SITE_INDEXABLE === "true" && partner.brandUsageApproved,
  /** 提案用プレビューであることを画面上部に表示する */
  showPreviewBanner: !partner.brandUsageApproved,
  editorialTeam: `${partner.brandName} 編集部`,
} as const;

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
