/**
 * ブランド・運営者・相談導線の設定（唯一の正本）。
 *
 * - メディア名・運営者・相談先・LP URL・許可番号・表記文言はここだけで管理する。
 *   コンポーネントや記事本文に固有名や URL を直書きしない。
 * - 3つの状態を分ける。
 *   A. neutral（既定）… 正式提携前の中立デモ。実在の提携候補企業の名前・ロゴ・許可番号を出さない。
 *   B. makecareer … 提携候補企業との商談でだけ見せる、ローカル・非公開・noindex の完成イメージ。
 *      ブランド名を表示しても、相談ボタンは本番の申込ページへ移動しない（下の「本番送客」を参照）。
 *   C. 本番（live）… 正式契約・ブランド利用許諾・法務確認のあと。今回は有効にしない。
 * - 本番送客（実際の申込ページへのリンク）は、ブランド表示とは別のスイッチ。次の3つがすべてそろったときだけ有効になる。
 *     1. brandUsageApproved: true（正式な提携・ブランド利用許諾）
 *     2. liveOutboundApproval に、人が確認した承認記録（承認者・日付・根拠）を書き込む
 *     3. 起動時に PARTNER_LIVE_OUTBOUND=on を指定する
 *   どれか1つでも欠けると、相談ボタンはサイト内の説明ページ（/consultation/apply）に留まる。
 *   リンク先そのものを書き換えるので、新しいタブ・URL の直打ち・JavaScript 無効・静的 HTML でも申込ページには出ない。
 *
 * TODO(正式公開前にMakeCareer確認が必要):
 *   - ブランド名・社名表記、許可番号（一次情報で確認）、LP URL、相談の流れ、対応できる相談の範囲
 *   - 運営者情報（所在地・連絡先）の確定値
 *   - 計測パラメータ（utm_* / campaign_id / partner ID）の命名規則と成果データの返し方
 *   - 許可番号 13-ユ-313746 は PO から共有された値。この作業環境からは一次情報（企業サイト・厚生労働省の
 *     人材サービス総合サイト）にアクセスできず未確認のため、画面には出していない。
 */

export type PartnerProfile = "neutral" | "makecareer";

/** 本番送客の承認記録（人が確認して書き込む。エージェントが書き込んではいけない） */
export type LiveOutboundApproval = { approvedBy: string; approvedAt: string; reference: string };

export type PartnerConfig = {
  profile: PartnerProfile;
  /** メディア名（ロゴ・title に出る） */
  mediaName: string;
  /** メディアの一言説明（ロゴ下・フッター） */
  mediaTagline: string;
  /** メディアの運営者表記（運営者情報・記事の編集表記に出る） */
  operatorDisplay: string;
  /** スマホなど狭い場所で使う短い運営者表記 */
  operatorShort: string;
  /** メディアの企画・制作・運用の担当（提案段階では制作会社） */
  producerDisplay: string;
  /** キャリア相談を受ける会社（人材紹介会社）の表記。未確定なら説明的な表記 */
  partnerName: string;
  /** ロゴ横・© などに出す短いブランド表記 */
  brandName: string;
  /** 相談先（人材紹介会社）の有料職業紹介事業許可番号。一次情報で確認するまで null（画面に出さない） */
  licenseNumber: string | null;
  /** 相談先の主な事業（運営者情報に表示） */
  partnerBusiness: string;
  /** 相談サービスの説明（相談ページ・CTAで使用） */
  serviceDescription: string;
  /** 相談サービスの対象として想定している人（相談ページで使用） */
  serviceAudience: string[];
  consultationFeeNote: string;
  consultationEligibilityNote: string;
  /** 本番の申込先（本番送客が有効なときだけ使う）。未確定なら null */
  liveConsultationUrl: string | null;
  /** 本番送客の承認記録。null の間は本番の申込先へ送らない */
  liveOutboundApproval: LiveOutboundApproval | null;
  /** 計測用キャンペーンID（utm_campaign に入る） */
  campaignId: string;
  /** 企業サイト。未確定なら null */
  corporateUrl: string | null;
  /** メディアと相談サービスの関係についての表記 */
  disclosure: string;
  /** 相談の流れ（相談ページで表示） */
  consultationSteps: { title: string; body: string }[];
  /** 相談の流れについての注記（実際の流れが未確認であることなど） */
  consultationStepsNote: string;
  /** 相談でできること（プロに頼むよさとして、トップ・相談ページ・記事の CTA で使う） */
  serviceHighlights: { icon: "building" | "messages" | "file" | "search" | "calendar"; title: string; body: string }[];
  /** 相談でできることについての注記 */
  serviceHighlightsNote: string;
  /** 相談相手の呼び方（例: 人材紹介会社のキャリアアドバイザー） */
  adviserLabel: string;
  /** ヘッダー・ヒーロー・スマホの追従ボタンなど、短い相談ボタンの文言 */
  consultCta: string;
  /** トップの「プロに頼むよさ」の見出しで強調する言葉 */
  proLabel: string;
  /** トップのヒーローの小さなバッジの文言 */
  heroBadge: string;
  /** 画面のテーマ（色）。globals.css の html[data-brand] で切り替える */
  theme: "neutral" | "makecareer";
  /** 正式な提携・ブランド利用許諾が済んでいるか。false の間は公開しない */
  brandUsageApproved: boolean;
  /** 運営者情報のうち、正式公開前に確定が必要な項目 */
  pendingCompanyInfo: { address: string | null; contact: string | null; representative: string | null };
  /** 画面上部のプレビューバーの文言（brandUsageApproved=false の間だけ表示） */
  previewNotice: string;
};

