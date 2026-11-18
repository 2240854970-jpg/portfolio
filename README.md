# 李龙作品集｜AI 视觉与工作流

正式域名：https://chaojifeishu.xyz/

2026-11-18 发布采用用户确认的 B 版整版重设计，并替换 A+ 第一、第三套图片。内容与交互基于已有作品集延续，保留白底单页、自然图像比例、900px以内视频、六项案例及编号图片。

## 日常维护
本次本地维护目录：`portfolio-hallmark-full-20261117`。旧目录与旧候选仅作历史对照，不要在旧文件中修改新站。

- `index.html`：页面结构、静态事实与无脚本回退。
- `src/visual/content-refined.js`：产品图组、六案例与业务文案。
- `src/visual/aplus-refined.js`：三套A+，第一和第三采用 `20261118` 文件，中间不变。
- `src/visual/video-data.js`：五段视频元数据，首段27秒。
- `src/visual/full-layout.css`：B版首屏、作品跨页、视频两栏、案例结构。
- `src/visual/visual-led.css`：共用组件与响应式基础。
- `src/visual/tokens.css`、`base.css`：颜色、字体、间距和可访问性基础。
- `src/visual/visual-led.js`：图组、A+、案例切换与导航。
- `src/visual/inline-video-refined.js`：视频入屏播放控制。
- `src/visual/visual-zoom.js`：大图阅读。
- `public-site/assets/`：媒体与自托管字体，Noto Sans SC 的 OFL 许可证包含在 fonts 文件夹。

## 运行

```powershell
npm ci
npm run dev -- --port 4218
npm run build
npm run preview -- --port 4219
```

不要修改 dist，构建会重新生成。新增中文文本后可执行 `python scripts/prepare-preview-font.py` 更新字体子集；需要 Python fontTools，首次会下载官方 OFL 字体。网站运行不依赖Python。

## 验证

```powershell
python scripts/verify-design-preview.py http://127.0.0.1:4219/
python scripts/verify-full-layout.py http://127.0.0.1:4219/
```

两份测试分别验证完整交互和新版结构，覆盖素材数量、实际顺序、原尺寸阅读、脚本关闭回退、桌面与手机，以及无用户激活的静音自动播放。测试需要本机 Playwright Python 与 Chromium。

## 发布与回退
推送指定提交至main，由 GitHub Actions 构建并发布gh-pages，保留域名设置。用户确认发布后再推送，不强制覆盖远程。

本轮发布前源码为 `4dc4a3611fbb22241ead4b83ec1f98b8fe96ce8f`，本地分支 `backup/pre-redesign-20261118` 保留此回退点；原始媒体与历史工程没有覆盖。需要回退时撤销本轮发布提交，再通过相同构建流程部署。
