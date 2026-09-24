import { Database } from "bun:sqlite";
import { afterAll, describe, expect, test } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..", "..");
const outputRelative = ".runtime/tests/demodb01/agents-demo.db";
const output = resolve(root, outputRelative);
const generator = resolve(root, "pokemon-agents/scripts/regenerate-runtime-demo-db.ts");

afterAll(() => rmSync(resolve(root, ".runtime/tests/demodb01"), { recursive: true, force: true }));

describe("runtime demo DB regeneration", () => {
  test("rejects tracked DB output", () => {
    const result = Bun.spawnSync([
      process.execPath,
      generator,
      "--output",
      ".claude/db/agents-demo.db",
    ], { cwd: root, stdout: "pipe", stderr: "pipe" });
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("refused unsafe output outside .runtime");
  });

  test("builds a complete DB from source assets and can rebuild it", () => {
    for (let run = 0; run < 2; run++) {
      const result = Bun.spawnSync([
        process.execPath,
        generator,
        "--output",
        outputRelative,
      ], { cwd: root, stdout: "pipe", stderr: "pipe" });
      expect(result.stderr.toString()).toBe("");
      expect(result.exitCode).toBe(0);
      expect(existsSync(output)).toBe(true);

      const db = new Database(output, { readonly: true });
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agents WHERE status='active'").get()!.n).toBe(11);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_edges").get()!.n).toBe(11);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_schedules WHERE data_origin='demo' AND enabled=1").get()!.n).toBe(3);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM approvals WHERE data_origin='demo' AND status='pending'").get()!.n).toBeGreaterThan(0);
      for (const table of ["hypotheses", "improvements", "approvals", "agent_costs", "agent_schedules", "daily_reports"]) {
        expect(db.query<{ n: number }, []>(`SELECT COUNT(*) n FROM ${table} WHERE data_origin<>'demo'`).get()!.n).toBe(0);
      }
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name='agent_activity_ledger'").get()!.n).toBe(1);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='trigger' AND name IN ('agent_activity_ledger_no_update','agent_activity_ledger_no_delete','agent_activity_ledger_no_duplicate_insert','agent_activity_actor_canonical','agent_activity_message_codes','agent_activity_action_codes','agent_activity_payload_sanitized')").get()!.n).toBe(7);
      expect(db.query<{ n: number }, [string, string, string]>("SELECT COUNT(*) n FROM schema_migrations WHERE version IN (?,?,?)").get("20260924_agent_activity_ledger_v1", "20260924_agent_activity_ledger_v2_message_codes", "20260924_agent_activity_ledger_v3_role_codes")!.n).toBe(3);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name='threads_activity_projector_checkpoints'").get()!.n).toBe(1);
      expect(db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM schema_migrations WHERE version=?").get("20260924_threads_activity_projector_v1")!.n).toBe(1);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM threads_activity_projector_checkpoints").get()!.n).toBe(0);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name='threads_activity_projection_sources'").get()!.n).toBe(1);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM threads_activity_projection_sources").get()!.n).toBe(0);
      expect(db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get()!.integrity_check).toBe("ok");
      db.close();
    }
  });
});
