/**
 * 共享工具函数
 * 所有页面共用：导航、页脚、联系区渲染
 */

import { siteData } from './data/site-data.js'

/* ── 导航通用逻辑 ── */
export function setupNav() {
  const toggle = document.getElementById('nav-toggle')
  const links = document.getElementById('nav-links')
  if (!toggle || !links) return

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active')
    links.classList.toggle('open')
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : ''
  })

  // 点击导航链接关闭菜单
  links.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active')
      links.classList.remove('open')
      document.body.style.overflow = ''
    })
  })

  // 滚动时显示导航背景
  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const nav = document.getElementById('nav')
        if (nav) {
          nav.classList.toggle('scrolled', window.scrollY > 60)
        }
        ticking = false
      })
      ticking = true
    }
  })
}

/* ── 页脚 ── */
export function renderFooter(id = 'footer-text') {
  const el = document.getElementById(id)
  if (el) el.textContent = siteData.footer
}

/* ── 联系区 ── */
export function renderContact(prefix = '') {
  const emailEl = document.getElementById(`contact-email${prefix}`)
  const emailText = document.getElementById(`contact-email${prefix}`)?.querySelector('.email-text')
  const contactText = document.getElementById(`contact-text${prefix}`)
  const socialsEl = document.getElementById(`contact-socials${prefix}`)

  if (emailEl) emailEl.href = `mailto:${siteData.email}`
  if (emailText) emailText.textContent = siteData.email
  if (contactText) contactText.textContent = `有兴趣聊一聊？给我发邮件吧`

  if (socialsEl) {
    socialsEl.innerHTML = siteData.socials
      .map((s) => `<a href="${s.url}" class="social-link" target="_blank" rel="noopener">${s.icon} ${s.name}</a>`)
      .join('')
  }
}

/* ── 图片路径辅助（自动适配 base path） ── */
export function imgPath(path) {
  if (!path) return ''
  // 如果已经是绝对 URL 或以 base 开头，不重复处理
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith(import.meta.env.BASE_URL)) return path
  return import.meta.env.BASE_URL + path
}

/* ── 渲染作品卡片（首页网格 / 作品集网格通用） ── */
export function renderWorkCard(work) {
  const videoBadge = work.type === 'video'
    ? '<span class="work-badge-video">▶ 视频</span>'
    : ''

  return `
    <a href="work-detail.html?id=${work.id}" class="work-card reveal-up">
      <div class="work-visual" style="--grad: ${work.bgGrad || 'linear-gradient(135deg, #1a1a3d, #6366f1)'}">
        <div class="work-visual-content">
          ${work.thumbnail
            ? `<img src="${imgPath(work.thumbnail)}" alt="${work.title}" class="work-thumb-img" />`
            : `<span class="work-icon">✦</span>`
          }
        </div>
        ${videoBadge}
      </div>
      <div class="work-info">
        <span class="work-category">${work.category}</span>
        <h3 class="work-title">${work.title}</h3>
        <p class="work-desc">${work.brief.slice(0, 50)}${work.brief.length > 50 ? '…' : ''}</p>
      </div>
    </a>
  `
}

/* ── 作品卡片详情页链接 ── */
export function getWorkById(id) {
  return siteData.works.find((w) => w.id === id) || null
}
