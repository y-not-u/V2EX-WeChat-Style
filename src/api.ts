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

async function freshOnce(): Promise<string> {
  const response = await fetch('/poll_once', { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('无法刷新操作令牌，请在原站重新登录。');
  const token = (await response.text()).trim();
  if (!/^\d+$/.test(token)) throw new Error('登录状态或校验令牌失效，请在原站重新登录。');
  return token;
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
  const doc = parseDocument(await response.text());
  const error = serverError(doc);
  if (error) throw new Error(error);
  if (!doc.querySelector('#Main .header h1')) throw new Error('服务器未确认提交成功，草稿已保留，请在原站检查。');
  return { doc, url: response.url };
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
