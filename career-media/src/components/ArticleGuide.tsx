import { Check } from "lucide-react";
import type { ArticleGuide as Guide } from "@/lib/article-guides";

export function ArticleAnswer({ guide }: { guide: Guide }) {
  return (
    <section aria-label="この記事の要点" className="mt-6 border-l-[3px] border-brand bg-brand-tint px-4 py-5 sm:px-6">
      <p className="text-xs font-bold text-brand-strong">この記事の要点</p>
      <p className="mt-2 text-[17px] font-bold leading-7 text-ink">{guide.answer}</p>
      <ul className="mt-3 space-y-2">
        {guide.points.map((point) => <li key={point} className="flex gap-2 text-[14px] leading-6 text-body"><Check className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" /><span>{point}</span></li>)}
      </ul>
    </section>
  );
}

