export type DashboardIconName =
  | "activity" | "calendar" | "publish" | "metrics" | "clock"
  | "pipeline" | "chart" | "experiment" | "fact" | "hypothesis"
  | "unknown" | "next" | "moon" | "sun";

export function dashboardIcon(name: DashboardIconName, className = "ui-icon"): string {
  const paths: Record<DashboardIconName, string> = {
    activity: '<path d="M4 12h3l2-5 4 10 2-5h5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4m8-4v4M3 10h18"/>',
    publish: '<path d="M12 19V5m-5 5 5-5 5 5"/><path d="M5 19h14"/>',
    metrics: '<path d="M5 19V9m7 10V5m7 14v-7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pipeline: '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h3a4 4 0 0 0 4-4 2 2 0 0 1 2-2h1M7 12h3a4 4 0 0 1 4 4 2 2 0 0 0 2 2h1"/>',
    chart: '<path d="M4 19V5m0 14h17"/><path d="m7 15 4-4 3 2 5-6"/>',
    experiment: '<path d="M9 3h6m-5 0v5l-5 9a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-9V3"/><path d="M8 15h8"/>',
    fact: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    hypothesis: '<path d="M9 18h6m-5 3h4"/><path d="M8 14a7 7 0 1 1 8 0c-1 .7-1.5 1.5-1.5 2h-5c0-.5-.5-1.3-1.5-2Z"/>',
    unknown: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.5 2.5 0 1 1 4 2c-1 .7-1.8 1.2-1.8 2.5M12 17h.01"/>',
    next: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  };
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

export const customerDashboardStyles = `
html[data-customer-theme="dark"]{color-scheme:dark}
.customer-shell .app{background:radial-gradient(circle at 80% 0,color-mix(in srgb,var(--t-brand) 8%,transparent),transparent 33%),var(--t-bg)}
.customer-shell .sidebar{background:color-mix(in srgb,var(--t-surface) 94%,transparent);border:1px solid var(--t-line);box-shadow:var(--t-e1)}
.customer-shell .sidebar-header .brand,.customer-shell strong,.customer-shell b{color:var(--t-ink)}
.customer-shell .brand-sub{color:var(--t-ink-muted)}
.customer-shell .nav-item:hover{background:var(--t-surface-2);color:var(--t-ink)}
.customer-shell .nav-item.active,html[data-customer-theme="dark"] .customer-shell .nav-item.active{background:var(--t-brand-soft);border-left-color:var(--t-brand);color:var(--t-brand)}
.customer-dashboard{max-width:1480px}
.customer-hero{position:relative;overflow:hidden;align-items:center;padding:22px 24px;margin-bottom:14px;border:1px solid var(--t-line);border-radius:22px;background:linear-gradient(120deg,var(--t-surface) 0%,var(--t-surface) 54%,color-mix(in srgb,var(--t-brand) 10%,var(--t-surface)) 100%);box-shadow:var(--t-e1)}
.customer-hero:after{content:'';position:absolute;width:280px;height:280px;right:-90px;top:-150px;border-radius:50%;border:42px solid color-mix(in srgb,var(--t-brand) 7%,transparent);pointer-events:none}
.hero-main,.hero-actions{position:relative;z-index:1}.hero-main h1{color:var(--t-ink)}.hero-main>p{color:var(--t-ink-2)}.account-line{color:var(--t-ink-muted)}
.hero-actions{display:flex;align-items:stretch;gap:9px}.hero-update{min-width:180px;background:color-mix(in srgb,var(--t-surface) 88%,transparent);border-color:var(--t-line)}.hero-update span,.hero-update small{color:var(--t-ink-muted)}.hero-update b{color:var(--t-ink-2)}
.theme-toggle{display:flex;align-items:center;gap:8px;border:1px solid var(--t-line);border-radius:14px;padding:0 13px;background:var(--t-surface);color:var(--t-ink-2);font:inherit;font-size:12px;font-weight:800;cursor:pointer;box-shadow:0 6px 18px rgba(15,23,42,.05)}.theme-toggle:hover{border-color:color-mix(in srgb,var(--t-brand) 45%,var(--t-line));color:var(--t-brand)}.theme-toggle .theme-sun{display:none}html[data-customer-theme="dark"] .theme-toggle .theme-sun{display:block}html[data-customer-theme="dark"] .theme-toggle .theme-moon{display:none}.ui-icon{width:18px;height:18px;display:block;flex:none}
.now-grid{grid-template-columns:1.25fr repeat(4,1fr);gap:10px}.now-card{position:relative;overflow:hidden;min-height:126px;padding:17px;background:var(--t-surface);border-color:var(--t-line);box-shadow:var(--t-e1)}.now-card.primary{background:linear-gradient(145deg,#111827,#1e3a8a 68%,#3730a3)}.now-card .summary-top{display:flex;justify-content:space-between;align-items:center}.summary-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:11px;background:color-mix(in srgb,var(--t-brand) 10%,var(--t-surface-2));color:var(--t-brand)}.primary .summary-icon{background:rgba(255,255,255,.13);color:#bfdbfe}.now-card .summary-value{font-size:24px;letter-spacing:-.035em;margin:13px 0 3px;line-height:1.08}.now-card .summary-value.textual{font-size:14px;line-height:1.4}.now-card .summary-label{color:var(--t-ink-muted);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.now-card small{color:var(--t-ink-muted)}
.workflow-section{background:var(--t-surface);box-shadow:var(--t-e1);border:1px solid var(--t-line);padding:17px 19px}.workflow-copy span{color:var(--t-ink-muted)}.workflow-copy b{color:var(--t-ink-2)}.journey i{background:var(--t-line)}.journey-step{color:var(--t-ink-muted)}.journey-step span{position:relative;width:30px;height:30px;background:var(--t-surface-2);color:var(--t-ink-muted)}.journey-step span em{position:absolute;right:-6px;top:-7px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;display:grid;place-items:center;background:var(--t-surface);border:1px solid var(--t-line);color:var(--t-ink-2);font-size:12px;font-style:normal;box-shadow:0 3px 8px rgba(15,23,42,.1)}.journey-step.done{color:var(--t-ok)}.journey-step.done span{background:color-mix(in srgb,var(--t-ok) 14%,var(--t-surface));color:var(--t-ok)}.journey-step.active{color:var(--t-brand)}.journey-step.active span{background:color-mix(in srgb,var(--t-brand) 15%,var(--t-surface));color:var(--t-brand);box-shadow:0 0 0 4px color-mix(in srgb,var(--t-brand) 8%,transparent)}
.pipeline-section,.performance-section,.report-section,.manual-sync,.visuals-section{background:var(--t-surface);border:1px solid var(--t-line);box-shadow:var(--t-e1)}.section-header h2{color:var(--t-ink)}.section-lead{color:var(--t-ink-muted)}.card-eyebrow{color:var(--t-ink-muted)}.count-pill{background:var(--t-surface-2);color:var(--t-ink-2)}
.pipeline-head{display:none}.pipeline-list{border:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px}.pipeline-row{display:block;min-width:0!important;padding:15px;border:1px solid var(--t-line);border-radius:15px;background:var(--t-surface);box-shadow:0 5px 18px rgba(15,23,42,.035)}.pipeline-row:hover,.pipeline-row:focus{background:var(--t-surface-2);border-color:color-mix(in srgb,var(--t-brand) 35%,var(--t-line));transform:translateY(-1px)}.pipeline-card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.pipeline-topic .topic-name{font-size:13px;color:var(--t-ink)}.pipeline-topic small,.schedule-cell small{color:var(--t-ink-muted)}.pipeline-card-head .detail-button{flex:none}.pipeline-card-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:13px}.pipeline-meta{padding:9px;border-radius:10px;background:var(--t-surface-2);min-width:0}.pipeline-meta>span{display:block;color:var(--t-ink-muted);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px}.pipeline-meta b{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pipeline-card-metrics{margin-top:11px;padding-top:10px;border-top:1px solid var(--t-line-soft)}.origin-chip{background:color-mix(in srgb,var(--t-brand) 11%,var(--t-surface));color:var(--t-brand)}.detail-button,.measuring{background:var(--t-surface-2);color:var(--t-ink-muted)}
.actual-metric{background:color-mix(in srgb,var(--t-brand) 10%,var(--t-surface));color:var(--t-brand)}.actual-metric b{color:var(--t-brand)}.actual-metric.normalized{background:color-mix(in srgb,var(--t-brand) 10%,var(--t-surface));color:var(--t-brand)}.actual-metric.normalized b{color:var(--t-brand)}.actual-metric.unavailable{background:var(--t-surface-2);color:var(--t-ink-muted)}.actual-metric.unavailable b,.metric-updated{color:var(--t-ink-muted)}
.kpi-grid{grid-template-columns:repeat(6,1fr);gap:9px}.kpi-card{position:relative;overflow:hidden;min-height:125px;background:var(--t-surface);border-color:var(--t-line);padding:14px}.kpi-card>span{color:var(--t-ink-muted)}.kpi-card strong{color:var(--t-ink);font-size:24px}.kpi-card small{color:var(--t-ink-muted)}.kpi-visual{height:28px;margin-top:auto;display:flex;align-items:flex-end}.kpi-visual svg{width:100%;height:28px;overflow:visible}.kpi-visual polyline{fill:none;stroke:var(--t-brand);stroke-width:2;vector-effect:non-scaling-stroke}.kpi-visual circle{fill:var(--t-surface);stroke:var(--t-brand);stroke-width:1.5;vector-effect:non-scaling-stroke}.kpi-measured{width:100%;height:4px;border-radius:4px;background:var(--t-surface-2);overflow:hidden}.kpi-measured i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,var(--t-brand),var(--t-brand))}
.visuals-section{padding:22px}.chart-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,.7fr);gap:12px;margin-top:17px}.chart-card{border:1px solid var(--t-line);border-radius:15px;padding:16px;background:var(--t-surface)}.chart-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.chart-title>div{display:flex;align-items:center;gap:9px}.chart-title .summary-icon{width:30px;height:30px}.chart-title b{font-size:12px}.chart-title small{font-size:12px;color:var(--t-ink-muted)}.bar-chart{display:grid;gap:10px}.bar-row{display:grid;grid-template-columns:minmax(90px,150px) 1fr auto;gap:10px;align-items:center}.bar-label{font-size:12px;color:var(--t-ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bar-track{height:10px;border-radius:999px;background:var(--t-surface-2);overflow:hidden}.bar-fill{display:block;height:100%;min-width:4px;border-radius:999px;background:linear-gradient(90deg,var(--t-brand),var(--t-brand))}.bar-value{font-size:12px;color:var(--t-ink-muted);font-variant-numeric:tabular-nums}.donut-layout{display:flex;align-items:center;justify-content:center;gap:18px;min-height:150px}.donut{width:116px;height:116px;border-radius:50%;position:relative;display:grid;place-items:center;flex:none}.donut:after{content:'';position:absolute;inset:16px;border-radius:50%;background:var(--t-surface)}.donut-center{position:relative;z-index:1;text-align:center}.donut-center b{display:block;font-size:24px}.donut-center span{font-size:12px;color:var(--t-ink-muted)}.donut-legend{display:grid;gap:7px}.donut-legend span{font-size:12px;color:var(--t-ink-muted);display:flex;align-items:center;gap:6px}.donut-legend i{width:8px;height:8px;border-radius:50%;flex:none}.empty-visual{min-height:150px;display:grid;place-items:center;text-align:center;color:var(--t-ink-muted);background:var(--t-surface-2);border:1px dashed var(--t-line);border-radius:12px;padding:18px}.empty-visual .ui-icon{width:28px;height:28px;margin:0 auto 8px;color:var(--t-ink-muted)}.empty-visual b{font-size:12px}.empty-visual p{font-size:12px;margin-top:4px;color:var(--t-ink-muted)}
.performance-list>article{background:var(--t-surface);border-color:var(--t-line)}.performance-list h3{color:var(--t-ink)}.performance-list small{color:var(--t-ink-muted)}.performance-list details{border-color:var(--t-line-soft)}.performance-list summary{color:var(--t-ink-muted)}.performance-list details p{color:var(--t-ink-2)}
.report-section{background:linear-gradient(145deg,var(--t-surface),color-mix(in srgb,var(--t-brand) 5%,var(--t-surface)))}.decision-grid{grid-template-columns:repeat(3,1fr)}.decision-grid article{position:relative;display:block;background:var(--t-surface);border:1px solid var(--t-line);padding:16px}.decision-grid article>span{display:grid;width:30px;height:30px;place-items:center;border-radius:10px;background:color-mix(in srgb,var(--t-brand) 11%,var(--t-surface));color:var(--t-brand);margin-bottom:13px}.decision-grid b{font-size:12px;color:var(--t-ink)}.decision-grid p{color:var(--t-ink-muted)}.analysis-grid{grid-template-columns:repeat(4,1fr)}.analysis-box{position:relative;background:var(--t-surface);border-color:var(--t-line);border-top:0!important;padding:15px}.analysis-box .analysis-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:10px;margin-bottom:12px}.analysis-box h3{color:var(--t-ink);font-size:12px}.analysis-box p{color:var(--t-ink-muted)}.analysis-box.fact .analysis-icon,.analysis-box.hypothesis .analysis-icon,.analysis-box.unknown .analysis-icon,.analysis-box.next-test .analysis-icon{background:color-mix(in srgb,var(--t-brand) 12%,var(--t-surface));color:var(--t-brand)}
.manual-sync li,.empty-inline,.empty-state{background:var(--t-surface-2);border-color:var(--t-line)}.manual-copy>b,.empty-state b{color:var(--t-ink-2)}.manual-copy small,.empty-state p,.empty-inline{color:var(--t-ink-muted)}
.post-drawer{background:var(--t-surface);color:var(--t-ink)}.drawer-close,.drawer-block,.drawer-grid>div{background:var(--t-surface-2)}.post-drawer>h2{color:var(--t-ink)}.drawer-block p,.drawer-grid p{color:var(--t-ink-2)}.drawer-block>span,.drawer-grid span{color:var(--t-ink-muted)}
@media(max-width:1320px){.now-grid{grid-template-columns:repeat(3,1fr)}.now-card.primary{grid-column:span 2}.kpi-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:1000px){.pipeline-list{grid-template-columns:1fr}.chart-grid{grid-template-columns:1fr}.analysis-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){.hero-actions{width:100%}.hero-update{flex:1}.decision-grid{grid-template-columns:1fr}.now-grid{grid-template-columns:1fr 1fr}.now-card.primary{grid-column:span 2}}
@media(max-width:700px){.customer-shell .sidebar:has(.office-back-button){flex-wrap:wrap}.customer-shell .sidebar:has(.office-back-button) .office-back-button{flex:none;margin:0;padding:8px 10px;gap:7px;font-size:12px}}
@media(max-width:640px){.customer-hero{padding:18px;border-radius:18px}.hero-actions{align-items:stretch}.theme-toggle{width:44px;padding:0;justify-content:center}.theme-toggle span{display:none}.now-grid{grid-template-columns:1fr 1fr}.now-card.primary{grid-column:span 2}.now-card{min-height:116px;padding:14px}.now-card .summary-value{font-size:21px}.pipeline-card-meta{grid-template-columns:1fr 1fr}.pipeline-meta:last-child{grid-column:span 2}.kpi-grid{grid-template-columns:1fr 1fr}.chart-grid{grid-template-columns:1fr}.bar-row{grid-template-columns:85px 1fr auto}.donut-layout{gap:12px}.analysis-grid{grid-template-columns:1fr 1fr}.visuals-section{padding:17px}}
@media(max-width:420px){.hero-actions{flex-direction:column}.theme-toggle{width:100%;height:42px}.theme-toggle span{display:inline}.analysis-grid{grid-template-columns:1fr}.pipeline-card-meta{grid-template-columns:1fr}.pipeline-meta:last-child{grid-column:auto}}
@media(prefers-reduced-motion:reduce){.customer-shell *{scroll-behavior:auto!important;transition:none!important}}

/* UX06: customer readability and visual-first hierarchy */
.customer-shell{font-size:15px;line-height:1.55}.customer-shell .main{padding-top:28px;padding-bottom:64px}.customer-dashboard{max-width:1380px}
.customer-hero{padding:30px 32px;margin-bottom:24px}.hero-main h1{font-size:36px;line-height:1.2}.hero-main>p{font-size:16px;line-height:1.6}.account-line{font-size:14px}.status-badge{padding:8px 13px;font-size:13px}.hero-update{min-width:230px;padding:17px 19px}.hero-update span,.hero-update small{font-size:13px}.hero-update b{font-size:15px}.theme-toggle{min-width:106px;padding:0 16px;font-size:13px}.ui-icon{width:22px;height:22px}
.now-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:24px}.now-card{min-height:178px;padding:24px;border-radius:20px}.now-card.primary{grid-column:span 2}.summary-icon{width:48px;height:48px;border-radius:15px}.summary-icon .ui-icon{width:25px;height:25px}.now-card .summary-label{font-size:13px}.now-card .summary-value{font-size:36px;margin:22px 0 8px}.now-card .summary-value.textual{font-size:20px;line-height:1.5}.now-card small{font-size:14px;line-height:1.5}
.workflow-section{display:block;padding:28px 30px;margin-bottom:24px;border-radius:20px}.workflow-copy{width:auto;margin-bottom:24px}.workflow-copy span{font-size:13px}.workflow-copy b{font-size:18px;margin-top:5px}.journey{gap:12px}.journey-step{gap:9px;font-size:14px}.journey-step span{width:42px;height:42px;font-size:14px}.journey-step span em{min-width:20px;height:20px;font-size:12px}.journey i{height:2px}
.section{margin-bottom:24px}.customer-dashboard .page-kicker{font-size:13px}.pipeline-section,.performance-section,.report-section,.manual-sync,.visuals-section{padding:32px;border-radius:20px}.section-header{gap:24px}.section-header h2{font-size:24px;line-height:1.35}.section-lead{font-size:14px;line-height:1.6;margin-top:8px}.card-eyebrow{font-size:13px;margin-bottom:8px}.count-pill,.hypothesis-pill{padding:8px 13px;font-size:13px}
.pipeline-list{grid-template-columns:1fr;gap:14px;margin-top:24px}.pipeline-row{padding:22px;border-radius:17px}.pipeline-topic .topic-name{font-size:18px;line-height:1.45;white-space:normal}.pipeline-topic small,.schedule-cell small{font-size:13px}.detail-button{width:40px;height:40px}.pipeline-card-meta{gap:12px;margin-top:18px}.pipeline-meta{padding:14px}.pipeline-meta>span{font-size:13px;margin-bottom:8px}.pipeline-meta b{font-size:14px}.customer-dashboard .badge,.origin-chip,.measuring{padding:6px 10px;font-size:13px}.actual-metrics{gap:8px}.actual-metric{padding:8px 10px;font-size:14px}.actual-metric b{font-size:13px}.metric-updated{font-size:13px;margin-top:6px}
.manual-sync ul{gap:12px;margin-top:22px}.manual-sync li{gap:12px;padding:18px}.manual-copy>b{font-size:15px}.manual-copy small,.manual-copy summary,.manual-copy details p{font-size:13px}.manual-state{padding:7px 10px;font-size:12px}.empty-inline{padding:20px;font-size:14px}
.kpi-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:24px}.kpi-card{min-height:190px;padding:22px;border-radius:17px}.kpi-card>span{font-size:14px}.kpi-card strong{font-size:34px;margin:10px 0 5px}.kpi-card small{font-size:13px}.kpi-visual{height:46px;margin-top:20px}.kpi-visual svg{height:46px}.performance-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}.performance-list>article{padding:20px;border-radius:16px}.performance-list h3{font-size:17px;line-height:1.45}.performance-list small,.performance-list summary{font-size:13px}.performance-list details p{font-size:14px;line-height:1.75}
.chart-grid{grid-template-columns:minmax(0,1.45fr) minmax(360px,.8fr);gap:18px;margin-top:24px}.chart-card{padding:24px;border-radius:18px;min-height:330px}.chart-title{margin-bottom:24px}.chart-title .summary-icon{width:44px;height:44px}.chart-title b{font-size:17px}.chart-title small{font-size:13px}.bar-chart{gap:18px}.bar-row{grid-template-columns:minmax(130px,190px) 1fr 70px;gap:14px}.bar-label,.bar-value{font-size:14px}.bar-track{height:18px}.donut-layout{min-height:240px;gap:30px}.donut{width:180px;height:180px}.donut:after{inset:25px}.donut-center b{font-size:36px}.donut-center span{font-size:13px}.donut-legend{gap:12px}.donut-legend span{font-size:14px}.donut-legend i{width:11px;height:11px}.empty-visual{min-height:240px;padding:28px}.empty-visual .ui-icon{width:44px;height:44px}.empty-visual b{font-size:18px}.empty-visual p{font-size:14px;line-height:1.6}
.decision-grid{gap:16px;margin-top:24px}.decision-grid article{padding:22px}.decision-grid article>span{width:44px;height:44px}.decision-grid b{font-size:17px}.decision-grid p{font-size:14px;line-height:1.65}.analysis-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}.analysis-box{padding:22px}.analysis-box .analysis-icon{width:44px;height:44px}.analysis-box h3{font-size:17px}.analysis-box p{font-size:14px;line-height:1.65}.report-cta{margin-top:18px;padding:18px 20px;font-size:15px}.report-cta span{font-size:24px}
.empty-state{padding:48px 24px}.empty-state b{font-size:18px}.empty-state p{font-size:14px;line-height:1.6}.drawer-tags span,.drawer-block>span,.drawer-grid span{font-size:13px}.drawer-block p,.drawer-grid p{font-size:14px}
@media(max-width:1100px){.now-grid,.kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.now-card.primary{grid-column:span 2}.chart-grid{grid-template-columns:1fr}.performance-list{grid-template-columns:1fr}}
@media(max-width:700px){.customer-shell .main{padding-top:12px}.customer-hero{padding:20px}.hero-main h1{font-size:28px}.now-grid{gap:12px}.now-card{min-height:145px;padding:18px}.now-card .summary-value{font-size:30px}.now-card .summary-value.textual{font-size:17px}.workflow-section,.pipeline-section,.performance-section,.report-section,.manual-sync,.visuals-section{padding:20px}.journey{overflow-x:auto;padding:6px 2px 12px;scrollbar-width:none}.journey::-webkit-scrollbar{display:none}.journey-step{flex-direction:column;min-width:58px;font-size:13px}.journey-step b,.journey-step span em{font-size:13px}.kpi-grid{grid-template-columns:1fr}.chart-card{min-height:280px;padding:18px}.bar-row{grid-template-columns:95px 1fr 58px}.bar-label,.bar-value{font-size:13px}.donut{width:150px;height:150px}.donut-layout{min-height:210px}.pipeline-card-meta{grid-template-columns:1fr 1fr}.pipeline-meta:last-child{grid-column:span 2}}
@media(max-width:430px){.now-grid{grid-template-columns:1fr}.now-card.primary{grid-column:auto}.hero-actions{width:100%}.hero-update{min-width:0}.analysis-grid{grid-template-columns:1fr}.donut-layout{flex-direction:column}.pipeline-card-meta{grid-template-columns:1fr}.pipeline-meta:last-child{grid-column:auto}}

/* UX07: spacious global type scale and readable customer navigation */
.customer-shell{font-size:16px;line-height:1.6}.customer-shell .sidebar{padding:22px 18px}.customer-shell .sidebar-header .brand{font-size:17px;line-height:1.45}.customer-shell .sidebar-header .brand-sub{font-size:13px;line-height:1.5}.customer-shell .sidebar-nav{margin-top:18px}.customer-shell .nav-section{gap:7px}.customer-shell .nav-item{min-height:50px;padding:13px 14px;gap:12px;border-radius:13px;font-size:15px;line-height:1.5}.customer-shell .nav-icon-chip{width:24px;height:24px}.customer-shell .nav-icon-chip svg{width:20px;height:20px}.customer-shell .office-back-button{margin:18px 0 6px;padding:14px 15px;font-size:15px}.customer-shell .office-back-button .office-icon{font-size:18px;line-height:1}
.hero-main h1{font-size:40px}.hero-main>p{font-size:17px}.status-badge{font-size:14px}.section-header h2{font-size:27px}.section-lead{font-size:15px}.now-card .summary-label{font-size:14px}.now-card .summary-value{font-size:38px}.now-card .summary-value.textual{font-size:22px}.now-card small{font-size:14px}
.pipeline-list{gap:20px}.pipeline-row{padding:28px}.pipeline-topic .topic-name{font-size:20px}.pipeline-topic small{margin-top:5px;font-size:15px}.pipeline-card-meta{gap:15px;margin-top:22px}.pipeline-meta{padding:17px}.pipeline-meta>span{font-size:14px}.pipeline-meta b,.schedule-cell b{font-size:16px;line-height:1.5}.customer-dashboard .badge,.origin-chip,.measuring{padding:8px 12px;font-size:14px;line-height:1.45}.pipeline-card-metrics{margin-top:16px;padding-top:15px}.actual-metrics{gap:10px}.actual-metric{min-width:88px;padding:10px 13px;font-size:18px;line-height:1.35}.actual-metric b{font-size:13px;margin-bottom:3px}.actual-metric.metric-views,.actual-metric.metric-views-hour,.actual-metric.metric-reaction-rate{min-width:108px;padding:12px 15px;font-size:21px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--t-brand) 18%,transparent)}.metric-updated{font-size:14px;margin-top:8px}
.kpi-card>span{font-size:14px}.kpi-card strong{font-size:36px}.kpi-card small{font-size:14px}.performance-list{gap:20px}.performance-list>article{padding:24px}.performance-list h3{font-size:19px}.performance-list small,.performance-list summary{font-size:14px}.decision-grid b,.analysis-box h3,.chart-title b{font-size:18px}.decision-grid p,.analysis-box p,.chart-title small,.bar-label,.bar-value,.donut-legend span{font-size:14px}.drawer-tags span,.drawer-block>span,.drawer-grid span,.drawer-block p,.drawer-grid p{font-size:14px}
@media(max-width:700px){.customer-shell .sidebar{padding:14px 16px}.customer-shell .sidebar-header .brand{font-size:15px}.customer-shell .sidebar:has(.office-back-button){gap:10px}.customer-shell .sidebar:has(.office-back-button) .office-back-button{min-height:44px;margin:0;padding:10px 12px;font-size:14px}.hero-main h1{font-size:32px}.section-header h2{font-size:25px}.pipeline-row{padding:22px}.actual-metric{min-width:82px;font-size:17px}.actual-metric.metric-views,.actual-metric.metric-views-hour,.actual-metric.metric-reaction-rate{min-width:102px;font-size:19px}}
@media(max-width:700px){.customer-shell{overflow-x:clip}.customer-shell .app{display:block;padding:10px}.customer-shell .sidebar{position:static;width:100%;height:auto;display:flex;flex-direction:column;align-items:stretch}.customer-shell .sidebar-nav{display:flex;width:100%;margin-top:10px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;scroll-padding-inline:8px}.customer-shell .sidebar-nav::-webkit-scrollbar{display:none}.customer-shell .sidebar-nav .nav-section{width:max-content;min-width:100%;flex-direction:row;gap:6px}.customer-shell .sidebar-nav .nav-section-label{display:none}.customer-shell .sidebar-nav .nav-item{min-height:44px;flex:0 0 auto;white-space:nowrap;border-left:0;border-bottom:3px solid transparent}.customer-shell .sidebar-nav .nav-item.active{border-bottom-color:var(--t-brand)}.customer-shell .office-back-button{width:100%}}
`;


/* Stage B home only. The shared improvement-report stylesheet above is unchanged. */
export const customerHomeStyles = `
.customer-shell:has(.customer-home){background:var(--t-bg);color:var(--t-ink);font:400 14px/1.6 var(--t-font)}
.customer-shell:has(.customer-home) .app{background:var(--t-bg)}
.customer-shell:has(.customer-home) .main{min-width:0;padding:24px}
.customer-shell:has(.customer-home) .sidebar{background:var(--t-surface);border-color:var(--t-line)}
.customer-shell:has(.customer-home) .nav-item{min-height:44px}
.customer-shell:has(.customer-home) :is(.nav-item,.nav-label,.nav-icon-chip){color:var(--t-ink-2)}
.customer-shell:has(.customer-home) .nav-item:hover{background:var(--t-surface-2);color:var(--t-ink)}
.customer-shell:has(.customer-home) .nav-item.active{background:var(--t-brand-soft);border-left-color:var(--t-brand);color:var(--t-brand)}
.customer-shell:has(.customer-home) .nav-item.active :is(.nav-label,.nav-icon-chip){color:var(--t-brand)}
.customer-shell:has(.customer-home) .brand-sub{color:var(--t-ink-2)}
.customer-home{max-width:1240px;margin:0 auto;color:var(--t-ink)}
.customer-shell:has(.customer-home) .brand,.customer-home strong,.customer-home b,.home-drawer strong,.home-drawer b{color:var(--t-ink)}
.customer-home *,.home-drawer *{box-sizing:border-box;min-width:0}
.customer-home p{margin:8px 0}
.customer-home .today-context .home-account-name{font-size:22px;line-height:1.4;font-weight:650;margin:0;color:var(--t-ink)}
.customer-home h3,.home-drawer h3{font-size:15px;line-height:1.5;margin:0 0 8px;color:var(--t-ink)}
.customer-home .home-section{position:relative;margin:0 0 20px;padding:20px;border:1px solid var(--t-line);border-radius:var(--t-radius-3);background:var(--t-surface);scroll-margin-top:16px}
.customer-home .t-section-header{margin-bottom:12px}
.customer-home .t-section-header__title{font-size:18px;letter-spacing:normal;text-transform:none}
.customer-home .t-section-header__eyebrow{color:var(--t-brand)}
.customer-home .home-muted,.home-drawer .home-muted{color:var(--t-ink-muted);font-size:12px}
.customer-home :is(button,summary,input,textarea),.home-drawer button{min-height:44px;min-width:44px;font-size:14px}
.customer-home summary{cursor:pointer;padding:10px 4px;color:var(--t-ink-2)}
.customer-home :is(button,summary,a,input,textarea):focus-visible,.home-drawer button:focus-visible{outline:3px solid var(--t-focus);outline-offset:3px}
.customer-home :is(p,h1,h2,h3,small,strong,b,span,label),.home-drawer :is(p,h2,h3,span){overflow-wrap:anywhere}
.customer-home a{color:var(--t-brand)}
.customer-home .ui-icon{width:20px;height:20px;flex:none}
.customer-home .action-required.is-expanded{border:2px solid var(--t-brand);background:var(--t-brand-soft)}
.customer-home .action-required.is-compact{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 16px}
.customer-home .is-compact .t-section-header{margin:0}
.customer-home .is-compact .t-section-header__title{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.customer-home .is-compact .t-section-header__eyebrow{margin:0}
.customer-home .success-strip{margin:0}
.customer-home .review-notice{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.customer-home .review-notice a{display:inline-flex;align-items:center;min-height:44px}
.customer-home .review-list{display:grid;gap:12px;max-height:360px;overflow-y:auto;scrollbar-gutter:stable;padding:4px}
.customer-home .review-list:focus-visible{outline:3px solid var(--t-focus);outline-offset:3px}
.customer-home .review-card{padding:16px;border:1px solid var(--t-line);border-radius:var(--t-radius-2);background:var(--t-surface)}
.customer-home .review-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--t-ink-2)}
.customer-home .review-body{font-size:15px;line-height:1.7;white-space:pre-wrap;color:var(--t-ink);margin:12px 0}
.customer-home .review-detail-grid{display:grid;grid-template-columns:1fr 2fr;gap:16px;background:var(--t-surface-2);border-radius:var(--t-radius-1);padding:12px}
.customer-home .review-detail small{display:block;font-size:12px;color:var(--t-ink-muted)}
.customer-home .review-detail ul{padding-left:18px;margin:4px 0}
.customer-home .review-actions{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:16px;align-items:start;padding:12px 0 0}
.customer-home .review-actions form{margin:0}
.customer-home .review-actions>details>summary{border:1px solid var(--t-line);border-radius:var(--t-radius-1);padding:10px 12px;background:var(--t-surface)}
.customer-home .review-actions .review-reject>summary{border-color:transparent;background:transparent;color:var(--t-ink-muted)}
.customer-home .review-actions details form{display:grid;gap:8px;padding:12px 0}
.customer-home .review-actions label{display:grid;gap:8px;color:var(--t-ink-2)}
.customer-home textarea{width:100%;min-height:100px;resize:vertical;padding:12px;border:1px solid var(--t-line);border-radius:var(--t-radius-1);background:var(--t-surface-2);color:var(--t-ink);font-family:var(--t-font)}
.customer-home .review-readonly{color:var(--t-ink-muted)}
.customer-home .today-context{display:flex;justify-content:space-between;gap:12px;align-items:start;margin-bottom:12px}
.customer-home .today-context p{font-size:12px;margin:4px 0}
.customer-home .theme-toggle{display:inline-flex;align-items:center;gap:8px;flex:none}
.customer-home .home-today-grid,.customer-home .home-kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.customer-home .t-kpi{padding:16px;height:100%;background:var(--t-surface-2)}
.customer-home .t-kpi__value{font-size:30px;font-variant-numeric:tabular-nums;line-height:1.2}
.customer-home .home-today-grid .t-kpi{min-height:125px}
.customer-home :is(.today-next,.today-sync) .t-kpi__value{font-size:15px;line-height:1.5}
.customer-home .home-kpi-item{position:relative;min-height:160px}
.customer-home .home-kpi-item .t-kpi{padding-bottom:48px}
.customer-home .kpi-visual{position:absolute;bottom:14px;left:16px;right:16px;height:24px}
.customer-home .kpi-visual svg{width:100%;height:24px;overflow:visible}
.customer-home .kpi-visual polyline{fill:none;stroke:var(--t-brand);stroke-width:2;vector-effect:non-scaling-stroke}
.customer-home .kpi-visual circle{fill:var(--t-surface);stroke:var(--t-brand);stroke-width:1.5}
.customer-home .kpi-measured{height:4px;background:var(--t-line);margin-top:12px;border-radius:var(--t-radius-pill)}
.customer-home .kpi-measured i{display:block;height:4px;background:var(--t-brand);border-radius:inherit}
.customer-home .getting-started{margin-top:12px}
.customer-home .getting-started-grid,.customer-home .schedule-groups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.customer-home .schedule-groups article{display:grid;gap:4px;padding:16px;background:var(--t-surface-2);border-radius:var(--t-radius-2)}
.customer-home .schedule-groups span,.customer-home .schedule-groups small{font-size:12px;color:var(--t-ink-2)}
.customer-home .schedule-groups strong{font-size:30px;font-variant-numeric:tabular-nums}
.customer-home .home-chart-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:12px;margin:20px 0}
.customer-home .chart-card{padding:16px;border:1px solid var(--t-line);border-radius:var(--t-radius-2);background:var(--t-surface)}
.customer-home .bar-chart{display:grid;gap:12px}
.customer-home .bar-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:8px;align-items:center}
.customer-home .bar-label,.customer-home .bar-value{font-size:12px;color:var(--t-ink-2)}
.customer-home .bar-track{height:10px;border-radius:var(--t-radius-pill);background:var(--t-line)}
.customer-home .bar-fill{display:block;height:100%;border-radius:inherit;background:var(--t-brand)}
.customer-home .donut-layout{display:flex;align-items:center;justify-content:center;gap:20px;min-height:155px}
.customer-home .donut{position:relative;width:120px;height:120px;flex:none;display:grid;place-items:center;border-radius:50%}
.customer-home .donut:after{content:"";position:absolute;inset:18px;background:var(--t-surface);border-radius:50%}
.customer-home .donut-center{position:relative;z-index:1;text-align:center}
.customer-home .donut-center b{display:block;font-size:30px;font-variant-numeric:tabular-nums}
.customer-home .donut-center span{font-size:12px}
.customer-home .donut-legend{display:grid;gap:8px}
.customer-home .donut-legend span{display:flex;align-items:center;gap:8px;font-size:12px}
.customer-home .donut-legend i{width:10px;height:10px;border-radius:50%;flex:none}
.customer-home .empty-visual{padding:20px;text-align:center;color:var(--t-ink-muted)}
.customer-home .post-list{display:grid;gap:12px}
.customer-home .post-card{padding:16px;border:1px solid var(--t-line);border-radius:var(--t-radius-2);background:var(--t-surface-2)}
.customer-home .post-card-heading{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.customer-home .post-card-heading h3{flex:1 1 200px;margin:0}
.customer-home .origin-chip{font-size:12px;border:1px solid var(--t-line);border-radius:var(--t-radius-pill);padding:3px 8px;color:var(--t-ink-2)}
.customer-home .post-row{margin-top:12px}
.customer-home .actual-metrics{display:flex;gap:8px;flex-wrap:wrap}
.customer-home .actual-metric{display:grid;gap:2px;font-size:15px;font-variant-numeric:tabular-nums;padding:6px 10px;border:1px solid var(--t-line);border-radius:var(--t-radius-1);color:var(--t-ink)}
.customer-home .actual-metric b{font-size:12px;color:var(--t-ink-2)}
.customer-home .actual-metric.unavailable,.customer-home .measuring{color:var(--t-ink-muted);font-size:12px}
.customer-home .metric-updated{flex-basis:100%;font-size:12px;color:var(--t-ink-muted)}
.customer-home .decision-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.customer-home .decision-grid article,.customer-home .analysis-box{padding:16px;border-radius:var(--t-radius-2);background:var(--t-surface-2)}
.customer-home .decision-grid article>span,.customer-home .analysis-icon{display:block;color:var(--t-brand);margin-bottom:8px}
.customer-home .decision-grid p,.customer-home .analysis-box p{font-size:14px;color:var(--t-ink-2)}
.customer-home .analysis-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.customer-home .evidence-details{margin-top:12px}
.customer-home .report-cta{display:flex;align-items:center;justify-content:space-between;min-height:44px;margin-top:12px;padding:12px;background:var(--t-brand-soft);border-radius:var(--t-radius-1)}
.customer-home .manual-sync ul{list-style:none;display:grid;gap:12px;padding:0;margin:16px 0 0}
.customer-home .manual-sync li{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:16px;border:1px solid var(--t-line);border-radius:var(--t-radius-2)}
.customer-home .manual-copy{flex:1 1 240px}
.customer-home .manual-copy>b{display:block;font-size:14px;white-space:normal}
.customer-home .manual-copy small,.customer-home .manual-state,.customer-home .manual-readonly{font-size:12px;color:var(--t-ink-muted)}
.customer-home .manual-sync form{margin:0}
.customer-home .t-empty{margin-top:12px}
.home-sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.home-backdrop{position:fixed;inset:0;z-index:60;background:color-mix(in srgb,var(--t-bg) 65%,transparent)}
.home-backdrop[hidden]{display:none}
.home-drawer{position:fixed;inset:0 0 0 auto;width:min(500px,100%);max-height:100dvh;overflow:auto;z-index:61;visibility:hidden;padding:24px;background:var(--t-surface);color:var(--t-ink);box-shadow:var(--t-e2);font:400 14px/1.7 var(--t-font)}
.home-drawer.open{visibility:visible}
.home-drawer .drawer-close{float:right}
.home-drawer h2{font-size:22px;line-height:1.5;color:var(--t-ink);clear:both}
.home-drawer .drawer-tags{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;color:var(--t-ink-2)}
.home-drawer .drawer-block,.home-drawer .drawer-grid>div{padding:16px;background:var(--t-surface-2);border-radius:var(--t-radius-2)}
.home-drawer .drawer-block p{white-space:pre-wrap}
.home-drawer .drawer-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}
@media(max-width:1100px){.customer-home .home-today-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.customer-home .home-kpi-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.customer-home .home-chart-grid{grid-template-columns:1fr}}
@media(max-width:700px){
.customer-shell:has(.customer-home) .app{display:block;padding:10px}
.customer-shell:has(.customer-home) .sidebar{position:static;width:100%;height:auto;padding:12px;margin-bottom:12px;border-radius:var(--t-radius-2);display:flex;flex-direction:column;align-items:stretch}
.customer-shell:has(.customer-home) .sidebar-header .brand{font-size:15px}
.customer-shell:has(.customer-home) .sidebar-nav{display:flex;width:100%;margin-top:10px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;scroll-padding-inline:8px}
.customer-shell:has(.customer-home) .sidebar-nav::-webkit-scrollbar{display:none}
.customer-shell:has(.customer-home) .sidebar-nav .nav-section{width:max-content;min-width:100%;flex-direction:row;gap:6px}
.customer-shell:has(.customer-home) .sidebar-nav .nav-section-label{display:none}
.customer-shell:has(.customer-home) .sidebar-nav .nav-item{min-height:44px;flex:0 0 auto;white-space:nowrap;border-left:0;border-bottom:3px solid transparent}
.customer-shell:has(.customer-home) .sidebar-nav .nav-item.active{border-bottom-color:var(--t-brand)}
.customer-shell:has(.customer-home) .office-back-button{width:100%}
.customer-shell:has(.customer-home) .main{padding:0 0 24px}
.customer-home .home-section{padding:14px;margin-bottom:14px}
.customer-home .home-today-grid,.customer-home .home-kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.customer-home .t-kpi{padding:12px}
.customer-home .t-kpi__value{font-size:30px}
.customer-home .home-today-grid .t-kpi{min-height:115px}
.customer-home .today-context .home-account-name{font-size:18px}
.customer-home .theme-toggle{padding:8px}
.customer-home .theme-toggle .ui-icon{display:none}
.customer-home .schedule-groups,.customer-home .getting-started-grid,.customer-home .decision-grid,.customer-home .review-detail-grid{grid-template-columns:1fr}
.customer-home .review-card{padding:12px}
.customer-home .review-list{max-height:300px}
.customer-home .review-actions{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
.customer-home .review-actions>.review-approve{grid-column:2}
.customer-home .review-actions>details[open]{grid-column:1 / -1}
.customer-home .review-actions .t-button{width:100%}
.customer-home .analysis-grid{grid-template-columns:1fr}
.customer-home .manual-copy{flex-basis:100%}
.home-drawer{padding:20px}
}
html[data-customer-theme="dark"] .customer-home{color-scheme:dark}
@media(prefers-reduced-motion:reduce){.customer-home *,.home-drawer *{scroll-behavior:auto!important;transition:none!important}}
`;

/** Home owns its CSS; callers do not embed or duplicate page style blocks. */
export function renderCustomerHomeStyles(): string {
  return `<style>${customerHomeStyles}</style>`;
}

export const customerThemeScript = `
const themeButton=document.getElementById('theme-toggle');
const themeLabel=document.getElementById('theme-label');
const themeMedia=window.matchMedia('(prefers-color-scheme: dark)');
function storedTheme(){try{const value=localStorage.getItem('takumi-customer-theme');return value==='light'||value==='dark'?value:null}catch(_){return null}}
function activeTheme(){return document.documentElement.dataset.customerTheme||(themeMedia.matches?'dark':'light')}
function applyTheme(theme,persist){document.documentElement.dataset.customerTheme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#0b0f14':'#f5f7fa');if(persist){try{localStorage.setItem('takumi-customer-theme',theme)}catch(_){}}if(themeLabel)themeLabel.textContent=theme==='dark'?'ライト':'ダーク';if(themeButton)themeButton.setAttribute('aria-label',theme==='dark'?'ライトモードに切り替える':'ダークモードに切り替える')}
applyTheme(storedTheme()||(themeMedia.matches?'dark':'light'),false);
themeButton?.addEventListener('click',()=>applyTheme(activeTheme()==='dark'?'light':'dark',true));
themeMedia.addEventListener?.('change',event=>{if(!storedTheme())applyTheme(event.matches?'dark':'light',false)});
`;
