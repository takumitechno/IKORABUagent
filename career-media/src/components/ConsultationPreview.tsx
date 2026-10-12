"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, FileText, CalendarDays, Compass } from "lucide-react";

import { CONSULTATION_TOPICS as CONCERNS } from "@/lib/consultation-topics";
import { SupportSample } from "./SupportSample";

const icons = [FileText, CalendarDays, Compass];
export function ConsultationPreview() {
  const [selected, setSelected] = useState(0);
  const concern = CONCERNS[selected];
  return (
    <div className="support-preview">
      <div className="support-choices" role="group" aria-label="相談したいことを選ぶ">
        {CONCERNS.map((item, i) => { const Icon = icons[i]; return <button key={item.label} type="button" aria-pressed={selected === i} aria-controls="support-answer" onClick={() => setSelected(i)}><span className="support-choice-icon"><Icon aria-hidden="true" /></span><strong>{item.label}</strong><span className="support-choice-state">{selected === i ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</span></button>; })}
      </div>
      <div id="support-answer" className="support-answer" aria-live="polite" aria-atomic="true">
        <div key={selected} className="support-answer-content">
          <div className="support-explanation">
            <p className="editorial-kicker">相談でできること</p>
            <h3>{concern.title}</h3>
            <p>{concern.help}</p>
            <a href={`/consultation#support-${concern.id}`} data-cta-placement="home-band" data-cta-kind="consultation-info" className="editorial-button">相談の内容を確認する<ArrowRight aria-hidden="true" /></a>
            <Link href={`/articles/${concern.article}`} className="editorial-text-link">{concern.read}<ArrowRight aria-hidden="true" /></Link>
          </div>
          <SupportSample topic={concern} />
        </div>
      </div>
      <p className="support-reassurance"><Check aria-hidden="true" />紹介された求人に応募するかは、自分で決められます。</p>
      <noscript><ul>{CONCERNS.map((item) => <li key={`/consultation#support-${item.id}`}><a href={`/consultation#support-${item.id}`}>{item.label}：相談でできること</a></li>)}</ul></noscript>
    </div>
  );
}
