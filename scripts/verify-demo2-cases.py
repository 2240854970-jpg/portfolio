from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'artifacts/demo2-cases-20261027';OUT.mkdir(parents=True,exist_ok=True)
EXPECTED=[('aplus','A+ 自动化',['aplus-1.webp','aplus-2.webp','aplus-3.webp']),('scene','场景图出图工作台',['scene-1.webp','scene-2.webp','scene-3.webp']),('keyshot','自动化渲染工作台',['keyshot-1.webp','keyshot-2.webp']),('department','部门工作台',['department-1.webp','department-2.webp']),('product','产品流程工作台',['product-1.webp','product-2.webp']),('minimax','MiniMax H3 本地部署',['minimax-1.webp'])]
manifest=json.loads((OUT/'image-manifest.json').read_text(encoding='utf-8'));assert len(manifest)==13
for m in manifest:assert hashlib.sha256(Path(m['source']).read_bytes()).hexdigest()==m['source_sha256']
KEYWORDS={'aplus':['网页自动化','全自动','同步上线','完整度','500'],'scene':['模板','自动渲染','2 分钟','10 张','直接上线'],'keyshot':['多角度','多模板','重复','加载'],'department':['企业内部','飞书','权限','资料沉淀'],'product':['产品部','3V','机会方向','机会报告','产品规格书'],'minimax':['开源','本地部署','大幅降低','成本']}
errors=[];loaded=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:4201/',wait_until='networkidle')
 assert page.locator('[data-tool]').count()==6
 assert page.evaluate('PORTFOLIO.tools.map(t=>t.title)')==[x[1] for x in EXPECTED]
 assert page.locator('#tab-collector,#tab-attributes,#tab-report').count()==0
 assert page.locator('.practice-item').count()==8
 for ident,title,files in EXPECTED:
  page.locator('#tab-'+ident).click();page.wait_for_function('(file)=>document.querySelector("#tool-image").src.endsWith(file)&&document.querySelector("#tool-panel").getAttribute("aria-busy")==="false"',arg=files[0])
  assert page.locator('#tool-panel img').count()==len(files)
  assert page.locator('#tool-panel img').evaluate_all('(imgs)=>imgs.map(i=>i.getAttribute("src").split("/").pop())')==files
  assert all(img.is_visible() for img in page.locator('#tool-panel img').all())
  page.evaluate("document.querySelectorAll('#tool-panel img').forEach(i=>i.loading='eager')")
  page.wait_for_function("[...document.querySelectorAll('#tool-panel img')].every(i=>i.complete&&i.naturalWidth>0)")
  case_text=page.locator('#tool-panel').inner_text()
  assert '我的工作' not in case_text
  for keyword in KEYWORDS[ident]:assert keyword in case_text,(ident,keyword)
  assert page.locator('#tool-focus,.focus-shot').count()==0
  assert page.locator('#tool-problem').is_visible() and page.locator('#tool-result').is_visible()
  assert page.locator('#tool-problem').evaluate('(e)=>getComputedStyle(e).fontSize')=='20px'
  page.evaluate("document.querySelector('.store-header').style.visibility='hidden'");page.locator('#tool-panel').screenshot(path=str(OUT/f'case-{ident}.png'),animations='disabled');page.evaluate("document.querySelector('.store-header').style.visibility=''")
  page.locator('#tool-overview').click()
  for i,file in enumerate(files):
   if i:page.locator('#image-next').click()
   page.wait_for_function('(file)=>document.querySelector("#lightbox-image").src.endsWith(file)&&!document.querySelector("#zoom-native").disabled',arg=file)
   assert 'demo2-20261027/' in page.locator('#lightbox-image').get_attribute('src')
   loaded.append(file)
  assert page.locator('#image-next').is_disabled()==(len(files)==1)
  page.keyboard.press('Escape')
 page.locator('#tab-aplus').click();page.wait_for_function("document.querySelector('#tool-image').src.endsWith('aplus-1.webp')")
 page.evaluate("scrollTo({top:document.querySelector('#systems').offsetTop+20,behavior:'instant'})");page.wait_for_timeout(120);page.screenshot(path=str(OUT/'numbered-inline-desktop.png'),animations='disabled')
 for width in [360,390,768,1024,1440,1920]:
  page.set_viewport_size({'width':width,'height':1000});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  if width==390:
   assert page.locator('#tool-problem').evaluate('(e)=>getComputedStyle(e).fontSize')=='18px'
   page.evaluate("document.querySelector('.store-header').style.visibility='hidden'");page.locator('#tool-panel').screenshot(path=str(OUT/'mobile-case.png'),animations='disabled');page.evaluate("document.querySelector('.store-header').style.visibility=''")
 assert len(loaded)==13 and len(set(loaded))==13
 assert not errors,errors;b.close()
canvas=Image.new('RGB',(1640,1560),'white')
for i,(ident,_,_) in enumerate(EXPECTED):
 im=Image.open(OUT/f'case-{ident}.png');im.thumbnail((790,490));canvas.paste(im,((i%2)*820+15,(i//2)*520+15))
canvas.save(OUT/'numbered-inline-overview.jpg',quality=94)
result={'cases':6,'provided_images_used':13,'all_images_inline_in_filename_order':True,'all_gallery_images_verified':True,'no_personal_work_block':True,'no_step_tutorial':True,'originals_unchanged':True,'page_errors':errors}
(OUT/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False,indent=2))
