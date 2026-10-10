"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * ライト／ダークの切り替え。最初は OS の設定に合わせ、押すと html[data-theme] で上書きして端末に覚える。
 * どちらのアイコンを出すかは CSS（.theme-icon-light / .theme-icon-dark）で決めるので、描画のずれが起きない。
 */
export function ThemeToggle({ className = "", withLabel = false }: { className?: string; withLabel?: boolean }) {
  const toggle = () => {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 保存できない環境（プライベートモードなど）では、このページを開いている間だけ切り替える
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      data-theme-toggle=""
      aria-label="ライトモードとダークモードを切り替える"
      title="表示の明るさを切り替える"
      className={`items-center justify-center gap-2 rounded-full text-ink ring-1 ring-line transition hover:bg-brand-tint hover:text-brand-strong ${withLabel ? "px-5 py-3 text-[15px] font-bold" : "h-10 w-10"} ${className}`}
    >
      <Moon className="theme-icon-light h-[18px] w-[18px]" aria-hidden="true" />
      <Sun className="theme-icon-dark h-[18px] w-[18px]" aria-hidden="true" />
      {withLabel && <span>表示の明るさ（ライト／ダーク）</span>}
    </button>
  );
}
