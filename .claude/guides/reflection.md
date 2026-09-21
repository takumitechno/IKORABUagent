# Reflection rules

全Agentの実行結果は `reflections` に記録し、事実と改善提案を分けます。

| field | meaning |
|---|---|
| `result_full` | 外部または最終アウトプット |
| `what_done` | 実施内容 |
| `quality_check` | ルール準拠確認 |
| `self_improvement` | Agent OSや定義の改善候補 |
| `content_improvement` | 出力・運用内容の改善候補 |

自己改善候補は杏奈が監査・分類し、承認済みのものだけを樹愛羅へ渡します。通常運用の仮説は衣織のEvidence検証後に舞香が作り、瞳が選定します。Agentが未取得値を補完したり、reflectionから実行を自動承認したりしてはいけません。
