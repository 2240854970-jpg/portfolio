import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData } from './data/site-data.js'
import { setupNav, renderFooter, getWorkById, imgPath } from './utils.js'

gsap.registerPlugin(ScrollTrigger)

/* ============================================
   Loading
   ============================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader')
  gsap.to(loader, {
    opacity: 0, duration: 0.8, delay: 0.3, ease: 'power2.out',
    onComplete: () => loader.classList.add('hidden'),
  })
})

/* ============================================
   URL Params
   ============================================ */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name)
}

/* ============================================
   Render Detail
   ============================================ */
function renderDetail() {
  const id = getParam('id')
  const work = getWorkById(id)

  if (!work) {
    document.querySelector('.detail-section .container').innerHTML = `
      <a href="works.html" class="detail-back">← 返回作品集</a>
      <div class="detail-not-found">
        <h2>作品未找到</h2>
        <p>请返回作品集选择其他作品</p>
      </div>
    `
    return
  }

  document.title = `${work.title} — 李龙`

  // ── Hero ──
  const heroVisual = document.getElementById('detail-hero-visual')
  if (heroVisual) {
    if (work.images && work.images.length > 0) {
      heroVisual.innerHTML = `<img src="${imgPath(work.images[0])}" alt="${work.title}" class="detail-hero-img" />`
    } else {
      heroVisual.innerHTML = `<div class="detail-hero-placeholder" style="background:${work.bgGrad}"><span class="detail-hero-icon">✦</span></div>`
    }
  }

  document.getElementById('detail-category').textContent = work.category
  document.getElementById('detail-title').textContent = work.title

  const metaEl = document.getElementById('detail-meta')
  if (metaEl) {
    metaEl.innerHTML = `
      <span class="detail-meta-item">📅 ${work.date || ''}</span>
      <span class="detail-meta-item">👤 ${work.role || ''}</span>
    `
  }

  document.getElementById('detail-brief').textContent = work.brief

  const achievementEl = document.getElementById('detail-achievement')
  if (achievementEl && work.achievement) {
    achievementEl.innerHTML = `
      <div class="detail-achievement-badge">
        <span class="achievement-icon">✦</span>
        <span>${work.achievement}</span>
      </div>
    `
  }

  const toolsEl = document.getElementById('detail-tools')
  if (toolsEl && work.tools) {
    toolsEl.innerHTML = work.tools.map((t) => `<span class="tool-tag">${t}</span>`).join('')
  }

  // ── Body Content ──
  const bodyEl = document.getElementById('detail-body')
  if (!bodyEl) return

  let html = ''

  // Design Intro
  if (work.designIntro) {
    html += `
      <div class="detail-intro reveal-up">
        <h3 class="detail-section-label">Design Strategy</h3>
        <p>${work.designIntro}</p>
      </div>
    `
  }

  // Video block (if video work)
  if (work.type === 'video' && work.videoUrl) {
    html += `
      <div class="detail-video-block reveal-up">
        <div class="video-wrapper">
          ${work.videoUrl.includes('youtube') || work.videoUrl.includes('bilibili')
            ? `<iframe src="${work.videoUrl}" frameborder="0" allowfullscreen></iframe>`
            : `<video src="${work.videoUrl}" controls playsinline></video>`
          }
        </div>
      </div>
    `
  }

  // Showcase — each image with its description
  if (work.showCase && work.showCase.length > 0) {
    html += `<div class="detail-showcase">`
    work.showCase.forEach((item, i) => {
      const align = i % 2 === 0 ? 'showcase-left' : 'showcase-right'
      html += `
        <div class="showcase-item ${align} reveal-up" data-delay="${i * 0.05}">
          <div class="showcase-image">
            <img src="${imgPath(item.src)}" alt="${item.title}" loading="lazy" />
          </div>
          <div class="showcase-text">
            <span class="showcase-number">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="showcase-title">${item.title}</h3>
            <p class="showcase-desc">${item.desc}</p>
          </div>
        </div>
      `
    })
    html += `</div>`
  }

  // Design Result
  if (work.designResult) {
    html += `
      <div class="detail-result reveal-up">
        <h3 class="detail-section-label">成果数据</h3>
        <div class="detail-result-badge">
          <span class="achievement-icon">✦</span>
          <span>${work.designResult}</span>
        </div>
      </div>
    `
  }

  // Fallback: if no showCase but has detailSections (for old works)
  if (!work.showCase && work.detailSections) {
    html += work.detailSections.map((s) => {
      if (s.type === 'text') {
        return `<div class="detail-text-block reveal-up"><p>${s.content}</p></div>`
      }
      if (s.type === 'image') {
        return `<div class="detail-image-block reveal-up"><img src="${imgPath(s.src)}" alt="" loading="lazy" /></div>`
      }
      return ''
    }).join('')
  }

  // Gallery (remaining images if not shown in showcase)
  if (!work.showCase && work.images && work.images.length > 1) {
    html += `<div class="detail-gallery reveal-up">`
    html += work.images.slice(1).map((img) =>
      `<div class="detail-gallery-item"><img src="${imgPath(img)}" alt="" loading="lazy" /></div>`
    ).join('')
    html += `</div>`
  }

  bodyEl.innerHTML = html

  // Animate reveals
  document.querySelectorAll('.reveal-up').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay, ease: 'power3.out', overwrite: 'auto' })
      },
    })
  })

  ScrollTrigger.refresh()
}

/* ============================================
   Init
   ============================================ */
function init() {
  renderDetail()
  renderFooter('footer-text-detail')
  setupNav()
}

document.addEventListener('DOMContentLoaded', init)
