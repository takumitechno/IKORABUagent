import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { CANONICAL_RUNTIME_DB, resolveAgentsDbPath, validateRuntimeDb } from "../runtime/db-path";

const root = resolve(import.meta.dir, "..", "..");
const trackedDemo = resolve(root, ".claude/db/agents-demo.db");
const trackedEmpty = resolve(root, ".claude/db/agents.db");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("runtime DB path guardrails", () => {
  test("canonical default is the ignored runtime DB", () => {
    expect(resolveAgentsDbPath(undefined)).toBe(CANONICAL_RUNTIME_DB);
    expect(CANONICAL_RUNTIME_DB).toBe(resolve(root, ".runtime/db/agents-demo.db"));
  });

  test("rejects both tracked legacy paths without opening or changing them", () => {
    const beforeDemo = sha256(trackedDemo);
    const beforeEmpty = sha256(trackedEmpty);
    for (const legacy of [".claude/db/agents.db", ".claude/db/agents-demo.db", trackedDemo, trackedEmpty]) {
      expect(() => resolveAgentsDbPath(legacy)).toThrow("refused tracked legacy DB");
    }
    expect(sha256(trackedDemo)).toBe(beforeDemo);
    expect(sha256(trackedEmpty)).toBe(beforeEmpty);
  });

  test("normal runtime entrypoints contain no legacy DB fallback", () => {
    const entrypoints = [
      "pokemon-agents/web/server.ts",
      "pokemon-agents/runtime/scheduler.ts",
      "pokemon-agents/scripts/init.sh",
      "pokemon-agents/scripts/run-task.sh",
      "pokemon-agents/scripts/seed-agents-from-md.ts",
      "pokemon-agents/scripts/seed-demo-data.ts",
      ".claude/scripts/notify-discord.sh",
      "scripts/db-maintenance.sh",
      "scripts/get-agent-knowledge.sh",
      "scripts/log-agent-run.sh",
      "scripts/run-agent.sh",
      "scripts/start-reflection.sh",
      "scripts/start-agent-os.ps1",
    ];
    for (const entrypoint of entrypoints) {
      const source = readFileSync(resolve(root, entrypoint), "utf8");
      expect(source).not.toContain(".claude/db/agents.db");
      expect(source).not.toContain(".claude/db/agents-demo.db");
    }
  });

  test("canonical runtime DB passes integrity and seed validation", () => {
    expect(() => validateRuntimeDb(CANONICAL_RUNTIME_DB)).not.toThrow();
  });

  test("corrupt runtime DB fails closed and is not overwritten", () => {
    const dir = resolve(root, ".runtime/tests/demodb02");
    const path = resolve(dir, "corrupt.db");
    mkdirSync(dir, { recursive: true });
    writeFileSync(path, "not a sqlite database");
    const before = sha256(path);
    expect(() => validateRuntimeDb(path)).toThrow("Refusing to overwrite it");
    expect(sha256(path)).toBe(before);
    rmSync(dir, { recursive: true, force: true });
  });
});
