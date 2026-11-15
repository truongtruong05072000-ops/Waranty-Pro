# -*- coding: utf-8 -*-
import json
import re
import sys

# Load 100 claims
with open('_build/user_dealer_claims.json', 'r', encoding='utf-8') as f:
    claims_data = json.load(f)
claims = claims_data.get('data', [])
print(f"Loaded {len(claims)} claims from Dealer Portal.")

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Embed DEALER_PORTAL_PRELOAD_CLAIMS into JS
claims_json_str = json.dumps(claims, ensure_ascii=False)
preload_code = f"const DEALER_PORTAL_PRELOAD_CLAIMS = {claims_json_str};\n"

# Check if already present or insert before SERVICEOS_PRELOAD_ORDERS
if 'const DEALER_PORTAL_PRELOAD_CLAIMS =' in content:
    content = re.sub(r'const DEALER_PORTAL_PRELOAD_CLAIMS = .*?;\n', preload_code, content, count=1, flags=re.DOTALL)
else:
    content = content.replace('const SERVICEOS_PRELOAD_ORDERS =', preload_code + 'const SERVICEOS_PRELOAD_ORDERS =')

print("Embedded DEALER_PORTAL_PRELOAD_CLAIMS successfully.")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated _build/app_template2.html")
