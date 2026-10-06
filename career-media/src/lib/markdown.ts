import { Marked, type Tokens } from "marked";

/**
 * 記事 Markdown → HTML。
 * - 本文は pipeline (AI Writer) 由来の可能性があるため、生 HTML は描画せずエスケープする
 * - h2 に連番 id を振り、目次と中間 CTA の挿入位置に使う
 * - 外部リンクは新しいタブ + noopener
 */

export type Heading = { id: string; text: string };
export type RenderedArticle = { sections: string[]; headings: Heading[] };

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function isSafeHref(href: string): boolean {
  return /^(https?:\/\/|\/(?!\/)|#|mailto:)/i.test(href);
}

export function renderMarkdown(markdown: string): RenderedArticle {
  const headings: Heading[] = [];
  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      html(token: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(token.raw);
      },
      heading(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        if (token.depth === 2) {
          const id = `section-${headings.length + 1}`;
          // 見出し自体に「1.」などの番号がある場合、目次では番号を重複させない
          headings.push({ id, text: token.text.replace(/\*\*/g, "").replace(/^\d+[.．、]\s*/, "") });
          return `<h2 id="${id}">${inner}</h2>\n`;
        }
        const depth = Math.min(Math.max(token.depth, 3), 4);
        return `<h${depth}>${inner}</h${depth}>\n`;
      },
      link(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        if (!isSafeHref(token.href)) return text;
        const href = escapeHtml(token.href);
        if (/^https?:\/\//i.test(token.href)) {
          return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}<span class="sr-only">（外部サイト）</span></a>`;
        }
        return `<a href="${href}">${text}</a>`;
      },
      image(token: Tokens.Image) {
        return escapeHtml(token.text);
      },
      table(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Table) {
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const body = token.rows
          .map((row) => `<tr>${row.map((c, i) => (i === 0 ? `<th scope="row">${this.parser.parseInline(c.tokens)}</th>` : `<td>${this.parser.parseInline(c.tokens)}</td>`)).join("")}</tr>`)
          .join("");
        return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>\n`;
      },
    },
  });

  const html = marked.parse(markdown, { async: false }) as string;
  // 3つ目の h2 の直前で分割し、中間 CTA を挟めるようにする
  const parts = html.split(/(?=<h2 id="section-)/);
  const intro = parts[0].startsWith("<h2") ? "" : parts.shift() ?? "";
  const h2Sections = parts;
  const splitAt = Math.min(2, h2Sections.length);
  const first = intro + h2Sections.slice(0, splitAt).join("");
  const second = h2Sections.slice(splitAt).join("");
  return { sections: second ? [first, second] : [first], headings };
}

export function readingMinutes(markdown: string): number {
  const chars = markdown.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 600));
}
