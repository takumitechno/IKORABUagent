import type { Level } from "@/lib/jobs";

/** 5段階の目安。animate を付けると、画面に入ったときに丸が順に埋まる（動きを減らす設定では最初から表示） */
export function LevelMeter({ level, label, srLabel, animate = false }: { level: Level; label: string; srLabel: string; animate?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-1" role="img" aria-label={`${srLabel}: 5段階中${level}（${label}）`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`h-2.5 w-2.5 rounded-full ${n <= level ? `bg-brand ${animate ? "reveal-pop" : ""}` : "bg-line"}`}
            style={animate && n <= level ? { animationRange: `entry ${n * 10}% entry ${45 + n * 10}%` } : undefined}
          />
        ))}
      </span>
      <span className="text-[13px] font-medium text-ink">{label}</span>
    </span>
  );
}
