"""Targeted preview regression. No installs, source edits, or external services.
Run: python scripts/verify-design-preview.py [http://127.0.0.1:4217/]
Exit 0 = pass, 1 = regression/setup failure. Evidence: artifacts/design-preview/.
Cold playback ALWAYS precedes interaction; all JS uses CDP without user gestures.
"""
import argparse
import json
import math
import re
import time
import traceback
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts' / 'design-preview'
WIDTHS = [320, 390, 768, 1280, 1440, 1920]
FILMS = ['film-03', 'film-01', 'film-02', 'film-04', 'film-05']
TABS = ['aplus', 'scene', 'keyshot', 'department', 'product', 'minimax']


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url', nargs='?', default='http://127.0.0.1:4217/')
    parser.add_argument('--timeout', type=float, default=30, help='Polling timeout in seconds')
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    report = {'url': args.url, 'status': 'running', 'checks': [], 'screenshots': [],
              'page_errors': [], 'http_errors': [], 'request_failures': []}
    browser = None
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1440, 'height': 1000},
                                          reduced_motion='reduce', device_scale_factor=1)
            page = context.new_page()
            page.set_default_timeout(args.timeout * 1000)
            page.on('pageerror', lambda e: report['page_errors'].append(str(e)))
            page.on('response', lambda r: report['http_errors'].append(
                {'url': r.url, 'status': r.status}) if r.status >= 400 else None)
            page.on('requestfailed', lambda r: report['request_failures'].append(
                {'url': r.url, 'error': r.failure}))
            cdp = context.new_cdp_session(page)

            def raw(expression):
                result = cdp.send('Runtime.evaluate', {'expression': expression,
                    'returnByValue': True, 'userGesture': False, 'awaitPromise': True})
                if result.get('exceptionDetails'):
                    raise AssertionError(f'CDP JavaScript exception: {result["exceptionDetails"]}')
                return result.get('result', {}).get('value')

            def require(ok, message, evidence=None):
                if not ok:
                    raise AssertionError(f'{message}; evidence={json.dumps(evidence, ensure_ascii=False)}')

            def poll(expression, label, timeout=None):
                deadline = time.monotonic() + (timeout or args.timeout)
                value = None
                while time.monotonic() < deadline:
                    value = raw(expression)
                    if value:
                        return value
                    time.sleep(.12)
                raise AssertionError(f'Timeout: {label}; last={value}; expression={expression}')

            def check(name, fn):
                start = time.monotonic()
                try:
                    detail = fn()
                    report['checks'].append({'name': name, 'status': 'passed', 'detail': detail,
                                             'seconds': round(time.monotonic() - start, 2)})
                    print(f'PASS {name}', flush=True)
                except Exception as exc:
                    report['checks'].append({'name': name, 'status': 'failed', 'error': str(exc),
                                             'traceback': traceback.format_exc()})
                    print(f'FAIL {name}: {exc}', flush=True)
                    # Best-effort recovery, without synthesizing input or masking this failure.
                    try:
                        raw("document.querySelectorAll('dialog[open]').forEach(d=>d.close())")
                    except Exception:
                        pass

            def snap(name):
                page.screenshot(path=str(OUT / f'{name}.png'), full_page=False)
                report['screenshots'].append(f'{name}.png')

            def scroll(selector):
                raw(f'document.querySelector({json.dumps(selector)}).scrollIntoView({{block:"center",behavior:"instant"}})')
                time.sleep(.25)

            def image_ready(selector):
                return poll(f'(()=>{{const i=document.querySelector({json.dumps(selector)});return !!i&&i.complete&&i.naturalWidth>0}})()', selector + ' decoded')

            def source_is(selector, suffix):
                poll(f'(()=>{{const i=document.querySelector({json.dumps(selector)});return !!i&&i.complete&&i.naturalWidth>0&&decodeURI(new URL(i.currentSrc||i.src).pathname).endsWith({json.dumps(suffix)})}})()', selector + ' source ' + suffix)

            def restored(before):
                poll("!document.querySelector('dialog[open]')&&!document.body.classList.contains('modal-open')&&![document.body,document.documentElement].some(e=>['hidden','clip'].includes(getComputedStyle(e).overflowY)||getComputedStyle(e).position==='fixed')", 'scroll lock released')
                after = raw('scrollY')
                require(abs(after-before) <= 4, 'Scroll position restored', {'before': before, 'after': after})
                target = raw('Math.min(scrollY+80,document.documentElement.scrollHeight-innerHeight)')
                if abs(target-after) < 10:
                    target = max(0, after-80)
                raw(f'scrollTo({{top:{target},behavior:"instant"}})')
                poll(f'Math.abs(scrollY-{target})<3', 'document can scroll after close')
                raw(f'scrollTo({{top:{before},behavior:"instant"}})')

            page.goto(args.url, wait_until='domcontentloaded')
            poll("!!window.PORTFOLIO&&document.querySelectorAll('.scroll-video').length===5", 'preview ready')

            def cold_playback():
                require(raw('navigator.userActivation.hasBeenActive') is False, 'Fresh context is unactivated')
                order = raw("[...document.querySelectorAll('.scroll-video')].map(v=>v.dataset.inlineVideo)")
                require(order == FILMS, 'Video DOM order', order)
                samples = []
                # No locator clicks, keyboard, evaluate, wait_for_function or play() before this completes.
                for ident in FILMS:
                    selector = f'[data-inline-video="{ident}"]'
                    scroll(selector)
                    expr = f'''(()=>{{const v=document.querySelector({json.dumps(selector)});return {{
                        id:v.dataset.inlineVideo, paused:v.paused,time:v.currentTime,duration:v.duration,
                        muted:v.muted,activation:navigator.userActivation.hasBeenActive,
                        playing:[...document.querySelectorAll('.scroll-video')].filter(x=>!x.paused&&!x.ended).map(x=>x.dataset.inlineVideo),
                        error:v.error?{{code:v.error.code,message:v.error.message}}:null}}}})()'''
                    deadline = time.monotonic() + args.timeout
                    previous = None
                    advances = 0
                    state = None
                    while time.monotonic() < deadline:
                        state = raw(expr)
                        require(not state['activation'], 'Cold autoplay gained user activation', state)
                        require(len(state['playing']) <= 1, 'Concurrent videos playing', state)
                        require(not state['error'], 'Video decoding failed', state)
                        if not state['paused'] and state['playing'] == [ident] and state['muted']:
                            if previous is not None and state['time'] > previous + .02:
                                advances += 1
                            previous = state['time']
                            if advances >= 3 and state['time'] > .2:
                                break
                        time.sleep(.2)
                    require(advances >= 3, 'Cold muted autoplay did not progress', state)
                    duration = state['duration']
                    require(isinstance(duration, (int, float)) and math.isfinite(duration) and duration > 0,
                            'Video duration available', state)
                    if ident == 'film-03':
                        require(abs(duration - 27) <= .6, 'First film must be 27 seconds', state)
                    samples.append(state)
                raw('scrollTo({top:0,behavior:"instant"})')
                poll("[...document.querySelectorAll('.scroll-video')].every(v=>v.paused)", 'all videos paused offscreen')
                require(raw('navigator.userActivation.hasBeenActive') is False, 'Cold test remained unactivated')
                return samples

            check('cold_autoplay_five_exclusive_order_first_27_seconds', cold_playback)
            data = raw('JSON.parse(JSON.stringify(window.PORTFOLIO))')

            def inventory():
                counts = {'projects': len(data['projects']),
                          'product_images': sum(len(x['images']) for x in data['projects']),
                          'aplus': len(data['aplusWorks']), 'videos': len(data['videos']),
                          'cases': len(data['tools']),
                          'case_images': sum(len(x['gallery']) for x in data['tools']),
                          'practices': len(data['moreTools'])}
                require(counts == dict(projects=3, product_images=23, aplus=3, videos=5,
                                       cases=6, case_images=13, practices=8), 'PORTFOLIO inventory', counts)
                for selector, count in [('.collection-card', 3), ('.aplus-item', 3),
                                        ('.practice-item', 8), ('[data-tool]', 6)]:
                    require(page.locator(selector).count() == count, 'Rendered count ' + selector)
                require([x['id'] for x in data['tools']] == TABS, 'Case data order')
                require(raw("[...document.querySelectorAll('[data-tool]')].map(e=>e.dataset.tool)") == TABS, 'Case DOM order')
                require([x['id'] for x in data['videos']] == FILMS, 'Video data order')
                return counts
            check('data_and_rendered_inventory', inventory)

            def responsive():
                evidence = []
                for width in WIDTHS:
                    page.set_viewport_size({'width': width, 'height': 800 if width == 1280 else 900})
                    raw('scrollTo({top:0,behavior:"instant"})')
                    time.sleep(.35)
                    sizes = raw('({viewport:innerWidth,body:document.body.scrollWidth,html:document.documentElement.scrollWidth,background:getComputedStyle(document.body).backgroundColor})')
                    require(sizes['body'] <= width and sizes['html'] <= width, f'No horizontal overflow at {width}', sizes)
                    require(sizes['background'] == 'rgb(255, 255, 255)', f'White page at {width}', sizes)
                    if width >= 1280:
                        video_widths = raw("[...document.querySelectorAll('.scroll-video')].map(v=>v.getBoundingClientRect().width)")
                        require(all(0 < w <= 900.5 for w in video_widths), f'Desktop video width <=900 at {width}', video_widths)
                    if width == 1280:
                        visible = raw('''(()=>{const inside=e=>{if(!e)return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&r.top>=0&&r.left>=0&&r.bottom<=innerHeight&&r.right<=innerWidth&&s.visibility!=='hidden'&&s.display!=='none'&&Number(s.opacity)>0};return {h1:inside(document.querySelector('h1')),systems:[...document.querySelectorAll('a[href="#systems"]')].some(inside)}})()''')
                        require(visible['h1'] and visible['systems'], '1280x800 hero h1 and systems entry in viewport', visible)
                    if width == 1440:
                        snap('hero1440')
                    if width == 390:
                        snap('mobile390')
                    evidence.append(sizes)
                page.set_viewport_size({'width': 1440, 'height': 1000})
                return evidence
            check('white_responsive_hero_and_video_widths', responsive)

            def collections():
                for project in data['projects']:
                    trigger = page.locator(f'[data-work="{project["id"]}"]')
                    trigger.scroll_into_view_if_needed()
                    before = raw('scrollY')
                    trigger.click()
                    page.locator('#collection-dialog').wait_for(state='visible')
                    source_is('#active-product-image', project['cover'])
                    thumbs = page.locator('#product-thumbnails [data-photo]')
                    require(thumbs.count() == len(project['images']), 'All collection thumbnails', project['id'])
                    for index, filename in enumerate(project['images']):
                        thumbs.nth(index).click()
                        source_is('#active-product-image', filename)
                        require(thumbs.nth(index).get_attribute('aria-current') == 'true', 'Selected thumbnail hook')
                    page.keyboard.press('ArrowRight')
                    source_is('#active-product-image', project['images'][0])
                    page.keyboard.press('ArrowLeft')
                    source_is('#active-product-image', project['images'][-1])
                    page.locator('#active-image-zoom').click()
                    page.locator('#lightbox').wait_for(state='visible')
                    source_is('#lightbox-image', project['images'][-1])
                    page.keyboard.press('Escape')
                    page.locator('#lightbox').wait_for(state='hidden')
                    require(page.locator('#collection-dialog').is_visible(), 'Nested zoom returns to collection')
                    page.locator('#collection-close').click()
                    restored(before)
                return {'images_checked_in_order': 23, 'keyboard_wrap_and_nested_zoom': True}
            check('collections_thumbnails_keyboard_zoom_scroll_restore', collections)

            def aplus():
                details = []
                for index, work in enumerate(data['aplusWorks']):
                    selector = f'.aplus-preview[data-aplus="{index}"]'
                    scroll(selector)
                    source_is(selector + ' img', work['cover'])
                    require(raw(f'''(()=>{{const b=document.querySelector({json.dumps(selector)});return [...b.closest('.aplus-item').querySelectorAll('details')].every(d=>!d.open)}})()'''), 'A+ defaults to cover with collapsed detail', work['title'])
                    before = raw('scrollY')
                    page.locator(selector).click()
                    page.locator('#lightbox').wait_for(state='visible')
                    source_is('#lightbox-image', work['original'])
                    dimensions = raw("(()=>{const i=document.querySelector('#lightbox-image');return {width:i.naturalWidth,height:i.naturalHeight}})()")
                    require(dimensions == {'width': work['width'], 'height': work['height']}, 'A+ original dimensions', dimensions)
                    poll("!document.querySelector('#zoom-native').disabled", 'native zoom enabled')
                    page.locator('#zoom-native').click()
                    poll("(()=>{const i=document.querySelector('#lightbox-image');return i.getBoundingClientRect().width>=i.naturalWidth-2})()", 'A+ native pixel zoom')
                    snap(f'aplus-{index+1}')
                    page.keyboard.press('Escape')
                    page.locator('#lightbox').wait_for(state='hidden')
                    restored(before)
                    details.append(dimensions)
                return details
            check('aplus_default_cover_original_and_native_zoom', aplus)

            def tools():
                evidence = []
                for tool in data['tools']:
                    ident = tool['id']
                    page.locator('#tab-' + ident).click()
                    poll(f'document.querySelector("#tab-{ident}").getAttribute("aria-selected")==="true"&&document.querySelector("#tool-panel").getAttribute("aria-busy")==="false"', 'selected case ' + ident)
                    images = page.locator('#tool-panel img')
                    expected = [g['image'] for g in tool['gallery']]
                    require(images.count() == len(expected), 'Case image count', ident)
                    measurements = []
                    for index, filename in enumerate(expected):
                        image = images.nth(index)
                        image.scroll_into_view_if_needed()  # Trigger real lazy loading, never rewrite attributes.
                        poll(f'''(()=>{{const i=document.querySelectorAll('#tool-panel img')[{index}];return i.complete&&i.naturalWidth>0&&decodeURI(new URL(i.currentSrc||i.src).pathname).endsWith({json.dumps(filename)})}})()''', 'case ordered image ' + filename)
                        require(image.is_visible(), 'Case image visible', filename)
                        geometry = raw(f'''(()=>{{const i=document.querySelectorAll('#tool-panel img')[{index}],r=i.getBoundingClientRect(),s=getComputedStyle(i);return {{width:r.width,height:r.height,nw:i.naturalWidth,nh:i.naturalHeight,padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft].map(parseFloat),fit:s.objectFit}}}})()''')
                        ratio_error = abs((geometry['width']/geometry['height'])/(geometry['nw']/geometry['nh'])-1)
                        require(ratio_error < .015 and all(x == 0 for x in geometry['padding']), 'Original aspect ratio without image padding/letterboxing', {'file': filename, **geometry})
                        measurements.append(geometry)
                    require('我的工作' not in page.locator('#tool-panel').inner_text(), 'No 我的工作 in case', ident)
                    require(page.locator('#tool-contribution').count() == 0, 'Removed contribution hook', ident)
                    for selector in ['#tool-problem', '#tool-result']:
                        require(page.locator(selector).is_visible() and page.locator(selector).inner_text().strip(), 'Case text visible: ' + selector, ident)
                    evidence.append({'id': ident, 'images': expected, 'geometry': measurements})
                page.locator('#tab-aplus').click()
                poll('document.querySelector("#tab-aplus").getAttribute("aria-selected")==="true"&&document.querySelector("#tool-panel").getAttribute("aria-busy")==="false"', 'tools screenshot ready')
                scroll('#systems')
                snap('tools1440')
                return evidence
            check('six_cases_thirteen_ordered_uncropped_images', tools)

            def mobile_menu():
                page.set_viewport_size({'width': 390, 'height': 844})
                raw('scrollTo({top:0,behavior:"instant"})')
                menu = page.locator('#menu-toggle')
                require(menu.is_visible(), 'Mobile menu toggle visible')
                menu.click()
                require(menu.get_attribute('aria-expanded') == 'true', 'Menu expanded')
                nav = page.locator('#store-nav')
                require(nav.is_visible(), 'Mobile nav visible')
                require(all(a.is_visible() for a in nav.locator('a').all()), 'All mobile links visible')
                page.keyboard.press('Escape')
                require(menu.get_attribute('aria-expanded') == 'false', 'Escape closes mobile menu')
                restored(0)
                menu.click()
                nav.locator('a[href="#systems"]').click()
                poll('document.querySelector("#menu-toggle").getAttribute("aria-expanded")==="false"&&!document.body.classList.contains("modal-open")', 'link closes menu and unlocks scroll')
                poll('location.hash==="#systems"&&scrollY>0', 'mobile systems navigation')
                return True
            check('mobile_menu_escape_and_navigation', mobile_menu)

            def runtime_errors():
                require(not report['page_errors'] and not report['http_errors'], 'Browser runtime/HTTP errors',
                        {'page': report['page_errors'], 'http': report['http_errors']})
                # Chromium may cancel in-flight video range requests while switching films.
                unexpected = [r for r in report['request_failures'] if 'ERR_ABORTED' not in (r['error'] or '')]
                require(not unexpected, 'Unexpected failed requests', unexpected)
                return {'aborted_requests_recorded': len(report['request_failures'])}
            check('runtime_and_network_errors', runtime_errors)
            context.close()
            browser.close()
    except Exception as exc:
        report['checks'].append({'name': 'setup_or_unhandled_error', 'status': 'failed',
                                 'error': str(exc), 'traceback': traceback.format_exc()})
        print(f'FAIL setup_or_unhandled_error: {exc}', flush=True)
    finally:
        report['status'] = 'failed' if any(x['status'] == 'failed' for x in report['checks']) else 'passed'
        (OUT / 'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps({'status': report['status'], 'results': str(OUT / 'results.json')}, ensure_ascii=False))
    return 0 if report['status'] == 'passed' else 1


if __name__ == '__main__':
    raise SystemExit(main())
