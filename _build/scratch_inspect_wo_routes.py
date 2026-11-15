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
            # Look for api endpoints containing work-order
            m = re.findall(r'["\'](/[^"\']*work-order[^"\']*)["\']', js, re.I)
            if m:
                print(f"Chunk {s}:", set(m))
            # Also search for 'paymentType' or 'labor'
            m2 = re.findall(r'["\']([^"\']*(?:paymentType|laborType|settlementType)[^"\']*)["\']', js, re.I)
            if m2:
                print(f"  Chunk {s} paymentTypes:", set(m2))
    except Exception as e:
        pass
