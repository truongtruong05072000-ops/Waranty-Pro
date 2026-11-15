import urllib.request, ssl, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
req = urllib.request.Request('https://dealer-portal.vinfast.com/dealer/aftersales/escooter/warranty-claim', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
        print('Status:', res.status)
        for h, v in res.getheaders():
            if 'csp' in h.lower() or 'content-security' in h.lower() or 'policy' in h.lower():
                print(f'{h}: {v}')
except Exception as e:
    print('Error:', e)
