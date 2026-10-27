from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
import subprocess,json,hashlib
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'artifacts/media-update-20261027';OUT.mkdir(parents=True,exist_ok=True)
EXPECTED=['film-03','film-01','film-02','film-04','film-05']
FILES=['film-03-cut-27s.mp4','film-01.mp4','film-02.mp4','film-04.mp4','film-05.mp4']
errors=[];result={}
# Movie and poster bytes must remain identical to the deployed commit.
for f in (ROOT/'public-site/assets/video-inline').iterdir():
 if f.name=='film-03-cut-27s.mp4':continue # approved derivative; original must remain unchanged
 relative=f.relative_to(ROOT).as_posix()
 expected=subprocess.check_output(['git','rev-parse','HEAD:'+relative],cwd=ROOT,text=True).strip()
 actual=subprocess.check_output(['git','hash-object',str(f)],cwd=ROOT,text=True).strip()
 assert actual==expected,relative
original=ROOT/'public-site/assets/aplus/gold-20261027-original.jpg'
with Image.open(original) as im:assert im.format=='JPEG' and im.size==(1464,4800)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:4201/',wait_until='networkidle')
 assert page.evaluate('PORTFOLIO.videos.map(v=>v.id)')==EXPECTED
 assert page.locator('.scroll-video').count()==5
 assert page.locator('.scroll-video').evaluate_all('(vs)=>vs.map(v=>v.dataset.src.split("/").pop())')==FILES
 assert page.locator('.scroll-video').evaluate_all('(vs)=>vs.map(v=>v.getAttribute("poster").split("/").pop())')==[ident+'-poster.webp' for ident in EXPECTED]
 titles=page.locator('.inline-film-heading h3').all_text_contents();assert titles[0]=='纯 AI 制作 · 分镜设计';assert titles[1].startswith('Sora 自动化视频');assert titles[2].startswith('Sora 自动化视频');assert '场地外拍' in titles[3];assert '联动零图' in titles[4]
 assert page.locator('.aplus-item').first.locator('.aplus-inline').count()==1
 assert not page.locator('.aplus-item').first.locator('.aplus-inline').evaluate('(d)=>d.open')
 first=page.locator('.aplus-preview img').first;first.scroll_into_view_if_needed();page.wait_for_function("document.querySelector('.aplus-preview img').complete")
 for width in [390,768,1440]:
  page.set_viewport_size({'width':width,'height':1000})
  ratio=first.evaluate('(i)=>({w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height,nw:i.naturalWidth,nh:i.naturalHeight,frame:i.parentElement.getBoundingClientRect().height})')
  assert ratio['nw']==1200 and ratio['nh']==984,ratio
  assert abs(ratio['w']/ratio['h']-1200/984)<.001 and abs(ratio['frame']-ratio['h'])<1,ratio
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
 page.set_viewport_size({'width':1440,'height':1000});page.evaluate("document.querySelectorAll('#aplus img').forEach(i=>i.loading='eager')");page.wait_for_function("[...document.querySelectorAll('#aplus img')].every(i=>i.complete&&i.naturalWidth)")
 # Hide global sticky chrome only for this section-only export, then restore it.
 page.evaluate("document.querySelector('.store-header').style.visibility='hidden'")
 page.locator('#aplus').screenshot(path=str(OUT/'aplus-cover-preview.png'),animations='disabled')
 page.evaluate("document.querySelector('.store-header').style.visibility=''")
 first.click();page.wait_for_function("!document.querySelector('#zoom-native').disabled")
 assert page.locator('#lightbox-image').evaluate('(i)=>[i.naturalWidth,i.naturalHeight]')==[1464,4800]
 assert page.locator('#open-original').get_attribute('href').endswith('gold-20261027-original.jpg')
 page.keyboard.press('Escape')
 for i in range(5):
  page.locator('.inline-film').nth(i).scroll_into_view_if_needed()
  page.wait_for_function(f"document.querySelectorAll('.scroll-video')[{i}].currentTime>2",timeout=15000)
  assert page.locator('.scroll-video').nth(i).evaluate('(v)=>v.currentSrc').endswith(FILES[i])
  duration=page.locator('.scroll-video').nth(i).evaluate('(v)=>v.duration')
  assert abs(duration-[27.0,17.07,17.25,36.73,18.97][i])<.15,(i,duration)
  page.evaluate("document.querySelector('.store-header').style.visibility='hidden'")
  page.locator('.inline-film').nth(i).screenshot(path=str(OUT/f'video-{i+1}.png'),animations='disabled')
  page.evaluate("document.querySelector('.store-header').style.visibility=''")
 page.set_viewport_size({'width':390,'height':844});page.locator('.inline-film').first.scroll_into_view_if_needed();page.wait_for_function("document.querySelector('.scroll-video').readyState>=2");page.locator('.inline-film').first.screenshot(path=str(OUT/'mobile-first-video.png'),animations='disabled')
 assert not errors,errors
 result={'order':EXPECTED,'titles':titles,'default_aplus_cover':[1200,984],'full_aplus':[1464,4800],'full_aplus_collapsed_by_default':True,'runtime_video_src_poster_and_durations_match':True,'no_artificial_image_padding':True,'original_videos_and_posters_unchanged':True,'first_video_trimmed_to_seconds':27,'page_errors':errors}
 # Inspect actual first-video frames, not merely its title or poster.
 video=page.locator('.scroll-video').first
 frames=[]
 for seconds in [1,5,9,13,17,21,25]:
  video.evaluate('(v,t)=>{v.pause();v.currentTime=t}',seconds)
  page.wait_for_function('!document.querySelector(".scroll-video").seeking&&document.querySelector(".scroll-video").readyState>=2')
  page.wait_for_timeout(100)
  target=OUT/f'first-actual-frame-{seconds}.png';video.screenshot(path=str(target));frames.append((seconds,target))
 sheet=Image.new('RGB',(780,4*250),'white');draw=ImageDraw.Draw(sheet)
 for i,(seconds,path) in enumerate(frames):
  im=Image.open(path);im.thumbnail((380,215));x=(i%2)*390;y=(i//2)*250;sheet.paste(im,(x,y));draw.text((x+8,y+220),f'film-03-cut-27s.mp4 / {seconds}s',fill='black')
 sheet.save(OUT/'first-video-actual-frames.jpg',quality=92)
 b.close()
# A compact reference sheet makes sequence and titles easy to confirm without playing all clips.
canvas=Image.new('RGB',(820,5*540),'white')
for i in range(5):
 im=Image.open(OUT/f'video-{i+1}.png');im.thumbnail((790,530));canvas.paste(im,((820-im.width)//2,i*540))
canvas.save(OUT/'video-order-corrected.jpg',quality=92)
(OUT/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
