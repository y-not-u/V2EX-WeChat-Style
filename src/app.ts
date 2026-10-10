import { marked } from 'marked';
import styles from './style.css';
import { loadPage, runAction, submitForm } from './api';
import { parseForm, parseList, parseTopic, safeHTML, session } from './parser';
import { draftKey, read, write } from './storage';
import { avatar, button, el, nativeLink, nativeURL } from './dom';
import { icon } from './icons';
import type { Action, Message, NativeForm, Pagination, Session, Topic, TopicList } from './types';

interface HistoryContext { v2wc: true; listURL: string; listScroll: number; chatScroll?: number }
const supportedList = (path: string) => path === '/' || /^\/go\/[^/]+\/?$/.test(path) || path === '/my/topics';
export const supportedRoute = (path: string) => supportedList(path) || /^\/t\/\d+\/?$/.test(path);
const homeTabs = ['技术', '创意', '好玩', 'Apple', '酷工作', '交易', '城市', '问与答', '最热', '全部'].map((label, i) => ({
  label, url: `/?tab=${['tech', 'creative', 'play', 'apple', 'jobs', 'deals', 'city', 'qna', 'hot', 'all'][i]}`,
}));

export class ChatApp {
  private host = el('div');
  private shadow = this.host.attachShadow({ mode: 'open' });
  private shell = el('main', 'app');
  private listPanel = el('section', 'list-panel');
  private topics = el('div', 'topics');
  private listPages = el('div', 'pagination');
  private context = el('span', 'context-title');
  private search = el('input', 'search');
  private chat = el('section', 'chat-panel');
  private splitter = el('div', 'panel-splitter');
  private preferredListWidth = read<number | null>('layout:list-width', null);
  private resizePointer?: { id: number; x: number; width: number };
  private chatScroll = el('div', 'chat-scroll');
  private rail = el('nav', 'rail');
  private list?: TopicList;
  private topic?: Topic;
  private user: Session;
  private listURL: string;
  private topicRequest?: AbortController;
  private listRequest?: AbortController;
  private navigating = false;
  private disposed = false;
  private pending = new Set<string>();
  private reply?: HTMLTextAreaElement;
  private popup?: HTMLElement;
  private drawer?: HTMLElement;
  private modal?: HTMLElement;
  private toastNode?: HTMLElement;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private scrollTimer?: ReturnType<typeof setTimeout>;
  private navVersion = 0;
  private refreshListButton = button('刷新话题列表', () => void this.loadList(this.listURL), 'mini', 'refresh');

  constructor(initial: TopicList | Topic, private restore: () => void) {
    this.user = initial.session;
    const stored = read(`context:${this.user.user || 'guest'}`, '/?tab=all');
    this.listURL = 'items' in initial ? initial.url : this.validListURL(stored);
    this.host.id = 'v2wc-root';
    const style = el('style'); style.textContent = styles;
    this.shadow.append(style, this.shell);
    this.shell.append(this.rail, this.listPanel, this.chat);
    this.listPanel.setAttribute('aria-label', '话题列表');
    this.chat.setAttribute('aria-label', '话题聊天');
    this.buildListPanel(); this.buildSplitter(); this.renderRail();
    if ('items' in initial) { this.applyList(initial); this.renderEmpty(); }
    else { this.topic = initial; this.renderTopic(initial); }
  }

  mount(): void {
    document.body.append(this.host);
    this.updatePanelWidth();
    window.addEventListener('resize', this.updatePanelWidth);
    history.replaceState(this.historyContext(), '', location.href);
    window.addEventListener('popstate', this.onPopState);
    window.addEventListener('hashchange', this.onHashChange);
    this.shadow.addEventListener('click', this.onContentLink);
    this.shadow.addEventListener('keydown', this.onEscape);
    this.topics.addEventListener('scroll', this.recordScroll, { passive: true });
    this.shell.addEventListener('click', event => {
      if (this.popup && !this.popup.contains(event.target as Node) && !(event.target as Element).closest('[data-menu]')) this.closePopup();
    });
    if (!this.list) void this.loadList(this.listURL);
    requestAnimationFrame(() => this.locateHash());
  }

  dispose(): void {
    this.disposed = true; this.topicRequest?.abort(); this.listRequest?.abort();
    clearTimeout(this.toastTimer);
    clearTimeout(this.scrollTimer);
    window.removeEventListener('resize', this.updatePanelWidth);
    window.removeEventListener('popstate', this.onPopState); window.removeEventListener('hashchange', this.onHashChange);
    this.host.remove();
  }

  private updatePanelWidth = (): void => {
    const available = this.shell.clientWidth - this.rail.getBoundingClientRect().width;
    const max = Math.max(240, available - 420);
    const fallback = Math.min(410, Math.max(320, this.shell.clientWidth * .2));
    const preferred = typeof this.preferredListWidth === 'number' && Number.isFinite(this.preferredListWidth) ? this.preferredListWidth : fallback;
    const width = Math.min(max, Math.max(240, preferred));
    this.shell.style.setProperty('--list-width', `${width}px`);
    this.splitter.setAttribute('aria-valuemin', '420');
    this.splitter.setAttribute('aria-valuemax', `${Math.round(available - 240)}`);
    this.splitter.setAttribute('aria-valuenow', `${Math.round(available - width)}`);
    this.splitter.setAttribute('aria-valuetext', `内容详情区宽度 ${Math.round(available - width)} 像素`);
  };

