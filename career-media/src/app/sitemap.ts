import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getRepository } from "@/lib/content";
import { articlePath } from "@/lib/seo";
import { TAXONOMY, taxonomyPath, type TaxonomyGroup } from "@/lib/taxonomy";

export const revalidate = 600;

/** sitemap に載せる入口ページの記事数の下限 */
const MIN_HUB_ARTICLES = 3;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getRepository();
  const [articles, categories] = await Promise.all([repo.listArticles(), repo.listCategories()]);
  const latest = articles.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), "2026-01-01");

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/articles"), lastModified: latest, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/news"), lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/jobs"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/concerns"), lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/situations"), lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/check"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/consultation"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/editorial-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/disclosure"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug !== "news")
    .map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), lastModified: latest, changeFrequency: "weekly" as const, priority: 0.6 }));

  // 公開済み (published) の記事だけ。draft / review は repository が返さない
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(articlePath(a)),
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: a.kind === "news" ? 0.6 : 0.7,
  }));

  // 入口ページ（職種 / 悩み / 今の状況）。記事が少ない入口（内容の薄いページ）は載せない。ページ自体は残し、サイト内からは開ける
  const hubPages: MetadataRoute.Sitemap = (["roles", "concerns", "situations"] as TaxonomyGroup[]).flatMap((group) =>
    TAXONOMY[group]
      .filter((t) => articles.filter((a) => a[group].includes(t.slug)).length >= MIN_HUB_ARTICLES)
      .map((t) => ({ url: absoluteUrl(taxonomyPath(group, t.slug)), lastModified: latest, changeFrequency: "weekly" as const, priority: 0.6 })),
  );

  return [...staticPages, ...categoryPages, ...hubPages, ...articlePages];
}
