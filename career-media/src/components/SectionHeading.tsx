import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, id, href, hrefLabel }: { eyebrow?: string; title: string; id?: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-[11px] font-bold tracking-[0.2em] text-brand">{eyebrow}</p>}
        <h2 id={id} className="mt-1 text-[22px] font-bold leading-snug text-ink sm:text-2xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-strong hover:underline sm:inline-flex">
          {hrefLabel ?? "すべて見る"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
