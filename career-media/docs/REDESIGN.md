# 人物中心のデザイン改修 — 2026-10-10

トップから条件整理・相談へ進む構成を再設計した。SEO用の記事103本、公開日、査読日、URLは変更していない。

## 調査した公式サイト

2026-10-10に公式トップをブラウザで目視確認。業界全体の統計調査ではない。

| サイト | 確認した使い方 | 今回に取り入れる考え方 |
|---|---|---|
| [ハタラクティブ](https://hataractive.jp/) | 人物と大きな短いコピー、近くに相談ボタン | 同世代に親しみを感じる人物を入口に置く |
| [第二新卒エージェントneo](https://www.daini-agent.jp/) | 人物写真と相談CTAを同じメインビジュアルに配置 | 写真と次の行動を離さない |
| [マイナビジョブ20’s](https://mynavi-job20s.jp/) | 相談する二人のイラストと申込の入口 | 人が一緒に考えるサービスだと伝える |
| [Woman type](https://woman-type.jp/wt/feature/) | 人物写真を大きく使い、取材記事へつなぐ | 写真と短い見出しで読むきっかけを作る |

判断: 家具だけのトップは暮らし系に見えやすいため、人物を主役に変更した。人物の採用がCVを改善するかは未計測。各社の写真・ロゴ・コピー・実績数値は転用していない。

## 実装

- Home: 架空の同世代二人を主役に、短い見出しと相談CTA。3つの読者経路、条件整理メモの例、相談案内、既存SEO記事6件と検索へつなぐ。
- Consultation: 会話の写真、相談でできること、5段階の流れ、開閉式の詳細・FAQ、申込CTA。詳しい説明とFAQ本文はHTMLに残す。
- 控えめな写真ズーム・要素の移動・ホバー演出。文字を透明にして待たせない。動きを減らす設定では新しい演出を無効にする。
- 共通ヘッダーの脈動、相談ボタンの光沢アニメーションを取り除き、写真・文字・CTAを主役にする。
- 新しい依存ライブラリなし。GeneratedImage・既存リンク/計測・安全なConsultButtonを使用。

## 画像の納品

OpenAI内蔵 `image_gen` で5枚を生成。外部API/キーなし。元PNGは生成ツールの保存先に保持、納品用WebPは以下へコピーした。

| 採用画像 | リポジトリ内の保存先 | 用途 |
|---|---|---|
| editorial-people | public/images/generated/hero/editorial-people.webp | Home人物 |
| editorial-conversation | public/images/generated/hero/editorial-conversation.webp | 相談場面 |
| editorial-workday | public/images/generated/sections/editorial-workday.webp | 接客→オフィス |
| editorial-weekend | public/images/generated/sections/editorial-weekend.webp | 給料と休み |
| editorial-fresh-start | public/images/generated/sections/editorial-fresh-start.webp | バイト→正社員 |

完全な生成prompt、ツール名、生成日時、寸法、容量、SHA-256は `content/images/meta/<slug>.json`。全画像1536×1024、合計約733KB。既存sharpによるWebP圧縮以外に画像の編集はしていない。人物は実在の社員・利用者・担当者を表さず、画面に「生成イメージ・人物は架空です」と明記。生活写真も実在求人・福利厚生の証明ではない。

## プレビューと引継ぎ

`career-media` で `npm ci` → `npm run demo:makecareer`。ローカルの http://127.0.0.1:3100/ と /consultation を開く。中立版は `npm run demo`。

本番公開・正式提携・実申込先の有効化はしていない。申込CTAはローカルの説明画面に留まる。静的書き出しは中立版のみ。記事・メタデータ・画像・引継ぎ資料を同梱する。

## 最終確認（2026-10-11）

- 型チェック、102テスト、記事品質GATE、画像とメタデータの照合: PASS。
- 本番ビルド: 商談版・中立版とも成功。
- Home・相談・代表記事・チェック: PC1440 / mobile390 / mobile360のスクリーンショットで横スクロール・見切れ・コンソールエラーなし。
- 新画面16パターン（2ブランド×2テーマ×2幅×2ページ）: 画像読み込み・はみ出し・動きを減らす設定・中立版のブランド分離を確認。CTAのHome→相談→ローカル申込案内とFAQ開閉も確認。
- A/B/C: 13問の入力→結果→メモのコピー→相談へ到達。SNS流入元の引継ぎを確認。
- 162ページ・申込リンク462個の直接hrefを確認。本番申込先なし。JS有効/無効の商談版・静的中立版で内部申込案内に到達。
- 中立版154ページ＋404の静的HTML、154ページのMarkdownを再生成。静的版でも条件整理の入力と結果表示を確認。
- Git差分で content/articles と content/news の変更なし。SEO本文・URL・日付を保持。

未検証: 実ユーザーのCV改善、実際の申込・面談、iPhone/Safari実機。公開や実登録フォームへの送客はしていない。
