import Link from "next/link";
import { licenseLabel, partner } from "@/config/partner";
import { Logo } from "./Logo";

const MAIN_LINKS = [
  { href: "/articles", label: "記事一覧" },
  { href: "/concerns", label: "悩みから探す" },
  { href: "/situations", label: "今の状況から探す" },
  { href: "/jobs", label: "職種を比べる" },
  { href: "/news", label: "転職ニュース" },
  { href: "/check", label: "条件整理チェック" },
  { href: "/consultation", label: "キャリア相談について" },
];

const INFO_LINKS = [
  { href: "/about", label: "運営者情報" },
  { href: "/editorial-policy", label: "編集方針" },
  { href: "/disclosure", label: "広告・提携表記" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/disclaimer", label: "免責事項" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <Logo />
            <dl className="mt-5 space-y-0.5 text-[12px] leading-6 text-muted">
              <div className="flex gap-2">
                <dt className="shrink-0 text-body">運営</dt>
                <dd>{partner.operatorDisplay}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-body">企画・制作</dt>
                <dd>{partner.producerDisplay}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-body">相談先</dt>
                <dd>
                  {partner.partnerName}（有料職業紹介事業許可番号: {licenseLabel}）
                </dd>
              </div>
            </dl>
          </div>
          <nav aria-label="フッターメニュー">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[14px] sm:grid-cols-3">
              {MAIN_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-ink hover:text-brand-strong hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-5 text-[12px]">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted hover:text-brand-strong hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-[11.5px] leading-6 text-muted">{partner.disclosure}</p>
        <p className="mt-2 text-[11.5px] text-muted">© {new Date().getFullYear()} {partner.brandName}</p>
      </div>
    </footer>
  );
}
