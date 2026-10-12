/** 公開設定の取り違えで localhost の canonical を配布しない。公開自体の承認は partner config で別に判定。 */
export function resolveSiteUrl(value: string | undefined, indexable: boolean): string {
  const url = new URL(value || "http://localhost:3000");
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("NEXT_PUBLIC_SITE_URL には、認証情報やパスを含まないサイトのURLを指定してください。");
  }
  const host = url.hostname.toLowerCase();
  const local = !host.includes(".") || /(^|\.)(localhost|local|test|invalid|example)$/.test(host) || /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) || host.startsWith("[");
  if (indexable && (url.protocol !== "https:" || local)) {
    throw new Error("正式公開には、HTTPSの公開ドメインをNEXT_PUBLIC_SITE_URLに設定してください。");
  }
  return url.origin;
}
