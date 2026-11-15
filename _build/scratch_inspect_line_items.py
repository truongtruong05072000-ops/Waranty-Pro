# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
url = 'https://dealer-portal.vinfast.com/_next/static/chunks/3njhf34t-vict.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    js = res.read().decode('utf-8', errors='ignore')

for m in re.finditer(re.escape('line-items'), js):
    p = m.start()
    print(f"Match at {p}:")
    print(js[max(0, p-60):min(len(js), p+250)])
    print()
