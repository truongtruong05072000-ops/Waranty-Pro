with open(r'_build\serviceos_core.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
idx = text.find('async function api(')
if idx == -1:
    idx = text.find('function api(')
if idx == -1:
    idx = text.find('const api =')

print('api index:', idx)
print(text[idx:idx+1200].encode('ascii', errors='replace').decode('ascii'))
