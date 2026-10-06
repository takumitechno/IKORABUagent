import { InfoPage, PendingReview } from "@/components/InfoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "免責事項",
  description: "免責事項（正式公開前に確定予定）",
  path: "/disclaimer",
  noindex: true,
});

// TODO(正式公開前にMakeCareer確認が必要): 免責事項の確定文面
export default function DisclaimerPage() {
  return (
    <InfoPage title="免責事項" path="/disclaimer" eyebrow="DISCLAIMER">
      <p>
        <PendingReview>確定版は正式公開前に掲載します</PendingReview>
      </p>
      <h2>掲載情報について（案）</h2>
      <ul>
        <li>記事の内容は、各記事に記載した情報確認日時点の情報にもとづいています。制度や条件は変更されることがあるため、最新の情報は出典元や各窓口でご確認ください。</li>
        <li>職種比較や条件整理チェックの内容は、一般的な傾向にもとづく目安です。個別の求人や企業の条件、選考の結果を示すものではありません。</li>
        <li>外部サイトへのリンク先の内容については、各サイトの運営者にお問い合わせください。</li>
      </ul>
    </InfoPage>
  );
}
