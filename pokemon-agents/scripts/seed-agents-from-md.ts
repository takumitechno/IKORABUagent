#!/usr/bin/env bun
// seed-agents-from-md.ts
//
// .claude/agents/_{dept}/{agent-name}/agent.md を全部読んで agents テーブルに INSERT/UPDATE。
// agent_edges (reports_to / reviews / triggers) も CLAUDE.md の記述を元に設定。
//
// idempotent: 既存 row は instructions_hash が一致すれば skip、変化あれば UPDATE + agent_revisions に記録。

import { Database } from "bun:sqlite";
import { readFileSync, readdirSync, statSync } from "fs";
import { createHash } from "crypto";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { findAgentCharacter } from "../web/lib/agent-character-images";
import { EMPLOYEE_ROLE_REGISTRY, validateIdentityContract } from "../web/lib/agent-role-registry";
import { resolveAgentsDbPath } from "../runtime/db-path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const DB_PATH = resolveAgentsDbPath();
const AGENTS_DIR = resolve(REPO_ROOT, ".claude/agents");
const RETIRED_HQ02_SLUGS = [
  "megagengar-orchestrator",
  "gastly-validator",
  "haunter-hypothesizer",
  "gengar-selector",
  "mew-supervisor",
  "mewtwo-executor",
  "arceus-knowledge-editor",
];

const db = new Database(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

interface Frontmatter {
  name?: string;
  department?: string;
  description?: string;
  model?: string;
  pokemon_slug?: string;
  pokemon_jp?: string;
  role?: string;
  role_label?: string;
  timeout_sec?: number;
}

function parseFrontmatter(content: string): { fm: Frontmatter; body: string } {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: content };
  const fm: Frontmatter = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.+?)\s*$/);
    if (!kv) continue;
    const [, k, v] = kv;
    const val = v.replace(/^["']|["']$/g, "");
    if (k === "timeout_sec") (fm as any)[k] = Number(val);
    else (fm as any)[k] = val;
  }
  return { fm, body: m[2] };
}

function listAgentMdPaths(root: string): string[] {
  const result: string[] = [];
  // フラット定義: root 直下の <name>.md (例: butterfree-subsidy-sync.md)
  // フォルダ定義: <name>/agent.md (references/ や scripts/ 内の .md は拾わない)
  // _shared/ (guidance-protocol.md 等) は agent 定義ではないので除外
  for (const entry of readdirSync(root)) {
    if (entry === "_shared") continue;
    const p = resolve(root, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      const agentMd = resolve(p, "agent.md");
      try {
        if (statSync(agentMd).isFile()) result.push(agentMd);
      } catch {
        /* agent.md なしのフォルダはスキップ */
      }
    } else if (entry.endsWith(".md")) {
      result.push(p);
    }
  }
  return [...new Set(result)].sort();
}

// Character-image identity lives in one catalog shared with Internal HQ.
// Missing verified assets remain null so seed never guesses another person.
function avatarUrlFor(identitySlug: string): string | null {
  return findAgentCharacter({ slug: identitySlug })?.imagePath ?? null;
}

interface AgentDef {
  slug: string;
  pokemon_slug: string;
  pokemon_jp: string;
  display_name: string;
  role: string;
  role_label: string | null;
  department: string;
  model: string;
  source_md_path: string;
  instructions: string;
  instructions_hash: string;
  config: string;
  avatar_url: string | null;
}

function parseAgentMd(mdPath: string): AgentDef {
  const content = readFileSync(mdPath, "utf-8");
  const { fm } = parseFrontmatter(content);
  const rel = relative(REPO_ROOT, mdPath).replace(/\\/g, "/");
  const parts = rel.split("/"); // .claude/agents/<slug>.md または <slug>/agent.md
  const dirSlug = parts[2] || "";
  const slug = fm.name || dirSlug;
  const contract = EMPLOYEE_ROLE_REGISTRY.find((employee) => employee.agent_id === slug);
  if (!contract) throw new Error(`agent identity is not in the canonical role registry: ${slug}`);
  validateIdentityContract(contract, content);
  const pokemon_slug = fm.pokemon_slug || slug.split("-")[0];
  const pokemon_jp = fm.pokemon_jp || pokemon_slug;
  const model = fm.model || "sonnet";
  // Git may materialize the same definition as LF or CRLF. Hash the canonical
  // form so a line-ending-only checkout never creates an agent revision.
  const hash = createHash("sha256").update(content.replace(/\r\n/g, "\n")).digest("hex");
  return {
    slug,
    pokemon_slug,
    pokemon_jp,
    display_name: `${pokemon_jp} (${slug})`,
    role: contract.runtime_role,
    role_label: contract.role_label,
    department: contract.department,
    model,
    source_md_path: rel,
    instructions: content,
    instructions_hash: hash,
    config: JSON.stringify({ timeout_sec: fm.timeout_sec || 1800 }),
    avatar_url: avatarUrlFor(pokemon_slug),
  };
}

