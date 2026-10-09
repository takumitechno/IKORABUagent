import type { ArticleSummary, Category } from "@/lib/content/types";
import { CategoryIcon } from "./CategoryIcon";

/**
 * 記事のサムネイル。写真の代わりに、カテゴリの色の面に「読者の問い」（frontmatter の eyecatch）を大きく置く
 * メディアでよく使われる文字サムネイル。小さいサイズ（一覧の行）ではカテゴリのアイコンだけを出す。
 * 写真を使うようになったら、ここを差し替える。
 */
type Size = "banner" | "lg" | "md" | "sm";

/** カテゴリごとの面の色（白い文字が読めるコントラストにしている） */
export const CATEGORY_COLOR: Record<string, string> = {
  mikeiken: "#0f7b6c",
  shokushu: "#1f5f99",
  keiken: "#b85a12",
  "shorui-mensetsu": "#a8432a",
  hatarakikata: "#3f6f1f",
  junbi: "#3a5068",
  seido: "#3c4f8f",
  news: "#142b3e",
};
export const categoryColor = (slug?: string) => CATEGORY_COLOR[slug ?? ""] ?? "#0f7b6c";

const SIZE: Record<Exclude<Size, "sm">, { box: string; text: string; label: string; icon: string; pad: string }> = {
  banner: { box: "aspect-[16/9] sm:aspect-[21/8]", text: "text-[22px] sm:text-[30px]", label: "text-[12px]", icon: "h-40 w-40", pad: "p-6 sm:p-8" },
  lg: { box: "aspect-[2/1]", text: "text-[22px] sm:text-[28px]", label: "text-[12px]", icon: "h-36 w-36", pad: "p-6 sm:p-8" },
  md: { box: "aspect-[16/9]", text: "text-[17px] sm:text-[18px]", label: "text-[11px]", icon: "h-24 w-24", pad: "p-4" },
};

export function Eyecatch({ article, category, size = "md", className = "" }: { article: ArticleSummary; category?: Category; size?: Size; className?: string }) {
  const slug = article.kind === "news" ? "news" : (category?.slug ?? article.categories[0]);
  const color = categoryColor(slug);
  const icon = article.kind === "news" ? "newspaper" : (category?.icon ?? "compass");

  if (size === "sm") {
    return (
      <div className={`relative flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-xl ${className}`} style={{ background: color }} aria-hidden="true">
        <span className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-white/10" />
        <CategoryIcon name={icon} className="relative h-6 w-6 text-white" />
      </div>
    );
  }

  const s = SIZE[size];
  const lines = article.eyecatch.length > 0 ? article.eyecatch : [article.title];
  const label = article.kind === "news" ? "ニュース解説" : category?.name;
  return (
    <div className={`relative overflow-hidden rounded-xl text-white ${s.box} ${className}`} style={{ background: color }} aria-hidden="true">
      {/* 背景: 大きな円と、カテゴリのアイコンを薄く */}
      <span className="absolute -right-[12%] -top-[30%] aspect-square w-[62%] rounded-full bg-white/[0.07]" />
      <span className="absolute -bottom-[38%] -left-[10%] aspect-square w-[46%] rounded-full bg-black/[0.08]" />
      <span className="absolute right-[6%] top-[12%] opacity-[0.16]">
        <CategoryIcon name={icon} className={s.icon} />
      </span>
      <div className={`relative flex h-full flex-col ${s.pad}`}>
        {label && <span className={`self-start rounded-full bg-white/15 px-2.5 py-0.5 font-bold tracking-wide ${s.label}`}>{label}</span>}
        <p className={`mt-auto font-bold leading-[1.4] [text-wrap:balance] ${s.text} ${article.eyecatch.length === 0 ? "line-clamp-3" : ""}`}>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
