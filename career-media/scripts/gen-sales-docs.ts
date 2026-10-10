/**
 * 商談資料のうち、画面と同じデータから作れるものを docs/sales/ に書き出す（正本は src/lib/sales/*・src/lib/measurement/schema.ts）。
 *   npm run sales:docs
 * 手で書く資料（START_HERE・トークスクリプト・確認したいこと・所有と終了・法務など）は docs/sales/ に直接置いている。
 */
import fs from "node:fs";
import path from "node:path";
import { EVENT_DICTIONARY, PARTNER_RETURN_EVENTS, SCHEMA_VERSION } from "../src/lib/measurement/schema";
import { THEME_DELIVERY, PILOT_VALIDATION, ACCEPTANCE_NOTE, INITIAL_SCOPE, PRODUCTION_ROLES, ASSETS_PARTNER, ASSETS_TAKUMI, EXIT_PRINCIPLE, fixedTotal, MONTHLY_SCOPE, OBJECTIONS, OUT_OF_SCOPE, PARTNER_COOPERATION, paymentScenario, PILOT, PLAN, SCENARIO_COUNTS, WORKLOAD, workloadTotal, yen } from "../src/lib/sales/proposal";
import { DEMO_PREPARATION, RUNBOOK, runbookMinutes } from "../src/lib/sales/runbook";
import { SNS_THEMES, utm, type Slide } from "../src/lib/sales/sns";

const OUT = path.resolve(__dirname, "../docs/sales");
const HEADER = (title: string) => `# ${title}\n\n> 自動生成（\`npm run sales:docs\`）。編集は src/lib/sales/ のデータを直してから再生成する。商談用・非公開。\n`;
const write = (name: string, body: string) => {
  fs.mkdirSync(path.dirname(path.join(OUT, name)), { recursive: true });
  fs.writeFileSync(path.join(OUT, name), body.replace(/\n{3,}/g, "\n\n"));
  console.log(`docs/sales/${name}`);
};
const csv = (rows: (string | number)[][]) => rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";

// ---------------------------------------------------------------- 商談の順番
write(
  "MEETING_DEMO_RUNBOOK.md",
  `${HEADER("商談デモの順番（MEETING_DEMO_RUNBOOK）")}
- 起動: \`npm run demo:makecareer\` → http://localhost:3100（商談メニュー: http://localhost:3100/sales）
- 合計 約${runbookMinutes().toFixed(1)}分（切替を含め8分を目安）。技術・ページ数・AI の話から始めない。実物を開いて見せる。
- 相談ボタンは本番の申し込みページへ移動しない（本番送客 OFF）。押すと /consultation/apply（説明ページ）に留まる。

## 事前準備

${DEMO_PREPARATION.map((s) => `- ${s}`).join("\n")}

${RUNBOOK.map(
  (s, i) => `## ${i + 1}. ${s.title}（約${s.minutes}分）

- 開く URL: \`${s.href}\`
- 見せる場所: ${s.show}
- 話すこと: ${s.say}
- 次へのつなぎ: ${s.next}
`,
).join("\n")}`,
);

// ---------------------------------------------------------------- SNS
const slideMd = (s: Slide, i: number) => {
  const l = s.layout;
  const body =
    l.kind === "cover"
      ? `**${l.hook.replace(/\n/g, "")}**／${l.sub}`
      : l.kind === "text"
        ? `**${l.heading}**／${l.lines.join("／")}`
        : l.kind === "compare"
          ? `**${l.heading}**／${l.left.label}: ${l.left.items.join("、")}／${l.right.label}: ${l.right.items.join("、")}${l.arrow ? `／→ ${l.arrow}` : ""}`
          : l.kind === "rows"
            ? `**${l.heading}**／${l.rows.map(([k, v]) => `${k}: ${v}`).join("／")}${l.note ? `／（${l.note}）` : ""}`
            : l.kind === "stats"
              ? `**${l.heading}**／${l.stats.map((x) => `${x.value}${x.unit ?? ""}（${x.label}）`).join("／")}${l.note ? `／（${l.note}）` : ""}`
              : l.kind === "steps"
                ? `**${l.heading}**／${l.steps.map((x) => `${x.label}: ${x.text}`).join("／")}${l.note ? `／（${l.note}）` : ""}`
                : `**${l.heading}**／${l.links.map((x) => `${x.label}（${x.sub}）`).join("／")}／${l.save}`;
  return `| ${i + 1} | ${body} | ${s.alt} |`;
};
for (const t of SNS_THEMES) {
  write(
    `sns/THEME_${t.id.toUpperCase()}.md`,
    `${HEADER(`Instagram 投稿案 テーマ${t.id.toUpperCase()}: ${t.title}`)}
