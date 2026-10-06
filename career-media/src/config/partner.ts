/**
 * 相談導線の設定（唯一の正本）。
 *
 * - 相談先の会社名・LP URL・許可番号・表記文言はここだけで管理する。
 *   コンポーネントや記事本文に固有名や URL を直書きしない。
 * - 別LP / 計測URL / 別の提携先へ差し替える場合はこのファイル（または
 *   PARTNER_CONSULTATION_URL / PARTNER_CAMPAIGN_ID 環境変数）だけを変更する。
 *
 * TODO(正式公開前にMakeCareer確認が必要):
 *   - ブランド名・社名表記、相談の無料表記、許可番号、LP URL の最終確認
 *   - 運営者情報（所在地・連絡先）の確定値
 *   - 計測パラメータ（utm_* / campaign_id）の命名規則
 */

export type PartnerConfig = {
  /** 法人名 */
  partnerName: string;
  /** 短いブランド表記 */
  brandName: string;
  /** サイト上の「運営:」表記 */
  operatorDisplay: string;
  /** 有料職業紹介事業許可番号 */
  licenseNumber: string;
  /** 主な事業領域（運営者情報に表示） */
  businessAreas: string[];
  /** 相談サービスの説明（相談ページ・CTAで使用） */
  serviceDescription: string;
  /** 相談サービスが対象としている人（相談ページで使用） */
  serviceAudience: string[];
  /** 相談の申込先（既存LP） */
  consultationUrl: string;
  /** 計測用キャンペーンID（utm_campaign に入る） */
  campaignId: string;
  /** 相談が無料かどうか。TODO: 表記可否を確認 */
  consultationIsFree: boolean;
  /** 企業サイト */
  corporateUrl: string;
  /** メディアと相談サービスの関係についての表記 */
  disclosure: string;
  /** 相談の流れ（相談ページで表示）。TODO: 実際のフローをMakeCareerに確認 */
  consultationSteps: { title: string; body: string }[];
  /** 正式な提携・ブランド利用許諾が済んでいるか。false の間は公開しない */
  brandUsageApproved: boolean;
  /** 運営者情報のうち、正式公開前に確定が必要な項目 */
  pendingCompanyInfo: { address: string | null; contact: string | null; representative: string | null };
  /** 画面上部のプレビューバーの文言（brandUsageApproved=false の間だけ表示） */
  previewNotice: string;
};

const base: PartnerConfig = {
  partnerName: "MakeCareer株式会社",
  brandName: "MakeCareer",
  operatorDisplay: "MakeCareer株式会社",
  licenseNumber: "13-ユ-313746",
  businessAreas: ["若手・未経験者向けの転職支援", "人材紹介（有料職業紹介事業）", "キャリア支援"],
  serviceDescription:
    "キャリアアドバイザーが、これまでの経験や希望条件を一緒に整理し、未経験から挑戦できる求人の紹介、応募書類や面接の準備、選考の日程や条件の調整までをサポートします。",
  serviceAudience: [
    "既卒・第二新卒で、正社員としての就職・転職を考えている方",
    "フリーターから正社員を目指したい方",
    "正社員経験が少なく、何から始めればいいか迷っている方",
    "未経験の職種に挑戦したい20代の方",
  ],
  consultationUrl: "https://lp.make-career.co.jp/tenshoku-01/",
  campaignId: "owned-media-mvp",
  consultationIsFree: true,
  corporateUrl: "https://make-career.co.jp/",
  disclosure:
    "当メディアは、人材紹介サービスを提供するMakeCareer株式会社が運営しています。記事や条件整理チェックの中で、当社のキャリア相談サービスをご案内することがあります。記事の内容は特定の求人や企業への応募をすすめるものではありません。",
  consultationSteps: [
    { title: "相談の申し込み", body: "申し込みページから、希望の連絡方法などを入力します。" },
    { title: "キャリアアドバイザーとの面談", body: "これまでの経験や希望条件、転職したい時期などを一緒に整理します。" },
    { title: "求人の紹介", body: "経験や希望をもとに、未経験から挑戦できる求人を紹介します。応募するかどうかはご自身で決められます。" },
    { title: "応募・選考のサポート", body: "応募書類の準備や面接対策、面接日程の調整をサポートします。" },
    { title: "内定・入社前の確認", body: "労働条件の確認や、入社日などの調整をサポートします。" },
  ],
  brandUsageApproved: false,
  // TODO(正式公開前にMakeCareer確認が必要): 確定値を受領するまで null（画面には「確認中」と表示）
  pendingCompanyInfo: { address: null, contact: null, representative: null },
  previewNotice: "提案用プレビュー（非公開）— 掲載内容・ブランド表記は正式公開前に確認予定です",
};

/**
 * 社名・許可番号・相談先をすべて架空のサンプルに置き換えたデモ用プロファイル。
 * 実在企業の名義を使わずに画面を共有するとき（例: デモ用の静的スナップショット）に
 * PARTNER_PROFILE=demo で使う。
 */
const demo: PartnerConfig = {
  ...base,
  partnerName: "サンプルキャリア株式会社（架空）",
  brandName: "SampleCareer",
  operatorDisplay: "サンプルキャリア株式会社（架空の運営会社）",
  licenseNumber: "00-ユ-000000（架空）",
  consultationUrl: "https://consultation.example/apply",
  campaignId: "demo",
  corporateUrl: "https://company.example/",
  disclosure:
    "当メディアは、人材紹介サービスを提供する運営会社（デモでは架空のサンプルキャリア株式会社）が運営する想定です。記事や条件整理チェックの中で、運営会社のキャリア相談サービスをご案内します。記事の内容は特定の求人や企業への応募をすすめるものではありません。",
  previewNotice: "デモ版 — 運営会社名・許可番号・相談先はすべて架空のサンプル表記です",
};

const selected = process.env.PARTNER_PROFILE === "demo" ? demo : base;

export const partner: PartnerConfig = {
  ...selected,
  consultationUrl: process.env.PARTNER_CONSULTATION_URL || selected.consultationUrl,
  campaignId: process.env.PARTNER_CAMPAIGN_ID || selected.campaignId,
};
