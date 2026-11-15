import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

for m in re.finditer(r'hasBangCapNhat\s*=', c):
    start = max(0, m.start() - 200)
    end = min(len(c), m.end() + 300)
    print(c[start:end])
    print('='*50)
