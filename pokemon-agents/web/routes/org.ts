import type { Database } from "bun:sqlite";
import { escapeHtml, jpRole } from "../components/layout";

interface AgentBasic {
  id: number;
  slug: string;
  pokemon_jp: string;
  role: string;
  status: string;
  avatar_url?: string | null;
}

interface OrgNode extends AgentBasic {
  reports: OrgNode[];
}

interface ActivitySpeechRow {
  sequence: number;
  timestamp: string;
  agent_id: string | null;
  action: string;
  decision_status: string;
  result_status: string;
  next_action_owner: string | null;
}

interface IssueSpeechRow {
  slug: string;
  type: string;
  status: string;
}

interface SpeechBubble {
  message: string;
  href: string;
}

const ROLE_LABEL_JP: Record<string, string> = {
  "sashihara-orchestrator": "運用統括・最終判断",
  "anna-supervisor": "改善案の提案",
  "hana-heartbeat": "稼働・結果の監視",
  "kiara-executor": "承認済み作業の実行",
  "mirinya-cost-analyst": "売上・CV・コスト分析",
  "sanatsun-knowledge-editor": "確認済みナレッジ管理",
  "shoko-reporter": "調査・情報収集",
  "iori-validator": "根拠・事実の検証",
  "maika-hypothesizer": "仮説・実験設計",
  "hitomi-selector": "戦略・施策の選定",
  "risa-notifier": "通知・確認依頼の判断",
};

const MEMBER_ACCENT: Record<string, string> = {
  "anna-supervisor": "#3b82f6",
  "hana-heartbeat": "#f97316",
  "risa-notifier": "#38bdf8",
  "kiara-executor": "#f9a8d4",
  "maika-hypothesizer": "#f8fafc",
  "hitomi-selector": "#ef4444",
  "shoko-reporter": "#facc15",
  "iori-validator": "#a855f7",
  "sanatsun-knowledge-editor": "#22c55e",
  "mirinya-cost-analyst": "#c4b5fd",
};

const AGENT_SPEECH: Record<string, [message: string, delaySeconds: number, href: string]> = {
  "sashihara-orchestrator": ["今日も、いい運用にしよう。", 0, "/logs"],
  "iori-validator": ["根拠までしっかり確認するよ。", 3, "/hypotheses"],
  "maika-hypothesizer": ["次の仮説、試してみよう。", 6, "/hypotheses"],
  "hitomi-selector": ["いちばん効く施策を選ぶね。", 9, "/hypotheses"],
  "anna-supervisor": ["次の改善案、見つけたよ。", 12, "/improvements"],
  "hana-heartbeat": ["稼働状況、ちゃんと見てるよ。", 15, "/logs"],
  "kiara-executor": ["承認済みの作業を進めます。", 18, "/improvements"],
  "mirinya-cost-analyst": ["数字から伸びしろを探すね。", 21, "/costs"],
  "risa-notifier": ["確認が必要ならすぐ知らせるね。", 24, "/logs"],
  "sanatsun-knowledge-editor": ["確認済みの知識を整理中。", 27, "/knowledge"],
  "shoko-reporter": ["新しい情報を調べてくるね。", 30, "/knowledge"],
};

const ACTION_SPEECH: Record<string, string> = {
  next_action_selected: "次にやることを決めたよ。",
  priority_assigned: "優先順位を整理したよ。",
  owner_assigned: "担当を決めたよ。",
  source_collected: "新しい情報を集めたよ。",
  provenance_recorded: "情報の出どころを記録したよ。",
  research_gap_reported: "追加で調べたい点を見つけたよ。",
  evidence_validated: "根拠の確認が終わったよ。",
  evidence_rejected: "使わない方がいい情報を見つけたよ。",
  evidence_insufficient: "根拠がまだ足りないよ。",
  contradiction_detected: "情報の食い違いを見つけたよ。",
  freshness_checked: "情報の新しさを確認したよ。",
  hypothesis_proposed: "次に試す仮説を考えたよ。",
  alternative_hypothesis_proposed: "別の仮説も用意したよ。",
  experiment_variable_selected: "検証する条件を決めたよ。",
  offer_adopted: "使う施策を選んだよ。",
  offer_held: "施策をいったん保留にしたよ。",
  strategy_selected: "次の戦略を選んだよ。",
  revenue_analyzed: "売上の分析が終わったよ。",
  conversion_analyzed: "CVの動きを確認したよ。",
  cost_analyzed: "コストの分析が終わったよ。",
  margin_analyzed: "利益の状態を確認したよ。",
  unit_economics_analyzed: "収益性を確認したよ。",
  commercial_waste_flagged: "無駄になっている費用を見つけたよ。",
  knowledge_versioned: "確認済みの知識を更新したよ。",
  knowledge_marked_stale: "古くなった情報を見つけたよ。",
  reliability_observed: "運用状況を確認したよ。",
  status_missing_detected: "取得できない状態を見つけたよ。",
  schedule_drift_detected: "予定とのずれを見つけたよ。",
  notification_decided: "通知する内容を整理したよ。",
  notification_suppressed: "重複する通知はまとめておいたよ。",
  notification_escalated: "確認が必要だから知らせたよ。",
  improvement_proposed: "改善案をまとめたよ。",
  bounded_change_defined: "安全に直せる範囲を決めたよ。",
  approved_change_executed: "承認済みの変更を反映したよ。",
  approved_change_tested: "変更後のテストが終わったよ。",
  approved_change_reverted: "安全のため変更を戻したよ。",
  editorial_cycle_waiting: "次の投稿準備を待っているよ。",
  editorial_draft_ready: "投稿案ができたよ。",
  writer_canary_pending: "投稿案の確認を待っているよ。",
  publication_state: "投稿状況を確認したよ。",
  insights_collected: "投稿の分析結果を集めたよ。",
  safety_state: "安全状態を確認したよ。",
  workflow_checked: "運用の流れを確認したよ。",
};

