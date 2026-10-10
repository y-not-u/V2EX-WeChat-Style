import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { listHTML, newHTML, titles, topicHTML, wrapper } from './fixtures';

const script = readFileSync('v2ex-wechat.user.js', 'utf8');
const origin = 'https://www.v2ex.com';
interface State { loggedIn: boolean; favorite: boolean; submitted: string; replyError: string; newError: string; locked: boolean; malicious: boolean; writes: { url: string; method: string; body: string }[]; delay: number; tokenError: boolean }
async function setup(page: Page, overrides: Partial<State> = {}): Promise<State> {
  const state: State = { loggedIn: true, favorite: false, submitted: '', replyError: '', newError: '', locked: false, malicious: false, writes: [], delay: 0, tokenError: false, ...overrides };
  await page.addInitScript({ content: `
    window.GM_getValue = (key, fallback) => { const raw = localStorage.getItem('gm:' + key); return raw === null ? fallback : JSON.parse(raw); };
    window.GM_setValue = (key, value) => localStorage.setItem('gm:' + key, JSON.stringify(value));
    window.GM_registerMenuCommand = (label, fn) => { window.testMenus ||= {}; window.testMenus[label] = fn; };
    // Playwright routes only the first fetch redirect. Simulate the final URL without any live request.
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const finalURL = response.headers.get('x-test-url');
      if (finalURL) Object.defineProperty(response, 'url', { value: finalURL });
      return response;
    };
    ${script}` });
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const html = async (body: string) => route.fulfill({ contentType: 'text/html; charset=utf-8', body });
    if (url.pathname.startsWith('/avatar/') || url.pathname === '/static/icon-192.png') {
      const colors = ['#75a05a', '#7ac1af', '#ddb26c', '#8198bc']; const index = url.pathname.length % colors.length;
      return route.fulfill({ contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" rx="5" fill="${colors[index]}"/><text x="30" y="39" text-anchor="middle" font-family="sans-serif" font-size="28" fill="white">${url.pathname.includes('tester') ? 'T' : 'V'}</text></svg>` });
    }
    if (url.pathname === '/poll_once') return route.fulfill({ body: state.tokenError ? '<html>signin</html>' : '54321' });
    if (url.pathname.startsWith('/api/nodes/')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ name: 'create', title: '分享创造' }, { name: 'programmer', title: '程序员' }]) });
    if (/^\/(?:un)?favorite\/topic\//.test(url.pathname) || url.pathname.startsWith('/thank/')) {
      state.writes.push({ url: url.href, method, body: route.request().postData() || '' });
      if (url.pathname.startsWith('/thank/')) return route.fulfill({ contentType: 'application/json', body: '{"success":true,"once":54322}' });
      state.favorite = !url.pathname.startsWith('/unfavorite/'); return html(topicHTML({ favorite: state.favorite }));
    }
    if (url.pathname === '/new') {
      if (!state.loggedIn) return route.fulfill({ contentType: 'text/html', body: wrapper('<div class="header">登录</div>', false), headers: { 'x-test-url': `${origin}/signin` } });
      if (method === 'POST') {
        state.writes.push({ url: url.href, method, body: route.request().postData() || '' });
        if (state.newError) return html(wrapper(`<div class="problem">${state.newError}</div>`));
        return route.fulfill({ contentType: 'text/html', body: topicHTML({ id: 7 }), headers: { 'x-test-url': `${origin}/t/7` } });
      }
      return html(newHTML());
    }
    if (/^\/t\/\d+$/.test(url.pathname)) {
      const id = Number(url.pathname.split('/')[2]);
      if (method === 'POST') {
        state.writes.push({ url: url.href, method, body: route.request().postData() || '' });
        if (state.delay) await new Promise(resolve => setTimeout(resolve, state.delay));
        const content = new URLSearchParams(route.request().postData() || '').get('content') || '';
        if (state.replyError) return html(topicHTML({ id, submitted: content, error: state.replyError }));
        state.submitted = content;
        return html(topicHTML({ id, submitted: content }));
      }
      if (state.delay && id === 2) await new Promise(resolve => setTimeout(resolve, state.delay));
      return html(topicHTML({ id, page: Number(url.searchParams.get('p')) || 1, loggedIn: state.loggedIn, favorite: state.favorite, submitted: state.submitted, locked: state.locked, malicious: state.malicious }));
    }
    if (url.pathname === '/my/topics' && !state.loggedIn) return route.fulfill({ contentType: 'text/html', body: wrapper('<div class="header">登录</div>', false), headers: { 'x-test-url': `${origin}/signin` } });
    if (url.pathname === '/' || url.pathname.startsWith('/go/') || url.pathname === '/my/topics') return html(listHTML({ node: url.pathname.startsWith('/go/'), page: Number(url.searchParams.get('p')) || 1, loggedIn: state.loggedIn, favorites: url.pathname === '/my/topics' }));
    if (url.pathname === '/signin') return html(wrapper('<div class="header">登录 V2EX</div>', false));
    return route.fulfill({ status: 404, body: '' });
  });
  return state;
}
const root = (page: Page) => page.locator('#v2wc-root');
const chatTitle = (page: Page) => root(page).locator('.chat-title');
async function openTopic(page: Page, id = 1): Promise<void> {
  await root(page).locator(`[data-topic-id="${id}"]`).click();
  await expect(chatTitle(page)).toHaveText(titles[id - 1]);
  await expect(root(page).getByRole('textbox', { name: '回复内容' })).toBeEnabled();
}

