import { partner } from "./partner";

/**
 * メディア自体の設定。名前は partner config（ブランドの正本）から作る。
 * ブランド色は src/app/globals.css の :root トークンが正本。
 * TODO(正式公開前にMakeCareer確認が必要): メディア名・ロゴ・ブランドカラーの確定
 */
const sameBrand = partner.brandName === partner.mediaName;

export const site = {
  name: partner.mediaName,
  /** ロゴ横・title などで使うフル表記 */
  fullName: sameBrand ? partner.mediaName : `${partner.mediaName} by ${partner.brandName}`,
  tagline: partner.mediaTagline,
  description:
    "はじめての転職・未経験転職で迷っている20代のための仕事選びメディア。仕事の種類、給料や休みの見方、経験の活かし方を、むずかしい言葉なしで一つずつ整理できます。",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "ja_JP",
  /**
   * 正式な提携・ブランド利用許諾が済むまでは index させない。
   * SITE_INDEXABLE=true かつ partner.brandUsageApproved=true の両方が必要。
   */
  indexable: process.env.SITE_INDEXABLE === "true" && partner.brandUsageApproved,
  /** 提案用プレビューであることを画面上部に表示する */
  showPreviewBanner: !partner.brandUsageApproved,
  /**
   * 掲載記事が提案用のサンプル原稿か（人による最終確認・公開承認の前）。
   * true の間は「公開日」ではなく「作成日」と表示し、記事ごとにサンプル原稿であることを示す。
   */
  sampleContent: !partner.brandUsageApproved,
  editorialTeam: sameBrand ? `${partner.mediaName}編集部` : `${partner.brandName} 編集部`,
} as const;

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
