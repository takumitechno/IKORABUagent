# SEO・記事・相談導線の改善と引継ぎ（2026-10-12）

**状態は変えていない**: LOCAL／NON-PUBLIC／提案用／正式提携前。noindex・robots.txt の `Disallow: /`・本番送客OFFのまま。`brandUsageApproved`・`liveOutboundApproval`・公開と送客の承認条件、記事の `status`・`reviewed_at`・`information_checked_at` も変更していない。noindex を外して点数を上げてはいない。FAQ のリッチリザルト（2026年5月に終了）は改善として数えていない。

この文書は、検索と SNS から来た読者が、知りたいことの答えを読み、自分の条件を整理し、必要なら相談に進めるようにする改善の記録。人が判断する事項と、Codex が独立レビューするときの手順もまとめる。

- 全原稿の棚卸し（機械的な指標）: [seo/article-inventory.csv](seo/article-inventory.csv)。`npx tsx scripts/seo-inventory.ts` で再生成できる
- 全原稿の判定・検索意図・担当・次の行動: [seo/article-classification.csv](seo/article-classification.csv)
- 検証ログと比較画像: [seo/evidence-2026-10-12/](seo/evidence-2026-10-12/README.md)

---

## 1. ブランチ・SHA・変更範囲

| 項目 | 内容 |
| --- | --- |
| 作業ブランチ | `claude/pensive-galileo-04hrcb`（push のみ。PR は作っていない） |
| 取り込み元 | `handoff/makecareer-zip` @ `026cb988aaab1737c23cf1ad86f16a47d818442d` の `handoff/makecareer-handoff.zip`（SHA256 `e0204b23…bc9f46` を確認）。土台は `codex/makecareer-meeting-corrections` の `d5260a3` |
| 取り込みの扱い | 共有ブランチはマージしていない。ZIP の中身を `273bd39` として取り込んだ（manifest 683件と asset-lock 48件を SHA256 で照合。テキストの改行だけ CRLF→LF） |
| 改善のコミット | `1bad2b8`（修正A・B、テスト、監査スクリプト）→ `9592ddd`（主力15記事・正確さ）→ `ec48bc0`（トップの並び順・中立版の書き出し）→ この文書と同じコミット（追加の内部リンク・重複の整理・棚卸し・証跡） |
| 変えたファイル | 記事38本（`content/articles`）と査読記録38件（`content/reviews`。機械チェックの追記のみ）、`src` 7ファイル、`tests` 4ファイル、`scripts` 3ファイル、`docs/sales/sns/THEME_C.md`（再生成）、`export/pages`（中立版の書き出し） |
| 変えていないもの | 画像・人物写真・アイキャッチ（`public/`・`content/images/` の変更0件）、CSS（変更0件）、配色・フォント・余白・カード・ボタン・レイアウト・アニメーション、`src/config/partner.ts`、承認の記録、`supabase/seed.sql`（後述） |

コードの変更は次のとおり（見た目のクラスやスタイルは変えていない）。

- `src/components/MobileStickyCta.tsx`: スマホ固定ボタンの行き先に、記事末尾と同じ共通関数 `withConsultationTopic()` で相談テーマを付ける
- `src/app/articles/[slug]/page.tsx`: 記事ガイドがない記事は、読者ガイド（3つの導線）の相談テーマを使う。見出しの文言は変えない
- `src/lib/journeys.ts`: 3つの導線に相談テーマ（experience／conditions／first-job）を持たせた
- `src/lib/article-guides.ts`: ガイドを3本追加（`pc-nigate-jimu`・`donichi-yasumi-shigoto`・`nenshu-300man-tenshoku`）。短いH1を2本修正、次の記事を2本修正
- `src/lib/content-discovery.ts`・`src/app/page.tsx`: トップの「新着・更新記事」で、同じ更新日の記事のうち3つの導線の記事を先に出す
- `src/lib/sales/sns.ts`: SNS テーマCの文言（後述の修正A）

---

## 2. 全記事の棚卸しと、主力15記事

原稿は112本（記事105・ニュース7）。公開状態は published 110、非公開2（`kyujin-hyo-yomikata` は draft、`dainishinsotsu-tenshoku-timing` は review）。非公開の2本は、どの公開ページからもリンクしていない。

| 判定 | 本数（完了後） | 意味 |
| --- | --- | --- |
| strong | 81 | 読者の疑問に答え、根拠と次の行動がある |
| needs_polish | 22 | 役割は正しいが、つなぎ・根拠・材料に直す点がある |
| overlap | 6 | 隣の記事と読者・回答の大部分が重なる（統合か役割の絞り込みは承認事項） |
| hide_merge_candidate | 2 | 非公開のまま統合か作り直しを判断する |
| thin | 1 | 材料が足りない（`ai-shigoto-mikeiken`） |

判定した者は次のとおり（CSV の「判定した者」列）。

