# 李龙 · 视觉全案与 AI 工作流

生产域名：https://chaojifeishu.xyz/

白底单页视觉作品集，使用 Vite 与原生 JavaScript；作品素材、图组、A+ 长图、视频自动播放和工具展示均在本工程维护。

## 日常更新

- `index.html`：页面结构、定位、职责与成果。
- `src/visual/content-refined.js`：图组与工具内容。
- `src/visual/aplus-refined.js`：A+ 数据。
- `src/visual/video-data.js`：视频数据。
- `src/visual/visual-led.css`：视觉样式。
- `src/visual/visual-led.js`：图组、工具和导航交互。
- `src/visual/visual-zoom.js`：大图缩放与拖动。
- `src/visual/inline-video-refined.js`：入屏播放控制。
- `public-site/assets/`：正式发布的图片与视频。

历史 `src` 其他文件及 `public` 内容不再作为生产入口，不应在旧文件中继续修改新站。

## 本地预览与发布

```powershell
npm ci
npm run dev
npm run build
npm run preview
```

构建产物在 `dist`，不要直接修改。生产脚本和样式由 Vite 自动生成带内容指纹的文件名。替换同名媒体时建议同步更换文件名并修改数据，避免浏览器继续显示旧媒体。

经确认后，将目标提交推送到 `main`，GitHub Actions 自动构建并发布 `dist` 到 `gh-pages`，保留 CNAME。不要强制推送，不要把其他未完成工作顺带发布。

## 验证

启动 `npm run preview` 后：

```powershell
python scripts/verify-release.py http://127.0.0.1:4201/
```

验证需要本机安装 Playwright Python 与 Chromium；网站运行本身不需要 Python。

## 回退

发布前源码提交：`8ab6637ba233aa470569356c736f4a71cf7f6d5a`。
发布前 Pages 提交：`fd10998f076ccab29a2983d88083d7ad1e11c666`。

本地已保留 `backup/pre-visual-site-20261026` 和 `backup/pre-visual-pages-20261026` 分支。需要回退时，在明确授权后撤销本次发布提交，再通过同一构建流程发布，不覆盖原站未提交的旧稿。
