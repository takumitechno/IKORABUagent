import Link from "next/link";
import { InfoPage, PendingReview } from "@/components/InfoPage";
import { licenseLabel, partner } from "@/config/partner";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "運営者情報",
  description: `${site.fullName}の運営者情報です。メディアの運営・制作と、キャリア相談の相談先を分けて記載しています。`,
  path: "/about",
});

// TODO(正式公開前にMakeCareer確認が必要): 運営者・相談先の所在地・代表者・問い合わせ先・許可番号の確定値
export default function AboutPage() {
  const info = partner.pendingCompanyInfo;
  return (
    <InfoPage title="運営者情報" path="/about" eyebrow="ABOUT" lead={`${site.name}は、未経験からの転職を考える方が、仕事や働き方について調べ、自分の希望を整理し、必要なときに相談先を見つけられるようにするための情報メディアです。`}>
      {!partner.brandUsageApproved && (
        <p className="rounded-xl border border-accent/30 bg-accent-soft p-4 text-[14px] leading-7">
          <strong>このサイトは提案用のデモです（非公開）。</strong>
          下の運営者・相談先の情報は、正式に公開するときに確定した内容を掲載します。
        </p>
      )}

      <h2>メディア</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th scope="row">メディア名</th>
              <td>{site.fullName}</td>
            </tr>
            <tr>
              <th scope="row">運営</th>
              <td>{partner.operatorDisplay}</td>
            </tr>
            <tr>
              <th scope="row">企画・制作</th>
              <td>{partner.producerDisplay}</td>
            </tr>
            <tr>
              <th scope="row">所在地</th>
              <td>{info.address ?? <PendingReview />}</td>
            </tr>
            <tr>
              <th scope="row">お問い合わせ</th>
              <td>{info.contact ?? <PendingReview />}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>キャリア相談の相談先</h2>
      <p>記事や条件整理チェックの中でご案内するキャリア相談は、次の人材紹介会社が担当します。このメディア自体は、求人の紹介や職業紹介を行いません。</p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th scope="row">相談先</th>
              <td>{partner.partnerName}</td>
            </tr>
            <tr>
              <th scope="row">事業</th>
              <td>{partner.partnerBusiness}</td>
            </tr>
            <tr>
              <th scope="row">有料職業紹介事業許可番号</th>
              <td>{partner.licenseNumber ?? <PendingReview>{licenseLabel}</PendingReview>}</td>
            </tr>
            {partner.corporateUrl && (
              <tr>
                <th scope="row">企業サイト</th>
                <td>
                  <a href={partner.corporateUrl} target="_blank" rel="noopener noreferrer">
                    {partner.corporateUrl}
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p>
        職業紹介事業の許可は、厚生労働省の
        <a href="https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB101010.do?action=transition&screenId=GICB101010&params=1" target="_blank" rel="noopener noreferrer">
          人材サービス総合サイト
        </a>
        で許可番号から確認できます。
      </p>

      <h2>このメディアについて</h2>
      <p>
        未経験からの転職では、「何から調べればいいか分からない」「自分の経験をどう伝えればいいか分からない」といった迷いが生まれやすいものです。このメディアは、相談の手前の段階で、仕事や条件について自分のペースで調べ、整理できる場所として作っています。相談しなくても、記事と条件整理チェックだけで判断の材料が手に入ることを目指しています。
      </p>
      <p>
        記事は{site.editorialTeam}が企画・編集し、出典と情報確認日を明記しています。編集の考え方は<Link href="/editorial-policy">編集方針</Link>を、キャリア相談の案内との関係は<Link href="/disclosure">広告・提携表記</Link>をご覧ください。
      </p>
    </InfoPage>
  );
}
