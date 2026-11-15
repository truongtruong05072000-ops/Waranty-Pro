# -*- coding: utf-8 -*-
import urllib.request, ssl, re

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/warranty-claim', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    html = res.read().decode('utf-8', errors='ignore')

chunks = list(set(re.findall(r'/_next/static/chunks/[a-zA-Z0-9_\-]+\.js', html)))
print('Total chunks found:', len(chunks))

found_apis = set()
for c in chunks:
    chunk_url = 'https://dealer-portal.vinfast.com' + c
    try:
        creq = urllib.request.Request(chunk_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(creq, context=ctx, timeout=5) as cres:
            js = cres.read().decode('utf-8', errors='ignore')
            if 'WARRANTY_CLAIMS' in js or 'warranty-claim' in js or 'aftersales' in js:
                print('Found relevant chunk:', c)
                # Find api strings
                apis = re.findall(r'["\'](/api/[^"\']+)["\']', js)
                found_apis.update(apis)
                # Find export / download strings
                exports = re.findall(r'["\']([^"\']*export[^"\']*)["\']', js)
                for exp in exports[:10]:
                    print('  export str:', exp)
    except Exception as e:
        pass

print('Found APIs:', found_apis)
