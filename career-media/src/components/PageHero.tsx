import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { CategoryIcon } from "./CategoryIcon";

/** A shared introduction keeps articles, tools and consultation in the same visual system. */
export function PageHero({ crumbs, eyebrow, title, lead, icon, visual, children, compact = false }: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  icon?: string;
  visual?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`page-intro${compact ? " page-intro-compact" : ""}`}>
      <div className="page-intro-shell">
        <Breadcrumbs items={crumbs} />
        <div className={`page-intro-layout${visual ? " page-intro-with-visual" : ""}`}>
          <div>
            {(eyebrow || icon) && <p className="page-intro-label">{icon && <CategoryIcon name={icon} className="h-4 w-4" />} {eyebrow}</p>}
            <h1>{title}</h1>
            {lead && <p className="page-intro-lead">{lead}</p>}
            {children && <div className="page-intro-actions">{children}</div>}
          </div>
          {visual && <div className="page-intro-visual">{visual}</div>}
        </div>
      </div>
    </section>
  );
}
