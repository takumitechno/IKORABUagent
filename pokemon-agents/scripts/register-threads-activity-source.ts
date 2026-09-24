#!/usr/bin/env bun
/** Explicit, network-free ORG04C account/source administration. */
import { Database } from "bun:sqlite";
import { resolveAgentsDbPath } from "../runtime/db-path";
import {
  ActivityLedgerConflictError,
  assertAgentActivityLedgerSchema,
  registerActivityAccount,
} from "../web/lib/agent-activity-ledger";
import { assertThreadsActivityProjectorSchema } from "../web/lib/threads-activity-projector";
import {
  ThreadsActivityConsumerError,
  assertThreadsActivityConsumerSchema,
  readThreadsActivityProjectionStatus,
  registerThreadsActivityProjectionSource,
  setThreadsActivityProjectionSourceEnabled,
} from "../web/lib/threads-activity-consumer";

const HELP = `Usage:
  bun pokemon-agents/scripts/register-threads-activity-source.ts <command> --account <account_id> [options]

Commands:
  register-account --authority-ref <authority_ref> [--apply]
  register-source  --source-ref <source_ref> [--apply]
  enable-source    [--apply]
  disable-source   [--apply]
  status
  preview          (--from-beginning | --resume)

Mutations are dry-run unless --apply is present. New sources are disabled.
This command never calls Threads Bridge, changes THREADS_ACTIVITY_PROJECTION_ENABLED,
registers a scheduler, or enrolls accounts implicitly.

F4 dependency: live projection remains blocked until the Threads audit feed is
restricted to the projectable event allowlist. Unknown events remain fail-closed.`;

type Command = "register-account" | "register-source" | "enable-source" | "disable-source" | "status" | "preview";

export interface AdminResult {
  readonly status: "dry-run" | "applied" | "ok";
  readonly operation: Command;
  readonly account_id: string;
  readonly enabled?: boolean;
  readonly current_checkpoint?: string | null;
  readonly last_attempted_at?: string | null;
  readonly last_successful_at?: string | null;
  readonly projected_count?: number;
  readonly skipped_duplicate_count?: number;
  readonly last_safe_error_code?: string | null;
  readonly preview_mode?: "from-beginning" | "checkpoint-resume";
  readonly ready?: boolean;
  readonly requirement?: string | null;
}

interface ParsedArgs {
  readonly command: Command;
  readonly account: string;
  readonly authorityRef?: string;
  readonly sourceRef?: string;
  readonly apply: boolean;
  readonly fromBeginning: boolean;
  readonly resume: boolean;
}

function valueAfter(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${flag.toUpperCase().replaceAll("-", "_")}_REQUIRED`);
  return value;
}

export function parseAdminArgs(args: readonly string[]): ParsedArgs {
  const command = args[0] as Command;
  if (!["register-account", "register-source", "enable-source", "disable-source", "status", "preview"].includes(command)) {
    throw new Error("COMMAND_REQUIRED");
  }
  const seen = new Set<string>();
  for (let index = 1; index < args.length; index += 1) {
    const flag = args[index];
    if (!["--account", "--authority-ref", "--source-ref", "--apply", "--from-beginning", "--resume"].includes(flag)) {
      throw new Error("UNKNOWN_ARGUMENT");
    }
    if (seen.has(flag)) throw new Error("DUPLICATE_ARGUMENT");
    seen.add(flag);
    if (["--account", "--authority-ref", "--source-ref"].includes(flag)) index += 1;
  }
  const account = valueAfter(args, "--account");
  if (!account) throw new Error("ACCOUNT_REQUIRED");
  const authorityRef = valueAfter(args, "--authority-ref");
  const sourceRef = valueAfter(args, "--source-ref");
  if (command === "register-account" && !authorityRef) throw new Error("AUTHORITY_REF_REQUIRED");
  if (command === "register-source" && !sourceRef) throw new Error("SOURCE_REF_REQUIRED");
  const fromBeginning = args.includes("--from-beginning");
  const resume = args.includes("--resume");
  if (command === "preview" && fromBeginning === resume) throw new Error("PREVIEW_MODE_REQUIRED");
  return { command, account, authorityRef, sourceRef, apply: args.includes("--apply"), fromBeginning, resume };
}

function statusResult(db: Database, args: ParsedArgs, status: AdminResult["status"]): AdminResult {
  const current = readThreadsActivityProjectionStatus(db, args.account);
  if (!current) throw new Error("SOURCE_NOT_REGISTERED");
  return Object.freeze({ status, operation: args.command, ...current });
}

export function runAdmin(db: Database, args: ParsedArgs): AdminResult {
  assertAgentActivityLedgerSchema(db);
  assertThreadsActivityProjectorSchema(db);
  assertThreadsActivityConsumerSchema(db);

  if (args.command === "status") return statusResult(db, args, "ok");
  if (args.command === "preview") {
    const current = readThreadsActivityProjectionStatus(db, args.account);
    if (!current) throw new Error("SOURCE_NOT_REGISTERED");
    const mode = args.fromBeginning ? "from-beginning" : "checkpoint-resume";
    const ready = current.enabled && (args.fromBeginning ? current.current_checkpoint === null : current.current_checkpoint !== null);
    const requirement = !current.enabled
      ? "SOURCE_MUST_BE_ENABLED"
      : args.fromBeginning && current.current_checkpoint !== null
        ? "CHECKPOINT_ALREADY_EXISTS_USE_RESUME"
        : args.resume && current.current_checkpoint === null
          ? "CHECKPOINT_REQUIRED"
          : null;
    return Object.freeze({
      status: "ok", operation: args.command, account_id: current.account_id, enabled: current.enabled,
      current_checkpoint: current.current_checkpoint, preview_mode: mode, ready, requirement,
    });
  }

  if (!args.apply) {
    return Object.freeze({ status: "dry-run", operation: args.command, account_id: args.account });
  }
  if (args.command === "register-account") {
    registerActivityAccount(db, args.account, args.authorityRef!);
    return Object.freeze({ status: "applied", operation: args.command, account_id: args.account });
  }
  if (args.command === "register-source") {
    registerThreadsActivityProjectionSource(db, args.account, args.sourceRef!);
    return statusResult(db, args, "applied");
  }
  setThreadsActivityProjectionSourceEnabled(db, args.account, args.command === "enable-source");
  return statusResult(db, args, "applied");
}

function safeErrorCode(error: unknown): string {
  if (error instanceof ActivityLedgerConflictError) return "ACCOUNT_CONFLICT";
  if (error instanceof ThreadsActivityConsumerError) return error.code;
  if (error instanceof Error && /^[A-Z][A-Z0-9_]+$/.test(error.message)) return error.message;
  return "ADMIN_UNAVAILABLE";
}

export function main(args = process.argv.slice(2)): number {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return 0;
  }
  let parsed: ParsedArgs;
  try {
    parsed = parseAdminArgs(args);
  } catch (error) {
    console.error(JSON.stringify({ status: "failed", safe_error_code: safeErrorCode(error) }));
    console.error(HELP);
    return 2;
  }
  let db: Database | undefined;
  try {
    db = new Database(resolveAgentsDbPath(), { readonly: !parsed.apply, strict: true });
    db.exec("PRAGMA foreign_keys = ON");
    console.log(JSON.stringify(runAdmin(db, parsed)));
    return 0;
  } catch (error) {
    console.error(JSON.stringify({ status: "failed", safe_error_code: safeErrorCode(error) }));
    return 1;
  } finally {
    db?.close();
  }
}

if (import.meta.main) process.exitCode = main();
