import sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

idx = c.find("id: 'diag'")
print(c[idx:idx+400])
