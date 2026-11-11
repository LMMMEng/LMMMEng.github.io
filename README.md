# Meng Lou — Academic Homepage（重设计版）

一个纯静态、零外部依赖的学术主页重设计。内容取自原 `LMMMEng.github.io` 站点的可见部分，重新做了版式、层级与阅读体验。

## 本地预览

**方式一：直接打开**

双击 `index.html` 即可。字体已以 latin 子集内嵌进 CSS，`file://` 下也能正常显示，不需要联网。

**方式二：本地服务器（可选）**

```bash
cd homepage-redesign
python -m http.server 8000
```

然后访问 <http://127.0.0.1:8000/>。

## 内容说明

- 保留原页面的全部可见文字与链接：Biography、19 条 News、8 篇 Publications、2 段 Work Experiences、Academic Services。
- 保留原站锚点：`#about-me`、`#-news`、`#-selected-publications`、`#-academic-services`。
- 所有论文/新闻/期刊链接均逐条核对，37 个外链无遗漏。
- 按你的要求，院系名称统一为 **School of Computing and Data Science**（原为 Department of Computer Science）。
- News 改为一个约 10 条可见的滚动框，可拖动右侧滚动条查看全部 19 条。
- Selected Publications 改为横线式论文清单，左侧会议/期刊标识约 21px（与论文标题接近，会议墨绿、期刊金色）；Oral Paper 直接做成 CVPR 2025 标签上的金色徽章，ESI 标识加粗、下划线；Paper / Code 使用两色胶囊（论文绿 / 代码蓝），Paper 用纸张图标，Code 用 </> 图标。
- 姓名与照片保持克制尺寸（桌面端姓名 42px、照片 152px），整体偏学术、低调。
- 全站最小字号 12px，正文 15.5–16px，避免过小的标签文字。
- 顶部品牌名已移除，导航左对齐；页脚只保留联系方式。
- 开头三个圆形图标按钮：Google Scholar（墨绿）、Email（暖金）、GitHub（墨色），只显示图标。
- 浏览器标签页使用卡皮巴拉 favicon。

## 交互与细节

- 深浅色主题切换（记忆偏好，默认跟随系统）。
- 移动端折叠菜单。
- News 自定义可拖动滚动条（键盘也可滚动）。
- 滚动进度条、当前栏目高亮、元素渐入（尊重 `prefers-reduced-motion`）。
- 响应式：320 / 360 / 390 / 768 / 1024 / 1440 均无横向溢出。
- 支持打印样式。

## 文件结构

```
index.html                 页面结构（唯一入口）
assets/css/fonts.css       Inter / Newsreader / JetBrains Mono（内嵌 woff2）
assets/css/style.css       设计系统与全部样式
assets/js/main.js          主题、导航、滚动条、渐入等交互
assets/img/portrait.jpg    头像（已裁切调色，152px 展示）
assets/img/favicon.ico     站点图标
assets/img/web_icon_*.png  图标
favicon.ico                根目录图标回退
.nojekyll                  跳过 Jekyll（部署关键）
about/index.html           旧 /about/ 链接跳转
about.html                 旧 /about.html 链接跳转
```

## 部署到 GitHub Pages（替换当前主页）

本目录已经按“静态站点根目录”组织好，可以直接作为 GitHub Pages 的发布内容。

### 当前仓库状态（已核对）

- 仓库：`LMMMEng/LMMMEng.github.io`，默认分支 `main`，GitHub Pages 已启用。
- 现在是 academicpages/Jekyll：根目录没有 `index.html`，首页由 `_pages/about.md` 的 `permalink: /` 生成。
- 仓库里没有 Pages 的 GitHub Actions 工作流，只有 Google Scholar 爬虫；因此 Pages 应是从 `main` 分支根目录发布（legacy build）。

### 替换步骤

1. **备份当前仓库**（新建分支或本地备份）。
2. **删除旧的 Jekyll 站点文件**（仓库根目录）：

   ```
   _config.yml  _data  _includes  _layouts  _pages  _sass
   assets  images  docs  Gemfile  Gemfile.lock  run_server.sh
   ```

   旧的 `assets/` 和 `images/` 必须删除，避免与新 `assets/` 混在一起。
   `google_scholar_crawler/` 与 `.github/workflows/google_scholar_crawler.yaml` 是爬虫，和页面无关，可留可删。

3. **把本目录这些内容复制到仓库根目录**：

   ```
   index.html  assets/  favicon.ico  .nojekyll  about/  about.html
   ```

   `README.md` 可选。
4. `commit + push` 到 `main`。
5. 打开仓库 **Settings → Pages**，确认 Source 是 **Deploy from a branch → main → / (root)**。
   如果显示的是 “GitHub Actions”，改成上面的分支方式。
6. 等 1–2 分钟，访问 <https://lmmmeng.github.io/>，按 Ctrl+F5 强制刷新。

### 为什么不能只放 index.html

现有 `_pages/about.md` 的 `permalink: /` 会和新的 `index.html` 抢同一个输出路径，Jekyll 会出现目标冲突或覆盖。  
`.nojekyll` 的作用是让 GitHub Pages **不再运行 Jekyll**，直接把仓库当静态文件服务器。  
同时必须删除旧 `assets/`，否则新旧 CSS/字体可能混在一起。

### 上线后自检

```bash
curl -I https://lmmmeng.github.io/
curl -I https://lmmmeng.github.io/assets/css/style.css
curl -I https://lmmmeng.github.io/favicon.ico
```

- 首页 200，标题为 `Meng Lou (娄蒙) — Ph.D. Student, The University of Hong Kong`
- `assets/css/style.css` 200
- `favicon.ico` 是卡皮巴拉图标
- 旧链接 `/about/`、`/about.html` 自动跳回首页
- 页面中的 37 个外链、`#about-me` 等旧锚点可用

### 备注

- 页面 `canonical`、`og:url`、`og:image` 已按 `https://lmmmeng.github.io/` 写好。
- 当前没有 `CNAME`；如果你以后绑定自定义域名，再加 `CNAME` 文件。
- Google Scholar 爬虫工作流会推送到独立的 `google-scholar-stats` 分支，不影响本静态页面；不需要可以删除 `.github/workflows/google_scholar_crawler.yaml` 和 `google_scholar_crawler/`。
