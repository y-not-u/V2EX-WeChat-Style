// ==UserScript==
// @name         V2EX 微信聊天皮肤
// @namespace    v2ex-wechat-style
// @version      1.0.9
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
// ==/UserScript==
"use strict";
(() => {
  // node_modules/marked/lib/marked.esm.js
  function M() {
    return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
  }
  var O = M();
  function G(u3) {
    O = u3;
  }
  var _ = { exec: () => null };
  function k(u3, e = "") {
    let t = typeof u3 == "string" ? u3 : u3.source, n = { replace: (r, i) => {
      let s = typeof i == "string" ? i : i.source;
      return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
    }, getRegex: () => new RegExp(t, e) };
    return n;
  }
  var be = (() => {
    try {
      return !!new RegExp("(?<=1)(?<!1)");
    } catch {
      return false;
    }
  })();
  var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u3) => new RegExp(`^( {0,3}${u3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}#`), htmlBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}>`) };
  var Re = /^(?:[ \t]*(?:\n|$))+/;
  var Oe = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var Te = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var C = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var we = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var Q = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
  var se = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var ie = k(se).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var ye = k(se).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var j = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var Pe = /^[^\n]+/;
  var F = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
  var Se = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", F).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var $e = k(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Q).getRegex();
  var v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var _e = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var oe = k(j).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  var Le = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", oe).getRegex();
  var K = { blockquote: Le, code: Oe, def: Se, fences: Te, heading: we, hr: C, html: _e, lheading: ie, list: $e, newline: Re, paragraph: oe, table: _, text: Pe };
  var ne = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  var Me = { ...K, lheading: ye, table: ne, paragraph: k(j).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ne).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() };
  var ze = { ...K, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: _, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(j).replace("hr", C).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ie).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
  var Ee = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var Ie = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var ae = /^( {2,}|\\)\n(?!\s*$)/;
  var Ae = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var z = /[\p{P}\p{S}]/u;
  var H = /[\s\p{P}\p{S}]/u;
  var W = /[^\s\p{P}\p{S}]/u;
  var Ce = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, H).getRegex();
  var le = /(?!~)[\p{P}\p{S}]/u;
  var Be = /(?!~)[\s\p{P}\p{S}]/u;
  var De = /(?:[^\s\p{P}\p{S}]|~)/u;
  var qe = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", be ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
  var ue = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
  var ve = k(ue, "u").replace(/punct/g, z).getRegex();
  var He = k(ue, "u").replace(/punct/g, le).getRegex();
  var pe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var Ze = k(pe, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, z).getRegex();
  var Ge = k(pe, "gu").replace(/notPunctSpace/g, De).replace(/punctSpace/g, Be).replace(/punct/g, le).getRegex();
  var Ne = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, z).getRegex();
  var Qe = k(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, z).getRegex();
  var je = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
  var Fe = k(je, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, z).getRegex();
  var Ue = k(/\\(punct)/, "gu").replace(/punct/g, z).getRegex();
  var Ke = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var We = k(U).replace("(?:-->|$)", "-->").getRegex();
  var Xe = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", We).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
  var Je = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var ce = k(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", F).getRegex();
  var he = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", F).getRegex();
  var Ve = k("reflink|nolink(?!\\()", "g").replace("reflink", ce).replace("nolink", he).getRegex();
  var re = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
  var X = { _backpedal: _, anyPunctuation: Ue, autolink: Ke, blockSkip: qe, br: ae, code: Ie, del: _, delLDelim: _, delRDelim: _, emStrongLDelim: ve, emStrongRDelimAst: Ze, emStrongRDelimUnd: Ne, escape: Ee, link: Je, nolink: he, punctuation: Ce, reflink: ce, reflinkSearch: Ve, tag: Xe, text: Ae, url: _ };
  var Ye = { ...X, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
  var N = { ...X, emStrongRDelimAst: Ge, emStrongLDelim: He, delLDelim: Qe, delRDelim: Fe, url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", re).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", re).getRegex() };
  var et = { ...N, br: k(ae).replace("{2,}", "*").getRegex(), text: k(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
  var B = { normal: K, gfm: Me, pedantic: ze };
  var E = { normal: X, gfm: N, breaks: et, pedantic: Ye };
  var tt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  var ke = (u3) => tt[u3];
  function T(u3, e) {
    if (e) {
      if (m.escapeTest.test(u3)) return u3.replace(m.escapeReplace, ke);
    } else if (m.escapeTestNoEncode.test(u3)) return u3.replace(m.escapeReplaceNoEncode, ke);
    return u3;
  }
  function J(u3) {
    try {
      u3 = encodeURI(u3).replace(m.percentDecode, "%");
    } catch {
      return null;
    }
    return u3;
  }
  function V(u3, e) {
    let t = u3.replace(m.findPipe, (i, s, a) => {
      let o = false, l = s;
      for (; --l >= 0 && a[l] === "\\"; ) o = !o;
      return o ? "|" : " |";
    }), n = t.split(m.splitPipe), r = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
    else for (; n.length < e; ) n.push("");
    for (; r < n.length; r++) n[r] = n[r].trim().replace(m.slashPipe, "|");
    return n;
  }
  function I(u3, e, t) {
    let n = u3.length;
    if (n === 0) return "";
    let r = 0;
    for (; r < n; ) {
      let i = u3.charAt(n - r - 1);
      if (i === e && !t) r++;
      else if (i !== e && t) r++;
      else break;
    }
    return u3.slice(0, n - r);
  }
  function de(u3, e) {
    if (u3.indexOf(e[1]) === -1) return -1;
    let t = 0;
    for (let n = 0; n < u3.length; n++) if (u3[n] === "\\") n++;
    else if (u3[n] === e[0]) t++;
    else if (u3[n] === e[1] && (t--, t < 0)) return n;
    return t > 0 ? -2 : -1;
  }
  function ge(u3, e = 0) {
    let t = e, n = "";
    for (let r of u3) if (r === "	") {
      let i = 4 - t % 4;
      n += " ".repeat(i), t += i;
    } else n += r, t++;
    return n;
  }
  function fe(u3, e, t, n, r) {
    let i = e.href, s = e.title || null, a = u3[1].replace(r.other.outputLinkReplace, "$1");
    n.state.inLink = true;
    let o = { type: u3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: a, tokens: n.inlineTokens(a) };
    return n.state.inLink = false, o;
  }
  function nt(u3, e, t) {
    let n = u3.match(t.other.indentCodeCompensation);
    if (n === null) return e;
    let r = n[1];
    return e.split(`
`).map((i) => {
      let s = i.match(t.other.beginningSpace);
      if (s === null) return i;
      let [a] = s;
      return a.length >= r.length ? i.slice(r.length) : i;
    }).join(`
`);
  }
  var w = class {
    options;
    rules;
    lexer;
    constructor(e) {
      this.options = e || O;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : I(n, `
`) };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0], r = nt(n, t[3] || "", this.rules);
        return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let r = I(n, "#");
          (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
        }
        return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: I(t[0], `
`) };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = I(t[0], `
`).split(`
`), r = "", i = "", s = [];
        for (; n.length > 0; ) {
          let a = false, o = [], l;
          for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) o.push(n[l]), a = true;
          else if (!a) o.push(n[l]);
          else break;
          n = n.slice(l);
          let p = o.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
          r = r ? `${r}
${p}` : p, i = i ? `${i}
${c}` : c;
          let d = this.lexer.state.top;
          if (this.lexer.state.top = true, this.lexer.blockTokens(c, s, true), this.lexer.state.top = d, n.length === 0) break;
          let h = s.at(-1);
          if (h?.type === "code") break;
          if (h?.type === "blockquote") {
            let R = h, f = R.raw + `
` + n.join(`
`), S = this.blockquote(f);
            s[s.length - 1] = S, r = r.substring(0, r.length - R.raw.length) + S.raw, i = i.substring(0, i.length - R.text.length) + S.text;
            break;
          } else if (h?.type === "list") {
            let R = h, f = R.raw + `
` + n.join(`
`), S = this.list(f);
            s[s.length - 1] = S, r = r.substring(0, r.length - h.raw.length) + S.raw, i = i.substring(0, i.length - R.raw.length) + S.raw, n = f.substring(s.at(-1).raw.length).split(`
`);
            continue;
          }
        }
        return { type: "blockquote", raw: r, tokens: s, text: i };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
        n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
        let s = this.rules.other.listItemRegex(n), a = false;
        for (; e; ) {
          let l = false, p = "", c = "";
          if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
          p = t[0], e = e.substring(p.length);
          let d = ge(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], R = !d.trim(), f = 0;
          if (this.options.pedantic ? (f = 2, c = d.trimStart()) : R ? f = t[1].length + 1 : (f = d.search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = d.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(h) && (p += h + `
`, e = e.substring(h.length + 1), l = true), !l) {
            let S = this.rules.other.nextBulletRegex(f), Y = this.rules.other.hrRegex(f), ee = this.rules.other.fencesBeginRegex(f), te = this.rules.other.headingBeginRegex(f), me = this.rules.other.htmlBeginRegex(f), xe = this.rules.other.blockquoteBeginRegex(f);
            for (; e; ) {
              let Z = e.split(`
`, 1)[0], A;
              if (h = Z, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), A = h) : A = h.replace(this.rules.other.tabCharGlobal, "    "), ee.test(h) || te.test(h) || me.test(h) || xe.test(h) || S.test(h) || Y.test(h)) break;
              if (A.search(this.rules.other.nonSpaceChar) >= f || !h.trim()) c += `
` + A.slice(f);
              else {
                if (R || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ee.test(d) || te.test(d) || Y.test(d)) break;
                c += `
` + h;
              }
              R = !h.trim(), p += Z + `
