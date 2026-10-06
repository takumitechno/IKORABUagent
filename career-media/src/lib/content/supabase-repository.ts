import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isPubliclyVisible } from "./parse";
import { applyListOptions, sortByNewest, toSummary, type ContentRepository } from "./repository";
import type { Article, Category } from "./types";

/**
 * Supabase 版。anon key のみを使い、published 以外・research_notes は
 * RLS と列権限 (supabase/migrations) で読めないようにしている。
 * service role key はこのアプリでは一切使わない。
 */

const ARTICLE_COLUMNS = [
  "slug",
  "kind",
  "title",
  "summary",
  "body_md",
  "status",
  "featured",
  "published_at",
  "updated_at",
  "reviewed_at",
  "reviewed_by",
  "information_checked_at",
  "seo_title",
  "seo_description",
  "related_slugs",
  "roles",
  "concerns",
  "situations",
  "eyecatch",
  "illustration",
  "recommended",
  "faq",
  "news_meta",
  "article_categories(is_primary,categories(slug))",
  "article_sources(title,publisher,url,accessed_at,used_for,sort_order)",
].join(",");

type Row = Record<string, unknown>;

function date(v: unknown): string | null {
  return v ? String(v).slice(0, 10) : null;
}

export function mapArticleRow(row: Row): Article {
  const cats = ((row.article_categories as Row[] | null) ?? [])
    .slice()
    .sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)))
    .map((ac) => String((ac.categories as Row | null)?.slug ?? ""))
    .filter(Boolean);
  const sources = ((row.article_sources as Row[] | null) ?? [])
    .slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((s) => ({
      title: String(s.title),
      publisher: String(s.publisher),
      url: String(s.url),
      accessedAt: date(s.accessed_at) ?? "",
      usedFor: s.used_for ? String(s.used_for) : undefined,
    }));
  const news = row.news_meta as Record<string, unknown> | null;
  return {
    slug: String(row.slug),
    kind: row.kind === "news" ? "news" : "article",
    title: String(row.title),
    summary: String(row.summary ?? ""),
    body: String(row.body_md ?? ""),
    status: row.status as Article["status"],
    categories: cats,
    featured: Boolean(row.featured),
    publishedAt: date(row.published_at),
    updatedAt: date(row.updated_at) ?? "",
    reviewedAt: date(row.reviewed_at),
    reviewedBy: row.reviewed_by ? String(row.reviewed_by) : null,
    informationCheckedAt: date(row.information_checked_at),
    seoTitle: row.seo_title ? String(row.seo_title) : undefined,
    seoDescription: row.seo_description ? String(row.seo_description) : undefined,
    related: (row.related_slugs as string[] | null) ?? [],
    roles: (row.roles as string[] | null) ?? [],
    concerns: (row.concerns as string[] | null) ?? [],
    situations: (row.situations as string[] | null) ?? [],
    eyecatch: (row.eyecatch as string[] | null) ?? [],
    illustration: (row.illustration as string | null) ?? null,
    recommended: Boolean(row.recommended),
    faq: ((row.faq as Array<{ q: string; a: string }> | null) ?? []).map((f) => ({ question: f.q, answer: f.a })),
    sources,
    news: news
      ? {
          announcedBy: String(news.announced_by ?? ""),
          announcedAt: date(news.announced_at) ?? "",
          whatHappened: String(news.what_happened ?? ""),
          whoIsAffected: String(news.who_is_affected ?? ""),
          impactForCareerChangers: String(news.impact_for_career_changers ?? ""),
          unknowns: (news.unknowns as string[]) ?? [],
          whatToCheck: (news.what_to_check as string[]) ?? [],
        }
      : undefined,
  };
}

export class SupabaseContentRepository implements ContentRepository {
  private readonly client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey, { auth: { persistSession: false } });
  }

  async listCategories(): Promise<Category[]> {
    const { data, error } = await this.client.from("categories").select("slug,name,description,icon,sort_order").order("sort_order");
    if (error) throw error;
    return (data ?? []).map((c) => ({ slug: c.slug, name: c.name, description: c.description, icon: c.icon, sortOrder: c.sort_order }));
  }

  private async fetchPublished(): Promise<Article[]> {
    const { data, error } = await this.client.from("articles").select(ARTICLE_COLUMNS).eq("status", "published").order("published_at", { ascending: false });
    if (error) throw error;
    // RLS で既に絞っているが、アプリ側でも同じ公開条件を二重に確認する
    return sortByNewest(((data ?? []) as unknown as Row[]).map(mapArticleRow).filter((a) => isPubliclyVisible(a)));
  }

  async listArticles(options: Parameters<ContentRepository["listArticles"]>[0] = {}) {
    const items = await this.fetchPublished();
    return applyListOptions(items, options).map(toSummary);
  }

  async getArticle(slug: string) {
    const { data, error } = await this.client.from("articles").select(ARTICLE_COLUMNS).eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const article = mapArticleRow(data as unknown as Row);
    return isPubliclyVisible(article) ? article : null;
  }

  async search(query: string) {
    const { data, error } = await this.client.rpc("search_articles", { q: query });
    if (error) throw error;
    const order = ((data ?? []) as Array<{ slug: string }>).map((r) => r.slug);
    if (order.length === 0) return [];
    const all = await this.fetchPublished();
    return order.map((slug) => all.find((a) => a.slug === slug)).filter((a): a is Article => Boolean(a)).map(toSummary);
  }
}
