import { PageHero } from "./PageHero";

export function InfoPage({ title, path, eyebrow, lead, children }: { title: string; path: string; eyebrow?: string; lead?: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero crumbs={[{ name: "ホーム", path: "/" }, { name: title, path }]} eyebrow={eyebrow} title={title} compact />
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <article className="rounded-[20px] bg-white px-5 py-8 ring-1 ring-line sm:px-10 sm:py-10">
          {lead && <p className="text-[15px] leading-8 text-body">{lead}</p>}
          <div className={`article-body ${lead ? "mt-8" : ""}`}>{children}</div>
        </article>
      </div>
    </>
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
