---
name: career-article-reviewer
description: 未経験転職メディアの査読手順。機械チェック C01〜C18（pipeline/src/checks.ts）と目視チェック、判定の記録。career-reviewer 専用。
user-invocable: false
---

# 査読手順（Reviewer）

1. `npm run pipeline -- check --slug <slug> --check-urls` を実行
2. 出典を開き、本文の記述と一致するかを目視で確認（agents/career-reviewer.md の目視チェック）
3. `npm run pipeline -- review <slug>` で判定を記録（content/reviews/<slug>.json、本文ハッシュつき）
4. changes_requested なら、場所と直し方を具体的に書いて編集長へ返す

## 機械チェック一覧（チェックリスト ⇔ 検出コードの対応）

ZIP の「チェックリストに追加したら check_article にも検出コードを追加する」メタルールを継承する。
新しい基準を足すときは、この表と `pipeline/src/checks.ts` と `tests/checks.test.ts` を同時に更新する。

| コード | 内容 | 重大度 |
|---|---|---|
| C01 | slug / title / summary / categories の必須・形式・重複 | error |
| C02 | 公開要件（published_at・reviewed_at・information_checked_at、出典1件以上） | error |
| C03 | 出典の URL・題名・発行元・確認日、used_for の有無、件数 | error / warning |
| C04 | 日付の形式・未来日付・更新順序・情報確認日の鮮度（180日） | error / warning |
| C05 | 内部リンク（未公開・存在しない記事、カテゴリ、職種アンカー） | error |
| C06 | related の実在・公開状態 | error / warning |
| C07 | 成果保証表現 | error |
| C08 | AI臭フレーズ（ZIP 由来） | error |
| C09 | 相対時制（ZIP 由来） | warning |
| C10 | 本文の H1（ZIP E15 由来） | error |
| C11 | 本文の生 HTML | warning |
| C12 | ニュース解説の構造（何が・誰に・何が変わるか・分からないこと・確認すること） | error |
| C13 | FAQ の空項目 | error |
| C14 | 長さの目安（ノルマではなく極端な過不足） | warning |
| C15 | 出典 URL の到達性（`--check-urls` 指定時） | warning |
| C16 | 入口タグ（roles / concerns / situations）の語彙、eyecatch の行数・長さ、illustration の名前 | error / warning |
| C17 | 読者をラベリングする表現（error）、硬い業界用語（warning） | error / warning |
| C18 | 図解（```figure）の形と長さ、本文にない数字、図解の数、figure 以外のコードブロック | error / warning |

## 判定

- エラー1件以上 → changes_requested（「だいたいOK」で通さない — ZIP の原則を継承）
- approved は公開候補。**公開は人間が** `npm run pipeline -- publish <slug> --approved-by <name>` で行う