test('三栏、列表筛选、正文、附言、气泡与历史导航', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await setup(page); await page.goto(origin);
  await expect(root(page).getByText('从左侧选择一个话题')).toBeVisible();
  expect(await root(page).locator('.topic-row').first().evaluate(row => [...row.childNodes].filter(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()).length)).toBe(0);
  const search = root(page).getByRole('searchbox'); await search.fill('微信');
  await expect(root(page).locator('.topic-row')).toHaveCount(1); await search.fill('');
  await openTopic(page); await expect(page).toHaveURL(`${origin}/t/1`);
  await expect(root(page).locator('.message')).toHaveCount(6);
  await expect(root(page).locator('.own .bubble')).toHaveCSS('background-color', 'rgb(149, 236, 105)');
  const own = root(page).locator('.own').first();
  const name = own.locator('.message-user');
  const time = own.locator('.message-time');
  const nameBox = await name.boundingBox();
  const timeBox = await time.boundingBox();
  const metaBox = await own.locator('.message-meta').boundingBox();
  expect(nameBox).not.toBeNull(); expect(timeBox).not.toBeNull(); expect(metaBox).not.toBeNull();
  expect(timeBox!.x + timeBox!.width).toBeLessThanOrEqual(nameBox!.x);
  expect(Math.abs(nameBox!.x + nameBox!.width - metaBox!.x - metaBox!.width)).toBeLessThan(2);
  await own.hover(); await expect(time).toHaveCSS('opacity', '1');
  expect((await name.boundingBox())!.x).toBe(nameBox!.x);
  await page.screenshot({ path: '/tmp/v2ex-own-message-meta-fixed.png' });
  await expect(root(page).getByText('补充：支持 Ctrl+Enter 发送回复。')).toBeVisible();
  await root(page).locator('[data-topic-id="2"]').click(); await expect(chatTitle(page)).toHaveText(titles[1]);
  await page.goBack(); await expect(chatTitle(page)).toHaveText(titles[0]);
  await page.goForward(); await expect(chatTitle(page)).toHaveText(titles[1]);
  expect(errors).toEqual([]);
});

