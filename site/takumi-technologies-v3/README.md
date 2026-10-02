# Takumi Technologies — Corporate site V3 (demo)

`index.html` is a single, self-contained page: HTML / CSS / inline SVG / vanilla JS.
Open it directly in a browser. The only external request is Google Fonts.
V1 (`../takumi-technologies-v1/`) and V2 (`../takumi-technologies-v2/`) are kept unchanged for comparison.

V3 is a company site first. The page tells the reader, in this order:
what Takumi Technologies does → the four services you can ask for → the in-house product 環 — MEGURI →
how 環 works → the philosophy.

## Page flow

| # | Section | Content |
|---|---|---|
| 01 | Hero | 合同会社 匠Technologies. 運用代行から、自動化まで。 The company description is readable at once (it does not wait for the logo animation). CTAs: 事業内容を見る → `#services`, 自社開発プロダクト「環」を見る → `#meguri` |
| 02 | Services `#services` | 私たちに、できること。 Four services at the same level: 運用代行 / メディアの自動運用 / 業務改善・BPO / 広告代理・マーケティング. Each has a description, the main tasks and a request example, all visible without hover |
| 03 | 環 — MEGURI `#meguri` | The product intro (運用を、ひとつの循環に。), a ring of seven roles marked AI / 人 / システム, the role list, supported media and a usage example (operations board, labelled 表示例) |
| 04 | Philosophy `#philosophy` | The four fixed lines and the figure from V2 |
| 05 | Closing | 運用の実務から、仕組みづくりまで。 The company logo is written again |

## Rules kept in the copy

- The operating platform is shown publicly only as **環 — MEGURI**, and its parts only by function
  (企画・リサーチ担当AI, 品質確認担当AI, …). Internal codenames, agent names and internal organisation
  names must not appear anywhere in the page, metadata, alt text or labels.
- Media status: Threads is confirmed on two in-house accounts (posting, publish check, KPI collection,
  with human approval before posting). X, Instagram and owned media are 順次展開予定.
- No invented numbers, cases or results. The request examples are hypothetical and say so on the page.
- Adopted copy is not converted to kanji mechanically (運用を、ひとつの循環に。 keeps ひとつ).
  The four philosophy lines are fixed and are not edited.

## Editing

```sh
cd src
python3 build.py   # page.html + logo-paths.json → ../index.html
```

`logo-paths.json` is traced from the official logo files in `../takumi-technologies-v1/src/brand/`
(see `../takumi-technologies-v1/src/trace_logos.py`).

`prefers-reduced-motion` shows every figure in its final state with no animation.
Without JavaScript, the company description, the four services, 環 — MEGURI and the role list stay readable.