  private buildSplitter(): void {
    this.splitter.tabIndex = 0;
    this.splitter.setAttribute('role', 'separator');
    this.splitter.setAttribute('aria-orientation', 'vertical');
    this.splitter.setAttribute('aria-label', '调整内容详情区宽度');
    this.splitter.title = '左右拖动调整详情宽度，双击恢复默认；也可使用左右方向键';
    const setWidth = (width: number) => {
      this.preferredListWidth = width;
      this.updatePanelWidth();
      this.preferredListWidth = this.listPanel.getBoundingClientRect().width;
    };
    const reset = () => {
      this.preferredListWidth = null;
      write('layout:list-width', null);
      this.updatePanelWidth();
    };
    this.splitter.addEventListener('pointerdown', event => {
      if (event.button !== 0 || this.resizePointer) return;
      event.preventDefault();
      this.splitter.focus();
      this.resizePointer = { id: event.pointerId, x: event.clientX, width: this.listPanel.getBoundingClientRect().width };
      this.splitter.setPointerCapture(event.pointerId);
      this.shell.classList.add('resizing-panels');
    });
    this.splitter.addEventListener('pointermove', event => {
      if (this.resizePointer?.id === event.pointerId) setWidth(this.resizePointer.width + event.clientX - this.resizePointer.x);
    });
    const finish = (event: PointerEvent) => {
      if (this.resizePointer?.id !== event.pointerId) return;
      this.resizePointer = undefined;
      this.shell.classList.remove('resizing-panels');
      if (this.splitter.hasPointerCapture(event.pointerId)) this.splitter.releasePointerCapture(event.pointerId);
      write('layout:list-width', this.preferredListWidth);
    };
    this.splitter.addEventListener('pointerup', finish);
    this.splitter.addEventListener('pointercancel', finish);
    this.splitter.addEventListener('lostpointercapture', finish);
    this.splitter.addEventListener('dblclick', reset);
    this.splitter.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); reset(); }
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      setWidth(this.listPanel.getBoundingClientRect().width + (event.key === 'ArrowRight' ? 24 : -24));
      write('layout:list-width', this.preferredListWidth);
    });
    this.listPanel.append(this.splitter);
  }

  private validListURL(input: string): string {
    try { const url = new URL(input, location.origin); if (url.origin === location.origin && supportedList(url.pathname)) return url.href; } catch { /* ignore */ }
    return new URL('/?tab=all', location.origin).href;
  }

  private historyContext(): HistoryContext {
    return { v2wc: true, listURL: this.listURL, listScroll: this.topics.scrollTop, chatScroll: this.chatScroll.scrollTop };
  }
  private saveHistory(): void { history.replaceState(this.historyContext(), '', location.href); }
  private pushURL(url: string): void { this.saveHistory(); history.pushState(this.historyContext(), '', url); }

  private buildListPanel(): void {
    const head = el('header', 'list-head'); head.append(el('h1', '', 'V2EX'), button('发表新话题', () => void this.openNewTopic(), 'add', 'plus'));
    const searchWrap = el('div', 'search-wrap'); searchWrap.innerHTML = icon('search');
    this.search.type = 'search'; this.search.placeholder = '搜索'; this.search.setAttribute('aria-label', '筛选当前列表标题');
    this.search.addEventListener('input', () => this.renderList()); searchWrap.append(this.search);
    const contextRow = el('div', 'list-context'); contextRow.append(this.context, this.refreshListButton);
    this.listPanel.append(head, searchWrap, contextRow, this.topics, this.listPages);
  }

  private renderRail(): void {
    this.rail.replaceChildren(); this.rail.setAttribute('aria-label', '主导航');
    const brand = button('V2EX 首页', () => { this.closeDrawer(); void this.navigate('/?tab=all'); }, 'brand');
    const logo = el('img'); logo.src = `${location.origin}/static/icon-192.png`; logo.alt = 'V2EX'; brand.replaceChildren(logo);
    this.rail.append(brand,
      button('话题', () => { this.closeDrawer(); void this.navigate(new URL(this.listURL, location.origin).pathname === '/my/topics' ? '/?tab=all' : this.listURL); }, 'rail-button', 'chat'),
      this.railLink('通知', '/notifications', 'bell'),
      button('分类和节点', () => void this.openNodes(), 'rail-button', 'compass'),
      button('我的收藏', () => { this.closeDrawer(); void this.navigate('/my/topics'); }, 'rail-button', 'star'),
      this.railLink('账号设置', '/settings', 'user'), el('div', 'rail-space'),
      button('恢复原站界面', () => this.restore(), 'rail-button', 'exit'));
    const profile = this.railLink(this.user.user ? `个人资料：${this.user.user}` : '登录 V2EX', this.user.user ? `/member/${this.user.user}` : '/signin', 'user');
    profile.classList.add('rail-profile'); profile.replaceChildren(avatar(this.user.avatar, this.user.user || 'V'));
    this.rail.append(profile);
    this.updateRailSelection();
  }
  private updateRailSelection(): void {
    const selected = this.drawer ? '分类和节点' : new URL(this.listURL, location.origin).pathname === '/my/topics' ? '我的收藏' : '话题';
    for (const control of this.rail.querySelectorAll<HTMLElement>('.rail-button')) {
      const active = control.getAttribute('aria-label') === selected;
      control.classList.toggle('active', active);
      if (active) control.setAttribute('aria-current', 'true');
      else control.removeAttribute('aria-current');
    }
  }
  private railLink(label: string, url: string, symbol: string): HTMLAnchorElement {
    const link = nativeLink('', url, 'rail-button'); link.title = label; link.setAttribute('aria-label', label); link.innerHTML = icon(symbol); return link;
  }

  private applyList(list: TopicList): void {
    this.list = list; this.listURL = list.url;
    if (list.session.user !== this.user.user) { this.user = list.session; this.renderRail(); }
    this.updateRailSelection();
    write(`context:${this.user.user || 'guest'}`, this.listURL);
    this.context.textContent = (list.tabs.length ? list.tabs : homeTabs).find(t => this.isCurrentList(t.url))?.label || (list.url.includes('/my/topics') ? '我的收藏' : list.title === 'V2EX' ? '话题' : list.title);
    this.listPanel.querySelector('h1')!.title = this.context.textContent;
    this.renderList(); this.renderPagination(this.listPages, list.pagination, url => void this.navigate(url));
  }

  private renderList(): void {
    this.topics.replaceChildren();
    const query = this.search.value.trim().toLowerCase();
    const items = this.list?.items.filter(i => i.title.toLowerCase().includes(query)) || [];
    for (const item of items) {
      const topicURL = new URL(item.url); topicURL.hash = '';
      const row = button(item.title, () => void this.navigate(topicURL.href), `topic-row${item.id === this.topic?.id ? ' selected' : ''}`);
      row.setAttribute('aria-current', item.id === this.topic?.id ? 'true' : 'false'); row.dataset.topicId = item.id;
      const info = el('div', 'row-info'); const top = el('div', 'row-top');
      let time = item.time;
      const exact = time.match(/\b(\d{1,2}:\d{2})\b/); if (exact) time = exact[1];
      top.append(el('span', 'row-title', item.title), el('span', 'row-time', time));
      info.append(top, el('div', 'row-detail', [item.node.label, item.replies ? `${item.replies} 条回复` : '还没有回复', item.lastUser].filter(Boolean).join(' · ')));
      row.replaceChildren(avatar(item.avatar, item.author), info); this.topics.append(row);
    }
    if (!items.length) this.topics.append(el('div', 'list-empty', query ? '当前列表没有匹配的话题' : '这里还没有话题'));
  }

  private renderPagination(container: HTMLElement, pages: Pagination, go: (url: string) => void): void {
    container.replaceChildren(); container.hidden = pages.total <= 1;
    const urlFor = (page: number) => {
      const found = pages.links.find(p => Number(p.label) === page);
      if (found) return found.url;
      const url = new URL(container === this.listPages ? this.listURL : this.topic!.url); url.searchParams.set('p', String(page)); url.hash = ''; return url.href;
    };
    const prev = button('上一页', () => go(urlFor(pages.current - 1)), '', 'back'); prev.disabled = pages.current <= 1;
    const next = button('下一页', () => go(urlFor(pages.current + 1)), '', 'next'); next.disabled = pages.current >= pages.total;
    container.append(prev, el('span', '', `${pages.current} / ${pages.total}`), next);
  }

  private async loadList(url: string): Promise<void> {
    this.listRequest?.abort(); const controller = this.listRequest = new AbortController();
    this.refreshListButton.disabled = true;
    if (!this.list) this.topics.replaceChildren(el('div', 'loading', '正在读取话题…'));
    try {
      const page = await loadPage(url, controller.signal);
      if (controller.signal.aborted || this.disposed) return;
      this.applyList(parseList(page.doc, page.url));
    } catch (error) {
      if (controller.signal.aborted || this.disposed) return;
      this.toast(this.errorText(error), url, true);
      if (!this.list) this.topics.replaceChildren(el('div', 'list-empty', '列表加载失败，请刷新或查看原页面'));
    } finally { if (!controller.signal.aborted) this.refreshListButton.disabled = false; }
  }

  async navigate(input: string, historyMode: 'push' | 'pop' | 'replace' = 'push', scroll?: HistoryContext): Promise<void> {
    const url = new URL(input, location.origin);
    if (url.origin !== location.origin || !supportedRoute(url.pathname)) { window.open(nativeURL(url.href), '_blank', 'noopener'); return; }
    this.closePopup(); this.closeDrawer();
    const listScroll = this.topics.scrollTop;
    this.topicRequest?.abort(); this.listRequest?.abort();
    const controller = this.topicRequest = new AbortController();
    const version = ++this.navVersion;
    this.navigating = true; this.setComposerBusy(true);
    this.chat.setAttribute('aria-busy', 'true');
    if (!this.topic && supportedList(url.pathname)) this.context.textContent = '正在读取…';
    try {
      const page = await loadPage(url.href, controller.signal);
      if (controller.signal.aborted || this.disposed) return;
      if (supportedList(url.pathname)) {
        const list = parseList(page.doc, page.url);
        if (historyMode === 'push') this.pushURL(url.href);
        if (historyMode === 'replace') history.replaceState(this.historyContext(), '', url.href);
        this.topic = undefined; this.applyList(list); this.search.value = ''; this.renderList(); this.renderEmpty();
        document.title = `${list.title} - V2EX`;
      } else {
        const topic = parseTopic(page.doc, page.url);
        topic.url = url.href;
        if (historyMode === 'push') this.pushURL(url.href);
        if (historyMode === 'replace') history.replaceState(this.historyContext(), '', url.href);
        this.topic = topic; this.user = topic.session; this.renderRail(); this.renderTopic(topic); this.renderList();
        document.title = `${topic.title} - V2EX`;
        if (scroll && scroll.listURL !== this.listURL) await this.loadList(scroll.listURL);
      }
      this.topics.scrollTop = scroll?.listScroll ?? (supportedList(url.pathname) ? 0 : listScroll);
      this.chatScroll.scrollTop = scroll?.chatScroll || 0;
      this.locateHash();
      history.replaceState(this.historyContext(), '', location.href);
      if (!this.list) void this.loadList(this.listURL);
    } catch (error) {
      if (!controller.signal.aborted && !this.disposed) {
        if (historyMode === 'pop') { this.topic = undefined; this.renderEmpty('页面加载失败，请重试或查看原页面'); this.renderList(); }
        this.toast(this.errorText(error), url.href, true);
      }
    } finally {
      if (version === this.navVersion && !this.disposed) { this.navigating = false; this.chat.removeAttribute('aria-busy'); this.setComposerBusy(false); this.refreshListButton.disabled = false; }
    }
  }

  private renderEmpty(message = '从左侧选择一个话题'): void {
    this.chat.replaceChildren(); this.reply = undefined;
    const empty = el('div', 'empty'); empty.innerHTML = icon('chat'); empty.append(el('div', 'empty-brand', 'V2EX'), el('p', '', message));
    this.chat.append(empty);
  }

  private renderTopic(topic: Topic): void {
    this.chat.replaceChildren();
    const head = el('header', 'chat-head'); const heading = el('div', 'chat-heading');
    const subtitle = el('div', 'chat-subtitle'); const node = button(topic.node.label, () => void this.navigate(topic.node.url));
    subtitle.append(node, document.createTextNode(` · ${topic.replies} 条回复`));
    heading.append(el('h2', 'chat-title', topic.title), subtitle);
    const actions = el('div', 'head-actions');
    const more = button('话题操作', () => this.openTopicMenu(), 'icon-button', 'more'); more.dataset.menu = 'true'; actions.append(more);
    head.append(heading, actions);
    this.chatScroll = el('div', 'chat-scroll'); this.chatScroll.setAttribute('aria-label', '正文和回复');
    this.chatScroll.addEventListener('scroll', this.recordScroll, { passive: true });
    this.chatScroll.append(this.renderMessage({ id: `topic-${topic.id}`, floor: '', author: topic.author, avatar: topic.avatar, time: topic.time, html: topic.html || '<p>本话题没有正文</p>' }, true));
    for (const supplement of topic.supplements) {
      const message = this.renderMessage({ id: '', floor: '', author: topic.author, avatar: topic.avatar, time: '', html: supplement.html }, true);
      message.querySelector('.bubble')?.prepend(el('div', 'supplement-label', supplement.label)); this.chatScroll.append(message);
    }
    if (topic.pagination.current > 1) this.chatScroll.append(el('div', 'thread-note', `第 ${topic.pagination.current} 页回复`));
    for (const message of topic.messages) this.chatScroll.append(this.renderMessage(message));
    if (!topic.messages.length) this.chatScroll.append(el('div', 'thread-note', '还没有回复，聊两句吧'));
    const pages = el('div', 'pagination'); this.renderPagination(pages, topic.pagination, url => void this.navigate(url)); this.chatScroll.append(pages);
    this.chat.append(head, this.chatScroll, this.renderComposer(topic));
  }

  private renderMessage(message: Message, original = false): HTMLElement {
    const own = !original && this.user.user && message.author === this.user.user;
    const row = el('article', `message${own ? ' own' : ''}${original ? ' original' : ''}`); if (message.id) row.id = original ? message.id : `r_${message.id}`;
    const content = el('div', 'message-content'); const meta = el('div', 'message-meta');
    meta.append(button(message.author, () => this.mention(message.author), 'message-user'), el('span', 'message-time', message.time));
    const bubble = el('div', 'bubble'); const body = el('div', 'bubble-body'); body.innerHTML = message.html;
    body.querySelectorAll<HTMLImageElement>('img[src]').forEach(img => {
      if (img.closest('a') || img.classList.contains('emoji')) return;
      const link = el('a'); link.href = img.src; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.title = '查看原图';
      img.replaceWith(link); link.append(img);
    });
    body.querySelectorAll('table').forEach(table => { const wrap = el('div', 'table-scroll'); table.replaceWith(wrap); wrap.append(table); });
    bubble.append(body); const actions = el('div', 'message-actions');
    if (!original) {
      const url = new URL(this.topic!.url); url.hash = `reply${message.floor}`;
      const permalink = el('a', '', `#${message.floor}`); permalink.href = url.href;
      permalink.addEventListener('click', event => { event.preventDefault(); this.saveHistory(); history.pushState(this.historyContext(), '', url); this.locateHash(); });
      actions.append(permalink, button('回复', () => this.mention(message.author)));
      if (message.thank) {
        const thank = button(message.thank.done ? '已感谢' : '感谢', () => void this.performAction(message.thank!, thank, 'thank')); thank.disabled = message.thank.done; actions.append(thank);
      }
    }
    content.append(meta, bubble, actions); row.append(avatar(message.avatar, message.author), content); return row;
  }

  private renderComposer(topic: Topic): HTMLElement {
    const composer = el('footer', 'composer'); const toolbar = el('div', 'compose-toolbar'); const actions = el('div', 'compose-actions');
    this.reply = el('textarea', 'reply-input'); this.reply.rows = 4; this.reply.setAttribute('aria-label', '回复内容');
    const available = Boolean(topic.replyForm); this.reply.disabled = !available || this.pending.has(`reply:${topic.id}`);
    this.reply.value = read(draftKey(this.user.user, topic.id), '');
    const send = button('发送', () => void this.sendReply(), 'send'); send.dataset.send = 'true'; send.disabled = this.reply.disabled || !this.reply.value.trim();
    const emoji = button('表情', () => {
      const wasOpen = this.popup?.classList.contains('emoji-picker');
      this.closePopup();
      if (wasOpen || !this.reply || this.reply.disabled) return;
      const picker = this.popup = el('div', 'emoji-picker');
      picker.setAttribute('role', 'dialog'); picker.setAttribute('aria-label', '选择表情');
      for (const face of ['😀', '😄', '😁', '😆', '😂', '🤣', '😊', '😉', '😍', '🥰', '😘', '😎', '🤔', '😅', '🥲', '😭', '😮', '😳', '🙃', '😴', '😤', '🙏', '👍', '👎', '👏', '🎉', '❤️', '💔', '🔥', '☕', '🍻', '👀']) {
        picker.append(button(face, () => {
          if (!this.reply || this.reply.disabled) return;
          this.reply.setRangeText(face, this.reply.selectionStart, this.reply.selectionEnd, 'end');
          this.reply.dispatchEvent(new Event('input')); this.closePopup(); this.reply.focus();
        }, 'emoji-option'));
      }
      composer.append(picker); emoji.setAttribute('aria-expanded', 'true');
      picker.querySelector<HTMLButtonElement>('button')?.focus();
    }, 'icon-button emoji-toggle', 'smile');
    emoji.dataset.menu = 'true'; emoji.disabled = this.reply.disabled;
    emoji.setAttribute('aria-haspopup', 'dialog'); emoji.setAttribute('aria-expanded', 'false');
    this.reply.addEventListener('input', () => { this.saveDraft(); send.disabled = this.navigating || this.pending.has(`reply:${topic.id}`) || !this.reply!.value.trim(); this.resizeReply(); });
    this.reply.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !event.isComposing) { event.preventDefault(); void this.sendReply(); } });
    toolbar.append(emoji); actions.append(send); composer.append(toolbar, this.reply, actions);
    if (!available) {
      const note = el('div', 'compose-note', this.user.user ? topic.replyNotice || '此话题暂时无法回复' : '登录后即可回复');
      note.append(nativeLink(this.user.user ? '查看原页面' : '登录 V2EX', this.user.user ? topic.url : `/signin?next=${encodeURIComponent(new URL(topic.url).pathname)}`)); composer.append(note);
    }
    requestAnimationFrame(() => this.resizeReply()); return composer;
  }
  private resizeReply(): void { if (this.reply) { this.reply.style.height = 'auto'; this.reply.style.height = `${Math.min(180, Math.max(104, this.reply.scrollHeight))}px`; } }
  private saveDraft(): void { if (this.topic && this.reply) write(draftKey(this.user.user, this.topic.id), this.reply.value); }
  private setComposerBusy(busy: boolean): void {
    const send = this.chat.querySelector<HTMLButtonElement>('[data-send]');
    if (send) send.disabled = busy || !this.topic?.replyForm || !this.reply?.value.trim() || this.pending.has(`reply:${this.topic?.id}`);
    if (this.reply) this.reply.disabled = busy || !this.topic?.replyForm || this.pending.has(`reply:${this.topic?.id}`);
    const emoji = this.chat.querySelector<HTMLButtonElement>('.emoji-toggle');
    if (emoji) emoji.disabled = Boolean(this.reply?.disabled);
    if (busy && this.popup?.classList.contains('emoji-picker')) this.closePopup();
  }
  private mention(user: string): void {
    if (!this.reply || this.reply.disabled) { this.toast('当前话题无法回复，请先登录或查看原页面', this.topic?.url, true); return; }
    this.reply.value += `${this.reply.value && !this.reply.value.endsWith('\n') ? '\n' : ''}@${user} `;
    this.reply.dispatchEvent(new Event('input')); this.reply.focus(); this.reply.setSelectionRange(this.reply.value.length, this.reply.value.length);
  }

  private async sendReply(): Promise<void> {
    const topic = this.topic;
    if (!topic?.replyForm || !this.reply?.value.trim() || this.navigating) return;
    const key = `reply:${topic.id}`; if (this.pending.has(key)) return;
    const content = this.reply.value; const version = this.navVersion; const user = this.user.user;
    this.saveDraft(); this.pending.add(key); this.setComposerBusy(true);
    try {
      // Reload the form to pick up permission changes and hidden fields before submitting.
      const fresh = await loadPage(topic.url);
      const latest = parseTopic(fresh.doc, fresh.url);
      if (latest.session.user !== user) throw new Error('登录账号已变化，请刷新后再回复。');
      if (!latest.replyForm) throw new Error('当前话题已无法回复，草稿已保留。');
      const page = await submitForm(latest.replyForm, { [latest.replyForm.contentKey]: content });
      const result = parseTopic(page.doc, page.url);
      if (result.id !== topic.id || result.replyForm?.fields[result.replyForm.contentKey]?.trim() === content.trim()) throw new Error('服务器未确认回复成功，草稿已保留，请查看原页面。');
      write(draftKey(user, topic.id), '');
      if (!this.disposed && version === this.navVersion) {
        this.topic = result; history.replaceState(this.historyContext(), '', result.url); this.renderTopic(result); this.chatScroll.scrollTop = this.chatScroll.scrollHeight;
        const item = this.list?.items.find(i => i.id === result.id); if (item) { item.replies = result.replies; item.lastUser = user; this.renderList(); }
        this.toast('回复已发送');
      }
    } catch (error) { if (!this.disposed) this.toast(this.errorText(error), topic.url, true); }
    finally { this.pending.delete(key); if (!this.disposed) this.setComposerBusy(this.navigating); }
  }

  private async performAction(action: Action, control: HTMLButtonElement, kind: 'favorite' | 'thank'): Promise<void> {
    const key = action.url; if (this.pending.has(key) || this.navigating) return;
    if (kind === 'thank' && !window.confirm(action.prompt || '感谢会消耗 V2EX 金币（通常为 10 铜币），是否继续？')) return;
    if (kind === 'favorite' && action.prompt && !window.confirm(action.prompt)) return;
    this.pending.add(key); control.disabled = true;
    const topic = this.topic; const version = this.navVersion;
    try {
      await runAction(action);
      if (this.disposed) return;
      if (kind === 'thank') {
        action.done = true; control.textContent = '已感谢'; control.setAttribute('aria-label', '已感谢'); control.title = '已感谢'; this.toast('感谢已发送');
      }
      else if (topic && version === this.navVersion) {
        const page = await loadPage(topic.url); const updated = parseTopic(page.doc, page.url);
        if (!updated.favorite || updated.favorite.done === action.done) throw new Error('收藏状态尚未确认，请在原站检查。');
        this.topic = updated; this.closePopup(); this.toast(updated.favorite.done ? '已收藏话题' : '已取消收藏');
      }
    } catch (error) { if (!this.disposed) this.toast(this.errorText(error), topic?.url, true); }
    finally { this.pending.delete(key); if (!action.done || kind === 'favorite') control.disabled = false; }
  }

  private openTopicMenu(): void {
    if (this.popup) { this.closePopup(); return; }
    const topic = this.topic; if (!topic) return;
    const popup = this.popup = el('div', 'popup'); popup.setAttribute('role', 'menu');
    if (topic.favorite) {
      const action = topic.favorite;
      const control = button(action.done ? '取消收藏' : '收藏话题', () => void this.performAction(action, control, 'favorite')); popup.append(control);
    }
    if (topic.thank) {
      const action = topic.thank;
      const control = button(action.done ? '已感谢作者' : '感谢作者', () => void this.performAction(action, control, 'thank')); control.disabled = action.done; popup.append(control);
    }
    popup.append(button('刷新话题', () => void this.navigate(topic.url, 'replace')), nativeLink('查看原页面', topic.url));
    this.chat.append(popup); popup.querySelector<HTMLButtonElement>('button')?.focus();
  }
  private closePopup(): void {
    this.popup?.remove(); this.popup = undefined;
    this.chat.querySelector('.emoji-toggle')?.setAttribute('aria-expanded', 'false');
  }
  private closeDrawer(): void { this.drawer?.remove(); this.drawer = undefined; this.updateRailSelection(); }

  private isCurrentList(input: string): boolean {
    const target = new URL(input, location.origin); const current = new URL(this.listURL, location.origin);
    const currentTab = this.list?.currentTab ? new URL(this.list.currentTab, location.origin).searchParams.get('tab') : current.searchParams.get('tab');
    return target.pathname.replace(/\/$/, '') === current.pathname.replace(/\/$/, '') &&
      (target.pathname !== '/' || (target.searchParams.get('tab') || 'all') === (currentTab || 'all'));
  }

  private async openNodes(): Promise<void> {
    if (this.drawer) { this.closeDrawer(); return; }
    const drawer = this.drawer = el('aside', 'drawer'); drawer.setAttribute('aria-label', '分类和节点');
    this.updateRailSelection();
    const head = el('header', 'drawer-head'); head.append(el('h2', '', '分类和节点'), button('关闭分类', () => this.closeDrawer(), 'icon-button', 'close'));
    const body = el('div', 'drawer-body');
    const item = (label: string, url: string) => {
      const selected = this.isCurrentList(url);
      const control = button(label, () => void this.navigate(url), `drawer-item${selected ? ' selected' : ''}`);
      if (selected) control.setAttribute('aria-current', 'true');
      return control;
    };
    body.append(el('div', 'drawer-section', '分类'));
    for (const tab of this.list?.tabs.length ? this.list.tabs : homeTabs) body.append(item(tab.label, tab.url));
    body.append(el('div', 'drawer-section', '节点'));
    const search = el('input', 'drawer-search'); search.placeholder = '搜索节点'; search.setAttribute('aria-label', '搜索节点'); body.append(search);
    const nodes = el('div'); body.append(nodes); drawer.append(head, body); this.shell.append(drawer);
    const initial = this.list?.nodes || [];
    let all = initial.map(n => ({ name: new URL(n.url).pathname.split('/')[2], title: n.label }));
    const render = () => {
      nodes.replaceChildren(); const q = search.value.toLowerCase();
      for (const n of all.filter(n => `${n.name} ${n.title}`.toLowerCase().includes(q))) nodes.append(item(n.title, `/go/${n.name}`));
    }; search.addEventListener('input', render); render();
    try {
      const response = await fetch('/api/nodes/list.json?fields=name,title&sort_by=topics&reverse=1', { credentials: 'same-origin' });
      if (!response.ok) throw new Error('节点列表暂时不可用');
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('节点列表格式无法识别');
      all = data.filter(n => typeof n.name === 'string' && /^[a-zA-Z0-9_-]+$/.test(n.name) && typeof n.title === 'string');
      if (this.drawer === drawer) render();
    } catch { if (this.drawer === drawer) nodes.append(nativeLink('在原站浏览全部节点', '/planes', 'drawer-item')); }
  }

  private async openNewTopic(): Promise<void> {
    if (this.modal) return;
    const overlay = this.modal = el('div', 'modal-overlay');
    const modal = el('section', 'modal'); modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', '发表新话题');
    const head = el('header', 'modal-head'); const close = () => {
      if (this.pending.has('new')) return;
      this.modal?.remove(); this.modal = undefined; this.listPanel.querySelector<HTMLButtonElement>('.add')?.focus();
    };
    head.append(el('h2', '', '发表新话题'), button('关闭发帖', close, 'icon-button', 'close'));
    const body = el('div', 'modal-body'); body.append(el('div', 'loading', '正在读取发帖表单…'));
    modal.append(head, body); overlay.append(modal); this.shell.append(overlay);
    overlay.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, textarea, a[href]')).filter(n => !n.hidden);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && this.shadow.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && this.shadow.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
    try {
      const page = await loadPage('/new');
      if (this.modal !== overlay || this.disposed) return;
      const formEl = Array.from(page.doc.querySelectorAll<HTMLFormElement>('#Main form')).find(f => f.querySelector('textarea[name]'));
      if (!formEl) throw new Error('暂时无法发帖，请在原站检查账号权限。');
      const form = parseForm(formEl, page.url, 'new');
      body.replaceChildren(); this.buildNewForm(form, page.url, body, modal, close);
    } catch (error) {
      if (this.modal !== overlay || this.disposed) return;
      body.replaceChildren(el('p', 'modal-error', this.errorText(error)), nativeLink('在原站发帖或登录', '/new'));
    }
  }

  private buildNewForm(form: NativeForm, formURL: string, body: HTMLElement, modal: HTMLElement, close: () => void): void {
    const user = this.user.user;
    const draft = read(draftKey(user, 'new'), { title: '', node: '', content: '' });
    const field = (label: string, input: HTMLElement) => { const wrap = el('label', 'field', label); wrap.append(input); body.append(wrap); };
    const title = el('input'); title.value = draft.title; title.required = true; title.placeholder = '话题标题'; field('标题', title);
    const node = el('input'); node.value = draft.node || form.fields[form.nodeKey || ''] || ''; node.placeholder = '节点英文名，例如 create / programmer';
    const datalist = el('datalist'); datalist.id = 'new-node-options'; node.setAttribute('list', datalist.id);
    for (const option of form.nodes) { const item = el('option'); item.value = option.url; item.label = option.label; datalist.append(item); }
    if (form.nodeKey) { field('节点', node); body.append(datalist); }
    const content = el('textarea'); content.value = draft.content; content.placeholder = '正文，支持 Markdown'; field('正文', content);
    const preview = el('div', 'preview bubble-body'); preview.hidden = true; const error = el('p', 'modal-error'); error.setAttribute('role', 'alert'); body.append(preview, error);
    const save = () => write(draftKey(user, 'new'), { title: title.value, node: node.value, content: content.value });
    const previewContent = () => { preview.innerHTML = safeHTML(marked.parse(content.value, { async: false }), formURL); };
    for (const input of [title, node, content]) input.addEventListener('input', () => { save(); if (!preview.hidden) previewContent(); });
    const foot = el('footer', 'modal-foot');
    const publish = button('发表', () => { void send(); }, 'send');
    foot.append(nativeLink('原站编辑器', '/new'), button('预览', () => { preview.hidden = !preview.hidden; if (!preview.hidden) previewContent(); }, 'secondary'), button('取消', close, 'secondary'), publish);
    modal.append(foot); title.focus();
    const send = async () => {
      if (this.pending.has('new')) return;
      if (!title.value.trim()) { error.textContent = '请填写标题'; title.focus(); return; }
      if (form.nodeKey && !node.value.trim()) { error.textContent = '请选择节点'; node.focus(); return; }
      save(); this.pending.add('new'); publish.disabled = true; error.textContent = '';
      for (const input of [title, node, content]) input.disabled = true;
      try {
        const fresh = await loadPage('/new');
        if (session(fresh.doc, fresh.url).user !== user) throw new Error('登录账号已变化，请刷新后再发帖。');
        const freshFormEl = Array.from(fresh.doc.querySelectorAll<HTMLFormElement>('#Main form')).find(f => f.querySelector('textarea[name]'));
        if (!freshFormEl) throw new Error('发帖权限或表单已变化，草稿已保留。');
        const freshForm = parseForm(freshFormEl, fresh.url, 'new');
        const values = { [freshForm.titleKey!]: title.value, [freshForm.contentKey]: content.value,
          ...(freshForm.nodeKey ? { [freshForm.nodeKey]: node.value } : {}) };
        const result = await submitForm(freshForm, values);
        if (!/^\/t\/\d+/.test(new URL(result.url).pathname)) throw new Error('服务器未确认发帖成功，请在原站检查。');
        parseTopic(result.doc, result.url);
        write(draftKey(user, 'new'), { title: '', node: '', content: '' });
        this.pending.delete('new'); close();
        await this.navigate(result.url); this.toast('话题已发表');
      } catch (problem) { error.textContent = this.errorText(problem); }
      finally { this.pending.delete('new'); publish.disabled = false; for (const input of [title, node, content]) input.disabled = false; }
    };
    if (!form.nodes.length && form.nodeKey) void fetch('/api/nodes/list.json?fields=name,title&sort_by=topics&reverse=1').then(r => r.json()).then(data => {
      if (!Array.isArray(data)) return;
      for (const n of data) if (typeof n.name === 'string' && typeof n.title === 'string') { const option = el('option'); option.value = n.name; option.label = n.title; datalist.append(option); }
    }).catch(() => { /* A node name can still be entered manually. */ });
  }

  private locateHash(): void {
    if (!this.topic) return;
    const hash = location.hash;
    let id = hash.match(/^#r_(\d+)$/)?.[1];
    const floor = hash.match(/^#reply(\d+)$/)?.[1];
    if (floor) id = this.topic.messages.find(m => m.floor === floor)?.id;
    if (floor && !id && this.topic.pagination.total > 1) {
      const firstFloor = Number(this.topic.messages[0]?.floor);
      const pageSize = this.topic.pagination.current > 1 && firstFloor > 1
        ? Math.round((firstFloor - 1) / (this.topic.pagination.current - 1)) : this.topic.messages.length;
      const targetPage = pageSize ? Math.ceil(Number(floor) / pageSize) : 0;
      if (targetPage > 0 && targetPage <= this.topic.pagination.total && targetPage !== this.topic.pagination.current) {
        const url = new URL(this.topic.url); url.searchParams.set('p', String(targetPage)); url.hash = hash;
        void this.navigate(url.href, 'replace'); return;
      }
    }
    this.chatScroll.querySelectorAll('.highlight').forEach(n => n.classList.remove('highlight'));
    if (id) { const row = this.shadow.getElementById(`r_${id}`); if (row) { row.classList.add('highlight'); row.scrollIntoView({ block: 'center' }); } }
  }

  private onPopState = (event: PopStateEvent): void => {
    const state = event.state as HistoryContext | undefined;
    if (!supportedRoute(location.pathname)) { location.reload(); return; }
    void this.navigate(location.href, 'pop', state?.v2wc ? state : undefined);
  };
  private onHashChange = (): void => this.locateHash();
  private recordScroll = (): void => {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => { if (!this.disposed && !this.navigating) this.saveHistory(); }, 250);
  };
  private onContentLink = (event: Event): void => {
    const mouse = event as MouseEvent;
    if (mouse.ctrlKey || mouse.metaKey || mouse.shiftKey || mouse.altKey || mouse.button !== 0 || event.defaultPrevented) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('.bubble-body a[href]'); if (!anchor) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin || !supportedRoute(url.pathname)) return;
    event.preventDefault(); void this.navigate(url.href);
  };
  private onEscape = (event: Event): void => {
    if ((event as KeyboardEvent).key !== 'Escape') return;
    if (this.modal && !this.pending.has('new')) { this.modal.remove(); this.modal = undefined; this.listPanel.querySelector<HTMLButtonElement>('.add')?.focus(); }
    else { this.closeDrawer(); this.closePopup(); }
  };
  private errorText(error: unknown): string { return error instanceof Error ? error.message : '操作失败，请查看原页面。'; }
  private toast(message: string, url?: string, persistent = false): void {
    this.toastNode?.remove(); clearTimeout(this.toastTimer);
    const node = this.toastNode = el('div', 'toast'); node.setAttribute('role', 'status'); node.setAttribute('aria-live', 'polite');
    node.append(el('span', 'toast-message', message));
    if (url) node.append(nativeLink('查看原页面', url));
    if (persistent) node.append(button('关闭提示', () => node.remove(), 'icon-button', 'close'));
    this.chat.append(node); if (!persistent) this.toastTimer = setTimeout(() => node.remove(), 3000);
  }
}
