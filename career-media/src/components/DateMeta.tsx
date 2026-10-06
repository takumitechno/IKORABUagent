export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${y}.${m}.${d}`;
}

/** 施行日が未来なら「施行予定」、それ以外は「施行・発表」。ISR の再生成で切り替わる */
export function announcedLabel(iso: string | null | undefined, today = new Date()): string {
  return iso && iso.slice(0, 10) > today.toISOString().slice(0, 10) ? "施行予定" : "施行・発表";
}
