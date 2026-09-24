#!/usr/bin/env bun
import { Database } from "bun:sqlite";
import { resolveAgentsDbPath } from "../runtime/db-path";
import { migrateAiCostAccounting } from "../web/lib/ai-cost-accounting";

const db = new Database(resolveAgentsDbPath());
try {
  console.log(migrateAiCostAccounting(db) ? "AI cost accounting migration applied" : "AI cost accounting already current");
} finally {
  db.close();
}
