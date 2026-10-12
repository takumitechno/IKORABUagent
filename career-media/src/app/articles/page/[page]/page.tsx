import { notFound, permanentRedirect } from "next/navigation";
import { ArticleCatalogue, catalogueMetadata, type CatalogueSearchParams } from "@/components/ArticleCatalogue";
import { getRepository } from "@/lib/content";
import { ARTICLES_PER_PAGE, articlePagePath, parseArticlePage } from "@/lib/content-discovery";

type Props = { params: Promise<{ page: string }>; searchParams: CatalogueSearchParams };
export async function generateStaticParams() {
  const articles = await getRepository().listArticles();
  return Array.from({ length: Math.max(0, Math.ceil(articles.length / ARTICLES_PER_PAGE) - 1) }, (_, i) => ({ page: String(i + 2) }));
}
export async function generateMetadata({ params, searchParams }: Props) {
  const page = parseArticlePage((await params).page);
  return page ? catalogueMetadata({ page, searchParams }) : {};
}
export default async function ArticlePage({ params, searchParams }: Props) {
  const page = parseArticlePage((await params).page);
  if (!page) notFound();
  if (page === 1) {
    const { q } = await searchParams;
    permanentRedirect(articlePagePath(1, typeof q === "string" ? q.trim().slice(0, 100) : ""));
  }
  return <ArticleCatalogue page={page} searchParams={searchParams} />;
}
