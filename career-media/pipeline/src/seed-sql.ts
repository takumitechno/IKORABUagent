import type { Article, Category } from "../../src/lib/content/types";
import type { Finding } from "./checks";

/**
 * content/ から Supabase 用の seed.sql を生成する。
 * published の記事は「review で投入 → 出典・版・査読を登録 → published に更新」の順で入れ、
 * DB 側の公開ガード（trigger）を実際に通す。
 */

const q = (v: string | null | undefined) => (v === null || v === undefined ? "null" : `'${v.replace(/'/g, "''")}'`);
const j = (v: unknown) => `${q(JSON.stringify(v ?? null))}::jsonb`;
const arr = (v: string[]) => (v.length ? `array[${v.map(q).join(", ")}]::text[]` : "'{}'::text[]");

function newsMeta(a: Article) {
  if (!a.news) return null;
  return {
    announced_by: a.news.announcedBy,
    announced_at: a.news.announcedAt,
    what_happened: a.news.whatHappened,
    who_is_affected: a.news.whoIsAffected,
    impact_for_career_changers: a.news.impactForCareerChangers,
    unknowns: a.news.unknowns,
    what_to_check: a.news.whatToCheck,
  };
}

export function buildSeedSql(articles: Article[], categories: Category[], check: (a: Article) => Finding[], hash: (a: Article) => string): string {
  const lines: string[] = [
    "-- このファイルは `npm run db:seed-sql` で content/ から生成されます。手で編集しないでください。",
    "begin;",
    "",
    "-- categories",
  ];
  for (const c of categories) {
    lines.push(
      `insert into categories (slug, name, description, icon, sort_order) values (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${q(c.icon)}, ${c.sortOrder}) on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;`,
    );
  }

  for (const a of articles) {
    const initialStatus = a.status === "published" ? "review" : a.status;
    lines.push("", `-- ${a.kind}: ${a.slug} (${a.status})`);
    lines.push(
      `insert into articles (slug, kind, title, summary, body_md, status, featured, published_at, updated_at, reviewed_at, reviewed_by, information_checked_at, seo_title, seo_description, related_slugs, faq, news_meta, research_notes) values (` +
        [
          q(a.slug),
          q(a.kind),
          q(a.title),
          q(a.summary),
          q(a.body),
          q(initialStatus),
          String(a.featured),
          a.publishedAt ? `${q(a.publishedAt)}::timestamptz` : "null",
          `${q(a.updatedAt)}::timestamptz`,
          a.reviewedAt ? `${q(a.reviewedAt)}::timestamptz` : "null",
          q(a.reviewedBy),
          a.informationCheckedAt ? `${q(a.informationCheckedAt)}::timestamptz` : "null",
          q(a.seoTitle),
          q(a.seoDescription),
          arr(a.related),
          j(a.faq.map((f) => ({ q: f.question, a: f.answer }))),
          a.news ? j(newsMeta(a)) : "null",
          a.researchNotes ? j(a.researchNotes) : "null",
        ].join(", ") +
        `) on conflict (slug) do nothing;`,
    );
    a.categories.forEach((slug, i) => {
      lines.push(
        `insert into article_categories (article_id, category_id, is_primary) select a.id, c.id, ${i === 0} from articles a, categories c where a.slug = ${q(a.slug)} and c.slug = ${q(slug)} on conflict do nothing;`,
      );
    });
    a.sources.forEach((s, i) => {
      lines.push(
        `insert into article_sources (article_id, title, publisher, url, accessed_at, used_for, sort_order) select id, ${q(s.title)}, ${q(s.publisher)}, ${q(s.url)}, ${q(s.accessedAt)}::date, ${q(s.usedFor)}, ${i} from articles where slug = ${q(a.slug)};`,
      );
    });
    lines.push(`insert into article_versions (article_id, version, title, summary, body_md, created_by) select id, 1, title, summary, body_md, 'seed' from articles where slug = ${q(a.slug)} on conflict do nothing;`);
    if (a.status === "published") {
      const findings = check(a);
      const verdict = findings.some((f) => f.severity === "error") ? "changes_requested" : "approved";
      lines.push(
        `insert into article_reviews (article_id, version, reviewer, verdict, checks) select id, 1, ${q(a.reviewedBy ?? "seed")}, ${q(verdict)}, ${j({ content_hash: hash(a), findings })} from articles where slug = ${q(a.slug)};`,
      );
      lines.push(`update articles set status = 'published' where slug = ${q(a.slug)};`);
    }
  }
  lines.push("", "commit;", "");
  return lines.join("\n");
}
