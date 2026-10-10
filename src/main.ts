import { ChatApp, supportedRoute } from './app';
import { parseList, parseTopic } from './parser';
import { menu, read, write } from './storage';

let app: ChatApp | undefined;
let visibilityStyle: HTMLStyleElement | undefined;
const narrow = matchMedia('(max-width: 1023px)');

function stop(): void {
  app?.dispose(); app = undefined;
  document.body.classList.remove('v2wc-enabled'); visibilityStyle?.remove(); visibilityStyle = undefined;
}
function restore(): void {
  write('enabled', false); stop();
  // The native DOM belongs to the page originally loaded, not necessarily the SPA URL.
  const url = new URL(location.href); url.searchParams.set('v2wc', 'off'); location.replace(url.href);
}
function start(): void {
  if (app || narrow.matches || !read('enabled', true) || new URL(location.href).searchParams.get('v2wc') === 'off' || !supportedRoute(location.pathname)) return;
  try {
    const initial = /^\/t\/\d+/.test(location.pathname) ? parseTopic(document, location.href) : parseList(document, location.href);
    if (!document.querySelector('#Main')) return;
    app = new ChatApp(initial, restore); app.mount();
    visibilityStyle = document.createElement('style');
    visibilityStyle.textContent = `body.v2wc-enabled { overflow: hidden !important; }
      body.v2wc-enabled > :not(#v2wc-root):not(script):not(style) { display: none !important; }
      #v2wc-root { position: fixed !important; inset: 0 !important; z-index: 100000 !important; display: block !important; }
      @media print { body.v2wc-enabled { overflow: visible !important; } body.v2wc-enabled > :not(#v2wc-root):not(script):not(style) { display: revert !important; } #v2wc-root { display: none !important; } }`;
    document.head.append(visibilityStyle); document.body.classList.add('v2wc-enabled');
  } catch (error) { stop(); console.warn('[V2EX 微信皮肤] 保留原站：', error); }
}

menu('启用微信聊天皮肤', () => {
  write('enabled', true); const url = new URL(location.href); url.searchParams.delete('v2wc'); location.replace(url.href);
});
menu('恢复原站界面', restore);
narrow.addEventListener('change', () => {
  // Reload to avoid exposing a native page whose content no longer matches the URL.
  if (app && narrow.matches) { stop(); location.reload(); }
  else if (!narrow.matches) start();
});
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
