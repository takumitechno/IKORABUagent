# START HERE — 商談（2026-10-13）用の入口

未経験転職メディアの MVP と、MakeCareer 様との商談で見せる資料一式。**すべてローカル・非公開。** 本番公開・本番送客・実 SNS 投稿・本番解析はしていない。

## 1. 中立デモを起動する（実在企業名なし）

```bash
cd career-media
npm ci
npm run demo            # → http://localhost:3000 （商談メニュー: /sales）
```

## 2. MakeCareer 様向け 商談用プレビューを起動する（非公開）

```bash
npm run demo:makecareer # → http://localhost:3100 （商談メニュー: http://localhost:3100/sales）
```

- 2回目以降は `npm run demo:makecareer -- --skip-build` で速く起動できる
- どちらも 127.0.0.1 にだけ bind する（同じネットワークの他の端末・インターネットからは見えない）
- 画面上部に「商談用プレビュー（非公開・正式提携前）」が出る。noindex。ロゴ・実績・求人・LP の文章は使っていない

## 3. 本番送客が OFF であることを確かめる

- 画面で: 相談ボタンを押すと `/consultation/apply`（「ここから申し込みページへ進む想定です」）に留まる。新しいタブで開いても同じ
- コマンドで（JavaScript を使わずに全ページの HTML を確認）:
  ```bash
  npm run check:outbound -- --base http://127.0.0.1:3100
  ```
- 仕組み: 本番送客は「ブランド利用の許諾」「人が書いた承認記録」「`PARTNER_LIVE_OUTBOUND=on`」の3つがそろったときだけ有効（`src/config/partner.ts`）。`PARTNER_PROFILE=makecareer` だけでは有効にならない。テスト: `tests/consultation.test.ts`

## 4. 5分デモ

- 順番と話す内容: [docs/sales/MEETING_DEMO_RUNBOOK.md](docs/sales/MEETING_DEMO_RUNBOOK.md)（画面版: http://localhost:3100/sales）
- トークスクリプト: [docs/sales/TALK_TRACK_5MIN.md](docs/sales/TALK_TRACK_5MIN.md)

## 5. 3つの読者導線

| 導線 | 入口（読む順番ガイド） | 代表の記事 |
| --- | --- | --- |
| A. 接客経験 → オフィスワーク | http://localhost:3100/situations/sekkyaku#guide | /articles/sekkyaku-keiken-ikasu |
| B. 給料を下げたくない＋土日休み | http://localhost:3100/concerns/kyuryo#guide | /articles/donichi-yasumi-nenshu-hikaku |
| C. フリーター・正社員経験が少ない | http://localhost:3100/situations/freeter#guide | /articles/freeter-seishain-hajimeni |

どの導線も「記事 → 比べる → 条件整理（/check）→ 相談で聞くこと」の順。相談しなくても判断の材料がそろい、相談したい人は /consultation に直接行ける。トップの「はじめての転職ガイド」から3つとも開ける。

## 6. Instagram の投稿案（3テーマ・投稿案 / 未公開）

- 画面: http://localhost:3100/sales/sns （カルーセル・リール台本と絵コンテ・Stories・TikTok の差分メモ）
- 原稿: [docs/sales/sns/](docs/sales/sns/)（THEME_A / B / C）
- カルーセル画像（1080×1350）: `npm run sns:images -- --base http://127.0.0.1:3100` → `export/sns/`

## 7. Pilot の提案

- 1枚の提案（印刷できる）: http://localhost:3100/sales/proposal ／ [docs/sales/ONE_PAGE_PROPOSAL.md](docs/sales/ONE_PAGE_PROPOSAL.md)
- 詳細（価格・範囲・作業時間の仮説・3か月の進め方）: [docs/sales/PILOT_PROPOSAL.md](docs/sales/PILOT_PROPOSAL.md)、[docs/sales/OPERATING_PLAN_3M.md](docs/sales/OPERATING_PLAN_3M.md)
- 反論への回答: [docs/sales/OBJECTIONS.md](docs/sales/OBJECTIONS.md)
- 商談で聞くこと: [docs/sales/PARTNER_DISCOVERY_QUESTIONS.md](docs/sales/PARTNER_DISCOVERY_QUESTIONS.md)

## 8. 計測

- 画面: http://localhost:3100/sales/measurement （このタブで記録されたイベントを確認できる。送信なし）
- 設計: [docs/sales/MEASUREMENT_SPEC.md](docs/sales/MEASUREMENT_SPEC.md)、[event-dictionary.csv](docs/sales/event-dictionary.csv)、[partner-feedback-template.csv](docs/sales/partner-feedback-template.csv)、[架空の例](docs/sales/partner-feedback-synthetic-example.csv)

## 9. 所有と契約終了

[docs/sales/OWNERSHIP_AND_EXIT.md](docs/sales/OWNERSHIP_AND_EXIT.md)、[docs/sales/DOMAIN_HOSTING_OPTIONS.md](docs/sales/DOMAIN_HOSTING_OPTIONS.md)、[docs/sales/LEGAL_PRIVACY_OPEN_QUESTIONS.md](docs/sales/LEGAL_PRIVACY_OPEN_QUESTIONS.md)

## 10. 書き出し・スクリーンショット

| もの | 作り方 | 場所 |
| --- | --- | --- |
| 全ページの Markdown（中立デモ） | `npm run export:static` | `export/pages/`（リポジトリに含む） |
| 全ページの静的 HTML（中立デモ） | 同上 | `export/site/`（git 管理外） |
| スクリーンショット（360 / 390 / デスクトップ） | `npm run screenshots`（`BASE_URL`・`SALES=1` で切り替え） | `screenshots/`（git 管理外） |

静的 HTML・file:// ・1ファイル版では、サーバーで動く機能（記事検索の絞り込みなど）が動かない。**商談のメインは、確認済みの localhost**。静的サイトとスクリーンショットは予備。

## 11. テスト

```bash
npm run lint && npm test && npm run content:check && npm run build
```

## 12. 資料の ZIP

商談用の ZIP（ソース・書き出し・スクリーンショット・資料）は、作業完了の報告と一緒に渡す（node_modules・.env・キャッシュ・IKORABU の他の資産は含めない）。

## ほかの資料

- 現状の棚卸し: [docs/sales/CONTENT_AUDIT.md](docs/sales/CONTENT_AUDIT.md)
- MakeCareer の Research 記録（確認できたこと／仮説）: [docs/sales/MAKECAREER_RESEARCH.md](docs/sales/MAKECAREER_RESEARCH.md)
- エージェント向けの作業ルール: [AGENTS.md](AGENTS.md)