test('正文和回复优先显示各自的完整时间，无完整时间时保留原文', async ({ page }) => {
  await setup(page);
  const replyTimes = ['2025-12-25 09:12:03 +08:00', '2025-12-25 10:45:56 +08:00', '', '未知时间'];
  let index = 0;
  const html = topicHTML()
    .replace('<span title="2026-10-10">10:49</span>', '<span title="2025-12-25 08:30:00 +08:00">2025年12月25日</span>')
    .replace(/<span class="ago">10:50<\/span>/g, () => {
      const value = replyTimes[index++];
      return `<span class="ago"${value ? ` title="${value}"` : ''}>${value && value !== '未知时间' ? '2025年12月25日' : '刚刚'}</span>`;
    });
  await page.route(`${origin}/t/1`, route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
  await page.goto(`${origin}/t/1`);
  await expect(root(page).locator('.message.original .message-time').first()).toHaveText('2025-12-25 08:30:00');
  await expect(root(page).locator('#r_100 .message-time')).toHaveText('2025-12-25 09:12:03');
  await expect(root(page).locator('#r_101 .message-time')).toHaveText('2025-12-25 10:45:56');
  await expect(root(page).locator('#r_102 .message-time')).toHaveText('刚刚');
  await expect(root(page).locator('#r_103 .message-time')).toHaveText('刚刚');
});

test('列表话题带回复锚点时仍从正文顶部打开，切换话题重置滚动', async ({ page }) => {
  await setup(page);
  await page.route(`${origin}/`, route => route.fulfill({ contentType: 'text/html', body: listHTML().replace(/href="\/t\/(\d+)"/g, 'href="/t/$1#reply4"') }));
  await page.goto(origin);
  await openTopic(page);
  await expect(page).toHaveURL(`${origin}/t/1`);
  const scroll = root(page).locator('.chat-scroll');
  await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(0);
  await scroll.evaluate(el => { el.scrollTop = el.scrollHeight; });
  expect(await scroll.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await openTopic(page, 2);
  await expect(page).toHaveURL(`${origin}/t/2`);
  await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(0);
  await expect(root(page).locator('.message.original').first()).toBeVisible();
});

test('直接访问楼层、@、草稿按话题保存、Ctrl+Enter 发送且隐藏字段保留', async ({ page }) => {
  const state = await setup(page); await page.goto(`${origin}/t/1#reply3`);
  await expect(root(page).locator('#r_102')).toHaveClass(/highlight/);
  await root(page).locator('#r_100 .message-user').click();
  const input = root(page).getByRole('textbox', { name: '回复内容' }); await expect(input).toHaveValue('@maocat ');
  await input.fill('一条测试回复');
  await openTopic(page, 2); await expect(input).toHaveValue('');
  await openTopic(page, 1); await expect(input).toHaveValue('一条测试回复');
  await input.press('Control+Enter'); await expect(root(page).getByText('回复已发送')).toBeVisible();
  expect(state.writes).toHaveLength(1);
  const fields = new URLSearchParams(state.writes[0].body);
  expect(fields.get('content')).toBe('一条测试回复'); expect(fields.get('once')).toBe('54321'); expect(fields.get('hidden_field')).toBe('preserved');
  await expect(input).toHaveValue(''); await expect(root(page).locator('#r_999 .bubble')).toHaveText('一条测试回复');
});

test('提交失败保留草稿、错误提示和原站入口', async ({ page }) => {
  const state = await setup(page, { replyError: '回复过于频繁，请稍后再试' }); await page.goto(`${origin}/t/1`);
  const input = root(page).getByRole('textbox', { name: '回复内容' }); await input.fill('保留这条回复');
  await root(page).getByRole('button', { name: '发送', exact: true }).click();
  await expect(root(page).getByRole('status')).toContainText('回复过于频繁');
  await expect(input).toHaveValue('保留这条回复'); await expect(input).toBeEnabled();
  expect(state.writes).toHaveLength(1);
  await expect(root(page).getByRole('status').getByRole('link', { name: '查看原页面' })).toHaveAttribute('href', /v2wc=off/);
  await page.reload(); await expect(input).toHaveValue('保留这条回复');
});

test('重复发送被阻止', async ({ page }) => {
  const state = await setup(page, { delay: 250 }); await page.goto(`${origin}/t/1`);
  const input = root(page).getByRole('textbox', { name: '回复内容' }); await input.fill('只发送一次');
  await input.press('Control+Enter'); await page.keyboard.press('Control+Enter');
  await expect(root(page).getByText('回复已发送')).toBeVisible(); expect(state.writes).toHaveLength(1);
  const toast = root(page).getByRole('status');
  await expect(toast.getByRole('button', { name: '关闭提示' })).toHaveCount(0);
  await expect(toast).toHaveCount(0, { timeout: 6000 });
});

test('收藏、取消收藏、感谢确认与令牌刷新', async ({ page }) => {
  const state = await setup(page); await page.goto(`${origin}/t/1`);
  await root(page).getByRole('button', { name: '话题操作' }).click(); await root(page).getByRole('button', { name: '收藏话题' }).click();
  await expect(root(page).getByText('已收藏话题')).toBeVisible(); expect(state.favorite).toBe(true);
  await root(page).getByRole('button', { name: '话题操作' }).click(); await root(page).getByRole('button', { name: '取消收藏' }).click();
  await expect(root(page).getByText('已取消收藏', { exact: true })).toBeVisible(); expect(state.favorite).toBe(false);
  page.once('dialog', d => d.dismiss()); await root(page).locator('#r_100').hover(); await root(page).locator('#r_100').getByRole('button', { name: '感谢', exact: true }).click();
  expect(state.writes).toHaveLength(2);
  page.once('dialog', d => d.accept()); await root(page).locator('#r_100').getByRole('button', { name: '感谢', exact: true }).click();
  await expect(root(page).locator('#r_100').getByRole('button', { name: '已感谢' })).toBeDisabled();
  expect(state.writes).toHaveLength(3); expect(state.writes[2].url).toContain('once=54321');
});

test('新话题面板：预览、校验、失败草稿、成功跳转', async ({ page }) => {
  const state = await setup(page, { newError: '标题过短' }); await page.goto(origin);
  await root(page).getByRole('button', { name: '发表新话题' }).click();
  const dialog = root(page).getByRole('dialog'); await expect(dialog.getByLabel('标题', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: '发表', exact: true }).click(); await expect(dialog.getByRole('alert')).toHaveText('请填写标题');
  await dialog.getByLabel('标题', { exact: true }).fill('测试新话题'); await dialog.getByLabel('节点', { exact: true }).fill('create');
  await dialog.getByLabel('正文', { exact: true }).fill('**Markdown 预览**'); await dialog.getByRole('button', { name: '预览', exact: true }).click();
  await expect(dialog.locator('.preview strong')).toHaveText('Markdown 预览');
  await dialog.getByRole('button', { name: '发表', exact: true }).click(); await expect(dialog.getByRole('alert')).toHaveText('标题过短');
  await expect(dialog.getByLabel('标题', { exact: true })).toHaveValue('测试新话题');
  state.newError = ''; await dialog.getByRole('button', { name: '发表', exact: true }).click();
  await expect(page).toHaveURL(`${origin}/t/7`); await expect(dialog).toHaveCount(0);
  const fields = new URLSearchParams(state.writes[1].body); expect(fields.get('syntax')).toBe('markdown'); expect(fields.get('node_name')).toBe('create'); expect(fields.get('once')).toBe('54321');
});

test('原站 textarea 标题与长正文分别提交，不覆盖标题', async ({ page }) => {
  const state = await setup(page);
  await page.route('**/new', async route => {
    if (route.request().method() !== 'GET') return route.fallback();
    return route.fulfill({ contentType: 'text/html; charset=utf-8', body: newHTML().replace(
      '<input id="topic_title" name="title">', '<textarea id="topic_title" name="title"></textarea>') });
  });
  await page.goto(origin);
  await root(page).getByRole('button', { name: '发表新话题' }).click();
  const dialog = root(page).getByRole('dialog');
  const title = '【开源】微信主题来浏览V2EX';
  const content = '这是微信主题的介绍，正文可以超过标题的长度限制。'.repeat(10);
  await dialog.getByLabel('标题', { exact: true }).fill(title);
  await dialog.getByLabel('节点', { exact: true }).fill('create');
  await dialog.getByLabel('正文', { exact: true }).fill(content);
  await dialog.getByRole('button', { name: '发表', exact: true }).click();
  await expect(page).toHaveURL(`${origin}/t/7`);
  expect(state.writes).toHaveLength(1);
  const fields = new URLSearchParams(state.writes[0].body);
  expect(fields.get('title')).toBe(title);
  expect(fields.get('content')).toBe(content);
  expect(fields.get('node_name')).toBe('create');
  expect(fields.get('once')).toBe('54321');
});

test('V2EX_TAB Cookie 提供默认分类，URL 参数和原站标记优先', async ({ page }) => {
  await setup(page);
  await page.context().addCookies([{ name: 'V2EX_TAB', value: '2|1:0|10:1791614344|8:V2EX_TAB|12:Y3JlYXRpdmU=|83dc886f5e9a98f17259572e1de460c8a185645767a647778bb3f388d2b20d0b', url: origin }]);
  await page.goto(origin);
  await expect(root(page).locator('.context-title')).toHaveText('创意');
  await root(page).getByRole('button', { name: '分类和节点', exact: true }).click();
  await expect(root(page).locator('.drawer-item[aria-current="true"]')).toHaveText('创意');
  await page.goto(`${origin}/?tab=tech`);
  await expect(root(page).locator('.context-title')).toHaveText('技术');
  await page.route(`${origin}/`, route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: listHTML().replace('href="/?tab=all"', 'href="/?tab=all" class="tab_current"') }));
  await page.goto(origin);
  await expect(root(page).locator('.context-title')).toHaveText('全部');
  await page.context().addCookies([{ name: 'V2EX_TAB', value: 'invalid-cookie', url: origin }]);
  await page.unroute(`${origin}/`);
  await page.goto(origin);
  await expect(root(page).locator('.context-title')).toHaveText('全部');
});

