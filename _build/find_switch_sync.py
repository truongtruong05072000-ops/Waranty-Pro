with open('PhanTichBaoHanh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
for m in re.finditer(r'switchSyncTab', text):
    idx = m.start()
    print('match at', idx, ':', text[max(0, idx-50):min(len(text), idx+150)].replace('\n', ' '))
