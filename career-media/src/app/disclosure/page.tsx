import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "広告・提携表記",
  description: `${site.fullName}の運営者と、記事内でご案内するキャリア相談サービスとの関係について説明します。`,
  path: "/disclosure",
});

// TODO(正式公開前にMakeCareer確認が必要): 表記文言の最終確認（ステルスマーケティング規制への対応方針を含む）
export default function DisclosurePage() {
  return (
    <InfoPage title="広告・提携表記" path="/disclosure" eyebrow="DISCLOSURE">
      <h2>運営者とご案内するサービスの関係</h2>
      <p>{partner.disclosure}</p>
      <p>
        記事や条件整理チェックに設置している「相談する」ボタンは、運営会社のキャリア相談（人材紹介サービス）の申し込みページにつながる設計です（デモ版では移動しません）。どのページから申し込みがあったかを把握するため、リンクには計測用のパラメータを付けています。
      </p>

      <h2>記事の内容について</h2>
      <ul>
        <li>記事は、特定の求人や企業への応募をすすめるものではありません。</li>
        <li>求人を掲載している企業などから費用を受け取って、記事の内容や評価を変えることはありません。</li>
        <li>
          記事の作り方は<Link href="/editorial-policy">編集方針</Link>に記載しています。
        </li>
      </ul>

      <h2>広告の掲載について</h2>
      <p>現時点で、第三者の広告やアフィリエイトリンクは掲載していません。今後、第三者の広告などを掲載する場合は、広告であることが分かるように「広告」「PR」などと表示します。</p>
    </InfoPage>
  );
}
