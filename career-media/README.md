# 未経験転職ノート by MakeCareer — オウンドメディア MVP

> **提案用・非公開。** 正式な提携・ブランド利用許諾の前に、本番環境で公開しないでください。
> `partner.brandUsageApproved` が `false` の間は、`robots.txt` が全ページのクロールを拒否し、全ページに `noindex` が付き、画面上部に「提案用プレビュー」バーが表示されます。

未経験転職を考える20代が、仕事と経験と希望条件を整理し、必要なら人材紹介会社（MakeCareer）へ相談できる情報メディアの MVP です。

```
SNS / SEO 流入 → 記事・ニュース解説 → 職種比較・条件整理チェック → 相談意欲 → 相談 LP（partner config）
```

## ローカル起動（自分の PC で見る）

前提: [Node.js](https://nodejs.org/) 20.9 以上（LTS 推奨）と Git。

```powershell
# Windows（PowerShell）: 依存インストール → 本番ビルド → 起動 → ブラウザを開く
git clone https://github.com/takumitechno/IKORABUagent.git
cd IKORABUagent
git checkout claude/beautiful-babbage-ic8u8e
cd career-media
powershell -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```

```bash
# macOS / Linux
cd career-media && bash scripts/start-local.sh
```

`http://localhost:3000` が開きます（停止は Ctrl+C）。2回目以降は `-SkipBuild`（Windows）/ `SKIP_BUILD=1`（macOS）で速く起動できます。
サーバーは `127.0.0.1` にだけ bind するので、同じネットワークの他の端末やインターネットからは見えません。

手動で起動する場合: `npm ci && npm run build && npm run start`（開発時は `npm run dev`）。

セットアップ不要で動きます（記事は `content/*.md` から読み込みます）。Supabase から読む場合は、`.env.example` を `.env.local` にコピーし、`CONTENT_SOURCE=supabase` と URL / anon key を設定します。

| コマンド | 内容 |
|---|---|
| `npm test` | ユニット・結合テスト（条件整理ロジック、査読チェック、公開ゲート、SEO、相談導線、コンテンツの整合性） |
| `npm run lint` | TypeScript 型チェック |
| `npm run content:check` | 全記事の機械チェック（C01〜C15）。review / published にエラーがあれば失敗 |
| `npm run db:seed-sql` | `content/` から `supabase/seed.sql` を生成 |
| `npm run db:verify` | 使い捨てのローカル Postgres に migration + seed を流し、RLS・列権限・公開ガード・検索を検証 |
| `npm run screenshots` | 起動中のサーバーの主要画面をデスクトップ・スマホで撮影し、コンソールエラーと横スクロールを検出 |

## デモ版（架空表記）のアーティファクト

実在企業の名義のページは claude.ai のアーティファクトとして公開できないため、社名・許可番号・相談先を
架空のサンプルに置き換えた `PARTNER_PROFILE=demo` で画面を取り込み、1枚の HTML にしたものを共有用に使う。

```bash
PARTNER_PROFILE=demo NEXT_DIST_DIR=.next-demo npx next build
PARTNER_PROFILE=demo NEXT_DIST_DIR=.next-demo npx next start -p 3200 -H 127.0.0.1 &
PARTNER_PROFILE=demo npx tsx scripts/artifact/build-artifact.ts --base http://127.0.0.1:3200 --out <出力先>.html
```

画面遷移・検索・スマホメニューは `scripts/artifact/runtime.js`、条件整理チェックは本番と同じ React コンポーネントを
esbuild でバンドルして動かす。相談ボタンは押すと「デモのため移動しない」旨と設置場所（utm_content）を表示する。
スクリプトは demo 以外のプロファイルや実在企業の表記を含むページでは失敗する。

## 画面とルート

| URL | 内容 |
|---|---|
| `/` | トップ（ヒーロー、使い方、信頼表示、カテゴリ、おすすめ・新着、ニュース、職種比較、条件整理チェック、相談 CTA） |
| `/articles` | 記事一覧・検索（`?q=`、タイトル > 要約 > 本文の重み付き AND 検索） |
| `/articles/[slug]` | 記事詳細（目次、要約、更新日・情報確認日、本文中 CTA、FAQ、出典、確認情報、関連記事、スマホ追従 CTA） |
| `/categories/[slug]` | カテゴリ別一覧（7カテゴリ） |
| `/news`, `/news/[slug]` | 転職ニュース解説ハブ（何が発表されたか／誰に関係するか／何が変わるか／分からないこと／確認すること） |
| `/jobs` | 職種比較（法人営業・カスタマーサポート・ITサポート・一般/営業事務） |
| `/check` | 未経験転職 条件整理チェック（13問・ルールベース・回答は送信しない） |
| `/consultation` | キャリア相談について（メディアと相談の役割分担、流れ、FAQ） |
| `/about`, `/editorial-policy`, `/disclosure` | 運営者情報・編集方針・広告/提携表記 |
| `/privacy`, `/disclaimer` | プレースホルダー（`正式公開前にMakeCareer確認が必要`、noindex） |
| `/robots.txt`, `/sitemap.xml` | 公開済み記事だけを含む sitemap、未承認の間は全 Disallow |

## アーキテクチャ

```
career-media/
├── src/
│   ├── config/partner.ts      相談先・社名・許可番号・LP URL・計測ID（唯一の正本）
│   ├── config/site.ts         メディア名・URL・index 可否
│   ├── lib/content/           ContentRepository（local: content/*.md / supabase: anon key + RLS）
│   ├── lib/condition-check/   条件整理チェックの設問とルールエンジン（純粋関数）
│   ├── lib/jobs.ts            職種比較データ
│   ├── lib/seo.ts             metadata / canonical / OGP / JSON-LD
│   ├── lib/markdown.ts        Markdown → HTML（生 HTML はエスケープ、目次、中間 CTA 位置）
│   └── app/                   Next.js App Router の各ページ
├── content/                   記事・ニュース（frontmatter + Markdown）、カテゴリ、査読記録
├── supabase/                  migration（schema + RLS + 公開ガード）と生成 seed
├── pipeline/                  記事パイプライン（ZIP の Writer / Reviewer / 通知 / 定期実行を移植）
└── .claude/                   career-orchestrator / career-writer / career-reviewer と skills
```

- **フロント**: Next.js 16（App Router）+ TypeScript + Tailwind CSS 4。記事ページは SSG + ISR（10分）。フォントは Noto Sans JP をビルド時に自己ホスト。
- **データ**: フロントは `ContentRepository` interface だけに依存。既定は `content/` の Markdown（セットアップ不要）、`CONTENT_SOURCE=supabase` で Supabase（anon key のみ）。どちらも **status=published かつ公開日・査読日・情報確認日・出典がそろったもの** だけを返す。
- **相談導線**: CTA の遷移先はすべて `buildConsultationUrl(placement, slug)` で生成し、`partner.consultationUrl` に `utm_*` を付与。LP や計測 URL の差し替えは `partner.ts`（または `PARTNER_CONSULTATION_URL` / `PARTNER_CAMPAIGN_ID`）だけで済む。社名・LP・許可番号が `src/` の他所に直書きされていないことをテストで検証している。

## DB（Supabase / Postgres）

`supabase/migrations/0001_career_media.sql`

| テーブル | 用途 |
|---|---|
| `articles` | 記事・ニュース。`status` は `draft / review / published / archived`。published には公開日・査読日・情報確認日が必須（CHECK 制約） |
| `categories` / `article_categories` | カテゴリ（主カテゴリ1つ） |
| `article_sources` | 出典 URL・発行元・確認日・用途・URL チェック結果 |
| `article_versions` / `article_reviews` | 版と査読判定。**最新版に approved の査読がないと published にできない**（trigger） |
| `content_briefs` | 企画（将来の Research → Benchmark/TTP → Planning の出力先） |
| `article_metrics_daily` | 計測（将来の Metrics → Learning 用） |
| `condition_check_events` | 条件整理チェックの匿名集計（anon は INSERT のみ。MVP ではまだ送信していない） |
| `pipeline_runs` | 実行ログ（ZIP の reflections を移したもの） |

RLS / 権限: anon は published 記事の **公開列だけ** を SELECT 可（`research_notes` は列権限で不可）。査読記録・実行ログ・計測は anon から読めない。検索は `search_articles(q)`（security invoker、ILIKE + pg_trgm、日本語対応）。`npm run db:verify` で上記を実 DB で検証できる。

## 記事パイプライン（generate と publish の分離）

```
career-orchestrator ─▶ career-writer（draft → review）─▶ career-reviewer（check + review 記録）
                                                                │ approved
                                                                ▼
                                         人間: npm run pipeline -- publish <slug> --approved-by <name>
```

- `npm run pipeline -- check [--slug x] [--check-urls]` — 機械チェック（C01〜C15、`.claude/skills/career-article-reviewer` に一覧）
- `npm run pipeline -- review <slug>` — 判定を本文ハッシュつきで `content/reviews/<slug>.json` に記録
- `npm run pipeline -- publish <slug> --approved-by <name>` — status=review・エラー0・現在の本文に対する approved・承認者名がそろったときだけ公開。査読後に本文が変わったら再査読が必要
- 実行ログ: `.runtime/logs/pipeline-runs.jsonl`
- 定期実行: `pipeline/scripts/run-agent.sh career-orchestrator`（例: `pipeline/schedule/`）。登録は OS 側で行う

## セキュリティ（ZIP からの是正）

| ZIP の問題 | 対応 |
|---|---|
| `claude -p ... --dangerously-skip-permissions` | 廃止。`--allowedTools` で許可ツールを列挙し、publish・git push・環境変数表示・`.env` 読み取り・`src/` 編集を `--disallowedTools` で禁止 |
| `.env.local` を丸ごと source し、service role key が agent に渡る | agent には `JINA_API_KEY` / `DISCORD_WEBHOOK_URL` だけを渡す（`env -i`）。フロントは anon key のみ |
| `.gitignore` がない | `career-media/.gitignore` とリポジトリ直下で `.env` / `.env.*` を除外 |
| 「本文がある＝公開」（`article_md IS NULL` で判定） | `status` で明示。CHECK 制約 + 公開ガード trigger + アプリ側の二重判定 |
| Writer / Reviewer が直接公開状態を作れる | 公開は人間の `publish` コマンドのみ。査読後の本文変更は再査読 |
| RLS が `USING (true)` で全行公開 | published のみ・公開列のみ。内部テーブルは anon 不可 |
| 記事 Markdown の生 HTML | 表示時にエスケープ。`javascript:` リンクは無効化。JSON-LD は `<` をエスケープ |

## 既知の制約

- MakeCareer の LP・企業サイトはこの作業環境のネットワークから閲覧できなかったため、ブランド色・ロゴは仮（`globals.css` のトークンと `BrandMark` を差し替え可能にしてある）。LP の文言・画像は使用していない。
- サンプル記事・ニュース解説は提案用に作成したもので、MakeCareer の査読は受けていない。表示上の「確認・編集: MakeCareer 編集部」は公開前に実際の確認体制に合わせる必要がある。
- 出典 URL は検索で存在を確認したが、作業環境からは mhlw.go.jp 等に直接アクセスできず、`--check-urls` による到達性チェックは未実行。
- Supabase 読み込み（`CONTENT_SOURCE=supabase`）は schema・seed・RLS をローカル Postgres で検証済み。実際の Supabase プロジェクト（PostgREST 経由）での表示確認は未実施。
- 運営者情報（所在地・代表者・問い合わせ先）、プライバシーポリシー、免責事項、相談の無料表記・相談フローは `正式公開前にMakeCareer確認が必要`（`partner.ts` の TODO）。
- アクセス解析・CTA クリック計測は未導入（utm パラメータのみ）。
