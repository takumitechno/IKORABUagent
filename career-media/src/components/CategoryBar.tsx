import Link from "next/link";
import categories from "../../content/categories.json";
import { CategoryIcon } from "./CategoryIcon";

/** ヘッダーの下のカテゴリ一覧（転職メディアでよくある横並びのナビ）。スマホでは横にスクロールする */
export function CategoryBar() {
  const items = [...categories].sort((a, b) => a.sort_order - b.sort_order);
  return (
    <nav aria-label="カテゴリ" className="no-print border-b border-line bg-white">
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] sm:px-5 [&::-webkit-scrollbar]:hidden">
        {items.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link
              href={c.slug === "news" ? "/news" : `/categories/${c.slug}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium text-body transition-colors hover:bg-brand-tint hover:text-brand-strong"
            >
              <CategoryIcon name={c.icon} className="h-3.5 w-3.5 text-brand" />
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
