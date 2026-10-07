import { describe, expect, it } from "vitest";
import { buildResult, memoText, RESULT_SECTIONS, resultToText } from "@/lib/condition-check/engine";
import { ALL_QUESTIONS, isStepComplete, sanitizeAnswers, STEPS, type Answers } from "@/lib/condition-check/questions";

const base: Answers = {
  status: ["parttime"],
  timing: ["3months"],
  experiences: ["sales_service", "callcenter"],
  strengths: ["listening", "explaining"],
  priority: ["holidays"],
  income: ["keep_current"],
  holidays: ["weekends"],
  hours: ["no_overtime"],
  location: ["commute_home"],
  talk: ["ok"],
  pc: ["ok"],
  avoid: ["numbers_pressure"],
  learning: ["weekly"],
};

describe("condition check questions", () => {
  it("covers the requested topics without free-text / personal data fields", () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    for (const id of ["status", "experiences", "timing", "location", "income", "holidays", "hours", "talk", "pc", "strengths", "avoid", "learning"]) {
      expect(ids).toContain(id);
    }
    // 自由記述の設問はない（すべて選択式）
    expect(ALL_QUESTIONS.every((q) => q.options.length >= 2)).toBe(true);
  });

  it("sanitizes unknown ids, enforces single choice and max selections", () => {
    const answers = sanitizeAnswers({ status: ["parttime", "fulltime"], strengths: ["listening", "explaining", "accuracy", "research"], talk: ["<script>"], bogus: ["x"] });
    expect(answers.status).toEqual(["parttime"]);
    expect(answers.strengths).toHaveLength(3);
    expect(answers.talk).toBeUndefined();
    expect(answers).not.toHaveProperty("bogus");
  });

  it("detects step completion", () => {
    expect(isStepComplete(STEPS[0], { status: ["parttime"] })).toBe(false);
    expect(isStepComplete(STEPS[0], { status: ["parttime"], timing: ["asap"] })).toBe(true);
  });
});

describe("condition check engine", () => {
  it("organizes must-have vs nice-to-have from the priority", () => {
    const r = buildResult(base);
    expect(r.mustHave.map((c) => c.label)).toEqual(["土日祝休み"]);
    expect(r.niceToHave.map((c) => c.label)).toEqual(expect.arrayContaining(["今の収入を下げない", "残業は少なめ", "自宅から通える勤務地"]));
    // 強い条件が多いときは絞り込みを促す
    expect(r.conditionNote).not.toBeNull();
  });

  it("maps experiences to transferable skills", () => {
    const r = buildResult(base);
    expect(r.skills.some((s) => s.from === "接客・販売")).toBe(true);
    expect(r.skills.some((s) => s.from === "電話対応・コールセンター")).toBe(true);
  });

  it("ranks customer support first for phone/service experience and avoids pushing sales when targets are avoided", () => {
    const r = buildResult(base);
    expect(r.candidates[0].role.slug).toBe("customer-support");
    const sales = r.candidates.find((c) => c.role.slug === "hojin-eigyo")!;
    expect(sales.cautions.join()).toContain("目標");
  });

  it("ranks IT support first for a PC-oriented, learning-oriented profile", () => {
    const r = buildResult({ ...base, experiences: ["it"], strengths: ["research"], talk: ["little"], pc: ["love"], learning: ["daily"], avoid: ["none"] });
    expect(r.candidates[0].role.slug).toBe("it-support");
    expect(r.selfActions.some((a) => a.href === "/news/news-kyouiku-kunren-kyufu")).toBe(true);
  });

  it("produces conditions to confirm, interview questions and next actions with valid internal links", () => {
    const r = buildResult(base);
    expect(r.conditionsToConfirm).toEqual(expect.arrayContaining(["「完全週休2日制」かどうかと、年間休日の日数", "月平均の残業時間と、固定残業代に含まれる時間数"]));
    expect(r.interviewQuestions.length).toBeGreaterThanOrEqual(3);
    expect(r.selfActions.some((a) => a.href === "/articles/freeter-seishain-hajimeni")).toBe(true);
    // 「自分でできる次の一歩」に相談は入れない（相談は7番目の任意の一歩として別に出す）
    expect(r.selfActions.every((a) => !a.href.startsWith("/consultation"))).toBe(true);
    expect(r.selfActions.every((a) => /^\/(articles|news|jobs)/.test(a.href))).toBe(true);
    expect(r.consultSteps.length).toBeGreaterThanOrEqual(3);
    expect(r.consultSteps.join()).toContain("自動では送られません");
  });

  it("lays the result out as the 7-part consultation prep note", () => {
    expect(RESULT_SECTIONS).toEqual(["ゆずれない条件", "今までの経験から使えそうなこと", "比べてみたい職種", "求人で確認すること", "面談で聞く質問", "自分でできる次の一歩", "相談する場合の次の一歩"]);
    const text = resultToText(buildResult(base));
    RESULT_SECTIONS.forEach((title, i) => expect(text).toContain(`■ ${i + 1}. ${title}`));
  });

  it("never phrases results as pass/fail judgement, aptitude, probability or salary estimate", () => {
    const r = buildResult(base);
    const text = `${resultToText(r)}\n${memoText(r, base)}`;
    expect(text).not.toMatch(/合格|不合格|向いていない|向いています|受かる|必ず|確率|成功率|市場価値|推定年収|スコア|点数/);
    expect(text).toContain("求人で確認すること");
  });

  it("builds an interview memo from the answers without anything the reader did not choose", () => {
    const memo = memoText(buildResult(base), base);
    expect(memo).toContain("今の働き方: アルバイト・パートで働いている");
    expect(memo).toContain("働き始めたい時期: 3か月以内");
    expect(memo).toContain("ゆずれない条件: 土日祝休み");
    expect(memo).toContain("送信されていません");
    // 「答えたくない」を選んだ項目はメモに出さない
    const skipped = memoText(buildResult({ ...base, status: ["skip"] }), { ...base, status: ["skip"] });
    expect(skipped).not.toContain("今の働き方");
  });

  it("accepts 'not sure / prefer not to say' answers", () => {
    const answers = sanitizeAnswers({ ...base, status: ["skip"], hours: ["undecided"], timing: ["undecided"] });
    expect(answers.status).toEqual(["skip"]);
    expect(answers.hours).toEqual(["undecided"]);
    const r = buildResult(answers);
    expect(r.conditionsToConfirm.some((c) => c.includes("繁忙期"))).toBe(false);
    expect(r.selfActions.some((a) => a.href === "/articles/mikeiken-tenshoku-hajimekata")).toBe(true);
  });

  it("handles a profile with no experience", () => {
    const r = buildResult({ ...base, experiences: ["none"], strengths: ["routine"], status: ["not_working"] });
    expect(r.skills.every((s) => !s.from.includes("ほとんどない"))).toBe(true);
    expect(r.candidates).toHaveLength(4);
  });
});
