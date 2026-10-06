import type { ArticleSummary, Category } from "@/lib/content/types";
import { articleScene } from "@/lib/illustrations/scenes";
import { TONE_CLASSES, categoryToneName } from "./CategoryIcon";
import { Motif } from "./illustrations/Motif";

/**
 * 記事カードのアイキャッチ。写真の代わりに「読者が自分ごとにできる短い言葉」と、記事のテーマのイラストを見せる。
 * 文言は frontmatter の eyecatch（1〜2行）。無ければタイトルで代用する。
 * イラストは職種 → 悩み → 状況 → カテゴリの順に決まる（src/lib/illustrations/scenes.ts）。
 */
type Size = "banner" | "lg" | "md" | "sm";

const SIZE: Record<Size, { box: string; text: string; badge: string; art: string }> = {
  banner: {
    box: "aspect-[16/9] sm:aspect-[21/8] p-5 sm:p-8",
    text: "pr-[40%] text-[20px] min-[400px]:text-[21px] sm:pr-[38%] sm:text-[30px] leading-[1.4]",
    badge: "text-[12px] px-3 py-1",
    art: "right-[3%] top-1/2 h-[78%] -translate-y-1/2 sm:right-[6%] sm:h-[88%]",
  },
  lg: {
    box: "aspect-[16/9] p-6 sm:p-8",
    text: "pr-[40%] text-[21px] sm:text-[30px] leading-[1.38]",
    badge: "text-[12px] px-3 py-1",
    art: "right-[4%] top-1/2 h-[76%] -translate-y-1/2",
  },
  // カード幅が狭いので、イラストは右上に置いて文字の幅を確保する
  md: { box: "aspect-[16/10] p-4", text: "text-[17px] sm:text-[18px] leading-[1.45]", badge: "text-[11px] px-2.5 py-0.5", art: "right-2 top-2 h-[60%]" },
  sm: { box: "aspect-square", text: "", badge: "", art: "inset-[6%]" },
};

export function Eyecatch({ article, category, size = "md", className = "" }: { article: ArticleSummary; category?: Category; size?: Size; className?: string }) {
  const toneName = article.kind === "news" ? "mist" : categoryToneName(category?.slug ?? article.categories[0] ?? "");
  const tone = TONE_CLASSES[toneName];
  const s = SIZE[size];
  const scene = articleScene(article);

  if (size === "sm") {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-xl ${tone.bg} ${s.box} ${className}`} aria-hidden="true">
        <Motif name={scene} className={`absolute ${s.art}`} />
      </div>
    );
  }

  const lines = article.eyecatch.length > 0 ? article.eyecatch : [article.title];
  return (
    <div className={`relative overflow-hidden rounded-[14px] ${tone.bg} ${s.box} ${className}`} aria-hidden="true">
      {/* 背景の抽象図形 */}
      <span className={`absolute -left-8 -top-10 h-36 w-36 rounded-full border-[3px] border-current opacity-[0.1] ${tone.fg}`} />
      <span
        className={`absolute bottom-0 left-0 h-1/2 w-1/2 opacity-[0.14] ${tone.fg}`}
        style={{ backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.4px)", backgroundSize: "12px 12px" }}
      />
      <Motif name={scene} className={`motif-art absolute aspect-square ${s.art}`} />
      <div className="relative flex h-full flex-col">
        {category && <span className={`self-start rounded-full bg-white/90 font-bold ${tone.fg} ${s.badge}`}>{article.kind === "news" ? "ニュース解説" : category.name}</span>}
        <p className={`mt-auto font-bold tracking-wide text-ink ${s.text} ${article.eyecatch.length === 0 ? "line-clamp-3" : ""}`}>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {i === lines.length - 1 && lines.length > 1 ? <span className="bg-[linear-gradient(transparent_62%,var(--color-marker)_62%)]">{line}</span> : line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
