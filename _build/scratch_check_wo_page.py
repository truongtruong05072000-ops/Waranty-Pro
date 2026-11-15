# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/work-order', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
        print('HTTP status for /escooter/work-order:', res.status)
        html = res.read().decode('utf-8', errors='ignore')
        chunks = list(set(re.findall(r'/_next/static/chunks/[a-zA-Z0-9_\-]+\.js', html)))
        print('Chunks on work-order page:', len(chunks))
        for c in chunks[:5]:
            print(' ', c)
except Exception as e:
    print('Error on /escooter/work-order:', e)
