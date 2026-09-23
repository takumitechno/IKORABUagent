import { escapeHtml } from "./layout";

export type StatusTone = "ok" | "warn" | "serious" | "critical";
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";

export interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  confirmation?: string;
}

export function card(options: { title: string; body: string; eyebrow?: string }): string {
  return `<article class="t-card">${options.eyebrow ? `<p class="t-card__eyebrow">${escapeHtml(options.eyebrow)}</p>` : ""}<h3 class="t-card__title">${escapeHtml(options.title)}</h3><div class="t-card__body">${escapeHtml(options.body)}</div></article>`;
}

export function kpiTile(options: { label: string; value: string | number; detail?: string }): string {
  return `<article class="t-kpi"><div class="t-kpi__label">${escapeHtml(options.label)}</div><div class="t-kpi__value">${escapeHtml(String(options.value))}</div>${options.detail ? `<div class="t-kpi__detail">${escapeHtml(options.detail)}</div>` : ""}</article>`;
}

export function statusBadge(options: { status: StatusTone; icon: string; label: string }): string {
  if (!options.icon.trim() || !options.label.trim()) {
    throw new TypeError("statusBadge requires both icon and label");
  }
  return `<span class="t-badge t-badge--${options.status}" role="status"><span class="t-badge__icon" aria-hidden="true">${escapeHtml(options.icon)}</span><span class="t-badge__label">${escapeHtml(options.label)}</span></span>`;
}

export function button(options: ButtonOptions): string {
  const variant = options.variant ?? "secondary";
  const type = options.type ?? "button";
  if (variant === "destructive") {
    const confirmation = options.confirmation?.trim();
    if (!confirmation) throw new TypeError("destructive buttons require confirmation copy");
    const confirmationId = `confirm-${stableId(`${options.label}:${confirmation}`)}`;
    return `<span class="t-destructive"><button class="t-button t-button--destructive" type="${type}" aria-describedby="${confirmationId}" data-requires-confirmation="true"${options.disabled ? " disabled" : ""}>${escapeHtml(options.label)}</button><span id="${confirmationId}" class="t-destructive__confirmation" hidden>${escapeHtml(confirmation)}</span></span>`;
  }
  return `<button class="t-button t-button--${variant}" type="${type}"${options.disabled ? " disabled" : ""}>${escapeHtml(options.label)}</button>`;
}

export function emptyState(options: { title: string; description: string }): string {
  return `<section class="t-empty"><strong class="t-empty__title">${escapeHtml(options.title)}</strong><div class="t-empty__description">${escapeHtml(options.description)}</div></section>`;
}

export function sectionHeader(options: { title: string; description?: string; eyebrow?: string }): string {
  return `<header class="t-section-header"><div>${options.eyebrow ? `<p class="t-section-header__eyebrow">${escapeHtml(options.eyebrow)}</p>` : ""}<h2 class="t-section-header__title">${escapeHtml(options.title)}</h2>${options.description ? `<p class="t-section-header__description">${escapeHtml(options.description)}</p>` : ""}</div></header>`;
}

export function actionBar(options: { label?: string; actions: ButtonOptions[] }): string {
  return `<div class="t-action-bar" role="group"${options.label ? ` aria-label="${escapeHtml(options.label)}"` : ""}>${options.label ? `<span class="t-action-bar__label">${escapeHtml(options.label)}</span>` : ""}${options.actions.map(button).join("")}</div>`;
}

function stableId(value: string): string {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(36);
}
