# -*- coding: utf-8 -*-
import urllib.request, ssl, re

ctx = ssl.create_default_context()
url = 'https://dealer-portal.vinfast.com/_next/static/chunks/1azzf9prgolug.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    js = res.read().decode('utf-8', errors='ignore')

print('Chunk length:', len(js))

for term in ['WARRANTY_CLAIMS', 'escooter', 'wcLimit', 'wcDatePreset']:
    print(f'=== Matches for {term} ===')
    for m in re.finditer(re.escape(term), js):
        p = m.start()
        print(js[max(0, p-100):min(len(js), p+250)])
