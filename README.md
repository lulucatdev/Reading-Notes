# Zihui Notes

个人读书笔记网站，基于 vinext (Next.js on Vite) 构建，部署在 Cloudflare Workers 上。

## 技术栈

- **框架**: vinext (Next.js 16 + Vite)
- **运行时**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2 (图片)
- **认证**: GitHub OAuth
- **编辑器**: Markdown 分屏编辑 + 实时预览

## 功能

- 读书笔记的创建、编辑、删除（仅管理员）
- Markdown 编辑器，支持实时预览
- 封面图片和内联图片上传（客户端自动压缩为 WebP）
- 60 本精选书籍推荐（文学/科技/金融各 20 本）
- GitHub OAuth 登录（所有人可登录浏览，仅 `chenzihui222` 可编辑）

## 本地开发

```bash
# 安装依赖
npm install

# 初始化本地数据库
npm run db:migrate
npm run db:seed

# 启动开发服务器
npm run dev
```

## 部署

```bash
# 部署到 Cloudflare Workers
npm run deploy
```

## 环境变量

在 `wrangler.jsonc` 中配置 `GITHUB_CLIENT_ID`，通过 wrangler secret 设置 `GITHUB_CLIENT_SECRET`：

```bash
npx wrangler secret put GITHUB_CLIENT_SECRET
```

## GitHub OAuth 设置

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers) 创建 OAuth App
2. Homepage URL: `https://notes.zihuichen.com`
3. Callback URL: `https://notes.zihuichen.com/api/auth/callback`
4. 将 Client ID 填入 `wrangler.jsonc` 的 `GITHUB_CLIENT_ID`
5. 将 Client Secret 通过 `npx wrangler secret put GITHUB_CLIENT_SECRET` 设置
