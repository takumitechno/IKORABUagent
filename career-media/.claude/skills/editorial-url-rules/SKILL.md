---
name: editorial-url-rules
description: 未経験転職メディアの URL ルール。記事は /articles/{slug}、ニュース解説は /news/{slug}。内部リンクを書くすべての agent が読む。
user-invocable: false
---

# URL ルール

ZIP の `/subsidy/{id}` ルールを置き換えたもの。

| ページ | URL |
|---|---|
| 記事 | `/articles/{slug}` |
| ニュース解説 | `/news/{slug}` |
| カテゴリ | `/categories/{category-slug}` |
| 職種比較 | `/jobs`、各職種は `/jobs#{role-slug}`（hojin-eigyo / customer-support / it-support / jimu） |
| 条件整理チェック | `/check` |
| 相談 | `/consultation`（相談先 LP の URL は `src/config/partner.ts` だけが持つ。記事に直書きしない） |

- slug は英小文字・数字・ハイフンのみ
- 内部リンクは **公開済み（published）の記事にだけ** 張る。`npm run pipeline -- check` の C05 が検出する
- 外部（通知など）に出す URL は `${NEXT_PUBLIC_SITE_URL}/articles/{slug}` の Full URL
- 相談先 LP の URL・計測パラメータを記事本文に書かない
