import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { partner } from "@/config/partner";
import { buildConsultationUrl, type CtaPlacement } from "@/lib/consultation";

type Props = {
  placement: CtaPlacement;
  contentSlug?: string;
  variant?: "band" | "inline" | "compact";
  heading?: string;
  lead?: string;
};

const POINTS = ["これまでの経験と希望条件を一緒に整理", "未経験から挑戦できる求人の紹介", "応募書類・面接の準備や日程の調整"];

export function ConsultButton({ placement, contentSlug, label, size = "md" }: { placement: CtaPlacement; contentSlug?: string; label?: string; size?: "md" | "lg" }) {
  const text = label ?? (partner.consultationIsFree ? "未経験転職について無料で相談する" : "未経験転職について相談する");
  return (
    <a
      href={buildConsultationUrl(placement, contentSlug)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-accent font-bold text-white shadow-[0_6px_16px_-6px_rgb(191_82_8/0.6)] transition-colors hover:bg-accent-strong ${
        size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-[15px]"
      }`}
    >
      {text}
      <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
    </a>
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
        <p className="mt-2 text-[13px] leading-6 text-body">{lead ?? "整理した条件をもとに、キャリアアドバイザーに具体的な選択肢を相談できます。"}</p>
        <div className="mt-4">
          <ConsultButton placement={placement} contentSlug={contentSlug} label={partner.consultationIsFree ? "無料で相談してみる" : "相談してみる"} />
        </div>
        <p className="mt-3 text-[11px] leading-5 text-muted">運営: {partner.operatorDisplay}</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <aside aria-label="キャリア相談のご案内" className="no-print my-10 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-bold tracking-wider text-accent">CAREER CONSULTATION</p>
            <p className="mt-1.5 text-[17px] font-bold leading-7 text-ink">{heading ?? "自分の場合どんな選択肢があるか、相談してみませんか"}</p>
            <p className="mt-1.5 text-sm leading-6 text-muted">{lead ?? "記事で整理したことをもとに、キャリアアドバイザーと具体的な求人や進め方を話せます。"}</p>
          </div>
          <div className="shrink-0">
            <ConsultButton placement={placement} contentSlug={contentSlug} label="相談してみる" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section aria-labelledby={`cta-${placement}`} className="no-print overflow-hidden rounded-[20px] bg-ink text-white">
      <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-accent-bright">CAREER CONSULTATION</p>
          <h2 id={`cta-${placement}`} className="mt-3 text-2xl font-bold leading-snug sm:text-[28px]">
            {heading ?? "整理した条件をもとに、キャリアアドバイザーに相談する"}
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-white/80">
            {lead ?? `${partner.brandName}のキャリアアドバイザーが、あなたの経験と希望をもとに、未経験からの選択肢を一緒に考えます。`}
          </p>
          <ul className="mt-5 space-y-2.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[15px] text-white/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-bright" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 sm:p-6">
          <ConsultButton placement={placement} contentSlug={contentSlug} size="lg" />
          <p className="mt-4 text-[13px] leading-6 text-white/75">相談したあとに応募するかどうかは、ご自身で決められます。</p>
          <Link href="/consultation" className="mt-2 inline-block text-[13px] font-medium text-white underline underline-offset-4 hover:text-accent-bright">
            相談の流れ・できることを見る
          </Link>
          <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/60">
            運営: {partner.operatorDisplay}（有料職業紹介事業許可番号 {partner.licenseNumber}）
          </p>
        </div>
      </div>
    </section>
  );
}
