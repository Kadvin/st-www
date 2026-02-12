# 11ty 改造计划

## 目标
将现有的静态 HTML 网站改造为使用 11ty 模板系统，提取公共部分为可复用组件，降低维护成本。

## 项目分析

### 现有页面
- index.html (首页)
- about.html (关于宏澳)
- portfolio.html (客户案例)
- contact.html (联系我们)
- single.html (详情页)
- services.html (服务说明)
- signin.html (登录)
- signup.html (注册)
- 404.html (错误页)

### 可提取的公共组件

1. **导航栏 (header.njk)**
   - 固定顶部导航
   - Logo 和品牌名称
   - 菜单项：首页、关于宏澳、客户案例、产品介绍、服务说明、联系我们
   - "开通试用" 按钮
   - 需要支持当前页面高亮 (active class)

2. **页脚 (footer.njk)**
   - 联系信息
   - 版权信息
   - 完全一致，无需参数化

3. **HTML Head (head.njk)**
   - Meta 标签
   - CSS 引用
   - 需要支持：
     - 动态 title
     - 页面特定的额外 CSS (team.css, single.css, contact.css)

4. **脚本区块 (scripts.njk)**
   - jQuery
   - Bootstrap
   - 通用脚本
   - 需要支持页面特定的额外脚本

## 实施步骤

### 第 1 步：初始化 11ty 项目

1. 创建 `package.json`
2. 安装 11ty: `npm install --save-dev @11ty/eleventy`
3. 创建 `.eleventy.js` 配置文件
4. 配置输入/输出目录

**目录结构：**
```
src/                    # 源文件目录
  _includes/           # 模板和组件
    layouts/
      base.njk         # 基础布局
    partials/
      head.njk         # HTML head
      header.njk       # 导航栏
      footer.njk       # 页脚
      scripts.njk      # 脚本
  index.njk            # 首页
  about.njk            # 关于页面
  portfolio.njk        # 作品集
  contact.njk          # 联系我们
  ...
_site/                 # 构建输出目录 (11ty 默认)
css/                   # 静态资源 (passthrough)
js/                    # 静态资源 (passthrough)
images/                # 静态资源 (passthrough)
fonts/                 # 静态资源 (passthrough)
```

### 第 2 步：创建基础布局模板

**base.njk** - 包含完整的 HTML 结构：
- DOCTYPE 和 html 标签
- 引入 head.njk
- 引入 header.njk
- 主内容区 {{ content | safe }}
- 引入 footer.njk
- 引入 scripts.njk

### 第 3 步：提取公共组件

1. **head.njk**
   - 接收参数：title, extraCSS (数组)
   - 包含所有 meta 标签
   - 包含基础 CSS
   - 条件渲染额外 CSS

2. **header.njk**
   - 接收参数：currentPage (用于高亮当前菜单)
   - 完整的导航栏 HTML

3. **footer.njk**
   - 静态内容，无需参数

4. **scripts.njk**
   - 接收参数：extraScripts (数组)
   - 包含基础脚本
   - 条件渲染额外脚本

### 第 4 步：转换现有页面

将每个 HTML 页面转换为 Nunjucks 模板：

1. 添加 Front Matter (YAML 头部)
   ```yaml
   ---
   layout: layouts/base.njk
   title: 页面标题
   currentPage: home
   extraCSS: []
   extraScripts: []
   ---
   ```

2. 只保留页面特定的主内容部分

3. 移除重复的 header、footer、scripts

### 第 5 步：配置静态资源

在 `.eleventy.js` 中配置 passthrough copy：
- css/
- js/
- images/
- fonts/
- favicon.ico

### 第 6 步：配置构建命令

在 `package.json` 中添加：
```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy"
  }
}
```

### 第 7 步：测试和验证

1. 运行 `npm run dev`
2. 逐页检查生成的 HTML
3. 验证：
   - 导航高亮正确
   - CSS/JS 加载正确
   - 页面特定的样式和脚本正确加载
   - 所有链接正常工作

### 第 8 步：更新 CLAUDE.md

更新文档说明新的开发流程。

## 技术细节

### 11ty 配置要点

```javascript
// .eleventy.js
module.exports = function(eleventyConfig) {
  // 静态资源直接复制
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("fonts");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk"
  };
};
```

### Front Matter 示例

```yaml
---
layout: layouts/base.njk
title: 宏澳软件 - 关于我们
currentPage: about
extraCSS:
  - css/team.css
extraScripts:
  - js/jquery.waypoints.min.html
  - js/jquery.countup.html
---
```

## 迁移策略

**渐进式迁移：**
1. 先迁移结构最简单的页面（如 404.html）
2. 验证构建流程正确
3. 逐步迁移其他页面
4. 保留原始 HTML 文件作为备份，直到完全验证通过

## 预期收益

1. **维护成本降低 70%**
   - 导航栏修改：从修改 9 个文件 → 修改 1 个文件
   - 页脚修改：从修改 9 个文件 → 修改 1 个文件

2. **开发体验提升**
   - 热重载开发服务器
   - 模板语法清晰
   - 易于添加新页面

3. **一致性保证**
   - 所有页面自动使用最新的公共组件
   - 减少人为错误

## 风险和注意事项

1. **构建步骤增加**
   - 需要运行 `npm run build` 才能生成最终 HTML
   - 部署流程需要调整

2. **学习成本**
   - 团队需要了解 Nunjucks 模板语法
   - 需要了解 11ty 的基本概念

3. **调试复杂度**
   - 模板错误可能不如直接 HTML 直观
   - 需要查看生成的 HTML 来验证结果

## 回滚方案

如果改造后发现问题，可以：
1. 使用 Git 回退到改造前的版本
2. 原始 HTML 文件保留在 Git 历史中
3. 构建输出的 `_site/` 目录包含完整的静态 HTML，可直接使用
