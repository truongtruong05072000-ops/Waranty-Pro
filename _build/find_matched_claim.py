import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('function normalizeOrder(')
idx_co = content.find('const order = {', idx)
print(content[idx:idx+4500])
