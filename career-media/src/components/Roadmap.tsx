import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MotifName } from "@/lib/illustrations/motifs";
import { Motif } from "./illustrations/Motif";

export type RoadmapStep = { scene: MotifName; title: string; text: string; href: string; cta: string; tone: string };

/**
 * はじめての転職の進め方（図解）。スマホでは縦の流れ、タブレット以上では横の流れで見せる。
 * 進め方の例であり、順番どおりに進める必要はない。
 */
export function Roadmap({ steps }: { steps: RoadmapStep[] }) {
  return (
    <ol className="relative grid gap-3 md:grid-cols-4 md:gap-5">
      {/* つなぐ線（スマホは縦、タブレット以上は横） */}
      <span aria-hidden="true" className="reveal-grow-y absolute bottom-10 left-[39px] top-10 w-0 border-l-[3px] border-dashed border-brand/30 md:hidden" />
      <span aria-hidden="true" className="reveal-grow-x absolute left-[12%] right-[12%] top-[60px] hidden border-t-[3px] border-dashed border-brand/30 md:block" />
      {steps.map((s, i) => (
        <li key={s.title} className="reveal relative">
          <Link href={s.href} className="tap lift group grid h-full grid-cols-[80px_minmax(0,1fr)] items-center gap-3 rounded-[18px] border border-line bg-white p-3 hover:border-brand/40 md:flex md:flex-col md:items-center md:p-5 md:text-center">
            <span className={`relative block aspect-square w-20 rounded-full md:w-[100px] ${s.tone}`}>
              <Motif name={s.scene} className="motif-art absolute inset-[4%]" />
              <span className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-white ring-[3px] ring-white">{i + 1}</span>
            </span>
            <span className="min-w-0 md:mt-3">
              <span className="block text-[17px] font-bold text-ink md:text-lg">{s.title}</span>
              <span className="mt-0.5 block text-[13px] leading-6 text-muted">{s.text}</span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-bold text-brand-strong group-hover:underline">
                {s.cta}
                <ArrowRight className="anim-nudge h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