const common = {
  serviceDescription:
    "キャリアアドバイザーが、これまでの経験や希望条件を一緒に整理し、条件に合いそうな求人の紹介、応募書類や面接の準備、選考の日程や条件の調整などをサポートする人材紹介サービスです。",
  consultationFeeNote: "求職者の利用は原則無料。実際の条件は相談先の案内をご確認ください。",
  consultationEligibilityNote: "相談先の対象年齢・地域・希望職種は、正式公開前に確認して掲載します。",
  serviceAudience: [
    "はじめての転職で、何から始めればいいか迷っている方",
    "フリーター・派遣から正社員を目指したい方",
    "接客・販売などから、別の職種を考えている方",
    "未経験の仕事に挑戦したい20代の方",
  ],
  consultationSteps: [
    { title: "相談の申し込み", body: "申し込みページから、希望の連絡方法などを入力します。" },
    { title: "キャリアアドバイザーとの面談", body: "これまでの経験や希望条件、転職したい時期などを一緒に整理します。" },
    { title: "求人の紹介", body: "経験や希望をもとに、条件に合いそうな求人が紹介されます。応募するかどうかはご自身で決められます。" },
    { title: "応募・選考のサポート", body: "応募書類の添削や面接の練習（模擬面接）、面接日程の調整などのサポートを受けられます。" },
    { title: "内定・入社前の確認", body: "労働条件の確認や、入社日などの調整をサポートしてもらえます。" },
  ],
  serviceHighlights: [
    { icon: "building", title: "企業選びの相談", body: "求人票だけでは分からない職場のことを聞きながら、自分に合う会社を一緒に考えます。" },
    { icon: "messages", title: "面接の練習", body: "応募先に合わせた模擬面接で、答え方や話す長さを本番の前に確かめられます。" },
    { icon: "file", title: "応募書類の添削", body: "履歴書・職務経歴書を、未経験の仕事にも伝わる書き方に整えます。" },
    { icon: "search", title: "求人の紹介", body: "経験と希望条件をもとに、条件に合いそうな求人が紹介されます。" },
    { icon: "calendar", title: "日程・条件の調整", body: "面接日程の調整や、入社日・労働条件の確認を間に入って進めてもらえます。" },
  ],
  partnerBusiness: "人材紹介（有料職業紹介事業）",
  liveOutboundApproval: null,
  brandUsageApproved: false,
  pendingCompanyInfo: { address: null, contact: null, representative: null },
} satisfies Partial<PartnerConfig>;

/** A. 既定: 実在企業名・ロゴ・許可番号を出さない中立デモ（提案用） */
const neutral: PartnerConfig = {
  ...common,
  profile: "neutral",
  mediaName: "はじめて転職ガイド",
  mediaTagline: "20代・未経験転職のための仕事選びメディア",
  operatorDisplay: "提案用デモ（運営者は正式公開時に掲載）",
  operatorShort: "提案用デモ",
  producerDisplay: "匠Technologies（企画・制作）",
  partnerName: "提携する人材紹介会社（正式公開時に掲載）",
  brandName: "はじめて転職ガイド",
  licenseNumber: null,
  liveConsultationUrl: null,
  campaignId: "owned-media-demo",
  corporateUrl: null,
  disclosure:
    "このサイトは、人材紹介会社と組んで運営するオウンドメディアの提案用デモです（企画・制作: 匠Technologies）。正式に公開するときは、提携する人材紹介会社のキャリア相談を、記事や条件整理チェックの中でご案内する想定です。デモ版のため、相談ボタンを押しても申し込みページには移動しません。記事は、特定の求人や企業への応募をすすめるものではありません。",
  consultationStepsNote: "人材紹介サービスの一般的な流れです。実際の流れは、正式公開時に相談先の案内を掲載します。",
  serviceHighlightsNote: "人材紹介会社のキャリア相談で一般的に受けられるサポートの例です。求職者の利用は原則無料です（職業安定法により、求職者から手数料を取ることは原則禁止されています）。",
  previewNotice: "提案用デモ（非公開）｜相談ボタンは申し込みページに移動しません",
  adviserLabel: "人材紹介会社のキャリアアドバイザー（転職エージェント）",
  consultCta: "プロに相談する",
  proLabel: "転職のプロ",
  heroBadge: "20代のはじめての転職・未経験転職ガイド",
  theme: "neutral",
};

