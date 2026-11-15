import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

m = re.search(r'hasBangCapNhat\s*=', c)
if m:
    start = max(0, m.start() - 1500)
    end = min(len(c), m.end() + 200)
    print(c[start:end])
