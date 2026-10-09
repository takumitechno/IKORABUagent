import Image from "next/image";
import type { ReactNode } from "react";
import { findSelectedImage } from "@/lib/generated-images";

/**
 * 生成画像を出す場所。採用済み（selected）の画像がなければ fallback（今のイラストなど）をそのまま出す。
 * 画像がなくてもページの意味が通るように、文字は画像に入れずに HTML 側に置く（docs/ART_DIRECTION.md）。
 * 縦横は記録から渡すので、読み込み中にレイアウトがずれない。静的書き出しでも動くよう最適化サーバーは通さない。
 */
export function GeneratedImage({ slug, fallback, className = "", sizes = "100vw", priority = false }: { slug: string; fallback: ReactNode; className?: string; sizes?: string; priority?: boolean }) {
  const img = findSelectedImage(slug);
  if (!img) return <>{fallback}</>;
  return (
    <Image
      src={img.src}
      width={img.width}
      height={img.height}
      alt={img.decorative ? "" : img.alt}
      aria-hidden={img.decorative || undefined}
      sizes={sizes}
      priority={priority}
      unoptimized
      data-generated-image={img.slug}
      className={`object-contain ${className}`}
    />
  );
}
