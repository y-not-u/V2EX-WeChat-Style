declare const GM_getValue: <T>(key: string, fallback: T) => T;
declare const GM_setValue: (key: string, value: unknown) => void;
declare const GM_registerMenuCommand: (label: string, callback: () => void) => void;

export function read<T>(key: string, fallback: T): T {
  try { return GM_getValue(key, fallback); } catch { return fallback; }
}
export function write(key: string, value: unknown): void {
  try { GM_setValue(key, value); } catch { /* Storage may be disabled. Browsing still works. */ }
}
export function menu(label: string, callback: () => void): void {
  if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand(label, callback);
}
export function draftKey(user: string, id: string): string { return `draft:${user || 'guest'}:${id}`; }
