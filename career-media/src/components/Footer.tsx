import Link from "next/link";
import { licenseLabel, partner } from "@/config/partner";
import { site } from "@/config/site";
import { Logo } from "./Logo";

const FOOTER_GROUPS = [
  {
    title: "記事を探す",
    links: [
      { href: "/articles", label: "記事一覧" },
      { href: "/concerns", label: "悩みから探す" },
      { href: "/situations", label: "今の状況から探す" },
      { href: "/jobs", label: "職種から探す" },
      { href: "/news", label: "転職ニュース・市場情報" },
    ],
  },
  {
    title: "整理する・相談する",
    links: [
      { href: "/jobs", label: "職種を比べる" },
      { href: "/check", label: "条件整理チェック" },
      { href: "/consultation", label: "キャリア相談について" },
    ],
  },
  {
    title: "このメディアについて",
    links: [
      { href: "/about", label: "運営者情報" },
      { href: "/editorial-policy", label: "編集方針" },
      { href: "/disclosure", label: "広告・提携表記" },
      { href: "/privacy", label: "プライバシーポリシー" },
      { href: "/disclaimer", label: "免責事項" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">{site.tagline}</p>
            <dl className="mt-5 space-y-1 text-xs leading-6 text-muted">
              <div className="flex gap-2">
                <dt className="shrink-0 font-medium text-body">運営</dt>
                <dd>{partner.operatorDisplay}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 font-medium text-body">企画・制作</dt>
                <dd>{partner.producerDisplay}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 font-medium text-body">相談先</dt>
                <dd>
                  {partner.partnerName}（有料職業紹介事業許可番号: {licenseLabel}）
                </dd>
              </div>
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-bold tracking-wider text-ink">{group.title}</p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-muted hover:text-brand-strong hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs leading-6 text-muted">{partner.disclosure}</p>
        <p className="mt-3 text-xs text-muted">© {new Date().getFullYear()} {partner.brandName}</p>
      </div>
    </footer>
  );
}
