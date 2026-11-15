import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
orders = json.loads(m.group(1))

print(f"Total preload orders: {len(orders)}")

for i, o in enumerate(orders[:20]):
    code = o.get('code')
    dms_ro = o.get('dms_ro_code')
    st = o.get('status')
    service_type = o.get('service_type')
    symptoms = o.get('symptoms')
    kinds = o.get('warranty_kinds')
    parts = o.get('parts')
    cust_amt = o.get('cust_pay_amount')
    gsm_amt = o.get('gsm_pay_amount')
    quote_amt = o.get('quote_amount')
    dms_warranty_code = o.get('dms_warranty_code')
    print(f"[{i+1}] {code} | dms_ro: {dms_ro} | st: {st} | type: {service_type} | sym: {symptoms} | kinds: {kinds} | cust: {cust_amt} | gsm: {gsm_amt} | quote: {quote_amt} | dms_bh: {dms_warranty_code}")
