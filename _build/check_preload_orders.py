with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re, json
# Find SERVICEOS_PRELOAD_ORDERS
m = re.search(r'const SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);', text, re.DOTALL)
if m:
    try:
        orders = json.loads(m.group(1))
        print(f'Found {len(orders)} preloaded orders')
        statuses = set(o.get('status') or (o.get('work_order') and o.get('work_order', {}).get('status')) for o in orders)
        print('Statuses in preload:', statuses)
    except Exception as e:
        print('JSON parse error:', e)
else:
    print('SERVICEOS_PRELOAD_ORDERS regex not found')
