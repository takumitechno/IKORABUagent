# Takumi Technologies — Corporate site V3 refined (demo)

`index.html` is a single, self-contained page: HTML / CSS / inline SVG / vanilla JS.
Open it directly in a browser. The only external request is Google Fonts.
V1, V2 and V3 (`../takumi-technologies-v1/`, `-v2/`, `-v3/`) are kept unchanged for comparison.

This pass keeps the V3 look and changes the communication: plain Japanese, lists over paragraphs,
a clearer product, and philosophy reduced to one moment near the end.

## Page flow

| # | Section | What the visitor learns |
|---|---|---|
| 01 | Hero | 事業の運用を、もっとシンプルに。 What the company does, in one sentence. The official logo appears whole (no partial brush strokes) |
| 02 | Services `#services` | Four services as short lists: 運用代行 / メディア自動運用 / 業務改善・BPO / 広告・マーケティング |
| 03 | 環 — MEGURI `#meguri` | 自律型AI運用・改善プラットフォーム. 指示を待つAIではなく、運用を継続するAI。 Platform marks for Threads / X / Instagram / owned media connected to 環 |
| 04 | Features `#features` | 環でできること: ten capabilities, one line each |
| 05 | Autonomous operation `#flow` | Seven specialist roles on one loop (AI / 人 / システム), with three short points on what runs without manual work |
| 06 | Product demo `#demo` | A conceptual operating board (表示例) that moves from draft to improvement ideas; pause and step controls |
| 07 | Cost model `#cost` | モデルケース（試算例）: 28万円 → 8万円 / 月, drawn to one scale, with the disclaimer |
| 08 | Philosophy | The four fixed lines, once |
| 09 | Closing | The company logo |

## Rules kept in the copy

- Public names only: 合同会社 匠Technologies / Takumi Technologies LLC, and the product 環 — MEGURI.
  Its parts are named by function only (企画AI, 制作AI, …). No internal names anywhere.
- Media status: Threads is confirmed on two in-house accounts. X, Instagram and owned media are 順次対応予定.
- The cost section is a model case, not a customer result, and says so next to the numbers.
- Numbers in the product demo are labelled 表示例 and are not production data.
- The four philosophy lines are fixed and are not edited.

## Platform marks

Threads, X and Instagram marks are the monochrome paths from Simple Icons 13.21.0 (CC0), drawn in
`currentColor` at their original proportions. The owned-media mark is a generic browser glyph.

## Editing

```sh
cd src
python3 build.py   # page.html + logo-paths.json → ../index.html
```

`prefers-reduced-motion` shows every figure in its final state with no animation.
Without JavaScript, all text, lists, the role list, the demo's final state and the cost model stay readable.
