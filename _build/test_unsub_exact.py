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
    if raw and isinstance(raw, dict):
        if raw.get('completed_at') or raw.get('settlement_date') or raw.get('settled_at') or raw.get('repair_done_at') or raw.get('delivered_at'):
            return True
    if not st: return False
    s = norm(st)
    return any(k in s for k in ['quyet toan', 'hoan thanh', 'giao xe', 'thanh toan', 'nghiem thu', 'waiting_approval', 'settled', 'settlement', 'completed', 'closed', 'paid', 'waiting_payment', 'delivered', 'repair_done'])

unsub = []
for i, o in enumerate(orders):
    st = o.get('status')
    claim_code = o.get('dms_claim_code') or o.get('claimCode') or ''
    # hasBangCapNhat
    has_bang = bool(o.get('battery_serial_old') or o.get('motor_serial_old') or o.get('parts_removed_at') or o.get('motor_removed_at') or o.get('dms_warranty_code') or o.get('warranty_status') in ['waiting_motor', 'waiting_battery'])
    kinds = o.get('warranty_kinds') or []
    bh_code = o.get('dms_warranty_code') or o.get('bhCode') or ''
    w_status = o.get('warranty_status') or ''
    is_warranty = has_bang or bool(kinds) or ('bao hanh' in norm(str(o.get('service_type') or ''))) or bool(bh_code and bh_code != '—') or bool(w_status and w_status != '—')
    is_settled = is_settled_or_higher(st, o)
    has_wc = bool(claim_code and claim_code.startswith('WC-'))
    if is_warranty and is_settled and not has_wc:
        unsub.append({
            'wo': o.get('code') or o.get('wo'),
            'plate': o.get('plate'),
            'vin': o.get('vin'),
            'customer': o.get('customer_name'),
            'status': st
        })

print(f'Total unsubmitted warranty orders detected: {len(unsub)}')
for u in unsub:
    print(' ', u)
