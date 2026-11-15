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

def is_settled_or_higher(st, raw):
    if raw:
        if raw.get('completed_at') or raw.get('settlement_date') or raw.get('settled_at') or raw.get('repair_done_at') or raw.get('delivered_at'):
            return True
    if not st: return False
    s = norm(st)
    return any(k in s for k in ['quyet toan', 'hoan thanh', 'giao xe', 'thanh toan', 'nghiem thu', 'waiting_approval', 'settled', 'settlement', 'completed', 'closed', 'paid', 'waiting_payment', 'delivered'])

w_settled = []
for i, o in enumerate(orders):
    st = o.get('status')
    claim_code = o.get('dms_claim_code') or o.get('claimCode') or ''
    # is warranty payment?
    has_bang = bool(o.get('battery_serial_old') or o.get('motor_serial_old') or o.get('parts_removed_at') or o.get('motor_removed_at') or o.get('dms_warranty_code') or o.get('warranty_status') in ['waiting_motor', 'waiting_battery'])
    kinds = o.get('warranty_kinds') or []
    is_warranty = has_bang or bool(kinds) or 'bao hanh' in norm(str(o.get('service_type') or '')) or bool(o.get('dms_warranty_code'))
    is_settled = is_settled_or_higher(st, o)
    has_wc = bool(claim_code and claim_code.startswith('WC-'))
    if is_warranty and is_settled and not has_wc:
        w_settled.append((o.get('code') or o.get('wo'), o.get('plate'), st, o.get('customer_name')))

print(f'Found {len(w_settled)} warranty orders at settlement stage without WC:')
for item in w_settled:
    safe_item = [str(x).encode('ascii', 'replace').decode('ascii') for x in item]
    print(' ', safe_item)
