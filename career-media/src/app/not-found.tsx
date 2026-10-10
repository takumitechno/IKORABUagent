import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-bold tracking-[0.2em] text-brand">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">ページが見つかりませんでした</h1>
      <p className="mt-4 text-[15px] leading-8 text-body">お探しのページは移動または削除された可能性があります。記事一覧やトップページからお探しください。</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-press">
          トップページへ
        </Link>
        <Link href="/articles" className="rounded-full border border-line-strong bg-surface px-6 py-3 text-sm font-bold text-ink hover:border-brand">
          記事一覧へ
        </Link>
      </div>
    </div>
  );
}
