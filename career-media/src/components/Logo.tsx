import Link from "next/link";
import { partner } from "@/config/partner";
import { site } from "@/config/site";

/**
 * テキストベースのブランド表示。
 * TODO(正式公開前にMakeCareer確認が必要): 正式ロゴ asset を受領したら BrandMark を差し替える。
 */
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" data-placeholder-logo="true">
      <rect width="32" height="32" rx="9" fill="var(--color-brand)" />
      <path d="M8 21.5 13.5 15l4 3.6L24 10.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="10.5" r="2.4" fill="var(--color-accent-bright)" />
    </svg>
  );
}

/** ロゴの2行目: メディア名がブランド名で始まるとき（MakeCareer転職ガイド）は残りの部分、同じときはタグライン */
function subName() {
  if (partner.brandName === site.name) return site.tagline;
  if (site.name.startsWith(partner.brandName)) return site.name.slice(partner.brandName.length).trim();
  return site.name;
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.fullName} ホーム`}>
      <BrandMark className={`shrink-0 ${compact ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9"}`} />
      <span className="flex flex-col leading-none">
        <span className={`font-bold tracking-wide text-ink ${compact ? "text-[16px]" : "text-[17px] sm:text-lg"}`}>
          {partner.brandName}
          {compact && site.name.startsWith(partner.brandName) && site.name !== partner.brandName && (
            <span className="ml-1.5 hidden whitespace-nowrap rounded-md bg-brand px-1.5 py-0.5 align-[2px] text-[11px] font-bold tracking-normal text-white min-[400px]:inline">{subName()}</span>
          )}
        </span>
        {!compact && <span className="mt-1 text-[10.5px] font-medium tracking-[0.06em] text-brand-strong">{subName()}</span>}
      </span>
    </Link>
  );
}