const SYSTEM_ACTION_AGENT: Record<string, string> = {
  editorial_cycle_waiting: "sashihara-orchestrator",
  editorial_experiment_decided: "sashihara-orchestrator",
  editorial_draft_ready: "sashihara-orchestrator",
  editorial_cycle_approved: "sashihara-orchestrator",
  writer_canary_pending: "sashihara-orchestrator",
  human_approval: "sashihara-orchestrator",
  publication_state: "kiara-executor",
  insights_collected: "mirinya-cost-analyst",
  safety_state: "hana-heartbeat",
  workflow_checked: "hana-heartbeat",
};

const ACTION_DESTINATION: Record<string, string> = {
  source_collected: "/knowledge", provenance_recorded: "/knowledge", research_gap_reported: "/knowledge",
  evidence_validated: "/hypotheses", evidence_rejected: "/hypotheses", evidence_insufficient: "/hypotheses",
  contradiction_detected: "/hypotheses", freshness_checked: "/hypotheses", hypothesis_proposed: "/hypotheses",
  alternative_hypothesis_proposed: "/hypotheses", experiment_variable_selected: "/hypotheses",
  offer_adopted: "/hypotheses", offer_held: "/hypotheses", offer_rejected: "/hypotheses", strategy_selected: "/hypotheses",
  revenue_analyzed: "/costs", conversion_analyzed: "/costs", cost_analyzed: "/costs", margin_analyzed: "/costs",
  unit_economics_analyzed: "/costs", commercial_waste_flagged: "/costs",
  knowledge_versioned: "/knowledge", knowledge_expired: "/knowledge", knowledge_superseded: "/knowledge", knowledge_marked_stale: "/knowledge",
  improvement_proposed: "/improvements", bounded_change_defined: "/improvements", human_gate_requested: "/improvements?tab=pending_review",
  approved_change_executed: "/improvements", approved_change_tested: "/improvements", approved_change_reverted: "/improvements",
  editorial_cycle_waiting: "/operator", editorial_experiment_decided: "/operator", editorial_draft_ready: "/operator",
  editorial_cycle_approved: "/operator", writer_canary_pending: "/operator", human_approval: "/operator",
  publication_state: "/operator", insights_collected: "/operator", safety_state: "/operator",
};

const AGENT_DESTINATION: Record<string, string> = Object.fromEntries(
  Object.entries(AGENT_SPEECH).map(([slug, speech]) => [slug, speech[2]]),
);

function tableExists(db: Database, name: string): boolean {
  return (db.query<{ n: number }, [string]>(
    "SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name=?",
  ).get(name)?.n ?? 0) > 0;
}

function activitySpeech(row: ActivitySpeechRow): string {
  if (row.next_action_owner === "human:approval") {
    return row.action.startsWith("improvement") || row.action === "human_gate_requested"
      ? "改善案の承認待ちだよ。"
      : "投稿の承認待ちだよ。";
  }
  if (row.result_status === "failed") return "作業で問題が出たよ。確認してね。";
  if (row.result_status === "blocked") return "確認が必要で、いったん止まっているよ。";
  if (row.result_status === "pending" || row.decision_status === "pending") return "いま作業を進めているよ。";
  return ACTION_SPEECH[row.action] ?? "最新の運用状況を確認したよ。";
}

function activityDestination(row: ActivitySpeechRow, target: string): string {
  if (row.next_action_owner === "human:approval") {
    return row.action.startsWith("improvement") || row.action === "human_gate_requested"
      ? "/improvements?tab=pending_review"
      : "/operator";
  }
  return ACTION_DESTINATION[row.action] ?? AGENT_DESTINATION[target] ?? "/logs";
}

