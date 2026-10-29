# 動画制作ガイド（Codex 向け）

このフォルダの縦型ショート動画は、Python（Pillow ＋ numpy／scipy）で1コマずつ描き、ffmpeg で MP4 にしている。動画編集ソフトや動画生成サービスは使っていない。ここに書いた手順どおりに進めれば、Claude Code で作ったものと同じ形の動画を作れる。

| フォルダ | 中身 |
|---|---|
| `makecareer/` | MakeCareer への送客ショート①〜⑤。ナレーションは支給、BGM と効果音はこちらで生成。**新しく作るときはこの形を基本にする** |
| `career-edu-2/` | 転職の教育ショート第二弾①〜⑤（求人の見方・自己PRの書き方）。人物写真なし、図解が主役、誘導（CTA）なし。MakeCareer の道具をそのまま使う別シリーズの見本 |
| `recruit-shorts/sales-to-jimu/` | 営業→事務の動画A〜D（最初に作ったもの）。描画エンジンの本体（`src/engine.py` ほか）もここにある |
| `IMAGES.md` | 全案件の画像一覧（人物・服装・場面・使用実績・隠すべき文字）。**新しく画像を作る前に必ずここから探す** |

MakeCareer の部品（`makecareer/src/mc.py`）は、`recruit-shorts/sales-to-jimu/src/` を `sys.path` に足して、そのエンジンを使っている。

## 1. 環境

- Python 3.10 以上（3.13 で動作確認）、Pillow、numpy、scipy、ffmpeg（libx264 と aac が使えるもの）
- あれば使うもの
  - pyopenjtalk：音の長さの見積もりが正確になる。なくても文字数で代用する
  - faster-whisper：`transcribe.py`（単語の時刻）に使う
- フォント：`recruit-shorts/sales-to-jimu/fetch_fonts.sh` で Google Fonts から Noto Sans JP（500／700／900）を `recruit-shorts/sales-to-jimu/fonts/` に取得する（リポジトリには入れていない）

```
pip install pillow numpy scipy pyopenjtalk faster-whisper
apt-get install -y ffmpeg
bash media/recruit-shorts/sales-to-jimu/fetch_fonts.sh
```

Codex のクラウド環境では、作業中はネットにつながらないことがある。フォントの取得はセットアップスクリプトで済ませておく。

Whisper のモデル（任意）は faster-whisper 用の small（CTranslate2、int8）を使った。Hugging Face の `Systran/faster-whisper-small` が取れればそれでよい。Claude の環境では Hugging Face が使えなかったので、npm の `@skillninja/shortmovie-telop-model-p0`〜`p3` を取得し、`model.bin.part0`〜`part3` をつなげて使った（p0 に sha256、設定ファイル、トークナイザーが入っている）。

## 2. 仕組み（MakeCareer）

```
narration/<名前>_jin.mp3 ─┐
narration/scripts.json ──┼─ src/fit_audio.py（PLANS[<名前>]）─→ timing/<名前>.json  ← 編集用データ
narration/<名前>_words.json ┘                                          │
                                                                      ▼
                         src/v0N_<名前>.py の build(tm)・sfx_events(tm) ─→ mc.render
                                                                      │
              out/<名前>.mp4、out/<名前>.srt、timing/<名前>.md、out/preview/*.jpg
```

### 主なファイル（`makecareer/` 以下）

| ファイル | 役割 |
|---|---|
| `narration/<名前>_jin.mp3` | ユーザー支給のナレーション（Fish Audio のサイトで作成、声は Jin） |
| `narration/scripts.json` | 動画ごとの `[タイトル, [[字幕ID, 字幕の文], ...]]`。字幕の文は確定ナレーションを意味の区切りで分けたもの（`\n` で2行） |
| `narration/<名前>_words.json` | 音声認識の単語時刻（任意）。行の中で特定の言葉が出る瞬間を探すのにだけ使う |
| `timing/<名前>.json` | シーン・全文字幕・強調テロップ・きっかけ（marks）の時刻（秒、動画の頭から）。`fit_audio.py` が作り、手で直してもよい |
| `src/mc.py` | 5本共通の部品（下の表） |
| `src/fit_audio.py` | 音声と台本を位置合わせして `timing/*.json` を作る。動画ごとの構成（PLANS）もここ |
| `src/v0N_<名前>.py` | 各動画の画面構成。`build(tm)` がシーンの一覧を返す |
| `src/preview.py` | 指定した秒のコマを1枚の一覧画像にする（書き出しより速い） |
| `src/check.py` | 書き出した MP4 を検査する |
| `src/transcribe.py` | 単語時刻の作成（任意） |

### 時刻ファイル（`timing/<名前>.json`）

