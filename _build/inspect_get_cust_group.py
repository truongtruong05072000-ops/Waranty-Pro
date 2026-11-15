import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

m = re.search(r'function getCustomerGroup\([^\)]*\)\s*\{([\s\S]*?)(?=\nfunction |\nwindow\.)', c)
if m:
    print('=== getCustomerGroup ===')
    print(m.group(0))
else:
    print('getCustomerGroup NOT found!')
