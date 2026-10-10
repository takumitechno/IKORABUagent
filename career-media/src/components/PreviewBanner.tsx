import { partner } from "@/config/partner";
import { site } from "@/config/site";

/** 正式な提携・ブランド利用許諾前であることを示す細いバー（partner.brandUsageApproved=false の間だけ表示） */
export function PreviewBanner() {
  if (!site.showPreviewBanner) return null;
  return (
    <div className="no-print bg-night px-4 py-1 text-center text-[11px] leading-5 text-white/80">
      {partner.previewNotice}
    </div>
  );
}
