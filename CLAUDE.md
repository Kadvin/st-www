# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个静态网站项目，用于宏澳软件公司的企业官网。网站使用 Bootstrap 响应式框架构建，主要面向中国市场，提供产品介绍、客户案例、联系方式等企业信息。

## Technology Stack

- **前端框架**: Bootstrap 3.x
- **JavaScript 库**:
  - jQuery 1.7.2 / 2.2.3
  - jQuery prettyPhoto (图片灯箱效果)
  - jQuery Quicksand (作品集过滤动画)
  - Bootstrap.js (响应式组件)
- **CSS**: Bootstrap + 自定义样式
- **字体图标**: Font Awesome

## Project Structure

```
/
├── index.html          # 首页
├── about.html          # 关于宏澳
├── portfolio.html      # 客户案例
├── contact.html        # 联系我们
├── single.html         # 详情页
├── signin.html         # 登录页
├── signup.html         # 注册页
├── services.html       # 服务说明
├── 404.html           # 404 错误页
├── css/               # 样式文件
│   ├── bootstrap.css
│   ├── style.css      # 主样式文件
│   ├── prettyPhoto.css
│   ├── contact.css
│   ├── single.css
│   └── team.css
├── js/                # JavaScript 文件
│   ├── jquery-2.2.3.min.js
│   ├── bootstrap.js
│   ├── script.js      # 主脚本文件
│   ├── jquery.prettyPhoto.js
│   └── jquery.quicksand.js
├── images/            # 图片资源
├── fonts/             # 字体文件
└── .git/              # Git 版本控制
```

## Development Workflow

### 本地开发

这是一个纯静态网站，无需构建过程。直接在浏览器中打开 HTML 文件即可预览：

```bash
# 使用 Python 启动简单的 HTTP 服务器
python -m http.server 8000
# 或使用 Python 3
python3 -m http.server 8000

# 然后在浏览器访问 http://localhost:8000
```

### 部署

直接将所有文件上传到 Web 服务器即可，无需编译或构建步骤。

## Key Features & Components

### 导航栏
- 固定顶部导航 (navbar-fixed-top)
- 响应式折叠菜单
- 包含首页、关于宏澳、客户案例、产品介绍、服务说明、联系我们等页面链接

### 轮播图 (Carousel)
- 使用 Bootstrap Carousel 组件
- 位于首页，展示核心业务价值主张

### 图片灯箱
- 使用 prettyPhoto 插件
- 配置在 js/script.js 中
- 主题: light_rounded

### 作品集过滤
- 使用 Quicksand 插件实现动画过滤效果
- 支持按类别筛选客户案例

## Git Workflow

当前分支: `master`

最近的提交记录显示主要是内容更新和调整：
- write (内容编写)
- dev (开发)
- adjust (调整)
- Update index.html (更新首页)

## Important Notes

### 编码
- 所有 HTML 文件使用 UTF-8 编码
- 网站内容为简体中文

### 外部依赖
- Google Fonts (Raleway, Source Sans Pro)
- 部分 HTML 文件包含第三方广告脚本 (buysellads.com)

### 浏览器兼容性
- 使用 Bootstrap 3.x，支持现代浏览器
- 包含移动端响应式设计
- viewport meta 标签确保移动设备正确显示

## Maintenance Tips

- 修改页面内容时，注意保持中文编码正确
- 更新导航链接时，需要在所有 HTML 文件中同步修改
- 图片资源放在 images/ 目录下
- 自定义样式主要在 css/style.css 中
- 自定义 JavaScript 逻辑在 js/script.js 中
