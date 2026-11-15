import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# Look for statuses list or map
for m in re.finditer(r'(?:statuses|WO_STATUS|active_statuses|ACTIVE)', c):
    start = max(0, m.start() - 100)
    end = min(len(c), m.end() + 100)
    print(c[start:end])
    print('-'*50)
