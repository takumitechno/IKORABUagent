import Link from "next/link";
import type { ArticleSummary } from "@/lib/content/types";
import { articleCardTitle } from "@/lib/article-presentation";
import { announcedLabel, formatDateShort } from "./DateMeta";

export function NewsTimeline({ news, today = new Date() }: { news: ArticleSummary[]; today?: Date }) {
  const items = news.filter((n) => n.news?.announcedAt).sort((a, b) => a.news!.announcedAt.localeCompare(b.news!.announcedAt));
  if (items.length < 2) return null;
  return (
    <ol className="divide-y divide-line">
      {items.map((n) => <li key={n.slug}>
        <Link href={`/news/${n.slug}`} className="tap group grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
          <span className="text-xs leading-6 text-muted">{announcedLabel(n.news!.announcedAt, n.news!.dateType, today)} <time dateTime={n.news!.announcedAt}>{formatDateShort(n.news!.announcedAt)}</time></span>
          <span className="text-sm font-bold leading-6 text-ink group-hover:text-brand-strong">{articleCardTitle(n)}</span>
        </Link>
      </li>)}
    </ol>
  );
}
