import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildEvent, EVENT_DICTIONARY, isSnsSession, PARTNER_RETURN_EVENTS, sessionFromLocation, SITE_EVENTS, type SiteEventName } from "@/lib/measurement/schema";

const session = sessionFromLocation("https://example.test/articles/x?utm_source=instagram&utm_medium=social&utm_campaign=pilot&utm_content=theme-a-carousel&email=a@b.c", "", new Date("2026-10-07T00:00:00Z"), "s1");

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}
const src = (f: string) => fs.readFileSync(path.join(process.cwd(), f), "utf8");

describe("measurement events (site-owned)", () => {
  it("keeps only whitelisted context keys (no answers, free text or personal data)", () => {
    const e = buildEvent("check_completed", { page_type: "check", check_version: "v2", answers: { status: ["parttime"] }, q: "検索語", name: "山田", email: "a@b.c", phone: "090" }, session, "demo");
    expect(Object.keys(e.context).sort()).toEqual(["check_version", "page_type"]);
    expect(JSON.stringify(e)).not.toMatch(/parttime|検索語|山田|a@b\.c|090/);
  });

  it("refuses to fire partner-return outcomes from the site", () => {
    for (const name of PARTNER_RETURN_EVENTS) expect(() => buildEvent(name as unknown as SiteEventName, {}, session, "demo")).toThrow();
    expect(SITE_EVENTS.some((n) => (PARTNER_RETURN_EVENTS as readonly string[]).includes(n))).toBe(false);
  });

  it("derives the traffic source once per session from utm / referrer host only", () => {
    expect(session).toMatchObject({ source: "instagram", medium: "social", campaign: "pilot", content: "theme-a-carousel", landing_path: "/articles/x", referrer_host: null });
    expect(JSON.stringify(session)).not.toContain("email");
    expect(isSnsSession(session)).toBe(true);
    const fromRef = sessionFromLocation("https://example.test/", "https://www.instagram.com/some/path?x=1", new Date(), "s2");
    expect(fromRef.referrer_host).toBe("www.instagram.com");
    expect(isSnsSession(fromRef)).toBe(true);
    expect(isSnsSession(sessionFromLocation("https://example.test/", "https://www.google.com/", new Date(), "s3"))).toBe(false);
  });

  it("documents every site and partner event in the dictionary with the right owner", () => {
    for (const n of SITE_EVENTS) expect(EVENT_DICTIONARY.find((d) => d.name === n)?.owner).toBe("site");
    for (const n of PARTNER_RETURN_EVENTS) expect(EVENT_DICTIONARY.find((d) => d.name === n)?.owner).toBe("partner");
  });

  it("never sends events over the network and never fires partner outcomes from frontend code", () => {
    const files = [...walk(path.join(process.cwd(), "src/lib/measurement")), path.join(process.cwd(), "src/components/MeasurementTracker.tsx")];
    for (const f of files) expect(fs.readFileSync(f, "utf8")).not.toMatch(/\bfetch\(|sendBeacon|XMLHttpRequest|gtag|dataLayer|fbq\(|ttq\./);
    // 成果イベントを track() / buildEvent() で発火しているコードがない（説明の文字列として出すのはよい）
    const firing = new RegExp(`(track|buildEvent)\\(\\s*["'\`](${PARTNER_RETURN_EVENTS.join("|")})`);
    const offenders = walk(path.join(process.cwd(), "src"))
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .filter((f) => firing.test(fs.readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
    expect(firing.test(`track("meeting_completed")`)).toBe(true);
  });

  it("does not pass condition-check answers to the tracker", () => {
    const code = src("src/components/ConditionCheck.tsx");
    const calls = code.match(/track\([^)]*\)/g) ?? [];
    expect(calls.length).toBeGreaterThanOrEqual(2);
    for (const call of calls) expect(call).not.toMatch(/answers|result/);
  });
});
