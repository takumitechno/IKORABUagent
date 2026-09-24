#!/usr/bin/env bun
/** Seed a safe, compact =LOVE Agent OS dashboard demo. */
import { Database } from "bun:sqlite";
import { clearDemoProvenanceRows } from "../web/lib/data-provenance";
import { resolve } from "node:path";
import { resolveAgentsDbPath } from "../runtime/db-path";

const root = resolve(import.meta.dir, "..", "..");
const dbPath = resolveAgentsDbPath();
const force = process.argv.includes("--force");
const clearOnly = process.argv.includes("--clear");
const db = new Database(dbPath);
db.run("PRAGMA foreign_keys=ON");

function stamp(daysAgo = 0, hour = 3): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

const ids = new Map(
  db.query<{ slug: string; id: number }, []>("SELECT slug, id FROM agents WHERE status='active'")
    .all().map((row) => [row.slug, row.id]),
);
const id = (slug: string) => ids.get(slug) ?? null;
const nonDemo = db.query<{ n: number }, []>(
  "SELECT COUNT(*) n FROM reflections WHERE session_id IS NULL OR session_id NOT LIKE 'demo-%'",
).get()!.n;

if (!clearOnly && nonDemo > 0 && !force) {
  console.error(`[demo] 実運用reflection ${nonDemo}件を検出したため中止しました。`);
  process.exit(1);
}

function clearDemo(): void {
  db.run("DELETE FROM logs WHERE session_id LIKE 'demo-%'");
  db.run("DELETE FROM reflections WHERE session_id LIKE 'demo-%'");
  clearDemoProvenanceRows(db);
}

clearDemo();
if (clearOnly) {
  console.log("[demo] demo rows cleared");
  db.close();
  process.exit(0);
}

let reflections = 0;
db.transaction(() => {
  for (const [slug, cron] of [
    ["sashihara-orchestrator", "0 2 * * *"],
    ["anna-supervisor", "0 5 * * *"],
    ["sanatsun-knowledge-editor", "0 3 * * 1"],
  ]) {
    db.run(
      `INSERT INTO agent_schedules
       (agent_id, trigger_type, cron_expr, enabled, next_run_at, created_at, updated_at, data_origin)
       VALUES (?, 'timer', ?, 1, ?, ?, ?, 'demo')`,
      [id(slug), cron, stamp(-1), stamp(14), stamp()],
    );
  }

  const addReflection = (slug: string, parent: number | null, result: string, hour: number): number => {
    const row = db.query<{ id: number }, any[]>(
      `INSERT INTO reflections
       (agent_id, agent_slug, trigger, parent_run_id, status, started_at, ended_at,
        duration_ms, tokens_in, tokens_out, cost_usd, session_id, work_dir,
        quality_score, result_full, what_done, quality_check, reflected_at, created_at, updated_at)
       VALUES (?, ?, 'launchd', ?, 'completed', ?, ?, 120000, 3200, 800, 0.04,
               ?, '/demo', 90, ?, ?, '✅ boundary / provenance / handoff', ?, ?, ?)
       RETURNING id`,
    ).get(id(slug), slug, parent, stamp(0, hour), stamp(0, hour), `demo-${slug}`, result,
      result, stamp(0, hour), stamp(0, hour), stamp(0, hour))!;
    reflections++;
    return row.id;
  };

  const normal = addReflection("sashihara-orchestrator", null, "通常運用を開始し、Evidence検証へhandoff", 2);
  const validated = addReflection("iori-validator", normal, "期間・出典・欠損を確認しEvidenceを確定", 2);
  const hypothesized = addReflection("maika-hypothesizer", validated, "反証可能な仮説と測定条件を作成", 3);
  addReflection("hitomi-selector", hypothesized, "リスクと価値を比較し採用候補を決定", 3);
  const improvement = addReflection("anna-supervisor", null, "改善候補を監査しauto_apply候補を承認待ちへ", 5);
  addReflection("kiara-executor", improvement, "承認済み改善を隔離環境でtestしapply可能と報告", 5);
  addReflection("sanatsun-knowledge-editor", null, "ブランド規則の期限と出典を週次確認", 3);

  db.run(
    `INSERT INTO hypotheses
     (title, proposal, rationale, expected_impact, verification_method,
      verification_period_days, status, priority, executor_agent, started_at, created_at, updated_at, data_origin)
     VALUES (?, ?, ?, ?, ?, 7, 'running', 2, ?, ?, ?, ?, 'demo')`,
    ["投稿時間帯の検証", "同一content roleで時間帯を比較する", "検証済みEvidenceに差がある",
      "保存率の方向性を判定", "同条件で7日比較", "approved-capability", stamp(), stamp(), stamp()],
  );
  db.run(
    `INSERT INTO improvements
     (title, proposal, rationale, expected_impact, verification_method, status, priority,
      target_agent, executor_agent, started_at, created_at, updated_at, data_origin)
     VALUES (?, ?, ?, ?, ?, 'pending_review', 2, ?, ?, ?, ?, ?, 'demo')`,
    ["handoff形式の統一", "Evidenceと未確実性を必須項目にする", "監査で欠落を検出",
      "判断追跡性の向上", "fixtureで必須項目を検証", "sashihara-orchestrator",
      "kiara-executor", stamp(), stamp(), stamp()],
  );
  db.run(
    `INSERT INTO approvals
     (entity_type, entity_id, title, body, requested_by_agent_id, status, expires_at, created_at, updated_at, data_origin)
     VALUES ('control_apply', 1, ?, ?, ?, 'pending', ?, ?, ?, 'demo')`,
    ["handoff形式の改善承認", "樹愛羅は承認前に実行しない", id("anna-supervisor"), stamp(-7), stamp(), stamp()],
  );

  for (const slug of ids.keys()) {
    db.run(
      `INSERT INTO agent_costs (agent, cost_usd, input_tokens, output_tokens, duration_ms, num_turns, created_at, data_origin)
       VALUES (?, ?, 2400, 600, 90000, 3, ?, 'demo')`,
      [slug, slug === "sashihara-orchestrator" || slug === "anna-supervisor" ? 0.08 : 0.03, stamp()],
    );
  }
  db.run(
    `INSERT INTO daily_reports
     (date, summary_md, prompt_count, event_count, reflection_count, cost_usd, unknown_cost_count, agents_used, created_at, data_origin)
     VALUES (date('now','localtime'), ?, 1, 18, ?, 0.38, 0, ?, ?, 'demo')`,
    ["# Control Plane 日報\n\n通常運用と自己改善のhandoffは安全境界内で完了。",
      reflections, JSON.stringify([...ids.keys()]), stamp()],
  );
})();

console.log(`[demo] ${ids.size} agents / ${reflections} reflections / 3 schedules`);
console.log(`[demo] DB: ${dbPath}`);
db.close();
