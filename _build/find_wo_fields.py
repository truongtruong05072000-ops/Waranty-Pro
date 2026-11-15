import sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

print('Searching /api/work-orders rendering in serviceos_workorders.js...')
for term in ['faults', 'warranty_status', 'battery_serial', 'motor_serial', 'warranty_kinds']:
    matches = [m.start() for m in re.finditer(re.escape(term), c)]
    print(f'Matches for {term}: {len(matches)}')
    for idx in matches[:2]:
        print('  ...', c[max(0, idx-60):min(len(c), idx+140)].replace('\n', ' '), '...')