- クラスターA（職種・事務）25本とB（給料・休日・条件）20本: 別のエージェントが、本文の読解とメトリクスにもとづいて**着手前に**判定した。判定と理由は `evidence-2026-10-12/classification-agent-*.json`。完了後の判定は Claude が今回の差分を見て付けた。着手前は strong 27・needs_polish 15・overlap 1・hide_merge 1・thin 1
- クラスターC（はじめての転職・フリーター・相談）・D（書類・面接）・E（制度・お金・ニュース）67本: Claude が見出し構成・メトリクス・一部の本文を読んで判定した。**別の検証者による確認はしていない**。Codex のレビューで優先して見てほしい

### 主力15記事（3つの読者導線の本線と脇道）

| 導線 | 記事 | 導線での役割 | 今回足したもの |
| --- | --- | --- | --- |
| A 接客→オフィス | `sekkyaku-keiken-ikasu` | 経験を作業に分ける | 職種記事5本へのリンク、相談で聞く3つの質問 |
| A | `sekkyaku-office` | 働き方の変化を知る | 接点表から職種記事へ、休日欄の記事へ、条件と経験で分けた相談の入口、締めの次の一歩。同じ5項目の二重表示を削除 |
| A | `jimu-mikeiken-mae` | 事務の種類と応募前の確認 | 種類→未経験→PC→電話→応募前の順に並べ替え、PCの節を統合、子記事4本へ、/check と相談の橋 |
| A（脇道） | `pc-nigate-jimu` | PCの不安を練習の順番に変える | ガイド追加、練習記録の記入例（仮の例）、資格・訓練・給付の記事へ、相談の橋 |
| B 給料＋土日 | `tedori-20man-hikaku` | 額面と手取りをそろえる | アルバイトから移るときの社会保険の注記とリンク |
| B | `nenshu-300man-tenshoku` | 今の年収を内訳に分ける | ガイド追加、3欄の記入表、固定残業代・賞与・試用期間・希望年収の記事へ、相談の橋 |
| B | `donichi-yasumi-nenshu-hikaku` | 休日と年収を同じ物差しで比べる | 年間休日→年間労働時間→1時間あたりの表（仮の例）、面接・相談で聞く3つの質問、SNS とそろえた例 |
| B（脇道） | `donichi-yasumi-shigoto` | 土日休みになりやすい仕事と休日欄 | ガイド追加、職種記事5本へ、「土日休みを最優先にするときの書き方」の記入表 |
| B | `nenshu-dake-erabanai` | ゆずれない順番を決める | 優先順位4欄の記入例（仮の例）、/check と相談の橋、固定残業代の説明を担当記事へ寄せた |
| B（補足先） | `koteizangyo-kyujin` | 固定残業代の担当 | 仮の求人X/Yの比較表（基本給と賞与の差）、労働相談・/check・相談へのリンク |
| C フリーター | `freeter-seishain-hajimeni` | 最初に確かめること | 一般化の表を「求人票で確かめる欄」に置き換え、状況別の最初の一歩、トライアル雇用・わかものハローワーク |
| C | `shokumu-keirekisho-arubaito` | アルバイト経験の書き方 | 掛け持ち・短期・空白期間の書き分け |
| C | `mikeiken-tenshoku-hajimekata` | 最初に整理する5項目（SNSテーマAの着地） | 1枚の記入例（架空）、「まだ決めなくていいこと」、メモが途中でも相談できるという橋 |
| C | `26sai-mikeiken` | 年齢の不安を準備に置き換える | ゆずれない条件の数をサイト全体（1〜2個）に合わせた |
| C | `agent-mendan-mae` | はじめての相談の準備 | H1を検索語（エージェント面談）に合わせた、空白期間の記事へ |

主力15本の合計: 表 31→40、本文 約3.9万字→約4.6万字（文字数そのものは評価に使っていない）。本文から /check か相談に進める記事は15本中10本→15本。

---

## 3. 検索意図と担当URLの対応表

検索語は**推測**（検索量・難易度のデータはない。Search Console・キーワードプランナー・Ahrefs 等は使えなかった）。全112本の対応は [article-classification.csv](seo/article-classification.csv) にある。

