/**
 * 記事を探す入口（職種 / 悩み / 今の状況）。
 * カテゴリ（content/categories.json）とは別軸のタグで、1記事に複数付けられる。
 * 見出しは読者が自分で言いそうな言葉にする（業界用語を避ける）。
 */

export type TaxonomyGroup = "roles" | "concerns" | "situations";

export type TaxonomyItem = {
  slug: string;
  /** 一覧・チップに出す短い名前 */
  label: string;
  /** ハブページの見出し（読者の言葉） */
  heading: string;
  /** ハブページの説明 */
  description: string;
  /** lucide アイコン名（CategoryIcon で解決） */
  icon: string;
};

export const TAXONOMY_GROUPS: Record<TaxonomyGroup, { label: string; eyebrow: string; title: string; basePath: string }> = {
  roles: { label: "職種", eyebrow: "BY JOB", title: "職種から探す", basePath: "/jobs" },
  concerns: { label: "悩み", eyebrow: "BY CONCERN", title: "悩みから探す", basePath: "/concerns" },
  situations: { label: "今の状況", eyebrow: "BY SITUATION", title: "今の状況から探す", basePath: "/situations" },
};

export const ROLES: TaxonomyItem[] = [
  { slug: "eigyo", label: "営業", heading: "営業ってどんな仕事？未経験から考えるときに", description: "人と話すのが好き、成果が給料に反映される仕事に興味がある人へ。ノルマのことや向き不向きの確かめ方も。", icon: "handshake" },
  { slug: "jimu", label: "事務", heading: "事務職って未経験でも目指せる？", description: "オフィスで落ち着いて働きたい人へ。仕事内容、PCスキルの目安、求人の探し方まで。", icon: "file-spreadsheet" },
  { slug: "customer-support", label: "カスタマーサポート", heading: "カスタマーサポートの仕事を知る", description: "接客経験が活きやすいオフィスワーク。電話・メール・チャットの違いや働き方を整理します。", icon: "headset" },
  { slug: "it-support", label: "ITサポート", heading: "未経験からのIT、まずはどんな仕事から？", description: "ヘルプデスクなど、ITの入口になりやすい仕事と、入社前に確認したいことをまとめています。", icon: "monitor" },
  { slug: "jinji", label: "人事・採用", heading: "人事・採用の仕事に未経験から近づくには", description: "人と関わる仕事をオフィスで。採用アシスタントなど入口になりやすい仕事と準備を紹介します。", icon: "users" },
  { slug: "hanbai", label: "販売・接客", heading: "販売・接客の経験をどう活かす？", description: "接客・販売で身についた経験を、正社員の仕事や別の職種にどうつなげるかを考えます。", icon: "store" },
  { slug: "sonota", label: "その他の職種", heading: "ほかにはどんな仕事がある？", description: "職種名だけでは分かりにくい仕事の探し方や、やりたいことが決まっていないときの考え方。", icon: "compass" },
];

export const CONCERNS: TaxonomyItem[] = [
  { slug: "kyuryo", label: "給料を上げたい", heading: "給料を上げたい。転職でどう考える？", description: "年収の見方、手取りとの違い、下げたくないときの比べ方。", icon: "wallet" },
  { slug: "donichi", label: "土日休みにしたい", heading: "土日休みの仕事にしたい", description: "休日の書き方の違いや、土日休みが多い仕事の傾向を整理します。", icon: "calendar-days" },
  { slug: "office", label: "オフィスワークに行きたい", heading: "接客・現場からオフィスワークへ", description: "立ち仕事やシフト勤務から、オフィスでの仕事へ移るときに知っておきたいこと。", icon: "building" },
  { slug: "seishain", label: "正社員になりたい", heading: "正社員になりたい", description: "フリーター・派遣・契約社員から正社員を目指すときの進め方。", icon: "badge-check" },
  { slug: "mikeiken-shokushu", label: "未経験の職種に挑戦したい", heading: "未経験の仕事に挑戦したい", description: "経験のない仕事を選ぶときの調べ方、研修の確かめ方、伝え方。", icon: "sprout" },
  { slug: "yametai", label: "今の仕事を辞めたい", heading: "今の仕事を辞めたい・続けるのが不安", description: "辞める前に確認しておきたいことや、次の職場選びで同じことを繰り返さない考え方。", icon: "door-open" },
  { slug: "mensetsu", label: "面接・書類が不安", heading: "面接や書類に自信がない", description: "履歴書・職務経歴書に書くこと、面接で聞かれやすいことの準備。", icon: "message-circle-question-mark" },
  { slug: "yaritai", label: "やりたい仕事が分からない", heading: "やりたい仕事が分からない", description: "向いている仕事が分からないときに、経験と希望から候補をしぼる方法。", icon: "search" },
];

