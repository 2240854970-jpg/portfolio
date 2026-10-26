"""One-time import of the accepted visual portfolio. Never modifies its source."""
from pathlib import Path
import shutil,re,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT.parent/'lilong-portfolio-five-layouts-20261026'
validation=json.loads((SOURCE/'artifacts/visual-validation.json').read_text(encoding='utf-8'))
assert validation['all_media_preserved'] and not validation['page_errors']
lock=json.loads((SOURCE/'source/content-lock.json').read_text(encoding='utf-8'))
for name,digest in lock['hashes'].items():
 assert hashlib.sha256((SOURCE/name).read_bytes()).hexdigest()==digest,name
 if name.startswith('assets/'):
  target=ROOT/'public-site'/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(SOURCE/name,target)
code=ROOT/'src/visual';code.mkdir(parents=True,exist_ok=True)
for name in ['visual-led.css','visual-led.js','visual-zoom.js','content-refined.js','aplus-refined.js','video-data.js','inline-video-refined.js']:
 shutil.copy2(SOURCE/name,code/name)
html=(SOURCE/'visual-led.html').read_text(encoding='utf-8')
html=re.sub(r'<script defer src="[^"]+"></script>','',html)
html=html.replace('<link rel="stylesheet" href="visual-led.css">','<link rel="stylesheet" href="/src/visual/visual-led.css"><script type="module" src="/src/visual/main.js"></script>')
html=html.replace('<meta name="theme-color" content="#ffffff">','<meta name="theme-color" content="#ffffff"><link rel="canonical" href="https://chaojifeishu.xyz/"><meta property="og:title" content="李龙 — 视觉全案与 AI 工作流"><meta property="og:type" content="website"><meta property="og:url" content="https://chaojifeishu.xyz/"><meta property="og:image" content="https://chaojifeishu.xyz/assets/visual/gy411-01.webp">')
(ROOT/'index.html').write_text(html,encoding='utf-8')
(ROOT/'public-site/.nojekyll').write_text('',encoding='utf-8')
(ROOT/'public-site/CNAME').write_text('chaojifeishu.xyz\n',encoding='utf-8')
print('Imported validated visual edition; original project and original media unchanged.')
