/**
 * 未経験転職 条件整理チェックの設問定義。
 *
 * - 合否や適性を判定するものではなく、本人が希望・経験・比較対象・次の行動を
 *   整理するためのもの。
 * - 自由記述・氏名・連絡先などの個人情報は扱わない（選択肢 ID のみ）。
 */

export const CHECK_VERSION = "2026-10-v2";

export type Option = { id: string; label: string };

export type Question = {
  id: QuestionId;
  title: string;
  help?: string;
  type: "single" | "multi";
  /** multi のときの最大選択数 */
  max?: number;
  options: Option[];
};

export type QuestionId =
  | "status"
  | "timing"
  | "experiences"
  | "strengths"
  | "location"
  | "income"
  | "holidays"
  | "hours"
  | "priority"
  | "talk"
  | "pc"
  | "avoid"
  | "learning";

export type Step = { id: string; title: string; shortTitle: string; description: string; questions: Question[] };

export const STEPS: Step[] = [
  {
    id: "now",
    shortTitle: "状況",
    title: "いまの状況",
    description: "まずは現在の状況と、転職を考えている時期を教えてください。",
    questions: [
      {
        id: "status",
        title: "現在の働き方に近いものはどれですか？",
        type: "single",
        options: [
          { id: "fulltime", label: "正社員として働いている" },
          { id: "contract", label: "契約社員・派遣社員として働いている" },
          { id: "parttime", label: "アルバイト・パートで働いている" },
          { id: "not_working", label: "今は働いていない" },
          { id: "skip", label: "答えたくない・どれにも当てはまらない" },
        ],
      },
      {
        id: "timing",
        title: "いつごろまでに働き始めたいですか？",
        type: "single",
        options: [
          { id: "asap", label: "できるだけ早く（1か月以内）" },
          { id: "3months", label: "3か月以内" },
          { id: "6months", label: "半年以内" },
          { id: "undecided", label: "まだ決めていない・情報収集中" },
        ],
      },
    ],
  },
  {
    id: "experience",
    shortTitle: "経験",
    title: "これまでの経験",
    description: "アルバイトや短期間の仕事も含めて、当てはまるものを選んでください。",
    questions: [
      {
        id: "experiences",
        title: "経験したことがある仕事を選んでください（複数選択可）",
        type: "multi",
        options: [
          { id: "sales_service", label: "接客・販売" },
          { id: "food", label: "飲食店のホール・キッチン" },
          { id: "callcenter", label: "電話対応・コールセンター" },
          { id: "office", label: "事務・データ入力" },
          { id: "warehouse", label: "倉庫・工場・軽作業" },
          { id: "it", label: "パソコンの設定・IT関連" },
          { id: "teaching", label: "人に教える・新人の指導" },
          { id: "none", label: "仕事の経験はほとんどない" },
        ],
      },
      {
        id: "strengths",
        title: "これまでの仕事や生活で、得意だった作業は？（3つまで）",
        type: "multi",
        max: 3,
        options: [
          { id: "listening", label: "相手の話をよく聞くこと" },
          { id: "explaining", label: "人に分かりやすく説明すること" },
          { id: "accuracy", label: "ミスなく正確に作業すること" },
          { id: "multitask", label: "いくつかの作業を同時に進めること" },
          { id: "research", label: "分からないことを調べて解決すること" },
          { id: "targets", label: "目標に向けて工夫すること" },
          { id: "routine", label: "決まった作業をコツコツ続けること" },
          { id: "none", label: "まだ分からない・これから整理したい" },
        ],
      },
    ],
  },
  {
    id: "conditions",
    shortTitle: "条件",
    title: "希望条件",
    description: "まだ決めきれていなくても大丈夫です。今の気持ちに近いものを選んでください。",
    questions: [
      {
        id: "priority",
        title: "仕事選びで、いちばん優先したいことは？",
        type: "single",
        options: [
          { id: "income", label: "収入" },
          { id: "holidays", label: "休日・休みやすさ" },
          { id: "growth", label: "スキル・経験が身につくこと" },
          { id: "stability", label: "長く安定して働けること" },
          { id: "environment", label: "相談しやすい職場の雰囲気" },
          { id: "location", label: "通いやすさ・勤務地" },
        ],
      },
      {
        id: "income",
        title: "年収について、近い考えは？",
        type: "single",
        options: [
          { id: "keep_current", label: "今の収入より下げたくない" },
          { id: "up_priority", label: "収入アップを優先したい" },
          { id: "stable_first", label: "多少下がっても、働きやすさを優先したい" },
          { id: "undecided", label: "まだ分からない" },
        ],
      },
      {
        id: "holidays",
        title: "休日の希望は？",
        type: "single",
        options: [
          { id: "weekends", label: "土日祝が休みがいい" },
          { id: "fixed_any", label: "曜日は問わないが、休みは固定がいい" },
          { id: "shift_ok", label: "シフト制でも大丈夫" },
          { id: "undecided", label: "こだわりはない" },
        ],
      },
      {
        id: "hours",
        title: "勤務時間・残業について近い考えは？",
        type: "single",
        options: [
          { id: "no_overtime", label: "残業はできるだけ少ないほうがいい" },
          { id: "some_ok", label: "ある程度の残業なら大丈夫" },
          { id: "flexible", label: "時期によって忙しくても大丈夫" },
          { id: "undecided", label: "まだ分からない" },
        ],
      },
      {
        id: "location",
        title: "勤務地の希望に近いものは？",
        type: "single",
        options: [
          { id: "commute_home", label: "自宅から通える範囲がいい" },
          { id: "remote", label: "在宅勤務ができると嬉しい" },
          { id: "relocate_ok", label: "転勤があっても検討できる" },
          { id: "undecided", label: "特にこだわりはない" },
        ],
      },
    ],
  },
  {
    id: "style",
    shortTitle: "スタイル",
    title: "仕事のスタイル",
    description: "得意・苦手に正解はありません。比較の材料にするための質問です。",
    questions: [
      {
        id: "talk",
        title: "人と話す仕事について、どう感じますか？",
        type: "single",
        options: [
          { id: "love", label: "話すのが好き・得意" },
          { id: "ok", label: "特に抵抗はない" },
          { id: "little", label: "少しなら大丈夫" },
          { id: "avoid", label: "できるだけ避けたい" },
        ],
      },
      {
        id: "pc",
        title: "パソコンでの作業について、どう感じますか？",
        type: "single",
        options: [
          { id: "love", label: "得意・好き" },
          { id: "ok", label: "基本的な操作ならできる" },
          { id: "little", label: "あまり使ったことがない" },
          { id: "avoid", label: "できるだけ避けたい" },
        ],
      },
      {
        id: "avoid",
        title: "できれば避けたい仕事はありますか？（複数選択可）",
        type: "multi",
        options: [
          { id: "numbers_pressure", label: "数字の目標に強く追われる仕事" },
          { id: "cold_calls", label: "知らない人への電話や飛び込み訪問" },
          { id: "complaints", label: "クレーム対応が中心の仕事" },
          { id: "solo_desk", label: "一日中ひとりで黙々とする作業" },
          { id: "irregular", label: "夜間や不規則な勤務" },
          { id: "none", label: "特にない" },
        ],
      },
      {
        id: "learning",
        title: "仕事以外で、学習に使える時間はどのくらいありますか？",
        type: "single",
        options: [
          { id: "none", label: "ほとんど取れない" },
          { id: "weekly", label: "週に数時間" },
          { id: "daily", label: "毎日1時間くらい" },
          { id: "plenty", label: "まとまった時間が取れる" },
        ],
      },
    ],
  },
];

