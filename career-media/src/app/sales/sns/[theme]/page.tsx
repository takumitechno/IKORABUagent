import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ClipboardList, Clapperboard, Compass, FileText, Images, MessageCircle, Smartphone, Video } from "lucide-react";
import { CarouselSlide } from "@/components/sales/CarouselSlide";
import { GeneratedImage } from "@/components/GeneratedImage";
import { findSelectedImage } from "@/lib/generated-images";
import { site } from "@/config/site";
import { getRepository } from "@/lib/content";
import { SNS_THEMES, utm } from "@/lib/sales/sns";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ theme: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => SNS_THEMES.map((t) => ({ theme: t.id }));
export async function generateMetadata({ params }: Props) {
  const { theme: id } = await params;
  const t = SNS_THEMES.find((x) => x.id === id);
  return pageMetadata({ title: `投稿案: ${t?.title ?? ""}`, description: "商談用（非公開）", path: `/sales/sns/${t?.id ?? ""}`, noindex: true });
}

function Badge() {
  return <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11.5px] font-bold text-accent-strong ring-1 ring-accent/30">投稿案 / 未公開</span>;
}

export default async function SnsThemePage({ params }: Props) {
  const { theme: id } = await params;
  const theme = SNS_THEMES.find((t) => t.id === id);
  if (!theme) notFound();
  const article = await getRepository().getArticle(theme.web.articleSlug);
  const slides = theme.carousel.slides;
  const route = [
    { icon: Images, label: "Instagram の投稿", sub: "カルーセル・リール・Stories", href: "#carousel" },
    { icon: FileText, label: "記事", sub: theme.web.articleTitle, href: `/articles/${theme.web.articleSlug}` },
    ...(theme.web.journeyHub ? [{ icon: Compass, label: "読む順番ガイド", sub: theme.web.journeyTitle ?? "", href: `${theme.web.journeyHub}#guide` }] : []),
    { icon: ClipboardList, label: "条件整理チェック", sub: "13問・相談準備ノート", href: "/check" },
    { icon: MessageCircle, label: "相談について", sub: "相談したい人はここから", href: "/consultation" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-bold tracking-[0.2em] text-brand">THEME {theme.id.toUpperCase()}</p>
        <Badge />
      </div>
      <h1 className="mt-1 text-[24px] font-bold leading-snug text-ink sm:text-[30px]">{theme.title}</h1>
      <p className="mt-2 max-w-3xl text-[15px] leading-8 text-body">対象: {theme.audience}</p>

      {/* 投稿から先の流れ */}
      <section aria-labelledby="route" className="mt-6 rounded-[var(--radius-card)] bg-surface p-4 ring-1 ring-line sm:p-5">
        <h2 id="route" className="text-[15px] font-bold text-ink">この投稿から先の流れ（すべて実際に開けます）</h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-5">
          {route.map((r, i) => (
            <li key={r.label}>
              <Link href={r.href} className="flex h-full items-start gap-2 rounded-xl bg-canvas p-3 ring-1 ring-line hover:ring-brand/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-night text-[11px] font-bold text-white">{i + 1}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-[13px] font-bold text-ink">
                    <r.icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    {r.label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-5 text-muted">{r.sub}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {!article && <p className="mt-2 text-xs text-accent-strong">対応する記事が見つかりません（公開状態を確認）</p>}
      </section>

      {/* 表紙用ビジュアル（OpenAI で生成し、採用済みのものがあるときだけ出す） */}
      {findSelectedImage(`sns-theme-${theme.id}-cover`) && (
        <section aria-labelledby="cover-visual" className="mt-6 rounded-[var(--radius-card)] bg-surface p-4 ring-1 ring-line sm:p-5">
          <h2 id="cover-visual" className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-ink">
            表紙用ビジュアル（生成画像）
            <Badge />
          </h2>
          <p className="mt-1 text-[12.5px] text-muted">文字は入れていません。タイトルは投稿時に重ねる想定です。</p>
          <div className="mt-3 max-w-[280px] overflow-hidden rounded-xl ring-1 ring-line">
            <GeneratedImage slug={`sns-theme-${theme.id}-cover`} sizes="280px" className="h-auto w-full" fallback={null} />
          </div>
        </section>
      )}

      {/* カルーセル */}
      <section id="carousel" aria-labelledby="carousel-title" className="mt-10 scroll-mt-24">
        <h2 id="carousel-title" className="flex flex-wrap items-center gap-2 text-[20px] font-bold text-ink">
          <Images className="h-5 w-5 text-brand" aria-hidden="true" />
          カルーセル（{slides.length}枚・4:5）
          <Badge />
        </h2>
        <p className="mt-1 text-[13px] text-muted">横にスクロールして1枚ずつ見られます。各スライドの下は代替テキスト（alt）です。</p>
        <ol className="swipe mt-4 [--swipe-w:78%] sm:[--swipe-w:300px]" data-carousel={theme.id}>
          {slides.map((slide, i) => (
            <li key={i}>
              <CarouselSlide slide={slide} index={i} total={slides.length} mediaName={site.name} tone={theme.tone} />
              <p className="mt-2 text-[11.5px] leading-5 text-muted">alt: {slide.alt}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line">
            <p className="text-[14px] font-bold text-ink">キャプション</p>
            <p className="mt-2 whitespace-pre-line text-[14px] leading-7 text-body">{theme.carousel.caption}</p>
            <p className="mt-3 text-[13px] text-brand-strong">{theme.carousel.hashtags.map((h) => `#${h}`).join(" ")}</p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line">
            <p className="text-[14px] font-bold text-ink">CTA と行き先</p>
            <ul className="mt-2 space-y-2 text-[13px] leading-6 text-body">
              <li>・保存を促す（あとで見返す内容にしている）</li>
              <li>・プロフィールのリンク → 記事「{theme.web.articleTitle}」</li>
              <li>・記事の中から、条件整理チェック・相談の説明へ</li>
            </ul>
            <p className="mt-3 break-all rounded-lg bg-canvas p-2.5 font-mono text-[11px] leading-5 text-muted">
              /articles/{theme.web.articleSlug}?{utm(theme.id, "carousel")}
            </p>
            <p className="mt-2 text-[11.5px] leading-5 text-muted">UTM はセッションの流入元として1回だけ記録する（ページを見るたびに SNS 訪問として数えない）。</p>
          </div>
        </div>
      </section>

      {/* リール */}
      <section aria-labelledby="reel-title" className="mt-12">
        <h2 id="reel-title" className="flex flex-wrap items-center gap-2 text-[20px] font-bold text-ink">
          <Video className="h-5 w-5 text-brand" aria-hidden="true" />
          リール（{theme.reel.length}）
          <span className="rounded-full bg-canvas px-2.5 py-0.5 text-[11.5px] font-bold text-muted ring-1 ring-line">台本・絵コンテ・制作見本（未撮影）</span>
        </h2>
        <p className="mt-2 text-[14px] text-body">
          つかみ（最初の2秒）: <strong className="text-ink">「{theme.reel.hook}」</strong>
        </p>
        <ol className="mt-4 grid gap-3 md:grid-cols-5">
          {theme.reel.scenes.map((s, i) => (
            <li key={s.time} className="flex flex-col rounded-[var(--radius-card)] bg-surface p-3 ring-1 ring-line">
              <div className="relative flex aspect-[9/16] items-center justify-center rounded-xl bg-night p-3 text-center">
                <span className="absolute left-2 top-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">{s.time}</span>
                <p className="text-[15px] font-bold leading-6 text-white">{s.telop}</p>
                <Clapperboard className="absolute bottom-2 right-2 h-4 w-4 text-white/40" aria-hidden="true" />
              </div>
              <p className="mt-2 text-[11px] font-bold text-muted">シーン {i + 1}</p>
              <p className="mt-0.5 text-[12.5px] leading-5 text-body">映像: {s.visual}</p>
              <p className="mt-1 text-[12.5px] leading-5 text-ink">ナレーション: {s.voice}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] bg-surface p-4 ring-1 ring-line">
            <p className="text-[13.5px] font-bold text-ink">必要な素材（商談で確認）</p>
            <ul className="mt-2 space-y-1 text-[13px] leading-6 text-body">
              {theme.reel.materials.map((m) => (
                <li key={m}>・{m}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] bg-surface p-4 ring-1 ring-line">
            <p className="text-[13.5px] font-bold text-ink">CTA・注意</p>
            <p className="mt-2 text-[13px] leading-6 text-body">{theme.reel.cta}</p>
            <ul className="mt-1 space-y-1 text-[13px] leading-6 text-muted">
              {theme.reel.notes.map((n) => (
                <li key={n}>・{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section aria-labelledby="stories-title" className="mt-12">
        <h2 id="stories-title" className="flex flex-wrap items-center gap-2 text-[20px] font-bold text-ink">
          <Smartphone className="h-5 w-5 text-brand" aria-hidden="true" />
          Stories（{theme.stories.length}枚）
          <Badge />
        </h2>
        <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {theme.stories.map((f, i) => (
            <li key={f.text} className="mx-auto w-full max-w-[260px]">
              <div className={`relative flex aspect-[9/16] flex-col justify-center rounded-[22px] p-5 ring-1 ring-line ${theme.tone}`}>
                <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-bold text-accent-strong">投稿案・未公開</span>
                <span className="absolute right-3 top-3 text-[10px] font-bold text-ink/50">{i + 1} / {theme.stories.length}</span>
                <p className="text-[19px] font-bold leading-8 text-ink">{f.text}</p>
                <p className="mt-4 rounded-xl border-2 border-dashed border-ink/25 bg-surface/80 p-3 text-[12.5px] font-bold leading-5 text-ink">{f.sticker}</p>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-muted">{f.cta}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TikTok */}
      <section aria-labelledby="tiktok-title" className="mt-12 rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line sm:p-6">
        <h2 id="tiktok-title" className="text-[18px] font-bold text-ink">同じテーマを TikTok で扱う場合の差分メモ</h2>
        <p className="mt-1 text-[12.5px] text-muted">既存の TikTok 運用を置き換える提案ではありません。</p>
        <dl className="mt-4 grid gap-3 text-[13.5px] leading-6 sm:grid-cols-2">
          <div><dt className="font-bold text-ink">つかみの違い</dt><dd className="text-body">{theme.tiktok.hook}</dd></div>
          <div><dt className="font-bold text-ink">尺</dt><dd className="text-body">{theme.tiktok.length}</dd></div>
          <div><dt className="font-bold text-ink">テロップ</dt><dd className="text-body">{theme.tiktok.telop}</dd></div>
          <div><dt className="font-bold text-ink">導線</dt><dd className="text-body">{theme.tiktok.route}</dd></div>
        </dl>
        <ul className="mt-3 space-y-1 text-[13px] leading-6 text-muted">
          {theme.tiktok.notes.map((n) => (
            <li key={n}>・{n}</li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        {SNS_THEMES.filter((t) => t.id !== theme.id).map((t) => (
          <Link key={t.id} href={`/sales/sns/${t.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-sm font-bold text-ink hover:border-brand">
            テーマ{t.id.toUpperCase()}: {t.title}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
