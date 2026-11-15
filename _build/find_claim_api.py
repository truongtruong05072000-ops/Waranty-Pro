# -*- coding: utf-8 -*-
import urllib.request, ssl, re

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/warranty-claim', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    html = res.read().decode('utf-8', errors='ignore')

chunks = list(set(re.findall(r'/_next/static/chunks/[a-zA-Z0-9_\-]+\.js', html)))
print('Total chunks:', len(chunks))

for c in chunks:
    url = 'https://dealer-portal.vinfast.com' + c
    try:
        creq = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(creq, context=ctx, timeout=5) as cres:
            js = cres.read().decode('utf-8', errors='ignore')
            if 'warrantyClaimNumber' in js:
                print('FOUND in chunk:', c)
                apis = re.findall(r'["\']([a-zA-Z0-9_\-/]*warranty-claim[a-zA-Z0-9_\-/]*)["\']', js)
                print('  APIs with warranty-claim:', set(apis))
                endpoints = re.findall(r'["\'](/[a-zA-Z0-9_\-]+/[a-zA-Z0-9_\-/]+)["\']', js)
                for ep in set(endpoints):
                    if 'aftersales' in ep or 'escooter' in ep or 'claim' in ep:
                        print('  Relevant endpoint:', ep)
    except Exception:
        pass
