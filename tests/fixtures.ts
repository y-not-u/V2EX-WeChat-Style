export const titles = ['把社区做成微信聊天的样子 😆', '目录交了一圈，GSC 外链怎么查看', '口袋百宝集小程序更新了', '目前最好的语音输入法是什么', '从 ChatGPT 转向 Claude Code', 'Apple TV 看样子真要来了'];
const avatarURL = (name: string) => `/avatar/${name}.svg`;
const member = (name: string) => `<a href="/member/${name}">${name}</a>`;
const img = (name: string) => `<img class="avatar" src="${avatarURL(name)}" alt="${name}">`;
export function wrapper(main: string, loggedIn = true): string {
  return `<!doctype html><html lang="zh-CN"><head><title>V2EX</title></head><body>
    <div id="Top"><nav class="site-nav">${loggedIn ? member('tester') : '<a href="/signin">登录</a>'}</nav></div>
    <div id="Right">${loggedIn ? img('tester') : ''}</div><div id="Main">${main}</div>
    </body></html>`;
}
export function listHTML(options: { node?: boolean; page?: number; loggedIn?: boolean; favorites?: boolean } = {}): string {
  const { node = false, page = 1, loggedIn = true, favorites = false } = options;
  const tabs = `<div id="Tabs"><a href="/?tab=all">全部</a><a href="/?tab=tech">技术</a><a href="/?tab=creative">创意</a></div><div id="SecondaryTabs"><a href="/go/create">分享创造</a><a href="/go/programmer">程序员</a></div>`;
  const items = titles.map((title, i) => `<div class="cell ${node ? 'from_100 t_' + (i + 1) : 'item'}">
    <table><tr><td>${img(i ? 'maocat' : 'wensonsmith')}</td><td><span class="item_title"><a href="/t/${i + 1}">${page === 2 ? '第二页：' : ''}${title}</a></span>
    <span class="topic_info">${node ? '' : '<a class="node" href="/go/create">分享创造</a>'} ${member(i ? 'maocat' : 'wensonsmith')} <span title="2026-10-10 10:49:00 +08:00">10:49</span> Lastly replied by ${member('maocat')}</span></td><td><a class="count_livid">${i === 0 ? 4 : 0}</a></td></tr></table></div>`).join('');
  return wrapper(`${node ? '<div class="node-header"><div class="node-breadcrumb"><a href="/">V2EX</a> › 分享创造</div></div>' : favorites ? '<div class="header"><h1>我的收藏</h1></div>' : tabs}
    ${items}${pageLinks(page, node ? '/go/create' : '/')}`, loggedIn);
}
function pageLinks(page: number, base: string): string {
  return `<div class="cell ps_container"><a class="${page === 1 ? 'page_current' : 'page_normal'}" href="${base}?p=1">1</a>
    <a class="${page === 2 ? 'page_current' : 'page_normal'}" href="${base}?p=2">2</a><input class="page_input" max="2"></div>`;
}
export interface TopicOptions { id?: number; page?: number; loggedIn?: boolean; favorite?: boolean; submitted?: string; error?: string; locked?: boolean; malicious?: boolean }
export function topicHTML(options: TopicOptions = {}): string {
  const { id = 1, page = 1, loggedIn = true, favorite = false, submitted = '', error = '', locked = false, malicious = false } = options;
  const authors = ['maocat', 'tester', 'leadfast', 'maocat'];
  const comments = ['你这不是插件谁敢用啊，我怕你盯着我的金币', '@maocat 大哥，我这是新社区啊，不是 v2ex', '针不戳', '@tester 对不起搞错了'];
  const replies = (page === 1 ? comments : ['第二页的回复']).map((content, i) => replyHTML(100 + i + (page - 1) * 100, String(i + 1 + (page - 1) * 4), authors[i], content, loggedIn)).join('');
  return wrapper(`<div class="box"><div class="header"><div class="fr">${member('wensonsmith')}${img('wensonsmith')}</div>
    <a href="/">V2EX</a> › <a href="/go/create">分享创造</a><h1>${titles[id - 1] || '新话题'}</h1>
    <small class="gray">${member('wensonsmith')} · <span title="2026-10-10">10:49</span></small></div>
    <div class="cell"><div class="topic_content"><div class="markdown_body"><p>把 V2EX 的话题当成会话，正文和回复变成聊天气泡。</p>
    <p>使用浏览器打开即可体验，欢迎大家试试。</p><p><a href="/t/2">另一个话题</a> · <a href="https://example.com">外部链接</a></p>
    <pre><code class="language-js">const community = 'V2EX';</code></pre>
    <table><tr><th>浏览</th><th>回复</th></tr><tr><td>原站真实内容</td><td>直接发送</td></tr></table>
    ${malicious ? '<script>window.hacked = true</script><img src="/bad.png" onerror="window.hacked = true"><a href="javascript:alert(1)">危险链接</a><div class="app" id="v2wc-root" style="position:fixed">恶意样式</div>' : ''}</div></div></div>
    <div class="subtle"><span class="fade">第 1 条附言</span><div class="topic_content">补充：支持 Ctrl+Enter 发送回复。</div></div>
    ${loggedIn ? `<a href="/${favorite ? 'unfavorite' : 'favorite'}/topic/${id}?once=old">${favorite ? '取消收藏' : '加入收藏'}</a><span id="topic_thank"><a onclick="thankTopic(${id}, 'old')">感谢</a></span>` : ''}</div>
    <div class="box"><div class="cell"><span class="gray">${submitted ? 5 : 4} 条回复</span></div>${pageLinks(page, `/t/${id}`)}
    ${replies}${submitted ? replyHTML(999, '5', 'tester', submitted, loggedIn) : ''}</div>
    ${error ? `<div class="problem">${error}</div>` : ''}
    <div id="reply-box">${loggedIn && !locked ? `<form action="/t/${id}" method="post"><input type="hidden" name="once" value="old"><input type="hidden" name="hidden_field" value="preserved"><textarea id="reply_content" name="content">${error ? submitted : ''}</textarea><input type="submit" value="回复"></form>` : '<div class="cell">此话题暂时无法回复</div>'}</div>`, loggedIn);
}
function replyHTML(id: number, floor: string, author: string, content: string, loggedIn: boolean): string {
  return `<div id="r_${id}" class="cell"><table><tr><td>${img(author)}</td><td><span class="no">${floor}</span><strong>${member(author)}</strong><span class="ago">10:50</span><div class="reply_content">${content}</div>
    ${loggedIn ? `<span id="thank_area_${id}"><a onclick="thankReply(${id})">感谢</a></span>` : ''}</td></tr></table></div>`;
}
export function newHTML(loggedIn = true): string {
  if (!loggedIn) return wrapper('<div class="header">登录</div>', false);
  return wrapper(`<form method="post" action="/new"><input name="once" type="hidden" value="old"><input name="syntax" type="hidden" value="markdown">
    <input id="topic_title" name="title"><select name="node_name"><option value="">选择节点</option><option value="create">分享创造</option><option value="programmer">程序员</option></select><textarea id="topic_content" name="content"></textarea><input type="submit"></form>`);
}
