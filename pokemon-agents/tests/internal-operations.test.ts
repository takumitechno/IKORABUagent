import { Database } from "bun:sqlite";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadThreadsDashboard } from "../web/lib/threads-dashboard";
import { AGENT_CHARACTER_IMAGES, findAgentCharacter, resolveAgentCharacterImage } from "../web/lib/agent-character-images";
import { renderInternalOperations } from "../web/routes/internal-operations";
import { renderOverview } from "../web/routes/overview";
import {
  accountResponseV1,
  contentResponseV1,
  editorialCustomerV1,
  editorialCycleV1,
  editorialExperimentV1,
  editorialInternalV1,
  manualThreadV1,
  recentContentV1,
  recentPublicationV1,
  safetyResponseV1,
} from "./threads-bridge-v1-fixtures";

function agentDb(): Database {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE agents (id INTEGER PRIMARY KEY, display_name TEXT, pokemon_jp TEXT, avatar_url TEXT, slug TEXT, role_label TEXT, role TEXT, status TEXT);
    CREATE TABLE issues (id INTEGER PRIMARY KEY, assignee_agent_id INTEGER, title TEXT, status TEXT, priority INTEGER, updated_at TEXT);
    CREATE TABLE reflections (id INTEGER PRIMARY KEY, agent_id INTEGER, agent_slug TEXT, status TEXT, created_at TEXT, session_id TEXT, work_dir TEXT);
    INSERT INTO agents VALUES
      (1,'指原 (sashihara-orchestrator)','指原',NULL,'sashihara-orchestrator','Chief Operating Editor','orchestrator','active'),
      (2,'衣織 (iori-validator)','衣織',NULL,'iori-validator','Evidence Validator','validator','active'),
      (3,'舞香 (maika-hypothesizer)','舞香',NULL,'maika-hypothesizer','Hypothesis & Experiment Designer','hypothesizer','active'),
      (4,'瞳 (hitomi-selector)','瞳',NULL,'hitomi-selector','Offer & Strategy Selector','selector','active'),
      (5,'杏奈 (anna-supervisor)','杏奈',NULL,'anna-supervisor','Bounded Improvement Proposer','supervisor','active'),
      (6,'樹愛羅 (kiara-executor)','樹愛羅',NULL,'kiara-executor','Exact Approved Artifact Executor','executor','active'),
      (7,'はな (hana-heartbeat)','はな',NULL,'hana-heartbeat','Expected vs Observed Reliability Monitor','auditor','active'),
      (8,'りさ (risa-notifier)','りさ',NULL,'risa-notifier','Notification Policy Owner','solo','active'),
      (9,'しょうこ (shoko-reporter)','しょうこ',NULL,'shoko-reporter','Research Collector / Research Correspondent','researcher','active'),
      (10,'みりにゃ (mirinya-cost-analyst)','みりにゃ',NULL,'mirinya-cost-analyst','Revenue / Conversion / Cost / Margin / Unit Economics','auditor','active'),
      (11,'さなつん (sanatsun-knowledge-editor)','さなつん',NULL,'sanatsun-knowledge-editor','Verified Knowledge Lifecycle Editor','solo','active');
    INSERT INTO issues VALUES (1,1,'Bridge接続を確認','in_progress',1,'2026-09-21T00:00:00Z');
    INSERT INTO issues VALUES (2,2,'Evidenceの再確認','blocked',1,'2026-09-21T00:00:00Z');
    INSERT INTO reflections (id,agent_id,agent_slug,status,created_at)
      VALUES (1,1,'sashihara-orchestrator','completed','2026-09-21T00:00:00Z');
  `);
  return db;
}

function agentCard(html: string, agentId: string): string {
  const marker = `data-agent="${agentId}"`;
  const markerAt = html.indexOf(marker);
  if (markerAt < 0) return "";
  const start = html.lastIndexOf("<article", markerAt);
  const end = html.indexOf("</article>", markerAt);
  return start >= 0 && end >= 0 ? html.slice(start, end + "</article>".length) : "";
}

describe("internal operations dashboard", () => {
  test("keeps one explicit, alias-tolerant character-image mapping without external image fallback", () => {
    expect(AGENT_CHARACTER_IMAGES).toHaveLength(11);
    expect(findAgentCharacter({ slug: "unknown", pokemon_jp: "指原", display_name: "" })?.agentId).toBe("sashihara-orchestrator");
    expect(findAgentCharacter({ slug: "IORI_validator", pokemon_jp: "", display_name: "" })?.displayName).toBe("衣織");
    expect(findAgentCharacter({ slug: "unknown", pokemon_jp: "", display_name: "舞香 (legacy-key)" })?.agentId).toBe("maika-hypothesizer");
    expect(AGENT_CHARACTER_IMAGES.filter((character) => character.imagePath)).toHaveLength(10);
    expect(Object.fromEntries(AGENT_CHARACTER_IMAGES.map((character) => [character.displayName, character.imagePath]))).toEqual({
      指原: null,
      衣織: "/internal-assets/member-photos/iori.jpg",
      舞香: "/internal-assets/member-photos/maika.jpg",
      瞳: "/internal-assets/member-photos/hitomi.jpg",
      杏奈: "/internal-assets/member-photos/anna.jpg",
      樹愛羅: "/internal-assets/member-photos/kiara.jpg",
      はな: "/internal-assets/member-photos/hana.jpg",
      りさ: "/internal-assets/member-photos/risa.jpg",
      しょうこ: "/internal-assets/member-photos/shoko.jpg",
      みりにゃ: "/internal-assets/member-photos/mirinya.jpg",
      さなつん: "/internal-assets/member-photos/sanatsun.jpg",
    });
    expect(findAgentCharacter({ slug: "iori-validator" })?.imagePath).toBe("/internal-assets/member-photos/iori.jpg");
    expect(findAgentCharacter({ slug: "sashihara-orchestrator" })?.imagePath).toBeNull();
    expect(resolveAgentCharacterImage({ slug: "iori-validator", avatar_url: "/agents/iori.png" })).toBe("/agents/iori.png");
    expect(resolveAgentCharacterImage({ slug: "iori-validator", avatar_url: "https://example.com/iori.png" })).toBe("/internal-assets/member-photos/iori.jpg");
    expect(resolveAgentCharacterImage({ slug: "unknown", avatar_url: "https://example.com/unknown.png" })).toBeNull();
    const seedSource = readFileSync(resolve(import.meta.dir, "../scripts/seed-agents-from-md.ts"), "utf8");
    expect(seedSource).toContain('findAgentCharacter({ slug: identitySlug })?.imagePath ?? null');
  });

  test("renders safety, NIGHT batch, policy flags and agents without secret fields", async () => {
    const fetcher = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/autopilot/v2/safety/status")) return Response.json(safetyResponseV1({
        global_stop: false, account_stop: false, capability_stop: false,
        approval_mode: "human", unresolved_ambiguous_publication: false,
        rate_guard_ready: true,
        rate_policy: { min_interval_seconds: 600, hourly_limit: 2, daily_limit: 5 },
        admin_key: "must-never-render",
      }));
      if (url.includes("/editorial/internal")) return Response.json(editorialInternalV1());
      if (url.includes("/editorial/customer")) return Response.json(editorialCustomerV1());
      if (url.endsWith("/operator/accounts/acct_8ssana")) return Response.json(accountResponseV1({
        account_id: "acct_8ssana", handle: "8ssana", display_name: "Sana", account_status: "active",
        access_token: "must-never-render", pipeline: { n_metrics: 4, has_learning_snapshot: true },
        operations: {
          rolling_usage: { publications_last_hour: 1, publications_last_24h: 3 },
          features: { manual_post_sync: true, self_reply_sync: "active" },
          night_batch_items: [{ item_id: "item-1", batch_id: "batch-1", content_id: "content-1", scheduled_at: "2026-09-21T12:00:00Z", status: "pending", block_reason: null, attempted_at: null, batch_status: "approved", expires_at: "2026-09-22T12:00:00Z" }],
        },
        manual_posts: [manualThreadV1({ detection_id: "manual-1", external_post_id: "external-1", body_text: "手動投稿本文", published_at: "2026-09-21T01:00:00Z", origin: "human_manual", analyze_enabled: true, learn_enabled: false, tracking_state: "tracked", logical_thread_id: "thread-1", root_external_id: "external-1", part_index: 0, n_parts: 1, detected_at: "2026-09-21T01:00:00Z", updated_at: "2026-09-21T01:00:00Z" })],
        recent_contents: [recentContentV1({ content_id: "content-1" })], recent_publications: [recentPublicationV1({
          content_id: "content-1", mode: "live", status: "succeeded",
          published_at: "2026-09-21T02:00:00Z",
        })],
      }));
      if (url.endsWith("/contents/content-1")) return Response.json(contentResponseV1({
        content_id: "content-1", topic: "内部テスト", content_role: "reach", body_text: "実投稿本文",
        parts: ["実投稿本文"], state: "publish_ready", qa: { verdict: "pass" },
        approved_for_current_body: true, origin: "ai_auto", analyze_enabled: true, learn_enabled: false,
        publications: [{ mode: "live", status: "succeeded", external_publish_id: "external-live-1",
          published_at: "2026-09-21T02:00:00Z", parts_state: [{ external_id: "external-live-1", published_at: "2026-09-21T02:00:00Z" }] }],
        metrics: { views: 120, likes: 4, replies: 2, reposts: 0, quotes: 0 },
        metrics_observation: { observed_at: "2026-09-21T04:00:00Z", fetched_at: "2026-09-21T04:00:05Z", available_keys: ["views", "likes", "replies", "reposts", "quotes"], source: "threads_insights" },
      }));
      return new Response("not found", { status: 404 });
    }) as typeof fetch;
    const data = await loadThreadsDashboard({ bridgeUrl: "http://127.0.0.1:8765", fetcher });
    const db = agentDb();
    const html = renderInternalOperations(db, data, [
      { accountId: "acct_8ssana", handle: "8ssana", displayName: "Sana", accountStatus: "active" },
      { accountId: "acct_other", handle: "other", displayName: "Other", accountStatus: "paused" },
    ]);
    expect(html).toContain("匠 Technologies");
    expect(html).toContain("=LOVE AGENT OS · INTERNAL HQ");
    expect(html).toContain("＝LOVE Agent OSの事務所");
    expect(html.match(/class="hq-person /g)).toHaveLength(11);
    expect(html.match(/data-avatar="image"/g)).toHaveLength(10);
    expect(html.match(/data-avatar="fallback"/g)).toHaveLength(1);
    expect(html).toContain('/internal-assets/member-photos/iori.jpg');
    expect(html).toContain("稼働中");
    expect(html).toContain("待機");
    expect(html).toContain("要確認");
    expect(html).toContain("Bridge接続を確認");
    expect(html).toContain("Evidenceの再確認");
    expect(html).toContain("詳細Agent状態を見る");
    expect(html).toContain("/bg/internal-hq-office.png");
    expect(html).toContain('data-agent="sashihara-orchestrator" data-zone="command" data-avatar="fallback" style="--agent-left:86%;--agent-top:25%"');
    expect(html).toContain('class="hq-person accent-rose state-ok is-commander"');
    expect(html).toContain('data-agent="sanatsun-knowledge-editor" data-zone="center" data-avatar="image" style="--agent-left:50%;--agent-top:57%"');
    expect(html.match(/<article class="hq-person [^>]+data-zone="command"/g)).toHaveLength(6);
    expect(html.match(/<article class="hq-person [^>]+data-zone="center"/g)).toHaveLength(1);
    expect(html.match(/<article class="hq-person [^>]+data-zone="operations"/g)).toHaveLength(4);
    expect(html.match(/data-hero-role=/g)).toHaveLength(11);
    for (const role of ["Chief Operating Editor", "Bounded Improvement Proposer", "Hypothesis & Experiment Designer", "Offer & Strategy Selector", "Evidence Validator", "Exact Approved Artifact Executor", "Expected vs Observed Reliability Monitor", "Notification Policy Owner", "Research Collector / Research Correspondent", "Revenue / Conversion / Cost / Margin / Unit Economics", "Verified Knowledge Lifecycle Editor"]) {
      expect(html).toContain(`data-hero-role="${role.replaceAll("&", "&amp;")}"`);
    }
    expect(html).toContain('m3 7 4.5 4L12 4l4.5 7L21 7l-2 11H5L3 7Z');
    expect(html.indexOf("＝LOVE Agent OSの事務所")).toBeLessThan(html.indexOf("MISSION CONTROL"));
    expect(html).toContain("batch-1");
    expect(html).toContain("指原");
    expect(html).toContain("root + 自分へのreplyを論理thread化");
    expect(html).toContain("学習対象");
    expect(html).toContain('name="account_id"');
    expect(html).toContain('value="acct_8ssana" selected');
    expect(html).toContain('value="acct_other"');
    expect(html).toContain('type="hidden" name="account_id" value="acct_8ssana"');
    expect(html).toContain("60.0 views/hour");
    expect(html).toContain("3.0 engagement/hour");
    expect(html).toContain("shares</b>unavailable");
    expect(html).toContain("last fetched");
    expect(html).toContain("現時点の仮説");
    expect(html).not.toContain("must-never-render");
    expect(html).not.toContain("access_token");
    expect(html).not.toContain("admin_key");
    const customerHtml = renderOverview(db, data);
    for (const agentName of ["指原", "衣織", "舞香", "瞳", "杏奈", "樹愛羅", "はな", "りさ", "しょうこ", "みりにゃ", "さなつん"]) {
      expect(customerHtml).not.toContain(agentName);
    }
    expect(customerHtml).not.toContain('name="account_id"');
    expect(customerHtml).not.toContain("internal-hq-office.png");
    expect(customerHtml).not.toContain("INTERNAL HQ");
    expect(customerHtml).not.toContain("詳細Agent状態");
    db.close();
  });

  test("missing Bridge stays waiting and never substitutes demo values", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      fetcher: (async () => { throw new Error("offline"); }) as typeof fetch,
      timeoutMs: 20,
    });
    const db = agentDb();
    const html = renderInternalOperations(db, data);
    expect(html).toContain("接続エラー");
    expect(html).toContain("接続待ち");
    expect(html).toContain("デモ値には置換しません");
    expect(html).toContain('name="account_id" disabled');
    expect(html).toContain("＝LOVE Agent OSの事務所");
    expect(html).toContain("稼働中");
    expect(html.indexOf("本日の運用")).toBeLessThan(html.indexOf("MISSION CONTROL"));
    expect(html).not.toContain("デモ補助");
    db.close();
  });

  test("shows missing reply scope without inventing self-reply data", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      fetcher: (async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/autopilot/v2/safety/status")) return Response.json(safetyResponseV1());
        if (url.includes("/editorial/internal")) return Response.json(editorialInternalV1());
        if (url.includes("/editorial/customer")) return Response.json(editorialCustomerV1());
        return Response.json(accountResponseV1({
          account_id: "acct_8ssana", handle: "8ssana", account_status: "active",
          recent_contents: [], recent_publications: [], manual_posts: [],
          operations: {
            features: { manual_post_sync: true, self_reply_sync: "reauthorization_required" },
            night_batch_items: [], rolling_usage: {},
          },
        }));
      }) as typeof fetch,
    });
    const db = agentDb();
    const html = renderInternalOperations(db, data);
    expect(data.operations.manualPostSyncAvailable).toBe(true);
    expect(data.operations.selfReplySync).toBe("reauthorization_required");
    expect(html).toContain("再認可が必要（root Manual Syncは継続）");
    expect(html).toContain("未取得データは表示しません");
    expect(html).not.toContain("root + 自分へのreplyを論理thread化");
    db.close();
  });

  test("shows editorial meeting summaries internally and hides them from customer HTML", async () => {
    const data = await loadThreadsDashboard({
      bridgeUrl: "http://127.0.0.1:8765",
      fetcher: (async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/editorial/internal")) return Response.json(editorialInternalV1({
          cycle: editorialCycleV1({
            state: "CRITIQUE", status: "READY", current_agent: "Voice Judge",
            waiting_reason: null,
            summary: {
              facts: ["指標取得済み 3件。"], unknowns: ["因果は未確定。"],
              proposals: [{ hypothesis: "endingで返信率が変わる可能性。" }],
              critiques: [{ agent: "Voice Judge", critique: "問いかけの常用に反対。" }],
              rejected_options: [{ reason: "今回は変数を1つに限定。" }],
              final_decision: { test_variable: "ending" },
            },
          }),
          experiments: [editorialExperimentV1({ experiment_id: "exp-1", test_variable: "ending", status: "planned", evidence_level: "hypothesis_only" })],
        }));
        if (url.includes("/editorial/customer")) return Response.json(editorialCustomerV1({
          summary: { "今回試したこと": "ending", "確認できた事実": ["指標取得済み 3件。"], "次回変えること": "ending" },
        }));
        if (url.includes("/safety/status")) return Response.json(safetyResponseV1());
        return Response.json(accountResponseV1({
          account_id: "acct_8ssana", handle: "8ssana", account_status: "active",
          recent_contents: [], recent_publications: [], manual_posts: [], operations: {},
        }));
      }) as typeof fetch,
    });
    const db = agentDb();
    const internal = renderInternalOperations(db, data);
    const customer = renderOverview(db, data);
    const poisonedCustomer = renderOverview(db, {
      ...data,
      internal_activity: {
        activity_id: "org02-customer-poison",
        decision_summary: "org02-internal-activity-sentinel",
        raw_prompt: "must-never-render",
      },
    } as any);
    expect(internal).toContain("今日の編集会議");
    expect(internal).toContain("Voice監査中");
    expect(agentCard(internal, "sashihara-orchestrator")).not.toContain("Voice監査中");
    expect(agentCard(internal, "sashihara-orchestrator")).not.toContain("Voice Judge");
    expect(internal).toContain("問いかけの常用に反対");
    expect(internal).toContain("exp-1");
    expect(customer).not.toContain("Voice Judge");
    expect(customer).not.toContain("問いかけの常用に反対");
    expect(customer).not.toContain("exp-1");
    expect(poisonedCustomer).not.toContain("org02-customer-poison");
    expect(poisonedCustomer).not.toContain("org02-internal-activity-sentinel");
    expect(poisonedCustomer).not.toContain("raw_prompt");

    const attributed = renderInternalOperations(db, {
      ...data, editorial: { ...data.editorial, currentAgent: "maika-hypothesizer" },
    });
    expect(agentCard(attributed, "maika-hypothesizer")).not.toContain("Maika が担当中");
    expect(agentCard(attributed, "maika-hypothesizer")).toContain("待機");
    expect(agentCard(attributed, "sashihara-orchestrator")).not.toContain("Maika が担当中");

    const unknown = renderInternalOperations(db, {
      ...data, editorial: { ...data.editorial, currentAgent: "unregistered-runner" },
    });
    expect(unknown).toContain("CRITIQUE · 未帰属");
    expect(unknown).not.toContain("unregistered-runner が担当中");
    expect(agentCard(unknown, "sashihara-orchestrator")).not.toContain("unregistered-runner");
    db.close();
  });
});
