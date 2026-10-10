import {
  BookOpen,
  ClipboardList,
  Info,
  MessagesSquare,
  Scale,
  BadgeCheck,
  Briefcase,
  Building,
  CalendarDays,
  Clock,
  Compass,
  DoorOpen,
  FileSpreadsheet,
  FileText,
  Flag,
  Folder,
  GraduationCap,
  Handshake,
  Headset,
  Laptop,
  ListChecks,
  ListOrdered,
  MessageCircleQuestionMark,
  Monitor,
  Newspaper,
  Repeat,
  Search,
  Sparkles,
  Sprout,
  Store,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  briefcase: Briefcase,
  sparkles: Sparkles,
  "file-text": FileText,
  wallet: Wallet,
  "list-checks": ListChecks,
  newspaper: Newspaper,
  handshake: Handshake,
  "file-spreadsheet": FileSpreadsheet,
  headset: Headset,
  monitor: Monitor,
  users: Users,
  store: Store,
  "calendar-days": CalendarDays,
  building: Building,
  "badge-check": BadgeCheck,
  sprout: Sprout,
  "door-open": DoorOpen,
  "message-circle-question-mark": MessageCircleQuestionMark,
  search: Search,
  clock: Clock,
  repeat: Repeat,
  "user-round": UserRound,
  "graduation-cap": GraduationCap,
  flag: Flag,
  "list-ordered": ListOrdered,
  laptop: Laptop,
  "book-open": BookOpen,
  "clipboard-list": ClipboardList,
  info: Info,
  messages: MessagesSquare,
  scale: Scale,
};

/** 面の色（トークン名）。カテゴリ・入口ごとに柔らかく色分けする */
export type Tone = "mint" | "sky" | "sand" | "coral" | "lime" | "mist";

export const TONE_CLASSES: Record<Tone, { bg: string; fg: string }> = {
  mint: { bg: "bg-mint", fg: "text-mint-ink" },
  sky: { bg: "bg-sky", fg: "text-sky-ink" },
  sand: { bg: "bg-sand", fg: "text-sand-ink" },
  coral: { bg: "bg-coral", fg: "text-coral-ink" },
  lime: { bg: "bg-lime", fg: "text-lime-ink" },
  mist: { bg: "bg-mist", fg: "text-mist-ink" },
};

const CATEGORY_TONE: Record<string, Tone> = {
  mikeiken: "mint",
  shokushu: "sky",
  keiken: "sand",
  "shorui-mensetsu": "coral",
  hatarakikata: "lime",
  junbi: "mist",
  seido: "sky",
  news: "mist",
};

export function categoryToneName(slug: string): Tone {
  return CATEGORY_TONE[slug] ?? "mint";
}

export function categoryTone(slug: string) {
  return TONE_CLASSES[categoryToneName(slug)];
}

export function CategoryIcon({ name, className = "h-5 w-5", style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = ICONS[name] ?? Folder;
  return <Icon className={className} style={style} aria-hidden="true" />;
}
