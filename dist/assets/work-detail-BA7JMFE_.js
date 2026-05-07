import{g as r,a as c,s as m,d as g}from"./utils-C1HqCLCR.js";window.addEventListener("load",()=>{const i=document.getElementById("loader");r.to(i,{opacity:0,duration:.8,delay:.3,ease:"power2.out",onComplete:()=>i.classList.add("hidden")})});function v(i){return new URLSearchParams(window.location.search).get(i)}function p(){const i=v("id"),e=g(i);if(!e){document.querySelector(".detail-section .container").innerHTML=`
      <a href="works.html" class="detail-back">← 返回作品集</a>
      <div class="detail-not-found">
        <h2>作品未找到</h2>
        <p>请返回作品集选择其他作品</p>
      </div>
    `;return}document.title=`${e.title} — 陈一铭`;const l=document.getElementById("detail-hero-visual");l&&(e.images&&e.images.length>0?l.innerHTML=`<img src="${e.images[0]}" alt="${e.title}" class="detail-hero-img" />`:l.innerHTML=`
        <div class="detail-hero-placeholder" style="background:${e.bgGrad}">
          <span class="detail-hero-icon">✦</span>
        </div>
      `),document.getElementById("detail-category").textContent=e.category,document.getElementById("detail-title").textContent=e.title;const n=document.getElementById("detail-meta");n&&(n.innerHTML=`
      <span class="detail-meta-item">📅 ${e.date||""}</span>
      <span class="detail-meta-item">👤 ${e.role||""}</span>
    `),document.getElementById("detail-brief").textContent=e.brief;const o=document.getElementById("detail-achievement");o&&e.achievement&&(o.innerHTML=`
      <div class="detail-achievement-badge">
        <span class="achievement-icon">✦</span>
        <span>${e.achievement}</span>
      </div>
    `);const d=document.getElementById("detail-tools");d&&e.tools&&(d.innerHTML=e.tools.map(t=>`<span class="tool-tag">${t}</span>`).join(""));const a=document.getElementById("detail-body");if(a&&e.detailSections&&(a.innerHTML=e.detailSections.map(t=>t.type==="text"?`<div class="detail-text-block reveal-up"><p>${t.content}</p></div>`:t.type==="image"?`<div class="detail-image-block reveal-up">
            <img src="${t.src}" alt="${e.title}" loading="lazy" />
          </div>`:"").join("")),e.type==="video"&&e.videoUrl&&a){const t=`
      <div class="detail-video-block reveal-up">
        <div class="video-wrapper">
          ${e.videoUrl.includes("youtube")||e.videoUrl.includes("bilibili")?`<iframe src="${e.videoUrl}" frameborder="0" allowfullscreen></iframe>`:`<video src="${e.videoUrl}" controls playsinline></video>`}
        </div>
      </div>
    `;a.insertAdjacentHTML("afterbegin",t)}if(e.images&&e.images.length>1){const t=`
      <div class="detail-gallery reveal-up">
        ${e.images.slice(1).map(s=>`
          <div class="detail-gallery-item">
            <img src="${s}" alt="${e.title}" loading="lazy" />
          </div>
        `).join("")}
      </div>
    `;a.insertAdjacentHTML("beforeend",t)}document.querySelectorAll(".reveal-up").forEach(t=>{r.fromTo(t,{opacity:0,y:40},{opacity:1,y:0,duration:.8,scrollTrigger:{trigger:t,start:"top 85%",once:!0},ease:"power3.out"})}),ScrollTrigger.refresh()}function u(){p(),c("footer-text-detail"),m()}document.addEventListener("DOMContentLoaded",u);
