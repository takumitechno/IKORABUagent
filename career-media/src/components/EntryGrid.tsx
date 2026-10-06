import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { taxonomyScene } from "@/lib/illustrations/scenes";
import { TAXONOMY, TAXONOMY_GROUPS, taxonomyPath, type TaxonomyGroup } from "@/lib/taxonomy";
import { CategoryIcon, TONE_CLASSES, type Tone } from "./CategoryIcon";
import { Motif } from "./illustrations/Motif";

const GROUP_TONE: Record<TaxonomyGroup, Tone[]> = {
  situations: ["mint", "sky", "sand", "lime"],
  concerns: ["sand", "coral", "mint", "sky"],
  roles: ["sky", "mint", "lime", "sand"],
};

/** 入口（職種 / 悩み / 今の状況）のタイル一覧。イラスト＋短い言葉で、読まなくても選べるようにする */
export function EntryGrid({ group, counts, variant = "tile" }: { group: TaxonomyGroup; counts?: Record<string, number>; variant?: "tile" | "chip" }) {
  const items = TAXONOMY[group];
  if (variant === "chip") {
    return (
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={taxonomyPath(group, item.slug)} className="tap inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13.5px] font-medium text-ink ring-1 ring-line transition hover:text-brand-strong hover:ring-brand/40">
              <CategoryIcon name={item.icon} className="h-4 w-4 text-brand" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
      {items.map((item, i) => {
        const tone = TONE_CLASSES[GROUP_TONE[group][i % 4]];
        const count = counts?.[item.slug];
        return (
          <li key={item.slug}>
            <Link
              href={taxonomyPath(group, item.slug)}
              className="tap lift group flex h-full flex-col items-center rounded-2xl border border-line bg-white px-1.5 pb-3 pt-3 text-center hover:border-brand/40 sm:px-2"
            >
              <span className={`relative mb-2 block aspect-square w-[64px] rounded-full sm:w-[72px] ${tone.bg}`}>
                <Motif name={taxonomyScene(group, item.slug)} className="motif-art absolute inset-[4%]" />
              </span>
              <span className="text-[12.5px] font-bold leading-[1.45] text-ink group-hover:text-brand-strong sm:text-[13.5px]">{item.label}</span>
              {count !== undefined && <span className="mt-1 rounded-full bg-canvas px-2 text-[10.5px] leading-5 text-muted">{count}本</span>}
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

const TAB_LABEL: Record<TaxonomyGroup, string> = { situations: "今の状況から", concerns: "悩みから", roles: "職種から" };
const MORE_LABEL: Record<TaxonomyGroup, { href: string; label: string }> = {
  situations: { href: "/situations", label: "状況の一覧" },
  concerns: { href: "/concerns", label: "悩みの一覧" },
  roles: { href: "/jobs", label: "職種を比べる" },
};

/** 3つの入口をタブで切り替える（JavaScript なしで動く。スマホで縦に長くならないように） */
export function ExploreTabs({ counts, name = "explore" }: { counts: Record<TaxonomyGroup, Record<string, number>>; name?: string }) {
  const groups: TaxonomyGroup[] = ["situations", "concerns", "roles"];
  return (
    <div className="tabset">
      {groups.map((g, i) => (
        <input key={g} type="radio" name={name} id={`${name}-${g}`} defaultChecked={i === 0} />
      ))}
      <div className="tab-list mb-4 grid grid-cols-3 gap-1 rounded-full bg-white p-1 ring-1 ring-line sm:inline-grid sm:min-w-[420px]">
        {groups.map((g) => (
          <label key={g} htmlFor={`${name}-${g}`} className="tab-label rounded-full px-2 py-2.5 text-center text-[13px] font-bold transition sm:text-sm">
            {TAB_LABEL[g]}
          </label>
        ))}
      </div>
      <div className="tab-panels">
        {groups.map((g) => (
          <div key={g} className="tab-panel">
            <EntryGrid group={g} counts={counts[g]} />
            <p className="mt-3 text-right">
              <Link href={MORE_LABEL[g].href} className="inline-flex items-center gap-1 text-[13px] font-bold text-brand-strong hover:underline">
                {MORE_LABEL[g].label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
