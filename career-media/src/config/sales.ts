import { partner } from "./partner";

/**
 * 商談用ページ（/sales: Instagram 投稿案・提案書・計測設計）を出すかどうか。
 * 読者向けのメディアとは分ける。SALES_DEMO=1 で起動したローカルのデモだけで表示し、
 * 通常のビルド（npm run build）では 404 になる。sitemap にも載せない。
 */
export const salesDemoEnabled = process.env.SALES_DEMO === "1";

/** 商談資料での呼びかけ（提携候補企業の名前は partner config から作る） */
export const salesAddressee = partner.profile === "makecareer" ? `${partner.brandName}様` : "御社";
