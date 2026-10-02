import { describe, expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { renderOrgChart } from "../web/routes/org";

describe("organization chart", () => {
  test("shows readable Japanese roles without a fixed-width SVG", () => {
    const db = new Database(":memory:");
    db.exec(`CREATE TABLE agent_edges (supervisor_id INTEGER, subordinate_id INTEGER, edge_type TEXT);
      INSERT INTO agent_edges VALUES (1, 2, 'supervises');
      CREATE TABLE agent_activity_ledger (
        sequence INTEGER PRIMARY KEY, timestamp TEXT, agent_id TEXT, action TEXT,
        decision_status TEXT, result_status TEXT, next_action_owner TEXT
      );`);
    const now = new Date().toISOString();
    db.query(`INSERT INTO agent_activity_ledger VALUES (1,?,?,?,?,?,?)`).run(
      now, "iori-validator", "evidence_validated", "approved", "succeeded", null,
    );
    db.query(`INSERT INTO agent_activity_ledger VALUES (2,?,?,?,?,?,?)`).run(
      now, null, "editorial_draft_ready", "pending", "succeeded", "human:approval",
    );
    const html = renderOrgChart(db, [
      { id: 1, slug: "sashihara-orchestrator", pokemon_jp: "指原", role: "orchestrator", status: "active" },
      { id: 2, slug: "iori-validator", pokemon_jp: "衣織", role: "validator", status: "active" },
      { id: 3, slug: "anna-supervisor", pokemon_jp: "杏奈", role: "supervisor", status: "active" },
    ]);

    expect(html).toContain("運用統括・最終判断");
    expect(html).toContain("根拠・事実の検証");
    expect(html).toContain("3人のAI運用チーム");
    expect(html).toContain("判断・実行チーム");
    expect(html).toContain('class="org-stats"');
    expect(html).toContain("専門担当");
    expect(html).toContain('--member-color:#a855f7');
    expect(html).toContain('src="/internal-assets/equal-love-mark.png"');
    expect(html).toContain('class="org-speech org-speech-live"');
    expect(html).toContain("投稿の承認待ちだよ。");
    expect(html).toContain("根拠の確認が終わったよ。");
    expect(html).toContain("次の改善案、見つけたよ。");
    expect(html).toMatch(/href="\/operator"[^>]+aria-label="指原/);
    expect(html).toMatch(/href="\/hypotheses"[^>]+aria-label="衣織/);
    expect(html).toMatch(/href="\/improvements"[^>]+aria-label="杏奈/);
    expect(html).not.toContain("ブランドカラー");
    expect(html).not.toContain(">紫<");
    expect(html).not.toContain("<svg");
  });
});