test('左侧导航高亮随收藏、分类面板和历史导航同步', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await setup(page); await page.goto(origin);
  const rail = root(page).getByRole('navigation', { name: '主导航' });
  const topics = rail.getByRole('button', { name: '话题', exact: true });
  const favorites = rail.getByRole('button', { name: '我的收藏', exact: true });
  const categories = rail.getByRole('button', { name: '分类和节点', exact: true });
  const selected = rail.locator('.rail-button.active');
  const expectSelection = async (label: string) => {
    await expect(selected).toHaveCount(1);
    await expect(selected).toHaveAttribute('aria-label', label);
    await expect(selected).toHaveAttribute('aria-current', 'true');
    await expect(selected).toHaveCSS('color', 'rgb(7, 193, 96)');
    await expect(rail.locator('[aria-current="true"]')).toHaveCount(1);
  };
  await expectSelection('话题');
  await favorites.click(); await expect(page).toHaveURL(`${origin}/my/topics`);
  await expectSelection('我的收藏');
  await expect(topics).not.toHaveClass(/active/);
  await page.screenshot({ path: '/tmp/v2ex-rail-favorites.png' });
  await categories.click(); await expect(root(page).locator('.drawer')).toBeVisible();
  await expectSelection('分类和节点');
  await page.screenshot({ path: '/tmp/v2ex-rail-categories.png' });
  await categories.click(); await expect(root(page).locator('.drawer')).toHaveCount(0);
  await expectSelection('我的收藏');
  await categories.click(); await page.keyboard.press('Escape');
  await expectSelection('我的收藏');
  await openTopic(page); await expectSelection('我的收藏');
  await page.reload(); await expectSelection('我的收藏');
  await topics.click(); await expect(page).toHaveURL(`${origin}/?tab=all`);
  await expectSelection('话题');
  await page.goBack(); await expect(chatTitle(page)).toHaveText(titles[0]);
  await expectSelection('我的收藏');
  await page.goForward(); await expect(page).toHaveURL(`${origin}/?tab=all`);
  await expectSelection('话题');
  await categories.click();
  await root(page).locator('.drawer').getByRole('button', { name: '技术', exact: true }).click();
  await expect(page).toHaveURL(`${origin}/?tab=tech`);
  await expect(root(page).locator('.drawer')).toHaveCount(0);
  await expectSelection('话题');
  expect(errors).toEqual([]);
});

