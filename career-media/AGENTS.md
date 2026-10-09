# AGENTS.md — はじめて転職ガイド（career-media）

Codex などのコーディングエージェント向けの作業ガイド。人向けの説明は `README.md`。

## これは何か

- 20代の「はじめての転職・未経験転職」向けオウンドメディアの MVP（Next.js 16 / React 19 / Tailwind CSS 4）。
  記事・ニュース解説・職種比較・条件整理チェックで考えを整理してもらい、必要な人を人材紹介会社の相談へつなぐ。
- **提案用・非公開。** 本番環境や公開 URL にデプロイしない（Vercel・Netlify・GitHub Pages なども含む）。
  `partner.brandUsageApproved` を `true` にしない。`SITE_INDEXABLE` を設定しない。
- 画面の既定は中立デモ「はじめて転職ガイド」（提案用デモ。架空の人材紹介会社が運営しているようには見せない）。
  提携候補の実在企業の社名・LP の URL は `src/config/partner.ts`（`makecareer` プロファイル＝商談用の非公開プレビュー）と
  TODO コメントにだけ置く。画面・記事・他のファイルへ直書きしない（`tests/consultation.test.ts` が検出する）。
  LP や企業サイトの文章・画像・ロゴ・実績を写さない。一次情報で確認していない許可番号は画面に出さない。
- **本番送客（実際の申込ページへのリンク）を有効にしない。** 有効になるのは `brandUsageApproved: true`・人が書いた
  `liveOutboundApproval`・`PARTNER_LIVE_OUTBOUND=on` の3つがそろったときだけ。エージェントはこのどれも書き換えない。
  相談の申込ボタンは `buildConsultationUrl()` だけで作る（無効の間はサイト内の `/consultation/apply` を指す）。
  確認: `npm run check:outbound -- --base <起動中のURL>`

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
| `npm run demo` / `npm run demo:makecareer` | 中立デモ（:3000）／商談用プレビュー（:3100）を、商談用ページ（/sales）つきでローカル起動 |
| `npm run check:outbound` | 起動中のサーバーの全ページに、本番の申込ページへのリンクがないことを確認 |
| `npm run sales:docs` | `src/lib/sales/*` と計測の定義から docs/sales/ の資料を作り直す |
| `npm run sns:images` | 投稿案のカルーセルを 1080×1350 の PNG に書き出す（SALES_DEMO のデモが必要） |
| `npm run illustrations` | 人物入りの場面イラスト（Open Peeps＋サイトの色）を `public/images/illustrations/*.svg` に作り直す（今のページでは使っていない。素材として残している） |
| `npm run image:dry-run -- --brief docs/image-briefs/<slug>.md` | 画像生成の確認（API を呼ばない・無料）。保存先と最終 prompt を表示 |
| `npm run image:generate -- --brief docs/image-briefs/<slug>.md` | OpenAI の画像生成 API で1枚作り、`public/images/generated/` と `content/images/meta/` に保存（要 `OPENAI_API_KEY`。状態は draft） |
| `npm run image:status -- <slug> selected` / `image:index` / `image:validate` / `image:prune` | 採用・一覧の作り直し・記録と画像の検査・不採用の削除 |
| `npm run export:static` | 起動中のサーバーの全ページを `export/pages/`（Markdown、リポジトリに置く）と `export/site/`（静的 HTML、git 管理外）に書き出す。対象は既定で http://127.0.0.1:3000（`--base` で変更） |

変更したら、最後に `npm run lint`、`npm test`、`npm run content:check` を通す。画面や記事を変えたら `npm run build && npm run start` のうえで
`npm run screenshots` を通し、`npm run export:static` で `export/pages/` を書き出し直す（Chromium がない環境ではその旨を伝える）。

## ページとソースの対応

