import { createHash } from "node:crypto";
import { closeSync, fsyncSync, openSync, readFileSync, writeSync } from "node:fs";
import { canonicalJson } from "../../web/lib/catfood-harness";
import { canonicalKeySha256, type CanonicalRunKey, type LineageObservation, type LineageRootObservation, type LineageState, type RunBinding, type TrustedLineageAdapter } from "../../pre-rehearsal/custody-control01/controller";

type MaterialState = Readonly<{
  schema: "test-only-persistent-lineage.v1";
  adapter_id: string;
  key: CanonicalRunKey;
  key_sha256: string;
  control_store_id: string;
  checkpoint_store_id: string;
  pre_write_root: LineageState;
  current: LineageState;
  sequence: number;
  predecessor_sha256: string;
  material: "PRE_WRITE" | "H1" | "H2";
  observed_at: string;
}>;

const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const digest = (value: unknown) => sha(canonicalJson(value as never));

function durableWrite(path: string, value: unknown): void {
  const fd = openSync(path, "w", 0o600);
  try { writeSync(fd, JSON.stringify(value)); fsyncSync(fd); } finally { closeSync(fd); }
}

export function lineageFor(storePair: string, material: "root" | "H1" | "H2"): LineageState {
  return Object.freeze({
    store_pair_lineage_sha256: sha(`store-pair:${storePair}`),
    journal_head_sha256: sha(`journal:${storePair}:${material}`),
    checkpoint_head_sha256: sha(`checkpoint:${storePair}:${material}`),
    control_snapshot_sha256: sha(`control:${storePair}:${material}`),
    checkpoint_snapshot_sha256: sha(`checkpoint-store:${storePair}:${material}`),
    pair_common_cut_sha256: sha(`common-cut:${storePair}:${material}`),
  });
}

export function initializePersistentLineage(path: string, input: { adapter_id: string; key: CanonicalRunKey; control_store_id: string; checkpoint_store_id: string; store_pair: string }): void {
  const root = lineageFor(input.store_pair, "root"), state: MaterialState = {
    schema: "test-only-persistent-lineage.v1", adapter_id: input.adapter_id, key: input.key,
    key_sha256: canonicalKeySha256(input.key), control_store_id: input.control_store_id,
    checkpoint_store_id: input.checkpoint_store_id, pre_write_root: root, current: root,
    sequence: 0, predecessor_sha256: digest(root), material: "PRE_WRITE", observed_at: new Date().toISOString(),
  };
  durableWrite(path, state);
}

export class PersistentLineageAdapter implements TrustedLineageAdapter {
  constructor(readonly path: string) { this.read(); }

  read(): MaterialState {
    const value = JSON.parse(readFileSync(this.path, "utf8")) as MaterialState;
    if (value.schema !== "test-only-persistent-lineage.v1" || !Number.isSafeInteger(value.sequence) || value.sequence < 0 || canonicalKeySha256(value.key) !== value.key_sha256) throw new Error("LINEAGE_MATERIAL_INVALID");
    return Object.freeze(value);
  }

  mutate(material: "H1" | "H2"): MaterialState {
    const current = this.read(), expected = current.material === "PRE_WRITE" ? "H1" : current.material === "H1" ? "H2" : null;
    if (material !== expected) throw new Error("LINEAGE_MATERIAL_ORDER_INVALID");
    const derived = lineageFor(current.key_sha256, material), nextLineage = { ...derived, store_pair_lineage_sha256: current.pre_write_root.store_pair_lineage_sha256 }, next: MaterialState = {
      ...current, current: nextLineage, sequence: current.sequence + 1,
      predecessor_sha256: digest(current.current), material, observed_at: new Date().toISOString(),
    };
    durableWrite(this.path, next);
    return Object.freeze(next);
  }

  restoreRecordedRootForTest(): MaterialState {
    const current = this.read();
    if (current.material !== "H2" || current.sequence !== 2) throw new Error("FRESH_STORE_ROOT_RESTORE_PREREQUISITE_INVALID");
    const next: MaterialState = {
      ...current, current: current.pre_write_root, sequence: current.sequence + 1,
      predecessor_sha256: digest(current.current), material: "PRE_WRITE", observed_at: new Date().toISOString(),
    };
    durableWrite(this.path, next);
    return Object.freeze(next);
  }

  inspectRoot(input: Readonly<{ key: CanonicalRunKey; binding: RunBinding }>): LineageRootObservation {
    const state = this.read();
    if (canonicalKeySha256(input.key) !== state.key_sha256 || input.binding.control_store_id !== state.control_store_id || input.binding.checkpoint_store_id !== state.checkpoint_store_id) throw new Error("LINEAGE_MATERIAL_BINDING_MISMATCH");
    return Object.freeze({ schema: "pre-custody-lineage-root-observation.v1", adapter_id: state.adapter_id, pre_write: state.sequence === 0, lineage: state.pre_write_root, observed_at: state.observed_at });
  }

  inspect(input: Readonly<{ key: CanonicalRunKey }>): LineageObservation {
    const state = this.read();
    if (canonicalKeySha256(input.key) !== state.key_sha256 || state.sequence < 1) throw new Error("LINEAGE_MATERIAL_NOT_ADVANCED");
    return Object.freeze({ schema: "pre-custody-lineage-observation.v1", adapter_id: state.adapter_id, sequence: state.sequence, predecessor_sha256: state.predecessor_sha256, lineage: state.current, observed_at: state.observed_at });
  }
}
