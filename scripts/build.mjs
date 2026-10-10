import { build, context } from 'esbuild';
import { readFileSync } from 'node:fs';
const thirdPartyLicenses = `/*\nBundled third-party licenses\n\nDOMPurify (Apache-2.0):\n${readFileSync('node_modules/dompurify/LICENSE', 'utf8')}\nmarked (MIT):\n${readFileSync('node_modules/marked/LICENSE.md', 'utf8')}\n*/`;
const header = `// ==UserScript==
// @name         V2EX 微信聊天皮肤
// @namespace    v2ex-wechat-style
// @version      1.0.0
// @description  用微信三栏布局浏览 V2EX，支持回复、发帖、收藏和感谢
// @author       y-not-u
// @homepageURL  https://github.com/y-not-u/V2EX-WeChat-Style
// @supportURL   https://github.com/y-not-u/V2EX-WeChat-Style/issues
// @updateURL    https://raw.githubusercontent.com/y-not-u/V2EX-WeChat-Style/main/v2ex-wechat.user.js
// @downloadURL  https://raw.githubusercontent.com/y-not-u/V2EX-WeChat-Style/main/v2ex-wechat.user.js
// @match        https://www.v2ex.com/*
// @match        https://v2ex.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// ==/UserScript==`;
const options = {
  entryPoints: ['src/main.ts'], bundle: true, format: 'iife', target: 'chrome110',
  outfile: 'v2ex-wechat.user.js', banner: { js: `${header}\n${thirdPartyLicenses}` },
  loader: { '.css': 'text' }, legalComments: 'inline', charset: 'utf8',
};
if (process.argv.includes('--watch')) {
  const ctx = await context(options);
  await ctx.watch();
  console.log('Watching src/ → v2ex-wechat.user.js');
} else {
  await build(options);
  console.log('Built v2ex-wechat.user.js');
}
