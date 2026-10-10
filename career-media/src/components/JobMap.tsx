import Link from "next/link";
import { JOB_ROLE_SCENE } from "@/lib/illustrations/scenes";
import type { JobRole } from "@/lib/jobs";
import { Motif } from "./illustrations/Motif";

/**
 * 職種マップ（図解）。横軸=パソコン作業、縦軸=人と話す量。
 * 値は jobs.ts の5段階の目安（統計ではない）をそのまま使う。
 */
const plot = { left: 15, right: 5, top: 5, bottom: 15 };
const pos = (level: number) => 0.08 + (0.84 * (level - 1)) / 4;

export function JobMap({ roles, hrefFor, className = "" }: { roles: JobRole[]; hrefFor: (role: JobRole) => string; className?: string }) {
  const w = 100 - plot.left - plot.right;
  const h = 100 - plot.top - plot.bottom;
  const TONES = ["bg-sky", "bg-mint", "bg-lime", "bg-sand"];
  return (
    <figure className={className}>
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-surface ring-1 ring-line">
        {/* 4つの領域の色分けと目盛り */}
        <div
          aria-hidden="true"
          className="absolute rounded-xl"
          style={{
            left: `${plot.left}%`,
            right: `${plot.right}%`,
            top: `${plot.top}%`,
            bottom: `${plot.bottom}%`,
            backgroundImage:
              "linear-gradient(to right, rgb(15 123 108 / 0.07) 50%, rgb(76 143 216 / 0.07) 50%), linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 25% 25%, 25% 25%",
          }}
        />
        {/* 軸 */}
        <div aria-hidden="true" className="absolute flex items-center" style={{ left: `${plot.left}%`, right: `${plot.right}%`, bottom: `${plot.bottom - 7}%` }}>
          <span className="text-[10.5px] text-muted">少ない</span>
          <span className="mx-1.5 h-px flex-1 bg-line-strong" />
          <span className="text-[11px] font-bold text-ink">パソコン作業 →</span>
        </div>
        <div aria-hidden="true" className="absolute flex flex-col items-center" style={{ left: "1.5%", top: `${plot.top}%`, bottom: `${plot.bottom}%`, width: `${plot.left - 3}%` }}>
          <span className="h-0 w-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-ink" />
          <span className="mt-1 text-[11px] font-bold leading-tight text-ink [writing-mode:vertical-rl]">人と話す</span>
          <span className="my-1.5 w-px flex-1 bg-line-strong" />
          <span className="text-[10.5px] text-muted [writing-mode:vertical-rl]">少ない</span>
        </div>
        {/* 職種 */}
        <ul>
          {roles.map((r, i) => {
            const x = plot.left + w * pos(r.pcLevel);
            const y = plot.top + h * (1 - pos(r.talkLevel));
            // ななめ下の隣に別の職種があると、下に出した名札が重なる。そのときは名札を左側に出す
            const labelLeft = roles.some((o) => o.talkLevel === r.talkLevel - 1 && Math.abs(o.pcLevel - r.pcLevel) === 1);
            return (
              <li key={r.slug} className={`absolute -translate-y-1/2 ${labelLeft ? "-translate-x-[calc(100%-26px)] sm:-translate-x-[calc(100%-32px)]" : "-translate-x-1/2"}`} style={{ left: `${x}%`, top: `${y}%` }}>
                <Link href={hrefFor(r)} className={`reveal-pop tap group flex items-center ${labelLeft ? "flex-row-reverse gap-1.5" : "flex-col gap-1"}`} style={{ animationRange: `entry ${15 + i * 12}% entry ${60 + i * 12}%` }}>
                  <span className={`anim-float relative block aspect-square w-[52px] rounded-full ring-4 ring-surface shadow-[var(--shadow-raised)] sm:w-[64px] ${TONES[i % 4]} anim-delay-${(i % 3) + 1}`}>
                    <Motif name={JOB_ROLE_SCENE[r.slug] ?? "briefcase"} className="absolute inset-[6%]" />
                  </span>
                  <span className="whitespace-nowrap rounded-full bg-night px-2 py-0.5 text-[11px] font-bold text-white group-hover:bg-brand-press sm:text-[12px]">{r.shortName}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mt-2 text-[11.5px] leading-5 text-muted">横はパソコン作業、縦は人と話す量の目安（5段階）。一般的な傾向で、会社や配属先によって大きく異なります。</figcaption>
    </figure>
  );
}
