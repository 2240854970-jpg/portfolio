import gsap from 'gsap'
import { siteData } from './data/site-data.js'
import { setupNav, renderFooter, getWorkById } from './utils.js'

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
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
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

  // Page title
  document.title = `${work.title} — 陈一铭`

  // Hero visual
  const heroVisual = document.getElementById('detail-hero-visual')
  if (heroVisual) {
    if (work.images && work.images.length > 0) {
      heroVisual.innerHTML = `<img src="${work.images[0]}" alt="${work.title}" class="detail-hero-img" />`
    } else {
      heroVisual.innerHTML = `
        <div class="detail-hero-placeholder" style="background:${work.bgGrad}">
          <span class="detail-hero-icon">✦</span>
        </div>
      `
    }
  }

  // Hero info
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
    toolsEl.innerHTML = work.tools
      .map((t) => `<span class="tool-tag">${t}</span>`)
      .join('')
  }

  // Content sections
  const bodyEl = document.getElementById('detail-body')
  if (bodyEl && work.detailSections) {
    bodyEl.innerHTML = work.detailSections
      .map((s) => {
        if (s.type === 'text') {
          return `<div class="detail-text-block reveal-up"><p>${s.content}</p></div>`
        }
        if (s.type === 'image') {
          return `<div class="detail-image-block reveal-up">
            <img src="${s.src}" alt="${work.title}" loading="lazy" />
          </div>`
        }
        return ''
      })
      .join('')
  }

  // If it's a video work and has video URL, show it
  if (work.type === 'video' && work.videoUrl && bodyEl) {
    const videoHtml = `
      <div class="detail-video-block reveal-up">
        <div class="video-wrapper">
          ${work.videoUrl.includes('youtube') || work.videoUrl.includes('bilibili')
            ? `<iframe src="${work.videoUrl}" frameborder="0" allowfullscreen></iframe>`
            : `<video src="${work.videoUrl}" controls playsinline></video>`
          }
        </div>
      </div>
    `
    bodyEl.insertAdjacentHTML('afterbegin', videoHtml)
  }

  // If has images array with more than 1 image, show gallery
  if (work.images && work.images.length > 1) {
    const galleryHtml = `
      <div class="detail-gallery reveal-up">
        ${work.images.slice(1).map((img) => `
          <div class="detail-gallery-item">
            <img src="${img}" alt="${work.title}" loading="lazy" />
          </div>
        `).join('')}
      </div>
    `
    bodyEl.insertAdjacentHTML('beforeend', galleryHtml)
  }

  // Animate reveal blocks
  document.querySelectorAll('.reveal-up').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        ease: 'power3.out',
      }
    )
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
