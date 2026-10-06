import matter from "gray-matter";

/**
 * 記事本文の「図解」ブロック。Markdown の中に次のように書く。
 *
 *   ```figure
 *   type: steps
 *   title: 志望動機は3つの要素で組み立てる
 *   items:
 *     - label: きっかけ
 *       text: その仕事に興味を持った体験
 *   ```
 *
 * - 図解は本文の内容を見やすくするためのもの。本文にない事実（とくに数字）を図解だけに書かない
 *   （pipeline の C18 が、図解の数字が本文にも出てくるかを確かめる）
 * - スマホで読める長さに収める（ラベル16文字・説明48文字まで）
 * - 描画結果の HTML はすべてエスケープした文字だけで組み立てる
 */

export type Tone = "mint" | "sky" | "sand" | "coral" | "lime" | "mist";
const TONES: Tone[] = ["mint", "sky", "sand", "coral", "lime", "mist"];

export type FigureSpec =
  | { type: "steps"; title?: string; items: { label: string; text?: string }[] }
  | { type: "compare"; title?: string; style: "vs" | "before-after"; columns: { label: string; tone?: Tone; items: string[] }[] }
  | { type: "stats"; title?: string; items: { value: string; unit?: string; label: string; note?: string }[] }
  | { type: "equation"; title?: string; terms: string[] }
  | { type: "checklist"; title?: string; items: string[] };

export const FIGURE_TYPES = ["steps", "compare", "stats", "equation", "checklist"] as const;
export const OPERATORS = ["+", "＋", "-", "−", "×", "÷", "=", "＝", "→"];

export const LIMITS = { title: 30, label: 16, text: 48, item: 40, value: 10, unit: 6, term: 28 };

export type FigureResult = { ok: true; spec: FigureSpec } | { ok: false; errors: string[] };

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const str = (v: unknown) => (typeof v === "number" ? String(v) : v);

function checkKeys(obj: Record<string, unknown>, allowed: string[], where: string, errors: string[]) {
  for (const k of Object.keys(obj)) if (!allowed.includes(k)) errors.push(`${where}: 使えない項目「${k}」`);
}

function checkLen(value: string | undefined, max: number, where: string, errors: string[]) {
  if (value && [...value].length > max) errors.push(`${where}: ${max}文字以内にする（今は${[...value].length}文字）`);
}

