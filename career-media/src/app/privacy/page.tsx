import { InfoPage, PendingReview } from "@/components/InfoPage";
import { partner } from "@/config/partner";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description: "プライバシーポリシー（正式公開前に確定予定）",
  path: "/privacy",
  noindex: true,
});

/**
 * TODO(正式公開前にMakeCareer確認が必要):
 *   本ページは確定版ではない。運営会社（partner config）の既存プライバシーポリシーへのリンク、
 *   またはメディア用に確定した文面へ差し替えること。ここに法的文章を捏造しない。
 */
export default function PrivacyPage() {
  return (
    <InfoPage title="プライバシーポリシー" path="/privacy" eyebrow="PRIVACY">
      <p>
        <PendingReview>準備中（正式公開前に{partner.partnerName}の確認を経て掲載します）</PendingReview>
      </p>
      <p>このページは提案用プレビューのため、プライバシーポリシーの確定版はまだ掲載していません。正式公開時には、{partner.partnerName}のプライバシーポリシーを掲載またはリンクします。</p>
      <h2>現時点のこのサイトの動作</h2>
      <ul>
        <li>条件整理チェックの回答は、お使いのブラウザ内（セッションストレージ）にのみ一時的に保存され、サーバーには送信されません。</li>
        <li>氏名・連絡先などの個人情報を入力する機能はありません。相談の申し込みは、{partner.partnerName}の申し込みページで行います。</li>
        <li>アクセス解析ツールや広告配信用のタグは、現時点では設置していません。</li>
      </ul>
    </InfoPage>
  );
}
