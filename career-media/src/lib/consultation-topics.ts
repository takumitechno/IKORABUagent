import type { Answers } from "./condition-check/questions";

/** Examples of preparation, not testimonials or promised job offers. */
export const CONSULTATION_TOPICS = [
  {
    id: "experience", label: "接客の経験を活かしたい", short: "経験の伝え方",
    title: "接客の経験を、書類や面接で伝える。",
    help: "担当した仕事や工夫を整理し、応募先に合わせた伝え方を一緒に考えます。",
    outcome: "「何を書けばいい？」から、伝えたい経験がある状態へ。",
    consult: "経験の伝え方を相談する", article: "sekkyaku-keiken-ikasu", read: "職務経歴書の例文を読む",
    note: "応募書類には、ご自身が実際に経験したことだけを書きましょう。",
    question: "接客で工夫していたことは、何ですか？",
    conversationTitle: "接客経験を、応募先に伝えるには",
    opening: "接客は続けてきましたが、事務の応募書類にどう書けばいいか迷っています。",
    prepare: "担当した仕事と工夫したことを1つずつ。気になる求人があれば、仕事内容も確認しておきましょう。",
    ask: "応募先で活かせる経験は何ですか？ 必要なPC操作は、何から練習するとよいですか？",
  },
  {
    id: "conditions", label: "給料も、休みも大切", short: "給料と休み",
    title: "給料と休みを、まとめて比べる。",
    help: "年収の内訳と休日の違いを確認し、大切にしたい条件と求人ごとに聞くことを整理します。",
    outcome: "「どっちがいい？」から、確かめるポイントがある状態へ。",
    consult: "働く条件を相談する", article: "donichi-yasumi-nenshu-hikaku", read: "年収と休日の計算例を読む",
    note: "架空の求人による比較例です。実際の紹介求人や、待遇の保証ではありません。",
    question: "給料・休日・仕事内容で、いちばん守りたいのは？",
    conversationTitle: "給料と休みを、同じ基準で比べるには",
    opening: "毎月の給料を下げたくないです。土日休みの求人と、条件をそろえて比べたいです。",
    prepare: "希望する月収・休日と、譲れる条件をメモしましょう。金額が未定でも構いません。",
    ask: "月給の内訳と初年度の賞与は？ 土日出勤や試用期間の条件はありますか？",
  },
  {
    id: "first-job", label: "正社員経験が少ない", short: "初めての転職",
    title: "初めての応募に向けて、準備を進める。",
    help: "アルバイトの経験や気になる仕事をもとに、応募までに必要な準備を一緒に考えます。",
    outcome: "「何を話そう？」から、聞きたいことがある状態へ。",
    consult: "初めての転職を相談する", article: "agent-mendan-mae", read: "初めての相談で話すことを読む",
    note: "架空の相談メモです。志望動機や応募書類は、完成していなくても大丈夫です。",
    question: "続けてきたこと、これから変えたいことは？",
    conversationTitle: "初めての応募で、準備することは",
    opening: "正社員の経験は少ないです。アルバイトの経験をどう伝えるか、最初の準備から相談したいです。",
    prepare: "働いた期間、担当した仕事、今変えたいことをメモしましょう。志望動機は完成していなくても大丈夫です。",
    ask: "今の経験で検討できる仕事は？ 最初に準備する書類と、応募までの順番を教えてください。",
  },
] as const;

export type ConsultationTopic = typeof CONSULTATION_TOPICS[number];
export type ConsultationTopicId = ConsultationTopic["id"];

/** 本人の回答から話題の初期値を選ぶだけ。適職の判定や、回答の送信はしない。 */
export function checkConsultationTopic(answers: Answers): ConsultationTopicId {
  if (["income", "holidays"].includes(answers.priority?.[0] ?? "")) return "conditions";
  if (answers.experiences?.includes("none")) return "first-job";
  return "experience";
}

/** 相談テーマはサイト内のデモだけで保持し、承認された外部URLは変更しない。 */
export function withConsultationTopic(href: string, topic: ConsultationTopicId): string {
  return /^\/consultation\/apply(?:\?|#|$)/.test(href) ? `${href.split("#")[0]}#support-${topic}` : href;
}
