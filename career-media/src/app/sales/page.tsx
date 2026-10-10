import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { salesAddressee } from "@/config/sales";
import { RUNBOOK, runbookMinutes } from "@/lib/sales/runbook";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "商談メニュー", description: "商談用（非公開）", path: "/sales", noindex: true });

export default function SalesMenuPage() {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.2em] text-brand">MEETING DEMO</p>
      <h1 className="mt-1 text-[24px] font-bold leading-snug text-ink sm:text-[30px]">{salesAddressee}向け 商談メニュー</h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-8 text-body">
        Instagram の投稿から、記事・比較・条件整理・相談まで、実物を順番に開いてご覧いただくための順番です。上から開いていくと、約{Math.round(runbookMinutes())}分で全体をご覧いただけます。
      </p>
      <ol className="mt-8 space-y-3">
        {RUNBOOK.map((step, i) => (
          <li key={step.title} className="grid gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-start sm:p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-sm font-bold text-white">{i + 1}</span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[16px] font-bold text-ink">
                {step.title}
                <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-line">
                  <Clock className="h-3 w-3" aria-hidden="true" />約{step.minutes}分
                </span>
              </p>
              <p className="mt-1 text-[13px] leading-6 text-muted">見せる場所: {step.show}</p>
              <p className="mt-2 rounded-lg bg-canvas px-3 py-2 text-[14px] leading-7 text-body">話すこと: {step.say}</p>
              <p className="mt-1.5 text-[12.5px] text-brand-strong">次へ: {step.next}</p>
            </div>
            <Link href={step.href} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-press">
              開く
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[12.5px] leading-6 text-muted">この順番と話す内容は docs/sales/MEETING_DEMO_RUNBOOK.md と同じです。相談ボタンは本番の申し込みページへ移動しません（本番送客 OFF）。</p>
    </div>
  );
}
