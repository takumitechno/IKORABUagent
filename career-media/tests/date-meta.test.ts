import { describe, expect, it } from "vitest";
import { announcedLabel } from "@/components/DateMeta";
import { parseArticleFile } from "@/lib/content/parse";
import { mapArticleRow } from "@/lib/content/supabase-repository";
import { buildSeedSql } from "../pipeline/src/seed-sql";

const today = new Date("2026-10-12T03:00:00Z");

describe("news date meaning", () => {
  it("does not turn a past announcement into an effective date", () => {
    expect(announcedLabel("2026-09-03", "announced", today)).toBe("発表日");
    expect(announcedLabel("2026-10-01", "effective", today)).toBe("施行日");
    expect(announcedLabel("2028-10-01", "effective", today)).toBe("施行予定");
    expect(announcedLabel("2028-10-01", "announced", today)).toBe("発表予定");
  });

  it("keeps legacy or unspecified dates neutral", () => {
    expect(announcedLabel("2026-09-03", undefined, today)).toBe("関連日");
    expect(announcedLabel("2028-10-01", undefined, today)).toBe("関連日（予定）");
  });

  it("preserves meaning through Markdown, database mapping and handoff SQL", () => {
    const article = parseArticleFile("---\nupdated_at: 2026-10-12\nnews:\n  announced_at: 2026-09-03\n  date_type: announced\n---\n本文", "date-fixture");
    expect(article.news?.dateType).toBe("announced");
    expect(mapArticleRow({ news_meta: { announced_at: "2026-09-03", date_type: "announced" } }).news?.dateType).toBe("announced");
    expect(mapArticleRow({ news_meta: { date_type: "unverified" } }).news?.dateType).toBeUndefined();
    expect(buildSeedSql([article], [], () => [], () => "fixture")).toContain('"date_type":"announced"');
  });
});
