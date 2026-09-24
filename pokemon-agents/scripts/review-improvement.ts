#!/usr/bin/env bun
/** Human-only proposal review. It writes only an approval/rejection decision. */
import { Database } from "bun:sqlite";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { assertImprovementExecutionSchema, decideImprovementApproval } from "../web/lib/improvement-execution";

const HELP = `Usage:
  bun pokemon-agents/scripts/review-improvement.ts --approval <approval_id> [--approve|--reject] [--reviewer human:<id>] [--apply]

Without --apply this prints the immutable binding only. --apply requires exactly
one decision flag and records that decision; it never invokes Kiara or touches target files.`;
function value(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  const next = args[index + 1];
  if (!next || next.startsWith("--")) throw new Error(`${flag.slice(2).toUpperCase()}_REQUIRED`);
  return next;
}
export function main(args = process.argv.slice(2)): number {
  if (args.includes("--help") || args.includes("-h")) { console.log(HELP); return 0; }
  const allowed = new Set(["--approval", "--approve", "--reject", "--reviewer", "--apply"]);
  for (let index = 0; index < args.length; index += 1) {
    if (!allowed.has(args[index]!)) throw new Error("UNKNOWN_ARGUMENT");
    if (!["--approve", "--reject", "--apply"].includes(args[index]!)) index += 1;
  }
  const approvalId = value(args, "--approval");
  if (!approvalId) throw new Error("APPROVAL_REQUIRED");
  const apply = args.includes("--apply");
  const decisions = [args.includes("--approve"), args.includes("--reject")].filter(Boolean).length;
  if (apply && decisions !== 1) throw new Error("EXACT_DECISION_REQUIRED");
  const db = new Database(resolveAgentsDbPath(), { readonly: !apply, strict: true });
  try {
    assertImprovementExecutionSchema(db);
    if (!apply) {
      const binding = db.query<Record<string, unknown>, [string]>("SELECT * FROM improvement_approval_requests WHERE approval_id=?").get(approvalId);
      if (!binding) throw new Error("APPROVAL_REQUEST_MISSING");
      console.log(JSON.stringify({ status: "dry-run", binding }));
      return 0;
    }
    const result = decideImprovementApproval(db, approvalId, args.includes("--approve") ? "approved" : "rejected",
      value(args, "--reviewer") ?? "human:tom", new Date().toISOString());
    console.log(JSON.stringify({ status: result.decision, approval: result }));
    return 0;
  } finally { db.close(); }
}
if (import.meta.main) {
  try { process.exitCode = main(); }
  catch (error) {
    console.error(JSON.stringify({ status: "blocked", safe_error_code: error instanceof Error ? error.message : "APPROVAL_FAILED" }));
    process.exitCode = 1;
  }
}
