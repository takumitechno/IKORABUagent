import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifyConsumerIntegrity, type ConsumerIntegrityManifest } from "../scripts/check-catfood-consumer-integrity";

const manifest = JSON.parse(readFileSync(resolve(import.meta.dir, "../contracts/catfood-consumer-integrity-v1.json"), "utf8")) as ConsumerIntegrityManifest;

describe("CATFOOD consumer integrity", () => {
  test("acceptance-critical LF-normalized bytes match the manifest", () => expect(() => verifyConsumerIntegrity(manifest)).not.toThrow());
  test("one-byte-equivalent digest drift rejects", () => { const files = manifest.files.map((entry, index) => index ? entry : { ...entry, sha256: "f".repeat(64) }); expect(() => verifyConsumerIntegrity({ ...manifest, files })).toThrow("CATFOOD_INTEGRITY_DRIFT"); });
});
