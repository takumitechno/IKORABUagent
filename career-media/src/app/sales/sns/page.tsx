import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CarouselSlide } from "@/components/sales/CarouselSlide";
import { site } from "@/config/site";
import { SNS_THEMES } from "@/lib/sales/sns";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Instagram 投稿案", description: "商談用（非公開）", path: "/sales/sns", noindex: true });

export default function SnsIndexPage() {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.2em] text-brand">INSTAGRAM × WEB</p>
      <h1 className="mt-1 text-[24px] font-bold leading-snug text-ink sm:text-[30px]">Instagram 投稿案（3つの Research Theme）</h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-8 text-body">
        テーマごとに、カルーセル・リールの台本と絵コンテ・Stories・TikTok で扱う場合の差分メモと、投稿から先の Web の行き先（記事・読む順番ガイド・条件整理・相談）をセットで用意しました。すべて投稿案・未公開です。アカウントや反応の数字は作っていません。
      </p>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {SNS_THEMES.map((t) => (
          <li key={t.id}>
            <Link href={`/sales/sns/${t.id}`} className="tap lift group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-4 hover:border-brand/40">
              <div className="mx-auto w-full max-w-[260px]">
                <CarouselSlide slide={t.carousel.slides[0]} index={0} total={t.carousel.slides.length} mediaName={site.name} tone={t.tone} />
              </div>
              <p className="mt-4 text-[11px] font-bold tracking-[0.18em] text-brand">THEME {t.id.toUpperCase()}</p>
              <p className="mt-1 text-[16px] font-bold leading-snug text-ink group-hover:text-brand-strong">{t.title}</p>
              <p className="mt-2 text-[13px] leading-6 text-muted">{t.audience}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13.5px] font-bold text-brand-strong">
                投稿案と Web の行き先を見る
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
