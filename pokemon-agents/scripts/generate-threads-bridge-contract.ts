import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Schema = {
  $ref?: string;
  anyOf?: Schema[];
  const?: unknown;
  enum?: unknown[];
  type?: string;
  items?: Schema;
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: boolean | Schema;
};

const root = resolve(import.meta.dir, "..", "..");
const source = resolve(root, "pokemon-agents/contracts/bridge_contract_v1.json");
const output = resolve(root, "pokemon-agents/web/lib/threads-bridge-contract-v1.generated.ts");
export const PRODUCER_CONTRACT_REVISION = "10a071390daea91c9c687bc60fff4da8cee4c061";

export function canonicalContractText(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

export function renderContract(sourceText: string): string {
const canonicalSource = canonicalContractText(sourceText);
const contract = JSON.parse(canonicalSource) as {
  schema_version: number;
  schemas: Record<string, Schema>;
};

function typeOf(schema: Schema): string {
  if (schema.$ref) return schema.$ref.split("/").at(-1)!;
  if (schema.const !== undefined) return JSON.stringify(schema.const);
  if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(" | ");
  if (schema.anyOf) return schema.anyOf.map(typeOf).join(" | ");
  if (schema.type === "array") return `Array<${typeOf(schema.items ?? {})}>`;
  if (schema.type === "object" || schema.properties) {
    const properties = Object.entries(schema.properties ?? {});
    if (!properties.length && schema.additionalProperties && schema.additionalProperties !== true) {
      return `Record<string, ${typeOf(schema.additionalProperties)}>`;
    }
    const required = new Set(schema.required ?? []);
    const fields = properties.map(([name, value]) =>
      `  ${JSON.stringify(name)}${required.has(name) ? "" : "?"}: ${typeOf(value)};`
    );
    if (schema.additionalProperties === true) fields.push("  [key: string]: unknown;");
    return `{\n${fields.join("\n")}\n}`;
  }
  return ({ string: "string", integer: "number", number: "number", boolean: "boolean", null: "null" } as Record<string, string>)[schema.type ?? ""] ?? "unknown";
}

const aliases: Record<string, string> = {
  BridgeMetaV1: "ContractMeta",
  BridgeAccountReadinessV1: "AccountReadiness",
  BridgePipelineV1: "AccountPipelineStatus",
  BridgeAccountSummaryV1: "OperatorAccountSummary",
  BridgeAccountsResponseV1: "OperatorAccountsResponse",
  BridgeRecentContentV1: "RecentContent",
  BridgeRecentPublicationV1: "RecentPublication",
  BridgeManualThreadPartV1: "ManualThreadPart",
  BridgeManualThreadV1: "ManualThread",
  BridgeNightBatchItemV1: "NightBatchItem",
  BridgeRunnerHeartbeatV1: "RunnerHeartbeat",
  BridgeNightAttentionV1: "NightAttention",
  BridgeInsightsQuarantineV1: "InsightsQuarantine",
  BridgeInsightsQuarantineItemV1: "InsightsQuarantineItem",
  BridgeOperationsV1: "OperatorOperations",
  BridgeAccountResponseV1: "OperatorAccountResponse",
  BridgeContentResponseV1: "OperatorContentResponse",
  BridgeSafetyResponseV1: "SafetyStatusResponse",
  BridgeEditorialCycleV1: "EditorialCycle",
  BridgeEditorialExperimentV1: "EditorialExperiment",
  BridgeEditorialInternalResponseV1: "EditorialInternalResponse",
  BridgeEditorialCustomerSummaryV1: "EditorialCustomerSummary",
  BridgeEditorialCustomerResponseV1: "EditorialCustomerResponse",
};

const checksum = createHash("sha256").update(canonicalSource, "utf8").digest("hex");
const definitions = Object.entries(contract.schemas).sort(([a], [b]) => a.localeCompare(b))
  .map(([name, schema]) => `export type ${name} = ${typeOf(schema)};`).join("\n\n");
const rendered = `/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 * Source: pokemon-agents/contracts/bridge_contract_v1.json
 * Producer contract revision: ${PRODUCER_CONTRACT_REVISION}
 * Artifact SHA-256: ${checksum}
 */

export const THREADS_BRIDGE_SCHEMA_VERSION = ${contract.schema_version} as const;
export type BridgeJsonObject = Record<string, unknown>;
export type BridgeMetricMapV1 = Record<string, number>;

${definitions}

${Object.entries(aliases).map(([alias, target]) => `export type ${alias} = ${target};`).join("\n")}
`;
return rendered;
}

if (import.meta.main) {
  const rendered = renderContract(readFileSync(source, "utf8"));
  if (process.argv.includes("--check")) {
    if (readFileSync(output, "utf8") !== rendered) throw new Error(`generated contract is stale: ${output}`);
  } else {
    writeFileSync(output, rendered, "utf8");
  }
}
