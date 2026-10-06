import { Briefcase, Compass, FileText, Folder, ListChecks, Newspaper, Sparkles, Wallet, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  briefcase: Briefcase,
  sparkles: Sparkles,
  "file-text": FileText,
  wallet: Wallet,
  "list-checks": ListChecks,
  newspaper: Newspaper,
};

/** カテゴリごとの控えめな色分け（ブランド色を基調に、識別しやすさだけを補う） */
export const CATEGORY_TONES: Record<string, { bg: string; fg: string }> = {
  mikeiken: { bg: "bg-[#e6f3f0]", fg: "text-[#0b5f54]" },
  shokushu: { bg: "bg-[#e8f0f8]", fg: "text-[#1f4f7d]" },
  keiken: { bg: "bg-[#fbf2dc]", fg: "text-[#7a5300]" },
  "shorui-mensetsu": { bg: "bg-[#edf0f7]", fg: "text-[#34466e]" },
  hatarakikata: { bg: "bg-[#eaf5e6]", fg: "text-[#2f6224]" },
  junbi: { bg: "bg-[#fdf1e7]", fg: "text-[#9a4306]" },
  news: { bg: "bg-[#eef1f3]", fg: "text-[#334452]" },
};

export function categoryTone(slug: string) {
  return CATEGORY_TONES[slug] ?? { bg: "bg-brand-soft", fg: "text-brand-strong" };
}

export function CategoryIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Folder;
  return <Icon className={className} aria-hidden="true" />;
}
