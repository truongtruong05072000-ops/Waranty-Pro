import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
orders = json.loads(m.group(1))

# Let's test the new logic
unsub_warranty = []
unsub_customer = []

for o in orders:
    stype = str(o.get('service_type') or '').lower()
    has_explicit_doc = bool(o.get('dms_warranty_code') or o.get('dms_claim_code'))
    is_warranty = (stype == 'warranty' or has_explicit_doc)
    
    # Check settled status
    st = str(o.get('status') or '').lower()
    is_settled = any(k in st for k in ['settled', 'waiting_approval', 'completed', 'paid', 'closed', 'waiting_payment'])
    
    claim_code = o.get('dms_claim_code')
    has_claim = bool(claim_code and str(claim_code).startswith('WC-'))
    
    if is_warranty and is_settled and not has_claim:
        unsub_warranty.append(o)
    elif not is_warranty:
        unsub_customer.append(o)

print(f"Total orders: {len(orders)}")
print(f"Unsubmitted Warranty orders (Cần làm ĐXBH): {len(unsub_warranty)}")
for o in unsub_warranty:
    print(f"  WO: {o.get('code')} | dms_ro: {o.get('dms_ro_code')} | status: {o.get('status')} | symptoms: {o.get('symptoms')} | kinds: {o.get('warranty_kinds')}")

print(f"\nCustomer-paid orders (KHÔNG phải bảo hành): {len(unsub_customer)}")
for o in unsub_customer[:5]:
    print(f"  WO: {o.get('code')} | status: {o.get('status')} | quote: {o.get('quote_amount')} | type: {o.get('service_type')}")
