# 最新ローカル状態のSEO引継ぎ（2026-10-12）

このZIPの career-media/ は、未コミット・未追跡ファイルを含む現在のソースです。
GitHubのHEADだけでは、この状態を再現できません。

- 元リポジトリ: takumitechno/IKORABUagent
- ローカルブランチ: codex/makecareer-meeting-corrections
- 基準HEAD: d5260a3bea0b566b491b0d7a99d938dcafb43649
- 作成日時（UTC）: 20261012T024109Z
- 新しいGitコミットのSHAではなく、manifestとZIPのSHA256で識別するファイルスナップショットです。

## 最初に行うこと

1. manifest.jsonのファイルSHA256を照合し、欠落・改変がないことを確認する。
2. 元の作業を保護したうえで、Claudeの作業ブランチにこのcareer-media/を取り込む。
3. 取り込みには画像・新規ソース・全原稿・資料・書き出しを含める。古いファイルへ記事だけを部分適用しない。
4. handoff/removed-files.jsonは基準HEADから消えているファイルの一覧。既存作業を勝手に消さず、基準HEADと照合する。
5. rootとcareer-mediaのAGENTS.md、README、START_HEREを読み、最新3資料を確認する。
6. 前回渡したSEO改善依頼を、このスナップショットから再開する。

## 最新版の目印

- docs/MARKETING_UPGRADE_2026_10_12.md
- docs/SEO_IMPROVEMENTS_2026_10_12.md
- docs/ARTICLE_IMAGES_AND_UPDATES.md
- 105記事原稿＋7ニュース原稿。表示対象103記事＋7ニュース、非公開2記事。
- 主力8記事の補強済み原稿と、選定済みアイキャッチシリーズ。
- handoff/evidence/tests-final.logは前回の121テスト成功記録。

これらのログは前回納品時の証跡です。ZIP作成時に再ビルド・再テストしたという意味ではありません。
Claudeが変更した後は、既存の型検査・テスト・コンテンツ検査・ビルド・表示・送客検査を実行してください。

## 今回維持するもの

人物写真、既存アイキャッチ、画像選定、配色、フォント、レイアウト、アニメーション、スマホ・明暗対応を維持。
handoff/asset-lock.jsonの画像・記録・対応付けを基準に比較する。画像の再生成・削除・差し替えはしない。
handoff/evidence/viewport-final/に変更前のPC・スマホ・小型画面の確認画像を同梱。

LOCAL / NON-PUBLIC / noindex / 本番送客OFF / 正式提携前を維持。
ブランド・公開・本番送客の承認情報、記事の公開状態、reviewed_atを変更しない。
確認済みの相談情報はオンライン可能・初回30〜60分程度・30代対応可能。
初回連絡の目安・地域職種別の紹介可否は未確認。

## 前回レビューで残った具体的な修正

- SNSテーマCの「祝日なども休みなら120日前後の会社が多い」は、補強済み記事の仮の例と整合していない。
  カルーセル・caption・alt・Reel・Stories・派生資料を確認し、根拠のない一般化を解消する。
- 記事末尾・サイドバーと異なり、スマホ固定CTAは相談テーマを渡していない。
  既存の共通処理でテーマを保持し、固定CTA自体を通常操作・直接href・新規タブ・JS無効相当で確認する。
- 主力10〜15記事の検索意図・競合との差・根拠・内部リンクを優先し、記事数だけを増やさない。
- 全記事の重複やthin判定は独立して検証する。取材・実績・監修者・確認日を創作しない。
- SEOの制作完成度と、公開後の検索流入・相談実績を分けて評価する。

## 起動と取り込み上の注意

career-mediaでnpm ci後、npm run demo:makecareer（3100）、npm run demo -- --port 3200（中立版）。
Node.js 20.9以上。記事はローカルMarkdownを使い、Supabase等の本番接続はしない。
Windowsのfrontend-designや共通playwright_localの配置はクラウドへ移植していない。
利用できない場合は既存のプロジェクト手順で確認し、その制約を報告する。
静的中立版の本文はexport/pagesに同梱。サーバー検索は静的HTMLだけでは動かない。

## 除外したもの

.git、.env系、node_modules、.next系、ビルドキャッシュ、ローカルDB・実行状態、旧ログ・旧画像履歴、
他プロジェクト、Agent OSの実装、静的サイトの複製、MakeCareer名義のHTML書き出し。
新しい依存関係やアプリ機能は追加していない。既存作業ツリー・index・HEAD・ブランチは変更していない。
