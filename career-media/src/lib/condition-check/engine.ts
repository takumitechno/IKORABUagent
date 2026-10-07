import { JOB_ROLES, type JobRole } from "@/lib/jobs";
import { optionLabel, type Answers, type QuestionId } from "./questions";

/**
 * ルールベースの整理ロジック。
 * 出力は「比較・確認の材料」であり、合否・適性・求人の推薦ではない。
 */

export type ConditionItem = { label: string; detail: string };

export type TransferableSkill = { from: string; skill: string; usefulIn: string[] };

export type RoleCandidate = {
  role: JobRole;
  score: number;
  reasons: string[];
  cautions: string[];
};

export type NextAction = { title: string; description: string; href: string };

/**
 * 結果は「相談準備ノート」として7つに分ける。
 * 1 ゆずれない条件 / 2 今までの経験から使えそうなこと / 3 比べてみたい職種 / 4 求人で確認すること /
 * 5 面談で聞く質問 / 6 自分でできる次の一歩 / 7 相談する場合の次の一歩
 * 判定（合否・適性・推定年収・確率）は出さない。
 */
export type CheckResult = {
  mustHave: ConditionItem[];
  niceToHave: ConditionItem[];
  conditionNote: string | null;
  skills: TransferableSkill[];
  candidates: RoleCandidate[];
  conditionsToConfirm: string[];
  interviewQuestions: string[];
  /** 自分でできる次の一歩（相談は含まない） */
  selfActions: NextAction[];
  /** 相談する場合の次の一歩（相談は任意） */
  consultSteps: string[];
};

export const RESULT_SECTIONS = [
  "ゆずれない条件",
  "今までの経験から使えそうなこと",
  "比べてみたい職種",
  "求人で確認すること",
  "面談で聞く質問",
  "自分でできる次の一歩",
  "相談する場合の次の一歩",
] as const;

const one = (answers: Answers, id: QuestionId): string | undefined => answers[id]?.[0];
const many = (answers: Answers, id: QuestionId): string[] => (answers[id] ?? []).filter((v) => v !== "none");

// ---------------------------------------------------------------------------
// 1. 希望条件の整理
// ---------------------------------------------------------------------------

type ConditionKey = "income" | "holidays" | "hours" | "location";

const CONDITION_TEXT: Record<ConditionKey, Record<string, ConditionItem | null>> = {
  income: {
    keep_current: { label: "今の収入を下げない", detail: "想定年収だけでなく、基本給・固定残業代・賞与の内訳で比べる" },
    up_priority: { label: "収入アップを目指す", detail: "入社時の年収に加えて、昇給のしくみや数年後の年収の幅も見る" },
    stable_first: { label: "働きやすさを優先（収入は柔軟）", detail: "下限として必要な生活費を把握したうえで、条件の幅を広げられる" },
    undecided: null,
  },
  holidays: {
    weekends: { label: "土日祝休み", detail: "「完全週休2日制」かどうかと、年間休日の日数を確認する" },
    fixed_any: { label: "休みの曜日が固定", detail: "シフト制かどうか、休みの曜日が決まっているかを確認する" },
    shift_ok: { label: "シフト制も可", detail: "休日の条件を広げられる分、選べる求人の幅が広がる" },
    undecided: null,
  },
  hours: {
    no_overtime: { label: "残業は少なめ", detail: "月平均の残業時間と、固定残業代の有無・時間数を確認する" },
    some_ok: { label: "ある程度の残業は可", detail: "残業の目安と、繁忙期の時期を把握しておく" },
    flexible: { label: "繁忙期の忙しさも可", detail: "忙しい時期と、その分の休みの取り方を確認する" },
  },
  location: {
    commute_home: { label: "自宅から通える勤務地", detail: "通勤時間の上限を決め、「就業場所の変更の範囲」（転勤の有無）を確認する" },
    remote: { label: "在宅勤務ができる", detail: "入社直後から在宅勤務ができるのか、研修期間は出社なのかを確認する" },
    relocate_ok: { label: "転勤も検討できる", detail: "勤務地の条件を広げられる分、選べる求人の幅が広がる" },
    undecided: null,
  },
};

const PRIORITY_TO_CONDITION: Record<string, ConditionKey | undefined> = {
  income: "income",
  holidays: "holidays",
  location: "location",
};

