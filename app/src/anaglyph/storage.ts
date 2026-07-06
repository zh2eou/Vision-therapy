import type { AnaglyphResult } from "./types";

const KEY = "anaglyph.history.v1";

export function loadAnaglyphHistory(): AnaglyphResult[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnaglyphResult[];
  } catch {
    return [];
  }
}

export function saveAnaglyphSession(r: AnaglyphResult) {
  const all = loadAnaglyphHistory();
  all.unshift(r);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)));
}
