/*
 * ブラウザ内で実行し、画面に見えている内容を Markdown にする（scripts/export-static.ts が文字列として読み込む）。
 * 装飾（aria-hidden）と非表示の要素は省き、タブは全パネル、FAQ（details）は開いた状態で書き出す。
 */
function careerMediaToMarkdown(root) {
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "IFRAME", "CANVAS", "DIALOG"]);
  const BLOCKISH = "h1,h2,h3,h4,h5,h6,p,ul,ol,dl,table,figure,blockquote,pre,details,section,article,hr";
  const clean = (s) => s.replace(/[\s ]+/g, " ");
  const tidy = (s) => s.replace(/[ \t]*\n[ \t]*/g, "\n").replace(/ {2,}/g, " ").trim();

  function hidden(el) {
    if (el.getAttribute("aria-hidden") === "true" || el.hasAttribute("hidden")) return true;
    const cs = getComputedStyle(el);
    return cs.display === "none" || cs.visibility === "hidden";
  }
  const isSvg = (el) => el.namespaceURI === "http://www.w3.org/2000/svg";
  /** 文字と要素がまざった親（「全<span>30</span>本」など）の中では、要素の前後に空白を入れない */
  const hasOwnText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
  const MARKER = /^(\( \)|\(●\)|\[ \]|\[x\])$/;
  const NUMBER_ONLY = /^\d{1,2}$/;
  const label = (el) => (el.getAttribute("aria-label") || el.querySelector(":scope > title")?.textContent || "").trim();

  function inputText(el) {
    const type = (el.getAttribute("type") || "text").toLowerCase();
    if (type === "radio") return el.checked ? "(●) " : "( ) ";
    if (type === "checkbox") return el.checked ? "[x] " : "[ ] ";
    if (type === "hidden") return "";
    if (type === "submit" || type === "button") return `[ボタン: ${el.value}]`;
    const hint = el.getAttribute("placeholder") || el.getAttribute("aria-label") || "";
    return `[入力欄${hint ? `: ${hint}` : ""}]`;
  }

  /** 要素の中身を1行の文字列にする（リンク・強調・入力欄を含む） */
  function inline(el) {
    if (isSvg(el)) {
      const l = el.getAttribute("role") === "img" ? label(el) : "";
      return l ? `[図: ${l}]` : "";
    }
    const tag = el.tagName;
    if (tag === "BR") return "\n";
    if (tag === "IMG") {
      const alt = (el.getAttribute("alt") || "").trim();
      return alt ? `![${alt}](${el.getAttribute("src")})` : "";
    }
    if (tag === "INPUT") return inputText(el);
    if (el.getAttribute("role") === "img") {
      const l = label(el);
      return l ? ` [図: ${l}] ` : "";
    }
    let inner = "";
    for (const child of el.childNodes) {
      if (child.nodeType === 3) inner += clean(child.nodeValue);
      else if (child.nodeType === 1 && !SKIP.has(child.tagName) && !hidden(child)) inner += inline(child);
    }
    const t = inner.trim();
    if (!t) return inner ? " " : "";
    const href = tag === "A" ? el.getAttribute("href") : null;
    if (href) return `[${t.replace(/\n/g, " ")}](${href})`;
    if (tag === "STRONG" || tag === "B") return `**${t}**`;
    if (tag === "CODE") return "`" + t + "`";
    if (tag === "BUTTON") return ` [ボタン: ${t}] `;
    const display = getComputedStyle(el).display;
    return display === "inline" || (el.parentElement && hasOwnText(el.parentElement)) ? inner : ` ${t} `;
  }
  const text = (el) => tidy(inline(el)).replace(/\n/g, " ");

  const quote = (blocks) =>
    blocks
      .join("\n\n")
      .split("\n")
      .map((l) => (l ? `> ${l}` : ">"))
      .join("\n");

  /** 横並び（flex row）の短い要素は1行にまとめる（日付・タグ・ボタンの並びなど） */
  function rowLine(el) {
    const cs = getComputedStyle(el);
    if (!cs.display.endsWith("flex") || cs.flexDirection.startsWith("column")) return null;
    if (el.querySelector(BLOCKISH) || (el.textContent || "").length > 160) return null;
    if (hasOwnText(el)) {
      const t = text(el);
      return t ? [t] : [];
    }
    const parts = [];
    for (const child of el.childNodes) {
      if (child.nodeType === 3) {
        const t = clean(child.nodeValue).trim();
        if (t) parts.push(t);
      } else if (child.nodeType === 1 && !SKIP.has(child.tagName) && !hidden(child)) {
        const t = text(child);
        if (t) parts.push(t);
      }
    }
    // 番号付きリストの中では、見た目用の番号（1, 2 …）を省く（リストの番号と重なるため）
    if (parts.length > 1 && NUMBER_ONLY.test(parts[0]) && el.closest("ol")) parts.shift();
    const sep = el.classList.contains("fig-eq-row") ? " " : " ・ ";
    return parts.length ? [parts.reduce((line, part, i) => line + (MARKER.test(parts[i - 1]) ? " " : sep) + part)] : [];
  }

  /** 子要素を順に見て、行内の要素はつなげ、ブロックの要素は1段落ずつにする */
  function blocksOf(el) {
    const blocks = [];
    let run = "";
    const flush = () => {
      const t = tidy(run);
      if (t) blocks.push(t);
      run = "";
    };
    const visit = (node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === 3) {
          run += clean(child.nodeValue);
          continue;
        }
        if (child.nodeType !== 1 || SKIP.has(child.tagName) || hidden(child)) continue;
        const display = getComputedStyle(child).display;
        if (display === "contents") {
          visit(child);
          continue;
        }
        const inlineLike = display.startsWith("inline") || isSvg(child);
        if (inlineLike && !(child.tagName === "A" && child.querySelector(`${BLOCKISH},div`))) {
          run += inline(child);
          continue;
        }
        flush();
        blocks.push(...block(child));
      }
    };
    visit(el);
    flush();
    return blocks;
  }

  const container = (el) => rowLine(el) ?? blocksOf(el);

  function list(el) {
    const ordered = el.tagName === "OL";
    const lines = [];
    let n = 1;
    for (const li of el.children) {
      if (li.tagName !== "LI" || hidden(li)) continue;
      const parts = container(li);
      // 見た目用の番号（番号付きリスト）や「・」（箇条書き）は、Markdown のリスト記号と重なるので省く
      if (ordered && parts.length > 1 && NUMBER_ONLY.test(parts[0])) parts.shift();
      if (!ordered && parts.length) parts[0] = parts[0].replace(/^・\s*/, "");
      if (!parts.length || !parts[0]) continue;
      const marker = ordered ? `${n++}. ` : "- ";
      const body = parts.join("\n").split("\n");
      lines.push(marker + body[0], ...body.slice(1).map((l) => (l ? " ".repeat(marker.length) + l : l)));
    }
    return lines.join("\n");
  }

  function table(el) {
    const rows = [...el.querySelectorAll("tr")].filter((tr) => tr.closest("table") === el && !hidden(tr));
    const cells = rows.map((tr) => [...tr.children].filter((c) => /^T[HD]$/.test(c.tagName)).map((c) => text(c).replace(/\|/g, "\\|")));
    if (!cells.length) return "";
    const width = Math.max(...cells.map((r) => r.length));
    const pad = (r) => [...r, ...Array(width - r.length).fill("")];
    return [`| ${pad(cells[0]).join(" | ")} |`, `|${" --- |".repeat(width)}`, ...cells.slice(1).map((r) => `| ${pad(r).join(" | ")} |`)].join("\n");
  }

  /** カード全体がリンクのときは、見出し（なければ最初の段落）にリンクを付ける */
  function linkBlock(el) {
    const href = el.getAttribute("href");
    const inner = container(el);
    if (inner.length > 1 && NUMBER_ONLY.test(inner[0]) && el.closest("ol")) inner.shift();
    if (!inner.length || inner.some((b) => b.includes(`](${href})`))) return inner;
    const h = inner.findIndex((b) => /^#{1,6} /.test(b) && !b.includes("\n"));
    if (h >= 0) {
      inner[h] = inner[h].replace(/^(#{1,6}) (.*)$/, (_, mark, t) => `${mark} [${t}](${href})`);
      return inner;
    }
    const p = inner.findIndex((b) => !b.includes("\n") && !NUMBER_ONLY.test(b) && !/^(\||- |\d+\. |> |\[)/.test(b));
    if (p >= 0) inner[p] = `[${inner[p]}](${href})`;
    else inner.push(`（リンク先: ${href}）`);
    return inner;
  }

  function block(el) {
    if (isSvg(el)) {
      const l = el.getAttribute("role") === "img" ? label(el) : "";
      return l ? [`[図: ${l}]`] : [];
    }
    const tag = el.tagName;
    const heading = /^H([1-6])$/.exec(tag);
    if (heading) {
      const t = text(el);
      return t ? [`${"#".repeat(Number(heading[1]))} ${t}`] : [];
    }
    if (el.getAttribute("role") === "img") {
      const l = label(el);
      return l ? [`[図: ${l}]`] : [];
    }
    if (el.classList.contains("tabset")) {
      const labels = [...el.querySelectorAll(":scope > .tab-list > .tab-label")].map(text);
      const panels = [...el.querySelectorAll(":scope > .tab-panels > .tab-panel")];
      return panels.flatMap((panel, i) => [`**［タブ: ${labels[i] || i + 1}］**`, ...blocksOf(panel)]);
    }
    if (tag === "NAV" && /パンくず/.test(el.getAttribute("aria-label") || "")) {
      const items = [...el.querySelectorAll("li")].map(text).filter(Boolean);
      return items.length ? [`パンくず: ${items.join(" › ")}`] : [];
    }
    switch (tag) {
      case "SUMMARY":
      case "FIGCAPTION": {
        let t = text(el);
        // 「図解」などの短いバッジ + 題名 → 「図解: 題名」
        const first = el.firstElementChild;
        const badge = first?.tagName === "SPAN" ? (first.textContent || "").trim() : "";
        if (badge && badge.length <= 4 && t.length > badge.length && t.startsWith(badge)) t = `${badge}: ${t.slice(badge.length).trim()}`;
        return t ? [`**${t}**`] : [];
      }
      case "P": {
        const t = tidy(inline(el));
        return t ? [t] : [];
      }
      case "UL":
      case "OL": {
        const l = list(el);
        return l ? [l] : [];
      }
      case "TABLE": {
        const t = table(el);
        return t ? [t] : [];
      }
      case "DL": {
        const lines = [...el.querySelectorAll("dt, dd")]
          .filter((c) => c.closest("dl") === el && !hidden(c))
          .map((c) => (c.tagName === "DT" ? `- **${text(c)}**` : `  ${text(c)}`));
        return lines.length ? [lines.join("\n")] : [];
      }
      case "HR":
        return ["---"];
      case "PRE":
        return ["```\n" + (el.textContent || "").replace(/\n$/, "") + "\n```"];
      case "BLOCKQUOTE": {
        const inner = blocksOf(el);
        return inner.length ? [quote(inner)] : [];
      }
      case "FIGURE": {
        const inner = container(el);
        return inner.length ? [quote(inner)] : [];
      }
      case "BUTTON": {
        const t = text(el);
        return t ? [`[ボタン: ${t}]`] : [];
      }
      case "IMG":
      case "INPUT": {
        const t = tidy(inline(el));
        return t ? [t] : [];
      }
      case "A":
        if (el.getAttribute("href")) return linkBlock(el);
        return container(el);
      default:
        return container(el);
    }
  }

  return block(root)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** 1ページ分: タイトル・説明・見出し・本文（main）の Markdown */
function careerMediaPage() {
  document.querySelectorAll("details").forEach((d) => (d.open = true));
  const main = document.querySelector("main#main") || document.body;
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    h1: (main.querySelector("h1")?.textContent || "").replace(/\s+/g, " ").trim(),
    markdown: careerMediaToMarkdown(main),
  };
}

/** 全ページ共通の部分（プレビューバー・ヘッダー・フッター） */
function careerMediaLayout() {
  const parts = [];
  for (const el of document.body.children) {
    if (el.id === "main" || el.matches('script, a[href="#main"], dialog')) continue;
    const md = careerMediaToMarkdown(el);
    if (md) parts.push(md);
  }
  return parts.join("\n\n---\n\n");
}
