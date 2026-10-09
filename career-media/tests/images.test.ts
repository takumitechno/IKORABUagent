import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { findSelectedImage, type GeneratedImageEntry } from "@/lib/generated-images";

// 画像ツールは一時フォルダに書かせる（リポジトリの public/ や content/ には書かない）
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "image-tool-"));
process.env.IMAGE_TOOL_ROOT = tmpRoot;
type Lib = typeof import("../scripts/images/lib");
let lib: Lib;
beforeAll(async () => {
  lib = await import("../scripts/images/lib");
});
afterAll(() => fs.rmSync(tmpRoot, { recursive: true, force: true }));

const REPO = path.resolve(__dirname, "..");
const BRIEFS = path.join(REPO, "docs", "image-briefs");

/** テスト用の小さな PNG（API の代わりに返す。実際の生成画像ではない） */
function tinyPng(width: number, height: number): Buffer {
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

function stubFetch(responses: Array<{ status: number; body: unknown }>) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fn = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const r = responses.shift() ?? { status: 500, body: {} };
    return new Response(JSON.stringify(r.body), { status: r.status, headers: { "content-type": "application/json" } });
  };
  return { fn, calls };
}

const brief = () => lib.parseBrief(fs.readFileSync(path.join(BRIEFS, "check-support.md"), "utf8"), path.join(BRIEFS, "check-support.md"));
const ENV = { OPENAI_API_KEY: "test-key" };

describe("image briefs", () => {
  it("every brief in docs/image-briefs parses and passes the checks", () => {
    const files = fs.readdirSync(BRIEFS).filter((f) => f.endsWith(".md") && f !== "README.md" && !f.startsWith("_"));
    expect(files.length).toBeGreaterThanOrEqual(3);
    for (const f of files) {
      const b = lib.parseBrief(fs.readFileSync(path.join(BRIEFS, f), "utf8"));
      expect(b.slug).toBe(f.replace(/\.md$/, ""));
      expect(b.prompt.length).toBeGreaterThan(100);
    }
  });

  it("rejects bad slugs, missing alt and real brand or character names", () => {
    const base = { slug: "ok-slug", type: "section" as const, prompt: "A simple notebook on a desk with a pen.", alt: "ノート", decorative: false, usedIn: [] };
    expect(() => lib.validateBrief({ ...base, slug: "Bad Slug" })).toThrow(/slug/);
    expect(() => lib.validateBrief({ ...base, alt: "" })).toThrow(/alt/);
    expect(() => lib.validateBrief({ ...base, prompt: "A poster with the MakeCareer logo and people" })).toThrow(/ブランド/);
    expect(() => lib.validateBrief({ ...base, background: "transparent", format: "jpeg" })).toThrow(/透過/);
    expect(lib.validateBrief({ ...base, decorative: true, alt: "" }).decorative).toBe(true);
  });
});

describe("request", () => {
  it("adds the house style, picks the folder by type and keeps the key out of the body", () => {
    const req = lib.resolveRequest(brief(), { OPENAI_API_KEY: "secret-key", OPENAI_IMAGE_MODEL: "gpt-image-x" });
    expect(req.src).toBe("/images/generated/sections/check-support.webp");
    expect(req.model).toBe("gpt-image-x");
    expect(req.body).toMatchObject({ n: 1, size: "1024x1024", output_format: "webp", background: "transparent", output_compression: 85 });
    expect(req.promptFinal).toContain("Strictly no text");
    expect(JSON.stringify(req.body)).not.toContain("secret-key");
    expect(lib.resolveRequest(brief(), {}).model).toBe(lib.MODEL_DEFAULT);
  });
});

