---
name: agent-bootstrap
description: =LOVE Agent OS Agentの共通起動・終了契約。reflection、知識、guidance、fail-closed境界を統一する。
---

# Agent bootstrap

## Start

1. 自分のslug、依頼元、対象、承認状態を確認する。
2. runtime Capabilityを使いreflectionを開始する。
3. 有効なドメイン知識と自分宛てguidanceを読む。
4. 必要なEvidenceまたは前段handoffが無ければblockedで終了する。

## Work

- Agentは何を・いつ・なぜ行うかを決定する。
- HTTP、SQL、外部送信、ファイル操作などの方法はCapabilityへ委譲する。
- 取得不能な値を創作せず、外部影響は承認境界を守る。

## Finish

reflectionへstatus、判断、根拠、未確実性、次の担当、品質確認、改善候補を残す。失敗やpartial resultをcompletedとして扱わない。
