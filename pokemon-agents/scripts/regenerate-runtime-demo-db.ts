#!/usr/bin/env bun
/** Rebuild the disposable dashboard DB without ever touching tracked or production DBs. */
import { Database } from "bun:sqlite";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { migrateAgentActivityLedger } from "../web/lib/agent-activity-ledger";
import { migrateThreadsActivityProjector } from "../web/lib/threads-activity-projector";
import { migrateThreadsActivityConsumer } from "../web/lib/threads-activity-consumer";

const root = resolve(import.meta.dir, "..", "..");
const runtimeRoot = resolve(root, ".runtime");
const defaultTarget = resolve(runtimeRoot, "db", "agents-demo.db");
const outputArgIndex = process.argv.indexOf("--output");
const target = outputArgIndex >= 0
  ? resolve(root, process.argv[outputArgIndex + 1] ?? "")
  : defaultTarget;

function isInside(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return rel !== "" && rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

if (!isInside(runtimeRoot, target) || !target.endsWith(".db")) {
  console.error(`[runtime-db] refused unsafe output outside .runtime: ${target}`);
  process.exit(2);
}

const schemaPath = resolve(root, "pokemon-agents", "db", "schema.sql");
const agentSeedPath = resolve(root, "pokemon-agents", "scripts", "seed-agents-from-md.ts");
const demoSeedPath = resolve(root, "pokemon-agents", "scripts", "seed-demo-data.ts");
const staging = `${target}.building-${process.pid}-${Date.now()}`;
const backup = `${target}.previous-${process.pid}`;
const sidecars = (path: string) => [path, `${path}-wal`, `${path}-shm`, `${path}-journal`];
const removeFiles = (paths: string[]) => {
  for (const path of paths) rmSync(path, { force: true });
};

function runSeeder(script: string): void {
  const result = Bun.spawnSync([process.execPath, script], {
    cwd: root,
    env: { ...process.env, AGENTS_DB_PATH: staging },
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode !== 0) {
    const detail = result.stderr.toString().trim() || result.stdout.toString().trim();
    throw new Error(`${script.split(/[\\/]/).at(-1)} failed${detail ? `: ${detail}` : ""}`);
  }
}

mkdirSync(dirname(target), { recursive: true });
removeFiles([...sidecars(staging), ...sidecars(backup)]);

try {
  const schemaDb = new Database(staging, { create: true });
  try {
    schemaDb.exec("PRAGMA foreign_keys=ON");
    schemaDb.exec(readFileSync(schemaPath, "utf8"));
    migrateAgentActivityLedger(schemaDb);
    migrateThreadsActivityProjector(schemaDb);
    migrateThreadsActivityConsumer(schemaDb);
  } finally {
    schemaDb.close();
  }

  runSeeder(agentSeedPath);
  runSeeder(demoSeedPath);

  const verifyDb = new Database(staging);
  try {
    const scalar = (sql: string): number =>
      Number(Object.values(verifyDb.query<Record<string, unknown>, []>(sql).get() ?? {})[0] ?? 0);
    const integrity = verifyDb.query<{ integrity_check: string }, []>("PRAGMA integrity_check").get();
    const activeAgents = scalar("SELECT COUNT(*) FROM agents WHERE status='active'");
    const edges = scalar("SELECT COUNT(*) FROM agent_edges");
    const schedules = scalar("SELECT COUNT(*) FROM agent_schedules WHERE enabled=1");
    const approvals = scalar("SELECT COUNT(*) FROM approvals WHERE status='pending'");
    if (integrity?.integrity_check !== "ok") throw new Error("SQLite integrity_check failed");
    if (activeAgents !== 11) throw new Error(`expected 11 active agents, found ${activeAgents}`);
    if (edges !== 11) throw new Error(`expected 11 agent edges, found ${edges}`);
    if (schedules !== 3) throw new Error(`expected 3 enabled schedules, found ${schedules}`);
    if (approvals < 1) throw new Error("expected at least one pending demo approval");
    verifyDb.exec("PRAGMA wal_checkpoint(TRUNCATE)");
  } finally {
    verifyDb.close();
  }

  // The complete, validated staging DB is ready before the current runtime DB is moved.
  if (existsSync(target)) renameSync(target, backup);
  try {
    removeFiles([`${target}-wal`, `${target}-shm`, `${target}-journal`]);
    renameSync(staging, target);
  } catch (error) {
    if (!existsSync(target) && existsSync(backup)) renameSync(backup, target);
    throw error;
  }
  removeFiles(sidecars(backup));
  console.log(`[runtime-db] ready: ${relative(root, target).replaceAll("\\", "/")}`);
  console.log("[runtime-db] 11 agents / 11 edges / 3 schedules / approvals ready");
} catch (error) {
  removeFiles(sidecars(staging));
  console.error(`[runtime-db] regeneration failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
