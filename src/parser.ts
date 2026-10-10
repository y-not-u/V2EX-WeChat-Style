import DOMPurify from 'dompurify';
import type { Action, Link, NativeForm, Pagination, Session, Topic, TopicList } from './types';

export const parseDocument = (html: string): Document => new DOMParser().parseFromString(html, 'text/html');
const text = (el: Element | null | undefined): string => el?.textContent?.trim() || '';
const timestamp = (el: Element | null): string => {
  const exact = el?.getAttribute('title')?.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})(?:\s+[+-]\d{2}:\d{2})?$/);
  return exact ? `${exact[1]} ${exact[2]}` : text(el);
};
const savedTab = (): string | undefined => {
  try {
    const cookie = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith('V2EX_TAB='));
    if (!cookie) return;
    const value = decodeURIComponent(cookie.slice('V2EX_TAB='.length)).replace(/^"|"$/g, '');
    const fields = value.split('|');
    if (fields[0] !== '2' || fields[3] !== '8:V2EX_TAB') return;
    const payload = fields[4]?.match(/^(\d+):([A-Za-z0-9+/=]+)$/);
    if (!payload || Number(payload[1]) !== payload[2].length) return;
    const tab = atob(payload[2]);
    return /^[a-z0-9_]+$/.test(tab) ? tab : undefined;
  } catch { return; }
};
const absolute = (value: string, base: string): string => new URL(value, base).href;
const links = (elements: Iterable<Element>, base: string): Link[] => Array.from(elements).flatMap(el => {
  const href = el.getAttribute('href');
  return href && !href.startsWith('javascript:') ? [{ label: text(el), url: absolute(href, base) }] : [];
});
const image = (el: Element | null, base: string): string => {
  const src = el?.getAttribute('src');
  if (!src) return '';
  const url = new URL(src, base);
  return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
};
const member = (el: Element | null): string => {
  const href = el?.getAttribute('href') || '';
  return href.match(/\/member\/([^/?#]+)/)?.[1] || text(el);
};

export function session(doc: Document, base: string): Session {
  const link = doc.querySelector('#Top a[href^="/member/"]');
  return { user: link ? member(link) : '', avatar: image(doc.querySelector('#Right img.avatar'), base) };
}

export function safeHTML(html: string, base: string): string {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['form', 'input', 'textarea', 'button', 'select', 'style', 'iframe', 'video', 'audio'],
    FORBID_ATTR: ['style', 'srcset', 'id', 'name', 'tabindex'], ALLOW_DATA_ATTR: false,
  });
  const template = document.createElement('template');
  template.innerHTML = clean;
  embedImageURLs(template.content);
  template.content.querySelectorAll('[class]').forEach(el => {
    const classes = [...el.classList].filter(c => ['markdown_body', 'embedded_image', 'emoji'].includes(c) || /^language-[a-z0-9_-]+$/i.test(c));
    if (classes.length) el.setAttribute('class', classes.join(' ')); else el.removeAttribute('class');
  });
  template.content.querySelectorAll('a[href], img[src]').forEach(el => {
    const attr = el.tagName === 'A' ? 'href' : 'src';
    const value = el.getAttribute(attr)!;
    try {
      const url = new URL(value, base);
      if (!['http:', 'https:', ...(attr === 'href' ? ['mailto:'] : [])].includes(url.protocol)) {
        el.removeAttribute(attr); return;
      }
      el.setAttribute(attr, url.href);
      if (attr === 'href') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener noreferrer'); }
      else { el.setAttribute('loading', 'lazy'); el.setAttribute('referrerpolicy', 'no-referrer'); }
    } catch { el.removeAttribute(attr); }
  });
  return template.innerHTML;
}

function embedImageURLs(content: DocumentFragment): void {
  const isImageURL = (value: string): boolean => {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) && /\.(?:png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(url.pathname);
    } catch { return false; }
  };
  const preview = (url: string): HTMLImageElement => {
    const img = document.createElement('img'); img.src = url; img.alt = url; img.className = 'embedded_image'; return img;
  };
  // Preserve named links, existing images, and literal examples in code blocks.
  content.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
    if (link.closest('pre, code, kbd, samp') || link.children.length) return;
    const href = link.getAttribute('href')!;
    if (link.textContent?.trim() === href && isImageURL(href)) link.replaceChildren(preview(href));
  });
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    if (node.parentElement?.closest('a, pre, code, kbd, samp')) continue;
    const value = node.data; const replacement = document.createDocumentFragment(); let end = 0;
    for (const match of value.matchAll(/https?:\/\/[^\s<>"'，。；！？、（）【】]+/gi)) {
      const url = match[0].replace(/[.,;!?\)\]]+$/, '');
      if (!isImageURL(url)) continue;
      replacement.append(value.slice(end, match.index));
      const link = document.createElement('a'); link.href = url; link.append(preview(url)); replacement.append(link);
      end = match.index! + url.length;
    }
    if (end) { replacement.append(value.slice(end)); node.replaceWith(replacement); }
  }
}

