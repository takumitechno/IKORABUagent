# =LOVE Agent OS

AI SNS運用システムのためのローカルControl Planeです。Agentは判断を担当し、外部アクセス、集計、通知、投稿などの実処理はCapabilityへ委譲します。

## 11 Agent roster

| Agent | 担当 |
|---|---|
| 指原 (`sashihara-orchestrator`) | Chief Operating Editor（次行動・優先度・担当・hold/stop・裁定） |
| 衣織 (`iori-validator`) | Evidence検証 |
| 舞香 (`maika-hypothesizer`) | 仮説・分析 |
| 瞳 (`hitomi-selector`) | Offer & Strategy選定 |
| 杏奈 (`anna-supervisor`) | 範囲限定・可逆な改善提案 |
| 樹愛羅 (`kiara-executor`) | 承認済み完全一致artifactの実行境界（未稼働） |
| さなつん (`sanatsun-knowledge-editor`) | 検証済み知識のversion・expiry・supersession管理 |
| りさ (`risa-notifier`) | severity・recipient・dedupe・suppression・escalation判断 |
| はな (`hana-heartbeat`) | expected vs observed reliability判定 |
| しょうこ (`shoko-reporter`) | Research収集・provenance |
| みりにゃ (`mirinya-cost-analyst`) | Revenue・Conversion・Cost・Margin・Unit Economics |

## Formal workflows

通常運用: `しょうこ → 衣織 → 舞香 → 瞳 → Editorial Writer → system QA → Human`

自己改善: `杏奈 proposal → Human approval → 樹愛羅 exact patch execution → 杏奈`。承認は記録だけで、対象ファイルを変更しません。樹愛羅は clean な linked worktree で、承認済み byte 列と allowlist 済みテストだけを実行し、commit・merge・push は行いません。

ドメイン知識: さなつん。横断4 Agent: りさ、はな、しょうこ、みりにゃ。新設4 Agentは対応Capabilityが確立するまで定期実行しません。

Threads Data Plane（`Threads-` repo）とはBridge/API経由で接続します。Control
Planeはproduction DBを直接読み書きせず、Bridgeが返す承認済みの運用情報だけを
利用します。

## Local dashboard

```sh
bash pokemon-agents/scripts/setup-demo.sh
AGENTS_DB_PATH=.runtime/db/agents-demo.db bun pokemon-agents/web/server.ts
```

`http://localhost:5733/` を開きます。組織契約の正本は `pokemon-agents/web/lib/agent-role-registry.ts` です。identity MarkdownとDBは検証済み表現であり、独立した役割定義ではありません。既存schemaの `pokemon_slug` / `pokemon_jp` は互換性のため列名だけ保持しています。

拓実本人用の内部運用画面は `http://localhost:5733/internal` です。Threadsの実値は
`THREADS_BRIDGE_URL` の既存Bridge/APIだけから取得し、Bridge未接続時はデモ値に
置き換えず「接続待ち」と表示します。顧客向けトップ画面 `/` とは分離されています。

### 普段はこれだけ実行

Windows PowerShellでリポジトリ直下から次を実行します。

```powershell
.\scripts\start-agent-os.ps1
```

production Bridge (`127.0.0.1:8000`) とdashboard (`127.0.0.1:5733`) が既に正常なら
そのまま利用し、停止中のサービスだけを起動します。dashboard起動時はtracked DBを使わず、
`.runtime/db/agents-demo.db` が未作成ならschemaとseed資産から生成し、既存なら整合性を検証してそのまま使います。旧Bridge用の8765番は起動しません。

通常のdashboard、scheduler、agent runtimeはこのruntime DBだけを既定で使用します。未作成なら起動時に生成し、既存DBは整合性と11 Agent seedを検証してそのまま利用します。破損やschema不整合があれば自動上書きせず停止します。tracked legacy DB（`.claude/db/agents.db` / `.claude/db/agents-demo.db`）を`AGENTS_DB_PATH`に指定した起動は拒否されます。
runtime demoのscheduleは画面確認用で、存在するだけでは実行されません。embedded schedulerは `POKEMON_AGENTS_SCHEDULER=on` の完全一致でのみ起動し、未設定・`off`・その他の値では停止したままです。このpackageはscheduleやemployee producerを有効化しません。
状態確認だけを行う場合は次を実行します。

```powershell
.\scripts\status-agent-os.ps1
```

起動ログは `.runtime/logs/` に保存されます。API key、token、admin keyは起動引数や
画面表示へ出さず、設定済みのプロセス環境からのみ継承します。

## Safety

- Threads連携、SNS投稿、外部API、課金処理はこのControl Planeに含めません。
- 人間承認やCapabilityが無い操作はfail-closedです。
- `.claude/launchd.json` は設定ソースであり、このリポジトリの変更だけではOSへjobを登録しません。

## Threads運用の現行仕様

- `NIGHT03`: 人間が事前承認したroot投稿だけを対象にするscheduled batchです。
- `NIGHT04`: 1回だけ実行するrunnerをWindows Task Schedulerから起動します。
  Task Schedulerの登録・変更はこのrepoの設定編集だけでは行われません。
- `Manual Post Sync`: Threads上で人間が直接作成した投稿を検出します。新規手動
  投稿は原則 `analyze_enabled=true` / `learn_enabled=false` で、分析と学習を分離します。
- `Self-Reply Thread Sync`: rootと本人によるself-replyを論理threadとして束ね、
  thread全体とpart別KPIを扱います。
- morning reportは実測KPIと仮説を結び、次の企画判断へ返します。学習は
  `learn_enabled=true` の対象だけに限定します。
- 顧客向け `/` は内部Agent名・内部構成・運用鍵を表示しません。内部専用
  `/internal` では運用者向けにAgent状態を表示できます。

詳細は [`docs/current-architecture-and-operations.md`](docs/current-architecture-and-operations.md)
を参照してください。
