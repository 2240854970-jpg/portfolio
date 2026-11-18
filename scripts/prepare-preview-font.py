"""Self-host a minimal OFL font for the portfolio's actual text; keep the source out of public assets."""
from pathlib import Path
import urllib.request,hashlib,json
from fontTools import subset
ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'artifacts/font-source';CACHE.mkdir(parents=True,exist_ok=True)
DEST=ROOT/'public-site/assets/fonts';DEST.mkdir(parents=True,exist_ok=True)
font=CACHE/'NotoSansSC.ttf'
base='https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/'
if not font.exists():font.write_bytes(urllib.request.urlopen(base+'NotoSansSC%5Bwght%5D.ttf',timeout=60).read())
license_file=DEST/'OFL-NotoSansSC.txt'
if not license_file.exists():license_file.write_bytes(urllib.request.urlopen(base+'OFL.txt',timeout=30).read())
text=(ROOT/'index.html').read_text(encoding='utf-8')
for file in (ROOT/'src/visual').glob('*.js'):text+=file.read_text(encoding='utf-8')
text+=''.join(chr(i) for i in range(32,127))+'视觉全案工作流作品浏览图片案例加载失败重新尝试菜单关闭放大缩小适应窗口原尺寸返回首页'
options=subset.Options();options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
f=subset.load_font(str(font),options);s=subset.Subsetter(options=options);s.populate(text=text);s.subset(f)
output=DEST/'portfolio-noto-sans-sc.ttf';subset.save_font(f,str(output),options)
print(json.dumps({'localFont':str(output),'bytes':output.stat().st_size,'source':'Google Fonts / Noto Sans SC','license':'SIL Open Font License 1.1','characters':len(set(text))},ensure_ascii=False))