| 検索語（推測） | 読者の疑問 | 担当URL | 隣の記事との違い | 読後の次の行動 |
| --- | --- | --- | --- | --- |
| 接客経験 活かせる 仕事／接客業 転職 活かせるスキル | 接客の経験は、ほかの仕事で通じる？どう言葉にする？ | `/articles/sekkyaku-keiken-ikasu` | 自己PR文の型は `jiko-pr-mikeiken`、職務経歴書は `shokumu-keirekisho-arubaito` | `sekkyaku-office`、相談（experience） |
| 接客 オフィスワーク 転職／販売から事務 違い | オフィスに移ると1日はどう変わる？土日休みになる？ | `/articles/sekkyaku-office` | 経験の言葉は前の記事、休日欄の読み方は `donichi-yasumi-shigoto`、数字の比較は `donichi-yasumi-nenshu-hikaku` | `/jobs`→`jimu-mikeiken-mae`、相談（条件か経験） |
| 事務職 未経験／事務職 種類 違い | どんな事務があり、何が必要で、応募前に何を確かめる？ | `/articles/jimu-mikeiken-mae` | PC練習は `pc-nigate-jimu`、各事務の詳細は子記事4本 | `pc-nigate-jimu`（PCが不安なら）、/check、相談（experience） |
| PC 苦手 事務職／パソコン 苦手 事務 未経験 | PCが得意でなくても目指せる？何をどこまで練習する？ | `/articles/pc-nigate-jimu` | 事務の種類は親記事、資格の要否は `mikeiken-shikaku` | `jimu-mikeiken-mae`、相談（experience） |
| 手取り20万 転職／手取り 額面 違い | 求人の月給と今の手取りをどう比べる？ | `/articles/tedori-20man-hikaku` | 年額・賞与・数年後は `nenshu-300man-tenshoku` | `nenshu-300man-tenshoku` |
| 年収300万 転職 下がる／未経験 年収 下がる | 給料は下がる？自分の場合はどう判断する？ | `/articles/nenshu-300man-tenshoku` | 手取りの計算は `tedori-20man-hikaku`、休日との比較は次の記事 | `donichi-yasumi-nenshu-hikaku`、相談（conditions） |
| 土日休み 年収 どっち／年間休日 年収 比較 | 休みの多い求人と年収の高い求人、どう比べる？ | `/articles/donichi-yasumi-nenshu-hikaku` | 休日表記の読み方は `donichi-yasumi-shigoto`、固定残業代は `koteizangyo-kyujin` | `nenshu-dake-erabanai`→/check→相談（conditions） |
| 土日休み 仕事 未経験／土日祝休み 職種 | 土日に休むには、どんな仕事を選び、求人のどこを見る？ | `/articles/donichi-yasumi-shigoto` | 給与との比較は前の記事。休日表記はこの記事が担当 | `donichi-yasumi-nenshu-hikaku`、相談（conditions） |
| 年収だけで選ばない 転職／年収以外 何を見る | 年収以外に何をどう比べる？ | `/articles/nenshu-dake-erabanai` | 固定残業代は `koteizangyo-kyujin`、下限の計算は `tedori-20man-hikaku` | /check→相談（conditions） |
| 固定残業代 求人 見方／みなし残業 とは | どこを見て何を確かめる？ | `/articles/koteizangyo-kyujin` | サイト内の固定残業代の担当 | `tedori-20man-hikaku`、内定後なら `naitei-shodaku-mae`、相談（conditions） |
| フリーター 正社員 なるには 何から | アルバイトから正社員へ、最初に何を確かめる？ | `/articles/freeter-seishain-hajimeni` | 書類は `shokumu-keirekisho-arubaito`、窓口の使い方は `hellowork-tsukaikata` | `shokumu-keirekisho-arubaito`、相談（first-job） |
| 職務経歴書 アルバイトのみ 書き方 | アルバイト経験だけで何を書く？ | `/articles/shokumu-keirekisho-arubaito` | 一般の書き方は `shokumu-keirekisho-kakikata`、欄が埋まらない履歴書は `rirekisho-kakukoto-nai` | `agent-mendan-mae`、相談（experience） |
| 未経験転職 何から始める | 最初に何を整理する？ | `/articles/mikeiken-tenshoku-hajimekata` | 年齢の不安は `26sai-mikeiken` | `agent-mendan-mae`、相談（first-job） |
| 26歳 未経験 転職 遅い | 26歳で未経験の職種は遅い？ | `/articles/26sai-mikeiken` | 全体の整理は前の記事 | `mikeiken-tenshoku-hajimekata`、相談（first-job） |
| 転職エージェント 面談 準備 | 初回の面談の前に何を決め、何を決めなくていい？ | `/articles/agent-mendan-mae` | 切り出し方の例文は `agent-soudan-nani`、しくみ・費用は `tenshoku-agent-merit` | 相談（first-job）。チェックは任意 |

同じ説明が複数の記事に繰り返されていたものは、担当を決めて、ほかの記事は1〜2行とリンクにする方針にした（今回寄せたのは主力記事の範囲）。

