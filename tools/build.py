#!/usr/bin/env python3
"""Assemble the static mock-up pages from src/.

The generated .html files are committed, so the mock-up still opens directly
in a browser. Run this script only after editing something in src/:

    python3 tools/build.py

Sources (one folder per language, en = root of the site, fr = fr/):
    src/_head.html             <head> shared by every page
    src/<lang>/_header.html    header.php
    src/<lang>/_footer.html    footer.php
    src/<lang>/_partners.html  partner logos section   -> {{PARTNERS}}
    src/<lang>/_offices.html   office directory        -> {{OFFICES}}
    src/<lang>/_network-map.html  offices network map  -> {{NETWORK_MAP}}, {{NETWORK_MAP_DARK}}
    src/<lang>/pages/*.html    <main> content of each page, starting with
                               <!--title: ...-->, <!--description: ...-->, <!--nav: ...-->
"""
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
LANGS = {'en': '', 'fr': 'fr'}          # language -> output folder
SKIP_LINK = {'en': 'Skip to content', 'fr': 'Aller au contenu'}
NAV_LINKS = ('home', 'news', 'careers', 'contact')
NAV_PANELS = ('services', 'solutions')


def read(*parts):
    with open(os.path.join(SRC, *parts), encoding='utf-8') as f:
        return f.read()


def page_href(lang, target_lang, name):
    """Relative link from a page in `lang` to the same page in `target_lang`."""
    if lang == target_lang:
        return name
    if target_lang == 'en':
        return '../' + name
    return LANGS[target_lang] + '/' + name


def build(lang, name):
    src = read(lang, 'pages', name)
    meta = dict(re.findall(r'<!--(\w+): (.*?)-->', src[:800]))
    main = re.sub(r'\A(?:<!--\w+: .*?-->\n)+', '', src).strip('\n')

    network_map = read(lang, '_network-map.html').strip()
    blocks = {
        '{{PARTNERS}}': read(lang, '_partners.html').strip(),
        '{{OFFICES}}': read(lang, '_offices.html').strip(),
        '{{NETWORK_MAP}}': network_map.replace('{{map_class}}', 'section-offices__map'),
        '{{NETWORK_MAP_DARK}}': network_map.replace('{{map_class}}', 'network-map--dark'),
    }
    for token, value in blocks.items():
        main = main.replace(token, value)

    header = read(lang, '_header.html').strip()
    for key in NAV_LINKS:
        header = header.replace('{{current:%s}}' % key, ' aria-current="page"' if meta.get('nav') == key else '')
    for key in NAV_PANELS:
        header = header.replace('{{current-class:%s}}' % key, ' site-nav__link--current' if meta.get('nav') == key else '')
    header = header.replace('{{href_en}}', page_href(lang, 'en', name))
    header = header.replace('{{href_fr}}', page_href(lang, 'fr', name))

    alternates = '\n  '.join(
        '<link rel="alternate" hreflang="%s" href="%s">' % (target, page_href(lang, target, name))
        for target in LANGS)
    head = (read('_head.html')
            .replace('{{lang}}', lang)
            .replace('{{title}}', html.escape(html.unescape(meta['title']), quote=False))
            .replace('{{description}}', html.escape(html.unescape(meta['description'])))
            .replace('{{alternates}}', alternates))

    out = (head + '<body>\n\n<a class="skip-link" href="#main">%s</a>\n\n' % SKIP_LINK[lang]
           + header + '\n\n<main id="main">\n\n' + main + '\n\n</main>\n\n'
           + read(lang, '_footer.html').strip() + '\n\n</body>\n</html>\n')

    leftover = re.findall(r'\{\{[^}]+\}\}', out)
    if leftover:
        raise SystemExit('%s/%s: unresolved %s' % (lang, name, leftover))

    if LANGS[lang]:
        # Pages in a sub-folder reach the shared assets one level up
        out = out.replace('src="assets/', 'src="../assets/').replace('href="assets/', 'href="../assets/')

    target_dir = os.path.join(ROOT, LANGS[lang])
    os.makedirs(target_dir, exist_ok=True)
    with open(os.path.join(target_dir, name), 'w', encoding='utf-8') as f:
        f.write(out)
    return os.path.join(LANGS[lang], name)


if __name__ == '__main__':
    for lang in LANGS:
        for name in sorted(os.listdir(os.path.join(SRC, lang, 'pages'))):
            print('built', build(lang, name))
