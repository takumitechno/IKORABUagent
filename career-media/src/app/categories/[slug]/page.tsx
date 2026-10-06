import { notFound } from "next/navigation";
import { ArticleList } from "@/components/ArticleCards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "記事一覧", path: "/articles" },
          { name: category.name, path: `/categories/${slug}` },
        ]}
      />
      <header className="mt-6 flex items-center gap-4">
        <span className={`enter-pop relative block aspect-square w-[72px] shrink-0 rounded-full sm:w-[104px] ${tone.bg}`}>
          <Motif name={categoryScene(category.slug)} className="anim-float-slow absolute inset-[4%]" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold text-ink sm:text-[30px]">{category.name}</h1>
          <p className="mt-1 text-sm leading-7 text-muted">{category.description}</p>
        </div>
      </header>

      <nav aria-label="ほかのテーマ" className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={c.slug === "news" ? "/news" : `/categories/${c.slug}`}
            aria-current={c.slug === slug ? "page" : undefined}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 ${c.slug === slug ? "bg-ink text-white ring-ink" : "bg-white text-body ring-line hover:text-brand-strong"}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[var(--radius-card)] border border-line bg-white px-5">
          {articles.length > 0 ? <ArticleList articles={articles} categories={categories} /> : <p className="py-10 text-center text-sm text-muted">このテーマの記事は準備中です。</p>}
        </div>
        <aside>
          <ConsultationCta placement="article-sidebar" variant="compact" />
        </aside>
      </div>
    </div>
  );
}
