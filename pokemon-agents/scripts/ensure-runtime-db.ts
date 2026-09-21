#!/usr/bin/env bun
import { ensureRuntimeDb, resolveAgentsDbPath } from "../runtime/db-path";

try {
  const path = ensureRuntimeDb(resolveAgentsDbPath());
  console.log(`[runtime-db] valid: ${path}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
