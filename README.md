# 跨境电商平面设计师 · 作品集网站

个人作品集网站，暗色艺术风格，粒子动效背景，全中文。

## 技术栈

Vite + Vanilla JS + GSAP（ScrollTrigger）+ Canvas 粒子系统

## 本地预览

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 部署上线（二选一）

### 方案 A：拖拽部署（最快，3 分钟上线）

我无法在这个环境里完成交互式登录部署，但以下两个平台都支持**直接把文件夹拖进去**上线：

**Vercel（推荐）**：
1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录
2. 点击 **"Add New → Project"**
3. 在导入页面，找到 **"Deploy without Git"** 或直接把 `dist/` 文件夹拖进去
4. 几秒后就会生成一个 `https://xxx.vercel.app` 的链接

**Netlify**：
1. 打开 [netlify.com](https://netlify.com)
2. 把 `dist/` 文件夹拖放到浏览器页面上
3. 自动生成 `https://xxx.netlify.app` 链接

### 方案 B：GitHub + Vercel 自动部署（推荐，支持后续编辑）

```bash
# 1. 在 GitHub 新建一个仓库（不要勾选任何初始化选项）
# 2. 执行以下命令
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main

# 3. 打开 vercel.com → Add New → Project
# 4. 导入刚推送的 GitHub 仓库
# 5. Framework Preset 选 "Vite"
# 6. 点 Deploy，完成
```

之后每次修改提交到 GitHub，Vercel 会自动重新部署。

## 编辑网站内容（核心）

**所有内容都在一个文件里：**
打开 `src/data/site-data.js`

| 你想做什么 | 找到哪里 |
|---|---|
| 改名字/职位 | 搜索 `name:` 和 `title:` |
| 改成就数字 | 搜索 `stats:` 数组 |
| 增加作品 | 在 `works:` 数组里加一个新对象 |
| 删除作品 | 删掉对应的 `{ }` |
| 改作品详情 | 修改对应作品的 `detailSections:` |
| 添加视频作品 | 加一个 `type: 'video'` 的作品 |
| 改工作经历 | 搜索 `experience:` |
| 改评价 | 搜索 `testimonials:` |
| 改联系方式 | 搜索 `socials:` 和 `email:` |

改完后在项目目录执行：
```bash
npm run build
```
然后把新的 `dist/` 文件夹拖到 Vercel 替换即可。

## 项目结构

```
portfolio-site/
├── index.html                 # 首页
├── works.html                 # 作品全集（含筛选 + 视频版块）
├── work-detail.html           # 作品详情（动态加载）
├── about.html                 # 关于我（成就墙 + 时间线 + 评价）
├── dist/                      # 构建产物（直接拿去部署）
├── src/
│   ├── style.css              # 全局样式
│   ├── main.js                # 首页逻辑
│   ├── works-page.js          # 作品集页逻辑
│   ├── work-detail.js         # 详情页逻辑
│   ├── about-page.js          # 关于我页逻辑
│   ├── utils.js               # 共享工具
│   └── data/
│       └── site-data.js       # ★ 所有内容数据（编辑这个文件）
├── package.json
├── vite.config.js
└── README.md
```
