import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, id, href, hrefLabel }: { eyebrow?: string; title: string; id?: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4" data-eyebrow={eyebrow}>
      <div>
        <h2 id={id} className="text-[21px] font-bold leading-snug text-ink sm:text-[24px]">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold text-brand-strong hover:underline">
          {hrefLabel ?? "すべて見る"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