function issueSpeech(issue: IssueSpeechRow): string {
  if (issue.status === "blocked") return "確認が必要で、いったん止まっているよ。";
  if (issue.type === "content_task" && issue.status === "in_review") return "投稿の承認待ちだよ。";
  return ({
    content_task: "投稿準備を進めているよ。",
    hypothesis_run: "仮説の検証を進めているよ。",
    data_sync: "データを同期しているよ。",
    manual_followup: "確認してほしいことがあるよ。",
    bug: "見つかった問題を確認しているよ。",
    decision: "次の判断を整理しているよ。",
    pilot_review: "試験運用の結果を確認しているよ。",
    control_apply: "承認済みの変更を進めているよ。",
  } as Record<string, string>)[issue.type] ?? "いま担当タスクを進めているよ。";
}

function issueDestination(issue: IssueSpeechRow): string {
  if (issue.type === "hypothesis_run") {
    return issue.status === "in_review" ? "/hypotheses?tab=pending_review" : "/hypotheses?tab=running";
  }
  if (["control_apply", "pilot_review", "bug"].includes(issue.type)) {
    return issue.status === "in_review" ? "/improvements?tab=pending_review" : "/improvements";
  }
  if (["content_task", "data_sync"].includes(issue.type)) return "/operator";
  return "/logs";
}

function loadLiveSpeech(db: Database, agentSlugs: Set<string>): Map<string, SpeechBubble> {
  const speech = new Map<string, SpeechBubble>();
  if (tableExists(db, "issues") && tableExists(db, "agents")) {
    const issues = db.query<IssueSpeechRow, []>(`SELECT a.slug, i.type, i.status
      FROM issues i JOIN agents a ON a.id=i.assignee_agent_id
      WHERE i.status IN ('todo','in_progress','in_review','blocked')
      ORDER BY i.updated_at DESC, i.id DESC`).all();
    for (const issue of issues) if (!speech.has(issue.slug)) speech.set(issue.slug, {
      message: issueSpeech(issue), href: issueDestination(issue),
    });
  }
  if (!tableExists(db, "agent_activity_ledger")) return speech;
  const activities = db.query<ActivitySpeechRow, []>(`SELECT sequence,timestamp,agent_id,action,
      decision_status,result_status,next_action_owner
      FROM agent_activity_ledger ORDER BY sequence DESC LIMIT 100`).all();
  const now = Date.now();
  for (const activity of activities) {
    const target = activity.agent_id && agentSlugs.has(activity.agent_id)
      ? activity.agent_id
      : SYSTEM_ACTION_AGENT[activity.action];
    if (!target || speech.has(target)) continue;
    const age = now - Date.parse(activity.timestamp);
    const needsAttention = activity.decision_status === "pending"
      || ["pending", "blocked", "failed"].includes(activity.result_status);
    const maxAge = needsAttention ? 7 * 86_400_000 : 86_400_000;
    if (!Number.isFinite(age) || age < -300_000 || age > maxAge) continue;
    speech.set(target, { message: activitySpeech(activity), href: activityDestination(activity, target) });
  }
  return speech;
}

function renderAgentCard(agent: AgentBasic, liveSpeech: Map<string, SpeechBubble>, leader = false): string {
  const active = agent.status === "active";
  const role = ROLE_LABEL_JP[agent.slug] || jpRole(agent.role);
  const accent = MEMBER_ACCENT[agent.slug] ?? "#ec4899";
  const [fallbackSpeech, delaySeconds, fallbackHref] = AGENT_SPEECH[agent.slug] ?? ["今日も稼働中です。", 0, "/logs"];
  const speech = liveSpeech.get(agent.slug) ?? { message: fallbackSpeech, href: fallbackHref };
  const speechClass = liveSpeech.has(agent.slug) ? " org-speech-live" : "";
  const avatarUrl = agent.slug === "sashihara-orchestrator" ? "/internal-assets/equal-love-mark.png" : agent.avatar_url;
  return `<a class="org-person${leader ? " org-person-leader" : ""}" href="${escapeHtml(speech.href)}" style="--member-color:${accent};--talk-delay:${delaySeconds}s" aria-label="${escapeHtml(agent.pokemon_jp)}、${escapeHtml(role)}。${escapeHtml(speech.message)} 関連画面を開く" title="${escapeHtml(speech.message)} 関連画面を開く">
    <span class="org-speech${speechClass}" aria-hidden="true"><span>${escapeHtml(speech.message)}</span><b>↗</b></span>
    ${avatarUrl ? `<img src="${escapeHtml(avatarUrl)}" alt="" width="72" height="72">` : `<span class="org-avatar-fallback" aria-hidden="true">${escapeHtml(agent.pokemon_jp.slice(0, 1))}</span>`}
    <span class="org-person-copy">
      <strong>${escapeHtml(agent.pokemon_jp)}</strong>
      <span>${escapeHtml(role)}</span>
      <small class="${active ? "active" : "disabled"}"><i aria-hidden="true"></i>${active ? "稼働中" : "停止中"}</small>
    </span>
  </a>`;
}

