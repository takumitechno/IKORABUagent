import type { Article, ArticleKind, ArticleSummary, Category } from "./types";

/**
 * フロントが依存するのはこの interface だけ。
 * 実装は local (content/*.md) と supabase (anon key + RLS) の2つ。
 * どちらも published かつ公開条件を満たすものしか返さない。
 */
export interface ContentRepository {
  listCategories(): Promise<Category[]>;
  listArticles(options?: { kind?: ArticleKind; category?: string; limit?: number; featured?: boolean }): Promise<ArticleSummary[]>;
  getArticle(slug: string): Promise<Article | null>;
  search(query: string): Promise<ArticleSummary[]>;
}

export function toSummary(article: Article): ArticleSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, researchNotes, ...rest } = article;
  return rest;
}

export function sortByNewest<T extends { publishedAt: string | null; updatedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt) || b.updatedAt.localeCompare(a.updatedAt));
}

/** 簡易検索: タイトル > 要約 > 本文 の順に重み付けして AND 検索する */
export function scoreMatch(article: Pick<Article, "title" | "summary" | "body">, query: string): number {
  const terms = query
    .normalize("NFKC")
    .toLowerCase()
    .split(/[\s　]+/)
    .filter(Boolean);
  if (terms.length === 0) return 0;
  const title = article.title.normalize("NFKC").toLowerCase();
  const summary = article.summary.normalize("NFKC").toLowerCase();
  const body = article.body.normalize("NFKC").toLowerCase();
  let score = 0;
  for (const term of terms) {
    let termScore = 0;
    if (title.includes(term)) termScore += 10;
    if (summary.includes(term)) termScore += 4;
    if (body.includes(term)) termScore += 1;
    if (termScore === 0) return 0;
    score += termScore;
  }
  return score;
}