| 説明 | 担当記事 | 今回の対応 |
| --- | --- | --- |
| 固定残業代の3項目 | `koteizangyo-kyujin` | `nenshu-dake-erabanai` の説明を縮めてリンク。ほかの記事は未着手 |
| 完全週休2日制・年間104日 | `donichi-yasumi-shigoto` | `sekkyaku-office`・`uketsuke-shigoto` の行き先をこの記事へ。`donichi-yasumi-nenshu-hikaku` の FAQ の重複は未着手 |
| 下限の計算 | `tedori-20man-hikaku` | `nenshu-dake-erabanai`・`nenshu-300man-tenshoku` からの行き先をこの記事へ |
| 事務の種類／PC操作 | `jimu-mikeiken-mae`／`pc-nigate-jimu` | 事務の記事のPCの節を1つにまとめ、詳細はPCの記事へ |
| 候補をしぼる／書類・面接用の書き出し | `shigoto-sagashikata`／`jiko-bunseki-yarikata` | 役割の一文と相互リンク。統合は承認事項 |

---

## 4. 修正内容と、読者・集客上の理由

### 修正A: SNS テーマC（年間休日）と記事の数字をそろえた

- 変更前: 投稿画像・キャプション・代替テキストに「120日前後の会社が多い」という根拠を示していない一般化があり、記事とも合っていなかった
- 変更後: 「毎週土日休みなら、1年およそ52週で104日。祝日や夏季休暇が休みかは求人ごとに確認」とし、120日は「比べるための仮の例」と明記した。1時間あたりの比較は「架空の求人で、1日8時間・残業なしと仮定」と明記した。カルーセル・キャプション・代替テキスト・リール・ストーリーズ・生成資料（`docs/sales/sns/THEME_C.md`）が同じ内容になる。画像のデザインは変えていない
- 再発防止: `tests/sales.test.ts` に「会社が多い／ほとんどの会社／平均〇日」などの言い回しを SNS の全テーマで禁止するテストを追加（変更前のコードで失敗することを確認）
- 理由: SNS の短い一文で来た読者が、着地した記事で違う数字を見ると信頼を失う。投稿と記事の答えが一致していれば、SNS から記事へ直接つなげやすい

### 修正B: スマホの固定ボタンが相談テーマを落とさない

- 変更前: 記事を読み進めると出るスマホ固定の「相談する」ボタンだけ、記事末尾やサイドバーと違って `#support-<テーマ>` を付けていなかった。相談の説明ページで、読者の状況に合う説明が開かなかった
- 変更後: 既存の共通関数 `withConsultationTopic()` を使い、サーバーが出すリンクにテーマを入れた。通常クリック・新しいタブ（Ctrl/Cmd+クリック）・URLの直接表示・JavaScript無効のいずれでも同じ行き先になる（JS無効では固定ボタン自体が表示されず、記事末尾のボタンが同じ行き先を持つ）
- テスト: `tests/mobile-sticky-cta.test.ts`（18ガイドすべてで行き先を確認。変更前のコードで失敗）、`scripts/consultation-journey-smoke.mjs`（3導線×中立・MakeCareer・静的書き出しで、クリック・新しいタブ・直接URL・JS無効を確認）
- 理由: スマホの読者が最も押しやすいボタンで、記事の文脈が相談の説明ページに引き継がれる

### 主力15記事（詳細は2章の表）

競合の検索結果（米国リージョンの検索ツールで近似。日本の Google 順位ではない）を、3つの導線の検索語ごとに比べた。上位は大手の転職サービスのコラムと求人一覧で、「公的な資料にもとづく条件の比べ方」「求人票の欄ごとの確かめ方」「自分の数字を書き込める記入例」が少なかった。そこで文字数ではなく、次の4つを主力記事に足した。

1. 条件で分かれる答え（例: 年収と休日を1時間あたりにそろえる、状況別の最初の一歩）
2. 自分の数字を書き込める記入例・計算例（すべて「仮の例」「架空」と表示し、計算は検算した）
3. 求人票で確かめる欄と、面接・相談でそのまま聞ける質問
4. 次に読む記事と、相談・条件チェックへの自然な出口（チェックは任意。読了やチェックを相談の条件にしていない）

公的統計の数字（職業別の有効求人倍率、年間休日の平均など）は、一次資料を開いて確かめられなかったため**入れていない**（9章）。

### 正確さ

- 架空の例に「架空の例」「仮の例」「仮の会話例」の表示を追加: `uketsuke-shigoto`・`eigyo-jimu-shigoto`・`iryo-jimu-mikeiken`・`keiri-mikeiken`・`jinji-saiyo-mikeiken`・`programmer-mikeiken`・`web-marketing-mikeiken`・`hanbai-seishain`・`koumuin-shakaijin`
- 根拠を示していない「〜が多い」「〜が一般的」を弱めた: `uketsuke-shigoto`（FAQ）、`eigyo-jimu-shigoto`、`web-marketing-mikeiken`（2か所）、`kaigo-mikeiken`、`seizou-koujou-shigoto`、`butsuryu-soko-shigoto`（2か所）、`eigyo-cs-it-support-chigai`、`shoyo-kyujin-mikata`、`remote-work-kyujin`、`kibou-nenshu-kakikata`、`taishokukin-kakunin`、`koumuin-shakaijin`、主力記事の冒頭（`sekkyaku-office`・`jimu-mikeiken-mae`・`freeter-seishain-hajimeni`・`mikeiken-tenshoku-hajimekata`）
- 出典URLの追跡パラメータ（`?media=4876`）を削除（`jimu-mikeiken-mae`）。`taishokukin-kakunin` の誤ったリンク先（「求人票の見方の全体」）を直した
- `koumuin-shakaijin` に「相談で扱えるのは民間企業の並行検討」という範囲の一文を追加（相談先が公務員試験を扱うかは未確認のため）

