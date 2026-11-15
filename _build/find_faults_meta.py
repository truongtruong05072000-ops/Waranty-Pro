import sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

for fname in ['_build/serviceos_core.js', '_build/serviceos_wodetail.js', '_build/serviceos_workorders.js', '_build/serviceos_shell.js']:
    with open(fname, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    for m in re.finditer(r'settings\.faults', c):
        idx = m.start()
        print(f"=== Found in {fname} ===")
        print(c[idx-50:idx+300])
