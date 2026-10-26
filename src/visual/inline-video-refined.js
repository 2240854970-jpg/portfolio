(()=>{
'use strict';
const data=window.PORTFOLIO?.videos||[],host=document.querySelector('#inline-video-list');if(!host)return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=s=>{const n=Math.round(s);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
host.innerHTML=data.map((item,i)=>`<figure class="inline-film" id="inline-${item.id}"><div class="inline-film-heading"><div><span class="inline-film-number">${String(i+1).padStart(2,'0')} / ${String(data.length).padStart(2,'0')}</span><h3>${esc(item.title)}</h3></div><span>${time(item.duration)} · ${item.fps} fps</span></div><video class="scroll-video" data-inline-video="${item.id}" data-src="assets/video-inline/${item.file}" poster="assets/video-inline/${item.poster}" width="${item.width}" height="${item.height}" muted playsinline loop controls preload="none" aria-label="${esc(item.title)}"></video><figcaption><div><span data-video-state>进入画面自动播放</span></div><button type="button" data-video-sound aria-pressed="false" aria-label="为${esc(item.title)}开启声音">开启声音</button></figcaption></figure>`).join('');
const videos=Array.from(host.querySelectorAll('video')),toggle=document.querySelector('#video-autoplay-toggle');
let autoplay=true,active=null,manualFocus=null,revision=0,scheduled=false;
const manualPaused=new Set(),blocked=new Set(),programPauses=new WeakSet(),autoRequests=new WeakSet(),pending=new Map();
const card=v=>v.closest('.inline-film');
function state(v,text){card(v).querySelector('[data-video-state]').textContent=text}
function soundState(v){const b=card(v).querySelector('[data-video-sound]');b.setAttribute('aria-pressed',String(!v.muted));b.textContent=v.muted?'开启声音':'关闭声音';b.setAttribute('aria-label',(v.muted?'开启':'关闭')+v.getAttribute('aria-label')+'声音');if(!v.paused)state(v,v.muted?'静音播放中':'有声播放中')}
function visible(v){const full=document.fullscreenElement;if(full&&(full===v||full.contains(v)))return {ratio:1,distance:0};const r=v.getBoundingClientRect(),w=Math.max(0,Math.min(innerWidth,r.right)-Math.max(0,r.left)),h=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top));return {ratio:w*h/Math.max(1,r.width*r.height),distance:Math.abs((r.top+r.bottom)/2-innerHeight/2)}}
function ensureSource(v){if(v.dataset.loaded)return;v.defaultMuted=true;v.muted=true;v.preload='metadata';v.src=v.dataset.src;v.dataset.loaded='true';v.load()}
function pause(v,reason='离开画面，已暂停'){if(!v.paused){programPauses.add(v);v.pause()}else if(pending.has(v)){v.pause()}card(v).classList.remove('is-playing');if(manualPaused.has(v))state(v,'已手动暂停');else if(blocked.has(v))state(v,'自动播放受限，可直接使用播放控件');else state(v,reason)}
function suspend(reason){if(active){revision++;active=null}manualFocus=null;videos.forEach(v=>pause(v,reason))}
function start(v,automatic){ensureSource(v);if(active!==v){active=v;revision++;if(automatic)v.muted=true}videos.forEach(other=>{if(other!==v)pause(other)});if(manualPaused.has(v)&&automatic){pause(v,'已手动暂停');return}if(automatic&&blocked.has(v))return;if(!v.paused||pending.has(v))return;const token=revision;pending.set(v,token);if(automatic)autoRequests.add(v);state(v,'视频载入中…');const promise=v.play();if(promise&&promise.then)promise.then(()=>{if(active!==v||token!==revision||document.hidden||document.body.classList.contains('modal-open')||visible(v).ratio<.12||manualPaused.has(v)){pause(v);return}soundState(v)}).catch(error=>{if(error.name==='AbortError'||active!==v||token!==revision||document.hidden)return;if(error.name==='NotAllowedError'){blocked.add(v);state(v,'自动播放受限，可直接使用播放控件')}else state(v,'视频暂时无法播放，请用控件重试')}).finally(()=>{if(pending.get(v)===token)pending.delete(v);autoRequests.delete(v)})}
function reconcile(){scheduled=false;if(document.hidden||document.body.classList.contains('modal-open')){suspend(document.hidden?'页面切换，已暂停':'查看图片期间暂停');return}if(!autoplay){videos.forEach(v=>{if(visible(v).ratio<.12)pause(v)});return}const candidates=videos.map(v=>({v,...visible(v)})).filter(x=>x.ratio>=.25&&!x.v.error).sort((a,b)=>a.distance-b.distance);if(manualFocus&&visible(manualFocus).ratio<.25)manualFocus=null;let next=manualFocus||candidates[0]?.v;if(!next){suspend('进入画面自动播放');return}if(!manualFocus&&active){const current=candidates.find(x=>x.v===active),best=candidates[0];if(current&&best&&current.distance-best.distance<30)next=active}start(next,true)}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(reconcile)}
for(const v of videos){v.defaultMuted=true;v.muted=true;
 v.addEventListener('play',()=>{const automatic=autoRequests.has(v);autoRequests.delete(v);if(document.hidden||document.body.classList.contains('modal-open')||visible(v).ratio<.12){pause(v);return}if(automatic&&active!==v){pause(v);return}if(!automatic){manualFocus=v;manualPaused.delete(v);blocked.delete(v);if(active!==v){active=v;revision++}}videos.forEach(other=>{if(other!==v)pause(other)});soundState(v)});
 v.addEventListener('playing',()=>{if(active!==v||document.hidden||visible(v).ratio<.12){pause(v);return}card(v).classList.add('is-playing');soundState(v)});
 v.addEventListener('pause',()=>{card(v).classList.remove('is-playing');if(programPauses.has(v)){programPauses.delete(v);return}if(document.hidden||document.body.classList.contains('modal-open')||v.ended||v.seeking)return;manualPaused.add(v);state(v,'已手动暂停')});
 v.addEventListener('waiting',()=>{if(active===v&&!v.paused)state(v,'视频缓冲中…')});
 v.addEventListener('volumechange',()=>soundState(v));
 v.addEventListener('error',()=>{state(v,'视频加载失败，请刷新或用控件重试');blocked.add(v)});
 card(v).querySelector('[data-video-sound]').addEventListener('click',()=>{ensureSource(v);const unmute=v.muted;v.muted=!unmute;manualPaused.delete(v);blocked.delete(v);manualFocus=v;start(v,false);soundState(v)});
}
if('IntersectionObserver' in window){const loader=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){ensureSource(entry.target);loader.unobserve(entry.target)}},{rootMargin:'350px 0px',threshold:0});videos.forEach(v=>loader.observe(v))}
toggle.addEventListener('click',()=>{autoplay=!autoplay;toggle.setAttribute('aria-pressed',String(autoplay));toggle.textContent=autoplay?'暂停自动播放':'恢复自动播放';if(!autoplay)suspend('自动播放已暂停');else{manualPaused.clear();blocked.clear();schedule()}});
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('pageshow',schedule);document.addEventListener('visibilitychange',schedule);document.addEventListener('fullscreenchange',schedule);
new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
schedule();
})();