### 内部リンク

- 孤立していた記事3本（`yukyu-tenshoku`・`kyushokusha-shien-seido`・`trial-koyou`）に、文脈のある本文リンクを追加。`koumuin-shakaijin` は相談の対象範囲が決まるまで意図的に残した
- 記事から一度もリンクされていなかったニュース3本に、関係する記事（`tedori-20man-hikaku`・`fukuri-kousei-mikata`）からリンク
- ハブから子記事へ: 事務の種類表→営業事務・経理・受付・医療事務、接客との接点表→コールセンター・受付・営業事務・人事、職種比較→コールセンター・ITの入口、IT の入口→プログラマー・資格・職業訓練、販売の正社員→固定残業代・賞与・就業場所、福利厚生→退職金、内定承諾→内定辞退
- 本文の被リンクが0の記事: 39本→24本

### 相談への接続

- 相談テーマを持つ記事: 15本→18本（experience・conditions・first-job が各6本）。記事末尾・サイドバー・スマホ固定ボタンの3か所が同じテーマを渡す（固定ボタンは変更前0本）
- 本文で条件チェックか相談に触れる記事: 14本→22本
- MakeCareer で確認済みの事実（オンライン可、初回30〜60分程度、30代も対応可）は MakeCareer の設定にだけあり、中立版には出ない（中立版の書き出しに MakeCareer の語がないことを確認）。初回連絡の目安と、地域・職種別の対応可否は**未確認のまま補っていない**

### トップの「新着・更新記事」

本文を直した記事は `updated_at` が 2026-10-12 になるため、トップの更新記事の並びが変わる。正確さの小さな修正で、公務員など対象外になりうる記事が先頭に来ないよう、同じ更新日のなかでは3つの導線の記事を先に出すようにした（`pickLatestArticles`、テストあり）。並びの規則以外、見た目は変えていない。トップの更新記事は、変更前の `26sai-mikeiken`・`agent-mendan-mae`・`jimu-mikeiken-mae` から、`agent-mendan-mae`・`donichi-yasumi-shigoto`・`jimu-mikeiken-mae` に変わった。

### 再現できる確認手段

- `scripts/seo-inventory.ts`: 全原稿の指標を CSV に書き出す（本文の文字数・表・出典・内部リンクの出入り・導線・ガイド・相談やチェックへのリンク）
- `scripts/seo-audit.ts`: 起動中のサーバーの全ページの HTML を取得し、title・description・canonical・H1・OGP・構造化データと表示内容の一致・パンくず・FAQ の表示・内部リンクと画像の切れ・title と description の重複・sitemap と canonical・robots.txt を確かめる（外部へは送信しない）

---

## 5. 重複・thin・統合候補（承認事項。URL の削除・統合はしていない）

