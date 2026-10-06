# hojokin-agent-distribution.zip の調査結果と扱い

## 調査結果（実ファイルで確認）

ZIP は 19 ファイル・約 200KB。**Web フロントエンド（Next.js / React）は含まれていない**。
中身は「Claude Code のサブエージェント3体（編集長・ライター・レビュアー）で補助金記事を調査・執筆・査読し、
Supabase に保存して Discord に通知する」自動運用バックエンドの雛形。README 自身も
「記事の表示 (Next.js + DialogueBubble + remark ディレクティブ) は同梱していません」と明記している。

| 区分 | ファイル |
|---|---|
| Agent 定義 | `.claude/agents/subsidy-{orchestrator,writer,reviewer}.md` |
| Skill | `.claude/skills/{agent-bootstrap,editorial-url-rules,subsidy-pipeline-orchestrator,subsidy-article-writer,subsidy-article-reviewer}/SKILL.md` |
| Scripts | `scripts/{run-agent,start-reflection,supabase-query,sync-data}.sh`、`.claude/scripts/notify-discord.sh` |
| 定期実行 | `.claude/launchd/com.example.subsidy-pipeline.plist`、`cron-example.txt` |
| DB | `supabase/schema.sql`（subsidies / subsidy_prefectures / prefectures / sync_logs + RLS）、`seed.sql`（補助金3件） |
| 設定 | `.env.local.sample`（Supabase URL + **service_role key**、Gemini、Jina、Discord、PUBLIC_SITE_URL） |

確認した問題点:

- `run-agent.sh` が `claude -p ... --dangerously-skip-permissions` で全権限実行
- `.env.local` を丸ごと `source` してから agent を起動するため、service role key が LLM の環境に入る
- `supabase-query.sh` は SELECT を含む全操作を service role key（RLS バイパス）で実行
- `.gitignore` が同梱されていない（README の注意書きのみ）
- RLS が `FOR SELECT USING (true)` で、`research_notes` を含む全列・全行が anon に公開
- 公開判定が `article_md IS NULL`（＝本文があれば公開）で、査読状態がデータに残らない
- `sync-data.sh` は雛形のみ（jGrants 前提）、`application_end` による自動 closed 化が補助金固有

## 各ファイルの扱い

| ZIP のファイル | 扱い | 移行先 |
|---|---|---|
| `agents/subsidy-orchestrator.md` | 作り直して流用（人格・Mission・ハードルール・振り返り項目の構造を継承） | `.claude/agents/career-orchestrator.md` |
| `agents/subsidy-writer.md` | 作り直して流用。対話形式・10,000字・画像2枚は廃止、status は review まで | `.claude/agents/career-writer.md` |
| `agents/subsidy-reviewer.md` | 作り直して流用。「だいたいOKで通さない」「修正 vs 差し戻し」の原則を継承 | `.claude/agents/career-reviewer.md` |
| `skills/subsidy-pipeline-orchestrator` | 作り直して流用。リトライ最大3回・完了通知1回を継承、データ同期と自律公開を削除 | `.claude/skills/career-pipeline-orchestrator` |
| `skills/subsidy-article-writer` | 作り直して流用。research_notes の逐次記録・時制ルール・AI臭フレーズ禁止を継承 | `.claude/skills/career-article-writer` |
| `skills/subsidy-article-reviewer` | 作り直して流用。22項目 + `check_article`(E01〜E16) を C01〜C15 の TypeScript 実装に置換 | `.claude/skills/career-article-reviewer`、`pipeline/src/checks.ts` |
| `skills/editorial-url-rules` | 作り直して流用（`/subsidy/{id}` → `/articles/{slug}` 等） | `.claude/skills/editorial-url-rules` |
| `skills/agent-bootstrap` + `scripts/start-reflection.sh` | 考え方を流用（実行ごとのログ・親子関係）。SQLite reflections は JSONL / `pipeline_runs` に統合 | `pipeline/src/cli.ts`、`pipeline_runs` テーブル |
| `scripts/run-agent.sh` | 安全化して流用（タイムアウト監視は継承） | `pipeline/scripts/run-agent.sh` |
| `.claude/scripts/notify-discord.sh` | 流用（agent 名を career-* に、メンション無効化・文字数上限を追加） | `pipeline/scripts/notify-discord.sh` |
| `launchd/*.plist`, `cron-example.txt` | 流用（毎時 → 1日1回、URL チェックの週次ジョブを追加） | `pipeline/schedule/` |
| `scripts/supabase-query.sh` | 不採用。フロントは anon key の supabase-js、DB 投入は生成した seed.sql で行う | — |
| `scripts/sync-data.sh` | 不採用（jGrants 同期・公募期間の closed 化は補助金固有） | — |
| `supabase/schema.sql` | 不採用（subsidies 系）。RLS を有効にする方針と `set_updated_at` の考え方のみ継承 | `supabase/migrations/0001_career_media.sql` |
| `supabase/seed.sql` | 不採用（補助金サンプル） | `content/` から `seed.sql` を生成 |
| `.env.local.sample` | 置き換え（service role key はフロントの設定から分離） | `.env.example` |

## canonical な実行経路から外した補助金固有の前提

subsidies / subsidy_prefectures / prefectures / jgrants_id / 補助額・補助率 / 公募期間と closed スケジューラ /
`/subsidy/{id}` / 公式 URL を .go.jp 等に限る要件 / 佐藤・室谷の対話形式 / 22項目 QA / 10,000文字以上 /
`<mark>` 10回以上 / 「！」10回以上・「(笑」3回以上 / テーブル3つ以上 / 図解画像2枚必須（Gemini） /
競合の1.5〜2倍の情報量 / 毎回の4層 reflection 書き込みの義務化（実行ログは pipeline_runs / JSONL に簡素化）。

これらは ZIP 内にのみ残り、このリポジトリには取り込んでいない（historical として ZIP を参照）。
