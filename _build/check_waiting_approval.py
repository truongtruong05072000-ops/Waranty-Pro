import io, json, re

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);\s*\n', text, re.DOTALL)
orders = json.loads(m.group(1))
for o in orders:
    if o.get('status') == 'waiting_approval':
        print('waiting_approval sample keys:', list(o.keys()))
        print('sample:', {k: o[k] for k in ['status', 'dms_ro_code', 'customer_name', 'technician_name', 'warranty_status'] if k in o})
        break