export const ALL_QUESTIONS: Question[] = STEPS.flatMap((s) => s.questions);

export type Answers = Partial<Record<QuestionId, string[]>>;

export function optionLabel(questionId: QuestionId, optionId: string): string {
  const q = ALL_QUESTIONS.find((x) => x.id === questionId);
  return q?.options.find((o) => o.id === optionId)?.label ?? optionId;
}

export function isStepComplete(step: Step, answers: Answers): boolean {
  return step.questions.every((q) => (answers[q.id]?.length ?? 0) > 0);
}

/** 不正な ID を取り除き、設問定義に沿った形にする（URL やストレージ由来の値を信用しない） */
export function sanitizeAnswers(input: unknown): Answers {
  const result: Answers = {};
  if (!input || typeof input !== "object") return result;
  for (const q of ALL_QUESTIONS) {
    const raw = (input as Record<string, unknown>)[q.id];
    if (!Array.isArray(raw)) continue;
    const valid = raw.filter((v): v is string => typeof v === "string" && q.options.some((o) => o.id === v));
    const unique = q.type === "multi" && valid.includes("none") ? ["none"] : [...new Set(valid)];
    const limited = q.type === "single" ? unique.slice(0, 1) : unique.slice(0, q.max ?? q.options.length);
    if (limited.length > 0) result[q.id] = limited;
  }
  return result;
}
