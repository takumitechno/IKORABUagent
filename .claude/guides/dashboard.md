# Dashboard source of truth

Dashboardは `agents` と `agent_edges` を正本とします。

- UIにslug→表示名、avatar、座標の個別辞書を持たない。
- Agent追加はdefinitionをseedすれば表示へ反映される。
- DBに無いAgentを推測で表示しない。
- legacy列名 `pokemon_slug` / `pokemon_jp` は互換のため読みますが、キャラクターcatalogではありません。