- `audio`：`file` は使う音声、`cut` は音声のどこから使うか（秒）、`at` は動画の何秒目に置くか
- `scenes`：`{id, start, end, note}`。隙間なく並べる（`mc.Timing` が確認する）
- `subtitles`：`{id, start, end, text}`。全文字幕
- `telops`：`{id, start, end, text}`。強調テロップ。`{ }` で囲んだ部分は黄色になる
- `marks`：`{名前: 秒}`。カードを出す瞬間などのきっかけ

時刻はすべて動画の頭からの秒数。シーン内の時刻に直すときは `tm.local(sid, t)`／`tm.mark(sid, key)` を使う。

### 画面の部品（`mc.py`）

| 部品 | 使い方 |
|---|---|
| `Window(画像, src, box=WIN, look, masks)` | 写真を中央の「窓」に置き、背景に同じ写真をぼかして敷く。`src` は元画像の切り出し範囲（0〜1の割合）で、窓の縦横比に合わせて広げられる。**顔と手元が両方入る範囲を選ぶ**。`.shot(dur, z0, z1, c0)` でゆっくりズーム、`.backdrop(dur)` はぼかした背景だけ |
| `masks` | `(x0, y0, x1, y1[, 半径])`：元画像の文字やロゴをぼかす範囲。画面中央のものは半径4〜6にする（大きいと汚れのように見える）。**顔に掛かっていないか必ずプレビューで確かめる** |
| `shots([(開始, fn), ...])` | シーン内で写真を切り替える（短いクロスフェード） |
| `tm.telop(sid, tid, size)` | 強調テロップ（画面上部） |
| `Telop(画像, x, y, 入, 出, anim)` | 任意の画像を時刻つきで出す。`anim` は `up`／`pop`／`left`／`fade` など |
| `white_card`、`flow_card`、`icon_card`、`notebook`、`bullet_line`、`sticky`、`pill`、`label` | 図解のカード、ノート、付箋、ラベル |
| `accent_frame` ＋ `Highlight` | 「今これの話」を示す黄色い枠 |
| `resume_sheet`、`laptop`、`phone_frame`、`job_card`、`Blink` | 履歴書・PC・スマホ・求人カードの模式図（中身は灰色の棒。実在の情報は入れない）。`Blink` は入力欄の点滅する縦線 |
| `doc_icon`、`chat_icon`、`pen_icon`、`bookmark_icon`、`book_icon`、`bag_icon`、`search_icon`、`arrow` | 文字のないアイコン |
| `cta_scene(tm, sid, 見出し, sub, badge, band, chips)` | 5本共通の最終画面 |
| `Subtitles`、`disclaimer` | 全文字幕と「※画像はAI生成によるイメージです」（`render` が自動で載せる） |

### 画面の配置（1080×1920）

- 「※画像はAI生成によるイメージです」：上端から約200px
- 強調テロップ：中心 y=390（`TOP_CY`）
- 写真の窓：`WIN = (60, 500, 1020, 1270)`
- 全文字幕：中心 y=1350（`SUB_CY`）。SNS の操作表示より上
- 右端（x が約980より右）と下部（y が約1450より下）に大事な情報を置かない
- 最終画面のまとまりは y≈800 を中心にし、字幕の帯（1290〜）より上で終わらせる

### 音（`mc.build_audio`）

- ナレーション：支給音声の `cut` 秒以降を、`tts.voice_chain` で軽く整えて（低音カット、声の明瞭さ、軽い圧縮）`at` 秒目に置く。**速度は変えない**
- BGM：`narrated.groove` で作るエレピ＋パッド（88BPM）。サービス紹介の段落のシーン（`lift_at`）から軽いドラムが入る。ナレーション中は11dB下げる
- 効果音：`pop`／`tick`／`paper`／`blip` を、カードやメモが出る、項目を書くといった画面上の動きにだけ小さく付ける。**場面転換と最終画面には付けない**
- 書き出し時に −14 LUFS にそろえる（engine の loudnorm）
- `mc.render(..., with_audio=False)` で音声トラックなしの映像だけも作れる

## 3. 新しい動画を1本作る手順

コマンドはすべて `media/makecareer/src` で実行する。

1. **台本**：`narration/scripts.json` に `"<名前>": ["<タイトル>", [["p1a", "…"], ["p1b", "…"], ...]]` を足す。
   - 字幕IDは段落ごとに `p1a`, `p1b`, …
   - 1つの字幕は2行まで、1行16字程度まで（長い行は自動で少し縮み、それでも入らないと折り返す。3行になったら分け直す）
   - タイトルは、音声の冒頭でタイトルを読み上げているときだけその文字列を入れる。読み上げていなければ `""` にする
