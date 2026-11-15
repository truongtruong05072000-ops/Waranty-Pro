# -*- coding: utf-8 -*-
import urllib.request, ssl, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
for path in ['/locales/vi/aftersales.json', '/locales/vi/escooter.json', '/locales/vi/common.json']:
    try:
        req = urllib.request.Request('https://dealer-portal.vinfast.com' + path, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=5) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"=== {path} (keys: {len(data)}) ===")
            for k, v in data.items():
                if any(w in str(v).lower() for w in ['thanh toán', 'bảo hành', 'khách hàng', 'công việc', 'vật tư', 'phụ tùng', 'quyết toán']):
                    if any(w in str(v).lower() for w in ['phân loại', 'công việc', 'vật tư', 'phụ tùng', 'line_item', 'part']):
                        print(f"  {k} -> {v}")
    except Exception as e:
        print(f"Error {path}:", e)
