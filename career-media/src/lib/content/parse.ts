import matter from "gray-matter";
import { ARTICLE_STATUSES, type Article, type ArticleStatus, type Faq, type NewsMeta, type Source } from "./types";

/** content/*.md の frontmatter を Article に正規化する（pipeline からも使う） */

function toDate(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const s = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) throw new Error(`invalid date: ${s}`);
  return s.slice(0, 10);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v));
}

function toStatus(value: unknown): ArticleStatus {
  const s = String(value ?? "draft") as ArticleStatus;
  if (!ARTICLE_STATUSES.includes(s)) throw new Error(`invalid status: ${s}`);
  return s;
}

function toSources(value: unknown): Source[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw) => {
    const s = raw as Record<string, unknown>;
    return {
      title: String(s.title ?? ""),
      publisher: String(s.publisher ?? ""),
      url: String(s.url ?? ""),
      accessedAt: toDate(s.accessed_at) ?? "",
      usedFor: s.used_for ? String(s.used_for) : undefined,
    };
  });
}

function toFaq(value: unknown): Faq[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw) => {
    const f = raw as Record<string, unknown>;
    return { question: String(f.q ?? ""), answer: String(f.a ?? "") };
  });
}

function toNews(value: unknown): NewsMeta | undefined {
  if (!value || typeof value !== "object") return undefined;
  const n = value as Record<string, unknown>;
  return {
    announcedBy: String(n.announced_by ?? ""),
    announcedAt: toDate(n.announced_at) ?? "",
    whatHappened: String(n.what_happened ?? ""),
    whoIsAffected: String(n.who_is_affected ?? ""),
    impactForCareerChangers: String(n.impact_for_career_changers ?? ""),
    unknowns: toStringArray(n.unknowns),
    whatToCheck: toStringArray(n.what_to_check),
  };
}

export function parseArticleFile(raw: string, fileSlug: string): Article {
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? fileSlug);
  const updatedAt = toDate(data.updated_at) ?? toDate(data.published_at);
  if (!updatedAt) throw new Error(`${slug}: updated_at is required`);
  return {
    slug,
    kind: data.kind === "news" ? "news" : "article",
    title: String(data.title ?? ""),
    summary: String(data.summary ?? ""),
    body: content.trim(),
    status: toStatus(data.status),
    categories: toStringArray(data.categories),
    featured: Boolean(data.featured),
    publishedAt: toDate(data.published_at),
    updatedAt,
    reviewedAt: toDate(data.reviewed_at),
    reviewedBy: data.reviewed_by ? String(data.reviewed_by) : null,
    informationCheckedAt: toDate(data.information_checked_at),
    seoTitle: data.seo_title ? String(data.seo_title) : undefined,
    seoDescription: data.seo_description ? String(data.seo_description) : undefined,
    related: toStringArray(data.related),
    roles: toStringArray(data.roles),
    concerns: toStringArray(data.concerns),
    situations: toStringArray(data.situations),
    eyecatch: toStringArray(data.eyecatch).map((l) => l.trim()).filter(Boolean),
    recommended: Boolean(data.recommended),
    faq: toFaq(data.faq),
    sources: toSources(data.sources),
    news: toNews(data.news),
    researchNotes: data.research_notes,
  };
}

/**
 * 公開してよいかの判定。DB 側の CHECK 制約 / RLS と同じ条件にそろえる。
 * 「本文がある＝公開可能」にはしない。
 */
export function isPubliclyVisible(article: Pick<Article, "status" | "publishedAt" | "reviewedAt" | "informationCheckedAt" | "sources">, today = new Date()): boolean {
  if (article.status !== "published") return false;
  if (!article.publishedAt || !article.reviewedAt || !article.informationCheckedAt) return false;
  if (article.sources.length === 0) return false;
  return article.publishedAt <= today.toISOString().slice(0, 10);
}