/** B. 提携候補企業との商談でだけ見せる完成イメージ（PARTNER_PROFILE=makecareer。ローカル・非公開・noindex） */
const makecareer: PartnerConfig = {
  ...common,
  profile: "makecareer",
  consultationFeeNote: "求職者の方は無料で利用できます。",
  consultationEligibilityNote: "相談先は主に20代の転職を支援しています。30代の方や地域・希望職種ごとの対応可否は、事前確認が必要です。",
  // メディア名は未定。PO の指示（2026-10-10）で「転職エージェント（仮）」にしている
  mediaName: "MakeCareer転職エージェント（仮）",
  mediaTagline: "20代・第二新卒・既卒・フリーターの転職を、プロと一緒に。",
  operatorDisplay: "MakeCareer株式会社",
  operatorShort: "MakeCareer",
  producerDisplay: "匠Technologies（企画・制作・運用の提案）",
  partnerName: "MakeCareer株式会社",
  brandName: "MakeCareer",
  // 会社概要ページ（https://make-career.co.jp/company/）の記載を Web 検索の結果で確認（2026-10-10）。PO から共有された番号とも一致
  licenseNumber: "13-ユ-313746",
  liveConsultationUrl: "https://lp.make-career.co.jp/tenshoku-01/",
  campaignId: "owned-media-pilot",
  corporateUrl: null,
  disclosure:
    "このサイトは、MakeCareer株式会社が運営するオウンドメディアの完成イメージとして、匠Technologiesが商談用に試作したものです（正式提携・ブランド利用許諾前、非公開）。正式に公開する場合は、記事や条件整理チェックの中で MakeCareer株式会社のキャリア相談をご案内する想定です。商談用プレビューのため、相談ボタンを押しても申し込みページには移動しません。記事は、特定の求人や企業への応募をすすめるものではありません。",
  consultationStepsNote: "人材紹介サービスの一般的な流れの例です。MakeCareer株式会社の実際の流れは、相談の申し込み後にご案内します。",
  // 面接の練習・企業選びの相談は PO から共有され、サイトへの掲載も PO が了承（2026-10-10）。
  // 20代・第二新卒・既卒・フリーター向け、国家資格のキャリアコンサルタント在籍、求職者は無料、は会社サイトの記載を Web 検索の結果で確認
  serviceHighlightsNote: "MakeCareer株式会社のキャリア相談では、面接の練習や企業選びの相談も受けられます。求職者の方は無料で利用できます（紹介手数料は採用した企業が支払うしくみです）。",
  serviceDescription:
    "MakeCareer株式会社は、20代・第二新卒・既卒・フリーターの方の転職を支援する人材紹介会社です。国家資格を持つキャリアコンサルタントが、これまでの経験や希望条件の整理、企業選びの相談、応募書類の添削や面接の練習、選考の日程や条件の調整まで、転職を一緒に進めます。",
  serviceAudience: [
    "第二新卒・既卒・フリーターで、正社員を目指したい方",
    "はじめての転職で、何から始めればいいか迷っている方",
    "接客・販売などから、別の職種を考えている方",
    "未経験の仕事に挑戦したい20代の方",
  ],
  previewNotice: "MakeCareer様 商談用プレビュー（非公開・正式提携前）｜相談ボタンは申し込みページに移動しません",
  adviserLabel: "MakeCareerのキャリアアドバイザー",
  consultCta: "MakeCareerに相談する",
  proLabel: "MakeCareerのプロ",
  heroBadge: "20代・第二新卒・既卒・フリーターの転職を、プロと一緒に",
  theme: "makecareer",
};

const selected = process.env.PARTNER_PROFILE === "makecareer" ? makecareer : neutral;

export const partner: PartnerConfig = {
  ...selected,
  liveConsultationUrl: process.env.PARTNER_CONSULTATION_URL || selected.liveConsultationUrl,
  campaignId: process.env.PARTNER_CAMPAIGN_ID || selected.campaignId,
};

/**
 * 本番の申込ページへ実際に送客するかどうか。3つの条件がすべてそろったときだけ true。
 * （ブランド表示の切り替え＝PARTNER_PROFILE だけでは true にならない）
 */
export function liveOutboundEnabled(config: PartnerConfig = partner, env: Record<string, string | undefined> = process.env): boolean {
  return (
    config.brandUsageApproved === true &&
    config.liveOutboundApproval !== null &&
    Boolean(config.liveOutboundApproval?.approvedBy && config.liveOutboundApproval?.approvedAt) &&
    env.PARTNER_LIVE_OUTBOUND === "on" &&
    typeof config.liveConsultationUrl === "string" &&
    /^https:\/\//.test(config.liveConsultationUrl)
  );
}

/** live: 申込ページへ移動する / demo: サイト内の説明ページに留まる */
export const consultationMode: "live" | "demo" = liveOutboundEnabled() ? "live" : "demo";

/** 相談先の許可番号の表示（未確認なら「正式公開時に掲載」） */
export const licenseLabel = partner.licenseNumber ?? "正式公開時に掲載";
