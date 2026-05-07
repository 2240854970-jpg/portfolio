import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData } from './data/site-data.js'
import { setupNav, renderFooter, renderContact } from './utils.js'

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
   Bio
   ============================================ */
function renderBio() {
  const p1 = document.getElementById('about-bio-1')
  const p2 = document.getElementById('about-bio-2')
  const p3 = document.getElementById('about-bio-3')
  if (p1) p1.textContent = siteData.about.bio1
  if (p2) p2.textContent = siteData.about.bio2
  if (p3) p3.textContent = siteData.about.bio3
}

/* ============================================
   Achievement Wall
   ============================================ */
function renderAchievements() {
  const grid = document.getElementById('achievement-grid')
  if (!grid) return

  grid.innerHTML = siteData.about.achievements
    .map(
      (a, i) => `
      <div class="achievement-card reveal-up" data-delay="${i * 0.08}">
        <span class="achievement-card-icon">${a.icon}</span>
        <div class="achievement-card-content">
          <h3 class="achievement-card-title">${a.title}</h3>
          <span class="achievement-card-year">${a.year}</span>
          <p class="achievement-card-desc">${a.desc}</p>
        </div>
      </div>
    `
    )
    .join('')

  animateGrid(grid)
}

/* ============================================
   Timeline
   ============================================ */
function renderTimeline() {
  const el = document.getElementById('timeline')
  if (!el) return

  el.innerHTML = siteData.about.experience
    .map(
      (exp, i) => `
      <div class="timeline-item reveal-up" data-delay="${i * 0.1}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-period">${exp.period}</span>
          <h3 class="timeline-company">${exp.company}</h3>
          <span class="timeline-role">${exp.role}</span>
          <p class="timeline-desc">${exp.desc}</p>
        </div>
      </div>
    `
    )
    .join('')

  animateGrid(el)
}

/* ============================================
   Skills
   ============================================ */
function renderSkills() {
  const grid = document.getElementById('about-skills-grid')
  if (!grid) return

  const columns = [
    { title: '设计工具', skills: siteData.about.skills.slice(0, 2) },
    { title: '三维 / 动效', skills: siteData.about.skills.slice(2, 4) },
    { title: '其他', skills: siteData.about.skills.slice(4) },
  ]

  grid.innerHTML = columns
    .map(
      (col, ci) => `
      <div class="about-skills-col reveal-up" data-delay="${ci * 0.1}">
        <h3 class="about-skills-cat">${col.title}</h3>
        ${col.skills
          .map(
            (s) => `
          <div class="about-skill" data-value="${s.level}">
            <div class="about-skill-head">
              <span class="about-skill-name">${s.name}</span>
              <span class="about-skill-pct">${Math.round(s.level * 100)}%</span>
            </div>
            <div class="about-skill-bar">
              <div class="about-skill-fill"></div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `
    )
    .join('')

  // Animate skill bars
  grid.querySelectorAll('.about-skill').forEach((skill) => {
    const value = parseFloat(skill.dataset.value)
    const fill = skill.querySelector('.about-skill-fill')
    ScrollTrigger.create({
      trigger: skill,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(fill, {
          width: `${value * 100}%`,
          duration: 1.2,
          ease: 'power3.out',
        })
      },
    })
  })

  animateGrid(grid)
}

/* ============================================
   Testimonials
   ============================================ */
function renderTestimonials() {
  const grid = document.getElementById('testimonial-grid')
  if (!grid) return

  grid.innerHTML = siteData.about.testimonials
    .map(
      (t, i) => `
      <div class="testimonial-card reveal-up" data-delay="${i * 0.15}">
        <div class="testimonial-quote-mark">"</div>
        <p class="testimonial-quote">${t.quote}</p>
        <div class="testimonial-author">
          <span class="testimonial-name">${t.author}</span>
          <span class="testimonial-role">${t.role}</span>
        </div>
      </div>
    `
    )
    .join('')

  animateGrid(grid)
}

/* ============================================
   Utility — Animate reveal-up children
   ============================================ */
function animateGrid(container) {
  container.querySelectorAll('.reveal-up').forEach((el) => {
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
}

/* ============================================
   Init
   ============================================ */
function init() {
  renderBio()
  renderAchievements()
  renderTimeline()
  renderSkills()
  renderTestimonials()
  renderContact('-about')
  renderFooter('footer-text-about')
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
