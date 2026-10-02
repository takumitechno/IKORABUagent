import { escapeHtml } from "./layout";

export type CommandTone = "ok" | "warn" | "bad" | "neutral";

export interface CommandStat {
  label: string;
  value: string | number;
  detail?: string;
  tone?: CommandTone;
}

export function commandHero(options: {
  eyebrow: string;
  title: string;
  description: string;
  state: string;
  stateDetail?: string;
  tone?: CommandTone;
  cycle?: string[];
}): string {
  const tone = options.tone ?? "neutral";
  const cycle = options.cycle?.length
    ? `<div class="command-cycle" aria-label="運用サイクル">${options.cycle.map((label, index) => `<span class="command-cycle-step"><i>${String(index + 1).padStart(2, "0")}</i><b>${escapeHtml(label)}</b></span>`).join("")}</div>`
    : "";
  return `<header class="command-hero">
    <div class="command-hero-copy"><span class="command-eyebrow">${escapeHtml(options.eyebrow)}</span><h1>${escapeHtml(options.title)}</h1><p>${escapeHtml(options.description)}</p></div>
    <div class="command-core command-core-${tone}" role="status"><span class="command-core-ring" aria-hidden="true"><i></i></span><div><small>CURRENT STATE</small><strong>${escapeHtml(options.state)}</strong>${options.stateDetail ? `<p>${escapeHtml(options.stateDetail)}</p>` : ""}</div></div>
    ${cycle}
  </header>`;
}

export function commandStats(items: CommandStat[]): string {
  return `<section class="command-stats" aria-label="現在の集計">${items.map((item) => `<article class="command-stat command-stat-${item.tone ?? "neutral"}"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(String(item.value))}</strong>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}</article>`).join("")}</section>`;
}

export function commandEmpty(title: string, description: string): string {
  return `<div class="command-empty"><span class="command-empty-radar" aria-hidden="true"><i></i></span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(description)}</p></div></div>`;
}