test('首页无 tab 参数时按原站默认分类显示选中标记', async ({ page }) => {
  await setup(page);
  await page.route(`${origin}/`, route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: listHTML().replace('href="/?tab=tech"', 'href="/?tab=tech" class="tab_current"') }));
  await page.goto(origin);
  await expect(root(page).locator('.context-title')).toHaveText('技术');
  await root(page).getByRole('button', { name: '分类和节点', exact: true }).click();
  await expect(root(page).locator('.drawer-item[aria-current="true"]')).toHaveText('技术');
});

test('分类和节点标记当前选择，分页和打开话题后保留标记', async ({ page }) => {
  await setup(page); await page.goto(origin);
  const toggle = root(page).getByRole('button', { name: '分类和节点', exact: true });
  const selected = root(page).locator('.drawer-item[aria-current="true"]');
  await toggle.click(); await expect(selected).toHaveText('全部');
  await root(page).locator('.drawer').getByRole('button', { name: '技术', exact: true }).click();
  await expect(root(page).locator('.context-title')).toHaveText('技术');
  await toggle.click(); await expect(selected).toHaveText('技术');
  await root(page).getByRole('button', { name: '关闭分类', exact: true }).click();
  await page.goto(`${origin}/?tab=tech&p=2`);
  await toggle.click(); await expect(selected).toHaveText('技术');
  await root(page).locator('.drawer').getByRole('button', { name: '分享创造', exact: true }).click();
  await toggle.click(); await expect(selected).toHaveText('分享创造');
  await expect(selected).toHaveClass(/selected/);
  await root(page).getByRole('button', { name: '关闭分类', exact: true }).click();
  await openTopic(page);
  await toggle.click(); await expect(selected).toHaveText('分享创造');
  await page.screenshot({ path: '/tmp/v2ex-category-selected.png' });
});

