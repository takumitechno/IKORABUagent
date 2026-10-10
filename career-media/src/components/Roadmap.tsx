import Link from "next/link";
import type { MotifName } from "@/lib/illustrations/motifs";

export type RoadmapStep = { scene: MotifName; title: string; text: string; href: string; cta: string; tone: string };

/**
 * はじめての転職の進め方（4つのステップ）。スマホでは2列、タブレット以上では横一列のコンパクトなタイル。
 * 進め方の例であり、順番どおりに進める必要はない。
 */
export function Roadmap({ steps }: { steps: RoadmapStep[] }) {
  return (
    <ol className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
      {steps.map((s, i) => (
        <li key={s.title}>
          <Link href={s.href} className="tap group flex h-full flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand hover:bg-brand-tint">
            <span className="text-[26px] font-bold leading-none tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
            <span className="mt-2 block text-[16px] font-bold leading-tight text-ink group-hover:text-brand-strong">{s.title}</span>
            <span className="mt-1 text-[12.5px] leading-5 text-muted">{s.text}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