| 対象 | 判定 | 根拠 | 提案 | リンクへの影響 |
| --- | --- | --- | --- | --- |
| `kyujin-hyo-yomikata`（draft） | hide_merge_candidate | 本文179字・出典0。題の主題は `jimu-mikeiken-mae`・`26sai-mikeiken` と重なる。一方、求人票の欄ごとの記事が9本以上あるのに、束ねる入口がない | 案1: 下書きのまま既存記事に任せる／案2: 同じ枠を「求人票のどこを見る？」の入口に作り替える（出典と査読がそろうまで draft） | 本文からの被リンク0。影響なし |
| `dainishinsotsu-tenshoku-timing`（review） | hide_merge_candidate | 本文336字・出典1（C03・C14の警告）。`tenshoku-schedule`・`zaishoku-tenshoku-susumekata` と重なる | 公開しないまま統合か作り直し | 公開ページからのリンクなし |
| `tenshoku-koukai-shinai` と `naitei-shodaku-mae` | overlap | 読者（内定前後）・疑問・回答の大部分が同じ。独自なのは応募時からの記録の習慣と配属の例 | 前者を「応募から入社後までの記録と確かめ方」に絞る（面接メモの表）か、統合 | 統合時: 本文の被リンク5本・related 9本の張り替え |
| `tenshoku-agent-merit`・`kigyou-erabi-soudan`・`mensetsu-renshu-pro` | overlap | 「プロに相談するとよい理由→相談の前に整理」の同じ型。前2本は本文の被リンク0 | 前者を支援内容・費用・限界の正本に、2本目を「求人票で分からないことの聞き方」、3本目を「模擬面接の使い方」に絞る | 統合時: ガイド（`agent-soudan-nani`・`tenshoku-agent-merit`）と related の見直し |
| `shigoto-sagashikata` と `jiko-bunseki-yarikata` | overlap（部分） | 3つの書き出しが同じ型 | 役割の一文と相互リンクは追加済み。統合するかは人が判断 | 統合時: 被リンクの張り替え |
| `ai-shigoto-mikeiken` | thin | 出典が白書と job tag のトップページだけで、本文で使われていない。AIの影響は編集部の見立て | 公的資料で確かめた材料を足す（確かめられない数字は書かない）か、職種比較か事務の記事の短い節にする | 統合時: `kyouiku-kunren-kyufu-tsukaikata`・`news-kyouiku-kunren-kyufu` のリンク張り替え |
| `naitei-shodaku-mae` の「承諾したあとに辞退」 | 部分重複 | `naitei-jitai-tsutaekata` と同じ出典・ほぼ同じ内容 | 3〜4行に縮める（リンクは追加済み） | なし |
| `eigyo-cs-it-support-chigai` と `/jobs` | 役割の重なり | 同じ3職種の比較 | 求人票の言葉の読み替え表など独自の材料を足すか、`/jobs` に寄せる | related の被参照13件 |
| `news-roudou-jouken-meiji` | 受け皿として薄い | 本文399字なのに、多くの記事の「くわしくは」の行き先 | 就業場所は `tenkin-kinmuchi-kakunin`、更新上限は `muki-tenkan-keiyaku` に寄せる | 本文リンク10本以上の張り替え |
| `donichi-yasumi-nenshu-hikaku` の FAQ 2問 | 部分重複 | 休日表記（`donichi-yasumi-shigoto`）と固定残業代（`koteizangyo-kyujin`）の FAQ と同じ趣旨 | この記事に固有の問いに替える | なし |

---

## 6. UI・既存画像を維持したことの確認

- `handoff/asset-lock.json` の48件: 34件はバイト単位で一致、14件（JSON・SVG）は取り込み時の改行（CRLF→LF）だけの違いで内容は一致、違い・欠落は0件（`evidence-2026-10-12/asset-lock-check.txt`）
- 取り込み後に `public/`・`content/images/`・CSS ファイルを変更したコミットは0件。人物写真・アイキャッチ・画像の選定と生成の記録・配色・フォント・余白・カード・ボタン・レイアウト・Light/Dark・アニメーションと reduced-motion の扱い・トップの短いコピー・画像つきの新着欄はそのまま。トップに長文は足していない
- 画面の比較（変更前 `273bd39` と変更後を、PC 1440px・スマホ 390px・小型 320px × Light/Dark で全画面撮影し、画素の差を計算）: 本文を変えていないページ（`/consultation`・`/check`・`/jobs`・`/news` など）は差0.00%。差が出たのは、本文を足した記事（ページが縦に伸びる）、記事一覧とハブの並び、トップの更新記事の中身、`/sales/sns/c` の文言だけ。横はみ出し・画像の読み込み失敗・コンソールエラー・外部への通信はすべて0件（`evidence-2026-10-12/visual-diff-makecareer.csv`・`visual-diff-neutral.csv`、比較画像は `images/`）
- SNS テーマCの画像は文言だけが変わり、デザインは同じ（`evidence-2026-10-12/images/sns-theme-c-slide-5-mobile-before-after.jpg`、変更後の書き出し画像は `images/sns-theme-c-slides-2-5-after.jpg`）

---

## 7. 採点（同じ配点で、着手前と完了後）

Codex の以前の「SEO77」とは基準が違うため比べられない。点数は Claude の判断で、根拠はこの文書と証跡のとおり。**90点に届いていない。**

