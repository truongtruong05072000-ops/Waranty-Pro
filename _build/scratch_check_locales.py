# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
url = 'https://dealer-portal.vinfast.com/locales/vi/common.json'
for path in ['/locales/vi/common.json', '/locales/vi/aftersales.json', '/static/locales/vi/common.json', '/_next/static/locales/vi/common.json', '/locales/vi/escooter.json']:
    try:
        req = urllib.request.Request('https://dealer-portal.vinfast.com' + path, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=5) as res:
            print(f"Path {path} returned {res.status}")
    except Exception as e:
        pass
