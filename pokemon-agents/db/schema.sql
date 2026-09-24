-- pokemon-agents/db/schema.sql
-- 現行 .claude/db/agents.db の実スキーマから生成した統合スキーマ (2026-06-23)。
-- init.sh がこれを適用する。旧 incremental migration (0001_init の分割テーブル
-- knowledge_*/events/agent_runs 等、0003 の runs) は単一 knowledge テーブル + reflections に
-- 統合され廃止されたため削除済み。reflections は旧 runs をリネームしたもの。
-- (自己参照 FK parent_run_id は reflections(id) に修正済み)

CREATE TABLE seo_daily_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    gsc_impressions INTEGER,
    gsc_clicks INTEGER,
    gsc_ctr REAL,
    gsc_avg_position REAL,
    ga_pageviews INTEGER,
    ga_users INTEGER,
    ga_sessions INTEGER,
    ga_organic_sessions INTEGER,
    ga_bounce_rate REAL,
    indexed_pages INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS "agent_costs" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent TEXT NOT NULL,
    cost_usd REAL,
    input_tokens INTEGER,
    output_tokens INTEGER,
    cache_read_tokens INTEGER,
    cache_creation_tokens INTEGER,
    duration_ms INTEGER DEFAULT 0,
    num_turns INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    data_origin TEXT NOT NULL DEFAULT 'legacy_unknown' CHECK (data_origin IN ('production','demo','legacy_unknown'))
);
CREATE TABLE IF NOT EXISTS "logs" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  session_id TEXT,
  cwd TEXT,                  -- 実行時の working directory
  agent TEXT,                -- 実行中のサブエージェント名（取得できれば）
  hook_event TEXT NOT NULL,  -- PreToolUse / PostToolUse / Stop / SessionStart / ...
  tool_name TEXT,            -- Read / Write / Bash / WebFetch / ...
  tool_input TEXT,           -- JSON（そのまま保存、後でクエリ）
  tool_response TEXT,        -- PostToolUse のみ
  success INTEGER,           -- PostToolUse: 1=success, 0=fail
  duration_ms INTEGER,       -- 取得できれば
  prompt TEXT,               -- UserPromptSubmit のみ
  transcript_path TEXT,      -- debug用
  raw TEXT                   -- 完全な JSON（想定外フィールド救済用）
