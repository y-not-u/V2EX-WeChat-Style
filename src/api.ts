import { parseDocument, serverError } from './parser';
import type { Action, NativeForm } from './types';

export function sameOrigin(input: string): URL {
  const url = new URL(input, location.origin);
  if (url.origin !== location.origin || !['https:', 'http:'].includes(url.protocol)) throw new Error('仅允许请求当前 V2EX 域名。');
  url.hash = ''; url.searchParams.delete('v2wc');
  return url;
}
export interface Page { doc: Document; url: string }
export async function loadPage(input: string, signal?: AbortSignal): Promise<Page> {
  const response = await fetch(sameOrigin(input), { credentials: 'same-origin', signal, redirect: 'follow' });
  if (!response.ok) throw new Error(response.status === 429 ? '访问过于频繁，请稍后重试。' : `页面读取失败（${response.status}），请查看原页面。`);
  if (new URL(response.url).origin !== location.origin) throw new Error('页面跳转到其他域名，请在原站继续。');
  const doc = parseDocument(await response.text());
  if (new URL(response.url).pathname === '/signin') throw new Error('请先登录 V2EX，再回来继续。');
  if (!doc.querySelector('#Main')) throw new Error('页面暂时无法读取，可能需要在原站完成访问验证。');
  return { doc, url: response.url };
}

export interface NodeSummary { name: string; title: string }
// Share both successful results and in-flight requests for this page's lifetime.
let nodesRequest: Promise<NodeSummary[]> | undefined;
export function loadNodes(): Promise<NodeSummary[]> {
  if (!nodesRequest) {
    nodesRequest = (async () => {
      const response = await fetch('/api/nodes/list.json?fields=name,title&sort_by=topics&reverse=1', { credentials: 'same-origin' });
      if (!response.ok) throw new Error('节点列表暂时不可用');
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('节点列表格式无法识别');
      return data.filter((n): n is NodeSummary => n !== null && typeof n === 'object' &&
        typeof n.name === 'string' && /^[a-zA-Z0-9_-]+$/.test(n.name) && typeof n.title === 'string');
    })().catch(error => {
      nodesRequest = undefined;
      throw error;
    });
  }
  return nodesRequest;
}

async function freshOnce(): Promise<string> {
  const response = await fetch('/poll_once', { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('无法刷新操作令牌，请在原站重新登录。');
  const token = (await response.text()).trim();
  if (!/^\d+$/.test(token)) throw new Error('登录状态或校验令牌失效，请在原站重新登录。');
  return token;
}

function topicRedirect(doc: Document, base: string, refresh: string | null): string | undefined {
  const candidates: string[] = [];
  for (const value of [refresh, ...Array.from(doc.querySelectorAll('meta[http-equiv]'))
    .filter(el => el.getAttribute('http-equiv')?.toLowerCase() === 'refresh').map(el => el.getAttribute('content'))]) {
    const target = value?.match(/^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*(.*?)\s*$/i)?.[1];
    if (target) candidates.push(target.replace(/^(['"])(.*)\1$/, '$2'));
  }
  for (const script of doc.querySelectorAll('script:not([src])')) {
    // Read literal navigation targets without executing response scripts.
    const redirects = /(?:\b(?:window\.|document\.)?location(?:\.href)?\s*=\s*|\b(?:window\.|document\.)?location\.(?:replace|assign)\s*\(\s*)(['"])([^'"\r\n]+)\1/g;
    for (const match of (script.textContent || '').matchAll(redirects)) candidates.push(match[2]);
  }
  for (const target of candidates) {
    try {
      const url = sameOrigin(new URL(target, base).href);
      if (/^\/t\/\d+\/?$/.test(url.pathname)) return url.href;
    } catch { /* Ignore redirects outside the current site or invalid URLs. */ }
  }
}

export async function submitForm(form: NativeForm, values: Record<string, string>): Promise<Page> {
  const fields = { ...form.fields, ...values };
  if ('once' in fields) fields.once = await freshOnce();
  const body = new URLSearchParams(fields);
  const url = sameOrigin(form.action);
  if (form.method === 'GET') body.forEach((v, k) => url.searchParams.set(k, v));
  const response = await fetch(url, { method: form.method, credentials: 'same-origin',
    ...(form.method !== 'GET' ? { body } : {}) });
  if (!response.ok) throw new Error(`提交失败（${response.status}），草稿已保留。`);
  if (new URL(response.url).origin !== location.origin || new URL(response.url).pathname === '/signin') throw new Error('登录已失效，草稿已保留，请重新登录。');
  let doc = parseDocument(await response.text());
  const error = serverError(doc);
  if (error) throw new Error(error);
  let resultURL = response.url;
  if (!doc.querySelector('#Main .header h1')) {
    const redirect = topicRedirect(doc, resultURL, response.headers.get('refresh'));
    if (redirect) {
      const page = await loadPage(redirect);
      doc = page.doc; resultURL = page.url;
      const redirectError = serverError(doc);
      if (redirectError) throw new Error(redirectError);
    }
  }
  if (!doc.querySelector('#Main .header h1')) throw new Error('服务器未确认提交成功，草稿已保留，请在原站检查。');
  return { doc, url: resultURL };
}

export async function runAction(action: Action): Promise<void> {
  const url = sameOrigin(action.url);
  url.searchParams.set('once', await freshOnce());
  const response = await fetch(url, { method: action.method, credentials: 'same-origin' });
  if (!response.ok) throw new Error(`操作失败（${response.status}）。`);
  if (new URL(response.url).origin !== location.origin || new URL(response.url).pathname === '/signin') throw new Error('请重新登录 V2EX。');
  const body = await response.text();
  if (action.method === 'POST') {
    let result: { success?: boolean; message?: string };
    try { result = JSON.parse(body); } catch { throw new Error('服务器未确认操作成功，请在原站检查。'); }
    if (!result.success) throw new Error(result.message || '操作未成功。');
  } else {
    const doc = parseDocument(body);
    const error = serverError(doc);
    if (error) throw new Error(error);
    if (!doc.querySelector('#Main')) throw new Error('无法确认收藏状态，请在原站检查。');
  }
}