2. **音声**：ユーザーから受け取り、`narration/<名前>_jin.mp3` に置く。音声生成サービスを自分で動かさない（MakeCareer の仕様）。
   - Fish Audio のダウンロード名は「声-日時-<読み上げた文の冒頭>」になる。どの動画の音声かは、ファイル名の文字数と台本の冒頭を照らし合わせて判断した
3. （任意）**単語時刻**：`python3 transcribe.py <モデルのフォルダ> <名前>`
4. **画像**：`IMAGES.md` から選ぶ。同じ動画の中では同じ人物・同じ服装にする。足りない場面だけ新しく作る。
   - Claude では Figma の画像生成（`gemini-3.1-flash-image`、768×1376）を使った。Codex で画像を作る手段がなければ、必要な場面を書き出してユーザーに素材を頼む
   - 作った画像は `makecareer/img/` に JPG（quality 93）で、元データは `makecareer/img/png/` に置き、`IMAGES.md` と `makecareer/img/README.md` に追記する
   - 生成の指示は次の形で書いた（英語）：「Photorealistic candid photo, vertical 9:16. <場所と時間>. A Japanese <性別> about <年齢> with <髪型>, wearing <服装>, <していること>, <表情>. His/Her face in the upper-middle of the frame and <手元> in the center of the frame, clearly visible. Natural light, natural skin texture, documentary style. No readable text, no logos, no watermarks.」
   - 同じ人物の2枚目は「The same Japanese …」として、髪型と服装を同じ言葉で書く
5. **構成（PLANS）**：`src/fit_audio.py` の `PLANS` に足す。
   - `scenes`：`(シーンID, そのシーンの最初の字幕ID, メモ)`。シーンは最初の字幕の0.22秒前で切り替わる
   - `telops`：`(テロップID, 文, (種類, 基準[, 終わりの字幕ID]))`。種類 `scene` はシーンの間ずっと出し、`cue` はその字幕の始まりから出す
   - `marks`：`(名前, 字幕ID, 言葉)`。その字幕の中でその言葉が言われる瞬間（`|` で候補を並べられる）。言葉が `None` なら字幕の始まり
6. **時刻の作成**：`python3 fit_audio.py <名前>`。表示された字幕の時刻と、`words.json` の文が合っているかを見る。音声と台本の行の順番がずれていると、位置合わせ全体がずれる。
7. **画面構成**：`src/v0N_<名前>.py` を作る。一番そろっている見本は `v03_seishain.py`。
   - `build(tm)`：`timing` のシーン順にシーンを返す
   - `sfx_events(tm)`：`[(秒, 種類, 音量), ...]` を返す
   - `__main__`：`mc.render(tm, build(tm), プレビューする秒, sfx_events(tm), lift_at=<サービス紹介シーンの開始>)` を呼ぶ
8. **プレビュー**：`python3 preview.py v0N_<名前> 0.8 3.2 …` で `out/preview/<名前>_sheet.jpg` を作り、画像を見て確かめる。
   - 文字が顔・手元・図解に重なっていないか
   - ぼかしが顔に掛かっていないか
   - 右端に寄りすぎていないか
   - 最終画面と字幕が重なっていないか
9. **書き出し**：`python3 v0N_<名前>.py`。30秒の動画で、4コアのマシンでおよそ2分半かかる。2本までなら並べて書き出せる。
10. **検査**：`python3 check.py <名前>` が `OK` になること。そのあと `out/preview/<名前>_*.jpg`（書き出し中に保存されるコマ）も見る。
11. **コミット**：コード、`timing/`、画像、ナレーションをコミットする。`out/`（MP4 など）は `.gitignore` 済みで、リポジトリには入れない。MP4 はユーザーに渡し、ユーザーが保存する。

## 4. 守ること（MakeCareer の指示より）

- 1080×1920、30fps、9:16
- **全文字幕**は、ナレーションの文を省略せずに出す。**強調テロップ**は短い言葉だけにし、全文字幕と同じ長文を出さない
  - 冒頭テロップが字幕の文をそのまま含むときは、テロップが出ている間その字幕を出さない（`Subtitles` が自動で処理する）