function upsertAgent(def: AgentDef): { id: number; created: boolean; updated: boolean } {
  const existing = db
    .query<
      {
        id: number; instructions_hash: string; version: number; instructions: string;
        source_md_path: string | null; role: string | null; role_label: string | null;
        department: string | null; model: string | null; config: string | null;
        pokemon_slug: string | null; pokemon_jp: string | null; display_name: string | null;
        avatar_url: string | null;
        status: string | null;
      },
      [string]
    >(`SELECT id, instructions_hash, version, instructions, source_md_path, role, role_label,
              department, model, config, pokemon_slug, pokemon_jp, display_name, avatar_url, status
       FROM agents WHERE slug=?`)
    .get(def.slug);

  if (!existing) {
    const r = db
      .query<{ id: number }, [string, string, string, string, string, string | null, string, string, string, string, string, string, string]>(
        `INSERT INTO agents (slug, pokemon_slug, pokemon_jp, display_name, role, role_label, department, model,
                             source_md_path, instructions, instructions_hash, version, config, status, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'active', ?) RETURNING id`,
      )
      .get(
        def.slug,
        def.pokemon_slug,
        def.pokemon_jp,
        def.display_name,
        def.role,
        def.role_label,
        def.department,
        def.model,
        def.source_md_path,
        def.instructions,
        def.instructions_hash,
        def.config,
        def.avatar_url,
      ) as { id: number };
    db.run(
      `INSERT INTO agent_revisions (agent_id, version, new_instructions, changed_by, reason)
       VALUES (?, 1, ?, 'seed:agents-from-md', 'initial-seed')`,
      [r.id, def.instructions],
    );
    return { id: r.id, created: true, updated: false };
  }

  if (existing.instructions_hash === def.instructions_hash) {
    // instructions 本文は同一。ただし source_md_path / role / model などのメタ情報が
    // ズレている場合 (例: agent.md のリネーム・フラット化) は、version を上げず revision も
    // 作らずにメタだけ同期する。これがないと live DB が旧パスを指したまま agent_md_missing になる。
    const metaDrift =
      existing.source_md_path !== def.source_md_path ||
      existing.role !== def.role ||
      existing.role_label !== def.role_label ||
      existing.department !== def.department ||
      existing.model !== def.model ||
      existing.config !== def.config ||
      existing.pokemon_slug !== def.pokemon_slug ||
      existing.pokemon_jp !== def.pokemon_jp ||
      existing.display_name !== def.display_name ||
      existing.avatar_url !== def.avatar_url ||
      existing.status !== "active";
    if (!metaDrift) return { id: existing.id, created: false, updated: false };
    db.run(
      `UPDATE agents SET
         pokemon_slug=?, pokemon_jp=?, display_name=?, role=?, role_label=?, department=?, model=?,
         source_md_path=?, config=?, avatar_url=?, status='active', updated_at=datetime('now','localtime')
       WHERE id=?`,
      [
        def.pokemon_slug, def.pokemon_jp, def.display_name, def.role, def.role_label,
        def.department, def.model, def.source_md_path, def.config, def.avatar_url, existing.id,
      ],
    );
    return { id: existing.id, created: false, updated: true };
  }

  // hash differ → UPDATE + revision
  db.run(
    `UPDATE agents SET
       pokemon_slug=?, pokemon_jp=?, display_name=?, role=?, role_label=?, department=?, model=?,
       source_md_path=?, instructions=?, instructions_hash=?, version=version+1,
       config=?, avatar_url=?, status='active', updated_at=datetime('now','localtime')
     WHERE id=?`,
    [
      def.pokemon_slug,
      def.pokemon_jp,
      def.display_name,
      def.role,
      def.role_label,
      def.department,
      def.model,
      def.source_md_path,
      def.instructions,
      def.instructions_hash,
      def.config,
      def.avatar_url,
      existing.id,
    ],
  );
  db.run(
    `INSERT INTO agent_revisions (agent_id, version, prev_instructions, new_instructions, changed_by, reason)
     VALUES (?, ?, ?, ?, 'seed:agents-from-md', 'md-sync')`,
    [existing.id, existing.version + 1, existing.instructions, def.instructions],
  );
  return { id: existing.id, created: false, updated: true };
}

