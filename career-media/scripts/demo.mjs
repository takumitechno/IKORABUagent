// 商談・提案用のデモを、この PC の中だけで起動する（Windows / macOS / Linux 共通）。
//
//   npm run demo                 # 中立デモ「はじめて転職ガイド」          → http://localhost:3000
//   npm run demo:makecareer      # MakeCareer様 商談用プレビュー（非公開）   → http://localhost:3100
//   npm run demo -- --skip-build # 2回目以降、ビルドを省略
//   npm run demo -- --port 3200  # ポートを変える
//
// - どちらも 127.0.0.1 にだけ bind する（同じネットワークの他の端末やインターネットからは見えない）。
// - 商談用ページ（/sales: Instagram 投稿案・提案書・計測設計）を有効にして起動する（SALES_DEMO=1）。
// - 本番送客のスイッチ PARTNER_LIVE_OUTBOUND は必ず外して起動する。相談ボタンはサイト内の説明ページに留まる。
// - ビルドはプロファイルごとに別フォルダ（.next-neutral / .next-makecareer）に置く。
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROFILES = {
  neutral: { port: 3000, distDir: ".next-neutral", env: {} },
  makecareer: { port: 3100, distDir: ".next-makecareer", env: { PARTNER_PROFILE: "makecareer" } },
};

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith("--")) ?? "neutral";
const profile = PROFILES[name];
if (!profile) {
  console.error(`プロファイルは ${Object.keys(PROFILES).join(" / ")} のどちらかを指定してください: ${name}`);
  process.exit(1);
}
const portArg = args.indexOf("--port");
const port = portArg >= 0 ? Number(args[portArg + 1]) : profile.port;
const skipBuild = args.includes("--skip-build");
const url = `http://localhost:${port}`;

const env = { ...process.env, ...profile.env, SALES_DEMO: "1", NEXT_DIST_DIR: profile.distDir, NEXT_PUBLIC_SITE_URL: url, NEXT_TELEMETRY_DISABLED: "1" };
// 本番送客は、このスクリプトからは絶対に有効にしない
delete env.PARTNER_LIVE_OUTBOUND;
delete env.PARTNER_CONSULTATION_URL;
delete env.SITE_INDEXABLE;
if (name === "neutral") delete env.PARTNER_PROFILE;

const nextBin = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
if (!fs.existsSync(nextBin)) {
  console.error("依存パッケージがありません。先に npm ci を実行してください。");
  process.exit(1);
}

function run(argv) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, ...argv], { cwd: ROOT, env, stdio: "inherit" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`next ${argv[0]} が失敗しました（終了コード ${code}）`))));
  });
}

const label = name === "makecareer" ? "MakeCareer様 商談用プレビュー（非公開）" : "中立デモ（はじめて転職ガイド）";
try {
  if (skipBuild && fs.existsSync(path.join(ROOT, profile.distDir, "BUILD_ID"))) {
    console.log(`[1/2] ビルドを省略します（${profile.distDir}）`);
  } else {
    console.log(`[1/2] ${label} をビルドしています...`);
    await run(["build"]);
  }
  console.log(`[2/2] 起動します → ${url}  （商談メニュー: ${url}/sales）  停止は Ctrl+C`);
  await run(["start", "-p", String(port), "-H", "127.0.0.1"]);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
