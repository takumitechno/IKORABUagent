import imageIndex from "../../content/images/index.json";

/**
 * OpenAI で生成した画像の一覧（content/images/index.json。scripts/images/cli.ts が作る）。
 * サイトに出すのは status が selected のものだけ。下書き（draft）・不採用（rejected）は出さない。
 */
export type GeneratedImageEntry = {
  slug: string;
  type: string;
  status: "draft" | "selected" | "rejected";
  src: string;
  width: number;
  height: number;
  alt: string;
  decorative: boolean;
  used_in: string[];
};

const ENTRIES = (imageIndex as { images: GeneratedImageEntry[] }).images;

export function findSelectedImage(slug: string, entries: GeneratedImageEntry[] = ENTRIES): GeneratedImageEntry | null {
  const e = entries.find((x) => x.slug === slug);
  return e && e.status === "selected" && e.width > 0 && e.height > 0 && e.src.startsWith("/images/generated/") ? e : null;
}
