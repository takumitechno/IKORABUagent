"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="no-print inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-bold text-ink hover:border-brand">
      <Printer className="h-4 w-4" aria-hidden="true" />
      印刷・PDFで保存
    </button>
  );
}
