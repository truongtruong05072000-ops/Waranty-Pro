# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/work-order', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    html = res.read().decode('utf-8', errors='ignore')

scripts = re.findall(r'<script[^>]+src="([^"]+)"', html)

all_apis = set()
for s in scripts:
    url = 'https://dealer-portal.vinfast.com' + s
    try:
        creq = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(creq, context=ctx, timeout=5) as cres:
            js = cres.read().decode('utf-8', errors='ignore')
            # Look for api endpoints
            apis = re.findall(r'["\'](/api/[a-zA-Z0-9_\-\/]+)["\']', js)
            all_apis.update(apis)
            # Look for keywords in vietnamese
            for kw in ['bảo hành', 'khách hàng', 'công việc', 'vật tư', 'phụ tùng', 'quyết toán']:
                if kw in js.lower():
                    print(f"Chunk {s} has keyword: {kw}")
    except Exception as e:
        pass

print('All APIs discovered:')
for a in sorted(all_apis):
    if any(w in a for w in ['order', 'claim', 'warranty', 'dealer', 'aftersales']):
        print(' ', a)