describe("generate", () => {
  it("dry run never calls the API and writes nothing", async () => {
    const { fn, calls } = stubFetch([]);
    await lib.generate(brief(), { dryRun: true, env: {}, fetchImpl: fn });
    expect(calls).toHaveLength(0);
    expect(fs.existsSync(lib.GENERATED_DIR)).toBe(false);
  });

  it("fails clearly without an API key and does not call the API", async () => {
    const { fn, calls } = stubFetch([]);
    await expect(lib.generate(brief(), { env: {}, fetchImpl: fn })).rejects.toThrow(/OPENAI_API_KEY/);
    expect(calls).toHaveLength(0);
  });

  it("explains API errors and leaves no file behind", async () => {
    for (const [status, re] of [[401, /401/], [429, /429/], [400, /400/]] as const) {
      const { fn } = stubFetch([{ status, body: { error: { message: "nope" } } }]);
      await expect(lib.generate(brief(), { env: ENV, fetchImpl: fn })).rejects.toThrow(re);
    }
    const { fn } = stubFetch([{ status: 200, body: { data: [{ b64_json: Buffer.from("not an image").toString("base64") }] } }]);
    await expect(lib.generate(brief(), { env: ENV, fetchImpl: fn })).rejects.toThrow(/読めません/);
    expect(fs.existsSync(path.join(lib.GENERATED_DIR, "sections", "check-support.webp"))).toBe(false);
    expect(lib.readMeta("check-support")).toBeNull();
  });

  it("saves the image, its record and the index as a draft; status and regeneration are tracked", async () => {
    const { fn, calls } = stubFetch([{ status: 200, body: { data: [{ b64_json: tinyPng(3, 2).toString("base64"), revised_prompt: "rev" }], usage: { total_tokens: 1 } } }]);
    const { meta } = await lib.generate(brief(), { env: ENV, fetchImpl: fn, now: new Date("2026-10-09T00:00:00Z") });
    expect(calls[0].url).toBe("https://api.openai.com/v1/images/generations");
    expect((calls[0].init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    expect(meta).toMatchObject({ slug: "check-support", status: "draft", width: 3, height: 2, output_format: "png", decorative: true, alt: "", revised_prompt: "rev", regenerated_from: null });
    expect(meta!.brief_file).toMatch(/docs\/image-briefs\/check-support\.md$/);
    expect(fs.existsSync(path.join(tmpRoot, meta!.file))).toBe(true);
    expect(JSON.stringify(meta)).not.toContain("test-key");

    let index = JSON.parse(fs.readFileSync(lib.INDEX_FILE, "utf8"));
    expect(index.images[0]).toMatchObject({ slug: "check-support", status: "draft" });
    expect(findSelectedImage("check-support", index.images)).toBeNull();
    lib.setStatus("check-support", "selected");
    index = JSON.parse(fs.readFileSync(lib.INDEX_FILE, "utf8"));
    expect(findSelectedImage("check-support", index.images)).toMatchObject({ width: 3, height: 2 });
    expect(lib.validateAll()).toEqual([]);

    // 同じ slug は --force なしでは上書きしない
    await expect(lib.generate(brief(), { env: ENV, fetchImpl: stubFetch([]).fn })).rejects.toThrow(/--force/);
    const again = await lib.generate(brief(), { env: ENV, force: true, fetchImpl: stubFetch([{ status: 200, body: { data: [{ b64_json: tinyPng(4, 4).toString("base64") }] } }]).fn });
    expect(again.meta).toMatchObject({ width: 4, height: 4, status: "draft", regenerated_from: { generated_at: "2026-10-09T00:00:00.000Z" } });
    expect(fs.readdirSync(lib.HISTORY_DIR)).toHaveLength(1);

    lib.setStatus("check-support", "rejected");
    expect(lib.pruneRejected()).toEqual(["check-support"]);
    expect(lib.validateAll()).toEqual([]);
  });

  it("reads width and height from PNG and WebP headers", () => {
    expect(lib.imageInfo(tinyPng(7, 5))).toEqual({ format: "png", width: 7, height: 5 });
    const webp = Buffer.alloc(40);
    webp.write("RIFF", 0, "ascii");
    webp.write("WEBP", 8, "ascii");
    webp.write("VP8X", 12, "ascii");
    webp.writeUIntLE(1535, 24, 3);
    webp.writeUIntLE(1023, 27, 3);
    expect(lib.imageInfo(webp)).toEqual({ format: "webp", width: 1536, height: 1024 });
    expect(lib.imageInfo(Buffer.from("hello world, not an image at all"))).toBeNull();
  });
});

describe("site", () => {
  it("only shows selected images with a size, from the generated folder", () => {
    const e: GeneratedImageEntry = { slug: "a", type: "hero", status: "selected", src: "/images/generated/hero/a.webp", width: 10, height: 10, alt: "", decorative: true, used_in: [] };
    expect(findSelectedImage("a", [e])).toBe(e);
    expect(findSelectedImage("a", [{ ...e, status: "draft" }])).toBeNull();
    expect(findSelectedImage("a", [{ ...e, width: 0 }])).toBeNull();
    expect(findSelectedImage("a", [{ ...e, src: "https://example.com/a.webp" }])).toBeNull();
    expect(findSelectedImage("missing", [e])).toBeNull();
  });

  it("the committed index matches the committed records and every brief is wired to a page", () => {
    const index = JSON.parse(fs.readFileSync(path.join(REPO, "content/images/index.json"), "utf8"));
    const metas = fs.readdirSync(path.join(REPO, "content/images/meta")).filter((f) => f.endsWith(".json"));
    expect(index.images.map((i: { slug: string }) => i.slug).sort()).toEqual(metas.map((f) => f.replace(/\.json$/, "")).sort());
    const page = fs.readFileSync(path.join(REPO, "src/app/page.tsx"), "utf8");
    expect(page).toContain('slug="hero-home"');
    expect(page).toContain('slug="check-support"');
  });
});
