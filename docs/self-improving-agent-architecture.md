# =LOVE Agent OS — Control Plane Architecture

## 原則

Agentは「何を・いつ・なぜ」を決め、Capabilityは「どう実行するか」を担います。Agent定義にはHTTP、SQL、provider SDK、SNS投稿実装を含めません。

組織契約の唯一の正本は `pokemon-agents/web/lib/agent-role-registry.ts` です。identity Markdownはその実行/persona表現で、テストとseed時検証によりdriftを拒否します。

## 通常運用

1. しょうこが資料とprovenanceを収集する。
2. 衣織が出典、鮮度、欠損、矛盾を検証し、舞香とさなつんへ渡す。
3. 舞香が検証済みEvidenceから反証可能な一変数仮説を作る。
4. 瞳がOfferとStrategyをadopt / hold / rejectし、locked briefをWriterへ渡す。
5. Writer、system QA、人間承認の境界を順に通す。
6. 指原は専門判断を代行せず、次行動、優先度、担当、hold/stop、競合裁定だけを行う。

指原自身は計測、仮説生成、戦略選定をしません。前段の出力が不足すれば後段へ進みません。

## 自己改善

1. 杏奈がEvidenceから範囲限定・可逆な改善案を作る。
2. target、base hash、artifact hash、test、revert条件を人間承認へ渡す。
3. 承認はbindingを記録するだけで、対象ファイルを変更しない。
4. 樹愛羅は承認済み proposal/base/patch/test binding を再検証し、clean な linked worktree に exact patch だけを適用する。失敗時は元の clean state に戻し、commit・merge・push は行わない。

提案者と実行者を分離し、credential、公開、不可逆操作は自動適用しません。

## 知識・横断Agent

- さなつん: 知識、編集基準、ブランド規則を保守する。Writerではない。
- 横断4 Agent:
- りさ: 通知要否と内容を決める。送信は将来の `notify.send` Capability。
- はな: scheduleの期待状態を監視する。scheduler engineではない。
- しょうこ: Research取得とprovenance。検証やOffer選定は行わない。
- みりにゃ: Revenue、Conversion、AI/商業Cost、Margin、Unit Economics、Wasteを評価する。unknownを0にしない。

## Scheduling

以下はseedされた表示用scheduleであり、存在だけでは実行されない。embedded schedulerは `POKEMON_AGENTS_SCHEDULER=on` の完全一致でのみ起動し、未設定・`off`・その他の値では停止する。このpackageではemployee producerを有効化しない。

- 指原: 毎日 02:00
- 杏奈: 毎日 05:00
- さなつん: 毎週月曜 03:00
- Dashboard: always-on

新設4 Agentは自然なCapabilityが無い間はon-demandです。

## Data model

role registryがロスター、ownership、handoff、action allowlistの正本です。`agents` と `agent_edges` はruntime projectionです。legacy列名はDB互換のため維持します。

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
