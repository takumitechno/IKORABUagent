import { notFound } from "next/navigation";
import { ArticleList } from "@/components/ArticleCards";
import { PageHero } from "@/components/PageHero";
import { categoryTone } from "@/components/CategoryIcon";
import { Motif } from "@/components/illustrations/Motif";
import { categoryScene } from "@/lib/illustrations/scenes";
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
  const repo = getRepository();
  const categories = await repo.listCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const articles = await repo.listArticles({ category: slug });
  const tone = categoryTone(slug);

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
        <div className="rounded-[var(--radius-card)] border border-line bg-surface px-5">
          {articles.length > 0 ? <ArticleList articles={articles} categories={categories} /> : <p className="py-10 text-center text-sm text-muted">このテーマの記事は準備中です。</p>}
        </div>
        <aside>
          <ConsultationCta placement="article-sidebar" variant="compact" />
        </aside>
      </div>
    </div>
    </>
  );
}
