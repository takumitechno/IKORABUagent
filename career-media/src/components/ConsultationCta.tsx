import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ClipboardList, MessageCircle, MessagesSquare } from "lucide-react";
import { ctaCopy } from "@/lib/cta-copy";
import { licenseLabel, partner } from "@/config/partner";
import { buildConsultationUrl, isExternalConsultationUrl, type CtaPlacement } from "@/lib/consultation";
import { ChatMock } from "./illustrations/ChatMock";

type Props = {
  placement: CtaPlacement;
  contentSlug?: string;
  variant?: "band" | "inline" | "compact";
  heading?: string;
  lead?: string;
  /** 記事のカテゴリ。文言をカテゴリに合わせる */
  category?: string;
};

/** キャリア相談でできること（partner config の serviceHighlights から先頭の3つ） */
const POINTS = partner.serviceHighlights.slice(0, 3).map((h) => h.title);

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
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-accent font-bold text-white transition-colors hover:bg-accent-press ${
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

export function ConsultationCta({ placement, contentSlug, variant = "band", heading, lead, category }: Props) {
  const copy = ctaCopy(category);
  if (variant === "compact") {
    return (
      <div className="rounded-[var(--radius-card)] border border-accent/25 bg-accent-soft p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
          {heading ?? copy.heading}
        </p>
        <p className="mt-2 text-[13px] leading-6 text-body">{lead ?? copy.lead}</p>
        <div className="mt-4">
          <ConsultButton placement={placement} contentSlug={contentSlug} label={copy.label} />
        </div>
        <AboutConsultationLink
          placement={placement}
          contentSlug={contentSlug}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-ink underline-offset-4 hover:text-accent-strong hover:underline"
        />
      </div>
    );
  }

  if (variant === "inline") {
    // 記事の途中: 記事のテーマに合わせて、プロに相談するとできることを短く案内する（整理のためのチェックも添える）
    return (
      <aside aria-label="キャリア相談のご案内" className="no-print my-10 overflow-hidden rounded-[var(--radius-card)] border-2 border-accent/30 bg-cta-tint">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white">
              <MessagesSquare className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[16.5px] font-bold leading-7 text-ink">{heading ?? copy.heading}</p>
              <p className="mt-1 text-[13.5px] leading-6 text-body">{lead ?? copy.lead}</p>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {partner.serviceHighlights.slice(0, 3).map((h) => (
              <li key={h.title} className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[12px] font-bold text-accent-strong ring-1 ring-accent/25">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {h.title}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <ConsultButton placement={placement} contentSlug={contentSlug} label={copy.label} />
            <Link
              href="/check"
              data-cta-placement={placement}
              data-cta-kind="check"
              data-content-slug={contentSlug}
              className="inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[13.5px] font-bold text-brand-strong hover:underline"
            >
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              先に条件を整理する（3分・登録不要）
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section aria-labelledby={`cta-${placement}`} className="no-print overflow-hidden rounded-2xl bg-night text-white">
      <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <h2 id={`cta-${placement}`} className="text-[21px] font-bold leading-snug sm:text-[26px]">
            {heading ?? copy.heading}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-white/80">
            {lead ?? copy.lead}
          </p>
          <ul className="mt-5 hidden space-y-2.5 md:block">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[14.5px] text-white/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-bright" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ConsultButton placement={placement} contentSlug={contentSlug} size="lg" label={category ? copy.label : undefined} />
            <AboutConsultationLink
              placement={placement}
              contentSlug={contentSlug}
              className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-[14px] font-bold text-white underline-offset-4 hover:underline"
            />
          </div>
          <PartnerNote className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/60" />
        </div>
        <div className="hidden md:block">
          <ChatMock />
        </div>
      </div>
    </section>
  );
}
