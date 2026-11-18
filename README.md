# 李龙作品集

正式网站：https://chaojifeishu.xyz/
源码仓库：https://github.com/2240854970-jpg/portfolio
正式发布分支：`main`。
托管：现有 EdgeOne Makers Free 项目 `lilong-portfolio-trial-20261118`，海外加速区域。项目名中的 trial 只是名称，不代表收费试用。

## 日常更新：只维护这一份源码

1. 从 GitHub `main` 同步最新版。
2. 在本地或工作分支修改，运行预览和验证。
3. 用户确认上线后，将目标提交推送到 `main`。
4. GitHub Actions 自动构建并上传至当前 EdgeOne 项目。
5. Actions 最后检查正式域名的 `release.json` 与本次提交一致；检查成功才算发布完成。

无需再手动上传 ZIP，也不需要修改 DNS。其他分支的普通推送不会更新正式站。

当前本机维护目录：`portfolio-hallmark-full-20261117`。此前的 `portfolio-site`、`portfolio-site-release-20261026` 和其他预览目录属于历史工程，不能混用作为最新版来源。换电脑时直接 clone 本仓库。

## 常用命令

```powershell
git pull --ff-only origin main
npm ci
npm run dev -- --port 4218
npm run build
node scripts/ci/check-build.mjs
npm run preview -- --port 4219
```

有交互改动时运行：

```powershell
python scripts/verify-design-preview.py http://127.0.0.1:4219/
python scripts/verify-full-layout.py http://127.0.0.1:4219/
python scripts/verify-long-reader.py
```

最后一项针对本机4218的长图阅读器；测试需要本机 Python Playwright，网站和CI构建不依赖Python。

## 编辑位置

- `index.html`：页面结构、静态文案与无脚本回退。
- `src/visual/content-refined.js`：产品图组、六个AI案例、业务说明。
- `src/visual/aplus-refined.js`：A+图片、尺寸和介绍。
- `src/visual/video-data.js`：视频文件、顺序、标题与时长。
- `src/visual/full-layout.css`：B版整体布局。
- `src/visual/visual-led.css`、`tokens.css`、`base.css`：共用样式与设计变量。
- `src/visual/reader.css`、`visual-zoom.js`：A+紧凑阅读器与缩放。
- `public-site/assets/`：正式图片、视频与字体。

不要直接修改 `dist`。替换媒体时使用新的文件名并修改数据引用，避免旧缓存。新增中文后可执行 `python scripts/prepare-preview-font.py` 更新本地字体子集；字体采用 SIL OFL 授权，许可证随素材保留。

## 自动部署配置

`.github/workflows/edgeone.yml` 负责main自动发布：Node22.11.0、npm ci、Vite build、素材检查、固定版本官方EdgeOne CLI上传、正式域名提交标识验证。

部署凭证只放在本仓库 GitHub Actions Secret `EDGEONE_API_TOKEN`。不写入源码、公开产物或运行日志。CI仅在发布步骤注入该凭证；不对外部PR运行带凭证代码；跳过AI Gateway密钥同步。凭证失效时更新Secret后重新运行工作流，不改网页。

自动化使用既有项目和免费套餐，不新增云产品；仍受各平台免费额度与服务规则约束。

## 回退

优先通过 Git revert 撤销造成问题的提交并推送main，自动重新发布。不要force-push，不要删除域名或重新建项目。

`.github/workflows/deploy.yml` 是旧 GitHub Pages 手动回退流程，已移除push自动触发，必须手动勾选确认才会运行；它不会自动接管域名。

阿里云DNS、免费证书续期验证记录以及必要时切回旧托管的步骤见 `EDGEONE-LIVE.md`。不要删除 `_dnsauth` 验证记录。
