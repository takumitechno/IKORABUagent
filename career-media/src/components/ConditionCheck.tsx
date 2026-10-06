"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCopy, Lightbulb, ListChecks, MessageSquareText, Printer, RotateCcw, Scale, Sparkles, Target } from "lucide-react";
import { buildResult, resultToText, type CheckResult } from "@/lib/condition-check/engine";
import { isStepComplete, sanitizeAnswers, STEPS, type Answers, type Question } from "@/lib/condition-check/questions";
import type { MotifName } from "@/lib/illustrations/motifs";
import { JOB_ROLE_SCENE } from "@/lib/illustrations/scenes";

const STORAGE_KEY = "condition-check:v1";

/** ステップごとのイラスト（状況 → 経験 → 条件 → スタイル → 結果） */
const STEP_SCENES: MotifName[] = ["clock", "star", "calendar", "chat", "checklist"];
const motif = (name: MotifName, className: string) => <span aria-hidden="true" className={`motif motif-${name} block ${className}`} />;

type Props = { consultationHref: string; consultationLabel: string; allowPrint?: boolean };

function OptionButton({ question, optionId, label, selected, onToggle }: { question: Question; optionId: string; label: string; selected: boolean; onToggle: () => void }) {
  const inputType = question.type === "single" ? "radio" : "checkbox";
  return (
    <label
      className={`tap flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[14.5px] leading-6 transition ${
        selected ? "border-brand bg-brand-tint font-bold text-ink ring-1 ring-brand" : "border-line bg-white text-body hover:border-brand/40"
      }`}
    >
      <input type={inputType} name={question.id} value={optionId} checked={selected} onChange={onToggle} className="sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center border ${inputType === "radio" ? "rounded-full" : "rounded-md"} ${
          selected ? "border-brand bg-brand text-white" : "border-line-strong bg-white"
        }`}
      >
        {selected && <Check className="enter-pop h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

export function ConditionCheck({ consultationHref, consultationLabel, allowPrint = true }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [triedNext, setTriedNext] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // 前回の回答を復元（このブラウザのタブ内だけ。サーバーには送信しない）
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(sanitizeAnswers(JSON.parse(raw)));
    } catch {
      /* storage が使えない環境では何もしない */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* noop */
    }
  }, [answers]);

  const step = STEPS[stepIndex];
  const stepComplete = isStepComplete(step, answers);
  const result: CheckResult | null = useMemo(() => (showResult ? buildResult(answers) : null), [showResult, answers]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const toggle = (question: Question, optionId: string) => {
    setAnswers((prev) => {
      const current = prev[question.id] ?? [];
      if (question.type === "single") return { ...prev, [question.id]: [optionId] };
      // 「ない」系の選択肢は他と排他にする
      if (optionId === "none") return { ...prev, [question.id]: current.includes("none") ? [] : ["none"] };
      const withoutNone = current.filter((v) => v !== "none");
      if (withoutNone.includes(optionId)) return { ...prev, [question.id]: withoutNone.filter((v) => v !== optionId) };
      if (question.max && withoutNone.length >= question.max) return prev;
      return { ...prev, [question.id]: [...withoutNone, optionId] };
    });
  };

  const next = () => {
    if (!stepComplete) {
      setTriedNext(true);
      return;
    }
    setTriedNext(false);
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
    else setShowResult(true);
    scrollTop();
  };

  const back = () => {
    setTriedNext(false);
    if (showResult) setShowResult(false);
    else setStepIndex(Math.max(0, stepIndex - 1));
    scrollTop();
  };

  const restart = () => {
    setAnswers({});
    setStepIndex(0);
    setShowResult(false);
    scrollTop();
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(resultToText(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* ステップ表示（イラスト付き。進むと線が伸びる） */}
      {(() => {
        const steps = [...STEPS.map((st) => ({ title: st.title, short: st.shortTitle })), { title: "結果", short: "結果" }];
        const currentIndex = showResult ? STEPS.length : stepIndex;
        return (
          <div className="no-print relative">
            <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-[22px] h-1 rounded-full bg-line sm:top-[26px]">
              <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }} />
            </div>
            <ol className="relative grid grid-cols-5 gap-1" aria-label="進み具合">
              {steps.map(({ title, short }, i) => {
                const done = i < currentIndex;
                const current = i === currentIndex;
                return (
                  <li key={title} aria-current={current ? "step" : undefined} className="flex flex-col items-center text-center">
                    <span
                      className={`relative block aspect-square w-11 rounded-full ring-[3px] transition sm:w-[52px] ${
                        current ? "enter-pop bg-mint ring-brand" : done ? "bg-mint ring-brand/40" : "bg-white ring-line grayscale opacity-60"
                      }`}
                    >
                      {motif(STEP_SCENES[i] ?? "checklist", "absolute inset-[6%]")}
                      {done && (
                        <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand text-white ring-2 ring-white">
                          <Check className="h-3 w-3" strokeWidth={3.2} aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <p className={`mt-1.5 text-[11px] leading-4 sm:text-xs ${current ? "font-bold text-ink" : "text-muted"}`}>
                      <span className="hidden sm:inline">
                        {i < STEPS.length ? `STEP ${i + 1} ` : ""}
                        {title}
                      </span>
                      <span className="sm:hidden">{short}</span>
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })()}

      {!result ? (
        <div key={stepIndex} className="enter mt-8">
          <div className="flex items-center gap-3">
            <span className="relative block aspect-square w-14 shrink-0 rounded-full bg-mint">{motif(STEP_SCENES[stepIndex] ?? "checklist", "absolute inset-[6%]")}</span>
            <div className="min-w-0">
              <h2 className="text-[21px] font-bold leading-snug text-ink sm:text-[22px]">{step.title}</h2>
              <p className="mt-0.5 text-sm leading-6 text-muted">{step.description}</p>
            </div>
          </div>
          <div className="mt-6 space-y-8">
            {step.questions.map((q) => {
              const selected = answers[q.id] ?? [];
              const missing = triedNext && selected.length === 0;
              return (
                <fieldset key={q.id} className="rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6" aria-describedby={missing ? `${q.id}-error` : undefined}>
                  <legend className="sr-only">{q.title}</legend>
                  <p className="text-[16px] font-bold leading-7 text-ink" aria-hidden="true">
                    {q.title}
                  </p>
                  {q.type === "multi" && <p className="mt-1 text-xs text-muted">{q.max ? `${q.max}つまで選べます` : "当てはまるものをすべて選んでください"}</p>}
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {q.options.map((o) => (
                      <OptionButton key={o.id} question={q} optionId={o.id} label={o.label} selected={selected.includes(o.id)} onToggle={() => toggle(q, o.id)} />
                    ))}
                  </div>
                  {missing && (
                    <p id={`${q.id}-error`} role="alert" className="mt-3 text-sm font-bold text-accent">
                      この質問に回答してください
                    </p>
                  )}
                </fieldset>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-bold text-muted hover:text-ink disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              戻る
            </button>
            <button
              type="button"
              onClick={next}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white transition ${stepComplete ? "bg-brand hover:bg-brand-strong" : "bg-brand/50"}`}
            >
              {stepIndex === STEPS.length - 1 ? "結果を見る" : "次へ進む"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <Result result={result} consultationHref={consultationHref} consultationLabel={consultationLabel} allowPrint={allowPrint} onBack={back} onRestart={restart} onCopy={copy} copied={copied} />
      )}
    </div>
  );
}

