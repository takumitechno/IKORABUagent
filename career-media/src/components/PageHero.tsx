import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { CategoryIcon } from "./CategoryIcon";

/**
 * 各ページの上部（トップのヒーローと同じテイスト）。ブランド色の面に、光・輪・ドットを重ね、
 * パンくず・小さなラベル・見出し・一文・操作（children）を順にふわっと出す。
 * 右側には、アイコンを白い円に入れた飾り（icon）か、任意の要素（visual）を置ける。
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  icon,
  visual,
  children,
  compact = false,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  icon?: string;
  visual?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  const side = visual ?? (icon ? <HeroBadgeIcon name={icon} /> : null);
  return (
    <section className="relative overflow-hidden bg-hero text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -right-24 -top-40 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.16),transparent_65%)]" />
        <span className="absolute -right-10 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-white/10" />
        <span className="absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full bg-black/[0.12]" />
        <span className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1.4px)] [background-size:22px_22px]" />
      </div>
      <div className={`relative mx-auto max-w-6xl px-4 sm:px-6 ${compact ? "pb-8 pt-5 sm:pb-10" : "pb-10 pt-5 sm:pb-14"}`}>
        <Breadcrumbs items={crumbs} dark />
        <div className={`grid gap-6 ${side ? "md:grid-cols-[minmax(0,1fr)_auto] md:items-center" : ""} ${compact ? "mt-5" : "mt-7 sm:mt-9"}`}>
          <div className="min-w-0">
            {eyebrow && (
              <p className="enter inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold tracking-wide ring-1 ring-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            <h1 className={`enter enter-d1 font-bold leading-[1.35] ${eyebrow ? "mt-3" : ""} ${compact ? "text-[26px] sm:text-[32px]" : "text-[28px] sm:text-[40px]"}`}>{title}</h1>
            {lead && <p className="enter enter-d2 mt-3 max-w-2xl text-[14.5px] leading-7 text-white/80 sm:text-[15.5px]">{lead}</p>}
            {children && <div className="enter enter-d3 mt-6">{children}</div>}
          </div>
          {side && <div className="hidden md:block">{side}</div>}
        </div>
      </div>
    </section>
  );
}

/** 右側の飾り: 輪の中に白い円とアイコン（ゆっくり浮かぶ） */
function HeroBadgeIcon({ name }: { name: string }) {
  return (
    <div className="enter-pop enter-d2 relative mr-6 h-[200px] w-[200px]" aria-hidden="true">
      <span className="absolute inset-0 rounded-full border border-dashed border-white/25" />
      <span className="absolute inset-5 rounded-full bg-white/[0.06] ring-1 ring-white/15" />
      <span className="anim-float absolute inset-[46px] flex items-center justify-center rounded-full bg-white shadow-[0_24px_48px_-16px_rgb(0_0_0/0.55)]">
        <CategoryIcon name={name} className="h-12 w-12 text-brand" />
      </span>
      <span className="anim-float anim-delay-2 absolute right-3 top-6 h-4 w-4 rounded-full bg-highlight" />
      <span className="anim-float anim-delay-1 absolute bottom-7 left-2 h-3 w-3 rounded-full bg-accent-bright" />
    </div>
  );
}
