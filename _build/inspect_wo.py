import sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

print('Searching /api/work-orders...')
for m in re.finditer(r'/api/work-orders[^\'"`\s]*', c):
    idx = m.start()
    print('Found query:', m.group(0))
    snippet = c[max(0, idx-100):min(len(c), idx+400)].replace('\n', ' ')
    print('Context:', snippet)
    print('-'*50)
