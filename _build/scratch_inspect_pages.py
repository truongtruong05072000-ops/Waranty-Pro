# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/work-order', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    html = res.read().decode('utf-8', errors='ignore')

# find buildId and page chunk
m = re.search(r'"buildId":"([^"]+)"', html)
if m:
    print('buildId:', m.group(1))

# Find script tags
scripts = re.findall(r'<script[^>]+src="([^"]+)"', html)
print('Scripts count:', len(scripts))
for s in scripts:
    if 'pages' in s or 'escooter' in s or 'work-order' in s:
        print('Page script:', s)
