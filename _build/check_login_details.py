with open(r'_build\serviceos_shell.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# check login submission details
idx = text.find("onGlobal('submit', 'login'")
print('Login handler:')
print(text[idx:idx+800].encode('ascii', errors='replace').decode('ascii'))
