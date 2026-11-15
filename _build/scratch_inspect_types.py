import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
orders = json.loads(m.group(1))

warranty_orders = []
customer_orders = []

for o in orders:
    stype = str(o.get('service_type') or '').lower()
    kinds = o.get('warranty_kinds') or []
    has_dms_bh = bool(o.get('dms_warranty_code'))
    # A true warranty order must be service_type == 'warranty' OR have explicit warranty line items / kinds
    is_warranty = (stype == 'warranty' or has_dms_bh)
    if is_warranty:
        warranty_orders.append(o)
    else:
        customer_orders.append(o)

print(f"Total: {len(orders)} | Warranty orders: {len(warranty_orders)} | Customer orders: {len(customer_orders)}")
print("\n--- SAMPLE WARRANTY ORDERS ---")
for o in warranty_orders[:5]:
    print(f"  {o.get('code')} | {o.get('dms_ro_code')} | {o.get('status')} | {o.get('symptoms')} | kinds: {o.get('warranty_kinds')}")

print("\n--- SAMPLE CUSTOMER ORDERS ---")
for o in customer_orders[:5]:
    print(f"  {o.get('code')} | {o.get('dms_ro_code')} | {o.get('status')} | {o.get('symptoms')} | quote: {o.get('quote_amount')}")
