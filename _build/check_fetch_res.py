with open(r'_build\serviceos_core.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
idx = text.find("res = await fetch(url, opt);")
print('Fetch handling:')
print(text[idx:idx+1200].encode('ascii', errors='replace').decode('ascii'))
