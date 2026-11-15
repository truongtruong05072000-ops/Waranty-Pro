import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# Look for normalizeOrder definition
m = re.search(r'function normalizeOrder\([^\)]*\)\s*\{([\s\S]*?)\n\}', c)
if m:
    print('=== normalizeOrder ===')
    print(m.group(0)[:2000])

# Look for checkStatus definition
m2 = re.search(r'function (?:determineCheckStatus|getCheckStatus|evaluateCheckStatus)\([^\)]*\)\s*\{([\s\S]*?)\n\}', c)
if m2:
    print('=== checkStatus func ===')
    print(m2.group(0)[:2000])
