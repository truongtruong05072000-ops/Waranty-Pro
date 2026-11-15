import io, json, re

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);\s*\n', text, re.DOTALL)
orders = json.loads(m.group(1))
for o in orders[:5]:
    wo = o.get('work_order') or o
    print('Order:', wo.get('code') or wo.get('wo'), '| status:', o.get('status'), '| status_label:', o.get('status_label'), '| phanLoaiTt:', o.get('phanLoaiTt') or o.get('payment_type'))
