# AGENTS.md — はじめて転職ガイド（career-media）

Codex などのコーディングエージェント向けの作業ガイド。人向けの説明は `README.md`。

## これは何か

- 20代の「はじめての転職・未経験転職」向けオウンドメディアの MVP（Next.js 16 / React 19 / Tailwind CSS 4）。
  記事・ニュース解説・職種比較・条件整理チェックで考えを整理してもらい、必要な人を人材紹介会社の相談へつなぐ。
- **提案用・非公開。** 本番環境や公開 URL にデプロイしない（Vercel・Netlify・GitHub Pages なども含む）。
  `partner.brandUsageApproved` を `true` にしない。`SITE_INDEXABLE` を設定しない。
- 画面の既定は中立ブランド「はじめて転職ガイド」。提携候補の実在企業の社名・ロゴ・許可番号・LP の URL は
  `src/config/partner.ts`（`makecareer` プロファイル）と TODO コメントにだけ置く。画面・記事・他のファイルへ直書きしない
  （`tests/consultation.test.ts` が検出する）。LP や企業サイトの文章・画像を写さない。

## まず読むもの

| 知りたいこと | 読む場所 |
|---|---|
| 各ページに実際に表示される内容 | `export/pages/INDEX.md` から各ページの Markdown（書き出し時点のスナップショット。正本は `src/` と `content/`） |
| 読者像・言葉づかい | `docs/PERSONA.md` |
| 記事の書き方・frontmatter・図解 | `.claude/skills/career-article-writer/SKILL.md` |
| 査読の基準（機械チェック C01〜C18） | `.claude/skills/career-article-reviewer/SKILL.md`、`pipeline/src/checks.ts` |
| URL・内部リンクのルール | `.claude/skills/editorial-url-rules/SKILL.md` |

## コマンド

Node.js 20.9 以上。依存は `npm ci`。環境変数なしで動く（記事は `content/` の Markdown から読む）。

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー（http://localhost:3000） |
| `npm run build && npm run start` | 本番ビルドで確認（http://localhost:3000） |
| `npm run lint` | TypeScript の型チェック（`tsc --noEmit`） |
| `npm test` | テスト（vitest） |
| `npm run content:check` | 全記事の機械チェック。review / published にエラーがあれば失敗。日付を固定するなら `PIPELINE_TODAY=YYYY-MM-DD` |
| `npm run motifs` | `src/lib/illustrations/motifs.ts` から `src/app/motifs.css` を作り直す |
| `npm run db:verify` | ローカル Postgres で migration・seed・RLS を検証（Postgres が必要） |
| `npm run screenshots` | 起動中のサーバーの主要画面をデスクトップ・スマホで撮影し、横スクロール・はみ出し・コンソールエラーを検出（Playwright の Chromium が必要） |
| `npm run export:static` | 起動中のサーバーの全ページを `export/pages/`（Markdown、リポジトリに置く）と `export/site/`（静的 HTML、git 管理外）に書き出す。対象は既定で http://127.0.0.1:3000（`--base` で変更） |

変更したら、最後に `npm run lint`、`npm test`、`npm run content:check` を通す。画面や記事を変えたら `npm run build && npm run start` のうえで
`npm run screenshots` を通し、`npm run export:static` で `export/pages/` を書き出し直す（Chromium がない環境ではその旨を伝える）。

## ページとソースの対応

| URL | ページ | 主な部品・データ |
|---|---|---|
| `/` | `src/app/page.tsx` | `components/illustrations/*`、`Roadmap`、`EntryGrid`（入口タブ）、`ArticleCards`、`JobMap`、`ConsultationCta` |
| `/articles`、`/articles/[slug]` | `src/app/articles/` | `ArticleCards`、`ArticleParts`、`lib/markdown.ts`、`lib/figures.ts`、`content/articles/*.md` |
| `/news`、`/news/[slug]` | `src/app/news/` | `NewsTimeline`、`content/news/*.md` |
| `/categories/[slug]` | `src/app/categories/[slug]/page.tsx` | `content/categories.json` |
| `/jobs`、`/jobs/[slug]` | `src/app/jobs/` | `JobMap`、`LevelMeter`、`TaxonomyHub`、`lib/jobs.ts` |
| `/concerns`、`/situations`（と各 `[slug]`） | `src/app/concerns/`、`src/app/situations/` | `TaxonomyHub`、`lib/taxonomy.ts` |
| `/check` | `src/app/check/page.tsx` | `ConditionCheck`（クライアント）、`lib/condition-check/`（設問とルール） |
| `/consultation` | `src/app/consultation/page.tsx` | `lib/consultation.ts`（相談ボタンの URL はすべて `buildConsultationUrl`） |
| `/about`、`/editorial-policy`、`/disclosure`、`/privacy`、`/disclaimer` | 各 `page.tsx` | `InfoPage` |
| 全ページ共通 | `src/app/layout.tsx` | `Header`、`MobileNav`、`Footer`、`PreviewBanner`、`MobileStickyCta`、`src/app/globals.css` |

データは `src/lib/content/repository.ts` の `ContentRepository` 経由で読む（既定は Markdown、`CONTENT_SOURCE=supabase` で Supabase）。
どちらも status=published で、公開日・査読日・情報確認日・出典がそろった記事だけを返す。

## 守ること

- **記事の公開は人間だけ。** エージェントは記事を `status: published` にしない。`reviewed_at` を書き換えない。
  公開は `npm run pipeline -- publish <slug> --approved-by <名前>`（人間が実行）。公開済み記事の本文を変えたら `updated_at` を更新し、再査読が必要。
- 成果を保証する表現（「必ず転職できる」「年収が必ず上がる」など）を書かない（C07）。
  年収や属性で読者をラベリングしない（例: 「年収350万円以下向け」）、業界用語を使わない（C17）。
- 記事本文に生の HTML を書かない（エスケープされる）。図解は ```figure ブロックで書き、図解の数字は本文にあるものだけ（C18）。
- 内部リンクは公開済みのページにだけ張る（C05）。相談先 LP の URL・計測パラメータを記事に書かない。
- 新しい機械チェックを足すときは `pipeline/src/checks.ts`・`tests/checks.test.ts`・reviewer の SKILL.md の表を同時に更新する。
- 画面はスマホ（幅 390px）を基準に作り、横スクロールを出さない。
- 動きは `@media (prefers-reduced-motion: no-preference)` の中だけに書き、動き始めの状態でも文字が読めるようにする。
- イラストは外部素材を使わず `src/lib/illustrations/motifs.ts` に SVG で描く。`src/app/motifs.css` は手で編集せず `npm run motifs` で作る
  （テストが生成漏れを検出する）。外部の画像・フォント・CDN を読み込まない。
- 独自の CSS は `globals.css` の `@layer components` に書く（Tailwind のユーティリティで上書きできるように）。
- `.env*` を読まない・commit しない。フロントで使う Supabase のキーは anon key だけ。
