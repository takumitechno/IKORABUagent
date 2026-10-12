import { BadgeCheck, Compass, Handshake } from "lucide-react";
import { partner } from "@/config/partner";
import { PartnerNote } from "./ConsultationCta";

const icons = [BadgeCheck, Compass, Handshake];
export function ConsultationTrust({ compact = false }: { compact?: boolean }) {
  return <aside className={`consult-trust${compact ? " consult-trust-compact" : ""}`} aria-label="相談先について">
    <p className="editorial-kicker">相談先について</p>
    <h2>{partner.partnerName}</h2>
    <PartnerNote className="trust-license" />
    <ul>{partner.consultationProof.map((item, i) => { const Icon = icons[i]; return <li key={item.title}><Icon aria-hidden="true" /><div><h3>{item.title}</h3>{!compact && <p>{item.body}</p>}</div></li>; })}</ul>
    <details className="trust-source"><summary>対応対象と案内の根拠</summary><p>{partner.consultationEligibilityNote}</p><p>{partner.consultationProofSource}</p></details>
  </aside>;
}