| 項目（配点） | 着手前 | 完了後 | 加点の根拠 | 届かない理由 |
| --- | --- | --- | --- | --- |
| 検索意図と記事の役割（20） | 11 | 16 | 全112本の意図・担当・隣との違い・次の行動を表にした。主力15本の担当を決めて重複説明を担当記事に寄せた。短いH1に検索語を残すテストを追加 | 重複・統合の6件と非公開2本の扱いは承認待ち。検索量・日本の順位のデータがない。`donichi-yasumi-nenshu-hikaku` の FAQ の重複が残る |
| 主力記事の回答品質・独自性（25） | 15 | 20 | 15本すべてに条件で分かれる答え、記入例か計算例（仮の例）、求人票で確かめる欄、面接・相談で聞く質問がある（主力の表 31→40）。SNS と記事の数字が一致 | 公的統計の数字を一次資料で確かめて入れることができていない。取材や実例はない（作らない） |
| 根拠・正確性・確認体制（20） | 12 | 14 | 架空の例の表示（9記事）、一般化の弱め（20か所前後）、SNS の再発防止テスト、追跡パラメータの削除、事実と編集上の分析の区別と相談先への質問の文書化 | ネットワーク制限で一次資料を開けず、事実の再確認ができていない。38本が人の再査読待ち。情報確認日の警告5件と民間の出典（MOS）が残る |
| 技術SEO・内部リンク（20） | 16 | 18 | 監査で問題0件（161ページ×2プロファイル）。孤立記事4→1（意図的）、記事からリンクのないニュース3→0、本文の被リンク0の記事39→24。監査と棚卸しをスクリプトで再現できる | 被リンク0の記事が24本残る。公開時の robots.txt と noindex の関係は人の判断 |
| 記事から相談への接続（15） | 10 | 13 | スマホ固定ボタンが相談テーマを保つ（0→18記事）。相談テーマを持つ記事15→18。本文から条件チェックか相談に進める記事14→22。チェックは任意のまま | 相談先の職種・地域の対応範囲と初回連絡の目安が未確認。相談開始の計測がなく効果は未検証 |
| **合計（100）** | **64** | **81** | | |

着手前の監査で検出した6件（記事一覧の2ページ目以降のパンくずが「記事一覧」で終わる）は、サイトを直したのではなく、監査の規則を見直して0件にした。ページ送りは一覧の一部なので、パンくずが一覧で終わるのは正しいと判断し、「確認事項」として記録する形に変えた（`scripts/seo-audit.ts` の該当行にコメントあり）。技術SEOの着手前16点は、この6件を問題として数えていない。

---

## 8. 実施した検証、失敗、残った警告

### 最終の検証（すべてこのコミットの内容で実行）

| 検証 | 結果 |
| --- | --- |
| 型チェック `npm run lint` | OK |
| 単体テスト `npx vitest run` | 19ファイル・146件すべて成功 |
| 原稿チェック `npm run content:check` | GATE: PASSED（エラー0。警告は下記） |
| ビルド（中立・MakeCareer） | 成功（`.next-neutral`・`.next-makecareer` を消してから実行） |
| 本番送客OFF `npm run check:outbound` | MakeCareer 168ページ・中立 168ページ・静的書き出し 161ページで、申込ボタン各451個がすべてサイト内。提携先 LP へのリンク0 |
| SEO 監査 `scripts/seo-audit.ts` | MakeCareer・中立とも161ページで問題0件、内部リンクと画像の切れ0件、title・description の重複0件、sitemap 156URL で問題0件、robots.txt は `Disallow: /`、noindex 161/161 |
| 相談導線 `scripts/consultation-journey-smoke.mjs` | 動的（中立・MakeCareer）36件、静的書き出し18件がすべて成功（キーボード、JS無効、直接URL、新しいタブ、履歴、reduced-motion、320/390/1440px、Light/Dark、横はみ出しなし） |
| 3つの導線とスマホ固定ボタン | 上記のスモークで、記事末尾・固定ボタンがそれぞれ experience・conditions・first-job を保つことを確認。相談の説明ページへは条件チェックなしで直接進める |
| 商談デモ `npm run test:meeting` | 動的と静的の両方で成功、エラー0 |
| 画面の比較 | 6章のとおり |
| 中立版の書き出し `npm run export:static` | 160ページ＋404。`export/pages` を更新。MakeCareer の語は0件 |

### 作業中の失敗と対処

- 最新版の ZIP が当初届かず、共有専用ブランチ経由で受け取った（マージはしていない）。Windows の改行（CRLF）を LF にそろえ、照合記録を残した
- 中立版のビルドが Google Fonts の一時的な失敗でキャッシュごと壊れた → 出力フォルダを作り直して解決
- 新しいタブの確認で、開いた直後の URL が `about:blank` のまま判定されていた → URL が変わるまで待つ形に直した
- ガイド数のテスト（15→18）は意図した変更として更新。新しく足したH1のテストが、検索語の抜けた `agent-mendan-mae` のH1を見つけたので直した

### 残った警告（隠すために日付や承認は変えていない）

- 原稿チェックの警告: 本文を直した38本に「査読のあとに更新されている。再査読が必要」（C04）。着手前からの「出典の確認日が情報確認日より新しい」5件（`agent-mendan-mae`・`donichi-yasumi-nenshu-hikaku`・`freeter-seishain-hajimeni`・`sekkyaku-keiken-ikasu`・`shokumu-keirekisho-arubaito`）、出典1件（C03）2件、本文が短い（C14）1件はそのまま
- 査読記録: 直した38本の `content/reviews/<slug>.json` に、機械チェックの結果を「career-reviewer (automated checks; human approval pending)」の名前で追記した。人の承認ではない。`reviewed_at` は変えていない
- `supabase/seed.sql` は更新していない。再生成すると、もとの査読者名と新しい本文のハッシュが組になり、人が承認したように見えるため。古い本文（「120日前後になる会社が多くなります」を含む）が残っているので、人の再査読のあとに `npm run db:seed-sql` で作り直す
- 相談の申込ボタンの数: 454→451。記事ガイドがある記事では本文中の相談ボタンを出さない仕様で、ガイドを3本足したため。導線が減ったのではない（記事末尾・サイドバー・固定ボタンはある）
- 静的書き出しの HTML（`export/site/`）はリポジトリの外（.gitignore）。`export/pages/` だけをコミットした

