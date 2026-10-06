/**
 * コンテンツのドメイン型。
 * DB (supabase/migrations) と content/*.md の frontmatter はこの型に正規化される。
 *
 * 公開判定は status で明示する。本文があることは公開可能を意味しない。
 */
export const ARTICLE_STATUSES = ["draft", "review", "published", "archived"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export type ArticleKind = "article" | "news";

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
};

export type Source = {
  title: string;
  publisher: string;
  url: string;
  /** 情報を確認した日 (YYYY-MM-DD) */
  accessedAt: string;
  /** 記事のどの主張に使ったか */
  usedFor?: string;
};

export type Faq = { question: string; answer: string };

/** ニュースハブ用の構造。全文転載はせず、自社解説を主にする */
export type NewsMeta = {
  announcedBy: string;
  announcedAt: string;
  whatHappened: string;
  whoIsAffected: string;
  impactForCareerChangers: string;
  unknowns: string[];
  whatToCheck: string[];
};

export type Article = {
  slug: string;
  kind: ArticleKind;
  title: string;
  summary: string;
  /** Markdown 本文 */
  body: string;
  status: ArticleStatus;
  categories: string[];
  featured: boolean;
  publishedAt: string | null;
  updatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  informationCheckedAt: string | null;
  seoTitle?: string;
  seoDescription?: string;
  related: string[];
  /** 入口タグ（src/lib/taxonomy.ts の slug） */
  roles: string[];
  concerns: string[];
  situations: string[];
  /** カードのアイキャッチに出す短い文言（1〜2行） */
  eyecatch: string[];
  /** カードのイラストを明示したいときだけ指定（src/lib/illustrations/motifs.ts の名前）。なければタグから決まる */
  illustration?: string | null;
  /** 編集部おすすめ（閲覧数ではなく編集判断） */
  recommended: boolean;
  faq: Faq[];
  sources: Source[];
  news?: NewsMeta;
  /** 調査メモ（出典の引用など）。公開ページには出さない */
  researchNotes?: unknown;
};

export type ArticleSummary = Omit<Article, "body" | "researchNotes">;
