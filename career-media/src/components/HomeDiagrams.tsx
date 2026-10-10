import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, DoorOpen, FileText, Flag, MapPin, MessagesSquare, Search, UserRound, Wallet, type LucideIcon } from "lucide-react";

/**
 * トップページの図解。転職活動の流れ（7ステップ）と、求人票の見るところ（見本に番号を振ったもの）。
 * どちらも、公開中の記事があるときだけリンクを出す（has で確認）。数字や会社名は入れない。
 */
type Has = (slug: string) => boolean;

const FLOW: { icon: LucideIcon; title: string; text: string; slug: string }[] = [
  { icon: UserRound, title: "自己分析", text: "経験とゆずれない条件を書き出す", slug: "jiko-bunseki-yarikata" },
  { icon: Search, title: "求人を探す", text: "求人票の見方を知って比べる", slug: "kyujin-hyo-yomikata" },
  { icon: FileText, title: "書類を書く", text: "履歴書・職務経歴書をつくる", slug: "rirekisho-kakukoto-nai" },
  { icon: MessagesSquare, title: "面接", text: "よく聞かれる質問を準備する", slug: "mensetsu-yokukiku-shitsumon" },
  { icon: BadgeCheck, title: "内定", text: "承諾の前に労働条件を確かめる", slug: "naitei-shodaku-mae" },
  { icon: DoorOpen, title: "退職の手続き", text: "伝え方と、もらう書類を確認", slug: "taishoku-tsutaekata" },
  { icon: Flag, title: "入社", text: "入社前に条件の最終確認", slug: "tenshoku-koukai-shinai" },
];

const STEP_COLORS = ["#0f7b6c", "#1f5f99", "#a8432a", "#b85a12", "#3f6f1f", "#3a5068", "#3c4f8f"];

export function ProcessFlow({ has }: { has: Has }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white p-4 sm:p-6">
      {/* スマホ: 縦のタイムライン / デスクトップ: 横に7つ並べ、線でつなぐ */}
      <ol className="relative grid gap-0 md:grid-cols-7 md:gap-2">
        <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-0.5 bg-line md:hidden" />
        <span aria-hidden="true" className="absolute left-[7%] right-[7%] top-[22px] hidden h-0.5 bg-line md:block" />
        {FLOW.map((step, i) => {
          const Icon = step.icon;
          const inner = (
            <>
              <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ring-4 ring-white" style={{ background: STEP_COLORS[i] }}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 md:mt-2 md:text-center">
                <span className="block text-[11px] font-bold" style={{ color: STEP_COLORS[i] }}>
                  STEP {i + 1}
                </span>
                <span className="block text-[14.5px] font-bold text-ink">{step.title}</span>
                <span className="mt-0.5 block text-[12px] leading-5 text-muted">{step.text}</span>
              </span>
            </>
          );
          return (
            <li key={step.title}>
              {has(step.slug) ? (
                <Link href={`/articles/${step.slug}`} className="group flex items-start gap-3 rounded-xl py-2 hover:bg-brand-tint/50 md:flex-col md:items-center md:px-1">
                  {inner}
                </Link>
              ) : (
                <div className="flex items-start gap-3 py-2 md:flex-col md:items-center md:px-1">{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
      <Link href="/consultation" data-cta-placement="home-consult" data-cta-kind="consultation-info" className="mt-4 flex items-center gap-3 rounded-xl bg-[#fff8ef] p-3.5 ring-1 ring-accent/25 hover:ring-accent/50">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <MessagesSquare className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 text-[13px] leading-6 text-ink">
          <b>STEP 2〜7 は、転職のプロと一緒に進められます。</b>
          <span className="text-muted">求人の紹介、書類の添削、面接の練習、日程や条件の調整まで。</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
      </Link>
    </div>
  );
}

const POSTING: { no: number; icon: LucideIcon; label: string; value: string; point: string; slug: string; fallback?: string }[] = [
  { no: 1, icon: Wallet, label: "給与", value: "月給 〇〇万円（固定残業代〇時間分を含む）", point: "固定残業代の時間数と金額、超えた分の支払い", slug: "koteizangyo-kyujin" },
  { no: 2, icon: CalendarDays, label: "休日", value: "週休2日制（土日）・年間休日 〇〇日", point: "「完全週休2日」との違いと年間休日の日数", slug: "donichi-yasumi-shigoto" },
  { no: 3, icon: BadgeCheck, label: "試用期間", value: "〇か月（期間中の条件：〇〇）", point: "期間の長さと、その間の給与や条件の違い", slug: "shiyou-kikan" },
  { no: 4, icon: MapPin, label: "勤務地", value: "〇〇（変更の範囲：〇〇）", point: "転勤の有無と、勤務地が変わる範囲", slug: "tenkin-kinmuchi-kakunin", fallback: "tenshoku-koukai-shinai" },
];

export function JobPostingDiagram({ has }: { has: Has }) {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
      {/* 見本の求人票（架空・数字は〇） */}
      <figure className="relative rounded-2xl border border-line bg-white p-4 shadow-[0_18px_40px_-28px_rgb(20_43_62/0.5)] sm:p-5" aria-label="求人票の見本（架空）">
        <figcaption className="flex items-center justify-between border-b border-line pb-3">
          <span className="text-[15px] font-bold text-ink">一般事務（未経験歓迎）</span>
          <span className="rounded-full bg-canvas px-2 py-0.5 text-[10.5px] font-bold text-muted ring-1 ring-line">見本（架空）</span>
        </figcaption>
        <dl className="mt-1 divide-y divide-line text-[13px]">
          {POSTING.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.no} className="flex items-start gap-3 py-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-black text-white">{row.no}</span>
                <dt className="flex w-[74px] shrink-0 items-center gap-1 font-bold text-muted">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {row.label}
                </dt>
                <dd className="min-w-0 flex-1 font-medium text-ink">{row.value}</dd>
              </div>
            );
          })}
        </dl>
      </figure>
      {/* 番号ごとの見るところ */}
      <ol className="grid gap-2.5">
        {POSTING.map((row) => {
          const slug = has(row.slug) ? row.slug : row.fallback && has(row.fallback) ? row.fallback : undefined;
          const body = (
            <>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-black text-white">{row.no}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">{row.label}</span>
                <span className="block text-[12.5px] leading-5 text-muted">{row.point}</span>
              </span>
              {slug && <ArrowRight className="h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />}
            </>
          );
          return (
            <li key={row.no}>
              {slug ? (
                <Link href={`/articles/${slug}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3.5 hover:border-brand/40">
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-3.5">{body}</div>
              )}
            </li>
          );
        })}
        <li className="rounded-xl bg-[#fff8ef] p-3.5 text-[12.5px] leading-6 text-ink ring-1 ring-accent/25">
          求人票に書かれていないこと（職場の雰囲気・残業の実態・配属）は、
          <Link href="/consultation" data-cta-placement="home-consult" data-cta-kind="consultation-info" className="font-bold text-accent-strong underline underline-offset-2">
            キャリア相談
          </Link>
          のときにアドバイザーに聞けます。
        </li>
      </ol>
    </div>
  );
}

