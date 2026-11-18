# 作品集正式托管现状（2026-11-18）

正式地址：https://chaojifeishu.xyz/
当前托管：腾讯 EdgeOne Makers，Free 免费版，全球可用区（不含中国大陆）。
项目：`lilong-portfolio-trial-20261118`，项目ID `makers-jwxzp4tisyyv`，workspace `zone-3xk8ptpiyemi`。
虽然项目名带 trial，它现在承接正式域名；不代表开通了收费试用套餐。

## 域名与证书
域名仍由阿里云管理，NS未更换。
- `@ CNAME chaojifeishu.xyz.pages.dnsoe4.com`，TTL600秒，启用。
- 原GitHub Pages四条A（185.199.108.153/109.153/110.153/111.153）已暂停，未删除。
- `edgeonereclaim TXT`：已完成EdgeOne归属验证，保留。
- `_dnsauth CNAME chaojifeishu.xyz.eoacme0.com`：免费证书DNS委派，必须保留，不能当临时垃圾删除，否则可能影响自动续期。
- 免费RSA2048证书已部署，控制台显示到期2027-02-16 07:59:59，到期前自动续期。
- HTTP转HTTPS已开启（302），实测http入口最终转到https并返回200；未新增HSTS长期锁定策略。

## 更新方式（重要）
正式源码统一在 GitHub `main`。`.github/workflows/edgeone.yml` 在main推送后自动构建，使用官方CLI更新现有直接上传型项目，并验证正式域名的release.json是否对应本次提交。
本地维护目录：`portfolio-hallmark-full-20261117`。本机工作分支 `release/edgeone-auto-20261118` 跟踪origin/main；不要继续从旧迁移分支发布过时内容。
自动化通过GitHub Actions完成，不依赖控制台的Git原生关联，也不需要重建项目或改DNS。
部署Token只存储于仓库加密Secret `EDGEONE_API_TOKEN`，CI环境变量名为`EDGEONE_PAGES_API_TOKEN`，区域明确为china（账号站点），实际加速区域仍为overseas。保持`--skip-ai-gateway-sync`，不注入额外AI服务密钥。
凭证不得写入Git、上传包或明文日志。若失效，由维护者更新加密Secret后重跑工作流。
发布成功须同时满足Actions成功以及正式域名release.json匹配目标commit；仅push成功不代表已上线。

## 验证与回退
Google与Cloudflare公共DNS均已解析到新CNAME；HTTPS根页面Server返回edgeone makers，加载新阅读器构建。8组线上回归全部通过，包括视频冷播放、素材数量与次序、图片放大、A+原图、六案例及手机菜单。

回退：先暂停新的根CNAME，再启用原四条A。旧GitHub Pages部署及原源码保留。不要删除证书验证记录或更换NS。
完整操作记录：`artifacts/domain-migration-20261118/migration-state.json`。
