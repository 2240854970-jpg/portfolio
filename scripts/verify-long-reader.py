from pathlib import Path
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'artifacts/aplus-reader-20261118';OUT.mkdir(parents=True,exist_ok=True)
errors=[];results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);page=b.new_page(reduced_motion='reduce');page.on('pageerror',lambda e:errors.append(str(e)))
 for width,height in [(1440,900),(390,844),(320,640)]:
  page.set_viewport_size({'width':width,'height':height});page.goto('http://127.0.0.1:4218/',wait_until='networkidle');page.locator('.aplus-preview').first.click();page.wait_for_function('!document.querySelector("#zoom-native").disabled');page.wait_for_timeout(100)
  assert page.locator('#lightbox').evaluate('(d)=>d.classList.contains("long-read")')
  vp=page.locator('#lightbox-viewport').bounding_box();tb=page.locator('.lightbox-toolbar').bounding_box();img=page.locator('#lightbox-image').bounding_box()
  assert tb['height']<=64,(width,tb)
  assert vp['height']/height>=.9,(width,vp)
  assert abs(vp['y']+vp['height']-height)<2,(width,vp)
  assert not page.locator('#lightbox-caption').is_visible()
  assert abs(img['width']-min(vp['width'],1464))<2,(width,img,vp)
  page.locator('#lightbox-viewport').evaluate('(v)=>v.scrollTop=900')
  before=page.locator('#lightbox-viewport').evaluate('(v)=>v.scrollTop')
  if width<761:
   assert page.locator('#reader-more').is_visible() and not page.locator('#zoom-native').is_visible()
   page.locator('#reader-more').click();assert page.locator('#zoom-native').is_visible();assert page.locator('#open-original').is_visible()
   after=page.locator('#lightbox-viewport').evaluate('(v)=>v.scrollTop');assert abs(after-before)<2,(before,after)
  page.locator('#zoom-native').click();assert abs(page.locator('#lightbox-image').bounding_box()['width']-1464)<2
  page.locator('#zoom-fit').click();assert page.locator('#zoom-fit').inner_text()=='按宽阅读'
  assert abs(page.locator('#lightbox-image').bounding_box()['width']-min(vp['width'],1464))<2
  if width<761:page.locator('#reader-more').click()
  assert page.locator('#image-next').is_visible();page.locator('#image-next').click();page.wait_for_function('document.querySelector("#lightbox-image").src.endsWith("bedside-original.jpg")&&!document.querySelector("#zoom-native").disabled')
  assert page.locator('#reader-more').get_attribute('aria-expanded')=='false'
  page.locator('#image-next').click();page.wait_for_function('document.querySelector("#lightbox-image").src.endsWith("cylinder-20261118-original.jpg")&&!document.querySelector("#zoom-native").disabled')
  page.locator('#image-prev').click();page.wait_for_function('document.querySelector("#lightbox-image").src.endsWith("bedside-original.jpg")&&!document.querySelector("#zoom-native").disabled')
  page.locator('#image-prev').click();page.wait_for_function('document.querySelector("#lightbox-image").src.endsWith("gold-20261118-original.jpg")&&!document.querySelector("#zoom-native").disabled')
  page.screenshot(path=str(OUT/f'after-{width}.png'))
  page.keyboard.press('Escape');assert not page.locator('body').evaluate('(e)=>e.classList.contains("modal-open")')
  results.append({'width':width,'height':height,'toolbarHeight':tb['height'],'usableHeightPercent':round(vp['height']/height*100,1),'readWidth':vp['width'],'controlsAndNavigation':True})
 # The compact A+ mode must not leak into product and tool image readers.
 page.set_viewport_size({'width':1440,'height':900});page.locator('[data-work="gy411"]').click();page.wait_for_selector('#collection-dialog[open]');page.locator('#active-image-zoom').click();page.wait_for_function('!document.querySelector("#zoom-native").disabled')
 assert not page.locator('#lightbox').evaluate('(d)=>d.classList.contains("long-read")')
 assert page.locator('#lightbox-caption').is_visible() and page.locator('#zoom-fit').inner_text()=='适应窗口'
 page.locator('#zoom-native').click();assert abs(page.locator('#lightbox-image').bounding_box()['width']-1600)<2
 page.keyboard.press('Escape');assert page.locator('#collection-dialog').evaluate('(d)=>d.open');page.keyboard.press('Escape')
 assert not errors,errors;b.close()
(OUT/'after.json').write_text(json.dumps({'results':results,'standardViewerUnchanged':True,'page_errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False,indent=2))