export function renderOrgChart(db: Database, agentsList: AgentBasic[]): string {
  if (agentsList.length === 0) return `<div class="section empty">エージェント未登録</div>`;

  const edges = db
    .query<{ supervisor_id: number; subordinate_id: number }, []>(
      `SELECT supervisor_id, subordinate_id FROM agent_edges WHERE edge_type='supervises'`,
    )
    .all();
  const nodes = new Map<number, OrgNode>(agentsList.map((agent) => [agent.id, { ...agent, reports: [] }]));
  const isReport = new Set<number>();
  for (const edge of edges) {
    const supervisor = nodes.get(edge.supervisor_id);
    const report = nodes.get(edge.subordinate_id);
    if (!supervisor || !report) continue;
    supervisor.reports.push(report);
    isReport.add(report.id);
  }

  const roots = agentsList.map((agent) => nodes.get(agent.id)!).filter((agent) => !isReport.has(agent.id));
  const leaders = roots.filter((agent) => agent.reports.length > 0);
  const specialists = roots.filter((agent) => agent.reports.length === 0);
  const activeCount = agentsList.filter((agent) => agent.status === "active").length;
  const liveSpeech = loadLiveSpeech(db, new Set(agentsList.map((agent) => agent.slug)));

  return `<div class="org-board">
    <span class="org-cosmos" aria-hidden="true">
      <i style="--x:5%;--y:15%;--light:#ec4899;--delay:-.8s"></i><i style="--x:17%;--y:31%;--light:#38bdf8;--delay:-2.1s"></i>
      <i style="--x:29%;--y:52%;--light:#a855f7;--delay:-1.4s"></i><i style="--x:41%;--y:74%;--light:#facc15;--delay:-3.2s"></i>
      <i style="--x:53%;--y:21%;--light:#22c55e;--delay:-2.7s"></i><i style="--x:65%;--y:43%;--light:#f97316;--delay:-.3s"></i>
      <i style="--x:77%;--y:67%;--light:#f9a8d4;--delay:-1.8s"></i><i style="--x:90%;--y:87%;--light:#60a5fa;--delay:-3.6s"></i>
      <i style="--x:10%;--y:88%;--light:#c4b5fd;--delay:-2.4s"></i><i style="--x:35%;--y:92%;--light:#38bdf8;--delay:-.5s"></i>
      <i style="--x:60%;--y:83%;--light:#ef4444;--delay:-3s"></i><i style="--x:84%;--y:28%;--light:#22c55e;--delay:-1.1s"></i>
    </span>
    <header class="org-hero">
      <div>
        <span class="org-eyebrow">AI OPERATIONS NETWORK</span>
        <h2>${agentsList.length}人のAI運用チーム</h2>
        <p>判断・実行・検証を、それぞれの専門担当が連携して進めます。</p>
      </div>
      <div class="org-stats" aria-label="チーム状況">
        <span class="org-live"><i aria-hidden="true"></i><strong>${activeCount}<small>/${agentsList.length}</small></strong><em>稼働中</em></span>
        <span><strong>${edges.length}</strong><em>連携</em></span>
        <span><strong>${specialists.length}</strong><em>専門担当</em></span>
      </div>
    </header>
    ${leaders.map((leader) => `<section class="org-team" aria-labelledby="org-team-${leader.id}">
      <h3 id="org-team-${leader.id}"><span>01</span> 運用統括</h3>
      ${renderAgentCard(leader, liveSpeech, true)}
      <div class="org-connector" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="org-core">
        <h3><span>02</span> 判断・実行チーム</h3>
        <div class="org-report-grid" aria-label="判断・実行チーム">${leader.reports.map((agent) => renderAgentCard(agent, liveSpeech)).join("")}</div>
      </div>
    </section>`).join("")}
    ${specialists.length > 0 ? `<section class="org-specialists" aria-labelledby="org-specialists-title">
      <h3 id="org-specialists-title"><span>03</span> 専門ユニット</h3>
      <div class="org-specialist-grid">${specialists.map((agent) => renderAgentCard(agent, liveSpeech)).join("")}</div>
    </section>` : ""}
  </div>
  <p class="muted small org-summary">吹き出し・カードを押すと、関連する運用画面を開きます</p>`;
}
