import Link from "next/link";
import type { ArticleSummary } from "@/lib/content/types";
import { articleScene } from "@/lib/illustrations/scenes";
import { announcedLabel } from "./DateMeta";
import { Motif } from "./illustrations/Motif";

/**
 * 制度が変わる時期のタイムライン（図解）。各ニュースの施行・発表日（frontmatter の news.announced_at）から作る。
 * 未来の日付は「施行予定」として区別する。
 */
export function NewsTimeline({ news, today = new Date() }: { news: ArticleSummary[]; today?: Date }) {
  const items = news
    .filter((n) => n.news?.announcedAt)
    .sort((a, b) => a.news!.announcedAt.localeCompare(b.news!.announcedAt));
  if (items.length < 2) return null;
  const todayIso = today.toISOString().slice(0, 10);
  return (
    <figure className="rounded-[20px] bg-surface p-5 ring-1 ring-line sm:p-6">
      <figcaption className="flex items-center gap-2 text-[15px] font-bold text-ink">
        <span className="rounded-full bg-night px-2.5 py-0.5 text-[11px] tracking-[0.08em] text-white">図解</span>
        制度が変わる時期
      </figcaption>
      <ol className="anim-list relative mt-4 space-y-3 before:absolute before:bottom-3 before:left-[23px] before:top-3 before:border-l-[3px] before:border-dotted before:border-brand/30 md:grid md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:gap-3 md:space-y-0 md:before:left-6 md:before:right-6 md:before:top-[23px] md:before:bottom-auto md:before:border-l-0 md:before:border-t-[3px]">
        {items.map((n) => {
          const date = n.news!.announcedAt;
          const future = date > todayIso;
          const [y, m] = date.split("-");
          return (
            <li key={n.slug} className="reveal relative">
              <Link href={`/news/${n.slug}`} className="tap group flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                <span className={`relative z-[1] block aspect-square w-12 shrink-0 rounded-full ring-4 ring-surface ${future ? "bg-sand" : "bg-mist"}`}>
                  <Motif name={articleScene(n)} className="absolute inset-[6%]" />
                </span>
                <span className="min-w-0">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11.5px] font-bold ${future ? "bg-sand text-sand-ink" : "bg-mist text-mist-ink"}`}>
                    {y}年{Number(m)}月・{announcedLabel(date, today)}
                  </span>
                  <span className="mt-1 block text-[13.5px] font-bold leading-6 text-ink group-hover:text-brand-strong">{n.eyecatch.length > 0 ? n.eyecatch.join("") : n.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
