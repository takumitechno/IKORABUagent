import { Breadcrumbs } from "./Breadcrumbs";

export function InfoPage({ title, path, eyebrow, lead, children }: { title: string; path: string; eyebrow?: string; lead?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
      <Breadcrumbs items={[{ name: "ホーム", path: "/" }, { name: title, path }]} />
      <article className="mt-6 rounded-[20px] bg-white px-5 py-8 ring-1 ring-line sm:px-10 sm:py-10">
        <header>
          {eyebrow && <p className="text-[11px] font-bold tracking-[0.2em] text-brand">{eyebrow}</p>}
          <h1 className="mt-1 text-[26px] font-bold leading-snug text-ink sm:text-[30px]">{title}</h1>
          {lead && <p className="mt-4 text-[15px] leading-8 text-body">{lead}</p>}
        </header>
        <div className="article-body mt-8">{children}</div>
      </article>
    </div>
  );
}

/** 正式公開前に確認が必要な箇所の表示 */
export function PendingReview({ children }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-accent-soft px-2 py-0.5 text-[12px] font-bold text-accent" style={{ background: "var(--color-accent-soft)" }}>
      {children ?? "確認中（正式公開前に確定予定）"}
    </span>
  );
}
