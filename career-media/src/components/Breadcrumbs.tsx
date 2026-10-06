import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="パンくずリスト" className="text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.path} className="flex min-w-0 items-center gap-1">
                {last ? (
                  <span aria-current="page" className="line-clamp-1 text-body">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="hover:text-brand-strong hover:underline">
                      {item.name}
                    </Link>
                    <ChevronRight className="h-3 w-3 shrink-0 text-line-strong" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