---

## 9. 人による確認・公開後のデータが必要な事項

### 人の確認（公開や承認の前）

1. 本文を直した38本の再査読と承認（`content/reviews` に機械チェックの記録あり）。承認後に `information_checked_at` を実際に確認した日付で更新し、`seed.sql` を再生成する
2. 一次資料での確認（このセッションでは `www.mhlw.go.jp`・`developers.google.com` などへの接続が環境のネットワーク設定で拒否された。下の値は検索結果の抜粋でしか見ておらず、本文には入れていない）
   - 就労条件総合調査（令和7年）: 年間休日の1企業平均112.4日、労働者1人平均116.6日
   - 子ども・子育て支援金: 令和8年4月分から（協会けんぽ 0.23%）
   - 令和7年雇用動向調査: 転職で賃金が増加40.8%・減少31.0%・変わらない25.5%
   - job tag の職業別の有効求人倍率（年度表記の確認を含む）
   - フリーター数136万人（令和6年）、新規学卒者の3年以内離職率（大卒33.8%・高卒37.9%）
   - Google 検索のドキュメント（有用なコンテンツ、FAQ のリッチリザルトの終了）
3. `pc-nigate-jimu` の MOS のレベル構成の出典が民間（ユーキャン）。公式ページで確かめて差し替える
4. 相談先（MakeCareer）の対応範囲: 職種（介護・施工管理・ドライバー・公務員など）と地域、初回連絡の目安。決まるまで、それらの職種記事の相談の文言は汎用のまま。`koumuin-shakaijin` に相談ボタンを出すかも判断が必要
5. 5章の統合・非公開の判断
6. 公開を決めたとき: robots.txt の `Disallow: /` と noindex の両方を外す必要がある（`Disallow` を残すとクローラーがページを読めず、noindex を外しても本文は評価されない）。逆に、`Disallow` の間は noindex も読まれないので、インターネットに置く検証環境は robots.txt に頼らずパスワードで保護する

### 公開後のデータが必要なこと（今回は計測を足していない）

- 検索: Search Console の表示回数・順位・クエリ（今は noindex なので取れない）。この文書の検索語は推測
- 行動: 記事ごとの読了・条件チェック・相談の説明ページへの到達。今のイベントはブラウザ内の記録だけで、GA4・GTM・ピクセル・CRM・外部送信は入れていない（指示どおり）
- SNS: UTM は SNS のリンクにだけある。SNS から記事への直接の着地を比べるには、公開後の計測が必要
- 相談: 提携先での申込・面談の結果はつながっていない（パートナー API は入れていない）

### 環境の設定（エージェントに一次資料を確かめさせる場合）

Claude Code の環境設定の「ネットワークアクセス」で `www.mhlw.go.jp`・`jobtag.mhlw.go.jp`・`www.e-gov.go.jp`・`developers.google.com` などを許可すると、エージェントが一次資料を開いて確かめられる。

---

## 10. Codex が独立レビューできる差分と証跡

- 差分: `git diff 273bd39..HEAD -- career-media`（`273bd39` は ZIP の取り込みだけ。改善はそれ以降）
  - コード: `git diff 273bd39..HEAD -- career-media/src career-media/tests career-media/scripts`
  - 記事: `git diff 273bd39..HEAD --word-diff -- career-media/content/articles`
- 証跡: [docs/seo/evidence-2026-10-12/](seo/evidence-2026-10-12/README.md)（取り込みの照合、asset-lock の照合、原稿チェックの前後、監査の前後、送客OFF、導線のスモーク、画面比較の表、別エージェントの判定、競合調査の記録、比較画像）
- 再現: 2つのデモを起動し（`npm run demo -- --port 3200`、`npm run demo:makecareer`）、`npm run check:outbound -- --base <URL>`、`npx tsx scripts/seo-audit.ts --base <URL>`、`node scripts/consultation-journey-smoke.mjs <URL…>`、`npx tsx scripts/seo-inventory.ts`
- 特に見てほしいところ
  1. クラスターC・D・Eの判定（別の検証者がいない）
  2. 主力記事の記入例・計算例の数字と、「仮の例」の表示漏れ
  3. 弱めた一般化が、逆に分かりにくくなっていないか
  4. 監査の規則の見直し（ページ送りのパンくず）が妥当か
  5. トップの並び順の規則（同じ更新日なら導線の記事を先に）が編集方針に合うか
