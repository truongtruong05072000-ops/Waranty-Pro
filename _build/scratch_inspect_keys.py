import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    text = f.read()

# find first 200 rows or all
# clean text if wrapped in <USER_REQUEST>
if '<USER_REQUEST>' in text:
    text = text.split('<USER_REQUEST>')[1]
if '</USER_REQUEST>' in text:
    text = text.split('</USER_REQUEST>')[0]

try:
    data = json.loads(text.strip())
    rows = data.get('rows') or []
    print(f'Total rows parsed: {len(rows)}')
    if rows:
        sample = rows[0]
        print('Sample keys:', list(sample.keys()))
        for k in sorted(sample.keys()):
            val = sample[k]
            if any(w in k.lower() for w in ['part', 'job', 'item', 'task', 'service', 'labor', 'pay', 'cust', 'gsm', 'type', 'kind', 'fault', 'warranty', 'dms']):
                print(f'  {k}: {val}')
except Exception as e:
    print('JSON parse error:', e)
