# CLAUDE.md

## Project Overview

Hive 产品官网。面向企业决策者和研发人员，展示 Hive（高质量软件开发的管理操作系统）的产品价值、核心能力和研发理念。

官网三大责任：
1. **承接流量转化** — 从微信/朋友圈/抖音/短视频等渠道引流，让访客了解产品并产生试用冲动
2. **多媒体展示** — 以图片、视频为主展示 Hive 带来的能力与价值
3. **宣扬研发理念** — 传递"AI 团队需要管理操作系统"的理念

## Technology Stack

- **静态生成器**: Eleventy (11ty) 2.x
- **前端框架**: Bootstrap 3.x（保留现有，渐进升级）
- **字体图标**: Font Awesome 4.x
- **JavaScript**: jQuery 2.x + Bootstrap.js
- **模板引擎**: Nunjucks (.njk)

## Project Structure

```
src/
├── _includes/
│   ├── layouts/base.njk       # 基础布局
│   └── partials/
│       ├── head.njk           # <head> 标签
│       ├── header.njk         # 导航栏
│       ├── footer.njk         # 页脚
│       └── scripts.njk        # JS 引用
├── css/                       # 样式文件
├── js/                        # JavaScript
├── images/                    # 图片资源
├── fonts/                     # 字体文件
├── index.njk                  # 首页
├── product.njk                # 产品能力页
├── philosophy.njk             # 研发理念页
├── contact.njk                # 联系我们
└── signup.njk                 # 申请试用
```

## Build & Development

```bash
npm run dev     # 本地开发（热重载，端口 8080）
npm run build   # 构建到 dist/
```

## Design Guidelines

- 品牌色：深蓝 #1a237e（科技/信任）+ 琥珀 #f59e0b（活力/蜂巢隐喻）
- 风格：现代、克制、专业，多留白
- 内容语气：面向企业决策者直白讲 ROI，面向研发人员讲体验转变
- 多媒体优先：首页和产品页以截图/动图/视频占主体，文字辅助
- 移动优先：确保手机浏览体验（微信朋友圈引流场景）

## Key Pages

| 页面 | URL | 核心内容 |
|------|-----|---------|
| 首页 | / | Hero视频 + 一句话定位 + 价值对比 + 功能亮点 + CTA |
| 产品 | /product/ | 核心能力详细展示（全景图/流程引擎/AI管理/CMDB） |
| 理念 | /philosophy/ | 研发理念、设计哲学、为什么需要管理操作系统 |
| 联系 | /contact/ | 联系方式 + 商务咨询 |
| 试用 | /signup/ | 申请试用表单 |
