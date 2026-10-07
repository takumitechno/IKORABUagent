/** 公開している全ページの URL（アーティファクト作成と静的書き出しで共通に使う） */
import type { ContentRepository } from "../src/lib/content/repository";
import { TAXONOMY, taxonomyPath, type TaxonomyGroup } from "../src/lib/taxonomy";

export const STATIC_ROUTES = ["/", "/articles", "/news", "/jobs", "/check", "/consultation", "/about", "/editorial-policy", "/disclosure", "/privacy", "/disclaimer", "/concerns", "/situations"];

export async function listSiteRoutes(repo: Pick<ContentRepository, "listArticles" | "listCategories">): Promise<string[]> {
  const [articles, categories] = await Promise.all([repo.listArticles(), repo.listCategories()]);
  return [
    ...STATIC_ROUTES,
    ...(["roles", "concerns", "situations"] as TaxonomyGroup[]).flatMap((g) => TAXONOMY[g].map((t) => taxonomyPath(g, t.slug))),
    ...categories.filter((c) => c.slug !== "news").map((c) => `/categories/${c.slug}`),
    ...articles.map((a) => (a.kind === "news" ? `/news/${a.slug}` : `/articles/${a.slug}`)),
  ];
}
