import { Database } from "bun:sqlite";
import { afterEach, describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { approveAgentRevision } from "../web/routes/approvalActions";

const roots: string[] = [];
const hash = (value: string) => createHash("sha256").update(value.replace(/\r\n/g, "\n")).digest("hex");

function fixture(overrides: Record<string, unknown> = {}) {
  const repoRoot = mkdtempSync(resolve(tmpdir(), "ikorabu-approval-"));
  roots.push(repoRoot);
  const target = "agent.md";
  const base = "base instructions\n";
  const proposed = "proposed instructions\n";
  writeFileSync(resolve(repoRoot, target), base);
  const db = new Database(":memory:", { strict: true });
  db.exec(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  const agent = db.query<{ id: number }, [string, string]>(
    `INSERT INTO agents (slug,pokemon_slug,pokemon_jp,display_name,role,department,model,source_md_path,instructions,instructions_hash)
     VALUES ('kiara-executor','kiara','樹愛羅','樹愛羅','executor','self-improvement','sonnet',?,'stored',?) RETURNING id`,
  ).get(target, hash(base))!;
  const body = JSON.stringify({
    target,
    base_instructions_hash: hash(base),
    proposed_artifact_hash: hash(proposed),
    new_instructions: proposed,
    ...overrides,
  });
  const approval = db.query<{ id: number }, [number, string]>(
    `INSERT INTO approvals (entity_type,entity_id,title,body,diff_text,status,data_origin)
     VALUES ('agent_revision',?,'bounded revision',?,'one bounded diff','pending','production') RETURNING id`,
  ).get(agent.id, body)!;
  return { db, repoRoot, target, base, proposed, approvalId: approval.id };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("Kiara approval boundary", () => {
  test("matching hash records approval and binding without mutating target or agent", () => {
    const f = fixture();
    const before = readFileSync(resolve(f.repoRoot, f.target));
    expect(approveAgentRevision(f.db, f.approvalId, f.repoRoot)).toEqual({ ok: true });
    expect(readFileSync(resolve(f.repoRoot, f.target))).toEqual(before);
    const approval = f.db.query<{ status: string; applied_at: string | null; diff_text: string }, []>(
      "SELECT status,applied_at,diff_text FROM approvals",
    ).get()!;
    expect(approval.status).toBe("approved");
    expect(approval.applied_at).toBeNull();
    expect(JSON.parse(approval.diff_text)).toMatchObject({
      schema_version: 1, target: f.target,
      base_instructions_hash: hash(f.base), proposed_artifact_hash: hash(f.proposed),
    });
    expect(f.db.query<{ n: number }, []>("SELECT COUNT(*) n FROM agent_revisions").get()!.n).toBe(0);
    expect(f.db.query<{ instructions: string; version: number }, []>("SELECT instructions,version FROM agents").get())
      .toEqual({ instructions: "stored", version: 1 });
    f.db.close();
  });

  test("exact approval replay is idempotent", () => {
    const f = fixture();
    expect(approveAgentRevision(f.db, f.approvalId, f.repoRoot)).toEqual({ ok: true });
    const first = f.db.query<{ diff_text: string; reviewed_at: string }, []>("SELECT diff_text,reviewed_at FROM approvals").get()!;
    expect(approveAgentRevision(f.db, f.approvalId, f.repoRoot)).toEqual({ ok: true });
    expect(f.db.query<{ diff_text: string; reviewed_at: string }, []>("SELECT diff_text,reviewed_at FROM approvals").get()).toEqual(first);
    f.db.close();
  });

  test("stale base hash rejects and leaves target pending", () => {
    const f = fixture({ base_instructions_hash: "0".repeat(64) });
    expect(approveAgentRevision(f.db, f.approvalId, f.repoRoot)).toEqual({ ok: false, error: "agent_revision base hash is stale" });
    expect(readFileSync(resolve(f.repoRoot, f.target), "utf8")).toBe(f.base);
    expect(f.db.query<{ status: string }, []>("SELECT status FROM approvals").get()!.status).toBe("pending");
    f.db.close();
  });

  test("changed target, base, or artifact conflicts after approval", () => {
    for (const changed of [
      { target: "other.md" },
      { base_instructions_hash: "1".repeat(64) },
      { proposed_artifact_hash: hash("different"), new_instructions: "different" },
    ]) {
      const f = fixture();
      expect(approveAgentRevision(f.db, f.approvalId, f.repoRoot).ok).toBe(true);
      const body = JSON.parse(f.db.query<{ body: string }, []>("SELECT body FROM approvals").get()!.body);
      f.db.query("UPDATE approvals SET body=?").run(JSON.stringify({ ...body, ...changed }));
      expect(approveAgentRevision(f.db, f.approvalId, f.repoRoot)).toEqual({
        ok: false, error: "agent_revision approval binding conflict",
      });
      expect(readFileSync(resolve(f.repoRoot, f.target), "utf8")).toBe(f.base);
      f.db.close();
    }
  });

  test("approval route contains no target mutation path", () => {
    const source = readFileSync(new URL("../web/routes/approvalActions.ts", import.meta.url), "utf8");
    expect(source).not.toContain("writeFileSync");
    expect(source).not.toContain("INSERT INTO agent_revisions");
    expect(source).not.toContain("UPDATE agents SET instructions");
  });
});
