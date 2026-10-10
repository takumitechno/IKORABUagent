import Link from "next/link";
import { ArrowDown, ArrowRight, Search } from "lucide-react";
import { JourneyCards } from "@/components/Journey";
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
    <div className="editorial-home">
      <JsonLd data={organizationJsonLd()} /><JsonLd data={websiteJsonLd()} />
      <section className="campaign-hero" aria-labelledby="home-title">
        <div className="campaign-orbit" aria-hidden="true"><span /><span /></div>
        <div className="campaign-copy">
          <p className="campaign-eyebrow"><span />はじめて・未経験の転職ガイド</p>
          <h1 id="home-title"><span>その経験から、</span><br /><strong>次の仕事へ。</strong></h1>
          <p className="campaign-lead">接客の経験も、バイトの日々も。<br />活かせる経験と、ゆずれない条件を整理しよう。</p>
        </div>
        <figure className="campaign-people">
          <GeneratedImage slug="campaign-people" priority sizes="(min-width: 768px) 60vw, 100vw" fallback={<div />} className="h-full w-full max-md:!object-cover" />
          <figcaption>生成イメージ・人物は架空です</figcaption>
        </figure>
        <a href="#home-journeys" className="campaign-stamp" aria-label="今の気持ちから探す"><ArrowDown aria-hidden="true" /><span>その気持ちから<br />はじめよう。</span></a>
        <div className="campaign-actions">
          <Link href="/consultation" data-cta-placement="home-hero" data-cta-kind="consultation-info" className="campaign-cta"><span><small>会社選び・書類・面接の準備まで</small>相談でできることを見る</span><span className="campaign-arrow"><ArrowRight aria-hidden="true" /></span></Link>
          <Link href="/check" data-cta-placement="home-hero" data-cta-kind="check" className="campaign-secondary">相談前にメモをつくる<small>約3分・登録不要</small><ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
      <div className="editorial-shell">

        <section className="editorial-section" aria-labelledby="home-journeys">
          <div className="editorial-section-head"><div><p className="editorial-kicker">あなたの「変わりたい」は？</p><h2 id="home-journeys">今の気持ちで、選んでいい。</h2></div><p>ひとつ気になったら、そこからで大丈夫。</p></div>
          <JourneyCards />
          <div className="editorial-browse"><Link href="/concerns">ほかの悩みから探す<ArrowRight aria-hidden="true" /></Link><Link href="/jobs">職種を見比べる<ArrowRight aria-hidden="true" /></Link></div>
        </section>
        <section className="editorial-check" aria-labelledby="home-check">
          <div><p className="editorial-kicker">選ぶだけで、相談の準備。</p><h2 id="home-check">「なんとなく」を、<br />話せる希望に。</h2><p>ゆずれない条件、今までの経験。<br />選ぶだけで、相談に持っていけるメモに。</p><Link href="/check" data-cta-placement="home-hero" data-cta-kind="check" className="editorial-button">希望を整理してみる<ArrowRight aria-hidden="true" /></Link><p className="editorial-fine">約3分・登録不要。適職を判定する診断ではありません。</p></div>
          <div className="editorial-note" aria-label="相談メモのイメージ"><p className="editorial-note-label">相談メモの例</p><dl><div><dt>大切にしたいこと</dt><dd>土日休み、自分の時間</dd></div><div><dt>活かせそうな経験</dt><dd>接客で、相手の話を聞いてきた</dd></div><div><dt>相談で聞きたいこと</dt><dd>未経験から始められる仕事は？</dd></div></dl><span className="editorial-note-foot">答えが全部そろわなくても、OK。</span></div>
        </section>
        <section className="editorial-consult" aria-labelledby="home-consult">
          <div><p className="editorial-kicker">次の一歩は、話すことから。</p><h2 id="home-consult">ひとりで決めなくていい。<br />まずは、話そう。</h2><p>会社選びも、書類も、面接も。<br />転職のプロと、一つずつ準備できます。</p><Link href="/consultation" data-cta-placement="home-band" data-cta-kind="consultation-info" className="editorial-button">相談でできることを見る<ArrowRight aria-hidden="true" /></Link><p className="editorial-fine">まだ転職を決めていなくても。応募するかは、自分で決められます。</p></div>
          <div className="editorial-consult-words" aria-hidden="true"><span>会社選び</span><span>書類の準備</span><span>面接の練習</span><ArrowRight /></div>
        </section>
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
