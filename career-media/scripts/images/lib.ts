/**
 * OpenAI の画像生成 API で、サイトに使う画像を作って保存するための部品。
 * CLI は scripts/images/cli.ts。使い方とルールは docs/ART_DIRECTION.md と docs/image-briefs/README.md。
 *
 * - 画像: public/images/generated/<種類>/<slug>.<拡張子>（サイトからは /images/generated/... で参照）
 * - 記録: content/images/meta/<slug>.json（何のための画像か・prompt・生成日時・状態）
 * - 一覧: content/images/index.json（サイトが読むのはここ。status が selected の画像だけ表示する）
 *
 * API キーは環境変数 OPENAI_API_KEY からだけ読む。ファイルにもログにも書かない。
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// IMAGE_TOOL_ROOT はテスト用（一時フォルダに書かせる）
export const ROOT = process.env.IMAGE_TOOL_ROOT ? path.resolve(process.env.IMAGE_TOOL_ROOT) : path.resolve(__dirname, "../..");
export const PUBLIC_DIR = path.join(ROOT, "public");
export const GENERATED_DIR = path.join(PUBLIC_DIR, "images", "generated");
export const META_DIR = path.join(ROOT, "content", "images", "meta");
export const INDEX_FILE = path.join(ROOT, "content", "images", "index.json");
/** 差し替え前の画像の置き場（ローカルだけ。git には入れない） */
export const HISTORY_DIR = path.join(ROOT, ".image-history");

export const API_URL_DEFAULT = "https://api.openai.com/v1";
/** 2026-10 時点で OpenAI が新規実装に推奨している画像モデル。OPENAI_IMAGE_MODEL で変えられる */
export const MODEL_DEFAULT = "gpt-image-2";

export const IMAGE_TYPES = {
  hero: { dir: "hero", size: "1536x1024" },
  section: { dir: "sections", size: "1024x1024" },
  article: { dir: "articles", size: "1536x1024" },
  diagram: { dir: "diagrams", size: "1024x1024" },
  "sns-carousel": { dir: "sns", size: "1024x1536" },
  sales: { dir: "sales", size: "1536x1024" },
} as const;
export type ImageType = keyof typeof IMAGE_TYPES;
export const STATUSES = ["draft", "selected", "rejected"] as const;
export type ImageStatus = (typeof STATUSES)[number];
export const QUALITIES = ["low", "medium", "high", "auto"] as const;
export const FORMATS = ["webp", "png", "jpeg"] as const;
export const BACKGROUNDS = ["auto", "opaque", "transparent"] as const;

/**
 * すべての画像に付けるスタイル指定（docs/ART_DIRECTION.md の要約）。
 * 色はサイトの CSS 変数（src/app/globals.css）と同じ値。
 */
export const HOUSE_STYLE = [
  "Style: soft, flat vector illustration for a calm Japanese career guide for people in their 20s changing jobs for the first time.",
  "Mood: gentle, clean, reassuring, hopeful but not over-excited. Plenty of empty space, simple rounded shapes, thin outlines or none, subtle paper-like texture at most.",
  "Palette: deep teal #0f7b6c, mint #e3f3ec, warm off-white #faf8f4, navy ink #142b3e for small details, small accents of orange #f28c28 and sand #fbf0e1. Mostly light and airy.",
  "People (only if the brief asks for them): simple stylized figures with minimal facial detail, natural everyday clothes, varied and not gender-stereotyped, no exaggerated smiles.",
  "Strictly no text, letters, numbers, captions, logos, brand marks, watermarks or UI screenshots in the image.",
  "Avoid: photorealism, stock-photo look, glossy 3D, sparkles and glitter, neon, heavy gradients, dark or gloomy mood, corporate SaaS blue, distorted hands, crowded compositions.",
].join("\n");

/** 生成させない固有名詞（他社・実在ブランド・著名キャラクター）。brief の本文に含まれていたら止める */
export const BLOCKED_TERMS = ["makecareer", "make career", "メイクキャリア", "pokemon", "pokémon", "ポケモン", "pikachu", "disney", "ディズニー", "mickey", "ghibli", "ジブリ", "sanrio", "サンリオ", "hello kitty", "doraemon", "ドラえもん", "anpanman", "アンパンマン"];

