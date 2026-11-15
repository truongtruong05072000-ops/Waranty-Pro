import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract SERVICEOS_PRELOAD_ORDERS
m = re.search(r'const SERVICEOS_PRELOAD_ORDERS = (\[.*?\]);', text, re.DOTALL)
orders = json.loads(m.group(1))

def format_dealer_portal_wo(raw_wo, dms_ro, code, work_order_number=None):
    if work_order_number and '-WO-' in str(work_order_number):
        return str(work_order_number).strip()
    if dms_ro and '-WO-' in str(dms_ro):
        return str(dms_ro).strip()
    if raw_wo and '-WO-' in str(raw_wo):
        return str(raw_wo).strip()
    cand = str(dms_ro or work_order_number or raw_wo or code or '').strip()
    m = re.match(r'^([A-Z0-9]+)-([0-9]{6})-([0-9]+)$', cand, re.I)
    if m:
        dealer, dt, seq = m.groups()
        return f"{dealer.upper()}-WO-{dt}-{seq.zfill(4)}"
    m2 = re.match(r'^([A-Z0-9]+)[-_]?WO[-_]?([0-9]{6})[-_]?([0-9]+)$', cand, re.I)
    if m2:
        dealer, dt, seq = m2.groups()
        return f"{dealer.upper()}-WO-{dt}-{seq.zfill(4)}"
    return cand or '—'

results = []
for i, o in enumerate(orders):
    formatted_wo = format_dealer_portal_wo(o.get('wo'), o.get('dms_ro_code'), o.get('code'))
    results.append({
        'orig_code': o.get('code'),
        'dms_ro': o.get('dms_ro_code'),
        'dealer_wo': formatted_wo
    })

print(f"Total checked: {len(results)}")
has_wo_tag = [r for r in results if '-WO-' in r['dealer_wo']]
print(f"Has -WO- tag: {len(has_wo_tag)} / {len(results)}")
for r in results[:15]:
    print(f"Orig: {r['orig_code']:20} | DMS: {str(r['dms_ro']):25} => Dealer Portal WO: {r['dealer_wo']}")
