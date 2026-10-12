import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { ArticleSummary } from "@/lib/content/types";
import { articlePath } from "@/lib/seo";

function Rows({ articles }: { articles: ArticleSummary[] }) {
  return <ul className="divide-y divide-line">{articles.map((a) => <li key={a.slug}><Link href={articlePath(a)} className="tap flex items-start justify-between gap-3 py-3.5 text-sm font-medium leading-6 text-ink hover:text-brand-strong"><span>{a.title}</span><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" /></Link></li>)}</ul>;
}

/** 全記事への通常リンクをHTMLに残し、長い一覧は見たい分だけ開ける。JSなしでも使える。 */
export function ArticleDirectory({ articles }: { articles: ArticleSummary[] }) {
  const first = articles.slice(0, 6);
  const rest = articles.slice(6);
  return (
    <div className="rounded-xl border border-line bg-surface px-5">
      <Rows articles={first} />
      {Array.from({ length: Math.ceil(rest.length / 12) }, (_, i) => {
        const batch = rest.slice(i * 12, (i + 1) * 12);
        return <details key={i} className="group border-t border-line"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-bold text-brand-strong"><span>ほかの記事を読む <span className="font-normal text-muted">{7 + i * 12}〜{6 + i * 12 + batch.length}本目</span></span><ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><Rows articles={batch} /></details>;
      })}
    </div>
  );
}
