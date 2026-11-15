# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/warranty-claim', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
        html = res.read().decode('utf-8', errors='ignore')

    chunks = list(set(re.findall(r'/_next/static/chunks/[a-zA-Z0-9_\-]+\.js', html)))
    print('Total chunks found:', len(chunks))

    for c in chunks:
        chunk_url = 'https://dealer-portal.vinfast.com' + c
        try:
            creq = urllib.request.Request(chunk_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(creq, context=ctx, timeout=5) as cres:
                js = cres.read().decode('utf-8', errors='ignore')
                # search for terms
                if any(w in js for w in ['labor', 'material', 'spare-part', 'work-order', 'payment-type', 'paymentType']):
                    print('Relevant chunk:', c)
                    matches = re.findall(r'["\'](/api/[^"\']+)["\']', js)
                    if matches:
                        print('  APIs:', set(matches))
                    matches2 = re.findall(r'([a-zA-Z0-9_]*payment[a-zA-Z0-9_]*)', js, re.I)
                    if matches2:
                        print('  Payment tokens:', set(matches2[:10]))
        except Exception as e:
            pass
except Exception as e:
    print('Error accessing dealer portal:', e)
