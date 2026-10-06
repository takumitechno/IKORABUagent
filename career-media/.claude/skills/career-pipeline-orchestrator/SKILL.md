---
name: career-pipeline-orchestrator
description: 未経験転職メディアの記事パイプラインの進め方。Writer → Reviewer のリトライループ（最大3回）、実行ログ、完了通知。career-orchestrator 専用。
user-invocable: false
---

# パイプライン手順（編集長）

ZIP の `subsidy-pipeline-orchestrator` から、補助金データ同期（jGrants・公募期間の自動 closed 化）を外し、
「generate（draft/review）と publish（人間）の分離」を加えたもの。

```
1. 対象選定: content/ の status: draft、または content brief（将来は DB の content_briefs）
2. 各記事について:
   a. career-writer に執筆を依頼（status: review まで）
   b. career-reviewer に査読を依頼
   c. changes_requested なら指摘を添えて Writer に差し戻し（最大3回）
3. 完了通知を1回だけ送る:
   bash pipeline/scripts/notify-discord.sh --agent career-orchestrator "<サマリー>"
   - approved: 公開候補（人間の承認待ち）として Full URL 付きで列挙
   - 3回 NG: 理由を添えて「要人間確認」
4. publish はしない
```

## 実行ログ

各コマンドは `.runtime/logs/pipeline-runs.jsonl` に1行ずつ記録される（DB の `pipeline_runs` と同じ項目）。
ZIP の SQLite reflections（what_done / quality_check / self_improvement）はここに統合した。

## 将来の接続（IKORABU）

Research → Benchmark/TTP → Planning → Writer → QA → Publish → Metrics → Learning のうち、
このパイプラインは Writer / QA の位置にある。入力は content brief（`content_briefs`）、
出力は記事と査読記録（`article_versions` / `article_reviews`）、計測は `article_metrics_daily`。
