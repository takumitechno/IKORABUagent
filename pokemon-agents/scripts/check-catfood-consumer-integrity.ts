#!/usr/bin/env bun
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve, sep } from "node:path";

export interface ConsumerIntegrityManifest {
  contract: "ikorabu.catfood-consumer-integrity.v1";
  line_endings: "LF-normalized";
  files: readonly { path: string; sha256: string }[];
}

const SHA256 = /^[0-9a-f]{64}$/;
const root = resolve(import.meta.dir, "../..");
const digest = (bytes: Uint8Array) => createHash("sha256").update(Buffer.from(bytes).toString("utf8").replaceAll("\r\n", "\n")).digest("hex");

export function verifyConsumerIntegrity(manifest: ConsumerIntegrityManifest): void {
  if (manifest.contract !== "ikorabu.catfood-consumer-integrity.v1" || manifest.line_endings !== "LF-normalized" || !Array.isArray(manifest.files)) throw new Error("CATFOOD_INTEGRITY_MANIFEST_INVALID");
  const paths = manifest.files.map((entry) => entry.path);
  if (new Set(paths).size !== paths.length || [...paths].sort().join("\n") !== paths.join("\n")) throw new Error("CATFOOD_INTEGRITY_PATHS_INVALID");
  for (const entry of manifest.files) {
    const absolute = resolve(root, entry.path);
    if (!entry.path.startsWith("pokemon-agents/") || !absolute.startsWith(`${root}${sep}`) || !SHA256.test(entry.sha256)) throw new Error("CATFOOD_INTEGRITY_ENTRY_INVALID");
    if (digest(readFileSync(absolute)) !== entry.sha256) throw new Error(`CATFOOD_INTEGRITY_DRIFT:${entry.path}`);
  }
}

if (import.meta.main) {
  try {
    const path = resolve(root, "pokemon-agents/contracts/catfood-consumer-integrity-v1.json");
    verifyConsumerIntegrity(JSON.parse(readFileSync(path, "utf8")) as ConsumerIntegrityManifest);
    console.log("CATFOOD_CONSUMER_INTEGRITY_OK");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "CATFOOD_INTEGRITY_FAILED");
    process.exit(1);
  }
}
