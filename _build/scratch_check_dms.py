import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
if m:
    orders = json.loads(m.group(1))
    print('Total orders:', len(orders))
    with_dms = [o for o in orders if o.get('dms_ro_code')]
    print('Orders with dms_ro_code:', len(with_dms))
    for o in with_dms[:5]:
        print(f"code: {o.get('code')} -> dms_ro_code: {o.get('dms_ro_code')}")
