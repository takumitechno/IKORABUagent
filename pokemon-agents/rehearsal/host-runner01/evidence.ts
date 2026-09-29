import { closeSync, fsyncSync, openSync, writeSync } from "node:fs";

export interface EvidenceEvent {
  readonly event: string;
  readonly campaign_id: string;
  readonly case_id: string;
  readonly observed_at: string;
  readonly [key: string]: unknown;
}

export class EvidenceRecorder {
  constructor(readonly path: string, readonly campaignId: string, readonly caseId: string) {}

  record(event: string, details: Readonly<Record<string, unknown>> = {}): EvidenceEvent {
    const value: EvidenceEvent = Object.freeze({ event, campaign_id: this.campaignId, case_id: this.caseId, observed_at: new Date().toISOString(), ...details });
    const fd = openSync(this.path, "a", 0o600);
    try { writeSync(fd, `${JSON.stringify(value)}\n`); fsyncSync(fd); } finally { closeSync(fd); }
    return value;
  }
}
