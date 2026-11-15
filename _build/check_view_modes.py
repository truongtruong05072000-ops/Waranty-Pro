import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/renderCheckXe_full.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re
print("Length of renderCheckXe:", len(code))

# Find viewMode check
for m in re.finditer(r'viewMode', code):
    print(f"viewMode at {m.start()}: {code[m.start()-50:m.start()+150]}")
    print("-" * 40)
