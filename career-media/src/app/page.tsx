import Link from "next/link";
import { ArrowRight, Search, FileText, SlidersHorizontal, Newspaper } from "lucide-react";
import { ConsultationPreview } from "@/components/ConsultationPreview";
import { ConsultationTrust } from "@/components/ConsultationTrust";
import { ConditionNotePreview } from "@/components/ConditionNotePreview";
import { partner } from "@/config/partner";
import { GeneratedImage } from "@/components/GeneratedImage";
import { Eyecatch } from "@/components/Eyecatch";
import { announcedLabel, formatDateShort } from "@/components/DateMeta";
import { articleCardTitle } from "@/lib/article-presentation";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const revalidate = 600;
export const metadata = pageMetadata({ title: site.fullName + "｜はじめて・未経験の転職", description: site.description, path: "/" });
const READS = [
  { slug: "sekkyaku-keiken-ikasu", title: "接客の経験を、次の仕事へ。", label: "経験の伝え方", detail: "事務やサポートの仕事へ。経験を書き出すところから。" },
  { slug: "donichi-yasumi-nenshu-hikaku", title: "給料と休み、どっちも大事。", label: "条件の比べ方", detail: "月給・賞与・休日をそろえて、求人を比べる。" },
  { slug: "freeter-seishain-hajimeni", title: "フリーターから、何を始めればいい？", label: "初めての転職", detail: "アルバイトの経験と、相談で聞きたいことを整理。" },
];
export default async function HomePage() {
  const repo = getRepository();
  const [articles, categories] = await Promise.all([repo.listArticles(), repo.listCategories()]);
  const reads = READS.filter((read) => articles.some((article) => article.slug === read.slug));
  const updates = [
    { title: "新着・更新記事", href: "/articles", icon: FileText, items: articles.filter((article) => article.kind === "article" && !READS.some((read) => read.slug === article.slug)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, 3) },
    { title: "制度・ニュース解説", href: "/news", icon: Newspaper, items: articles.filter((article) => article.kind === "news").slice(0, 3) },
  ];
  return (
    <div className="lp-home">
      <JsonLd data={organizationJsonLd()} /><JsonLd data={websiteJsonLd()} />
      <section className="lp-hero" aria-labelledby="home-title">
        <svg className="lp-hero-landscape" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M930 0H1440V600H500C760 500 790 210 930 0Z" fill="var(--color-brand-tint)" /><path d="M1440 180C1120 260 1000 460 650 600H1440Z" fill="var(--color-brand-soft)" opacity=".65" /><path d="M780 600C1120 490 1270 410 1440 320" fill="none" stroke="var(--color-surface)" strokeWidth="60" opacity=".5" /></svg>
        <div className="lp-hero-inner">
        <div className="lp-hero-intro">
          <p className="lp-hero-target">接客・アルバイト・はじめての転職に</p>
          <h1 id="home-title">その経験から、<br />次の仕事を考えよう。</h1>
        </div>
        <figure className="lp-hero-photo">
          <div className="lp-hero-portrait"><GeneratedImage slug="career-support-team-cutout" priority sizes="(min-width: 768px) 48vw, 100vw" fallback={<div />} className="lp-team-image !object-contain" /></div>
          <figcaption>生成イメージ（実在の相談員・利用者ではありません）</figcaption>
        </figure>
        <div className="lp-hero-details">
          <p className="lp-hero-lead">接客やアルバイトで培った経験を、次の仕事へ。<br />仕事選び・応募書類・面接の準備を相談できます。</p>
          <ul className="lp-hero-benefits"><li><FileText aria-hidden="true" /><span>経験を<span>言葉にする</span></span></li><li><SlidersHorizontal aria-hidden="true" /><span>働く条件を<span>整理する</span></span></li></ul>
          <div className="lp-hero-actions"><Link href="/consultation" className="lp-button lp-hero-next" data-cta-placement="home-hero" data-cta-kind="consultation-info">無料相談の内容を見る<ArrowRight aria-hidden="true" /></Link><a href="#home-reads" className="lp-hero-read"><Search aria-hidden="true" />まずは記事を読む</a></div>
          <p className="lp-hero-note">{partner.consultationFeeNote} 応募するかは、自分で決められます。</p>
        </div>
        </div>
      </section>
      <div className="lp-proof-strip"><ConsultationTrust compact /></div>
      <section className="lp-start" aria-labelledby="home-journeys">
        <div className="lp-section-heading"><h2 id="home-journeys">相談したいことから選ぶ</h2></div>
        <ConsultationPreview />
      </section>
      <section className="lp-journal" aria-labelledby="home-reads">
        <div className="lp-journal-heading"><div className="lp-section-heading"><h2 id="home-reads">悩みに合わせて読む</h2></div><Link href="/articles" className="lp-underlink">すべての記事を見る<ArrowRight aria-hidden="true" /></Link></div>
        <ul className="lp-reading-cards">{reads.map((read) => { const article = articles.find((item) => item.slug === read.slug)!; return <li key={read.slug}><Link href={`/articles/${read.slug}`}>
          <Eyecatch article={article} category={categories.find((category) => category.slug === article.categories[0])} size="md" />
          <div className="lp-reading-copy"><span className="lp-read-label">{read.label}</span><h3>{read.title}</h3><p>{read.detail}</p><span className="lp-reading-link">記事を読む<ArrowRight aria-hidden="true" /></span></div>
        </Link></li>; })}</ul>
      </section>
      <section className="lp-updates" aria-labelledby="home-updates">
        <div className="lp-section-heading"><h2 id="home-updates">新着・更新記事とニュース</h2></div>
        <div className="lp-updates-grid">{updates.map((group) => { const Icon = group.icon; return <div className="lp-update-group" key={group.href}>
          <div className="lp-update-heading"><h3><Icon aria-hidden="true" />{group.title}</h3><Link href={group.href}>一覧を見る<ArrowRight aria-hidden="true" /></Link></div>
          <ul>{group.items.map((article, index) => <li className={index === 0 ? "lp-update-lead" : ""} key={article.slug}><Link href={`/${article.kind === "news" ? "news" : "articles"}/${article.slug}`}>
            <Eyecatch article={article} category={categories.find((category) => category.slug === article.categories[0])} size={index === 0 ? "md" : "sm"} />
            <div className="lp-update-copy">
            <span className="lp-update-date">{site.sampleContent ? "作成" : "掲載"} <time dateTime={article.publishedAt ?? article.updatedAt}>{formatDateShort(article.publishedAt ?? article.updatedAt)}</time>{article.updatedAt.slice(0, 10) > (article.publishedAt ?? "").slice(0, 10) && <span>・更新 {formatDateShort(article.updatedAt)}</span>}</span>
            {article.kind === "news" && article.news?.announcedAt && <span className="lp-update-date">{announcedLabel(article.news.announcedAt, article.news.dateType)} {formatDateShort(article.news.announcedAt)}</span>}
            <span className="lp-update-title" title={article.title}>{articleCardTitle(article)}</span>
            </div><ArrowRight aria-hidden="true" />
          </Link></li>)}</ul>
        </div>; })}</div>
      </section>
      <section className="lp-check" aria-labelledby="home-check">
        <div><p className="lp-section-index">相談前に、自分で整理したい方へ</p><h2 id="home-check">希望と経験を、<br />相談用のメモに。</h2><p>13問・約3分・登録不要。<br />作ったメモはコピー・印刷して使えます。</p><Link href="/check" className="lp-button" data-cta-placement="home-hero" data-cta-kind="check">条件を整理してメモを作る<ArrowRight aria-hidden="true" /></Link></div>
        <ConditionNotePreview />
      </section>
      <section className="lp-journal" aria-labelledby="home-search-title">
        <div className="lp-section-heading"><h2 id="home-search-title">気になる仕事や悩みから探す</h2></div>
        <form action="/articles" method="get" role="search" className="lp-search"><Search aria-hidden="true" /><label htmlFor="home-search" className="sr-only">キーワードで記事を探す</label><input id="home-search" name="q" type="search" placeholder="事務、土日休み、面接…" /><button aria-label="記事を検索"><ArrowRight aria-hidden="true" /></button></form>
      </section>
    </div>
  );
}
