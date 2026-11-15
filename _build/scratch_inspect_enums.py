# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/work-order', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    html = res.read().decode('utf-8', errors='ignore')

scripts = re.findall(r'<script[^>]+src="([^"]+)"', html)

for s in scripts:
    url = 'https://dealer-portal.vinfast.com' + s
    try:
        creq = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(creq, context=ctx, timeout=5) as cres:
            js = cres.read().decode('utf-8', errors='ignore')
            if 'LINE_ITEMS' in js or 'part-line-items' in js:
                # search for keys in object around it
                m = re.findall(r'(\b[a-zA-Z0-9_]+(?::\s*["\'](?:CUSTOMER|WARRANTY|DEALER|INTERNAL|INSURANCE)["\']|\s*===\s*["\'](?:CUSTOMER|WARRANTY)["\']))', js)
                if m:
                    print(f"Chunk {s} enum comparisons:", set(m))
    except Exception as e:
        pass
