import { Database } from "bun:sqlite";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const CANONICAL_RUNTIME_DB = resolve(REPO_ROOT, ".runtime", "db", "agents-demo.db");
const LEGACY_DB_PATHS = new Set([
  resolve(REPO_ROOT, ".claude", "db", "agents.db"),
  resolve(REPO_ROOT, ".claude", "db", "agents-demo.db"),
]);

function normalized(path: string): string {
  return resolve(path).toLowerCase();
}

export function resolveAgentsDbPath(value = process.env.AGENTS_DB_PATH): string {
  const path = resolve(REPO_ROOT, value || CANONICAL_RUNTIME_DB);
  if ([...LEGACY_DB_PATHS].some((legacy) => normalized(legacy) === normalized(path))) {
    throw new Error(`[runtime-db] refused tracked legacy DB: ${path}. Use .runtime/db/agents-demo.db.`);
  }
  return path;
}

export function validateRuntimeDb(path: string): void {
  if (!existsSync(path)) throw new Error(`[runtime-db] missing: ${path}`);
  let db: Database | undefined;
  try {
    db = new Database(path, { readonly: true, strict: true });
    const integrity = db.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get();
    if (integrity?.integrity_check !== "ok") throw new Error("integrity_check failed");
    const tables = db.query<{ n: number }, []>(
      "SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name IN ('agents','agent_edges','agent_schedules','approvals')",
    ).get()?.n ?? 0;
    if (tables !== 4) throw new Error("required schema is incomplete");
    const agents = db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agents WHERE status='active'").get()?.n ?? 0;
    if (agents !== 11) throw new Error(`expected 11 active agents, found ${agents}`);
  } catch (error) {
    throw new Error(
      `[runtime-db] invalid or corrupt DB: ${path}. Refusing to overwrite it. ` +
      `Move it aside and run bun pokemon-agents/scripts/regenerate-runtime-demo-db.ts explicitly. ` +
      `(${error instanceof Error ? error.message : String(error)})`,
    );
  } finally {
    db?.close();
  }
}

export function ensureRuntimeDb(path = resolveAgentsDbPath()): string {
  if (!existsSync(path)) {
    if (normalized(path) !== normalized(CANONICAL_RUNTIME_DB)) {
      throw new Error(`[runtime-db] configured DB does not exist: ${path}`);
    }
    const generator = resolve(REPO_ROOT, "pokemon-agents", "scripts", "regenerate-runtime-demo-db.ts");
    const result = Bun.spawnSync([process.execPath, generator], {
      cwd: REPO_ROOT,
      stdout: "inherit",
      stderr: "inherit",
    });
    if (result.exitCode !== 0) throw new Error("[runtime-db] automatic generation failed");
  }
  validateRuntimeDb(path);
  return path;
}
