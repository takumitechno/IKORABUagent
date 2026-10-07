import type { MotifName } from "@/lib/illustrations/motifs";

/**
 * 読者導線（ガイド）。既存の記事・職種比較・条件整理チェック・相談説明を、読む順番に並べたもの。
 *
 * - 相談しなくても、記事とチェックだけで判断の材料がそろう順番にする（相談は最後の任意の一歩）。
 * - 相談を急ぐ人は、どのページからでも /consultation に直接行ける（ガイドを通ることを必須にしない）。
 * - patternId は計測（イベントの pattern_id）で、どの導線から来たかを比べるために使う。
 */

export type JourneyStep =
  | { kind: "article"; slug: string; label: string; why: string; scene: MotifName; side?: { slug: string; label: string } }
  | { kind: "jobs"; href: string; label: string; why: string; scene: MotifName }
  | { kind: "check"; label: string; why: string; scene: MotifName }
  | { kind: "consult"; label: string; why: string; scene: MotifName };

export type Journey = {
  id: string;
  patternId: string;
  /** ガイドの名前（読者の言葉で） */
  title: string;
  /** 短い名前（カード・パンくず用） */
  shortTitle: string;
  /** 誰のためのガイドか */
  who: string;
  /** このガイドを読み終えると分かること */
  outcome: string;
  /** ガイドを表示する入口ページ（先頭が代表） */
  hubs: string[];
  scene: MotifName;
  tone: string;
  steps: JourneyStep[];
  /** 求人を見るとき・相談するときに聞くこと（そのまま使える質問） */
  questions: string[];
};

