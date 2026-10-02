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
| 02 | Services `#services` | Four services, each with a small animated line illustration and a short list: 運用代行 / メディア自動運用 / 業務改善・BPO / 広告・マーケティング |
| 03 | 環 — MEGURI `#meguri` | 自律型AI運用・改善プラットフォーム. 指示を待つAIではなく、運用を継続するAI。 Platform marks for Threads / X / Instagram / owned media connected to 環 |
| 04 | Features `#features` | 環でできること: ten capabilities, one line each; icons draw in on arrival |
| 05 | Autonomous operation `#flow` | Seven specialist roles on one loop (AI / システム), including an AI safety check before publishing, with three short points on running without human involvement |
| 06 | Product demo `#demo` | A conceptual operating board (表示例) that moves from draft through safety check to improvement ideas without manual steps; pause and step controls |
| 07 | Cost model `#cost` | モデルケース（試算例）: outsourcing at the median of published prices (初期15万円＋月25万円) against 環 (初期導入20万円＋月8万円). Bars show the first-year total to one scale; figures count up on arrival; method note and disclaimer below |
| 08 | Philosophy | 繰り返しは、AIに。ひらめきは、人に。 A compact section: AI keeps operating and improving, so people can keep their own ひらめき. The four fixed lines sit below as a signature |
| 09 | Closing | The company logo |

## Rules kept in the copy

- Public names only: 合同会社 匠Technologies / Takumi Technologies LLC, and the product 環 — MEGURI.
  Its parts are named by function only (企画AI, 制作AI, …). No internal names anywhere.
- Media: Threads, X, Instagram and owned media are all presented as supported (自動運用), as instructed by the company.
- Operation is presented as running without human involvement; the seven-role loop has no human step (role 04 is 安全確認, an AI check).
- The cost section is a model case, not a customer result, and says so next to the numbers.
  The outsourcing side is the median of published prices (see below); the 環 side is the company's own pricing plan.
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

## Cost model: how the outsourcing median was estimated

Checked 2026-10-02. Values were taken from web search result summaries of the pages listed below
(the pages themselves could not be opened from this environment), so they should be re-checked
against the original pages before the site goes public.

Scope: SNS運用代行 plans that include 企画・投稿制作・投稿管理・月次レポート.

**Initial fee (初期費用)**, 12 data points, in 万円 (published ranges use their midpoint):

| Source type | Values |
|---|---|
| Published market ranges | 10〜30 → 20, 10〜50 → 30, 0〜30 → 15, 5〜30 → 17.5, 10〜20 → 15 |
| Listed company prices | 0, 10, 10, 20〜40 → 30, 20, 15, 5 |

Median: **15万円** (ranges only: 17.5万円, company prices only: 10万円).

**Monthly fee (月額)** for the standard scope, 9 published ranges (midpoints):
10〜30 → 20, 20〜30 → 25 (×4), 10〜50 → 30, 20〜40 → 30, 15〜30 → 22.5, 15〜40 → 27.5.
Median: **25万円** (listed company starting prices give 22.4万円).

**環 model** (company plan): 初期導入費 20万円, 月額 8万円 (戦略設計・運用管理 5万円 + AI・システム運用 3万円).

| | Outsourcing (median) | 環 model | Difference |
|---|---|---|---|
| Monthly | 25万円 | 8万円 | 17万円 (約68%) |
| Per year (monthly × 12) | 300万円 | 96万円 | 204万円 |
| First year incl. initial fee | 315万円 | 116万円 | 199万円 |

Sources consulted:
- https://s--line.co.jp/sns-agency-cost/
- https://local-mp.co.jp/media/columns/sns-operation-cost/
- https://pamxy.co.jp/marke-driven/sns-marketing/sns-daikou-price/
- https://boxil.jp/mag/a9435/
- https://www.aspicjapan.org/asu/article/43581
- https://kigyolog.com/service.php?id=133
- https://digi-mado.jp/article/88861/
- https://d-m-f.jp/blog/0040-2/
- https://nippon-smes-project.com/magazine/column/1116/
- https://cone-c-slide.com/liblog/sns/
- https://www.grop.co.jp/outsourcingpro/snsdaiko/
