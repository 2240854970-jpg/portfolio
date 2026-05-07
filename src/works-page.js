import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData } from './data/site-data.js'
import { setupNav, renderFooter, renderContact, renderWorkCard } from './utils.js'

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
   Page Description
   ============================================ */
function renderPageDesc() {
  const el = document.getElementById('page-desc')
  if (el) {
    el.textContent = `共 ${siteData.works.length} 个项目，涵盖 ${siteData.categories.length - 1} 个类别`
  }
}

/* ============================================
   Filter Bar
   ============================================ */
let currentFilter = '全部'

function renderFilters() {
  const bar = document.getElementById('filter-bar')
  if (!bar) return

  bar.innerHTML = siteData.categories
    .map((cat) => `<button class="filter-btn ${cat === '全部' ? 'active' : ''}" data-cat="${cat}">${cat}</button>`)
    .join('')

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn')
    if (!btn) return

    currentFilter = btn.dataset.cat
    bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    renderWorks()
  })
}

/* ============================================
   Works Grid
   ============================================ */
function renderWorks() {
  const grid = document.getElementById('works-grid')
  const empty = document.getElementById('works-empty')
  if (!grid) return

  const filtered = currentFilter === '全部'
    ? siteData.works
    : siteData.works.filter((w) => w.category === currentFilter)

  if (filtered.length === 0) {
    grid.innerHTML = ''
    if (empty) empty.style.display = 'block'
    return
  }

  if (empty) empty.style.display = 'none'

  grid.innerHTML = filtered.map((w) => renderWorkCard(w)).join('')

  // Animate cards with stagger
  const cards = grid.querySelectorAll('.work-card')
  cards.forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 40 })
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(card, {
          opacity: 1, y: 0, duration: 0.6,
          delay: Math.min(i * 0.08, 0.5),
          ease: 'power3.out',
        })
      },
    })
  })

  ScrollTrigger.refresh()
}

/* ============================================
   Init
   ============================================ */
function init() {
  renderPageDesc()
  renderFilters()
  renderWorks()
  renderContact('-page')
  renderFooter('footer-text-works')
  setupNav()

  // Footer top
  const btn = document.querySelector('.footer-top')
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  ScrollTrigger.refresh()
}

document.addEventListener('DOMContentLoaded', init)