const PRIORITY_ONLY: Record<string, ConditionItem> = {
  growth: { label: "スキル・経験が身につくこと", detail: "研修の内容と、配属後に教えてくれる人がいるかを確認する" },
  stability: { label: "長く安定して働けること", detail: "雇用形態・契約期間の定め、未経験入社者の定着の状況を確認する" },
  environment: { label: "相談しやすい職場", detail: "困ったときに相談できる先輩・上司がいるか、面談の機会があるかを確認する" },
  income: { label: "収入", detail: "年収の内訳と、昇給のしくみを確認する" },
  holidays: { label: "休日・休みやすさ", detail: "年間休日と、有給休暇の取りやすさを確認する" },
  location: { label: "通いやすさ・勤務地", detail: "通勤時間の上限と、転勤の有無を確認する" },
};

/** 「強い」条件（選べる求人の幅を狭めやすいもの） */
const STRICT_OPTIONS = new Set(["keep_current", "up_priority", "weekends", "no_overtime", "commute_home", "remote"]);

function organizeConditions(answers: Answers) {
  const priority = one(answers, "priority");
  const priorityKey = priority ? PRIORITY_TO_CONDITION[priority] : undefined;
  const mustHave: ConditionItem[] = [];
  const niceToHave: ConditionItem[] = [];

  if (priority) {
    const linked = priorityKey ? CONDITION_TEXT[priorityKey][one(answers, priorityKey) ?? ""] : null;
    mustHave.push(linked ?? PRIORITY_ONLY[priority]);
  }

  let strictCount = 0;
  for (const key of ["income", "holidays", "hours", "location"] as ConditionKey[]) {
    const value = one(answers, key);
    if (!value) continue;
    if (STRICT_OPTIONS.has(value)) strictCount += 1;
    if (key === priorityKey) continue;
    const item = CONDITION_TEXT[key][value];
    if (item) niceToHave.push(item);
  }

  const conditionNote =
    strictCount >= 3
      ? "条件をすべて満たす求人は限られることがあります。「ゆずれない条件」は1〜2個に絞り、ほかは「できれば」として比べると選択肢が広がります。"
      : null;

  return { mustHave, niceToHave, conditionNote };
}

// ---------------------------------------------------------------------------
// 2. 活かせそうな経験
// ---------------------------------------------------------------------------

const EXPERIENCE_SKILLS: Record<string, { skill: string; usefulIn: string[] }> = {
  sales_service: { skill: "お客さまの要望を聞き取り、合うものを提案する経験", usefulIn: ["営業", "カスタマーサポート"] },
  food: { skill: "混雑時に優先順位をつけて、複数の作業を同時に進める経験", usefulIn: ["カスタマーサポート", "事務", "営業"] },
  callcenter: { skill: "電話で状況を確認し、言葉だけで分かりやすく伝える経験", usefulIn: ["カスタマーサポート", "ITサポート", "事務"] },
  office: { skill: "書類やデータを正確に扱い、期限どおりに処理する経験", usefulIn: ["事務", "カスタマーサポート"] },
  warehouse: { skill: "決められた手順を守り、ミスを防ぐ工夫をする経験", usefulIn: ["事務", "ITサポート"] },
  it: { skill: "パソコンやシステムの困りごとを調べて解決する経験", usefulIn: ["ITサポート", "カスタマーサポート"] },
  teaching: { skill: "手順を言葉にして、相手に合わせて教える経験", usefulIn: ["ITサポート", "カスタマーサポート", "営業"] },
};

const STRENGTH_SKILLS: Record<string, { skill: string; usefulIn: string[] }> = {
  listening: { skill: "相手の話を聞き、困りごとを正確につかむ力", usefulIn: ["営業", "カスタマーサポート"] },
  explaining: { skill: "専門的なことを分かりやすく説明する力", usefulIn: ["ITサポート", "カスタマーサポート"] },
  accuracy: { skill: "ミスなく正確に作業を進める力", usefulIn: ["事務", "ITサポート"] },
  multitask: { skill: "複数の作業を並行して進める段取り力", usefulIn: ["事務", "営業"] },
  research: { skill: "分からないことを自分で調べて解決する力", usefulIn: ["ITサポート"] },
  targets: { skill: "目標に向けてやり方を工夫する力", usefulIn: ["営業"] },
  routine: { skill: "決まった作業を安定して続ける力", usefulIn: ["事務", "カスタマーサポート"] },
};

