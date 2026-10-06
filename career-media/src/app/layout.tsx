import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PreviewBanner } from "@/components/PreviewBanner";
import { DemoConsultDialog } from "@/components/DemoConsultDialog";
import { partner } from "@/config/partner";
import { site } from "@/config/site";
import "./globals.css";

// ビルド時にフォントを取得して自己ホストする（閲覧時に Google へリクエストしない）
const notoSansJp = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.fullName}｜はじめての転職・未経験転職の仕事選びメディア`, template: `%s｜${site.fullName}` },
  description: site.description,
  applicationName: site.fullName,
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f7b6c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body className="min-h-screen antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
          本文へスキップ
        </a>
        <PreviewBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {partner.consultationMode === "demo" && <DemoConsultDialog consultationOrigin={new URL(partner.consultationUrl).origin} />}
      </body>
    </html>
  );
}