**投稿案 / 未公開。** 実際のアカウント・フォロワー数・反応の数字は作っていない。数字と事実は対応記事の本文にあるものだけ。

- 対象: ${t.audience}
- 対応する記事: [/articles/${t.web.articleSlug}](/articles/${t.web.articleSlug})（${t.web.articleTitle}）
- 読む順番ガイド: ${t.web.journeyHub ? `${t.web.journeyHub}#guide（${t.web.journeyTitle}）` : "なし"}
- 条件整理チェック: /check　相談の説明: /consultation
- 画面で見る: http://localhost:3100/sales/sns/${t.id}（画像の書き出し: \`npm run sns:images\`）

## カルーセル（${t.carousel.slides.length}枚・4:5）

| # | 原稿 | alt（代替テキスト） |
| --- | --- | --- |
${t.carousel.slides.map(slideMd).join("\n")}

### キャプション

${t.carousel.caption}

${t.carousel.hashtags.map((h) => `#${h}`).join(" ")}

- CTA: 保存を促す／プロフィールのリンク → 記事
- 記事 URL（計測用）: \`/articles/${t.web.articleSlug}?${utm(t.id, "carousel")}\`

## リール（${t.reel.length}）— 台本・絵コンテ・制作見本（未撮影）

- つかみ: 「${t.reel.hook}」

| 時間 | テロップ | ナレーション | 映像 |
| --- | --- | --- | --- |
${t.reel.scenes.map((s) => `| ${s.time} | ${s.telop} | ${s.voice} | ${s.visual} |`).join("\n")}

- 必要な素材: ${t.reel.materials.join("／")}
- CTA: ${t.reel.cta}
- 注意: ${t.reel.notes.join("／")}

## Stories（${t.stories.length}枚）

${t.stories.map((s, i) => `${i + 1}. ${s.text} — ${s.sticker}（${s.cta}）`).join("\n")}

## 同じテーマを TikTok で扱う場合の差分メモ（既存運用を置き換えない）

- つかみ: ${t.tiktok.hook}
- 尺: ${t.tiktok.length}
- テロップ: ${t.tiktok.telop}
- 導線: ${t.tiktok.route}
${t.tiktok.notes.map((n) => `- ${n}`).join("\n")}
`,
  );
}

// ---------------------------------------------------------------- 提案
const scenarioTable = `| 承認面談 | お支払い合計 | 固定費込みの1件あたり |
| --- | --- | --- |
${SCENARIO_COUNTS.map((n) => {
  const s = paymentScenario(n);
  return `| ${n}件 | ${yen(s.total)} | ${s.perMeeting ? `約${yen(s.perMeeting)}` : "—"} |`;
}).join("\n")}`;

