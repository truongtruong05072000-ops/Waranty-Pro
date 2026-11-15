import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

for fname in ['_build/serviceos_core.js', '_build/serviceos_wodetail.js', '_build/serviceos_workorders.js']:
    with open(fname, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    idx = c.find('function warrantyKindsOf(')
    if idx != -1:
        print(f"=== Found in {fname} ===")
        print(c[idx:idx+2000])