export type Brief = {
  slug: string;
  type: ImageType;
  prompt: string;
  alt: string;
  decorative: boolean;
  usedIn: string[];
  size?: string;
  quality?: string;
  format?: string;
  background?: string;
  purpose?: string;
  notes?: string;
  briefFile?: string;
};

export type ImageMeta = {
  schema_version: 1;
  slug: string;
  type: ImageType;
  status: ImageStatus;
  purpose: string;
  used_in: string[];
  alt: string;
  decorative: boolean;
  brief_file: string | null;
  model: string;
  size: string;
  quality: string;
  output_format: string;
  background: string;
  prompt_brief: string;
  prompt_final: string;
  revised_prompt: string | null;
  generated_at: string;
  src: string;
  file: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  usage: unknown;
  regenerated_from: { generated_at: string; sha256: string; prompt_final: string } | null;
  notes: string;
};

export type IndexEntry = Pick<ImageMeta, "slug" | "type" | "status" | "src" | "width" | "height" | "alt" | "decorative" | "used_in">;
export type ImageIndex = { images: IndexEntry[] };

export class ImageToolError extends Error {}

// ---------------------------------------------------------------- brief

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** docs/image-briefs/*.md を読む。frontmatter に設定、本文の「## Prompt」節に英語の prompt を書く */
export function parseBrief(raw: string, briefFile?: string): Brief {
  const { data, content } = matter(raw);
  const m = content.match(/^##\s+Prompt\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
  const prompt = (m?.[1] ?? "").replace(/<!--[\s\S]*?-->/g, "").trim();
  return validateBrief({
    slug: String(data.slug ?? ""),
    type: String(data.type ?? "") as ImageType,
    prompt,
    alt: String(data.alt ?? ""),
    decorative: data.decorative === true,
    usedIn: Array.isArray(data.used_in) ? data.used_in.map(String) : data.used_in ? [String(data.used_in)] : [],
    size: data.size ? String(data.size) : undefined,
    quality: data.quality ? String(data.quality) : undefined,
    format: data.format ? String(data.format) : undefined,
    background: data.background ? String(data.background) : undefined,
    purpose: data.purpose ? String(data.purpose) : undefined,
    notes: data.notes ? String(data.notes) : undefined,
    briefFile,
  });
}

export function validateBrief(b: Brief): Brief {
  if (!SLUG_RE.test(b.slug)) throw new ImageToolError(`slug は英小文字・数字・ハイフンだけにしてください: "${b.slug}"`);
  if (!(b.type in IMAGE_TYPES)) throw new ImageToolError(`type は ${Object.keys(IMAGE_TYPES).join(" / ")} のどれかにしてください: "${b.type}"`);
  if (b.prompt.length < 20) throw new ImageToolError("prompt が空か短すぎます（brief の「## Prompt」節、または --prompt に書く）");
  if (!b.decorative && !b.alt.trim()) throw new ImageToolError("alt（画像の説明）が必要です。飾りの画像なら decorative: true にする");
  if (b.size && !/^(auto|\d{3,4}x\d{3,4})$/.test(b.size)) throw new ImageToolError(`size は 1536x1024 のような形か auto: "${b.size}"`);
  if (b.quality && !(QUALITIES as readonly string[]).includes(b.quality)) throw new ImageToolError(`quality は ${QUALITIES.join(" / ")}: "${b.quality}"`);
  if (b.format && !(FORMATS as readonly string[]).includes(b.format)) throw new ImageToolError(`format は ${FORMATS.join(" / ")}: "${b.format}"`);
  if (b.background && !(BACKGROUNDS as readonly string[]).includes(b.background)) throw new ImageToolError(`background は ${BACKGROUNDS.join(" / ")}: "${b.background}"`);
  if (b.background === "transparent" && b.format === "jpeg") throw new ImageToolError("透過背景は png か webp で出してください");
  const lower = b.prompt.toLowerCase();
  const hit = BLOCKED_TERMS.find((t) => lower.includes(t.toLowerCase()));
  if (hit) throw new ImageToolError(`実在のブランド・キャラクターに関わる言葉が prompt に入っています（${hit}）。ロゴや他社の公式ビジュアルは生成しません`);
  return b;
}

// ---------------------------------------------------------------- request

export type ResolvedRequest = {
  model: string;
  size: string;
  quality: string;
  format: (typeof FORMATS)[number];
  background: string;
  promptFinal: string;
  body: Record<string, unknown>;
  file: string; // 絶対パス
  src: string; // サイトから参照する URL パス
};

export function resolveRequest(b: Brief, env: Record<string, string | undefined> = process.env, opts: { houseStyle?: boolean } = {}): ResolvedRequest {
  const model = env.OPENAI_IMAGE_MODEL || MODEL_DEFAULT;
  const size = b.size ?? IMAGE_TYPES[b.type].size;
  const quality = b.quality ?? "medium";
  const format = (b.format ?? "webp") as ResolvedRequest["format"];
  const background = b.background ?? "auto";
  const promptFinal = opts.houseStyle === false ? b.prompt : `${b.prompt.trim()}\n\n${HOUSE_STYLE}`;
  const ext = format === "jpeg" ? "jpg" : format;
  const rel = path.posix.join("images", "generated", IMAGE_TYPES[b.type].dir, `${b.slug}.${ext}`);
  const body: Record<string, unknown> = { model, prompt: promptFinal, n: 1, size, quality, output_format: format, background };
  if (format !== "png") body.output_compression = 85;
  return { model, size, quality, format, background, promptFinal, body, file: path.join(PUBLIC_DIR, rel), src: `/${rel}` };
}

// ---------------------------------------------------------------- API

type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

/** API を1回呼び、画像のバイト列を返す。失敗したら原因が分かるメッセージで ImageToolError を投げる（ファイルは作らない） */
export async function callImageApi(req: ResolvedRequest, env: Record<string, string | undefined> = process.env, fetchImpl: FetchLike = fetch): Promise<{ bytes: Buffer; revisedPrompt: string | null; usage: unknown }> {
  const key = env.OPENAI_API_KEY;
  if (!key) {
    throw new ImageToolError(
      "OPENAI_API_KEY が設定されていません。career-media/.env.local に OPENAI_API_KEY=... を書くか、環境変数で渡してください（キーはチャットやファイルに貼らず、commit もしない）。API を呼ばずに確認するなら --dry-run を付けてください",
    );
  }
  const base = (env.OPENAI_BASE_URL || API_URL_DEFAULT).replace(/\/$/, "");
  let res: Response;
  try {
    res = await fetchImpl(`${base}/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(240_000),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new ImageToolError(`OpenAI API に接続できませんでした（${msg}）。ネットワークで api.openai.com への接続が許可されているか確認してください`);
  }
  const text = await res.text();
  let json: { data?: { b64_json?: string; url?: string; revised_prompt?: string }[]; usage?: unknown; error?: { message?: string; code?: string; type?: string } } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    // JSON でない応答（プロキシのエラーページなど）
  }
  if (!res.ok) {
    const detail = json.error?.message ?? text.slice(0, 300);
    if (res.status === 401) throw new ImageToolError(`API キーが無効です（401）。OPENAI_API_KEY を確認してください: ${detail}`);
    if (res.status === 403) throw new ImageToolError(`このキーまたは組織では画像生成が許可されていないか、ネットワークで拒否されました（403）: ${detail}`);
    if (res.status === 429) {
      const retry = res.headers.get("retry-after");
      throw new ImageToolError(`利用上限またはレート制限に達しました（429）${retry ? `。${retry}秒後に再試行できます` : ""}。請求・上限の設定も確認してください: ${detail}`);
    }
    if (res.status === 400) throw new ImageToolError(`リクエストが受け付けられませんでした（400）。size・quality・model の組み合わせや、内容のポリシーに当たっていないか確認してください: ${detail}`);
    throw new ImageToolError(`OpenAI API がエラーを返しました（${res.status}）: ${detail}`);
  }
  const item = json.data?.[0];
  let bytes: Buffer | null = null;
  if (item?.b64_json) bytes = Buffer.from(item.b64_json, "base64");
  else if (item?.url) {
    // URL で返すモデル用（GPT Image 系は常に base64）
    const img = await fetchImpl(item.url, { method: "GET" });
    if (!img.ok) throw new ImageToolError(`生成画像のダウンロードに失敗しました（${img.status}）`);
    bytes = Buffer.from(await img.arrayBuffer());
  }
  if (!bytes || bytes.length === 0) throw new ImageToolError("API の応答に画像が入っていませんでした（data[0].b64_json / url が空）");
  return { bytes, revisedPrompt: item?.revised_prompt ?? null, usage: json.usage ?? null };
}

// ---------------------------------------------------------------- 画像ファイル

/** PNG / JPEG / WebP のヘッダから形式と縦横を読む。画像でなければ null */
export function imageInfo(buf: Buffer): { format: "png" | "jpeg" | "webp"; width: number; height: number } | null {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { format: "png", width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { format: "jpeg", height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      i += 2 + len;
    }
    return null;
  }
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { format: "webp", width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { format: "webp", width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { format: "webp", width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  return null;
}

const rel = (abs: string) => path.relative(ROOT, abs).split(path.sep).join("/");
export const metaPath = (slug: string) => path.join(META_DIR, `${slug}.json`);

export function readMeta(slug: string): ImageMeta | null {
  const p = metaPath(slug);
  return fs.existsSync(p) ? (JSON.parse(fs.readFileSync(p, "utf8")) as ImageMeta) : null;
}

export function writeMeta(meta: ImageMeta) {
  fs.mkdirSync(META_DIR, { recursive: true });
  fs.writeFileSync(metaPath(meta.slug), JSON.stringify(meta, null, 2) + "\n");
}

/** 生成から保存までの1回分。dryRun のときは API を呼ばず、保存先と prompt を返すだけ */
export async function generate(
  brief: Brief,
  opts: { dryRun?: boolean; force?: boolean; houseStyle?: boolean; env?: Record<string, string | undefined>; fetchImpl?: FetchLike; now?: Date } = {},
): Promise<{ request: ResolvedRequest; meta: ImageMeta | null }> {
  const env = opts.env ?? process.env;
  const request = resolveRequest(brief, env, { houseStyle: opts.houseStyle });
  const previous = readMeta(brief.slug);
  if (opts.dryRun) return { request, meta: null };
  if (previous && !opts.force) {
    throw new ImageToolError(`"${brief.slug}" はすでに生成済みです（${previous.src}、状態: ${previous.status}）。作り直すときは --force（前の画像は .image-history/ に残します）`);
  }

  const { bytes, revisedPrompt, usage } = await callImageApi(request, env, opts.fetchImpl);
  const info = imageInfo(bytes);
  if (!info) throw new ImageToolError("API から返ったデータが PNG / JPEG / WebP として読めません。保存せずに中止しました");

  // 前の画像は消さずにローカルの履歴へ移す
  if (previous) {
    const oldFile = path.join(ROOT, previous.file);
    if (fs.existsSync(oldFile)) {
      fs.mkdirSync(HISTORY_DIR, { recursive: true });
      fs.renameSync(oldFile, path.join(HISTORY_DIR, `${previous.slug}-${previous.generated_at.replace(/[:.]/g, "-")}${path.extname(oldFile)}`));
    }
  }
  fs.mkdirSync(path.dirname(request.file), { recursive: true });
  const tmp = `${request.file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, bytes);
  fs.renameSync(tmp, request.file);

  const meta: ImageMeta = {
    schema_version: 1,
    slug: brief.slug,
    type: brief.type,
    status: "draft",
    purpose: brief.purpose ?? "",
    used_in: brief.usedIn,
    alt: brief.decorative ? "" : brief.alt,
    decorative: brief.decorative,
    brief_file: brief.briefFile ? rel(path.resolve(brief.briefFile)) : null,
    model: request.model,
    size: request.size,
    quality: request.quality,
    output_format: info.format,
    background: request.background,
    prompt_brief: brief.prompt,
    prompt_final: request.promptFinal,
    revised_prompt: revisedPrompt,
    generated_at: (opts.now ?? new Date()).toISOString(),
    src: request.src,
    file: rel(request.file),
    width: info.width,
    height: info.height,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    usage,
    regenerated_from: previous ? { generated_at: previous.generated_at, sha256: previous.sha256, prompt_final: previous.prompt_final } : null,
    notes: brief.notes ?? "",
  };
  writeMeta(meta);
  writeIndex();
  return { request, meta };
}

// ---------------------------------------------------------------- 一覧・検査・状態

export function listMeta(): ImageMeta[] {
  if (!fs.existsSync(META_DIR)) return [];
  return fs
    .readdirSync(META_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(META_DIR, f), "utf8")) as ImageMeta);
}

/** サイトが読む content/images/index.json を作り直す */
export function writeIndex(): ImageIndex {
  const index: ImageIndex = {
    images: listMeta().map((m) => ({ slug: m.slug, type: m.type, status: m.status, src: m.src, width: m.width, height: m.height, alt: m.alt, decorative: m.decorative, used_in: m.used_in })),
  };
  fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + "\n");
  return index;
}

