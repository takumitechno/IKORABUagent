/**
 * POST /api/approve  /  POST /api/reject
 * agent_revision は承認記録だけを行う。承認と実行は別境界。
 * reject は status='rejected' にするだけ
 */

import type { Database } from "bun:sqlite";
import { readFileSync } from "fs";
import { isAbsolute, relative, resolve } from "path";
import { createHash } from "crypto";

const REVIEWER = "human:tom";
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const REPO_ROOT = resolve(import.meta.dir, "../../..");

interface AgentRevisionProposal {
  target: string;
  base_instructions_hash: string;
  proposed_artifact_hash: string;
  new_instructions: string;
}

interface AgentRevisionBinding {
  schema_version: 1;
  entity_id: number;
  target: string;
  base_instructions_hash: string;
  proposed_artifact_hash: string;
  proposed_diff_hash: string;
  request_body_hash: string;
}

type ApprovalResult = { ok: boolean; error?: string };

const canonicalHash = (value: string): string =>
  createHash("sha256").update(value.replace(/\r\n/g, "\n")).digest("hex");
const exactHash = (value: string): string => createHash("sha256").update(value).digest("hex");

function parseAgentRevisionProposal(body: string | null): AgentRevisionProposal {
  let value: unknown;
  try {
    value = JSON.parse(body || "");
  } catch {
    throw new Error("agent_revision proposal is invalid");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("agent_revision proposal is invalid");
  const proposal = value as Record<string, unknown>;
  const allowed = ["target", "base_instructions_hash", "proposed_artifact_hash", "new_instructions"];
  if (Object.keys(proposal).sort().join() !== [...allowed].sort().join()
    || typeof proposal.target !== "string" || !proposal.target
    || typeof proposal.base_instructions_hash !== "string" || !HASH_PATTERN.test(proposal.base_instructions_hash)
    || typeof proposal.proposed_artifact_hash !== "string" || !HASH_PATTERN.test(proposal.proposed_artifact_hash)
    || typeof proposal.new_instructions !== "string" || !proposal.new_instructions) {
    throw new Error("agent_revision proposal is invalid");
  }
  if (canonicalHash(proposal.new_instructions) !== proposal.proposed_artifact_hash) {
    throw new Error("agent_revision artifact hash mismatch");
  }
  return proposal as unknown as AgentRevisionProposal;
}

function parseBinding(value: string | null): AgentRevisionBinding {
  try {
    const binding = JSON.parse(value || "") as AgentRevisionBinding;
    if (binding.schema_version !== 1 || !Number.isSafeInteger(binding.entity_id) || binding.entity_id <= 0 || !binding.target
      || !HASH_PATTERN.test(binding.base_instructions_hash)
      || !HASH_PATTERN.test(binding.proposed_artifact_hash)
      || !HASH_PATTERN.test(binding.proposed_diff_hash)
      || !HASH_PATTERN.test(binding.request_body_hash)) throw new Error();
    return binding;
  } catch {
    throw new Error("agent_revision approval binding conflict");
  }
}

export function approveAgentRevision(
  db: Database, approvalId: number, repoRoot = REPO_ROOT,
): ApprovalResult {
  const approval = db.query<{
    id: number; entity_id: number; body: string | null; diff_text: string | null; status: string;
  }, [number]>(`SELECT id, entity_id, body, diff_text, status FROM approvals
    WHERE id=? AND entity_type='agent_revision' AND data_origin='production'
      AND status IN ('pending','approved')`).get(approvalId);
  if (!approval) return { ok: false, error: "approval not found or already processed" };

  try {
    const proposal = parseAgentRevisionProposal(approval.body);
    const binding: AgentRevisionBinding = {
      schema_version: 1,
      entity_id: approval.entity_id,
      target: proposal.target,
      base_instructions_hash: proposal.base_instructions_hash,
      proposed_artifact_hash: proposal.proposed_artifact_hash,
      proposed_diff_hash: exactHash(approval.status === "approved" ? "" : approval.diff_text || ""),
      request_body_hash: exactHash(approval.body || ""),
    };
    if (approval.status === "approved") {
      const stored = parseBinding(approval.diff_text);
      binding.proposed_diff_hash = stored.proposed_diff_hash;
      return JSON.stringify(stored) === JSON.stringify(binding)
        ? { ok: true }
        : { ok: false, error: "agent_revision approval binding conflict" };
    }

    const agent = db.query<{
      source_md_path: string; instructions_hash: string;
    }, [number]>("SELECT source_md_path, instructions_hash FROM agents WHERE id=?").get(approval.entity_id);
    if (!agent || proposal.target !== agent.source_md_path) {
      return { ok: false, error: "agent_revision target is invalid" };
    }
    const targetPath = resolve(repoRoot, agent.source_md_path);
    const pathWithinRepo = relative(resolve(repoRoot), targetPath);
    if (pathWithinRepo.startsWith("..") || isAbsolute(pathWithinRepo)) {
      return { ok: false, error: "agent_revision target is invalid" };
    }
    const currentHash = canonicalHash(readFileSync(targetPath, "utf8"));
    if (currentHash !== proposal.base_instructions_hash || agent.instructions_hash !== proposal.base_instructions_hash) {
      return { ok: false, error: "agent_revision base hash is stale" };
    }
    const write = db.run(
      `UPDATE approvals SET status='approved', reviewed_by=?, reviewed_at=datetime('now','localtime'),
         diff_text=?, updated_at=datetime('now','localtime')
       WHERE id=? AND data_origin='production' AND status='pending'`,
      [REVIEWER, JSON.stringify(binding), approval.id],
    );
    return write.changes === 1
      ? { ok: true }
      : { ok: false, error: "agent_revision approval conflict" };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function renderApprovalActions(
  db: Database,
  pathname: string,
  formData: FormData,
): Promise<Response> {
  const idStr = formData.get("id");
  if (typeof idStr !== "string") {
    return badRequest("missing id");
  }
  const id = Number(idStr);
  if (!Number.isFinite(id) || id <= 0) {
    return badRequest("invalid id");
  }

  let result: { ok: boolean; error?: string };
  if (pathname === "/api/approve") {
    result = approveAndApply(db, id);
  } else if (pathname === "/api/reject") {
    result = reject(db, id);
  } else {
    return new Response("Not Found", { status: 404 });
  }

  const action = pathname === "/api/approve" ? "approved" : "rejected";
  const flash = result.ok
    ? `ok:${id}:${action}`
    : `err:${id}:${result.error || "unknown"}`;
  const target = `/improvements?flash=${encodeURIComponent(flash)}`;
  return new Response(null, {
    status: 303,
    headers: { Location: target },
  });
}

function approveAndApply(db: Database, approvalId: number): ApprovalResult {
  const approval = db
    .query<
      {
        id: number;
        entity_type: string;
        entity_id: number;
        diff_text: string | null;
        body: string | null;
      },
      [number]
    >(`SELECT id, entity_type, entity_id, diff_text, body FROM approvals WHERE id=? AND data_origin='production'
        AND (status='pending' OR (entity_type='agent_revision' AND status='approved'))`)
    .get(approvalId);

  if (!approval) return { ok: false, error: "approval not found or already processed" };

  try {
    if (approval.entity_type === "budget_increase") {
      const parsed = JSON.parse(approval.body || "{}") as { period?: string; new_budget_cents?: number };
      if (!parsed.period || !parsed.new_budget_cents) {
        return { ok: false, error: "budget_increase body must contain period + new_budget_cents" };
      }
      db.run(
        `UPDATE agent_budgets SET budget_cents=?, status='active', halted_at=NULL, updated_at=datetime('now','localtime') WHERE agent_id=? AND period=?`,
        [parsed.new_budget_cents, approval.entity_id, parsed.period],
      );
    } else if (approval.entity_type === "agent_revision") {
      return approveAgentRevision(db, approval.id);
    } else if (approval.entity_type === "manual") {
      // 副作用なし
    } else if (approval.entity_type === "control_apply" || approval.entity_type === "pilot_promotion") {
      // approve 記録のみ、apply は別途
    } else {
      return { ok: false, error: `unknown entity_type: ${approval.entity_type}` };
    }

    db.run(
      `UPDATE approvals SET status='applied', reviewed_by=?, reviewed_at=datetime('now','localtime'),
         applied_at=datetime('now','localtime'), updated_at=datetime('now','localtime')
       WHERE id=? AND data_origin='production' AND status='pending'`,
      [REVIEWER, approvalId],
    );

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function reject(db: Database, approvalId: number): ApprovalResult {
  const result = db.run(
    `UPDATE approvals SET status='rejected', reviewed_by=?, reviewed_at=datetime('now','localtime'),
       rejection_reason='rejected by reviewer', updated_at=datetime('now','localtime')
     WHERE id=? AND data_origin='production' AND status='pending'`,
    [REVIEWER, approvalId],
  );
  if (result.changes === 0) return { ok: false, error: "approval not found or already processed" };
  return { ok: true };
}

function badRequest(msg: string): Response {
  return new Response(msg, { status: 400 });
}

