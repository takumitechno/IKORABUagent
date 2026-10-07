/**
 * 起動中のサーバーの全ページの HTML を取り、本番の申込ページ（提携先の LP）へのリンクが1つもないことを確かめる。
 * JavaScript を使わない確認なので、新しいタブ・URL の直打ち・JavaScript 無効・静的 HTML でも同じ結果になる。
 *
 *   npm run demo:makecareer                       # 別のターミナルで起動しておく
 *   npm run check:outbound -- --base http://127.0.0.1:3100
 *
 * 申込ページの URL は src/config/partner.ts の liveConsultationUrl（全プロファイル分）から読み取る。
 */
import fs from "node:fs";
import path from "node:path";
import { LocalContentRepository } from "../src/lib/content/local-repository";
import { listSiteRoutes } from "./site-routes";

const ROOT = path.resolve(__dirname, "..");
const i = process.argv.indexOf("--base");
const base = (i >= 0 ? process.argv[i + 1] : "http://127.0.0.1:3000").replace(/\/$/, "");

async function main() {
  const partnerSource = fs.readFileSync(path.join(ROOT, "src/config/partner.ts"), "utf8");
  const hosts = [...partnerSource.matchAll(/liveConsultationUrl:\s*"(https?:\/\/[^"]+)"/g)].map((m) => new URL(m[1]).host);
  // 以前のデモで使っていた架空の申込先も、もう使っていないことを確かめる
  hosts.push("consultation.example");
  if (hosts.length < 2) throw new Error("partner.ts から申込ページの URL を読み取れませんでした");

  const routes = [...(await listSiteRoutes(new LocalContentRepository(path.join(ROOT, "content")))), "/consultation/apply", "/sales", "/sales/sns", "/sales/sns/a", "/sales/sns/b", "/sales/sns/c", "/sales/proposal", "/sales/measurement"];
  const problems: string[] = [];
  let pages = 0;
  let consultLinks = 0;
  for (const route of routes) {
    const res = await fetch(base + route, { redirect: "manual" });
    if (route.startsWith("/sales") && res.status === 404) continue; // 商談用ページは SALES_DEMO=1 のときだけ
    if (res.status !== 200) {
      problems.push(`${route}: HTTP ${res.status}`);
      continue;
    }
    pages++;
    const html = await res.text();
    for (const host of hosts) if (html.includes(host)) problems.push(`${route}: 申込ページのホスト ${host} が HTML に含まれています`);
    for (const m of html.matchAll(/<a\b[^>]*data-cta-kind="consultation-apply"[^>]*>/g)) {
      consultLinks++;
      const href = m[0].match(/href="([^"]*)"/)?.[1] ?? "";
      if (!href.startsWith("/consultation/apply")) problems.push(`${route}: 相談の申込ボタンがサイトの外を指しています: ${href}`);
    }
  }
  console.log(`${pages}ページを確認、相談の申込ボタン ${consultLinks}個（すべてサイト内の説明ページを指しているか確認）`);
  console.log(`確認した申込ページのホスト: ${hosts.join(", ")}`);
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log("OK: 本番の申込ページへのリンクはありません（本番送客 OFF）");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
