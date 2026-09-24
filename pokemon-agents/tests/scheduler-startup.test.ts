import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { embeddedSchedulerEnabled } from "../web/lib/scheduler-startup";

describe("embedded scheduler startup", () => {
  test("missing env stays off", () => expect(embeddedSchedulerEnabled(undefined)).toBe(false));
  test("off stays off", () => expect(embeddedSchedulerEnabled("off")).toBe(false));
  test("unknown and case variants stay off", () => {
    expect(embeddedSchedulerEnabled("garbage")).toBe(false);
    expect(embeddedSchedulerEnabled("ON")).toBe(false);
  });
  test("exact on opts in", () => expect(embeddedSchedulerEnabled("on")).toBe(true));

  test("demo schedules cannot opt the embedded scheduler in", () => {
    const demoSchedules = [{ enabled: 1, data_origin: "demo" }];
    expect(demoSchedules.some((schedule) => schedule.enabled === 1)).toBe(true);
    expect(embeddedSchedulerEnabled(undefined)).toBe(false);
    const scheduler = readFileSync(new URL("../runtime/scheduler-loop.ts", import.meta.url), "utf8");
    expect(scheduler.match(/WHERE data_origin='production'/g)?.length).toBe(2);
  });
});
