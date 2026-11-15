# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
url = 'https://dealer-portal.vinfast.com/_next/static/chunks/3njhf34t-vict.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
    js = res.read().decode('utf-8', errors='ignore')

# Search for line-item schemas or keys
for kw in ['paymentType', 'payer', 'isWarranty', 'warrantyType', 'chargeTo', 'billTo', 'paidBy', 'payment_type', 'itemType', 'workType']:
    matches = list(re.finditer(re.escape(kw), js, re.I))
    if matches:
        print(f"Key '{kw}': {len(matches)} matches")
        for m in matches[:3]:
            p = m.start()
            print(f"  [{p}]: {js[max(0, p-60):min(len(js), p+120)]}")
