import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# search for branch_id or branch_code
for m in re.finditer(r'branch_id', c):
    start = max(0, m.start() - 50)
    end = min(len(c), m.end() + 50)
    print(c[start:end])
