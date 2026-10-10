import { icon } from './icons';

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag); node.className = cls; node.textContent = text; return node;
}
export function button(label: string, callback: () => void, cls = '', symbol?: string): HTMLButtonElement {
  const node = el('button', cls); node.type = 'button'; node.title = label; node.setAttribute('aria-label', label);
  if (symbol) node.innerHTML = icon(symbol); else node.textContent = label;
  node.addEventListener('click', callback); return node;
}
export function avatar(src: string, user: string, cls = ''): HTMLElement {
  const box = el('span', `avatar ${cls}`, user.slice(0, 1).toUpperCase() || 'V');
  if (src) {
    const img = el('img'); img.src = src; img.alt = user; img.referrerPolicy = 'no-referrer';
    img.addEventListener('load', () => box.classList.add('has-image'), { once: true });
    img.addEventListener('error', () => { img.remove(); box.classList.remove('has-image'); }, { once: true }); box.append(img);
  }
  return box;
}
export function nativeURL(input: string): string {
  const url = new URL(input, location.origin);
  if (url.origin === location.origin) url.searchParams.set('v2wc', 'off');
  return url.href;
}
export function nativeLink(label: string, input: string, cls = ''): HTMLAnchorElement {
  const node = el('a', cls, label); node.href = nativeURL(input); node.target = '_blank'; node.rel = 'noopener noreferrer'; return node;
}
