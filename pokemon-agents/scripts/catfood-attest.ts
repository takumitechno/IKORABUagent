#!/usr/bin/env bun
import { attestClosedRun } from "../web/lib/catfood-attestation";

const value = (flag: string): string | undefined => {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
};
const evidence = value("--evidence-db");
const attestation = value("--attestation-db");
const runId = value("--run-id");
const evaluator = value("--evaluator");
if (!evidence || !attestation || !runId || !evaluator) {
  console.error("usage: bun pokemon-agents/scripts/catfood-attest.ts --evidence-db <path> --attestation-db <path> --run-id <id> --evaluator <identity>");
  process.exit(2);
}
try {
  const id = attestClosedRun(evidence, attestation, runId, evaluator, new Date().toISOString());
  console.log(JSON.stringify({ status: "attested", attestation_id: id }));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
