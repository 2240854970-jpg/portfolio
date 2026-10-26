from playwright.sync_api import sync_playwright
from pathlib import Path
import sys,time,json
URL=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4201/'
errors=[];http_errors=[];results={'url':URL,'published':not URL.startswith('http://127.0.0.1')}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:http_errors.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
 page.goto(URL,wait_until='networkidle');cdp=page.context.new_cdp_session(page)
 def raw(js):return cdp.send('Runtime.evaluate',{'expression':js,'returnByValue':True,'userGesture':False})['result'].get('value')
 assert raw('navigator.userActivation.hasBeenActive') is False
 movies=[]
 for i in range(5):
  raw(f"document.querySelectorAll('.scroll-video')[{i}].scrollIntoView({{block:'center',behavior:'instant'}})")
  end=time.time()+25
  while time.time()<end:
   s=raw(f"(()=>{{const v=document.querySelectorAll('.scroll-video')[{i}];return {{paused:v.paused,time:v.currentTime,muted:v.muted,activation:navigator.userActivation.hasBeenActive,playing:[...document.querySelectorAll('.scroll-video')].filter(x=>!x.paused).length}}}})()")
   if not s['paused'] and s['time']>.2:break
   time.sleep(.15)
  assert not s['paused'] and not s['activation'] and s['muted'] and s['playing']==1,(i,s)
  movies.append(i+1)
 raw("scrollTo({top:0,behavior:'instant'})")
 page.wait_for_function("[...document.querySelectorAll('.scroll-video')].every(v=>v.paused)")
 assert page.locator('.collection-card').count()==3 and page.locator('.aplus-item').count()==3 and page.locator('.practice-item').count()==8
 assert page.evaluate('window.PORTFOLIO.projects.reduce((n,p)=>n+p.images.length,0)')==23
 page.locator('[data-work="gy411"]').click();page.wait_for_selector('#collection-dialog[open]');assert page.locator('[data-photo]').count()==8
 page.locator('[data-photo="5"]').click();page.wait_for_function("document.querySelector('#active-product-image').src.endsWith('gy411-06.webp')")
 assert '尺寸' in page.locator('#active-image-caption').inner_text()
 page.locator('#collection-close').click();page.locator('.aplus-preview').nth(1).click();page.wait_for_function("!document.querySelector('#zoom-native').disabled")
 assert page.locator('#lightbox-image').evaluate('(i)=>i.naturalHeight')==5400
 page.keyboard.press('Escape')
 for ident in ['aplus','scene','keyshot','collector','attributes','report']:
  page.locator('#tab-'+ident).click();page.wait_for_function(f"document.querySelector('#tool-image').src.endsWith('{ident}.webp')&&document.querySelector('#tool-panel').getAttribute('aria-busy')==='false'")
  assert '我的工作' in page.locator('#tool-result').inner_text()
  if ident=='attributes':assert 'demo' in page.locator('#tool-proof').inner_text()
 widths=[]
 for width in [360,390,768,1024,1440,1920]:
  page.set_viewport_size({'width':width,'height':900});page.evaluate("scrollTo({top:0,behavior:'instant'})")
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  assert page.evaluate("getComputedStyle(document.body).backgroundColor")=='rgb(255, 255, 255)'
  widths.append(width)
 assert not errors and not http_errors,(errors,http_errors)
 results.update({'cold_autoplay_videos':movies,'gallery_and_aplus':True,'all_six_tools':True,'responsive_widths':widths,'console_errors':errors,'http_errors':http_errors})
 b.close()
out=Path(__file__).resolve().parents[1]/'artifacts';out.mkdir(exist_ok=True)
(out/'release-validation.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False,indent=2))
