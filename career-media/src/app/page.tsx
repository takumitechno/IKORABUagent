import Link from "next/link";
import { ArrowDown, ArrowRight, Search } from "lucide-react";
import { ConsultationPreview } from "@/components/ConsultationPreview";
import { partner } from "@/config/partner";
import { GeneratedImage } from "@/components/GeneratedImage";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const revalidate = 600;
export const metadata = pageMetadata({ title: site.fullName + "｜はじめて・未経験の転職", description: site.description, path: "/" });
const READS = [
  { slug: "shigoto-sagashikata", title: "やりたい仕事が分からないときは？", label: "仕事選び" },
  { slug: "sekkyaku-keiken-ikasu", title: "「接客しかしてない」も、経験になる。", label: "経験の伝え方" },
  { slug: "donichi-yasumi-nenshu-hikaku", title: "給料と休み、どっちも大事。", label: "条件の比べ方" },
  { slug: "tenshoku-agent-merit", title: "転職の相談って、何をしてくれるの？", label: "相談の基本" },
  { slug: "mensetsu-renshu-pro", title: "面接が不安なら、練習から。", label: "面接の準備" },
  { slug: "agent-mendan-mae", title: "初めての相談。何を話せばいい？", label: "相談の準備" },
];
export default async function HomePage() {
  const articles = await getRepository().listArticles();
  const reads = READS.filter((read) => articles.some((article) => article.slug === read.slug));
  return (
    <div className="editorial-home consultation-first">
      <JsonLd data={organizationJsonLd()} /><JsonLd data={websiteJsonLd()} />
      <section className="campaign-hero" aria-labelledby="home-title">
        <div className="campaign-orbit" aria-hidden="true"><span /><span /></div>
        <div className="campaign-copy">
          <p className="campaign-eyebrow"><span />はじめて・未経験の転職ガイド</p>
          <h1 id="home-title"><span>次の仕事、</span><br /><strong>一緒に考えよう。</strong></h1>
          <p className="campaign-lead">接客・バイトの経験も、言葉にできなくても。<br />会社選びから面接まで、相談しながら。</p>
        </div>
        <figure className="campaign-people">
          <GeneratedImage slug="campaign-people" priority sizes="(min-width: 768px) 60vw, 100vw" fallback={<div />} className="h-full w-full max-md:!object-cover" />
          <figcaption>生成イメージ・人物は架空です</figcaption>
        </figure>
        <a href="#home-journeys" className="campaign-stamp" aria-label="今の気持ちから探す"><ArrowDown aria-hidden="true" /><span>その気持ちから<br />はじめよう。</span></a>
        <div className="campaign-actions">
          <Link href="/consultation" data-cta-placement="home-hero" data-cta-kind="consultation-info" className="campaign-cta"><span><small>転職するか迷っていても</small>自分の悩みを相談してみる</span><span className="campaign-arrow"><ArrowRight aria-hidden="true" /></span></Link>
          <Link href="/check" data-cta-placement="home-hero" data-cta-kind="check" className="campaign-secondary">相談前にメモをつくる<small>約3分・登録不要</small><ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
      <div className="confidence-strip"><span>経験を言葉に</span><ArrowRight aria-hidden="true" /><span>働く条件を整理</span><ArrowRight aria-hidden="true" /><span>応募・面接の準備</span></div>
      <div className="editorial-shell">

        <section className="editorial-section" aria-labelledby="home-journeys">
          <div className="editorial-section-head"><div><p className="editorial-kicker">今の気持ちに近いものを選んでみて</p><h2 id="home-journeys">その不安から、相談できる。</h2></div><p>何を頼めるか、具体例で見てみよう。</p></div>
          <ConsultationPreview />
          <div className="editorial-browse"><Link href="/concerns">ほかの悩みから探す<ArrowRight aria-hidden="true" /></Link><Link href="/jobs">職種を見比べる<ArrowRight aria-hidden="true" /></Link></div>
        </section>
        <section className="talk-path" aria-labelledby="home-consult">
          <div className="talk-path-heading"><p className="editorial-kicker">相談したら、何をするの？</p><h2 id="home-consult">決める前に、<br />一緒に整理する時間を。</h2><p>求人への応募は、その後に自分で判断できます。</p><Link href="/consultation#first-talk" data-cta-placement="home-band" data-cta-kind="consultation-info" className="editorial-button">相談の進め方を見てみる<ArrowRight aria-hidden="true" /></Link></div>
          <ol className="talk-path-steps"><li><span>01</span><div><h3>今の状況を話す</h3><p>仕事のこと、転職を考えた理由。<br />うまくまとまっていなくても。</p></div></li><li><span>02</span><div><h3>経験と希望を整理する</h3><p>活かせること、大切にしたい条件。<br />仕事選びの基準を一緒に考えます。</p></div></li><li><span>03</span><div><h3>次の進め方を考える</h3><p>求人の比較、書類の準備、面接の練習。<br />今の状況に合わせて相談できます。</p></div></li></ol>
          <p className="talk-path-note">相談内容の例です。実際の対応範囲は相談先にご確認ください。{partner.consultationFeeNote}</p>
        </section>
        <section className="quiet-check" aria-labelledby="home-check"><div><p className="editorial-kicker">話す前に、自分で整理したいなら</p><h2 id="home-check">相談に持っていけるメモをつくろう。</h2><p>約3分・登録不要。経験と希望を選んで整理できます。</p></div><Link href="/check" data-cta-placement="home-hero" data-cta-kind="check" className="editorial-text-link">条件整理チェックへ<ArrowRight aria-hidden="true" /></Link></section>
        <section className="editorial-section" aria-labelledby="home-reads">
          <div className="editorial-section-head"><div><p className="editorial-kicker">転職の読みもの</p><h2 id="home-reads">気になることから、ひとつ。</h2></div><Link href="/articles" className="editorial-text-link">記事をすべて見る<ArrowRight aria-hidden="true" /></Link></div>
          <ul className="editorial-reads">{reads.map((read, i) => <li key={read.slug}><Link href={"/articles/" + read.slug}><span className="editorial-read-number">0{i + 1}</span><span><small>{read.label}</small><strong>{read.title}</strong></span><ArrowRight aria-hidden="true" /></Link></li>)}</ul>
          <form action="/articles" method="get" role="search" className="editorial-search"><Search aria-hidden="true" /><label htmlFor="home-search" className="sr-only">キーワードで記事を探す</label><input id="home-search" name="q" type="search" placeholder="事務、土日休み、履歴書…" /><button>検索</button></form>
          <p className="editorial-fine">未経験の仕事選びから、職種比較、履歴書・面接、働く条件まで。記事で知り、希望を整理して、キャリア相談につなげられる転職ガイドです。</p>
        </section>
      </div>
    </div>
  );
}
