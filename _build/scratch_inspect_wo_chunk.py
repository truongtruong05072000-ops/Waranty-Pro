# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/work-order', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    html = res.read().decode('utf-8', errors='ignore')

chunks = list(set(re.findall(r'/_next/static/chunks/[a-zA-Z0-9_\-]+\.js', html)))

for c in chunks:
    chunk_url = 'https://dealer-portal.vinfast.com' + c
    try:
        creq = urllib.request.Request(chunk_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(creq, context=ctx, timeout=5) as cres:
            js = cres.read().decode('utf-8', errors='ignore')
            if 'work-order' in js or 'workOrder' in js:
                apis = re.findall(r'["\'](/api/[^"\']+)["\']', js)
                if apis:
                    print(f"Chunk {c} APIs:", set(apis))
                # Look for payment type / vat tu / cong viec / labor / part
                tokens = re.findall(r'([a-zA-Z0-9_]*(?:payment|labor|sparePart|material|settlement)[a-zA-Z0-9_]*)', js, re.I)
                if tokens:
                    print(f"Chunk {c} tokens:", set(tokens[:10]))
    except Exception as e:
        pass
