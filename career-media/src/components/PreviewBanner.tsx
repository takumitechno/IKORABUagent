import { site } from "@/config/site";

/** 正式な提携・ブランド利用許諾前であることを示す細いバー（partner.brandUsageApproved=false の間だけ表示） */
export function PreviewBanner() {
  if (!site.showPreviewBanner) return null;
  return (
    <div className="no-print bg-ink px-4 py-1.5 text-center text-[11px] leading-5 tracking-wide text-white/85">
      提案用プレビュー（非公開）— 掲載内容・ブランド表記は正式公開前に確認予定です
    </div>
  );
}
