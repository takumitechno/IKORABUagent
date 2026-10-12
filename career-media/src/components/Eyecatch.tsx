import type { ArticleSummary, Category } from "@/lib/content/types";
import { articleScene } from "@/lib/illustrations/scenes";
import { articleCover } from "@/lib/article-presentation";
import { GeneratedImage } from "./GeneratedImage";
import { Motif } from "./illustrations/Motif";

type Size = "banner" | "lg" | "md" | "sm";

/** One cover follows an article from Home to the catalogue; article text stays in HTML. */
export function Eyecatch({ article, category, size = "md", className = "" }: { article: ArticleSummary; category?: Category; size?: Size; className?: string }) {
  const cover = articleCover(article);
  const label = article.kind === "news" ? "転職ニュース" : category?.name;
  const illustration = <div className="media-eyecatch-illustration">
    <Motif name={articleScene(article)} className="media-eyecatch-motif" />
    {size !== "sm" && <p className="media-eyecatch-question">{(article.eyecatch.length ? article.eyecatch : [article.title]).map((line, index) => <span key={index}>{line}</span>)}</p>}
  </div>;
  return (
    <div className={`media-eyecatch media-eyecatch-${size} ${className}`} aria-hidden="true">
      {cover ? <GeneratedImage slug={cover.slug} fallback={illustration} sizes={size === "sm" ? "132px" : "(max-width: 767px) 100vw, 520px"} className="media-eyecatch-image !object-cover" /> : illustration}
      {size !== "sm" && label && <span className="media-eyecatch-label">{label}</span>}
    </div>
  );
}
