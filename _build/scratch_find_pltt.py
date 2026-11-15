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
            # Look for "Phân loại thanh toán" or payment type
            for kw in ['phân loại thanh toán', 'loại thanh toán', 'hình thức thanh toán', 'đối tượng thanh toán']:
                if kw in js.lower():
                    print(f"Chunk {s} matched '{kw}'!")
                    for m in re.finditer(re.escape(kw), js, re.I):
                        p = m.start()
                        print(' ', js[max(0, p-60):min(len(js), p+140)])
    except Exception as e:
        pass
