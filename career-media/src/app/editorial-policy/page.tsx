import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "編集方針",
  description: `${site.fullName}の編集方針です。記事の作り方、出典と情報確認日の考え方、AIの利用、訂正の方針について説明します。`,
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <InfoPage title="編集方針" path="/editorial-policy" eyebrow="EDITORIAL POLICY" lead={`${site.name}は、${partner.operatorDisplay}が運営し、${site.editorialTeam}が編集しています。読者が自分で判断するための材料を、正確で分かりやすく届けることを大切にしています。`}>
      <h2>誰のためのメディアか</h2>
      <p>既卒・第二新卒・フリーターの方や、正社員経験が少ない方、未経験の職種に挑戦したい20代の方など、これから転職を考える人のためのメディアです。専門用語をできるだけ使わず、普段の言葉で説明することを心がけています。</p>

      <h2>大切にしていること</h2>
      <ul>
        <li>
          <strong>求人の推薦ではなく、判断の材料を届けます。</strong>記事は特定の求人や企業への応募をすすめるものではありません。
        </li>
        <li>
          <strong>結果を保証する表現は使いません。</strong>「必ず転職できる」「必ず年収が上がる」といった表現は使いません。
        </li>
        <li>
          <strong>出典と情報確認日を明記します。</strong>制度や法律、数字にかかわる記述は一次情報を確認し、記事ごとに出典と情報確認日を記載します。
        </li>
        <li>
          <strong>分からないことは、分からないと書きます。</strong>情報だけでは判断できないことや、会社によって違うことは、そのように明記します。
        </li>
        <li>
          <strong>読者のためにならないSEOはしません。</strong>キーワードの詰め込みや、内容の薄いページの量産は行いません。
        </li>
      </ul>

      <h2>記事ができるまで</h2>
      <ol>
        <li>企画: 読者がどんな場面で迷うかを考え、記事のテーマと構成を決めます。</li>
        <li>調査: 公的機関の情報など一次情報を確認し、出典を記録します。</li>
        <li>執筆: 調査した内容をもとに本文を書きます。</li>
        <li>確認: 編集部が事実関係・表現・出典・リンクを確認します。確認が終わるまで記事は公開しません。</li>
        <li>公開: 確認済みの記事だけを、公開の承認を経て掲載します。</li>
        <li>見直し: 制度の変更などがあれば内容を見直し、更新日と情報確認日を更新します。</li>
      </ol>

      <h2>AIの利用について</h2>
      <p>記事制作の一部（情報の下調べ、構成案や下書きの作成、表記の確認など）で、生成AIを含むツールを利用することがあります。AIが作成した内容をそのまま公開することはなく、編集部が事実関係と出典を確認したうえで公開します。</p>

      <h2>当社サービスの案内について</h2>
      <p>
        記事の中で、{partner.brandName}のキャリア相談サービスをご案内することがあります。詳しくは<Link href="/disclosure">広告・提携表記</Link>をご覧ください。
      </p>

      <h2>誤りを見つけたときは</h2>
      <p>記事の内容に誤りがあった場合は、確認のうえ速やかに訂正し、必要に応じて訂正した内容と日付を記事内に記載します。{/* TODO(正式公開前にMakeCareer確認が必要): 誤りの連絡窓口 */}誤りのご指摘の受付窓口は、正式公開前に掲載します。</p>
    </InfoPage>
  );
}