const RESULT_SCENES: Record<number, MotifName> = { 1: "calendar", 2: "star", 3: "scale", 4: "checklist", 5: "chat", 6: "flag" };

function ResultSection({ title, children, number }: { icon?: typeof Target; title: string; number: number; children: React.ReactNode }) {
  return (
    <section className="reveal rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6">
      <h3 className="flex items-center gap-3 text-[17px] font-bold text-ink">
        <span className="relative block aspect-square w-11 shrink-0 rounded-full bg-mint">{motif(RESULT_SCENES[number] ?? "checklist", "absolute inset-[6%]")}</span>
        <span>
          <span className="mr-1.5 text-xs font-bold text-brand">{number}</span>
          {title}
        </span>
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Result({
  result,
  consultationHref,
  consultationLabel,
  allowPrint,
  onBack,
  onRestart,
  onCopy,
  copied,
}: {
  result: CheckResult;
  consultationHref: string;
  consultationLabel: string;
  allowPrint: boolean;
  onBack: () => void;
  onRestart: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const top = result.candidates.slice(0, 3);
  return (
    <div className="mt-8" aria-live="polite">
      <div className="enter relative overflow-hidden rounded-[20px] bg-ink p-6 text-white sm:p-8">
        <span aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 block h-28 w-28 rounded-full bg-white/[0.06] sm:h-40 sm:w-40" />
        {motif("checklist", "anim-float-slow absolute right-4 top-4 h-16 w-16 rounded-full bg-white/90 sm:right-8 sm:top-8 sm:h-24 sm:w-24")}
        <p className="text-[11px] font-bold tracking-[0.2em] text-accent-bright">YOUR NOTE</p>
        <h2 className="mt-2 pr-20 text-[22px] font-bold leading-snug sm:pr-28 sm:text-[26px]">あなたの条件整理ノート</h2>
        <p className="mt-3 text-sm leading-7 text-white/80">
          回答をもとに、希望条件・活かせそうな経験・比べてみたい職種などを整理しました。これは向き不向きや選考の結果を判定するものではなく、次に調べること・確認することを考えるための材料です。
        </p>
        <div className="no-print mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={onCopy} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[13px] font-bold ring-1 ring-white/20 hover:bg-white/20">
            <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
            {copied ? "コピーしました" : "結果をテキストでコピー"}
          </button>
          {allowPrint && (
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[13px] font-bold ring-1 ring-white/20 hover:bg-white/20">
              <Printer className="h-4 w-4" aria-hidden="true" />
              印刷・PDFで保存
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <ResultSection icon={Target} title="希望条件の整理" number={1}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-accent-soft p-4">
              <p className="text-xs font-bold text-accent">ゆずれない条件</p>
              <ul className="mt-2 space-y-2">
                {result.mustHave.map((c) => (
                  <li key={c.label}>
                    <p className="font-bold text-ink">{c.label}</p>
                    <p className="text-[13px] leading-6 text-body">{c.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-canvas p-4">
              <p className="text-xs font-bold text-muted">できれば叶えたい条件</p>
              {result.niceToHave.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {result.niceToHave.map((c) => (
                    <li key={c.label}>
                      <p className="font-bold text-ink">{c.label}</p>
                      <p className="text-[13px] leading-6 text-body">{c.detail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">ほかの条件にはこだわりが少なく、選べる求人の幅を広く取れる状態です。</p>
              )}
            </div>
          </div>
          {result.conditionNote && (
            <p className="mt-4 flex gap-2 rounded-xl border border-accent/25 p-3 text-[13px] leading-6 text-body">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {result.conditionNote}
            </p>
          )}
        </ResultSection>

        <ResultSection icon={Sparkles} title="活かせそうな経験" number={2}>
          {result.skills.length > 0 ? (
            <ul className="space-y-3">
              {result.skills.map((s) => (
                <li key={s.from + s.skill} className="rounded-xl bg-canvas p-4">
                  <p className="text-xs font-bold text-muted">{s.from}</p>
                  <p className="mt-1 font-bold leading-7 text-ink">{s.skill}</p>
                  <p className="mt-1 text-xs text-brand-strong">活きやすい職種: {s.usefulIn.join("・")}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-7 text-body">
              仕事の経験が少なくても大丈夫です。学校生活や日常で続けてきたこと、得意な作業から整理してみましょう。
              <Link href="/articles/mikeiken-tenshoku-hajimekata" className="ml-1 font-bold text-brand-strong underline">
                経験の書き出し方を読む
              </Link>
            </p>
          )}
        </ResultSection>

        <ResultSection icon={Scale} title="比べてみたい職種" number={3}>
          <p className="text-[13px] leading-6 text-muted">回答と各職種の一般的な特徴を照らし合わせた、比較の出発点です。ほかの職種を候補から外すものではありません。</p>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            {top.map((c, i) => (
              <li key={c.role.slug} className={`flex flex-col rounded-xl border p-4 ${i === 0 ? "border-brand bg-brand-tint" : "border-line"}`}>
                <div className="flex items-center gap-3">
                  <span className="relative block aspect-square w-12 shrink-0 rounded-full bg-white">{motif(JOB_ROLE_SCENE[c.role.slug] ?? "briefcase", "absolute inset-[6%]")}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand">候補 {i + 1}</p>
                    <p className="text-[16px] font-bold leading-snug text-ink">{c.role.name}</p>
                  </div>
                </div>
                <p className="mt-1 text-[12.5px] leading-5 text-muted">{c.role.oneLiner}</p>
                {c.reasons.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[13px] leading-6 text-body">
                    {c.reasons.slice(0, 3).map((r) => (
                      <li key={r} className="flex gap-1.5">
                        <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
                {c.cautions.length > 0 && (
                  <p className="mt-2 rounded-lg bg-white/80 p-2 text-[12.5px] leading-5 text-body ring-1 ring-line">
                    <span className="font-bold text-accent">確認: </span>
                    {c.cautions[0]}
                  </p>
                )}
                <Link href={`/jobs#${c.role.slug}`} className="mt-auto pt-3 text-[13px] font-bold text-brand-strong underline underline-offset-4">
                  仕事内容を詳しく見る
                </Link>
              </li>
            ))}
          </ol>
        </ResultSection>

        <ResultSection icon={ListChecks} title="確認したい条件" number={4}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {result.conditionsToConfirm.map((t) => (
              <li key={t} className="flex gap-2 rounded-lg bg-canvas px-3 py-2.5 text-[14px] leading-6">
                <span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 rounded border border-line-strong bg-white" />
                {t}
              </li>
            ))}
          </ul>
        </ResultSection>

        <ResultSection icon={MessageSquareText} title="面談・面接で聞きたいこと" number={5}>
          <ul className="space-y-2">
            {result.interviewQuestions.map((q) => (
              <li key={q} className="rounded-lg border-l-4 border-brand bg-canvas px-4 py-2.5 text-[14px] leading-6">
                「{q}」
              </li>
            ))}
          </ul>
        </ResultSection>

        <ResultSection icon={ArrowRight} title="次にやること" number={6}>
          <ol className="grid gap-3 md:grid-cols-2">
            {result.nextActions.map((a, i) => (
              <li key={a.title}>
                <Link href={a.href} className="group flex h-full gap-3 rounded-xl border border-line p-4 hover:border-brand/40 hover:bg-brand-tint">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
                  <span>
                    <span className="block font-bold leading-6 text-ink group-hover:text-brand-strong">{a.title}</span>
                    <span className="mt-1 block text-[13px] leading-6 text-muted">{a.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </ResultSection>
      </div>

      <section aria-labelledby="check-cta" className="no-print mt-8 rounded-[20px] border-2 border-accent/30 bg-white p-6 text-center sm:p-8">
        <h3 id="check-cta" className="text-[20px] font-bold leading-snug text-ink">
          この整理結果をもとに、キャリアアドバイザーに相談する
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-body">
          整理した条件や経験をもとに、自分の場合はどんな求人や進め方があるのかを、キャリアアドバイザーと具体的に話せます。上の「結果をテキストでコピー」を使うと、相談のときに整理した内容を伝えやすくなります。
        </p>
        <a href={consultationHref} className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-8 py-4 text-base font-bold text-white shadow-[0_6px_16px_-6px_rgb(191_82_8/0.6)] hover:bg-accent-strong">
          {consultationLabel}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </a>
        <p className="mt-3 text-xs text-muted">回答内容が自動で相談先に送られることはありません。</p>
      </section>

      <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-bold text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          回答を見直す
        </button>
        <button type="button" onClick={onRestart} className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-bold text-muted hover:text-ink">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          最初からやり直す
        </button>
      </div>
    </div>
  );
}
