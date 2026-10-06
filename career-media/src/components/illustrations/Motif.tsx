import type { MotifName } from "@/lib/illustrations/motifs";

/** 小さなイラスト（CSS の背景画像として1回だけ配信しているので、何個並べても軽い） */
export function Motif({ name, className = "" }: { name: MotifName; className?: string }) {
  return <span className={`motif motif-${name} block ${className}`} aria-hidden="true" />;
}
