import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DATA_PROVENANCE_MIGRATION_ID,
  PROVENANCE_TABLES,
  assertDataProvenanceSchema,
  clearDemoProvenanceRows,
  migrateDataProvenance,
} from "../web/lib/data-provenance";
import { renderCosts } from "../web/routes/costs";
import { renderHypotheses } from "../web/routes/hypotheses";
import { renderImprovements } from "../web/routes/improvements";
import { renderReports } from "../web/routes/reports";

function legacyDatabase(): Database {
  const db = new Database(":memory:", { strict: true });
  for (const table of PROVENANCE_TABLES) {
    db.exec(`CREATE TABLE ${table} (id INTEGER PRIMARY KEY)`);
    db.exec(`INSERT INTO ${table} DEFAULT VALUES`);
  }
  return db;
}

function schemaDatabase(): Database {
  const db = new Database(":memory:", { strict: true });
  db.exec("PRAGMA foreign_keys=ON");
  db.exec(readFileSync(resolve(import.meta.dir, "../db/schema.sql"), "utf8"));
  return db;
}

describe("demo provenance", () => {
  test("migration leaves every historical row legacy_unknown and is idempotent", () => {
    const db = legacyDatabase();
    expect(migrateDataProvenance(db)).toBe(true);
    expect(migrateDataProvenance(db)).toBe(false);
    assertDataProvenanceSchema(db);
    for (const table of PROVENANCE_TABLES) {
      expect(db.query<{ origin: string }, []>(`SELECT data_origin origin FROM ${table}`).get()?.origin)
        .toBe("legacy_unknown");
      expect(() => db.exec(`INSERT INTO ${table} (data_origin) VALUES ('guessed')`)).toThrow();
    }
    expect(db.query<{ n: number }, [string]>("SELECT COUNT(*) n FROM schema_migrations WHERE version=?")
      .get(DATA_PROVENANCE_MIGRATION_ID)?.n).toBe(1);
    db.close();
  });

  test("demo clear removes only explicitly marked demo rows", () => {
    const db = legacyDatabase();
    migrateDataProvenance(db);
    for (const table of PROVENANCE_TABLES) {
      db.exec(`INSERT INTO ${table} (data_origin) VALUES ('production'), ('demo')`);
    }
    clearDemoProvenanceRows(db);
    for (const table of PROVENANCE_TABLES) {
      const origins = db.query<{ data_origin: string }, []>(`SELECT data_origin FROM ${table} ORDER BY id`).all();
      expect(origins.map((row) => row.data_origin)).toEqual(["legacy_unknown", "production"]);
    }
    db.close();
  });

  test("production HQ read models exclude demo and legacy_unknown", () => {
    const db = schemaDatabase();
    db.exec(`INSERT INTO agent_costs (agent,cost_usd,data_origin) VALUES
      ('prod-agent',1,'production'),('demo-agent',100,'demo'),('legacy-agent',200,'legacy_unknown')`);
    db.exec(`INSERT INTO hypotheses (title,proposal,status,data_origin) VALUES
      ('prod-hypothesis','p','running','production'),('demo-hypothesis','p','running','demo'),('legacy-hypothesis','p','running','legacy_unknown')`);
    db.exec(`INSERT INTO improvements (title,proposal,status,data_origin) VALUES
      ('prod-improvement','p','running','production'),('demo-improvement','p','running','demo'),('legacy-improvement','p','running','legacy_unknown')`);
    db.exec(`INSERT INTO daily_reports (date,summary_md,data_origin) VALUES
      ('2026-09-21','prod-report','production'),('2026-09-22','demo-report','demo'),('2026-09-23','legacy-report','legacy_unknown')`);

    const costs = renderCosts(db, new URLSearchParams("range=all"));
    expect(costs).toContain("prod-agent");
    expect(costs).not.toContain("demo-agent");
    expect(costs).not.toContain("legacy-agent");

    const hypotheses = renderHypotheses(db, new URLSearchParams("tab=all"));
    expect(hypotheses).toContain("prod-hypothesis");
    expect(hypotheses).not.toContain("demo-hypothesis");
    expect(hypotheses).not.toContain("legacy-hypothesis");

    const improvements = renderImprovements(db, new URLSearchParams("tab=all"));
    expect(improvements).toContain("prod-improvement");
    expect(improvements).not.toContain("demo-improvement");
    expect(improvements).not.toContain("legacy-improvement");

    const reports = renderReports(db, new URLSearchParams());
    expect(reports).toContain("prod-report");
    expect(reports).not.toContain("demo-report");
    expect(reports).not.toContain("legacy-report");
    db.close();
  });

  test("canonical writers label origin instead of relying on the default", () => {
    const root = resolve(import.meta.dir, "../..");
    const sources = [
      "pokemon-agents/scripts/seed-demo-data.ts",
      "pokemon-agents/web/server.ts",
      "pokemon-agents/web/lib/launchd-sync.ts",
      "pokemon-agents/web/lib/daily-report.ts",
      "scripts/run-agent.sh",
    ].map((path) => readFileSync(resolve(root, path), "utf8")).join("\n");
    expect(sources).toContain("'demo'");
    expect(sources).toContain("'production'");
    expect(readFileSync(resolve(root, "pokemon-agents/scripts/seed-demo-data.ts"), "utf8"))
      .toContain("clearDemoProvenanceRows(db)");
  });
});
