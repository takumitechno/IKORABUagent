import type { ConsultationTopicId } from "./consultation-topics";

/** 既存本文の要点と、読後に準備すること。適職判定・求人の推薦ではない。 */
export type ArticleGuide = {
  topic: ConsultationTopicId;
  displayTitle: string;
  answer: string;
  points: [string, string, string];
  question: string;
  next: { slug: string; label: string };
};

export const ARTICLE_GUIDES: Record<string, ArticleGuide> = {
  "sekkyaku-keiken-ikasu": {
    displayTitle: "接客経験を、転職で活かすには？",
    topic: "experience",
    answer: "接客で担当した仕事や工夫を、具体的に伝えましょう。",
    points: ["注文や要望を聞く → 相手の話を整理する経験。", "混雑時の対応 → 優先順位を決めて動いた経験。", "新人への説明 → 手順を分かりやすく伝えた経験。"],
    question: "接客で工夫したことは、どの職種の仕事とつながりますか？",
    next: { slug: "sekkyaku-office", label: "接客とオフィスワークの違いを読む" },
  },
  "sekkyaku-office": {
    displayTitle: "接客からオフィスワークへ。何が変わる？",
    topic: "experience",
    answer: "接客の経験を活かしつつ、仕事内容の違いを比べよう。",
    points: ["事務・営業事務・カスタマーサポートで、担当する業務を比べる。", "電話対応や人と話す量、パソコン作業を確認する。", "研修の内容と、入社前に必要な操作を求人ごとに聞く。"],
    question: "自分の接客経験が活かせる業務と、覚える必要がある業務は何ですか？",
    next: { slug: "jimu-mikeiken-mae", label: "事務の仕事と、必要なパソコン操作を読む" },
  },
  "donichi-yasumi-nenshu-hikaku": {
    displayTitle: "土日休みと年収、どう比べる？",
    topic: "conditions",
    answer: "給料と休みは、同じ項目をそろえて比べよう。",
    points: ["月給だけでなく、基本給・固定残業代・賞与を分けて見る。", "「土日休み」の表記と、年間休日・休日出勤を確認する。", "残業や通勤も含め、自分が続けられる働き方かを考える。"],
    question: "給料と休みを両方重視するとき、どこまでが現実的な比較範囲ですか？",
    next: { slug: "nenshu-dake-erabanai", label: "条件に優先順位をつける方法を読む" },
  },
  "shokumu-keirekisho-arubaito": {
    displayTitle: "アルバイト経験の職務経歴書、どう書く？",
    topic: "experience",
    answer: "アルバイト経験も、担当業務と工夫から書き出せる。",
    points: ["勤務先・期間・担当した仕事を、まず事実で整理する。", "気をつけたことや改善したことを、一つの場面で説明する。", "数値や役割は、実際に確認できる範囲で書く。"],
    question: "このアルバイト経験を、応募先に伝わる職務経歴書にするには？",
    next: { slug: "agent-mendan-mae", label: "書き出した経験を、相談に持っていく準備を読む" },
  },
  "koteizangyo-kyujin": {
    displayTitle: "固定残業代の求人、どこを見る？",
    topic: "conditions",
    answer: "固定残業代のある求人は、3項目を分けて確認。",
    points: ["固定残業代を除いた基本給はいくらか。", "固定残業代の金額と、それに対応する時間数は何か。", "その時間を超えた残業代の支払いと、実際の残業状況はどうか。"],
    question: "求人の月給には何が含まれ、実際の残業はどのくらいですか？",
    next: { slug: "tedori-20man-hikaku", label: "求人の給与と手取りの見方を読む" },
  },
  "agent-mendan-mae": {
    displayTitle: "エージェント面談の前に、何を準備する？",
    topic: "first-job",
    answer: "相談前に、希望職種を決めきる必要はありません。",
    points: ["これまでの仕事と、転職を考えた理由をメモする。", "給料・休み・勤務地など、まず大事にしたい条件を選ぶ。", "まだ決められないことも、聞きたい質問として持っていく。"],
    question: "まだ職種を決めていません。経験と希望条件から一緒に整理できますか？",
    next: { slug: "agent-soudan-nani", label: "実際に使える、相談の切り出し方を読む" },
  },
  "tedori-20man-hikaku": {
    displayTitle: "手取り20万円を守る、求人の比べ方",
    topic: "conditions",
    answer: "手取りを守りたいなら、求人の月給だけで決めない。",
    points: ["今の給与明細で、額面・手取り・控除を確認する。", "転職先の基本給・固定残業代・賞与を分けて比べる。", "手取りは税や保険などで変わるため、概算を確定額として扱わない。"],
    question: "この給与条件で、生活に必要な収入を維持できるか確認したいです。",
    next: { slug: "nenshu-300man-tenshoku", label: "今の年収を内訳に分けて、下がるか上がるかを考える" },
  },
  "freeter-seishain-hajimeni": {
    displayTitle: "フリーターから正社員へ。何から始める？",
    topic: "first-job",
    answer: "担当した仕事と、希望する働き方を書き出すところから。",
    points: ["正社員かどうかに加え、仕事内容と試用期間の条件を確認する。", "アルバイトで担当した仕事と、工夫したことをメモする。", "空白期間は、事実と今の準備を分けて説明する。"],
    question: "正社員の経験が少ない場合、経験をどう伝え、何を確認すればいいですか？",
    next: { slug: "shokumu-keirekisho-arubaito", label: "アルバイト経験の書き方を、記入例で読む" },
  },
  "mikeiken-tenshoku-hajimekata": {
    displayTitle: "未経験転職、最初にする5つのこと",
    topic: "first-job",
    answer: "応募を増やす前に、経験と希望を整理しよう。",
    points: ["転職したい理由と、今までに担当した仕事を分けて書く。", "希望条件は、ゆずれないものと相談できるものに分ける。", "職種をいくつか比べ、準備に必要な時間を確認する。"],
    question: "今の経験と希望条件から、まず比較する職種を整理したいです。",
    next: { slug: "agent-mendan-mae", label: "初めての相談で、準備することを読む" },
  },
  "jimu-mikeiken-mae": {
    displayTitle: "未経験で事務職へ。応募前の確認ポイント",
    topic: "experience",
    answer: "「事務」を一つの仕事として考えず、業務から比べよう。",
    points: ["一般事務・営業事務・経理事務などで、担当業務を確認する。", "入力・メール・表計算など、求人が求める操作を確認する。", "接客の電話対応や確認作業が、どの業務につながるか整理する。"],
    question: "この事務求人では、入社前にどの操作が必要で、何を研修で学べますか？",
    next: { slug: "pc-nigate-jimu", label: "入社前のPC操作を、練習の順番で確かめる" },
  },
  "pc-nigate-jimu": {
    displayTitle: "PCが苦手でも、事務職は目指せる？",
    topic: "experience",
    answer: "目指せます。よく使う操作を知り、苦手なところから練習しよう。",
    points: ["文字入力・メール・表計算・文書作成・ファイル整理のどこが苦手かを分ける。", "2週間なら、タイピングと1か月分の支出表づくりから始められる。", "面接では、今できる操作と続けている練習をセットで伝える。"],
    question: "この求人で入社時に必要な操作と、入社後に教わる操作はどれですか？",
    next: { slug: "jimu-mikeiken-mae", label: "事務の種類と、応募前の確認ポイントを読む" },
  },
  "web-marketing-mikeiken": {
    displayTitle: "未経験でWebマーケへ。最初に確かめること",
    topic: "experience",
    answer: "「SNSが好き」から、担当する業務を具体的に見よう。",
    points: ["投稿制作・広告運用・記事制作・分析など、求人の業務を分ける。", "自分が担当する範囲と、教わる相手・研修内容を聞く。", "文章や数値の整理など、応募前に試せる作業から始める。"],
    question: "未経験で入る場合、最初に担当する業務と教わる体制はどうなっていますか？",
    next: { slug: "mikeiken-tenshoku-hajimekata", label: "応募前の経験・条件整理に戻る" },
  },
  "donichi-yasumi-shigoto": {
    displayTitle: "土日休みの仕事、どう探す？",
    topic: "conditions",
    answer: "職種名より、誰に合わせて働く仕事かと、求人票の休日欄で確かめよう。",
    points: ["取引先や社内の人が相手の仕事は、平日が中心になりやすい。", "「完全週休2日制（土・日）」のように、曜日まで書かれているかを見る。", "年間休日の日数と、土日に出勤する月があるかを面接で聞く。"],
    question: "この求人で土日に出勤する日はありますか？部署が変わってシフト勤務になる可能性はありますか？",
    next: { slug: "donichi-yasumi-nenshu-hikaku", label: "休日と年収を、同じ基準で比べる方法を読む" },
  },
  "nenshu-300man-tenshoku": {
    displayTitle: "年収300万円からの転職、給料はどうなる？",
    topic: "conditions",
    answer: "下がるかどうかは、今の給料の中身と求人の条件で変わります。",
    points: ["今の年収を、毎月決まる分・働き方で変わる分・賞与に分ける。", "求人の年収は、固定残業代・賞与の実績・試用期間中の給与まで確かめる。", "生活に必要な手取りから、これ以上は下げられない金額を決める。"],
    question: "今の年収の内訳と比べて、この求人の給与は1年目と数年後でどう変わりますか？",
    next: { slug: "donichi-yasumi-nenshu-hikaku", label: "年収と休日を、同じ基準で比べる方法を読む" },
  },
  "nenshu-dake-erabanai": {
    displayTitle: "年収だけで選ばない、転職の条件整理",
    topic: "conditions",
    answer: "年収に加えて、自分が続けられる条件を比べよう。",
    points: ["生活に必要な収入と、希望する収入を分けて考える。", "休日・残業・勤務地・仕事内容を同じ表に並べる。", "迷った条件は、相談で確認する質問に変える。"],
    question: "収入を守りながら働き方を変えるなら、条件の優先順位をどう考えればいいですか？",
    next: { slug: "koteizangyo-kyujin", label: "給与条件で見落としやすい、固定残業代を読む" },
  },
  "26sai-mikeiken": {
    displayTitle: "26歳の未経験転職、何を準備する？",
    topic: "first-job",
    answer: "26歳という年齢だけで、応募しやすさは判断できません。",
    points: ["「未経験可」でも、仕事内容と応募条件を求人ごとに確認する。", "これまでの担当業務を、応募先で活かせる経験として整理する。", "年齢制限の原則と例外は、採用されやすさの根拠とは分けて考える。"],
    question: "26歳で職種を変える場合、今の経験と求人の応募条件をどう照らし合わせればいいですか？",
    next: { slug: "mikeiken-tenshoku-hajimekata", label: "年齢より先に整理したい、転職準備の5項目を読む" },
  },
  "agent-soudan-nani": {
    displayTitle: "転職相談で何を話す？切り出し方の例",
    topic: "first-job",
    answer: "うまく説明しようとせず、今の困りごとから話そう。",
    points: ["「何の仕事が向いているか分からない」から始めてよい。", "給料や休みなど、気になる条件を具体的に一つ伝える。", "分からないことは、確認したい質問としてそのまま持っていく。"],
    question: "転職するかもまだ迷っています。今の困りごとから相談できますか？",
    next: { slug: "tenshoku-agent-merit", label: "相談サービスの支援内容・費用・限界を読む" },
  },
  "tenshoku-agent-merit": {
    displayTitle: "転職エージェント、何を頼める？",
    topic: "first-job",
    answer: "支援内容と限界を知って、自分で使い方を選ぼう。",
    points: ["求人紹介・書類・面接など、受けられる支援を確認する。", "相談先の対象条件と、紹介できる求人の範囲を確認する。", "紹介や支援は、内定・年収アップの保証ではありません。"],
    question: "自分が対象になるかと、受けられる支援・紹介できる求人の範囲を知りたいです。",
    next: { slug: "agent-soudan-nani", label: "最初の相談で使える、質問の例を読む" },
  },
};