`, e = e.substring(Z.length + 1), d = A.slice(f);
            }
          }
          i.loose || (a ? i.loose = true : this.rules.other.doubleBlankLine.test(p) && (a = true)), i.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), i.raw += p;
        }
        let o = i.items.at(-1);
        if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
        else return;
        i.raw = i.raw.trimEnd();
        for (let l of i.items) {
          if (this.lexer.state.top = false, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
            if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
              l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
              for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
                this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
                break;
              }
            }
            let p = this.rules.other.listTaskCheckbox.exec(l.raw);
            if (p) {
              let c = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
              l.checked = c.checked, i.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = c.raw + l.tokens[0].raw, l.tokens[0].text = c.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(c)) : l.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : l.tokens.unshift(c);
            }
          }
          if (!i.loose) {
            let p = l.tokens.filter((d) => d.type === "space"), c = p.length > 0 && p.some((d) => this.rules.other.anyLine.test(d.raw));
            i.loose = c;
          }
        }
        if (i.loose) for (let l of i.items) {
          l.loose = true;
          for (let p of l.tokens) p.type === "text" && (p.type = "paragraph");
        }
        return i;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
        return { type: "def", tag: n, raw: t[0], href: r, title: i };
      }
    }
    table(e) {
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
      let n = V(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
      if (n.length === r.length) {
        for (let a of r) this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
        for (let a = 0; a < n.length; a++) s.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: true, align: s.align[a] });
        for (let a of i) s.rows.push(V(a, s.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: false, align: s.align[l] })));
        return s;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t) {
        let n = t[1].trim();
        return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
      }
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
    }
    link(e) {
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
          if (!this.rules.other.endAngleBracket.test(n)) return;
          let s = I(n.slice(0, -1), "\\");
          if ((n.length - s.length) % 2 === 0) return;
        } else {
          let s = de(t[2], "()");
          if (s === -2) return;
          if (s > -1) {
            let o = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
            t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, o).trim(), t[3] = "";
          }
        }
        let r = t[2], i = "";
        if (this.options.pedantic) {
          let s = this.rules.other.pedanticHrefTitle.exec(r);
          s && (r = s[1], i = s[3]);
        } else i = t[3] ? t[3].slice(1, -1) : "";
        return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), fe(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
        if (!i) {
          let s = n[0].charAt(0);
          return { type: "text", raw: s, text: s };
        }
        return fe(n, i, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let r = this.rules.inline.emStrongLDelim.exec(e);
      if (!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
      if (!(r[1] || r[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let s = [...r[0]].length - 1, a, o, l = s, p = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = c.exec(t)) !== null; ) {
          if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
          if (o = [...a].length, r[3] || r[4]) {
            l += o;
            continue;
          } else if ((r[5] || r[6]) && s % 3 && !((s + o) % 3)) {
            p += o;
            continue;
          }
          if (l -= o, l > 0) continue;
          o = Math.min(o, o + l + p);
          let d = [...r[0]][0].length, h = e.slice(0, s + r.index + d + o);
          if (Math.min(s, o) % 2) {
            let f = h.slice(1, -1);
            return { type: "em", raw: h, text: f, tokens: this.lexer.inlineTokens(f) };
          }
          let R = h.slice(2, -2);
          return { type: "strong", raw: h, text: R, tokens: this.lexer.inlineTokens(R) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e, t, n = "") {
      let r = this.rules.inline.delLDelim.exec(e);
      if (!r) return;
      if (!(r[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let s = [...r[0]].length - 1, a, o, l = s, p = this.rules.inline.delRDelim;
        for (p.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = p.exec(t)) !== null; ) {
          if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (o = [...a].length, o !== s)) continue;
          if (r[3] || r[4]) {
            l += o;
            continue;
          }
          if (l -= o, l > 0) continue;
          o = Math.min(o, o + l);
          let c = [...r[0]][0].length, d = e.slice(0, s + r.index + c + o), h = d.slice(s, -s);
          return { type: "del", raw: d, text: h, tokens: this.lexer.inlineTokens(h) };
        }
      }
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, r;
        return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    url(e) {
      let t;
      if (t = this.rules.inline.url.exec(e)) {
        let n, r;
        if (t[2] === "@") n = t[0], r = "mailto:" + n;
        else {
          let i;
          do
            i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
          while (i !== t[0]);
          n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
        }
        return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: t[0], escaped: n };
      }
    }
  };
  var x = class u {
    tokens;
    options;
    state;
    inlineQueue;
    tokenizer;
    constructor(e) {
      this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || O, this.options.tokenizer = this.options.tokenizer || new w(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
      let t = { other: m, block: B.normal, inline: E.normal };
      this.options.pedantic ? (t.block = B.pedantic, t.inline = E.pedantic) : this.options.gfm && (t.block = B.gfm, this.options.breaks ? t.inline = E.breaks : t.inline = E.gfm), this.tokenizer.rules = t;
    }
    static get rules() {
      return { block: B, inline: E };
    }
    static lex(e, t) {
      return new u(t).lex(e);
    }
    static lexInline(e, t) {
      return new u(t).inlineTokens(e);
    }
    lex(e) {
      e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        let n = this.inlineQueue[t];
        this.inlineTokens(n.src, n.tokens);
      }
      return this.inlineQueue = [], this.tokens;
    }
    blockTokens(e, t = [], n = false) {
      for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
        let r;
        if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
        if (r = this.tokenizer.space(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
          continue;
        }
        if (r = this.tokenizer.code(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.list(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.html(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.def(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
          continue;
        }
        if (r = this.tokenizer.table(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        let i = e;
        if (this.options.extensions?.startBlock) {
          let s = 1 / 0, a = e.slice(1), o;
          this.options.extensions.startBlock.forEach((l) => {
            o = l.call({ lexer: this }, a), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
          }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(i))) {
          let s = t.at(-1);
          n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (e) {
          let s = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(s);
            break;
          } else throw new Error(s);
        }
      }
      return this.state.top = true, t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    inlineTokens(e, t = []) {
      this.tokenizer.lexer = this;
      let n = e, r = null;
      if (this.tokens.links) {
        let o = Object.keys(this.tokens.links);
        if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) !== null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) !== null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      let i;
      for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) !== null; ) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
      let s = false, a = "";
      for (; e; ) {
        s || (a = ""), s = false;
        let o;
        if (this.options.extensions?.inline?.some((p) => (o = p.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false)) continue;
        if (o = this.tokenizer.escape(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.tag(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.link(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(o.raw.length);
          let p = t.at(-1);
          o.type === "text" && p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
          continue;
        }
        if (o = this.tokenizer.emStrong(e, n, a)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.codespan(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.br(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.del(e, n, a)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.autolink(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (!this.state.inLink && (o = this.tokenizer.url(e))) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        let l = e;
        if (this.options.extensions?.startInline) {
          let p = 1 / 0, c = e.slice(1), d;
          this.options.extensions.startInline.forEach((h) => {
            d = h.call({ lexer: this }, c), typeof d == "number" && d >= 0 && (p = Math.min(p, d));
          }), p < 1 / 0 && p >= 0 && (l = e.substring(0, p + 1));
        }
        if (o = this.tokenizer.inlineText(l)) {
          e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), s = true;
          let p = t.at(-1);
          p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
          continue;
        }
        if (e) {
          let p = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(p);
            break;
          } else throw new Error(p);
        }
      }
      return t;
    }
  };
  var y = class {
    options;
    parser;
    constructor(e) {
      this.options = e || O;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
      return r ? '<pre><code class="language-' + T(r) + '">' + (n ? i : T(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : T(i, true)) + `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    def(e) {
      return "";
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered, n = e.start, r = "";
      for (let a = 0; a < e.items.length; a++) {
        let o = e.items[a];
        r += this.listitem(o);
      }
      let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
      return "<" + i + s + `>
` + r + "</" + i + `>
`;
    }
    listitem(e) {
      return `<li>${this.parser.parse(e.tokens)}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "", n = "";
      for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
      t += this.tablerow({ text: n });
      let r = "";
      for (let i = 0; i < e.rows.length; i++) {
        let s = e.rows[i];
        n = "";
        for (let a = 0; a < s.length; a++) n += this.tablecell(s[a]);
        r += this.tablerow({ text: n });
      }
      return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
      return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${T(e, true)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, tokens: n }) {
      let r = this.parser.parseInline(n), i = J(e);
      if (i === null) return r;
      e = i;
      let s = '<a href="' + e + '"';
      return t && (s += ' title="' + T(t) + '"'), s += ">" + r + "</a>", s;
    }
    image({ href: e, title: t, text: n, tokens: r }) {
      r && (n = this.parser.parseInline(r, this.parser.textRenderer));
      let i = J(e);
      if (i === null) return T(n);
      e = i;
      let s = `<img src="${e}" alt="${T(n)}"`;
      return t && (s += ` title="${T(t)}"`), s += ">", s;
    }
    text(e) {
      return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : T(e.text);
    }
  };
  var $ = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
    checkbox({ raw: e }) {
      return e;
    }
  };
  var b = class u2 {
    options;
    renderer;
    textRenderer;
    constructor(e) {
      this.options = e || O, this.options.renderer = this.options.renderer || new y(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
    }
    static parse(e, t) {
      return new u2(t).parse(e);
    }
    static parseInline(e, t) {
      return new u2(t).parseInline(e);
    }
    parse(e) {
      this.renderer.parser = this;
      let t = "";
      for (let n = 0; n < e.length; n++) {
        let r = e[n];
        if (this.options.extensions?.renderers?.[r.type]) {
          let s = r, a = this.options.extensions.renderers[s.type].call({ parser: this }, s);
          if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
            t += a || "";
            continue;
          }
        }
        let i = r;
        switch (i.type) {
          case "space": {
            t += this.renderer.space(i);
            break;
          }
          case "hr": {
            t += this.renderer.hr(i);
            break;
          }
          case "heading": {
            t += this.renderer.heading(i);
            break;
          }
          case "code": {
            t += this.renderer.code(i);
            break;
          }
          case "table": {
            t += this.renderer.table(i);
            break;
          }
          case "blockquote": {
            t += this.renderer.blockquote(i);
            break;
          }
          case "list": {
            t += this.renderer.list(i);
            break;
          }
          case "checkbox": {
            t += this.renderer.checkbox(i);
            break;
          }
          case "html": {
            t += this.renderer.html(i);
            break;
          }
          case "def": {
            t += this.renderer.def(i);
            break;
          }
          case "paragraph": {
            t += this.renderer.paragraph(i);
            break;
          }
          case "text": {
            t += this.renderer.text(i);
            break;
          }
          default: {
            let s = 'Token with "' + i.type + '" type was not found.';
            if (this.options.silent) return console.error(s), "";
            throw new Error(s);
          }
        }
      }
      return t;
    }
    parseInline(e, t = this.renderer) {
      this.renderer.parser = this;
      let n = "";
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        if (this.options.extensions?.renderers?.[i.type]) {
          let a = this.options.extensions.renderers[i.type].call({ parser: this }, i);
          if (a !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
            n += a || "";
            continue;
          }
        }
        let s = i;
        switch (s.type) {
          case "escape": {
            n += t.text(s);
            break;
          }
          case "html": {
            n += t.html(s);
            break;
          }
          case "link": {
            n += t.link(s);
            break;
          }
          case "image": {
            n += t.image(s);
            break;
          }
          case "checkbox": {
            n += t.checkbox(s);
            break;
          }
          case "strong": {
            n += t.strong(s);
            break;
          }
          case "em": {
            n += t.em(s);
            break;
          }
          case "codespan": {
            n += t.codespan(s);
            break;
          }
          case "br": {
            n += t.br(s);
            break;
          }
          case "del": {
            n += t.del(s);
            break;
          }
          case "text": {
            n += t.text(s);
            break;
          }
          default: {
            let a = 'Token with "' + s.type + '" type was not found.';
            if (this.options.silent) return console.error(a), "";
            throw new Error(a);
          }
        }
      }
      return n;
    }
  };
  var P = class {
    options;
    block;
    constructor(e) {
      this.options = e || O;
    }
    static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
    static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer(e = this.block) {
      return e ? x.lex : x.lexInline;
    }
    provideParser(e = this.block) {
      return e ? b.parse : b.parseInline;
    }
  };
  var D = class {
    defaults = M();
    options = this.setOptions;
    parse = this.parseMarkdown(true);
    parseInline = this.parseMarkdown(false);
    Parser = b;
    Renderer = y;
    TextRenderer = $;
    Lexer = x;
    Tokenizer = w;
    Hooks = P;
    constructor(...e) {
      this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
        case "table": {
          let i = r;
          for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, t));
          for (let s of i.rows) for (let a of s) n = n.concat(this.walkTokens(a.tokens, t));
          break;
        }
        case "list": {
          let i = r;
          n = n.concat(this.walkTokens(i.items, t));
          break;
        }
        default: {
          let i = r;
          this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
            let a = i[s].flat(1 / 0);
            n = n.concat(this.walkTokens(a, t));
          }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
        }
      }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return e.forEach((n) => {
        let r = { ...n };
        if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
          if (!i.name) throw new Error("extension name required");
          if ("renderer" in i) {
            let s = t.renderers[i.name];
            s ? t.renderers[i.name] = function(...a) {
              let o = i.renderer.apply(this, a);
              return o === false && (o = s.apply(this, a)), o;
            } : t.renderers[i.name] = i.renderer;
          }
          if ("tokenizer" in i) {
            if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
            let s = t[i.level];
            s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
          }
          "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
        }), r.extensions = t), n.renderer) {
          let i = this.defaults.renderer || new y(this.defaults);
          for (let s in n.renderer) {
            if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
            if (["options", "parser"].includes(s)) continue;
            let a = s, o = n.renderer[a], l = i[a];
            i[a] = (...p) => {
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c || "";
            };
          }
          r.renderer = i;
        }
        if (n.tokenizer) {
          let i = this.defaults.tokenizer || new w(this.defaults);
          for (let s in n.tokenizer) {
            if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
            if (["options", "rules", "lexer"].includes(s)) continue;
            let a = s, o = n.tokenizer[a], l = i[a];
            i[a] = (...p) => {
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c;
            };
          }
          r.tokenizer = i;
        }
        if (n.hooks) {
          let i = this.defaults.hooks || new P();
          for (let s in n.hooks) {
            if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
            if (["options", "block"].includes(s)) continue;
            let a = s, o = n.hooks[a], l = i[a];
            P.passThroughHooks.has(s) ? i[a] = (p) => {
              if (this.defaults.async && P.passThroughHooksRespectAsync.has(s)) return (async () => {
                let d = await o.call(i, p);
                return l.call(i, d);
              })();
              let c = o.call(i, p);
              return l.call(i, c);
            } : i[a] = (...p) => {
              if (this.defaults.async) return (async () => {
                let d = await o.apply(i, p);
                return d === false && (d = await l.apply(i, p)), d;
              })();
              let c = o.apply(i, p);
              return c === false && (c = l.apply(i, p)), c;
            };
          }
          r.hooks = i;
        }
        if (n.walkTokens) {
          let i = this.defaults.walkTokens, s = n.walkTokens;
          r.walkTokens = function(a) {
            let o = [];
            return o.push(s.call(this, a)), i && (o = o.concat(i.call(this, a))), o;
          };
        }
        this.defaults = { ...this.defaults, ...r };
      }), this;
    }
    setOptions(e) {
      return this.defaults = { ...this.defaults, ...e }, this;
    }
    lexer(e, t) {
      return x.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return b.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (n, r) => {
        let i = { ...r }, s = { ...this.defaults, ...i }, a = this.onError(!!s.silent, !!s.async);
        if (this.defaults.async === true && i.async === false) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        if (typeof n > "u" || n === null) return a(new Error("marked(): input parameter is undefined or null"));
        if (typeof n != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
        if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async) return (async () => {
          let o = s.hooks ? await s.hooks.preprocess(n) : n, p = await (s.hooks ? await s.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(o, s), c = s.hooks ? await s.hooks.processAllTokens(p) : p;
          s.walkTokens && await Promise.all(this.walkTokens(c, s.walkTokens));
          let h = await (s.hooks ? await s.hooks.provideParser(e) : e ? b.parse : b.parseInline)(c, s);
          return s.hooks ? await s.hooks.postprocess(h) : h;
        })().catch(a);
        try {
          s.hooks && (n = s.hooks.preprocess(n));
          let l = (s.hooks ? s.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(n, s);
          s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
          let c = (s.hooks ? s.hooks.provideParser(e) : e ? b.parse : b.parseInline)(l, s);
          return s.hooks && (c = s.hooks.postprocess(c)), c;
        } catch (o) {
          return a(o);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
          let r = "<p>An error occurred:</p><pre>" + T(n.message + "", true) + "</pre>";
          return t ? Promise.resolve(r) : r;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  };
  var L = new D();
  function g(u3, e) {
    return L.parse(u3, e);
  }
  g.options = g.setOptions = function(u3) {
    return L.setOptions(u3), g.defaults = L.defaults, G(g.defaults), g;
  };
  g.getDefaults = M;
  g.defaults = O;
  g.use = function(...u3) {
    return L.use(...u3), g.defaults = L.defaults, G(g.defaults), g;
  };
  g.walkTokens = function(u3, e) {
    return L.walkTokens(u3, e);
  };
  g.parseInline = L.parseInline;
  g.Parser = b;
  g.parser = b.parse;
  g.Renderer = y;
  g.TextRenderer = $;
  g.Lexer = x;
  g.lexer = x.lex;
  g.Tokenizer = w;
  g.Hooks = P;
  g.parse = g;
  var Qt = g.options;
  var jt = g.setOptions;
  var Ft = g.use;
  var Ut = g.walkTokens;
  var Kt = g.parseInline;
  var Xt = b.parse;
  var Jt = x.lex;

  // src/style.css
  var style_default = `:host {
  --rail: #2d2d2d; --list: #e9e9e9; --canvas: #ededed; --header: #f7f7f7;
  --text: #191919; --muted: #999; --line: #dcdcdc; --selected: #ddd;
  --green: #95ec69; --accent: #07c160; --link: #5e709b;
  --nav-width: clamp(64px, 3.91vw, 80px); --list-width: clamp(320px, 20vw, 410px);
  --header-height: clamp(72px, 4.3vw, 88px); --body-size: clamp(16px, 1vw, 20px);
  color: var(--text); font: 400 var(--body-size)/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "WenQuanYi Zen Hei", sans-serif;
  color-scheme: light;
}
* { box-sizing: border-box; }
button, input, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; border: 0; background: none; padding: 0; }
button:disabled { cursor: default; opacity: .45; }
button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }
svg { display: block; width: 24px; height: 24px; }
[hidden] { display: none !important; }
.app { position: fixed; inset: 0; display: grid; grid-template-columns: var(--nav-width) var(--list-width) minmax(0, 1fr); background: var(--canvas); }
.rail { display: flex; flex-direction: column; align-items: center; padding: 28px 0 20px; gap: 22px; background: var(--rail); color: #939393; }
.brand { width: 44px; height: 44px; border-radius: 5px; display: grid; place-items: center; color: #fff; background: #fff; margin-bottom: 8px; }
.brand img { width: 34px; height: 34px; object-fit: contain; }
.rail-button { width: 48px; height: 44px; display: grid; place-items: center; position: relative; border-radius: 5px; color: inherit; }
.rail-button svg { width: 28px; height: 28px; }
.rail-button:hover { color: #e0e0e0; background: #393939; }
.rail-button.active { color: var(--accent); }
.rail-space { flex: 1; }
.rail-profile { margin-top: 2px; }
.rail-profile .avatar { width: 42px; height: 42px; border-radius: 50%; background: #191919; color: #eee; }
.list-panel { background: var(--list); border-right: 1px solid var(--line); min-width: 0; min-height: 0; display: flex; flex-direction: column; position: relative; }
.panel-splitter { position: absolute; top: 0; bottom: 0; right: -5px; width: 10px; z-index: 5; cursor: col-resize; touch-action: none; }
.panel-splitter::after { content: ''; position: absolute; top: 0; bottom: 0; left: 4px; width: 2px; background: transparent; transition: background .12s; }
.panel-splitter:hover::after, .panel-splitter:focus-visible::after, .resizing-panels .panel-splitter::after { background: var(--accent); }
.panel-splitter:focus-visible { outline: none; }
.resizing-panels, .resizing-panels * { cursor: col-resize !important; user-select: none !important; }
.list-head { height: var(--header-height); display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
.list-head h1 { margin: 0; font-size: clamp(22px, 1.35vw, 28px); font-weight: 600; letter-spacing: .3px; }
.add { position: absolute; right: 20px; color: #252525; padding: 4px; }
.add svg { width: 32px; height: 32px; }
.search-wrap { margin: 0 16px 14px; position: relative; }
.search-wrap svg { position: absolute; left: 13px; top: 11px; width: 20px; height: 20px; color: #999; }
.search { width: 100%; border: 0; border-radius: 5px; background: #dcdcdc; padding: 9px 40px 9px 42px; height: 42px; font-size: 16px; outline-offset: 0; }
.search::placeholder { color: #888; }
.list-context { position: absolute; top: calc(var(--header-height) + 9px); right: 24px; font-size: 12px; color: #888; }
.context-title { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.mini { color: #888; padding: 3px; opacity: 0; }
.list-panel:hover .mini, .mini:focus-visible { opacity: 1; }
.mini svg { width: 16px; height: 16px; }
.topics { flex: 1; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; min-height: 0; }
.topic-row { width: 100%; display: flex; align-items: center; gap: 15px; padding: 16px; min-height: clamp(82px, 4.75vw, 98px); text-align: left; }
.topic-row:hover { background: #e1e1e1; }
.topic-row.selected { background: var(--selected); }
.avatar { display: inline-grid; place-items: center; position: relative; width: clamp(48px, 2.95vw, 60px); height: clamp(48px, 2.95vw, 60px); background: #c5cdd1; border-radius: 5px; flex-shrink: 0; overflow: hidden; color: #fff; font-size: 24px; }
.avatar img { position: absolute; width: 100%; height: 100%; object-fit: cover; }
.avatar.has-image { background: transparent; color: transparent; }
.row-info { flex: 1; min-width: 0; }
.row-top { display: flex; align-items: baseline; gap: 9px; }
.row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; font-weight: 400; }
.row-time { flex-shrink: 0; font-size: 12px; color: #999; max-width: 65px; overflow: hidden; white-space: nowrap; }
.row-detail { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); font-size: clamp(14px, .88vw, 18px); margin-top: 4px; }
.pagination { display: flex; gap: 10px; align-items: center; justify-content: center; padding: 9px 14px; font-size: 12px; color: #888; flex-shrink: 0; }
.pagination button { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 3px; }
.pagination button:hover:not(:disabled) { background: #ddd; }
.pagination svg { width: 16px; height: 16px; }
.chat-panel { min-width: 0; min-height: 0; display: flex; flex-direction: column; position: relative; }
.chat-head { min-height: var(--header-height); background: var(--header); border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 14px 28px; flex-shrink: 0; }
.chat-heading { min-width: 0; }
.chat-title { font-size: clamp(19px, 1.13vw, 23px); font-weight: 600; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }
.chat-subtitle { color: var(--muted); margin-top: 3px; font-size: clamp(13px, .78vw, 16px); }
.chat-subtitle a { color: inherit; }
.head-actions { display: flex; gap: 12px; align-items: center; }
.icon-button { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 4px; }
.icon-button:hover { background: #e6e6e6; }
.chat-scroll { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 28px 30px 30px; scrollbar-width: thin; }
.message { display: flex; align-items: flex-start; gap: 14px; margin: 0 0 24px; scroll-margin-top: 20px; }
.message .avatar { width: clamp(44px, 2.7vw, 55px); height: clamp(44px, 2.7vw, 55px); }
.message-content { min-width: 0; max-width: min(82%, 920px); position: relative; }
.original .message-content { max-width: min(82%, 766px); }
.message-meta { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: clamp(12px, .82vw, 16px); margin: -2px 0 4px; min-height: 20px; }
.message-user { color: var(--muted); text-align: left; }
.message-user:hover { color: var(--link); }
.message-time { font-size: 11px; opacity: 0; transition: opacity .12s; }
.message:hover .message-time, .message:focus-within .message-time { opacity: 1; }
.bubble { background: white; border-radius: 5px; padding: 11px 16px; position: relative; overflow-wrap: anywhere; min-width: 45px; }
.bubble::before { content: ''; position: absolute; top: 16px; left: -6px; width: 12px; height: 12px; transform: rotate(45deg); background: inherit; }
.bubble-body { position: relative; min-width: 0; }
.own { flex-direction: row-reverse; }
.own .message-meta { justify-content: flex-end; }
.own .message-time { order: -1; }
.own .bubble { background: var(--green); }
.own .bubble::before { left: auto; right: -6px; }
.message-actions { position: absolute; left: 0; top: 100%; display: flex; align-items: center; gap: 12px; margin-top: 4px; min-height: 18px; font-size: 11px; color: #999; opacity: 0; }
.message-actions:empty { display: none; }
.message:hover .message-actions, .message:focus-within .message-actions, .message.highlight .message-actions { opacity: 1; }
.message-actions a, .message-actions button { color: inherit; }
.own .message-actions { left: auto; right: 0; justify-content: flex-end; }
.message.highlight .bubble { box-shadow: 0 0 0 2px #07c160; }
.bubble-body p { margin: 0 0 12px; }
.bubble-body p:last-child { margin-bottom: 0; }
.bubble-body img { max-width: min(100%, 600px); max-height: 420px; width: auto; height: auto; object-fit: contain; border-radius: 3px; vertical-align: middle; }
.bubble-body img.emoji { width: 22px; }
.bubble-body h1, .bubble-body h2, .bubble-body h3 { font-size: 1.2em; margin: 16px 0 10px; }
.bubble-body > :first-child { margin-top: 0; }
.bubble-body ul, .bubble-body ol { padding-left: 1.5em; }
.bubble-body pre { max-width: 100%; overflow-x: auto; background: #f5f5f5; padding: 12px; border-radius: 3px; font-size: 13px; line-height: 1.65; }
.bubble-body code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .87em; }
.bubble-body :not(pre) > code { background: #f2f2f2; padding: 2px 4px; border-radius: 2px; }
.table-scroll { overflow-x: auto; max-width: 100%; }
.bubble-body table { border-collapse: collapse; font-size: .9em; }
.bubble-body th, .bubble-body td { border: 1px solid #ddd; padding: 7px 12px; white-space: nowrap; }
.bubble-body blockquote { border-left: 3px solid #ddd; margin: 8px 0; padding-left: 12px; color: #777; }
.supplement-label { font-size: 12px; color: #999; margin-bottom: 9px; }
.thread-note { text-align: center; margin: 18px auto; font-size: 12px; color: #999; }
.composer { background: var(--header); border-top: 1px solid var(--line); padding: 14px 16px; flex-shrink: 0; }
.compose-row { display: flex; gap: 14px; align-items: flex-end; }
.reply-input { resize: none; min-height: 52px; max-height: 180px; flex: 1; border: none; outline-offset: 0; border-radius: 6px; padding: 13px 15px; background: #fff; line-height: 1.5; }
.reply-input::placeholder { color: #999; }
.send { background: var(--accent); color: #fff; border-radius: 5px; padding: 11px 19px; min-height: 48px; white-space: nowrap; }
.send:hover:not(:disabled) { background: #06ad56; }
.send:disabled { background: #ace0b8; opacity: 1; }
.compose-note { font-size: 12px; color: #999; padding: 8px 0 0; display: flex; justify-content: space-between; gap: 14px; }
.empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 100%; min-height: 120px; padding: 36px; color: #999; gap: 14px; }
.empty svg { width: 56px; height: 56px; color: #c1c1c1; stroke-width: 1; }
.empty p { margin: 0; font-size: 14px; }
.empty .empty-brand { font-size: 26px; color: #aaa; font-weight: 500; }
.list-empty { padding: 35px 20px; text-align: center; font-size: 14px; color: #999; }
.loading { font-size: 13px; color: #999; padding: 24px; text-align: center; }
.toast { position: absolute; bottom: 110px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; width: max-content; background: #333; color: #fff; border-radius: 5px; padding: 10px 14px; max-width: 80%; font-size: 14px; z-index: 20; box-shadow: 0 3px 14px #0002; }
.toast-message { min-width: 0; overflow-wrap: anywhere; }
.toast a { color: #95ec69; white-space: nowrap; flex-shrink: 0; }
.toast .icon-button { width: 24px; height: 24px; flex-shrink: 0; }
.toast .icon-button svg { width: 18px; height: 18px; }
.toast .icon-button:hover { background: #ffffff1a; }
.popup { position: absolute; top: 65px; right: 20px; z-index: 12; min-width: 160px; background: #fff; border-radius: 4px; padding: 6px; box-shadow: 0 3px 20px #0002; border: 1px solid #ddd; }
.popup button, .popup a { display: block; width: 100%; padding: 10px 14px; text-align: left; font-size: 14px; color: #333; border-radius: 3px; }
.popup button:hover, .popup a:hover { background: #f1f1f1; text-decoration: none; }
.drawer { position: absolute; left: var(--nav-width); top: 0; bottom: 0; width: var(--list-width); background: #f5f5f5; z-index: 14; box-shadow: 4px 0 18px #0001; display: flex; flex-direction: column; border-right: 1px solid #ddd; }
.drawer-head { height: var(--header-height); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid #ddd; }
.drawer-head h2 { font-size: 20px; font-weight: 500; }
.drawer-body { padding: 14px; overflow-y: auto; flex: 1; }
.drawer-section { font-size: 12px; color: #999; padding: 10px 10px 6px; }
.drawer-item { width: 100%; padding: 11px 14px; font-size: 15px; text-align: left; border-radius: 3px; }
.drawer-item:hover { background: #e5e5e5; }
.drawer-item.selected { color: var(--accent); background: #e2efdf; font-weight: 600; }
.drawer-item.selected::after { content: '✓'; float: right; }
.drawer-search { width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 8px 10px; margin-bottom: 8px; font-size: 14px; }
.modal-overlay { position: absolute; inset: 0; background: #0005; z-index: 30; display: grid; place-items: center; padding: 28px; }
.modal { width: min(760px, 90vw); max-height: 90vh; background: #f7f7f7; border-radius: 7px; display: flex; flex-direction: column; box-shadow: 0 12px 50px #0003; }
.modal-head { padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ddd; }
.modal-head h2 { font-size: 20px; font-weight: 500; margin: 0; }
.modal-body { padding: 22px 24px; overflow-y: auto; }
.field { display: block; font-size: 14px; margin-bottom: 18px; color: #777; }
.field input, .field textarea, .field select { display: block; width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; background: white; margin-top: 7px; color: #222; font-size: 15px; }
.field textarea { min-height: 220px; resize: vertical; font-family: inherit; }
.modal-foot { display: flex; align-items: center; gap: 12px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid #ddd; }
.secondary { padding: 10px 16px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; background: #fff; }
.modal-error { color: #c13c3c; font-size: 14px; white-space: pre-wrap; margin: 12px 0; }
.preview { background: white; border-radius: 5px; padding: 18px; margin: 15px 0; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; scroll-behavior: auto !important; } }
`;

  // node_modules/dompurify/dist/purify.es.mjs
  /*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
  function _OverloadYield(e, d) {
    this.v = e, this.k = d;
  }
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u3, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = false;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t.return && (u3 = t.return(), Object(u3) !== u3)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  function AsyncGenerator(e) {
    var t, n;
    function resume(t2, n2) {
      try {
        var r = e[t2](n2), o = r.value, u3 = o instanceof _OverloadYield;
        Promise.resolve(u3 ? o.v : o).then(function(n3) {
          if (u3) {
            var i = "return" === t2 && o.k ? t2 : "next";
            if (!o.k || n3.done) return resume(i, n3);
            n3 = e[i](n3).value;
          }
          settle(!!r.done, n3);
        }, function(e2) {
          resume("throw", e2);
        });
      } catch (e2) {
        settle(2, e2);
      }
    }
    function settle(e2, r) {
      2 === e2 ? t.reject(r) : t.resolve({
        value: r,
        done: e2
      }), (t = t.next) ? resume(t.key, t.arg) : n = null;
    }
    this._invoke = function(e2, r) {
      return new Promise(function(o, u3) {
        var i = {
          key: e2,
          arg: r,
          resolve: o,
          reject: u3,
          next: null
        };
        n ? n = n.next = i : (t = n = i, resume(e2, r));
      });
    }, "function" != typeof e.return && (this.return = void 0);
  }
  AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
    return this;
  }, AsyncGenerator.prototype.next = function(e) {
    return this._invoke("next", e);
  }, AsyncGenerator.prototype.throw = function(e) {
    return this._invoke("throw", e);
  }, AsyncGenerator.prototype.return = function(e) {
    return this._invoke("return", e);
  };
  var entries = Object.entries;
  var setPrototypeOf = Object.setPrototypeOf;
  var isFrozen = Object.isFrozen;
  var getPrototypeOf = Object.getPrototypeOf;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var freeze = Object.freeze;
  var seal = Object.seal;
  var create = Object.create;
  var _ref = typeof Reflect !== "undefined" && Reflect;
  var apply = _ref.apply;
  var construct = _ref.construct;
  if (!freeze) freeze = function freeze2(x2) {
    return x2;
  };
  if (!seal) seal = function seal2(x2) {
    return x2;
  };
  if (!apply) apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
    return func.apply(thisArg, args);
  };
  if (!construct) construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
    return new Func(...args);
  };
  var arrayForEach = unapply(Array.prototype.forEach);
  Array.prototype.indexOf;
  var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  Array.prototype.slice;
  var arraySplice = unapply(Array.prototype.splice);
  var arrayIsArray = Array.isArray;
  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringToString = unapply(String.prototype.toString);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);
  var numberToString = unapply(Number.prototype.toString);
  var booleanToString = unapply(Boolean.prototype.toString);
  var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
  var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
  var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  var objectToString = unapply(Object.prototype.toString);
  var regExpTest = unapply(RegExp.prototype.test);
  var typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) setPrototypeOf(set, null);
    if (!arrayIsArray(array)) return set;
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) array[l] = lcElement;
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const _ref2 of entries(object)) {
      var _ref3 = _slicedToArray(_ref2, 2);
      const property = _ref3[0];
      const value = _ref3[1];
      if (objectHasOwnProperty(object, property)) {
        if (arrayIsArray(value)) newObject[property] = cleanArray(value);
        else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
        else newObject[property] = value;
      }
    }
    return newObject;
  }
  function stringifyValue(value) {
    switch (typeof value) {
      case "string":
        return value;
      case "number":
        return numberToString(value);
      case "boolean":
        return booleanToString(value);
      case "bigint":
        return bigintToString ? bigintToString(value) : "0";
      case "symbol":
        return symbolToString ? symbolToString(value) : "Symbol()";
      case "undefined":
        return objectToString(value);
      case "function":
      case "object": {
        if (value === null) return objectToString(value);
        const valueAsRecord = value;
        const valueToString = lookupGetter(valueAsRecord, "toString");
        if (typeof valueToString === "function") {
          const stringified = valueToString(valueAsRecord);
          return typeof stringified === "string" ? stringified : objectToString(stringified);
        }
        return objectToString(value);
      }
      default:
        return objectToString(value);
    }
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) return unapply(desc.get);
        if (typeof desc.value === "function") return unapply(desc.value);
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  function isRegex(value) {
    try {
      regExpTest(value, "");
      return true;
    } catch (_unused) {
      return false;
    }
  }
  var html$1 = freeze([
    "a",
    "abbr",
    "acronym",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "content",
    "data",
    "datalist",
    "dd",
    "decorator",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "element",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meter",
    "nav",
    "nobr",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "search",
    "section",
    "select",
    "shadow",
    "slot",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr"
  ]);
  var svg$1 = freeze([
    "svg",
    "a",
    "altglyph",
    "altglyphdef",
    "altglyphitem",
    "animatecolor",
    "animatemotion",
    "animatetransform",
    "circle",
    "clippath",
    "defs",
    "desc",
    "ellipse",
    "enterkeyhint",
    "exportparts",
    "filter",
    "font",
    "g",
    "glyph",
    "glyphref",
    "hkern",
    "image",
    "inputmode",
    "line",
    "lineargradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "part",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialgradient",
    "rect",
    "stop",
    "style",
    "switch",
    "symbol",
    "text",
    "textpath",
    "title",
    "tref",
    "tspan",
    "view",
    "vkern"
  ]);
  var svgFilters = freeze([
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence"
  ]);
  var svgDisallowed = freeze([
    "animate",
    "color-profile",
    "cursor",
    "discard",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignobject",
    "hatch",
    "hatchpath",
    "mesh",
    "meshgradient",
    "meshpatch",
    "meshrow",
    "missing-glyph",
    "script",
    "set",
    "solidcolor",
    "unknown",
    "use"
  ]);
  var mathMl$1 = freeze([
    "math",
    "menclose",
    "merror",
    "mfenced",
    "mfrac",
    "mglyph",
    "mi",
    "mlabeledtr",
    "mmultiscripts",
    "mn",
    "mo",
    "mover",
    "mpadded",
    "mphantom",
    "mroot",
    "mrow",
    "ms",
    "mspace",
    "msqrt",
    "mstyle",
    "msub",
    "msup",
    "msubsup",
    "mtable",
    "mtd",
    "mtext",
    "mtr",
    "munder",
    "munderover",
    "mprescripts"
  ]);
  var mathMlDisallowed = freeze([
    "maction",
    "maligngroup",
    "malignmark",
    "mlongdiv",
    "mscarries",
    "mscarry",
    "msgroup",
    "mstack",
    "msline",
    "msrow",
    "semantics",
    "annotation",
    "annotation-xml",
    "mprescripts",
    "none"
  ]);
  var text = freeze(["#text"]);
  var html = freeze([
    "accept",
    "action",
    "align",
    "alt",
    "autocapitalize",
    "autocomplete",
    "autopictureinpicture",
    "autoplay",
    "background",
    "bgcolor",
    "border",
    "capture",
    "cellpadding",
    "cellspacing",
    "checked",
    "cite",
    "class",
    "clear",
    "color",
    "cols",
    "colspan",
    "command",
    "commandfor",
    "controls",
    "controlslist",
    "coords",
    "crossorigin",
    "datetime",
    "decoding",
    "default",
    "dir",
    "disabled",
    "disablepictureinpicture",
    "disableremoteplayback",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "exportparts",
    "face",
    "for",
    "headers",
    "height",
    "hidden",
    "high",
    "href",
    "hreflang",
    "id",
    "inert",
    "inputmode",
    "integrity",
    "ismap",
    "kind",
    "label",
    "lang",
    "list",
    "loading",
    "loop",
    "low",
    "max",
    "maxlength",
    "media",
    "method",
    "min",
    "minlength",
    "multiple",
    "muted",
    "name",
    "nonce",
    "noshade",
    "novalidate",
    "nowrap",
    "open",
    "optimum",
    "part",
    "pattern",
    "placeholder",
    "playsinline",
    "popover",
    "popovertarget",
    "popovertargetaction",
    "poster",
    "preload",
    "pubdate",
    "radiogroup",
    "readonly",
    "rel",
    "required",
    "rev",
    "reversed",
    "role",
    "rows",
    "rowspan",
    "spellcheck",
    "scope",
    "selected",
    "shape",
    "size",
    "sizes",
    "slot",
    "span",
    "srclang",
    "start",
    "src",
    "srcset",
    "step",
    "style",
    "summary",
    "tabindex",
    "title",
    "translate",
    "type",
    "usemap",
    "valign",
    "value",
    "width",
    "wrap",
    "xmlns"
  ]);
  var svg = freeze([
    "accent-height",
    "accumulate",
    "additive",
    "alignment-baseline",
    "amplitude",
    "ascent",
    "attributename",
    "attributetype",
    "azimuth",
    "basefrequency",
    "baseline-shift",
    "begin",
    "bias",
    "by",
    "class",
    "clip",
    "clippathunits",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "cx",
    "cy",
    "d",
    "dx",
    "dy",
    "diffuseconstant",
    "direction",
    "display",
    "divisor",
    "dominant-baseline",
    "dur",
    "edgemode",
    "elevation",
    "end",
    "exponent",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "filterunits",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "fx",
    "fy",
    "g1",
    "g2",
    "glyph-name",
    "glyphref",
    "gradientunits",
    "gradienttransform",
    "height",
    "href",
    "id",
    "image-rendering",
    "in",
    "in2",
    "intercept",
    "k",
    "k1",
    "k2",
    "k3",
    "k4",
    "kerning",
    "keypoints",
    "keysplines",
    "keytimes",
    "lang",
    "lengthadjust",
    "letter-spacing",
    "kernelmatrix",
    "kernelunitlength",
    "lighting-color",
    "local",
    "marker-end",
    "marker-mid",
    "marker-start",
    "markerheight",
    "markerunits",
    "markerwidth",
    "maskcontentunits",
    "maskunits",
    "max",
    "mask",
    "mask-type",
    "media",
    "method",
    "mode",
    "min",
    "name",
    "numoctaves",
    "offset",
    "operator",
    "opacity",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "paint-order",
    "path",
    "pathlength",
    "patterncontentunits",
    "patterntransform",
    "patternunits",
    "pointer-events",
    "points",
    "preservealpha",
    "preserveaspectratio",
    "primitiveunits",
    "r",
    "rx",
    "ry",
    "radius",
    "refx",
    "refy",
    "repeatcount",
    "repeatdur",
    "restart",
    "result",
    "rotate",
    "scale",
    "seed",
    "shape-rendering",
    "slope",
    "specularconstant",
    "specularexponent",
    "spreadmethod",
    "startoffset",
    "stddeviation",
    "stitchtiles",
    "stop-color",
    "stop-opacity",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke",
    "stroke-width",
    "style",
    "surfacescale",
    "systemlanguage",
    "tabindex",
    "tablevalues",
    "targetx",
    "targety",
    "transform",
    "transform-origin",
    "text-anchor",
    "text-decoration",
    "text-orientation",
    "text-rendering",
    "textlength",
    "type",
    "u1",
    "u2",
    "unicode",
    "values",
    "vector-effect",
    "viewbox",
    "visibility",
    "version",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "width",
    "word-spacing",
    "wrap",
    "writing-mode",
    "xchannelselector",
    "ychannelselector",
    "x",
    "x1",
    "x2",
    "xmlns",
    "y",
    "y1",
    "y2",
    "z",
    "zoomandpan"
  ]);
  var mathMl = freeze([
    "accent",
    "accentunder",
    "align",
    "bevelled",
    "close",
    "columnalign",
    "columnlines",
    "columnspacing",
    "columnspan",
    "denomalign",
    "depth",
    "dir",
    "display",
    "displaystyle",
    "encoding",
    "fence",
    "frame",
    "height",
    "href",
    "id",
    "largeop",
    "length",
    "linethickness",
    "lquote",
    "lspace",
    "mathbackground",
    "mathcolor",
    "mathsize",
    "mathvariant",
    "maxsize",
    "minsize",
    "movablelimits",
    "notation",
    "numalign",
    "open",
    "rowalign",
    "rowlines",
    "rowspacing",
    "rowspan",
    "rspace",
    "rquote",
    "scriptlevel",
    "scriptminsize",
    "scriptsizemultiplier",
    "selection",
    "separator",
    "separators",
    "stretchy",
    "subscriptshift",
    "supscriptshift",
    "symmetric",
    "voffset",
    "width",
    "xmlns"
  ]);
  var xml = freeze([
    "xlink:href",
    "xml:id",
    "xlink:title",
    "xml:space",
    "xmlns:xlink"
  ]);
  var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
  var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
  var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
  var DOCTYPE_NAME = seal(/^html$/i);
  var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
  var COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
  var FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
  var SELF_CLOSING_TAG = seal(/\/>/i);
  var NODE_TYPE = {
    element: 1,
    attribute: 2,
    text: 3,
    cdataSection: 4,
    entityReference: 5,
    entityNode: 6,
    processingInstruction: 7,
    comment: 8,
    document: 9,
    documentType: 10,
    documentFragment: 11,
    notation: 12
  };
  var LITERAL_TEXT_ELEMENT_NAMES = [
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript"
  ];
  var LITERAL_TEXT_ELEMENTS = freeze(addToSet({}, LITERAL_TEXT_ELEMENT_NAMES));
  var LITERAL_TEXT_CLOSE = (function() {
    const map = {};
    arrayForEach(LITERAL_TEXT_ELEMENT_NAMES, (name) => {
      map[name] = seal(new RegExp("</" + name + "(?=[\\t\\n\\f\\r />])", "i"));
    });
    return freeze(map);
  })();
  var getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_2) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  var _createHooksMap = function _createHooksMap2() {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
  };
  var _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
    return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
  };
  var _resolveObjectOption = function _resolveObjectOption2(cfg, key, makeFallback) {
    const value = objectHasOwnProperty(cfg, key) ? cfg[key] : void 0;
    return value && typeof value === "object" ? clone(value) : makeFallback();
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.4.16";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let document2 = window2.document;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    window2.DocumentFragment;
    const HTMLTemplateElement = window2.HTMLTemplateElement, Node = window2.Node, Element = window2.Element, NodeFilter2 = window2.NodeFilter;
    window2.NamedNodeMap === void 0 && (window2.NamedNodeMap || window2.MozNamedAttrMap);
    window2.HTMLFormElement;
    const DOMParser2 = window2.DOMParser, trustedTypes = window2.trustedTypes;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const removeAttributeNode = lookupGetter(ElementPrototype, "removeAttributeNode");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
    const getAttributes = lookupGetter(ElementPrototype, "attributes");
    const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
    const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
    const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
    const _readNodeType = function _readNodeType2(node) {
      return getNodeType ? getNodeType(node) : node.nodeType;
    };
    const _readNodeName = function _readNodeName2(node) {
      return getNodeName ? getNodeName(node) : node.nodeName;
    };
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) document2 = template.content.ownerDocument;
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    let defaultTrustedTypesPolicy;
    let defaultTrustedTypesPolicyResolved = false;
    let IN_TRUSTED_TYPES_POLICY = 0;
    const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
      if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
    };
    const _createTrustedHTML = function _createTrustedHTML2(html2) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createHTML(html2);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createScriptURL(scriptUrl);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
      if (!defaultTrustedTypesPolicyResolved) {
        defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        defaultTrustedTypesPolicyResolved = true;
      }
      return defaultTrustedTypesPolicy;
    };
    const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
    const importNode = originalDocument.importNode;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
    let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [
      ...html$1,
      ...svg$1,
      ...svgFilters,
      ...mathMl$1,
      ...text
    ]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [
      ...html,
      ...svg,
      ...mathMl,
      ...xml
    ]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let SET_CONFIG_ALLOWED_TAGS = null;
    let SET_CONFIG_ALLOWED_ATTR = null;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",
      "selectedcontent",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp"
    ]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, [
      "audio",
      "video",
      "img",
      "source",
      "image",
      "track"
    ]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
      "alt",
      "class",
      "for",
      "id",
      "label",
      "name",
      "pattern",
      "placeholder",
      "role",
      "summary",
      "title",
      "value",
      "style",
      "xmlns"
    ]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
      MATHML_NAMESPACE,
      SVG_NAMESPACE,
      HTML_NAMESPACE
    ], stringToString);
    const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext"
    ]);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
      "title",
      "style",
      "font",
      "a",
      "script"
    ]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) return;
      if (!cfg || typeof cfg !== "object") cfg = {};
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
      ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
      ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
      URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
        transform: transformCaseFunc,
        base: DEFAULT_URI_SAFE_ATTRIBUTES
      });
      DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
        transform: transformCaseFunc,
        base: DEFAULT_DATA_URI_TAGS
      });
      FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
      FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), { transform: transformCaseFunc });
      FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), { transform: transformCaseFunc });
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
      NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = _resolveObjectOption(cfg, "MATHML_TEXT_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS));
      HTML_INTEGRATION_POINTS = _resolveObjectOption(cfg, "HTML_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS));
      const customElementHandling = _resolveObjectOption(cfg, "CUSTOM_ELEMENT_HANDLING", () => create(null));
      CUSTOM_ELEMENT_HANDLING = create(null);
      if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
      if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
      if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
      seal(CUSTOM_ELEMENT_HANDLING);
      if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
      if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = create(null);
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      EXTRA_ELEMENT_HANDLING.tagCheck = null;
      EXTRA_ELEMENT_HANDLING.attributeCheck = null;
      if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
        if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        else if (arrayIsArray(cfg.ADD_TAGS)) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
        if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        else if (arrayIsArray(cfg.ADD_ATTR)) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
      if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
        "html",
        "head",
        "body"
      ]);
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        const previousTrustedTypesPolicy = trustedTypesPolicy;
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        try {
          emptyHTML = _createTrustedHTML("");
        } catch (error) {
          trustedTypesPolicy = previousTrustedTypesPolicy;
          throw error;
        }
      } else if (cfg.TRUSTED_TYPES_POLICY === null) {
        trustedTypesPolicy = void 0;
        emptyHTML = "";
      } else {
        if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
        if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
      }
      if (freeze) freeze(cfg);
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [
      ...svg$1,
      ...svgFilters,
      ...svgDisallowed
    ]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
      if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      return Boolean(ALL_SVG_TAGS[tagName]);
    };
    const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
      if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      return Boolean(ALL_MATHML_TAGS[tagName]);
    };
    const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    };
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
      if (element.namespaceURI === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parent, parentTagName);
      if (element.namespaceURI === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parent, parentTagName);
      if (element.namespaceURI === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parent, parentTagName);
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, { element: node });
      try {
        getParentNode(node).removeChild(node);
      } catch (_2) {
        remove(node);
        if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
      }
    };
    const _stripAttributeNode = function _stripAttributeNode2(element, attribute, name) {
      try {
        removeAttributeNode(element, attribute);
      } catch (_2) {
        try {
          element.removeAttribute(name);
        } catch (_3) {
        }
      }
    };
    const _neutralizeRoot = function _neutralizeRoot2(root) {
      _neutralizeSubtree(root);
      const childNodes = getChildNodes(root);
      if (childNodes) {
        const snapshot = [];
        arrayForEach(childNodes, (child) => {
          arrayPush(snapshot, child);
        });
        arrayForEach(snapshot, (child) => {
          try {
            remove(child);
          } catch (_2) {
          }
        });
      }
      const attributes = getAttributes(root);
      if (attributes) for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name === "string") _stripAttributeNode(root, attribute, name);
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element, attr) {
      if (!attr) try {
        attr = element.getAttributeNode(name);
      } catch (_2) {
        attr = null;
      }
      arrayPush(DOMPurify.removed, {
        attribute: attr || null,
        from: element
      });
      try {
        if (attr) removeAttributeNode(element, attr);
        else element.removeAttribute(name);
      } catch (_2) {
        try {
          element.removeAttribute(name);
        } catch (_3) {
        }
      }
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
          _forceRemove(element);
        } catch (_2) {
        }
        else try {
          element.setAttribute(name, "");
        } catch (_2) {
        }
      }
    };
    const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element) {
      const attributes = getAttributes(element);
      if (!attributes) return;
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) continue;
        _stripAttributeNode(element, attribute, name);
      }
    };
    const _neutralizeSubtree = function _neutralizeSubtree2(root) {
      const stack = [root];
      while (stack.length > 0) {
        const node = stack.pop();
        if (_readNodeType(node) === NODE_TYPE.element) _stripDisallowedAttributes(node);
        const childNodes = getChildNodes(node);
        if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
      }
    };
    const _isPatchLinkageAttribute = function _isPatchLinkageAttribute2(lcName, lcTag) {
      if (!SAFE_FOR_XML) return false;
      if (lcName === "patchsrc") return true;
      return lcName === "for" && lcTag !== "label" && lcTag !== "output";
    };
    const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root) {
      if (!SAFE_FOR_XML) return;
      const stack = [root];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeType = _readNodeType(node);
        if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
          try {
            remove(node);
          } catch (_2) {
          }
          continue;
        }
        if (nodeType === NODE_TYPE.element) {
          const element = node;
          const lcTag = transformCaseFunc(_readNodeName(node));
          try {
            if (element.hasAttribute && element.hasAttribute("patchsrc")) element.removeAttribute("patchsrc");
            if (element.hasAttribute && element.hasAttribute("for") && _isPatchLinkageAttribute("for", lcTag)) element.removeAttribute("for");
          } catch (_2) {
          }
        }
        const childNodes = getChildNodes(node);
        if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
      else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) try {
        doc = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_2) {
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_2) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
      return createNodeIterator.call(doc || root, root, NodeFilter2.SHOW_ELEMENT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_PROCESSING_INSTRUCTION | NodeFilter2.SHOW_CDATA_SECTION, null);
    };
    const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
      value = stringReplace(value, MUSTACHE_EXPR$1, " ");
      value = stringReplace(value, ERB_EXPR$1, " ");
      value = stringReplace(value, TMPLIT_EXPR$1, " ");
      return value;
    };
    const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
      var _node$querySelectorAl;
      node.normalize();
      const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
      const walker = createNodeIterator.call(doc || node, node, NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_CDATA_SECTION | NodeFilter2.SHOW_PROCESSING_INSTRUCTION, null);
      let currentNode = walker.nextNode();
      while (currentNode) {
        currentNode.data = _stripTemplateExpressions(currentNode.data);
        currentNode = walker.nextNode();
      }
      const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
      if (templates) arrayForEach(templates, (tmpl) => {
        if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
      });
    };
    const _isClobbered = function _isClobbered2(element) {
      const realTagName = getNodeName ? getNodeName(element) : null;
      if (typeof realTagName !== "string") return false;
      if (transformCaseFunc(realTagName) !== "form") return false;
      return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.removeAttributeNode !== "function" || typeof element.getAttributeNode !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
    };
    const _isDocumentFragment = function _isDocumentFragment2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) return false;
      try {
        return getNodeType(value) === NODE_TYPE.documentFragment;
      } catch (_2) {
        return false;
      }
    };
    const _isNode = function _isNode2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) return false;
      try {
        return typeof getNodeType(value) === "number";
      } catch (_2) {
        return false;
      }
    };
    function _executeHooks(hooks2, currentNode, data) {
      if (hooks2.length === 0) return;
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
      if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && LITERAL_TEXT_ELEMENTS[tagName] && (_isNode(currentNode.firstElementChild) || typeof currentNode.textContent === "string" && regExpTest(LITERAL_TEXT_CLOSE[tagName], currentNode.textContent))) return true;
      if (currentNode.nodeType === NODE_TYPE.processingInstruction) return true;
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
      return false;
    };
    const _matchesNameCheck = function _matchesNameCheck2(check, name) {
      if (check instanceof RegExp) return regExpTest(check, name);
      if (check instanceof Function) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
        return Boolean(check(name, ...args));
      }
      return false;
    };
    const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName, root) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode);
        const childNodes = getChildNodes(currentNode);
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
            parentNode.insertBefore(hoisted, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    };
    const _forkSharedAllowlist = function _forkSharedAllowlist2(hookList, set, defaultSet, setConfigSet) {
      if (hookList.length === 0) return set;
      return set === defaultSet || set === setConfigSet ? clone(set) : set;
    };
    const _handleHookDetachedNode = function _handleHookDetachedNode2(currentNode, root) {
      if (currentNode === root || getParentNode(currentNode) !== null) return false;
      if (IN_PLACE) _neutralizeSubtree(currentNode);
      return true;
    };
    const _sanitizeElements = function _sanitizeElements2(currentNode, root) {
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (_handleHookDetachedNode(currentNode, root)) return true;
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(_readNodeName(currentNode));
      ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (_handleHookDetachedNode(currentNode, root)) return true;
      if (_isUnsafeNode(currentNode, tagName)) {
        _forceRemove(currentNode);
        return true;
      }
      if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
        const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
        if (removed === false) {
          _executeHooks(hooks.afterSanitizeElements, currentNode, null);
          if (_handleHookDetachedNode(currentNode, root)) return true;
        }
        return removed;
      }
      if (_readNodeType(currentNode) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        const content = _stripTemplateExpressions(currentNode.textContent);
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return _handleHookDetachedNode(currentNode, root);
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (FORBID_ATTR[lcName]) return false;
      if (_isPatchLinkageAttribute(lcName, lcTag)) return false;
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) return false;
      const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) return true;
      if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) return true;
      if (!nameIsPermitted) return _isBasicCustomElement(lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName, lcTag) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value);
      if (URI_SAFE_ATTRIBUTES[lcName]) return true;
      if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
      if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) return true;
      if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
      return !value;
    };
    const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
      "annotation-xml",
      "color-profile",
      "font-face",
      "font-face-format",
      "font-face-name",
      "font-face-src",
      "font-face-uri",
      "missing-glyph"
    ]);
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
    };
    const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
        case "TrustedHTML":
          return _createTrustedHTML(value);
        case "TrustedScriptURL":
          return _createTrustedScriptURL(value);
      }
      return value;
    };
    const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
      try {
        if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
        else currentNode.setAttribute(name, value);
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
          return false;
        }
        return true;
      } catch (_2) {
        _removeAttribute(name, currentNode);
        return false;
      }
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode, root) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      if (_handleHookDetachedNode(currentNode, root)) return;
      const attributes = currentNode.attributes;
      if (!attributes || _isClobbered(currentNode)) return;
      ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      const lcTag = transformCaseFunc(currentNode.nodeName);
      while (l--) {
        const attr = attributes[l];
        const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        let recreatedNamedProp = false;
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
          _removeAttribute(name, currentNode, attr);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
          recreatedNamedProp = true;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (lcName === "attributename" && stringMatch(value, "href")) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (hookEvent.forceKeepAttr) continue;
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode, attr);
          continue;
        }
        value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
        if (value !== initValue) {
          if (_setAttributeValue(currentNode, name, namespaceURI, value) && recreatedNamedProp) arrayPop(DOMPurify.removed);
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
      _handleHookDetachedNode(currentNode, root);
    };
    const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode, fragment);
        _sanitizeAttributes(shadowNode, fragment);
        if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
        if (_readNodeType(shadowNode) === NODE_TYPE.element) {
          const innerSr = getShadowRoot(shadowNode);
          if (_isDocumentFragment(innerSr)) {
            _sanitizeAttachedShadowRoots(innerSr);
            _sanitizeShadowDOM2(innerSr);
          }
        }
      }
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
      const stack = [{
        node: root,
        shadow: null
      }];
      while (stack.length > 0) {
        const item = stack.pop();
        if (item.shadow) {
          _sanitizeShadowDOM2(item.shadow);
          continue;
        }
        const node = item.node;
        const isElement = _readNodeType(node) === NODE_TYPE.element;
        const childNodes = getChildNodes(node);
        if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
          node: childNodes[i],
          shadow: null
        });
        if (isElement) {
          const rootName = getNodeName ? getNodeName(node) : null;
          if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
            const content = node.content;
            if (_isDocumentFragment(content)) stack.push({
              node: content,
              shadow: null
            });
          }
        }
        if (isElement) {
          const sr = getShadowRoot(node);
          if (_isDocumentFragment(sr)) stack.push({
            node: null,
            shadow: sr
          }, {
            node: sr,
            shadow: null
          });
        }
      }
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) dirty = "<!-->";
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        dirty = stringifyValue(dirty);
        if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
      }
      if (!DOMPurify.isSupported) return dirty;
      if (SET_CONFIG) {
        ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
        ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
      } else _parseConfig(cfg);
      if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) ALLOWED_TAGS = clone(ALLOWED_TAGS);
      if (hooks.uponSanitizeAttribute.length > 0) ALLOWED_ATTR = clone(ALLOWED_ATTR);
      DOMPurify.removed = [];
      const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
      if (inPlace) {
        _neutralizePatchLinkage(dirty);
        const nn = _readNodeName(dirty);
        if (typeof nn === "string") {
          const tagName = transformCaseFunc(nn);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            _neutralizeRoot(dirty);
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
        if (_isClobbered(dirty)) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
        }
        try {
          _sanitizeAttachedShadowRoots(dirty);
        } catch (error) {
          _neutralizeRoot(dirty);
          throw error;
        }
      } else if (_isNode(dirty)) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
        else if (importedNode.nodeName === "HTML") body = importedNode;
        else body.appendChild(importedNode);
        _sanitizeAttachedShadowRoots(body);
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
        body = _initDocument(dirty);
        if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
      if (body && FORCE_BODY) _forceRemove(body.firstChild);
      const walkRoot = inPlace ? dirty : body;
      try {
        const nodeIterator = _createNodeIterator(walkRoot);
        while (currentNode = nodeIterator.nextNode()) {
          _sanitizeElements(currentNode, walkRoot);
          _sanitizeAttributes(currentNode, walkRoot);
          if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
        }
      } catch (error) {
        if (inPlace) {
          _neutralizeRoot(dirty);
          arrayForEach(DOMPurify.removed, (entry) => {
            if (entry.element) _neutralizeSubtree(entry.element);
          });
        }
        throw error;
      }
      if (inPlace) {
        let rootWasRemoved = false;
        arrayForEach(DOMPurify.removed, (entry) => {
          if (entry.element) {
            if (entry.element === dirty) rootWasRemoved = true;
            _neutralizeSubtree(entry.element);
          }
        });
        if (rootWasRemoved) throw typeErrorCreate("a node selected for removal could not be safely returned; refusing to sanitize in place");
        if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
        return dirty;
      }
      if (RETURN_DOM) {
        if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) returnNode.appendChild(body.firstChild);
        } else returnNode = body;
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      if (SAFE_FOR_TEMPLATES) serializedHTML = _stripTemplateExpressions(serializedHTML);
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
      SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
      SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
      SET_CONFIG_ALLOWED_TAGS = null;
      SET_CONFIG_ALLOWED_ATTR = null;
      trustedTypesPolicy = defaultTrustedTypesPolicy;
      emptyHTML = "";
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) _parseConfig({});
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") return;
      if (!objectHasOwnProperty(hooks, entryPoint)) return;
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (!objectHasOwnProperty(hooks, entryPoint)) return;
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (!objectHasOwnProperty(hooks, entryPoint)) return;
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var purify_default = createDOMPurify();

  // src/parser.ts
  var parseDocument = (html2) => new DOMParser().parseFromString(html2, "text/html");
  var text2 = (el2) => el2?.textContent?.trim() || "";
  var timestamp = (el2) => {
    const exact = el2?.getAttribute("title")?.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})(?:\s+[+-]\d{2}:\d{2})?$/);
    return exact ? `${exact[1]} ${exact[2]}` : text2(el2);
  };
  var savedTab = () => {
    try {
      const cookie = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("V2EX_TAB="));
      if (!cookie) return;
      const value = decodeURIComponent(cookie.slice("V2EX_TAB=".length)).replace(/^"|"$/g, "");
      const fields = value.split("|");
      if (fields[0] !== "2" || fields[3] !== "8:V2EX_TAB") return;
      const payload = fields[4]?.match(/^(\d+):([A-Za-z0-9+/=]+)$/);
      if (!payload || Number(payload[1]) !== payload[2].length) return;
      const tab = atob(payload[2]);
      return /^[a-z0-9_]+$/.test(tab) ? tab : void 0;
    } catch {
      return;
    }
  };
  var absolute = (value, base) => new URL(value, base).href;
  var links = (elements, base) => Array.from(elements).flatMap((el2) => {
    const href = el2.getAttribute("href");
    return href && !href.startsWith("javascript:") ? [{ label: text2(el2), url: absolute(href, base) }] : [];
  });
  var image = (el2, base) => {
    const src = el2?.getAttribute("src");
    if (!src) return "";
    const url = new URL(src, base);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  };
  var member = (el2) => {
    const href = el2?.getAttribute("href") || "";
    return href.match(/\/member\/([^/?#]+)/)?.[1] || text2(el2);
  };
  function session(doc, base) {
    const link = doc.querySelector('#Top a[href^="/member/"]');
    return { user: link ? member(link) : "", avatar: image(doc.querySelector("#Right img.avatar"), base) };
  }
  function safeHTML(html2, base) {
    const clean = purify_default.sanitize(html2, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["form", "input", "textarea", "button", "select", "style", "iframe", "video", "audio"],
      FORBID_ATTR: ["style", "srcset", "id", "name", "tabindex"],
      ALLOW_DATA_ATTR: false
    });
    const template = document.createElement("template");
    template.innerHTML = clean;
    embedImageURLs(template.content);
    template.content.querySelectorAll("[class]").forEach((el2) => {
      const classes = [...el2.classList].filter((c) => ["markdown_body", "embedded_image", "emoji"].includes(c) || /^language-[a-z0-9_-]+$/i.test(c));
      if (classes.length) el2.setAttribute("class", classes.join(" "));
      else el2.removeAttribute("class");
    });
    template.content.querySelectorAll("a[href], img[src]").forEach((el2) => {
      const attr = el2.tagName === "A" ? "href" : "src";
      const value = el2.getAttribute(attr);
      try {
        const url = new URL(value, base);
        if (!["http:", "https:", ...attr === "href" ? ["mailto:"] : []].includes(url.protocol)) {
          el2.removeAttribute(attr);
          return;
        }
        el2.setAttribute(attr, url.href);
        if (attr === "href") {
          el2.setAttribute("target", "_blank");
          el2.setAttribute("rel", "noopener noreferrer");
        } else {
          el2.setAttribute("loading", "lazy");
          el2.setAttribute("referrerpolicy", "no-referrer");
        }
      } catch {
        el2.removeAttribute(attr);
      }
    });
    return template.innerHTML;
  }
  function embedImageURLs(content) {
    const isImageURL = (value) => {
      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) && /\.(?:png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(url.pathname);
      } catch {
        return false;
      }
    };
    const preview = (url) => {
      const img = document.createElement("img");
      img.src = url;
      img.alt = url;
      img.className = "embedded_image";
      return img;
    };
    content.querySelectorAll("a[href]").forEach((link) => {
      if (link.closest("pre, code, kbd, samp") || link.children.length) return;
      const href = link.getAttribute("href");
      if (link.textContent?.trim() === href && isImageURL(href)) link.replaceChildren(preview(href));
    });
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement?.closest("a, pre, code, kbd, samp")) continue;
      const value = node.data;
      const replacement = document.createDocumentFragment();
      let end = 0;
      for (const match of value.matchAll(/https?:\/\/[^\s<>"'，。；！？、（）【】]+/gi)) {
        const url = match[0].replace(/[.,;!?\)\]]+$/, "");
        if (!isImageURL(url)) continue;
        replacement.append(value.slice(end, match.index));
        const link = document.createElement("a");
        link.href = url;
        link.append(preview(url));
        replacement.append(link);
        end = match.index + url.length;
      }
      if (end) {
        replacement.append(value.slice(end));
        node.replaceWith(replacement);
      }
    }
  }
  function pagination(doc, base) {
    const current = Number(text2(doc.querySelector("#Main .page_current"))) || Number(new URL(base).searchParams.get("p")) || 1;
    const pages = links(doc.querySelectorAll("#Main .page_normal, #Main .page_current"), base);
    const total = Math.max(current, ...pages.map((p) => Number(p.label) || 1), Number(doc.querySelector("#Main .page_input")?.getAttribute("max")) || 1);
    const unique = new Map(pages.map((p) => [p.url, p]));
    return { current, total, links: [...unique.values()] };
  }
  function parseList(doc, base) {
    if (!doc.querySelector("#Main")) throw new Error("未识别到 V2EX 列表，请查看原页面。");
    const breadcrumb = text2(doc.querySelector("#Main .node-breadcrumb"));
    const nodeTitle = breadcrumb.replace(/^V2EX\s*›\s*/, "");
    const cells = Array.from(doc.querySelectorAll("#Main .cell.item, #Main .cell:has(.item_title)"));
    const knownEmptyList = doc.querySelector("#Tabs, #Main .node-header, #TopicsNode") || new URL(base).pathname === "/my/topics" && doc.querySelector("#Main .header");
    if (!cells.length && !knownEmptyList) throw new Error(serverError(doc) || "列表结构无法识别，请查看原页面。");
    const items = cells.flatMap((cell) => {
      const link = cell.querySelector('.item_title a[href*="/t/"]');
      if (!link) return [];
      const url = absolute(link.getAttribute("href"), base);
      const id = new URL(url).pathname.match(/^\/t\/(\d+)/)?.[1];
      if (!id) return [];
      const info = cell.querySelector(".topic_info");
      const authors = info?.querySelectorAll('a[href*="/member/"]');
      const node = cell.querySelector('a.node, a[href^="/go/"]');
      const timestamp2 = info?.querySelector("[title]");
      return [{
        id,
        url,
        title: text2(link),
        author: member(authors?.[0] || null),
        avatar: image(cell.querySelector("img.avatar"), base),
        node: { label: text2(node) || nodeTitle, url: node ? absolute(node.getAttribute("href"), base) : base },
        replies: Number(text2(cell.querySelector(".count_livid, .count_orange"))) || 0,
        time: timestamp2?.getAttribute("title")?.match(/\b(\d{2}:\d{2}):\d{2}/)?.[1] || text2(timestamp2),
        lastUser: authors && authors.length > 1 ? member(authors[authors.length - 1]) : ""
      }];
    });
    const title = nodeTitle || text2(doc.querySelector('#Main .header h1, #Main .header a[href^="/go/"]')) || "V2EX";
    const activeTab = doc.querySelector("#Tabs a.tab_current")?.getAttribute("href");
    const listURL = new URL(base);
    const fallbackTab = listURL.searchParams.get("tab") || (listURL.pathname === "/" ? savedTab() : void 0);
    return {
      url: base,
      title,
      items,
      tabs: links(doc.querySelectorAll('#Tabs a[href^="/?tab="]'), base),
      currentTab: activeTab ? absolute(activeTab, base) : fallbackTab ? absolute(`/?tab=${fallbackTab}`, base) : void 0,
      nodes: links(doc.querySelectorAll('#SecondaryTabs a[href^="/go/"]'), base),
      pagination: pagination(doc, base),
      session: session(doc, base)
    };
  }
  function parseForm(form, base, kind) {
    const fields = {};
    form.querySelectorAll("input[name], textarea[name], select[name]").forEach((el2) => {
      if (el2.disabled || ["button", "submit", "file", "reset"].includes(el2.getAttribute("type") || "")) return;
      if (el2 instanceof HTMLInputElement && ["checkbox", "radio"].includes(el2.type) && !el2.checked) return;
      fields[el2.name] = el2.value;
    });
    const title = form.querySelector('#topic_title, input[name="title"], textarea[name="title"], input[name="topic_title"], textarea[name="topic_title"]');
    const textareas = Array.from(form.querySelectorAll("textarea[name]")).filter((el2) => el2 !== title);
    const content = textareas.find((el2) => el2.id === "topic_content" || ["content", "topic_content"].includes(el2.name)) || textareas[0];
    if (!content) throw new Error("未识别到编辑表单，请在原站完成此操作。");
    const node = form.querySelector('[name="node_name"], [name="node"], #node_name');
    if (kind === "new" && !title) throw new Error("未识别到发帖标题字段，请在原站发帖。");
    const action2 = absolute(form.getAttribute("action") || base, base);
    if (new URL(action2).origin !== new URL(base).origin) throw new Error("表单提交地址不是当前 V2EX 域名。");
    return {
      action: action2,
      method: (form.getAttribute("method") || "POST").toUpperCase(),
      fields,
      contentKey: content.name,
      titleKey: title?.name,
      nodeKey: node?.name,
      nodes: Array.from(form.querySelectorAll("select[name] option[value]")).filter((o) => o.value).map((o) => ({ label: o.textContent || o.value, url: o.value }))
    };
  }
  function action(el2, base, kind, id) {
    if (!el2) return void 0;
    const label = text2(el2);
    const onclick = el2.getAttribute("onclick") || "";
    const href = el2.getAttribute("href") || "";
    const prompt = onclick.match(/confirm\(['"]([^'"]+)['"]\)/)?.[1] || el2.getAttribute("data-confirm") || "";
    if (kind === "favorite") {
      const path2 = href.startsWith("/") ? href : onclick.match(/(?:location(?:\.href)?\s*=|location\.(?:assign|replace)\()\s*['"]([^'"]+)['"]/)?.[1];
      if (!path2 || !/^\/(?:un)?favorite\/topic\/\d+/.test(path2)) return void 0;
      return { url: absolute(path2, base), method: "GET", label, done: /取消|Unfavorite|Remove/i.test(label), prompt };
    }
    if (/感谢已|thanked/i.test(el2.outerHTML) && !onclick.includes("thank")) return { url: "", method: "POST", label, done: true, prompt };
    const call = onclick.match(/thank(?:Topic|Reply)\(\s*(\d+)/);
    const path = href.match(/^\/thank\/(?:topic|reply)\/\d+/);
    if (!call && !path) return void 0;
    if (call && call[1] !== id) return void 0;
    return { url: absolute(path ? href : `/thank/${kind}/${id}`, base), method: "POST", label, done: false, prompt };
  }
  function parseTopic(doc, base) {
    const id = new URL(base).pathname.match(/^\/t\/(\d+)/)?.[1];
    const header = doc.querySelector("#Main .header:has(h1)");
    if (!id || !header) throw new Error("话题无法读取，可能需要登录或已被删除。");
    const author = header.querySelector('small a[href^="/member/"], .gray a[href^="/member/"]');
    const node = header.querySelector('a[href^="/go/"]');
    const body = doc.querySelector("#Main .topic_content");
    const replyForm = Array.from(doc.querySelectorAll("#Main form")).find((f) => f.querySelector("textarea[name]"));
    const favoriteEl = Array.from(doc.querySelectorAll("#Main a")).find((a) => /\/(?:un)?favorite\/topic\//.test(a.getAttribute("href") || a.getAttribute("onclick") || ""));
    const thankEl = doc.querySelector('#topic_thank a, a[onclick*="thankTopic"], #topic_thank .topic_thanked');
    const messages = Array.from(doc.querySelectorAll('#Main .cell[id^="r_"]')).flatMap((cell) => {
      const content = cell.querySelector(".reply_content");
      if (!content) return [];
      const replyId = cell.id.replace("r_", "");
      return [{
        id: replyId,
        floor: text2(cell.querySelector(".no")),
        author: member(cell.querySelector('strong a[href^="/member/"]')),
        avatar: image(cell.querySelector("img.avatar"), base),
        time: timestamp(cell.querySelector(".ago")),
        html: safeHTML(content.innerHTML, base),
        thank: action(cell.querySelector('a[onclick*="thankReply"], [id^="thank_area_"] a, [id^="thank_area_"].thanked'), base, "reply", replyId)
      }];
    });
    const page = pagination(doc, base);
    const countText = Array.from(doc.querySelectorAll("#Main .cell")).map((c) => text2(c.querySelector("span.gray"))).find((t) => /\d+\s*(?:replies|条回复)/i.test(t)) || "";
    const replies = Number(countText.match(/(\d+)\s*(?:replies|条回复)/i)?.[1]) || messages.length;
    const supplements = Array.from(doc.querySelectorAll("#Main .subtle")).map((el2) => ({
      label: text2(el2.querySelector(".fade, .gray")) || "补充内容",
      html: safeHTML(el2.querySelector(".topic_content")?.innerHTML || el2.innerHTML, base)
    }));
    return {
      id,
      url: base,
      title: text2(header.querySelector("h1")),
      node: { label: text2(node), url: node ? absolute(node.getAttribute("href"), base) : base },
      author: member(author || header.querySelector('.fr a[href^="/member/"]')),
      avatar: image(header.querySelector("img.avatar"), base),
      time: timestamp(header.querySelector("small [title], .gray [title]")),
      html: safeHTML(body?.innerHTML || "", base),
      supplements,
      messages,
      replies,
      pagination: page,
      session: session(doc, base),
      replyForm: replyForm ? parseForm(replyForm, base, "reply") : void 0,
      replyNotice: text2(doc.querySelector("#reply-box .cell, #reply-box")),
      favorite: action(favoriteEl || null, base, "favorite", id),
      thank: action(thankEl, base, "topic", id)
    };
  }
  function serverError(doc) {
    return text2(doc.querySelector("#Main .problem, .problem, #Main .message.error, #Main .error"));
  }

  // src/api.ts
  function sameOrigin(input) {
    const url = new URL(input, location.origin);
    if (url.origin !== location.origin || !["https:", "http:"].includes(url.protocol)) throw new Error("仅允许请求当前 V2EX 域名。");
    url.hash = "";
    url.searchParams.delete("v2wc");
    return url;
  }
  async function loadPage(input, signal) {
    const response = await fetch(sameOrigin(input), { credentials: "same-origin", signal, redirect: "follow" });
    if (!response.ok) throw new Error(response.status === 429 ? "访问过于频繁，请稍后重试。" : `页面读取失败（${response.status}），请查看原页面。`);
    if (new URL(response.url).origin !== location.origin) throw new Error("页面跳转到其他域名，请在原站继续。");
    const doc = parseDocument(await response.text());
    if (new URL(response.url).pathname === "/signin") throw new Error("请先登录 V2EX，再回来继续。");
    if (!doc.querySelector("#Main")) throw new Error("页面暂时无法读取，可能需要在原站完成访问验证。");
    return { doc, url: response.url };
  }
  async function freshOnce() {
    const response = await fetch("/poll_once", { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new Error("无法刷新操作令牌，请在原站重新登录。");
    const token = (await response.text()).trim();
    if (!/^\d+$/.test(token)) throw new Error("登录状态或校验令牌失效，请在原站重新登录。");
    return token;
  }
  function topicRedirect(doc, base, refresh) {
    const candidates = [];
    for (const value of [refresh, ...Array.from(doc.querySelectorAll("meta[http-equiv]")).filter((el2) => el2.getAttribute("http-equiv")?.toLowerCase() === "refresh").map((el2) => el2.getAttribute("content"))]) {
      const target = value?.match(/^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*(.*?)\s*$/i)?.[1];
      if (target) candidates.push(target.replace(/^(['"])(.*)\1$/, "$2"));
    }
    for (const script of doc.querySelectorAll("script:not([src])")) {
      const redirects = /(?:\b(?:window\.|document\.)?location(?:\.href)?\s*=\s*|\b(?:window\.|document\.)?location\.(?:replace|assign)\s*\(\s*)(['"])([^'"\r\n]+)\1/g;
      for (const match of (script.textContent || "").matchAll(redirects)) candidates.push(match[2]);
    }
    for (const target of candidates) {
      try {
        const url = sameOrigin(new URL(target, base).href);
        if (/^\/t\/\d+\/?$/.test(url.pathname)) return url.href;
      } catch {
      }
    }
  }
  async function submitForm(form, values) {
    const fields = { ...form.fields, ...values };
    if ("once" in fields) fields.once = await freshOnce();
    const body = new URLSearchParams(fields);
    const url = sameOrigin(form.action);
    if (form.method === "GET") body.forEach((v2, k2) => url.searchParams.set(k2, v2));
    const response = await fetch(url, {
      method: form.method,
      credentials: "same-origin",
      ...form.method !== "GET" ? { body } : {}
    });
    if (!response.ok) throw new Error(`提交失败（${response.status}），草稿已保留。`);
    if (new URL(response.url).origin !== location.origin || new URL(response.url).pathname === "/signin") throw new Error("登录已失效，草稿已保留，请重新登录。");
    let doc = parseDocument(await response.text());
    const error = serverError(doc);
    if (error) throw new Error(error);
    let resultURL = response.url;
    if (!doc.querySelector("#Main .header h1")) {
      const redirect = topicRedirect(doc, resultURL, response.headers.get("refresh"));
      if (redirect) {
        const page = await loadPage(redirect);
        doc = page.doc;
        resultURL = page.url;
        const redirectError = serverError(doc);
        if (redirectError) throw new Error(redirectError);
      }
    }
    if (!doc.querySelector("#Main .header h1")) throw new Error("服务器未确认提交成功，草稿已保留，请在原站检查。");
    return { doc, url: resultURL };
  }
  async function runAction(action2) {
    const url = sameOrigin(action2.url);
    url.searchParams.set("once", await freshOnce());
    const response = await fetch(url, { method: action2.method, credentials: "same-origin" });
    if (!response.ok) throw new Error(`操作失败（${response.status}）。`);
    if (new URL(response.url).origin !== location.origin || new URL(response.url).pathname === "/signin") throw new Error("请重新登录 V2EX。");
    const body = await response.text();
    if (action2.method === "POST") {
      let result;
      try {
        result = JSON.parse(body);
      } catch {
        throw new Error("服务器未确认操作成功，请在原站检查。");
      }
      if (!result.success) throw new Error(result.message || "操作未成功。");
    } else {
      const doc = parseDocument(body);
      const error = serverError(doc);
      if (error) throw new Error(error);
      if (!doc.querySelector("#Main")) throw new Error("无法确认收藏状态，请在原站检查。");
    }
  }

  // src/storage.ts
  function read(key, fallback) {
    try {
      return GM_getValue(key, fallback);
    } catch {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      GM_setValue(key, value);
    } catch {
    }
  }
  function menu(label, callback) {
    if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand(label, callback);
  }
  function draftKey(user, id) {
    return `draft:${user || "guest"}:${id}`;
  }

  // src/icons.ts
  var paths = {
    chat: '<path d="M20 11.5a8 8 0 0 1-8 8 9 9 0 0 1-3-.5L4 21l1.4-4.6A8 8 0 1 1 20 11.5Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
    plus: '<circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
    exit: '<path d="M9 4H4v16h5M9 12h12m-5-5 5 5-5 5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    back: '<path d="m14 6-6 6 6 6"/>',
    next: '<path d="m10 6 6 6-6 6"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5M5 7a8 8 0 0 1 13-2l2 2M4 17l2 2a8 8 0 0 0 13-2"/>'
  };
  function icon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.chat}</svg>`;
  }

  // src/dom.ts
  function el(tag, cls = "", text3 = "") {
    const node = document.createElement(tag);
    node.className = cls;
    node.textContent = text3;
    return node;
  }
  function button(label, callback, cls = "", symbol) {
    const node = el("button", cls);
    node.type = "button";
    node.title = label;
    node.setAttribute("aria-label", label);
    if (symbol) node.innerHTML = icon(symbol);
    else node.textContent = label;
    node.addEventListener("click", callback);
    return node;
  }
  function avatar(src, user, cls = "") {
    const box = el("span", `avatar ${cls}`, user.slice(0, 1).toUpperCase() || "V");
    if (src) {
      const img = el("img");
      img.src = src;
      img.alt = user;
      img.referrerPolicy = "no-referrer";
      img.addEventListener("load", () => box.classList.add("has-image"), { once: true });
      img.addEventListener("error", () => {
        img.remove();
        box.classList.remove("has-image");
      }, { once: true });
      box.append(img);
    }
    return box;
  }
  function nativeURL(input) {
    const url = new URL(input, location.origin);
    if (url.origin === location.origin) url.searchParams.set("v2wc", "off");
    return url.href;
  }
  function nativeLink(label, input, cls = "") {
    const node = el("a", cls, label);
    node.href = nativeURL(input);
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    return node;
  }

  // src/app.ts
  var supportedList = (path) => path === "/" || /^\/go\/[^/]+\/?$/.test(path) || path === "/my/topics";
  var supportedRoute = (path) => supportedList(path) || /^\/t\/\d+\/?$/.test(path);
  var homeTabs = ["技术", "创意", "好玩", "Apple", "酷工作", "交易", "城市", "问与答", "最热", "全部"].map((label, i) => ({
    label,
    url: `/?tab=${["tech", "creative", "play", "apple", "jobs", "deals", "city", "qna", "hot", "all"][i]}`
  }));
  var ChatApp = class {
    constructor(initial, restore2) {
      this.restore = restore2;
      this.user = initial.session;
      const stored = read(`context:${this.user.user || "guest"}`, "/?tab=all");
      this.listURL = "items" in initial ? initial.url : this.validListURL(stored);
      this.host.id = "v2wc-root";
      const style = el("style");
      style.textContent = style_default;
      this.shadow.append(style, this.shell);
      this.shell.append(this.rail, this.listPanel, this.chat);
      this.listPanel.setAttribute("aria-label", "话题列表");
      this.chat.setAttribute("aria-label", "话题聊天");
      this.buildListPanel();
      this.buildSplitter();
      this.renderRail();
      if ("items" in initial) {
        this.applyList(initial);
        this.renderEmpty();
      } else {
        this.topic = initial;
        this.renderTopic(initial);
      }
    }
    restore;
    host = el("div");
    shadow = this.host.attachShadow({ mode: "open" });
    shell = el("main", "app");
    listPanel = el("section", "list-panel");
    topics = el("div", "topics");
    listPages = el("div", "pagination");
    context = el("span", "context-title");
    search = el("input", "search");
    chat = el("section", "chat-panel");
    splitter = el("div", "panel-splitter");
    preferredListWidth = read("layout:list-width", null);
    resizePointer;
    chatScroll = el("div", "chat-scroll");
    rail = el("nav", "rail");
    list;
    topic;
    user;
    listURL;
    topicRequest;
    listRequest;
    navigating = false;
    disposed = false;
    pending = /* @__PURE__ */ new Set();
    reply;
    popup;
    drawer;
    modal;
    toastNode;
    toastTimer;
    scrollTimer;
    navVersion = 0;
    refreshListButton = button("刷新话题列表", () => void this.loadList(this.listURL), "mini", "refresh");
    mount() {
      document.body.append(this.host);
      this.updatePanelWidth();
      window.addEventListener("resize", this.updatePanelWidth);
      history.replaceState(this.historyContext(), "", location.href);
      window.addEventListener("popstate", this.onPopState);
      window.addEventListener("hashchange", this.onHashChange);
      this.shadow.addEventListener("click", this.onContentLink);
      this.shadow.addEventListener("keydown", this.onEscape);
      this.topics.addEventListener("scroll", this.recordScroll, { passive: true });
      this.shell.addEventListener("click", (event) => {
        if (this.popup && !this.popup.contains(event.target) && !event.target.closest("[data-menu]")) this.closePopup();
      });
      if (!this.list) void this.loadList(this.listURL);
      requestAnimationFrame(() => this.locateHash());
    }
    dispose() {
      this.disposed = true;
      this.topicRequest?.abort();
      this.listRequest?.abort();
      clearTimeout(this.toastTimer);
      clearTimeout(this.scrollTimer);
      window.removeEventListener("resize", this.updatePanelWidth);
      window.removeEventListener("popstate", this.onPopState);
      window.removeEventListener("hashchange", this.onHashChange);
      this.host.remove();
    }
    updatePanelWidth = () => {
      const available = this.shell.clientWidth - this.rail.getBoundingClientRect().width;
      const max = Math.max(240, available - 420);
      const fallback = Math.min(410, Math.max(320, this.shell.clientWidth * 0.2));
      const preferred = typeof this.preferredListWidth === "number" && Number.isFinite(this.preferredListWidth) ? this.preferredListWidth : fallback;
      const width = Math.min(max, Math.max(240, preferred));
      this.shell.style.setProperty("--list-width", `${width}px`);
      this.splitter.setAttribute("aria-valuemin", "420");
      this.splitter.setAttribute("aria-valuemax", `${Math.round(available - 240)}`);
      this.splitter.setAttribute("aria-valuenow", `${Math.round(available - width)}`);
      this.splitter.setAttribute("aria-valuetext", `内容详情区宽度 ${Math.round(available - width)} 像素`);
    };
    buildSplitter() {
      this.splitter.tabIndex = 0;
      this.splitter.setAttribute("role", "separator");
      this.splitter.setAttribute("aria-orientation", "vertical");
      this.splitter.setAttribute("aria-label", "调整内容详情区宽度");
      this.splitter.title = "左右拖动调整详情宽度，双击恢复默认；也可使用左右方向键";
      const setWidth = (width) => {
        this.preferredListWidth = width;
        this.updatePanelWidth();
        this.preferredListWidth = this.listPanel.getBoundingClientRect().width;
      };
      const reset = () => {
        this.preferredListWidth = null;
        write("layout:list-width", null);
        this.updatePanelWidth();
      };
      this.splitter.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || this.resizePointer) return;
        event.preventDefault();
        this.splitter.focus();
        this.resizePointer = { id: event.pointerId, x: event.clientX, width: this.listPanel.getBoundingClientRect().width };
        this.splitter.setPointerCapture(event.pointerId);
        this.shell.classList.add("resizing-panels");
      });
      this.splitter.addEventListener("pointermove", (event) => {
        if (this.resizePointer?.id === event.pointerId) setWidth(this.resizePointer.width + event.clientX - this.resizePointer.x);
      });
      const finish = (event) => {
        if (this.resizePointer?.id !== event.pointerId) return;
        this.resizePointer = void 0;
        this.shell.classList.remove("resizing-panels");
        if (this.splitter.hasPointerCapture(event.pointerId)) this.splitter.releasePointerCapture(event.pointerId);
        write("layout:list-width", this.preferredListWidth);
      };
      this.splitter.addEventListener("pointerup", finish);
      this.splitter.addEventListener("pointercancel", finish);
      this.splitter.addEventListener("lostpointercapture", finish);
      this.splitter.addEventListener("dblclick", reset);
      this.splitter.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          reset();
        }
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        setWidth(this.listPanel.getBoundingClientRect().width + (event.key === "ArrowRight" ? 24 : -24));
        write("layout:list-width", this.preferredListWidth);
      });
      this.listPanel.append(this.splitter);
    }
    validListURL(input) {
      try {
        const url = new URL(input, location.origin);
        if (url.origin === location.origin && supportedList(url.pathname)) return url.href;
      } catch {
      }
      return new URL("/?tab=all", location.origin).href;
    }
    historyContext() {
      return { v2wc: true, listURL: this.listURL, listScroll: this.topics.scrollTop, chatScroll: this.chatScroll.scrollTop };
    }
    saveHistory() {
      history.replaceState(this.historyContext(), "", location.href);
    }
    pushURL(url) {
      this.saveHistory();
      history.pushState(this.historyContext(), "", url);
    }
    buildListPanel() {
      const head = el("header", "list-head");
      head.append(el("h1", "", "V2EX"), button("发表新话题", () => void this.openNewTopic(), "add", "plus"));
      const searchWrap = el("div", "search-wrap");
      searchWrap.innerHTML = icon("search");
      this.search.type = "search";
      this.search.placeholder = "搜索";
      this.search.setAttribute("aria-label", "筛选当前列表标题");
      this.search.addEventListener("input", () => this.renderList());
      searchWrap.append(this.search);
      const contextRow = el("div", "list-context");
      contextRow.append(this.context, this.refreshListButton);
      this.listPanel.append(head, searchWrap, contextRow, this.topics, this.listPages);
    }
    renderRail() {
      this.rail.replaceChildren();
      this.rail.setAttribute("aria-label", "主导航");
      const brand = button("V2EX 首页", () => {
        this.closeDrawer();
        void this.navigate("/?tab=all");
      }, "brand");
      const logo = el("img");
      logo.src = `${location.origin}/static/icon-192.png`;
      logo.alt = "V2EX";
      brand.replaceChildren(logo);
      this.rail.append(
        brand,
        button("话题", () => {
          this.closeDrawer();
          void this.navigate(new URL(this.listURL, location.origin).pathname === "/my/topics" ? "/?tab=all" : this.listURL);
        }, "rail-button", "chat"),
        this.railLink("通知", "/notifications", "bell"),
        button("分类和节点", () => void this.openNodes(), "rail-button", "compass"),
        button("我的收藏", () => {
          this.closeDrawer();
          void this.navigate("/my/topics");
        }, "rail-button", "star"),
        this.railLink("账号设置", "/settings", "user"),
        el("div", "rail-space"),
        button("恢复原站界面", () => this.restore(), "rail-button", "exit")
      );
      const profile = this.railLink(this.user.user ? `个人资料：${this.user.user}` : "登录 V2EX", this.user.user ? `/member/${this.user.user}` : "/signin", "user");
      profile.classList.add("rail-profile");
      profile.replaceChildren(avatar(this.user.avatar, this.user.user || "V"));
      this.rail.append(profile);
      this.updateRailSelection();
    }
    updateRailSelection() {
      const selected = this.drawer ? "分类和节点" : new URL(this.listURL, location.origin).pathname === "/my/topics" ? "我的收藏" : "话题";
      for (const control of this.rail.querySelectorAll(".rail-button")) {
        const active = control.getAttribute("aria-label") === selected;
        control.classList.toggle("active", active);
        if (active) control.setAttribute("aria-current", "true");
        else control.removeAttribute("aria-current");
      }
    }
    railLink(label, url, symbol) {
      const link = nativeLink("", url, "rail-button");
      link.title = label;
      link.setAttribute("aria-label", label);
      link.innerHTML = icon(symbol);
      return link;
    }
    applyList(list) {
      this.list = list;
      this.listURL = list.url;
      if (list.session.user !== this.user.user) {
        this.user = list.session;
        this.renderRail();
      }
      this.updateRailSelection();
      write(`context:${this.user.user || "guest"}`, this.listURL);
      this.context.textContent = (list.tabs.length ? list.tabs : homeTabs).find((t) => this.isCurrentList(t.url))?.label || (list.url.includes("/my/topics") ? "我的收藏" : list.title === "V2EX" ? "话题" : list.title);
      this.listPanel.querySelector("h1").title = this.context.textContent;
      this.renderList();
      this.renderPagination(this.listPages, list.pagination, (url) => void this.navigate(url));
    }
    renderList() {
      this.topics.replaceChildren();
      const query = this.search.value.trim().toLowerCase();
      const items = this.list?.items.filter((i) => i.title.toLowerCase().includes(query)) || [];
      for (const item of items) {
        const topicURL = new URL(item.url);
        topicURL.hash = "";
        const row = button(item.title, () => void this.navigate(topicURL.href), `topic-row${item.id === this.topic?.id ? " selected" : ""}`);
        row.setAttribute("aria-current", item.id === this.topic?.id ? "true" : "false");
        row.dataset.topicId = item.id;
        const info = el("div", "row-info");
        const top = el("div", "row-top");
        let time = item.time;
        const exact = time.match(/\b(\d{1,2}:\d{2})\b/);
        if (exact) time = exact[1];
        top.append(el("span", "row-title", item.title), el("span", "row-time", time));
        info.append(top, el("div", "row-detail", [item.node.label, item.replies ? `${item.replies} 条回复` : "还没有回复", item.lastUser].filter(Boolean).join(" · ")));
        row.replaceChildren(avatar(item.avatar, item.author), info);
        this.topics.append(row);
      }
      if (!items.length) this.topics.append(el("div", "list-empty", query ? "当前列表没有匹配的话题" : "这里还没有话题"));
    }
    renderPagination(container, pages, go) {
      container.replaceChildren();
      container.hidden = pages.total <= 1;
      const urlFor = (page) => {
        const found = pages.links.find((p) => Number(p.label) === page);
        if (found) return found.url;
        const url = new URL(container === this.listPages ? this.listURL : this.topic.url);
        url.searchParams.set("p", String(page));
        url.hash = "";
        return url.href;
      };
      const prev = button("上一页", () => go(urlFor(pages.current - 1)), "", "back");
      prev.disabled = pages.current <= 1;
      const next = button("下一页", () => go(urlFor(pages.current + 1)), "", "next");
      next.disabled = pages.current >= pages.total;
      container.append(prev, el("span", "", `${pages.current} / ${pages.total}`), next);
    }
    async loadList(url) {
      this.listRequest?.abort();
      const controller = this.listRequest = new AbortController();
      this.refreshListButton.disabled = true;
      if (!this.list) this.topics.replaceChildren(el("div", "loading", "正在读取话题…"));
      try {
        const page = await loadPage(url, controller.signal);
        if (controller.signal.aborted || this.disposed) return;
        this.applyList(parseList(page.doc, page.url));
      } catch (error) {
        if (controller.signal.aborted || this.disposed) return;
        this.toast(this.errorText(error), url, true);
        if (!this.list) this.topics.replaceChildren(el("div", "list-empty", "列表加载失败，请刷新或查看原页面"));
      } finally {
        if (!controller.signal.aborted) this.refreshListButton.disabled = false;
      }
    }
    async navigate(input, historyMode = "push", scroll) {
      const url = new URL(input, location.origin);
      if (url.origin !== location.origin || !supportedRoute(url.pathname)) {
        window.open(nativeURL(url.href), "_blank", "noopener");
        return;
      }
      this.closePopup();
      this.closeDrawer();
      const listScroll = this.topics.scrollTop;
      this.topicRequest?.abort();
      this.listRequest?.abort();
      const controller = this.topicRequest = new AbortController();
      const version = ++this.navVersion;
      this.navigating = true;
      this.setComposerBusy(true);
      this.chat.setAttribute("aria-busy", "true");
      if (!this.topic && supportedList(url.pathname)) this.context.textContent = "正在读取…";
      try {
        const page = await loadPage(url.href, controller.signal);
        if (controller.signal.aborted || this.disposed) return;
        if (supportedList(url.pathname)) {
          const list = parseList(page.doc, page.url);
          if (historyMode === "push") this.pushURL(url.href);
          if (historyMode === "replace") history.replaceState(this.historyContext(), "", url.href);
          this.topic = void 0;
          this.applyList(list);
          this.search.value = "";
          this.renderList();
          this.renderEmpty();
          document.title = `${list.title} - V2EX`;
        } else {
          const topic = parseTopic(page.doc, page.url);
          topic.url = url.href;
          if (historyMode === "push") this.pushURL(url.href);
          if (historyMode === "replace") history.replaceState(this.historyContext(), "", url.href);
          this.topic = topic;
          this.user = topic.session;
          this.renderRail();
          this.renderTopic(topic);
          this.renderList();
          document.title = `${topic.title} - V2EX`;
          if (scroll && scroll.listURL !== this.listURL) await this.loadList(scroll.listURL);
        }
        this.topics.scrollTop = scroll?.listScroll ?? (supportedList(url.pathname) ? 0 : listScroll);
        this.chatScroll.scrollTop = scroll?.chatScroll || 0;
        this.locateHash();
        history.replaceState(this.historyContext(), "", location.href);
        if (!this.list) void this.loadList(this.listURL);
      } catch (error) {
        if (!controller.signal.aborted && !this.disposed) {
          if (historyMode === "pop") {
            this.topic = void 0;
            this.renderEmpty("页面加载失败，请重试或查看原页面");
            this.renderList();
          }
          this.toast(this.errorText(error), url.href, true);
        }
      } finally {
        if (version === this.navVersion && !this.disposed) {
          this.navigating = false;
          this.chat.removeAttribute("aria-busy");
          this.setComposerBusy(false);
          this.refreshListButton.disabled = false;
        }
      }
    }
    renderEmpty(message = "从左侧选择一个话题") {
      this.chat.replaceChildren();
      this.reply = void 0;
      const empty = el("div", "empty");
      empty.innerHTML = icon("chat");
      empty.append(el("div", "empty-brand", "V2EX"), el("p", "", message));
      this.chat.append(empty);
    }
    renderTopic(topic) {
      this.chat.replaceChildren();
      const head = el("header", "chat-head");
      const heading = el("div", "chat-heading");
      const subtitle = el("div", "chat-subtitle");
      const node = button(topic.node.label, () => void this.navigate(topic.node.url));
      subtitle.append(node, document.createTextNode(` · ${topic.replies} 条回复`));
      heading.append(el("h2", "chat-title", topic.title), subtitle);
      const actions = el("div", "head-actions");
      const more = button("话题操作", () => this.openTopicMenu(), "icon-button", "more");
      more.dataset.menu = "true";
      actions.append(more);
      head.append(heading, actions);
      this.chatScroll = el("div", "chat-scroll");
      this.chatScroll.setAttribute("aria-label", "正文和回复");
      this.chatScroll.addEventListener("scroll", this.recordScroll, { passive: true });
      this.chatScroll.append(this.renderMessage({ id: `topic-${topic.id}`, floor: "", author: topic.author, avatar: topic.avatar, time: topic.time, html: topic.html || "<p>本话题没有正文</p>" }, true));
      for (const supplement of topic.supplements) {
        const message = this.renderMessage({ id: "", floor: "", author: topic.author, avatar: topic.avatar, time: "", html: supplement.html }, true);
        message.querySelector(".bubble")?.prepend(el("div", "supplement-label", supplement.label));
        this.chatScroll.append(message);
      }
      if (topic.pagination.current > 1) this.chatScroll.append(el("div", "thread-note", `第 ${topic.pagination.current} 页回复`));
      for (const message of topic.messages) this.chatScroll.append(this.renderMessage(message));
      if (!topic.messages.length) this.chatScroll.append(el("div", "thread-note", "还没有回复，聊两句吧"));
      const pages = el("div", "pagination");
      this.renderPagination(pages, topic.pagination, (url) => void this.navigate(url));
      this.chatScroll.append(pages);
      this.chat.append(head, this.chatScroll, this.renderComposer(topic));
    }
    renderMessage(message, original = false) {
      const own = !original && this.user.user && message.author === this.user.user;
      const row = el("article", `message${own ? " own" : ""}${original ? " original" : ""}`);
      if (message.id) row.id = original ? message.id : `r_${message.id}`;
      const content = el("div", "message-content");
      const meta = el("div", "message-meta");
      meta.append(button(message.author, () => this.mention(message.author), "message-user"), el("span", "message-time", message.time));
      const bubble = el("div", "bubble");
      const body = el("div", "bubble-body");
      body.innerHTML = message.html;
      body.querySelectorAll("img[src]").forEach((img) => {
        if (img.closest("a") || img.classList.contains("emoji")) return;
        const link = el("a");
        link.href = img.src;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = "查看原图";
        img.replaceWith(link);
        link.append(img);
      });
      body.querySelectorAll("table").forEach((table) => {
        const wrap = el("div", "table-scroll");
        table.replaceWith(wrap);
        wrap.append(table);
      });
      bubble.append(body);
      const actions = el("div", "message-actions");
      if (!original) {
        const url = new URL(this.topic.url);
        url.hash = `reply${message.floor}`;
        const permalink = el("a", "", `#${message.floor}`);
        permalink.href = url.href;
        permalink.addEventListener("click", (event) => {
          event.preventDefault();
          this.saveHistory();
          history.pushState(this.historyContext(), "", url);
          this.locateHash();
        });
        actions.append(permalink, button("回复", () => this.mention(message.author)));
        if (message.thank) {
          const thank = button(message.thank.done ? "已感谢" : "感谢", () => void this.performAction(message.thank, thank, "thank"));
          thank.disabled = message.thank.done;
          actions.append(thank);
        }
      }
      content.append(meta, bubble, actions);
      row.append(avatar(message.avatar, message.author), content);
      return row;
    }
    renderComposer(topic) {
      const composer = el("footer", "composer");
      const row = el("div", "compose-row");
      this.reply = el("textarea", "reply-input");
      this.reply.rows = 1;
      this.reply.placeholder = "发一条回复";
      this.reply.setAttribute("aria-label", "回复内容");
      const available = Boolean(topic.replyForm);
      this.reply.disabled = !available || this.pending.has(`reply:${topic.id}`);
      this.reply.value = read(draftKey(this.user.user, topic.id), "");
      const send = button("发送", () => void this.sendReply(), "send");
      send.dataset.send = "true";
      send.disabled = this.reply.disabled || !this.reply.value.trim();
      this.reply.addEventListener("input", () => {
        this.saveDraft();
        send.disabled = this.navigating || this.pending.has(`reply:${topic.id}`) || !this.reply.value.trim();
        this.resizeReply();
      });
      this.reply.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && !event.isComposing) {
          event.preventDefault();
          void this.sendReply();
        }
      });
      row.append(this.reply, send);
      composer.append(row);
      if (!available) {
        const note = el("div", "compose-note", this.user.user ? topic.replyNotice || "此话题暂时无法回复" : "登录后即可回复");
        note.append(nativeLink(this.user.user ? "查看原页面" : "登录 V2EX", this.user.user ? topic.url : `/signin?next=${encodeURIComponent(new URL(topic.url).pathname)}`));
        composer.append(note);
      }
      requestAnimationFrame(() => this.resizeReply());
      return composer;
    }
    resizeReply() {
      if (this.reply) {
        this.reply.style.height = "auto";
        this.reply.style.height = `${Math.min(180, Math.max(52, this.reply.scrollHeight))}px`;
      }
    }
    saveDraft() {
      if (this.topic && this.reply) write(draftKey(this.user.user, this.topic.id), this.reply.value);
    }
    setComposerBusy(busy) {
      const send = this.chat.querySelector("[data-send]");
      if (send) send.disabled = busy || !this.topic?.replyForm || !this.reply?.value.trim() || this.pending.has(`reply:${this.topic?.id}`);
      if (this.reply) this.reply.disabled = busy || !this.topic?.replyForm || this.pending.has(`reply:${this.topic?.id}`);
    }
    mention(user) {
      if (!this.reply || this.reply.disabled) {
        this.toast("当前话题无法回复，请先登录或查看原页面", this.topic?.url, true);
        return;
      }
      this.reply.value += `${this.reply.value && !this.reply.value.endsWith("\n") ? "\n" : ""}@${user} `;
      this.reply.dispatchEvent(new Event("input"));
      this.reply.focus();
      this.reply.setSelectionRange(this.reply.value.length, this.reply.value.length);
    }
    async sendReply() {
      const topic = this.topic;
      if (!topic?.replyForm || !this.reply?.value.trim() || this.navigating) return;
      const key = `reply:${topic.id}`;
      if (this.pending.has(key)) return;
      const content = this.reply.value;
      const version = this.navVersion;
      const user = this.user.user;
      this.saveDraft();
      this.pending.add(key);
      this.setComposerBusy(true);
      try {
        const fresh = await loadPage(topic.url);
        const latest = parseTopic(fresh.doc, fresh.url);
        if (latest.session.user !== user) throw new Error("登录账号已变化，请刷新后再回复。");
        if (!latest.replyForm) throw new Error("当前话题已无法回复，草稿已保留。");
        const page = await submitForm(latest.replyForm, { [latest.replyForm.contentKey]: content });
        const result = parseTopic(page.doc, page.url);
        if (result.id !== topic.id || result.replyForm?.fields[result.replyForm.contentKey]?.trim() === content.trim()) throw new Error("服务器未确认回复成功，草稿已保留，请查看原页面。");
        write(draftKey(user, topic.id), "");
        if (!this.disposed && version === this.navVersion) {
          this.topic = result;
          history.replaceState(this.historyContext(), "", result.url);
          this.renderTopic(result);
          this.chatScroll.scrollTop = this.chatScroll.scrollHeight;
          const item = this.list?.items.find((i) => i.id === result.id);
          if (item) {
            item.replies = result.replies;
            item.lastUser = user;
            this.renderList();
          }
          this.toast("回复已发送");
        }
      } catch (error) {
        if (!this.disposed) this.toast(this.errorText(error), topic.url, true);
      } finally {
        this.pending.delete(key);
        if (!this.disposed) this.setComposerBusy(this.navigating);
      }
    }
    async performAction(action2, control, kind) {
      const key = action2.url;
      if (this.pending.has(key) || this.navigating) return;
      if (kind === "thank" && !window.confirm(action2.prompt || "感谢会消耗 V2EX 金币（通常为 10 铜币），是否继续？")) return;
      if (kind === "favorite" && action2.prompt && !window.confirm(action2.prompt)) return;
      this.pending.add(key);
      control.disabled = true;
      const topic = this.topic;
      const version = this.navVersion;
      try {
        await runAction(action2);
        if (this.disposed) return;
        if (kind === "thank") {
          action2.done = true;
          control.textContent = "已感谢";
          control.setAttribute("aria-label", "已感谢");
          control.title = "已感谢";
          this.toast("感谢已发送");
        } else if (topic && version === this.navVersion) {
          const page = await loadPage(topic.url);
          const updated = parseTopic(page.doc, page.url);
          if (!updated.favorite || updated.favorite.done === action2.done) throw new Error("收藏状态尚未确认，请在原站检查。");
          this.topic = updated;
          this.closePopup();
          this.toast(updated.favorite.done ? "已收藏话题" : "已取消收藏");
        }
      } catch (error) {
        if (!this.disposed) this.toast(this.errorText(error), topic?.url, true);
      } finally {
        this.pending.delete(key);
        if (!action2.done || kind === "favorite") control.disabled = false;
      }
    }
    openTopicMenu() {
      if (this.popup) {
        this.closePopup();
        return;
      }
      const topic = this.topic;
      if (!topic) return;
      const popup = this.popup = el("div", "popup");
      popup.setAttribute("role", "menu");
      if (topic.favorite) {
        const action2 = topic.favorite;
        const control = button(action2.done ? "取消收藏" : "收藏话题", () => void this.performAction(action2, control, "favorite"));
        popup.append(control);
      }
      if (topic.thank) {
        const action2 = topic.thank;
        const control = button(action2.done ? "已感谢作者" : "感谢作者", () => void this.performAction(action2, control, "thank"));
        control.disabled = action2.done;
        popup.append(control);
      }
      popup.append(button("刷新话题", () => void this.navigate(topic.url, "replace")), nativeLink("查看原页面", topic.url));
      this.chat.append(popup);
      popup.querySelector("button")?.focus();
    }
    closePopup() {
      this.popup?.remove();
      this.popup = void 0;
    }
    closeDrawer() {
      this.drawer?.remove();
      this.drawer = void 0;
      this.updateRailSelection();
    }
    isCurrentList(input) {
      const target = new URL(input, location.origin);
      const current = new URL(this.listURL, location.origin);
      const currentTab = this.list?.currentTab ? new URL(this.list.currentTab, location.origin).searchParams.get("tab") : current.searchParams.get("tab");
      return target.pathname.replace(/\/$/, "") === current.pathname.replace(/\/$/, "") && (target.pathname !== "/" || (target.searchParams.get("tab") || "all") === (currentTab || "all"));
    }
    async openNodes() {
      if (this.drawer) {
        this.closeDrawer();
        return;
      }
      const drawer = this.drawer = el("aside", "drawer");
      drawer.setAttribute("aria-label", "分类和节点");
      this.updateRailSelection();
      const head = el("header", "drawer-head");
      head.append(el("h2", "", "分类和节点"), button("关闭分类", () => this.closeDrawer(), "icon-button", "close"));
      const body = el("div", "drawer-body");
      const item = (label, url) => {
        const selected = this.isCurrentList(url);
        const control = button(label, () => void this.navigate(url), `drawer-item${selected ? " selected" : ""}`);
        if (selected) control.setAttribute("aria-current", "true");
        return control;
      };
      body.append(el("div", "drawer-section", "分类"));
      for (const tab of this.list?.tabs.length ? this.list.tabs : homeTabs) body.append(item(tab.label, tab.url));
      body.append(el("div", "drawer-section", "节点"));
      const search = el("input", "drawer-search");
      search.placeholder = "搜索节点";
      search.setAttribute("aria-label", "搜索节点");
      body.append(search);
      const nodes = el("div");
      body.append(nodes);
      drawer.append(head, body);
      this.shell.append(drawer);
      const initial = this.list?.nodes || [];
      let all = initial.map((n) => ({ name: new URL(n.url).pathname.split("/")[2], title: n.label }));
      const render = () => {
        nodes.replaceChildren();
        const q2 = search.value.toLowerCase();
        for (const n of all.filter((n2) => `${n2.name} ${n2.title}`.toLowerCase().includes(q2))) nodes.append(item(n.title, `/go/${n.name}`));
      };
      search.addEventListener("input", render);
      render();
      try {
        const response = await fetch("/api/nodes/list.json?fields=name,title&sort_by=topics&reverse=1", { credentials: "same-origin" });
        if (!response.ok) throw new Error("节点列表暂时不可用");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("节点列表格式无法识别");
        all = data.filter((n) => typeof n.name === "string" && /^[a-zA-Z0-9_-]+$/.test(n.name) && typeof n.title === "string");
        if (this.drawer === drawer) render();
      } catch {
        if (this.drawer === drawer) nodes.append(nativeLink("在原站浏览全部节点", "/planes", "drawer-item"));
      }
    }
    async openNewTopic() {
      if (this.modal) return;
      const overlay = this.modal = el("div", "modal-overlay");
      const modal = el("section", "modal");
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "发表新话题");
      const head = el("header", "modal-head");
      const close = () => {
        if (this.pending.has("new")) return;
        this.modal?.remove();
        this.modal = void 0;
        this.listPanel.querySelector(".add")?.focus();
      };
      head.append(el("h2", "", "发表新话题"), button("关闭发帖", close, "icon-button", "close"));
      const body = el("div", "modal-body");
      body.append(el("div", "loading", "正在读取发帖表单…"));
      modal.append(head, body);
      overlay.append(modal);
      this.shell.append(overlay);
      overlay.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;
        const focusable = Array.from(modal.querySelectorAll("button:not(:disabled), input, select, textarea, a[href]")).filter((n) => !n.hidden);
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && this.shadow.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && this.shadow.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      });
      try {
        const page = await loadPage("/new");
        if (this.modal !== overlay || this.disposed) return;
        const formEl = Array.from(page.doc.querySelectorAll("#Main form")).find((f) => f.querySelector("textarea[name]"));
        if (!formEl) throw new Error("暂时无法发帖，请在原站检查账号权限。");
        const form = parseForm(formEl, page.url, "new");
        body.replaceChildren();
        this.buildNewForm(form, page.url, body, modal, close);
      } catch (error) {
        if (this.modal !== overlay || this.disposed) return;
        body.replaceChildren(el("p", "modal-error", this.errorText(error)), nativeLink("在原站发帖或登录", "/new"));
      }
    }
    buildNewForm(form, formURL, body, modal, close) {
      const user = this.user.user;
      const draft = read(draftKey(user, "new"), { title: "", node: "", content: "" });
      const field = (label, input) => {
        const wrap = el("label", "field", label);
        wrap.append(input);
        body.append(wrap);
      };
      const title = el("input");
      title.value = draft.title;
      title.required = true;
      title.placeholder = "话题标题";
      field("标题", title);
      const node = el("input");
      node.value = draft.node || form.fields[form.nodeKey || ""] || "";
      node.placeholder = "节点英文名，例如 create / programmer";
      const datalist = el("datalist");
      datalist.id = "new-node-options";
      node.setAttribute("list", datalist.id);
      for (const option of form.nodes) {
        const item = el("option");
        item.value = option.url;
        item.label = option.label;
        datalist.append(item);
      }
      if (form.nodeKey) {
        field("节点", node);
        body.append(datalist);
      }
      const content = el("textarea");
      content.value = draft.content;
      content.placeholder = "正文，支持 Markdown";
      field("正文", content);
      const preview = el("div", "preview bubble-body");
      preview.hidden = true;
      const error = el("p", "modal-error");
      error.setAttribute("role", "alert");
      body.append(preview, error);
      const save = () => write(draftKey(user, "new"), { title: title.value, node: node.value, content: content.value });
      const previewContent = () => {
        preview.innerHTML = safeHTML(g.parse(content.value, { async: false }), formURL);
      };
      for (const input of [title, node, content]) input.addEventListener("input", () => {
        save();
        if (!preview.hidden) previewContent();
      });
      const foot = el("footer", "modal-foot");
      const publish = button("发表", () => {
        void send();
      }, "send");
      foot.append(nativeLink("原站编辑器", "/new"), button("预览", () => {
        preview.hidden = !preview.hidden;
        if (!preview.hidden) previewContent();
      }, "secondary"), button("取消", close, "secondary"), publish);
      modal.append(foot);
      title.focus();
      const send = async () => {
        if (this.pending.has("new")) return;
        if (!title.value.trim()) {
          error.textContent = "请填写标题";
          title.focus();
          return;
        }
        if (form.nodeKey && !node.value.trim()) {
          error.textContent = "请选择节点";
          node.focus();
          return;
        }
        save();
        this.pending.add("new");
        publish.disabled = true;
        error.textContent = "";
        for (const input of [title, node, content]) input.disabled = true;
        try {
          const fresh = await loadPage("/new");
          if (session(fresh.doc, fresh.url).user !== user) throw new Error("登录账号已变化，请刷新后再发帖。");
          const freshFormEl = Array.from(fresh.doc.querySelectorAll("#Main form")).find((f) => f.querySelector("textarea[name]"));
          if (!freshFormEl) throw new Error("发帖权限或表单已变化，草稿已保留。");
          const freshForm = parseForm(freshFormEl, fresh.url, "new");
          const values = {
            [freshForm.titleKey]: title.value,
            [freshForm.contentKey]: content.value,
            ...freshForm.nodeKey ? { [freshForm.nodeKey]: node.value } : {}
          };
          const result = await submitForm(freshForm, values);
          if (!/^\/t\/\d+/.test(new URL(result.url).pathname)) throw new Error("服务器未确认发帖成功，请在原站检查。");
          parseTopic(result.doc, result.url);
          write(draftKey(user, "new"), { title: "", node: "", content: "" });
          this.pending.delete("new");
          close();
          await this.navigate(result.url);
          this.toast("话题已发表");
        } catch (problem) {
          error.textContent = this.errorText(problem);
        } finally {
          this.pending.delete("new");
          publish.disabled = false;
          for (const input of [title, node, content]) input.disabled = false;
        }
      };
      if (!form.nodes.length && form.nodeKey) void fetch("/api/nodes/list.json?fields=name,title&sort_by=topics&reverse=1").then((r) => r.json()).then((data) => {
        if (!Array.isArray(data)) return;
        for (const n of data) if (typeof n.name === "string" && typeof n.title === "string") {
          const option = el("option");
          option.value = n.name;
          option.label = n.title;
          datalist.append(option);
        }
      }).catch(() => {
      });
    }
    locateHash() {
      if (!this.topic) return;
      const hash = location.hash;
      let id = hash.match(/^#r_(\d+)$/)?.[1];
      const floor = hash.match(/^#reply(\d+)$/)?.[1];
      if (floor) id = this.topic.messages.find((m2) => m2.floor === floor)?.id;
      if (floor && !id && this.topic.pagination.total > 1) {
        const firstFloor = Number(this.topic.messages[0]?.floor);
        const pageSize = this.topic.pagination.current > 1 && firstFloor > 1 ? Math.round((firstFloor - 1) / (this.topic.pagination.current - 1)) : this.topic.messages.length;
        const targetPage = pageSize ? Math.ceil(Number(floor) / pageSize) : 0;
        if (targetPage > 0 && targetPage <= this.topic.pagination.total && targetPage !== this.topic.pagination.current) {
          const url = new URL(this.topic.url);
          url.searchParams.set("p", String(targetPage));
          url.hash = hash;
          void this.navigate(url.href, "replace");
          return;
        }
      }
      this.chatScroll.querySelectorAll(".highlight").forEach((n) => n.classList.remove("highlight"));
      if (id) {
        const row = this.shadow.getElementById(`r_${id}`);
        if (row) {
          row.classList.add("highlight");
          row.scrollIntoView({ block: "center" });
        }
      }
    }
    onPopState = (event) => {
      const state = event.state;
      if (!supportedRoute(location.pathname)) {
        location.reload();
        return;
      }
      void this.navigate(location.href, "pop", state?.v2wc ? state : void 0);
    };
    onHashChange = () => this.locateHash();
    recordScroll = () => {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        if (!this.disposed && !this.navigating) this.saveHistory();
      }, 250);
    };
    onContentLink = (event) => {
      const mouse = event;
      if (mouse.ctrlKey || mouse.metaKey || mouse.shiftKey || mouse.altKey || mouse.button !== 0 || event.defaultPrevented) return;
      const anchor = event.target.closest(".bubble-body a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || !supportedRoute(url.pathname)) return;
      event.preventDefault();
      void this.navigate(url.href);
    };
    onEscape = (event) => {
      if (event.key !== "Escape") return;
      if (this.modal && !this.pending.has("new")) {
        this.modal.remove();
        this.modal = void 0;
        this.listPanel.querySelector(".add")?.focus();
      } else {
        this.closeDrawer();
        this.closePopup();
      }
    };
    errorText(error) {
      return error instanceof Error ? error.message : "操作失败，请查看原页面。";
    }
    toast(message, url, persistent = false) {
      this.toastNode?.remove();
      clearTimeout(this.toastTimer);
      const node = this.toastNode = el("div", "toast");
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      node.append(el("span", "toast-message", message));
      if (url) node.append(nativeLink("查看原页面", url));
      if (persistent) node.append(button("关闭提示", () => node.remove(), "icon-button", "close"));
      this.chat.append(node);
      if (!persistent) this.toastTimer = setTimeout(() => node.remove(), 3e3);
    }
  };

  // src/main.ts
  var app;
  var visibilityStyle;
  var narrow = matchMedia("(max-width: 1023px)");
  function stop() {
    app?.dispose();
    app = void 0;
    document.body.classList.remove("v2wc-enabled");
    visibilityStyle?.remove();
    visibilityStyle = void 0;
  }
  function restore() {
    write("enabled", false);
    stop();
    const url = new URL(location.href);
    url.searchParams.set("v2wc", "off");
    location.replace(url.href);
  }
  function start() {
    if (app || narrow.matches || !read("enabled", true) || new URL(location.href).searchParams.get("v2wc") === "off" || !supportedRoute(location.pathname)) return;
    try {
      const initial = /^\/t\/\d+/.test(location.pathname) ? parseTopic(document, location.href) : parseList(document, location.href);
      if (!document.querySelector("#Main")) return;
      app = new ChatApp(initial, restore);
      app.mount();
      visibilityStyle = document.createElement("style");
      visibilityStyle.textContent = `body.v2wc-enabled { overflow: hidden !important; }
      body.v2wc-enabled > :not(#v2wc-root):not(script):not(style) { display: none !important; }
      #v2wc-root { position: fixed !important; inset: 0 !important; z-index: 100000 !important; display: block !important; }
      @media print { body.v2wc-enabled { overflow: visible !important; } body.v2wc-enabled > :not(#v2wc-root):not(script):not(style) { display: revert !important; } #v2wc-root { display: none !important; } }`;
      document.head.append(visibilityStyle);
      document.body.classList.add("v2wc-enabled");
    } catch (error) {
      stop();
      console.warn("[V2EX 微信皮肤] 保留原站：", error);
    }
  }
  menu("启用微信聊天皮肤", () => {
    write("enabled", true);
    const url = new URL(location.href);
    url.searchParams.delete("v2wc");
    location.replace(url.href);
  });
  menu("恢复原站界面", restore);
  narrow.addEventListener("change", () => {
    if (app && narrow.matches) {
      stop();
      location.reload();
    } else if (!narrow.matches) start();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
