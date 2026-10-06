import type { TaxonomyGroup } from "../taxonomy";
import { MOTIF_NAMES, type MotifName } from "./motifs";

/** 入口（職種・悩み・状況）ごとのイラスト。同じ入口の中では重ならないようにしている */
export const TAXONOMY_SCENE: Record<TaxonomyGroup, Record<string, MotifName>> = {
  roles: { eigyo: "briefcase", jimu: "desk", "customer-support": "headset", "it-support": "monitor", jinji: "people", hanbai: "shop", sonota: "compass" },
  concerns: { kyuryo: "coins", donichi: "calendar", office: "building", seishain: "badge", "mikeiken-shokushu": "stairs", yametai: "door", mensetsu: "interview", yaritai: "compass" },
  situations: { freeter: "clock", haken: "idcard", "seishain-keiken-sukunai": "badge", sekkyaku: "shop", dainishinsotsu: "graduation", hajimete: "flag", kaisu: "list", "pc-mikeiken": "laptop" },
};

export const CATEGORY_SCENE: Record<string, MotifName> = {
  mikeiken: "stairs",
  shokushu: "briefcase",
  keiken: "star",
  "shorui-mensetsu": "interview",
  hatarakikata: "coins",
  junbi: "checklist",
  news: "newspaper",
};

/** 職種比較ページの4職種 */
export const JOB_ROLE_SCENE: Record<string, MotifName> = {
  "hojin-eigyo": "briefcase",
  "customer-support": "headset",
  "it-support": "monitor",
  jimu: "desk",
};

export function taxonomyScene(group: TaxonomyGroup, slug: string): MotifName {
  return TAXONOMY_SCENE[group][slug] ?? "flag";
}

export function categoryScene(slug: string | undefined): MotifName {
  return (slug && CATEGORY_SCENE[slug]) || "flag";
}

export const isMotifName = (name: unknown): name is MotifName => typeof name === "string" && (MOTIF_NAMES as string[]).includes(name);

/** 記事のイラスト: frontmatter の illustration → 職種 → 悩み → 状況 → カテゴリの順に、最初に当てはまるもの */
export function articleScene(article: { roles: string[]; concerns: string[]; situations: string[]; categories: string[]; illustration?: string | null }): MotifName {
  if (isMotifName(article.illustration)) return article.illustration;
  const role = article.roles[0];
  if (role && TAXONOMY_SCENE.roles[role]) return TAXONOMY_SCENE.roles[role];
  const concern = article.concerns[0];
  if (concern && TAXONOMY_SCENE.concerns[concern]) return TAXONOMY_SCENE.concerns[concern];
  const situation = article.situations[0];
  if (situation && TAXONOMY_SCENE.situations[situation]) return TAXONOMY_SCENE.situations[situation];
  return categoryScene(article.categories[0]);
}
