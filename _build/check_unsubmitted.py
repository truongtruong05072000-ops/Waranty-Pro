import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);', content, re.DOTALL)
orders = json.loads(m.group(1))

unsubmitted = 0
for o in orders:
    faults = o.get('faults') or []
    has_fault = len(faults) > 0
    claim_code = o.get('claimCode') or o.get('claim_code') or ''
    has_claim = bool(claim_code and claim_code != '—' and claim_code.startswith('WC-'))
    
    # Check warranty payment classification
    pt = str(o.get('paymentType') or o.get('payment_type') or o.get('phanLoaiTt') or '').lower()
    is_warranty = 'bao hanh' in pt or 'bh' in pt or 'warranty' in pt or has_fault
    if is_warranty and not has_claim:
        unsubmitted += 1

print(f"Total orders: {len(orders)}, Unsubmitted warranty claims: {unsubmitted}")
