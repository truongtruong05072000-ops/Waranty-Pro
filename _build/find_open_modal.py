import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
for m in re.finditer(r'openBookmarkletModal', text):
    idx = m.start()
    print('match at', idx, ':', text[max(0, idx-40):min(len(text), idx+120)].replace('\n', ' '))
