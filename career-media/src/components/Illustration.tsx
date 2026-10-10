/**
 * 人物入りの場面イラスト（public/images/illustrations/*.svg。npm run illustrations で作る）。
 * 飾りなので alt は空。縦横を渡してレイアウトのずれを防ぐ。
 */
export const ILLUSTRATIONS = {
  "hero-home": { width: 1200, height: 800 },
  "check-support": { width: 600, height: 600 },
  "journey-sekkyaku-office": { width: 1280, height: 720 },
  "journey-kyuryo-donichi": { width: 1280, height: 720 },
  "journey-freeter-hajimete": { width: 1280, height: 720 },
} as const;
export type IllustrationName = keyof typeof ILLUSTRATIONS;

export function Illustration({ name, className = "", priority = false }: { name: IllustrationName; className?: string; priority?: boolean }) {
  const { width, height } = ILLUSTRATIONS[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG をそのまま出す（最適化サーバーを通さない）
    <img
      src={`/images/illustrations/${name}.svg`}
      width={width}
      height={height}
      alt=""
      aria-hidden="true"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      data-illustration={name}
      className={className}
    />
  );
}