export const SITUATIONS: TaxonomyItem[] = [
  { slug: "freeter", label: "フリーター", heading: "フリーターからの就職・転職", description: "アルバイト経験の伝え方、正社員の求人の探し方、最初に考えること。", icon: "clock" },
  { slug: "haken", label: "派遣社員", heading: "派遣で働いている人の転職", description: "派遣から正社員を考えるときの比べ方や、派遣での経験の伝え方。", icon: "repeat" },
  { slug: "seishain-keiken-sukunai", label: "正社員経験が少ない", heading: "正社員経験が少ない・ない", description: "経験が少なくても準備できること、書類や面接での伝え方。", icon: "user-round" },
  { slug: "sekkyaku", label: "接客・販売の経験", heading: "接客・販売の経験がある", description: "接客や販売で身についた力を、別の職種でどう活かすか。", icon: "store" },
  { slug: "dainishinsotsu", label: "第二新卒", heading: "第二新卒で転職を考えている", description: "入社して数年以内の転職で知っておきたいことや、動くタイミング。", icon: "graduation-cap" },
  { slug: "hajimete", label: "初めての転職", heading: "初めての転職で、何から始める？", description: "転職活動の流れ、相談先の使い方、準備しておくこと。", icon: "flag" },
  { slug: "kaisu", label: "転職回数が多い", heading: "転職回数が気になる", description: "経歴の整理のしかたと、面接での説明の型。", icon: "list-ordered" },
  { slug: "pc-mikeiken", label: "PC仕事が未経験", heading: "パソコンの仕事をしたことがない", description: "事務やITに興味があるけれどPCに自信がないとき、どこから準備するか。", icon: "laptop" },
];

export const TAXONOMY: Record<TaxonomyGroup, TaxonomyItem[]> = { roles: ROLES, concerns: CONCERNS, situations: SITUATIONS };

export function findTaxonomy(group: TaxonomyGroup, slug: string): TaxonomyItem | undefined {
  return TAXONOMY[group].find((t) => t.slug === slug);
}

export function taxonomyPath(group: TaxonomyGroup, slug: string): string {
  return `${TAXONOMY_GROUPS[group].basePath}/${slug}`;
}

/** 職種ハブと /jobs 比較表の対応（比較表に載っている職種だけ） */
export const ROLE_TO_COMPARISON: Record<string, string> = {
  eigyo: "hojin-eigyo",
  jimu: "jimu",
  "customer-support": "customer-support",
  "it-support": "it-support",
};

/** ホームのヒーロー直下に出す、よく選ばれそうな入口 */
export const HERO_SHORTCUTS: { label: string; href: string }[] = [
  { label: "未経験転職", href: "/concerns/mikeiken-shokushu" },
  { label: "フリーターから正社員", href: "/situations/freeter" },
  { label: "接客経験を活かす", href: "/situations/sekkyaku" },
  { label: "事務職", href: "/jobs/jimu" },
  { label: "ITサポート", href: "/jobs/it-support" },
  { label: "土日休み", href: "/concerns/donichi" },
  { label: "年収を下げたくない", href: "/concerns/kyuryo" },
];