export function pagination(doc: Document, base: string): Pagination {
  const current = Number(text(doc.querySelector('#Main .page_current'))) || Number(new URL(base).searchParams.get('p')) || 1;
  const pages = links(doc.querySelectorAll('#Main .page_normal, #Main .page_current'), base);
  const total = Math.max(current, ...pages.map(p => Number(p.label) || 1), Number(doc.querySelector('#Main .page_input')?.getAttribute('max')) || 1);
  const unique = new Map(pages.map(p => [p.url, p]));
  return { current, total, links: [...unique.values()] };
}

export function parseList(doc: Document, base: string): TopicList {
  if (!doc.querySelector('#Main')) throw new Error('未识别到 V2EX 列表，请查看原页面。');
  const breadcrumb = text(doc.querySelector('#Main .node-breadcrumb'));
  const nodeTitle = breadcrumb.replace(/^V2EX\s*›\s*/, '');
  const cells = Array.from(doc.querySelectorAll('#Main .cell.item, #Main .cell:has(.item_title)'));
  const knownEmptyList = doc.querySelector('#Tabs, #Main .node-header, #TopicsNode') ||
    (new URL(base).pathname === '/my/topics' && doc.querySelector('#Main .header'));
  if (!cells.length && !knownEmptyList) throw new Error(serverError(doc) || '列表结构无法识别，请查看原页面。');
  const items = cells.flatMap(cell => {
    const link = cell.querySelector<HTMLAnchorElement>('.item_title a[href*="/t/"]');
    if (!link) return [];
    const url = absolute(link.getAttribute('href')!, base);
    const id = new URL(url).pathname.match(/^\/t\/(\d+)/)?.[1];
    if (!id) return [];
    const info = cell.querySelector('.topic_info');
    const authors = info?.querySelectorAll('a[href*="/member/"]');
    const node = cell.querySelector('a.node, a[href^="/go/"]');
    const timestamp = info?.querySelector('[title]');
    return [{ id, url, title: text(link), author: member(authors?.[0] || null),
      avatar: image(cell.querySelector('img.avatar'), base),
      node: { label: text(node) || nodeTitle, url: node ? absolute(node.getAttribute('href')!, base) : base },
      replies: Number(text(cell.querySelector('.count_livid, .count_orange'))) || 0,
      time: timestamp?.getAttribute('title')?.match(/\b(\d{2}:\d{2}):\d{2}/)?.[1] || text(timestamp),
      lastUser: authors && authors.length > 1 ? member(authors[authors.length - 1]) : '',
    }];
  });
  const title = nodeTitle || text(doc.querySelector('#Main .header h1, #Main .header a[href^="/go/"]')) || 'V2EX';
  const activeTab = doc.querySelector('#Tabs a.tab_current')?.getAttribute('href');
  const listURL = new URL(base);
  const fallbackTab = listURL.searchParams.get('tab') || (listURL.pathname === '/' ? savedTab() : undefined);
  return { url: base, title, items, tabs: links(doc.querySelectorAll('#Tabs a[href^="/?tab="]'), base),
    currentTab: activeTab ? absolute(activeTab, base) : fallbackTab ? absolute(`/?tab=${fallbackTab}`, base) : undefined,
    nodes: links(doc.querySelectorAll('#SecondaryTabs a[href^="/go/"]'), base),
    pagination: pagination(doc, base), session: session(doc, base) };
}

export function parseForm(form: HTMLFormElement, base: string, kind: 'reply' | 'new'): NativeForm {
  const fields: Record<string, string> = {};
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input[name], textarea[name], select[name]').forEach(el => {
    if (el.disabled || ['button', 'submit', 'file', 'reset'].includes(el.getAttribute('type') || '')) return;
    if (el instanceof HTMLInputElement && ['checkbox', 'radio'].includes(el.type) && !el.checked) return;
    fields[el.name] = el.value;
  });
  const title = form.querySelector<HTMLInputElement | HTMLTextAreaElement>('#topic_title, input[name="title"], textarea[name="title"], input[name="topic_title"], textarea[name="topic_title"]');
  const textareas = Array.from(form.querySelectorAll<HTMLTextAreaElement>('textarea[name]')).filter(el => el !== title);
  const content = textareas.find(el => el.id === 'topic_content' || ['content', 'topic_content'].includes(el.name)) || textareas[0];
  if (!content) throw new Error('未识别到编辑表单，请在原站完成此操作。');
  const node = form.querySelector<HTMLInputElement | HTMLSelectElement>('[name="node_name"], [name="node"], #node_name');
  if (kind === 'new' && !title) throw new Error('未识别到发帖标题字段，请在原站发帖。');
  const action = absolute(form.getAttribute('action') || base, base);
  if (new URL(action).origin !== new URL(base).origin) throw new Error('表单提交地址不是当前 V2EX 域名。');
  return { action, method: (form.getAttribute('method') || 'POST').toUpperCase(), fields, contentKey: content.name,
    titleKey: title?.name, nodeKey: node?.name,
    nodes: Array.from(form.querySelectorAll<HTMLOptionElement>('select[name] option[value]')).filter(o => o.value).map(o => ({ label: o.textContent || o.value, url: o.value })) };
}

