import type { ArticleSummary } from "./content/types";
import { findSelectedImage } from "./generated-images";

const COVERS: Record<string, string> = {
  "jimu-mikeiken-mae": "cover-office-work",
  "pc-nigate-jimu": "cover-office-work",
  "sekkyaku-office": "cover-office-work",
  "agent-mendan-mae": "cover-experience-notes",
  "26sai-mikeiken": "cover-first-step",
  "news-saitei-chingin-2026": "cover-pay-holidays",
  "news-roudou-jouken-meiji": "cover-experience-notes",
  "butsuryu-soko-shigoto": "cover-warehouse",
  "driver-shigoto": "cover-driver",
  "fudousan-eigyo": "cover-housing",
  "news-ikuji-kaigo-2025-10": "cover-work-family",
  "news-koyou-hoken-kyufu-seigen": "cover-retirement-benefits",
  "news-koyou-hoken-tekiyou-kakudai": "cover-employment-insurance",
};
const CATEGORY_COVERS: Record<string, string> = {
  keiken: "cover-experience-notes",
  "shorui-mensetsu": "cover-experience-notes",
  hatarakikata: "cover-pay-holidays",
  junbi: "cover-first-step",
  mikeiken: "cover-first-step",
  shokushu: "cover-first-step",
  seido: "cover-retirement-benefits",
};

/** Short display copy does not replace the article's SEO title or body. */
export function articleCardTitle(article: Pick<ArticleSummary, "eyecatch" | "title">) {
  return article.eyecatch.join("").trim() || article.title;
}

/** Only selected local assets are used, including for social previews. */
export function articleCover(article: Pick<ArticleSummary, "slug" | "kind" | "categories">) {
  const slug = COVERS[article.slug] ?? (article.kind === "news" ? "cover-retirement-benefits" : CATEGORY_COVERS[article.categories[0]]);
  return slug ? findSelectedImage(slug) : null;
}