| URL | ページ | 主な部品・データ |
|---|---|---|
| `/` | `src/app/page.tsx` | `components/illustrations/*`、`Roadmap`、`EntryGrid`（入口タブ）、`ArticleCards`、職種の比較表（`LevelMeter`）、`ConsultationCta` |
| `/articles`、`/articles/[slug]` | `src/app/articles/` | `ArticleCards`、`ArticleParts`、`lib/markdown.ts`、`lib/figures.ts`、`content/articles/*.md` |
| `/news`、`/news/[slug]` | `src/app/news/` | `NewsTimeline`、`content/news/*.md` |
| `/categories/[slug]` | `src/app/categories/[slug]/page.tsx` | `content/categories.json` |
| `/jobs`、`/jobs/[slug]` | `src/app/jobs/` | `JobMap`、`LevelMeter`、`TaxonomyHub`、`lib/jobs.ts` |
| `/concerns`、`/situations`（と各 `[slug]`） | `src/app/concerns/`、`src/app/situations/` | `TaxonomyHub`、`lib/taxonomy.ts` |
| `/check` | `src/app/check/page.tsx` | `ConditionCheck`（クライアント）、`lib/condition-check/`（設問とルール） |
| `/consultation` | `src/app/consultation/page.tsx` | `lib/consultation.ts`（相談ボタンの URL はすべて `buildConsultationUrl`） |
| `/about`、`/editorial-policy`、`/disclosure`、`/privacy`、`/disclaimer` | 各 `page.tsx` | `InfoPage` |
| 全ページ共通 | `src/app/layout.tsx` | `Header`、`MobileNav`、`Footer`、`PreviewBanner`、`MobileStickyCta`、`NavTracker`、`src/app/globals.css` |
| パンくずと「戻る」 | `src/components/Breadcrumbs.tsx` | `BackButton`（サイト内で移動してきたときは履歴で戻る。直接開いたときはひとつ上の階層へ）。アーティファクト版は `scripts/artifact/runtime.js` がページ内の履歴で処理する |

| `/consultation/apply` | `src/app/consultation/apply/page.tsx` | 本番送客が無効な間の、相談の申込ボタンの行き先（noindex） |
| `/sales/*`（SALES_DEMO=1 のときだけ） | `src/app/sales/` | 商談用ページ（Instagram 投稿案・提案・計測）。データは `src/lib/sales/` |

現在の掲載数: 記事70本（未公開の下書き2本は別）（うち「制度・手続き」カテゴリ `seido` に失業手当・健康保険・年金・住民税・年末調整・試用期間・有休など。面接・書類の実践記事、営業事務・経理・コールセンター・介護などの職種記事も）、ニュース解説7本。
査読の記録は `content/reviews/<slug>.json`（`npm run pipeline -- review <slug>` が書く）。入口タイルのアイコンには、その入口の記事数をバッジで出している（`EntryGrid` の `counts`）。

読者導線（3つのガイド）は `src/lib/journeys.ts`（入口ページの「順番に読むなら」と、記事の「ガイドの現在地」に出る）。
計測イベントは `src/lib/measurement/`（ブラウザ内に記録するだけで送信しない）。

データは `src/lib/content/repository.ts` の `ContentRepository` 経由で読む（既定は Markdown、`CONTENT_SOURCE=supabase` で Supabase）。
どちらも status=published で、公開日・査読日・情報確認日・出典がそろった記事だけを返す。

## 画像（生成画像）

- 方針は `docs/ART_DIRECTION.md`、手順は `docs/image-briefs/README.md`。まず画像なしで成り立たせ、必要な場所だけに使う。文字は画像に入れない
- 画像は `src/components/GeneratedImage.tsx` で出す（`content/images/index.json` で status が selected のものだけ。なければ fallback の SVG）。今の差し込み口: トップのヒーロー `hero-home`（なければ人物のイラスト `public/images/illustrations/hero-people.svg`。デスクトップでは小さなカードを重ねる）、トップのチェック `check-support`（なければ結果の見本、デスクトップのみ）、`/sales/sns/*` の表紙 `sns-theme-*-cover`。`journey-*` の brief はあるが、今のケースカードには差し込み口がない
- 生成した画像は draft のまま。実際のページで確認してから `image:status` で selected にする。気に入らなければ brief を直して `--force` で作り直す（前の画像は `.image-history/`）
- API キー（`OPENAI_API_KEY`）は `.env.local` か環境変数にだけ置く。ロゴ・実在の企業やキャラクターは生成しない（`BLOCKED_TERMS`）

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
- 記事の日付（published_at・updated_at・reviewed_at・information_checked_at）を、実際より前にさかのぼらせない。今日に変えて新しく見せることもしない。
- 体験談・取材・監修・相談の実績・アクセス数・ランキング・口コミを作らない。架空の給与例は「仮の例」と書く。
- 計測イベントに、氏名・連絡先・自由記述・検索語・条件整理チェックの回答を入れない。登録・面談などの成果イベントをフロントで発火しない。
  本番の解析ツール（GA4・GTM・各種ピクセル）を入れない。
- 商談用ページ（/sales）は読者向けのメディアと分ける。sitemap・ナビに載せない。
