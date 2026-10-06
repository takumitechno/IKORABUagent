import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setFrontmatterField } from "../pipeline/src/cli";

/** generate と publish の分離を、content/ の一時コピーに対して CLI で検証する */
const ROOT = process.cwd();
let dir: string;

function run(...args: string[]): { code: number; out: string } {
  try {
    const out = execFileSync(path.join(ROOT, "node_modules/.bin/tsx"), [path.join(ROOT, "pipeline/src/cli.ts"), ...args], {
      env: { ...process.env, PIPELINE_CONTENT_DIR: dir, PIPELINE_LOG_FILE: path.join(dir, "runs.jsonl"), PIPELINE_TODAY: "2026-10-06" },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out };
  } catch (e) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { code: err.status, out: `${err.stdout}${err.stderr}` };
  }
}

const file = () => path.join(dir, "articles/dainishinsotsu-tenshoku-timing.md");
const status = () => fs.readFileSync(file(), "utf8").match(/^status: (\w+)/m)?.[1];

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "career-content-"));
  fs.cpSync(path.join(ROOT, "content"), dir, { recursive: true });
  fs.rmSync(path.join(dir, "reviews"), { recursive: true, force: true });
});
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("pipeline publish gate", () => {
  it("frontmatter edits are surgical", () => {
    const raw = "---\nslug: a\nstatus: review\n---\nbody";
    expect(setFrontmatterField(raw, "status", "published")).toBe("---\nslug: a\nstatus: published\n---\nbody");
    expect(setFrontmatterField(raw, "reviewed_by", "x")).toBe("---\nslug: a\nstatus: review\nreviewed_by: x\n---\nbody");
  });

  it("refuses to publish without a human approver", () => {
    const r = run("publish", "dainishinsotsu-tenshoku-timing");
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("--approved-by");
  }, 30_000);

  it("refuses drafts and unreviewed articles", () => {
    expect(run("publish", "kyujin-hyo-yomikata", "--approved-by", "editor").out).toContain("status が review ではありません");
    expect(run("review", "kyujin-hyo-yomikata").out).toContain("draft は査読できません");
    fs.writeFileSync(file(), setFrontmatterField(fs.readFileSync(file(), "utf8"), "information_checked_at", "2026-10-05"));
    expect(run("publish", "dainishinsotsu-tenshoku-timing", "--approved-by", "editor").out).toContain("approved の査読記録がありません");
    expect(status()).toBe("review");
  }, 60_000);

  it("requires re-review when the body changes after approval", () => {
    expect(run("review", "dainishinsotsu-tenshoku-timing").code).toBe(0);
    fs.appendFileSync(file(), "\n追記した段落です。\n");
    const r = run("publish", "dainishinsotsu-tenshoku-timing", "--approved-by", "editor");
    expect(r.out).toContain("査読後に本文が変更されています");
    expect(status()).toBe("review");
  }, 60_000);

  it("publishes only after approved review of the current body + human approval", () => {
    expect(run("review", "dainishinsotsu-tenshoku-timing").code).toBe(0);
    const r = run("publish", "dainishinsotsu-tenshoku-timing", "--approved-by", "MakeCareer 編集部 山田");
    expect(r.code).toBe(0);
    const raw = fs.readFileSync(file(), "utf8");
    expect(status()).toBe("published");
    expect(raw).toMatch(/^published_at: 2026-10-06$/m);
    expect(raw).toMatch(/^reviewed_by: MakeCareer 編集部 山田$/m);
    const log = fs.readFileSync(path.join(dir, "runs.jsonl"), "utf8");
    expect(log).toContain('"action":"publish"');
  }, 60_000);

  it("fails review when a guarantee expression is introduced", () => {
    const target = path.join(dir, "articles/agent-mendan-mae.md");
    fs.appendFileSync(target, "\nこの面談を受ければ必ず内定がもらえます。\n");
    fs.writeFileSync(target, setFrontmatterField(fs.readFileSync(target, "utf8"), "status", "review"));
    const r = run("review", "agent-mendan-mae");
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("C07");
  }, 30_000);
});