function transferableSkills(answers: Answers): TransferableSkill[] {
  const skills: TransferableSkill[] = [];
  for (const exp of many(answers, "experiences")) {
    const s = EXPERIENCE_SKILLS[exp];
    if (s) skills.push({ from: optionLabel("experiences", exp), ...s });
  }
  for (const st of many(answers, "strengths")) {
    const s = STRENGTH_SKILLS[st];
    if (s) skills.push({ from: `得意: ${optionLabel("strengths", st)}`, ...s });
  }
  return skills;
}

// ---------------------------------------------------------------------------
// 3. 比較候補職種
// ---------------------------------------------------------------------------

type RoleSlug = "hojin-eigyo" | "customer-support" | "it-support" | "jimu";
type Effect = Partial<Record<RoleSlug, number>>;
type Rule = { effect: Effect; reason?: Partial<Record<RoleSlug, string>>; caution?: Partial<Record<RoleSlug, string>> };

const RULES: Partial<Record<QuestionId, Record<string, Rule>>> = {
  talk: {
    love: { effect: { "hojin-eigyo": 3, "customer-support": 2, "it-support": 1 }, reason: { "hojin-eigyo": "人と話すことが好き・得意", "customer-support": "人と話すことが好き・得意" } },
    ok: { effect: { "hojin-eigyo": 2, "customer-support": 2, "it-support": 1, jimu: 1 } },
    little: { effect: { "it-support": 1, jimu: 2 }, reason: { jimu: "人と話す量がやや少ない仕事を希望" }, caution: { "hojin-eigyo": "社外の人と話す時間が長い。話す相手が新規か既存かを確認" } },
    avoid: {
      effect: { jimu: 2, "it-support": 1, "hojin-eigyo": -3, "customer-support": -2 },
      reason: { jimu: "人と話す量が比較的少ない" },
      caution: { "customer-support": "1日に多くの人と話す。電話中心かテキスト中心かを確認", "it-support": "問い合わせ対応で人と話す場面がある" },
    },
  },
  pc: {
    love: { effect: { "it-support": 3, jimu: 2, "customer-support": 1 }, reason: { "it-support": "パソコン作業が得意・好き", jimu: "パソコン作業が得意・好き" } },
    ok: { effect: { jimu: 1, "customer-support": 1, "it-support": 1 } },
    little: { effect: { "hojin-eigyo": 1, "it-support": -1, jimu: -1 }, caution: { "it-support": "入社後の研修でどこまで学べるかを確認", jimu: "求められる表計算ソフトのスキルの水準を確認" } },
    avoid: {
      effect: { "hojin-eigyo": 2, "it-support": -3, jimu: -2, "customer-support": -1 },
      reason: { "hojin-eigyo": "パソコン作業の比重が比較的小さい" },
      caution: { "customer-support": "話しながら入力・検索する場面が多い" },
    },
  },
  avoid: {
    numbers_pressure: { effect: { "hojin-eigyo": -3 }, caution: { "hojin-eigyo": "数字の目標がある職場が多い。目標の決め方と未達時のフォローを確認" } },
    cold_calls: { effect: { "hojin-eigyo": -2 }, caution: { "hojin-eigyo": "新規開拓が中心かどうかを確認（ルート営業という選択肢もある）" } },
    complaints: { effect: { "customer-support": -2 }, caution: { "customer-support": "難しい問い合わせを相談・引き継ぎできる体制を確認" } },
    solo_desk: { effect: { jimu: -1, "it-support": -1, "hojin-eigyo": 1 }, caution: { jimu: "電話・来客対応など人と関わる業務の割合を確認" } },
    irregular: { effect: { "it-support": -1, "customer-support": -1 }, caution: { "it-support": "夜間・休日の対応やシフトの有無を確認", "customer-support": "シフト制か、土日祝の勤務があるかを確認" } },
  },
  experiences: {
    sales_service: { effect: { "hojin-eigyo": 2, "customer-support": 2 }, reason: { "hojin-eigyo": "接客・販売での提案の経験", "customer-support": "接客・販売でのお客さま対応の経験" } },
    food: { effect: { "customer-support": 1, "hojin-eigyo": 1, jimu: 1 }, reason: { "customer-support": "飲食店での接客・段取りの経験" } },
    callcenter: { effect: { "customer-support": 3, "it-support": 1 }, reason: { "customer-support": "電話対応の経験" } },
    office: { effect: { jimu: 3, "customer-support": 1 }, reason: { jimu: "事務・データ入力の経験" } },
    warehouse: { effect: { jimu: 1 }, reason: { jimu: "手順を守って正確に作業した経験" } },
    it: { effect: { "it-support": 3 }, reason: { "it-support": "パソコン・IT関連の経験" } },
    teaching: { effect: { "it-support": 1, "customer-support": 1, "hojin-eigyo": 1 }, reason: { "it-support": "人に教えた経験（説明力）" } },
  },
  strengths: {
    listening: { effect: { "customer-support": 1, "hojin-eigyo": 1 }, reason: { "customer-support": "相手の話をよく聞くことが得意" } },
    explaining: { effect: { "it-support": 1, "customer-support": 1 }, reason: { "it-support": "分かりやすく説明することが得意" } },
    accuracy: { effect: { jimu: 2 }, reason: { jimu: "正確な作業が得意" } },
    multitask: { effect: { jimu: 1, "hojin-eigyo": 1 } },
    research: { effect: { "it-support": 2 }, reason: { "it-support": "調べて解決することが得意" } },
    targets: { effect: { "hojin-eigyo": 2 }, reason: { "hojin-eigyo": "目標に向けて工夫することが得意" } },
    routine: { effect: { jimu: 1, "customer-support": 1 } },
  },
  holidays: {
    weekends: { effect: { jimu: 1, "customer-support": -1 }, caution: { "customer-support": "土日祝の勤務やシフトの有無を確認" } },
    shift_ok: { effect: { "customer-support": 1 } },
  },
  income: {
    up_priority: { effect: { "hojin-eigyo": 2 }, reason: { "hojin-eigyo": "成果が収入に反映される職場もある" } },
  },
  learning: {
    daily: { effect: { "it-support": 2 }, reason: { "it-support": "学習の時間を取れる（ITの知識は入社後も学び続ける場面が多い）" } },
    plenty: { effect: { "it-support": 2 }, reason: { "it-support": "学習の時間を取れる（ITの知識は入社後も学び続ける場面が多い）" } },
    none: { effect: { "it-support": -1 }, caution: { "it-support": "業務時間内の研修でどこまで学べるかを確認" } },
  },
};

