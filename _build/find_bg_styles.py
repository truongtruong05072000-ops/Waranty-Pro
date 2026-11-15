with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find script 2
idx_s2 = text.find("<script>\n'use strict'")
s2 = text[idx_s2:]

# find styles in s2
styles = re.findall(r'style="([^"]*background[^"]*)"', s2)
print('Total background styles in JS:', len(styles))
for s in set(styles):
    print(' ', s)
