with open(r'_build\serviceos_shell.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
idx = text.find('/api/auth/login')
print('Index of /api/auth/login:', idx)
print(text[max(0, idx-300):min(len(text), idx+1000)].encode('ascii', errors='replace').decode('ascii'))
