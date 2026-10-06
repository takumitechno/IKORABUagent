// 条件整理チェック（本番と同じコンポーネント）をアーティファクト内にマウントする
import { ConditionCheck } from "@/components/ConditionCheck";

type Mount = (el: HTMLElement, consultationHref: string, consultationLabel: string) => void;

const mount: Mount = (el, consultationHref, consultationLabel) => {
  const ReactDOM = (window as unknown as { ReactDOM: { createRoot(el: HTMLElement): { render(node: unknown): void } } }).ReactDOM;
  ReactDOM.createRoot(el).render(<ConditionCheck consultationHref={consultationHref} consultationLabel={consultationLabel} allowPrint={false} />);
};

(window as unknown as { __mountConditionCheck: Mount }).__mountConditionCheck = mount;
