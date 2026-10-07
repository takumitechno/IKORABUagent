"use client";

import { buildEvent, sessionFromLocation, type EventContext, type SessionAttributes, type SiteEvent, type SiteEventName } from "./schema";

/**
 * ブラウザ側の計測。イベントは window.__careerMediaEvents に積み、"career-media:event" を発火するだけ。
 * ネットワークには送らない（本番の解析ツールは未接続）。将来つなぐときは、ここに送り先を足す。
 */

const SESSION_KEY = "career-media:session:v1";
/** 商談デモで「記録されたイベント」を見せるための控え（このタブの中だけ。送信しない） */
export const EVENTS_KEY = "career-media:events:v1";
const MAX_EVENTS = 200;
const MAX_STORED = 50;

declare global {
  interface Window {
    __careerMediaEvents?: SiteEvent[];
    __careerMediaMode?: "demo" | "live";
  }
}

let memorySession: SessionAttributes | null = null;

/** セッションの流入元。最初のページで1回だけ決める（以降のページ遷移で上書きしない） */
export function getSession(): SessionAttributes {
  if (memorySession) return memorySession;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      memorySession = JSON.parse(raw) as SessionAttributes;
      return memorySession;
    }
  } catch {
    /* sessionStorage が使えない環境では、このページの間だけ保持する */
  }
  memorySession = sessionFromLocation(window.location.href, document.referrer);
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(memorySession));
  } catch {
    /* noop */
  }
  return memorySession;
}

export function storedEvents(): SiteEvent[] {
  try {
    return JSON.parse(sessionStorage.getItem(EVENTS_KEY) ?? "[]") as SiteEvent[];
  } catch {
    return [];
  }
}

export function track(name: SiteEventName, context: EventContext = {}): SiteEvent | null {
  if (typeof window === "undefined") return null;
  const event = buildEvent(name, { page_path: window.location.pathname, ...context }, getSession(), window.__careerMediaMode ?? "demo");
  const list = (window.__careerMediaEvents ??= []);
  list.push(event);
  if (list.length > MAX_EVENTS) list.splice(0, list.length - MAX_EVENTS);
  try {
    const stored = JSON.parse(sessionStorage.getItem(EVENTS_KEY) ?? "[]") as SiteEvent[];
    stored.push(event);
    sessionStorage.setItem(EVENTS_KEY, JSON.stringify(stored.slice(-MAX_STORED)));
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent("career-media:event", { detail: event }));
  return event;
}
