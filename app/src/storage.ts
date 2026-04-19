import type { SessionResult } from "./types";

const KEY = "coc.history.v1";

export function loadHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SessionResult[];
  } catch {
    return [];
  }
}

export function saveSession(r: SessionResult) {
  const all = loadHistory();
  all.unshift(r);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