/** YAML を読んで型と長さを確かめる。エラーがあれば ok:false */
export function parseFigure(source: string): FigureResult {
  let data: unknown;
  try {
    data = matter(`---\n${source}\n---\n`).data;
  } catch (e) {
    return { ok: false, errors: [`YAML として読めない: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`] };
  }
  const errors: string[] = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) return { ok: false, errors: ["図解の中身が空、または形が違う"] };
  const d = data as Record<string, unknown>;
  const type = d.type;
  if (!FIGURE_TYPES.includes(type as (typeof FIGURE_TYPES)[number])) return { ok: false, errors: [`type は ${FIGURE_TYPES.join(" / ")} のどれか`] };
  const title = d.title === undefined ? undefined : str(d.title);
  if (title !== undefined && !isStr(title)) errors.push("title は文字で書く");
  checkLen(title as string | undefined, LIMITS.title, "title", errors);

  if (type === "steps") {
    checkKeys(d, ["type", "title", "items"], "steps", errors);
    const items = Array.isArray(d.items) ? d.items : [];
    if (items.length < 2 || items.length > 6) errors.push("steps の items は2〜6個");
    const out = items.map((raw, i) => {
      const it = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      checkKeys(it, ["label", "text"], `items[${i}]`, errors);
      const label = str(it.label);
      const text = it.text === undefined ? undefined : str(it.text);
      if (!isStr(label)) errors.push(`items[${i}].label がない`);
      if (text !== undefined && !isStr(text)) errors.push(`items[${i}].text は文字で書く`);
      checkLen(label as string, LIMITS.label, `items[${i}].label`, errors);
      checkLen(text as string | undefined, LIMITS.text, `items[${i}].text`, errors);
      return { label: String(label ?? ""), text: text === undefined ? undefined : String(text) };
    });
    return errors.length ? { ok: false, errors } : { ok: true, spec: { type, title: title as string | undefined, items: out } };
  }

  if (type === "compare") {
    checkKeys(d, ["type", "title", "style", "columns"], "compare", errors);
    const style = d.style === undefined ? "vs" : d.style;
    if (style !== "vs" && style !== "before-after") errors.push("style は vs か before-after");
    const cols = Array.isArray(d.columns) ? d.columns : [];
    if (style === "before-after" ? cols.length !== 2 : cols.length < 2 || cols.length > 3) errors.push(style === "before-after" ? "before-after の columns は2個" : "compare の columns は2〜3個");
    const out = cols.map((raw, i) => {
      const c = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      checkKeys(c, ["label", "tone", "items"], `columns[${i}]`, errors);
      const label = str(c.label);
      if (!isStr(label)) errors.push(`columns[${i}].label がない`);
      checkLen(label as string, LIMITS.label, `columns[${i}].label`, errors);
      if (c.tone !== undefined && !TONES.includes(c.tone as Tone)) errors.push(`columns[${i}].tone は ${TONES.join(" / ")}`);
      const items = Array.isArray(c.items) ? c.items.map(str) : [];
      if (items.length < 1 || items.length > 6) errors.push(`columns[${i}].items は1〜6個`);
      items.forEach((t, j) => {
        if (!isStr(t)) errors.push(`columns[${i}].items[${j}] は文字で書く`);
        checkLen(t as string, LIMITS.item, `columns[${i}].items[${j}]`, errors);
      });
      return { label: String(label ?? ""), tone: c.tone as Tone | undefined, items: items.map(String) };
    });
    return errors.length ? { ok: false, errors } : { ok: true, spec: { type, title: title as string | undefined, style: style as "vs" | "before-after", columns: out } };
  }

  if (type === "stats") {
    checkKeys(d, ["type", "title", "items"], "stats", errors);
    const items = Array.isArray(d.items) ? d.items : [];
    if (items.length < 1 || items.length > 4) errors.push("stats の items は1〜4個");
    const out = items.map((raw, i) => {
      const it = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      checkKeys(it, ["value", "unit", "label", "note"], `items[${i}]`, errors);
      const value = str(it.value);
      const unit = it.unit === undefined ? undefined : str(it.unit);
      const label = str(it.label);
      const note = it.note === undefined ? undefined : str(it.note);
      if (!isStr(value)) errors.push(`items[${i}].value がない`);
      if (!isStr(label)) errors.push(`items[${i}].label がない`);
      checkLen(value as string, LIMITS.value, `items[${i}].value`, errors);
      checkLen(unit as string | undefined, LIMITS.unit, `items[${i}].unit`, errors);
      checkLen(label as string, LIMITS.label, `items[${i}].label`, errors);
      checkLen(note as string | undefined, LIMITS.text, `items[${i}].note`, errors);
      return { value: String(value ?? ""), unit: unit === undefined ? undefined : String(unit), label: String(label ?? ""), note: note === undefined ? undefined : String(note) };
    });
    return errors.length ? { ok: false, errors } : { ok: true, spec: { type, title: title as string | undefined, items: out } };
  }

  if (type === "equation") {
    checkKeys(d, ["type", "title", "terms"], "equation", errors);
    const terms = Array.isArray(d.terms) ? d.terms.map(str) : [];
    if (terms.length < 3 || terms.length > 9) errors.push("equation の terms は3〜9個（項と記号を交互に）");
    terms.forEach((t, i) => {
      if (!isStr(t)) errors.push(`terms[${i}] は文字で書く`);
      const isOp = OPERATORS.includes(String(t).trim());
      if (i % 2 === 1 && !isOp) errors.push(`terms[${i}] は記号（${OPERATORS.join(" ")}）にする`);
      if (i % 2 === 0 && isOp) errors.push(`terms[${i}] は項にする（記号が続いている）`);
      checkLen(t as string, LIMITS.term, `terms[${i}]`, errors);
    });
    if (terms.length % 2 === 0) errors.push("equation は項で終える");
    return errors.length ? { ok: false, errors } : { ok: true, spec: { type, title: title as string | undefined, terms: terms.map((t) => String(t).trim()) } };
  }

  // checklist
  checkKeys(d, ["type", "title", "items"], "checklist", errors);
  const items = Array.isArray(d.items) ? d.items.map(str) : [];
  if (items.length < 2 || items.length > 8) errors.push("checklist の items は2〜8個");
  items.forEach((t, i) => {
    if (!isStr(t)) errors.push(`items[${i}] は文字で書く`);
    checkLen(t as string, LIMITS.item, `items[${i}]`, errors);
  });
  return errors.length ? { ok: false, errors } : { ok: true, spec: { type: "checklist", title: title as string | undefined, items: items.map(String) } };
}

