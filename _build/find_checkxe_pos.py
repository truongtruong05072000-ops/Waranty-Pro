import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'checkxe', text, re.IGNORECASE)]
print('Matches for checkxe:', len(matches))
for pos in matches[:10]:
    print('pos', pos, ':', text[pos-30:pos+100].replace('\n', ' '))
