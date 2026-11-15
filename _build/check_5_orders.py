import io, json, re

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);\s*\n', text, re.DOTALL)
orders = json.loads(m.group(1))

def norm(s):
    if not s: return ''
    import unicodedata
    s = unicodedata.normalize('NFD', str(s))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.lower().strip()

for i, o in enumerate(orders):
    if o.get('code') in ['N54511-261103-002', 'N54511-261102-015', 'N54511-261102-014', 'N54511-261030-010', 'N54511-261030-004']:
        print('Order:', o.get('code'))
        print('  service_type:', o.get('service_type'))
        print('  warranty_status:', o.get('warranty_status'))
        print('  dms_warranty_code:', o.get('dms_warranty_code'))
        print('  dms_claim_code:', o.get('dms_claim_code'))
        print('  warranty_kinds:', o.get('warranty_kinds'))
        print('  parts_removed_at:', o.get('parts_removed_at'))
        print('  motor_removed_at:', o.get('motor_removed_at'))
        print('  battery_serial_old:', o.get('battery_serial_old'))
        print('  motor_serial_old:', o.get('motor_serial_old'))
        print('  status:', o.get('status'))
        print('---')
