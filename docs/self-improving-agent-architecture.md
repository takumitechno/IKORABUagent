# =LOVE Agent OS — Control Plane Architecture

## 原則

Agentは「何を・いつ・なぜ」を決め、Capabilityは「どう実行するか」を担います。Agent定義にはHTTP、SQL、provider SDK、SNS投稿実装を含めません。

## 通常運用

1. 指原が目的・対象・成功条件・安全境界を定義する。
2. 衣織が出典、期間、欠損、矛盾を検証する。
3. 舞香が検証済みEvidenceから反証可能な仮説を作る。
4. 瞳が価値、根拠、リスク、コストで採否を決める。
5. 採用案だけを承認済みCapabilityへ渡す。

指原自身は計測、仮説生成、戦略選定をしません。前段の出力が不足すれば後段へ進みません。

## 自己改善

1. 杏奈がログ、失敗、品質、コストを監査する。
2. 改善案を `auto_apply` / `human_gate` / `forbidden` に分類する。
3. 承認済み `auto_apply` だけを樹愛羅へ渡す。
4. 樹愛羅は隔離された作業領域で適用・テストする。
5. 成功時はapply可能と報告し、失敗時はrevert可能な状態を保つ。

提案者と実行者を分離し、credential、公開、不可逆操作は自動適用しません。

## 知識・横断Agent

- さなつん: 知識、編集基準、ブランド規則を保守する。Writerではない。
- 横断4 Agent:
- りさ: 通知要否と内容を決める。送信は将来の `notify.send` Capability。
- はな: scheduleの期待状態を監視する。scheduler engineではない。
- しょうこ: 読者別の報告構成を決める。DB集計実装ではない。
- みりにゃ: 使用量とコストを評価する。課金や契約は行わない。

## Scheduling

- 指原: 毎日 02:00
- 杏奈: 毎日 05:00
- さなつん: 毎週月曜 03:00
- Dashboard: always-on

新設4 Agentは自然なCapabilityが無い間はon-demandです。

## Data model

`agents` と `agent_edges` がロスターと関係の正本です。legacy列名はDB互換のため維持し、UIは個別Agent名をハードコードしません。schema sourceはfresh/demo DB向けであり、本番DBの自動migrationは行いません。

## Threads Data Plane integration

- `IKORABUagent` は本社 / Control Plane、`Threads-` はData Plane / 実行基盤です。
- Control Planeはproduction DBを直接読みません。参照・設定変更はBridge/API経由です。
- NIGHT03は事前承認済みroot投稿のscheduled batch、NIGHT04はWindows Task
  Schedulerから起動されるone-shot runnerです。
- Manual Post Syncは分析対象と学習対象を `analyze_enabled` / `learn_enabled`
  で別々に管理します。
- Self-Reply Thread Syncは本人のrootとself-replyを論理threadへ束ね、thread全体と
  part別のKPIを集約します。他人へのreplyは対象外です。
- morning reportはKPIを仮説へ戻しますが、自動学習は `learn_enabled=true` の
  コンテンツに限定します。

顧客向けUIは内部Agent名やControl/Data Plane構成を表示しません。内部専用
ダッシュボードだけがAgent状態と運用サマリーを表示します。

既知制約として、PART0が公開済みで後続replyが失敗したpartial publicationは、
PART0を再送しません。照合後に未送信partだけを明示的な回復経路で扱います。

## Non-goals

Control Plane内でのprovider SDK実行、production DB直接参照、OAuth secret管理、
Metaへの直接POST、外部通知の直接送信は対象外です。これらはData Planeまたは
承認済みCapabilityの責務です。
