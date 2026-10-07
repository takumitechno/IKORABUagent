import Link from "next/link";
import type { MotifName } from "@/lib/illustrations/motifs";
import { Motif } from "./illustrations/Motif";

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
          <Link href={s.href} className="tap lift group flex h-full flex-col rounded-2xl border border-line bg-white p-3.5 hover:border-brand/40 md:p-4">
            <span className="flex items-center gap-2.5">
              <span className={`relative block aspect-square w-11 shrink-0 rounded-full ${s.tone}`}>
                <Motif name={s.scene} className="motif-art absolute inset-[8%]" />
              </span>
              <span>
                <span className="block text-[11px] font-bold text-muted">STEP {i + 1}</span>
                <span className="block text-[16px] font-bold leading-tight text-ink group-hover:text-brand-strong">{s.title}</span>
              </span>
            </span>
            <span className="mt-2 text-[12.5px] leading-5 text-muted">{s.text}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