export function setStatus(slug: string, status: ImageStatus): ImageMeta {
  if (!(STATUSES as readonly string[]).includes(status)) throw new ImageToolError(`状態は ${STATUSES.join(" / ")}: "${status}"`);
  const meta = readMeta(slug);
  if (!meta) throw new ImageToolError(`記録がありません: ${slug}`);
  meta.status = status;
  writeMeta(meta);
  writeIndex();
  return meta;
}

/** 記録と実ファイルが食い違っていないかを確かめる。問題の一覧を返す */
export function validateAll(): string[] {
  const problems: string[] = [];
  const metas = listMeta();
  const known = new Set(metas.map((m) => m.file));
  for (const m of metas) {
    const abs = path.join(ROOT, m.file);
    if (!fs.existsSync(abs)) {
      problems.push(`${m.slug}: 画像ファイルがありません（${m.file}）`);
      continue;
    }
    const buf = fs.readFileSync(abs);
    const info = imageInfo(buf);
    if (!info) problems.push(`${m.slug}: 画像として読めません（${m.file}）`);
    else if (info.width !== m.width || info.height !== m.height) problems.push(`${m.slug}: 記録の縦横（${m.width}x${m.height}）と実際（${info.width}x${info.height}）が違います`);
    if (crypto.createHash("sha256").update(buf).digest("hex") !== m.sha256) problems.push(`${m.slug}: 記録の後に画像が書き換えられています（sha256 不一致）`);
    if (!m.decorative && !m.alt.trim()) problems.push(`${m.slug}: alt がありません`);
    if (m.src !== `/${path.relative(PUBLIC_DIR, abs).split(path.sep).join("/")}`) problems.push(`${m.slug}: src と file が一致しません`);
  }
  if (fs.existsSync(GENERATED_DIR)) {
    for (const f of walk(GENERATED_DIR)) {
      if (!known.has(rel(f))) problems.push(`記録のない画像があります: ${rel(f)}（不要なら削除、使うなら作り直して記録を残す）`);
    }
  }
  const index = fs.existsSync(INDEX_FILE) ? (JSON.parse(fs.readFileSync(INDEX_FILE, "utf8")) as ImageIndex) : { images: [] };
  const expected = metas.map((m) => `${m.slug}:${m.status}:${m.src}`).join("|");
  if (index.images.map((i) => `${i.slug}:${i.status}:${i.src}`).join("|") !== expected) problems.push("content/images/index.json が記録と合っていません（npm run image:index で作り直す）");
  return problems;
}

/** status が rejected の画像ファイルと記録を消す */
export function pruneRejected(): string[] {
  const removed: string[] = [];
  for (const m of listMeta().filter((x) => x.status === "rejected")) {
    const abs = path.join(ROOT, m.file);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
    fs.unlinkSync(metaPath(m.slug));
    removed.push(m.slug);
  }
  writeIndex();
  return removed;
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.name.startsWith(".") ? [] : [p];
  });
}