test('节点列表结构、分类和评论分页', async ({ page }) => {
  await setup(page); await page.goto(origin); await root(page).getByRole('button', { name: '分类和节点', exact: true }).click();
  await root(page).locator('.drawer').getByRole('button', { name: '分享创造', exact: true }).click();
  await expect(page).toHaveURL(`${origin}/go/create`); await expect(root(page).locator('.context-title')).toHaveText('分享创造');
  await expect(root(page).locator('.row-detail').first()).toContainText('分享创造');
  await root(page).locator('.list-panel .pagination').getByRole('button', { name: '下一页' }).click();
  await expect(root(page).locator('.row-title').first()).toContainText('第二页');
  await root(page).locator('[data-topic-id="1"]').click();
  await root(page).locator('.chat-scroll .pagination').getByRole('button', { name: '下一页' }).click();
  await expect(page).toHaveURL(`${origin}/t/1?p=2`); await expect(root(page).getByText('第二页的回复')).toBeVisible();
});

test('跨页楼层链接自动读取对应评论页', async ({ page }) => {
  await setup(page); await page.goto(`${origin}/t/1#reply5`);
  await expect(page).toHaveURL(`${origin}/t/1?p=2#reply5`);
  await expect(root(page).locator('#r_200')).toHaveClass(/highlight/);
  await expect(root(page).getByText('第二页的回复')).toBeVisible();
});

test('读取失败保留已有话题，关闭话题回复时保留草稿', async ({ page }) => {
  const state = await setup(page); await page.goto(`${origin}/t/1`);
  const input = root(page).getByRole('textbox', { name: '回复内容' }); await input.fill('权限变化时保留');
  state.locked = true; await input.press('Control+Enter');
  await expect(root(page).getByRole('status')).toContainText('当前话题已无法回复'); expect(state.writes).toHaveLength(0);
  await expect(input).toHaveValue('权限变化时保留');
  await page.route('**/t/2', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await root(page).locator('[data-topic-id="2"]').click();
  await expect(root(page).getByRole('status')).toContainText('503'); await expect(chatTitle(page)).toHaveText(titles[0]);
});

test('快速切换取消旧请求，列表不会丢失', async ({ page }) => {
  await setup(page, { delay: 350 }); await page.goto(origin); await openTopic(page);
  await root(page).locator('[data-topic-id="2"]').click(); await root(page).locator('[data-topic-id="3"]').click();
  await expect(chatTitle(page)).toHaveText(titles[2]); await page.waitForTimeout(450);
  await expect(chatTitle(page)).toHaveText(titles[2]); await expect(root(page).locator('.topic-row')).toHaveCount(6);
});

test('未登录可读不可写，发帖和收藏引导原站登录', async ({ page }) => {
  const state = await setup(page, { loggedIn: false }); await page.goto(`${origin}/t/1`);
  await expect(root(page).getByRole('textbox', { name: '回复内容' })).toBeDisabled();
  await expect(root(page).locator('.composer').getByRole('link', { name: '登录 V2EX' })).toBeVisible();
  await root(page).getByRole('button', { name: '发表新话题' }).click(); await expect(root(page).getByRole('dialog')).toContainText('请先登录');
  expect(state.writes).toHaveLength(0);
});

test('令牌失效不会提交且草稿保留', async ({ page }) => {
  const state = await setup(page, { tokenError: true }); await page.goto(`${origin}/t/1`);
  const input = root(page).getByRole('textbox', { name: '回复内容' }); await input.fill('令牌过期草稿'); await input.press('Control+Enter');
  await expect(root(page).getByRole('status')).toContainText('校验令牌失效'); await expect(input).toHaveValue('令牌过期草稿'); expect(state.writes).toHaveLength(0);
});

test('HTML 清理移除脚本、事件、危险链接和样式冲突', async ({ page }) => {
  await setup(page, { malicious: true }); await page.goto(origin); await openTopic(page);
  expect(await page.evaluate(() => (window as any).hacked)).toBeUndefined();
  const body = root(page).locator('.bubble-body').first();
  await expect(body.locator('script, [onclick], [onerror], [style], [id], .app')).toHaveCount(0);
  await expect(body.getByText('危险链接')).not.toHaveAttribute('href');
});

test('原站入口、窄屏回退、油猴启停', async ({ page }) => {
  await setup(page); await page.goto(`${origin}/t/1?v2wc=off`); await expect(root(page)).toHaveCount(0);
  await page.evaluate(() => (window as any).testMenus['启用微信聊天皮肤']()); await expect(root(page)).toBeVisible();
  await root(page).getByRole('button', { name: '恢复原站界面' }).click();
  await expect(root(page)).toHaveCount(0); await expect(page).toHaveURL(/v2wc=off/);
  await page.evaluate(() => (window as any).testMenus['启用微信聊天皮肤']()); await expect(root(page)).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 }); await expect(root(page)).toHaveCount(0);
  await expect(page.locator('#Main')).toBeVisible();
});

