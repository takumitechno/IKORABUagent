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

export function announcedLabel(iso: string | null | undefined, dateType?: "effective" | "announced", today = new Date()): string {
  const future = Boolean(iso && iso.slice(0, 10) > today.toISOString().slice(0, 10));
  if (dateType === "effective") return future ? "施行予定" : "施行日";
  if (dateType === "announced") return future ? "発表予定" : "発表日";
  return future ? "関連日（予定）" : "関連日";
}