- 日本語の文字は画像生成で描かせない。すべて編集で重ねる
- AI 画像を使う動画には「※画像はAI生成によるイメージです」を読める大きさで出す（`render` が自動で載せる）
- 人物は架空の20代。実在の社員・相談員・利用者に見せない。架空の社員紹介やビデオ通話画面は作らない
- 求人・検索・応募書類の画面は模式図にする。実在の企業名・実在の求人・個人情報・採用結果に見えるものは入れない。具体例を並べる場面には「経験の例」と出す
- 泣き顔、絶望した表情、暗すぎる画面、高級車や札束のような成功の象徴は使わない。正解を示すチェックマークも付けない
- 最終画面は、サービス名（文字で「メイクキャリア」）、その動画の相談テーマ、無料相談／無料面談、「プロフィールのリンクから」。ロゴは正規の素材がないので使わない。URL と QR コードは作らない。押せるボタンに見せる演出（カーソル・クリック）は入れない
- 提供されていない実績・資格・給与・内定保証・相談員の経歴を付け足さない。収入や転職成功を保証する表現は使わない（`docs/HQ_DECISIONS.md` 37行目）
- 音声の速度を変えて尺を合わせない。長さは支給音声に合わせる
- 報告では、確認できたことと確認できていないことを分ける。音は聴けないので、聞こえ方や字幕との合い方を「確認済み」と書かない（`check.py` で分かるのは数値だけ）

## 5. つまずきやすい点

- `pkill -f <文字列>` は、その文字列を含む自分のシェルまで止めてしまう。止めたいプロセスは `pgrep` で番号を調べて `kill` する
- PyAV の版が合わないと、faster-whisper に音声ファイルを直接渡したときに失敗する。`transcribe.py` は ffmpeg で読み込んでから渡している
- 画像の窓の切り出しは、元画像の範囲を超えると自動で縮む。思った範囲が映らないときは `src` を見直す
- `masks` のぼかし範囲は元画像の割合で指定する。人物の近くを指定するときは特に、プレビューで顔に掛かっていないか確かめる（⑤で一度、本棚のぼかしが顔に掛かった）
- 字幕の1行が長すぎると44pxまで縮み、それでも入らないと折り返す。3行になると `check.py` が知らせる
- Claude の環境では Figma の画像URLを直接ダウンロードできなかったため、スクリーンショット機能（base64）で PNG を保存した

## 6. 別のシリーズを作るとき（例：`career-edu-2/`）

MakeCareer の道具（`mc.py`、`fit_audio.py`、`preview.py`、`check.py`）は、作業フォルダを切り替えて別シリーズにも使える。新しい仕組みは作らず、`career-edu-2/` と同じ形にする。

- フォルダの形は同じ（`narration/`、`timing/`、`src/`、`out/`）
- `src/` に小さな設定ファイル（`career-edu-2/src/edu.py`）を置き、次の3つをまとめる
  - 環境変数 `MC_PROJECT` に自分のフォルダを入れてから `mc` を読み込む（`mc.ROOT` と `mc.OUT_DIR` がそのフォルダになる）
  - そのシリーズの構成（PLANS）
  - そのシリーズ専用の図解の部品
- 構成は `fit_audio.PLANS.update(PLANS)` で足してから `fit_audio.fit(名前)` を呼ぶ。動画ごとに `tail`（最後の言葉のあと何秒残すか）を決められる
- 各動画のスクリプトには `NAME = "<時刻表の名前>"` を書く（`preview.py` がこれで時刻表を探す）
- AI画像を使わない動画は、スクリプトに `AI_NOTE = False` と書き、`mc.render(..., ai_note=False)` にする（「※画像はAI生成によるイメージです」を出さない）。注記の位置を変えるときは `NOTE_XY` と `mc.render(..., note_xy=…)`
- 効果音の種類には `ping`（注意音）と `swish`（場面転換の軽い音）もある。第二弾は最初のコマに `ping` を音量1.2（ナレーションと同じくらい）で入れている
- 第二弾の画面上部の写真の帯は `edu.Header`。シーンごとに `edu.scene(..., head=[(開始秒, 画像の名前, 切り出し範囲), …])` で切り替える（人物の顔・手元・背景だけ、を交互に）
- BGM にドラムを入れないときは `lift_at=None` にする。`music_vel` で BGM の大きさを決める（第二弾は0.42）
- `career-edu-2` では、コマンドを `python3 edu.py fit|preview|check …` で呼ぶ。`preview.py` は場所を指定して読み込む（営業→事務のフォルダにも同じ名前の `preview.py` があり、名前で読み込むとそちらが先に読まれる）

## 7. 営業→事務の動画（A〜D）

`recruit-shorts/sales-to-jimu/` は仕組みが少し違う。
- ナレーションは Fish Audio の音声をセリフごとに切り分けた `clips/`（`TTS_BACKEND=clips`）を使う
- 動画C・Dはナレーションの長さからシーンの長さを決め（`narrated.py`）、A・Bはテロップの時刻に音声を合わせる（`voiceover.py`）

書き出しのコマンドは同じフォルダの `README.md` にある。新しく作るなら、MakeCareer の形（`timing/*.json` を中心にする作り方）を使う。