test('内容内的 V2EX 链接局部导航，外链仍在新标签打开', async ({ page }) => {
  await setup(page); await page.goto(`${origin}/t/1`);
  await root(page).getByRole('link', { name: '另一个话题', exact: true }).click(); await expect(chatTitle(page)).toHaveText(titles[1]);
  await expect(root(page).getByRole('link', { name: '外部链接', exact: true })).toHaveAttribute('target', '_blank');
});

test('详情宽度可拖动、键盘调整、记忆并恢复默认，窗口缩小时不溢出', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await setup(page); await page.goto(`${origin}/t/1`);
  await expect(chatTitle(page)).toHaveText(titles[0]);
  const splitter = root(page).getByRole('separator', { name: '调整内容详情区宽度' });
  const list = root(page).locator('.list-panel');
  const chat = root(page).locator('.chat-panel');
  const width = async () => (await chat.boundingBox())!.width;
  const drag = async (delta: number) => {
    const box = (await splitter.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, 300);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + delta, 300, { steps: 10 });
    await page.mouse.up();
  };
  const initial = await width();
  await drag(200);
  expect(await width()).toBe(initial - 200);
  await expect(root(page).locator('.app')).not.toHaveClass(/resizing-panels/);
  await page.reload(); await expect(chatTitle(page)).toHaveText(titles[0]);
  expect(await width()).toBe(initial - 200);
  await drag(-100);
  expect(await width()).toBe(initial - 100);
  await splitter.press('ArrowLeft');
  expect(await width()).toBe(initial - 76);
  await page.screenshot({ path: '/tmp/v2ex-resizable-detail.png' });
  await drag(2000);
  expect(await width()).toBe(420);
  await page.setViewportSize({ width: 1024, height: 900 });
  expect(await width()).toBe(420);
  expect((await chat.boundingBox())!.x + await width()).toBe(1024);
  await page.setViewportSize({ width: 1440, height: 900 });
  await drag(-2000);
  expect((await list.boundingBox())!.width).toBe(240);
  await splitter.dblclick();
  expect(await width()).toBe(initial);
  await page.reload(); await expect(chatTitle(page)).toHaveText(titles[0]);
  expect(await width()).toBe(initial);
  expect(errors).toEqual([]);
});

for (const width of [1280, 1440, 2048]) test(`桌面 ${width}px：布局无溢出，正文和列表独立滚动`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1033 }); await setup(page); await page.goto(`${origin}/t/1`);
  await expect(root(page).locator('.topic-row')).toHaveCount(6);
  const dimensions = await root(page).locator('.app').evaluate(app => {
    const rail = app.querySelector('.rail')!.getBoundingClientRect();
    const list = app.querySelector('.list-panel')!.getBoundingClientRect();
    const chat = app.querySelector('.chat-panel')!.getBoundingClientRect();
    const scroll = app.querySelector('.chat-scroll')!;
    return { rail: rail.width, list: list.width, chat: chat.width, right: chat.right, viewport: innerWidth, contentOverflow: scroll.scrollWidth > scroll.clientWidth };
  });
  expect(dimensions.rail).toBeGreaterThanOrEqual(64); expect(dimensions.rail).toBeLessThanOrEqual(80);
  expect(dimensions.list).toBeGreaterThanOrEqual(320); expect(dimensions.list).toBeLessThanOrEqual(410);
  expect(dimensions.right).toBe(dimensions.viewport); expect(dimensions.contentOverflow).toBe(false);
});