function rankRoles(answers: Answers): RoleCandidate[] {
  const state = new Map<RoleSlug, { score: number; reasons: Set<string>; cautions: Set<string> }>();
  for (const role of JOB_ROLES) state.set(role.slug as RoleSlug, { score: 0, reasons: new Set(), cautions: new Set() });

  for (const [questionId, rules] of Object.entries(RULES) as [QuestionId, Record<string, Rule>][]) {
    for (const value of many(answers, questionId)) {
      const rule = rules[value];
      if (!rule) continue;
      for (const [slug, delta] of Object.entries(rule.effect) as [RoleSlug, number][]) state.get(slug)!.score += delta;
      for (const [slug, text] of Object.entries(rule.reason ?? {}) as [RoleSlug, string][]) state.get(slug)!.reasons.add(text);
      for (const [slug, text] of Object.entries(rule.caution ?? {}) as [RoleSlug, string][]) state.get(slug)!.cautions.add(text);
    }
  }

  return JOB_ROLES.map((role) => {
    const s = state.get(role.slug as RoleSlug)!;
    return { role, score: s.score, reasons: [...s.reasons], cautions: [...s.cautions] };
  }).sort((a, b) => b.score - a.score || JOB_ROLES.indexOf(a.role) - JOB_ROLES.indexOf(b.role));
}

// ---------------------------------------------------------------------------
// 4. 確認したい条件 / 5. 面談で聞く質問
// ---------------------------------------------------------------------------

