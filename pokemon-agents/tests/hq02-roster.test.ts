import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..", "..");
const agentsDir = resolve(root, ".claude", "agents");
const roster = [
  "anna-supervisor",
  "hana-heartbeat",
  "hitomi-selector",
  "iori-validator",
  "kiara-executor",
  "maika-hypothesizer",
  "mirinya-cost-analyst",
  "risa-notifier",
  "sanatsun-knowledge-editor",
  "sashihara-orchestrator",
  "shoko-reporter",
].sort();
const retired = [
  "megagengar-orchestrator", "gastly-validator", "haunter-hypothesizer",
  "gengar-selector", "mew-supervisor", "mewtwo-executor", "arceus-knowledge-editor",
];

describe("HQ02 =LOVE Control Plane", () => {
  test("has exactly the 11 canonical agent definitions", () => {
    const actual = readdirSync(agentsDir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.replace(/\.md$/, ""))
      .sort();
    expect(actual).toEqual(roster);
    for (const slug of roster) {
      const md = readFileSync(resolve(agentsDir, `${slug}.md`), "utf8");
      expect(md).toContain(`name: ${slug}`);
      expect(md).toMatch(/department: [a-z-]+/);
      expect(md).toMatch(/role: [a-z-]+/);
    }
  });

  test("schedules only established capabilities", () => {
    const config = JSON.parse(readFileSync(resolve(root, ".claude", "launchd.json"), "utf8"));
    const scheduled = config.jobs.map((job: { agent: string }) => job.agent);
    expect(scheduled).toEqual([
      "agent-os-dashboard", "sashihara-orchestrator", "anna-supervisor", "sanatsun-knowledge-editor",
    ]);
    expect(config.jobs.find((j: any) => j.agent === "sashihara-orchestrator").schedule).toBe("毎日 2:00");
    expect(config.jobs.find((j: any) => j.agent === "anna-supervisor").schedule).toBe("毎日 5:00");
    expect(config.jobs.find((j: any) => j.agent === "sanatsun-knowledge-editor").schedule).toBe("毎週月曜 3:00");
  });

  test("keeps the two formal handoff boundaries", () => {
    const sashihara = readFileSync(resolve(agentsDir, "sashihara-orchestrator.md"), "utf8");
    expect(sashihara).toContain("iori-validator");
    expect(sashihara).toContain("maika-hypothesizer");
    expect(sashihara).toContain("hitomi-selector");
    const anna = readFileSync(resolve(agentsDir, "anna-supervisor.md"), "utf8");
    expect(anna).toContain("kiara-executor");
    for (const slug of retired) expect(readdirSync(agentsDir)).not.toContain(`${slug}.md`);
  });

  test("runtime sources have no retired HQ names or hardcoded dashboard positions", () => {
    const sources = [
      ".claude/launchd.json",
      "pokemon-agents/db/schema.sql",
      "pokemon-agents/scripts/seed-demo-data.ts",
      "pokemon-agents/web/routes/overview.ts",
    ].map((path) => readFileSync(resolve(root, path), "utf8")).join("\n");
    for (const slug of retired) expect(sources).not.toContain(slug);
    expect(sources).not.toContain("const POSITIONS");
    expect(sources).toContain("maika-hypothesizer");
    const seeder = readFileSync(resolve(root, "pokemon-agents/scripts/seed-agents-from-md.ts"), "utf8");
    expect(seeder).toContain("RETIRED_HQ02_SLUGS");
    expect(seeder).toContain("status='deprecated'");
  });
});
