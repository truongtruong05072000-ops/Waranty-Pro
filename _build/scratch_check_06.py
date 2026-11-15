import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
if m:
    orders = json.loads(m.group(1))
    for o in orders:
        if '261106' in o.get('code', ''):
            print(f"code: {o.get('code')}, dms_ro_code: {o.get('dms_ro_code')}, status: {o.get('status')}, vf_category: {o.get('vf_category')}")
