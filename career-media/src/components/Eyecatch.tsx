import type { ArticleSummary, Category } from "@/lib/content/types";
import { articleScene } from "@/lib/illustrations/scenes";
import { TONE_CLASSES, categoryToneName } from "./CategoryIcon";
import { Motif } from "./illustrations/Motif";

/**
 * 記事カードのアイキャッチ。記事のテーマのイラストだけを、カテゴリの色の上に置く。
 * タイトルはカードの本文に出すので、画像の中には文字を入れない（同じ言葉を2回読ませない）。
 * イラストは職種 → 悩み → 状況 → カテゴリの順に決まる（src/lib/illustrations/scenes.ts）。
 */
type Size = "banner" | "lg" | "md" | "sm";

const SIZE: Record<Size, { box: string; art: string }> = {
  banner: { box: "aspect-[16/9] sm:aspect-[21/8]", art: "left-1/2 top-1/2 h-[72%] -translate-x-1/2 -translate-y-1/2" },
  lg: { box: "aspect-[2/1]", art: "left-1/2 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2" },
  md: { box: "aspect-[16/9]", art: "left-1/2 top-1/2 h-[72%] -translate-x-1/2 -translate-y-1/2" },
  sm: { box: "aspect-square", art: "inset-[10%]" },
};

export function Eyecatch({ article, category, size = "md", className = "" }: { article: ArticleSummary; category?: Category; size?: Size; className?: string }) {
  const toneName = article.kind === "news" ? "mist" : categoryToneName(category?.slug ?? article.categories[0] ?? "");
  const tone = TONE_CLASSES[toneName];
  const s = SIZE[size];
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl ${tone.bg} ${s.box} ${className}`} aria-hidden="true">
      <Motif name={articleScene(article)} className={`motif-art absolute aspect-square ${s.art}`} />
    </div>
  );
}
