// 条件整理チェック（本番と同じコンポーネント）をアーティファクト内にマウントする
import { ConditionCheck } from "@/components/ConditionCheck";
import { ConsultationPreview } from "@/components/ConsultationPreview";
import { createRoot } from "react-dom/client";

type Mount = (el: HTMLElement, consultationHref: string, consultationLabel: string) => void;

const mount: Mount = (el, consultationHref, consultationLabel) => {
  createRoot(el).render(<ConditionCheck consultationHref={consultationHref} consultationLabel={consultationLabel} allowPrint={false} />);
};

(window as unknown as { __mountConditionCheck: Mount }).__mountConditionCheck = mount;

(window as unknown as { __mountConsultationPreview: (el: HTMLElement) => void }).__mountConsultationPreview = (el) => {
  createRoot(el).render(<ConsultationPreview />);
};
