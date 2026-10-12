import { notFound, permanentRedirect } from "next/navigation";
import { FeatureCard } from "@/components/ArticleCards";
import { ArticleDirectory } from "@/components/ArticleDirectory";
import { PageHero } from "@/components/PageHero";
import { pickStartArticles } from "@/lib/content-discovery";
import { ConsultationCta } from "@/components/ConsultationCta";
import { getRepository } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getRepository().listCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export const revalidate = 600;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = (await getRepository().listCategories()).find((c) => c.slug === slug);
  if (!category) return {};
  return pageMetadata({ title: `${category.name}の記事一覧`, description: category.description, path: `/categories/${slug}` });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "news") permanentRedirect("/news");
  const repo = getRepository();
  const categories = await repo.listCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const articles = await repo.listArticles({ category: slug });
  const top = pickStartArticles(articles, `/categories/${slug}`);
  const rest = articles.filter((a) => !top.some((start) => start.slug === a.slug));

  return (
    <>
      <PageHero
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "記事一覧", path: "/articles" },
          { name: category.name, path: `/categories/${slug}` },
        ]}
        eyebrow={`${articles.length}本の記事`}
        title={category.name}
        lead={category.description}
        icon={category.icon}
      />
    <div className="mx-auto max-w-6xl px-4 pt-2 sm:px-6">
      <nav aria-label="ほかのテーマ" className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={c.slug === "news" ? "/news" : `/categories/${c.slug}`}
            aria-current={c.slug === slug ? "page" : undefined}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 ${c.slug === slug ? "bg-night text-white ring-night" : "bg-surface text-body ring-line hover:text-brand-strong"}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {articles.length > 0 ? <>
            <h2 className="mb-4 text-lg font-bold text-ink">まず読むなら、この{top.length}本</h2>
            <ul className="swipe md-grid" style={{ ["--cols" as string]: 3 }}>{top.map((a) => <li key={a.slug}><FeatureCard article={a} categories={categories} showSummary={false} /></li>)}</ul>
            {rest.length > 0 && <section aria-label="このテーマの関連記事" className="mt-8"><h2 className="mb-3 text-base font-bold text-ink">もう少し調べたいこと <span className="text-sm font-normal text-muted">{rest.length}本</span></h2><ArticleDirectory articles={rest} /></section>}
          </> : <p className="py-10 text-center text-sm text-muted">このテーマの記事は準備中です。</p>}
        </div>
        <aside>
          <ConsultationCta placement="article-sidebar" variant="compact" />
        </aside>
      </div>
    </div>
    </>
  );
}
