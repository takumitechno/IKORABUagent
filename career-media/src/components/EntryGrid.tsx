import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TAXONOMY, TAXONOMY_GROUPS, taxonomyPath, type TaxonomyGroup } from "@/lib/taxonomy";
import { CategoryIcon, TONE_CLASSES, type Tone } from "./CategoryIcon";

const GROUP_TONE: Record<TaxonomyGroup, Tone[]> = {
  situations: ["mint", "sky", "sand", "lime"],
  concerns: ["sand", "coral", "mint", "sky"],
  roles: ["sky", "mint", "lime", "sand"],
};

/** 入口（職種 / 悩み / 今の状況）のタイル一覧 */
export function EntryGrid({ group, counts, variant = "tile" }: { group: TaxonomyGroup; counts?: Record<string, number>; variant?: "tile" | "chip" }) {
  const items = TAXONOMY[group];
  if (variant === "chip") {
    return (
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={taxonomyPath(group, item.slug)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13.5px] font-medium text-ink ring-1 ring-line transition hover:text-brand-strong hover:ring-brand/40">
              <CategoryIcon name={item.icon} className="h-4 w-4 text-brand" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
      {items.map((item, i) => {
        const tone = TONE_CLASSES[GROUP_TONE[group][i % 4]];
        const count = counts?.[item.slug];
        return (
          <li key={item.slug}>
            <Link href={taxonomyPath(group, item.slug)} className="group flex h-full items-center gap-3 rounded-[14px] border border-line bg-white p-3 transition hover:border-brand/40 hover:shadow-[var(--shadow-card)] sm:p-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.fg}`}>
                <CategoryIcon name={item.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold leading-snug text-ink group-hover:text-brand-strong sm:text-[15px]">{item.label}</span>
                {count !== undefined && <span className="mt-0.5 block text-[11.5px] text-muted">{count}本の記事</span>}
              </span>
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-line-strong transition group-hover:text-brand sm:block" aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function EntrySectionHeading({ group, id, extra }: { group: TaxonomyGroup; id: string; extra?: React.ReactNode }) {
  const g = TAXONOMY_GROUPS[group];
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold tracking-[0.2em] text-brand">{g.eyebrow}</p>
        <h2 id={id} className="mt-1 text-[21px] font-bold leading-snug text-ink sm:text-[23px]">
          {g.title}
        </h2>
      </div>
      {extra}
    </div>
  );
}
