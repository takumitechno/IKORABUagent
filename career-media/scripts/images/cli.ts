/**
 * 画像生成の CLI（OpenAI Images API）。詳しくは docs/image-briefs/README.md。
 *
 *   npm run image:generate -- --brief docs/image-briefs/hero-home.md          # brief から生成（下書き draft として保存）
 *   npm run image:generate -- --brief docs/image-briefs/hero-home.md --force  # 作り直し（前の画像は .image-history/ へ）
 *   npm run image:dry-run -- --brief docs/image-briefs/hero-home.md           # API を呼ばずに保存先と prompt を確認
 *   npm run image:generate -- --slug x --type section --alt "..." --prompt "..."  # brief なしで1枚
 *   npm run image:status -- hero-home selected     # サイトに出す（selected）/ 下書き（draft）/ 不採用（rejected）
 *   npm run image:index                            # content/images/index.json を作り直す
 *   npm run image:validate                         # 記録と画像ファイルの食い違いを検査
 *   npm run image:prune                            # rejected の画像と記録を消す
 *
 * API キーは OPENAI_API_KEY（career-media/.env.local でも可）。モデルは OPENAI_IMAGE_MODEL（既定 gpt-image-2）。
 */
import fs from "node:fs";
import path from "node:path";
import { generate, ImageToolError, parseBrief, pruneRejected, ROOT, setStatus, validateAll, validateBrief, writeIndex, type Brief, type ImageStatus, type ImageType } from "./lib";

const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(`--${name}`);
function opt(name: string): string | undefined {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : undefined;
}

// .env.local / .env があれば読む（すでに環境変数にある値は上書きしない）
for (const f of [".env.local", ".env"]) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) {
    try {
      process.loadEnvFile(p);
    } catch {
      // 読めない .env は無視する（値は表示しない）
    }
  }
}

function briefFromArgs(): Brief {
  const file = opt("brief") ?? opt("prompt-file");
  if (file) {
    const abs = path.resolve(process.cwd(), file);
    if (!fs.existsSync(abs)) throw new ImageToolError(`brief が見つかりません: ${file}`);
    const b = parseBrief(fs.readFileSync(abs, "utf8"), abs);
    // コマンドで指定した値を優先する
    return validateBrief({ ...b, size: opt("size") ?? b.size, quality: opt("quality") ?? b.quality, format: opt("format") ?? b.format, background: opt("background") ?? b.background });
  }
  return validateBrief({
    slug: opt("slug") ?? "",
    type: (opt("type") ?? "") as ImageType,
    prompt: opt("prompt") ?? "",
    alt: opt("alt") ?? "",
    decorative: flag("decorative"),
    usedIn: opt("used-in") ? [opt("used-in")!] : [],
    size: opt("size"),
    quality: opt("quality"),
    format: opt("format"),
    background: opt("background"),
    purpose: opt("purpose"),
  });
}

async function main() {
  const cmd = argv[0];
  switch (cmd) {
    case "generate": {
      const brief = briefFromArgs();
      const dryRun = flag("dry-run");
      const { request, meta } = await generate(brief, { dryRun, force: flag("force"), houseStyle: !flag("no-house-style") });
      if (dryRun) {
        console.log("DRY RUN（API は呼んでいません。費用はかかりません）");
        console.log(`  slug    : ${brief.slug}（${brief.type}）`);
        console.log(`  保存先  : ${path.relative(ROOT, request.file)}  → サイトでは ${request.src}`);
        console.log(`  model   : ${request.model} / size ${request.size} / quality ${request.quality} / ${request.format} / background ${request.background}`);
        console.log(`  alt     : ${brief.decorative ? "（飾りの画像: alt なし）" : brief.alt}`);
        console.log("  prompt  :\n" + request.promptFinal.replace(/^/gm, "    "));
        return;
      }
      console.log(`保存しました: ${meta!.file}（${meta!.width}x${meta!.height}, ${(meta!.bytes / 1024).toFixed(0)} KB）`);
      console.log(`記録: content/images/meta/${meta!.slug}.json（状態: draft。確認してサイトに出すなら npm run image:status -- ${meta!.slug} selected）`);
      return;
    }
    case "status": {
      const [slug, status] = argv.slice(1);
      const m = setStatus(slug, status as ImageStatus);
      console.log(`${m.slug}: ${m.status}`);
      return;
    }
    case "index": {
      const idx = writeIndex();
      console.log(`content/images/index.json を作り直しました（${idx.images.length}件、うちサイトに出すもの ${idx.images.filter((i) => i.status === "selected").length}件）`);
      for (const i of idx.images) console.log(`  ${i.status.padEnd(8)} ${i.slug.padEnd(28)} ${i.src}`);
      return;
    }
    case "validate": {
      const problems = validateAll();
      if (problems.length) {
        for (const p of problems) console.error(`NG ${p}`);
        process.exitCode = 1;
      } else console.log("OK: 画像と記録は一致しています");
      return;
    }
    case "prune": {
      const removed = pruneRejected();
      console.log(removed.length ? `削除しました: ${removed.join(", ")}` : "rejected の画像はありません");
      return;
    }
    default:
      console.log("usage: tsx scripts/images/cli.ts <generate|status|index|validate|prune> ...（ファイル先頭のコメントを参照）");
      process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e instanceof ImageToolError ? `エラー: ${e.message}` : e);
  process.exitCode = 1;
});
