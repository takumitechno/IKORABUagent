"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardList, Menu, MessageCircle, X } from "lucide-react";
import { NAV_ITEMS } from "./nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-brand-tint"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        <span className="sr-only">{open ? "メニューを閉じる" : "メニューを開く"}</span>
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-line bg-white">
          <nav aria-label="モバイルメニュー" className="px-4 py-4">
            <ul className="divide-y divide-line">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center justify-between py-4 text-base font-medium text-ink">
                    {item.label}
                    <span aria-hidden="true" className="text-brand">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <Link href="/check" data-cta-placement="header" data-cta-kind="check" className="flex items-center justify-center gap-1.5 rounded-full bg-brand px-5 py-3.5 text-base font-bold text-white">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
                条件を整理する
              </Link>
              <Link href="/consultation" data-cta-placement="header" data-cta-kind="consultation-info" className="flex items-center justify-center gap-1.5 rounded-full border border-accent/50 px-5 py-3.5 text-base font-bold text-accent-strong">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                キャリア相談について
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
