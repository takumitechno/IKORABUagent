import type { Database } from "bun:sqlite";

export const DATA_PROVENANCE_MIGRATION_ID = "20260924_demo_provenance_v1";
export const PROVENANCE_TABLES = Object.freeze([
  "hypotheses",
  "improvements",
  "approvals",
  "agent_costs",
  "agent_schedules",
  "daily_reports",
] as const);

const ORIGIN_CHECK = "CHECK (data_origin IN ('production','demo','legacy_unknown'))";

function hasOriginColumn(db: Database, table: string): boolean {
  return db.query<{ name: string }, []>(`PRAGMA table_info(${table})`).all()
    .some((column) => column.name === "data_origin");
}

export function migrateDataProvenance(db: Database): boolean {
  const migrate = db.transaction(() => {
    db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now','localtime'))
    )`);
    const applied = db.query<{ version: string }, [string]>(
      "SELECT version FROM schema_migrations WHERE version=?",
    ).get(DATA_PROVENANCE_MIGRATION_ID);
    if (applied) return false;
    for (const table of PROVENANCE_TABLES) {
      if (!hasOriginColumn(db, table)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN data_origin TEXT NOT NULL DEFAULT 'legacy_unknown' ${ORIGIN_CHECK}`);
      }
    }
    assertDataProvenanceSchema(db);
    db.query("INSERT INTO schema_migrations(version) VALUES (?)").run(DATA_PROVENANCE_MIGRATION_ID);
    return true;
  });
  return migrate.immediate();
}

export function assertDataProvenanceSchema(db: Database): void {
  for (const table of PROVENANCE_TABLES) {
    const column = db.query<{ name: string; notnull: number; dflt_value: string | null }, []>(
      `PRAGMA table_info(${table})`,
    ).all().find((candidate) => candidate.name === "data_origin");
    if (!column || column.notnull !== 1 || column.dflt_value !== "'legacy_unknown'") {
      throw new Error(`unsafe or missing data_origin contract: ${table}`);
    }
    const tableSql = db.query<{ sql: string }, [string]>(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name=?",
    ).get(table)?.sql.replace(/\s+/g, "").toLowerCase();
    if (!tableSql?.includes("check(data_originin('production','demo','legacy_unknown'))")) {
      throw new Error(`missing data_origin constraint: ${table}`);
    }
  }
}

export function clearDemoProvenanceRows(db: Database): void {
  for (const table of PROVENANCE_TABLES) {
    db.run(`DELETE FROM ${table} WHERE data_origin='demo'`);
  }
}
