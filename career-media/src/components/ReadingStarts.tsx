import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { READING_STARTS } from "@/lib/content-discovery";

export function ReadingStarts() {
  return (
    <section data-reading-starts aria-labelledby="reading-starts-title" className="mb-8">
      <h2 id="reading-starts-title" className="text-lg font-bold text-ink">悩みに合わせて読む</h2>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {READING_STARTS.map((read) => <li key={read.slug}><Link href={`/articles/${read.slug}`} className="tap flex items-center gap-3 py-4 hover:text-brand-strong"><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-ink">{read.label}</span><span className="mt-1 block text-[13px] text-muted">{read.detail}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" /></Link></li>)}
      </ul>
    </section>
  );
}