/** 図解の中の文字（数字のチェック用） */
export function figureTexts(spec: FigureSpec): string[] {
  switch (spec.type) {
    case "steps":
      return [spec.title ?? "", ...spec.items.flatMap((i) => [i.label, i.text ?? ""])];
    case "compare":
      return [spec.title ?? "", ...spec.columns.flatMap((c) => [c.label, ...c.items])];
    case "stats":
      return [spec.title ?? "", ...spec.items.flatMap((i) => [i.value, i.unit ?? "", i.label, i.note ?? ""])];
    case "equation":
      return [spec.title ?? "", ...spec.terms];
    case "checklist":
      return [spec.title ?? "", ...spec.items];
  }
}

/** 数字（カンマ区切りを含む）を取り出して、カンマを除いた形にそろえる */
export function extractNumbers(text: string): string[] {
  return [...text.normalize("NFKC").matchAll(/\d[\d,.]*\d|\d/g)].map((m) => m[0].replace(/,/g, ""));
}

/** 本文から図解ブロックを取り出す（本文の残りも返す） */
export function splitFigures(markdown: string): { figures: { source: string; line: number }[]; rest: string } {
  const figures: { source: string; line: number }[] = [];
  const rest = markdown.replace(/^```figure[ \t]*\n([\s\S]*?)^```[ \t]*$/gm, (_m, src: string, offset: number) => {
    figures.push({ source: src, line: markdown.slice(0, offset).split("\n").length });
    return "";
  });
  return { figures, rest };
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const DEFAULT_COMPARE_TONES: Tone[] = ["mist", "mint", "sky"];

export function renderFigure(spec: FigureSpec): string {
  const caption = spec.title ? `<figcaption class="fig-title"><span class="fig-badge">図解</span>${esc(spec.title)}</figcaption>` : "";
  switch (spec.type) {
    case "steps": {
      const items = spec.items
        .map(
          (it, i) =>
            `<li class="fig-step"><span class="fig-step-num" aria-hidden="true">${i + 1}</span><span class="fig-step-body"><span class="fig-step-label">${esc(it.label)}</span>${it.text ? `<span class="fig-step-text">${esc(it.text)}</span>` : ""}</span></li>`,
        )
        .join("");
      return `<figure class="fig fig-steps reveal" data-count="${spec.items.length}">${caption}<ol class="fig-steps-list">${items}</ol></figure>\n`;
    }
    case "compare": {
      const cols = spec.columns
        .map((c, i) => {
          const tone = c.tone ?? (spec.style === "before-after" ? (i === 0 ? "mist" : "mint") : DEFAULT_COMPARE_TONES[i % 3]);
          return `<div class="fig-col fig-tone-${tone}"><p class="fig-col-label">${esc(c.label)}</p><ul class="fig-col-list">${c.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
        })
        .join(spec.style === "before-after" ? `<div class="fig-arrow" aria-hidden="true"><span></span></div>` : "");
      return `<figure class="fig fig-compare reveal" data-style="${spec.style}" data-cols="${spec.columns.length}">${caption}<div class="fig-compare-cols">${cols}</div></figure>\n`;
    }
    case "stats": {
      const items = spec.items
        .map(
          (it) =>
            `<li class="fig-stat"><span class="fig-stat-label">${esc(it.label)}</span><span class="fig-stat-value">${esc(it.value)}${it.unit ? `<span class="fig-stat-unit">${esc(it.unit)}</span>` : ""}</span>${it.note ? `<span class="fig-stat-note">${esc(it.note)}</span>` : ""}</li>`,
        )
        .join("");
      return `<figure class="fig fig-stats reveal" data-count="${spec.items.length}">${caption}<ul class="fig-stats-list">${items}</ul></figure>\n`;
    }
    case "equation": {
      const last = spec.terms.length - 1;
      const parts = spec.terms
        .map((t, i) => (i % 2 === 1 ? `<span class="fig-op" aria-label="${esc(t)}">${esc(t)}</span>` : `<span class="fig-term${i === last ? " fig-term-result" : ""}">${esc(t)}</span>`))
        .join("");
      return `<figure class="fig fig-eq reveal">${caption}<div class="fig-eq-row">${parts}</div></figure>\n`;
    }
    case "checklist": {
      const items = spec.items.map((t) => `<li><span class="fig-check-box" aria-hidden="true"></span><span>${esc(t)}</span></li>`).join("");
      return `<figure class="fig fig-checklist reveal">${caption}<ul class="fig-check-list">${items}</ul></figure>\n`;
    }
  }
}
