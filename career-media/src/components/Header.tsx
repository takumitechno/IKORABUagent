import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildConsultationUrl } from "@/lib/consultation";
import { partner } from "@/config/partner";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="メインメニュー" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[14px] font-medium text-ink">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-md px-3 py-2 transition-colors hover:bg-brand-tint hover:text-brand-strong">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={buildConsultationUrl("header")}
            className="hidden items-center gap-1 rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-accent-strong sm:inline-flex"
          >
            {partner.consultationIsFree ? "無料で相談する" : "相談する"}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <MobileNav consultationHref={buildConsultationUrl("header")} consultationLabel={partner.consultationIsFree ? "無料でキャリア相談する" : "キャリア相談する"} />
        </div>
      </div>
    </header>
  );
}