function action(el: Element | null, base: string, kind: 'favorite' | 'topic' | 'reply', id: string): Action | undefined {
  if (!el) return undefined;
  const label = text(el);
  const onclick = el.getAttribute('onclick') || '';
  const href = el.getAttribute('href') || '';
  const prompt = onclick.match(/confirm\(['"]([^'"]+)['"]\)/)?.[1] || el.getAttribute('data-confirm') || '';
  if (kind === 'favorite') {
    const path = href.startsWith('/') ? href : onclick.match(/(?:location(?:\.href)?\s*=|location\.(?:assign|replace)\()\s*['"]([^'"]+)['"]/)?.[1];
    if (!path || !/^\/(?:un)?favorite\/topic\/\d+/.test(path)) return undefined;
    return { url: absolute(path, base), method: 'GET', label, done: /取消|Unfavorite|Remove/i.test(label), prompt };
  }
  if (/感谢已|thanked/i.test(el.outerHTML) && !onclick.includes('thank')) return { url: '', method: 'POST', label, done: true, prompt };
  const call = onclick.match(/thank(?:Topic|Reply)\(\s*(\d+)/);
  const path = href.match(/^\/thank\/(?:topic|reply)\/\d+/);
  if (!call && !path) return undefined;
  if (call && call[1] !== id) return undefined;
  return { url: absolute(path ? href : `/thank/${kind}/${id}`, base), method: 'POST', label, done: false, prompt };
}

export function parseTopic(doc: Document, base: string): Topic {
  const id = new URL(base).pathname.match(/^\/t\/(\d+)/)?.[1];
  const header = doc.querySelector('#Main .header:has(h1)');
  if (!id || !header) throw new Error('话题无法读取，可能需要登录或已被删除。');
  const author = header.querySelector('small a[href^="/member/"], .gray a[href^="/member/"]');
  const node = header.querySelector('a[href^="/go/"]');
  const body = doc.querySelector('#Main .topic_content');
  const replyForm = Array.from(doc.querySelectorAll<HTMLFormElement>('#Main form')).find(f => f.querySelector('textarea[name]'));
  const favoriteEl = Array.from(doc.querySelectorAll('#Main a')).find(a => /\/(?:un)?favorite\/topic\//.test(a.getAttribute('href') || a.getAttribute('onclick') || ''));
  const thankEl = doc.querySelector('#topic_thank a, a[onclick*="thankTopic"], #topic_thank .topic_thanked');
  const messages = Array.from(doc.querySelectorAll('#Main .cell[id^="r_"]')).flatMap(cell => {
    const content = cell.querySelector('.reply_content');
    if (!content) return [];
    const replyId = cell.id.replace('r_', '');
    return [{ id: replyId, floor: text(cell.querySelector('.no')),
      author: member(cell.querySelector('strong a[href^="/member/"]')),
      avatar: image(cell.querySelector('img.avatar'), base),
      time: timestamp(cell.querySelector('.ago')), html: safeHTML(content.innerHTML, base),
      thank: action(cell.querySelector('a[onclick*="thankReply"], [id^="thank_area_"] a, [id^="thank_area_"].thanked'), base, 'reply', replyId),
    }];
  });
  const page = pagination(doc, base);
  const countText = Array.from(doc.querySelectorAll('#Main .cell')).map(c => text(c.querySelector('span.gray'))).find(t => /\d+\s*(?:replies|条回复)/i.test(t)) || '';
  const replies = Number(countText.match(/(\d+)\s*(?:replies|条回复)/i)?.[1]) || messages.length;
  const supplements = Array.from(doc.querySelectorAll('#Main .subtle')).map(el => ({
    label: text(el.querySelector('.fade, .gray')) || '补充内容',
    html: safeHTML(el.querySelector('.topic_content')?.innerHTML || el.innerHTML, base),
  }));
  return { id, url: base, title: text(header.querySelector('h1')), node: { label: text(node), url: node ? absolute(node.getAttribute('href')!, base) : base },
    author: member(author || header.querySelector('.fr a[href^="/member/"]')), avatar: image(header.querySelector('img.avatar'), base),
    time: timestamp(header.querySelector('small [title], .gray [title]')), html: safeHTML(body?.innerHTML || '', base),
    supplements, messages, replies, pagination: page, session: session(doc, base),
    replyForm: replyForm ? parseForm(replyForm, base, 'reply') : undefined,
    replyNotice: text(doc.querySelector('#reply-box .cell, #reply-box')),
    favorite: action(favoriteEl || null, base, 'favorite', id), thank: action(thankEl, base, 'topic', id) };
}

export function serverError(doc: Document): string {
  return text(doc.querySelector('#Main .problem, .problem, #Main .message.error, #Main .error'));
}
