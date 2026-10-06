/**
 * ブランド・運営者・相談導線の設定（唯一の正本）。
 *
 * - メディア名・運営会社名・LP URL・許可番号・表記文言はここだけで管理する。
 *   コンポーネントや記事本文に固有名や URL を直書きしない。
 * - 既定は実在企業名を出さない「中立ブランド」（neutral）。正式な提携・ブランド利用の
 *   許諾が済んだら PARTNER_PROFILE=makecareer（または下の makecareer を既定に）へ切り替える。
 * - 別LP / 計測URL へ差し替える場合は PARTNER_CONSULTATION_URL / PARTNER_CAMPAIGN_ID でも上書きできる。
 *
 * TODO(正式公開前にMakeCareer確認が必要):
 *   - ブランド名・社名表記、相談の無料表記、許可番号、LP URL の最終確認
 *   - 運営者情報（所在地・連絡先）の確定値
 *   - 計測パラメータ（utm_* / campaign_id）の命名規則
 */

export type PartnerProfile = "neutral" | "makecareer";

export type PartnerConfig = {
  profile: PartnerProfile;
  /** メディア名（ロゴ・title に出る） */
  mediaName: string;
  /** メディアの一言説明（ロゴ下・フッター） */
  mediaTagline: string;
  /** 運営会社の法人名（未確定なら説明的な表記） */
  partnerName: string;
  /** ロゴ横・© などに出す短いブランド表記 */
  brandName: string;
  /** サイト上の「運営:」表記 */
  operatorDisplay: string;
  /** スマホなど狭い場所で使う短い運営者表記 */
  operatorShort: string;
  /** 有料職業紹介事業許可番号。未確定（非表示）なら null */
  licenseNumber: string | null;
  /** 主な事業領域（運営者情報に表示） */
  businessAreas: string[];
  /** 相談サービスの説明（相談ページ・CTAで使用） */
  serviceDescription: string;
  /** 相談サービスが対象としている人（相談ページで使用） */
  serviceAudience: string[];
  /** 相談の申込先 */
  consultationUrl: string;
  /**
   * live: 申込先へそのまま移動する / demo: 移動せず「本番ではここから申込ページへ」と説明する
   * （提携前のデモで、実在しない・未確定の申込先に読者を送らないため）
   */
  consultationMode: "live" | "demo";
  /** 計測用キャンペーンID（utm_campaign に入る） */
  campaignId: string;
  /** 相談が無料かどうか。TODO: 表記可否を確認 */
  consultationIsFree: boolean;
  /** 企業サイト。未確定なら null */
  corporateUrl: string | null;
  /** メディアと相談サービスの関係についての表記 */
  disclosure: string;
  /** 相談の流れ（相談ページで表示）。TODO: 実際のフローを確認 */
  consultationSteps: { title: string; body: string }[];
  /** 正式な提携・ブランド利用許諾が済んでいるか。false の間は公開しない */
  brandUsageApproved: boolean;
  /** 運営者情報のうち、正式公開前に確定が必要な項目 */
  pendingCompanyInfo: { address: string | null; contact: string | null; representative: string | null };
  /** 画面上部のプレビューバーの文言（brandUsageApproved=false の間だけ表示） */
  previewNotice: string;
};

const common = {
  businessAreas: ["若手・未経験者向けの転職支援", "人材紹介（有料職業紹介事業）", "キャリア支援"],
  serviceDescription:
    "キャリアアドバイザーが、これまでの経験や希望条件を一緒に整理し、未経験から挑戦できる求人の紹介、応募書類や面接の準備、選考の日程や条件の調整までをサポートします。",
  serviceAudience: [
    "はじめての転職で、何から始めればいいか迷っている方",
    "フリーター・派遣から正社員を目指したい方",
    "接客・販売などから、別の職種を考えている方",
    "未経験の仕事に挑戦したい20代の方",
  ],
  consultationIsFree: true,
  consultationSteps: [
    { title: "相談の申し込み", body: "申し込みページから、希望の連絡方法などを入力します。" },
    { title: "キャリアアドバイザーとの面談", body: "これまでの経験や希望条件、転職したい時期などを一緒に整理します。" },
    { title: "求人の紹介", body: "経験や希望をもとに、未経験から挑戦できる求人を紹介します。応募するかどうかはご自身で決められます。" },
    { title: "応募・選考のサポート", body: "応募書類の準備や面接対策、面接日程の調整をサポートします。" },
    { title: "内定・入社前の確認", body: "労働条件の確認や、入社日などの調整をサポートします。" },
  ],
  brandUsageApproved: false,
  pendingCompanyInfo: { address: null, contact: null, representative: null },
} satisfies Partial<PartnerConfig>;

/** 既定: 実在企業名・ロゴ・許可番号を出さない中立ブランド（提案・デモ用） */
const neutral: PartnerConfig = {
  ...common,
  profile: "neutral",
  mediaName: "はじめて転職ガイド",
  mediaTagline: "20代・未経験転職のための仕事選びメディア",
  partnerName: "人材紹介会社（社名は正式公開時に掲載）",
  brandName: "はじめて転職ガイド",
  operatorDisplay: "人材紹介会社（社名は正式公開時に掲載）",
  operatorShort: "人材紹介会社",
  licenseNumber: null,
  consultationUrl: "https://consultation.example/apply",
  consultationMode: "demo",
  campaignId: "owned-media-demo",
  corporateUrl: null,
  disclosure:
    "当メディアは、人材紹介サービスを提供する会社が運営し、記事や条件整理チェックの中でその会社のキャリア相談サービスをご案内する想定のデモ版です。運営会社名と有料職業紹介事業の許可番号は正式公開時に掲載します。記事の内容は特定の求人や企業への応募をすすめるものではありません。",
  previewNotice: "デモ版 — 運営会社名・許可番号・相談の申込先は正式公開時に掲載します",
};

/** 正式な提携・ブランド利用許諾後に使う（PARTNER_PROFILE=makecareer） */
const makecareer: PartnerConfig = {
  ...common,
  profile: "makecareer",
  mediaName: "未経験転職ノート",
  mediaTagline: "20代・未経験転職のための仕事選びメディア",
  partnerName: "MakeCareer株式会社",
  brandName: "MakeCareer",
  operatorDisplay: "MakeCareer株式会社",
  operatorShort: "MakeCareer株式会社",
  licenseNumber: "13-ユ-313746",
  consultationUrl: "https://lp.make-career.co.jp/tenshoku-01/",
  consultationMode: "live",
  campaignId: "owned-media-mvp",
  corporateUrl: "https://make-career.co.jp/",
  disclosure:
    "当メディアは、人材紹介サービスを提供するMakeCareer株式会社が運営しています。記事や条件整理チェックの中で、当社のキャリア相談サービスをご案内することがあります。記事の内容は特定の求人や企業への応募をすすめるものではありません。",
  previewNotice: "提案用プレビュー（非公開）— 掲載内容・ブランド表記は正式公開前に確認予定です",
};

const selected = process.env.PARTNER_PROFILE === "makecareer" ? makecareer : neutral;

export const partner: PartnerConfig = {
  ...selected,
  consultationUrl: process.env.PARTNER_CONSULTATION_URL || selected.consultationUrl,
  campaignId: process.env.PARTNER_CAMPAIGN_ID || selected.campaignId,
};

/** 許可番号の表示（未確定なら「正式公開時に掲載」） */
export const licenseLabel = partner.licenseNumber ?? "正式公開時に掲載";
