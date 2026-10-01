import { describe, expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { renderOrgChart } from "../web/routes/org";

describe("organization chart", () => {
  test("shows readable Japanese roles without a fixed-width SVG", () => {
    const db = new Database(":memory:");
    db.exec(`CREATE TABLE agent_edges (supervisor_id INTEGER, subordinate_id INTEGER, edge_type TEXT);
      INSERT INTO agent_edges VALUES (1, 2, 'supervises');`);
    const html = renderOrgChart(db, [
      { id: 1, slug: "sashihara-orchestrator", pokemon_jp: "指原", role: "orchestrator", status: "active" },
      { id: 2, slug: "iori-validator", pokemon_jp: "衣織", role: "validator", status: "active" },
    ]);

    expect(html).toContain("運用統括・最終判断");
    expect(html).toContain("根拠・事実の検証");
    expect(html).toContain("2人のAI運用チーム");
    expect(html).toContain("判断・実行チーム");
    expect(html).toContain('class="org-stats"');
    expect(html).toContain("専門担当");
    expect(html).not.toContain("<svg");
  });
});
