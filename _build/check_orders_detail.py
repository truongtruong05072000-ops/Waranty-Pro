import io, json, re

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SERVICEOS_PRELOAD_ORDERS\s*=\s*(\[.*?\]);\s*\n', text, re.DOTALL)
if m:
    orders = json.loads(m.group(1))
    print(f'Total preloaded orders: {len(orders)}')
    statuses = {}
    for o in orders:
        wo = o.get('work_order') or o
        st = wo.get('status') or o.get('status')
        statuses[st] = statuses.get(st, 0) + 1
    print('Statuses distribution in SERVICEOS_PRELOAD_ORDERS:')
    for st, count in statuses.items():
        print(f'  {st}: {count}')
else:
    print('Not found')
