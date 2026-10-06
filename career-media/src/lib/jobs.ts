/**
 * 職種比較データ。求人ではなく「職種の一般的な傾向」を示すもの。
 * 会社・配属によって大きく異なる前提で表示する。
 *
 * level は 1〜5 の相対的な目安（数値の根拠となる統計ではない）。
 */

export type Level = 1 | 2 | 3 | 4 | 5;

export type JobRole = {
  slug: string;
  name: string;
  shortName: string;
  oneLiner: string;
  mainTasks: string[];
  talkLevel: Level;
  talkNote: string;
  pcLevel: Level;
  pcNote: string;
  targetLevel: Level;
  targetNote: string;
  checkBeforeJoining: string[];
  fitExperiences: string[];
  interviewQuestions: string[];
  relatedArticles: string[];
};

export const JOB_ROLES: JobRole[] = [
  {
    slug: "hojin-eigyo",
    name: "法人営業",
    shortName: "営業",
    oneLiner: "企業の担当者の困りごとを聞き、自社の商品やサービスを提案する仕事。",
    mainTasks: [
      "取引先への訪問・オンライン商談",
      "提案資料や見積書の作成",
      "契約後のフォローや追加の提案",
      "社内の関係部署との調整",
    ],
    talkLevel: 5,
    talkNote: "社外の人と話す時間が長い。新規開拓かルート営業かで話す相手と負担の種類が変わる。",
    pcLevel: 3,
    pcNote: "資料作成・商談記録・メールが中心。外出が多い日は少なめ。",
    targetLevel: 5,
    targetNote: "売上・契約件数などの目標があることが多い。",
    checkBeforeJoining: [
      "営業先は新規開拓か、既存顧客か",
      "1日の訪問件数や架電件数の目安",
      "目標の決め方と、未達のときのフォロー",
      "インセンティブの有無と、固定給との割合",
    ],
    fitExperiences: [
      "接客・販売でお客さまにおすすめを提案していた",
      "売上や客単価などの目標を意識して働いていた",
      "初対面の人と話すことに抵抗が少ない",
    ],
    interviewQuestions: [
      "未経験で入社した方は、最初の3か月でどのような目標を持つことが多いですか",
      "営業先は新規と既存でどのくらいの割合ですか",
      "先輩の商談への同行はどのくらいの期間ありますか",
    ],
    relatedArticles: ["eigyo-cs-it-support-chigai", "sekkyaku-keiken-ikasu"],
  },
  {
    slug: "customer-support",
    name: "カスタマーサポート",
    shortName: "カスタマーサポート",
    oneLiner: "商品やサービスを使う人からの問い合わせに、電話・メール・チャットで応える仕事。",
    mainTasks: [
      "電話・メール・チャットでの問い合わせ対応",
      "対応内容の記録と、社内への共有",
      "よくある質問やマニュアルの更新",
      "難しい問い合わせの担当部署への引き継ぎ",
    ],
    talkLevel: 4,
    talkNote: "1日に多くの人と話す。電話中心かテキスト中心かで性質が大きく変わる。",
    pcLevel: 4,
    pcNote: "話しながら入力・検索することが多い。タイピングに慣れていると楽になる。",
    targetLevel: 3,
    targetNote: "対応件数・対応時間・満足度などの指標がある職場もある。",
    checkBeforeJoining: [
      "電話・メール・チャットのどれが中心か",
      "1日の対応件数と、対応時間の指標の有無",
      "クレームや難しい問い合わせを相談できる体制",
      "シフト制か固定勤務か、土日祝の勤務の有無",
    ],
    fitExperiences: [
      "接客でお客さまの問い合わせやクレームに対応していた",
      "相手に合わせて説明のしかたを工夫していた",
      "決まった手順を正確にこなすのが得意",
    ],
    interviewQuestions: [
      "1日にどのくらいの件数の問い合わせに対応することが多いですか",
      "対応に困ったときは、どなたに相談できますか",
      "経験を積んだあと、どのような仕事に広がっていく方が多いですか",
    ],
    relatedArticles: ["eigyo-cs-it-support-chigai", "sekkyaku-keiken-ikasu"],
  },
  {
    slug: "it-support",
    name: "ITサポート（ヘルプデスク）",
    shortName: "ITサポート",
    oneLiner: "パソコンやシステムの「動かない」「分からない」を解決し、仕事が止まらないよう支える仕事。",
    mainTasks: [
      "社内外からのITに関する問い合わせ対応",
      "パソコンの初期設定やアカウントの管理",
      "トラブルの原因の切り分けと、専門部署への引き継ぎ",
      "手順書やFAQの作成",
    ],
    talkLevel: 3,
    talkNote: "問い合わせ対応で人と話すが、調査や設定作業の時間も長い。",
    pcLevel: 5,
    pcNote: "一日の大半をパソコンでの作業に使う。新しい知識を調べる習慣が大切。",
    targetLevel: 2,
    targetNote: "売上目標は少なめ。対応時間や解決率などの指標がある場合もある。",
    checkBeforeJoining: [
      "入社後の研修の内容と期間",
      "社内向け（社内ヘルプデスク）か、顧客向けか",
      "夜間・休日の対応やシフトの有無",
      "資格取得の支援制度と、その後のキャリアの道筋",
    ],
    fitExperiences: [
      "パソコンやスマホの設定を調べて解決するのが好き",
      "手順書やマニュアルを作った・使っていた",
      "困っている人に順を追って説明した経験がある",
    ],
    interviewQuestions: [
      "未経験で入社した方は、どのくらいの期間で一人で対応できるようになりますか",
      "研修ではどのような内容を学びますか",
      "この仕事の経験を積んだあと、どのようなキャリアに進む方が多いですか",
    ],
    relatedArticles: ["eigyo-cs-it-support-chigai", "mikeiken-kenshu-kakunin", "ai-shigoto-mikeiken"],
  },
  {
    slug: "jimu",
    name: "一般事務・営業事務",
    shortName: "事務",
    oneLiner: "書類やデータの作成・管理、電話や来客への対応で、社内の仕事が円滑に進むよう支える仕事。",
    mainTasks: [
      "データ入力・書類の作成と確認",
      "電話・メール・来客への対応",
      "（営業事務）見積書・請求書の作成、受発注の管理",
      "備品の管理や社内からの依頼への対応",
    ],
    talkLevel: 2,
    talkNote: "社内の人や取引先との電話・メールが中心。社外へ出ることは少ない。",
    pcLevel: 4,
    pcNote: "表計算・文書作成ソフトを日常的に使う。正確さが求められる。",
    targetLevel: 1,
    targetNote: "個人の数字の目標はほとんどないことが多い。",
    checkBeforeJoining: [
      "一般事務か、営業事務など特定部署の事務か",
      "表計算ソフトなど、求められるパソコンのスキルの水準",
      "繁忙期（月末・月初など）と残業の目安",
      "電話や来客対応の量",
    ],
    fitExperiences: [
      "レジ締めや在庫確認など、数字を正確に扱っていた",
      "電話対応や受付の経験がある",
      "コツコツとした作業を続けるのが得意",
    ],
    interviewQuestions: [
      "1日の業務のうち、パソコン作業と電話・来客対応はどのくらいの割合ですか",
      "月の中で忙しくなる時期はありますか",
      "使用している表計算ソフトや社内システムを教えてください",
    ],
    relatedArticles: ["sekkyaku-keiken-ikasu", "ai-shigoto-mikeiken"],
  },
];

export const LEVEL_LABELS: Record<"talk" | "pc" | "target", Record<Level, string>> = {
  talk: { 1: "少ない", 2: "やや少ない", 3: "ふつう", 4: "やや多い", 5: "多い" },
  pc: { 1: "少ない", 2: "やや少ない", 3: "ふつう", 4: "やや多い", 5: "多い" },
  target: { 1: "ほぼない", 2: "少なめ", 3: "職場による", 4: "あることが多い", 5: "ほぼある" },
};

export function getJobRole(slug: string): JobRole | undefined {
  return JOB_ROLES.find((r) => r.slug === slug);
}
