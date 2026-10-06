import { describe, expect, it } from "vitest";
import { buildResult, resultToText } from "@/lib/condition-check/engine";
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
    expect(r.nextActions.some((a) => a.href === "/news/news-kyouiku-kunren-kyufu")).toBe(true);
  });

  it("produces conditions to confirm, interview questions and next actions with valid internal links", () => {
    const r = buildResult(base);
    expect(r.conditionsToConfirm).toEqual(expect.arrayContaining(["「完全週休2日制」かどうかと、年間休日の日数", "月平均の残業時間と、固定残業代に含まれる時間数"]));
    expect(r.interviewQuestions.length).toBeGreaterThanOrEqual(3);
    expect(r.nextActions.at(-1)?.href).toBe("/consultation");
    expect(r.nextActions.some((a) => a.href === "/articles/freeter-seishain-hajimeni")).toBe(true);
  });

  it("never phrases results as pass/fail judgement", () => {
    const text = resultToText(buildResult(base));
    expect(text).not.toMatch(/合格|不合格|向いていない|受かる|必ず/);
    expect(text).toContain("確認したい条件");
  });

  it("handles a profile with no experience", () => {
    const r = buildResult({ ...base, experiences: ["none"], strengths: ["routine"], status: ["not_working"] });
    expect(r.skills.every((s) => !s.from.includes("ほとんどない"))).toBe(true);
    expect(r.candidates).toHaveLength(4);
  });
});
