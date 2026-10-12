# 証跡（2026-10-12 の SEO・記事・相談導線の改善）

本文は [../../SEO_CONTENT_STRATEGY_2026_10_12.md](../../SEO_CONTENT_STRATEGY_2026_10_12.md)。ここには、その判断と検証の元になった記録を置く。ログはすべてローカル（127.0.0.1）のサーバーと書き出しに対して取ったもので、外部への送信はしていない。

「変更前」はZIPを取り込んだだけのコミット `273bd39`（別の作業ツリーで、MakeCareer は 3101 番、中立は 3201 番で起動）、「変更後」はこの証跡と同じコミット（MakeCareer 3100・中立 3200・静的書き出し 3301）。

## 取り込みと素材の保全

| ファイル | 内容 |
| --- | --- |
| `import-verification.json` | ZIP（SHA256 `e0204b23…bc9f46`）から取り込んだ 651 ファイルごとの、ZIP 内の SHA256・取り込み後の SHA256・改行をそろえたか。ZIP の manifest は 683 件で、残り 32 件は `HANDOFF_START.md`・`handoff/` の証跡など共有ブランチ側の資料と、ルートの `AGENTS.md`・`CLAUDE.md`・`README.md`（改行をそろえるとリポジトリのものと同一） |
| `asset-lock-check.txt` | `handoff/asset-lock.json` の48件を、この時点のファイルと照合した結果。34件が同一、14件（JSON・SVG）が改行の違いだけ、違い・欠落は0件 |

## 原稿と棚卸し

| ファイル | 内容 |
| --- | --- |
| `content-check-before.json`・`content-check-after.json` | `npm run content:check -- --json` の前後。エラーは前後とも0。再査読の警告（C04）が本文を直した記事の分だけ増えている（9→38）。情報確認日の警告5件・C03 2件・C14 1件は前後で同じ |
| `inventory-before.csv` | 変更前の棚卸しの指標（変更後は `../article-inventory.csv`） |
| `classification-agent-A-office-roles.json`・`classification-agent-B-pay-holidays.json` | 別のエージェントが着手前に付けた判定（クラスターA・B）。想定する検索語、読者の疑問、担当、隣の記事との違い、次の行動、判定と理由、具体的な直し方、相談への橋、リスク |

## 競合と方針の調査（`research/`）

| ファイル | 内容 |
| --- | --- |
| `research/0-google-search-guidance.json` | Google 検索のドキュメント（有用なコンテンツ、構造化データなど）の要点 |
| `research/1-path-a-office.json`・`2-path-b-pay-holidays.json`・`3-path-c-freeter-first-job.json` | 3つの導線の検索語ごとの競合ページ、読者の意図、足りない材料、記事ごとの提案 |

注意（各ファイルの `caveats` にも書いてある）:

- ページを直接開けていない。`developers.google.com`・`www.mhlw.go.jp` などへの接続は環境のネットワーク設定で拒否された。文言と数字は検索ツールが返した抜粋による。本文に入れる前に一次資料で確かめる必要がある
- 検索は米国リージョンの検索ツールで、`approx_rank` は返ってきた順番。日本の Google の順位ではない。検索量のデータはない
- 調査はZIPの取り込み前に行ったため、調査した時点では最新版の本文を見ていない。提案は取り込み後の本文と照らして取捨した

## 技術SEO（HTML だけを見る監査）

| ファイル | 内容 |
| --- | --- |
| `seo-audit-before-makecareer.json`・`seo-audit-before-neutral.json` | 変更前の監査結果（ページごとの詳細 `pages` は省いた）。検出6件は記事一覧の2ページ目以降のパンくずが「記事一覧」で終わるもの |
| `seo-audit-after-makecareer.json`・`seo-audit-after-neutral.json`・`*.log` | 変更後。問題0件。上の6件は、ページ送りのパンくずが一覧で終わるのは正しいと判断して監査の規則を見直したもので、サイトの出力は変えていない |

再実行: `npx tsx scripts/seo-audit.ts --base http://127.0.0.1:3100 --out report.json`

## 本番送客OFFと相談導線

| ファイル | 内容 |
| --- | --- |
| `outbound-makecareer.log`・`outbound-neutral.log`・`outbound-static.log` | 全ページの HTML で、相談の申込ボタン451個がすべてサイト内の説明ページを指し、提携先 LP へのリンクが0であること |
| `consultation-journey-dynamic.log`・`.json` | 中立と MakeCareer の動的サーバーで36件。トップの3つの相談テーマ、記事末尾、スマホ固定ボタン（通常クリック・Ctrl+クリックの新しいタブ・直接URL・JS無効）、キーボード、履歴、reduced-motion、320/390/1440px、Light/Dark |
| `consultation-journey-static.log`・`.json` | 静的書き出しで18件 |
| `meeting-smoke.log` | 商談デモの通し確認（動的と静的、エラー0） |
| `export-static.log`・`sns-images.log` | 中立版の書き出し（160ページ＋404）と SNS 画像の書き出し（22枚。画像は `export/sns/` で、リポジトリの外） |

## 画面の比較

| ファイル | 内容 |
| --- | --- |
| `visual-diff-makecareer.csv` | MakeCareer の20ページ × PC 1440px・スマホ 390px・小型 320px × Light/Dark（120組）。全画面の画素の差、高さの変化、変更後の横はみ出し・画像の読み込み失敗・コンソールエラー・外部への通信 |
| `visual-diff-neutral.csv` | 中立版の8ページ（48組） |
| `images/home-updates-mobile-before-after.jpg` | トップの新着・更新記事（スマホ）。デザインは同じで、表示する記事だけが変わった |
| `images/pc-nigate-jimu-guide-mobile-neutral-before-after.jpg` | ガイドを足した記事（中立版・スマホ）。短いH1と「この記事の要点」が出る。既存の部品で、新しいデザインはない |
| `images/sekkyaku-office-opening-mobile-before-after.jpg`・`images/sekkyaku-office-checklist-mobile-before-after.jpg` | 冒頭の一般化の修正と、同じ5項目の二重表示の削除。下部にスマホ固定ボタンが見える |
| `images/donichi-yasumi-nenshu-hikaku-new-table-mobile-after.jpg` | 年間休日と1時間あたりの表（仮の例）を足した後のスマホ表示 |
| `images/sns-theme-c-slide-5-mobile-before-after.jpg`・`images/sns-theme-c-slides-2-5-after.jpg` | SNS テーマCの文言の修正（デザインは同じ）と、書き出した投稿画像 |

全画面の比較画像（1組数MB）はリポジトリに入れていない。同じ比較は、2つの版を起動して `visual-diff-*.csv` と同じページ・幅・テーマで撮れば再現できる。
