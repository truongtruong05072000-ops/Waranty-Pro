import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

rows = data.get('rows') or []
for i, r in enumerate(rows[:20]):
    print(f"#{i+1} plate:{r.get('plate')} source:{r.get('source')} fleet:{r.get('fleet')} cust_name:{r.get('customer_name')} advisor_note:{r.get('advisor_note')}")
