import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * 正式な提携・ブランド利用許諾前（site.indexable=false）は全クロールを拒否する。
 * 許諾後に SITE_INDEXABLE=true と partner.brandUsageApproved=true で公開設定に切り替わる。
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
