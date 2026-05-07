# Creative Portfolio Site

一个艺术感个人作品集网站，带有粒子动效背景和进阶滚动动画。

## 技术栈

| 层 | 技术 |
|---|---|
| 构建 | Vite 6 |
| 动效 | GSAP + ScrollTrigger |
| 粒子系统 | Canvas 原生绘制 |
| 部署 | GitHub Pages / Vercel（均可免费部署） |

## 本地运行

```bash
# 安装依赖（已安装可跳过）
npm install

# 启动开发服务器
npm run dev

# 浏览器打开 http://localhost:3000
```

## 构建静态文件

```bash
npm run build
```

构建产物在 `dist/` 目录，可直接部署到任何静态托管服务。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库
2. 执行以下命令：

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

3. 在 GitHub 仓库页面：Settings → Pages → 选择 `Deploy from a branch` → 选 `main` 分支，根目录 `/`
4. 几分钟后你的网站就会在 `https://你的用户名.github.io/你的仓库名` 上线

## 部署到 Vercel（推荐，更简单）

1. 去 [vercel.com](https://vercel.com) 用 GitHub 登录
2. 点击 "Add New → Project"
3. 导入你的仓库
4. Framework Preset 选 "Vite"
5. 点击 Deploy，十几秒后上线

## 自定义内容

### 修改个人信息

打开 `index.html`，找到对应区域替换：

- **Hero 标题**: 搜索 `Creative Portfolio` 替换成你的名字
- **About 描述**: 搜索 `about-p` 下的文本，替换成你的介绍
- **作品卡片**: 搜索 `work-card` 区域，替换标题、描述和颜色渐变（`--grad`）
- **技能值**: 修改 `data-value` 属性（0 到 1 之间的小数）
- **邮箱**: 搜索 `hello@example.com` 替换
- **社交链接**: 找到 `contact-socials` 区域，填入你的链接

### 替换头像/图片

`about-image-placeholder` 目前是渐变占位。如需替换为真实图片：

```html
<!-- 替换方案一：直接用 img -->
<img src="/path/to/your-photo.jpg" alt="Your Name" style="width:100%;height:100%;object-fit:cover;" />

<!-- 替换方案二：CSS background -->
<div class="about-image-placeholder" style="background:url(/path.jpg) center/cover no-repeat;">
```

图片放在 `public/` 目录下，引用路径为 `/文件名`。

### 修改配色

打开 `src/style.css`，修改 `:root` 中的 CSS 变量：

```css
--accent-1: #c084fc;   /* 主色调：紫色 */
--accent-2: #f472b6;   /* 辅助色：粉色 */
--accent-3: #38bdf8;   /* 点缀色：蓝色 */
```

## 动效说明

| 动效 | 触发方式 |
|---|---|
| Hero 粒子背景 | 页面加载后自动运行，鼠标划过时粒子散开 |
| 标题字符逐个弹出 | 页面加载后 0.8s 延迟 |
| 区块渐入上滑 | 滚动到元素进入视口 85% 时触发 |
| 技能进度条 | 滚动到技能区时自动填充并显示百分比数字 |
| 作品卡片鼠标倾斜 | 桌面端鼠标移入卡片时产生 3D 倾斜效果 |
| 导航栏背景 | 向下滚动超过 80px 时渐变模糊背景 |

## 后续扩展指南

本项目基于 Vite + Vanilla JS，扩展路径灵活：

- **加博客**: 接入 Astro 或直接在页面新增 Blog 区块
- **加 CMS**: 集成 Decap CMS（基于 Git 的内容管理）
- **升级框架**: Vite 可无缝引入 React / Vue 组件，无需重写
- **加后端**: 在 `src/` 中新增 API 调用逻辑即可
