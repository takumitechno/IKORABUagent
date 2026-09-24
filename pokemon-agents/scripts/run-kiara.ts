#!/usr/bin/env bun
/** Network-free, one-shot approved-patch executor. Dry-run unless --apply is explicit. */
import { Database } from "bun:sqlite";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertImprovementExecutionSchema, executeApprovedImprovement } from "../web/lib/improvement-execution";

const HELP = `Usage:
  bun pokemon-agents/scripts/run-kiara.ts --approval <approval_id> --worktree <linked_worktree> [--run-id <id>] [--correlation-id <id>] [--apply]

Dry-run is the default. --apply applies only the approved bytes in a clean linked
worktree, runs only approved test IDs, and never commits, merges, pushes, schedules,
calls a provider, or targets a repository's main checkout.`;

function value(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  const next = args[index + 1];
  if (!next || next.startsWith("--")) throw new Error(`${flag.slice(2).toUpperCase().replaceAll("-", "_")}_REQUIRED`);
  return next;
}

export function main(args = process.argv.slice(2)): number {
  if (args.includes("--help") || args.includes("-h")) { console.log(HELP); return 0; }
  const allowed = new Set(["--approval", "--worktree", "--run-id", "--correlation-id", "--apply"]);
  for (let index = 0; index < args.length; index += 1) {
    if (!allowed.has(args[index]!)) throw new Error("UNKNOWN_ARGUMENT");
    if (args[index] !== "--apply") index += 1;
  }
  const approvalId = value(args, "--approval");
  const worktree = value(args, "--worktree");
  if (!approvalId) throw new Error("APPROVAL_REQUIRED");
  if (!worktree) throw new Error("WORKTREE_REQUIRED");
  const apply = args.includes("--apply");
  const db = new Database(resolveAgentsDbPath(), { readonly: !apply, strict: true });
  try {
    db.exec("PRAGMA foreign_keys=ON");
    assertImprovementExecutionSchema(db);
    const result = executeApprovedImprovement(db, {
      approvalId, worktree: resolve(worktree), apply,
      runId: value(args, "--run-id") ?? `run:kiara:${randomUUID()}`,
      correlationId: value(args, "--correlation-id") ?? `corr:kiara:${randomUUID()}`,
      at: new Date().toISOString(),
    });
    console.log(JSON.stringify(result));
    return result.verification === "passed" ? 0 : 1;
  } finally { db.close(); }
}

if (import.meta.main) {
  try { process.exitCode = main(); }
  catch (error) {
    console.error(JSON.stringify({ status: "blocked", safe_error_code: error instanceof Error ? error.message : "KIARA_EXECUTION_FAILED" }));
    process.exitCode = 1;
  }
}
