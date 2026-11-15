import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_50_cars.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Type of data:', type(data))
if isinstance(data, list):
    print('Total items:', len(data))
    print('Keys of item 0:', list(data[0].keys()))
    statuses = set(d.get('status') for d in data)
    print('Statuses:', statuses)
    branches = set(d.get('branch_id') for d in data)
    print('Branches:', branches)
elif isinstance(data, dict):
    print('Keys of dict:', list(data.keys()))
    rows = data.get('rows') or data.get('items') or []
    print('Rows length:', len(rows))
    if rows:
        print('Keys of row 0:', list(rows[0].keys()))
        statuses = set(d.get('status') for d in rows)
        print('Statuses:', statuses)
        branches = set(d.get('branch_id') for d in rows)
        print('Branches:', branches)