, tool_use_id TEXT, source TEXT DEFAULT 'hook');
CREATE TABLE knowledge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime')),
  
  kind TEXT NOT NULL,
  layer TEXT,
  
  agent TEXT,
  scope TEXT,
  
  title TEXT,
  body TEXT,
  tags TEXT,
  
  status TEXT DEFAULT 'active',
  confidence REAL,
  
  predicted_outcome TEXT,
  affected_resources TEXT,
  executed_at TEXT,
  follow_up_schedule TEXT,
  follow_up_results TEXT,
  outcome TEXT,
  
  parent_id INTEGER REFERENCES knowledge(id),
  derived_from TEXT,
  supersedes INTEGER REFERENCES knowledge(id),
  evidence_session_ids TEXT,
  
  trial_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  
  self_score INTEGER,
  
  legacy_source TEXT,
  legacy_id INTEGER,
  
  metadata TEXT
);
CREATE TABLE agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,              -- 'sashihara-orchestrator'
  pokemon_slug TEXT NOT NULL,             -- legacy-compatible key, e.g. 'sashihara'
  pokemon_jp TEXT NOT NULL,               -- legacy-compatible display column, e.g. '指原'
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'writer','reviewer','publisher','orchestrator',
    'validator','hypothesizer','selector',
    'supervisor','executor',
    'researcher','optimizer','outreach','auditor','solo'
  )),
  department TEXT NOT NULL,               -- 'subsidy' | 'benefit' | 'editorial' | ...
  model TEXT NOT NULL DEFAULT 'sonnet',
  source_md_path TEXT NOT NULL,           -- '.claude/agents/_subsidy/caterpie-subsidy-writer/agent.md'
  instructions TEXT NOT NULL,             -- md から seed した system prompt
  instructions_hash TEXT NOT NULL,        -- sha256 (md 同期検出用)
  version INTEGER DEFAULT 1,
  config TEXT DEFAULT '{}',               -- JSON: { timeout_sec, extra_args }
  status TEXT DEFAULT 'active' CHECK (status IN ('active','disabled','draft','deprecated')),
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime'))
, role_label TEXT, avatar_url TEXT, department_label TEXT);
CREATE TABLE agent_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL REFERENCES agents(id),
  version INTEGER NOT NULL,
  prev_instructions TEXT,
  new_instructions TEXT NOT NULL,
  diff TEXT,
  changed_by TEXT NOT NULL,               -- 'human:operator' | 'agent:kiara-executor' | 'sync:md-watcher'
  reason TEXT,
  derived_from_approval_id INTEGER,
  git_commit_sha TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime'))
);
CREATE TABLE agent_edges (
  supervisor_id INTEGER NOT NULL REFERENCES agents(id),
  subordinate_id INTEGER NOT NULL REFERENCES agents(id),
  edge_type TEXT DEFAULT 'supervises' CHECK (edge_type IN ('supervises','collaborates','reviews','triggers')),
  PRIMARY KEY (supervisor_id, subordinate_id)
);
CREATE TABLE agent_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL REFERENCES agents(id),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('timer','assignment','on_demand','automation')),
  interval_sec INTEGER,
  cron_expr TEXT,
  parent_agent_id INTEGER REFERENCES agents(id),
  next_run_at TEXT,
  last_fired_at TEXT,
  enabled INTEGER DEFAULT 1,
  payload_template TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime')),
  data_origin TEXT NOT NULL DEFAULT 'legacy_unknown' CHECK (data_origin IN ('production','demo','legacy_unknown'))
);
CREATE TABLE issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal_id INTEGER,  -- goals テーブルは廃止済みのため FK 句を削除
  parent_issue_id INTEGER REFERENCES issues(id),
  type TEXT NOT NULL CHECK (type IN (
    'hypothesis_run','control_apply',
    'content_task','data_sync',
    'manual_followup','bug','decision',
    'pilot_review'
  )),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo','in_progress','in_review','blocked','done','cancelled')),
  priority INTEGER DEFAULT 3,
  assignee_agent_id INTEGER REFERENCES agents(id),
  derived_from_table TEXT,
  derived_from_id INTEGER,
  metadata TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime'))
);
CREATE TABLE approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'agent_revision','control_apply','budget_increase','pilot_promotion','manual'
  )),
  entity_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  diff_text TEXT,
  requested_by_agent_id INTEGER REFERENCES agents(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','expired','applied')),
  reviewed_by TEXT,
  reviewed_at TEXT,
  applied_at TEXT,
  rejection_reason TEXT,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime')),
  data_origin TEXT NOT NULL DEFAULT 'legacy_unknown' CHECK (data_origin IN ('production','demo','legacy_unknown'))
);
CREATE TABLE agent_budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER REFERENCES agents(id),
  period TEXT NOT NULL,
  budget_cents INTEGER NOT NULL,
  used_cents INTEGER DEFAULT 0,
  unknown_run_count INTEGER NOT NULL DEFAULT 0 CHECK (unknown_run_count >= 0),
  unknown_run_limit INTEGER NOT NULL DEFAULT 3 CHECK (unknown_run_limit >= 1),
  warning_threshold_pct INTEGER DEFAULT 80,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','warning','halted','expired')),
  halted_at TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime')),
  UNIQUE(agent_id, period)
);
CREATE TABLE schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now','localtime'))
);
CREATE TABLE IF NOT EXISTS "reflections" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Who
  agent_id INTEGER REFERENCES agents(id),
  agent_slug TEXT NOT NULL,                  -- legacy data 用 denormalized
  -- Context
  trigger TEXT,                               -- 'launchd' | 'timer' | 'on_demand' | 'automation' | 'manual' | NULL
  issue_id INTEGER REFERENCES issues(id),
  schedule_id INTEGER REFERENCES agent_schedules(id),
  parent_run_id INTEGER REFERENCES reflections(id),
  -- Atomic checkout (Paperclip 流、Platform v2 用)
  checked_out_by TEXT,
  checked_out_at TEXT,
  checkout_expires_at TEXT,
  -- Execution
  action TEXT,                                -- agent_runs の action (例: 'run', 'review', 'publish')
  -- status は CHECK 無し (legacy data に 'success'/'error'/'partial_fix'/'rejected' 等の多様な値あり、新規は 'queued'/'running'/'completed'/'failed'/'timeout' 等を使う)
  status TEXT NOT NULL DEFAULT 'completed',
  started_at TEXT,
  ended_at TEXT,
  duration_ms INTEGER,
  tokens_in INTEGER,
  tokens_out INTEGER,
  cost_usd REAL,
  result_summary TEXT,
  error_message TEXT,
  -- v1 style item counts
  items_processed INTEGER,
  items_succeeded INTEGER,
  items_failed INTEGER,
  -- Multica 流 resume
  session_id TEXT,
  work_dir TEXT,
  retry_count INTEGER DEFAULT 0,
  -- Reflection (inline、nullable)
  self_score INTEGER,
  what_went_well TEXT,
  what_to_improve TEXT,
  lesson_learned TEXT,
  reflected_at TEXT,
  -- Meta
  metadata TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime'))
