# -*- coding: utf-8 -*-
import urllib.request, ssl, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/locales/vi/common.json', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=5) as res:
    print(res.read()[:200])
