import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ClipboardList, MessageCircle } from "lucide-react";
import { licenseLabel, partner } from "@/config/partner";
import { buildConsultationUrl, isExternalConsultationUrl, type CtaPlacement } from "@/lib/consultation";
import { ChatMock } from "./illustrations/ChatMock";

type Props = {
  placement: CtaPlacement;
  contentSlug?: string;
  variant?: "band" | "inline" | "compact";
  heading?: string;
  lead?: string;
};

/** キャリア相談（人材紹介サービス）で一般的にできること。提携先の固有のサービス内容は書かない */
const POINTS = ["これまでの経験と希望条件の整理", "条件に合いそうな求人の紹介", "応募書類・面接の準備のサポート"];

/** 相談先の表記（運営者とは分けて書く） */
export function PartnerNote({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      相談先: {partner.partnerName}（有料職業紹介事業許可番号: {licenseLabel}）
    </p>
  );
}

/**
 * 相談の申し込みボタン。リンク先は buildConsultationUrl が決める
 * （本番送客が無効な間はサイト内の説明ページ。外部の申込フォームには出ない）。
 */
export function ConsultButton({ placement, contentSlug, label, size = "md" }: { placement: CtaPlacement; contentSlug?: string; label?: string; size?: "md" | "lg" }) {
  const href = buildConsultationUrl(placement, contentSlug);
  const external = isExternalConsultationUrl(href);
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={href}
      data-cta-placement={placement}
      data-cta-kind="consultation-apply"
      data-content-slug={contentSlug}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-accent font-bold text-white shadow-[0_6px_16px_-6px_rgb(191_82_8/0.6)] transition-colors hover:bg-accent-strong ${
        size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-[15px]"
      }`}
    >
      {label ?? "整理した内容をもとに相談する"}
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
    </a>
  );
}

/** 相談の説明ページへのリンク（申し込みではない） */
function AboutConsultationLink({ placement, contentSlug, className }: { placement: CtaPlacement; contentSlug?: string; className: string }) {
  return (
    <Link href="/consultation" data-cta-placement={placement} data-cta-kind="consultation-info" data-content-slug={contentSlug} className={className}>
      相談でできることを見る
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </Link>
  );
}

export function ConsultationCta({ placement, contentSlug, variant = "band", heading, lead }: Props) {
  if (variant === "compact") {
    return (
      <div className="rounded-[var(--radius-card)] border border-accent/25 bg-accent-soft p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
          {heading ?? "自分の場合はどうなる？"}
        </p>
        <p className="mt-2 text-[13px] leading-6 text-body">{lead ?? "記事で整理したことをもとに、具体的な求人や進め方を人材紹介会社のキャリアアドバイザーに相談することもできます。"}</p>
        <AboutConsultationLink
          placement={placement}
          contentSlug={contentSlug}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-white px-4 py-2.5 text-sm font-bold text-ink hover:border-accent hover:text-accent-strong"
        />
      </div>
    );
  }

  if (variant === "inline") {
    // 記事の途中では相談をすすめず、まず自分の条件を整理する道具を案内する
    return (
      <aside aria-label="条件整理チェックのご案内" className="no-print my-10 overflow-hidden rounded-[var(--radius-card)] border border-line bg-brand-tint">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="motif motif-checklist block h-14 w-14 shrink-0 rounded-full bg-white" />
            <div>
              <p className="text-[16px] font-bold leading-7 text-ink">{heading ?? "読みながら、自分の条件も整理してみる"}</p>
              <p className="mt-1 text-sm leading-6 text-body">{lead ?? "13の質問に答えると、ゆずれない条件・比べたい職種・求人で確認することが一覧になります。登録不要、回答は送信されません。"}</p>
            </div>
          </div>
          <Link
            href="/check"
            data-cta-placement={placement}
            data-cta-kind="check"
            data-content-slug={contentSlug}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-strong"
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            条件整理チェック
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <section aria-labelledby={`cta-${placement}`} className="no-print overflow-hidden rounded-[24px] bg-ink text-white">
      <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="motif motif-chat block h-12 w-12 shrink-0 rounded-full bg-white/90 md:hidden" aria-hidden="true" />
            <p className="text-xs font-bold tracking-[0.2em] text-accent-bright">CAREER CONSULTATION</p>
          </div>
          <h2 id={`cta-${placement}`} className="mt-3 text-[22px] font-bold leading-snug sm:text-[28px]">
            {heading ?? "自分の場合を、一緒に整理してもらう"}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-white/80 sm:leading-8">
            {lead ?? "記事やチェックで整理したことをもとに、人材紹介会社のキャリアアドバイザーと、具体的な求人や進め方を話せます。"}
          </p>
          <ul className="mt-5 space-y-2.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[14.5px] text-white/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-bright" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ConsultButton placement={placement} contentSlug={contentSlug} size="lg" />
            <AboutConsultationLink
              placement={placement}
              contentSlug={contentSlug}
              className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-[14px] font-bold text-white underline-offset-4 hover:underline"
            />
          </div>
          <p className="mt-3 text-[13px] leading-6 text-white/75">相談したあとに応募するかどうかは、ご自身で決められます。まだ迷っている段階の相談でも大丈夫です。</p>
          <PartnerNote className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/60" />
        </div>
        <div className="hidden md:block">
          <ChatMock />
        </div>
      </div>
    </section>
  );
}
