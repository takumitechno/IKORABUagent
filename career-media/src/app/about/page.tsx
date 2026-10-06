import Link from "next/link";
import { InfoPage, PendingReview } from "@/components/InfoPage";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "運営者情報",
  description: `${site.fullName}の運営者情報です。運営: ${partner.operatorDisplay}`,
  path: "/about",
});

// TODO(正式公開前にMakeCareer確認が必要): 所在地・代表者・問い合わせ先の確定値
export default function AboutPage() {
  const info = partner.pendingCompanyInfo;
  return (
    <InfoPage title="運営者情報" path="/about" eyebrow="ABOUT" lead={`${site.name}は、未経験からの転職を考える方が、仕事や働き方について調べ、自分の希望を整理し、必要なときに相談先を見つけられるようにするための情報メディアです。`}>
      <h2>運営者</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th scope="row">メディア名</th>
              <td>{site.fullName}</td>
            </tr>
            <tr>
              <th scope="row">運営会社</th>
              <td>{partner.operatorDisplay}</td>
            </tr>
            <tr>
              <th scope="row">事業内容</th>
              <td>{partner.businessAreas.join(" / ")}</td>
            </tr>
            <tr>
              <th scope="row">有料職業紹介事業許可番号</th>
              <td>{partner.licenseNumber}</td>
            </tr>
            <tr>
              <th scope="row">代表者</th>
              <td>{info.representative ?? <PendingReview />}</td>
            </tr>
            <tr>
              <th scope="row">所在地</th>
              <td>{info.address ?? <PendingReview />}</td>
            </tr>
            <tr>
              <th scope="row">お問い合わせ</th>
              <td>{info.contact ?? <PendingReview />}</td>
            </tr>
            <tr>
              <th scope="row">企業サイト</th>
              <td>
                <a href={partner.corporateUrl} target="_blank" rel="noopener noreferrer">
                  {partner.corporateUrl}
                </a>
              </td>
            </tr>
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
        {partner.partnerName}は、若手・未経験の方の転職支援を行う人材紹介会社です。未経験からの転職では、「何から調べればいいか分からない」「自分の経験をどう伝えればいいか分からない」といった迷いが生まれやすいものです。このメディアは、相談の手前の段階で、仕事や条件について自分のペースで調べ、整理できる場所として運営しています。
      </p>
      <p>
        記事は{site.editorialTeam}が企画・編集し、出典と情報確認日を明記しています。編集の考え方は<Link href="/editorial-policy">編集方針</Link>を、当社サービスの案内との関係は<Link href="/disclosure">広告・提携表記</Link>をご覧ください。
      </p>
    </InfoPage>
  );
}
