import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

idx = c.find('w.faults.length ? w.faults.join(')
print(c[idx-200:idx+600])
