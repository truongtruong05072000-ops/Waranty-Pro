import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('function normalizeOrder')
if idx != -1:
    print(content[idx+4000:idx+6500])
