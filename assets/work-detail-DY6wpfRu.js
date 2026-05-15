import{g as o,S as d,a as p,s as u,d as h,i as l}from"./utils-gq87UytY.js";/* empty css              */o.registerPlugin(d);window.addEventListener("load",()=>{const i=document.getElementById("loader");o.to(i,{opacity:0,duration:.8,delay:.3,ease:"power2.out",onComplete:()=>i.classList.add("hidden")})});function y(i){return new URLSearchParams(window.location.search).get(i)}function f(){const i=y("id"),e=h(i);if(!e){document.querySelector(".detail-section .container").innerHTML=`
      <a href="works.html" class="detail-back">← 返回作品集</a>
      <div class="detail-not-found">
        <h2>作品未找到</h2>
        <p>请返回作品集选择其他作品</p>
      </div>
    `;return}document.title=`${e.title} — 李龙`;const n=document.getElementById("detail-hero-visual");n&&(e.images&&e.images.length>0?n.innerHTML=`<img src="${l(e.images[0])}" alt="${e.title}" class="detail-hero-img" />`:n.innerHTML=`<div class="detail-hero-placeholder" style="background:${e.bgGrad}"><span class="detail-hero-icon">✦</span></div>`),document.getElementById("detail-category").textContent=e.category,document.getElementById("detail-title").textContent=e.title;const r=document.getElementById("detail-meta");r&&(r.innerHTML=`
      <span class="detail-meta-item">📅 ${e.date||""}</span>
      <span class="detail-meta-item">👤 ${e.role||""}</span>
    `),document.getElementById("detail-brief").textContent=e.brief;const c=document.getElementById("detail-achievement");c&&e.achievement&&(c.innerHTML=`
      <div class="detail-achievement-badge">
        <span class="achievement-icon">✦</span>
        <span>${e.achievement}</span>
      </div>
    `);const m=document.getElementById("detail-tools");m&&e.tools&&(m.innerHTML=e.tools.map(t=>`<span class="tool-tag">${t}</span>`).join(""));const v=document.getElementById("detail-body");if(!v)return;let a="";e.designIntro&&(a+=`
      <div class="detail-intro reveal-up">
        <h3 class="detail-section-label">Design Strategy</h3>
        <p>${e.designIntro}</p>
      </div>
    `),e.type==="video"&&e.videoUrl&&(a+=`
      <div class="detail-video-block reveal-up">
        <div class="video-wrapper">
          ${e.videoUrl.includes("youtube")||e.videoUrl.includes("bilibili")?`<iframe src="${e.videoUrl}" frameborder="0" allowfullscreen></iframe>`:`<video src="${e.videoUrl}" controls playsinline></video>`}
        </div>
      </div>
    `),e.showCase&&e.showCase.length>0&&(a+='<div class="detail-showcase">',e.showCase.forEach((t,s)=>{const g=s%2===0?"showcase-left":"showcase-right";a+=`
        <div class="showcase-item ${g} reveal-up" data-delay="${s*.05}">
          <div class="showcase-image">
            <img src="${l(t.src)}" alt="${t.title}" loading="lazy" />
          </div>
          <div class="showcase-text">
            <span class="showcase-number">${String(s+1).padStart(2,"0")}</span>
            <h3 class="showcase-title">${t.title}</h3>
            <p class="showcase-desc">${t.desc}</p>
          </div>
        </div>
      `}),a+="</div>"),e.designResult&&(a+=`
      <div class="detail-result reveal-up">
        <h3 class="detail-section-label">成果数据</h3>
        <div class="detail-result-badge">
          <span class="achievement-icon">✦</span>
          <span>${e.designResult}</span>
        </div>
      </div>
    `),!e.showCase&&e.detailSections&&(a+=e.detailSections.map(t=>t.type==="text"?`<div class="detail-text-block reveal-up"><p>${t.content}</p></div>`:t.type==="image"?`<div class="detail-image-block reveal-up"><img src="${l(t.src)}" alt="" loading="lazy" /></div>`:"").join("")),!e.showCase&&e.images&&e.images.length>1&&(a+='<div class="detail-gallery reveal-up">',a+=e.images.slice(1).map(t=>`<div class="detail-gallery-item"><img src="${l(t)}" alt="" loading="lazy" /></div>`).join(""),a+="</div>"),v.innerHTML=a,document.querySelectorAll(".reveal-up").forEach(t=>{const s=parseFloat(t.dataset.delay)||0;d.create({trigger:t,start:"top 85%",once:!0,onEnter:()=>{o.to(t,{opacity:1,y:0,duration:.7,delay:s,ease:"power3.out",overwrite:"auto"})}})}),d.refresh()}function w(){f(),p("footer-text-detail"),u()}document.addEventListener("DOMContentLoaded",w);
