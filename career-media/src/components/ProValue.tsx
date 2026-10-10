import Link from "next/link";
import { ArrowRight, Building2, CalendarClock, Check, FileText, MessagesSquare, Search, UserRound, Users, type LucideIcon } from "lucide-react";
import { partner } from "@/config/partner";
import type { CtaPlacement } from "@/lib/consultation";
import { ConsultButton } from "./ConsultationCta";

/**
 * 「プロに頼むよさ」を見せる部品。このサイトの目的（記事とチェックで整理 → キャリア相談 → 自分に合う会社へ）に沿って、
 * ひとりで進める場合との違いと、相談でできること（partner config の serviceHighlights）を並べる。
 * 成果の保証や数字は出さない。応募するかどうかは本人が決める、を必ず添える。
 */
const ICONS: Record<(typeof partner.serviceHighlights)[number]["icon"], LucideIcon> = {
  building: Building2,
  messages: MessagesSquare,
  file: FileText,
  search: Search,
  calendar: CalendarClock,
};

const SOLO = ["求人票の情報だけで会社を選ぶ", "面接の練習相手がいない", "書類の書き方を自分で調べる", "日程や条件のやりとりも自分で"];
const PRO = ["職場のことを聞いてから会社を選べる", "模擬面接で本番の前に練習できる", "書類を添削してもらえる", "日程や条件の調整を任せられる"];

/** ひとりで進める／プロに相談しながら進める、の比較 */
export function SoloVsPro({ dark = false }: { dark?: boolean }) {
  const card = dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-line";
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      <div className={`rounded-2xl p-3.5 sm:p-5 ${card}`}>
        <p className={`flex items-center gap-1.5 text-[13px] font-bold sm:text-[14px] ${dark ? "text-white/70" : "text-muted"}`}>
          <UserRound className="h-4 w-4" aria-hidden="true" />
          ひとりで進める
        </p>
        <ul className="mt-3 grid gap-2">
          {SOLO.map((t) => (
            <li key={t} className={`flex items-start gap-1.5 text-[12.5px] leading-5 sm:text-[13.5px] sm:leading-6 ${dark ? "text-white/70" : "text-muted"}`}>
              <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${dark ? "bg-white/40" : "bg-line-strong"}`} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-pro-tint p-3.5 text-ink ring-2 ring-pro-ring sm:p-5">
        <p className="flex items-center gap-1.5 text-[13px] font-bold text-accent-strong sm:text-[14px]">
          <Users className="h-4 w-4" aria-hidden="true" />
          プロに相談しながら
        </p>
        <ul className="mt-3 grid gap-2">
          {PRO.map((t) => (
            <li key={t} className="flex items-start gap-1.5 text-[12.5px] font-bold leading-5 sm:text-[13.5px] sm:leading-6">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** 相談でできること（アイコン付きのタイル） */
export function ServiceHighlights({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <ul className={`grid gap-2.5 ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-5"}`}>
      {partner.serviceHighlights.map((h, i) => {
        const Icon = ICONS[h.icon];
        const last = !compact && i === partner.serviceHighlights.length - 1 ? "col-span-2 lg:col-span-1" : "";
        return (
          <li key={h.title} className={`flex gap-3 rounded-2xl p-3.5 sm:p-4 ${compact ? "" : "flex-col"} ${dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-line"} ${last}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={`block text-[14.5px] font-bold ${dark ? "text-white" : "text-ink"}`}>{h.title}</span>
              <span className={`mt-0.5 block text-[12px] leading-5 sm:text-[12.5px] ${dark ? "text-white/70" : "text-muted"}`}>{h.body}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** トップの上のほうに置く「プロに頼むよさ」のセクション */
const READS = [
  { slug: "tenshoku-agent-merit", title: "はじめて・未経験の転職こそ、エージェントに相談したほうがいい理由" },
  { slug: "mensetsu-renshu-pro", title: "面接の練習は、プロに頼むと何が変わる？" },
  { slug: "kigyou-erabi-soudan", title: "自分に合う会社選びを、プロに相談するとよい理由" },
];

export function ProValueSection({ placement = "home-consult", has = () => false }: { placement?: CtaPlacement; has?: (slug: string) => boolean }) {
  const reads = READS.filter((r) => has(r.slug));
  return (
    <div className="overflow-hidden rounded-[24px] bg-ink text-white">
      <div className="p-5 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold text-highlight ring-1 ring-white/15">はじめての転職・未経験の転職なら</p>
            <h2 id="home-consult" className="mt-3 text-[24px] font-bold leading-snug sm:text-[32px]">
              ひとりで悩むより、
              <br />
              <span className="text-highlight">{partner.proLabel}</span>と進めよう
            </h2>
            <p className="mt-3 text-[14px] leading-7 text-white/80 sm:text-[15px]">
              {partner.adviserLabel}に相談すると、会社選びから面接の練習まで、一緒に準備できます。応募するかどうかは、ご自身で決められます。
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <ConsultButton placement={placement} label="キャリア相談を申し込む" size="lg" />
              <Link href="/consultation" data-cta-placement={placement} data-cta-kind="consultation-info" className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[14px] font-bold text-white/90 hover:text-white">
                相談でできることを見る
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <SoloVsPro dark />
        </div>
        <div className="mt-8">
          <p className="text-[13px] font-bold text-white/70">相談でできること</p>
          <div className="mt-3">
            <ServiceHighlights dark />
          </div>
          <p className="mt-3 text-[11px] leading-5 text-white/50">{partner.serviceHighlightsNote}</p>
        </div>
        {reads.length > 0 && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[13px] font-bold text-white/70">プロに頼むよさを、記事で読む</p>
            <ul className="mt-3 grid gap-2.5 md:grid-cols-3">
              {reads.map((r) => (
                <li key={r.slug}>
                  <Link href={`/articles/${r.slug}`} className="flex h-full items-center gap-3 rounded-xl bg-white p-3.5 text-[13.5px] font-bold leading-6 text-ink hover:bg-pro-tint">
                    <span className="min-w-0 flex-1">{r.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
