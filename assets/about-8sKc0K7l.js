import{g as s,S as o,r as d,a as c,s as u,b as i}from"./utils-gq87UytY.js";/* empty css              */s.registerPlugin(o);window.addEventListener("load",()=>{const e=document.getElementById("loader");s.to(e,{opacity:0,duration:.8,delay:.3,ease:"power2.out",onComplete:()=>e.classList.add("hidden")})});function m(){const e=document.getElementById("about-bio-1"),t=document.getElementById("about-bio-2"),a=document.getElementById("about-bio-3");e&&(e.textContent=i.about.bio1),t&&(t.textContent=i.about.bio2),a&&(a.textContent=i.about.bio3)}function p(){const e=document.getElementById("achievement-grid");e&&(e.innerHTML=i.about.achievements.map((t,a)=>`
      <div class="achievement-card reveal-up" data-delay="${a*.08}">
        <span class="achievement-card-icon">${t.icon}</span>
        <div class="achievement-card-content">
          <h3 class="achievement-card-title">${t.title}</h3>
          <span class="achievement-card-year">${t.year}</span>
          <p class="achievement-card-desc">${t.desc}</p>
        </div>
      </div>
    `).join(""),l(e))}function v(){const e=document.getElementById("timeline");e&&(e.innerHTML=i.about.experience.map((t,a)=>`
      <div class="timeline-item reveal-up" data-delay="${a*.1}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-period">${t.period}</span>
          <h3 class="timeline-company">${t.company}</h3>
          <span class="timeline-role">${t.role}</span>
          <p class="timeline-desc">${t.desc}</p>
        </div>
      </div>
    `).join(""),l(e))}function b(){const e=document.getElementById("about-skills-grid");if(!e)return;const t=[{title:"设计工具",skills:i.about.skills.slice(0,2)},{title:"三维 / 动效",skills:i.about.skills.slice(2,4)},{title:"其他",skills:i.about.skills.slice(4)}];e.innerHTML=t.map((a,r)=>`
      <div class="about-skills-col reveal-up" data-delay="${r*.1}">
        <h3 class="about-skills-cat">${a.title}</h3>
        ${a.skills.map(n=>`
          <div class="about-skill" data-value="${n.level}">
            <div class="about-skill-head">
              <span class="about-skill-name">${n.name}</span>
              <span class="about-skill-pct">${Math.round(n.level*100)}%</span>
            </div>
            <div class="about-skill-bar">
              <div class="about-skill-fill"></div>
            </div>
          </div>
        `).join("")}
      </div>
    `).join(""),e.querySelectorAll(".about-skill").forEach(a=>{const r=parseFloat(a.dataset.value),n=a.querySelector(".about-skill-fill");o.create({trigger:a,start:"top 85%",once:!0,onEnter:()=>{s.to(n,{width:`${r*100}%`,duration:1.2,ease:"power3.out"})}})}),l(e)}function h(){const e=document.getElementById("testimonial-grid");e&&(e.innerHTML=i.about.testimonials.map((t,a)=>`
      <div class="testimonial-card reveal-up" data-delay="${a*.15}">
        <div class="testimonial-quote-mark">"</div>
        <p class="testimonial-quote">${t.quote}</p>
        <div class="testimonial-author">
          <span class="testimonial-name">${t.author}</span>
          <span class="testimonial-role">${t.role}</span>
        </div>
      </div>
    `).join(""),l(e))}function l(e){e.querySelectorAll(".reveal-up").forEach(t=>{const a=parseFloat(t.dataset.delay)||0;o.create({trigger:t,start:"top 85%",once:!0,onEnter:()=>{s.to(t,{opacity:1,y:0,duration:.7,delay:a,ease:"power3.out",overwrite:"auto"})}})})}function y(){m(),p(),v(),b(),h(),d("-about"),c("footer-text-about"),u();const e=document.querySelector(".footer-top");e&&e.addEventListener("click",t=>{t.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})}),o.refresh()}document.addEventListener("DOMContentLoaded",y);