export const JOURNEYS: Journey[] = [
  {
    id: "sekkyaku-office",
    patternId: "journey-a-sekkyaku-office",
    title: "接客の経験から、オフィスワークへ",
    shortTitle: "接客からオフィスワークへ",
    who: "接客・販売の仕事をしてきて、事務やカスタマーサポートなど座ってする仕事も考えている人",
    outcome: "接客で身についた経験の言い方、オフィスワークで変わること、職種ごとの違い、求人で確認することが分かります。",
    hubs: ["/situations/sekkyaku", "/concerns/office"],
    scene: "desk",
    tone: "bg-sand",
    steps: [
      { kind: "article", slug: "sekkyaku-keiken-ikasu", label: "接客の経験を分けて、使える経験を見つける", why: "「接客をしていました」を、ほかの仕事でも通じる経験の言葉に分けます。", scene: "star" },
      { kind: "article", slug: "sekkyaku-office", label: "オフィスワークで何が変わるかを知る", why: "座り仕事・決まった勤務時間・電話やメール中心。変わることを先に知っておきます。", scene: "desk" },
      { kind: "jobs", href: "/jobs", label: "事務・カスタマーサポート・ITサポートを比べる", why: "人と話す量・パソコン作業・数字の目標を、同じ表で比べます。", scene: "scale" },
      {
        kind: "article",
        slug: "jimu-mikeiken-mae",
        label: "PC・電話・勤務条件を確認する",
        why: "事務の種類ごとの違い、求められやすいPC操作、電話や来客の対応を確認します。",
        scene: "laptop",
        side: { slug: "pc-nigate-jimu", label: "PCに自信がないときは" },
      },
      { kind: "check", label: "自分の条件を整理する", why: "ゆずれない条件・比べたい職種・求人で確認することを一覧にします（約3分・登録不要）。", scene: "checklist" },
      { kind: "consult", label: "相談するなら、聞くことをまとめておく", why: "具体的な求人で考えたくなったら、下の質問をそのまま使えます。", scene: "chat" },
    ],
    questions: [
      "接客の経験は、事務やカスタマーサポートのどんな仕事で活かせそうですか",
      "入社時に求められるパソコン操作は、どのくらいですか（表計算ソフトの関数など）",
      "電話や来客の対応は、1日にどのくらいありますか",
      "研修の期間と、配属後に教えてくれる人がいるかを教えてください",
      "土日祝が休みの求人は、どの職種に多いですか",
    ],
  },
  {
    id: "kyuryo-donichi",
    patternId: "journey-b-kyuryo-donichi",
    title: "給料は下げずに、休みも増やしたい",
    shortTitle: "給料と休みを両方見る",
    who: "今の給料は下げたくない。でも、土日休みや年間休日も改善したい人",
    outcome: "額面と手取りの違い、提示年収の中身、年間休日と完全週休2日制の見方、ゆずれない順番の決め方が分かります。",
    hubs: ["/concerns/kyuryo", "/concerns/donichi"],
    scene: "scale",
    tone: "bg-coral",
    steps: [
      { kind: "article", slug: "tedori-20man-hikaku", label: "額面と手取りを分けて、今の給料をつかむ", why: "求人の「月給」と毎月の手取りは、そのまま比べるとずれます。まず今の数字を分けます。", scene: "coins" },
      { kind: "article", slug: "nenshu-300man-tenshoku", label: "提示年収の中身と、1年目・数年後を分けて考える", why: "基本給・固定残業代・賞与の内訳と、数年後の見通しを確認します。", scene: "stairs" },
      {
        kind: "article",
        slug: "donichi-yasumi-nenshu-hikaku",
        label: "年間休日と時給換算で、休みと給料をそろえて比べる",
        why: "「完全週休2日制」と「週休2日制」の違い、年間休日、1時間あたりの金額で比べます。",
        scene: "calendar",
        side: { slug: "donichi-yasumi-shigoto", label: "土日休みになりやすい仕事は" },
      },
      { kind: "article", slug: "nenshu-dake-erabanai", label: "ゆずれない順番を決める", why: "年収だけで選ばず、休み・時間・仕事内容のどれを優先するかを決めます。", scene: "list" },
      { kind: "check", label: "自分の条件を整理する", why: "収入・休日・残業・勤務地の条件を「ゆずれない」と「できれば」に分けます（約3分・登録不要）。", scene: "checklist" },
      { kind: "consult", label: "求人を見るとき・相談するときに確認すること", why: "求人票だけで分からないことは、下の質問で確認できます。", scene: "chat" },
    ],
    questions: [
      "想定年収の内訳（基本給・固定残業代・賞与・手当）を教えてください",
      "固定残業代は何時間分で、超えた分は別に支払われますか",
      "年間休日は何日で、完全週休2日制ですか",
      "1年目の年収と、数年後の年収の幅はどのくらいですか",
      "土日祝に出勤が必要になることはありますか",
    ],
  },
  {
    id: "freeter-hajimete",
    patternId: "journey-c-freeter-hajimete",
    title: "正社員の経験が少なくても、最初の一歩を決めたい",
    shortTitle: "フリーターから最初の一歩",
    who: "フリーター・アルバイト中心で、正社員の経験が少ない・ない人",
    outcome: "正社員とアルバイトの違い、アルバイト経験の書き方、未経験転職で最初に整理すること、相談の前に準備することが分かります。",
    hubs: ["/situations/freeter", "/situations/seishain-keiken-sukunai"],
    scene: "flag",
    tone: "bg-lime",
    steps: [
      { kind: "article", slug: "freeter-seishain-hajimeni", label: "正社員とアルバイトの違いと、最初に確認すること", why: "働き方の違いと、空白期間やアルバイト経験の伝え方の基本を知ります。", scene: "badge" },
      {
        kind: "article",
        slug: "shokumu-keirekisho-arubaito",
        label: "アルバイトの経験を、伝わる言葉にする",
        why: "担当した仕事と工夫したことを、職務経歴書の形で書き出します。",
        scene: "idcard",
        side: { slug: "rirekisho-kakukoto-nai", label: "履歴書の欄が埋まらないときは" },
      },
      { kind: "article", slug: "mikeiken-tenshoku-hajimekata", label: "未経験転職で、最初に整理する5つのこと", why: "転職したい理由・経験・希望条件・比べる職種・スケジュールを順番に整理します。", scene: "compass" },
      { kind: "article", slug: "agent-mendan-mae", label: "はじめての相談の前に、決めておくこと", why: "決めておくことと、まだ決めなくていいことを分けます。", scene: "interview" },
      { kind: "check", label: "自分の条件を整理する", why: "経験と希望を選ぶだけで、比べたい職種と聞きたいことが一覧になります（約3分・登録不要）。", scene: "checklist" },
      { kind: "consult", label: "相談するなら、聞くことをまとめておく", why: "はじめての相談でも、下の質問から始めれば話しやすくなります。", scene: "chat" },
    ],
    questions: [
      "アルバイトの経験は、応募書類にどう書けば伝わりますか",
      "正社員の経験がなくても応募しやすいのは、どんな求人ですか",
      "空白期間について、面接でどう説明すればいいですか",
      "入社後の研修や、未経験で入社した人へのフォローはありますか",
      "雇用形態（正社員かどうか）と、試用期間の条件を確認したいです",
    ],
  },
];

export const JOURNEY_ANCHOR = "guide";

/** 入口ページに表示するガイド */
export function journeyForHub(path: string): Journey | undefined {
  return JOURNEYS.find((j) => j.hubs.includes(path));
}

/** 記事が含まれるガイドと、その中での位置 */
export function journeyForArticle(slug: string): { journey: Journey; index: number } | undefined {
  for (const journey of JOURNEYS) {
    const index = journey.steps.findIndex((s) => s.kind === "article" && s.slug === slug);
    if (index >= 0) return { journey, index };
  }
  return undefined;
}

/** ステップのリンク先 */
export function stepHref(step: JourneyStep, journey: Journey): string {
  switch (step.kind) {
    case "article":
      return `/articles/${step.slug}`;
    case "jobs":
      return step.href;
    case "check":
      return "/check";
    case "consult":
      return `${journey.hubs[0]}#${JOURNEY_ANCHOR}-questions`;
  }
}

/** ガイドで使う記事の slug（テストで公開済みかを確かめる） */
export const journeyArticleSlugs = () => JOURNEYS.flatMap((j) => j.steps.flatMap((s) => (s.kind === "article" ? [s.slug, ...(s.side ? [s.side.slug] : [])] : [])));
