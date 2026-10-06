import type { Level } from "@/lib/jobs";

export function LevelMeter({ level, label, srLabel }: { level: Level; label: string; srLabel: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-1" role="img" aria-label={`${srLabel}: 5段階中${level}（${label}）`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`h-2.5 w-2.5 rounded-full ${n <= level ? "bg-brand" : "bg-line"}`} />
        ))}
      </span>
      <span className="text-[13px] font-medium text-ink">{label}</span>
    </span>
  );
}
