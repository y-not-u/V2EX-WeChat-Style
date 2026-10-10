# V2EX 微信聊天皮肤 (v2ex-wechat-style)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Passed-green.svg)](https://playwright.dev/)

通过 Tampermonkey 脚本，将 V2EX 桌面网页重构为微信桌面端风格的三栏聊天界面。直接复用浏览器现有的登录状态与 Cookies，纯客户端本地运行，无任何中间服务器。

---

## 🚀 安装

1. 安装浏览器扩展 [Tampermonkey (油猴)](https://www.tampermonkey.net/)。
2. 👉 **[点击一键在线安装脚本 (Raw)](https://raw.githubusercontent.com/y-not-u/V2EX-WeChat-Style/main/v2ex-wechat.user.js)**。
3. 打开或刷新 [V2EX 首页](https://www.v2ex.com/) 即可体验。

*(也可手动复制 [v2ex-wechat.user.js](./v2ex-wechat.user.js) 内容，在油猴管理面板中新建脚本保存)*

---

## ✨ 特性

- 💬 **微信经典三栏**：左侧导航 + 中间话题列表 + 右侧聊天气泡详情。
- 🟢 **真实绿色气泡**：正文附言置顶，楼层评论以气泡呈现，本人回复为右侧微信绿气泡。
- ⚡ **单页无刷新浏览**：局部按需加载，平滑切换，保留浏览器前进/后退历史。
- 📝 **智能本地草稿**：回复与发帖草稿按账号保存在油猴本地存储，意外关闭或提交失败不丢失。
- 🔒 **纯客户端 & 安全**：无第三方服务，复用原站接口；集成 DOMPurify 过滤 XSS，感谢操作前二次确认防止误扣金币。
- 🎛️ **无缝切回原版**：左侧底部提供一键退出按钮；访问任意链接添加 `?v2wc=off` 即可临时保持原站。

---

## ⌨️ 快捷操作

| 操作 | 方式 |
| :--- | :--- |
| **发送回复** | `Ctrl + Enter` 或 `Cmd + Enter` |
| **换行** | `Enter` |
| **快捷 @** | 点击楼层用户名或“回复”按钮自动插入 `@用户名` |
| **临时原站模式** | URL 后追加 `?v2wc=off` |

> **适配说明**：专为桌面端设计（视口宽度 ≥ 1024px），窄屏自动回退原站；通知、设置及高级管理功能支持新标签页打开。

---

## 🛠️ 本地开发

```bash
npm ci              # 安装依赖
npm run dev         # 监听并自动打包
npm run build       # 构建产物 v2ex-wechat.user.js
npm run check       # 类型检查 + Playwright 自动化测试
```

### 发布更新

脚本的 `@version` 在构建时自动读取 `package.json` 的 `version`。更新地址和下载地址均指向 `main` 分支的 `v2ex-wechat.user.js`。

在 `main` 分支提交功能修改、确保工作区干净后，执行：

```bash
npm version patch   # 例如 1.0.0 → 1.0.1；新功能用 minor，重大变更用 major
git push origin main --follow-tags
```

`npm version` 会先运行类型检查和自动化测试，通过后同步更新 `package.json`、`package-lock.json`，重新构建脚本，并将这些文件一起提交、创建版本标签。推送成功后，开启自动更新的油猴会在下次检查时发现更高版本并下载更新；也可以在油猴管理面板手动检查更新。

仅推送源码或创建 GitHub Release 不会改变脚本版本。每次发布都需要提高版本号并推送生成的脚本。检查更新还需要用户能够访问 `raw.githubusercontent.com`。

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。与 V2EX 官方及微信官方均无隶属关系。