, what_done TEXT, output_details TEXT, quality_score INTEGER, result_full TEXT, quality_check TEXT, self_improvement TEXT, content_improvement TEXT, payload TEXT DEFAULT '{}');
CREATE TABLE hypotheses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),

  title TEXT NOT NULL,

  -- 6 つのシンプルフィールド
  proposal TEXT NOT NULL,
  rationale TEXT,
  expected_impact TEXT,
  verification_method TEXT,
  verification_period_days INTEGER,
  verification_result TEXT,

  -- 状態管理 (新定義)
  status TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('pending_review','running','validated','falsified','abandoned')),
  priority INTEGER CHECK (priority BETWEEN 1 AND 5),

  -- ガードレール情報
  guardrail_reason TEXT,                       -- 人間承認が必要な理由 (例: '予算  超過', '本番DB書き換え')

  -- 実行者
  executor_agent TEXT,
  started_at TEXT,
  ended_at TEXT,
  data_origin TEXT NOT NULL DEFAULT 'legacy_unknown' CHECK (data_origin IN ('production','demo','legacy_unknown'))
);
CREATE TABLE knowledge_index (
  path TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  agent_slugs TEXT,
  priority TEXT DEFAULT 'reference' CHECK (priority IN ('required','reference')),
  confidence REAL,
  status TEXT DEFAULT 'active',
  last_validated_at TEXT,
  updated_at TEXT DEFAULT (datetime('now','localtime'))
);
CREATE TABLE improvements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),

  title TEXT NOT NULL,

  -- 5 フィールド (検証期間なし、次実行で効果判定)
  proposal TEXT NOT NULL,                       -- 何をやるか
  rationale TEXT,                              -- なぜやるか
  expected_impact TEXT,                         -- どれぐらい効果
  verification_method TEXT,                     -- どうやって検証するか
  verification_result TEXT,                     -- 検証結果

  -- 状態管理 (仮説と同じライフサイクル)
  status TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('pending_review','running','validated','falsified','abandoned')),
  priority INTEGER CHECK (priority BETWEEN 1 AND 5),

  -- ガードレール
  guardrail_reason TEXT,                       -- 人間承認が必要な理由 (例: 'agent.md 破壊的変更')

  -- 対象エージェント (どの agent.md を直すか)
  target_agent TEXT,                           -- 例: abra-seo-report
  executor_agent TEXT,                         -- 実行担当 (通常はミューツー)
  started_at TEXT,
  ended_at TEXT,
  data_origin TEXT NOT NULL DEFAULT 'legacy_unknown' CHECK (data_origin IN ('production','demo','legacy_unknown'))
);
CREATE TABLE daily_reports (
  date TEXT PRIMARY KEY,                 -- 'YYYY-MM-DD'
  summary_md TEXT NOT NULL,
  prompt_count INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0,
  reflection_count INTEGER DEFAULT 0,
  cost_usd REAL,
  unknown_cost_count INTEGER CHECK (unknown_cost_count IS NULL OR unknown_cost_count >= 0),
  agents_used TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  data_origin TEXT NOT NULL DEFAULT 'legacy_unknown' CHECK (data_origin IN ('production','demo','legacy_unknown'))
);
CREATE INDEX idx_agent_costs_created ON agent_costs(created_at);
CREATE INDEX idx_knowledge_kind ON knowledge(kind);
CREATE INDEX idx_knowledge_status ON knowledge(status);
CREATE INDEX idx_knowledge_layer ON knowledge(layer);
CREATE INDEX idx_knowledge_scope ON knowledge(scope);
CREATE INDEX idx_knowledge_agent ON knowledge(agent);
CREATE INDEX idx_knowledge_legacy ON knowledge(legacy_source, legacy_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_dept ON agents(department);
CREATE INDEX idx_agent_revisions_agent ON agent_revisions(agent_id, version);
CREATE INDEX idx_schedules_due
  ON agent_schedules(enabled, next_run_at) WHERE trigger_type='timer';
CREATE INDEX idx_issues_status ON issues(status, priority);
CREATE INDEX idx_issues_assignee ON issues(assignee_agent_id, status);
CREATE INDEX idx_approvals_pending
  ON approvals(status, expires_at) WHERE status='pending';
CREATE INDEX idx_hypotheses_status ON hypotheses(status);
CREATE INDEX idx_hypotheses_priority ON hypotheses(priority DESC);
CREATE INDEX idx_hypotheses_created ON hypotheses(created_at);
CREATE INDEX idx_knowledge_index_priority ON knowledge_index(priority);
CREATE INDEX idx_knowledge_index_status ON knowledge_index(status);
CREATE INDEX idx_improvements_status ON improvements(status);
CREATE INDEX idx_improvements_priority ON improvements(priority DESC);
CREATE INDEX idx_logs_ts            ON logs(ts);
CREATE INDEX idx_logs_agent         ON logs(agent);
CREATE INDEX idx_logs_tool          ON logs(tool_name);
CREATE INDEX idx_logs_session       ON logs(session_id);
CREATE INDEX idx_logs_hook          ON logs(hook_event);
CREATE INDEX idx_logs_tool_use_id   ON logs(tool_use_id);
CREATE INDEX idx_logs_source        ON logs(source);
CREATE INDEX idx_reflections_agent   ON reflections(agent_id);
CREATE INDEX idx_reflections_status  ON reflections(status);
CREATE INDEX idx_reflections_checkout ON reflections(checkout_expires_at);
CREATE INDEX idx_daily_reports_date ON daily_reports(date);
CREATE TABLE ai_usage_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  usage_event_id TEXT NOT NULL UNIQUE,
  call_id TEXT NOT NULL,
  event_kind TEXT NOT NULL CHECK (event_kind IN ('started','completed')),
  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('internal','account')),
  account_id TEXT REFERENCES agent_activity_accounts(account_id),
  agent_id TEXT,
  provider TEXT NOT NULL,
  model TEXT,
  operation TEXT NOT NULL,
  feature TEXT,
  task_ref TEXT,
  correlation_id TEXT,
  run_id TEXT,
  input_tokens INTEGER CHECK (input_tokens IS NULL OR input_tokens >= 0),
  output_tokens INTEGER CHECK (output_tokens IS NULL OR output_tokens >= 0),
  cache_read_tokens INTEGER CHECK (cache_read_tokens IS NULL OR cache_read_tokens >= 0),
  cache_creation_tokens INTEGER CHECK (cache_creation_tokens IS NULL OR cache_creation_tokens >= 0),
  cost_amount_micros INTEGER CHECK (cost_amount_micros IS NULL OR cost_amount_micros >= 0),
  currency TEXT,
  cost_basis TEXT NOT NULL CHECK (cost_basis IN ('actual','unknown')),
  unknown_reason TEXT,
  terminal_status TEXT CHECK (terminal_status IN ('succeeded','failed','timeout','cancelled')),
  started_at TEXT NOT NULL,
  ended_at TEXT,
  data_origin TEXT NOT NULL CHECK (data_origin IN ('production','demo','legacy_unknown')),
  payload_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(call_id, event_kind),
  CHECK ((scope_kind='internal' AND account_id IS NULL) OR (scope_kind='account' AND account_id IS NOT NULL)),
  CHECK ((event_kind='started' AND terminal_status IS NULL AND ended_at IS NULL
          AND input_tokens IS NULL AND output_tokens IS NULL AND cache_read_tokens IS NULL
          AND cache_creation_tokens IS NULL AND cost_amount_micros IS NULL AND currency IS NULL
          AND cost_basis='unknown' AND unknown_reason IS NULL)
      OR (event_kind='completed' AND terminal_status IS NOT NULL AND ended_at IS NOT NULL
          AND ((cost_amount_micros IS NULL AND cost_basis='unknown' AND unknown_reason IS NOT NULL)
            OR (cost_amount_micros IS NOT NULL AND cost_basis='actual' AND currency IS NOT NULL AND unknown_reason IS NULL))))
);
CREATE INDEX idx_ai_usage_events_period ON ai_usage_events(data_origin, event_kind, started_at);
CREATE INDEX idx_ai_usage_events_scope ON ai_usage_events(scope_kind, account_id, started_at);
CREATE INDEX idx_ai_usage_events_attribution ON ai_usage_events(agent_id, model, task_ref, run_id);
CREATE TRIGGER ai_usage_events_no_update
BEFORE UPDATE ON ai_usage_events BEGIN SELECT RAISE(ABORT, 'ai_usage_events is append-only'); END;
CREATE TRIGGER ai_usage_events_no_delete
BEFORE DELETE ON ai_usage_events BEGIN SELECT RAISE(ABORT, 'ai_usage_events is append-only'); END;
CREATE TRIGGER ai_usage_scope_active
BEFORE INSERT ON ai_usage_events
WHEN NEW.scope_kind='account' AND NOT EXISTS (
  SELECT 1 FROM agent_activity_accounts WHERE account_id=NEW.account_id AND status='active'
) BEGIN SELECT RAISE(ABORT, 'ai_usage account scope is not active'); END;
CREATE TRIGGER ai_usage_completed_requires_start
BEFORE INSERT ON ai_usage_events
WHEN NEW.event_kind='completed' AND NOT EXISTS (
  SELECT 1 FROM ai_usage_events started
  WHERE started.call_id=NEW.call_id AND started.event_kind='started'
    AND started.scope_kind=NEW.scope_kind AND started.account_id IS NEW.account_id
    AND started.agent_id IS NEW.agent_id AND started.provider=NEW.provider AND started.model IS NEW.model
    AND started.operation=NEW.operation AND started.feature IS NEW.feature AND started.task_ref IS NEW.task_ref
    AND started.correlation_id IS NEW.correlation_id AND started.run_id IS NEW.run_id
    AND started.started_at=NEW.started_at AND started.data_origin=NEW.data_origin
) BEGIN SELECT RAISE(ABORT, 'ai_usage completion has no matching start'); END;
CREATE TABLE ai_usage_budget_charges (
  call_id TEXT PRIMARY KEY,
  agent_db_id INTEGER NOT NULL,
  period TEXT NOT NULL,
  cost_amount_micros INTEGER CHECK (cost_amount_micros IS NULL OR cost_amount_micros >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TRIGGER ai_usage_budget_charges_no_update
BEFORE UPDATE ON ai_usage_budget_charges BEGIN SELECT RAISE(ABORT, 'ai_usage_budget_charges is append-only'); END;
CREATE TRIGGER ai_usage_budget_charges_no_delete
BEFORE DELETE ON ai_usage_budget_charges BEGIN SELECT RAISE(ABORT, 'ai_usage_budget_charges is append-only'); END;
CREATE TRIGGER ai_usage_budget_charge_requires_completion
BEFORE INSERT ON ai_usage_budget_charges
WHEN NOT EXISTS (SELECT 1 FROM ai_usage_events WHERE call_id=NEW.call_id AND event_kind='completed'
  AND cost_amount_micros IS NEW.cost_amount_micros)
BEGIN SELECT RAISE(ABORT, 'budget charge must match completed usage'); END;
CREATE TRIGGER knowledge_hypothesis_writer_guard
BEFORE INSERT ON knowledge
FOR EACH ROW
WHEN NEW.kind = 'hypothesis'
  AND NEW.agent NOT IN ('maika-hypothesizer','sashihara-orchestrator','human')
BEGIN
  SELECT RAISE(ABORT, 'kind=hypothesis の直接書込は maika-hypothesizer 専権です。実行エージェントは decision / guidance を使ってください');
END;
CREATE TRIGGER knowledge_control_hypothesis_quality_insert
BEFORE INSERT ON knowledge
FOR EACH ROW
WHEN NEW.kind = 'control_hypothesis'
  AND NEW.status NOT IN ('draft','needs_rework','rejected','rejected_permanently','proposed','awaiting_approval')
BEGIN
  SELECT CASE
    WHEN NEW.affected_resources IS NULL OR NEW.affected_resources IN ('','[]')
      THEN RAISE(ABORT, 'control_hypothesis: affected_resources を空にできません (承認段階)')
    WHEN NEW.metadata IS NULL OR json_extract(NEW.metadata,'$.diff') IS NULL OR json_extract(NEW.metadata,'$.diff') = ''
      THEN RAISE(ABORT, 'control_hypothesis: metadata.diff が必須です (承認段階)')
    WHEN json_extract(NEW.metadata,'$.gate_classification') NOT IN ('auto_apply','human_gate','forbidden')
      THEN RAISE(ABORT, 'control_hypothesis: metadata.gate_classification は auto_apply/human_gate/forbidden のいずれか')
    WHEN NEW.predicted_outcome IS NULL
      THEN RAISE(ABORT, 'control_hypothesis: predicted_outcome が必須です (承認段階)')
  END;
END;
CREATE TRIGGER knowledge_control_hypothesis_quality_update
BEFORE UPDATE ON knowledge
FOR EACH ROW
WHEN NEW.kind = 'control_hypothesis'
  AND (OLD.status IN ('draft','needs_rework') OR OLD.status IS NULL)
  AND NEW.status NOT IN ('draft','needs_rework','rejected','rejected_permanently')
BEGIN
  SELECT CASE
    WHEN NEW.affected_resources IS NULL OR NEW.affected_resources IN ('','[]')
      THEN RAISE(ABORT, 'control_hypothesis UPDATE: affected_resources 空 不可')
    WHEN NEW.metadata IS NULL OR json_extract(NEW.metadata,'$.diff') IS NULL OR json_extract(NEW.metadata,'$.diff') = ''
      THEN RAISE(ABORT, 'control_hypothesis UPDATE: metadata.diff 必須')
    WHEN json_extract(NEW.metadata,'$.gate_classification') NOT IN ('auto_apply','human_gate','forbidden')
      THEN RAISE(ABORT, 'control_hypothesis UPDATE: gate_classification 不正')
    WHEN NEW.predicted_outcome IS NULL
      THEN RAISE(ABORT, 'control_hypothesis UPDATE: predicted_outcome 必須')
  END;
END;
CREATE TRIGGER knowledge_hypothesis_quality_gate
BEFORE INSERT ON knowledge
FOR EACH ROW
WHEN NEW.kind = 'hypothesis'
  AND NEW.agent = 'maika-hypothesizer'
BEGIN
  SELECT CASE
    WHEN NEW.affected_resources IS NULL OR NEW.affected_resources IN ('','[]')
      THEN RAISE(ABORT, 'hypothesis: affected_resources 必須 (対象ページ URL or スコープパターン)')
    WHEN NEW.predicted_outcome IS NULL
      THEN RAISE(ABORT, 'hypothesis: predicted_outcome 必須')
    WHEN json_extract(NEW.predicted_outcome, '$.metric') IS NULL OR json_extract(NEW.predicted_outcome, '$.metric') = ''
      THEN RAISE(ABORT, 'hypothesis: predicted_outcome.metric 必須 (ctr/position/impressions/clicks/sessions 等)')
    WHEN json_extract(NEW.predicted_outcome, '$.baseline') IS NULL
      THEN RAISE(ABORT, 'hypothesis: predicted_outcome.baseline 必須 (施策前の実測値)')
    WHEN json_extract(NEW.predicted_outcome, '$.target') IS NULL
         AND json_extract(NEW.predicted_outcome, '$.delta_pct') IS NULL
         AND json_extract(NEW.predicted_outcome, '$.predicted_delta') IS NULL
      THEN RAISE(ABORT, 'hypothesis: predicted_outcome.target または delta_pct 必須')
    WHEN json_extract(NEW.predicted_outcome, '$.direction') IS NULL
      THEN RAISE(ABORT, 'hypothesis: predicted_outcome.direction 必須 (increase|decrease)')
    WHEN json_extract(NEW.predicted_outcome, '$.measurement_source') IS NULL
      THEN RAISE(ABORT, 'hypothesis: predicted_outcome.measurement_source 必須 (gsc|ga|supabase 等)')
  END;
END;
CREATE TRIGGER knowledge_hypothesis_schedule_gate
BEFORE INSERT ON knowledge
FOR EACH ROW
WHEN NEW.kind = 'hypothesis'
  AND NEW.agent = 'maika-hypothesizer'
BEGIN
  SELECT CASE
    WHEN NEW.follow_up_schedule IS NULL OR NEW.follow_up_schedule IN ('','[]')
      THEN RAISE(ABORT, 'hypothesis: follow_up_schedule 必須 (検証計画: 最低 T+1d + T+7d の2点)')
  END;
END;
CREATE TRIGGER knowledge_hypothesis_structured_gate
BEFORE INSERT ON knowledge
FOR EACH ROW
WHEN NEW.kind = 'hypothesis' AND NEW.agent = 'maika-hypothesizer'
BEGIN
  SELECT CASE
    WHEN json_extract(NEW.metadata, '$.executor_agent') IS NULL OR json_extract(NEW.metadata, '$.executor_agent') = ''
      THEN RAISE(ABORT, 'hypothesis: metadata.executor_agent 必須 (diglett-title-optimizer 等の実行部隊名)')
    WHEN json_extract(NEW.metadata, '$.story.hypothesis') IS NULL OR json_extract(NEW.metadata, '$.story.hypothesis') = ''
      THEN RAISE(ABORT, 'hypothesis: metadata.story.hypothesis 必須 (仮説ステートメント)')
    WHEN json_extract(NEW.metadata, '$.story.evidence') IS NULL OR json_extract(NEW.metadata, '$.story.evidence') = ''
      THEN RAISE(ABORT, 'hypothesis: metadata.story.evidence 必須 (根拠)')
    WHEN json_extract(NEW.metadata, '$.story.action') IS NULL OR json_extract(NEW.metadata, '$.story.action') = ''
      THEN RAISE(ABORT, 'hypothesis: metadata.story.action 必須 (やること)')
  END;
END;
CREATE TRIGGER knowledge_control_hypothesis_structured_gate
BEFORE INSERT ON knowledge
FOR EACH ROW
WHEN NEW.kind = 'control_hypothesis'
  AND NEW.status NOT IN ('draft','needs_rework','rejected')
BEGIN
  SELECT CASE
    WHEN json_extract(NEW.metadata, '$.story.hypothesis') IS NULL OR json_extract(NEW.metadata, '$.story.hypothesis') = ''
      THEN RAISE(ABORT, 'control_hypothesis: metadata.story.hypothesis 必須 (対策の核)')
    WHEN json_extract(NEW.metadata, '$.story.evidence') IS NULL OR json_extract(NEW.metadata, '$.story.evidence') = ''
      THEN RAISE(ABORT, 'control_hypothesis: metadata.story.evidence 必須 (根拠)')
    WHEN json_extract(NEW.metadata, '$.story.action') IS NULL OR json_extract(NEW.metadata, '$.story.action') = ''
      THEN RAISE(ABORT, 'control_hypothesis: metadata.story.action 必須 (やること)')
  END;
END;
