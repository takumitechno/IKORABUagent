import type { ArticleSummary } from "./content/types";
import { journeyForHub } from "./journeys";

export const ARTICLES_PER_PAGE = 18;
export const MIN_HUB_ARTICLES = 3;

export function articlePagePath(page: number, query = "") {
  const path = page === 1 ? "/articles" : `/articles/page/${page}`;
  return query ? `${path}?${new URLSearchParams({ q: query })}` : path;
}

export function parseArticlePage(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

export const READING_STARTS = [
  { label: "接客からオフィスワークへ", slug: "sekkyaku-keiken-ikasu", detail: "接客経験を応募書類に書く" },
  { label: "給料も、土日休みも大事", slug: "donichi-yasumi-nenshu-hikaku", detail: "給与と休日を比較する" },
  { label: "フリーターから初めての転職", slug: "freeter-seishain-hajimeni", detail: "正社員を目指す準備を知る" },
];

const CATEGORY_STARTS: Record<string, string[]> = {
  mikeiken: ["mikeiken-tenshoku-hajimekata", "freeter-seishain-hajimeni", "jimu-mikeiken-mae"],
  junbi: ["mikeiken-tenshoku-hajimekata", "agent-mendan-mae", "nenshu-dake-erabanai"],
  shokushu: ["sekkyaku-office", "jimu-mikeiken-mae", "web-marketing-mikeiken"],
  keiken: ["sekkyaku-keiken-ikasu", "shokumu-keirekisho-arubaito", "sekkyaku-office"],
  hatarakikata: ["donichi-yasumi-nenshu-hikaku", "tedori-20man-hikaku", "nenshu-dake-erabanai"],
  seido: ["koteizangyo-kyujin", "naitei-shodaku-mae", "tenshoku-nenmatsu-chosei"],
  "shorui-mensetsu": ["shokumu-keirekisho-arubaito", "agent-mendan-mae", "rirekisho-kakukoto-nai"],
};
const HUB_STARTS: Record<string, string[]> = {
  "/situations/hajimete": ["mikeiken-tenshoku-hajimekata", "agent-mendan-mae", "tenshoku-agent-merit"],
  "/jobs/jimu": ["jimu-mikeiken-mae", "sekkyaku-office", "pc-nigate-jimu"],
  "/concerns/mensetsu": ["shokumu-keirekisho-arubaito", "agent-mendan-mae", "rirekisho-kakukoto-nai"],
};

/** 最新日だけで選ばず、入口に対応する読み順から3本を選ぶ。タグ外の記事は混ぜない。 */
export function pickStartArticles(articles: ArticleSummary[], path: string) {
  const journey = journeyForHub(path);
  const preferred = journey
    ? journey.steps.flatMap((step) => step.kind === "article" ? [step.slug] : [])
    : path.startsWith("/categories/") ? CATEGORY_STARTS[path.slice(12)] ?? [] : HUB_STARTS[path] ?? [];
  const ordered = [...preferred.flatMap((slug) => articles.filter((a) => a.slug === slug)), ...articles];
  return ordered.filter((a, i) => ordered.findIndex((other) => other.slug === a.slug) === i).slice(0, 3);
}

export function latestArticleDate(articles: ArticleSummary[]) {
  return articles.length ? articles.reduce((latest, a) => a.updatedAt > latest ? a.updatedAt : latest, articles[0].updatedAt) : undefined;
}