write(
  "PILOT_PROPOSAL.md",
  `${HEADER(`Pilot の提案: ${PILOT.name}`)}
${PILOT.oneLiner}

**${PILOT.taxNote}** 件数・検索順位・フォロワー・再生数・面談数は保証しない。

## 価格（Pilot 価格・提案仮条件）

| 項目 | 金額 |
| --- | --- |
| 初期構築 | ${yen(PILOT.initialFee)} |
| 月額 | ${yen(PILOT.monthlyFee)} × ${PILOT.months}か月 |
| 固定部分の合計 | ${yen(fixedTotal)} |
| 成果報酬（案） | 成果条件を満たした初回面談1件 ${yen(PILOT.performanceFeePerMeeting)} |

- 固定費は、制作・運用・Research・改善・資産形成の費用。成果報酬は、合意した成果条件を満たす面談が生まれた場合の追加分。
- 成果報酬 ${yen(PILOT.performanceFeePerMeeting)} は契約済みの条件ではなく、商談用の提案仮条件。

### 単純な費用計算例（成果予測ではない）

${scenarioTable}

固定費込みの1件あたり ＝ ${yen(PILOT.performanceFeePerMeeting)} ＋ ${yen(fixedTotal)} ÷ 件数。「面談単価 ${yen(PILOT.performanceFeePerMeeting)}」だけで説明しない（固定費がある）。
匠の売上と、人材紹介会社が採用企業から受け取る紹介手数料を混同しない。提携先の紹介料・入社率・利益率は推測しない。

## 1テーマの制作と役割分担（例: 接客経験をどう伝える？）

形式は月の制作枠内で選ぶ。すべてのテーマで全形式を作る契約ではない。

| 段階 | 制作・改善するもの | 匠 | 先方 |
| --- | --- | --- | --- |
${THEME_DELIVERY.map((r) => `| ${r.step} | ${r.output} | ${r.takumi} | ${r.partner} |`).join("\n")}

## 新規ドメインの検証と公開前の確認

${PILOT_VALIDATION.map((s) => `- ${s}`).join("\n")}

## 初期費用の納品物・完了条件（案）

| 納品物 | 完了の確認 |
| --- | --- |
${INITIAL_SCOPE.map((s) => `| ${s.deliverable} | ${s.acceptance} |`).join("\n")}

${ACCEPTANCE_NOTE}

## 月額の標準範囲（月4 Research Theme の一案）

${MONTHLY_SCOPE.map((s) => `- **${s.area}**: ${s.items.join("／")}`).join("\n")}

標準に含めないもの: ${OUT_OF_SCOPE.join("、")}。${PRODUCTION_ROLES} 投稿・公開の権限と承認責任は正式契約後に決める。最終的な範囲は、既存 TikTok の素材・撮影体制・出演者・Instagram の目的・社内承認フローを確認して調整する。

## 作業時間の仮説（1か月）

| 作業 | 時間 |
| --- | --- |
${WORKLOAD.map((w) => `| ${w.task} | ${w.hours}時間 |`).join("\n")}
| **合計** | **${workloadTotal}時間** |

- 月10〜12時間で成立するかは仮説。成立するのは、素材が先方提供で、リールは台本・絵コンテまで、修正がまとめて1回の場合。
- 撮影の立ち会い・動画編集・個別の修正の往復が入ると不足する。そのときは品質を下げず、**本数・範囲・価格のどれかを調整**する。
- 月額 ${yen(PILOT.monthlyFee)} ÷ ${workloadTotal}時間 ≒ ${yen(Math.round(PILOT.monthlyFee / workloadTotal))}/時間。Pilot 価格であり、初期構築と営業前の試作（今回の制作）は獲得コストとして記録する。AI を使っても制作時間は0にならない。

## 3か月の進め方

${PLAN.map((p) => `### ${p.month}: ${p.focus}\n\n${p.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n")}

検索（SEO）の成果は3か月では保証しない。

## 残る資産

- 先方に残るもの: ${ASSETS_PARTNER.join("／")}
- 匠Technologies に残るもの: ${ASSETS_TAKUMI.join("／")}
- 原則: ${EXIT_PRINCIPLE}
- 詳しくは [OWNERSHIP_AND_EXIT.md](OWNERSHIP_AND_EXIT.md)

## 先方にお願いしたい協力

${PARTNER_COOPERATION.map((c) => `- ${c}`).join("\n")}
`,
);

write(
  "ONE_PAGE_PROPOSAL.md",
  `${HEADER("提案概要（ONE-PAGE PROPOSAL）")}
画面版（印刷できる）: http://localhost:3100/sales/proposal

**${PILOT.name}** — ${PILOT.oneLiner}

| | |
| --- | --- |
| Instagram のご相談への回答 | 投稿だけでなく、投稿に興味を持った人が読む記事・比べる材料・条件整理・相談の説明までをテーマごとにセットで作る |
| 既存 TikTok との役割 | 置き換えない。TikTok で反応のよいテーマを Research の入力にし、Instagram と記事で「保存して見返す・詳しく読む」を担う |
| Web を付ける理由 | SNS は知るきっかけ、Web は自分の場合を考える場所。迷う人は記事・比較・条件整理へ、すぐ相談したい人は相談の説明へ |
| 3か月 Pilot | 面談数は保証しない。資産・SNS 制作物・運用体制・計測・改善データを残しながら勝ち筋を検証。3か月目に条件を見直す |
| 価格（税別・提案仮条件） | 初期 ${yen(PILOT.initialFee)}＋月額 ${yen(PILOT.monthlyFee)}×${PILOT.months}か月＝固定 ${yen(fixedTotal)}。成果報酬（案）: 承認面談1件 ${yen(PILOT.performanceFeePerMeeting)} |
| 初期納品・完了条件 | ${INITIAL_SCOPE.map((s) => `${s.deliverable}: ${s.acceptance}`).join("／")} |
| 制作と投稿の分担 | ${PRODUCTION_ROLES} |
| 新規ドメインでの検証 | ${PILOT_VALIDATION[0]} ${PILOT_VALIDATION[1]} |
| 公開前の相談条件確認 | ${PILOT_VALIDATION[4]} |
| 先方に残る資産 | ${ASSETS_PARTNER.slice(0, 4).join("／")} |
| 必要な協力 | ${PARTNER_COOPERATION.slice(0, 4).join("／")} |
`,
);

write(
  "OPERATING_PLAN_3M.md",
  `${HEADER("3か月の運用表")}
| 月 | 重点 | やること |
| --- | --- | --- |
${PLAN.map((p) => `| ${p.month} | ${p.focus} | ${p.items.join("、")} |`).join("\n")}

- 毎月: 月4 Research Theme → Web（新規2・更新2）→ Instagram（メイン4・Stories 4セット）→ 月次レポート・30分の打ち合わせ
- 判断の材料: テーマ別の流入・記事の読まれ方・チェックの開始と完了・相談ボタン・（提携後）登録 → 予約 → 面談 → 承認
- 少ない件数で勝ちテーマを決めつけない。SEO の成果は3か月では保証しない。
`,
);

write("OBJECTIONS.md", `${HEADER("よくある反論への短い回答")}\n既存の資産（サイト・TikTok・運用）を否定しない。\n\n${OBJECTIONS.map((o) => `## 「${o.q}」\n\n${o.a}\n`).join("\n")}`);

// ---------------------------------------------------------------- 計測
write(
  "event-dictionary.csv",
  csv([["event_name", "owner", "trigger", "context_fields", "notes", "schema_version"], ...EVENT_DICTIONARY.map((d) => [d.name, d.owner, d.trigger, d.context.join(" "), d.notes, SCHEMA_VERSION])]),
);
write(
  "partner-feedback-template.csv",
  csv([["partner_record_id", "event_name", "occurred_at", "site_session_id", "utm_source", "utm_medium", "utm_campaign", "utm_content", "landing_content_id", "status_reason", "approved_at", "notes"]]),
);
write(
  "partner-feedback-synthetic-example.csv",
  csv([
    ["partner_record_id", "event_name", "occurred_at", "site_session_id", "utm_source", "utm_medium", "utm_campaign", "utm_content", "landing_content_id", "status_reason", "approved_at", "notes"],
    ["SYNTHETIC-0001", "partner_registered", "2026-11-04T10:12:00+09:00", "synthetic-session-a", "instagram", "social", "owned-media-pilot", "theme-b-carousel", "article:sekkyaku-keiken-ikasu", "", "", "架空の例（形式の説明用。実データではない）"],
    ["SYNTHETIC-0001", "meeting_reserved", "2026-11-04T10:30:00+09:00", "synthetic-session-a", "instagram", "social", "owned-media-pilot", "theme-b-carousel", "article:sekkyaku-keiken-ikasu", "", "", "架空の例"],
    ["SYNTHETIC-0001", "meeting_completed", "2026-11-08T14:00:00+09:00", "synthetic-session-a", "instagram", "social", "owned-media-pilot", "theme-b-carousel", "article:sekkyaku-keiken-ikasu", "", "", "架空の例"],
    ["SYNTHETIC-0001", "meeting_approved", "2026-11-15T09:00:00+09:00", "synthetic-session-a", "instagram", "social", "owned-media-pilot", "theme-b-carousel", "article:sekkyaku-keiken-ikasu", "", "2026-11-15", "架空の例"],
    ["SYNTHETIC-0002", "meeting_rejected", "2026-11-09T11:00:00+09:00", "synthetic-session-b", "", "", "", "", "article:donichi-yasumi-nenshu-hikaku", "already_registered", "", "架空の例（既登録で否認）"],
  ]),
);
console.log(`partner return events: ${PARTNER_RETURN_EVENTS.join(", ")}`);
