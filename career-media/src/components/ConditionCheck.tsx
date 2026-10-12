"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCopy, Lightbulb, MessageCircle, NotebookPen, Printer, RotateCcw } from "lucide-react";
import { buildResult, memoText, RESULT_SECTIONS, resultToText, type CheckResult } from "@/lib/condition-check/engine";
import { CHECK_VERSION, isStepComplete, sanitizeAnswers, STEPS, type Answers, type Question } from "@/lib/condition-check/questions";
import { track } from "@/lib/measurement/client";
import type { MotifName } from "@/lib/illustrations/motifs";
import { JOB_ROLE_SCENE } from "@/lib/illustrations/scenes";
import { CONSULTATION_TOPICS, checkConsultationTopic, withConsultationTopic, type ConsultationTopicId } from "@/lib/consultation-topics";

const STORAGE_KEY = "condition-check:v1";

const motif = (name: MotifName, className: string) => <span aria-hidden="true" className={`motif motif-${name} block ${className}`} />;

type Props = { consultationHref: string; consultationLabel: string; allowPrint?: boolean };

function OptionButton({ question, optionId, label, selected, onToggle }: { question: Question; optionId: string; label: string; selected: boolean; onToggle: () => void }) {
  const inputType = question.type === "single" ? "radio" : "checkbox";
  return (
    <label
      className={`tap flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[14.5px] leading-6 transition ${
        selected ? "border-brand bg-brand-tint font-bold text-ink ring-1 ring-brand" : "border-line bg-surface text-body hover:border-brand/40"
      }`}
    >
      <input type={inputType} name={question.id} value={optionId} checked={selected} onChange={onToggle} className="sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center border ${inputType === "radio" ? "rounded-full" : "rounded-md"} ${
          selected ? "border-brand bg-brand text-white" : "border-line-strong bg-surface"
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
  const [copied, setCopied] = useState<"" | "all" | "memo" | "failed">("");
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const [triedNext, setTriedNext] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  // 前回の回答を復元（このブラウザのタブ内だけ。サーバーや相談先には送信しない）
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(sanitizeAnswers(JSON.parse(raw)));
    } catch {
      setStorageOk(false);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      setStorageOk(false);
    }
    // 計測は「始めた」ことだけ（回答の中身は送らない・記録しない）
    if (!started.current && Object.keys(answers).length > 0) {
      started.current = true;
      track("check_started", { page_type: "check", check_version: CHECK_VERSION });
    }
  }, [answers]);

  const step = STEPS[stepIndex];
  const stepComplete = isStepComplete(step, answers);
  const result: CheckResult | null = useMemo(() => (showResult ? buildResult(answers) : null), [showResult, answers]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });

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
    else {
      setShowResult(true);
      track("check_completed", { page_type: "check", check_version: CHECK_VERSION });
    }
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
    setFallbackText(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    scrollTop();
  };

  // コピーできない環境（古いブラウザ・権限なし）では、文章を表示して手でコピーしてもらう
  const copy = async (kind: "all" | "memo") => {
    if (!result) return;
    const text = kind === "all" ? resultToText(result) : memoText(result, answers);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setFallbackText(null);
      setTimeout(() => setCopied(""), 2500);
    } catch {
      setCopied("failed");
      setFallbackText(text);
    }
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {!storageOk && (
        <p role="status" className="no-print mb-4 rounded-xl border border-line bg-surface px-4 py-3 text-[13px] leading-6 text-body">
          このブラウザの設定では回答を一時保存できないため、ページを閉じたり再読み込みしたりすると回答が消えます。チェック自体はそのまま使えます。
        </p>
      )}
      <ol className="check-progress no-print" aria-label="進み具合">
        {[...STEPS.map(st => st.shortTitle), "結果"].map((title, i) => {
          const currentIndex = showResult ? STEPS.length : stepIndex;
          return <li key={title} aria-current={i === currentIndex ? "step" : undefined} data-complete={i < currentIndex || undefined}><span>{i < currentIndex ? <Check aria-hidden="true" /> : String(i + 1).padStart(2, "0")}</span>{title}</li>;
        })}
      </ol>

      {!result ? (
        <div key={stepIndex} className="enter mt-4">
          <div className="flex items-center gap-3">
            <span className="check-step-number" aria-hidden="true">0{stepIndex + 1}</span>
            <div className="min-w-0">
              <h2 className="text-[21px] font-bold leading-snug text-ink sm:text-[22px]">{step.title}</h2>
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
          <div className="mt-4 space-y-8">
            {step.questions.map((q, qi) => {
              const selected = answers[q.id] ?? [];
              const missing = triedNext && selected.length === 0;
              return (
                <fieldset key={q.id} className="enter rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6" style={{ animationDelay: `${0.08 + qi * 0.1}s` }} aria-describedby={missing ? `${q.id}-error` : undefined}>
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
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-muted hover:text-ink disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              戻る
            </button>
            <button
              type="button"
              onClick={next}
              className={`inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-bold text-white transition ${stepComplete ? "bg-brand hover:bg-brand-press" : "bg-brand/50"}`}
            >
              {stepIndex === STEPS.length - 1 ? "結果を見る" : "次へ進む"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <Result
          result={result}
          initialTopic={checkConsultationTopic(answers)}
          consultationHref={consultationHref}
          consultationLabel={consultationLabel}
          allowPrint={allowPrint}
          onBack={back}
          onRestart={restart}
          onCopy={copy}
          copied={copied}
          fallbackText={fallbackText}
        />
      )}
    </div>
  );
}


function ResultSection({ title, children, number, note }: { title: string; number: number; note?: string; children: React.ReactNode }) {
  return (
    <details className="result-detail break-inside-avoid border-b border-line bg-surface">
      <summary className="flex cursor-pointer items-center gap-3 py-4 text-[15px] font-bold text-ink sm:text-[17px]">
        <span className="check-step-number" aria-hidden="true">0{number}</span>
        <span>{title}</span>
        <span className="result-detail-toggle ml-auto shrink-0" aria-hidden="true">＋</span>
      </summary>
      {note && <p className="mt-2 text-[12.5px] leading-6 text-muted">{note}</p>}
      <div className="pb-6 pt-4">{children}</div>
    </details>
  );
}

function Result({
  result,
  initialTopic,
  consultationHref,
  consultationLabel,
  allowPrint,
  onBack,
  onRestart,
  onCopy,
  copied,
  fallbackText,
}: {
  result: CheckResult;
  initialTopic: ConsultationTopicId;
  consultationHref: string;
  consultationLabel: string;
  allowPrint: boolean;
  onBack: () => void;
  onRestart: () => void;
  onCopy: (kind: "all" | "memo") => void;
  copied: "" | "all" | "memo" | "failed";
  fallbackText: string | null;
}) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [topicId, setTopicId] = useState(initialTopic);
  const topic = CONSULTATION_TOPICS.find((item) => item.id === topicId)!;
  const applyHref = withConsultationTopic(consultationHref, topicId);
  const infoHref = `/consultation#support-${topicId}`;
  useEffect(() => {
    let closed: HTMLDetailsElement[] = [];
    const expand = () => {
      closed = Array.from(resultRef.current?.querySelectorAll<HTMLDetailsElement>("details:not([open])") ?? []);
      closed.forEach((detail) => { detail.open = true; });
    };
    const restore = () => {
      closed.forEach((detail) => { detail.open = false; });
      closed = [];
    };
    window.addEventListener("beforeprint", expand);
    window.addEventListener("afterprint", restore);
    return () => {
      window.removeEventListener("beforeprint", expand);
      window.removeEventListener("afterprint", restore);
    };
  }, []);
  const top = result.candidates.slice(0, 3);
  const [s1, s2, s3, s4, s5, s6, s7] = RESULT_SECTIONS;
  const button = "inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-bold ring-1";
  return (
    <div ref={resultRef} className="check-result mt-8" aria-live="polite">
      <div className="enter rounded-[18px] border border-line-strong bg-surface p-6 text-ink sm:p-8">
        <p className="editorial-kicker">条件整理の結果</p>
        <h2 className="mt-2 text-[22px] font-bold leading-snug sm:text-[26px]">相談用のメモ</h2>
        <p className="mt-3 text-sm leading-7 text-body">
          回答をもとに希望と経験をまとめました。適職の判定や、相談先への送信は行いません。
        </p>
        <dl className="result-summary">
          <div><dt>譲れない条件</dt><dd>{result.priorityConditions.map((c) => c.label).join("・") || "まだ決めていなくて大丈夫"}</dd></div>
          <div><dt>活かせる経験</dt><dd>{result.skills[0]?.skill ?? "学校や日常で続けてきたことから整理しよう"}</dd></div>
          <div><dt>次に確認すること</dt><dd>{result.selfActions[0]?.title ?? "気になる条件をひとつ書き出す"}</dd></div>
        </dl>
        <div className="no-print mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => onCopy("memo")} className={`${button} bg-brand text-white ring-brand hover:bg-brand-press`}>
            <NotebookPen className="h-4 w-4" aria-hidden="true" />
            {copied === "memo" ? "メモをコピーしました" : "相談用メモをコピー"}
          </button>
          <button type="button" onClick={() => onCopy("all")} className={`${button} bg-surface text-ink ring-line-strong hover:bg-brand-tint`}>
            <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
            {copied === "all" ? "コピーしました" : "すべての項目をコピー"}
          </button>
          {allowPrint && (
            <button type="button" onClick={() => window.print()} className={`${button} bg-surface text-ink ring-line-strong hover:bg-brand-tint`}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              印刷・PDF保存
            </button>
          )}
        </div>
      </div>

      {fallbackText && (
        <div className="no-print mt-4 rounded-xl border border-line bg-surface p-4">
          <label htmlFor="copy-fallback" className="text-[13px] font-bold text-ink">
            この環境では自動でコピーできませんでした。下の文章を選んでコピーしてください。
          </label>
          <textarea id="copy-fallback" readOnly value={fallbackText} rows={10} onFocus={(e) => e.currentTarget.select()} className="mt-2 w-full rounded-lg border border-line bg-canvas p-3 font-[inherit] text-[13px] leading-6 text-ink" />
        </div>
      )}

      <section className="result-next no-print" aria-labelledby="result-consult-title">
        <h3 id="result-consult-title">相談したい内容を選ぶ</h3>
        <p className="result-topic-note">回答をもとに選んでいます。別の内容にも変更できます。</p>
        <div className="result-topic-choices" role="group" aria-label="相談テーマを選ぶ">
          {CONSULTATION_TOPICS.map((item) => <button key={item.id} type="button" aria-pressed={topicId === item.id} aria-controls="result-consult-actions" onClick={() => setTopicId(item.id)}>{item.short}</button>)}
        </div>
        <div id="result-consult-actions" aria-live="polite" aria-atomic="true">
          <p className="result-consult-help">{topic.help}</p>
          <div className="result-consult-links">
            <a href={applyHref} data-cta-placement="check-result" data-cta-kind="consultation-apply" className="editorial-button">{topic.consult}<ArrowRight aria-hidden="true" /></a>
            <a href={infoHref} data-cta-placement="check-result" data-cta-kind="consultation-info" className="editorial-text-link">相談の内容を確認する<ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <p className="result-topic-note">相談は任意です。回答やメモは自動送信されません。伝えたい内容だけ話せます。</p>
      </section>
      <p className="mt-8 text-xs font-bold text-muted">詳しい内容は、項目を開いて確認できます。</p>
      <div className="mt-3">
        <ResultSection title={s1} number={1}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-accent-soft p-4">
              <p className="text-xs font-bold text-accent">最優先の条件</p>
              {result.priorityConditions.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {result.priorityConditions.map((c) => (
                    <li key={c.label}>
                      <p className="font-bold text-ink">{c.label}</p>
                      <p className="text-[13px] leading-6 text-body">{c.detail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-body">まだ決めていなくて大丈夫です。比べていくうちに見えてきます。</p>
              )}
            </div>
            <div className="rounded-xl bg-canvas p-4">
              <p className="text-xs font-bold text-muted">その他の希望条件</p>
              {result.otherConditions.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {result.otherConditions.map((c) => (
                    <li key={c.label}>
                      <p className="font-bold text-ink">{c.label}</p>
                      <p className="text-[13px] leading-6 text-body">{c.detail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">このほかの希望条件は、まだ具体的に選ばれていません。相談しながら整理しても大丈夫です。</p>
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

        <ResultSection title={s2} number={2}>
          {result.skills.length > 0 ? (
            <ul className="space-y-3">
              {result.skills.map((s) => (
                <li key={s.from + s.skill} className="rounded-xl bg-canvas p-4">
                  <p className="text-xs font-bold text-muted">{s.from}</p>
                  <p className="mt-1 font-bold leading-7 text-ink">{s.skill}</p>
                  <p className="mt-1 text-xs text-brand-strong">つながりやすい仕事の例: {s.usefulIn.join("・")}</p>
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

        <ResultSection title={s3} number={3} note="回答と、各職種の一般的な特徴を照らし合わせた「比べ始める候補」です。向き不向きの判定ではなく、ほかの職種を候補から外すものでもありません。">
          <ul className="grid gap-4 md:grid-cols-3">
            {top.map((c) => (
              <li key={c.role.slug} className="flex flex-col rounded-xl border border-line p-4">
                <div className="flex items-center gap-3">
                  <span className="relative block aspect-square w-12 shrink-0 rounded-full bg-mint">{motif(JOB_ROLE_SCENE[c.role.slug] ?? "briefcase", "absolute inset-[6%]")}</span>
                  <p className="min-w-0 text-[16px] font-bold leading-snug text-ink">{c.role.name}</p>
                </div>
                <p className="mt-2 text-[12.5px] leading-5 text-muted">{c.role.oneLiner}</p>
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
                  <p className="mt-2 rounded-lg bg-canvas p-2 text-[12.5px] leading-5 text-body">
                    <span className="font-bold text-accent">確認: </span>
                    {c.cautions[0]}
                  </p>
                )}
                <Link href={`/jobs#${c.role.slug}`} className="mt-auto pt-3 text-[13px] font-bold text-brand-strong underline underline-offset-4">
                  仕事内容を比べる
                </Link>
              </li>
            ))}
          </ul>
        </ResultSection>

        <ResultSection title={s4} number={4} note="求人票や面接で確かめるときのチェックリストです。">
          <ul className="grid gap-2 sm:grid-cols-2">
            {result.conditionsToConfirm.map((t) => (
              <li key={t} className="flex gap-2 rounded-lg bg-canvas px-3 py-2.5 text-[14px] leading-6">
                <span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 rounded border border-line-strong bg-surface" />
                {t}
              </li>
            ))}
          </ul>
        </ResultSection>

        <ResultSection title={s5} number={5} note="面接でも、人材紹介会社の面談でも使える質問です。">
          <ul className="space-y-2">
            {result.interviewQuestions.map((q) => (
              <li key={q} className="rounded-lg border-l-4 border-brand bg-canvas px-4 py-2.5 text-[14px] leading-6">
                「{q}」
              </li>
            ))}
          </ul>
        </ResultSection>

        <ResultSection title={s6} number={6} note="相談しなくても、ここから自分で進められます。">
          <ol className="grid gap-3 md:grid-cols-2">
            {result.selfActions.map((a, i) => (
              <li key={a.title}>
                <Link href={a.href} className="group flex h-full gap-3 rounded-xl border border-line p-4 hover:border-brand/40 hover:bg-brand-tint">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-night text-xs font-bold text-white">{i + 1}</span>
                  <span>
                    <span className="block font-bold leading-6 text-ink group-hover:text-brand-strong">{a.title}</span>
                    <span className="mt-1 block text-[13px] leading-6 text-muted">{a.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </ResultSection>

        <ResultSection title={s7} number={7} note="相談は必須ではありません。具体的な求人で考えたくなったときの進め方です。">
          <ol className="space-y-2">
            {result.consultSteps.map((t, i) => (
              <li key={t} className="flex gap-3 text-[14px] leading-6 text-body">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[12px] font-bold text-accent-strong">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
          <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" onClick={() => onCopy("memo")} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line-strong bg-surface px-5 py-3 text-sm font-bold text-ink hover:border-brand">
              <NotebookPen className="h-4 w-4 text-brand" aria-hidden="true" />
              {copied === "memo" ? "メモをコピーしました" : "相談用メモをコピー"}
            </button>
            <a href={infoHref} data-cta-placement="check-result" data-cta-kind="consultation-info" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line-strong bg-surface px-5 py-3 text-sm font-bold text-brand-strong hover:border-brand">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              相談の内容をもう一度確認する
            </a>
            <a href={applyHref} data-cta-placement="check-result" data-cta-kind="consultation-apply" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-press">
              {consultationLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <p className="mt-3 text-xs text-muted">回答内容が自動で相談先に送られることはありません。伝えたいことだけを、メモから選んで伝えてください。</p>
        </ResultSection>
      </div>

      <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          回答を見直す
        </button>
        <button type="button" onClick={onRestart} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-muted hover:text-ink">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          最初からやり直す（回答を消す）
        </button>
      </div>
    </div>
  );
}
