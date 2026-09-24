import { Database } from "bun:sqlite";
import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import {
  main,
  parseAdminArgs,
  runAdmin,
} from "../scripts/register-threads-activity-source";
import { migrateAgentActivityLedger } from "../web/lib/agent-activity-ledger";
import { migrateThreadsActivityConsumer } from "../web/lib/threads-activity-consumer";
import { migrateThreadsActivityProjector } from "../web/lib/threads-activity-projector";

const root = resolve(import.meta.dir, "..", "..");
const temporary: string[] = [];
afterEach(() => {
  for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true });
});

function db(): Database {
  const database = new Database(":memory:", { strict: true });
  database.exec("PRAGMA foreign_keys = ON");
  migrateAgentActivityLedger(database);
  migrateThreadsActivityProjector(database);
  migrateThreadsActivityConsumer(database);
  return database;
}

function run(database: Database, ...args: string[]) {
  return runAdmin(database, parseAdminArgs(args));
}

describe("ORG04C activity projection admin controls", () => {
  test("dry-run performs zero writes and apply is explicit", () => {
    const database = db();
    expect(run(database, "register-account", "--account", "acct_test", "--authority-ref", "source:authority"))
      .toMatchObject({ status: "dry-run", operation: "register-account" });
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_accounts").get()!.n).toBe(0);
    expect(() => parseAdminArgs(["enable-source", "--account", "acct_test", "--unknown"]))
      .toThrow("UNKNOWN_ARGUMENT");
    expect(() => parseAdminArgs(["enable-source", "--account", "acct_test", "--account", "acct_other"]))
      .toThrow("DUPLICATE_ARGUMENT");
    database.close();
  });

  test("account registration succeeds, repeats idempotently, and rejects authority conflicts", () => {
    const database = db();
    expect(run(database, "register-account", "--account", "acct_test", "--authority-ref", "source:authority", "--apply").status)
      .toBe("applied");
    expect(() => run(database, "register-account", "--account", "acct_test", "--authority-ref", "source:authority", "--apply"))
      .not.toThrow();
    expect(() => run(database, "register-account", "--account", "acct_test", "--authority-ref", "source:other", "--apply"))
      .toThrow("different authority");
    expect(database.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_accounts").get()!.n).toBe(1);
    database.close();
  });

  test("source registration is separate, disabled by default, idempotent, and conflict-safe", () => {
    const database = db();
    expect(() => run(database, "register-source", "--account", "acct_missing", "--source-ref", "source:audit", "--apply"))
      .toThrow();
    run(database, "register-account", "--account", "acct_test", "--authority-ref", "source:authority", "--apply");
    expect(run(database, "register-source", "--account", "acct_test", "--source-ref", "source:audit", "--apply"))
      .toMatchObject({ status: "applied", enabled: false, current_checkpoint: null });
    expect(() => run(database, "register-source", "--account", "acct_test", "--source-ref", "source:audit", "--apply"))
      .not.toThrow();
    expect(() => run(database, "register-source", "--account", "acct_test", "--source-ref", "source:other", "--apply"))
      .toThrow();
    database.close();
  });

  test("enable requires a source and disable is idempotent", () => {
    const database = db();
    run(database, "register-account", "--account", "acct_test", "--authority-ref", "source:authority", "--apply");
    expect(() => run(database, "enable-source", "--account", "acct_test", "--apply")).toThrow();
    run(database, "register-source", "--account", "acct_test", "--source-ref", "source:audit", "--apply");
    expect(run(database, "enable-source", "--account", "acct_test", "--apply").enabled).toBe(true);
    expect(run(database, "disable-source", "--account", "acct_test", "--apply").enabled).toBe(false);
    expect(run(database, "disable-source", "--account", "acct_test", "--apply").enabled).toBe(false);
    database.close();
  });

  test("status is sanitized and preview is local-only with explicit cursor mode", () => {
    const database = db();
    run(database, "register-account", "--account", "acct_test", "--authority-ref", "source:secret-authority", "--apply");
    run(database, "register-source", "--account", "acct_test", "--source-ref", "source:secret-source", "--apply");
    const status = run(database, "status", "--account", "acct_test");
    expect(status).toEqual({
      status: "ok", operation: "status", account_id: "acct_test", enabled: false,
      last_attempted_at: null, last_successful_at: null, current_checkpoint: null,
      projected_count: 0, skipped_duplicate_count: 0, last_safe_error_code: null,
    });
    expect(JSON.stringify(status)).not.toContain("secret");
    expect(run(database, "preview", "--account", "acct_test", "--from-beginning"))
      .toMatchObject({ ready: false, requirement: "SOURCE_MUST_BE_ENABLED", preview_mode: "from-beginning" });
    expect(() => parseAdminArgs(["preview", "--account", "acct_test"])).toThrow("PREVIEW_MODE_REQUIRED");
    database.close();
  });

  test("script has no Bridge request path, scheduler, global flag write, or customer changes", () => {
    const script = readFileSync(resolve(root, "pokemon-agents/scripts/register-threads-activity-source.ts"), "utf8");
    expect(script).not.toMatch(/\bfetch\s*\(|setInterval|Bun\.spawn|process\.env\s*\[|process\.env\.THREADS_ACTIVITY_PROJECTION_ENABLED\s*=/);
    expect(script).toContain("Unknown events remain fail-closed");
    for (const customerSource of [
      "pokemon-agents/web/routes/overview.ts",
      "pokemon-agents/web/routes/improvement-report.ts",
      "pokemon-agents/web/lib/customer-workspaces.ts",
    ]) {
      expect(readFileSync(resolve(root, customerSource), "utf8")).not.toContain("register-threads-activity-source");
    }
  });

  test("CLI defaults to read-only dry-run against an isolated DB", () => {
    const directory = mkdtempSync(resolve(tmpdir(), "org04c-"));
    temporary.push(directory);
    const path = resolve(directory, "test.db");
    const database = new Database(path, { strict: true });
    migrateAgentActivityLedger(database);
    migrateThreadsActivityProjector(database);
    migrateThreadsActivityConsumer(database);
    database.close();
    const previousPath = process.env.AGENTS_DB_PATH;
    const previousFlag = process.env.THREADS_ACTIVITY_PROJECTION_ENABLED;
    const output: string[] = [];
    const originalLog = console.log;
    process.env.AGENTS_DB_PATH = path;
    process.env.THREADS_ACTIVITY_PROJECTION_ENABLED = "sentinel";
    console.log = (value?: unknown) => { output.push(String(value)); };
    try {
      expect(main(["register-account", "--account", "acct_test", "--authority-ref", "source:authority"])).toBe(0);
      expect(JSON.parse(output[0])).toMatchObject({ status: "dry-run" });
      expect(process.env.THREADS_ACTIVITY_PROJECTION_ENABLED).toBe("sentinel");
    } finally {
      console.log = originalLog;
      if (previousPath === undefined) delete process.env.AGENTS_DB_PATH;
      else process.env.AGENTS_DB_PATH = previousPath;
      if (previousFlag === undefined) delete process.env.THREADS_ACTIVITY_PROJECTION_ENABLED;
      else process.env.THREADS_ACTIVITY_PROJECTION_ENABLED = previousFlag;
    }
    const readback = new Database(path, { readonly: true, strict: true });
    expect(readback.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_activity_accounts").get()!.n).toBe(0);
    readback.close();
  });
});
