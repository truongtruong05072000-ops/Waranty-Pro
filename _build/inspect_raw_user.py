import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_raw_user_input.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

if isinstance(data, dict):
    rows = data.get('rows') or []
    print('Total rows in raw_user_input:', len(rows))
    print('data["total"]:', data.get('total'))
    plates = [r.get('plate') for r in rows if r.get('plate')]
    print('Unique plates:', len(set(plates)))
    # Are there duplicate plates or duplicate codes?
    codes = [r.get('code') for r in rows if r.get('code')]
    print('Unique codes:', len(set(codes)))
    branches = set(r.get('branch_id') for r in rows)
    print('Branches:', branches)
    statuses = set(r.get('status') for r in rows)
    print('Statuses:', statuses)
