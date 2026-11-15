import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
orders = json.loads(m.group(1))

def format_dealer_wo(raw_wo, dms_ro, code):
    if dms_ro and '-WO-' in str(dms_ro):
        return str(dms_ro).strip()
    if raw_wo and '-WO-' in str(raw_wo):
        return str(raw_wo).strip()
    cand = str(raw_wo or code or dms_ro or '').strip()
    m = re.match(r'^([A-Z0-9]+)-([0-9]{6})-([0-9]+)$', cand, re.I)
    if m:
        dealer, dt, seq = m.groups()
        return f"{dealer.upper()}-WO-{dt}-{seq.zfill(4)}"
    return cand or '—'

print(f"Total orders: {len(orders)}")
for i, o in enumerate(orders[:10]):
    old_wo = o.get('code')
    new_wo = format_dealer_wo(o.get('wo'), o.get('dms_ro_code'), o.get('code'))
    print(f"[{i+1}] Old: {old_wo} | dms_ro_code: {o.get('dms_ro_code')} => New Dealer WO: {new_wo}")
