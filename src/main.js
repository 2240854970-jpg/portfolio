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
   Canvas Particle System
   ============================================ */
class ParticleCanvas {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.particles = []
    this.mouse = { x: -9999, y: -9999 }
    this.resize()
    this.initParticles()
    this.bindEvents()
    this.animate()
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio, 2)
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr
    this.canvas.style.width = this.width + 'px'
    this.canvas.style.height = this.height + 'px'
    this.ctx.scale(this.dpr, this.dpr)
  }

  initParticles() {
    const count = Math.min(Math.floor((this.width * this.height) / 12000), 80)
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    }))
  }

  bindEvents() {
    const resize = () => { this.resize(); this.initParticles() }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY })
    window.addEventListener('mouseleave', () => { this.mouse.x = -9999; this.mouse.y = -9999 })
  }

  animate(time) {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)
    const t = time || 0

    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy
      if (p.x < -10) p.x = this.width + 10
      if (p.x > this.width + 10) p.x = -10
      if (p.y < -10) p.y = this.height + 10
      if (p.y > this.height + 10) p.y = -10

      const dx = p.x - this.mouse.x, dy = p.y - this.mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120 && dist > 0) {
        const force = ((120 - dist) / 120) * 1.2
        p.vx += (dx / dist) * force * 0.02
        p.vy += (dy / dist) * force * 0.02
      }
      p.vx *= 0.99; p.vy *= 0.99
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      if (speed > 1) { p.vx /= speed; p.vy /= speed }

      const pulse = Math.sin(t * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7
      const alpha = p.alpha * pulse

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(192, 132, 252, ${alpha * 0.6})`
      ctx.fill()

      if (p.r > 1.5) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192, 132, 252, ${alpha * 0.06})`
        ctx.fill()
      }
    }

    // Connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i], b = this.particles[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = dx * dx + dy * dy
        if (dist < 120 * 120) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(192, 132, 252, ${(1 - dist / (120 * 120)) * 0.15})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    requestAnimationFrame(this.animate.bind(this))
  }
}

/* ============================================
   Hero Animation
   ============================================ */
function animateHero() {
  const tl = gsap.timeline({ delay: 0.8 })
  tl.fromTo('#hero-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
  tl.to('.hero-line .char', { opacity: 1, y: 0, rotate: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out' }, '-=0.3')
  tl.to('#hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2')
  tl.to('#hero-scroll', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
}

/* ============================================
   Stats — count up
   ============================================ */
function renderStats() {
  const grid = document.getElementById('stats-grid')
  if (!grid) return

  grid.innerHTML = siteData.stats
    .map((s, i) => `
      <div class="stat-item reveal-up" data-delay="${i * 0.1}">
        <span class="stat-icon">${s.icon}</span>
        <span class="stat-value" data-target="${s.value}">0</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `)
    .join('')

  // Animate stat items
  document.querySelectorAll('.stat-item').forEach((item) => {
    const valueEl = item.querySelector('.stat-value')
    const target = valueEl.dataset.target
    const numeric = parseFloat(target)
    const suffix = target.replace(/[\d.]/g, '')
    const baseNum = numeric || 0

    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Fade in
        gsap.to(item, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        // Count up
        if (baseNum > 0) {
          gsap.fromTo(
            { val: 0 },
            { val: 0 },
            {
              val: baseNum,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: function () {
                const num = Math.round(this.targets()[0].val)
                if (target.includes('.')) {
                  valueEl.textContent = num.toFixed(1) + suffix
                } else {
                  valueEl.textContent = num + suffix
                }
              },
            }
          )
        } else {
          // For non-numeric like "300+" etc, just show it
          valueEl.textContent = target
        }
      },
    })
  })
}

/* ============================================
   Featured Works
   ============================================ */
function renderFeatured() {
  const grid = document.getElementById('featured-grid')
  if (!grid) return

  const featured = siteData.works.filter((w) => siteData.featuredWorkIds.includes(w.id))
  grid.innerHTML = featured.map((w) => renderWorkCard(w)).join('')

  // Animate cards
  grid.querySelectorAll('.work-card').forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' })
      },
    })
  })
}

/* ============================================
   About Brief
   ============================================ */
function renderAboutBrief() {
  const p1 = document.getElementById('about-brief-p1')
  const p2 = document.getElementById('about-brief-p2')
  if (p1) p1.textContent = siteData.about.bio1
  if (p2) p2.textContent = siteData.about.bio2
}

/* ============================================
   Scroll Reveals (general)
   ============================================ */
function setupReveals() {
  document.querySelectorAll('.reveal-up').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
      },
    })
  })
}

/* ============================================
   Footer Top
   ============================================ */
function setupFooterTop() {
  const btn = document.querySelector('.footer-top')
  if (!btn) return
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.querySelector('#hero') || document.querySelector('.page-header')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  })
}

/* ============================================
   Card tilt
   ============================================ */
function setupCardTilt() {
  if (window.innerWidth < 768) return
  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, { rotateX: -y * 6, rotateY: x * 6, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
    })
  })
}

/* ============================================
   Init
   ============================================ */
function init() {
  const canvas = document.getElementById('hero-canvas')
  if (canvas) new ParticleCanvas(canvas)

  animateHero()
  renderStats()
  renderFeatured()
  renderAboutBrief()
  renderContact('')
  renderFooter()
  setupNav()
  setupReveals()
  setupFooterTop()
  setupCardTilt()

  ScrollTrigger.refresh()
}

document.addEventListener('DOMContentLoaded', init)
