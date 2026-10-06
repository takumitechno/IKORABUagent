import type { Metadata } from "next";
import { partner } from "@/config/partner";
import { absoluteUrl, site } from "@/config/site";
import type { Article, Category } from "@/lib/content/types";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

/** ページごとの title / description / canonical / OGP をまとめて作る */
export function pageMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const indexable = site.indexable && !input.noindex;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: input.type ?? "website",
      url,
      title: input.title,
      description: input.description,
      siteName: site.fullName,
      locale: site.locale,
      images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: site.fullName }],
      ...(input.type === "article" ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [absoluteUrl("/og-default.png")],
    },
  };
}

export function articlePath(article: Pick<Article, "kind" | "slug">): string {
  return article.kind === "news" ? `/news/${article.slug}` : `/articles/${article.slug}`;
}

const organization = () => ({
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: partner.partnerName,
  url: partner.corporateUrl,
});

export function organizationJsonLd() {
  return { "@context": "https://schema.org", ...organization() };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.fullName,
    url: site.url,
    inLanguage: "ja",
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/articles?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: Article) {
  const url = absoluteUrl(articlePath(article));
  return {
    "@context": "https://schema.org",
    "@type": article.kind === "news" ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.seoDescription ?? article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "ja",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: [absoluteUrl("/og-default.png")],
    author: { "@type": "Organization", name: site.editorialTeam, url: absoluteUrl("/editorial-policy") },
    publisher: organization(),
    // 出典を citation として明示する
    citation: article.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url, publisher: s.publisher })),
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

/** FAQ が実際にページに表示される場合だけ出力する */
export function faqJsonLd(article: Pick<Article, "faq">) {
  if (article.faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function articleCrumbs(article: Article, categories: Category[]): Crumb[] {
  const primary = categories.find((c) => c.slug === article.categories[0]);
  const crumbs: Crumb[] = [{ name: "ホーム", path: "/" }];
  if (article.kind === "news") crumbs.push({ name: "転職ニュース・市場情報", path: "/news" });
  else crumbs.push({ name: "記事一覧", path: "/articles" });
  if (primary && article.kind !== "news") crumbs.push({ name: primary.name, path: `/categories/${primary.slug}` });
  crumbs.push({ name: article.title, path: articlePath(article) });
  return crumbs;
}

/** JSON-LD を script に埋め込むときの </script> 対策 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
