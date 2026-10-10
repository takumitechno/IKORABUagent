import Link from "next/link";
import { ArrowLeft, ArrowRight, ClipboardList, Compass, MessageCircle, MessageSquareText } from "lucide-react";
import type { ArticleSummary } from "@/lib/content/types";
import { JOURNEY_ANCHOR, JOURNEYS, stepHref, type Journey, type JourneyStep } from "@/lib/journeys";
import { ConsultButton } from "./ConsultationCta";
import { Motif } from "./illustrations/Motif";
import { GeneratedImage } from "./GeneratedImage";

const stepTitle = (step: JourneyStep, articles: ArticleSummary[]) =>
  step.kind === "article" ? (articles.find((a) => a.slug === step.slug)?.title ?? null) : null;

/** 入口ページに表示する「順番に読むなら」ガイド（相談しなくても判断の材料がそろう順番） */
export function JourneyGuide({ journey, articles }: { journey: Journey; articles: ArticleSummary[] }) {
  const steps = journey.steps.filter((s) => s.kind !== "article" || articles.some((a) => a.slug === s.slug));
  const consult = steps.find((s) => s.kind === "consult");
  const readSteps = steps.filter((s) => s.kind !== "consult");
  return (
    <section id={JOURNEY_ANCHOR} aria-labelledby="journey-title" className="mt-6 scroll-mt-24 overflow-hidden rounded-[22px] bg-surface ring-1 ring-line">
      <div className={`flex items-start gap-4 p-5 sm:p-7 ${journey.tone}`}>
        <span className="relative block aspect-square w-16 shrink-0 rounded-full bg-surface sm:w-20">
          <Motif name={journey.scene} className="absolute inset-[6%]" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-ink/70">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            順番に読むなら
          </p>
          <h2 id="journey-title" className="mt-1 text-[20px] font-bold leading-snug text-ink sm:text-[24px]">
            {journey.title}
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-6 text-body">{journey.who}</p>
        </div>
      </div>
      <div className="p-5 sm:p-7">
        <p className="text-[14px] leading-7 text-body">{journey.outcome}</p>
        <ol className="relative mt-5 space-y-3">
          <span aria-hidden="true" className="absolute bottom-6 left-[23px] top-6 border-l-[3px] border-dotted border-brand/30" />
          {readSteps.map((step, i) => {
            const href = stepHref(step, journey);
            const title = stepTitle(step, articles);
            const kind = step.kind === "check" ? "check" : step.kind === "jobs" ? "jobs" : "article";
            return (
              <li key={href} className="relative grid grid-cols-[48px_minmax(0,1fr)] items-start gap-3">
                <span className={`relative z-[1] block aspect-square w-12 rounded-full ring-4 ring-surface ${step.kind === "check" ? "bg-brand-tint" : "bg-mint"}`}>
                  <Motif name={step.scene} className="absolute inset-[8%]" />
                  <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-night text-[10.5px] font-bold text-white ring-2 ring-surface">{i + 1}</span>
                </span>
                <div className="min-w-0 rounded-xl border border-line bg-surface p-3.5 sm:p-4">
                  <Link
                    href={href}
                    data-cta-kind={kind === "check" ? "check" : "journey-step"}
                    data-cta-placement="journey"
                    data-pattern-id={journey.patternId}
                    className="group block"
                  >
                    <span className="block text-[15px] font-bold leading-6 text-ink group-hover:text-brand-strong">{step.label}</span>
                    <span className="mt-1 block text-[13px] leading-6 text-body">{step.why}</span>
                    {title && <span className="mt-1.5 block text-[12.5px] font-medium leading-5 text-brand-strong underline underline-offset-4">記事: {title}</span>}
                    {step.kind === "jobs" && <span className="mt-1.5 block text-[12.5px] font-medium text-brand-strong underline underline-offset-4">職種を比べるページへ</span>}
                    {step.kind === "check" && (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[13px] font-bold text-white">
                        <ClipboardList className="h-4 w-4" aria-hidden="true" />
                        条件整理チェックへ
                      </span>
                    )}
                  </Link>
                  {step.kind === "article" && step.side && articles.some((a) => a.slug === step.side!.slug) && (
                    <Link href={`/articles/${step.side.slug}`} className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-brand-strong">
                      寄り道: {step.side.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[12.5px] leading-6 text-muted">順番どおりでなくても大丈夫です。ここまでで、相談しなくても比べる材料はそろいます。</p>

        {consult && (
          <div id={`${JOURNEY_ANCHOR}-questions`} className="mt-6 scroll-mt-24 rounded-2xl bg-canvas p-5 ring-1 ring-line sm:p-6">
            <p className="flex items-center gap-2 text-[16px] font-bold text-ink">
              <MessageSquareText className="h-5 w-5 text-brand" aria-hidden="true" />
              {consult.label}
            </p>
            <p className="mt-1.5 text-[13.5px] leading-6 text-body">{consult.why}</p>
            <ul className="mt-4 space-y-2">
              {journey.questions.map((q) => (
                <li key={q} className="rounded-lg border-l-4 border-brand bg-surface px-4 py-2.5 text-[14px] leading-6">
                  「{q}」
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/consultation"
                data-cta-placement="journey"
                data-cta-kind="consultation-info"
                data-pattern-id={journey.patternId}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-accent/50 bg-surface px-5 py-3 text-sm font-bold text-accent-strong hover:border-accent"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                相談でできることを見る
              </Link>
              <ConsultButton placement="journey" contentSlug={journey.id} label="この質問をもとに相談する" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** 記事がガイドの一部のときに出す「現在地」と前後のステップ */
export function JourneyNav({ journey, index, articles }: { journey: Journey; index: number; articles: ArticleSummary[] }) {
  const steps = journey.steps.filter((s) => s.kind !== "article" || articles.some((a) => a.slug === s.slug));
  const current = steps.findIndex((s) => s.kind === "article" && s.slug === (journey.steps[index] as { slug?: string }).slug);
  if (current < 0) return null;
  const prev = current > 0 ? steps[current - 1] : null;
  const next = steps[current + 1] ?? null;
  const label = (s: JourneyStep) => s.label;
  return (
    <nav aria-label={`ガイド「${journey.shortTitle}」の現在地`} className="no-print mt-10 rounded-2xl border border-brand/20 bg-brand-tint p-4 sm:p-5">
      <p className="flex items-center justify-between gap-2 text-[12px] font-bold text-brand-strong">
        <span className="flex items-center gap-1.5">
          <Compass className="h-4 w-4" aria-hidden="true" />
          読む順番ガイド
        </span>
        <span className="tabular-nums text-muted">
          STEP {current + 1} / {steps.length}
        </span>
      </p>
      <Link href={`${journey.hubs[0]}#${JOURNEY_ANCHOR}`} className="mt-1 block text-[15px] font-bold leading-6 text-ink hover:text-brand-strong hover:underline">
        {journey.title}
      </Link>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {prev ? (
          <Link href={stepHref(prev, journey)} data-cta-placement="journey" data-cta-kind="journey-step" data-pattern-id={journey.patternId} className="flex items-start gap-2 rounded-xl bg-surface p-3 text-[13.5px] leading-6 text-ink ring-1 ring-line hover:ring-brand/40">
            <ArrowLeft className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <span>
              <span className="block text-[11px] text-muted">前のステップ</span>
              {label(prev)}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link href={stepHref(next, journey)} data-cta-placement="journey" data-cta-kind={next.kind === "check" ? "check" : "journey-step"} data-pattern-id={journey.patternId} className="flex items-start justify-end gap-2 rounded-xl bg-surface p-3 text-right text-[13.5px] font-bold leading-6 text-ink ring-1 ring-brand/30 hover:ring-brand">
            <span>
              <span className="block text-[11px] font-normal text-muted">次のステップ</span>
              {label(next)}
            </span>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
}

const CASE_COPY = [
  { lead: "接客の経験を活かして", title: "デスクワークへ。", image: "editorial-workday", scene: "desk" as const },
  { lead: "給料は下げたくない。", title: "休みも増やしたい。", image: "editorial-weekend", scene: "calendar" as const },
  { lead: "バイトの経験から", title: "正社員を目指す。", image: "editorial-fresh-start", scene: "flag" as const },
];

export function JourneyCards() {
  return (
    <ul className="editorial-journeys">
      {JOURNEYS.map((j, i) => (
        <li key={j.id}>
          <Link href={`${j.hubs[0]}#${JOURNEY_ANCHOR}`} data-cta-placement="home-journeys" data-cta-kind="journey-start" data-pattern-id={j.patternId} className="editorial-story">
            <div className="editorial-story-photo"><GeneratedImage slug={CASE_COPY[i].image} sizes="(min-width: 768px) 33vw, 100vw" fallback={<Motif name={CASE_COPY[i].scene} className="h-full w-full" />} className="h-full w-full !object-cover" /><span aria-hidden="true">0{i + 1}</span></div>
            <div className="editorial-story-copy"><span>{CASE_COPY[i].lead}</span><h3>{CASE_COPY[i].title}</h3><span className="editorial-story-arrow" aria-label="読む順番ガイドへ"><ArrowRight aria-hidden="true" /></span></div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
