# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
url = 'https://dealer-portal.vinfast.com/_next/static/chunks/42zhh_-ic7749.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    js = res.read().decode('utf-8', errors='ignore')

print('Chunk length:', len(js))

# Let's search for "công việc" and "phụ tùng"
for kw in ['công việc', 'phụ tùng', 'vật tư', 'thanh toán', 'quyết toán']:
    for m in re.finditer(re.escape(kw), js, re.I):
        p = m.start()
        print(f"=== Keyword: {kw} at {p} ===")
        print(js[max(0, p-120):min(len(js), p+250)])
        print()
