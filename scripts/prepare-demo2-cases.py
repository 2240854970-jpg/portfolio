"""Prepare only the owner's six approved demo groups. Originals stay untouched."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(r'D:\Users\YANXUN\Desktop\演示2')
OUT=ROOT/'public-site/assets/tools/demo2-20261027';OUT.mkdir(parents=True,exist_ok=True)
GROUPS={'aplus':'A+自动化','scene':'场景图出图工作台','keyshot':'自动化渲染工作台','department':'部门工作台','product':'产品流程工作台','minimax':'minimax h3 本地部署'}
# Additional narrow masks for internal paths/identifiers, supplementing the owner's existing redactions.
MASKS={('aplus','1.jpg'):[(270,274,801,302),(957,693,1505,739)],('department','2.jpg'):[(1485,139,1695,164)]}
records=[]
for key,group in GROUPS.items():
 for source in sorted((SOURCE/group).iterdir()):
  if source.suffix.lower() not in {'.png','.jpg','.jpeg','.webp'}:continue
  digest=hashlib.sha256(source.read_bytes()).hexdigest()
  with Image.open(source) as original:
   im=original.convert('RGB');profile=original.info.get('icc_profile',b'')
  for box in MASKS.get((key,source.name),[]):
   ImageDraw.Draw(im).rounded_rectangle(box,radius=3,fill='#e8e9e6')
  target=OUT/f'{key}-{source.stem}.webp'
  im.save(target,'WEBP',quality=94,method=6,icc_profile=profile)
  assert hashlib.sha256(source.read_bytes()).hexdigest()==digest
  records.append({'group':key,'source':str(source),'source_sha256':digest,'output':str(target.relative_to(ROOT)).replace('\\','/'),'width':im.width,'height':im.height,'redactions':MASKS.get((key,source.name),[])})
assert len(records)==13 and len({x['group'] for x in records})==6
artifacts=ROOT/'artifacts/demo2-cases-20261027';artifacts.mkdir(parents=True,exist_ok=True)
(artifacts/'image-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'groups':6,'images':len(records),'originals_unchanged':True,'output':str(OUT)},ensure_ascii=False))
