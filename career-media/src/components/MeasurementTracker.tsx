"use client";

import { useEffect } from "react";
import { getSession, track } from "@/lib/measurement/client";
import type { EventContext, PageType } from "@/lib/measurement/schema";

const pageTypeOf = (path: string): PageType => {
  if (path === "/") return "home";
  if (path.startsWith("/articles/")) return "article";
  if (path === "/articles") return "list";
  if (path.startsWith("/news/")) return "news";
  if (path === "/news") return "list";
  if (/^\/(concerns|situations|categories)\//.test(path) || /^\/jobs\/./.test(path)) return "hub";
  if (path === "/jobs") return "jobs";
  if (path === "/check") return "check";
  if (path.startsWith("/consultation")) return "consultation";
  if (/^\/(about|editorial-policy|disclosure|privacy|disclaimer)/.test(path)) return "info";
  return "other";
};

/**
 * 全ページ共通: セッションの流入元を決め、data-cta-kind を持つリンクのクリックを cta_clicked として記録する。
 * 外部（提携先の申込ページ）へのリンクは、本番送客が有効なときだけ存在し、そのときだけ partner_outbound を記録する。
 */
export function MeasurementTracker({ mode }: { mode: "demo" | "live" }) {
  useEffect(() => {
    window.__careerMediaMode = mode;
    getSession();
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // 記事検索の結果（検索語そのものは記録しない。何番目の結果を押したかだけ）
      const result = target?.closest?.("[data-search-results] a[href]") as HTMLAnchorElement | null;
      if (result) {
        const items = [...(result.closest("[data-search-results]")?.querySelectorAll("li") ?? [])];
        const li = result.closest("li");
        track("site_search_result_clicked", { page_type: "search", target_path: result.getAttribute("href") ?? "", result_position: li ? items.indexOf(li) + 1 : 0 });
      }
      const el = target?.closest?.("[data-cta-kind]") as HTMLElement | null;
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      const context: EventContext = {
        page_type: pageTypeOf(window.location.pathname),
        cta_kind: el.dataset.ctaKind ?? "",
        cta_placement: el.dataset.ctaPlacement ?? "",
        content_slug: el.dataset.contentSlug ?? "",
        pattern_id: el.dataset.patternId ?? "",
        target_path: href.startsWith("/") ? href.split("?")[0] : "",
      };
      track("cta_clicked", context);
      if (mode === "live" && /^https?:\/\//.test(href) && el.dataset.ctaKind === "consultation-apply") track("partner_outbound", context);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [mode]);
  return null;
}

/** 記事・ニュース解説の表示（1ページ1回） */
export function TrackArticleView({ context }: { context: EventContext }) {
  useEffect(() => {
    track("article_view", { page_type: pageTypeOf(window.location.pathname), ...context });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.content_id]);
  return null;
}
