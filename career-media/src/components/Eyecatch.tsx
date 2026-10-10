import type { ArticleSummary, Category } from "@/lib/content/types";
import { CategoryIcon } from "./CategoryIcon";

/**
 * 記事のサムネイル。写真の代わりに、カテゴリの色のグラデーションに「読者の問い」（frontmatter の eyecatch）を
 * 大きく置くメディアでよく使われる文字サムネイル。最後の行は黄色にして目に留まるようにする。
 * 小さいサイズ（一覧の行）では文字を入れず、白い丸にカテゴリのアイコンを置く。
 * 写真を使うようになったら、ここを差し替える。
 */
type Size = "banner" | "lg" | "md" | "sm";

/** カテゴリごとの面の色（白い文字が読めるコントラストにしている） */
export const CATEGORY_COLOR: Record<string, string> = {
  mikeiken: "var(--color-brand)",
  shokushu: "#1f5f99",
  keiken: "#b85a12",
  "shorui-mensetsu": "#a8432a",
  hatarakikata: "#3f6f1f",
  junbi: "#3a5068",
  seido: "#3c4f8f",
  news: "#142b3e",
};
export const categoryColor = (slug?: string) => CATEGORY_COLOR[slug ?? ""] ?? "var(--color-brand)";

const HIGHLIGHT = "var(--color-highlight)";
const surface = (color: string) => ({ background: `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 72%, #000) 100%)` });
const DOTS = "bg-[radial-gradient(rgb(255_255_255/0.16)_1.2px,transparent_1.6px)] [background-size:14px_14px]";

const SIZE: Record<Exclude<Size, "sm">, { box: string; text: string; label: string; badge: string; icon: string; pad: string }> = {
  banner: { box: "aspect-[16/9] sm:aspect-[21/8]", text: "text-[24px] sm:text-[34px]", label: "text-[12px]", badge: "w-[38%] sm:w-[26%]", icon: "h-[42%] w-[42%]", pad: "p-6 sm:p-9" },
  lg: { box: "aspect-[2/1]", text: "text-[23px] sm:text-[30px]", label: "text-[12px]", badge: "w-[30%]", icon: "h-[40%] w-[40%]", pad: "p-6 sm:p-8" },
  md: { box: "aspect-[16/9]", text: "text-[18px] sm:text-[19px]", label: "text-[11px]", badge: "w-[30%]", icon: "h-[40%] w-[40%]", pad: "p-4 sm:p-5" },
};

export function Eyecatch({ article, category, size = "md", className = "" }: { article: ArticleSummary; category?: Category; size?: Size; className?: string }) {
  const slug = article.kind === "news" ? "news" : (category?.slug ?? article.categories[0]);
  const color = categoryColor(slug);
  const icon = article.kind === "news" ? "newspaper" : (category?.icon ?? "compass");

  if (size === "sm") {
    return (
      <div className={`relative flex aspect-[4/3] shrink-0 items-center justify-center overflow-hidden rounded-xl ${className}`} style={surface(color)} aria-hidden="true">
        <span className={`absolute inset-y-0 right-0 w-1/2 ${DOTS}`} />
        <span className="absolute -left-4 -top-6 aspect-square w-[70%] rounded-full border-[6px] border-white/10" />
        <span className="absolute bottom-2 right-2.5 h-2 w-2 rounded-full" style={{ background: HIGHLIGHT }} />
        <span className="eyecatch-badge relative flex aspect-square w-[42%] items-center justify-center rounded-full bg-white shadow-[0_6px_14px_-6px_rgb(0_0_0/0.5)]">
          <CategoryIcon name={icon} className="h-1/2 w-1/2" style={{ color }} />
        </span>
      </div>
    );
  }

  const s = SIZE[size];
  const lines = article.eyecatch.length > 0 ? article.eyecatch : [article.title];
  const label = article.kind === "news" ? "ニュース解説" : category?.name;
  return (
    <div className={`relative overflow-hidden rounded-xl text-white ${s.box} ${className}`} style={surface(color)} aria-hidden="true">
      {/* 背景: 右側のドット、大きな輪、右下の白い丸にカテゴリのアイコン */}
      <span className={`absolute inset-y-0 right-0 w-[45%] ${DOTS}`} />
      <span className="absolute -left-[12%] -top-[40%] aspect-square w-[55%] rounded-full border-[10px] border-white/[0.08]" />
      <span className={`eyecatch-badge absolute -bottom-[16%] -right-[6%] flex aspect-square items-center justify-center rounded-full bg-white shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] ${s.badge}`}>
        <CategoryIcon name={icon} className={s.icon} style={{ color }} />
      </span>
      <span className={`absolute right-[30%] top-[14%] h-2.5 w-2.5 rounded-full`} style={{ background: HIGHLIGHT }} />
      <div className={`relative flex h-full flex-col ${s.pad}`}>
        {label && (
          <span className={`inline-flex items-center gap-1 self-start rounded-full bg-white px-2.5 py-0.5 font-bold tracking-wide ${s.label}`} style={{ color }}>
            <CategoryIcon name={icon} className="h-3 w-3" />
            {label}
          </span>
        )}
        <div className="mt-auto max-w-[80%]">
          <span className="mb-2 block h-1 w-8 rounded-full" style={{ background: HIGHLIGHT }} />
          <p className={`font-black leading-[1.35] tracking-tight [text-shadow:0_2px_10px_rgb(0_0_0/0.25)] ${s.text} ${article.eyecatch.length === 0 ? "line-clamp-3" : ""}`}>
            {lines.map((line, i) => (
              <span key={i} className="block" style={i === lines.length - 1 && lines.length > 1 ? { color: HIGHLIGHT } : undefined}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
