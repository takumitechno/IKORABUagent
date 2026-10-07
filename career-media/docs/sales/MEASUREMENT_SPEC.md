# 計測の設計（MEASUREMENT_SPEC）

商談用・非公開。**本番の解析ツール（GA4・GTM・Meta Pixel・TikTok Pixel・CRM・提携先 API）にはつないでいない。** 架空の数字は入れていない。
画面版: http://localhost:3100/sales/measurement（このタブで記録されたイベントを確認できる）

## 流れと、誰が記録するか

```
SNS（Instagram / 既存 TikTok）        … UTM（utm_content=theme-b-carousel など）
  ↓
Web（記事・比較・読む順番ガイド）      … サイトが記録: article_view
  ↓
条件整理チェック                        … サイトが記録: check_started / check_completed（回答は送らない）
  ↓
相談ボタン（CTA）                       … サイトが記録: cta_clicked
  ↓
提携先の申込ページへ                    … サイトが記録: partner_outbound（本番送客が有効なときだけ）
  ↓
登録 → 予約 → 面談 → 承認              … 提携先から返してもらう: partner_registered / meeting_reserved / meeting_completed / meeting_approved / meeting_rejected
```

## サイトが記録するイベント（site-owned）

正本: `src/lib/measurement/schema.ts`（辞書は [event-dictionary.csv](event-dictionary.csv)）

| イベント | いつ | 主な項目 |
| --- | --- | --- |
| article_view | 記事・ニュース解説を表示（1ページ1回） | content_id, content_slug, content_version, theme_cluster, pattern_id |
| site_search_result_clicked | 記事検索の結果を押した | target_path, result_position（検索語は入れない） |
| check_started | チェックで最初の回答を選んだ | check_version |
| check_completed | 結果を表示した | check_version |
| cta_clicked | `data-cta-kind` を持つボタン・リンク | cta_placement, cta_kind, pattern_id, content_slug |
| partner_outbound | 本番送客が有効なときの申込リンク | 同上（デモでは発生しない） |

共通の項目: `event_id`, `occurred_at`, `schema_version`, `mode`（demo / live）, `page_type`, `page_path`

### セッション単位の属性（sns_visit はイベントではなく属性）

- `session_id`: タブごとのランダム ID（sessionStorage。タブを閉じると消える。個人を特定しない）
- `source / medium / campaign / content`: セッションの最初のページの utm_*
- `referrer_host`: utm がないときの参照元ホスト名だけ（パス・クエリは持たない）
- `landing_path`, `started_at`
- SNS からのセッションかどうかは、このセッション属性で判定する（ページを見るたびに SNS 訪問として数えない）

### 入れないもの

氏名・電話・メール・自由記述・検索語・条件整理チェックの回答（生の回答）・結果の中身。
`buildEvent()` が許可した項目以外を捨てる。テスト: `tests/measurement.test.ts`

### 今の送り先

`window.__careerMediaEvents`（ブラウザのメモリ）と、商談デモ用の控え（sessionStorage、最新50件）だけ。ネットワークには送らない。
将来つなぐときは `src/lib/measurement/client.ts` の `track()` に送り先を足す（同意・プライバシーポリシーの確定が先）。

## 提携先から返してもらうデータ（partner-return）

**フロントエンドが発火してはいけない。** CTA のクリックから面談や承認を自動で作らない。
今回は辞書・CSV のひな形・データ契約の案・架空の例まで。実データの接続はしない。

- ひな形: [partner-feedback-template.csv](partner-feedback-template.csv)
- 架空の例（形式の説明用）: [partner-feedback-synthetic-example.csv](partner-feedback-synthetic-example.csv)

| 項目 | 内容 |
| --- | --- |
| partner_record_id | 提携先の管理 ID（個人を特定する情報は入れない。仮名化した ID） |
| event_name | partner_registered / meeting_reserved / meeting_completed / meeting_approved / meeting_rejected |
| occurred_at | 発生日時 |
| site_session_id | 申し込み時に渡せる場合のみ（渡し方は法務確認のうえで決める） |
| utm_* / landing_content_id | 申込ページで受け取った計測パラメータ |
| status_reason | 否認理由（already_registered / duplicate / out_of_scope / no_show など。定義は正式提携後） |
| approved_at | 承認日 |

### データ契約で決めること（正式提携後）

- 返却の頻度（例: 月次 CSV）、形式、担当者、保管期間と削除
- 帰属の window（何日以内の接点を成果に数えるか）、最初の接点／最後の接点／アシストの扱い
- 重複・既登録・No Show・判定の遅れの扱い
- 未接続・不明・未計測は「0件」と区別する

## KPI（案）

- 中心: **ユニーク承認面談数 ÷ 実測セッション数 × 1,000**
- ほか: 記事別・テーマ別の承認面談、SNS 流入別の成果、チェック開始率・完了率、CTA 率、partner_outbound、登録・予約・面談・承認・否認、貢献利益
- Google 検索の語句と個別の面談を常に1対1で結べるとは約束しない
- 同じ面談を複数の記事の成果として二重に数えない
- 少ない件数で勝ちテーマを決めつけない

## IKORABU との境界（今回はつながない）

将来の流れ: Research → Writer → Reviewer → 人の承認 → Publish → SNS → Observation → Learning

今回用意したのは、つなぐための境界だけ:
- `schema_version` つきのイベント形式（`src/lib/measurement/schema.ts`）
- コンテンツ ID（`article:<slug>` / `news:<slug>`）と `content_version`（更新日）
- 導線 ID（`pattern_id`: journey-a-sekkyaku-office など）と SNS の `utm_content`（theme-b-carousel など）
- 提携先の成果データの形式（CSV）

IKORABU MAINLINE は、このメディアのために変更していない。
