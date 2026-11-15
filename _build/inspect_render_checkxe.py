import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# Search for renderCheckXe definition
m = re.search(r'function renderCheckXe\([^\)]*\)\s*\{([\s\S]*?)(?=\nfunction |\nwindow\.)', c)
if m:
    print('=== renderCheckXe ===')
    print(m.group(0)[:3000])
