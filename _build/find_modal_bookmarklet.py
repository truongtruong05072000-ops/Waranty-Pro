with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
idx = text.find('id="modalBookmarklet"')
print('modalBookmarklet idx:', idx)
print(text[idx:idx+3000].encode('ascii', errors='replace').decode('ascii'))
