import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('function normalizeOrder(')
idx_end = content.find('return order;\n}', idx)
print(content[idx_end-800:idx_end+50])
