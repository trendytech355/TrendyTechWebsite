"""Refresh public store links and artwork. Existing assets survive lookup failures."""
import json, pathlib, urllib.request, urllib.parse, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
catalog = ROOT / 'data/projects.json'
projects = json.loads(catalog.read_text())
def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=25).read()
def save_asset(url, slug, filename):
    path = ROOT / 'assets/projects' / slug / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    content = fetch(url)
    path.write_bytes(content)
    return '/' + str(path.relative_to(ROOT))
for project in projects:
    slug = project['slug']
    try:
        result = json.loads(fetch('https://itunes.apple.com/lookup?' + urllib.parse.urlencode({'bundleId':project['iosBundleId'],'country':'us'})))
        apps = [a for a in result.get('results',[]) if a.get('bundleId') == project['iosBundleId']]
        if apps:
            app = apps[0]
            project['stores']['ios'] = app['trackViewUrl']
            project['icon'] = save_asset(app['artworkUrl512'],slug,'icon.jpg')
            screenshots = app.get('screenshotUrls') or app.get('ipadScreenshotUrls',[])
            images = [save_asset(url,slug,f'ios-{i+1}.jpg') for i,url in enumerate(screenshots[:6])]
            if images:
                project['screenshots'] = images
            print(slug + ': refreshed App Store assets')
        else:
            print(slug + ': no public US App Store listing; retained existing assets')
    except Exception as e:
        print(slug + ': App Store lookup failed; retained existing assets (' + str(e) + ')')
    try:
        url = 'https://play.google.com/store/apps/details?' + urllib.parse.urlencode({'id':project['androidPackage'],'hl':'en','gl':'US'})
        html = fetch(url).decode('utf-8')
        if 'og:title' in html and project['androidPackage'] in html:
            project['stores']['android'] = url
            # Use the listing's explicit app image, never unrelated page graphics.
            match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
            if match:
                project['androidIcon'] = save_asset(match.group(1),slug,'android-icon.jpg')
                if not project['stores'].get('ios'):
                    project['icon'] = project['androidIcon']
            print(slug + ': verified Google Play listing')
    except Exception as e:
        print(slug + ': Google Play listing unavailable; retained saved links (' + str(e) + ')')
catalog.write_text(json.dumps(projects,indent=2)+'\n')
