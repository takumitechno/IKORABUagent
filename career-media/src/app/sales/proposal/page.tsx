import { salesAddressee } from "@/config/sales";
import { ACCEPTANCE_NOTE, INITIAL_SCOPE, PRODUCTION_ROLES, ASSETS_PARTNER, ASSETS_TAKUMI, EXIT_PRINCIPLE, fixedTotal, MONTHLY_SCOPE, OUT_OF_SCOPE, PARTNER_COOPERATION, paymentScenario, PILOT, PLAN, SCENARIO_COUNTS, yen } from "@/lib/sales/proposal";
import { pageMetadata } from "@/lib/seo";
import { PrintButton } from "./PrintButton";

export const metadata = pageMetadata({ title: "Pilot のご提案", description: "商談用（非公開）", path: "/sales/proposal", noindex: true });

function Block({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="break-inside-avoid scroll-mt-24 rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line print:rounded-none print:p-3 print:ring-0">
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

      <p className="mt-5 max-w-4xl text-[15px] leading-7 text-body">月4テーマを軸に、投稿・記事・相談準備までを整え、相談につながるテーマを検証します。既存のTikTokは活かします。制作物を残し、3か月後に継続を判断する提案です。</p>

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

      <div className="mt-4">
        <Block id="initial" title="初期10万円で納品するもの・完了の確認（案）">
          <dl className="divide-y divide-line">
            {INITIAL_SCOPE.map((s) => <div key={s.deliverable} className="py-3 sm:grid sm:grid-cols-[200px_1fr] sm:gap-4">
              <dt className="font-bold text-ink">{s.deliverable}</dt><dd>{s.acceptance}</dd>
            </div>)}
          </dl>
          <p className="mt-2 text-[12px] leading-6 text-muted">{ACCEPTANCE_NOTE}</p>
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
          <p className="mt-2 text-[12px] leading-6 text-muted">標準に含めないもの: {OUT_OF_SCOPE.join("、")}。{PRODUCTION_ROLES} 最終的な範囲は商談後に調整します。</p>
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