// ============================================================================
// Edges (reports_to / reviews / triggers) — CLAUDE.md の構成から導出
// ============================================================================
const EDGES: Array<{ sup: string; sub: string; type: string }> = [
  { sup: "sashihara-orchestrator", sub: "iori-validator", type: "supervises" },
  { sup: "sashihara-orchestrator", sub: "maika-hypothesizer", type: "supervises" },
  { sup: "sashihara-orchestrator", sub: "hitomi-selector", type: "supervises" },
  { sup: "iori-validator", sub: "maika-hypothesizer", type: "triggers" },
  { sup: "maika-hypothesizer", sub: "hitomi-selector", type: "triggers" },
  { sup: "anna-supervisor", sub: "kiara-executor", type: "triggers" },
  { sup: "sashihara-orchestrator", sub: "sanatsun-knowledge-editor", type: "collaborates" },
  { sup: "sashihara-orchestrator", sub: "risa-notifier", type: "collaborates" },
  { sup: "sashihara-orchestrator", sub: "hana-heartbeat", type: "collaborates" },
  { sup: "sashihara-orchestrator", sub: "shoko-reporter", type: "collaborates" },
  { sup: "anna-supervisor", sub: "mirinya-cost-analyst", type: "collaborates" },
];

function upsertEdges(slugToId: Map<string, number>) {
  db.run(`DELETE FROM agent_edges`); // idempotent full replace
  for (const e of EDGES) {
    const supId = slugToId.get(e.sup);
    const subId = slugToId.get(e.sub);
    if (!supId || !subId) {
      console.warn(`[seed] edge skipped: ${e.sup} → ${e.sub} (missing)`);
      continue;
    }
    db.run(
      `INSERT OR REPLACE INTO agent_edges (supervisor_id, subordinate_id, edge_type) VALUES (?, ?, ?)`,
      [supId, subId, e.type],
    );
  }
}

// ============================================================================
// Main
// ============================================================================
console.log(`[seed] db=${DB_PATH}`);
console.log(`[seed] agents_dir=${AGENTS_DIR}`);

const paths = listAgentMdPaths(AGENTS_DIR);
console.log(`[seed] found ${paths.length} agent.md files`);

let created = 0;
let updated = 0;
let unchanged = 0;
const slugToId = new Map<string, number>();

db.transaction(() => {
  // Rename migration is source-driven: old HQ02 identities remain auditable but
  // can no longer appear as active dashboard agents when an existing DB is seeded.
  for (const slug of RETIRED_HQ02_SLUGS) {
    db.run("UPDATE agents SET status='deprecated', updated_at=datetime('now','localtime') WHERE slug=?", [slug]);
  }
  for (const mdPath of paths) {
    const def = parseAgentMd(mdPath);
    const r = upsertAgent(def);
    slugToId.set(def.slug, r.id);
    if (r.created) {
      created++;
      console.log(`[seed] ✓ created: ${def.slug} (${def.pokemon_jp}, dept=${def.department}, role=${def.role})`);
    } else if (r.updated) {
      updated++;
      console.log(`[seed] ↻ updated: ${def.slug}`);
    } else {
      unchanged++;
    }
  }
  upsertEdges(slugToId);
})();

console.log(`\n[seed] done: ${created} created, ${updated} updated, ${unchanged} unchanged`);
console.log(`[seed] edges: ${EDGES.length} configured`);
db.close();
