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

function renderAgentCard(agent: AgentBasic, leader = false): string {
  const active = agent.status === "active";
  const role = ROLE_LABEL_JP[agent.slug] || jpRole(agent.role);
  return `<a class="org-person${leader ? " org-person-leader" : ""}" href="/agents" aria-label="${escapeHtml(agent.pokemon_jp)}、${escapeHtml(role)}">
    ${agent.avatar_url ? `<img src="${escapeHtml(agent.avatar_url)}" alt="" width="56" height="56">` : `<span class="org-avatar-fallback" aria-hidden="true">${escapeHtml(agent.pokemon_jp.slice(0, 1))}</span>`}
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

  return `<div class="org-board">
    <header class="org-hero">
      <div>
        <span class="org-eyebrow">AI OPERATIONS NETWORK</span>
        <h2>${agentsList.length}人のAI運用チーム</h2>
        <p>判断・実行・検証を、それぞれの専門担当が連携して進めます。</p>
      </div>
      <div class="org-live"><i aria-hidden="true"></i><strong>${activeCount}</strong><span>稼働中</span></div>
    </header>
    ${leaders.map((leader) => `<section class="org-team" aria-labelledby="org-team-${leader.id}">
      <h3 id="org-team-${leader.id}"><span>01</span> 運用統括</h3>
      ${renderAgentCard(leader, true)}
      <div class="org-connector" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="org-core">
        <h3><span>02</span> 判断・実行チーム</h3>
        <div class="org-report-grid" aria-label="判断・実行チーム">${leader.reports.map((agent) => renderAgentCard(agent)).join("")}</div>
      </div>
    </section>`).join("")}
    ${specialists.length > 0 ? `<section class="org-specialists" aria-labelledby="org-specialists-title">
      <h3 id="org-specialists-title"><span>03</span> 専門ユニット</h3>
      <div class="org-specialist-grid">${specialists.map((agent) => renderAgentCard(agent)).join("")}</div>
    </section>` : ""}
  </div>
  <p class="muted small org-summary">各カードを押すと一覧で詳細を確認できます</p>`;
}
