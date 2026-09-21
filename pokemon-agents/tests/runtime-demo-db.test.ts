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
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_schedules WHERE enabled=1").get()!.n).toBe(3);
      expect(db.query<{ n: number }, []>("SELECT COUNT(*) n FROM approvals WHERE status='pending'").get()!.n).toBeGreaterThan(0);
      expect(db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get()!.integrity_check).toBe("ok");
      db.close();
    }
  });
});
