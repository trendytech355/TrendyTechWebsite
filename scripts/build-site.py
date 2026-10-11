"""Generate category, home, and support pages from data/projects.json."""
import json, pathlib, html, xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parent.parent
projects=json.loads((ROOT/'data/projects.json').read_text())
def esc(v): return html.escape(str(v),quote=True)
def page(title,body):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="TrendyTech develops indie mobile games and simple applications for Android and iOS."><title>{esc(title)} | TrendyTech</title><link rel="stylesheet" href="/assets/css/website.css"></head><body><header class="header"><a class="brand" href="/">Trendy<span>Tech</span><small>Independent ideas. Everyday enjoyment.</small></a><nav aria-label="Main navigation"><a href="/games/">Games</a><a href="/apps/">Applications</a><a href="/support/">Support</a></nav></header><main>{body}</main><footer><a class="brand" href="/">TrendyTech</a><p>Indie games and simple mobile applications.</p><nav aria-label="Footer"><a href="/games/">Games</a><a href="/apps/">Applications</a><a href="/support/">Support</a><a href="/tools/campaign-insights-connector/">Campaign Insights</a></nav><p>© 2026 TrendyTech · Android &amp; iOS</p></footer></body></html>'''
def write(path,text):
    target=ROOT/path;target.parent.mkdir(parents=True,exist_ok=True)
    if path.endswith('index.html'):
        route='/' + path[:-10]
        text=text.replace('</head>',f'<link rel="canonical" href="https://trendytech.info{route}"></head>')
    target.write_text(text.replace('><','>\n<') + '\n')
write('index.html',page('Home','''<section class="hero"><p class="eyebrow">Independent mobile studio</p><h1>Small ideas.<br><span>Great experiences.</span></h1><p class="lead">We’re TrendyTech. We develop indie games and simple applications that bring a little more enjoyment and usefulness to everyday life.</p><p class="platforms">Made for Android and iOS</p></section><section class="categories" aria-label="Explore TrendyTech"><a class="category" href="/games/"><span class="symbol" aria-hidden="true">✦</span><p class="eyebrow">A moment of fun</p><h2>Games <span aria-hidden="true">↗</span></h2><p>Discover our mobile games, from thoughtful puzzles to lively action.</p><strong>Explore games →</strong></a><a class="category" href="/apps/"><span class="symbol" aria-hidden="true">◈</span><p class="eyebrow">A little more useful</p><h2>Applications <span aria-hidden="true">↗</span></h2><p>Explore simple mobile tools for reading, learning, and daily life.</p><strong>Explore applications →</strong></a></section><section class="contact"><h2>Made with care. Supported by people.</h2><p>Have a question about one of our projects?</p><a class="button secondary" href="/support/">Get support</a></section>'''))
for category,label,intro in [('games','Games','Find your next moment of fun.'),('apps','Applications','Useful companions for everyday life.')]:
    cards=[]
    for p in projects:
        if p['category']!=category:continue
        cards.append(f'''<article class="project"><img class="icon" src="{esc(p['icon'])}" alt="{esc(p['name'])} icon" width="96" height="96"><p class="eyebrow">Mobile { 'game' if category=='games' else 'application'}</p><h2>{esc(p['name'])}</h2><p>{esc(p['description'])}</p><a class="button" href="{esc(p['url'])}">Explore {'game' if category=='games' else 'application'} →</a><div class="links"><a href="{esc(p['about'])}">About</a><a href="{esc(p['privacy'])}">Privacy</a><a href="{esc(p['support'])}">Support</a></div></article>''')
    write(category+'/index.html',page(label,f'<section class="intro"><p class="eyebrow">TrendyTech · Android &amp; iOS</p><h1>{label}</h1><p class="lead">{intro}</p></section><section class="projects">'+''.join(cards)+'</section>'))
for p in projects:
    subject=__import__('urllib.parse',fromlist=['quote']).quote(p['name']+' support')
    body=f'''<section class="intro"><p class="eyebrow">{esc(p['name'])}</p><h1>How can we help?</h1><p class="lead">For questions, feedback, or help using {esc(p['name'])}, send us an email.</p></section><section class="support-panel"><h2>Contact TrendyTech</h2><p><a href="mailto:{p['email']}">{p['email']}</a></p><a class="button" href="mailto:{p['email']}?subject={subject}">Email support →</a><p>The button opens your email app. Include your device model, Android or iOS version, app version, and a short description of the issue. Please do not include passwords or personal API keys.</p><div class="links"><a href="{p['url']}">Project page</a><a href="{p['about']}">About</a><a href="{p['privacy']}">Privacy</a></div></section>'''
    write(p['support'].strip('/')+'/index.html',page(p['name']+' Support',body))
write('support/index.html',page('Support','<section class="intro"><p class="eyebrow">We’re here to help</p><h1>Support</h1><p class="lead">Choose your game or application to get help.</p></section><section class="projects">'+''.join(f'<a class="project" href="{p["support"]}"><h2>{esc(p["name"])}</h2><p>Email support →</p></a>' for p in projects)+'</section><section class="contact"><p>General enquiries: <a href="mailto:trendytech355@gmail.com">trendytech355@gmail.com</a></p></section>'))
# New projects receive a detail page automatically; existing pages are preserved.
for p in projects:
    target=ROOT/p['url'].strip('/')/'index.html'
    if not target.exists():
        detail=page(p['name'],f'<section class="intro"><p class="eyebrow">TrendyTech · Mobile</p><h1>{esc(p["name"])}</h1><p class="lead">{esc(p["description"])}</p></section>')
        detail=detail.replace('</head>','<link rel="stylesheet" href="/assets/css/project-details.css"><script defer src="/assets/project-details.js"></script></head>')
        write(p['url'].strip('/')+'/index.html',detail)
# Include every preserved HTML page as well as the generated routes.
urls=[]
for f in sorted(ROOT.rglob('*.html')):
    if '.git' in f.parts:continue
    rel=f.relative_to(ROOT).as_posix()
    route='/'+rel[:-10] if rel.endswith('index.html') else '/'+rel
    urls.append('https://trendytech.info'+route)
ns='http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('',ns);sitemap=ET.Element('{'+ns+'}urlset')
for url in urls:
    child=ET.SubElement(sitemap,'{'+ns+'}url');ET.SubElement(child,'{'+ns+'}loc').text=url
ET.ElementTree(sitemap).write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
print('Generated home, catalogs, support pages, and sitemap.')
