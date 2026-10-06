import { describe, expect, it } from "vitest";
import { extractNumbers, parseFigure, renderFigure, splitFigures } from "@/lib/figures";
import { renderMarkdown } from "@/lib/markdown";

describe("figures (図解)", () => {
  it("parses each type", () => {
    expect(parseFigure("type: steps\nitems:\n  - label: a\n  - label: b").ok).toBe(true);
    expect(parseFigure("type: compare\nstyle: before-after\ncolumns:\n  - label: 前\n    items: [週20時間以上]\n  - label: 後\n    items: [週10時間以上]").ok).toBe(true);
    expect(parseFigure('type: stats\nitems:\n  - value: "1,177"\n    unit: 円\n    label: 全国加重平均').ok).toBe(true);
    expect(parseFigure("type: equation\nterms: [年収, ÷, 労働時間, =, 1時間あたり]").ok).toBe(true);
    expect(parseFigure("type: checklist\nitems: [a, b]").ok).toBe(true);
  });

  it("rejects unknown keys, wrong operator order and too many items", () => {
    expect(parseFigure("type: steps\ncolor: red\nitems:\n  - label: a\n  - label: b").ok).toBe(false);
    expect(parseFigure("type: equation\nterms: [年収, 労働時間, 1時間あたり]").ok).toBe(false);
    expect(parseFigure(`type: checklist\nitems: [${Array.from({ length: 9 }, (_, i) => `項目${i}`).join(", ")}]`).ok).toBe(false);
  });

  it("escapes text when rendering (no HTML from content)", () => {
    const r = parseFigure('type: checklist\ntitle: "<img src=x onerror=alert(1)>"\nitems: ["<script>x</script>", b]');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const html = renderFigure(r.spec);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("is rendered from markdown, and invalid figures fall back to escaped text", () => {
    const ok = renderMarkdown("本文\n\n```figure\ntype: checklist\nitems: [a, b]\n```\n").sections.join("");
    expect(ok).toContain('class="fig fig-checklist');
    const bad = renderMarkdown("```figure\ntype: nope\n```\n").sections.join("");
    expect(bad).toContain("fig-invalid");
  });

  it("finds numbers and figure blocks", () => {
    expect(extractNumbers("全国加重平均1,177円、＋56円、1.5倍")).toEqual(["1177", "56", "1.5"]);
    const { figures, rest } = splitFigures("a\n```figure\ntype: steps\n```\nb");
    expect(figures).toHaveLength(1);
    expect(figures[0].line).toBe(2);
    expect(rest).not.toContain("type: steps");
  });

  it("lays out long tables as cards and short ones as compact tables", () => {
    const html = renderMarkdown("| 項目 | 内容 |\n| --- | --- |\n| 年収 | 300万円 |\n\n| 項目 | 内容 |\n| --- | --- |\n| 説明 | とても長い説明の文章がここに入るので、スマホでは表のままだと読みにくい |\n").sections.join("");
    expect(html).toContain('data-layout="compact"');
    expect(html).toContain('data-layout="cards"');
    expect(html).toContain('data-label="内容"');
  });
});
