---
name: career-article-writer
description: 未経験転職メディアの記事執筆手順。frontmatter 仕様、research_notes / sources の記録、文体ルール、禁止表現、自己チェック。career-writer 専用。
user-invocable: false
---

# 記事執筆手順（Writer）

## 実行フロー

1. 対象を決める（編集長から渡された content brief、または `status: draft` の記事）
2. 調査: 公的機関・業界団体・企業の公式情報など一次情報を開き、使った情報をすぐ `sources` に記録
3. 執筆: `content/articles/<slug>.md`（ニュース解説は `content/news/<slug>.md`）
4. 自己チェック: `npm run pipeline -- check --slug <slug>` でエラー0件にする
5. `status: review` に変更して編集長に返す（published にはしない）

## frontmatter

```yaml
slug: example-slug            # 英小文字・数字・ハイフン
kind: article                 # article | news
title: 32〜40文字程度。結論や読者の問いが分かる題名
summary: この記事でわかること（40〜200文字）
status: draft                 # draft → review（Writer はここまで）
categories: [mikeiken, junbi] # 先頭が主カテゴリ。content/categories.json の slug
featured: false
updated_at: 2026-10-06
information_checked_at: 2026-10-06   # 出典を確認した日
related: [other-slug]                # 公開済みの記事だけ
faq:                                  # 画面に表示し、FAQ JSON-LD にもなる
  - q: 質問
    a: 回答
sources:
  - title: 出典の題名
    publisher: 発行元
    url: https://...
    accessed_at: 2026-10-06
    used_for: 本文のどの記述に使ったか
research_notes:                       # 公開ページには出ない（DB でも非公開列）
  schema_version: 2
  writer_agent: career-writer
  quotes:
    - source_url: https://...
      text: 本文の根拠にした箇所の要約・短い引用
      used_in: 本文の該当見出し
```

ニュース解説（kind: news）は、全文転載せずに次の構造で書く（`news:` に入れる）:
`announced_by` / `announced_at` / `what_happened` / `who_is_affected` /
`impact_for_career_changers` / `unknowns`（この情報だけでは分からないこと）/ `what_to_check`。

## 入口タグ・アイキャッチ・おすすめ（frontmatter に追加）

```yaml
roles: [jimu]                       # 職種から探す（src/lib/taxonomy.ts の ROLES）
concerns: [office, mikeiken-shokushu]   # 悩みから探す（CONCERNS）
situations: [sekkyaku, pc-mikeiken]     # 今の状況から探す（SITUATIONS）
eyecatch: ["PCが苦手でも、", "事務職って目指せる？"]  # カードに大きく出す1〜2行。1行12文字前後まで
recommended: false                  # 編集部おすすめ（編集長が決める。Writer は false のまま）
# illustration: coins               # 任意。カードのイラストを指定したいときだけ（src/lib/illustrations/motifs.ts の名前。C16 で検査）
```

- タグは記事の中身が本当に役立つ入口にだけ付ける（1グループ0〜3個）。悩みか状況のどちらかは必ず付ける
- eyecatch は読者が「自分のことだ」と思える短い言葉。煽らない、数字を誇張しない
- 語彙は `src/lib/taxonomy.ts` にあるものだけ（C16 で検査）

## 読者像と言葉づかい

`docs/PERSONA.md` を読む。要点:
- 表向きは「はじめての転職・未経験転職で迷っている20代」。年収や属性で読者をラベリングしない（C17）
- 見出しは読者の言葉（「何から始める？」「未経験でも大丈夫？」「給料は下がる？」）
- 業界用語（市場価値、キャリア戦略、人的資本、ポータブルスキル）は使わない（C17）

## 図解（スマホで「見て分かる」ように）

本文の中に ```figure ブロックを書くと、図解として表示される（`src/lib/figures.ts`）。1記事に1〜2個（多くても3個）。

| type | 使いどころ | 中身 |
| --- | --- | --- |
| steps | 手順・順番 | items（2〜6）: label・text |
| compare | AとBの違い / 変更前→変更後（style: before-after） | columns（2〜3）: label・tone・items |
| stats | 大事な数字 | items（1〜4）: value（必ず引用符）・unit・label・note |
| equation | 計算式 | terms: 項と記号（+ − × ÷ = →）を交互に |
| checklist | 確認すること | items（2〜8） |

```figure
type: steps
title: 志望動機は3つの要素で組み立てる
items:
  - label: きっかけ
    text: その仕事に興味を持った体験
  - label: 経験との接点
  - label: 入社後に取り組みたいこと
```

- 図解は本文の内容を見やすくするもの。本文にない事実・数字を図解だけに書かない（C18 が数字を照合する）
- 本文の文章は消さない。図解は、説明している段落や箇条書きのすぐ後に置く
- スマホで読める長さ: title 30文字・label 16文字・text 48文字・項目 40文字まで（C18）
- 既にある Markdown の表を図解で繰り返さない。表は値が短ければスマホでも表のまま、長い文章が入る表はスマホでカード型に表示される

## 文体ルール

- 読者は未経験から転職を考える20代。専門用語は言い換えるか、初出で説明する
- 結論を先に、具体例（書き出し例・質問例・計算例）を必ず入れる
- 「会社によって違うこと」は断定しない。確認のしかたを書く
- 時期は絶対日付で書く（「来月」「最近の」ではなく「2025年4月から」）— ZIP の時制ルールを継承
- 本文に H1（`# `）を書かない。H2 から始める
- 生の HTML を書かない（表示時にエスケープされる）

## 禁止

- 成果保証: 「必ず転職できる」「確実に内定」「年収が必ず上がる」など（C07）
- AI臭フレーズ: 「することができます」「幅広く」「いかがでしたでしょうか」など（C08）— ZIP の禁止リストを継承
- 求人の転載、特定企業への応募のすすめ、相談先 LP の URL の直書き

## ZIP 版から廃止したルール

対話形式（佐藤・室谷）/ 10,000文字以上 / `<mark>` 10回以上 / 「！」10回以上 / テーブル3つ以上 /
図解画像2枚必須 / 競合の1.5〜2倍の情報量 / 公式 URL は .go.jp 等に限る — いずれも読者価値と無関係なため。