function conditionsToConfirm(answers: Answers): string[] {
  const list: string[] = [];
  const push = (text: string) => !list.includes(text) && list.push(text);
  const status = one(answers, "status");
  const income = one(answers, "income");
  const holidays = one(answers, "holidays");
  const hours = one(answers, "hours");
  const location = one(answers, "location");
  const priority = one(answers, "priority");

  if (income === "keep_current" || priority === "income") push("想定年収の内訳（基本給・固定残業代・賞与・手当）");
  if (income === "up_priority") push("昇給・評価のしくみと、入社数年後の年収の目安");
  if (holidays === "weekends") push("「完全週休2日制」かどうかと、年間休日の日数");
  if (holidays === "fixed_any") push("シフト制かどうか、休みの曜日が固定されているか");
  if (hours === "no_overtime") push("月平均の残業時間と、固定残業代に含まれる時間数");
  if (hours === "some_ok" || hours === "flexible") push("繁忙期の時期と、その時期の残業の目安");
  if (hours === "undecided") push("月平均の残業時間（残業の多さを決める材料として）");
  if (location === "commute_home" || location === "relocate_ok") push("「就業場所の変更の範囲」（転勤・異動の可能性）");
  if (location === "remote") push("在宅勤務ができる条件と、研修期間中の出社の有無");
  if (priority === "growth") push("研修の期間・内容と、配属後のフォロー体制");
  if (priority === "environment") push("困ったときに相談できる先輩・上司がいるか");
  if (priority === "stability" || status === "parttime" || status === "contract" || status === "not_working") push("雇用形態（正社員かどうか）と、契約期間の定めの有無");
  push("「業務の変更の範囲」（入社後に仕事内容が変わる可能性）");
  return list;
}

function interviewQuestions(answers: Answers, candidates: RoleCandidate[]): string[] {
  const list: string[] = [];
  for (const c of candidates.slice(0, 2)) list.push(c.role.interviewQuestions[0]);
  const priority = one(answers, "priority");
  if (priority === "growth" || many(answers, "experiences").length === 0) list.push("未経験で入社した方がつまずきやすいのは、どのような点ですか");
  if (priority === "environment") list.push("入社後、上司や先輩と面談する機会はどのくらいありますか");
  if (one(answers, "hours") === "no_overtime") list.push("配属予定の部署の、月の平均的な残業時間を教えてください");
  if (one(answers, "holidays") === "weekends") list.push("土日祝に出勤が必要になることはありますか");
  list.push("この仕事で長く活躍している方に共通する点は何ですか");
  return [...new Set(list)];
}

// ---------------------------------------------------------------------------
// 6. 次の行動
// ---------------------------------------------------------------------------

function selfActions(answers: Answers, candidates: RoleCandidate[]): NextAction[] {
  const actions: NextAction[] = [];
  const status = one(answers, "status");
  const timing = one(answers, "timing");
  const top = candidates.slice(0, 2).map((c) => c.role);

  actions.push({
    title: `${top.map((r) => r.shortName).join("と")}の違いを比べる`,
    description: "仕事内容・人と話す量・数字の目標などを職種比較ページで確認しましょう。",
    href: `/jobs#${top[0].slug}`,
  });

  if (status === "parttime" || status === "not_working") {
    actions.push({ title: "正社員を目指すときの確認ポイントを読む", description: "働き方の違いと、アルバイト経験や空白期間の伝え方を整理できます。", href: "/articles/freeter-seishain-hajimeni" });
  } else if (many(answers, "experiences").length > 0) {
    actions.push({ title: "経験の伝え方を整理する", description: "これまでの経験を、応募する職種につながる言葉に置き換える方法を紹介しています。", href: "/articles/sekkyaku-keiken-ikasu" });
  } else {
    actions.push({ title: "最初に整理したい5つのことを読む", description: "経験が少なくても使える、整理のしかたを紹介しています。", href: "/articles/mikeiken-tenshoku-hajimekata" });
  }

  if (one(answers, "income") || one(answers, "holidays")) {
    actions.push({ title: "年収と休日の比べ方を知る", description: "年間休日・年収の内訳・時給換算で、求人を同じ基準で比べる方法です。", href: "/articles/donichi-yasumi-nenshu-hikaku" });
  }

  const learning = one(answers, "learning");
  if ((learning === "daily" || learning === "plenty") && top.some((r) => r.slug === "it-support")) {
    actions.push({ title: "学び直しの支援制度を確認する", description: "講座の受講費用の一部が支給される制度などをまとめています。", href: "/news/news-kyouiku-kunren-kyufu" });
  }

  if (timing === "undecided" || timing === "6months") {
    actions.push({ title: "最初に整理したい5つのことを読む", description: "時期が決まっていなくても大丈夫です。理由・経験・条件・職種・スケジュールの順に整理できます。", href: "/articles/mikeiken-tenshoku-hajimekata" });
  }

  return actions.filter((a, i, arr) => arr.findIndex((b) => b.href === a.href) === i);
}

