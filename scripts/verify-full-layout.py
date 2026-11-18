"""Structural regression for the full-layout redesign (no aesthetic scores).
Run manually: python scripts/verify-full-layout.py [http://127.0.0.1:4218/]
Requires the existing Playwright installation. No installs or source mutations.
Writes screenshots and measured JSON to artifacts/full-layout/ only when run.
Complement, not replacement, for verify-design-preview.py: gallery/lightbox,
menus, white background, global overflow and cold playback remain in that suite.
"""
import argparse
import json
import time
import traceback
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts' / 'full-layout'
# Include exact breakpoint probes in addition to all requested viewport widths.
WIDTHS = [390, 768, 900, 1024, 1280, 1440, 1920]
FILMS = ['film-03', 'film-01', 'film-02', 'film-04', 'film-05']

# Coordinates are document-relative, so scroll/lazy-load checks are comparable.
MEASURE = """e => {
 const r=e.getBoundingClientRect(), s=getComputedStyle(e);
 let shown=r.width>0 && r.height>0 && e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true});
 for(let p=e;p;p=p.parentElement){const c=getComputedStyle(p);
   if(c.display==='none'||c.visibility==='hidden'||Number(c.opacity)===0)shown=false;}
 return {x:r.x+scrollX,y:r.y+scrollY,right:r.right+scrollX,
 bottom:r.bottom+scrollY,width:r.width,height:r.height,shown,
 display:s.display,columns:s.gridTemplateColumns,src:e.currentSrc||null};
}"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url', nargs='?', default='http://127.0.0.1:4218/')
    parser.add_argument('--timeout', type=float, default=30)
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    report = {'url': args.url, 'checks': [], 'screenshots': [], 'page_errors': [],
              'widths': WIDTHS, 'scope': 'new DOM and geometry only; no aesthetic scoring'}

    def require(ok, label, evidence=None):
        if not ok:
            raise AssertionError(label + '; evidence=' + json.dumps(evidence, ensure_ascii=False))

    def check(name, fn):
        start = time.monotonic()
        try:
            detail = fn()
            report['checks'].append({'name': name, 'status': 'passed', 'detail': detail,
                                     'seconds': round(time.monotonic()-start, 2)})
            print('PASS ' + name, flush=True)
        except Exception as exc:
            report['checks'].append({'name': name, 'status': 'failed', 'error': str(exc),
                                     'traceback': traceback.format_exc()})
            print('FAIL ' + name + ': ' + str(exc), flush=True)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1440, 'height': 1000},
                                          reduced_motion='reduce', device_scale_factor=1)
            page = context.new_page()
            page.set_default_timeout(args.timeout * 1000)
            page.on('pageerror', lambda exc: report['page_errors'].append(str(exc)))
            page.goto(args.url, wait_until='domcontentloaded')
            page.wait_for_function("!!window.PORTFOLIO && document.querySelectorAll('.inline-film').length===5")
            page.evaluate('document.fonts.ready')

            def one(selector):
                loc = page.locator(selector)
                require(loc.count() == 1, 'Exactly one ' + selector, loc.count())
                return loc

            def box(loc):
                require(loc.count() == 1, 'Unique measured element', loc.count())
                result = loc.evaluate(MEASURE)
                require(result['shown'], 'Measured element rendered', result)
                return result

            def side(a, b, label, ordered=False):
                # Real non-overlapping horizontal boxes with vertical overlap.
                overlap = min(a['bottom'], b['bottom']) - max(a['y'], b['y'])
                separate = a['right'] <= b['x']+2 if ordered else (
                    a['right'] <= b['x']+2 or b['right'] <= a['x']+2)
                require(separate and overlap > 2, label + ' two columns', {'a': a, 'b': b})

            def stack(a, b, label):
                overlap = min(a['right'], b['right']) - max(a['x'], b['x'])
                require(a['bottom'] <= b['y']+2 and overlap > min(a['width'], b['width'])*.5,
                        label + ' single column in DOM order', {'a': a, 'b': b})

            def image(loc):
                loc.scroll_into_view_if_needed()
                loc.evaluate("e=>{e.loading='eager';return new Promise((resolve,reject)=>{if(e.complete){e.naturalWidth?resolve():reject(Error('broken image '+e.src));return;}const timer=setTimeout(()=>reject(Error('image load timed out '+e.src)),10000);e.addEventListener('load',()=>{clearTimeout(timer);resolve()},{once:true});e.addEventListener('error',()=>{clearTimeout(timer);reject(Error('image load failed '+e.src))},{once:true});})}")
                m = box(loc)
                native = loc.evaluate("e=>{const s=getComputedStyle(e);return {nw:e.naturalWidth,nh:e.naturalHeight,fit:s.objectFit,padding:[s.paddingLeft,s.paddingRight,s.paddingTop,s.paddingBottom].map(parseFloat),border:[s.borderLeftWidth,s.borderRightWidth,s.borderTopWidth,s.borderBottomWidth].map(parseFloat)}}")
                pad, border = native['padding'], native['border']
                w = m['width']-pad[0]-pad[1]-border[0]-border[1]
                h = m['height']-pad[2]-pad[3]-border[2]-border[3]
                error = abs((w/h)/(native['nw']/native['nh'])-1) if h > 0 and native['nh'] > 0 else 999
                require(error < .015, 'Image content box follows natural ratio', {**m, **native, 'ratio_error': error})
                # Detect ancestor cropping, not just object-fit distortion.
                clipping = loc.evaluate("""e=>{const r=e.getBoundingClientRect(),bad=[];
                  for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){
                    const s=getComputedStyle(p),b=p.getBoundingClientRect();
                    if(['hidden','clip'].includes(s.overflowY)&&(r.top<b.top-2||r.bottom>b.bottom+2))bad.push(p.className||p.id);
                    if(['hidden','clip'].includes(s.overflowX)&&(r.left<b.left-2||r.right>b.right+2))bad.push(p.className||p.id);
                  }return bad;}""")
                require(not clipping, 'Natural image not cropped by ancestor', clipping)
                return {**m, **native, 'ratio_error': error}

            data = page.evaluate('JSON.parse(JSON.stringify(window.PORTFOLIO))')

            def structure():
                feature = one('#hero-feature')
                rail = one('#collection-rail')
                require(feature.locator('.collection-card').count() == 1, 'One hero collection')
                require(feature.locator('[data-work="gy411"]').count() == 1, 'Hero stable gy411 entry')
                require(rail.locator('.collection-card').count() == 2, 'Two remaining rail cards')
                ids = page.locator('.collection-card').evaluate_all("es=>es.map(e=>(e.matches('[data-work]')?e:e.querySelector('[data-work]'))?.dataset.work)")
                require(len(ids) == 3 and len(set(ids)) == 3 and set(ids) == {x['id'] for x in data['projects']},
                        'Restructure neither duplicates nor loses collection entries', ids)
                require(sum(len(x['images']) for x in data['projects']) == 23, 'Original 23 photos retained')
                items = page.locator('.aplus-item')
                require(items.count() == 3 and page.locator('.aplus-item.featured-aplus').count() == 1,
                        'Three A+ items, exactly one featured')
                require('featured-aplus' in (items.first.get_attribute('class') or '').split(), 'First A+ is featured')
                for item in items.all():
                    text = item.locator('.aplus-text')
                    require(text.count() == 1 and text.inner_text().strip(), 'A+ text wrapper populated')
                    require(text.locator('h3').count() > 0, 'A+ title inside text wrapper')
                summary = one('#case-summary')
                require(not summary.evaluate("e=>!!e.closest('.tool-case-layout')"), 'Case summary outside image/problem layout')
                require(not summary.evaluate("e=>!!e.querySelector('#tool-title')"), 'Summary distinct from case title')
                require(page.locator('[data-tool]').count() == 6, 'Six case entry hooks retained')
                order = page.locator('.inline-film video').evaluate_all('es=>es.map(e=>e.dataset.inlineVideo)')
                require(order == FILMS, 'Stable film IDs/order (hyphens required)', order)
                require(data['videos'][0]['id'] == 'film-03' and abs(float(data['videos'][0]['duration'])-27) <= .6,
                        'First film metadata remains 27s', data['videos'][0])
                return {'collections': ids, 'films': order, 'first_duration': data['videos'][0]['duration']}
            check('new_structure_integrity', structure)

            def layout(width):
                print('CHECK layout_' + str(width), flush=True)
                page.set_viewport_size({'width': width, 'height': 800 if width == 1280 else 1000})
                page.evaluate('scrollTo({top:0,behavior:"instant"})')
                page.wait_for_timeout(200)
                desktop = width >= 1024
                stage = one('.hero-stage, #hero-stage')
                title = one('h1')
                feature = one('#hero-feature')
                first = feature.locator('img:not(.alternate)').first
                first_image = image(first)
                h, f, s = box(title), box(feature), box(stage)
                if desktop:
                    side(h, f, 'Hero title/feature')
                    require(first_image['width'] >= s['width']*.5-2,
                            'First hero image >=50% of stage width', {'image': first_image, 'stage': s})
                else:
                    # Either editorial ordering is acceptable, but not a small-screen side rail.
                    a, b = sorted([h, f], key=lambda r: r['y'])
                    stack(a, b, 'Hero')
                if width == 1280:
                    page.evaluate('scrollTo({top:0,behavior:"instant"})')
                    visible = page.locator('h1, a[href="#systems"]').evaluate_all("""es=>es.map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,ok:e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&r.width>0&&r.height>0&&r.top>=0&&r.left>=0&&r.bottom<=innerHeight&&r.right<=innerWidth}})""")
                    # Require the main hero entry, not a substitute link in the site header.
                    entries = stage.locator('a[href="#systems"]')
                    require(entries.count() > 0, 'Hero contains main systems entry')
                    require(any(x['tag']=='H1' and x['ok'] for x in visible), '1280x800 title visible', visible)
                    require(entries.evaluate_all("es=>es.some(e=>{const r=e.getBoundingClientRect();return e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&r.width>0&&r.height>0&&r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth})"), '1280x800 hero main entry visible')
                items = page.locator('.aplus-item')
                ab = [box(e) for e in items.all()]
                preview = box(items.first.locator('.aplus-preview'))
                text = box(items.first.locator('.aplus-text'))
                if desktop:
                    side(preview, text, 'Featured A+ image/text')
                    side(ab[1], ab[2], 'Secondary A+ row', ordered=True)
                    require(ab[0]['bottom'] <= min(ab[1]['y'], ab[2]['y'])+2, 'Secondary A+ below featured', ab)
                    require(abs(ab[0]['x']-ab[1]['x']) <= 3 and abs(ab[0]['right']-ab[2]['right']) <= 3,
                            'Featured A+ spans both lower columns', ab)
                else:
                    stack(preview, text, 'Featured A+')
                    stack(ab[0], ab[1], 'A+ first/second')
                    stack(ab[1], ab[2], 'A+ second/third')
                videos = []
                for film in page.locator('.inline-film').all():
                    heading, video = box(film.locator('.inline-film-heading')), box(film.locator('video'))
                    require(video['width'] <= 900.5, 'Video remains <=900px', video)
                    if desktop:
                        side(heading, video, 'Film title-left/video-right', ordered=True)
                    else:
                        stack(heading, video, 'Film')
                    videos.append({'heading': heading, 'video': video})
                # Layout of image versus problem is deliberately not prescribed here.
                # All six cases must keep summary/title outside the image/problem area.
                cases = []
                for tool in data['tools']:
                    page.locator('#tab-'+tool['id']).click()
                    page.wait_for_function("id=>document.querySelector('#tab-'+id)?.getAttribute('aria-selected')==='true' && document.querySelector('#tool-panel')?.getAttribute('aria-busy')==='false'", arg=tool['id'])
                    summary = one('#case-summary')
                    require(not summary.evaluate("e=>!!e.closest('.tool-case-layout')"), 'Case summary stays outside layout', tool['id'])
                    sb, tb = box(summary), box(one('#tool-title'))
                    require(summary.inner_text().strip(), 'Case summary populated', tool['id'])
                    if desktop:
                        side(tb, sb, 'Case title/summary')
                    else:
                        a, b = sorted([tb, sb], key=lambda r: r['y'])
                        stack(a, b, 'Case title/summary')
                    cases.append({'id': tool['id'], 'title': tb, 'summary': sb})
                page.locator('#tab-'+data['tools'][0]['id']).click()
                page.wait_for_function("document.querySelector('#tool-panel').getAttribute('aria-busy')==='false'")
                # Only new presentation surfaces. Full 13-image interaction/order checks
                # belong to verify-design-preview.py; no duplicate modal/video tests.
                images = []
                for loc in page.locator('#hero-feature img, #collection-rail img, .aplus-item img, #tool-panel img').all():
                    if loc.evaluate(MEASURE)['shown']:
                        images.append(image(loc))
                return {'width': width, 'hero': {'title': h, 'feature': f, 'stage': s},
                        'aplus': ab, 'videos': videos, 'cases': cases, 'images': images}

            for width in WIDTHS:
                check('layout_' + str(width), lambda width=width: layout(width))

            def screenshots():
                files = []
                for name, width, selector in [
                    ('hero1440', 1440, None), ('cases1440', 1440, '#systems'),
                    ('aplus1440', 1440, '#aplus'), ('video1440', 1440, '#motion'),
                    ('mobile390', 390, None)]:
                    page.set_viewport_size({'width': width, 'height': 844 if width == 390 else 1000})
                    if selector:
                        one(selector).evaluate('e=>e.scrollIntoView({block:"start",behavior:"instant"})')
                    else:
                        page.evaluate('scrollTo({top:0,behavior:"instant"})')
                    page.wait_for_timeout(250)
                    path = OUT / (name+'.png')
                    page.screenshot(path=str(path), full_page=False)
                    report['screenshots'].append(str(path.relative_to(ROOT)))
                    files.append(name+'.png')
                return files
            check('render_evidence', screenshots)

            def no_js():
                evidence = []
                for width in [390, 1280, 1440]:
                    ctx = browser.new_context(java_script_enabled=False,
                        viewport={'width': width, 'height': 800}, device_scale_factor=1)
                    try:
                        pg = ctx.new_page()
                        pg.set_default_timeout(args.timeout*1000)
                        pg.goto(args.url, wait_until='load')
                        # evaluate only inspects DOM; page scripts remain disabled.
                        imgs = pg.locator('#hero-feature img')
                        found = []
                        for img in imgs.all():
                            state = img.evaluate("""e=>{const r=e.getBoundingClientRect();return {src:e.currentSrc,loaded:e.complete&&e.naturalWidth>0,shown:e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}),width:r.width,height:r.height,intersects:r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}}""")
                            if state['loaded'] and state['shown'] and state['width']>0 and state['height']>0 and state['intersects']:
                                found.append(state)
                        require(found, 'No-JS initial hero contains a visible loaded image', {'width': width})
                        evidence.append({'width': width, 'images': found})
                    finally:
                        ctx.close()
                return evidence
            check('no_javascript_hero_fallback', no_js)
            check('no_new_runtime_errors', lambda: require(not report['page_errors'], 'Page JavaScript errors', report['page_errors']))
            context.close()
            browser.close()
    except Exception as exc:
        report['checks'].append({'name': 'setup_or_unhandled_error', 'status': 'failed',
                                 'error': str(exc), 'traceback': traceback.format_exc()})
    finally:
        report['status'] = 'failed' if not report['checks'] or any(c['status']=='failed' for c in report['checks']) else 'passed'
        (OUT/'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps({'status': report['status'], 'results': str(OUT/'results.json')}, ensure_ascii=False))
    return 0 if report['status'] == 'passed' else 1


if __name__ == '__main__':
    raise SystemExit(main())
