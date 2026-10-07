import { salesAddressee } from "@/config/sales";
import { ASSETS_PARTNER, ASSETS_TAKUMI, EXIT_PRINCIPLE, fixedTotal, MONTHLY_SCOPE, OUT_OF_SCOPE, PARTNER_COOPERATION, paymentScenario, PILOT, PLAN, SCENARIO_COUNTS, yen } from "@/lib/sales/proposal";
import { pageMetadata } from "@/lib/seo";
import { PrintButton } from "./PrintButton";

export const metadata = pageMetadata({ title: "Pilot のご提案", description: "商談用（非公開）", path: "/sales/proposal", noindex: true });

function Block({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="break-inside-avoid scroll-mt-24 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line print:rounded-none print:p-3 print:ring-0">
      <h2 className="text-[16px] font-bold text-ink">{title}</h2>
      <div className="mt-2 text-[13.5px] leading-7 text-body">{children}</div>
    </section>
  );
}

export default function ProposalPage() {
  return (
    <article className="text-body">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand">PROPOSAL（提案仮条件・非公開）</p>
          <h1 className="mt-1 text-[24px] font-bold leading-snug text-ink sm:text-[28px]">{PILOT.name}</h1>
          <p className="mt-2 max-w-3xl text-[14.5px] leading-7">{salesAddressee}へのご提案: {PILOT.oneLiner}</p>
        </div>
        <PrintButton />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-2">
        <Block title="Instagram のご相談への回答">
          Instagram の投稿だけを作るのではなく、投稿に興味を持った人が読む記事・比べる材料・条件整理・相談の説明までを、テーマごとにセットで作ります。投稿の反応をその場で終わらせず、検索とコンテンツの資産として残します。
        </Block>
        <Block title="既存の TikTok との役割">
          既存の TikTok 運用は置き換えません。TikTok で反応のよいテーマや言い回しを企画の材料（Research の入力）として使い、Instagram と記事で「保存して見返す・詳しく読む」役割を担います。
        </Block>
        <Block title="Web を付ける理由">
          SNS は「知る」きっかけ、Web は「自分の場合を考える」場所です。相談の前に自分で整理できる人が増えると、面談で話す内容が具体的になります。迷っている人は記事・比較・条件整理へ、すぐ相談したい人は相談の説明へ直接進めるようにしています。
        </Block>
        <Block title="3か月の Pilot">
          3か月で面談数を保証する商品ではありません。メディア資産・SNS 制作物・運用体制・計測の仕組み・改善データを残しながら、相談・面談につながる勝ち筋を検証します。3か月目に条件を見直します。
        </Block>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_1fr] print:grid-cols-2 print:gap-2">
        <Block id="price" title="価格（Pilot 価格・税別・提案仮条件）">
          <table className="w-full text-[13.5px]">
            <tbody>
              <tr className="border-b border-line"><th className="py-1.5 pr-3 text-left font-medium">初期構築</th><td className="py-1.5 text-right font-bold text-ink">{yen(PILOT.initialFee)}</td></tr>
              <tr className="border-b border-line"><th className="py-1.5 pr-3 text-left font-medium">月額 × {PILOT.months}か月</th><td className="py-1.5 text-right font-bold text-ink">{yen(PILOT.monthlyFee)} × {PILOT.months}</td></tr>
              <tr className="border-b border-line"><th className="py-1.5 pr-3 text-left font-medium">固定部分の合計</th><td className="py-1.5 text-right font-bold text-ink">{yen(fixedTotal)}</td></tr>
              <tr><th className="py-1.5 pr-3 text-left font-medium">成果報酬（案）</th><td className="py-1.5 text-right font-bold text-ink">成果条件を満たした初回面談1件 {yen(PILOT.performanceFeePerMeeting)}</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-[12px] leading-6 text-muted">{PILOT.taxNote} 件数・検索順位・フォロワー・再生数・面談数は保証しません。</p>
        </Block>
        <Block title="費用の単純な計算例（成果予測ではありません）">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[12px] text-muted"><th className="py-1 font-medium">承認面談</th><th className="py-1 text-right font-medium">お支払い合計</th><th className="py-1 text-right font-medium">固定費込みの1件あたり</th></tr>
            </thead>
            <tbody>
              {SCENARIO_COUNTS.map((n) => {
                const s = paymentScenario(n);
                return (
                  <tr key={n} className="border-b border-line last:border-0">
                    <td className="py-1">{n}件</td>
                    <td className="py-1 text-right font-bold text-ink">{yen(s.total)}</td>
                    <td className="py-1 text-right">{s.perMeeting ? `約${yen(s.perMeeting)}` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-[12px] leading-6 text-muted">1件あたり＝{yen(PILOT.performanceFeePerMeeting)}＋{yen(fixedTotal)}÷件数。成果報酬の単価だけでは比べられません（固定費があります）。</p>
        </Block>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-2">
        <Block id="scope" title="月額の標準範囲（月4 Research Theme の一案）">
          <ul className="space-y-1">
            {MONTHLY_SCOPE.map((s) => (
              <li key={s.area}>
                <span className="font-bold text-ink">{s.area}: </span>
                {s.items.join("／")}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] leading-6 text-muted">標準に含めないもの: {OUT_OF_SCOPE.join("、")}。素材・撮影は御社からの提供が前提です。最終的な範囲は商談後に調整します。</p>
        </Block>
        <Block id="plan" title="3か月の進め方">
          <ol className="space-y-1.5">
            {PLAN.map((p) => (
              <li key={p.month}>
                <span className="font-bold text-ink">{p.month}（{p.focus}）: </span>
                {p.items.join("、")}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[12px] leading-6 text-muted">検索（SEO）の成果は3か月では保証しません。</p>
        </Block>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 print:grid-cols-2 print:gap-2">
        <Block id="assets" title="3か月後に御社に残るもの">
          <ul className="space-y-1">
            {ASSETS_PARTNER.map((a) => (
              <li key={a}>・{a}</li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] leading-6 text-muted">匠Technologies に残るもの: {ASSETS_TAKUMI.join("、")}。{EXIT_PRINCIPLE}</p>
        </Block>
        <Block title="お願いしたいご協力">
          <ul className="space-y-1">
            {PARTNER_COOPERATION.map((c) => (
              <li key={c}>・{c}</li>
            ))}
          </ul>
        </Block>
      </div>
      <p className="mt-4 text-[11.5px] leading-6 text-muted">この提案は商談用の仮条件です。契約内容・成果条件・個人情報の扱い・ブランドの利用範囲は、正式な契約と法務確認で決めます。</p>
    </article>
  );
}
