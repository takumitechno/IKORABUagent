/** Shared product tokens. Dark is the default; customer theme selection opts into light. */
export const designTokens = `
:root {
  color-scheme: dark;
  --t-bg: #0b0f14;
  --t-surface: #141a22;
  --t-surface-2: #1b232d;
  --t-line: #26313d;
  --t-line-soft: #1e2731;
  --t-ink: #e9eef5;
  --t-ink-2: #b3c0cf;
  --t-ink-muted: #8493a5;
  --t-brand: #6f93ff;
  --t-brand-ink: #0b0f14;
  --t-brand-soft: #182444;
  --t-focus: #8fb0ff;
  --t-ok: #54d39a;
  --t-ok-ink: #071b12;
  --t-ok-soft: #123526;
  --t-warn: #f2bd5b;
  --t-warn-ink: #211604;
  --t-warn-soft: #3c2d11;
  --t-serious: #ff8a73;
  --t-serious-ink: #240b06;
  --t-serious-soft: #442019;
  --t-critical: #ff6b8a;
  --t-critical-ink: #28060d;
  --t-critical-soft: #481522;
  --t-space-1: 4px;
  --t-space-2: 8px;
  --t-space-3: 12px;
  --t-space-4: 16px;
  --t-space-5: 20px;
  --t-space-6: 24px;
  --t-space-8: 32px;
  --t-space-12: 48px;
  --t-radius-1: 8px;
  --t-radius-2: 12px;
  --t-radius-3: 16px;
  --t-radius-pill: 999px;
  --t-e0: none;
  --t-e1: 0 1px 3px rgba(0, 0, 0, .22);
  --t-e2: 0 24px 56px rgba(0, 0, 0, .42);
  --t-font: "Poppins", "LINE Seed JP", system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans JP", sans-serif;
  --t-type-page-size: 22px;
  --t-type-section-size: 18px;
  --t-type-card-size: 15px;
  --t-type-body-size: 14px;
  --t-type-secondary-size: 13px;
  --t-type-caption-size: 12px;
  --t-type-kpi-size: 30px;
  --t-type-eyebrow-size: 12px;

  /* Compatibility aliases for existing server-rendered views during migration. */
  --bg: var(--t-bg);
  --card: var(--t-surface);
  --fg: var(--t-ink);
  --muted: var(--t-ink-2);
  --muted-2: var(--t-ink-muted);
  --accent: var(--t-brand);
  --accent-fg: var(--t-brand-ink);
  --primary: var(--t-brand);
  --success: var(--t-ok);
  --warn: var(--t-warn);
  --danger: var(--t-serious);
  --info: var(--t-brand);
  --label-primary: var(--t-ink);
  --label-secondary: var(--t-ink-2);
  --label-tertiary: var(--t-ink-muted);
  --label-quat: var(--t-line);
  --separator: var(--t-line-soft);
  --r-sm: var(--t-radius-1);
  --r-md: var(--t-radius-2);
  --r-lg: var(--t-radius-3);
  --r-xl: var(--t-radius-3);
  --r-pill: var(--t-radius-pill);
  --shadow-card: var(--t-e0);
  --shadow-soft: var(--t-e1);
  --shadow-float: var(--t-e1);
  --shadow-pop: var(--t-e2);
  --hairline: 1px solid var(--t-line);
  --hairline-soft: 1px solid var(--t-line-soft);
  --tile-bg: var(--t-surface-2);
  --tile-bg-soft: var(--t-surface-2);
  --tile-bg-strong: var(--t-surface);
  --header-bg: var(--t-surface);
  --c-bg: var(--t-bg);
  --c-panel: var(--t-surface);
  --c-panel-soft: var(--t-surface-2);
  --c-raised: var(--t-surface);
  --c-text: var(--t-ink);
  --c-text-2: var(--t-ink-2);
  --c-text-3: var(--t-ink-2);
  --c-muted: var(--t-ink-muted);
  --c-faint: var(--t-ink-muted);
  --c-line: var(--t-line);
  --c-line-soft: var(--t-line-soft);
  --c-brand: var(--t-brand);
  --c-brand-2: var(--t-brand);
  --c-green: var(--t-brand);
  --c-amber: var(--t-brand);
  --c-purple: var(--t-brand);
  --c-shadow: var(--t-e1);
}

html[data-customer-theme="light"],
html[data-theme="light"] {
  color-scheme: light;
  --t-bg: #f5f7fa;
  --t-surface: #ffffff;
  --t-surface-2: #f8fafc;
  --t-line: #dbe1e8;
  --t-line-soft: #e8edf2;
  --t-ink: #101720;
  --t-ink-2: #3d4b5c;
  --t-ink-muted: #667488;
  --t-brand: #2f57d0;
  --t-brand-ink: #ffffff;
  --t-brand-soft: #eaf0ff;
  --t-focus: #2f57d0;
  --t-ok: #137a52;
  --t-ok-ink: #ffffff;
  --t-ok-soft: #e4f6ed;
  --t-warn: #8a6200;
  --t-warn-ink: #ffffff;
  --t-warn-soft: #fff2ce;
  --t-serious: #b54731;
  --t-serious-ink: #ffffff;
  --t-serious-soft: #ffebe6;
  --t-critical: #b42345;
  --t-critical-ink: #ffffff;
  --t-critical-soft: #ffe8ee;
  --t-e1: 0 1px 3px rgba(16, 23, 32, .10);
  --t-e2: 0 24px 56px rgba(16, 23, 32, .20);
}
`;

