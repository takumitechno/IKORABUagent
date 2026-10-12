import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ClipboardList, MessageCircle, MessagesSquare } from "lucide-react";
import { ctaCopy } from "@/lib/cta-copy";
import { licenseLabel, partner } from "@/config/partner";
import { buildConsultationUrl, isExternalConsultationUrl, type CtaPlacement } from "@/lib/consultation";
import { SupportSample } from "./SupportSample";
import { CONSULTATION_TOPICS, withConsultationTopic, type ConsultationTopicId } from "@/lib/consultation-topics";

type Props = {
  placement: CtaPlacement;
  contentSlug?: string;
  variant?: "band" | "inline" | "compact";
  heading?: string;
  lead?: string;
  /** 記事のカテゴリ。文言をカテゴリに合わせる */
  category?: string;
  topic?: ConsultationTopicId;
  question?: string;
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
export function ConsultButton({ placement, contentSlug, label, size = "md", topic }: { placement: CtaPlacement; contentSlug?: string; label?: string; size?: "md" | "lg"; topic?: ConsultationTopicId }) {
  const baseHref = buildConsultationUrl(placement, contentSlug);
  const external = isExternalConsultationUrl(baseHref);
  const href = topic ? withConsultationTopic(baseHref, topic) : baseHref;
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={href}
      data-cta-placement={placement}
      data-cta-kind="consultation-apply"
      data-content-slug={contentSlug}
      className={`consult-action inline-flex items-center justify-center gap-1.5 rounded-xl font-bold ${
        size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-[15px]"
      }`}
    >
      {label ?? "整理した内容をもとに相談する"}
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
    </a>
  );
}

/** 相談の説明ページへのリンク（申し込みではない） */
function AboutConsultationLink({ placement, contentSlug, className, topic }: { placement: CtaPlacement; contentSlug?: string; className: string; topic?: ConsultationTopicId }) {
  // 通常の遷移で :target を確定させる。クライアント遷移の再利用では前の相談テーマが残ることがある。
  return (
    <a href={topic ? `/consultation#support-${topic}` : "/consultation"} data-cta-placement={placement} data-cta-kind="consultation-info" data-content-slug={contentSlug} className={className}>
      相談の内容を確認する
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

export function ConsultationCta({ placement, contentSlug, variant = "band", heading, lead, category, topic, question }: Props) {
  const copy = ctaCopy(category);
  const sample = CONSULTATION_TOPICS.find((item) => item.id === topic);
  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <MessageCircle className="h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />
          {heading ?? copy.heading}
        </p>
        <p className="mt-2 text-[13px] leading-6 text-body">{lead ?? copy.lead}</p>
        <div className="mt-4">
          <ConsultButton placement={placement} contentSlug={contentSlug} label={copy.label} topic={topic} />
        </div>
        <AboutConsultationLink
          topic={topic}
          placement={placement}
          contentSlug={contentSlug}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-strong underline underline-offset-4"
        />
      </div>
    );
  }

  if (variant === "inline") {
    // 記事の途中: 記事のテーマに合わせて、プロに相談するとできることを短く案内する（整理のためのチェックも添える）
    return (
      <aside aria-label="キャリア相談のご案内" className="no-print my-10 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-strong">
              <MessagesSquare className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[16.5px] font-bold leading-7 text-ink">{heading ?? copy.heading}</p>
              <p className="mt-1 text-[13.5px] leading-6 text-body">{lead ?? copy.lead}</p>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {partner.serviceHighlights.slice(0, 3).map((h) => (
              <li key={h.title} className="inline-flex items-center gap-1 px-1 py-1 text-[12px] text-muted">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {h.title}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <ConsultButton placement={placement} contentSlug={contentSlug} label={copy.label} topic={topic} />
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
    <section aria-labelledby={`cta-${placement}`} className="consult-band no-print">
      <div className="consult-band-layout">
        <div className="consult-band-copy">
          <p className="editorial-kicker">キャリア相談のご案内</p>
          <h2 id={`cta-${placement}`}>
            {heading ?? copy.heading}
          </h2>
          <p className="consult-band-lead">
            {lead ?? copy.lead}
          </p>
          {question && <blockquote className="consult-question"><span>相談では、こんな質問から</span>「{question}」</blockquote>}
          <ul className="consult-band-points">
            {POINTS.map((p) => (
              <li key={p}>
                <CheckCircle2 aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ConsultButton placement={placement} contentSlug={contentSlug} size="lg" label={copy.label} topic={topic} />
            <AboutConsultationLink
              topic={topic}
              placement={placement}
              contentSlug={contentSlug}
              className="editorial-text-link"
            />
          </div>
          <PartnerNote className="mt-5 border-t border-line pt-4 text-[11px] leading-5 text-muted" />
          {placement === "article-bottom" && <p className="consult-optional">希望を整理してから話したい方は、<Link href="/check" data-cta-placement={placement} data-content-slug={contentSlug} data-cta-kind="check">相談用のメモを作る</Link>（登録不要）。</p>}
        </div>
        {sample && placement !== "article-bottom" && <SupportSample topic={sample} />}
      </div>
    </section>
  );
}
