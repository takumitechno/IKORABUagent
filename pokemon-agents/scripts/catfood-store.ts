#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { initializeAttestationStore } from "../web/lib/catfood-attestation";
import { initializeCatfoodStore, openCatfoodStore } from "../web/lib/catfood-harness";

const [command, path, apply] = process.argv.slice(2);
if (!path || !["init-evidence", "init-attestation", "status"].includes(command ?? "")) {
  console.error("usage: bun pokemon-agents/scripts/catfood-store.ts <init-evidence|init-attestation|status> <pre-existing.db> [--apply]");
  process.exit(2);
}
if (!existsSync(path)) { console.error("store path must already exist"); process.exit(2); }
if (command.startsWith("init-") && apply !== "--apply") {
  console.log(JSON.stringify({ status: "dry-run", operation: command, path }));
  process.exit(0);
}
try {
  if (command === "init-evidence") initializeCatfoodStore(path);
  else if (command === "init-attestation") initializeAttestationStore(path);
  else { const db = openCatfoodStore(path, true); db.close(); }
  console.log(JSON.stringify({ status: "ok", operation: command, path }));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
