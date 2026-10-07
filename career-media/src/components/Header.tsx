import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo compact />
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
          <Link
            href="/consultation"
            data-cta-placement="header"
            data-cta-kind="consultation-info"
            className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-brand-strong sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            キャリア相談について
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
