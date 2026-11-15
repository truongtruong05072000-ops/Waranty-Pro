import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

rows = data.get('rows') or []

def norm(s):
    import unicodedata
    if not s: return ''
    s = unicodedata.normalize('NFD', str(s))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.lower()

def classify_customer(r):
    name = r.get('customer_name') or ''
    source = r.get('source') or ''
    fleet = r.get('fleet') or ''
    adv_note = r.get('advisor_note') or ''
    full_str = norm(f"{name} {source} {fleet} {adv_note}")
    
    if 'bship' in full_str:
        return 'BSHIP'
    if 'gsm' in full_str or 'xanh sm' in full_str or 'thong minh' in full_str or source == 'gsm' or fleet == 'gsm':
        return 'GSM'
    if any(k in full_str for k in ['ahamove', 'lalamove', 'grab', 'be group']):
        return 'Đối tác'
    if any(k in full_str for k in ['cong ty', 'tnhh', 'cp ', 'chi nhanh']):
        return 'Doanh nghiệp'
    return 'Khách lẻ'

counts = {}
for r in rows:
    grp = classify_customer(r)
    counts[grp] = counts.get(grp, 0) + 1

print('Customer classification on 50 cars:')
for k, v in sorted(counts.items(), key=lambda x: -x[1]):
    print(f'  {k}: {v}')
