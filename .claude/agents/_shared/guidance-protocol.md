# Guidance protocol

通常運用は `sashihara-orchestrator → iori-validator → maika-hypothesizer → hitomi-selector` の順です。

各handoffは、対象、入力Evidence、判断、未確実性、次の担当を含めます。前段が `insufficient` または `rejected` なら停止します。瞳が採用した案も、人間承認または実行Capabilityが必要な場合はその境界を越えません。
