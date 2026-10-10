import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { BackButton } from "./BackButton";
import { JsonLd } from "./JsonLd";

export function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <div className="flex items-center gap-3">
        <BackButton dark={dark} fallback={items.length > 1 ? items[items.length - 2].path : "/"} />
        <nav aria-label="パンくずリスト" className={`min-w-0 text-xs ${dark ? "text-white/70" : "text-muted"}`}>
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
            {items.map((item, i) => {
              const last = i === items.length - 1;
              return (
                <li key={item.path} className={`min-w-0 items-center gap-1 ${last && i > 0 ? "hidden sm:flex" : "flex"}`}>
                  {last ? (
                    <span aria-current="page" className={`line-clamp-1 ${dark ? "text-white" : "text-body"}`}>
                      {item.name}
                    </span>
                  ) : (
                    <>
                      <Link href={item.path} className={dark ? "hover:text-white hover:underline" : "hover:text-brand-strong hover:underline"}>
                        {item.name}
                      </Link>
                      <ChevronRight className={`h-3 w-3 shrink-0 ${dark ? "text-white/40" : "text-line-strong"} ${i === items.length - 2 ? "hidden sm:block" : ""}`} aria-hidden="true" />
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </>
  );
}
