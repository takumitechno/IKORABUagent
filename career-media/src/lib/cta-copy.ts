/**
 * 記事の中の相談 CTA の文言を、記事のカテゴリ（先頭のカテゴリ）に合わせて変える。
 * 方針: はじめて・未経験の転職は、転職のプロ（人材紹介会社のキャリアアドバイザー）に相談しながら進めるのをすすめる。
 * 成果の保証（必ず内定・年収が上がる など）は書かない。
 */
export type CtaCopy = { heading: string; lead: string; label: string };

const DEFAULT: CtaCopy = {
  heading: "仕事選びと応募の準備を相談する",
  lead: "会社選びから面接の練習まで、キャリアアドバイザーに相談しながら準備できます。応募するかどうかは、ご自身で決められます。",
  label: "キャリア相談を申し込む",
};

const BY_CATEGORY: Record<string, CtaCopy> = {
  mikeiken: {
    heading: "未経験の仕事への応募を相談する",
    lead: "応募条件の確認や、これまでの経験の伝え方を、キャリアアドバイザーと一緒に考えられます。",
    label: "未経験の転職を相談する",
  },
  shokushu: {
    heading: "仕事内容と応募条件を確認する",
    lead: "求人票だけでは分からない仕事の中身や職場のことを、キャリアアドバイザーに聞いてから会社を選べます。",
    label: "職種・会社選びを相談する",
  },
  keiken: {
    heading: "経験を、応募書類や面接で伝える",
    lead: "接客やアルバイトで担当した仕事・工夫したことを整理し、応募先に合わせた伝え方を一緒に考えます。",
    label: "経験の活かし方を相談する",
  },
  "shorui-mensetsu": {
    heading: "面接の練習と書類の添削を相談する",
    lead: "応募先に合わせた模擬面接や、履歴書・職務経歴書の添削を受けてから本番にのぞめます。",
    label: "面接・書類の準備を相談する",
  },
  hatarakikata: {
    heading: "給料と休日の条件を比較する",
    lead: "求人票の条件の見方や、求人票には書かれていない働き方のことを、キャリアアドバイザーに確かめてもらえます。",
    label: "働く条件を相談する",
  },
  junbi: {
    heading: "応募までの準備を相談する",
    lead: "いつ動くか、何から始めるかを、経験と希望をもとに一緒に考えてもらえます。日程の調整も任せられます。",
    label: "転職の進め方を相談する",
  },
  seido: {
    heading: "退職・入社のタイミングを相談する",
    lead: "制度の手続きを確かめながら、いつ辞めていつ入社するかなど、転職の進め方をキャリアアドバイザーに相談できます。",
    label: "転職の進め方を相談する",
  },
};

export function ctaCopy(categorySlug?: string): CtaCopy {
  return (categorySlug && BY_CATEGORY[categorySlug]) || DEFAULT;
}
