# 画像の brief と生成の手順

OpenAI の画像生成 API（Images API）で、サイトに使う画像を作るときの手順。方針は [../ART_DIRECTION.md](../ART_DIRECTION.md)。

## 0. 準備（最初の1回）

1. OpenAI の API キーを用意し、`career-media/.env.local` に書く（このファイルは git に入らない）
   ```bash
   OPENAI_API_KEY=sk-...        # チャット・ソースコード・commit には絶対に書かない
   # OPENAI_IMAGE_MODEL=gpt-image-2   # 既定値。変えるときだけ
   ```
   環境変数で渡してもよい。クラウド環境では、環境の設定で `OPENAI_API_KEY` を設定し、ネットワークで `api.openai.com` を許可する
2. 費用がかかる。1回1枚、品質は既定 `medium`。試行錯誤は brief を直してから

## 1. brief を書く

`_TEMPLATE.md` をコピーして `docs/image-briefs/<slug>.md` を作る。

- frontmatter: `slug`・`type`・`alt`（または `decorative: true`）・`used_in`。必要なら `size`・`quality`・`format`・`background`
- 本文: 目的・使用場所・想定読者・避けたい表現・色味・構図・画像内テキスト・参考にするトーン（人が読むため）
- `## Prompt` 節: API に送る英語の prompt。主題・構図・要素を具体的に。スタイル（色・禁止事項）は自動で後ろに付く（`scripts/images/lib.ts` の `HOUSE_STYLE`）

| type | 置き場 | 既定サイズ |
| --- | --- | --- |
| `hero` | `public/images/generated/hero/` | 1536x1024 |
| `section` | `public/images/generated/sections/` | 1024x1024 |
| `article` | `public/images/generated/articles/` | 1536x1024 |
| `diagram` | `public/images/generated/diagrams/` | 1024x1024 |
| `sns-carousel` | `public/images/generated/sns/` | 1024x1536 |
| `sales` | `public/images/generated/sales/` | 1536x1024 |

## 2. 送る内容を確認する（無料）

```bash
npm run image:dry-run -- --brief docs/image-briefs/hero-home.md
```

API は呼ばない。保存先・モデル・サイズ・最終的な prompt を表示する。

## 3. 生成する

```bash
npm run image:generate -- --brief docs/image-briefs/hero-home.md
```

- 画像: `public/images/generated/hero/hero-home.webp`
- 記録: `content/images/meta/hero-home.json`（prompt・モデル・サイズ・生成日時・縦横・sha256・brief の場所・状態）
- 一覧: `content/images/index.json`（サイトはここを読む）
- 状態は `draft`。**この時点ではサイトに出ない**
- 失敗したとき（キー未設定・401・429・400・接続できない）は、原因を表示して何も保存しない

brief なしで1枚だけ作ることもできる:
```bash
npm run image:generate -- --slug section-xyz --type section --alt "..." --used-in "/check" --prompt "..."
```

## 4. 確かめて採用する

1. 画像を開いて [ART_DIRECTION.md](../ART_DIRECTION.md) の「採用の判断」を確認する
2. いったん採用にして、ページで見る
   ```bash
   npm run image:status -- hero-home selected
   npm run build && npm run start   # スマホ幅とデスクトップで確認。npm run screenshots でも可
   ```
3. 合わなければ `npm run image:status -- hero-home rejected`（ページは元のイラストに戻る）

## 5. 作り直すとき

1. どこがダメかを brief の「メモ」に書く（例: 「人物が目立ちすぎ」「青が強い」「要素が多い」）
2. `## Prompt` を直す。よく効く直し方:
   - 要素を減らす（「only three objects」）、余白を指定する（「large empty space on the left」）
   - 色を名前で指定し直す（「mostly mint and off-white, teal only for small accents」）
   - 人物をやめて物・抽象図形にする
3. 作り直す（前の画像は `.image-history/` に残り、記録の `regenerated_from` に前の prompt が残る）
   ```bash
   npm run image:generate -- --brief docs/image-briefs/hero-home.md --force
   ```

## 6. 片付け

```bash
npm run image:validate   # 記録と画像の食い違い・記録のない画像・index のずれを検査
npm run image:prune      # rejected の画像と記録を削除
npm run image:index      # content/images/index.json を作り直す
```

## サイトへの組み込み

```tsx
import { GeneratedImage } from "@/components/GeneratedImage";

<GeneratedImage slug="hero-home" sizes="(min-width: 768px) 560px, 270px" className="..." fallback={<Illustration name="hero-people" priority className="h-auto w-full" />} />
```

採用済み（`selected`）の画像がなければ `fallback` を出す。縦横・alt は記録から入る。

## brief の一覧

| slug | type | 使う場所 | 状態 |
| --- | --- | --- | --- |
| [hero-home](hero-home.md) | hero | トップのヒーロー（`src/app/page.tsx`） | 未生成 |
| [check-support](check-support.md) | section | トップの「条件整理チェック」（`src/app/page.tsx`） | 未生成 |
| [sns-theme-a-cover](sns-theme-a-cover.md) | sns-carousel | `/sales/sns/a` の表紙用ビジュアル | 未生成 |
| [journey-sekkyaku-office](journey-sekkyaku-office.md) | section | （今は差し込み口なし。ケースカードは色帯のデザインに変更） | 未生成 |
| [journey-kyuryo-donichi](journey-kyuryo-donichi.md) | section | （同上） | 未生成 |
| [journey-freeter-hajimete](journey-freeter-hajimete.md) | section | （同上） | 未生成 |

まとめて作るとき（差し込み口のある3枚・品質 medium）:
```bash
for b in hero-home check-support sns-theme-a-cover; do
  npm run image:generate -- --brief docs/image-briefs/$b.md || break
done
```

状態の正本は `content/images/meta/*.json`（`npm run image:index` で一覧を表示）。