/** 相談する場合の次の一歩（相談は任意。回答は自動では送られない） */
function consultSteps(answers: Answers): string[] {
  const timing = one(answers, "timing");
  const soon = timing === "asap" || timing === "3months";
  return [
    "下の「面談で使うメモとしてコピー」で、このノートの要点を手元に残す（回答は相談先に自動では送られません）",
    "相談でできること・できないことを確認する",
    soon
      ? "働き始めたい時期が近いので、申し込みのときに時期と、ゆずれない条件を最初に伝える"
      : "時期が決まっていなくても相談できます。「まだ情報収集中」と最初に伝えると、話を合わせてもらいやすくなります",
    "面談では、5 の質問から聞きたいものを選んで使う",
  ];
}

// ---------------------------------------------------------------------------

export function buildResult(answers: Answers): CheckResult {
  const { mustHave, niceToHave, conditionNote } = organizeConditions(answers);
  const candidates = rankRoles(answers);
  return {
    mustHave,
    niceToHave,
    conditionNote,
    skills: transferableSkills(answers),
    candidates,
    conditionsToConfirm: conditionsToConfirm(answers),
    interviewQuestions: interviewQuestions(answers, candidates),
    selfActions: selfActions(answers, candidates),
    consultSteps: consultSteps(answers),
  };
}

/** 結果全体をテキストにする（クリップボード・保存用）。7つの見出しで並べる */
export function resultToText(result: CheckResult): string {
  const [s1, s2, s3, s4, s5, s6, s7] = RESULT_SECTIONS;
  const lines: string[] = ["【未経験転職 条件整理ノート】", ""];
  lines.push(`■ 1. ${s1}`);
  if (result.mustHave.length) result.mustHave.forEach((c) => lines.push(`・${c.label}（${c.detail}）`));
  else lines.push("・まだ決めていない");
  if (result.niceToHave.length) {
    lines.push("（できれば）");
    result.niceToHave.forEach((c) => lines.push(`・${c.label}`));
  }
  lines.push("", `■ 2. ${s2}`);
  if (result.skills.length) result.skills.forEach((s) => lines.push(`・${s.from} → ${s.skill}`));
  else lines.push("・これから書き出す（学校生活や日常で続けてきたことも材料になります）");
  lines.push("", `■ 3. ${s3}（向き不向きの判定ではなく、比べ始める候補）`);
  result.candidates.slice(0, 3).forEach((c) => lines.push(`・${c.role.name}${c.reasons.length ? `（${c.reasons.slice(0, 2).join("、")}）` : ""}`));
  lines.push("", `■ 4. ${s4}`);
  result.conditionsToConfirm.forEach((t) => lines.push(`・${t}`));
  lines.push("", `■ 5. ${s5}`);
  result.interviewQuestions.forEach((t) => lines.push(`・${t}`));
  lines.push("", `■ 6. ${s6}`);
  result.selfActions.forEach((a) => lines.push(`・${a.title}`));
  lines.push("", `■ 7. ${s7}`);
  result.consultSteps.forEach((t) => lines.push(`・${t}`));
  return lines.join("\n");
}

/** 面談で使うメモ（相談のはじめに伝えると話が進みやすい要点だけ） */
export function memoText(result: CheckResult, answers: Answers): string {
  const status = one(answers, "status");
  const timing = one(answers, "timing");
  const lines: string[] = ["【相談メモ】（条件整理チェックで自分で整理した内容）"];
  if (status && status !== "skip") lines.push(`・今の働き方: ${optionLabel("status", status)}`);
  if (timing) lines.push(`・働き始めたい時期: ${optionLabel("timing", timing)}`);
  if (result.mustHave.length) lines.push(`・ゆずれない条件: ${result.mustHave.map((c) => c.label).join("、")}`);
  if (result.niceToHave.length) lines.push(`・できれば: ${result.niceToHave.map((c) => c.label).join("、")}`);
  const exps = many(answers, "experiences").map((x) => optionLabel("experiences", x));
  lines.push(`・これまでの経験: ${exps.length ? exps.join("、") : "仕事の経験はほとんどない"}`);
  lines.push(`・比べてみたい職種: ${result.candidates.slice(0, 3).map((c) => c.role.shortName).join("、")}`);
  lines.push("・聞きたいこと:");
  result.interviewQuestions.slice(0, 4).forEach((q) => lines.push(`  - ${q}`));
  lines.push("（このメモは自分で持ち帰るためのものです。サイトからは送信されていません）");
  return lines.join("\n");
}
