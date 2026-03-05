# 读书心得网站

一个基于 Jekyll 和 GitHub Pages 的个人读书心得分享网站。

## 功能特点

- 📚 书籍管理和展示
- 📝 读书笔记发布
- 🏷️ 文章标签分类
- 📱 响应式设计
- 🔍 SEO 优化
- 📊 阅读进度追踪

## 目录结构

```
.
├── _books/           # 书籍数据
├── _posts/           # 读书笔记文章
├── _layouts/         # 页面布局模板
├── assets/           # 样式和资源文件
├── _config.yml       # Jekyll 配置
└── index.html        # 首页
```

## 快速开始

### 本地预览

1. 安装依赖：
```bash
bundle install
```

2. 本地运行：
```bash
bundle exec jekyll serve
```

3. 访问 http://localhost:4000

### 添加新书籍

在 `_books/` 目录下创建新的 Markdown 文件：

```yaml
---
title: "书名"
author: "作者"
publisher: "出版社"
publish_date: "2024-01"
rating: 5
status: finished  # 可选: reading, finished, toread
---

书籍简介和读后感...
```

### 添加读书笔记

在 `_posts/` 目录下创建新的 Markdown 文件（文件名格式：`YYYY-MM-DD-title.md`）：

```yaml
---
layout: post
title: "文章标题"
date: 2024-01-15
tags: [标签1, 标签2]
book:
  title: "书名"
  author: "作者"
  rating: 5
---

文章内容...
```

## 部署到 GitHub Pages

1. 创建 GitHub 仓库
2. 推送代码到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择发布源（main 分支）
5. 访问你的 GitHub Pages 链接

## 自定义配置

修改 `_config.yml` 文件：

```yaml
title: 你的网站标题
description: 网站描述
author:
  name: 你的名字
  bio: 个人简介
```

## 许可证

MIT License