/** Shared, presentation-only components for all server-rendered product views. */
export const baseComponents = `
.t-card { background: var(--t-surface); border: 1px solid var(--t-line); border-radius: var(--t-radius-2); padding: var(--t-space-5); color: var(--t-ink); }
.t-card__eyebrow, .t-section-header__eyebrow { margin: 0 0 var(--t-space-2); color: var(--t-ink-muted); font-size: var(--t-type-eyebrow-size); font-weight: 700; line-height: 1.4; letter-spacing: .08em; text-transform: uppercase; }
.t-card__title { margin: 0 0 var(--t-space-2); color: var(--t-ink); font-size: var(--t-type-card-size); font-weight: 650; line-height: 1.4; }
.t-card__body { color: var(--t-ink-2); font-size: var(--t-type-body-size); font-weight: 400; line-height: 1.7; }
.t-button { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; gap: var(--t-space-2); padding: var(--t-space-2) var(--t-space-4); border: 1px solid transparent; border-radius: var(--t-radius-1); font: 650 var(--t-type-body-size)/1.4 var(--t-font); cursor: pointer; transition: background-color .16s ease, border-color .16s ease, color .16s ease, transform .16s ease; }
.t-button--primary { background: var(--t-brand); color: var(--t-brand-ink); }
.t-button--secondary { background: var(--t-surface); border-color: var(--t-line); color: var(--t-ink); }
.t-button--tertiary { background: transparent; color: var(--t-ink-2); }
.t-button--destructive { background: transparent; border-color: var(--t-serious); color: var(--t-serious); }
.t-button:hover { transform: translateY(-1px); }
.t-button[disabled] { cursor: not-allowed; opacity: .55; transform: none; }
.t-badge { display: inline-flex; align-items: center; gap: var(--t-space-1); min-height: 24px; padding: 2px var(--t-space-2); border-radius: var(--t-radius-pill); background: var(--t-surface-2); color: var(--t-ink-2); font-size: var(--t-type-caption-size); font-weight: 650; line-height: 1.5; }
.t-badge__icon { line-height: 1; }
.t-badge--ok { background: var(--t-ok-soft); color: var(--t-ok); }
.t-badge--warn { background: var(--t-warn-soft); color: var(--t-warn); }
.t-badge--serious { background: var(--t-serious-soft); color: var(--t-serious); }
.t-badge--critical { background: var(--t-critical-soft); color: var(--t-critical); }
.t-kpi { background: var(--t-surface); border: 1px solid var(--t-line); border-radius: var(--t-radius-2); padding: var(--t-space-5); }
.t-kpi__label, .t-kpi__detail { color: var(--t-ink-muted); font-size: var(--t-type-caption-size); font-weight: 500; line-height: 1.5; }
.t-kpi__value { margin: var(--t-space-2) 0; color: var(--t-ink); font-size: var(--t-type-kpi-size); font-weight: 600; line-height: 1.15; font-variant-numeric: tabular-nums; }
.t-empty { display: grid; justify-items: center; gap: var(--t-space-2); padding: var(--t-space-8); border: 1px dashed var(--t-line); border-radius: var(--t-radius-2); background: var(--t-surface-2); color: var(--t-ink-2); text-align: center; }
.t-empty__title { color: var(--t-ink); font-size: var(--t-type-card-size); font-weight: 650; line-height: 1.4; }
.t-empty__description { font-size: var(--t-type-secondary-size); line-height: 1.6; }
.t-section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--t-space-4); margin-bottom: var(--t-space-4); }
.t-section-header__title { margin: 0; color: var(--t-ink); font-size: var(--t-type-section-size); font-weight: 650; line-height: 1.35; }
.t-section-header__description { margin: var(--t-space-1) 0 0; color: var(--t-ink-2); font-size: var(--t-type-secondary-size); line-height: 1.6; }
.t-action-bar { display: flex; align-items: center; justify-content: flex-end; gap: var(--t-space-3); padding: var(--t-space-3) 0; }
.t-action-bar__label { margin-right: auto; color: var(--t-ink-2); font-size: var(--t-type-secondary-size); }
.t-field { display: grid; gap: var(--t-space-2); color: var(--t-ink-2); font-size: var(--t-type-secondary-size); }
.t-input, .t-select, .t-textarea { width: 100%; min-height: 40px; border: 1px solid var(--t-line); border-radius: var(--t-radius-1); background: var(--t-surface); color: var(--t-ink); padding: var(--t-space-2) var(--t-space-3); font: 400 var(--t-type-body-size)/1.7 var(--t-font); }
.t-drawer, .t-modal { background: var(--t-surface); border: 1px solid var(--t-line); border-radius: var(--t-radius-3); box-shadow: var(--t-e2); color: var(--t-ink); }
.customer-shell .chapter { --chapter-accent: var(--t-brand) !important; }
.customer-shell .report-chapter { --report-accent: var(--t-brand) !important; }
.customer-shell .now-card.primary { background: var(--t-brand) !important; color: var(--t-brand-ink); }
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible { outline: 3px solid var(--t-focus); outline-offset: 3px; }
@media (pointer: coarse) { button, input, select, textarea, summary, .t-button, .t-input, .t-select, .nav-item, .theme-toggle, .customer-workspace summary, .customer-workspace button, [role="button"] { min-height: 44px; min-width: 44px; } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; view-transition-name: none !important; }
}
`;
