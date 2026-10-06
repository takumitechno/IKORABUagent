import type { ArticleSummary, Category } from "@/lib/content/types";
import { findTaxonomy } from "@/lib/taxonomy";
import { CategoryIcon, TONE_CLASSES, categoryToneName } from "./CategoryIcon";

/**
 * 記事カードのアイキャッチ。写真の代わりに「読者が自分ごとにできる短い言葉」を大きく見せる。
 * 文言は frontmatter の eyecatch（1〜2行）。無ければタイトルで代用する。
 */
type Size = "banner" | "lg" | "md" | "sm";

function iconFor(article: Pick<ArticleSummary, "roles" | "concerns" | "situations">, category?: Category): string {
  const role = article.roles[0] && findTaxonomy("roles", article.roles[0]);
  if (role) return role.icon;
  const concern = article.concerns[0] && findTaxonomy("concerns", article.concerns[0]);
  if (concern) return concern.icon;
  return category?.icon ?? "compass";
}

const SIZE: Record<Size, { box: string; text: string; badge: string; icon: string; iconBox: string }> = {
  banner: { box: "aspect-[2/1] sm:aspect-[21/8] p-5 sm:p-8", text: "pr-14 text-[23px] sm:text-[30px] leading-[1.38]", badge: "text-[12px] px-3 py-1", icon: "h-6 w-6", iconBox: "h-12 w-12 right-5 bottom-5 sm:right-8 sm:bottom-8" },
  lg: { box: "aspect-[16/9] p-6 sm:p-8", text: "pr-14 text-[24px] sm:text-[34px] leading-[1.35]", badge: "text-[12px] px-3 py-1", icon: "h-7 w-7", iconBox: "h-14 w-14 right-6 bottom-6 sm:right-8 sm:bottom-8" },
  // カード幅が狭いので、アイコンは右上に置いて文字の幅を確保する
  md: { box: "aspect-[16/10] p-4", text: "text-[17px] sm:text-[18px] leading-[1.45]", badge: "text-[11px] px-2.5 py-0.5", icon: "h-4 w-4", iconBox: "h-8 w-8 right-3 top-3" },
  sm: { box: "aspect-square p-0", text: "", badge: "", icon: "h-7 w-7", iconBox: "" },
};

export function Eyecatch({ article, category, size = "md", className = "" }: { article: ArticleSummary; category?: Category; size?: Size; className?: string }) {
  const toneName = article.kind === "news" ? "mist" : categoryToneName(category?.slug ?? article.categories[0] ?? "");
  const tone = TONE_CLASSES[toneName];
  const s = SIZE[size];
  const icon = iconFor(article, category);

  if (size === "sm") {
    return (
      <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${tone.bg} ${tone.fg} ${s.box} ${className}`} aria-hidden="true">
        <span className="absolute -right-4 -top-4 h-12 w-12 rounded-full border-2 border-current opacity-20" />
        <span className="absolute -bottom-3 -left-3 h-8 w-8 rounded-full bg-white/60" />
        <CategoryIcon name={icon} className={`relative ${s.icon}`} />
      </div>
    );
  }

  const lines = article.eyecatch.length > 0 ? article.eyecatch : [article.title];
  return (
    <div className={`relative overflow-hidden rounded-[14px] ${tone.bg} ${s.box} ${className}`} aria-hidden="true">
      {/* 背景の抽象図形（記事ごとに同じ見た目になるよう固定） */}
      <span className={`absolute -right-10 -top-12 h-44 w-44 rounded-full border-[3px] border-current opacity-[0.14] ${tone.fg}`} />
      <span className={`absolute -right-2 -top-4 h-24 w-24 rounded-full border-2 border-current opacity-[0.12] ${tone.fg}`} />
      <span className="absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-white/50" />
      <span
        className={`absolute bottom-0 left-0 h-1/2 w-1/2 opacity-[0.16] ${tone.fg}`}
        style={{ backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.4px)", backgroundSize: "12px 12px" }}
      />
      <div className="relative flex h-full flex-col">
        {category && <span className={`self-start rounded-full bg-white/85 font-bold ${tone.fg} ${s.badge}`}>{article.kind === "news" ? "ニュース解説" : category.name}</span>}
        <p className={`mt-auto font-bold tracking-wide text-ink ${s.text} ${article.eyecatch.length === 0 ? "line-clamp-3" : ""}`}>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {i === lines.length - 1 && lines.length > 1 ? <span className="bg-[linear-gradient(transparent_62%,var(--color-marker)_62%)]">{line}</span> : line}
            </span>
          ))}
        </p>
      </div>
      <span className={`absolute flex items-center justify-center rounded-full bg-white shadow-sm ${tone.fg} ${s.iconBox}`}>
        <CategoryIcon name={icon} className={s.icon} />
      </span>
    </div>
  );
}
